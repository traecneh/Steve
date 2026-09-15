const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>\s*(\/\* ----------- Service-area address helper[\s\S]*?)<\/script>/)[1];
const addressScript = script.split('/* ------------- Fade-in on scroll')[0];

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return {promise, resolve, reject};
}

function setup() {
  class Element {
    constructor() { this.value = ''; this.style = {}; this.hidden = true; this.children = []; this.events = {}; }
    set innerHTML(value) { this.html = value; this.children = []; }
    get innerHTML() { return this.html || ''; }
    appendChild(child) { this.children.push(child); }
    addEventListener(name, handler) { this.events[name] = handler; }
    dispatchEvent(event) { this.events[event.type]?.(event); }
    focus() {}
  }
  const elements = Object.fromEntries(['address', 'address-clear', 'suggestions', 'result', 'service-area-cta'].map(id => [id, new Element()]));
  const head = new Element();
  const timers = new Map();
  let timerId = 0;
  const requests = [];
  const context = vm.createContext({
    URLSearchParams,
    Event: class { constructor(type) { this.type = type; } },
    document: {head, getElementById: id => elements[id], createElement: () => new Element()},
    setTimeout: (fn, delay) => { timers.set(++timerId, {fn, delay}); return timerId; },
    clearTimeout: id => timers.delete(id),
    google: {maps: {importLibrary: async () => ({Geocoder: class {
      geocode(options) { const request = {...deferred(), options}; requests.push(request); return request.promise; }
    }})}}
  });
  context.window = context;
  vm.runInContext(addressScript, context);
  const input = value => { elements.address.value = value; elements.address.dispatchEvent({type: 'input'}); };
  const runTimer = delay => {
    const timer = [...timers].find(([, task]) => task.delay === delay);
    assert.ok(timer, `Expected a ${delay}ms timer`);
    timers.delete(timer[0]); timer[1].fn();
  };
  return {context, elements, head, requests, input, runTimer, timers};
}

const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
const resultAt = (lat, lng, address = 'Example address') => ({results: [{formatted_address: address, geometry: {location: {lat: () => lat, lng: () => lng}}}]});

async function startLookup(app, address = 'Mifflinburg, PA') {
  app.input(address);
  app.runTimer(500);
  if (app.context.initAddressGeocoder) await app.context.initAddressGeocoder();
  await flush();
}

test('inline JavaScript parses and no browser REST geocoding endpoint remains', () => {
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (!match[0].includes('application/ld+json')) new vm.Script(match[1]);
  }
  assert.ok(!html.includes('/maps/api/geocode/json'));
  assert.ok(!html.includes('geocodeAbortController'));
});

test('loads Maps only after a debounced address, reuses the loader, and converts LatLng methods', async () => {
  const app = setup();
  assert.equal(app.head.children.length, 0);
  app.input('PA');
  assert.equal(app.timers.size, 0);
  await startLookup(app);
  assert.equal(app.head.children.length, 1);
  assert.equal(app.requests[0].options.address, 'Mifflinburg, PA');
  assert.equal(app.requests[0].options.fulfillOnZeroResults, true);
  app.requests[0].resolve(resultAt(40.9176, -77.0478));
  await flush();
  app.elements.suggestions.children[0].events.click();
  assert.match(app.elements.result.innerHTML, /Yes, we service your area!/);
  assert.match(app.elements.result.innerHTML, /Call Steve/);
  await startLookup(app, 'Philadelphia, PA');
  assert.equal(app.head.children.length, 1);
  app.requests[1].resolve(resultAt(39.9526, -75.1652));
  await flush();
  app.elements.suggestions.children[0].events.click();
  assert.match(app.elements.result.innerHTML, /outside our service area/);
});

test('clearing while Maps loads does not send an obsolete address request', async () => {
  const app = setup();
  app.input('Mifflinburg, PA'); app.runTimer(500);
  app.elements['address-clear'].events.click();
  await app.context.initAddressGeocoder(); await flush();
  assert.equal(app.requests.length, 0);
  assert.equal(app.elements.result.hidden, true);
  assert.equal(app.elements.suggestions.children.length, 0);
});

test('obsolete successes and failures cannot replace the current address results', async () => {
  const app = setup();
  await startLookup(app, 'Old address');
  await startLookup(app, 'Current address');
  app.requests[1].resolve(resultAt(40.9176, -77.0478, 'Current address'));
  await flush();
  app.requests[0].reject(new Error('REQUEST_DENIED'));
  await flush();
  assert.equal(app.elements.suggestions.children[0].textContent, 'Current address');
  assert.equal(app.elements.result.hidden, true);
  await startLookup(app, 'Another address');
  app.input('x');
  app.requests[2].resolve(resultAt(40.9176, -77.0478));
  await flush();
  assert.equal(app.elements.suggestions.children.length, 0);
});

test('no matches, denied requests, and timeout show distinct appropriate outcomes', async () => {
  const app = setup();
  await startLookup(app);
  app.requests[0].resolve({results: []}); await flush();
  assert.match(app.elements.result.innerHTML, /No matching address/);
  await startLookup(app);
  app.requests[1].reject(new Error('REQUEST_DENIED')); await flush();
  assert.match(app.elements.result.innerHTML, /temporarily unavailable/);
  assert.doesNotMatch(app.elements.result.innerHTML, /No matching address/);
  await startLookup(app);
  app.runTimer(15000); await flush();
  assert.match(app.elements.result.innerHTML, /temporarily unavailable/);
  app.requests[2].resolve(resultAt(40.9176, -77.0478)); await flush();
  assert.equal(app.elements.suggestions.children.length, 0);
});

test('SDK load failure is handled without an unhandled rejection or repeated scripts', async () => {
  const app = setup();
  app.input('Mifflinburg, PA'); app.runTimer(500);
  app.head.children[0].onerror(); await flush();
  assert.match(app.elements.result.innerHTML, /Please refresh/);
  app.input('Lewisburg, PA'); app.runTimer(500); await flush();
  assert.equal(app.head.children.length, 1);
  assert.equal(app.requests.length, 0);
  assert.match(app.elements.result.innerHTML, /Please refresh/);
});
