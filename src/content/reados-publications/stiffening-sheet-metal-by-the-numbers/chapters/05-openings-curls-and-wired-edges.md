---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: openings-curls-and-wired-edges
order: 5
title: "Openings, curls and wired edges"
description: "Stiffen a free edge with a hem, curl, wired edge or flange, size the wire allowance three ways, find the corner radius a flanged opening needs, and catch corners that split."
draft: false
---

An opening cut in a panel does two kinds of damage. It removes material that was helping the panel resist bending, and it leaves a free edge, an edge with nothing holding it, which is the most flexible and most easily damaged part of any sheet metal part. Hoses rub on it, hands catch on it, and if the opening has sharp corners, cracks start there.

The traditional trades had a family of answers for free edges: hems, curls, wired edges, and flanged or burred openings. The 1918 trade text listed in this book's references devotes chapters to each, because a tinsmith's article lived or died by its edges. This chapter puts modern numbers on those edge treatments, sizes a wire allowance by three methods, and shows why a flanged opening needs generous corner radii.

## The running case: the cable opening

This is an illustration. SP-90 has an opening 400 mm wide and 250 mm high near its bottom, through which cables and an air hose enter the enclosure. A brush strip clipped to the opening's edge closes the gap around them. In the original panel, the opening was simply laser cut with 10 mm corner radii and deburred. Its edges flexed visibly when hoses were pulled through, the brush strip's clips worked loose, and one panel developed a crack from a corner after a few months.

The redesign must give the opening's edge enough stiffness to hold the brush strip, a smooth edge for cables and hands, and corners that do not crack.

## How stiff is each edge treatment?

The useful comparison is the second moment of area of the edge, a strip of sheet next to the opening together with whatever has been formed on it, bending out of the panel's plane. The table takes 30 mm of sheet next to the edge as the reference strip and adds each treatment to it.

```figure
type: compare
title: Out-of-plane stiffness of edge treatments in 1.2 mm sheet
cols: Second moment of area, mm⁴ | Relative to a plain edge | What it does best
caption: This is an illustration. Plain and flanged edges include 30 mm of sheet. Wired edges are the wire plus a full ring of sheet around it, an upper estimate since the sheet does not quite close around the wire. Bend radii are ignored.
- Plain cut edge, 30 mm of sheet | 4.3 | 1 | Nothing; must be deburred
- Closed hem, 10 mm wide | 11.5 | 3 | A safe edge
- Wired edge, 3.15 mm wire | 47 | 11 | A safe, round, dent-resistant edge
- Wired edge, 4 mm wire | 82 | 19 | The same, a little stiffer
- *10 mm return flange | 277 | 64 | Stiffness, and an edge to clip to
- 15 mm return flange | 905 | 210 | More stiffness
```

The table settles one question that surprises people: **a wired edge is not a strong stiffener in bending**. A 4 mm wire wrapped in 1.2 mm sheet is a small solid round about 6.4 mm across, and it cannot match a flange that stands 10 or 15 mm up from the panel. What a wire does superbly is make an edge safe, round and resistant to local denting and kinking. That is why traditional ware, buckets, trays, pans and bins, was wired at the rim: the rim takes knocks, and the wire stops it denting and tearing. Hand Forming Sheet Metal by the Numbers sets out [wiring an edge by hand](/reados/publications/hand-forming-sheet-metal-by-the-numbers/wiring-and-edging-by-hand/), including on a curved rim. A flat panel's edge is better served by a return.

### Curls

A **curl** or rolled edge is a wired edge without the wire: the edge is rolled into a tube. It gives the same smooth round edge with less stiffness, since a thin-walled tube of 1.2 mm sheet about 8 mm across has an I of only a few tens of mm⁴. Curls are common on guards and on the edges of parts handled often, and they avoid the cost of the wire. On coated sheet, both curls and wired edges bend the coating around a small radius, so the coating's own bending limit, from the sheet supplier, should be checked.

## Sizing a wire allowance

Whatever an edge treatment's purpose, its flat blank must include the material that forms it. For a wired edge, the extra width beyond the finished edge is the **wire allowance**. The 1918 text gives two shop rules: for light sheet, add two and a half times the wire diameter; for heavier sheet, add twice the wire diameter plus four times the thickness. It also gives the best advice of all, which is to bend a narrow trial strip around the wire and measure. The chapter on [seams, edges and notches](/reados/publications/sheet-metal-patterns-by-the-numbers/seams-edges-and-notches/) in Sheet Metal Patterns by the Numbers tests the same rule against geometry for thin duct sheet; here the interest is what happens in heavier sheet.

A third estimate comes from geometry. The sheet wraps about three-quarters of the way round the wire before its edge tucks against the panel, and the length of sheet along its mid-thickness is three-quarters of a circle of diameter d + t:

```figure
type: formula
title: Three estimates of the wire allowance
formula: A ≈ 2.5 d     A ≈ 2d + 4t     A ≈ 0.75 π (d + t)
caption: This is an illustration for 1.2 mm sheet. The first two are traditional shop rules; the third is mid-thickness geometry for a three-quarter wrap. A trial strip settles the value for the actual wire, sheet and machine.
- d | Wire diameter, mm
- t | Sheet thickness, mm
step: For d = 3.15 mm: 7.9 mm, 11.1 mm and 10.3 mm
step: For d = 4.0 mm: 10.0 mm, 12.8 mm and 12.3 mm
```

The first rule ignores thickness, which is why the old text reserves it for light sheet. With 1.2 mm sheet, which is heavy by tin-plate standards, the second rule and the geometric estimate agree within about 1 mm, and the first rule is clearly short. That pattern is worth remembering: shop rules encode the conditions of the shop that wrote them, and they drift when the material changes. This is an illustration. A trial strip of SP-90's sheet wrapped round a 4 mm wire on the builder's wiring rolls measured 12.0 mm, between the two better estimates.

## Flanged openings and their corners

For SP-90's cable opening, the edge needs stiffness and something for the brush strip to clip onto. The natural choice is a **flanged opening**: the sheet inside the opening line is cut to a smaller hole, then the margin is bent up through 90° to form a flange around the opening. Along the straight sides this is an ordinary fold. At the corners it is something else.

At a corner of radius r, the flange's free edge starts in the flat blank at a radius r − h, inside the opening line, and ends after forming at radius r. Its circumference grows by the ratio r / (r − h), so the edge is **stretched**, and the strain is h / (r − h). That is the same arithmetic as a hole flange or a stretched flange on a curve, and it is the reason flanged openings crack at their corners.

```figure
type: bars
title: Stretch at the edge of a 10 mm flange around an opening corner
unit: %
max: 100
caption: This is an illustration, ignoring the bend radius, which reduces the strain slightly. Engineering strain h / (r − h). Compare with the elongation on the sheet's test certificate, and leave a margin for the cut edge, which stretches less well than the sheet's interior.
- Corner radius 20 mm | 100
- Corner radius 25 mm | 66.7
- Corner radius 50 mm | 25.0
- *Corner radius 75 mm | 15.4
- Corner radius 100 mm | 11.1
```

A cut edge is the weak point in a stretch. Its microscopic notches and the hardened or heated zone left by cutting start cracks at strains well below the elongation measured in a tensile test, which is taken on a specimen whose edges are machined. Punched edges are worse than laser cut ones, and deburred and smoothed edges better than either.

## The error: corners that split

This is an illustration. For the first redesigned SP-90, the designer specified a flanged cable opening with 10 mm flanges and kept the original 20 mm corner radii, to preserve as much opening as possible. The folding supplier formed the flange with a purpose-made tool on its press. All four corners of the first panel split from the flange's edge down towards the bend, and the zinc coating flaked around each split.

The arithmetic was done after the event: at a 20 mm radius, the flange's edge started at a 10 mm radius in the blank and was asked to grow to 20 mm, a strain of 100%. No zinc-coated structural sheet of the kind in the running case will stretch that far at a cut edge. The test certificate for the batch showed an elongation of about 25%, and the supplier advised staying well under that at a cut edge.

There were two ways out. The corners could be notched, leaving flanges on the four straight sides only, with the corners closed by small riveted plates or left open; that keeps the large opening but loses the flange's continuity at the corners, where the panel most needs support. Or the corner radius could be increased until the strain is safe. The designer chose a 75 mm corner radius, giving a corner strain of 15.4%, well inside the sheet's capacity with margin for the cut edge, and specified that the inner cut be smoothed before forming. With 75 mm radii, the 250 mm high opening keeps 100 mm of straight side, enough for the brush strip's clips. The second batch formed without splits.

The lesson recorded was that a flanged opening is a stretching operation at every convex corner, and that the corner radius must be chosen from the flange height and the sheet's stretch capacity, not from how the opening looks on the drawing. The designer added a check to the office's sheet metal checklist: for every flanged opening, the strain h / (r − h) at the tightest corner, compared with half the certificate elongation.

### Small round openings

The same arithmetic governs small round holes with a turned-up rim, which the old trades called burring and which modern shops call hole flanging or extruded holes. They are used for cable glands, for a smooth hose entry, and to give a thin panel enough thread length for a self-tapping screw.

This is an illustration. SP-90 also has a Ø40 mm entry for an air hose, finished with a short flange so that the hose cannot chafe on a cut edge. To end at a 20 mm radius with a flange 4 mm high, the pre-punched hole has a radius of 16 mm, and its edge is stretched by 4 / 16 = **25%**, as much as the sheet's whole certificate elongation and far too much for a punched edge. With a 3 mm flange, the pre-hole radius is 17 mm and the strain is 3 / 17 = **17.6%**, still more than half the elongation. The builder chose a 2 mm flange, a pre-hole of 18 mm radius and a strain of 11.1%, which formed cleanly, and fitted a rubber grommet for the hose, since a 2 mm rim is a smooth edge rather than a stiffener.

Two rules follow from the arithmetic. A given flange height is much easier to form around a large hole than a small one, because the strain is the flange height divided by the starting radius. And a punched pre-hole should be smoothed, or drilled and reamed, before flanging, because the punched edge's burr and sheared zone are where the split begins. Tooling suppliers publish limiting ratios of pre-hole to finished diameter for their materials, and those values, not a general rule, should set the design.

## Why opening corners crack anyway

Even unflanged, a sharp-cornered opening concentrates stress. In a plate under tension, a corner of small radius raises the local stress several times above the general level, and in a panel that drums or flexes with every extraction cycle, that raised stress cycles too. The original SP-90's crack, which started from a 10 mm corner of a plain opening, was a fatigue crack of this kind, driven by the panel's bowing and drumming rather than by any single large load.

The defence is the same as for the flange: generous corner radii, smooth cut edges, and a panel that does not flex much in the first place. A stiffened panel with small bays, as in Chapters 6 and 7, protects its openings as well as its appearance. Where an opening must be near an edge or a fixing, a doubler plate riveted around it restores some of the lost material and moves the free edge's stress away from the panel itself.

### Openings and the panel's stiffness

An opening of 400 × 250 mm in a 600 × 900 mm panel removes about 19% of the panel's area, and with it some of the panel's bending stiffness, but its main effect is local. The plate next to the opening behaves as if one edge were free, which raises local deflection and stress. A flange around the opening turns that free edge back into a stiffened one, so the panel's bays near the opening behave almost as if the opening were not there. On SP-90, the 10 mm flange around the opening, with I = 277 mm⁴ along each side, spans at most the 250 mm straight length of the top and bottom edges and stiffens the opening's edge enough that the brush strip's clips stay put.

## Exercise: wiring a swarf tray

The same enclosure has a shallow swarf tray with a wired rim, folded from 1.0 mm sheet with a 3.15 mm wire.

1. Estimate the wire allowance by the three methods.
2. Which would you trust before a trial strip, and why?

**Worked answer.**

1. 2.5 × 3.15 = **7.9 mm**. 2 × 3.15 + 4 × 1.0 = **10.3 mm**. 0.75 × π × (3.15 + 1.0) = **9.8 mm**.
2. The second rule and the geometric estimate agree within about half a millimetre and both account for the sheet's thickness, so either is a reasonable starting point, perhaps 10 mm. The first rule ignores thickness and was written for tin plate, which is much thinner than 1.0 mm, so it would leave the wire partly exposed. Before cutting a batch, the workshop should cut a strip at 10 or 11 mm, wire it on the actual rolls, and measure what was used, then adjust the blank. The traditional advice to try a strip first is the one part of the old rules that never goes out of date.
