/**
 * lazy.js — Skeleton loading + lazy reveal for all devices
 *
 * Features:
 *  1. IntersectionObserver-based reveal for [data-lazy] elements (fade + slide-up)
 *  2. Enhanced image lazy loading: blur-to-sharp + opacity fade-in
 *  3. Skeleton placeholder cards injected into .portfolio-skeleton-zone
 *     and replaced with real cards once they enter the viewport
 *  4. Skeleton shimmer for resume blocks on first viewport entry
 *  5. Respects prefers-reduced-motion
 */
(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. Generic [data-lazy] reveal ─────────────────────────── */
  function initLazyReveal() {
    const els = document.querySelectorAll('[data-lazy]');
    if (!els.length) return;

    if (REDUCED_MOTION) {
      els.forEach(el => el.classList.add('lazy-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lazy-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ─── 2. Enhanced image lazy loading ────────────────────────── */
  function initImageLazyLoad() {
    // Mark all relevant images for lazy-img treatment
    const projectImgs = document.querySelectorAll(
      '.project-image-container img, .certifications img'
    );

    projectImgs.forEach(img => {
      if (REDUCED_MOTION) return;
      img.classList.add('lazy-img');

      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('lazy-img-loaded');
        return;
      }
      img.addEventListener('load', () => img.classList.add('lazy-img-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('lazy-img-loaded'), { once: true });
    });

    // Profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && !REDUCED_MOTION) {
      profileImg.classList.add('lazy-img');
      if (profileImg.complete && profileImg.naturalWidth > 0) {
        profileImg.classList.add('lazy-img-loaded');
      } else {
        profileImg.addEventListener('load', () => profileImg.classList.add('lazy-img-loaded'), { once: true });
        profileImg.addEventListener('error', () => profileImg.classList.add('lazy-img-loaded'), { once: true });
      }
    }
  }

  /* ─── 3. Skeleton portfolio cards ───────────────────────────── */

  /**
   * Build one skeleton card matching the real card dimensions/layout.
   */
  function buildSkeletonCard(isFeatured) {
    const wrap = document.createElement('div');
    wrap.className = 'skeleton-card';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('role', 'presentation');

    const imageH = isFeatured ? '280px' : '200px';

    wrap.innerHTML = `
      <div class="skeleton skeleton-image" style="height:${imageH}"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-title" style="width:${isFeatured ? '70%' : '60%'}"></div>
        <div class="skeleton-badges">
          ${'<span class="skeleton skeleton-badge"></span>'.repeat(isFeatured ? 6 : 4)}
        </div>
        <div class="skeleton skeleton-text medium"></div>
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton-btns">
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
        </div>
      </div>
    `;
    return wrap;
  }

  /**
   * For each real portfolio item (.portfolio-item), inject a skeleton sibling,
   * then swap it out when the real card enters the viewport.
   */
  function initPortfolioSkeletons() {
    if (REDUCED_MOTION) return;

    const items = document.querySelectorAll('.portfolio .portfolio-item');
    if (!items.length) return;

    items.forEach(item => {
      const isFeatured = item.classList.contains('portfolio-featured');
      const skeleton = buildSkeletonCard(isFeatured);

      // Clone the item, hide it; show skeleton by default
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.45s ease';
      item.parentNode.insertBefore(skeleton, item);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          // Fade out skeleton, fade in real card simultaneously
          skeleton.style.transition = 'opacity 0.35s ease';
          skeleton.style.opacity = '0';

          setTimeout(() => {
            skeleton.remove();
            item.style.opacity = '1';
          }, 340);

          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      observer.observe(item);
    });
  }

  /* ─── 4. Skeleton resume blocks ─────────────────────────────── */

  /** Build a skeleton resume row */
  function buildResumeSkeletonBlock() {
    const wrap = document.createElement('div');
    wrap.className = 'skeleton-resume-block';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `
      <div class="skeleton skeleton-title" style="width:50%;height:1rem"></div>
      <div class="skeleton skeleton-text medium" style="height:0.8rem"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-text" style="width:90%"></div>
      <div class="skeleton skeleton-text short"></div>
    `;
    return wrap;
  }

  function initResumeSkeletons() {
    if (REDUCED_MOTION) return;

    const blocks = document.querySelectorAll('.resume-item');
    if (!blocks.length) return;

    blocks.forEach(block => {
      const skeleton = buildResumeSkeletonBlock();

      block.style.opacity = '0';
      block.style.transition = 'opacity 0.4s ease';
      block.parentNode.insertBefore(skeleton, block);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          skeleton.style.transition = 'opacity 0.3s ease';
          skeleton.style.opacity = '0';

          setTimeout(() => {
            skeleton.remove();
            block.style.opacity = '1';
          }, 300);

          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      observer.observe(block);
    });
  }

  /* ─── 5. Section-level scroll reveals ───────────────────────── */
  function initSectionReveal() {
    const sections = document.querySelectorAll('section');
    if (REDUCED_MOTION) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });

    sections.forEach(sec => {
      sec.classList.add('section-reveal');
      observer.observe(sec);
    });
  }

  /* ─── 6. Skill & tech chip stagger ──────────────────────────── */
  function initChipStagger() {
    if (REDUCED_MOTION) return;

    const groups = document.querySelectorAll('.skill-chips, .tech-tags, .stack-tags, .hero-stack-badges');

    groups.forEach(group => {
      const chips = group.querySelectorAll('.skill-chip, .tech-tag, .stack-tag, .hero-badge');
      chips.forEach((chip, i) => {
        chip.setAttribute('data-lazy', '');
        const delay = Math.min(i + 1, 6); // cap at 6
        chip.setAttribute('data-lazy-delay', delay);
      });
    });
  }

  /* ─── 7. Resume stat numbers count-up ───────────────────────── */
  function initStatCountUp() {
    const stats = document.querySelectorAll('.stat-num');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const rawText = el.textContent.trim();
        const numMatch = rawText.match(/^(\d+)/);
        if (!numMatch) return; // non-numeric like "MERN"

        const end = parseInt(numMatch[1], 10);
        const suffix = rawText.slice(numMatch[0].length); // e.g. "+"
        const duration = 900;
        const step = Math.ceil(duration / (end || 1));
        let current = 0;

        const tick = setInterval(() => {
          current += 1;
          el.textContent = current + suffix;
          if (current >= end) {
            el.textContent = end + suffix;
            clearInterval(tick);
          }
        }, step);

        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
  }

  /* ─── Init ───────────────────────────────────────────────────── */
  function init() {
    initChipStagger();       // must run before initLazyReveal so attrs are set
    initLazyReveal();
    initImageLazyLoad();
    initPortfolioSkeletons();
    initResumeSkeletons();
    initSectionReveal();
    initStatCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
