/**
* Spline Background Integration
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

    // Create Spline loading overlay
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

    // Create noise overlay
    if (!document.getElementById('noise-overlay')) {
      const noise = document.createElement('div');
      noise.id = 'noise-overlay';
      noise.setAttribute('aria-hidden', 'true');
      document.body.appendChild(noise);
    }

    // Create contrast overlay
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
          let starsTarget = null;
          let tornadoTarget = null;
          let shipTarget = null;
          
          try { cameraTarget = splineApp.findObjectByName('PERSPECTIVE'); } catch (e) {
            console.warn('[Spline] PERSPECTIVE camera not found');
          }
          try { starsTarget = splineApp.findObjectByName('STARS EMITTER'); } catch (e) {
            console.warn('[Spline] STARS EMITTER not found');
          }
          
          // Try to find tornado object (common names)
          try { tornadoTarget = splineApp.findObjectByName('TORNADO'); } catch (e) {}
          if (!tornadoTarget) {
            try { tornadoTarget = splineApp.findObjectByName('VORTEX'); } catch (e) {}
          }
          if (!tornadoTarget) {
            try { tornadoTarget = splineApp.findObjectByName('VORTEXT'); } catch (e) {}
          }
          
          // Find and hide the ship object
          try { shipTarget = splineApp.findObjectByName('SHIP & VORTEXT'); } catch (e) {}
          if (!shipTarget) {
            try { shipTarget = splineApp.findObjectByName('SHIP'); } catch (e) {}
          }
          
          // Hide the ship object if found
          if (shipTarget) {
            if (shipTarget.visible !== undefined) {
              shipTarget.visible = false;
            } else if (shipTarget.material) {
              shipTarget.material.opacity = 0;
              shipTarget.material.transparent = true;
            }
            console.log('[Spline] Ship object hidden');
          }

          // Error boundary: ensure critical objects exist
          if (!starsTarget) {
            console.warn('[Spline] STARS EMITTER missing - mouse follow disabled');
          }
          if (!tornadoTarget) {
            console.warn('[Spline] Tornado object not found - trying alternative names');
          }

          window.__splineApp = splineApp;
          window.__splineObjects = { cameraTarget, starsTarget, tornadoTarget, shipTarget };

          // Device detection: disable mouse follow on mobile
          const isMobile = window.innerWidth < 768;
          
          if (isMobile) {
            // Mobile: Set Spline scene to static, low-CPU state
            console.log('[Spline] Mobile detected - scene set to static state for performance');
            if (cameraTarget && cameraTarget.rotation) {
              cameraTarget.rotation.y = 0;
              cameraTarget.rotation.x = 0;
            }
            if (starsTarget && starsTarget.position) {
              starsTarget.position.x = 0;
              starsTarget.position.y = 0;
            }
            if (tornadoTarget && tornadoTarget.position) {
              tornadoTarget.position.x = 0;
              tornadoTarget.position.y = 0;
            }
          } else {
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

            // Camera rotation (desktop only)
            function updateCamera() {
              if (cameraTarget && cameraTarget.rotation) {
                if (nxTo && nyTo) {
                  nxTo(state.nx);
                  nyTo(state.ny);
                } else {
                  smooth.nx += (state.nx - smooth.nx) * 0.12;
                  smooth.ny += (state.ny - smooth.ny) * 0.12;
                }
                cameraTarget.rotation.y = smooth.nx * 0.35;
                cameraTarget.rotation.x = -smooth.ny * 0.2;
              }
            }
            window.__updateSplineCamera = updateCamera;
          }

          markLoaded();
        })
        .catch((err) => {
          console.error('[Spline] Failed to load/render scene:', err);
          markLoaded();
        });

      // Safety timeout
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
  }
  runWhenDomReady(initBackgroundLayers);

})();

