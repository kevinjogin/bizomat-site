---
book: magnetic-workholding-by-the-numbers
chapterSlug: holding-against-cutting-forces
order: 5
title: "Holding against cutting forces"
description: "Compare a magnet's sliding resistance with milling forces: cutting force from power and speed, peak factors, friction with and without coolant, stops, and vacuum and clamp alternatives."
draft: false
---

A magnetic chuck pulls a part down. A cutter pushes it sideways. The part stays put only while friction between the part and the chuck face, which depends on the magnet's pull, exceeds the cutter's sideways push, or while something else, such as a stop, takes that push. This is the comparison that decides whether a magnetic set-up is safe for a given cut, and it is the one that the large numbers in the previous chapters tempt people to skip.

This chapter works the comparison for BP-600's two milling operations. It finds the cutting force from the cutting power, as the WORKOS face milling power tool calculates it, compares it with the friction the chuck provides in each contact condition, and then looks at stops, lighter cuts, and how a vacuum table and conventional clamps would do on the same job. The error is a change of coolant that halved the friction.

## The cutting force from the cutting power

The cutter does work on the chip, and the rate at which it does that work is the cutting power. The mean tangential force at the cutter's edge is that power divided by the cutting speed. For milling, the WORKOS [face milling power plan tool](/tools/face-milling-power-plan/) calculates the cutting power from the cut's geometry: it finds the engagement angle and mean chip thickness for the cutter diameter and width of cut, corrects the specific cutting force for that chip thickness from the material's kc1.1 and exponent, and multiplies by the metal removal rate. It also gives the spindle speed, table feed, torque and motor power, and checks the power against the spindle's.

This is an illustration. BP-600's faces are milled with a 125 mm face mill with 10 inserts, taking an 80 mm wide, 3 mm deep cut at 200 m/min and 0.15 mm per tooth. For the plate's steel the shop uses kc1.1 = 1,700 N/mm² and an exponent of 0.25.

```figure
type: stats
title: BP-600 face milling cut, from the face milling power plan tool
caption: This is an illustration. Tool inputs: 125 mm cutter, 80 mm width, 3 mm depth, 200 m/min, 0.15 mm per tooth, kc1.1 1,700 N/mm², mc 0.25, 90° lead angle, zero rake, 80% machine efficiency, 15 kW spindle. The tool suggests 10 teeth for two in the cut.
- 509 rpm and 764 mm/min | spindle speed and table feed
- 106.3° and 0.104 mm | engagement angle and mean chip thickness
- 2,997 N/mm² | specific cutting force at that chip thickness
- 183 cm³/min | metal removal rate
- 9.16 kW | cutting power; 11.45 kW at the motor, within 15 kW
- 2,748 N | mean tangential force, 9,158 W ÷ (200 ÷ 60) m/s
```

The mean force is not the force to design for. Each insert enters and leaves the cut, the number of inserts in the cut changes, and the force's direction rotates as each insert sweeps across the plate. The peak sideways force on the part can be well above the mean. A common allowance is a peak-to-mean factor of 2 for face milling with several teeth engaged, and more for interrupted cuts or few teeth. With a factor of 2, BP-600's cut can push the plate sideways with about 5.5 kN.

## Friction against the cutting force

From Chapter 3, the chuck's normal force on BP-600 depends on which face is down.

```figure
type: compare
title: Sliding safety factor of BP-600 on the chuck, friction only, peak force 5.50 kN
cols: Normal force including the plate's weight, kN | Sliding resistance, kN | Safety factor against sliding
rowhead: Operation and friction coefficient
- * First operation, mill scale down, μ = 0.2 | 24.4 | 4.87 | 0.89
- Second operation, milled face down, μ = 0.2 | 54.2 | 10.83 | 1.97
- Second operation, milled face down, flood coolant, μ = 0.1 | 54.2 | 5.42 | 0.99
- Ground contact, μ = 0.2 | 77.8 | 15.55 | 2.83
caption: This is an illustration. Normal forces from Chapter 3's gap model, plus the plate's 462 N weight. Safety factor is sliding resistance divided by the 5.50 kN peak cutting force. A factor below 1 means the plate is expected to slide on force peaks.
```

The first operation fails outright: with the plate's mill scale down, friction alone gives a safety factor of 0.89. The second operation, milled face down and dry, is just under a factor of 2, which leaves little room for an uncertain friction coefficient or a heavier peak than assumed. Both need something more than friction.

The friction coefficient in the table is the shop's own measurement, not a handbook value. This is an illustration. With the 120 × 120 mm ground test block from Chapter 1 on the chuck, pulling down with 5.5 kN, a force gauge pushed it sideways until it moved, at 1.1 kN dry: a coefficient of 0.20. The same test, repeated after this chapter's error with the block and chuck face wet with coolant, needed only 0.55 kN: a coefficient of 0.10.

It is worth seeing the requirement the other way round. To hold a 5.50 kN peak force with a safety factor of 2 by friction alone at μ = 0.2, the magnet must pull the plate down with 2 × 5.50 ÷ 0.2 = 55 kN. The chuck delivers 77 kN only with ground contact. It is not that the chuck is weak; it is that friction converts only a fifth of the pull into resistance to sliding.

## Stops

A stop is a hardened bar or a set of pins fixed to the chuck face, or to the machine table beside the chuck, against which the part sits so that the cutting force pushes the part into the stop. With a stop, the cutting force along that direction is carried by the stop, not by friction, and the magnet's job becomes holding the part down against lift and against the moment that tries to tip it over the stop. Magnets are very good at that job.

The WORKOS [fixture clamping force tool](/tools/fixture-clamp-force/) makes the difference plain for mechanical clamps. With the cutting force taken by friction alone, at the same 5.50 kN peak, a safety factor of 2 and friction coefficients of 0.2 at both the clamp and the locating face, it asks for 27.5 kN of total clamping force; with the cutting force taken by a positive stop and only a 1.5 kN lifting force to resist, it asks for 3.0 kN. The same logic applies to the magnet: a stop reduces the force it must provide by an order of magnitude.

Stops need three checks of their own:

- **Height.** A stop must be lower than the part's top face by more than the cutting depth, so the cutter does not hit it, and high enough to bear on the part's edge, not on a chamfer or burr. For BP-600 the shop uses 12 mm stop bars against a 25 mm plate.
- **Direction.** The sideways force in face milling rotates with each insert's sweep and depends on whether the cut is climb or conventional. Stops are needed on every side the resultant can point, which for a centred face mill means at least two adjacent sides.
- **Tipping.** The cutting force acts at the top of the part, so it tries to rotate the part over the stop. For BP-600 the moment is about 5,496 N × 0.025 m = 137 N·m, against a restoring moment from the magnet's pull of roughly 24.4 kN × 0.3 m = 7.3 kN·m even with mill scale down. Tipping is a concern only for tall, narrow parts.

## A lighter first cut

Where a stop cannot be used, for example when a part must be milled all round its periphery, the alternative is a lighter cut. With the chip thickness held constant, the cutting force is roughly proportional to the depth of cut. For a safety factor of 2 on the first operation by friction alone, the peak force must be no more than 4.87 ÷ 2 = 2.44 kN, so the mean no more than 1.22 kN, and the depth of cut no more than about 3 × 1.22 ÷ 2.748 = 1.3 mm. The first face would then take three passes instead of one, after which the second operation, milled face down, has the higher force of Chapter 3.

## Vacuum and clamps compared

The same plate could be held on a vacuum table or with clamps. The WORKOS [vacuum table workholding check](/tools/vacuum-table-workholding-check/) makes the comparison for vacuum. It calculates the holding force from the vacuum and the sealed area, with an allowance for leakage, adds the part's weight, applies the friction coefficient, takes the mean cutting force from the cutting power and speed as the face milling tool does, applies a peak factor, and gives the sliding safety factor and the largest feed that meets a required factor.

```figure
type: compare
title: Three ways to hold BP-600 for the first face, peak force about 5.50 kN
cols: Holding or resisting force | Sliding safety factor | Practical notes
rowhead: Method
- Vacuum table, 560 × 360 mm sealed, 80 kPa, 80% effective, μ = 0.2 | 12.9 kN normal; 2.67 kN sliding | 0.49 | mill scale and flame-cut edges seal poorly; feed limited to 186 mm/min for a factor of 2
- Magnetic chuck, mill scale down, μ = 0.2, no stop | 24.4 kN normal; 4.87 kN sliding | 0.89 | fast to load; slides on force peaks
- * Magnetic chuck with stop bars on two sides | stop carries the sideways force | not limited by friction | the shop's method; magnet holds the plate down
- Four strap clamps, friction only | 27.5 kN total clamp force needed | 2.0 by design | clamps obstruct the face mill; would need repositioning
caption: This is an illustration. Vacuum figures from the vacuum table workholding check with the case's cut entered; clamp force from the fixture clamping force tool in friction mode. The vacuum table's 80 kPa below atmosphere is close to the most any vacuum can provide.
```

The vacuum table's difficulty is fundamental. A vacuum can never push harder than atmospheric pressure, about 100 kPa, and practical systems deliver 60 to 90 kPa over the sealed area. The magnet's pull on BP-600's mill scale, about 24 kN over the plate's 0.24 m², is an average of about 100 kPa over the whole plate, and over 300 kPa with milled contact. Magnets win on steel; vacuum wins on non-magnetic materials, thin sheet with good flatness, and parts that must not be magnetised.

## Drilling and tapping: torque, not force

A drill or tap pushes down, which the chuck resists easily, and twists, which friction must resist. A part held by friction resists twisting about the drill by the friction force at each point of contact times its distance from the drill. For a large plate like BP-600, with the drill well inside its outline, the contact lies on average a few hundred millimetres from the drill, so the resisting moment is the sliding resistance times that distance: several kilonewton-metres even with mill scale down, against drilling torques of tens of newton-metres. Large plates are rarely at risk from drilling.

Small parts are. A part 60 mm across, drilled near its centre, has contact only within 30 mm of the drill, and its resisting moment is roughly the sliding resistance times a third of its half-width. A small part that easily resists a sideways push by hand can spin under a 12 mm drill as it breaks through, when the torque peaks and the drill grabs. Drilling small parts on a magnetic chuck needs a stop against rotation, or a fixture.

## A set-up sheet for a magnetic cut

The case's shop now records the comparison on every set-up sheet for a magnetic cut, in five lines. Each line comes from a chapter of this book, and the sheet shows the safety factor in the last line.

- **Normal force:** poles fully covered, times force per pole, times the material factor (Chapter 2), times the gap share for the contact face (Chapter 3), times the thickness share (Chapter 4), plus the part's weight.
- **Friction coefficient:** with the condition it was measured in, dry or wet.
- **Peak cutting force:** from the cutting power and speed, with the peak factor used.
- **What takes the sideways force:** friction, or stops on named sides.
- **Safety factor:** sliding resistance divided by peak force if friction carries it; "stop" if a stop does.

The sheet is short because it must be filled in for every new part. A long sheet would be skipped; five lines take a few minutes, and they are what would have prevented every error in this chapter and the last three.

## The error: coolant halved the friction

This is an illustration. For a batch that needed a better finish on the second face, the programmer changed the second operation from dry milling to flood coolant and left the rest of the set-up as it was: milled face down, and, because the safety factor had been 1.97, no stops on the second operation.

Part way through the batch, a plate shifted by about 1 mm during the cutter's entry into the cut. The shop's investigation found that the set-up sheet's friction coefficient of 0.2 had been measured dry. A sliding test on the chuck with the plate and chuck face wet with the coolant gave a coefficient of about 0.1. At μ = 0.1, the sliding resistance was 5.42 kN against a 5.50 kN peak: a safety factor of 0.99. The plate had held for most of the batch because peak forces vary from pass to pass, and it slid when one exceeded the resistance.

Stops were fitted to the second operation for every batch, wet or dry. The set-up sheet now records the friction coefficient with the condition it was measured in, and the shop treats any change of coolant, chuck face or part finish as a change to the set-up that needs the safety factor recalculated.

## Exercise: a narrower cutter

This is an illustration. For the second operation the shop considers a 63 mm face mill with 5 inserts, taking a 50 mm wide, 3 mm deep cut at the same 200 m/min and 0.15 mm per tooth. The face milling power plan tool, with the same kc1.1 and exponent and 5 teeth entered, gives an engagement angle of 126°, a mean chip thickness of 0.108 mm and a cutting power of 5.61 kW.

1. What are the mean and peak (factor 2) sideways forces?
2. With the milled face down and coolant, μ = 0.1, what is the safety factor against sliding with no stops?
3. Is the narrower cutter enough on its own?

**Worked answer.**

1. Mean = 5,610 W ÷ (200 ÷ 60) m/s = **1,683 N**; peak = **3,366 N**. The cut is narrower, but the higher engagement angle and slightly thicker chips mean the force falls by less than the width does.
2. Sliding resistance = 0.1 × 54.2 kN = 5.42 kN, so the safety factor is 5,420 ÷ 3,366 = **1.61**.
3. **No.** The factor is below 2 even with the narrower cutter, and it rests on a friction coefficient measured once. Stops are cheaper and more robust than changing the cutter; with stops, the cutter can be chosen for productivity rather than for workholding.
