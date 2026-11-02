---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: sizing-the-blank-for-a-dome
order: 3
title: "Sizing the blank for a dome"
description: "Size a dome's blank by sinking, raising or both, predict the mean thickness and the rim's shrink for each, make a checking template, and catch a blank cut with no trim allowance."
draft: false
---

A dome can be made from blanks of many sizes. Start small and the whole of the dome's extra surface must come from stretching, which thins the metal. Start large and the surplus at the edge must be shrunk away by raising, which is slow and risks wrinkles. Somewhere between lies a blank that shares the work, keeps the thickness inside the drawing's limit and keeps the raising to a sensible number of courses.

This chapter calculates the dome's geometry, compares three blank strategies for HF-01's dome, chooses one, adds a trim allowance, and turns the geometry into a checking template. Pressed and spun parts are sized the same way in [Deep Drawing and Spinning by the Numbers](/reados/publications/deep-drawing-and-spinning-by-the-numbers/blank-size/); the difference by hand is that the worker chooses how much of the area comes from stretching and how much from shrinking. The calculations need only the dome's diameter and height, the formula for the area of a spherical cap, and the constant-volume rule from Chapter 2.

## The dome's geometry

A spherical cap is described by its rim radius a and its height h. Everything else follows from them.

```figure
type: formula
title: Geometry of a spherical cap
formula: R = (a² + h²) / (2h)     A = 2π R h     L = R × asin(a / R)
caption: This is an illustration for HF-01's dome. R is the sphere's radius, A the cap's surface area, and L the meridian, the length along the surface from the top to the rim.
- a | Rim radius, 160 mm
- h | Height of the cap, 80 mm
step: R = (160² + 80²) / 160 = 200 mm
step: A = 2π × 200 × 80 = 100,531 mm²
step: The surface meets the rim at asin(160 / 200) = 53.1° from the axis, and L = 200 × 0.927 rad = 185.5 mm
```

The meridian is the length a radial line drawn on the blank must reach from the centre to the rim after forming. On a flat blank, that radial line is simply the blank's radius. If the blank's radius is less than 185.5 mm, the radial lines must stretch; if it is more, they need not, but then the blank's circumference at the rim is greater than the dome's and must be shrunk.

## Three strategies

**Sinking only** starts with a disc the size of the rim, 320 mm, and stretches it into the dome, as one would by hammering it into a hollow. The disc's area of 80,425 mm² must grow to 100,531 mm², by 25%, so the mean thickness falls to 1.6 / 1.25 = **1.28 mm**. That is below HF-01's 1.3 mm limit as an average, and since the top stretches more than the rim, the top would be thinner still. Sinking alone cannot make this dome to the drawing.

**Raising only** starts with a disc of the same area as the dome, so that the average thickness stays at 1.6 mm, and shrinks the edge onto a stake. That disc's radius is √(100,531 / π) = 178.9 mm, a diameter of 357.8 mm. Its rim must shrink from a circumference of 1,124 mm to 1,005 mm, a compression of 10.6%, which thickens the rim towards 1.79 mm. Raising alone keeps the thickness but demands the most shrinking, the most courses and the greatest risk of wrinkles, and it leaves a dome heavy at the rim and thin at the top all the same, because a radial line from 178.9 mm must still reach 185.5 mm.

**Sinking and raising** starts with a disc between the two, sinks its middle to stretch the radial lines, and raises its edge to shrink the circumference. The workshop considered three sizes:

```figure
type: compare
title: Blank options for HF-01's dome, 1.6 mm sheet
cols: Area growth needed | Mean thickness | Rim shrink | Meridian stretch
caption: This is an illustration. Area growth and mean thickness from constant volume; rim shrink from the blank's radius to the rim's 160 mm; meridian stretch from the blank's radius to the 185.5 mm meridian. No trim allowance included.
- 320 mm, sink only | 25.0% | 1.28 mm | none | 16.0%
- 330 mm | 17.5% | 1.36 mm | 3.0% | 12.4%
- *340 mm | 10.7% | 1.45 mm | 5.9% | 9.1%
- 350 mm | 4.5% | 1.53 mm | 8.6% | 6.0%
- 357.8 mm, raise only | 0% | 1.60 mm | 10.6% | 3.7%
```

The table shows the trade. Every 10 mm of blank diameter shifts work from stretching to shrinking: less thinning, more raising. The 340 mm blank keeps the mean thickness at 1.45 mm, giving room for the top to thin further than the average without reaching 1.3 mm; it needs the rim shrunk by 5.9%, which the workshop's records suggest is three or four courses of raising; and its radial lines stretch by 9.1%, a moderate amount of sinking.

This is an illustration. The workshop chose a net blank of 340 mm. Its mean thickness margin over the 1.3 mm limit is 0.15 mm, about 10% of the sheet, which the trial dome of Chapter 2 suggested was enough if the sinking is spread evenly. A 350 mm blank would give more thickness margin at the cost of half as much raising again; the workshop kept it in reserve in case the first dome came out too thin.

## The trim allowance

A hand-raised rim is never perfectly round or level. Raising courses push some parts of the edge further than others, the edge waves a little, and the last course leaves the rim's height varying by several millimetres around the dome. The net blank is the size that ends exactly at the rim; the cut blank must be larger, with a margin that is trimmed off after forming.

This is an illustration. The workshop's records for raised work of this size show the formed edge wandering about ±4 mm from its mean. It allows 6 mm on the radius, cutting the blank at **352 mm** diameter, so that even the lowest point of the formed edge stands above the trim line. The extra ring of metal is shrunk along with the rim and then cut away. It costs a little more raising and about 28 g of aluminium per dome: the 352 mm blank weighs about 0.425 kg against 0.397 kg for the 340 mm net blank, taking a density of 2,730 kg/m³ for the alloy.

## The error: a blank with no trim allowance

This is an illustration. The first customer dome was cut by an apprentice working from the planning sheet, which at that stage gave only the net blank, 340 mm. The apprentice cut 340 mm exactly, the dome was sunk and raised in good order, and it checked well against the template. When the worker scribed the trim line at 80 mm below the top and went round with the snips, the line ran off the edge of the metal in two places: the formed edge had wandered below the rim line by up to 3 mm over two arcs of about 60 mm each.

The dome could not be trimmed to a clean rim. It could have been accepted with two short notches in the rim, which the ring's flange would partly hide, but the customer's drawing called for a continuous rim seated on the flange, and the workshop rejected it. About four hours of work were lost.

The planning sheet now gives two figures for every formed blank: the net size from the geometry and the cut size with its trim allowance, and it names the cut size in bold. The lesson is general to hand forming: **the geometry gives the size at the finished edge, and the process decides how much more to cut**. Any raised, flanged or wheeled edge needs a trim allowance from the workshop's own records, because no formula predicts how much a hand-formed edge wanders.

## A checking template

A dome is checked against a template, a profile cut to the dome's section that is held against it across a diameter. The template's shape comes from the sphere: at a distance r from the axis, the dome's surface stands above the rim plane by z = √(R² − r²) − (R − h).

```figure
type: bars
title: Height of HF-01's dome above its rim plane, by distance from the axis
unit: mm
max: 90
caption: This is an illustration. z = √(200² − r²) − 120, for R = 200 mm and h = 80 mm. The template is cut to these heights and checked against a full-size drawing of the arc before use.
- r = 0 mm, top | 80.0
- r = 40 mm | 76.0
- r = 80 mm | 63.3
- r = 120 mm | 40.0
- r = 160 mm, rim | 0
```

The workshop cuts its templates from 3 mm sheet aluminium, so they stay true, with a reference edge that sits on the rim plane. The profile is marked out with a trammel set to 200 mm from a centre 120 mm below the rim line, then checked against the five heights above. In use, the template is held across two diameters at right angles and the gap read with feeler gauges or a taper gauge; HF-01's drawing allows ±2 mm.

A template is more than a final check. It is used after every stage of forming, so that the worker can see where the dome is still too flat or already too deep and direct the next course of blows. A dome checked only at the end is a dome that can only be accepted or scrapped.

### Templates for the raising stages

Experienced workers sometimes make a set of templates for intermediate stages: a shallower profile for the end of sinking, then the final one. For HF-01, the worker sinks the 352 mm blank until its middle reaches a depth of about 40 mm below its edge, checked with a straightedge across the blank and a rule, then raises the rim in courses to the final profile. A single intermediate check of depth is enough at this size; a larger or deeper dome benefits from more stages.

## Where the strategy fails

The constant-volume arithmetic in this chapter treats the dome as a whole and gives the mean thickness. It does not say how the thinning is spread, which depends on where the worker strikes. A dome sunk with heavy blows in a ring will have a thin band, as the exercise in Chapter 2 showed, even though its mean thickness is fine. The blank choice gives margin; the forming sequence in Chapter 4 decides whether the margin is used well.

The arithmetic also assumes a blank of uniform thickness and a soft, uniform material. A batch of sheet at the low end of its thickness tolerance, or partly hardened from rolling, uses up some of the margin before forming begins. Measuring a blank's thickness with a micrometer before forming takes a minute and is recorded with the dome.

Rolled sheet is also not quite the same in every direction. It usually stretches a little differently along the rolling direction than across it, so a round blank formed into a dome does not move evenly at its edge: the rim tends to come up higher at some points around the circumference than at others. That unevenness is one of the reasons a hand-raised rim wanders, and part of what the trim allowance must cover. Marking the rolling direction on each blank before forming lets the worker see whether the high points line up with it.

## Domes that are not spherical

Many hand-formed covers are not spherical caps. A flattened dome, a cover with a flat top and a rolled shoulder, or a dome that blends into a short skirt all have profiles made of several arcs and lines. The same method applies with one change: the surface area must be found for the actual profile.

For any surface made by revolving a profile about an axis, the area is the profile's length multiplied by the distance its centroid travels around the axis, Pappus's theorem. The profile can be broken into straight pieces and arcs, each piece's length and centroid radius found, and the products added. The KEVOS® [Pappus revolution calculator](/tools/pappus-revolution/) does this for simple shapes. For HF-01's spherical cap, the method gives the same 100,531 mm² as the formula, which is a useful check on a spreadsheet before it is used for a less tidy profile.

Once the area is known, the rest of the chapter applies unchanged: the mean thickness for any blank follows from constant volume, the rim shrink from the blank's radius and the rim's, and the meridian stretch from the blank's radius and the profile's length from axis to rim. A flat-topped cover is usually easier than a sphere of the same height, because its flat top needs no stretch at all, and most of the work concentrates in the shoulder, where the template should be checked most often.

## Recording the blank

This is an illustration. The workshop's planning sheet for each formed part records, before cutting: the drawing's thickness limit; the part's surface area and how it was calculated; the net blank and its predicted mean thickness, rim shrink and meridian stretch; the cut blank with its trim allowance and where the allowance came from; the sheet's measured thickness and batch; and the template's reference. After forming, the same sheet records the measured thickness at the gauged points and the trimmed rim's height variation. Over a few jobs, those records become the workshop's own data on trim allowances, thinning patterns and courses, which are worth more than any rule of thumb because they describe its own workers and tools.

## Exercise: a deeper dome

A customer for another job asks for a dome of the same 320 mm rim but 100 mm high, in the same 1.6 mm sheet with the same 1.3 mm limit.

1. Find R, the surface area and the meridian.
2. Would the 340 mm blank work? What net blank would you choose?

**Worked answer.**

1. R = (160² + 100²) / 200 = **178 mm**. A = 2π × 178 × 100 = **111,841 mm²**. The surface meets the rim at asin(160 / 178) = 64.0° from the axis, so L = 178 × 1.117 rad = **198.9 mm**.
2. A 340 mm blank, of area 90,792 mm², would need its area to grow by 23.2%, giving a mean thickness of 1.6 / 1.232 = **1.30 mm**, exactly at the limit as an average and certainly below it at the top. It would not work. A 360 mm blank needs 9.9% area growth and a mean thickness of 1.46 mm, close to HF-01's margin, but its rim must shrink by 11.1%, almost twice HF-01's 5.9%, which means more courses and more risk of wrinkling. A deeper dome demands more total work whichever way it is shared; a 360 mm net blank with a cut size of 372 mm is a reasonable start, and the trial and the template will show whether to adjust.
