# Site Improvement Plan

Observations from a review of the local dev site at desktop (1280px) and mobile (375px) viewports.

---

## Bugs

### 1. Mobile hamburger menu not expanding
The navbar toggle on mobile does not visibly open the nav dropdown when tapped. The Bootstrap `collapse` JS plugin is required for this to work — check that the Bootstrap JS bundle is loading correctly and not blocked by a CSP or ad blocker.

**File to check:** `layouts/_default/baseof.html` — verify the Bootstrap JS `<script>` tag is present and loading.

---

## Layout & UX

### 2. Content not visible above the fold in Skills / Experience sections
The homepage uses a single-page layout where each section fills 100vh and content scrolls within it. On first load, the Skills and Experience sections show almost no content before the user scrolls — the top padding pushes it out of view.

**Fix:** Reduce top padding on `.resume-section` in `static/css/resume-override.css`:
```css
.resume-section {
  padding-top: 3rem !important; /* reduce from the theme default */
}
```

### 3. Profile photo missing on mobile
The circular portrait lives in the left sidebar, which collapses away entirely on mobile. Mobile visitors never see the headshot.

**Fix:** Add a compact version of the portrait inside the `#about` section content for small screens, shown only on mobile via `d-block d-lg-none`.

### 4. Creations project thumbnail too small on mobile
The project screenshot (Loan Amortisation Calculator) uses a `col-sm-4` split that renders the image very small at 375px.

**Fix:** In `layouts/` or `themes/hugo-resume/layouts/`, update the project card to go full-width on `xs`:
```html
<div class="col-12 col-sm-4"> <!-- was col-sm-4 -->
```

### 5. Aviation timeline has large vertical gaps
The milestone entries have excessive spacing between them, making the page feel sparse and requiring a lot of scrolling.

**Fix:** Tighten the timeline item margin in `static/css/resume-override.css`.

---

## Content & SEO

### 6. Aviation summary not shown on homepage
`layouts/partials/aviationSummary.html` exists but isn't wired into the homepage. The `sections` param in `config.toml` only includes `["skills","experience"]`.

**Fix:** Add `"aviation"` to the sections list and ensure the partial renders:
```toml
sections = ["skills", "experience", "aviation"]
```

### 7. No Open Graph image for social sharing
The site has no `og:image` meta tag. LinkedIn/Twitter/Slack previews will show a blank card.

**Fix:** Add to `layouts/_default/baseof.html`:
```html
<meta property="og:image" content="{{ .Site.BaseURL }}img/davidportrait.jpg" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="800" />
```

### 8. Email address exposed as plain text
`david@neale.dev` is a plain `mailto:` link, easily scraped by spam bots.

**Options:**
- Remove the email from the page entirely (contact via LinkedIn)
- Use a CSS-only obfuscation approach
- Set `showContact = false` in `config.toml` if it's not already (it is — verify the email isn't leaking via another partial)

---

## Visual Polish

### 9. TOGAF badge visually inconsistent with AWS badges
The TOGAF 9 (Open Group) badge renders noticeably smaller and plainer than the AWS hexagonal Credly badges, creating an uneven row.

**Fix:** In `data/certifications.json`, adjust the TOGAF badge image URL to use the official Open Group digital credential badge, or apply a fixed height to all cert badge images in `resume-override.css`:
```css
.certification-badge img {
  height: 80px;
  width: auto;
}
```
