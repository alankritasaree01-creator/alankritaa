/* ============================================================
   ALANKRITA — main.js
   Navbar, scroll reveal, hamburger, parallax, cursor, counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL BEHAVIOUR ─────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── HAMBURGER MENU ──────────────────────────────────────── */
  const hamburger    = document.querySelector('.nav-hamburger');
  const mobileDrawer = document.querySelector('.nav-mobile-drawer');
  const navOverlay   = document.querySelector('.nav-overlay');

  const closeMenu = () => {
    hamburger?.classList.remove('open');
    mobileDrawer?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileDrawer?.classList.toggle('open', isOpen);
    navOverlay?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navOverlay?.addEventListener('click', closeMenu);
  mobileDrawer?.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  /* ── ACTIVE LINK DETECTION ───────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── INTERSECTION OBSERVER SCROLL REVEAL ────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── SMOOTH ANCHOR SCROLLING ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── PARALLAX — HERO (photo or strip) ───────────────────── */
  const heroPhotoBg = document.getElementById('heroPhotoBg');
  const heroStrip   = document.querySelector('.hero-strip');
  const heroOverlay = document.querySelector('.hero-overlay');

  if (heroPhotoBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroPhotoBg.style.transform = `translateY(${y * 0.35}px)`;
    }, { passive: true });
  } else if (heroStrip) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroStrip.style.transform = `translateY(${y * 0.35}px)`;
      if (heroOverlay) heroOverlay.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  /* ── PARALLAX — ABOUT IMAGE ──────────────────────────────── */
  const aboutImg = document.querySelector('.about-image-col .img-placeholder');
  if (aboutImg) {
    window.addEventListener('scroll', () => {
      const rect = aboutImg.closest('.about-image-col').getBoundingClientRect();
      const mid  = window.innerHeight / 2;
      const offset = (rect.top + rect.height / 2 - mid) * 0.12;
      aboutImg.style.transform = `scale(1.08) translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── PARALLAX — STORE HERO ───────────────────────────────── */
  const storeHeroImg = document.querySelector('.store-hero-img');
  if (storeHeroImg) {
    window.addEventListener('scroll', () => {
      storeHeroImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }, { passive: true });
  }

  /* ── HERO MOUSE TILT ─────────────────────────────────────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection && heroOverlay) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;
      heroOverlay.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroOverlay.style.transform = '';
    });
  }

  /* ── CUSTOM CURSOR ───────────────────────────────────────── */
  const cursor     = document.createElement('div');
  const cursorDot  = document.createElement('div');
  cursor.className    = 'cursor-ring';
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mx = -100, my = -100, cx2 = -100, cy2 = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateCursor() {
    cx2 += (mx - cx2) * 0.12;
    cy2 += (my - cy2) * 0.12;
    cursor.style.transform    = `translate(${cx2 - 18}px, ${cy2 - 18}px)`;
    cursorDot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .product-card, .reel-thumb, .calendar-day:not(.disabled), .time-slot-btn:not(.booked)').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  /* ── PAGE FADE-IN ON LOAD ────────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.7s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  /* ── SMOOTH PAGE TRANSITIONS ─────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 420);
    });
  });

});
