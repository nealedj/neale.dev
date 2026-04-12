# neale.dev

Personal portfolio and CV website for David Neale — Chief Architect, AWS/GCP specialist, and gliding enthusiast. Built with Hugo and deployed to GitHub Pages.

**Live site:** [https://neale.dev](https://neale.dev)

## Tech Stack

- **Generator:** [Hugo](https://gohugo.io/) v0.115.4
- **Theme:** [hugo-resume](https://github.com/eddiewebb/hugo-resume) (git submodule)
- **CSS:** Bootstrap 4.5.3 + custom overrides
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
├── data/                    # JSON data files (edited for most content updates)
│   ├── certifications.json  # Professional certifications with Credly badge links
│   ├── education.json       # Academic history
│   ├── experience.json      # Career history
│   └── skills.json          # Skills grouped by category
├── layouts/                 # Hugo template overrides
│   ├── index.html           # Homepage layout
│   ├── _default/baseof.html # Base HTML shell
│   └── partials/            # Reusable template partials
├── static/
│   ├── css/resume-override.css  # Custom CSS on top of theme
│   └── img/                 # Profile photo and aviation gallery images
└── themes/hugo-resume/      # Theme (git submodule — do not edit directly)
```

## Local Development

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.115.4+
- Git (with submodule support)

### Setup

```bash
git clone --recurse-submodules https://github.com/nealedj/neale.dev.git
cd neale.dev
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

### Run dev server

```bash
hugo server
```

Site will be available at [http://localhost:1313](http://localhost:1313) with live reload.

### Build for production

```bash
hugo --gc --minify
```

Output goes to `public/`.

## Content Updates

Most content lives in `data/` as JSON — no Markdown editing required for the common cases:

| What to update | File |
|---|---|
| Work experience | `data/experience.json` |
| Skills | `data/skills.json` |
| Certifications | `data/certifications.json` |
| Education | `data/education.json` |
| Bio / intro text | `content/_index.md` |
| Aviation timeline | `content/aviation/_index.md` |

Homepage sections are controlled by `config.toml`:

```toml
[params]
sections = ["skills","experience"]
```

## Deployment

Pushes to `main` automatically trigger the GitHub Actions workflow (`.github/workflows/hugo.yaml`), which builds and deploys to GitHub Pages.
