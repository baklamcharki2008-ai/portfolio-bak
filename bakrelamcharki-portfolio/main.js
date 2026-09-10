document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initLanguage();
  initNav();
  initScrollProgress();
  initBackToTop();
  initReveals();
  initCounters();
  initCursor();
  initRipple();
  initMagnetic();
  initContactForm();
  initCookieBanner();
  initWhatsApp();
  initInspectBlocker();
  initNotifications();
});

/* ---- Toast Helper ---- */
function showGlobalToast(msg, duration){
  let t = document.getElementById('toast');
  if (!t){
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = msg;
  t.classList.remove('hide');
  t.classList.add('show');
  clearTimeout(t._hide);
  t._hide = setTimeout(() => {
    t.classList.remove('show');
    t.classList.add('hide');
  }, duration || 3500);
}

/* ---- Notifications ---- */
function initNotifications(){
  let t = document.getElementById('toast');
  if (!t){
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  setTimeout(() => {
    if (!localStorage.getItem('shelby-welcome')){
      showGlobalToast('<i class="fa-solid fa-hand-wave" style="margin-right:8px;"></i> Welcome to my portfolio website!', 4500);
      localStorage.setItem('shelby-welcome', '1');
    }
    setTimeout(() => {
      if (!localStorage.getItem('shelby-theme-hint')){
        showGlobalToast('<i class="fa-solid fa-circle-half-stroke" style="margin-right:8px;"></i> Tip: Switch between Light and Dark mode using the theme toggle', 5000);
        localStorage.setItem('shelby-theme-hint', '1');
      }
    }, 5000);
  }, 1200);
}

/* ---- Loader ---- */
function initLoader(){
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('hide'), 400));
  setTimeout(() => loader.classList.add('hide'), 2500);
}

/* ---- Theme ---- */
function initTheme(){
  const root = document.documentElement;
  const saved = localStorage.getItem('shelby-theme');
  const initial = saved || 'light';
  root.setAttribute('data-theme', initial);
  applyTheme(initial);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('shelby-theme', next);
      applyTheme(next);
    });
  });
}
function applyTheme(theme){
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '○' : '●';
  });
  const logoSrc = theme === 'dark' ? 'images/logo-dark.png' : 'images/logo-light.png';
  const navLogo = document.getElementById('theme-logo');
  if (navLogo) navLogo.src = logoSrc;
  const footerLogo = document.getElementById('theme-logo-footer');
  if (footerLogo) footerLogo.src = logoSrc;
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = theme === 'dark' ? 'favicon-dark.svg' : 'favicon-light.svg';
  const modelImg = document.querySelector('.model-img');
  if (modelImg) modelImg.src = theme === 'light' ? modelImg.dataset.themeImgLight : modelImg.dataset.themeImg;
}

/* ---- Language ---- */
function initLanguage(){
  const saved = localStorage.getItem('shelby-lang') || 'en';
  applyLanguage(saved);
  document.querySelectorAll('.lang-switch > button').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); btn.parentElement.classList.toggle('open'); });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-switch.open').forEach(el => el.classList.remove('open'));
  });
  document.querySelectorAll('[data-lang-option]').forEach(opt => {
    opt.addEventListener('click', () => applyLanguage(opt.getAttribute('data-lang-option')));
  });
}
function applyLanguage(lang){
  if (typeof translations === 'undefined' || !translations[lang]) return;
  const dict = translations[lang];
  localStorage.setItem('shelby-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', dict.dir);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });
  document.querySelectorAll('.lang-current').forEach(el => el.textContent = lang.toUpperCase());
}

/* ---- Nav ---- */
function initNav(){
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('header');
  if (hamburger && navLinks){
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    /* Dropdown: desktop hover + mobile tap */
    navLinks.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 720) { e.preventDefault(); trigger.closest('.nav-dropdown').classList.toggle('open'); }
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.innerWidth <= 720) { trigger.closest('.nav-dropdown').classList.toggle('open'); }
        }
      });
    });
    /* Keyboard nav inside dropdown */
    navLinks.querySelectorAll('.nav-dropdown-menu a').forEach((link, i, arr) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); arr[Math.min(i + 1, arr.length - 1)]?.focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); arr[Math.max(i - 1, 0)]?.focus(); }
      });
    });
  }
  /* Click outside closes any open dropdown */
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach(dd => {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });
  /* ESC closes dropdown */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(dd => dd.classList.remove('open'));
    }
  });
  let lastScroll = 0;
  if (!header) return;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (cur > lastScroll && cur > 200) header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastScroll = cur;
  });
}

/* ---- Scroll Progress ---- */
function initScrollProgress(){
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  });
}

/* ---- Back to Top ---- */
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Reveal ---- */
function initReveals(){
  const els = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---- Counters ---- */
function initCounters(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 50));
          const timer = setInterval(() => {
            cur += step;
            if (cur >= target){ cur = target; clearInterval(timer); }
            el.textContent = cur + suffix;
          }, 25);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });
}

/* ---- Custom Cursor ---- */
function initCursor(){
  if (window.matchMedia('(max-width:860px), (hover:none)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  const trails = [];
  for (let i = 0; i < 6; i++){
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.opacity = (0.15 - i * 0.02).toString();
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  function lerp(a, b, t){ return a + (b - a) * t; }
  function animate(){
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    for (let i = trails.length - 1; i > 0; i--){
      trails[i].x = lerp(trails[i].x, trails[i-1].x, 0.15);
      trails[i].y = lerp(trails[i].y, trails[i-1].y, 0.15);
    }
    trails[0].x = lerp(trails[0].x, mx, 0.2);
    trails[0].y = lerp(trails[0].y, my, 0.2);
    trails.forEach(t => {
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
    });
    requestAnimationFrame(animate);
  }
  animate();
  document.querySelectorAll('a, button, .btn, .chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
        ring.classList.add('hover-btn');
        dot.classList.add('hover-btn');
      } else {
        ring.classList.add('hover-link');
      }
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover-link', 'hover-btn');
      dot.classList.remove('hover-btn');
    });
  });
}

/* ---- ModelViewer (ready for future 3D model) ---- */
/* ---- Ripple Effect ---- */
function initRipple(){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

/* ---- Magnetic Effect ---- */
function initMagnetic(){
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', function(e){
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(0.97)`;
    });
    btn.addEventListener('mouseleave', function(){
      this.style.transform = '';
    });
  });
}

/* ---- Contact Form ---- */
function initContactForm(){
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const FORM_ENDPOINT = 'https://formspree.io/f/xbdvergj';
  const FALLBACK_EMAIL = '1thomas8shelby1@gmail.com';
  const status = form.querySelector('#form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const loadedAt = Date.now();
  function setStatus(msg, type){
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status';
    if (type) status.classList.add(type);
  }
  function currentLang(){
    const saved = localStorage.getItem('shelby-lang');
    return (typeof translations !== 'undefined' && translations[saved]) ? saved : 'en';
  }
  function t(key, fallback){
    const dict = (typeof translations !== 'undefined' && translations[currentLang()]) || {};
    return dict[key] || fallback;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameEl = form.querySelector('#cf-name');
    const emailEl = form.querySelector('#cf-email');
    const messageEl = form.querySelector('#cf-message');
    const honeypot = form.querySelector('#cf-company');
    if (!form.checkValidity()){ form.reportValidity(); return; }
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();
    if (name.length < 2 || message.length < 10){
      setStatus(t('form_status_validation', 'Please fill in every field with a real message.'), 'error');
      return;
    }
    if (honeypot && honeypot.value.trim() !== ''){ setStatus('Message blocked.', 'error'); return; }
    if (Date.now() - loadedAt < 3000){ setStatus('Please wait before sending.', 'error'); return; }
    form.classList.add('is-loading');
    submitBtn.disabled = true;
    setStatus('', null);
    if (!FORM_ENDPOINT){
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      setStatus('Opening your email app…', 'success');
      form.classList.remove('is-loading');
      submitBtn.disabled = false;
      return;
    }
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company: honeypot ? honeypot.value : '', _language: currentLang() })
      });
      if (res.ok){
        setStatus(t('form_status_success', "✓ Message sent — I'll get back to you soon."), 'success');
        form.reset();
      } else {
        setStatus(t('form_status_error', 'Something went wrong. Try emailing me directly.'), 'error');
      }
    } catch (err){
      setStatus(t('form_status_network', 'Network error — please check your connection.'), 'error');
    } finally {
      form.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

/* ---- Cookie Banner ---- */
function initCookieBanner(){
  const banner = document.getElementById('cookie-banner');
  const btn = document.getElementById('cookie-accept');
  if (!banner || !btn) return;
  if (localStorage.getItem('shelby-cookies') === 'accepted') return;
  requestAnimationFrame(() => banner.classList.add('show'));
  btn.addEventListener('click', () => {
    localStorage.setItem('shelby-cookies', 'accepted');
    banner.classList.remove('show');
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 500);
  });
}

/* ---- WhatsApp ---- */
function initWhatsApp(){
  const number = '+212700616212';
  const waLink = 'https://wa.me/212700616212';
  const toast = document.getElementById('toast');
  let timer;
  function showToast(msg, link){
    if (!toast) return;
    clearTimeout(timer);
    toast.innerHTML = msg + (link ? `<a href="${link}" target="_blank">Open Chat</a>` : '');
    toast.classList.add('show');
    timer = setTimeout(() => toast.classList.remove('show'), 4000);
  }
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(number).then(() => showToast('Copied ' + number + ' —', waLink)).catch(() => showToast(number, waLink));
      window.open(waLink, '_blank');
    });
  });
}

/* ---- Inspect Blocker ---- */
function initInspectBlocker(){
  const msg = 'Developer tools and right-click are disabled on this website.';
  document.addEventListener('contextmenu', (e) => { e.preventDefault(); showBlockToast(msg); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))) {
      e.preventDefault();
      showBlockToast(msg);
    }
  });
  function showBlockToast(text){
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(window.__blockTimer);
    toast.textContent = text;
    toast.classList.add('show');
    window.__blockTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }
}
