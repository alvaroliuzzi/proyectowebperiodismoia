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
  function closeAllNav() {
    document.querySelectorAll('.site-nav.is-open').forEach(function (n) {
      n.classList.remove('is-open');
      var b = n.querySelector('.nav-burger');
      if (b) b.setAttribute('aria-expanded', 'false');
      moveCtaInsideMenu(n, false);
    });
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (d) {
      d.classList.remove('is-open');
      var t = d.querySelector('.nav-dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  function moveCtaInsideMenu(nav, inside) {
    /* Mueve el .nav-cta dentro del .nav-links cuando se abre el menú móvil,
       y lo devuelve a su lugar original al cerrarlo. */
    var cta = nav.querySelector('.nav-cta');
    var links = nav.querySelector('.nav-links');
    if (!cta || !links) return;
    if (inside) {
      if (cta.parentElement !== links) {
        cta.setAttribute('data-cta-moved', '1');
        links.appendChild(cta);
      }
    } else {
      if (cta.getAttribute('data-cta-moved') === '1') {
        var burger = nav.querySelector('.nav-burger');
        if (burger && burger.parentElement) {
          burger.parentElement.insertBefore(cta, burger);
        }
        cta.removeAttribute('data-cta-moved');
      }
    }
  }
  function setupMobileNav() {
    document.addEventListener('click', function (e) {
      /* Toggle del burger */
      var burger = e.target.closest('.nav-burger');
      if (burger) {
        e.preventDefault();
        var nav = burger.closest('.site-nav');
        if (!nav) return;
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        moveCtaInsideMenu(nav, open);
        if (!open) {
          /* Si cerramos el menú, cerrar también dropdowns abiertos */
          nav.querySelectorAll('.nav-dropdown.is-open').forEach(function (d) {
            d.classList.remove('is-open');
            var t = d.querySelector('.nav-dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }
        return;
      }
      /* Toggle del dropdown de Capítulos en mobile */
      var ddToggle = e.target.closest('.nav-dropdown-toggle');
      if (ddToggle && window.matchMedia('(max-width: 900px)').matches) {
        e.preventDefault();
        var dropdown = ddToggle.closest('.nav-dropdown');
        if (!dropdown) return;
        var ddOpen = dropdown.classList.toggle('is-open');
        ddToggle.setAttribute('aria-expanded', String(ddOpen));
        return;
      }
      /* Click en cualquier link del menú móvil abierto: cerrar el menú */
      var openNav = e.target.closest('.site-nav.is-open');
      if (openNav && window.matchMedia('(max-width: 900px)').matches) {
        var link = e.target.closest('a[href]');
        if (link) closeAllNav();
        return;
      }
      /* Click fuera del nav: cerrar todo */
      if (!e.target.closest('.site-nav')) {
        closeAllNav();
      }
    });
    /* Escape cierra el menú */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllNav();
    });
    /* Resize/rotate: si salimos de mobile, cerrar y restaurar el CTA */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!window.matchMedia('(max-width: 900px)').matches) {
          closeAllNav();
        }
      }, 150);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileNav);
  } else { setupMobileNav(); }
})();
