"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentOverview as Overview, ProductComponent } from "@/data/products";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Section } from "./section";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-09-30" → "30 Sep 2026", without going through Date (no timezone drift). */
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};
const list = (stagger = 0.07) => ({
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-10% 0px" },
  variants: { hidden: {}, show: { transition: { staggerChildren: stagger } } },
});

/** General-knowledge tab: what the part is, how it's made, who makes it, and recent news. */
export function ComponentOverview({
  component,
  overview,
  onOpenSupplyChain,
}: {
  component: ProductComponent;
  overview: Overview;
  onOpenSupplyChain: () => void;
}) {
  let n = 0;
  return (
    <div className="space-y-24 md:space-y-28">
      <Section index={++n} title="What it is">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="space-y-5">
            {overview.intro.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "max-w-2xl leading-relaxed",
                  i === 0 ? "text-xl font-light text-white/80 md:text-2xl md:leading-relaxed" : "text-base text-white/55 md:text-lg",
                )}
              >
                {p}
              </p>
            ))}
          </div>
          <motion.dl {...list()} className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
            {overview.facts.map((f) => (
              <motion.div key={f.label} variants={rise} className="bg-[#070707] p-5">
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-3xl font-light tracking-tight text-white">{f.value}</dd>
                <dd className="mt-2 text-xs leading-snug text-white/45">{f.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </Section>

      <Section index={++n} title="How it's made">
        <motion.ol {...list(0.1)} className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute top-[11px] right-0 left-0 hidden h-px bg-gradient-to-r from-gold/60 via-gold/30 to-gold/10 md:block" />
          {overview.process.map((step, i) => (
            <motion.li key={step.title} variants={rise} className="relative">
              <span className="relative z-10 grid size-6 place-items-center rounded-full border border-gold bg-[#050505] font-mono text-[10px] text-gold">
                {i + 1}
              </span>
              <p className="mt-4 text-[15px] text-white">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{step.detail}</p>
            </motion.li>
          ))}
        </motion.ol>
        <button
          type="button"
          onClick={onOpenSupplyChain}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/[0.08]"
        >
          See every input in the supply chain
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </Section>

      <Section index={++n} title="Generations">
        <motion.ol {...list(0.06)} className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {overview.generations.map((g) => (
            <motion.li
              key={g.name}
              variants={rise}
              className={cn(
                "rounded-xl border p-4",
                g.current ? "border-gold/60 bg-gold/[0.06]" : "border-white/[0.08] bg-white/[0.015]",
              )}
            >
              <p className={cn("font-mono text-[11px] tracking-[0.14em]", g.current ? "text-gold" : "text-white/35")}>
                {g.year}
                {g.current && " · NOW"}
              </p>
              <p className="mt-2 text-lg font-light text-white">{g.name}</p>
              <p className="mt-2 text-xs leading-snug text-white/45">{g.detail}</p>
            </motion.li>
          ))}
        </motion.ol>
      </Section>

      <Section index={++n} title="Who makes it">
        <motion.ul {...list(0.1)} className="grid gap-4 md:grid-cols-3">
          {overview.makers.map((m) => (
            <motion.li key={m.company.name} variants={rise} className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[17px] text-white">{m.company.name}</p>
                <p className="font-mono text-[11px] tracking-[0.12em] text-gold">{m.company.ticker ?? "PRIVATE"}</p>
              </div>
              {m.share && (
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] tracking-[0.18em] text-white/35 uppercase">Market share</span>
                    <span className="text-2xl font-light text-white">{m.share}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
                      className="h-full origin-left rounded-full bg-gold"
                      style={{ width: m.share }}
                    />
                  </div>
                </div>
              )}
              <p className="mt-5 text-sm leading-relaxed text-white/50">{m.detail}</p>
            </motion.li>
          ))}
        </motion.ul>
        {overview.shareSource && (
          <p className="mt-4 text-xs text-white/35">
            Share source:{" "}
            <a href={overview.shareSource.url} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white/70">
              {overview.shareSource.label}
            </a>
          </p>
        )}
      </Section>

      <Section index={++n} title="Recent news">
        <p className="-mt-6 mb-8 text-xs tracking-[0.14em] text-white/35 uppercase md:-mt-8">
          As of {formatDate(overview.newsAsOf)}
        </p>
        <motion.ul {...list(0.06)} className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {overview.news.map((item) => (
            <motion.li key={item.url} variants={rise}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-2 py-6 transition-colors md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-8"
              >
                <div className="text-xs text-white/40">
                  <p className="font-mono tracking-[0.08em] text-white/60">{formatDate(item.date)}</p>
                  <p className="mt-1">{item.source}</p>
                </div>
                <div>
                  <p className="text-[17px] text-white/90 transition-colors group-hover:text-white">{item.title}</p>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-white/50">{item.summary}</p>
                </div>
                <ArrowUpRight className="hidden size-4 text-white/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold md:block" />
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {component.whyItMatters && (
        <Section index={++n} title="Why it matters to investors">
          <p className="max-w-3xl border-l border-gold/60 pl-6 text-xl leading-relaxed font-light text-white/75 md:text-2xl md:leading-relaxed">
            {component.whyItMatters}
          </p>
        </Section>
      )}
    </div>
  );
}
