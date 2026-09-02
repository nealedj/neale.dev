{
    "title":"Glider Polar Visualiser",
    "link":"https://github.com/nealedj/polar-visualiser",
    "description":"Interactive polar curve visualiser for 200+ glider types, with MacCready speed-to-fly theory and ballast adjustments.",
    "tags":["JavaScript", "Canvas API"],
    "featured":true
}

## What it's for

Shows how a glider's polar curve shifts with ballast and MacCready setting, and what that means for speed to fly, across 200+ glider types.

## How to use it

Open [polars.neale.dev](https://polars.neale.dev/) and pick a glider. Set a thermal strength and a ballast load, and the curve and the derived speeds update with it. Add a second glider to compare the two.

## Features

- Over 200 glider types, with polar data taken directly from [XCSoar's codebase](https://github.com/XCSoar/XCSoar)
- Hover any point on the curve to read the sink rate and glide ratio at that speed
- MacCready speed-to-fly: for a given thermal strength it gives the optimum inter-thermal cruise speed and the effective cross-country speed, and marks the tangent point on the polar
- Ballast adjustment by wing loading, which shifts the whole curve right and down
- Two gliders overlaid on the same axes for a direct performance comparison
- Multiple unit systems

## How it works

Polar data is fetched from the XCSoar source, parsing the struct definitions with regex. A quadratic is fitted through the three measured points using a Cramer's rule regression, and MacCready theory is applied to the fitted curve.

{{< iframe src="https://polars.neale.dev/" height="900" >}}
