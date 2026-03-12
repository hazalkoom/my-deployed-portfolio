/**
 * Navigation Module
 * Handles header, mobile nav, and navigation interactions
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

  // Expose for external use
  window.PortfolioNav = {
    openMobileNav: openMobileNav,
    closeMobileNav: closeMobileNav,
    headerToggle: headerToggle
  };
})();
