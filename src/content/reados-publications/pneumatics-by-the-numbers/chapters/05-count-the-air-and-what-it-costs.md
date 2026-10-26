---
book: pneumatics-by-the-numbers
chapterSlug: count-the-air-and-what-it-costs
order: 5
title: "Count the air and what it costs"
description: "Calculate a cylinder's free air per cycle and per year, convert it to kilowatt-hours and dollars, and compare it with leaks, open blowing and vacuum ejectors that cost far more."
draft: false
---

Compressed air is rarely metered machine by machine, so its cost disappears into the electricity bill. Without numbers, people argue by instinct: one person is sure the new pusher will overload the compressor, another that air is practically free. Both are usually wrong in the same way. The cylinders that do useful work tend to use surprisingly little air. The leaks, the nozzles left blowing and the devices that run when nothing needs them tend to use a great deal. Counting the air puts each in proportion, and shows where effort to save it will pay.

This chapter counts the reject pusher's air per cycle and per year, converts free air into electricity and dollars, compares the pusher's demand with the compressor's capacity, and then sets it beside the leaks and open blowing that cost the factory far more. The failure case is a vacuum ejector on the carton erector, which ran all day whether or not there was a carton to hold.

## Air per cycle

Chapter 1 explained that the free air a cylinder uses is its swept volume multiplied by the compression ratio. A double-acting cylinder uses air on both strokes: the full piston area on the extend stroke, the annulus around the rod on the retract stroke. The tubes between valve and cylinder are filled and exhausted on each stroke too.

```figure
type: formula
title: Free air used by the reject pusher in one cycle at 6 bar gauge
formula: free air per cycle = (extend volume + retract volume + tube volumes) × compression ratio
caption: This is an illustration for the 25 mm bore, 10 mm rod, 300 mm stroke cylinder with two 0.5 m tubes of 4 mm bore. The compression ratio at 6 bar gauge is about 6.92.
- Extend volume, 491 mm² × 300 mm | about 0.147 litres
- Retract volume, 412 mm² × 300 mm | about 0.124 litres
- Two tubes, 12.6 mm² × 500 mm each | about 0.013 litres
step: free air ≈ (0.147 + 0.124 + 0.013) × 6.92
step: free air ≈ 1.96 litres per cycle
```

Small spaces inside the cylinder's end caps and the valve add a little more, which this estimate leaves out. Makers' consumption figures, and the WORKOS [pneumatic consumption](/tools/pneumatic-consumption/) calculator, follow the same method.

## Air per year

The pusher only works when a carton is rejected. At 40 cartons a minute and a reject rate of 2%, it makes about **0.8** cycles a minute. The line runs two eight-hour shifts, five days a week, about 50 weeks a year, or about **4,000 hours**. Over a year that is **0.8 × 60 × 4,000 ≈ 192,000 cycles**, using about **192,000 × 1.96 ≈ 377 m³** of free air.

Averaged over the working day, the pusher uses about **1.6 L/min** of free air. During each stroke it draws far more, about 160 L/min for a few tenths of a second, but those peaks are short and are supplied from the receiver and the air already in the pipes. The compressor has a capacity of about **1.2 m³/min**, 1,200 L/min, so the pusher's average demand is a little over a tenth of one percent of it. The fear that the pusher would overload the compressor was unfounded.

## Check the estimate with a meter

Calculations of air use are only as good as their assumptions about reject rates, hours and the small volumes left out. The maintenance lead checked the whole of line 2 with a thermal flow meter, hired for a fortnight and fitted temporarily in the branch pipe that feeds the line. The meter logged free air flow every minute.

The log showed three things. During production, line 2 drew an average of about **95 L/min**, of which the pusher's 1.6 L/min was barely visible. The rest came from the sealer's cylinders, the case packer and, as the flow during breaks revealed, leaks. During the half-hour lunch break, with the line stopped but the air still on, the flow fell only to about **40 L/min**. Nothing on the line was meant to be using air at all, so that 40 L/min was all leakage, about two fifths of the line's total use.

That single observation was worth more than any calculation. It showed that line 2's leaks used about twenty-five times as much air as the new pusher, and that the place to save money was not in the choice of bore size. The fittings, hoses and a sticking valve exhaust on the case packer were repaired the following week, and the break-time flow fell to about **8 L/min**.

Fixed flow meters on every branch make sense in a large plant with many lines. For a small factory that has never measured its air, a single hired meter moved from branch to branch over a few months gives most of the benefit for a fraction of the cost, and shows which branches deserve a permanent meter.

## From air to electricity to dollars

A compressor's electrical input for each unit of free air it delivers is its **specific power**, often given in kilowatts per cubic metre a minute. It depends on the compressor's type, size, condition, controls and pressure, and makers publish figures measured under standard conditions. This book assumes **7 kW per m³/min** for the factory's compressor when it is loaded, a teaching value; the real figure comes from the compressor's data sheet and the way it is actually controlled.

At 7 kW per m³/min, one cubic metre of free air takes **7 ÷ 60 ≈ 0.117 kWh**. At an assumed **A$0.30** a kilowatt-hour, that is about **A$0.035** per cubic metre, or three and a half cents. The pusher's 377 m³ a year therefore uses about **44 kWh** and costs about **A$13** a year in electricity.

That figure is for electricity only. It leaves out the compressor's maintenance, the time it runs unloaded, its eventual replacement and the treatment of the air. Those make the full cost of compressed air higher, but not enough to change the conclusion: a well-designed cylinder doing occasional useful work costs very little to run.

## Where the money really goes

The same arithmetic applied to air that does no useful work gives very different answers. A leak is a hole, and air escapes through it continuously while the system is under pressure. For a sharp-edged hole at the pressures used in factories, the flow is choked: it depends on the hole's area and the absolute pressure upstream, not on what is downstream. Using the standard formula for choked flow of air, with an assumed discharge coefficient of 0.65 and air at 20 °C, a hole at 6 bar gauge passes roughly:

- **1 mm** diameter: about **42 L/min** of free air;
- **1.5 mm**: about **95 L/min**;
- **3 mm**: about **379 L/min**.

Flow rises with the square of the diameter, so a hole twice as wide leaks four times as much. The WORKOS [air leak cost](/tools/air-leak-cost/) calculator applies the same method to other sizes and pressures.

```figure
type: bars
title: Annual electricity cost of the pusher and of air that does no useful work
unit: A$ a year
max: 3500
caption: This is an illustration at 6 bar gauge, for 4,000 hours a year at about A$0.035 per cubic metre of free air. Leak flows are estimates for sharp-edged holes; real leaks vary.
- Reject pusher, 192,000 cycles | 13
- One 1 mm leak | 353
- One 1.5 mm leak | 798
- *Line 1's 3 mm air jet left blowing | 3184
```

A single 1.5 mm leak, about the size of a split in a worn hose or a loose push-in fitting, costs about **sixty times** as much as the pusher. Line 1's air jet, left blowing continuously in Chapter 1's failure case, cost about **A$3,200** a year, and still did not reject every bag.

The U.S. Department of Energy's compressed air sourcebook reports that leaks can waste 20 to 30 percent of a compressor's output in a poorly maintained plant, and that leak detection and repair can bring this below 5 to 10 percent. Chapter 8 measures the factory's leaks and sets out a program to find and fix them.

## Open blowing and other questionable uses

Compressed air is often used for jobs other methods do better. The sourcebook lists open blowing, cooling with open tubes or air bars, and similar uses as potentially inappropriate because of their cost, and suggests alternatives such as brushes, brooms, dust collection and fans. In the packing factory, a walk-through with the maintenance lead and the production supervisor found:

- an open copper tube blowing dust off line 1's sealer jaws continuously, replaced by a short timed pulse each time the jaws opened;
- a blow gun used to clean the floor at the end of each shift, replaced by a vacuum cleaner, which also stopped flour dust being blown into the air;
- an air-driven stirrer in the mixing room that ran all shift, kept for now because it was in a dusty area where electric motors would need special ratings, with a timer added.

None of these was large on its own. Together they used more air than every cylinder in the factory.

```figure
type: checklist
title: Questions to ask of every use of compressed air
caption: This is an illustration of the walk-through checklist. Each use was listed with an estimated flow and hours, so the largest could be tackled first.
- Does it do useful work that needs air, such as a cylinder or a tool? | if yes, check it is sized and controlled well
- Does it run only when needed? | timers, sensors or interlocks, not continuous flow
- Is the pressure the lowest that does the job? | a regulator at the point of use
- Could electricity, a fan, a brush or a vacuum cleaner do it instead? | often cheaper and quieter
- x Leaving air flowing to be ready | the commonest waste
- ? Is anyone measuring its use? | a flow meter on a branch is cheap compared with a year of guessing
```

## Pressure costs money too

Air at higher pressure takes more energy to compress, and every leak and open blow passes more air at higher pressure. The sourcebook gives a rule of thumb for systems around 100 psi, about 7 bar: reducing discharge pressure by 2 psi, about 0.14 bar, reduces energy use by about 1 percent at full output, with a further reduction from the lower flow through leaks and other unregulated uses. Chapter 6 uses this when it looks at the compressor's pressure setting.

At the machine, the same logic says each device should run at the lowest pressure that does its job. The pusher's regulator was set at 6 bar, because the timing trial in Chapter 4 showed the pusher needed at least 4.5 bar and the supply could fall to 5 at busy times. Setting it at 5 would have saved about 14% of its air, as Chapter 1's exercise showed, a few dollars a year, at the cost of the pusher's margin. The saving that matters is not on the pusher, but on the compressor's setting and on the leaks.

## A failure case: the ejector that never stopped

This is an illustration. Line 1's carton erector picks flat carton blanks from a magazine with suction cups. The vacuum comes from an **ejector**, a small venturi device that uses a jet of compressed air to create suction, with no moving parts. Ejectors are simple and reliable, and they use compressed air continuously while they are switched on.

The erector's ejector was switched on when the machine started and stayed on all shift. During the air walk-through, the maintenance lead noticed that it hissed continuously, including during the long pauses when the magazine was being reloaded or the line was waiting for product. The maker's data gave its consumption at the supply pressure as about **150 L/min**. Over 4,000 hours, that is about **36,000 m³** of free air and about **A$1,260** a year in electricity.

The cups only needed vacuum for about 30% of the time, while picking and placing a blank. The correction was an ejector with an on-demand valve, switched on by the erector's controller only for each pick, and a vacuum switch confirming a good grip before the arm moved. Consumption fell to about 30% of the original, saving about **A$880** a year, and the erector became quieter. The vacuum cups and ejector were also checked against the WORKOS [vacuum gripper sizing](/tools/vacuum-gripper-sizing/) method to confirm the holding force was still adequate.

The detection came from listening during a walk-through, a method that costs nothing. Continuous hissing from a machine that works intermittently is always worth a question.

## How this applies to a small Australian business

Small factories rarely know what their compressed air costs, so arguments about it are settled by whoever is loudest. Count it instead. Work out each cylinder's free air per cycle and per year; it is usually small. Convert free air to dollars with your compressor's specific power and your electricity tariff. Then list the uses that run continuously, the leaks and the open blowing, estimate their flows and hours, and rank them. The largest items are almost never the machines doing useful work. A walk-through with a notebook, at a quiet time when leaks and continuous blowing can be heard, is the cheapest audit there is.

## Exercise: a season of heavy rejects

During a seasonal product run, line 2's reject rate rises from 2% to **5%** for the whole year. How many cycles does the pusher make, how much free air does it use and what does that cost? If the 32 mm bore cylinder from Chapter 2 had been chosen instead, using about **3.19 litres** a cycle with the same tubes, what would it have cost at the original 2% reject rate? Is either figure a reason to change the design?

**Worked answer.** At 5%, the pusher makes **40 × 0.05 × 60 × 4,000 = 480,000 cycles**, using about **480,000 × 1.96 ≈ 942 m³** of free air, costing about **942 × A$0.035 ≈ A$33** a year. The 32 mm cylinder at 2% would use about **192,000 × 3.19 ≈ 613 m³**, about **A$21** a year, compared with A$13 for the 25 mm bore. Neither is a reason to change the design: both are tiny next to a single leak. The bore choice in Chapter 2 rested on force margin, speed and end-of-stroke energy, and those remain the right grounds. The air walk-through is where the money is.
