---
book: arc-welding-by-the-numbers
chapterSlug: arc-time-and-operator-factor
order: 6
title: "Arc time and operator factor"
description: "Turn weld metal into arc time and the welder's time, build the operator factor from the activities around the arc, and test a switch from stick to wire welding."
draft: false
---

The arc burns for only part of a welder's day. Between runs the welder changes electrodes, chips slag, fits and tacks the next part, moves the work, checks the welds and takes breaks. The ratio of arc time to the welder's total time is called the operator factor, or arc-on factor, and it is the single most important number in estimating welding time. It is also the most misused, because it is often treated as a fixed property of a process when it is really the result of everything that happens around the arc.

This chapter calculates the arc time for a conveyor frame, builds the welder's time from the activities around the arc, and tests the shop's idea of switching from manual metal arc to gas metal arc welding.

## From weld metal to arc time

Arc time follows directly from the weld metal needed and the deposition rate:

**arc time = weld metal mass ÷ deposition rate**

For the conveyor frame, Chapter 5 found 3.11 kg of weld metal, and Chapter 4 measured a deposition rate of 1.5 kg an hour for the 4.0 mm electrodes at 170 A. The arc time is 3.109 ÷ 1.5 ≈ **2.07 hours**, about 124 minutes, per frame.

The deposition rate also fixes the travel speed for a given weld size. Weld metal is deposited at 1.5 kg an hour, which is 1.5 ÷ (7.85 × 10⁻⁶) ≈ 191,000 mm³ an hour, or about 3,185 mm³ a minute. Spread along a 6 mm fillet of 19.8 mm² cross-section, that is 3,185 ÷ 19.8 ≈ **161 mm/min**, the travel speed used in Chapter 1's arc energy calculation. If a welder travels faster at the same current, the weld is smaller; slower, and it is larger, with the cost consequences shown in Chapter 5.

```figure
type: formula
title: Arc time and travel speed for the conveyor frame
formula: arc time = m ÷ D;  travel speed = D ÷ (ρ × A)
caption: This is an illustration. The deposition rate is the shop's measured value for its 4.0 mm electrodes at 170 A.
- m | weld metal per frame, 3.109 kg
- D | deposition rate, 1.5 kg/h
- ρ | density of steel, 7.85 × 10⁻⁶ kg/mm³
- A | fillet cross-section with profile factor, 19.8 mm²
step: arc time = 3.109 ÷ 1.5 ≈ 2.07 h per frame
step: travel speed = 1.5 ÷ (7.85 × 10⁻⁶ × 19.8) ≈ 9,650 mm/h ≈ 161 mm/min
```

## What the welder does when the arc is not burning

The shop timed its welders over a week of conveyor frames, recording every activity. This is an illustration. The average time per frame was 6.91 hours, broken down as follows:

| Activity | Hours per frame | Share |
|---|---|---|
| Arc time | 2.07 | 30.0% |
| Electrode changes, 125 at about 25 s | 0.87 | 12.6% |
| Slag removal and cleaning between runs | 0.65 | 9.4% |
| Fit-up and tacking | 1.24 | 17.9% |
| Positioning and moving the frame | 1.04 | 15.0% |
| Inspection and final cleaning | 0.55 | 8.0% |
| Personal time and other | 0.49 | 7.1% |
| **Total** | **6.91** | **100%** |

The operator factor is 2.07 ÷ 6.91 ≈ **30%**. The rest of the time is spread across activities with very different causes. Electrode changes and slag removal belong to the process: they exist because the welding is done with short electrodes that leave slag. Fit-up and positioning belong to the job and the workshop: they exist because the frame must be assembled and moved, whatever the welding process. Inspection and personal time belong to the system.

```figure
type: bars
title: Where a welder's 6.91 hours on a conveyor frame go
unit: hours per frame
max: 2.5
caption: This is an illustration from the shop's time study. Only the electrode changes and slag removal are caused by the manual metal arc process itself; fit-up, positioning, inspection and personal time remain whatever process is used.
- *Arc time | 2.07
- Fit-up and tacking | 1.24
- Positioning and moving | 1.04
- Electrode changes | 0.87
- Slag removal and cleaning | 0.65
- Inspection and final cleaning | 0.55
- Personal and other | 0.49
```

## The trap in a fixed operator factor

A common way of estimating welding time is to calculate the arc time and divide by a typical operator factor for the process. Suppose an estimator took 30% for manual metal arc and, from a supplier's brochure, 45% for semi-automatic gas metal arc welding. For gas metal arc welding at a deposition rate of 3.5 kg an hour, the arc time would be 3.109 ÷ 3.5 ≈ 0.89 hours, and dividing by 45% would give about **1.97 hours** per frame, against 6.91 hours for manual metal arc. On that basis the change would cut welding time by more than two-thirds.

That conclusion is wrong, because the operator factor is not a property of the process alone. The fit-up, positioning, inspection and personal time do not change when the welding process changes. Building the gas metal arc time from the activities instead gives a different answer.

This is an illustration. With gas metal arc welding using a 1.2 mm solid wire:

| Activity | Manual metal arc | Gas metal arc |
|---|---|---|
| Arc time | 2.07 h | 0.89 h |
| Electrode changes / wire, tip and nozzle maintenance | 0.87 h | 0.15 h |
| Slag removal / spatter cleaning | 0.65 h | 0.25 h |
| Fit-up and tacking | 1.24 h | 1.24 h |
| Positioning and moving | 1.04 h | 1.04 h |
| Inspection and final cleaning | 0.55 h | 0.55 h |
| Personal and other | 0.49 h | 0.49 h |
| **Total per frame** | **6.91 h** | **4.61 h** |
| **Operator factor** | **30%** | **19%** |

The gas metal arc process saves about 2.30 hours per frame, a third of the welder's time, not two-thirds. Its operator factor falls to about 19%, because the arc time shrank while everything else stayed. A shop that budgeted on the brochure's figure would have planned for 19 frames a week from one welder in a 38-hour week and achieved about 8.

```figure
type: compare
title: One welder's week on conveyor frames, 38 hours
cols: Manual metal arc | Gas metal arc, activity-based | Gas metal arc, brochure factor
caption: This is an illustration. The brochure figure applies a fixed 45% operator factor; the activity-based figure keeps the fit-up, positioning, inspection and personal time that do not depend on the process.
- Hours per frame | 6.91 | 4.61 | 1.97
- Frames per week | 5.5 | 8.2 | 19.3
- Operator factor | 30% | 19% | 45% (assumed)
```

The activity breakdown also shows where else the shop could look. Fit-up and positioning together take 2.28 hours per frame, more than the arc time with manual metal arc welding and two and a half times the arc time with gas metal arc. Chapter 8 shows how a positioner and better fixtures reduce them, and the saving applies whichever process is used.

## Moving work between people changes the factor, not the total

The operator factor depends on who does what. If a fitter assembles and tacks each frame before the welder starts, the welder's time per frame falls by the 1.24 hours of fit-up and tacking, to about 5.67 hours, and the welder's operator factor rises to 2.07 ÷ 5.67 ≈ 37%. The welder looks more productive. But the fitter's 1.24 hours still have to be paid for, so the total labour per frame is unchanged at 6.91 hours.

Splitting the work can still be worthwhile. A fitter is often paid less than a qualified welder, the two can work on different frames at the same time, so throughput rises, and specialisation tends to improve both fit-up and welding. The point for estimating is that the operator factor of one person is not a measure of the cost of a job. The estimate must count all the labour, whoever does it.

## First frames, learning and fatigue

The time study measured frames in the middle of a batch, after the welders had settled into the job. The first frames of a new design take longer, because the welders are working out the sequence, finding where access is awkward and discovering fit-up problems. This is an illustration. On the first conveyor frame of a new design, the shop recorded about 9.5 hours, falling to the steady 6.9 hours by about the fifth frame. For a small batch, the extra time on the first frames is a large share of the total, and the estimate should allow for it.

Fatigue works in the other direction. Welding in awkward positions, especially overhead, is tiring, and the welder's pace and quality fall over a long day. The time study found that the arc time per kilogram deposited was about 10% higher in the last two hours of a shift on frames that needed overhead welding than on frames welded mostly flat. That is another argument for the positioner in the exercise below, and for planning the work so that awkward welds are not all left until the end of the day.

## Duty cycle and the faster process

A faster-depositing process also changes the machine's duty. Gas metal arc welding at a few hundred amperes with a 1.2 mm wire runs at a higher current than the 170 A of the manual metal arc electrodes, and without the pause for electrode changes the arc can run for long stretches on a long rail weld. Chapter 3's duty cycle check must be repeated for the new machine and settings: a gas metal arc set with too low a rating for continuous rail welding will trip its thermal cut-out and lose some of the time the process was meant to save.

## What else changes with wire welding

Time is not the only difference between the two processes, and the shop listed the others before deciding.

- **Consumables.** Gas metal arc welding uses wire, shielding gas, contact tips and nozzles instead of electrodes. Wire deposits a much higher fraction of what is bought, because there is no stub and no coating, but the gas is a new cost (Chapter 10).
- **Site work.** The shielding gas is blown away by wind, so gas metal arc welding outdoors needs screens or a different process. The shop would keep manual metal arc welding for quarry repairs.
- **Fusion.** At low currents in the short-circuit transfer mode, gas metal arc welding is prone to lack of fusion, which is hard to see. The procedure must specify the transfer mode, and the welders need training and qualification in the new process.
- **Equipment.** A wire feeder, gas supply and a power source rated for the higher duty are needed, and the multi-process inverter would need checking against Chapter 3's duty calculation.
- **Fume.** Fume generation differs between processes, settings and consumables, so the fume controls in Chapter 9 would be reassessed for the new process rather than assumed to carry over.

None of these ruled out the change, but each had to be priced and planned, and together they explained why the shop ran a trial on two frames before committing.

## Measuring operator factor honestly

The shop's time study recorded what welders actually did, which is different from what a procedure or a supplier says they do. Three practices made the numbers useful.

1. **Activities were recorded, not just arc time.** A weld monitoring unit on the machine logged arc-on time; a supervisor's time study recorded the other activities.
2. **The study covered several welders and several frames.** One fast welder on one good day would have given a misleading figure.
3. **The results were discussed with the welders.** They pointed out that the frames were moved twice for each side because the crane was shared, which explained much of the positioning time and led directly to Chapter 8's positioner.

## A failure: the quote built on arc time

This is an illustration. Before the time study, the shop had quoted a batch of 40 conveyor frames for a new customer on the basis of arc time plus a 50% allowance, about 3.1 hours of welding per frame. The welding took about 6.9 hours per frame, more than twice the quote, and the job lost money on welding labour.

The estimator had calculated the weld metal and arc time correctly. The error was in assuming that welding time was arc time plus a margin, which implies an operator factor of 2.07 ÷ 3.1 ≈ 67%, more than double what manual metal arc welders achieve on fabrication work with this amount of fit-up and handling. The time study showed exactly where the missing hours went.

The shop's estimating sheet now builds welding time from the activities: arc time from weld metal and deposition, electrode changes from the electrode count, slag removal from the number of runs, and fit-up and positioning from the number of parts and lifts, using its own measured rates. The 40-frame contract was completed, and the customer accepted a revised price for later batches based on the study.

## Exercise: a positioner

The shop is considering a frame positioner that would reduce positioning and moving from 1.04 to 0.40 hours per frame and, by letting more welds be made flat, raise the 4.0 mm electrode's effective deposition from 1.5 to 1.6 kg an hour across the frame. For manual metal arc welding, calculate the new arc time, the new total time per frame, the new operator factor and the frames per 38-hour week, keeping the other activities the same.

The new arc time is 3.109 ÷ 1.6 ≈ **1.94 h**. The other activities become 0.87 + 0.65 + 1.24 + 0.40 + 0.55 + 0.49 = 4.20 h, so the total is about 1.94 + 4.20 = **6.14 h** per frame. The operator factor rises to 1.94 ÷ 6.14 ≈ **32%**, and one welder completes 38 ÷ 6.14 ≈ **6.2 frames** a week instead of 5.5.

The positioner saves about 0.77 hours per frame, 0.64 from handling and 0.13 from faster deposition. With gas metal arc welding, the same handling saving would cut the 4.61 hours to about 3.97, so the positioner is worth considering on its own merits, whichever process the shop chooses.
