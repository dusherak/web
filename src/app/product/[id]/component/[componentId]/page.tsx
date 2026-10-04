import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, products } from "@/data/products";
import { resolveComponentContent } from "@/lib/component-content";
import { ComponentLanding } from "@/components/component/component-landing";

export function generateStaticParams() {
  return products.flatMap((p) =>
    p.components.map((c) => ({ id: p.id, componentId: c.id })),
  );
}

type Props = PageProps<"/product/[id]/component/[componentId]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, componentId } = await params;
  const match = getComponent(id, componentId);
  return {
    title: match ? `${match.component.name} · ${match.product.name}` : "Not found",
  };
}

export default async function ComponentPage({ params }: Props) {
  const { id, componentId } = await params;
  const match = getComponent(id, componentId);
  if (!match) notFound();

  const { product, component } = match;
  const content = resolveComponentContent(product, component);

  return <ComponentLanding product={product} component={component} content={content} />;
}
