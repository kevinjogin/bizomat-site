---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: measuring-and-proving-the-cycle
order: 9
title: "Thermocouples, surveys and proving the cycle"
description: "How to place load thermocouples at the slowest point, size them for the speed of the process, compare traces with the model, and avoid a thick sensor that made good oil look worn out."
draft: false
---

A calculated heating time is a prediction. Before it governs production, it should be compared with a measurement taken in the real furnace, with the real load, at the point that heats last. That measurement does two jobs: it confirms or corrects the calculation, and it fixes the inputs, such as the effective surface coefficient, that the calculation could only estimate. Done well, it turns a model into a proved cycle that the shop can defend to a customer or an auditor. Done badly, with a sensor in the wrong place or one too slow for the process, it produces confident wrong numbers.

This chapter covers the furnace's own temperature measurements, the load thermocouple and where to put it, how a sensor's time constant limits what it can see, and how to compare a trace with the model. The running case's error was a thick thermocouple used to log a quench, which recorded a cooling rate less than half the real one and nearly led to an unnecessary oil change.

## Three kinds of measurement

A heat-treatment furnace has at least three kinds of temperature measurement, and they answer different questions.

The **control thermocouple** sits in the furnace atmosphere or near the elements and tells the controller when to switch power. It measures the furnace, not the work, and its reading of 850 °C says nothing directly about any part.

**Survey thermocouples**, placed through the working space during a temperature uniformity survey, show how evenly the empty or loaded furnace holds its setpoint. Many heat treaters work to AMS2750, the aerospace pyrometry specification, which sets out survey, sensor calibration and instrument accuracy requirements; others follow customer or internal standards. This book names it only by scope; its classes, tolerances and test intervals must be taken from the specification itself.

A **load thermocouple** is fixed in or on a part, or in a test piece of the same section, and measures what the part does. It is the only one of the three that measures what the cycle is for, and it is the subject of the rest of this chapter.

## Where to put the load thermocouple

The rule, built up through Chapters 3 to 6, is to measure the point that heats last. For DS-100 that is the centre of the body's middle: the furthest point from the most heated surface, away from the free end and the flange, in a shaft in the middle of the row where its neighbours shade it most (Chapter 8). The places that are convenient to reach are the wrong ones. A hole in the free end reads early, as Chapter 6 found; a thermocouple wired to the surface reads the surface; a thermocouple in the end shaft of the row reads a shaft that sees more of the walls.

In practice, a load thermocouple for DS-100 goes into a hole drilled radially into a scrap or sacrificial shaft at mid-length, to the axis, with the sheath a close fit in the hole and the hole packed so that furnace gases cannot circulate in it. The thermocouple must be in good contact with the steel at its tip and must reach deep enough that heat conducted along the sheath from the hot surface does not bias the reading. A simple test settles the depth: if moving the tip a few millimetres deeper changes the reading by nothing measurable, the depth is enough.

```figure
type: checklist
title: DS-100's load thermocouple set-up for the proving trial
caption: This is an illustration of the shop's trial record. The open item is the comparison with the calculation, closed after the trial.
- x Part | sacrificial DS-100 shaft, same heat of steel and machining as production
- x Position in the load | third of six in the row, on the basket grid
- x Hole | radial, at mid-length, to the axis, close fit, packed at the surface
- x Sensor | 1.5 mm mineral-insulated type K, calibration record attached
- x Logging | one reading every 5 s through heating, hold, transfer and quench
- x Furnace record | control thermocouple and setpoint logged on the same clock
- *? Comparison | trace against the finite-difference model, Chapter 7
```

## How fast a sensor can follow

A thermocouple's tip is a small lumped body, Chapter 2's subject, and it has its own time constant. For a sheathed thermocouple of diameter D, treated as a long cylinder of metal with roughly steel's heat capacity, τ ≈ ρ c D ÷ (4h). With ρ c ≈ 5.1 MJ/m³·K, that gives:

- 1.5 mm sheath: about 13 s with h = 150 W/m²·K, about 1.9 s with h = 1,000 W/m²·K;
- 3 mm sheath: about 26 s and about 3.8 s;
- 6 mm sheath: about 51 s and about 7.7 s.

Inside a drilled hole, with an imperfect contact between sheath and steel, the effective time constant is longer still, because the gap adds a resistance. A sensor follows a changing temperature with a lag of roughly the rate of change multiplied by its time constant. In DS-100's furnace heating, the body's centre rises at most about 0.8 K/s near the start and only about 0.02 K/s near the end, so even a 6 mm sensor's lag is negligible where it matters, at the end of heating. In a quench, temperatures change by more than 10 K/s, and the same sensor can be wrong by tens or hundreds of kelvin.

## The failure case: the oil that was not worn out

This is an illustration. To check the oil quench, the shop logged a quench with a thermocouple 45 mm deep in a DS-100 body, 5 mm below the surface. The only sensor long enough to hand was a 6 mm sheathed thermocouple. The trace showed a peak cooling rate of about 8 K/s and took about 24 s to fall from 850 °C to 700 °C. An older record from the oil supplier's commissioning visit suggested a faster quench, and a technician concluded that the oil had degraded and recommended replacing the tank's charge, an expensive job.

The finite-difference model of Chapter 7, run with the book's assumed 1,000 W/m²·K, shows what the 6 mm sensor should have been expected to report. At 45 mm deep, the true metal temperature falls to 700 °C at about 15.5 s, with a peak cooling rate of about 18 K/s at the start of the quench. Passing that true history through a first-order lag with the 6 mm sheath's time constant of about 7.7 s gives a logged trace that reaches 700 °C at about 23.5 s and peaks at about 8 K/s, almost exactly what was recorded.

```figure
type: compare
title: DS-100 quench, 45 mm deep: true metal temperature and what sensors of three sizes would log
cols: Reaches 700 °C | At 20 s | At 40 s | Peak logged rate
caption: This is an illustration from the finite-difference model with an assumed h = 1,000 W/m²·K and oil at 60 °C, passed through first-order lags with the sheath time constants in oil. The 15 s row represents a 6 mm sheath with poor contact in its hole. Slow sensors make a good quench look sluggish.
- True metal temperature | 15.5 s | 669 °C | 578 °C | about 18 K/s
- 1.5 mm sheath, τ ≈ 1.9 s | 17 s | 679 °C | 584 °C | about 12 K/s
- 3 mm sheath, τ ≈ 3.8 s | 19 s | 693 °C | 592 °C | about 10 K/s
- *6 mm sheath, τ ≈ 7.7 s | 23.5 s | 721 °C | 610 °C | about 8 K/s
- 6 mm, poor contact, τ ≈ 15 s | 30.5 s | 758 °C | 648 °C | about 6 K/s
```

The error was caught before the oil was changed, because the supplier, asked to confirm the oil's condition, ran a standard cooling-curve test on a sample and found it within its normal range. The repeat trial, with a 1.5 mm sheath, recorded a much faster quench, consistent with the model. The correction went into the shop's measurement procedure: choose the sensor by its time constant in the medium being measured, aim for a time constant well under a tenth of the time over which the temperature changes significantly, and record the sensor's size and fit with every trace. The general lesson is that every measurement has its own dynamics, and a trace is the process filtered through the sensor. When the sensor is slow, the filter dominates.

## Comparing a trace with the model

This is an illustration. The proving trial's load thermocouple, a 1.5 mm sensor at the axis of the third shaft's middle, recorded the body's centre reaching 840 °C at 70 minutes after the furnace door closed. The constant-h one-term calculation had said 67 minutes, and the finite-difference model with ε × F = 0.58 had said 66 minutes. The three-to-four-minute difference was larger than the sensor's lag, which is negligible at the end of heating, and pointed to the furnace: its control trace showed the atmosphere sagging to about 760 °C when the cold load went in and taking about 25 minutes to recover to 850 °C.

The model was rerun with the logged furnace temperature in place of a constant 850 °C. With ε × F still at 0.58, it reproduced the trace's shape and gave 840 °C at about 70 minutes. So the effective emissivity was confirmed and the extra time was the furnace's recovery, which Chapter 10 turns into a requirement for furnace power. The proved figure for setting the cycle was the measured 70 minutes, with the model available to predict the effect of changes such as a smaller load or a different spacing.

```figure
type: timeline
title: DS-100's proving trial, from loading to quench
caption: This is an illustration of the logged trial. Times are minutes from the furnace door closing on the cold load. The hold is set by the heat treatment procedure and counted from the load thermocouple, not from the controller.
- 0 min | Load in; furnace atmosphere sags towards 760 °C
- 25 min | Control thermocouple back at 850 °C; load centre about 530 °C
- * 70 min | Load thermocouple at 840 °C: the hold begins
- Hold | Procedure's hold at temperature, timed from 70 min
- Transfer | Door open to oil within 20 s (Chapter 5)
- Quench | Centre logged below 300 °C before lift-out (Chapter 8)
```

The trial also tested the shop's old rule. Holding for an hour after the controller recovered would have meant quenching at about 85 minutes, 15 minutes after the centre reached temperature. For DS-100 in this furnace, the old rule was safe but wasteful by those 15 minutes on every load, minus whatever hold the procedure requires. For a heavier load, or a slower furnace, the same rule could have been short. Counting from the load thermocouple removes the guesswork.

## Sensors drift, so check them

A thermocouple's accuracy is not permanent. Thermocouple wires change slowly with time at temperature, especially in the hottest part of a furnace, and the change shows up as a drift in the reading that no amount of care in placement can correct. Base-metal types such as type K, the commonest general-purpose sensor, are known to drift after long use at high temperature, and type N was developed to be more stable; noble-metal types are used where the highest stability is needed. Mineral-insulated sheathed sensors protect the wires but do not stop the drift. The practical consequences are three: keep a calibration record for each sensor and each instrument, check the whole measuring chain, sensor plus lead plus instrument, against a reference rather than the instrument alone, and retire sensors used for proving trials after the number of uses or hours the shop's procedure, or the applicable specification, allows.

A drift of a few kelvin matters more than it seems. In the last part of DS-100's heating the centre rises only about 0.02 K/s, so a sensor that reads 5 K high declares the target reached about four minutes early, while one that reads 5 K low adds four minutes to every load. The exponential tail that Chapter 3 described amplifies small measurement errors into large time errors, which is another reason for stating the target with a tolerance and for checking the sensor before a trial.

## Records

A proved cycle is only as good as its record. The record should name the part, the load arrangement, the furnace, the sensors and their calibration, the logged traces, the comparison with the calculation and the cycle that was approved. When any of those changes, a new part, a new spacing, a re-lined furnace, a different oil, the cycle needs checking again, and the model shows how much checking is needed: a change that the model says moves the time by a minute may need no new trial, while one that moves it by twenty does.

## How this applies to a small Australian business

Most small heat-treatment and thermal-processing businesses have the instruments for this: a portable logger, a few mineral-insulated thermocouples and a drill. What they often lack is the habit of putting the sensor at the slowest point, choosing it for the speed of the process and comparing the trace with a calculation. A single well-instrumented proving trial per part family, recorded and kept, is worth more than years of cycles set by rule. Where a customer or industry specification such as AMS2750 applies, it sets the requirements for sensors, calibration and surveys, and the work should be organised around it from the start. Even where no specification applies, writing down the sensor, its position, its calibration date and the comparison with the calculation turns a one-off trial into evidence that the next engineer, auditor or customer can follow.

## Exercise: a sensor for the furnace

The shop wants to use a 3 mm sheathed thermocouple for routine load monitoring in the hardening furnace. Estimate its time constant at h = 150 W/m²·K, and its lag at two points in DS-100's heating: in the first minutes, when the body's centre rises at about 0.8 K/s, and near the end, when it rises at about 0.02 K/s. Is the 3 mm sensor suitable?

**Worked answer.** τ ≈ ρ c D ÷ (4h) = 5.1 × 10⁶ × 0.003 ÷ (4 × 150) ≈ **26 s**, a little more in a hole with imperfect contact. In the first minutes, the lag is about 0.8 × 26 ≈ **21 K**, so the sensor reads noticeably behind the steel. Near the end, the lag is about 0.02 × 26 ≈ **0.5 K**, well inside the 10 K tolerance used for the target.

The sensor is suitable for deciding when the load has reached temperature, because the decision is made near the end of heating, where its lag is under a kelvin. It is not suitable for logging the quench, where this chapter's failure case showed that even a 6 mm sensor's 7.7 s time constant halves the apparent cooling rate; for quench logging the 1.5 mm sensor, with a time constant in oil of about 1.9 s, is the better choice.
