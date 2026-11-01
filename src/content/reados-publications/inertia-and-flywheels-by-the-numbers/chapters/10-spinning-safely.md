---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: spinning-safely
order: 10
title: "Spinning safely"
description: "How to check a rotating disc's stress, rim speed and speed margin, why a central hole doubles the stress, what an overspeed does, and how much energy a guard must contain if a rotor fails."
draft: false
---

Everything that turns pulls itself apart. Each particle of a rotating disc needs a force towards the centre to keep it on its circle, and the material supplies that force as tension. The tension grows with the square of the speed, so a modest overspeed raises it sharply, and a disc that is comfortable at its working speed has a definite speed at which it yields and, above that, bursts. A rotor that bursts releases the energy this book has been calculating, and it releases it as fragments.

This chapter checks the DL-3's three fast rotors, the saw blade, the chipper's disc and the new flywheel, with the WORKOS rotating disc stress and burst margin tool. It explains why the stress is highest at the bore, what an overspeed does to stress and rim speed, and how much energy the guards must be designed to contain. Its mistake is a drive frequency raised to speed up the chipper without rechecking the flywheel's rim speed.

## Stress in a rotating disc

In a flat disc of uniform thickness spinning at ω, the material carries two stresses: a hoop stress round the circumference and a radial stress outward. In a solid disc both are greatest at the centre, where they are equal. In a disc with a central hole, however small, the radial stress must fall to zero at the hole's edge, and the hoop stress there rises to about twice the solid disc's central stress. The bore is the most highly stressed point of a bored disc.

```figure
type: formula
title: Largest stress in a rotating flat disc
formula: Solid disc, at the centre: σ = (3 + ν) ÷ 8 × ρ ω² b²
formula: Disc with a bore, hoop stress at the bore: σ = (3 + ν) ÷ 4 × ρ ω² (b² + (1 − ν) ÷ (3 + ν) × a²)
formula: Thin ring: σ ≈ ρ v²
caption: b is the outer radius, a the bore radius, ρ the density, ν Poisson's ratio and v the rim speed. For a small bore the second formula gives about twice the first. Stress depends on ρ ω² b², which is ρ times the rim speed squared: rim speed, not diameter or speed alone, is the measure of how hard a rotor is working.
- (3 + ν) ÷ 8 | about 0.41 for steel
- (3 + ν) ÷ 4 | about 0.83 for steel
- ρ v² | the thin-ring limit, about 38 MPa at 70 m/s in steel
```

The [rotating disc stress and burst margin tool](/tools/rotating-disc/) takes the outside diameter, the bore diameter, or zero for a solid disc, the speed, the density, Poisson's ratio, the yield strength and a required safety factor. It returns the largest stress, at the centre or at the bore, the rim speed, the safety factor against yield and the speed at which yield would be reached, with a verdict on the safety factor. It treats a flat, uniform disc with no holes or blades, gives the elastic stress, and reminds the user that keyways, holes and slots raise the stress locally.

## The three rotors

```figure
type: compare
title: The DL-3's fast rotors in the rotating disc tool
cols: Size | Speed | Rim speed | Largest stress | Safety factor | Speed to yield
rowhead: Rotor
- Saw blade, steel, yield 1,000 MPa | 900 × 50 bore | 1,480 rpm | 69.7 m/s | 31.5 MPa | 31.7 | 8,336 rpm
- Chipper disc, steel, yield 250 MPa | 1,400 × 150 bore | 600 rpm | 44.0 m/s | 12.6 MPa | 19.9 | 2,677 rpm
- * Flywheel ring, steel, yield 250 MPa | 900 × 751 bore | 1,480 rpm | 69.7 m/s | 36.2 MPa | 6.9 | 3,892 rpm
caption: This is an illustration. Density 7,850 kg/m³, Poisson's ratio 0.3. The saw plate's yield strength is an illustration for a hardened saw steel. The flywheel works hardest: it has the saw's rim speed and nearly all its mass at the rim.
```

All three are far from yield at their working speeds. The flywheel works hardest, because it is nearly a thin ring running at the saw's rim speed: its stress of 36.2 MPa is close to the thin-ring estimate ρ v² = 7,850 × 69.7² = 38.2 MPa. The saw blade has the same rim speed but is a solid plate, which spreads the load, and the chipper's disc is slower.

### The hole doubles the stress

The saw blade with its 50 mm bore has a largest stress of 31.5 MPa at the bore. The same blade without a bore would have 15.8 MPa at the centre. A hole one-eighteenth of the blade's diameter doubles its peak stress, because the hoop stress at a free edge must carry what the radial stress carried in the solid plate. The same applies to the keyway at a hub's bore and to any hole near the axis; the tool's reminder about stress raisers is there because a keyway's corner adds a further concentration on top of the doubling.

## What the yield speed means and does not

The tool's speed to yield is the speed at which the largest elastic stress reaches the yield strength. For the flywheel it is 3,892 rpm, 2.6 times the working speed. Because stress goes with speed squared, the safety factor on stress, 6.9, is the square of the margin on speed: √6.9 = 2.6.

Yield at the bore is not burst. A ductile steel disc can yield locally at its bore and redistribute the load, and it bursts at a higher speed, which depends on its ductility and its tensile strength. A brittle material such as cast iron gives no such warning. For that reason, flywheel and rotor design uses a margin on stress, typically larger for brittle materials, together with a rim speed limit from the maker or from experience with that construction, as Chapter 9 did.

For a saw blade the stress check is a small part of the story. A circular saw blade's safe speed is set by its maker and marked on it, and it depends on the plate's tensioning, its vibration and the heat of cutting, not on the simple disc stress. The tool's figure of 31.5 MPa shows that the blade will not fly apart from centrifugal load alone at 1,480 rpm; it does not show that the blade can be run faster than its marked speed, and it must never be.

## Overspeed

A rotor runs faster than intended when a drive is reconfigured, a governor fails, a belt is changed for a different ratio, or a load is released suddenly from a machine whose drive was pushing hard. The stress rises with speed squared, and the rim speed with speed.

```figure
type: compare
title: The flywheel at 50 Hz and at 60 Hz
cols: Motor speed | Rim speed | Largest stress | Safety factor
rowhead: Supply frequency from the drive
- * 50 Hz | 1,480 rpm | 69.7 m/s | 36.2 MPa | 6.9
- 60 Hz | 1,776 rpm | 83.7 m/s: over 80 m/s | 52.1 MPa | 4.8
caption: This is an illustration. Steel ring 900 × 751 mm, yield 250 MPa. A 20% overspeed raises the stress by 44%. The safety factor is still above 4, but the rim speed passes the maker's 80 m/s limit.
```

At 60 Hz the flywheel's stress rises by 44%, to 52.1 MPa, and its safety factor falls to 4.8, still above the required 4. Its rim speed, 83.7 m/s, passes the maker's 80 m/s limit. The two checks give different answers because they protect against different things: the stress check against the ring yielding, the rim speed limit against everything else the maker knows about this construction, its welds, its web and its balance.

## Guarding against overspeed

Because overspeed raises stress so quickly, a rotor whose drive can push it past its limit needs protection that does not depend on someone remembering the limit. Three measures are common, and the DL-3 has used all three on the chipper since its variable-speed drive was fitted.

The first is in the drive. A variable-speed drive has a maximum frequency parameter, and the mill sets it to the lowest maximum speed of any rotor on that drive and locks it behind a password. The second is independent of the drive: a speed sensor on the shaft, wired to a relay that cuts the drive's power if the speed exceeds a set point a little above the working speed. It catches a wrongly set drive and a drive fault alike. The third is the label on each rotor and guard stating the rotor's maximum speed, which is what a fitter changing a pulley sees.

None of these replaces the check in the procedure below. They make a missed check less likely to become a burst.

## Fatigue at the bore

Each start and stop takes a rotor's stress from zero to its working value and back. Over years, those cycles accumulate. A rotor started twice an hour for sixteen hours a day, three hundred days a year, sees about 9,600 cycles a year. At the stresses in this chapter, a few tens of megapascals in steel, that is far below what causes fatigue in a smooth, sound disc.

Fatigue cracks start at stress raisers, not in smooth material: the corner of a keyway at the bore, a weld joining a web to a rim, a hole drilled for a balance weight. Each of those can multiply the local stress several times, and at the bore it multiplies a stress that is already the disc's highest. The mill's inspection schedule for the flywheel includes a crack test of the keyway, the web-to-rim weld and the hub at each major service, and a record of the number of starts since the last one.

## Coasting down

A rotor that has stored a large energy takes a long time to stop if nothing brakes it. With its added flywheel the chipper holds 923 kJ, and its air drag of about 150 N·m at the chipper's shaft would take 467.6 × 62.83 ÷ 150 = 196 s to bring it to rest: more than three minutes. For all that time the knives are turning, and the chute and the guard must stay closed. As for the docking saw in Chapter 3, the chipper's access doors are interlocked to a zero-speed signal, not to a timer, and its operating instruction tells operators to expect a long run-down.

## The energy a guard must contain

If a rotor fails, its kinetic energy goes into its fragments and whatever they hit. The DL-3's guards must be designed with those energies in mind.

```figure
type: bars
title: Kinetic energy of the DL-3's rotors at working speed
x: Rotor
y: Energy, kJ
caption: This is an illustration. Saw from Chapter 3; chipper disc and hub at 600 rpm; flywheel ring at 1,480 rpm. For comparison, a 1,500 kg car at 60 km/h has about 208 kJ.
- Saw blade, flanges, arbor and rotor | 26.1
- Chipper disc and hub | 439.6
- * Flywheel ring | 469.0
```

A ring that breaks into three pieces sends each away along the tangent at the speed of its centre of mass. For a thin ring, about two-thirds of the ring's energy is in that straight-line motion; for the DL-3's flywheel, each 76 kg fragment would leave at about 53 m/s with 106 kJ, 318 kJ for the three. The rest stays as the fragments' spin. A guard that contains such fragments is a substantial structure, and its design is specialist work; what the calculation contributes is the energy, the fragment mass and the speed that the designer must start from.

The model WHS laws require the risks of plant to be controlled, and guarding against contact and against ejected parts is among the main controls. The mill's guard for the flywheel was designed by the machine builder to contain a burst at the overspeed the drive can produce, and it carries a label stating the flywheel's maximum speed.

## The DL-3's rotors, from inertia to guard

The line's three fast rotors show the whole of this book in one place. Each started as a moment of inertia, worked out part by part in Chapters 1 and 2. Each set a torque to speed it up and slow it down, in Chapters 3 and 7, and the pusher's much smaller inertia set its servo, gearbox and duty cycle in Chapters 4 to 6. The chipper's inertia was found to be too small to carry its peaks, and a flywheel was added in Chapters 8 and 9, which in turn lengthened its start. And every one of them, at its working speed, holds an energy that its guard must contain and its brakes or drive must remove.

The numbers connect: change the flywheel's diameter and its rim speed, stress, start time and guard energy all change with it. The checklists at the end of each chapter are the mill's way of making sure that a change in one place is followed through to all the others.

## The mistake: a faster chipper and an unchecked flywheel

A year after commissioning, the mill fitted the variable-speed drive that Chapter 9 had set aside, to start the chipper more gently. Wanting more chipping capacity, it then set the drive to run at 60 Hz, a 20% increase in speed. The change was checked for the chipper's disc, whose stress rose from 12.6 to 18.1 MPa and whose rim speed rose to 52.8 m/s. It was not checked for the flywheel, because the flywheel had been added later and was not on the chipper's original drawing.

The flywheel's maintenance check found the label stating 1,480 rpm maximum on a ring now turning at 1,776 rpm. The rotating disc tool showed the stress still within the safety factor, which had reassured the person who first noticed, but the flywheel rim design tool's rim speed check, and the maker's limit on the label, showed it over its limit. The drive was returned to 50 Hz until a flywheel rated for the higher speed could be fitted. The mill's change procedure now lists every rotating part on each drive, with its speed limit, and requires each to be checked before a speed is raised.

```figure
type: checklist
title: Before running a rotor at a new speed
caption: The DL-3's change procedure. This is an illustration.
- x Every rotating part on the drive listed, including parts added after the original design
- x Each part's stress and safety factor at the new speed, with bore and keyway effects
- x Each part's rim speed against its maker's limit or marked maximum speed
- x Balance, natural frequencies and bearings checked at the new speed
- x Guard containment checked for the new energy
- x Labels updated with the new maximum speeds
```

## Exercise: a fan disc

**Problem.** A steel fan disc is 600 mm in diameter with a 40 mm bore and runs at 3,000 rpm. The steel's yield strength is 275 MPa, density 7,850 kg/m³ and Poisson's ratio 0.3; a safety factor of 3 is required. Find (a) the rim speed, (b) the largest stress, (c) the safety factor and the speed to yield, and (d) the stress if the disc were solid.

**Answer.** ω = 314.16 rad/s; b = 0.3 m; a = 0.02 m.

(a) Rim speed = 314.16 × 0.3 = 94.2 m/s.

(b) σ = 3.3 ÷ 4 × 7,850 × 314.16² × (0.09 + 0.7 ÷ 3.3 × 0.0004) = 57.6 MPa at the bore.

(c) Safety factor = 275 ÷ 57.6 = 4.78: adequate. Speed to yield = 3,000 × √4.78 = 6,556 rpm.

(d) Solid: σ = 3.3 ÷ 8 × 7,850 × 314.16² × 0.09 = 28.8 MPa at the centre: half the bored disc's stress.

**The check.** The rim speed of 94 m/s is higher than any DL-3 rotor, yet the disc's safety factor is comfortable. Stress depends on rim speed, density and the hole, and a fan's blades and their roots, which the flat-disc model leaves out, usually govern its design.
