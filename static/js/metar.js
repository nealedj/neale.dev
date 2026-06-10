// Live METAR — fills [data-metar] elements with the latest EGFF (Cardiff)
// observation from api.met.no, which serves CORS-open aviation weather.
// If the fetch fails the element keeps its static fallback content.
// Cached in sessionStorage for 15 minutes to be polite to the API.
(function () {
  var els = document.querySelectorAll("[data-metar]");
  if (!els.length) return;

  function show(raw) {
    els.forEach(function (el) { el.textContent = raw; });
  }

  var CACHE_KEY = "dn-metar-egff", TTL = 15 * 60 * 1000;
  try {
    var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.t < TTL) { show(cached.raw); return; }
  } catch (e) { /* storage unavailable — fetch fresh */ }

  fetch("https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=EGFF")
    .then(function (r) {
      if (!r.ok) throw new Error("metar http " + r.status);
      return r.text();
    })
    .then(function (text) {
      var lines = text.trim().split("\n").filter(function (l) { return l.trim(); });
      var raw = lines[lines.length - 1].replace(/=\s*$/, "").trim();
      if (!/^EGFF \d{6}Z/.test(raw)) return;
      show(raw);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), raw: raw })); } catch (e) {}
    })
    .catch(function () { /* keep static fallback */ });
})();
