---
book: clutches-and-brakes-by-the-numbers
chapterSlug: engaging-a-friction-clutch
order: 4
title: "Engaging a friction clutch"
description: "What happens while a clutch slips: slip time, the energy that becomes heat, the snatch on the load, plate temperature rise and engagements per hour, on the shaft where the clutch sits."
draft: false
---

Chapter 3 sized the SW-25's clutch to carry its load once engaged. This chapter is about the moment of engagement, when the driving side is turning and the driven side is not, and the clutch slips until they match. During that slip three things happen at once: the load is accelerated, energy is turned into heat in the plates, and the torque the clutch transmits jerks everything downstream of it.

The chapter works the SW-25's engagement with the BIZOMAT friction clutch engagement design tool, shows the energy balance that makes half the input energy heat, and uses the result to choose how fast the clutch should engage. Its mistake is a speed taken from the wrong shaft, which multiplied the calculated engagement heat by two hundred.

## The physics of a slipping engagement

Take a clutch whose driving side turns at a constant speed ω and whose driven side starts at rest, carrying an inertia J and a load torque TL. While it slips, the clutch transmits its full friction torque Tc. The torque left over to accelerate the driven side is Tc − TL, so the driven side speeds up at (Tc − TL) ÷ J and reaches the driving speed after a slip time ts = J ω ÷ (Tc − TL).

Throughout the slip, the driving side turns at ω and the driven side's average speed is ω ÷ 2. The clutch therefore slips through an angle of ω ts ÷ 2, and the friction work, which all becomes heat, is Tc × ω ts ÷ 2. That is exactly half the work the driving side puts in, Tc × ω ts. The other half goes into the load: its kinetic energy and the work done against the load torque during the slip.

```figure
type: formula
title: A clutch engagement from rest at constant driving speed
formula: ts = J ω ÷ (Tc − TL)
formula: Heat = Tc ω ts ÷ 2 = Tc J ω² ÷ (2 (Tc − TL))
formula: Temperature rise ≈ Heat ÷ (m c)
caption: Tc is the clutch's slipping torque, TL the load torque on the driven side, J the driven inertia, ω the driving speed, m and c the mass and specific heat of the plates that absorb the heat. With no load torque the heat equals the kinetic energy given to the load: exactly as much energy is lost as is delivered.
- ω | driving-side speed, rad/s
- J | driven-side inertia on the clutch shaft
- m c | heat capacity of the plates in the short term
```

The last line of the figure is the result worth remembering. An engagement against inertia alone always wastes as much energy as it delivers, however good the clutch. A load torque makes it worse, because the slip lasts longer while the clutch works against the load.

## The SW-25's engagement

The operator starts the motor with the clutch out, so the gearbox output runs at 72.5 rpm, 7.592 rad/s. The boat sits on the slipway with the rope taut, held by the band brake. The operator engages the clutch and releases the band brake together, and the clutch must accelerate the drum and boat to hauling speed against the hauling load.

Chapter 1's figures give the driven side's inertia and load on the clutch shaft. The boat and cradle contribute 25,000 × 0.3² ÷ 22.5² = 4.444 kg·m², the drum and gear 25 ÷ 22.5² = 0.049 kg·m², and the clutch's driven plates, shaft and pinion an estimated 0.35 kg·m²: 4.844 kg·m² in all. The load torque is the hauling torque at the clutch shaft, 354.5 N·m.

The [friction clutch engagement design tool](/tools/clutch-engagement-design/) takes the load inertia at the clutch, the driving speed, the load torque during engagement, a target engagement time and a service factor; the friction faces' outside and inside diameters, their number, the friction coefficient and the allowable lining pressure; and the mass and specific heat of the plates and the engagements per hour. It finds the torque to start the load in the target time, multiplies it by the service factor to get the design torque, and returns the clamp force for that torque by the uniform-wear model, the peak lining pressure, the actual slip time at the design torque, the energy per engagement, the plate temperature rise and the average heat at the stated rate. It assumes a constant driving speed and that the plates' own mass absorbs the heat.

```figure
type: steps
title: The SW-25 engagement in the clutch engagement design tool
caption: This is an illustration. J = 4.844 kg·m², 72.5 rpm, load torque 354.5 N·m, target 1 s, service factor 1.5; linings 300 × 180 mm, four faces, μ = 0.30, allowable pressure 0.25 MPa; 12 kg of plates at 460 J/(kg·K); six engagements an hour.
- Torque to start in 1 s | 391.2 N·m
- Design torque, × 1.5 | 586.8 N·m
- Clamp force | 4.08 kN
- Peak lining pressure | 0.120 MPa: within 0.25 MPa
- * Slip time at the design torque | 0.158 s
- Energy per engagement | 0.35 kJ
- Temperature rise per engagement | 0.06 K
- Average heat | 1 W
```

The clamp force the tool asks for, 4.08 kN, is below the 4,500 N the SW-25's springs give, which agrees with Chapter 3: the chosen clutch is bigger than the engagement needs. The heat is trivial: a third of a kilojoule, warming the plates by six hundredths of a kelvin. At 72.5 rpm, with a driven inertia under 5 kg·m², a clutch engagement simply does not hold much energy.

## The snatch

The number that matters on the SW-25 is not the heat but the slip time. At the design torque the clutch locks up in 0.158 s. With the actual clutch, whose springs give 648 N·m, it is quicker still. Its torque exceeds the load torque by 648 − 354.5 = 293.5 N·m, which accelerates the driven side at 293.5 ÷ 4.844 = 60.6 rad/s², and it reaches 7.592 rad/s in 0.125 s.

During that eighth of a second the boat is accelerated at 60.6 ÷ 22.5 × 0.3 = 0.81 m/s². Accelerating 25 t at 0.81 m/s² takes 20,200 N on top of the 25,255 N hauling pull: a rope tension of about 45,500 N, 1.8 times the steady pull. Rope stretch and the cradle's slack soften this, but the yard's riggers had noticed exactly this snatch on the old winch: the cradle jerked forward at the start of every haul.

```figure
type: compare
title: Two ways to engage the SW-25's clutch
cols: Clutch slips at | Slip time | Heat per engagement | Peak rope tension
rowhead: Engagement
- Springs applied at once | 648 N·m | 0.125 s | 0.31 kJ | about 45,500 N, 1.8 × steady
- * Air pressure ramped, torque held near 391 N·m | 391 N·m | 1.00 s | 1.49 kJ | about 27,800 N, 1.1 × steady
caption: This is an illustration. Rigid rope and constant clutch torque during the slip. The slower engagement produces nearly five times the heat, which at this speed is still under 0.3 K of plate temperature rise, and removes most of the snatch.
```

Because the clutch is released by air and engaged by springs, its engagement can be slowed simply by letting the air out through a flow restrictor. The yard set the restrictor so the clutch takes about a second to lock up. The slip then lasts eight times as long and generates nearly five times the heat, 1.49 kJ instead of 0.31 kJ, which raises the plates' temperature by about 0.27 K. In exchange, the rope tension during the start falls from about 1.8 to about 1.1 times the steady pull.

### Where the energy goes

The slow engagement's energy balance shows where every joule goes. The driving side does 391.2 × 7.592 × 1.000 = 2,970 J of work during the second of slip. The clutch turns half of that, 1,485 J, into heat. The boat, drum and driven plates gain 139.6 J of kinetic energy, and the load torque absorbs the remaining 1,346 J, which is the work of hauling the boat a little way up the slip during the engagement. The heat equals the kinetic energy plus the load work, as the formula says it must.

```figure
type: bars
title: Where the driving side's work goes during a 1 s engagement
x: Share
y: Energy, J
caption: This is an illustration. Slipping torque 391.2 N·m, driving speed 7.592 rad/s, J = 4.844 kg·m², load torque 354.5 N·m. Heat is always half the driving side's work in a constant-torque engagement from rest.
- * Heat in the clutch | 1485
- Work against the load | 1346
- Kinetic energy of the driven side | 140
```

## Slack in the rope

The calculation above assumes the rope is taut when the clutch engages, so the boat starts to move as soon as the drum does. If the rope is slack, the engagement happens in two stages, and the second is the dangerous one.

In the first stage the clutch accelerates only the drum, the open gear and its own driven plates, about 0.40 kg·m² on the clutch shaft. With 648 N·m of slipping torque, that takes under five milliseconds, and the drum is then turning at full hauling speed with only 11.5 J of kinetic energy. In the second stage the rope comes tight. Now the boat must be brought from rest to rope speed, not by a slipping clutch whose torque is limited, but by the stretch of the rope, with the whole drive train behind it already locked up and turning. The force rises until the rope has stretched enough to accelerate the boat, and with a short, stiff rope it can rise well above the clutch's slipping torque, because the clutch is no longer slipping and the motor's own torque and inertia are now driving the rope.

The yard's operating rule therefore puts the slack out of the rope before the haul: the operator inches the drum round with the clutch partly engaged until the rope is tight, then engages fully. The rule costs a few seconds and removes the largest shock the winch can produce.

## Why a friction clutch, not a dog clutch

Many winches use a dog clutch: two sets of square teeth that engage positively. A dog clutch carries far more torque for its size, cannot slip and costs less. It also cannot be engaged while one side is turning and the other is not; the teeth would strike each other and the load would be started by an impact. A dog clutch is engaged with everything at rest and the brake holding the load.

The SW-25 uses a friction clutch because the yard wants to engage the drive with the motor running and the boat held, and to control the start with the clutch's slip. The price is the slipping, the heat and the wear examined in this chapter, and a capacity that depends on the friction coefficient and the spring force. Where a dog clutch is used, the start is controlled instead by the motor, with a soft starter or a variable-speed drive, and the dog clutch only connects and disconnects the drum.

## When the heat does matter

Clutch heat grows with the square of the speed difference across the clutch. The SW-25's clutch is on a slow shaft, so its engagements are cool. A clutch on a motor shaft at 1,450 rpm, twenty times faster, would release four hundred times the kinetic energy per engagement for the same inertia at its own shaft. That is the regime in which engagement heat, engagements per hour and the plates' cooling between engagements govern the design.

The engagement design tool reports two heat results. The temperature rise per engagement treats the plates as absorbing the whole energy before any is lost to the air, which is right for one quick engagement. The average heat in watts, energy per engagement times engagements per hour, is what the clutch must shed to the surroundings in steady duty. A clutch that passes the first check can still fail the second if it is engaged too often, and lining makers commonly state both a limit per engagement and a limit per hour.

For the SW-25 the hourly figure is negligible: six engagements of 1.49 kJ an hour average 2.5 W, less than the heat from the bearings beside the clutch. The yard records the calculation anyway, because the same winch is sometimes used to inch a cradle into position with many short engagements in a few minutes, and the record shows that even fifty such engagements in an hour would average only about 21 W.

## The mistake: the speed from the wrong shaft

The first engagement calculation for the SW-25 used 1,450 rpm as the driving speed, the number on the motor's nameplate, together with the driven inertia of 4.844 kg·m² on the clutch shaft. The tool duly reported a design torque of 1,635 N·m, a clamp force of 11.35 kN, a peak lining pressure of 0.335 MPa against an allowable 0.25 MPa, and 71.3 kJ of heat per engagement, warming the plates by 12.9 K. On that basis the clutch was rejected as too small and too hot.

Every quantity in a clutch calculation must belong to the shaft the clutch sits on. Mixing the motor's speed with the clutch shaft's inertia describes a machine that does not exist. The reviewer found the error by checking the kinetic energy the tool's result implied, 55.8 kJ, against Chapter 1's figure for the whole drive train, under 1 kJ. A result nearly a hundred times larger than the energy of everything that moves cannot be right.

```figure
type: checklist
title: Before trusting a clutch engagement result
caption: The SW-25 review's checks. This is an illustration.
- x Driving speed, inertia and load torque all on the clutch's own shaft
- x Linear masses converted by m r² and the ratio squared
- x Load torque during engagement identified: the full load, or a lighter start
- x Kinetic energy implied by the result compared with the drive train's total
- x Slip time checked for snatch, not only for heat
- x Engagements per hour taken from the operating pattern, not guessed
```

## Exercise: a conveyor clutch on a motor shaft

**Problem.** A conveyor is started through a clutch on its motor shaft at 1,450 rpm. The driven inertia at the clutch is 1.2 kg·m² and the load torque during the start is 25 N·m. The target engagement time is 1.5 s and the service factor 1.5. The single-plate clutch has two faces, linings of 200 × 120 mm, μ = 0.30 and 6 kg of plates at 460 J/(kg·K). The conveyor starts 30 times an hour. Find (a) the design torque and clamp force, (b) the slip time, (c) the heat per engagement and temperature rise, and (d) the average heat.

**Answer.** ω = 151.84 rad/s.

(a) Torque to start in 1.5 s = 1.2 × 151.84 ÷ 1.5 + 25 = 146.5 N·m. Design torque = 1.5 × 146.5 = 219.7 N·m. Clamp force = 4 × 219.7 × 1,000 ÷ (0.30 × 2 × 320) = 4,577 N.

(b) Slip time = 1.2 × 151.84 ÷ (219.7 − 25) = 0.936 s.

(c) Heat = 219.7 × 1.2 × 151.84² ÷ (2 × (219.7 − 25)) = 15,610 J, or 15.6 kJ. Temperature rise = 15,610 ÷ (6 × 460) = 5.66 K.

(d) Average heat = 15,610 × 30 ÷ 3,600 = 130 W.

**The comparison.** The SW-25's clutch generates 0.35 kJ per engagement; this one, on a fast shaft with a quarter of the inertia, generates forty-four times as much. Speed, not torque, makes clutch heat.
