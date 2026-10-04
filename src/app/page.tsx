import { products } from "@/data/products";
import { HomeHero } from "@/components/home/home-hero";
import { ProductGrid } from "@/components/home/product-grid";

export default function HomePage() {
  return (
    <main className="relative min-h-svh overflow-x-clip">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[80svh]" />
      <div className="relative mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 md:pt-40">
        <HomeHero
          productCount={products.length}
          liveCount={products.filter((p) => p.available).length}
        />
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
