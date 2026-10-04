"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product, ProductComponent } from "@/data/products";
import type { resolveComponentContent } from "@/lib/component-content";
import { Media } from "@/components/media";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import {
  OVERVIEW_HASH,
  SUPPLY_CHAIN_HASH,
  type ComponentTab,
  componentHref,
  productSceneBHref,
  tabForHash,
} from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ComponentOverview } from "./component-overview";
import { Section } from "./section";
import { SupplyChainGraph } from "./supply-chain-graph";
import { PendingSupplyChain, SupplyChainTree } from "./supply-chain-tree";

type Content = ReturnType<typeof resolveComponentContent>;

export function ComponentLanding({
  product,
  component,
  content,
}: {
  product: Product;
  component: ProductComponent;
  content: Content;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="relative overflow-x-clip">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[70svh]" />

      <div className="relative mx-auto max-w-6xl px-5 pt-28 pb-28 sm:px-8 md:pt-32">
        {/* Back link — lands on Scene B (components ringed around the chip) */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <Link
            href={productSceneBHref(product.id)}
            className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to {product.name}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          animate="show"
          className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.96 },
              show: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE_OUT } },
            }}
            className="stage-bg relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.07]"
          >
            <div className="absolute inset-[12%]">
              <Media src={component.image} alt={component.name} priority sizes="(min-width: 768px) 420px, 90vw" />
            </div>
            <span className="absolute top-5 left-5 font-mono text-[11px] tracking-[0.2em] text-white/35">
              {pad(content.index + 1)} / {pad(content.total)}
            </span>
          </motion.div>

          <div>
            <motion.p
              variants={fadeUp}
              className="flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-gold uppercase"
            >
              <span className="h-px w-8 bg-gold/60" />
              {product.name} · Component
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-light tracking-[-0.035em] text-white"
            >
              {component.name}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">
              {component.summary}
            </motion.p>
            {content.stats.stages > 0 && (
              <motion.dl variants={fadeUp} className="mt-8 flex gap-8 border-t border-white/[0.08] pt-6">
                {[
                  ["Stages", content.stats.stages],
                  ["Inputs", content.stats.nodes],
                  ["Companies", content.stats.companies],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] tracking-[0.2em] text-white/35 uppercase">{label}</dt>
                    <dd className="mt-1 text-2xl font-light text-white">{value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>
        </motion.header>

        {component.overview ? (
          <TabbedBody product={product} component={component} content={content} />
        ) : (
          <div className="mt-24 space-y-24 md:mt-32 md:space-y-32">
            <Section id={SUPPLY_CHAIN_HASH} index={1} title="Supply chain">
              <SupplyChainBody product={product} component={component} content={content} />
            </Section>

            {component.whyItMatters && (
              <Section index={2} title="Why it matters to investors">
                <p className="max-w-3xl border-l border-gold/60 pl-6 text-xl leading-relaxed font-light text-white/75 md:text-2xl md:leading-relaxed">
                  {component.whyItMatters}
                </p>
              </Section>
            )}
          </div>
        )}

        {/* Prev / next component */}
        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="mt-28 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8"
          aria-label="Other components"
        >
          <div>
            {content.prev && (
              <Link
                href={componentHref(product.id, content.prev.id)}
                className="group inline-flex flex-col gap-1"
              >
                <span className="flex items-center gap-2 text-xs tracking-[0.18em] text-white/35 uppercase">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
                </span>
                <span className="text-white/80 transition-colors group-hover:text-gold">{content.prev.name}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {content.next && (
              <Link
                href={componentHref(product.id, content.next.id)}
                className="group inline-flex flex-col items-end gap-1"
              >
                <span className="flex items-center gap-2 text-xs tracking-[0.18em] text-white/35 uppercase">
                  Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-white/80 transition-colors group-hover:text-gold">{content.next.name}</span>
              </Link>
            )}
          </div>
        </motion.nav>
      </div>
    </main>
  );
}

type BodyProps = { product: Product; component: ProductComponent; content: Content };

/** Flow graph when the chain's nodes are wired together, otherwise the stage-by-stage tree. */
function SupplyChainBody({ product, component, content, focusId }: BodyProps & { focusId?: string }) {
  if (content.supplyChain.length === 0) return <PendingSupplyChain component={component} />;
  const wired = content.supplyChain.some((s) => s.nodes.some((n) => n.inputs?.length));
  return wired ? (
    <SupplyChainGraph
      productId={product.id}
      component={component}
      stages={content.supplyChain}
      feedsInto={content.feedsInto}
      focusId={focusId}
    />
  ) : (
    <SupplyChainTree
      productId={product.id}
      component={component}
      stages={content.supplyChain}
      feedsInto={content.feedsInto}
    />
  );
}

// The open tab lives in the URL hash, so links like "#supply-chain" or "#node-…" (used by
// "back" links on node pages) land on the right tab and survive a refresh.
const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash;
const serverHash = () => "";

const TABS: { id: ComponentTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "supply-chain", label: "Supply chain" },
];

function TabbedBody({ product, component, content }: BodyProps) {
  const hash = useSyncExternalStore(subscribeHash, readHash, serverHash);
  const tab = tabForHash(hash);
  const focusId = hash.startsWith("#node-") ? hash.slice("#node-".length) : undefined;
  const barRef = useRef<HTMLDivElement>(null);

  const select = (next: ComponentTab) => {
    history.replaceState(null, "", `#${next === "overview" ? OVERVIEW_HASH : SUPPLY_CHAIN_HASH}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  // When the tab changes (or the page opens on one), bring the tab bar to the top if it's
  // out of view. Node anchors are left to the graph, which scrolls to the node itself.
  useEffect(() => {
    if (!hash || focusId) return;
    const bar = barRef.current;
    if (!bar) return;
    const top = bar.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) bar.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, focusId]);

  return (
    <div className="mt-20 md:mt-24">
      <div ref={barRef} className="sticky top-16 z-40 -mx-5 scroll-mt-16 bg-[#050505]/85 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div role="tablist" aria-label={`${component.name} sections`} className="flex gap-8 border-b border-white/[0.08]">
          {TABS.map((t) => {
            const selected = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => select(t.id)}
                className={cn(
                  "relative py-4 text-[15px] transition-colors",
                  selected ? "text-white" : "text-white/45 hover:text-white/80",
                )}
              >
                {t.label}
                {selected && (
                  <motion.span
                    layoutId={`tab-underline-${component.id}`}
                    className="absolute inset-x-0 -bottom-px h-px bg-gold"
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={tab}
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="pt-14 md:pt-16"
      >
        {tab === "overview" ? (
          <ComponentOverview
            component={component}
            overview={component.overview!}
            onOpenSupplyChain={() => select("supply-chain")}
          />
        ) : (
          <SupplyChainBody product={product} component={component} content={content} focusId={focusId} />
        )}
      </motion.div>
    </div>
  );
}
