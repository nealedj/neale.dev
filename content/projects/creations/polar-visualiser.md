{
    "title":"Glider Polar Visualiser",
    "link":"https://github.com/nealedj/polar-visualiser",
    "description":"Interactive polar curve visualiser for 200+ glider types, with MacCready speed-to-fly theory and ballast adjustments.",
    "tags":["JavaScript", "Canvas API"],
    "featured":true
}

I built this as a way to explore how polar curves shift with ballast and different MacCready value.

The app fetches polar data directly from [XCSoar's codebase](https://github.com/XCSoar/XCSoar). It parses the struct definitions using regex, then fits a quadratic curve through the three measured data points using a Cramer's rule regression.

From there it applies MacCready theory: given a thermal strength setting, it calculates the optimum inter-thermal cruise speed, the effective cross-country speed, and marks the tangent point on the polar. Ballast adjusts the polar by scaling the wing loading, which shifts the whole curve right and down as you'd expect.

Supports multiple unit types and allows users to overlay two gliders in order to compare their performance.

Test it properly by clicking [here](https://nealedj.github.io/loan-amortisation-rust/).

{{< iframe src="https://nealedj.github.io/polar-visualiser/" height="900" >}}
