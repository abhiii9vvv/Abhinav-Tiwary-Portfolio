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

  // Professional setup - particles disabled for professional look
  function createParticles() {
    // Disabled for professional appearance - code removed
    return;
  }

  // Initialize particles when DOM is loaded
  document.addEventListener('DOMContentLoaded', createParticles);

  // Cool scroll reveal animation
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-element');
    
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('revealed');
      }
    });
  }

  // Add scroll event listener
  window.addEventListener('scroll', revealOnScroll);

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
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const targetElement = select(el);
    if (!targetElement) return;
    
    if (el === '#header' || targetElement.id === 'header') {
      // Force to very top for home section
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Calculate precise position for other sections
    const rect = targetElement.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    
    // Check if header is in compact mode and adjust offset accordingly
    const header = select('#header');
    const isCompact = header && header.classList.contains('compact');
    const offset = isCompact ? 80 : 20; // More offset when header is fixed
    
    window.scrollTo({
      top: Math.max(0, absoluteTop - offset),
      behavior: 'smooth'
    });
  }

  /**
   * Scroll locking to prevent about section from scrolling up to home
   */
  function initializeScrollLocking() {
    let isScrollLocked = false;
    const aboutSection = select('#about') || select('.about-me');
    
    if (!aboutSection) return;
    
    const preventUpScroll = (e) => {
      const scrollY = window.scrollY;
      const aboutSectionTop = aboutSection.getBoundingClientRect().top + scrollY;
      
      // If user is in about section and trying to scroll up to home
      if (scrollY >= aboutSectionTop - 100) {
        // Detect scroll direction
        if (e.deltaY < 0) { // Scrolling up
          e.preventDefault();
          e.stopPropagation();
          
          // Optional: show a message or keep user in about section
          window.scrollTo({
            top: aboutSectionTop - 80,
            behavior: 'smooth'
          });
          return false;
        }
      }
    };
    
    // Add wheel event listener to prevent scroll up from about section
    window.addEventListener('wheel', preventUpScroll, { passive: false });
    
    // Also prevent keyboard scroll up (Page Up, Arrow Up, etc.)
    window.addEventListener('keydown', (e) => {
      const scrollY = window.scrollY;
      const aboutSectionTop = aboutSection.getBoundingClientRect().top + scrollY;
      
      if (scrollY >= aboutSectionTop - 100) {
        // Keys that scroll up: Page Up, Arrow Up, Home
        if (e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Home') {
          e.preventDefault();
          return false;
        }
      }
    });
  }

  /**
   * Mobile nav toggle
   */
  // Mobile hamburger removed; desktop-style nav always visible now.

  /**
   * Scroll with offset on nav links - UNIFIED HANDLER
   */
  on('click', '#navbar .nav-link', function(e) {
    e.preventDefault();
    const hash = this.getAttribute('href');
    if (hash) {
      scrollto(hash);
  // Hide hero heading when leaving home
  if (hash !== '#header') document.body.classList.add('hide-hero');
  else document.body.classList.remove('hide-hero');
    }
  }, true);

  /**
   * Production-ready initialization
   */
  function initializeApp() {
    try {
      // Initialize other components that depend on DOM being ready
      initializeScrollSpy();
      initializePortfolio();
      initializeScrollLocking(); // Add scroll locking functionality
      
    } catch (error) {
      console.warn('Non-critical initialization error:', error);
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

          // Active link logic (scrollspy)
          let currentSectionId = '';
          allWatchable.forEach(section => {
      // Offset accounts for hero height / visual breathing space
      const offset = 80; // matches scroll-margin-top intent
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
        } catch (error) {
          console.warn('ScrollSpy error:', error);
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
      console.warn('Portfolio initialization error:', error);
    }
  }

  // Initialize everything when ready
  window.addEventListener('load', initializeApp);
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 50);
  });

  // Additional initialization for typed.js after all scripts load
  setTimeout(() => {
    if (typeof Typed !== 'undefined') {
      initializeTypedJS();
    }
  }, 1000);

  // Handle hash navigation on load
  window.addEventListener('load', () => {
    if (window.location.hash) {
      setTimeout(() => {
        const element = select(window.location.hash);
        if (element) {
          scrollto(window.location.hash);
          if (window.location.hash !== '#header') document.body.classList.add('hide-hero');
        }
      }, 200);
    }
  });

  // Also toggle based on scroll position (fallback if user scrolls manually)
  window.addEventListener('scroll', () => {
    // Fallback kept minimal; IntersectionObserver below will handle primary logic
  });

  // Use IntersectionObserver for more reliable hero hide/show
  const headerEl = document.getElementById('header');
  if ('IntersectionObserver' in window && headerEl) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If header mostly in view and user is at top and hash is home, show
          if ((location.hash === '' || location.hash === '#header') && entry.intersectionRatio > 0.75) {
            document.body.classList.remove('hide-hero');
          }
        } else {
          document.body.classList.add('hide-hero');
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(headerEl);
  }

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
            console.error("Failed to copy text: ", err);
          });
      }
    }

    function hideContextMenu() {
      contextMenu.classList.remove("active");
    }
  });







  //   /**
  //  * This script updates the accent color of the page based on the current day. 
  //  * It generates a new random color each day, stores it in localStorage, and applies it as the CSS variable.
  //  */
  //   window.addEventListener("load", () => {
  //     localStorage.removeItem("accentColor");
  //     updateAccentColor();
  //   });

  //   function updateAccentColor() {
  //     let today = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  //     let storedDate = localStorage.getItem("accentColorDate");
  //     let storedColor = localStorage.getItem("accentColor");

  //     if (!storedDate || storedDate !== today || !storedColor) {
  //       let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  //       let newColor = "#" + randomColor.padStart(6, "0");

  //       document.documentElement.style.setProperty("--accent-color", newColor);
  //       localStorage.setItem("accentColorDate", today);
  //       localStorage.setItem("accentColor", newColor);
  //     } else {
  //       document.documentElement.style.setProperty("--accent-color", storedColor);
  //     }
  //   }

  // Accent changing functionality removed for cleaner experience

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
        console.error("❌ Form submission error:", error);
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