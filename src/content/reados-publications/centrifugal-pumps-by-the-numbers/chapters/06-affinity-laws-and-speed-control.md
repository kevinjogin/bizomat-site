---
book: centrifugal-pumps-by-the-numbers
chapterSlug: affinity-laws-and-speed-control
order: 6
title: "Affinity laws and speed control"
description: "Flow, head and power with speed, TP-3 at reduced speed, why slowing a pump on a lift system saves little and can cost more per m³, where speed control pays, and a cube-law business case."
draft: false
---

A centrifugal pump's curve belongs to one speed. Change the speed, and the whole curve moves in a predictable way: flow in proportion to speed, head with its square, power with its cube. Those are the **affinity laws**, and they are why variable-speed drives have become the standard way to control pumps. They are also why speed control is so often oversold: the cube law describes the pump, not the system, and on a system dominated by lift it can be badly wrong.

This chapter sets out the affinity laws, redraws TP-3's curve at reduced speeds, finds where TP-3 would run on its own system at each speed, shows why slowing it saves little energy per cubic metre and can cost more, contrasts a system where speed control pays handsomely, and ends with a business case built on the cube law alone.

## The affinity laws

For the same pump and impeller at a different speed, each point on the curve moves to a corresponding point:

- **flow** in proportion to speed: Q₂ ÷ Q₁ = n₂ ÷ n₁;
- **head** with the square of speed: H₂ ÷ H₁ = (n₂ ÷ n₁)²;
- **shaft power** with the cube of speed: P₂ ÷ P₁ = (n₂ ÷ n₁)³.

The efficiency at corresponding points stays about the same, which is why the power follows the cube of speed when the flow follows speed and the head its square. The laws hold well for moderate changes of speed, and the pump's maker can say how far they hold for a particular pump; at very low speeds, and for small pumps, the efficiency falls somewhat. NPSHr also changes with speed, roughly with its square.

```figure
type: formula
title: TP-3's head curve at a fraction r of full speed
formula: H = 34 × r² − 0.060 × Q²
caption: This is an illustration. Each point on the full-speed curve moves to r times its flow and r² times its head; for a curve of this form, the result is the same shape lowered by the shut-off head's factor.
- r | Speed as a fraction of 2,900 rpm
- 34 × r² | Shut-off head at that speed: 27.5 m at 90%, 21.8 m at 80%
- Q | Flow in L/s
step: At 90% speed, the curve is H = 27.54 − 0.060 × Q²
step: At 76.7% speed, the shut-off head equals the 20.0 m static lift: the pump delivers nothing
```

## TP-3 at reduced speed

On its own system, with the sump low and the system curve H = 20.0 + 0.02075 × Q², TP-3 at reduced speed runs where the lowered pump curve meets the unchanged system curve. With a variable-speed drive, taken as 97% efficient, and the motor at 88%:

```figure
type: compare
title: TP-3 on its system at reduced speed
rowhead: Speed
cols: Flow, L/s | Head, m | Pump efficiency | Shaft power, kW | Electrical energy, kWh per m³
caption: This is an illustration with the sump low. The motor is taken as 88% efficient throughout and the drive as 97%; at full speed the drive is bypassed. A real motor's efficiency also falls at light load, which would make the low speeds look worse.
- * 100%, 2,900 rpm | 13.17 | 23.60 | 74.0% | 4.11 | 0.0985
- 95%, 2,755 rpm | 11.50 | 22.75 | 73.7% | 3.48 | 0.0984
- 90%, 2,610 rpm | 9.66 | 21.94 | 71.8% | 2.89 | 0.0974
- 85%, 2,465 rpm | 7.52 | 21.17 | 66.4% | 2.35 | 0.1015
- 80%, 2,320 rpm | 4.67 | 20.45 | 51.5% | 1.81 | 0.1264
```

Slowing TP-3 from full speed to 80% cuts its flow from 13.17 to 4.67 L/s, nearly two-thirds, but its head falls only from 23.6 to 20.5 m, because most of the head is lift that must be supplied at any flow. Its power falls, but its flow falls faster, and its energy per cubic metre, after falling by about 1% at 90% speed, rises by **28%** at 80%. At about 77% speed, the pump cannot reach the header tank at all.

## Why lift systems resist speed control

The affinity laws describe how the pump's curve moves. Where the pump runs depends on the system's curve as well. On a system with no static head, the system's curve passes through zero and has the same shape as the pump's corresponding points: as the speed falls, the operating point slides along a parabola through the origin, and the flow, head and power follow the affinity laws exactly. On TP-3's system, the curve starts at 20 m. As the speed falls, the operating point slides down the system's nearly flat curve to much lower flows, and away from the pump's best efficiency point, so the efficiency falls too.

The energy that matters for a transfer pump is the energy per cubic metre, because the tank must be filled whatever the flow. A slower pump draws fewer kilowatts, but it must run for more hours to move the same volume, and what the plant pays for is the product of the two. On TP-3, that energy is close to its minimum at full speed, near its best efficiency point, and slowing down can only make it slightly better before it makes it worse. A variable-speed drive on TP-3 is useful for soft starting and for matching a smaller demand, not for saving energy. That conclusion is specific to TP-3's system, and the same pump on a different system could reach the opposite one; the system curve, not the pump, decides.

## Where speed control pays

Contrast a closed cooling loop, such as the one READOS's [Pipe Flow by the Numbers](/reados/publications/pipe-flow-by-the-numbers/the-system-curve/) develops, whose system curve passes through zero. This is an illustration. On such a loop, a pump slowed to 80% speed delivers 80% of its flow at 64% of its head, with power about 51% of full speed's, so the energy per cubic metre falls to about 64%. If the loop needs only 80% of its design flow for most of the year, because its heat load is lower, the drive saves about half the pump's power for most of the year. That is the case for which variable-speed drives earned their reputation.

Most real systems lie between the two. This is an illustration: a system needing the same 23.6 m at 13.17 L/s, but with only half of that as static lift, would run at 8.82 L/s and 17.1 m with TP-3's pump at 80% speed. Its shaft energy per cubic metre would fall to about 74% of full speed's, a worthwhile saving, though far from the cube law's promise. The fraction of the head at the duty point that is static is the quickest guide: near zero, speed control pays well; near 85%, as on TP-3, it pays little or nothing in energy.

```figure
type: bars
title: Energy per cubic metre at 80% speed, relative to full speed
unit: %
max: 140
caption: This is an illustration. On a closed loop, the cube law holds and energy per cubic metre falls; with half the head as lift, it still falls; on TP-3's lift system, the flow collapses and energy per cubic metre rises.
- Closed loop, no static head | 64
- Half the head is lift, shaft energy | 74
- * TP-3, 85% of head is lift | 128
```

## Speed and cavitation

NPSHr falls with speed, roughly with its square, so a slower pump is less prone to cavitation at a corresponding point. That is a real benefit where NPSHa is tight: TP-3 at 90% speed, delivering 9.66 L/s, needs about 0.81 times the NPSHr of the corresponding full-speed point, and its suction losses are lower too because the flow is lower. A pump that cavitates at run-out can often be cured by slowing it a little, at the cost of some flow.

The reverse also holds. A drive that runs a pump above its rated speed, which some drives allow, raises its NPSHr, its head and its power, and can overload the motor and push the pump into cavitation. Running above nameplate speed needs the pump maker's agreement.

## Drives, motors and their losses

A variable-speed drive is not perfectly efficient: this book takes 97% as an illustration, and the motor's own efficiency falls at reduced load and speed. At high speeds, the drive's loss is a small price; at low speeds, where the pump's power is small, it is a larger share. Motors run on drives for long periods at low speed may also need attention to cooling, because their shaft-mounted fans move less air, and to bearing currents and electrical noise, which the drive's maker addresses. None of these is a reason not to use a drive; all are reasons to count the whole set's efficiency, not just the pump's, when working out what a drive saves.

## Checking a pump's speed

The affinity laws also help with fault-finding. A pump whose head and flow are both a few per cent low, in the same proportion as their corresponding points, may simply be running slowly: a motor under heavy load slips a little more, and a pump on a drive may have been left at a reduced setting. A handheld tachometer on the shaft gives the speed in seconds, and the affinity laws give the head the pump should produce at that speed. If the measured head matches the scaled curve, the pump is healthy and the speed is the issue; if it falls below even the scaled curve, the pump is worn.

## Other reasons for a drive

A variable-speed drive has uses beyond energy, and on a lift system they may justify it on their own.

- **Soft starting and stopping**, which reduces the starting current and the pressure surges of Water Hammer by the Numbers.
- **Matching a duty that changes**, such as a header tank whose demand varies through the day, so that the pump runs longer at a gentle flow instead of starting and stopping often.
- **Trimming a pump that is too big**, by running it permanently at a lower speed instead of throttling it, as Chapter 7 compares.
- **Holding a pressure** in a pressurised system, such as a booster set, where the drive adjusts the speed to keep the discharge pressure constant as demand changes.

## Choosing TP-3's control

With the numbers in hand, TP-3's control choice is straightforward. Its options are to run at full speed between level switches, as it does now, or to run continuously at a reduced speed matched to the plant's average demand.

At full speed, TP-3 fills the header tank at 13.17 L/s and runs about 6.3 hours a day, at 0.0985 kWh per m³. At 95% speed, it would deliver 11.50 L/s, run about 7.2 hours a day for the same 300 m³, and use 0.0984 kWh per m³: the same energy, spread over a longer run with fewer starts. At 90%, it would use about 1% less energy per cubic metre, but at 9.66 L/s it would fall below the plant's 12 L/s minimum, which exists to refill the tank quickly after heavy wash-down. Below that, it would use more.

The plant kept level-switch control at full speed. A drive was not ruled out for the future, for soft starting if surge or starting current became a problem, but there was no energy case for one. The decision took an afternoon with the curves, and saved the cost of the drive.

## Measuring a saving

Where a drive or any other change is expected to save energy, the saving should be measured, not assumed. The fair measure for a transfer pump is the energy per cubic metre, from an energy meter and the flow meter's totaliser over the same period, before and after the change, at similar sump levels and demands. A comparison of kilowatts alone is misleading, because a slower pump uses less power but runs longer; the trial in the error below would have looked like a success on a kilowatt reading.

## The error: a cube-law business case

This is an illustration. A supplier's representative proposed a variable-speed drive for TP-3, with a business case that assumed the pump would run at 80% speed and, by the cube law, use 0.8³ = 51% of its power for 80% of its flow, saving about a third of the energy per cubic metre and about A$1,170 a year.

Fitted on trial, the drive at 80% speed produced 4.67 L/s, not the predicted 10.5 L/s, and the header tank filled so slowly that wash-down hoses ran short in the afternoon. The energy sub-meter showed the energy per cubic metre **28% higher** than at full speed, not a third lower. The plant returned the drive to full speed, where its energy per cubic metre was effectively unchanged from before the trial.

The case had applied the pump's affinity laws as if they were the system's. The cube law is true of the pump: at 80% speed, every point on its curve did move to 80% of the flow, 64% of the head and 51% of the power. But the system did not move with it, and on a system that needs 20 m before any water flows, the pump's lowered curve met the system at a quite different point. The plant now requires any speed-control proposal to show the operating point at each speed on the actual system curve, with the static head drawn in. A proposal that cannot show those points is returned unread.

## Exercise: the speed at which TP-3 stops delivering

TP-3's static lift with the sump low is 20.0 m and its shut-off head at 2,900 rpm is 34 m. Find the speed at which its shut-off head equals the static lift. What would the minimum speed be with the sump high, at 18.5 m?

**Worked answer.**

- Shut-off head scales with the speed squared, so 34 × r² = 20.0 gives r = √(20.0 ÷ 34) = **0.767**, or about **2,224 rpm**.
- With the sump high, 34 × r² = 18.5 gives r = √(18.5 ÷ 34) = 0.738, about **2,139 rpm**.

Below those speeds, TP-3 runs against the static column and delivers nothing, heating the water in its casing. A drive on a lift system must have its minimum speed set safely above this point, and Chapter 9 explains why running at no flow is harmful.
