(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (persist) localStorage.setItem('theme', theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });
    toggle.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
  }

  // Follow system preference live, unless the user has explicitly chosen a theme
  mediaQuery.addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector('.nav');
  var burger = document.getElementById('nav-burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a, .nav-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .timeline-item');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Header shadow / state on scroll ---------- */
  var header = document.querySelector('.site-header');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.style.boxShadow = y > 8 ? 'var(--shadow-sm)' : 'none';
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
