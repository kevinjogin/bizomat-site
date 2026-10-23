---
title: "Areas, volumes and masses for the workshop: estimating material, weight, coatings and lifts"
description: "How to calculate areas, volumes and masses of plates, bars, tubes, tanks and welds, use densities and mass-per-metre figures, and apply them to quoting, coating, handling and lifting."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - manufacturing
  - design
  - operations
author: "KEVOS"
featured: false
draft: false
---

Workshops calculate areas, volumes and masses all day, often without calling it mathematics. An estimator works out how much plate a job needs. A fabricator checks whether a fabricated frame can be lifted by two people or needs the overhead crane. A painter estimates how many litres of coating a tank will take. A storeman works out whether a delivery of bar will exceed a truck's load. Each calculation feeds a decision about cost, safety or logistics, and each is easy to get wrong by a factor of ten when units are mixed or a formula is misremembered.

The geometry involved is mostly simple: rectangles, triangles, circles, cylinders, tubes and spheres, combined by adding and subtracting. What makes the calculations reliable is method: breaking shapes into simple parts, keeping units consistent, using the right density and checking the answer against a quick estimate. Mass-per-metre and mass-per-square-metre figures for common sections and plates make many calculations almost instant.

This article sets out the core area and volume formulas, how to handle composite shapes, how to convert volume to mass with density, useful shortcuts for steel and aluminium, and how these calculations apply to quoting, coatings, welding, handling and lifting.

## Areas of common shapes

The basic area formulas cover most workshop needs:

- **Rectangle**: length × width.
- **Triangle**: ½ × base × perpendicular height.
- **Circle**: π × r², or π × d² ÷ 4 when the diameter is known.
- **Annulus** (a ring between two circles): π × (D² − d²) ÷ 4.
- **Sector of a circle**: (θ ÷ 360) × π × r², with θ in degrees.
- **Trapezium**: ½ × (sum of the parallel sides) × the distance between them.

Using the diameter form for circles avoids a common slip: forgetting to halve the diameter before squaring, which gives an area four times too large.

## Composite shapes

Most real parts are combinations of simple shapes. The method is to divide the part into rectangles, triangles and circles, calculate each, then add the solid areas and subtract holes and cut-outs. A sketch with each region labelled, and the calculation laid out in a table, makes the work easy to check. CAD systems calculate areas and masses automatically, but a hand estimate remains valuable as a check that the model is correct and the right material is assigned.

## Volumes of common solids

- **Prism or plate**: cross-sectional area × length or thickness. This covers flat bar, plate and any extruded section.
- **Cylinder or round bar**: π × d² ÷ 4 × length.
- **Tube**: π × (D² − d²) ÷ 4 × length, where D and d are the outside and inside diameters.
- **Cone**: ⅓ × base area × height.
- **Sphere**: (4 ÷ 3) × π × r³.
- **Frustum of a cone** (a cone with its top cut off): (π × h ÷ 3) × (R² + R × r + r²).

As with areas, composite volumes are built by adding and subtracting simple solids.

## Keep the units consistent

Dimensions on drawings are usually in millimetres, but densities are usually in kilograms per cubic metre. Mixing them is the most common source of large errors. Two safe approaches are:

- convert all dimensions to metres before calculating volume in cubic metres; or
- calculate in cubic millimetres and remember that 1 m³ = 10⁹ mm³.

Volumes of liquids are often wanted in litres: 1 m³ = 1,000 litres, and 1 litre = 10⁶ mm³.

## From volume to mass

Mass equals volume multiplied by density. Approximate densities for common materials are:

- steel: about 7,850 kg/m³;
- stainless steel: about 7,900 to 8,000 kg/m³;
- aluminium alloys: about 2,700 kg/m³;
- copper: about 8,900 kg/m³;
- concrete: about 2,400 kg/m³; and
- water: about 1,000 kg/m³.

Densities vary slightly with alloy and grade, so supplier data should be used where precision matters.

## Shortcuts for steel and aluminium

Because steel's density is about 7.85 tonnes per cubic metre, steel plate weighs about **7.85 kg per square metre for every millimetre of thickness**. A 10 mm steel plate weighs about 78.5 kg/m², and a 3 mm sheet about 23.6 kg/m². Aluminium, about a third as dense, weighs about 2.7 kg/m² per millimetre.

```figure
type: bars
title: Steel plate mass per square metre
unit: kg/m²
max: 100
caption: About 7.85 kg per square metre for every millimetre of thickness.
- 3 mm sheet | 23.6
- 10 mm plate | 78.5
- *12 mm plate | 94.2
```

For sections, tubes and bars, suppliers publish **mass per metre** values. Multiplying mass per metre by length gives the mass of a member immediately. For a round tube, the mass per metre can be calculated from π × (D² − d²) ÷ 4 × density. A steel tube of 60.3 mm outside diameter and 3.6 mm wall thickness weighs about 5.0 kg per metre, so a 6 m length weighs about 30 kg. The [structural steel sections and grades](/reados/collections/machine-elements-and-mechanical-design/structural-steel-sections-and-grades/) article explains how standard sections and their published properties are used.

## Surface area for coatings

Coating quantities depend on surface area. Paint and coating suppliers publish theoretical coverage rates for a given dry film thickness, and practical estimates allow for losses in application, which vary with the method and the shape of the work. For a cylindrical tank, the surface area is the side, π × d × length, plus the two ends, each π × d² ÷ 4. A tank 1.2 m in diameter and 2.0 m long has an external area of about 9.8 m². Internal surfaces, stiffeners, edges and both sides of sheet must be counted where they are coated. The [designing sheet metal parts for manufacture](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/) article discusses how part design affects finishing.

## Capacity of tanks and containers

The capacity of a tank is its internal volume. The same 1.2 m diameter, 2.0 m long cylindrical tank holds about π × 0.6² × 2.0 ≈ 2.26 m³, or about 2,260 litres. When filled with water, the contents weigh about 2.26 tonnes, a load that supports, floors and lifting arrangements must carry. For other liquids, multiply by their density. Usable capacity is often less than the geometric volume because of freeboard, sumps and outlet positions.

## Weld metal

Weld volumes drive filler consumption, welding time and cost. A fillet weld with equal legs has a cross-sectional area of about ½ × leg², so a 6 mm fillet has an area of about 18 mm². Multiplying by the weld length gives the volume, and by density the mass of weld metal. A 2 m run of 6 mm fillet contains about 0.28 kg of weld metal, before allowing for spatter, stub losses and deposition efficiency, which can increase the filler needed considerably. Larger welds grow quickly: doubling the leg length quadruples the area, which is one reason oversized fillet welds are costly.

## Handling and lifting

Mass estimates are essential for safe handling. Manual handling risk assessments consider the mass of loads along with their shape, grip, frequency and posture. For crane and forklift lifts, the mass of the load, the position of its centre of gravity and the capacity of slings, shackles, lifting points and equipment must be known. Estimating the mass of a fabricated item before it is lifted, and adding allowances for fittings, contents or uncertainty, prevents overloading. Where the mass or centre of gravity is uncertain, it should be checked, for example with a load cell. The [before you buy big equipment](/reados/collections/suppliers-contractors-and-government-work/planning-the-path-from-supplier-to-installation/) article covers planning lifts and access for large items.

## Centre of gravity

For lifting, transport and stability, the position of the centre of gravity matters as much as the mass. For a composite object, the centre of gravity can be found by dividing it into simple parts, finding each part's mass and centre, and taking the mass-weighted average of the positions in each direction. A frame with a heavy motor at one end will hang tilted from a central lifting point and may swing dangerously when lifted. Machines on wheels, racking and tall cabinets can tip if their centre of gravity sits high or moves outside their base when doors open or drawers extend. CAD systems report centres of gravity, but only if the materials and components are modelled correctly.

## Bulk materials and stockpiles

Bulk materials such as sand, gravel, grain, plastic pellets and powders are quoted and handled by volume and by mass. Their **bulk density**, the mass of a given volume including the air spaces between particles, is much lower than the density of the solid material and varies with moisture, compaction and particle size. Estimating the capacity of a hopper, bin or truck requires the bulk density of the material in its actual state. Stockpile volumes can be estimated by treating the pile as a cone or a prism with sloping sides, using the material's angle of repose to relate height and base.

## Actual weights versus nominal

Calculated masses use nominal dimensions, but supplied material varies within tolerances. Plate thickness, bar diameter and tube wall thickness all have permitted variations, and coatings such as galvanising add mass. Where material is bought or sold by weight, or where mass affects performance, actual weights may differ from calculated values by a few per cent. For transport limits and lifting, a sensible allowance for these variations, fittings and packaging avoids surprises.

## Material for quoting and nesting

For quoting, the material cost depends on what must be bought, not just on what ends up in the part. Plate is bought in standard sheet sizes, bar in standard lengths, and offcuts may or may not be reusable. Calculating the finished mass gives a lower bound; nesting parts on standard sheets and adding cutting allowances gives the realistic purchase quantity. The difference is scrap, and it can be substantial for parts with large cut-outs or awkward shapes.

## Checking calculations

Useful checks include:

- **Estimate first**: a 1 m² plate 10 mm thick is about 78.5 kg; is the answer in that range?
- **Cross-check with CAD** mass properties, confirming the material and density assigned.
- **Weigh a sample** where the part exists.
- **Check units** at every step, especially conversions between millimetres and metres.
- **Compare with supplier data** for standard sections.

## A worked example

This is an illustrative example. The part and figures are hypothetical.

A fabricator is quoting 40 steel base plates, each 1,200 mm × 800 mm × 12 mm with four 22 mm holes. The plate area is 1.2 × 0.8 = 0.96 m², and the volume is 0.96 × 0.012 = 0.01152 m³. The four holes remove π × 0.011² × 0.012 × 4 ≈ 0.000018 m³. The finished mass of each plate is about (0.01152 − 0.000018) × 7,850 ≈ 90.3 kg, so the batch weighs about 3.6 tonnes.

Two checks confirm the estimate. Using the shortcut, 12 mm plate weighs about 12 × 7.85 = 94.2 kg/m², and 0.96 m² of it weighs about 90.4 kg before holes. The CAD model reports 90.3 kg once its material is set to steel; earlier, with no material assigned, it had reported a meaningless value.

```figure
type: stats
title: Three ways to the same base plate mass
caption: 40 plates of 1,200 × 800 × 12 mm with four 22 mm holes: about 3.6 tonnes in all.
- 90.3 kg | Calculated, with holes
- 90.4 kg | Plate shortcut, before holes
- *90.3 kg | CAD model, set to steel
```

The fabricator also checks handling. At about 90 kg each, the plates cannot be lifted manually, so the job is planned with a vacuum lifter, and the delivery is checked against the truck's capacity. For the quote, plates are nested on standard sheets, adding about 6% for offcuts and kerf to the material cost.

## How this applies to a small Australian business

- **Break parts into simple shapes** and lay calculations out in a table.
- **Keep units consistent**, converting millimetres to metres before using densities.
- **Use mass-per-metre and mass-per-square-metre shortcuts** for quick checks.
- **Include internal surfaces, edges and stiffeners** in coating estimates.
- **Estimate masses before every significant lift.**
- **Find the centre of gravity** of awkward items before lifting or transporting them.
- **Use bulk densities in their actual state** for hoppers, bins and truck loads.
- **Allow for tolerances, coatings and fittings** when masses matter for transport or lifting.
- **Quote on purchased material**, including nesting losses.

## Common mistakes

- **Using diameter instead of radius** in π × r².
- **Mixing millimetres and metres** in volume calculations.
- **Forgetting the contents** when estimating loads on supports.
- **Assuming CAD masses are right** without checking the material assigned.
- **Ignoring weld deposition losses** when estimating filler.
- **Quoting on finished mass** instead of purchased material.

## Frequently asked questions

**How much does steel plate weigh?** About 7.85 kg per square metre for each millimetre of thickness.

**How is the capacity of a cylindrical tank found in litres?** Calculate π × r² × length in cubic metres using internal dimensions, then multiply by 1,000.

**Why do fillet weld costs rise so quickly with size?** Because the weld area grows with the square of the leg length.

**Why do calculated and weighed masses differ?** Nominal dimensions, material tolerances, coatings, weld metal, fittings and the density value used all introduce small differences. Weighing a sample and comparing it with the calculation shows whether the method is reliable for future estimates.

**Should masses be rounded up for lifting?** Yes. Lifting plans should use a conservative mass that allows for uncertainty, attachments and contents, never an optimistic one.

## Questions to ask

- Do our quotes account for nesting losses and offcuts?
- How do we confirm the mass of items before lifting them?
- Are CAD models checked for correct material assignment?
- Do coating estimates include all coated surfaces?
- Where could a units slip in our calculations cause a costly error?

## Bringing it together

Areas, volumes and masses underpin quoting, coating, welding, handling and lifting. Simple formulas for rectangles, triangles, circles, cylinders, tubes, cones and spheres, combined by adding and subtracting, cover most workshop shapes. Consistent units, the right density, shortcuts such as 7.85 kg/m² per millimetre of steel plate and quick cross-checks against CAD and supplier data keep the answers reliable and the lifts safe.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
