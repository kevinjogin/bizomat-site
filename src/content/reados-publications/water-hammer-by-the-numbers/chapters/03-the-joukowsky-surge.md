---
book: water-hammer-by-the-numbers
chapterSlug: the-joukowsky-surge
order: 3
title: "The Joukowsky surge: velocity change into head"
description: "Derive the instant surge from the momentum stopped at a moving wave front, apply it to full and partial closures, and turn it into pressures and forces on fittings and anchors."
draft: false
---

In 1897 and 1898 Nikolai Joukowsky ran experiments on Moscow's water mains and showed that the pressure rise from a sudden stop depends on only two things: the change in velocity and the speed of the pressure wave. The pipe's length, the valve's size and the column's total mass do not appear. That result, now called the Joukowsky equation, is the single most useful number in water hammer.

This chapter derives it from a momentum balance across the moving wave front, applies it to the case's main for full and partial closures, and converts the result into pressures and into forces on the pipework. It closes with a units mistake that turns a dangerous surge into an apparently harmless one, and the quick mental check that catches it.

## A result from measurement

Joukowsky's work is worth a moment because of how it was done. He did not derive the equation and leave it there. He fitted pipes of several lengths and diameters with pressure recorders, closed valves at known rates, and measured both the arrival time of the pressure front at different points and the size of the rise. The measured wave speeds agreed with a speed calculated from the water's compressibility and the pipe wall's elasticity, and the measured rises agreed with the momentum argument below. He also showed that closures shorter than the round-trip time of the wave produced the full rise, and longer ones less. His report was translated into English in 1904 and is listed in the references.

The practical lesson has not changed since: the theory is simple, it agrees with measurement when its inputs are right, and most errors come from the inputs. A wrong wave speed, a velocity change that was not considered, or a closure that was faster than anyone realised accounts for far more surge failures than any weakness in the equation.

## Momentum across the wave front

Picture the moment after a valve at the downstream end of a pipe shuts instantly. A wave front moves upstream at speed a relative to the pipe. Behind it, between the front and the valve, the water is stopped and its pressure raised by Δp. Ahead of it, the water still flows at its original velocity V towards the valve.

In a short time dt, the front advances a distance a dt, strictly a little less because the water ahead is moving towards it, a correction that is negligible when V is tiny compared with a. A slice of water of mass ρ A a dt is brought from velocity V to rest. Its change of momentum is ρ A a dt × ΔV. The only force that can do that is the pressure difference across the front acting on the bore area, Δp × A, for the time dt. Equating the two:

**Δp = ρ a ΔV**, or in head, **ΔH = a ΔV ÷ g**

where ΔV is the change in velocity. This is the Joukowsky equation. The pipe's length does not appear because the front only ever deals with the slice it is stopping. The total mass of the column matters only to how long the surge lasts, which Chapter 4 covers.

## The case's instant surge

This is an illustration. For the case's main, with a = 1,343 m/s and the full flow of 1.61 m/s stopped instantly:

**ΔH = 1,343 × 1.61 ÷ 9.81 ≈ 220 m**, or **Δp = 998 × 1,343 × 1.61 ≈ 2.16 MPa**

```figure
type: formula
title: The Joukowsky surge for the case's main
formula: ΔH = a ΔV ÷ g
formula: Δp = ρ a ΔV
- a | wave speed, 1,343 m/s from Chapter 2
- ΔV | change in velocity; here the full 1.61 m/s
- g, ρ | 9.81 m/s² and 998 kg/m³
step: ΔH = 1,343.2 × 1.6085 ÷ 9.81 = 220.2 m
step: Δp = 998 × 1,343.2 × 1.6085 = 2.156 × 10⁶ Pa
step: about 220 m of head or 2.16 MPa, added to whatever pressure was there before
caption: This is an illustration. The surge adds to the steady pressure at the point where it occurs. It applies to any change completed within one pipe period, about 1.34 s here.
```

In steel pipe carrying water, the ratio a ÷ g is about 137 m of head for every metre per second of velocity change, or about 1.34 MPa per metre per second. That is worth carrying as a mental check: in a steel water main, a sudden change of 1 m/s costs roughly 13 to 14 bar.

```figure
type: bars
title: Instant surge in the case's steel main against velocity change
unit: m
max: 420
caption: This is an illustration at a = 1,343 m/s. The surge is directly proportional to the velocity change; the PN16 rating corresponds to about 163 m of head in total, steady pressure included.
- 0.5 m/s | 68.5
- 1.0 m/s | 136.9
- * 1.61 m/s, full flow | 220.2
- 2.0 m/s | 273.8
- 3.0 m/s | 410.8
```

The table makes the case for moderate velocities. Water mains designed for velocities of one to two metres per second do not owe that only to friction and energy cost. Every extra metre per second of design velocity adds about 137 m of potential surge in steel.

## Add the surge to the steady pressure

The Joukowsky head is a change, so it must be added to the head that was already there. At the case's inlet valve the steady pressure head is about 3.1 m. An instant closure lifts it by 220.2 m, to about **223 m**, or about **2.19 MPa**. The PN16 rating of the valve corresponds to about 163 m of head. The surge would exceed the rating by about 60 m before any of the effects in later chapters add to it.

As the wave runs back towards the pump, it raises the head everywhere it passes by the same 220 m. At the pump end, where the steady head is 58 m, the total would approach 278 m, about 2.7 MPa. Chapter 4 adds a further rise from friction, called line packing, which makes the closed-valve end slightly worse again.

## Partial changes

The equation uses the change in velocity, not the velocity itself. A partial closure that reduces flow quickly produces a surge in proportion to the reduction.

This is an illustration. If the inlet valve snaps from full flow to half flow, from 30 L/s to 15 L/s, the velocity change is 0.015 ÷ 0.01865, about 0.80 m/s, and the surge is about **110 m**. If the flow is cut from 30 L/s to 18 L/s, ΔV is about 0.64 m/s and the surge about **88 m**.

The same applies in reverse. A valve opened suddenly increases the velocity at the valve, and the head on its upstream side falls by a ΔV ÷ g. On a main whose steady pressure is low, a fast opening can pull the pressure below atmospheric just as a closure pushes it above.

## Where velocity changes hide

The velocity change in the equation is not always the obvious one. Four situations produce larger or less obvious changes than "the flow stops":

- **Flow reversal.** When a check valve closes only after reverse flow has developed, the change at closure is from the reverse velocity to zero, on top of the forward deceleration that came before. Chapter 6 works through it.
- **The highest flow, not the usual flow.** Surge is set by the largest velocity the line ever carries: commissioning flushing, a second pump started in parallel, a future duty, or a drain-down through a large valve. A main designed and checked at its everyday flow may meet its worst surge at a flow nobody wrote down.
- **Local velocity.** In a branch or a smaller pipe near a valve, the velocity is higher than in the main, and the surge in that section follows its own ΔV and its own wave speed.
- **Starting into an empty or partly filled line.** Water accelerating into a drained pipe can reach velocities well above design before it meets a closed valve, a trapped air pocket or the far end of the line, and then stops abruptly. Filling a main slowly, with air valves open, exists for this reason.

When screening, list the velocity changes that can occur, not just the design velocity, and take the largest.

## Which side goes up

The direction of the head change depends on which side of the disturbance you are on and whether the flow is stopping or starting:

```figure
type: compare
title: Direction of the instant head change
rowhead: Event
cols: Upstream side | Downstream side
caption: A wave carries the change away from its source in both directions. On the case's main, the inlet valve discharges straight into the tank, so only its upstream side matters; the pump has the main on its downstream side.
- * Valve closing | head rises by a ΔV ÷ g | head falls by a ΔV ÷ g
- Valve opening | head falls | head rises
- Pump stopping | suction head rises | discharge head falls: a downsurge into the main
- Pump starting | suction head falls | discharge head rises
```

The pump trip row is the important one for the case and for most pumped mains. When the pump stops, the water in the main is still moving away from it. The first wave into the main is a fall in head, not a rise. Chapters 6 and 7 follow that downsurge along the profile.

## Forces on fittings and anchors

A pipeline is held in place against its steady pressure forces by thrust blocks, anchors and the friction of its supports. Those forces are calculated for steady, or at most test, pressure. A surge changes them in two ways.

First, the force on every closed end, bend, tee and reducer rises with the pressure. At a closed valve, the extra axial force from a 2.16 MPa surge on the 0.01865 m² bore is about **40 kN**, against about 10.6 kN from the steady 58 m at the pump end.

Second, and less obviously, a surge creates forces where there were none. In steady flow, the pressure forces on the two bends at either end of a straight run of pipe balance through the pipe wall. While a wave front is travelling along that run, the bend behind the front sees the new pressure and the bend ahead still sees the old one. The run is pushed lengthwise by the difference, about 40 kN for the full surge, until the front reaches the far bend. Above-ground pipe on sliding supports, designed only for small thermal and friction loads, can be shoved off its supports or can shear its guides. This is why surge forces belong in the brief for pipe-support design, not only in the pressure check.

## A failure case: dividing by g twice

This is an illustration. A screening note for the case's main reads: "ρ a ΔV = 998 × 1,343 × 1.61 = 2,156,000. Divide by ρg to convert: 2,156,000 ÷ 9,790 = 220. Pressure rise 220 kPa, 0.22 MPa. Within PN16." The writer has converted pascals to metres of head, then labelled the result as kilopascals.

The number 220 is correct as metres of head. As kilopascals it is wrong by a factor of about ten. The real pressure rise is 2.16 MPa, well over the PN16 rating, not a fifth of it.

The error was detected by the mental check from this chapter: about 1.3 MPa per metre per second in steel. A velocity change of 1.6 m/s cannot produce only 0.22 MPa in a steel water main. The correction was to recalculate, carry units through every line of the note, and state the result in both head and pressure. The [water hammer pressure surge tool](/tools/water-hammer/) reports both for the same reason.

## A five-minute screening

Joukowsky's equation supports a screening that any engineer can do on the back of a drawing before deciding whether a full surge study is needed:

```figure
type: steps
title: Five-minute surge screening for a pumped main
caption: If either check fails, or the line has high points, long rising sections or fast-acting devices, commission a surge study. Passing the screen is not proof of safety.
- Calculate the wave speed | from Chapter 2, for each pipe material in the line
- Find the largest credible velocity change | full flow, reversal or local velocity
- Compute the Joukowsky head | a ΔV ÷ g, and the pipe period 2L ÷ a
- * Add it to the steady head at the worst points | compare with the lowest-rated component
- Subtract it from the steady head along the profile | compare with the pipe level and vapour pressure
```

For the case's main the screening fails on both counts. The upper check exceeds PN16 at the inlet valve. The lower check, which Chapter 7 develops, takes the grade line far below the pipe. The screening has done its job: it has shown that the main needs closer attention before the valve actuator and the pump controls are finalised.

It is worth noting what the screening assumes. It takes the worst case, an instant change, and ignores friction and the details of reflection. On a short line or a slow-acting system, it can be very conservative. On a long line with fast devices it is close to the truth for the first wave, and later effects can make matters worse rather than better.

## What Joukowsky does not tell you

The equation gives the size of a sharp front. It does not say:

- how long the high pressure lasts, which depends on the pipe period and reflections;
- whether a slower closure reduces the surge, and by how much, which depends on the valve's characteristic;
- what happens on the low side, where pressure can fall to vapour pressure and the simple equation no longer holds;
- how friction modifies the pressure behind the front over the following seconds.

Chapters 4 to 7 take these up in turn. The Joukowsky surge remains the yardstick throughout: no simple closure can do worse than a ΔV ÷ g plus the effects of friction, but column separation and trapped air, covered later, can.

## Exercise: the PE neighbour

The neighbouring site's 900 m PE main from Chapter 2 has a wave speed of about 310 m/s and carries water at 1.2 m/s. Find the surge for an instant full closure, and for an instant reduction to a third of the flow. Express both in head and in pressure.

**Answer.** Full closure: ΔH = 310 × 1.2 ÷ 9.81 ≈ **37.9 m**, about 371 kPa or 0.37 MPa.

Reduction to a third of the flow: ΔV = 1.2 × 2 ÷ 3 = 0.8 m/s, so ΔH = 310 × 0.8 ÷ 9.81 ≈ **25.3 m**, about 0.25 MPa.

These are modest compared with the steel main's 220 m, but the PE main's pipe period of 2 × 900 ÷ 310 ≈ 5.8 s means far more of its everyday valve operations are effectively instant. Its daily surges may also be numerous enough for fatigue to govern, which the pipe maker's guidance addresses.
