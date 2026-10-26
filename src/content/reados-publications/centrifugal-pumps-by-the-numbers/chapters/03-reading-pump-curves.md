---
book: centrifugal-pumps-by-the-numbers
chapterSlug: reading-pump-curves
order: 3
title: "Reading pump curves"
description: "The four curves on a data sheet, the best efficiency point and the range around it, impeller families and speeds, what a curve promises, and a spare pump on a motor of the wrong speed."
draft: false
---

A pump's data sheet is a page of curves, and almost every question about a pump, whether it can do a job, where it will run, how much energy it will use and how long it will last, is answered by reading them. They are drawn from the maker's tests and they follow conventions that are easy to misread: which speed, which impeller, which liquid, what tolerance. A curve read correctly is the best information there is about a pump. A curve read wrongly is worse than none, because it is trusted.

This chapter reads TP-3's illustrative data sheet: its head, efficiency, power and NPSH curves, its best efficiency point and the range of flows around it where the pump should run, the families of curves for different impellers and speeds, and what the maker's curve does and does not promise. It ends with a spare pump fitted with a motor of the wrong speed.

## The four curves

A centrifugal pump's data sheet usually shows four curves against a common axis of flow.

1. **Head**, the curve this book has used since Chapter 1. For TP-3 it falls from 34 m at zero flow, the **shut-off head**, as the flow rises.
2. **Efficiency**, rising from zero at zero flow to a peak and falling beyond it. TP-3's peaks at 74% near 13 L/s.
3. **Power**, the shaft power, which Chapter 2 calculated from the first two. Some data sheets show it directly; others leave it to be calculated.
4. **NPSH required**, the net positive suction head the pump needs at its inlet to avoid harmful cavitation, rising with flow. Chapter 5 deals with it in full.

Every curve applies to one speed, one impeller diameter and a stated liquid, usually clean cold water, and none applies outside those. The data sheet says which; reading a curve without checking those three is the commonest way to misuse one.

```figure
type: compare
title: TP-3's illustrative data sheet, read at key flows
rowhead: Flow
cols: Head, m | Efficiency | NPSH required, m | Where it is
caption: This is an illustration at 2,900 rpm with a 160 mm impeller on clean water. Not any manufacturer's data.
- 0 L/s | 34.00 | 0 | 1.50 | shut-off
- 6 L/s | 31.84 | 52.5% | 1.93 | well below the best point
- 9.1 L/s | 29.03 | 67.3% | 2.49 | 70% of the best point's flow
- * 13 L/s | 23.86 | 74.0% | 3.53 | best efficiency point
- 15.6 L/s | 19.40 | 71.0% | 4.42 | 120% of the best point's flow
- 18 L/s | 14.56 | 63.1% | 5.39 | far out on the curve
```

## The best efficiency point

The **best efficiency point**, BEP, is the flow at which the pump's efficiency peaks. It is more than an energy figure. At the best point, the liquid enters and leaves the impeller's vanes at the angles they were designed for, the flow through the casing is smooth, and the radial force on the impeller, which the bearings must carry, is smallest. Away from it in either direction, the flow separates from the vanes, recirculates, and pushes the impeller sideways.

So the best point is where a pump runs quietest, coolest and longest. Pumps run well left of it suffer recirculation, vibration and seal wear; pumps run well right of it suffer high power, high NPSH required and cavitation. A pump selected so that its normal operating point is close to its best point is a pump that will last. It is also the pump that uses least energy for its work, so reliability and running cost point the same way. A selection that sacrifices one for the other usually loses both, because a pump that vibrates and wears its seals also loses efficiency as it wears.

## The range around the best point

No pump runs exactly at its best point all the time, and none needs to. There is a range of flows either side in which a pump runs well. Pump makers publish a **preferred operating range** and a wider **allowable operating range** for each pump, based on its design and their testing. This is an illustration: a common guide for a pump like TP-3 is a preferred range from about 70% to 120% of the best point's flow, which for TP-3 is about 9.1 to 15.6 L/s.

TP-3's operating point at 13.17 L/s, with the sump low, is almost exactly at its best point. With the sump high, Chapter 4 will show that it moves to 13.86 L/s, still well inside the range. The plant can expect a long, quiet life from this pump, provided nothing moves its operating point out of the range: a closed valve, a broken pipe or the wrong motor.

## Families of curves

A single pump casing is usually offered with a range of impeller diameters, and at more than one speed. The data sheet then shows a family of head curves, one for each impeller diameter, with lines of equal efficiency drawn across them like contour lines, and sometimes a separate sheet for each speed.

Reading a family, the steps are:

1. **Find the speed** the sheet is drawn for, and confirm it matches the motor: about 2,900 rpm for a two-pole motor on 50 Hz, about 1,450 rpm for a four-pole motor, each a little below its synchronous speed under load.
2. **Find the duty point**, the required flow and head, on the sheet.
3. **Choose the impeller** whose curve passes at or just above the duty point.
4. **Read the efficiency** from the contours at that point, and the NPSH required and power at that flow.

TP-3's 160 mm impeller is one of a family; Chapter 7 shows what trimming it to a smaller diameter does.

## Units and conventions

Data sheets from different makers and countries use different units, and a careful reader converts before comparing. Flow may be in L/s, m³/h or, on sheets from the United States, US gallons per minute; head in metres, sometimes in feet; NPSH in the same units as the head. TP-3's 13 L/s is 46.8 m³/h. A sheet that shows pressure in kPa or bar instead of head has assumed a liquid's density, usually water's, and must be converted back to head for any other liquid.

Efficiency needs particular care. Most curves give the efficiency of the bare pump, its shaft power in against its hydraulic power out. Some, particularly for close-coupled sets and packaged boosters, give an **overall** efficiency that includes the motor, which is lower. Comparing a bare-pump efficiency from one maker with an overall efficiency from another flatters the first by the motor's losses, often ten points or more. The sheet's notes say which it is, and reading them takes a minute.

Finally, a sheet states the conditions of its test: the liquid, its temperature, and sometimes the acceptance grade. A sheet that says nothing about conditions is a sales curve, useful for shortlisting and not for a duty that matters.

## Speed changes everything

A pump's head depends on its tip speed squared, as Chapter 1 showed, so a curve drawn at 2,900 rpm does not apply at 1,450 rpm. At half the speed, the head at any corresponding point is a quarter, the flow half, and the power an eighth. Chapter 6 sets out those affinity laws. For reading data sheets, the point is simpler: a curve is for one speed only, and the first line to read on any data sheet is the speed.

## What a curve promises

A published curve is a typical curve. The particular pump delivered may differ from it within a tolerance, and pump test standards such as ISO 9906 define grades of acceptance tolerance on head, flow, power and efficiency for factory tests. Where the duty matters, the purchaser specifies a test to an agreed grade and receives a certified curve for the pump actually supplied. Where it does not, the published curve is used and the margin in the selection covers the difference.

Curves also assume clean, cold water. A liquid that is viscous, carries solids or gas, or is near its boiling point changes the curve, sometimes a great deal, and the maker provides corrections or separate curves for such duties.

## Stable and unstable curves

TP-3's head curve falls steadily from shut-off. Some pumps' curves do not: their head rises slightly as the flow increases from zero, peaks, and only then falls. Such a curve is called **drooping** or unstable. On a system with a large static head, a drooping curve can meet the system curve at two flows, and the pump may hunt between them, or fail to deliver at all when it starts against a full column. Two drooping pumps in parallel can fight each other, one taking all the flow while the other runs shut off.

For a pump that will start against a static lift, or run in parallel with others, a steadily falling curve is a requirement, and the data sheet is checked for it before anything else. TP-3's curve is stable, which suits its large static lift and its plant's plan to add a second pump.

## Checking a pump against its curve in service

A curve is also a diagnostic tool. A pump in service can be checked against its curve with a flow reading and a head reading taken at the same time, and the measured point either lies on the curve or it does not.

```figure
type: steps
title: Checking a pump against its curve
caption: The plant's routine for TP-3, made once a year and after any repair. Each step uses readings that Chapters 1 and 2 explained.
- Run the pump at a steady flow for some minutes | let the readings settle
- Read the flow from the meter | or a clamp-on meter on a straight length
- Read suction and discharge gauges, with their heights | and work out the pump's head from all four terms
- Read the motor's power with a power meter | not its current
- Plot the measured flow and head on the curve | and work out the efficiency
- Compare with last year's point | a falling head or efficiency at the same flow means wear
```

A measured point below the curve at its flow usually means wear, a partly blocked impeller or air in the suction. A point on the curve but at an unexpected flow means the system, not the pump, has changed, which is the subject of Chapter 4. Keeping the yearly points on one sheet turns a pump's slow decline into something visible long before it fails to deliver.

## Reading run-out

The flow at the far right of the head curve is the pump's **run-out**, where it would run if the system offered almost no resistance. Many data sheets end the curve at the largest flow the pump is suited to, and a pump that runs beyond the end of its published curve is in unknown territory: its power, its NPSH required and its vibration are not guaranteed. TP-3's curve is drawn to 18 L/s. A system that let it run beyond that, such as a broken discharge pipe, would overload its NPSH margin long before it overloaded its motor.

## The error: a spare pump at the wrong speed

This is an illustration. When TP-3's pump was out for a bearing change, the plant fitted a spare from the store: the same pump model, with the same 160 mm impeller, but on a base with a four-pole motor, about 1,450 rpm, left over from another job. The fitter checked the model and impeller against TP-3's data sheet, but not the motor's speed.

At half speed, the pump's head at every corresponding flow is a quarter of its full-speed value, so its shut-off head is 34 ÷ 4 = **8.5 m**. TP-3's system needs at least 18.5 m just to lift water to the header tank at the sump's high level, and 20.0 m at its low level. The pump could not reach the header tank at all. It ran, churning against the static head with nothing flowing, and the header tank's level fell all morning before an operator noticed.

It was found when the operator saw the discharge gauge reading about 61 kPa, far below the 176 kPa that 18 m of standing water in the discharge pipe exerts on the check valve, and the pump's casing warming. The pump was stopped before it was damaged; another hour of churning with no flow, as Chapter 9 explains, could have boiled the water in its casing and wrecked its seal. The plant's spare-pump record now lists each spare's motor speed alongside its model and impeller, and the data sheet for TP-3 is marked "2,900 rpm only" in red.

```figure
type: bars
title: Shut-off head against TP-3's static lift
unit: m
max: 40
caption: This is an illustration. At 1,450 rpm the pump's shut-off head is a quarter of its 2,900 rpm value, far below the lift it must overcome before any water flows.
- * Shut-off head at 2,900 rpm | 34.0
- Shut-off head at 1,450 rpm | 8.5
- Static lift, sump high | 18.5
- Static lift, sump low | 20.0
```

## Exercise: reading the preferred range

Using the illustrative guide of 70% to 120% of the best point's flow, and TP-3's best point at 13 L/s, find the preferred range in L/s and the head at each end from the curve H = 34 − 0.060 × Q². Is a duty of 12 L/s at 25.4 m inside the range?

**Worked answer.**

- 70% of 13 L/s is **9.1 L/s**, and 120% is **15.6 L/s**.
- At 9.1 L/s, H = 34 − 0.060 × 9.1² = **29.03 m**; at 15.6 L/s, H = 34 − 0.060 × 15.6² = **19.40 m**.
- The duty of 12 L/s is inside the range, at 92% of the best point's flow, and the curve gives 25.36 m there, just above the 25.4 m rounded figure.

A duty inside the preferred range, close to the best point, is a good selection. A duty near either end is acceptable if the pump will run there only part of the time; a duty outside it should prompt a look at a different impeller, speed or pump.
