---
book: resistance-welding-by-the-numbers
chapterSlug: testing-monitoring-and-cost-per-weld
order: 10
title: "Testing, monitoring and cost per weld"
description: "Prove resistance welds with peel, chisel and tensile tests, watch them with process monitoring, and build a cost per spot weld from labour, electrodes, energy and testing."
draft: false
---

A resistance weld hides its quality between the sheets. The outside shows an electrode mark that looks much the same whether the nugget beneath is full size, undersized or missing. That is why resistance welding depends on a combination of destructive tests on samples, process monitoring of every weld, and records that tie the two together. It is also why the cost of a spot weld is mostly not in the electricity or the copper but in the time and control around it.

This chapter sets out the cabinet shop's testing and monitoring plan, looks back at the tests that convinced shipbuilders in 1919, and builds a cost per weld for the uncoated and galvanised cabinets.

## Destructive tests

Three destructive tests are used on spot and projection welds.

**Peel test.** One sheet of a two-sheet coupon is clamped and the other is peeled away, often by rolling it around a bar with pliers or a fixture. A sound weld tears out of one sheet as a button, and the button diameter is measured and compared with the minimum size, 4.38 mm for the cabinet sheet (Chapter 2). A weld that separates at the interface, leaving no button, has failed.

**Chisel test.** A wedge-shaped chisel is driven between the sheets beside the weld until the weld either tears out as a button or the sheets deform. It can be used destructively on coupons or, with a limited wedge depth, as a check on parts that are then straightened, where the customer's specification allows it.

**Tensile-shear test.** A lap coupon with one spot is pulled apart in a tensile testing machine, and the peak load is recorded, as in Chapter 5. It measures strength directly but needs a testing machine, so it is used for procedure qualification and periodic checks rather than daily control.

ISO 10447 sets out peel and chisel testing of resistance spot and projection welds; customer specifications and other standards may set the sampling, the minimum sizes and the acceptable failure modes. Metallographic sections, cut through the centre of a weld, polished and etched, show the nugget's diameter, penetration into each sheet and any cavities or cracks. They are slower but give the most complete picture, and they are used for unequal stacks and for investigating problems.

```figure
type: compare
title: Destructive tests for spot welds
cols: What it shows | Where the shop uses it
caption: This is an illustration of the cabinet shop's use of each test. No single test replaces the others.
- Peel test | button diameter and failure mode | start of shift, after each dressing
- Chisel test | button or interface failure on the part | weekly on one part, where allowed
- Tensile-shear | peak load per spot | procedure trials and quarterly checks
- Section | nugget size, penetration, defects | unequal stacks and investigations
```

## What convinced the shipbuilders in 1919

Hornor recorded a series of tests made in 1919 at a bridge and ship-fabricating works, for the American shipbuilding programme, comparing spot-welded and riveted attachments of a steel angle lug to a plate. The riveted samples sheared three or all of their rivets at an ultimate load of 45,000 to 48,000 pounds, about 200 to 214 kN. The spot-welded samples, made on the heavy machines described in Chapter 3 with spots held for ten seconds, carried higher loads in every test reported, and several were forced out of the testing machine's grips before the welds failed.

The tests were made because the people who would have to rely on spot welding in ship structures needed evidence, not assurances. They also involved the classification society Lloyd's Register, which was investigating electric welding at the time. The principle has not changed: a resistance welding procedure earns trust through tests on the actual materials, joints and machines, recorded so that others can check them.

## Monitoring every weld

Destructive tests sample a few welds. Process monitoring watches all of them. The cabinet shop's welders record, for every weld:

- the **welding current**, measured by a sensing coil around the secondary loop, compared with upper and lower limits;
- the **weld time** actually delivered;
- the **electrode force**, from a pressure transducer, checked daily with a load cell;
- the **weld count** since the last dressing, which drives the stepper and the dressing alarm.

Some controls also monitor the electrode displacement during the weld. As the nugget heats it expands and pushes the electrodes apart slightly, then the electrodes move together as the metal softens; the shape of that movement tracks nugget growth, and a sudden collapse indicates expulsion. Adaptive controls go further and adjust current or time during each weld in response to resistance or displacement.

Monitoring does not prove a weld is good. It proves the weld was made with the settings that were proven good by destructive tests. That is why the two must be linked: a schedule is validated by tests, and monitoring confirms each weld stayed within the validated schedule. Chapter 3's morning current dip and Chapter 9's dressing problem were both found by monitoring and confirmed by peel tests.

## The cabinet shop's control plan

```figure
type: checklist
title: Resistance weld control plan for the cabinet line
caption: This is an illustration. Each item links a check to the failure it is meant to catch, from Chapters 1 to 9.
- x Incoming sheet surface and coating | oil, rust or coating changes the window (Ch 1, 9)
- x Force check with load cell | each shift (Ch 2, 4)
- x Peel coupon, two-spot at 30 mm pitch | start of shift and after each dressing (Ch 2, 5)
- x Current, time and force recorded | every weld, with limits (Ch 3)
- x Dressing at the counted interval | 500 welds uncoated, 150 galvanised (Ch 4, 9)
- x Leak test | every drip tray (Ch 6)
- x Push-out test, three nuts | each shift (Ch 7)
- x Bend test | each flash-weld batch (Ch 8)
- *? Full teardown | one cabinet a month, every spot peeled
```

## Reading the peel results as a trend

A peel test that passes tells the shop only that one weld was above the minimum. A series of results tells it where the process is heading. The shop records every button diameter and looks at the trend within each dressing interval, not just the pass or fail.

This is an illustration. During one galvanised shift, the post-dressing coupons and a mid-interval coupon gave these button diameters:

| Coupon | Welds since dressing | Button diameter |
|---|---|---|
| After dressing | 0 | 5.7 mm |
| Mid-interval | 75 | 5.3 mm |
| Before next dressing | 145 | 4.8 mm |

All three pass the 4.38 mm minimum, but the fall of 0.9 mm across one dressing interval shows how little margin remains at the end of it. If the dressing interval drifted from 150 to 200 welds, the extrapolated button would be about 4.8 − (0.9 ÷ 145) × 55 ≈ 4.5 mm, uncomfortably close to the minimum. The trend, not the pass, is what justified the weld counter that stops the machine at 150 welds, and it is what the shop would watch if it tried a longer interval with the dispersion-strengthened caps from Chapter 9.

## Records that others can check

The cabinet shop's welding records are designed so that a customer's auditor, or the shop's own engineer a year later, can trace any cabinet to the schedule it was welded on and the tests that proved that schedule. Each batch record lists the coil numbers of the sheet, the machine and schedule number, the electrode class and dressing interval, the monitoring summary with any out-of-limit welds and what was done about them, and the peel, push-out, leak and bend test results with the coupon coil numbers. Each schedule change is recorded with the lobe trial that justified it. That is the modern form of Hornor's 1919 tests: evidence, kept so that people who were not there can rely on it.

The monthly teardown is the shop's check on its whole system. One cabinet taken from production has every spot peeled and measured, every nut pushed out and the base ring bent. If the teardown finds anything that the routine checks did not, the control plan is changed.

## Cost per spot weld

This is an illustration. All costs are excluding GST, because they are business input costs on which GST is claimed back as an input tax credit. The shop's welding station costs A$95 an hour, covering the operator, the machine, floor space and overheads. Welding the 64 spots on a cabinet body, including loading, positioning and unloading, takes 5.0 minutes, which is 300 ÷ 64 ≈ 4.69 s per spot.

For the uncoated cabinet:

- **Labour and machine time**: 95 ÷ 3,600 × 4.69 ≈ **12.37 cents** per spot.
- **Electricity**: 5,600 J per weld from Chapter 3 is 0.001 56 kWh, about **0.05 cents** at 30 cents per kWh.
- **Electrode caps**: a pair costs A$16 and lasts about 30 dressings of 500 welds, 15,000 welds, so about **0.11 cents** per spot.
- **Dressing time**: each dressing takes the setter about 1.5 minutes, A$2.38 at A$95 an hour, spread over 500 welds, about **0.48 cents** per spot.
- **Testing**: six peel tests a day of about four minutes each cost about A$38, spread over 2,560 spots, about **1.48 cents** per spot.

The total is about **14.5 cents** per spot, or about **A$9.27** per cabinet body.

```figure
type: compare
title: Cost of one cabinet spot weld, uncoated and galvanised
cols: Uncoated | Galvanised
caption: This is an illustration, in cents per spot excluding GST. Labour and machine time dominate; electricity is negligible. Galvanised sheet adds cost mainly through dressing and electrode wear.
- Labour and machine time | 12.37 | 12.37
- Dressing time | 0.48 | 1.58
- Testing | 1.48 | 1.48
- Electrode caps | 0.11 | 0.36
- Electricity | 0.05 | 0.08
- *Total per spot | 14.48 | 15.87
- Total per cabinet body, 64 spots | A$9.27 | A$10.16
```

For the galvanised cabinet, labour, machine time and testing stay the same, but dressing every 150 welds raises the dressing cost to about 1.58 cents per spot and the caps to about 0.36 cents, while electricity rises to about 0.08 cents because of the higher current and longer time. The total is about **15.9 cents** per spot, **A$10.16** per cabinet, about 10% more than the uncoated cabinet.

Two conclusions follow. First, the welding schedule itself barely affects cost: electricity is a twentieth of a cent per spot. Second, the costs that matter are the handling time per spot and the time spent maintaining the process. A fixture that saves a second per spot is worth more than any change to the schedule.

The cost per spot leaves out several things that a full product cost would include: the sheet itself, set-up time at the start of a batch, scrap and rework, the monthly teardown cabinet, and the occasional investigation like the ones in this book. Those are better handled as separate lines in the product cost than spread across every spot. What the cost per spot is good for is comparing alternatives, such as a fixture, a different electrode or an automatic dresser, on the same basis, as the next section does.

## Is an automatic tip dresser worth it?

This is an illustration. An automatic tip dresser mounted beside the welder dresses the faces in about 5 seconds when the weld counter calls for it, instead of the setter's 1.5 minutes. Its installed cost is A$12,000.

On the galvanised cabinets, each dressing costs 5 ÷ 3,600 × 95 ≈ A$0.13 of station time instead of A$2.38, so the dressing cost falls from about 1.58 cents to about 0.09 cents per spot. At 2,560 spots a day the saving is about (1.583 − 0.088) cents × 2,560 ≈ **A$38 a day**, which pays back the A$12,000 in about 12,000 ÷ 38.27 ≈ **313 working days**, about a year and a quarter at 250 working days a year. On uncoated sheet, with dressing only every 500 welds, the saving would be less than a third of that and the payback correspondingly longer. The shop bought the dresser when the galvanised cabinets became a regular product, and it also improved consistency, because the automatic dresser restores the face to the same profile every time.

## A failure: the coupons that did not represent the product

This is an illustration. In the second month of galvanised production, the monthly teardown found several undersized spots on a galvanised cabinet whose start-of-shift and post-dressing peel tests had all passed.

The investigation looked at the coupons rather than the welder. The coupon strips were cut from offcuts in the scrap bin, and the bin held both galvanised and uncoated offcuts. On the day in question, the coupons had been cut from uncoated sheet. On uncoated sheet the galvanised schedule, with its higher current and longer time, makes large welds easily, so the coupons passed while the product, on galvanised sheet with its narrower window, was marginal.

The correction was simple and was written into the control plan: coupon strips are cut from the same coil as the product, marked with the coil number, and stored separately for each material. The coupons are recorded against the product batch, so the link between test and product can be shown. The cabinets from the affected period were checked by chisel tests on a sample, and those below the minimum were reworked with additional spots under an approved repair procedure.

## Exercise: one second faster

The shop's engineer designs a new fixture that reduces the station time for the 64 spots from 5.0 to 4.0 minutes. Calculate the new labour and machine cost per spot and per cabinet body for uncoated sheet, keeping the other cost elements the same, and the annual saving at 40 cabinets a day for 250 days.

The time per spot falls to 240 ÷ 64 = 3.75 s, so labour and machine time costs 95 ÷ 3,600 × 3.75 ≈ **9.90 cents** per spot. Adding the unchanged 0.48 + 1.48 + 0.11 + 0.05 = 2.12 cents gives about **12.0 cents** per spot, or 64 × 0.120 ≈ **A$7.69** per cabinet body.

The saving per cabinet is about 9.27 − 7.69 = A$1.58, so over 40 cabinets a day for 250 days the annual saving is about 1.58 × 40 × 250 ≈ **A$15,800**, excluding GST. That is far more than any change to the welding schedule could save, which is the closing lesson of the book: once the weld is right, the economics of resistance welding are decided by handling, maintenance and control, and the numbers in this chapter show where to look.
