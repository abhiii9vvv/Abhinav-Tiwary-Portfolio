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
    
    // Clear any existing active states first to prevent conflicts
    const navlinks = select('#navbar .nav-link', true);
    navlinks.forEach(link => link.classList.remove('active'));
    
    if (el === '#header' || targetElement.id === 'header') {
      // Smooth scroll to very top for home section
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      // Immediately set home link as active
      const homeLink = select('#navbar .nav-link[href="#header"]');
      if (homeLink) homeLink.classList.add('active');
      return;
    }
    
    // Calculate precise position for other sections with proper offsets
    const header = select('#header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Section-specific offsets for better positioning
    let offset = headerHeight + 20; // Base offset
    
    switch(targetElement.id) {
      case 'about-preview':
        offset = headerHeight + 10;
        break;
      case 'resume':
        offset = headerHeight + 20;
        break;
      case 'portfolio':
        offset = headerHeight + 15;
        break;
      case 'certifications':
        offset = headerHeight + 20;
        break;
      case 'contact':
        offset = headerHeight + 20;
        break;
    }
    
    // Use offsetTop for more accurate positioning
    const targetTop = targetElement.offsetTop;
    
    // Execute smooth scroll with calculated offset
    window.scrollTo({
      top: Math.max(0, targetTop - offset),
      behavior: 'smooth'
    });
    
    // Set the corresponding nav link as active after scroll starts
    setTimeout(() => {
      const activeLink = select(`#navbar .nav-link[href="${el}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }, 50);
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
        <li><a href="#certifications" class="nav-link"><i class="bi bi-award"></i><span>Certifications</span></a></li>
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

    // Handle mobile navigation clicks with clean separation
    const mobileNavLinks = mobileSidebar.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = link.getAttribute('href');
        if (!hash) return;

        // Handle navigation text visibility
        const isHomepage = hash === '#header';
        if (isHomepage) {
          document.body.classList.remove('hide-hero');
          document.body.style.overflow = 'hidden';
          // Update hash for homepage
          if (window.location.hash !== '#header') {
            window.location.hash = '#header';
          }
        } else {
          document.body.classList.add('hide-hero');
          document.body.style.overflow = 'auto';
          // Update hash for other sections
          if (window.location.hash !== hash) {
            window.location.hash = hash;
          }
        }

        // Close mobile sidebar
        mobileSidebar.classList.remove('active');
        
        // Navigate to section
        scrollto(hash);
        
        // Update mobile navigation text visibility
        setTimeout(() => {
          updateMobileNavTextVisibility();
        }, 50);
        
        // Update active state
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /**
   * Improved navigation handler with conflict prevention
   */
  on('click', '#navbar .nav-link, .quick-btn', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    const hash = this.getAttribute('href');
    if (!hash) return;

    // Remove active class from all nav links immediately
    const navlinks = select('#navbar .nav-link', true);
    navlinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link immediately for visual feedback
    this.classList.add('active');

    // Simple hero visibility toggle for clean section separation
    if (hash !== '#header') {
      document.body.classList.add('hide-hero');
      document.body.style.overflow = 'auto';
      // Update location hash to ensure scroll prevention logic works correctly
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    } else {
      document.body.classList.remove('hide-hero');
      document.body.style.overflow = 'hidden';
      // Clear hash for homepage
      if (window.location.hash !== '#header') {
        window.location.hash = '#header';
      }
    }

    // Update mobile navigation text visibility
    setTimeout(() => {
      updateMobileNavTextVisibility();
    }, 50);

    // Direct scroll with improved navigation
    setTimeout(() => {
      scrollto(hash);
    }, 10); // Small delay to ensure DOM updates
  }, true);

  /**
   * Consolidated initialization and load handling
   */
  function initializeApp() {
    try {
      // Initialize other components that depend on DOM being ready
      initializeScrollSpy();
      initializePortfolio();
      initializeMobileSidebar();
      
      // Ensure mobile navigation text is visible on load
      updateMobileNavTextVisibility();
      
      // Handle hash navigation (clean section separation)
      const hash = window.location.hash;
      if (hash && hash !== '#header') {
        // Apply hero visibility first
        document.body.classList.add('hide-hero');
        document.body.style.overflow = 'auto';
        // Direct scroll without delay
        scrollto(hash);
      } else {
        // On home page - prevent scrolling
        document.body.classList.remove('hide-hero');
        document.body.style.overflow = 'hidden';
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
      console.error("Initialization error:", error);
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

          // Header compact logic
          if (scrollY > 100) {
            header.classList.add('compact');
          } else {
            header.classList.remove('compact');
          }

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
              if (section.id === 'header') return; // Skip header for this loop
              
              const sectionTop = section.offsetTop;
              const sectionHeight = section.offsetHeight;
              const headerHeight = header ? header.offsetHeight : 0;
              
              // Calculate adjusted position considering header
              const adjustedTop = sectionTop - headerHeight - 30;
              const adjustedBottom = adjustedTop + sectionHeight;
              
              // Check if current scroll position is within this section
              if (scrollY >= adjustedTop && scrollY < adjustedBottom) {
                // Calculate distance from top of section for best match
                const distance = Math.abs(scrollY - adjustedTop);
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

  function initializePortfolio() {
    try {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer && typeof Isotope !== 'undefined') {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });

        let portfolioFilters = select('#portfolio-flters li', true);

        on('click', '#portfolio-flters li', function(e) {
          e.preventDefault();
          portfolioFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }, true);
      }
    } catch (error) {
      // Portfolio initialization error handled silently
    }
  }

  // Initialize everything when page fully loaded (single consolidated invocation)
  window.addEventListener('load', initializeApp);

  // Listen for theme changes and update mobile navigation visibility
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
        // Theme changed, update mobile navigation text visibility
        setTimeout(() => {
          updateMobileNavTextVisibility();
        }, 100);
      }
    });
  });

  // Start observing theme changes
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });

  // Custom on-screen alert system
  function showCustomAlert(message) {
    // Remove existing alert if any
    const existingAlert = document.getElementById('custom-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    // Detect current theme
    const isDarkTheme = document.body.classList.contains('dark-theme') || 
                       document.documentElement.getAttribute('data-theme') === 'dark' ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.id = 'custom-alert';
    alertDiv.innerHTML = `
      <div class="alert-content">
        <div class="alert-icon"><i class="bi bi-info-circle"></i></div>
        <div class="alert-message">${message}</div>
        <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Theme-based styling
    const bgColor = isDarkTheme ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = isDarkTheme ? '#ffffff' : '#333333';
    const borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Calculate bottom position based on screen size to avoid footer collision
    const isMobile = window.innerWidth <= 992;
    const isSmallMobile = window.innerWidth <= 480;
    let bottomPosition = '20px'; // Desktop default
    
    if (isSmallMobile) {
      bottomPosition = '100px'; // Small mobile - highest position
    } else if (isMobile) {
      bottomPosition = '80px';  // Regular mobile/tablet
    }
    
    // Add styles - compact and rectangular positioned
    alertDiv.style.cssText = `
      position: fixed;
      bottom: ${bottomPosition};
      left: 50%;
      transform: translateX(-50%);
      background: ${bgColor};
      color: ${textColor};
      padding: 0;
      border-radius: 4px;
      z-index: 10000;
      max-width: 280px;
      width: auto;
      min-width: 240px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid ${borderColor};
      backdrop-filter: blur(10px);
      animation: alertSlideUp 0.3s ease-out;
    `;

    // Style the content
    const style = document.createElement('style');
    style.textContent = `
      @keyframes alertSlideUp {
        from { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
      }
      #custom-alert .alert-content {
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        text-align: center;
      }
      #custom-alert .alert-icon {
        font-size: 16px;
        flex-shrink: 0;
      }
      #custom-alert .alert-message {
        font-size: 13px;
        line-height: 1.3;
        flex: 1;
        margin: 0;
        font-weight: 500;
        text-align: center;
        white-space: nowrap;
      }
      #custom-alert .alert-close {
        position: absolute;
        top: 4px;
        right: 6px;
        background: none;
        border: none;
        color: ${textColor};
        font-size: 14px;
        cursor: pointer;
        padding: 0;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: all 0.2s ease;
      }
      #custom-alert .alert-close:hover {
        opacity: 1;
        background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      }
      @media (max-width: 992px) and (min-width: 481px) {
        #custom-alert {
          bottom: 80px;
        }
      }
      @media (max-width: 480px) {
        #custom-alert {
          bottom: 100px;
          max-width: 200px;
          min-width: 180px;
        }
        #custom-alert .alert-content {
          padding: 6px 10px;
          gap: 6px;
        }
        #custom-alert .alert-message {
          font-size: 12px;
        }
        #custom-alert .alert-icon {
          font-size: 14px;
        }
      }
    `;
    
    if (!document.getElementById('custom-alert-styles')) {
      style.id = 'custom-alert-styles';
      document.head.appendChild(style);
    } else {
      // Update existing styles for theme changes
      document.getElementById('custom-alert-styles').textContent = style.textContent;
    }

    document.body.appendChild(alertDiv);

    // Auto-remove after 4 seconds (shorter for small alert)
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.style.animation = 'alertSlideUp 0.3s ease-in reverse';
        setTimeout(() => {
          if (alertDiv.parentNode) {
            alertDiv.remove();
          }
        }, 300);
      }
    }, 4000);
  }

  // Home page scroll prevention and alert system
  let lastScrollAlert = 0;
  const alertCooldown = 3000; // 3 seconds between alerts
  
  function isOnHomePage() {
    return window.scrollY < 50 && (location.hash === '' || location.hash === '#' || location.hash === '#header') && !document.body.classList.contains('hide-hero');
  }
  
  function preventHomeScroll(e) {
    const currentHash = location.hash;
    const isActualHomepage = (currentHash === '' || currentHash === '#' || currentHash === '#header');
    const isAtTopOfPage = window.scrollY < 50;
    const heroIsVisible = !document.body.classList.contains('hide-hero');
    
    if (isActualHomepage && isAtTopOfPage && heroIsVisible) {
      e.preventDefault();
      e.stopPropagation();
      
      // Show custom alert with cooldown to prevent spam
      const now = Date.now();
      if (now - lastScrollAlert > alertCooldown) {
        showCustomAlert('Use sidebar to navigate sections');
        lastScrollAlert = now;
      }
      
      // Force scroll back to top
      window.scrollTo({ top: 0, behavior: 'instant' });
      return false;
    }
  }
  
  // Add scroll prevention listeners
  window.addEventListener('wheel', preventHomeScroll, { passive: false });
  window.addEventListener('touchmove', preventHomeScroll, { passive: false });
  window.addEventListener('keydown', (e) => {
    const currentHash = location.hash;
    const isActualHomepage = (currentHash === '' || currentHash === '#' || currentHash === '#header');
    const isAtTopOfPage = window.scrollY < 50;
    const heroIsVisible = !document.body.classList.contains('hide-hero');
    
    if (isActualHomepage && isAtTopOfPage && heroIsVisible) {
      // Prevent arrow keys, page up/down, space, home/end when on home page
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollAlert > alertCooldown) {
          showCustomAlert('Use sidebar to navigate sections');
          lastScrollAlert = now;
        }
      }
    }
  });
  
  // Simple scroll-based hero toggle (clean section separation)
  window.addEventListener('scroll', () => {
    const currentHash = location.hash;
    const isAtTop = window.scrollY < 80;
    const isHomepage = (currentHash === '' || currentHash === '#' || currentHash === '#header');
    
    if (isAtTop && isHomepage) {
      document.body.classList.remove('hide-hero');
      // Force back to top if somehow scrolled on home
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (window.scrollY > 120 || !isHomepage) {
      document.body.classList.add('hide-hero');
    }
    
    // Update mobile navigation text visibility
    updateMobileNavTextVisibility();
  });

  /**
   * Initiate Glightbox 
   */
  const glightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate certificates lightbox 
   */
  // Ensure GLightbox is available and DOM is ready
  if (typeof GLightbox !== 'undefined') {
    // Initialize GLightbox for certificates
    const certificateLightbox = GLightbox({
      selector: '.glightbox',
      type: 'image',
      touchNavigation: true,
      loop: true,
      skin: 'clean',
      closeButton: true,
      closeOnOutsideClick: true,
      slideEffect: 'slide',
      moreText: {
        download: 'Download',
        toggleZoom: 'Toggle zoom',
        toggleSlideshow: 'Toggle slideshow',
        toggleThumbs: 'Toggle thumbs'
      }
    });
    
    // Debug log to confirm initialization
    console.log('GLightbox initialized for all .glightbox elements', certificateLightbox);
  } else {
    console.error('GLightbox is not available');
  }

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  document.addEventListener("DOMContentLoaded", function () {
    const contextMenu = document.getElementById("context-menu");
    const copyTextItem = document.getElementById("copy-text");
    let selectedText = ""; // Store selected text

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();

      selectedText = window.getSelection().toString().trim();
      updateCopyState();

      contextMenu.style.top = `${event.clientY}px`;
      contextMenu.style.left = `${event.clientX}px`;
      contextMenu.classList.add("active");
    });

    document.addEventListener("click", (event) => {
      if (!contextMenu.contains(event.target)) {
        hideContextMenu();
      }
    });

    document.getElementById("refresh").addEventListener("click", () => {
      location.reload();
      hideContextMenu();
    });

    document.getElementById("go-back").addEventListener("click", () => {
      history.back();
      hideContextMenu();
    });

    document.getElementById("scroll-top").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      hideContextMenu();
    });

    function updateCopyState() {
      if (selectedText.length > 0) {
        copyTextItem.classList.remove("disabled");
        copyTextItem.onclick = () => {
          copyText();
          hideContextMenu();
        };
      } else {
        copyTextItem.classList.add("disabled");
        copyTextItem.onclick = null;
      }
    }

    function copyText() {
      if (selectedText.length > 0) {
        navigator.clipboard.writeText(selectedText)
          .then(() => {
            // Text copied successfully - show custom notification
            showCustomAlert('Text copied to clipboard!');
          })
          .catch(err => {
            // Copy operation failed - show custom notification
            showCustomAlert('Failed to copy text. Please try again.');
          });
      }
    }

    function hideContextMenu() {
      contextMenu.classList.remove("active");
    }
  });

  /**
 * Initialize and update IST time display
 */
  function getEmojiForHour(hour) {
    if (hour >= 0 && hour < 3) return "🌑";
    if (hour >= 3 && hour < 6) return "🌘";  
    if (hour >= 6 && hour < 12) return "🌞"; 
    if (hour >= 12 && hour < 17) return "🌤️"; 
    if (hour >= 17 && hour < 19) return "🌇"; 
    if (hour >= 19 && hour < 21) return "🌙"; 
    if (hour >= 21 && hour < 24) return "🌚"; 
    return "🕰️";
  }
  function updateTime() {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const istTime = now.toLocaleTimeString("en-US", options);
    const dateOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    const currentDate = now.toLocaleDateString("en-US", dateOptions);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const gmtDifference = `GMT+${(istOffset / 3600000).toFixed(1)}`;
    const hour = now.getHours();
    const emoji = getEmojiForHour(hour);
    // Update all time display elements (support multiple locations)
    document.querySelectorAll('#time, #time-footer').forEach(el=>{
      el.textContent = `${istTime} IST`;
    });
  }

  setInterval(updateTime, 1000);
  updateTime();

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

  // Fix certifications navigation scroll positioning
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href="#certifications"]');
    if (link) {
      e.preventDefault();
      const certificationsSection = document.getElementById('certifications');
      if (certificationsSection) {
        const offsetTop = certificationsSection.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });

  /**
   * ScrollReveal removed for performance optimization
   */

  // document.addEventListener('DOMContentLoaded', function () {
  //   const element = document.getElementById('sr');
  //   if (element) {
  //     ScrollReveal({
  //       reset: false
  //     }).reveal('#sr', {
  //       delay: 300,
  //       duration: 1000,
  //     });
  //   }
  // });

  /**
   * Mobile scroll navigator: cycles through sections sequentially
   */
  const scrollNavBtn = document.getElementById('scroll-nav');
  if (scrollNavBtn) {
    const sections = Array.from(document.querySelectorAll('section'));
    const headerEl = document.getElementById('header');

    function nextSection() {
      const viewportHeight = window.innerHeight;
      const scrollPos = window.scrollY;
      // Build list including header top offset 0 treated as pseudo-section
      const targets = [{el: headerEl, top: 0}].concat(
        sections.map(s => ({ el: s, top: s.getBoundingClientRect().top + scrollPos }))
      );
      // Find current index (closest top not greater than scrollPos+10)
      let currentIndex = 0;
      for (let i = 0; i < targets.length; i++) {
        if (targets[i].top - 10 <= scrollPos) currentIndex = i; else break;
      }
      const nextIndex = Math.min(targets.length - 1, currentIndex + 1);
      const dest = targets[nextIndex];
      const offset = 70; // mobile header offset
      window.scrollTo({ top: dest.top - offset, behavior: 'instant' });
    }
    scrollNavBtn.addEventListener('click', nextSection);

    // Hide button near bottom of page
    function toggleBtnVisibility() {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200);
      scrollNavBtn.style.opacity = nearBottom ? 0 : 0.95;
      scrollNavBtn.style.pointerEvents = nearBottom ? 'none' : 'auto';
    }
    window.addEventListener('scroll', toggleBtnVisibility);
    toggleBtnVisibility();
  }


  /**
   * Back to top button functionality - now handled in initializeApp
   */
  // Back to top functionality is now consolidated in initializeApp function

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
      .catch((error) => {
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

  // Preload critical images for faster loading
  const criticalImages = [
    'src/assets/icons/html.svg',
    'src/assets/icons/css.svg',
    'src/assets/icons/js.svg',
    'src/assets/icons/react.svg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

  // Fallback GLightbox initialization for certificates (ensure it works)
  setTimeout(() => {
    const certificateLinks = document.querySelectorAll('.glightbox');
    console.log('Found glightbox links:', certificateLinks.length);
    
    if (certificateLinks.length > 0 && typeof GLightbox !== 'undefined') {
      // Re-initialize if needed
      GLightbox({
        selector: '.glightbox',
        type: 'image',
        touchNavigation: true,
        loop: true,
        skin: 'clean',
        closeButton: true,
        closeOnOutsideClick: true,
        slideEffect: 'slide'
      });
      console.log('Fallback GLightbox re-initialized');
    }
  }, 1500);

  // Simple fallback for certificate clicks if GLightbox fails
  document.addEventListener('click', function(e) {
    const certificateLink = e.target.closest('.glightbox');
    if (certificateLink) {
      console.log('Certificate link clicked:', certificateLink.href);
      
      // Let GLightbox handle it first, then check if it worked
      setTimeout(() => {
        if (!document.querySelector('.glightbox-open')) {
          console.log('GLightbox did not open, using fallback');
          window.open(certificateLink.href, '_blank');
        }
      }, 300);
    }
  });

})();