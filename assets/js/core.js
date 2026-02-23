/**
 * Core Setup — Lightweight & Fast
 * Portfolio 2025
 */
(function () {
  "use strict";

  /* ── Utilities ─────────────────────────────────────── */
  window.PortfolioUtils = window.PortfolioUtils || {};

  window.PortfolioUtils.runWhenDomReady = function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  /* ── Scroll-to-top button ──────────────────────────── */
  var scrollTopBtn = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 100) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', toggleScrollTop, { passive: true });
  window.addEventListener('load', toggleScrollTop);

  /* ── Preloader ─────────────────────────────────────── */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      preloader.style.transition = 'all 0.5s ease-out';
      setTimeout(function () { preloader.remove(); }, 600);
    }
  });

  /* ── Visibility-aware rAF guard (exposed for spline/cursor) */
  var _tabVisible = true;
  document.addEventListener('visibilitychange', function () {
    _tabVisible = !document.hidden;
  });
  window.PortfolioUtils.isTabVisible = function () { return _tabVisible; };

  /* ── Theme Toggle with localStorage ─────────────── */
  window.PortfolioUtils.initTheme = function () {
    var themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Use saved preference, default to 'dark' always
    var currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

    function setTheme(theme) {
      if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
      localStorage.setItem('portfolio-theme', theme);
      document.documentElement.style.colorScheme = theme;
    }

    // Set initial theme
    setTheme(currentTheme);

    // Listen for theme toggle clicks
    themeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      setTheme(newTheme);
    });
  };

  // Initialize theme on DOM ready
  window.PortfolioUtils.runWhenDomReady(window.PortfolioUtils.initTheme);
})();

