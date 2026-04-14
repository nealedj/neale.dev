(function () {
  'use strict';

  // ── Metric Counters ──────────────────────────────────────────────────────
  // Counts up each metric value when the strip scrolls into view.

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, duration) {
    var target   = parseFloat(el.getAttribute('data-target'));
    var prefix   = el.getAttribute('data-prefix') || '';
    var suffix   = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var start    = performance.now();

    function update(now) {
      var progress = Math.min((now - start) / duration, 1);
      var value    = target * easeOutCubic(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) { requestAnimationFrame(update); }
    }
    requestAnimationFrame(update);
  }

  function initMetricCounters() {
    var strip = document.querySelector('.metrics-strip');
    if (!strip) { return; }

    var counters = strip.querySelectorAll('[data-target]');
    if (!counters.length) { return; }

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show final values
      counters.forEach(function (el) {
        var p = el.getAttribute('data-prefix') || '';
        var s = el.getAttribute('data-suffix') || '';
        var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
        el.textContent = p + parseFloat(el.getAttribute('data-target')).toFixed(d) + s;
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counters.forEach(function (el) { animateCounter(el, 1800); });
          observer.disconnect();
        }
      });
    }, { threshold: 0.6 });

    observer.observe(strip);
  }

  // ── Altimeter ────────────────────────────────────────────────────────────
  // SVG altimeter styled after a standard Kollsman-type GA pressure altimeter.
  // Long needle (hundreds): 10 revolutions scroll top→bottom.
  // Short needle (thousands): 1 revolution scroll top→bottom.
  // Numbers 0–9 represent ×1,000 ft; 50 tick divisions (one per 200 ft).

  function initAltimeter() {
    var container = document.getElementById('altimeter-container');
    if (!container) { return; }

    var NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    var svg = svgEl('svg', { viewBox: '0 0 120 120', class: 'altimeter-svg' });

    // ── Outer bezel ring
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 58,
      fill: '#1a1a1a', stroke: '#555', 'stroke-width': 1.5
    }));

    // ── Black instrument face
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 54,
      fill: '#0a0a0a'
    }));

    // ── Tick marks: 50 divisions per revolution (every 7.2°)
    for (var i = 0; i < 50; i++) {
      var deg  = i * 7.2;
      var rad  = deg * Math.PI / 180;
      var isMajor = (i % 5 === 0);
      var rOuter  = 51;
      var rInner  = isMajor ? 40 : 46;
      svg.appendChild(svgEl('line', {
        x1: (60 + rInner * Math.sin(rad)).toFixed(2),
        y1: (60 - rInner * Math.cos(rad)).toFixed(2),
        x2: (60 + rOuter * Math.sin(rad)).toFixed(2),
        y2: (60 - rOuter * Math.cos(rad)).toFixed(2),
        stroke: 'white',
        'stroke-width': isMajor ? 1.5 : 0.75,
        'stroke-linecap': 'round',
        opacity: isMajor ? 1 : 0.7
      }));
    }

    // ── Numbers 0–9 (clockwise from 12 o'clock, every 36°, radius 32)
    for (var n = 0; n < 10; n++) {
      var nRad = (n * 36) * Math.PI / 180;
      var rN   = 32;
      var txt  = svgEl('text', {
        x: (60 + rN * Math.sin(nRad)).toFixed(2),
        y: (60 - rN * Math.cos(nRad) + 3.5).toFixed(2),
        'text-anchor': 'middle',
        'font-size': 9,
        fill: 'white',
        'font-family': 'Saira Extra Condensed, sans-serif',
        'font-weight': '700'
      });
      txt.textContent = n;
      svg.appendChild(txt);
    }

    // ── Kollsman pressure window — right side (~3 o'clock), inset into face
    svg.appendChild(svgEl('rect', {
      x: 86, y: 51, width: 22, height: 18, rx: 1.5,
      fill: '#0d0d0d', stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 0.75
    }));
    // Shadow bands at top/bottom to suggest drum scrolling
    svg.appendChild(svgEl('rect', {
      x: 86, y: 51, width: 22, height: 4.5,
      fill: 'rgba(0,0,0,0.65)'
    }));
    svg.appendChild(svgEl('rect', {
      x: 86, y: 64.5, width: 22, height: 4.5,
      fill: 'rgba(0,0,0,0.65)'
    }));
    // Centre divider line
    svg.appendChild(svgEl('line', {
      x1: 86, y1: 60, x2: 108, y2: 60,
      stroke: 'rgba(255,255,255,0.15)', 'stroke-width': 0.5
    }));
    // Pressure value
    var pressText = svgEl('text', {
      x: 97, y: 59.5,
      'text-anchor': 'middle',
      'font-size': 6.5,
      fill: 'rgba(255,255,255,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'font-weight': '700',
      'letter-spacing': 0.3
    });
    pressText.textContent = '1013';
    svg.appendChild(pressText);
    // hPa sub-label
    var pressLabel = svgEl('text', {
      x: 97, y: 65.5,
      'text-anchor': 'middle',
      'font-size': 4,
      fill: 'rgba(255,255,255,0.45)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 0.5
    });
    pressLabel.textContent = 'hPa';
    svg.appendChild(pressLabel);

    // ── "ALT" label — horizontally centred, just above the dial centre
    var altLbl = svgEl('text', {
      x: 60, y: 57,
      'text-anchor': 'middle',
      'font-size': 6,
      fill: 'rgba(255,255,255,0.8)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'font-weight': '700',
      'letter-spacing': 2
    });
    altLbl.textContent = 'ALT';
    svg.appendChild(altLbl);

    // ── "×1000 FT" label — below centre, teal tint
    var lbl1 = svgEl('text', {
      x: 60, y: 76,
      'text-anchor': 'middle',
      'font-size': 5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 1
    });
    lbl1.textContent = '\u00d71000';
    svg.appendChild(lbl1);
    var lbl2 = svgEl('text', {
      x: 60, y: 83,
      'text-anchor': 'middle',
      'font-size': 5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 2
    });
    lbl2.textContent = 'FT';
    svg.appendChild(lbl2);

    // ── Ten-thousands needle (stub — 0→3 over full scroll = 108°)
    var tenmilNeedleGroup = svgEl('g', { id: 'altimeter-tenmil-needle' });
    tenmilNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,43 L59.2,57 L60,60 L60.8,57 Z',
      fill: 'rgba(255,255,255,0.65)'
    }));
    tenmilNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,60 L59.4,64 L60,65.5 L60.6,64 Z',
      fill: 'rgba(150,150,150,0.45)'
    }));
    svg.appendChild(tenmilNeedleGroup);

    // ── Short needle (thousands — 3 revolutions over full scroll)
    var shortNeedleGroup = svgEl('g', { id: 'altimeter-short-needle' });
    shortNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,27 L58.8,56 L60,59 L61.2,56 Z',
      fill: 'rgba(255,255,255,0.82)'
    }));
    shortNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,59 L59,65 L60,67 L61,65 Z',
      fill: 'rgba(180,180,180,0.55)'
    }));
    svg.appendChild(shortNeedleGroup);

    // ── Long needle (hundreds — 30 revolutions over full scroll)
    var longNeedleGroup = svgEl('g', { id: 'altimeter-needle-group' });
    longNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,13 L58.8,58 L60,62 L61.2,58 Z',
      fill: 'white'
    }));
    longNeedleGroup.appendChild(svgEl('path', {
      d: 'M60,62 L58.5,71 L60,73.5 L61.5,71 Z',
      fill: 'rgba(200,200,200,0.7)'
    }));
    // Centre cap
    longNeedleGroup.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 4,
      fill: '#111', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1
    }));
    svg.appendChild(longNeedleGroup);
    container.appendChild(svg);

    // ── Scroll → needle rotation
    // 30,000 ft ascent: long=30 rev (hundreds), short=3 rev (thousands),
    // tenmil=108° (0→3 on scale = ten-thousands)
    function updateNeedle() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
      var progress = scrollTop / docHeight;
      longNeedleGroup.setAttribute('transform',
        'rotate(' + (progress * 10800).toFixed(1) + ', 60, 60)');
      shortNeedleGroup.setAttribute('transform',
        'rotate(' + (progress * 1080).toFixed(1) + ', 60, 60)');
      tenmilNeedleGroup.setAttribute('transform',
        'rotate(' + (progress * 108).toFixed(1) + ', 60, 60)');
    }

    window.addEventListener('scroll', updateNeedle, { passive: true });
    updateNeedle();
  }

  // ── Variometer ───────────────────────────────────────────────────────────
  // Displays scroll speed as a VSI: 0 at 9-o'clock (left), ±10 knots at
  // ±120° from neutral. Scroll down → needle up; scroll up → needle down.
  // 12° per knot; smooth animation with decay when scrolling stops.

  function initVariometer() {
    var container = document.getElementById('variometer-container');
    if (!container) { return; }

    var NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    var svg = svgEl('svg', { viewBox: '0 0 120 120', class: 'variometer-svg' });

    // ── Outer bezel ring
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 58,
      fill: '#1a1a1a', stroke: '#555', 'stroke-width': 1.5
    }));

    // ── Black instrument face
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 54,
      fill: '#0a0a0a'
    }));

    // ── Scale: 0 at 270° (9-o'clock), 12°/knot, range ±10 knots = ±120°
    //    Minor ticks every 1 knot; major (longer) at every 2 knots; longest at 0.
    for (var v = -10; v <= 10; v++) {
      var rad    = (270 + v * 12) * Math.PI / 180;
      var isMajor = (v % 2 === 0);
      var isZero  = (v === 0);
      var rOuter  = 51;
      var rInner  = isZero ? 39 : (isMajor ? 43 : 47);
      svg.appendChild(svgEl('line', {
        x1: (60 + rInner * Math.sin(rad)).toFixed(2),
        y1: (60 - rInner * Math.cos(rad)).toFixed(2),
        x2: (60 + rOuter * Math.sin(rad)).toFixed(2),
        y2: (60 - rOuter * Math.cos(rad)).toFixed(2),
        stroke: 'white',
        'stroke-width': (isZero || isMajor) ? 1.5 : 0.75,
        'stroke-linecap': 'round',
        opacity: isMajor ? 1 : 0.7
      }));
    }

    // ── Numbers at every 2 knots — show absolute value (both arcs read 0–10)
    for (var n = -10; n <= 10; n += 2) {
      var nRad = (270 + n * 12) * Math.PI / 180;
      var lbl  = svgEl('text', {
        x: (60 + 34 * Math.sin(nRad)).toFixed(2),
        y: (60 - 34 * Math.cos(nRad) + 3).toFixed(2),
        'text-anchor': 'middle',
        'font-size': n === 0 ? 8 : 7,
        fill: 'white',
        'font-family': 'Saira Extra Condensed, sans-serif',
        'font-weight': '700'
      });
      lbl.textContent = String(Math.abs(n));
      svg.appendChild(lbl);
    }

    // ── "knots" label — right of centre in the scale-free gap (≈3-o'clock)
    var knotsLbl = svgEl('text', {
      x: 80, y: 63,
      'text-anchor': 'middle',
      'font-size': 5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 0.5
    });
    knotsLbl.textContent = 'knots';
    svg.appendChild(knotsLbl);

    // ── Needle (drawn pointing up; set to rotate(270) = 9-o'clock at 0 knots)
    var needleGroup = svgEl('g', { id: 'variometer-needle-group' });
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,13 L58.8,58 L60,62 L61.2,58 Z',
      fill: 'white'
    }));
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,62 L58.5,71 L60,73.5 L61.5,71 Z',
      fill: 'rgba(200,200,200,0.7)'
    }));
    needleGroup.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 4,
      fill: '#111', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1
    }));

    svg.appendChild(needleGroup);
    container.appendChild(svg);

    needleGroup.setAttribute('transform', 'rotate(270, 60, 60)');

    // ── Scroll velocity → target knots
    var lastScrollY    = window.pageYOffset || document.documentElement.scrollTop;
    var lastScrollTime = performance.now();
    var targetKnots    = 0;
    var currentKnots   = 0;
    var decayTimer     = null;

    window.addEventListener('scroll', function () {
      var now     = performance.now();
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var dt      = now - lastScrollTime;
      var dy      = scrollY - lastScrollY;

      if (dt > 0 && dt < 250) {
        // 3.5 px/ms ≈ max (10 knots); clamp to ±10
        targetKnots = Math.max(-10, Math.min(10, (dy / dt) * 3.5));
      }

      lastScrollY    = scrollY;
      lastScrollTime = now;

      // Return to 0 shortly after scrolling stops
      clearTimeout(decayTimer);
      decayTimer = setTimeout(function () { targetKnots = 0; }, 150);
    }, { passive: true });

    // ── Animation loop — lerp toward target for smooth, slightly-lagged movement
    (function tick() {
      currentKnots += (targetKnots - currentKnots) * 0.1;
      if (Math.abs(currentKnots) < 0.05) { currentKnots = 0; }
      needleGroup.setAttribute('transform',
        'rotate(' + (270 + currentKnots * 12).toFixed(1) + ', 60, 60)');
      requestAnimationFrame(tick);
    }());
  }

  // ── Shared instrument state ──────────────────────────────────────────────
  // ASI writes currentKt; Artificial Horizon reads it for pitch angle.
  var asiState = { currentKt: 80 };

  // ── Airspeed Indicator ───────────────────────────────────────────────────
  // Resting at 80 kt. Scrolling causes a gradual drop toward 45 kt.
  // Scale: 0–200 kt clockwise, starting at ~7-o'clock (210°).
  // Green arc: 0–108 kt. Yellow arc: 108–158 kt. White arc: ~40–85 kt.
  // Needle is driven by lerp toward targetSpeed; scroll resets decay timer.

  function initASI() {
    var container = document.getElementById('asi-container');
    if (!container) { return; }

    var NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    // Scale geometry: 0 kt at 210°, 200 kt at 570° (360° sweep)
    // So: angle(kt) = 210 + (kt / 200) * 360
    function ktToAngle(kt) {
      return 210 + (kt / 200) * 360;
    }

    function polarToXY(cx, cy, r, angleDeg) {
      var rad = angleDeg * Math.PI / 180;
      return {
        x: cx + r * Math.sin(rad),
        y: cy - r * Math.cos(rad)
      };
    }

    function describeArc(cx, cy, r, startAngle, endAngle) {
      var s = polarToXY(cx, cy, r, startAngle);
      var e = polarToXY(cx, cy, r, endAngle);
      var large = (endAngle - startAngle > 180) ? 1 : 0;
      return 'M ' + s.x.toFixed(2) + ' ' + s.y.toFixed(2) +
             ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' +
             e.x.toFixed(2) + ' ' + e.y.toFixed(2);
    }

    var svg = svgEl('svg', { viewBox: '0 0 120 120', class: 'asi-svg' });

    // Outer bezel
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 58,
      fill: '#1a1a1a', stroke: '#555', 'stroke-width': 1.5
    }));

    // Face
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 54,
      fill: '#0a0a0a'
    }));

    // ── Coloured arcs (radius 50, drawn before ticks so ticks sit on top)
    // Green arc: 0–108 kt
    svg.appendChild(svgEl('path', {
      d: describeArc(60, 60, 50, ktToAngle(0), ktToAngle(108)),
      stroke: '#2ecc40', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'butt'
    }));
    // Yellow arc: 108–158 kt
    svg.appendChild(svgEl('path', {
      d: describeArc(60, 60, 50, ktToAngle(108), ktToAngle(158)),
      stroke: '#ffdc00', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'butt'
    }));
    // Red line: 158 kt (Vne)
    svg.appendChild(svgEl('path', {
      d: describeArc(60, 60, 50, ktToAngle(158), ktToAngle(163)),
      stroke: '#ff4136', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'butt'
    }));

    // ── Tick marks every 10 kt (major) and 5 kt (minor)
    for (var kt = 0; kt <= 200; kt += 5) {
      var isMajor = (kt % 20 === 0);
      var isMed   = (kt % 10 === 0);
      var rOuter  = 49;
      var rInner  = isMajor ? 38 : (isMed ? 42 : 46);
      var ang     = ktToAngle(kt);
      var p1      = polarToXY(60, 60, rInner, ang);
      var p2      = polarToXY(60, 60, rOuter, ang);
      svg.appendChild(svgEl('line', {
        x1: p1.x.toFixed(2), y1: p1.y.toFixed(2),
        x2: p2.x.toFixed(2), y2: p2.y.toFixed(2),
        stroke: 'white',
        'stroke-width': isMajor ? 1.5 : (isMed ? 1 : 0.6),
        'stroke-linecap': 'round',
        opacity: isMajor ? 1 : 0.75
      }));
    }

    // ── Numbers every 20 kt at radius 30
    for (var n = 0; n <= 200; n += 20) {
      var nAng = ktToAngle(n);
      var nPos = polarToXY(60, 60, 30, nAng);
      var txt  = svgEl('text', {
        x: nPos.x.toFixed(2),
        y: (nPos.y + 3.5).toFixed(2),
        'text-anchor': 'middle',
        'font-size': n === 0 ? 7 : 8,
        fill: 'white',
        'font-family': 'Saira Extra Condensed, sans-serif',
        'font-weight': '700'
      });
      txt.textContent = String(n);
      svg.appendChild(txt);
    }

    // ── Labels
    var asiLbl = svgEl('text', {
      x: 60, y: 54,
      'text-anchor': 'middle',
      'font-size': 5.5,
      fill: 'rgba(255,255,255,0.8)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'font-weight': '700',
      'letter-spacing': 1.5
    });
    asiLbl.textContent = 'AIRSPEED';
    svg.appendChild(asiLbl);

    var ktsLbl = svgEl('text', {
      x: 60, y: 72,
      'text-anchor': 'middle',
      'font-size': 5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 0.5
    });
    ktsLbl.textContent = 'KNOTS';
    svg.appendChild(ktsLbl);

    // ── Needle
    var needleGroup = svgEl('g', { id: 'asi-needle-group' });
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,14 L58.8,58 L60,62 L61.2,58 Z',
      fill: 'white'
    }));
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,62 L58.5,71 L60,73.5 L61.5,71 Z',
      fill: 'rgba(200,200,200,0.7)'
    }));
    needleGroup.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 4,
      fill: '#111', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1
    }));
    svg.appendChild(needleGroup);
    container.appendChild(svg);

    // ── State: resting 80 kt, drops/rises on scroll direction
    var RESTING_KT = 80;
    var SCROLL_KT  = 100;
    asiState.currentKt = RESTING_KT;
    var targetKt   = RESTING_KT;
    var decayTimer = null;

    function setNeedle(kt) {
      var angle = ktToAngle(kt);
      needleGroup.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ', 60, 60)');
    }

    setNeedle(asiState.currentKt);

    var lastAsiScrollY = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var dy = scrollY - lastAsiScrollY;
      lastAsiScrollY = scrollY;

      if (dy < 0) {
        targetKt = SCROLL_KT;      // scrolling up = ascending = faster
      } else if (dy > 0) {
        targetKt = 45;             // scrolling down = descending = slower
      }
      clearTimeout(decayTimer);
      decayTimer = setTimeout(function () { targetKt = RESTING_KT; }, 200);
    }, { passive: true });

    (function tick() {
      asiState.currentKt += (targetKt - asiState.currentKt) * 0.04;
      if (Math.abs(asiState.currentKt - targetKt) < 0.1) { asiState.currentKt = targetKt; }
      setNeedle(asiState.currentKt);
      requestAnimationFrame(tick);
    }());
  }

  // ── Artificial Horizon ───────────────────────────────────────────────────
  // Pitch is derived from asiState.currentKt: slower speed = nose high = more sky.
  // pitchOffset = (80 - currentKt) * 0.65 px  (positive = horizon moves down).
  // 45 kt → +22.75 px (lots of blue).  80 kt → 0 (level).  100 kt → −13 px (more brown).

  function initAI() {
    var container = document.getElementById('ai-container');
    if (!container) { return; }

    var NS = 'http://www.w3.org/2000/svg';
    function svgEl(tag, attrs) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      return node;
    }

    var svg = svgEl('svg', { viewBox: '0 0 120 120', class: 'ai-svg' });

    // Clip path: circular face at r=53
    var defs = svgEl('defs', {});
    var clip = svgEl('clipPath', { id: 'ai-pitch-clip' });
    clip.appendChild(svgEl('circle', { cx: 60, cy: 60, r: 53 }));
    defs.appendChild(clip);
    svg.appendChild(defs);

    // Outer bezel
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 58,
      fill: '#1a1a1a', stroke: '#555', 'stroke-width': 1.5
    }));

    // ── Moving pitch group (clipped to circular face) ─────────────────────
    // The clip-path must be on a FIXED outer group; the transform on an INNER group.
    // If clip-path and transform are on the same element the clip translates with it,
    // leaving a gap behind the moving content.
    var clipGroup  = svgEl('g', { 'clip-path': 'url(#ai-pitch-clip)' });
    var pitchGroup = svgEl('g', { id: 'ai-pitch-group' });
    clipGroup.appendChild(pitchGroup);

    // Sky — oversized so no gap appears at any pitch offset
    pitchGroup.appendChild(svgEl('rect', {
      x: -200, y: -300, width: 520, height: 560,
      fill: '#2872b5'
    }));
    // Ground — oversized so no gap appears at any pitch offset
    pitchGroup.appendChild(svgEl('rect', {
      x: -200, y: 60, width: 520, height: 500,
      fill: '#7a4f12'
    }));

    // Horizon line
    pitchGroup.appendChild(svgEl('line', {
      x1: -10, y1: 60, x2: 130, y2: 60,
      stroke: 'white', 'stroke-width': 1.5
    }));

    // Pitch reference lines: ±10° and ±20° (12 px per 10°)
    [
      { dy: -24, w: 32, deg: 20 },
      { dy: -12, w: 20, deg: 10 },
      { dy:  12, w: 20, deg: 10 },
      { dy:  24, w: 32, deg: 20 }
    ].forEach(function (pl) {
      var y = 60 + pl.dy;
      pitchGroup.appendChild(svgEl('line', {
        x1: (60 - pl.w / 2), y1: y,
        x2: (60 + pl.w / 2), y2: y,
        stroke: 'white', 'stroke-width': 1, 'stroke-linecap': 'round'
      }));
      [-1, 1].forEach(function (side) {
        var lbl = svgEl('text', {
          x: (60 + side * (pl.w / 2 + 2)).toFixed(1),
          y: (y + 3.5).toFixed(1),
          'text-anchor': side < 0 ? 'end' : 'start',
          'font-size': 5.5,
          fill: 'white',
          'font-family': 'Saira Extra Condensed, sans-serif',
          'font-weight': '700'
        });
        lbl.textContent = String(pl.deg);
        pitchGroup.appendChild(lbl);
      });
    });

    svg.appendChild(clipGroup);

    // ── Masking ring: covers any pitchGroup overflow beyond the face edge ──
    // Filled donut from r=53 (face edge) to r=58 (bezel inner), drawn after the
    // pitch group so content can never bleed into the bezel.
    svg.appendChild(svgEl('path', {
      d: 'M 118,60 A 58,58 0 1,0 2,60 A 58,58 0 1,0 118,60 Z ' +
         'M 113,60 A 53,53 0 1,0 7,60 A 53,53 0 1,0 113,60 Z',
      fill: '#1a1a1a',
      'fill-rule': 'evenodd'
    }));

    // ── Bank angle ticks (fixed, drawn over the pitch group) ─────────────
    [10, 20, 30, 45, 60].forEach(function (a) {
      var isMajor = (a === 30 || a === 45);
      [-1, 1].forEach(function (sign) {
        var rad = (-90 + sign * a) * Math.PI / 180;
        var rOuter = 53, rInner = isMajor ? 46 : 50;
        svg.appendChild(svgEl('line', {
          x1: (60 + rOuter * Math.cos(rad)).toFixed(2),
          y1: (60 + rOuter * Math.sin(rad)).toFixed(2),
          x2: (60 + rInner * Math.cos(rad)).toFixed(2),
          y2: (60 + rInner * Math.sin(rad)).toFixed(2),
          stroke: 'white',
          'stroke-width': isMajor ? 1.5 : 1,
          'stroke-linecap': 'round'
        }));
      });
    });

    // Bank reference: downward triangle at 12 o'clock
    svg.appendChild(svgEl('polygon', {
      points: '57,8 63,8 60,14',
      fill: 'white'
    }));

    // ── Fixed aircraft symbol (orange) ────────────────────────────────────
    svg.appendChild(svgEl('line', {
      x1: 28, y1: 60, x2: 53, y2: 60,
      stroke: '#e87800', 'stroke-width': 3, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('line', {
      x1: 67, y1: 60, x2: 92, y2: 60,
      stroke: '#e87800', 'stroke-width': 3, 'stroke-linecap': 'round'
    }));
    svg.appendChild(svgEl('rect', {
      x: 56.5, y: 57.5, width: 7, height: 5,
      fill: '#e87800', rx: 1
    }));

    // Bezel ring (drawn last to mask any overflow)
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 58,
      fill: 'none', stroke: '#444', 'stroke-width': 4
    }));

    container.appendChild(svg);

    // ── Animation: read asiState.currentKt each frame ─────────────────────
    (function tick() {
      // Higher speed = nose down = horizon moves UP = more brown.
      // Always more brown than blue (horizon always above centre).
      // 45 kt  → offset = −5  (horizon 5px above centre, just barely more brown)
      // 80 kt  → offset = −16 (horizon 16px above centre, lots of brown)
      // 100 kt → offset = −22 (horizon 22px above centre, maximum brown)
      var offset = -(asiState.currentKt - 45) * 0.31 - 5;
      pitchGroup.setAttribute('transform', 'translate(0,' + offset.toFixed(1) + ')');
      requestAnimationFrame(tick);
    }());
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  // Guard against the script running after DOMContentLoaded has already fired
  // (e.g. if loaded async or cached).
  function boot() {
    initMetricCounters();
    initAltimeter();
    initVariometer();
    initASI();
    initAI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}());
