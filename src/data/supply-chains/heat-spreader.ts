import type { Company, SupplyChainStage } from "../products";

/**
 * Supply chain for the integrated heat spreader (the package "lid") of an AI accelerator,
 * ordered upstream → downstream — from copper ore all the way to the finished, lidded chip.
 * Companies are the major players at each node; no market-share figures yet.
 */

type Co = Omit<Company, "role">;
const at = (co: Co, role: string): Company => ({ ...co, role });

// Companies that appear at more than one node.
const codelco: Co = { name: "Codelco", hq: "Chile" };
const freeport: Co = { name: "Freeport-McMoRan", ticker: "FCX", hq: "US" };
const cmoc: Co = { name: "CMOC Group", ticker: "603993.SS", hq: "China" };
const sumitomoMetalMining: Co = { name: "Sumitomo Metal Mining", ticker: "5713.T", hq: "Japan" };
const aurubis: Co = { name: "Aurubis", ticker: "NDA.DE", hq: "Germany" };
const tanaka: Co = { name: "Tanaka Precious Metal Group", hq: "Japan" };
const elementSolutions: Co = { name: "Element Solutions", ticker: "ESI", hq: "US" };
const mks: Co = { name: "MKS", ticker: "MKSI", hq: "US" };
const uyemura: Co = { name: "C. Uyemura & Co.", ticker: "4966.T", hq: "Japan" };
const shinEtsu: Co = { name: "Shin-Etsu Chemical", ticker: "4063.T", hq: "Japan" };
const nvidia: Co = { name: "NVIDIA", ticker: "NVDA", hq: "US" };
const amd: Co = { name: "AMD", ticker: "AMD", hq: "US" };
const broadcom: Co = { name: "Broadcom", ticker: "AVGO", hq: "US" };
const tsmc: Co = { name: "TSMC", ticker: "TSM", hq: "Taiwan" };
const synopsys: Co = { name: "Synopsys", ticker: "SNPS", hq: "US" };
const cadence: Co = { name: "Cadence Design Systems", ticker: "CDNS", hq: "US" };
const jentech: Co = { name: "Jentech Precision Industrial", ticker: "3653.TW", hq: "Taiwan" };
const shinko: Co = { name: "Shinko Electric Industries", hq: "Japan" };
const iChiun: Co = { name: "I-Chiun Precision Industry", ticker: "2486.TW", hq: "Taiwan" };
const ase: Co = { name: "ASE Technology", ticker: "ASX", hq: "Taiwan" };
const amkor: Co = { name: "Amkor Technology", ticker: "AMKR", hq: "US" };

export const heatSpreaderSupplyChain: SupplyChainStage[] = [
  {
    id: "raw-materials",
    label: "Raw materials",
    summary: "The metals mined to make the lid and its coatings.",
    nodes: [
      {
        id: "copper-ore",
        name: "Copper ore",
        summary: "The main material of the lid by weight.",
        description:
          "Copper is used for heat spreaders because it conducts heat better than almost any other affordable metal, at roughly 400 W/m·K. Nearly every AI accelerator lid is a solid block of copper. Ore is mined mainly in Chile, Peru, the DRC and the US, then concentrated before it goes to a smelter.",
        companies: [
          at(codelco, "World's largest copper miner (state-owned)"),
          at(freeport, "Copper mining in the Americas and Indonesia"),
          at({ name: "BHP", ticker: "BHP", hq: "Australia" }, "Copper mining, including Escondida"),
          at({ name: "Southern Copper", ticker: "SCCO", hq: "US" }, "Copper mining in Peru and Mexico"),
          at({ name: "Glencore", ticker: "GLEN.L", hq: "Switzerland" }, "Copper mining and trading"),
        ],
      },
      {
        id: "nickel",
        name: "Nickel",
        summary: "The protective coating plated over the copper.",
        description:
          "Bare copper oxidises and reacts with solder, so every lid gets a few microns of nickel plating. The plating protects the surface, gives the lid its silver-grey finish, and acts as a barrier between the copper and the thermal interface material. Plating-grade nickel comes from Class 1 refined nickel.",
        companies: [
          at({ name: "Vale", ticker: "VALE", hq: "Brazil" }, "Class 1 nickel, including plating rounds"),
          at({ name: "Norilsk Nickel", hq: "Russia" }, "Large Class 1 nickel producer"),
          at(sumitomoMetalMining, "Nickel mining and refining"),
          at({ name: "Tsingshan Holding Group", hq: "China" }, "Indonesian nickel production"),
          at({ name: "Eramet", ticker: "ERA.PA", hq: "France" }, "Nickel mining in New Caledonia and Indonesia"),
        ],
      },
      {
        id: "gold",
        name: "Gold & precious metals",
        summary: "A thin gold layer that lets indium solder bond to the lid.",
        description:
          "High-power AI chips often attach the lid to the die with indium solder instead of thermal paste. Indium wets gold much better than nickel, so the underside of the lid often gets a flash coat of gold only fractions of a micron thick. Mined gold is refined to high purity and converted into plating salts.",
        companies: [
          at({ name: "Newmont", ticker: "NEM", hq: "US" }, "Gold mining"),
          at({ name: "Agnico Eagle Mines", ticker: "AEM", hq: "Canada" }, "Gold mining"),
          at({ name: "Heraeus", hq: "Germany" }, "Precious-metal refining"),
          at(tanaka, "Precious-metal refining and gold plating salts"),
          at({ name: "Umicore", ticker: "UMI.BR", hq: "Belgium" }, "Precious-metal refining and recycling"),
        ],
      },
      {
        id: "refractory-metals",
        name: "Tungsten, molybdenum & SiC",
        summary: "Inputs for low-expansion composite lids.",
        description:
          "Copper expands much more with heat than silicon does. On very large packages, that mismatch can warp the lid or crack its bond to the die. Some designs therefore use composite lids of copper-tungsten, copper-molybdenum or aluminium silicon carbide, which expand less with heat. These materials come from a separate, China-heavy supply chain.",
        companies: [
          at({ name: "China Tungsten & Hightech Materials", ticker: "000657.SZ", hq: "China" }, "Tungsten mining and powders"),
          at(cmoc, "Molybdenum and tungsten mining"),
          at(freeport, "Molybdenum mining through Climax"),
          at({ name: "Saint-Gobain", ticker: "SGO.PA", hq: "France" }, "Silicon carbide grains and powders"),
        ],
      },
    ],
  },
  {
    id: "materials",
    label: "Refining & materials",
    summary: "Turning metal into lid-grade copper strip, coatings and adhesives.",
    nodes: [
      {
        id: "copper-cathode",
        name: "Copper smelting & cathode",
        summary: "Concentrate refined to 99.99% copper.",
        description:
          "Smelters melt copper concentrate into blister copper, and electrolytic refining then turns it into cathode plates of at least 99.99% purity. Cathode is the global benchmark copper product and the feedstock for every downstream copper mill. China now runs over 40% of the world's smelting capacity.",
        companies: [
          at(aurubis, "Europe's largest copper smelter and refiner"),
          at({ name: "Jiangxi Copper", ticker: "600362.SS", hq: "China" }, "Integrated copper mining and refining"),
          at({ name: "Tongling Nonferrous Metals", ticker: "000630.SZ", hq: "China" }, "Copper smelting and refining"),
          at(sumitomoMetalMining, "Copper smelting and refining in Japan"),
          at(codelco, "Smelting and refining at its Chilean mines"),
        ],
      },
      {
        id: "oxygen-free-copper",
        name: "Oxygen-free copper strip",
        summary: "Ultra-low-oxygen copper rolled into lid-ready sheet.",
        description:
          "Lids are made from oxygen-free copper (grades such as C10100 and C10200). It is cast in a controlled atmosphere so it contains almost no oxygen, which gives it the highest conductivity and stops it blistering when plated or heated. The cast copper is then rolled to precise thickness and flatness. Only a small group of specialty mills supply electronics-grade oxygen-free copper strip.",
        companies: [
          at({ name: "Mitsubishi Materials", ticker: "5711.T", hq: "Japan" }, "MOFC oxygen-free copper"),
          at(aurubis, "Oxygen-free copper strip and shapes"),
          at({ name: "Wieland", hq: "Germany" }, "Copper strip and rolled products"),
          at({ name: "KME", hq: "Germany" }, "Copper strip and plate"),
          at({ name: "Furukawa Electric", ticker: "5801.T", hq: "Japan" }, "High-performance copper strip"),
          at({ name: "Poongsan", ticker: "103140.KS", hq: "South Korea" }, "Copper and copper-alloy strip"),
        ],
      },
      {
        id: "plating-chemistry",
        name: "Plating chemistry",
        summary: "Nickel and gold baths that coat the copper.",
        description:
          "Electroless and electrolytic nickel baths, together with immersion or electrolytic gold, put down the lid's protective and solder-wettable layers. The coating must be even and pore-free, and impurities must be tightly controlled. Otherwise indium solder will not wet the surface and voids open up between lid and die.",
        companies: [
          at(elementSolutions, "Nickel and gold plating chemistry via MacDermid Enthone"),
          at(mks, "Plating chemistry via Atotech"),
          at(uyemura, "Electroless nickel and gold chemistry"),
          at({ name: "JCU Corporation", ticker: "4975.T", hq: "Japan" }, "Plating chemicals for electronics"),
          at(tanaka, "Gold plating solutions"),
        ],
      },
      {
        id: "composite-materials",
        name: "Composite lid materials",
        summary: "Copper-tungsten, copper-moly and AlSiC blanks.",
        description:
          "Copper-tungsten, copper-molybdenum and aluminium silicon carbide composites are made by powder metallurgy or infiltration. Each lets designers trade some conductivity for a thermal expansion closer to silicon. They are a niche today, but they matter more as packages grow past several reticles in size.",
        companies: [
          at({ name: "Plansee", hq: "Austria" }, "Copper-tungsten and copper-molybdenum heat spreaders"),
          at({ name: "Sumitomo Electric", ticker: "5802.T", hq: "Japan" }, "Composite heat spreaders via A.L.M.T."),
          at({ name: "CPS Technologies", ticker: "CPSH", hq: "US" }, "AlSiC lids and heat spreaders"),
        ],
      },
      {
        id: "lid-adhesives",
        name: "Lid-attach adhesives",
        summary: "Sealants that glue the lid's rim to the substrate.",
        description:
          "The lid's rim is bonded to the package substrate with a silicone or epoxy adhesive. The adhesive has to hold the lid in place, seal the cavity, and absorb some of the warpage between a copper lid and an organic substrate across thousands of thermal cycles.",
        companies: [
          at({ name: "Dow", ticker: "DOW", hq: "US" }, "Silicone adhesives and sealants"),
          at(shinEtsu, "Silicone adhesives"),
          at({ name: "Henkel", ticker: "HEN3.DE", hq: "Germany" }, "Lid-attach adhesives (Loctite Ablestik)"),
          at({ name: "Momentive Performance Materials", hq: "US" }, "Silicone adhesives"),
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design & simulation",
    summary: "Deciding the lid's shape, thickness and finish for each chip.",
    nodes: [
      {
        id: "package-design",
        name: "Package & thermal design",
        summary: "Accelerator and packaging teams who specify the lid.",
        description:
          "Every lid is custom-made for one package. The chip designer and the packaging house set its footprint, cavity depth, thickness, plating stack and pedestal shape so that it clears the dies and memory stacks, controls warpage, and meets the cooler with a flat surface. Each new accelerator generation means a new lid.",
        companies: [
          at(nvidia, "Specifies lids for its GPU accelerators"),
          at(amd, "Specifies lids for its Instinct accelerators"),
          at(broadcom, "Package design for custom hyperscaler accelerators"),
          at(tsmc, "CoWoS package co-design, including lid and stiffener"),
        ],
      },
      {
        id: "thermal-simulation",
        name: "Thermal & warpage simulation",
        summary: "Software that models heat flow and lid bending.",
        description:
          "Before any tooling is cut, engineers simulate heat flow from die to lid to cold plate, and model how the lid and substrate bend as the package heats and cools. The results set the lid's thickness, the TIM bond-line, and whether a composite lid is needed.",
        companies: [
          at(synopsys, "Icepak and Mechanical via its Ansys acquisition"),
          at(cadence, "Celsius thermal solver"),
          at({ name: "Siemens", ticker: "SIE.DE", hq: "Germany" }, "Simcenter Flotherm"),
          at({ name: "Dassault Systèmes", ticker: "DSY.PA", hq: "France" }, "SIMULIA structural simulation"),
        ],
      },
    ],
  },
  {
    id: "equipment",
    label: "Equipment & tooling",
    summary: "The presses, machines and gauges that shape and check each lid.",
    nodes: [
      {
        id: "stamping-presses",
        name: "Stamping & coining presses",
        summary: "Presses that form the lid from copper strip.",
        description:
          "Most lids start as copper strip fed through a progressive die. Each press stroke blanks the outline, coins the cavity and forms the rim, and coining also sets the flatness of the top surface. Larger AI lids need more press tonnage and tighter control.",
        companies: [
          at({ name: "AIDA Engineering", ticker: "6118.T", hq: "Japan" }, "Servo and precision stamping presses"),
          at({ name: "Komatsu", ticker: "6301.T", hq: "Japan" }, "Servo presses via Komatsu Industries"),
          at({ name: "Amada", ticker: "6113.T", hq: "Japan" }, "Precision stamping presses"),
          at({ name: "Andritz", ticker: "ANDR.VI", hq: "Austria" }, "Presses via Schuler"),
          at({ name: "Bruderer", hq: "Switzerland" }, "High-speed precision stamping presses"),
        ],
      },
      {
        id: "tool-steel-dies",
        name: "Tool steel & dies",
        summary: "Hardened steel dies that shape every lid.",
        description:
          "Progressive dies are machined from premium tool steel and carbide, and much of the lid's accuracy depends on them. Dies wear and are reground over time, and each new package design needs a new set.",
        companies: [
          at({ name: "voestalpine", ticker: "VOE.VI", hq: "Austria" }, "Tool steels via Böhler and Uddeholm"),
          at({ name: "Daido Steel", ticker: "5471.T", hq: "Japan" }, "Tool and die steels"),
          at({ name: "Proterial", hq: "Japan" }, "Tool steels (formerly Hitachi Metals)"),
          at({ name: "Misumi Group", ticker: "9962.T", hq: "Japan" }, "Standard die components"),
        ],
      },
      {
        id: "cnc-machining",
        name: "CNC machining",
        summary: "Milling cavities and pedestals stamping can't reach.",
        description:
          "Thick or complex lids, such as those with pedestals over each die, multiple cavities or deep pockets, are partly or fully CNC-milled from solid copper plate. They are then lapped to flatness within tens of microns. Machining is slower than stamping but more flexible, so it is common in early production of new designs.",
        companies: [
          at({ name: "DMG Mori", ticker: "6141.T", hq: "Japan" }, "Machining centres"),
          at({ name: "FANUC", ticker: "6954.T", hq: "Japan" }, "Robodrill machining centres and CNC controls"),
          at({ name: "Makino", ticker: "6135.T", hq: "Japan" }, "Precision machining centres"),
          at({ name: "Okuma", ticker: "6103.T", hq: "Japan" }, "Machining centres"),
        ],
      },
      {
        id: "plating-lines",
        name: "Plating lines",
        summary: "Automated lines that nickel- and gold-plate lids in volume.",
        description:
          "Formed lids are cleaned, activated and run through nickel and gold baths on racks or in barrels. The process must be tightly controlled, because thickness variation and contamination translate directly into thermal performance.",
        companies: [
          at(mks, "Plating equipment via Atotech"),
          at(uyemura, "Plating lines and process equipment"),
          at({ name: "Technic", hq: "US" }, "Plating equipment and chemistry"),
        ],
      },
      {
        id: "flatness-metrology",
        name: "Flatness & warpage metrology",
        summary: "Gauges that verify the lid is flat to microns.",
        description:
          "A lid that is not flat leaves gaps against the die or the cold plate, and those gaps act as thermal insulation. Lids are measured for flatness, coplanarity and plating thickness, and finished packages are checked for warpage across temperature.",
        companies: [
          at({ name: "Keyence", ticker: "6861.T", hq: "Japan" }, "Optical and laser measurement"),
          at({ name: "Ametek", ticker: "AME", hq: "US" }, "Optical flatness metrology via Zygo"),
          at({ name: "Akrometrix", hq: "US" }, "Thermal warpage measurement"),
          at({ name: "Mitutoyo", hq: "Japan" }, "Coordinate measuring machines"),
          at({ name: "Carl Zeiss", hq: "Germany" }, "Coordinate measuring machines"),
        ],
      },
    ],
  },
  {
    id: "fabrication",
    label: "Lid manufacturing",
    summary: "Forming, plating and inspecting the finished heat spreader.",
    nodes: [
      {
        id: "lid-makers",
        name: "Heat-spreader makers",
        summary: "Specialists who turn copper strip into finished lids.",
        description:
          "A small group of precision metal specialists, mostly in Taiwan and Japan, stamp, machine, plate and inspect lids to each chip vendor's drawing. Qualification takes months, and each design is usually single- or dual-sourced. This makes the lid a small-dollar part with surprisingly concentrated supply.",
        companies: [
          at(jentech, "Leading lid supplier for AI accelerators and CPUs"),
          at(shinko, "Heat spreaders and package components"),
          at(iChiun, "Stamped heat spreaders and lead frames"),
        ],
      },
      {
        id: "surface-finish",
        name: "Plating & surface finish",
        summary: "Nickel and gold layers applied to the formed lid.",
        description:
          "Formed lids are nickel-plated all over, and the area that meets the die may get a selective gold flash for indium solder. Many lid makers plate in-house to protect yields, using chemistry and process support from the plating suppliers.",
        companies: [
          at(jentech, "In-house nickel and gold plating"),
          at(shinko, "In-house plating"),
          at(uyemura, "Plating process and chemistry support"),
          at(elementSolutions, "Plating process and chemistry support"),
        ],
      },
    ],
  },
  {
    id: "assembly",
    label: "Package assembly",
    summary: "The lid is bonded onto the package.",
    callout: "The heat spreader joins the AI chip here",
    nodes: [
      {
        id: "lid-attach",
        name: "TIM & lid attach",
        summary: "Bonding the lid over the dies and onto the substrate.",
        description:
          "After the compute die and HBM stacks are mounted on the interposer and substrate, thermal interface material is applied to the tops of the dies. It is either dispensed paste or an indium preform. Adhesive goes on the substrate where the lid's rim will sit. The lid is placed, pressed and cured or reflowed, and from then on it is part of the package. For CoWoS-based accelerators this happens at TSMC or its OSAT partners.",
        companies: [
          at(tsmc, "Lid attach as part of CoWoS packaging"),
          at(ase, "Lid attach and final assembly, including SPIL"),
          at(amkor, "Advanced package assembly and lid attach"),
        ],
      },
      {
        id: "lid-attach-equipment",
        name: "Dispensing & lid-attach tools",
        summary: "Machines that dispense TIM and place the lid.",
        description:
          "Precision dispensers lay down TIM and adhesive in exact patterns and volumes, and placement tools then set the lid under controlled force. The bond-line thickness must be uniform to within a few microns across a die larger than a postage stamp.",
        companies: [
          at({ name: "Nordson", ticker: "NDSN", hq: "US" }, "Precision fluid dispensing"),
          at({ name: "ASMPT", ticker: "0522.HK", hq: "Singapore" }, "Assembly and lid-attach equipment"),
          at({ name: "Musashi Engineering", hq: "Japan" }, "Precision dispensing systems"),
        ],
      },
    ],
  },
  {
    id: "final",
    label: "Final test & delivery",
    summary: "Proving the lidded package can shed its heat, then shipping it.",
    nodes: [
      {
        id: "package-test",
        name: "Package test & burn-in",
        summary: "Running the finished chip at full power.",
        description:
          "Each finished package is tested electrically and often burned in at high power and temperature. Heat that the lid fails to move off the die shows up here as hot spots or throttling. Testers for AI chips need active thermal control capable of removing a kilowatt or more per device.",
        companies: [
          at({ name: "Advantest", ticker: "6857.T", hq: "Japan" }, "SoC and system-level test"),
          at({ name: "Teradyne", ticker: "TER", hq: "US" }, "SoC and system-level test"),
          at({ name: "Aehr Test Systems", ticker: "AEHR", hq: "US" }, "Burn-in systems for AI processors"),
        ],
      },
      {
        id: "accelerator-vendors",
        name: "Finished AI accelerator",
        summary: "The lidded package, shipped as the AI chip.",
        description:
          "The tested package goes to the accelerator vendor, who ships it to board and server builders. There the lid's top face meets a cold plate or heat sink, and it remains the chip's only route for getting rid of its heat.",
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
