/* ===== SCROLL PROGRESS ===== */
const prog = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  if (prog) prog.style.width = (st / dh * 100) + '%';
  if (nav) nav.classList.toggle('scrolled', st > 60);
  if (backTop) backTop.classList.toggle('show', st > 500);
}, { passive: true });

if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== CUSTOM CURSOR ===== */
const cur = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
if (cur && ring && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }, { passive: true });
  const followRing = () => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(followRing);
  };
  followRing();
  document.querySelectorAll('a,button,.card,.p-card,.addon-card,.topic-card,.testi-card,[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });
}

/* ===== HAMBURGER MOBILE NAV ===== */
const ham = document.querySelector('.hamburger');
const mNav = document.querySelector('.mobile-nav');
if (ham && mNav) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mNav.classList.toggle('open');
    document.body.style.overflow = mNav.classList.contains('open') ? 'hidden' : '';
  });
  mNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ===== AOS (Animate On Scroll) ===== */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = +e.target.getAttribute('data-delay') || 0;
        setTimeout(() => e.target.classList.add('aos-in'), d);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const pre = el.getAttribute('data-pre') || '';
        const suf = el.getAttribute('data-suf') || '';
        const dec = el.getAttribute('data-dec') || 0;
        const dur = 2200;
        const start = performance.now();
        const run = ts => {
          const p = Math.min((ts - start) / dur, 1);
          const ep = 1 - Math.pow(1 - p, 3);
          const v = target * ep;
          el.textContent = pre + (dec > 0 ? v.toFixed(dec) : Math.floor(v)) + suf;
          if (p < 1) requestAnimationFrame(run);
          else el.textContent = pre + target + suf;
        };
        requestAnimationFrame(run);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ===== ACCORDION ===== */
function initAccordion() {
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const open = head.classList.contains('open');
      document.querySelectorAll('.acc-head.open').forEach(h => {
        h.classList.remove('open');
        h.closest('.acc-item').querySelector('.acc-body').style.maxHeight = '0';
      });
      if (!open) {
        head.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ===== TYPEWRITER ===== */
function initTypewriter() {
  document.querySelectorAll('[data-tw]').forEach(el => {
    const words = el.getAttribute('data-tw').split('|');
    let wi = 0, ci = 0, del = false;
    const type = () => {
      const w = words[wi].trim();
      el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
      del ? ci-- : ci++;
      if (!del && ci === w.length) { setTimeout(() => { del = true; }, 1900); }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
      setTimeout(type, del ? 55 : 95);
    };
    type();
  });
}

/* ===== PRICING TOGGLE ===== */
function initPricingToggle() {
  const tog = document.querySelector('.toggle');
  if (!tog) return;
  let yearly = false;
  tog.addEventListener('click', () => {
    yearly = !yearly;
    tog.classList.toggle('active', yearly);
    document.querySelectorAll('.tog-lbl').forEach((l, i) => l.classList.toggle('on', i === (yearly ? 1 : 0)));
    document.querySelectorAll('[data-monthly]').forEach(el => el.style.display = yearly ? 'none' : '');
    document.querySelectorAll('[data-yearly]').forEach(el => el.style.display = yearly ? '' : 'none');
  });
  // init
  document.querySelectorAll('[data-yearly]').forEach(el => el.style.display = 'none');
  document.querySelector('.tog-lbl')?.classList.add('on');
}

/* ===== PARTICLE CANVAS ===== */
function initParticles(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (window.innerWidth < 768) { canvas.style.display = 'none'; return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const count = Math.min(50, Math.floor(canvas.width * canvas.height / 16000));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.3 + 0.4,
    a: Math.random() * 0.4 + 0.07,
    c: Math.random() > 0.55 ? '#d8a95b' : '#719fae'
  }));

  let rafId = null;
  let lastTs = 0;
  const FPS = 30;
  const INTERVAL = 1000 / FPS;

  const draw = (ts) => {
    rafId = requestAnimationFrame(draw);
    if (ts - lastTs < INTERVAL) return;
    lastTs = ts;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.globalAlpha = (1 - d / 100) * 0.06;
          ctx.strokeStyle = '#d8a95b'; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  };
  rafId = requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!rafId) { lastTs = 0; rafId = requestAnimationFrame(draw); }
  });
}

/* ===== ACTIVE NAV LINK ===== */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ===== MAGNETIC EFFECT ===== */
function initMagnetic() {
  document.querySelectorAll('[data-mag]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.14;
      const y = (e.clientY - r.top - r.height / 2) * 0.14;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initAccordion();
  initTypewriter();
  initPricingToggle();
  initMagnetic();
  initParticles('hero-canvas');
  setActiveNav();
});
