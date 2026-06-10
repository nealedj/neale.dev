// Tweaks: accent hue, density, instrument rail, scanlines
(function () {
  var state = {
    accentHue: 75,
    density: "roomy",
    rail: true,
    scanlines: true,
    coordinates: true
  };

  function apply() {
    document.documentElement.style.setProperty("--phosphor", "oklch(0.82 0.15 " + state.accentHue + ")");
    document.documentElement.style.setProperty("--phosphor-dim", "oklch(0.82 0.15 " + state.accentHue + " / 0.35)");
    document.documentElement.style.setProperty("--phosphor-glow", "oklch(0.82 0.15 " + state.accentHue + " / 0.15)");
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
  }

  function buildPanel() {
    var panel = document.createElement("div");
    panel.className = "tweaks";
    panel.innerHTML = [
      '<h5><span>Tweaks</span></h5>',
      '<div class="tweak-row">',
        '<label>Accent</label>',
        '<div class="tweak-swatches">',
          [75, 145, 45, 260, 320].map(function(h) {
            return '<button data-hue="' + h + '" style="background: oklch(0.82 0.15 ' + h + ');"></button>';
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

  var panel = buildPanel();
  apply();

  window.addEventListener("message", function(e) {
    if (!e.data || typeof e.data !== "object") return;
    if (e.data.type === "__activate_edit_mode") panel.classList.add("show");
    if (e.data.type === "__deactivate_edit_mode") panel.classList.remove("show");
  });
})();
