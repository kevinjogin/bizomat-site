---
book: weldability-by-the-numbers
chapterSlug: carbon-cooling-rate-and-hardness
order: 4
title: "Carbon, cooling rate and hardness in steel"
description: "See how carbon and cooling rate decide whether a steel weld zone stays tough or turns hard and crack-prone, and plan a keyway build-up on a medium-carbon shaft."
draft: false
---

Carbon is the most powerful element in steel. A few tenths of a per cent separate a steel that can be welded almost carelessly from one that cracks unless it is preheated, welded with dry consumables and cooled slowly. The reason lies in what happens to carbon as steel cools from red heat, and in how fast the metal beside a weld cools. Kautny understood the first part well in 1915, and gave the brittle constituent the name his era used, "martinsite". Modern welding metallurgy adds the second part, the cooling rate, and a way of combining the effects of carbon and other elements into a single screening number.

This chapter explains both, checks a 1915 method of estimating carbon from a microscope image, and plans the build-up of a worn keyway on the pump set's medium-carbon steel shaft.

## Iron, carbon and their structures

Kautny classified iron by carbon content: below about 0.5% it was malleable iron or mild steel, from 0.5% to 1.5% it was steel, and above that cast iron or white iron. Modern classifications draw the line between steels and cast irons at about 2% carbon, as TWI does in defining cast irons as iron-based alloys containing more than 2% carbon. The principle is the same: carbon decides the character of the metal.

He explained, correctly, that carbon is dissolved in molten iron like salt in water, and takes different forms when the iron solidifies and cools: iron carbide, graphite or a structure in which it stays dissolved. In steels cooled slowly, the carbon forms **pearlite**, a fine mixture of iron and iron carbide that takes its name from its mother-of-pearl appearance under the microscope. Kautny put pearlite's carbon content at 0.8% to 0.9%; the modern figure for the eutectoid composition is about 0.77%. A slowly cooled steel with less carbon than that is a mixture of soft ferrite and pearlite, and the proportion of pearlite rises with carbon.

## Estimating carbon by counting squares

Kautny described a method attributed to Baumann for estimating carbon from a micrograph. A glass plate ruled into 100 equal squares is laid on a magnified photograph of the polished and etched steel, and the squares filled with pearlite are counted. Because pearlite carries a known carbon content and ferrite almost none, the fraction of pearlite gives the carbon content.

This is an illustration. If 23 of the 100 squares are filled with pearlite, and pearlite holds about 0.77% carbon, the steel contains about 0.23 × 0.77 ≈ **0.18%** carbon. With Kautny's pearlite figure the estimate would be a little higher, about 0.18% to 0.21%. The method applies only to slowly cooled, plain carbon steels, and a spectrometer gives the composition directly today, but the reasoning, that the structure records the carbon, is exactly how metallurgists still read welds.

## Martensite: the structure that cracks

If steel is cooled quickly from red heat, the carbon does not have time to form pearlite. It is trapped in a strained, very hard structure that Kautny called martinsite, now spelled **martensite**. He described the danger accurately: if a mild steel weld cools too fast, the weld can take on the character of hardened steel, hard and brittle. In ordinary mild steel, with little carbon, the martensite that forms is not very hard and the risk is small. As carbon rises, the martensite becomes harder and more brittle, and it forms more readily.

The metal beside a weld, the **heat-affected zone**, is heated above the temperature at which steel transforms and then cooled by the cold surrounding metal, often very quickly. In a higher-carbon steel, that zone can turn largely to martensite. Martensite is hard and resists deformation, it carries the residual tension that Chapter 3 described, and it is highly susceptible to cracking if hydrogen is present.

## Hydrogen cracking

Hydrogen cracking in steel needs three things together: a susceptible hard microstructure, hydrogen in the weld, and tensile stress. It often appears hours after welding, in the heat-affected zone beneath the weld bead, where it cannot be seen until the part is machined or inspected. Hydrogen comes from moisture in consumables and fluxes, from oil, paint and condensation on the joint, and from humid air.

Each of the three can be controlled. A slower cooling rate, achieved by preheat and adequate heat input, reduces the hard microstructure. Low-hydrogen consumables kept dry, and a clean, dry joint, reduce the hydrogen. Preheat and slow cooling also give hydrogen time to diffuse out before the steel cools to the temperature where it cracks. Reducing restraint reduces the stress. The Library chapter on [preheat, hydrogen and cooling](/reados/publications/weld-repairs-that-hold/preheat-hydrogen-and-cooling/) treats this in detail for steel plate repairs.

## Cooling rate

Whether martensite forms depends on how fast the heat-affected zone cools through the temperature range where steel transforms. Three things set that rate.

- **Thickness and joint shape.** Thick sections and joints with several paths for heat to escape, such as a fillet weld in thick plate, cool faster, as Chapter 2 explained.
- **Heat input.** More heat per millimetre of weld means more heat to dissipate and slower cooling. Chapter 2 estimated an example heat input of about 0.83 kJ/mm.
- **Preheat.** A warmer part removes heat from the weld zone more slowly.

A welding procedure for a hardenable steel controls all three: it sets minimum preheat, a range of heat input and often a maximum interpass temperature, and the welder must stay within them.

```figure
type: steps
title: How a hardenable steel's weld zone comes to crack
caption: Each step is a point of control: composition, cooling, hydrogen and stress.
- Heat | heat-affected zone heated above its transformation temperature
- Cool fast | cold surroundings and thick section quench the zone
- Harden | carbon trapped as martensite
- Absorb hydrogen | from consumables, moisture or contamination
- *Stress | residual tension from shrinkage
- Crack | often delayed, beneath the bead
```

## Carbon equivalent

Other elements also increase hardenability, though less strongly than carbon. A **carbon equivalent** combines them into a single number for screening. The formula widely used for carbon-manganese steels, the IIW formula, adds manganese divided by 6, the sum of chromium, molybdenum and vanadium divided by 5, and the sum of nickel and copper divided by 15, to the carbon content. Steels with a low carbon equivalent are generally easy to weld; as it rises, preheat and hydrogen control become increasingly necessary. Welding standards and consumable makers use carbon equivalent, with thickness and hydrogen level, to set preheat.

## Small welds cool fastest

The cooling-rate rule has a consequence that catches many welders out: the smallest welds are the most dangerous on a hardenable steel. A tack weld, a short repair run or a stray arc strike puts a small amount of heat into a large, cold mass, and the heat-affected zone beneath it cools very quickly, often fast enough to form martensite even in steels that weld safely with full-size runs. An arc strike outside the joint leaves a small, hard spot with a crater that can start a fatigue crack. Procedures for hardenable steels therefore apply preheat to tacks as well as main welds, and forbid striking arcs on the parent metal outside the joint.

## Fillers, then and now

Kautny's filler choices show how the problem was handled in 1915. For mild steel and wrought iron, he recommended a soft, low-carbon iron filler, citing Swedish soft iron, which melted, he said, between 1,500 and 1,600 °C. For cast steel, with a carbon content between mild steel and cast iron, he suggested filler cast from the same steel, or soft iron alongside it. For hard steel he advised fillers high in manganese, and for spring steel, whose elasticity comes from hardening, he noted that the weld zone must be hardened again in the usual way if it is to match the rest.

Modern practice keeps the logic and adds control of hydrogen. Fillers for hardenable steels are low-hydrogen types kept dry according to the maker's instructions. Where the parent steel's hardenability makes cracking likely, some repairs use fillers that deposit a different, more forgiving metal: austenitic stainless or nickel-based fillers, which tolerate hydrogen and remain ductile, are sometimes chosen for repairs on hard-to-weld steels. That choice brings the dilution questions of Chapter 9 and must be made within a qualified procedure, not by habit.

## Heat after welding

Heat applied after welding can reduce the risks further. Keeping the joint at or above the preheat temperature for a period after welding, sometimes called post-heating, lets hydrogen diffuse out before the steel cools enough to crack. Post-weld heat treatment at a higher temperature tempers martensite, making it tougher, and relieves residual stress. Some procedures use the heat of later weld runs to temper the heat-affected zone of earlier ones, a technique that must be carefully qualified because its benefit depends on precise placement of each run. All of these are procedure decisions, set and qualified for the steel, thickness and service, and recorded.

## The shaft keyway

This is an illustration. The pump shaft is 60 mm in diameter, made from a medium-carbon steel whose spectrometer reading gave about 0.45% carbon and 0.75% manganese, with negligible chromium, molybdenum, vanadium, nickel and copper. The keyway is worn on one side and the original plan was to build it up by welding and re-machine it.

The carbon equivalent from the two significant terms is about 0.45 + 0.75 ÷ 6 ≈ **0.575**. That puts the shaft firmly among steels whose heat-affected zone will harden strongly on fast cooling and is highly susceptible to hydrogen cracking. The shaft is also a rotating part, loaded in bending and torsion at a keyway, a stress concentration, where a crack beneath a weld would grow by fatigue.

```figure
type: gauge
title: Carbon equivalent of the pump shaft
min: 0
max: 0.8
value: 0.575
unit: CE
label: = 0.45 + 0.75 ÷ 6
caption: This is an illustration. The bands are illustrative screening ranges, not values from a standard; the preheat and procedure must come from a qualified welding procedure for the actual steel and thickness.
- 0 | 0.4 | Usually straightforward
- 0.4 | 0.5 | Care and preheat likely
- 0.5 | 0.8 | High risk; full controls or avoid
```

The workshop considered four options.

1. **Weld build-up** with a qualified procedure: a set preheat applied through the whole cross-section around the keyway, low-hydrogen consumables kept dry, controlled heat input and interpass temperature, symmetrical deposition to limit bowing, slow cooling, and crack inspection after machining.
2. **A new keyway** cut at 90° or 180° to the worn one, if the hub and design allow, with the old one left unfilled.
3. **A sleeve or insert** fitted to the shaft and machined with a new keyway.
4. **A replacement shaft.**

Setting the options side by side made the choice clearer than arguing about whether the shaft could be welded.

```figure
type: compare
title: Options for the worn keyway
cols: Main risk | What it needs
caption: This is an illustration. Each option is technically possible; the choice turns on consequence, time and cost.
- Weld build-up | hidden HAZ crack at a fatigue-loaded keyway | qualified procedure, preheat, dry consumables, crack inspection
- New keyway at 180° | hub and design must allow it | machining only; check the shaft section remains adequate
- Sleeve or insert | fit and transmission of torque | design check and accurate machining
- *Replacement shaft | lead time and cost | supply of a correct shaft
```

Because the shaft's fatigue loading made a hidden weld crack serious and a replacement was available within the job's timeframe, the workshop chose a replacement shaft and kept the old one as a spare after cutting a new keyway at 180°. The decision was not that the shaft could not be welded, but that the cost of doing it safely, and the consequence of a crack, outweighed the alternatives. The carbon equivalent, the options considered and the reason for the choice were all written into the repair record, so that anyone later asking why the shaft was replaced rather than repaired could see the answer.

## A failure: the keyway that looked sound

This is an illustration. Two years earlier, the workshop had built up a worn keyway on a similar shaft with general-purpose electrodes, without preheat, on a cold winter morning. The weld machined cleanly. During final inspection before refitting, magnetic particle testing of the machined keyway showed a fine line along the edge of the weld deposit, parallel to it, in the heat-affected zone.

The crack was classic hydrogen cracking: hard heat-affected zone from rapid cooling in a cold, thick shaft, hydrogen from electrodes that had not been dried, and the shrinkage stress of the build-up. Machining had exposed it; without the inspection the shaft would have gone back into service with a crack at its most highly stressed point. The shaft was scrapped. The workshop's rule since then is that no shaft or other hardenable part is welded without a confirmed composition, a carbon equivalent and a written procedure, and that any such weld is crack-inspected after machining.

## Exercise: two steels and a micrograph

A replacement bracket steel has 0.20% carbon and 0.90% manganese, with other elements negligible. Calculate its two-term carbon equivalent and compare it with the shaft. Then, if a slowly cooled sample of the bracket steel shows about 26 of 100 squares filled with pearlite, estimate its carbon content using 0.77% for pearlite, and say whether the estimate agrees with the stated composition.

The carbon equivalent is 0.20 + 0.90 ÷ 6 = **0.35**, well below the shaft's 0.575; the bracket steel is in the range generally regarded as straightforward to weld, although thick sections, high restraint or high hydrogen can still require preheat. The pearlite count gives about 0.26 × 0.77 ≈ **0.20%** carbon, which agrees with the stated 0.20%. The agreement is a useful check that the bracket is the steel its certificate says it is, which Chapter 1 showed matters before any repair is planned.
