---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: blank-size
order: 2
title: "Blank size from surface area"
description: "Size a drawn part's blank from its surface area: discs, corner radii, walls and flanges at mid-thickness, the trim allowance, blank layout in strip, and catch a blank sized like a bent part's."
draft: false
---

Every drawn part starts as a blank, and the blank's size decides almost everything that follows. Too small, and the cup comes out short of its height or with no metal to trim. Too large, and the draw ratio rises beyond what the material can take, the cup tears, the press works harder, and the extra metal is paid for and then cut off as scrap. The blank's size comes from the part's surface area, because, as Chapter 1 showed, a drawn part keeps very nearly the area of the blank it came from. Getting that area right, at the right diameter, with the right allowance for trim, is the first calculation in any drawn part.

This chapter builds the area method from simple surfaces, derives the blank formula for a flat-bottomed cup with a corner radius, adds the trim allowance, looks at the effect of measuring at the inside, mean or outside of the sheet, and lays the blanks out in strip. The running case finds that SC-100's first trial blanks were cut to the size of a bent part's flat pattern, 60% too much metal, and tore in the first draw.

## The area method

A drawn part is divided into simple surfaces whose areas are known: a flat disc for the bottom, a quarter of a torus for each corner radius, a cylinder for the wall, a flat ring for any flange, a cone frustum for a tapered wall, a spherical cap for a domed bottom. Their areas are added, and the blank is the disc of the same area:

```figure
type: formula
title: Blank diameter from surface area
formula: D = √(4 × A ÷ π), where A is the sum of the part's surface areas at mid-thickness
caption: This is an illustration for SC-100 drawn to 76 mm before trimming, with a 100 mm mean diameter and a 4 mm corner radius. Areas are taken at the sheet's mid-thickness.
- A | Total surface area of the part at mid-thickness, including trim allowance, mm²
- D | Diameter of the flat round blank with the same area, mm
step: Bottom disc, 92 mm across: π × 92² ÷ 4 ≈ 6,648 mm²
step: Corner, a quarter torus by Pappus' theorem: ≈ 1,917 mm²
step: Wall, 100 mm diameter × 72 mm: π × 100 × 72 ≈ 22,619 mm²
step: Total ≈ 31,184 mm², so D ≈ √(4 × 31,184 ÷ π) ≈ 199.3 mm
```

The corner's area comes from **Pappus' theorem**: the area of a surface of revolution is the length of the generating curve times the distance travelled by its centroid. The corner's generating curve is a quarter circle of radius r, length π × r ÷ 2, whose centroid lies 2r ÷ π from the arc's centre towards the arc, at a radius of (d ÷ 2 − r) + 2r ÷ π from the cup's axis.

## The flat-bottomed cup formula

For a flat-bottomed cylindrical cup of mean diameter d, height h and corner radius r, adding the three areas and simplifying gives a formula worth remembering:

D = √(d² + 4dh − 1.72rd − 0.57r²)

With a sharp corner, r = 0, it reduces to D = √(d² + 4dh): the bottom disc's area plus the wall's. The corner terms are small corrections, because a corner radius uses a little less metal than a sharp corner and a wall reaching to the bottom. For SC-100, the sharp-corner formula gives about 201.0 mm and the full formula about **199.3 mm**, a difference of under 1%.

The formula is the area method written out for one shape. Parts with flanges, tapered walls, steps or domed bottoms use the area method directly, surface by surface, and should not be forced into a formula for a different shape.

## Mean, inside or outside?

Areas are taken at the sheet's **mid-thickness**, because that is the surface whose area stays most nearly constant as the sheet bends round the corners. A designer who dimensions SC-100 to its inside, 99.2 mm across, or its outside, 100.8 mm, and uses that diameter in the formula, gets a slightly different blank.

```figure
type: compare
title: SC-100's blank calculated at three surfaces
cols: Diameter used | Height used | Corner radius used | Blank
caption: This is an illustration for 0.8 mm sheet drawn to 76 mm. The mean surface gives the blank; the others are off by about 0.6%.
- Inside surface | 99.2 mm | 75.6 mm | 3.6 mm | 198.0 mm
- *Mid-thickness | 100.0 mm | 76.0 mm | 4.0 mm | 199.3 mm
- Outside surface | 100.8 mm | 76.4 mm | 4.4 mm | 200.5 mm
```

For thin sheet the difference is small, here about 1.3 mm either way, but it grows with thickness, and on a thick-walled part it matters. The calculation should state which surface it uses, and the drawing should state which surface its dimensions are to, inside or outside, because the punch makes the inside and the die the outside.

## The trim allowance

A drawn cup's rim is never perfectly level. The sheet's properties vary with direction, which makes the rim wavy, with ears, as Chapter 7 explains; the blank may sit slightly off-centre in the die; and the rim thickens unevenly. For a part like SC-100 whose open end must be square and accurate, the cup is drawn taller than its finished height and the rim is **trimmed** off.

This is an illustration. SC-100's finished height is 70 mm. Without a trim allowance, its blank would be about **193.1 mm**. Drawn to 76 mm, with 6 mm of trim, its blank is about **199.3 mm**, about 6.5% more area. The allowance is chosen from the expected ear height and the trimming method, and Chapter 7 shows how SC-100's 6 mm was arrived at. It is metal paid for and scrapped, so it is chosen with care, but too little leaves ears below the trim line, which is a worse waste: a scrapped part.

## The running case: the first trial blanks

This is an illustration. When SC-100's first trial tool was ready, the blanks were cut in the sheet metal shop, which usually made bent parts and cut their flat patterns by adding the lengths of the sides. Treating the cup's profile like a bent channel, the shop added the bottom and two walls: 100 + 76 + 76 = **252 mm**, and cut round blanks to that diameter.

The blank calculation gives 199.3 mm. A 252 mm blank has about **1.60 times** the area, 60% more metal than the part needs, and a draw ratio on a 100 mm punch of 2.52, far beyond any single draw of stainless steel, as Chapter 3 explains. The first trial cup tore around the punch radius before it was a third drawn, with the bottom pushed out cleanly.

```figure
type: bars
title: SC-100's blank, by method, mm diameter
unit: mm
max: 260
caption: This is an illustration. A bent part's flat-pattern logic overstates a drawn part's blank, because the flange shrinks around its circumference as it draws.
- Bottom plus two walls, as first cut | 252.0
- Sharp-corner formula | 201.0
- *Area method with 4 mm corner and 6 mm trim | 199.3
- Area method without trim | 193.1
```

The flat-pattern method works for a bent part because a bend changes the metal's shape in one direction only; each side keeps its length. In a drawn cup, the flange's circumference shrinks as it is drawn in, so the metal that was the blank's outer ring becomes wall of greater length than its original radial width. Adding the side lengths ignores that flow. The fix was to cut blanks to the area method's 199.3 mm, and to issue the blank diameter on the tool's drawing as a dimension with its calculation, so that the shop would not derive it. The general lesson is that each process has its own flat-blank rule, and a rule borrowed from another process can be wrong by half.

## The blank in practice

The calculated blank is a starting point. In trials, the drawn cup's height is measured, and the blank is adjusted until the cup reaches its drawn height with the trim allowance intact. The adjustment is usually small, but it is rarely zero, because the calculation assumes a constant thickness and the real cup thickens towards the rim and thins near the punch. This is an illustration. If SC-100's average wall thickness came out 3% above the sheet's, the area needed would fall by about 3%, and the trial cup would come out about **3 mm** taller than calculated, using up half of the trim allowance's margin from the other direction. A trial blank slightly larger than calculated, reduced after measurement, is safer than one slightly smaller.

## Flanges, tapers and domes

The area method extends to any shape of revolution. This is an illustration on SC-100's dimensions.

- A **flanged** cup, with a 130 mm flange left on the 100 mm cup, adds a ring of area π ÷ 4 × (130² − 100²), and its blank grows from 199.3 mm to about **215.9 mm**.
- A **hemispherical** bottom of radius 50 mm, with a 26 mm cylindrical wall above it, has a dome's area of 2π × 50² plus the wall's, and its blank is about **174.4 mm**, much smaller, because a dome uses less metal than a flat bottom and a corner.
- A **tapered** wall uses the area of a cone frustum, π × (r₁ + r₂) × slant height.

Each surface is listed, its area computed and checked, and the areas added. A calculation sheet with one line per surface makes the blank easy to check and easy to change when the part does.

## Laying the blanks out in strip

Round blanks are cut from strip or sheet, and a circle cannot fill a rectangle. The blank layout decides how much of the sheet is bought to make each blank.

This is an illustration. With a 3 mm web between blanks and at the edges, each 199.3 mm blank occupies a pitch of about 202.3 mm along the strip.

- In a **single row**, on strip 205.3 mm wide, the blanks use about **75%** of the strip's area.
- In a **staggered double row**, on strip about 380.5 mm wide, the second row sits in the gaps of the first, and the blanks use about **81%**.
- The theoretical limit for circles packed in a hexagonal pattern is about **91%**, approached only with many rows.

The choice depends on the press's feed, the strip widths available and the blank quantity. For a few hundred parts, blanks are often cut individually from sheet on a laser or a circle shear, and the layout is a nest on the sheet. For tens of thousands, a blanking die cutting from coil in a staggered layout saves material on every part, and the saving pays for the die, as Chapter 10 shows.

## Blank edges and condition

The blank's edge condition matters more in drawing than in bending. A burr on the blank's edge, or a rough sheared edge, is the first metal to enter the die radius on the flange's outer ring and the last to finish drawing, and a crack started at a burr can run down the wall. Blanks should be cut cleanly, with the burr on the side that will face the punch where the toolmaker specifies, and deburred where the material is sensitive. Laser-cut blanks of stainless steel have a heat-affected edge whose hardness may differ from the sheet's; for a demanding draw, that edge should be checked in trial.

## Checking a blank calculation

A blank calculation is short, so it is easy to check, and it should be checked before any blanks are cut, because a wrong blank wastes a trial and sometimes a tool. Three checks catch most errors. First, **recompute the total area by a second route**: the formula against the surface-by-surface sum, as the exercise below does, or the sharp-corner formula as a rough upper bound, which should come out slightly larger than the full calculation. Second, **check the surfaces against the drawing**: every surface of the part, including the trim allowance, appears once, at mid-thickness, with its dimensions read from the right view. Third, **check the draw ratio** the blank implies on the first punch, because a blank that implies an impractical ratio is either wrong or the sign of a draw plan still to be made, which Chapter 3 addresses.

The calculation and its checks belong on the tool drawing beside the blank diameter, so that a later change to the part, a different height, a new corner radius, sends the toolmaker back to the area method and not to a guess. For SC-100, the line reads: drawn height 76 mm, mean diameter 100 mm, corner radius 4 mm, area about 31,184 mm², blank 199.3 mm, first-draw ratio as planned in Chapter 3.

## Exercise: a deeper cover

The customer asks whether SC-100 could be made 90 mm high instead of 70 mm, with the same diameter, corner radius and 6 mm of trim. What is the new blank diameter, and what is its draw ratio on the 100 mm punch?

**Worked answer.** Drawn to 96 mm, the cup's areas are the same bottom disc and corner as before, about 6,648 and 1,917 mm², and a wall of π × 100 × 92 ≈ 28,903 mm², a total of about 37,468 mm². The blank is √(4 × 37,468 ÷ π) ≈ **218.4 mm**, and by the formula, √(100² + 4 × 100 × 96 − 1.72 × 4 × 100 − 0.57 × 16) ≈ 218.4 mm, which agrees.

Its draw ratio on a 100 mm punch is 218.4 ÷ 100 ≈ **2.18**. That is beyond a typical single draw of stainless steel, and, as Chapter 3 shows, it means a first draw to a larger diameter followed by one or more redraws. The deeper cover is possible, but not simply by drawing further: every extra 10 mm of height adds about 3,142 mm² to the blank's area, and the draw plan must be redone.
