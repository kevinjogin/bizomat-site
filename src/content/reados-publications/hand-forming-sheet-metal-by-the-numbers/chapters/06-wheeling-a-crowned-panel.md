---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: wheeling-a-crowned-panel
order: 6
title: "Wheeling a crowned panel"
description: "Measure a crowned panel by its sagitta and arc length, see how little stretch it needs, plan wheeling tracks and templates, and catch over-wheeled edges that left the panel loose."
draft: false
---

A dome needs a lot of stretch in a small area. A gently crowned panel, curved a little in both directions, needs very little stretch spread over a large area. That is the work the **English wheel** does best: a large, flat-faced upper wheel and a small, crowned lower wheel, called the anvil, squeeze the sheet between them as the worker rolls it back and forth. Each pass stretches a narrow track of metal very slightly. Hundreds of overlapping passes stretch the middle of a panel just enough to crown it, and leave a surface smooth enough to need little planishing.

This chapter measures HF-01's side access panel by its crown, shows how small the stretch is, plans the tracking and the templates, and describes what happens when the edges are wheeled along with the middle.

## Measuring a crown

A crowned panel is described by its curvature in two directions. Over any chord, a curve of radius R rises above the chord by its **sagitta**, s = R − √(R² − c² / 4), where c is the chord length. The sagitta is what a worker can measure: lay a straightedge across the panel and measure the gap at the middle.

This is an illustration. HF-01's side access panel is 600 × 300 mm, crowned with a radius of 1,200 mm along its length and 900 mm across it, to match the original housing.

```figure
type: formula
title: Sagitta and arc length of HF-01's panel crown
formula: s = R − √(R² − c² / 4)     arc = 2R × asin(c / 2R)
caption: This is an illustration. The sagitta is the height of the arc above its chord; the arc length is the length along the surface. Both are for the panel's centre lines.
- R | Radius of the crown, 1,200 mm along and 900 mm across
- c | Chord, 600 mm along and 300 mm across
step: Along: s = 1,200 − √(1,200² − 300²) = 38.1 mm; arc = 606.4 mm, 1.07% longer than the chord
step: Across: s = 900 − √(900² − 150²) = 12.6 mm; arc = 301.4 mm, 0.47% longer than the chord
```

The sagittas are easy to measure and check: 38.1 mm along, 12.6 mm across. The arc lengths show how little stretch is involved. Along its centre line, the panel's surface is about 1% longer than the flat blank; across it, about half a per cent. That is the order of strain the wheel must put into the middle of the panel relative to its edges, a small fraction of what the top of HF-01's dome took. Thinning is negligible: a 1% stretch in each direction reduces 1.6 mm sheet by about 0.03 mm.

### Why the middle, not the edges

A panel curved in only one direction, like a section of a cylinder, needs no stretch at all; it can be rolled. A panel curved in two directions in the same sense, like a shallow dome, cannot be made by bending alone, because its middle must be longer, in every direction, than its edges. Stretching the middle while leaving the edges alone produces exactly that, and the panel takes up a crown. Stretching the edges more than the middle produces the opposite, an edge too long for the middle, which ripples or flips, as the error later in this chapter shows.

A panel curved in two directions in opposite senses, a saddle, like the inside of a mudguard's flare or the waist of a fairing, needs the reverse: its edges must be longer than its middle. A saddle is wheeled by stretching the edges and leaving the middle alone, or made by shrinking the middle, which is much harder. Recognising which kind of curvature a panel has, before the first pass, decides where every track goes. The paper test from Chapter 1 tells at once: paper laid on a crown wrinkles at its edges, and paper laid on a saddle splits or gapes there.

## Templates

A crowned panel is checked with two templates, one along and one across the centre lines, cut to the arcs. Their heights at points along the chord come from z = √(R² − x²) − (R − s), where x is the distance from the panel's centre.

```figure
type: bars
title: Template heights for HF-01's crowned panel, along the 600 mm length
unit: mm
max: 40
caption: This is an illustration. z = √(1,200² − x²) − (1,200 − 38.1) for x from the panel's centre. The cross template, over 300 mm with R = 900 mm, has heights of 12.6 mm at the centre and 9.5 mm at 75 mm out.
- Centre, x = 0 | 38.1
- x = 100 mm | 33.9
- x = 200 mm | 21.3
- Edge, x = 300 mm | 0
```

The workshop cuts its panel templates from thin plywood with a reference edge, marks the arcs with a trammel, and checks the heights above before using them. Plywood templates are lighter and cheaper than metal ones, and a panel of this size is checked often enough during wheeling that a template that can be held in one hand is worth having. HF-01's panel tolerance, agreed with the customer to match the original housings, is ±1.5 mm against both templates.

## Choosing the anvil

English wheels come with a set of anvils, lower wheels whose rims are crowned to different radii, from nearly flat to quite tight. The anvil's crown sets how concentrated each pass's stretch is. A tight anvil contacts a narrow track and stretches it hard; a flat anvil contacts a broad track and stretches it gently.

The rule most workers follow is to use the flattest anvil that will produce the crown, because flatter anvils leave a smoother surface and spread the stretch more evenly. For a panel crowned to 900 mm across and 1,200 mm along, a nearly flat anvil is the right start, with a slightly tighter one in reserve if the crown comes too slowly. The anvil's crown should always be tighter than the panel's tightest curve, otherwise the anvil would touch the panel at its edges rather than its middle.

## Tracking

The worker sets light pressure, puts the panel between the wheels, and rolls it back and forth, moving it sideways a little after each pass so that the tracks overlap. The pattern of tracks decides where the stretch goes.

```figure
type: steps
title: Wheeling plan for one HF-01 panel
caption: This is an illustration of the workshop's plan. Tracks stop short of the edges so that the edges stay short relative to the middle. Pressure is set low and raised a little at a time.
- Mark the panel | centre lines, and a boundary 40 mm in from every edge
- First pattern | tracks along the length, overlapping by half their width, inside the boundary
- Check | both templates; measure the centre sagittas with a straightedge
- Cross pattern | tracks across the width, inside the boundary
- Check | both templates again; adjust pressure, not the boundary
- Blend | lighter tracks reaching nearer the edges to smooth the transition
- Finish | planish any marks; final template check within ±1.5 mm
```

Changing direction between patterns spreads the stretch evenly in both directions, which a crown curved both ways needs. Light pressure and many passes produce a smoother, more even result than heavy pressure and few. The workshop's planning figure for wheeling one HF-01 panel to shape is 2.0 hours, including checks.

### Pressure and the wheel's limits

An English wheel stretches by squeezing, and how hard it squeezes is set by the gap between the wheels, adjusted with a screw under the anvil. Too much pressure leaves visible tracks, stretches the sheet unevenly and can stretch the panel past the shape before the worker notices. The habit that works is to raise pressure only after a full pattern has been run and checked.

A wheel also has a throat, the distance from the wheels to the frame behind them, which limits how far into a panel the wheels can reach. A 600 × 300 mm panel fits most wheels comfortably in either direction; larger panels may need to be wheeled from both sides of the frame, or in sections joined afterwards.

## The error: over-wheeled edges

This is an illustration. The first HF-01 panel was wheeled by a worker who ran every track the full length of the panel, from edge to edge, to save the time of marking a boundary. After two patterns, the centre sagittas were close to their targets, but the panel would not sit still on the bench: pressed at the centre, it popped through to curve the other way, and pressed back, it popped again. Its long edges also showed a slight wave when sighted along their length.

The panel was **loose**. Wheeling its edges had stretched them along with the middle, so the edges were now too long for the crown, and the panel, like an oil-can base, had two stable shapes and flipped between them. The same thing happens with any sheet whose edges are longer than its middle, and it is the reason the workshop's plan stops tracks short of the edges.

The cure is to shorten the edges again. The worker took the shrinker along both long edges, small bites about 10 mm in from the edge and spread evenly, then planished the bites flat. After a few bites per edge, the panel stopped flipping and settled into its crown. A final light pattern inside the boundary brought the sagittas back to the templates. The correction took about 45 minutes. The workshop's plan now marks the 40 mm boundary in marker on every panel before wheeling, and the worker checks for looseness by pressing the centre after every pattern, not only at the end.

## Planishing a panel

A wheeled panel usually needs little planishing, because the wheel's broad, smooth contact leaves a fair surface. Small dents from handling, and any short tracks where the panel was turned, are planished with a planishing hammer over a dolly of roughly the panel's curvature, or with a pneumatic planishing hammer, which runs much faster and leaves a finer finish but is loud and transmits vibration to the hands. Chapter 8 discusses both. The surface is checked under raking light, as for the dome.

### Alternatives to the wheel

Two other routes produce crowned panels. A **buck**, a timber or foam former shaped to the panel, lets the worker hammer the sheet over a known shape, which is useful when several identical panels are needed. And **stretch forming**, where a panel is gripped at its ends and pulled over a former, makes crowned panels quickly in production with tooling. For two panels, the wheel needs no tooling and is the obvious choice.

## Reading a panel by light and touch

Templates check the shape along two lines. Between them, a panel can still have low spots, high spots and short flat areas that the templates miss. Workers find these in two ways.

**Raking light.** A lamp held low beside the panel throws a long shadow from any bump and a bright highlight on any hollow. Moving the lamp around the panel shows the surface's flaws as a pattern. Reflections of a straight edge, such as a fluorescent tube or a ruler held above the panel, are even more sensitive: on a fair crown the reflection is a smooth curve, and any kink in it marks a flaw.

**Touch.** Running a flat hand, or a hand in a thin cotton glove, slowly across the panel picks up variations of a fraction of a millimetre that the eye misses. Many panel workers check by touch before they check by template, because touch finds where to look.

A low spot in a wheeled panel is usually an area that has had less stretch than its neighbours; a few short, light tracks across it bring it up. A high spot has had more; it is lowered by stretching around it, never by hammering it down, which only moves the excess elsewhere. The same logic corrected the over-sunk dome in Chapter 4.

## Fitting and trimming

The panel's blank is cut oversize, because wheeling, like raising, does not leave the edges exactly where the drawing puts them, and because the panel must be trimmed to fit the housing's opening. This is an illustration. The workshop cuts HF-01's panel blanks 620 × 320 mm, 10 mm oversize on every side. After wheeling, the panel is offered to the housing, the trim line is scribed from the housing's opening, and the panel is trimmed, filed and offered again. Its edges are then folded or fastened as the housing requires.

Trimming after forming has a practical advantage beyond accuracy. The outer 10 mm of each edge is where wheeling stops short and where handling marks gather, and it is cut away. The finished panel's edge is clean metal from inside the worked area. The blank's mass, 0.87 kg in 1.6 mm sheet at 2,730 kg/m³ before trimming, falls to about 0.79 kg for the trimmed 600 × 300 mm panel.

## Time records for wheeling

Wheeling time varies more between workers than any other operation in this book, because it depends on how well the worker reads the panel between patterns. The workshop records the time for each panel against its plan, along with the anvil used, the number of patterns and any corrections. This is an illustration. HF-01's first panel took 2.75 hours including the 45-minute correction for looseness; the second, wheeled with the boundary marked from the start, took 1.9 hours, just under the 2.0-hour plan. The difference is the cost of one habit, and the records make it visible to the next worker.

## Exercise: a flatter crown

A customer for another job asks for a panel of the same size, 600 × 300 mm, but with a crown of 2,000 mm radius along and 1,500 mm across.

1. What are the centre sagittas and the arc length excesses?
2. What does that mean for wheeling time and for the risk of a loose panel?

**Worked answer.**

1. Along: s = 2,000 − √(2,000² − 300²) = **22.6 mm**; arc = 2 × 2,000 × asin(0.15) = 602.3 mm, **0.38%** longer than the chord. Across: s = 1,500 − √(1,500² − 150²) = **7.5 mm**; arc = 300.5 mm, **0.17%** longer.
2. The stretch needed is about a third of HF-01's panel's, so fewer passes and less wheeling time. But a flatter panel is more prone to looseness, not less: with so little crown, a small amount of unwanted stretch at the edges is a larger fraction of the total, and a flatter shell has less geometric stiffness to resist flipping. The boundary rule, the check for looseness after every pattern, and light pressure matter even more on a nearly flat panel.
