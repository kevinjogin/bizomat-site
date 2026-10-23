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

## Plotting an involute from coordinates

The string picture translates directly into coordinates, which is how CAD systems and gear software draw the curve. If the string has been unwound through an angle t, in radians, from the point where the involute starts on the base circle, its end sits at:

**x = r_b × (cos t + t × sin t)**

**y = r_b × (sin t − t × cos t)**

The length of string unwound is r_b × t, and the distance of the point from the centre is r_b × √(1 + t²).

For the conveyor pinion, with a base radius of 28.191 mm, a few points are:

- **t = 0:** x = 28.191, y = 0, radius 28.191 mm, the start of the involute on the base circle.
- **t = 0.2:** x ≈ 28.749, y ≈ 0.075, radius ≈ 28.749 mm.
- **t ≈ 0.364:** x ≈ 29.997, y ≈ 0.447, radius 30.000 mm, the pitch circle.
- **t ≈ 0.609:** x ≈ 32.937, y ≈ 2.040, radius 33.000 mm, the tip circle from Chapter 3.

Notice how small y stays. Across the whole working height of the tooth, from base circle to tip, the curve turns only about 2 mm away from a radial line. The involute is a gentle curve, which is one reason a small error in it matters: a few micrometres is a significant fraction of how much the profile bends at all.

## The radius of curvature is the unwound string

The string has a second use. At any point on an involute, the curve's radius of curvature is exactly the length of string unwound to reach it:

**ρ = √(r² − r_b²)**

where r is the radius of the point. At the pinion's pitch circle, this gives:

**ρ₁ = √(30² − 28.191²) ≈ 10.261 mm**, which equals 30 × sin 20°

and for the gear at its pitch circle, ρ₂ ≈ 30.782 mm. At the pinion tip, ρ rises to about 17.154 mm; at the base circle it falls to zero.

Two consequences follow. First, the flank near the base circle is sharply curved, so contact there concentrates stress, which is part of why designs avoid working the involute close to its start. Second, these radii are the ones Chapter 9 uses to treat two teeth as cylinders pressed together, and the tip value of 17.154 mm reappears in Chapter 4 as part of the path of contact.

## From small pinion to straight rack

Every involute has the same shape; only its scale changes with the size of the base circle. A small base circle gives a tightly curved flank, a large one a flatter flank, and an infinitely large one, the rack, a straight flank. The radii of curvature at the pitch point show the progression for teeth of the same module and pressure angle:

- **20-tooth pinion:** about 10.26 mm
- **60-tooth gear:** about 30.78 mm
- **Rack:** infinite, a straight line inclined at the pressure angle

That is why a pinion with few teeth looks pointed and strongly curved, while a large gear's teeth look almost straight-sided. It also explains why the pinion usually limits surface strength: its smaller radius of curvature concentrates contact stress, as Chapter 9 shows.

## Below the base circle

No involute exists inside the base circle, so whatever shape a tooth has there is not an involute. On a generated gear, the region below the working profile is a fillet curve, called a trochoid, traced by the tip of the cutting tool. It joins the flank to the root and controls the tooth's bending strength, but it must never carry contact with the mating tooth.

For standard teeth with a 20° pressure angle, whether the base circle sits above or below the root circle depends on the tooth number. With a dedendum of 1.25 modules, the base circle lies above the root circle when z × cos 20° is greater than z − 2.5, which holds for 41 teeth or fewer. For the conveyor pair, using the diameters from Chapter 3:

- **Pinion:** base diameter 56.382 mm, root diameter 52.5 mm, so about 1.94 mm of each flank, measured radially, lies below the base circle and is not involute.
- **Gear:** base diameter 169.145 mm, root diameter 172.5 mm, so the involute reaches all the way down to the root.

The mating gear's tip must stay clear of the pinion's non-involute region. When it does not, the result is interference or undercut, the subject of Chapter 5.

## Rolling and sliding along the line of action

At the pitch point, the two tooth surfaces move at the same speed in the same direction: they roll without sliding. Everywhere else on the line of action, one surface moves faster than the other, and they slide. The sliding speed is the sum of the two angular speeds multiplied by the distance of the contact point from the pitch point.

For the conveyor pair, the pinion turns at 150.80 rad/s and the gear at 50.27 rad/s, a total of 201.06 rad/s. Contact begins where the gear's tip meets the pinion flank near its root, about 7.903 mm before the pitch point along the line of action, and ends where the pinion's tip leaves the gear, about 6.894 mm after it:

- **Start of contact:** 201.06 × 7.903 / 1,000 ≈ 1.589 m/s sliding
- **Pitch point:** zero sliding, pure rolling
- **End of contact:** 201.06 × 6.894 / 1,000 ≈ 1.386 m/s sliding

```figure
type: bars
title: Sliding speed along the conveyor pair's path of contact
unit: m/s
max: 2
caption: Sliding is zero at the pitch point and greatest at the ends of contact; its direction reverses at the pitch point.
- Start of contact, gear tip | 1.589
- Pitch point | 0
- *End of contact, pinion tip | 1.386
```

The direction of sliding also reverses at the pitch point. On the pinion, the surface below the pitch line, the dedendum, is overtaken by the mating tooth, while the addendum above it overtakes. That reversal shows up on worn gears as different textures above and below the pitch line, and it is one reason pitting often starts just below it on the pinion. The sliding at the ends of contact is where friction losses arise and where scuffing begins if the oil film breaks down. Profile shift, covered in Chapter 5, can be used to balance these sliding speeds between pinion and gear.

## The involute function

Tooth thickness calculations in later chapters use the **involute function**, which describes how far the involute curve has turned from its starting point at a given pressure angle:

**inv α = tan α − α**

with α in radians. For 20°, α ≈ 0.349066 rad, so:

**inv 20° ≈ 0.363970 − 0.349066 ≈ 0.014904**

That small number appears in the span measurement of Chapter 10 and in profile-shift calculations.

## Why the involute displaced other tooth forms

Other curves satisfy the law of gearing. Cycloidal teeth, generated by rolling one circle on another, were common in early machinery and survive in clocks, watches and some lobed pumps and blowers. They can give good contact with few teeth. The involute nevertheless became the industrial standard because of three practical advantages:

- **A straight-sided rack.** The involute of an infinitely large base circle is a straight line, so the basic rack has straight flanks. Cutting tools such as hobs and rack cutters can therefore be made and checked accurately, and one tool cuts every tooth number of the same module and pressure angle.
- **Tolerance to centre distance.** Moving involute gears slightly apart leaves the ratio exactly constant; only the backlash and the operating pressure angle change, as Chapter 4 shows. Cycloidal gears lose their constant ratio when moved apart.
- **A fixed direction of force.** Because contact always lies on the straight line of action, the force between the teeth keeps the same direction throughout the mesh, ignoring friction. The bearings see a steady load direction instead of one that swings as each tooth engages.

## Modifying the perfect involute on purpose

A perfect involute is ideal only for perfectly rigid teeth. Under load, teeth bend and the shafts deflect, so the next tooth arrives slightly early and strikes the mesh at its tip. To soften that entry, gear designers often specify **tip relief**, a small, controlled removal of material near the tip, and sometimes root relief on the mating gear. Along the face width, **crowning** or helix modifications compensate for shaft bending and misalignment so that load does not pile up at one end of the tooth.

These modifications are typically a few micrometres to some tens of micrometres, chosen for a particular load. They are specified on the drawing and checked on a gear measuring machine, which traces the profile and compares it with the theoretical involute. For the conveyor pair, running at moderate load and speed, standard unmodified teeth of a suitable accuracy grade are a reasonable starting point; a quieter or more heavily loaded drive would justify a modified profile designed with gear software or supplier support.

## Exercise: forces at a different pressure angle

A pair transmits a tangential force of 1,000 N. Calculate the radial force and the normal force at pressure angles of 20° and 25°, and state the increase in bearing radial load.

At 20°, **Fr ≈ 1,000 × 0.3640 = 364 N** and **Fn ≈ 1,000 × 1.0642 ≈ 1,064 N**. At 25°, **Fr ≈ 466 N** and **Fn ≈ 1,103 N**. The radial load rises by about **102 N, or 28%**, for the same torque. Explain why a designer might still choose 25° for a heavily loaded pinion with few teeth.
