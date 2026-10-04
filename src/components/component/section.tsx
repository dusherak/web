"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/** Numbered section with a hairline rule; fades up as it enters the viewport. */
export function Section({
  id,
  index,
  title,
  children,
}: {
  id?: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      <div className="mb-10 flex items-baseline gap-5 border-t border-white/[0.08] pt-6 md:mb-12">
        <span className="font-mono text-xs tracking-[0.2em] text-gold">{String(index).padStart(2, "0")}</span>
        <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
