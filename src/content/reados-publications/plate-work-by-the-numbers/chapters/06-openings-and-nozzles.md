---
book: plate-work-by-the-numbers
chapterSlug: openings-and-nozzles
order: 6
title: "Openings and nozzles in a rolled shell"
description: "Cut the Ø500 manway into the shell: which surfaces touch, cut depths, the hole marked on flat plate in arcs, set-in and set-on nozzles, and a round hole that rolled 5 mm narrow."
draft: false
---

An opening in a rolled shell is a branch meeting a main, the same intersection that sheet metal workers develop for duct tees. In plate, the intersection has thickness on both sides. The neck has an inside and an outside surface, the shell has an inside and an outside surface, and at each point around the opening a different pair of them makes contact. The pattern maker has to know which pair, because the difference between them is a few millimetres of cut depth and a few millimetres of hole width, enough to leave a gap a welder cannot bridge or a neck that will not enter its hole.

This chapter cuts the running case's Ø500 manway into the lower course of the shell. It works out the neck's cut on each surface, marks the hole on the flat plate before rolling, compares set-in and set-on construction using a smaller Ø300 nozzle, and ends with a manway hole that was marked as a plain circle and rolled 5 mm too narrow.

## The manway

This is an illustration. The manway is a short neck of 6 mm plate, rolled to 500 mm inside diameter, so its outside diameter is 512 mm, set into the lower course with its axis horizontal and square to the shell, centred at the 0° datum and 600 mm above the bottom of the course. It is **set in**: the neck passes through a hole in the shell and is welded to the shell inside and out. A bolted cover closes it, but the cover and its flange belong to the designer's detail.

The shell's lower course has an inside radius of 1,200 mm, a mean radius of 1,203 mm and an outside radius of 1,206 mm. The neck's inside radius is 250 mm and its outside radius 256 mm.

## Which surfaces touch

Look along the shell's axis at the manway. Around the neck, at the points where the neck is cut by the plane containing the shell's axis, the shell's surface is a straight line, and the neck's end is square there. At the sides of the neck, 90° around from those points, the shell curves away, and the neck must reach further in to meet it. How much further depends on which of the neck's surfaces is meeting which of the shell's.

The general formula is the one for any branch on a main: a neck surface of radius r, at angle φ around the neck, meets a shell surface of radius R at a depth below the shell's top line of

depth(φ) = R − √(R² − r² sin² φ)

and the greatest depth, at φ = 90°, is R − √(R² − r²).

```figure
type: compare
title: Greatest cut depth of the manway neck, by surface pair
rowhead: Neck surface meeting shell surface
cols: Neck radius, mm | Shell radius, mm | Depth at the sides, mm
caption: The four surface pairs differ by up to 1.3 mm at the sides of the neck. A set-in neck is cut to the shell's inside surface at its inner end and passes through the shell's outside surface at the hole.
- Outside on outside | 256 | 1,206 | 27.48
- * Outside on inside | 256 | 1,200 | 27.62
- Mean on mean | 253 | 1,203 | 26.90
- Inside on inside | 250 | 1,200 | 26.33
```

For the set-in manway, the neck's outside surface passes through the hole and its inner end finishes flush with the shell's inside surface. The neck's inner end is therefore cut so that its **outside surface** meets the **shell's inside surface**: a greatest depth of **27.62 mm** at the sides. Its inside surface is then a little short of the shell's inside surface at the sides, by 27.62 − 26.33 = 1.3 mm, which is within the weld on the inside.

The neck's end is developed like any branch: girth line on its mean diameter, 12 divisions, and a cut depth at each line. The cut depths for the neck's outside surface on the shell's inside surface, at 30° steps from φ = 0°, are 0.0, 6.8, 20.7 and 27.6 mm, repeating. For a neck this small relative to the shell, the cut is a shallow double wave.

## The hole on the flat plate

The manway's hole is cut in the lower course's plate before it is rolled, because a hole near the middle of a 3,777 mm plate is much easier to cut flat on the plasma table than in a curved course. The hole's outline must therefore be marked on the flat plate so that, after rolling, it fits the neck.

Two facts set the outline.

1. **Along the shell's axis**, the hole's height is unchanged by rolling, because rolling bends the plate only around the girth. The hole is 512 mm high, the neck's outside diameter, plus whatever clearance the welding procedure asks for.
2. **Around the girth**, the plate's mean surface keeps its length, while its inside surface shortens and its outside surface lengthens. A hole cut square to the flat plate becomes, after rolling, an opening whose sides are radial, narrower at the inside surface than at the outside.

The neck's 512 mm outside must pass through the narrowest part of the opening, at the shell's inside surface. An arc length s on the mean line subtends an angle s ÷ 1,203 radians, and at the inside surface that angle spans a chord of 2 × 1,200 × sin(s ÷ 1,203). Setting that chord equal to 512 mm gives a half-width on the mean line of **258.63 mm**, a full width around the girth of **517.3 mm**.

So the hole on the flat plate is 512 mm high and 517.3 mm wide, before clearance. It is not a circle. Its outline is plotted by points: for each height y above or below the hole's centre, the neck's half-width at that height, √(256² − y²), is converted to a mean-line arc in the same way. On the flat plate the hole looks like a circle stretched sideways by about 1%.

```figure
type: formula
title: Width of a hole marked on flat plate before rolling
formula: chord at the inside surface = 2 × Rᵢ × sin(s ÷ Rₘ)
formula: half-width on the mean line, s = Rₘ × asin(c ÷ (2 × Rᵢ))
caption: The running case's manway: neck outside diameter 512 mm, shell inside radius 1,200 mm, mean radius 1,203 mm. The hole's height along the shell's axis is unchanged by rolling.
- s | Half-width of the hole on the flat plate, measured on the mean line
- c | Width the opening must have at the inside surface, the neck's outside diameter
- Rᵢ, Rₘ | Inside and mean radii of the shell
step: s = 1,203 × asin(512 ÷ 2,400) = 1,203 × 0.21499 = 258.63 mm
step: Hole on the flat: 517.3 mm wide around the girth, 512 mm high along the axis
step: Check: after rolling, inside chord = 2 × 1,200 × sin(258.63 ÷ 1,203) = 512.0 mm
```

## Placing the hole on its plate

The manway is centred at 0°, and Chapter 2 put the lower course's seams at 45° and 225°. The hole therefore falls on the plate that runs from 225° round through 0° to 45°, three quarters of the way along it. Measured on the mean line from the seam at 225°, 0° is 135° ÷ 360° × 7,558.7 = 2,834.5 mm away, and the plate's edge is half a root gap, 1 mm, short of the seam's centre. The hole's centre is marked **2,833.5 mm** from that plate's 225° edge and 600 mm above its bottom edge.

Both numbers are mean-line distances, and the hole's centre lies on a line that rolls true. The plater marks the hole's centre lines on both faces of the plate, punches them, and carries the vertical centre line up to the top edge of the plate, where it becomes the 0° datum for the whole bin.

## Rolling a plate with a hole in it

A large hole changes how a plate rolls. The plate is weaker across the hole, so the rolls bend it more easily there, and a plate rolled with a 517 mm hole in it tends to curve more tightly through the hole's width and leave a slight flat or kink on either side. The effect is worst when the hole is close to an edge or a large share of the plate's width.

Shops deal with it in one of three ways. Some cut the hole but leave two or three narrow bridges across it, uncut, so that the plate rolls as if whole, and cut the bridges after rolling. Some mark the hole on the flat, roll the plate whole, and cut the hole in the rolled course with a plasma torch following the marked line. Some cut the hole flat and accept a little local correction with the template on either side. The running case's shop leaves bridges, because the hole's outline is then cut accurately on the table and only the short bridge cuts are made by hand.

Whichever method is used, the template checks of Chapter 3 are repeated close to the hole on both sides, because that is where a rolled course with an opening is most likely to be out of round.

## Set-on and set-in nozzles

Not every opening is set in. A **set-on** nozzle sits on the outside of the shell, its end cut to the shell's curvature, and is welded around its outside; the hole in the shell is the nozzle's bore. Set-on construction is simpler to fit and suits small nozzles; set-in construction gives a stronger, more easily inspected joint for large ones. Which to use is the designer's decision.

This is an illustration. The bin has a Ø300 inspection nozzle in the upper course, set on, rolled from 6 mm plate, so its inside radius is 150 mm and its outside 156 mm. Its end sits on the shell's outside surface, radius 1,206 mm.

A set-on nozzle is cut so that its **inside** edge touches the shell all round, so that the weld's root is closed. At the sides, the inside edge drops 1,206 − √(1,206² − 150²) = **9.36 mm**, while the outside edge at the same point would need to drop 10.13 mm to touch. The 0.77 mm difference becomes a small open bevel on the outside, which the weld fills.

The hole in the shell is the nozzle's bore. Marked on the flat plate so that it is 300 mm wide at the shell's outside surface, its half-width on the mean line is 1,203 × asin(150 ÷ 1,206) = 150.02 mm: almost exactly 300 mm, because a hole this small subtends only a small angle. At the shell's inside surface the same hole is 298.5 mm wide, a lip of 0.75 mm each side that the designer can accept or have dressed.

## Reinforcement

A hole in a shell removes plate that was carrying load, and openings in loaded shells are commonly reinforced, with a thicker neck, a thicker insert plate in the shell, or a pad plate welded around the opening. The size and shape of reinforcement are structural design matters for the drawing, set by the designer under the standards that apply to the structure. For the pattern maker, a pad is another plate with a hole in it, rolled to the shell's outside radius and developed the same way: its hole on the mean line of the pad, its outline marked by arcs, and its own small saddle where it laps the neck.

## The error: a round hole rolled narrow

This is an illustration. On the first lower course plate, the manway hole was marked as a 512 mm circle on the flat and cut on the plasma table. After rolling, the opening's width around the girth was 2 × 1,200 × sin(256 ÷ 1,203) = **506.9 mm** at the inside surface, 508.1 mm on the mean line and 509.4 mm at the outside. The neck, 512 mm across its outside, would not enter: it fouled by 5.1 mm at the inside surface and 2.6 mm at the outside.

The fit-up crew found it when they offered the neck to the hole and saw it stand off on both sides. The fix was to grind each side of the opening back by about 2.6 mm at the inside surface, tapering to 1.3 mm at the outside, by hand, around a curved edge in a rolled course. It took most of a shift, and the ground edge needed rework to restore the weld preparation.

The cause was treating the hole as the shape it should appear after rolling, rather than the shape it must have on the flat. The shop's cutting files for openings in rolled plate are now generated from the formula above, point by point, and its checklist asks for the hole's width "on the flat, mean line" as a separate number from its height.

```figure
type: bars
title: Width around the girth of a 512 mm circle cut flat, after rolling
unit: mm
max: 520
caption: The neck needs 512 mm at every surface. A plain circle is narrowest where it matters most, at the shell's inside surface.
- Required, at every surface | 512
- * Inside surface | 506.9
- Mean surface | 508.1
- Outside surface | 509.4
- Correct flat width on the mean line | 517.3
```

## Exercise: a hole near the top

Suppose the designer changes the Ø300 inspection nozzle in the upper course from set-on to set-in construction, so that its 312 mm outside diameter passes through the shell. Find the hole's width on the flat plate and the neck's greatest cut depth at its inner end.

**Worked answer.**

- Half-width on the mean line: s = 1,203 × asin(312 ÷ 2,400) = 1,203 × 0.13037 = **156.84 mm**, so the hole is **313.7 mm** wide around the girth and 312 mm high along the axis, before clearance.
- Inner end of the neck, its outside surface on the shell's inside surface: depth = 1,200 − √(1,200² − 156²) = **10.18 mm** at the sides.

The hole is 1.7 mm wider on the flat than the neck, a smaller correction than the manway's 5.3 mm because the nozzle subtends a smaller angle of the shell. For both, the correction grows faster than the opening's size, partly from the plate's thickness and partly from the curvature, which is why it is easy to ignore on small nozzles and costly to ignore on manways.
