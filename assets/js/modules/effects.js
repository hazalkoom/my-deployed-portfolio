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

  /* ================================================================
     AOS — Animate On Scroll
     ================================================================ */
  runWhenDomReady(function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        offset: 50
      });
    }
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
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  });

  /* ================================================================
     SWIPER — Carousels (if any)
     ================================================================ */
  runWhenDomReady(function () {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.init-swiper').forEach(function (el) {
      var configEl = el.querySelector('.swiper-config');
      if (configEl) {
        new Swiper(el, JSON.parse(configEl.textContent.trim()));
      }
    });
  });

  /* ================================================================
     SCROLLSPY — Active nav highlighting
     ================================================================ */
  var navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
  var sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    var scrollPos = window.scrollY || document.documentElement.scrollTop;
    var currentId = 'hero';
    sections.forEach(function (section) {
      var top = section.offsetTop - 250;
      if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('load', function () { setTimeout(updateActiveNavLink, 100); });

  /* ================================================================
     HASH SCROLL CORRECTION
     ================================================================ */
  window.addEventListener('load', function () {
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function () {
          var offset = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }, 100);
      }
    }
  });

  /* ================================================================
     PROJECT CARD HOVER (single system — no competing transforms)
     ================================================================ */
  runWhenDomReady(function () {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  });

  /* ================================================================
     FORM INPUT FOCUS EFFECT
     ================================================================ */
  runWhenDomReady(function () {
    document.querySelectorAll('.form-control').forEach(function (input) {
      input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
      });
      input.addEventListener('blur', function () {
        this.parentElement.style.transform = '';
      });
    });
  });

  // Expose for external use
  window.PortfolioEffects = {
    updateActiveNavLink: updateActiveNavLink
  };
})();
