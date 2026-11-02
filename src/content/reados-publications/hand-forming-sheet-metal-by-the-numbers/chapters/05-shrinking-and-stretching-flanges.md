---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: shrinking-and-stretching-flanges
order: 5
title: "Shrinking and stretching curved flanges"
description: "Work out how much a flange on a curve must shrink or stretch, plan it as shrinker bites or tucks, compare a two-piece ring, and catch a flange folded over by bites taken too large."
draft: false
---

A straight flange is a fold. A flange on a curve is something more. Turn a flange inwards around the inside of a ring and its free edge must end up shorter than its root; turn it outwards and its edge must end up longer. The difference is a strain that the flange's metal has to take, and it is the same arithmetic as a flanged hole or a flanged opening corner in pressed work. By hand, the strain is put in a little at a time, with a shrinker or stretcher, with tucks, or with a hammer.

This chapter works out the strain in HF-01's mounting ring flange, plans how to shrink it with a hand shrinker and how many bites that takes, compares the traditional tucking method and a two-piece alternative, and records what happened when the bites were taken too large.

## The strain in a curved flange

A flange of height h standing on a curve of radius R has its root on the curve and its free edge at radius R − h if it is turned inwards, or R + h if it is turned outwards. Made from a straight strip, every fibre of the flange started with the same length; after forming, the edge's length is set by its radius. The edge's strain is therefore:

```figure
type: formula
title: Strain at the edge of a flange on a curve
formula: ε = −h / R (turned inwards, shrink)     ε = +h / R (turned outwards, stretch)
caption: This is an illustration for HF-01's ring, ignoring the sheet thickness and bend radius, which change the result by a few tenths of a per cent. R is the radius of the flange's root.
- h | Flange height, 20 mm
- R | Radius of the flange root, 160 mm
step: Edge strain, inward flange = −20 / 160 = −12.5%
step: Edge length: 2π × 140 = 879.6 mm, against 2π × 160 = 1,005.3 mm at the root
step: Length to take out of the edge = 2π × 20 = 125.7 mm
```

The strain falls to zero at the flange's root and is greatest at its edge, varying in proportion to the distance from the root. A deeper flange or a tighter curve means more strain; doubling the flange height doubles it.

### The running case: HF-01's ring

This is an illustration. The ring is a band 30 mm high and 320 mm inside diameter, with a 20 mm flange turned inwards at its top, on which the dome's rim sits and is riveted. The bottom edge of the band is wired, which Chapter 7 covers. The workshop's method is:

1. Cut a straight strip wide enough for the 30 mm band, the 20 mm flange and the wire allowance, with bend allowance for the one fold between band and flange; the KEVOS® [bend allowance calculator](/tools/bend-allowance/) gives the fold's share.
2. Wire the bottom edge while the strip is straight.
3. Fold the flange to 90° on the folder, making a straight angle section.
4. Curve the angle into a ring by **shrinking the flange's edge**, a little at a time along its length, which bends the band around without stretching or shrinking it.
5. Close the ring with a 12 mm riveted lap.

The band's length at its mid-thickness is π × 321.6 = 1,010.3 mm, so the strip is cut about 1,022 mm long with the lap. The flange's edge must lose 125.7 mm of that length, 12.5%, and thicken as it does, from 1.6 mm towards about 1.8 mm at the very edge.

## The hand shrinker

A hand shrinker has two pairs of serrated jaws. The flange is placed between them and a lever closes them, gripping the metal on either side of a short length and pushing the two grips towards each other, so that the metal between is upset and shortened. The stretcher works the same way in reverse, gripping and pulling apart. Each closing of the lever is a **bite**.

A bite takes up a small, roughly fixed amount of length, which depends on the tool, the metal and the operator's pressure. It must be measured, not assumed. This is an illustration. The workshop tried its shrinker on an offcut of the same angle: ten bites at the edge took up about 8 mm, an average of 0.8 mm per bite with moderate pressure, without the flange buckling.

```figure
type: stats
title: Shrinking HF-01's ring flange with a hand shrinker
caption: This is an illustration. Take-up per bite from a trial on an offcut; jaws about 25 mm wide. Bites are spread evenly round the ring, a pass at a time, and the ring is checked against a template between passes.
- 125.7 mm | Length to take out of the flange edge | 12.5% of the root length
- 0.8 mm | Average take-up per bite | measured on an offcut
- *157 bites | Total, about 4.5 passes | 35 jaw positions per pass
```

At 25 mm per jaw position, there are about 880 / 25 = 35 positions around the finished edge, so 157 bites is about four and a half passes round the ring. Each pass curves the angle a little more. Between passes the worker lays the ring on a full-size drawing of the 320 mm circle and checks its curve, and planishes the flange flat on a stake, because shrinking leaves it slightly dished.

Spreading the bites evenly is the important skill. Shrinking one part of the flange more than another bends the ring to a smaller radius there and leaves it flat elsewhere, and a ring with uneven curvature will not sit round under the dome. The worker marks the jaw positions round the flange with a marker before starting, so each pass visits each one.

Serrated jaws grip well and leave a textured mark at every bite. On HF-01's ring the flange is hidden under the dome's rim, so the marks do not matter. On visible work, the marks are either planished out afterwards, which takes time and slightly undoes the shrink, or avoided with smooth-faced jaws, which grip less firmly and take up less per bite. Either way, the bite size measured on an offcut should be measured with the jaws that will be used on the job.

### Tucking

Before shrinkers, the same flange was shrunk by **tucking**. A tucking fork, a bar with a slot, is used to twist small folds, or tucks, into the flange edge at intervals. Each tuck holds a little surplus length. The tucks are then hammered down onto a stake, from the closed end of each tuck towards the edge, so that the fold's material is upset into thickness rather than flattened into a lap.

This is an illustration. With tucks every 30 mm round the 880 mm edge, about 29 tucks are needed, each taking up 125.7 / 29 = 4.3 mm. That is a lot for one tuck in 1.6 mm sheet, and the workshop would make the tucks smaller and do the job in two rounds, annealing between them. Tucking needs no machine, leaves fewer marks than serrated jaws, and suits work too large or too awkward for a shrinker's throat. It is slower, and each tuck is a place where a careless blow can fold the metal over.

### Heat shrinking

Steel panels are often shrunk locally by heating a small spot red hot and quenching it, so that the spot upsets as it is restrained by the cold metal around it. The method is used for removing local stretch from panels. It is far less suited to soft aluminium, which shows no colour when hot, conducts heat away quickly and can be damaged by overheating. The workshop does not heat-shrink HF-01's aluminium.

## The error: bites too large

This is an illustration. The first ring was shrunk by a second worker who wanted to finish in fewer passes and set the shrinker to bite hard, taking up about 2 mm per bite. After the first pass, three places on the flange had buckled beside the jaws into a small, steep wave; on the second pass, the worker bit across one of those waves, which folded over and was flattened by the jaws into a lap about 6 mm long running in from the edge.

A lap is a crack-like defect that cannot be planished out. In the ring's flange it would sit directly under the dome's rivets. The ring was scrapped, at a cost of the strip and about an hour and a half.

The workshop's trial had already said why. A bite large enough to take 2 mm from a 25 mm length of 1.6 mm sheet is asking that short length to shorten by 8% in one squeeze, and the metal beside the jaws, which is not gripped, takes the easier route of buckling. At 0.8 mm per bite, about 3% each time, the metal thickened instead. The shrinker's instructions now include the measured bite size for each sheet thickness the workshop uses, and the rule that a wave seen beside the jaws is eased flat on a stake before the next bite, never bitten across.

## Stretching instead

The ring's flange could have been turned outwards instead, with the dome sitting on a ledge outside the band. Its edge would then be at radius 180 mm and would need to **stretch** by 20 / 160 = 12.5%, using the stretcher jaws or by hammering the flange edge thin on a flat stake.

Stretching and shrinking fail differently. A shrunk flange that is pushed too far wrinkles and laps, which the worker can see coming. A stretched flange that is pushed too far splits from its edge, often suddenly, and a split almost always starts at a nick, a burr or a scratch in the cut edge. The batch certificate's elongation of 30% is measured on a smooth-edged test strip. For a hand-stretched flange edge, the workshop works to no more than half of it, 15%, and files and smooths the edge before stretching. HF-01's outward flange, at 12.5%, would sit inside that limit, but with less margin than the shrunk version has against wrinkling, which is one reason the drawing turns it inwards.

```figure
type: decision
title: Choosing how to form a curved flange by hand
question: Does the flange's edge need to get shorter or longer?
- Shorter (flange turned towards the curve's centre) | Shrink with jaws, tucks or a raising hammer | Watch for waves; take small bites; planish between passes
- Longer (flange turned away from the centre) | Stretch with jaws or by thinning the edge on a stake | Smooth the edge first; keep the strain well under the elongation
- *Strain over about 15% either way, or a very deep flange | Make it in two pieces | A flat ring joined to a plain band avoids the strain entirely
- Very small radius for the flange height | Change the design | The strain h / R grows quickly as R falls
```

## A two-piece alternative

Instead of shrinking a flange, the ring could be made from a plain rolled band and a flat annulus, a washer-shaped ring 320 mm outside and 280 mm inside, joined by a small angle or by rivets through a short lip. No metal is shrunk or stretched; every part is either rolled or flat.

The two-piece ring is easier to make accurately and needs less skill. It needs more parts and fasteners, and the annulus is cut from a square of sheet with a large hole in the middle, which wastes metal. For HF-01's two rings, the one-piece ring's shrinking is about an hour per ring once the method is proven, and the workshop kept it. For a deeper flange, a tighter curve or a harder material, the two-piece ring is often the better answer.

## Checking the ring

The ring must do three things: be round, so that the dome fits it; have a flat flange, so that the dome sits on it without rocking; and close at its lap without a step. Each has a simple check.

**Roundness.** The workshop measures the inside diameter at four positions 45° apart with an internal rule or a pair of inside calipers and a rule. This is an illustration. HF-01's first good ring measured 319.0, 320.5, 321.0 and 319.5 mm, a spread of 2.0 mm about a mean of 320.0 mm. A ring that is out of round by more than the dome's rim tolerance is corrected by a few extra bites where it is too flat, which tightens the curve there, before the lap is riveted. After riveting, corrections are much harder.

**Flatness of the flange.** The ring is placed flange-down on a flat plate and the gap under the flange read with feeler gauges round its circumference. Shrinking leaves the flange slightly dished, raised at its edge; planishing between passes keeps that small, and a final pass of light planishing on a flat stake brings it within the workshop's 0.5 mm.

**Fit with the dome.** The trimmed dome is sat on the ring before any rivet holes are drilled. It should seat all round with no rocking and an even overlap on the flange. A dome whose rim is a millimetre or two out of round can usually be eased to the ring; a ring that is out of round is easier to correct than a dome, which is one more reason to check the ring first.

The checks take about ten minutes per ring. Their results go on the job sheet beside the bite count and any anneals, so that the next ring of a similar size can be planned from the workshop's own numbers.

## Exercise: a narrower flange

The customer asks whether the flange could be 15 mm instead of 20 mm.

1. What is the edge strain, the length to take out and the number of bites at 0.8 mm per bite?
2. What difference does it make to the job?

**Worked answer.**

1. Strain −15 / 160 = **−9.4%**. Length to take out 2π × 15 = **94.2 mm**. Bites 94.2 / 0.8 = **118**, a little over three passes, since the edge is now at radius 145 mm and about 911 mm long, which is about 36 jaw positions per pass.
2. About a quarter fewer bites and less thickening at the edge, so a little quicker and lower risk. But the flange is what the dome sits on and is riveted through: the dome's rim at 160 mm radius and the rivets need enough flange width inside the band for edge distance. A 15 mm flange leaves less room for rivets and less tolerance if the dome's rim comes out a little small. The decision belongs with the drawing's owner; the workshop's job is to show that both widths are makeable and what each costs.
