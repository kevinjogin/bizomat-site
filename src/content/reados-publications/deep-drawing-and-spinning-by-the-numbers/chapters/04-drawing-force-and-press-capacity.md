---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: drawing-force-and-press-capacity
order: 4
title: "Drawing force and press capacity"
description: "Estimate the punch force a draw needs from the wall's strength, add the blank holder's force, see where in the stroke a press can supply it, and catch a mechanical press rated at the wrong height."
draft: false
---

A press that cannot supply the force a draw needs stalls, overloads or, worse, finishes the stroke with a cup that has torn because the press slowed and the flange stuck. A press much larger than needed costs more to buy, to run and to tool, and can damage a die if something goes wrong. Choosing the press for a drawn part therefore starts with an estimate of the force it needs and of how that force varies through the stroke, and with an honest reading of what the press can deliver at each point.

This chapter estimates the drawing force from the strength of the cup's wall, adds the blank holder's force, considers the energy each stroke uses, and compares the force a draw needs with what mechanical and hydraulic presses can supply at different heights in their stroke. The running case finds that SC-100's first draw was assigned to a 250 kN mechanical press whose rated force was available only in the last few millimetres of its stroke, while the draw needed its peak force about 40 mm higher.

## The wall sets the upper limit

The punch's force reaches the flange through the cup's wall, so the drawing force can never exceed what the wall can carry in tension. That gives a simple upper bound: the wall's cross-sectional area times the material's tensile strength.

```figure
type: formula
title: Upper-bound estimate of the drawing force
formula: F_draw ≤ π × d × t × R_m
caption: This is an illustration for SC-100's first draw, with an illustrative tensile strength of 600 MPa for annealed 304 stainless steel. The real force is lower at modest draw ratios and approaches this bound near the limiting ratio.
- d | Punch diameter, mean, mm
- t | Sheet thickness, mm
- R_m | Tensile strength of the sheet, MPa
step: First draw: π × 115 × 0.8 × 600 ≈ 173,400 N, about 173 kN
step: Redraw: π × 100 × 0.8 × 600 ≈ 150,800 N, about 151 kN, before allowing for work hardening
step: The same first draw in a mild drawing steel at an illustrative 340 MPa: about 98 kN
```

At low draw ratios, the force needed is well below the wall's capacity, and the draw is easy. As the ratio approaches the limit, the force needed approaches the capacity, and at the limit it reaches it, which is exactly why the cup tears. The upper bound is therefore a safe figure for choosing a press: the draw cannot need more, because the cup would have torn. Toolmakers refine it with factors for the draw ratio, friction and bending at the die radius, or with measurements from a load monitor on the press, but for a first choice the upper bound is conservative and quick.

Stainless steel's higher strength shows plainly. The same first draw needs nearly twice the force in 304 as in a mild drawing steel, and its redraw needs more than the simple estimate suggests, because the wall has work-hardened in the first draw.

## The blank holder's force

The blank holder presses the flange against the die's face to stop it wrinkling, and the press must supply that force too, either through the ram or through a separate cushion beneath the die. Its value is the holding pressure times the flange area under the holder.

This is an illustration. At the start of SC-100's first draw, the holder covers a ring from about 126.2 mm, the die's opening plus its radius and clearance, out to the blank's 199.3 mm, an area of about **18,675 mm²**. At an illustrative holding pressure of 2.5 MPa, the holder's force is about **46.7 kN**. Chapter 5 explains how the pressure is chosen and how it changes as the flange shrinks.

## The total and the margin

The press must supply the drawing force and the blank holder force together, and something more for stripping the cup, friction in the guides and the variation from part to part.

```figure
type: bars
title: SC-100's first draw: forces and press ratings, kN
unit: kN
max: 420
caption: This is an illustration. The total is the upper-bound draw force plus the blank holder's; a press is chosen with margin above it at the height in the stroke where the force is needed.
- Drawing force, upper bound | 173
- Blank holder force | 47
- *Total required | 220
- Total with a 25% margin | 275
- Hydraulic press chosen, full force over its stroke | 400
```

This is an illustration. SC-100's first draw needs about **220 kN** in total, about 22.4 tonnes-force. A margin of 25% to 50% gives a press of about 275 to 330 kN, before considering where in the stroke the force is needed, which is where the choice between press types matters.

## Where in the stroke

A draw needs its force over a long stroke, not at a single point. The punch meets the blank, the force rises as the flange begins to move, reaches its peak partway through the draw, typically somewhere between a third and a half of the way, and falls as the flange shrinks and less metal remains to be drawn. For SC-100's first draw, about 60 mm deep, the peak comes at roughly 20 mm of punch travel, about **40 mm above** the bottom of the stroke where the draw finishes.

A **hydraulic press** can supply its full rated force at any point in its stroke, because the force comes from oil pressure on a piston. A **mechanical press** cannot. Its ram is driven by a crank or eccentric, and its rated force applies only near the bottom of the stroke, typically a few millimetres above it, where the crank's leverage is greatest. Higher in the stroke, the crank's leverage falls and so does the force it can deliver without overloading its drive. A mechanical press's rating must always be read with the height above the bottom of the stroke at which it applies.

## The error: a mechanical press rated at the bottom

This is an illustration. SC-100's first draw was first assigned to a **250 kN** mechanical press with a 200 mm stroke, rated at 6 mm above the bottom of its stroke. On paper, 250 kN exceeded the 220 kN required, with a margin of about 14%. The production engineer who checked the assignment asked where the 220 kN was needed.

Using a simplified crank geometry, ignoring the connecting rod's angle, the force a crank press can deliver at a height h above the bottom of its stroke falls in proportion to the sine of the crank angle at the rating point divided by the sine at h. For this press, the available force falls from 250 kN at 6 mm to about **142 kN** at 20 mm, **107 kN** at 40 mm and 93 kN at 60 mm.

```figure
type: line
title: Force available from a 250 kN crank press against the draw's need, by height above the bottom of stroke
x: Height above the bottom of the stroke, mm
y: Force, kN
legend: Mechanical press, available | First draw, required at peak
ymin: 0
ymax: 300
caption: This is an illustration with simplified crank geometry, a 200 mm stroke and a rating at 6 mm above the bottom. The draw's peak need of about 220 kN comes about 40 mm above the bottom, where the press can deliver only about 107 kN.
- 6 | 250 | 220
- 10 | 196 | 220
- 20 | 142 | 220
- 30 | 119 | 220
- 40 | 107 | 220
- 50 | 98 | 220
- 60 | 93 | 220
```

At the height where SC-100's first draw needs its peak force, the 250 kN press can deliver less than half of it. The press would have stalled or tripped its overload protection on the first part, or, if its protection had been set too loosely, been damaged. The fix was to move the first draw to a **400 kN hydraulic press** with a die cushion for the blank holder, giving full force over the whole stroke with a margin of about 80% on the total. The redraw, which needs less force over a shorter effective stroke, stayed on a mechanical press, checked the same way at the height of its own peak. The general lesson is that a mechanical press's rating is a force at a height, and a deep draw needs its force far above the height at which most presses are rated.

## Energy as well as force

A press must supply energy as well as force: the work done on each part, roughly the average force times the distance it acts. A mechanical press draws that energy from its flywheel, which slows during each stroke and must recover before the next. A deep draw takes much more energy per stroke than blanking a part of the same force, because its force acts over tens of millimetres rather than one or two.

This is an illustration. If SC-100's first draw averaged about 70% of its 173 kN peak over its 60 mm depth, the draw itself would take about **7.3 kJ**, and the blank holder, acting through 60 mm against a cushion, another 2.8 kJ. A mechanical press with ample force but too little flywheel energy for the stroke rate slows down progressively and stalls. The press maker publishes the energy available per stroke at each speed, and a deep draw should be checked against it.

## Speed

Drawing speed matters more for some materials than others. Stainless steels and some aluminium alloys draw better at moderate speeds, because the heat generated by deformation and friction, and the lubricant's behaviour, change with speed. A hydraulic press lets the speed through the draw be set and held; a mechanical press's ram speed varies through its stroke, fastest at mid-stroke. The toolmaker's experience with the material, and trial, decide the right speed; the press must be able to deliver it.

## Cushions and the blank holder

The blank holder's force can come from springs or gas springs in the die, from a **die cushion** in the press bed, or from a separate hydraulic action on a double-action press. Springs give a force that rises as they are compressed, which is the opposite of what a draw needs: the flange shrinks as the draw proceeds, and its holding force should usually fall, not rise. A hydraulic cushion can hold a constant force or follow a programmed profile through the stroke. For a demanding draw in stainless steel, the cushion's control over the holding force is often worth more than its capacity.

## Measuring the force in trial

Most modern presses can be fitted with a **load monitor**, strain gauges on the frame or the connecting rods that record the force through every stroke. In trial, the monitor turns the estimate into a measurement: the peak force, the height at which it occurs and the shape of the force curve through the stroke. In production, the same monitor watches for change. A cup that starts to tear shows a falling force before the tear is visible; a blank fed double shows a sudden rise; a lubricant that is running out shows a slow climb over a shift. A monitor set with limits a little above and below the trial's force curve stops the press before a bad part becomes a damaged die.

For SC-100, the trial on the hydraulic press recorded the first draw's peak and its height, and the figures replaced the upper-bound estimate on the process sheet, with the estimate kept beside them as a check. If the measured peak had been far below the estimate, a smaller press might have been reconsidered; it was not, because the margin also covers coils of stronger sheet that the trial did not see.

## Off-centre and multiple-station loads

A press's rating assumes the load is at the centre of its ram. A die set with several stations, a first draw and a redraw side by side, say, or a transfer die with blanking, drawing and trimming in a row, loads the ram off-centre, and the press maker's limits on off-centre loading then apply as well as its total rating. Each station's force and its position on the bolster should be listed, and their combined load centre checked against the press maker's data. A press that is adequate in total can still be overloaded at one corner.

## Recording the force

The process sheet should record, for each stage, the upper-bound drawing force and the material strength it used, the blank holder force and the pressure and area it used, the total, the height in the stroke at which the peak occurs, the press assigned and its available force at that height, and the margin. For SC-100, that is two lines, the first draw on the 400 kN hydraulic press and the redraw on its mechanical press, each with its force at the height of its peak. A press reassigned later, to balance a shop's loading, is then checked against the line rather than against its nameplate.

## Exercise: the redraw's press

SC-100's redraw takes the 115 mm cup to 100 mm. Its upper-bound drawing force, before work hardening, is about 151 kN. Suppose the work hardening from the first draw raises the wall's tensile strength to an illustrative 750 MPa, and the redraw's holding force is 15 kN. The redraw's peak comes about 15 mm above the bottom of the stroke. Is the same 250 kN mechanical press adequate?

**Worked answer.** With the work-hardened strength, the upper-bound drawing force is π × 100 × 0.8 × 750 ≈ **188 kN**. Adding 15 kN for the holder gives about **203 kN**. By the same simplified crank geometry, the press delivers about **162 kN** at 15 mm above the bottom of its stroke, less than required.

The press is not adequate for the redraw either, by the conservative estimate. The options are a larger mechanical press, a press rated higher in its stroke, or the hydraulic press again. A load monitor in trial would show how far below the upper bound the real redraw force is; at a ratio of only 1.15, it is likely to be well below. That is the case for measuring rather than estimating when the estimate is close to a press's limit: the upper bound is safe, but it can be pessimistic enough to cost a press that is not needed. Here the decision should wait for the redraw's measured force in trial, with the hydraulic press as the fallback.
