---
book: vehicle-mechanics-by-the-numbers
chapterSlug: driving-resistances
order: 2
title: "Driving resistances: rolling, gradient, air and inertia"
description: "Add up the forces a vehicle must overcome on the level, on a ramp and when accelerating, and see why a 6% gradient is not 6 degrees."
draft: false
---

A vehicle moving at steady speed on a level floor still needs a force at its driving wheels, because the tyres and bearings resist rolling and the air resists motion. On a slope, part of the vehicle's own weight pulls it back down. When it speeds up, its mass resists the change. Those four resistances, rolling, gradient, air and acceleration, add up to the tractive force the drive must supply.

This chapter calculates each resistance for the running case, the tow tractor pulling three loaded trailers, on the level and on the 6% ramp. It shows which resistances matter at site speeds and which do not, how uncertain the main coefficient is, and how a misread gradient can almost double the answer.

## Four resistances

The tractive force needed at the driving wheels is the sum of four parts:

```figure
type: formula
title: Total driving resistance
formula: F = f_r × m × g × cos θ + m × g × sin θ + ½ × ρ × c_d × A × v² + λ × m × a
caption: The four standard driving resistances for a vehicle or train of total mass m on a slope of angle θ. Each term is in newtons.
- f_r | rolling resistance coefficient, dimensionless
- θ | slope angle; for a gradient of G per cent, θ = arctan(G ÷ 100)
- ρ, c_d, A | air density (about 1.2 kg/m³), drag coefficient and frontal area, m²
- v, a | speed, m/s, and acceleration, m/s²
- λ | rotating mass factor, which allows for the inertia of wheels, gears and motor
```

The rolling term uses cos θ because only the component of weight normal to the slope presses the tyres down. On gentle site gradients cos θ is very nearly 1, so the rolling resistance on a ramp is almost the same as on the level.

## Rolling resistance

Rolling resistance comes mostly from the tyres deforming as they roll and recovering less energy than they absorbed, with smaller contributions from bearings, seals and the floor. It is expressed as a coefficient times the normal load. The coefficient depends on tyre type and pressure, wheel diameter, floor surface, speed and temperature, and it is one of the most uncertain inputs in vehicle calculations.

This is an illustration. The book uses **f_r = 0.015** for the tractor and its trailers on smooth concrete, as a teaching assumption. The train's total mass is the tractor with driver, 1,890 kg, plus three trailers of 300 kg tare and 1,000 kg payload each, 3,900 kg, which gives **5,790 kg**. On the level:

**F_roll = 0.015 × 5,790 × 9.81 = 852 N**

Of that, the trailers account for **0.015 × 3,900 × 9.81 = 574 N**, which is the steady drawbar pull the tractor must apply on the level, and the tractor itself for 278 N.

Rolling resistance on a real site varies far more than this single figure suggests. Small solid tyres, cracked or dusty floors, expansion joints, door tracks, debris and cold temperatures all raise it. A flat or worn tyre on one trailer can raise it noticeably for the whole train. Chapter 4 shows how the uncertainty carries into battery energy, and the sensitivity table later in this chapter shows how it carries into the force needed on the ramp.

## Gradient resistance

On a slope, the component of weight acting down the slope is **m × g × sin θ**. It is often the largest resistance a site vehicle meets.

Gradients on site are usually stated as a percentage: rise divided by horizontal run, times 100. A 6% ramp rises 0.6 m for every 10 m of horizontal run. The angle is **θ = arctan(0.06) = 3.43°**, with **sin θ = 0.0599** and **cos θ = 0.9982**. For small gradients, sin θ is almost equal to the gradient as a fraction, so using 0.06 directly gives nearly the same answer.

For the train on the 6% ramp:

- Gradient resistance: **5,790 × 9.81 × 0.0599 = 3,402 N**
- Rolling resistance: **0.015 × 5,790 × 9.81 × 0.9982 = 850 N**
- Total at steady speed: **4,252 N**, five times the level figure.

The trailers alone need a drawbar pull of **2,864 N** on the ramp: 2,291 N of gradient resistance and 573 N of rolling resistance. Chapter 3 uses that pull to find the load on the tractor's driving axle.

```figure
type: bars
title: Tractive force needed by the loaded train at steady speed
unit: N
max: 4500
caption: This is an illustration. Total mass 5,790 kg; rolling resistance coefficient 0.015 (teaching assumption); air resistance is negligible at site speeds.
- Level floor, rolling only | 852
- *6% ramp, rolling plus gradient | 4252
- 6% ramp, trailers' drawbar pull only | 2864
```

## Air resistance: negligible at site speeds

Air resistance grows with the square of speed. At walking and site speeds it is usually tiny.

This is an illustration. Assume the tractor and trailers present a drag coefficient times frontal area of **c_d × A = 0.8 × 1.6 = 1.28 m²**. At the tractor's top speed of 10 km/h, which is 2.778 m/s:

**F_air = 0.5 × 1.2 × 1.28 × 2.778² = 5.9 N**

That is less than 1% of the level rolling resistance. For comparison, consider a passenger car of 1,500 kg with an assumed c_d × A of 0.65 m² at 100 km/h. Its air resistance is about **301 N**, more than its rolling resistance of about **177 N** with an assumed coefficient of 0.012. Speed changes which resistance dominates. For site vehicles, air resistance can be ignored unless the vehicle runs fast outdoors into a strong wind, and even then it rarely matters as much as the gradient.

## Acceleration resistance

To change speed, the drive must also supply the force that accelerates the mass, **m × a**. The rotating parts of the drive, wheels, gears and especially a fast-spinning motor rotor, must be accelerated in rotation too, which adds to the effective mass. That is allowed for by the rotating mass factor λ, which is greater than 1 and largest in high gear ratios with heavy rotors.

This is an illustration. With an assumed **λ = 1.05** and a gentle acceleration of **0.3 m/s²**, the train needs:

**F_acc = 1.05 × 5,790 × 0.3 = 1,824 N**

That is more than twice the level rolling resistance. On the level, getting started is harder than keeping going. On the ramp, accelerating from rest adds the same 1,824 N to the 4,252 N already needed. Chapter 6 works through acceleration times and distances.

## The error: a 6% ramp read as 6 degrees

The site's first estimate of ramp performance came from a spreadsheet in which the gradient had been entered as an angle: sin 6° = 0.1045. That gives a gradient resistance of:

**5,790 × 9.81 × 0.1045 = 5,937 N**

which is **75% more** than the correct 3,402 N. A 6° slope is about a 10.5% gradient, steeper than the ramp.

The error was found when an engineer checked the ramp against the building drawings. The drawings showed a rise of 600 mm over 10 m of horizontal run, which is 6%, not 6°. The check takes a minute: always confirm a gradient from rise and run, not from a label on a sketch, and always convert percent to an angle with arctan before using sin or cos. The overestimate in this case was harmless on paper, but the same confusion in the other direction would have approved a vehicle for a ramp it cannot climb.

```figure
type: compare
title: A gradient of 6% compared with a slope of 6°
cols: 6% gradient | 6° slope
caption: Gradient in per cent is rise over horizontal run times 100. The two are close only for very gentle slopes.
- Rise per 10 m of horizontal run | 0.600 m | 1.051 m
- Angle | 3.43° | 6.00°
- sin θ | 0.0599 | 0.1045
- *Gradient resistance of the 5,790 kg train | 3,402 N | 5,937 N
```

## How uncertain is the total?

Because rolling resistance is uncertain, it is worth seeing how the answer moves with it. The table below repeats the ramp calculation for a range of coefficients. The gradient term does not change, because it depends only on mass and slope.

```figure
type: compare
title: Sensitivity of the ramp force to the rolling resistance coefficient
cols: Level, N | 6% ramp, N
caption: This is an illustration. Total mass 5,790 kg. The gradient resistance on the ramp is 3,402 N in every row.
- f_r = 0.010 | 568 | 3,969
- *f_r = 0.015 (base) | 852 | 4,252
- f_r = 0.020 | 1,136 | 4,536
- f_r = 0.025 | 1,420 | 4,819
```

On the level, doubling the coefficient doubles the force. On the ramp, the gradient dominates, so a large change in the coefficient changes the total by about 13% at most across this range. That is a useful general lesson: on slopes, get the gradient and the mass right first; on the level, get the rolling resistance right first. Spending effort on the input that dominates is more valuable than refining one that barely moves the answer.

## Steps, door tracks and dock plates

The formulas above assume a smooth floor. Real routes have steps: door tracks, dock plate lips, joints in the slab and the edge where a ramp meets the floor. A wheel meeting a step must be lifted over it, and the force needed to do that at low speed can be far larger than the rolling resistance.

For a wheel of radius r rolling slowly against a step of height h, the horizontal force needed at the axle to lift a wheel load W_w over the edge is, from moments about the step edge:

**F = W_w × √(2rh − h²) ÷ (r − h)**

This is an illustration. Each trailer carries 1,300 kg on four castors, a wheel load of **1,300 × 9.81 ÷ 4 = 3,188 N**. With castor wheels of 100 mm radius meeting a 20 mm door track, the factor is **√(2 × 0.1 × 0.02 − 0.02²) ÷ (0.1 − 0.02) = 0.750**, so each wheel needs about **0.750 × 3,188 = 2,391 N** to climb the step slowly. That is almost three times the whole train's level rolling resistance, concentrated on one wheel at a time. A 250 mm radius tractor wheel facing the same step needs a factor of only 0.426, which is why large wheels cope with rough floors so much better than small castors.

In practice the train meets steps at speed, so momentum carries the wheels over, but the force appears as a shock in the drawbar, the castors, the hitch and the load. Flush door tracks, bevelled dock plate lips and maintained joints reduce rolling resistance, damage and spilt loads at the same time. A walk of the route with a straightedge and a list of every step over 5 mm is a worthwhile part of any route assessment.

## Measuring rolling resistance on site

The most reliable way to pin down the rolling resistance for a particular route is to measure it. A simple method is a pull test: tow the train slowly at steady speed on a level section with a load cell or spring scale in the drawbar, and read the force. The reading is the trailers' rolling resistance; divide by the trailers' weight to get the coefficient. Repeat on the dirtiest, most cracked section of the route as well as the cleanest, because the worst section sets the requirement.

This is an illustration. A pull test on the warehouse floor reads 610 N for the three loaded trailers. Their weight is 3,900 × 9.81 = 38,259 N, so the measured coefficient is **610 ÷ 38,259 = 0.016**, close to the assumed 0.015. On a cracked section near the dock, the same test reads 900 N, a coefficient of 0.024. The site now uses 0.024 for the dock route.

## A resistance budget for the route

The most useful output of this chapter is not any single number but a short table for the route: each section, its gradient, its surface and the steady force the train needs there. For the running case, the route has four kinds of section:

1. **Warehouse floor**, level, smooth: 852 N at the assumed coefficient, or about 900 N measured.
2. **Dock area**, level, cracked: about 1,360 N at the measured coefficient of 0.024 for the whole train.
3. **Ramp**, 6% up, smooth concrete: 4,252 N.
4. **Assembly hall**, level, smooth, with two door tracks: 852 N, plus brief shocks at the tracks.

The ramp sets the force requirement, by a wide margin. The dock sets the energy penalty for every trip, because the train spends more time there than on the ramp. The door tracks set the shock loads on castors and hitches. Each points to a different decision: traction and gearing for the ramp, floor repair for the dock, and track replacement for the doors. A budget like this turns a set of formulas into a maintenance and investment conversation.

The budget also exposes what is not known. If nobody has measured the dock floor, the coefficient there is a guess, and the energy estimate in Chapter 4 inherits that guess. Marking such numbers as assumptions in the budget keeps them visible until someone measures them.

## Exercise: a fourth trailer

The site wants to add a fourth identical loaded trailer. Calculate the steady tractive force on the level and on the 6% ramp, and the drawbar pull on the ramp, using f_r = 0.015.

**Worked answer.** The train mass becomes **5,790 + 1,300 = 7,090 kg**, and the trailers weigh **4 × 1,300 = 5,200 kg**.

- Level: **0.015 × 7,090 × 9.81 = 1,043 N**.
- Ramp: rolling **0.015 × 7,090 × 9.81 × 0.9982 = 1,041 N**, gradient **7,090 × 9.81 × 0.0599 = 4,166 N**, total **5,207 N**.
- Drawbar pull on the ramp: rolling **0.015 × 5,200 × 9.81 × 0.9982 = 764 N**, gradient **5,200 × 9.81 × 0.0599 = 3,055 N**, total **3,819 N**.

The ramp force rises by about 955 N, 22%. Whether the tractor can provide it depends on the grip of its driving wheels, which Chapter 3 calculates. The answer there is that it cannot, on a wet ramp, even with three trailers.
