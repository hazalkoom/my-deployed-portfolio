/**
 * Core Setup - Lightweight & Fast
 * Optimized Portfolio 2025
 */

(function() {
  "use strict";

  // Expose utilities globally
  window.PortfolioUtils = window.PortfolioUtils || {};

  window.PortfolioUtils.runWhenDomReady = function(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  // Expose lenis globally
  window.PortfolioUtils.lenis = null;

  // Simple scroll-to-top button
  const scrollTopBtn = document.querySelector('#scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Hide preloader on load
  window.addEventListener('load', () => {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      preloader.style.transition = 'all 0.5s ease-out';
    }
  });

})();

