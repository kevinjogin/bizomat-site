---
book: ductwork-by-the-numbers
chapterSlug: round-and-rectangular-equivalents
order: 2
title: "Round and rectangular equivalents"
description: "Convert round and rectangular ducts by equal area, hydraulic diameter or the Huebscher diameter, know which a dust duct needs, and catch a comfort-duct habit that slowed the air."
draft: false
---

Round duct is the most efficient shape: it has the least wall for its area, so the least friction, and it is stiff, cheap to make on a spiral or rolling machine, and easy to seal. But buildings are full of beams, ceilings and services that leave only a shallow space, and a round duct that will not fit must become a rectangle or an oval for part of its run. The question is what size of rectangle is "equivalent" to the round duct, and there are three different answers depending on what must stay the same.

This chapter sets out equal-area, hydraulic-diameter and equal-friction equivalents, shows which one an extraction duct needs, and covers aspect ratio and square ducts. The running case converts part of EX-1's 250 mm main to a rectangle to pass under a mezzanine, and finds that the conversion the drafter knew from air-conditioning work made the air too slow.

## Equal area

The oldest rule, and the one older sheet metal texts teach, makes the rectangle's area equal to the round duct's. With the same flow, equal area gives equal **velocity**. For EX-1's 250 mm main, with an area of π × 0.25² ÷ 4 = 0.04909 m², a rectangle 160 mm deep must be 0.04909 ÷ 0.16 = **306.8 mm** wide, which the fabricator would make 310 mm.

Equal area is the right rule when velocity is what matters, as it is for a dust duct with a transport velocity. It is the wrong rule when pressure loss is what matters, because a rectangle of the same area has more wall than a circle and so more friction.

## Why a rectangle has more friction

Friction comes from the wall, and a rectangle has more wall for its area than a circle. The 250 mm round duct has a perimeter of π × 250 = **785 mm**. The equal-area 160 × 310 mm rectangle has a perimeter of 2 × (160 + 310) = **940 mm**, about 20% more, for practically the same area. Every metre of the rectangle therefore drags on the air along 20% more wall, and its corners add slow-moving pockets where the velocity falls well below the average.

Those corners matter more in an extraction duct than the friction does. Dust settles first where the air is slowest, and in a rectangular duct the slowest air is in the bottom corners. A rectangle running at an average of 18.15 m/s has corner zones moving much more slowly, and a round duct at the same average has none. That is a second reason, beyond friction, why dust ducts are made round wherever they can be, and why a rectangular section in an extraction system should be short, horizontal for as little of its length as possible, and fitted with an access door for cleaning.

## Hydraulic diameter

The friction a duct's wall exerts depends on how much wall there is for the area of air inside it. The **hydraulic diameter** captures this: four times the area divided by the perimeter, 4A ÷ P. For a circle it equals the diameter. For a rectangle a × b it is 2ab ÷ (a + b).

This is an illustration. The 160 × 310 mm rectangle has a hydraulic diameter of 2 × 0.16 × 0.31 ÷ 0.47 = **211 mm**, much less than the 250 mm round duct it replaced. In friction calculations the hydraulic diameter is used with the rectangle's actual velocity, and it shows at once that the rectangle behaves like a smaller round duct.

## Equal friction: the Huebscher diameter

For sizing, designers more often use the **equivalent diameter** of a rectangular duct: the diameter of a round duct that has the same pressure loss per metre at the same flow. The widely used relationship, attributed to Huebscher, is:

```figure
type: formula
title: Equivalent diameter of a rectangular duct for equal friction
formula: Dₑ = 1.30 × (a × b)^0.625 ÷ (a + b)^0.25
caption: a and b are the rectangle's internal sides, in any consistent unit. A 300 × 500 mm duct gives about 420 mm, matching the published example in the reference.
- a, b | Internal width and height of the rectangle
- Dₑ | Diameter of the round duct with the same friction at the same flow
step: 160 × 310 mm: Dₑ = 1.30 × (0.0496)^0.625 ÷ (0.47)^0.25 = 0.2402 m, about 240 mm
step: For Dₑ = 250 mm at a depth of 160 mm, the width found by trial is about 338 mm
step: Check: 300 × 500 mm gives Dₑ = 420 mm
```

The formula cannot be rearranged directly for one side, so finding the width that gives a required equivalent diameter takes a few trials or a goal-seek, as the second step shows.

## The three answers compared

For EX-1's 250 mm main, at 0.90 m³/s, and a 160 mm deep space:

```figure
type: compare
title: Rectangles 160 mm deep for EX-1's 250 mm main
cols: Area | Velocity | Friction per metre
caption: This is an illustration at 0.90 m³/s. Equal area keeps the velocity and raises the friction; equal friction keeps the friction and lowers the velocity below the 18 m/s minimum.
- Round, 250 mm | 0.0491 m² | 18.33 m/s | 15.0 Pa/m
- *Equal area, 160 × 310 mm | 0.0496 m² | 18.15 m/s | 18.4 Pa/m
- Equal friction, 160 × 338 mm | 0.0541 m² | 16.63 m/s | 15.0 Pa/m
```

The rectangle cannot match the round duct on both counts. An equal-velocity rectangle loses about 23% more pressure per metre; an equal-friction rectangle runs about 9% slower. A dust duct must keep its velocity, so it uses the equal-area rectangle and accepts the friction; a comfort-air duct that must stay quiet and efficient uses the equal-friction rectangle and accepts the lower velocity, which suits it anyway.

## The error: a comfort-duct habit

This is an illustration. The drafter detailing EX-1's mezzanine crossing had spent years on air-conditioning work, where every rectangular duct is sized by equal friction. They converted the 250 mm main to **160 × 340 mm**, the nearest size to the equal-friction width, and noted it on the drawing as "equivalent to 250 dia".

The checker's velocity column, the one Chapter 1 added after the B3 branch, caught it before the duct was made: 0.90 ÷ (0.16 × 0.34) = **16.5 m/s**, below the 18 m/s minimum, in a 4 m horizontal run where dust would settle first. The fix was to make the rectangle 160 × 310 mm, at 18.15 m/s, and to add the extra friction to the fan calculation: 4 m at about 3.4 Pa/m more than the round duct, about **14 Pa**. The drawing note was changed from "equivalent to 250 dia" to "equal area to 250 dia, 18.1 m/s", so that the basis of the conversion was visible.

```figure
type: bars
title: Velocity in the mezzanine crossing, by conversion
unit: m/s
max: 20
caption: This is an illustration. Only the equal-area rectangle stays above the 18 m/s transport velocity.
- Round 250 mm before conversion | 18.33
- *Equal area, 160 × 310 mm | 18.15
- Equal friction, 160 × 340 mm | 16.54
```

The general point is that "equivalent" is not one thing. A drawing that converts a duct's shape should say what was kept equal, because the next person to change it will otherwise assume their own habit.

## Aspect ratio

The **aspect ratio** of a rectangular duct is its longer side divided by its shorter. The flatter the duct, the more wall it has for its area and the more friction it causes, and the more its flat sides drum and need stiffening. Many design guides suggest keeping rectangular ducts below an aspect ratio of about 3:1 or 4:1 where possible. The 160 × 310 mm crossing has an aspect ratio of about **1.9:1**, comfortably within that. The exercise shows what happens when the space is shallower.

## Flatter means worse

Holding the area constant and flattening the rectangle shows the cost of aspect ratio directly. This is an illustration. Each rectangle below has an area of 0.050 m², so each carries EX-1's 0.90 m³/s at exactly 18 m/s, but their equivalent diameters, and so their friction, differ.

```figure
type: bars
title: Equivalent diameter of rectangles of 0.050 m², by aspect ratio
unit: mm
max: 260
caption: This is an illustration. All five rectangles carry 0.90 m³/s at 18 m/s. The flatter the rectangle, the smaller its equal-friction diameter and the higher its pressure loss per metre.
- Square, 224 × 224 mm, 1:1 | 244.4
- *160 × 313 mm, about 2:1 | 241.1
- 120 × 417 mm, about 3.5:1 | 233.6
- 100 × 500 mm, 5:1 | 227.1
- 80 × 625 mm, about 7.8:1 | 218.1
```

The square and the 2:1 rectangle are nearly as good as each other; beyond about 3:1 the equivalent diameter falls quickly, and an 8:1 duct behaves like a round duct of only 218 mm. The hydraulic diameter falls faster still, from 224 mm for the square to 142 mm for the 8:1 rectangle, which is why very flat ducts are avoided whenever the space allows anything else, and why a flat duct that cannot be avoided is kept as short as possible.

## Square ducts

A square duct is a rectangle with an aspect ratio of 1. Its equal-area side for a 250 mm round is √0.04909 = **221.6 mm**, and its equal-friction side, by the Huebscher formula, about **228.7 mm**. The two are closer than for a flat rectangle, because a square is nearer a circle. A square duct is often used where a round duct would fit but rectangular fittings, dampers or access doors are easier to make.

## Sizing a comfort duct from scratch

The same tools size a rectangular supply duct where the limit is a maximum velocity, for quiet. This is an illustration, not part of EX-1. A supply duct for the workshop's office carries 0.50 m³/s, the designer has set a maximum velocity of 6 m/s, and the ceiling space allows a depth of 250 mm. The area must be at least 0.50 ÷ 6 = 0.0833 m², so the width at least 0.0833 ÷ 0.25 = 333 mm. Rounding **up**, as Chapter 1 recommends for comfort ducts, to 350 mm gives a velocity of 0.50 ÷ (0.25 × 0.35) = **5.71 m/s**. Its Huebscher equivalent diameter is about **322 mm**, and that diameter, not the area, is what the designer uses with a friction chart or calculation to find the duct's pressure loss.

Note the difference from EX-1: there, the rectangle was chosen for its velocity and its friction followed; here, the velocity limit sets a minimum size and the equivalent diameter gives the friction. The arithmetic is identical and the priorities are reversed.

## Internal dimensions and liners

As with round duct, the dimensions that count are the internal ones. A rectangular duct with 25 mm of internal acoustic lining inside a 400 × 300 mm casing has an air passage of 350 × 250 mm, and its velocity, hydraulic diameter and equivalent diameter must be calculated for that passage. Lined duct also has a rougher surface than bare sheet, which raises its friction further. Extraction ducts carrying dust are not lined internally, because the lining would trap dust and be eroded by it.

## Flat oval ducts

Flat oval duct, a rectangle with semicircular sides, sits between round and rectangular. It fits shallow spaces better than round and has less wall than a rectangle of the same depth and area. Its area is that of the oval of *Tanks and Hoppers by the Numbers*: the circle of its depth plus the rectangle of its straight sides. Its equivalent diameter has its own published formulas and tables, and those, not the rectangular formula, should be used for it.

## Transitions between shapes

Every change of shape needs a transition, and a transition has its own pressure loss, which Chapter 7 addresses. A round duct that becomes rectangular for 4 m and round again needs two transitions, and their losses can exceed the extra friction of the rectangle itself. The decision to change shape should count them, and a short obstruction is sometimes better passed by an offset in the round duct than by a change of shape.

This is an illustration. If each of the mezzanine crossing's two transitions, round to rectangle and back, has a loss coefficient of 0.15 on the rectangle's velocity pressure, a figure the fitting's data would give, each costs 0.15 × ½ × 1.2 × 18.15² = about **30 Pa**, and the pair about **59 Pa**. That is four times the 14 Pa of extra friction in the 4 m rectangle itself. For a short crossing, the transitions dominate, and a pair of 45° offsets in round duct, dropping the main under the obstruction, might cost less. Chapter 5 sets out how to compare such fittings, and Chapter 7 how to shape a transition so that its loss stays low.

## Exercise: a shallower crossing

Suppose the mezzanine leaves only 120 mm of depth. For EX-1's 0.90 m³/s main, find the widest rectangle 120 mm deep that keeps at least 18 m/s, round it to a 400 mm width, and calculate its velocity, equivalent diameter, friction per metre relative to the 250 mm round duct, and aspect ratio. Is it a good choice?

**Worked answer.** At least 18 m/s means an area of no more than 0.90 ÷ 18 = 0.050 m², so a width of no more than 0.050 ÷ 0.12 = **416.7 mm**. At **120 × 400 mm**, the area is 0.048 m² and the velocity **18.75 m/s**. Its Huebscher equivalent diameter is about **229.5 mm**, and at 0.90 m³/s its friction is about 23.3 Pa/m, roughly **1.55 times** the round duct's 15.0 Pa/m. Its aspect ratio is **3.3:1**.

It meets the velocity minimum, but it is flat enough to need stiffening, it loses half as much pressure again per metre as the round duct, and it needs two transitions. If the crossing is short, it may still be the best answer; if the main could instead be rerouted under the mezzanine's beams in round duct, that would almost certainly be better. The numbers make the choice clear rather than making it. Whichever is chosen, the drawing should record the conversion's basis, the velocity it gives and the extra pressure loss it adds, so that the fan calculation of Chapter 6 can include it and a later alteration can see why the duct is the shape it is.
