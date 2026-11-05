---
book: clutches-and-brakes-by-the-numbers
chapterSlug: cone-clutches
order: 5
title: "Cone clutches"
description: "How a cone multiplies its axial force into friction torque, why engaging needs more force than holding, when a cone sticks, and how to check its torque, slip time and heat."
draft: false
---

A cone clutch is a plate clutch folded into a cone. Its friction surfaces are the outside of one cone and the inside of another, pushed together along the shaft. The wedge does something a flat plate cannot: a modest axial force produces a much larger force square to the cone's surface, and that normal force is what makes friction. The same wedge that multiplies the force also makes the clutch harder to engage than to hold, and, if the cone is too steep, can lock it so firmly that it must be pulled apart.

This chapter sizes the cone clutch that engages the SW-25's warping capstan, with the BIZOMAT cone clutch tool and the cone clutch engagement check. It explains the engaging force, the half-angle and sticking. Its mistake is an angle read from a drawing: the included angle entered where the tool asks for the half-angle.

## The capstan and its duty

The SW-25 carries a warping capstan on an extension of the clutch shaft's countershaft, turning at 24 rpm. The yard's hands use it to pull mooring lines and to position boats over the cradle before a haul: a few turns of rope round the 250 mm barrel, the tail held by hand, and the capstan's friction does the pulling. Its rated line pull is 3 kN, a torque of 3,000 × 0.125 = 375 N·m at the barrel, and its line speed is π × 0.25 × 24 = 18.8 m/min.

The capstan is engaged by a cone clutch so that it can stand still while the winch hauls. With a service factor of 1.5, the clutch must carry 562.5 N·m. This is an illustration.

## How a cone makes torque

The cone's friction surface makes a half-angle α with the shaft axis. An axial force F pressing the cones together produces a normal force on the surface of F ÷ sin α, because only the small sin α share of the normal force points along the axis. For the SW-25's cone, with α = 12.5°, sin α = 0.2164, so each newton of axial force produces 4.62 N of normal force. The friction torque is μ times the normal force times the mean radius.

```figure
type: formula
title: Cone clutch torque and engaging force, uniform wear
formula: T = μ F (Do + Di) ÷ (4 sin α)
formula: Engaging force Fe = F (sin α + μ cos α) ÷ sin α
formula: Releases by itself when tan α > μ
caption: F is the axial force that holds the clutch engaged, α the cone's half-angle measured from the shaft axis, Do and Di the large and small diameters of the friction face. The first formula is the plate clutch's uniform-wear formula divided by sin α. While the cones slide axially into contact, friction resists that sliding too, which is why engaging takes more force than holding.
- α | half-angle between the cone face and the axis
- F | axial holding force
- Fe | axial force while the cone is being pushed in
```

### Engaging takes more force than holding

While the cones slide together, friction acts along the surface against the sliding, and part of that friction points along the axis. The axial force must overcome it as well as provide the normal force's axial share. The result is the engaging force in the figure, F (sin α + μ cos α) ÷ sin α. For the SW-25's cone it is 2.35 times the holding force. Once engaged, the friction no longer opposes axial motion, and the holding force alone keeps the torque.

## Sizing the capstan's cone

The cone chosen has a large diameter of 300 mm, a small diameter of 250 mm, a half-angle of 12.5° and a woven lining with μ = 0.30. The force needed for 562.5 N·m is 562.5 × 4 × 0.2164 ÷ (0.30 × 0.550) = 2,951 N; the operating screw is set to hold 3,000 N.

The [cone clutch tool](/tools/cone-clutch/) takes the large and small diameters of the cone face, the half-angle, the friction coefficient, the axial holding force and the required torque with its service factor. It returns the torque capacity by the uniform-wear model, the engaging force and the ratio of capacity to requirement. It also checks the angle: below 8° it warns that the cone may jam.

```figure
type: steps
title: The capstan clutch in the cone clutch tool
caption: This is an illustration. Cone 300 to 250 mm, half-angle 12.5°, μ = 0.30, axial holding force 3,000 N, required 562.5 N·m.
- * Torque capacity | 571.8 N·m
- Engaging force | 7,060 N
- Capacity ÷ required | 1.02: CAPACITY SUFFICIENT
- Cone angle | 12.5°: not below 8°
```

The comparison with a plate clutch is striking. A single flat face with the same mean radius of 137.5 mm and the same 3,000 N would carry 0.30 × 3,000 × 0.1375 = 123.8 N·m; the cone carries 4.62 times as much. That multiplication is why cone clutches suit hand-operated machinery: a screw or lever can provide a few kilonewtons, and the cone turns it into the normal force of a much larger plate clutch.

The cone's friction face is the slant surface, 25 ÷ sin 12.5° = 115.5 mm long, with an area of about 0.0998 m². The normal force of 13,861 N spread over it gives an average pressure of 0.139 MPa, comfortably within the lining's limit.

## The half-angle: a trade-off with a trap

A smaller half-angle multiplies the force more, so the same holding force gives more torque. It also makes the cone harder to engage and, below a certain angle, makes it stick.

The sticking condition comes from the same geometry. To pull the cones apart, the axial force must overcome the friction that now resists withdrawal, less the axial share of the normal force, which helps push the cones apart. The release force is F (μ cos α − sin α) ÷ sin α. If it is negative, the cone springs apart by itself when the holding force is removed; if it is positive, the cone stays engaged and must be pulled out. The dividing line is tan α = μ.

```figure
type: compare
title: The capstan cone at three half-angles, 3,000 N holding force
cols: Torque | Engaging force | Force to release | Behaviour
rowhead: Half-angle
- 8° | 889 N·m | 9,404 N | pull of 3,404 N | Sticks firmly
- * 12.5° | 572 N·m | 7,060 N | pull of 1,060 N | Sticks; needs a positive release
- 20° | 362 N·m | 5,473 N | none: pushes apart with 527 N | Releases by itself
caption: This is an illustration. Cone 300 to 250 mm, μ = 0.30. With μ = 0.30 the dividing angle is arctan 0.30 = 16.7°. The tool's warning below 8° flags only the steepest cases; any angle whose tangent is below the friction coefficient will hold itself in.
```

At 12.5°, tan α = 0.222, less than μ = 0.30, so the SW-25's cone will not release on its own. The yard knew this: the capstan's operating screw is double-acting, and turning it back pulls the cone out against about 1,060 N. A clutch operated by a spring that only pushes in would need a release spring or a positive withdrawal of that size, and a wet lining, with a lower μ, would release more easily than a dry one.

### Choosing the angle

The choice depends on how the clutch is operated and released. Cones operated by a screw, which can pull as well as push, can use angles of 10° to 15° and enjoy the higher multiplication. Cones held in by a spring and released by a lever that only pushes against that spring are given angles whose tangent exceeds the lowest friction coefficient expected, so that they let go when the spring is relieved. In both cases the angle is chosen with the friction range from Chapter 2 in mind, because a lining that has more friction than expected also holds itself in more firmly.

## Engagement: force, not heat

A cone clutch engages under slip just as a plate clutch does, and the same physics applies. The [cone clutch engagement check tool](/tools/cone-clutch-engagement/) takes the cone's geometry, friction and holding force and the required torque, as the cone clutch tool does, and adds the load inertia at the clutch, the driving speed, the load torque during the start, and the mass and specific heat of the cone and the largest temperature rise allowed per engagement. It returns the torque capacity and engaging force, the slip time, the slip energy alongside the load's kinetic energy, and the temperature rise of the cone, with a verdict on both torque and heat, and a reminder to check that the cone cools between starts.

```figure
type: steps
title: Engaging the capstan in the cone clutch engagement check
caption: This is an illustration. As above, with the capstan side's inertia 0.6 kg·m² at the clutch, driving speed 24 rpm, load torque 20 N·m with the line slack, 6 kg of cone at 0.46 kJ/(kg·K), limit 15 K.
- Torque capacity | 571.8 N·m
- Slip time | 0.003 s
- Slip energy ÷ load kinetic energy | 1.96 J ÷ 1.90 J
- * Temperature rise per engagement | 0.0007 K: CLUTCH ADEQUATE
```

At 24 rpm the capstan's kinetic energy is under 2 J, and the engagement is over in three milliseconds. Even engaged against the full 375 N·m of line pull, the slip time is only 8 ms and the heat 5.5 J. For a slow capstan the cone clutch is a question of force: whether the screw can provide 7 kN to engage it and 1 kN to release it, and whether the capstan's hands can do so with the line under load. The engagement check confirms that heat can be set aside; it does not need to be designed for.

## Wear moves a cone a long way

The wedge that multiplies force also multiplies wear's effect on position. When the lining on a cone wears by a thickness δ, measured square to the face, the inner cone must move further into the outer one by δ ÷ sin α along the axis before the surfaces meet again. At 12.5° that is 4.62 times the wear: half a millimetre of lining wear moves the capstan's cone 2.3 mm further in, and 2 mm of wear moves it 9.2 mm.

That has two consequences. A cone operated by a screw simply takes a few more turns to engage as it wears, and the operator's screw must have the travel to follow it; the SW-25's screw was checked for the full 9.2 mm, with a mark on the housing that shows when the lining has reached its wear limit. A cone held in by a spring loses spring force as it moves in, by the spring's rate times the extra travel, and the loss is 4.62 times what the same wear would cost a plate clutch with the same spring. Spring-held cones therefore use soft springs with long travel, or an adjuster, and their capacity is checked at the worn position, not only when new.

The same multiplication affects how a cone beds in. A new cone that touches only at its large or small end carries less torque than calculated until it wears to full contact, and because the axial motion needed to close a small mismatch is large, a cone with a poor fit may never bed in fully. Cones are machined as matched pairs and checked with marking blue before assembly.

## Where cone clutches are used

Cone clutches appear wherever a modest axial force must produce a large friction torque in a small space. The synchronisers in a manual vehicle gearbox are small cone clutches that bring a gear to the shaft's speed before its teeth engage. Older winches, capstans and machine tool feed drives use cones engaged by a screw or a lever. Some overload clutches use a cone held in by a spring, set to slip at a chosen torque.

They are less common in large industrial drives, where multi-plate clutches give more friction area for the same diameter, and where the engaging force, about two to three times the holding force, would need a larger actuator. For the SW-25's capstan, the cone's compact housing and its screw operation suited a slow, hand-controlled duty.

## The mistake: the included angle

The capstan clutch's drawing shows the cone's angle as 25°, the included angle between opposite sides of the cone. The first check entered 25° in the tool's half-angle box. The tool reported a capacity of 292.8 N·m, CAPACITY TOO LOW, and the designer began looking for a bigger cone.

The check that caught it was a sketch. Drawn with a 25° half-angle, the cone's face would be 25 ÷ sin 25° = 59 mm long, not the 115.5 mm on the drawing. Drawings show cone angles either way, and the tool, like most formulas, asks for the half-angle measured from the axis. Halving the drawing's 25° gives 12.5° and the correct capacity of 571.8 N·m. The error ran in the safe direction this time; the opposite slip, entering half of an angle that was already a half-angle, would double the apparent multiplication and overstate the torque by about 99%.

```figure
type: checklist
title: Before trusting a cone clutch calculation
caption: The capstan clutch review's checks. This is an illustration.
- x Half-angle from the axis confirmed against the drawing by a sketch or the face length
- x Holding force from the operating mechanism, at the worn position
- x Engaging force checked against what the screw or lever can provide
- x Release checked: tan α against the lowest friction expected
- x Capacity at the lowest friction expected at or above the required torque
- x Engagement heat checked once, and set aside if negligible
```

## Exercise: a small cone clutch on a faster shaft

**Problem.** A cone clutch on a 300 rpm shaft has a large diameter of 180 mm, a small diameter of 150 mm, a half-angle of 10° and μ = 0.25. It is held engaged by 1,800 N and must carry 150 N·m. The driven inertia is 0.4 kg·m², the load torque during engagement 30 N·m, and the cone that takes the heat weighs 3 kg at 0.46 kJ/(kg·K). Find (a) the capacity and engaging force, (b) whether it will release on its own, and (c) the slip time and temperature rise.

**Answer.** sin 10° = 0.1736, cos 10° = 0.9848.

(a) T = 0.25 × 1,800 × 0.330 ÷ (4 × 0.1736) = 213.8 N·m, a ratio of 1.43. Engaging force = 1,800 × (0.1736 + 0.25 × 0.9848) ÷ 0.1736 = 4,352 N.

(b) tan 10° = 0.176, less than 0.25: it will stick. The release force is 1,800 × (0.25 × 0.9848 − 0.1736) ÷ 0.1736 = 752 N.

(c) ω = 31.42 rad/s. Slip time = 0.4 × 31.42 ÷ (213.8 − 30) = 0.068 s. Slip energy = 213.8 × 31.42 × 0.068 ÷ 2 = 229.6 J, against 197.4 J of kinetic energy. Temperature rise = 229.6 ÷ (3 × 460) = 0.17 K.

**The check.** At 300 rpm the heat is still small. The design questions are the 4.35 kN engaging force and the 752 N release pull, both of which the operating mechanism must provide.

If the same cone had a half-angle of 15°, its tangent of 0.268 would exceed μ = 0.25 and it would release by itself, but the same 1,800 N would carry only 143.4 N·m, below the 150 N·m required. The angle that releases cleanly would need a larger holding force or a larger cone.
