/**
 * Enhanced Animation Module
 * Intersection Observer-based animations, counters, stagger effects
 */

(function() {
  "use strict";

  const runWhenReady = window.PortfolioUtils?.runWhenDomReady || function(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  /* ================================================================
     INTERSECTION OBSERVER ANIMATIONS
     ================================================================ */

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;

        setTimeout(() => {
          el.classList.add('animate-in');
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, delay);

        // Unobserve after animation
        animationObserver.unobserve(el);
      }
    });
  }, observerOptions);

  /* ================================================================
     STAGGER ANIMATIONS
     ================================================================ */

  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    const reduceMotion = prefersReducedMotion();

    staggerContainers.forEach(container => {
      const children = container.children;
      const baseDelay = parseInt(container.dataset.stagger) || 50;

      Array.from(children).forEach((child, index) => {
        if (reduceMotion) {
          child.classList.add('animate-in');
          child.style.opacity = '1';
          return;
        }

        child.style.opacity = '0';
        child.dataset.delay = baseDelay * index;
        animationObserver.observe(child);
      });
    });
  }

  /* ================================================================
     COUNTER ANIMATION
     ================================================================ */

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter);
          const duration = parseInt(el.dataset.duration) || 2000;
          const suffix = el.dataset.suffix || '';

          animateCounter(el, target, duration, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el, target, duration, suffix) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ================================================================
     MAGNETIC BUTTONS (CSS-based)
     ================================================================ */

  function initMagneticButtons() {
    // Only on devices with hover capability
    if (window.matchMedia('(hover: none)').matches) return;

    const buttons = document.querySelectorAll('.btn--magnetic');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ================================================================
     SCROLL PROGRESS INDICATOR
     ================================================================ */

  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          progressBar.style.width = progress + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ================================================================
     BACK TO TOP BUTTON
     ================================================================ */

  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================================
     SECTION REVEAL ANIMATIONS
     ================================================================ */

  function initSectionReveals() {
    const sections = document.querySelectorAll('.section-reveal');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ================================================================
     HERO STAGGER ANIMATION
     ================================================================ */

  function initHeroStagger() {
    const heroElements = document.querySelectorAll('[data-hero-animate]');

    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo)`;

      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + (index * 150));
    });
  }

  /* ================================================================
     PORTFOLIO FILTERS
     ================================================================ */

  function initPortfolioFilters() {
    const filters = document.querySelectorAll('.portfolio-filter');
    const items = document.querySelectorAll('.portfolio-item');
    if (!filters.length || !items.length) return;

    function applyFilter(filterValue) {
      items.forEach((item) => {
        const categories = (item.dataset.category || '').split(/\s+/).filter(Boolean);
        const matches = filterValue === 'all' || categories.includes(filterValue);

        if (matches) {
          item.classList.remove('is-filtered-out');
          item.hidden = false;
          requestAnimationFrame(() => {
            item.style.display = '';
          });
        } else {
          item.classList.add('is-filtered-out');
          setTimeout(() => {
            if (item.classList.contains('is-filtered-out')) {
              item.hidden = true;
              item.style.display = 'none';
            }
          }, 280);
        }
      });
    }

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        filters.forEach((filter) => filter.classList.remove('is-active'));
        button.classList.add('is-active');
        applyFilter(button.dataset.filter || 'all');
      });
    });
  }

  /* ================================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ================================================================ */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ================================================================
     NAVIGATION ACTIVE INDICATOR
     ================================================================ */

  function initNavIndicator() {
    const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
      const scrollPos = window.scrollY + 100;
      let currentId = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentId = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* ================================================================
     REDUCED MOTION CHECK
     ================================================================ */

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ================================================================
     INITIALIZATION
     ================================================================ */

  runWhenReady(() => {
    if (!prefersReducedMotion()) {
      initStaggerAnimations();
      initCounters();
      initMagneticButtons();
      initHeroStagger();
    }

    initScrollProgress();
    initBackToTop();
    initSectionReveals();
    initPortfolioFilters();
  });

  // Expose API
  window.PortfolioAnimations = {
    observe: (el) => animationObserver.observe(el),
    animateCounter,
    prefersReducedMotion
  };

})();
