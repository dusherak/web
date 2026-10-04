"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProductComponent, SupplyChainNode, SupplyChainStage } from "@/data/products";
import { PLACEHOLDER_STAGES } from "@/lib/component-content";
import { EASE_OUT } from "@/lib/motion";
import { componentHref, stageAnchor, supplyChainNodeHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/**
 * Vertical tree: the component is the root, a gold trunk runs down through every stage
 * (upstream → downstream), and each stage branches into clickable nodes.
 */
export function SupplyChainTree({
  productId,
  component,
  stages,
  feedsInto,
}: {
  productId: string;
  component: ProductComponent;
  stages: SupplyChainStage[];
  feedsInto?: ProductComponent;
}) {
  return (
    <div>
      <Root name={component.name} />
      <ol className="relative">
        <Trunk />
        {stages.map((stage, i) => (
          <Stage key={stage.id} productId={productId} componentId={component.id} stage={stage} index={i} />
        ))}
        {feedsInto && <Handoff productId={productId} target={feedsInto} />}
      </ol>
    </div>
  );
}

/** Same skeleton, greyed out, for components whose chain hasn't been mapped yet. */
export function PendingSupplyChain({ component }: { component: ProductComponent }) {
  return (
    <div>
      <Root name={component.name} />
      <ol className="relative">
        <Trunk muted />
        {PLACEHOLDER_STAGES.map((label, i) => (
          <li key={label} className="relative pt-8 pl-9 md:pl-14">
            <StageDot muted />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">{pad(i + 1)}</span>
              <span className="text-lg font-light text-white/40">{label}</span>
              <span className="rounded-full border border-dashed border-white/15 px-3 py-1 text-[11px] tracking-[0.14em] text-white/35 uppercase">
                Mapping in progress
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Root({ name }: { name: string }) {
  return (
    <div className="relative z-10 inline-flex items-center gap-3 rounded-full border border-gold/60 bg-gold/[0.08] py-2 pr-5 pl-2 shadow-[0_0_0_1px_rgb(201_162_75/0.12),0_18px_50px_-22px_rgb(201_162_75/0.7)]">
      <span className="grid size-7 place-items-center rounded-full border border-gold/70">
        <span className="size-2 rounded-[3px] bg-gold" />
      </span>
      <span className="text-[15px] text-white">{name}</span>
      <span className="hidden font-mono text-[10px] tracking-[0.2em] text-gold/80 uppercase sm:inline">
        · Supply chain
      </span>
    </div>
  );
}

/** The vertical spine everything hangs off. Aligned to the centre of the root badge's icon. */
function Trunk({ muted }: { muted?: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease: EASE_OUT }}
      className={cn(
        "absolute top-0 bottom-6 left-[21.5px] w-px origin-top",
        muted ? "bg-white/10" : "bg-gradient-to-b from-gold/70 via-gold/35 to-gold/10",
      )}
    />
  );
}

function StageDot({ muted }: { muted?: boolean }) {
  return (
    <span aria-hidden className="absolute top-[2.35rem] left-[17px] flex items-center">
      <span
        className={cn(
          "size-[10px] rounded-full border",
          muted ? "border-white/20 bg-[#050505]" : "border-gold bg-[#050505] shadow-[0_0_12px_rgb(201_162_75/0.6)]",
        )}
      />
      <span className={cn("h-px w-4 md:w-8", muted ? "bg-white/10" : "bg-gold/40")} />
    </span>
  );
}

function Stage({
  productId,
  componentId,
  stage,
  index,
}: {
  productId: string;
  componentId: string;
  stage: SupplyChainStage;
  index: number;
}) {
  return (
    <motion.li
      id={stageAnchor(stage.id)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      className="relative scroll-mt-28 pt-8 pl-9 md:pl-14"
    >
      <StageDot />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10">
        <motion.header variants={item} className="lg:pt-0.5">
          <p className="font-mono text-[11px] tracking-[0.2em] text-gold">
            {pad(index + 1)} <span className="text-white/30">· {stage.nodes.length} inputs</span>
          </p>
          <h3 className="mt-2 text-xl font-light tracking-tight text-white md:text-2xl">{stage.label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/45">{stage.summary}</p>
          {stage.callout && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/[0.08] px-3 py-1 text-[11px] tracking-[0.14em] text-gold uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              {stage.callout}
            </p>
          )}
        </motion.header>

        <ul className="relative space-y-2.5 border-l border-white/[0.08] pl-5 md:pl-6">
          {stage.nodes.map((node) => (
            <NodeRow
              key={node.id}
              node={node}
              href={supplyChainNodeHref(productId, componentId, node.id)}
            />
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

function NodeRow({ node, href }: { node: SupplyChainNode; href: string }) {
  const names = node.companies.map((c) => c.name);
  return (
    <motion.li variants={item} className="relative">
      {/* branch tick from the stage's vertical line */}
      <span aria-hidden className="absolute top-1/2 -left-5 h-px w-5 bg-white/[0.08] md:-left-6 md:w-6" />
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.015] px-4 py-3.5 md:px-5 md:py-4",
          "transition-[border-color,background-color,box-shadow] duration-500",
          "hover:border-gold/50 hover:bg-gold/[0.035] hover:shadow-[0_18px_50px_-28px_rgb(201_162_75/0.6)]",
          "focus-visible:border-gold/70 focus-visible:outline-none",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-white/90 transition-colors group-hover:text-white">{node.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-white/45">{node.summary}</p>
          <p className="mt-2 truncate text-xs text-white/30">{names.join(" · ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white/45 transition-colors group-hover:border-gold/40 group-hover:text-gold sm:inline">
            {node.companies.length} COS
          </span>
          <ArrowUpRight className="size-4 text-white/30 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
        </div>
      </Link>
    </motion.li>
  );
}

function Handoff({ productId, target }: { productId: string; target: ProductComponent }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="relative pt-10 pl-9 md:pl-14"
    >
      <span aria-hidden className="absolute top-[3.1rem] left-[17px] size-[10px] rotate-45 border border-gold bg-gold/30" />
      <Link
        href={componentHref(productId, target.id)}
        className="group inline-flex items-center gap-3 text-sm text-white/55 transition-colors hover:text-white"
      >
        <span className="text-[11px] tracking-[0.2em] text-white/35 uppercase">Next in the chain</span>
        <span className="text-white/80 transition-colors group-hover:text-gold">{target.name}</span>
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </motion.li>
  );
}
