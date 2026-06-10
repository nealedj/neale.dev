# CLAUDE.md — neale.dev

## Project Overview

Hugo static site for neale.dev — personal portfolio and CV. All site content is hardcoded directly in the layout templates. Markdown is used for long-form secondary pages (aviation subpages, projects).

The site uses a fully custom terminal-aesthetic design — there is no theme submodule. All templates live directly in `layouts/`.

## Essential Commands

```bash
# Start dev server (live reload at localhost:1313)
hugo server

# On Windows with Device Guard policy (e.g. corp machines), use the .cmd wrapper:
# hugo-server.cmd — this routes through cmd.exe to bypass WDAC restrictions

# Production build
hugo --gc --minify
```

## How Content Works

The homepage (`layouts/index.html`) and aviation page (`layouts/aviation/list.html`) are fully standalone HTML files — all content (skills, experience, case study, currently, certifications) is hardcoded in the template HTML.

**Use Markdown for secondary pages:**
- `content/_index.md` — homepage bio (not rendered on homepage; kept for Hugo's page model)
- `content/aviation/_index.md` — aviation timeline (uses raw HTML inside Markdown; `unsafe = true` is set in config)
- `content/aviation/gallery.md` — photo gallery
- `content/aviation/posters.md` — TMG training poster pages
- `content/projects/creations/loan-amortisation.md` — project page

## Layout Structure

There is no theme submodule. All layouts are custom:

- `layouts/index.html` — standalone homepage (terminal aesthetic, does not use baseof)
- `layouts/aviation/list.html` — standalone aviation page (terminal aesthetic, does not use baseof)
- `layouts/_default/baseof.html` — base shell for secondary pages (gallery, posters, projects)
- `layouts/partials/nav.html` — terminal-style nav used by baseof
- `layouts/shortcodes/iframe.html` — iframe embed shortcode
- `layouts/404.html` — standalone "off-airfield landing" error page
- `content/colophon.md` — how the site is built (rendered via baseof)

## CSS / JS

- `static/css/terminal.css` — all site styles (flight-deck aesthetic: B612 type, amber accent)
- `static/fonts/` — self-hosted B612 / B612 Mono woff2 (no Google Fonts requests)
- `static/js/instruments.js` — SVG aviation gauge instruments
- `static/js/drums.js` — mechanical drum-roll stat counters
- `static/js/metar.js` — live EGFF METAR for the hero meta strip (api.met.no, static fallback)
- `static/js/tweaks.js` — tweaks panel (day/night lighting, accent, density, grid); opened via the fixed TWEAKS launcher; state persists in localStorage
- `static/js/site.js` — legacy; not referenced by current templates

`scripts/igc-trace.js` regenerates the aviation page's inline SVG flight-trace
section from an IGC log (source logs in `scripts/data/`).

No Bootstrap, jQuery, or icon font libraries are used.

## Gotchas

- `unsafe = true` in `[markup.goldmark.renderer]` allows raw HTML in Markdown (needed for aviation page)
- The homepage and aviation page are standalone HTML files — they do not extend baseof.html
- Favicon is served from `/favicon.ico` (i.e. `static/favicon.ico`)

## Images

Profile photo: `static/img/davidportrait.jpg`
Aviation gallery: `static/img/aviation/`
Logo: `static/img/logo.svg`
Favicon: `static/favicon.ico`

Images are referenced in templates as `/img/...` (no `/static/` prefix).

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.
Workflow: `.github/workflows/hugo.yaml`

Do not commit the `public/` directory — it is built by CI.
