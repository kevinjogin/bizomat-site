---
book: clutches-and-brakes-by-the-numbers
chapterSlug: friction-linings-and-measuring-torque
order: 2
title: "Friction linings and measuring torque"
description: "How friction linings behave, why a design uses a low friction coefficient for a brake and a high one for the parts behind a clutch, and how to measure torque with a brake arm."
draft: false
---

Every friction device in this book rests on one number, the coefficient of friction between the lining and the surface it rubs on, and that number is the least certain in the whole calculation. A bolt's strength or a shaft's diameter is known to a percent or two. A lining's friction coefficient can move by a quarter with temperature, speed, wear, moisture and a film of grease, and it is never quite the same in a test as in service.

This chapter covers what friction linings are, how their friction behaves, and how a designer chooses the friction coefficient to put into a calculation. It then covers the oldest and simplest way to measure torque, the brake arm, using the BIZOMAT Prony brake tool to test the SW-25's backup engine. Its mistake is a test reading taken without its zero.

## Friction in a lining

The simple model of dry friction says that the friction force is the normal force times a coefficient, F = μN, and that it does not depend on the contact area or the sliding speed. For clutch and brake design that model is useful and incomplete. It is useful because the torque of every device in this book comes from it. It is incomplete because the coefficient of a real lining changes with its working conditions.

```figure
type: compare
title: What moves a lining's friction coefficient
cols: Effect | Typical direction | What the designer does
rowhead: Condition
- Temperature | Many organic linings lose friction when hot, called fade | Keep surface temperature within the maker's limit; check heat per stop and per hour
- Sliding speed | Friction often falls a little as speed rises | Use the maker's value at the working speed
- Static against sliding | Breakaway friction is usually higher than sliding friction | Use sliding friction for stopping, static for holding only with care
- Bedding in | New linings carry less until they wear to full contact | Bed in before proof testing
- * Oil, grease or water | Friction can fall by more than half | Shield the lining; treat contamination as a failure case
- Glazing | A hard, shiny surface forms after overheating | Inspect; resurface or replace
caption: The directions are general tendencies. The size of each effect depends on the lining material, and the lining maker's data governs a real design.
```

### Lining families

Linings are made in a few broad families. Moulded organic linings bind fibres and fillers in a resin and are used in most industrial brakes and dry clutches. Woven linings are flexible and suit bands that wrap round a drum. Sintered metal linings, usually bronze or iron based, tolerate higher temperatures and are common in heavy-duty and oil-immersed clutches. Carbon and ceramic materials appear where temperatures are highest.

As a rough guide, dry moulded and woven linings against cast iron or steel are often designed with friction coefficients of about 0.3 to 0.4, and the same kinds of materials running in oil with figures nearer 0.1. These are typical design values quoted in machine design texts, used in this book for illustration. A real design takes the coefficient, its spread with temperature and its pressure and temperature limits from the lining maker.

### Pressure, speed and heat limits

A lining can fail in three ways that have nothing to do with its friction coefficient. Pressed too hard, it crushes or wears very quickly, so each lining has a pressure limit. Rubbed too fast under pressure, it overheats at the surface, so makers often give a limit on the product of pressure and rubbing speed. And heated too much overall, by many stops or a long slip, its binder breaks down.

The SW-25's devices work at low rubbing speeds. The clutch's mean friction radius of 120 mm turns at 72.5 rpm, a rubbing speed of 0.91 m/s; the band brake's 350 mm rim turns at 5.3 rpm while lowering at 10 m/min, a rubbing speed of 0.19 m/s. At those speeds, pressure and total heat govern, not the pressure-speed product.

## Choosing the friction coefficient for a calculation

The same uncertainty points in opposite directions for different questions. For a brake that must hold or stop a load, a low friction coefficient is the dangerous case: if the lining turns out to have less friction than assumed, the brake is weaker than designed. For the shafts, keys and gears behind a clutch, a high friction coefficient is the dangerous case: a clutch with more friction than assumed transmits more torque before it slips, and the parts it protects see a bigger peak.

```figure
type: decision
title: Which end of the friction range to design with
question: What could go wrong if the lining's friction is not what was assumed?
- A brake fails to hold or stops too slowly | use the low end of the range for the brake's torque
- A clutch slips under its working load | use the low end for the clutch's capacity
- * Parts behind a clutch are overloaded when it grabs | use the high end for the peak torque those parts must carry
- A lining overheats | use the torque that actually occurs, at the friction actually expected
caption: The SW-25's clutch is designed for its capacity with μ = 0.30, but its maker's range of 0.25 to 0.40 is used to find the largest torque the clutch can pass to the open gears. This is an illustration.
```

For the SW-25's clutch in Chapter 3, a friction coefficient of 0.30 gives a capacity of 648 N·m. If the lining's true value is 0.25 the capacity is 540 N·m; if it is 0.40, the clutch will pass 864 N·m before it slips, a third more than its rating. The open gears and the gearbox output shaft must be checked for that higher figure.

A practical way to carry both ends of the range through a design is to write them down at the start, with the nominal value between them, and to state beside every result which one it used. The SW-25's design sheet lists μ as 0.25 minimum, 0.30 nominal and 0.40 maximum for the clutch, and 0.30 minimum and 0.35 nominal for the band lining. A reviewer can then see at a glance that the brake's holding figure used 0.30 and the gear check used 0.40, without searching the calculation for an unstated assumption.

## Measuring torque with a brake arm

The torque a machine delivers, or the torque a clutch or brake can carry, can be measured with nothing more than a lever and a scale. A brake is clamped round the shaft and loaded until it absorbs the power the machine delivers; the brake's frame is prevented from turning by an arm pressing on a scale. In steady running, the torque the shaft puts into the brake equals the torque the arm puts into the scale.

This is the Prony brake, named after the French engineer who described it in the early nineteenth century, and its water-cooled descendants, the absorption dynamometers, still test engines today. Its value in a workshop is that it needs no electronics and that every number in it can be checked with a tape measure.

```figure
type: svg
title: A brake arm measuring the torque of a running shaft
alt: A shaft in cross-section at the left centre, gripped by two wooden blocks clamped together by bolts with springs. A long horizontal arm extends from the blocks to the right and presses down on a scale. The distance from the shaft centre to the point where the arm meets the scale is marked L. An arrow round the shaft shows its direction of rotation, which tends to turn the blocks and arm downward onto the scale.
caption: The shaft's torque tries to turn the blocks with it; the arm transfers that torque to the scale as a force. Torque = (scale reading − zero reading) × L, where the zero reading is the scale's reading from the arm's own weight with the brake slack.
viewbox: 0 0 640 280
body:
<circle class="bx" cx="140" cy="140" r="34"/>
<rect class="fa" x="96" y="88" width="88" height="24"/>
<rect class="fa" x="96" y="168" width="88" height="24"/>
<path class="ln" d="M110 88V70M170 88V70M110 192V210M170 192V210"/>
<path class="ln" d="M184 100H520"/>
<rect class="bx" x="500" y="104" width="60" height="70"/>
<text class="tx txs" x="508" y="146">Scale</text>
<path class="la" d="M520 100V104"/>
<path class="dsh" d="M140 240H520"/>
<path class="la" d="M140 240H520"/>
<text class="txb" x="320" y="262">L</text>
<path class="la" d="M100 140A40 40 0 0 1 140 100"/>
<text class="tx txs" x="40" y="130">rotation</text>
<text class="tx txs" x="200" y="84">arm</text>
```

The [Prony brake tool](/tools/prony-brake/) does this arithmetic. It takes the arm length, the scale reading with the brake absorbing power, the zero reading with the brake slack, and the shaft speed. It returns the net brake reading, the torque, the power absorbed in kilowatts and horsepower, and the heat that must be carried away, in kilojoules an hour. It assumes steady running; in practice the reading fluctuates with the friction and is averaged.

### Testing the SW-25's backup engine

The SW-25's backup petrol engine is rated at 7.5 kW at 3,000 rpm and drives the gearbox input shaft through a belt at 1,450 rpm. Before the refit was signed off, the yard tested what the engine actually delivers at that shaft. With the motor uncoupled, a water-cooled band brake was fitted to the gearbox input coupling, with an arm 0.6 m from the shaft centre to a platform scale.

```figure
type: steps
title: The backup engine test in the Prony brake tool
caption: This is an illustration. Arm 0.6 m, scale reading 72.5 N under load, zero reading 3.5 N, shaft at 1,450 rpm with the engine at full throttle.
- Brake reading | 69.0 N
- Torque | 41.40 N·m
- * Power absorbed | 6.286 kW
- Heat to remove | 22,631 kJ/h
```

The engine's rating of 7.5 kW, less about 5% in the belt, would give 7.125 kW at the shaft. The test gave 6.286 kW, 88% of that. For a small air-cooled engine on a hot Cairns afternoon that is plausible: engine ratings are usually stated at standard conditions, and output falls as air temperature rises. The yard recorded the measured figure as the engine's working output and used it in Chapter 6.

The heat line is a reminder of what a brake test involves. Absorbing 6.3 kW continuously needs a water flow: at a 20 K rise in the cooling water, 6,286 ÷ (4,180 × 20) = 0.075 kg/s, about 4.5 L/min. A dry block brake on a shaft at this power would be smoking within a minute.

## Measuring a clutch's friction on the bench

A brake arm also measures a clutch's slipping torque, and from it the friction coefficient. With the clutch engaged at its working spring force and its output shaft locked, a torque wrench on the input is turned slowly until the clutch slips. The torque at which it slips, divided by the clamp force, the number of faces and the mean friction radius, gives the friction coefficient under the conditions of the test.

For the SW-25's clutch, the yard bench-tested a new plate set at a spring force of 4,500 N with four friction faces and a mean radius of 120 mm. It slipped at 620 N·m, which gives μ = 620 ÷ (4,500 × 4 × 0.12) = 0.287. That is within the lining maker's range and a little below the design value of 0.30. Because a slow, static test measures breakaway friction, which is usually higher than the sliding friction during an engagement, the yard took the test as a check that the linings were not contaminated, not as proof that sliding friction would be 0.287 or better.

## Wear, lining thickness and life

Every joule a lining turns into heat also wears it a little. To a first approximation, the volume of lining worn away is proportional to the friction energy it has absorbed, and some lining makers state a wear rate in those terms: cubic millimetres of lining per megajoule of friction work at a stated temperature. With such a figure, the energy per year and the lining's rubbing area give a wear rate in millimetres a year.

The SW-25's band brake lets down about 150 boats a year. At 929 kJ for an ordinary lowering, that is 150 × 929 = 139,350 kJ, or 139.4 MJ a year. The band's lining is 100 mm wide and wraps 270° of the 700 mm rim, a length of π × 700 × 270 ÷ 360 = 1,649 mm and an area of about 164,900 mm². If the lining maker's wear rate were 200 mm³ per MJ, the year's wear would be 139.4 × 200 = 27,870 mm³, and spread over the band it would be 27,870 ÷ 164,900 = 0.17 mm a year.

```figure
type: stats
title: Estimated band lining wear on the SW-25
caption: This is an illustration. The wear rate of 200 mm³ per MJ is a figure for the example only; wear rates vary widely with material and temperature, and a real estimate uses the lining maker's figure at the expected working temperature. Wear is far from uniform round a band: the tight end, where the pressure is highest, wears fastest.
- Lowerings a year | 150
- Friction energy a year | 139.4 MJ
- Rubbing area of the band lining | 164,900 mm²
- * Average wear a year | 0.17 mm
```

An estimate like this is not a prediction of lining life; it is a way of choosing an inspection interval. A lining 6 mm thick that must be replaced at 3 mm remaining would last many years at that rate, so the useful question is what could make the wear much faster: overheating from long lowerings in hot weather, contamination, or a brake that drags because it is adjusted too tight. The yard measures the band lining's thickness at the tight end, the middle and the slack end every six months, and compares each set with the last. A sudden change between two inspections says more about the brake's condition than any calculated life.

The same record serves the clutch, where the energy per engagement is small but the number of engagements is large. The clutch plates' thickness and the spring force at the working clearance are measured at each annual service. A spring force that has dropped means the plates have worn and the clutch's capacity has fallen with it, by the same proportion.

## The mistake: a reading without its zero

The first sheet from the engine test recorded only the loaded scale reading, 72.5 N. Worked as if it were the brake force, it gives 72.5 × 0.6 = 43.5 N·m and 6.605 kW, 5.1% more than the true figure. The arm, the brake blocks and the water hoses all weigh something, and part of that weight rests on the scale whether the brake is working or not.

The error was found when the test engineer compared the two sheets: the method statement asked for a zero reading with the brake slack and the engine stopped, and the first sheet had no entry in that box. The test was repeated with the zero taken before and after, and the two zero readings, 3.4 N and 3.6 N, averaged to 3.5 N.

A related error, just as common, is measuring the arm from the wrong point. The length that matters is from the centre of the shaft to the point where the arm bears on the scale, along a line square to the arm's force. Measured from the surface of the coupling, 25 mm too short, the same readings would understate the torque by about 4%.

```figure
type: checklist
title: Before trusting a brake-arm torque reading
caption: From the yard's test method for the backup engine. This is an illustration.
- x Arm length measured from the shaft centre to the bearing point on the scale
- x Arm horizontal, so the scale force is square to the arm
- x Zero reading taken with the brake slack, before and after the test
- x Speed measured at the same time as the reading, on the braked shaft
- x Readings averaged over a steady period, not taken at a peak
- x Cooling water flowing before load is applied
- ? Ambient temperature recorded, for comparison with the engine's rating conditions
```

## Exercise: checking the winch motor on a brake

**Problem.** During commissioning, the yard checks that the SW-25's motor can deliver its rated torque. A brake arm 0.5 m long is fitted to the motor shaft. At 1,450 rpm the scale reads 75.0 N; with the brake slack it reads 2.6 N. The motor's rating is 5.5 kW at 1,450 rpm. Find (a) the torque and power, (b) the torque as a share of the rated torque, and (c) the error if the arm had been measured as 475 mm by mistake.

**Answer.** (a) Net reading = 75.0 − 2.6 = 72.4 N. Torque = 72.4 × 0.5 = 36.20 N·m. Power = 36.20 × 151.84 = 5,497 W, or 5.50 kW.

(b) Rated torque = 5,500 ÷ 151.84 = 36.22 N·m. The measured torque is 99.9% of rated: the motor delivers its rating at its rated speed.

(c) With 0.475 m the torque would be 72.4 × 0.475 = 34.39 N·m and the power 5.22 kW, 5% low. The motor would appear to be under-performing when it is not.

**The check.** The heat to remove is 5,497 × 3.6 = 19,788 kJ an hour, so this test also needs a water-cooled brake, and it should run only long enough to take steady readings.
