---
title: "Choosing a manufacturing process for metal parts: casting, forging, machining, fabrication and more"
description: "The process you choose fixes a metal part's cost, lead time and properties. How to compare casting, forging, machining, fabrication, press work, powder metallurgy and 3D printing."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - manufacturing
  - design
  - product-development
author: "BIZOMAT"
featured: false
draft: false
---

The same metal part can often be made in several ways. A pump housing could be cast, machined from a solid block or fabricated from plate and welded. A gear blank could be forged, cut from bar or made from sintered powder. A bracket could be laser cut and folded, stamped, cast or 3D printed. Each route gives a different unit cost, tooling cost, lead time, weight, strength and appearance, and each suits a different quantity.

The choice is often made by habit: the part is machined because the business has machines, or fabricated because the last one was. Sometimes that is right. Often it means paying for hours of machining to remove metal that a casting would never have contained, or paying for pattern and tooling that a few dozen parts can never recover. Because the process shapes the geometry, the process should be considered while the part is being designed, not after.

This article explains the factors that drive process selection, the main metal-forming processes and where each fits, the essential design rules for castings, and a practical way to compare options on cost. It is general information for designers, engineers and buyers. Process capabilities vary between suppliers, so confirm details with the people who will make the parts.

## The factors that drive the choice

Start from what the part must do and how many are needed:

- **Quantity**: total over the product's life and per batch. Tooling-intensive processes need volume to pay back.
- **Size and weight**: some processes have hard size limits, such as die casting machines or powder compaction presses.
- **Geometry**: internal passages, undercuts, thin walls and free-form surfaces favour casting or additive manufacturing; simple prismatic shapes favour machining or fabrication.
- **Material**: some alloys cast well, some machine well, some can only be formed or ground. Hard-to-machine alloys push towards near-net-shape processes.
- **Properties**: strength, fatigue resistance, toughness, pressure tightness, wear resistance and weldability differ by process, not only by alloy.
- **Tolerances and finish**: the process sets what is achievable directly and what needs machining afterwards.
- **Lead time**: patterns, dies and moulds take weeks or months; machining and fabrication can start immediately.
- **Supply base**: who can make it, where, and how reliable the supply will be.

A useful concept is **near-net shape**: making a part close to its final form, so little material is removed. A machined part that starts as a large block and ends as a thin housing wastes material and machine time; a casting or forging that starts close to final shape needs only critical faces machined.

## The main process families

| Process | How it works | Best suited to | Main limitations |
|---|---|---|---|
| Machining from solid | Removing material from bar, plate or billet | Low volumes, precise prismatic and turned parts, quick start | Material waste and long cycle times for complex or hollow parts |
| Fabrication | Cutting, bending and welding plate, sheet and sections | Frames, enclosures, large structures, low to medium volume | Labour-intensive, distortion, weld quality control |
| Sand casting | Pouring metal into a sand mould made from a pattern | Complex shapes, internal passages, any size, low to medium volume | Rougher surface, looser tolerances, machining allowances needed |
| Investment casting | Pouring metal into a ceramic shell formed around a wax pattern | Intricate, accurate small and medium parts in almost any alloy | Higher unit cost than sand casting, wax pattern tooling |
| Die casting | Injecting molten aluminium, zinc or magnesium into steel dies | High volumes of thin-walled, accurate non-ferrous parts | Expensive dies, limited alloys, porosity limits heat treatment and welding |
| Forging | Shaping hot metal between dies or hammers | Strong, tough parts under fatigue and impact loads | Die cost for closed-die forging, limited internal features |
| Press work | Blanking, piercing and forming sheet in dies | High volumes of sheet parts | Dedicated tooling, mainly sheet geometry |
| Powder metallurgy | Pressing metal powder in dies and sintering it | High volumes of small, complex parts such as gears and bushes | Size limited by press force, no threads or undercuts, some porosity |
| Additive manufacturing | Building parts layer by layer from powder or wire | Complex, low-volume, lightweighted or consolidated parts | High unit cost, post-processing, qualification effort |

Many real parts combine processes: a casting or forging is machined on its critical faces; a fabrication includes machined bosses; a 3D-printed part is heat treated and machined.

## Castings: why they suit complex parts

Casting forms metal by pouring it into a mould and letting it solidify. It can make shapes that would be wasteful or impossible to machine or fabricate, such as engine blocks, valve bodies and pump casings with internal passages, from grams to many tonnes.

### Shrinkage and the pattern

Metal contracts as it cools, so the **pattern**, the model used to form the mould, is made larger than the finished casting by a **shrinkage allowance**. As a rough guide, grey cast iron contracts by about 1% and steel by about 2%. A steel casting meant to finish 500 mm long needs a pattern about 510 mm long, while the same part in grey iron needs about 505 mm. Foundries and patternmakers set the allowance for the metal and geometry.

The pattern also needs **draft**, a taper on faces parallel to the direction it is drawn from the sand, **core prints** to locate sand cores that form internal passages, and **machining allowances** on faces that will be machined.

### Solidification and feeding

Metal also shrinks as it changes from liquid to solid. Thick sections freeze last, and as they freeze they draw liquid from around them. If no liquid is available, a **shrinkage void** forms. Foundries attach **risers**, reservoirs of molten metal that freeze after the casting and feed it.

A rule known as **Chvorinov's rule** describes this: solidification time rises with the square of a section's volume divided by its cooling surface area, called its modulus. A 100 mm cube has a volume of one million cubic millimetres and a surface of 60,000 square millimetres, giving a modulus of about 16.7 mm. A thin plate of the same volume has far more surface, a much smaller modulus and freezes far sooner. Heavy, isolated sections become hot spots that need feeding.

```figure
type: stats
title: Why thick sections freeze last
caption: Chvorinov's rule: solidification time rises with the square of volume divided by cooling surface area.
- 1,000,000 mm³ | Volume of a 100 mm cube
- 60,000 mm² | Its cooling surface
- *About 16.7 mm | Its modulus | a thin plate of the same volume freezes far sooner
```

### Design rules for castings

- **Keep sections as uniform as practical** and avoid isolated heavy masses.
- **Blend changes in section** gradually and use generous fillets at junctions to reduce hot spots and cracking.
- **Add draft** to faces in the direction of mould withdrawal.
- **Design cores** that can be supported and from which sand can be removed.
- **Provide machining allowances** and clear datum and clamping surfaces for the first machining operation.
- **Avoid sharp internal corners**, which concentrate stress and cause hot tears.
- **Involve the foundry** in gating, risering and parting line decisions before the pattern is made.

### Casting methods

- **Green sand moulding**, using sand bonded with clay and water, suits most general castings and is economical for low to medium volumes.
- **Chemically bonded sand**, also called no-bake, gives stronger, more accurate moulds for larger and more precise castings.
- **Shell moulding** uses resin-coated sand for better finish and accuracy in medium volumes.
- **Investment casting**, the lost-wax process, gives fine detail, good accuracy and good surface finish in almost any alloy, including those too hard to machine easily.
- **Gravity die or permanent mould casting** pours metal into reusable metal moulds for better properties and finish than sand in medium volumes.
- **High-pressure die casting** injects aluminium, zinc or magnesium alloys into steel dies at high speed. Parts are thin-walled, accurate and cheap at volume, but trapped gas usually prevents conventional heat treatment and makes welding difficult.
- **Centrifugal casting** spins the mould, suiting pipes, bushes and rings.

### Common cast metals

- **Grey cast iron** is cheap, pours easily, machines well and damps vibration. It is strong in compression but brittle in tension, suiting machine bases, housings and brake components.
- **Ductile, or spheroidal graphite, iron** has graphite in spheres, giving much better toughness and strength. It often replaces fabrications and steel castings.
- **White and alloyed abrasion-resistant irons** are very hard and suit wear parts.
- **Cast steels** are tougher and weldable, suiting structural and pressure-containing parts.
- **Stainless steel castings** suit corrosive service such as pump and valve bodies.
- **Austenitic manganese steel** work hardens under impact. Its surface hardness can rise from about 200 Brinell to around 500 in service while the interior stays tough, which suits crusher liners and wear parts, although it is very difficult to machine.
- **Aluminium and copper alloys** cast well for lighter, corrosion-resistant or conductive parts.

Australian Standards cover many cast materials, such as AS 1830 for grey cast iron, AS 1831 for ductile cast iron and AS 2074 for cast steels. Specify the standard and grade on the drawing rather than a generic description such as "cast iron".

### Casting quality

Common casting defects include gas and shrinkage porosity, sand inclusions, cold shuts where metal streams fail to fuse, misruns where the mould does not fill and hot tears. Inspection might include visual examination, dimensional checks, magnetic particle or dye penetrant testing for surface cracks, radiography for internal soundness and pressure testing for pressure-containing parts. Specify inspection that matches the part's function, and agree acceptance criteria and test bars or certificates with the foundry.

## Forging: strength through grain flow

Forging shapes hot metal by hammering or pressing. It refines the metal's structure and aligns its grain with the part's shape, giving good strength, toughness and fatigue resistance, which suits crankshafts, connecting rods, hooks, flanges and highly loaded levers. **Open-die forging** suits large or low-volume parts with simple shapes; **closed-die forging** suits higher volumes of more complex shapes but needs dedicated dies. Forgings usually need machining on functional faces.

## Powder metallurgy and fine blanking

**Powder metallurgy** presses metal powder into a die and then **sinters** it, heating it in a controlled atmosphere so the particles bond. It produces small, complex parts such as gears, cams and bushes in high volumes with little waste and little machining. It can also make parts with controlled porosity, such as oil-impregnated self-lubricating bushes and filters. Limits include part size, the difficulty of forming threads, undercuts and sharp features, and some loss of strength from porosity.

**Fine blanking** is a press process that produces flat parts with smooth, fully sheared edges and good flatness, often removing secondary machining. It needs special presses and tooling and suits high volumes of precise flat parts such as gear plates and latches.

## Additive manufacturing

Additive manufacturing, often called 3D printing, builds parts layer by layer from powder, wire or resin. For metals, **laser powder bed fusion** is the most common precision process. Additive manufacturing suits complex internal channels, lattice structures, consolidated assemblies and low volumes, and it needs no part-specific tooling.

Its costs and limits are real: high machine and material costs, support structures that must be removed, rough as-built surfaces that may need machining, heat treatment to relieve stresses and the qualification effort needed for critical parts. Additive processes are also valuable indirectly: printed sand moulds and cores and printed investment casting patterns can produce prototype castings without making pattern tooling.

## Comparing options on cost

Process choice is mostly an economic decision once technical requirements are met. Compare total cost over the expected volume:

- **Tooling cost**: patterns, core boxes, dies, moulds and fixtures.
- **Unit cost**: material, process cost, machining, finishing, inspection and freight.
- **Quality cost**: expected scrap, rework and inspection.
- **Time and risk**: lead time to first parts, sampling, design change cost and supplier risk.

Divide the tooling cost by the saving per part to find the **breakeven quantity**. Then ask whether the design is stable enough to commit to tooling, and whether the supplier is reliable. The [make or buy](/reados/collections/manufacturing-operations-and-design-for-manufacture/make-or-buy-in-house-manufacturing-or-outsourcing/) article covers the decision to make parts in-house or source them, and [should-cost modelling](/reados/collections/procurement-and-tendering/should-cost-modelling-for-bought-parts/) helps judge whether supplier quotes are reasonable.

## A worked example

This is an illustrative example. A business that makes industrial pumps fabricates a bearing housing bracket from steel plate, welds it, stress relieves it and machines it. The bracket costs about $290 including all labour and machining, and the business expects to use about 400 a year for several years. The design has been stable for some time.

**Options.** The engineer compares three routes:

- **Continue fabricating** at about $290 per part, with no tooling.
- **Machine from solid**, which would waste most of a large steel block and needs long machining time; quoted at about $340 per part.
- **Cast in ductile iron**, with a pattern and core box costing about $12,000, a casting price of about $110 and machining of about $60, giving about $170 per part.

**Analysis.** Casting saves about $120 per part, so the tooling breaks even after about 100 parts, roughly three months of usage. Ductile iron meets the strength and toughness needs, and the shape can be improved for stiffness with ribs and fillets that would be costly to fabricate. The foundry suggests moving the parting line to remove one core, adding draft and blending a heavy boss into the surrounding walls to avoid a shrinkage hot spot.

```figure
type: bars
title: Cost per bearing housing bracket
unit: $
max: 360
caption: The $12,000 casting pattern breaks even after about 100 parts, roughly three months at 400 a year.
- Machined from solid | 340
- Fabricated, as now | 290
- *Ductile iron casting, machined | 170 | $110 casting + $60 machining
```

**Decision and checks.** The business commissions the pattern, specifies the ductile iron grade to the relevant standard, requires test certificates and agrees a first-article inspection with dimensional checks and magnetic particle testing on critical areas. Fabrication remains available for rare special variants. After the payback period, the change saves about $48,000 a year at current volumes.

## Applying this in an Australian business

- **Consider process options while designing**, not after the drawing is finished.
- **Estimate lifetime volume** and design stability before committing to tooling.
- **Shortlist processes** against geometry, material, properties and tolerances.
- **Ask suppliers for design-for-manufacture advice** early.
- **Compare total cost** including tooling, unit, quality and lead time.
- **Specify materials by standard and grade**, with testing and certificates.
- **Plan first-article inspection** and approval for new tooling.
- **Review periodically**, because volumes change and the best process changes with them.

## Where process selection goes wrong

- **Choosing by habit** or by what the business owns.
- **Machining from solid** at volumes that would justify casting or forging.
- **Investing in tooling** before the design is stable.
- **Designing castings like fabrications**, with heavy isolated sections and sharp corners.
- **Specifying "cast iron" or "casting"** without grade, standard or inspection.
- **Ignoring lead time** for patterns, dies and sampling.
- **Comparing unit prices only**, without tooling, quality or freight.

## Questions to ask when choosing a process

- How many parts will we need, over what period, and how stable is the design?
- Which processes can make this geometry in this material?
- What properties, tolerances and inspection does the part really need?
- What does each option cost in tooling, per part and in quality?
- What is the breakeven quantity, and how long will it take to reach?
- Which suppliers can do it, and what is their lead time and track record?

## Bringing it together

Choosing a manufacturing process is a design decision with long-lasting cost consequences. Start from function, quantity and design stability, then shortlist processes that can make the geometry in the required material with the required properties. Castings make complex shapes economically when designed with shrinkage, feeding, draft and uniform sections in mind. Forgings give strength and fatigue resistance; powder metallurgy and press work give low unit costs at volume; additive manufacturing gives freedom for complex, low-volume parts. Compare options on total cost, including tooling, quality and lead time, find the breakeven and involve suppliers early. The result is parts that cost less to make and perform as intended.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT engineering handbooks on metal casting materials and processes, iron and steel castings, process selection for powder metallurgy, press work and fine blanking, and rapid prototyping and additive manufacturing, together with established manufacturing practice. The worked example is illustrative. This article is general information; confirm process capabilities with suppliers.*
