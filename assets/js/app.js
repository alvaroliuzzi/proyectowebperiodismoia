/*  PeriodismoIA 2026 — Runtime compartido
 *  Scroll reveal (.reveal -> .visible). Respeta prefers-reduced-motion.
 */
(function () {
  'use strict';
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setupReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (REDUCE || !('IntersectionObserver' in window)) {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add('visible');
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(function (el) { obs.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupReveal);
  } else { setupReveal(); }

  /* MENÚ MÓVIL · burger + dropdown de capítulos */
  function setupMobileNav() {
    /* Toggle del burger: agrega/quita clase is-open al .site-nav */
    document.addEventListener('click', function (e) {
      var burger = e.target.closest('.nav-burger');
      if (burger) {
        e.preventDefault();
        var nav = burger.closest('.site-nav');
        if (!nav) return;
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        return;
      }
      /* Toggle del dropdown de Capítulos en mobile: tap abre/cierra */
      var ddToggle = e.target.closest('.nav-dropdown-toggle');
      if (ddToggle && window.matchMedia('(max-width: 900px)').matches) {
        e.preventDefault();
        var dropdown = ddToggle.closest('.nav-dropdown');
        if (!dropdown) return;
        var ddOpen = dropdown.classList.toggle('is-open');
        ddToggle.setAttribute('aria-expanded', String(ddOpen));
        return;
      }
      /* Click fuera del nav: cerrar todo */
      if (!e.target.closest('.site-nav')) {
        document.querySelectorAll('.site-nav.is-open').forEach(function (n) {
          n.classList.remove('is-open');
          var b = n.querySelector('.nav-burger');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.nav-dropdown.is-open').forEach(function (d) {
          d.classList.remove('is-open');
          var t = d.querySelector('.nav-dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileNav);
  } else { setupMobileNav(); }
})();
