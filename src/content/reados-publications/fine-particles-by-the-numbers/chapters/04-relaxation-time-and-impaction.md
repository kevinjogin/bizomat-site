---
book: fine-particles-by-the-numbers
chapterSlug: relaxation-time-and-impaction
order: 4
title: "Relaxation time, stopping distance and impaction"
description: "Use Langevin's friction time to find how quickly LX-3's particles adjust to the air, how far spatter flies, and which particles a duct bend or spark trap will throw against a wall."
draft: false
---

The question that decides most of what happens to a particle in an extraction system is whether it follows the air. Air turns corners, squeezes between filter fibres and swirls in a spark trap; a particle that can change direction as quickly as the air goes with it, and one that cannot carries straight on and hits whatever is in the way. The time a particle takes to respond to a change in the air's motion is its **relaxation time**, and comparing it with the time the air takes to turn gives a single number, the **Stokes number**, that predicts impaction.

This chapter derives the relaxation time from the same equation of motion Paul Langevin wrote down for Brownian particles in 1908, tabulates it for LX-3's particles, calculates how far spatter travels from the kerf, and uses the Stokes number to predict which particles impact on LX-3's duct bends and spark trap. The failure case is a spark trap that turned the air too gently to catch the spatter it was meant to stop.

## Langevin's equation and the relaxation time

Langevin's starting point, which the supplied lecture notes take up in their treatment of the Ornstein–Uhlenbeck theory, was Newton's second law for a particle in a fluid, with two forces: a **friction** force proportional to the particle's velocity relative to the fluid, and a rapidly **fluctuating** force from molecular impacts. Leaving the fluctuating force aside until Chapter 5, the friction force is the slip-corrected Stokes drag, 3π μ d V ÷ C_c, and Newton's law becomes m dV/dt = −3π μ d V ÷ C_c.

That equation says the particle's velocity relative to the air decays exponentially, with a time constant equal to the particle's mass divided by its friction coefficient. Substituting the mass of a sphere gives the relaxation time.

```figure
type: formula
title: Relaxation time of a small sphere
formula: τ = m C_c ÷ (3π μ d) = ρp d² C_c ÷ (18 μ)
caption: This is an illustration for LX-3's oxide particles at 5,000 kg/m³ in air at 20 °C, including slip. In Langevin's notation the friction per unit mass is β, and τ = 1 ÷ β. The settling velocity of Chapter 2 is simply g × τ.
- 0.1 µm, C_c ≈ 2.854 | about 4.38 × 10⁻⁷ s
- 1 µm, C_c ≈ 1.163 | about 1.79 × 10⁻⁵ s
- 10 µm, C_c ≈ 1.016 | about 1.56 × 10⁻³ s
- 30 µm | about 1.39 × 10⁻² s
- 100 µm, corrected for Reynolds number | about 0.1 s
step: Relaxation time, like settling velocity, grows with the square of the diameter
```

Langevin's friction term is the same physical quantity that governs Brownian motion. A particle with a short relaxation time is tightly coupled to the air: it loses any velocity of its own almost at once, and it is jostled by the air's molecules into a random wander that Chapter 5 calculates. A particle with a long relaxation time is loosely coupled: it carries its own momentum through turns in the air, and it barely notices molecular jostling. One number, τ, therefore tells both whether a particle impacts and whether it diffuses, and the two behaviours sit at opposite ends of the size range.

The link with settling is exact: in the Stokes regime, the settling velocity is the relaxation time times g. A particle falling under gravity reaches its terminal velocity after a few relaxation times; a particle thrown into still air slows to a stop over a few relaxation times; a particle in air that suddenly changes velocity catches up over a few relaxation times. For LX-3's fume, those few relaxation times are a few microseconds: as far as the fume is concerned, the air's motion is always slow, and the fume follows it exactly.

## Stopping distance

A particle thrown into still air with speed V₀ slows under drag and stops after travelling a **stopping distance**. In the Stokes regime, the stopping distance is simply **V₀ × τ**. For particles thrown fast enough that their Reynolds number is well above 1, the extra inertial drag shortens the distance, and it has to be found by stepping the motion through time with a drag correlation such as the one in Chapter 2.

```figure
type: compare
title: How far LX-3's particles travel when thrown into still air
cols: Initial speed and Reynolds number | Stokes estimate | With inertial drag
caption: This is an illustration. The spatter estimates are made by integrating the motion with the Schiller–Naumann drag correlation. Stokes' law triples the 100 µm spatter's range, which matters for guarding and for where it lands in the plenum.
- *100 µm spatter | 20 m/s, Re ≈ 133 | about 3.1 m | about 1.0 m
- 30 µm spatter | 20 m/s, Re ≈ 40 | about 0.28 m | about 0.14 m
- 10 µm dust | 5 m/s, Re ≈ 3.3 | about 7.7 mm | about 6.4 mm
- 1 µm dust | 5 m/s, Re ≈ 0.3 | about 0.08 mm | about 0.07 mm
```

The table shows two things. First, the 100 µm spatter thrown down from the kerf by the assist gas carries about a metre before the air stops it, which, under a table with a plenum about 0.3 m deep, means it strikes the slats, the plenum walls and the slag trays rather than being carried by the extraction air. That is why the slag trays fill with spatter and why the plenum is lined with replaceable steel. Second, anything of 10 µm or smaller stops within millimetres and is then carried wherever the air goes. Only the spatter has a mind of its own.

### Particles that escape the downdraught

Stopping distance also explains why some particles escape a downdraught table. Most of the kerf's output is driven downwards by the assist gas, into the extraction. But when the beam pierces the sheet at the start of a cut, before it breaks through, molten material is blown upwards and sideways from the top surface. A 30 µm droplet thrown sideways at 20 m/s travels about 0.14 m before the air stops it; near the edge of a sheet, or near the edge of the active extraction zone, that is enough to carry it out of the region where the downdraught can recapture it. Once it has stopped, its settling velocity of about 0.13 m/s (Chapter 2) brings it down within seconds, onto the sheet, the machine or the floor.

The fine dust and fume released at the same moment are different. They stop within millimetres, so they are where the air is, and whether they are captured depends only on whether the air at that point is moving into the extraction. Near the edges of a large table, or above a sheet that covers most of the open slats, the downdraught can be weak, and fume released there drifts upwards on the warm air from the cut. LX-3's zoned plenums open only the zone under the cutting head, concentrating the full 0.60 m³/s where the fume is made, and a light enclosure around the machine catches what escapes. The particle mechanics show why each measure targets a different family: guards and the enclosure for spatter, airflow at the source for fume.

## The Stokes number

When air flows around an obstacle, a bend, a baffle or a fibre, it turns over a distance comparable with the obstacle's size, L, in a time of about L ÷ U, where U is the air's speed. A particle that cannot change direction in that time keeps going and strikes the obstacle. The ratio of the particle's relaxation time to the air's turning time is the **Stokes number**: **Stk = τ U ÷ L**.

- When Stk is much less than 1, the particle follows the air around the obstacle.
- When Stk is around 1, some particles impact and some follow.
- When Stk is much greater than 1, the particle barely notices the turn and impacts.

The exact fraction that impacts for a given Stokes number depends on the geometry, and is found from tests or detailed calculation; impactors used for sampling are designed and calibrated around a particular Stokes number at which half the particles are captured. For a first estimate, the Stokes number tells which particle sizes are at risk of impacting and which are not.

### LX-3's duct bends

LX-3's 200 mm duct carries air at about 19.1 m/s. Taking the duct diameter as the turning length at a bend, the Stokes numbers are:

```figure
type: bars
title: Stokes number at LX-3's 200 mm duct bends, air at 19.1 m/s
unit: Stk
max: 10
caption: This is an illustration. Particles of 1 µm and smaller have Stokes numbers below 0.002 and follow the bend; 10 µm dust is starting to be affected; 30 µm and larger particles strike the outside of the bend. That is where duct wear and build-up occur.
- 1 µm | 0.0017
- 10 µm | 0.149
- 30 µm | 1.33
- *100 µm | 9.5
```

The coarse particles that reach the duct, mainly dust of 10 to 30 µm and any spatter that escaped the plenum, impact the outside wall of each bend. In abrasive service that is where the duct wears through; in sticky service it is where build-up starts. LX-3's bends are long-radius, made from heavier-gauge steel than the straight duct, and fitted with inspection doors at their outer walls.

## Using impaction: the spark trap

Impaction is not always a problem. LX-3's spark trap is a box ahead of the filters in which the air passes through a series of baffles, turning sharply around each. Inside the box the air slows to about **5 m/s** and turns through gaps about **0.1 m** wide.

At those conditions, a 100 µm spark has a Stokes number of about **0.0996 × 5 ÷ 0.1 ≈ 5.0** and strikes the first baffle, where it cools and drops into the collection tray. A 30 µm particle has a Stokes number of about **0.7**, so many of them are caught too. A 10 µm particle has a Stokes number of about **0.08** and mostly passes through, and the fume has a Stokes number in the millionths and passes straight through, as it should, to the filters designed for it.

The spark trap's job is to stop hot, heavy particles setting the filter media alight, and the Stokes number shows it does exactly that while costing little pressure drop for the fine particles. The same reasoning explains every inertial separator, from a simple baffle box to a cyclone.

### The Stokes number in a filter and a sampling probe

The same number reappears at the smallest scale. A filter fibre a few micrometres across, with air approaching at a few centimetres a second, turns the air over a distance of the order of the fibre's diameter. A 1 µm particle, with a relaxation time of about 1.8 × 10⁻⁵ s, approaching a 10 µm fibre at 0.05 m/s, has a Stokes number of about **1.8 × 10⁻⁵ × 0.05 ÷ 10 × 10⁻⁶ ≈ 0.09**, small enough that most such particles follow the air around the fibre, while larger dust particles impact. Chapter 6 shows that impaction is therefore one of the mechanisms by which filters catch coarse particles, and why it fails for the sub-micron fume.

It reappears again at the inlet of a sampling probe. If air enters a probe at a different speed from the duct air around it, the streamlines bend at the probe's mouth, and particles with a significant Stokes number do not follow them. Too slow an inlet and coarse particles are over-sampled; too fast and they are under-sampled. Chapter 8 deals with this as **isokinetic** sampling. For fume, with Stokes numbers in the millionths, it hardly matters; for dust, it can change the measured concentration several-fold.

## A failure case: the gentle spark trap

This is an illustration. On an earlier cutting table, a spark trap was made as a large, open box with a single gentle baffle, designed by eye to slow the air down "so the sparks drop out". The air slowed to about 2 m/s and turned through a gap about 0.4 m wide.

Within months the filter cartridges showed burn holes, and one smouldered after a long cutting run. The detection came from the burn holes found at a routine filter inspection. The Stokes number explained them: for a 100 µm spark, τ U ÷ L was about **0.1 × 2 ÷ 0.4 ≈ 0.5**, so a large fraction of the sparks followed the gentle turn and reached the filters, and slowing the air further would only have made it worse. Settling alone, at about 1 m/s for a 100 µm spark, was not enough in a box only 0.4 m deep with air passing at 2 m/s and a short residence time.

The correction was a baffled trap with narrower gaps and higher local velocity, giving a Stokes number of about 5 for 100 µm sparks, plus a fine metal mesh screen ahead of the filters. The shop's design sheet now calculates the Stokes number for the smallest spark size it intends to stop, and aims for well above 1.

## How this applies to a small Australian business

Calculate each particle size's relaxation time, including slip, and remember that settling velocity is g times τ. Use the stopping distance to see how far spatter flies, with a drag correlation when the particle's Reynolds number is high. Use the Stokes number, τ U ÷ L, to predict which particles impact at bends, baffles and fibres. Design spark traps and other inertial separators for a Stokes number well above 1 at the smallest particle to be caught, and expect fine particles to follow the air regardless.

## Exercise: an elbow in a smaller duct

A branch duct of 100 mm diameter carries air at 20 m/s from a grinding hood. For 10 µm particles with a relaxation time of 1.56 × 10⁻³ s, what is the Stokes number at an elbow, taking the duct diameter as the turning length? How does it compare with the same particles in LX-3's 200 mm duct at 19.1 m/s? What does that suggest about where wear will occur?

**Worked answer.** In the 100 mm duct, **Stk = 1.56 × 10⁻³ × 20 ÷ 0.1 ≈ 0.31**. In LX-3's 200 mm duct it was about **0.149**. Halving the duct diameter at a similar velocity roughly doubles the Stokes number, so 10 µm particles are much more likely to strike the outside of the small branch's elbows than the main duct's. The branch elbows, not the main, will wear and build up first, and are the places to use long-radius bends and heavier material.
