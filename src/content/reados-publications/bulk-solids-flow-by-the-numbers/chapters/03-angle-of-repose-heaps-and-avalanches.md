---
book: bulk-solids-flow-by-the-numbers
chapterSlug: angle-of-repose-heaps-and-avalanches
order: 3
title: "Angle of repose, heaps and avalanches"
description: "What the angle of repose measures, why heaps grow and fail in avalanches of every size, how the heap in a silo costs capacity and fools level sensors, and why repose is not a hopper angle."
draft: false
---

Pour pellets onto a floor and they build a cone. Keep pouring and the cone grows taller and wider, but its sides stay at the same slope, the angle of repose. It is the most visible property of a bulk solid and the easiest to measure, and it appears on most data sheets. It is also the property most often used for things it cannot do.

This chapter explains what the angle of repose is, why a heap grows by fits and starts rather than smoothly, and what the heap at the top of a silo does to its capacity and its level readings. It ends with the mistake that gave Plant C its troublesome filler bin: choosing a hopper angle from the angle of repose.

## What the angle of repose measures

The angle of repose is the slope of the free surface of a heap of loose material, measured from the horizontal. A particle on that surface is held by friction against the particles beneath it and by its interlock with them. At the angle of repose, the surface layer is just stable: steeper, and it slides.

There are several ways to measure it, and they do not give the same answer.

- **Poured heap.** Material falls from a funnel at a fixed height onto a flat base, and the slope of the cone is measured. This is the most common method.
- **Draining crater.** Material drains from a flat-bottomed box through a hole, and the slope of the crater left behind is measured. It is usually a few degrees steeper than the poured heap.
- **Tilting box.** A box of material with a level surface is tilted until the surface slides. The angle at which sliding starts is higher than the angle at which the surface comes to rest afterwards.

For S1's polypropylene pellets the plant's poured-heap test gave **33°**, repeatable to about a degree. This is an illustration. For B2's filler the test gave nothing useful. The powder fell in lumps, built a rough, lumpy heap with slopes between about 45° and 60°, and in places stood vertically. A cohesive powder has no single angle of repose, because its particles stick together and the heap's shape depends on how it was poured.

```figure
type: compare
title: Angle of repose as measured on Plant C's two materials
rowhead: Method
cols: S1 pellets | B2 filler
caption: This is an illustration. For a free-flowing material the methods agree within a few degrees. For a cohesive powder the angle depends on the method, the drop height and the material's history, and is not a property in any useful sense.
- Poured heap from a funnel | 33° | 45° to 60°, lumpy
- Draining crater | 35° | crater walls stood vertical
- Tilting box, start of slide | 36° | slid as a block above 70°
- Tilting box, at rest after slide | 32° | irregular
```

## Heaps grow by avalanches

Watch a heap being fed slowly from above and it does not grow smoothly. Material accumulates on the upper slope, which steepens a little beyond the angle of repose to the **angle of maximum stability**. Then a slip starts somewhere on the surface and runs down the slope, carrying material from the top to the toe and leaving the slope at or slightly below the angle of repose. The cycle repeats. For dry pellets and sand the two angles differ by only a few degrees.

The slips come in every size. Most move a few particles; occasionally one runs the whole height of the slope. In 1987 Bak, Tang and Wiesenfeld used an idealised sandpile on a grid as their first example of what they called self-organised criticality: a system that drives itself, without any tuning, to a state where disturbances of all sizes occur, with small ones common and large ones rare. Kadanoff's lectures, listed in the references, reprint that work alongside experiments on real granular heaps. Real heaps of sand turn out to be only partly like the model: large heaps tend to fail in bigger, more regular slides than the ideal sandpile, because a moving layer of real grains picks up speed and keeps going. Both views agree on the practical point. A heap does not hold a fixed slope; it fluctuates around one, and at any moment a slide of unpredictable size can start.

That matters wherever a heap is the boundary of something. A slope a person stands next to, the face of a stockpile being cut by a loader, and the surface of the material in a bin that someone is looking into are all slopes that can let go. Chapter 11 returns to this.

```figure
type: cycle
title: How a fed heap grows
caption: The slope oscillates between the angle of maximum stability and the angle of repose. The size of each slide is unpredictable; the average slope is not.
- Material lands near the top | the upper slope steepens
- Slope passes the angle of repose | the surface is loaded but holding
- Slope reaches maximum stability | a few degrees steeper
- A slide starts | anywhere on the surface, of any size
- Material runs to the toe | the heap widens
- Slope relaxes | back to or below the angle of repose
```

## The heap in silo S1

Pellets blown into S1 through its central roof inlet fall onto a central heap, so the top surface of a full or filling silo is a cone at about the angle of repose. The [stockpile weight tool](/tools/stockpile-weight/) calculates the height, volume and weight of a natural pile on a circular or rectangular base from the base size, the angle of repose and the bulk density. Entered with S1's diameter of 3.2 m, 33° and 545 kg/m³, it gives a heap **1.039 m** high containing **2.786 m³**, or 1.52 t.

The heap costs capacity. If filling stops when the apex of the heap reaches the top of the cylinder, the top 1.039 m of the cylinder holds only the heap, not a full cylinder of material. The space lost is the cylinder volume over that height minus the heap volume, two-thirds of π R² h:

lost volume = ⅔ × π × 1.6² × 1.039 = **5.57 m³**, or 3.04 t of pellets.

That is why silo capacities are quoted at a fill level below 100%, and why S1's working capacity in Chapter 2 used 90%. The heap's volume is equivalent to a flat layer one-third of its height, 0.346 m, which is a handy way to convert between the apex level and the average level.

If the pellets arrived wetter or with more fines and dust, their angle of repose would be higher and the heap taller. At 36° the tool gives a heap 1.162 m high and 3.116 m³, and the lost capacity rises to about 6.2 m³.

### Heaps sort particles

The slides that build a heap also sort it. As a layer runs down the slope, small particles fall through the gaps between larger ones and stop near where they landed, while large particles roll over the surface and travel to the toe. A heap built from a mixture of sizes therefore ends up with fines concentrated under the pouring point and coarse particles around its edge. In S1, that puts the dust and fines that arrive with each tanker load in a column down the middle of the silo and the cleanest pellets against the wall. Whether they come out mixed again depends on the flow pattern, which is why Chapter 10, on segregation, builds on Chapter 6. For now it is enough to note that the heap is not only a shape; it is a sorting machine.

## Heaps and level sensors

Most silos measure their level with a radar or ultrasonic sensor on the roof, looking down. The sensor measures the distance to the surface directly below it, which is not the average level unless the surface is flat.

S1's radar is mounted 0.8 m from the silo axis, halfway to the wall, because the inlet occupies the centre of the roof. When the silo is being filled and the surface is a heap at 33°, the surface below the sensor is 0.8 × tan 33° = **0.52 m** below the apex. When the silo is discharging, the surface is the reverse: a crater, deepest in the middle if the silo is in funnel flow, so the sensor reads a level above the centre. The same quantity of pellets can give level readings that differ by about a metre depending on whether the silo was last filled or last emptied.

The plant's control system now converts the radar reading to an average level using a heap or crater correction according to whether the last movement was a fill or a discharge, and the tanker acceptance check uses the more cautious of the two. Load cells, as on B2, avoid the problem altogether.

## The regrind bay

Plant C also keeps reground off-specification product, flakes and granules from purgings and rejected batches, in a concrete bay outside before it is fed back at a few per cent. The bay is 4 m wide and the pile runs 8 m long, piled from a loader bucket to its natural slope. With a measured angle of repose of 34° and a bulk density of 480 kg/m³, the stockpile weight tool, in its rectangular mode for a ridged pile with sloping ends, gives a pile **1.349 m** high holding **17.99 m³**, or 8.63 t, with an average pressure on the slab of 2.65 kPa. This is an illustration.

The calculation is useful for stock records and for checking that the bay's walls, if the pile is pushed against them, are not being asked to retain more height than they were built for. It is also a reminder that a loader working the face of a pile is cutting into a slope at its angle of repose, with every slide that implies.

```figure
type: stats
title: Heaps at Plant C, from the stockpile weight tool
caption: This is an illustration. Each pile sits at its angle of repose on the stated base; the bulk densities are the plant's measured poured values.
- 1.039 m | height of the 33° heap in S1's 3.2 m cylinder
- 5.57 m³ | capacity lost if filling stops when the heap's apex reaches the top
- 0.52 m | drop of the heap surface below the off-centre radar
- 8.63 t | regrind in the 4 m by 8 m bay at 34°
```

## The error: a hopper angle chosen from the angle of repose

This is an illustration. B2 was bought with a used compounding line from another plant. Its 60° cone had been chosen by the original builder with a simple rule: make the hopper wall steeper than the material's angle of repose, with a margin. The filler data sheet gave an angle of repose of "about 45°", so a 60° cone, 15° steeper, looked generous.

The rule is wrong, and B2 shows why. The angle of repose describes the free surface of loose, unconsolidated material, held by friction between particles at almost no stress. Whether material slides on a hopper wall depends on friction between the material and the wall, which Chapter 4 measures. Whether the material in a hopper flows at all, rather than standing in a stable arch or rathole, depends on its strength after it has been squeezed by the material above, which Chapters 6 and 7 deal with. Neither is related to the angle of repose in any reliable way.

When the plant's engineer had the filler shear-tested, the report gave a wall friction angle of 26° on B2's stainless steel and a maximum cone half-angle for mass flow of 12° from vertical, a wall angle of 78° from horizontal. B2's 60° cone is 18° flatter than that. In a cone that flat, the filler cannot slide on the walls, so it flows only down a channel above the outlet and leaves the rest standing, the funnel flow of Chapter 6. Being steeper than the angle of repose guaranteed nothing.

```figure
type: compare
title: B2's cone against three different angles
rowhead: Angle, from horizontal
cols: Value | What it governs
caption: This is an illustration. A wall steeper than the angle of repose can still be far too flat for the material to slide on it under pressure. The shear test, not the heap, sets the hopper angle.
- Data sheet angle of repose | about 45° | the slope of a loose heap's free surface
- * B2's existing cone | 60° | chosen as repose plus 15°
- Wall needed for mass flow, from the shear test | 78° | sliding of consolidated powder on the wall
```

For free-flowing pellets the error is often hidden, because almost any reasonable cone discharges them, even in funnel flow. For a cohesive powder it is the commonest single cause of a bin that does not work.

## Where the angle of repose is useful

None of this makes the angle of repose useless. It is the right property for the shape of a free surface: stockpile volumes, the heap in a silo, the level correction above, the surcharge on a conveyor belt, and the spread of material at a chute discharge. It is a good quick comparison between batches of the same free-flowing material: if a delivery of pellets suddenly shows 38° instead of 33°, something has changed, often fines, dust or moisture. And it is a first warning: a material that will not form a clean heap at all is cohesive and needs testing.

## How this applies to a small Australian business

If a supplier, fabricator or old drawing gives a hopper angle that was chosen as "steeper than the angle of repose", treat it as unchecked. For a free-flowing granular material it will probably work, perhaps in funnel flow. For a fine or sticky powder, test the material for wall friction and flowability before building or modifying the hopper. And if a level sensor is mounted off-centre, work out how far the heap or crater moves its reading before trusting it for stock or deliveries.

## Exercise: the radar reading during discharge

S1 has been discharging in funnel flow and the surface has settled into a crater with its lowest point on the axis and its sides at 35°, rising to the wall. The radar, 0.8 m from the axis, reads the surface 4.20 m below the top of the cylinder. How far below the top of the cylinder is the lowest point of the crater, and where is the surface at the wall?

**Worked answer.** Moving from the sensor towards the axis the surface falls by 0.8 × tan 35° = 0.560 m, so the lowest point is 4.20 + 0.56 = **4.76 m** below the top. Moving from the sensor to the wall, 1.6 − 0.8 = 0.8 m further out, the surface rises by the same 0.560 m, so it meets the wall **3.64 m** below the top. The radar reads the average of those two, which for a cone is not the average level; the volume of the crater must be worked out from its geometry.
