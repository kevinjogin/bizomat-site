---
book: welding-automation-by-the-numbers
chapterSlug: fixtures-positioners-and-fit-up
order: 4
title: "Fixtures, positioners and fit-up"
description: "Find how closely a robot needs the joint to be where its program expects, stack up the tolerances of cut, bent and fixtured parts, price fixtures per part, and use positioners to put every weld flat."
draft: false
---

A robot welds where it was told the joint would be. If the joint is there, within a small tolerance, the weld is right; if it is not, the robot welds the air beside it, or the edge of one plate, and makes a defect with perfect consistency. The parts and the fixtures that hold them therefore decide whether automated welding works. The fabricator's ability to cut, bend and fit parts consistently, and to hold them in the same place every time, matters more to a robot cell's success than the robot itself. Positioners, which turn the parts so that each weld is made in the easiest position, matter almost as much.

This chapter works out how closely a joint must be located for a robot to weld it without sensing, stacks up the tolerances of the parts and fixture that decide where the joint really is, prices fixtures per part, and describes the positioners and cell layouts that keep the arc burning.

## How close is close enough

A robot's torch aims at a point on the joint. For a fillet weld made with 1.2 mm wire, the aim can be a little off without harm, because the arc and pool are wider than the wire, but not much. A common working rule is that the joint must lie within about half a wire diameter to one wire diameter of where the program expects it, across the joint, and within a similar distance in the torch's direction, so that the stick-out stays near its set value. For 1.2 mm wire that is roughly half a millimetre to a little over a millimetre. Gaps between the parts must also stay within what the weld can bridge at its programmed parameters, often about half to one wire diameter for a fillet without weaving.

Those are tight tolerances for fabricated steel. Plasma-cut and bent parts commonly vary by more than a millimetre, and a welded frame distorts as it is welded. Getting the joint within a millimetre of its programmed position, every time, is the job of the parts and the fixture together.

## Stacking the tolerances

Where the joint actually is depends on several things: the accuracy of the cut edge, the angle and position of any bend, how accurately the fixture locates the part, and how far the part moves under clamping and heat. Each adds an error.

```figure
type: formula
title: Stacking the errors that place a bracket's joint
formula: likely error ≈ √(sum of squares of the independent errors); worst case = sum of the errors
caption: This is an illustration for a bent bracket welded to a plate. The root-sum-square estimate assumes the errors are independent and random; systematic errors, such as a wrongly set bending stop, add directly.
- Cut edge position | ±0.3 mm
- Bend angle ±1° over a 35 mm flange | about ±0.6 mm
- Fixture locating | ±0.4 mm
- Movement under clamping and heat | ±0.2 mm
step: worst case = 0.3 + 0.6 + 0.4 + 0.2 = 1.5 mm
step: likely error = √(0.3² + 0.6² + 0.4² + 0.2²) ≈ 0.8 mm
step: the bend angle is the largest term; tightening it helps more than a better fixture
```

The stack-up shows where to spend effort. In this illustration the bend angle contributes the largest error, because a degree of angle over a 35 mm flange moves the flange's edge by about 0.6 mm. Improving the press brake's angle control, or locating the bracket in the fixture by the flange itself rather than by its base, would do more than a more accurate fixture. Fixtures That Repeat covers locating and the separation of fixture repeatability from part variation in depth.

## Designing parts for the robot

Parts made for manual welding often have features that suit a person and trouble a robot: joints reached only from awkward angles, gaps left for a welder to fill, edges cut roughly because the welder would grind them. Designing for robotic welding means joints the torch can reach from a comfortable angle without hitting the part or the fixture, consistent gaps, self-locating features such as tabs and slots that put parts in the right place, and a welding sequence that the robot can follow without repositioning the part too often. A slot-and-tab bracket that locates itself to within a few tenths of a millimetre needs a much simpler fixture than one that relies entirely on clamps.

## Fixtures for welding

A welding fixture locates the parts, clamps them while they are tacked or welded, and must survive the heat, spatter and fume of welding for years. It must also leave room for the torch.

```figure
type: checklist
title: What the fabricator checks in a robotic welding fixture design
caption: This is an illustration of the fabricator's checklist, built from its first fixtures. Fixtures That Repeat sets out the principles behind it.
- x Locating | each part located by datums that control the joint's position, not by convenience
- x Clamping | clamps hold parts to their locators without bending them; quick to operate
- x Torch access | every joint reachable at the programmed angles without collision
- x Heat and spatter | locators and clamps protected or replaceable; spatter shields where needed
- x Earthing | a reliable welding return path through the fixture to the part
- x Loading | parts can only go in the right way round; loading time measured
- *? Distortion | allowance or restraint for the part's movement during welding
```

The earthing, or welding return, deserves special mention. A robot's current returns through the part and fixture to the power source, and a poor or variable return path makes the arc unstable and can damage bearings and locators by arcing through them. Fixtures are designed with a dedicated, heavy return connection close to the welds.

## Fixture cost per part

Fixtures cost money to design and build, and every part number on a robot needs one, or a shared fixture with changeable locators. The cost is spread over the parts the fixture makes in its life.

```figure
type: formula
title: Fixture cost per bracket
formula: cost per part = (fixture cost + upkeep over its life) ÷ parts made in its life
caption: This is an illustration for a bracket made in batches totalling about 1,200 a year, with a fixture costing about A$6,500 to design and build and about A$400 a year in replaced locators and clamps, over a three-year life. Prices exclude GST.
- Fixture | about A$6,500
- Upkeep | about A$400 a year
- Parts | 1,200 a year for 3 years, 3,600 in all
step: cost per part = (6,500 + 3 × 400) ÷ 3,600 ≈ A$2.14
step: if the bracket sold only 300 a year, cost per part ≈ (6,500 + 1,200) ÷ 900 ≈ A$8.56
step: low-volume parts may need modular or shared fixtures to pay
```

For high-volume parts, the fixture adds a little to each part's cost and pays for itself easily. For low-volume parts it can add more than the welding saves. The running case's sixty bracket part numbers ranged from about 100 to 4,000 a year, so the fabricator's plan used dedicated fixtures for the twenty highest-volume parts and a modular fixture table, with interchangeable locators on a drilled grid, for the rest.

## Positioners

A positioner turns or tilts the part so that each weld is presented in the flat or horizontal position, where it can be made fastest and best. Simple positioners turn the part about one axis, like a lathe; two-axis positioners tilt and turn; large ones carry frames weighing tonnes. In a robot cell, the positioner is often controlled by the robot, moving in coordination with the arm so that the torch stays at the best angle as the weld goes round a corner or along a curve.

```figure
type: compare
title: Positioners and their uses
cols: How it moves | Suits
caption: General description for teaching. Load capacity, the offset of the part's centre of gravity and the speed of movement decide which positioner suits a part.
- Turntable | rotates about a vertical axis | small parts; two-station cells
- Headstock and tailstock | rotates about a horizontal axis | long frames, shafts, chassis rails
- *Tilting and rotating, two-axis | tilts and turns | complex frames needing every joint flat
- Ferris wheel or indexing | swaps two fixtures between the operator and the robot | high-volume parts; loading while welding
- Pipe rollers | turn round parts under a fixed torch | pipe, tanks, cylinders
```

Positioners help manual welders too. A welder working on a heavy frame on a positioner welds almost everything flat instead of reaching overhead, which raises the travel speed, lowers over-welding and repairs, and spares the welder's back and shoulders. For the running case's implement frames, which were too varied for a robot, positioners were the first and largest step.

## Two stations and loading

A robot welds only while a part is in front of it. If the operator must unload and reload the fixture while the robot waits, the robot's arc-on time is limited by the loading time. A two-station cell, with two fixtures, lets the operator load one while the robot welds the other, so the robot's time is limited only by its own welding and moving, as long as loading takes less time than welding. The balance between welding time and loading time is the most important number in a cell's layout: if loading is slower than welding, the robot waits; if much faster, the operator waits, and may tend a second cell.

## Mechanised carriages and their tracks

For long straight seams, the fixture's job is different. A tractor carriage running on the plate, or a carriage on a rail clamped alongside the seam, carries the torch at a set speed and a set distance from a guide. The seam must run straight and parallel to the guide within the same sort of tolerance a robot needs, or the torch drifts off the joint along the length. Carriages with a guide wheel or a mechanical finger that follows the joint's edge absorb some of the wander; others need the seam set out straight before welding. On the running case's chassis rails, the flanges and webs were clamped in a long jig that held the joint straight within about a millimetre over six metres, and the carriage ran on the jig's rail, so the weld stayed on the joint from end to end.

## Measuring loading time

The loading time of a fixture is as important to a cell's output as the robot's welding time, and it is easy to underestimate. Loading includes taking the welded part out, cleaning spatter from the locators, placing each component, closing each clamp, checking that everything is seated, and pressing the start button, all with gloves on and often with parts that are hot from the previous cycle. The fabricator timed its operators loading trial fixtures and found loading took about 40% longer than the fixture designer had estimated, mostly in placing small parts and checking them. It changed several fixtures to use quick-acting toggle clamps, added chamfered lead-ins to the locators so that parts dropped into place, and made each part fit only one way. Loading time fell by about a third, which on a two-station cell meant the robot no longer waited for the operator.

## Cleaning and spatter

Spatter collects on fixtures, locators and the torch nozzle with every weld, and an automated cell makes many welds. Spatter on a locator moves the next part out of position by its thickness; spatter in the nozzle disturbs the gas shield and eventually bridges to the contact tip. Cells include a torch cleaning station, which reams the nozzle and sprays anti-spatter at set intervals, and fixtures are cleaned at each load or shift, with locators shielded or made of materials spatter does not stick to.

## Tacking

Many automated welds are made on parts that have already been tacked together, by hand or by the robot. Hand tacking in a separate fixture lets the robot weld assemblies without needing a fixture that holds every piece, and lets the tacker check the fit; but hand tacks vary in size and position, and a robot welding over a large tack makes a lump. Tacking by the robot in the welding fixture keeps everything consistent but uses robot time. The fabricator chose hand tacking in simple jigs for its larger brackets, with a rule that tacks be small and placed away from weld starts, and robot tacking for the small ones.

## Distortion in the fixture

Welding heat moves the parts as the robot works round them. A fixture that restrains the part tightly resists the movement but locks in stress, and the part springs when unclamped; a fixture that lets the part move must allow for the movement in the program, or the later welds miss their joints. With robotic consistency, distortion becomes predictable, so it can be allowed for: by presetting parts in the fixture so that they distort into position, by choosing the welding sequence to balance shrinkage, and by checking the first parts carefully. Welding Distortion by the Numbers covers the methods.

## The running case: the bracket fixtures

This is an illustration. Before buying the robot, the fabricator measured a sample of 50 brackets of each of its five highest-volume part numbers. Their cut edges were within about ±0.3 mm, but bend angles varied by up to ±1.5° on one press brake, enough to put the flange edge more than a millimetre out on some parts. The fabricator replaced the press brake's back gauge and added angle measurement, which brought bends within about ±0.5°, and redesigned three brackets with tabs and slots. The tolerance stack for the joint fell to under 0.6 mm on the likely estimate, comfortably inside what the trials showed the robot could weld without sensing.

## A failure: the floating locator

This is an illustration. A fixture's locating pin, worn by months of loading, developed play of about a millimetre. The robot's welds on that part began to drift towards one plate, leaving the other fused at the toe only. Nobody noticed until a customer's inspection found undersized welds on a batch.

The fabricator now inspects locators on a schedule, with a go and no-go gauge for each pin, replaces them by count of parts, and checks the first part of each batch with a weld gauge at marked points. Fixtures That Repeat covers wear and return to service.

## Exercise: tolerance and the bend

A bracket's joint position depends on a cut edge at ±0.25 mm, a fixture locator at ±0.3 mm, movement during welding at ±0.2 mm, and a bend angle of ±1° over a 50 mm flange. Estimate the bend's contribution and the likely total error by root-sum-square. If the robot needs the joint within ±0.8 mm, what bend tolerance would bring the likely error within it?

A degree over 50 mm moves the edge by about 50 × tan 1° ≈ **0.87 mm**. The likely total is √(0.25² + 0.3² + 0.2² + 0.87²) ≈ √(0.0625 + 0.09 + 0.04 + 0.757) ≈ √0.95 ≈ **0.97 mm**, outside the ±0.8 mm the robot needs.

The other three terms give 0.0625 + 0.09 + 0.04 ≈ 0.19, so the bend may contribute at most √(0.64 − 0.19) ≈ √0.45 ≈ 0.67 mm, which over 50 mm is an angle of about tan⁻¹(0.67 ÷ 50) ≈ **0.77°**. Holding bends within about ±0.75° would bring the likely error within the robot's tolerance; locating the part by the flange instead of its base would remove the bend from the stack altogether.
