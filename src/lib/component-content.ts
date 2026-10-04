import type { Product, ProductComponent } from "@/data/products";

/** Stage outline shown (greyed out) for components whose chain hasn't been mapped yet. */
export const PLACEHOLDER_STAGES = [
  "Raw materials",
  "Refining & materials",
  "Design & IP",
  "Equipment & tooling",
  "Manufacturing",
  "Test",
];

/** Resolves everything the component landing page needs beyond the raw component. */
export function resolveComponentContent(product: Product, component: ProductComponent) {
  const index = product.components.findIndex((c) => c.id === component.id);
  const supplyChain = component.supplyChain ?? [];

  const nodes = supplyChain.flatMap((s) => s.nodes);
  const companyNames = new Set(nodes.flatMap((n) => n.companies.map((c) => c.name)));

  return {
    index,
    total: product.components.length,
    prev: index > 0 ? product.components[index - 1] : undefined,
    next: index < product.components.length - 1 ? product.components[index + 1] : undefined,
    supplyChain,
    stats: { stages: supplyChain.length, nodes: nodes.length, companies: companyNames.size },
    feedsInto: product.components.find((c) => c.id === component.feedsInto),
  };
}
