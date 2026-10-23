---
title: "Biology as manufacturing: from fermentation and penicillin to biologics and mRNA"
description: "How living cells became factories, from brewing and wartime penicillin to recombinant proteins, antibodies and mRNA vaccines, and what bioprocess engineering teaches about scale-up and control."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - manufacturing
  - quality
  - product-development
author: "KEVOS"
featured: false
draft: false
---

For most of history, manufacturing meant shaping and combining materials: cutting wood, casting metal, weaving fibre, mixing chemicals. Yet one of the oldest forms of production uses living organisms to do the work. Brewers, bakers, cheesemakers and winemakers relied on microbes long before anyone knew microbes existed. In the twentieth century, that ancient craft became a branch of engineering. Microorganisms and cultured cells became factories, producing antibiotics, vaccines, enzymes, hormones and, more recently, complex protein medicines and messenger RNA vaccines.

Manufacturing with biology differs from manufacturing with machines in important ways. The "machines" are living cells, sensitive to temperature, acidity, oxygen, nutrients and contamination. They vary, adapt and can be outcompeted by unwanted organisms. Small changes in the process can change the product, sometimes in ways that cannot be detected by testing the finished product alone. These characteristics have made **bioprocess engineering** one of the most demanding fields of manufacturing, and its lessons about scale-up, process control and documentation apply far beyond medicine.

This article traces, in general terms, how biology became a manufacturing technology, from early fermentation science through the wartime production of penicillin, recombinant proteins and antibodies, to mRNA vaccines, and draws out lessons for engineers and businesses. It is a general historical overview and not medical or regulatory advice.

## Fermentation becomes science

Fermentation was practised for millennia as a craft. In the nineteenth century, Louis Pasteur and others showed that fermentation and spoilage were caused by living microorganisms, and that different organisms produced different results. That understanding turned brewing and winemaking into processes that could be controlled: clean equipment, pure cultures, controlled temperatures and pasteurisation.

Industrial fermentation expanded in the early twentieth century. During the First World War, a bacterial fermentation process was used to produce acetone, needed for munitions, at large scale. In the following decades, fermentation produced citric acid for food and industry, and enzymes and other chemicals. Engineers learned to design vessels, sterilise media and air, control conditions and recover products from dilute fermentation broths.

## Penicillin: from discovery to mass production

In 1928, Alexander Fleming observed that a mould contaminating one of his bacterial cultures killed the surrounding bacteria. The active substance, penicillin, was difficult to isolate and unstable, and for more than a decade it remained a laboratory curiosity.

In 1940 and 1941, a team at the University of Oxford led by the South Australian-born scientist Howard Florey, with Ernst Chain and colleagues, purified penicillin, demonstrated its effectiveness in animals and then in patients. The problem then became production. The mould produced tiny quantities, and the first patient treatments consumed nearly all the penicillin available.

Turning penicillin into a mass-produced medicine during the Second World War was one of the great manufacturing achievements of the century. Key steps included:

- **Finding more productive strains** of the mould through screening and selection;
- **Improving the growth medium**, including the use of corn steep liquor, a by-product of corn processing, which increased yields;
- **Moving from surface culture**, where mould grew on the surface of liquid in many small vessels, **to deep-tank (submerged) fermentation** in large, stirred, aerated vessels; and
- **Developing recovery and purification processes** that could handle large volumes.

Deep-tank fermentation required engineers to solve problems of sterility at large scale, oxygen supply to dense cultures, mixing, heat removal and contamination control. The result was a dramatic increase in output and fall in cost, making penicillin widely available by the end of the war. Fleming, Florey and Chain shared the Nobel Prize in Physiology or Medicine in 1945.

Australia was part of this story. The Commonwealth Serum Laboratories, established in 1916 to produce vaccines and antitoxins, began producing penicillin during the Second World War, building national capability in biological manufacturing that has continued to the present.

## Recombinant DNA and protein medicines

In the 1970s, scientists developed methods to insert genes from one organism into another, known as **recombinant DNA** technology. This made it possible to program microorganisms to produce human proteins. The first medicine made this way, human insulin produced by bacteria, was approved in 1982, replacing insulin extracted from animal pancreases and allowing supply to grow with demand.

Many therapeutic proteins are too complex for bacteria to produce correctly, because they need modifications that only animal cells perform. **Mammalian cell culture**, growing engineered animal cells in bioreactors, became the basis for producing many of these **biologics**.

**Monoclonal antibodies**, first produced by a laboratory method described in 1975, became one of the most important classes of medicines, used in cancer, autoimmune disease and many other conditions. Producing them at scale required large stainless-steel bioreactors, complex purification trains using chromatography and filtration, and highly controlled facilities.

## Gene editing and mRNA

More recent advances have expanded the toolkit further. **Gene editing** techniques, notably CRISPR-based methods developed from 2012, allow precise changes to genetic material, with uses in research, agriculture and emerging therapies.

**Messenger RNA (mRNA) vaccines**, authorised for use against COVID-19 in late 2020, showed a different manufacturing model. Instead of growing cells to produce a protein, mRNA is produced in a cell-free enzymatic process and packaged in lipid nanoparticles, so that the patient's own cells make the protein that triggers immunity. The process can be adapted to new targets by changing the genetic sequence, and it can be scaled quickly once facilities and supply chains exist. Building that capacity rapidly during the pandemic required enormous coordination of raw materials, equipment, quality systems and regulatory review. Australia, like many countries, has since invested in onshore vaccine manufacturing capability.

```figure
type: timeline
title: Biology as manufacturing
caption: Penicillin was discovered in 1928 but became widely available only after an intensive engineering effort.
- 1916 | Commonwealth Serum Laboratories | vaccines and antitoxins
- 1928 | Fleming observes penicillin | a mould kills bacteria
- 1940–41 | Florey's Oxford team | purifies and tests penicillin
- 1982 | Recombinant human insulin | made by bacteria
- 2012 | CRISPR-based gene editing | precise changes
- *2020 | mRNA vaccines authorised | against COVID-19
```

## How bioprocessing works

Most biological manufacturing follows a common structure:

| Stage | Purpose | Key engineering concerns |
|---|---|---|
| Cell line or strain | The organism or cells that make the product | Productivity, stability, documentation of origin |
| Media and seed train | Growing enough healthy cells to inoculate production vessels | Sterility, consistency of raw materials |
| Production (upstream) | Cells produce the product in a bioreactor | Temperature, pH, dissolved oxygen, mixing, nutrient feeds, contamination control |
| Harvest and recovery (downstream) | Separating the product from cells and broth | Centrifugation, filtration, yield |
| Purification | Removing impurities to required purity | Chromatography, filtration, viral clearance |
| Formulation and fill-finish | Preparing the final product and filling containers | Sterility, stability, accuracy of dose |

```figure
type: steps
title: How bioprocessing works
caption: The process is the product, so every stage from cell line to filling must be controlled.
- Cell line or strain | productive, stable, documented
- Media and seed train | sterile, consistent
- *Production in the bioreactor | temperature, pH, oxygen, mixing
- Harvest and recovery | centrifuge, filter
- Purification | chromatography, viral clearance
- Formulation and fill-finish | sterile, accurate dose
```

Each stage is tightly controlled, documented and monitored, with in-process tests confirming that conditions stay within validated limits.

## Why scale-up is hard

Biological processes often work well in a laboratory flask and fail in a large tank. The reasons are physical. As vessels grow larger:

- **Oxygen transfer** becomes harder, because the surface area and mixing available per volume change.
- **Mixing times increase**, so cells experience variations in nutrients, pH and oxygen as they move through the tank.
- **Heat removal** becomes harder, because heat generated grows with volume while cooling surfaces grow more slowly.
- **Shear forces** from agitation can damage sensitive cells.
- **Contamination risk** rises with longer runs, more connections and more operators.

Scale-up therefore requires engineering analysis, pilot-scale trials and careful translation of conditions, not simply making everything bigger.

## The process is the product

In biologics, a frequently repeated principle is that **the process is the product**. Because biological products are complex and cannot always be fully characterised by testing, their quality depends on making them in exactly the same way every time. That is why regulators require manufacturing under **good manufacturing practice** (GMP), with validated processes, controlled facilities, trained people, detailed batch records and rigorous change control. In Australia, the Therapeutic Goods Administration regulates the manufacture of medicines and biologicals.

This principle has relevance well beyond medicine. Whenever product quality depends on process conditions that cannot be fully checked afterwards, process control and documentation become the main safeguards. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article explains how to demonstrate that a process consistently produces conforming output.

## Single-use systems and flexible facilities

Traditional biological manufacturing used large stainless-steel vessels and piping, cleaned and sterilised between batches. Cleaning and sterilisation take time, use water and chemicals and must themselves be validated. Over recent decades, **single-use systems**, such as disposable bioreactor bags, tubing and filters supplied sterile, have become common, especially for smaller volumes and multi-product facilities. They reduce cleaning, speed changeovers between products and lower the risk of cross-contamination, at the cost of consumable spending, waste and dependence on specialised suppliers.

The trade-off between fixed, dedicated equipment and flexible, disposable systems mirrors choices in other industries: dedicated tooling for long runs of one product, flexible equipment for variety and speed.

## Supply chains for biological manufacturing

Biological manufacturing depends on specialised inputs: cell culture media, enzymes, lipids, filters, chromatography resins, single-use components and sterile containers. Many come from a small number of suppliers worldwide. During periods of surging demand, such as the rapid scale-up of vaccine production, shortages of these inputs can limit output as much as manufacturing capacity does. Qualifying alternative suppliers is slow, because any change to materials may need validation and regulatory approval. Resilient biomanufacturing therefore requires as much attention to supply chains as to process engineering.

## Industrial biotechnology beyond medicine

Biology also manufactures many everyday products. Enzymes produced by fermentation are used in detergents, food processing, textiles and paper making. Microbial processes produce food ingredients, flavours and amino acids. Biofuels and some bio-based plastics are produced from plant materials using fermentation and other biological steps. **Precision fermentation**, in which engineered microorganisms produce specific proteins or fats for food, is an emerging area. These industries share the same engineering foundations as pharmaceutical bioprocessing, with different cost, regulatory and scale pressures.

## Lessons for engineers and businesses

### Discovery is not production

Penicillin was discovered in 1928 but became widely available only after an intensive engineering effort during the war. Many good ideas fail not in the laboratory but in scaling up. Businesses should plan and resource the path from prototype to production as seriously as the idea itself.

### Scale changes the physics

What works in small batches may fail at volume because mixing, heat transfer and contamination behave differently. Test at intermediate scales before committing to full production, and expect to adjust conditions rather than simply multiplying quantities.

### Control the process when you cannot fully test the product

Where defects cannot be detected by final inspection, consistency comes from controlling inputs, conditions and procedures, and from documenting every batch. Many food, coating, heat treatment and welding processes share this characteristic.

### By-products can unlock breakthroughs

Corn steep liquor, a waste stream from another industry, helped make penicillin production economical. Waste and by-product streams, in your own business or a neighbouring industry, deserve a second look.

### Collaboration across disciplines matters

The penicillin effort brought together microbiologists, chemists, chemical engineers, manufacturers and governments across several countries. Complex problems often need people from different disciplines working closely together.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A small Australian producer of fermented beverages grows from 500-litre batches to a new 5,000-litre fermenter to supply a supermarket contract. The first large batches develop off-flavours and take two days longer to finish than the small batches did.

Investigation finds that the larger vessel's cooling jacket cannot remove heat as quickly relative to the volume, so the ferment runs warmer, favouring unwanted flavour compounds. Mixing is slower, so temperature varies through the tank. A transfer hose added for the larger vessel is difficult to clean and is a contamination risk.

The producer adds supplementary cooling and temperature probes at several heights, adjusts the yeast pitching rate and feeding schedule based on small trials, replaces the hose with a cleanable hard-piped connection and introduces batch records that capture temperatures, timings, ingredient lots and cleaning checks. Subsequent batches match the small-batch flavour profile, and the records allow any future problem to be traced to its cause. The [product traceability in manufacturing](/reados/collections/manufacturing-quality/product-traceability-in-manufacturing/) article explains how lot records support recalls and investigations.

```figure
type: checklist
title: Scaling a ferment from 500 to 5,000 litres
caption: The larger jacket removed heat more slowly relative to volume, and mixing slowed, so the ferment ran warm.
- x Supplementary cooling
- x Temperature probes at several heights
- x Pitching rate and feeding set from small trials
- x A cleanable, hard-piped transfer
- *x Batch records of temperatures, lots and cleaning
```

## How this applies to a small Australian business

- **Plan scale-up as an engineering project**, with trials at intermediate scale.
- **Measure and control the conditions** that drive quality.
- **Design for cleanability and hygiene** where contamination matters.
- **Keep batch records** that link inputs, conditions and outputs.
- **Control changes** to processes and raw materials.
- **Look at by-products** as potential inputs.
- **Bring disciplines together** when problems cross boundaries.
- **Map critical inputs** and identify those with few suppliers or long qualification times.

## Questions worth considering

- Which of our processes would behave differently at a larger scale?
- Where does our product quality depend on conditions we cannot check afterwards?
- Do our records let us trace a problem back to its causes?
- How do we control changes to processes and suppliers?
- Which by-products or waste streams might have value?
- Which of our critical inputs depend on a small number of suppliers, and how long would it take to qualify an alternative?

## Bringing it together

Biology became a manufacturing technology through a series of breakthroughs: the science of fermentation, the wartime engineering that made penicillin abundant, recombinant DNA, cell culture, antibodies and, most recently, mRNA. Throughout, success depended as much on engineering, scale-up, process control and documentation as on scientific discovery. Bioprocessing's central lessons, that discovery is not production, that scale changes the physics and that the process determines the product, apply to any business turning a promising idea into reliable output. The [engineering for the body](/reados/collections/specifications-product-quality-and-sustainability/engineering-for-the-body-what-medical-devices-teach-product-developers/) article explores related lessons from medical devices.

---

*Source: KEVOS editorial notes. This article is a general historical overview and does not constitute medical or regulatory advice.*
