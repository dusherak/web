"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { Media } from "@/components/media";
import { EASE_IN_OUT, handoff, stagger } from "@/lib/motion";
import { productHref } from "@/lib/routes";
import { ProductCard } from "./product-card";

const EXPAND = { duration: 0.85, ease: EASE_IN_OUT };

/**
 * Grid of product cards + the full-screen "expand" overlay.
 * On click the card's frame and chip (shared `layoutId`s) morph into a full-screen
 * stage identical to Scene A of the product page, then we navigate — so the product
 * page appears to have grown out of the card.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Product | null>(null);
  const navigated = useRef(false);

  useEffect(() => {
    products.filter((p) => p.available).forEach((p) => router.prefetch(productHref(p.id)));
  }, [products, router]);

  // If this page is kept alive in the background (back/forward cache), reset on hide.
  useEffect(() => {
    if (!selected) return;
    return () => setSelected(null);
  }, [selected]);

  const go = useCallback(() => {
    if (!selected || navigated.current) return;
    navigated.current = true;
    handoff.fromHome = true;
    router.push(productHref(selected.id), { scroll: true });
  }, [router, selected]);

  // Safety net in case the layout animation callback is skipped (e.g. reduced motion).
  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(go, EXPAND.duration * 1000 + 250);
    return () => clearTimeout(t);
  }, [selected, go]);

  return (
    <>
      <motion.ul
        variants={stagger(0.12, 0.25)}
        initial="hidden"
        animate="show"
        className="mt-20 grid grid-cols-1 gap-5 md:mt-24 md:grid-cols-3 lg:gap-6"
      >
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            index={i}
            hidden={selected?.id === p.id}
            onOpen={() => {
              navigated.current = false;
              setSelected(p);
            }}
          />
        ))}
      </motion.ul>

      <AnimatePresence>
        {selected && (
          <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              layoutId={`frame-${selected.id}`}
              transition={EXPAND}
              style={{ borderRadius: 0 }}
              className="stage-bg absolute inset-0"
              onLayoutAnimationComplete={go}
            />
            <motion.div
              layoutId={`chip-${selected.id}`}
              transition={EXPAND}
              className="chip-hero relative"
            >
              <Media src={selected.image} alt={selected.name} priority sizes="60vw" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
