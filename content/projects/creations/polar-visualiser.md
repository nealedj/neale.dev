{
    "title":"Glider Polar Visualiser",
    "link":"https://github.com/nealedj/polar-visualiser",
    "description":"Interactive polar curve visualiser for 200+ glider types, with MacCready speed-to-fly theory and ballast adjustments.",
    "tags":["JavaScript", "Canvas API"],
    "featured":true
}

I built this while working on custom avionics for my PIK 20D — I wanted a way to explore how polar curves shift with ballast and different MacCready values before embedding the maths into hardware. It turned into a reasonably complete tool.

The app fetches polar data directly from [XCSoar's open-source C++ codebase](https://github.com/XCSoar/XCSoar) — a database of 200+ production glider types. It parses the struct definitions using regex, then fits a quadratic curve through the three measured data points using a Cramer's rule regression. That fitted curve is what you see rendered.

From there it applies MacCready theory: given a thermal strength setting, it calculates the optimum inter-thermal cruise speed, the effective cross-country speed, and marks the tangent point on the polar. Ballast adjusts the polar by scaling the wing loading, which shifts the whole curve right and down as you'd expect.

No external libraries — just vanilla JavaScript and the native Canvas API. Supports knots, km/h, mph, m/s, and ft/min, and covers everything from vintage wood-and-fabric types to modern 18m flapped ships.

{{< iframe src="https://nealedj.github.io/polar-visualiser/" height="900" >}}
