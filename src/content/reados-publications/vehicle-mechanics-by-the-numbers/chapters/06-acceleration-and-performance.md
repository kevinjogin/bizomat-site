---
book: vehicle-mechanics-by-the-numbers
chapterSlug: acceleration-and-performance
order: 6
title: "Acceleration, trip time and the performance envelope"
description: "Find what limits acceleration, calculate time and distance to top speed, build a realistic trip time, and map the steepest slope the train can climb."
draft: false
---

Performance questions on a site are rarely about racing. They are about whether a train reaches speed before the next crossing, how long a trip really takes, and whether a new route with a steeper ramp is within the vehicle's reach. Each is answered by the same equation of motion, applied with the limits that Chapters 2 to 5 have established: the motor curve, the gearing, the grip and the resistances.

This chapter finds the acceleration the tow tractor's train could achieve and what limits it, works out the time and distance to reach top speed, and builds a realistic time for one trip. It then maps the vehicle's performance envelope: the steepest slope it can climb at each speed. The error case is a trip time calculated from distance and speed limit alone, which left the dispatch plan a fifth short.

## The equation of motion

The net force on the vehicle, tractive force minus resistances, accelerates its mass. Chapter 2 introduced the rotating mass factor λ, which accounts for the wheels, gears and motor rotor that must be spun up as well as moved forward:

```figure
type: formula
title: Acceleration from the net force
formula: a = (F_t − F_res) ÷ (λ × m)
caption: This is an illustration. Loaded train 5,790 kg, λ = 1.05, level resistance 852 N. The tractive force is the smallest of what the motor, the power and the grip allow, and the controller may limit it further.
- a | acceleration, m/s²
- F_t | tractive force at the driven wheels, N
- F_res | total resistance: rolling, gradient and air, N
- λ, m | rotating mass factor and vehicle or train mass, kg
step: λ × m = 1.05 × 5,790 = 6,080 kg
step: motor limit a = (7,752 − 852) ÷ 6,080 = 1.13 m/s²
```

The tractive force in that equation is not a single number. At low speed it is limited by the motor's maximum torque through the gearing, 7,752 N from Chapter 5. Above the base speed of about **3.16 km/h**, it is limited by power: **8,000 × 0.85 ÷ v**, or 6,800 W divided by the speed in metres per second. At every speed it is also limited by grip at the driven axle. The smallest of the three governs.

## What limits the acceleration

This is an illustration. With full motor torque and nothing else in the way, the loaded train on the level would accelerate at **1.13 m/s²** from rest. But the grip at the rear axle must also be checked, with the acceleration itself included, because accelerating the train shifts load onto the rear axle in two ways: the tractor's own inertia acts at its CG height, and the trailers' inertia increases the drawbar pull at the hitch.

The rear axle load while accelerating at a on the level is:

**R_rear = [W × 0.8 + m_t × a × 0.5 + (574 + 3,900 × a) × 0.3] ÷ 1.4**

where 574 N is the trailers' rolling resistance and 3,900 kg their mass. Setting μ × R_rear equal to the force needed, 852 + 6,080 × a, and solving gives the grip-limited acceleration:

- **Dry, μ = 0.6:** a = **1.08 m/s²**, with R_rear = 12,347 N and a tractive force of 7,408 N. Slightly below the motor limit, so full torque would just spin the wheels even on a dry floor.
- **Wet, μ = 0.3:** a = **0.42 m/s²**, with R_rear = 11,352 N and a tractive force of 3,406 N.

```figure
type: bars
title: Acceleration limits for the loaded train on the level
unit: m/s²
max: 1.2
caption: This is an illustration. Three loaded trailers, level floor, starting from rest. Motor limit from 60 N·m through a 38:1 ratio; grip limits include load transfer from acceleration and drawbar pull; adhesion coefficients are teaching assumptions.
- Motor torque limit | 1.13
- Grip limit, dry floor | 1.08
- *Grip limit, wet floor | 0.42
- Controller setting | 0.3
```

The tractor's controller is set to limit acceleration to **0.3 m/s²** when loaded. That setting sits below the wet grip limit, so the tractor does not spin its wheels on a wet level floor, and well below the dry limit. It also protects the load. A crate resting on a steel trailer deck with a friction coefficient of 0.3 would start to slide at **0.3 × 9.81 = 2.94 m/s²**, far above any acceleration this train can reach. Acceleration is not what moves loads on trailers; Chapter 7 shows that braking is.

## The empty train

Returning empty, the train weighs only 2,790 kg: the tractor and three trailers at their 300 kg tare. This is an illustration. The level resistance falls to **0.015 × 2,790 × 9.81 = 411 N** and λ × m to **2,930 kg**. The motor alone could accelerate the empty train at **(7,752 − 411) ÷ 2,930 = 2.51 m/s²**, and the grip limits, calculated the same way with the lighter trailers, are about **2.48 m/s²** dry and **1.04 m/s²** wet.

The controller has a single setting of 0.3 m/s² for both cases, which gives the empty train a wide margin on every surface. The loaded train is the case that sets the limit, as it usually is. A controller with separate settings for loaded and empty running is possible, but drivers then need to know which mode they are in, and a train that is wrongly set to the empty mode when loaded would spin its wheels on the first wet start. A single conservative setting is simpler and safer.

## Time and distance to top speed

At constant acceleration, the time to reach a speed v from rest is v ÷ a and the distance is v² ÷ (2a). This is an illustration. The tractor's top speed, set by the motor's 4,000 rpm and the 38:1 ratio, is 9.92 km/h, or 2.756 m/s.

- Time: **2.756 ÷ 0.3 = 9.19 s**
- Distance: **2.756² ÷ (2 × 0.3) = 12.66 m**

Does the motor's power allow 0.3 m/s² all the way? The force needed is 852 + 6,080 × 0.3 = 2,676 N, and the power-limited force falls to that value at **6,800 ÷ 2,676 = 2.54 m/s**, or 9.15 km/h. Above that speed, the acceleration tapers. A step-by-step calculation, adding small increments of speed and time with the force recalculated at each step, gives **9.24 s** and **12.79 m**, almost the same as the simple figures. For this vehicle the simple constant-acceleration estimate is good enough. For a vehicle with less power in hand, the tapering phase can double the time, and the step-by-step method is worth the effort.

## A realistic trip time

Chapter 4 described the route: each way, 520 m of level floor and 40 m of the 6% ramp, with three stops for crossings and doors. The site's rule is 5 km/h on the ramp, and service braking is assumed to be a gentle **0.5 m/s²**.

This is an illustration. Each start and stop costs time compared with travelling the same distance at top speed:

- A start takes 9.19 s and 12.66 m, and a stop takes **2.756 ÷ 0.5 = 5.51 s** and 7.59 m. Covering those 20.25 m at top speed would take 7.35 s, so each stop-start cycle loses **7.35 s**.
- Slowing to 5 km/h for the ramp, climbing or descending it at 5 km/h, and accelerating again loses **16.1 s** compared with running the same 55 m at top speed.

The moving time for one complete trip, both ways, is about **482.7 s**, or **8.0 minutes**, an average speed of 8.35 km/h.

```figure
type: compare
title: Moving time for one trip, built up
cols: Time | What it adds
caption: This is an illustration. Route of 1,120 m in total, both ways; three stops each way; 5 km/h on the ramp; acceleration 0.3 m/s² and service braking 0.5 m/s².
- Distance at the 10 km/h limit | 403.2 s | 1,120 m at 2.778 m/s
- Real top speed 9.92 km/h | 3.2 s | the gearing limits speed slightly below the sign
- Six stops and starts | 44.1 s | 7.35 s lost at each
- Ramp at 5 km/h, both ways | 32.2 s | 16.1 s lost each way
- *Moving time for the trip | 482.7 s | about 8.0 minutes, 20% more than the simple figure
```

The breakdown also shows where time can be won. Each stop costs more than seven seconds, so removing one stop each way saves almost 15 s per trip, about 5 minutes per shift. Raising the ramp limit would save more, but the ramp limit comes from the grip and braking calculations, not from preference, and it stays. Distances matter too: a train starting from a crossing needs 12.66 m to reach top speed, so on a stretch shorter than about 20 m between stops it never reaches top speed at all, and the speed limit sign there is irrelevant to the trip time.

## The error: the trip at the speed limit

The dispatch plan for 20 trips per shift allowed 24 minutes per trip. Its author estimated the driving time as the distance divided by the speed limit: **1,120 m ÷ 2.778 m/s = 403 s**, or 6.7 minutes. With 15 minutes allowed for coupling, loading, unloading and paperwork, the plan showed a margin of **2.3 minutes** per trip.

The real moving time was 8.0 minutes, which left a margin of about **1.0 minute**. Any wait at a crossing or a door used it up. Within a week, trains were running late in the second half of every shift, drivers were tempted to hurry, and supervisors noticed speeds creeping above the limit on the long straight.

The error was not in the arithmetic but in the model: a vehicle never travels a route at its speed limit from end to end. Starts, stops and slow sections are where the time goes, and for a short route with many stops they dominate. The correction was to build the trip time from its parts, as above, and then to verify it by timing ten real trips with a stopwatch. The timed trips averaged slightly more than the calculation, because drivers also slowed for corners and pedestrians. The site then planned with the timed figure, and reduced the stops on the route by relocating one door's crossing, which saved more time than any speed increase could have.

Speed limits should never be the lever used to recover a timetable. The ramp limit of 5 km/h exists because of Chapter 3's grip and Chapter 7's stopping distances; the level limit exists because of pedestrians. A plan that only works if drivers exceed them is a plan that has already failed.

## Checking acceleration on site

Calculated performance should be confirmed by a simple test, and repeated from time to time, because a vehicle that has slowed down is often telling you something. Mark a start line and a line 5 m beyond it on a level, dry aisle. With the loaded train standing at the start line, the driver applies full throttle while a second person times the train to the 5 m line.

This is an illustration. At a constant 0.3 m/s², the time to cover 5 m from rest is **√(2 × 5 ÷ 0.3) = 5.77 s**, from s = ½ × a × t². When the test was run, the train took **6.5 s**, which corresponds to an acceleration of **2 × 5 ÷ 6.5² = 0.237 m/s²**.

The shortfall in acceleration, 0.063 m/s², means about **6,080 × 0.063 = 383 N** of force is missing or being absorbed. That is the same as the rolling resistance coefficient rising from 0.015 to about 0.022. The usual causes are a dragging brake on a trailer, under-inflated tyres, a seized castor bearing or a controller limiting current because of a low or ageing battery. On inspection, one trailer's parking brake was found partly applied because of a stretched cable. The test took two minutes and found a fault that was also costing energy on every trip, which Chapter 4's energy logs would eventually have shown, more slowly.

## The performance envelope: how steep can it climb?

The same three limits that govern acceleration also set the steepest slope the loaded train can climb at steady speed, its gradeability. Each limit gives a different answer, and the smallest governs.

This is an illustration. Solving the climbing force, m × g × (f_r × cos θ + sin θ), against each limit for the loaded train:

- **Motor torque at crawl speed:** 7,752 N allows **12.2%**.
- **Grip on a dry slope:** with load transfer and drawbar pull included, about **11.6%**.
- **Power at 5 km/h:** 6,800 ÷ 1.389 = 4,896 N allows **7.1%**.
- **Grip on a wet slope:** about **4.5%**.
- **Power at top speed:** 6,800 ÷ 2.756 = 2,468 N allows **2.8%**.

```figure
type: bars
title: Steepest slope the loaded train can climb
unit: %
max: 13
caption: This is an illustration. Three loaded trailers, 5,790 kg in total, steady speed, rolling resistance coefficient 0.015. The site's ramp is 6%. Adhesion coefficients and motor characteristic are teaching assumptions.
- Motor torque, crawl speed | 12.2
- Grip, dry slope | 11.6
- Power at 5 km/h | 7.1
- *Grip, wet slope | 4.5
- Power at top speed | 2.8
```

The 6% ramp sits inside the envelope at 5 km/h on a dry surface and outside it on a wet one, which matches Chapters 3 and 4. A proposed second ramp of 8% would be beyond the power available at 5 km/h; the train could climb it only by slowing, to about 4.6 km/h at the power limit, and only when dry. These figures belong in the vehicle's file next to its route, so that a change to either can be checked in minutes.

## Exercise: a livelier controller setting

A driver suggests raising the controller's loaded acceleration setting from 0.3 to 0.5 m/s² to save time. How much time would it save per trip, and what is the catch?

**Worked answer.** For the loaded train, the power limit now begins at **6,800 ÷ (852 + 6,080 × 0.5) = 1.75 m/s**, so the acceleration tapers early; a step-by-step calculation gives 6.36 s to top speed. Each loaded stop-start loses 5.61 s instead of 7.35 s, a saving of 1.74 s. The empty train is not power-limited, and each empty stop-start saves **1.84 s**. Over three loaded and three empty stops, the trip saves about **10.7 s**, around 2%.

The catch is grip. The wet-floor grip limit for the loaded train on the level is 0.42 m/s². A setting of 0.5 m/s² would spin the wheels on every wet start, wearing tyres and, on a slope, risking a slide. The saving is small and the risk is real, so the setting stays at 0.3 m/s². Fewer stops, as the error case showed, are a far better way to save time.
