---
book: gears-by-the-numbers
chapterSlug: the-involute-and-pressure-angle
order: 2
title: "The involute and the pressure angle"
description: "See why involute teeth keep a constant speed ratio, how the base circle and line of action are defined, and what the pressure angle does to tooth forces."
draft: false
---

A gear pair must transmit a constant speed ratio, not just an average one. If the ratio wavered slightly as each pair of teeth rolled through contact, the output would accelerate and decelerate many times per revolution, producing vibration, noise and wear. The tooth shape that solves this problem for almost every industrial gear is the involute.

This chapter explains what an involute is, why it gives a constant ratio, and how the pressure angle sets the direction of the forces between teeth.

## The condition for a constant ratio

At the point where two teeth touch, both surfaces share a common normal, the line perpendicular to both at the contact point. For the speed ratio to stay constant, that common normal must always pass through the same fixed point on the line joining the gear centres, called the **pitch point**. This is often called the fundamental law of gearing.

Many curve pairs satisfy it in principle. The involute of a circle satisfies it in a way that is also easy to manufacture, tolerant of small errors in centre distance, and the same for every gear of a given system.

## What an involute is

Imagine a string wound around a circle, the **base circle**. Hold the free end taut and unwind it. The path traced by the end of the string is an involute. At every point, the taut string is tangent to the base circle and perpendicular to the involute, which is the geometric property that makes the involute work.

```figure
type: svg
title: Unwinding an involute from the base circle
alt: A base circle with an involute curve starting at its surface and sweeping outward. A straight line, representing a taut unwound string, runs from a tangent point on the base circle to a point on the involute, meeting the curve at right angles.
caption: The taut string is always tangent to the base circle and perpendicular to the involute it traces.
viewbox: 0 0 600 270
body:
<circle class="bx" cx="200" cy="170" r="90"/>
<circle class="fa" cx="200" cy="170" r="4"/>
<path class="la draw" d="M290.0 170.0L290.4 170.0L291.8 169.8L294.0 169.2L296.9 168.1L300.6 166.3L304.8 163.8L309.4 160.2L314.4 155.6L319.4 149.9L324.4 142.9L329.1 134.7L333.3 125.3"/>
<path class="ln dsh" d="M248.6 94.3L324.4 142.9"/>
<circle class="fa pulse" cx="324.4" cy="142.9" r="5"/>
<circle class="fi" cx="248.6" cy="94.3" r="4"/>
<text class="tx txs" x="120" y="68">Base circle</text>
<text class="txa" x="342" y="122">Involute</text>
<text class="tx txs" x="300" y="90">Unwound string</text>
```

When two involute gears mesh, the contact point travels along a straight line tangent to both base circles. That line is the **line of action**. Because each tooth surface is always perpendicular to the string that generated it, the common normal at the contact point always lies along this one straight line, which passes through the pitch point. The law of gearing is satisfied automatically.

## The pressure angle

The line of action is inclined to the tangent of the pitch circles by the **pressure angle**, α. Most modern industrial gears use α = 20°, which ISO 53 adopts in its standard basic rack; 14.5° appears in older designs and 25° in some heavily loaded ones.

The pitch circle and base circle are related through the pressure angle:

**d_b = d × cos α**

For the conveyor pinion, with a pitch diameter of 60 mm (Chapter 3 explains how it is found):

**d_b1 = 60 × cos 20° ≈ 60 × 0.939693 ≈ 56.382 mm**

and for the 180 mm gear, d_b2 ≈ 169.145 mm. No involute exists inside the base circle, which matters when teeth are short or tooth numbers small (Chapter 5).

## The pressure angle splits the tooth force

The force between teeth acts along the line of action, ignoring friction. It can be split into a **tangential** component Ft, which transmits torque, and a **radial** component Fr, which pushes the gears apart and loads the bearings:

**Fr = Ft × tan α**

**Fn = Ft / cos α**

where Fn is the total normal force along the line of action. At 20°, tan α ≈ 0.364 and 1/cos α ≈ 1.064. Every newton of tangential force brings about 0.364 N of radial force, and the tooth surfaces carry about 6.4% more than the tangential force alone.

```figure
type: compare
title: How the pressure angle changes tooth forces
cols: Radial ÷ tangential | Normal ÷ tangential
caption: Higher pressure angles give stronger, shorter teeth but load the bearings more for the same torque.
- 14.5° | 0.2586 | 1.0329
- *20° | 0.3640 | 1.0642
- 25° | 0.4663 | 1.1034
```

A higher pressure angle gives a tooth that is wider at its root and therefore stronger in bending, with less tendency to undercut. The cost is a larger radial force on the bearings and, generally, a lower contact ratio, so fewer pairs of teeth share the load. The 20° standard is a widely accepted compromise.

## The involute function

Tooth thickness calculations in later chapters use the **involute function**, which describes how far the involute curve has turned from its starting point at a given pressure angle:

**inv α = tan α − α**

with α in radians. For 20°, α ≈ 0.349066 rad, so:

**inv 20° ≈ 0.363970 − 0.349066 ≈ 0.014904**

That small number appears in the span measurement of Chapter 10 and in profile-shift calculations.

## Exercise: forces at a different pressure angle

A pair transmits a tangential force of 1,000 N. Calculate the radial force and the normal force at pressure angles of 20° and 25°, and state the increase in bearing radial load.

At 20°, **Fr ≈ 1,000 × 0.3640 = 364 N** and **Fn ≈ 1,000 × 1.0642 ≈ 1,064 N**. At 25°, **Fr ≈ 466 N** and **Fn ≈ 1,103 N**. The radial load rises by about **102 N, or 28%**, for the same torque. Explain why a designer might still choose 25° for a heavily loaded pinion with few teeth.
