---
title: "Experiment before you standardise: using designed experiments to find robust process settings"
description: "Why changing one setting at a time misses interactions, and how a simple designed experiment finds process settings that hold up before you lock them into standard work."
publishDate: 2026-10-04
category: "Products"
tags:
  - manufacturing
  - experimentation
  - process-improvement
  - validation
author: "KEVOS"
featured: false
draft: false
---

Most process improvement starts the same way. Something is going wrong, such as too many rejects, inconsistent strength or a coating that will not stick, and someone changes one setting to see what happens. If the result improves, the new setting is written into the work instruction. Then the next setting is tried, and so on. The method feels careful because only one thing changes at a time.

In simple processes it often works. In processes where several variables affect each other, it can lead you to a setting that looks good during the trial and fails later. Oven temperature may matter a great deal when cure time is short and hardly at all when cure time is long. Feed rate may behave differently with a new tool than a worn one. When variables interact like this, changing them one at a time cannot reveal the relationship, and the first improvement you find is not necessarily a setting you can rely on.

This matters because standards are sticky. Once a setting is in the work instruction, the fixture is built around it and the operators are trained on it, changing it again is expensive. A small amount of structured experimentation before you standardise is usually far cheaper than discovering the weakness after you have scaled it. This article explains what a designed experiment is, how to run a simple one, how to read the results and how to avoid the common traps.

## What a designed experiment is

A **designed experiment**, often called design of experiments or DOE, is a planned set of trials in which several process variables are changed together according to a pattern chosen in advance. The pattern is designed so that you can separate the effect of each variable, and the effect of variables acting together, from the normal noise of the process.

A few terms make the method easier to follow:

- A **factor** is a variable you deliberately change, such as temperature, pressure, speed, time or material supplier.
- A **level** is a value of a factor used in the experiment, for example 180 °C and 200 °C.
- The **response** is the outcome you measure, such as defect rate, tensile strength, dimensional error or cycle time.
- A **run** is one trial at a particular combination of factor levels.
- A **main effect** is the average change in the response when a factor moves from its low level to its high level.
- An **interaction** exists when the effect of one factor depends on the level of another.
- **Noise** is the variation you cannot control or are not studying, such as ambient humidity or batch-to-batch material differences.
- **Replication** means repeating runs so you can tell a real effect from random variation.
- **Randomisation** means running the trials in a random order, so that drift in the process over the day does not masquerade as a factor effect.

The power of the method comes from the pattern. Because every factor is tested at every combination of the others, each run contributes information about every factor at once, and interactions become visible rather than hidden.

## Why one factor at a time misses interactions

Suppose you are trying to reduce defects in a curing process and you suspect two factors: temperature and time. Starting from your current settings, you increase time and defects fall. You keep the new time, then increase temperature and defects fall only slightly. You conclude that time matters and temperature hardly does, and you standardise accordingly.

What you have actually learned is how temperature behaves when time is long. You never tested temperature with a short cure time, so you do not know that at short times temperature might be critical. Months later, someone shortens the cure time to increase throughput, the defect rate jumps, and nobody understands why, because the standard says temperature was tested and found unimportant.

A designed experiment would have tested both temperatures at both times and shown the dependency directly. That is the essential weakness of one-factor-at-a-time testing: it explores a narrow path through the possible settings and assumes the factors behave independently, which in many real processes they do not.

## Step 1: Choose the response that represents value

Before choosing factors, decide exactly what you will measure. The response should be the outcome that matters to the customer or the operation, not merely the easiest thing to measure.

- If the customer cares about coating adhesion, measure adhesion, not just film thickness.
- If the problem is warpage, measure the dimension that is out of tolerance, not just the part weight.
- If productivity matters as well as quality, record cycle time alongside the quality response.

Where you have more than one response, they can pull in different directions. Higher temperature might reduce defects but increase energy use and cycle time. Record all the responses that matter and expect to make an explicit trade-off rather than searching for a single perfect setting.

The measurement itself must be reliable. If two inspectors would score the same part differently, the experiment will be swamped by measurement noise. A quick check of the measurement system, measuring the same parts several times and comparing results, is worth doing first.

## Step 2: Select factors from process knowledge

Brainstorming every conceivable input produces an experiment too large to run. Instead, use what you already know:

- **Process maps** show where each input enters and what it could influence.
- **Failure history** shows which conditions were present when defects occurred.
- **Engineering knowledge** of the physics or chemistry suggests which variables plausibly drive the response.
- **Operator experience** often reveals variables nobody has written down, such as how long material sits before processing.

Choose levels far enough apart to produce a measurable difference, but within the range you could actually run in production. Testing a temperature you would never use tells you little.

If you have many candidate factors, a **screening design**, which tests many factors in relatively few runs, can identify the few that matter before a more detailed experiment. Fractional factorial designs are a common type. For a small business with a handful of suspects, a full factorial design with two or three factors is often the most practical starting point.

## Step 3: Plan a simple two-level experiment

A **two-level full factorial** design tests every combination of each factor at a low and a high level. With three factors, that is 2 × 2 × 2 = 8 runs. With replication, for example running each combination twice, it becomes 16 runs.

To plan it:

1. List the factors and their low and high levels.
2. Write out all combinations in a table.
3. Decide how many parts to produce and measure at each combination.
4. Randomise the order in which you run the combinations.
5. Hold everything else as constant as practical, and record anything unusual that happens during the trials.
6. Measure the response for every run without knowing which setting produced which part, if possible, to avoid unconscious bias.

## Step 4: Calculate main effects and interactions

For a two-level design, the main effect of a factor is simply the average response at its high level minus the average response at its low level. An interaction between two factors can be calculated in a similar way, by comparing how the effect of one factor changes across the levels of the other. A spreadsheet handles these calculations easily, and statistical software can add tests of significance and charts.

The worked example below shows the arithmetic.

## A worked example

This is an illustration. A small powder-coating business has a recurring adhesion problem on steel brackets. About one in eight parts fails a tape adhesion test. The owner suspects three factors and plans an eight-run experiment, coating and testing 50 parts at each combination and recording the percentage that fail.

| Factor | Low level (−) | High level (+) |
|---|---|---|
| A: Oven temperature | 180 °C | 200 °C |
| B: Cure time | 10 minutes | 15 minutes |
| C: Film thickness | 60 µm | 90 µm |

The results, after running the combinations in random order, are:

| Run | A | B | C | Failure rate |
|---|---|---|---|---|
| 1 | − | − | − | 12% |
| 2 | + | − | − | 6% |
| 3 | − | + | − | 7% |
| 4 | + | + | − | 5% |
| 5 | − | − | + | 14% |
| 6 | + | − | + | 7% |
| 7 | − | + | + | 9% |
| 8 | + | + | + | 6% |

**Main effect of temperature (A).** The average at high temperature (runs 2, 4, 6, 8) is (6 + 5 + 7 + 6) ÷ 4 = 6.0%. The average at low temperature (runs 1, 3, 5, 7) is (12 + 7 + 14 + 9) ÷ 4 = 10.5%. The effect is 6.0 − 10.5 = −4.5 percentage points. Raising the temperature reduces failures substantially.

**Main effect of cure time (B).** At the long time (runs 3, 4, 7, 8) the average is 27 ÷ 4 = 6.75%. At the short time (runs 1, 2, 5, 6) it is 39 ÷ 4 = 9.75%. The effect is −3.0 points.

**Main effect of film thickness (C).** At the thick setting (runs 5 to 8) the average is 36 ÷ 4 = 9.0%. At the thin setting (runs 1 to 4) it is 30 ÷ 4 = 7.5%. The effect is +1.5 points, so thicker coating slightly increases failures.

**Interaction between temperature and time (AB).** With the short cure time, raising the temperature cuts failures from an average of 13% (runs 1 and 5) to 6.5% (runs 2 and 6), a drop of 6.5 points. With the long cure time, it cuts failures from 8% (runs 3 and 7) to 5.5% (runs 4 and 8), a drop of only 2.5 points. Temperature matters much more when cure time is short. The conventional interaction effect is half the difference between those two figures: (−2.5 − (−6.5)) ÷ 2 = +2.0 points.

Now compare what one-factor-at-a-time testing might have concluded. Starting from run 1 (12%), the owner first lengthens the cure time and sees failures drop to 7% (run 3). Keeping the long time, they raise the temperature and see a further drop only to 5% (run 4). They might reasonably conclude that cure time is the key factor and temperature is a minor tweak. If production later shortens cure times to increase throughput, that conclusion would be badly wrong.

The experiment also points to a **robust operating window**: high temperature with the long cure time gives 5% to 6% failures at both film thicknesses (runs 4 and 8), so the result holds even when thickness varies in normal production. That is more valuable than a single best result.

Before changing the standard, the owner runs confirmation batches at 200 °C and 15 minutes across several days, two material batches and both shifts. Failures stay between 4% and 6%, and the new settings are written into the work instruction with the reasoning recorded. The remaining failures become the next problem to investigate, perhaps surface preparation, which was not one of the three factors tested.

## Prefer robust windows to peak settings

The best single result in an experiment is not automatically the best setting to standardise. A peak result may depend on a narrow combination that is hard to hold in production, or it may simply be a lucky run. A setting that performs well across the normal variation of other factors, such as material batches, ambient conditions and operator differences, is usually worth more than one that performs slightly better under ideal conditions.

When choosing settings, ask:

- How does the response change if each factor drifts within its normal production range?
- Does the setting still work with a different material batch or supplier?
- Is the setting practical to hold, given the equipment's control accuracy?

A slightly lower theoretical performance with much lower variability is often the better commercial choice, because customers experience the variation, not the average.

## Validate before you standardise

An experiment produces evidence under trial conditions. Before changing standard work, tooling or capital plans, confirm the result under representative production conditions:

- **Confirmation runs** at the chosen settings, over several days.
- **Different material batches**, operators and shifts.
- **Normal production pace**, not careful trial pace.
- **Downstream checks**, to make sure the improvement does not create a problem in a later process.

Record what was tested, what was found and why the setting was chosen. This record turns a one-off improvement into knowledge the business keeps, even when the people involved move on.

## Combine statistics with engineering sense

Statistical analysis tells you whether an effect is likely to be real rather than noise. It does not tell you why. A statistically significant effect that has no plausible physical explanation deserves suspicion and further checking. Equally, an effect that engineering knowledge predicts but the experiment does not show may indicate that the levels were too close together or the measurement too noisy.

The most reliable conclusions come from teams that combine process knowledge with statistical discipline: the engineer or operator who understands the process, and someone comfortable with the analysis, working together. The article on [learning from small samples](/insights/learning-from-small-samples/) discusses how to draw sensible conclusions when data is limited.

## How this applies to a small Australian manufacturer

Small manufacturers rarely have dedicated statisticians or large trial budgets, but designed experiments do not require either. A two- or three-factor experiment can be planned on a whiteboard, run in a day or two and analysed in a spreadsheet. The investment is usually some material, machine time and careful record keeping.

Designed experiments are most worthwhile when:

- **A problem is chronic** and repeated adjustments have not solved it.
- **Scrap or rework is expensive**, so even a modest improvement pays back quickly.
- **A new product, material or machine** is being introduced, and settings are about to be standardised.
- **A customer requires evidence** that a process is under control, such as for automotive, defence, medical or food contact work.
- **Throughput changes are planned**, such as shorter cycle times, which may move the process into a region where interactions matter.

Involve operators in planning and running the trials. They know the practical limits of the equipment, notice anomalies during runs and are far more likely to follow a new standard they helped develop. The article on [zero-defect manufacturing in a small factory](/insights/zero-defect-manufacturing-in-a-small-factory/) explains how this kind of learning fits into a wider quality system.

## Common mistakes

- **Testing levels too close together**, so real effects disappear in the noise.
- **Measuring a convenient surrogate** instead of the outcome the customer cares about.
- **Skipping randomisation**, so time-of-day drift appears as a factor effect.
- **Ignoring the measurement system**, so differences in inspection swamp differences in the process.
- **Too many factors at once** in a full factorial, making the experiment impractical. Screen first.
- **Standardising directly from exploratory results** without confirmation runs.
- **Chasing the single best run** rather than a robust operating window.
- **Not recording the reasoning**, so the knowledge is lost and the same problem is rediscovered later.

## Questions to ask

- What decision will this experiment allow us to make that our current data cannot?
- Which factors are most likely to interact, and have we tested them together?
- Are we measuring the outcome the customer experiences, or a convenient substitute?
- Are the chosen levels far enough apart to show a difference, yet within the practical operating range?
- Would we prefer the best observed result or a slightly lower but more stable operating window?
- What confirmation evidence do we need before the new setting becomes standard?
- Where will we record what we learned, so it survives staff changes?

## Bringing it together

Changing one setting at a time feels controlled, but it can miss the interactions that decide whether an improvement holds up in real production. A designed experiment tests factors together in a planned pattern, so you can see main effects, interactions and robust operating windows from a modest number of runs. Choose a response that represents real value, select factors from process knowledge, randomise and replicate, and calculate effects with simple arithmetic. Then confirm the result under representative conditions before writing it into standard work. Small manufacturers can apply the method with a spreadsheet and a few days of careful trials, and the knowledge it produces lasts far longer than any single fix.

---

*Source: KEVOS notes. Figures in this article are illustrations, not data.*
