---
book: welding-automation-by-the-numbers
chapterSlug: robot-cell-payback
order: 5
title: "Robot cell payback"
description: "Build a robot welding cell's business case from capital, the saving per hour of use and the hours it will really run, see why utilisation decides payback, and test the case with present value."
draft: false
---

A robot welding cell is a large purchase for a small or mid-sized fabricator, often the largest single piece of equipment it will buy. The robot's makers and integrators will show how fast it welds; the business case must show whether it pays. The answer depends less on the robot's speed than on how many hours a year it will actually weld. A cell that welds one shift a day, every day, on work that suits it, can pay for itself in two or three years; the same cell welding a few hundred hours a year on one product may never pay. The running case's owner asked for the arithmetic before signing anything.

This chapter builds the case from the capital cost, the saving for each hour the cell runs and the hours it will run, shows how strongly payback depends on utilisation, tests the case with present value, and sets out the costs that business cases usually forget.

## The capital

A robot cell is more than a robot.

```figure
type: stats
title: Illustrative capital cost of the fabricator's two-station robot cell
caption: This is an illustration in Australian dollars excluding GST, for teaching. Real prices come from quotations, and vary with the robot's size, the positioners, the guarding and the integrator.
- *A$490,000 | Total capital for the project | cell, fixtures, installation and training
- A$250,000 | Robot, controller, welding power source, torch and wire feed | including torch cleaning station
- A$60,000 | Two-station positioner | turntable with two fixture plates
- A$45,000 | Guarding, fume extraction and safety system | fencing, screens, interlocks, light curtain
- A$25,000 | Installation, commissioning and integration | foundations, services, programming of first parts
- A$110,000 | Fixtures | twenty dedicated, one modular table and locator sets
```

The robot and its welding equipment are about half the total. Fixtures, as Chapter 4 explained, are a large share, and grow with every new part number. Guarding and fume extraction are not optional. Installation, commissioning and the programming of the first parts are often underestimated by buyers who have not done it before.

## The saving per hour of use

The cell saves money each hour it welds, by doing the work of several hand welders with one operator, by using less weld metal and gas, and by making fewer defects.

```figure
type: formula
title: Net saving for each hour the cell welds
formula: saving per cell hour = (welder hours replaced − operator hours) × labour rate + materials and rework saved − running costs
caption: This is an illustration from the running case: the cell does about 2.4 welders' work (Chapter 1), with one operator, at a fully loaded labour cost of about A$72 an hour, saves about A$15 an hour of weld metal, gas and rework from smaller, consistent welds (Chapter 3), and costs about A$12 an hour to run in tips, nozzles, power and maintenance. Figures exclude GST.
- Welder hours replaced | about 2.4 per cell hour
- Operator hours | 1 per cell hour
- Labour rate | about A$72 an hour, fully loaded
step: labour saved ≈ (2.4 − 1) × 72 ≈ A$101 per cell hour
step: plus materials and rework ≈ A$15; less running costs ≈ A$12
step: net saving ≈ A$104 for each hour the cell welds
```

The figure is per hour of use. The cell earns it only while it is welding work that would otherwise have been welded by hand. An hour standing idle earns nothing, and the capital, the floor space and the operator's training cost the same whether the cell runs one hour a year or two thousand.

## Utilisation decides payback

The simple payback, the capital divided by the yearly saving, depends directly on how many hours the cell runs.

```figure
type: bars
title: Simple payback of the A$490,000 cell by hours of use a year
unit: years to repay the capital at about A$104 net saving per cell hour
max: 10
caption: This is an illustration. One shift is taken as about 1,725 welding hours a year. Payback ignores the time value of money and any residual value of the equipment.
- 525 hours, brackets only | 9.0
- 875 hours | 5.4
- *1,725 hours, one full shift | 2.7
- 3,450 hours, two full shifts | 1.4
```

The brackets alone, at 40,000 a year and the cell's rate of about 570 a day, need only about 70 days of the cell's time, about 525 hours. On that work alone the cell would take nine years to pay back, longer than many fabricators would accept for equipment that will need updating. Filled to one full shift a year, with other suitable work, it pays back in under three years; on two shifts, in under a year and a half. The robot is the same in every case; only the hours change.

The lesson is that the business case must be built on a realistic list of the work the cell will do, part by part, with the hours each needs, not on the robot's speed. A cell bought for one product needs that product's volume to fill it, or a plan for other work.

## Finding the hours

The running case's owner listed every product that could be welded in the cell: the brackets, about 525 hours a year; small sub-assemblies of the implement frames, such as hitch brackets and gussets, about 400 hours; crossmembers for the trailer chassis, about 500 hours; and work for two local manufacturers who had asked for robotic welding of their own brackets, about 300 hours. The total was about 1,725 hours, one full shift. The owner built the case on that list, with the outside work counted only after the customers had confirmed volumes in writing.

## Present value

Payback ignores the timing of money and what happens after it is repaid. A present value calculation discounts each year's saving to today's money and compares the total with the capital.

At a discount rate of 8% a year over a seven-year life, a saving of one dollar a year is worth about 5.2 dollars today. On one full shift, the cell's saving of about 1,725 × 104 ≈ A$179,000 a year is worth about 179,000 × 5.2 ≈ A$933,000 today, against a capital of A$490,000: a net present value of about A$444,000. On brackets alone, the saving of about A$54,600 a year is worth about A$284,000 today, a net present value of about minus A$206,000. The present value tells the same story as the payback, more starkly.

## What business cases forget

Several costs are commonly left out, and each can turn a marginal case negative.

Programming time for every new part, which Chapter 6 calculates, and the fixtures that go with it. The time of the engineer who develops procedures and programs, often a scarce person. Downtime for maintenance, tip changes and breakdowns, which lowers the hours available. The learning period after installation, when the cell runs slower and stops more often, typically several months. Training of operators, programmers and maintenance staff, and the cover while they train. Changes to the parts and upstream processes, such as the press brake improvements of Chapter 4, which may cost as much as the fixtures. And the cost of the welders whose work changes, if they are not retrained and redeployed, which Chapter 10 discusses.

On the other side, business cases often forget savings: the smaller welds and less distortion of Chapter 3, fewer repairs, less straightening, better ergonomics and fewer injuries, and the ability to quote for work that needs robotic consistency. Counting both sides honestly is the job.

## Sensitivity

Because so many figures are estimates, the owner tested how the case changed if they were wrong. If the cell did only twice, not 2.4 times, a welder's work, the saving per hour fell to about A$75 and the payback on one shift rose to about 3.8 years. If the labour rate rose by 10%, the payback fell slightly. If the outside work did not come, the hours fell to about 1,425 and the payback rose to about 3.3 years. The most damaging single risk was the cell running fewer hours than planned, which pointed the owner towards securing the work before buying the cell, and towards a programming capability in-house so that new parts could be added quickly.

## The alternatives

A business case compares the cell with something, and the fair comparison is with the best alternative, not with doing nothing. For the brackets, the alternatives included better manual fixtures and a positioner, which would raise the welders' arc-on time and cut over-welding at a small fraction of the cell's cost; a second shift of manual welding; or subcontracting the brackets to a shop that already had robots. The owner priced each. Better fixtures for manual welding would have captured perhaps a third of the cell's saving for about a tenth of its cost, a fast payback but a limited one. The cell's case had to beat that, not just beat the current method.

## Floor space and flow

A cell occupies floor space, with its guarding and its access for loading, maintenance and fork-lifts, typically several times the robot's own footprint. In a crowded shop, that space has a value, either in rent or in the work it displaces. The cell also changes the flow of parts: kits of cut and bent parts must arrive at the cell in the right order and quantity, and welded parts must be taken away, so the cutting, bending and finishing areas must be organised around the cell's rhythm. The running case's fabricator moved its press brakes closer to the cell and introduced kitting trolleys, each holding a batch of components for one part number, so the operator never waited for parts.

## Quality as revenue

Some of a cell's value does not appear as a saving at all, but as work the fabricator could not win without it. Several of the running case's customers had begun asking suppliers for welding records and consistent weld sizes, and two said they would move work to a supplier with robotic welding. A cell that wins or keeps such work earns its margin, which can be counted in the case if the customer's intentions are firm. The owner counted only work confirmed in writing, and listed the rest as an upside.

## Residual value and obsolescence

Robots last a long time mechanically, often well beyond the seven years assumed here, and a used robot has a resale value. Their controllers and software age faster, and welding power sources improve steadily, so a cell may be upgraded part by part rather than replaced. Fixtures have little resale value, because they suit only the fabricator's parts. A cautious case gives the equipment no residual value; a fuller one adds a modest resale value at the end of its life, discounted to today. In the running case, adding a resale value of about A$60,000 after seven years raised the present value by about A$35,000, useful but not decisive.

## The operator's day

The cell's saving assumes an operator who keeps it running: loading, unloading, inspecting parts, changing tips and nozzles, clearing small faults and keeping records. An operator who also has to fetch parts, wait for a forklift or chase a supervisor leaves the robot waiting. The fabricator wrote down the operator's tasks for each shift and timed them, and found that, with kitting and a torch cleaning station, one operator could keep the two-station cell running with time to spare for inspection. That spare time later let the operator tend a second, simpler cell, which raised the saving per operator hour further.

## Uptime

The hours a cell can run are reduced by planned maintenance, tip and liner changes, program changes and breakdowns. Well-run cells are available for most of their scheduled time, but rarely all of it. The fabricator's case assumed the cell would be available for about 90% of its scheduled hours once the learning period was over, and set up a maintenance schedule, a stock of wearing parts and a service agreement with the integrator to protect that figure.

## Leasing and staged buying

Some fabricators lease cells or buy them in stages, starting with a single-station cell or a collaborative robot, and adding positioners and stations as work grows. Leasing turns the capital into a monthly cost and moves some risk to the lessor; staging lets the fabricator learn on a smaller investment. Both are reasonable answers to the utilisation risk, and both still need the work list.

## The running case: the decision

This is an illustration. With the work list confirmed at about one shift, the owner approved the cell on a business case showing a payback of about three years, after allowing for six months of learning at reduced output, two days a month of programming for new parts, and the press brake upgrade. The board also approved positioners for the implement frames and two carriages for the chassis rails, each with its own small business case. A year after installation, the cell was running about 1,600 hours a year, slightly under plan, and the owner was pursuing more outside work to fill the remaining time.

## A failure: the cell bought for one contract

This is an illustration. A fabricator elsewhere bought a cell to weld a single high-volume product for one customer, building its case on that contract's volume. Eighteen months later, the customer moved the product to an overseas supplier. The cell stood idle for most of a year while the fabricator learned to program it for other parts and looked for work to put through it.

The cell was not a bad purchase, but the business case had rested on one customer and one part. The fabricator's next case listed several products and customers and showed what happened if the largest one left.

## Exercise: hours to pay back

A smaller cell costs A$280,000 in total and saves about A$85 for each hour it welds. How many hours a year must it run to pay back in three years? If its first-choice work needs only 700 hours a year, what is its payback, and what would the present value be over seven years at 8%, using a factor of about 5.2?

To pay back in three years, the cell must save 280,000 ÷ 3 ≈ A$93,300 a year, which at A$85 an hour needs about **1,100 hours** a year.

On 700 hours, it saves about 700 × 85 = A$59,500 a year, a payback of 280,000 ÷ 59,500 ≈ **4.7 years**. Its present value is about 59,500 × 5.2 ≈ A$309,000, a net present value of about **A$29,000**, barely positive. The case is marginal: finding another 400 hours of suitable work would change it from marginal to clearly worthwhile.
