---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: profiles-girth-and-stretch-out
order: 1
title: "Profiles, girth and stretch-out"
description: "Describe a folded building profile by its points, calculate its girth and stretch-out, size the blank and the coil width, and measure the building so the profile actually fits."
draft: false
---

Every piece of architectural sheet metal starts as a flat strip that is folded into a profile: a coping, a fascia, a barge capping, a flashing. The profile is the shape you would see if you cut through the finished piece at right angles to its length. Two numbers about it matter before anything else. The **girth** is the width of flat strip needed to fold it, and the **stretch-out** is the girth laid out as a straight line with each fold marked along it. Get the girth wrong and every length cut is scrap. Get the stretch-out right and it becomes the base line for every mitre and pattern in the chapters that follow.

This chapter describes W-40's two main profiles, the canopy fascia and the parapet coping, by their points, calculates their girths and stretch-outs, sizes the blanks and the coil they are cut from, and deals with the gap between a drawing and the building it must fit. The failure case is a coping folded to the nominal width of the parapet, which did not fit the parapet as built.

## Describe a profile by its points

A profile is easiest to handle as a list of points, each with two coordinates. This book uses **d**, the projection: the horizontal distance of the point out from the wall or board the profile is fixed to; and **h**, the height of the point above the profile's lowest edge. Each fold is a point; each flat between folds is a straight segment joining two points.

W-40's canopy fascia is a profiled cover over the canopy's edge beam, with a top flange that sits on the beam, a vertical face, a 45° bevel and a lower face with a small bevelled drip. Its six points are listed in the table below, from A at the top back to F at the bottom.

```figure
type: svg
title: W-40's canopy fascia profile, drawn at half scale
alt: A folded profile drawn against a vertical dashed line representing the fixing board. From point A at the top of the board, a short top flange runs out to B, drops to C, runs diagonally down and out at 45 degrees to D, drops in a long vertical face to E, and finishes with a short diagonal back to F at the bottom. Labels give each point's projection and height, from A at 0 and 250 to F at 70 and 0.
caption: This is an illustration. Each point is given as projection d from the board and height h above the lowest edge, in millimetres. The profile's girth is the sum of the five segments.
viewbox: 0 0 640 330
body:
<path class="ln dsh" d="M80 20V310"/>
<text class="tx txs" x="20" y="320">fixing board</text>
<path class="la draw" pathLength="1" d="M80 40H160V80L260 130V260L220 290"/>
<text class="txa" x="64" y="34">A 0, 250</text>
<text class="tx txs" x="168" y="36">B 40, 250</text>
<text class="tx txs" x="168" y="84">C 40, 210</text>
<text class="tx txs" x="270" y="134">D 90, 160</text>
<text class="tx txs" x="270" y="264">E 90, 30</text>
<text class="tx txs" x="160" y="304">F 70, 0</text>
<text class="tx txs" x="360" y="80">AB 40.0</text>
<text class="tx txs" x="360" y="104">BC 40.0</text>
<text class="tx txs" x="360" y="128">CD 70.7, at 45°</text>
<text class="tx txs" x="360" y="152">DE 130.0</text>
<text class="tx txs" x="360" y="176">EF 36.1</text>
<text class="txa" x="360" y="210">girth 316.8 mm</text>
```

## Girth: the sum of the flats

Each segment's length is found from the differences in d and h between its two points, by Pythagoras. A horizontal segment's length is its change in d; a vertical one's is its change in h; a sloping one needs both.

```figure
type: formula
title: Girth of the canopy fascia
formula: segment length = √((d₂ − d₁)² + (h₂ − h₁)²)        girth = sum of all segment lengths
caption: This is an illustration for W-40's fascia, using the point coordinates in millimetres. The bevel CD drops 50 mm while moving out 50 mm, so it is 50 × √2 ≈ 70.7 mm.
- AB, top flange | 40 − 0 = 40.0 mm
- BC, upper face | 250 − 210 = 40.0 mm
- CD, 45° bevel | √(50² + 50²) ≈ 70.7 mm
- DE, main face | 160 − 30 = 130.0 mm
- EF, drip bevel | √(20² + 30²) ≈ 36.1 mm
step: girth = 40.0 + 40.0 + 70.7 + 130.0 + 36.1 ≈ 316.8 mm
```

For thin sheet, 0.55 mm here, folded to tight inside radii, the difference between measuring along the outside, the inside or the middle of the metal is a fraction of a millimetre at each fold, and the sum of the flats measured to the profile line is close enough for cutting. For thicker material and larger radii, the bend allowance at each fold matters and is worked out from the material's K-factor, as *Sheet Metal Parts by the Numbers* explains. Whichever method is used, it is used consistently, and checked with a test fold, as this chapter's last sections describe.

## The stretch-out

The stretch-out is the girth laid flat, with each fold's position marked as a running distance from one edge. For the fascia, measured from A:

- A at **0**;
- B at **40.0**;
- C at **80.0**;
- D at **150.7**;
- E at **280.7**;
- F at **316.8**, the far edge.

These are the fold lines on the flat blank, and the folding sequence in the brake works from them. They are also the base line for mitres: in Chapter 2, each point's position along the stretch-out becomes a station at which a cut ordinate is measured. Writing the stretch-out as a table of running distances, rather than as a drawing, makes it exact and easy to check.

## The parapet coping

W-40's parapet is **200 mm** thick. Its coping covers the top with a flat that falls **10 mm** across its width towards the roof side, so that rain on the coping runs into the box gutter rather than down the street facade. The coping has a **100 mm** leg down the street face, a **75 mm** leg down the roof face, and a **15 mm** drip kicked out at the foot of each leg, so that water drips clear of the wall rather than running down it.

The top flat spans **240 mm** horizontally, the parapet's 200 mm plus 20 mm clearance each side for render variations and the legs' fixing, and drops 10 mm across that span. Its length is **√(240² + 10²) ≈ 240.2 mm**. The coping's girth is therefore about **100 + 240.2 + 75 + 15 + 15 ≈ 445.2 mm**.

## Size the blank and the coil

Profiles are cut from coil slit to a width, or from flat sheet. The girth, plus any trimming allowance, sets the blank width, and the coil width decides how many blanks come from each width and how much is wasted.

```figure
type: compare
title: Cutting the 445.2 mm coping blank from two coil widths
cols: Blanks across the width | Offcut per metre length | Waste
caption: This is an illustration. Slit coil is ordered to a width; buying a width that suits the profile can cut waste dramatically. Offcuts of a useful width can still serve as small flashings.
- 1,200 mm coil | 2 | about 310 mm | about 26% of the coil
- *900 mm slit coil | 2 | about 10 mm, the trim | about 1%
- 1,200 mm coil with a 300 mm flashing nested beside | 2 copings and 1 flashing | about 10 mm | about 1%, if the flashing is needed
```

The fabricator ordered 900 mm slit coil for the copings, cutting two blanks across each width with a trim strip, and kept the 1,200 mm coil for the fascia, which, at 316.8 mm, fits three across with about 250 mm left for apron flashings.

## Hems, drips and safe edges

Profiles are rarely just bare flats. A **hem**, the edge folded back on itself, stiffens a free edge, hides a cut edge and makes it safe to handle. A **drip**, a short outward kick, throws water clear of the surface below. A **return**, a short flange turned back towards the wall, lets a leg be clipped or fixed without fasteners through its face. Each adds to the girth, and each must be counted. A coping drawn without its drips, and cut to that girth, comes out 30 mm short and is useless.

They also affect the folding sequence. Hems are folded first, while the strip is flat; closed profiles are folded in an order that lets the brake's blade clear the flanges already folded. A profile that looks right on paper but cannot be folded on the shop's brake is redrawn before anything is cut. The fabricator checked each W-40 profile against the brake's tooling and folding sequence at the drawing stage.

## Measure the building, not just the drawing

Buildings are not built to the millimetre. A rendered parapet drawn at 200 mm may vary by 10 mm or more along its length, and may be out of straight and out of level. A coping that fits the drawing may not fit the wall.

The fabricator's site measurer took the parapet's actual width every 3 m along its length and at every corner, its line along the top with a string, and its level with a laser. The widths ranged from **198 mm to 214 mm**. The coping's 240 mm top, with 20 mm clearance either side of the nominal 200, could accommodate them, with the legs fixed over packers where the gap was large. Site measuring is work at height, done from the roof walkway or a platform behind the parapet, under the same fall-protection arrangements as the roofing work.

## Test-fold the first piece

Before cutting a batch, the fabricator folded one short length of each profile and checked it against the drawing and against the building. Each flat was measured with a rule, each angle with a protractor, and the overall girth by unfolding a scrap offcut cut at the same time. The fascia's test piece was held up to the canopy edge beam, and the coping's to the parapet at its widest and narrowest measured points. Only then were the full lengths cut. A short test piece costs a few dollars; a batch cut to the wrong girth costs the coil.

## Tolerances on a folded profile

A folded profile cannot be made exactly. The slitter cuts the coil within a tolerance on width, the brake positions each fold within a tolerance, and each fold springs back slightly from the angle the brake forms. On a profile with five folds, small errors accumulate along the stretch-out, so the last flat absorbs the sum of them. On the fascia, a 1 mm error at each of four fold positions could leave the drip bevel EF up to 4 mm longer or shorter than drawn.

The drawing should therefore say which dimensions matter. On the fascia, the faces seen from the street, BC and DE, and the projection to D and E, are critical; the hidden top flange AB and the drip EF can absorb small differences. The fabricator folds from the edge that matters most, measures the critical flats on the first piece, and lets the least visible flat take up the remainder.

## Record the profile

Every profile the shop makes is recorded once, in a profile register, so that a repeat order or a matching repair years later uses the same numbers. Each W-40 entry holds the point list in d and h, the segment lengths and girth, the stretch-out table, the material and thickness, the coil width and blanks across it, the folding sequence on the shop's brake, and the test-fold and site measurements it was checked against. An entry takes a quarter of an hour and saves redrawing the profile, and repeating its mistakes, every time it is needed again.

## Allow for laps and joints along the length

Girth is the width of the blank; length is the other dimension. Profiles are cut in lengths that suit the coil, the brake and handling: W-40's brake folds up to 4 m, and the copings are made in 3.2 m blanks so each finished length laps 100 mm over the next and still covers 3.1 m of parapet. Over the 40 m parapet, that means **13** lengths: twelve full lengths covering 37.2 m and a last one trimmed to cover the remaining 2.8 m, plus the corner pieces developed in the next chapters. Counting lengths and laps at the profile stage gives the take-off its quantities and tells the site crew how many joints to expect and where, so joints can be kept clear of downpipes, signs and other features on the facade.

## A failure case: the coping that would not sit

This is an illustration. On an earlier job, the same fabricator received a drawing for a parapet coping with a 200 mm top flat for a 200 mm parapet, with legs fixed tight against each face. Nobody measured the building. The copings were cut and folded in a batch of thirty 3 m lengths.

On site, the first length would not sit down over the parapet. The render had been built out unevenly, and in places the parapet was 212 mm wide. Where it was narrower, the coping sat down but rocked. Every length was useless.

The detection came at the first dry fit on site, which at least happened before anything was fixed. The investigation found that the drawing had given the parapet's nominal width and that no site measure had been taken. The correction was to measure the parapet every 3 m, redesign the coping with a wider top and clearance to suit the widest point, and re-cut the batch. The fabricator's procedure now requires a site measure, and a test piece checked on site, before any coping or capping is cut in quantity.

## How this applies to a small Australian business

Describe every profile by its points, calculate the girth from the segment lengths and include every hem, drip and return. Write the stretch-out as a table of running distances. Order coil widths that suit the girths you cut most, and nest small flashings in the offcuts. Check that each profile can be folded on your brake in a workable sequence. Measure the building, not the drawing, and test-fold the first piece and try it against the building before cutting the batch. These habits cost minutes and save coils.

## Exercise: the barge capping

A simple barge capping for W-40's canopy gables has a 120 mm leg down the gable face, a 150 mm top that falls 15 mm across its width, a 60 mm leg down the roof side and a 12 mm hem on each leg. What is its girth? From 1,200 mm coil, how many blanks fit across the width and what is the offcut?

**Worked answer.** The top flat is **√(150² + 15²) ≈ 150.7 mm**. The girth is **120 + 150.7 + 60 + 12 + 12 ≈ 354.7 mm**. From 1,200 mm coil, **three** blanks fit across the width, using about **1,064.2 mm**, leaving an offcut of about **135.8 mm**, which is wide enough to fold small stopends or soakers rather than being scrapped.
