---
book: whirling-shafts-by-the-numbers
chapterSlug: centrifugal-loads-on-discs-and-hammers
order: 8
title: "Centrifugal loads on discs and hammers"
description: "The loads that speed itself puts on a rotor: centrifugal force on hammers and pins, hoop stress in rotating discs, why both rise with the square of speed, and a mill run 20% fast on a drive."
draft: false
---

A rotor does not need any outside load to be highly stressed. Every part of it is pulled outwards by its own rotation, and the pull grows with the square of the speed. In a slow machine the effect is negligible. In a hammer mill, whose hammer tips travel at over 80 m/s, it is the largest load in the machine: each 0.75 kg hammer pulls on its pin with a force that would lift a small car.

This chapter calculates those loads for the HM-30 with two WORKOS tools: the centrifugal force on the hammers and the stress in the rotating discs that carry them. It then describes a customer who ran a 50 Hz mill at 60 Hz on a variable-speed drive, and what a 20% increase in speed did.

## Centrifugal force

A mass m travelling in a circle of radius r at angular speed ω needs an inward force m × ω² × r to keep it on its circle. Whatever holds it, a pin, a bolt, a weld or the material of a disc, supplies that force, and feels an equal outward pull.

```figure
type: formula
title: Centrifugal force and acceleration
formula: F = m × ω² × r, with ω = 2πn ÷ 60
formula: Acceleration in multiples of gravity: ω² × r ÷ g
formula: Speed of the mass: v = ω × r
caption: Doubling the speed quadruples the force. A 20% increase in speed raises it by 44%.
- m | mass, kg
- r | radius to the mass's centre of gravity, m
- n | speed, rpm
```

The WORKOS [Centrifugal force on a rotating mass](/tools/centrifugal-force/) tool gives the force, the acceleration in g and the tangential speed of a mass at a radius and speed, for checking clamps, counterweights and attachments. It treats the mass as a rigid body at a steady speed, and its check reminds the user to compare the force with the holding capacity of whatever retains the mass.

### HM-30's hammers

This is an illustration. Each of the HM-30's hammers is a flat steel bar 0.75 kg in mass, 6 mm thick and 50 mm wide, hanging on a 25 mm pin through a 28 mm hole. At speed it stands straight out, with its centre of gravity 230 mm from the axis.

```figure
type: steps
title: One HM-30 hammer at 2,950 rpm in the centrifugal force tool
caption: This is an illustration. Mass 0.75 kg, radius 230 mm, 2,950 rpm.
- Angular speed | 2π × 2,950 ÷ 60 = 308.9 rad/s
- * Centrifugal force | 0.75 × 308.9² × 0.230 = 16,462 N, about 16.5 kN
- Acceleration | 2,238 g
- Speed of the hammer's centre of gravity | 71.1 m/s
```

A hammer of three-quarters of a kilogram pulls on its pin with 16.5 kN, the weight of about 1.7 tonnes. With twelve hammers on each pin, each pin carries 197.5 kN of outward pull, and the four pins together carry nearly 800 kN, all of it reacted by the discs. The forces balance across the rotor, which is why the shaft does not feel them, but every part in the load path does.

```figure
type: compare
title: Stresses in the hammer load path at 2,950 rpm
cols: Load | Area resisting it | Stress, MPa
rowhead: Part
- Hammer, across its section beside the pin hole | 16.5 kN | (50 − 28) × 6 = 132 mm² | 125
- Pin, in double shear at each hammer | 16.5 kN, half on each shear plane | π × 25² ÷ 4 = 491 mm² per plane | 16.8
- * Disc, bearing on the pin hole | 197.5 kN per pin shared by 7 discs: 28.2 kN | 28 × 12 = 336 mm² projected | 84
caption: This is an illustration. Simple average stresses with no allowance for stress concentration, impact or wear. The hammer's section at its hole, a stress raiser, is the most highly stressed point and the one that wears.
```

The same force is what makes a swinging hammer work. At rest a hammer hangs limply on its pin; at speed, the centrifugal pull makes it as stiff radially as if it were bolted rigidly in place, so it strikes the grain with its full momentum. When it meets something it cannot break, a stone or a bolt, it can swing back on its pin, giving way instead of passing the whole shock into the pin and shaft, and the centrifugal pull then swings it back out. A hammer that is seized on its pin by rust or packed meal loses that relief, which is one more reason the maintenance manual asks for the pins and hammers to be cleaned and checked for free swing at every change.

The hammer's net section beside its hole carries 125 MPa on average, and the edge of a hole roughly triples the local stress. Each start and stop cycles that stress, and each impact on grain adds a small cycle on top. As the hole wears oval and the ligament of steel beyond it thins, the stress rises. That is exactly where Chapter 5's hammer broke.

## Stress in a rotating disc

A disc spinning about its centre is stressed by its own mass. Each ring of material is pulled outwards by centrifugal force and held in by the ring inside it, so the disc carries a hoop (circumferential) stress and a radial stress throughout. For a flat disc of uniform thickness, the classical elastic solution gives the maximum stress:

```figure
type: formula
title: Maximum stress in a flat rotating disc
formula: Solid disc, at the centre: σ_max = ((3 + ν) ÷ 8) × ρ × ω² × b²
formula: Disc with a central bore, hoop stress at the bore: σ_max = ((3 + ν) ÷ 4) × ρ × ω² × (b² + ((1 − ν) ÷ (3 + ν)) × a²)
caption: A bore, however small, roughly doubles the maximum stress compared with a solid disc, because the hoop stress at the edge of a hole is about twice the stress at the centre of a solid disc. Stress rises with the square of both speed and outside radius: with the square of rim speed.
- ρ | density, kg/m³
- ω | angular speed, rad/s
- b | outside radius, m
- a | bore radius, m
- ν | Poisson's ratio, about 0.3 for steel
```

The WORKOS [Rotating disc stress and burst margin](/tools/rotating-disc/) tool applies these formulas to a flat, uniform disc, solid or bored. From the outside and bore diameters, speed, density, Poisson's ratio and yield strength, it reports the maximum stress and where it is, the rim speed, the factor of safety against yield and the speed at which yield would be reached. Its guide notes that holes, keyways and blades add stress concentrations that it does not include, and that the burst margin of a ductile disc above yield depends on its ductility.

This is an illustration. The HM-30's discs are 520 mm in outside diameter with a 90 mm bore, in steel with a 250 MPa yield. At 2,950 rpm the tool gives a hoop stress at the bore of 42.0 MPa, a rim speed of 80.3 m/s, a factor of 5.95 against yield, and a speed of 7,193 rpm at which the bore would reach yield.

The disc's simple stress is modest. The real disc, though, is not a plain disc: it has four 28 mm pin holes near its rim, each loaded by 28.2 kN of hammer pull, and a keyway at its bore. The pin holes are where the disc's stresses concentrate, and the maker checks them separately with a finite element model of one disc segment. The tool's answer is the background stress on which those local effects sit, and its factor of 5.95 shows how much room there is for them.

## Rim speed sets the stress

The disc formula hides a useful simplification. Since ω × b is the rim speed v, the stress in a solid disc is ((3 + ν) ÷ 8) × ρ × v², and a bored disc's is roughly twice that. For a given material, the stress in a disc depends on its rim speed and almost nothing else: a small disc spinning fast and a large disc spinning slowly, with the same rim speed, are stressed alike.

That matters for a hammer mill, because the grinding depends on the speed at which the hammers strike the grain, the tip speed. The HM-30's hammer tips sweep a 560 mm circle at 2,950 rpm, a tip speed of 86.5 m/s. A designer who wanted the same tip speed could use a larger rotor at a lower speed, or a smaller rotor at a higher speed. The disc stresses would be about the same either way, but the hammer forces would not: the pull on a hammer of given mass at a given tip speed is m × v² ÷ r, so a larger rotor pulls less hard on each gram of hammer. The larger, slower rotor would also be heavier and have more inertia, a slower start (Chapter 10) and larger gyroscopic loads (Chapter 9), and its critical speed would need checking again. Every choice in a rotor's size trades one of these against the others.

## Pins, retention and wear

The pins themselves are rotating masses. This is an illustration. Each 25 mm pin, 700 mm long, weighs 2.7 kg and pulls outwards with about 59 kN of its own at 2,950 rpm, in addition to the 197.5 kN its hammers hang on it. The pins are carried by the discs and do not need to be retained radially; but they must be held axially, by end collars or plates, because a pin that walks out of the disc pack releases twelve hammers and its own mass at once. Pin retention is checked at every hammer change, and the HM-30's end plates are bolted, not tack-welded, so that they can be inspected and refitted properly.

Wear changes all of these loads. A hammer hole that wears oval lets the hammer sit further out and thins the steel around the hole; a pin worn into a waist is weaker in shear and bending; and a disc hole worn by the pin loads the disc unevenly. The HM-30's maintenance manual sets wear limits for each: a maximum hole size in the hammers, a minimum pin diameter at its most worn point, and a maximum disc hole size. They are measured at every hammer change, because each one is a step along the path from a worn part to a thrown one.

## Speed is the multiplier

Every load in this chapter grows with the square of the speed. A small change in speed is therefore a large change in load.

```figure
type: compare
title: HM-30 rotor loads at 50 Hz and 60 Hz speeds
cols: 2,950 rpm | 3,550 rpm | Increase
rowhead: Quantity
- Hammer pull on its pin | 16.5 kN | 23.8 kN | 45%
- Hammer net-section stress | 125 MPa | 181 MPa | 45%
- Disc bearing stress at the pin hole | 84 MPa | 122 MPa | 45%
- Disc hoop stress at the bore | 42.0 MPa | 60.9 MPa | 45%
- * Running speed as a share of the 90 mm shaft's critical speed | 72.3% | 87.0% | into the near-critical band
caption: This is an illustration. The export variant has a 100 mm shaft (Chapter 2), heavier pins and thicker hammers designed for 3,550 rpm. The 50 Hz rotor was never designed to run at 3,550 rpm.
```

### What limits the speed in service

On its standard direct drive, the HM-30 cannot overspeed. A two-pole induction motor on a 50 Hz supply cannot run faster than its synchronous speed of 3,000 rpm, and with load it runs at about 2,950 rpm. The rotor's design speed is protected by the physics of the motor. That protection disappears in three common situations: a variable-speed drive, whose output frequency can be set to anything; a belt drive, where a wrong pulley ratio can raise the rotor speed; and an engine drive, where a governor fault can let the speed run away. Machines that can be driven in any of these ways need the rotor's maximum safe speed stated on the nameplate and protected by a setting, a guard or a trip, not left to the operator's good sense.

High-speed rotors whose failure would be catastrophic, such as centrifuges and turbine discs, are proved by spinning them above their maximum service speed in an armoured test pit. A hammer mill rotor is not usually tested that way, which makes the design margin and the speed limit all the more important.

## The error: a mill run at 60 Hz

This is an illustration. A feed mill bought a 50 Hz HM-30 and, wanting more throughput, had its electrician fit a variable-speed drive and set its maximum frequency to 60 Hz. The motor would run happily at 3,550 rpm; nobody asked whether the rotor would.

Within a month, the mill's vibration had roughly doubled, the hammer pins were wearing visibly faster, and two hammers had cracked at their holes. The maker's service technician, called out to rebalance the rotor, read the drive's settings before touching the rotor.

The diagnosis took three numbers. At 3,550 rpm, every hammer was pulling 45% harder on its pin than it was designed to, which explained the pin wear and the cracked hammers. The disc stresses were up by the same 45%. And the rotor, with its 90 mm production shaft, was running at 87% of its critical speed instead of 72%, deep in the band where Chapter 1 showed its unbalance would be amplified about three times instead of about once. Rebalancing would have treated the symptom and left all three causes in place.

```figure
type: checklist
title: Before running any rotor faster than its nameplate speed
caption: The open item is the one the electrician could not have known to check: a drive's maximum frequency is a mechanical setting as well as an electrical one.
- Centrifugal loads on attachments rechecked | they rise with the square of speed
- Disc and rim stresses rechecked | the same
- ? Critical speed margin rechecked at the new speed | Chapters 2 and 4
- Balance grade tolerance recalculated | Chapter 5
- Bearings, seals and couplings rated for the new speed | maker's data
- Maker's written approval obtained | the nameplate speed is a design limit
```

The drive's maximum frequency was reset to 50 Hz and locked with a password, the cracked hammers and worn pins were replaced with a new weighed set, and the rotor was rebalanced. The maker added a nameplate warning, "Maximum speed 2,950 rpm: do not run above 50 Hz on a variable-speed drive", and offered the customer the export rotor, designed for 3,550 rpm, as an upgrade.

## Exercise: the export rotor's disc

This is an illustration. The export variant's discs keep their 520 mm outside diameter but have a 100 mm bore to suit the 100 mm shaft, and run at 3,550 rpm.

1. Using the rotating disc tool's formula, what is the hoop stress at the bore?
2. What is the factor of safety against a 250 MPa yield?
3. By how much has the larger bore changed the stress compared with a 90 mm bore at the same speed, and why so little?
4. What is the pull of one 0.75 kg hammer at 230 mm at 3,550 rpm, and what does that mean for the export rotor's hammers and pins?

**Worked answer.**

1. ω = 2π × 3,550 ÷ 60 = 371.8 rad/s; b = 0.26 m, a = 0.05 m. σ = (3.3 ÷ 4) × 7,850 × 371.8² × (0.26² + (0.7 ÷ 3.3) × 0.05²) = **61.0 MPa**.
2. 250 ÷ 61.0 = **4.10**.
3. From 60.9 to 61.0 MPa, about **0.2%**. The bore term is multiplied by (1 − ν) ÷ (3 + ν) = 0.21 and by the small bore radius squared, so for a small bore the outside radius dominates; it is the existence of the bore, not its exact size, that doubles the stress over a solid disc.
4. F = 0.75 × 371.8² × 0.23 = **23.8 kN**, 45% more than at 2,950 rpm. The export rotor's hammers and pins must be designed for that: thicker hammers with more steel around the hole, larger pins, and a wear limit on the hole that is reached sooner. The 50 Hz parts are not interchangeable with the export rotor's, and the parts lists keep them apart.
