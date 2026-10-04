"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";
import { Media } from "@/components/media";
import { Badge } from "@/components/ui/badge";
import { EASE_OUT, fadeUp } from "@/lib/motion";
import { productHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index,
  hidden,
  onOpen,
}: {
  product: Product;
  index: number;
  /** True while this card's media is "lifted" into the full-screen overlay. */
  hidden: boolean;
  onOpen: () => void;
}) {
  const { available } = product;

  const body = (
    <motion.div
      whileHover={available ? { y: -8 } : undefined}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0b]",
        "transition-[border-color,box-shadow] duration-500",
        available &&
          "group-hover:border-gold/55 group-hover:shadow-[0_0_0_1px_rgb(201_162_75/0.25),0_30px_80px_-30px_rgb(201_162_75/0.45)] group-focus-visible:border-gold/70",
      )}
    >
      {/* Media frame. The inner layers carry the shared layoutIds. */}
      <div className="stage-bg relative aspect-[5/4] overflow-hidden">
        {!hidden && (
          <>
            <motion.div
              layoutId={available ? `frame-${product.id}` : undefined}
              style={{ borderRadius: 0 }}
              className="stage-bg absolute inset-0"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                layoutId={available ? `chip-${product.id}` : undefined}
                className={cn(
                  "relative aspect-square h-[78%] transition-[filter,opacity] duration-700",
                  available
                    ? "group-hover:scale-[1.03]"
                    : "opacity-45 grayscale-[0.6]",
                )}
              >
                <Media src={product.image} alt={product.name} priority={index === 0} />
              </motion.div>
            </div>
          </>
        )}

        {!available && (
          <Badge
            variant="outline"
            className="absolute top-4 right-4 h-6 border-white/15 bg-black/40 px-2.5 text-[10px] font-medium tracking-[0.18em] text-white/60 uppercase backdrop-blur"
          >
            Coming soon
          </Badge>
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-4 border-t border-white/[0.06] p-6">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/35">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2
            className={cn(
              "mt-2 text-xl font-normal tracking-tight",
              available ? "text-white" : "text-white/55",
            )}
          >
            {product.name}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-white/45">{product.tagline}</p>
        </div>
        {available && (
          <span className="mt-6 grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-gold/60 group-hover:bg-gold group-hover:text-black">
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.li variants={fadeUp} className="h-full">
      {available ? (
        <Link
          href={productHref(product.id)}
          scroll={false}
          onClick={(e) => {
            // Let modified clicks (new tab etc.) behave normally.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            onOpen();
          }}
          className="group block h-full rounded-2xl outline-none"
          aria-label={`Explore ${product.name}`}
        >
          {body}
        </Link>
      ) : (
        <div aria-disabled className="h-full cursor-default">
          {body}
        </div>
      )}
    </motion.li>
  );
}
