/**
* Modern Portfolio - Enhanced JavaScript
* Updated 2024-2025 with advanced animations
*/

(function() {
  "use strict";

  /**
   * Header toggle with smooth animation
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
    
    // Add rotation animation
    headerToggleBtn.style.transform = headerToggleBtn.classList.contains('bi-x') 
      ? 'rotate(90deg) scale(1.1)' 
      : 'rotate(0deg) scale(1)';
  }
  
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
   * Enhanced Pure Counter
   */
  new PureCounter();

  /**
   * Enhanced skills animation with stagger
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item, index) => {
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
  const glightbox = GLightbox({
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

  /**
   * Enhanced Isotope with smooth transitions
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
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
  const cursor = document.createElement('div');
  cursor.classList.add('cursor-follower');
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent);
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.15s ease;
    display: none;
  `;
  
  if (window.innerWidth > 1024) {
    document.body.appendChild(cursor);
    cursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.querySelectorAll('a, button, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent)';
      });
    });
  }

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