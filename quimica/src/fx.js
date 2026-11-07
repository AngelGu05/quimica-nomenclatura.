/* ===== Fondo reactivo: átomos que flotan, se enlazan, siguen el dedo y "reaccionan" ===== */
const FX = (() => {
  const cv = document.getElementById('bgfx');
  const noop = { burst() { }, refresh() { }, setOn() { }, on: false };
  if (!cv || !cv.getContext) return noop;
  const ctx = cv.getContext('2d');
  const top = document.getElementById('bgfx-top'), tctx = top.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SYMS = [['H', 1], ['O', 8], ['C', 6], ['N', 7], ['Na', 11], ['Cl', 17], ['S', 16], ['Fe', 26], ['Cu', 29], ['Ca', 20], ['K', 19], ['Mg', 12], ['P', 15], ['Al', 13]];
  let W = 0, H = 0, dpr = 1, parts = [], sparks = [], waves = [], bubbles = [];
  let col = {}, raf = 0, last = 0, lastScroll = scrollY;
  const ptr = { x: -9999, y: -9999, on: false };
  let on = true;
  try { on = localStorage.getItem('nomenclatura-fondo') !== 'off'; } catch (e) { }

  function readColors() {
    const cs = getComputedStyle(document.body), g = n => cs.getPropertyValue(n).trim();
    col = { list: ['--teo', '--ion', '--prac', '--vul', '--gold', '--t2', '--t3'].map(g), sec: g('--sec') || g('--accent'), good: g('--good'), bad: g('--bad'), ink: g('--ink'),
      alpha: parseFloat(g('--fx-op')) || 0.5 };
    parts.forEach(p => { p.color = col.list[p.ci % col.list.length]; });
  }
  function make(x, y) {
    const [sym, z] = SYMS[Math.floor(Math.random() * SYMS.length)];
    const a = Math.random() * Math.PI * 2, sp = 8 + Math.random() * 14;
    const ci = Math.floor(Math.random() * 7);
    return { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 12 + Math.random() * 8 + (sym.length > 1 ? 2 : 0), sym, z, ci, color: col.list[ci], glow: 0 };
  }
  function resize() {
    W = innerWidth; H = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    for (const [c, x] of [[cv, ctx], [top, tctx]]) { c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    const n = Math.round(Math.max(16, Math.min(44, (W * H) / 24000)));
    while (parts.length < n) parts.push(make(Math.random() * W, Math.random() * H));
    parts.length = n;
  }
  function burst(x, y, kind) {
    if (!on || reduce) return;
    const c = kind === 'good' ? col.good : kind === 'bad' ? col.bad : kind || col.list[Math.floor(Math.random() * col.list.length)];
    const big = kind !== 'bad';
    const n = big ? 22 : 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, sp = (big ? 160 : 90) + Math.random() * 180;
      sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.9 + Math.random() * 0.4, t: 0, c: Math.random() < 0.6 ? c : col.list[Math.floor(Math.random() * 7)], r: 2 + Math.random() * 2.5 });
    }
    waves.push({ x, y, t: 0, life: 0.8, c, max: big ? 150 : 80 });
    if (big) for (let i = 0; i < 7; i++) bubbles.push({ x: x + (Math.random() - 0.5) * 60, y, vy: -(40 + Math.random() * 60), t: 0, life: 1.4 + Math.random() * 0.8, r: 3 + Math.random() * 6, c, w: Math.random() * 6 });
    for (const p of parts) {
      const dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy) || 1;
      if (d < 220) { const f = (220 - d) * (big ? 2.4 : 1.2); p.vx += (dx / d) * f; p.vy += (dy / d) * f; p.glow = 1; }
    }
    if (!raf) loop(performance.now());
  }
  function step(dt) {
    const sc = scrollY - lastScroll; lastScroll = scrollY;
    for (const p of parts) {
      if (sc) p.y -= sc * 0.25;
      if (ptr.on) {
        const dx = ptr.x - p.x, dy = ptr.y - p.y, d = Math.hypot(dx, dy) || 1;
        if (d < 200) {
          const f = d < 60 ? -260 : 70;
          p.vx += (dx / d) * f * dt; p.vy += (dy / d) * f * dt;
          p.vx += (-dy / d) * 40 * dt; p.vy += (dx / d) * 40 * dt; // giran alrededor del dedo
          p.glow = Math.min(1, p.glow + dt * 3);
        }
      }
      const sp = Math.hypot(p.vx, p.vy);
      const target = 14;
      const k = sp > target ? 0.97 : 1.02;
      p.vx *= Math.pow(k, dt * 60); p.vy *= Math.pow(k, dt * 60);
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.glow = Math.max(0, p.glow - dt * 0.8);
      const m = 40;
      if (p.x < -m) p.x = W + m; else if (p.x > W + m) p.x = -m;
      if (p.y < -m) p.y = H + m; else if (p.y > H + m) p.y = -m;
    }
    for (const s of sparks) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.94; s.vy = s.vy * 0.94 + 30 * dt; }
    for (const w of waves) w.t += dt;
    for (const b of bubbles) { b.t += dt; b.y += b.vy * dt; b.x += Math.sin(b.t * 6 + b.w) * 0.6; }
    sparks = sparks.filter(s => s.t < s.life); waves = waves.filter(w => w.t < w.life); bubbles = bubbles.filter(b => b.t < b.life);
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const A = col.alpha;
    // enlaces
    ctx.lineWidth = 1.6;
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i], b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 > 130 * 130) continue;
      const d = Math.sqrt(d2), al = (1 - d / 130) * 0.55 * A * (1 + Math.max(a.glow, b.glow));
      ctx.strokeStyle = a.color; ctx.globalAlpha = Math.min(1, al);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (d < 70) { // doble enlace
        const nx = -dy / d * 4, ny = dx / d * 4;
        ctx.beginPath(); ctx.moveTo(a.x + nx, a.y + ny); ctx.lineTo(b.x + nx, b.y + ny); ctx.stroke();
      }
    }
    // átomos
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const p of parts) {
      const g = p.glow;
      ctx.globalAlpha = (0.16 + g * 0.2) * A * 1.6;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + g * 5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = Math.min(1, (0.6 + g * 0.4) * A * 1.4);
      ctx.strokeStyle = p.color; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + g * 5, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.font = `800 ${Math.round(p.r * 0.95)}px 'Bricolage Grotesque', system-ui, sans-serif`;
      ctx.fillText(p.sym, p.x, p.y + 1);
    }
    ctx.globalAlpha = 1;
  }
  function drawTop() {
    const c = tctx;
    c.clearRect(0, 0, W, H);
    for (const w of waves) {
      const k = w.t / w.life;
      c.globalAlpha = (1 - k) * 0.8; c.strokeStyle = w.c; c.lineWidth = 3 * (1 - k) + 1;
      c.beginPath(); c.arc(w.x, w.y, 10 + k * w.max, 0, Math.PI * 2); c.stroke();
    }
    for (const s of sparks) {
      c.globalAlpha = 1 - s.t / s.life; c.fillStyle = s.c;
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill();
    }
    for (const b of bubbles) {
      c.globalAlpha = (1 - b.t / b.life) * 0.8; c.strokeStyle = b.c; c.lineWidth = 1.5;
      c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.stroke();
    }
    c.globalAlpha = 1;
  }
  function loop(t) {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (on && !document.hidden && !reduce) { step(dt); draw(); drawTop(); raf = requestAnimationFrame(loop); }
    else { raf = 0; last = 0; }
  }
  function start() { if (!raf && on && !reduce) { last = 0; raf = requestAnimationFrame(loop); } }
  function setOn(v) {
    on = v; try { localStorage.setItem('nomenclatura-fondo', v ? 'on' : 'off'); } catch (e) { }
    cv.hidden = top.hidden = !v; if (v) { readColors(); reduce ? draw() : start(); }
  }

  addEventListener('resize', () => { resize(); if (reduce) draw(); });
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; }, { passive: true });
  addEventListener('pointerdown', e => {
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true;
    if (!e.target.closest('button, a, input, select, label, textarea, .qcard, .flash, .tile, .grp, .panel, .opt, table, .ion-tile, .chips, .seg, .tabs, .keypad, .nav, .top')) burst(e.clientX, e.clientY);
  }, { passive: true });
  addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') ptr.on = false; }, { passive: true });
  addEventListener('pointercancel', () => { ptr.on = false; });
  document.addEventListener('mouseleave', () => { ptr.on = false; });
  document.addEventListener('visibilitychange', start);
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', readColors);

  readColors(); resize();
  cv.hidden = top.hidden = !on;
  if (on) reduce ? draw() : start();
  return { burst, refresh: readColors, setOn, get on() { return on; } };
})();
