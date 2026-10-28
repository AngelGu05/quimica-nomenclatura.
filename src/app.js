/* ===== App ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const fmtF = s => esc(s).replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
const ionH = (f, q, sign) => `${fmtF(f)}<sup>${q}${sign}</sup>`;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const ptile = (num, sym, label, color) => `<span class="ptile" aria-hidden="true"${color ? ` style="--c: var(--${color})"` : ''}><i>${num}</i><b>${sym}</b><small>${label}</small></span>`;
const fx = f => `<span class="fx">${fmtF(f)}</span>`;

/* ---------- Progreso guardado en este dispositivo ---------- */
const KEY = 'nomenclatura-progreso-v1';
let store = { cards: {}, prac: {}, types: {}, vulg: { ok: 0, tot: 0 } };
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) store = { ...store, ...s }; } catch (e) { }
function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { } }

/* ---------- Datos de tarjetas (lista del profe) ---------- */
const FIXED_LIST = ['H', 'Be', 'Al', 'Si', 'Li', 'Mg', 'B', 'Zr', 'Na', 'Ca', 'Ga', 'Hf', 'K', 'Sr', 'In', 'Rb', 'Ba', 'Y', 'Cs', 'Zn', 'Sc', 'Fr', 'Cd', 'Ag'];
const VAR_LIST = ['Hg', 'Au', 'Cu', 'Ni', 'C', 'Ge', 'Fe', 'Co', 'Pt', 'Pb', 'Sn', 'N', 'P', 'Bi', 'As', 'Sb'];
const AN_LIST = ['F', 'Cl', 'Br', 'I', 'H', 'O', 'S', 'Se', 'Te', 'N', 'P', 'As', 'Sb', 'C', 'Si'];
const POLY_LIST = {
  'Carga 1+': [['Amonio', 'NH4', 1, '+']],
  'Carga 1−': [['Acetato', 'C2H3O2'], ['Hidrógeno carbonato', 'HCO3'], ['Hidrógeno sulfato', 'HSO4'], ['Hidrógeno sulfito', 'HSO3'], ['Fosfato de dihidrógeno', 'H2PO4'],
    ['Cianuro', 'CN'], ['Hipoclorito', 'ClO'], ['Clorito', 'ClO2'], ['Clorato', 'ClO3'], ['Perclorato', 'ClO4'], ['Hipobromito', 'BrO'], ['Bromito', 'BrO2'],
    ['Bromato', 'BrO3'], ['Perbromato', 'BrO4'], ['Hipoyodito', 'IO'], ['Yodito', 'IO2'], ['Yodato', 'IO3'], ['Peryodato', 'IO4'], ['Hidróxido', 'OH'],
    ['Nitrito', 'NO2'], ['Nitrato', 'NO3'], ['Permanganato', 'MnO4'], ['Sulfocianuro', 'CNS'], ['Bismutato', 'BiO3']].map(x => [...x, 1, '−']),
  'Carga 2−': [['Carbonato', 'CO3'], ['Cromato', 'CrO4'], ['Dicromato', 'Cr2O7'], ['Oxalato', 'C2O4'], ['Fosfato de hidrógeno', 'HPO4'], ['Manganato', 'MnO4'],
    ['Sulfato', 'SO4'], ['Sulfito', 'SO3'], ['Metasilicato', 'SiO3']].map(x => [...x, 2, '−']),
  'Carga 3−': [['Arseniato', 'AsO4'], ['Arsenito', 'AsO3'], ['Fosfito', 'PO3'], ['Fosfato', 'PO4'], ['Borato', 'BO3'], ['Bismutito', 'BiO3'],
    ['Ferricianuro o hexacianoferrato (III)', 'Fe(CN)6']].map(x => [...x, 3, '−']),
  'Carga 4−': [['Ortosilicato', 'SiO4'], ['Ferrocianuro o hexacianoferrato (II)', 'Fe(CN)6']].map(x => [...x, 4, '−']),
};
const CARD = (id, name, sym, extra = {}) => ({ id, name, sym, ...extra });
const DECKS = {
  mono: {
    label: 'Monoatómicos',
    subs: {
      'Cationes de carga fija': FIXED_LIST.map(s => CARD('cf:' + s, 'Ion ' + EL[s].n, ionH(s, EL[s].fixed, '+'), { hue: 'cat' })),
      'Cationes de carga variable': VAR_LIST.flatMap(s => EL[s].ox.map(q => CARD(`cv:${s}${q}`, cap(EL[s].sa[q]), ionH(s, q, '+'), { hue: 'cat', note: EL[s].n }))),
      'Cationes con muchas cargas': [
        ...['Cl', 'Br', 'I'].flatMap(s => EL[s].ox.map(q => CARD(`cm:${s}${q}`, cap(EL[s].sa[q]), ionH(s, q, '+'), { hue: 'cat', note: EL[s].n }))),
        ...['V', 'Mn', 'Mo', 'Cr', 'S', 'Se', 'Te'].map(s => CARD('ce:' + s, `${cap(EL[s].n)} (${s})`,
          EL[s].ox.map(q => `<span class="st">${q}+</span>`).join(' '),
          { hue: 'cat', oneWay: true, note: EL[s].sa ? EL[s].ox.map(q => EL[s].sa[q]).join(' · ') : 'en tu guía se nombra con Stock' })),
      ],
      'Aniones': AN_LIST.map(s => CARD('an:' + s, cap(MONO_AN[s].name), ionH(s, MONO_AN[s].q, '−'), { hue: 'an' })),
    },
  },
  poli: {
    label: 'Poliatómicos',
    subs: Object.fromEntries(Object.entries(POLY_LIST).map(([k, list]) => [k, list.map(([n, f, q, sg]) =>
      CARD('p:' + n, n, ionH(f, q, sg), { hue: sg === '+' ? 'cat' : 'an' }))])),
  },
};
const VULG_CARDS = VULG.map(([f, names]) => CARD('v:' + f, VULG_DISPLAY[f] || cap(names[0]), fmtF(f), { hue: 'acc' }));

/* ---------- Router ---------- */
const VIEWS = { inicio: viewHome, iones: viewIons, teoria: viewTheory, practica: viewPractice, vulgares: viewVulg };
function route() {
  const h = (location.hash || '#inicio').slice(1);
  const v = VIEWS[h] ? h : 'inicio';
  document.body.dataset.sec = v;
  $$('.nav a').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + v ? 'page' : 'false'));
  VIEWS[v]();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
const view = () => $('#view');

/* ---------- Inicio ---------- */
function deckStats(cards) { const k = cards.filter(c => store.cards[c.id] === 1).length; return [k, cards.length]; }
function allIonCards() { return Object.values(DECKS).flatMap(d => Object.values(d.subs).flat()); }
function pct(o) { return o && o.tot ? Math.round((100 * o.ok) / o.tot) : null; }
function viewHome() {
  const [ik, it] = deckStats(allIonCards());
  const [vk, vt] = deckStats(VULG_CARDS);
  const temaRow = t => {
    const p = pct(store.prac[t]);
    return `<div class="bar-row"><span>Tema ${t}</span><span class="bar"><i style="width:${p || 0}%"></i></span><span class="num">${p == null ? '—' : p + '%'}</span></div>`;
  };
  const weak = Object.entries(store.types).filter(([, o]) => o.tot >= 3).map(([t, o]) => [t, o.ok / o.tot]).sort((a, b) => a[1] - b[1]).slice(0, 3).filter(x => x[1] < 0.8);
  view().innerHTML = `
  <section class="hero">
    <p class="eyebrow">Química inorgánica · guía 2026</p>
    <h1>Nomenclatura química</h1>
    <p class="lede">Aprende los iones, repasa las reglas de cada sistema y practica nombrar y formular con ejercicios de tus hojas y otros nuevos.</p>
    <div class="hero-tiles">${ptile(1, 'H', 'Hidrógeno', 'teo')}${ptile(6, 'C', 'Carbono', 'ink')}${ptile(8, 'O', 'Oxígeno', 'ion')}${ptile(11, 'Na', 'Sodio', 'vul')}${ptile(16, 'S', 'Azufre', 'gold')}${ptile(17, 'Cl', 'Cloro', 't2')}${ptile(26, 'Fe', 'Hierro', 'cat')}</div>
  </section>
  <section class="tiles">
    <a class="tile" href="#iones" style="--c: var(--ion)">
      <span class="tile-head">${ptile(1, 'Io', 'Iones', 'ion')}<span class="tile-k">Iones</span></span>
      <span class="tile-big">${ik}<small>/${it}</small></span>
      <span class="tile-sub">tarjetas que ya te sabes</span>
      <span class="mini-tiles" aria-hidden="true"><b class="cat">Fe<sup>3+</sup></b><b class="an">SO<sub>4</sub><sup>2−</sup></b><b class="cat">NH<sub>4</sub><sup>1+</sup></b></span>
    </a>
    <a class="tile" href="#teoria" style="--c: var(--teo)">
      <span class="tile-head">${ptile(2, 'Te', 'Teoría', 'teo')}<span class="tile-k">Teoría</span></span>
      <span class="tile-big">3<small> temas</small></span>
      <span class="tile-sub">Binarios · Oxosales, oxoácidos e hidróxidos · Sales ácidas, básicas, dobles e hidratadas</span>
    </a>
    <a class="tile" href="#practica" style="--c: var(--prac)">
      <span class="tile-head">${ptile(3, 'Pr', 'Práctica', 'prac')}<span class="tile-k">Práctica</span></span>
      <div class="bars">${[1, 2, 3].map(temaRow).join('')}</div>
      <span class="tile-sub">aciertos por tema</span>
    </a>
    <a class="tile" href="#vulgares" style="--c: var(--vul)">
      <span class="tile-head">${ptile(4, 'Nv', 'Vulgares', 'vul')}<span class="tile-k">Nombres vulgares</span></span>
      <span class="tile-big">${vk}<small>/${vt}</small></span>
      <span class="tile-sub">cal viva, leche de magnesia, aceite de vitriolo…</span>
    </a>
  </section>
  ${weak.length ? `<section class="panel"><h2 class="h-sm">Para repasar</h2><p class="muted">Donde más fallas en la práctica:</p>
    <ul class="weak">${weak.map(([t, r]) => `<li><span>${TYPE_LABEL[t]}</span><span class="num">${Math.round(r * 100)}%</span></li>`).join('')}</ul></section>` : ''}
  <section class="panel how">
    <h2 class="h-sm">Cómo usarla</h2>
    <ol>
      <li><b>Iones:</b> voltea cada tarjeta y marca si te la sabías. Las que fallas vuelven a salir.</li>
      <li><b>Teoría:</b> lee el patrón de cada sistema (SA, SS, SE, NF, SI) con ejemplos resueltos.</li>
      <li><b>Práctica:</b> elige el tema y si quieres nombrar, formular o ambos. Si te equivocas, la app te explica el paso a paso.</li>
    </ol>
    <p class="muted small">Tu progreso se guarda solo en este dispositivo y navegador.</p>
  </section>`;
}

/* ---------- Tarjetas (componente) ---------- */
let fc = null; // estado del mazo actual
function startDeck(cards, opts = {}) {
  fc = { all: cards, queue: shuffle(cards), done: 0, wrong: new Set(), flipped: false, dir: opts.dir || fc?.dir || 'n2s', mount: opts.mount, title: opts.title };
  renderCard();
}
function cardFaces(card) {
  let dir = fc.dir === 'mix' ? (card._d || (card._d = Math.random() < 0.5 ? 'n2s' : 's2n')) : fc.dir;
  if (card.oneWay) dir = 'n2s';
  const nameFace = `<div class="face-name">${esc(card.name)}</div>`;
  const symFace = `<div class="face-sym ${card.hue}">${card.sym}</div>`;
  return dir === 'n2s' ? [nameFace, symFace] : [symFace, nameFace];
}
function renderCard() {
  const m = fc.mount();
  if (!fc.queue.length) {
    m.innerHTML = `<div class="deck-done">
      <p class="eyebrow">Mazo completo</p>
      <h3>${fc.all.length} de ${fc.all.length} tarjetas</h3>
      <p class="muted">${fc.wrong.size ? `Fallaste ${fc.wrong.size} en el primer intento.` : 'Te las sabías todas al primer intento.'}</p>
      <div class="row">
        ${fc.wrong.size ? '<button class="btn primary" id="fc-wrong">Repasar las que fallé</button>' : ''}
        <button class="btn" id="fc-again">Repetir el mazo</button>
      </div></div>`;
    $('#fc-again', m).onclick = () => startDeck(fc.all, { mount: fc.mount });
    const w = $('#fc-wrong', m); if (w) w.onclick = () => startDeck(fc.all.filter(c => fc.wrong.has(c.id)), { mount: fc.mount });
    return;
  }
  const card = fc.queue[0];
  const [front, back] = cardFaces(card);
  const total = fc.all.length;
  m.innerHTML = `
    <div class="fc-meta"><span>Quedan <b>${fc.queue.length}</b></span><span class="bar"><i style="width:${(100 * fc.done) / total}%"></i></span><span><b>${fc.done}</b>/${total}</span></div>
    <button class="flash ${fc.flipped ? 'is-flipped' : ''}" id="flash" aria-label="Voltear tarjeta">
      <span class="flash-in">
        <span class="flash-face front">${front}<span class="flip-hint">Toca para voltear</span></span>
        <span class="flash-face back">${back}${card.note ? `<span class="face-note">${esc(card.note)}</span>` : ''}</span>
      </span>
    </button>
    <div class="row fc-actions" id="fc-actions"></div>`;
  $('#flash', m).onclick = flip;
  renderActions();
}
function renderActions() {
  const box = $('#fc-actions'); if (!box) return;
  box.innerHTML = fc.flipped
    ? '<button class="btn bad" id="fc-no"><kbd>1</kbd> No me la sabía</button><button class="btn good" id="fc-yes"><kbd>2</kbd> Me la sabía</button>'
    : '<button class="btn primary wide" id="fc-flip">Voltear <kbd>espacio</kbd></button>';
  if (fc.flipped) { $('#fc-no').onclick = () => answerCard(false); $('#fc-yes').onclick = () => answerCard(true); }
  else $('#fc-flip').onclick = flip;
}
function flip() { fc.flipped = !fc.flipped; const el = $('#flash'); if (el) el.classList.toggle('is-flipped', fc.flipped); renderActions(); }
function answerCard(ok) {
  const card = fc.queue.shift();
  store.cards[card.id] = ok ? 1 : 0; save();
  if (ok) fc.done++;
  else { fc.wrong.add(card.id); fc.queue.splice(Math.min(3, fc.queue.length), 0, card); }
  fc.flipped = false; delete card._d;
  renderCard(); refreshDeckChips && refreshDeckChips();
}
document.addEventListener('keydown', e => {
  if (!fc || !$('#flash') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!fc.flipped) flip(); }
  else if (fc.flipped && e.key === '1') answerCard(false);
  else if (fc.flipped && e.key === '2') answerCard(true);
});

/* ---------- Iones ---------- */
let ionState = { deck: 'mono', sub: 'Cationes de carga fija', mode: 'cards', dir: 'n2s' };
let refreshDeckChips = null;
function viewIons() {
  const d = DECKS[ionState.deck];
  if (!d.subs[ionState.sub] && ionState.sub !== '__all') ionState.sub = Object.keys(d.subs)[0];
  const cards = ionState.sub === '__all' ? Object.values(d.subs).flat() : d.subs[ionState.sub];
  view().innerHTML = `
  <section class="page-head">
    <div><p class="eyebrow">Sección 1</p><h1>Iones</h1>
    <p class="lede">Las cargas de la hoja “Números de oxidación”. Sin ellas no se puede nombrar ni formular nada.</p></div>${ptile(1, 'Io', 'Iones')}
  </section>
  <div class="seg" role="tablist">
    ${Object.entries(DECKS).map(([k, v]) => `<button role="tab" aria-selected="${k === ionState.deck}" data-deck="${k}">${v.label}</button>`).join('')}
  </div>
  <div class="chips" id="sub-chips"></div>
  <div class="toolbar">
    <label class="sel">Dirección
      <select id="fc-dir">
        <option value="n2s">Nombre → ion</option><option value="s2n">Ion → nombre</option><option value="mix">Mezclado</option>
      </select></label>
    <div class="seg small">
      <button data-mode="cards" aria-selected="${ionState.mode === 'cards'}">Tarjetas</button>
      <button data-mode="list" aria-selected="${ionState.mode === 'list'}">Lista</button>
    </div>
  </div>
  <div id="ion-stage"></div>`;
  refreshDeckChips = () => {
    const box = $('#sub-chips'); if (!box) return;
    const subs = Object.entries(d.subs);
    const [ak, at] = deckStats(subs.flatMap(([, v]) => v));
    box.innerHTML = subs.map(([k, v]) => { const [kk, tt] = deckStats(v); return `<button class="chip" aria-pressed="${ionState.sub === k}" data-sub="${esc(k)}">${esc(k)} <span class="num">${kk}/${tt}</span></button>`; }).join('')
      + `<button class="chip" aria-pressed="${ionState.sub === '__all'}" data-sub="__all">Todo ${esc(d.label.toLowerCase())} <span class="num">${ak}/${at}</span></button>`;
    $$('[data-sub]', box).forEach(b => b.onclick = () => { ionState.sub = b.dataset.sub; viewIons(); });
  };
  refreshDeckChips();
  $$('[data-deck]').forEach(b => b.onclick = () => { ionState.deck = b.dataset.deck; ionState.sub = Object.keys(DECKS[b.dataset.deck].subs)[0]; viewIons(); });
  $$('[data-mode]').forEach(b => b.onclick = () => { ionState.mode = b.dataset.mode; viewIons(); });
  const dirSel = $('#fc-dir'); dirSel.value = ionState.dir;
  dirSel.onchange = () => { ionState.dir = dirSel.value; viewIons(); };
  if (ionState.mode === 'list') {
    fc = null;
    $('#ion-stage').innerHTML = `<div class="ion-grid">${cards.map(c => `<div class="ion-tile ${store.cards[c.id] === 1 ? 'known' : ''}">
      <span class="ion-sym ${c.hue}">${c.sym}</span><span class="ion-name">${esc(c.name)}</span>${c.note ? `<span class="ion-note">${esc(c.note)}</span>` : ''}</div>`).join('')}</div>
      ${ionState.deck === 'mono' && ionState.sub === 'Cationes con muchas cargas' ? '<p class="muted small">Cloro, bromo y yodo: hipo-…-oso (1+), -oso (3+), -ico (5+), per-…-ico (7+). Igual para bromo (hipobromoso…) y yodo (hipoyodoso…).</p>' : ''}`;
  } else startDeck(cards, { dir: ionState.dir, mount: () => $('#ion-stage') });
}

/* ---------- Teoría ---------- */
const exName = (c, s) => cap(canonical(c, s));
function sysTable(rows) {
  return `<div class="tbl-wrap"><table class="sys">
    <thead><tr><th>Sistema</th><th>Patrón</th><th>Ejemplo</th></tr></thead>
    <tbody>${rows.map(([c, s]) => `<tr><td><span class="sys-tag">${s}</span></td><td>${esc(patternFor(c, s))}</td><td class="ex">${fx(c.formula)} <span class="arr">→</span> ${esc(exName(c, s))}</td></tr>`).join('')}</tbody>
  </table></div>`;
}
function group(o) {
  return `<section class="grp" id="${o.id}">
    <h3>${o.title}</h3>
    <p>${o.def}</p>
    <dl class="meta">
      <div><dt>Fórmula general</dt><dd>${o.gen}</dd></div>
      <div><dt>Cómo reconocerlo</dt><dd>${o.recog}</dd></div>
    </dl>
    ${o.extra || ''}
    ${o.rows ? sysTable(o.rows) : ''}
  </section>`;
}
function theoryBasics() {
  return `
  <section class="grp">
    <h3>¿Qué es un grupo funcional?</h3>
    <p>Un grupo funcional es un átomo o grupo de átomos que le da sus propiedades principales a un conjunto de compuestos. Por ejemplo, el ion OH<sup>1−</sup> hace que un compuesto sea un hidróxido.</p>
    <p>Los compuestos inorgánicos se clasifican en <b>binarios</b> (2 elementos), <b>ternarios</b> (3) y <b>cuaternarios</b> (4 o más).</p>
  </section>
  <section class="grp">
    <h3>Cómo clasificar un compuesto</h3>
    <div class="tree">
      <div class="node"><b>¿Tiene 2 elementos?</b> Es binario.
        <ul>
          <li>Tiene <b>O</b> y un metal → <b>óxido metálico</b>, o <b>peróxido</b> si el oxígeno “sobra” para la carga del metal (ZnO<sub>2</sub>, Na<sub>2</sub>O<sub>2</sub>).</li>
          <li>Tiene <b>O</b> y un no metal → <b>óxido no metálico</b> (anhídrido).</li>
          <li>Tiene <b>H escrito primero</b> con F, Cl, Br, I, S, Se o Te → <b>hidrácido</b> (H<sub>2</sub>S).</li>
          <li>Tiene <b>H escrito al final</b> → <b>hidruro</b>: metálico (FeH<sub>3</sub>) o no metálico (SH<sub>2</sub>, NH<sub>3</sub>).</li>
          <li>Metal + no metal, sin O ni H → <b>sal binaria</b>.</li>
        </ul></div>
      <div class="node"><b>¿Tiene 3 elementos?</b> Es ternario.
        <ul>
          <li>Termina en <b>OH</b> → <b>hidróxido</b> (base).</li>
          <li>Empieza con <b>H</b> + ion poliatómico con O → <b>oxoácido</b>.</li>
          <li>Metal o NH<sub>4</sub> + ion poliatómico con O → <b>oxosal</b> (sal neutra).</li>
        </ul></div>
      <div class="node"><b>¿Más elementos o partes extra?</b>
        <ul>
          <li>El anión todavía tiene <b>H</b> (HCO<sub>3</sub>, H<sub>2</sub>PO<sub>4</sub>) → <b>sal ácida</b>.</li>
          <li>Tiene <b>OH</b> y además otro anión → <b>sal básica</b>.</li>
          <li>Dos cationes o dos aniones → <b>sal doble</b>; tres → <b>sal triple</b>.</li>
          <li>Lleva <b>·nH<sub>2</sub>O</b> → <b>sal hidratada</b>.</li>
        </ul></div>
    </div>
  </section>
  <section class="grp">
    <h3>Sistemas de nomenclatura</h3>
    <div class="tbl-wrap"><table class="sys">
      <thead><tr><th>Sigla</th><th>Sistema</th><th>Idea clave</th><th>Ejemplo</th></tr></thead>
      <tbody>
        <tr><td><span class="sys-tag">SA</span></td><td>Antiguo o tradicional</td><td>-oso para la carga menor, -ico para la mayor. Con 3 o 4 cargas: hipo-…-oso, -oso, -ico, per-…-ico.</td><td>${fx('FeCl3')} → Cloruro férrico</td></tr>
        <tr><td><span class="sys-tag">SS</span></td><td>Stock</td><td>Carga del catión en números romanos, entre paréntesis.</td><td>${fx('FeCl3')} → Cloruro de hierro (III)</td></tr>
        <tr><td><span class="sys-tag">SE</span></td><td>Estequiométrico</td><td>Prefijos griegos para cuántos átomos o iones hay. “Mono” casi nunca se escribe.</td><td>${fx('N2O3')} → Trióxido de dinitrógeno</td></tr>
        <tr><td><span class="sys-tag">NF</span></td><td>Nombre funcional</td><td>Para iones de carga fija: anión de catión. También nombra los ácidos (ácido …hídrico, …oso, …ico).</td><td>${fx('NaCl')} → Cloruro de sodio</td></tr>
        <tr><td><span class="sys-tag">SI</span></td><td>IUPAC</td><td>Combina stock y estequiométrico: prefijo-oxo + anión en -ato + (estado de oxidación) de catión.</td><td>${fx('H2MnO4')} → Tetraoxomanganato (VI) de dihidrógeno</td></tr>
        <tr><td><span class="sys-tag">NV</span></td><td>Nombre vulgar</td><td>Nombre común que no sigue reglas; se memoriza.</td><td>${fx('NH3')} → Amoníaco</td></tr>
      </tbody></table></div>
    <p class="small muted">Sistemas combinados (SE/SS, SI/SS): el sistema de la izquierda se usa para el anión y el de la derecha para el catión.</p>
  </section>
  <section class="grp">
    <h3>Prefijos</h3>
    <div class="pref">
      <div><h4>Griegos (cantidad)</h4><p>${GR.slice(1).map((p, i) => `<span><b>${i + 1}</b> ${p}</span>`).join('')}</p></div>
      <div><h4>Especiales (iones entre paréntesis, IUPAC)</h4><p>${ESP.slice(2).map((p, i) => `<span><b>${i + 2}</b> ${p}</span>`).join('')}</p></div>
    </div>
  </section>
  <section class="grp">
    <h3>Hallar la carga del catión (para nombrar)</h3>
    <p>La suma de las cargas de un compuesto es cero. Multiplica la carga del anión por su subíndice y repártela entre los cationes.</p>
    <div class="worked">${fx('Fe2O3')}: 3 × O (2−) = 6− → 6 ÷ 2 Fe = <b>3+</b> → hierro (III) o férrico.</div>
    <h3>Cruzar cargas (para formular)</h3>
    <p>La carga de uno pasa a ser el subíndice del otro, y luego se simplifica si se puede. Si hay más de un ion poliatómico, va entre paréntesis.</p>
    <div class="worked">Al<sup>3+</sup> + SO<sub>4</sub><sup>2−</sup> → ${fx('Al2(SO4)3')} · Pb<sup>4+</sup> + S<sup>2−</sup> → Pb<sub>2</sub>S<sub>4</sub> → ${fx('PbS2')}</div>
    <p class="small muted">Excepción: en los peróxidos el ion es O<sub>2</sub><sup>2−</sup> y no se simplifica el 2 del oxígeno (Na<sub>2</sub>O<sub>2</sub>, Sc<sub>2</sub>O<sub>6</sub>).</p>
  </section>`;
}
function theory1() {
  return group({
    id: 'hidracidos', title: 'Hidrácidos (ácidos binarios)',
    def: 'Hidrógeno positivo (H<sup>1+</sup>) unido a un no metal de los grupos 16 y 17: F, Cl, Br, I, S, Se, Te. Sus disoluciones en agua son ácidas.',
    gen: 'H – Y (Y es no metal). El H se escribe primero.', recog: 'Empieza con H y solo tiene otro elemento del grupo 16 o 17.',
    rows: [[C.hidracido('Cl'), 'NF'], [C.hidracido('S'), 'NF'], [C.hidracido('Te'), 'SE'], [C.hidracido('Cl'), 'NV']],
  }) + group({
    id: 'hidruros', title: 'Hidruros',
    def: 'Hidrógeno negativo (H<sup>1−</sup>, hidruro) unido a otro elemento. <b>Metálico</b> si es con un metal; <b>no metálico</b> si es con un no metal. Sus disoluciones no son ácidas.',
    gen: 'X – H (metal) o Y – H (no metal). El H se escribe al final.', recog: 'Termina en H. Compara: H<sub>2</sub>S es hidrácido, SH<sub>2</sub> es hidruro.',
    rows: [[C.hidruro('Mg'), 'NF'], [C.hidruro('Fe', 3), 'SA'], [C.hidruro('Pt', 4), 'SS'], [C.hidruro('Co', 3), 'SE'], [C.hidruro('S', 2), 'SA'], [C.hidruro('Cl', 7), 'SS'], [C.hidruro('I', 5), 'SE'], [C.hidruro('N', 3), 'NV']],
    extra: `<p class="small">Nombres vulgares de hidruros: NH<sub>3</sub> amoníaco, PH<sub>3</sub> fosfina, AsH<sub>3</sub> arsina, SbH<sub>3</sub> estibina, SiH<sub>4</sub> silano, BH<sub>3</sub> borano, CH<sub>4</sub> metano.</p>`,
  }) + group({
    id: 'oxidos', title: 'Óxidos',
    def: 'Oxígeno (O<sup>2−</sup>) unido a otro elemento. <b>Óxido metálico</b> con un metal; <b>óxido no metálico</b> con un no metal. En el nombre funcional los óxidos no metálicos se llaman <b>anhídridos</b>.',
    gen: 'X – O (metal) o Y – O (no metal)', recog: 'Solo dos elementos y uno es O. Revisa que el oxígeno cuadre con la carga; si sobra, es peróxido.',
    rows: [[C.oxido('Ca'), 'NF'], [C.oxido('Sn', 2), 'SA'], [C.oxido('Cu', 2), 'SS'], [C.oxido('Y'), 'SE'], [C.oxido('Cl', 7), 'NF'], [C.oxido('C', 2), 'NF'], [C.oxido('S', 4), 'SS'], [C.oxido('N', 3), 'SE'], [C.oxido('Ca'), 'NV']],
  }) + group({
    id: 'peroxidos', title: 'Peróxidos',
    def: 'Un metal unido al ion peróxido O<sub>2</sub><sup>2−</sup> (cada oxígeno tiene −1). Se nombran en el sistema funcional.',
    gen: 'X<sub>2</sub>(O<sub>2</sub>)<sub>n</sub>, escrito sin paréntesis: Na<sub>2</sub>O<sub>2</sub>, ZnO<sub>2</sub>, Sc<sub>2</sub>O<sub>6</sub>', recog: 'El metal es de carga fija y hay el doble de oxígeno del que pediría un óxido normal.',
    rows: [[C.peroxido('Na'), 'NF'], [C.peroxido('Zn'), 'NF'], [C.peroxido('Sc'), 'NF'], [C.peroxido('H'), 'NF']],
  }) + group({
    id: 'sales-binarias', title: 'Sales binarias',
    def: 'Un metal unido a un no metal que no sea oxígeno ni hidrógeno. El no metal termina en <b>-uro</b>.',
    gen: 'X – Y (metal – no metal)', recog: 'Dos elementos, sin O ni H.',
    rows: [[C.salBin('Na', 1, 'Cl'), 'NF'], [C.salBin('Au', 3, 'I'), 'SA'], [C.salBin('Pt', 4, 'S'), 'SS'], [C.salBin('Bi', 5, 'C'), 'SE'], [C.salBin('Na', 1, 'Cl'), 'NV']],
  });
}
function theory2() {
  return group({
    id: 'hidroxidos', title: 'Hidróxidos (bases)',
    def: 'Un metal o el ion amonio unido al ion hidróxido OH<sup>1−</sup>. Sus disoluciones son alcalinas.',
    gen: 'X – OH. Si hay más de un OH va entre paréntesis: Fe(OH)<sub>3</sub>', recog: 'Termina en OH.',
    rows: [[C.hidroxido('Na'), 'NF'], [C.hidroxido('Ni', 2), 'SA'], [C.hidroxido('Fe', 3), 'SS'], [C.hidroxido('Fe', 3), 'SE'], [C.hidroxido('Ca'), 'NV']],
  }) + group({
    id: 'oxoacidos', title: 'Oxoácidos',
    def: 'Hidrógeno (H<sup>1+</sup>) unido a un ion poliatómico con oxígeno. Hay tantos H como la carga del anión.',
    gen: 'H<sub>m</sub>YO<sub>n</sub>', recog: 'Empieza con H y lleva un ion poliatómico con oxígeno.',
    extra: `<div class="swap"><div><b>-ito</b> → ácido …<b>oso</b><span>nitrito → ácido nitroso</span></div><div><b>-ato</b> → ácido …<b>ico</b><span>sulfato → ácido sulfúrico</span></div></div>
      <div class="steps"><h4>Pasos para el IUPAC (SI)</h4><ol>
        <li>Cuenta los oxígenos y escribe el prefijo + <b>oxo</b> (monoxo, dioxo, trioxo, tetraoxo…).</li>
        <li>Escribe la raíz del elemento central terminada siempre en <b>-ato</b>.</li>
        <li>Calcula su estado de oxidación y ponlo en romano: en SO<sub>4</sub><sup>2−</sup>, x + 4(−2) = −2 → x = +6 → (VI).</li>
        <li>Termina con “de” + prefijo + hidrógeno.</li></ol></div>`,
    rows: [[C.oxoacido('SO3'), 'NF'], [C.oxoacido('ClO4'), 'NF'], [C.oxoacido('ClO'), 'SE'], [C.oxoacido('PO4'), 'SI'], [C.oxoacido('MnO4b'), 'SI'], [C.oxoacido('SO4'), 'NV']],
  }) + group({
    id: 'oxosales', title: 'Oxosales (sales neutras)',
    def: 'Un catión metálico o el amonio unido a un ion poliatómico con oxígeno, sin hidrógeno.',
    gen: 'X<sub>m</sub>(YO<sub>n</sub>)<sub>p</sub>', recog: 'Metal o NH<sub>4</sub> + ion poliatómico con O, y no empieza con H.',
    extra: `<p class="small">En IUPAC, si el ion poliatómico va entre paréntesis se usan los prefijos especiales y corchetes: ${fx('Ni2(CrO4)3')} → ${esc(exName(C.oxosal('Ni', 3, 'CrO4'), 'SI'))}. Sin paréntesis: ${fx('PtSO3')} → ${esc(exName(C.oxosal('Pt', 2, 'SO3'), 'SI'))}.</p>`,
    rows: [[C.oxosal('Ag', 1, 'NO3'), 'NF'], [C.oxosal('Cu', 2, 'SO4'), 'SA'], [C.oxosal('Cu', 1, 'SO4'), 'SS'], [C.oxosal('Co', 3, 'CO3'), 'SE'], [C.oxosal('Fe', 2, 'AsO3'), 'SI'], [C.oxosal('Ca', 2, 'CO3'), 'NV']],
  });
}
function theory3() {
  return group({
    id: 'sales-acidas', title: 'Sales ácidas',
    def: 'Vienen de ácidos con más de un hidrógeno que se puede liberar. No se reemplazaron todos los H por metal, así que el anión conserva al menos un H. No siempre tienen carácter ácido: el NaHCO<sub>3</sub> es básico.',
    gen: 'X – HYO<sub>n</sub>', recog: 'El ion poliatómico empieza con H: HCO<sub>3</sub>, HSO<sub>4</sub>, H<sub>2</sub>PO<sub>4</sub>, HPO<sub>4</sub>.',
    extra: `<div class="worked">H<sub>3</sub>PO<sub>4</sub> pierde un H → H<sub>2</sub>PO<sub>4</sub><sup>1−</sup> (dihidrógenofosfato) → pierde otro → HPO<sub>4</sub><sup>2−</sup> (hidrógenofosfato) → pierde el último → PO<sub>4</sub><sup>3−</sup> (fosfato). Cada H que se va suma una carga negativa.</div>
      <p class="small">Se nombran como las oxosales agregando “hidrógeno” (con su prefijo si hay 2) delante del anión. En SE se toma en cuenta el subíndice: ${fx('Sb(H2PO4)3')} → ${esc(exName(C.salAcida('Sb', 3, 'PO4', 2), 'SE'))}.</p>`,
    rows: [[C.salAcida('K', 1, 'CO3', 1), 'NF'], [C.salAcida('Pb', 4, 'CO3', 1), 'SA'], [C.salAcida('Au', 3, 'SO3', 1), 'SS'], [C.salAcida('Al', 3, 'PO4', 1), 'SE'], [C.salAcida('Al', 3, 'PO4', 1), 'SI'], [C.salAcida('Sn', 4, 'AsO3', 1), 'SE/SS'], [C.salAcida('Na', 1, 'CO3', 1), 'NV']],
  }) + group({
    id: 'sales-basicas', title: 'Sales básicas',
    def: 'Una base que no se neutralizó del todo: el compuesto conserva al menos un OH<sup>1−</sup> junto a otro anión. Ejemplo: Cu(OH)<sub>2</sub> + HCl → Cu(OH)Cl + H<sub>2</sub>O.',
    gen: 'X – OH – Y o X – OH – YO<sub>n</sub>', recog: 'Tiene (OH) y además otro anión.',
    extra: '<p class="small">Se empieza con <b>hidroxi-</b> (con prefijo si hay más de un OH: dihidroxi-, trihidroxi-…) y luego el anión y el catión según el sistema.</p>',
    rows: [[C.salBasica('Mg', 2, 1, 1, 'Cl'), 'NF'], [C.salBasica('Fe', 3, 1, 1, 'SO4'), 'SA'], [C.salBasica('Cu', 2, 2, 3, 'Cl'), 'SS'], [C.salBasica('Cu', 2, 2, 3, 'Cl'), 'SE'], [C.salBasica('Fe', 3, 1, 1, 'SO4'), 'SE/SS']],
  }) + group({
    id: 'sales-dobles', title: 'Sales dobles y triples',
    def: 'Tienen más de un catión, más de un anión, o ambos. <b>Doble:</b> 2 cationes + 1 anión, 1 catión + 2 aniones, o 2 + 2. <b>Triple:</b> cuando un lado tiene 3 (3 + 1, 1 + 3, 2 + 3, 3 + 2, 3 + 3).',
    gen: 'X – A – Y (dos cationes) o X – Y – B (dos aniones)', recog: 'Cuenta cuántos cationes y aniones distintos hay.',
    extra: '<p class="small">Primero los <b>aniones</b> separados por guiones y después los <b>cationes</b> separados por guiones, cada grupo en orden alfabético (sin contar los prefijos). En el nombre se ordena por el nombre del ion; en la fórmula, por el símbolo.</p>',
    rows: [[C.multi([['Al', 3], ['Na', 1]], [['CrO4', 2]]), 'NF'], [C.multi([['Al', 3], ['K', 1], ['Na', 1]], [['NO3', 5]]), 'NF'], [C.multi([['Fe', 3], ['K', 1]], [['S', 2]]), 'SS'], [C.multi([['Fe', 3], ['Na', 1]], [['SO4', 1], ['Cl', 2]]), 'SE/SS']],
  }) + group({
    id: 'hidratos', title: 'Sales hidratadas',
    def: 'Sales cristalizadas con cierto número de moléculas de agua por unidad fórmula. Son compuestos de adición.',
    gen: 'X · nH<sub>2</sub>O', recog: 'Llevan ·nH<sub>2</sub>O al final.',
    extra: '<p class="small">Se nombra la sal en el sistema que pidan y se agrega el prefijo del número de aguas + <b>hidratado</b>.</p>',
    rows: [[C.hidrato(C.oxosal('Cu', 2, 'SO4'), 5), 'SA'], [C.hidrato(C.oxosal('Cu', 2, 'SO4'), 5), 'SI'], [C.hidrato(C.oxosal('Fe', 2, 'PO4'), 8), 'SE'], [C.hidrato(C.salBin('Fe', 3, 'Cl'), 6), 'SS'], [C.hidrato(C.oxosal('Mg', 2, 'SO4'), 7), 'NV']],
  });
}
const THEORY_TABS = [
  ['base', 'Lo básico', theoryBasics, 'Clasificación, sistemas, prefijos y cargas'],
  ['t1', '1 · Binarios', theory1, 'Hidrácidos, hidruros, óxidos, peróxidos y sales binarias'],
  ['t2', '2 · Oxosales, oxoácidos e hidróxidos', theory2, 'Los ternarios'],
  ['t3', '3 · Sales ácidas, básicas, dobles e hidratadas', theory3, 'Las sales especiales'],
];
let theoryTab = 'base';
function viewTheory() {
  const tab = THEORY_TABS.find(t => t[0] === theoryTab);
  view().innerHTML = `
  <section class="page-head"><div><p class="eyebrow">Sección 2</p><h1>Teoría</h1>
    <p class="lede">Resumen de tu guía: cómo reconocer cada grupo funcional y el patrón para nombrarlo en cada sistema.</p></div>${ptile(2, 'Te', 'Teoría')}</section>
  <div class="tabs" role="tablist">${THEORY_TABS.map(([k, l]) => `<button role="tab" aria-selected="${k === theoryTab}" data-t="${k}">${l}</button>`).join('')}</div>
  <p class="tab-sub muted">${tab[3]}</p>
  <div class="theory" data-tema="${theoryTab}">${tab[2]()}</div>
  ${theoryTab !== 'base' ? `<div class="cta-row"><a class="btn primary" href="#practica" data-go-tema="${theoryTab.slice(1)}">Practicar el tema ${theoryTab.slice(1)}</a></div>` : ''}`;
  $$('[data-t]').forEach(b => b.onclick = () => { theoryTab = b.dataset.t; viewTheory(); });
  const go = $('[data-go-tema]'); if (go) go.onclick = () => { pracCfg.tema = go.dataset.goTema; };
}

/* ---------- Práctica ---------- */
let pracCfg = { tema: '1', mode: 'mix', n: 10 };
let sess = null;
const TYPE_WEIGHT = { hidracido: 1, hidruro_m: 1.2, hidruro_nm: 1.2, oxido_m: 1.3, oxido_nm: 1.3, peroxido: 0.8, sal_bin: 1.5, hidroxido: 1, oxoacido: 1.2, oxosal: 1.6, sal_acida: 1, sal_basica: 1, sal_doble: 0.8, sal_triple: 0.5, hidrato: 0.8 };
const SYS_WEIGHT = { NF: 1, SA: 1, SS: 1, SE: 1, SI: 1, 'SE/SS': 0.5, 'SI/SS': 0.5, NV: 0.6 };
function wpick(items, w) { const tot = items.reduce((s, x) => s + w(x), 0); let r = Math.random() * tot; for (const x of items) { r -= w(x); if (r <= 0) return x; } return items[items.length - 1]; }
function temaTypes(t) { return t === 'mix' ? [...TEMA_TYPES[1], ...TEMA_TYPES[2], ...TEMA_TYPES[3]] : TEMA_TYPES[t]; }
function buildQuestions(cfg) {
  const out = [], seen = new Set();
  const pracPool = shuffle(cfg.tema === 'mix' ? [...PRAC[1], ...PRAC[2], ...PRAC[3]] : PRAC[cfg.tema]);
  const nPrac = Math.round(cfg.n * 0.35);
  for (const [f, sys, m] of pracPool) {
    if (out.length >= nPrac) break;
    const c = f(); const key = c.formula + sys;
    if (seen.has(key)) continue; seen.add(key);
    out.push({ c, sys, mode: cfg.mode === 'mix' ? m : cfg.mode, prac: true });
  }
  let guard = 0;
  while (out.length < cfg.n && guard++ < 500) {
    const type = wpick(temaTypes(cfg.tema), t => TYPE_WEIGHT[t]);
    const c = randomCompound(type);
    let syss = systemsFor(c);
    const nf = canonical(c, 'NF');
    if (syss.length > 1) syss = syss.filter(s => !(s === 'SE' && nf && norm(canonical(c, 'SE')) === norm(nf)));
    const sys = wpick(syss, s => SYS_WEIGHT[s]);
    const key = c.formula + sys;
    if (seen.has(key)) continue; seen.add(key);
    out.push({ c, sys, mode: cfg.mode === 'mix' ? (Math.random() < 0.5 ? 'n' : 'f') : cfg.mode, prac: false });
  }
  return shuffle(out);
}
function viewPractice() {
  if (sess && !sess.finished) return renderQuestion();
  if (sess && sess.finished) return renderResults();
  renderSetup();
}
function renderSetup() {
  const temas = [['1', 'Binarios', 'Hidrácidos, hidruros, óxidos, peróxidos, sales binarias'], ['2', 'Oxosales, oxoácidos e hidróxidos', 'Los ternarios'],
    ['3', 'Sales ácidas, básicas, dobles e hidratadas', 'El tema que faltaba'], ['mix', 'Todo mezclado', 'Los tres temas juntos']];
  view().innerHTML = `
  <section class="page-head"><div><p class="eyebrow">Sección 3</p><h1>Práctica</h1>
    <p class="lede">Como en tus hojas: te doy la fórmula y el sistema (o el nombre) y tú completas lo demás, incluido el grupo funcional.</p></div>${ptile(3, 'Pr', 'Práctica')}</section>
  <div class="setup">
    <fieldset><legend>Tema</legend><div class="opt-grid">
      ${temas.map(([k, t, s]) => { const p = pct(store.prac[k]); return `<button class="opt" aria-pressed="${pracCfg.tema === k}" data-tema="${k}">
        <span class="opt-k">${k === 'mix' ? '1 + 2 + 3' : 'Tema ' + k}</span><span class="opt-t">${t}</span><span class="opt-s">${s}</span>
        ${p != null ? `<span class="opt-p">${p}% de aciertos</span>` : ''}</button>`; }).join('')}
    </div></fieldset>
    <fieldset><legend>Qué practicar</legend><div class="seg">
      <button data-pm="n" aria-selected="${pracCfg.mode === 'n'}">Nombrar</button>
      <button data-pm="f" aria-selected="${pracCfg.mode === 'f'}">Formular</button>
      <button data-pm="mix" aria-selected="${pracCfg.mode === 'mix'}">Las dos</button></div>
      <p class="small muted">${{ n: 'Ves la fórmula, escribes el nombre en el sistema indicado.', f: 'Ves el nombre, armas la fórmula con el teclado químico.', mix: 'Se alternan nombrar y formular.' }[pracCfg.mode]}</p>
    </fieldset>
    <fieldset><legend>Preguntas</legend><div class="seg">
      ${[10, 20, 30].map(n => `<button data-pn="${n}" aria-selected="${pracCfg.n === n}">${n}</button>`).join('')}</div></fieldset>
    <button class="btn primary big" id="start">Empezar</button>
    <p class="small muted">Cerca de un tercio de las preguntas sale de tus prácticas (marcadas “De tu práctica”); el resto se inventa con los iones de tu lista.</p>
  </div>`;
  $$('[data-tema]').forEach(b => b.onclick = () => { pracCfg.tema = b.dataset.tema; renderSetup(); });
  $$('[data-pm]').forEach(b => b.onclick = () => { pracCfg.mode = b.dataset.pm; renderSetup(); });
  $$('[data-pn]').forEach(b => b.onclick = () => { pracCfg.n = +b.dataset.pn; renderSetup(); });
  $('#start').onclick = () => startSession(buildQuestions(pracCfg));
}
function startSession(qs) { sess = { qs, i: 0, score: 0, results: [], tema: pracCfg.tema, finished: false }; renderQuestion(); }

function keypadSymbols(c) {
  const need = Object.keys(c.atoms);
  const pool = shuffle(SYMBOLS.filter(s => !need.includes(s)));
  const set = new Set([...need, 'O', 'H', ...pool.slice(0, 4)]);
  return [...set].sort((a, b) => a.localeCompare(b));
}
function groupOptions(tema) { return temaTypes(tema); }

function renderQuestion() {
  const q = sess.qs[sess.i];
  const total = sess.qs.length;
  const sysName = q.sys;
  const prompt = q.mode === 'n'
    ? `<div class="q-formula">${fmtF(q.c.formula)}</div><p class="q-ask">Escribe el nombre en <b>${SYS_LABEL[sysName]}</b>.</p>`
    : `<div class="q-name">${esc(cap(canonical(q.c, q.sys)))}</div><p class="q-ask">Escribe la fórmula. El nombre está en <b>${SYS_LABEL[sysName]}</b>.</p>`;
  const input = q.mode === 'n'
    ? `<label class="lbl" for="ans-name">Nombre</label><input id="ans-name" class="field" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ej. cloruro de hierro (III)">`
    : `<label class="lbl" for="ans-formula">Fórmula</label>
       <div class="f-wrap"><input id="ans-formula" class="field mono" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="${matchMedia('(pointer: coarse)').matches ? 'none' : 'text'}" placeholder="ej. Fe2(SO4)3">
       <div class="f-preview" id="f-prev" aria-live="polite">&nbsp;</div></div>
       <div class="keypad" id="keypad">
         <div class="kp-row els">${keypadSymbols(q.c).map(s => `<button type="button" data-k="${s}">${s}</button>`).join('')}</div>
         <div class="kp-row nums">${[2, 3, 4, 5, 6, 7, 8, 9, 1, 0].map(n => `<button type="button" data-k="${n}">${n}</button>`).join('')}</div>
         <div class="kp-row ops"><button type="button" data-k="(">(</button><button type="button" data-k=")">)</button><button type="button" data-k="·">·</button>
           <button type="button" data-k="back" aria-label="Borrar">⌫</button><button type="button" data-k="clear">Borrar todo</button></div>
       </div>
       <button type="button" class="linkish small" id="sys-kb">Usar el teclado del teléfono</button>`;
  view().innerHTML = `
  <div class="q-top">
    <button class="linkish" id="quit">← Salir</button>
    <span class="bar"><i style="width:${(100 * sess.i) / total}%"></i></span>
    <span class="num">${sess.i + 1}/${total} · ${sess.score} ✓</span>
  </div>
  <article class="qcard">
    <div class="q-tags"><span class="sys-tag big" title="${esc(SYS_LABEL[sysName])}">${sysName}</span>
      <span class="tag">${q.mode === 'n' ? 'Nombrar' : 'Formular'}</span>${q.prac ? '<span class="tag prac">De tu práctica</span>' : ''}</div>
    ${prompt}
    ${input}
    <fieldset class="groups"><legend class="lbl">Grupo funcional</legend>
      <div class="chips">${groupOptions(sess.tema).map(t => `<button type="button" class="chip" data-g="${t}" aria-pressed="false">${TYPE_LABEL[t]}</button>`).join('')}</div></fieldset>
    <div id="hint-box"></div>
    <div class="row q-actions"><button class="btn" id="hint">Pista</button><button class="btn primary" id="check">Comprobar</button></div>
    <div id="feedback"></div>
  </article>`;
  let chosen = null;
  $$('[data-g]').forEach(b => b.onclick = () => { if (q.done) return; chosen = b.dataset.g; $$('[data-g]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#quit').onclick = () => { sess = null; renderSetup(); };
  $('#hint').onclick = () => {
    q.hinted = true;
    $('#hint-box').innerHTML = `<div class="hint"><b>Patrón ${q.sys}:</b> ${esc(patternFor(q.c, q.sys))}${q.mode === 'n' ? `<br>${chargeNotes(q.c).slice(0, 1).map(fmtF).join('')}` : ''}</div>`;
  };
  const fIn = $('#ans-formula');
  if (fIn) {
    const prev = () => { $('#f-prev').innerHTML = fIn.value ? fmtF(fIn.value) : '&nbsp;'; };
    fIn.addEventListener('input', prev);
    $$('#keypad [data-k]').forEach(b => {
      b.addEventListener('mousedown', e => e.preventDefault());
      b.onclick = () => {
        if (q.done) return;
        const k = b.dataset.k; let v = fIn.value, s = fIn.selectionStart ?? v.length, e2 = fIn.selectionEnd ?? v.length;
        if (document.activeElement !== fIn) { s = e2 = v.length; }
        if (k === 'clear') v = '', s = 0;
        else if (k === 'back') { if (s === e2 && s > 0) { v = v.slice(0, s - 1) + v.slice(e2); s--; } else { v = v.slice(0, s) + v.slice(e2); } }
        else { v = v.slice(0, s) + k + v.slice(e2); s += k.length; }
        fIn.value = v; try { fIn.setSelectionRange(s, s); } catch (err) { } prev();
      };
    });
    $('#sys-kb').onclick = () => { fIn.setAttribute('inputmode', 'text'); fIn.focus(); $('#sys-kb').hidden = true; };
    if (!matchMedia('(pointer: coarse)').matches) fIn.focus();
  } else $('#ans-name').focus();
  const check = () => {
    if (q.done) return nextQ();
    const val = (fIn || $('#ans-name')).value;
    if (!val.trim()) { $('#feedback').innerHTML = `<p class="warn">${q.mode === 'n' ? 'Escribe el nombre' : 'Arma la fórmula'} antes de comprobar.</p>`; return; }
    if (!chosen) { $('#feedback').innerHTML = '<p class="warn">Elige también el grupo funcional.</p>'; return; }
    let okMain, err = '';
    if (q.mode === 'n') okMain = checkName(q.c, q.sys, val);
    else { const r = checkFormula(q.c, val); okMain = r.ok; err = r.err || ''; }
    const okGroup = chosen === q.c.type;
    const ok = okMain && okGroup;
    q.done = true; q.answer = val; q.ok = ok; q.okMain = okMain; q.okGroup = okGroup; q.chosen = chosen;
    if (ok) sess.score++;
    sess.results.push(q);
    const tk = sess.tema; store.prac[tk] = store.prac[tk] || { ok: 0, tot: 0 }; store.prac[tk].tot++; if (ok) store.prac[tk].ok++;
    store.types[q.c.type] = store.types[q.c.type] || { ok: 0, tot: 0 }; store.types[q.c.type].tot++; if (ok) store.types[q.c.type].ok++;
    save();
    (fIn || $('#ans-name')).readOnly = true;
    $$('[data-g]').forEach(b => { if (b.dataset.g === q.c.type) b.classList.add('right'); else if (b.dataset.g === chosen) b.classList.add('wrong'); });
    $('#feedback').innerHTML = feedbackHTML(q, err);
    $('#check').textContent = sess.i + 1 < sess.qs.length ? 'Siguiente →' : 'Ver resultados';
    $('#hint').hidden = true;
    $('#check').focus();
  };
  $('#check').onclick = check;
  (fIn || $('#ans-name')).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
}
function feedbackHTML(q, err) {
  const c = q.c, name = cap(canonical(c, q.sys));
  const head = q.ok ? '<p class="verdict good">¡Correcto!</p>' : `<p class="verdict bad">${q.okMain ? 'El ' + (q.mode === 'n' ? 'nombre' : 'fórmula') + ' está bien, pero el grupo no.' : q.okGroup ? 'El grupo está bien, pero ' + (q.mode === 'n' ? 'el nombre no.' : 'la fórmula no.') : 'Revisa la respuesta y el grupo.'}</p>`;
  const lines = [];
  if (err) lines.push(`<li class="err">${esc(err)}</li>`);
  lines.push(`<li><b>Grupo:</b> ${TYPE_LABEL[c.type]}</li>`);
  chargeNotes(c).forEach(n => lines.push(`<li>${fmtF(n)}</li>`));
  if (q.mode === 'f' && c.type !== 'hidrato' && c.cats.length === 1 && c.ans.length === 1 && !c.oh) {
    const [ci] = c.cats[0], [ai] = c.ans[0];
    const af = ai.f === 'O2' ? 'O₂' : ai.f;
    lines.push(`<li>Se cruzan las cargas: ${ionH(ci.f, ci.q, '+')} y ${ai.f === 'O2' ? 'O<sub>2</sub>' : fmtF(af)}<sup>${ai.q}−</sup> → ${fx(c.formula)}</li>`);
  }
  lines.push(`<li><b>Patrón ${q.sys}:</b> ${esc(patternFor(c, q.sys))}</li>`);
  const alts = (namesIn(c, q.sys) || []).slice(1).filter(x => !x.includes('monooxo'));
  return `<div class="fb ${q.ok ? 'is-ok' : 'is-bad'}">${head}
    <div class="answer">${fx(c.formula)} <span class="arr">→</span> <b>${esc(name)}</b></div>
    ${!q.ok && q.okMain === false ? `<p class="small muted">Escribiste: <span class="${q.mode === 'f' ? 'mono' : ''}">${q.mode === 'f' ? fmtF(q.answer) : esc(q.answer)}</span></p>` : ''}
    ${alts.length && q.sys !== 'NV' ? `<p class="small muted">También se acepta: ${alts.slice(0, 2).map(esc).join(' · ')}</p>` : ''}
    ${q.sys === 'NV' && alts.length ? `<p class="small muted">Otros nombres: ${alts.map(esc).join(' · ')}</p>` : ''}
    <ul class="steps-list">${lines.join('')}</ul></div>`;
}
function nextQ() {
  sess.i++;
  if (sess.i >= sess.qs.length) { sess.finished = true; return renderResults(); }
  renderQuestion(); window.scrollTo(0, 0);
}
function renderResults() {
  const n = sess.qs.length, s = sess.score, p = Math.round((100 * s) / n);
  const wrong = sess.results.filter(q => !q.ok);
  view().innerHTML = `
  <section class="page-head"><p class="eyebrow">Resultado · ${sess.tema === 'mix' ? 'Todos los temas' : 'Tema ' + sess.tema}</p>
    <h1>${s} de ${n}</h1><p class="lede">${p >= 90 ? 'Excelente. Ya dominas este tema.' : p >= 70 ? 'Bien. Repasa las que fallaste y vuelve a intentarlo.' : 'Sigue practicando. Lee el patrón de cada error y repite las que fallaste.'}</p></section>
  <div class="row">
    ${wrong.length ? '<button class="btn primary" id="redo">Repetir las que fallé</button>' : ''}
    <button class="btn ${wrong.length ? '' : 'primary'}" id="again">Nueva ronda</button>
    <button class="btn" id="change">Cambiar tema</button>
  </div>
  <ul class="res-list">${sess.results.map(q => `<li class="${q.ok ? 'ok' : 'no'}">
    <span class="mark" aria-label="${q.ok ? 'correcta' : 'incorrecta'}">${q.ok ? '✓' : '✗'}</span>
    <span class="res-f">${fmtF(q.c.formula)}</span>
    <span class="res-n"><span class="sys-tag">${q.sys}</span> ${esc(cap(canonical(q.c, q.sys)))}<small>${TYPE_LABEL[q.c.type]}</small></span></li>`).join('')}</ul>`;
  const r = $('#redo'); if (r) r.onclick = () => startSession(shuffle(wrong.map(q => ({ c: q.c, sys: q.sys, mode: q.mode, prac: q.prac }))));
  $('#again').onclick = () => startSession(buildQuestions(pracCfg));
  $('#change').onclick = () => { sess = null; renderSetup(); };
}

/* ---------- Nombres vulgares ---------- */
let vulgTab = 'cards', vq = null;
function viewVulg() {
  view().innerHTML = `
  <section class="page-head"><div><p class="eyebrow">Sección 4</p><h1>Nombres vulgares</h1>
    <p class="lede">La tabla de nombres comunes de tu guía. No siguen reglas: hay que memorizarlos.</p></div>${ptile(4, 'Nv', 'Vulgares')}</section>
  <div class="seg">
    <button data-vt="cards" aria-selected="${vulgTab === 'cards'}">Tarjetas</button>
    <button data-vt="quiz" aria-selected="${vulgTab === 'quiz'}">Quiz</button>
    <button data-vt="list" aria-selected="${vulgTab === 'list'}">Tabla</button></div>
  <div id="vulg-stage"></div>
  <p class="small muted">Nota: tu guía pone “yeso” junto al CaCO<sub>3</sub>. Aquí se respeta, pero en muchos libros el yeso es CaSO<sub>4</sub>·2H<sub>2</sub>O.</p>`;
  $$('[data-vt]').forEach(b => b.onclick = () => { vulgTab = b.dataset.vt; vq = null; viewVulg(); });
  const st = $('#vulg-stage');
  if (vulgTab === 'cards') { refreshDeckChips = null; startDeck(VULG_CARDS, { dir: 'n2s', mount: () => $('#vulg-stage') }); }
  else if (vulgTab === 'list') {
    fc = null;
    st.innerHTML = `<div class="tbl-wrap"><table class="sys"><thead><tr><th>Nombre común</th><th>Fórmula</th></tr></thead>
      <tbody>${VULG.map(([f, n]) => `<tr><td>${esc(VULG_DISPLAY[f] || cap(n[0]))}</td><td>${fx(f)}</td></tr>`).join('')}</tbody></table></div>`;
  } else { fc = null; if (!vq) vq = { qs: shuffle(VULG).slice(0, 10).map(v => ({ v, dir: Math.random() < 0.5 ? 'n2f' : 'f2n' })), i: 0, score: 0 }; renderVQ(); }
}
function renderVQ() {
  const st = $('#vulg-stage');
  if (vq.i >= vq.qs.length) {
    st.innerHTML = `<div class="deck-done"><p class="eyebrow">Quiz terminado</p><h3>${vq.score} de ${vq.qs.length}</h3>
      <div class="row"><button class="btn primary" id="vq-again">Otro quiz</button></div></div>`;
    $('#vq-again').onclick = () => { vq = null; viewVulg(); };
    return;
  }
  const { v: [f, names], dir } = vq.qs[vq.i];
  const others = shuffle(VULG.filter(x => x[0] !== f)).slice(0, 3);
  const opts = shuffle([[f, names], ...others]);
  const label = x => (dir === 'n2f' ? fmtF(x[0]) : esc(VULG_DISPLAY[x[0]] || cap(x[1][0])));
  st.innerHTML = `<div class="qcard vq">
    <div class="fc-meta"><span>Pregunta <b>${vq.i + 1}</b> de ${vq.qs.length}</span><span class="bar"><i style="width:${(100 * vq.i) / vq.qs.length}%"></i></span><span><b>${vq.score}</b> ✓</span></div>
    <p class="q-ask">${dir === 'n2f' ? '¿Cuál es la fórmula de…' : '¿Cuál es el nombre común de…'}</p>
    <div class="${dir === 'n2f' ? 'q-name' : 'q-formula'}">${dir === 'n2f' ? esc(VULG_DISPLAY[f] || cap(names[0])) : fmtF(f)}</div>
    <div class="mc">${opts.map((o, i) => `<button class="mc-opt ${dir === 'n2f' ? 'mono' : ''}" data-i="${i}">${label(o)}</button>`).join('')}</div>
    <div id="vq-next"></div></div>`;
  $$('.mc-opt', st).forEach(b => b.onclick = () => {
    if (vq.answered) return; vq.answered = true;
    const ok = opts[+b.dataset.i][0] === f;
    if (ok) vq.score++;
    store.vulg.tot++; if (ok) store.vulg.ok++;
    store.cards['v:' + f] = ok ? 1 : 0; save();
    $$('.mc-opt', st).forEach((x, i) => { if (opts[i][0] === f) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
    $('#vq-next').innerHTML = `<div class="row"><button class="btn primary" id="vq-n">${vq.i + 1 < vq.qs.length ? 'Siguiente →' : 'Ver resultado'}</button></div>`;
    $('#vq-n').onclick = () => { vq.i++; vq.answered = false; renderVQ(); };
    $('#vq-n').focus();
  });
}

route();
