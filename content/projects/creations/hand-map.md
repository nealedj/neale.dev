{
    "title":"Hand Map",
    "link":"https://github.com/nealedj/hand-annotator",
    "description":"Browser-only tool for hand therapists to mark problem areas on a hand diagram and export a PNG for the case file, with nothing saved or sent.",
    "tags":["TypeScript", "Vite", "SVG", "Playwright"],
    "featured":true
}

## What it's for

Hand therapists and occupational therapists often sketch problem areas on a hand diagram for the patient's case file. Hand Map does this in the browser. You circle joints or areas, tag each mark with issue types, add notes and download a single PNG.

The priorities, in order: privacy, then clinical clarity of the output, then ease of use. A typical diagram (three to six marks and a few notes) should take under two minutes, with no training.

## How to use it

Open [hand-annotator.neale.dev](https://hand-annotator.neale.dev/) and choose a hand (left or right) and a view (palmar or dorsal). Click a joint to place a mark. It snaps to the joint and a popover opens with the issue types. Add a note if you want one, then click **Download PNG**. Closing the tab discards everything.

## Features

- Left and right hands in palmar and dorsal views, drawn as separate illustrations. Mirroring a palmar view would make it look like the other hand's dorsal view. Every view is labelled in full, for example "RIGHT HAND — PALMAR", because mixing them up is a clinical safety risk.
- 19 snap points per view: DIP, PIP and MCP on each finger, the thumb IP, MCP and CMC, and four wrist points. They sit over the underlying joint rather than the nearest skin crease. Hold Alt, or turn snapping off, to place a mark freely.
- Eight issue types, among them pain, swelling, stiffness, altered sensation and triggering. Each has a letter code and a colour from the Okabe–Ito colour-blind-safe palette, and a mark with several types is drawn as a segmented ring.
- Notes appear as callouts beside the hand and are placed automatically. You can drag them, and pins let you add a note anywhere on the view.
- Undo and redo, and full keyboard control: arrow keys move between joints, and marks can be moved, resized and deleted without a mouse.
- On a phone, the popover becomes a bottom sheet and taps snap to the nearest joint within reach of a finger.
- The PNG holds every view that has a mark, a legend of the issue types used, and the general notes. It has no date, names or branding, so it stays legible when printed in greyscale at A4 width.

## Privacy

Notes can still contain personal information, so nothing leaves the page and nothing outlives the tab:

- No localStorage, sessionStorage, IndexedDB, cookies, Cache API or service worker, and no state in the URL
- A strict Content Security Policy with `connect-src 'none'` blocks every request once the app has loaded
- Autocomplete and spellcheck are off, because cloud spellcheck can send text away. Fields are cleared when the page is hidden, and a page restored from the back-forward cache starts blank.
- There are no fields for patient identifiers. They're added in the case file, not here.

## How it works

It's TypeScript and Vite with no UI framework. A single render function turns state into SVG, and the editor and the PNG export both use it, so the export matches the screen. The export serialises that SVG, draws it onto a canvas and encodes it as a PNG, all in the browser. The hand artwork is generated from a skeleton by a script. The snap points are JSON, and the left hand's points are mirrored from the right.

The privacy rules are tested, not just stated. Playwright tests in Chromium, Firefox and WebKit check for no network requests, no storage, no change to the URL or history, and a blank app after Back or a reload. Other tests cover phone layouts, axe accessibility checks and pixel snapshots of the export. GitHub Pages deploys only if every test passes.

{{< iframe src="https://hand-annotator.neale.dev/" height="900" >}}
