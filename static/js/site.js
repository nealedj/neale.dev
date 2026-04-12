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
  // An SVG altimeter in the sidebar whose needle tracks scroll progress.

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

    // Face
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 56,
      fill: '#0d2329', stroke: '#1a6b7a', 'stroke-width': 2
    }));

    // Inner decorative ring
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 49,
      fill: 'none', stroke: '#1a6b7a', 'stroke-width': '0.5', opacity: '0.35'
    }));

    // Tick marks — 36 total (every 10°), major every 30°
    for (var i = 0; i < 36; i++) {
      var rad   = (i * 10) * Math.PI / 180;
      var major = (i % 3 === 0);
      var r1    = major ? 42 : 46;
      svg.appendChild(svgEl('line', {
        x1: (60 + r1 * Math.sin(rad)).toFixed(2),
        y1: (60 - r1 * Math.cos(rad)).toFixed(2),
        x2: (60 + 52 * Math.sin(rad)).toFixed(2),
        y2: (60 - 52 * Math.cos(rad)).toFixed(2),
        stroke: major ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
        'stroke-width': major ? 1.5 : 0.75,
        'stroke-linecap': 'round'
      }));
    }

    // Numbers 0–9 (clockwise from 12 o'clock, every 36°)
    for (var n = 0; n < 10; n++) {
      var nRad = (n * 36) * Math.PI / 180;
      var r    = 36;
      var txt  = svgEl('text', {
        x: (60 + r * Math.sin(nRad)).toFixed(2),
        y: (60 - r * Math.cos(nRad) + 3).toFixed(2),
        'text-anchor': 'middle',
        'font-size': 8,
        fill: 'rgba(255,255,255,0.65)',
        'font-family': 'Saira Extra Condensed, sans-serif',
        'font-weight': 600
      });
      txt.textContent = n;
      svg.appendChild(txt);
    }

    // Needle group
    var needleGroup = svgEl('g', { id: 'altimeter-needle-group' });

    // Main needle (white, long, tapers to tip at 12 o'clock)
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,14 L57.8,59 L60,64 L62.2,59 Z',
      fill: 'white',
      opacity: '0.92'
    }));

    // Counter-weight tail (short, teal)
    needleGroup.appendChild(svgEl('path', {
      d: 'M60,64 L58.5,73 L60,75.5 L61.5,73 Z',
      fill: '#1a6b7a'
    }));

    // Centre cap
    needleGroup.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: 5,
      fill: '#1a6b7a', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 1
    }));

    svg.appendChild(needleGroup);

    // "ALT" label below centre
    var label = svgEl('text', {
      x: 60, y: 89,
      'text-anchor': 'middle',
      'font-size': 7,
      fill: 'rgba(26,107,122,0.75)',
      'font-family': 'Saira Extra Condensed, sans-serif',
      'letter-spacing': 2.5
    });
    label.textContent = 'ALT';
    svg.appendChild(label);

    container.appendChild(svg);

    // Scroll → needle rotation
    // Needle starts at 0° (pointing to "0" at 12 o'clock) and sweeps 324°
    // (nine full number increments × 36°) as you reach the bottom of the page.
    function updateNeedle() {
      var scrollTop   = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight   = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
      var progress    = scrollTop / docHeight;
      var angle       = progress * 324;
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
