// year
document.getElementById('year').textContent = new Date().getFullYear();

// theme toggle (no localStorage — sandbox blocks it)
(function () {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  const sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M3.5 12H1M23 12h-2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"/></svg>';
  const moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  const render = () => { t.innerHTML = d === 'dark' ? moon : sun; t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode'); };
  render();
  t.addEventListener('click', () => { d = d === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', d); render(); });
})();

// language toggle
(function () {
  const b = document.querySelector('[data-lang-toggle]');
  const r = document.documentElement;
  let lang = 'zh';
  b.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    r.setAttribute('data-lang', lang);
    r.setAttribute('lang', lang);
    b.textContent = lang === 'zh' ? 'EN' : '中';
  });
})();

// header shadow on scroll
const header = document.getElementById('header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), { passive: true });

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  io.observe(el);
});

// carousels (GIF gallery + agents) — one slide visible, prev/next + dots, keyboard + swipe
document.querySelectorAll('[data-carousel]').forEach((root) => {
  const track = root.querySelector('[data-track]');
  const slides = Array.from(track.children);
  const dotsWrap = root.querySelector('[data-dots]');
  const count = root.querySelector('[data-count]');
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  let i = 0;
  const total = slides.length;
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    b.type = 'button';
    b.setAttribute('aria-label', 'Slide ' + (idx + 1));
    b.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);
  function go(n) {
    i = (n + total) % total;
    track.style.transform = 'translateX(' + (-i * 100) + '%)';
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    count.textContent = (i + 1) + ' / ' + total;
  }
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  // swipe
  let x0 = null;
  root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  }, { passive: true });
  go(0);
});

// avatar easter-egg: click 5x to reveal the art portrait for 3s, then revert
(function () {
  const egg = document.getElementById('avatarEgg');
  if (!egg) return;
  const NEED = 5;        // clicks to trigger
  const HOLD = 3000;     // ms to stay in art mode
  const WINDOW = 1200;   // ms inactivity window before count resets
  let clicks = 0, active = false, timer = null, resetT = null;

  egg.addEventListener('click', () => {
    if (active) return;                 // ignore while showing art
    clicks++;
    clearTimeout(resetT);
    resetT = setTimeout(() => { clicks = 0; }, WINDOW);
    if (clicks >= NEED) {
      clicks = 0;
      active = true;
      egg.classList.add('egg');
      clearTimeout(timer);
      timer = setTimeout(() => { egg.classList.remove('egg'); active = false; }, HOLD);
    }
  });
})();

// cert showcase: crossfade DCDAP / DCDAA with shake
(function () {
  var showcase = document.getElementById('certShowcase');
  if (!showcase) return;
  var imgs = showcase.querySelectorAll('.cert-img-wrap');
  var idx = 0;
  showcase.style.cursor = 'pointer';
  showcase.addEventListener('click', function () {
    imgs[idx].classList.remove('active');
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add('active');
    showcase.classList.remove('cert-shake');
    void showcase.offsetWidth; // reflow to restart animation
    showcase.classList.add('cert-shake');
  });
})();
