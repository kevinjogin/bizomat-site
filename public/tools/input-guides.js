// KEVOS® Tools input guides: an expandable explanation under every tool input, with a small animated SVG figure.
// The words for each field live in inputs-*.js (window.WORKOS_INPUTS[toolId][fieldKey] = { what, tip, effect, fig, sym }).
// Units, accepted range and the worked example come from the tool definition itself, so they cannot drift from the form.
// Runs unchanged in the browser (ui.js) and at build time in Node (src/utils/workos-tools.ts). It never reads or writes
// the calculation: the figure only mirrors the value already typed in its input.
(function (root) {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const r1 = (n) => Math.round(n * 10) / 10;
  const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

  // ---------- Units ----------
  const UNIT_NAMES = {
    mm: 'millimetres', m: 'metres', 'µm': 'micrometres (µm, microns)', cm: 'centimetres', in: 'inches', 'mm or in': 'millimetres or inches, as long as every length uses the same unit',
    'mm²': 'square millimetres', 'cm²': 'square centimetres', 'm²': 'square metres', 'mm⁴': 'millimetres to the fourth power (second moment of area)', 'cm³': 'cubic centimetres', L: 'litres', 'm³': 'cubic metres',
    MPa: 'megapascals (1 MPa = 1 N/mm²)', GPa: 'gigapascals (1 GPa = 1000 MPa)', 'N/mm²': 'newtons per square millimetre (equal to MPa)', kPa: 'kilopascals', bar: 'bar (1 bar = 100 kPa)', Pa: 'pascals',
    N: 'newtons', kN: 'kilonewtons (1 kN = 1000 N)', 'N·m': 'newton-metres', 'N/mm': 'newtons per millimetre', kg: 'kilograms', g: 'grams', t: 'tonnes', 'kg/m': 'kilograms per metre of length', 'kg/m³': 'kilograms per cubic metre', 'g/cm³': 'grams per cubic centimetre (1 g/cm³ = 1000 kg/m³)', 'kg·m²': 'kilogram square metres (mass moment of inertia)',
    '°': 'degrees of angle', '°C': 'degrees Celsius', K: 'kelvin (a difference of 1 K equals 1 °C)', 'µm/m·K': 'micrometres per metre per kelvin', 'µm/(m·K)': 'micrometres per metre per kelvin',
    'kJ/kg·K': 'kilojoules per kilogram per kelvin', 'kJ/(kg·K)': 'kilojoules per kilogram per kelvin', 'W/(m²·K)': 'watts per square metre per kelvin', 'W/m²·K': 'watts per square metre per kelvin', kJ: 'kilojoules', J: 'joules',
    rpm: 'revolutions per minute', 'm/s': 'metres per second', 'm/min': 'metres per minute', 'mm/s': 'millimetres per second', 'mm/min': 'millimetres per minute', 'mm/rev': 'millimetres per revolution', 'm/s²': 'metres per second squared',
    'L/min': 'litres per minute', 'm³/min': 'cubic metres per minute', 'm³/h': 'cubic metres per hour', cSt: 'centistokes (kinematic viscosity, 1 cSt = 1 mm²/s)',
    kW: 'kilowatts', W: 'watts', V: 'volts', A: 'amperes', Hz: 'hertz (cycles per second)', dB: 'decibels', 'A/dm²': 'amperes per square decimetre',
    s: 'seconds', min: 'minutes', h: 'hours', hr: 'hours', days: 'days', years: 'years', weeks: 'weeks', months: 'months',
    '%': 'percent: the number is read as a percentage, so type 8 for 8 %', ':1': 'a ratio to one (type 3 for 3:1)', '×': 'a multiplier (type 1.5 for 1.5 times)',
    $: 'an amount of money; use one currency for every money input', AUD: 'Australian dollars', 'AUD/yr': 'Australian dollars per year', 'AUD/h': 'Australian dollars per hour', 'AUD/kWh': 'Australian dollars per kilowatt-hour',
    '$/kg': 'money per kilogram', '$/hr': 'money per hour', '$/h': 'money per hour', '$/kWh': 'money per kilowatt-hour', '$/unit': 'money per unit',
    TPI: 'threads per inch', '1/in': 'threads per inch', teeth: 'a whole number of teeth', units: 'a count of units', items: 'a count of items', coils: 'a number of coils', turns: 'a number of turns', starts: 'a number of thread starts',
  };
  const unitName = (u) => UNIT_NAMES[u] || (/^\$\/|^AUD\//.test(u) ? `money per ${u.split('/')[1]}` : u);

  // ---------- Figure kinds ----------
  // Each kind draws one idea in a 320 × 150 box: the field's label, symbol and live value sit on the drawing.
  // desc() is the text alternative read by screen readers and shown when the figure is not drawn.
  const W = 320;
  const H = 172;
  const t = (x, y, s, cls = 'ig-t', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
  // Long value lines (big numbers, long units, out-of-range note) switch to a smaller size so they stay inside the figure.
  const liveClass = (s) => (s.length > 34 ? 'ig-v ig-v--long' : 'ig-v');
  const live = (x, y, o, anchor = 'middle') => `<text x="${x}" y="${y}" class="${liveClass(o.shown)}" text-anchor="${anchor}" data-ig-live>${esc(o.shown)}</text>`;
  const ln = (x1, y1, x2, y2, cls = 'ig-s') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  function head(x, y, ang, cls) {
    const a = (ang * Math.PI) / 180, s = 7;
    const p = (da) => `${r1(x - s * Math.cos(a + da))},${r1(y - s * Math.sin(a + da))}`;
    return `<polygon points="${x},${y} ${p(0.45)} ${p(-0.45)}" class="${cls}"/>`;
  }
  /** Line with an arrowhead at the end (and at the start when both is true). */
  function arrow(x1, y1, x2, y2, cls = 'ig-a', both = false) {
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return `${ln(x1, y1, x2, y2, `${cls}-l`)}${head(x2, y2, ang, `${cls}-h`)}${both ? head(x1, y1, ang + 180, `${cls}-h`) : ''}`;
  }
  const dim = (x1, y1, x2, y2) => arrow(x1, y1, x2, y2, 'ig-a', true);
  const hatch = (x, y, w, h) => {
    let s = '';
    for (let i = -h; i < w; i += 9) s += ln(r1(x + Math.max(i, 0)), r1(y + h - Math.max(-i, 0)), r1(x + Math.min(i + h, w)), r1(y + h - Math.min(h, w - i)), 'ig-hatch');
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="ig-body"/>${s}`;
  };
  const sym = (o, fallback) => o.sym || fallback;
  // Range ends such as ±10¹² (fields with no practical limit) are written as powers of ten so they fit the drawing.
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function short(n) {
    const v = Number(n);
    if (!Number.isFinite(v) || Math.abs(v) < 1e6) return String(n);
    const e = Math.floor(Math.log10(Math.abs(v))), m = r1(v / 10 ** e);
    const pow = `10${String(e).replace(/./g, (c) => SUP[c])}`;
    return Math.abs(m) === 1 ? `${m < 0 ? '−' : ''}${pow}` : `${m} × ${pow}`;
  }
  const name = (o) => clip(o.label, 46);

  const angleOf = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.min(180, Math.max(0, n)) : 40; };
  const arcPath = (cx, cy, r, v) => { const a = (angleOf(v) * Math.PI) / 180; return `M${cx + r} ${cy} A${r} ${r} 0 0 0 ${r1(cx + r * Math.cos(a))} ${r1(cy - r * Math.sin(a))}`; };
  const countOf = (v, max) => { const n = Math.round(Number(v)); return Math.min(max, Number.isFinite(n) ? Math.max(0, n) : 0); };

  const KINDS = {
    length: {
      desc: (o) => `A bar with a dimension line and arrows from one end to the other, marking the length ${o.label}.`,
      svg: (o) => `${hatch(60, 72, 200, 26)}${ln(60, 66, 60, 38)}${ln(260, 66, 260, 38)}<g class="ig-draw">${dim(64, 46, 256, 46)}</g>${t(160, 34, sym(o, 'L'), 'ig-sym')}`,
    },
    height: {
      desc: (o) => `A block with a vertical dimension line from its base to its top, marking the height ${o.label}.`,
      svg: (o) => `${hatch(110, 28, 80, 90)}${ln(196, 28, 226, 28)}${ln(196, 118, 226, 118)}<g class="ig-draw">${dim(218, 32, 218, 114)}</g>${t(244, 78, sym(o, 'h'), 'ig-sym', 'start')}${ln(80, 118, 240, 118, 'ig-ground')}`,
    },
    diameter: {
      desc: (o) => `A circle with a line straight through its centre from edge to edge, marking the diameter ${o.label}.`,
      svg: (o) => `<circle cx="110" cy="72" r="48" class="ig-body"/><circle cx="110" cy="72" r="2.5" class="ig-dot"/><g class="ig-spin-c">${dim(64, 72, 156, 72)}</g>${t(110, 62, sym(o, 'Ø'), 'ig-sym')}${t(228, 58, 'measured across', 'ig-m')}${t(228, 72, 'the centre', 'ig-m')}`,
    },
    radius: {
      desc: (o) => `A circle with a line from its centre to its edge, marking the radius ${o.label}; the radius is half the diameter.`,
      svg: (o) => `<circle cx="110" cy="72" r="48" class="ig-body"/><circle cx="110" cy="72" r="2.5" class="ig-dot"/><g class="ig-spin-c">${arrow(110, 72, 156, 72)}</g>${t(132, 64, sym(o, 'R'), 'ig-sym')}${t(228, 58, 'centre to edge', 'ig-m')}${t(228, 72, '= half the diameter', 'ig-m')}`,
    },
    thickness: {
      desc: (o) => `The cross-section of a plate or wall with a dimension across its thickness, marking ${o.label}.`,
      svg: (o) => `${hatch(40, 62, 200, 22)}${ln(246, 62, 270, 62)}${ln(246, 84, 270, 84)}<g class="ig-draw">${arrow(262, 40, 262, 61)}${arrow(262, 106, 262, 85)}</g>${t(254, 36, sym(o, 't'), 'ig-sym', 'end')}${t(140, 50, 'section through the material', 'ig-m')}`,
    },
    depth: {
      desc: (o) => `A surface with a step cut into it and a dimension from the original surface down to the bottom of the step, marking ${o.label}.`,
      svg: (o) => `<path d="M30 52 H130 V80 H290 V112 H30 Z" class="ig-body"/>${ln(130, 52, 290, 52, 'ig-ghost')}<g class="ig-draw">${dim(250, 54, 250, 78)}</g>${t(266, 70, sym(o, 'd'), 'ig-sym', 'start')}${t(210, 44, 'original surface', 'ig-m')}`,
    },
    gap: {
      desc: (o) => `Two parts separated by a small gap with a dimension across the gap, marking ${o.label}.`,
      svg: (o) => `${hatch(40, 40, 110, 64)}${hatch(170, 40, 110, 64)}<g class="ig-draw">${arrow(126, 72, 149, 72)}${arrow(194, 72, 171, 72)}</g>${t(160, 32, sym(o, 'c'), 'ig-sym')}`,
    },
    pitch: {
      desc: (o) => `A row of repeated features with a dimension from the centre of one to the centre of the next, marking the pitch ${o.label}.`,
      svg: (o) => `${ln(30, 92, 290, 92, 'ig-ground')}${[60, 120, 180, 240].map((x) => `<circle cx="${x}" cy="74" r="13" class="ig-body"/>${ln(x, 52, x, 98, 'ig-centre')}`).join('')}<g class="ig-draw">${dim(122, 40, 178, 40)}</g>${t(150, 32, sym(o, 'p'), 'ig-sym')}`,
    },
    thread: {
      desc: (o) => `A screw-thread profile with crests and roots, the pitch from crest to crest and the major and minor diameters, for ${o.label}.`,
      svg: (o) => `<path d="M30 60 ${[0, 1, 2, 3, 4, 5, 6].map((i) => `L${46 + i * 36} 40 L${64 + i * 36} 76`).join(' ')} L290 60 V110 H30 Z" class="ig-body"/>${ln(30, 40, 290, 40, 'ig-ghost')}${ln(30, 76, 290, 76, 'ig-ghost')}<g class="ig-draw">${dim(118, 28, 154, 28)}</g>${t(136, 22, 'pitch', 'ig-m')}${t(296, 44, 'major', 'ig-m', 'end')}${t(296, 88, 'minor', 'ig-m', 'end')}${t(70, 98, sym(o, ''), 'ig-sym')}`,
    },
    angle: {
      desc: (o) => `Two lines meeting at a point with an arc between them, marking the angle ${o.label}.`,
      svg: (o) => `${ln(70, 112, 250, 112)}<g data-ig-angle="70 112 150" transform="rotate(${-angleOf(o.raw)} 70 112)">${ln(70, 112, 220, 112, 'ig-a-l')}</g><path d="${arcPath(70, 112, 60, o.raw)}" class="ig-arc ig-draw" data-ig-arc="70 112 60"/>${t(140, 92, sym(o, 'θ'), 'ig-sym')}`,
      angle: true,
    },
    area: {
      desc: (o) => `A shaded shape whose enclosed surface is the area ${o.label}.`,
      svg: (o) => `<rect x="70" y="30" width="130" height="80" class="ig-fill ig-pulse"/><rect x="70" y="30" width="130" height="80" class="ig-s-r"/>${t(135, 76, sym(o, 'A'), 'ig-sym')}${t(250, 60, 'enclosed', 'ig-m')}${t(250, 74, 'surface', 'ig-m')}`,
    },
    volume: {
      desc: (o) => `A box drawn in three dimensions; the space it encloses is the volume ${o.label}.`,
      svg: (o) => `<path d="M80 50 L120 30 H220 L180 50 Z" class="ig-fill"/><path d="M180 50 L220 30 V100 L180 120 Z" class="ig-body"/><rect x="80" y="50" width="100" height="70" class="ig-fill ig-pulse"/><path d="M80 50 L120 30 H220 V100 L180 120 H80 Z M80 50 H180 V120 M180 50 L220 30" class="ig-s-r"/>${t(130, 92, sym(o, 'V'), 'ig-sym')}`,
    },
    roughness: {
      desc: (o) => `A magnified surface profile with peaks and valleys around a mean line; the average deviation from that line is ${o.label}.`,
      svg: (o) => `<path d="M30 74 L44 64 L52 80 L64 60 L76 84 L88 66 L98 78 L112 58 L124 86 L138 68 L150 76 L162 62 L176 82 L190 66 L202 80 L216 60 L230 84 L244 68 L256 78 L270 64 L290 74 V110 H30 Z" class="ig-body"/>${ln(30, 72, 290, 72, 'ig-centre')}<rect x="30" y="64" width="260" height="16" class="ig-band ig-pulse"/>${t(296, 60, 'mean line', 'ig-m', 'end')}${t(70, 40, sym(o, 'Ra'), 'ig-sym')}`,
    },
    tolerance: {
      desc: (o) => `A nominal size line with an upper and a lower limit around it; parts inside the band are acceptable. The figure illustrates ${o.label}.`,
      svg: (o) => `<rect x="40" y="52" width="240" height="36" class="ig-band"/>${ln(40, 52, 280, 52, 'ig-a-l')}${ln(40, 88, 280, 88, 'ig-a-l')}${ln(40, 70, 280, 70, 'ig-centre')}${t(286, 56, 'upper', 'ig-m', 'start')}${t(286, 92, 'lower', 'ig-m', 'start')}<circle cx="120" cy="66" r="4" class="ig-dot ig-pulse"/><circle cx="190" cy="78" r="4" class="ig-dot"/>${t(70, 36, sym(o, '±'), 'ig-sym')}`,
    },
    count: {
      desc: (o) => `A row of identical items being counted; ${o.label} is how many there are.`,
      svg: (o) => `${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${40 + i * 30}" y="54" width="22" height="22" rx="3" class="${i < countOf(o.raw, 8) ? 'ig-fill-a' : 'ig-body'}" data-ig-count="${i}"/>`).join('')}${t(160, 40, sym(o, 'n'), 'ig-sym')}`,
      count: 8,
    },
    teeth: {
      desc: (o) => `A gear with its teeth around the rim; ${o.label} is the number of teeth.`,
      svg: (o) => {
        let d = '';
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * 2 * Math.PI, b = a + Math.PI / 16;
          const p = (r, ang) => `${r1(100 + r * Math.cos(ang))} ${r1(74 + r * Math.sin(ang))}`;
          d += `${i ? 'L' : 'M'}${p(40, a)} L${p(50, a + 0.06)} L${p(50, b - 0.06)} L${p(40, b)} `;
        }
        return `<g class="ig-spin-g"><path d="${d}Z" class="ig-body"/><circle cx="100" cy="74" r="10" class="ig-hole"/></g>${t(220, 58, sym(o, 'z'), 'ig-sym')}${t(220, 74, 'teeth counted', 'ig-m')}${t(220, 88, 'around the rim', 'ig-m')}`;
      },
    },
    coils: {
      desc: (o) => `A coil spring between two plates; ${o.label} counts the coils.`,
      svg: (o) => `${ln(40, 30, 40, 110, 'ig-s-r')}<g class="ig-squash"><path d="M40 70 ${[0, 1, 2, 3, 4, 5, 6].map((i) => `L${56 + i * 28} 42 L${70 + i * 28} 98`).join(' ')} L250 70" class="ig-spring"/>${ln(250, 30, 250, 110, 'ig-s-r')}</g>${t(150, 26, sym(o, 'N'), 'ig-sym')}`,
    },
    mass: {
      desc: (o) => `A weight resting on a scale; ${o.label} is how much matter it contains, in kilograms or grams.`,
      svg: (o) => `<g class="ig-bob"><path d="M118 70 L132 36 H188 L202 70 Z" class="ig-body"/>${t(160, 60, sym(o, 'm'), 'ig-sym')}</g><rect x="90" y="72" width="140" height="8" rx="2" class="ig-fill"/><rect x="104" y="80" width="112" height="26" rx="3" class="ig-body"/>`,
    },
    density: {
      desc: (o) => `A cube of material: density ${o.label} is its mass divided by the volume it fills.`,
      svg: (o) => `<rect x="70" y="36" width="72" height="72" class="ig-fill"/>${[0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => `<circle cx="${82 + i * 16}" cy="${48 + j * 16}" r="3.4" class="ig-dot"/>`).join('')).join('')}<rect x="70" y="36" width="72" height="72" class="ig-s-r"/>${t(220, 54, 'mass', 'ig-m')}${ln(190, 62, 250, 62)}${t(220, 76, 'volume', 'ig-m')}${t(106, 28, sym(o, 'ρ'), 'ig-sym')}`,
    },
    force: {
      desc: (o) => `A block with an arrow pushing on it; the arrow is the force ${o.label}.`,
      svg: (o) => `${ln(40, 110, 280, 110, 'ig-ground')}${hatch(170, 56, 80, 54)}<g class="ig-push">${arrow(60, 83, 166, 83)}</g>${t(110, 72, sym(o, 'F'), 'ig-sym')}`,
    },
    torque: {
      desc: (o) => `A shaft with a curved arrow around it: torque ${o.label} is the twisting effect, force times lever arm.`,
      svg: (o) => `<circle cx="110" cy="72" r="18" class="ig-body"/><circle cx="110" cy="72" r="3" class="ig-dot"/><g class="ig-spin-c"><path d="M110 30 A42 42 0 1 1 68 72" class="ig-arc"/>${head(68, 72, 90, 'ig-a-h')}</g>${t(110, 22, sym(o, 'T'), 'ig-sym')}${t(232, 58, 'twisting effect', 'ig-m')}${t(232, 72, '= force × lever arm', 'ig-m')}`,
    },
    pressure: {
      desc: (o) => `A pressure gauge whose needle moves with ${o.label}; the needle follows the value you type.`,
      svg: (o) => `<path d="M60 102 A60 60 0 1 1 180 102" class="ig-dial"/>${[0, 1, 2, 3, 4].map((i) => { const a = Math.PI * (1.25 - i * 0.375); return ln(r1(120 + 52 * Math.cos(a)), r1(84 - 52 * Math.sin(a)), r1(120 + 60 * Math.cos(a)), r1(84 - 60 * Math.sin(a))); }).join('')}<g data-ig-needle="120 84" transform="rotate(${r1(-135 + o.fr * 270)} 120 84)">${ln(120, 84, 120, 36, 'ig-needle')}</g><circle cx="120" cy="84" r="5" class="ig-dot"/>${t(120, 118, sym(o, 'p'), 'ig-sym')}`,
      needle: true,
    },
    stress: {
      desc: (o) => `A test bar pulled from both ends: stress ${o.label} is the force carried by each square millimetre of its cross-section.`,
      svg: (o) => `<path d="M70 50 H110 Q120 62 130 62 H190 Q200 62 210 50 H250 V94 H210 Q200 82 190 82 H130 Q120 82 110 94 H70 Z" class="ig-body"/><g class="ig-pull-l">${arrow(66, 72, 26, 72)}</g><g class="ig-pull">${arrow(254, 72, 294, 72)}</g>${t(160, 76, sym(o, 'σ'), 'ig-sym')}${t(160, 38, 'stress = force ÷ area', 'ig-m')}`,
    },
    modulus: {
      desc: (o) => `A stress against strain graph whose straight starting slope is the stiffness value ${o.label}.`,
      svg: (o) => `${arrow(60, 118, 60, 24, 'ig-ax')}${arrow(60, 118, 200, 118, 'ig-ax')}${t(50, 30, 'stress', 'ig-m', 'end')}${t(200, 132, 'strain', 'ig-m')}<path d="M60 118 L130 50 Q160 30 196 30" class="ig-curve ig-draw"/><path d="M90 89 H120 V60" class="ig-centre"/>${t(128, 82, sym(o, 'E'), 'ig-sym', 'start')}`,
    },
    rotation: {
      desc: (o) => `A turning disc with a marker; ${o.label} is how many full turns it makes in each minute.`,
      svg: (o) => `<g class="ig-spin-c"><circle cx="110" cy="72" r="44" class="ig-body"/>${ln(110, 72, 110, 30, 'ig-a-l')}<circle cx="110" cy="34" r="5" class="ig-dot"/></g><circle cx="110" cy="72" r="4" class="ig-dot"/>${t(232, 58, 'turns of the shaft', 'ig-m')}${t(232, 72, 'per minute', 'ig-m')}${t(110, 136, sym(o, 'n'), 'ig-sym')}`,
    },
    velocity: {
      desc: (o) => `A marker moving along a track; ${o.label} is the distance it covers per unit of time.`,
      svg: (o) => `${ln(30, 92, 290, 92, 'ig-ground')}<g class="ig-slide"><rect x="40" y="70" width="34" height="20" rx="4" class="ig-body"/>${arrow(78, 80, 108, 80)}</g>${t(160, 44, sym(o, 'v'), 'ig-sym')}${t(160, 60, 'distance ÷ time', 'ig-m')}`,
    },
    acceleration: {
      desc: (o) => `Positions of a moving object at equal time steps, spreading further apart as it speeds up; ${o.label} is the rate of change of speed.`,
      svg: (o) => `${ln(30, 92, 290, 92, 'ig-ground')}${[40, 52, 72, 100, 136, 180, 232].map((x, i) => `<circle cx="${x}" cy="80" r="7" class="${i === 6 ? 'ig-dot' : 'ig-body'}"/>`).join('')}${t(160, 44, sym(o, 'a'), 'ig-sym')}${t(160, 60, 'change in speed ÷ time', 'ig-m')}`,
    },
    feed: {
      desc: (o) => `A cutting tool moving along a turning workpiece; ${o.label} is how far the tool advances for each revolution or tooth.`,
      svg: (o) => `<rect x="30" y="48" width="220" height="48" class="ig-body"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${50 + i * 26} 48 L${62 + i * 26} 96" class="ig-ghost"/>`).join('')}<g class="ig-slide"><path d="M180 20 L196 20 L190 46 Z" class="ig-fill-a"/></g>${dim(102, 112, 128, 112)}${t(115, 132, sym(o, 'f'), 'ig-sym')}${t(258, 62, 'advance per', 'ig-m')}${t(258, 76, 'rev or tooth', 'ig-m')}`,
    },
    flow: {
      desc: (o) => `A pipe with liquid or gas moving through it; ${o.label} is the volume that passes per unit of time.`,
      svg: (o) => `<rect x="30" y="56" width="260" height="32" class="ig-body"/>${ln(30, 72, 290, 72, 'ig-flow')}${arrow(250, 72, 286, 72)}${t(160, 40, sym(o, 'Q'), 'ig-sym')}`,
    },
    viscosity: {
      desc: (o) => `Fluid layers between a fixed and a moving plate, sliding past each other; ${o.label} is the fluid’s resistance to that flow.`,
      svg: (o) => `${ln(40, 112, 240, 112, 'ig-s-r')}<g class="ig-slide">${ln(40, 34, 240, 34, 'ig-s-r')}</g>${[0, 1, 2, 3].map((i) => arrow(60, 100 - i * 20, 90 + i * 34, 100 - i * 20, 'ig-a')).join('')}${t(270, 60, sym(o, 'ν'), 'ig-sym')}`,
    },
    inertia: {
      desc: (o) => `A rotating disc with masses away from its centre; ${o.label} measures how strongly it resists speeding up or slowing down its rotation.`,
      svg: (o) => `<g class="ig-spin-c"><circle cx="110" cy="72" r="46" class="ig-fill"/><circle cx="110" cy="34" r="8" class="ig-dot"/><circle cx="110" cy="110" r="8" class="ig-dot"/></g><circle cx="110" cy="72" r="4" class="ig-dot"/>${t(232, 58, 'mass × radius²', 'ig-m')}${t(232, 76, sym(o, 'J'), 'ig-sym')}`,
    },
    section: {
      desc: (o) => `The cross-section of a beam with its neutral axis; ${o.label} describes how the section’s area is spread around that axis.`,
      svg: (o) => `<path d="M90 26 H190 V40 H148 V104 H190 V118 H90 V104 H132 V40 H90 Z" class="ig-body"/>${ln(70, 72, 210, 72, 'ig-centre')}${t(214, 76, 'neutral axis', 'ig-m', 'start')}${t(140, 18, sym(o, 'I'), 'ig-sym')}`,
    },
    stiffness: {
      desc: (o) => `A spring under load with its deflection marked; stiffness ${o.label} is load divided by deflection.`,
      svg: (o) => `${ln(60, 22, 160, 22, 'ig-s-r')}<g class="ig-squash-v"><path d="M110 22 L110 30 ${[0, 1, 2, 3, 4].map((i) => `L92 ${38 + i * 14} L128 ${45 + i * 14}`).join(' ')} L110 104" class="ig-spring"/><rect x="92" y="104" width="36" height="16" class="ig-body"/></g>${arrow(110, 122, 110, 136)}${t(232, 58, 'load ÷ deflection', 'ig-m')}${t(232, 76, sym(o, 'k'), 'ig-sym')}`,
    },
    friction: {
      desc: (o) => `A block resting on a surface with the normal force pressing down and friction resisting sliding; ${o.label} is friction force divided by normal force.`,
      svg: (o) => `${ln(30, 100, 290, 100, 'ig-ground')}${hatch(130, 60, 70, 40)}${arrow(165, 22, 165, 56)}${t(176, 34, 'N', 'ig-m', 'start')}<g class="ig-push">${arrow(206, 80, 262, 80)}</g>${arrow(124, 96, 80, 96, 'ig-b')}${t(78, 88, 'friction', 'ig-m', 'end')}${t(60, 40, sym(o, 'μ'), 'ig-sym')}`,
    },
    factor: {
      desc: (o) => `Two bars: a base value and the same value multiplied by ${o.label}, the factor.`,
      svg: (o) => `${t(84, 46, 'base value', 'ig-m', 'end')}<rect x="94" y="34" width="100" height="16" class="ig-fill"/>${t(84, 80, 'with factor', 'ig-m', 'end')}<rect x="94" y="68" width="150" height="16" class="ig-fill-a ig-grow"/>${t(272, 66, sym(o, '×'), 'ig-sym')}`,
    },
    efficiency: {
      desc: (o) => `Input on the left and useful output on the right with the loss split off; ${o.label} is output divided by input.`,
      svg: (o) => `<rect x="30" y="50" width="70" height="44" class="ig-fill"/>${t(65, 76, 'input', 'ig-m')}${arrow(104, 72, 150, 72)}<rect x="160" y="50" width="20" height="44" class="ig-body"/><rect x="190" y="50" width="${r1(Math.max(1, o.fr * 100))}" height="44" class="ig-fill-a" data-ig-bar="190 100"/>${t(240, 42, 'useful output', 'ig-m')}${t(170, 42, 'loss', 'ig-m')}${t(60, 34, sym(o, 'η'), 'ig-sym')}`,
      bar: true,
    },
    ratio: {
      desc: (o) => `Two wheels of different sizes linked together; ${o.label} compares one with the other.`,
      svg: (o) => `<g class="ig-spin-c"><circle cx="110" cy="72" r="44" class="ig-body"/>${ln(110, 72, 110, 30, 'ig-a-l')}</g><g class="ig-spin-g2"><circle cx="196" cy="72" r="22" class="ig-body"/>${ln(196, 72, 196, 52, 'ig-a-l')}</g>${t(262, 58, sym(o, 'i'), 'ig-sym')}`,
    },
    temperature: {
      desc: (o) => `A thermometer whose level rises with ${o.label}; the level follows the value you type.`,
      svg: (o) => `<rect x="104" y="20" width="22" height="92" rx="11" class="ig-body"/><circle cx="115" cy="118" r="16" class="ig-fill-a"/><rect x="109" y="${r1(114 - Math.max(4, o.fr * 84))}" width="12" height="${r1(Math.max(4, o.fr * 84))}" class="ig-fill-a" data-ig-level="30 84"/>${[0, 1, 2, 3].map((i) => ln(128, 34 + i * 20, 136, 34 + i * 20)).join('')}${t(70, 70, sym(o, 'T'), 'ig-sym')}`,
      level: true,
    },
    'temp-diff': {
      desc: (o) => `Two thermometers at different levels with the difference between them marked; ${o.label} is that temperature difference.`,
      svg: (o) => `<rect x="70" y="20" width="18" height="96" rx="9" class="ig-body"/><rect x="74" y="70" width="10" height="44" class="ig-fill-a"/><rect x="150" y="20" width="18" height="96" rx="9" class="ig-body"/><rect x="154" y="36" width="10" height="78" class="ig-fill-a"/>${ln(92, 70, 186, 70, 'ig-ghost')}${ln(172, 36, 186, 36, 'ig-ghost')}<g class="ig-draw">${dim(182, 38, 182, 68)}</g>${t(196, 58, sym(o, 'ΔT'), 'ig-sym', 'start')}`,
    },
    expansion: {
      desc: (o) => `A bar growing longer when heated; ${o.label} sets how much length changes for each degree of temperature change.`,
      svg: (o) => `<rect x="40" y="40" width="200" height="22" class="ig-ghost-r"/><rect x="40" y="76" width="200" height="22" class="ig-fill ig-grow-x"/>${dim(240, 110, 272, 110)}${t(256, 128, 'ΔL', 'ig-m')}${t(36, 56, 'cold', 'ig-m', 'end')}${t(36, 92, 'hot', 'ig-m', 'end')}${t(290, 56, sym(o, 'α'), 'ig-sym')}`,
    },
    heat: {
      desc: (o) => `Heat flowing from a hot side to a cold side through a wall or into a material; ${o.label} sets how much heat moves or is stored.`,
      svg: (o) => `<rect x="140" y="26" width="34" height="92" class="ig-body"/>${[44, 72, 100].map((y) => `<g class="ig-push">${arrow(62, y, 132, y)}</g>${arrow(182, y, 236, y, 'ig-b')}`).join('')}${t(62, 20, 'hot', 'ig-m')}${t(236, 20, 'cold', 'ig-m')}${t(157, 138, sym(o, 'q'), 'ig-sym')}`,
    },
    power: {
      desc: (o) => `A motor driving a shaft; ${o.label} is the rate at which it does work, energy per second.`,
      svg: (o) => `<rect x="50" y="42" width="90" height="60" rx="6" class="ig-body"/><path d="M98 50 L84 74 H96 L88 96 L110 68 H98 L106 50 Z" class="ig-fill-a ig-pulse"/>${ln(140, 72, 200, 72, 'ig-shaft')}<g class="ig-spin-s"><rect x="200" y="56" width="10" height="32" class="ig-fill"/></g>${t(256, 58, sym(o, 'P'), 'ig-sym')}`,
    },
    energy: {
      desc: (o) => `A store filling up with energy; ${o.label} is the total amount of work or heat involved.`,
      svg: (o) => `<rect x="70" y="40" width="150" height="56" rx="6" class="ig-body"/><rect x="220" y="58" width="10" height="20" class="ig-body"/><rect x="76" y="46" width="138" height="44" class="ig-fill-a ig-grow-x"/>${t(146, 30, sym(o, 'E'), 'ig-sym')}`,
    },
    electric: {
      desc: (o) => `A simple circuit with a supply and a load; ${o.label} is one of its electrical quantities.`,
      svg: (o) => `<path d="M60 40 H240 V104 H60 Z" class="ig-wire"/>${ln(60, 40, 240, 40, 'ig-flow')}<circle cx="60" cy="72" r="16" class="ig-body"/>${t(60, 77, '~', 'ig-sym')}<rect x="200" y="58" width="80" height="28" rx="4" class="ig-body"/>${t(240, 77, 'load', 'ig-m')}${t(150, 30, sym(o, ''), 'ig-sym')}`,
    },
    frequency: {
      desc: (o) => `A repeating wave with one full cycle marked; ${o.label} counts cycles per unit of time.`,
      svg: (o) => `${ln(30, 72, 290, 72, 'ig-centre')}<path d="M30 72 Q55 22 80 72 T130 72 T180 72 T230 72 T280 72" class="ig-curve ig-draw"/>${dim(30, 112, 130, 112)}${t(80, 130, 'one cycle', 'ig-m')}${t(250, 30, sym(o, 'f'), 'ig-sym')}`,
    },
    sound: {
      desc: (o) => `A sound source sending out pressure waves; ${o.label} is a sound level on the logarithmic decibel scale.`,
      svg: (o) => `<path d="M60 58 H80 L104 38 V106 L80 86 H60 Z" class="ig-body"/>${[22, 40, 58].map((r, i) => `<path d="M${110 + r * 0.4} ${72 - r} A${r} ${r} 0 0 1 ${110 + r * 0.4} ${72 + r}" class="ig-arc ig-wave ig-wave-${i}"/>`).join('')}${t(232, 58, sym(o, 'L'), 'ig-sym')}`,
    },
    time: {
      desc: (o) => `A timeline from a start mark to an end mark; ${o.label} is the time between them.`,
      svg: (o) => `${ln(30, 72, 290, 72, 'ig-ground')}${ln(70, 56, 70, 88, 'ig-a-l')}${ln(250, 56, 250, 88, 'ig-a-l')}<rect x="70" y="66" width="180" height="12" class="ig-fill-a ig-grow-x"/>${t(70, 104, 'start', 'ig-m')}${t(250, 104, 'end', 'ig-m')}${t(160, 46, sym(o, 't'), 'ig-sym')}`,
    },
    rate: {
      desc: (o) => `Items moving past a point on a conveyor; ${o.label} is how many pass in each unit of time.`,
      svg: (o) => `${ln(30, 92, 290, 92, 'ig-ground')}<g class="ig-slide">${[40, 90, 140].map((x) => `<rect x="${x}" y="66" width="26" height="26" rx="3" class="ig-body"/>`).join('')}</g>${ln(220, 40, 220, 100, 'ig-a-l')}${t(220, 32, 'count point', 'ig-m')}${t(80, 40, sym(o, ''), 'ig-sym')}`,
    },
    money: {
      desc: (o) => `A stack of coins and a note representing the money amount ${o.label}.`,
      svg: (o) => `${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="96" cy="${104 - i * 12}" rx="30" ry="8" class="ig-body ig-rise ig-rise-${i}"/>`).join('')}<rect x="150" y="48" width="110" height="52" rx="5" class="ig-fill"/>${t(205, 81, sym(o, '$'), 'ig-sym')}`,
    },
    'unit-cost': {
      desc: (o) => `A price tag on one unit of measure; ${o.label} is the cost for each unit (per hour, per kilogram and so on).`,
      svg: (o) => `<path d="M70 46 H170 L200 72 L170 98 H70 Z" class="ig-fill"/><circle cx="182" cy="72" r="5" class="ig-hole"/>${t(120, 77, sym(o, '$'), 'ig-sym')}${t(250, 60, 'cost for', 'ig-m')}${t(250, 74, 'each unit', 'ig-m')}`,
    },
    percent: {
      desc: (o) => `A bar of 100 parts with the share marked; ${o.label} is that share out of 100. The bar follows the value you type.`,
      svg: (o) => `<rect x="30" y="52" width="260" height="30" class="ig-body"/><rect x="30" y="52" width="${r1(Math.max(1, o.fr * 260))}" height="30" class="ig-fill-a" data-ig-bar="30 260"/>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ln(30 + i * 26, 52, 30 + i * 26, 82, 'ig-tick')).join('')}${t(30, 100, '0 %', 'ig-m', 'start')}${t(290, 100, '100 %', 'ig-m', 'end')}${t(160, 40, sym(o, ''), 'ig-sym')}`,
      bar: true,
    },
    score: {
      desc: (o) => `A scale from the lowest to the highest score with a marker at the chosen score for ${o.label}. The marker follows the slider.`,
      svg: (o) => `${ln(40, 74, 280, 74, 'ig-ground')}${[0, 1, 2, 3, 4].map((i) => ln(40 + i * 60, 66, 40 + i * 60, 82)).join('')}${t(40, 102, short(o.min ?? 1), 'ig-m')}${t(280, 102, short(o.max ?? 5), 'ig-m')}${t(40, 116, 'low', 'ig-m')}${t(280, 116, 'high', 'ig-m')}<g data-ig-mark="40 240" transform="translate(${r1(40 + o.fr * 240)} 0)"><circle cx="0" cy="74" r="9" class="ig-fill-a"/></g>`,
      mark: true,
    },
    number: {
      desc: (o) => `A number line with a marker at the value of ${o.label}, between its lowest and highest accepted values.`,
      svg: (o) => `${ln(40, 74, 280, 74, 'ig-ground')}${t(40, 100, o.min == null ? '' : short(o.min), 'ig-m')}${t(280, 100, o.max == null ? '' : short(o.max), 'ig-m')}<g data-ig-mark="40 240" transform="translate(${r1(40 + o.fr * 240)} 0)"><path d="M0 64 L-7 52 H7 Z" class="ig-fill-a"/></g>${t(160, 44, sym(o, ''), 'ig-sym')}`,
      mark: true,
    },
    choice: {
      desc: (o) => `The options for ${o.label}, with the one currently selected highlighted.`,
      svg: (o) => {
        const opts = (o.options || []).slice(0, 4);
        return `${opts.map((op, i) => `<g data-ig-opt="${esc(op[0])}"${String(op[0]) === String(o.raw) ? ' class="is-on"' : ''}><rect x="30" y="${14 + i * 28}" width="260" height="22" rx="4" class="ig-opt"/>${t(42, 29 + i * 28, clip(op[1], 44), 'ig-m', 'start')}</g>`).join('')}${(o.options || []).length > 4 ? t(290, 134, `+${o.options.length - 4} more`, 'ig-m', 'end') : ''}`;
      },
    },
  };
  const KIND_NAMES = Object.keys(KINDS);

  /** A sensible figure when an entry does not name one; inputs-*.js entries normally name it explicitly. */
  function autoKind(f) {
    const u = f.unit || '', l = f.label.toLowerCase();
    if (f.type === 'select') return 'choice';
    if (f.type === 'range') return 'score';
    if (/diameter|bore\b|Ø/.test(l)) return 'diameter';
    if (/radius/.test(l)) return 'radius';
    if (/thickness/.test(l)) return 'thickness';
    if (/^(mm|m|µm|in|cm|mm or in)$/.test(u)) return u === 'µm' ? 'tolerance' : 'length';
    const map = { '°': 'angle', '%': 'percent', MPa: 'stress', 'N/mm²': 'stress', GPa: 'modulus', N: 'force', kN: 'force', 'N·m': 'torque', bar: 'pressure', kPa: 'pressure', Pa: 'pressure', rpm: 'rotation', kg: 'mass', g: 'mass', 'kg/m³': 'density', 'g/cm³': 'density', '°C': 'temperature', K: 'temp-diff', kW: 'power', W: 'power', s: 'time', min: 'time', h: 'time', hr: 'time', days: 'time', years: 'time', 'm/s': 'velocity', 'm/min': 'velocity', 'mm/s': 'velocity', 'mm/min': 'velocity', 'mm/rev': 'feed', 'L/min': 'flow', 'm³/min': 'flow', 'm³/h': 'flow', cSt: 'viscosity', 'kg·m²': 'inertia', 'mm⁴': 'section', 'N/mm': 'stiffness', teeth: 'teeth', coils: 'coils', turns: 'coils', dB: 'sound', Hz: 'frequency', V: 'electric', A: 'electric', 'm/s²': 'acceleration', kJ: 'energy', J: 'energy', '$': 'money', AUD: 'money', 'mm²': 'area', 'cm²': 'area', 'm²': 'area', 'cm³': 'volume', L: 'volume' };
    if (map[u]) return map[u];
    if (/^(\$|AUD)\//.test(u)) return 'unit-cost';
    if (/µm\/\(?m·K/.test(u)) return 'expansion';
    if (/kJ\/|W\/\(?m²/.test(u)) return 'heat';
    if (/friction/.test(l)) return 'friction';
    if (/factor/.test(l)) return 'factor';
    if (/teeth/.test(l)) return 'teeth';
    if (/number of|count|quantity/.test(l) || ['units', 'items', 'starts'].includes(u)) return 'count';
    return 'number';
  }

  // ---------- Text ----------
  const fmtVal = (v, f) => {
    if (f.type === 'select') return (f.options || []).find((o) => String(o[0]) === String(v))?.[1] ?? String(v ?? '');
    if (v === '' || v == null) return '';
    const u = f.unit || '';
    if (u === '$') return `$${v}`;
    if (u.startsWith('$/')) return `$${v}/${u.slice(2)}`;
    return `${v}${u ? (u === '%' || u === '°' ? '' : ' ') + u : ''}`;
  };
  function formatText(tool, f) {
    if (f.type === 'select') {
      const n = (f.options || []).length;
      return `Choose one of ${n} options from the list: ${(f.options || []).map((o) => o[1]).join('; ')}.`;
    }
    if (f.type === 'range') return `Move the slider to a score from ${f.min} (low) to ${f.max} (high)${f.step && f.step !== 1 ? ` in steps of ${f.step}` : ''}.`;
    const parts = [];
    parts.push(f.unit ? `Enter a number in ${f.unit}: ${unitName(f.unit)}.` : 'Enter a plain number with no unit.');
    // Bounds of a billion or more only stop runaway numbers; they are not limits worth stating.
    const lo = f.min != null && f.min !== '' && Number(f.min) > -1e9, hi = f.max != null && f.max !== '' && Number(f.max) < 1e9;
    const negative = f.min != null && Number(f.min) < 0;
    if (lo && hi) parts.push(`The form accepts ${fmtVal(f.min, f)} to ${fmtVal(f.max, f)}.`);
    else if (lo) parts.push(`The form accepts ${fmtVal(f.min, f)} or more.`);
    else if (hi) parts.push(`The form accepts values up to ${fmtVal(f.max, f)}${negative ? ', including negative values' : ''}.`);
    else if (negative) parts.push('Negative values are accepted.');
    if (f.integer || (f.step === 1 && Number.isInteger(Number(f.default)) && /count|number of|teeth|coils|stations|bolts|passes|starts/i.test(`${f.label} ${f.unit || ''}`))) parts.push('Use a whole number.');
    if (tool.collection === 'MAKEOS') parts.push('Required: the tool does not calculate until every input is valid.');
    return parts.join(' ');
  }
  const exampleText = (f) =>
    f.type === 'select'
      ? `The form opens with “${fmtVal(f.default, f)}” selected as a worked example. Choose the option that matches your case.`
      : `The form opens with ${fmtVal(f.default, f)} as a worked example. It is an illustration, not a recommended value: replace it with your own figure.`;

  /** Shape of one entry in inputs-*.js. Returns a list of problems (empty when the entry is usable). */
  function checkEntry(f, e) {
    const p = [];
    if (!e) return ['no entry'];
    if (e.unclear) return typeof e.unclear === 'string' && e.unclear.length >= 20 ? [] : ['unclear must explain the ambiguity'];
    if (typeof e.what !== 'string' || e.what.trim().length < 30) p.push('what is missing or shorter than 30 characters');
    else {
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (norm(e.what) === norm(f.label) || norm(e.what).replace(/^the /, '') === norm(f.label)) p.push('what only repeats the label');
      if (/^(enter|input|type|this field|this value|the value of)\b/i.test(e.what.trim())) p.push('what starts with a generic instruction instead of a definition');
      if (/lorem|todo|tbd|placeholder/i.test(e.what)) p.push('what contains placeholder text');
      if (e.what.length > 320) p.push('what is longer than 320 characters');
    }
    for (const k of ['tip', 'effect']) if (e[k] != null && (typeof e[k] !== 'string' || e[k].length < 15 || e[k].length > 260)) p.push(`${k} must be 15–260 characters`);
    if (e.fig != null && e.fig !== 'none' && !KINDS[e.fig]) p.push(`unknown fig "${e.fig}"`);
    if (e.sym != null && (typeof e.sym !== 'string' || e.sym.length > 6)) p.push('sym must be at most 6 characters');
    for (const k of Object.keys(e)) if (!['what', 'tip', 'effect', 'fig', 'sym', 'unclear'].includes(k)) p.push(`unknown key ${k}`);
    return p;
  }

  // ---------- Figure state ----------
  /** Position from 0 to 1 of a value inside the field's accepted range (percent fields use 0–100). */
  function fraction(f, v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0.5;
    let lo = Number(f.min), hi = Number(f.max);
    if (f.unit === '%') { lo = 0; hi = Math.max(100, Number.isFinite(hi) ? Math.min(hi, 100) : 100); }
    if (!Number.isFinite(lo)) lo = 0;
    if (!Number.isFinite(hi) || hi <= lo) hi = Math.max(lo + 1, Math.abs(Number(f.default)) * 2 || lo + 1);
    return Math.min(1, Math.max(0, (n - lo) / (hi - lo)));
  }
  /** The figure's value line. On a static page (example) it shows the worked example rather than a typed value. */
  function shownValue(f, v, example = false) {
    const s = fmtVal(v, f);
    const lead = example ? 'Example' : f.type === 'select' ? 'Selected' : 'Your value';
    if (!s) return `${lead}: (empty)`;
    const n = Number(v), out = f.type !== 'select' && Number.isFinite(n) && ((f.min != null && n < f.min) || (f.max != null && n > f.max));
    return `${lead}: ${clip(s, 26)}${out ? ' (out of range)' : ''}`;
  }
  /** Moves the needle, bar, level, marker or highlight of one figure to match the value in its input. */
  function applyValue(svg, f, kind, v) {
    if (!svg) return;
    const k = KINDS[kind] || {};
    const fr = fraction(f, v);
    const txt = svg.querySelector('[data-ig-live]');
    if (txt) { txt.textContent = shownValue(f, v); txt.setAttribute('class', liveClass(txt.textContent)); }
    if (k.bar) for (const el of svg.querySelectorAll('[data-ig-bar]')) { const [, w] = el.getAttribute('data-ig-bar').split(' ').map(Number); el.setAttribute('width', r1(Math.max(1, fr * w))); }
    if (k.level) for (const el of svg.querySelectorAll('[data-ig-level]')) { const [y, h] = el.getAttribute('data-ig-level').split(' ').map(Number); const hh = r1(Math.max(4, fr * h)); el.setAttribute('y', r1(y + h - hh)); el.setAttribute('height', hh); }
    if (k.needle) for (const el of svg.querySelectorAll('[data-ig-needle]')) { const [cx, cy] = el.getAttribute('data-ig-needle').split(' '); el.setAttribute('transform', `rotate(${r1(-135 + fr * 270)} ${cx} ${cy})`); }
    if (k.mark) for (const el of svg.querySelectorAll('[data-ig-mark]')) { const [x0, w] = el.getAttribute('data-ig-mark').split(' ').map(Number); el.setAttribute('transform', `translate(${r1(x0 + fr * w)} 0)`); }
    if (k.angle) for (const el of svg.querySelectorAll('[data-ig-angle]')) { const [cx, cy] = el.getAttribute('data-ig-angle').split(' '); el.setAttribute('transform', `rotate(${-angleOf(v)} ${cx} ${cy})`); }
    if (k.angle) for (const el of svg.querySelectorAll('[data-ig-arc]')) { const [cx, cy, r] = el.getAttribute('data-ig-arc').split(' ').map(Number); el.setAttribute('d', arcPath(cx, cy, r, v)); }
    if (k.count) for (const el of svg.querySelectorAll('[data-ig-count]')) el.setAttribute('class', Number(el.getAttribute('data-ig-count')) < countOf(v, k.count) ? 'ig-fill-a' : 'ig-body');
    for (const el of svg.querySelectorAll('[data-ig-opt]')) el.setAttribute('class', el.getAttribute('data-ig-opt') === String(v) ? 'is-on' : '');
  }

  // ---------- Markup ----------
  function figureHtml(tool, f, e, kind, idBase, value, example) {
    const k = KINDS[kind];
    const o = { label: f.label, sym: e.sym, unit: f.unit, min: f.min, max: f.max, options: f.options, raw: value, fr: fraction(f, value), shown: shownValue(f, value, example) };
    // Every figure shares a footer band: the live value, then the field's own label.
    const foot = `${ln(16, 140, W - 16, 140, 'ig-rule')}${live(160, 156, o)}${t(160, 169, name(o), 'ig-cap')}`;
    return `<figure class="ig-fig"><svg class="ig-svg ig-svg--${kind}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${idBase}-ft ${idBase}-fd" data-ig-kind="${kind}" focusable="false"><title id="${idBase}-ft">Illustration: ${esc(f.label)}</title><desc id="${idBase}-fd">${esc(k.desc(o))}</desc>${k.svg(o)}${foot}</svg></figure>`;
  }
  /**
   * The guide for one input: a native <details> (keyboard, screen-reader and no-JS friendly) placed under the field.
   * opts.value is the value to show in the figure (the input's current value; the default when rendered statically).
   * opts.inputId null renders it for a page without the form (the static tool pages): the label is shown in the
   * summary and the figure shows the worked example.
   */
  function fieldGuide(tool, f, e, opts = {}) {
    if (!e || f.type === 'heading') return '';
    const idBase = `ig-${opts.prefix || ''}${f.key}`;
    if (e.unclear) return `<p class="ig-unclear" id="${idBase}-what">${esc(e.unclear)}</p>`;
    const kind = e.fig === 'none' ? null : e.fig && KINDS[e.fig] ? e.fig : autoKind(f);
    const row = (label, html, id) => `<div class="ig-row"><dt>${label}</dt><dd${id ? ` id="${id}"` : ''}>${html}</dd></div>`;
    const value = opts.value ?? f.default;
    const page = opts.inputId === null;
    return `<details class="ig${kind ? '' : ' ig--text'}${page ? ' ig--page' : ''}"${page ? '' : ` data-ig-for="${esc(opts.inputId || `f-${f.key}`)}"`} data-ig-key="${esc(f.key)}">
<summary class="ig-sum"><span class="ig-sum__icon" aria-hidden="true">?</span><span class="ig-sum__text">What this means<span class="ig-sum__more">: ${esc(clip(f.label, 48))}</span></span></summary>
<div class="ig-panel">${kind ? figureHtml(tool, f, e, kind, idBase, value, page) : ''}<dl class="ig-dl">${row('What it is', esc(e.what), `${idBase}-what`)}${row('Units and format', esc(formatText(tool, f)))}${row('Example', esc(exampleText(f)))}${e.effect ? row('Effect on the result', esc(e.effect)) : ''}${e.tip ? row('Get it right', esc(e.tip)) : ''}</dl></div>
</details>`;
  }

  /** Keeps every figure in a form in step with its input; call again after values are set from code (reset, links). */
  function bind(form, tool) {
    // The form element is reused for every tool, so the listeners read the current tool from the form itself.
    form.__igFields = Object.fromEntries(tool.fields.filter((f) => f.type !== 'heading').map((f) => [f.key, f]));
    const sync = (key) => {
      const f = form.__igFields[key], el = form.querySelector(`[name="${key}"]`);
      const svg = form.querySelector(`details[data-ig-key="${key}"] svg`);
      if (f && el && svg) applyValue(svg, f, svg.getAttribute('data-ig-kind'), el.value);
    };
    if (!form.__igBound) {
      const on = (e) => e.target && e.target.name && sync(e.target.name);
      form.addEventListener('input', on);
      form.addEventListener('change', on);
      form.__igBound = true;
    }
    const all = () => Object.keys(form.__igFields).forEach(sync);
    all();
    return all;
  }

  root.WORKOS_INPUT_GUIDE = { KINDS: KIND_NAMES, UNIT_NAMES, autoKind, checkEntry, fieldGuide, formatText, exampleText, fraction, applyValue, bind, unitName };
})(typeof window !== 'undefined' ? window : globalThis);
