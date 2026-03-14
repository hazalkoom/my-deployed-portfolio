/**
 * Effects & Interactivity Module
 * Handles scroll effects, AOS, Typed.js, GLightbox, Swiper
 */
(function () {
  "use strict";

  var runWhenDomReady = window.PortfolioUtils?.runWhenDomReady || function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', function () { resolve(); }, { once: true });
        existing.addEventListener('error', function () { reject(new Error('Script load failed: ' + src)); }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.addEventListener('load', function () {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', function () {
        reject(new Error('Script load failed: ' + src));
      }, { once: true });
      document.body.appendChild(script);
    });
  }

  /* ================================================================
     AOS — Animate On Scroll
     ================================================================ */
  runWhenDomReady(function () {
    if (prefersReducedMotion()) return;

    function initAOS() {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        offset: 50
      });
    }

    if (typeof AOS !== 'undefined') {
      initAOS();
      return;
    }

    loadScript('assets/vendor/aos/aos.js')
      .then(function () {
        if (typeof AOS !== 'undefined') initAOS();
      })
      .catch(function () {
        // Optional enhancement should fail silently.
      });
  });

  /* ================================================================
     TYPED.JS — Hero typing effect
     ================================================================ */
  runWhenDomReady(function () {
    var el = document.querySelector('.typed');
    if (typeof Typed !== 'undefined' && el) {
      new Typed(el, {
        strings: el.getAttribute('data-typed-items').split(',').map(function (s) { return s.trim(); }),
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        smartBackspace: true
      });
    }
  });

  /* ================================================================
     GLIGHTBOX — Image lightbox
     ================================================================ */
  runWhenDomReady(function () {
    if (!document.querySelector('.glightbox')) return;

    function initLightbox() {
      GLightbox({ selector: '.glightbox' });
    }

    if (typeof GLightbox !== 'undefined') {
      initLightbox();
      return;
    }

    loadScript('assets/vendor/glightbox/js/glightbox.min.js')
      .then(function () {
        if (typeof GLightbox !== 'undefined') initLightbox();
      })
      .catch(function () {
        // Optional enhancement should fail silently.
      });
  });

  /* ================================================================
     SWIPER — Carousels (if any)
     ================================================================ */
  runWhenDomReady(function () {
    var swiperRoots = document.querySelectorAll('.init-swiper');
    if (!swiperRoots.length) return;

    function initSwiper() {
      swiperRoots.forEach(function (el) {
        var configEl = el.querySelector('.swiper-config');
        if (configEl) {
          new Swiper(el, JSON.parse(configEl.textContent.trim()));
        }
      });
    }

    if (typeof Swiper !== 'undefined') {
      initSwiper();
      return;
    }

    loadScript('assets/vendor/swiper/swiper-bundle.min.js')
      .then(function () {
        if (typeof Swiper !== 'undefined') initSwiper();
      })
      .catch(function () {
        // Optional enhancement should fail silently.
      });
  });

  // Expose for external use
  window.PortfolioEffects = {
    prefersReducedMotion: prefersReducedMotion
  };
})();
