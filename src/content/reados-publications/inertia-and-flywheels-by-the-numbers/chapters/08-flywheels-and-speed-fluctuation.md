---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: flywheels-and-speed-fluctuation
order: 8
title: "Flywheels and speed fluctuation"
description: "How a flywheel carries a machine through peak loads by slowing: energy released between two speeds, the coefficient of speed fluctuation, rim speed, and the inertia a duty needs."
draft: false
---

A flywheel is a store of energy that charges and discharges by changing speed. When a machine's load briefly exceeds what its motor can supply, the flywheel slows a little and gives up energy to make up the difference; when the load falls, the motor speeds it up again. A punch press, a shear, an engine, a crusher and a chipper all depend on this, and the design question is always the same: how much inertia is needed to keep the speed within limits while the peak passes.

This chapter examines the DL-3 chipper's disc as a flywheel with the WORKOS flywheel energy and speed fluctuation tool. It derives the energy released between two speeds, introduces the coefficient of speed fluctuation, and finds that the disc alone cannot carry the mill's largest offcuts. Its mistake is an energy calculated from the change of speed instead of the change of speed squared, which understated the flywheel's contribution forty-fold.

## Energy released by slowing

A rotor with moment of inertia J turning at ω holds kinetic energy of half J ω². Slowing from ω1 to ω2, it releases half J (ω1² − ω2²). Because energy goes with speed squared, a small fractional drop in speed releases nearly twice that fraction of the stored energy: slowing by 5% releases 1 − 0.95² = 9.75% of it.

The coefficient of speed fluctuation describes how far the speed is allowed to swing: the range of speed divided by the mean, Cs = (ω1 − ω2) ÷ ωm. With ωm = (ω1 + ω2) ÷ 2, the energy released can be written exactly as J ωm² Cs, a form convenient for design because it separates the inertia, the speed and the allowed variation.

```figure
type: formula
title: Flywheel energy and speed fluctuation
formula: ΔE = ½ J (ω1² − ω2²) = J ωm² Cs
formula: Cs = (ω1 − ω2) ÷ ωm = 2 (n1 − n2) ÷ (n1 + n2)
formula: Rim speed v = π D n ÷ 60
caption: ω1 and ω2 are the highest and lowest speeds in a cycle, ωm their mean. Cs is often a few per cent: smaller where a steady speed matters, larger where only the energy matters. Rim speed limits how fast a flywheel of a given construction may turn.
- ΔE | energy released between the two speeds
- Cs | coefficient of speed fluctuation
- ωm | mean angular speed
```

## The chipper's duty

The DL-3's chipper cuts every offcut from the docking saw. Most are short and light, but the cutting lists include large offcuts, up to a 300 × 75 mm end a metre long, at most one every 10 s. Chipping one of those takes about 150 kW for 1.2 s, while the 75 kW motor can supply its rated power continuously. The difference, 75 kW for 1.2 s, is 90 kJ that must come from the rotating parts. These are the mill's working figures and an illustration.

The mill's chipping quality falls off if the disc slows by more than 5%: below 570 rpm the chips come out ragged and oversize. The design is therefore a speed range of 600 to 570 rpm, a coefficient of speed fluctuation of 30 ÷ 585 = 0.0513.

## The disc as a flywheel

The [flywheel energy and speed fluctuation tool](/tools/flywheel-energy/) takes a flywheel's mass, its outer diameter and, for a ring, its inner diameter, the maximum speed, the minimum speed during the cycle, and the allowed rim speed. It returns the moment of inertia of the disc or ring, the energy released between the two speeds, the kinetic energy at the top speed, the coefficient of speed fluctuation and the rim speed, with a check on rim speed. It counts only the disc or ring entered; hubs, spokes and shafts are left out unless their mass is included, and the rim speed limit must come from the maker or a stress analysis.

```figure
type: steps
title: The chipper's disc in the flywheel energy tool
caption: This is an illustration. Solid steel disc of 906.31 kg, 1,400 mm diameter, from 600 to 570 rpm, allowed rim speed 50 m/s.
- Moment of inertia | 222.05 kg·m²
- * Energy released, 600 to 570 rpm | 42.73 kJ
- Kinetic energy at 600 rpm | 438.3 kJ
- Coefficient of fluctuation | 0.0513
- Rim speed | 43.98 m/s: within 50 m/s
```

The disc alone releases 42.7 kJ. Counting the hub and the motor's rotor seen from the chipper, Chapter 7's 230.03 kg·m², the whole rotating system releases J ωm² Cs = 230.03 × 61.26² × 0.0513 = 44.27 kJ. Either way it is less than half the 90 kJ a large offcut takes.

## What happens if the flywheel is too small

With 230.03 kg·m² supplying 90 kJ, the speed does not stop at 570 rpm. It falls until the energy released reaches 90 kJ: ω2² = 62.83² − 2 × 90,000 ÷ 230.03, so ω2 = 56.27 rad/s, or 537.3 rpm, a drop of 10.5%, twice what the mill allows.

In practice an induction motor resists that fall. As its speed drops, its slip rises and its torque rises with it, so the motor supplies more than its rated power during the peak, and the flywheel less. That helps, but at a cost: the motor runs above its rated current, heating faster, and its speed drop, which the slip produces, is exactly what the chipping quality cannot tolerate. The mill's numbers therefore credit the motor with only its rated 75 kW during the peak, a conservative figure that leaves the overload capacity as margin.

```figure
type: compare
title: Inertia needed at the chipper's shaft for 90 kJ, by allowed speed drop
cols: Cs | Inertia needed | Times the present 230.03 kg·m²
rowhead: Lowest speed allowed
- 580 rpm, 3.3% drop | 0.0339 | 695.5 kg·m² | 3.0
- * 570 rpm, 5% drop | 0.0513 | 467.6 kg·m² | 2.0
- 555 rpm, 7.5% drop | 0.0779 | 315.8 kg·m² | 1.4
- 540 rpm, 10% drop | 0.1053 | 240.0 kg·m² | 1.04
caption: This is an illustration. Inertia needed = 2 × 90,000 ÷ (ω1² − ω2²) from 600 rpm. Halving the allowed drop roughly doubles the inertia needed.
```

The table shows the trade. To hold the 5% limit, the rotating system needs 467.6 kg·m², twice what it has. If the mill could accept a 10% drop, the present disc would nearly do, but the chips would suffer. The inertia needed rises steeply as the allowed drop narrows, because the energy released is proportional to the coefficient of fluctuation.

## Rims store energy better than discs

For a given outer diameter and mass, a thin rim has twice the moment of inertia of a solid disc, because all its mass is at the outside instead of spread from the centre outward. It therefore stores twice the energy per kilogram at the same speed. That is why traditional flywheels have a heavy rim joined to the hub by spokes or a thin web: almost all the useful inertia is in the rim, and the spokes only carry the torque.

The chipper's disc is a solid plate because it must also carry the knives across its face; its job as a flywheel is a by-product. A flywheel added purely to store energy is better made as a ring, as Chapter 9 does. For the same 1,400 mm outer diameter, a ring with an inner diameter of 1,000 mm would need only about 600 kg instead of the disc's 906 kg to give the same 222 kg·m².

There is a limit to how far this can be pushed. A thin rim's stress at a given rim speed is higher than a solid disc's average stress, and the rim's speed, not its mass, is usually what limits a flywheel's design. Chapter 10 shows why.

## The fast shaft

The chipper is driven through a belt from a motor turning 2.467 times faster. Inertia on the motor's shaft counts 2.467² = 6.08 times as much, seen from the chipper, as the same inertia on the chipper's shaft. The 237.6 kg·m² the chipper needs to add could therefore be provided by just 39.1 kg·m² on the motor's shaft. That is the case for putting a flywheel on the fastest shaft available, and it is the choice Chapter 9 examines, along with its price: a flywheel on the fast shaft runs at a higher rim speed for the same diameter.

A flywheel on the motor shaft also changes what the belt must carry. During a peak the energy from the motor's shaft reaches the chipper through the belt. The disc and hub still supply about 42.9 kJ from the chipper's side, but the rest of the 90 kJ, about 47.1 kJ, crosses the belt with the motor's 75 kW, so the belt transmits about 114 kW for those 1.2 s instead of the 75 kW it would carry if all the added inertia were on the chipper's own shaft. The belt drive must be checked for that peak.

## Measuring the speed drop

A flywheel calculation predicts a speed drop, and the drop can be measured. The DL-3's chipper has a speed sensor on its shaft for its overload protection, and its signal can be logged at a few hundred readings a second. During commissioning the mill fed a large offcut and logged the speed. In this illustration the log showed a drop from 600 rpm to about 540 rpm, recovering in about two seconds, close to the calculated 537 rpm and 2 s. A measured drop much larger than the calculation would mean a larger energy deficit than assumed or less inertia; a smaller drop would mean the motor was supplying more than its rated power through its slip.

The same log is the evidence for the flywheel added in Chapter 9: logged again after the flywheel is fitted, the drop should stay above 570 rpm.

## Recovering between peaks

A flywheel only lends energy; the motor must pay it back before the next peak. After a large offcut, the chipper must regain 90 kJ, and the motor's spare capacity between large offcuts is its rated 75 kW less the disc's air drag of about 9.4 kW and the steady stream of small offcuts, about 45 kW in all, an illustration. At 45 kW the 90 kJ is replaced in 2 s, well inside the 10 s between large offcuts.

The energy balance over the whole cycle must also close. Each large offcut takes 150 × 1.2 = 180 kJ in total; at one every 10 s that averages 18 kW, which with the air drag and small offcuts stays inside the motor's 75 kW. A flywheel smooths peaks; it cannot raise the average power a motor can deliver. A duty whose average exceeds the motor's rating needs a bigger motor, however large the flywheel.

```figure
type: checklist
title: Before sizing a flywheel
caption: The DL-3 review's checks. This is an illustration.
- x Peak energy deficit worked from the load's power and duration, less what the motor supplies
- x Allowed speed range set by the process, not chosen for convenience
- x All rotating inertia counted, including the motor's rotor reflected to the flywheel's shaft
- x Recovery time between peaks within the time available
- x Average power over the whole cycle within the motor's continuous rating
- x Rim speed within the limit for the flywheel's material and construction
```

## Where flywheels earn their keep

The same logic applies to every flywheel machine. A mechanical punch press stores energy in its flywheel between strokes and releases a few per cent of it during the fraction of a revolution in which the punch cuts; its motor is sized for the average, and the flywheel for the peak. An engine's flywheel smooths the torque pulses of its cylinders, and its speed variation is set small enough that the engine runs evenly. A crusher's flywheel carries it through a large rock. A rolling mill's carries it through the bite of a bar.

In each case the designer works out the energy deficit of the worst peak, chooses the speed variation the process can accept, and finds the inertia from ΔE = J ωm² Cs. The flywheel's diameter and mass then follow from the inertia and from how fast its rim may run, which Chapter 9 takes up for the chipper.

## The mistake: the change of speed, not the change of speed squared

The first flywheel check for the chipper calculated the energy released as half J times the change in speed squared: 0.5 × 230.03 × (62.83 − 59.69)² = 1,135 J. Against a deficit of 90 kJ, that suggested the existing rotor supplied almost nothing and that a flywheel nearly eighty times larger was needed.

The energy released is half J (ω1² − ω2²), the difference of the squares, not the square of the difference. For a small speed drop the difference of the squares is about twice the mean speed times the drop, which for the chipper is 2 × 61.26 × 3.14, about thirty-nine times the drop squared. The error was found by checking that the released energy was a sensible share of the stored energy: 1.1 kJ out of 454 kJ for a 5% slowdown is a quarter of a percent, while energy going with speed squared means a 5% slowdown must release nearly 10%.

## Exercise: a press flywheel

**Problem.** A small press has a flywheel that can be treated as a ring of 200 kg, 900 mm outside and 700 mm inside diameter, running at 300 rpm. Each stroke takes 4 kJ from the flywheel, and the speed must not fall below 270 rpm. Find (a) the flywheel's inertia and the energy released from 300 to 270 rpm, (b) the speed after a 4 kJ stroke, and (c) the mass of the same ring section needed to hold 270 rpm.

**Answer.** (a) J = 200 × (0.45² + 0.35²) ÷ 2 = 32.50 kg·m². ω1 = 31.42 rad/s, ω2 = 28.27 rad/s. Released = 0.5 × 32.5 × (31.42² − 28.27²) = 3,047 J: less than the 4 kJ needed.

(b) ω2² = 31.42² − 2 × 4,000 ÷ 32.5 = 740.8, ω2 = 27.22 rad/s, or 259.9 rpm: a 13.4% drop.

(c) Inertia needed = 32.5 × 4,000 ÷ 3,047 = 42.66 kg·m². With the same proportions, mass scales with inertia: 200 × 42.66 ÷ 32.5 = 262.5 kg.

**The check.** The rim speed is π × 0.9 × 300 ÷ 60 = 14.1 m/s, well within the limit for a cast-iron flywheel, so the extra mass can go into a wider rim rather than a larger diameter.

The same exercise shows the cost of ignoring the hub, the shaft and the motor. If the press's motor rotor and pulley added, say, 6 kg·m² seen from the flywheel's shaft, the ring would need only 36.7 kg·m² of its own, about 225 kg. Counting every rotating part before adding mass to a flywheel is the cheapest saving in its design, and it is the reason the chipper's calculation in this chapter started from the whole rotating system, not from the disc alone.
