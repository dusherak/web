"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Product } from "@/data/products";
import { EASE_OUT, handoff } from "@/lib/motion";
import { SCENE_B_HASH } from "@/lib/routes";
import { ChipVisual } from "./chip-visual";
import { ComponentRing } from "./component-ring";

/**
 * Scroll-driven product page.
 * A tall track (320svh) holds a sticky full-screen stage. Scroll position through the
 * track is mapped to a single `progress` MotionValue (0 = Scene A, 1 = Scene B) which
 * every element on the stage reads — so scrubbing up and down is perfectly reversible.
 */
export function ProductExplorer({ product }: { product: Product }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [fromHome] = useState(() => handoff.fromHome);
  useEffect(() => {
    handoff.fromHome = false;
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // A light spring smooths out coarse wheel steps while still tracking the scroll position.
  const smooth = useSpring(scrollYProgress, { stiffness: 240, damping: 40, mass: 0.35, restDelta: 0.0005 });
  // Hold Scene A for the first 10% and Scene B for the last 20% of the track.
  const progress = useTransform(reduceMotion ? scrollYProgress : smooth, [0.1, 0.8], [0, 1], {
    clamp: true,
  });

  // Arriving via /product/[id]#components → jump straight to Scene B.
  useLayoutEffect(() => {
    if (window.location.hash !== `#${SCENE_B_HASH}`) return;
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight;
    window.scrollTo({ top, behavior: "instant" });
  }, []);

  return (
    <main>
      <div ref={trackRef} className="relative h-[320svh]">
        {/* Anchor at the scroll position where progress === 1 */}
        <span
          id={SCENE_B_HASH}
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: "calc(100% - 100svh)" }}
        />

        <div className="stage-bg sticky top-0 h-svh overflow-hidden">
          <GridBackdrop progress={progress} />
          <ComponentRing product={product} progress={progress} />

          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <ChipVisual explode={progress} src={product.image} alt={product.name} intro={!fromHome} />
          </div>

          <SceneACopy product={product} progress={progress} fromHome={fromHome} />
          <SceneBCopy product={product} progress={progress} />
          <ProgressRail progress={progress} />
        </div>
      </div>
    </main>
  );
}

function GridBackdrop({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 1], [0.35, 1]);
  return <motion.div aria-hidden style={{ opacity }} className="grid-lines absolute inset-0" />;
}

function SceneACopy({
  product,
  progress,
  fromHome,
}: {
  product: Product;
  progress: MotionValue<number>;
  fromHome: boolean;
}) {
  const opacity = useTransform(progress, [0, 0.3], [1, 0]);
  const y = useTransform(progress, [0, 0.3], [0, -32]);
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const delay = fromHome ? 0.05 : 0.35;

  return (
    <>
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-x-0 top-[max(5.5rem,9svh)] z-30 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay, ease: EASE_OUT }}
          className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase"
        >
          {product.components.length} components inside
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: delay + 0.08, ease: EASE_OUT }}
          className="mt-3 text-[clamp(2.5rem,6vw,4.75rem)] leading-none font-light tracking-[-0.035em] text-white"
        >
          {product.name}
        </motion.h1>
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,4svh)] z-30 flex justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className="flex flex-col items-center gap-3 text-[12px] tracking-[0.14em] text-white/50 uppercase"
        >
          <span>Scroll to take it apart ↓</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-gold"
              animate={{ y: ["-100%", "250%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}

function SceneBCopy({ product, progress }: { product: Product; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.75, 1], [0, 1]);
  const y = useTransform(progress, [0.75, 1], [12, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,3.5svh)] z-30 px-6 text-center"
    >
      <p className="text-[11px] font-medium tracking-[0.28em] text-gold uppercase">
        {product.name} · {product.components.length} components
      </p>
      <p className="mt-2 text-sm text-white/50">Select a component to explore its supply chain</p>
    </motion.div>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const aOpacity = useTransform(progress, [0, 0.5], [1, 0.35]);
  const bOpacity = useTransform(progress, [0.5, 1], [0.35, 1]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-8 z-30 hidden -translate-y-1/2 items-center gap-4 lg:flex"
    >
      <div className="flex h-36 flex-col justify-between text-right font-mono text-[10px] tracking-[0.18em] text-white uppercase">
        <motion.span style={{ opacity: aOpacity }}>Assembled</motion.span>
        <motion.span style={{ opacity: bOpacity }}>Components</motion.span>
      </div>
      <div className="relative h-36 w-px bg-white/10">
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-0 origin-top bg-gold"
        />
      </div>
    </div>
  );
}
