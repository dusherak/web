"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Product, ProductComponent, SupplyChainNode, SupplyChainStage } from "@/data/products";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { supplyChainGraphNodeHref, supplyChainHref, supplyChainNodeHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Section } from "./section";
import { CompanyGrid } from "./company-grid";

const pad = (n: number) => String(n).padStart(2, "0");

export function SupplyChainNodePage({
  product,
  component,
  stage,
  stageIndex,
  node,
}: {
  product: Product;
  component: ProductComponent;
  stage: SupplyChainStage;
  stageIndex: number;
  node: SupplyChainNode;
}) {
  const stages = component.supplyChain ?? [];
  const siblings = stage.nodes.filter((n) => n.id !== node.id);

  // Prev / next walk the whole chain in order, crossing stage boundaries.
  const flat = stages.flatMap((s) => s.nodes);
  const at = flat.findIndex((n) => n.id === node.id);
  const prev = flat[at - 1];
  const next = flat[at + 1];
  const nodeHref = (id: string) => supplyChainNodeHref(product.id, component.id, id);

  // Wired chains (drawn as a flow graph) also show what feeds this step and what it feeds.
  const wired = flat.some((n) => n.inputs?.length);
  const comesFrom = flat.filter((n) => node.inputs?.includes(n.id));
  const feedsInto = flat.filter((n) => n.inputs?.includes(node.id));
  const backHref = wired
    ? supplyChainGraphNodeHref(product.id, component.id, node.id)
    : supplyChainHref(product.id, component.id, stage.id);
  let section = 0;

  return (
    <main className="relative overflow-x-clip">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[60svh]" />

      <div className="relative mx-auto max-w-6xl px-5 pt-28 pb-28 sm:px-8 md:pt-32">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to {component.name} supply chain
          </Link>
        </motion.div>

        <motion.header variants={stagger(0.08, 0.05)} initial="hidden" animate="show" className="mt-10 md:mt-14">
          <motion.p
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-gold uppercase"
          >
            <span className="h-px w-8 bg-gold/60" />
            {component.name} · {pad(stageIndex + 1)} {stage.label}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-light tracking-[-0.035em] text-white"
          >
            {node.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">
            {node.description}
          </motion.p>

          {/* Where this node sits: every stage of the chain, this one lit */}
          <motion.nav variants={fadeUp} aria-label="Supply chain stages" className="mt-10">
            <ol className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {stages.map((s, i) => {
                const current = s.id === stage.id;
                return (
                  <li key={s.id} className="flex shrink-0 items-center gap-2">
                    {i > 0 && <span aria-hidden className="h-px w-3 bg-white/15" />}
                    <Link
                      href={current ? supplyChainHref(product.id, component.id, s.id) : nodeHref(s.nodes[0].id)}
                      aria-current={current ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                        current
                          ? "border-gold/70 bg-gold/[0.08] text-white"
                          : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/80",
                      )}
                    >
                      <span className={cn("font-mono text-[10px]", current ? "text-gold" : "text-white/30")}>
                        {pad(i + 1)}
                      </span>
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </motion.nav>
        </motion.header>

        <div className="mt-20 space-y-24 md:mt-24 md:space-y-28">
          <Section index={++section} title={`Major companies · ${node.companies.length}`}>
            <CompanyGrid companies={node.companies} />
          </Section>

          {wired && (comesFrom.length > 0 || feedsInto.length > 0) && (
            <Section index={++section} title="How it connects">
              <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                <FlowList title="Comes from" empty="A starting input — nothing upstream in this chain." nodes={comesFrom} stages={stages} href={nodeHref} />
                <FlowList title="Flows into" empty="The end of this chain." nodes={feedsInto} stages={stages} href={nodeHref} />
              </div>
            </Section>
          )}

          {siblings.length > 0 && (
            <Section index={++section} title={`Also in ${stage.label.toLowerCase()}`}>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={nodeHref(s.id)}
                      className="group flex h-full items-start justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-5 transition-[border-color,background-color] duration-500 hover:border-gold/50 hover:bg-gold/[0.03]"
                    >
                      <div>
                        <p className="text-[15px] text-white/90 group-hover:text-white">{s.name}</p>
                        <p className="mt-1 text-sm leading-snug text-white/45">{s.summary}</p>
                      </div>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-white/30 transition-colors group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="mt-28 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8"
          aria-label="Adjacent supply-chain inputs"
        >
          <div>
            {prev && (
              <Link href={nodeHref(prev.id)} className="group inline-flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs tracking-[0.18em] text-white/35 uppercase">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
                </span>
                <span className="text-white/80 transition-colors group-hover:text-gold">{prev.name}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={nodeHref(next.id)} className="group inline-flex flex-col items-end gap-1">
                <span className="flex items-center gap-2 text-xs tracking-[0.18em] text-white/35 uppercase">
                  Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-white/80 transition-colors group-hover:text-gold">{next.name}</span>
              </Link>
            )}
          </div>
        </motion.nav>
      </div>
    </main>
  );
}

function FlowList({
  title,
  empty,
  nodes,
  stages,
  href,
}: {
  title: string;
  empty: string;
  nodes: SupplyChainNode[];
  stages: SupplyChainStage[];
  href: (id: string) => string;
}) {
  const stageOf = (id: string) => stages.find((s) => s.nodes.some((n) => n.id === id));
  return (
    <div>
      <p className="mb-4 text-[11px] tracking-[0.2em] text-white/40 uppercase">
        {title} <span className="text-white/25">· {nodes.length}</span>
      </p>
      {nodes.length === 0 ? (
        <p className="text-sm text-white/40">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {nodes.map((n) => (
            <li key={n.id}>
              <Link
                href={href(n.id)}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.015] px-4 py-3 transition-[border-color,background-color] duration-500 hover:border-gold/50 hover:bg-gold/[0.03]"
              >
                <div className="min-w-0">
                  <p className="text-[15px] text-white/90 group-hover:text-white">{n.name}</p>
                  <p className="mt-0.5 text-xs text-white/40">{stageOf(n.id)?.label}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-white/30 transition-colors group-hover:text-gold" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
