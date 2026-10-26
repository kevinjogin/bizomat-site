---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: flanges-returns-and-hems
order: 4
title: "Flanges, returns and hems: stiffening the edge"
description: "Calculate how much a folded return or lip stiffens a panel's edge, see why a flange stiffens the edge and not the middle, and catch returns added to cure a bow they could not touch."
draft: false
---

The cheapest stiffener a sheet metal designer has is a fold. A return flange along the edge of a panel costs one stroke of the folder and a slightly larger blank, and it turns the panel's weakest feature, a free cut edge, into a light angle section many times stiffer. A second fold, a lip or hem on the end of the flange, roughly doubles that again and removes the sharp edge from where hands touch it.

What a flange does not do is stiffen the middle of a panel whose edges are already supported. That limitation is easy to forget, and SP-90's first redesign forgot it. This chapter calculates what returns and lips add to an edge, shows where that matters, and explains the folding details, corner notches and hems, that make a flanged panel buildable.

## A flange as a beam

A return flange folded at 90° to the panel, together with a strip of the panel next to it, forms an angle section. Its second moment of area about its own neutral axis determines how much the edge bends between supports. The calculation is the ordinary composite-section method: find the centroid of the pieces, then add each piece's own second moment and its area times the square of its distance from the centroid.

The difficulty is deciding how much of the panel acts with the flange. A strip of panel right next to the fold clearly works as part of the angle; panel far from the fold does not, because it is busy bending as a plate. This book takes an effective width of 30 times the thickness, 36 mm for 1.2 mm sheet, as a working assumption. It is a deliberately modest value; the result is not very sensitive to it, because most of the section's stiffness comes from the flange standing up from the panel.

```figure
type: svg
title: Section through SP-90's edge with a 20 mm return and a 10 mm lip
alt: A cross-section drawn large. A horizontal line represents 36 millimetres of panel acting with the edge. At its right end a vertical line rises 20 millimetres as the return flange, and from its top a short horizontal line runs 10 millimetres back inwards as the lip. A dashed horizontal line marks the neutral axis 6.4 millimetres above the panel. Labels give the effective panel width, the return height, the lip length and the second moment of area of 4,550 millimetres to the fourth power.
caption: This is an illustration, drawn at about six times full size. The neutral axis sits low because the 36 mm effective strip of panel holds much of the area; the return and lip, far from it, supply most of the stiffness.
viewbox: 0 0 640 260
body:
<path class="la draw" pathLength="1" d="M180 200H396V80H336"/>
<path class="ln dsh" d="M150 162H460"/>
<text class="tx txs" x="470" y="166">neutral axis, 6.4 mm above panel</text>
<path class="lf" d="M180 222H396"/>
<text class="tx txs" x="220" y="240">effective panel width 36 mm (30t)</text>
<path class="lf" d="M420 200V80"/>
<text class="tx txs" x="430" y="140">return 20 mm</text>
<path class="lf" d="M336 60H396"/>
<text class="tx txs" x="330" y="50">lip 10 mm</text>
<text class="txa" x="40" y="40">I = 4,550 mm⁴</text>
<text class="tx txs" x="40" y="62">1.2 mm sheet throughout</text>
```

The table compares four edge sections. The flange alone, with no panel acting, is included to show how much the panel strip contributes.

```figure
type: compare
title: Second moment of area of four edge sections in 1.2 mm sheet
cols: Effective panel width | Neutral axis above panel | I, mm⁴
caption: This is an illustration. Composite-section calculation with each piece as a rectangle; bend radii are ignored, which changes the results by a few per cent. A flat 36 mm strip of the same sheet has I = 5.2 mm⁴.
- 20 mm return, no panel acting | 0 mm | 10.6 mm | 664
- 15 mm return | 36 mm | 2.7 mm | 941
- *20 mm return | 36 mm | 4.0 mm | 2,152
- 25 mm return | 36 mm | 5.6 mm | 4,040
- 20 mm return with 10 mm lip | 36 mm | 6.4 mm | 4,550
```

Three things stand out. A return of any useful depth makes the edge several hundred times stiffer than flat sheet: 2,152 mm⁴ against 5.2 mm⁴ for the same 36 mm strip left flat. Stiffness rises steeply with return depth, nearly doubling from 20 to 25 mm, because depth enters squared and cubed. And a 10 mm lip on a 20 mm return does slightly better than a 25 mm return, with 5 mm less flange height, because the lip puts its material at the far edge of the section, where it counts most.

## Where an edge's stiffness matters

An edge's stiffness matters when the edge spans between supports. If a panel is screwed to a frame every 150 mm, its edge spans 150 mm between screws and is supported almost continuously; stiffening it changes little. If the panel is held by a few fasteners, its edges span hundreds of millimetres and become beams carrying the panel's load to those fasteners.

To estimate the load on each edge, a simple tributary division is enough: draw 45° lines from each corner of the panel until they meet, and each edge carries the pressure on the area next to it. For SP-90 that gives each long edge a trapezoid of (900 + 300) / 2 × 300 = 180,000 mm², carrying 45 N under 250 Pa, and each short edge a triangle of 600 × 300 / 2 = 90,000 mm², carrying 22.5 N. The four add up to the panel's 135 N.

### The running case: fewer fasteners

This is an illustration. SP-90 is screwed to its frame with 20 screws at 150 mm pitch, and maintenance staff take it off often. The builder wanted to halve the number of fasteners to 10, at 300 mm pitch, and asked whether the edges would still behave as supported.

A 20 mm return with I = 2,152 mm⁴, spanning 300 mm between fasteners and carrying 45 N spread over 900 mm, which is 0.05 N per millimetre, deflects 5 × 0.05 × 300⁴ / (384 × 200,000 × 2,152) = **0.012 mm** between fasteners. That is negligible beside any bay deflection in this book. With returns, 300 mm fastener pitch keeps the edges effectively supported; without them, a 1.2 mm cut edge between fasteners 300 mm apart would lift visibly as the panel bowed.

The builder then asked about going further, to a lift-off panel held only at its four corners. Each long edge then spans the full 900 mm. With the 20 mm return, a uniform 45 N along that span gives a mid-edge deflection of 5 × 45 × 900³ / (384 × 200,000 × 2,152) = **0.99 mm**; with the 25 mm return, 0.53 mm; with the 20 mm return and 10 mm lip, **0.47 mm**.

```figure
type: bars
title: Mid-edge deflection of SP-90's long edge held only at its corners, 250 Pa
unit: mm
max: 1.2
caption: This is an illustration. Each long edge carries 45 N as a uniform load over a 900 mm span between corner fixings. The deflection adds to whatever the panel's bays do.
- 20 mm return | 0.99
- 25 mm return | 0.53
- *20 mm return with 10 mm lip | 0.47
```

Half a millimetre or a millimetre at mid-edge is acceptable for appearance, but it adds directly to the bay deflections calculated in later chapters, and an edge that moves also lets the panel's gasket open. For SP-90, the builder chose 10 fasteners at 300 mm pitch with a 20 mm return and a 10 mm lip on all four edges, keeping the edges supported and the cut edge out of reach. The exercise looks at the corner-only option again with the final stiffened panel.

## The error: returns added to cure the bow

This is an illustration. Before the stiffness analysis in this book was done, the builder's workshop tried a quick fix: fold 20 mm returns on all four edges of SP-90, keep the 20 screws, and see whether the bowing improved. The returns looked substantial, the panel felt more rigid when picked up, and everyone expected the problem to be solved.

It was not. Under the extraction, the modified panel still bowed by almost the same amount at its centre; a straightedge and feeler gauge showed a difference of a few tenths of a millimetre, within the scatter of the measurement. The panel felt stiffer in the hand because, held by one edge, it was being bent as a whole and the returns resisted that. Screwed to the frame every 150 mm, its edges were already supported, and the returns had nothing to add. The bowing happens in the middle of the bay, 300 mm from the nearest edge, where the returns have no influence.

The finding was recorded plainly: **a flange stiffens the edge it is on, not the middle of the panel.** To reduce a bay's deflection, the bay must be made smaller or its middle must be given shape. The returns were not wasted. They allowed the fastener count to be halved and they made the panel robust to handle. But they were the wrong tool for the complaint they were meant to fix, and the workshop's trial cost two days that a five-minute calculation would have saved.

## Corners and notches

A panel with returns on all four sides is a shallow tray, and its corners need attention. The flat blank for SP-90 with 20 mm returns and 10 mm lips is roughly 600 + 2 × 30 = 660 mm by 900 + 2 × 30 = 960 mm, before bend allowances, with a square notch removed at each corner so that the returns can fold up without colliding. Sheet Metal Parts by the Numbers covers bend allowance and the flat pattern in detail; here the points are about the corners.

1. **Notch size.** The notch must clear both folded flanges. For returns alone, a notch the depth of the return plus a small relief gap is enough. With lips, the lips of adjacent returns would overlap at the corner, so the notch must also remove the lip length, or the lips must be cut back at 45° so that they meet without overlapping.
2. **Relief at the bend.** Where a bend line meets a notch, a small relief cut stops the sheet tearing at the corner of the notch. The relief is usually at least the sheet thickness wide and runs a little past the bend line.
3. **Joining the corners.** An open corner leaves each return acting as a separate beam. Closing the corner with a rivet, a clinch or a spot of adhesive through an overlapping tab turns the four returns into a frame, which stiffens the panel against twisting and stops the corners from opening. [Sheet Metal Joints by the Numbers](/reados/publications/sheet-metal-joints-by-the-numbers/) covers the options.

The 1918 trade text listed in this book's references spends a whole chapter on notching for this reason: in hand work, a notch cut too small shows up as metal that will not fold, and one cut too large shows up as a hole in the corner of the finished article. The numbers have not changed, only the tools that cut the notch.

### Folding order

A tray with lipped returns on four sides must be folded in an order the folder can reach. The usual sequence is lips first, while the blank is flat and each lip's bend line can be put against the back gauge, then the two returns on the long sides, then the two on the short sides. The last two returns are folded between returns that already stand up, which needs a box-and-pan folder with removable fingers set to the inside width, or a press brake with a segmented punch. A press brake also needs enough flange beyond the bend line to bridge its die; Sheet Metal Parts by the Numbers gives the minimum flange for each die, and a 10 mm lip in 1.2 mm sheet is comfortably above the usual minimum for a small die.

Folding the lips first also matters for accuracy. A lip folded after its return would be bent on a narrow flange standing up from the panel, awkward to hold square, and its height would vary along the edge. Folded first, it is a straight bend on flat sheet. The designer should state the intended order on the drawing only if it matters to the result, and otherwise leave the sequence to the folder, who knows the machine.

## Hems and safe edges

A **hem** folds an edge back flat on itself through 180°. A **lip** is a fold of less than 180°, usually 90°, as on SP-90's returns. Both remove a cut edge from where hands touch it, which on an enclosure that people handle is reason enough to use one.

As stiffeners, they behave very differently. A lip stands up from the flange it is on and adds depth to the section, which is why it raised the return's I from 2,152 to 4,550 mm⁴. A flat hem lies on the sheet and adds thickness, not depth. Bending a 10 mm wide flat strip out of its plane, its I is 1.44 mm⁴ as a single 1.2 mm layer and 11.5 mm⁴ as a closed hem of two layers, eight times more because the thickness has doubled. That is a large ratio of two very small numbers, and nothing like what a fold standing up from the sheet achieves. A hem stiffens an edge against denting and against bending in the plane of the sheet, and it makes an edge safe; it does very little for out-of-plane stiffness.

```figure
type: decision
title: Choosing an edge fold for a panel
question: What must the edge do?
- Carry the panel's load between widely spaced fixings | Return of 20 mm or more, with a lip | Depth gives stiffness; the lip adds more and removes the cut edge
- Be safe to handle on a panel fixed all round | Hem or lip | Removes the cut edge; little stiffness needed
- Capture a gasket or another sheet | Open hem or return sized to the captured part | The gap is a functional dimension
- *Reduce bowing in the middle of the bay | None of these | Shorten the bay or shape its middle (Chapters 6 and 7)
```

## Exercise: corner-only fixing, revisited

Chapter 7's final SP-90 has three horizontal hat stiffeners spanning the 600 mm width at 225 mm pitch. Under 250 Pa, each stiffener carries the pressure on a 225 mm strip of the panel and delivers half of it to each vertical edge.

1. What load does each stiffener deliver to each vertical edge?
2. If the panel were held only at its four corners, with the 20 mm return and 10 mm lip on the vertical edges (I = 4,550 mm⁴), estimate the mid-edge deflection from those three point loads alone, at 225, 450 and 675 mm along the 900 mm span.

**Worked answer.**

1. Each stiffener carries 0.00025 × 225 × 600 = 33.75 N, and delivers **16.9 N** to each end.
2. For a simply supported beam, the deflection at mid-span from a point load P at distance a from one end is P b x (L² − b² − x²) / (6 E I L), with b = L − a and x the mid-span position, for x on the shorter side of the load, and the symmetric expression otherwise. Adding the three loads at mid-span gives about **0.67 mm**. Since the stiffened panel's own bays deflect only about a quarter of a millimetre, a corner-only fixing would make the edges the most flexible part of the panel. The lesson is that once the middle of a panel is stiffened, its edges and their fixings must be checked again, because the load now reaches them through a few concentrated points rather than spread along their length. The builder kept the 10 fasteners at 300 mm pitch.
