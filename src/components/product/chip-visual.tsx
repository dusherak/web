"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { Media } from "@/components/media";
import { EASE_OUT } from "@/lib/motion";

/** Chip size in Scene B relative to Scene A. The component ring is laid out around it. */
export const CHIP_SCENE_B_SCALE = 0.4;

export type ChipVisualProps = {
  /**
   * Scroll-driven progress, 0 → 1.
   *   0 = Scene A (assembled, full size)
   *   1 = Scene B (taken apart, components ringed around the chip)
   * It's a MotionValue, so reading it never re-renders React:
   *   - DOM:   useTransform(explode, [0, 1], [...])
   *   - R3F:   useFrame(() => { const t = explode.get(); ... })
   */
  explode: MotionValue<number>;
  src?: string;
  alt?: string;
  /** Play the fade-in intro. Off when we arrive from the home-page card transition. */
  intro?: boolean;
};

/**
 * The hero chip. Occupies a centred square of `--chip-hero` (see globals.css).
 *
 * SWAP-IN POINT FOR THE 3D MODEL: replace the body of this component with a
 * <Canvas> that fills the same box and reads `explode` — the page, scroll handling
 * and component ring don't need to change.
 */
export function ChipVisual({
  explode,
  src = "/placeholders/product-ai-chip.svg",
  alt = "",
  intro = true,
}: ChipVisualProps) {
  const scale = useTransform(explode, [0, 1], [1, CHIP_SCENE_B_SCALE]);
  const bloom = useTransform(explode, [0, 1], [0.55, 1]);
  const ring = useTransform(explode, [0.35, 1], [0, 1]);

  return (
    <motion.div className="chip-hero relative will-change-transform" style={{ scale }}>
      {/* Soft gold bloom that intensifies as the chip comes apart */}
      <motion.div
        aria-hidden
        style={{ opacity: bloom }}
        className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgb(201_162_75/0.16),transparent)]"
      />
      {/* Thin orbit ring, visible in Scene B */}
      <motion.div
        aria-hidden
        style={{ opacity: ring }}
        className="absolute -inset-[14%] rounded-full border border-gold/25"
      />
      <motion.div
        className="absolute inset-0"
        initial={intro ? { opacity: 0, scale: 0.94, filter: "blur(6px)" } : false}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <Media src={src} alt={alt} priority sizes="(min-width: 768px) 560px, 80vw" />
      </motion.div>
    </motion.div>
  );
}
