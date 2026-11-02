---
book: vehicle-mechanics-by-the-numbers
chapterSlug: power-and-energy
order: 4
title: "Power, energy and a battery for a shift"
description: "Turn tractive force into motor power at the ramp and on the level, build an energy budget for a trip, and check that a battery lasts a shift with every loss counted."
draft: false
---

Force tells you whether a vehicle can move a load. Power tells you how fast it can do it, and energy tells you how long it can keep doing it. For a battery-electric vehicle, the second question often decides the first in practice: a tractor that can climb the ramp but runs flat before the end of the shift has failed just as surely as one that cannot climb.

This chapter converts the tractive forces from Chapters 2 and 3 into power at the wheels and at the motor, shows why the ramp sets the motor rating, and then builds an energy budget for one trip and a full shift. Its error case is an energy estimate that left out the losses and the empty return trip, and came out a third too low.

## Power is force times speed

Power at the driving wheels is the tractive force multiplied by the vehicle speed:

```figure
type: formula
title: Power at the wheels and at the motor
formula: P_wheel = F × v and P_motor = P_wheel ÷ η_d
caption: F is the tractive force in newtons and v the speed in metres per second, giving watts. η_d is the efficiency of the drivetrain between motor shaft and tyre.
- F | tractive force at the driving wheels, N
- v | vehicle speed, m/s (km/h ÷ 3.6)
- η_d | drivetrain efficiency, gearbox and axle; 0.85 is used in this book as a teaching assumption
step: Level, 10 km/h: 852 × 2.778 = 2,367 W at the wheels; 2,367 ÷ 0.85 = 2,784 W at the motor
step: Ramp, 5 km/h: 4,252 × 1.389 = 5,906 W at the wheels; 5,906 ÷ 0.85 = 6,948 W at the motor
```

## The ramp sets the motor rating

This is an illustration. On the level, the loaded train needs about 2.8 kW from the motor at the tractor's top speed of 10 km/h. On the 6% ramp it needs about 6.9 kW at half that speed. If the train tried to climb at 10 km/h, the motor would have to deliver **4,252 × 2.778 ÷ 0.85 = 13,895 W**, about 13.9 kW, five times the level requirement.

Suppose the tractor's motor is rated at 8 kW for short periods. The highest steady speed it can hold on the ramp is:

**v = 8,000 × 0.85 ÷ 4,252 = 1.60 m/s, or 5.76 km/h**

That is why tow tractors slow down on ramps, and why a site speed limit of 5 km/h on the ramp suits this tractor: it keeps the motor within its short-time rating with a little margin.

Electric motors have more than one rating. A continuous rating is what the motor can deliver indefinitely without overheating; a short-time rating, such as a 60-minute or 5-minute rating, is higher. The ramp climb takes about **40 ÷ 1.389 = 28.8 s** at 5 km/h, well within any short-time rating, but a route with long or repeated climbs needs the continuous rating checked against the average power over a cycle. The motor and controller makers' rating curves govern, and the Library chapter on [selecting electric motors and drives](/reados/collections/machine-elements-and-mechanical-design/selecting-electric-motors-and-drives/) covers duty ratings in more detail.

```figure
type: bars
title: Motor power needed by the loaded train
unit: kW
max: 14
caption: This is an illustration. Drivetrain efficiency 0.85; the 8 kW short-time rating is a teaching assumption. The ramp at full speed needs far more than the motor can give.
- Level at 10 km/h | 2.784
- *Ramp at 5 km/h | 6.948
- Ramp at 10 km/h | 13.895
- Motor short-time rating (assumed) | 8
```

### Peak power and average power

The ramp sets the peak power, but the motor's temperature depends on the average. Twenty trips in an eight-hour shift means one trip every 24 minutes, and each trip draws about 0.331 kWh from the battery, as the budget below shows. The average power drawn over a trip is therefore about **0.331 ÷ 0.4 = 0.83 kW**, around a tenth of the ramp peak. Most of the trip is spent coupling trailers, waiting at crossings and travelling on the level.

That large gap between peak and average is typical of tow tractors and forklifts, and it is why their motors can have short-time ratings well above their continuous ratings. It also shows where the risk lies. A route with a long climb, or a stretch where the tractor runs near its peak for minutes at a time, can overheat a motor whose average looks modest. When a route changes, check both: the peak against the short-time rating, and the longest sustained climb against the time that rating allows.

## Energy is force times distance

Energy, in joules, is force multiplied by the distance over which it acts. Dividing by 3,600,000 converts joules to kilowatt-hours, the unit batteries are rated in. For a battery-electric vehicle, two efficiencies stand between the battery and the tyre: the drivetrain, assumed at 0.85, and the motor controller and motor together, assumed here at 0.9. Energy drawn from the battery is therefore the energy at the wheels divided by both:

**E_battery = E_wheel ÷ (0.85 × 0.9)**

## An energy budget for one trip

This is an illustration. One trip takes three loaded trailers from the warehouse to the assembly hall and brings them back empty. Each way covers 520 m of level floor and 40 m of the 6% ramp. The loaded train is 5,790 kg; the empty train, with trailers at their 300 kg tare, is 2,790 kg.

**Loaded leg, uphill.**
- Level: **852 N × 520 m = 443,039 J**
- Ramp: **4,252 N × 40 m = 170,093 J**
- At the wheels: **613,132 J**; from the battery: **613,132 ÷ (0.85 × 0.9) = 801,480 J**, or **0.223 kWh**

**Empty leg, downhill.** The empty train's rolling resistance is **0.015 × 2,790 × 9.81 = 411 N** on the level. On the ramp going down, the gradient pulls the train forward with 1,639 N against 410 N of rolling resistance, a net 1,229 N that the drive must hold back.

- Level: **0.015 × 2,790 × 9.81 × 520 = 213,485 J** at the wheels, **279,065 J** from the battery.
- Ramp: holding back 1,229 N over 40 m makes **49,177 J** available; if regenerative braking returns half of it to the battery, that is **24,589 J** recovered.
- From the battery: **279,065 − 24,589 = 254,477 J** (rounded), or **0.071 kWh**.

**Starting and stopping.** The train stops three times each way at crossings and doors. Each start from rest to 10 km/h stores kinetic energy, ½ × λ × m × v², with the rotating mass factor of 1.05. Loaded, that is **23,455 J** per start; empty, **11,302 J**. Six starts at the wheels need 104,271 J, or **136,302 J** from the battery, which is **0.038 kWh**. Without regeneration, all of that is lost to the brakes when the train stops. Fewer stops is often the cheapest energy saving on a route.

```figure
type: stats
title: Energy from the battery for one trip
caption: This is an illustration. Rolling resistance coefficient 0.015, drivetrain efficiency 0.85, motor and controller efficiency 0.9, half the descent energy recovered by regeneration, three stops each way. All are teaching assumptions.
- 0.223 kWh | Loaded leg, uphill | level and ramp
- 0.071 kWh | Empty leg, downhill | after regeneration on the ramp
- 0.038 kWh | Starting the train six times | kinetic energy, mostly lost at each stop
- *0.331 kWh | One complete trip | about 1.2 MJ from the battery
```

## A battery for a shift

The site plans 20 trips per eight-hour shift. Driving takes **20 × 0.331 = 6.62 kWh**. Lights, the seat heater and the controller's own consumption are assumed to average 150 W over eight hours, another **1.2 kWh**, for a total of about **7.8 kWh** per shift.

This is an illustration. The tractor's battery is rated at 48 V and 300 Ah, a nominal **48 × 300 ÷ 1,000 = 14.4 kWh**. Lead-acid traction batteries should not routinely be discharged below about 20% remaining, and lithium batteries have their own limits set by the maker, so the usable energy is taken as 80% of nominal, **11.5 kWh**. The shift needs 7.8 kWh, leaving about a third of the usable energy in reserve for detours, a dirty floor, a cold morning or an ageing battery.

That reserve is not luxury. Rolling resistance on the dock floor was measured at 0.024 in Chapter 2, 60% above the assumed value. Battery capacity falls with age and with low temperature. And a busy shift may run more than 20 trips. Each of those erodes the margin. A battery sized with no reserve at the start of its life will fail the shift long before the end of it, so the reserve should be chosen with the battery's expected capacity at replacement age in mind, not its capacity when new.

## The error: wheel energy, loaded only

The first battery check used a simpler calculation: the energy at the wheels for the loaded leg plus the level part of the empty leg, without any efficiencies, accelerations or regeneration. That gave **0.230 kWh** per trip and **4.6 kWh** per shift, which made a smaller, cheaper battery look adequate.

The simple figure was **31% lower** than the full budget. The difference came from three omissions: the 0.765 combined efficiency between battery and tyre, the energy to start the train six times a trip, and, to a lesser degree, the ancillary loads. The error was found when the supplier of the smaller battery asked for the duty cycle and its own calculation came out higher than the site's. The site then built the full budget in this chapter, and kept the larger battery.

The lesson is general. Energy budgets are only as good as the losses they include, and the losses are usually larger than the useful work at the wheels on level ground. Write every assumption down, and compare the budget with logged data from the vehicle as soon as it is running. Then update the budget, not the memory of it.

## Charging

Energy taken out must be put back. This is an illustration. If the tractor uses 7.8 kWh in a shift and its charger delivers 3 kW with a charging efficiency of 0.9, a full recharge takes about **7.8 ÷ (3 × 0.9) = 2.9 hours**. On a two-shift operation, that fits between shifts. On a three-shift operation, it does not, and the site must choose between a spare battery, a faster charger or opportunity charging during breaks. Fifteen minutes on the charger at a meal break returns about **3 × 0.25 × 0.9 = 0.68 kWh**, roughly two trips. Battery chemistry matters here: some batteries tolerate frequent partial charges well and others age faster with them, so the maker's guidance governs the charging pattern.

## Energy that ends up as heat

Every joule the train gains going up the ramp, it gives back coming down. On the empty descent, the budget assumed half of the 49,177 J was recovered by regeneration. The other half, and all of it when the battery is full and cannot accept charge, ends up as heat in the brakes or the motor.

The loaded train descending would release much more. Coming down with full trailers, for example when a delivery is returned, the net force down the ramp is **5,790 × 9.81 × 0.0599 − 0.015 × 5,790 × 9.81 × 0.9982 = 2,551 N**, which over 40 m is **102,056 J**. If the friction brakes absorbed all of it, and their rotating parts were 4 kg of steel with a specific heat of about 460 J/kg·K, they would warm by about **102,056 ÷ (4 × 460) = 55 K** per descent, before any cooling. Repeated loaded descents without regeneration would heat the brakes steadily. That is one reason Chapter 8 treats brake heat as part of brake sizing, not an afterthought.

## Checking the budget against the vehicle

Most modern electric tow tractors log battery state of charge and energy use. After the first week, the site compared logged energy per shift with the budget. The logs showed an average of 8.3 kWh per shift, about 6% above the budget's 7.8 kWh, which the site traced to more stops than planned at a busy crossing. The budget was updated with the measured stop count. A budget that is checked against reality becomes a tool; one that is not remains a guess.

The logs also give early warning of change. A slow rise in energy per trip over months, with the route unchanged, usually means rising rolling resistance: under-inflated or worn tyres, dragging brakes, seized castor bearings on a trailer or a deteriorating floor. A sudden rise usually means a fault. Watching energy per trip is one of the cheapest condition-monitoring tools a fleet has, because the data is already being collected.

## Exercise: faster on the level

The operations manager asks whether raising the level speed limit from 10 km/h to 12 km/h would change the battery picture. Considering only the level driving and the starts, estimate the effect per trip.

**Worked answer.** At steady speed, the energy for level driving is force times distance, and the rolling resistance does not depend on speed, so the level energy per trip is **unchanged**. Air resistance would rise with speed squared, but at 12 km/h it is still only about 8.5 N, negligible.

The starts change. Kinetic energy rises with the square of speed: **(12 ÷ 10)² = 1.44** times. The start energy per trip rises from 0.038 kWh to about **0.038 × 1.44 = 0.055 kWh**, an extra **0.017 kWh**, about 5% of the trip total. Over 20 trips, that is about 0.34 kWh per shift, which the reserve can absorb.

Power is a different matter: the motor must deliver more power at 12 km/h on the level, about 3.3 kW instead of 2.8 kW, still well within its rating. The larger effect of a higher speed limit is on stopping distance, which Chapter 7 shows rises with the square of speed.
