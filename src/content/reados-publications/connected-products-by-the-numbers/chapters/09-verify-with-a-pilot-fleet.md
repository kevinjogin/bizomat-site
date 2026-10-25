---
book: connected-products-by-the-numbers
chapterSlug: verify-with-a-pilot-fleet
order: 9
title: "Verify with a pilot fleet"
description: "Plan a pilot fleet that verifies requirements and validates the product, read failure rates with honest confidence bounds, and let field data replace the assumptions behind the design."
draft: false
---

Laboratory tests show that a product can meet its requirements. A pilot fleet shows whether it does, in real places, for real people, over enough time for slow problems to appear. For a connected product, the pilot has an advantage no other product enjoys: every unit reports its own behaviour. A well-designed pilot uses that stream of data to verify the requirements, to validate that the product is useful, and to replace the assumptions the design was built on with measurements.

This chapter plans the tank monitor's pilot of 40 units over six months. It shows how each requirement is checked from field data, how to read a failure rate from a small fleet without overclaiming, how the pilot's data changed one requirement and the leak-detection logic, and how the team nearly understated their failure rate by counting only the units that were still talking.

## Verification and validation

Two words are often used as one.

- **Verification** asks whether the product meets its requirements. Did we build it right? R1 says ±25 mm: is the depth within ±25 mm?
- **Validation** asks whether the product meets the users' needs. Did we build the right thing? Do owners order water in time? Do they act on leak alerts?

A product can pass verification and fail validation if the requirements were wrong. The pilot is the first time validation can be tested properly, because it puts the product in front of users in their own conditions for months. The systems engineering processes behind both, including the planning of verification against each requirement, are described in NASA's public *Systems Engineering Handbook*.

## Plan the pilot as a test

This is an illustration. The pilot plan set out:

- **Units and sites.** 40 units at 32 properties across New South Wales and Queensland, chosen to include good, marginal and poor coverage sites, households and farms, and tanks under trees and in open paddocks.
- **Duration.** Six months, spanning the end of winter into summer, so both cold mornings and hot afternoons were included. That is **40 × 0.5 = 20 unit-years** of operation.
- **Data collected automatically.** Every reading, quality flag, charge count, signal measure, transmission time, reset and firmware version, as designed in Chapters 4 to 6.
- **Data collected from owners.** A monthly dipstick reading entered in the app, alert responses and a short interview at the end.
- **Success criteria**, written before the pilot started, for each requirement and each validation question.

Writing the criteria first matters. Criteria written after the data arrives tend to fit the data.

## Verify accuracy against the dipstick

R1 requires depth within ±25 mm. The pilot checks it by comparing the sensor's reading at the time of each owner's monthly dipstick measurement with the dipstick. Dipstick readings have their own error, perhaps a few millimetres, so the comparison slightly overstates the sensor's error, which is the safe direction.

This is an illustration. After the temperature fix of Chapter 3, the pilot produced **38** valid paired readings. The differences, sensor minus dipstick, had a mean of **+3 mm**, a standard deviation of **8 mm** and a largest single difference of **21 mm**. About 95% of differences would be expected within **3 ± 2 × 8**, from about **−13 mm** to **+19 mm**, inside the ±25 mm requirement. R1 was verified for the conditions the pilot covered. The record notes that those did not yet include a full summer.

## Read the failure rate honestly

During the pilot, three units failed in ways that needed a site visit: one housing cracked by hail, one thermistor cable that let water in and one radio module that stopped responding. Three failures in 20 unit-years gives a point estimate of **3 ÷ 20 = 0.15** failures per unit-year.

A point estimate from three events is very uncertain. The NIST/SEMATECH e-Handbook gives the standard way to put a bound on a constant failure rate from a test with a fixed amount of operating time: the upper bound at a chosen confidence uses the chi-square distribution with 2(r + 1) degrees of freedom, where r is the number of failures.

```figure
type: formula
title: Upper confidence bounds on the pilot's failure rate
formula: λ_upper = χ²(C, 2(r + 1)) ÷ (2T)
caption: This is an illustration. T is total operating time in unit-years and r the number of failures. The method assumes a constant failure rate, which early-life and wear-out failures can violate.
- T | 40 units × 0.5 years = 20 unit-years
- r | 3 failures
step: point estimate = 3 ÷ 20 = 0.15 per unit-year
step: at 80% confidence, χ²(0.80, 8) ≈ 11.03, so λ_upper ≈ 11.03 ÷ 40 ≈ 0.28 per unit-year
step: at 90% confidence, χ²(0.90, 8) ≈ 13.36, so λ_upper ≈ 13.36 ÷ 40 ≈ 0.33 per unit-year
```

The honest statement is that the pilot is consistent with a failure rate of 0.15 a year, but cannot rule out one as high as about 0.33 a year at 90% confidence. For a future fleet of 400 units, that is the difference between about **60** and about **134** site visits a year, a large difference for a small service team. The pilot does not prove the product reliable. It finds failure mechanisms, three of them here, each of which got a corrective action, and it sets the starting point for measuring reliability in the growing fleet.

The same arithmetic shows how much evidence a reliability claim needs. To show a failure rate no higher than **0.05** a year at 90% confidence with no failures at all needs about **χ²(0.90, 2) ÷ (2 × 0.05) ≈ 4.61 ÷ 0.1 ≈ 46** unit-years. A small pilot cannot provide that. A fleet of a few hundred units can within months.

## A failure case: counting only the units that talked

This is an illustration. The first draft of the pilot's monthly report calculated the failure rate from the platform's list of reporting devices: two failures over about 18.5 unit-years of reporting, about **0.11** per unit-year. It looked good.

The product manager reconciled the platform's list with the installation register and found a gap. Units that had gone silent had dropped out of the reporting list, and their operating time and failures had dropped out of the calculation with them. The radio module that stopped responding was one of them. Because it never reported again, it never appeared as a failure in the platform's data. The calculation also excluded the three units that went silent in Chapter 4's coverage problem, whose batteries had drained. That was a design failure against R6, even though the hardware was intact.

This is survivorship bias: drawing conclusions only from the units that survived to report. The correction was to calculate reliability from the installation register, not the reporting list. Every unit counts from its installation date to its removal or the end of the period, and every silence is investigated and classified: hardware failure, battery exhausted, coverage lost or owner removed it. The corrected figures are the ones above. Battery exhaustion was reported separately against R6, because the corrective actions for it were different.

## Check the battery budget in the field

The charge counters of Chapter 4 let the pilot verify the battery budget unit by unit. This is an illustration. Across the 34 units at good-coverage sites, the median daily charge was **3.9 mAh**, close to the budget's 3.86 mAh. The six marginal and poor sites ranged from **9** to **27 mAh** a day before the effort cap was added. Six units returned at the end of the pilot had their cells measured in a laboratory, and the remaining capacity agreed with the charge counter's estimate within about 5%. R6 was verified for good-coverage sites, and the installation survey of Chapter 5 became the control that keeps every sold unit in that category.

## Let field data replace assumptions

Chapter 1 listed the assumptions behind the requirements. The pilot measured several of them.

```figure
type: compare
title: What the pilot measured against what the design assumed
cols: Assumed | Measured in the pilot | What changed
caption: This is an illustration. Each change was traced through the architecture of Chapter 2 before it was made.
- Household daily use | about 600 L | median about 480 L, wide spread | alert threshold calculated from each tank's own recent use
- Overnight use near zero | midnight to 5 am | 9 of 32 properties refilled stock troughs or irrigated at night | leak detection learns each tank's normal overnight pattern
- Owners act on alerts within hours | yes | most low-level alerts were followed by a water order within a day | no change
- *Headspace temperature | up to about 45 °C | over 50 °C near dark roofs | second thermistor (Chapter 3)
- Signal adequate at most sites | most | 6 of 32 marginal or poor | installation survey and effort cap
```

Two findings changed the product. The first was the overnight assumption. Nine of the 32 properties used water at night for stock troughs or irrigation, so a fixed overnight window produced false leak alerts for them, even after the time-zone fix of Chapter 7. The leak-detection logic now learns each tank's normal overnight slope over the first few weeks and alerts on departures from that tank's own pattern, using the same statistics as Chapter 7.

The second changed a requirement. Owners used the days-remaining estimate far more than the raw level, but they wanted it to account for the weather. Several asked for a forecast of when the tank would be full again after rain. The makers did not add a rainfall sensor. They added an estimate from the roof area, the owner enters it once, and the rain forecast. That became a new function, F11, traced to a new requirement, and it went through the same architecture and test process as everything else.

This is the use of streaming data in product planning: decisions about the product's next version based on how it is actually used, not on what was assumed in the first interviews.

## Treat support as part of the test

Every question an owner asks during the pilot is evidence about the product, its instructions or its app. The makers logged each support contact with its cause, the time it took to resolve and whether it needed a site visit. This is an illustration. Over six months the 32 properties generated **47** contacts. Grouped by cause, about a third concerned installation, mainly measuring the sensor's height and finding a clear spot on the roof. A quarter were questions about alerts, most of them the overnight false alerts described above. A fifth were app sign-in and account questions. The rest were scattered.

The grouping pointed straight at fixes. The installation questions led to the dipstick check of Chapter 3 and a short video in the app. The alert questions led to the learned overnight pattern and the question-style leak message of Chapter 7. The sign-in questions led to a simpler password-reset flow that still met the security design of Chapter 8. The contact rate also gave Chapter 10 its first real figure for support cost, about **47 ÷ 32 ≈ 1.5** contacts per property over six months. The makers expected it to fall sharply once the installation and alert fixes were in place, and planned to measure that in the first months of sales rather than assume it.

The time of each contact mattered too. Most installation questions arrived on weekends, when owners did the job themselves, and that shaped the support roster for launch.

## Validation: whether it helped

This is an illustration. Over the pilot, owners received **61** low-level alerts, and **52** were followed by a water order or a recorded decision to wait for forecast rain. Owners reported, in the end interviews, three leaks found early, one a burst pipe at night. Owners at the properties with night-time stock watering named false leak alerts as their main annoyance, which the learned overnight pattern now prevents. Those numbers do not prove the product's value at scale, but they answer the validation question for the pilot: the product supported the decisions it was designed for, and owners acted on it.

```figure
type: stats
title: The tank monitor pilot in five numbers
caption: This is an illustration. Each number is traced to a success criterion written before the pilot began.
- 20 | Unit-years | 40 units for six months
- ±25 mm | R1 verified | 38 dipstick pairs, largest difference 21 mm
- *0.15 | Failures per unit-year | 90% upper bound about 0.33
- 3.9 mAh | Median daily charge | good-coverage sites, budget 3.86
- 52 of 61 | Low-level alerts acted on | order placed or rain awaited
```

## How this applies to a small Australian business

A pilot of a few dozen units is affordable for a small maker and worth more than any amount of laboratory testing for finding real problems. Choose the sites deliberately, including the difficult ones. Write the success criteria before the pilot starts. Count reliability from the installation register, not from the units that are still talking. And treat the pilot's measurements of your assumptions as the most valuable output, because they will decide the next version. Australia's spread of climates, time zones and coverage conditions means a pilot in one region rarely covers all of them, so plan a second, smaller pilot when expanding to a new state.

Be open with pilot participants. They are lending their tanks, their time and their patience to an unfinished product. Tell them it is a pilot, what data is collected and why, how to reach a person when something goes wrong and what happens to their unit at the end. Participants who feel informed report problems early and in detail, and their reports are the pilot's most valuable data.

## Exercise: a longer pilot

The makers extend the pilot by another six months with the same 40 units, giving 40 unit-years in total, and see two more failures, five in all. What is the new point estimate and the 90% upper bound? The value of χ²(0.90, 12) is about 18.55.

**Worked answer.** The point estimate is **5 ÷ 40 = 0.125** failures per unit-year. With r = 5, the degrees of freedom are **2 × (5 + 1) = 12**, and the upper bound is **18.55 ÷ (2 × 40) ≈ 0.232** per unit-year. The point estimate has fallen only slightly, but the upper bound has fallen from about 0.33 to about 0.23, because twice the operating time narrows the uncertainty. If the two new failures were in the hail-cracked housing or the thermistor cable, mechanisms that already had corrective actions, the team should check whether those actions were in place on the failed units before drawing conclusions about the design.
