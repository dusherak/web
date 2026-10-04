// Generates chip-style SVG placeholders into /public/placeholders.
// Run: node scripts/generate-placeholders.mjs
// Each item gets a deterministic (seeded) variation so they all look related but distinct.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholders");
mkdirSync(OUT, { recursive: true });

const GOLD = "#C9A24B";
const GOLD_LIGHT = "#E6C77A";

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

/** Die interior patterns — the main visual difference between items. */
const patterns = {
  cores(x, y, s, rand) {
    const n = 2 + Math.floor(rand() * 2); // 2x2 or 3x3 cores
    const gap = s * 0.06;
    const cell = (s - gap * (n + 1)) / n;
    let out = "";
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const cx = x + gap + i * (cell + gap);
        const cy = y + gap + j * (cell + gap);
        out += `<rect x="${r1(cx)}" y="${r1(cy)}" width="${r1(cell)}" height="${r1(cell)}" rx="3" fill="url(#core)" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1"/>`;
        // micro-grid inside each core
        const m = 4;
        for (let k = 1; k < m; k++) {
          const o = (cell / m) * k;
          out += `<line x1="${r1(cx + o)}" y1="${r1(cy + 4)}" x2="${r1(cx + o)}" y2="${r1(cy + cell - 4)}" stroke="${GOLD}" stroke-opacity="0.14"/>`;
          out += `<line x1="${r1(cx + 4)}" y1="${r1(cy + o)}" x2="${r1(cx + cell - 4)}" y2="${r1(cy + o)}" stroke="${GOLD}" stroke-opacity="0.14"/>`;
        }
      }
    return out;
  },
  grid(x, y, s, rand) {
    const n = 6 + Math.floor(rand() * 5);
    const cell = s / n;
    let out = "";
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const lit = rand() > 0.72;
        out += `<rect x="${r1(x + i * cell + 2)}" y="${r1(y + j * cell + 2)}" width="${r1(cell - 4)}" height="${r1(cell - 4)}" rx="1.5" fill="${lit ? GOLD : "#1a1a1e"}" fill-opacity="${lit ? 0.5 : 1}"/>`;
      }
    return out;
  },
  rings(x, y, s, rand) {
    const cx = x + s / 2;
    const cy = y + s / 2;
    const n = 4 + Math.floor(rand() * 3);
    let out = "";
    for (let i = 1; i <= n; i++) {
      const rr = (s / 2 - 6) * (i / n);
      out += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(rr)}" fill="none" stroke="${GOLD}" stroke-opacity="${r1(0.15 + 0.5 * (i / n))}" stroke-width="${i === n ? 1.4 : 1}" ${i % 2 ? `stroke-dasharray="${r1(2 + rand() * 6)} 4"` : ""}/>`;
    }
    out += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(s * 0.07)}" fill="${GOLD}" fill-opacity="0.85"/>`;
    return out;
  },
  stripes(x, y, s, rand) {
    const n = 7 + Math.floor(rand() * 5);
    const h = s / n;
    let out = "";
    for (let i = 0; i < n; i++) {
      const w = s * (0.55 + rand() * 0.38);
      out += `<rect x="${r1(x + 6)}" y="${r1(y + i * h + 3)}" width="${r1(w - 12)}" height="${r1(h - 6)}" rx="2" fill="#1a1a1e" stroke="${GOLD}" stroke-opacity="0.35"/>`;
      out += `<circle cx="${r1(x + s - 12)}" cy="${r1(y + i * h + h / 2)}" r="2.2" fill="${GOLD}" fill-opacity="${rand() > 0.4 ? 0.9 : 0.25}"/>`;
    }
    return out;
  },
  waveguide(x, y, s, rand) {
    const n = 5 + Math.floor(rand() * 3);
    let out = "";
    for (let i = 0; i < n; i++) {
      const yy = y + (s / (n + 1)) * (i + 1);
      const amp = 6 + rand() * 10;
      const d = `M ${r1(x + 6)} ${r1(yy)} C ${r1(x + s * 0.3)} ${r1(yy - amp)}, ${r1(x + s * 0.7)} ${r1(yy + amp)}, ${r1(x + s - 6)} ${r1(yy)}`;
      out += `<path d="${d}" fill="none" stroke="${GOLD}" stroke-opacity="${r1(0.3 + rand() * 0.5)}" stroke-width="1.4"/>`;
    }
    return out;
  },
  blocks(x, y, s, rand) {
    // Irregular floorplan of functional blocks
    let out = "";
    const split = (bx, by, bw, bh, depth) => {
      if (depth === 0 || bw < s * 0.18 || bh < s * 0.18) {
        const lit = rand() > 0.7;
        out += `<rect x="${r1(bx + 2)}" y="${r1(by + 2)}" width="${r1(bw - 4)}" height="${r1(bh - 4)}" rx="2" fill="${lit ? "url(#core)" : "#141417"}" stroke="${GOLD}" stroke-opacity="${lit ? 0.6 : 0.22}"/>`;
        return;
      }
      const t = 0.35 + rand() * 0.3;
      if (bw > bh) {
        split(bx, by, bw * t, bh, depth - 1);
        split(bx + bw * t, by, bw * (1 - t), bh, depth - 1);
      } else {
        split(bx, by, bw, bh * t, depth - 1);
        split(bx, by + bh * t, bw, bh * (1 - t), depth - 1);
      }
    };
    split(x, y, s, s, 4);
    return out;
  },
};

function chipSVG({ seed, pattern, pins, die }) {
  const rand = rng(seed);
  const V = 400;
  const pkg = { x: 72, y: 72, s: 256 };
  const dieS = pkg.s * die;
  const dieX = V / 2 - dieS / 2;

  // Pins on all four sides
  let pinsSvg = "";
  const span = pkg.s - 40;
  const step = span / (pins - 1);
  const pinLen = 26;
  for (let i = 0; i < pins; i++) {
    const o = pkg.x + 20 + i * step;
    const w = 5;
    const op = r1(0.75 + rand() * 0.25);
    pinsSvg += `<rect x="${r1(o - w / 2)}" y="${pkg.y - pinLen}" width="${w}" height="${pinLen + 4}" rx="1.2" fill="url(#pin)" opacity="${op}"/>`;
    pinsSvg += `<rect x="${r1(o - w / 2)}" y="${pkg.y + pkg.s - 4}" width="${w}" height="${pinLen + 4}" rx="1.2" fill="url(#pin)" opacity="${op}"/>`;
    pinsSvg += `<rect x="${pkg.x - pinLen}" y="${r1(o - w / 2)}" width="${pinLen + 4}" height="${w}" rx="1.2" fill="url(#pinH)" opacity="${op}"/>`;
    pinsSvg += `<rect x="${pkg.x + pkg.s - 4}" y="${r1(o - w / 2)}" width="${pinLen + 4}" height="${w}" rx="1.2" fill="url(#pinH)" opacity="${op}"/>`;
  }

  // Traces from die edge to package edge, with a 45° jog and a via
  let traces = "";
  const traceCount = 5 + Math.floor(rand() * 5);
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < traceCount; i++) {
      if (rand() < 0.25) continue;
      const t = (i + 0.5) / traceCount;
      const along = dieX + 8 + t * (dieS - 16);
      const jog = (rand() - 0.5) * 28;
      const startOff = dieX; // die edge (top side)
      const endOff = pkg.y + 12; // near package edge
      const mid = (startOff + endOff) / 2;
      // Define in "top side" coordinates, then rotate around centre
      const pts = [
        [along, startOff],
        [along, mid + 6],
        [along + jog, mid - 6],
        [along + jog, endOff],
      ];
      const d = "M " + pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(" L ");
      const end = pts[3];
      traces += `<g transform="rotate(${side * 90} 200 200)"><path d="${d}" fill="none" stroke="${GOLD}" stroke-opacity="${r1(0.25 + rand() * 0.4)}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="${r1(end[0])}" cy="${r1(end[1])}" r="2.4" fill="#0b0b0d" stroke="${GOLD}" stroke-opacity="0.7"/></g>`;
    }
  }

  const inner = patterns[pattern](dieX + 10, dieX + 10, dieS - 20, rand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}" fill="none">
<defs>
  <linearGradient id="pkg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#1c1c20"/><stop offset="1" stop-color="#0a0a0c"/>
  </linearGradient>
  <linearGradient id="die" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#151518"/><stop offset="1" stop-color="#0c0c0e"/>
  </linearGradient>
  <linearGradient id="core" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GOLD}" stop-opacity="0.22"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0.04"/>
  </linearGradient>
  <linearGradient id="pin" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a6d2c"/><stop offset="0.5" stop-color="${GOLD_LIGHT}"/><stop offset="1" stop-color="#8a6d2c"/>
  </linearGradient>
  <linearGradient id="pinH" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8a6d2c"/><stop offset="0.5" stop-color="${GOLD_LIGHT}"/><stop offset="1" stop-color="#8a6d2c"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
</defs>
<circle cx="200" cy="200" r="190" fill="url(#glow)"/>
${pinsSvg}
<rect x="${pkg.x}" y="${pkg.y}" width="${pkg.s}" height="${pkg.s}" rx="16" fill="url(#pkg)" stroke="${GOLD}" stroke-opacity="0.45"/>
<rect x="${pkg.x + 8}" y="${pkg.y + 8}" width="${pkg.s - 16}" height="${pkg.s - 16}" rx="11" stroke="${GOLD}" stroke-opacity="0.12"/>
${traces}
<rect x="${r1(dieX)}" y="${r1(dieX)}" width="${r1(dieS)}" height="${r1(dieS)}" rx="6" fill="url(#die)" stroke="${GOLD}" stroke-opacity="0.75" stroke-width="1.2"/>
${inner}
<circle cx="${pkg.x + 20}" cy="${pkg.y + 20}" r="4" fill="${GOLD}" fill-opacity="0.9"/>
<rect x="${pkg.x}" y="${pkg.y}" width="${pkg.s}" height="${pkg.s}" rx="16" fill="url(#sheen)"/>
</svg>
`;
}

const items = [
  // Products
  { file: "product-ai-chip.svg", seed: 11, pattern: "cores", pins: 14, die: 0.6 },
  { file: "product-data-centre.svg", seed: 23, pattern: "stripes", pins: 10, die: 0.58 },
  { file: "product-optical-interconnect.svg", seed: 37, pattern: "waveguide", pins: 12, die: 0.56 },
  // AI Chip components (file names match the component ids in src/data/products.ts)
  { file: "component-heat-spreader.svg", seed: 101, pattern: "stripes", pins: 12, die: 0.62 },
  { file: "component-thermal-interface.svg", seed: 202, pattern: "waveguide", pins: 10, die: 0.6 },
  { file: "component-compute-die.svg", seed: 303, pattern: "cores", pins: 13, die: 0.62 },
  { file: "component-hbm-memory.svg", seed: 404, pattern: "grid", pins: 11, die: 0.5 },
  { file: "component-interposer.svg", seed: 505, pattern: "blocks", pins: 9, die: 0.58 },
  { file: "component-interconnects.svg", seed: 606, pattern: "rings", pins: 12, die: 0.56 },
  { file: "component-substrate.svg", seed: 707, pattern: "blocks", pins: 14, die: 0.6 },
  { file: "component-solder-balls.svg", seed: 808, pattern: "grid", pins: 10, die: 0.58 },
];

for (const it of items) {
  writeFileSync(join(OUT, it.file), chipSVG(it));
  console.log("wrote", it.file);
}
