---
title: "Colophon"
description: "How this site is built: hand-coded Hugo templates, cockpit typography, and real flight data."
---

This site is hand-built. There's no theme, no CSS framework, no JavaScript
framework — just [Hugo](https://gohugo.io/), custom templates, one stylesheet,
and a few small scripts. The full source is on
[GitHub](https://github.com/nealedj/neale.dev).

## Type

Text is set in **B612**, the typeface Airbus and Intactile DESIGN developed
for cockpit display legibility, with **B612 Mono** for labels and data. It
seemed right for a glider pilot's site. Both faces are self-hosted, so no
third-party font services are involved.

## Instruments

The gauges in the margin — altimeter, ASI, vario, attitude indicator — are
hand-coded SVG, drawn once and driven by scroll position. The altimeter winds
up as you read down the page.

## Flight data

The flight trace on the [aviation page](/aviation/) is the actual GPS track
from my 100km diploma flight (Usk – Hereford Cathedral – Ledbury – Usk,
June 2025), plotted straight from the IGC logger file by a small script. The
weather line in the header is the live METAR for Cardiff (EGFF), fetched from
the Norwegian Meteorological Institute's open API.

## Lighting

The TWEAKS panel (bottom right) adjusts accent colour, density and panel
lighting. Night mode shifts the whole site to red — the same reason cockpit
lighting is red: it preserves your dark adaptation.

## Infrastructure

Built and deployed by GitHub Actions to GitHub Pages on every push to main.
