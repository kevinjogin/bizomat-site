---
title: "Choosing metals for engineered parts: steels, stainless, aluminium, copper alloys and specialty metals"
description: "Material choice fixes a part's strength, stiffness, weight, corrosion life and cost. How to read the main metal families and grades, and how to choose and specify them with confidence."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - product-development
author: "KEVOS®"
featured: false
draft: false
---

Metal selection is often settled by habit. A part is made from mild steel because the last one was, from 4140 because it sounds strong, or from stainless because it will not rust. Sometimes the habit is right. Sometimes it produces a heavy part that could have been lighter, a hardened shaft that cracked when it was welded, an aluminium frame that flexes too much, or a stainless fitting that corroded anyway because it was the wrong grade for the environment.

Choosing a metal well means matching its properties to what the part must do and how it will be made. It means understanding a few properties clearly, knowing what the main families and grades offer, and specifying the choice precisely enough that the supplier delivers what the designer intended. The cost of getting it wrong usually appears later: in failures, warranty claims, rework or a product that cannot compete on weight or price.

This article explains the properties that matter, the main metal families and how their grades are named, the trade-offs between strength, stiffness, weight, weldability and corrosion resistance, and a practical process for choosing and specifying metals. It is general information for designers, engineers and buyers. For critical or regulated parts, use the relevant standards and qualified engineering advice.

## The properties that matter

- **Yield strength**: the stress at which a metal begins to deform permanently. Most static designs are based on it.
- **Tensile strength**: the maximum stress before the metal breaks.
- **Elongation**: how far the metal stretches before breaking, a measure of **ductility**. Ductile metals give warning before failure.
- **Elastic modulus**: stiffness, the ratio of stress to elastic strain. It determines how much a part deflects under load.
- **Hardness**: resistance to indentation, closely linked to wear resistance and strength.
- **Toughness**: resistance to cracking under impact, often measured by a Charpy impact test at a stated temperature.
- **Fatigue strength**: the stress a metal can withstand for a large number of load cycles.
- **Density**: mass per unit volume, which sets weight.
- **Corrosion resistance**, **thermal and electrical conductivity**, **weldability** and **machinability**.

A critical point for designers: **strength and stiffness are different**. Almost all steels, from mild steel to hardened alloy steel, have nearly the same elastic modulus, about 200 GPa. A stronger steel can carry more load before yielding, but it deflects exactly as much as mild steel under the same load. If a part is too flexible, a stronger grade will not fix it; a stiffer shape will.

## Steels

Steel is iron with a small amount of carbon, plus other elements. It is strong, stiff, widely available, recyclable and relatively cheap, which is why it dominates engineering.

### Carbon content

Carbon is the most important alloying element:

- **Low-carbon steel**, below about 0.25% carbon, is soft, tough and readily welded. Structural sections, plate and sheet are low-carbon steels.
- **Medium-carbon steel**, about 0.25 to 0.55% carbon, can be heat treated to useful strength and hardness, suiting shafts, gears and axles.
- **High-carbon steel**, above about 0.55% carbon, can be made very hard, suiting springs, cutting tools and wear parts, but is less ductile and harder to weld.

### How steel grades are named

Engineering bar steels are commonly identified by the four-digit SAE/AISI system. The first two digits indicate the alloy group and the last two the approximate carbon content in hundredths of a per cent. For example:

- **1020** is plain carbon steel with about 0.20% carbon, a common general-purpose grade.
- **1045** is plain carbon steel with about 0.45% carbon, used for shafts and parts that may be surface hardened.
- **4140** is a chromium-molybdenum steel with about 0.40% carbon, used hardened and tempered for highly stressed parts.
- **4340** adds nickel for toughness in large, highly stressed sections.

Structural steels in Australia are specified to Australian Standards, such as AS/NZS 3678 for plate and AS/NZS 3679.1 for hot-rolled bars and sections, with grades named by their minimum yield strength in megapascals, such as grade 300 or 350.

### Alloying elements and hardenability

| Element | Main effect |
|---|---|
| Chromium | Hardenability, wear resistance and, above about 10.5%, corrosion resistance |
| Molybdenum | Hardenability and strength at high temperature |
| Nickel | Toughness, especially at low temperatures |
| Manganese | Strength and hardenability; present in all steels |
| Vanadium | Fine grain and strength |
| Silicon | Strength; used in spring steels |

**Hardenability** is not how hard a steel can become but how deeply it hardens when quenched. Plain carbon steels harden only near the surface in thicker sections; alloy steels such as 4140 harden through larger sections, which is why they are used for large, highly stressed parts.

### Weldability and carbon equivalent

Weldability falls as carbon and alloy content rise, because the zone next to the weld can form a hard, brittle structure that cracks. The **carbon equivalent** combines the elements into one number. A widely used formula is carbon plus manganese divided by 6, plus chromium, molybdenum and vanadium divided by 5, plus nickel and copper divided by 15.

A structural steel with 0.18% carbon and 1.2% manganese has a carbon equivalent of about 0.38, which generally welds without special precautions in moderate thicknesses. A typical 4140 with 0.40% carbon, 0.85% manganese, 0.95% chromium and 0.20% molybdenum has a carbon equivalent of about 0.77, which needs preheat, controlled cooling and often post-weld heat treatment. The properties that make 4140 a good hardening steel make it a difficult welding steel.

## Stainless steels

Stainless steels contain at least about 10.5% chromium, which forms a thin protective oxide film. They are grouped by structure:

| Family | Typical grades | Characteristics |
|---|---|---|
| Austenitic | 304, 316 | Non-magnetic in the annealed state, tough, easily welded and formed; 316 contains molybdenum for better resistance to chlorides |
| Ferritic | 430 | Magnetic, cheaper, moderate corrosion resistance, limited weldability in thick sections |
| Martensitic | 410, 420, 440C | Hardenable for blades, shafts and wear parts; lower corrosion resistance |
| Duplex | 2205 | Higher strength and better resistance to chloride stress corrosion cracking |
| Precipitation hardening | 17-4PH | High strength with good corrosion resistance |

"Stainless" does not mean corrosion-proof. Grade 304 can pit or crack in chloride environments such as coastal sites, swimming pool atmospheres and some process fluids, where 316 or duplex grades may be needed. Stainless parts also need clean fabrication: contamination from carbon steel tools and heat tint from welding reduce corrosion resistance unless removed.

## Aluminium alloys

Aluminium has about a third of the density of steel, 2,700 compared with about 7,850 kg/m³, and resists corrosion through its own oxide film. It also has about a third of the stiffness, with an elastic modulus of about 70 GPa.

Wrought alloys are named in series:

| Series | Main alloying element | Character |
|---|---|---|
| 1xxx | Nearly pure aluminium | Soft, conductive, corrosion resistant |
| 2xxx | Copper | High strength, heat treatable, lower corrosion resistance |
| 5xxx | Magnesium | Good corrosion resistance and weldability, marine uses |
| 6xxx | Magnesium and silicon | General purpose, extrudable, heat treatable, such as 6061 and 6060 |
| 7xxx | Zinc | Highest strength, such as 7075, mainly aerospace |

The **temper** suffix records the condition: O for annealed, H for strain hardened and T for heat treated, such as 6061-T6. Welding heat-treated alloys substantially reduces strength in the heat-affected zone near the weld, and structural design rules for aluminium allow for this. Some high-strength alloys are not suitable for fusion welding at all.

## Copper alloys

Copper has the highest electrical and thermal conductivity of the common metals and good corrosion resistance. On the International Annealed Copper Standard scale, copper is 100%, aluminium about 61%, brass about 28% and steel about 10%.

- **Brass**, copper with zinc, is easy to machine and form. Free-machining brasses traditionally contain lead, which matters for drinking water products, where lead limits apply.
- **Bronze**, traditionally copper with tin, is harder and more wear and corrosion resistant, suiting bushes, bearings and marine fittings. Phosphor bronze and aluminium bronze extend the family.
- **Copper** itself is used for electrical conductors, heat exchangers and earthing.

## Specialty metals

- **Titanium** is strong, about 40% lighter than steel and highly corrosion resistant, but costly and slow to machine.
- **Magnesium** is the lightest structural metal, used mainly in castings; fine chips and dust are a fire hazard.
- **Nickel alloys** resist high temperatures and aggressive chemicals.
- **Tool steels** are hardened alloy steels for cutting, forming and moulding tools.
- **Zinc** is used for die castings and galvanising.

## Strength, stiffness and weight together

When weight matters, compare properties per unit mass. **Specific stiffness**, modulus divided by density, is almost the same for steel, aluminium and titanium: roughly 25 to 26 megajoules per kilogram for steel and aluminium and slightly less for titanium. Changing metals alone does not make a part lighter for the same stiffness. Lighter designs come from changing shape, such as deeper sections, tubes and ribs, which lighter metals allow because their greater thickness for the same weight resists buckling better.

**Specific strength**, strength divided by density, differs more. High-strength aluminium and titanium alloys can carry much more load per kilogram than mild steel, which is why they are used in aircraft.

Fatigue is another trap. For welded joints, fatigue strength depends mainly on the weld detail rather than on the steel's static strength, so a higher-strength steel does not usually make a welded joint last longer under cyclic loading.

## A practical selection process

1. **Define requirements**: loads, stiffness, fatigue, impact, temperature range, environment, weight, conductivity, appearance, life and any regulations.
2. **Consider manufacturing**: will the part be welded, machined, formed, cast or heat treated? Each favours some metals and rules out others.
3. **Screen candidates** against must-have requirements.
4. **Rank the survivors** on cost per part, availability, supply risk, weight and life.
5. **Check availability** of the grade, form and size in Australia, and the lead time.
6. **Prototype and test** where risk is significant.
7. **Specify fully**: standard, grade, condition or temper, form, any heat treatment, testing and certification.

## Specifying and verifying metals

A drawing that says only "steel" or "stainless" leaves the supplier to choose. Specify the standard and grade, the condition (such as normalised, hardened and tempered or T6), the form (plate, bar, tube, casting) and any testing. Ask for **material test certificates** that report chemistry and mechanical properties, traceable to the delivered material, for parts where material matters. For structural steel, third-party certification schemes provide additional assurance. Non-conforming and mislabelled materials do occur, so check certificates and consider periodic verification for critical parts. The [inspection and test plans for supplier work](/reados/collections/suppliers-contractors-and-government-work/inspection-and-test-plans-for-supplier-work/) article covers building these checks into supply contracts.

Using recycled or alternative materials needs the same discipline. The [qualifying recycled materials for real products](/reados/collections/specifications-product-quality-and-sustainability/qualifying-recycled-materials-for-real-products/) article explains how to prove that a material change performs before committing to it.

## A worked example

This is an illustrative example. A business making mobile equipment wants to make a 120 kg mild steel frame lighter so the machine can be moved more easily. The first suggestion is a straight swap to aluminium, which by density alone would save about two-thirds of the weight.

**Analysis.** The engineer notes that the frame's design is governed by stiffness: excessive deflection would misalign a drive. Aluminium's modulus is about a third of steel's, so the same sections would deflect about three times as much. To match the steel frame's stiffness, the sections need about 2.9 times the second moment of area, which deeper rectangular tubes can provide. Welding 6061-T6 reduces strength near the welds, so the joints are designed using the reduced strengths, with bolted brackets at the most heavily loaded points. Stainless fasteners in contact with aluminium in a wet environment risk galvanic corrosion, so insulating washers and sleeves are specified.

**Result.** The redesigned aluminium frame weighs about 60 kg, half the original weight rather than the two-thirds saving that density alone suggests, and matches the steel frame's stiffness. It costs more in material and fabrication, but the lighter machine meets the customer's need for portability. The heavily loaded base, where weight matters less, stays in steel.

## Applying this in an Australian business

- **Start from requirements**, not habit.
- **Separate strength from stiffness**, and fix stiffness with shape.
- **Check weldability**, using carbon equivalent for steels and heat-affected zone effects for aluminium.
- **Choose stainless grades for the environment**, not just "stainless".
- **Watch for galvanic corrosion** when mixing metals.
- **Specify standard, grade, condition and certification** on drawings.
- **Check local availability** and lead times.
- **Test before switching** materials on critical parts.

## Where material choices go wrong

- **Using a stronger steel to fix a deflection problem.**
- **Welding hardenable steels** without preheat and procedures.
- **Assuming all stainless steels resist chlorides.**
- **Swapping to aluminium** without redesigning for stiffness and weld strength.
- **Mixing metals** without considering galvanic corrosion.
- **Vague specifications** that let suppliers substitute.
- **Ignoring fatigue**, especially at welds.

## Questions to ask when choosing a metal

- Is this part limited by strength, stiffness, fatigue, wear, corrosion or weight?
- How will it be made, joined and finished?
- Which environment will it see, including chlorides and temperature?
- What does each option cost per finished part, not per kilogram?
- Is the grade available in the size and form we need?
- Have we specified the standard, grade, condition and certificates?

## Bringing it together

Good metal selection matches properties to function and manufacturing. Understand the difference between strength and stiffness, know how carbon and alloying elements change steel, choose stainless grades for the actual environment, and redesign shapes when moving to lighter metals. Check weldability, galvanic risks and fatigue at joints, compare cost per finished part and confirm availability. Specify materials completely, with standards, grades, conditions and certificates, and verify them for critical parts. The result is parts that perform reliably, weigh what they should and cost no more than they need to.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on standard steels, nonferrous alloys, tool steels, design stresses and fatigue, and steel and metal selection for engineering design, together with established materials engineering practice. The worked example is illustrative. This article is general information; use the relevant standards and qualified advice for critical parts.*
