"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getComponent, getProduct, getSupplyChainNode } from "@/data/products";
import { componentHref, supplyChainNodeHref } from "@/lib/routes";

/** Persistent top bar. Lives in the root layout so it never re-mounts between routes. */
export function SiteHeader() {
  const pathname = usePathname();
  const crumbs = useCrumbs(pathname);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="absolute inset-0 h-24 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 text-[13px] font-medium tracking-[0.18em] text-white/90 uppercase transition-colors hover:text-white"
        >
          <span className="relative grid size-5 place-items-center rounded-[5px] border border-gold/70">
            <span className="size-1.5 rounded-[2px] bg-gold" />
          </span>
          <span className="hidden sm:inline">Physical AI</span>
        </Link>

        <nav aria-label="Breadcrumb" className="pointer-events-auto min-w-0">
          <ol className="flex items-center gap-2 text-[13px] text-white/45">
            <AnimatePresence initial={false} mode="popLayout">
              {crumbs.map((c) => (
                <motion.li
                  key={c.href}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span aria-hidden className="text-white/20">/</span>
                  <Link
                    href={c.href}
                    className="truncate transition-colors hover:text-white aria-[current=page]:text-white/85"
                    aria-current={c.current ? "page" : undefined}
                  >
                    {c.label}
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </nav>
      </div>
    </header>
  );
}

function useCrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string; current: boolean }[] = [];
  if (parts[0] !== "product" || !parts[1]) return crumbs;

  const product = getProduct(parts[1]);
  if (!product) return crumbs;
  crumbs.push({ label: product.name, href: `/product/${product.id}`, current: parts.length === 2 });

  if (parts[2] === "component" && parts[3]) {
    const match = getComponent(product.id, parts[3]);
    if (match) {
      crumbs.push({
        label: match.component.name,
        href: componentHref(product.id, match.component.id),
        current: parts.length === 4,
      });
    }
  }

  if (parts[4] === "supply-chain" && parts[5]) {
    const match = getSupplyChainNode(product.id, parts[3], parts[5]);
    if (match) {
      crumbs.push({
        label: match.node.name,
        href: supplyChainNodeHref(product.id, match.component.id, match.node.id),
        current: true,
      });
    }
  }
  return crumbs;
}
