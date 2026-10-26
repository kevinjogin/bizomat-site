---
book: power-presses-by-the-numbers
chapterSlug: screw-presses-and-drop-hammers
order: 2
title: "Screw presses, fly presses and drop hammers"
description: "Energy machines and the principle of work: Hodgson's copying press and fly press restated in SI, force against stopping distance, drop hammers, and a slip in a 1903 worked example."
draft: false
---

The oldest power presses do not push with a fixed force at all. A fly press stores energy in a pair of heavy balls swung on a lever; a drop hammer stores it in a raised weight. When the tool meets the work, the stored energy is spent pushing through it, and the force at the tool is whatever the work resists with, until the energy runs out. That makes these machines simple, cheap and capable of very large forces for their size, and it makes their force impossible to state without knowing how the work stops them. Understanding them is the clearest way to see the difference between force and energy, which every press in this book has to deal with.

This chapter restates Hodgson's 1903 examples of the copying press and the fly press in SI, shows how an energy machine's force depends on its stopping distance, works through a drop hammer, and finds a slip in one of the original worked examples.

## The principle of work

Hodgson built his chapter on the power of presses and stamps on one idea, the principle of work: in any machine, ignoring friction, the work put in equals the work got out. Work is force times the distance through which it acts. A machine that moves its output a short distance for a long movement at its input multiplies force by the ratio of the two distances; a machine that stores energy in a moving mass and then stops that mass in a short distance produces a force equal to the energy divided by the stopping distance.

For a moving mass, the energy is:

- in a mass m moving at speed v: E = ½ × m × v²;
- in a body of moment of inertia I spinning at angular speed ω: E = ½ × I × ω²;
- in a mass m raised through a height h: E = m × g × h, with g = 9.81 m/s².

If that energy is spent pushing a tool through a distance y against a resistance, the **mean** resistance overcome is R = E ÷ y. The peak may be higher, because the resistance is rarely constant, but the mean is set by the energy and the distance alone.

```figure
type: formula
title: Mean force from stored energy and stopping distance
formula: R = E ÷ y
caption: The principle of work for an energy machine. With E in joules and y in millimetres, R is in kilonewtons. The peak force is higher than the mean when the resistance is not uniform.
- E | Energy stored in the moving mass, J
- y | Distance through which the tool does work before the mass stops, mm
- R | Mean resistance overcome, kN
step: For E = 505 J and y = 2.12 mm: R = 505 ÷ 2.12 = 238 kN
```

## The copying press

Hodgson's first example is a letter-copying press, a screw press worked by a two-handed lever, which is the simplest case: no stored energy, just a screw. A push P at each end of a lever of radius r moves its hands through 2πr per revolution, and the screw of pitch p moves the slab through p. By the principle of work, the force at the slab is:

W = 2 × P × 2πr ÷ p

His figures were a 16 inch lever, so r = 8 inches, a push of 20 lb at each end and a screw of ¼ inch pitch, giving 8,042 lb. In SI, with r = 203.2 mm, P = 89.0 N and p = 6.35 mm:

W = 2 × 89.0 × 2π × 203.2 ÷ 6.35 = **35.8 kN**

That is the force with no friction. A real square-threaded screw loses much of the input in friction, and the true force would be a fraction of that figure. The copying press is a force machine with a mechanical advantage, and its force lasts as long as the operator keeps pushing.

## The fly press

A fly press looks like a copying press with a quick screw and a single handle, but it works differently. Its lever carries two heavy balls. The operator swings the lever hard, the balls gain speed, and when the punch meets the work, the balls' energy drives the punch through it. The steep screw lets the operator raise and lower the punch with a small movement, and keeps the balls' speed high.

Hodgson showed why the balls are essential. With a 50 lb pull at a handle on a 15 inch radius and a 2 inch pitch screw, the static force at the punch is only 2,356 lb, about **10.5 kN**. Punching a 1 inch hole in a ⅛ inch steel plate needed, by his punching formula, about 23,486 lb, about **104.5 kN**, ten times as much. Pushing could never do it.

The balls change the calculation. In his example, two 30 lb balls on a lever 3 feet between their centres move at 20 feet per second at the moment of impact. Restated in SI:

- mass of the two balls: m = 60 lb = **27.2 kg**;
- speed: v = 20 ft/s = **6.10 m/s**;
- energy: E = ½ × 27.2 × 6.10² = **506 J**.

The same answer comes from treating the balls as a flywheel: each is 0.457 m from the screw's axis, so I = 27.2 × 0.457² = 5.69 kg·m², ω = 6.10 ÷ 0.457 = 13.3 rad/s, and ½ × I × ω² = 506 J.

If the punch is brought to rest in 1/12 inch, **2.12 mm**, the mean resistance it overcomes is 506 ÷ 2.12 = about **239 kN**, more than twice the 104.5 kN the punching needed. Hodgson concluded that the balls made available more than double the energy the job required. He worked in foot-pounds and had 372.67 ft·lbf and 53,665 lb; those are 505.3 J and 238.7 kN, the small difference from the SI figures coming from his use of 32.2 ft/s² for gravity.

```figure
type: compare
title: Hodgson's fly press example in his units and in SI
rowhead: Quantity
cols: Hodgson, 1903 | SI | Check
caption: The SI column is recalculated from his inputs. The energies agree to within 0.1%; the difference is his rounded value of g.
- Mass of the two balls | 60 lb | 27.2 kg | 60 × 0.4536
- Speed at impact | 20 ft/s | 6.10 m/s | 20 × 0.3048
- * Energy stored | 372.67 ft·lbf | 505.3 J (506 J from ½mv²) | 372.67 × 1.3558
- Stopping distance | 1/12 in | 2.12 mm | 25.4 ÷ 12
- Mean resistance | 53,665 lb | 238.7 kN | 53,665 × 4.448 N
```

## Force depends on how the work stops

The most important consequence of R = E ÷ y is that an energy machine has no fixed force. The same 505 J spent over different distances gives very different forces:

- over 10 mm: **50.5 kN**;
- over 2 mm: **253 kN**;
- over 1 mm: **505 kN**;
- over 0.1 mm: **5,053 kN**.

When the work is soft or long, such as bending a thin strip, the force is modest. When the work is hard and short, such as coining a stamped face, or when there is no work at all and the dies meet each other, the stopping distance is only the elastic give of the dies and frame, a fraction of a millimetre, and the force becomes enormous. That is how a hand-swung fly press can coin metal, and how it can crack a die or a frame if the dies are allowed to meet with nothing between them.

Setting an energy machine is therefore about energy, not force. The operator of a fly press controls the swing; a modern screw press, driven by a friction disc or a servo motor, controls the flywheel's speed and so the energy of each blow. The setting is found by trial, starting low, and the die is designed with stops or with enough strength to survive a blow on itself.

```figure
type: bars
title: Mean force from 505 J at different stopping distances
unit: kN
max: 5100
caption: This is an illustration of R = E ÷ y. The same blow that bends a strip gently can produce thousands of kilonewtons if the dies meet with only their own elastic give to stop them.
- Over 10 mm | 50.5
- Over 2 mm | 252.7
- Over 1 mm | 505.3
- Over 0.5 mm | 1010.6
- * Over 0.1 mm, dies meeting | 5053.0
```

## Modern screw presses

The screw press did not disappear with the hand-swung fly press. Modern screw presses, driven by friction discs, by direct electric drives or by servo motors, are widely used for hot forging, coining and some precision forming, because they deliver a controlled amount of energy in each blow and are not bound to a fixed bottom position as a crank press is.

Their setting follows directly from E = ½ × I × ω². The flywheel's speed at impact sets the energy, so the energy can be set by the speed:

- running the flywheel at **71%** of its full speed gives 0.71² = **50%** of its full energy;
- running it at 50% gives 25%.

A screw press's energy is therefore adjustable from blow to blow, and the right setting is the lowest that does the work, found by trial. Too little energy leaves the work unfinished, and a second blow is needed; too much puts the surplus into the dies and the frame, which, as the next section shows, is where large forces come from. The press's rated force, which screw press makers do state, is the force the frame is designed to take when the full energy is absorbed over a short distance, and a blow with no work between the dies can exceed it.

## Drop hammers and stamps

A drop hammer, or stamp, stores energy in a raised weight, the tup, which falls onto the work. Hodgson valued it for its simplicity and cheapness as a store of energy for raising, stamping and forging.

This is an illustration. A tup of 200 kg raised 1.0 m above the work stores:

E = 200 × 9.81 × 1.0 = **1,962 J**

and strikes at a speed of √(2 × 9.81 × 1.0) = **4.43 m/s**. Spent over 2.0 mm of work, that is a mean force of about 981 kN; over 5.0 mm, about 392 kN. As with the fly press, the force is set by how the work stops the tup, and the operator, or a modern hammer's control, sets the energy by the height of the drop.

Drop hammers and stamps are still used for forging and for some sheet metal raising, though their noise, vibration and impact on foundations have pushed most sheet metal work to presses. Hodgson's chapter on stamping also discusses accidents to stamp operators, which were common in his time; the guarding of such machines today falls under the same Australian law and standards as other presses (Chapter 9).

## What this means for modern presses

Energy machines make the distinction between force and energy obvious, and the distinction carries over to every other press.

- A **crank press** has a fixed path and a rated force, but it gets its energy from a flywheel, just like a fly press. A job can be within its force and beyond its energy, and the flywheel then slows down too far. Chapter 4 calculates that.
- A crank press that meets a hard stop, such as a double blank or the dies closing on a slug, behaves like an energy machine meeting a short stopping distance: the flywheel's energy produces a force far beyond the press's rating, which is what overload protection is for.
- A **hydraulic press** is the opposite: its force is limited by pressure, and it will stall rather than exceed it, whatever the stopping distance.

For MP-40, a fly press could in principle supply the 321 J each stroke needs, since a well-swung fly press stores more than that, but it would be hand-fed, slow and hard to guard; nobody would run 60,000 plates a year that way. The point of the comparison is the principle, not the machine.

## The error: a slip in a worked example

Hodgson's fly press example states the conditions as two 30 lb balls with "a velocity of 30 ft. per second at the moment of impact". Its arithmetic then computes the energy as 30 × 2 × 20 × 20 ÷ (2 × 32.2) = 372.67 ft·lbf, using a speed of **20** feet per second, not 30. His later comparison with the copying press refers back to the example as having assumed 20 ft per second, so 20 is the figure he worked with, and the 30 in the statement is a slip.

The slip is not trivial. Energy goes as speed squared, so at 30 ft/s the balls would store (30 ÷ 20)² = 2.25 times as much, 838.5 ft·lbf or **1,137 J**, and the mean resistance over 1/12 inch would be about **537 kN**, not 239 kN. A reader who took the statement at its word and checked only the final answer would conclude that the example was wrong by a factor of 2.25, or would carry the wrong figure into a calculation of their own.

It was found here the way the companion book recommends finding errors in any calculation: by re-running every step with the stated inputs, in a second system of units, and comparing each intermediate result, not just the final one. The lesson is general. A worked example's inputs and its arithmetic must agree, and the place to check that is the line where the inputs first enter the formula.

```figure
type: checklist
title: Checks on any energy calculation for a press or hammer
caption: The last line is the slip in the 1903 example; the checks above it are the ones that find such slips.
- Inputs restated in one consistent unit system | kg, m/s, m, J
- Energy recalculated by a second route | ½mv² and ½Iω² agree at 506 J
- Stopping distance stated and justified | 2.12 mm of punch travel
- Force reported as a mean, with the peak noted as higher | 239 kN mean
- Die and frame checked for a blow with nothing between the dies | force set only by elastic give
- x Stated speed and computed speed differ | 30 ft/s stated, 20 ft/s used
```

## Exercise: a smaller drop hammer

A drop hammer has a 150 kg tup that falls 0.8 m. Find its energy and striking speed, and the mean force if the work stops it in 2.0 mm. Then find the mean force if the dies are allowed to meet with only 0.2 mm of elastic give between them.

**Worked answer.**

- Energy: 150 × 9.81 × 0.8 = **1,177 J**.
- Striking speed: √(2 × 9.81 × 0.8) = **3.96 m/s**.
- Mean force over 2.0 mm: 1,177 ÷ 2.0 = **589 kN**.
- Mean force over 0.2 mm: 1,177 ÷ 0.2 = **5,886 kN**.

Ten times less stopping distance gives ten times the force. That is why energy machines are set by trial from a low drop height, and why their dies are designed either to stop the tup on hardened stops sized for the blow or to be strong enough to survive meeting each other.
