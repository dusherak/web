import type { Company, SupplyChainStage } from "../products";

/**
 * Supply chain for high-bandwidth memory (HBM) stacks in an AI accelerator, ordered
 * upstream → downstream — from quartz and metals all the way to the HBM sitting beside
 * the compute die in the finished chip. Companies are the major players at each node;
 * no market-share figures yet. `inputs` wire the nodes into the flow graph on the
 * component page — each lists the nodes that feed directly into it.
 */

type Co = Omit<Company, "role">;
const at = (co: Co, role: string): Company => ({ ...co, role });

// Companies that appear at more than one node.
const shinEtsu: Co = { name: "Shin-Etsu Chemical", ticker: "4063.T", hq: "Japan" };
const linde: Co = { name: "Linde", ticker: "LIN", hq: "UK" };
const airLiquide: Co = { name: "Air Liquide", ticker: "AI.PA", hq: "France" };
const merck: Co = { name: "Merck KGaA", ticker: "MRK.DE", hq: "Germany" };
const resonac: Co = { name: "Resonac", ticker: "4004.T", hq: "Japan" };
const mks: Co = { name: "MKS", ticker: "MKSI", hq: "US" };
const skHynix: Co = { name: "SK hynix", ticker: "000660.KS", hq: "South Korea" };
const samsung: Co = { name: "Samsung Electronics", ticker: "005930.KS", hq: "South Korea" };
const micron: Co = { name: "Micron Technology", ticker: "MU", hq: "US" };
const tsmc: Co = { name: "TSMC", ticker: "TSM", hq: "Taiwan" };
const synopsys: Co = { name: "Synopsys", ticker: "SNPS", hq: "US" };
const cadence: Co = { name: "Cadence Design Systems", ticker: "CDNS", hq: "US" };
const amat: Co = { name: "Applied Materials", ticker: "AMAT", hq: "US" };
const lam: Co = { name: "Lam Research", ticker: "LRCX", hq: "US" };
const tel: Co = { name: "Tokyo Electron", ticker: "8035.T", hq: "Japan" };
const kla: Co = { name: "KLA", ticker: "KLAC", hq: "US" };
const onto: Co = { name: "Onto Innovation", ticker: "ONTO", hq: "US" };
const asmpt: Co = { name: "ASMPT", ticker: "0522.HK", hq: "Singapore" };
const besi: Co = { name: "BE Semiconductor Industries", ticker: "BESI.AS", hq: "Netherlands" };
const evGroup: Co = { name: "EV Group", hq: "Austria" };
const advantest: Co = { name: "Advantest", ticker: "6857.T", hq: "Japan" };
const nvidia: Co = { name: "NVIDIA", ticker: "NVDA", hq: "US" };
const amd: Co = { name: "AMD", ticker: "AMD", hq: "US" };
const broadcom: Co = { name: "Broadcom", ticker: "AVGO", hq: "US" };

export const hbmMemorySupplyChain: SupplyChainStage[] = [
  {
    id: "raw-materials",
    label: "Raw materials",
    summary: "What comes out of the ground before any chemistry happens.",
    nodes: [
      {
        id: "high-purity-quartz",
        name: "High-purity quartz",
        summary: "The mineral source of every DRAM wafer.",
        description:
          "Every DRAM die in an HBM stack starts as silicon, and silicon starts as quartz. Only a few deposits are pure enough, most famously around Spruce Pine, North Carolina. The quartz is used both as silicon feedstock and to make the crucibles that wafer ingots are grown in.",
        companies: [
          at({ name: "Sibelco", hq: "Belgium" }, "Mines and processes high-purity quartz at Spruce Pine"),
          at({ name: "The Quartz Corp" }, "Mines and refines high-purity quartz at Spruce Pine"),
          at({ name: "Heraeus", hq: "Germany" }, "Fused-quartz crucibles and process glassware"),
          at(shinEtsu, "Quartz products through its Shin-Etsu Quartz subsidiary"),
        ],
      },
      {
        id: "copper-tungsten",
        name: "Copper & tungsten",
        summary: "Metals for the wiring and the vertical vias through each die.",
        description:
          "Each HBM die is pierced by thousands of through-silicon vias (TSVs), vertical copper columns that carry data and power up and down the stack. Tungsten is used for the DRAM's word lines and contacts. Both metals are mined at scale and then refined to electronic purity.",
        companies: [
          at({ name: "Freeport-McMoRan", ticker: "FCX", hq: "US" }, "Copper mining"),
          at({ name: "BHP", ticker: "BHP", hq: "Australia" }, "Copper mining"),
          at({ name: "Glencore", ticker: "GLEN.L", hq: "Switzerland" }, "Copper mining and trading"),
          at({ name: "China Tungsten & Hightech Materials", ticker: "000657.SZ", hq: "China" }, "Tungsten mining and powders"),
        ],
      },
      {
        id: "tin-silver",
        name: "Tin & silver",
        summary: "The solder in the micro-bumps that join the dies together.",
        description:
          "The dies in a stack are joined by tens of thousands of micro-bumps. Each is a tiny copper pillar capped with tin-silver solder. Tin supply is concentrated in China, Indonesia, Peru and Myanmar, and much of the silver is a by-product of other mining.",
        companies: [
          at({ name: "Yunnan Tin", ticker: "000960.SZ", hq: "China" }, "World's largest refined tin producer"),
          at({ name: "PT Timah", ticker: "TINS.JK", hq: "Indonesia" }, "Tin mining and smelting"),
          at({ name: "Malaysia Smelting Corporation", ticker: "5916.KL", hq: "Malaysia" }, "Tin smelting"),
          at({ name: "Fresnillo", ticker: "FRES.L", hq: "Mexico" }, "Primary silver mining"),
          at({ name: "Pan American Silver", ticker: "PAAS", hq: "Canada" }, "Silver mining"),
        ],
      },
      {
        id: "zirconium-hafnium",
        name: "Zirconium & hafnium",
        summary: "Elements behind the high-k dielectric in DRAM capacitors.",
        description:
          "Each DRAM bit stores its charge in a tall, thin capacitor. Today's capacitors depend on high-k dielectrics based on zirconium and hafnium oxide, deposited a few atoms thick. Both come from zircon sands, and hafnium is separated out as a by-product of nuclear-grade zirconium.",
        companies: [
          at({ name: "Iluka Resources", ticker: "ILU.AX", hq: "Australia" }, "Zircon mining"),
          at({ name: "ATI", ticker: "ATI", hq: "US" }, "Zirconium and hafnium production"),
          at({ name: "Framatome", hq: "France" }, "Zirconium and hafnium production"),
        ],
      },
      {
        id: "noble-gases",
        shortName: "Neon & noble gases",
        name: "Neon & noble gases",
        summary: "Gases that power the lasers used in lithography.",
        description:
          "Lithography lasers run on neon-based gas mixtures, and krypton and xenon are also used in the fab. These gases are captured as by-products of large air-separation plants, so supply is tied to a handful of industrial-gas majors.",
        companies: [
          at(linde, "Air separation and rare-gas purification"),
          at(airLiquide, "Air separation and rare-gas supply"),
          at({ name: "Air Products", ticker: "APD", hq: "US" }, "Industrial and specialty gases"),
        ],
      },
    ],
  },
  {
    id: "materials",
    label: "Refining & materials",
    summary: "Turning raw inputs into wafers, chemicals and the glue that holds a stack together.",
    nodes: [
      {
        id: "silicon-wafers",
        inputs: ["high-purity-quartz"],
        name: "Silicon wafers",
        summary: "300 mm single-crystal discs every DRAM die is built on.",
        description:
          "Polysilicon is grown into single-crystal ingots and sliced into polished 300 mm wafers. HBM needs about three times the wafer area of standard DRAM for every bit it stores, so the HBM boom pulls hard on wafer supply.",
        companies: [
          at(shinEtsu, "Largest prime silicon wafer maker"),
          at({ name: "SUMCO", ticker: "3436.T", hq: "Japan" }, "300 mm prime wafers"),
          at({ name: "SK siltron", hq: "South Korea" }, "300 mm wafers (SK Group)"),
          at({ name: "GlobalWafers", ticker: "6488.TWO", hq: "Taiwan" }, "300 mm wafers"),
          at({ name: "Siltronic", ticker: "WAF.DE", hq: "Germany" }, "300 mm wafers"),
        ],
      },
      {
        id: "precursors",
        shortName: "Precursors & gases",
        inputs: ["zirconium-hafnium", "noble-gases"],
        name: "Precursors & specialty gases",
        summary: "Chemicals that deposit capacitor and barrier films.",
        description:
          "Atomic-layer deposition builds DRAM capacitors and liners from metal-organic precursors, such as zirconium and hafnium compounds, alongside a long list of specialty gases. Because Korea is home to two of the three HBM makers, it has built a strong local precursor industry next to its fabs.",
        companies: [
          at(merck, "ALD precursors and electronic specialty gases"),
          at({ name: "Soulbrain", ticker: "357780.KQ", hq: "South Korea" }, "Precursors and wet chemicals"),
          at({ name: "DNF", ticker: "092070.KQ", hq: "South Korea" }, "High-k and ALD precursors"),
          at({ name: "Hansol Chemical", ticker: "014680.KS", hq: "South Korea" }, "Precursors and hydrogen peroxide"),
          at({ name: "Adeka", ticker: "4401.T", hq: "Japan" }, "High-k precursors"),
          at(airLiquide, "Electronic specialty gases and on-site supply"),
        ],
      },
      {
        id: "photoresists",
        name: "Photoresists",
        summary: "Light-sensitive coatings that capture the memory pattern.",
        description:
          "Leading DRAM nodes use EUV for their tightest layers and ArF immersion for the rest, and each step needs a matched photoresist. The market is dominated by Japanese suppliers, with a Korean challenger close to the memory fabs.",
        companies: [
          at({ name: "Tokyo Ohka Kogyo", ticker: "4186.T", hq: "Japan" }, "EUV and ArF photoresists"),
          at({ name: "JSR", hq: "Japan" }, "EUV and ArF photoresists"),
          at(shinEtsu, "ArF and EUV photoresists"),
          at({ name: "Dongjin Semichem", ticker: "005290.KQ", hq: "South Korea" }, "Photoresists for Korean memory fabs"),
        ],
      },
      {
        id: "plating-chemistry",
        shortName: "Plating chemistry",
        inputs: ["copper-tungsten", "tin-silver"],
        name: "TSV & bump plating chemistry",
        summary: "Baths that fill TSVs with copper and build the micro-bumps.",
        description:
          "Filling a TSV from the bottom up without trapping a void takes carefully balanced copper-plating additives. The micro-bumps are then built by plating copper pillars and tin-silver caps. These chemistries are a small market, but they directly determine the yield of each stack.",
        companies: [
          at(mks, "Copper and advanced-packaging plating chemistry via Atotech"),
          at({ name: "Element Solutions", ticker: "ESI", hq: "US" }, "Plating chemistry via MacDermid Alpha"),
          at({ name: "Mitsubishi Materials", ticker: "5711.T", hq: "Japan" }, "Tin-silver plating chemistry"),
          at({ name: "JCU Corporation", ticker: "4975.T", hq: "Japan" }, "Copper plating additives"),
        ],
      },
      {
        id: "underfill-ncf",
        shortName: "Underfill & NCF",
        name: "Underfill & non-conductive film",
        summary: "The material that fills the gaps between stacked dies.",
        description:
          "The gaps between dies must be filled to support the micro-bumps and carry heat out of the stack. SK hynix uses mass-reflow molded underfill (MR-MUF), a liquid poured into the whole stack at once. Samsung and Micron instead laminate a non-conductive film onto each die before bonding (TC-NCF). The choice of material is a core part of each company's stacking process.",
        companies: [
          at({ name: "Namics", hq: "Japan" }, "Liquid molded underfill"),
          at(resonac, "Non-conductive films and mold compounds"),
          at({ name: "Sumitomo Bakelite", ticker: "4203.T", hq: "Japan" }, "Epoxy mold compounds"),
          at({ name: "Henkel", ticker: "HEN3.DE", hq: "Germany" }, "Underfills and non-conductive films"),
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design & IP",
    summary: "The memory stack, and the logic on the accelerator that talks to it.",
    nodes: [
      {
        id: "hbm-designers",
        inputs: ["eda-software"],
        name: "HBM designers",
        summary: "Memory makers who architect the stack to the JEDEC standard.",
        description:
          "HBM is designed in-house by the same companies that manufacture it, following JEDEC standards (HBM3E, HBM4). Each stack has 8 to 16 DRAM dies on a base die, connected by an interface 1,024 bits wide, or 2,048 bits for HBM4. Starting with HBM4, customers can ask for custom logic in the base die, which pulls the accelerator designer into the memory design.",
        companies: [
          at(skHynix, "HBM market leader and first to volume on new generations"),
          at(samsung, "HBM design, including custom base dies"),
          at(micron, "HBM design"),
        ],
      },
      {
        id: "controller-ip",
        shortName: "Controller & PHY IP",
        name: "HBM controller & PHY IP",
        summary: "The circuit on the compute die that talks to the stack.",
        description:
          "The accelerator needs a memory controller and a physical interface (PHY) that drive thousands of signals across the interposer to each stack. Most chip designers license these blocks rather than build them, paying upfront fees plus per-chip royalties.",
        companies: [
          at({ name: "Rambus", ticker: "RMBS", hq: "US" }, "HBM controller IP"),
          at(synopsys, "HBM controller and PHY IP"),
          at(cadence, "HBM controller and PHY IP"),
        ],
      },
      {
        id: "eda-software",
        name: "EDA software",
        summary: "The software memory and stacks are designed and verified in.",
        description:
          "DRAM arrays, base-die logic and the 3D stack, including its TSVs, power delivery, heat and signal integrity, are all designed and verified with electronic design automation tools from the same three vendors that dominate logic.",
        companies: [
          at(synopsys, "Circuit simulation, verification and 3D-IC tools"),
          at(cadence, "Custom design, verification and 3D-IC tools"),
          at({ name: "Siemens", ticker: "SIE.DE", hq: "Germany" }, "Physical verification via Siemens EDA"),
        ],
      },
    ],
  },
  {
    id: "front-end-equipment",
    label: "Front-end equipment",
    summary: "The machines that build the DRAM dies themselves.",
    nodes: [
      {
        id: "lithography",
        inputs: ["noble-gases"],
        name: "Lithography",
        summary: "Printing the memory array with light.",
        description:
          "Leading-edge DRAM uses EUV scanners on its most critical layers, and their use grows with every node. These come from a single supplier, with DUV scanners handling the remaining layers.",
        companies: [
          at({ name: "ASML", ticker: "ASML", hq: "Netherlands" }, "Sole supplier of EUV scanners"),
          at({ name: "Carl Zeiss SMT", hq: "Germany" }, "EUV optics for ASML"),
          at({ name: "Nikon", ticker: "7731.T", hq: "Japan" }, "DUV scanners"),
        ],
      },
      {
        id: "deposition-etch",
        name: "Deposition & etch",
        summary: "Building and carving the capacitors and wiring.",
        description:
          "DRAM capacitors are deep, narrow cylinders, built by etching high-aspect-ratio holes and lining them with atomic layers of high-k film. Korean toolmakers hold a meaningful share of this work alongside the US and Japanese majors.",
        companies: [
          at(lam, "High-aspect-ratio etch and deposition"),
          at(amat, "CVD, PVD and etch"),
          at(tel, "Etch, deposition and coater/developers"),
          at({ name: "ASM International", ticker: "ASM.AS", hq: "Netherlands" }, "ALD"),
          at({ name: "Wonik IPS", ticker: "240810.KQ", hq: "South Korea" }, "CVD and ALD for memory"),
          at({ name: "Jusung Engineering", ticker: "036930.KQ", hq: "South Korea" }, "ALD for memory"),
        ],
      },
      {
        id: "metrology-inspection",
        shortName: "Metrology",
        name: "Metrology & inspection",
        summary: "Finding defects across the wafer.",
        description:
          "Every HBM stack contains up to 16 DRAM dies. A single bad die can scrap the whole stack, so catching defects early at the wafer stage matters even more than in standard DRAM.",
        companies: [
          at(kla, "Wafer inspection and metrology"),
          at(amat, "E-beam inspection and review"),
          at(onto, "Metrology and inspection"),
          at({ name: "Hitachi High-Tech", hq: "Japan" }, "CD-SEM metrology"),
        ],
      },
    ],
  },
  {
    id: "stacking-equipment",
    label: "TSV & stacking equipment",
    summary: "The specialist tools that turn flat dies into a 3D stack.",
    nodes: [
      {
        id: "tsv-formation",
        shortName: "TSV etch & fill",
        name: "TSV etch & fill",
        summary: "Drilling and filling vertical vias through each die.",
        description:
          "Deep reactive-ion etch drills thousands of narrow holes into each DRAM wafer. The holes are lined with insulator and barrier films and then filled with copper by electroplating. Together these steps form the vertical wiring that makes stacking possible.",
        companies: [
          at(lam, "Deep silicon etch and TSV copper plating"),
          at(amat, "TSV liner, barrier and seed deposition"),
          at(tel, "TSV etch and deposition"),
        ],
      },
      {
        id: "thinning-dicing",
        shortName: "Thinning & dicing",
        name: "Thinning, temporary bonding & dicing",
        summary: "Grinding wafers thinner than paper, then cutting them apart.",
        description:
          "To fit up to 16 dies in a stack under 1 mm tall, each wafer is ground down to a few tens of microns, thin enough to flex. It is temporarily bonded to a carrier so it can be handled, then debonded and diced. Wafer grinding and dicing is dominated by one Japanese company.",
        companies: [
          at({ name: "DISCO", ticker: "6146.T", hq: "Japan" }, "Dominant supplier of grinders and dicers"),
          at({ name: "Tokyo Seimitsu", ticker: "7729.T", hq: "Japan" }, "Grinders and dicers via Accretech"),
          at(evGroup, "Temporary bonding and debonding"),
          at({ name: "SUSS MicroTec", ticker: "SMHN.DE", hq: "Germany" }, "Temporary bonding and debonding"),
          at(tel, "Temporary bonding and debonding"),
        ],
      },
      {
        id: "tc-bonders",
        shortName: "Stack bonders",
        name: "Thermo-compression & hybrid bonders",
        summary: "Machines that stack and bond each die in place.",
        description:
          "Thermo-compression (TC) bonders pick up each thinned die, align its micro-bumps to the die below to within microns, and bond them with heat and force, one layer at a time. For taller future stacks, hybrid bonding joins copper to copper directly with no solder bumps. TC bonders were a long-standing bottleneck, and a few Korean suppliers became critical to the HBM ramp.",
        companies: [
          at({ name: "Hanmi Semiconductor", ticker: "042700.KS", hq: "South Korea" }, "TC bonders for HBM"),
          at({ name: "Hanwha Semitech", hq: "South Korea" }, "TC bonders for HBM"),
          at({ name: "SEMES", hq: "South Korea" }, "Bonding equipment (Samsung subsidiary)"),
          at(asmpt, "TC bonders"),
          at(besi, "Hybrid bonders"),
          at(amat, "Hybrid bonding process tools"),
        ],
      },
      {
        id: "stack-molding",
        name: "Molding & reflow",
        summary: "Encapsulating and reflowing the finished stack.",
        description:
          "Once the dies are stacked, the stack is reflowed to form its solder joints. Molding compound is then injected or compressed around it to protect it and help carry heat out. In SK hynix's MR-MUF process, reflow and underfill happen in a single step for the whole stack.",
        companies: [
          at({ name: "Towa", ticker: "6315.T", hq: "Japan" }, "Compression molding systems"),
          at(asmpt, "Molding and reflow systems"),
          at({ name: "Yamaha Motor", ticker: "7272.T", hq: "Japan" }, "Back-end assembly tools via Yamaha Robotics (Shinkawa)"),
        ],
      },
      {
        id: "stack-inspection",
        shortName: "Stack inspection",
        name: "Bump & stack inspection",
        summary: "Checking micro-bumps and bonded stacks for defects.",
        description:
          "Micro-bumps are measured for height and coplanarity before bonding. After bonding, stacks are inspected for voids, cracks and misalignment, which often needs X-ray or infrared imaging because the joints are hidden inside the stack.",
        companies: [
          at({ name: "Camtek", ticker: "CAMT", hq: "Israel" }, "Bump and advanced-packaging inspection"),
          at(kla, "Advanced-packaging inspection"),
          at(onto, "Bump metrology and packaging lithography"),
          at({ name: "Nordson", ticker: "NDSN", hq: "US" }, "X-ray and acoustic inspection"),
        ],
      },
    ],
  },
  {
    id: "fabrication",
    label: "Fabrication & stacking",
    summary: "Making the DRAM dies and base die, then stacking them into a cube.",
    nodes: [
      {
        id: "dram-fab",
        shortName: "DRAM fabs",
        inputs: ["silicon-wafers", "precursors", "photoresists", "copper-tungsten", "hbm-designers", "lithography", "deposition-etch", "metrology-inspection", "tsv-formation"],
        name: "DRAM core-die fabs",
        summary: "Manufacturing the memory dies at leading-edge DRAM nodes.",
        description:
          "Only three companies make HBM at volume, all on their most advanced DRAM nodes. China's leading DRAM maker is developing HBM but is limited by export controls on equipment.",
        companies: [
          at(skHynix, "DRAM core dies for HBM"),
          at(samsung, "DRAM core dies for HBM"),
          at(micron, "DRAM core dies for HBM"),
          at({ name: "CXMT", hq: "China" }, "Chinese DRAM maker developing HBM"),
        ],
      },
      {
        id: "base-die",
        inputs: ["silicon-wafers", "hbm-designers"],
        name: "Base (logic) die",
        summary: "The bottom die that controls the stack.",
        description:
          "The base die sits at the bottom of the stack. It handles the interface to the accelerator, tests the stack and routes signals. Through HBM3E it was built on a DRAM process. From HBM4 onward, it increasingly moves to a logic foundry process, which brings TSMC into the memory supply chain.",
        companies: [
          at(tsmc, "Logic base dies for HBM4"),
          at(samsung, "Base dies via Samsung Foundry"),
          at(skHynix, "Base-die design, with TSMC manufacturing for HBM4"),
          at(micron, "In-house base dies"),
        ],
      },
      {
        id: "stacking",
        shortName: "HBM stacking",
        inputs: ["probe-cards", "base-die", "plating-chemistry", "underfill-ncf", "thinning-dicing", "tc-bonders", "stack-molding", "stack-inspection"],
        name: "TSV, bumping & stacking",
        summary: "Turning finished wafers into 8- to 16-high cubes.",
        description:
          "The memory makers do this step in-house. They reveal the TSVs, plate micro-bumps, thin and dice the wafers, bond 8 to 16 dies onto the base die, then underfill and mold the result. Stacking yield, not DRAM yield, is often what decides who wins an HBM generation.",
        companies: [
          at(skHynix, "Stacking with MR-MUF"),
          at(samsung, "Stacking with TC-NCF"),
          at(micron, "Stacking with TC-NCF"),
        ],
      },
    ],
  },
  {
    id: "test",
    label: "Test",
    summary: "Proving every die, and then every stack, works.",
    nodes: [
      {
        id: "probe-cards",
        inputs: ["dram-fab"],
        name: "Probe cards",
        summary: "Needle arrays that test dies while still on the wafer.",
        description:
          "Every DRAM die is probed on the wafer before stacking, because a stack is only as good as its worst die. Fine-pitch probing of TSVs and bumps needs especially advanced probe cards.",
        companies: [
          at({ name: "FormFactor", ticker: "FORM", hq: "US" }, "DRAM and HBM probe cards"),
          at({ name: "Technoprobe", ticker: "TPRO.MI", hq: "Italy" }, "Probe cards"),
          at({ name: "Micronics Japan", ticker: "6871.T", hq: "Japan" }, "DRAM probe cards"),
        ],
      },
      {
        id: "stack-test",
        shortName: "Stack test",
        inputs: ["stacking"],
        name: "Stack test & burn-in",
        summary: "Testers, handlers and sockets for the finished cube.",
        description:
          "Finished stacks are tested at speed and burned in before they ship. HBM needs many more test steps than standard DRAM, and that has made memory testers one of the fastest-growing equipment categories.",
        companies: [
          at(advantest, "Memory test systems"),
          at({ name: "Teradyne", ticker: "TER", hq: "US" }, "Memory test systems"),
          at({ name: "Techwing", ticker: "089030.KQ", hq: "South Korea" }, "Memory test handlers"),
          at({ name: "ISC", ticker: "095340.KQ", hq: "South Korea" }, "Test sockets"),
        ],
      },
    ],
  },
  {
    id: "integration",
    label: "Package integration",
    summary: "HBM stacks are placed beside the compute die.",
    callout: "HBM joins the AI chip here",
    nodes: [
      {
        id: "cowos",
        shortName: "CoWoS packaging",
        inputs: ["stack-test", "controller-ip"],
        name: "2.5D packaging (CoWoS)",
        summary: "Mounting the stacks next to the compute die on an interposer.",
        description:
          "Finished HBM stacks ship to the packaging house, where they are placed millimetres from the compute die on a silicon interposer or bridge. The interposer carries thousands of wires between them. Packaging capacity, especially TSMC's CoWoS, has often limited how many AI chips could be built.",
        companies: [
          at(tsmc, "CoWoS 2.5D packaging"),
          at({ name: "ASE Technology", ticker: "ASX", hq: "Taiwan" }, "2.5D packaging, including SPIL"),
          at({ name: "Amkor Technology", ticker: "AMKR", hq: "US" }, "2.5D advanced packaging"),
          at(samsung, "I-Cube 2.5D packaging"),
        ],
      },
      {
        id: "accelerator-vendors",
        shortName: "AI accelerator",
        inputs: ["cowos"],
        name: "Finished AI accelerator",
        summary: "The packaged chip, with its HBM, shipped as the AI accelerator.",
        description:
          "Accelerator vendors qualify HBM from each supplier, often taking most of a generation's output. The number of stacks per chip keeps rising, and HBM is now one of the largest single costs in an AI accelerator.",
        companies: [
          at(nvidia, "GPU accelerators"),
          at(amd, "Instinct accelerators"),
          at(broadcom, "Custom accelerators for hyperscalers"),
          at({ name: "Alphabet", ticker: "GOOGL", hq: "US" }, "TPU accelerators"),
          at({ name: "Amazon", ticker: "AMZN", hq: "US" }, "Trainium accelerators"),
        ],
      },
    ],
  },
];
