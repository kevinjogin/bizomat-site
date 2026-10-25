---
book: vehicle-mechanics-by-the-numbers
chapterSlug: stability-and-site-rules
order: 10
title: "Tipping stability, load height and the rules that come from the numbers"
description: "Find the sideways acceleration at which a vehicle or a loaded trailer tips, see how load height and cross-slope erode it, and turn the whole book's calculations into a set of site rules."
draft: false
---

A vehicle that tips over is usually doing nothing unusual. It is turning a corner a little faster than usual, with a load a little higher than usual, on a floor a little less level than usual. Each of those is small; together they can take a vehicle past the point where its weight can no longer hold it down.

This chapter calculates that point for the tow tractor and for a loaded trailer, shows how load height and cross-slope reduce it, and checks the site's corners against it. The error case is a trailer stacked two high to save a trip, which tipped on a tight corner at a speed that would have been safe with a normal load. The chapter, and the book, finish by gathering the calculations from every chapter into the rules that the site actually runs on.

## The static tipping threshold

When a vehicle turns, a sideways inertia force, m × a_y, acts at its centre of gravity, pushing it toward the outside of the turn. The vehicle's weight, acting at the same point, holds it down. Taking moments about the outer wheels' contact line, the vehicle begins to lift its inner wheels when the inertia moment equals the weight moment.

```figure
type: formula
title: Static rollover threshold
formula: a_y,tip = g × (t ÷ 2) ÷ h
caption: This is an illustration. Rigid vehicle on level ground, CG on the centre line. Tyre and suspension deflection, load movement and dynamic effects lower the real threshold, often considerably.
- a_y,tip | sideways acceleration at which the inner wheels lift, m/s²
- t | track width, the distance between the left and right wheel contact centres, m
- h | height of the centre of gravity above the ground, m
step: tractor, t = 0.9 m and h = 0.5 m: 9.81 × 0.45 ÷ 0.5 = 8.83 m/s²
step: loaded trailer, t = 0.8 m and h = 1.0 m: 9.81 × 0.4 ÷ 1.0 = 3.92 m/s²
```

The ratio t ÷ 2h is sometimes called the static stability factor. A low, wide vehicle has a high threshold; a high, narrow one a low threshold. The tractor, with its heavy battery low between the wheels, is very stable. The loaded trailer, narrower and with its load sitting high on the deck, is less than half as stable.

The static threshold is an upper bound. Tyres deflect and the body leans, moving the CG outward. Loads shift. A sudden steering input can overshoot the steady acceleration. For planning, the book uses a factor of 2: the sideways acceleration in normal operation should not exceed half the static threshold. That factor is a teaching assumption, chosen to cover the effects the simple formula leaves out; where a vehicle maker states a rated stability or a test result, use that.

## Finding the load's centre of gravity height

The trailer's combined CG height depends on its own tare and on the load. This is an illustration. The empty trailer has a mass of 300 kg with its CG 0.4 m above the floor. A typical load is 1,000 kg of components in crates, with its CG 1.2 m above the floor. The combined CG height is the mass-weighted average:

**h = (300 × 0.4 + 1,000 × 1.2) ÷ 1,300 = 1.02 m**

which the book rounds to 1.0 m. The deck height, the crate heights and the way the load is stacked all feed into that number. A load that is twice as tall, with the same mass, raises the CG much more than adding mass at deck level does.

## Which trailer feels the corner most

Chapter 9 showed that each trailer runs on a smaller circle than the one ahead of it. For the same train speed, a smaller radius means a larger sideways acceleration, v² ÷ R. The last trailer is therefore not only the one that cuts the corner; it is also the one that is pushed hardest sideways.

This is an illustration. The tight corner at the dock has a radius of 3 m at the tractor's rear axle. Using the geometry from Chapter 9, the three trailers' rear axles run at **2.61 m, 2.13 m and 1.50 m**. Using the rear axle radius for the whole trailer is slightly conservative, because the trailer's CG sits a little further out, between its axles.

```figure
type: bars
title: Sideways acceleration of the third trailer at the dock corner
unit: m/s²
max: 6
caption: This is an illustration. Dock corner of 3 m radius at the tractor's rear axle; third trailer's rear axle at 1.50 m. Static tipping threshold of the normally loaded trailer 3.92 m/s²; planning limit at half of it, 1.96 m/s².
- At 5 km/h | 1.29
- At 8 km/h | 3.29
- *At 10 km/h | 5.14
- Static tipping threshold, normal load | 3.92
- Planning limit, half the threshold | 1.96
```

At 5 km/h, the third trailer sees 1.29 m/s², inside the planning limit. At 10 km/h, it sees **5.14 m/s²**, well beyond the static threshold of the normally loaded trailer. Even at 8 km/h, the margin to the static threshold is only about 16%. The tractor, for comparison, would see much less on its larger radius and has a threshold more than twice as high. The trailer, not the tractor, sets the safe corner speed.

The bar chart also shows how steeply the risk rises with speed. Sideways acceleration grows with the square of the speed, so going from 5 to 8 km/h, a rise of 60%, multiplies the sideways push on the last trailer by about 2.6. A driver judging a corner by feel, from the tractor seat, feels only the tractor's sideways acceleration on its larger radius, which is about half the third trailer's. The trailer behind can be close to its limit while the tractor feels comfortable. That is why the corner speed is set by calculation and enforced by the controller, not left to the driver's sense of what feels safe.

## Cross-slope erodes the margin

A floor that falls sideways, such as the edge of a dock plate, a drainage fall or a ramp that is crossed at an angle, tilts the vehicle toward one side and moves its CG closer to the downhill wheels. The vehicle tips at a lower sideways acceleration, and on a steep enough cross-slope it tips standing still.

This is an illustration. Standing on a cross-slope, the loaded trailer would tip at an angle of **atan(0.4 ÷ 1.0) = 21.8°**, far steeper than any floor on site. But a modest cross-slope combined with a turn toward the downhill side is another matter. On a 3° cross-fall, the threshold for a turn toward the low side falls approximately to **9.81 × (0.4 − 1.0 × tan 3°) ÷ 1.0 = 3.41 m/s²**, a reduction of 13%. Dock plates and ramp edges are where tipping incidents tend to happen, and they are where the site's route avoids turning.

## Loads can tip too

The same reasoning applies to a load standing on a trailer deck. Under braking or in a turn, an item resists tipping with half its base width and is pushed over at its own CG height. It tips when the acceleration exceeds **g × (b ÷ 2) ÷ h_c**, where b is the base width in the direction of the acceleration and h_c the height of its CG above the deck. It slides when the acceleration exceeds μ × g. Whichever limit is lower decides what happens first.

This is an illustration. A crate 0.4 m deep with its CG 0.6 m above the deck tips at **9.81 × 0.2 ÷ 0.6 = 3.27 m/s²**. With a friction coefficient of 0.3 against the deck, it slides first, at 2.94 m/s². A narrower item, 0.3 m deep with the same CG height, tips at **2.45 m/s²**, before it would slide. The simple test is the ratio of half the base to the CG height: if it is less than the friction coefficient, the item tips before it slides.

The tractor-only train brakes at no more than 2.07 m/s² on a dry floor, below both values. A train with braked trailers could brake more than twice as hard, and tall, narrow items would then tip forward unless they were restrained. Load restraint must be chosen for the hardest braking and the sharpest corner the train can produce, not for its typical day.

## The error: stacked two high

On a busy afternoon, a driver loaded the third trailer with crates stacked two high to save a trip. The mass was the usual 1,000 kg, but the load's CG rose to about 1.6 m above the floor.

This is an illustration. The trailer's combined CG height became **(300 × 0.4 + 1,000 × 1.6) ÷ 1,300 = 1.32 m**, and its static tipping threshold fell to **9.81 × 0.4 ÷ 1.32 = 2.97 m/s²**. At the dock corner, the third trailer reaches that sideways acceleration at a train speed of about **7.6 km/h**, compared with 8.7 km/h for the normally loaded trailer.

The driver, running late, took the dock corner at about 8 km/h instead of 5. The sideways acceleration on the third trailer, 3.29 m/s², was below the threshold for a normal load and above it for the stacked one. The trailer lifted its inner wheels and fell onto its side, spilling the upper crates into the aisle. Nobody was in the aisle.

The investigation found three contributing causes, each small: a load higher than usual, a speed above the corner limit, and a timetable that encouraged hurrying, the same timetable error described in Chapter 6. The corrections addressed all three:

1. **A maximum load height** marked on each trailer, with a simple gauge at the loading point, so that a stacked load is visible before the train leaves.
2. **The 5 km/h corner limit enforced** by the tractor's controller, which can reduce the speed limit when the steering angle passes a set value. The rule no longer depends on the driver remembering it.
3. **The timetable rebuilt** from measured trip times, so that no driver has a reason to hurry.

## The rules that come from the numbers

Every chapter of this book has ended in a decision: a speed, a load, a layout or a check. Gathered together, they form the vehicle rules for the route, and each can be traced back to a calculation that can be redone when something changes.

```figure
type: compare
title: Site rules for the tow train and where they come from
cols: Rule | Calculation behind it
caption: This is an illustration. Rules for the book's running case. Each should be reviewed when the vehicle, the trailers, the loads, the route or the floor change.
- Axle loads | weigh the tractor after any change of equipment | Chapter 1: axle loads and CG from weighing
- Ramp grip | no stopping on the ramp; two trailers only when it is wet | Chapter 3: required adhesion 0.505 to restart, 0.367 to climb
- Battery | battery sized with reserve; energy per trip logged | Chapter 4: 7.8 kWh per shift against 11.5 kWh usable
- Wheels | replacement wheels within the specified dynamic radius | Chapter 5: 8% speed error with oversize wheels
- Acceleration | controller set to 0.3 m/s² loaded | Chapter 6: wet grip limit 0.42 m/s²
- *Ramp speed | 5 km/h both ways | Chapter 7: wet downhill stop 3.25 m at 5 km/h, 10.22 m at 10 km/h
- Brakes | front locks first; weekly loaded stopping test | Chapter 8: dynamic balance 59 : 41
- Corners | lanes marked from the train's swept path; no fourth trailer | Chapter 9: swept path 2.31 m on the 4 m corner
- Loads | load height limit and 5 km/h on corners | Chapter 10: trailer threshold 3.92 m/s², last trailer on the smallest radius
```

The rules are only as good as the assumptions behind them. Three of those assumptions recur through the book and deserve to be measured rather than assumed: rolling resistance, measured by a pull test; adhesion on the ramp, measured wet and dry; and the stopping distance of the loaded train, measured on a marked lane. Each takes less than an hour. Together they replace the teaching values used in this book with the site's own numbers, and any rule that changes as a result should be changed.

A rule also needs a reason that a driver can understand. "5 km/h on the ramp because on a wet ramp the stopping distance at 10 km/h is more than three times that at 5 km/h" is a rule that survives a busy afternoon. "5 km/h because the sign says so" is one that does not.

## What this book has left out

The calculations in this book are deliberately simple: rigid bodies, steady states and teaching values for friction and grip. They are enough to size a drive, set a speed limit or mark a corner, and to show which number matters. They are not enough for every question. Tyre behaviour at the limit, suspension dynamics, the transient motion of a train through a quick steering input and the detailed thermal behaviour of brakes and motors all need more advanced methods, test data or the vehicle maker's analysis.

Vehicles at work are also plant under work health and safety law, and the duty to manage their risks sits with the business running them. The calculations here support that duty; they do not replace the maker's instructions, the site's risk assessment or the consultation with drivers and pedestrians that the law expects. Where a number in this book differs from the maker's data for a real vehicle, the maker's data governs.

## Exercise: a load height limit

The dock corner is the tightest on the route, with the third trailer's rear axle on a radius of 1.50 m. With trains at the 5 km/h corner limit and the factor of 2 used in this chapter, what is the highest combined CG height the loaded trailer may have, and what load CG height does that allow for a 1,000 kg load?

**Worked answer.** At 5 km/h, the third trailer's sideways acceleration is **1.389² ÷ 1.50 = 1.29 m/s²**. With a factor of 2, the static threshold must be at least **2 × 1.29 = 2.57 m/s²**. From the threshold formula, **h ≤ 9.81 × 0.4 ÷ 2.57 = 1.53 m**.

For a 1,000 kg load on the 300 kg trailer, the combined CG height is (120 + 1,000 × h_load) ÷ 1,300. Setting that to 1.53 m gives **h_load ≤ (1.53 × 1,300 − 120) ÷ 1,000 = 1.86 m**. The stacked load in the error case, at 1.6 m, would have been acceptable at 5 km/h, which shows that the corner speed was the decisive factor that afternoon. The site still set its load height limit lower, at a load CG of 1.4 m, because a limit that relies on the speed rule being obeyed fails exactly when the speed rule is broken. Two independent margins are better than one.
