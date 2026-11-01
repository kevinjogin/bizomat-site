---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: shading-bypass-diodes-and-hot-spots
order: 6
title: "Shading, bypass diodes and hot spots"
description: "Why shading one cell can cost far more than its share of the light, how bypass diodes and hot spots work, how to space rows to avoid shading, and how to find a shading fault."
draft: false
---

Shade a tenth of a module and you might expect to lose a tenth of its power. Often you lose a third, and sometimes more. The reason is that cells in series must all carry the same current, so the weakest cell in a chain sets the current for every cell in it. A shaded cell cannot carry the current the others are pushing, and it is driven into reverse bias, where it stops producing power and starts consuming it as heat. Bypass diodes limit the damage, but they do so by switching a whole group of cells out of the circuit.

This chapter explains what happens to a shaded cell, how bypass diodes and hot spots work, how a string behaves when part of it is shaded, and how to space rows and lay out an array to avoid shading. It works SF-90's annex frames and ends with a shading fault that appeared after the shade survey was done.

## A shaded cell in a series chain

Each SF-90 module behaves like 54 cells in series, in three groups of 18, with a bypass diode across each group. In normal operation each cell sits at about 31.9 ÷ 54 = 0.591 V at maximum power and carries the full module current.

Suppose one cell is heavily shaded, by a leaf or a bird dropping, so that it can generate only a small current. The rest of the string is still pushing the full current. The string's operating point is set by the inverter's tracker and by all the other cells; the shaded cell must either carry that current or block it. A cell cannot generate more current than its light allows, so to pass the string current it is driven into reverse bias. The voltage of the other 17 cells in its group, and of the rest of the string, then appears across it in the wrong direction.

A silicon cell in reverse bias behaves like any reverse-biased diode. Little current flows until the voltage is large enough to cause breakdown, when carriers accelerated by the strong field across the junction gain enough energy to knock further electrons loose by impact ionisation, and the current rises steeply. Solar cells, made from lightly doped wafers with imperfect edges, typically break down somewhere between about 10 and 20 V in reverse, and some cells conduct significant leakage at lower voltages through local defects. Any current through the cell in reverse bias dissipates power in it, and the power is concentrated: in a crack, at an edge, or at a defect.

## Bypass diodes

A bypass diode is connected across each group of cells in the opposite direction to their normal voltage. While the group is producing power, the diode is reverse-biased and does nothing. When a shaded cell drags the group's voltage below zero, the diode becomes forward-biased once the group's voltage reaches about −0.5 V and carries the string current around the group. The group is switched out, and the reverse voltage across the shaded cell is limited to the voltage of the other cells in its group plus the diode's forward drop: about 17 × 0.591 + 0.5 = 10.5 V.

```figure
type: svg
title: One SF-90 module group with a shaded cell and its bypass diode
alt: A row of eighteen cells drawn as small rectangles joined in series between two terminals. The fifth cell is shaded grey and labelled shaded cell, reverse biased about 10.5 volts. Above the row a bypass diode symbol connects the two ends of the group, with an arrow showing the string current flowing through the diode and around the group. Below the row the normal current path through the cells is shown dashed, labelled blocked by the shaded cell.
caption: This is an illustration. With one cell shaded, the string current of about 13 A flows through the bypass diode instead of the 18 cells. The group's output is lost; the shaded cell sees the other 17 cells' voltage, about 10 V, in reverse.
viewbox: 0 0 600 230
body:
<path class="ln" d="M30 130H570"/>
<rect class="bx" x="50" y="112" width="24" height="36"/>
<rect class="bx" x="80" y="112" width="24" height="36"/>
<rect class="bx" x="110" y="112" width="24" height="36"/>
<rect class="bx" x="140" y="112" width="24" height="36"/>
<rect class="bxi" x="170" y="112" width="24" height="36"/>
<rect class="bx" x="200" y="112" width="24" height="36"/>
<rect class="bx" x="230" y="112" width="24" height="36"/>
<rect class="bx" x="260" y="112" width="24" height="36"/>
<rect class="bx" x="290" y="112" width="24" height="36"/>
<rect class="bx" x="320" y="112" width="24" height="36"/>
<rect class="bx" x="350" y="112" width="24" height="36"/>
<rect class="bx" x="380" y="112" width="24" height="36"/>
<rect class="bx" x="410" y="112" width="24" height="36"/>
<rect class="bx" x="440" y="112" width="24" height="36"/>
<rect class="bx" x="470" y="112" width="24" height="36"/>
<rect class="bx" x="500" y="112" width="24" height="36"/>
<rect class="bx" x="530" y="112" width="24" height="36"/>
<path class="ln" d="M40 130V60H285"/>
<path class="ln" d="M315 60H560V130"/>
<path class="lf" d="M285 45L285 75L315 60Z"/>
<path class="ln" d="M315 45V75"/>
<path class="la" d="M120 40H220"/>
<text class="tx txs" x="110" y="30">String current through the bypass diode</text>
<text class="txb" x="250" y="95">Bypass diode</text>
<text class="tx txs" x="140" y="175">Shaded cell, reverse biased about 10.5 V</text>
<path class="dsh" d="M182 150V165"/>
<path class="dsh" d="M50 200H550"/>
<text class="tx txs" x="160" y="222">Normal path through the cells, blocked by the shaded cell</text>
```

While it conducts, the diode dissipates the string current times its forward drop. Modules use Schottky diodes, with a low forward drop of about 0.4 to 0.5 V, so at 13.2 A each conducting diode turns about 13.2 × 0.45 = 5.9 W into heat inside the junction box. A diode that conducts for hours every day, because of permanent shading, runs hot and is more likely to fail. Bypass diodes most often fail short-circuit, which permanently removes a third of the module's voltage, or open-circuit, which leaves its group unprotected.

## Hot spots

The bypass diode limits the reverse voltage across a shaded cell; it does not stop the cell heating. A partly shaded cell may still pass part of the string current in reverse bias, at up to about 10.5 V. If it passes 3 A, it dissipates 10.5 × 3 = 31.5 W. Spread over one half-cut cell of 182 × 91 mm, that is about 1,900 W/m², nearly twice the heat of full sunlight, and if it is concentrated at a defect, far more. Cells in hot spots can reach well over 100 °C, which over time discolours and delaminates the encapsulant, cracks the backsheet or the glass and, in the worst cases, starts a fire.

Module qualification testing to IEC 61215 includes a hot-spot endurance test, so modules are designed to survive occasional shading. Persistent shading of the same cells day after day, or a cracked cell with a low breakdown voltage, is a different matter. An infrared camera finds hot spots quickly: a cell several kelvin hotter than its neighbours in full sun is worth investigating, and one tens of kelvin hotter needs action.

## A shaded string

When one group in one module is bypassed, the string loses that group's voltage: about 31.9 ÷ 3 = 10.6 V of the string's 574 V at maximum power, 1.85%. Bypassing changes the shape of the string's power–voltage curve: instead of one smooth peak, it has two or more, one for each combination of groups bypassed or not. The tracker must find the highest, the global maximum. Most modern inverters scan the whole curve periodically to avoid settling on a lower, local peak. A tracker that settles on a local peak can lose far more than the shaded share.

Because cells, modules and strings are in series, the effect of shading depends heavily on its shape. A shadow that falls across the bottom row of cells of every module in a row, as low winter sun does between closely spaced rows, can switch out a group in every module at once. A shadow that falls along the length of one module's group affects only that group. The cells in SF-90's modules run in three groups along the long side of the module, which is why portrait and landscape mounting behave differently under row shading, and why the installer arranges modules so that the expected shadows fall along groups rather than across them where possible.

Mismatch is the mild, permanent form of the same effect. No two modules are identical; the datasheet's 0 to +5 W power tolerance means modules in the same string differ slightly, and the string runs at a current that no single module would choose for itself. The loss chain's 1% for mismatch covers that and the small differences in temperature and soiling across a roof.

## Module-level electronics

Some proposals add a small power converter to each module: an optimiser, which adjusts each module's current and voltage so that it works at its own maximum power point while the string carries a common current, or a microinverter, which turns each module's output into alternating current on the roof. Both reduce the loss when shading or mismatch is uneven, because one weak module no longer drags its string. Both also allow each module's output to be monitored, and both reduce the DC voltage on the roof when the system is shut down.

Their cost is not only the price. A factory roof array with 216 module-level devices has 216 more electronic units in the sun and heat, each with its own connectors and failure rate, and each failure means a roof visit. On an array like SF-90's, with almost no shade by design, the energy gain from optimisers would be close to the 1% mismatch allowance, which would rarely pay for them. They earn their place where shading cannot be designed out, for example on a roof crowded with plant, or where roof sections face different ways. The business's rule is to design the shade out first and to consider module-level electronics only for the modules that cannot be kept out of shadow.

## Avoiding shade by design

The best defence is not to have shade. That means a shade survey before design, recording every object on and around the roof, and a layout that keeps modules out of their shadows at the times of day that matter.

On the annex, the 36 modules sit in portrait on frames at 10°, in three rows of 12. Each module rises 1.722 × sin 10° = 0.299 m from its lower to its upper edge and covers 1.722 × cos 10° = 1.696 m of roof. The rows must be far enough apart that one row does not shade the next when the sun is low. The usual rule is no row shading between 9 am and 3 pm solar time on the winter solstice, when the sun is lowest.

```figure
type: compare
title: Row spacing on the annex frames at the June solstice, Shepparton, portrait modules at 10°
cols: Sun altitude | Sun azimuth from north | Shadow length, north–south | Row pitch needed
rowhead: Solar time
- Noon | 30.2° | 0° | 0.515 m | 2.210 m
- 10 am or 2 pm | 23.8° | 30.1° | 0.587 m | 2.283 m
- * 9 am or 3 pm | 16.6° | 42.6° | 0.737 m | 2.433 m
caption: This is an illustration. The shadow length north–south is rise ÷ tan(altitude) × cos(azimuth); the pitch is the module's 1.696 m depth plus the shadow length. The annex rows are set at a pitch of 2.433 m, so the three rows need 2 × 2.433 + 1.696 = 6.56 m of roof depth.
```

The pitch of 2.433 m gives a ground coverage ratio, module length over pitch, of 1.722 ÷ 2.433 = 0.71. A tighter pitch would fit more modules on the annex but would lose output in winter, when the sun is low and the factory's heating load is high.

On the workshop roof the modules lie flat on the 5° deck and cannot shade each other. The risks there are objects on the roof: ridge ventilators, skylights, the parapet at the east end and any stacks or flues. The shade survey mapped them, and the layout kept modules at least the length of each object's winter noon shadow away from it on its south side.

## The error: a stack added after the survey

Eighteen months after commissioning, the workshop installed a new polishing booth with its own fume extraction, and its discharge stack was taken through the roof near the north eave, rising 2.5 m above the deck. The stack's position had been chosen by the ventilation contractor for the shortest duct run. Nobody connected it with the array.

At the June solstice the noon sun stands at 30.2°, and a 2.5 m stack casts a shadow 2.5 ÷ tan 30.2° = 4.30 m long, pointing due south, straight up the roof into the array. At 9 am the shadow is 8.39 m long and points south-west; in December, at noon, only 0.58 m. Through the winter, the stack's shadow swept across six modules in two strings for several hours a day.

The monitoring found it. The business compares each string's daily energy with the average of the others on the same roof (Chapter 9). From May onwards, strings 3 and 4 fell steadily behind, reaching about 9% below the others in June, while in summer they had matched. An infrared survey on a clear June day found two cells on two modules about 25 K hotter than their neighbours inside the shadow's path, and the inverter's curve scan showed the two-peaked shape of bypassed groups.

```figure
type: decision
title: Options considered for the stack's shadow
caption: This is an illustration. The second was adopted, with the first ruled out by the ventilation design.
- Move or shorten the stack | Removes the shade, but the stack height had been set for fume dispersal and the duct route for the booth | Ruled out by the ventilation engineer
- * Move the six affected modules to free space at the west end of the roof | Restores both strings; needs new rails, cable extensions and a re-test of both strings | Adopted
- Fit module-level optimisers to the affected modules | Reduces the energy loss but leaves the hot-spot heating and the shading | Not adopted
- Accept the loss | About 0.4% of the array's yearly yield, but with continuing hot spots and bypass diode duty | Not acceptable
```

The six modules were moved, both strings were re-tested to IEC 62446-1, and the strings' winter output returned to that of the others. The business added a rule to its change-control procedure: any new roof penetration, plant or structure must be checked against the array layout by the person responsible for the array before it is approved.

## Exercise: landscape rows

The installer suggests mounting the annex modules in landscape instead, with the 1,134 mm side up the frame at 10°, and keeping the same rule of no row shading from 9 am to 3 pm at the June solstice.

1. How far does each module rise, and how much roof depth does it cover?
2. What row pitch is needed, and what is the ground coverage ratio?
3. Why might landscape be better or worse than portrait for row shading on this array?

### Worked answer

1. Rise = 1.134 × sin 10° = 0.197 m; roof depth covered = 1.134 × cos 10° = 1.117 m.
2. At 9 am the sun's altitude is 16.6° and its azimuth 42.6° from north, so the shadow length north–south is 0.197 ÷ tan 16.6° × cos 42.6° = 0.486 m. The pitch is 1.117 + 0.486 = 1.603 m. The ground coverage ratio is 1.134 ÷ 1.603 = 0.71, the same as portrait: at a fixed tilt and shading rule the ratio depends only on the geometry of the sun and the tilt, not on the module's orientation.
3. In landscape, the low winter shadow from the row in front, when it does occur, falls along the bottom long edge of the module. With the cell groups running along the long side, that shadow falls on the bottom group only, so one bypass diode switches out a third of the module. In portrait, the same edge shadow falls across the ends of all three groups. In a half-cut module the shaded bottom half is in parallel with the unshaded top half, which keeps working, but the module still loses much more than its shaded share of light. Landscape therefore tends to degrade more gently when rows shade each other, at the cost of more rails and clamps per module. The module maker's layout drawing shows how the groups and halves run, and should be checked before choosing. Whether it matters depends on how often shading occurs, which the 9 am to 3 pm rule is meant to make rare.
