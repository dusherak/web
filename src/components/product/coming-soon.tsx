"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/data/products";
import { Media } from "@/components/media";
import { Badge } from "@/components/ui/badge";
import { fadeUp, stagger } from "@/lib/motion";

/** Shown if someone deep-links to a product that isn't available yet. */
export function ComingSoon({ product }: { product: Product }) {
  return (
    <main className="stage-bg grid min-h-svh place-items-center px-6">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center"
      >
        <motion.div variants={fadeUp} className="relative size-56 opacity-50 grayscale-[0.6]">
          <Media src={product.image} alt={product.name} priority />
        </motion.div>
        <motion.div variants={fadeUp}>
          <Badge
            variant="outline"
            className="mt-8 h-6 border-white/15 px-2.5 text-[10px] tracking-[0.18em] text-white/60 uppercase"
          >
            Coming soon
          </Badge>
        </motion.div>
        <motion.h1 variants={fadeUp} className="mt-5 text-4xl font-light tracking-tight text-white">
          {product.name}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-3 text-white/45">
          {product.tagline}
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4" /> All products
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
