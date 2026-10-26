---
book: compressed-air-plant-by-the-numbers
chapterSlug: set-the-pressure-and-stop-waste
order: 7
title: "Set the pressure and stop the waste"
description: "Price each 100 kPa of CA-1's pressure, see how leaks and open blow-offs grow with it, find the pressure lost before the air leaves the room, and fix a low-pressure complaint at its cause."
draft: false
---

The cheapest compressed air is air that is never compressed. Two kinds of saving follow from that: generating the air at a lower pressure, and not generating air that does no useful work. They are linked, because most wasted air, through leaks, open blowpipes and unregulated users, flows at a rate that rises with pressure. Running a system at a higher pressure than it needs makes every waste bigger.

This chapter prices CA-1's pressure set point, estimates its leakage and what it costs, values the commonest misuse of compressed air, the open blowpipe, and traces the pressure lost between the compressor and the plant. It closes with the decision that is made in compressor rooms every week: raising the pressure to fix a complaint that lies somewhere else.

## What 100 kPa costs

Chapter 2 calculated that the ideal power to compress air rises by roughly 8 per cent for each 100 kPa near CA-1's operating pressure. A real compressor follows broadly the same slope.

This is an illustration. CA-1's electricity costs about A$47,700 a year at its average load. Lowering its set point from 750 to 650 kPa gauge cuts the ideal work by about 7.7 per cent, worth about **A$3,700 a year**. Raising it to 800 kPa gauge adds about 3.6 per cent, about A$1,700 a year.

The direct effect is only part of the story. Air that escapes through a fixed opening flows faster at higher pressure, so every leak and every unregulated open use grows as the pressure rises.

## Pressure and air demand together

Pressure and demand interact in both directions. Lower pressure reduces the air that unregulated uses and leaks consume, so the compressor runs loaded for less time and its average power falls by more than the compression saving alone. Higher pressure does the opposite. A survey that measures the compressor's loaded time at two set points, a week apart, captures both effects at once and is a more convincing basis for a decision than a calculation. It also shows how much of the plant's demand is pressure-dependent, which is a rough indicator of how much is leakage and open use.

## Leaks grow with pressure

A leak is an orifice, and air escaping through it from 750 kPa gauge is choked: its flow is proportional to the absolute pressure upstream, as the [escaping air tool](/tools/escaping-air-velocity/) shows. Lowering the system from 851.3 to 751.3 kPa absolute therefore lowers the leakage by about 11.75 per cent.

This is an illustration. A leak survey on CA-1's site, using the load-time method described in READOS's [Pneumatics by the Numbers](/reados/publications/pneumatics-by-the-numbers/), estimated leakage at about 1.05 m³/min, a quarter of the plant's average 4.2 m³/min. At CA-1's average specific power of about 7.57 kW per m³/min, that is about 7.9 kW of compressor input, roughly **A$11,900 a year**, for air that does nothing.

```figure
type: bars
title: Annual cost of CA-1's waste and the savings available
unit: A$
max: 15000
caption: This is an illustration, excluding GST, at A$0.25 per kWh and CA-1's average specific power of 7.57 kW per m³/min. The open blowpipe runs 4,000 hours a year; leaks and the pressure set point run 6,000.
- One open 6 mm blowpipe at 600 kPa gauge | 14365
- * All leaks, about 1.05 m³/min | 11923
- Repairing two thirds of the leaks | 7949
- Lowering the set point 100 kPa, compression alone | 3670
- Lowering the set point 100 kPa, effect on leaks | 1401
```

Lowering the pressure is not a substitute for fixing leaks: it trims about 12 per cent off them, while a repair programme can remove two thirds or more. The [compressed-air leak audit tool](/tools/air-leak-audit/) converts measured or estimated leaks into power and cost, and READOS's pneumatics book covers finding and tagging them.

## The open blowpipe

The single most expensive misuse of compressed air in many factories is a plain open pipe or hose blowing air onto a conveyor, a product or a work area: to clear debris, dry parts, cool a motor or hold a carton in place. It is easy to fit, it seems to cost nothing, and it runs all shift.

This is an illustration. A 6 mm bore open pipe fed at 600 kPa gauge passes, from the same choked-flow formula with a discharge coefficient of 0.8, about **1.9 m³/min** of free air. That is nearly a third of CA-1's capacity, costing about 14.4 kW of compressor input. Running 4,000 hours a year, it costs about **A$14,400**, more than all the site's leaks.

The options, in roughly increasing order of saving:

- fit an engineered blow-off nozzle, which entrains surrounding air and delivers the same blowing force with much less compressed air, and regulate it to the lowest pressure that does the job;
- add a solenoid valve so the blow-off runs only when a product is present, not continuously;
- replace compressed air with a low-pressure electric blower, which delivers large volumes of air at a small fraction of the energy, for drying and clearing jobs that need volume rather than pressure.

The [blow-off consumption tool](/tools/blow-off-nozzle-cost/) prices nozzles, pressures and running hours. Blow-off safety matters too: air at full line pressure from an open pipe can drive debris into eyes and skin, and nozzles designed to limit dead-end pressure and noise are part of making it safe.

## Inappropriate uses

Beyond blowpipes, a compressor survey usually finds air used where something else would be cheaper, as Chapter 2's comparison of air and electric tools suggests:

```figure
type: checklist
title: Questions to ask of every continuous compressed air use
caption: Each use is a candidate for a cheaper alternative or a shorter running time. Some uses genuinely need compressed air; the point is to decide deliberately.
- Does it run when nothing needs it | add a valve, a sensor or a timer
- Is it regulated to the lowest pressure that works | most blow-offs and air motors work at a fraction of line pressure
- Could an electric blower, fan or motor do it | drying, clearing, cooling, stirring and pumping often can
- x Do not use air to cool electrical cabinets by default | cabinet coolers are convenient but costly; check the heat load and alternatives
- Is a vacuum generator running continuously | venturi vacuum generators use a lot of air; check for a vacuum pump or switching
- ? Who owns this use | a use without an owner is never reviewed
```

## Users that genuinely need more

Some plants have one or two users that need distinctly higher pressure than the rest: a press, a test rig, a particular actuator sized long ago for line pressure. Running the whole system at their pressure to satisfy them is usually the most expensive answer. The alternatives are a small booster compressor or pressure intensifier serving just those users from the main, a dedicated small compressor, or, where it can be done, resizing the user's actuator so it works at the plant's normal pressure. A user that needs 750 kPa gauge for a few seconds a minute might be served by a booster feeding a small local receiver, while the main runs at 650 kPa gauge for everything else, and the saving on compression and leaks for the whole plant usually pays for the booster quickly.

## Why waste is hard to see

Wasted air is invisible and mostly silent at a distance. A leak at a fitting behind a machine, a blowpipe left on over the weekend, a drain stuck open: none of them stops production, and the compressor simply runs a little longer each day. The only place the waste shows up clearly is the compressor's load and the electricity bill, and both are seen by people who are far from the leak. That is the real reason leak and misuse programmes need measurement and ownership: they make the invisible cost visible to the people who can fix it.

## Pressure lost before the plant

The pressure a compressor generates is not the pressure the plant receives. Between them sit an aftercooler, a separator, a receiver, a dryer, filters, valves and the main, each with its own pressure drop. The compressor must generate enough pressure to cover all of them plus the plant's needs.

This is an illustration. A pressure survey of CA-1's room found the compressor unloading at 750 kPa gauge and the main leaving the room at 680 kPa gauge, a loss of 70 kPa. The coalescing filter after the dryer, with an element well past its replacement point, accounted for about 35 kPa of that. A new element brought the room's loss to about 35 kPa, allowing the set point to fall by the same amount with no change at the plant, worth roughly 2.7 per cent of compression power, about A$1,300 a year, for the cost of a filter element.

Every 10 kPa of avoidable pressure drop between compressor and user costs roughly 0.8 per cent of compression power at CA-1's pressure. Pressure gauges or transmitters at the compressor outlet, after the dryer and filters, and at the far end of the main make those losses visible.

## A failure case: raising the pressure for one machine

This is an illustration. A packaging machine at the far end of CA-1's plant began faulting on low air pressure at peak times. The quickest response was to raise the compressor's set point from 750 to 800 kPa gauge, and the faults stopped.

The rise cost about 3.6 per cent more compression power and about 5.9 per cent more leakage, together roughly A$2,400 a year. It also raised the pressure at every unregulated blow-off in the plant. And it hid the cause. When the machine faulted again months later, a gauge fitted at its inlet showed the main delivering about 690 kPa gauge at the machine's tee while the machine itself saw only about 480 kPa gauge during its cycle. The loss was in the machine's own supply: a long, small-bore hose and two quick-release couplings, which dropped over 200 kPa at the machine's peak flow.

The error was in treating a local pressure problem as a system one. The correction was a larger-bore supply to the machine, a small local receiver to cover its peak draw, and the compressor's set point returned to 750 kPa gauge. The site's rule now is that any low-pressure complaint is answered first with a gauge at the user's inlet and one on the main nearby. Raising the system pressure is the last resort, not the first.

## Finding the right set point

The right set point is the lowest pressure at which every user still works, plus the losses on the way to it. A practical method lowers the set point in small steps, 10 to 20 kPa at a time, over several weeks of normal production, while the machines most sensitive to pressure are watched. Where one or two users genuinely need higher pressure than the rest, a small booster or a dedicated compressor for those users is often cheaper than running the whole plant at their pressure. Every step down is a permanent saving on compression and leaks.

```figure
type: steps
title: Lowering CA-1's set point safely
caption: A cautious, reversible procedure. Each step is a permanent saving if nothing complains.
- List the users most sensitive to pressure | with their minimum working pressure at their inlet
- Fit gauges at those users and at the main's far end | so the actual margin is visible
- * Lower the compressor's set point 10 to 20 kPa | and run a full production week
- Watch faults, cycle times and quality | not just the gauges
- Repeat until a user nears its minimum | then step back one increment
- Record the final set point and why | so it is not raised again without a reason
```

## Regulators at the users

Many users do not need line pressure at all. A blow-off, an air motor, a cylinder that only has to hold a light load or a pneumatic actuator with a light spring can work at a fraction of the main's pressure. A regulator at each such user, set to the lowest pressure that does the job, reduces its air use in proportion to absolute pressure for open uses, and in proportion to the volume of air per stroke for cylinders. Regulators also make users independent of the main's pressure, so the system set point can be lowered without affecting them.

Regulators have a cost: they drop pressure even when fully open, and an undersized regulator restricts flow at peak demand. They are chosen for their flow, not just their connection size, and their settings recorded and protected, because a regulator turned fully open to "fix" a problem defeats its purpose.

## Peaks and local storage

A user with a short, heavy demand, such as a machine that fires several large cylinders at once, or a blow-off that runs in bursts, can pull the local pressure down even when the main has ample average capacity. A small receiver close to that user, fed through a restriction or a check valve, supplies the burst from stored air and refills between cycles. It is usually far cheaper than enlarging the main or raising the system's pressure, and it is the remedy chosen in the failure case above. Chapter 8 develops the arithmetic of storage.

## Keeping leaks down

Leaks return. A plant that repairs two thirds of its leaks this year will find new ones next year as fittings wear, hoses age and equipment is modified. A sustainable programme has three parts: a survey at a regular interval, using ultrasonic detection during production or a quiet-time listening walk; a tag-and-repair system with an owner for each repair; and a measured leakage figure, from the load-time method, tracked over time. The measured figure is what tells management whether the programme is working.

## Exercise: the open blowpipe at lower pressure

The 6 mm open blowpipe is regulated down to 300 kPa gauge, which still clears the conveyor. Estimate its new free air flow and annual cost at 4,000 hours.

**Answer.** Choked flow is proportional to absolute pressure upstream, so the flow falls by about (300 + 101.3) ÷ (600 + 101.3), about 0.572, to roughly **1.09 m³/min**. At 7.57 kW per m³/min, that is about 8.2 kW, about **A$8,200 a year**, a saving of about A$6,100. An engineered nozzle or a solenoid controlled by a product sensor would cut it much further; an electric blower further still. The pressure change alone, made with a regulator costing far less than a year's saving, is the quickest first step while the better options are arranged.

