---
book: metal-casting-by-the-numbers
chapterSlug: defects-gas-oxides-and-grain
order: 8
title: "Defects: gas, oxides and grain"
description: "Recognising and preventing the defects feeding cannot cure: hydrogen gas porosity and the reduced-pressure test, oxide films, telling gas from shrinkage, and measuring grain refinement."
draft: false
---

Chapters 5 to 7 dealt with the defects that come from filling and feeding: oxide folded in by fast metal, and shrinkage cavities where a section was not fed. A casting can be perfectly gated and perfectly risered and still be porous, because the metal itself carried the defect in. Aluminium dissolves hydrogen when it is molten and rejects it when it freezes; the rejected hydrogen forms bubbles. Aluminium also carries oxide, and its grains can grow coarse if nothing in the melt helps them start. Each of these is a property of the melt, and each is controlled at the furnace.

This chapter explains hydrogen porosity and how a foundry measures a melt's gas content before pouring, shows how to tell gas porosity from shrinkage porosity, covers oxide and inclusions, measures grain refinement with a WORKOS tool, and works through a porosity problem that was cured with the wrong remedy before the right one was found.

## Hydrogen in aluminium

Molten aluminium reacts with water vapour, from the air, from damp charge materials, from flux, from tools and from the products of combustion in gas-fired furnaces, to form aluminium oxide and hydrogen. Some of the hydrogen dissolves in the melt. The solubility of hydrogen in liquid aluminium is many times its solubility in the solid, and it rises with temperature. When the metal freezes, almost all of the dissolved hydrogen must come out. If there is enough of it, it forms bubbles in the last liquid to freeze, between the dendrites, leaving rounded pores in the casting.

```figure
type: steps
title: How hydrogen ends up as porosity
caption: Every step except the last can be controlled at the furnace. Hotter metal, longer holding, damp charge and humid air all add hydrogen.
- Water vapour meets molten aluminium | from air, charge, tools, flux or burner gases
- Hydrogen dissolves in the melt | more at higher temperature
- Metal is poured and starts to freeze | solubility drops sharply at freezing
- Hydrogen is rejected into the remaining liquid | its concentration there rises
- * Bubbles form between dendrites | rounded gas pores, often small and scattered
```

The amount of porosity depends on how much hydrogen is present and on how easily bubbles can form. Oxide films and inclusions give bubbles a ready surface to grow on, which is one reason a clean melt and a gas-free melt usually go together. Poor feeding helps too: where the mushy zone is starved of liquid, the pressure in the remaining liquid falls, and hydrogen comes out of solution more readily. Gas porosity and shrinkage porosity therefore often appear together, each making the other worse.

The cure is to remove hydrogen before pouring, by degassing, and to stop it coming back. GB-12's foundry degasses every melt with a rotary degasser: a graphite rotor on a hollow shaft, lowered into the melt, which disperses fine bubbles of dry argon through it. Hydrogen diffuses from the metal into the argon bubbles and is carried out of the surface. The fine bubbles also catch oxide particles and float them to the dross.

### Measuring the gas: the reduced-pressure test

A foundry cannot see dissolved hydrogen, but it can make it visible. In the reduced-pressure test, two small samples of the melt are allowed to freeze side by side, one in air and one in a chamber under partial vacuum. Under reduced pressure, hydrogen bubbles grow much larger and the sample is visibly porous. Each sample's density is measured by weighing in air and in water, and the difference is expressed as a density index.

```figure
type: formula
title: Density index from the reduced-pressure test
formula: Density index = (ρ_air − ρ_vacuum) ÷ ρ_air × 100%
caption: ρ_air is the density of the sample frozen at atmospheric pressure, ρ_vacuum the density of the sample frozen under reduced pressure. A higher index means more gas. The vacuum level and sample size must be kept the same for results to be comparable.
- ρ_air | density of the atmospheric sample, g/cm³
- ρ_vacuum | density of the reduced-pressure sample, g/cm³
```

This is an illustration. GB-12's foundry takes a reduced-pressure test after degassing on every melt. Its working limit for GB-12, set from trial castings that passed the customer's pressure test, is a density index of 2%.

```figure
type: compare
title: Reduced-pressure tests on GB-12 melts
cols: Atmospheric sample, g/cm³ | Reduced-pressure sample, g/cm³ | Density index | Against 2% limit
rowhead: Melt condition
- Before degassing | 2.62 | 2.48 | 5.3% | fails
- * After rotary degassing | 2.65 | 2.61 | 1.5% | passes
- Humid day, damp returns, worn degasser rotor | 2.60 | 2.44 | 6.2% | fails, even after degassing
caption: This is an illustration. The density index is a comparison within one foundry's test conditions, not an absolute hydrogen content; the limit belongs to this foundry, this test and this casting.
```

## Gas porosity or shrinkage porosity?

Both defects are holes in the casting, and both appear in the last places to freeze, so they are easily confused. They have different causes and different cures, and treating one as the other wastes time.

```figure
type: compare
title: Telling gas porosity from shrinkage porosity
cols: Gas porosity | Shrinkage porosity
rowhead: Feature
- Shape of the holes | rounded, smooth-walled, often spherical | irregular, jagged, following the dendrites
- Where they are | scattered through the section, also in thin walls | concentrated at hot spots, last places to freeze, under risers
- Response to a bigger riser | none | improves or disappears
- Response to degassing | improves or disappears | none
- * Best check | reduced-pressure test of the melt; section and look at the pore walls | Chvorinov and feed checks; section at the hot spot
caption: Many castings contain both, because hydrogen bubbles nucleate most easily where feeding is also poor. The shape of the pore walls, smooth or dendritic, is usually the clearest single sign.
```

## Oxides, inclusions and sand

Chapter 5 described oxide films folded into the casting by turbulent flow. Oxide also enters with the charge: returns carry their oxide skins into the melt, and the oxide from melting and holding forms dross, which must be skimmed off before pouring. Oxide films and particles that stay in the melt are carried into the castings as inclusions. The degasser's bubbles, a ceramic foam filter in the gating, careful skimming and a short holding time all reduce them.

Sand inclusions come from the mould: loose sand washed off a weak mould surface or a damaged core by the flowing metal, often near the gates. They show as rough, gritty pockets on machined faces. Mould strength, careful core setting, clean mould cavities blown out before closing, and gates that do not jet metal against the sand prevent them.

## Grain size and grain refinement

Chapter 1 noted that freezing begins on nuclei: the mould wall, impurity particles or added refiner particles. A melt with few effective nuclei grows a few large grains; a melt with many grows many small ones. Fine, equiaxed grains feed better through the mushy zone, spread porosity into smaller, less harmful pores, resist hot tearing and give more uniform properties. Chapter 3 described adding a titanium–boron master alloy as a grain refiner.

Grain size is measured on a polished and etched section, by counting grains in a known area or by measuring the average length of grain intercepts along test lines, and expressed as a grain size number, G. A larger G means finer grains. The WORKOS [Grain size acceptance](/tools/grain-size-acceptance/) tool takes up to five field readings, as grains per square inch at 100×, grains per square millimetre, or mean lineal intercept length in micrometres, averages them, converts the average and each field to G, and reports the spread between the coarsest and finest fields, checking both against your specified range and the largest spread you accept. Its guide notes that it assumes equiaxed, single-phase grains and that five fields give only a rough average.

This is an illustration. The foundry checks grain refinement on a section of a test bar poured from each new batch of refiner rod. Its internal limit for GB-12 is G of at least 0.5 by the intercept method, with a spread between fields of no more than 1.5.

```figure
type: compare
title: Grain size of two GB-12 test bars by mean lineal intercept
cols: Field intercepts, µm | Average, µm | Average G | Spread in G | Result
rowhead: Test bar
- * Melt with refiner added | 180, 210, 195, 240, 205 | 206 | 1.27 | 0.83 | accept
- Melt with refiner omitted | 420, 510, 460, 600, 480 | 494 | −1.25 | 1.03 | reject: too coarse
caption: This is an illustration. From the grain size acceptance tool, intercept mode, specification G 0.5 or finer, largest spread 1.5. The refined bar has grains about 2.4 times smaller across, and about six times as many grains in each square millimetre of section.
```

The tool reports the unrefined bar as too coarse, with a negative grain size number, which is simply the formula's way of describing grains coarser than G = 0. The cooling curve of Chapter 1 had already flagged that melt with a pronounced undercooling dip before the test bar was sectioned.

## Modification of the silicon

In an aluminium–silicon alloy, the last liquid to freeze is the eutectic, a mixture of aluminium and silicon. Left to itself, the silicon in the eutectic grows as coarse, brittle plates, which act like small internal cracks and reduce the casting's ductility. A small addition of strontium, or of sodium in older practice, changes the silicon into a fine, branched, fibrous form, and the casting's elongation can improve markedly. This is modification, and GB-12's foundry adds strontium as a master alloy to every melt (Chapter 3), checking its effect by the eutectic temperature on the cooling curve.

Modification interacts with the other melt properties. Strontium fades with holding and with vigorous degassing, so its addition is timed after the main degassing. And foundries commonly observe that modified melts are more sensitive to gas porosity, so the reduced-pressure test matters more, not less, in a modified alloy. These are interactions the foundry manages by keeping the sequence of melt treatment the same every time: charge, melt, skim, degas, add refiner and modifier, short final degas, test, pour.

## Hot tears

A hot tear is a crack that forms while the casting is still partly liquid, at the very end of freezing. In the last stage of solidification, the casting is a network of solid dendrites with thin films of liquid between them, strong in compression but almost without strength in tension. If the casting's contraction is resisted at that moment, by a core it is shrinking onto, by a section that has already frozen and cooled, or by the mould, the weak network is pulled apart, and the remaining liquid cannot fill the gap. Hot tears are ragged, oxidised cracks, usually at junctions and hot spots.

GB-12's design gives hot tears several opportunities: its walls shrink onto the large internal core, and its ribs meet its walls at junctions that freeze late. The defences are the ones already in the book. Generous fillets avoid sharp hot spots (Chapters 4 and 6). Grain refinement spreads the strain over many small grains. A core with a binder that breaks down soon after pouring collapses as the casting contracts, instead of holding it. And keeping the alloy's composition in its band matters, because some alloy compositions are much more prone to hot tearing than others.

### Cold laps and misruns

Two more defects come from filling rather than the melt, and are mentioned here so the list is complete. A cold lap is a seam where two streams of metal met but did not fuse, because they were already too cool; a misrun is a section that never filled at all. Both appear in the thin walls far from the gates and are cured by faster filling, slightly higher pouring temperature or better venting, as Chapter 5 showed with its pouring-time trials.

## Keeping a defect record

Defects are easier to cure when they are counted. GB-12's foundry records every scrapped or reworked casting against a short list of defect types, with the melt number, mould number and position on the casting, and plots the counts weekly. A rise in one type points to its likely cause straight away: gas porosity to the melt and the weather, oxide near the gates to the gating or the pourer, sand inclusions to the moulding line, shrinkage to the risers or a pattern change, hot tears to the cores or the composition. Without the record, every defect looks like every other defect, and the remedy chosen is whichever one the person on shift remembers working last time, which is exactly how the error below began.

The record is also how a foundry shows a customer that its process is under control. GB-12's customer asked for the monthly scrap rate by defect type as part of the supply agreement, and the foundry's improvement work, such as the sleeved-riser trial of Chapter 7, was chosen from that list.

## The error: a bigger riser for a gas problem

This is an illustration. During a wet spell in winter, a batch of GB-12 covers failed their pressure test at a rate of about one in ten. X-rays showed fine porosity scattered through the walls and the boss. The shift supervisor, remembering the riser problems of the trials (Chapters 6 and 7), had the boss riser enlarged to 100 × 130 mm. The next batch was no better.

The metallurgist sectioned two of the failed covers. The pores were round and smooth-walled, scattered through the thin walls as well as the boss, which a riser on the boss could never have caused or cured. The reduced-pressure test records for the week showed density indices of 5% to 6% even after degassing, against the 2% limit; the operators had recorded the results but, with the moulding line waiting, had poured anyway.

The investigation found three sources of hydrogen together: returns stored in an open bay had been charged wet from the rain; the degasser's graphite rotor was worn and producing coarse bubbles that removed little hydrogen; and the humid air itself was adding hydrogen to the melt surface during long holds.

```figure
type: checklist
title: Controlling gas porosity at the furnace
caption: The open item is the rule that was bent in the error: a failed test means the melt is not poured.
- Charge materials dry and preheated | returns stored under cover
- Degasser rotor inspected and replaced on wear | bubble size matters as much as gas flow
- Degassing time and gas flow recorded each melt | the same for every melt
- ? Reduced-pressure test passed before pouring | a failed test means re-degas and retest
- Holding time kept short | especially in humid weather
- Pouring temperature no higher than filling needs | hotter metal holds more hydrogen
```

The fix was to replace the rotor, store returns under cover and preheat them, and enforce the rule that a melt that fails its reduced-pressure test is degassed again and retested before any mould is poured. The boss riser went back to its proven 90 × 120 mm, and the pressure test failures stopped. The week's lost castings had been paid for twice: once in the scrap, and again in the time spent changing a riser that was never the problem.

## Exercise: reading a reduced-pressure test

This is an illustration. A melt's two samples measure 2.64 g/cm³ (atmospheric) and 2.57 g/cm³ (reduced pressure).

1. What is the density index?
2. Does it pass the foundry's 2% limit?
3. A section from a casting poured from this melt shows irregular, jagged holes only in the boss. What does that suggest?

**Worked answer.**

1. (2.64 − 2.57) ÷ 2.64 × 100 = **2.7%**.
2. **No.** The melt should be degassed again and retested before pouring.
3. Jagged holes confined to the hot spot are the signature of **shrinkage**, not gas, so this casting probably has both problems: the melt carries too much hydrogen, and the boss is not being fed. The riser and feeding checks of Chapters 6 and 7 should be repeated for that casting, and the melt degassed, because curing one will not cure the other.
