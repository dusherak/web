/** Hash used by "back" links to land directly on Scene B of the product page. */
export const SCENE_B_HASH = "components";

export const productHref = (productId: string) => `/product/${productId}`;
export const productSceneBHref = (productId: string) => `/product/${productId}#${SCENE_B_HASH}`;
export const componentHref = (productId: string, componentId: string) =>
  `/product/${productId}/component/${componentId}`;

/** Anchor of the supply-chain tree on a component page. */
export const SUPPLY_CHAIN_HASH = "supply-chain";
export const stageAnchor = (stageId: string) => `stage-${stageId}`;
/** Anchor of a single node in the supply-chain flow graph. */
export const nodeAnchor = (nodeId: string) => `node-${nodeId}`;

/** Tabs on components that have an Overview. The supply-chain tab reuses the tree's hash. */
export type ComponentTab = "overview" | "supply-chain";
export const OVERVIEW_HASH = "overview";
/** Which tab a URL hash should open. Any supply-chain anchor opens the supply-chain tab. */
export const tabForHash = (hash: string): ComponentTab => {
  const h = hash.replace(/^#/, "");
  return h === SUPPLY_CHAIN_HASH || h.startsWith("stage-") || h.startsWith("node-")
    ? "supply-chain"
    : "overview";
};

export const supplyChainHref = (productId: string, componentId: string, stageId?: string) =>
  `${componentHref(productId, componentId)}#${stageId ? stageAnchor(stageId) : SUPPLY_CHAIN_HASH}`;
export const supplyChainNodeHref = (productId: string, componentId: string, nodeId: string) =>
  `${componentHref(productId, componentId)}/supply-chain/${nodeId}`;
/** Link back to a node's position in the flow graph on the component page. */
export const supplyChainGraphNodeHref = (productId: string, componentId: string, nodeId: string) =>
  `${componentHref(productId, componentId)}#${nodeAnchor(nodeId)}`;
