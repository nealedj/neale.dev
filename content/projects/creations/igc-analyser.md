{
    "title":"IGC Flight Log Analyser",
    "link":"https://github.com/nealedj/igc-analyser",
    "description":"Browser-based glider flight log analyser: phase split, climbs and circle geometry, wind, and the energy balance of the straight legs.",
    "tags":["TypeScript", "Vite", "SVG"],
    "featured":true
}

## What it's for

Turns a glider flight log into a soaring debrief: how the flight split between circling and cruising, what each climb did, what the wind was, and what the air was doing on the straight legs.

## How to use it

Open [igc.neale.dev](https://igc.neale.dev/) and drop an IGC file onto the page. The analysis appears in the tab. Nothing is uploaded, and once the page has loaded it works with the network off.

## Features

- Phase split first, which decides the kind of debrief the flight gets — a day spent 15% circling isn't graded as a thermalling flight
- Climb analysis circle by circle, showing whether centring improved, decayed or oscillated rather than just an average
- Wind from the drift of whole circles, reported with the circle count behind each estimate so you can see when it isn't evidence
- Airmass figures for the straight legs, with polar sink for the speed and density flown taken out
- Declared tasks read from the `C` records and shown as a declaration — shape, legs, total — with take-off and landing records excluded, and no pretence of being a claim
- Caveats sit above the figures they affect: a coarse logger fix rate can't show centring inside a circle, and every airmass figure is only as good as the assumed polar

## How it works

Everything runs client-side. The file is read with the File API and analysed in the browser — no backend, no upload, no analytics. The analysis core is a dependency-free TypeScript port of a Python implementation, which stays in the repository as the test oracle: golden fixtures have to match it number for number, and any deliberate divergence is registered and explained.

{{< iframe src="https://igc.neale.dev/" height="900" >}}
