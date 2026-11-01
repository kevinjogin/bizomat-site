---
book: springs-by-the-numbers
chapterSlug: spring-rate-energy-and-combinations
order: 1
title: "Spring rate, stored energy and springs that work together"
description: "What a spring's rate is, how much energy it stores, and how springs and their supports combine in series and in parallel, with the VM-8's spring register."
draft: false
---

Every solid part is a spring. Pull a steel bar and it stretches in proportion to the force; twist a shaft and it twists in proportion to the torque; squeeze the atoms of a crystal and they push back in proportion to how far they have moved. Near any position of equilibrium, a small movement stores energy in proportion to the square of that movement, and the force to hold it there is proportional to the movement itself. A spring is a part shaped so that this ordinary elastic behaviour gives a useful amount of movement at a useful force.

This chapter sets out the three ideas the rest of the book uses: the rate of a spring, the energy it stores, and what happens when springs, or a spring and the part it sits on, act together. It introduces the VM-8 machining centre's springs, and its mistake is a lock plunger that lost a sixth of its force because of the bracket it was screwed to.

## Rate and the straight line

A spring's rate, k, is the force needed for each unit of deflection: newtons per millimetre for a spring that moves in a straight line, newton-millimetres per radian or per degree for one that twists. For most metal springs within their working range, the rate is constant, so the force is a straight line through zero:

```figure
type: formula
title: Rate, force and stored energy of a linear spring
formula: F = k x
formula: U = ½ k x² = ½ F x
formula: Torsional: T = kθ θ,  U = ½ kθ θ²
caption: x is the deflection from the spring's free position, measured in the direction of the force. The energy U is the area under the force–deflection line. A spring that is preloaded in its housing already holds energy before it does any work.
- k | rate, N/mm
- kθ | torsional rate, N·mm/rad
- U | energy stored, N·mm (1,000 N·mm = 1 J)
```

Two features of the straight line matter in practice. The first is that the force depends on the deflection from the free position, not from wherever the spring happens to be fitted. A spring that is fitted compressed by 14.7 mm and then compressed a further 12 mm carries the force for 26.7 mm, not 12 mm. Most mistakes with spring forces come from losing track of where zero is.

The second is that the line is only straight between limits. At one end the coils of a compression spring touch, the spring goes solid and the rate becomes enormous. At the other end of the range, the stress reaches the point where the wire takes a permanent set and the spring is shorter, or longer, when unloaded than it was when made. Every spring check in this book is a check that the working range sits safely between those two limits.

Some springs are not linear at all. A disc spring's rate falls as it flattens, which Chapter 7 uses. An extension spring has an initial tension, a force it must reach before its coils start to separate, so its line does not pass through zero. A spring that bears on a curved surface or a lever may give a rate that changes along its travel even if the spring itself is linear. In each case the force–deflection curve, not a single rate, is what the machine sees.

### Energy

The energy stored is the area under the force–deflection line. It matters for two reasons. It is the energy available to do work, such as closing a door or pushing a pin home. And it is the energy that is released if the spring or its retainer is undone carelessly, which is why compressed springs in drawbars and brakes must be released with proper tools.

## The VM-8's springs

The rebuild team started by listing every spring in the machine, what it does and what happens if it fails. That register, with the figures this book works out, is the plan for the rest of the book.

```figure
type: compare
title: The VM-8's spring register
cols: Type | Job | Chapter
rowhead: Spring
- Changer arm lock plunger | Round-wire compression | Pushes a pin into the arm's notch so the arm cannot drift | 2 to 4
- Fixture pressure pads | Square-wire or nested compression | Push the part onto its locators during machining | 5
- Magazine shutter springs | Extension, pair | Pull the shutter closed after each tool change | 6
- Drawbar stack | Disc springs, 72 | Pull the tool holder into the spindle taper | 7
- Top hatch springs | Torsion, pair | Balance a hinged hatch over the machining area | 8
- Rear panel bar | Torsion bar | Balance a heavy service panel that swings down | 9
- Way cover wipers | Flat cantilever strips | Press wiper lips onto the way covers | 9
- Pocket detents | Ball and spring | Hold tool holders in the magazine pockets | 10
- Relief valve spring | Round-wire compression | Sets the hydraulic unit's maximum pressure | 10
- Rotary table brake | Coil springs, 12 | Clamp the rotary table when the brake is not released | 10
caption: This is an illustration. Ten spring jobs on one machine, from a 0.4 mm strip to a stack of 72 discs.
```

The register also records the energy each one holds, because that decides how it must be handled. The lock plunger stores about 1.3 J when retracted, so little that it is only a nuisance if it flies out. The two hatch springs together hold about 24 J when the hatch is shut. The torsion bar holds about 137 J with the rear panel open. The drawbar stack holds about 56 J in its clamped position, released over only a few millimetres, which is enough to injure a hand or throw a part across a workshop.

```figure
type: bars
title: Energy stored in the VM-8's springs, at their highest working deflection
x: Spring
y: Energy, J
caption: This is an illustration. Calculated from the rates and deflections worked out in Chapters 2 to 10. The drawbar stack and the torsion bar hold enough energy to need a written release procedure.
- Lock plunger, retracted | 1.3
- Shutter springs, pair, open | 4.9
- Hatch springs, pair, shut | 24.1
- Rotary table brake springs, 12 | 25.4
- * Drawbar stack, clamped | 56.3
- * Rear panel torsion bar, open | 137.3
```

The shop treats anything over about 10 J as needing a written procedure and a release tool. This is an illustration; the model Code of Practice for managing the risks of plant from Safe Work Australia requires stored energy to be identified and controlled during maintenance, and leaves the threshold to the duty holder's assessment.

## Springs in parallel and in series

Springs that share a load, side by side, are in parallel: they all deflect by the same amount, the forces add, and so do the rates. Springs that pass the same load from one to the next are in series: they all carry the same force, the deflections add, and so do the reciprocals of the rates.

```figure
type: formula
title: Springs in parallel and in series
formula: Parallel: k = k1 + k2 + …,  each carries kᵢ ÷ k of the load
formula: Series: 1 ÷ k = 1 ÷ k1 + 1 ÷ k2 + …,  each deflects F ÷ kᵢ
caption: In parallel the stiffest spring carries the most load. In series the softest spring deflects the most and the combination is softer than any one of them. Parallel springs must start loading together for the rates simply to add.
- k | combined rate
- kᵢ | rate of spring i
```

The [springs in series or parallel tool](/tools/spring-combination/) takes the arrangement, up to four rates and a total load. It returns the equivalent rate and total deflection, and a table of each spring's rate, load and deflection. It assumes linear springs within their working range and, for parallel springs, that they all start to load at the same time; it reminds the user to check each spring against its own limits.

Two of the VM-8's springs show the parallel case. The magazine shutter is pulled closed by two extension springs side by side, each 0.948 N/mm, so together they act as one spring of 1.896 N/mm. The fixture pressure pads in Chapter 5 use a nested pair, an outer spring of 38.24 N/mm and an inner one of 16.84 N/mm compressed together, which act as 55.08 N/mm with the outer spring carrying 69% of the load.

### A support is a spring too

The series case is the one that catches people out, because one of the springs is often not called a spring. A spring pushes against something, and that something deflects. If its deflection under the spring's force is not small compared with the spring's own, the support and the spring act in series and the combination is softer than the spring alone.

## The mistake: the plunger that lost a sixth of its force

During the rebuild the shop fitted a new lock plunger spring, designed in Chapter 3, with a rate of 3.749 N/mm. It is fitted compressed to 50 mm from a free length of 64.7 mm, which should give 55.1 N on the locking pin with the arm parked. The cam that retracts the pin moves it a fixed distance, so the spring's fitted length is set by the positions of the parts around it.

A check with a push–pull gauge on the pin gave only about 46 N. The spring was right: tested on the bench it gave 55 N at 50 mm. The fault was what it sat on. The previous owner had replaced a cracked machined block with a folded steel bracket, 2 mm thick, which the spring's back end pushed against. Loaded at the spring's seat, the bracket deflected 0.05 mm for every newton: a rate of 20 N/mm.

```figure
type: steps
title: The lock plunger spring on its bracket, in the springs in series tool
caption: This is an illustration. Spring 3.749 N/mm in series with the folded bracket at 20 N/mm, under the 55.1 N the pin should carry.
- Equivalent rate | 3.157 N/mm
- Spring deflection under 55.1 N | 14.70 mm
- Bracket deflection under 55.1 N | 2.76 mm
- * Total deflection for 55.1 N | 17.45 mm, 2.76 mm more than the parts allow
```

The tool's figures show what happened. To carry 55.1 N, the spring and bracket together must deflect 17.45 mm. But the parts around them only compress the pair by 14.7 mm, the distance from the spring's free length to its fitted length. At 14.7 mm the combination carries 3.157 × 14.7 = 46.4 N, which is what the gauge found: 16% less than intended, and below the 50 N the changer maker's manual calls for to hold the arm against the shock of a fast index.

A deflection of 2.8 mm at the back of a spring is easy to see once you look for it. The fix was a machined block, with a rate many times the spring's, and a check of the force with the gauge after fitting. The lesson the shop wrote into its rebuild notes is that a spring's force must be measured where it is used, not only on the bench, and that anything a spring pushes against is part of the spring.

```figure
type: bars
title: Lock pin force at the parked position, three supports
x: Support under the spring
y: Force on the pin, N
caption: This is an illustration. Spring 3.749 N/mm compressed 14.7 mm by the surrounding parts. The machined block is taken as 2,000 N/mm. A support needs a rate roughly a hundred times the spring's before its effect is negligible.
- Folded bracket, 20 N/mm | 46.4
- Stiffened bracket, 100 N/mm | 53.1
- * Machined block, 2,000 N/mm | 55.0
- Spring alone, rigid support | 55.1
```

## Where the support matters most

Series flexibility is not always a fault. A soft support can be added on purpose to lower a stiff spring's rate, and Chapter 7 relies on the series arrangement of disc springs to gain travel. But when it is unplanned, its effect depends on the ratio of the two rates. A support twenty times stiffer than the spring takes away about 5% of the force on a fixed compression; one five times stiffer takes away about 17%; a support as stiff as the spring halves it.

The places where unplanned series flexibility hides in machines are predictable: sheet-metal brackets, plastic housings, spring seats on long thin pins, cover plates held by a few small screws, and a stack of shims under a spring. Each of them should be estimated, or the spring's force measured in place.

### When parallel springs do not share

The parallel rule has its own trap. Springs only share a load in proportion to their rates if they start loading together. Two springs of different free lengths fitted side by side, or a set of clamp springs sitting in pockets of slightly different depths, do not: the longer spring carries load alone until the other one is reached. That is why Chapter 10's brake springs are specified to a free-length tolerance and the pocket depths are machined to one, and why the nested springs in Chapter 5 are given the same free length.

## What a spring specification must say

A spring that is specified only by its dimensions can be made to those dimensions and still be wrong, because the force at the working length depends on the wire's modulus, the number of active coils and the coiling. The shop's specification for every spring in the rebuild therefore states:

```figure
type: checklist
title: What the VM-8 rebuild specifies for each spring
caption: The shop's spring specification fields. This is an illustration.
- x Wire material and diameter, or strip thickness, or disc dimensions
- x Coil diameter as inside, outside or mean, stated which
- x Active and total coils, end type and direction of winding where it matters
- x Free length, and the forces at one or two stated working lengths, with tolerances
- x Rate, as a check on the forces
- x Solid length, or largest deflection, and the space the spring works in
- x Finish, stress relief, set removal and shot peening where needed
- x Duty: static, or the number of cycles and the stroke
```

Forces at stated lengths are what the machine needs, and a spring maker can adjust coils to hit them. Dimensions alone leave the force to chance.

## Measuring a spring

Every spring that came out of the VM-8 was measured before anything was ordered: free length on a surface plate, wire and coil diameters with a micrometer and calliper, coils counted, and the force at one or two lengths on a spring tester. A spring whose free length is short compared with its drawing or its partner has taken a set, either by being stressed past its elastic limit or by relaxing in service, and it is replaced whatever its force reads today.

The old lock plunger spring measured 60.5 mm free against 62 mm on the maker's parts list: 1.5 mm of set. Chapter 4 shows why.

### Reading a rate from a tester

A spring tester gives force at a length, and two readings give a rate. The shop takes them in the middle of the working range, not near the free length, where the end coils are still seating and the line is not yet straight, and not near solid, where coils start to touch one by one and the rate climbs. For the old plunger spring, readings of 50.8 N at 50 mm and 108.9 N at 38 mm give (108.9 − 50.8) ÷ (50 − 38) = 4.84 N/mm, the same as the rate calculated from its dimensions in Chapter 2. The set shortened the spring by 1.5 mm and cost it 7.3 N at every length, but it did not change the rate; a force reading at one length would have shown the loss, and a rate alone would have hidden it. When a measured rate and a calculated one disagree by more than a few per cent, the usual causes are a miscounted coil, a coil diameter taken as outside instead of mean, or a wire of a different material from the one assumed.

Rates in N/mm and stored energies in joules need care with units. A rate of 3.749 N/mm is 3,749 N/m; the energy ½ k x² with k in N/mm and x in mm comes out in N·mm, and a thousand of those make one joule.

## Exercise: the shutter springs on a flexible pivot

The magazine shutter's two extension springs, each 0.948 N/mm, hang from a single pressed-steel tab that deflects 0.02 mm per newton of total load. The springs are stretched together through 50 mm of travel by the shutter, measured at the shutter end. What is the combined rate, and how much less is the change in pull over that travel than it would be with a rigid tab?

### Worked answer

The two springs are in parallel: 0.948 + 0.948 = 1.896 N/mm. The tab carries their total load, so it is in series with the pair. Its rate is 1 ÷ 0.02 = 50 N/mm.

The combined rate is 1 ÷ (1 ÷ 1.896 + 1 ÷ 50) = 1 ÷ (0.5274 + 0.0200) = 1.827 N/mm.

Over 50 mm of travel, the change in pull is 1.896 × 50 = 94.8 N with a rigid tab, and 1.827 × 50 = 91.3 N with the flexible one: 3.5 N, or 3.7%, less. The tab is fifty times stiffer than one spring and about twenty-six times stiffer than the pair, so its effect is small. Entered in the springs in series tool as two rates in series, 1.896 and 50 N/mm, with a total load of 94.8 N, it gives an equivalent rate of 1.827 N/mm and a total deflection of 51.9 mm, of which the tab takes 1.9 mm.
