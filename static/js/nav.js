// Site navigation: the mobile menu toggle, and — on pages whose nav links
// point at sections of the current page (the homepage) — highlighting the
// link for the section in view.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("is-open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-nav")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  var spy = [];
  document.querySelectorAll(".nav-links a[href*='#']").forEach(function (a) {
    var url = new URL(a.href);
    if (url.pathname !== location.pathname) return;
    var el = document.getElementById(url.hash.slice(1));
    if (el) spy.push({ a: a, el: el });
  });
  if (!spy.length) return;

  function update() {
    var active = null;
    spy.forEach(function (s) {
      if (s.el.getBoundingClientRect().top < window.innerHeight * 0.4) active = s;
    });
    spy.forEach(function (s) { s.a.classList.toggle("is-active", s === active); });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();
