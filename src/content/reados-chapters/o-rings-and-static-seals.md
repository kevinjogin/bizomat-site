---
title: "O-rings and static seals: gland design, materials, gaskets and why seals fail"
description: "How O-rings seal, how to size the groove for squeeze and fill, choosing elastomers for fluids and temperatures, back-up rings, gaskets and sealants, and how to read seal failures."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - manufacturing
author: "KEVOS"
featured: false
draft: false
---

Seals are among the cheapest parts in a machine and among the most expensive to get wrong. A few cents of rubber decides whether a hydraulic manifold leaks, a pump housing weeps, a food processing line is contaminated or an enclosure lets water into electronics. When seals fail, the cost is rarely the seal. It is the downtime, the cleaning, the lost fluid, the damaged components and sometimes the safety or hygiene incident that follows.

The **O-ring** is the most common seal in engineering. It is simple, inexpensive, standardised and remarkably capable when it is installed in a properly designed groove, made from a compatible material and protected from damage during assembly. Most O-ring failures are not the O-ring's fault. They come from grooves with the wrong dimensions, materials that react with the fluid, sharp edges that cut the seal during assembly, gaps that allow it to extrude under pressure or temperatures beyond its range.

This article explains, in general terms, how O-rings seal, how to design glands for the right squeeze and fill, how to choose elastomer materials, when back-up rings are needed, how gaskets and liquid sealants compare, how to store seals and how to read the evidence when seals fail. It focuses on static seals, where the sealed surfaces do not move relative to each other; dynamic seals on moving shafts and rods involve additional considerations. It is general information. Seal manufacturers' design guides should be used for specific designs.

## How an O-ring seals

An O-ring is a ring of elastomer with a circular cross-section, fitted into a groove called a **gland**. When the mating parts are assembled, the O-ring is compressed, or **squeezed**, between the bottom of the groove and the opposing surface. That initial squeeze creates a seal at low pressure.

When the system is pressurised, the fluid pushes the O-ring towards the low-pressure side of the groove, deforming it and increasing the contact stress against the sealing surfaces. In effect, pressure helps the O-ring seal. This self-energising behaviour is why O-rings work across a wide range of pressures, provided the clearance gap on the low-pressure side is small enough to stop the rubber being forced into it.

O-ring glands are commonly arranged as:

- **Radial glands**, where the O-ring seals between a cylindrical bore and a shaft, piston or plug, with the groove on either part.
- **Axial (face) glands**, where the O-ring seals between two flat faces, such as a cover plate on a housing.

## O-ring sizes

An O-ring is defined by its **inside diameter** and its **cross-section diameter**. Standard size series exist, including the ISO 3601 series and the inch-based AS568 series, which is an SAE aerospace standard rather than an Australian Standard despite its name. Using standard sizes ensures availability and allows the use of manufacturers' groove recommendations.

## Designing the gland

Gland design aims to give the right **squeeze**, enough room for the O-ring to deform and swell, a suitable **stretch** or compression on the diameter and protection against extrusion.

- **Squeeze** is the percentage by which the cross-section is compressed. Static seals commonly use more squeeze than dynamic seals; manufacturers' guides typically suggest ranges that, for many static applications, fall somewhere between about 15 and 30 per cent. Too little squeeze leaks at low pressure, especially as the material takes a set over time; too much overstresses the material and makes assembly difficult.
- **Groove fill** is the proportion of the groove volume occupied by the O-ring. The groove must leave room for the O-ring to deform under pressure, expand with temperature and swell slightly in the fluid. Overfilled grooves can crush and extrude the seal.
- **Stretch** applies when an O-ring is fitted on a shaft or piston groove. A modest stretch keeps it seated; excessive stretch thins the cross-section and reduces squeeze.
- **Surface finish** of the sealing surfaces matters. Rough surfaces create leak paths; overly smooth surfaces are rarely a problem in static seals, but dynamic seals have specific finish requirements.
- **Lead-in chamfers and edge breaks** protect the O-ring during assembly. Sharp edges, threads and cross-drilled holes that the O-ring must pass over can cut or nick it.

Because the calculations depend on tolerances, temperature and fluid, use a manufacturer's gland design tables or calculators and check the extremes of the tolerance range, not just the nominal dimensions. The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains how to specify finishes and tolerances on drawings.

## Extrusion and back-up rings

At high pressures, the elastomer can be forced into the clearance gap between the mating parts, a failure called **extrusion**. Repeated pressure cycles nibble pieces from the O-ring's edge. Extrusion depends on pressure, the size of the gap, the hardness of the elastomer and temperature.

Prevention includes:

- keeping clearance gaps small through tolerances and concentricity;
- using a harder elastomer compound where suitable; and
- fitting **back-up rings**, usually made of a harder plastic such as PTFE, on the low-pressure side, or on both sides where pressure alternates.

## Choosing the elastomer

The O-ring material must be compatible with the fluid, the temperature range and the environment. Common elastomers include:

| Material | Typical strengths | Typical limitations |
|---|---|---|
| Nitrile (NBR) | Mineral oils, many hydraulic fluids and fuels; economical | Poor resistance to ozone, weathering and some fluids; moderate temperature range |
| Hydrogenated nitrile (HNBR) | Better heat and ozone resistance than NBR | Higher cost |
| Fluorocarbon (FKM) | High temperatures, oils, fuels and many chemicals | Poor with some fluids such as certain ketones, esters and hot water or steam depending on grade; higher cost |
| Ethylene propylene (EPDM) | Water, steam, many water-based fluids, brake fluids, weathering | Generally unsuitable for mineral oils and fuels |
| Silicone (VMQ) | Very wide temperature range; often used in food and medical applications | Poor tear and abrasion resistance; better suited to static use |
| Fluorosilicone (FVMQ) | Fuel and oil resistance with wide temperature range | Cost; mechanical strength |
| Polyurethane (AU or EU) | High abrasion and extrusion resistance | Limited by temperature and hydrolysis in some fluids |
| Perfluoroelastomer (FFKM) | Exceptional chemical and temperature resistance | Very expensive |

```figure
type: decision
title: Choosing an O-ring elastomer
question: What will the seal be exposed to?
caption: Size alone does not make a replacement correct; the compound must suit the fluid and temperature.
- Mineral oils and many hydraulic fluids | Nitrile (NBR)
- High temperature, oils and fuels | Fluorocarbon (FKM)
- *Water, steam, brake fluid, weather | EPDM, never mineral oil
- Very wide temperature range, static | Silicone (VMQ)
- Severe chemicals and heat | Perfluoroelastomer (FFKM)
```

Compatibility charts from seal manufacturers are the starting point, but they are general guides. For unusual fluids, high temperatures or critical applications, ask the manufacturer or test samples. Food, potable water and medical applications usually require materials with appropriate compliance for that use.

**Hardness**, usually measured on the Shore A scale, also matters. Medium hardness compounds suit most applications; harder compounds resist extrusion at high pressure but need more force to seal.

## Seals in food, potable water and medical applications

Where seals contact food, drinking water or medical products, compatibility with the fluid is only part of the requirement. The seal material may need to comply with regulations or standards for food contact or drinking water, and in hygienic equipment the seal design must avoid crevices where product can lodge and bacteria grow. Colour-coded compounds, often blue or another contrasting colour, are sometimes used in food processing so that fragments are easy to detect. Cleaning chemicals and temperatures used in cleaning-in-place cycles can be more aggressive than the product itself, so check compatibility with the full cleaning regime. Ask seal suppliers for compliance documentation and keep it with the equipment records.

## Gaskets and liquid sealants

O-rings are not the only static seal. Alternatives include:

- **Flat gaskets**, cut from compressed fibre, rubber, graphite, PTFE or composites, seal flanges and covers. They need sufficient bolt load to seat, and flanges must be stiff enough to load the gasket evenly.
- **Spiral-wound and metal gaskets** suit high-pressure, high-temperature pipe flanges.
- **Liquid gaskets and sealants**, such as anaerobic flange sealants and room-temperature-vulcanising silicones, fill the gap between rigid machined faces. They can seal well where faces are flat and closely fitted, but they need clean surfaces, controlled application and correct cure.
- **Bonded washers** combine a metal washer with an elastomer seal for threaded port connections.

Choosing between them depends on surface flatness, bolt load, operating conditions, need for disassembly and maintenance practice. The [choosing a joining method](/reados/collections/machine-elements-and-mechanical-design/choosing-a-joining-method/) article covers how adhesives and sealants fit among other joining methods.

## Storage and handling

Elastomers age. Heat, sunlight, ozone and contact with incompatible materials degrade them even before use. International guidance on storing rubber products recommends cool, dry, dark storage away from ozone sources such as electric motors, in their original packaging and without stretching or hanging. Rotate stock, record batch information for critical seals and do not use O-rings that are cracked, sticky, hard or deformed.

During installation:

- clean grooves and sealing surfaces;
- lubricate the O-ring with a lubricant compatible with both seal and fluid;
- avoid twisting the O-ring in the groove;
- use assembly sleeves or tools over threads and sharp edges; and
- never reuse a critical O-ring that has been in service.

## Reading seal failures

Failed seals carry evidence. Common patterns include:

| Appearance | Likely cause |
|---|---|
| Flattened cross-section that does not recover | Compression set from high temperature, excessive squeeze or incompatible material |
| Nibbled or frayed edge on one side | Extrusion due to large gaps, high pressure or soft compound |
| Swollen, soft or sticky seal | Chemical incompatibility with the fluid |
| Hard, cracked seal | Heat ageing or exceeding temperature limits |
| Fine surface cracks perpendicular to stress | Ozone or weathering attack |
| Clean cuts or nicks | Installation damage over sharp edges or threads |
| Blisters or internal ruptures | Rapid decompression in gas service |
| Twisted or spiral marks | Twisting during installation, or dynamic movement in a groove not designed for it |

Keeping failed seals, rather than discarding them, allows the cause to be found and corrected.

## A worked example

This is an illustrative example. The figures are hypothetical.

A small manufacturer's gear pump housing begins leaking at a face-sealed cover plate a few weeks after a routine service. The cover uses an O-ring with a 3.53 mm cross-section in a groove 2.70 mm deep, giving a squeeze of (3.53 − 2.70) ÷ 3.53, or about 23.5 per cent, which is within the manufacturer's recommended range for a static face seal.

The removed O-ring is swollen and soft, and pieces have been pushed into the gap between the cover and housing. The maintenance record shows that the original nitrile O-ring was replaced with an EPDM O-ring of the same size from a general kit. EPDM is generally unsuitable for mineral oil, and the pump runs on mineral hydraulic oil. The O-ring swelled, overfilled the groove and extruded.

The fix is straightforward: replace it with a nitrile O-ring of the correct size and hardness, inspect the cover face for damage and add the material specification to the pump's spare parts list and the kit labelling. The business also separates its O-ring kits by material, with clear colour-coded labels, to prevent the substitution recurring.

```figure
type: timeline
title: A cover plate leak after a routine service
caption: The groove gave a correct 23.5% squeeze; the material was the problem.
- Service | Nitrile O-ring swapped for EPDM | same size, from a general kit
- Weeks later | Leak at the cover | O-ring swollen, soft, extruded
- Cause | EPDM in mineral hydraulic oil
- *Fix | Correct nitrile O-ring | kits separated and colour-coded by material
```

## How this applies to a small Australian business

- **Specify seals fully.** Size, material, hardness and any compliance requirements, not just "O-ring".
- **Use manufacturers' gland data.** Check squeeze and fill at tolerance extremes.
- **Match the material to the fluid.** Compatibility, not appearance, decides.
- **Protect seals during assembly.** Chamfers, sleeves and lubrication prevent many failures.
- **Store seals properly** and rotate stock.
- **Keep and examine failed seals.** They show what went wrong.
- **Label spares clearly by material.** Look-alike seals in different materials are easily mixed.

## Common mistakes

- **Substituting materials** because the size fits.
- **Overfilled grooves** with no room for swell or thermal expansion.
- **Large clearance gaps at high pressure** without back-up rings.
- **Sharp edges and threads** that cut O-rings during assembly.
- **Reusing seals** in critical applications.
- **Ignoring storage conditions**, so seals are degraded before use.
- **Using sealants on dirty or oily faces.**

## Frequently asked questions

**Can we use any O-ring of the right size?** Only if the material, hardness and any compliance requirements are also right. Size alone does not ensure compatibility.

**Should O-rings be lubricated?** Usually yes, during installation, with a lubricant compatible with both the elastomer and the system fluid, unless the application prohibits it.

**When should we use a gasket instead of an O-ring?** When faces are large or irregular, when grooves cannot be machined, or when the joint design and service conditions suit a gasket better. O-rings in machined grooves usually give more reliable sealing on precise, rigid parts.

## Questions to ask

- Are our seals specified by size, material and hardness on drawings and parts lists?
- Have our groove designs been checked against manufacturers' data at tolerance extremes?
- Are the seal materials compatible with our fluids and temperatures?
- Do our parts have lead-in chamfers and protection where O-rings pass edges or threads?
- How are spare seals stored and labelled?
- When seals fail, do we examine them to find the cause?

## Bringing it together

O-rings seal through controlled squeeze in a well-designed groove, assisted by system pressure, and they fail mostly when the groove, material, gap or installation is wrong. Good static seal design uses standard sizes and manufacturers' gland data, checks squeeze and fill at the tolerance extremes, matches the elastomer to the fluid and temperature, adds back-up rings where pressure and gaps demand them and protects the seal during assembly. Gaskets and liquid sealants offer alternatives for different joints. For seals on rotating shafts, the [shafts, keys, couplings and alignment](/reados/collections/machine-elements-and-mechanical-design/shafts-couplings-and-alignment/) article covers lip and mechanical seals.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always use seal manufacturers' design guides for specific applications.*
