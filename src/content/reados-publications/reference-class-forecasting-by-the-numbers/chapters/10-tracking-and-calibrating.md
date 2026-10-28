---
book: reference-class-forecasting-by-the-numbers
chapterSlug: tracking-and-calibrating
order: 10
title: "Deciding, tracking and calibrating the forecast"
description: "Bay 4's decision paper and funding of A$3.379m, a forecast register, a back-test where 9 of 12 P80s held, a Brier score, and the class updated with Bay 4's 1.19 outcome."
draft: false
---

A forecast is useful once, when the decision is made, and again afterwards, when its outcome shows whether the method can be trusted. Most businesses use it only the first time. The estimate goes into the approval paper, the project runs, the final account is paid, and nobody goes back to ask whether the forecast's P80 meant anything. Without that step, the reference class never grows, the percentiles are never tested, and the next project starts from the same records as this one.

This chapter closes the book's running case. It sets out what Bay 4's decision paper contains and how it settles the funding figure, how the forecasts are recorded so that they can be checked, how to test whether a set of probability forecasts is calibrated, and how Bay 4's own outcome joins the class. It ends with a baseline that was quietly overwritten, which would have taught the business the wrong lesson from its own project.

## The decision paper

The decision paper is the record of what the business knew and chose at the moment of commitment. It should allow someone reading it years later, without the people who wrote it, to see the inside-view estimate, the outside view, the choices made between them and the reasons. For Bay 4 it runs to a few pages, and its contents can be checked against a list.

```figure
type: checklist
title: What Bay 4's decision paper contains
caption: Each item is something a later reviewer needs to judge the decision on what was known at the time, not on how it turned out.
- The inside-view estimate and its basis | each line's quotation or allowance, the contingency and where it came from
- The reference class and its records | 24 projects, ratios in 2026 dollars excluding GST, PERCENTILE.INC
- The outside view by two methods | whole class and components, each with its assumptions stated
- The chosen P-level and the reason for it | P80 for funding, P50 for the project budget
- Who holds each part of the money | project contingency, owner's reserve, the P90 margin
- The schedule at the same confidence, and the cost of delay | 44.7 and 54.7 weeks; A$45k a week
- The tail actions, gates and walk-away conditions | power, ground, integration, software pilot
- The affordability test and its result | P90 against the A$3.5m limit, whole project and staged
- What will be recorded, by whom and when | the forecast register and the close-out review
```

The paper also has to make a decision, and the earlier chapters left one open. Chapter 5 set a working choice of funding Bay 4 to the whole-class P80 of A$3.379m, excluding GST, subject to the component forecast and the tail actions. Chapter 8's component view put the P80 at about A$3.0m, and Chapter 9 found that the whole-project P90 failed the A$3.5m affordability limit while a staged commitment passed it.

This is an illustration. The owner kept the funding figure at **A$3.379m** and did not move it down to the component figure, for three reasons written into the paper. The component view rests on subclasses of four to eight projects and cannot produce any outcome above A$3,391k, so it cannot see the tail that the whole class shows. The difference between the two figures, between about A$350k and A$420k depending on the correlation assumed, sits in the owner's reserve, not in the project budget, so funding it commits borrowing capacity but does not invite the project to spend it. And the staged structure from Chapter 9 means that the P90 test is passed on what is actually committed at approval. The paper records the component P80 beside the funding figure, so that, as outcomes accumulate, the business can see which of the two its projects support.

```figure
type: compare
title: The numbers in Bay 4's decision paper
cols: Cost | First production shift | Held by
caption: This is an illustration, excluding GST. The rollout of the software, A$105k of base cost, is inside the funding but released only at the software gate.
- Inside-view estimate | A$2,400k, including A$120k contingency | week 36 | baseline for the record
- * Project budget, P50 | A$2,736k, contingency A$456k | week 44.7 | project manager
- Owner's reserve, P50 to P80 | A$643k, total A$3,379k | week 54.7 | owner
- Component view, for comparison | P80 about A$3.0m | not modelled | not funded
- P90 margin, tested not funded | A$538k, total A$3,917k | week 63.9 | business can find A$121k
- Staged commitment at approval, P90 | A$3,371k | not modelled | passes the A$3.5m test
```

## Recording forecasts so they can be checked

A forecast that is not written down with its date cannot be checked, because memory revises it. People remember having expected the outcome that happened. The fix is a **forecast register**: a simple table, kept by someone outside the project team, usually the finance manager, in which every forecast for every project is entered with its date, its basis and the person who made it, and never edited afterwards. A changed forecast is a new row, not an amended one.

For Bay 4, each row records the stage, the P50 and P80 for cost and for the first production shift, the method, and any change in scope. The register is what lets the business answer, at the end, three questions it otherwise cannot: what did we forecast at approval, when did we first know we would exceed the P50, and did our re-forecasts converge on the outcome or chase it?

For Bay 4, the register answered all three. The approval forecast was a P50 of A$2,736k. The forecast first rose above that figure at the week-24 software gate, once the pilot's cost and the building's ground conditions were known, more than 30 weeks before the final account, which let the owner plan the reserve draw rather than discover it. On time, the first production shift in week 43 was 7 weeks later than the inside-view plan, worth about 7 × A$45k = A$315k of contribution at the planned rate, but 1.7 weeks earlier than the P50 date. Neither result proves the forecast right; both are now on record to be counted.

```figure
type: timeline
title: Bay 4's forecast register, selected entries
caption: This is an illustration. Each entry is a new row; none overwrites the approval entry, which stays the baseline for the reference class.
- Week 0 | Approval | inside view A$2,400k and 36 weeks; P50 A$2,736k and 44.7 weeks; P80 A$3,379k and 54.7 weeks
- Week 2 | Network application lodged | maximum demand confirmed; supply works due by week 26
- Week 24 | Software gate | pilot passed at A$52k; Stage 1 P90 re-forecast A$2,950k; rollout released
- Week 26 | Merge point | machines delivered and supply energised in the same week
- Week 43 | First production shift | schedule ratio 43 ÷ 36 = 1.19
- * Week 56 | Final account | A$2,860k; cost ratio 1.19; A$124k of the owner's reserve drawn
```

## Calibration: P80s should come in four times in five

A set of probability forecasts is **calibrated** when events forecast at a given probability happen at about that rate. [Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) describes the idea for any forecaster; for a business using reference class forecasts, the test is direct. About 80% of projects should finish at or under their P80 forecasts, and about 50% at or under their P50s.

A single project tells almost nothing. Bay 4 finished under its P80, which a P80 forecast expects four times in five. Calibration needs a run of forecasts, and the business has only just started making them. It can, however, test the method on its own past. For each project from P13 onwards, take only the projects completed before it, compute the P80 those would have given, and see whether the project finished within it. That is a fair test, because each forecast uses only information available at the time.

This is an illustration. The back-test gives the following results.

```figure
type: compare
title: Back-testing the method on P13 to P24
cols: Earlier projects | P50 from them | P80 from them | Actual ratio | Within P80?
caption: This is an illustration. Each forecast uses only the projects completed before it, read with PERCENTILE.INC. 9 of 12 finished within their P80; 4 of 12 within their P50.
- P13 Wire EDM | 12 | 1.085 | 1.358 | 1.03 | yes
- * P14 Pallet pool | 13 | 1.060 | 1.336 | 1.45 | no
- P15 Factory extension | 14 | 1.085 | 1.408 | 1.24 | yes
- P16 Laser marking | 15 | 1.110 | 1.394 | 0.97 | yes
- P17 Quality system | 16 | 1.085 | 1.380 | 1.21 | yes
- * P18 Collaborative robot | 17 | 1.110 | 1.358 | 1.68 | no
- P19 Office fit-out | 18 | 1.120 | 1.422 | 1.10 | yes
- P20 5-axis centre | 19 | 1.110 | 1.408 | 1.08 | yes
- * P21 MES pilot | 20 | 1.105 | 1.394 | 1.95 | no
- P22 Solar and battery | 21 | 1.110 | 1.450 | 1.18 | yes
- P23 Tool presetting | 22 | 1.120 | 1.436 | 1.15 | yes
- P24 Dust extraction | 23 | 1.130 | 1.422 | 1.31 | yes
```

Nine of 12 finished within their P80, 75% against the 80% expected, or 9 against an expected 9.6. That is as close as 12 forecasts can show: if the method were perfectly calibrated, 9 or fewer of 12 would occur about 44% of the time. Only 4 of 12 finished within their P50, against an expected 6. If the P50s were calibrated, 4 or fewer would happen about 19% of the time, so this is a weak signal rather than proof, but it points the same way as the record: the later projects, P18, P21 and P24 among them, ran higher than the earlier ones, and the median has drifted up from 1.085 to 1.130 as they joined. The business notes it, and checks it again when more projects are added.

The test also shows what calibration can and cannot detect. With 12 forecasts, only gross errors are visible. If 7 or fewer of 12 had finished within their P80, which would happen only about 7% of the time under good calibration, the business would have clear evidence that its P80s were too low. Anything subtler needs more projects, which is one more reason to keep the register.

## The Brier score

Percentile checks test the forecast of the amount. Many project forecasts are statements of probability about an event: will this project exceed its approved budget, will it be in production by week 40? The **Brier score**, introduced by Brier (1950) for weather forecasts, measures how good such forecasts are.

```figure
type: formula
title: The Brier score for probability forecasts
formula: BS = (1 ÷ N) × Σ (f − o)²
caption: This is an illustration. Lower is better: 0 is perfect, and always forecasting 0.5 scores 0.25. The class-based forecasts use only projects completed before each one.
- f | Forecast probability of the event, between 0 and 1
- o | Outcome: 1 if the event happened, 0 if it did not
- N | Number of forecasts scored
step: P13, forecast 9 of 12 = 0.750 that it would exceed budget; it did: (0.750 − 1)² = 0.0625
step: P16, forecast 0.800; it finished at 0.97: (0.800 − 0)² = 0.640
step: Twelve class-based forecasts, P13 to P24: mean score 0.096
step: A constant 0.2, the inside view's implied belief: 0.590; a constant 0.5: 0.250
```

This is an illustration. For each of P13 to P24, the class-based forecast that the project would exceed its approved budget is the share of earlier projects that did. Eleven of the twelve did exceed their budgets, and the forecasts, between 0.750 and 0.826, scored a mean of **0.096**. A forecaster who believed that inside-view budgets usually hold, and gave each project a 20% chance of overrunning, consistent with the habit of a 5% contingency line, would have scored **0.590**, worse than someone who answered 0.5 every time. The Brier score turns "our estimates are optimistic" from an opinion into a number that can be tracked from year to year.

## Adding Bay 4 to the class

This is an illustration. Bay 4 reached its first production shift in week 43 and its final cost was **A$2.86m**, excluding GST, in 2026 dollars. That is above the P50 project budget of A$2.736m, so A$124k of the owner's reserve was drawn, and well inside the P80 funding of A$3.379m.

The record needs a ratio, and the choice of baseline matters. The 24 past ratios compare final cost with an approved budget that was the inside-view estimate with its own contingency. To stay comparable, Bay 4's ratio uses its inside-view approved budget of A$2.40m, not the P50 project budget and not the P80 funding: 2,860 ÷ 2,400 = **1.192**, recorded as 1.19. Its schedule ratio is 43 ÷ 36 = **1.19**. Once a business uses uplifts, the phrase "approved budget" starts to mean two things, so the record keeps two fields: the inside-view budget, which is the baseline for the class, and the funded amount, which is the decision.

```figure
type: compare
title: The class before and after Bay 4 joins it
cols: 24 projects | 25 projects with Bay 4 at 1.19
caption: This is an illustration. One project in the middle of the distribution moves the percentiles slightly; the P80 position moves from 19.4 to 1 + 0.8 × 24 = 20.2.
- Cost P50 | 1.140 | 1.150
- Cost P70 | 1.274 | 1.264
- * Cost P80 | 1.408 | 1.394
- Cost P90 | 1.632 | 1.616
- Schedule P50 | 1.240 | 1.231
- Schedule P80 | 1.518 | 1.509
```

With 25 projects, the P80 sits at position 1 + 0.8 × 24 = 20.2 in the sorted list, between the 20th value, 1.38, and the 21st, 1.45, so 1.38 + 0.2 × 0.07 = **1.394**. Bay 4 sits in the middle of the distribution, so the median rises a little and the upper percentiles ease a little. The business also records Bay 4's components separately: building A$1,140k on a share of A$905.3k, a ratio of 1.259; machines A$1,075k on A$1,052.6k, 1.021; automation A$395k on A$294.7k, 1.340; and software A$250k on A$147.4k, 1.696, of which the pilot was A$52k. These go in a component table beside the project records rather than into the subclasses as if they were separate projects, but they are the only way the subclasses of Chapter 8 will ever grow faster than one project a year.

## Governance and learning

None of this needs a system. It needs an owner and a calendar. The finance manager keeps the register and the reference class; each project's close-out review, held once the final account is settled, records the outcome, the ratios and the main cause in the same form as the existing rows; and once a year the business repeats the back-test and the Brier score on all forecasts made so far. [Learning from project risk](/reados/collections/project-planning-and-control/learning-from-project-risk/) describes calibration as one of the most useful findings a risk audit can produce, and the register makes that audit a matter of an afternoon.

The main cause column deserves as much care as the numbers. Chapter 7 found Bay 4's missing power path by reading it, and Chapter 9 built its tail-cutting actions from it. A cause recorded as "various" or "scope" teaches the next project nothing.

## The error: an overwritten baseline

This is an illustration. At close-out, the finance manager pulled Bay 4's figures from the ERP's project module to enter them in the reference class. The module showed a budget of **A$2.78m** and a final cost of A$2.86m, a ratio of 2,860 ÷ 2,780 = **1.03**. Bay 4 appeared to have finished within 3% of budget.

The module had been loaded with the A$2.40m at approval and had overwritten its budget field with each approved re-forecast. The last, in week 40, was A$2.78m. By the end, the "budget" was that late re-forecast, and comparing the final cost with it measured only how much changed in the last few weeks. Entered as 1.03, Bay 4 would have joined the class as one of its best-run projects. The upper percentiles would not have moved, because both 1.03 and 1.19 sit below them, but the median would have fallen to 1.130 instead of rising to 1.150, and the record would have told the next project team that an uplift had been unnecessary for the business's largest project.

The error was caught by reconciling the ERP figure with the forecast register, whose approval row still showed the inside-view budget of A$2.40m with its date. The fix was procedural: the reference class takes its baseline only from the register's approval row, and the ERP's budget field is renamed "current approved budget" so that nobody mistakes it again. Recording only the projects that went well has the same effect as this error by a different route, and the same cure: every project goes in, on the baseline fixed at the decision to proceed.

## Exercise: the next forecast from 25 projects

Using the 25-project class, find the P90 cost ratio by hand with PERCENTILE.INC. Then score Bay 4's own probability forecast with the Brier formula: at approval, the class said that 20 of 24 past projects had exceeded their approved budgets, while the inside view's 5% contingency implied a belief of about 0.2. Bay 4 did exceed its A$2.40m. What is each forecast's score, and what probability would the class now give the next project?

**Worked answer.** With 25 projects, the P90 position is 1 + 0.9 × 24 = 22.6. The 22nd sorted value is 1.52 and the 23rd is 1.68, so the P90 is 1.52 + 0.6 × 0.16 = **1.616**. The class's forecast for Bay 4 was 20 ÷ 24 = 0.833, and the outcome was 1, so its score is (0.833 − 1)² = **0.028**. The inside view's 0.2 scores (0.2 − 1)² = **0.64**, more than twenty times worse. With Bay 4 added, 21 of 25 projects exceeded their inside-view budgets, so the class's forecast for the next project is **0.84**. One score proves little on its own; it is the running average over many projects, kept in the register, that shows whether the business's forecasts are getting better.
