# Steve's Professional Handyman Service

This repository contains the source code for the website [sphs.pro](https://sphs.pro), the online presence of **Steve's Professional Handyman Service** located in Mifflinburg, Pennsylvania. The site is entirely static and is hosted using GitHub Pages.

## Features

- **Responsive layout** built with simple HTML and CSS.
- **Service area check** powered by the Google Maps API. Users can enter an address to see whether it falls within the configured polygon coordinates for the business's service region.
- **Image carousel** showcasing before and after photos of completed work.
- **Local SEO markup** with [schema.org](https://schema.org/) `LocalBusiness` JSON‑LD information embedded in the page.
- **Custom domain support** via the `CNAME` file (currently `sphs.pro`).

## Repository Contents

- `index.html` – the main page with all site content and inline JavaScript.
- `styles.css` – styling for the site, including responsive rules and animations.
- `ServiceArea.png` – map image showing the service region.
- `before*.jpg` and `after*.jpg` – photos used in the testimonial carousel.
- `favicon.png` – small icon used in browser tabs.
- `CNAME` – custom domain configuration for GitHub Pages.

## Running Locally

No build step is required. You can open `index.html` directly in a browser, or serve the directory with a simple HTTP server:

```bash
python3 -m http.server
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser. Note that the address lookup feature requires an internet connection and a valid Google Maps API key (already present in the file) and may not work if requests are blocked locally.

## Customization

To adapt this site for another business, update the contact details, service area polygon, images, and JSON‑LD markup in `index.html`. The stylesheet can be modified in `styles.css` to change colors or layout.

## Deployment

The site is designed to be deployed with GitHub Pages. Push changes to the default branch and GitHub Pages will publish the updated content automatically, using the custom domain specified in the `CNAME` file.

---

This repository does not currently contain a license file. All content is provided as‑is.
