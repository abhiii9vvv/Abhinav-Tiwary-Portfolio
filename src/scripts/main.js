(function () {
  "use strict";

  // Production-ready loading detection
  let resourcesLoaded = false;
  let scriptsReady = false;

  function checkReadiness() {
    if (document.readyState === 'complete' && scriptsReady) {
      resourcesLoaded = true;
    }
  }

  document.addEventListener('readystatechange', checkReadiness);
  setTimeout(() => { scriptsReady = true; checkReadiness(); }, 100);

  // Preloader completely removed - site loads immediately

  // Removed: particles & scroll reveal (no .reveal-element elements present)

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Improved scrollto function with reliable navigation
   */
  const scrollto = (el) => {
    const targetElement = select(el);
    if (!targetElement) return;

    // Update active state across all nav links
    const navlinks = select('#navbar .nav-link', true);
    navlinks.forEach(link => link.classList.remove('active'));
    const activeLink = select(`#navbar .nav-link[href="${el}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (el === '#header' || targetElement.id === 'header') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Use getBoundingClientRect for pixel-accurate position regardless of nesting
    const NAVBAR_H = 80; // fixed navbar height + small breathing room
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPos = rect.top + scrollTop - NAVBAR_H;

    window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
  }

  /**
   * Scroll locking to prevent about section from scrolling up to home
   */
  // Removed scroll locking (not needed with simplified layout)

  /**
   * Update mobile navigation text visibility - always show text for better UX
   */
  function updateMobileNavTextVisibility() {
    // Always show mobile navigation text for better user experience
    const spans = document.querySelectorAll('.mobile-nav .nav-link span');
    spans.forEach(span => {
      span.classList.remove('hidden');
    });
  }
  function initializeMobileSidebar() {
    // Create mobile menu button if it doesn't exist
    let mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenuBtn) {
      mobileMenuBtn = document.createElement('button');
      mobileMenuBtn.id = 'mobile-menu-btn';
      mobileMenuBtn.setAttribute('aria-hidden', 'true'); // navbar hamburger handles this
      mobileMenuBtn.innerHTML = '☰';
      mobileMenuBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 8px;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(mobileMenuBtn);
    }

    // Create mobile sidebar overlay
    let mobileSidebar = document.getElementById('mobile-sidebar');
    if (!mobileSidebar) {
      mobileSidebar = document.createElement('div');
      mobileSidebar.id = 'mobile-sidebar';
      
      // Get navigation links from existing sidebar
      const existingNav = document.querySelector('#navbar');
      const navLinks = existingNav ? existingNav.innerHTML : `
        <li><a href="#header" class="nav-link"><i class="bi bi-house"></i><span>Home</span></a></li>
        <li><a href="#about-preview" class="nav-link"><i class="bi bi-person"></i><span>About</span></a></li>
        <li><a href="#resume" class="nav-link"><i class="bi bi-file-earmark-text"></i><span>Resume</span></a></li>
        <li><a href="#portfolio" class="nav-link"><i class="bi bi-grid"></i><span>Projects</span></a></li>
        <li><a href="#contact" class="nav-link"><i class="bi bi-envelope"></i><span>Contact</span></a></li>
      `;
      
      mobileSidebar.innerHTML = `
        <div class="mobile-sidebar-content">
          <div class="mobile-sidebar-header">
            <button id="mobile-sidebar-close">×</button>
          </div>
          <nav class="mobile-nav">
            <ul>${navLinks}</ul>
          </nav>
        </div>
        <div class="mobile-sidebar-overlay"></div>
      `;
      
      mobileSidebar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: none;
      `;
      
      document.body.appendChild(mobileSidebar);
      
      // Ensure mobile navigation text is visible immediately
      setTimeout(() => {
        updateMobileNavTextVisibility();
      }, 10);
    }

    // Add mobile sidebar styles
    const mobileStyles = document.createElement('style');
    mobileStyles.id = 'mobile-sidebar-styles';
    mobileStyles.textContent = `
      @media (max-width: 992px) {
        #mobile-menu-btn {
          display: flex !important;
        }
        
        #mobile-sidebar.active {
          display: block !important;
        }
        
        .mobile-sidebar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          /* Fallback for browsers that don't support backdrop-filter */
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.1) 0%, transparent 50%);
        }
        
        .mobile-sidebar-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 280px;
          height: 100%;
          background: #040404;
          border-right: 1px solid rgba(255,255,255,0.08);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow-y: auto;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
          /* Ensure content is above overlay */
          z-index: 1;
        }
        
        #mobile-sidebar.active .mobile-sidebar-content {
          transform: translateX(0);
        }
        
        .mobile-sidebar-header {
          padding: 15px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        
        #mobile-sidebar-close {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }
        
        #mobile-sidebar-close:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        
        .mobile-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .mobile-nav li {
          margin: 0;
          position: relative;
        }
        
        .mobile-nav .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 26px 12px 32px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          border-bottom: none;
          transition: background .25s, color .25s, padding-left .25s;
        }
        
        .mobile-nav .nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
          padding-left: 36px;
        }
        
        .mobile-nav .nav-link.active {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        
        .mobile-nav .nav-link i {
          font-size: 18px;
          color: var(--accent-color);
          min-width: 18px;
        }
        
        .mobile-nav .nav-link.active i {
          filter: drop-shadow(0 0 4px var(--accent-color));
        }
        
        .mobile-nav .nav-link span {
          transition: all 0.3s ease;
          opacity: 1;
          display: inline;
        }
        
        .mobile-nav .nav-link span.hidden {
          opacity: 0;
          display: none;
        }
        
        #mobile-menu-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.05);
        }
        
        /* Enhanced mobile responsiveness */
        @media (max-width: 480px) {
          .mobile-sidebar-content {
            width: 260px;
          }
          
          #mobile-menu-btn {
            width: 45px;
            height: 45px;
            top: 15px;
            left: 15px;
            font-size: 18px;
          }
          
          .mobile-sidebar-overlay {
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
          }
        }
        
        @media (max-width: 320px) {
          .mobile-sidebar-content {
            width: 240px;
          }
        }
        
        /* Ensure blur works on iOS Safari */
        @supports not (backdrop-filter: blur(1px)) {
          .mobile-sidebar-overlay {
            background: rgba(0, 0, 0, 0.8);
          }
        }
      }
    `;
    
    if (!document.getElementById('mobile-sidebar-styles')) {
      document.head.appendChild(mobileStyles);
    }

    // Check if currently on homepage and hide navigation text accordingly
    setTimeout(() => {
      updateMobileNavTextVisibility();
    }, 100);

    // Mobile menu functionality
    mobileMenuBtn.addEventListener('click', () => {
      mobileSidebar.classList.add('active');
    });

    // Close mobile sidebar
    const closeBtn = document.getElementById('mobile-sidebar-close');
    const overlay = mobileSidebar.querySelector('.mobile-sidebar-overlay');
    
    [closeBtn, overlay].forEach(element => {
      if (element) {
        element.addEventListener('click', () => {
          mobileSidebar.classList.remove('active');
        });
      }
    });

    // Handle mobile navigation clicks
    const mobileNavLinks = mobileSidebar.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = link.getAttribute('href');
        if (!hash) return;

        // Close mobile sidebar
        mobileSidebar.classList.remove('active');

        // Navigate to section
        scrollto(hash);

        // Update active state
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /**
   * Mobile Navigation Hamburger Menu Handler
   */
  function initializeHamburgerMenu() {
    // Wire up primary nav clicks to the shared scroll helper
    const navLinks = select('.nav-menu a', true);
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = link.getAttribute('href');
        if (hash) scrollto(hash);
      });
    });
  }

  /**
   * Consolidated initialization and load handling
   */
  function initializeApp() {
    try {
      // Initialize other components that depend on DOM being ready
      initializeScrollSpy();
      initializeMobileSidebar();
      initializeHamburgerMenu();
      
      // Ensure mobile navigation text is visible on load
      updateMobileNavTextVisibility();
      
      // Handle hash navigation on page load
      const hash = window.location.hash;
      if (hash && hash !== '#header') {
        setTimeout(() => scrollto(hash), 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      
      // Initialize back to top functionality
      const backToTop = document.querySelector('.back-to-top');
      if (backToTop) {
        const toggleBacktotop = () => {
          if (window.scrollY > 100) {
            backToTop.classList.add('active');
          } else {
            backToTop.classList.remove('active');
          }
        };
        toggleBacktotop(); // Run once
        window.addEventListener('scroll', toggleBacktotop);
        
        backToTop.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      }
      
    } catch (error) {
      // Non-critical initialization error handled silently
    }
  }
  
  function initializeScrollSpy() {
    const header = select('#header');
    if (header) {
      const sections = select('section', true);
      const navlinks = select('#navbar .nav-link', true);
      const allWatchable = [header, ...sections].filter(Boolean);

      const onScroll = () => {
        try {
          const scrollY = window.scrollY;

          // Active link logic (scrollspy) - improved detection
          let currentSectionId = '';
          
          // If we're at the very top (home section), set header as current
          if (scrollY < 50) {
            currentSectionId = 'header';
          } else {
            // Check other sections with improved detection logic
            let bestMatch = null;
            let bestDistance = Infinity;
            
          allWatchable.forEach(section => {
              if (section.id === 'header') return;

              // getBoundingClientRect gives accurate absolute pos
              const rect = section.getBoundingClientRect();
              const absTop = rect.top + scrollY;
              const absBottom = absTop + section.offsetHeight;
              const OFFSET = 90;

              if (scrollY + OFFSET >= absTop && scrollY + OFFSET < absBottom) {
                const distance = Math.abs(scrollY - (absTop - OFFSET));
                if (distance < bestDistance) {
                  bestDistance = distance;
                  bestMatch = section.id;
                }
              }
            });
            
            currentSectionId = bestMatch || '';
          }

          // Update navigation links with improved logic
          navlinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
              link.classList.add('active');
            }
          });

          // Ensure Home link is highlighted when at the top
          if (currentSectionId === 'header' || scrollY < 50) {
            const homeLink = select('#navbar .nav-link[href="#header"]');
            if (homeLink) {
              homeLink.classList.add('active');
            }
          }

        } catch (error) {
          // ScrollSpy error handled silently
        }
      };

      onScroll(); // Run once on load
      document.addEventListener('scroll', onScroll);
    }
  }

  // Initialize everything when page fully loaded (single consolidated invocation)
  window.addEventListener('load', initializeApp);

  // Mobile navigation text visibility on scroll
  window.addEventListener('scroll', () => {
    updateMobileNavTextVisibility();
  });

  /**
   * Calculate and update real-time age display with precise time units
   */

  function calculateAge() {
    const ageElement = document.getElementById("age");
    if (!ageElement) return; // Exit if age element doesn't exist
    
    const birthDate = new Date("2005-12-30T00:00:00"); // Updated birth date with time
    const now = new Date();
    
    // Calculate the difference in milliseconds
    const timeDiff = now - birthDate;
    
    // Calculate years
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate hours, minutes, and seconds
    const hours = now.getHours() - birthDate.getHours();
    const minutes = now.getMinutes() - birthDate.getMinutes();
    const seconds = now.getSeconds() - birthDate.getSeconds();
    
    // Adjust for negative time values
    let adjustedHours = hours;
    let adjustedMinutes = minutes;
    let adjustedSeconds = seconds;
    
    if (adjustedSeconds < 0) {
      adjustedSeconds += 60;
      adjustedMinutes--;
    }
    
    if (adjustedMinutes < 0) {
      adjustedMinutes += 60;
      adjustedHours--;
    }
    
    if (adjustedHours < 0) {
      adjustedHours += 24;
      days--;
    }
    
    // Ensure all values are positive
    adjustedHours = Math.abs(adjustedHours);
    adjustedMinutes = Math.abs(adjustedMinutes);
    adjustedSeconds = Math.abs(adjustedSeconds);

    // Display age with main age prominent and countdown smaller
    ageElement.innerHTML = `<span style="font-size: 1em; font-weight: 600;">${years}</span> <span style="font-size: 0.75em; opacity: 0.7;">+ ${months}m ${days}d ${adjustedHours}h ${adjustedMinutes}m ${adjustedSeconds}s</span>`;
  }

  calculateAge(); // Calculate once on load
  
  // Update age counter every second for real-time display
  setInterval(calculateAge, 1000);

  // Fix resume navigation scroll positioning
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href="#resume"]');
    if (link) {
      e.preventDefault();
      const resumeSection = document.getElementById('resume');
      if (resumeSection) {
        const offsetTop = resumeSection.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });

  /**
     * Handle form submission 
     */
  const formspreeEndpoint = "https://formspree.io/f/mjkewrdg";
  const contactForm = document.querySelector(".php-email-form");
  if (contactForm) contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = new FormData(this);
    const formEntries = new URLSearchParams(form);
    const submitButton = this.querySelector(".submit-btn");

    submitButton.classList.remove("btn-error", "btn-success");
    submitButton.classList.add("btn-loading");
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    fetch(formspreeEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formEntries,
    })
      .then(() => {
        submitButton.classList.remove("btn-loading");
        submitButton.classList.add("btn-success");
        submitButton.textContent = "Message Sent!";
        this.reset();

        setTimeout(() => {
          submitButton.textContent = "Send Message";
          submitButton.classList.remove("btn-success");
          submitButton.disabled = false;
        }, 3000);
      })
      .catch(() => {
        // Form submission error handled silently
        submitButton.classList.remove("btn-loading");
        submitButton.classList.add("btn-error");
        submitButton.textContent = "Something went wrong.";

        setTimeout(() => {
          submitButton.textContent = "Send Message";
          submitButton.classList.remove("btn-error");
          submitButton.disabled = false;
        }, 3000);
      });
  });

  // Handle lazy loading image animations
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.onload = () => {
            img.classList.add('loaded');
          };
          if (img.complete) {
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
    });
  }

})();
