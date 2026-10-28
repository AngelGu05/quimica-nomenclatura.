/* ===== Motor de nomenclatura (sin DOM) ===== */
const ROM = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const GR = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca', 'undeca'];
const ESP = ['', '', 'bis', 'tris', 'tetraquis', 'pentaquis', 'hexaquis', 'heptaquis'];
const OXP = ['', 'monóxido', 'dióxido', 'trióxido', 'tetróxido', 'pentóxido', 'hexóxido', 'heptóxido'];
const OXP_ALT = ['', 'óxido', 'dióxido', 'trióxido', 'tetraóxido', 'pentaóxido', 'hexaóxido', 'heptaóxido'];
const pre = n => (n > 1 ? GR[n] : '');
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* Elementos tal como aparecen en la hoja de números de oxidación */
const EL = {
  H: { n: 'hidrógeno', fixed: 1, cl: 'nm' },
  Li: { n: 'litio', fixed: 1 }, Na: { n: 'sodio', fixed: 1 }, K: { n: 'potasio', fixed: 1 },
  Rb: { n: 'rubidio', fixed: 1 }, Cs: { n: 'cesio', fixed: 1 }, Fr: { n: 'francio', fixed: 1 }, Ag: { n: 'plata', fixed: 1 },
  Be: { n: 'berilio', fixed: 2 }, Mg: { n: 'magnesio', fixed: 2 }, Ca: { n: 'calcio', fixed: 2 }, Sr: { n: 'estroncio', fixed: 2 },
  Ba: { n: 'bario', fixed: 2 }, Zn: { n: 'zinc', fixed: 2 }, Cd: { n: 'cadmio', fixed: 2 },
  Al: { n: 'aluminio', fixed: 3 }, B: { n: 'boro', fixed: 3, cl: 'nm' }, Ga: { n: 'galio', fixed: 3 }, In: { n: 'indio', fixed: 3 },
  Y: { n: 'ytrio', fixed: 3 }, Sc: { n: 'escandio', fixed: 3 },
  Si: { n: 'silicio', fixed: 4, cl: 'nm' }, Zr: { n: 'zirconio', fixed: 4 }, Hf: { n: 'hafnio', fixed: 4 },
  Hg: { n: 'mercurio', ox: [1, 2], sa: { 1: 'mercuroso', 2: 'mercúrico' } },
  Au: { n: 'oro', ox: [1, 3], sa: { 1: 'auroso', 3: 'áurico' } },
  Cu: { n: 'cobre', ox: [1, 2], sa: { 1: 'cuproso', 2: 'cúprico' } },
  Fe: { n: 'hierro', ox: [2, 3], sa: { 2: 'ferroso', 3: 'férrico' } },
  Co: { n: 'cobalto', ox: [2, 3], sa: { 2: 'cobaltoso', 3: 'cobáltico' } },
  Ni: { n: 'níquel', ox: [2, 3], sa: { 2: 'niqueloso', 3: 'niquélico' } },
  Pb: { n: 'plomo', ox: [2, 4], sa: { 2: 'plumboso', 4: 'plúmbico' } },
  Sn: { n: 'estaño', ox: [2, 4], sa: { 2: 'estanoso', 4: 'estánico' } },
  Pt: { n: 'platino', ox: [2, 4], sa: { 2: 'platinoso', 4: 'platínico' } },
  C: { n: 'carbono', ox: [2, 4], sa: { 2: 'carbonoso', 4: 'carbónico' }, cl: 'nm' },
  Ge: { n: 'germanio', ox: [2, 4], sa: { 2: 'germanioso', 4: 'germánico' }, cl: 'nm' },
  Bi: { n: 'bismuto', ox: [3, 5], sa: { 3: 'bismutoso', 5: 'bismútico' } },
  As: { n: 'arsénico', ox: [3, 5], sa: { 3: 'arsenioso', 5: 'arsénico' }, cl: 'nm' },
  Sb: { n: 'antimonio', ox: [3, 5], sa: { 3: 'antimonioso', 5: 'antimónico' }, cl: 'nm' },
  N: { n: 'nitrógeno', ox: [3, 5], sa: { 3: 'nitroso', 5: 'nítrico' }, cl: 'nm' },
  P: { n: 'fósforo', ox: [3, 5], sa: { 3: 'fosforoso', 5: 'fosfórico' }, cl: 'nm' },
  Cl: { n: 'cloro', ox: [1, 3, 5, 7], sa: { 1: 'hipocloroso', 3: 'cloroso', 5: 'clórico', 7: 'perclórico' }, cl: 'nm' },
  Br: { n: 'bromo', ox: [1, 3, 5, 7], sa: { 1: 'hipobromoso', 3: 'bromoso', 5: 'brómico', 7: 'perbrómico' }, cl: 'nm' },
  I: { n: 'yodo', ox: [1, 3, 5, 7], sa: { 1: 'hipoyodoso', 3: 'yodoso', 5: 'yódico', 7: 'peryódico' }, cl: 'nm' },
  S: { n: 'azufre', ox: [2, 4, 6], sa: { 2: 'hiposulfuroso', 4: 'sulfuroso', 6: 'sulfúrico' }, cl: 'nm' },
  Se: { n: 'selenio', ox: [2, 4, 6], sa: { 2: 'hiposelenioso', 4: 'selenioso', 6: 'selénico' }, cl: 'nm' },
  Te: { n: 'telurio', ox: [2, 4, 6], sa: { 2: 'hipoteluroso', 4: 'teluroso', 6: 'telúrico' }, cl: 'nm' },
  Cr: { n: 'cromo', ox: [2, 3, 6] }, Mn: { n: 'manganeso', ox: [2, 3, 4, 6, 7] },
  V: { n: 'vanadio', ox: [2, 3, 4, 5] }, Mo: { n: 'molibdeno', ox: [2, 3, 4, 5, 6] },
  O: { n: 'oxígeno', cl: 'nm' }, F: { n: 'flúor', cl: 'nm' },
};
const SYMBOLS = Object.keys(EL);

const FIX_M = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr', 'Ag', 'Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Zn', 'Cd', 'Al', 'Ga', 'In', 'Y', 'Sc', 'Zr', 'Hf'];
const VAR_M = ['Hg', 'Au', 'Cu', 'Fe', 'Co', 'Ni', 'Pb', 'Sn', 'Pt', 'Bi'];
const MANY_M = ['Cr', 'Mn', 'V', 'Mo'];
const NM_HYD = ['C', 'N', 'P', 'As', 'Sb', 'Ge', 'Cl', 'Br', 'I', 'S', 'Se', 'Te', 'B', 'Si'];
const NM_OX = ['C', 'N', 'P', 'S', 'Se', 'Te', 'Cl', 'Br', 'I'];

function cat(sym, q) {
  if (sym === 'NH4') return { sym, f: 'NH4', q: 1, name: 'amonio', fixed: true, sa: null, cl: 'm', poly: true };
  const e = EL[sym];
  if (q == null) q = e.fixed;
  return { sym, f: sym, q, name: e.n, fixed: !!e.fixed, sa: e.sa ? e.sa[q] || null : null, cl: e.cl || 'm', poly: false };
}
function randMetalCat(opts = {}) {
  const r = Math.random();
  let c;
  if (r < 0.38 || opts.fixedOnly) c = cat(pick(FIX_M));
  else if (r < 0.86 || opts.noMany) { const s = pick(VAR_M); c = cat(s, pick(EL[s].ox)); }
  else { const s = pick(MANY_M); c = cat(s, pick(EL[s].ox)); }
  if (opts.minQ && c.q < opts.minQ) return randMetalCat(opts);
  return c;
}

/* Aniones monoatómicos */
const MONO_AN = {
  F: { name: 'fluoruro', q: 1, hid: 'fluorhídrico' }, Cl: { name: 'cloruro', q: 1, hid: 'clorhídrico' },
  Br: { name: 'bromuro', q: 1, hid: 'bromhídrico' }, I: { name: 'yoduro', q: 1, hid: 'yodhídrico' },
  O: { name: 'óxido', q: 2 }, S: { name: 'sulfuro', q: 2, hid: 'sulfhídrico' },
  Se: { name: 'seleniuro', q: 2, hid: 'selenhídrico' }, Te: { name: 'telururo', q: 2, hid: 'telurhídrico' },
  N: { name: 'nitruro', q: 3 }, P: { name: 'fosfuro', q: 3 }, As: { name: 'arseniuro', q: 3 }, Sb: { name: 'antimoniuro', q: 3 },
  C: { name: 'carburo', q: 4 }, Si: { name: 'silicuro', q: 4 }, H: { name: 'hidruro', q: 1 },
};
/* Aniones poliatómicos con oxígeno (c = átomo central, nc = cuántos, no = oxígenos, root = raíz IUPAC) */
const POLY = {
  ClO: { f: 'ClO', q: 1, name: 'hipoclorito', acid: 'hipocloroso', c: 'Cl', no: 1, root: 'clorato' },
  ClO2: { f: 'ClO2', q: 1, name: 'clorito', acid: 'cloroso', c: 'Cl', no: 2, root: 'clorato' },
  ClO3: { f: 'ClO3', q: 1, name: 'clorato', acid: 'clórico', c: 'Cl', no: 3, root: 'clorato' },
  ClO4: { f: 'ClO4', q: 1, name: 'perclorato', acid: 'perclórico', c: 'Cl', no: 4, root: 'clorato' },
  BrO: { f: 'BrO', q: 1, name: 'hipobromito', acid: 'hipobromoso', c: 'Br', no: 1, root: 'bromato' },
  BrO2: { f: 'BrO2', q: 1, name: 'bromito', acid: 'bromoso', c: 'Br', no: 2, root: 'bromato' },
  BrO3: { f: 'BrO3', q: 1, name: 'bromato', acid: 'brómico', c: 'Br', no: 3, root: 'bromato' },
  BrO4: { f: 'BrO4', q: 1, name: 'perbromato', acid: 'perbrómico', c: 'Br', no: 4, root: 'bromato' },
  IO: { f: 'IO', q: 1, name: 'hipoyodito', acid: 'hipoyodoso', c: 'I', no: 1, root: 'yodato' },
  IO2: { f: 'IO2', q: 1, name: 'yodito', acid: 'yodoso', c: 'I', no: 2, root: 'yodato' },
  IO3: { f: 'IO3', q: 1, name: 'yodato', acid: 'yódico', c: 'I', no: 3, root: 'yodato' },
  IO4: { f: 'IO4', q: 1, name: 'peryodato', acid: 'peryódico', c: 'I', no: 4, root: 'yodato' },
  NO2: { f: 'NO2', q: 1, name: 'nitrito', acid: 'nitroso', c: 'N', no: 2, root: 'nitrato' },
  NO3: { f: 'NO3', q: 1, name: 'nitrato', acid: 'nítrico', c: 'N', no: 3, root: 'nitrato' },
  MnO4: { f: 'MnO4', q: 1, name: 'permanganato', acid: 'permangánico', c: 'Mn', no: 4, root: 'manganato' },
  BiO3: { f: 'BiO3', q: 1, name: 'bismutato', acid: 'bismútico', c: 'Bi', no: 3, root: 'bismutato' },
  CO3: { f: 'CO3', q: 2, name: 'carbonato', acid: 'carbónico', c: 'C', no: 3, root: 'carbonato' },
  CrO4: { f: 'CrO4', q: 2, name: 'cromato', acid: 'crómico', c: 'Cr', no: 4, root: 'cromato' },
  Cr2O7: { f: 'Cr2O7', q: 2, name: 'dicromato', acid: 'dicrómico', c: 'Cr', nc: 2, no: 7, root: 'cromato' },
  C2O4: { f: 'C2O4', q: 2, name: 'oxalato', acid: 'oxálico', c: 'C', nc: 2, no: 4, root: 'carbonato' },
  MnO4b: { f: 'MnO4', q: 2, name: 'manganato', acid: 'mangánico', c: 'Mn', no: 4, root: 'manganato' },
  SO4: { f: 'SO4', q: 2, name: 'sulfato', acid: 'sulfúrico', c: 'S', no: 4, root: 'sulfato' },
  SO3: { f: 'SO3', q: 2, name: 'sulfito', acid: 'sulfuroso', c: 'S', no: 3, root: 'sulfato' },
  SiO3: { f: 'SiO3', q: 2, name: 'metasilicato', acid: 'metasilícico', c: 'Si', no: 3, root: 'silicato' },
  AsO4: { f: 'AsO4', q: 3, name: 'arseniato', acid: 'arsénico', c: 'As', no: 4, root: 'arseniato' },
  AsO3: { f: 'AsO3', q: 3, name: 'arsenito', acid: 'arsenioso', c: 'As', no: 3, root: 'arseniato' },
  PO3: { f: 'PO3', q: 3, name: 'fosfito', acid: 'fosforoso', c: 'P', no: 3, root: 'fosfato' },
  PO4: { f: 'PO4', q: 3, name: 'fosfato', acid: 'fosfórico', c: 'P', no: 4, root: 'fosfato' },
  BO3: { f: 'BO3', q: 3, name: 'borato', acid: 'bórico', c: 'B', no: 3, root: 'borato' },
  BiO3b: { f: 'BiO3', q: 3, name: 'bismutito', acid: 'bismutoso', c: 'Bi', no: 3, root: 'bismutato' },
  SiO4: { f: 'SiO4', q: 4, name: 'ortosilicato', acid: 'ortosilícico', c: 'Si', no: 4, root: 'silicato' },
};
const OXOANIONS = Object.keys(POLY);
const ACID_SALT_BASES = ['CO3', 'SO4', 'SO3', 'PO4', 'AsO4', 'AsO3'];

function oxoPrefix(n) { return n === 1 ? 'monoxo' : GR[n] + 'oxo'; }
function an(id) {
  if (id === 'OH') return { id, f: 'OH', q: 1, name: 'hidróxido', poly: true };
  if (MONO_AN[id]) return { id, f: id, poly: false, ...MONO_AN[id] };
  const p = POLY[id];
  const nc = p.nc || 1, nh = p.nh || 0;
  const x = (2 * p.no - p.q - nh) / nc;
  const hp = nh ? pre(nh) + 'hidrógeno ' : '';
  const si = `${hp}${oxoPrefix(p.no)}${nc > 1 ? GR[nc] : ''}${p.root} (${ROM[x]})`;
  return { id, poly: true, nc, nh, x, si, ...p };
}
function hAn(baseId, k) {
  const b = POLY[baseId];
  const p = { ...b, f: 'H' + (k > 1 ? k : '') + b.f, q: b.q - k, nh: k, name: pre(k) + 'hidrógeno' + b.name, acid: null };
  const nc = p.nc || 1;
  const x = (2 * p.no - p.q - k) / nc;
  const si = `${pre(k)}hidrógeno ${oxoPrefix(p.no)}${nc > 1 ? GR[nc] : ''}${p.root} (${ROM[x]})`;
  return { id: 'H' + k + baseId, poly: true, nc, x, si, ...p };
}

/* ===== Fórmulas ===== */
function part(ion, n) { return n === 1 ? ion.f : ion.poly ? `(${ion.f})${n}` : ion.f + n; }
function cross(q1, q2) { const g = gcd(q1, q2); return [q2 / g, q1 / g]; }

function parseFormula(raw) {
  let s = String(raw || '').replace(/[•∙⋅*]/g, '·').replace(/\.(?=\s*\d)/g, '·').replace(/\s+(?=\d)/g, '·').replace(/\s+/g, '');
  if (!s) return { err: 'Escribe una fórmula.' };
  const total = {};
  for (let seg of s.split('·')) {
    if (!seg) continue;
    let mult = 1;
    const m = seg.match(/^(\d+)(.+)$/);
    if (m) { mult = +m[1]; seg = m[2]; }
    const r = parseSeg(seg);
    if (r.err) return r;
    for (const k in r.c) total[k] = (total[k] || 0) + r.c[k] * mult;
  }
  return { c: total };
}
function parseSeg(s) {
  const stack = [{}];
  let i = 0;
  const num = () => { let d = ''; while (i < s.length && /\d/.test(s[i])) d += s[i++]; return d ? +d : 1; };
  while (i < s.length) {
    const ch = s[i];
    if (ch === '(' || ch === '[') { stack.push({}); i++; }
    else if (ch === ')' || ch === ']') {
      if (stack.length < 2) return { err: 'Sobra un paréntesis de cierre.' };
      i++; const n = num(); const top = stack.pop(); const cur = stack[stack.length - 1];
      for (const k in top) cur[k] = (cur[k] || 0) + top[k] * n;
    } else if (/[A-Z]/.test(ch)) {
      let sym = ch; i++;
      if (i < s.length && /[a-z]/.test(s[i])) { sym += s[i]; i++; }
      if (!EL[sym]) {
        if (sym.length === 2 && EL[sym[0]]) { sym = sym[0]; i--; }
        else return { err: `No reconozco el símbolo “${sym}”.` };
      }
      const n = num(); const cur = stack[stack.length - 1]; cur[sym] = (cur[sym] || 0) + n;
    } else if (/[a-z]/.test(ch)) return { err: 'Los símbolos empiezan con mayúscula: Fe, no fe; Co (cobalto) no es lo mismo que CO.' };
    else if (/\d/.test(ch)) return { err: 'Hay un número en un lugar raro. Los subíndices van después del símbolo.' };
    else return { err: `No entiendo el carácter “${ch}”.` };
  }
  if (stack.length !== 1) return { err: 'Falta cerrar un paréntesis.' };
  return { c: stack[0] };
}
function sameAtoms(a, b) {
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every(k => a[k] === b[k]);
}

/* ===== Compuestos ===== */
function mk(type, o) {
  const c = { type, cats: o.cats || [], ans: o.ans || [], oh: o.oh || 0, h2o: o.h2o || 0, base: o.base || null };
  c.formula = o.formula || c.cats.map(([i, n]) => part(i, n)).join('') + (c.oh ? (c.oh > 1 ? `(OH)${c.oh}` : '(OH)') : '') + c.ans.map(([i, n]) => part(i, n)).join('');
  c.atoms = parseFormula(c.formula).c;
  return c;
}
const C = {
  hidracido(id) { const a = an(id), H = cat('H', 1); return mk('hidracido', { cats: [[H, a.q]], ans: [[a, 1]], formula: 'H' + (a.q > 1 ? a.q : '') + a.f }); },
  hidruro(sym, q) {
    const c = cat(sym, q), h = an('H');
    return mk(c.cl === 'nm' ? 'hidruro_nm' : 'hidruro_m', { cats: [[c, 1]], ans: [[h, c.q]], formula: c.f + 'H' + (c.q > 1 ? c.q : '') });
  },
  oxido(sym, q) {
    const c = cat(sym, q), o = an('O'); const [nc, na] = cross(c.q, 2);
    return mk(c.cl === 'nm' ? 'oxido_nm' : 'oxido_m', { cats: [[c, nc]], ans: [[o, na]] });
  },
  peroxido(sym) {
    const c = cat(sym), o2 = { id: 'O2', f: 'O2', q: 2, name: 'peróxido', poly: true }; const [nc, na] = cross(c.q, 2);
    return mk('peroxido', { cats: [[c, nc]], ans: [[o2, na]], formula: c.f + (nc > 1 ? nc : '') + 'O' + 2 * na });
  },
  salBin(sym, q, id) { const c = cat(sym, q), a = an(id); const [nc, na] = cross(c.q, a.q); return mk('sal_bin', { cats: [[c, nc]], ans: [[a, na]] }); },
  hidroxido(sym, q) { const c = cat(sym, q), a = an('OH'); return mk('hidroxido', { cats: [[c, 1]], ans: [[a, c.q]] }); },
  oxoacido(id) { const a = an(id), H = cat('H', 1); return mk('oxoacido', { cats: [[H, a.q]], ans: [[a, 1]], formula: 'H' + (a.q > 1 ? a.q : '') + a.f }); },
  oxosal(sym, q, id) { const c = cat(sym, q), a = an(id); const [nc, na] = cross(c.q, a.q); return mk('oxosal', { cats: [[c, nc]], ans: [[a, na]] }); },
  salAcida(sym, q, baseId, k) { const c = cat(sym, q), a = hAn(baseId, k); const [nc, na] = cross(c.q, a.q); return mk('sal_acida', { cats: [[c, nc]], ans: [[a, na]] }); },
  salBasica(sym, q, nC, k, id, m = 1) {
    const c = cat(sym, q), a = an(id);
    if (nC * c.q !== k + m * a.q) throw new Error('sal básica sin balance');
    return mk('sal_basica', { cats: [[c, nC]], ans: [[a, m]], oh: k });
  },
  // cats: [[sym,q,n?]], ans: [[id,n]]
  multi(cats, ans) {
    const cs = cats.map(([s, q, n]) => [cat(s, q), n || 1]).sort((x, y) => x[0].f.localeCompare(y[0].f));
    const as = ans.map(([id, n]) => [an(id), n]);
    const pos = cs.reduce((t, [i, n]) => t + i.q * n, 0), neg = as.reduce((t, [i, n]) => t + i.q * n, 0);
    if (pos !== neg) throw new Error('sal doble sin balance');
    const type = (cs.length >= 3 || as.length >= 3) ? 'sal_triple' : 'sal_doble';
    return mk(type, { cats: cs, ans: as });
  },
  hidrato(base, n) { return mk('hidrato', { base, h2o: n, cats: base.cats, ans: base.ans, formula: base.formula + '·' + n + 'H2O' }); },
};

/* ===== Nombres vulgares (de la guía) ===== */
const VULG = [
  ['NH3', ['amoníaco', 'amoniaco']], ['CH4', ['metano', 'gas natural']], ['PH3', ['fosfina']], ['NaCl', ['sal de mesa']],
  ['SiH4', ['silano']], ['H2O', ['agua']], ['SbH3', ['estibina']], ['NaOH', ['lejía', 'sosa cáustica']], ['AsH3', ['arsina']],
  ['N2O', ['gas hilarante']], ['BH3', ['borano']], ['CaO', ['cal viva']], ['HCl', ['ácido muriático']], ['Ca(OH)2', ['cal apagada']],
  ['CaCO3', ['mármol', 'yeso', 'piedra caliza']], ['CO2', ['hielo seco', 'gas carbónico']], ['Mg(OH)2', ['leche de magnesia']],
  ['NaHCO3', ['polvo de hornear', 'bicarbonato']], ['MgSO4·7H2O', ['sales de Epsom', 'sales de Epson']], ['H2SO4', ['aceite de vitriolo']],
  ['C12H22O11', ['azúcar']], ['HC2H3O2', ['vinagre']],
];
const VULG_MAP = Object.fromEntries(VULG);
const VULG_DISPLAY = {
  CH4: 'Metano (gas natural)', NaOH: 'Lejía, sosa cáustica', CaCO3: 'Mármol, yeso, piedra caliza',
  CO2: 'Hielo seco (sólido), gas carbónico (gas)', NaHCO3: 'Polvo de hornear, bicarbonato', 'MgSO4·7H2O': 'Sales de Epsom', HC2H3O2: 'Vinagre (disolución alrededor del 5 %)',
};

/* ===== Nombres por sistema ===== */
const SYSTEMS = ['NF', 'SA', 'SS', 'SE', 'SI', 'SE/SS', 'SI/SS', 'NV'];
const SYS_LABEL = { NF: 'Nombre funcional', SA: 'Sistema antiguo', SS: 'Sistema stock', SE: 'Sistema estequiométrico', SI: 'Sistema IUPAC', 'SE/SS': 'Estequiométrico / Stock', 'SI/SS': 'IUPAC / Stock', NV: 'Nombre vulgar' };
const TYPE_LABEL = {
  hidracido: 'Hidrácido', hidruro_m: 'Hidruro metálico', hidruro_nm: 'Hidruro no metálico', oxido_m: 'Óxido metálico',
  oxido_nm: 'Óxido no metálico', peroxido: 'Peróxido', sal_bin: 'Sal binaria', hidroxido: 'Hidróxido', oxoacido: 'Oxoácido',
  oxosal: 'Oxosal', sal_acida: 'Sal ácida', sal_basica: 'Sal básica', sal_doble: 'Sal doble', sal_triple: 'Sal triple', hidrato: 'Sal hidratada',
};
const TEMA_TYPES = {
  1: ['hidracido', 'hidruro_m', 'hidruro_nm', 'oxido_m', 'oxido_nm', 'peroxido', 'sal_bin'],
  2: ['hidroxido', 'oxoacido', 'oxosal'],
  3: ['sal_acida', 'sal_basica', 'sal_doble', 'sal_triple', 'hidrato'],
};

// combina partes (cadena o lista de alternativas) en todas las variantes posibles
function cx(...parts) {
  let out = [''];
  for (const p of parts) { const alts = Array.isArray(p) ? p : [p]; const next = []; for (const o of out) for (const a of alts) next.push(o + a); out = next; }
  return [...new Set(out)];
}
const ssOf = c => `${c.name} (${ROM[c.q]})`;
const siAlts = a => [a.si, a.si.replace('monoxo', 'monooxo')];
function seAnion(a, n) {
  if (a.f === 'O') return [OXP[n], OXP_ALT[n]];
  return n > 1 ? [GR[n] + a.name] : [a.name, 'mono' + a.name];
}

function namesIn(c, sys) {
  if (sys === 'NV') return VULG_MAP[c.formula] || null;
  const t = c.type;
  if (t === 'hidrato') {
    const b = namesIn(c.base, sys);
    return b ? b.map(x => `${x} ${GR[c.h2o]}hidratado`) : null;
  }
  const [ci, nC] = c.cats[0], [ai, nA] = c.ans[0] || [];
  switch (t) {
    case 'hidracido':
      if (sys === 'NF') return ['ácido ' + ai.hid];
      if (sys === 'SE') return [`${ai.name} de ${pre(nC)}hidrógeno`];
      return null;
    case 'hidruro_nm': case 'hidruro_m': case 'oxido_m': case 'sal_bin': case 'hidroxido': case 'oxosal': case 'sal_acida': {
      const base = ai.name;
      if (sys === 'NF') return ci.fixed ? [`${base} de ${ci.name}`] : null;
      if (sys === 'SA') return !ci.fixed && ci.sa ? [`${base} ${ci.sa}`] : null;
      if (sys === 'SS') return !ci.fixed ? [`${base} de ${ssOf(ci)}`] : null;
      if (sys === 'SE') {
        if (t === 'hidruro_nm' || t === 'hidruro_m' || t === 'hidroxido') return cx(seAnion(ai, nA), ' de ', ci.name);
        return cx(seAnion(ai, nA), ' de ', pre(nC) + ci.name);
      }
      if (sys === 'SI') {
        if (!ai.si) return null;
        return cx(nA > 1 ? [ESP[nA] + ' ['] : [''], siAlts(ai), nA > 1 ? ']' : '', ` de ${pre(nC)}${ci.name}`);
      }
      if (sys === 'SE/SS') return (t === 'oxosal' || t === 'sal_acida') && !ci.fixed ? cx(seAnion(ai, nA), ` de ${ssOf(ci)}`) : null;
      if (sys === 'SI/SS') return (t === 'oxosal' || t === 'sal_acida') && !ci.fixed && ai.si ? cx(nA > 1 ? ESP[nA] + ' [' : '', siAlts(ai), nA > 1 ? ']' : '', ` de ${ssOf(ci)}`) : null;
      return null;
    }
    case 'oxido_nm':
      if (sys === 'NF') return ci.sa ? ['anhídrido ' + ci.sa] : null;
      if (sys === 'SS') return [`óxido de ${ssOf(ci)}`];
      if (sys === 'SE') return cx(seAnion(ai, nA), ' de ', pre(nC) + ci.name);
      return null;
    case 'peroxido':
      return sys === 'NF' ? [`peróxido de ${ci.name}`] : null;
    case 'oxoacido':
      if (sys === 'NF') return ['ácido ' + ai.acid];
      if (sys === 'SE') return [`${ai.name} de ${pre(nC)}hidrógeno`];
      if (sys === 'SI') return cx(siAlts(ai), ` de ${pre(nC)}hidrógeno`);
      return null;
    case 'sal_basica': {
      const hx = `${pre(c.oh)}hidroxi-`;
      if (sys === 'NF') return ci.fixed ? [`${hx}${ai.name} de ${ci.name}`] : null;
      if (sys === 'SA') return !ci.fixed && ci.sa ? [`${hx}${ai.name} ${ci.sa}`] : null;
      if (sys === 'SS') return !ci.fixed ? [`${hx}${ai.name} de ${ssOf(ci)}`] : null;
      if (sys === 'SE') return [`${hx}${pre(nA)}${ai.name} de ${pre(nC)}${ci.name}`];
      if (sys === 'SE/SS') return !ci.fixed ? [`${hx}${pre(nA)}${ai.name} de ${ssOf(ci)}`] : null;
      return null;
    }
    case 'sal_doble': case 'sal_triple': {
      const as = c.ans.slice().sort((x, y) => norm(x[0].name).localeCompare(norm(y[0].name)));
      const cs = c.cats.slice().sort((x, y) => norm(x[0].name).localeCompare(norm(y[0].name)));
      const allFixed = cs.every(([i]) => i.fixed);
      const anPlain = as.map(([i]) => i.name).join('-'), anPref = as.map(([i, n]) => pre(n) + i.name).join('-');
      const catPlain = cs.map(([i]) => i.name).join('-');
      const catSS = cs.map(([i]) => (i.fixed ? i.name : ssOf(i))).join('-');
      const catSSall = cs.map(([i]) => (i.sym === 'NH4' ? i.name : ssOf(i))).join('-');
      if (sys === 'NF') return allFixed ? cx([anPlain, anPref], ' de ', catPlain) : null;
      if (sys === 'SS') return !allFixed ? cx([anPlain, anPref], ' de ', [catSS, catSSall]) : null;
      if (sys === 'SE/SS') return !allFixed && as.some(([, n]) => n > 1) ? cx(anPref, ' de ', [catSS, catSSall]) : null;
      return null;
    }
  }
  return null;
}
function systemsFor(c) { return SYSTEMS.filter(s => namesIn(c, s)); }
function canonical(c, sys) { const n = namesIn(c, sys); return n ? n[0] : null; }

/* Normalización tolerante: minúsculas, sin tildes, sin espacios ni signos; acepta números arábigos entre paréntesis */
function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/\(\s*(\d)\s*\)/g, (m, d) => '(' + ROM[+d].toLowerCase() + ')')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ytrio/g, 'itrio').replace(/estann/g, 'estan').replace(/epson/g, 'epsom')
    .replace(/[^a-z0-9]/g, '');
}
function checkName(c, sys, input) {
  const v = namesIn(c, sys) || [];
  const n = norm(input);
  return !!n && v.some(x => norm(x) === n);
}
function checkFormula(c, input) {
  const r = parseFormula(input);
  if (r.err) return { ok: false, err: r.err };
  if (!sameAtoms(r.c, c.atoms)) return { ok: false };
  const s = String(input).replace(/\s/g, '');
  if (c.type === 'hidracido' && !s.startsWith('H')) return { ok: false, err: 'En los hidrácidos el hidrógeno se escribe primero (H₂S, HCl).' };
  if (c.type === 'hidruro_nm' && s.startsWith('H') && c.cats[0][0].sym !== 'H') return { ok: false, err: 'En los hidruros el hidrógeno va al final (SH₂, NH₃). Con H adelante sería un hidrácido.' };
  return { ok: true };
}

/* ===== Patrones y explicación ===== */
const PAT = {
  gen: {
    NF: 'ANIÓN de CATIÓN (solo con cationes de carga fija)', SA: 'ANIÓN + CATIÓN con -oso (carga menor) o -ico (carga mayor)',
    SS: 'ANIÓN de CATIÓN (carga en números romanos)', SE: 'PREFIJO + ANIÓN de PREFIJO + CATIÓN (“mono” no se escribe)',
    SI: '[PREFIJO]OXO + ANIÓN terminado en -ato (estado de oxidación) de PREFIJO + CATIÓN. Si el anión va entre paréntesis: bis, tris, tetraquis… y corchetes',
    'SE/SS': 'PREFIJO + ANIÓN de CATIÓN (carga en romano)', 'SI/SS': 'Anión como en IUPAC, catión como en Stock (carga en romano)', NV: 'Nombre común: hay que memorizarlo',
  },
  hidracido: { NF: 'ácido + raíz del no metal + -hídrico', SE: 'ANIÓN-uro de PREFIJO + hidrógeno' },
  hidruro_m: { NF: 'hidruro de METAL', SA: 'hidruro + METAL con -oso / -ico', SS: 'hidruro de METAL (carga en romano)', SE: 'PREFIJO + hidruro de METAL' },
  hidruro_nm: { NF: 'hidruro de NO METAL (B y Si, de carga fija)', SA: 'hidruro + NO METAL con hipo-…-oso / -oso / -ico / per-…-ico', SS: 'hidruro de NO METAL (carga en romano)', SE: 'PREFIJO + hidruro de NO METAL' },
  oxido_m: { NF: 'óxido de METAL', SA: 'óxido + METAL con -oso / -ico', SS: 'óxido de METAL (carga en romano)', SE: 'PREFIJO + óxido de PREFIJO + METAL (aquí se suele decir “monóxido”)' },
  oxido_nm: { NF: 'anhídrido + NO METAL con hipo-…-oso / -oso / -ico / per-…-ico', SS: 'óxido de NO METAL (carga en romano)', SE: 'PREFIJO + óxido de PREFIJO + NO METAL' },
  peroxido: { NF: 'peróxido de METAL (el ion peróxido es O₂²⁻)' },
  sal_bin: { NF: 'NO METAL-uro de METAL', SA: 'NO METAL-uro + METAL con -oso / -ico', SS: 'NO METAL-uro de METAL (carga en romano)', SE: 'PREFIJO + NO METAL-uro de PREFIJO + METAL' },
  hidroxido: { NF: 'hidróxido de CATIÓN', SA: 'hidróxido + CATIÓN con -oso / -ico', SS: 'hidróxido de CATIÓN (carga en romano)', SE: 'PREFIJO + hidróxido de CATIÓN' },
  oxoacido: { NF: 'ácido + ANIÓN cambiando -ito → -oso y -ato → -ico', SE: 'ANIÓN de PREFIJO + hidrógeno', SI: 'PREFIJO + OXO + ANIÓN en -ato (estado de oxidación) de PREFIJO + hidrógeno' },
  sal_acida: {
    NF: '(PREFIJO)hidrógeno + ANIÓN de CATIÓN', SA: '(PREFIJO)hidrógeno + ANIÓN + CATIÓN con -oso / -ico', SS: '(PREFIJO)hidrógeno + ANIÓN de CATIÓN (carga en romano)',
    SE: 'PREFIJO (cuántos aniones) + (PREFIJO)hidrógeno + ANIÓN de PREFIJO + CATIÓN', SI: 'bis/tris… [ (PREFIJO)hidrógeno + PREFIJO-OXO + ANIÓN-ato (estado de oxidación) ] de PREFIJO + CATIÓN',
    'SE/SS': 'PREFIJO + (PREFIJO)hidrógeno + ANIÓN de CATIÓN (carga en romano)', 'SI/SS': 'bis/tris… [ hidrógeno + PREFIJO-OXO + ANIÓN-ato (estado de oxidación) ] de CATIÓN (carga en romano)',
  },
  sal_basica: {
    NF: 'PREFIJO + hidroxi-ANIÓN de CATIÓN', SA: 'PREFIJO + hidroxi-ANIÓN + CATIÓN con -oso / -ico', SS: 'PREFIJO + hidroxi-ANIÓN de CATIÓN (carga en romano)',
    SE: 'PREFIJO + hidroxi-PREFIJO + ANIÓN de PREFIJO + CATIÓN', 'SE/SS': 'PREFIJO + hidroxi-PREFIJO + ANIÓN de CATIÓN (carga en romano)',
  },
  sal_doble: {
    NF: 'ANIONES (orden alfabético, con guiones) de CATIONES (orden alfabético, con guiones)', SS: 'Igual que el funcional, con la carga en romano de los cationes variables',
    'SE/SS': 'PREFIJO + ANIONES (orden alfabético) de CATIONES (con carga en romano)',
  },
  hidrato: { _: 'Nombre de la sal en el sistema pedido + PREFIJO + hidratado' },
};
PAT.sal_triple = PAT.sal_doble;
function patternFor(c, sys) {
  if (sys === 'NV') return PAT.gen.NV;
  if (c.type === 'hidrato') return PAT.hidrato._ + ' · Sal: ' + patternFor(c.base, sys);
  return (PAT[c.type] && PAT[c.type][sys]) || PAT.gen[sys];
}

const qs = (q, sign) => `${q}${sign}`;
function chargeNotes(c) {
  const notes = [];
  if (c.type === 'hidrato') return chargeNotes(c.base);
  const neg = c.ans.reduce((t, [i, n]) => t + i.q * n, 0) + c.oh;
  for (const [ci, nC] of c.cats) {
    if (ci.sym === 'H' && c.type !== 'peroxido') continue;
    if (ci.fixed) notes.push(`${ci.f}${ci.poly ? ' (amonio)' : ''} siempre tiene carga ${qs(ci.q, '+')}.`);
    else if (c.cats.length === 1) {
      const parts = c.ans.map(([i, n]) => `${n} × ${i.f === 'O2' ? 'O₂' : i.f} (${i.q}−)`).concat(c.oh ? [`${c.oh} × OH (1−)`] : []);
      notes.push(`Carga del ${ci.name}: ${parts.join(' + ')} = ${neg}−, repartido entre ${nC} ${ci.f} → ${ci.q}+.`);
    } else notes.push(`El ${ci.name} aquí tiene carga ${ci.q}+ (la suma de cargas debe dar cero).`);
    if (!ci.fixed && ci.sa) {
      const e = EL[ci.sym];
      notes.push(`Nombres antiguos del ${ci.name}: ${e.ox.map(q => `${q}+ = ${e.sa[q]}`).join(', ')}.`);
    }
  }
  for (const [ai] of c.ans) {
    if (ai.x) notes.push(`En ${ai.f}: el ${EL[ai.c].n} tiene estado de oxidación +${ai.x} → (${ROM[ai.x]}).`);
  }
  return notes;
}

/* ===== Generadores aleatorios ===== */
const GEN = {
  hidracido: () => C.hidracido(pick(['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te'])),
  hidruro_m: () => { const c = randMetalCat(); return C.hidruro(c.sym, c.q); },
  hidruro_nm: () => { const s = pick(NM_HYD); return C.hidruro(s, EL[s].fixed || pick(EL[s].ox)); },
  oxido_m: () => { const c = randMetalCat(); return C.oxido(c.sym, c.q); },
  oxido_nm: () => { const s = pick(NM_OX); return C.oxido(s, pick(EL[s].ox)); },
  peroxido: () => C.peroxido(pick(FIX_M.filter(s => EL[s].fixed <= 3).concat(['H']))),
  sal_bin: () => { const c = randMetalCat(); return C.salBin(c.sym, c.q, pick(['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te', 'N', 'P', 'As', 'Sb', 'C', 'Si'])); },
  hidroxido: () => { if (Math.random() < 0.08) return C.hidroxido('NH4'); const c = randMetalCat(); return C.hidroxido(c.sym, c.q); },
  oxoacido: () => C.oxoacido(pick(OXOANIONS)),
  oxosal: () => { if (Math.random() < 0.1) return C.oxosal('NH4', 1, pick(OXOANIONS)); const c = randMetalCat(); return C.oxosal(c.sym, c.q, pick(OXOANIONS)); },
  sal_acida: () => {
    const b = pick(ACID_SALT_BASES), k = POLY[b].q === 3 ? pick([1, 2]) : 1;
    if (Math.random() < 0.1) return C.salAcida('NH4', 1, b, k);
    const c = randMetalCat({ noMany: true }); return C.salAcida(c.sym, c.q, b, k);
  },
  sal_basica: () => {
    for (let t = 0; t < 200; t++) {
      const c = randMetalCat({ minQ: 2, noMany: Math.random() < 0.7 });
      const id = pick(['Cl', 'Br', 'I', 'F', 'NO3', 'NO2', 'ClO3', 'SO4', 'CO3', 'PO4', 'SO3']);
      const nC = pick([1, 1, 2]), k = nC * c.q - an(id).q;
      if (k >= 1 && k <= 4) return C.salBasica(c.sym, c.q, nC, k, id);
    }
    return C.salBasica('Mg', 2, 1, 1, 'Cl');
  },
  sal_doble: () => genMulti(pick(['2c1a', '2c1a', '1c2a', '2c2a'])),
  sal_triple: () => genMulti(pick(['3c1a', '3c1a', '1c3a'])),
  hidrato: () => {
    const n = pick([2, 3, 4, 5, 6, 7, 8, 10]);
    let base;
    for (let t = 0; t < 50; t++) {
      const c = randMetalCat({ noMany: true });
      base = Math.random() < 0.6 ? C.oxosal(c.sym, c.q, pick(['SO4', 'NO3', 'CO3', 'PO4', 'ClO3', 'SO3', 'ClO4'])) : C.salBin(c.sym, c.q, pick(['Cl', 'Br', 'I', 'F']));
      if (base.cats[0][1] <= 3) break;
    }
    return C.hidrato(base, n);
  },
};
const MULTI_CATS = () => (Math.random() < 0.1 ? ['NH4', 1] : (() => { const c = randMetalCat({ noMany: true }); return [c.sym, c.q]; })());
const MULTI_ANS = ['F', 'Cl', 'Br', 'I', 'S', 'NO3', 'SO4', 'CO3', 'ClO3', 'CrO4', 'PO4', 'C2O4', 'Cr2O7', 'NO2'];
function genMulti(kind) {
  const [nc, na] = kind.match(/\d/g).map(Number);
  for (let t = 0; t < 400; t++) {
    const cats = []; while (cats.length < nc) { const c = MULTI_CATS(); if (!cats.some(x => x[0] === c[0])) cats.push(c); }
    const ids = shuffle(MULTI_ANS).slice(0, na);
    const pos = cats.reduce((s, c) => s + c[1], 0);
    if (na === 1) { const q = an(ids[0]).q; if (pos % q === 0 && pos / q <= 6) return C.multi(cats, [[ids[0], pos / q]]); continue; }
    // varios aniones: busca cantidades pequeñas que sumen la carga positiva
    const qsA = ids.map(id => an(id).q);
    const combos = na === 2 ? [[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [2, 2]] : [[1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 1, 2]];
    for (const m of shuffle(combos)) {
      if (m.reduce((s, x, i) => s + x * qsA[i], 0) === pos) return C.multi(cats, ids.map((id, i) => [id, m[i]]));
    }
  }
  return C.multi([['K', 1], ['Na', 1]], [['SO4', 1]]);
}
function randomCompound(type) { return GEN[type](); }

/* ===== Ejercicios tomados de las prácticas del profe ===== */
const PRAC = {
  1: [
    [() => C.hidracido('S'), 'NF', 'n'], [() => C.salBin('Sn', 4, 'Se'), 'SS', 'n'], [() => C.hidruro('Mg'), 'NF', 'n'], [() => C.oxido('Se', 2), 'SS', 'n'],
    [() => C.salBin('Pb', 4, 'S'), 'SS', 'n'], [() => C.hidracido('Te'), 'SE', 'n'], [() => C.oxido('Sn', 2), 'SA', 'n'], [() => C.peroxido('Zn'), 'NF', 'n'],
    [() => C.hidruro('Fe', 3), 'SA', 'n'], [() => C.salBin('Au', 1, 'Cl'), 'SA', 'n'], [() => C.hidruro('P', 3), 'NV', 'n'], [() => C.oxido('S', 4), 'SS', 'n'],
    [() => C.peroxido('Li'), 'NF', 'n'], [() => C.hidruro('S', 2), 'SA', 'n'], [() => C.oxido('Y'), 'SE', 'n'], [() => C.peroxido('Sc'), 'NF', 'n'],
    [() => C.salBin('Zn', 2, 'C'), 'NF', 'n'], [() => C.hidruro('I', 5), 'SE', 'n'], [() => C.oxido('Cl', 5), 'NF', 'n'], [() => C.salBin('Ca', 2, 'N'), 'NF', 'n'],
    [() => C.oxido('Br', 7), 'SE', 'n'], [() => C.hidruro('Pt', 4), 'SS', 'n'], [() => C.oxido('Cr', 6), 'SS', 'n'], [() => C.hidruro('Br', 1), 'SS', 'n'],
    [() => C.oxido('Mn', 7), 'SE', 'n'], [() => C.hidruro('Cl', 7), 'SS', 'n'], [() => C.salBin('Fe', 3, 'N'), 'SA', 'n'], [() => C.hidruro('C', 2), 'SA', 'n'],
    [() => C.oxido('Au', 1), 'SA', 'n'], [() => C.oxido('N', 5), 'NF', 'n'], [() => C.hidruro('N', 3), 'NV', 'n'], [() => C.oxido('C', 2), 'NF', 'n'],
    [() => C.salBin('Cd', 2, 'N'), 'NF', 'f'], [() => C.salBin('Ni', 3, 'P'), 'SS', 'f'], [() => C.hidracido('Br'), 'NF', 'f'], [() => C.peroxido('Na'), 'NF', 'f'],
    [() => C.hidruro('Cu', 2), 'SA', 'f'], [() => C.salBin('Al', 3, 'C'), 'NF', 'f'], [() => C.oxido('Hf'), 'NF', 'f'], [() => C.oxido('N', 3), 'SE', 'f'],
    [() => C.hidruro('Cl', 3), 'SE', 'f'], [() => C.oxido('Bi', 3), 'SS', 'f'], [() => C.salBin('Hg', 2, 'F'), 'SA', 'f'], [() => C.oxido('I', 1), 'SS', 'f'],
    [() => C.oxido('Br', 3), 'NF', 'f'], [() => C.salBin('Co', 2, 'Br'), 'SA', 'f'], [() => C.hidruro('Hg', 1), 'SA', 'f'], [() => C.oxido('Se', 6), 'NF', 'f'],
    [() => C.salBin('Sc', 3, 'Se'), 'SE', 'f'], [() => C.hidruro('S', 6), 'SA', 'f'], [() => C.peroxido('Al'), 'NF', 'f'], [() => C.salBin('Pt', 4, 'C'), 'SA', 'f'],
    [() => C.hidruro('P', 5), 'SS', 'f'], [() => C.hidruro('Te', 4), 'SA', 'f'], [() => C.salBin('Bi', 5, 'S'), 'SE', 'f'], [() => C.oxido('S', 2), 'SE', 'f'],
  ],
  2: [
    [() => C.hidroxido('Ca'), 'NV', 'n'], [() => C.hidroxido('Ni', 2), 'SA', 'n'], [() => C.hidroxido('Fe', 3), 'SE', 'n'], [() => C.hidroxido('Na'), 'NF', 'n'],
    [() => C.oxoacido('PO4'), 'SI', 'n'], [() => C.oxoacido('ClO'), 'SE', 'n'], [() => C.oxoacido('SO3'), 'NF', 'n'], [() => C.oxoacido('CO3'), 'SI', 'n'],
    [() => C.oxosal('Ag', 1, 'NO3'), 'SI', 'n'], [() => C.oxosal('Pb', 2, 'SO4'), 'SS', 'n'], [() => C.oxosal('Ca', 2, 'PO4'), 'SE', 'n'], [() => C.oxosal('Co', 2, 'PO3'), 'SI', 'n'],
    [() => C.oxosal('Co', 2, 'PO3'), 'SA', 'n'],
    [() => C.hidroxido('Mn', 7), 'SE', 'f'], [() => C.hidroxido('Mg'), 'NV', 'f'], [() => C.hidroxido('Pt', 4), 'SS', 'f'], [() => C.hidroxido('Fe', 2), 'SA', 'f'],
    [() => C.oxoacido('AsO4'), 'NF', 'f'], [() => C.oxoacido('CrO4'), 'SI', 'f'], [() => C.oxoacido('SO4'), 'NV', 'f'], [() => C.oxoacido('ClO2'), 'SE', 'f'],
    [() => C.oxosal('Cr', 6, 'BrO'), 'SI', 'f'], [() => C.oxosal('Co', 3, 'BrO4'), 'SA', 'f'], [() => C.oxosal('Mn', 4, 'CO3'), 'SS', 'f'], [() => C.oxosal('Ca', 2, 'CO3'), 'NV', 'f'],
  ],
  3: [
    [() => C.salAcida('Al', 3, 'PO4', 1), 'NF', 'n'], [() => C.salAcida('Al', 3, 'PO4', 1), 'SI', 'n'], [() => C.salAcida('Pb', 4, 'CO3', 1), 'SA', 'n'],
    [() => C.salAcida('Pb', 4, 'CO3', 1), 'SI/SS', 'n'], [() => C.salAcida('Sb', 3, 'PO4', 2), 'SS', 'n'], [() => C.salAcida('Sn', 4, 'AsO3', 1), 'SA', 'n'],
    [() => C.salAcida('Sn', 4, 'AsO3', 1), 'SE/SS', 'n'],
    [() => C.salBasica('Mg', 2, 1, 1, 'Cl'), 'NF', 'n'], [() => C.salBasica('Al', 3, 2, 4, 'SO4'), 'NF', 'n'], [() => C.salBasica('Cu', 2, 2, 3, 'Cl'), 'SS', 'n'],
    [() => C.salBasica('Cu', 2, 2, 3, 'Cl'), 'SE', 'n'], [() => C.salBasica('Fe', 3, 1, 1, 'SO4'), 'SA', 'n'], [() => C.salBasica('Fe', 3, 1, 1, 'SO4'), 'SE/SS', 'n'],
    [() => C.multi([['Mg', 2], ['Ni', 2]], [['C2O4', 2]]), 'SS', 'n'], [() => C.multi([['Al', 3], ['K', 1], ['Na', 1]], [['NO3', 5]]), 'NF', 'n'],
    [() => C.multi([['Fe', 3], ['Na', 1]], [['SO4', 1], ['Cl', 2]]), 'SE/SS', 'n'], [() => C.multi([['Co', 2], ['Mg', 2]], [['ClO3', 4]]), 'SS', 'n'],
    [() => C.hidrato(C.oxosal('Cu', 2, 'SO4'), 5), 'SA', 'n'], [() => C.hidrato(C.oxosal('Cu', 2, 'SO4'), 5), 'SI', 'n'],
    [() => C.hidrato(C.oxosal('Fe', 2, 'PO4'), 8), 'SS', 'n'], [() => C.hidrato(C.oxosal('Fe', 2, 'PO4'), 8), 'SE', 'n'],
    [() => C.hidrato(C.oxosal('Mg', 2, 'SO4'), 7), 'NF', 'n'],
    [() => C.salAcida('K', 1, 'CO3', 1), 'NF', 'f'], [() => C.salAcida('Au', 3, 'SO3', 1), 'SS', 'f'], [() => C.salAcida('Li', 1, 'PO4', 2), 'NF', 'f'],
    [() => C.salAcida('Cu', 1, 'AsO4', 1), 'SA', 'f'],
    [() => C.salBasica('Sc', 3, 1, 1, 'CO3'), 'NF', 'f'], [() => C.salBasica('Fe', 2, 2, 1, 'PO4'), 'SS', 'f'], [() => C.salBasica('Al', 3, 1, 1, 'SO4'), 'NF', 'f'],
    [() => C.salBasica('Ni', 3, 1, 2, 'NO3'), 'SS', 'f'],
    [() => C.multi([['Fe', 3], ['K', 1]], [['S', 2]]), 'SS', 'f'], [() => C.multi([['Al', 3], ['Na', 1]], [['CrO4', 2]]), 'NF', 'f'],
    [() => C.multi([['NH4', 1], ['Na', 1]], [['Cr2O7', 1]]), 'NF', 'f'],
    [() => C.hidrato(C.salBin('Al', 3, 'Cl'), 3), 'NF', 'f'], [() => C.hidrato(C.salAcida('Na', 1, 'CO3', 1), 2), 'NF', 'f'], [() => C.hidrato(C.oxosal('Mg', 2, 'SO4'), 7), 'NV', 'f'],
  ],
};
