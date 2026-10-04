import type { ComponentOverview } from "../products";

/**
 * General-knowledge content for the HBM Overview tab. News items link to their source;
 * refresh them (and `newsAsOf`) when updating.
 */
export const hbmMemoryOverview: ComponentOverview = {
  intro: [
    "High-bandwidth memory (HBM) is DRAM built for AI accelerators. Instead of sitting in separate chips on the circuit board, it is stacked into a small cube of 8 to 16 memory dies on top of a logic base die, and placed right beside the compute die on the same package.",
    "The stack is wired vertically with thousands of through-silicon vias, which gives it a very wide interface: 1,024 bits per stack for HBM3E and 2,048 for HBM4, against 64 bits for a standard DDR5 memory module. That width lets a modern accelerator move several terabytes of data per second to and from memory.",
    "Training and running large models is usually limited by how fast data can reach the compute die, not by raw compute. That makes HBM one of the most valuable, and most supply-constrained, parts of an AI chip.",
  ],
  facts: [
    { value: "3", label: "Companies that make HBM at volume" },
    { value: "2,048", label: "Bits of interface width per HBM4 stack" },
    { value: "16", label: "DRAM dies in the tallest HBM4 stacks" },
    { value: "~2 TB/s", label: "Bandwidth per HBM4 stack at the JEDEC baseline speed" },
    { value: "775 µm", label: "Maximum HBM4 stack height, under one millimetre" },
    { value: "~3×", label: "Wafer area per bit compared with standard DRAM" },
  ],
  process: [
    {
      title: "Build DRAM dies with TSVs",
      detail:
        "Memory makers run DRAM wafers on their most advanced nodes and drill thousands of through-silicon vias into every die.",
    },
    {
      title: "Test every die",
      detail:
        "Wafers are probed so that only known-good dies go into a stack, because a single bad die can scrap the whole cube.",
    },
    {
      title: "Thin, stack and bond",
      detail:
        "Wafers are ground to around 30 µm and diced. Then 8 to 16 dies are bonded onto a base die with micro-bumps and underfill.",
    },
    {
      title: "Package beside the compute die",
      detail:
        "Finished stacks ship to TSMC's CoWoS lines or another 2.5D packager. There they sit millimetres from the compute die on a silicon interposer.",
    },
  ],
  generations: [
    { name: "HBM", year: "2015", detail: "JEDEC standard in 2013; first shipped in AMD's Radeon R9 Fury X." },
    { name: "HBM2", year: "2016", detail: "Brought HBM to data-centre accelerators with NVIDIA's Tesla P100." },
    { name: "HBM2E", year: "2020", detail: "Faster, denser stacks; used in NVIDIA's A100 80 GB." },
    { name: "HBM3", year: "2022", detail: "Roughly doubled per-pin speed; launched with NVIDIA's H100." },
    { name: "HBM3E", year: "2024", detail: "8- and 12-high stacks at up to ~1.2 TB/s; used in H200 and Blackwell." },
    {
      name: "HBM4",
      year: "2026",
      detail: "Interface doubled to 2,048 bits, with base dies made at logic foundries; used in NVIDIA's Vera Rubin.",
      current: true,
    },
    { name: "HBM4E", year: "Sampling", detail: "Samsung showed 16 Gb/s-per-pin parts at GTC 2026; 16-high stacks expected." },
  ],
  makers: [
    {
      company: { name: "SK hynix", ticker: "000660.KS", hq: "South Korea" },
      share: "50%",
      detail:
        "Co-developed the first HBM with AMD and was first to volume on HBM3 and HBM3E. NVIDIA's main supplier. Stacks with its own mass-reflow molded underfill (MR-MUF) process.",
    },
    {
      company: { name: "Samsung Electronics", ticker: "005930.KS", hq: "South Korea" },
      share: "33%",
      detail:
        "Lagged on HBM3E, then came back with HBM4: volume shipments since February 2026, with the base die made on its own 4 nm foundry process.",
    },
    {
      company: { name: "Micron Technology", ticker: "MU", hq: "US" },
      share: "18%",
      detail:
        "Skipped HBM3 and went straight to HBM3E. Now ramping 12-high HBM4 and adding capacity, but still well behind the Korean pair.",
    },
  ],
  shareSource: {
    label: "Counterpoint Research, HBM revenue share, Q2 2026",
    url: "https://counterpointresearch.com/ko/insights/global-hbm-market-share-q2-2026",
  },
  newsAsOf: "2026-10-04",
  news: [
    {
      date: "2026-09-30",
      source: "Micron · SEC filing",
      title: "Micron posts a record $54.2 billion quarter and guides higher",
      summary:
        "Fiscal Q4 revenue was $54.23 billion, with next-quarter guidance of $61.5 billion ± $1.5 billion and gross margin near 86%. AI demand is keeping memory supply tight.",
      url: "https://www.sec.gov/Archives/edgar/data/0000723125/000072312526000018/a2026q4ex991-pressrelease.htm",
    },
    {
      date: "2026-09-30",
      source: "TrendForce",
      title: "Samsung Foundry losses seen shrinking as HBM4 base-die demand rises",
      summary:
        "Samsung builds its HBM4 base dies on its own 4 nm process. It expects HBM4 revenue to more than triple quarter-on-quarter in Q3 and to make up well over 60% of its HBM revenue in the second half.",
      url: "https://trendforce.com/news/2026/09/30/news-samsung-foundry-loss-reportedly-seen-shrinking-42-yoy-in-2026-as-hbm4-base-die-4nm-demand-rises",
    },
    {
      date: "2026-09-04",
      source: "TrendForce",
      title: "Micron reportedly adding 60K HBM wafers a month",
      summary:
        "Micron's HBM capacity is expected to reach around 100K wafers a month by year-end, focused on 12-high HBM4. Samsung and SK hynix each run roughly 150–200K.",
      url: "https://www.trendforce.com/news/2026/09/04/news-micron-reportedly-to-add-60k-hbm-wafersm-reaching-100k-by-year-end-to-narrow-gap-with-samsung-sk-hynix/",
    },
    {
      date: "2026-09-03",
      source: "Counterpoint Research",
      title: "SK hynix HBM share falls to 50% as Samsung climbs to 33%",
      summary:
        "SK hynix kept the lead in Q2 2026 but lost ground. Samsung was the only major supplier to gain share, and HBM4 shipments are expected to show up in the second half.",
      url: "https://counterpointresearch.com/ko/insights/global-hbm-market-share-q2-2026",
    },
    {
      date: "2026-07-07",
      source: "TrendForce",
      title: "Hybrid bonding pushed out; 16-high HBM4E may be the first to use it",
      summary:
        "Relaxed stack-height limits and slower demand for taller stacks mean Samsung and SK hynix can keep using today's bonding methods for longer.",
      url: "https://www.trendforce.com/news/2026/07/07/news-samsung-sk-hynix-reportedly-reconsider-hybrid-bonding-timeline-16-high-hbm4e-may-be-earliest-adoption/",
    },
    {
      date: "2026-03-17",
      source: "Korea JoongAng Daily",
      title: "Samsung unveils HBM4E at NVIDIA GTC",
      summary:
        "Samsung showed HBM4E at 16 Gb/s per pin, 36% faster than its HBM4, with samples due mid-2026. It also confirmed that its HBM4 will go into NVIDIA's Vera Rubin.",
      url: "https://www.koreajoongangdaily.com/business/samsung-unveils-hbm4e-at-nvidia-gtc-raises-bar-for-ai-memory/12713988",
    },
    {
      date: "2026-03-09",
      source: "TrendForce",
      title: "Samsung and SK hynix tapped as Vera Rubin HBM4 suppliers",
      summary:
        "Both were reportedly selected to supply HBM4 for NVIDIA's next-generation accelerator, launching in the second half of 2026.",
      url: "https://www.trendforce.com/news/2026/03/09/news-samsung-sk%E2%80%AFhynix-reportedly-tapped-as-nvidia-rubin-hbm4-suppliers-shipments-could-start-in-march/",
    },
  ],
};
