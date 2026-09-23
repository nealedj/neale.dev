# CLAUDE.md — neale.dev

## Project Overview

Hugo static site for neale.dev — personal portfolio and CV. All site content is hardcoded directly in the layout templates. Markdown is used for long-form secondary pages (aviation subpages, projects).

The site uses a fully custom design — "engineer's whiteboard on cream paper" (see Design System below). There is no theme submodule. All templates live directly in `layouts/`.

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
- `content/projects/creations/*.md` — project pages (polar visualiser, IGC analyser, loan amortisation)

## Layout Structure

There is no theme submodule. All layouts are custom:

- `layouts/index.html` — standalone homepage (does not use baseof)
- `layouts/aviation/list.html` — standalone aviation page (does not use baseof)
- `layouts/_default/baseof.html` — base shell for secondary pages (gallery, posters, projects, colophon)
- `layouts/_default/single.html` — project pages: header shows front-matter `description`, `tags` (pills) and `link` (source button)
- `layouts/_default/list.html` — section listings as a card grid
- `layouts/partials/head.html` — font preloads, stylesheet, favicon (used by every page)
- `layouts/partials/nav.html` — floating top nav used by every page; section links are `/#id`
- `layouts/partials/footer.html` — footer link columns (also loads `js/nav.js`)
- `layouts/partials/analytics.html` — GA4 snippet
- `layouts/partials/icon.html` — inline SVG outline icons: `partial "icon.html" (dict "name" "arrow-right")`
- `layouts/shortcodes/iframe.html` — iframe embed shortcode
- `layouts/404.html` — standalone "off-airfield landing" error page
- `content/colophon.md` — how the site is built (rendered via baseof)

## CSS / JS

- `static/css/site.css` — all site styles; design tokens are CSS custom properties on `:root`
- `static/fonts/` — self-hosted Inter and Space Grotesk variable woff2, Latin subset (OFL, see `OFL.txt`; no Google Fonts requests)
- `static/js/nav.js` — mobile menu toggle and homepage scroll-spy for the nav
- `static/js/metar.js` — live EGFF METAR for the aviation hero pill (api.met.no, static fallback)
- `static/js/site.js` — legacy; not referenced by current templates

`scripts/igc-trace.js` regenerates the aviation page's flight-trace section
(the showcase window, SVG trace and barogram) from an IGC log (source logs in
`scripts/data/`). Paste its output over the FLIGHT TRACE section.

## Design System

Light theme only. Tokens live in `static/css/site.css` `:root`.

- **Colours:** Bone `#eeebea` page canvas (never white full-page backgrounds); Paper `#fff` cards; Ink `#181717` text (never pure black); Charcoal `#575555` muted text; Linen `#f7f5f4` nav/pills; Mist `#d5d3d2` dividers.
- **Signal Red `#d04841`** is the only accent: at most one element per row — the first card of a `.feature-row`, the active-nav dot, the showcase title bar, the flight-trace line, the `.live-dot`. Don't use it for small text (contrast on Bone is too low).
- **Network blue gradient** (`.showcase-panel`) only inside product-style showcase windows, never for controls.
- **Type:** Inter 300 for headlines (`.hero h1`, `.section-head h2`, stats); Inter 400/500 for body and UI; `.eyebrow` = Space Grotesk 500, 12px, uppercase, 0.05em tracking. No bold (700) display type.
- **Shape:** 16px radius cards/images/nav, 32px showcases, 8px buttons, pills fully rounded. Shadows are the near-invisible `--shadow-sm` (+ a 5% hairline `--edge`); `--shadow-md` only on hover.
- **Buttons:** `.btn-primary` (Ink fill, no hover lift) paired with `.btn-ghost` (text + underline on hover).
- **Components:** `.section-head` (centred eyebrow + h2 + sub), `.stats`, `.feature-row` / `.feature--red`, `.showcase` (`.showcase-bar`, `.showcase-body`, `.showcase-panel`), `.tile-grid`, `.card`, `.quote-card`, `.link-card`, `.timeline`, `.pill` / `.tag-list`.
- **Layout:** 1200px max width (`.container`), 64–96px section gaps, no alternating dark/light bands. Secondary pages use `.page-body`: a 720px prose column; iframes, videos and `.gallery-grid` break out full width.

No Bootstrap, jQuery, or icon font libraries are used.

## Gotchas

- `unsafe = true` in `[markup.goldmark.renderer]` allows raw HTML in Markdown (needed for aviation page)
- The homepage and aviation page are standalone HTML files — they do not extend baseof.html
- Favicon is served from `/favicon.ico` (i.e. `static/favicon.ico`)

## Images

Profile photo: `static/img/davidportrait.jpg`
Aviation gallery: `static/img/aviation/`
Social card: `static/img/og-card.png` (1200×630)
Logo: `static/img/logo.svg` (legacy; the nav uses a CSS "DN" mark)
Favicon: `static/favicon.ico`

Images are referenced in templates as `/img/...` (no `/static/` prefix).

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.
Workflow: `.github/workflows/hugo.yaml`

Do not commit the `public/` directory — it is built by CI.
