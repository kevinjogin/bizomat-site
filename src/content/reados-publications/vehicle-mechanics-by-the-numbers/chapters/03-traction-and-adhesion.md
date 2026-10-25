---
book: vehicle-mechanics-by-the-numbers
chapterSlug: traction-and-adhesion
order: 3
title: "Traction, adhesion and the wet ramp"
description: "Find the load on the driving axle on a slope with a trailer pulling back, compare the force needed with the grip available, and decide what to change when it is not enough."
draft: false
---

A motor can only push a vehicle as hard as its tyres can grip the floor. Above that limit, the extra torque spins the wheels instead of moving the load. For a heavy train on a slope, grip, not motor power, is often the limit that decides whether the vehicle climbs.

This chapter calculates the grip available at the tow tractor's driving axle on the 6% ramp. It includes the two effects that change the axle load on a slope, the weight component acting at the centre of gravity height and the drawbar pull acting at the hitch height, and compares the result with the force Chapter 2 found necessary. On a dry ramp, the tractor climbs comfortably. On a wet one, it does not, and the chapter works through the options.

## Adhesion: the grip limit

The maximum tractive force a driving axle can transmit before the wheels slip is:

**F_max = μ × R_drive**

where μ is the adhesion coefficient between tyre and floor and R_drive is the normal load on the driving axle. The adhesion coefficient depends on the tyre compound and tread, the floor surface and above all its condition: dry and clean, wet, dusty, oily or icy. It can vary by a factor of two or more on the same floor in the same day.

This is an illustration. The book uses two teaching values: **μ = 0.6** for clean, dry concrete and **μ = 0.3** for wet or dusty concrete. Real values for a particular tyre and floor come from the tyre maker, from tests or from measurement on site. Treat any single published value with caution. Polished concrete with a film of water or fine dust can be considerably worse than 0.3.

Two consequences follow from the formula. Only the load on the driven axle counts; weight on undriven wheels adds nothing to grip, however much the vehicle weighs. And anything that changes the driven axle load changes the grip: slope, drawbar pull, acceleration and the position of equipment on the vehicle.

## Axle load on a slope with a trailer

Chapter 1 found the tractor's static rear axle load on the level: 10,595 N. On the ramp, two effects add to it.

- **The slope.** The weight component down the slope, W × sin θ, acts at the centre of gravity height h. It creates a moment that shifts load from the front axle to the rear, which is the lower axle when the tractor climbs forwards.
- **The drawbar pull.** The trailers pull back on the hitch, parallel to the ramp, at a height h_d above the ramp surface. That pull also creates a moment that loads the rear axle and unloads the front.

Taking moments about the front tyre contact point, with the trailers carrying their own weight on their own wheels so that the hitch carries no vertical load, gives:

```figure
type: formula
title: Driving axle load on a slope with drawbar pull
formula: R_rear = [W × (a × cos θ + h × sin θ) + F_d × h_d] ÷ L
caption: Moments about the front contact point of a rear-drive tractor climbing a slope of angle θ while pulling trailers with drawbar force F_d. The hitch is assumed to carry no vertical load.
- W, a, L | tractor weight, distance from front axle to CG, wheelbase
- h | height of the centre of gravity above the slope surface, m
- F_d | drawbar pull from the trailers, parallel to the slope, N
- h_d | hitch height above the slope surface, m
```

## The running case on the ramp

This is an illustration. The tractor weighs 18,541 N, with a = 0.8 m, h = 0.5 m and L = 1.4 m. The hitch is 0.3 m above the floor. On the 6% ramp, cos θ = 0.9982 and sin θ = 0.0599. Chapter 2 found the trailers' drawbar pull on the ramp to be 2,864 N.

**R_rear = [18,541 × (0.8 × 0.9982 + 0.5 × 0.0599) + 2,864 × 0.3] ÷ 1.4 = 11,586 N**

The rear axle load rises from 10,595 N on the level to 11,586 N on the ramp, an increase of almost 1,000 N. The front axle carries the rest of the tractor's normal weight component, about **18,541 × 0.9982 − 11,586 = 6,922 N**.

The train needs **4,252 N** of tractive force to climb at steady speed. The grip available is:

- Dry ramp, μ = 0.6: **0.6 × 11,586 = 6,952 N**. Enough, with a margin of about 2,700 N.
- Wet ramp, μ = 0.3: **0.3 × 11,586 = 3,476 N**. Not enough, by **776 N**.

The adhesion coefficient the climb actually requires is **4,252 ÷ 11,586 = 0.367**. Any floor condition with less grip than that will spin the wheels. The margin on a dry ramp looks generous, but it depends entirely on the surface staying clean and dry.

```figure
type: bars
title: Tractive force needed and grip available on the 6% ramp
unit: N
max: 7200
caption: This is an illustration. Three loaded trailers, steady speed, rear axle load 11,586 N on the ramp. Adhesion coefficients are teaching assumptions.
- Force needed to climb | 4252
- Grip available, dry concrete (μ 0.6) | 6952
- *Grip available, wet concrete (μ 0.3) | 3476
```

## Starting on the ramp

The steady-speed case is not the hardest. If the train stops on the ramp, it must accelerate from rest on the slope. Chapter 2 found that accelerating the train at 0.3 m/s² needs a further 1,824 N, so the total becomes **6,076 N**. The acceleration also increases the drawbar pull, to about 4,034 N, and transfers a little more load to the rear axle, which rises to about **12,039 N**.

The required adhesion coefficient becomes **6,076 ÷ 12,039 = 0.505**. That is within the dry value of 0.6, but well beyond the wet value. A train that stops on a wet ramp will not restart without spinning, and a spinning wheel on a slope can let the train slide back. That one calculation is the basis for a simple site rule: trains do not stop on the ramp.

## The error: grip from the whole weight

The first traction check for the ramp used the tractor's whole weight instead of its driving axle load:

**0.3 × 18,541 = 5,562 N**

That suggested the tractor had 1,310 N more grip than it needed even on a wet ramp. The check passed, and the site's first wet morning proved it wrong: the tractor spun its wheels two-thirds of the way up, and the driver had to uncouple a trailer and make two trips.

The error was in the formula, not the arithmetic. Only the driven axle's load produces tractive grip. The front axle of the tractor and every trailer wheel carry weight but transmit no drive. The correction is to use R_drive, and to calculate it with the slope and drawbar effects included, as above. Four-wheel drive vehicles can use their whole weight, which is one reason they are chosen for poor surfaces.

## What can be changed

When the grip is not enough, there are four levers, each with costs.

```figure
type: compare
title: Options for the wet ramp
cols: Required μ | Effect and cost
caption: This is an illustration. Steady climb at 6%; available adhesion on the wet ramp is taken as 0.3. Calculations use the same method and assumptions throughout.
- Base: three trailers | 0.367 | fails on a wet ramp
- Two trailers on the ramp | 0.290 | passes just; one extra trip in three
- 150 kg ballast at the rear | 0.326 | still fails; adds weight to every trip
- *Raise floor grip | 0.367 needed | passes if the treated ramp holds μ above about 0.4 when wet
- Four-wheel drive tractor | about 0.230 | uses the whole tractor weight; a different vehicle
```

**Reduce the pull.** Two trailers instead of three cut the force to 3,298 N, while the rear axle load falls only slightly to 11,382 N. The required coefficient falls to **0.290**, just under 0.3. It works on paper but with almost no margin.

**Add load on the driven axle.** The 150 kg toolbox from Chapter 1, placed behind the rear axle, raises the ramp axle load to about 13,401 N, but it also adds to the weight the tractor must haul up the slope. The required coefficient falls only to **0.326**, still above 0.3. Ballast helps less than it seems, because the tractor must carry it. Ballast also adds to the tractor's axle and tyre loads, its energy use on every trip and the mass its brakes must stop, which Chapter 7 shows is already the tighter limit on the way down.

**Increase the grip.** An anti-slip coating or grooving on the ramp, a canopy to keep it dry, and a cleaning routine to remove dust all raise μ for every trip without changing the vehicle. If the treated ramp keeps μ above about 0.4 when wet, the three-trailer train climbs with a small margin.

**Change the drive.** A four-wheel drive tractor uses its whole weight for grip. On the ramp its required coefficient would be about **4,252 ÷ (18,541 × 0.9982) = 0.230**. It is a different vehicle with a different price and maintenance burden.

The site chose a combination: an anti-slip treatment and canopy on the ramp, a rule against stopping on it, and a limit of two trailers on the ramp whenever it is wet, until tests confirm the treated surface's wet adhesion.

## Slip is gradual, then sudden

A driven tyre does not grip perfectly until the moment it spins. Even at modest tractive forces, the tread deforms and creeps slightly, so the wheel turns a little faster than the vehicle moves. As the force rises, that slip grows, and the available grip rises with it up to a peak, typically at a small percentage of slip. Beyond the peak, grip falls as the tyre starts to slide, so a wheel that begins to spin tends to spin faster. That is why wheelspin on a ramp develops so quickly: once past the peak, more throttle produces less push.

Two practical points follow. First, the adhesion coefficient in calculations should be the peak value for the surface condition, and it should be conservative, because the driver cannot feel exactly where the peak is. Second, modern electric drives often include traction control that limits motor torque when it detects wheel speed rising faster than vehicle speed. Traction control keeps the tyre near its peak and prevents the runaway spin, but it cannot create grip that is not there. On the wet ramp, traction control would stop the wheels spinning wildly; it would not let the train climb.

## Grip works in both directions

The same adhesion limit applies when braking. A tractor stopping the train on the way down the ramp can only produce as much braking force as its tyres can grip, and the trailers, if they have no brakes, add their mass to what must be stopped without adding any grip. Chapter 7 shows that the descent of a wet ramp is a more serious problem than the climb, because a train that cannot climb simply stops, while a train that cannot stop keeps moving.

## Measuring adhesion

As with rolling resistance, measured numbers are better than assumed ones. A simple drawbar test gives a useful estimate: with the tractor's brakes released, pull it slowly with another vehicle through a load cell while its driven wheels are locked by the parking brake, and record the force at which they slide. That force divided by the driven axle load is the sliding coefficient, which is a little lower than the peak coefficient that drive can use, so the result is conservative. Repeat on the ramp surface dry, wet and dusty. Purpose-made slip testers can also measure floor surfaces against a reference rubber, which is useful for comparing treatments even if the rubber differs from the tyres.

## Turning the numbers into site rules

Calculations only protect people when they become rules that drivers and supervisors can follow without doing the arithmetic. The running case produced four, each traceable to a number in this chapter:

1. **No stopping on the ramp.** Restarting needs an adhesion coefficient of about 0.5, which a wet ramp cannot supply.
2. **Two trailers maximum on the ramp when it is wet** until the treated surface is tested. Two trailers need about 0.29, three need about 0.37.
3. **Ramp inspected and cleaned at the start of each shift**, because dust lowers grip as surely as water.
4. **Report any wheelspin** on the ramp to the supervisor, as a near miss. Spin is the first sign that the assumed grip is not there.

Each rule is written with its reason, so that a driver or a new supervisor understands why it exists and does not quietly drop it on a busy day. The numbers are also kept, so that when the vehicle, the trailers or the ramp change, someone can redo the calculation rather than guess whether the rule still applies.

## Exercise: a heavier battery on the wet ramp

Chapter 1's exercise added a 120 kg battery, raising the tractor's weight to 19,718 N with its CG 0.809 m behind the front axle. Assume the CG height is unchanged at 0.5 m. With three loaded trailers, does the tractor climb the wet ramp?

**Worked answer.** The train mass becomes 2,010 + 3,900 = **5,910 kg**. The force needed at steady speed is **0.015 × 5,910 × 9.81 × 0.9982 + 5,910 × 9.81 × 0.0599 = 868 + 3,472 = 4,340 N**. The drawbar pull is unchanged at **2,864 N**.

The rear axle load on the ramp is **[19,718 × (0.809 × 0.9982 + 0.5 × 0.0599) + 2,864 × 0.3] ÷ 1.4 = 12,409 N**, so the wet grip available is **0.3 × 12,409 = 3,723 N**.

That is still short of 4,340 N; the required coefficient is **4,340 ÷ 12,409 = 0.350**. The heavier battery helps a little, as ballast does, but not enough. The ramp surface, not the vehicle, is the better place to solve the problem.
