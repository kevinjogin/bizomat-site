---
book: buckling-by-the-numbers
chapterSlug: rods-in-machines
order: 7
title: "Rods in machines: cylinders and screws"
description: "Buckling of hydraulic cylinder rods and screws: the length and mounting that count, why the rod must survive the relief valve's force rather than the duty, and the same check for ball screws."
draft: false
---

Machines are full of slender members in compression that nobody thinks of as columns. A hydraulic cylinder pushing a load is a strut: its rod, fully extended, is a long, slender bar with a load on its end. A screw jack, a ball screw driving a table against a load, and a push rod in a linkage are all struts. They buckle by exactly the rules of the earlier chapters, with two twists. Their length changes as they move, so the worst case is usually fully extended. And the force on them is often set not by the job they are doing but by what the machine's power source can deliver if something jams.

This chapter applies the rules to the hydraulic tipping cradle that stands HT-8's tank upright, uses two BIZOMAT hydraulic tools, shows why the first cylinder chosen would have buckled at its relief pressure, and finishes with the same check for screws.

## The tipping cradle

This is an illustration. HT-8's tank arrives at the shop lying on its side on a truck. The shop stands tanks upright on a tipping cradle: a steel frame hinged at one edge of its base, with the tank strapped to it, rotated through 90° by a hydraulic cylinder pinned between the cradle base and an arm on the frame. The cylinder is driven by the shop's general-purpose power unit, which has its relief valve set at 160 bar.

The first cylinder proposed for the cradle was a stock item: 63 mm bore, 36 mm rod, 900 mm stroke, pinned at both ends with a clevis on the barrel and an eye on the rod. Its pin centres are 1,250 mm apart retracted and 2,150 mm apart extended. The cradle's geometry needs a push of about 18 kN at the start of the lift, when the tank and the cradle frame, 600 kg together, are farthest from vertical and the cylinder has the poorest leverage. The push needed falls as the tank rises.

## A cylinder as a strut

A cylinder pinned at both ends acts as a pin-ended strut whose length is the distance between its pins. The barrel is much stiffer than the rod, so the usual simplification, and the one used by the BIZOMAT tools, treats the rod as if it ran the whole distance from the mounting to the rod end. That is conservative: the real buckling load is somewhat higher, because the stiff barrel occupies part of the length. The worst position is fully extended, when the length is greatest and the rod has least support from its bearing in the cylinder's head.

The mounting sets the effective length factor. For a cylinder pinned at both ends and guided by nothing else, K = 1.0 on the pin-to-pin length. A cylinder rigidly flanged to a frame at one end, pushing a load that is free to move sideways at the other, is a flagpole, K = 2.0. A cylinder rigidly mounted at one end with its rod end guided in line by a slide is braced, with K between 0.5 and 0.7. Cylinder makers publish tables of these factors for each mounting style. The essential question is the same as for HT-8's legs: can the rod end move sideways relative to the mounting?

```figure
type: compare
title: Cylinder mountings and the effective length used for rod buckling
cols: Can the rod end move sideways? | Effective length factor | Example
rowhead: Mounting
- Pinned at both ends | no, if the load is guided | 1.0 on pin centres | cradle cylinder, clevis and eye
- Fixed flange, rod end guided by a slide | no | about 0.5 to 0.7 | press with a guided platen
- Fixed flange, rod end pinned to a guided load | no | about 0.7 | ram pushing a pinned carriage
- * Fixed flange, rod end free | yes | 2.0 | ram pushing an unguided load
caption: Theoretical values; makers' tables give values for their own mountings. Where the rod end can move sideways, the cylinder is a flagpole and the effective length is twice its extended length.
```

## Sizing the rod for the duty

The BIZOMAT [Hydraulic cylinder sizing](/tools/hydraulic-cylinder-sizing/) tool works from the duty. From the push and pull forces, the system pressure at the cylinder and the speeds and stroke, it gives the minimum bore for the push, the minimum rod diameter for Euler buckling at the buckling length and mounting factor you enter with your safety factor, the largest rod that still leaves enough annulus area for the pull, the flows, pump power and pipe bores. Its rod check uses the push force you enter, Euler's formula and a solid rod.

This is an illustration. Entering the cradle's duty, a push of 18 kN, a pull of 5 kN, 160 bar, a 63 mm bore, a buckling length of 2,150 mm, a mounting factor of 1.0, a safety factor on buckling of 3.5 and a rod modulus of 206 GPa, the tool reports a minimum bore of 37.8 mm for the push, a minimum rod of 41.3 mm for buckling, and a largest rod of 59.8 mm for the pull.

The stock cylinder's 36 mm rod is already too thin for the duty. Its Euler load on 2,150 mm is 36.3 kN, a factor of only 2.01 on the 18 kN push, well short of 3.5. A factor of 3.5 on rod buckling is a common choice in hydraulic practice because the rod also carries bending from its own weight, friction in its pins and any misalignment, none of which the Euler formula includes.

## The force the hydraulics can deliver

The duty is not the only force the rod will ever see. The relief valve on the shop's power unit is set at 160 bar. If the cradle jams, if a strap catches, or if someone stands the tank against an obstruction, the cylinder will push with whatever force the relief valve allows:

F = 16 MPa × π × 63² ÷ 4 = 49.9 kN

That is 2.8 times the duty force, and 1.4 times the Euler load of the 36 mm rod. At 116 bar the rod would reach its Euler load and buckle.

The BIZOMAT [Hydraulic cylinder structure](/tools/hydraulic-cylinder-structure/) tool checks a cylinder at its working pressure. From the bore, barrel wall, pressure and materials it checks the barrel by the thick-wall equations and the end cap as a clamped plate, and it checks the fully extended rod for buckling, by Euler or Johnson, under the full push force that the pressure produces on the bore. That last point is the important one: it uses the pressure, not a duty force.

```figure
type: compare
title: Cradle cylinder rods at the 160 bar relief setting, 2,150 mm pin centres, K = 1.0
cols: Slenderness | Mode | Buckling load, kN | Push at 160 bar, kN | Factor
rowhead: Rod diameter
- 36 mm, stock cylinder | 238.9 | Euler | 36.3 | 49.9 | 0.73
- 45 mm | 191.1 | Euler | 88.5 | 49.9 | 1.78
- 50 mm | 172.0 | Euler | 134.9 | 49.9 | 2.71
caption: This is an illustration. 63 mm bore, rod modulus 206 GPa, rod yield 500 MPa, required factor 3.5. Even a 50 mm rod, which leaves only a narrow annulus for the pull, falls short at the full relief pressure.
```

The structure tool reports the barrel as adequate (a von Mises stress of 79.7 MPa at the bore, a factor of 4.45 on 355 MPa yield, for a 7.5 mm wall) and the end cap as adequate, but the rod buckling factor at 160 bar as 0.73: the cylinder is not adequate.

## The error: sizing the rod for the job, not the hydraulics

This is an illustration. The stock cylinder had been chosen by matching its push at 160 bar, 49.9 kN, comfortably above the 18 kN duty, and checking nothing else. The person choosing it reasoned that a cylinder with plenty of force in hand would be safe. In fact, the extra force was the danger. The cylinder could push harder than its own rod could stand.

The error was found when the shop's engineer ran the structure tool as part of checking the cradle before its first use, and saw the rod buckling factor of 0.73. The fix had two parts, because no rod that fits a 63 mm bore can reach a factor of 3.5 at 160 bar.

```figure
type: steps
title: Making the cradle cylinder safe
caption: This is an illustration. The cradle circuit has its own relief valve, set at 70 bar, downstream of the power unit's 160 bar relief. The duty needs 57.7 bar at the start of the lift, so 70 bar leaves a 21% margin to start the lift.
- Pressure needed for the 18 kN duty | 18,000 ÷ (π × 63² ÷ 4) = 5.77 MPa, 57.7 bar
- Relief valve fitted in the cradle circuit | set at 70 bar
- Largest push the circuit can now deliver | 7 MPa × 3,117 mm² = 21.8 kN
- Rod changed to the 45 mm option for the same bore | Euler load 88.5 kN on 2,150 mm
- * Rod buckling factor at the cradle's relief setting | 88.5 ÷ 21.8 = 4.06, above 3.5
- Relief setting stamped on the cradle and sealed | so it cannot drift back to 160 bar
```

Limiting the pressure is not a way of avoiding the buckling check; it is the reason the check now passes. The cradle's documentation states the relief setting as a safety-critical value, and the annual inspection checks it with a gauge.

## Other things that bend a cylinder rod

The Euler check assumes the rod is straight and loaded through its axis. A working cylinder rarely is, and each departure acts like the crookedness and offsets of Chapter 5, amplified by the same factor 1 ÷ (1 − P ÷ P_E).

**Self-weight.** A cylinder lying near horizontal sags under its own weight. This is an illustration. The cradle's 45 mm rod weighs 12.5 kg/m. Treated as a simply supported beam over the 2,150 mm pin centres, its weight alone would sag it by about 0.8 mm at mid-length. At the cradle's maximum push of 21.8 kN, P ÷ P_E = 0.25, so the amplification factor is 1.33 and the sag becomes about 1.1 mm. That is small, but it is a real initial bow, and it is present every time the cylinder is extended near horizontal. The real cylinder is stiffer than this simple model, because the barrel carries much of the length, so the true figures are smaller still.

**Friction in the pins.** A pin joint is not frictionless. As the cradle rotates, friction in the clevis and the eye resists the rotation and puts a small bending moment into each end of the cylinder. Well-lubricated pins with spherical bearings keep this small; dry, worn or seized pins can make it large.

**Misalignment and side load.** A cylinder that is not quite in the plane of the mechanism, or whose rod end is pushed sideways by the load, takes bending that the rod's bearing and the piston must react. Rod bearings and seals wear quickly under side load, and a worn bearing lets the rod move off line, which adds to the offset. Makers fit stop tubes, spacers inside the barrel that keep the piston and the rod bearing apart at full extension, on long-stroke cylinders to reduce the bearing loads from exactly this effect.

None of these is large in a well-designed, well-maintained cradle, which is why a factor of about 3.5 on the Euler load is enough to cover them. A cylinder with seized pins or a worn rod bearing has lost part of that margin before any load is applied, and the annual inspection checks both.

## Screws in compression

A lead screw or ball screw that pushes a load is a strut whose section, for buckling, is its root diameter: the threads add little stiffness. Its effective length depends on how its bearings hold it: a screw with a fixed (paired, angular contact) bearing at one end and a simple support at the other is close to K = 0.7; with fixed bearings at both ends it approaches 0.5; with one end fixed and the nut end unsupported it is a flagpole, K = 2.0.

The BIZOMAT [Ball screw critical speed and buckling](/tools/ballscrew-limits/) tool checks a screw from its root diameter, unsupported length, end mounting, modulus and density against your maximum speed and maximum compressive load. It applies Euler's formula with K = 0.5, 0.7, 1.0 or 2.0 for the four mounting options, reports the buckling load and an allowed load at the share you choose, and also gives the screw's critical (whirling) speed, which is a separate limit: a spinning screw whirls like any other long, slender shaft. It treats the screw as a uniform shaft at its root diameter and ignores the stiffness of the nut and supports.

This is an illustration. A screw jack the shop uses to fine-level tanks on their stands has a 21 mm root diameter and 1,200 mm between its fixed bearing and its supported end. Its root section has I = π × 21⁴ ÷ 64 = 9,547 mm⁴, and with K = 0.7 its Euler load is π² × 206,000 × 9,547 ÷ (0.7 × 1,200)² = 27.5 kN. At the tool's default allowed share of 50%, the jack should not push more than about 13.8 kN at full extension. The same jack is good for much more when its nut is close to the fixed bearing, because the unsupported length is then shorter.

## Habits for rods in machines

```figure
type: checklist
title: Checking a rod or screw in compression
caption: The open item is the one the stock cylinder missed.
- Fully extended length used | the worst case for buckling
- Mounting and guidance give K | ask whether the rod end can move sideways
- ? Force from the relief valve or motor stall used, not just the duty | the machine will deliver it when something jams
- Safety factor of about 3.5 on Euler for hydraulic rods | covers bending from weight, pin friction and misalignment
- Screw root diameter used, not the outside diameter | threads add little stiffness
- Relief settings that protect a rod documented and sealed | treat them as safety-critical
```

## Exercise: a shorter cylinder

This is an illustration. The cradle's geometry could be changed so that a cylinder with pin centres of 1,700 mm extended does the job, keeping the 36 mm rod and the 160 bar supply with no extra relief valve.

1. What is the Euler load of the 36 mm rod on 1,700 mm with K = 1.0?
2. What is the factor at the 160 bar relief force of 49.9 kN?
3. Would the change alone make the cylinder acceptable?
4. What relief setting would give a factor of 3.5 for the 36 mm rod on the original 2,150 mm?

**Worked answer.**

1. I = π × 36⁴ ÷ 64 = 82,448 mm⁴. P_E = π² × 206,000 × 82,448 ÷ 1,700² = **58.0 kN**.
2. 58.0 ÷ 49.9 = **1.16**.
3. **No.** The shorter cylinder would not buckle at the relief force, but a factor of 1.16 leaves nothing for bending, pin friction or misalignment. The shop's required factor of 3.5 needs both a lower relief setting and, ideally, a stiffer rod.
4. On 2,150 mm the 36 mm rod's Euler load is 36.3 kN, so the push must not exceed 36.3 ÷ 3.5 = 10.4 kN, a pressure of 10,360 ÷ 3,117 = 3.32 MPa, or **33.2 bar**. That is well below the 57.7 bar the duty needs, so the 36 mm rod cannot do this job at the required factor on that length, whatever the relief setting.
