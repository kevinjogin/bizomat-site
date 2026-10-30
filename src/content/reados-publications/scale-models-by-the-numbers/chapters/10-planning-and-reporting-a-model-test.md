---
book: scale-models-by-the-numbers
chapterSlug: planning-and-reporting-a-model-test
order: 10
title: "Planning, measuring and reporting a model test"
description: "Turn the questions a model must answer into a test matrix, size the number of readings, carry uncertainties and scale effects into the results, and write a report a designer can act on."
draft: false
---

A model test is a measurement programme, and like any measurement programme it is only as good as its plan and its report. The earlier chapters supplied the parts: dimensional checks, groups, a scale, Froude scaling, scale-effect checks, fitted calibrations and laws that hold within their regimes. This chapter puts them together into a plan that answers the designer's questions, a way of deciding how many readings each answer needs, and a report that says not only what the model showed but how far each result can be trusted at full size.

The running case is the PS-3 model study from first plan to final report. The error is a set of swirl readings that looked precise and were not, and the way the laboratory found out how many readings it really needed.

## Start from the questions

A model study exists to answer specific questions, and every run in it should serve at least one. For PS-3, the station designer's questions were:

1. Do surface or submerged vortices form at any bellmouth, under any combination of water level and pumps in service, and if so, of what grade and how often?
2. Is the swirl in each suction pipe within the specification's limit?
3. Is the flow arriving at each bellmouth evenly distributed, or skewed enough to load the impeller unevenly?
4. Does the storage tank's return flow disturb the approach when it empties into the wet well?
5. If any answer is unsatisfactory, which change to the geometry fixes it?

Each question implies measurements, conditions and an acceptance criterion. The criteria come from the project specification, which normally cites an intake standard such as ANSI/HI 9.8 and adds project-specific limits. In this book those criteria are illustrative: the swirl limit is 4°, and vortices of grade 3 or above are not accepted at the Froude-scaled flow.

## The test matrix

The conditions follow from the questions. Vortices depend on water level and on which pumps run, so every combination that can occur in operation must be covered, plus the abnormal cases the designer wants to understand. Scale effects require the high-flow check of Chapter 5 at the condition most prone to vortices.

```figure
type: compare
title: The PS-3 model test matrix
rowhead: Condition
cols: Water levels | Pump combinations | Flow | Runs
caption: Pumps A, B and C from upstream to downstream. Each run is 30 minutes of model time, about 73 minutes of prototype time, after the flow has settled. The two worst runs are repeated on a different day with a different observer.
- Two duty pumps, every pairing | lowest, normal, highest | A+B, B+C, A+C | Froude-scaled | 9
- All three pumps, abnormal | lowest, normal, highest | A+B+C | Froude-scaled | 3
- Scale-effect check | lowest | A+B, B+C, A+C | 1.5 × Froude-scaled | 3
- Storage tank emptying | lowest | B+C | Froude-scaled, transient | 1
- Repeats of the two worst runs | as found | as found | as found | 2
- * Total | | | | 18
```

With 18 runs of 30 model minutes each, plus settling time, the programme takes about three days for one geometry. Every remedy tried in response to an unsatisfactory result needs at least the runs that found the problem to be repeated, and the final geometry needs the full matrix. The laboratory therefore plans for two to three full passes of the matrix.

## Instruments and their uncertainties

Each measurement has an uncertainty, and each uncertainty must be carried into the prototype values. For PS-3:

- **Flow** in each suction pipe from its calibrated orifice plate, Chapter 7: about ±0.9% at 95% confidence at the design flow.
- **Water level** from point gauges: ±0.5 mm in the model, ±3 mm at prototype scale.
- **Swirl angle** from a swirl meter in each suction pipe, calculated from its rotation rate and the pipe velocity: the rotation rate is read to better than 1%, but the swirl itself fluctuates, so the uncertainty of a mean swirl angle depends on how many readings are averaged.
- **Velocity distribution** at the bellmouth throat from a small probe traversed across the pipe: about ±2% of the local velocity.
- **Water temperature** to ±0.2 °C, logged with every reading so that the Reynolds number is known.
- **Vortex grades** by eye and from video, checked by a second observer.

## How many readings

The swirl angle in a suction pipe is not steady. It wanders as turbulence and slow approach-flow fluctuations pass through, so a single reading says little, and a mean of several says more. How many are needed depends on how much the readings scatter and how precisely the mean must be known.

This is an illustration. A pilot run at the worst condition gave swirl readings with a standard deviation of 0.8°. The laboratory wanted each run's mean swirl angle within ±0.3° at 95% confidence, so that a mean of 3.5° could be distinguished from the 4° limit. The [sample size tool for estimating a mean](/tools/sample-size-mean/) gives the minimum number of measurements to estimate a mean within a chosen margin at a chosen confidence, from an expected standard deviation, using the normal approximation n = (z σ ÷ E)². With σ = 0.8°, E = 0.3° and 95% confidence it gives **28 readings** (27.32 before rounding up). For a margin of ±0.2° it gives 62.

The tool's result assumes the readings are independent. Swirl readings taken a second apart are not: the swirl changes slowly, and successive readings repeat much of the same information. The laboratory therefore spaced its readings at 20 s of model time, long enough for the approach flow to renew, and checked the independence by comparing the scatter of means from the first and second halves of each run. Twenty-eight readings at 20 s intervals take just over nine minutes of model time, comfortably inside the 30-minute run.

## The error: a precise-looking mean

This is an illustration. In the first pass of the matrix, before the pilot run, the swirl in each pipe was read six times per run and the mean reported to one decimal place. The draft results showed a mean of 3.4° for pipe C in the B+C lowest-level run, comfortably below the 4° limit, and the run was marked as a pass.

The station designer, reviewing the draft, asked for the scatter of the readings behind each mean. Pipe C's six readings had a standard deviation of 0.8°. With six readings, the 95% interval for the mean is about ±1.96 × 0.8 ÷ √6 = ±0.64° on the normal approximation, and wider, about ±0.84°, using Student's t with five degrees of freedom, which is the right choice for so few readings. The true mean swirl could plausibly have been anywhere from about 2.6° to 4.2°. The run was not a clear pass; it was undecided.

```figure
type: compare
title: Pipe C's mean swirl angle, B+C at the lowest level
rowhead: Readings averaged
cols: Mean swirl | 95% half-width | Range | Verdict against 4°
caption: Standard deviation of individual readings 0.8°. With six readings the interval reaches above the illustrative limit; with 28 independent readings it does not. The second row is the rerun after the geometry change.
- 6 readings, first pass | 3.4° | ±0.84° (t, 5 d.f.) | 2.6° to 4.2° | undecided
- * 28 readings, rerun with floor splitter | 2.1° | ±0.30° | 1.8° to 2.4° | pass with margin
```

The run was repeated with 28 readings, by which time the floor splitter of Chapter 6 had been fitted, and the mean fell to 2.1° ± 0.3°. The laboratory changed its procedure: every reported mean now carries its standard deviation, number of readings and confidence interval, and the number of readings is set from a pilot run with the sample size tool before the matrix begins.

## Witnessing and change control

Model studies are usually witnessed. The station designer, and often the owner's engineer, attend the key runs, see the vortices for themselves and agree any change to the geometry before it is made. Witnessing matters because vortex grades are judged by eye, and because the decision to try a remedy is a design decision, not a laboratory one.

Changes to the model need the same control as changes to a drawing. Each remedy is given a reference, drawn, built and photographed, and the runs made with it are logged against that reference. When a remedy is removed or replaced, the model is returned to a known geometry and a reference run is repeated to confirm it. Without that discipline, a model that has been altered a dozen times over two weeks can end up in a state nobody has recorded, and the final report's drawings may not match the geometry that produced its results. For PS-3, five geometries were tested: the original, two floor splitter variants, a curtain wall and the final floor splitter with a back-wall fillet. Each has its own drawing in the report.

## Records worth keeping

The raw data should outlive the report. A model study generates flows, levels, temperatures, swirl readings, velocity traverses, vortex logs, photographs and video, and the report summarises only a fraction of it. Keeping the raw records, with their calibrations and the geometry reference for every run, allows the results to be reanalysed if a question arises during construction or commissioning, or if a similar station is designed later. A sensible minimum is a time-stamped log of every reading, the calibration fits with their data, the as-built drawings of each geometry and the video of every run with a visible clock and a caption giving the run number.

## Knowing when to stop

Every remedy costs a pass of the test matrix, so a model study needs a rule for when the geometry is good enough. The PS-3 study used three conditions, agreed with the designer before testing began: every Froude-scaled run must meet the acceptance criteria with the margin set in the specification; the scale-effect checks must not show a trend that would carry a passing result past a criterion at full size; and the final geometry must be buildable within the station's structural and access constraints. The fifth geometry met all three, and testing stopped there.

A rule like this protects against two opposite failures: stopping at the first geometry that passes on a single favourable run, and continuing to refine a geometry that already passes comfortably because the model can always be improved a little more. Both waste money; the first can also leave a real problem in the station.

## Turning model results into prototype statements

Each result in the report should be stated at prototype scale, with its uncertainty and the direction of any scale effect. The PS-3 report's summary for the final geometry read, in part, as follows. This is an illustration.

- **Vortices:** strongest grade 2 at all Froude-scaled conditions; grade 3 at the 1.5 times check for A+B and B+C at the lowest level. The model is expected to understate vortex strength (Chapters 5 and 6); the margin of one grade below the acceptance criterion at the Froude-scaled flow is judged adequate.
- **Swirl:** largest mean 2.1° ± 0.3° (pipe C, B+C, lowest level). Results rose by about 15% with Reynolds number across the temperature tests; the prototype value is estimated at up to 2.5°, against the 4° limit.
- **Velocity distribution:** time-averaged throat velocities within ±7% of the mean in every pipe; Reynolds-insensitive across the tests.
- **Storage tank return:** a surge raising the approach velocity by about 30% for 4 minutes of prototype time, with no vortices above grade 2 during it.
- **Losses:** suction losses quoted at prototype scale by the friction-factor method of Chapter 8, not by direct Froude scaling.

Each line gives a number, its uncertainty or range, the scale-effect direction where one applies, and the criterion it was judged against. A designer can act on that. A report that says only "the intake performs satisfactorily" cannot be checked, defended or reused.

```figure
type: checklist
title: What a model study report should contain
caption: A report that covers these points lets a reviewer reproduce the scaling, judge the results and see the limits. Missing items are a reason to ask questions, not to assume the best.
- Questions and acceptance criteria | with the standard and project specification they come from
- Scale, scaling law and every ratio used | Froude scaling at 1:6, with the conversion table
- Model Reynolds and Weber numbers | at each test condition, with the water temperature
- Instrument calibrations and uncertainties | including fitted calibrations with their exponents and intervals
- Test matrix as run | with any changes from the plan and why
- Results at prototype scale | each with its uncertainty and number of readings
- Scale-effect checks and their direction | which results are conservative and which optimistic
- Geometry changes and their retests | drawings of the final geometry as tested
- x Results stated without uncertainty or scale-effect direction | they cannot be judged
- ? Commissioning checks proposed | what to observe at full size to confirm the model
```

## Closing the loop at commissioning

The model's predictions can be checked when the station is commissioned. Vortices at full size can be observed from the wet well access with the pumps running at their lowest operating level, under a safe system of work for a confined space. Pump vibration, power draw and noise give indirect evidence of swirl and air entrainment. If the commissioning team records what it sees in the same grading terms as the model study, the comparison improves the next model study, and the owner gains a baseline for the station's life.

## How this applies to a small Australian business

Any test that a business pays for, or relies on, deserves the same discipline as a model study, scaled to its size. Write down the questions first and the criteria they will be judged against. Work out how many readings each answer needs from a pilot run's scatter, using a sample size calculation rather than habit. State every result with its uncertainty and with any reason it might differ in service. A two-page test report built that way is worth more than a thick one without it, because it can be checked.

## Exercise: tighter swirl margins

For a later station with a tighter illustrative swirl limit of 3°, the laboratory wants each mean swirl angle within ±0.2° at 95% confidence. A pilot run again gives a standard deviation of 0.8°. How many independent readings are needed per run? If readings must be spaced 20 s apart in model time to be independent, does that fit in a 30-minute run?

**Worked answer.** By the sample size tool's method, n = (1.96 × 0.8 ÷ 0.2)² = 7.84² = 61.47, which rounds up to **62 readings**. At 20 s spacing, 62 readings take 62 × 20 = 1,240 s, or **20.7 minutes**, which fits within a 30-minute run with about nine minutes to spare for settling. If the pilot showed that readings had to be spaced 30 s apart, the readings would take 31 minutes and the runs would have to be lengthened.
