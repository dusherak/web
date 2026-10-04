"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export function HomeHero({ productCount, liveCount }: { productCount: number; liveCount: number }) {
  return (
    <motion.section
      variants={stagger(0.1)}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
    >
      <div className="max-w-3xl">
        <motion.p
          variants={fadeUp}
          className="mb-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-gold uppercase"
        >
          <span className="h-px w-8 bg-gold/60" />
          Supply chain explorer
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95] font-light tracking-[-0.035em] text-white"
        >
          Physical AI,
          <br />
          <span className="text-white/40">taken apart.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-7 text-lg text-white/55 md:text-xl">
          Explore the physical AI economy
        </motion.p>
      </div>

      <motion.dl
        variants={fadeUp}
        className="flex gap-10 border-t border-white/10 pt-5 text-sm md:border-t-0 md:border-l md:pt-0 md:pl-8"
      >
        <div>
          <dt className="text-white/40">Products</dt>
          <dd className="mt-1 font-mono text-2xl font-light text-white tabular-nums">
            {String(productCount).padStart(2, "0")}
          </dd>
        </div>
        <div>
          <dt className="text-white/40">Live</dt>
          <dd className="mt-1 font-mono text-2xl font-light text-gold tabular-nums">
            {String(liveCount).padStart(2, "0")}
          </dd>
        </div>
      </motion.dl>
    </motion.section>
  );
}
