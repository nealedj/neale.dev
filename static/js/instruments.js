// Aviation instruments — SVG gauges that tick with scroll progress.
// Pure decoration. Each draws its face once; we rotate the needle only.

(function () {
  const PHOSPHOR = "var(--phosphor)";

  function el(tag, attrs, children) {
    attrs = attrs || {};
    children = children || [];
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    for (const c of children) n.appendChild(c);
    return n;
  }

  function polar(cx, cy, r, deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function altimeter(svg) {
    const g = el("g");
    svg.appendChild(g);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 48, fill: "#0a0c0d", stroke: "#2a2d2f", "stroke-width": 0.6 }));
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 44, fill: "none", stroke: "#171a1b", "stroke-width": 0.4 }));
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * 360;
      const [x1, y1] = polar(50, 50, 43, a);
      const [x2, y2] = polar(50, 50, 38, a);
      g.appendChild(el("line", { x1, y1, x2, y2, stroke: "#7c7870", "stroke-width": 0.6 }));
      const [tx, ty] = polar(50, 50, 33, a);
      const t = el("text", { x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "JetBrains Mono, monospace", "font-size": 5, fill: "#9a968d" });
      t.textContent = i.toString();
      g.appendChild(t);
    }
    for (let i = 0; i < 50; i++) {
      if (i % 5 === 0) continue;
      const a = (i / 50) * 360;
      const [x1, y1] = polar(50, 50, 43, a);
      const [x2, y2] = polar(50, 50, 41, a);
      g.appendChild(el("line", { x1, y1, x2, y2, stroke: "#444", "stroke-width": 0.3 }));
    }
    const lab = el("text", { x: 50, y: 68, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 4, fill: "#7c7870", "letter-spacing": 0.3 });
    lab.textContent = "ALT \xd7 1000 FT";
    g.appendChild(lab);
    const long = el("line", { x1: 50, y1: 50, x2: 50, y2: 14, stroke: PHOSPHOR, "stroke-width": 1.2, "stroke-linecap": "round" });
    const short = el("line", { x1: 50, y1: 50, x2: 50, y2: 24, stroke: "#e8e6e1", "stroke-width": 2.2, "stroke-linecap": "round" });
    const longG = el("g", { transform: "rotate(0 50 50)" });
    const shortG = el("g", { transform: "rotate(0 50 50)" });
    longG.appendChild(long); shortG.appendChild(short);
    g.appendChild(shortG); g.appendChild(longG);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 2.6, fill: "#222" }));
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 1.1, fill: PHOSPHOR }));

    return function(p) {
      const feet = p * 10000;
      const longDeg = (feet % 1000) / 1000 * 360;
      const shortDeg = (feet / 10000) * 360;
      longG.setAttribute("transform", "rotate(" + longDeg + " 50 50)");
      shortG.setAttribute("transform", "rotate(" + shortDeg + " 50 50)");
    };
  }

  function airspeed(svg) {
    const g = el("g");
    svg.appendChild(g);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 48, fill: "#0a0c0d", stroke: "#2a2d2f", "stroke-width": 0.6 }));
    const TICKS = [0, 20, 40, 60, 80, 100, 120, 140];
    TICKS.forEach(function(v, i) {
      const a = -135 + (i / (TICKS.length - 1)) * 270;
      const [x1, y1] = polar(50, 50, 43, a);
      const [x2, y2] = polar(50, 50, 38, a);
      g.appendChild(el("line", { x1, y1, x2, y2, stroke: "#9a968d", "stroke-width": 0.7 }));
      const [tx, ty] = polar(50, 50, 32, a);
      const t = el("text", { x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "JetBrains Mono, monospace", "font-size": 5, fill: "#9a968d" });
      t.textContent = v;
      g.appendChild(t);
    });
    function arc(from, to, color, w, r) {
      w = w || 2.2; r = r || 46;
      const [x1, y1] = polar(50, 50, r, from);
      const [x2, y2] = polar(50, 50, r, to);
      const large = Math.abs(to - from) > 180 ? 1 : 0;
      const d = "M " + x1 + " " + y1 + " A " + r + " " + r + " 0 " + large + " 1 " + x2 + " " + y2;
      g.appendChild(el("path", { d, fill: "none", stroke: color, "stroke-width": w, "stroke-linecap": "butt" }));
    }
    arc(-135 + (40 / 140) * 270, -135 + (100 / 140) * 270, "#3a5a2a");
    arc(-135 + (100 / 140) * 270, -135 + (130 / 140) * 270, "#a38a1f");
    arc(-135 + (130 / 140) * 270 - 1, -135 + (140 / 140) * 270, "#8a2a2a");
    const lab = el("text", { x: 50, y: 68, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 4, fill: "#7c7870" });
    lab.textContent = "KNOTS";
    g.appendChild(lab);
    const needle = el("line", { x1: 50, y1: 50, x2: 50, y2: 12, stroke: PHOSPHOR, "stroke-width": 1.6, "stroke-linecap": "round" });
    const nG = el("g", { transform: "rotate(-135 50 50)" });
    nG.appendChild(needle);
    g.appendChild(nG);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 2.2, fill: "#222" }));
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 1, fill: PHOSPHOR }));

    return function(p) {
      const deg = -135 + p * 270;
      nG.setAttribute("transform", "rotate(" + deg + " 50 50)");
    };
  }

  function vario(svg) {
    const g = el("g");
    svg.appendChild(g);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 48, fill: "#0a0c0d", stroke: "#2a2d2f", "stroke-width": 0.6 }));
    const vals = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    vals.forEach(function(v) {
      const frac = (v + 5) / 10;
      const a = -135 + frac * 270;
      const [x1, y1] = polar(50, 50, 43, a);
      const [x2, y2] = polar(50, 50, 38, a);
      g.appendChild(el("line", { x1, y1, x2, y2, stroke: v === 0 ? PHOSPHOR : "#9a968d", "stroke-width": v === 0 ? 1 : 0.6 }));
      const [tx, ty] = polar(50, 50, 32, a);
      const t = el("text", { x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "JetBrains Mono, monospace", "font-size": 5, fill: v === 0 ? PHOSPHOR : "#9a968d" });
      t.textContent = Math.abs(v);
      g.appendChild(t);
    });
    const lab = el("text", { x: 50, y: 70, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 4, fill: "#7c7870" });
    lab.textContent = "VSI  KT";
    g.appendChild(lab);
    const up = el("text", { x: 30, y: 48, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 6, fill: "#6a8a4a" });
    up.textContent = "\u2191";
    const down = el("text", { x: 70, y: 48, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 6, fill: "#8a5a3a" });
    down.textContent = "\u2193";
    g.appendChild(up); g.appendChild(down);
    const needle = el("line", { x1: 50, y1: 50, x2: 50, y2: 10, stroke: PHOSPHOR, "stroke-width": 1.6, "stroke-linecap": "round" });
    const nG = el("g", { transform: "rotate(0 50 50)" });
    nG.appendChild(needle);
    g.appendChild(nG);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 2.2, fill: "#222" }));
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 1, fill: PHOSPHOR }));

    return function(p) {
      const val = Math.sin(p * Math.PI * 2.2) * 3.5;
      const frac = (val + 5) / 10;
      const deg = -135 + frac * 270;
      nG.setAttribute("transform", "rotate(" + deg + " 50 50)");
    };
  }

  function attitude(svg) {
    const g = el("g");
    svg.appendChild(g);
    const clipId = "att-clip-" + Math.random().toString(36).slice(2, 7);
    const defs = el("defs");
    const clip = el("clipPath", { id: clipId });
    clip.appendChild(el("circle", { cx: 50, cy: 50, r: 42 }));
    defs.appendChild(clip);
    g.appendChild(defs);
    g.appendChild(el("circle", { cx: 50, cy: 50, r: 48, fill: "#0a0c0d", stroke: "#2a2d2f", "stroke-width": 0.6 }));
    const horiz = el("g", { "clip-path": "url(#" + clipId + ")", transform: "rotate(0 50 50)" });
    const inner = el("g");
    horiz.appendChild(inner);
    inner.appendChild(el("rect", { x: -20, y: -20, width: 140, height: 70, fill: "#2a4a6a" }));
    inner.appendChild(el("rect", { x: -20, y: 50, width: 140, height: 70, fill: "#6a4a2a" }));
    inner.appendChild(el("line", { x1: -20, y1: 50, x2: 120, y2: 50, stroke: "#e8e6e1", "stroke-width": 0.8 }));
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const y = 50 + i * 7;
      const w = i % 2 === 0 ? 14 : 8;
      inner.appendChild(el("line", { x1: 50 - w / 2, y1: y, x2: 50 + w / 2, y2: y, stroke: "#e8e6e1", "stroke-width": 0.4 }));
    }
    g.appendChild(horiz);
    const craft = el("g");
    craft.appendChild(el("line", { x1: 30, y1: 50, x2: 42, y2: 50, stroke: PHOSPHOR, "stroke-width": 1.4 }));
    craft.appendChild(el("line", { x1: 58, y1: 50, x2: 70, y2: 50, stroke: PHOSPHOR, "stroke-width": 1.4 }));
    craft.appendChild(el("circle", { cx: 50, cy: 50, r: 1.2, fill: PHOSPHOR }));
    g.appendChild(craft);
    [-60, -45, -30, -15, 0, 15, 30, 45, 60].forEach(function(b) {
      const [x1, y1] = polar(50, 50, 42, b);
      const [x2, y2] = polar(50, 50, b === 0 ? 36 : 38, b);
      g.appendChild(el("line", { x1, y1, x2, y2, stroke: "#9a968d", "stroke-width": 0.6 }));
    });
    g.appendChild(el("path", { d: "M 50 12 L 47 7 L 53 7 Z", fill: PHOSPHOR }));

    return function(p) {
      const bank = Math.sin(p * Math.PI * 2) * 28;
      const pitch = Math.cos(p * Math.PI * 3) * 4;
      horiz.setAttribute("transform", "rotate(" + bank + " 50 50)");
      inner.setAttribute("transform", "translate(0 " + pitch + ")");
    };
  }

  const FACTORIES = { altimeter: altimeter, airspeed: airspeed, vario: vario, attitude: attitude };

  function createInstrument(el, kind) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.display = "block";
    el.appendChild(svg);
    const factory = FACTORIES[kind];
    if (!factory) throw new Error("Unknown instrument: " + kind);
    return factory(svg);
  }

  function mountRail(containerSel, kinds) {
    const container = document.querySelector(containerSel);
    if (!container) return [];
    const updaters = [];
    kinds.forEach(function(kind) {
      const wrap = document.createElement("div");
      wrap.className = "rail-gauge";
      container.appendChild(wrap);
      const label = document.createElement("div");
      label.className = "rail-label";
      label.textContent = kind.toUpperCase();
      wrap.appendChild(label);
      const update = createInstrument(wrap, kind);
      updaters.push(update);
    });
    return updaters;
  }

  let rawP = 0, curP = 0, rafId;
  function tick() {
    curP += (rawP - curP) * 0.12;
    if (window.__instrumentUpdaters) {
      window.__instrumentUpdaters.forEach(function(u) { u(curP); });
    }
    rafId = requestAnimationFrame(tick);
  }
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    rawP = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    const rail = document.querySelector(".instrument-rail");
    if (rail) {
      const visible = window.scrollY > window.innerHeight * 0.4;
      rail.classList.toggle("show", visible);
    }
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  window.DNInstruments = {
    mountRail: mountRail,
    createInstrument: createInstrument,
    setUpdaters: function(arr) { window.__instrumentUpdaters = arr; },
    start: function() {
      updateProgress();
      if (!rafId) tick();
    }
  };
})();
