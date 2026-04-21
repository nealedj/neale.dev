# CLAUDE.md — neale.dev

## Project Overview

Hugo static site for neale.dev — personal portfolio and CV. Content is mostly JSON-driven; Markdown is used only for long-form sections (aviation timeline, projects).

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

**Prefer JSON for structured data.** Layouts read `data/*.json` automatically — no layout changes needed for most content updates.

| File | What it renders |
|---|---|
| `data/experience.json` | Work history timeline |
| `data/skills.json` | Skills grid (grouped by category) |
| `data/certifications.json` | Cert badges with Credly links |
| `data/education.json` | Education section |

**Use Markdown for prose sections:**
- `content/_index.md` — homepage bio summary
- `content/aviation/_index.md` — aviation timeline (uses raw HTML inside Markdown; `unsafe = true` is set in config)

## Layout Structure

There is no theme submodule. All layouts are custom:

- `layouts/index.html` — standalone homepage (terminal aesthetic, does not use baseof)
- `layouts/aviation/list.html` — standalone aviation page (terminal aesthetic, does not use baseof)
- `layouts/_default/baseof.html` — base shell for secondary pages (gallery, posters, projects, search)
- `layouts/partials/nav.html` — terminal-style nav used by baseof
- `layouts/shortcodes/iframe.html` — iframe embed shortcode

## CSS / JS

- `static/css/terminal.css` — all site styles (terminal aesthetic)
- `static/js/instruments.js` — SVG aviation gauge instruments
- `static/js/tweaks.js` — UI tweaker panel (accent colour, scanlines, density)
- `static/js/site.js` — metric counters and intersection observers

No Bootstrap, jQuery, or icon font libraries are used.

## Configuration

`config.toml` key params:

```toml
sections = ["casestudy","skills","experience","aviation","currently"]  # homepage sections
showCertifications = true           # Toggle certifications section
showSocializations = true           # Toggle social links
```

## Gotchas

- `unsafe = true` in `[markup.goldmark.renderer]` allows raw HTML in Markdown (needed for aviation page)
- JSON output is enabled (`home = ["HTML", "JSON"]`) — this powers the search page
- The homepage and aviation page are standalone HTML files — they do not extend baseof.html

## Images

Profile photo: `static/img/davidportrait.jpg`  
Aviation gallery: `static/img/aviation/`  
Logo/favicon: `static/img/logo.svg`, `static/img/favicon.ico`

Images are referenced in templates as `/img/...` (no `/static/` prefix).

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.  
Workflow: `.github/workflows/hugo.yaml`

Do not commit the `public/` directory — it is built by CI.
