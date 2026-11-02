---
book: bolted-joints-by-the-numbers
chapterSlug: temperature-hole-patterns-and-records
order: 10
title: "Temperature, hole patterns and the joint register"
description: "How differential expansion changes preload in a warm joint, how to plan a bolt circle's holes and position tolerances for clearance and tapped holes, and what a joint register holds."
draft: false
---

Two things change a bolted joint after it has been designed and tightened, without anyone touching it. Temperature changes it, when the bolt and the parts it clamps expand by different amounts. And the parts themselves, as they were actually made, decide whether the bolts go in at all: a bolt circle whose holes are drilled out of position in two parts can leave a screw that will not start, or one that is bent as it is forced home. This chapter deals with both, and then with the record that ties all the CT-1's joints together.

It uses the KEVOS® bolted joint at temperature tool on the rig's aluminium valve manifold, and the bolt pattern hole plan tool on the test head. Its mistake is a manifold whose screws were tightened so close to proof that a hot afternoon took them past it.

## Preload and temperature

When a joint warms evenly, the bolt and the members both try to grow. If they are the same material they grow equally and nothing changes. If the members expand more than the bolt, as aluminium does against steel, they try to grow against the bolt's restraint, and the preload rises. If the bolt expands more, the preload falls.

```figure
type: formula
title: Preload change from differential expansion
formula: ΔF = (αm − αb) ΔT × l × kb km ÷ (kb + km)
formula: F hot = Fi + ΔF
caption: αm and αb are the expansion coefficients of the members and the bolt, ΔT the temperature change from assembly, l the grip length, and kb and km the bolt and member stiffnesses, which act in series against the mismatch. A positive ΔF raises the preload; cooling the same joint lowers it.
- ΔF | change in preload
- αm, αb | expansion coefficients, µm/m·K
```

The mismatch is small in strain but large in force, because the joint is stiff. Steel expands about 11.5 µm per metre per kelvin and aluminium alloys about 23, so a 30 mm grip of aluminium on a steel screw, warmed by 50 K, has a free mismatch of 11.5 × 10⁻⁶ × 50 × 30 = 0.017 mm. Against a series stiffness of a few hundred kilonewtons per millimetre, that is several kilonewtons.

## The manifold

The CT-1's valve manifold is an aluminium alloy block, 30 mm thick where it is held, screwed to a steel subplate by M10 × 1.5 class 12.9 cap screws that pass through the aluminium into tapped holes in the steel. The manifold's face seals need at least 20 kN of clamp per screw. The screws are tightened to 70% of proof in the workshop at about 20 °C; in a long endurance run the oil, and the manifold with it, reach 70 °C. This is an illustration.

The [bolted joint at temperature tool](/tools/bolted-joint-temperature/) takes the bolt's diameter, pitch, proof strength and modulus, the grip and threaded length, the members' modulus, the assembly preload as a share of proof, the expansion coefficients of bolt and members, the temperature change from assembly and the least clamp force needed. It returns the bolt and member stiffnesses, the assembly preload, the preload change, the preload at temperature and its share of proof, with checks against the least clamp needed and the proof load. It takes the moduli at assembly temperature and the temperature as uniform; it reminds the user to run the opposite temperature change too.

```figure
type: steps
title: A manifold screw in the bolted joint at temperature tool, at 70 °C
caption: This is an illustration. M10 × 1.5 class 12.9 (proof 970 MPa), bolt 207 GPa, grip 30 mm with 10 mm threaded, aluminium members 70 GPa, 70% of proof at assembly, αb 11.5 and αm 23 µm/m·K, ΔT +50 K, least clamp 20 kN.
- Bolt / member stiffness | 484.7 / 654.7 kN/mm
- Assembly preload | 39.37 kN
- * Preload change | +4.80 kN
- Preload at 70 °C | 44.18 kN, 79% of proof: PRELOAD HOLDS
```

Warming adds 4.8 kN to each screw. The opposite case is a cold start: if the manifold is assembled in summer at 35 °C and started on a cool morning at 10 °C, ΔT is −25 K, the preload falls by 2.40 kN to 36.97 kN, and the seals still have nearly twice their 20 kN.

### Warming up is worse than being warm

The tool assumes the bolt and the members are at the same temperature. During warm-up they are not. Hot oil flows through the manifold's galleries, and the aluminium around them heats first, while the screws, which touch the manifold only at their heads and threads, lag behind. For a while the members are hotter than the bolts, and the mismatch is larger than the steady-state figure suggests. Cooling reverses it: the aluminium cools faster and the preload dips below its cold value until the screws catch up. For the manifold, the steady-state check leaves a margin to proof of more than 10 kN, which covers a transient of that kind. A joint working close to its limits at steady temperature would need a transient analysis, or a test with a strain-gauged bolt.

### Hotter joints

The CT-1's joints never see more than about 85 °C. Joints that run much hotter, on engines, boilers and process plant, meet two further effects that the tool does not include. Elastic moduli fall with temperature, so both the bolt and the members become softer, which changes the joint constant and the thermal preload change. And at high enough temperatures bolts and members relax under steady load: the preload falls slowly even with no change in temperature, and joints are retightened hot or designed with springier bolts to tolerate it. Bolts for those duties are made from heat-resisting steels and designed with the material's creep data.

### Aluminium joints and the joint constant

The manifold's member stiffness, 654.7 kN/mm, is barely a third more than the screw's, because aluminium's modulus is a third of steel's. Its joint constant is 0.425, more than twice the steel test head's, so the screws feel a larger share of any external load and of any thermal mismatch. Aluminium also creeps slowly under high bearing stress at warm temperatures, which lets a joint lose preload over months; hardened steel washers under the screw heads spread the load on the aluminium and are fitted on all the manifold's screws.

## The mistake: tightened for the cold

When the manifold was first fitted, a fitter used a torque from a supplier's chart for class 12.9 screws that gave about 90% of proof, the chart's figure for maximum clamp. In the workshop, the joint was fine. After a summer afternoon's endurance run, the manifold wept at two face seals.

```figure
type: compare
title: Manifold screw preload at temperature, two assembly preloads
cols: Assembly preload | At +50 K | At +65 K | Against proof, 56.25 kN
rowhead: Tightened to
- * 70% of proof, as specified | 39.37 kN | 44.18 kN | 45.62 kN | Holds at both, 81% of proof at worst
- 90% of proof, supplier's chart | 50.62 kN | 55.43 kN | 56.87 kN | Exceeds proof at +65 K
caption: This is an illustration. +50 K is the usual endurance run, from 20 °C to 70 °C. +65 K is a hot afternoon with the tank at 85 °C. The preload change is the same for both assembly preloads; what differs is how much room was left for it.
```

On a hot afternoon, with the tank at 85 °C, the screws tightened to 90% reached 56.87 kN, just past their 56.25 kN proof load. The bolted joint at temperature tool reports that case as preload out of range. A screw taken past proof stretches permanently by a small amount; when the manifold cooled, each screw was a little longer than before, and its preload settled lower than it started. After a few cycles of that, two face seals no longer had enough clamp.

The screws were replaced, the manifold refitted at 70% of proof with a torque-angle procedure, and the work instruction for the manifold now states its preload, the reason for it, and that it is not to be taken from a generic chart. The general lesson is in the tool's last check: a joint that changes temperature must be checked at both extremes, and its assembly preload chosen to leave room for both.

## Planning a bolt circle

The test head's eight screws pass through clearance holes in the head into tapped holes in the block. The holes in the head and the tapped holes in the block are each made to a position tolerance. If both were placed perfectly, any screw would pass through its clearance hole with 1 mm of clearance all round. Because neither is perfect, the clearance has to be shared between the two parts' position errors.

There are two cases. When both parts have clearance holes and a loose bolt and nut pass through both, the fasteners float, and each part may use the whole clearance. When one part is tapped, or has a pressed-in stud, the fastener is fixed in that part, and the clearance in the other part must cover the errors of both. That is the case for the test head.

```figure
type: formula
title: Position tolerance for clearance holes, at maximum material
formula: Floating fasteners: T = H − F for each part
formula: Fixed fasteners: T1 + T2 = H − F
caption: H is the clearance hole at its smallest size and F the fastener at its largest. The tolerances apply at maximum material condition, so a hole made larger than its smallest size gains bonus tolerance equal to the extra size. For tapped holes, a projected tolerance zone above the part is usually specified, so a tilted thread is caught.
- T | position tolerance, diameter
- H | clearance hole at maximum material condition
- F | fastener at maximum material condition
```

The [bolt pattern hole plan tool](/tools/bolt-pattern-hole-plan/) takes the bolt circle diameter, the number of holes and the angle of the first, the fastener's largest size, the clearance hole's smallest and largest sizes, whether the fasteners float or are fixed and, if fixed, the share of the tolerance given to the clearance-hole part, and the flange's outside diameter and bore, a wrench or socket clearance, and the least ligament, edge distance and position tolerance the shop can hold. It returns the angle between holes, the chord between neighbours, the ligament and edge distances at the largest hole, the position tolerances for each part at maximum material, the bonus at the largest hole and a table of hole coordinates.

```figure
type: steps
title: The test head's bolt circle in the bolt pattern hole plan tool
caption: This is an illustration. 8 holes on a 200 mm circle, first at 22.5°; screw 20 mm; clearance holes 22.00 to 22.33 mm; fixed fasteners, half the tolerance to the head; head 260 mm outside, 140 mm spigot; socket clearance 34 mm; least ligament 3 mm, edge 10 mm, tolerance 0.2 mm.
- Angle between holes | 45°
- Chord between adjacent holes | 76.54 mm, against a 34 mm socket
- Ligament at the largest hole | 54.21 mm
- Edge distance outside / to the spigot | 18.84 / 18.84 mm
- * Position tolerance: head holes / tapped holes | 1.000 / 1.000 mm at maximum material
- Bonus at the largest hole | 0.330 mm: PATTERN WORKS
```

The first hole sits at x = 92.39, y = 38.27 mm from the head's centre, and the tool lists all eight. The head's drawing gives its holes a position tolerance of 1.0 mm at maximum material, and the block's drawing gives its tapped holes 1.0 mm in a projected zone 54 mm high, the thickness of the head and washer.

### Projected tolerance zones

A tapped hole's position is measured where its axis enters the part, but what matters to the screw is where its axis goes above the part, through the clearance hole in the head. A tapped hole drilled slightly off square can be in position at its surface and well out of position 54 mm above it, at the top of the head. A projected tolerance zone, a cylinder of the tolerance's diameter extended above the tapped part by the thickness of the mating part, controls that. The block's drawing gives one, and the shop checks the tapped holes by screwing in a gauge pin and measuring its position at the projected height. A tapped hole that passes at its surface and fails at the projected height is the commonest reason a screw will not start in a part that measures correctly on paper.

### Access

The tool's wrench clearance check compares the chord between neighbouring holes with the socket or spanner diameter. It is a first check only. The test head's screws sit in counterbores, so the socket must also fit down the counterbore, and a torque wrench with a crowfoot, as in Chapter 2, must have room to swing through its working arc without striking the chamber's brackets. The shop checks access on the 3D model with the actual tools before the drawing is released, because a joint that cannot be tightened properly will not be.

### The error in the first drawings

The first drawings gave both parts a position tolerance of 2.0 mm, the floating fastener figure. That is right when a loose bolt passes through clearance holes in both parts. It is wrong here, because the screw is fixed in the block's thread: if the block's hole were 1 mm off one way and the head's hole 1 mm off the other, together they would use the whole of the clearance, and the larger errors the drawings allowed would leave a screw jammed against the side of its hole or bent as it was driven. The tool, run with fixed fasteners and half the tolerance to each part, gave 1.0 mm each, and both drawings were corrected before the parts were made.

## The joint register

Every bolted joint on the CT-1 that matters has a line in a register. Each line says what the joint does, how it was designed, how it is tightened, and how it is checked in service.

```figure
type: compare
title: The CT-1's bolted joint register
cols: Design check | Tightening | In-service check
rowhead: Joint
- Test head, 8 × M20 10.9 | Separation, proof, fatigue at 70% of proof | 100 N·m snug, then 22° | Stretch on a sample at each seal change; screws replaced after set reassemblies
- Frame splice, 12 × M20 8.8 | Friction grip, slip factor 1.25, faying surfaces unpainted | Fabricator's structural procedure | Alignment marks at each annual service
- Rod-end support, 4 × M16 | Eccentric group, bearing | Torque, 70% of proof | Visual and torque check annually
- Load cell bracket, 4 × M16 | Tension and shear interaction, 20 mm back plate | Torque, 70% of proof | Visual and torque check annually
- Valve manifold, M10 12.9 to subplate | Preload at +65 K and −25 K | Torque-angle, 70% of proof | Weep inspection monthly
- Valve screws, M6 12.9 | Engagement 13 mm in aluminium | Valve maker's torque | At valve change
- Filter cover, 12 × M16 | Gasket seating and operating loads | Star pattern, 4 passes, 4-hour retorque | Gasket replaced on a schedule
caption: This is an illustration. Each design check is a calculation in this book. The tightening and inspection entries are the shop's choices and are reviewed after the rig's first year.
```

The register is the evidence that each joint was made as designed, and the starting point for anyone who has to take one apart. It also records which joints hold stored energy when opened, the pressurised test head and filter housing above all, and points to their isolation procedures, as the model Code of Practice for managing the risks of plant expects.

## Exercise: a twelve-hole head

A larger version of the test head is drawn with twelve M16 screws on the same 200 mm circle, first hole at 0°, clearance holes 18.00 to 18.27 mm, the same 260 mm head and 140 mm spigot, fixed fasteners with half the tolerance to the head, and a 28 mm socket. Find the chord, the ligament, the edge distances and the position tolerances. Does the pattern work?

### Worked answer

The angle between holes is 30°, and the chord between neighbours is 200 × sin 15° = 51.76 mm, comfortably more than the 28 mm socket. At the largest hole, the ligament between holes is 51.76 − 18.27 = 33.49 mm. The edge distances are (260 − 200) ÷ 2 − 18.27 ÷ 2 = 20.87 mm outside and (200 − 140) ÷ 2 − 9.135 = 20.87 mm to the spigot.

The total clearance at maximum material is 18.00 − 16 = 2.0 mm, so with fixed fasteners each part gets 1.0 mm, and the head's holes gain up to 0.27 mm of bonus at their largest size.

The bolt pattern hole plan tool gives the same and reports that the pattern works, with the first hole at x = 100, y = 0 mm. The twelve-screw head is feasible on this circle; whether twelve M16s hold it shut is a question for Chapter 4's design check, not for the hole plan.
