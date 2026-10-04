/** Shared motion tokens so every transition in the app feels like one system. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/**
 * Hand-off flag for the home → product shared-layout transition.
 * The home page expands the card into a full-screen chip, then navigates; the product
 * page reads this once on mount to skip its own intro so the chip doesn't "blink".
 */
export const handoff = { fromHome: false };
