/* =========================================================
   向日葵花田 · main.js
   1) 導覽列捲動狀態
   2) 進場動畫（IntersectionObserver）
   3) 首屏花粉／花瓣粒子
   4) 視差與輕量互動
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 導覽列捲動狀態 ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. 進場動畫 ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  revealItems.forEach((el) => {
    const delay = Number(el.dataset.delay || 0);
    el.style.transitionDelay = `${delay}ms`;
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- 3. 花粉／花瓣粒子 ---------- */
  const canvas = document.getElementById('pollen');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const PALETTE = ['#ffe9a8', '#f5b301', '#fff6dd', '#ffd066', '#ffffff'];
    let particles = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const count = Math.round(Math.min(70, Math.max(26, width / 22)));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (initial) => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 12,
      r: 1.4 + Math.random() * 3.4,
      speed: 0.18 + Math.random() * 0.55,
      drift: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.4 + Math.random() * 1.1,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.03,
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
      alpha: 0.35 + Math.random() * 0.5
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(p.phase + p.y * 0.012) * p.wobble * 0.5 + p.drift;
        p.spin += p.spinSpeed;

        if (p.y < -14 || p.x < -20 || p.x > width + 20) Object.assign(p, spawn(false));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        // 花瓣：橢圓形；花粉：小圓點
        if (p.r > 2.6) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    raf = requestAnimationFrame(draw);

    // 分頁切到背景時暂停，節省電力
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // 首屏離開畫面後停止運算
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 }
      ).observe(canvas);
    }
  }

  /* ---------- 4. 輕量視差 ---------- */
  const heroMedia = document.querySelector('.hero__media img');
  const sun = document.querySelector('.sun');
  if (!reduceMotion && heroMedia) {
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroMedia.style.translate = `0 ${y * 0.14}px`;
        if (sun) sun.style.translate = `0 ${y * -0.22}px`;
      }
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
      },
      { passive: true }
    );
  }

  /* ---------- 年份 ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
