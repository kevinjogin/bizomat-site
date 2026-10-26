---
book: plate-work-by-the-numbers
chapterSlug: rolling-plate-springback-and-templates
order: 3
title: "Rolling plate: flat ends, springback and templates"
description: "Why 6 mm plate rolled to a 1,203 mm radius springs back to 3,867 mm, how flat ends make a peaked seam, how to read a sweep template, and a course rolled to its final radius by calculation."
draft: false
---

A plate roll does not make a radius; it makes a plate bend, and the plate decides how much of that bend it keeps. When the rolls release it, the elastic part of the bending springs back, and for a plate rolled gently to a large radius, most of the bending is elastic. A plater who sets the rolls to the shell's radius and expects the plate to stay there will be disappointed every time.

This chapter estimates how far the running case's 6 mm shell plates spring back, shows why their ends stay flat unless they are pre-bent and what that does to the seam, and explains the sweep templates that platers use to roll to a radius they cannot calculate exactly. It ends with a course whose rolls were set by calculation to its final radius.

## How a three-roll machine bends plate

A common plate roll has three rolls. In a pyramid arrangement, two lower rolls support the plate and an upper roll between them presses down; in an initial-pinch arrangement, the plate is gripped between two rolls and bent by a third. Either way, the plate passing through is bent in three-point bending between the rolls, and the bend it takes depends on how far the bending roll is set into the plate.

Each pass curves the whole plate a little; the plater adjusts the bending roll and passes the plate back and forth until the curvature matches a template. The process is incremental by design. It lets the plater approach the final radius from the open side, where too little curvature can be corrected with another pass, rather than overshoot, where too much curvature is hard to take out on most three-roll machines.

## Springback: the numbers

When plate is bent, its outer and inner fibres are strained most, and the strain falls to zero at the neutral surface. Fibres strained beyond the yield strain deform plastically and keep their new length; fibres strained less behave elastically and spring back when the load comes off. If only a thin skin on each face has yielded, most of the plate's thickness springs back and the plate opens up to a much larger radius.

The radius at which yielding just begins at the surface is E × t ÷ (2Y), where E is the elastic modulus and Y the yield strength. This is an illustration. Taking E = 200,000 MPa and Y = 250 MPa for the running case's plate, that radius is 200,000 × 6 ÷ 500 = **2,400 mm**. A 6 mm plate bent to any radius larger than 2,400 mm springs back flat. The shell's mean radius, 1,203 mm, is only half of that, so the plate is only just into the plastic range.

Gardiner's relationship for an ideal elastic, perfectly plastic material estimates the radius after release, Rf, from the radius under load, Ri:

Ri ÷ Rf = 4x³ − 3x + 1, where x = Ri × Y ÷ (E × t)

```figure
type: formula
title: Springback of plate rolled to a large radius
formula: x = Ri × Y ÷ (E × t)        Ri ÷ Rf = 4x³ − 3x + 1
caption: This is an illustration. The running case's 6 mm plate with an assumed yield strength of 250 MPa, rolled under load to its final mean radius of 1,203 mm and then released.
- Ri | Radius of the neutral surface while bent in the rolls
- Rf | Radius after the plate is released
- Y | Yield strength, assumed 250 MPa
- E | Elastic modulus, 200,000 MPa
- t | Plate thickness, 6 mm
step: x = 1,203 × 250 ÷ (200,000 × 6) = 0.251
step: Ri ÷ Rf = 4 × 0.0158 − 0.752 + 1 = 0.311
step: Rf = 1,203 ÷ 0.311 = about 3,867 mm, three times the intended radius
```

Turned around, the same relationship tells the plater how tightly the plate must be bent under load to finish at 1,203 mm. Solving it numerically gives Ri = **695 mm**. The plate must be bent under load to little more than half its final radius, and then released, to finish where it should.

## Yield strength decides it

The estimate depends heavily on the yield strength, and the yield strength of a given plate is not known exactly in advance. Plate is sold to a minimum yield strength, and the actual value on the mill certificate is commonly higher, varying from heat to heat.

```figure
type: bars
title: Radius the plate must be bent to under load, by yield strength
unit: mm
max: 750
caption: This is an illustration from Gardiner's relationship for 6 mm plate finishing at a 1,203 mm mean radius. A stronger plate must be bent tighter, and the difference between plates is tens of millimetres of radius.
- * Yield 250 MPa | 695
- Yield 300 MPa | 643
- Yield 350 MPa | 599
```

A 100 MPa spread in yield strength moves the required bending radius by about 100 mm. No calculation can set the rolls for a particular plate within the shell's tolerance, and that is why platers roll to a template, not to a number. The calculation is still worth doing: it tells the plater that this job needs heavy overbending, that each plate in the batch may behave differently, and that the first plate should be rolled slowly with frequent checks.

## Flat ends and peaking

A three-roll machine cannot bend the very ends of a plate, because each end must be supported on the far side of the bending roll to be bent at all. Without special steps, each end of the plate leaves the rolls with a flat, unbent length that is roughly half the distance between the lower rolls' centres. This is an illustration. On the shop's machine, with lower rolls about 300 mm apart, the flats are about 150 mm long.

When the two flat ends meet at the seam, they form a ridge. Each flat continues straight from the point where its curvature ends, so the seam stands proud of the true circle by about √(R² + f²) − R, where f is the length of each flat. For the running case's shell:

- flats of 100 mm put the seam **4.2 mm** proud;
- flats of 150 mm put it **9.3 mm** proud;
- flats of 200 mm put it **16.5 mm** proud.

This outward ridge at a seam is called **peaking**. It is a defect in a shell, because the hoop load in a peaked seam tries to straighten it, bending the weld. Designers' drawings and the standards they call up limit peaking, and a 9 mm peak on a 2.4 m shell would be far outside most limits.

The remedy is to **pre-bend** each end before rolling: either press the ends on a press brake with a die or template shaped to the final radius, or roll each end over a thicker sacrificial plate so that the end is supported while bent. Many modern plate rolls also have a pre-bending capability built in. Whichever method is used, the ends are checked with the same template as the body of the plate.

## Sweep templates

A **sweep template** is a curved board or thin plate whose edge is an arc of the radius the plate must have. Held against the rolled plate, it shows gaps where the plate is too flat or too curved. Templates are made to the surface they are held against: an inside template for the inside of the shell, an outside template for the outside.

A template of chord length c on a radius R has a rise at its middle, the sagitta, of R − √(R² − (c ÷ 2)²). For a 1,000 mm chord:

- on the shell's inside radius of 1,200 mm, the sagitta is **109.13 mm**;
- on its mean radius of 1,203 mm, 108.83 mm;
- on its outside radius of 1,206 mm, 108.53 mm.

A template that shows a gap tells the plater about the radius through the sagitta. Near the running case's radius, a 1 mm change in sagitta over a 1,000 mm chord corresponds to about **10 mm** of radius. A 2 mm gap at the middle of an inside template means the plate's radius is about 20 mm too large, still too flat, and needs another pass. That sensitivity is why a long template is used: a 1,000 mm chord shows a radius error that a 300 mm chord would hide.

```figure
type: compare
title: Sagitta of a 1,000 mm chord at radii near the shell's
rowhead: Radius
cols: Sagitta, mm | Meaning for the plater
caption: An inside template for the running case is cut to 1,200 mm radius. Over the same chord, a plate at 1,300 mm rises 9.13 mm less than the template and one at 1,100 mm rises 11.07 mm more, which shows as a gap at the middle or at the ends.
- 1,100 mm | 120.20 | Over-rolled: too tight, hard to correct
- * 1,200 mm, inside surface | 109.13 | The inside template's own rise
- 1,203 mm, mean surface | 108.83 | Reference only
- 1,206 mm, outside surface | 108.53 | The outside template's own rise
- 1,300 mm | 100.00 | Under-rolled: another pass needed
```

The template is cut to the inside or outside surface, not the mean, because those are the surfaces it touches. Cutting it to the mean radius and holding it inside would show a 0.3 mm gap on a perfect plate, which is small but is exactly the kind of systematic error a plater will "correct" by over-rolling.

## Checking along the plate's width

A template check at one place on the plate shows the radius there and nowhere else. The plater checks each plate at both edges and at the middle of its 2,400 mm width, and at the middle and near each end of its length, nine checks in all.

The checks across the width catch a fault that is easy to miss. If the bending roll is not parallel to the lower rolls, because it has been set unevenly at its two ends or the plate has been fed in at a slight angle, the plate is bent more at one edge than the other and comes out slightly conical. On a 2,400 mm wide plate, a difference of 1 mm in template gap between the two edges means a radius difference of about 10 mm, or 20 mm of diameter, between the top and bottom of the course. The course will not stack squarely on its neighbour, and the circumferential seam will have a step on one side.

The checks along the length catch uneven rolling: a plate that has been rolled tighter in its middle than near its ends, because the plater spent more passes there, shows a template gap that changes along the plate. Each fault is easy to correct while the plate is still in the rolls and nearly impossible once the course is welded.

## Rolling force, for planning

The force the rolls must apply is a planning number for choosing a machine, not a machine setting. This is an illustration. Once the plate's whole thickness has yielded, the bending moment it resists is its plastic moment, Y × b × t² ÷ 4, where b is the plate's width across the rolls. For the running case's 2,400 mm wide plate, that is 250 × 2,400 × 6² ÷ 4 = **5.4 kN·m**. In three-point bending between lower rolls 300 mm apart, the bending roll's force is about 4 × M ÷ L = 4 × 5.4 ÷ 0.3 = **72 kN**.

That is a modest load for a plate roll that handles 2,400 mm wide plate, but the estimate assumes the minimum yield strength and full plastic bending. A higher actual yield raises it in proportion, and pre-bending the ends in the rolls needs much more force, because the bending span is short. The machine's own capacity chart, from its manufacturer, governs what it may roll. Plate rolling is also hazardous work: the rolls can draw in hands and clothing, and a released plate can spring violently. Guarding and safe work procedures for the machine come before any number in this chapter.

## The error: rolled to the final radius by calculation

This is an illustration. A new plater on the job worked out the bending roll's setting from the geometry of the rolls for a radius of 1,203 mm, set the machine to it and passed the first lower course plate through several times without checking. The setting, from the sagitta relation over 300 mm roll spacing and ignoring the rolls' own diameters, moved the bending roll about 9.4 mm into the plate.

The plate came out of the rolls with a radius of several metres, nearly flat. The setting was correct for the radius under load, and the plate, as the springback calculation predicts, sprang back to about three times that radius when released. The fault was seen at once when the plate was stood up, and a template confirmed it.

No harm was done to the plate, because it had been under-rolled, not over-rolled. The plater continued in small increments, checking with the inside template after each pass, and the plate reached its radius with the bending roll set about 16 mm into the plate, close to what the sagitta relation gives for a 695 mm radius under load. The shop's procedure was changed in one line: "Roll to template, in increments, from the open side. Never set the rolls to a calculated final radius."

```figure
type: checklist
title: Rolling a shell plate
caption: The sequence that would have avoided the flat first plate and that keeps peaking within the drawing's limit.
- Ends pre-bent to the template before rolling the body | no flat ends at the seam
- Inside template cut to the inside radius, 1,000 mm chord | rise 109.13 mm
- Rolled in increments from the open side | under-rolling is easy to correct; over-rolling is not
- Template checked after each pass, at both ends and the middle | about 10 mm of radius per 1 mm of gap
- Each plate treated as different | yield varies from heat to heat
- x Rolls set to a calculated radius and the plate passed without checking | springs back nearly flat
```

## Exercise: a thicker plate

The same shell is to be made in 10 mm plate, still with a 1,203 mm mean radius and an assumed yield strength of 250 MPa. Estimate the radius after release if the plate were bent under load only to 1,203 mm, and the radius it must be bent to under load.

**Worked answer.** The elastic limit radius is 200,000 × 10 ÷ 500 = 4,000 mm, so 1,203 mm is now well inside the plastic range.

- x = 1,203 × 250 ÷ (200,000 × 10) = **0.150**.
- Ri ÷ Rf = 4 × 0.150³ − 3 × 0.150 + 1 = **0.563**, so a plate bent to 1,203 mm would spring back to 1,203 ÷ 0.563 = about **2,139 mm**.
- Solving for the radius under load that releases to 1,203 mm gives about **833 mm**.

The thicker plate springs back less in proportion, because more of its thickness has yielded, but it still needs bending to about 70% of the final radius. It also needs nearly three times the rolling force of the 6 mm plate, since the plastic moment grows with the square of the thickness: (10 ÷ 6)² = 2.8.
