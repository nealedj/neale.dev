// Drum counters — stat digits roll into place like the mechanical
// Veeder-Root drum readout on an altimeter. Element text is the final
// value; each digit becomes a rolling column, other characters stay static.
window.DNDrums = (function () {
  function build(el) {
    var text = el.textContent.trim();
    el.textContent = "";
    el.classList.add("t-drums");
    var cols = [];
    text.split("").forEach(function (ch) {
      if (ch >= "0" && ch <= "9") {
        var win = document.createElement("span");
        win.className = "drum";
        var col = document.createElement("span");
        col.className = "drum-col";
        for (var d = 0; d <= 9; d++) {
          var s = document.createElement("span");
          s.textContent = d;
          col.appendChild(s);
        }
        win.appendChild(col);
        el.appendChild(win);
        cols.push({ col: col, digit: parseInt(ch, 10) });
      } else {
        var st = document.createElement("span");
        st.textContent = ch;
        el.appendChild(st);
      }
    });
    return cols;
  }

  function roll(cols) {
    cols.forEach(function (c, i) {
      setTimeout(function () {
        c.col.style.transform = "translateY(" + (-c.digit) + "em)";
      }, 120 * i + 150);
    });
  }

  function init(selector) {
    var els = document.querySelectorAll(selector || "[data-drums]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        build(el).forEach(function (c) {
          c.col.style.transition = "none";
          c.col.style.transform = "translateY(" + (-c.digit) + "em)";
        });
      });
      return;
    }
    var pending = new Map();
    els.forEach(function (el) { pending.set(el, build(el)); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        roll(pending.get(e.target) || []);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  return { init: init };
})();
