---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: inverter-heat-reliability-and-spares
order: 8
title: "Inverter heat, reliability and spares"
description: "How to ventilate an inverter room so the inverters do not derate, read inverter failure records with confidence bounds, and decide whether a spare inverter is worth holding."
draft: false
---

Modules are the most visible part of an array and the least likely to fail. The inverters are the opposite: tucked away in a plant room, they are the part most likely to stop the whole system, and when one stops, half of SF-90 produces nothing. They are also the part most sensitive to heat. An inverter that gets too hot protects itself by reducing its output, which on a hot afternoon means throwing away energy the modules are delivering.

This chapter works out the heat SF-90's inverters give off and the ventilation their room needs, reads the inverter failure records with confidence bounds, and uses them to decide whether to hold a spare. It ends with a ventilation fan that had been sized for the room's lighting and switchboard, not for the inverters.

## How much heat an inverter makes

An inverter's loss is the difference between the direct-current power it takes in and the alternating-current power it puts out. At full output, with an efficiency of about 98.1% (Chapter 5), each 40 kW inverter takes in 40 ÷ 0.981 = 40.78 kW and loses 0.78 kW as heat. Two inverters at full output therefore release about 1.55 kW into their room, about as much as a large domestic fan heater. The room also holds the array's monitoring equipment and part of the switchboard, so the business allowed 1.6 kW in total for its cooling design.

That heat comes from the semiconductor switches and diodes in the power stage, from the magnetic components that filter the output, and from the control electronics. The switches are mounted on a heatsink, cooled by fans inside the inverter that draw room air across it. The inverter can only be as cool as the air it draws in, plus the temperature rise across its heatsink. Above a certain air temperature, commonly about 45 °C to 50 °C for inverters of this type, it reduces its output to keep its switches within their limits. The SF-90 inverters' datasheet gives full output up to 45 °C ambient and a linear reduction above that.

## Ventilating the room

The inverter room is about 3.0 × 2.4 m with a masonry wall to the outside on the south side and walls shared with the factory on the others. Air comes in through a louvre low on the south wall and is drawn out by a fan high on the opposite wall. The air must carry away the heat that the room's walls do not.

The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) works out the heat lost through the enclosure's surface at the allowed temperature difference, the heat the fan must remove, and the volume of air needed to remove it within the allowed rise. It was written for a closed cabinet, but the same heat balance applies to a small, closed plant room, provided the inputs are chosen for a room.

```figure
type: formula
title: The ventilation heat balance
formula: Heat lost through the walls P_wall = k × A_s × (T_inside − T_outside)
formula: Heat for the fan P_fan = P − P_wall
formula: Air mass flow ṁ = P_fan ÷ (c_p × ΔT)
formula: Airflow Q = ṁ ÷ ρ
caption: The tool works in kg/h and m³/h: ṁ = P_fan × 3.6 ÷ (c_p × ΔT) with P_fan in W and c_p in kJ/(kg·K). Air enters at the outside temperature and leaves at the inside limit.
- P | heat released inside, W
- k | wall heat transfer coefficient, W/(m²·K)
- A_s | effective surface area losing heat, m²
- ΔT | allowed rise, inside limit minus outside air, K
- ρ, c_p | air density and specific heat
```

For the hottest design afternoon, the business took 40 °C outside air and limited the room to 45 °C, the inverters' full-output limit, so that the inverters would never derate. It took an effective wall area of 20 m² losing heat at 1.5 W/(m²·K), a low figure, because the outside wall is itself warm in summer and the shared walls hardly help. Air at 40 °C has a density of about 1.11 kg/m³.

```figure
type: compare
title: SF-90 inverter room on a 40 °C afternoon, from the enclosure cooling airflow tool
cols: Wall loss | Heat for the fan | Airflow needed | Installed fan | Result
rowhead: Inside limit
- * 45 °C, 5 K rise | 150 W | 1,450 W | 935.9 m³/h | 600 m³/h | FAN TOO SMALL
- 45 °C, 5 K rise, new fan | 150 W | 1,450 W | 935.9 m³/h | 1,200 m³/h | FAN ADEQUATE
- 50 °C, 10 K rise | 300 W | 1,300 W | 419.5 m³/h | 600 m³/h | FAN ADEQUATE, but the inverters derate above 45 °C
caption: This is an illustration. P = 1,600 W, outside air 40 °C, A_s = 20 m², k = 1.5 W/(m²·K), ρ = 1.11 kg/m³, c_p = 1.005 kJ/(kg·K). The airflow needed is for the fan working against its filter and louvres, not free-blowing.
```

The small temperature rise is what makes the airflow large. Allowing the room 10 K above outside air would halve the airflow needed, but on a 40 °C day the room would then reach 50 °C, and the inverters would cut their output.

Two details matter as much as the airflow figure. First, the air must actually pass through the inverters, not short-circuit from the intake louvre to the exhaust fan along the ceiling; the inverters were mounted with their own air inlets low and their outlets high, between the intake and the exhaust, and with the clearances the maker requires above and beside each unit. Second, the intake must draw from the shade. A louvre on a sunlit wall or under a hot roof can draw air several degrees above the official air temperature, which uses up the whole 5 K allowance before the inverters add any heat.

## The error: a fan sized for the lights

The inverter room existed before the array, as a small switch room with a 600 m³/h exhaust fan that had been fitted for the switchboard and lighting. The array's installer mounted the inverters in it and noted the existing ventilation in the handover documents.

In the first January, the inverter logs showed temperature derating on five afternoons, with output limited to between 85% and 95% of rating for one to three hours. The business's engineer ran the enclosure cooling airflow tool for the room as above: 936 m³/h was needed to hold 45 °C on a 40 °C day, and the existing fan, rated 600 m³/h free-blowing and less against its louvres, could not deliver it. A data logger in the room confirmed the room air reached 49 °C on the hottest afternoon.

The energy lost was small, perhaps 150 kWh over the summer, but the heat was shortening the life of the inverters' electrolytic capacitors and fans on every hot day. The business replaced the fan with one rated 1,200 m³/h at its working pressure, moved the intake louvre to the shaded part of the south wall and added a filter, which keeps the workshop's grinding dust out of the inverters' heatsinks. No derating has been logged since.

```figure
type: checklist
title: Inverter room checks
caption: This is an illustration. Added to the array's annual inspection.
- x Ventilation sized for the inverters' full-output heat at the hottest design air temperature
- x Intake drawing shaded outside air, through a filter, low on the wall
- x Air path through the inverters, with the maker's clearances
- x Filters cleaned or replaced on a schedule, and airflow measured after cleaning
- x Inverter logs checked for temperature derating each summer
- ? Room temperature logged through the first summer after any change
```

## How reliable are the inverters?

Inverters fail for many reasons: capacitors dry out, fans wear, power switches fail under electrical or thermal stress, control boards fail after lightning or surges, and firmware faults stop them until they are reset or updated. Over the first decade of their life, most of these look random: the failure rate is roughly constant, with neither a clear early-life peak once the units are commissioned nor a clear wear-out trend. That allows a simple model, a constant failure rate measured as the mean time between failures, MTBF.

The installer services nine inverters of the same model in the region, including SF-90's two. Its records for them show two failures in 158,400 inverter operating hours over four years, counting about 4,400 operating hours a year, the daylight hours each one runs. That gives an MTBF estimate of 158,400 ÷ 2 = 79,200 hours. With only two failures, though, the estimate is very uncertain. The [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/) gives chi-square bounds on the MTBF for a record that ends at a fixed time.

```figure
type: compare
title: Inverter MTBF from the service records, from the MTBF confidence bounds tool
cols: Operating hours | Failures | MTBF estimate | One-sided lower bound | Against 50,000 h
rowhead: Record
- * Four years, 9 inverters, 90% | 158,400 h | 2 | 79,200 h | 29,762 h | NOT DEMONSTRATED
- Same record, 95% | 158,400 h | 2 | 79,200 h | 25,160 h | NOT DEMONSTRATED
caption: This is an illustration. The two-sided 80% interval is 29,762 to 297,850 h: the record is consistent with an MTBF anywhere in that range. About 107,700 more failure-free operating hours would be needed for the 90% lower bound to reach 50,000 h.
```

The record does not show that the inverters are unreliable; it shows that two failures are too few to say much. The estimate of 79,200 hours means about one failure every 18 years of daylight operation per inverter, but at 90% confidence the business can only rely on an MTBF of about 29,800 hours, one failure every 6.8 years per inverter. For planning spares, that lower figure is the prudent one.

## Is a spare inverter worth holding?

When an inverter fails, the replacement under warranty comes from the maker's distributor. The business assumed a lead time of 21 days from failure to a working replacement, including diagnosis, shipping and installation. During that time, half the array produces nothing: in summer, about 21 × 560 ÷ 2 = 5,880 kWh; in winter, about 1,680 kWh.

The [critical spares plan tool](/tools/critical-spares-poisson-plan/) works out the expected number of failures across the installed units during the lead time, from the MTBF and running hours, and the smallest number of spares whose Poisson cover meets a target chance of not running out.

```figure
type: compare
title: Spare inverters for SF-90 and for the installer's regional fleet, from the critical spares plan tool
cols: Expected failures in 21 days | Spares for 95% cover | Cover with no spare | Cover with one spare
rowhead: Installed units
- SF-90 alone, 2 inverters | 0.017 | 0 | 98.32% | —
- * Regional fleet, 9 inverters | 0.076 | 1 | 92.66% | 99.72%
caption: This is an illustration. MTBF 29,762 h, the 90% lower bound; 12 running hours a day; lead time 21 days; target 95% chance of not running out. Failures per year: 0.29 for SF-90's two inverters and 1.32 across nine.
```

For SF-90 alone, a spare is not justified: there is a 98.3% chance that no inverter fails in any 21-day window, and a spare inverter costs several thousand dollars, of the order of a whole year's energy from half the array at a failure. Across the installer's nine inverters, though, one shared spare raises the cover from 92.7% to 99.7%. The business and the installer agreed that the installer would hold one spare of this model at its depot, to be swapped in on any failure and replaced from the warranty claim. That turns 21 days of lost output into one or two.

The same reasoning applies to smaller parts. The inverters' cooling fans are a wear item with a finite life, and their replacement is planned (Chapter 9), not left to the spares model, which assumes random failure. The tool's own check says so: parts that wear out need a different model.

## What the inverter logs say

An inverter records far more than its output. Its event log is the first place to look when production falls, and reading it regularly catches problems that the energy totals hide. On SF-90 the business reviews the logs monthly for four kinds of event.

- **Temperature derating**, as in the error above: output limited because the heatsink or the internal air is too hot.
- **Grid voltage events.** When many solar systems on a network export at midday, the local grid voltage rises. The inverters respond as their AS/NZS 4777.2 settings require: first by absorbing reactive power and then by reducing real power as the voltage climbs, and finally by disconnecting if it goes beyond the trip limit. A pattern of power reductions at midday on sunny weekends points to high network voltage, which is a matter for the network service provider, not a fault in the inverter.
- **Insulation faults.** The inverter measures the array's insulation resistance to earth before it starts each morning. Dew in a damaged connector or a cable chafed by a rail can drag it below the limit, and the inverter then refuses to start until the sun dries the array. An inverter that starts late on damp mornings is giving an early warning of a cable or connector fault on the roof.
- **Tracker and string faults.** A tracker reporting a current well below its partner on the same inverter is the inverter's own version of the string comparison in Chapter 9.

## Surges and lightning

A large metal array on a roof, with long cable runs to a plant room, collects surges from nearby lightning strikes and from switching on the network. Surge protective devices on the DC inputs and the AC output of each inverter divert those surges to earth before they reach the electronics. The devices wear out as they absorb surges, and many have a visible indicator that changes colour when they need replacing. They are checked at each annual inspection, and after any storm in which lightning struck nearby. Whether a building needs a full lightning protection system is a separate risk assessment, which the array may change by adding a large metal structure to the roof.

## Inverter life and replacement

Modules are commonly warranted for 25 years or more of power output; inverters for far less, often 5 to 10 years with extensions available. An inverter's design life is commonly quoted at 10 to 15 years, limited by its capacitors, fans and power switches. Over a 25-year array life, the business should therefore plan to replace each inverter at least once, and its business case in Chapter 10 includes that cost in year 12. A cooler room, as the error showed, is the cheapest way to make the inverters last longer.

## Exercise: another year of records

After a fifth year in which none of the nine inverters fails, the record holds 158,400 + 9 × 4,400 = 198,000 operating hours and still two failures.

1. What is the new MTBF estimate?
2. The 90% one-sided lower bound uses the chi-square value with 2 × (2 + 1) = 6 degrees of freedom at 90%, which is 10.645. What is the new lower bound?
3. With that lower bound, does the regional fleet of nine still need its one spare for 95% cover over a 21-day lead time?

### Worked answer

1. 198,000 ÷ 2 = 99,000 hours.
2. Lower bound = 2T ÷ χ² = 2 × 198,000 ÷ 10.645 = 37,201 hours. The same formula gives 2 × 158,400 ÷ 10.645 = 29,760 hours for the four-year record, matching the tool's 29,762 hours to rounding.
3. Expected failures in 21 days = 9 × 12 × 21 ÷ 37,201 = 0.061. The chance of none is e^(−0.061) = 94.1%, still below 95%, so one spare is still needed for 95% cover. A longer failure-free record raises the lower bound slowly, because the bound depends on total hours and failures, not on how recently the failures happened.
