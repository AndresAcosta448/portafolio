// =========================================================
// PORTAFOLIO DE REDES — interacciones
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPanels();
  initTabs();
  initOsiDiagram();
  initHeroCanvas();
  initChecklist();
  initCampusGame();
});

/* ---------- Mobile sidebar ---------- */
function initMobileNav() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('navToggle');
  const scrim = document.getElementById('scrim');

  function close() {
    sidebar.classList.remove('open');
    scrim.classList.remove('open');
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    scrim.classList.toggle('open');
  });
  scrim.addEventListener('click', close);
  sidebar.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', close));
}

/* ---------- Panel system: one section visible at a time ---------- */
const PANELS = [
  { id: 'inicio', title: 'Inicio' },
  { id: 'introduccion', title: 'Introducción' },
  { id: 'conceptos', title: 'Conceptos' },
  { id: 'premisa-1', title: 'Premisa 1 — Diagnóstico de red' },
  { id: 'premisa-2', title: 'Premisa 2 — Internet y sociedad' },
  { id: 'premisa-3', title: 'Premisa 3 — Simular sin miedo' },
  { id: 'premisa-4', title: 'Premisa 4 — ¿Red buena?' },
  { id: 'premisa-5', title: 'Premisa 5 — Viaje de un dato' },
  { id: 'premisa-6', title: 'Premisa 6 — Internet-ciudad' },
  { id: 'premisa-7', title: 'Premisa 7 — 24h sin DNS' },
  { id: 'premisa-8', title: 'Premisa 8 — Transmission media' },
  { id: 'evidencias', title: 'Evidencias de aprendizaje' },
  { id: 'lista-control', title: 'Lista de control' }
];

function panelIndex(id) {
  const i = PANELS.findIndex(p => p.id === id);
  return i === -1 ? 0 : i;
}

function showPanel(id, opts) {
  opts = opts || {};
  const idx = panelIndex(id);
  const panel = PANELS[idx];
  const target = document.getElementById(panel.id);
  if (!target) return;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  target.scrollTop = 0;

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + panel.id);
  });

  target.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));

  updatePanelBar(idx);
  if (opts.pushHash !== false) history.replaceState(null, '', '#' + panel.id);

  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  if (sidebar) sidebar.classList.remove('open');
  if (scrim) scrim.classList.remove('open');
}

function updatePanelBar(idx) {
  const prevBtn = document.getElementById('pbPrev');
  const nextBtn = document.getElementById('pbNext');
  if (!prevBtn || !nextBtn) return;
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === PANELS.length - 1;
  document.getElementById('pbIndex').textContent = idx + 1;
  document.getElementById('pbTotal').textContent = PANELS.length;
  document.getElementById('pbTitle').textContent = PANELS[idx].title;
}

function goPanel(delta) {
  const current = document.querySelector('.view.active');
  const idx = current ? panelIndex(current.id) : 0;
  const next = Math.min(Math.max(idx + delta, 0), PANELS.length - 1);
  showPanel(PANELS[next].id);
}

function initPanels() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (PANELS.some(p => p.id === id)) {
      e.preventDefault();
      showPanel(id);
    }
  });

  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (PANELS.some(p => p.id === id)) showPanel(id, { pushHash: false });
  });

  const initial = location.hash.slice(1);
  showPanel(PANELS.some(p => p.id === initial) ? initial : 'inicio', { pushHash: false });
}

/* ---------- Tabs (Conceptos section) ---------- */
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

/* ---------- OSI interactive diagram ---------- */
const OSI_DATA = {
  7: {
    tag: 'Capa 7',
    name: 'Aplicación',
    desc: 'La capa más cercana a las personas. Aquí trabajan las aplicaciones y servicios que usamos todos los días para pedir o recibir información.',
    examples: ['HTTP', 'HTTPS', 'DNS', 'FTP']
  },
  6: {
    tag: 'Capa 6',
    name: 'Presentación',
    desc: 'Prepara la información para que el dispositivo receptor pueda entenderla: cambia el formato, comprime los datos o los protege con cifrado.',
    examples: ['Cifrado', 'Compresión', 'Formato de datos']
  },
  5: {
    tag: 'Capa 5',
    name: 'Sesión',
    desc: 'Se encarga de comenzar, mantener y terminar una comunicación entre dos dispositivos o programas — por ejemplo, mientras usas tu usuario y contraseña en una plataforma.',
    examples: ['Inicio de sesión', 'Sesión activa']
  },
  4: {
    tag: 'Capa 4',
    name: 'Transporte',
    desc: 'Divide la información en partes pequeñas y revisa que lleguen completas y en orden. TCP garantiza la entrega; UDP es más rápido pero no la verifica del todo.',
    examples: ['TCP', 'UDP']
  },
  3: {
    tag: 'Capa 3',
    name: 'Red',
    desc: 'Busca el mejor camino para que la información llegue a destino, incluso pasando por varias redes. Usa direcciones IP; los routers deciden por dónde enviar los datos.',
    examples: ['IP', 'Routers', 'Enrutamiento']
  },
  2: {
    tag: 'Capa 2',
    name: 'Enlace de datos',
    desc: 'Ayuda a que los dispositivos de la misma red se comuniquen. Organiza la información en tramas y usa direcciones MAC. Los switches trabajan principalmente aquí.',
    examples: ['MAC', 'Tramas', 'Switches']
  },
  1: {
    tag: 'Capa 1',
    name: 'Física',
    desc: 'Envía la información usando señales que viajan por cables de red, fibra óptica o el aire (Wi-Fi). Aquí están los cables, conectores y tarjetas de red.',
    examples: ['Cable Ethernet', 'Fibra óptica', 'Wi-Fi']
  }
};

function initOsiDiagram() {
  const layers = document.querySelectorAll('.osi-layer');
  const detail = document.getElementById('osiDetail');
  if (!layers.length || !detail) return;

  function render(n) {
    const d = OSI_DATA[n];
    if (!d) return;
    detail.innerHTML = `
      <div class="tag">${d.tag}</div>
      <h3>${d.name}</h3>
      <p>${d.desc}</p>
      <div class="examples">${d.examples.map(e => `<span>${e}</span>`).join('')}</div>
    `;
  }

  layers.forEach(layer => {
    layer.addEventListener('click', () => {
      layers.forEach(l => l.classList.remove('active'));
      layer.classList.add('active');
      render(layer.dataset.layer);
    });
  });

  render(7);
}

/* ---------- Premisa 5: animación "El viaje invisible de un dato" ---------- */
const DJ_LAYERS = [
  { name: 'Aplicación', text: "El navegador arma la solicitud: 'quiero ese video'.", fail: "El navegador nunca sabría qué pedir: la solicitud no se forma." },
  { name: 'Presentación', text: "Los datos se comprimen y se cifran con HTTPS/TLS.", fail: "Los datos quedarían sin cifrar o en un formato inválido." },
  { name: 'Sesión', text: "Se abre una sesión activa con el servidor de YouTube.", fail: "La sesión se corta: el video se detiene y hay que empezar de nuevo." },
  { name: 'Transporte', text: "TCP divide todo en segmentos numerados.", fail: "TCP pierde un segmento y no lo reenvía: el video llega incompleto." },
  { name: 'Red', text: "Cada segmento recibe una dirección IP de origen y destino.", fail: "El paquete no recibe una IP válida: se pierde sin saber a dónde ir." },
  { name: 'Enlace de datos', text: "Los paquetes se convierten en tramas con direcciones MAC.", fail: "El switch no encuentra la MAC: el paquete se queda atascado." },
  { name: 'Física', text: "Viaja como señales eléctricas, ondas Wi-Fi o luz por fibra óptica.", fail: "El Wi-Fi se cae: el paquete nunca sale del dispositivo." }
];

let djAnimating = false;

function djLayerY(i) { return 30 + i * 56 + 25; }

function djDelay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function djTween(el, from, to, duration) {
  return new Promise(resolve => {
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.setAttribute('cx', from.x + (to.x - from.x) * ease);
      el.setAttribute('cy', from.y + (to.y - from.y) * ease);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

function djSetActive(side, i, cls) {
  const el = document.getElementById(`dj-${side}-${i}`);
  if (el) el.classList.add(cls);
}

function djClearLayers() {
  document.querySelectorAll('#premisa-5 .dj-layer').forEach(el => el.classList.remove('active', 'fail'));
}

function djSetText(html) {
  const box = document.getElementById('djText');
  if (box) box.innerHTML = html;
}

async function djPlay() {
  if (djAnimating) return;
  const playBtn = document.getElementById('djPlayBtn');
  const select = document.getElementById('djFailSelect');
  const packet = document.getElementById('djPacket');
  const crossLine = document.getElementById('djCrossLine');
  const crossLabel = document.getElementById('djCrossLabel');
  if (!playBtn || !select || !packet) return;

  djAnimating = true;
  playBtn.disabled = true;
  select.disabled = true;
  djClearLayers();
  crossLine.classList.remove('show');
  crossLabel.classList.remove('show');
  packet.classList.remove('fail');

  const failIndex = select.value === '' ? -1 : parseInt(select.value, 10);

  packet.setAttribute('cx', 150);
  packet.setAttribute('cy', djLayerY(0));

  function finish() {
    playBtn.disabled = false;
    select.disabled = false;
    djAnimating = false;
  }

  // Descenso por el cliente: Aplicación (0) -> Física (6)
  for (let i = 0; i < DJ_LAYERS.length; i++) {
    if (i > 0) {
      await djTween(packet, { x: 150, y: djLayerY(i - 1) }, { x: 150, y: djLayerY(i) }, 500);
    }
    djClearLayers();
    const layerNum = 7 - i;
    if (i === failIndex) {
      djSetActive('client', i, 'fail');
      packet.classList.add('fail');
      djSetText(`<span class="dj-tag fail">Falla en capa ${layerNum} · ${DJ_LAYERS[i].name}</span><p>${DJ_LAYERS[i].fail}</p>`);
      finish();
      return;
    }
    djSetActive('client', i, 'active');
    djSetText(`<span class="dj-tag">Capa ${layerNum} · ${DJ_LAYERS[i].name} (cliente)</span><p>${DJ_LAYERS[i].text}</p>`);
    await djDelay(700);
  }

  // Cruce por la red
  djClearLayers();
  crossLine.classList.add('show');
  crossLabel.classList.add('show');
  djSetText(`<span class="dj-tag cross">Red / Internet</span><p>El paquete viaja por la red hasta los servidores de YouTube.</p>`);
  await djTween(packet, { x: 150, y: djLayerY(6) }, { x: 550, y: djLayerY(6) }, 900);
  crossLine.classList.remove('show');
  crossLabel.classList.remove('show');

  // Ascenso por el servidor: Física (6) -> Aplicación (0)
  djSetActive('server', 6, 'active');
  djSetText(`<span class="dj-tag">Capa 1 · ${DJ_LAYERS[6].name} (servidor)</span><p>${DJ_LAYERS[6].text}</p>`);
  await djDelay(700);

  for (let i = 5; i >= 0; i--) {
    djClearLayers();
    await djTween(packet, { x: 550, y: djLayerY(i + 1) }, { x: 550, y: djLayerY(i) }, 500);
    djSetActive('server', i, 'active');
    const layerNum = 7 - i;
    djSetText(`<span class="dj-tag">Capa ${layerNum} · ${DJ_LAYERS[i].name} (servidor)</span><p>${DJ_LAYERS[i].text}</p>`);
    await djDelay(700);
  }

  djClearLayers();
  djSetText(`<span class="dj-tag ok">Listo</span><p>El video empieza a reproducirse: los datos llegaron completos hasta la capa de aplicación del servidor.</p>`);
  finish();
}

/* ---------- Premisa 8: "Build the Smart Campus Network" game ---------- */
const CAMPUS_TOOL_NAMES = {
  fiber: 'Fiber optic',
  copper: 'Copper Ethernet',
  wifi: 'Wi-Fi',
  'wireless-backup': 'Wireless backup'
};

const CAMPUS_ZONES = [
  {
    id: 'a',
    correct: 'fiber',
    successText: "Fiber optic provides high transmission capacity and works very well over long distances between buildings.",
    hints: {
      copper: "Copper works fine over short distances, but it can't carry a strong signal between separate buildings.",
      wifi: "Wireless signals lose strength over long distances — that's not the best fit for connecting buildings.",
      'wireless-backup': "This link is meant to be a backup, not the main connection between the switch and every building."
    }
  },
  {
    id: 'b',
    correct: 'copper',
    successText: "Copper is more affordable than fiber and works perfectly for shorter distances inside a single building.",
    hints: {
      fiber: "Fiber optic is powerful, but it's usually too expensive for short indoor connections like this one.",
      wifi: "Wi-Fi works indoors too, but fixed devices like desktop PCs are usually wired for a stable connection.",
      'wireless-backup': "This is a backup link for emergencies, not for everyday connections inside a building."
    }
  },
  {
    id: 'c',
    correct: 'wifi',
    successText: "Wi-Fi gives students and teachers the mobility to move freely around campus without needing a physical cable.",
    hints: {
      fiber: "Fiber optic is great for a fixed backbone link, but it can't connect to a moving laptop or phone.",
      copper: "Copper cables would tie every mobile device down — that defeats the purpose of moving around campus.",
      'wireless-backup': "This link is meant to connect two fixed points, not mobile devices moving around campus."
    }
  },
  {
    id: 'd',
    correct: 'wireless-backup',
    successText: "If the main fiber connection failed, this backup could help maintain communication between important areas of the campus.",
    hints: {
      fiber: "Using fiber again here wouldn't protect the network — if the main fiber fails, this one could fail too.",
      copper: "Copper can't cover the long outdoor distance between two separate buildings.",
      wifi: "Regular Wi-Fi doesn't have the range or stability needed for a backup link between distant buildings."
    }
  }
];

const campusState = { a: false, b: false, c: false, d: false };
let campusSelectedTool = null;

function campusZoneEl(id) {
  return document.querySelector(`.game-zone[data-zone="${id}"]`);
}

function setGameFeedback(html) {
  const box = document.getElementById('gameFeedback');
  if (box) box.innerHTML = html;
}

function handleCampusDrop(zone, media) {
  if (!media || campusState[zone.id]) return;
  const el = campusZoneEl(zone.id);
  if (!el) return;

  if (media === zone.correct) {
    campusState[zone.id] = true;
    el.classList.remove('wrong');
    el.classList.add('solved');
    el.querySelectorAll('.zone-slot').forEach(s => s.classList.add('solved-line'));
    const label = el.querySelector('.zone-result-label');
    if (label) label.textContent = CAMPUS_TOOL_NAMES[media];
    setGameFeedback(`<span class="dj-tag ok">Correct</span><p>${zone.successText}</p>`);
    checkCampusComplete();
  } else {
    el.classList.remove('wrong');
    void el.offsetWidth;
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 500);
    const hint = zone.hints[media] || "That's not the best fit for this zone — try another connection type.";
    setGameFeedback(`<span class="dj-tag fail">Not quite</span><p>${hint}</p>`);
  }
}

function checkCampusComplete() {
  if (!Object.values(campusState).every(Boolean)) return;
  const factors = document.getElementById('gameFactors');
  const failBtn = document.getElementById('gameFailBtn');
  if (factors) factors.hidden = false;
  if (failBtn) failBtn.disabled = false;
  setGameFeedback(`<span class="dj-tag ok">Network complete</span><p>All four zones are connected. Scroll down to see the network factors behind these choices.</p>`);
}

function resetCampusGame() {
  CAMPUS_ZONES.forEach(zone => {
    campusState[zone.id] = false;
    const el = campusZoneEl(zone.id);
    if (!el) return;
    el.classList.remove('solved', 'wrong', 'failed', 'active-backup');
    el.querySelectorAll('.zone-slot').forEach(s => s.classList.remove('solved-line'));
    const label = el.querySelector('.zone-result-label');
    if (label) label.textContent = '';
  });
  campusSelectedTool = null;
  document.querySelectorAll('.game-tool').forEach(t => t.classList.remove('selected'));
  const factors = document.getElementById('gameFactors');
  const failBtn = document.getElementById('gameFailBtn');
  if (factors) factors.hidden = true;
  if (failBtn) failBtn.disabled = true;
  setGameFeedback(`<span class="dj-tag">Ready</span><p>Drag a connection type onto a zone to test your idea. Wrong guesses are free — try again.</p>`);
}

function simulateBackboneFailure() {
  const zoneA = campusZoneEl('a');
  const zoneD = campusZoneEl('d');
  if (!zoneA || !zoneD) return;
  zoneA.classList.add('failed');
  zoneD.classList.add('active-backup');
  setGameFeedback(`<span class="dj-tag fail">Backbone down</span><p>Backbone down — backup wireless link keeps Building C connected.</p>`);
}

function initCampusGame() {
  const game = document.getElementById('campusGame');
  if (!game) return;

  const tools = document.querySelectorAll('.game-tool');
  tools.forEach(tool => {
    tool.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', tool.dataset.media);
      e.dataTransfer.effectAllowed = 'copy';
    });
    tool.addEventListener('click', () => {
      const media = tool.dataset.media;
      if (campusSelectedTool === media) {
        campusSelectedTool = null;
        tools.forEach(t => t.classList.remove('selected'));
        return;
      }
      campusSelectedTool = media;
      tools.forEach(t => t.classList.toggle('selected', t === tool));
    });
  });

  CAMPUS_ZONES.forEach(zone => {
    const el = campusZoneEl(zone.id);
    if (!el) return;

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      handleCampusDrop(zone, e.dataTransfer.getData('text/plain'));
    });
    el.addEventListener('click', () => {
      if (!campusSelectedTool) return;
      handleCampusDrop(zone, campusSelectedTool);
      campusSelectedTool = null;
      tools.forEach(t => t.classList.remove('selected'));
    });
  });

  const resetBtn = document.getElementById('gameResetBtn');
  const failBtn = document.getElementById('gameFailBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetCampusGame);
  if (failBtn) failBtn.addEventListener('click', simulateBackboneFailure);
}

/* ---------- Lista de control: checkboxes Sí/No excluyentes por fila ---------- */
function initChecklist() {
  const rows = new Set();
  document.querySelectorAll('#lista-control .check-input').forEach(input => rows.add(input.dataset.row));

  rows.forEach(rowKey => {
    const inputs = document.querySelectorAll(`#lista-control .check-input[data-row="${rowKey}"]`);
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.checked) {
          inputs.forEach(other => { if (other !== input) other.checked = false; });
        }
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lb.classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

/* ---------- Hero animated network canvas ---------- */
function initHeroCanvas() {
  const canvas = document.getElementById('netCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, nodes;
  const NODE_COUNT = 60;
  const LINK_DIST = 150;

  function resize() {
    width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }

  function makeNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.35 * window.devicePixelRatio,
        r: (Math.random() * 1.6 + 1) * window.devicePixelRatio
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = LINK_DIST * window.devicePixelRatio;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(47,217,240,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(155,123,255,0.85)';
      ctx.fill();
    });

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); makeNodes(); if (prefersReducedMotion) step(); }, 200);
  });
}
