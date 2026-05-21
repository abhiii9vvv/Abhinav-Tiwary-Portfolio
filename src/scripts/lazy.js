/**
 * lazy.js — Skeleton loading + lazy reveal for all devices
 *
 * Features:
 *  1. IntersectionObserver-based reveal for [data-lazy] elements (fade + slide-up)
 *  2. Enhanced image lazy loading: blur-to-sharp + opacity fade-in
 *  3. Stable image fade-in without injecting placeholder content
 *  4. Keeps document flow stable while scrolling between sections
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
    }, { threshold: 0.01, rootMargin: '160px 0px 160px 0px' });

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

  /* ─── 3. Section-level scroll reveals ───────────────────────── */
  function initSectionReveal() {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('revealed'));
  }

  /* ─── 4. Skill & tech chip stagger ──────────────────────────── */
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

  /* ─── 5. Resume stat numbers count-up ───────────────────────── */
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
    initSectionReveal();
    initStatCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
