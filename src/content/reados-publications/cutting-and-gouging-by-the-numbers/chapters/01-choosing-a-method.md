---
book: cutting-and-gouging-by-the-numbers
chapterSlug: choosing-a-method
order: 1
title: "Choosing a cutting or gouging method"
description: "Compare oxy-fuel, plasma, laser, waterjet, saw, carbon arc and lance by thickness, speed, kerf, heat and edge, time a batch of profiles on each, and see why gouging is a different job from cutting."
draft: false
---

There are more ways to cut steel than most shops use, and each one is best at something. A fibre laser cuts thin plate faster and more accurately than anything else; plasma cuts medium plate fast and cheaply; oxy-fuel cuts very thick steel with a cheap torch; an abrasive waterjet cuts anything without heating it; a band saw cuts sections square and cold; an oxygen lance burns through steel and concrete that nothing else can reach. Gouging, the removal of metal from a surface rather than cutting through it, has its own methods: air carbon arc, plasma gouging, grinding and machining. Choosing well depends on knowing what each does and what it costs.

This chapter compares the main methods, times a batch of profiles on several of them, separates gouging from cutting, and sets out the questions that decide the choice. The chapters that follow take each method in turn.

## The methods compared

```figure
type: compare
title: Cutting methods for carbon steel plate
cols: Practical thickness | Kerf on 12 mm | Heat-affected edge | Edge and accuracy
caption: This is an illustration of typical characteristics for teaching. Real performance depends on the equipment, its power, the gas or abrasive and the operator; makers' data and the shop's trials give the real values.
- Oxy-fuel | about 3 mm to well over 300 mm | about 2 mm | wide | square, smooth with care; slower; slag on thin plate
- *Plasma | about 1 mm to about 50 mm, more on large systems | about 3 mm | narrow | slight bevel; fast; fine on high-definition systems
- Fibre laser | thin sheet to about 25–30 mm on high power | under 1 mm | very narrow | very accurate; small holes; best on thin plate
- Abrasive waterjet | almost any thickness, slowly | about 1 mm | none | accurate; slight taper; no heat
- Band or circular saw | sections and bar | blade width | none | square, cold; straight cuts only
- Carbon arc | any, crudely | wide, irregular | wide | rough; for scrap and preparation only
- Oxygen or thermic lance | very thick steel, concrete, rock | wide, irregular | wide | rough; for demolition and heavy work
```

No method wins everywhere. The laser's narrow kerf and accuracy are unmatched on thin plate, but its speed falls quickly with thickness and its capital cost is high. Plasma is fast and cheap to run on medium plate but leaves a slightly bevelled edge and a wider kerf. Oxy-fuel is slow on thin plate but uniquely cheap for thick steel, where its speed falls far more slowly with thickness than plasma's. The waterjet is slow but leaves no heat-affected zone at all, which matters for heat-treated plate and materials that heat damages. The saw is cold, square and simple, and best for sections.

## Timing a batch

The speeds of the methods differ by more than an order of magnitude, and the differences are clearest when a real job is timed.

```figure
type: bars
title: Illustrative cutting speeds on 12 mm mild steel
unit: mm per minute
max: 2600
caption: This is an illustration with typical speeds for teaching: oxy-fuel; a 200 A plasma system with oxygen; a 6 kW fibre laser with oxygen assist; and an abrasive waterjet at a quality suitable for fabrication. Real speeds come from makers' cut charts and trials.
- Oxy-fuel | 550
- *Plasma, 200 A | 2500
- Fibre laser, 6 kW | 1500
- Abrasive waterjet | 130
```

```figure
type: formula
title: Cutting time for a batch of 100 base plates in 12 mm steel
formula: time = (total cut length ÷ cutting speed) + (pierces × time per pierce)
caption: This is an illustration for base plates each with 2.4 m of outside profile and three holes of about 0.2 m perimeter each, so 3.0 m of cut and four pierces per plate, using the speeds above and assumed pierce times of about 30 s for oxy-fuel, 1 s for plasma, 2 s for the laser and 30 s for the waterjet. Moves between cuts are ignored.
- Cut per plate | 3.0 m, four pierces
- Batch | 100 plates, 300 m of cut, 400 pierces
step: plasma: 300,000 ÷ 2,500 = 120 min + 400 × 1 s ≈ 127 min
step: laser: 300,000 ÷ 1,500 = 200 min + 400 × 2 s ≈ 213 min; oxy-fuel: 545 min + 200 min ≈ 745 min
step: waterjet: 300,000 ÷ 130 ≈ 2,310 min + 200 min ≈ 2,510 min, about 42 hours
```

On this job, plasma is the fastest, the laser second, oxy-fuel about six times slower than plasma, and the waterjet about twenty times slower. The order would change for other jobs. On 3 mm sheet, the laser would be far faster than plasma and much more accurate; on 75 mm plate, oxy-fuel would be the only one of the four practical for a shop without a very large plasma system; for a heat-treated wear plate that must not be softened, the waterjet would be the only acceptable choice despite its speed. Oxy-fuel's slow pierce on 12 mm, needing preheat before the jet can start, also shows how holes and small parts favour the electric processes.

## Gouging is different

Cutting goes through the metal; gouging removes it from a surface to a controlled depth, leaving a groove. Gouging is used to back-gouge the root of a double-sided weld to sound metal before welding the second side, to remove cracked or defective welds, to excavate cracks in castings and forgings, to remove worn hardfacing, to cut out rivets and bolts, and to prepare grooves for welding. The main methods are air carbon arc gouging, plasma gouging, grinding, and, in the shop, machining.

```figure
type: compare
title: Gouging methods
cols: Removal rate | Control and finish | Notes
caption: General characteristics for teaching. Makers' data and trials give real rates for each electrode, nozzle or wheel.
- *Air carbon arc | high; several kilograms an hour | good with skill; carbon-rich surface layer | very loud; heavy fume; cheap equipment
- Plasma gouging | moderate to high | smooth groove; little carbon pickup | quieter; needs a plasma set with gouging nozzles
- Grinding | low | precise; clean metal | slow on large defects; dust and noise
- Machining or milling | moderate | precise; clean | needs the part in a machine or a portable mill
- Oxy-fuel gouging | moderate | adequate on carbon steel | carbon and low-alloy steel only
```

Gouging and cutting are often done by the same people with the same equipment, but they are different jobs, with different measures of success. A cut is judged by its edge; a gouge by whether it reached sound metal without removing more than necessary, and by the condition of the surface it leaves for welding.

## The questions that decide

Choosing a method for a job comes down to a few questions. What material and thickness? Some methods do not cut stainless or aluminium (oxy-fuel), some struggle with thick plate (laser), some with reflective metals (older lasers). What edge does the next process need? A weld preparation tolerates a rougher edge than a part that will be assembled without machining. Does heat matter? Quenched and tempered steels, some stainless grades and composites need cold cutting or a very narrow heat-affected zone. How many parts, and how often? High volumes justify a laser's capital; one-offs suit whatever is already in the shop. Where is the work? Field repairs need portable equipment. And what does it cost, in machine time, consumables, gas, power and labour, which Chapters 6 and 7 calculate?

## The kerf as lost metal

Every thermal and abrasive cut removes a strip of metal, the kerf, which becomes slag, dross or sludge. On a 12 mm plate, a 3 mm plasma kerf removes 3 × 12 = 36 mm² of steel for every millimetre of cut, about 0.28 kg per metre. Over a year of cutting it adds up, and nesting parts close together to share cuts saves both material and time. Viall's book of 1921 reproduced a calculation of the oxygen theoretically needed to burn away the metal of a kerf in oxygen cutting, and showed how much more was used in practice to blow out the slag. The kerf is where the cutting energy or gas goes, and the narrower the kerf, the less of each is needed.

## Cutting and the heat-affected zone

Thermal cutting heats the edge of the cut, and on hardenable steels it can leave a hard, brittle layer along the cut edge. That layer may crack when the part is bent or welded, or wear tools when the edge is drilled or machined. Oxy-fuel leaves the widest heat-affected zone, because it heats slowly and widely; plasma and laser leave much narrower ones. For most structural steels it does not matter; for high-strength and wear-resistant plates, the cutting method, preheat for cutting and edge treatment are specified, as later chapters describe.

## Bevels and weld preparations

Much cutting is done to prepare edges for welding, with a bevel, a land or a compound shape. Oxy-fuel and plasma bevel well, by tilting the torch, either manually on a straight-line carriage or with a bevel head on a CNC table that tilts the torch as it follows the profile. Lasers can bevel too, on machines with tilting heads, though bevelling thick plate takes them beyond their best range. Waterjets bevel accurately with tilting heads, slowly. Machining and portable bevelling machines give the most accurate preparations, particularly on pipe. The choice of method for weld preparations depends on the accuracy the welding procedure needs; a bevel cut by hand with a torch varies more than one cut by a CNC bevel head, and the welder has to make up the difference in the root.

## Holes and small features

Holes are where the methods differ most. A thermal cut starts with a pierce, and the pierce leaves a small crater and, on thick plate, a spatter of molten metal on the surface. A hole smaller than about the plate's thickness is difficult to cut cleanly with plasma, because the arc's bevel and the lead-in leave it tapered or oversize; lasers cut small holes cleanly, down to a fraction of the plate's thickness on thin sheet; oxy-fuel is poor for small holes in any thickness. For bolt holes that must fit closely, many fabricators cut a pilot or undersized hole thermally and drill or ream it to size, or drill the holes outright. The CNC table's software has settings for holes, with slower speeds and special lead-ins, which improve plasma holes considerably.

## Nesting and yield

Cutting time and material are both saved by nesting, arranging parts on the plate so that they fill it with little waste and, where possible, share cut lines. Nesting software does this automatically, and a good nest can raise the share of a plate turned into parts from perhaps 70% to 85% or more, depending on the parts. Common-line cutting, where two parts share one cut, saves both a cut and a kerf's width of metal, and is easier with the narrow, square kerf of a laser than with plasma's wider, bevelled one. Offcuts large enough to reuse are labelled with their grade and thickness and kept for later nests. For the service centre, cutting 1,400 tonnes of plate a year, each percentage point of yield was worth about 14 tonnes of steel.

## Portable and field cutting

Field repairs, demolition and site fabrication need portable equipment. Oxy-fuel is the most portable, needing only cylinders and a torch; air plasma sets running from an engine-driven generator and a compressor cut and gouge well on site; air carbon arc gouging needs only a welding set with enough current and a compressed air supply, which is why it is so common in mining and earthmoving repair. Portable magnetic-track carriages give straight, bevelled cuts in the field with oxy-fuel or plasma. Lasers, waterjets and large saws stay in the shop. When the running case's repair crews work on equipment at a mine site, they take plasma and arc-air gouging equipment and oxy-fuel, and bring the parts back to the shop when accuracy matters.

## Combining methods

Many jobs use several methods in sequence: plasma to cut a profile, a drill for its bolt holes, a grinder to clean a bevel; or oxy-fuel to cut a thick part, a saw to trim a section, arc-air gouging to remove a weld, and grinding to finish the groove before welding. Planning which method does which step, rather than forcing one method to do everything, often gives the cheapest and best result.

## Stainless, aluminium and other metals

The metal changes the choice. Oxy-fuel cuts carbon and low-alloy steels only, because it relies on the iron burning in the oxygen jet and on the oxide melting below the metal; stainless steel's chromium oxide and aluminium's oxide defeat it. Plasma cuts any conductive metal, with nitrogen or argon-hydrogen gas mixtures giving clean edges on stainless and aluminium. Fibre lasers cut stainless and aluminium well, with nitrogen assist gas to keep the edge bright. Waterjets cut anything, including stone, glass and composites. The service centre's stainless and aluminium work went to plasma with suitable gases, or to the waterjet where the edge had to be free of heat tint.

## The running case: what the business cut

This is an illustration. The service centre's manager began by listing a year's cutting: about 1,400 tonnes of plate, of which about 70% was 6 to 25 mm mild steel cut by plasma, about 15% was 30 to 100 mm cut by oxy-fuel, about 10% was 1.5 to 5 mm sheet cut by plasma with poor edge quality, and about 5% was wear plate sent to the subcontractor's waterjet. In the repair bay, air carbon arc gouging removed about 1.5 tonnes of metal a year from cracked welds and worn parts. The list pointed to two questions: whether a fibre laser would take the thin sheet and some of the medium plate more cheaply and better than plasma, and how to make the repair bay's gouging quieter, cleaner and less wasteful. The rest of the book follows both.

## A failure: the cut that cracked

This is an illustration. A fabricator elsewhere cut brackets from a quenched and tempered high-strength plate with oxy-fuel, without the preheat the plate maker recommended for thermal cutting, and then bent them. Several brackets cracked at the bend, the cracks starting at the cut edge.

The flame-cut edge had hardened, and the bend had opened cracks in the brittle layer. Recut by plasma, with the edge ground at the bend line, the next batch bent without cracking. The plate maker's guidance on cutting and forming, which the fabricator had not read, set out both the preheat for flame cutting and the edge treatment before bending.

## Exercise: which method for the sheet?

A batch of 200 enclosure panels in 3 mm mild steel needs 1.8 m of cut and six pierces each. Taking illustrative speeds of about 4,500 mm/min for plasma and 12,000 mm/min for a 6 kW fibre laser on 3 mm, and pierce times of about 0.5 s for each, how long does each take? What else might decide between them?

The batch has 200 × 1.8 = 360 m of cut and 1,200 pierces. Plasma takes about 360,000 ÷ 4,500 = 80 minutes plus 1,200 × 0.5 s = 10 minutes, about **90 minutes**; the laser takes about 360,000 ÷ 12,000 = 30 minutes plus 10 minutes, about **40 minutes**.

The laser is more than twice as fast here, and its narrower kerf, squarer edge and smaller heat-affected zone give a better edge on thin sheet, with small holes cut cleanly where plasma would leave tapered or oversized ones. Against that stand the laser's much higher capital cost and its running costs, which Chapter 7 compares, and whether there is enough thin sheet work to keep a laser busy.
