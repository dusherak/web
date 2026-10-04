import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { ProductExplorer } from "@/components/product/product-explorer";
import { ComingSoon } from "@/components/product/coming-soon";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? `${product.name} · Physical AI Explorer` : "Not found" };
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  if (!product.available || product.components.length === 0) return <ComingSoon product={product} />;
  return <ProductExplorer product={product} />;
}
