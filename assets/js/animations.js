/**
* Animations, Navigation, and Interactive Effects
* Modern Portfolio 2024-2025
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

  const lenis = window.PortfolioUtils?.lenis || null;

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
    
    headerToggleBtnInHeader.style.transform = headerToggleBtnInHeader.classList.contains('bi-x') 
      ? 'rotate(90deg) scale(1.1)' 
      : 'rotate(0deg) scale(1)';
  }
  
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', headerToggle);
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
   * Enhanced Preloader
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
   * Scroll top button (Lenis-aware)
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      const scrollPos = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop);
      if (scrollPos > 100) {
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

  if (lenis) {
    lenis.on('scroll', toggleScrollTop);
  } else {
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * AOS Animation
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 100,
        delay: 100
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined') {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
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

  /**
   * Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Skills animation
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
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
   * GLightbox
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
   * Isotope
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
   * Swiper
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        // Custom pagination handler if needed
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Scroll position correction
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          if (lenis) {
            lenis.scrollTo(section.offsetTop - parseInt(scrollMarginTop), { duration: 1 });
          } else {
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy (Lenis-aware)
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    const scrollPos = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop);
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = scrollPos + 200;
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
  
  if (lenis) {
    lenis.on('scroll', navmenuScrollspy);
  } else {
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
  }

  /**
   * Parallax effect (Lenis-aware)
   */
  function updateParallax() {
    const scrolled = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
    const parallaxElements = document.querySelectorAll('.bg-circle');
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.2);
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
  
  if (lenis) {
    lenis.on('scroll', updateParallax);
  } else {
    window.addEventListener('scroll', updateParallax);
  }

  /**
   * Project card hover effects
   */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
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
   * Intersection Observer for reveal animations
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
   * Form focus effects
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
   * Liquid cursor with particle trail
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

      const splinePhys = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      };

      // Separate physics for tornado (more responsive than stars)
      const tornadoPhys = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      };

      function syncSplineToMouse() {
        if (window.innerWidth < 768) return;
        
        const app = window.__splineApp;
        const splineObjects = window.__splineObjects;
        if (!app || !splineObjects) return;

        const stars = splineObjects.starsTarget;
        const tornado = splineObjects.tornadoTarget;

        const screenNx = (state.x / window.innerWidth) * 2 - 1;
        const screenNy = (state.y / window.innerHeight) * 2 - 1;

        const xRange = Math.max(220, window.innerWidth / 2.2);
        const yRange = Math.max(160, window.innerHeight / 2.4);

        const targetX = screenNx * xRange;
        const targetY = -screenNy * yRange;

        // Stars follow with heavy physics (existing behavior)
        if (stars && stars.position) {
          const follow = 0.0006;
          splinePhys.vx += (targetX - splinePhys.x) * follow;
          splinePhys.vy += (targetY - splinePhys.y) * follow;

          splinePhys.vx *= 0.96;
          splinePhys.vy *= 0.96;

          splinePhys.x += splinePhys.vx;
          splinePhys.y += splinePhys.vy;

          const bounce = -0.5;
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

          stars.position.x = splinePhys.x * 0.90;
          stars.position.y = splinePhys.y * 0.90;
        }

        // Tornado follows cursor more directly (responsive)
        if (tornado && tornado.position) {
          const tornadoFollow = 0.0012; // Faster than stars
          tornadoPhys.vx += (targetX - tornadoPhys.x) * tornadoFollow;
          tornadoPhys.vy += (targetY - tornadoPhys.y) * tornadoFollow;

          tornadoPhys.vx *= 0.97; // Less friction for responsiveness
          tornadoPhys.vy *= 0.97;

          tornadoPhys.x += tornadoPhys.vx;
          tornadoPhys.y += tornadoPhys.vy;

          const bounce = -0.5;
          const edgeSoftness = 0.05;

          if (tornadoPhys.x > xRange) {
            const over = tornadoPhys.x - xRange;
            tornadoPhys.x = xRange;
            tornadoPhys.vx = tornadoPhys.vx * bounce - over * edgeSoftness;
          } else if (tornadoPhys.x < -xRange) {
            const over = -xRange - tornadoPhys.x;
            tornadoPhys.x = -xRange;
            tornadoPhys.vx = tornadoPhys.vx * bounce + over * edgeSoftness;
          }

          if (tornadoPhys.y > yRange) {
            const over = tornadoPhys.y - yRange;
            tornadoPhys.y = yRange;
            tornadoPhys.vy = tornadoPhys.vy * bounce - over * edgeSoftness;
          } else if (tornadoPhys.y < -yRange) {
            const over = -yRange - tornadoPhys.y;
            tornadoPhys.y = -yRange;
            tornadoPhys.vy = tornadoPhys.vy * bounce + over * edgeSoftness;
          }

          tornado.position.x = tornadoPhys.x;
          tornado.position.y = tornadoPhys.y;
        }
      }

      let masterRafId = null;
      let isMasterLoopRunning = false;

      function masterAnimationLoop() {
        if (!isMasterLoopRunning) return;

        if (!xTo || !yTo) {
          state.x += (state.mx - state.x) * 0.18;
          state.y += (state.my - state.y) * 0.18;
        }

        cursor.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%) scale(${state.scale})`;

        spawnStars();
        syncSplineToMouse();

        if (window.__updateSplineCamera) {
          window.__updateSplineCamera();
        }

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

        masterRafId = requestAnimationFrame(masterAnimationLoop);
      }

      function startMasterLoop() {
        if (isMasterLoopRunning) return;
        isMasterLoopRunning = true;
        masterRafId = requestAnimationFrame(masterAnimationLoop);
      }

      function stopMasterLoop() {
        isMasterLoopRunning = false;
        if (masterRafId) {
          cancelAnimationFrame(masterRafId);
          masterRafId = null;
        }
      }

      startMasterLoop();
      window.addEventListener('beforeunload', stopMasterLoop);
    } catch (e) {
      // Fail silently
    }
  }
  runWhenDomReady(initLiquidCursor);

  /**
   * Magnetic buttons with GSAP
   */
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;

    const targets = Array.from(document.querySelectorAll('.btn, .navmenu a'));
    if (!targets.length) return;

    const RANGE = 50;
    const MAX_SHIFT = 14;

    const items = targets
      .filter((el) => el && !el.dataset.magneticInit)
      .map((el) => {
        el.dataset.magneticInit = 'true';
        gsap.set(el, { x: 0, y: 0, transformOrigin: '50% 50%' });
        return {
          el,
          active: false,
          xTo: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' }),
          yTo: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
        };
      });

    function reset(item) {
      item.active = false;
      gsap.to(item.el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'elastic.out(1, 0.45)',
        overwrite: true
      });
    }

    function onMove(e) {
      const mx = e.clientX;
      const my = e.clientY;

      for (const item of items) {
        const r = item.el.getBoundingClientRect();
        if (!r.width || !r.height) continue;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < RANGE) {
          item.active = true;
          const strength = 1 - dist / RANGE;
          const tx = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dx * 0.22 * strength));
          const ty = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dy * 0.22 * strength));
          item.xTo(tx);
          item.yTo(ty);
        } else if (item.active) {
          reset(item);
        }
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', () => items.forEach(reset));

    items.forEach((item) => {
      item.el.addEventListener('pointerleave', () => reset(item));
    });
  }
  runWhenDomReady(initMagneticButtons);

  /**
   * Tilt cards with GSAP
   */
  function initTiltCards() {
    if (typeof gsap === 'undefined') return;

    const cards = Array.from(document.querySelectorAll('.profile-card, .project-card, .experience-item'));
    if (!cards.length) return;

    const MAX_DEG = 8;

    for (const card of cards) {
      if (!card || card.dataset.tiltInit) continue;
      card.dataset.tiltInit = 'true';

      const cs = window.getComputedStyle(card);
      if (cs.position === 'static') {
        card.style.position = 'relative';
      }
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      let shine = card.querySelector('.glass-shine');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'glass-shine';
        shine.setAttribute('aria-hidden', 'true');
        shine.style.position = 'absolute';
        shine.style.inset = '0';
        shine.style.borderRadius = 'inherit';
        shine.style.pointerEvents = 'none';
        shine.style.mixBlendMode = 'screen';
        shine.style.opacity = '0';
        shine.style.transition = 'opacity 0.25s ease';
        shine.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), rgba(255,255,255,0.08), rgba(255,255,255,0) 60%)';
        card.appendChild(shine);
      }

      const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power3.out' });

      function onEnter() {
        shine.style.opacity = '1';
        gsap.to(card, { z: 0.001, duration: 0.01, overwrite: true });
      }

      function onLeave() {
        rotateXTo(0);
        rotateYTo(0);
        shine.style.opacity = '0';
        gsap.to(card, { duration: 0.8, ease: 'power3.out', clearProps: 'transform' });
      }

      function onCardMove(e) {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const px = (x / r.width) * 2 - 1;
        const py = (y / r.height) * 2 - 1;

        rotateYTo(px * MAX_DEG);
        rotateXTo(-py * MAX_DEG);

        const gx = 100 - (x / r.width) * 100;
        const gy = 100 - (y / r.height) * 100;
        shine.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)`;
      }

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('pointermove', onCardMove);
    }
  }
  runWhenDomReady(initTiltCards);

  /**
   * Gradient text animation
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
   * Console message
   */
  console.log('%c🚀 Modern Portfolio 2024-2025', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with modern web technologies and animations', 'color: #ec4899; font-size: 14px;');

})();

