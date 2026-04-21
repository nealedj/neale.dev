# neale.dev

Personal portfolio and CV website for David Neale — Chief Architect, AWS/GCP specialist, and gliding enthusiast. Built with Hugo and deployed to GitHub Pages.

**Live site:** [https://neale.dev](https://neale.dev)

## Tech Stack

- **Generator:** [Hugo Extended](https://gohugo.io/) v0.115.4
- **Design:** Fully custom terminal-aesthetic (no theme dependency)
- **CSS:** Custom (`static/css/terminal.css`) — no CSS framework
- **Hosting:** GitHub Pages via GitHub Actions
- **Analytics:** Google Analytics 4

## Project Structure

```
neale.dev/
├── config.toml              # Site configuration (title, params, analytics)
├── content/                 # Markdown content pages
│   ├── _index.md            # Homepage bio and summary
│   ├── aviation/            # Aviation/gliding section
│   └── projects/            # Projects and creations
├── data/                    # JSON data files (edit for most content updates)
│   ├── certifications.json  # Professional certifications with Credly badge links
│   ├── casestudy.json       # Featured case study
│   ├── currently.json       # Current work/interests
│   ├── experience.json      # Career history
│   └── skills.json          # Skills grouped by category
├── layouts/                 # All Hugo templates (fully custom)
│   ├── index.html           # Standalone homepage layout
│   ├── aviation/list.html   # Standalone aviation page layout
│   ├── _default/baseof.html # Base shell for secondary pages
│   └── partials/            # Reusable template partials
└── static/
    ├── css/terminal.css     # All site styles
    ├── js/                  # site.js, tweaks.js, instruments.js
    └── img/                 # Profile photo and aviation gallery images
```

## Local Development

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.115.4+

### Setup

```bash
git clone https://github.com/nealedj/neale.dev.git
cd neale.dev
```

### Run dev server

```bash
hugo server
```

Site will be available at [http://localhost:1313](http://localhost:1313) with live reload.

**Windows note:** On machines with Device Guard / WDAC restrictions, use the included wrapper instead:

```cmd
hugo-server.cmd
```

### Build for production

```bash
hugo --gc --minify
```

Output goes to `public/`.

## Content Updates

Most content lives in `data/` as JSON — no layout changes needed for common updates:

| What to update | File |
|---|---|
| Work experience | `data/experience.json` |
| Skills | `data/skills.json` |
| Certifications | `data/certifications.json` |
| Case study | `data/casestudy.json` |
| Current interests | `data/currently.json` |
| Bio / intro text | `content/_index.md` |
| Aviation timeline | `content/aviation/_index.md` |

## Deployment

Pushes to `main` automatically trigger the GitHub Actions workflow (`.github/workflows/hugo.yaml`), which builds and deploys to GitHub Pages.
