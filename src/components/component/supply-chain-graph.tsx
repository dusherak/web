"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import type { ProductComponent, SupplyChainNode, SupplyChainStage } from "@/data/products";
import { layoutFlow, reachable } from "@/lib/flow-layout";
import { componentHref, nodeAnchor, supplyChainNodeHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NODE_W = 116;
const NODE_H = 66;
const LAYOUT = { nodeWidth: NODE_W, nodeHeight: NODE_H, rowGap: 128, gap: 12, waypointGap: 10, padX: 16, padY: 28 };
/** Below this the graph stops shrinking and scrolls sideways instead. */
const MIN_SCALE = 0.72;
/** Dot speed along the lines, px per second. */
const DOT_SPEED = 70;

/** One hue per stage, in chain order. Muted so the gold highlight still reads as "selected". */
const STAGE_COLORS = ["#b98c62", "#4fb3a9", "#9b8cff", "#5b9cf0", "#67c7e6", "#c9a24b", "#e08a6b", "#f0d68a"];
const stageColor = (i: number) => STAGE_COLORS[i % STAGE_COLORS.length];

type GraphNode = SupplyChainNode & { stageIndex: number; stage: SupplyChainStage };
type Active = { kind: "node"; id: string } | { kind: "stage"; index: number } | null;

/**
 * The supply chain as an interlinked flow graph: inputs fan out, converge into the parts
 * they feed, and run down a trunk to the finished chip. Dots travel every link. Hovering a
 * step traces everything upstream and downstream of it; clicking opens its page.
 */
export function SupplyChainGraph({
  productId,
  component,
  stages,
  feedsInto,
  focusId,
}: {
  productId: string;
  component: ProductComponent;
  stages: SupplyChainStage[];
  feedsInto?: ProductComponent;
  /** Node to highlight on arrival, e.g. when coming back from its page. */
  focusId?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const nodes = useMemo<GraphNode[]>(
    () => stages.flatMap((stage, stageIndex) => stage.nodes.map((n) => ({ ...n, stage, stageIndex }))),
    [stages],
  );
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const layout = useMemo(
    () => layoutFlow(nodes.map((n) => ({ id: n.id, inputs: n.inputs ?? [] })), LAYOUT),
    [nodes],
  );
  const { preds, succs } = useMemo(() => {
    const preds = new Map(nodes.map((n) => [n.id, [] as string[]]));
    const succs = new Map(nodes.map((n) => [n.id, [] as string[]]));
    for (const e of layout.edges) {
      preds.get(e.to)!.push(e.from);
      succs.get(e.from)!.push(e.to);
    }
    return { preds, succs };
  }, [nodes, layout]);

  // --- Highlight state -------------------------------------------------------------------
  const [hover, setHover] = useState<Active>(null);
  const [dismissedFocus, setDismissedFocus] = useState(false);
  const focus = focusId && byId.has(focusId) && !dismissedFocus ? focusId : undefined;
  const active: Active = hover ?? (focus ? { kind: "node", id: focus } : null);
  const activate = (a: Active) => {
    setHover(a);
    if (a) setDismissedFocus(true);
  };

  const activeNodeId = active?.kind === "node" ? active.id : undefined;
  const activeStageIndex = active?.kind === "stage" ? active.index : undefined;
  const lit = useMemo(() => {
    if (activeStageIndex !== undefined) {
      const ids = new Set(nodes.filter((n) => n.stageIndex === activeStageIndex).map((n) => n.id));
      return { nodes: ids, edge: (from: string, to: string) => ids.has(from) || ids.has(to) };
    }
    if (!activeNodeId) return null;
    const upstream = reachable(activeNodeId, preds);
    const downstream = reachable(activeNodeId, succs);
    const self = activeNodeId;
    return {
      nodes: new Set([self, ...upstream, ...downstream]),
      edge: (from: string, to: string) =>
        ((to === self || upstream.has(to)) && upstream.has(from)) ||
        ((from === self || downstream.has(from)) && downstream.has(to)),
    };
  }, [activeNodeId, activeStageIndex, nodes, preds, succs]);

  // --- Fit to width ----------------------------------------------------------------------
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState<number>();
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = frameWidth ? Math.min(1, Math.max(MIN_SCALE, frameWidth / layout.width)) : 1;
  const scrolls = frameWidth !== undefined && layout.width * scale > frameWidth + 1;

  // Bring the focused node into view when arriving from its page.
  useEffect(() => {
    if (!focusId) return;
    document.getElementById(nodeAnchor(focusId))?.scrollIntoView({ block: "center", inline: "center" });
  }, [focusId]);

  const callouts = stages
    .map((s) => ({ text: s.callout, node: s.nodes[0] }))
    .filter((c): c is { text: string; node: SupplyChainNode } => Boolean(c.text && c.node));

  const activeNode = activeNodeId ? byId.get(activeNodeId) : undefined;
  const activeStage = activeStageIndex !== undefined ? stages[activeStageIndex] : undefined;

  return (
    <div className="space-y-6">
      {/* Legend — hover a stage to light up all of its steps */}
      <ul className="flex flex-wrap gap-x-2 gap-y-2" aria-label="Stages">
        {stages.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onMouseEnter={() => activate({ kind: "stage", index: i })}
              onMouseLeave={() => setHover(null)}
              onFocus={() => activate({ kind: "stage", index: i })}
              onBlur={() => setHover(null)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                activeStageIndex === i
                  ? "border-white/30 bg-white/[0.06] text-white"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white/85",
              )}
            >
              <span className="size-2 rounded-full" style={{ background: stageColor(i) }} />
              {s.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Info panel — sticks under the header and tab bar while the graph scrolls past */}
      <div className="sticky top-[7.75rem] z-30 -mx-1 px-1 pt-1">
        <div className="min-h-[92px] rounded-2xl border border-white/[0.08] bg-[#0a0a0b]/90 px-5 py-4 backdrop-blur-md">
          {activeNode ? (
            <InfoNode node={activeNode} inputs={preds.get(activeNode.id)!.length} feeds={succs.get(activeNode.id)!.length} />
          ) : activeStage ? (
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: stageColor(activeStageIndex!) }}>
                Stage · {activeStage.nodes.length} steps
              </p>
              <p className="mt-1 text-[15px] text-white">{activeStage.label}</p>
              <p className="mt-1 text-sm text-white/50">{activeStage.summary}</p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center">
              <p className="text-[15px] text-white/85">
                How {component.name} gets made: {nodes.length} steps across {stages.length} stages.
              </p>
              <p className="mt-1 text-sm text-white/45">
                Hover a step to trace everything that feeds it and everything it feeds. Click to open it.
              </p>
            </div>
          )}
        </div>
      </div>

      {scrolls && (
        <p className="flex items-center gap-2 text-xs text-white/40">
          <MoveHorizontal className="size-3.5" /> Scroll sideways to see the whole chain
        </p>
      )}

      {/* The graph */}
      <div ref={frameRef} className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <div className="mx-auto" style={{ width: layout.width * scale, height: layout.height * scale }}>
          <div
            className="relative origin-top-left"
            style={{ width: layout.width, height: layout.height, transform: `scale(${scale})` }}
            onMouseLeave={() => setHover(null)}
          >
            <svg
              aria-hidden
              width={layout.width}
              height={layout.height}
              className="pointer-events-none absolute inset-0 overflow-visible"
            >
              {layout.edges.map((e, i) => {
                const on = lit?.edge(e.from, e.to);
                const color = stageColor(byId.get(e.from)!.stageIndex);
                return (
                  <path
                    key={`${e.from}-${e.to}`}
                    id={`${uid}-e${i}`}
                    d={e.d}
                    fill="none"
                    stroke={on ? "var(--gold)" : color}
                    strokeWidth={on ? 1.6 : 1.1}
                    strokeOpacity={lit ? (on ? 0.85 : 0.05) : 0.26}
                    className="transition-[stroke-opacity,stroke] duration-300"
                  />
                );
              })}
              {/* Travelling dots — hidden for people who prefer reduced motion */}
              <g className="motion-reduce:hidden">
                {layout.edges.map((e, i) => {
                  const on = lit?.edge(e.from, e.to);
                  if (lit && !on) return null;
                  const color = on ? "#e6c77a" : stageColor(byId.get(e.from)!.stageIndex);
                  const dur = Math.max(1.6, e.length / DOT_SPEED);
                  const count = Math.max(1, Math.round(e.length / 190));
                  return Array.from({ length: count }, (_, k) => {
                    const begin = `-${((k / count) * dur + (i % 7) * 0.37).toFixed(2)}s`;
                    return (
                      <g key={`${i}-${k}`}>
                        <circle r={on ? 6 : 4.5} fill={color} opacity={0.18}>
                          <animateMotion dur={`${dur.toFixed(2)}s`} begin={begin} repeatCount="indefinite">
                            <mpath href={`#${uid}-e${i}`} />
                          </animateMotion>
                        </circle>
                        <circle r={on ? 2.6 : 2} fill={color}>
                          <animateMotion dur={`${dur.toFixed(2)}s`} begin={begin} repeatCount="indefinite">
                            <mpath href={`#${uid}-e${i}`} />
                          </animateMotion>
                        </circle>
                      </g>
                    );
                  });
                })}
              </g>
            </svg>

            {nodes.map((n) => {
              const p = layout.positions.get(n.id)!;
              const isSink = succs.get(n.id)!.length === 0;
              const dim = lit && !lit.nodes.has(n.id);
              const isActive = activeNodeId === n.id;
              return (
                <Link
                  key={n.id}
                  id={nodeAnchor(n.id)}
                  href={supplyChainNodeHref(productId, component.id, n.id)}
                  aria-label={`${n.name}: ${n.summary}`}
                  onMouseEnter={() => activate({ kind: "node", id: n.id })}
                  onFocus={() => activate({ kind: "node", id: n.id })}
                  onBlur={() => setHover(null)}
                  style={{
                    left: p.x - NODE_W / 2,
                    top: p.y - NODE_H / 2,
                    width: NODE_W,
                    height: NODE_H,
                    borderLeftColor: stageColor(n.stageIndex),
                  }}
                  className={cn(
                    "absolute flex scroll-m-40 flex-col justify-between rounded-lg border border-l-2 px-2.5 py-2 text-left",
                    "transition-[opacity,border-color,box-shadow,background-color] duration-300 focus-visible:outline-none",
                    isSink
                      ? "border-gold/70 bg-[#15120a] shadow-[0_0_0_1px_rgb(201_162_75/0.25),0_12px_40px_-12px_rgb(201_162_75/0.7)]"
                      : "border-white/[0.1] bg-[#0b0b0c]",
                    isActive && "border-gold/80 bg-[#14110a] shadow-[0_14px_40px_-16px_rgb(201_162_75/0.8)]",
                    dim ? "opacity-25" : "opacity-100",
                  )}
                >
                  <span className="line-clamp-2 text-[12.5px] leading-[1.2] text-white/90">{n.shortName ?? n.name}</span>
                  <span className="flex items-center justify-between font-mono text-[9.5px] tracking-[0.1em] text-white/35">
                    {isSink ? <span className="text-gold">AI CHIP</span> : <span>{n.companies.length} COS</span>}
                    <ArrowUpRight className="size-3 opacity-60" />
                  </span>
                </Link>
              );
            })}

            {callouts.map((c) => {
              const p = layout.positions.get(c.node.id);
              if (!p) return null;
              return (
                <span
                  key={c.node.id}
                  className={cn(
                    "pointer-events-none absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold/50 bg-[#0b0a07] px-3 py-1 text-[10.5px] tracking-[0.14em] text-gold uppercase transition-opacity duration-300",
                    lit && !lit.nodes.has(c.node.id) && "opacity-25",
                  )}
                  style={{ left: p.x + NODE_W / 2 + 14, top: p.y }}
                >
                  <span aria-hidden className="h-px w-3 bg-gold/60" />
                  {c.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {feedsInto && (
        <Link
          href={componentHref(productId, feedsInto.id)}
          className="group mx-auto flex w-fit items-center gap-3 text-sm text-white/55 transition-colors hover:text-white"
        >
          <span className="text-[11px] tracking-[0.2em] text-white/35 uppercase">Next in the chain</span>
          <span className="text-white/80 transition-colors group-hover:text-gold">{feedsInto.name}</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function InfoNode({ node, inputs, feeds }: { node: GraphNode; inputs: number; feeds: number }) {
  const names = node.companies.slice(0, 4).map((c) => c.name);
  const more = node.companies.length - names.length;
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: stageColor(node.stageIndex) }}>
          {node.stage.label}
          <span className="text-white/30">
            {" "}
            · {inputs} {inputs === 1 ? "input" : "inputs"} · feeds {feeds}
          </span>
        </p>
        <p className="mt-1 text-[15px] text-white">{node.name}</p>
        <p className="mt-1 text-sm text-white/50">{node.summary}</p>
      </div>
      <p className="shrink-0 text-xs leading-relaxed text-white/40 md:max-w-xs md:text-right">
        {names.join(" · ")}
        {more > 0 && ` · +${more} more`}
      </p>
    </div>
  );
}
