---
book: vehicle-mechanics-by-the-numbers
chapterSlug: axle-loads
order: 1
title: "Mass, centre of gravity and axle loads"
description: "Find a vehicle's centre of gravity and axle loads by weighing and by moments, and see why the load on the driven axle sets almost everything that follows."
draft: false
---

Almost every question about a vehicle starts with where its weight sits. How much grip the driven wheels have, how hard it can brake, how fast it can turn and when it will tip all depend on the vertical load on each axle and on the height of the centre of gravity. Those two numbers are easy to estimate badly and easy to measure well.

This chapter treats the vehicle as a rigid body resting on two axles. It shows how to calculate axle loads from the position of the centre of gravity, how to find that position by weighing, and how added equipment shifts the loads. The running case is the battery-electric tow tractor introduced in the book's opening, and the error case is the most common shortcut in vehicle calculations: assuming the weight is shared equally between the axles.

## Mass, weight and the centre of gravity

Mass is measured in kilograms. Weight is the force gravity exerts on that mass, in newtons, found by multiplying the mass by the gravitational acceleration, **g = 9.81 m/s²**. The weight of a body acts as if it were concentrated at one point, the centre of gravity (CG). For a vehicle, the CG combines the chassis, the battery or engine, the body, the driver and any load carried on the vehicle itself.

In plan, the CG sits somewhere between the axles, usually nearer the heavier end. In elevation, it sits at some height above the ground. The horizontal position decides how weight is shared between the axles when the vehicle stands still on level ground. The height decides how much load shifts between axles when the vehicle accelerates, brakes or stands on a slope, and how easily it tips in a turn. This chapter deals mostly with the horizontal position; Chapters 3, 7 and 10 use the height.

## Static axle loads by moments

A vehicle standing on level ground is in equilibrium. Two conditions follow: the axle loads add up to the weight, and the moments about any point balance. Taking moments about the front axle contact gives the rear axle load directly.

```figure
type: formula
title: Static axle loads on level ground
formula: R_rear = W × a ÷ L and R_front = W × b ÷ L
caption: Equilibrium of a two-axle vehicle at rest. a and b are measured horizontally from the centre of gravity to the front and rear axles, and a + b = L.
- W | weight of the vehicle, N (mass × 9.81)
- L | wheelbase, m
- a | distance from the front axle to the centre of gravity, m
- b | distance from the rear axle to the centre of gravity, m
step: Check: R_rear + R_front = W × (a + b) ÷ L = W
```

The formula has a simple reading. The axle farther from the CG carries less; the axle nearer it carries more. If the CG were exactly halfway, each axle would carry half the weight. It rarely is.

## The running case: the tow tractor at rest

This is an illustration. The tow tractor has a mass of 1,800 kg; with a 90 kg driver on board, the operating mass is **1,890 kg**. Its weight is:

**W = 1,890 × 9.81 = 18,541 N**

The wheelbase is 1,400 mm. The CG lies 800 mm behind the front axle, so 600 mm ahead of the rear axle. The heavy traction battery sits low and towards the rear, under the driver's seat, which is why the CG is behind the middle of the wheelbase.

- Rear axle load: **18,541 × 0.8 ÷ 1.4 = 10,595 N**, equivalent to about 1,080 kg.
- Front axle load: **18,541 × 0.6 ÷ 1.4 = 7,946 N**, equivalent to about 810 kg.
- Check: 10,595 + 7,946 = 18,541 N.

The tractor drives through its rear axle. The rear axle load, 10,595 N at rest, is the load that presses the driving tyres onto the floor, and Chapter 3 shows that it sets the limit on how hard the tractor can pull.

```figure
type: stats
title: Static axle loads of the tow tractor with driver
caption: This is an illustration. Loads on level ground at rest; the centre of gravity is 800 mm behind the front axle on a 1,400 mm wheelbase.
- 18,541 N | Total weight | 1,890 kg with driver
- *10,595 N | Rear (driven) axle | 57% of the weight
- 7,946 N | Front (steered) axle | 43% of the weight
```

## Finding the centre of gravity by weighing

Makers' data sheets usually give the unladen mass and sometimes the axle loads, but not always for the configuration a site actually runs: a different battery, a cab, a tow hitch, a toolbox, a driver. The most reliable way to find the horizontal position of the CG is to weigh each axle.

1. Prepare the vehicle as it will operate: battery fitted and charged, attachments on, tyres at working pressure, driver on board or simulated with a weight on the seat.
2. Place it on level ground with the front wheels on a calibrated axle scale or weighbridge pad and the rear wheels on a level packing of the same height. Record the front axle load.
3. Repeat with the rear wheels on the scale.
4. Add the two readings; the sum should agree with the total mass within the scale's accuracy. If it does not, find out why before using the numbers.
5. Calculate the CG position: **a = L × R_rear ÷ W**.

This is an illustration. The tractor's rear axle weighs 1,080 kg and its front 810 kg, a total of 1,890 kg. The CG lies **a = 1.4 × 1,080 ÷ 1,890 = 0.800 m** behind the front axle, which confirms the figure used above.

### Finding the height of the centre of gravity

The CG height is harder to find, but the weighing method extends to it. Weigh the rear axle with the vehicle level, then raise the front axle by a known amount and weigh the rear axle again. Tilting the vehicle nose-up moves the CG rearwards in plan by an amount that depends on its height, so the rear axle load rises.

```figure
type: formula
title: Centre of gravity height from a lift test
formula: h = r + L × ΔR ÷ (W × tan α)
caption: Derived by taking moments with the vehicle tilted nose-up by angle α. r is the height of the axle centres above the ground, equal to the loaded wheel radius when both axles have the same wheels.
- h | height of the centre of gravity above the ground, m
- r | height of the axle centres above the ground, m
- ΔR | increase in rear axle load when the front is raised, N
- α | tilt angle, found from the lift height and the wheelbase
step: Lift 300 mm on a 1,400 mm wheelbase: sin α = 0.3 ÷ 1.4, so α = 12.37° and tan α = 0.2194
step: Measured rise of 74 kg: ΔR = 74 × 9.81 = 726 N
step: h = 0.25 + 1.4 × 726 ÷ (18,541 × 0.2194) = 0.500 m
```

Two practical cautions apply. The suspension and tyres must be locked or their deflection accounted for, and fluids must not move. Battery-electric tractors without suspension are well suited to the test. Vehicles with soft suspension, liquid tanks or loose loads give misleading answers. And the change being measured is small: 74 kg out of 1,890 kg. If each of the two readings is good to ±5 kg, the difference can be out by 10 kg, which makes the CG height uncertain by roughly ±34 mm, which matters for the tipping checks in Chapter 10. For important decisions, measure carefully or ask the manufacturer.

Whatever method is used, record the result with the configuration it applies to: battery type, attachments, tyre type, driver mass and the date. A CG position is a property of a configuration, not of a vehicle model, and the next change to the vehicle makes the old figure out of date. Keeping the weighing sheet with the vehicle's maintenance records means the next calculation starts from a measured number rather than a remembered one.

## Adding equipment and load

Equipment fixed to the vehicle changes both the total weight and how it is shared. The effect follows from the same moment balance. A load placed behind the rear axle adds more than its own weight to the rear axle, because it also lifts some load off the front.

This is an illustration. The site wants to fit a 150 kg toolbox on a rear deck, its own CG 300 mm behind the rear axle. Its weight is 150 × 9.81 = 1,472 N. Taking moments about the front axle:

- Added rear axle load: **1,472 × (1.4 + 0.3) ÷ 1.4 = 1,787 N**
- Change in front axle load: **−1,472 × 0.3 ÷ 1.4 = −315 N**

The rear axle rises to **10,595 + 1,787 = 12,382 N**, and the front falls to **7,946 − 315 = 7,631 N**. The rear gains more than the box weighs, and the front, which steers, loses load. That is good for traction and less good for steering on slippery floors, and it moves the rear axle closer to its rated capacity.

```figure
type: compare
title: Axle loads before and after fitting the rear toolbox
cols: Without toolbox | With 150 kg toolbox
caption: This is an illustration. The toolbox's centre of gravity is 300 mm behind the rear axle, so it adds more than its own weight to the rear axle and lifts load from the front.
- Total weight | 18,541 N | 20,013 N
- *Rear (driven) axle | 10,595 N | 12,382 N
- Front (steered) axle | 7,946 N | 7,631 N
- Front axle share | 43% | 38%
```

Every axle has a rated load set by its maker, and so do the tyres. Check the new axle loads against those ratings before fitting equipment. Rated capacities, not calculations, govern. Where a modification would take an axle or tyre close to its rating, the vehicle maker should be asked to confirm it in writing before the work is done.

## The error: assuming half on each axle

The site's first traction estimate for the ramp, made before anyone weighed the tractor, assumed the weight was shared equally: 18,541 ÷ 2 = 9,270 N on each axle. That is **12.5% less** than the true rear axle load of 10,595 N.

Here the shortcut happened to be pessimistic, so it would have understated the tractor's ability to climb. On a different vehicle it would be optimistic. A front-heavy machine, such as a forklift with its mast and load at the front, carries far less than half its weight on the rear axle when unladen. Assuming half would overstate the grip available to a rear-wheel drive.

The error was found when the maintenance planner asked where the 50/50 split came from, and the answer was "it is usually about half". The correction was to weigh the tractor axle by axle, as described above, and to keep the result with the vehicle's records. A ten-minute weighing replaced an assumption that would have carried through every calculation in this book.

## From axle loads to wheel loads and floor pressure

Axle loads divide between the wheels on each axle. On level ground, with the CG on the centre line, each rear wheel of the tractor carries **10,595 ÷ 2 = 5,298 N**. That wheel load matters in two places that are easy to overlook.

The first is the tyre. Every tyre has a rated load at a stated pressure or, for solid tyres, at a stated speed. A wheel load near the rating leaves little margin for the extra load that slopes, drawbar pull and braking add later in this book.

The second is the floor. A wheel load is carried through a small contact patch, and the floor, a trench cover, a dock plate or a ramp joint must carry the resulting pressure. This is an illustration. If a rear tyre's contact patch is assumed to be 60 cm², or 6,000 mm², the average contact pressure is **5,298 ÷ 6,000 = 0.88 N/mm²**, or 0.88 MPa. Solid tyres on small wheels have small contact patches and high pressures, which is why tow tractors can crack weak floor toppings and damage covers rated for foot traffic. The real contact area comes from the tyre maker or from a footprint test, and the floor and cover ratings from their designers.

A practical rule follows: when a heavier battery, a toolbox or a larger trailer load is proposed, recalculate the wheel loads and check them against the tyre ratings and the ratings of every cover and plate on the route.

## Loads that move

Static axle loads are the starting point, not the whole story. Three effects shift load between axles while the vehicle works:

- **Slopes.** On a gradient, part of the weight acts along the slope, and the CG height turns that into a moment that loads the downhill axle. Chapter 3 calculates it for the 6% ramp.
- **Drawbar pull.** A trailer pulling back on a hitch above the ground creates a moment that loads the rear axle and unloads the front. Chapter 3 includes it.
- **Acceleration and braking.** Inertia acting at the CG height loads the rear axle when accelerating and the front axle when braking. Chapter 7 uses this to explain why the front brakes of most vehicles do most of the work.

Each of these depends on the CG height as well as its horizontal position. That is why the lift test is worth doing, at least once, for a vehicle that works on slopes or near its limits.

## Exercise: a heavier battery

The site considers replacing the tractor's battery with a larger one that is 120 kg heavier. The extra mass sits with its own CG 450 mm ahead of the rear axle. Calculate the new axle loads with the driver on board, and the new horizontal position of the CG.

**Worked answer.** The extra weight is **120 × 9.81 = 1,177 N**. Its CG is 450 mm ahead of the rear axle, so 1.4 − 0.45 = **0.95 m** behind the front axle.

- Added rear load: **1,177 × 0.95 ÷ 1.4 = 799 N**, so the rear axle carries **10,595 + 799 = 11,394 N**.
- Added front load: **1,177 × 0.45 ÷ 1.4 = 378 N**, so the front axle carries **7,946 + 378 = 8,324 N**.
- New total: **18,541 + 1,177 = 19,718 N**, which matches 11,394 + 8,324.
- New CG position: **a = 1.4 × 11,394 ÷ 19,718 = 0.809 m** behind the front axle.

The CG moves only 9 mm rearwards, because the battery sits near the existing CG, but the rear axle gains almost 800 N. If the battery also sits lower than the old one, the CG height falls slightly, which helps stability. Check both axle ratings and the tyre load ratings before approving the change.
