---
book: roof-lights-by-the-numbers
chapterSlug: glass-bars-and-loads
order: 3
title: "Glass, glazing bars and the loads they carry"
description: "Choose glass for overhead glazing, schedule RL-24's twelve panes, find their weights, and check the common bars and ridge for bending and deflection under wind uplift."
draft: false
---

A glazed roof light is a small structure. Its glass spans between bars, the bars span between the kerb, the hips and the ridge, and every load, the glass's own weight, wind pressing down, wind sucking up, a hailstorm, must find its way to the kerb and into the roof framing. Overhead glass also carries a risk that vertical glass does not: if it breaks, it falls on the people below. The choice of glass and the sizing of the bars are therefore the first structural decisions, and they are made with numbers.

This chapter chooses the glass for RL-24, schedules its twelve panes, works out their weights and the forces on their setting blocks, and checks a common bar and the ridge under wind uplift. The failure case is an order of coated triangular panes that arrived all of one hand.

## Glass for overhead glazing

Glass in roofs is **overhead glazing**, and in Australia its selection and installation fall under AS 1288, *Glass in buildings: Selection and installation*, called up by the National Construction Code. AS 4285, the rooflights standard, applies to factory-made rooflights and by its published scope excludes site-built overhead glazing systems, so a roof light like RL-24 is designed to AS 1288 and the Code directly. This book does not quote the standard's requirements; the glazier and designer must work from the current edition.

The practical consequence is that overhead glass is chosen so that, if it breaks, it stays in place rather than falling. Laminated glass, two or more plies bonded to a plastic interlayer, does this: when a ply cracks, the fragments stay stuck to the interlayer. RL-24 is glazed with **6.38 mm laminated glass**, two 3 mm plies on a 0.38 mm interlayer, in a performance laminate with a solar-control coating on its inner ply. Chapter 6 considers a double-glazed unit for condensation; this chapter works with the single laminate.

### The weight of glass

Glass has a density of about 2,500 kg/m³. Each millimetre of glass thickness weighs about 2.5 kg per square metre, so the 6 mm of glass in a 6.38 mm laminate weighs about **15 kg/m²**, a pressure of about **0.147 kPa** when lying flat. That is small compared with wind, but it acts all the time, and on a sloping pane part of it tries to slide the glass downhill.

## RL-24's pane schedule

Chapter 4 sets out the bars. For this chapter, it is enough to know that each long face has a centre common bar and a common bar at each end of the ridge, dividing it into two rectangles and two triangles, and each hipped end has one centre common bar dividing it into two triangles. Every bar is 662.0 mm long on the slope from the eaves frame to the ridge, and the panes are 600 mm wide at the eaves.

```figure
type: compare
title: RL-24's twelve panes, by bar centre-lines
cols: Shape and size on the slope | Area each | Number
caption: This is an illustration. All eight triangles are the same 600 × 662 mm right triangle, but four are left-handed and four right-handed. With a coating on one face, a left-hand pane cannot be turned over to serve as a right-hand one.
- Long-face rectangles | 600 × 662 mm | 0.3972 m² | 4
- *Long-face triangles | right triangle, 600 base, 662 high | 0.1986 m² | 4, two of each hand
- End-face triangles | right triangle, 600 base, 662 high | 0.1986 m² | 4, two of each hand
- Total | | 3.178 m² | 12
```

The total, 3.178 m², agrees with the sloping area found in Chapter 1 from the plan area divided by cos 25°. Checking the schedule against an independent calculation like this catches a missing or doubled pane before any glass is ordered.

### From bar centre-lines to glass sizes

The schedule is in bar centre-lines; the glazier needs cut sizes. RL-24's bars show a **40 mm** sightline, and the eaves frame 50 mm. Each bar has a rebate 16 mm deep from its face to its web, and the glass sits **12 mm** into each rebate, its **bite**, leaving 4 mm clearance at each edge for movement and setting.

For a rectangle, the clear width between bar faces is **600 − 40 = 560 mm**, and the glass is **560 + 2 × 12 = 584 mm** wide. Along the slope, the clear length from the eaves frame to the ridge bar is **662 − 25 − 20 = 617 mm**, and the glass is **617 + 24 = 641 mm** long. Each rectangular pane is cut **584 × 641 mm**. The triangles are cut to templates taken from the assembled bars in the shop, with the calculated size used only as a check: a triangular pane depends on two angles as well as two lengths, and a template catches any difference between the drawing and the bars as made.

## Loads on the glass and bars

Three loads govern RL-24:

- **Self-weight**, 0.147 kPa, always acting downwards.
- **Wind pressing down**, taken here as a teaching value of 0.5 kPa.
- **Wind uplift**, the suction on the roof light's upper surface, taken here as a teaching value of 1.2 kPa.

The real values come from AS/NZS 1170.2 for the site's wind region, terrain, height and the roof light's position on the roof, and they are often largest near roof edges and corners. Uplift usually governs a small, light roof light: the glass's own weight helps to resist it, but only by about 0.15 kPa against 1.2 kPa. Hail and the possibility that someone stands on the glass are covered in Chapter 8.

```figure
type: stats
title: The weight of RL-24's glass and what it does
caption: This is an illustration with 6 mm of glass at 2,500 kg/m³. The downhill force is carried by two setting blocks at the bottom edge of each pane.
- *About 48 kg | All twelve panes | 3.178 m² × 15 kg/m²
- 5.96 kg | One rectangular pane | 0.3972 m² × 15 kg/m²; weight about 58.4 N
- 24.7 N | Downhill force on its setting blocks | 58.4 N × sin 25°
- 2.98 kg | One triangular pane | half a rectangle
```

The setting blocks matter more than their size suggests. If a pane is not supported at its lower edge, it creeps downhill over the years, its bite on the upper bar shrinks and the seal fails. RL-24's panes each sit on two hard rubber setting blocks at the eaves frame, at about a quarter of the pane's width from each corner.

## Checking a common bar

The centre common bar on each long face carries half of each rectangle on either side: a strip **600 mm** wide. Under the teaching uplift of 1.2 kPa, that is a line load of **1.2 kN/m² × 0.6 m = 0.72 kN/m**, or 0.72 N/mm, along its 662 mm length. Treated conservatively as simply supported at the eaves frame and the ridge, the bar's maximum bending moment and deflection follow from the standard beam formulas.

```figure
type: formula
title: RL-24's centre common bar under wind uplift
formula: M = wL² ÷ 8        δ = 5wL⁴ ÷ (384EI)        σ = M ÷ Z
caption: This is an illustration. The bar's second moment of area I and section modulus Z are teaching values for a small aluminium glazing bar; real values come from the bar maker's section data, and the stress is compared with the allowable stress the maker or the aluminium structures standard gives.
- Line load w | 1.2 kPa × 0.6 m = 0.72 N/mm
- Span L | 662 mm, eaves frame to ridge
- Moment M | 0.72 × 662² ÷ 8 ≈ 39,400 N·mm
- Stress σ, with Z = 2,500 mm³ | 39,400 ÷ 2,500 ≈ 15.8 MPa
- Deflection δ, with E = 70,000 MPa and I = 40,000 mm⁴ | about 0.64 mm, span ÷ 1,029
step: The common bar is lightly loaded; the small numbers are typical of short bars at close spacing
```

For a short bar at 600 mm spacing, the numbers are small. They would not be if the bars were spaced at 1,200 mm and twice as long: the moment grows with the spacing and with the square of the span, and the deflection with the spacing and with the fourth power of the span. A designer who doubles a roof light's size and keeps its bars should expect the moment to rise about eightfold and the deflection about thirty-twofold.

## The ridge carries more

The commons on the two long faces rest on the ridge at its middle. Each common delivers half of its 476.6 N uplift to the ridge, and two of them meet there, one from each face, so the ridge receives a point load of about **476.6 N** at its centre. The ridge spans **1,200 mm** between the hip junctions at its ends.

```figure
type: bars
title: Bending moment in RL-24's members under the teaching uplift
unit: N·m
max: 160
caption: This is an illustration. The ridge's moment, PL/4 = 476.6 × 1,200 ÷ 4 ≈ 143,000 N·mm, is about 3.6 times the common bar's, so the ridge is made from a deeper section. The hip bars carry only part of the triangular panes beside them.
- Centre common bar, 662 mm | 39.4
- *Ridge, 1,200 mm, central point load | 143.0
```

With a teaching ridge section of I = 120,000 mm⁴ and Z = 6,000 mm³, the ridge deflects about **2.04 mm**, span ÷ 587, and its stress is about **23.8 MPa**. Those are acceptable for teaching purposes, but they show where the design is sensitive. If the ridge were made from the same small section as the commons, its deflection would be three times as large and visible as a sag in the ridge line on a sunny day.

Each hip bar takes roughly a third of each of the two triangular panes beside it, about 0.132 m² of glass and **159 N** of uplift spread along its 893.5 mm length. The hips are longer than the commons but lighter loaded; they are sized mainly by the geometry of their glazing rebates, which Chapter 4 works out.

## Hail, snow and people

Wind and self-weight are not the only actions on overhead glass. Hail strikes the glass at speed, and a large hailstone can crack a ply; a laminate keeps the fragments in place, but the pane must then be replaced. Snow, in the alpine areas where it is a design load, lies on a low-pitched roof light and adds to its weight; at 25°, much of it slides off, but drifts against the ridge or kerb can be deep. The designer takes both from the loading standards and the site's conditions rather than from this book.

People are the third case. A roof light is not a floor, and RL-24 is designed as non-trafficable: nobody is meant to stand or kneel on it. Yet the people most likely to stand on it are the very people working on the roof around it, for whom a fall through the glass would be catastrophic. Chapter 8 deals with that risk and its controls. For the structural design, the important point is that the glass and bars are not designed to carry a person, and the drawing and the handover documents say so plainly.

## Tolerances on the bars

The pane sizes above assume the bars are where the drawing puts them. In practice, each bar's position along the eaves frame and at the ridge carries a tolerance, and the errors add up across a face. RL-24's frame is assembled on a flat, square jig in the shop, and the bar positions are checked with a tape from both ends of each face before any glass is ordered. A bar 3 mm out of position changes the clear width on each side of it by 3 mm; with 12 mm of bite and 4 mm of edge clearance, a 3 mm error is tolerable, but a 6 mm error is not, because the glass would then sit hard against one web and have only 6 mm of bite on the other side. Measuring before ordering costs a few minutes; reordering a laminate costs days.

## Where the loads go next

The commons, hips and ridge deliver their loads to the eaves frame, and the eaves frame to the kerb through its fixings. Chapter 7 sizes those fixings for uplift. The load path is only as strong as its weakest link, and in practice that is usually the fixing of the frame to the kerb, or the kerb to the roof framing, not the bars.

## A failure case: the wrong-handed triangles

This is an illustration. On an earlier hipped roof light with eight identical triangular panes in coated laminate, the shop sent the glazier a schedule listing "8 triangles, 600 × 662". The glazier ordered eight identical panes, all cut with the coating on the same face as the first template.

On site, the first four went in correctly. The next four, on the opposite hands, would only fit with their coating facing outwards, where it was not designed to be exposed and where the solar control would not work as specified. The detection came at glazing, when the installer checked the coated face of each pane with a coating detector before fitting it, as the shop's procedure required.

The correction was to reorder four panes with the coating on the opposite face and to leave the roof light covered with a temporary sheet for two weeks. The shop's pane schedule now lists every triangular or otherwise asymmetric pane by hand, left or right as seen from outside, and marks the coated face on each template.

## How this applies to a small Australian business

Treat a roof light as a structure. Choose overhead glass with the glazier under AS 1288 and the Code, and plan for laminated glass that stays in place when broken. Schedule every pane, check the total area against the sloping area, convert centre-lines to cut sizes with the bar's rebate and bite, and template the triangles. Support every pane on setting blocks at its lower edge. Check the bars and especially the ridge for bending and deflection under the site's real wind uplift, using the bar maker's section data.

## Exercise: wider bar spacing

A larger roof light for another job is proposed with common bars at **900 mm** spacing and **800 mm** long on the slope, using the same bar section as RL-24's commons (I = 40,000 mm⁴, Z = 2,500 mm³) and the same teaching uplift of 1.2 kPa. What are the line load, bending moment, stress and deflection of a common bar? What does one 900 × 800 mm pane of 6.38 mm laminate weigh? Is reusing RL-24's bar sensible?

**Worked answer.** The line load is **1.2 × 0.9 = 1.08 N/mm**. The moment is **1.08 × 800² ÷ 8 = 86,400 N·mm**, about **2.2 times** RL-24's, and the stress is **86,400 ÷ 2,500 ≈ 34.6 MPa**. The deflection is **5 × 1.08 × 800⁴ ÷ (384 × 70,000 × 40,000) ≈ 2.06 mm**, span ÷ 389, more than three times RL-24's. One pane of **0.9 × 0.8 = 0.72 m²** weighs about **10.8 kg**. The stress may still be within the maker's allowable value, but the deflection is no longer negligible, and the glass itself must be checked by the glazier for the longer span. Reusing the bar without checking would be a mistake; a deeper common bar, or the original 600 mm spacing, is the safer starting point.
