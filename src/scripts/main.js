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
   * Enhanced smooth scrolling to an element with header offset
   */
  const scrollto = (el) => {
    const targetElement = select(el);
    if (!targetElement) return;
    
    // Add transition class for smoother visual transitions
    document.body.classList.add('is-scrolling');
    
    if (el === '#header' || targetElement.id === 'header') {
      // Force to very top for home section with smooth animation
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Clean up transition class after animation completes
      setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 800);
      return;
    }
    
    // Calculate precise position for other sections
    const rect = targetElement.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    
    // Check if header is in compact mode and adjust offset accordingly
    const header = select('#header');
    const isCompact = header && header.classList.contains('compact');
    
    // Enhanced section offset logic with special handling for about section
    let offset;
    if (el === '#about-preview') {
      // Improved About section positioning:
      // 1. Always ensure full visibility below header
      // 2. Add extra margin for visual separation
      const headerHeight = header ? header.offsetHeight : 0;
      const margin = 20; // increased margin for better visual separation
      offset = headerHeight + margin;
      
      // Add a class to indicate we're viewing the about section
      setTimeout(() => {
        document.body.classList.add('viewing-about');
      }, 300);
    } else {
      offset = isCompact ? 80 : 20;
      
      // Remove about-specific class if navigating to other sections
      setTimeout(() => {
        document.body.classList.remove('viewing-about');
      }, 300);
    }
    
    // Execute the smooth scroll with calculated offset
    window.scrollTo({
      top: Math.max(0, absoluteTop - offset),
      behavior: 'smooth'
    });
    
    // Clean up transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 800);
  }

  /**
   * Scroll locking to prevent about section from scrolling up to home
   */
  // Removed scroll locking (not needed with simplified layout)

  /**
   * Mobile nav toggle
   */
  // Mobile hamburger removed; desktop-style nav always visible now.

  /**
   * Enhanced scroll handler for all navigation links
   */
  on('click', '#navbar .nav-link, .quick-btn', function(e) {
    e.preventDefault();
    const hash = this.getAttribute('href');
    if (!hash) return;

    // Track navigation source for analytics and transitions
    const isMainNavigation = this.classList.contains('nav-link');
    const isQuickButton = this.classList.contains('quick-btn');
    const isHomeToAbout = (hash === '#about-preview' && window.scrollY < 100);
    
    // Apply special transition class for home-to-about scroll
    if (isHomeToAbout) {
      document.body.classList.add('home-to-about-transition');
      setTimeout(() => {
        document.body.classList.remove('home-to-about-transition');
      }, 1000);
    }

    // Apply hero visibility change first to avoid layout shift mid-scroll
    if (hash !== '#header') document.body.classList.add('hide-hero');
    else document.body.classList.remove('hide-hero');

    // For smoother transitions, add small delay when navigating from home to about
    const scrollDelay = isHomeToAbout ? 50 : 0;
    
    // Defer scroll until next frame so header size is final, with optional delay
    setTimeout(() => {
      requestAnimationFrame(() => scrollto(hash));
    }, scrollDelay);
  }, true);

  /**
   * Production-ready initialization
   */
  function initializeApp() {
    try {
      // Initialize other components that depend on DOM being ready
      initializeScrollSpy();
      initializePortfolio();
      initializeHomeScrollLock(); // Add home page scroll lock
      
    } catch (error) {
      // Non-critical initialization error handled silently
      console.error("Initialization error:", error);
    }
  }
  
  /**
   * Home page scroll lock functionality
   */
  function initializeHomeScrollLock() {
    // Only enable scroll lock if we're at the top of the page on load
    if (window.scrollY < 50) {
      document.body.classList.add('lock-home-scroll');
    }
    
    // Function to handle wheel events
    const handleWheel = (e) => {
      // If we're on the home page and user is trying to scroll down
      if (window.scrollY < 50 && e.deltaY > 0 && document.body.classList.contains('lock-home-scroll')) {
        e.preventDefault();
        
        // Visual indicator that scroll is locked and hint to use navigation
        const header = select('#header');
        if (header) {
          if (!header.classList.contains('scroll-locked')) {
            header.classList.add('scroll-locked');
            
            // Show navigation hint
            if (!document.querySelector('.scroll-hint')) {
              const hint = document.createElement('div');
              hint.className = 'scroll-hint';
              hint.innerHTML = '<span>Use navigation</span> <i class="bi bi-arrow-down-circle"></i>';
              header.appendChild(hint);
              
              // Remove hint after animation
              setTimeout(() => {
                if (hint && hint.parentNode) {
                  hint.classList.add('fade-out');
                  setTimeout(() => {
                    if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
                  }, 500);
                }
              }, 2000);
            }
            
            setTimeout(() => {
              header.classList.remove('scroll-locked');
            }, 300);
          }
        }
        
        return false;
      }
    };
    
    // Function to handle touch events for mobile
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchStartY - touchY;
      
      // If we're on the home page and user is trying to scroll down
      if (window.scrollY < 50 && touchDiff > 5 && document.body.classList.contains('lock-home-scroll')) {
        e.preventDefault();
        return false;
      }
    };
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Remove lock when user clicks a navigation link
    on('click', '.nav-link, .quick-btn', function() {
      document.body.classList.remove('lock-home-scroll');
    }, true);
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

          // Active link logic (scrollspy)
          let currentSectionId = '';
          allWatchable.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop - 85 && scrollY < sectionTop + sectionHeight - 85) {
              currentSectionId = section.id;
            }
          });

          navlinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
              link.classList.add('active');
            }
          });

          // Activate Home link when at the top
          if (!currentSectionId && scrollY < 200) {
            const homeLink = select('#navbar .nav-link[href="#header"]');
            if (homeLink) homeLink.classList.add('active');
          }

          // (Dynamic main header text removed per request; hero remains static)
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

  // Initialize everything when page fully loaded (single invocation)
  window.addEventListener('load', initializeApp);

  // Removed typed.js init (Typed library not loaded)

  // Handle hash navigation on load (ensure hero state applied BEFORE scrolling)
  window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
      // Apply hero visibility first
      if (hash !== '#header') document.body.classList.add('hide-hero');
      else document.body.classList.remove('hide-hero');
      // Use rAF to allow layout to settle, then scroll
      requestAnimationFrame(() => scrollto(hash));
    }
  });

  // Simple scroll-based hero toggle (avoids IntersectionObserver jumpiness)
  window.addEventListener('scroll', () => {
    if (window.scrollY < 80 && (location.hash === '' || location.hash === '#header')) {
      document.body.classList.remove('hide-hero');
    } else if (window.scrollY > 120) {
      document.body.classList.add('hide-hero');
    }
  });

  /**
   * Initiate Glightbox 
   */
  const glightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            // Text copied successfully
          })
          .catch(err => {
            // Copy operation failed silently
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
    const timeElement = document.getElementById("time");
    if (timeElement) {
      timeElement.innerHTML = `${istTime} IST`;
    }
  }

  setInterval(updateTime, 1000);
  updateTime();

  /**
   * Calculate and update real-time age display
   */

  function calculateAge() {
    const birthDate = new Date("2002-02-27");
    const now = new Date();
    
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }

    const ageElement = document.getElementById("age");
    if (ageElement) {
      ageElement.innerText = age;
    }
  }

  calculateAge(); // Calculate once on load

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
      window.scrollTo({ top: dest.top - offset, behavior: 'smooth' });
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
   * Back to top button
   */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    window.addEventListener('scroll', toggleBacktotop);
    
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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

})()