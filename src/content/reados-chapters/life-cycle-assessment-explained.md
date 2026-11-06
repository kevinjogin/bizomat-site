---
title: "Life cycle assessment explained: measuring a product's environmental effects from material to disposal"
description: "How life cycle assessment works under ISO 14040 and 14044: functional units, system boundaries, inventory, impact categories and interpretation, plus EPDs and the limits of environmental claims."
publishDate: 2026-10-16
category: "Products"
tags:
  - product-development
  - design
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

Customers, regulators and procurement teams increasingly ask how a product affects the environment. Which material has the lower footprint? Is the recycled version actually better? Does the lighter design save more over its life than it costs to make? Questions like these are easy to ask and surprisingly easy to answer wrongly. A product that looks greener because it uses less material may require a far more energy-intensive material. A product with a smaller manufacturing footprint may need replacing twice as often. A claim that is true for one stage of a product's life may be false across its whole life.

**Life cycle assessment** (LCA) is the established method for answering these questions systematically. It measures the environmental inputs and outputs associated with a product or service across its life, from extracting raw materials, through manufacturing, transport, use and maintenance, to disposal or recovery, and translates them into environmental impacts. It is defined by international standards, notably ISO 14040 and ISO 14044, and underpins many environmental product declarations and carbon footprints.

This article explains, in general terms, how an LCA is structured, the decisions that most influence its results, how to read one critically, how it relates to environmental product declarations and carbon footprints, and how a product business can use the thinking even without commissioning a full study. It is general information. Formal LCAs, especially those supporting public comparative claims, need qualified practitioners and, often, independent review.

## The four phases of an LCA

The standards describe LCA as four connected phases. In practice, the work is iterative: findings in later phases often send the practitioner back to refine earlier ones.

| Phase | Key question | Main outputs |
|---|---|---|
| Goal and scope | What exactly are we assessing, why, and for whom? | Purpose, functional unit, system boundary, assumptions, data requirements |
| Inventory analysis | What flows in and out of the system? | Quantities of materials, energy, emissions and wastes per functional unit |
| Impact assessment | What do those flows mean environmentally? | Results for impact categories such as climate change, water use or eutrophication |
| Interpretation | What can we conclude, and how confident are we? | Conclusions, limitations, sensitivity checks, recommendations |

```figure
type: steps
title: The four phases of a life cycle assessment
caption: Most results are decided in goal and scope, by the functional unit and system boundary.
- *Goal and scope | functional unit, boundary, assumptions
- Inventory analysis | materials, energy, emissions, wastes
- Impact assessment | climate, water and other categories
- Interpretation | hotspots, sensitivity, limits
```

## Goal and scope: where most results are decided

The goal and scope phase is the least glamorous and the most important. Decisions made here shape every result.

### The functional unit

An LCA compares products on the basis of the **function** they deliver, not their mass or their price. The **functional unit** defines that function quantitatively. "One bracket" is a weak functional unit. "Supporting a 50 kg shelf load for 15 years in an indoor environment" is a strong one, because it captures performance and service life.

The functional unit matters because products differ in durability, performance and maintenance. A cheaper, lighter product that lasts half as long must be counted twice. The [avoiding burden shifting](/reados/collections/sustainability-and-environmental-management/avoiding-burden-shifting-in-low-carbon-decisions/) article explains why comparing per unit of function prevents misleading conclusions.

### The system boundary

The **system boundary** defines which life cycle stages and processes are included. Common boundaries are:

- **Cradle to gate**: from raw material extraction to the product leaving the factory.
- **Cradle to grave**: the full life, including transport, installation, use, maintenance and end of life.
- **Gate to gate**: a single manufacturing stage, useful for process improvement.
- **Cradle to cradle**: a full life cycle in which end-of-life materials become inputs to new products.

A cradle-to-gate study cannot support conclusions about products whose main impacts occur in use, such as appliances, vehicles or buildings. A cradle-to-grave study is more complete but needs assumptions about how products are used and disposed of.

### Allocation and recycling

Many processes produce more than one product, and many products contain recycled material or are recycled at end of life. Deciding how to share impacts between co-products, and how to credit recycling, are known as **allocation** problems. Different reasonable choices can produce substantially different results, which is why the standards set a preferred order of approaches and require the choices to be documented.

## Inventory analysis: counting the flows

The **life cycle inventory** quantifies inputs, such as materials, energy and water, and outputs, such as products, emissions to air, water and soil, and wastes, for each process within the boundary, scaled to the functional unit.

Data comes from two broad sources:

- **Primary data**, measured directly from the business's own operations and suppliers: material quantities, energy use, scrap rates, transport distances.
- **Secondary data**, drawn from published databases for processes the business does not control, such as the production of steel, aluminium, plastics, electricity or fuels. Australia has a national life cycle inventory database, AusLCI, and international databases are widely used.

Data quality matters enormously. Electricity, for example, has very different emissions depending on how it is generated, and Australian grids differ by state and over time. A study that uses an overseas electricity dataset for an Australian factory may be badly wrong. Good studies document data sources, geography, age and representativeness.

## Impact assessment: what the flows mean

The **impact assessment** phase converts inventory flows into potential environmental impacts. Flows are assigned to **impact categories** and multiplied by characterisation factors that express their relative contribution. Common categories include:

- **Climate change**, usually expressed in kilograms of carbon dioxide equivalent (kg CO2-e);
- **Acidification** and **eutrophication**, affecting soils and waterways;
- **Ozone depletion** and **photochemical ozone formation**;
- **Water use** or water scarcity;
- **Resource depletion** of minerals and fossil fuels;
- **Land use**; and
- **Toxicity** to humans and ecosystems, which is among the most uncertain categories.

Results are usually presented category by category. Some studies go further, normalising and weighting categories into a single score, but this involves value judgements and is treated with caution, particularly for public comparisons.

Different categories can point in different directions. A design change that reduces climate impact may increase water use or toxicity. LCA does not resolve those trade-offs automatically. It makes them visible so that people can decide.

## Interpretation: what can honestly be concluded

The interpretation phase draws conclusions, tests their robustness and states limitations. Good interpretation:

- identifies the **hotspots**, the stages and processes contributing most to each impact;
- checks **sensitivity** to key assumptions such as product life, recycled content, transport distances and electricity source;
- assesses data quality and completeness; and
- states clearly what the study can and cannot support.

The standards impose additional requirements, including **critical review**, where an LCA supports a **comparative assertion** disclosed to the public, such as a claim that one product is environmentally better than a competitor's. That requirement reflects how easily comparisons can mislead.

## Environmental product declarations and carbon footprints

Two related tools appear frequently in procurement and marketing.

An **environmental product declaration** (EPD) is a standardised, independently verified document reporting a product's life cycle environmental performance, based on an LCA carried out under agreed **product category rules**. EPDs follow ISO 14025, and construction product EPDs typically also follow the European standard EN 15804. In Australia and New Zealand, EPDs are commonly published through a regional program operator. EPDs are increasingly requested in construction and infrastructure procurement, where they allow products in the same category to be compared on a consistent basis.

A **product carbon footprint** reports only climate impact, often using ISO 14067. It is simpler than a full LCA but ignores other impacts, which can hide trade-offs.

## Making environmental claims responsibly

Environmental claims about products are subject to the Australian Consumer Law, which prohibits misleading or deceptive conduct. The Australian Competition and Consumer Commission has published guidance on making environmental claims, emphasising that claims must be accurate, substantiated, clear about what they cover and not overstate benefits. Vague terms such as "eco-friendly" or "green", comparisons without a clear basis and claims about one life stage presented as if they applied to the whole product are common problems.

An LCA can provide the evidence for a claim, but only for the claim it actually supports. A cradle-to-gate carbon result does not support a claim about the product's total environmental impact.

## A worked example

This is an illustrative example. The products are hypothetical, and the emission factors below are assumed round numbers chosen only to show the method. They are not real data and should not be used for any assessment.

A small manufacturer of shelving is choosing between two bracket designs. Design A is fabricated from 1.8 kg of steel. Design B is cast from 0.7 kg of aluminium. Both support the same load for the same 15-year life, so the functional unit is "one bracket supporting a 50 kg shelf load for 15 years indoors". Use and maintenance impacts are similar and small, so the team starts with a cradle-to-gate climate comparison.

It assumes, for illustration, that steel contributes 2.5 kg CO2-e per kilogram, primary aluminium 9 kg CO2-e per kilogram and recycled aluminium 2 kg CO2-e per kilogram.

- **Design A (steel):** 1.8 kg × 2.5 = **4.5 kg CO2-e**.
- **Design B (all primary aluminium):** 0.7 kg × 9 = **6.3 kg CO2-e**.
- **Design B (70% recycled aluminium):** each kilogram contributes 0.3 × 9 plus 0.7 × 2, which is 2.7 plus 1.4, or 4.1 kg CO2-e, so 0.7 kg × 4.1 = about **2.9 kg CO2-e**.

The answer to "which design is better for the climate?" depends almost entirely on the aluminium's recycled content, which depends on the supplier. A marketing claim that "aluminium brackets halve our carbon footprint" would be unsupported unless the business can verify the recycled content, and it would say nothing about other impact categories or end-of-life recovery. The useful outcomes are practical: specify and verify recycled content with the supplier, test the result with real supplier data, and avoid public comparative claims until a properly documented study supports them.

```figure
type: bars
title: Cradle-to-gate climate impact of one shelf bracket
unit: kg CO2-e
max: 7
caption: The answer depends almost entirely on recycled content, which the business must specify and verify with its supplier.
- Steel, 1.8 kg | 4.5
- Primary aluminium, 0.7 kg | 6.3
- *Aluminium with 70% recycled content, 0.7 kg | 2.9
```

## Streamlined assessment during design

A full, ISO-compliant LCA can take weeks or months and is usually done on a finished design. Yet the decisions that most influence a product's footprint, such as material, mass, process, service life and recyclability, are made early, when the design is still fluid. Many product teams therefore use **streamlined** or **screening** assessments during design: quick estimates using a limited set of impact categories, secondary data and simplified boundaries, intended to compare options and find hotspots rather than to support public claims.

Streamlined assessments are useful as long as their limits are respected. Record the assumptions, use them to rank options rather than to report absolute numbers, and check any important conclusion with better data before acting on it in marketing or procurement. Several CAD and engineering software packages now include basic sustainability estimates, which can help designers see the effect of material and mass choices as they work.

## How a product business can use LCA thinking

Not every business needs a full LCA. The thinking behind it is useful at every scale:

- **Define products by function.** Compare options per unit of service delivered, including durability.
- **Find the hotspots.** Even a rough estimate usually shows that a few materials or processes dominate. Focus effort there.
- **Ask suppliers for data.** Recycled content, energy sources and EPDs from suppliers improve the accuracy of any assessment.
- **Design for longer life and recovery.** Durability, repairability and material choices that enable recycling often matter as much as manufacturing impacts. The [durability is sustainability](/reados/collections/specifications-product-quality-and-sustainability/durability-is-sustainability/) article develops this point.
- **Use EPDs where customers expect them.** In construction and infrastructure, EPDs may become a condition of being specified.
- **Keep claims narrow and supported.** Say exactly what the evidence shows, for which product, life stage and impact.

## Common mistakes

- **Comparing by mass instead of function.** Lighter is not automatically better.
- **Ignoring service life.** A product replaced twice as often doubles its production impacts.
- **Inconsistent boundaries.** Comparing a cradle-to-gate result for one product with a cradle-to-grave result for another.
- **Using unrepresentative data.** Overseas electricity or material datasets can distort Australian results.
- **Reporting only carbon.** Climate is important, but other impacts may move in the opposite direction.
- **Overstating results.** Turning a narrow study into a broad marketing claim.
- **Treating LCA as a one-off.** Supplier changes, energy sources and designs change, so results age.

## Frequently asked questions

**How much does an LCA cost?** It depends on the product's complexity, data availability and whether the study needs independent review or must support an EPD. Screening assessments are relatively inexpensive; verified studies and EPDs cost considerably more.

**Can we use a competitor's EPD to compare products?** Only if both EPDs follow the same product category rules and comparable boundaries. Otherwise the comparison may be misleading.

## Questions to ask

- What function does our product deliver, and what is the right functional unit?
- Which life cycle stages are likely to dominate its impacts?
- What boundary does any study or claim actually cover?
- Where does our data come from, and is it representative of Australian conditions and our suppliers?
- Which impact categories matter for our product and customers, beyond carbon?
- What would it take to support a public environmental claim, and do we need independent review?
- Do our customers expect EPDs, and do our suppliers provide them?

## Bringing it together

Life cycle assessment measures a product's environmental effects across its whole life, using a structure set out in ISO 14040 and 14044: goal and scope, inventory, impact assessment and interpretation. Its results depend heavily on early choices, especially the functional unit, the system boundary, allocation rules and data quality, which is why a careful reading of the scope matters as much as the headline figures. EPDs and carbon footprints build on LCA to support procurement and disclosure. Used honestly, LCA helps product businesses find the hotspots worth improving, make better design and supplier choices and make environmental claims that will stand up to scrutiny.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. This article provides general information only.*
