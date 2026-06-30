/* ===== NAV DROPDOWN CLICK ===== */
document.querySelectorAll('.nav-drop-toggle').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var li = btn.closest('.nav-has-drop');
    var isOpen = li.classList.contains('open');
    document.querySelectorAll('.nav-has-drop.open').forEach(function(el) { el.classList.remove('open'); });
    if (!isOpen) li.classList.add('open');
  });
});
document.addEventListener('click', function() {
  document.querySelectorAll('.nav-has-drop.open').forEach(function(el) { el.classList.remove('open'); });
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.querySelectorAll('.nav-has-drop.open').forEach(function(el) { el.classList.remove('open'); });
});

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
  initAIPopup();
});

/* ===== AI TESTING POPUP (shows after 7s, once per session) ===== */
function initAIPopup() {
  /* Clear flag on page refresh so popup shows again */
  const navEntry = performance.getEntriesByType('navigation')[0];
  if (navEntry && navEntry.type === 'reload') {
    sessionStorage.removeItem('aiPopupSeen');
  }
  if (sessionStorage.getItem('aiPopupSeen')) return;

  const style = document.createElement('style');
  style.textContent = `
    .aip-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .aip-overlay.aip-visible {
      opacity: 1;
      pointer-events: auto;
    }
    .aip-card {
      position: relative;
      background: #0e0e0e;
      border: 1px solid rgba(201,163,90,0.25);
      border-radius: 22px;
      padding: 2.25rem 2rem 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,163,90,0.08);
      transform: translateY(24px) scale(0.97);
      transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1), opacity 0.3s ease;
      opacity: 0;
    }
    .aip-overlay.aip-visible .aip-card {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    .aip-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.45);
      font-size: 1rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.18s, color 0.18s;
    }
    .aip-close:hover {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    .aip-icon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .aip-icon {
      position: relative;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C9A35A 0%, #E7C982 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .aip-icon::before,
    .aip-icon::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid rgba(201,163,90,0.5);
      animation: aipRing 2.4s ease-out infinite;
    }
    .aip-icon::after { animation-delay: 1.2s; }
    @keyframes aipRing {
      0%   { transform: scale(1);    opacity: 0.7; }
      100% { transform: scale(1.9);  opacity: 0;   }
    }
    .aip-eyebrow {
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #C9A35A;
      margin-bottom: 0.6rem;
    }
    .aip-title {
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 0.75rem;
    }
    .aip-title span {
      background: linear-gradient(135deg, #C9A35A 0%, #E7C982 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .aip-body {
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.5);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
    .aip-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.9rem 1.25rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #C9A35A 0%, #E7C982 100%);
      color: #0a0a0a;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.875rem;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: opacity 0.2s, transform 0.15s;
      min-height: 48px;
    }
    .aip-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .aip-dismiss {
      display: block;
      text-align: center;
      margin-top: 0.85rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.25);
      cursor: pointer;
      transition: color 0.18s;
    }
    .aip-dismiss:hover { color: rgba(255,255,255,0.5); }
    @media (max-width: 480px) {
      .aip-card { padding: 1.75rem 1.25rem 1.5rem; border-radius: 18px; }
      .aip-title { font-size: 1.15rem; }
      .aip-icon { width: 52px; height: 52px; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'aip-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Try our AI Voice demo');
  overlay.innerHTML = `
    <div class="aip-card">
      <button class="aip-close" aria-label="Close">&times;</button>
      <div class="aip-icon-wrap">
        <div class="aip-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#0a0a0a">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.69-1.69a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
      </div>
      <div class="aip-eyebrow">Live AI Demo</div>
      <h2 class="aip-title">Want to Hear <span>AI Answer</span> Your Calls?</h2>
      <p class="aip-body">Our AI picks up every inbound call and follows up on every lead 24/7 with no staff needed. Give it a real call or test the outbound AI right now and hear it for yourself.</p>
      <a class="aip-btn" href="ai-testing" style="background:#e53e3e;box-shadow:0 0 18px rgba(229,62,62,0.5);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.69-1.69a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Test the AI Call Now
      </a>
      <span class="aip-dismiss">No thanks, maybe later</span>
    </div>
  `;
  document.body.appendChild(overlay);

  function closePopup() {
    overlay.classList.remove('aip-visible');
    sessionStorage.setItem('aiPopupSeen', '1');
    setTimeout(() => overlay.remove(), 350);
  }

  overlay.querySelector('.aip-close').addEventListener('click', closePopup);
  overlay.querySelector('.aip-dismiss').addEventListener('click', closePopup);
  overlay.querySelector('.aip-btn').addEventListener('click', function() {
    sessionStorage.setItem('aiPopupSeen', '1');
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  }, { once: true });

  setTimeout(function() {
    overlay.classList.add('aip-visible');
  }, 7000);
}
