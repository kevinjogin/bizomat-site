---
book: water-hammer-by-the-numbers
chapterSlug: valve-closure-fast-and-slow
order: 5
title: "Valve closure: stroke time is not closure time"
description: "Compare slow-closure formulas with a model of the case's inlet valve, see why most flow is cut in the last tenth of the stroke, and choose a two-stage closure that keeps the line safe."
draft: false
---

The obvious fix for a valve-closure surge is to close the valve more slowly. It works, but not nearly as well as the simple formulas suggest. A valve that takes 10 s to travel from open to shut may cut most of the flow in its last second, and as far as the pipeline is concerned that is a one-second closure. The stroke time on the actuator's data sheet and the effective closure time seen by the water are different numbers.

This chapter compares the classic slow-closure estimate with the case's model for the motorised inlet valve at the tank. It shows how the flow actually falls during a closure, why the surge is set by the end of the stroke, and why even a slow closure can drag the pressure below atmospheric afterwards. It then sets a two-stage closure that brings both the high and the low pressures inside acceptable limits.

## The slow-closure estimate

For a closure that takes longer than the pipe period, the reflections from the reservoir end start relieving the pressure before the valve has finished closing. A long-standing estimate, often attributed to Michaud, treats the flow as falling evenly over the closure time t_c and gives:

**ΔH ≈ 2 L V ÷ (g t_c)**, for t_c greater than 2L ÷ a

It is the rigid-column formula of Chapter 1 doubled, and at t_c = 2L ÷ a it gives exactly the Joukowsky value. For the case's main, with L = 900 m and V = 1.61 m/s:

- **t_c = 5 s:** about 59 m;
- **t_c = 10 s:** about 29.5 m;
- **t_c = 30 s:** about 9.8 m.

On those numbers, a 10 s valve looks entirely safe. The model disagrees.

The estimate is not wrong in itself. It answers a narrower question than it appears to: what happens if the velocity falls at a steady rate over the stated time. Its weakness is that almost no real valve on a real system produces a steady fall in velocity. Use it as a lower bound on what a closure of a given length can achieve, and as a check on models, not as a design value. If a slow-closure estimate already shows a problem, the real closure will be worse.

## What the model shows

This is an illustration. The case's model, described in Chapter 10, closes the inlet valve so that its effective opening area falls in a straight line from fully open to shut over the stroke time. That is already kinder than many real valves, whose area changes fastest at one end of the stroke. Even so:

```figure
type: compare
title: Surge at the inlet valve for three stroke times
rowhead: Stroke time
cols: Slow-closure estimate | Model, rise at valve | Model, lowest pressure head afterwards
caption: This is an illustration from the case's model, valve area falling linearly with time. The estimate assumes the flow falls evenly; in the model it does not, and both the rise and the following fall are far larger.
- 5 s | 59 m | 182.6 m | far below vapour pressure
- * 10 s | 29.5 m | 112.7 m | far below vapour pressure
- 30 s | 9.8 m | 34.7 m | about 3.2 m below atmospheric
```

The model's rise for a 10 s closure is nearly four times the estimate. For a 5 s closure the rise of about 183 m takes the valve's pressure head to about 186 m, roughly 1.8 MPa, above the PN16 rating. Only at 30 s does the rise fall to a level the line can carry, and even then the pressure after closure dips below atmospheric.

## Where the flow is actually cut

The reason lies in how flow through a valve depends on its opening. When the inlet valve is fully open, it accounts for only about 2.1 m of the 16 m of losses between the pump and the tank. Pipe friction takes the rest. Closing the valve halfway barely changes the total resistance, so the flow hardly changes. Only when the valve is nearly shut does its own loss dominate, and then the flow falls quickly.

```figure
type: line
title: Valve opening and flow during a 10 s linear closure
x: Per cent of stroke time elapsed
y: Per cent of initial value
legend: Valve opening area | Flow through the valve
ymin: 0
ymax: 110
mark: 90 | last tenth of the stroke
caption: This is an illustration from the case's model. Halfway through the stroke the flow is still 95 per cent of full; half of the flow is cut in the last tenth.
- 0 | 100 | 100
- 25 | 75 | 99
- 50 | 50 | 95
- 75 | 25 | 80
- 90 | 10 | 50
- 95 | 5 | 30
- 100 | 0 | 1
```

In the 10 s closure, the flow is still 95 per cent of full at 5 s and 80 per cent at 7.5 s. Half the flow is cut between 9 s and 10 s. The effective closure, the time over which most of the velocity change happens, is about a second, close to the pipe period of 1.34 s. That is why the rise approaches half the Joukowsky value rather than a seventh.

The same effect is stronger with valves whose area falls fastest near the closed end, such as many butterfly and gate valves, and weaker with valves designed with a characteristic that throttles gradually, such as some globe and needle valves. The valve maker's flow characteristic, combined with the system's own resistance, decides how the flow falls. A stroke time alone says little.

## The pressure after closure

The second column of the comparison is as important as the first. After a closure, the water in the main rocks back and forth as Chapter 4 described. The swing below steady is about as large as the swing above. At the inlet valve, where the steady pressure head is only 3.1 m, a swing of 113 m below steady would require about 110 m of suction. Water cannot provide it. A vapour cavity forms at the valve, and the following collapse can produce a second, sharper surge.

```figure
type: line
title: Head at the inlet valve during and after a 10 s linear closure
x: Time from start of closure, s
y: Grade line, RL m
ymin: 50
ymax: 270
mark: 10 | valve shut
caption: This is an illustration from the case's model, without a cavity model. The valve is at RL 141 m; anything below about RL 131 m means vapour pressure has been reached and the model's later values are not physical.
- 0.5 | 144.4
- 2 | 145.3
- 4 | 147.6
- 6 | 153
- 7 | 159
- 8 | 170.9
- 8.5 | 181.4
- 9 | 197.5
- 9.5 | 222.4
- 10 | 256.7
- 10.5 | 211.3
- 11 | 135.2
- 11.5 | 71.8
- 12 | 126.8
- 13 | 227.5
- 14 | 67.2
- 15 | 179.8
```

A valve near the top of a rising main, discharging into a tank, is the worst place for this. Its steady pressure is low, so it has little margin before vapour pressure, and it sits at a closed end where head swings double. Any closure scheme for the case's inlet valve must be judged on both the peak and the trough.

## Valve authority

Control engineers have a name for the effect behind the flow curve: valve authority, the share of the system's total pressure drop that the valve takes when fully open. The case's inlet valve takes about 2.1 m out of 16 m, an authority of about 13 per cent. A valve with low authority has little influence on the flow until it is nearly shut, and then a great deal. A valve with high authority, taking most of the system's drop even when open, changes the flow more evenly through its stroke.

That gives two ways to improve a closure. One is to choose a valve whose inherent characteristic, the way its area changes with stroke, opens up the low-flow end: equal-percentage trims and some globe and plug designs do this, at the cost of a higher open-valve loss. The other is to shape the stroke itself, by actuator speed, which is what the two-stage closure below does. On an existing main the second is usually cheaper. On a new main, the valve choice and the closure scheme should be decided together, using the valve maker's flow characteristic and the system curve.

## Closures nobody planned

Many dangerous closures are not commanded by a control system at all. A survey of the case's main for anything that can stop the flow quickly should include:

- **fail-safe actuators,** whose spring return closes the valve on loss of power or air, often far faster than the normal stroke;
- **float and altitude valves** at tanks, which close as the level rises and may snap shut over the last few millimetres;
- **solenoid valves** on branches and wash-down points, which act in a fraction of a second;
- **manual quarter-turn valves** that an operator can slam in a second;
- **check valves,** which close by themselves when flow reverses, covered in Chapter 6.

The fail-safe case catches many designs. An actuator set up carefully for a 30 s two-stage closure in normal operation may have a spring return that shuts the valve in 2 s when power fails. That is a closure faster than the pipe period on the case's main. If fail-safe closure is required for process reasons, its speed needs the same check as the normal closure, and a hydraulic damper or a slower spring may be needed.

## Opening is a transient too

The same physics applies when a valve opens. Opening the case's inlet valve with the pump running accelerates the column towards the tank. The head at the valve's upstream side falls as the flow starts, by up to a ΔV ÷ g for a fast opening, and the wave travels back towards the pump. On this main, with only 3 m of steady pressure at the valve, a fast opening could pull the pressure there below atmospheric. Opening is usually less severe than closing, because a valve starting to open has little effect on the flow until its own loss falls below the rest of the system's, but a two-stage opening, slow at first, is the mirror image of the two-stage closure and is often set up at the same time.

## Two-stage closure

If the damage is done in the last part of the stroke, the remedy is to make the last part slow and let the first part be quick. A two-stage closure does exactly that: the actuator runs at normal speed through most of the stroke, where little flow is cut, and then slowly through the final part.

This is an illustration. Two schemes were run in the case's model:

```figure
type: compare
title: Two-stage closures of the case's inlet valve
rowhead: Closure scheme
cols: Rise at valve | Lowest pressure head anywhere | Total closure time
caption: This is an illustration from the case's model. Both two-stage schemes keep the pressure positive everywhere and the peak well inside PN16, in less total time than a 60 s linear stroke.
- Linear, 30 s | 34.7 m | about 3.2 m below atmospheric | 30 s
- Linear, 60 s | 22.2 m | 3.1 m, steady value | 60 s
- Area to 20 per cent in 5 s, then shut over 15 s | 30.6 m | 3.1 m, steady value | 20 s
- * Area to 30 per cent in 5 s, then shut over 25 s | 19.5 m | 3.1 m, steady value | 30 s
```

The scheme that closes to 30 per cent area in 5 s and then shuts over 25 s gives the smallest rise, about 20 m, and no sub-atmospheric pressure, in the same 30 s as the linear closure that dipped below atmospheric. The shape of the closure matters more than its length.

Motorised and hydraulic actuators can be set up for two-stage or variable-speed closure, using limit switches, positioners or hydraulic flow controls. The settings must be recorded and protected, because the next person to "fix" a slow valve may simply speed it up.

### Prove it at commissioning

A closure scheme set from a model should be checked on the real main. A pressure logger sampling at least a few hundred times a second, fitted near the inlet valve and at the high point, records a planned closure from full flow. The record shows the peak, the trough and the shape of the flow cut-off, and it confirms or corrects the model's wave speed and friction. If the measured peak or trough is worse than the model predicted, the closure is slowed further before the main goes into service. The record then becomes the baseline against which any later change to the valve or actuator is compared.

## A failure case: speeding up the valve

This is an illustration. The case's inlet valve was commissioned with a 30 s linear stroke. A year later, the tank's level control is found to overshoot, because the valve takes too long to shut when the tank is full. A technician changes the actuator setting to a 5 s stroke to tighten the level control. Nobody connects the change to the pipeline.

Within weeks, a flange gasket on the main near the tank blows out, and staff at the tank report a loud bang each time it fills. The model explains both: a 5 s closure lifts the valve-end head by about 183 m, and the cavity collapse after it adds more. The gasket was rated for PN16, and the pressure at the tank end of the main exceeded it every time the tank filled.

The error was detected by matching the bangs to the tank-full events and finding the changed actuator setting in the control log. The correction was to set a two-stage closure that met the level-control need: 5 s to 30 per cent area, then 25 s to shut. The level overshoot was handled by starting the closure slightly earlier, at a lower tank level. The procedure was changed so that valve stroke settings on long mains are controlled items, with a note on the actuator stating why they must not be shortened.

## Exercise: a gate valve on the case's main

A handwheel gate valve beside the inlet valve at the tank is shut by an operator in about 20 s, but the valve's opening area stays above 80 per cent until the last 4 s and then falls roughly linearly to zero. Using the slow-closure estimate with the effective closure time rather than the stroke, estimate the rise. Is the full 20 s a safe basis for the check?

**Answer.** Most of the flow is cut in the last 4 s, so the effective closure time is about 4 s, about three pipe periods. The estimate gives ΔH ≈ 2 × 900 × 1.61 ÷ (9.81 × 4) ≈ **74 m**, against about 15 m if the full 20 s were used.

Even 74 m is likely to be low, because the model shows that most of the flow is cut in the last fraction of whatever period the area is falling, here the last second or so of those 4 s. The 20 s stroke is not a safe basis. Gate valves on long mains should be closed slowly through the final turns, and operating instructions should say so.
