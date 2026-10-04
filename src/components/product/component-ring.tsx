"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import type { Product, ProductComponent } from "@/data/products";
import { Media } from "@/components/media";
import { componentHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CHIP_SCENE_B_SCALE } from "./chip-visual";

type Size = { w: number; h: number };

type Slot = {
  dx: number; // card centre offset from stage centre at progress = 1
  dy: number;
  ux: number; // unit direction
  uy: number;
};

type Geometry = {
  cx: number;
  cy: number;
  cardW: number;
  cardH: number;
  startR: number; // where the gold line starts (just inside the chip's edge)
  slots: Slot[];
};

/** Lays N cards evenly on an ellipse that fits the stage, starting at 12 o'clock. */
function computeGeometry({ w, h }: Size, n: number): Geometry {
  const mobile = w < 640;
  const base = mobile ? 100 : w < 1024 ? 140 : 168;
  const cardW = Math.round(base * Math.min(1, 6 / Math.max(n, 1)));
  const cardH = cardW + (mobile ? 30 : 36);
  const chipHero = Math.min(0.52 * h, 0.78 * w, 560);
  const chipR = (chipHero * CHIP_SCENE_B_SCALE) / 2;

  const rx = Math.max(chipR + cardW / 2 + 12, Math.min(w / 2 - cardW / 2 - (mobile ? 10 : 40), 460));
  const ry = Math.max(chipR + cardH / 2 + 12, Math.min(h / 2 - cardH / 2 - 80, 290));

  const slots = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const dx = Math.cos(a) * rx;
    const dy = Math.sin(a) * ry;
    const len = Math.hypot(dx, dy) || 1;
    return { dx, dy, ux: dx / len, uy: dy / len };
  });

  return { cx: w / 2, cy: h / 2, cardW, cardH, startR: chipR * 0.62, slots };
}

function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<Size | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s && s.w === width && s.h === height ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/** Per-card progress with a small stagger so the cards peel off one after another. */
function useItemProgress(progress: MotionValue<number>, i: number, n: number) {
  const step = n > 1 ? Math.min(0.06, 0.3 / (n - 1)) : 0;
  const span = 1 - step * (n - 1);
  return useTransform(progress, [i * step, i * step + span], [0, 1], { clamp: true });
}

export function ComponentRing({
  product,
  progress,
}: {
  product: Product;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  const n = product.components.length;
  const geo = size ? computeGeometry(size, n) : null;

  // Cards only become interactive once they've (almost) settled into the ring.
  const [active, setActive] = useState(false);
  useMotionValueEvent(progress, "change", (v) => setActive(v > 0.85));

  return (
    <div ref={ref} className="absolute inset-0 z-10">
      {geo && size && (
        <>
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            {geo.slots.map((slot, i) => (
              <RingLine key={i} geo={geo} slot={slot} progress={progress} i={i} n={n} />
            ))}
          </svg>
          {product.components.map((c, i) => (
            <RingCard
              key={c.id}
              href={componentHref(product.id, c.id)}
              component={c}
              index={i}
              n={n}
              geo={geo}
              slot={geo.slots[i]}
              progress={progress}
              active={active}
            />
          ))}
        </>
      )}
    </div>
  );
}

function RingLine({
  geo,
  slot,
  progress,
  i,
  n,
}: {
  geo: Geometry;
  slot: Slot;
  progress: MotionValue<number>;
  i: number;
  n: number;
}) {
  const p = useItemProgress(progress, i, n);
  const len = Math.hypot(slot.dx, slot.dy);
  const x2 = useTransform(p, (v) => geo.cx + slot.dx * v);
  const y2 = useTransform(p, (v) => geo.cy + slot.dy * v);
  const x1 = useTransform(p, (v) => geo.cx + slot.ux * Math.min(geo.startR, len * v));
  const y1 = useTransform(p, (v) => geo.cy + slot.uy * Math.min(geo.startR, len * v));
  const opacity = useTransform(p, [0.05, 0.4], [0, 1]);

  return (
    <motion.g style={{ opacity }}>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A24B" strokeOpacity={0.5} strokeWidth={1} />
      <motion.circle cx={x1} cy={y1} r={2.5} fill="#C9A24B" />
    </motion.g>
  );
}

function RingCard({
  href,
  component,
  index,
  n,
  geo,
  slot,
  progress,
  active,
}: {
  href: string;
  component: ProductComponent;
  index: number;
  n: number;
  geo: Geometry;
  slot: Slot;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const p = useItemProgress(progress, index, n);
  const x = useTransform(p, (v) => slot.dx * v);
  const y = useTransform(p, (v) => slot.dy * v);
  const scale = useTransform(p, [0, 1], [0.45, 1]);
  const opacity = useTransform(p, [0, 0.3], [0, 1]);
  const compact = geo.cardW < 120;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{
        width: geo.cardW,
        height: geo.cardH,
        marginLeft: -geo.cardW / 2,
        marginTop: -geo.cardH / 2,
        x,
        y,
        scale,
        opacity,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <Link
        href={href}
        tabIndex={active ? 0 : -1}
        aria-hidden={!active}
        className="group block h-full rounded-xl outline-none"
      >
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex h-full flex-col rounded-xl border border-white/[0.09] bg-[#0b0b0c] p-2",
            "transition-[border-color,box-shadow] duration-500",
            "group-hover:border-gold/60 group-hover:shadow-[0_0_0_1px_rgb(201_162_75/0.2),0_18px_50px_-18px_rgb(201_162_75/0.55)]",
            "group-focus-visible:border-gold/70",
          )}
        >
          <div className="stage-bg relative aspect-square w-full overflow-hidden rounded-lg">
            <div className="absolute inset-[9%] transition-transform duration-700 group-hover:scale-105">
              <Media src={component.image} alt="" sizes="180px" />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between gap-2 px-1">
            <span
              className={cn(
                "truncate text-white/85 transition-colors group-hover:text-white",
                compact ? "text-[11.5px]" : "text-[13px]",
              )}
            >
              {component.name}
            </span>
            {!compact && (
              <span className="font-mono text-[10px] text-white/30 transition-colors group-hover:text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
