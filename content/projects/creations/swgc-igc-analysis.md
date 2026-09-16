{
    "title":"SWGC Flight Track Analysis",
    "link":"https://github.com/nealedj/swgc-igc-analysis",
    "description":"Self-hosted map of a gliding club's flight traces, in 2D and 3D, built to show where circuit and approach traffic actually flies.",
    "tags":["TypeScript", "React", "deck.gl", "MapLibre", "SQLite"],
    "featured":true
}

## What it's for

South Wales Gliding Club logs its flights and their IGC traces in [gliding.app](https://gliding.app). This tool syncs them to a server, stores them locally, and lets members look at a whole season on one map. It was built to answer a question about approach paths: where does club traffic actually fly on the circuit and approach at Usk?

The app isn't public. Flight tracks linked to named pilots are personal data, so the club's copy sits behind a login. The demo below covers the 2026 season, with pilot names anonymised.

{{< video src="/video/swgc-demo.webm" >}}

## Features

- Filter flights by aircraft class, registration, pilot, training status and date
- Density view: a season of traces drawn so the most common path shows up as a bright core, with the spread around it
- Corridor view: along a runway axis, the median path with p25–p75 and p5–p95 bands, plus a linked height profile
- Gates: put a line across the track and see how far to the side and how high flights were when they crossed it
- Individual traces with flight details, for looking at a handful of flights at a time
- 3D over terrain, with curtains dropped to the ground, adjustable vertical exaggeration and camera presets along the approach

## How it works

A TypeScript monorepo. A sync job pulls flight records and IGC files from the gliding.app API into SQLite and turns each trace into compact level-of-detail files. A Fastify API serves the filtered flights, the trace data and the corridor and gate statistics. The React front end draws everything with MapLibre and deck.gl.

Most of the effort went into getting the heights right. Neither recorded altitude is height above ground: pressure altitude assumes a standard 1013.25 hPa atmosphere, and GNSS altitude is height above the WGS84 ellipsoid, about 50 m above sea level in South Wales. Each flight is calibrated against its own fixes on the airfield, and the geoid separation is taken out for the 3D view. Every height in the interface says which datum it uses. Traces are resampled by distance before they're aggregated, because fixes are recorded at set time intervals and a slow glider would otherwise count for more.

It runs on an Oracle Cloud free-tier VM under Docker Compose, with Caddy handling TLS and basic auth, and syncs every night.
