import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupplyChainNode, products } from "@/data/products";
import { SupplyChainNodePage } from "@/components/component/supply-chain-node-page";

export function generateStaticParams() {
  return products.flatMap((p) =>
    p.components.flatMap((c) =>
      (c.supplyChain ?? []).flatMap((s) =>
        s.nodes.map((n) => ({ id: p.id, componentId: c.id, nodeId: n.id })),
      ),
    ),
  );
}

type Props = PageProps<"/product/[id]/component/[componentId]/supply-chain/[nodeId]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, componentId, nodeId } = await params;
  const match = getSupplyChainNode(id, componentId, nodeId);
  return {
    title: match ? `${match.node.name} · ${match.component.name} supply chain` : "Not found",
  };
}

export default async function SupplyChainNodeRoute({ params }: Props) {
  const { id, componentId, nodeId } = await params;
  const match = getSupplyChainNode(id, componentId, nodeId);
  if (!match) notFound();

  return <SupplyChainNodePage {...match} />;
}
