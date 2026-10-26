---
book: power-presses-by-the-numbers
chapterSlug: feeding-the-press
order: 8
title: "Feeding the press"
description: "Coil lines and roll feeds, the window when MP-40's strip may move, feed speed at 120 strokes a minute, coil changes, shuttle feeds, and a feed that ran into the pilots."
draft: false
---

A press can only work as fast as material reaches the die. For a progressive die such as MP-40's, a coil line unwinds the strip, flattens it and pushes it forward one pitch every stroke, and it must do so in the part of the stroke when nothing in the die is holding the strip. For a hand-loaded die such as AB-75's, the loader is the feed, and the question is how to get blanks in and parts out without hands entering the tool area. Hodgson gave a chapter of his 1903 book to roller and dial feeds for exactly these two reasons, output and the operators' fingers, and both still apply.

This chapter sets out a coil line, finds the window in each of Press 4's strokes when MP-40's strip may move, works out the feed's speed and acceleration, counts the cost of coil changes, looks at dial and shuttle feeds for hand-loaded work, and ends with a feed set to move the strip while the pilots were entering it.

## The coil line

A coil line for MP-40 has, as an illustration, four parts:

- a **decoiler**, holding the 1,000 kg coil and letting it unwind;
- a **straightener**, staggered rolls that take out the coil set (from the companion book's chapter on strip layout);
- a **loop**, a slack length of strip between the straightener and the feed, so that the feed can pull one pitch at a time while the decoiler and straightener run steadily;
- a **roll feed**, a pair of driven rolls at the die's entry that grip the strip and push it forward exactly one pitch, 52 mm, on every stroke.

Older roll feeds were driven mechanically from the press's crankshaft, so their timing was fixed by the drive. Most modern feeds are **servo feeds**, with their own motor and control, which take a signal from the press's crank angle and move the strip through a programmed length and profile at the right moment.

## The feed window

The strip may move only when no punch and no pilot is in it. In MP-40's die, from the companion book:

- the pilots project 3.0 mm below the stripper face, and the stripper 1.0 mm below the punch tips, so the pilots are the first part of the die to reach the strip;
- the stripper meets the strip at 4.0 mm above the bottom of the stroke, so the pilot tips reach the strip at **7.0 mm** above the bottom;
- on the upstroke, the pilots are the last part to leave it, at the same 7.0 mm.

With Press 4's crank radius of 30 mm and connecting rod of 250 mm, the ram is 7.0 mm above the bottom at a crank angle of **37.9°** either side of bottom dead centre. The pilots are in the strip for 2 × 37.9 = 75.7° of each revolution, and out of it for the other **284.2°**. That is the feed window: the strip may move anywhere in those 284.2°, centred on top dead centre.

A feed does not use the whole window. It needs a margin at each end, for the pilots' tips to clear and for the strip to settle before they enter, and the pilots need to enter a strip that the feed has released, so that they can pull it into its exact position. This book's illustration sets MP-40's feed to move the strip through **240°**, from 60° after bottom dead centre to 60° before it, with 22° of margin at each end of the window.

```figure
type: cycle
title: One revolution of Press 4's crank with MP-40's die
caption: This is an illustration with a 30 mm crank and 250 mm connecting rod. The pilots are in the strip from 37.9° before bottom dead centre to 37.9° after it; the feed moves the strip through 240° centred on top dead centre, leaving a margin at each end.
- Bottom dead centre | punches 1.0 mm into the die; strip held by pilots and stripper
- Pilots leave the strip | 37.9° after bottom dead centre, ram 7.0 mm up
- Feed starts | 60° after bottom dead centre
- Top dead centre | strip moving at its fastest
- Feed stops and releases | 60° before bottom dead centre
- Pilots enter the strip | 37.9° before bottom dead centre, and locate it
```

## Feed speed and acceleration

At 120 strokes a minute, each revolution takes 0.5 s. Moving the strip through 240° of it gives the feed 240 ÷ 360 × 0.5 = **0.333 s** for its 52 mm:

- average speed: 52 ÷ 0.333 = **156 mm/s**;
- with a trapezoidal motion, accelerating for a third of the time, running steadily for a third and slowing for a third, the peak speed is 1.5 times the average: **234 mm/s**;
- acceleration: 234 mm/s reached in 0.111 s, about **2,100 mm/s²**, about a fifth of the acceleration of gravity.

Those are modest figures for a servo feed, and the strip's own inertia is small. The limits on feeding speed usually come from the strip, not the feed: a thin or wide strip buckles if pushed too hard, a long loop whips, and a heavy strip slips in the rolls. At 60 strokes a minute, the same 240° takes 0.667 s and the average speed halves to 78 mm/s.

Feed accuracy matters because the pilots correct only small errors. A feed that places the strip within a few hundredths of a millimetre of its pitch leaves the pilots to pull it the rest of the way; one that is half a millimetre out makes the pilots tear the holes or bend themselves. Servo feeds are accurate when the strip is gripped properly; most feed errors come from worn or dirty rolls, wrong roll pressure, or the release timing in the next section.

```figure
type: compare
title: MP-40's feed at 120 strokes a minute, by feed angle
rowhead: Feed angle
cols: Time to feed, s | Average speed, mm/s | Peak speed, mm/s | Margin to the pilots
caption: This is an illustration with a 52 mm pitch and a trapezoidal motion whose peak is 1.5 times its average. The pilots are out of the strip for 284.2° of each revolution.
- * 240° | 0.333 | 156 | 234 | 22° each end
- 284.2°, the whole window | 0.395 | 132 | 198 | none
- 300° | 0.417 | 125 | 187 | strip still moving as pilots enter
```

## How much error the pilots can take

The pilots can only correct a feed error that their noses can catch. A pilot's nose is a tapered or bullet-shaped point; when it meets a hole that is slightly out of position, the taper pushes the strip sideways and along until the pilot's parallel body enters the hole. The largest error it can correct is roughly the difference between the nose's tip and its full diameter, less a margin.

This is an illustration. MP-40's Ø8.48 mm pilots, in holes pierced at 8.50 to 8.58 mm, have noses that taper from about Ø5 mm at the tip. A hole up to about 1.5 mm out of position along the feed still meets the taper and is pulled into place, though the pull distorts the strip a little; a feed error of a few hundredths of a millimetre is corrected with no visible effect. A feed that is set to the wrong pitch, say 51.5 mm instead of 52.0 mm, accumulates nothing, because each stroke's error is corrected by the pilots, but it makes the pilots pull the strip back half a millimetre every stroke, which wears them and marks the holes. The feed length is set exactly to the pitch, and checked with a strip marked at every pitch on the first strokes.

## Pilot release

When the pilots enter the strip, they must be able to move it a little, to centre it exactly. If the feed rolls are still gripping it, the pilots cannot, and they either tear the holes or bend. Roll feeds therefore have a **pilot release**: just before the pilots enter, the upper roll lifts, or the servo feed's motor is released, so that the strip is free to be pulled into place; after the pilots have left on the upstroke, the rolls close and the next feed begins.

The release is timed from the press's crank angle, like the feed. For MP-40, the rolls release at the end of the feed, 60° before bottom dead centre, and stay open until the pilots have left at 37.9° after it. A release that is late, or a feed angle that runs into the pilots' entry, causes the error at the end of this chapter.

## Coils and output

A 1,000 kg coil of MP-40's 85 × 2.0 mm strip is about 749 m long and makes about 14,400 plates. At 120 strokes a minute and 75% efficiency, Press 4 makes 5,400 plates an hour, so a coil lasts about **2.7 hours**. If a coil change, threading the new strip through the straightener, feed and die and running the first strokes to fill it, takes 15 minutes, coil changes alone take about 9% of the press's time.

The 75% efficiency used throughout this book's case includes coil changes, short stops and checks. For MP-40's batches of 5,000, each about a third of a coil, the batch change is usually the larger loss, and the companion book's set-up time covers it.

## Dial and shuttle feeds for hand-loaded work

AB-75's blanks are loaded by hand into a nest in the die. Each time the loader places a blank, a hand enters the tool area, and the press's guarding must make sure the ram cannot move while it is there (Chapter 9). A **dial feed** or **shuttle feed** changes that: the loader places blanks into nests on a rotating dial plate or a sliding shuttle, outside the tool area, and the dial or shuttle carries them under the punch.

Hodgson described dial feeds in 1903, along with the accidents to operators' fingers that made them worthwhile. Their value today is the same: hands stay out of the tool, and the loader can load the next blank while the press strokes on the last, which raises the output.

This is an illustration. With hand loading into the die, AB-75 runs about 12 strokes a minute, and 20,000 brackets a year take 37 press hours at 75% efficiency. A shuttle feed that lets the loader work outside the tool, at an illustrative 20 strokes a minute, cuts that to 22 hours, and the loader's hands never enter the die. The shuttle and its interlocks cost money, and Chapter 10 weighs them.

```figure
type: bars
title: AB-75's press hours a year by loading method
unit: hours
max: 40
caption: This is an illustration for 20,000 brackets at 75% efficiency. The shuttle feed's main benefit is that the loader's hands stay outside the tool area; the time saved is a bonus.
- Hand loading into the die, 12 a minute | 37
- * Shuttle feed, loading outside the tool, 20 a minute | 22
```

## Lubrication and scrap

Two further parts of the line are easy to overlook.

- **Strip lubrication.** A light film of stamping lubricant on the strip, applied by rollers or a spray ahead of the die, reduces friction between the punches and the sheet, slows edge wear and helps slugs and blanks drop clear. Too much makes the parts oily, needing washing, and too little lets punches gall; the amount is set on trial and recorded on the setting sheet. The lubricant's safety data and the parts' later finishing, such as painting, decide which lubricant can be used.
- **Scrap handling.** MP-40's skeleton leaves the die as a continuous strip. Left to pile up, it tangles and can be pulled back into the die. A **scrap chopper** at the die's exit cuts it into short lengths that fall into a bin, or a winder takes it up. The chopper and its bin are guarded like the rest of the line, because a chopper is itself a cutting machine.

## Detecting misfeeds

A progressive die is protected by sensors that stop the press before a misfeed becomes a crash.

- A **misfeed detector** in a pilot or a separate pin senses whether the strip has arrived in position; if a pilot meets solid strip instead of a hole, a spring-loaded pilot retracts and its switch stops the press.
- A **strip-end sensor** stops the press before the strip's tail leaves the feed rolls, so that the last partly fed pitch is not struck.
- **Part-out sensors** confirm that each blank has left the die, which matters most for compound dies.
- The **tonnage monitor** stops the press if a double blank or slug drives the load up (Chapter 7's error).

The sensors are wired into the press's control so that a fault stops the press at the top of the stroke. They are checked at every set-up, by feeding a strip deliberately short and confirming that the press stops.

## The error: a feed that ran into the pilots

This is an illustration. When MP-40's die was first set on Press 4, the feed's angle was left at the setting from the previous job, **300°**. With the pilots out of the strip for only 284.2°, a 300° feed centred on top dead centre overlapped the pilots by 7.9° at each end: it began pulling the strip 7.9° before the pilots had left it, and was still moving it 7.9° after they had entered, with the rolls not yet released.

The first few strokes looked normal. Within a hundred strokes, the setter heard a tick at the bottom of each stroke and the plates' holes, measured at first-off inspection, were slightly elongated along the feed, by about 0.05 mm. The pilots were entering moving strip, dragging the holes before the stripper clamped it, and the rolls were holding the strip against the pilots' attempt to centre it. The tick was the pilots' noses rubbing the hole edges.

The setter reset the feed angle to 240° and the release to start at 60° before bottom dead centre, and the next plates were round. The pilots were checked for wear and found lightly marked on one side. MP-40's setting sheet now gives the feed angle, the release timing and the window they must fall within, and the shop's set-up procedure includes a slow-motion check on inching: the strip must stop and the rolls open before the pilots touch it.

```figure
type: checklist
title: Feeding checks before a progressive die runs continuously
caption: Most of these are angles, read from the press's crank-angle display, and they take a few minutes on inching.
- Feed window from the die's pilot and punch heights | pilots out of the strip for 284.2°
- Feed angle inside the window with margin | 240°, 22° clear at each end
- Pilot release before the pilots touch the strip | rolls open 60° before bottom dead centre
- Feed speed and acceleration within the strip's limits | 234 mm/s peak at 120 strokes a minute
- Misfeed, strip-end and part-out sensors tested | short strip fed deliberately
- x Feed angle left from another job | 300°, strip moving as pilots entered
```

## Exercise: feeding at 90 strokes a minute

If MP-40 runs at 90 strokes a minute with the same 240° feed angle and trapezoidal motion, find the feed time, average and peak speeds and acceleration. Then say whether the feed window changes.

**Worked answer.** Each revolution takes 60 ÷ 90 = 0.667 s.

- Feed time: 240 ÷ 360 × 0.667 = **0.444 s**.
- Average speed: 52 ÷ 0.444 = **117 mm/s**; peak 1.5 × 117 = **176 mm/s**.
- Acceleration: 176 mm/s in 0.148 s, about **1,190 mm/s²**.

The feed window does not change: it is set by the crank angle at which the pilots reach the strip, 37.9° either side of bottom dead centre, which depends on the die and the press's geometry, not on its speed. Running slower gives the feed more time within the same angles, which is why a feed that misbehaves at full speed is often tried first at a lower one.
