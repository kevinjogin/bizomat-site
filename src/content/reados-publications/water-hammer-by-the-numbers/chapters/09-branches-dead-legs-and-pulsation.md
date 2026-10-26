---
book: water-hammer-by-the-numbers
chapterSlug: branches-dead-legs-and-pulsation
order: 9
title: "Branches, dead legs and pulsation"
description: "Treat pipe branches as organ pipes, find the quarter-wave modes of a dead leg and a dosing line, and keep them away from pump vane-pass and plunger pulsation."
draft: false
---

A surge is a single, large event. Pulsation is a small one repeated many times a second. Reciprocating pumps deliver flow in pulses, centrifugal pumps produce a pressure ripple each time an impeller vane passes the casing's cut-water, and control valves can hunt. On their own these ripples are modest. In a branch whose length happens to suit them, they build into standing pressure waves, exactly like the air in an organ pipe, and the branch shakes, its gauge needle blurs, and its small-bore connection cracks.

This chapter applies the standing-wave rules to the liquid in pipes. It starts with the main itself, whose fundamental mode is the water hammer cycle of Chapter 4, then looks at two branches on the case's pump station: a pressure-gauge dead leg excited by the pump's vane-pass frequency, and a chemical dosing line fed by a plunger pump. Both are short, cheap pieces of pipe, and both can fail far sooner than the main.

## Pipes as organ pipes

A column of liquid in a pipe has natural frequencies set by its length, its wave speed and its end conditions, just as a string or a bar does. The ends are of two kinds:

- a **closed end,** such as a shut valve, a blank flange or a pump's closed check valve, where the liquid cannot move, so velocity is zero and pressure swings are largest;
- an **open end,** such as a junction with a much larger pipe or a tank, where the pressure is held nearly constant, so pressure swings are zero and velocity swings are largest.

From those rules, a branch closed at both ends or open at both ends has modes at **f = n a ÷ (2L)**, a whole number of half-waves along it. A branch closed at one end and open at the other, the common case for a dead leg off a main, has modes at **f = (2n − 1) a ÷ (4L)**, an odd number of quarter-waves: the first at a ÷ 4L, the next at three times that, then five times.

These are the rules that govern organ pipes and wind instruments, with the speed of sound in air replaced by the pressure-wave speed in the liquid and pipe. Coulson and Jeffrey's text in the references treats sound in pipes as one of its classic cases.

Real ends sit between the ideals. A tee into a main that is not much larger than the branch is only partly open; a partly closed valve is only partly closed; a gauge with a long flexible capillary or a small accumulator behind it is not fully closed. Partial ends shift the modes a little and lower their peaks, but the ideal rules still put the modes in the right place to within a few per cent for most plant branches. That is close enough to decide whether a branch needs a closer look, and a pressure measurement settles the rest. When in doubt, check the branch both as closed-open and as closed-closed: if neither puts a mode near a pulsation frequency, the branch is very likely safe.

## The main's own fundamental

The case's main is closed at the inlet valve when it shuts and held at near-constant head at the pump end in the simplified model, so its first mode is a quarter-wave: **a ÷ 4L = 1,343 ÷ 3,600 ≈ 0.373 Hz**, a period of about 2.68 s. That is exactly the 4L ÷ a cycle of Chapter 4. The water hammer cycle is the main ringing in its fundamental mode, and the next modes are at three, five and seven times that frequency.

Such low frequencies matter for controls. A level or pressure control valve that hunts, opening and closing with a period close to 2.7 s, can feed energy into the main's fundamental mode every cycle, building pressure oscillations far larger than the hunting alone would cause. Control loops on long mains should be tuned so that the valve moves slowly compared with the pipe period, and a hunting valve on a long main should be treated as a potential surge source, not only as a control nuisance.

## Wave speed in small-bore branches

Small-bore steel pipe has thicker walls relative to its bore than a main, so its wave speed is a little higher. Using Chapter 2's formula with restraint factor 0.91:

```figure
type: compare
title: Wave speed in small-bore steel branches
rowhead: Pipe
cols: Bore and wall | D ÷ e | Wave speed
caption: This is an illustration using standard-weight pipe dimensions, water at 20 °C and E = 200 GPa. Thicker walls relative to bore give slightly faster waves.
- The main, 168.3 mm outside | 154.1 mm bore, 7.1 mm wall | 21.7 | 1,343 m/s
- DN50 branch | 52.5 mm bore, 3.91 mm wall | 13.4 | 1,391 m/s
- DN25 branch | 26.6 mm bore, 3.38 mm wall | 7.9 | 1,426 m/s
- * DN15 gauge line | 15.8 mm bore, 2.77 mm wall | 5.7 | 1,441 m/s
```

The differences are small for steel. For plastic branches they are large, and each branch's own material and dimensions should be used.

## Vane pass and a gauge dead leg

A centrifugal pump produces a pressure ripple at its **vane-pass frequency**: the number of impeller vanes times the shaft speed. This is an illustration. The case's pump has a six-vane impeller at 1,475 rpm, so its vane-pass frequency is 6 × 1,475 ÷ 60 = **147.5 Hz**, with harmonics at 295 Hz and above. The ripple is usually small, a few per cent of the pump's head or less, but it is continuous for every hour the pump runs.

A pressure gauge on the case's pump discharge sits at the end of a DN15 steel line, 2.4 m long, teed off the main. The tee is effectively an open end, since the main is much larger than the branch; the gauge and its isolating valve form a closed end. The branch's first mode is:

**f₁ = a ÷ 4L = 1,441 ÷ (4 × 2.4) ≈ 150.1 Hz**

That is about 1.8 per cent above the vane-pass frequency. The branch is tuned to the pump.

```figure
type: svg
title: A closed-ended dead leg ringing in its first quarter-wave mode
alt: A small pipe branch teed off a large main at the left and closed by a gauge at the right. Above it, a curve shows pressure amplitude rising from zero at the tee to a maximum at the closed gauge end; below it, a dashed curve shows liquid velocity amplitude falling from a maximum at the tee to zero at the gauge.
caption: The open end at the main holds pressure steady; the closed end at the gauge stops flow. A quarter-wave fits between them, so the gauge sees the largest pressure swings.
viewbox: 0 0 640 260
body:
<rect class="bx" x="20" y="60" width="70" height="160"/>
<rect class="bx" x="90" y="128" width="470" height="24"/>
<circle class="bxa" cx="590" cy="140" r="26"/>
<path class="lf" d="M90 110H560M90 240H560"/>
<path class="la draw" pathLength="1" d="M90 110L129.2 100.9L168.3 91.9L207.5 83.2L246.7 75L285.8 67.4L325 60.5L364.2 54.5L403.3 49.4L442.5 45.3L481.7 42.4L520.8 40.6L560 40"/>
<path class="li dsh" d="M90 180L129.2 180.5L168.3 182L207.5 184.6L246.7 188L285.8 192.4L325 197.6L364.2 203.5L403.3 210L442.5 217L481.7 224.5L520.8 232.2L560 240"/>
<text class="txb" x="24" y="45">main</text>
<text class="txb" x="555" y="200">gauge</text>
<text class="tx txs" x="250" y="60">pressure amplitude</text>
<text class="tx txs" x="200" y="245">velocity amplitude</text>
<text class="tx txs" x="250" y="145">DN15, 2.4 m</text>
```

## A failure case: the cracked gauge connection

This is an illustration. Eighteen months after commissioning, a fitter notices that the gauge on the case's pump discharge is unreadable, its needle a blur. The gauge is replaced. A few months later, water weeps from a crack at the threaded connection where the DN15 line leaves its tee on the main.

The calculation above explains both. With the dead leg's first mode at about 150 Hz and the pump's vane pass at 147.5 Hz, the column in the branch resonates. The gauge, at the closed end, sees the largest pressure swings, which destroy its mechanism. The branch pipe vibrates with the pressure pulsation, and its threaded connection to the tee, the stiffest and most notched point, carries the bending. At 147.5 Hz, the connection sees more than half a million cycles an hour.

The failure was diagnosed with a tap-free method: a vibration reading on the branch showed a strong peak at 147.5 Hz, much larger than on the main beside it, and the branch length matched a quarter-wave at that frequency. The correction had three parts: replace the threaded connection with a welded one, support the branch close to the tee, and shorten the dead leg to 1.2 m by relocating the gauge, which moved its first mode to about 300 Hz, near the second vane-pass harmonic of 295 Hz. That last step was then corrected again: a snubber was fitted at the gauge and the branch was made 1.5 m long, giving about 240 Hz, clear of both 147.5 Hz and 295 Hz by more than 15 per cent. Moving a frequency means checking every excitation band, not only the one that caused the problem.

## Plunger pumps and a dosing line

Reciprocating pumps deliver flow in pulses, one per plunger stroke. A triplex plunger pump, three plungers on a common crank, delivers three pulses per revolution, so its fundamental pulsation frequency is three times its shaft speed, with harmonics at multiples of that.

This is an illustration. A chemical dosing pump at the case's pump station is a triplex plunger pump running at 300 rpm, so its pulsation fundamental is 3 × 300 ÷ 60 = **15 Hz**, with harmonics at 30 Hz, 45 Hz and above. It feeds the main through 25 m of DN25 steel line. The pump end, with its discharge check valves, behaves as a closed end; the injection point on the main as an open end. The line's modes are:

- **first:** 1,426 ÷ (4 × 25) ≈ 14.3 Hz;
- **second:** three times that, about 42.8 Hz;
- **third:** about 71.3 Hz.

The first mode sits about 5 per cent below the pump's 15 Hz pulsation, and the second about 5 per cent below its third harmonic at 45 Hz. Both are inside the 15 per cent working margin used elsewhere in this book. A line like this shakes on its supports, its dosing rate becomes erratic as the pump's valves see large pressure swings, and its relief valve may lift.

```figure
type: compare
title: Options for the 25 m dosing line
rowhead: Option
cols: Line modes | Against 15, 30, 45 and 60 Hz pulsation | Assessment
caption: This is an illustration. A pulsation dampener changes the closed-end condition at the pump and absorbs much of the pulsation at source, so it is usually the first choice.
- As built, 25 m | 14.3, 42.8, 71.3 Hz | 5 per cent from 15 Hz and from 45 Hz | resonant
- Shorten to 16 m | 22.3, 66.8, 111 Hz | 26 per cent from 30 Hz; about 11 per cent from 60 Hz and 75 Hz; higher modes meet weaker harmonics | better, not clear
- * Pulsation dampener at pump discharge | no longer a simple closed end | pulsation reduced at source | standard practice for metering pumps
- Change pump speed | moves the pulsation | dosing capacity changes | only if the duty allows
```

A pulsation dampener, a small gas-charged vessel at the pump's discharge, works like a surge vessel in miniature. It absorbs each flow pulse into its gas cushion and releases it between pulses, smoothing the flow entering the line. It also changes the end condition at the pump from closed to something close to open for pulsation frequencies, which moves the line's modes. Dampener makers size them from the pump's displacement and the allowable residual pulsation. Like a surge vessel, a dampener depends on its gas precharge, which must be checked.

## The suction side

Pulsation is not only a discharge problem. A reciprocating pump draws liquid in pulses too, and the column in its suction line must accelerate and decelerate with every stroke. The pressure needed to accelerate that column, often called acceleration head, is taken from the pressure available at the pump inlet. On a long or small suction line, it can pull the inlet pressure down far enough for the liquid to release gas or boil on each stroke, even though the steady net positive suction head looks ample. The result is noisy, erratic pumping and damaged valves.

Pump makers give methods for estimating acceleration head from the suction line's length, velocity and the pump's speed and number of plungers. The remedies mirror those on the discharge side: short, generously sized suction lines, a suction stabiliser or dampener near the pump, and a flooded suction from a tank rather than a long lift. The suction line's own quarter-wave and half-wave modes should also be checked against the pulsation frequencies, with the tank end treated as open and the pump end as closed.

## Measuring pulsation

Pulsation is easy to measure once suspected. A fast pressure transducer near the closed end of a branch, sampling at several times the highest frequency of interest, shows the pressure ripple and its spectrum directly. A gauge with a blurred needle, a branch that buzzes to the touch, or a relief valve that chatters is enough reason to fit one. On the dosing line in this chapter, the transducer belongs at the pump discharge, upstream of any dampener, and at the injection point, so the change along the line can be seen.

Readings should be taken across the range of operating conditions, because pulsation depends on pump speed, stroke length and system pressure. A line that is quiet at one dosing rate can resonate at another if the pump's speed changes with demand.

## Supports and small-bore connections

Pulsation becomes damage through the pipe structure. A pressure wave travelling round a bend or into a closed end pushes on the pipe with a force that alternates at the pulsation frequency. If the pipe span between supports has a natural frequency of its own near that frequency, the pipe itself resonates and the forces multiply.

Small-bore connections are the weak point. A short branch with a heavy valve or instrument on its end, screwed into a thin-walled tee, combines a high stress concentration with a mass on a cantilever. Many plant integrity programmes give small-bore connections on pump discharges special attention for exactly this reason: they fail by fatigue, often within months, and their failure releases fluid near people. Welded connections, gussets or braces back to the main, supports close to valves, and minimum lengths of unsupported small bore are the usual defences.

## Exercise: a sampling point dead leg

A DN15 sampling line, 1.0 m long and closed by a sample valve, is teed off the case's pump discharge. Find its first two quarter-wave modes and check them against the vane-pass frequency and its second harmonic.

**Answer.** f₁ = 1,441 ÷ (4 × 1.0) ≈ **360 Hz**, and the next mode is three times that, about **1,081 Hz**.

The vane-pass frequency is 147.5 Hz and its second harmonic 295 Hz. The first mode is about 22 per cent above 295 Hz and well clear of 147.5 Hz, so the branch passes the 15 per cent check. The mode also sits about 19 per cent below the third vane-pass harmonic at 442.5 Hz, which is clear. Record the frequencies; check them again if the pump speed or impeller changes.
