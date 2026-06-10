// Tweaks: panel lighting (day/night), accent hue, density, instrument rail,
// chart grid, coordinates. Opened from the fixed TWEAKS launcher; state
// persists across pages via localStorage.
(function () {
  var STORE = "dn-tweaks";

  var state = {
    lighting: "day",
    accentHue: 75,
    density: "roomy",
    rail: true,
    scanlines: true,
    coordinates: true
  };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object") {
      Object.keys(state).forEach(function (k) {
        if (k in saved) state[k] = saved[k];
      });
    }
  } catch (e) { /* storage unavailable — defaults stand */ }

  function accent() {
    // Night = red cockpit lighting: the accent is forced to a dimmed red
    // regardless of the chosen day hue, like turning the panel lights down.
    if (state.lighting === "night") return { l: 0.66, c: 0.19, h: 25 };
    return { l: 0.82, c: 0.15, h: state.accentHue };
  }

  function apply() {
    var a = accent();
    var base = a.l + " " + a.c + " " + a.h;
    document.documentElement.style.setProperty("--phosphor", "oklch(" + base + ")");
    document.documentElement.style.setProperty("--phosphor-dim", "oklch(" + base + " / 0.35)");
    document.documentElement.style.setProperty("--phosphor-glow", "oklch(" + base + " / 0.12)");
    document.body.dataset.lighting = state.lighting;
    document.body.dataset.density = state.density;
    document.body.dataset.scanlines = state.scanlines ? "on" : "off";
    document.querySelectorAll(".instrument-rail").forEach(function(r) {
      r.classList.toggle("hidden", !state.rail);
    });
    document.querySelectorAll("[data-coord]").forEach(function(c) {
      c.style.display = state.coordinates ? "" : "none";
    });
  }

  function set(key, value) {
    state[key] = value;
    apply();
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }

  function buildPanel() {
    var panel = document.createElement("div");
    panel.className = "tweaks";
    panel.innerHTML = [
      '<h5>Tweaks</h5>',
      '<div class="tweak-row">',
        '<label>Lighting</label>',
        '<button data-toggle-lighting></button>',
      '</div>',
      '<div class="tweak-row">',
        '<label>Accent</label>',
        '<div class="tweak-swatches">',
          [75, 145, 45, 260, 320].map(function(h) {
            return '<button data-hue="' + h + '" aria-label="Accent hue ' + h + '" style="background: oklch(0.82 0.15 ' + h + ');"></button>';
          }).join(""),
        '</div>',
      '</div>',
      '<div class="tweak-row">',
        '<label>Density</label>',
        '<select data-k="density">',
          '<option value="roomy">Roomy</option>',
          '<option value="compact">Compact</option>',
        '</select>',
      '</div>',
      '<div class="tweak-row"><label>Instrument rail</label><button data-toggle="rail"></button></div>',
      '<div class="tweak-row"><label>Chart grid</label><button data-toggle="scanlines"></button></div>',
      '<div class="tweak-row"><label>Coordinates</label><button data-toggle="coordinates"></button></div>'
    ].join("");
    document.body.appendChild(panel);

    var lightBtn = panel.querySelector("[data-toggle-lighting]");
    function syncLight() { lightBtn.textContent = state.lighting === "night" ? "Night" : "Day"; }
    syncLight();
    lightBtn.addEventListener("click", function() {
      set("lighting", state.lighting === "night" ? "day" : "night");
      syncLight();
    });

    panel.querySelectorAll("[data-hue]").forEach(function(b) {
      b.addEventListener("click", function() { set("accentHue", parseInt(b.dataset.hue, 10)); });
    });
    panel.querySelector("[data-k=density]").addEventListener("change", function(e) {
      set("density", e.target.value);
    });
    panel.querySelectorAll("[data-toggle]").forEach(function(b) {
      var k = b.dataset.toggle;
      var sync = function() { b.textContent = state[k] ? "On" : "Off"; };
      sync();
      b.addEventListener("click", function() { set(k, !state[k]); sync(); });
    });
    panel.querySelector("[data-k=density]").value = state.density;
    return panel;
  }

  function buildLauncher(panel) {
    var btn = document.createElement("button");
    btn.className = "tweaks-launcher";
    btn.setAttribute("aria-label", "Open the tweaks panel");
    btn.textContent = "Tweaks";
    document.body.appendChild(btn);
    function sync(open) {
      btn.textContent = open ? "Close" : "Tweaks";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    sync(false);
    btn.addEventListener("click", function() {
      sync(panel.classList.toggle("show"));
    });
    return { sync: sync };
  }

  var panel = buildPanel();
  var launcher = buildLauncher(panel);
  apply();

  window.addEventListener("message", function(e) {
    if (!e.data || typeof e.data !== "object") return;
    if (e.data.type === "__activate_edit_mode") { panel.classList.add("show"); launcher.sync(true); }
    if (e.data.type === "__deactivate_edit_mode") { panel.classList.remove("show"); launcher.sync(false); }
  });
})();
