---
book: vehicle-mechanics-by-the-numbers
chapterSlug: stopping-distance
order: 7
title: "Stopping distance, deceleration and the downhill train"
description: "Split a stop into reaction and braking distance, find the deceleration the brakes and tyres allow, and see why unbraked trailers on a wet downhill ramp set the site's speed limit."
draft: false
---

Every vehicle rule on a site eventually comes back to one question: can the vehicle stop before it reaches whatever is in its path? Crossing positions, speed limits, mirror placement and the clear zone at the foot of a ramp all depend on the stopping distance, and the stopping distance depends on things the driver cannot see, such as the floor's grip and whether the trailers have brakes.

This chapter splits a stop into its parts, works out the deceleration the tow tractor's brakes and tyres can achieve with and without braked trailers, and applies the result to the descent of the 6% ramp. The error case is a stopping distance measured with the tractor alone and then applied to the loaded train. It is the reason the site's ramp limit is 5 km/h.

## The two parts of a stop

A stop has two phases. During the **reaction time**, the driver perceives the hazard, decides to brake and moves a foot to the pedal, and the brakes build up their force. The vehicle travels at its original speed throughout. During the **braking phase**, it decelerates to rest.

```figure
type: formula
title: Stopping distance
formula: s = v × t_r + v² ÷ (2 × a)
caption: This is an illustration. Speed 10 km/h, reaction and brake build-up time 1 s, steady deceleration 1.5 m/s². Real reaction times vary widely with alertness, expectation and visibility.
- s | total stopping distance, m
- v | initial speed, m/s
- t_r | reaction and brake build-up time, s
- a | average deceleration while braking, m/s²
step: reaction distance = 2.778 × 1 = 2.78 m
step: braking distance = 2.778² ÷ (2 × 1.5) = 2.57 m; total 5.35 m
```

This is an illustration. The book takes a reaction time of **1 s** for a driver who is alert and expecting to stop, such as at a marked crossing. An unexpected hazard can take longer to recognise, and published research on driver reaction gives a wide spread of values. The figure used for planning should be chosen with that spread in mind, not from the best case.

At 10 km/h with a deceleration of 1.5 m/s², the reaction distance and the braking distance are almost equal. That is typical of slow industrial vehicles: half the stop happens before the brakes do anything. Two consequences follow. Better brakes shorten only half of the stop, and lower speed shortens both halves, the braking half with the square of the speed.

## The deceleration that brakes and tyres allow

The deceleration is set by the braking force, which cannot exceed the grip at the braked wheels. Rolling resistance helps slightly. On a slope, the gradient force helps uphill and opposes downhill. For the whole train:

**a = (F_brake + F_rolling ± F_gradient) ÷ m**

and the braking force at its limit is **μ × N_braked**, where N_braked is the normal load on the braked wheels. This chapter ignores the rotating mass factor; for braking it makes the result a few per cent optimistic, which the margin must cover.

This is an illustration. The tractor has brakes on all four wheels, so its whole weight is available for braking grip. The trailers have no brakes. The train's mass is 5,790 kg, of which the trailers are 3,900 kg.

- **Level, dry, μ = 0.6:** maximum brake force **0.6 × 18,541 = 11,125 N**; deceleration **(11,125 + 852) ÷ 5,790 = 2.07 m/s²**.
- **Level, wet, μ = 0.3:** brake force 5,562 N; deceleration **1.11 m/s²**.
- **Downhill on the 6% ramp, dry:** the normal load is 18,541 × 0.9982, so the brake force is **11,105 N**; deceleration **(11,105 + 850 − 3,402) ÷ 5,790 = 1.48 m/s²**.
- **Downhill on the ramp, wet:** brake force **5,552 N**; deceleration **(5,552 + 850 − 3,402) ÷ 5,790 = 0.52 m/s²**.

The gradient takes 3,402 N of the braking effort before any of it is used to slow the train. On a wet ramp, that leaves just over half a metre per second squared, about a third of the deceleration on a dry level floor.

## Stopping distances for the running case

Putting those decelerations into the stopping-distance formula gives the distances in the figure below. All assume a 1 s reaction time.

```figure
type: bars
title: Stopping distance of the loaded train, tractor brakes only
unit: m
max: 11
caption: This is an illustration. Three loaded unbraked trailers, 5,790 kg in total; tractor braked on all wheels; reaction and brake build-up 1 s; adhesion coefficients are teaching assumptions.
- Level, dry, 10 km/h | 4.64
- Level, wet, 10 km/h | 6.26
- Downhill ramp, dry, 10 km/h | 5.39
- *Downhill ramp, wet, 10 km/h | 10.22
- Downhill ramp, wet, 5 km/h | 3.25
```

The wet downhill case at 10 km/h stands out: **10.22 m**, more than twice the dry level distance. Halving the speed to 5 km/h cuts it to **3.25 m**, less than a third, because the reaction distance halves and the braking distance falls to a quarter. That single comparison is the strongest argument for a low speed limit on a slope.

## How sensitive is the answer?

The wet downhill stop at 5 km/h, 3.25 m, rests on three assumptions: the reaction time, the adhesion coefficient and the load. Each can be worse on a real day, and it is worth seeing by how much.

This is an illustration. Changing one assumption at a time, with everything else as before:

- **Reaction time 1.5 s instead of 1 s.** Each extra half-second at 5 km/h adds **1.389 × 0.5 = 0.69 m**. The stop becomes **3.94 m**.
- **Adhesion 0.25 instead of 0.3**, for a ramp with a film of dust as well as water. The deceleration falls to **0.36 m/s²** and the stop becomes **4.08 m**.
- **An extra 600 kg on the trailers.** The tractor's braking grip does not change, but the train's mass and gradient force both rise. The deceleration falls to **0.43 m/s²** and the stop becomes **3.64 m**.

None of these is extreme, and each one alone pushes the stop towards 4 m. Together they would take it well past. The planning figure therefore needs a margin, and the site rules need to protect the assumptions: a trailer load limit, a ramp cleaning routine and a crossing layout that lets the driver see a pedestrian early rather than relying on a fast reaction. At 10 km/h the same half-second of extra reaction would add 1.39 m, twice as much, which is another reason the ramp limit is low.

## What braked trailers would change

If the trailers had brakes as well, the whole train's weight would be available for braking grip. This is an illustration. On the wet ramp, the brake force would be limited by **0.3 × 5,790 × 9.81 × 0.9982 = 17,009 N**, and the deceleration could reach **(17,009 + 850 − 3,402) ÷ 5,790 = 2.50 m/s²**, almost five times the tractor-only value. On the dry ramp it could reach about 5.4 m/s², more than the brakes themselves would normally be designed to deliver, so the brakes rather than the tyres would set the limit.

```figure
type: compare
title: Downhill deceleration on the 6% ramp
cols: Tractor brakes only | Tractor and trailer brakes
caption: This is an illustration. Loaded train 5,790 kg; deceleration limited by grip at the braked wheels; adhesion coefficients are teaching assumptions. Braked trailers would also need their brakes balanced with the tractor's.
- Dry ramp, μ 0.6 | 1.48 m/s² | about 5.4 m/s², limited by the brakes
- *Wet ramp, μ 0.3 | 0.52 m/s² | 2.50 m/s²
- Weight available for braking grip | the tractor only, about a third of the train | the whole train
```

Braked trailers have their own costs: overrun or electric brake mechanisms, adjustment and inspection, and the need to balance trailer and tractor braking so that neither pushes nor drags the other. But on a site with slopes and pedestrians, they turn the downhill case from the governing limit into an ordinary one.

## Unbraked trailers push

When only the tractor brakes, the trailers do not slow themselves; the tractor slows them through the hitch. The hitch is then in compression, with the trailers pushing on the tractor.

This is an illustration. Braking at 1.48 m/s² on the dry ramp, the force needed to slow the trailers is their mass times the deceleration, plus the gradient force on them, minus their rolling resistance: **3,900 × 1.477 + 2,292 − 573 = 7,479 N**. That push acts at the hitch, behind the tractor's rear axle. If the tractor is steered, or the hitch is not directly in line, the push has a sideways component that tries to swing the tractor's rear outward. That is the start of a jackknife. On a wet floor the push is smaller, 3,740 N, but the tractor's tyres have less grip to resist it, which is worse.

Two rules follow from this. Trains do not turn while braking hard on the ramp, and the route is laid out so that the ramp and the area at its foot are straight. A ramp that ends in a bend is a ramp where a hard stop can fold the train.

## Loads under braking

Braking is the case that moves loads on trailers. A load resting on a trailer deck stays put only while friction can supply the force to decelerate it. On a level floor, a crate with a friction coefficient of 0.3 against the deck starts to slide at a deceleration of **0.3 × 9.81 = 2.94 m/s²**. Downhill, the slope adds to the tendency to slide, and the limit falls to **0.3 × 9.81 × 0.9982 − 9.81 × 0.0599 = 2.35 m/s²**.

The tractor-only train cannot reach those decelerations on any surface considered here, which is a small benefit of its weak braking. If the trailers are fitted with brakes, the train can stop harder than an unrestrained load can follow, and load restraint becomes essential: side gates, chocks or straps, chosen so that the load stays put at the train's maximum deceleration. The general rule is that load restraint must be designed for the vehicle's best braking, not its typical braking.

## The error: the solo tractor test

When the site first planned the crossing at the foot of the ramp, a supervisor ran a stopping test with the tractor alone on the dry level floor. From 10 km/h, it stopped in about 3.4 m including reaction, which agrees with the calculated value for the solo tractor: deceleration **(11,125 + 278) ÷ 1,890 = 6.03 m/s²**, braking distance 0.64 m and total **3.42 m**. The crossing was marked 4 m from the foot of the ramp, on the basis that the tractor could stop well short of it.

The test answered the wrong question. The loaded train has three times the tractor's mass but no more braking grip, and on the ramp the gradient takes a share of what grip there is. Coming down the wet ramp at 10 km/h, the loaded train needs **10.22 m**. A train descending the ramp could not stop before a crossing 4 m from its foot.

The error was found during a review of the traffic plan, when someone asked whether the test had been done with trailers. The correction had three parts:

1. **A 5 km/h limit on the ramp, both directions.** Wet stopping distance downhill falls to 3.25 m.
2. **The crossing moved further from the foot of the ramp**, so that a train has the full wet stopping distance plus a margin before it, and a straight run-out.
3. **The stopping test repeated with the loaded train**, dry and wet, uphill and downhill, and the results kept on the vehicle's file. The test confirmed the calculated distances within about 10%.

The general lesson is that a test of a lighter, simpler or better-braked configuration says little about a heavier one. Test or calculate the worst case the site actually runs.

## Sight distance must exceed stopping distance

A stopping distance is only useful if the driver can see the hazard at least that far ahead. At every crossing, door and blind corner, the sight distance, measured from the driver's eye to the point where a pedestrian could appear, must exceed the stopping distance for the speed and surface at that point. Where it does not, the options are to slow the vehicle, improve the sight line with mirrors or by removing obstructions, or separate pedestrians and vehicles with barriers and controlled crossings. The hierarchy of controls applies: separation is more reliable than any rule about speed or attention.

This is an illustration. On the level aisle at 10 km/h on a wet floor, the loaded train needs 6.26 m. A doorway whose frame hides a pedestrian until they are 5 m in front of the tractor fails that check, however good the brakes are. The site's options are a lower speed past the door, a convex mirror that lets the driver see further, or a barrier that stops pedestrians stepping out at all. The site chose the barrier, with a gate set back from the aisle, because it works even when the driver is distracted.

## Exercise: how fast is too fast on the wet ramp?

The crossing at the foot of the ramp can only be moved to 4 m from the point where a driver would first see a pedestrian step out. On a wet ramp with tractor brakes only, what is the highest descent speed that allows the loaded train to stop within 4 m?

**Worked answer.** The deceleration on the wet ramp is 0.518 m/s² and the reaction time 1 s. The speed must satisfy **v × 1 + v² ÷ (2 × 0.518) = 4**, a quadratic in v. Solving it gives **v = 1.58 m/s**, or **5.7 km/h**.

The site's 5 km/h limit is below that value, giving a stop of 3.25 m and a margin of about 0.75 m. That margin is thin: a slower reaction, a dustier ramp or a heavier load would use it up. The calculation supports the 5 km/h limit, but it also supports the site's longer-term plan to fit brakes to the trailers, which would raise the wet deceleration to 2.50 m/s² and shorten the same stop to about 1.8 m.
