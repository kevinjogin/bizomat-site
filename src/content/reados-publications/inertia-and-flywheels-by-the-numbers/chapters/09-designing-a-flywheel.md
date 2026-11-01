---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: designing-a-flywheel
order: 9
title: "Designing a flywheel"
description: "How to size a flywheel rim from an energy fluctuation and speed variation: inertia, bore, mass, rim speed and rotating stress, and the effect of putting it on the fast or slow shaft."
draft: false
---

Chapter 8 found that the DL-3 chipper needs about 237.6 kg·m² more inertia, seen from its own shaft, to keep its speed above 570 rpm through a large offcut. This chapter designs the flywheel that supplies it. The design starts from the energy the flywheel must give up and the speed variation allowed, finds the inertia, chooses an outer diameter and width, and works back to the bore, the mass, the rim speed and the stress. It then checks what the larger rotor does to the motor's start.

The chapter uses the WORKOS flywheel rim design tool, compares a flywheel on the motor's shaft with one on the chipper's, and steel with cast iron. Its mistake is a cast-iron flywheel chosen from a catalogue for a shaft too fast for it.

## The energy the flywheel must supply

The large offcut leaves a deficit of 90 kJ. The existing rotating system, the disc, hub and motor rotor, supplies 44.27 kJ as it slows from 600 to 570 rpm. The added flywheel must supply the other 45.73 kJ within the same speed range.

If it goes on the motor's shaft, that range is 1,480 to 1,406 rpm, because the belt ratio of 2.467 scales both ends. The mean is 1,443 rpm and the coefficient of speed fluctuation is the same as at the chipper, 74 ÷ 1,443 = 0.0513. The inertia needed is ΔE ÷ (ωm² Cs) = 45,730 ÷ (151.11² × 0.0513) = 39.05 kg·m². Seen from the chipper, that is 39.05 × 2.467² = 237.6 kg·m², which closes the gap.

## The flywheel rim design tool

The [flywheel rim design tool](/tools/flywheel-rim-design/) takes the energy fluctuation per cycle, the mean speed, the coefficient of speed fluctuation, the outer diameter and axial width of the flywheel, the material's density, Poisson's ratio and strength, a required safety factor and the largest rim speed allowed. It finds the inertia needed, then the inner diameter that gives that inertia for a plain annular disc of the chosen outer diameter and width, the mass, a check of the energy between the resulting top and bottom speeds, the speed range, the rim speed at the top speed, and the largest stress of the rotating disc at the top speed, with checks on stress and rim speed and a reminder about guarding and the hub's fixing. It models the flywheel as a plain annulus; spoked and webbed flywheels have different inertia and stress, and the hub, keys and bolts need their own checks.

```figure
type: steps
title: A steel flywheel on the chipper motor's shaft
caption: This is an illustration. Energy 45.73 kJ, mean 1,443 rpm, Cs 0.0513; outer diameter 900 mm, width 150 mm; steel, 7,850 kg/m³, Poisson's ratio 0.3, yield 250 MPa; safety factor 4; rim speed limit 80 m/s.
- Inertia needed | 39.05 kg·m²
- Inner diameter for that inertia | 751 mm
- Mass | 227.3 kg
- Speed range | 1,406 to 1,480 rpm
- Rim speed at top speed | 69.7 m/s
- * Largest rotating stress | 36.2 MPa
- Safety factor | 6.9: FLYWHEEL ADEQUATE
```

The result is a steel ring 900 mm outside, 751 mm inside and 150 mm wide, weighing 227 kg. Its largest stress, the hoop stress at the bore, is 36.2 MPa, a safety factor of 6.9 on the steel's yield. Its rim runs at 69.7 m/s, within the 80 m/s that the flywheel's maker allows for a steel ring of this construction, an illustration. The ring must be joined to a hub on the motor's shaft by a web, which the tool does not model; the web adds a little inertia and must carry the torques discussed below.

### Choosing the outer diameter

For the same inertia, a larger outer diameter needs less mass, because inertia grows with the fourth power of the radius for a given width, but its rim runs faster and its stress is higher. A smaller diameter keeps the rim slower and the stress lower, at the cost of mass.

```figure
type: compare
title: Three steel flywheels of 39.05 kg·m² on the motor's shaft
cols: Width | Bore | Mass | Rim speed | Stress | Safety factor
rowhead: Outer diameter
- 800 mm | 150 mm | 517.6 mm | 344.1 kg | 62.0 m/s | 27.1 MPa | 9.2
- * 900 mm | 150 mm | 751.1 mm | 227.3 kg | 69.7 m/s | 36.2 MPa | 6.9
- 1,000 mm | 100 mm | 838.1 mm | 183.5 kg | 77.5 m/s | 44.7 MPa | 5.6
caption: This is an illustration. Steel, yield 250 MPa, 1,406 to 1,480 rpm. The 1,000 mm option saves 44 kg but brings the rim within 3 m/s of the 80 m/s limit; the 800 mm option is safest and heaviest. The mill chose 900 mm.
```

## The fast shaft or the slow shaft

The same 45.73 kJ could be stored on the chipper's own shaft, at 585 rpm mean. There the flywheel needs 237.6 kg·m², six times as much. A steel ring 1,400 mm outside and 100 mm wide would need a bore of 933 mm and weigh 671 kg, nearly three times the motor-shaft flywheel, but its rim would run at only 44 m/s and its stress would be 13.7 MPa.

```figure
type: compare
title: The added flywheel on each shaft
cols: Inertia needed | Size | Mass | Rim speed | Safety factor
rowhead: Shaft
- * Motor, 1,480 rpm | 39.05 kg·m² | 900 × 751 × 150 mm | 227 kg | 69.7 m/s | 6.9
- Chipper, 600 rpm | 237.6 kg·m² | 1,400 × 933 × 100 mm | 671 kg | 44.0 m/s | 18.2
caption: This is an illustration. Steel, yield 250 MPa, same energy and speed variation. Inertia on the faster shaft counts by the belt ratio squared, so it needs a sixth of the inertia and about a third of the mass, but runs faster and carries its energy through the belt.
```

The mill chose the motor's shaft. The smaller flywheel fits within the existing guard, and the motor's shaft already carries a coupling that can be extended. The price, as Chapter 8 noted, is that the belt now carries the flywheel's share of each peak, about 114 kW for 1.2 s, and the belt drive was checked for it.

## Steel or cast iron

Flywheels have traditionally been cast iron: cheap, easy to cast with spokes and a heavy rim, and dense. Cast iron is weak in tension and brittle, and its flywheels are limited to modest rim speeds; the mill's design figure for cast iron was 30 m/s, an illustration, against 80 m/s for the steel ring.

```figure
type: steps
title: The same flywheel in cast iron, in the flywheel rim design tool
caption: This is an illustration. As above, but cast iron at 7,200 kg/m³, Poisson's ratio 0.26, tensile strength 150 MPa, safety factor 5, rim speed limit 30 m/s.
- Inertia needed | 39.05 kg·m²
- Inner diameter | 732 mm
- Mass | 232.0 kg
- Rim speed at top speed | 69.7 m/s: over 30 m/s
- * Largest rotating stress | 32.8 MPa
- Safety factor | 4.6: below 5. FLYWHEEL NOT ADEQUATE
```

A cast-iron ring of the same size fails on both counts: its rim speed is more than twice its limit, and its safety factor on tensile strength is below the 5 required for a brittle material. At the motor's speed, a cast-iron flywheel would have to be much smaller in diameter, and therefore much heavier, to keep its rim below 30 m/s.

## What the plain annulus leaves out

The tool's model is a flat ring of uniform width, which is a fair description of the rim and nothing else. A real flywheel joins its rim to a hub, either with a thin web or with spokes, and both change the result a little.

A web adds inertia, mostly near the rim, so a flywheel with a web needs a slightly larger bore, or a slightly narrower rim, than the annulus calculation gives; the design is then rechecked with the web's mass included. A web also restrains the rim: the rim would like to grow outward under its own centrifugal load, the web holds it back, and the joint between them carries a local bending stress that a uniform-disc formula does not show. Spoked flywheels add bending in the rim between spokes. For a flywheel running at rim speeds like the DL-3's, the mill's practice is to have the final design, web and hub included, checked by a finite element analysis, with the annulus calculation used to size it first and to check the analysis's answer.

## Balance

A 227 kg ring turning at 1,480 rpm must be balanced. A small offset of its mass from the axis produces a rotating force that grows with speed squared and loads the motor's bearings at every revolution. The flywheel is machined all over, and the assembly of flywheel, hub and key is balanced to a grade agreed with the motor maker, in the manner described in the [Whirling Shafts by the Numbers](/reados/publications/whirling-shafts-by-the-numbers/) book's chapters on unbalance and balancing. A flywheel fitted to an existing motor is also a new rotor for that motor, and its natural frequencies change; the same book explains how to check that the running speed stays clear of them.

## Where it is mounted

The simplest place for the flywheel, on an extension of the motor's shaft, puts a 227 kg overhung mass on the motor's bearings, which were designed for a belt pulley. The motor maker states the overhung load its bearings will accept at a given distance from the shaft's shoulder, and a heavy flywheel added to an existing belt pull can exceed it. The mill's motor maker confirmed that the motor's drive-end bearing would accept the flywheel's weight and the belt pull together only if the flywheel sat close to the bearing, with the pulley outboard of it. The alternative, a separate jackshaft with its own bearings between the motor and the belt, costs more but keeps the motor's bearings within their original duty.

The flywheel also changes how the motor is maintained. Removing the motor now means removing a 227 kg ring first, with lifting points and a procedure for doing so, and the flywheel's guard must be designed for that removal as well as for containment, which Chapter 10 covers.

## The start, revisited

Adding 237.6 kg·m² at the chipper doubles the inertia the motor must start, from 230.03 to 467.6 kg·m². With Chapter 7's rotor run-up time tool and the same average torques, the start now takes 15.5 s, just over the motor's allowed 15 s, and each start puts 996 kJ into the motor's rotor; three starts an hour would be 2,989 kJ, at the edge of the 3,000 kJ limit.

```figure
type: compare
title: The chipper's direct-on-line start, before and after the flywheel
cols: Inertia at the chipper | Run-up time | Rotor energy per start | Rotor energy, 3 starts an hour
rowhead: Rotor system
- Disc, hub and motor rotor | 230.03 kg·m² | 7.64 s | 490 kJ | 1,470 kJ
- * With the added flywheel | 467.6 kg·m² | 15.54 s | 996 kJ | 2,989 kJ
caption: This is an illustration. Average motor torque 2,041 N·m and load torque 150 N·m at the chipper. The motor maker's figures, illustrations, are 15 s and 3,000 kJ an hour.
```

The flywheel that solves the chipping problem makes the start marginal. The mill's options were to ask the motor maker whether this motor accepts a 16 s start at this inertia, to limit starts to two an hour, giving 1,993 kJ, or to fit a larger motor. A soft starter would not help: by lowering the torque it lengthens the start and raises the rotor heating. The mill obtained the motor maker's agreement to a 16 s start for this inertia, an illustration, and limited the chipper to two starts an hour in its operating instruction.

A variable-speed drive was the remaining option. It would start the larger rotor at the motor's rated current, taking longer but heating the rotor far less, and it would also let the chipper's speed be raised slightly between peaks to store more energy. The mill judged the cost unjustified for two starts an hour at most, and recorded the option for a future duty with more frequent starts.

## The hub and its fixing

The flywheel's energy reaches the motor's shaft through its web, hub and key, and three torques must be checked there. During a peak, the flywheel slows from 154.99 to 147.24 rad/s in 1.2 s, a deceleration of 6.46 rad/s², which needs 39.05 × 6.46 = 252 N·m. During a direct start, the motor accelerates the flywheel at about 154.99 ÷ 15.54 = 9.97 rad/s², which takes 389 N·m through the hub. And if the chipper jams, the flywheel's 469 kJ drives into the jam through the belt until the belt slips or the protection stops the motor: the belt is then the fuse, and its slipping torque is the largest torque the hub sees.

## The mistake: a cast-iron flywheel on a fast shaft

The first proposal took a cast-iron flywheel of 900 mm diameter from a supplier's catalogue, chosen because its listed inertia matched the 39 kg·m² required. The catalogue gave its maximum speed as 600 rpm. Run through the flywheel rim design tool at 1,480 rpm, it showed a rim speed of 69.7 m/s against a cast-iron limit of 30 m/s.

The catalogue's speed limit was the key fact, and the proposal had missed it because the flywheel had been selected by inertia alone. A flywheel's inertia, energy and rim speed must be checked together: two flywheels with the same inertia can have quite different safe speeds. The steel ring designed above replaced it.

## Exercise: a cast-iron flywheel for a slow machine

**Problem.** A machine running at a mean of 450 rpm needs a flywheel to supply 8 kJ with a coefficient of speed fluctuation of 0.04. A cast-iron annular flywheel is proposed, 1,000 mm outside diameter, at 7,200 kg/m³, Poisson's ratio 0.26, tensile strength 150 MPa, safety factor 5 and rim speed limit 30 m/s. Find (a) the inertia needed, (b) whether a width of 120 mm can provide it, and (c) the bore and mass for a width of 150 mm, with the rim speed and safety factor.

**Answer.** (a) ωm = 47.12 rad/s. I = 8,000 ÷ (47.12² × 0.04) = 90.06 kg·m².

(b) A solid cast-iron disc 1,000 mm × 120 mm has J = 7,200 × π × 0.12 × 0.5⁴ ÷ 2 = 84.8 kg·m², less than 90.06. Even with no bore it is too small; the tool reports that the diameter or width must increase.

(c) At 150 mm wide: bore 623 mm, mass 519 kg, top speed 459 rpm, rim speed 24.0 m/s, stress 3.7 MPa, safety factor 40.7. FLYWHEEL ADEQUATE.

**The check.** At 450 rpm the rim speed, not the stress, is the limit that matters most for cast iron, and 24 m/s leaves margin under 30 m/s. A 1,100 mm diameter would save mass, 391 kg at 120 mm width, at a rim speed of 26.4 m/s.

The exercise and the chipper show the two regimes of flywheel design. On a slow shaft, a flywheel is limited by its mass and size: it must be large and heavy to store enough energy, and its rim speed and stress are low. On a fast shaft it can be small and light, and its limits are the rim speed and stress of its material. The same tool handles both, but the check that decides the design is different in each, and reading only the inertia result, as the mistake in this chapter did, misses whichever limit applies.
