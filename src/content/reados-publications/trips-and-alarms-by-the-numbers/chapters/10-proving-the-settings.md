---
book: trips-and-alarms-by-the-numbers
chapterSlug: proving-the-settings
order: 10
title: "Proving the settings"
description: "Turning calculated trip and alarm settings into evidence: end-to-end response tests, a planned demonstration of the nuisance-trip rate with confidence bounds, and an auditable register entry."
draft: false
---

A calculation says what a setting should do. Only a test shows what it does. Every remedy in this book rests on a model of the noise, a measured response chain and some code, and each of those can be wrong in ways the calculation cannot see: a filter in the wrong task, a deadband on the wrong side, a counter that never resets. The last step is therefore to test the trip and its alarm from end to end, to demonstrate over a planned period that the nuisance trips have stopped, and to write the result down where the next person to touch the trip will find it.

This chapter sets out PSLL-3's final settings, the tests that prove its response, the demonstration that its nuisance-trip rate meets a stated objective with stated confidence, and the trip register entry. Its error is a test that bypassed the transmitter and so missed a change made inside it.

## The final settings

```figure
type: compare
title: PT-3's thresholds after the investigation
rowhead: Function
cols: Signal used | Setting | Action
caption: This is an illustration. Each setting has its basis recorded in the trip register: the noise log, the calculation and the test results.
- PSLL-3 low-low trip | PT-3 through a 0.5 s first-order filter, in the fast task | Trip below 3.2 bar, latched; reset only above 3.4 bar | Holds the cell before the next shot
- PAL-3 low alarm | PT-3 through a 5 s first-order filter | Set below 3.6 bar, clear above 3.65 bar | Alarms the operator
- Strainer advisory | Hourly mean of PT-3 | Below 3.95 bar | Maintenance cleans the strainer at the next break
- Fouling check | CUSUM of hourly means, target 4.20 bar | Lower sum above 0.04 bar | Confirms the fouling rate each cycle
- DC-1 estimate | PSL-1 switch duty cycle, reset hysteresis 0.01 bar | Hourly mean from the inverse normal | Same advisory as DC-2
```

The settings rest on four calculations, each made from the full-rate log: Rice's formula for the trip and alarm rates, the variance factor for each filter, the replay of the noise model through the alarm logic, and the response of each filter to a pump stop. The predictions are that PSLL-3 will not trip on noise anywhere in the strainer's working range, from 4.20 down to 3.95 bar, that PAL-3 will be silent there too, and that a pump stop will hold the cell in about 0.8 s.

## Testing the response from end to end

A response test must cover the whole chain, from the physical change to the final action, because a fault can sit in any stage. The engineer planned five tests, each with a predicted result and a pass criterion written down before the test.

```figure
type: steps
title: Response tests for PSLL-3 and PAL-3
caption: This is an illustration. Each test has a prediction from the calculations and a criterion set beforehand. The calibrator tests check the logic; the pump-stop test checks everything, including the transmitter and the water itself.
- Calibrator step, 4.2 to 0.6 bar | Predicted 0.43 s from step to cell hold; pass if under 0.6 s.
- Calibrator short pulse, 0.3 s below 3.2 bar | Filtered value stays above 3.2 bar; pass if no trip.
- Calibrator slow ramp, 4.0 to 3.0 bar over 5 minutes | Trip within 0.02 bar of 3.2 bar; alarm sets at 3.6 and, on the way back, clears at 3.65 bar.
- Reset permissive | Reset ignored below 3.4 bar, accepted above it.
- * Live pump stop at a planned break | Predicted 0.78 s from pump contactor opening to cell hold; pass if under 1.0 s.
```

The calibrator tests inject a current into the PLC's input card and so test the filter, the comparison, the timers and the output, but not the transmitter or the process. The live pump-stop test is the only one that includes the transmitter's own response and the real fall of pressure in the pipework. It costs a few minutes of a planned break, and it is the test that matters most, as the error below shows. The engineer repeated it three times, at the start, middle and end of a break, to see its scatter.

## Demonstrating the nuisance-trip rate

The response tests show that the trip acts when it should. The remaining question is whether it stays quiet when it should, and that cannot be shown in an afternoon: the prediction is that nuisance trips have practically stopped, and the only proof is a period without them. How long a period?

The plant set an objective it could live with: a mean time between nuisance trips of at least **160 operating hours**, ten shifts, demonstrated at **90% confidence**. That is far less than the calculation predicts, deliberately. The demonstration is not a test of Rice's formula; it is a test of the whole system, including causes nobody has thought of, and the objective is set at the level the plant needs, not at the level the model promises.

Treating nuisance trips as events arriving at a constant rate, the [reliability demonstration test tool](/tools/reliability-demonstration-test/) calculates the test length needed to demonstrate a mean time between failures at a given confidence with a given number of failures allowed, from the chi-square distribution, along with the hours per unit and the calendar days at a stated number of running hours a day. With an objective of 160 hours, 90% confidence, no trips allowed, one cell on test, 16 running hours a day and 30 calendar production days available, it gives a test-length factor of 2.303, **368 hours** of running and **23.0 production days**, inside the 30 available. It also shows the factor if one trip were allowed, 3.890, which would need 622 hours, 39 days, more than the time available.

After 30 production days, 480 running hours, with no nuisance trip, the engineer entered the record into the [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/), which calculates, for a time-terminated record of operating hours and failures with a constant rate, the point estimate where there are failures, the one-sided lower bound at a chosen confidence, the two-sided interval and the further failure-free hours needed to meet a requirement. With 480 hours, no failures, 90% confidence and a requirement of 160 hours, it gave a lower bound of **208 hours** and the verdict that the requirement is demonstrated. At 80% confidence, from its table, the lower bound is 298 hours.

```figure
type: compare
title: What 480 hours of running can demonstrate
rowhead: Nuisance trips in 480 hours
cols: 90% lower bound on mean time between trips | Objective of 160 hours met? | Further trip-free hours needed
caption: This is an illustration. From the MTBF confidence bounds tool, constant-rate model. A single nuisance trip in the period would have left the objective undemonstrated, and the test would have run on.
- * 0 | 208 h | Yes | None
- 1 | 123 h | No | 142 h
- 2 | 90 h | No | 372 h
```

The table is worth making before the test starts, because it decides what happens if a trip does occur. With one nuisance trip, the record would not demonstrate the objective, and the test would continue for at least another 142 trip-free hours. More importantly, the trip would be investigated first: a trip that the noise model says should not happen is evidence of a cause the model does not contain.

### What the demonstration cannot show

A test of 480 hours can show that nuisance trips are rarer than about one in 208 hours. It cannot show that they are as rare as the calculation predicts, about one in billions of shifts at the clean end of the cycle, and no practical test ever could. The two kinds of evidence therefore do different jobs. The calculation, built on the measured noise, explains why the trips stopped and predicts how the trip will behave under conditions not yet seen, such as a faster fouling rate. The demonstration checks that nothing outside the calculation is causing trips. Where they agree, as here, each makes the other more credible; where they disagree, the disagreement is the most useful finding of all.

### Why a constant rate is the right model here

The constant-rate assumption is fair for nuisance trips at a steady mean pressure, because Rice's formula gives a constant crossing rate for stationary noise. It is not fair across a fouling cycle, where the rate rises steeply with time, as Chapter 7 showed. The demonstration therefore covered whole fouling cycles, with the strainer cleaned on the advisory, so that the 480 hours represent the conditions the plant will actually run in. A demonstration run only in the clean half of each cycle would prove much less.

## The error: a damping change inside the transmitter

The calibrator step test passed on the first attempt: 0.44 s from the step to the cell hold, against a prediction of 0.43 s. The live pump-stop test, a week later, gave **1.8 s**, three times in a row, against a prediction of 0.78 s. It was still inside the 3 s allowance, but more than twice the prediction and outside the 1.0 s pass criterion.

The difference had to lie in a stage the calibrator test did not include, and that meant the transmitter or the pipework. A check of PT-3's configuration with a handheld communicator found its damping set to 2.0 s instead of the 0.05 s recorded at commissioning. A technician calibrating PT-3 during the investigation had found its reading "jumping about" on the communicator's display and had increased the damping to steady it, intending to set it back, and had not. With 2 s of damping in the transmitter and 0.5 s of filtering in the PLC, the calculated time for the filtered value to fall to 3.2 bar after a pump stop is 1.52 s, and with the PLC and output stages 1.8 s, matching the test.

The damping was set back to 0.05 s and the live test repeated: 0.79 s. The transmitter configuration was added to the trip register and to the proof-test checklist, with a note that the damping must not be changed without a management-of-change review. The episode makes two general points. First, end-to-end tests catch what partial tests cannot; a calibrator test proves the logic, not the instrument. Second, every filter in the chain counts against the response budget, including ones in the field device that the PLC programmer cannot see.

```figure
type: bars
title: Pump-stop response, predicted and measured
unit: s
max: 3
caption: This is an illustration. Time from the pump contactor opening to the cell hold, with the 3 s allowance as the scale. The live test exposed a transmitter damping change that the calibrator test could not see.
- Predicted, 0.05 s damping and 0.5 s filter | 0.78
- * Measured with 2.0 s damping left in the transmitter | 1.8
- Measured after correcting the damping | 0.79
- Allowance | 3.0
```

## Keeping the proof current

A demonstration proves the settings under the conditions of the test. Plants change: pumps are replaced, strainers and dies are redesigned, transmitters are swapped for different models, and a setting that was sound may drift out of its basis without any change to the setting itself. Three routines keep the proof current.

**Proof testing.** Chapter 9's average probability of failure on demand assumes that dangerous undetected failures are found and repaired at each proof test. For PSLL-3, the annual proof test repeats the live pump-stop test, checks the transmitter's configuration against the register, including its damping, and compares its reading with a test gauge at two pressures. A proof test that only exercises the PLC logic leaves the transmitter's failures undetected, and the probability of failure on demand grows year by year instead of resetting.

**Re-logging the noise.** Once a year, and after any change to the pump, strainer, die or cooling valves, the engineer takes a new ten-minute full-rate log in normal production and compares its standard deviation and mean-crossing rate with the register. The settings are not very sensitive to modest changes: if the filtered noise grew by 10%, from 0.088 to 0.097 bar, the mean pressure at which nuisance trips begin would rise only from about 3.59 to 3.62 bar, still far below the strainer advisory. A larger change, such as a new slow component from a different die's cooling cycle, would need the calculations of Chapters 4 to 7 repeated.

**Watching the trip and alarm logs.** Every nuisance trip or alarm after the demonstration is investigated, not just reset. A trip that the noise model says should not happen means something has changed or was missed. The logs are reviewed monthly alongside the strainer advisory and the CUSUM, so that a slow change in any of them is seen before it turns into a problem.

### Telling the people who use it

The settings changed what operators and maintainers see. PAL-3, shelved for weeks, is back in service and now means something. The trip no longer acts on noise, so any trip must be treated as real until shown otherwise. The strainer is cleaned on an advisory, not when the cell stops. The engineer ran a short briefing on each shift, explaining what each signal now means and what to do about it, and the operating and maintenance procedures were updated to match. Settings that people do not understand get changed back, often by the people they were meant to help.

## The trip register entry

The last step is to record the result where it will be found. A trip register entry for PSLL-3 that would let a future engineer understand and safely change the trip holds at least the following.

```figure
type: checklist
title: Trip register entry for PSLL-3
caption: The entry records not only the setting but its basis, so that a future change can be checked against the same calculations.
- Purpose | Protects the die against loss of cooling flow from any cause, fast or slow.
- Setting and basis | 3.2 bar, the die engineer's minimum flow; response allowance 3 s.
- Decision rule | 0.5 s first-order filter in the fast task; latched; reset permissive 3.4 bar.
- Noise basis | σ = 0.150 bar, ν₀ = 5.22 per second, two components; log reference and date.
- Instrument settings | PT-3 range 0 to 10 bar, damping 0.05 s; not to be changed without review.
- Test results | Step 0.44 s; pump stop 0.79 s; ramp trip at 3.20 bar; demonstration 480 h, no nuisance trips.
- Related functions | PAL-3, strainer advisory, CUSUM, with their own bases.
- ? Review triggers | A new pump, strainer mesh, die design or transmitter, or a rise in nuisance trips: re-log and recalculate.
```

## How this applies to a small Australian business

When you change a trip or alarm, write down beforehand what each test should show and what counts as a pass, then test the whole chain at least once with a real process change, not just a calibrator. Decide in advance how long you will watch for nuisance trips and what record would satisfy you, using a demonstration test plan rather than a feeling that it has gone quiet. Keep the noise measurements, settings, test results and instrument configuration together in a trip register, because the next person to change anything needs all of them. For any trip that protects people, the plant's management of change and functional safety processes govern these steps, and this book's methods feed into them rather than replace them.

## Exercise: a demonstration for the alarm

The plant wants to demonstrate that PAL-3 raises no more than one nuisance alarm per 80 operating hours, at 80% confidence, allowing no alarms in the test. (a) What test-length factor and test duration does the chi-square method give? (b) With 16 running hours a day, how many production days is that? (c) If one nuisance alarm occurs after 200 hours and none after it, what 80% lower bound does a total of 300 hours with one alarm give, and is the objective met?

**Worked answer.** (a) With no failures allowed, the factor is half the 80% point of the chi-square distribution with 2 degrees of freedom: 3.219 ÷ 2 = **1.609**, so the test needs 80 × 1.609 = **129 hours**. (b) 129 ÷ 16 = **8.0 production days**. (c) With one alarm, the lower bound is 2 × 300 ÷ χ²(0.80, 4) = 600 ÷ 5.989 = **100 hours**, which exceeds 80 hours, so **the objective is met** even with the one alarm, though the alarm itself should still be investigated to see what caused it.
