/**
 * Animations, Navigation, and Interactive Effects
 * Optimized Portfolio 2025 - Lightweight
 */

(function() {
  "use strict";

  const runWhenDomReady = window.PortfolioUtils?.runWhenDomReady || function(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  /**
   * Header toggle with smooth animation
   */
  const headerToggleBtnInHeader = document.querySelector('#header .header-toggle');
  const headerEl = document.querySelector('#header');
  const body = document.body;

  const NAV_OPEN_CLASS = 'nav-open';
  const BACKDROP_ID = 'nav-backdrop';
  const MOBILE_NAV_ID = 'mobile-nav';
  const MOBILE_NAV_ACTIVE_CLASS = 'mobile-nav-active';

  function isMobileNav() {
    return window.matchMedia('(max-width: 1199px)').matches;
  }

  function ensureNavBackdrop() {
    let backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = BACKDROP_ID;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', () => {
      if (body.classList.contains(NAV_OPEN_CLASS)) {
        if (isMobileNav()) {
          closeMobileNav();
        } else {
          headerToggle();
        }
      }
    });

    return backdrop;
  }

  function ensureMobileNav() {
    let mobileNav = document.getElementById(MOBILE_NAV_ID);
    if (mobileNav) return mobileNav;

    const sourceNav = document.querySelector('#navmenu');
    if (!sourceNav) return null;

    mobileNav = document.createElement('div');
    mobileNav.id = MOBILE_NAV_ID;
    mobileNav.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'mobile-nav-inner';

    const navClone = sourceNav.cloneNode(true);
    navClone.id = 'mobile-navmenu';

    inner.appendChild(navClone);
    mobileNav.appendChild(inner);
    document.body.appendChild(mobileNav);

    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    return mobileNav;
  }

  function openMobileNav() {
    const mobileNav = ensureMobileNav();
    if (!mobileNav) return;

    body.classList.add(NAV_OPEN_CLASS);
    body.classList.add(MOBILE_NAV_ACTIVE_CLASS);
    ensureNavBackdrop().classList.add('active');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');

    if (headerToggleBtnInHeader) {
      headerToggleBtnInHeader.classList.remove('bi-list');
      headerToggleBtnInHeader.classList.add('bi-x');
      headerToggleBtnInHeader.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMobileNav() {
    const mobileNav = document.getElementById(MOBILE_NAV_ID);

    body.classList.remove(NAV_OPEN_CLASS);
    body.classList.remove(MOBILE_NAV_ACTIVE_CLASS);
    const backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) backdrop.classList.remove('active');

    if (mobileNav) {
      mobileNav.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'true');
    }

    if (headerToggleBtnInHeader) {
      headerToggleBtnInHeader.classList.remove('bi-x');
      headerToggleBtnInHeader.classList.add('bi-list');
      headerToggleBtnInHeader.setAttribute('aria-label', 'Open menu');
    }
  }

  function headerToggle() {
    if (isMobileNav()) {
      if (body.classList.contains(NAV_OPEN_CLASS)) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
      return;
    }

    if (!headerEl || !headerToggleBtnInHeader) return;

    headerEl.classList.toggle('header-show');
    headerToggleBtnInHeader.classList.toggle('bi-list');
    headerToggleBtnInHeader.classList.toggle('bi-x');

    const isOpen = headerEl.classList.contains('header-show');
    body.classList.toggle(NAV_OPEN_CLASS, isOpen);
    ensureNavBackdrop().classList.toggle('active', isOpen);
  }

  if (headerToggleBtnInHeader) {
    headerToggleBtnInHeader.addEventListener('click', headerToggle);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!body.classList.contains(NAV_OPEN_CLASS)) return;
    if (isMobileNav()) {
      closeMobileNav();
    } else {
      headerToggle();
    }
  });

  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Portfolio Filtering & Isotope
   */
  runWhenDomReady(() => {
    const isotopeItem = document.querySelector('.isotope-container');

    if (typeof imagesLoaded === 'undefined' || typeof Isotope === 'undefined') return;

    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      const portfolioIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: 'fitRows'
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach((filterEl) => {
        filterEl.addEventListener('click', () => {
          const filter = filterEl.getAttribute('data-filter');
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          filterEl.classList.add('filter-active');
          portfolioIsotope.arrange({ filter: filter });
        }, false);
      });
    });
  });

  /**
   * AOS Animation (lightweight built-in animations)
   */
  runWhenDomReady(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out-quad',
        once: true,
        offset: 50
      });
    }
  });

  /**
   * Typed.js for typing effect
   */
  runWhenDomReady(() => {
    const element = document.querySelector('.typed');
    if (typeof Typed !== 'undefined' && element) {
      new Typed(element, {
        strings: element.getAttribute('data-typed-items').split(', '),
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
      });
    }
  });

  /**
   * PureCounter for animated numbers
   */
  runWhenDomReady(() => {
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }
  });

  /**
   * Waypoints for scroll-triggered events
   */
  runWhenDomReady(() => {
    const counterUp = document.querySelectorAll('.purecounter');
    if (typeof Waypoint !== 'undefined' && counterUp.length > 0) {
      new Waypoint({
        element: counterUp[0],
        handler: function() {
          if (typeof PureCounter !== 'undefined') {
            new PureCounter();
          }
          this.destroy();
        },
        offset: 'bottom-in-view'
      });
    }
  });

  /**
   * GLightbox for image galleries
   */
  runWhenDomReady(() => {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }
  });

  /**
   * Swiper carousels
   */
  runWhenDomReady(() => {
    if (typeof Swiper !== 'undefined') {
      const testimonialSwiper = new Swiper('.testimonials-slider', {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'clickable'
        },
        autoplay: {
          delay: 5000
        }
      });
    }
  });

})();
