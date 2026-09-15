# Steve's Professional Handyman Service

This repository contains the source code for the website [sphs.pro](https://sphs.pro), the online presence of **Steve's Professional Handyman Service** located in Mifflinburg, Pennsylvania. The site is entirely static and is hosted using GitHub Pages.

## Features

- **Responsive layout** built with simple HTML and CSS.
- **Service area check** powered by the Google Maps API. Users can enter an address to see whether it falls within the configured polygon coordinates for the business's service region.
- **Photo gallery** showing before-and-after pairs at their natural proportions, with navigation underneath and a height that fits the visible pair.
- **Project videos** in a separate section below the photo gallery, using each video's native proportions.
- **Local SEO markup** with [schema.org](https://schema.org/) `LocalBusiness` JSON‑LD information embedded in the page.
- **Custom domain support** via the `CNAME` file (currently `sphs.pro`).

## Repository Contents

- `index.html` – the main page with all site content and inline JavaScript.
- `styles.css` – styling for the site, including responsive rules and animations.
- `ServiceArea.png` – map image showing the service region.
- `portfolio/before*.jpg` and `portfolio/after*.jpg` – photos used in the testimonial carousel.
- `portfolio/video*.mp4` (or `.webm`) – project videos shown below the photo gallery.
- `favicon.png` – small icon used in browser tabs.
- `CNAME` – custom domain configuration for GitHub Pages.

## Running Locally

No build step is required. Serve the directory with a simple HTTP server so the portfolio's asset discovery requests work:

```bash
python3 -m http.server
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser. Note that the address lookup feature requires an internet connection and a valid Google Maps API key (already present in the file) and may not work if requests are blocked locally.

## Images (WebP)

This site serves `.webp` images (with JPG/PNG fallbacks). When adding new `portfolio/before#.jpg` / `portfolio/after#.jpg` files, generate matching `.webp` files by running:

```bash
python generate-webp.py
```

For new photo pairs, add their dimensions after applying any EXIF orientation
to `photoDimensions` in `index.html` to reserve the correct space before images load. Optional project
titles and view labels are configured in `projectDetails`. Pairs display side
by side on larger screens and stack on phones; images are not cropped or placed
in fixed-ratio frames. Only the visible pair participates in the gallery layout.
Previous/next buttons, photo-pair dots, and left/right arrow keys navigate the
gallery. When the top of the gallery is above the viewport, changing pairs
returns the reader to the photos.

On devices with a mouse, hovering over a photo magnifies the area under the
pointer within the existing image frame. Moving away restores the full photo.
Photos remain in place when clicked or tapped. Touch devices show the full
photos without the hover hint. The hover effect respects reduced-motion
preferences.

The sink project (`before7` / `after7`, previously portfolio slide 9) is omitted
from the gallery through `excludedPhotoPairs` in `index.html`. Its source files
are retained, and subsequent photo pairs keep their existing asset numbers.

## Basement project photos

`before8` / `after8` and `before9` / `after9` show two views of the same basement
project. Their captions and descriptive image text are configured in
`projectDetails` in `index.html`. The original JPGs have matching WebP versions,
and these landscape pairs display without cropping. The caption identifies the
beam and support-post work and wiring organization as one project.

## Water heater project photos

`before10` / `after10` show the water heater piping before and after the update.
The project caption is configured in `projectDetails` in `index.html`. The
original JPGs have matching WebP versions; both photos retain their full framing
despite their different orientations.

## Videos

Add videos to `portfolio/` using consecutive names like `video1.mp4`, `video2.mp4`, etc. (WebM is also supported via `video1.webm`). Videos appear in the separate Project videos section below the photo gallery, with native playback controls and no autoplay. The cards form two columns on larger screens and one column on phones. Playing a video pauses the other videos.

The optional `videoDimensions` values in `index.html` reserve the initial player
space while metadata loads; each video displays at its natural aspect ratio.
The `videoTitles` values supply both the visible captions and accessible player
labels, with a numbered label as the fallback for new videos.

## Security / API Key

The Google Maps API key is embedded client-side in `index.html`. In Google Cloud Console, restrict the key by HTTP referrer (for example `https://sphs.pro/*` and `http://localhost:8000/*`), enable only the APIs you use, set quotas, and rotate the key if it is ever exposed.

## Customization

To adapt this site for another business, update the contact details, service area polygon, images, and JSON-LD markup in `index.html`. The stylesheet can be modified in `styles.css` to change colors or layout.

## Deployment

The site is designed to be deployed with GitHub Pages. Push changes to the default branch and GitHub Pages will publish the updated content automatically, using the custom domain specified in the `CNAME` file.

---

This repository does not currently contain a license file. All content is provided as‑is.
