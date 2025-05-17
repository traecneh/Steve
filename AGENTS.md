# Agent Guidance

This repository hosts the static website for **Steve's Professional Handyman Service**. The project is served with GitHub Pages, so no build step is needed.

## Repository layout
- `index.html` – main page containing the entire site markup and inline JavaScript.
- `styles.css` – site styling.
- `before*.jpg` and `after*.jpg` – images for the testimonial carousel.
- `ServiceArea.png` – map of the service region.
- `CNAME` – custom domain configuration for GitHub Pages (leave unchanged unless the domain changes).

## Local development
Run a simple HTTP server from the repository root:

```bash
python3 -m http.server
```

Then visit [http://localhost:8000](http://localhost:8000) to preview the site. The Google Maps API calls require an internet connection.

## Testing
There is no automated test suite. Manual verification is performed by opening the site in a browser and ensuring pages load and scripts work correctly.

## Conventions
- Use 2-space indentation for HTML and CSS files.
- Keep commit messages short but descriptive.
- Do not remove or rename existing image assets unless necessary.
- When editing `index.html` or `styles.css`, maintain the existing code style and formatting.
