---
book: water-hammer-by-the-numbers
chapterSlug: reflections-and-the-pipe-period
order: 4
title: "Reflections and the pipe period"
description: "Follow a surge wave to the far end and back through four phases, see how reservoirs and closed ends reflect it, and find where along the main the pressure is actually worst."
draft: false
---

The Joukowsky surge describes the first wave. What happens next depends on the ends of the pipe. At a reservoir the wave turns into its opposite and comes back. At a closed valve it doubles back unchanged. Between them, the water rocks back and forth through a cycle that lasts four times the time a wave takes to cross the pipe, slowly dying away through friction, or cut short by the water boiling.

This chapter follows that cycle in the case's main after an instant closure of the inlet valve. It uses the idealised, frictionless picture first, because it explains the shape of every transient that follows, then adds friction from the model described in Chapter 10. Two results matter for design: the line-packing rise that lifts the peak above the Joukowsky value, and the maximum pressure envelope, which is highest not at the valve but low down near the pump.

## What a boundary does to a wave

Every pipeline boundary forces a condition on the water there, and a wave arriving at it must reflect in whatever way keeps that condition true.

```figure
type: compare
title: How a head wave reflects at common boundaries
rowhead: Boundary
cols: Condition it imposes | Reflected head wave | Effect at the boundary
caption: These are the ideal cases. Real pumps, partly open valves and junctions reflect part of a wave and pass part of it on.
- * Reservoir or large tank | head fixed | equal and opposite | head stays put; velocity change doubles
- Closed valve or dead end | velocity zero | equal and same sign | head change doubles
- Change of material or diameter | head and flow continuous | partial, sign set by impedance | Chapter 2 gives the fractions
- Open discharge to atmosphere | head fixed at outlet level | equal and opposite | like a reservoir
```

The reservoir and the closed end are mirror images. A reservoir cannot change its level, so it sends back a wave that cancels the arriving head change; in doing so it doubles the velocity change. A closed end cannot pass flow, so it sends back a wave that cancels the velocity change; in doing so it doubles the head change. A pipe with a valve at one end and a tank at the other has one of each, and that combination produces the classic water hammer cycle.

For teaching, this chapter treats the case's pump as if it were a reservoir: a fixed head of RL 158 m at the upstream end. A running pump on a flat part of its curve behaves roughly like that. A real pump's head changes with flow, and it reflects waves only partly, so the true cycle at the pump end differs. Chapter 6 deals with the pump properly when it stops.

## Four phases after an instant closure

This is an illustration, frictionless, for the case's 900 m main with a wave speed of 1,343 m/s. The crossing time L ÷ a is about 0.67 s.

```figure
type: steps
title: The water hammer cycle in the case's main after an instant valve closure
caption: Frictionless ideal. Each phase lasts one crossing time, about 0.67 s, so the whole cycle repeats every 4L ÷ a, about 2.68 s.
- 0 to 0.67 s: compression runs upstream | water behind the front is stopped and its head raised by 220 m
- 0.67 to 1.34 s: the reservoir unloads it | the pipe is above reservoir head, so water flows back out at 1.61 m/s; head returns to steady behind the returning wave
- * 1.34 to 2.01 s: the closed valve stops the backflow | water moving away from the valve is stopped; head falls 220 m below steady
- 2.01 to 2.68 s: the reservoir refills the pipe | water flows in again at 1.61 m/s; head returns to steady, and the cycle repeats
```

At the valve itself the head jumps up by 220 m at the instant of closure, stays up for one pipe period of 1.34 s, then drops to 220 m below steady for the next 1.34 s, and so on: a square wave with a period of 2.68 s.

```figure
type: line
title: Idealised head change at the inlet valve after an instant closure
x: Time after closure, s
y: Head change, m
ymin: -250
ymax: 250
mark: 1.34 | 2L ÷ a
caption: This is an illustration: frictionless, fixed head at the pump end. The low phase would take the case's valve far below vapour pressure, so on this main it cannot happen as drawn; Chapter 7 explains what does.
- 0 | 0
- 0.01 | 220
- 1.33 | 220
- 1.35 | -220
- 2.67 | -220
- 2.69 | 220
- 4.01 | 220
- 4.03 | -220
- 5.36 | -220
```

The low phase is as important as the high one. On the case's main, the steady head at the valve is only 3.1 m above the pipe. A fall of 220 m would put the grade line about 217 m below the pipe, which is impossible: water cannot sustain more than about 10 m of suction at ambient temperature before it boils. Instead, a vapour cavity forms at the valve. The simple cycle breaks down at 1.34 s, and what follows, the collapse of the cavity, is the subject of Chapter 7.

## Velocity follows its own cycle

The head cycle has a partner in velocity. Before closure, water everywhere moves towards the valve at 1.61 m/s. The first wave stops it. When that wave reaches the reservoir, the pipe is full of stopped, compressed water at a head 220 m above the reservoir, and water starts to flow back out into the reservoir at 1.61 m/s. The returning wave carries that backflow down the pipe towards the valve, so for the second crossing time the water behind it moves away from the valve.

At the reservoir itself, then, the velocity swings from +1.61 m/s to −1.61 m/s, a change of twice the original velocity, while the head stays fixed. At the valve the velocity stays at zero while the head swings by twice 220 m, from 220 m above steady to 220 m below. Every point in between sees a mixture. This mirror relationship, velocity doubling where head is fixed and head doubling where velocity is fixed, is the same one found in a string fixed at one end and free at the other, and in the organ pipes of Chapter 9.

The backflow matters in practice. Any device near the reservoir end that is sensitive to reversed flow, such as a flow meter, a check valve or a pump that can run backwards, sees a reversal in the first few seconds after a valve at the far end shuts.

## Partly reflecting boundaries

Real boundaries are rarely perfect. A partly open valve reflects part of an arriving wave and passes part through. A pump that is running reflects according to the slope of its head-flow curve at the operating point: on a flat curve it behaves almost like a reservoir, on a steep curve more like a partly closed valve. A pump that has stopped with its check valve shut behaves like a closed end. Junctions with branches split the wave, sending some down each branch, and each branch then reflects its share from its own far end.

For hand screening, the ideal boundaries are useful because they bracket the truth. Treating the pump end as a reservoir gives the worst velocity reversal there; treating it as closed gives the worst head doubling. If both bracketing cases are acceptable, the real case usually is too. If either is not, a model with the real pump curve is needed.

## How long each point sees the surge

A point along the main sees the high pressure only while the compression has arrived and the unloading wave has not. For a point at distance s from the reservoir end, that is a time of 2s ÷ a. The valve, at s = 900 m, sees it for the full 1.34 s. The midpoint sees it for about 0.67 s. A point right at the reservoir sees it for no time at all.

That gives the shape of the maximum-head envelope. In the frictionless ideal it is flat at steady head plus 220 m along the whole line, then drops to the reservoir level at the reservoir itself. Duration falls towards the reservoir, but the peak does not, as long as the first wave reaches that point at full strength.

## Friction and line packing

Friction changes the picture in a way that surprises many engineers: it makes the peak worse, not better, at least at first.

In steady flow the grade line slopes down from RL 158 m at the pump end to about RL 144.1 m at the valve, because friction uses up 13.9 m of head. When the valve closes, the front raises the head by 220 m relative to that sloping line. Behind the front, the water is very nearly but not quite stopped. With no friction to resist it, the small remaining flow continues to push water into the stopped section from upstream, packing it a little tighter and raising its head towards the reservoir level plus the surge. Each part of the line behind the front creeps up by roughly the friction loss that used to separate it from the reservoir. This is **line packing**.

This is an illustration from the model in Chapter 10. At the inlet valve the head jumps from 144.1 m to 364.4 m at the instant of closure, the full Joukowsky 220 m. Over the next 1.3 s it continues to rise, reaching about **377.5 m** just before the unloading wave arrives. The extra 13 m is close to the steady friction loss.

```figure
type: compare
title: Head at the inlet valve during the first pipe period
rowhead: Time after closure
cols: Grade line | Pressure head above the valve | Pressure
caption: This is an illustration from the case's model, with friction. The valve sits at RL 141 m. The PN16 rating corresponds to about 163 m of pressure head.
- Before closure | RL 144.1 m | 3.1 m | about 30 kPa
- Instant of closure | RL 364.4 m | 223.4 m | about 2.19 MPa
- * Just before 1.34 s, after packing | RL 377.5 m | 236.5 m | about 2.32 MPa
```

In long, high-friction pipelines, line packing can add much more than Joukowsky alone predicts, and it is one reason a hand screening based on a ΔV ÷ g alone can be unconservative for long lines. For the case's short main, it adds about 6 per cent.

## Where the pressure is worst

The grade line peaks highest at the valve end, but pressure is grade line minus pipe level, and the pipe rises steeply towards the tank. Low points of the line therefore see higher pressures for the same grade line.

This is an illustration from the case's model, showing the maximum grade line reached at points along the main during the first pipe period after an instant closure, and the resulting maximum pressure head.

```figure
type: bars
title: Maximum pressure head along the main after an instant closure
unit: m
max: 280
caption: This is an illustration. The maximum grade line is nearly level along the main, from about RL 371 m near the pump to RL 377.5 m at the valve, so the low end of the line carries the highest pressure. The pump end itself is held at its steady head by the fixed-head simplification.
- Chainage 90 m, pipe RL 105.4 m | 265.9
- Chainage 270 m, pipe RL 116.2 m | 256.5
- Chainage 450 m, pipe RL 128 m | 246.1
- Chainage 630 m, pipe RL 138.3 m | 237.2
- * Chainage 900 m, inlet valve, RL 141 m | 236.5
- PN16 rating as head | 163.4
```

The worst pressure on the line is near the pump, about 266 m of head or 2.6 MPa, even though the disturbance happened at the far end. Every flanged joint, valve and fitting along the main would need to be checked against the envelope at its own elevation, not against the figure at the valve. The pump end itself would see the surge too, since a real pump is not a fixed-head reservoir; the simplified model hides that, and a full study would include the pump's characteristics.

## Reading a measured pressure record

A pressure transducer on a real main does not record the clean square wave of the ideal diagram. Knowing what changes it, and why, makes a record far easier to interpret:

- **Rounded fronts.** No valve shuts instantly, so the rise takes as long as the effective closure, and the corners of the square wave are rounded.
- **A sloping top.** Line packing makes the high phase creep upwards rather than sit flat.
- **Shrinking cycles.** Friction, and gas coming out of solution, take energy out each cycle; the swings decay over several cycles.
- **A flat bottom.** Where the low phase reaches vapour pressure, the record flattens at about 10 m below atmospheric, because the pressure cannot fall further while a cavity exists.
- **A spike after the flat bottom.** When the cavity collapses, the columns of water on either side meet, and the record shows a sharp spike that can exceed the first peak.
- **A period to measure.** The time between successive peaks is about 4L ÷ a, which gives an estimate of the wave speed, as Chapter 2 described.

An experienced reader can tell from one record whether a line has a cavitation problem, whether its wave speed is what the design assumed, and roughly how much damping it has. A logging transducer with a fast sampling rate, fitted at the pump discharge and at a high point for a few weeks, often settles arguments about whether a line is surging that years of listening for bangs have not.

## Using the pipe period on site

The pipe period is also a practical field tool. On the case's main, a bang heard at the pump station a little over a second after the inlet valve shuts is the returning wave, not a fault at the pump. Two bangs separated by about 2.7 s are successive cycles. A delay between a pump stopping and a bang at a check valve shows how long reverse flow took to develop. Matching those times against L ÷ a, 2L ÷ a and 4L ÷ a turns anecdote into evidence.

## A failure case: checking only at the valve

This is an illustration. A review of a proposed fast-acting inlet valve for the case's main asks the valve supplier for the "maximum pressure at the valve" and receives about 2.3 MPa. The review then specifies a PN25 valve, 2.5 MPa nominal, and closes the item.

The valve would survive. The line would not. The highest pressure is near the pump, about 2.6 MPa on the envelope above, and the flanged fittings and isolation valves there are PN16. The review had treated a pipeline problem as a valve problem.

The error was detected when the surge envelope was plotted against the pipeline profile and the component schedule, chainage by chainage. The correction was to stop treating a fast inlet valve as acceptable at all, and to slow its effective closure, which Chapter 5 works through, rather than upgrading one component. The general rule: compare the maximum and minimum head envelopes with the rating and the elevation at every point, not at the device that caused the transient.

## Exercise: a shorter main

A similar steel main, also with a wave speed of about 1,343 m/s and the same velocity, is only 300 m long. Find its crossing time, pipe period and cycle period after an instant closure. Does the Joukowsky surge change? What about line packing, if the friction loss is a third as large?

**Answer.** The crossing time is 300 ÷ 1,343 ≈ **0.22 s**, the pipe period 2L ÷ a ≈ **0.45 s**, and the cycle period 4L ÷ a ≈ **0.89 s**.

The Joukowsky surge is unchanged at about 220 m, because it depends only on a and ΔV. Line packing scales roughly with the friction loss, so it would be about a third of the 13 m, around 4 to 5 m. The shorter main's main advantage is its pipe period: a closure lasting more than about half a second is no longer instant, and the slower closures in Chapter 5 become much more effective.
