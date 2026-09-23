---
title: "Colophon"
description: "How this site is built: hand-coded Hugo templates, a paper-and-red-ink design system, and real flight data."
---

This site is hand-built. There's no theme, no CSS framework, no JavaScript
framework — just [Hugo](https://gohugo.io/), custom templates, one stylesheet,
and a couple of small scripts. The full source is on
[GitHub](https://github.com/nealedj/neale.dev).

## Design

The look is an engineer's whiteboard on cream paper: a warm off-white canvas,
white cards lifted off it by a barely-there shadow, near-black ink, and a
single red accent used sparingly — the highlighted card in a row, the active
link in the navigation, the line of a flight trace. Blue appears only inside
the "product" panels, like the barogram on the aviation page.

## Type

Headlines are set in **Inter** at a light weight, with Inter at regular and
medium weights for body text and interface. Small labels are **Space
Grotesk**, uppercase and widely tracked. Both faces are self-hosted, so no
third-party font services are involved.

## Flight data

The flight trace on the [aviation page](/aviation/) is the actual GPS track
from my 300km Gold distance and Diamond goal flight (Usk – Worcester –
Lake Vyrnwy – Usk, July 2026), plotted straight from the IGC logger file by a
small script — trace, turnpoints and barogram all come out of the log. The
weather line at the top of that page is the live METAR for Cardiff (EGFF),
fetched from the Norwegian Meteorological Institute's open API.

## Infrastructure

Built and deployed by GitHub Actions to GitHub Pages on every push to main.
