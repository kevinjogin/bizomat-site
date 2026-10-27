---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: planning-the-cycle
order: 10
title: "Planning the cycle: time, energy and throughput"
description: "Turn heating times into a furnace plan: load energy, furnace power and recovery, the cost per part and shafts per hour, and a bigger load that would not have raised output at all."
draft: false
---

The previous nine chapters calculated how long DS-100 takes to heat, cool and quench, and how to prove it. A furnace plan needs more than those times. It needs the energy each load absorbs and whether the furnace can supply it as fast as the parts can take it; the cost of that energy per part; the time each furnace is occupied per load; and, because parts usually pass through more than one furnace, which furnace limits the shop's output. These are the numbers a production manager and an estimator ask for, and they follow directly from the work already done.

This chapter assembles DS-100's complete hardening and tempering plan. Its failure case is a proposal to raise output by putting ten shafts in the hardening furnace instead of six, which was worked out carefully for the hardening furnace and would have changed the shop's output by nothing, because the tempering furnace was the bottleneck.

## The load and its energy

This is an illustration. A hardening load is six DS-100 shafts, each about 42.7 kg, on a basket of about 60 kg of heat-resisting steel. With the book's assumed mean specific heat of 650 J/kg·K for the shafts over the hardening heat, and an assumed 600 J/kg·K for the basket, heating the load from 20 °C to 850 °C takes:

- shafts: 6 × 42.7 × 650 × 830 ≈ 138.2 MJ;
- basket: 60 × 600 × 830 ≈ 29.9 MJ;
- total: about **168 MJ**, or about 46.7 kWh.

The lumped energy balance of Chapter 2 gives this correctly whatever the temperature distribution, because energy depends only on mass and average temperature. Tempering the same load to 550 °C, with the lower mean specific heat of 560 J/kg·K that tempering's lack of transformation allows, takes about 93.8 MJ, or 26.1 kWh.

## Can the furnace keep up?

This is an illustration. The hardening furnace is rated at 90 kW, and at 850 °C its walls, door and fittings lose about 12 kW, so about 78 kW is available to heat a load. At that rate, delivering 168 MJ takes at least 168,000 ÷ 78 ≈ 2,150 s, about **36 minutes**. That is the energy limit: no arrangement of the load can heat it faster in this furnace.

The heat-transfer limit is different. Each shaft has about 0.261 m² of surface, so the load has about 1.57 m². At the start, with an effective coefficient of 150 W/m²·K and an 830 K difference, the cold load could absorb about 150 × 1.57 × 830 ≈ 195 kW, two and a half times what the furnace can supply. For the first part of the cycle, the furnace cannot hold its temperature: the atmosphere and the hot face of the lining give up heat to the load, the control thermocouple sags, and the furnace runs flat out until the load's demand falls below its capacity. Later in the cycle, the demand falls below 78 kW, the furnace recovers, and the parts' own heat transfer limits the rate.

Chapter 9's proving trial measured exactly that: the furnace atmosphere sagged to about 760 °C and took about 25 minutes to recover, and the load thermocouple reached 840 °C at about 70 minutes instead of the 66 minutes the model gave for a furnace that held 850 °C throughout. The furnace's power costs about four minutes a load. A more powerful furnace would recover sooner, but it could never bring the time below the heat-transfer limit of about 66 minutes for this load arrangement.

```figure
type: stats
title: DS-100's hardening load against the furnace
caption: This is an illustration. The furnace's 90 kW rating, 12 kW standing loss and the basket's specific heat are assumptions for the example.
- *168 MJ | Energy to heat one load | six shafts and the basket, 20 °C to 850 °C
- 36 min | Energy limit at 78 kW net | the fastest any arrangement could heat in this furnace
- 195 kW | Initial demand of the cold load | why the furnace sags after loading
- 70 min | Proved heat-up to 840 °C | load thermocouple, Chapter 9
```

## The cycle

With the heat-up proved, the rest of the cycle comes from the procedure and the shop's handling. In this illustration, the fictional heat treatment procedure requires a 30-minute hold at temperature for DS-100 after the slowest point reaches 840 °C, and a 2-hour tempering hold after the slowest point reaches 540 °C. Loading and unloading take about 10 minutes per load in each furnace.

```figure
type: steps
title: DS-100's furnace plan, per load of six shafts
caption: This is an illustration. Heat-up times are from Chapters 8 and 9; hold times are the fictional procedure's; handling times are the shop's.
- Load hardening furnace | 10 min, including closing the door and starting the log
- Heat to 840 °C at the body's centre | 70 min, proved by load thermocouple
- Hold | 30 min, from the load thermocouple reaching 840 °C
- Transfer and quench | under 20 s per shaft; centre below 300 °C before lift-out (Chapter 8)
- *Temper | load 10 min, heat about 112 min to 540 °C at the centre, hold 120 min
- Hardening furnace occupied | about 110 min per load
- Tempering furnace occupied | about 242 min per load
```

### The tail and the target

Chapter 3 showed that the last few degrees of an exponential approach take a disproportionate share of the time. For DS-100's body with a constant 150 W/m²·K, reaching 840 °C at the centre takes about 67 minutes, while reaching 845 °C would take about 77 minutes. Tightening the target by 5 K would add about ten minutes to every load, nearly 10 % of the hardening furnace's occupancy. A target and its tolerance should therefore come from what the process needs, written in the procedure, and not be tightened by habit or by a controller display that suggests more precision than the steel requires.

## The cost of energy

This is an illustration. The shop pays an assumed A$0.30 per kWh for electricity, including GST. A hardening load uses about 46.7 kWh for the load, about 22 kWh to cover the furnace's 12 kW standing loss over its 110-minute occupancy, and an allowance of about 3 kWh for door openings, about **72 kWh**, or about A$21.50 per load. A tempering load uses about 26.1 kWh for the load, about 32 kWh for an assumed 8 kW standing loss over 242 minutes, and about 2 kWh for the door, about **60 kWh**, or about A$18.10. Together, energy costs about **A$6.60 per shaft**.

Two things stand out. First, in the tempering furnace, standing losses use more energy than the load does, because the cycle is long and the furnace is hot throughout; shortening the tempering heat-up saves energy as well as time. Second, energy is a small part of the cost of heat treating a shaft like DS-100 compared with furnace time, labour and testing, so the cycle should be planned for throughput and quality first and energy second.

## The failure case: a bigger load in the wrong furnace

This is an illustration. Demand for DS-100 rose, and a planner proposed putting ten shafts in each hardening load, in two rows, instead of six in one. Reasoning from the hardening furnace's 110-minute occupancy, the planner forecast 10 shafts per 110 minutes, about **5.45 shafts an hour** against the present 3.27, a two-thirds increase.

The planner's first mistake was in the hardening furnace itself. Ten shafts in two rows shade each other more, and the load needs about 260 MJ, which keeps the furnace sagging for longer. Run in the finite-difference model with an assumed effective emissivity-and-view product of 0.45 for the more crowded load, and an estimated sag to about 720 °C with about 39 minutes to recover, the heat-up becomes about **91 minutes**, not 70. The hardening furnace's occupancy rises to about 131 minutes, and its output to about 4.58 shafts an hour: an increase, but about 40 %, not two-thirds.

The larger mistake was looking at the wrong furnace. Every shaft must also be tempered, and the tempering furnace, at about 242 minutes per load of six, can temper only about **1.49 shafts an hour**. It was already the bottleneck: the hardening furnace was idle for part of every day, waiting for the tempering furnace to take its last load. Speeding up hardening would have changed the shop's output by nothing.

```figure
type: compare
title: DS-100 throughput by furnace and option, shafts per hour
cols: Shafts per load | Occupancy per load | Shafts per hour
caption: This is an illustration. The shop's output is the smallest figure among the furnaces each shaft must pass through; with a single tempering furnace, that is the tempering figure in every option shown.
- Hardening, six shafts, one row | 6 | 110 min | 3.27
- Hardening, ten shafts, planner's forecast | 10 | 110 min | 5.45
- Hardening, ten shafts, modelled | 10 | 131 min | 4.58
- *Tempering, six shafts, still air | 6 | 242 min | 1.49
- Tempering, six shafts, with a circulating fan | 6 | 207 min | 1.74
```

The error was caught when the proposal reached the production manager, who asked for the throughput of every furnace on the route, not just the one being changed. The correction was to plan from the bottleneck. A circulating fan in the tempering furnace, which Chapter 8 showed would cut the heat-up from about 112 to about 77 minutes, raises its output to about 1.74 shafts an hour, about 17 % more, and saves about 4.7 kWh of standing losses per load as well. Tempering larger loads, if the tempering furnace's volume allows, or adding tempering capacity would raise output further. Only after tempering had been relieved would changes to the hardening load matter. The general lesson reaches far beyond heat treatment: a cycle time is only useful when it is placed in the whole route, and the slowest step sets the pace for all of them.

## Mixed loads

Many shops fill spare basket space with other work, and the heating-time calculations show how to do it without harm. The rule is that a load's heat-up is set by its slowest point, so smaller or thinner parts can share a load with a larger one without lengthening the cycle, provided they do not shade it more and the furnace's power can carry their extra energy. This is an illustration. Chapter 4's 75 mm shaft reaches 840 °C at its centre in about 49.5 minutes with the same surface coefficient, and the 25 mm coupons in about 16 minutes, both well inside DS-100's 67 minutes. Placed at the ends of the row, where they do not sit between DS-100 shafts, they ride along at no cost in time. Each 75 mm shaft of the same length adds roughly half of a DS-100 body's energy to the load, which lengthens the furnace's sag and recovery a little, and that is the cost to check.

The reverse mixing is the risk: a load set up for small parts, with a short cycle, into which one larger part is added. If the cycle is not lengthened to suit the larger part's slowest point, that part comes out with a soft centre, and no single measurement on the smaller parts will show it. A process sheet should therefore name the slowest part allowed in each cycle, and any heavier part should change the cycle, not just the load list.

Mixing also changes the quench. Small parts cool much faster than DS-100's body, so a lift-out time set for the body is generous for them, which is safe. But many small parts in a tank at once heat the oil more than the same mass in a few large parts, because they give up their heat faster; a large mixed load should be checked against the tank's capacity to absorb heat without the oil temperature rising beyond its working range.

## Writing the cycle down

A proved cycle belongs on a process sheet that a new operator, a customer's auditor or the next engineer can follow. For DS-100 it records the load arrangement and spacing, the target temperatures and tolerances at the slowest point, the heat-up times proved for each furnace and how they were proved, the procedure's holds and how they are counted, the transfer and lift-out limits, the sensors used and their placement, and the conditions under which the cycle must be re-proved: a new part, a new load arrangement, a re-lined or repaired furnace, a new quench oil or a change of supplier for the steel. The calculations from this book belong in an appendix to that sheet, with their assumptions, so that the next change can start from them rather than from a rule.

## How this applies to a small Australian business

The planning steps in this chapter are the same for any thermal process: calculate the energy per load and compare it with the furnace's net power to see whether the furnace or the parts limit the heat-up; prove the heat-up at the slowest point; add the procedure's holds and the handling; cost the energy, including standing losses, which often exceed the load's own energy in long cycles; and find the bottleneck across every furnace, oven or bath the part passes through. Throughput improvements belong at the bottleneck. The calculations are short, the data come from the earlier chapters and a single proving trial, and together they replace a rule of thumb with a plan the business can defend and improve.

## Exercise: tempering with a fan

The shop installs a circulating fan in the tempering furnace, cutting DS-100's tempering heat-up to about 77 minutes. Assuming the same 120-minute hold, 10 minutes of handling and an 8 kW standing loss, find the tempering furnace's new occupancy, its output in shafts per hour, and the energy saved per load at A$0.30 per kWh including GST. Is the hardening furnace now the bottleneck?

**Worked answer.** The occupancy becomes 10 + 77 + 120 = **207 minutes**, and the output 6 ÷ 207 × 60 ≈ **1.74 shafts an hour**, up from 1.49. The standing loss falls by 8 kW × (242 − 207) ÷ 60 h ≈ **4.7 kWh** per load, worth about 4.7 × 0.30 ≈ **A$1.40** per load. The fan itself uses some power; this illustration does not include it, and a real comparison would.

The hardening furnace, at 3.27 shafts an hour with six shafts per load, is still almost twice as fast as the tempering furnace, so tempering remains the bottleneck. The shop's next step should be more tempering capacity, larger tempering loads if the furnace's volume and the heating-time calculation allow, or both. The hardening furnace has spare capacity that could serve other work in the meantime.
