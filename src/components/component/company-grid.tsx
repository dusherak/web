"use client";

import { motion } from "framer-motion";
import type { Company } from "@/data/products";
import { EASE_OUT } from "@/lib/motion";

export function CompanyGrid({ companies }: { companies: Company[] }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {companies.map((c) => (
        <motion.li
          key={c.name}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
          }}
          whileHover={{ y: -4 }}
          className="group flex gap-4 rounded-xl border border-white/[0.08] bg-white/[0.015] p-5 transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-[0_20px_50px_-25px_rgb(201_162_75/0.5)]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-sm text-white/70 transition-colors group-hover:border-gold/50 group-hover:text-gold">
            {c.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-[15px] text-white">{c.name}</p>
              <p className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-gold">
                {c.ticker ?? <span className="text-white/30">PRIVATE</span>}
              </p>
            </div>
            <p className="mt-1 text-sm leading-snug text-white/50">{c.role}</p>
            {c.hq && (
              <p className="mt-2 text-[11px] tracking-[0.14em] text-white/30 uppercase">{c.hq}</p>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
