---
book: power-presses-by-the-numbers
chapterSlug: the-crank-press-force-curve
order: 3
title: "The crank press and its force curve"
description: "Why a crank press loses force with height above the bottom of the stroke, the rating point, Press 4's curve from 400 kN at 3 mm to 184 kN at 25 mm, and a pad it could not carry."
draft: false
---

A mechanical crank press is rated at a single force, but it cannot deliver that force everywhere in its stroke. Near the bottom, the crank is nearly in line with the connecting rod, and a modest torque on the crankshaft produces an enormous push at the ram. Higher up, the crank is turned well away from the line of the stroke, and the same torque produces a much smaller push. The force a crank press can deliver is a curve, falling steeply from the bottom of the stroke upward, and every job that does work more than a few millimetres above the bottom has to be checked against it.

This chapter explains where the curve comes from, defines the rating point, calculates Press 4's curve from its crank and connecting rod, checks MP-40 and AB-75 against it, and ends with a pressure pad added to AB-75's die that the curve could not carry.

## How a crank turns torque into force

A crank press's flywheel drives the crankshaft through a clutch and, on geared presses, a gear train. The crankshaft turns a crank, or an eccentric, of radius r, which moves the ram up and down through a connecting rod of length l. The ram's stroke is twice the crank radius.

Measuring the crank's angle θ from bottom dead centre, the ram's height above the bottom of its stroke is:

h = r × (1 − cos θ) + l × (1 − √(1 − (r ÷ l)² × sin² θ))

The first term is the crank's own contribution; the second is a small correction for the connecting rod's angle. Differentiating, the rate at which the ram rises as the crank turns is dh/dθ, which is zero at the bottom and largest near the middle of the stroke.

The drive can apply a limited **torque** T to the crankshaft. That limit is set by the gears, the clutch and the crankshaft itself. By the principle of work from Chapter 2, the torque times the crank's small rotation equals the ram's force times its small movement:

F × dh = T × dθ, so F = T ÷ (dh/dθ)

Near the bottom, dh/dθ is tiny and the force for a given torque is huge; the press's frame, connecting rod and bearings then set the limit instead. Higher up, dh/dθ grows and the force available falls.

## The rating point

A crank press's rated force applies at a stated height above the bottom of the stroke, its **rating point**. Below that height, the press may deliver its rated force, limited by the frame and connecting rod; above it, the force available falls, limited by the drive's torque. The rating point is usually a few millimetres, and varies by maker, press type and market; a press rated at 400 kN at 3 mm and one rated at 400 kN at 6 mm are not the same press. The rating point is the number to ask for when a specification gives only a force.

Press 4's candidate is rated at **400 kN at 3 mm** above the bottom. With r = 30 mm and l = 250 mm, 3 mm above the bottom is reached at a crank angle of **24.5°**, where dh/dθ is 13.78 mm per radian. So the drive's torque limit at the crankshaft is:

T = 400 kN × 13.78 mm = **5.51 kN·m**

and the force available at any other height is 5.51 kN·m divided by dh/dθ at that height, but never more than 400 kN.

```figure
type: formula
title: Force available from a crank press above its rating point
formula: F(h) = F_rated × (dh/dθ at the rating point) ÷ (dh/dθ at h)
caption: This is an illustration for Press 4's candidate: 400 kN at 3 mm, crank radius 30 mm, connecting rod 250 mm. Below the rating point, the force is capped at the rated 400 kN by the frame and connecting rod.
- F_rated | 400 kN at the rating point
- dh/dθ at 3 mm | 13.78 mm per radian, at a crank angle of 24.5°
- dh/dθ at 25 mm | 30.04 mm per radian, at a crank angle of 77.1°
step: Torque limit: 400 kN × 13.78 mm = 5.51 kN·m
step: At 25 mm: 400 × 13.78 ÷ 30.04 = 183.5 kN
```

## Press 4's force curve

Calculating the force available at several heights gives the press's force curve, often called its tonnage curve:

- at 3 mm and below: **400 kN**, the rating;
- at 5 mm: **316 kN**;
- at 10 mm: **237 kN**;
- at 15 mm: **205 kN**;
- at 20 mm: **190 kN**;
- at 25 mm: **184 kN**;
- at 30 mm, half the stroke: **183 kN**.

The force falls by more than half in the first 25 mm above the rating point and then flattens, because dh/dθ is near its largest around the middle of the stroke. A simpler formula that ignores the connecting rod's angle, F = F_rated × sin θ_rating ÷ sin θ, gives similar numbers, 177 kN at 25 mm against 184 kN, and is good enough for a first check. Press makers publish the curve for their presses, and it should be asked for; the BIZOMAT [crank press capacity calculator](/tools/crank-press-capacity/) works it out from the crank's dimensions and the rating.

The curve applies on the **downstroke**. On the upstroke the ram is moving away from the work, and a die that does work on the way up, such as a stripper or a knockout, takes its force from the drive in the other direction.

```figure
type: line
title: Press 4's force curve against AB-75's forming force
x: Height above the bottom of the stroke, mm
y: Force, kN
ymin: 0
ymax: 420
legend: Force available from the press | AB-75's forming force
mark: 3 | Rating point
caption: This is an illustration. The press's curve is calculated from its crank and connecting rod; AB-75's force is from the die maker's trial. At every height the forming force is well under the curve.
- 0 | 400.0 | 180
- 1 | 400.0 | 120
- 2 | 400.0 | 80
- 3 | 400.0 | 75
- 5 | 316.4 | 65
- 10 | 236.5 | 62
- 15 | 205.2 | 60
- 20 | 190.2 | 55
- 25 | 183.5 | 0
```

## Checking MP-40

MP-40's die does all its work in the last 4 mm of the stroke. The stripper meets the strip at 4 mm above the bottom with its springs preloaded to 16.5 kN; the punches meet the strip at 3 mm and cut through it in the next 2 mm; at the bottom the load reaches 221.3 kN. The press's curve gives 350 kN at 4 mm and 400 kN from 3 mm down. Every point of MP-40's load is well inside the curve, with the peak at 55% of the rating.

That is the typical result for blanking: dies that cut thin sheet do their work so close to the bottom that the force curve hardly matters, and the rated force is the right comparison. The force curve matters for dies that work higher up: forming, drawing, and dies with long pressure pads.

## Checking AB-75

AB-75's wiping die starts to form the bracket 25 mm above the bottom. The die maker's trial on a hydraulic test press, where the force could be measured at every height, gave, as an illustration:

- at 25 mm: first contact, close to zero;
- at 20 mm: 55 kN, as the leg begins to bend over the die radius;
- at 15, 10 and 5 mm: 60, 62 and 65 kN, wiping the leg down;
- at 2 and 1 mm: 80 and 120 kN, as the bend closes;
- at the bottom: 180 kN, as the die sets the bend to reduce springback.

Against the curve, the forming force is at its closest at 20 mm, where 55 kN is 29% of the 190 kN available, and at the bottom, where 180 kN is 45% of 400 kN. AB-75 passes on force at every height. Chapter 4 finds that its energy, not its force, is the number to watch.

## Bottoming and the last millimetre

AB-75's force rises from 65 kN at 5 mm to 180 kN at the bottom, most of it in the last millimetre, where the die closes on the bend and sets it. A die that **bottoms**, closing fully on the part, makes its peak force depend very sharply on the shut height: a fraction of a millimetre lower, and the die squeezes the bend harder; a fraction higher, and it does not set the bend at all, and the bracket springs back further.

Near the bottom of a crank press's stroke, the ram barely moves while the crank turns, so the press can push very hard there, and it will push as hard as the shut height requires, up to its frame's limit. If AB-75's shut height were set 0.2 mm too low, the die would try to compress the 3.0 mm sheet by 0.2 mm across the whole bend, and the force could rise far beyond 180 kN. That is why bottoming dies are set by the force, read on the tonnage monitor, rather than by the shut height dial: the setter brings the shut height down in small steps until the monitor reads the force that gives the right angle, here about 180 kN, and locks the adjustment there.

The force curve does not protect against this, because it is not a torque problem: near the bottom the drive needs little torque for a large force. Only the press's frame rating, its overload protection and the setter's care stand between a bottoming die and an overloaded press.

## Why the overload protection does not help above the rating point

Many mechanical presses have **overload protection**: a hydraulic cushion in the ram, or a shear plate in the connecting rod, that gives way if the force exceeds a set value, usually around the rated force. It protects the frame and connecting rod from a double blank or a slug near the bottom of the stroke.

It does not protect the drive above the rating point. At 20 mm, Press 4 can safely deliver only 190 kN; a die that demanded 250 kN there would over-torque the gears and clutch, but 250 kN is well under the 400 kN at which the ram's overload would trip. The force curve is a limit on torque, and only a torque limit, a slipping clutch, or a tonnage monitor that knows the curve, protects against exceeding it. Many tonnage monitors can be set with an envelope that follows the curve, which is worth doing on a press that runs forming dies.

## Other mechanisms

Not every mechanical press uses a simple crank.

- **Eccentric presses** use an eccentric on the shaft in place of a crank; the motion and force curve are the same in principle.
- **Knuckle-joint presses** drive the ram through a toggle that straightens at the bottom of the stroke. They give a very high force over a very short distance near the bottom and are used for coining, sizing and embossing.
- **Link-drive presses** use a linkage that slows the ram near the bottom while keeping the overall cycle fast. They give a slower, more controlled forming speed and a force curve that stays high further up the stroke.

Each has its own curve, and the maker's curve is the one that counts.

## The error: a pressure pad the curve could not carry

This is an illustration. After the first trials, AB-75's die maker proposed adding a pressure pad on nitrogen gas springs to hold the blank flat while the leg was wiped, set to **150 kN** and engaging at **30 mm** above the bottom of the stroke. The pad's force would be nearly constant over its travel, as a gas spring's is, and would add to the forming force at every height below 30 mm.

The proposal was tried first on the shop's older 400 kN press, which has a similar curve. At about 20 mm above the bottom, the press slowed sharply, the clutch slipped, and the ram stopped short of the bottom with the die partly closed. It had to be freed by reversing the drive on inching.

The force curve explains it. With the pad, the die needed 150 + 55 = **205 kN** at 20 mm, where the press could deliver only 190 kN, and 150 + 60 = **210 kN** at 15 mm, where it could deliver 205 kN. Both were within the press's 400 kN rating and far below the overload's trip point, which is why nothing tripped: the press's drive simply could not supply the torque.

The pad had a second cost the trial did not reach: a constant 150 kN over 30 mm of travel is 4,500 J of work on every downstroke, three times the forming itself, which the flywheel must supply (Chapter 4). A smaller pad would have passed the force curve and still loaded the flywheel heavily.

The die maker went back to the reason for the pad, which was a blank that shifted in its nest as the leg began to bend, and solved it by closing up the nest and adding a locating pin through an existing hole in the blank. The pad was dropped. The die's forces went back to the trial figures, 55 kN at 20 mm against 190 kN available and 180 kN at the bottom against 400 kN, and the next trial ran cleanly. The shop now checks every forming die's force against the press's curve at every height, not just at the bottom, before the die's first trial, and sets the tonnage monitor's envelope to the curve.

```figure
type: compare
title: AB-75 with and without the proposed pressure pad, against the force curve
rowhead: Height above bottom
cols: Available, kN | With 150 kN pad, kN | Without the pad, kN
caption: This is an illustration. The 150 kN pad exceeds the curve between about 20 and 15 mm, well under the 400 kN rating. Without it, the die's force stays far inside the curve everywhere.
- 25 mm | 183.5 | 150 | 0
- * 20 mm | 190.2 | 205 | 55
- 15 mm | 205.2 | 210 | 60
- 10 mm | 236.5 | 212 | 62
- 5 mm | 316.4 | 215 | 65
- Bottom | 400.0 | 330 | 180
```

## Exercise: a press rated at 6 mm

A second candidate press is also rated at 400 kN with a 60 mm stroke and a 250 mm connecting rod, but its rating point is **6 mm** above the bottom. At 6 mm, dh/dθ is 18.88 mm per radian; at 20 mm, it is 28.97 mm per radian; at 25 mm, 30.04. Find its force at 20 and 25 mm, and say whether it would have carried the 150 kN pad.

**Worked answer.**

- Torque limit: 400 × 18.88 = 7.55 kN·m, 37% more than the first press's 5.51 kN·m.
- At 20 mm: 400 × 18.88 ÷ 28.97 = **260.7 kN**.
- At 25 mm: 400 × 18.88 ÷ 30.04 = **251.4 kN**.

With the 150 kN pad, AB-75 needs 205 kN at 20 mm and 210 kN at 15 mm; this press offers 260.7 kN at 20 mm and more below, so it would have carried the pad. Both presses are "400 kN", but the second has a stronger drive. The rating point, not the rating, is what distinguished them.
