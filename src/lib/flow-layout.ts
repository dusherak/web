/**
 * Layered ("Sugiyama-style") layout for supply-chain flow graphs.
 *
 * Nodes flow top → bottom. Each node sits one tier above the first node it feeds, so inputs
 * hang right above where they are consumed — the graph fans out, converges, fans out
 * again, like the tiers of a tree. Edges that skip tiers are routed through invisible
 * waypoints so lines run through the gaps between cards rather than behind them.
 */

export type FlowNodeInput = { id: string; inputs: string[] };

export type FlowEdge = {
  from: string;
  to: string;
  /** SVG path data, from the bottom of `from` to the top of `to`. */
  d: string;
  /** Approximate path length in px — used to pace the animated dots. */
  length: number;
};

export type FlowLayout = {
  width: number;
  height: number;
  /** Centre of each real node, in px. */
  positions: Map<string, { x: number; y: number }>;
  edges: FlowEdge[];
};

export type FlowLayoutOptions = {
  nodeWidth: number;
  nodeHeight: number;
  /** Centre-to-centre distance between tiers. */
  rowGap: number;
  /** Horizontal gap between neighbouring cards. */
  gap: number;
  /** Horizontal gap next to a waypoint. */
  waypointGap: number;
  padX: number;
  padY: number;
};

type Vertex = { id: string; layer: number; waypoint: boolean };
type Point = { x: number; y: number };

export function layoutFlow(nodes: FlowNodeInput[], o: FlowLayoutOptions): FlowLayout {
  const ids = nodes.map((n) => n.id);
  const known = new Set(ids);
  const preds = new Map(ids.map((id) => [id, [] as string[]]));
  const succs = new Map(ids.map((id) => [id, [] as string[]]));
  for (const n of nodes) {
    for (const i of n.inputs) {
      if (!known.has(i) || i === n.id) continue;
      preds.get(n.id)!.push(i);
      succs.get(i)!.push(n.id);
    }
  }

  // --- 1. Tiers --------------------------------------------------------------------------
  const order = topoOrder(ids, preds, succs);
  const layer = new Map<string, number>();
  for (const id of order) layer.set(id, Math.max(0, ...preds.get(id)!.map((p) => (layer.get(p) ?? 0) + 1)));
  // Pull every node down to sit directly above the first node it feeds.
  for (const id of [...order].reverse()) {
    const s = succs.get(id)!;
    if (s.length) layer.set(id, Math.min(...s.map((c) => layer.get(c)!)) - 1);
  }
  const minLayer = Math.min(...layer.values());
  for (const [id, l] of layer) layer.set(id, l - minLayer);
  const layerCount = Math.max(...layer.values()) + 1;

  // --- 2. Waypoints for edges that skip tiers ---------------------------------------------
  const verts = new Map<string, Vertex>(ids.map((id) => [id, { id, layer: layer.get(id)!, waypoint: false }]));
  const up = new Map<string, string[]>(ids.map((id) => [id, []]));
  const down = new Map<string, string[]>(ids.map((id) => [id, []]));
  const chains: { from: string; to: string; path: string[] }[] = [];

  for (const id of order) {
    for (const p of preds.get(id)!) {
      const path = [p];
      for (let l = layer.get(p)! + 1; l < layer.get(id)!; l++) {
        const w = `${p}→${id}#${l}`;
        verts.set(w, { id: w, layer: l, waypoint: true });
        up.set(w, []);
        down.set(w, []);
        path.push(w);
      }
      path.push(id);
      for (let k = 0; k < path.length - 1; k++) {
        down.get(path[k])!.push(path[k + 1]);
        up.get(path[k + 1])!.push(path[k]);
      }
      chains.push({ from: p, to: id, path });
    }
  }

  // --- 3. Order within tiers (barycentre sweeps, keep the fewest crossings) ---------------
  let layers: string[][] = Array.from({ length: layerCount }, () => []);
  for (const id of ids) layers[layer.get(id)!].push(id);
  for (const v of verts.values()) if (v.waypoint) layers[v.layer].push(v.id);

  const indexOf = (ls: string[][]) => {
    const m = new Map<string, number>();
    for (const l of ls) l.forEach((id, i) => m.set(id, i));
    return m;
  };
  const sortBy = (layerIds: string[], nbrs: Map<string, string[]>, pos: Map<string, number>) =>
    layerIds
      .map((id, i) => {
        const ns = nbrs.get(id)!;
        const b = ns.length ? ns.reduce((a, n) => a + pos.get(n)!, 0) / ns.length : i;
        return { id, b, i };
      })
      .sort((a, z) => a.b - z.b || a.i - z.i)
      .map((e) => e.id);

  let best = layers.map((l) => [...l]);
  let bestCrossings = countCrossings(layers, down);
  for (let iter = 0; iter < 24; iter++) {
    const pos = indexOf(layers);
    if (iter % 2 === 0) {
      for (let l = 1; l < layerCount; l++) {
        layers[l] = sortBy(layers[l], up, pos);
        layers[l].forEach((id, i) => pos.set(id, i));
      }
    } else {
      for (let l = layerCount - 2; l >= 0; l--) {
        layers[l] = sortBy(layers[l], down, pos);
        layers[l].forEach((id, i) => pos.set(id, i));
      }
    }
    const c = countCrossings(layers, down);
    if (c < bestCrossings) {
      bestCrossings = c;
      best = layers.map((l) => [...l]);
    }
  }
  layers = best;

  // --- 4. Horizontal positions (pull towards neighbours, keep order and spacing) ----------
  const widthOf = (id: string) => (verts.get(id)!.waypoint ? 0 : o.nodeWidth);
  const sep = (a: string, b: string) =>
    (widthOf(a) + widthOf(b)) / 2 + (verts.get(a)!.waypoint || verts.get(b)!.waypoint ? o.waypointGap : o.gap);

  const x = new Map<string, number>();
  for (const l of layers) {
    let cursor = 0;
    l.forEach((id, i) => {
      if (i > 0) cursor += sep(l[i - 1], id);
      x.set(id, cursor);
    });
    const shift = cursor / 2;
    for (const id of l) x.set(id, x.get(id)! - shift);
  }

  // Each neighbour pulls with a weight equal to how much of the chain sits behind it, so the
  // main trunk stays straight and small side inputs bend towards it rather than the reverse.
  const upstreamMass = new Map(ids.map((id) => [id, 1 + reachable(id, preds).size]));
  const downstreamMass = new Map(ids.map((id) => [id, 1 + reachable(id, succs).size]));
  const chainOf = new Map<string, { from: string; to: string }>();
  for (const c of chains) for (const w of c.path.slice(1, -1)) chainOf.set(w, c);
  // As a neighbour above, a waypoint stands in for its chain's source; below, for its target.
  const massAbove = (v: string) => upstreamMass.get(chainOf.get(v)?.from ?? v)!;
  const massBelow = (v: string) => downstreamMass.get(chainOf.get(v)?.to ?? v)!;

  // Each tier is placed as close as possible to where its nodes want to be, keeping order
  // and spacing, with heavier nodes moving less. Shifting each node by the spacing to its
  // left turns this into weighted isotonic regression, solved exactly by pool-adjacent-
  // violators.
  const weight = (v: string): number => {
    const c = chainOf.get(v);
    return c ? Math.max(weight(c.from), weight(c.to)) : upstreamMass.get(v)! + downstreamMass.get(v)!;
  };
  const place = (l: string[], desired: number[]) => {
    const offset = [0];
    for (let i = 1; i < l.length; i++) offset.push(offset[i - 1] + sep(l[i - 1], l[i]));
    const blocks: { v: number; w: number; n: number }[] = [];
    l.forEach((id, i) => {
      blocks.push({ v: desired[i] - offset[i], w: weight(id), n: 1 });
      while (blocks.length > 1 && blocks[blocks.length - 2].v > blocks[blocks.length - 1].v) {
        const b = blocks.pop()!;
        const a = blocks.pop()!;
        blocks.push({ v: (a.v * a.w + b.v * b.w) / (a.w + b.w), w: a.w + b.w, n: a.n + b.n });
      }
    });
    let i = 0;
    for (const b of blocks) for (let k = 0; k < b.n; k++, i++) x.set(l[i], b.v + offset[i]);
  };
  const mean = (ns: string[], mass: (v: string) => number) => {
    let sum = 0;
    let total = 0;
    for (const n of ns) {
      sum += x.get(n)! * mass(n);
      total += mass(n);
    }
    return sum / total;
  };

  for (let iter = 0; iter < 40; iter++) {
    const downward = iter % 2 === 0;
    const range = downward ? [...layers.keys()] : [...layers.keys()].reverse();
    for (const li of range) {
      const l = layers[li];
      const desired = l.map((id) => {
        const above = up.get(id)!;
        const below = down.get(id)!;
        const a = above.length ? mean(above, massAbove) : undefined;
        const b = below.length ? mean(below, massBelow) : undefined;
        if (a !== undefined && b !== undefined) return downward ? 0.65 * a + 0.35 * b : 0.35 * a + 0.65 * b;
        return a ?? b ?? x.get(id)!;
      });
      place(l, desired);
    }
  }

  // --- 5. Normalise into px ---------------------------------------------------------------
  let minX = Infinity;
  let maxX = -Infinity;
  for (const [id, v] of x) {
    minX = Math.min(minX, v - widthOf(id) / 2);
    maxX = Math.max(maxX, v + widthOf(id) / 2);
  }
  const px = (id: string) => x.get(id)! - minX + o.padX;
  const py = (id: string) => o.padY + o.nodeHeight / 2 + verts.get(id)!.layer * o.rowGap;

  const positions = new Map(ids.map((id) => [id, { x: px(id), y: py(id) }]));

  // --- 6. Edge paths, with ports fanned across each card's top and bottom ------------------
  const outPort = new Map<string, number>();
  const inPort = new Map<string, number>();
  const fan = (list: { key: string; x: number }[], into: Map<string, number>) => {
    list.sort((a, b) => a.x - b.x);
    const k = list.length;
    const step = k > 1 ? Math.min(12, (o.nodeWidth * 0.7) / (k - 1)) : 0;
    list.forEach((e, i) => into.set(e.key, (i - (k - 1) / 2) * step));
  };
  const chainKey = (c: { from: string; to: string }) => `${c.from}→${c.to}`;
  for (const id of ids) {
    fan(
      chains.filter((c) => c.from === id).map((c) => ({ key: chainKey(c), x: px(c.path[1]) })),
      outPort,
    );
    fan(
      chains.filter((c) => c.to === id).map((c) => ({ key: chainKey(c), x: px(c.path[c.path.length - 2]) })),
      inPort,
    );
  }

  const half = o.nodeHeight / 2;
  const edges: FlowEdge[] = chains.map((c) => {
    const key = chainKey(c);
    const pts: { p: Point; through?: boolean }[] = [];
    pts.push({ p: { x: px(c.from) + outPort.get(key)!, y: py(c.from) + half } });
    for (const w of c.path.slice(1, -1)) {
      pts.push({ p: { x: px(w), y: py(w) - half } });
      pts.push({ p: { x: px(w), y: py(w) + half }, through: true });
    }
    pts.push({ p: { x: px(c.to) + inPort.get(key)!, y: py(c.to) - half } });

    let d = `M${r(pts[0].p.x)},${r(pts[0].p.y)}`;
    let length = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1].p;
      const b = pts[i].p;
      const chord = Math.hypot(b.x - a.x, b.y - a.y);
      if (pts[i].through) {
        d += ` L${r(b.x)},${r(b.y)}`;
        length += chord;
      } else {
        const my = (a.y + b.y) / 2;
        d += ` C${r(a.x)},${r(my)} ${r(b.x)},${r(my)} ${r(b.x)},${r(b.y)}`;
        length += chord * 1.12;
      }
    }
    return { from: c.from, to: c.to, d, length };
  });

  return {
    width: maxX - minX + o.padX * 2,
    height: o.padY * 2 + o.nodeHeight + (layerCount - 1) * o.rowGap,
    positions,
    edges,
  };
}

const r = (n: number) => Math.round(n * 10) / 10;

/** Every node reachable from `start` by following `next` (excluding `start` itself). */
export function reachable(start: string, next: Map<string, string[]>) {
  const seen = new Set<string>();
  const stack = [start];
  while (stack.length) {
    for (const n of next.get(stack.pop()!) ?? []) {
      if (seen.has(n)) continue;
      seen.add(n);
      stack.push(n);
    }
  }
  return seen;
}

function topoOrder(ids: string[], preds: Map<string, string[]>, succs: Map<string, string[]>) {
  const indeg = new Map(ids.map((id) => [id, preds.get(id)!.length]));
  const queue = ids.filter((id) => indeg.get(id) === 0);
  const out: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    out.push(id);
    for (const s of succs.get(id)!) {
      indeg.set(s, indeg.get(s)! - 1);
      if (indeg.get(s) === 0) queue.push(s);
    }
  }
  // A cycle would be a data error; fall back to data order for whatever is left.
  for (const id of ids) if (!out.includes(id)) out.push(id);
  return out;
}

function countCrossings(layers: string[][], down: Map<string, string[]>) {
  let total = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    const below = new Map(layers[l + 1].map((id, i) => [id, i]));
    const segs: [number, number][] = [];
    layers[l].forEach((id, i) => {
      for (const t of down.get(id)!) segs.push([i, below.get(t)!]);
    });
    for (let a = 0; a < segs.length; a++)
      for (let b = a + 1; b < segs.length; b++)
        if ((segs[a][0] - segs[b][0]) * (segs[a][1] - segs[b][1]) < 0) total++;
  }
  return total;
}
