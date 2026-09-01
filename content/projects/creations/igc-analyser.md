{
    "title":"IGC Flight Log Analyser",
    "link":"https://github.com/nealedj/igc-analyser",
    "description":"Browser-based glider flight log analyser: phase split, climbs and circle geometry, wind, and the energy balance of the straight legs.",
    "tags":["TypeScript", "Vite", "SVG"],
    "featured":true
}

Drop a glider flight log into the browser and get a soaring debrief back: how the flight split between circling and cruising, what each climb actually did, what the wind was, and what the air was doing on the straight legs.

I wrote it because the debrief I wanted after a cross-country day wasn't the one the usual tools give you. A climb average tells you very little on its own — the interesting question is whether the centring improved, decayed or oscillated circle by circle, and what the airmass was giving you between the climbs once polar sink for the speed and density you flew at is taken out.

It reads the phase split first and lets that decide what kind of debrief the flight deserves; a day spent 15% circling is not a thermalling flight, and grading its climbs as though it were misses what made it good. Wind comes from the drift of whole circles, reported with the circle count behind each estimate so you can see when it isn't evidence. Declared tasks are read from the `C` records and shown as the declaration they are — the shape, the legs, the total — with the take-off and landing records kept out of it, and no pretence of being a claim.

It is also candid about what a trace cannot show. A coarse logger fix rate cannot show centring inside a circle, and every airmass figure is only as good as the assumed polar, so those caveats sit above the figures they affect rather than in a footnote.

Everything runs client-side. The file is read with the File API and analysed in the tab — no backend, no upload, no analytics — and once the page has loaded it works with the network off. The analysis core is a dependency-free TypeScript port of a working Python implementation, which is kept in the repository as the test oracle: golden fixtures have to match it number for number, and any deliberate divergence is registered and explained rather than left silent.

Try it at [igc.neale.dev](https://igc.neale.dev/).

{{< iframe src="https://igc.neale.dev/" height="900" >}}
