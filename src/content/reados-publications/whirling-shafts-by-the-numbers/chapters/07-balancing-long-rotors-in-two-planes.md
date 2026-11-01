---
book: whirling-shafts-by-the-numbers
chapterSlug: balancing-long-rotors-in-two-planes
order: 7
title: "Balancing long rotors in two planes"
description: "Why a long rotor needs corrections in two planes: resolving unbalances by moments, checking each plane against its grade, weighing hammer sets, and why a static balance left a couple behind."
draft: false
---

A long rotor can be perfectly balanced statically, sitting still in any position on knife edges, and still shake its bearings violently when it spins. The reason is couple unbalance: two unbalances at opposite ends of the rotor, on opposite sides, which cancel each other's pull on the centre of mass but together try to tilt the rotor's axis. A tilting rotor drives its two bearings in opposite directions. No single weight can cure it, because a single weight cannot produce a couple. Two weights, in two planes, can cure any unbalance of a rigid rotor.

This chapter shows how to calculate the two corrections, applies two WORKOS tools to the HM-30's rotor after a hammer change, explains how weighing and sorting hammers keeps the rotor in balance, and describes the static rebalance that left the rotor shaking.

## Two planes are always enough

Any number of unbalances spread along a rigid rotor can be replaced by two equivalent unbalances in any two chosen planes. The proof is the same as for a beam's reactions: the unbalances are a set of rotating forces, and two supports, here two correction planes, can always be found to balance them, by resolving forces and taking moments.

```figure
type: formula
title: Corrections in two planes by moments
formula: Plane B correction: U_B = −Σ (U_i × z_i) ÷ L, as a vector
formula: Plane A correction: U_A = −Σ U_i − U_B, as a vector
formula: Correction mass in each plane: m = |U| ÷ r_c, at the angle of the vector
caption: Each unbalance U_i is a vector (mass × radius, at its angle), z_i is its axial distance from plane A, and L is the distance between planes A and B. Moments about plane A give plane B's correction; the force balance then gives plane A's.
- U_i | each unbalance, g·mm, at its angle
- z_i | axial distance of each unbalance from plane A, mm
- L | distance between correction planes A and B, mm
- r_c | correction radius in each plane, mm
```

The choice of planes is practical: they must be accessible for drilling, welding or bolting weights, as far apart as the rotor allows (a longer L means smaller corrections for the same couple), and at a radius large enough that the weights are reasonable.

## The HM-30 after a hammer change

This is an illustration. The HM-30's correction planes are the two outer discs of the rotor pack, 400 mm apart, with tapped holes on a 250 mm radius for bolt-on weights. Plane A is at the drive end. The maker's balance specification is G 6.3, which allows 1,835 g·mm in each plane (Chapter 5).

After a customer's maintenance crew replaced the hammers with two different batches, the maker's service technician weighed the hammers that had been fitted and worked out the rotor's new unbalance from the differences:

```figure
type: compare
title: Unbalance added by the mismatched hammer sets, HM-30 rotor
cols: Excess mass, g | Radius, mm | Angle | Distance from plane A, mm | Unbalance, g·mm
rowhead: Location
- Pin at 0°, drive-end group of hammers | 30 | 230 | 0° | 60 | 6,900
- Pin at 0°, middle group | 30 | 230 | 0° | 160 | 6,900
- Pin at 270°, non-drive-end group | 25 | 230 | 270° | 330 | 5,750
caption: This is an illustration. Each excess mass is the difference between the heavy hammers and those opposite them, lumped at the middle of the group. The rotor's original residual unbalance is small beside these and is left out.
```

Working the moments by hand: the unbalances sum to (13,800, −5,750) g·mm in x and y; their moments about plane A sum to (1,518,000, −1,897,500) g·mm². Plane B's correction is minus the moment divided by 400: (−3,795, 4,744) g·mm, a magnitude of 6,075 g·mm. Plane A's is minus the sum less plane B's: (−10,005, 1,006) g·mm, a magnitude of 10,055 g·mm.

The WORKOS [Two-plane (dynamic) balance corrections](/tools/two-plane-balance/) tool does that arithmetic: from up to three masses, each with its radius, angle and axial position from plane A, the distance between the planes and the correction radius in each, it gives the correction mass and angle in each plane and the static unbalance. The WORKOS [Rotor balancing check](/tools/rotor-balancing-check/) tool does the same resolution and adds the balance grade: from the rotor's mass, speed and grade it works out the permissible unbalance per plane, compares each plane's unbalance with it, gives the rotating force each plane's unbalance puts on the bearings, and checks that the corrections fit within the largest weight you can practically fit.

```figure
type: compare
title: HM-30 rotor in the rotor balancing check tool
cols: Unbalance, g·mm | Permissible, g·mm | Correction at 250 mm | Rotating force at 2,950 rpm, N
rowhead: Plane
- A, drive end | 10,055 | 1,835 | 40.2 g at 174.3° | 960
- B, non-drive end | 6,075 | 1,835 | 24.3 g at 128.7° | 580
caption: This is an illustration. Rotor 180 kg, 2,950 rpm, G 6.3, planes 400 mm apart, largest practical weight 60 g. Both planes are out of tolerance; both corrections fit; the tool's verdict is "correct and re-check".
```

Plane A is more than five times its tolerance and plane B more than three times. Neither correction is directly opposite the 0° pin, because the 270° set pulls each plane's correction round, and the two planes need corrections at quite different angles, because the unbalances sit at different distances along the rotor. That is the signature of dynamic unbalance: both static and couple, mixed.

The forces matter more than the grade's arithmetic suggests. The drive-end bearing carries 883 N of the rotor's weight steadily; the 960 N of rotating force from plane A's unbalance is larger than that, so the load on the bearing swings from almost zero to nearly 1,850 N and back once every revolution, and its direction sweeps all the way round the bearing. Rolling bearing life falls steeply as the load rises, roughly with the cube of the load for ball bearings and a little less steeply for roller bearings, so an unbalance force of this size shortens bearing life far more than its size beside the weight suggests. On top of that comes the amplification from running at 72% of the critical speed (Chapter 5), roughly doubling the force again.

### Fitting correction weights

A correction can be made by adding mass opposite the heavy side or by removing mass from the heavy side itself; the arithmetic is the same with the angle turned through 180°. The HM-30's planes have tapped holes for bolt-on weights, which have three advantages: they can be adjusted, they can be removed when the hammers are next changed, and nobody has to weld on a finished rotor. Welded weights are permanent and must be welded by a qualified welder to a procedure, because a weld on a rotating part is a fatigue risk. Drilling to remove mass is used on parts with spare material, such as the rim of a fan wheel, and must not cut into a highly stressed section. Whatever the method, each weight is recorded with its plane, mass, radius and angle, so that the next technician knows what is there and why.

The technician fitted 40 g at 175° in plane A and 24 g at 130° in plane B, the nearest weights and tapped holes, and checked the rotor on site with a vibration meter: both bearings came down to well inside the maker's acceptance level.

## Static and couple, separated

It helps to split the same unbalance into its two parts. The static part is the vector sum of all the unbalances: 14,950 g·mm at 337.4°, pulling the centre of mass off the axis. A single 59.8 g weight at 157.4° in the middle of the rotor, 200 mm from plane A, would cancel it. What remains when it is cancelled is a pure couple, equal and opposite in the two planes.

```figure
type: compare
title: The HM-30 rotor's unbalance split into static and couple parts
cols: Plane A, g·mm | Plane B, g·mm | Shows on knife edges? | Shows when spinning?
rowhead: Part
- Static, 14,950 g·mm at 337.4° | shared | shared | yes | yes, bearings in phase
- * Couple left after a central static correction | 3,624 | 3,624 | no | yes, bearings in opposite phase
- Permissible per plane at G 6.3 | 1,835 | 1,835 | | 
caption: This is an illustration. From the rotor balancing check tool with a 59.8 g weight added at 157.4°, 200 mm from plane A. The remaining couple is about twice the tolerance in each plane.
```

The couple of 3,624 g·mm in each plane, nearly twice the tolerance, is invisible to a static test, because it does not move the centre of mass. It can only be found by spinning the rotor and measuring both bearings, or by calculating from known masses as above.

## The error: a static rebalance

This is an illustration. On a different farm, after a similar hammer change, the owner's fitter was asked to "balance the rotor". The fitter, who balanced fan wheels routinely, removed the rotor, set it on knife edges, found that it rolled heavy side down at about 337°, and added weight to the middle disc opposite the heavy side until it stayed put in any position. The rotor was statically balanced. Refitted, it shook almost as badly as before.

The fitter's work had been careful, and it had removed the static part completely. What it could not touch was the couple. The vibration meter told the story at once: the two bearings were moving in opposite phase, about 180° apart, the sign of couple unbalance that a single central weight cannot correct.

```figure
type: decision
title: One plane or two
question: How do the two bearings move relative to each other when the rotor spins?
- In phase, similar size | Mainly static unbalance | One plane may do, for a narrow rotor (Chapter 6)
- * Out of phase, near 180° | Couple unbalance | Two planes, always
- Different sizes and phases | Dynamic unbalance | Two planes, resolved by moments or by trial weights in each plane
```

Reading the phase relationship does not need sophisticated equipment. A vibration meter with a once-per-revolution reference, used on one bearing and then the other in the same direction, gives the two phases directly. Without a reference, a two-channel instrument with one sensor on each bearing shows whether they move together or against each other. Even a strobe light flashing at running speed, shone on a chalk mark on the shaft while a hand rests on each bearing in turn, can show it to an experienced technician. What matters is that someone looks at both bearings before deciding how to balance, and that the decision follows from what they see rather than from the method they are used to.

The maker's service technician rebalanced the rotor in two planes on site, using trial weights in each plane in turn, the two-plane version of Chapter 6's method, which needs three runs instead of two. The fitter's static weight was left in place, since it was doing its share of the job, and the two plane corrections took care of the rest. The maker added a note to its service manual: "The HM-30 rotor must be balanced in two planes. Static balancing on knife edges is not sufficient."

## Two planes in the field

When the unbalances are not known, the two-plane corrections are found in place with trial weights, extending Chapter 6's method. Each correction plane affects both bearings, so four sensitivities are needed instead of one.

```figure
type: steps
title: Two-plane field balancing with trial weights
caption: Vibration readings are vectors, size and phase, taken at both bearings on every run, with the same phase reference and angle convention throughout. The arithmetic is usually done by the instrument or a spreadsheet; it is two simultaneous equations in two unknown vectors.
- Run 1, as found | read the vibration at bearing 1 and bearing 2
- Run 2, trial weight in plane A | read both bearings; the changes give plane A's effect on each bearing
- Run 3, trial in plane B only (plane A's trial removed) | read both bearings; the changes give plane B's effect on each
- Solve | find the corrections in A and B whose combined effects cancel the original readings at both bearings
- * Run 4, corrections fitted | check both bearings against the acceptance level; trim if needed
```

The calculation fails if the two planes affect the two bearings in nearly the same way, because the equations then cannot tell the planes apart. That happens when the planes are close together or both near the middle of the rotor. Choosing planes near the ends, as far apart as possible, avoids it, and has a second benefit: for a given couple, the corrections are inversely proportional to the distance between the planes. On the HM-30, planes 300 mm apart instead of 400 mm would need couple corrections a third larger.

## When a rotor stops being rigid

Everything in this chapter assumes a rigid rotor: one whose shape does not change with speed, so that a correction that balances it at one speed balances it at all speeds. That is a good assumption when the rotor runs well below its first critical speed. As the speed approaches the critical speed, the shaft bends under the remaining unbalance, the bend moves mass off the axis, and the rotor's effective unbalance changes with speed. A rotor balanced on a balancing machine at a few hundred revolutions per minute may then be out of balance at its service speed.

The HM-30 runs at 72% of its first critical speed on a stiff foundation, close enough that the maker checks its balance at service speed after assembly, on the test plinth, and trims it there if needed. Rotors that run near or above their first critical speed are flexible rotors, and balancing them needs methods that correct the bending modes as well as the rigid-body unbalance, with corrections in more than two planes and checks at several speeds. ISO 21940-12 sets out procedures and tolerances for flexible rotors; the rigid-rotor tools in this chapter are not meant for them, as their guides note.

## Keeping the balance: weighed hammer sets

The cheapest way to keep a hammer mill rotor in balance is to stop the unbalance from being created. The HM-30's hammers are supplied in sets of 48, weighed individually and sorted so that the four pins' sets of twelve match each other closely, and so that the hammers along each pin are arranged with the heavier and lighter ones alternated. The arithmetic shows why that matters.

This is an illustration. If individual hammers vary by ±5 g around their nominal 750 g, a set of twelve made up at random has a total that varies by about 10 g, one standard deviation. Two sets on opposite pins that differ by 10 g at a radius of 230 mm leave 2,300 g·mm of unbalance, more than the whole rotor's tolerance in one plane. Sorting the hammers so that each pin's set totals within 5 g of the others cuts that to 1,150 g·mm at worst, well inside.

```figure
type: checklist
title: Replacing hammers on an HM-30
caption: The open item is the one most often skipped in the field.
- Replace hammers as complete weighed sets, never singly | a single new hammer beside worn ones is a large unbalance
- ? Fit each pin's numbered set to its own pin, in the marked order | the order is part of the balance
- Turn or replace hammers on opposite pins together | uneven wear unbalances the rotor
- Clean packed material from the rotor before refitting | build-up is unbalance
- Check vibration at both bearings after the change | in phase and out of phase
- Rebalance in two planes if either bearing exceeds the acceptance level | not on knife edges
```

## Exercise: a single heavy hammer

This is an illustration. A crew replaces one broken hammer with a new one that is 60 g heavier than the worn hammer opposite it. The new hammer hangs on the 90° pin at 230 mm radius, 380 mm from plane A on a rotor whose correction planes are 400 mm apart.

1. What unbalance does the new hammer add?
2. What corrections, size and angle at 250 mm, are needed in planes A and B?
3. Are both planes outside the G 6.3 tolerance of 1,835 g·mm per plane?

**Worked answer.**

1. 60 × 230 = **13,800 g·mm** at 90°.
2. Moments about plane A: 13,800 × 380 = 5,244,000 g·mm² at 90°. Plane B: 5,244,000 ÷ 400 = 13,110 g·mm, so the correction is **52.4 g at 270°**. Plane A: 13,800 − 13,110 = 690 g·mm to be cancelled, so the correction is **2.8 g at 270°**.
3. Plane B, at 13,110 g·mm, is **seven times** its tolerance. Plane A, at 690 g·mm, is **within** it. A single heavy hammer near one end unbalances that end almost alone, which is why a vibration check after a hammer change looks at both bearings separately.
