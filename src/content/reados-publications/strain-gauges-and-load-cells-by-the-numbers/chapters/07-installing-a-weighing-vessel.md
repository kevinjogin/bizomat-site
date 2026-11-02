---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: installing-a-weighing-vessel
order: 7
title: "Installing a weighing vessel"
description: "How to size a hopper's load cells from its volume and load sharing, mount them so the vessel can grow and move freely, and stop pipes, chutes and cables from carrying weight past the cells."
draft: false
---

A weighing hopper is a scale whose platform happens to be a steel vessel full of feed, hanging among chutes, vents, cables, pipes and walkways. The load cells weigh everything that rests on them and nothing that does not. Any connection that carries part of the vessel's weight to the building, or pushes on it sideways, takes that weight out of the reading. Most weighing errors in process plants come from the installation, not from the cells.

This chapter works through BH-2's installation: its volume and the batch it can hold, the load each cell carries when the batch is off-centre, the mounting hardware that lets the hopper grow and move without disturbing the cells, and the connections that must be flexible. It ends with a steel spool that cost the mill fourteen kilograms a batch.

## How much does the hopper hold?

Load cells are sized from the largest load the vessel can carry, which depends on its volume and the densest material it may hold, not just the nominal batch. BH-2 has a cylindrical upper section 1,800 mm in diameter and 1,200 mm high above a cone that tapers to a 300 mm outlet over 1,300 mm.

The [cylindrical tank contents tool](/tools/tank-volume/) gives the volume of a level cylindrical tank at a given depth; for a vertical cylinder 1,800 mm in diameter filled to 1,200 mm it gives 3,053.6 L. The [hopper and frustum volume tool](/tools/frustum-volume/) gives the volume and slant area of a round or rectangular hopper; for the cone it gives 1,317.1 L and a side angle of 60.0° from the horizontal.

```figure
type: steps
title: BH-2's volume and what it can hold
caption: This is an illustration. Volumes from the cylindrical tank contents and hopper and frustum volume tools, with flat-topped fill to the top of the cylinder. Bulk densities of the mill's mash ingredients range from about 550 to 650 kg/m³; the batch volume is at the typical 600 kg/m³.
- Cylindrical section, 1,800 mm × 1,200 mm | 3,053.6 L
- Cone, 1,800 to 300 mm over 1,300 mm | 1,317.1 L
- * Total volume to the top of the cylinder | 4,370.7 L
- Level full at 600 kg/m³ | 2,622 kg
- A 2,500 kg batch at 600 kg/m³ | 4.17 m³, 95% of the volume
- Level full at 650 kg/m³ | 2,841 kg
```

Two points follow. A 2,500 kg batch of a light mix, at 550 kg/m³, needs 4.55 m³ and does not fit: the hopper can hold only 2,404 kg of it. Light formulations must be weighed in two drops or have their batch size reduced, and BH-2 has a high-level probe that stops filling before meal backs up into the feeders. And a dense mix at 650 kg/m³ could in principle fill the hopper to 2,841 kg if the batching program allowed it, which is the figure the cells must be sized for. The Library's [Bulk Solids Flow by the Numbers](/reados/publications/bulk-solids-flow-by-the-numbers/) explains why bulk density varies with the material, its moisture and how it was filled.

## Sizing the cells

The cells carry the hopper's dead weight and the batch. With the batch centred, BH-2's 1,150 kg dead load and 2,500 kg batch put 1,216.7 kg on each cell. But feed falls into BH-2 from an inlet chute 150 mm off the hopper's centre line, towards cell 1, and heaps under it before levelling, so the batch's centre of gravity sits off-centre.

With three supports equally spaced at radius r and a load W whose centre is offset a distance e towards one support, that support carries W ÷ 3 × (1 + 2e ÷ r) and each of the other two W ÷ 3 × (1 − e ÷ r). BH-2's cells sit at a radius of 1,050 mm.

```figure
type: compare
title: Load on BH-2's cells with the batch 150 mm off-centre towards cell 1
cols: Dead load share | Batch share | Total | Share of 2,000 kg rating
rowhead: Cell
- * Cell 1 | 383.3 kg | 1,071.4 kg | 1,454.8 kg | 73%
- Cell 2 | 383.3 kg | 714.3 kg | 1,097.6 kg | 55%
- Cell 3 | 383.3 kg | 714.3 kg | 1,097.6 kg | 55%
caption: This is an illustration. Dead load assumed centred; batch 2,500 kg at e = 150 mm, r = 1,050 mm. The three shares always add to the total, which is why an off-centre load does not change the reading of a correctly trimmed system, only the load on each cell.
```

Beyond the static load, cells must allow for dynamic loads when material drops onto the cone, vibration from the discharge vibrator, wind on outdoor vessels and, where it applies, earthquake. Common practice is to choose cells whose combined rating is well above the largest static gross load, so that the most heavily loaded cell stays below its rating under normal operation and within its safe overload under the worst dynamic event. BH-2's three 2,000 kg cells give 6,000 kg against 3,650 kg, a ratio of 1.64, and the most heavily loaded cell runs at 73% of its rating. The structural design of the vessel and its supports is a separate matter for a structural engineer.

## Three supports or four

BH-2 stands on three cells, and that is not an accident. A body resting on three points is statically determinate: the three reactions are fixed by the weight and its position alone, whatever the stiffness of the supports or small differences in their height. If one stand settles 1 mm, the hopper tilts slightly and the shares stay the same.

On four supports the shares depend on stiffness and level. A table with four legs on an uneven floor rocks, and a hopper on four cells whose supports are not in one plane carries most of its weight on two diagonal cells, with the other two lightly loaded. The total still reads correctly in principle, but the heavily loaded cells may be overloaded and the lightly loaded ones may lift off under a side force. Vessels on four or more cells need their supports shimmed level under load, which the cell maker's instructions describe, and checked again after the structure settles.

## Mounting hardware

A load cell must be loaded in the way it was designed for and nothing else. Makers therefore sell cells in mounting assemblies, often called weigh modules, which provide three functions.

1. **A defined load path.** A rocker pin, ball and cup or elastomer pad centres the load on the cell's loading point and lets the vessel tilt slightly without bending the cell.
2. **Freedom to move.** The vessel grows when it warms and when it fills. BH-2, warmed by 20 K by hot meal from the pellet line's cooler, grows outwards at its lugs by 11.5 × 10⁻⁶ × 20 × 1,050 = 0.24 mm. The mounting must let the lugs slide or rock that far without dragging the cell sideways.
3. **Restraint without load.** The vessel must not be able to walk off its cells, rotate or lift off in a fault. Weigh modules include check bolts or stay rods that stop movement beyond a small clearance, and anti-lift-off devices. In normal operation these must not touch: a check bolt tightened against its stop carries load past the cell.

Stay rods are a common restraint on tall vessels. They are fitted horizontal, so that they hold the vessel sideways without taking any vertical load, and with a small clearance or flexibility so that the vessel can still move down by the cells' deflection.

Two electrical points belong here too. Load cells must never carry welding current: welding on a vessel or on structure attached to it with the cells in place can pass hundreds of amperes through a cell's body and destroy its gauges. Cells should be disconnected and bypassed with a heavy earth strap, or the weld return clamp placed so that the current cannot pass through the cells. And a flexible earthing strap across each mount gives lightning and static a path that bypasses the cell, which is the precaution that would have saved the cell lost in the storm in Chapter 5.

```figure
type: checklist
title: BH-2 installation checks after maintenance
caption: This is an illustration of the mill's checklist; the cell maker's installation manual is the authority for a real system.
- x All three cells loaded through their rocker pins, base plates level and bolts at the specified torque
- x Check bolts and anti-lift-off devices clear of their stops by the stated gap
- x Earth strap fitted across each mount
- x Inlet, vent and outlet connections flexible and not stretched or compressed
- x Nothing resting on or attached to the hopper that is not weighed: no tools, ladders, cable trays or temporary supports
- x Zero checked with the hopper empty and clean
- ? Corner test and calibration if any cell or mount was disturbed (Chapter 8)
```

## Connections that carry weight

BH-2 has an inlet from the ingredient feeders, a dust vent to the bag filter and an outlet gate into the screw feeder. Each connection joins the weighed hopper to the unweighed building, and each, if stiff, acts as a spring in parallel with the cells.

The reasoning is simple. When a batch is added, the cells deflect and the hopper moves down. Anything rigidly attached to it is pulled down by the same distance and pushes back with a force equal to its stiffness times that distance. That force is weight the cells never see. BH-2's cells deflect 0.30 mm at their rated 2,000 kg, so a 2,500 kg batch, 833 kg per cell, moves the hopper down by 0.125 mm.

The [beam stress and deflection tool](/tools/beam-deflection/) gives the force that deflects a cantilever by a given amount, by trying loads until the deflection matches, or equivalently its stiffness, 3EI ÷ L³. For an 80 NB steel pipe, 88.9 mm outside diameter and 4.0 mm wall, its second moment of area is 963,398 mm⁴.

```figure
type: compare
title: Weight lost to a rigid pipe connected to BH-2
cols: Stiffness, 3EI ÷ L³ | Force at 0.125 mm | Weight not seen by the cells
rowhead: Connection
- Flexible fabric sleeve | about 0.5 N/mm | 0.06 N | less than 0.01 kg
- 80 NB pipe, 1,500 mm free length | 171 N/mm | 21.4 N | 2.2 kg
- * 80 NB pipe, 800 mm free length | 1,129 N/mm | 141 N | 14.4 kg
caption: This is an illustration. Cantilever stiffness with E = 200,000 MPa and I = 963,398 mm⁴; the beam stress and deflection tool confirms 0.125 mm of tip deflection for the 1,500 mm case at 21.4 N. A real pipe is partly restrained at both ends and stiffer still. The weight lost is proportional to the batch, so it looks like a span error, but it changes with temperature and with how the pipe's clamps settle, so calibration cannot remove it reliably.
```

The figures show why every connection to a weighing vessel should be a flexible sleeve, bellows or loose-fitting telescopic joint, and why cables and small pipes should be run in loops so that they bend rather than pull. Even a long pipe adds a couple of kilograms, and a short stiff one adds a lot.

## Commissioning in the right order

The order of work during installation decides how many of these problems are found before production starts. The mill's commissioning sequence for BH-2, written after the projects that taught it the lessons in this book, runs as follows.

1. **Structure first.** The stands are installed, grouted and checked level before any cell arrives, and all welding on the hopper and stands is finished. Dummy spacers the height of the weigh modules carry the hopper during this work.
2. **Cells last.** The spacers are replaced by the weigh modules one at a time, with the hopper jacked a few millimetres, so that no cell is shock-loaded or carries welding current.
3. **Connections after the cells.** Sleeves, vents and cables are connected only when the hopper sits on its cells, so that they are fitted at the hopper's working height rather than pulled to it.
4. **A walk-around.** Someone who did not install the system walks round it looking for anything touching the hopper: a cable tray, a handrail, a pipe clip, a forgotten temporary support.
5. **Electrical checks.** Insulation resistance and bridge resistances of each cell (Chapter 10), junction box terminals and the sense connections.
6. **Zero, corner test and calibration** with test weights (Chapter 8).
7. **A dynamic check.** A real batch filled and discharged several times while someone watches the indicator settle, to set the filter and the in-flight correction for material still falling when the feeder stops.

The last step deserves a word. Material in the air between the feeder and the hopper when the feeder stops still lands in the hopper, so batching controllers stop each feeder slightly early and learn the amount in flight from previous batches. That correction is a property of the feeder and the drop height, not the scale, but a scale that settles slowly or bounces makes it erratic, which is another reason for stiff mounting and flexible connections.

## When it goes wrong: the steel spool on the vent

During a shutdown, a fitter replaced BH-2's worn canvas vent sleeve with a short steel spool, because the canvas kept tearing and the spool was in stock. It was bolted rigidly between the hopper's vent flange and the duct to the bag filter, 800 mm above the duct's next support.

From the first batch after the shutdown, batches came out of the mixer heavy. The batching program, believing the indicator, kept adding ingredients until the indicator showed the formulated mass; with the spool carrying about 14 kg past the cells, each batch actually held about 14 kg more than formulated, and the excess varied by several kilograms from batch to batch as the spool's bolts and the duct settled. The quality officer found it when the mixer's batch counts and the ingredient bins' usage stopped agreeing.

The check that confirmed it took ten minutes: with the hopper empty, the fitter loosened the spool's bolts, and the empty reading changed by 3 kg as the spool's preload was released. Test weights then read 0.6% light, which matched the stiffness estimate. A new fabric sleeve of a tougher grade was fitted, the canvas's tearing was traced to the sleeve being stretched by a misaligned duct, and the duct was realigned.

```figure
type: decision
title: Fixing the vent connection
caption: This is an illustration. The mill also added "no rigid connections to BH-2" to its maintenance work instructions.
- Keep the spool and recalibrate | Hides the error on the day; it returns as the spool's clamps settle | Not adopted
- Fit a stainless bellows | Flexible and durable, but costly and stiffer than fabric | Considered
- * Realign the duct and fit a tougher fabric sleeve | Removes the cause of the tearing and the load path | Adopted
```

## Exercise: a denser, off-centre batch

The mill plans a new dense formulation. A 2,500 kg batch of it heaps 200 mm off-centre towards cell 1, and when the first ingredient drops onto the empty cone the momentary load on the batch is assumed to be 1.5 times its static value.

1. What static load does cell 1 carry with the full batch?
2. What is cell 1's momentary load if the 1.5 factor applies to the batch share?
3. Is that acceptable for a 2,000 kg cell whose datasheet gives a safe overload of 150% of rated load?

**Answer.**

1. The batch share on cell 1 is 2,500 ÷ 3 × (1 + 2 × 200 ÷ 1,050) = 1,150.8 kg, plus 383.3 kg of dead load: 1,534.1 kg, 77% of rating.
2. 1.5 × 1,150.8 + 383.3 = 2,109.5 kg, 105% of rating.
3. It exceeds the rated load but is well within the 3,000 kg safe overload, so the cell will not be damaged. The weighing is unaffected, because the indicator reads after the material settles. A softer drop, by a shorter fall or a deflector plate under the inlet, would be worth having anyway, because it reduces wear and noise as well as the peak on the cell.
