import type { Company, SupplyChainStage } from "../products";

/**
 * Supply chain for the leading-edge compute (logic) die of an AI accelerator,
 * ordered upstream → downstream. Companies are the major players at each node;
 * no market-share figures yet.
 */

type Co = Omit<Company, "role">;
const at = (co: Co, role: string): Company => ({ ...co, role });

// Companies that appear at more than one node.
const shinEtsu: Co = { name: "Shin-Etsu Chemical", ticker: "4063.T", hq: "Japan" };
const linde: Co = { name: "Linde", ticker: "LIN", hq: "UK" };
const airLiquide: Co = { name: "Air Liquide", ticker: "AI.PA", hq: "France" };
const entegris: Co = { name: "Entegris", ticker: "ENTG", hq: "US" };
const dupont: Co = { name: "DuPont", ticker: "DD", hq: "US" };
const resonac: Co = { name: "Resonac", ticker: "4004.T", hq: "Japan" };
const synopsys: Co = { name: "Synopsys", ticker: "SNPS", hq: "US" };
const cadence: Co = { name: "Cadence Design Systems", ticker: "CDNS", hq: "US" };
const amat: Co = { name: "Applied Materials", ticker: "AMAT", hq: "US" };
const lam: Co = { name: "Lam Research", ticker: "LRCX", hq: "US" };
const tel: Co = { name: "Tokyo Electron", ticker: "8035.T", hq: "Japan" };
const hitachi: Co = { name: "Hitachi High-Tech", ticker: "6501.T", hq: "Japan" };
const lasertec: Co = { name: "Lasertec", ticker: "6920.T", hq: "Japan" };

export const computeDieSupplyChain: SupplyChainStage[] = [
  {
    id: "raw-materials",
    label: "Raw materials",
    summary: "What comes out of the ground before any chemistry happens.",
    nodes: [
      {
        id: "high-purity-quartz",
        name: "High-purity quartz",
        summary: "The mineral source of all semiconductor-grade silicon.",
        description:
          "Silicon starts as quartz. Ordinary sand is far too dirty, so the industry relies on a few deposits of exceptionally pure quartz — most famously around Spruce Pine, North Carolina. It is used both as feedstock for silicon and to make the fused-quartz crucibles that silicon crystals are grown in.",
        companies: [
          at({ name: "Sibelco", hq: "Belgium" }, "Mines and processes high-purity quartz at Spruce Pine"),
          at({ name: "The Quartz Corp" }, "Mines and refines high-purity quartz at Spruce Pine"),
          at({ name: "Heraeus", hq: "Germany" }, "Fused-quartz crucibles and process glassware"),
          at(shinEtsu, "Quartz products through its Shin-Etsu Quartz subsidiary"),
        ],
      },
      {
        id: "base-metals",
        name: "Copper, cobalt & tungsten",
        summary: "Metals that become the chip's internal wiring and contacts.",
        description:
          "A modern logic die contains kilometres of copper wiring stacked in more than a dozen layers, with cobalt and tungsten used for the tiniest contacts and liners. These metals are mined at scale, then refined to extreme purity before they reach a fab.",
        companies: [
          at({ name: "Freeport-McMoRan", ticker: "FCX", hq: "US" }, "Copper mining"),
          at({ name: "BHP", ticker: "BHP", hq: "Australia" }, "Copper mining"),
          at({ name: "Glencore", ticker: "GLEN.L", hq: "Switzerland" }, "Copper and cobalt mining and trading"),
          at({ name: "CMOC Group", ticker: "603993.SS", hq: "China" }, "Cobalt and copper mining"),
        ],
      },
      {
        id: "noble-gases",
        name: "Neon & noble gases",
        summary: "Gases that power the lasers used in lithography.",
        description:
          "Deep-ultraviolet lithography lasers run on gas mixtures that are mostly neon, with argon, krypton and xenon also used in the fab. Neon is captured as a by-product of large air-separation plants, so supply is tied to the industrial-gas majors and, historically, to steel production in Ukraine and Russia.",
        companies: [
          at(linde, "Air separation and rare-gas purification"),
          at(airLiquide, "Air separation and rare-gas supply"),
          at({ name: "Air Products", ticker: "APD", hq: "US" }, "Industrial and specialty gases"),
          at({ name: "Nippon Sanso Holdings", ticker: "4091.T", hq: "Japan" }, "Industrial gases for Asian fabs"),
        ],
      },
      {
        id: "fluorspar",
        name: "Fluorspar & fluorine",
        summary: "The mineral behind the etching and cleaning chemistry.",
        description:
          "Fluorspar is processed into hydrogen fluoride and a family of fluorinated gases. They are used to etch patterns into silicon and to clean chambers between process steps. The highest-purity grades come from a small group of mainly Japanese chemical companies.",
        companies: [
          at({ name: "Orbia", ticker: "ORBIA.MX", hq: "Mexico" }, "Fluorspar mining and fluorine chemistry"),
          at({ name: "Stella Chemifa", ticker: "4109.T", hq: "Japan" }, "Ultra-high-purity hydrogen fluoride"),
          at({ name: "Kanto Denka Kogyo", ticker: "4047.T", hq: "Japan" }, "Fluorinated etching gases"),
        ],
      },
    ],
  },
  {
    id: "materials",
    label: "Refining & materials",
    summary: "Turning raw inputs into fab-ready wafers and chemicals.",
    nodes: [
      {
        id: "polysilicon",
        name: "Polysilicon",
        summary: "Silicon purified to eleven nines.",
        description:
          "Metallurgical silicon is converted into a gas and redeposited as ultra-pure polysilicon. Solar-grade polysilicon is plentiful, but semiconductor grade requires far higher purity, and only a few plants in the world make it.",
        companies: [
          at({ name: "Wacker Chemie", ticker: "WCH.DE", hq: "Germany" }, "Semiconductor-grade polysilicon"),
          at({ name: "Hemlock Semiconductor", hq: "US" }, "Semiconductor-grade polysilicon"),
          at({ name: "Tokuyama", ticker: "4043.T", hq: "Japan" }, "Semiconductor-grade polysilicon"),
          at({ name: "OCI Holdings", ticker: "010060.KS", hq: "South Korea" }, "Polysilicon production"),
        ],
      },
      {
        id: "silicon-wafers",
        name: "Silicon wafers",
        summary: "300 mm single-crystal discs every chip is built on.",
        description:
          "Polysilicon is melted and pulled into a single-crystal ingot, then sliced, polished and inspected into 300 mm wafers. The market is a tight oligopoly, and leading-edge logic needs the flattest, most defect-free grades.",
        companies: [
          at(shinEtsu, "Largest prime silicon wafer maker"),
          at({ name: "SUMCO", ticker: "3436.T", hq: "Japan" }, "300 mm prime wafers"),
          at({ name: "GlobalWafers", ticker: "6488.TWO", hq: "Taiwan" }, "300 mm wafers"),
          at({ name: "Siltronic", ticker: "WAF.DE", hq: "Germany" }, "300 mm wafers"),
          at({ name: "SK siltron", hq: "South Korea" }, "300 mm wafers (SK Group)"),
        ],
      },
      {
        id: "photoresists",
        name: "Photoresists",
        summary: "Light-sensitive coatings that capture the circuit pattern.",
        description:
          "Each lithography step coats the wafer in a photoresist that reacts to light and preserves the pattern for etching. EUV and advanced ArF resists are some of the most specialised chemicals in the chain, and Japanese suppliers dominate them.",
        companies: [
          at({ name: "Tokyo Ohka Kogyo", ticker: "4186.T", hq: "Japan" }, "EUV and ArF photoresists"),
          at({ name: "JSR", hq: "Japan" }, "EUV and ArF photoresists"),
          at(shinEtsu, "ArF and EUV photoresists"),
          at({ name: "Sumitomo Chemical", ticker: "4005.T", hq: "Japan" }, "Photoresists"),
          at({ name: "Fujifilm", ticker: "4901.T", hq: "Japan" }, "Photoresists and process materials"),
          at(dupont, "Photoresists and ancillaries"),
        ],
      },
      {
        id: "process-chemicals",
        name: "Specialty gases & wet chemicals",
        summary: "Hundreds of ultra-pure gases, acids and solvents.",
        description:
          "Deposition, etch and cleaning steps use a long list of specialty gases and wet chemicals, and each must be kept free of contamination at the parts-per-trillion level. Suppliers often build plants right beside the fabs they serve.",
        companies: [
          at(linde, "Specialty and electronic gases"),
          at(airLiquide, "Electronic specialty gases and on-site supply"),
          at({ name: "Merck KGaA", ticker: "MRK.DE", hq: "Germany" }, "Electronic materials, gases and precursors"),
          at(entegris, "Specialty chemicals, filtration and purity"),
          at(resonac, "Electronic gases and chemicals"),
        ],
      },
      {
        id: "sputtering-targets",
        name: "Sputtering targets",
        summary: "Ultra-pure metal blocks used to deposit thin films.",
        description:
          "Thin layers of copper, tantalum, titanium and cobalt are deposited by bombarding a target of the pure metal so that atoms coat the wafer. Making these targets takes purity, microstructure control and bonding know-how.",
        companies: [
          at({ name: "JX Advanced Metals", ticker: "5016.T", hq: "Japan" }, "Sputtering targets"),
          at({ name: "Honeywell", ticker: "HON", hq: "US" }, "Sputtering targets via Honeywell Electronic Materials"),
          at({ name: "Materion", ticker: "MTRN", hq: "US" }, "Precious and specialty metal targets"),
          at({ name: "Tosoh", ticker: "4042.T", hq: "Japan" }, "Sputtering targets and quartz"),
        ],
      },
      {
        id: "cmp-consumables",
        name: "CMP slurries & pads",
        summary: "Abrasives that polish every layer perfectly flat.",
        description:
          "After each layer is deposited, chemical-mechanical planarisation grinds it flat with an engineered slurry and polishing pad. A leading-edge die goes through dozens of these steps, which makes slurries and pads a recurring consumable.",
        companies: [
          at(entegris, "CMP slurries and pads (formerly CMC Materials)"),
          at(dupont, "CMP pads and slurries"),
          at({ name: "Fujimi", ticker: "5384.T", hq: "Japan" }, "Polishing slurries"),
          at(resonac, "CMP slurries"),
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design & IP",
    summary: "The blueprint — architecture, software tools and licensed building blocks.",
    nodes: [
      {
        id: "chip-designers",
        name: "Chip designers",
        summary: "Companies that architect the accelerator.",
        description:
          "Chip designers define the architecture: tensor cores, on-chip memory and interconnect. Most are fabless and send the finished design to a foundry. Alongside merchant GPU vendors, hyperscalers now design custom accelerators, often with a design partner.",
        companies: [
          at({ name: "NVIDIA", ticker: "NVDA", hq: "US" }, "GPU accelerators"),
          at({ name: "AMD", ticker: "AMD", hq: "US" }, "GPU accelerators"),
          at({ name: "Broadcom", ticker: "AVGO", hq: "US" }, "Custom AI accelerators for hyperscalers"),
          at({ name: "Marvell Technology", ticker: "MRVL", hq: "US" }, "Custom AI accelerators"),
          at({ name: "Alphabet", ticker: "GOOGL", hq: "US" }, "In-house TPU accelerators"),
          at({ name: "Amazon", ticker: "AMZN", hq: "US" }, "In-house Trainium accelerators"),
        ],
      },
      {
        id: "eda-software",
        name: "EDA software",
        summary: "The software every chip is designed and verified in.",
        description:
          "Electronic design automation tools turn an architecture into billions of placed and verified transistors. Three vendors cover almost the entire leading-edge flow, so no advanced chip can be built without their software.",
        companies: [
          at(synopsys, "Synthesis, verification and simulation"),
          at(cadence, "Place-and-route, verification and simulation"),
          at({ name: "Siemens", ticker: "SIE.DE", hq: "Germany" }, "Physical verification via Siemens EDA"),
        ],
      },
      {
        id: "ip-cores",
        name: "IP cores",
        summary: "Licensed building blocks like CPUs and high-speed I/O.",
        description:
          "Designers license ready-made blocks instead of building everything from scratch, for example CPU cores, memory controllers and SerDes for chip-to-chip links. These blocks are paid for through upfront licences and per-chip royalties.",
        companies: [
          at({ name: "Arm Holdings", ticker: "ARM", hq: "UK" }, "CPU cores and architecture licences"),
          at(synopsys, "Interface and memory IP"),
          at(cadence, "Interface and memory IP"),
          at({ name: "Rambus", ticker: "RMBS", hq: "US" }, "Memory interface IP and chips"),
        ],
      },
    ],
  },
  {
    id: "equipment",
    label: "Equipment & tooling",
    summary: "The machines and masks that make manufacturing possible.",
    nodes: [
      {
        id: "lithography",
        name: "Lithography",
        summary: "Printing circuit patterns with light.",
        description:
          "Lithography scanners project the circuit pattern onto the wafer. Extreme-ultraviolet (EUV) tools, which every leading-edge die requires, come from a single supplier and depend on a deep supply chain of optics and lasers.",
        companies: [
          at({ name: "ASML", ticker: "ASML", hq: "Netherlands" }, "Sole supplier of EUV scanners"),
          at({ name: "Carl Zeiss SMT", hq: "Germany" }, "EUV optics for ASML"),
          at({ name: "Trumpf", hq: "Germany" }, "CO₂ drive lasers for EUV light sources"),
          at({ name: "Nikon", ticker: "7731.T", hq: "Japan" }, "DUV scanners"),
          at({ name: "Canon", ticker: "7751.T", hq: "Japan" }, "DUV and nanoimprint lithography"),
        ],
      },
      {
        id: "deposition",
        name: "Deposition",
        summary: "Building up thin films atom by atom.",
        description:
          "Deposition tools grow the insulating, conducting and barrier films that make up each layer of the die, using CVD, PVD, ALD and epitaxy. Leading-edge transistors depend on atomic-layer precision.",
        companies: [
          at(amat, "CVD, PVD and epitaxy"),
          at(lam, "CVD and ALD"),
          at(tel, "CVD, ALD and coater/developers"),
          at({ name: "ASM International", ticker: "ASM.AS", hq: "Netherlands" }, "ALD and epitaxy"),
          at({ name: "Kokusai Electric", ticker: "6525.T", hq: "Japan" }, "Batch deposition"),
        ],
      },
      {
        id: "etch",
        name: "Etch",
        summary: "Carving the pattern into each layer.",
        description:
          "Plasma etch tools remove material wherever the photoresist leaves it exposed. Newer transistor designs such as gate-all-around need extremely deep, narrow and selective etches, so etch counts per wafer keep rising.",
        companies: [
          at(lam, "Conductor and dielectric etch"),
          at(tel, "Dielectric etch"),
          at(amat, "Conductor etch"),
          at(hitachi, "Conductor etch"),
        ],
      },
      {
        id: "metrology-inspection",
        name: "Metrology & inspection",
        summary: "Finding defects too small to see.",
        description:
          "Every few steps, wafers are measured and scanned for defects so problems are caught before they ruin a lot. At the leading edge this means finding nanometre-scale flaws across a whole 300 mm wafer, and EUV masks need their own dedicated inspection tools.",
        companies: [
          at({ name: "KLA", ticker: "KLAC", hq: "US" }, "Wafer and reticle inspection, metrology"),
          at(amat, "E-beam inspection and review"),
          at({ name: "Onto Innovation", ticker: "ONTO", hq: "US" }, "Metrology and inspection"),
          at(lasertec, "EUV mask inspection"),
          at(hitachi, "CD-SEM metrology"),
        ],
      },
      {
        id: "cmp-clean",
        name: "CMP & wafer cleaning",
        summary: "Polishing and cleaning between process steps.",
        description:
          "CMP tools flatten each layer, and cleaning tools strip away particles and residues. Wafer cleaning is the single most repeated step in a fab.",
        companies: [
          at(amat, "CMP systems"),
          at({ name: "Ebara", ticker: "6361.T", hq: "Japan" }, "CMP systems"),
          at({ name: "SCREEN Holdings", ticker: "7735.T", hq: "Japan" }, "Wafer cleaning"),
          at(tel, "Wafer cleaning"),
          at(lam, "Wafer cleaning"),
        ],
      },
      {
        id: "photomasks",
        name: "Photomasks",
        summary: "The master stencils for each layer.",
        description:
          "Each lithography layer needs a photomask (reticle) carrying that layer's pattern. Leading foundries make most of their advanced masks in-house, but they buy mask blanks, and especially EUV blanks, from a small group of glass and materials specialists.",
        companies: [
          at({ name: "Hoya", ticker: "7741.T", hq: "Japan" }, "EUV and DUV mask blanks"),
          at({ name: "AGC", ticker: "5201.T", hq: "Japan" }, "EUV mask blanks"),
          at({ name: "Photronics", ticker: "PLAB", hq: "US" }, "Merchant photomasks"),
          at({ name: "Dai Nippon Printing", ticker: "7912.T", hq: "Japan" }, "Merchant photomasks"),
          at(lasertec, "Mask blank and reticle inspection"),
        ],
      },
    ],
  },
  {
    id: "fabrication",
    label: "Wafer fabrication",
    summary: "Where it all comes together, over hundreds of process steps.",
    nodes: [
      {
        id: "foundry",
        name: "Leading-edge foundry",
        summary: "Manufacturing the die at the most advanced process nodes.",
        description:
          "A foundry runs a wafer through more than a thousand process steps over several months, using every input above. Only a few companies can manufacture at the leading edge, and almost every merchant and custom AI accelerator is made by just one of them.",
        companies: [
          at({ name: "TSMC", ticker: "TSM", hq: "Taiwan" }, "Leading-edge foundry for nearly all AI accelerators"),
          at({ name: "Samsung Electronics", ticker: "005930.KS", hq: "South Korea" }, "Leading-edge foundry"),
          at({ name: "Intel", ticker: "INTC", hq: "US" }, "Leading-edge foundry via Intel Foundry"),
        ],
      },
    ],
  },
  {
    id: "test",
    label: "Wafer test & sort",
    summary: "Proving each die works before it is packaged.",
    nodes: [
      {
        id: "probe-cards",
        name: "Probe cards",
        summary: "Needle arrays that touch every die on the wafer.",
        description:
          "Probe cards make temporary electrical contact with thousands of pads on each die so it can be tested while still on the wafer. Each card is custom-built for a specific chip design, and AI dies with many pads need especially complex cards.",
        companies: [
          at({ name: "FormFactor", ticker: "FORM", hq: "US" }, "Advanced probe cards"),
          at({ name: "Technoprobe", ticker: "TPRO.MI", hq: "Italy" }, "Probe cards"),
          at({ name: "Micronics Japan", ticker: "6871.T", hq: "Japan" }, "Probe cards"),
        ],
      },
      {
        id: "test-systems",
        name: "Automated test equipment",
        summary: "Testers that run each die through its paces.",
        description:
          "Automated test equipment drives test patterns through each die and sorts out the bad ones before expensive packaging begins. Large, complex AI dies need longer and more thorough test runs.",
        companies: [
          at({ name: "Advantest", ticker: "6857.T", hq: "Japan" }, "SoC and memory test systems"),
          at({ name: "Teradyne", ticker: "TER", hq: "US" }, "SoC test systems"),
        ],
      },
    ],
  },
];
