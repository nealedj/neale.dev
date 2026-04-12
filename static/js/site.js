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
  // One full needle revolution = 10,000 ft (scroll top→bottom).
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
    //    Major tick at each number (every 36° = 1,000 ft)
    //    Medium tick at midpoint   (every 18° = 500 ft)
    //    Minor tick elsewhere      (every 7.2° = 200 ft)
    for (var i = 0; i < 50; i++) {
      var deg  = i * 7.2;
      var rad  = deg * Math.PI / 180;
      var isMajor = (i % 5 === 0);   // at each number (every 1,000 ft)
      var rOuter  = 51;
      var rInner = isMajor ? 40 : 46;
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
    //    Each number represents 1,000 ft.
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

    // ── "×1000 FT" label — two lines below centre, teal tint
    var lbl1 = svgEl('text', {
      x: 60, y: 82,
      'text-anchor': 'middle',
      'font-size': 5.5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 1
    });
    lbl1.textContent = '\u00d71000';   // ×1000
    svg.appendChild(lbl1);
    var lbl2 = svgEl('text', {
      x: 60, y: 89,
      'text-anchor': 'middle',
      'font-size': 5.5,
      fill: 'rgba(26,107,122,0.9)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 2
    });
    lbl2.textContent = 'FT';
    svg.appendChild(lbl2);

    // ── Needle group (appended last so it renders on top)
    var needleGroup = svgEl('g', { id: 'altimeter-needle-group' });

    // Long white needle — slim, tapers to a fine point at 12 o'clock
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,13 L58.8,58 L60,62 L61.2,58 Z',
      fill: 'white'
    }));

    // Short counterweight tail — slightly wider, darker
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,62 L58.5,71 L60,73.5 L61.5,71 Z',
      fill: 'rgba(200,200,200,0.7)'
    }));

    // Centre cap — small black circle with white ring, authentic look
    needleGroup.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 4,
      fill: '#111', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1
    }));

    svg.appendChild(needleGroup);

    // ── Scroll → needle rotation
    // One full revolution (360°) = 10,000 ft.
    // At scroll top: needle at 0 (pointing to "0" at 12 o'clock).
    // At scroll bottom: needle completes one full revolution = 10,000 ft.
    function updateNeedle() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
      var progress = scrollTop / docHeight;
      var angle    = progress * 360;
      needleGroup.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ', 60, 60)');
    }

    window.addEventListener('scroll', updateNeedle, { passive: true });
    updateNeedle();
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  // Guard against the script running after DOMContentLoaded has already fired
  // (e.g. if loaded async or cached).
  function boot() {
    initMetricCounters();
    initAltimeter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}());
