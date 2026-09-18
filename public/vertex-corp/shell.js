(() => {
  'use strict';

  const r = (s, c = document) => c.querySelector(s);
  const R = (s, c = document) => [].slice.call(c.querySelectorAll(s));

  // Theme apply
  const t = localStorage.getItem('vertex-company-theme') || 'dark';
  document.documentElement.dataset.theme = t;
  function a(t) {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('vertex-company-theme', t);
    const e = !0 === t;
    R('[data-logo]').forEach(n => n.src = e ? 'assets/vertex-black.png' : 'assets/vertex-white.png');
    const i = r('#themeToggle');
    if (i) { r('.sun', i).style.display = e ? 'block' : 'none'; r('.moon', i).style.display = e ? 'none' : 'block' }
    const n = r('#platformImage');
    if (n) n.src = e ? 'assets/platform-light.png':'assets/platform-dark.png';
  }
  a(t);

  // Theme toggle
  r('#themeToggle')?.addEventListener('click', () => a(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Mobile menu
  r('#menuToggle')?.addEventListener('click', () => r('#mobileMenu')?.classList.toggle('open'));
  R('#mobileMenu a').forEach(a => a.addEventListener('click', () => r('#mobileMenu').classList.remove('open')));

  // Scroll progress
  const o = r('#header'), p = r('#progress');
  addEventListener('scroll', () => {
    o?.classList.toggle('scrolled', window.scrollY > 30);
    const h = document.documentElement.scrollHeight - innerHeight;
    if (p) p.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + '%';
  }, { passive: true });

  // Reveal observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } });
  }, { threshold: .12 });
  R('.reveal').forEach(el => observer.observe(el));

  // Animated counters
  const counters = R('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = Number(el.dataset.count) || 0, start = performance.now(), duration = 900;
      function tick(now) {
        const p = Math.min(1, (now - start) / duration), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    })
  }, { threshold: .6 });
  counters.forEach(c => counterObserver.observe(c));

  // Feature switches
  const previews = {
    chat: ['VERTEX / AGENTS', 'Multiple agent system', 'Selected: agent orchestration'],
    memory: ['VERTEX / MEMORY', 'Strong memory system', 'Selected: persistent context'],
    routing: ['VERTEX / PROVIDERS', 'Multi-provider architecture', 'Selected: provider routing'],
    search: ['VERTEX / WEB SEARCH', 'Real-time web search', 'Selected: live web access'],
    interface: ['VERTEX / INTERFACE', 'Modern interface', 'Selected: clean workspace']
  };
  R('.feature-item').forEach(btn => btn.addEventListener('click', () => {
    R('.feature-item').forEach(x => x.classList.remove('active')); btn.classList.add('active');
    const [a, b, c] = previews[btn.dataset.preview] || previews.chat;
    const o = r('#previewOverlay'); o.style.opacity = '0';
    setTimeout(() => { o.innerHTML = `<span>${a}</span><strong>${b}</strong><small>${c}</small>`; o.style.opacity = '1'; }, 180);
    const img = r('#platformImage'); if (img) img.style.transform = 'scale(.97)'; setTimeout(() => img.style.transform = 'scale(1)', 250);
  }));

  // Architecture tabs (shell-app internal — only if arch elements exist)
  if (r('#archDiagram')) {
    const arch = {
      orchestration: {
        title: 'Orchestration layer', desc: 'The decision-making layer classifies tasks, selects a mode and chooses an appropriate model before the provider client handles execution.',
        nodes: [['Request', 'user input / files'], ['Task classifier', 'coding · research · chat · math'], ['Mode selector', 'fast · thinking · research'], ['Model registry', 'priority · latency · capability'], ['Provider client', 'keys · retries · failover']]
      },
      providers: {
        title: 'Provider abstraction', desc: 'Vertex keeps provider details behind a common interface so the rest of the product can reason about capabilities instead of vendor-specific request formats.',
        nodes: [['Provider registry', 'enabled adapters'], ['Key manager', 'environment secrets'], ['Health monitor', 'circuit breaker'], ['Retry layer', 'transient failures'], ['Model fallback', 'next healthy option']]
      },
      memory: {
        title: 'Memory & knowledge', desc: 'User context, projects and uploaded files can become bounded context for the model. File text is chunked and ranked for retrieval.',
        nodes: [['User context', 'preferences + memories'], ['Project context', 'instructions + metadata'], ['File ingestion', 'PDF · DOCX · text · code'], ['Chunking', 'bounded context'], ['Retrieval', 'top relevant sources']]
      }
    };
    function renderArch(key) {
      const d = arch[key], diagram = r('#archDiagram'), desc = r('#archDescription');
      if (!d || !diagram || !desc) return;
      diagram.innerHTML = d.nodes.map((n, i) => `<div class="arch-node"><span>${n[0]}</span><small>${n[1]}</small></div>${i < d.nodes.length - 1 ? '<div class="arch-arrow">↓</div>' : ''}`).join('');
      desc.innerHTML = `<h3>${d.title}</h3><p>${d.desc}</p><ul>${d.nodes.map(n => `<li>${n[0]} <span>— ${n[1]}</span></li>`).join('')}</ul>`;
    }
    R('.arch-tab').forEach(tab => tab.addEventListener('click', () => {
      R('.arch-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
      renderArch(tab.dataset.layer);
    }));
    renderArch('orchestration');
  }

  // FAQ
  R('.faq').forEach(item => item.addEventListener('click', () => item.classList.toggle('open')));

  // Back top
  r('#backTop')?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Pointer glow
  if (matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', e => {
      document.documentElement.style.setProperty('--pointer-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--pointer-y', e.clientY + 'px');
    }, { passive: true });
  }
})();