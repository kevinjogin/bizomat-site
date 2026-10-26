---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: strip-layout-and-material-yield
order: 6
title: "Strip layout and material yield"
description: "Bridges, edge margins and pitch, MP-40's two possible orientations, 89.8% utilisation, the strip's cost per plate and per year, coil length, and a bridge cut too thin to carry the strip."
draft: false
---

For a part made in hundreds of thousands, the steel is often the largest single cost, larger than the press time, and the strip layout decides how much of it becomes product. A layout fixes how the blanks sit on the strip, how much metal is left between them and at the edges, which way the strip feeds, how far it advances each stroke and how wide it must be slit. Once the die is built, the layout cannot change, so it is settled on paper first. Hodgson made the same point in 1903: some ingenuity is needed to arrange successive cuts so that the scrap is the least possible.

This chapter sets out the parts of a layout, compares MP-40's two possible orientations, calculates its material utilisation, strip mass and cost per plate and per year, finds how many plates a coil makes, and ends with a bridge narrowed to save steel that cost far more in stoppages.

## The parts of a layout

A progressive die cuts parts from a continuous strip that it also uses to carry the parts from station to station. The strip must stay strong enough to be pushed or pulled through the die until the last station, so not all of it can be used.

- The **bridge**, or web, is the metal left between one blank and the next.
- The **edge margin** is the metal left between the blanks and the strip's edges.
- The **pitch**, or progression, is the distance the strip advances each stroke: the blank's length along the feed plus one bridge.
- The **strip width** is the blank's width across the feed plus two edge margins.
- The **skeleton** is what is left after the last station, the scrap.

Bridges and margins are usually set as a proportion of the sheet's thickness, with a minimum for thin sheet, and are larger for long blanks, for parts with features close to the edge, and for strips that must carry formed parts. A common starting range for blanking steel is a bridge of roughly one to one and a half thicknesses. For MP-40, as an illustration, the toolmaker uses:

- bridge: **2.0 mm**, equal to the thickness;
- edge margin: **2.5 mm**, a little more, because the strip's slit edges vary in width and straightness.

## Two ways to lay out MP-40

MP-40 is a simple rectangle, so the real choice is which way round it goes.

**Layout A: the 50 mm side along the feed.** Pitch 50 + 2.0 = **52 mm**. Strip width 80 + 2 × 2.5 = **85 mm**. Strip area per plate 52 × 85 = **4,420 mm²**.

**Layout B: the 80 mm side along the feed.** Pitch 80 + 2.0 = **82 mm**. Strip width 50 + 2 × 2.5 = **55 mm**. Strip area per plate 82 × 55 = **4,510 mm²**.

The blank's own area is the 80 × 50 rectangle less the corners cut away by its R6 radii: 4,000 − (4 − π) × 6² = **3,969.1 mm²**. Material utilisation is the blank's area divided by the strip area it uses:

- Layout A: 3,969.1 ÷ 4,420 = **89.8%**;
- Layout B: 3,969.1 ÷ 4,510 = **88.0%**.

Layout A wins because it has one bridge across the short side and margins along the long side; the bridges and margins together cost less metal when the bridge runs across the shorter dimension. The difference is 90 mm² per plate, small on one part and worth about 85 kg of steel a year at MP-40's volume. Layout A also has a shorter die, since three stations at 52 mm pitch take less room than three at 82 mm, and a shorter feed, which allows a faster stroke rate. Layout B's narrower strip would suit a press with a narrow feed, but MP-40's press has no such limit.

Counting the holes and slot as scrap too, the plate's finished area is 3,969.1 − 113.5 − 114.3 = 3,741.3 mm², so of every 4,420 mm² of strip, **84.6%** leaves as product.

```figure
type: compare
title: MP-40's strip layouts compared
rowhead: Layout
cols: Pitch, mm | Strip width, mm | Strip per plate, mm² | Blank utilisation | Finished part share
caption: This is an illustration with a 2.0 mm bridge and 2.5 mm edge margins. Blank area 3,969.1 mm²; finished part area 3,741.3 mm² after the holes and slot.
- * A, 50 mm side along the feed | 52 | 85 | 4,420 | 89.8% | 84.6%
- B, 80 mm side along the feed | 82 | 55 | 4,510 | 88.0% | 83.0%
- A with a 1.0 mm bridge and 1.5 mm margins | 51 | 83 | 4,233 | 93.8% | 88.4%
```

## The strip through the die

The strip layout drawing shows the strip as it looks after each station. For MP-40, in Layout A:

1. **Station 1, pierce.** The two Ø8.5 holes and the slot are pierced. The holes lie across the strip, on 60 mm centres either side of its centreline.
2. **Station 2, pilot.** One pitch later, two pilots enter the holes and pull the strip into exact position before anything else cuts. No metal is removed.
3. **Station 3, blank.** Two pitches after piercing, the outline is blanked around the holes and slot, and the finished plate falls through the die.

The strip advances 52 mm per stroke. Once the first strip has filled the die, every stroke pierces one plate, pilots another and blanks a third, so the die produces one plate per stroke. The first two strokes of every new coil produce no finished plate, because the strip has not yet reached station 3; the last two pitches of every coil are lost too, because the strip has run out before they are blanked.

Using the part's own holes as pilot holes is economical, since it needs no extra metal. Dies whose parts have no suitable holes pierce separate pilot holes in the skeleton, which needs wider margins.

```figure
type: svg
title: MP-40's strip in Layout A, from piercing to blanking
alt: A horizontal strip 85 mm wide feeding from left to right. At the left, station 1 shows two small round holes and a central slot freshly pierced. At station 2, one pitch of 52 mm to the right, the same features with two pilots marked in the holes. At station 3, another pitch to the right, a rounded rectangle 80 by 50 mm is shown as an opening where the plate has been blanked out. Dimensions mark the pitch, the bridge of 2.0 mm and the edge margins of 2.5 mm.
caption: This is an illustration, not to scale. The strip feeds left to right; the holes are pierced at station 1, used to locate the strip at station 2, and the outline is blanked at station 3. Every stroke advances the strip 52 mm.
viewbox: 0 0 640 300
body:
<path class="ln" d="M20 60H620"/>
<path class="ln" d="M20 240H620"/>
<text class="tx txs" x="24" y="52">strip 85 mm wide, feeding to the right</text>
<path class="bx" d="M80 72H190Q196 72 196 78V222Q196 228 190 228H80Q74 228 74 222V78Q74 72 80 72Z"/>
<circle class="li" cx="135" cy="86" r="9"/>
<circle class="li" cx="135" cy="214" r="9"/>
<path class="li" d="M128 134H142V166H128Z"/>
<text class="txb" x="100" y="282">station 1: pierce</text>
<path class="bx" d="M266 72H376Q382 72 382 78V222Q382 228 376 228H266Q260 228 260 222V78Q260 72 266 72Z"/>
<circle class="la" cx="321" cy="86" r="9"/>
<circle class="la" cx="321" cy="214" r="9"/>
<path class="li" d="M314 134H328V166H314Z"/>
<text class="txb" x="282" y="282">station 2: pilot</text>
<path class="la draw" pathLength="1" d="M452 72H562Q568 72 568 78V222Q568 228 562 228H452Q446 228 446 222V78Q446 72 452 72Z"/>
<text class="txa" x="470" y="155">blank out</text>
<text class="txb" x="460" y="282">station 3: blank</text>
<path class="ln dsh" d="M196 40V250"/>
<path class="ln dsh" d="M260 40V250"/>
<text class="tx txs" x="200" y="36">bridge 2.0</text>
<text class="tx txs" x="400" y="36">pitch 52</text>
<text class="tx txs" x="580" y="70">margin 2.5</text>
```

## What the strip costs

This is an illustration. The shop buys coil slit to 85 mm at an illustrative **A$1.60 per kilogram excluding GST**, A$1.76 including GST, and steel's density is taken as 7,850 kg/m³, which is 7.85 × 10⁻⁶ kg per cubic millimetre.

- Strip per plate: 4,420 mm² × 2.0 mm = 8,840 mm³, which weighs **0.0694 kg**.
- Strip cost per plate: 0.0694 × 1.60 = **A$0.111**, excluding GST.
- Finished plate's mass: 3,741.3 × 2.0 × 7.85 × 10⁻⁶ = **0.0587 kg**.
- Scrap per plate: 0.0694 − 0.0587 = 0.0107 kg, which a scrap merchant might buy back at an illustrative A$0.30/kg, a credit of about A$0.003 per plate.
- Strip for a year's 60,000 plates: about **4,164 kg**, or **A$6,662** excluding GST.

Layout B would have used about 4,248 kg, roughly 85 kg and A$136 a year more. Those figures look small against a die that costs tens of thousands of dollars, but they recur every year the part is made, and on a larger part, or a dearer material such as stainless steel or brass, the same comparison can be worth more than the die.

```figure
type: bars
title: Steel bought for a year's 60,000 MP-40 plates, by layout
unit: kg
max: 4500
caption: This is an illustration at 7,850 kg/m³ and 2.0 mm thickness, excluding coil-end losses. The thin-bridge layout looks cheapest on paper; the error below explains why the shop does not use it.
- * Layout A, 2.0 mm bridge | 4164
- Layout B, 80 mm side along the feed | 4248
- Layout A, 1.0 mm bridge | 3987
- Finished plates themselves | 3524
```

## Coils, slitting and the ends

Strip comes as slit coil, and the coil's size sets how often the press stops to change it.

This is an illustration. A 1,000 kg coil of 85 × 2.0 mm strip weighs 85 × 2.0 × 7.85 × 10⁻⁶ = 0.00133 kg per millimetre of length, so it is about **749 m** long and makes 749,344 ÷ 52 = about **14,400 plates**, less the four pitches lost at its two ends. A batch of 5,000 plates uses about a third of a coil. Coil changes, and the partly used coils between batches, are part of the cost of the layout that a per-plate calculation leaves out.

Slit strip is never exactly the width ordered, nor perfectly straight. Slitters work to a width tolerance, and slit edges have **camber**, a gentle curve along the strip's length. The die's stock guides must allow for the widest strip and the camber, and the edge margins must be wide enough that the narrowest strip still has metal outside the blank. MP-40's 2.5 mm margins, half a millimetre more than its bridge, are there for that reason.

## Coil set and flatness

Strip wound into a coil keeps some of the coil's curvature when it is unwound, called **coil set**, and the curvature is tighter near the coil's centre, where the radius of winding is smallest. Strip with coil set enters the die bowed, lifts off the die face between stations and can feed unevenly. A blank cut from bowed strip may also keep a little of the bow, which matters for a part like MP-40 that must sit flat against a bracket.

Coil lines deal with it by running the strip through a **straightener**, a set of staggered rolls that bend the strip back and forth with decreasing amplitude until it comes out flat. The straightener is set for the material and thickness, and needs resetting as the coil is used up and its set tightens. The spring stripper helps too, by clamping the strip flat against the die face at the moment of cutting (Chapter 5).

For MP-40, the drawing's flatness requirement is checked at first-off inspection (Chapter 8) and again on the last plates of each coil, from the tightly wound inner wraps, where coil set is worst. If those plates fail and the first ones pass, the straightener's setting, not the die, is the first thing to look at.

## Keeping hands out

A coil-fed progressive die is also a safety measure. WorkSafe Western Australia's guidance on power presses gives priority to tooling and stroke limits that prevent access to the tool, and to automatic feeding, ahead of guards that rely on interlocks. With strip fed from a coil, nobody needs to put a hand near the tool to load a part. The strip layout should keep it that way: parts and slugs should fall clear through the die and press bed, not need picking out, and the strip should thread without the setter reaching into the closing tool.

## The error: a bridge cut too thin

This is an illustration. A year into production, a cost review proposed cutting MP-40's bridge from 2.0 to 1.0 mm and its edge margins from 2.5 to 1.5 mm. The pitch would fall to 51 mm and the strip width to 83 mm, giving 4,233 mm² per plate and a utilisation of **93.8%**. On paper that saved 4.2% of the steel, about A$0.0047 per plate or **A$282 a year**. A new die was not needed for the narrower strip, only re-set stock guides, but the change to pitch needed a new pilot station and blanking insert, at an illustrative A$4,600.

A trial strip with a temporary insert showed the problem in the first coil. The 1.0 mm bridges, half the sheet's thickness, were too weak to carry the strip under the feed's push and the blanking punch's drag. The skeleton twisted between stations, the pilots met holes out of line, and the strip broke twice in 2,000 strokes. Where the bridge was thinnest, the blanking punch pulled the edge of the skeleton into the die and left a rough, partly torn edge on the plate.

The review's figure counted the steel and nothing else. Two stoppages per 2,000 strokes, each costing twenty minutes of press and setter time, would cost far more than A$282 a year at MP-40's volume, before counting damaged pilots and rejected plates. The shop kept Layout A with its 2.0 mm bridge. Its layout rule now says that bridges and margins are not reduced below the thickness on a carrier strip without a trial, and that any saving is weighed against the press time a trial shows it costs.

```figure
type: checklist
title: Strip layout checks before a progressive die is designed
caption: The layout is fixed once the die is built, so these are settled on paper first.
- Both orientations compared for utilisation and die length | A, 89.8%, against B, 88.0%
- Bridge and margins suited to thickness and slit tolerance | 2.0 mm bridge, 2.5 mm margins
- Pilots located in holes the part already needs | the two Ø8.5 holes
- Strip cost per part and per year calculated | A$0.111 a plate; A$6,662 a year
- Parts and slugs fall clear, with no hand near the tool | through the die and bolster
- x Bridge halved to save steel without a trial | strip broke twice in 2,000 strokes
```

## Exercise: a two-up layout

A second plate, MP-25, is 50 × 25 mm with R4 corners, in the same 2.0 mm steel, also needed at 60,000 a year. Compare a one-up layout with the 25 mm side along the feed and a two-up layout with two plates side by side across a wider strip, using a 2.0 mm bridge between plates in both directions and 2.5 mm edge margins.

**Worked answer.** The blank's area is 50 × 25 − (4 − π) × 4² = 1,250 − 13.7 = **1,236.3 mm²**.

- One-up: pitch 25 + 2 = 27 mm; width 50 + 5 = 55 mm; strip per plate 27 × 55 = **1,485 mm²**; utilisation **83.3%**.
- Two-up: pitch still 27 mm; width 2 × 50 + 2 + 5 = 107 mm; strip per stroke 27 × 107 = 2,889 mm², or **1,444.5 mm²** per plate; utilisation **85.6%**.

The two-up layout saves 40.5 mm² per plate, about 2.7% of the steel, because the two plates share a bridge in place of two margins, and it makes two plates per stroke, halving the press time. Against that, the die is wider and dearer and needs a press with a wider feed and bolster. Small parts at high volume are often run two-up or more for the press time alone.
