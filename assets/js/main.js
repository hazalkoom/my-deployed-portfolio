/**
* Modern Portfolio - Enhanced JavaScript
* Updated 2024-2025 with advanced animations
*/

(function() {
  "use strict";

  function runWhenDomReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /**
   * Lenis + GSAP ScrollTrigger integration
   */
  let lenis = null;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.5
      });

      // Keep ScrollTrigger in sync with Lenis
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Use Lenis as the scroller proxy
        ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true });
            }
            return window.scrollY || document.documentElement.scrollTop;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          }
        });

        ScrollTrigger.refresh();
      } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // GSAP is present but Lenis isn't; still register plugin for future use.
        gsap.registerPlugin(ScrollTrigger);
      }
    } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (e) {
    lenis = null;
  }

  function splitTextToChars(el) {
    if (!el) return [];
    if (el.dataset.gsapSplitDone === 'true') {
      return Array.from(el.querySelectorAll('.gsap-char'));
    }

    const text = el.textContent ?? '';
    el.dataset.gsapSplitDone = 'true';
    el.dataset.gsapOriginalText = text;
    el.textContent = '';

    const frag = document.createDocumentFragment();
    const chars = [];

    for (const ch of Array.from(text)) {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'gsap-char';
      span.textContent = ch;
      frag.appendChild(span);
      chars.push(span);
    }

    el.appendChild(frag);
    return chars;
  }

  function initGsapScrollEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Headings reveal per section
    document.querySelectorAll('section').forEach((section) => {
      const headings = section.querySelectorAll('.section-title h1, .section-title h2, .section-title h3, header h1, header h2, h1, h2');
      if (!headings.length) return;

      // Use the most relevant heading within the section
      const heading = headings[0];
      const chars = splitTextToChars(heading);
      if (!chars.length) return;

      gsap.fromTo(
        chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Images parallax + scale scrub
      const images = section.querySelectorAll('img');
      images.forEach((img) => {
        // Skip tiny icons/logos and UI glyphs
        if (img.closest('.header') || img.closest('#mobile-nav')) return;

        gsap.fromTo(
          img,
          { y: -18, scale: 1.06 },
          {
            y: 18,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });
    });

    ScrollTrigger.refresh();
  }

  window.addEventListener('load', initGsapScrollEffects);

  /**
   * Spline background + noise overlay
   */
  function initBackgroundLayers() {
    const SPLINE_CODE_URL = 'assets/spline/scene.splinecode';
    const SPLINE_RUNTIME_URL = 'https://unpkg.com/@splinetool/runtime@1.9.57/build/runtime.js';

    if (!document.body) return;

    // Create Spline background container (behind everything)
    if (!document.getElementById('spline-bg')) {
      const splineBg = document.createElement('div');
      splineBg.id = 'spline-bg';
      document.body.prepend(splineBg);
    }

    // Create canvas for Spline Runtime
    if (!document.getElementById('canvas3d')) {
      const canvas = document.createElement('canvas');
      canvas.id = 'canvas3d';
      canvas.setAttribute('aria-hidden', 'true');
      document.getElementById('spline-bg').appendChild(canvas);
    }

    // Create Spline loading overlay (prevents black screen while assets fetch)
    if (!document.getElementById('spline-loading')) {
      const loading = document.createElement('div');
      loading.id = 'spline-loading';
      loading.setAttribute('aria-hidden', 'true');

      const spinner = document.createElement('div');
      spinner.className = 'spline-spinner';
      loading.appendChild(spinner);

      document.body.appendChild(loading);
    }

    // Professional preloader screen
    if (!document.getElementById('loading-screen')) {
      const screen = document.createElement('div');
      screen.id = 'loading-screen';

      const inner = document.createElement('div');
      inner.className = 'loading-inner';

      const label = document.createElement('div');
      label.className = 'loading-label';
      label.textContent = 'Loading';

      const percent = document.createElement('div');
      percent.className = 'loading-percent';
      percent.textContent = '0%';

      const bar = document.createElement('div');
      bar.className = 'loading-bar';
      const fill = document.createElement('div');
      fill.className = 'loading-bar-fill';
      bar.appendChild(fill);

      inner.appendChild(label);
      inner.appendChild(percent);
      inner.appendChild(bar);
      screen.appendChild(inner);

      document.body.appendChild(screen);
    }

    // Create noise overlay (above everything)
    if (!document.getElementById('noise-overlay')) {
      const noise = document.createElement('div');
      noise.id = 'noise-overlay';
      noise.setAttribute('aria-hidden', 'true');
      document.body.appendChild(noise);
    }

    // Create contrast overlay (between content and background)
    if (!document.getElementById('contrast-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'contrast-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    const canvas3d = document.getElementById('canvas3d');
    if (!canvas3d) return;

    const loadingEl = document.getElementById('spline-loading');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingPercentEl = loadingScreen ? loadingScreen.querySelector('.loading-percent') : null;
    const loadingFillEl = loadingScreen ? loadingScreen.querySelector('.loading-bar-fill') : null;

    const loadingState = { p: 0, done: false };
    let progressRaf = 0;
    let progressStart = 0;
    let lastProgressPaint = 0;
    function setLoadingProgress(p) {
      const clamped = Math.max(0, Math.min(100, Math.round(p)));
      loadingState.p = clamped;
      if (loadingPercentEl) loadingPercentEl.textContent = clamped + '%';
      if (loadingFillEl) loadingFillEl.style.width = clamped + '%';
    }
    setLoadingProgress(0);

    function showLoadingScreen() {
      if (!loadingScreen) return;
      loadingScreen.classList.remove('hidden');
    }

    function hideLoadingScreen() {
      if (!loadingScreen || loadingState.done) return;
      loadingState.done = true;

      if (progressRaf) {
        cancelAnimationFrame(progressRaf);
        progressRaf = 0;
      }

      // Ensure it reaches 100%
      const finish = () => {
        loadingScreen.classList.add('hidden');
      };

      if (typeof gsap !== 'undefined') {
        gsap.to(loadingState, { p: 100, duration: 0.35, ease: 'power2.out', onUpdate: () => setLoadingProgress(loadingState.p) });
        gsap.to(loadingScreen, { opacity: 0, duration: 0.55, ease: 'power3.out', onComplete: finish });
      } else {
        setLoadingProgress(100);
        finish();
      }
    }

    function startProgressLoop() {
      if (!loadingScreen || loadingState.done) return;
      if (progressRaf) return;
      progressStart = performance.now();
      lastProgressPaint = 0;

      const tick = (t) => {
        if (loadingState.done) {
          progressRaf = 0;
          return;
        }

        const elapsed = t - progressStart;
        const target = Math.min(92, (elapsed / 2200) * 92);

        // Throttle DOM writes a bit to avoid UI jank on low-end devices.
        if (t - lastProgressPaint > 50) {
          setLoadingProgress(target);
          lastProgressPaint = t;
        }

        progressRaf = requestAnimationFrame(tick);
      };

      progressRaf = requestAnimationFrame(tick);
    }
    function showLoading() {
      if (!loadingEl) return;
      loadingEl.classList.remove('hidden');
    }
    function hideLoading() {
      if (!loadingEl) return;
      loadingEl.classList.add('hidden');
    }

    function markLoaded() {
      document.body.classList.add('spline-loaded');
      hideLoading();
      hideLoadingScreen();
    }

    function sizeSplineCanvas() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas3d.width !== w) canvas3d.width = w;
      if (canvas3d.height !== h) canvas3d.height = h;
    }

    window.addEventListener('resize', sizeSplineCanvas);
    sizeSplineCanvas();

    async function getSplineApplicationCtor() {
      // Prefer ESM import (runtime.js is typically ESM; classic <script> may not expose globals)
      try {
        const mod = await import(SPLINE_RUNTIME_URL);
        if (mod && mod.Application) return mod.Application;
      } catch (e) {
        // ignore and try globals
      }

      if (window.SplineRuntime && window.SplineRuntime.Application) return window.SplineRuntime.Application;
      if (window.Application) return window.Application;
      return null;
    }

    let started = false;
    let splineApp = null;
    function startLoad() {
      if (started) return;
      started = true;
      showLoading();
      showLoadingScreen();
      startProgressLoop();

      if (window.location && window.location.protocol === 'file:') {
        console.error('[Spline] Cannot load .splinecode from file://. Please run the site via a local server (e.g. VS Code Live Server).');
      }

      Promise.resolve()
        .then(async () => {
          const ApplicationCtor = await getSplineApplicationCtor();
          if (!ApplicationCtor) throw new Error('Spline Runtime Application is not available (module/global)');

          splineApp = new ApplicationCtor(canvas3d);
          return splineApp.load(SPLINE_CODE_URL);
        })
        .then(() => {
          // Target specific objects from the user's scene
          let cameraTarget = null;
          let shipTarget = null;
          let starsTarget = null;
          try { cameraTarget = splineApp.findObjectByName('PERSPECTIVE'); } catch (e) {}
          try { shipTarget = splineApp.findObjectByName('SHIP & VORTEXT'); } catch (e) {}
          try { starsTarget = splineApp.findObjectByName('STARS EMITTER'); } catch (e) {}

          window.__splineApp = splineApp;
          window.__splineObjects = { cameraTarget, shipTarget, starsTarget };

          const state = { nx: 0, ny: 0 };
          const smooth = { nx: 0, ny: 0 };

          function onMove(e) {
            state.nx = (e.clientX / window.innerWidth) * 2 - 1;
            state.ny = (e.clientY / window.innerHeight) * 2 - 1;
          }
          window.addEventListener('mousemove', onMove, { passive: true });

          // Smooth mouse values (GSAP if available; fallback to simple lerp)
          let nxTo = null;
          let nyTo = null;
          if (typeof gsap !== 'undefined') {
            nxTo = gsap.quickTo(smooth, 'nx', { duration: 0.35, ease: 'power3.out' });
            nyTo = gsap.quickTo(smooth, 'ny', { duration: 0.35, ease: 'power3.out' });
          }

          function tick() {
            if (nxTo && nyTo) {
              nxTo(state.nx);
              nyTo(state.ny);
            } else {
              smooth.nx += (state.nx - smooth.nx) * 0.12;
              smooth.ny += (state.ny - smooth.ny) * 0.12;
            }

            if (cameraTarget && cameraTarget.rotation) {
              cameraTarget.rotation.y = smooth.nx * 0.35;
              cameraTarget.rotation.x = -smooth.ny * 0.2;
            }

            if (shipTarget && shipTarget.rotation) {
              shipTarget.rotation.y = smooth.nx * 0.55;
              shipTarget.rotation.x = -smooth.ny * 0.25;
            }

            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);

          markLoaded();
        })
        .catch((err) => {
          console.error('[Spline] Failed to load/render scene:', err);
          markLoaded();
        });

      // Safety timeout so we don't leave spinner forever.
      window.setTimeout(() => {
        if (!document.body.classList.contains('spline-loaded')) {
          markLoaded();
        }
      }, 12000);
    }

    // Start loading when the browser is idle, or on first user interaction.
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => startLoad(), { timeout: 1500 });
    } else {
      window.setTimeout(() => startLoad(), 800);
    }

    const kick = () => startLoad();
    window.addEventListener('pointerdown', kick, { once: true, passive: true });
    window.addEventListener('keydown', kick, { once: true });

    // Scroll-based transforms can be added via Spline runtime objects once we know the target names.
  }
  runWhenDomReady(initBackgroundLayers);

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

  function ensureMobileToggle() {
    let mobileToggle = document.querySelector('.mobile-header-toggle');
    if (mobileToggle) return mobileToggle;

    mobileToggle = document.createElement('button');
    mobileToggle.type = 'button';
    mobileToggle.className = 'mobile-header-toggle bi bi-list';
    mobileToggle.setAttribute('aria-label', 'Open menu');
    document.body.appendChild(mobileToggle);
    return mobileToggle;
  }

  const mobileToggleBtn = ensureMobileToggle();

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

    // Close when clicking a link
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

    mobileToggleBtn.classList.remove('bi-list');
    mobileToggleBtn.classList.add('bi-x');
    mobileToggleBtn.setAttribute('aria-label', 'Close menu');
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

    mobileToggleBtn.classList.remove('bi-x');
    mobileToggleBtn.classList.add('bi-list');
    mobileToggleBtn.setAttribute('aria-label', 'Open menu');
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
    
    // Add rotation animation
    headerToggleBtnInHeader.style.transform = headerToggleBtnInHeader.classList.contains('bi-x') 
      ? 'rotate(90deg) scale(1.1)' 
      : 'rotate(0deg) scale(1)';
  }
  
  // Mobile toggle always available
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', headerToggle);
  }

  // Desktop toggle remains inside header
  if (headerToggleBtnInHeader) {
    headerToggleBtnInHeader.addEventListener('click', headerToggle);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!body.classList.contains(NAV_OPEN_CLASS)) return;
    if (isMobileNav()) {
      closeMobileNav();
    } else {
      headerToggle();
    }
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Enhanced Preloader with fade out
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.6s ease';
      setTimeout(() => preloader.remove(), 600);
    });
  }

  /**
   * Enhanced Scroll top button with animation
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Enhanced AOS Animation
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 100,
      delay: 100
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Enhanced Typed.js with cursor styling
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    if (typeof Typed !== 'undefined') {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        cursorChar: '|',
        smartBackspace: true
      });
    }
  }

  /**
   * Enhanced Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Enhanced skills animation with stagger
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item, index) => {
    if (typeof Waypoint === 'undefined') return;
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach((el, i) => {
          setTimeout(() => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
            el.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
          }, i * 100);
        });
      }
    });
  });

  /**
   * Enhanced GLightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' }
      }
    });
  }

  /**
   * Enhanced Isotope with smooth transitions
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    if (typeof imagesLoaded === 'undefined' || typeof Isotope === 'undefined') return;
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
        transitionDuration: '0.6s',
        hiddenStyle: {
          opacity: 0,
          transform: 'scale(0.8)'
        },
        visibleStyle: {
          opacity: 1,
          transform: 'scale(1)'
        }
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Enhanced Swiper initialization
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Enhanced scroll position correction
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Enhanced Navmenu Scrollspy with smooth highlighting
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => {
          link.classList.remove('active');
        });
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Modern parallax effect for background circles
   */
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-circle');
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.2);
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  /**
   * Enhanced hover effects for project cards
   */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function(e) {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `
        translateY(-12px) 
        scale(1.02) 
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
    });
  });

  /**
   * Magnetic button effect
   */
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0)';
    });
  });

  /**
   * Smooth reveal animations on scroll
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-item, .experience-item, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /**
   * Enhanced typing indicator for contact form
   */
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
      this.parentElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });

  /**
   * Add cursor follower effect (optional - modern touch)
   */
  function initLiquidCursor() {
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (prefersReducedMotion || !hasFinePointer) return;

    const trailCanvas = document.createElement('canvas');
    trailCanvas.id = 'star-trail-canvas';
    trailCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(trailCanvas);

    const ctx = trailCanvas.getContext('2d');
    if (!ctx) return;

    const cursor = document.createElement('div');
    cursor.className = 'vortex-cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('has-custom-cursor');

    const state = {
      mx: window.innerWidth / 2,
      my: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: 1,
      hover: false
    };

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      trailCanvas.width = Math.floor(window.innerWidth * dpr);
      trailCanvas.height = Math.floor(window.innerHeight * dpr);
      trailCanvas.style.width = window.innerWidth + 'px';
      trailCanvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    let xTo = null;
    let yTo = null;
    let scaleTo = null;
      if (typeof gsap !== 'undefined') {
        // 2D vortex cursor: responsive but smooth
        xTo = gsap.quickTo(state, 'x', { duration: 0.15, ease: 'power3.out' });
        yTo = gsap.quickTo(state, 'y', { duration: 0.15, ease: 'power3.out' });
        scaleTo = gsap.quickTo(state, 'scale', { duration: 0.15, ease: 'power3.out' });
      }

    function onMove(e) {
      state.mx = e.clientX;
      state.my = e.clientY;
      if (xTo && yTo) {
        xTo(state.mx);
        yTo(state.my);
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true });

      if (typeof gsap !== 'undefined' && typeof gsap.set === 'function') {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      }

    function setHover(active) {
      state.hover = active;
      cursor.classList.toggle('is-hover', active);
      if (scaleTo) {
        scaleTo(active ? 1.65 : 1);
      } else {
        state.scale = active ? 1.65 : 1;
      }
    }

    document.querySelectorAll('a, button, .btn, .project-card, .portfolio .project-card').forEach((el) => {
      el.addEventListener('mouseenter', () => setHover(true));
      el.addEventListener('mouseleave', () => setHover(false));
    });

    const particles = [];
    function spawnStars() {
      const speed = Math.min(18, Math.hypot(state.mx - state.x, state.my - state.y));
      const count = Math.max(1, Math.min(4, Math.floor(speed / 6)));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: state.x,
          y: state.y,
          r: 1 + Math.random() * 1.8,
          a: 0.95,
          life: 1,
          t: Math.random() * Math.PI * 2,
          o: 6 + Math.random() * 10,
          s: 0.05 + Math.random() * 0.08
        });
      }
      if (particles.length > 180) particles.splice(0, particles.length - 180);
    }

    // Physics state for Spline-linked cursor object
    const splinePhys = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0
    };

  function syncSplineToMouse() {
      const app = window.__splineApp;
      const splineObjects = window.__splineObjects;
      if (!app || !splineObjects) return;

      // 1. Calculate Mouse Position relative to screen center
      const screenNx = (state.x / window.innerWidth) * 2 - 1;
      const screenNy = (state.y / window.innerHeight) * 2 - 1;

      // 2. Range: Keep it wide so it hits edges
      const xRange = Math.max(220, window.innerWidth / 2.2);
      const yRange = Math.max(160, window.innerHeight / 2.4);

      const targetX = screenNx * xRange;
      const targetY = -screenNy * yRange;

      // 3. PHYSICS FIX: 
      // Force (Acceleration): Reduced drastically from 0.004 to 0.0006
      // This makes it extremely slow to start moving.
      const follow = 0.0006;

      // Apply Force towards the target directly (No complex acceleration curves)
      splinePhys.vx += (targetX - splinePhys.x) * follow;
      splinePhys.vy += (targetY - splinePhys.y) * follow;

      // 4. FRICTION FIX:
      // Drag: Reduced multiplier from 0.985 to 0.96
      // This increases "air resistance", stopping it faster so it doesn't slide endlessly.
      splinePhys.vx *= 0.96;
      splinePhys.vy *= 0.96;

      // Apply Velocity
      splinePhys.x += splinePhys.vx;
      splinePhys.y += splinePhys.vy;

      // 5. EDGE BOUNCE (Softened)
      const bounce = -0.5; // Less bouncy
      const edgeSoftness = 0.05;

      if (splinePhys.x > xRange) {
        const over = splinePhys.x - xRange;
        splinePhys.x = xRange;
        splinePhys.vx = splinePhys.vx * bounce - over * edgeSoftness;
      } else if (splinePhys.x < -xRange) {
        const over = -xRange - splinePhys.x;
        splinePhys.x = -xRange;
        splinePhys.vx = splinePhys.vx * bounce + over * edgeSoftness;
      }

      if (splinePhys.y > yRange) {
        const over = splinePhys.y - yRange;
        splinePhys.y = yRange;
        splinePhys.vy = splinePhys.vy * bounce - over * edgeSoftness;
      } else if (splinePhys.y < -yRange) {
        const over = -yRange - splinePhys.y;
        splinePhys.y = -yRange;
        splinePhys.vy = splinePhys.vy * bounce + over * edgeSoftness;
      }

      // 6. Apply to Objects
      const ship = splineObjects.shipTarget;
      if (ship && ship.position) {
        ship.position.x = splinePhys.x;
        ship.position.y = splinePhys.y;
      }
      // Fixed Scale (Don't change this unless you want it smaller/bigger)
      if (ship && ship.scale) {
        ship.scale.x = 0.62;
        ship.scale.y = 0.62;
        ship.scale.z = 0.62;
      }

      const stars = splineObjects.starsTarget;
      if (stars && stars.position) {
        // Stars lag slightly behind the ship for depth effect
        stars.position.x = splinePhys.x * 0.90;
        stars.position.y = splinePhys.y * 0.90;
      }
    }

    function draw() {
      if (!xTo || !yTo) {
        // Responsive lerp fallback (when GSAP isn't present)
        state.x += (state.mx - state.x) * 0.18;
        state.y += (state.my - state.y) * 0.18;
      }

      cursor.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%) scale(${state.scale})`;

      spawnStars();
      syncSplineToMouse();

      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.s;
        p.life -= 0.03;
        p.a = Math.max(0, p.life);

        const ox = Math.cos(p.t) * p.o;
        const oy = Math.sin(p.t) * p.o;
        const px = p.x + ox;
        const py = p.y + oy;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(draw);
    }

      requestAnimationFrame(draw);
    } catch (e) {
      // Fail silently to avoid breaking other pages
    }
  }
  runWhenDomReady(initLiquidCursor);

  /**
   * Add gradient animation to text elements
   */
  function animateGradientText() {
    const gradientTexts = document.querySelectorAll('.accent-text, .badge-text');
    gradientTexts.forEach(text => {
      text.style.backgroundSize = '200% 200%';
      text.style.animation = 'gradientShift 3s ease infinite';
    });
  }
  
  window.addEventListener('load', animateGradientText);

  /**
   * Console message for developers
   */
  console.log('%c🚀 Modern Portfolio 2024-2025', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with modern web technologies and animations', 'color: #ec4899; font-size: 14px;');

})();