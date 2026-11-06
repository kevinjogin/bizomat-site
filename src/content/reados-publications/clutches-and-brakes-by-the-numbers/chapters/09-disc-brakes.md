---
book: clutches-and-brakes-by-the-numbers
chapterSlug: disc-brakes
order: 9
title: "Disc brakes"
description: "How to size a caliper disc brake to stop a load that drives through the stop or helps it: braking torque, friction radius, clamp force, pad pressure, energy and stopping angle."
draft: false
---

A caliper disc brake clamps a rotating disc between two pads. It is the plate clutch of Chapter 3 turned into a brake: the same friction radius, the same faces, the same clamp force. What it adds is a disc that stays exposed to the air on both sides, a short pad that leaves most of the disc cooling at any moment, and a caliper that can be applied by springs, hydraulics or air. Disc brakes are now the usual choice for emergency and holding brakes on hoists, winches, conveyors and wind turbines.

This chapter sizes the SW-25's second drum brake, an independent caliper disc brake on the drum flange, with the BIZOMAT caliper disc brake design tool. It shows why the direction of the load during the stop dominates the design, what happens when the brake must stop a drum that is already running too fast, and how the brake's capacity is set. Its mistake is a load direction chosen from the wrong case.

## Why a second brake

A winch whose band brake controls every lowering depends on that brake, its lining, its band and its anchor. The yard's refit adds an independent second brake on the drum itself, so that a failure anywhere in the band brake, or in the gears between the drum and the motor brake, cannot let a boat run away. The caliper is spring-applied and hydraulically released: it applies when the operator presses the emergency stop, when the hydraulic pressure is lost, or when an overspeed switch on the drum detects a lowering faster than 15 m/min, one and a half times the normal lowering speed.

The yard's rules for the second brake are these illustrations: it must hold at least 1.25 times the load torque with rolling resistance ignored, and stop a normal lowering within 1 s, with the load overhauling.

## The braking torque

The torque a brake must produce to stop a rotating load in a time t is the torque to decelerate the inertia, J ω ÷ t, plus or minus the load torque. If the load resists the motion, as friction or a load being hauled up does, it helps the brake and is subtracted. If the load drives the motion, as a lowered boat does, the brake must overcome it as well as stopping the inertia, and it is added.

For a lowering on the SW-25 the inertia term is small and the load term is large. With 2,275 kg·m² at the drum, a lowering speed of 0.556 rad/s and a 1 s stop, the inertia needs 2,275 × 0.556 ÷ 1 = 1,264 N·m; the load adds 6,110 N·m; the brake must produce 7,374 N·m. The load is 83% of the requirement.

```figure
type: formula
title: Disc brake torque, clamp force and energy
formula: Tb = J ω ÷ t ± TL
formula: Clamp force F = Tb ÷ (μ re n)
formula: Energy per stop = Tb ω t ÷ 2
caption: The load torque TL is added when the load drives through the stop, as in lowering, and subtracted when it helps. re is the effective friction radius: the mean of the pads' inner and outer radii for worn pads, slightly larger for new ones. n is the number of friction faces, two for a caliper gripping both sides of a disc. The energy is the brake torque times the angle turned during the stop.
- J ω ÷ t | torque to decelerate the inertia in time t
- re | effective friction radius of the pads
- n | number of friction faces
```

## Sizing the caliper

The caliper's pads act between radii of 350 and 450 mm on a disc welded to the drum flange, giving an effective friction radius of 400 mm for worn pads. The pads are sintered, with a maker's minimum friction coefficient of 0.40, and each pad has an area of 100 cm². The caliper chosen gives a clamp force of up to 25 kN from its springs. The disc weighs 120 kg.

The [caliper disc brake design tool](/tools/disc-brake-design/) takes the inertia at the disc, the speed at the start of braking, the required stop time, the load torque and whether it helps the stop or drives through it; the pads' outer and inner radii, whether to use the uniform-wear or uniform-pressure friction radius, the friction coefficient, the number of faces, the pad area per face, the largest pad pressure and the clamp force available; and the disc's mass, specific heat and largest allowed temperature rise per stop. It returns the braking torque, the effective friction radius, the clamp force needed, the pad pressure, the energy per stop, the disc's temperature rise and the revolutions to stop, with checks on clamp force, pressure and heating. It assumes a constant friction coefficient and that the disc absorbs the heat.

```figure
type: steps
title: The SW-25's second brake in the caliper disc brake design tool
caption: This is an illustration. Inertia 2,275 kg·m², 5.305 rpm, stop in 1 s, load torque 6,110.1 N·m driving through the stop; pads 450 and 350 mm radius, uniform wear, μ = 0.40, two faces, 100 cm² per face, 2.5 MPa allowed, 25 kN available; disc 120 kg at 0.46 kJ/(kg·K), 150 K allowed.
- Braking torque | 7,374 N·m
- Effective friction radius | 400 mm
- * Clamp force needed | 23,044 N: within 25 kN
- Pad pressure | 2.30 MPa: within 2.5 MPa
- Energy per stop | 2.05 kJ
- Disc temperature rise | 0.04 K
- Revolutions to stop | 0.044
```

The clamp force of 23.0 kN fits within the caliper's 25 kN. At its full 25 kN the caliper produces 25,000 × 0.40 × 0.400 × 2 = 8,000 N·m, which is 1.31 times the load torque and meets the yard's holding rule. The drum stops in 0.044 revolutions, 83 mm of rope. The energy, 2.05 kJ, warms the disc by four hundredths of a kelvin: for a slow drum, heat is not the design question.

### Worn pads or new

The tool offers two effective radii. With the uniform-pressure model of new pads, the radius is 402.1 mm instead of 400 mm and the clamp force 22,924 N instead of 23,044 N, half a percent less. For pads as narrow as these the choice hardly matters, and the uniform-wear value is the conservative one for a brake that will spend most of its life with bedded-in pads.

## Stopping a drum that is already running away

The second brake exists for the case where something has gone wrong, and the most likely wrong thing is a lowering that is already too fast. The overspeed switch trips at 15 m/min, 1.5 times the normal speed. The question is whether the caliper, at its full 25 kN and 8,000 N·m, still stops the drum within its target from that speed, and how far the boat travels if the trip were set higher.

At 8,000 N·m, the torque left to decelerate the drum is 8,000 − 6,110 = 1,890 N·m. From the normal speed of 0.556 rad/s the drum stops in 2,275 × 0.556 ÷ 1,890 = 0.67 s. From the trip speed of 0.833 rad/s it stops in 1.00 s, exactly the target, with 125 mm of rope travel. From three times normal speed it would take 2.01 s and 0.50 m.

```figure
type: compare
title: The caliper at its full 8,000 N·m, from three lowering speeds
cols: Drum speed | Stop time | Rope travel | Energy
rowhead: Lowering speed
- Normal, 10 m/min | 0.556 rad/s | 0.67 s | 0.056 m | 1.49 kJ
- * Overspeed trip, 15 m/min | 0.833 rad/s | 1.00 s | 0.125 m | 3.34 kJ
- Three times normal, 30 m/min | 1.667 rad/s | 2.01 s | 0.50 m | 13.37 kJ
caption: This is an illustration. Inertia 2,275 kg·m², load torque 6,110.1 N·m overhauling, brake torque 8,000 N·m. Stop time and travel grow with speed, and energy with speed squared, because the brake's surplus over the load is fixed.
```

The table shows why the trip speed matters as much as the brake. The brake's surplus torque over the overhauling load is only 1,890 N·m; the faster the drum is going when the brake applies, the longer that small surplus takes to stop it. Setting the overspeed trip at 1.5 times normal speed, not three times, keeps the worst stop within the yard's 1 s target. If the trip were set higher, the brake would need a larger clamp force or a larger disc.

## The caliper's delay

The calculation above assumes the brake produces its torque the instant the trip fires. A spring-applied, hydraulically released caliper takes time: the trip opens a valve, the oil must flow out of the caliper's cylinder before the springs can push the pads onto the disc, and the pads must close their running clearance. A delay of a tenth or two of a second is typical of such brakes, and it matters when the load is overhauling.

If the band brake has failed completely, nothing restrains the drum during the delay except rolling resistance, which the yard's rule ignores. The overhauling torque of 6,110 N·m then accelerates the 2,275 kg·m² drum and boat at 6,110 ÷ 2,275 = 2.69 rad/s². In 0.2 s the drum's speed rises from the trip speed of 0.833 rad/s to 1.370 rad/s, from 15 to 24.7 m/min of rope, before the caliper has begun to act.

```figure
type: compare
title: Effect of the caliper's application delay, band brake failed
cols: Speed when the brake bites | Stop time after it bites | Total rope travel
rowhead: Delay after the trip
- None | 15.0 m/min | 1.00 s | 0.13 m
- 0.1 s | 19.8 m/min | 1.33 s | 0.25 m
- * 0.2 s | 24.7 m/min | 1.65 s | 0.41 m
- 0.3 s | 29.5 m/min | 1.97 s | 0.60 m
caption: This is an illustration. Trip at 15 m/min; drum accelerating at 2.69 rad/s² under the 6,110 N·m overhauling torque until the caliper bites; then stopped by the caliper's 8,000 N·m. Rolling resistance ignored throughout.
```

The delay more than triples the rope travel, from 0.13 m to 0.41 m at 0.2 s, and takes the stop well beyond the 1 s target. The 1 s target therefore applies to a stop in which the caliper bites at the trip speed, and the full emergency sequence, with its delay and a failed band brake, was assessed separately. The yard's commissioning test measures the caliper's actual delay with a stopwatch trace on the hydraulic pressure and a mark on the drum, and its acceptance figure for total rope travel in the failed-band case, 0.5 m on a 60 m slip, is the yard's working figure and an illustration. A slower caliper, a later trip or a weaker spring would each need the brake to be re-assessed.

### At the low end of friction

If the pads' friction were 0.35 instead of 0.40, the caliper's full capacity would fall to 7,000 N·m, 1.15 times the load torque, below the holding rule. The surplus over the load would drop from 1,890 to 890 N·m, and the stop from the trip speed would take more than twice as long. That is why the yard took the pad maker's minimum of 0.40, not a typical figure, and why pad contamination is treated as a defect that takes the winch out of service.

## Heat, discs and pads

For the SW-25 the disc's heating per stop is trivial, because the drum turns slowly. The same tool applied to a fast shaft gives very different results, and heat then governs. A disc's temperature rise per stop is the energy divided by the disc's heat capacity, as long as the stop is short enough that the heat has not yet spread to the hub or the air. In repeated stops, the disc's temperature climbs stop by stop until the heat it sheds between stops matches the heat each stop adds, and the pads' and disc's temperature limits then set how often the brake can be used.

Two practical points apply to every caliper. The caliper must float or have opposed pistons, so that both pads press equally; a fixed caliper with one piston bends the disc and wears one pad. And the disc must run true: a disc with runout knocks the pads back as it turns, so the first part of each application is spent closing the extra clearance. The yard checks the disc's runout with a dial indicator after welding it to the drum flange, and again at each annual service.

## The mistake: the load direction from the wrong case

The first run of the disc brake tool for the second brake used the setting "Load helps the stop", copied from an earlier calculation for stopping a haul, in which the boat's weight does help. For a lowering the tool then returns an error: the load alone stops the inertia within the time, and no brake torque is needed. In arithmetic terms, 1,264 − 6,110 = −4,846 N·m.

The result is absurd, and the tool says so, because a boat being lowered does not stop by itself. The engineer had expected a number and, for a moment, read the message as a sign that the brake was more than adequate. The reviewer's question was simple: in which direction is the drum turning at the start of the stop, and which way is the load pushing it? In a lowering both are the same, so the load drives through the stop. With the correct setting the brake needs 7,374 N·m.

```figure
type: decision
title: Is the load helping the stop or driving through it?
question: At the moment the brake applies, which way is the load pushing the drum?
- The same way the drum is turning | the load drives through the stop: add it (lowering, downhill, an overhauling load)
- Against the way the drum is turning | the load helps the stop: subtract it (hauling up, friction, a fan or pump load)
- * Not sure, or it changes during the stop | design for the case where it drives through
caption: For a winch on a slope or a hoist, the load always pushes in the lowering direction. A stop from hauling has a helping load; a stop from lowering has a driving one. The brake must handle the second.
```

## Exercise: a disc brake for a conveyor stop

**Problem.** A conveyor's disc brake must stop 40 kg·m² from 300 rpm in 1.5 s. The belt's resistance gives a load torque of 150 N·m that helps the stop. The pads act between 100 and 150 mm radius, uniform wear, with μ = 0.35, two faces, 20 cm² per face and a 3.0 MPa limit; the caliper can give 12 kN. The disc weighs 8 kg at 0.46 kJ/(kg·K). Find (a) the braking torque and clamp force, (b) the pad pressure, (c) the energy and temperature rise, and (d) the effect of ignoring the helping load.

**Answer.** ω = 31.42 rad/s.

(a) Tb = 40 × 31.42 ÷ 1.5 − 150 = 687.8 N·m. re = 125 mm. F = 687.8 ÷ (0.35 × 0.125 × 2) = 7,860 N, within 12 kN.

(b) p = 7,860 ÷ 2,000 = 3.93 MPa: over the 3.0 MPa limit. Pads of 30 cm² would bring it to 2.62 MPa.

(c) Energy = 687.8 × 31.42 × 1.5 ÷ 2 = 16.2 kJ. Temperature rise = 16,205 ÷ (8 × 460) = 4.4 K. The disc stops in 3.75 revolutions.

(d) Ignoring the helping load gives 837.8 N·m and 9,574 N: a safe overestimate, because a conveyor whose belt has broken, or which is running empty, may have much less resistance than expected. For a conveyor brake that must stop the drive in all conditions, the helping load is often left out deliberately.

**The check.** The SW-25's second brake and this conveyor brake are sized by different things. The winch's caliper is sized by the load it must overcome and barely warms; the conveyor's is sized by pad pressure and heat, because its disc turns nearly sixty times faster and its stop is almost all inertia. Before choosing a brake, it is worth asking which of those two kinds of problem it faces.
