---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: natural-ventilation-stack-and-wind
order: 6
title: "Natural ventilation: stack and wind"
description: "Calculate the airflow that warm air rising between PR-30's low and high louvres can drive, add the effect of wind, and decide what natural ventilation can and cannot do for a plant room."
draft: false
---

Before fans, buildings were ventilated by two free forces: warm air rising, and wind. The 1922 trade course built ventilators at ridges and louvres under skylights for exactly that purpose, to let foul, warm air escape from the top of a room. Both forces still work, they cost nothing to run, and they keep working in a power failure. They are also weak, variable and easy to overestimate, and a designer who relies on them for a hot plant room without calculating them is relying on hope.

This chapter calculates the airflow that the **stack effect** drives through PR-30's low intake and high exhaust louvres, finds how much heat that flow can carry, adds the effect of wind, and decides what natural ventilation can do for PR-30 and what it cannot. The failure case is an exhaust louvre programmed to close whenever the fans stopped.

## The stack effect

Warm air is lighter than cool air. In a room warmer than outdoors, the column of warm air inside weighs less than an equal column outside, so the pressure at the bottom of the room is a little lower than outdoors and the pressure at the top a little higher. Open a low opening and a high one, and outdoor air flows in at the bottom and warm air out at the top. The driving pressure grows with the height between the openings and with the temperature difference.

For two openings, the flow can be estimated with the orifice form of the stack equation: the flow equals a discharge coefficient, times an effective area, times the square root of twice the gravitational acceleration times the height between the openings times the temperature difference, divided by the absolute indoor temperature. The discharge coefficient for orifice-like openings is usually taken as about **0.65 to 0.70**; this book uses 0.65.

### Two openings in series

Air must pass through both louvres in turn, so their areas combine like resistances in series: **1 ÷ A_eff² = 1 ÷ A₁² + 1 ÷ A₂²**. With the intake's free area of **1.638 m²** and the open exhaust louvre's **1.40 m²**, the effective area is about **1.064 m²**, smaller than either. Doubling one opening alone does much less than double the flow, because the other then dominates.

```figure
type: formula
title: Stack-driven flow through PR-30's louvres
formula: Q = Cd × A_eff × √(2 g h ΔT ÷ T)        1 ÷ A_eff² = 1 ÷ A₁² + 1 ÷ A₂²
caption: This is an illustration. The intake's centre is 0.95 m above the floor and the exhaust's 3.15 m, so h = 2.2 m. T is the absolute indoor temperature, here 303 K for a room at 30 °C with 25 °C outside.
- Effective area | 1 ÷ √(1 ÷ 1.638² + 1 ÷ 1.40²) ≈ 1.064 m²
- Discharge coefficient | 0.65
- Height between louvre centres, h | 3.15 − 0.95 = 2.2 m
- Temperature difference, ΔT | 5 K
- Flow | 0.65 × 1.064 × √(2 × 9.81 × 2.2 × 5 ÷ 303) ≈ 0.584 m³/s
step: About 15% of the 3.89 m³/s the fans deliver
```

## What that flow can carry

Air leaving 5 K warmer than it entered carries heat at the flow times the density, the specific heat and the temperature rise: **0.584 × 1.15 × 1.006 × 5 ≈ 3.4 kW**. Because both the flow and the heat per cubic metre grow with ΔT, the heat carried grows with ΔT to the power 1.5.

```figure
type: compare
title: What natural ventilation through PR-30's louvres can do
cols: Stack flow | Heat carried away | What it means for PR-30
caption: This is an illustration from the stack equation, with h = 2.2 m and A_eff = 1.064 m². A room 24 K above outdoor temperature on a 35 °C day would be at 59 °C, far beyond what the compressors allow.
- Room 2 K above outside | about 0.37 m³/s | about 0.9 kW | standby losses on a cool day
- *Room 5 K above outside | about 0.58 m³/s | about 3.4 kW | dryer on standby and residual heat after shutdown
- Room 10 K above outside | about 0.82 m³/s | about 9.5 kW | one compressor lightly loaded, with a hot room
- Room 24 K above outside | about 1.24 m³/s | about 34 kW | the full heat load, at an unacceptable room temperature
```

The comparison settles the design. With both compressors and the dryer running, the stack effect alone could only carry the 36 kW if the room ran about **24 K** above outdoor temperature. On a 35 °C day that would be 59 °C: the compressors would trip long before. Natural ventilation cannot do PR-30's main job.

What it can do is the standby job. When the compressors stop, at night or at weekends, the dryer may still run on standby and the compressors' hot oil and metal give off heat for an hour or more. Calling that about 3 kW, the stack effect carries it with the room about **4.6 K** above outdoor temperature, with no fans running and no power used. That is why PR-30's exhaust louvre is motorised and opens when the fans stop, rather than staying shut.

### How small the stack pressure is

The pressure that drives this flow is tiny. The stack pressure between PR-30's two louvres is the air's density times g times the height times ΔT over T: about **1.15 × 9.81 × 2.2 × 5 ÷ 303 ≈ 0.41 Pa**. The fans, by comparison, work against about 24 Pa. Natural ventilation works with less than a fiftieth of that pressure, which is why every resistance in its path matters so much more. A partly closed louvre, a clogged mesh, a door left open on the wrong side of the room or a gap that lets air short-circuit to the exhaust can absorb the whole of the driving pressure.

### Mesh in the path

The bird mesh behind the intake is another opening in series. Its clean open area of about **2.45 m²**, from Chapter 5, adds a third term to the series sum: **1 ÷ A_eff² = 1 ÷ 1.638² + 1 ÷ 1.40² + 1 ÷ 2.45²**, giving about **0.976 m²**, about 8% less than without it. Since the stack flow is proportional to the effective area, it falls by the same 8%. The exhaust's mesh has a similar, smaller effect. A designer counting on natural ventilation includes every mesh, and allows for it getting dirty, because a half-blocked screen that the fans would barely notice can halve a natural ventilation flow.

## Night purging

Natural ventilation has one more use in a plant room with heavy walls. On summer nights the outdoor air is often 10 K or more cooler than the afternoon peak. With the exhaust louvre open overnight, cool air flows through the room by the stack effect and the breeze, and the concrete floor and block walls give up the heat they stored during the day. On Monday morning, or at the start of each day's shift, the room starts cooler, and the fans have a lighter job through the morning. PR-30's control logic leaves the exhaust louvre open on summer nights when the outdoor temperature is below the room temperature and no rain is detected, which costs nothing and makes the start of each hot day easier.

## Wind

Wind adds a second driving force. Wind blowing onto the intake wall raises the pressure there, and the leeward exhaust wall sits at reduced pressure. With teaching pressure coefficients of +0.7 on the windward wall and −0.3 on the leeward wall, the difference is **1.0** times the wind's velocity pressure, and the wind-driven flow through two openings in series is about the discharge coefficient times the effective area times the wind speed times the square root of that difference.

For a light 2 m/s breeze at the building, with the intake windward and the exhaust leeward, that is about **0.65 × 1.064 × 2 × √1.0 ≈ 1.38 m³/s**, more than twice the 5 K stack flow. When wind and stack act in the same direction, a common rough method combines them as the square root of the sum of their squares: **√(0.584² + 1.384²) ≈ 1.50 m³/s**.

```figure
type: bars
title: Natural ventilation flows through PR-30's louvres
unit: m³/s
max: 4
caption: This is an illustration. Wind can easily exceed the stack effect, but it can also blow the other way: with the wind onto the exhaust wall, it opposes the stack flow and can reverse it. The fans' 3.89 m³/s is shown for scale.
- Stack only, 5 K | 0.58
- Wind only, 2 m/s, aiding | 1.38
- *Stack and wind aiding, combined | 1.50
- Fans, both running | 3.89
```

Wind is generous but unreliable. It drops to nothing on still, hot nights, which are often exactly when the room most needs air, and it can come from the wrong direction, pushing air in through the exhaust and out through the intake, against the stack. A natural ventilation design is therefore sized on the stack effect alone, with wind treated as a bonus, unless the wind's direction and strength at the site are known and reliable.

## How the Code treats natural ventilation

For habitable rooms in houses, the NCC 2022 Housing Provisions, clause 10.6.2, require natural ventilation openings with a ventilating area of not less than 5% of the room's floor area, as *Roof Lights by the Numbers* notes for a kitchen. PR-30 is not a habitable room and that clause does not govern it; for comparison, 5% of its **30 m²** floor would be **1.5 m²**, and each of its louvres has about that much free area. Plant rooms are governed instead by the ventilation requirements for the building's class, the AS 1668 series, which covers mechanical ventilation in AS 1668.2 and natural ventilation in AS 1668.4, and the equipment makers' installation requirements, which for compressors usually specify a cooling airflow or a maximum room temperature. Where gas appliances or refrigerants are present, further rules apply. The calculation in this chapter supports those requirements; it does not replace them.

## Making the most of the stack

Three things increase stack flow, and each has limits.

- **Height.** The flow grows with the square root of the height between openings. PR-30's 2.2 m is set by the room's 4 m height and the louvres' own heights; putting the intake lower and the exhaust higher, at the very top of the wall or in the roof, increases it.
- **Area.** The flow grows directly with the effective area, but the series rule means both openings must grow together. Doubling only the intake's free area raises the effective area from 1.064 to about **1.29 m²**, only about 21% more.
- **Temperature difference.** A hotter room drives more flow, but that is the thing the ventilation is trying to prevent.

There is a fourth factor that does not appear in the equation: the **path**. The equation assumes the air enters only at the low louvre and leaves only at the high one. Any other opening, a door to the factory left open, a gap under a roller door or a cable penetration near the ceiling, provides another inlet or outlet, and the air takes whichever route offers least resistance. A high leak near the ceiling on the intake side can let warm air escape before it has crossed the room; a low leak on the exhaust side can let cool air enter where it does no good. PR-30's internal door is self-closing and sealed, for that reason as much as for security.

A roof ventilator or a short stack above the roof increases the height cheaply, and the old ridge ventilators on factory roofs did exactly that. For PR-30, the wall louvres were judged enough for standby, and the fans do the real work.

## A failure case: the louvre that closed with the fans

This is an illustration. On an earlier compressor room with a similar arrangement, the motorised exhaust louvre was wired so that it opened when the fans ran and closed when they stopped, to keep out rain and birds. The designer had assumed that nothing in the room produced heat when the compressors were off.

On a hot Saturday, the compressors shut down at noon on their timer. The dryer stayed on standby, the hot compressors cooled into a closed room and the afternoon sun heated the room's east wall. On Monday morning, the room was at 48 °C and the dryer's controller had logged a high-temperature alarm at 3 pm on Saturday. The detection came from that log.

The correction was to change the control logic: the exhaust louvre now opens whenever the room is above 30 °C, whether or not the fans are running, and closes only when the room is cool or a rain sensor detects rain with the room below 35 °C. The actuator's spring-return position on power failure was also reconsidered and set to open, so that a power failure leaves the room ventilated. The shop's control schedule now states, for every motorised louvre, what opens and closes it and what position it takes on power loss.

## How this applies to a small Australian business

Calculate natural ventilation, do not assume it. Combine the low and high openings in series to find the effective area, and use the stack equation with the real height between their centres. Work out the heat the stack flow can carry at an acceptable room temperature, and compare it with the load: natural ventilation suits standby and light loads, not the full heat of running plant. Treat wind as a bonus unless the site's winds are known. Check the requirements that actually apply to the room. And write down, for every motorised louvre, when it opens, when it closes and what it does when the power fails.

## Exercise: a roof ventilator

PR-30's owner asks whether replacing the high wall louvre with a roof ventilator, its opening 4.2 m above the intake's centre with the same 1.40 m² free area, would let the stack effect carry the standby heat at a lower room temperature. Using this chapter's values, what flow would a 5 K difference drive, what heat would it carry, and at what temperature difference would it carry 3 kW?

**Worked answer.** The effective area is unchanged at **1.064 m²**. The flow at 5 K becomes **0.65 × 1.064 × √(2 × 9.81 × 4.2 × 5 ÷ 303) ≈ 0.807 m³/s**, carrying **0.807 × 1.15 × 1.006 × 5 ≈ 4.7 kW**. Since heat carried grows with ΔT to the power 1.5, 3 kW is carried at about **5 × (3 ÷ 4.67)^(2/3) ≈ 3.7 K**, nearly a degree cooler than the wall louvre's 4.6 K. The improvement is real but modest, because the flow grows only with the square root of the height; the ventilator would be worth it only if it were also cheaper or easier to keep weathertight.
