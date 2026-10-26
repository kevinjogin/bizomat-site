---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: beads-swages-and-crowns
order: 6
title: "Beads, swages and crowns"
description: "Size a rolled bead from its stiffness and its forming strain, lay out beads across the short span, use crowns and cross-breaks for stability, and catch beads that shortened the panel."
draft: false
---

A bead is a shallow groove rolled or pressed into a panel. It adds no material and no parts, yet a bead 4 mm deep can make a strip of sheet ten times stiffer, because it lifts a little of the sheet a few millimetres away from the middle of the section. Beads are why car floor pans, steel drums, roofing sheet and appliance backs are not flat, and why a bead roller is one of the most useful tools in a small sheet metal shop.

Beads come with costs that flat panels do not have. Rolling them stretches the sheet, which limits how deep they can be. They make the panel stiff in one direction and leave it flexible in the other. They pull in the panel's edges as they form. And, as Chapter 8 shows, a beaded panel that passes a static check can still drum. This chapter sizes beads for SP-90, compares their stiffness with their forming strain, and shows how crowns and cross-breaks use curvature for stability.

## The geometry of a bead

A rolled bead's section is roughly a circular arc rising above the flat sheet. Two numbers describe it: its width w across the base and its depth h. From those, the arc's radius is R = (w² / 4 + h²) / (2h), and its length is 2R × asin(w / 2R).

The bead's length along the arc is longer than its width. If the bead were formed purely by stretching, with no sheet drawn in from the sides, the sheet in the bead would be stretched by the ratio of arc length to width. That stretch is the bead's forming strain, and it is the first check on any bead.

```figure
type: svg
title: Section through one 150 mm strip of beaded panel
alt: A horizontal line represents 150 millimetres of flat sheet. In its middle, a shallow circular arc rises 4 millimetres over a width of 20 millimetres, forming a bead. Labels give the strip pitch of 150 millimetres, the bead width of 20, depth of 4, arc radius of 14.5 millimetres and arc length of 22.07 millimetres, and the forming strain of 10.3 per cent.
caption: This is an illustration, drawn at about 3.6 times full size. The arc is 2.07 mm longer than the bead's 20 mm width. If that length comes from stretching alone, the sheet in the bead is strained by 10.3%.
viewbox: 0 0 640 220
body:
<path class="la draw" pathLength="1" d="M50 130H284A52.2 52.2 0 0 1 356 130H590"/>
<path class="lf dsh" d="M284 150V100M356 150V100"/>
<text class="tx txs" x="296" y="168">w 20</text>
<path class="lf" d="M380 130V115.6"/>
<text class="tx txs" x="388" y="126">h 4</text>
<path class="lf" d="M50 190H590"/>
<text class="tx txs" x="280" y="210">pitch 150 mm</text>
<text class="txa" x="40" y="40">arc 22.07 mm over a 20 mm width</text>
<text class="tx txs" x="40" y="62">R 14.5 mm, forming strain 10.3%</text>
```

## Stiffness against strain

The table compares beads of different sizes in a 150 mm strip of 1.2 mm sheet. The second moment of area was calculated for the bent mid-surface of the strip, sheet and bead together, by dividing the arc into short straight pieces.

```figure
type: compare
title: Bead size, forming strain and stiffness, 150 mm strip of 1.2 mm sheet
cols: Arc radius | Forming strain if stretched | I, mm⁴ | Stiffness relative to flat
caption: This is an illustration. Flat 150 mm strip: I = 21.6 mm⁴. Strain assumes the bead is formed by stretching alone; drawing in from the sides reduces it, at the cost of shortening the panel.
- 20 × 3 mm | 18.2 mm | 5.9% | 128 | 6
- *20 × 4 mm | 14.5 mm | 10.3% | 217 | 10
- 20 × 5 mm | 12.5 mm | 15.9% | 339 | 16
- 20 × 6 mm | 11.3 mm | 22.5% | 497 | 23
- 25 × 5 mm | 18.1 mm | 10.3% | 391 | 18
```

Stiffness rises steeply with depth, roughly with its square, but so does strain. A 20 mm wide bead 6 mm deep is 23 times stiffer than flat sheet and needs a 22.5% stretch, close to the whole elongation of the zinc-coated sheet in the running case and enough to crack its coating. The last row shows the better route: widening the bead to 25 mm and making it 5 mm deep keeps the strain at the 10.3% of the 20 × 4 bead while nearly doubling its stiffness. **For a given strain, a wider bead can be deeper**, because strain depends on the bead's shape, h / w, and stiffness on its depth.

The bead roller's dies set the bead's width and profile, so in practice the designer chooses among the dies the workshop has. This is an illustration. The builder's bead roller had 20 mm dies, and the designer chose a depth of 4 mm, at a forming strain of about 10%, comfortably inside the sheet's capacity and its coating's.

## Laying out beads on SP-90

A bead stiffens the panel in the direction it runs. A strip of panel containing a bead becomes a light beam along the bead, while across the bead the panel is no stiffer than flat sheet. Chapter 2 showed that SP-90 bends mainly across its 600 mm short span, so the beads should run across the panel, horizontally, spanning 600 mm between the vertical edges.

This is an illustration. With beads at 150 mm pitch up the 900 mm height, there are five beads, leaving 150 mm strips. Each strip is treated as a simply supported beam 600 mm long carrying 250 Pa over its 150 mm width, a load of 0.0375 N per millimetre:

w = 5 × 0.0375 × 600⁴ / (384 × 200,000 × 217) = **1.46 mm**.

The flat sheet between beads also bends, as a 150 mm wide strip between two stiff beads; its deflection is 0.01302 × 0.00025 × 150⁴ / 31,648 = 0.05 mm, negligible. The beaded panel's total, about 1.5 mm, meets the 3 mm target with margin. Had the beads run vertically, spanning 900 mm, each strip would deflect 5 × 0.0375 × 900⁴ / (384 × 200,000 × 217) = **7.38 mm**, barely better than the flat panel. Direction matters as much as size.

```figure
type: bars
title: SP-90 deflection under 250 Pa, flat and beaded
unit: mm
max: 8
caption: This is an illustration. Beaded values treat each 150 mm strip as a one-way beam and ignore the help of the flat sheet across the beads, so they slightly overstate deflection. The flat value is the small-deflection estimate from Chapter 2.
- Flat 1.2 mm panel | 7.90
- Five beads running vertically, 900 mm span | 7.38
- *Five beads running across, 600 mm span | 1.46
```

The beads also help stability. Chapter 3's estimate of buckle height depends on bay size, and a beaded panel's bays are the 150 mm flats between beads, giving an estimated thermal buckle of about 1.0 mm for a 10 °C difference, well inside the builder's 2 mm limit.

### Bead ends

A bead must stop somewhere, and its ends are where trouble starts. At each end, the bead's extra arc length has to fade out into flat sheet, which leaves a local bulge or pucker in the flat around it. Common practice is to stop beads short of folds and edges by a distance at least several times the bead width and to let the bead's depth taper out over a similar length, which the bead roller does naturally as the operator lifts the upper die. This is an illustration. The builder stopped SP-90's beads 25 mm from the inside of the vertical returns, so that each bead runs about 550 mm of the 600 mm span, and accepted the small loss of stiffness near the edges, where the returns support the panel anyway.

### Rolled or pressed

Beads can be rolled or pressed, and the choice affects cost and quality as much as stiffness.

A **bead roller** is a pair of shaped wheels, one with a ridge and one with a matching groove, driven by hand or motor. The sheet is fed between them along a guide, and the bead is formed progressively, usually in two or three passes with the wheels brought closer each time. Rolling needs no tooling beyond the wheel set, so it suits short runs and prototypes, and it can follow curves. Its weaknesses are consistency and edge distortion: the depth varies a little with operator and feed, and the panel's free edges wave if the beads are rolled too deep in one pass.

A **pressed bead** is formed in one stroke with a matched die on a press or press brake. The bead's depth and profile are repeatable, and the ends can be shaped to fade out cleanly, but each bead length and profile needs its own tooling. For batches of hundreds of identical panels, pressing usually wins; for SP-90's batches of a few dozen, the builder kept the bead roller.

In both cases, the depth that actually results should be measured on the first panel of a batch, with a depth gauge across the bead at several points along it, because depth drives both stiffness and strain. This is an illustration. The builder's first-off check records each bead's depth at its middle and 50 mm from each end, and accepts the batch if all readings are within half a millimetre of the nominal 4 mm.

## Crowns and cross-breaks

A bead uses depth. A crown uses curvature. A panel given a slight, deliberate curve, even a few millimetres over its width, behaves as a very shallow shell. Under pressure on its convex side, it resists partly by membrane compression along its curve, which is far stiffer than bending, and it has only one stable shape, so it does not oil-can.

A **cross-break** is the sheet metal worker's way of putting a crown into a flat rectangular panel: two shallow folds along the diagonals, so that the panel becomes a very low pyramid. Rectangular ducts are cross-broken for exactly this reason, so that they do not drum and pop as air pressure changes, and [Rectangular Duct Fittings by the Numbers](/reados/publications/rectangular-duct-fittings-by-the-numbers/) covers it in the duct context. A **swage** is a stepped or ridged bead, often along an edge, used for the same purpose as a bead and sometimes to let one panel overlap another flush.

For an enclosure side panel, crowns and cross-breaks have a drawback: they are visible, and a pyramid-shaped side panel looks odd on a machine. They also make the panel's edges no longer meet the frame flat unless the crown fades out before the edges. The builder considered a cross-break for SP-90 and rejected it on appearance, but it remains the cheapest cure for oil-canning on hidden panels such as duct sides and the backs of cabinets.

## The error: beads that shortened the panel

This is an illustration. The first beaded SP-90 panels were made in the workshop's usual order: blanks cut to final size and fully punched on the turret, returns folded, then beads rolled last because the bead roller was the only free machine that afternoon. When the first panel was offered to its frame, the screw holes on the top and bottom returns were about 6 mm out of line with the frame's holes, and the panel would not go on.

The cause was the beads. Each bead's arc is 2.07 mm longer than its width. The sheet in a rolled bead comes partly from stretching and partly from sheet drawn in from either side, and on this panel, with no restraint on its top and bottom edges, a good part of each bead's extra length had been drawn in. Five beads could, in the limit, shorten the panel's 900 mm height by 5 × 2.07 = 10.4 mm; the measured shortening of about 6 mm meant a little over half the extra length had come from drawing in and the rest from stretching.

The workshop changed the sequence. Beads are now rolled in an oversize blank before the panel is trimmed to its final height and before the holes on the top and bottom returns are punched, so that whatever the beads draw in comes out of the trim allowance. The designer added a note to the drawing: "BEADS TO BE FORMED BEFORE FINAL TRIM AND PUNCHING". The lesson is that any forming operation that lengthens the sheet's path, beads, swages, crowns and deep flanges, changes the blank's size, and it must come before the operations that fix the final size.

## When beads are not the answer

Beads are cheap, light and effective, and they are not always right:

- **Appearance.** Beads are visible from both sides. On a painted show surface they may be unwelcome.
- **One-way stiffness.** A beaded panel is stiff along its beads and flexible across them. A square panel loaded from all directions may need beads both ways, which intersect awkwardly, or a diamond pattern.
- **Coated sheet.** Deep beads crack coatings and, on pre-painted sheet, the paint. The coating supplier's minimum bend radius applies to the tight radii at a bead's edges.
- **Cleaning and hygiene.** Grooves collect dust, oil and swarf. On a panel inside a dusty enclosure, or on food and pharmaceutical equipment that must be wiped down, beads facing the dirty side are a maintenance cost, and they may need to face outwards or be replaced by stiffeners on the clean side.
- **Fixings.** A bead where a label, hinge, gasket or bracket must sit flat forces that item to move. Beads should be laid out after everything that must mount on the panel has been placed.
- **Vibration.** A beaded panel's mass is unchanged, but its stiffness is concentrated in the bead direction, and its first natural frequency may land somewhere awkward. Chapter 8 shows that it does for SP-90.

## Exercise: wider dies

The builder's supplier offers 25 mm bead dies. Using the table, compare a 25 × 5 mm bead at 150 mm pitch with the chosen 20 × 4 mm bead.

1. What is the deflection of SP-90's beaded strips under 250 Pa with 25 × 5 mm beads running across the 600 mm span?
2. What is the forming strain, and what would the shortening be, in the limit, for five beads drawn in fully?

**Worked answer.**

1. With I = 391 mm⁴, w = 5 × 0.0375 × 600⁴ / (384 × 200,000 × 391) = **0.81 mm**, a little over half the 1.46 mm of the 20 × 4 bead.
2. The forming strain is the same **10.3%**, since both beads have the same ratio of depth to width, 0.2. The 25 × 5 mm bead's arc is 27.59 mm long, 2.59 mm more than its width, so five fully drawn-in beads would shorten the panel by up to 5 × 2.59 = **about 13 mm**. The wider bead is stiffer for the same strain but draws in more, so the oversize blank and the forming-before-trimming sequence matter even more. It is also worth checking, as Chapter 8 does for the 20 × 4 bead, where the stiffer beaded panel's natural frequency lands.
