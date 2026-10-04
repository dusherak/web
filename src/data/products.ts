/**
 * Single source of truth for every screen.
 *
 * - Add a product or component here and it shows up everywhere — no code changes.
 * - `image` is any path under /public (or a remote URL allowed by next.config).
 *   Swap the placeholder SVGs for real renders by changing these paths.
 * - `supplyChain` drives the tree on the component landing page and one detail page per
 *   node. Large chains live in their own file under src/data/supply-chains/.
 */

import { computeDieSupplyChain } from "./supply-chains/compute-die";
import { hbmMemoryOverview } from "./overviews/hbm-memory";
import { hbmMemorySupplyChain } from "./supply-chains/hbm-memory";
import { heatSpreaderSupplyChain } from "./supply-chains/heat-spreader";

export type Company = {
  name: string;
  /** Omit for privately held companies. */
  ticker?: string;
  /** Headquarters country. */
  hq?: string;
  /** What this company does at this point in the chain. */
  role: string;
};

/** One input or activity within a stage, e.g. "Polysilicon" or "Lithography". */
export type SupplyChainNode = {
  /** Unique within the component; used in the URL. */
  id: string;
  name: string;
  /** One-liner shown in the tree. */
  summary: string;
  /** Longer copy for the node's own page. */
  description: string;
  companies: Company[];
  /** Compact label for the flow graph when `name` is too long to fit a node. */
  shortName?: string;
  /**
   * Ids of the nodes that feed directly into this one. When a chain's nodes declare
   * inputs, the component page draws it as an interlinked flow graph instead of a list.
   */
  inputs?: string[];
};

export type SupplyChainStage = {
  id: string;
  label: string;
  summary: string;
  /** Optional highlight on the stage, e.g. where the component joins the product. */
  callout?: string;
  nodes: SupplyChainNode[];
};

export type NewsItem = {
  /** ISO date, e.g. "2026-09-30". */
  date: string;
  source: string;
  title: string;
  summary: string;
  url: string;
};

/** General-knowledge content for a component's Overview tab. */
export type ComponentOverview = {
  /** Lead paragraphs explaining what the part is and does. */
  intro: string[];
  facts: { value: string; label: string }[];
  /** How it's made, in a few plain steps. */
  process: { title: string; detail: string }[];
  generations: { name: string; year: string; detail: string; current?: boolean }[];
  makers: { company: Omit<Company, "role">; share?: string; detail: string }[];
  /** Attribution for the `share` figures above. */
  shareSource?: { label: string; url: string };
  news: NewsItem[];
  /** ISO date the news list was last checked. */
  newsAsOf: string;
};

export type ProductComponent = {
  id: string;
  name: string;
  image: string;
  /** Short one-liner shown under the name on the component page. */
  summary: string;
  /** Ordered upstream → downstream. Omit while the chain is still being mapped. */
  supplyChain?: SupplyChainStage[];
  /** The component this one is assembled into next (shown at the end of the tree). */
  feedsInto?: string;
  whyItMatters?: string;
  /** When present, the component page splits into Overview and Supply chain tabs. */
  overview?: ComponentOverview;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  available: boolean;
  components: ProductComponent[];
};

export const products: Product[] = [
  {
    id: "ai-chip",
    name: "AI Chip",
    tagline: "The silicon at the heart of every model.",
    image: "/placeholders/product-ai-chip.svg",
    available: true,
    // Ordered top of the package → bottom, as if peeling it apart layer by layer.
    components: [
      {
        id: "heat-spreader",
        name: "Heat Spreader",
        image: "/placeholders/component-heat-spreader.svg",
        summary:
          "The nickel-plated copper lid that seals the package and pulls heat off the silicon into the cooler.",
        supplyChain: heatSpreaderSupplyChain,
        feedsInto: "thermal-interface",
        whyItMatters:
          "The lid is one of the cheapest parts of an AI accelerator, yet each design is qualified with only one or two specialist suppliers, and every new chip generation needs new tooling. A delay at a single lid maker can hold up finished packages worth tens of thousands of dollars each. As chips draw more power, value is shifting toward higher-grade copper, gold-plated lids for indium solder, and composite materials.",
      },
      {
        id: "thermal-interface",
        name: "Thermal Interface",
        image: "/placeholders/component-thermal-interface.svg",
        summary:
          "Indium solder or advanced pastes that fill microscopic gaps between die and lid so heat can escape.",
        feedsInto: "compute-die",
      },
      {
        id: "compute-die",
        name: "Compute Die",
        image: "/placeholders/component-compute-die.svg",
        summary:
          "The leading-edge logic die — tens of billions of transistors that do the actual matrix maths of AI.",
        supplyChain: computeDieSupplyChain,
        feedsInto: "interposer",
        whyItMatters:
          "Every AI accelerator ultimately depends on a handful of companies that can design, equip and manufacture leading-edge logic. Each stage is highly concentrated — a single lithography supplier, a few foundries, a few wafer makers — so pricing power, export controls and capacity decisions at any one of them ripple through the entire AI build-out.",
      },
      {
        id: "hbm-memory",
        name: "HBM Memory",
        image: "/placeholders/component-hbm-memory.svg",
        summary:
          "Stacks of DRAM dies bonded vertically beside the compute die, feeding it data fast enough to stay busy.",
        supplyChain: hbmMemorySupplyChain,
        overview: hbmMemoryOverview,
        feedsInto: "interposer",
        whyItMatters:
          "Only three companies can make HBM at volume, and AI accelerators cannot ship without it. HBM uses about three times the wafer area of standard DRAM for each bit and sells at a steep premium, so it has reshaped memory-industry profits and pulled capacity away from ordinary DRAM. Leadership has swung between suppliers with each generation, and that decides who wins NVIDIA's orders. The stacking step has made niche toolmakers — TC bonders, grinders, memory testers — into critical chokepoints. Export controls on HBM and its equipment also make it a front line of US–China competition.",
      },
      {
        id: "interposer",
        name: "Silicon Interposer",
        image: "/placeholders/component-interposer.svg",
        summary:
          "A thin silicon bridge that wires the compute die and memory stacks together with ultra-dense connections.",
        feedsInto: "substrate",
      },
      {
        id: "interconnects",
        name: "Micro-bumps & TSVs",
        image: "/placeholders/component-interconnects.svg",
        summary:
          "Tiny copper pillars and through-silicon vias that carry signals and power vertically between layers.",
        feedsInto: "interposer",
      },
      {
        id: "substrate",
        name: "Package Substrate",
        image: "/placeholders/component-substrate.svg",
        summary:
          "A multilayer ABF laminate that fans thousands of connections out from the interposer to the circuit board.",
        feedsInto: "solder-balls",
      },
      {
        id: "solder-balls",
        name: "Solder Balls",
        image: "/placeholders/component-solder-balls.svg",
        summary:
          "The ball-grid array on the underside that mounts the finished package onto the accelerator board.",
      },
    ],
  },
  {
    id: "data-centre",
    name: "Data Centre",
    tagline: "Power, cooling and racks at planetary scale.",
    image: "/placeholders/product-data-centre.svg",
    available: false,
    components: [],
  },
  {
    id: "optical-interconnect",
    name: "Optical Interconnect",
    tagline: "Moving data at the speed of light.",
    image: "/placeholders/product-optical-interconnect.svg",
    available: false,
    components: [],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getComponent(
  productId: string,
  componentId: string,
): { product: Product; component: ProductComponent } | undefined {
  const product = getProduct(productId);
  const component = product?.components.find((c) => c.id === componentId);
  return product && component ? { product, component } : undefined;
}

export function getSupplyChainNode(productId: string, componentId: string, nodeId: string) {
  const match = getComponent(productId, componentId);
  if (!match) return undefined;
  for (const [stageIndex, stage] of (match.component.supplyChain ?? []).entries()) {
    const node = stage.nodes.find((n) => n.id === nodeId);
    if (node) return { ...match, stage, stageIndex, node };
  }
  return undefined;
}
