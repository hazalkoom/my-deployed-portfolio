/**
* Core Setup - Lenis, GSAP, Utilities
* Modern Portfolio 2024-2025
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
            return lenis.scroll;
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
        gsap.registerPlugin(ScrollTrigger);
      }
    } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  } catch (e) {
    lenis = null;
  }

  // Expose lenis globally
  window.PortfolioUtils.lenis = lenis;

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

  window.PortfolioUtils.splitTextToChars = splitTextToChars;

  function initGsapScrollEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Headings reveal per section
    document.querySelectorAll('section').forEach((section) => {
      const headings = section.querySelectorAll('.section-title h1, .section-title h2, .section-title h3, header h1, header h2, h1, h2');
      if (!headings.length) return;

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

})();

