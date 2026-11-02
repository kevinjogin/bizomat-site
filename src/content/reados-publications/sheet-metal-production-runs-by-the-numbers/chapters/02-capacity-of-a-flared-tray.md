---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: capacity-of-a-flared-tray
order: 2
title: "Capacity of a flared tray"
description: "Calculate a flared tray's capacity with the prismoidal formula, compare the shortcuts, size the depth from 200 to 205 mm for 36 L to the fill line, and catch a depth set by average areas."
draft: false
---

A flared tray's capacity is the volume of a solid whose top and bottom are rectangles of different sizes and proportions, joined by four sloping walls. It is not a box, nor a pyramid, nor a frustum of a pyramid in the strict sense, because its top and bottom rectangles are not similar shapes. Three formulas are commonly used for it, and only one is exact. For a production run, the difference matters when the specification sets a minimum capacity and the tray is designed close to it.

This chapter calculates the running case tray's capacity to its fill line and brim, sizes its depth to meet the distributor's 36 litres with a margin, works out how sensitive the capacity is to the fill line's position and to manufacturing variation, and ends with a depth chosen by averaging the end areas, which looked right and was not.

## The tray as a solid

This is an illustration. The tray's top, inside the walls, is 600 × 400 mm. Every wall flares at 0.2 mm out per millimetre of depth, so at a height z above the base the inside dimensions are the base's plus 0.4z in each direction. With a depth of H, the base is 600 − 0.4H by 400 − 0.4H.

At the fill line, 20 mm below the rim, the inside is 600 − 8 = 592 by 400 − 8 = 392 mm, whatever the tray's depth, because the top is fixed and the flare is fixed. The liquid, or the parts, fill the solid between the base and that level.

## Three formulas

**The prismoidal formula** is exact for any solid whose cross-sectional area varies as a quadratic with height, which includes every flared tray with straight walls. With the area at the bottom A₁, at the top A₂ and at mid-height Aₘ, over a height h:

V = h ÷ 6 × (A₁ + 4Aₘ + A₂)

**The frustum formula**, V = h ÷ 3 × (A₁ + A₂ + √(A₁A₂)), is exact only when the top and bottom are similar shapes, scaled copies of each other. The running case's rectangles are not: 600 × 400 has a ratio of 1.5, while a base of 520 × 320 has a ratio of 1.625. The frustum formula is then slightly low.

**The average end area method**, V = h × (A₁ + A₂) ÷ 2, is exact only for walls that do not taper in both directions at once. For a flared tray it is always high, because it treats the area as varying in a straight line when it actually varies as a curve.

```figure
type: formula
title: Capacity of a flared tray by the prismoidal formula
formula: V = h ÷ 6 × (A₁ + 4Aₘ + A₂)
caption: The running case tray, 600 × 400 mm at the top, walls flaring 0.2 mm per millimetre of depth, first sketched 200 mm deep and filled to 20 mm below the rim.
- A₁ | Area of the base, 520 × 320 = 166,400 mm²
- A₂ | Area at the fill line, 592 × 392 = 232,064 mm²
- Aₘ | Area halfway up the fill, 556 × 356 = 197,936 mm²
- h | Depth of fill, 180 mm
step: V = 180 ÷ 6 × (166,400 + 4 × 197,936 + 232,064) = 35,706,000 mm³
step: Capacity to the fill line = 35.71 litres, short of the 36 L required
step: Brim-full, 200 mm deep: 40.43 litres
```

## The first sketch falls short

The first sketch was 200 mm deep, chosen because 600 × 400 × 200 felt about right for "about forty litres". Brim-full it holds **40.43 litres**, but to the fill line only **35.71 litres**: 0.29 litres short of the specification.

The depth must increase. Because the top is fixed, a deeper tray has a smaller base: at 205 mm deep the base is 518 × 318 mm. The fill depth becomes 185 mm, and the prismoidal formula gives **36.53 litres** to the fill line and **41.25 litres** brim-full.

Solving the formula for the exact depth that gives 36.00 litres to the fill line gives **201.8 mm**. The shop chooses 205 mm, which gives a margin of 0.53 litres, about 1.5%, for the variation that Chapter 10's measurements will find.

```figure
type: bars
title: Capacity to the fill line by tray depth
unit: L
max: 37
caption: This is an illustration. Prismoidal formula, top fixed at 600 × 400 mm, flare 0.2 mm per mm. The requirement is 36 L; the chosen depth of 205 mm gives a margin of 0.53 L.
- 200 mm deep | 35.71
- 201 mm deep | 35.87
- 202 mm deep | 36.04
- * 205 mm deep | 36.53
```

## How the formulas compare

For the chosen 205 mm tray, filled to 185 mm, the three formulas give:

- prismoidal, exact: **36.534 litres**;
- frustum: 36.525 litres, 0.009 litres low, because the rectangles are not similar;
- average end area: 36.703 litres, 0.169 litres high.

The frustum formula's error is negligible here, because the top and bottom are nearly similar. The average end area method's error is half a percent, small in itself but the same size as a sensible design margin. A designer who sizes a tray to a minimum capacity by average end areas has used up the margin without knowing it. The KEVOS® [prismoidal volume calculator](/tools/prismoidal-volume/) gives the exact value from the three areas and the height.

```figure
type: compare
title: Three formulas for the 205 mm tray's capacity to the fill line
rowhead: Method
cols: Capacity, L | Error | When it is exact
caption: This is an illustration. For a flared tray with straight walls, only the prismoidal formula is exact.
- * Prismoidal | 36.534 | none | any straight-walled flared tray
- Frustum of a pyramid | 36.525 | 0.009 L low | top and bottom similar shapes
- Average end area | 36.703 | 0.169 L high | walls tapering in one direction only
```

## Sensitivity to the fill line

Near the top of the tray, each millimetre of depth holds the area of the fill level times one millimetre: 592 × 392 mm², or **0.232 litres per millimetre**. That number answers several production questions at once.

- If the fill line is marked 2 mm too low, the tray holds 0.46 litres less to it, nearly the whole design margin.
- If the trays are made 1 mm shallower than drawn, with the top still 600 × 400, each holds about 0.23 litres less to the fill line.
- The powder coat, about 80 µm thick inside, takes up roughly 0.55 m² × 0.00008 m = **0.04 litres**, negligible against the margin.

So the fill line's position and the tray's depth matter far more than the coating, and the first-article checks in Chapter 10 measure both.

## Dimensions that must agree

Once the depth is fixed, the drawing carries several dimensions that must agree with one another, and checking them is a quick guard against a slip in drafting. For the 205 mm tray:

1. The base, inside, is 600 − 0.4 × 205 = **518 mm** by 400 − 0.4 × 205 = **318 mm**.
2. Each wall's flare is (600 − 518) ÷ 2 = **41 mm** on the long walls and (400 − 318) ÷ 2 = **41 mm** on the short walls, the same, as the specification requires.
3. The flare angle is atan(41 ÷ 205) = **11.31°** from vertical, unchanged from the 200 mm sketch, because flare and depth changed in proportion.
4. The fill line is 20 mm below the top of the wall, measured vertically, which is 185 mm above the base.

A drawing on which the base is shown as 520 × 320 mm, left over from the first sketch, with a depth of 205 mm, would have walls flaring 40 mm over 205 mm, 11.04°, and a slightly larger capacity. The tray would still pass, but its blank, its corners and every downstream number would be inconsistent with the specification. Checking that the flares agree catches it.

## Capacity by measurement

The calculation is checked by measurement on the first article. Water is the simplest test fluid: 36.53 litres of water weighs about 36.5 kg, so the tray is set level on a scale, filled to the fill line with water, and the water weighed, or the tray is filled from a calibrated container. The result should agree with the calculation within the accuracy of the fill line's marking, about ±0.25 litres for a line drawn to ±1 mm.

The distributor's acceptance check, the specification says, will be done the same way on one tray in fifty. The shop's margin of 0.53 litres is therefore its protection against a tray failing that check for reasons within normal variation, and Chapter 10 shows how the shop confirms that the variation in its process is smaller than the margin.

## Capacity as the tray is filled

The stores manager will not always fill trays to the line, and the warehouse's stock records sometimes need the volume at other levels, for example to estimate how many small parts fit when a tray is half full. The prismoidal formula gives the volume to any level, using the areas at the base, at the level and halfway between.

This is an illustration. For the 205 mm tray, the capacity at 50 mm of fill is about 8.7 litres, at 100 mm about 18.2 litres, at 150 mm about 28.6 litres and at the 185 mm fill line 36.5 litres. The volume grows faster than the depth because the tray widens upward: the top 35 mm of fill, from 150 to 185 mm, holds about 7.9 litres, a third more than the bottom 35 mm's 6.0 litres. A level table like this, printed on the tray's label or in the distributor's stores manual, turns a glance at the parts' level into a volume, and the shop can supply it at no cost because it falls straight out of the design calculation.

## Litres of parts are not litres of water

The specification's 36 litres is a geometric volume, and the distributor will fill trays with parts, not liquid. Loose parts never fill a volume completely: bolts, fittings and small castings leave gaps between them, and how much of the volume they occupy depends on their shape and how they are placed. This is an illustration. If a bin of mixed small fittings occupies about 55% of the volume it is poured into, a tray filled to its line holds about 0.55 × 36.5 = 20 litres of solid metal, which for steel parts would weigh about 157 kg.

That figure shows why the specification's other limit matters as much as capacity. A tray filled to its line with dense steel parts would be far over the 25 kg it is meant to carry, and the distributor's stores procedures, not the tray, have to stop that happening. The shop's specification records the load limit beside the capacity, and the shop suggests a label on each tray stating both, so that nobody reads a large capacity as permission to carry a large load.

## Other shapes

The prismoidal formula is not limited to rectangular trays. It gives the exact volume of any solid whose cross-sections are similar or not, provided every edge running from bottom to top is straight: rectangular trays, round buckets with flared walls, hoppers with flat or conical sides, and transitions between shapes. For a round flared container, the three areas are circles and the formula reduces to the frustum of a cone, which is then exact. For a container with curved walls, such as a dished or spun pan, it is an approximation and a finer method is needed.

## The error: a depth chosen by average end areas

This is an illustration. A second distributor asked the shop for a similar tray with the same footprint and the same 36-litre requirement but without any margin, to keep the price down. The designer, working quickly, used the average end area method to find the depth that just gave 36.00 litres to the fill line: **200.8 mm**, rounded to 201 mm.

At 201 mm, the average end area method gives 36.03 litres. The prismoidal formula, which is exact, gives **35.87 litres**, 0.13 litres short. The checker found it at the design review by recomputing with the exact formula, and the tray was deepened to 202 mm, which gives 36.04 litres, before any blanks were cut.

The difference was small enough that the first article might have passed a careless check and large enough that a careful customer, filling one tray in fifty with a measured volume, would have rejected the run. The shop's rule since then is that capacity is always calculated by the prismoidal formula, and that a design without a capacity margin is flagged at review as a risk, whatever the price.

```figure
type: checklist
title: Capacity checks before the depth is fixed
caption: Each check closes a way in which a tray can be right on paper and short in use.
- Capacity defined to the fill line the customer uses | 20 mm below the rim
- Prismoidal formula used, not average end areas | 36.53 L at 205 mm
- Margin over the requirement stated | 0.53 L, about 1.5%
- Sensitivity near the fill line known | 0.232 L per mm
- First-article capacity test planned | weigh the water to the fill line
- x Depth sized by average end areas with no margin | 201 mm, 0.13 L short
```

## Exercise: a smaller tray

The distributor also wants a half-size tray for small parts: 400 × 300 mm at the top, with the same 0.2 mm per mm flare, and at least 18 litres to a fill line 20 mm below the rim. Is a depth of 180 mm enough? Use the prismoidal formula.

**Worked answer.** At 180 mm deep, the base is 400 − 72 = 328 by 300 − 72 = 228 mm. The fill line is at 160 mm, where the inside is 392 × 292 mm. Halfway, at 80 mm, it is 360 × 260 mm.

- A₁ = 328 × 228 = 74,784 mm²; A₂ = 392 × 292 = 114,464 mm²; Aₘ = 360 × 260 = 93,600 mm².
- V = 160 ÷ 6 × (74,784 + 4 × 93,600 + 114,464) = **15.03 litres**.

That is about 3 litres short of 18. Solving for the depth that gives 18.00 litres gives 222.3 mm, and a depth of **225 mm**, with a base of 310 × 210 mm, gives **18.18 litres** to the fill line, a margin of 0.18 litres. Halving the footprint does not halve the depth needed: a smaller top loses proportionally more of its capacity to the flare, and every extra millimetre of depth shrinks the base by 0.4 mm each way, so the half-size tray must be deeper than the full-size one to hold half as much.
