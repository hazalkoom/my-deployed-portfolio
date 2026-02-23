/**
 * Animations, Navigation & Interactive Effects
 * Portfolio 2025 — Consolidated & Clean
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
     HEADER / MOBILE NAV
     ================================================================ */
  var headerToggleBtnInHeader = document.querySelector('#header .header-toggle');
  var headerEl = document.querySelector('#header');
  var body = document.body;

  var NAV_OPEN_CLASS = 'nav-open';
  var BACKDROP_ID = 'nav-backdrop';
  var MOBILE_NAV_ID = 'mobile-nav';
  var MOBILE_NAV_ACTIVE_CLASS = 'mobile-nav-active';

  function isMobileNav() {
    return window.matchMedia('(max-width: 1199px)').matches;
  }

  function ensureNavBackdrop() {
    var backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.id = BACKDROP_ID;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () {
      if (body.classList.contains(NAV_OPEN_CLASS)) {
        isMobileNav() ? closeMobileNav() : headerToggle();
      }
    });
    return backdrop;
  }

  function ensureMobileNav() {
    var mobileNav = document.getElementById(MOBILE_NAV_ID);
    if (mobileNav) return mobileNav;
    var sourceNav = document.querySelector('#navmenu');
    if (!sourceNav) return null;

    mobileNav = document.createElement('div');
    mobileNav.id = MOBILE_NAV_ID;
    mobileNav.setAttribute('aria-hidden', 'true');

    var inner = document.createElement('div');
    inner.className = 'mobile-nav-inner';
    var navClone = sourceNav.cloneNode(true);
    navClone.id = 'mobile-navmenu';
    inner.appendChild(navClone);
    mobileNav.appendChild(inner);
    document.body.appendChild(mobileNav);

    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    return mobileNav;
  }

  function openMobileNav() {
    var mobileNav = ensureMobileNav();
    if (!mobileNav) return;
    body.classList.add(NAV_OPEN_CLASS, MOBILE_NAV_ACTIVE_CLASS);
    ensureNavBackdrop().classList.add('active');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (headerToggleBtnInHeader) {
      headerToggleBtnInHeader.classList.replace('bi-list', 'bi-x');
      headerToggleBtnInHeader.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMobileNav() {
    var mobileNav = document.getElementById(MOBILE_NAV_ID);
    body.classList.remove(NAV_OPEN_CLASS, MOBILE_NAV_ACTIVE_CLASS);
    var backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) backdrop.classList.remove('active');
    if (mobileNav) {
      mobileNav.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (headerToggleBtnInHeader) {
      headerToggleBtnInHeader.classList.replace('bi-x', 'bi-list');
      headerToggleBtnInHeader.setAttribute('aria-label', 'Open menu');
    }
  }

  function headerToggle() {
    if (isMobileNav()) {
      body.classList.contains(NAV_OPEN_CLASS) ? closeMobileNav() : openMobileNav();
      return;
    }
    if (!headerEl || !headerToggleBtnInHeader) return;
    headerEl.classList.toggle('header-show');
    headerToggleBtnInHeader.classList.toggle('bi-list');
    headerToggleBtnInHeader.classList.toggle('bi-x');
    var isOpen = headerEl.classList.contains('header-show');
    body.classList.toggle(NAV_OPEN_CLASS, isOpen);
    ensureNavBackdrop().classList.toggle('active', isOpen);
  }

  if (headerToggleBtnInHeader) {
    headerToggleBtnInHeader.addEventListener('click', headerToggle);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains(NAV_OPEN_CLASS)) {
      isMobileNav() ? closeMobileNav() : headerToggle();
    }
  });

  document.querySelectorAll('#navmenu a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (document.querySelector('.header-show')) headerToggle();
    });
  });

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
})();
