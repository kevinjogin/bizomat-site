---
book: hardfacing-and-surfacing-by-the-numbers
chapterSlug: preheat-buffers-and-cracking
order: 8
title: "Preheat, buffer layers and cracking"
description: "Tell harmless check cracks from cracks in the base and fusion line, choose preheat from the base's carbon equivalent, use buffer layers between incompatible metals, and estimate a preheat's heat."
draft: false
---

Hardfacing puts a hard, often brittle deposit on a base that may itself be hardenable, and the combination invites cracking. Some cracks are harmless, the check cracks of Chapter 6 that relieve stress within a carbide deposit. Others are serious: cracks in the base metal under the deposit, which can grow by fatigue and break the part, and cracks along the fusion line, which let the deposit spall away. Preventing the serious ones depends on the base metal, the preheat, the buffer layer, the deposit and the way the part cools.

This chapter sorts the kinds of cracks, shows how the base metal's carbon equivalent guides preheat, explains buffer layers, estimates the heat needed to preheat a bucket edge, and sets out the workshop's rules for avoiding the serious cracks.

## Three places cracks form

Cracks in hardfaced parts form in three places, with different causes and consequences:

```figure
type: compare
title: Where cracks form in hardfaced parts
cols: Cause | Consequence | Prevention
caption: General guidance. The filler maker's data and the base metal's weldability decide the preheat, buffer and procedure for each combination.
- Check cracks in the deposit | brittle deposit relieving shrinkage | usually harmless in abrasion | accept, or use crack-free alloy
- *Cracks in the base | hard heat-affected zone, hydrogen, stress | can grow by fatigue and break the part | preheat, low hydrogen, buffer layer, slow cooling
- Cracks along the fusion line | incompatible deposit and base, high stress, poor bond | deposit spalls | compatible build-up or buffer, preheat, fewer layers
```

The first is expected in many carbide deposits and needs no repair. The second and third are defects, and preventing them is the main purpose of preheat and buffer layers.

## Cracks in the base

The heat of hardfacing affects the base metal beneath the deposit just as a weld affects the metal beside it. If the base is a hardenable steel, a medium-carbon steel, a heat-treated wear plate or a boron steel tillage point, its heat-affected zone can form hard, brittle martensite as it cools, and with hydrogen from the welding consumable or moisture and a high stress from the deposit's shrinkage, it can crack hours after welding. These hydrogen cracks often lie hidden under the deposit, where they cannot be seen, and they may grow under service loads until the part breaks. Weldability by the Numbers explains the mechanism in its chapter on [carbon, cooling rate and hardness](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/).

## The carbon equivalent and preheat

The carbon equivalent, a single number combining the effects of carbon and the alloying elements on hardenability, gives a first guide to whether a base needs preheat. One widely published form is CE = C + Mn ÷ 6 + (Cr + Mo + V) ÷ 5 + (Ni + Cu) ÷ 15.

This is an illustration. The quarry's bucket edges are a quenched and tempered wear-resistant steel with, nominally, about 0.18% carbon, 1.4% manganese, 0.3% chromium and 0.2% molybdenum, giving a CE of about 0.18 + 0.23 + 0.10 ≈ **0.51**. A boron steel tillage point with about 0.3% carbon and 1.2% manganese has a CE of about 0.3 + 0.2 = **0.50**. Both are high enough that their heat-affected zones would harden and could crack if hardfaced cold, so both are candidates for preheat. The steel maker's welding guidance for the wear plate, and the filler maker's data, set the actual preheat, and for quenched and tempered wear plate, they also set a maximum, because overheating softens the plate and loses the wear resistance it was bought for.

## How much heat a preheat needs

Preheating a large part takes a surprising amount of heat, which is why preheat is often skimped.

```figure
type: formula
title: Heat to preheat a loader bucket edge
formula: Q = m × c × ΔT
caption: This is an illustration for a 2.4 m edge, 250 mm wide and 30 mm thick, heated by 130 °C. Heat losses to the air and the rest of the bucket add considerably to the theoretical figure.
- Mass | 2.4 × 0.25 × 0.03 m × 7,850 kg/m³ ≈ 141 kg
- Specific heat of steel | about 480 J/(kg·°C)
- ΔT | 130 °C
step: Q ≈ 141 × 480 × 130 ≈ 8.8 MJ, before losses
step: with about 15 kW of heat reaching the steel, about 10 minutes at best
step: with losses to the bucket and the air, often much longer
```

A small torch played over the edge for a minute or two warms the surface but not the section, and the preheat is gone almost as soon as welding starts. The workshop uses large heating torches or induction blankets, measures the temperature on the far side of the section from the heat source with temperature-indicating crayons, and maintains the preheat throughout welding. On large parts such as bucket edges, it preheats a section ahead of the welding rather than the whole part at once, keeping the zone being welded at temperature while the rest is heated progressively, which saves gas and time and keeps the preheat where it is needed.

## Buffer layers

A buffer layer is a deposit laid between the base and the hardfacing to separate them. It does several jobs. It isolates a crack-sensitive base from the hard, brittle hardfacing, so that check cracks in the hardfacing stop in the tough buffer instead of running into the base. It provides a compatible surface for a hardfacing that would be diluted badly or form a brittle zone on the base itself. And it absorbs some of the hardfacing's shrinkage stress. Common buffer deposits are austenitic stainless steels of types that tolerate dilution, tough low-alloy steels and, on manganese steel, manganese deposits.

```figure
type: steps
title: Layers on a crack-sensitive base, from the base outwards
caption: This is an illustration of a typical arrangement. The filler maker's data say which buffer suits each hardfacing and base.
- Base metal | cleaned, crack-free, preheated as required
- Build-up, if needed | tough alloy to restore shape
- *Buffer layer | one layer of a tough, dilution-tolerant deposit, such as a suitable stainless steel
- Hardfacing | the permitted number of layers of the wear-resistant alloy
- Finish | slow cooling; inspection of the base beside the deposit
```

## Stainless buffers on hardenable steel

Austenitic stainless steel buffer layers are widely used on hardenable steels because their weld metal stays tough and ductile even when diluted with the base, and because austenite dissolves much more hydrogen than ferrite, reducing the hydrogen that reaches the base's heat-affected zone. Some stainless filler types tolerate dilution with carbon steel better than others, and the filler makers state which suit buffering and dissimilar work. The buffer is laid with low dilution, so that its composition is not swamped by the base.

## Cooling

How the part cools after hardfacing matters as much as the preheat. Slow cooling, by wrapping the part in an insulating blanket or burying it in dry insulating material, lets hydrogen escape and reduces the hardness and stress in the heat-affected zone. Rapid cooling, by quenching or leaving a hot part in a draught, does the opposite, and on hardenable bases is a common cause of cracking. The exception is manganese steel, which is kept cool deliberately (Chapter 5), and where the cooling is part of a different strategy.

## Hydrogen control

Hydrogen in the weld comes from moisture in electrode coatings and fluxes, from damp wires, from rust and oil on the part, and from humid air. Low-hydrogen hardfacing consumables, stored and dried as their makers specify, and clean, dry parts limit it. Hardfacing electrodes and fluxes that have absorbed moisture, by being left out of their containers or ovens, can put enough hydrogen into a hardenable base to crack it even with preheat. The workshop stores its hardfacing consumables as their makers require and records the drying of electrodes and fluxes.

## Stress from layers

Each layer of a hard deposit adds shrinkage stress, and the stress at the fusion line rises with the total thickness. That is one reason for the layer limits of Chapters 2 and 6, and why thick hardfacing on a stiff base is more likely to spall than thin hardfacing. Preheat reduces the stress by reducing the temperature difference during welding; buffer layers absorb some of it; peening, where the alloy allows, stretches the deposit and counters it.

## Cast iron bases

Some wearing parts are cast iron, such as older pump casings, grinding plates and some agricultural parts, and hardfacing them brings the cracking problems of cast iron welding. High-carbon cast iron dilutes into the deposit, raising its carbon and brittleness, and the iron's own heat-affected zone forms hard, brittle structures. The usual approach is a nickel-based buffer layer, which tolerates carbon dilution and stays ductile, laid with low heat input and short beads, followed by a hardfacing alloy compatible with the buffer. Machine Part Repairs by the Numbers deals with cast iron repair in its chapter on [cast housings](/reados/publications/machine-part-repairs-by-the-numbers/cast-housings/); for hardfacing, the buffer is the key.

## Interpass temperature

Preheat sets the temperature at the start; the interpass temperature is the temperature of the part when each later pass is laid. For hardenable bases, the procedure usually sets a minimum interpass temperature, equal to the preheat, so that the part does not cool too far between passes, and sometimes a maximum, so that it does not overheat. For quenched and tempered wear plate and for manganese steel, the maximum matters most, because overheating spoils the base. The workshop checks the interpass temperature with crayons as part of the procedure, not only the preheat at the start.

## Post-weld heat treatment

For some hardfaced parts, a post-weld heat treatment after hardfacing relieves stresses and tempers the heat-affected zone, reducing the risk of cracking in service. It is used on large, critical parts such as mill rolls and some forging dies, and must be compatible with the hardfacing alloy, whose hardness can change with heating, and with the base, whose heat treatment it may alter. The filler maker's and the part maker's data say whether and how to heat treat. For most of the workshop's parts, careful preheat, buffer and slow cooling are enough.

## Recording the conditions

When a hardfaced part cracks, the first question is what conditions it was made under. The workshop's job record notes the base metal and its identification, the preheat and interpass temperatures measured, the consumables and their drying, the buffer and number of layers, the cooling method and the inspection result. With that record, a cracked part can be traced to its cause, and the procedure changed if needed; without it, the investigation is guesswork.

## The running case: tillage points and edges

This is an illustration. The workshop's hardfacing of boron steel tillage points had, on a few points, shown fine cracks running from the deposit into the point's body, found when a farmer's points broke near the deposit. The points had been hardfaced cold, with a chromium carbide electrode directly on the hardened steel. The revised procedure added a modest preheat within the point maker's guidance, a thin buffer of a dilution-tolerant stainless electrode, then the two carbide layers, and slow cooling in a box of dry insulating material. No points broke in the whole of the next season.

For the bucket edges, hardfaced before fitting, the procedure set a preheat within the wear plate maker's range, a low-hydrogen carbide wire, a narrow pattern rather than full coverage (Chapter 9), and slow cooling under a blanket, keeping the edge's heat-affected zone from either cracking or softening excessively.

## Checking for base cracks

Because base cracks can hide under the deposit, the workshop inspects the base metal beside each deposit with dye penetrant or magnetic particle inspection after the part has cooled, on a sample of parts for routine work and on every part where a base crack would be dangerous. A crack found at the edge of a deposit is ground out and investigated, and the procedure reviewed, because one crack usually means the conditions for others.

## Delayed cracking and when to inspect

Hydrogen cracks in hardenable bases can appear hours or even a day or two after welding, as hydrogen diffuses to regions of high stress and hardness. An inspection made immediately after welding may find nothing, and a crack may then form overnight. For parts where a base crack would be dangerous, the workshop waits a set period after the part has cooled before the final inspection, as many welding standards require for hardenable steels, so that any delayed crack has had time to appear before the part leaves.

## A failure: the cracked loader tooth adaptor

This is an illustration. A contractor had hardfaced a loader's tooth adaptors, the heat-treated castings that hold the replaceable teeth, with a chromium carbide wire, laid directly and without preheat, to protect them from wear. Within weeks, one adaptor broke across its nose, taking the tooth with it.

The fracture began at a crack in the adaptor's heat-treated base beneath the deposit, where the cold hardfacing had hardened and cracked the heat-affected zone. The adaptor's maker specified that hardfacing could be applied only in certain areas, with a stated preheat and a buffer layer, or not at all on some parts of the nose. The replacement adaptors were hardfaced to the maker's instructions, in the permitted areas only.

## Exercise: preheat time

A 25 kg wear plate is to be preheated by 120 °C before hardfacing, using a torch that delivers about 8 kW of heat to the plate. Taking a specific heat of 480 J/(kg·°C), estimate the minimum heating time. If half the heat is lost to the surroundings, what is the time?

The heat needed is about 25 × 480 × 120 = **1.44 MJ**. At 8 kW, the minimum time is about 1,440,000 ÷ 8,000 = **180 seconds**, three minutes. If half the heat is lost, only about 4 kW reaches the plate, and the time doubles to about **6 minutes**.

In practice, the heat loss rises as the plate gets hotter, so the real time is often longer still, and the temperature must be checked through the section, not just on the heated surface, before hardfacing starts.
