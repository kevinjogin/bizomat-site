---
book: vehicle-mechanics-by-the-numbers
chapterSlug: brakes-pedal-to-tyre
order: 8
title: "Brakes from pedal to tyre, and the balance between axles"
description: "Follow the force from the pedal through the hydraulics to the tyre, size the calipers for the axle loads under braking, and see why the rear wheels must not lock first."
draft: false
---

Chapter 7 treated the brakes as a force at the tyres. This chapter opens them up. A driver's foot produces a few hundred newtons; the tyres must produce more than ten thousand. The pedal lever, the hydraulic system and the friction at the discs multiply the force, and the design of that chain decides how hard the driver must press, how far the pedal travels and, most importantly, which wheels lock first when the grip runs out.

The running case is the tow tractor with its four braked wheels and three unbraked trailers. The chapter works out the axle loads during a hard stop, sizes the caliper pistons so that both axles reach the grip limit together, and follows the force back to the pedal. The error case is a brake balance set to the tractor's static axle loads, which made the rear wheels lock first and the train fold.

## The force chain

Every hydraulic brake follows the same chain. The pedal is a lever; the master cylinder converts force into pressure; the pressure acts on the caliper pistons; the pads clamp the disc; friction at the disc produces a torque; and the tyre turns that torque back into a force at the floor.

```figure
type: steps
title: From pedal force to tyre force
caption: Each step multiplies or converts the force. Losses in seals and linkages are ignored here; real systems lose a few per cent.
- Pedal lever | pedal force × pedal ratio = master cylinder force
- Master cylinder | pressure = force ÷ master cylinder piston area
- Caliper | clamp force = pressure × caliper piston area
- Disc friction | disc torque = 2 × pad friction × clamp force × effective radius
- Tyre | tyre force = disc torque ÷ dynamic wheel radius
```

The factor of 2 in the disc torque applies to a floating caliper, where one piston pushes the inner pad and the reaction pulls the outer pad, so friction acts on both faces of the disc. The effective radius is the radius at which the pad's friction force can be taken to act, roughly the middle of the pad.

## Axle loads during a hard stop

When a vehicle brakes, its inertia acts forward at the centre of gravity height, which transfers load from the rear axle to the front. On a tractor towing unbraked trailers there is a second effect. The trailers push forward on the hitch, at 0.3 m above the floor and behind the rear axle, and that push also loads the front axle.

This is an illustration. Taking moments about the rear tyre contact point for the tractor braking the loaded train on the dry level floor at the grip limit, a = 2.07 m/s²:

- The hitch push is the force needed to decelerate the trailers, less their rolling resistance: **3,900 × 2.068 − 574 = 7,493 N**.
- **R_front = [18,541 × 0.6 + 1,890 × 2.068 × 0.5 + 7,493 × 0.3] ÷ 1.4 = 10,948 N**
- **R_rear = 18,541 − 10,948 = 7,593 N**

Here 0.6 m is the distance from the CG to the rear axle. At rest the front axle carried 7,946 N, 43% of the tractor's weight. During the hard stop it carries 10,948 N, **59%**. The distribution has reversed.

```figure
type: compare
title: Tractor axle loads at rest and during a hard stop
cols: At rest | Hard stop, dry, with unbraked trailers
caption: This is an illustration. Tractor 1,890 kg with driver, wheelbase 1.4 m, CG 0.8 m behind the front axle and 0.5 m high, hitch 0.3 m high; deceleration 2.07 m/s² with tractor brakes only.
- Front axle | 7,946 N, 43% | 10,948 N, 59%
- Rear axle | 10,595 N, 57% | 7,593 N, 41%
- *Brake force each axle can use at μ 0.6 | 4,768 N front, 6,357 N rear | 6,569 N front, 4,556 N rear
```

## Sizing the brakes for balance

For both axles to reach their grip limits at the same moment, the brakes must divide the braking force in the same proportion as the axle loads during the stop: 59% front, 41% rear. If they do, the whole train decelerates at the full 2.07 m/s² before any wheel locks.

This is an illustration. The wheel torques needed at the dry grip limit are:

- **Front, each wheel:** 6,569 ÷ 2 × 0.25 = **821 N·m**
- **Rear, each wheel:** 4,556 ÷ 2 × 0.25 = **569 N·m**

With a single hydraulic circuit, all calipers see the same pressure, so the balance comes from the caliper sizes. Assume floating calipers, a pad friction coefficient of **0.35** and an effective radius of **0.1 m**. The torque per wheel is 2 × 0.35 × p × A × 0.1.

- A front piston of **48 mm** diameter, 1,810 mm², needs **821,000 ÷ (2 × 0.35 × 1,810 × 100) = 6.48 MPa**, with the torque in N·mm, the area in mm² and the radius in mm.
- A rear piston of **40 mm** diameter, 1,257 mm², needs **569,000 ÷ (2 × 0.35 × 1,257 × 100) = 6.47 MPa**.

The two pressures match within a fraction of a per cent, because the piston areas are in the ratio 1,810 : 1,257, which is 59 : 41. The front clamp force is about **6.48 × 1,810 = 11,730 N** per caliper.

Pad friction coefficients vary with material, temperature, speed and wear, often by 20% or more across their operating range. The value of 0.35 is a teaching assumption; the pad maker's data governs, and the design must still stop the vehicle at the low end of the pad's range.

## Back to the pedal

The master cylinder must produce 6.48 MPa. This is an illustration. With a master cylinder of **19 mm** diameter, 283.5 mm², the force on its piston is **6.48 × 283.5 = 1,838 N**. With a pedal ratio of 5, the driver must press with **1,838 ÷ 5 = 368 N**, about the weight of a 37.5 kg mass.

That is a firm push for a single emergency stop, and too heavy for repeated stops through a shift. Two changes are possible:

- **A smaller master cylinder.** At **16 mm**, 201 mm², the master cylinder force falls to 1,303 N and the pedal force to **261 N**. The price is pedal travel. If each caliper piston must move 0.2 mm to take up its clearance, the four calipers need about **1,226 mm³** of fluid, which is **4.3 mm** of master cylinder travel at 19 mm diameter and **6.1 mm** at 16 mm. Times the pedal ratio, that is 22 mm and 31 mm of pedal travel before the brakes even bite, before any allowance for hose expansion or pad compression.
- **A power booster**, vacuum or electric, which adds force without lengthening the travel. Most road vehicles use one. Small industrial vehicles often do not, and depend on a well-chosen master cylinder and pedal ratio.

Seen end to end, the chain multiplies the driver's 368 N into about **11,125 N** at the four tyres, a factor of about 30. Every link in the chain contributes, and every link can lose some of it in service: a pedal pivot that binds, a master cylinder seal that bypasses, a caliper piston that sticks, or a pad that has glazed and lost part of its friction. A brake that needs more pedal force than it did last month is reporting a fault somewhere in that chain.

The designer's choice balances pedal force against pedal travel and against what happens if the booster fails. The brake system must still stop the vehicle, if more slowly, with no boost at all.

## Which wheels lock first

Balance at the dry grip limit is not the whole story, because grip changes. On a wet floor, at μ = 0.3, the deceleration is smaller, the load transfer is smaller, and the axle loads during the stop are about **9,497 N front and 9,044 N rear**, a 51 : 49 split. The brakes still divide the force 59 : 41, so on a wet floor the front wheels reach their grip limit first.

That is the safe direction. When the front wheels lock, the vehicle loses steering but keeps travelling straight, because the unlocked rear wheels still resist sideways movement. When the rear wheels lock first, the rear of the vehicle loses its sideways grip and any small disturbance swings it round. On a tractor with trailers pushing on its hitch, a rear lock-up is the classic start of a jackknife.

The design rule, which road vehicle braking regulations also embody, is that the front axle should lock before the rear across the range of grip and load the vehicle will meet. In practice, that means proportioning for the highest deceleration and heaviest towed load, and then checking that lighter and wetter cases still lock the front first.

## The error: balance set to the static loads

The tractor in this book was, in an earlier design, given equal 44 mm caliper pistons front and rear, and its brake balance was later adjusted with a pressure-reducing valve so that the front received 43% of the braking and the rear 57%, matching the static axle loads. The reasoning was that the rear axle carries more weight, so it can take more braking.

The reasoning ignored load transfer and the hitch push. With braking divided 43 : 57, the rear wheels reach their grip limit first. This is an illustration. Solving step by step for the deceleration at which the rear brake force equals 0.6 times the rear axle load gives about **1.64 m/s²**, with the rear axle load fallen to 8,238 N and the rear brake force at **4,944 N**. The front wheels, meanwhile, are using only 3,708 N of the 6,182 N their load could carry. The train stops less hard than its tyres allow, and when it reaches that limit it does so in the unstable way.

The error was found in a test with the loaded train on a dry floor, when a hard stop left two black marks from the rear tyres and the tractor's rear stepped sideways by about 200 mm before the driver released the pedal. Nobody was hurt. The correction was to remove the reducing valve, fit the 48 mm and 40 mm calipers, and repeat the test, which then produced short front tyre marks and a straight stop.

The general lesson is that brake balance is a dynamic quantity. It depends on the deceleration, the centre of gravity height, the wheelbase and anything pushing or pulling on the vehicle, and it must be designed for the conditions of a hard stop, not the conditions at rest.

## Regenerative braking is not enough

Electric tractors can brake by running the motor as a generator, returning energy to the battery. Chapter 4 counted that energy. It is useful for ordinary slowing, but it cannot replace friction brakes for a hard stop.

This is an illustration. At the start of a hard stop at 10 km/h, the friction brakes absorb about **11,125 × 2.778 = 30.9 kW**, nearly four times the motor's 8 kW rating. Limited to 8 kW, regeneration at top speed could produce only about **8,000 ÷ 2.756 = 2,903 N** of braking force, a deceleration of **(2,903 + 852) ÷ 5,790 = 0.65 m/s²** for the loaded train, less than a third of what the friction brakes provide. The energy in the stop is modest, **½ × 5,790 × 2.778² = 22,338 J**, but it must be absorbed in a couple of seconds, and only friction brakes can do that.

## Checking the brakes in service

A brake system that was balanced when new drifts as pads wear, discs glaze, fluid absorbs water and cables stretch. The calculation above sets the design; a simple routine keeps the vehicle close to it.

```figure
type: checklist
title: Brake checks for a tow tractor in service
caption: A practical routine for the running case. The vehicle maker's maintenance schedule and inspection requirements govern where they differ.
- Pre-shift: pedal firm, with free travel the same as yesterday, and the parking brake holding on the ramp
- Weekly: a stopping test with the loaded train on a marked dry lane, from a set speed, with the distance recorded
- Monthly: pad thickness, disc condition and any fluid leaks at calipers and hoses
- After any brake work: the loaded stopping test repeated, and the tyre marks checked to confirm the front wheels lock first
- Yearly or as the maker specifies: brake fluid replaced, because absorbed water lowers its boiling point
```
The weekly stopping test is the most useful of these, because it measures the whole chain at once. This is an illustration. If the loaded train, from a measured 10 km/h on the dry level lane, normally stops in about 4.6 m with a 1 s reaction allowance, then a stop of 5.5 m means the average deceleration has fallen from about 2.07 to about 1.42 m/s². Something in the chain is losing a third of its force: glazed pads, contaminated discs, air in the fluid or a sticking caliper. A recorded trend shows the drift long before a driver notices it, and it gives the maintenance team a number rather than a complaint.

## Exercise: the wet-floor pedal

With the 48 mm and 40 mm calipers and the 19 mm master cylinder, what pedal force locks the front wheels of the loaded train on a wet level floor? Does the rear lock before or after?

**Worked answer.** On the wet floor, the deceleration at the grip limit is 1.11 m/s² and the front axle load during the stop is 9,497 N. The front wheels lock when each carries **0.3 × 9,497 ÷ 2 = 1,424 N** of brake force, a wheel torque of **356 N·m**. The pressure needed is **356,000 ÷ (2 × 0.35 × 1,810 × 100) = 2.81 MPa**, and the pedal force **2.81 × 283.5 ÷ 5 = 159 N**.

The rear wheels would need **3.86 MPa** to lock, so the front locks first, as it should. The answer also shows how little pedal force a wet floor needs before a wheel locks: 159 N is less than half the dry figure. Drivers trained on dry floors tend to brake too hard on wet ones, which is why braking practice on site should include a wet surface, at low speed, in a clear area.
