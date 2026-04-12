# CLAUDE.md — neale.dev

## Project Overview

Hugo static site for neale.dev — personal portfolio and CV. Content is mostly JSON-driven; Markdown is used only for long-form sections (aviation timeline, projects).

## Essential Commands

```bash
# Start dev server (live reload at localhost:1313)
hugo server

# Production build
hugo --gc --minify

# Init theme submodule (needed after fresh clone)
git submodule update --init --recursive
```

## How Content Works

**Prefer JSON for structured data.** The theme renders `data/*.json` automatically — no layout changes needed for most content updates.

| File | What it renders |
|---|---|
| `data/experience.json` | Work history timeline |
| `data/skills.json` | Skills grid (grouped by category) |
| `data/certifications.json` | Cert badges with Credly links |
| `data/education.json` | Education section |

**Use Markdown for prose sections:**
- `content/_index.md` — homepage bio summary
- `content/aviation/_index.md` — aviation timeline (uses raw HTML inside Markdown; `unsafe = true` is set in config)

## Layout Overrides

Theme lives in `themes/hugo-resume/` — **do not edit it directly** (it's a git submodule). Override in `layouts/` instead:

- `layouts/index.html` — controls which sections appear on homepage
- `layouts/_default/baseof.html` — base HTML shell (head, analytics, nav)
- `layouts/partials/nav.html` — top navigation bar
- `layouts/partials/aviationSummary.html` — aviation summary card on homepage
- `static/css/resume-override.css` — all custom CSS goes here

## Configuration

`config.toml` key params:

```toml
sections = ["skills","experience"]  # Controls homepage section order/visibility
showCertifications = true           # Toggle certifications section
showSocializations = true           # Toggle social links
```

## Theme Gotchas

- The theme uses Bootstrap 4.5 — do not use Bootstrap 5 syntax in overrides
- `unsafe = true` in `[markup.goldmark.renderer]` allows raw HTML in Markdown (needed for aviation page)
- JSON output is enabled (`home = ["HTML", "JSON"]`) — this powers the search page
- FontAwesome 5 icon names are used for skill/social icons (not FA6)

## Images

Profile photo: `static/img/davidportrait.jpg`  
Aviation gallery: `static/img/aviation/`  
Logo/favicon: `static/img/logo.svg`, `static/img/favicon.ico`

Images are referenced in templates as `/img/...` (no `/static/` prefix).

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.  
Workflow: `.github/workflows/hugo.yaml`

Do not commit the `public/` directory — it is built by CI.
