---
book: weldability-by-the-numbers
chapterSlug: expansion-restraint-and-cracking
order: 3
title: "Expansion, restraint and cracking"
description: "Estimate the expansion and restrained stress a weld creates in different metals, check a 1915 calculation for cast iron, and use preheat and sequence to keep a brittle part from cracking."
draft: false
---

A weld heats a small part of a metal object to melting while the rest stays relatively cool. The hot part tries to expand, the cool part holds it back, and when the weld cools it tries to shrink and is held back again. The stresses this creates are large, often enough to make the metal yield, and in a metal that cannot yield, such as grey cast iron, they crack it. How large they are depends on two properties, the expansion coefficient and the stiffness, and on one feature of the job, the restraint.

Kautny devoted a careful passage to this in his chapter on cast iron repair, complete with a calculation of how much the metal grows as it is heated to melting. This chapter repeats his calculation with modern data, compares the metals in the case and shows how the workshop applied his methods, preheat and sequence, to the cracked casing foot.

## Free expansion

A bar free to move grows by its length times the expansion coefficient times its temperature rise. A one-metre bar of carbon steel with a coefficient of about 12 × 10⁻⁶ per °C grows by 1.2 mm for every 100 °C. Aluminium, at about 23 × 10⁻⁶ per °C, grows nearly twice as much; TWI describes aluminium's thermal expansion as twice that of steel and notes that its contraction on solidification is typically 5% more than in equivalent steel welds.

Free expansion causes distortion but not stress. The stress comes when expansion is prevented.

## Restrained stress

If a bar is held so it cannot grow at all, the stress produced by heating it is its stiffness, the modulus of elasticity E, times the expansion it has been prevented from making.

```figure
type: formula
title: Stress in a fully restrained bar heated by ΔT
formula: σ = E × α × ΔT
caption: This is an illustration with typical values. A fully restrained steel bar reaches about 240 MPa for every 100 °C, close to the yield strength of common structural steels.
- E | modulus of elasticity, MPa
- α | expansion coefficient, per °C
- ΔT | temperature rise, °C
step: σ = 200,000 × 12 × 10⁻⁶ × 100
step: σ = 200,000 × 0.0012
step: σ = 240 MPa
```

Repeating the calculation with typical values for the other metals gives a sense of how each reacts.

```figure
type: bars
title: Restrained stress for each 100 °C of heating, typical values
unit: MPa
max: 320
caption: This is an illustration using typical moduli (steel 200 GPa, 316 stainless 193 GPa, copper 117 GPa, grey cast iron about 100 GPa, aluminium 69 GPa) and the expansion coefficients in Chapter 1.
- 316 stainless steel | 308.8
- Carbon steel | 240
- Copper | 193.1
- *Aluminium | 158.7
- Grey cast iron | 108
```

The numbers show why welding always involves yielding. A temperature rise of a few hundred degrees in a restrained region would, if the metal stayed elastic, produce stresses far above the yield strength of any of these metals. In practice the hot metal yields, being weaker at temperature, and when it cools it is left shorter than the space it occupies, so it ends up in tension. That residual tension, close to the yield strength in ductile metals, is the origin of distortion and of many cracks.

Stainless steel stands out. Its higher expansion and stiffness, combined with the low conductivity that concentrates the heat, make it the most distortion-prone of the common metals, which is why stainless fabrications are welded with low heat input and careful sequence. Aluminium's stress per degree is lower, because it is less stiff, but its very high conductivity spreads the heat so the restrained region is large.

## Why hot metal gives way

The restrained stress calculation assumes the metal stays elastic, and near a weld it does not. Metals lose strength as they get hotter, so the metal next to the weld, already near melting, yields at a small fraction of its room-temperature strength. It deforms plastically while it is hot and weak, compressing to make room for its own expansion. On cooling it regains strength but is now too short for the space it occupies, and the surrounding cooler metal holds it in tension. The residual stress that remains after a weld cools is therefore set largely by the room-temperature yield strength of the weld region, not by the temperature reached. In a ductile metal that is a nuisance; in a brittle one it is a crack.

## Kautny's cast iron calculation

Kautny gave the expansion of cast iron as about 1.4 mm per metre for every 100 °C, a coefficient of 14 × 10⁻⁶ per °C, and its melting point as 1,050 °C. Heating a metre of cast iron from 0 °C to melting would therefore lengthen it by 1.4 × 10.5 = **14.7 mm**. Because cast iron conducts heat relatively poorly, he argued, the heating is spread over the region around the weld so that only about half of this would act, about **7.35 mm** per metre heated. The cooler, rigidly connected metal around the weld zone would be crushed by roughly 5 mm during welding, and then, as the weld cooled, put in equal tension by the shrinkage.

With modern values the arithmetic changes but the conclusion does not. Taking a coefficient of 10.8 × 10⁻⁶ per °C for grey cast iron and heating from 20 °C to the bottom of its melting range at about 1,127 °C, the free expansion is about 10.8 × 10⁻⁶ × 1,107 × 1,000 ≈ **11.96 mm** per metre, and half of that is about **5.98 mm**. The coefficient actually rises with temperature, so the true figure lies somewhat higher, but either way the movement is several millimetres per metre, in a metal that, as Chapter 5 explains, has almost no ability to stretch.

```figure
type: compare
title: Expansion of cast iron heated to melting, per metre
cols: Kautny, 1915 | Modern values
caption: Kautny's coefficient was high and his melting point low, but both calculations show several millimetres of movement per metre that a brittle metal cannot absorb.
- Expansion coefficient | 14 × 10⁻⁶ /°C | 10.8 × 10⁻⁶ /°C
- Temperature rise | 0 to 1,050 °C | 20 to about 1,127 °C
- Free expansion | 14.7 mm | about 11.96 mm
- *Half, as Kautny reasoned | 7.35 mm | about 5.98 mm
```

## Turning tension into compression

Kautny's remedy follows directly. If the whole casting, or all the metal affected by the expansion, is heated uniformly beforehand, preferably to a dull red, the local surplus of heat from welding causes little additional expansion, because the surroundings have already expanded with it. When everything cools together, the weld is not pulled apart by colder metal around it.

He gave a vivid example: a cracked spoke in a cast iron wheel. The rim, heavier than the spoke, holds residual stresses from casting. Welding the spoke without preparation would crack it again as it cooled. Instead, he heated the rim first so it expanded and opened the crack in the spoke, welded the spoke while the rim was hot, and let the two cool together. As the rim contracted, it pushed the spoke into compression, which cast iron resists far better than tension.

For large castings that could not be heated as a whole, such as the corners of engine bases, he recommended starting the weld in the middle of the fracture and working towards each end, letting the casting cool completely after half the weld before completing the rest. Otherwise, he warned, a new crack could be expected during the second half. The principle is the same in modern terms: control the restraint so that shrinkage is accommodated rather than resisted.

## Restraint is a property of the part

The same weld can crack in one part and not in another because the restraint differs. A crack at the free edge of a plate can open and close as the weld heats and cools; a crack in the middle of a stiff casting, or in a foot joined rigidly to a heavy body, cannot. Restraint is highest where heavy sections surround a light one, as Kautny's rim surrounded the spoke, and where a weld closes a loop, as in a crack around a hole or a patch set into a plate. The READOS book *Weld Repairs That Hold* examines this in steel plate in its chapter on [heat, expansion and shrinkage](/reados/publications/weld-repairs-that-hold/heat-expansion-and-shrinkage/).

For any repair, the questions are which way the weld will try to shrink, what stops it, and whether the metal can yield enough to accommodate the shrinkage. Ductile metals such as mild steel, copper and annealed aluminium can yield; brittle metals such as grey cast iron and hardened steels cannot, and in them the restraint must be reduced by preheating, sequence or design.

## Reducing the stress: peening and short runs

Where a part cannot be preheated as a whole, two other tools reduce the stress a weld leaves behind. The first is to make each weld small. Short runs, or stitches, of modest length heat a small volume at a time, so each one expands and shrinks less, and the surrounding metal can absorb the movement. TWI's guidance for large cast iron castings describes a low-heat-input technique of small stringer beads for exactly this reason. The second is **peening**: hammering each bead while it is still hot. Hammering stretches the bead plastically, offsetting part of the shrinkage it is about to undergo, so it ends up in less tension. TWI recommends peening each bead of a cast iron repair while hot.

Kautny's hammering methods, which Chapter 10 returns to, had the same effect for a different purpose. His welders hammered copper, nickel and aluminium joints while hot to destroy oxide films and consolidate the joint, and in doing so they also worked the metal and relieved some of the stress the heat had caused. Peening needs judgement: too heavy on a brittle metal can crack it, and peening is usually not applied to the root or final layers where it could hide defects or harm the surface. Where it is used, the welding procedure should say so.

## A distortion budget for the aluminium cover

Ductile metals do not crack from expansion as cast iron does, but they distort, and aluminium distorts more than most. This is an illustration. Rebuilding the corroded boss on the 10 mm aluminium cover adds a mass of weld metal on one face of the plate. As it cools and contracts, it pulls that face shorter than the other and bows the plate. Because aluminium's expansion is about 1.9 times steel's and its high diffusivity spreads the heat across a wide area, the bow from the same weld volume is larger than in steel.

The workshop's plan for the cover therefore includes a distortion budget: the flatness the sealing face needs, measured before welding; a rigid clamp to a flat backing plate during welding and cooling; the deposit built up in small, balanced runs rather than one large pool; and allowance for facing the cover after welding if needed. Measuring the flatness before and after, and recording both, turns a vague worry about distortion into a number that can be checked and, if necessary, corrected by machining.

## The casing foot

This is an illustration. The pump casing's mounting foot is 25 mm thick and joined to the much heavier body of the casing by a cast radius. The crack runs 120 mm across the foot from its free edge towards the body. Suppose a region of the foot about 150 mm long were heated locally by welding through about 600 °C while the body stayed cool. Free, it would grow by about 10.8 × 10⁻⁶ × 600 × 150 ≈ 0.97 mm. Held by the body, it would try to develop a stress of the order of 100,000 × 10.8 × 10⁻⁶ × 600 ≈ 650 MPa, far beyond what grey cast iron can carry in tension.

The weld cannot be allowed to do that. The plan therefore follows Kautny: preheat the whole casting uniformly, so that the foot and body expand together; weld from the end nearest the body towards the free edge, so the free edge can move; and cool the whole casting slowly, so that no part contracts against a much colder neighbour. Chapter 5 sets the temperatures and the filler.

## A failure: the local preheat

This is an illustration. On an earlier casting of the same type, the workshop had preheated only the foot, with a heating torch, to the recommended temperature, measured beside the crack. The weld itself was sound. During cooling, a new crack opened in the radius between the foot and the body, outside the area that had been heated.

Dye penetrant testing found the new crack the next day. The explanation was the restraint calculation above, moved a few centimetres. The heated foot had expanded against the cold body, the radius between them had taken the strain, and as the foot cooled and shrank it pulled on a radius already near its limit. Local preheat had protected the weld but transferred the problem to the nearest unheated stiff section. The correction was to heat the whole casting in the workshop's furnace, check the temperature at several points including the body, weld, return the casting to the furnace and cool it slowly with the furnace, exactly as Kautny described for complex castings.

## Exercise: stainless against steel

Using a modulus of 193 GPa and an expansion coefficient of 16.0 × 10⁻⁶ per °C for 316 stainless steel, calculate the restrained stress for a 100 °C rise and compare it with carbon steel. Then calculate how much farther a 500 mm length of stainless steel moves than the same length of carbon steel, at 12 × 10⁻⁶ per °C, when both are heated by 300 °C.

The restrained stress is 193,000 × 16.0 × 10⁻⁶ × 100 ≈ **309 MPa**, about 29% more than carbon steel's 240 MPa. The difference in expansion over 500 mm for a 300 °C rise is (16.0 − 12) × 10⁻⁶ × 300 × 500 ≈ **0.6 mm**. That differential movement matters in Chapter 9, where the stainless spool is welded to a mild steel bracket: when the joint heats and cools, in welding or in service, the two metals try to move by different amounts, and the weld between them carries the difference.
