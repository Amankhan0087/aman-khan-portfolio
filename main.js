// ============================================
// AMAN KHAN — Portfolio JS
// ============================================

/* -------- LOADER -------- */
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader')?.classList.add('done'), 1200);
});

/* -------- CUSTOM CURSOR -------- */
(() => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
  function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); }
  loop();
  const hoverables = 'a, button, .skill-chip, .project-card, .cert-card, .metric, .skill-tab, .proj-filter, input, textarea, select, .contact-link, .social-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverables)) {
      ring.classList.add('hover');
      if (e.target.closest('.btn-violet, [data-cat="ai"]')) ring.classList.add('hover-violet');
      if (e.target.closest('.btn-amber, [data-cat="de"]')) ring.classList.add('hover-amber');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverables)) { ring.classList.remove('hover', 'hover-violet', 'hover-amber'); }
  });
})();

/* -------- NAV SCROLL -------- */
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* -------- HERO TITLE LETTER ANIMATION -------- */
(() => {
  const t = document.querySelector('.hero-title');
  if (!t) return;
  const text = t.textContent.trim();
  t.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch' + (ch === ' ' ? ' space' : '');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = (1.2 + i * 0.06) + 's';
    t.appendChild(span);
  });
})();

/* -------- TYPEWRITER -------- */
(() => {
  const el = document.querySelector('.hero-typewriter');
  if (!el) return;
  const words = ['AI Engineer', 'LLM Developer', 'Data Scientist', 'MLOps Engineer', 'Data Engineer'];
  let wi = 0, ci = 0, dir = 1;
  function step() {
    const w = words[wi];
    ci += dir;
    el.textContent = w.slice(0, ci);
    if (dir === 1 && ci === w.length) { dir = -1; setTimeout(step, 1600); return; }
    if (dir === -1 && ci === 0) { dir = 1; wi = (wi + 1) % words.length; setTimeout(step, 250); return; }
    setTimeout(step, dir === 1 ? 80 : 40);
  }
  setTimeout(step, 2200);
})();

/* -------- SCROLL REVEAL -------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* -------- TILT CARDS (project + cert) -------- */
(() => {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 8;
      const ry = (x - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* -------- SKILL CHIP MOUSE GLOW -------- */
(() => {
  document.querySelectorAll('.skill-chip').forEach(chip => {
    chip.addEventListener('mousemove', e => {
      const r = chip.getBoundingClientRect();
      chip.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      chip.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* -------- SKILL TABS -------- */
(() => {
  const tabs = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      const k = t.dataset.cat;
      tabs.forEach(x => x.classList.toggle('active', x === t));
      panels.forEach(p => p.classList.toggle('active', p.dataset.cat === k));
    });
  });
})();

/* -------- PROJECT FILTERS -------- */
(() => {
  const filters = document.querySelectorAll('.proj-filter');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      const k = f.dataset.filter;
      filters.forEach(x => x.classList.toggle('active', x === f));
      cards.forEach(c => {
        const tags = (c.dataset.tags || '').split(',');
        c.dataset.hidden = (k === 'all' || tags.includes(k)) ? 'false' : 'true';
      });
    });
  });
})();

/* -------- COUNT UP METRICS -------- */
(() => {
  const metrics = document.querySelectorAll('.metric .v');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.value, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const dur = 1100, start = performance.now();
      function tick(t) {
        const p = Math.min(1, (t - start) / dur);
        cur = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.innerHTML = cur + (suffix ? `<small>${suffix}</small>` : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  metrics.forEach(m => io.observe(m));
})();

/* -------- FORM -------- */
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const select = form.querySelector('select');
  const selectField = select?.closest('.field');
  select?.addEventListener('change', () => {
    selectField.classList.toggle('has-value', !!select.value);
  });

  /* Custom dropdown(s) */
  document.querySelectorAll('.field.cdd').forEach(cdd => {
    const trigger = cdd.querySelector('.cdd-trigger');
    const valueEl = cdd.querySelector('.cdd-value');
    const hidden  = cdd.querySelector('input[type="hidden"]');
    const opts    = [...cdd.querySelectorAll('.cdd-opt')];
    let active = -1;
    const close = () => { cdd.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };
    const open  = () => {
      document.querySelectorAll('.field.cdd.open').forEach(o => o !== cdd && o.classList.remove('open'));
      cdd.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      const sel = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
      setActive(sel >= 0 ? sel : 0);
    };
    const setActive = i => {
      active = (i + opts.length) % opts.length;
      opts.forEach((o, idx) => o.classList.toggle('active', idx === active));
    };
    const choose = i => {
      opts.forEach(o => o.setAttribute('aria-selected', 'false'));
      opts[i].setAttribute('aria-selected', 'true');
      const v = opts[i].dataset.value;
      hidden.value = v;
      valueEl.textContent = v;
      cdd.classList.add('has-value');
      close();
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    };
    trigger.addEventListener('click', () => {
      cdd.classList.contains('open') ? close() : open();
    });
    opts.forEach((o, i) => {
      o.addEventListener('mouseenter', () => setActive(i));
      o.addEventListener('click', () => choose(i));
    });
    trigger.addEventListener('keydown', e => {
      if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) {
        e.preventDefault();
        if (!cdd.classList.contains('open')) { open(); return; }
        if (e.key === 'ArrowDown') setActive(active + 1);
        else if (e.key === 'ArrowUp') setActive(active - 1);
        else if (e.key === 'Enter' || e.key === ' ') choose(active);
      } else if (e.key === 'Escape') {
        close();
      }
    });
    document.addEventListener('click', e => {
      if (!cdd.contains(e.target)) close();
    });
  });
  const ENDPOINT = (window.PORTFOLIO_ENDPOINT || 'https://formsubmit.co/ajax/amankhan46473@gmail.com');
  const submitBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      name:    form.querySelector('#f-name').value.trim(),
      email:   form.querySelector('#f-email').value.trim(),
      subject: form.querySelector('#f-subj').value,
      message: form.querySelector('#f-msg').value.trim(),
      website: form.querySelector('#f-hp')?.value || '', // honeypot
      _subject: 'New Portfolio Contact — ' + (form.querySelector('#f-subj').value || 'Inquiry'),
      _template: 'table',
      _captcha: 'false'
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) return;
    if (payload.website) return; // bot trap
    submitBtn.disabled = true;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Transmitting… <span class="arrow">↗</span>';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === 'true' || data.ok)) {
        form.style.display = 'none';
        document.querySelector('.success-state').classList.add('show');
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        alert(data.message || data.error || 'Could not send. Please email amankhan46473@gmail.com directly.');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
      alert('Network error. Please email amankhan46473@gmail.com directly.');
    }
  });
})();

/* -------- THREE.JS NEURAL NETWORK HERO -------- */
(() => {
  if (!window.THREE) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = innerWidth < 800;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050a14, 0.02);

  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 38);

  // Build neural-net node graph
  const NODE_COUNT = isMobile ? 50 : 120;
  const RADIUS = 30;
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    // distribute on sphere shell with slight randomness
    const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
    const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi + Math.random() * 0.4;
    const r = RADIUS * (0.55 + Math.random() * 0.5);
    nodes.push(new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi) - 6
    ));
  }

  // Points (nodes)
  const pGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(NODE_COUNT * 3);
  const colors = new Float32Array(NODE_COUNT * 3);
  const palette = [
    new THREE.Color(0x00f5ff),
    new THREE.Color(0x7b2fff),
    new THREE.Color(0xffb830)
  ];
  nodes.forEach((n, i) => {
    positions[i*3] = n.x; positions[i*3+1] = n.y; positions[i*3+2] = n.z;
    const c = palette[Math.floor(Math.random() * 3)];
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  });
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // simple round sprite via canvas
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = dotCanvas.height = 64;
  const dctx = dotCanvas.getContext('2d');
  const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = grad; dctx.fillRect(0, 0, 64, 64);
  const dotTex = new THREE.CanvasTexture(dotCanvas);

  const pMat = new THREE.PointsMaterial({
    size: 0.7, map: dotTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, vertexColors: true,
    sizeAttenuation: true
  });
  const points = new THREE.Points(pGeom, pMat);
  scene.add(points);

  // Lines (edges) — connect nearby nodes
  const lineVerts = [];
  const lineCols = [];
  const MAX_DIST = isMobile ? 9 : 8.5;
  for (let i = 0; i < NODE_COUNT; i++) {
    let connections = 0;
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (connections > 4) break;
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < MAX_DIST) {
        lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
        lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        const c = palette[Math.floor(Math.random() * 3)];
        const a = 0.4 + Math.random() * 0.4;
        lineCols.push(c.r * a, c.g * a, c.b * a);
        lineCols.push(c.r * a, c.g * a, c.b * a);
        connections++;
      }
    }
  }
  const lGeom = new THREE.BufferGeometry();
  lGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  lGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineCols), 3));
  const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
  const lines = new THREE.LineSegments(lGeom, lMat);
  scene.add(lines);

  // Background star particles
  const starCount = isMobile ? 200 : 600;
  const sGeom = new THREE.BufferGeometry();
  const sPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    sPos[i*3] = (Math.random() - 0.5) * 200;
    sPos[i*3+1] = (Math.random() - 0.5) * 200;
    sPos[i*3+2] = (Math.random() - 0.5) * 200 - 30;
  }
  sGeom.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const sMat = new THREE.PointsMaterial({ color: 0x6f88a8, size: 0.15, transparent: true, opacity: 0.7, depthWrite: false });
  const stars = new THREE.Points(sGeom, sMat);
  scene.add(stars);

  // Mouse parallax
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth - 0.5) * 0.6;
    ty = (e.clientY / innerHeight - 0.5) * 0.6;
  });

  function onResize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  let t = 0;
  function animate() {
    if (!reduce) t += 0.0025;
    cx += (tx - cx) * 0.04; cy += (ty - cy) * 0.04;
    points.rotation.y = t + cx;
    points.rotation.x = t * 0.6 + cy;
    lines.rotation.y = t + cx;
    lines.rotation.x = t * 0.6 + cy;
    stars.rotation.y = t * 0.3;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
