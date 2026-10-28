---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: reviewing-decisions-not-outcomes
order: 10
title: "Reviewing the decisions, not the outcomes"
description: "SB36's October 2026 review: the gate log, regret of A$392.3k against A$1,131.4k, spend stopped at 42.9% of plan, and a Brier score of 0.3534 that exposes overconfident schedules."
draft: true
---

Six months after a stop or a pivot, someone will look at what happened and say whether it was right. If the market turned out well, the stop will look timid; if it turned out badly, it will look wise. Neither verdict says much about the decision, because a decision is made with the information available at the time and an outcome arrives with information that was not. A review that judges decisions by their outcomes teaches the business to copy its lucky choices and abandon its unlucky ones, which is close to learning nothing.

This chapter closes the SB36 case with the review Corella Plains Implements held in October 2026. It separates decision quality from outcome quality, sets out the gate log, measures what the gates saved and how much the stop might have cost in hindsight, and scores the programme's forecasts for calibration. It ends with an argument, made from a competitor's first-season sales, that the stop was a mistake.

## Decisions and outcomes

Decision analysis, the professional practice surveyed in Ronald Howard's 1988 paper "Decision analysis: practice and promise", frames a choice as alternatives, information, probabilities and values, connected by reasoning. A standard teaching of the field is that a decision should be judged by those elements, by what the decision-maker knew and how it was used, not by the result. A good decision can have a bad outcome, because uncertain events can go either way; a bad decision can have a good outcome for the same reason. Over many decisions, good decisions produce better outcomes on average. On any one, the outcome is weak evidence.

```figure
type: matrix
title: Decision quality against outcome quality
x: Outcome: bad to good
y: Decision: poor to sound
hot: 2
caption: The review's job is to place each decision on the vertical axis using what was known when it was made. The horizontal axis is what happened, and it is the axis everyone sees first.
- Sound decision, bad outcome | Bad luck: keep the method, check the inputs
- Sound decision, good outcome | Deserved success: keep the method
- Poor decision, bad outcome | Deserved failure: change the method
- Poor decision, good outcome | Dumb luck: change the method before it runs out
```

The useful questions for a review follow from this. Was the information at the gate as good as it could reasonably have been for the money? Were the real alternatives on the table? Were the values and probabilities honest, and were they set before the evidence arrived? Was the arithmetic right? Did the business act on what the gate decided? None of these needs the outcome.

## The gate log

This is an illustration. All money in this chapter is in Australian dollars excluding GST, in thousands (A$k). Corella's finance manager kept a gate log for SB36: each gate's date, decision, key numbers and the documents behind it, plus any event that changed the programme's commitments. The review started from it.

```figure
type: timeline
title: SB36 gate log, February 2025 to October 2026
caption: This is an illustration. Gates 4 and 5 were held three weeks and six days late. The missed re-gate of 6 November 2025 is recorded where it should have happened.
- 11 Feb 2025 | Gate 1: go | Stage 1 scoping, A$40k
- 15 Apr 2025 | Gate 2: go | Stage 2 concept and bench trial, A$180k
- 4 Aug 2025 | Gate 3: go | Stage 3 development, A$560k; tree value A$323.1k
- 14 Aug 2025 | Tooling order placed | A$600k; cancelled 19 Sep 2025 for a A$40k slot reservation
- * 6 Nov 2025 | Re-gate due, not held | Stage 3 forecast A$675k above the A$644k cap
- 17 Dec 2025 | Gate 4: go | planned 26 Nov; controlled detection 94% against 93%; kill criteria signed
- 21 Apr 2026 | Gate 5: full boom stopped | planned 15 Apr; Weak signal; pivot to kit, welding cell funded
- 8 Sep 2026 | Welding cell commissioned | A$850k
- Oct 2026 | Review | this chapter
```

Read as a record of decisions, the log is mostly good. The tooling order was caught before steel was cut (Chapter 1). Gate 3 was approved on a tree that valued the right to stop (Chapters 2 and 3). The field season was bought because it could change the launch decision, and a third prototype that could not was refused (Chapter 4). The kill criteria were written before the season (Chapter 7), the attempt to move them was caught, and two errors of sunk cost reasoning, one in each direction, were corrected before Gate 5 decided (Chapters 8 and 9). The weak point is Stage 3: three top-ups approved by the programme's champion and a re-gate that the business's own rule required and nobody called (Chapter 6).

## What happened by October 2026

This is an illustration. By 20 October 2026:

- **Kit orders: 9** for the 2026–27 season. The kit was planned on 22 a year in the Medium state, so 9 orders are 40.9% of a Medium year. The selling season was not over, and the kit had been available to dealers only since August.
- **Welding cell:** commissioned on 8 September 2026, with savings running from that month.
- **The competitor:** the imported camera boom that Chapter 5 described had sold **about 10 units** in its first Australian season, 2025–26, by dealer estimate.

None of these outcomes answers the review's main question, but each is worth recording. Early orders in particular need care: a kit sold to growers before the spraying season will not arrive evenly through the year, and 9 orders in October cannot be compared with 22 a year without a seasonal plan. [Tracking benefits against a phased plan](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/tracking-benefit-realisation/) in *Demand and Benefit Forecasts by the Numbers* shows how to phase a benefit plan by season so that early results are read against what was expected by that date. The kit's orders are an early, partial reading on the market state. The cell's commissioning is the first of seven years of savings that were forecast at A$260k a year. The competitor's sales are the subject of this chapter's error.

## Judging the Gate 5 decision

On the information available at Gate 5, the Weak field signal and the posterior probabilities of 0.0655 High, 0.3843 Medium and 0.5502 Low, option B, the kit with the welding cell, was worth **A$893.7k** and option A, the full launch with the cell deferred, **A$116.8k** (Chapter 9). The review's first finding was that the decision followed from the numbers, and that the numbers had been put together correctly once the two sunk cost errors were removed.

A fair review also asks what the decision might have cost. The most uncomfortable case is a High market: if it turns out that Corella could have sold 40 booms a year, a full launch would have made **A$7,258.9k** against the kit's **A$1,269.2k**. The difference, **A$5,989.7k**, is the **regret** of having chosen the kit in that state: the value given up compared with the best choice had the state been known.

The review weighed that regret by its probability at the time, 6.55%, giving an **expected regret of A$392.3k** for choosing the kit. It then did the same for the opposite choice. Had Corella launched the full boom, it would have regretted that in a Medium market (kit A$781.4k against launch A$11.8k) and in a Low market (kit A$171.7k against launch −A$1,347.1k). Weighted by 0.3843 and 0.5502, the **expected regret of launching** is 0.3843 × 769.6 + 0.5502 × 1,518.8 = **A$1,131.4k**.

```figure
type: bars
title: Expected regret of each Gate 5 choice
unit: A$'000
max: 1200
caption: This is an illustration. Regret is the value given up against the best choice in each market state, weighted by the Weak posterior. The difference, A$739.1k, equals the difference between the two options' expected values.
- * Choosing the kit: regret only if High | 392.3 | 6.55% × A$5,989.7k
- Choosing the full launch: regret if Medium or Low | 1131.4 | 38.4% × A$769.6k + 55.0% × A$1,518.8k
```

The two figures differ by 1,131.4 − 392.3 = **A$739.1k**, exactly the kit's advantage in expected value (477.9 against −261.2). That is not a coincidence: minimising expected regret and maximising expected value always choose the same option. What regret adds is a way of talking about hindsight. If, in two years, the market proves High and someone says the stop cost A$6 million, the review has already recorded that this was a 6.55% possibility at the time, that it was weighed, and that the opposite choice carried nearly three times as much expected regret.

## What the gates saved

The second measure is how much the programme spent before stopping its main product, compared with the business's past. When the full boom was stopped, SB36 had spent **A$1,245k**, **42.9%** of the A$2,900k planned to launch. The A$1,800k launch, the part most exposed to the market, was not committed; the one early launch order, the tooling, had been cancelled in September 2025 at a cost of A$40k. Of Corella's earlier failures (Chapter 1), the round-bale handler and the air-seeder cart were withdrawn only after their full development and launch spend, A$470k and A$1,640k, had gone. The gates did not make SB36 a success. They made its failure, as a full boom, cheaper and earlier, and they left something to pivot to.

```figure
type: stats
title: SB36 review in figures, October 2026
caption: This is an illustration. Expected values are at Gate 5 on the Weak posterior. The Brier score is over six gate forecasts; lower is better, and 0.25 is the score of always forecasting 50%.
- A$893.7k | expected value of the Gate 5 choice | against A$116.8k for a full launch
- 42.9% | of the planned A$2,900k spent when the full boom stopped | the A$1,800k launch not committed
- A$392.3k | expected regret of the kit | against A$1,131.4k for launching
- 0.3534 | Brier score of six gate forecasts | own-execution forecasts 0.7662
```

## Calibration of the gate forecasts

A business that decides with probabilities should check whether its probabilities mean what they say. The review collected six forecasts made at or before the gates, each a probability that a stated event would happen by a stated date, and scored them with the **Brier score**: the average of (p − o)², where p is the forecast probability and o is 1 if the event happened and 0 if not. A perfect forecaster scores 0. Forecasting 50% on everything scores 0.25.

```figure
type: compare
title: Six SB36 forecasts and their outcomes
cols: Forecast p | Outcome | (p − o)²
caption: This is an illustration. Brier score over six forecasts: 2.1203 ÷ 6 = 0.3534. The two forecasts about the business's own schedule and budget score 0.7662 on their own; the four technical and market forecasts score 0.1469.
- Bench detection at least 90% at Gate 3 | 0.80 | 1 | 0.0400
- Technical pass at Gate 4 | 0.75 | 1 | 0.0625
- * Stage 3 within 115% of budget | 0.85 | 0 | 0.7225
- Field signal Strong | 0.4275 | 0 | 0.1828
- * Field season starts by 1 Dec 2025 | 0.90 | 0 | 0.8100
- 10 dealer deposits by 31 Mar 2026 | 0.55 | 0 | 0.3025
```

The overall score, **0.3534**, is worse than the 0.25 of a forecaster who always says 50%. Split by subject, the picture is clearer. The four forecasts about the technology and the market score **0.1469**, better than the benchmark: the probabilities were moderate, and the events went the way the probabilities leaned or were close to even. The two forecasts about Corella's own execution, keeping Stage 3 within its cap and starting the field season on time, were made at 85% and 90% and both failed. On their own they score **0.7662**.

Six forecasts are far too few to prove anything, and one season of bad luck could produce the same pattern. But it is the pattern Chapter 1 found in Corella's history, where six of eight products overran their development budgets, and the pattern the escalation of Chapter 6 produced. The business is more confident about its own schedule and budget than its record supports. The review's recommendation was to keep scoring: every gate paper now lists its forecasts with probabilities and dates, and the finance manager scores them in a register as they resolve. [Deciding, tracking and calibrating the forecast](/reados/publications/reference-class-forecasting-by-the-numbers/tracking-and-calibrating/) in *Reference Class Forecasting by the Numbers* sets out such a forecast register, a back-test and the Brier score in more detail, and shows how a business's own outcomes join the reference class for the next estimate.

Calibration also feeds back into the decision tree. The probabilities at Gate 3, such as p_T = 0.75 and the 0.85, 0.45 and 0.10 likelihoods of the field signal, were judgements. If Corella's judgements about its own work are systematically high, the next tree should use its history of overruns, not its engineers' first estimates, for the stages it runs itself.

## The error: judging the stop by a competitor's season

This is an illustration. At the review meeting the sales and dealer manager argued that stopping the full boom had been a mistake. The imported camera boom had sold about ten units in its first Australian season, the manager said, which showed that growers would buy a camera spot-spray boom, and Corella had handed the market to a competitor.

The independent board adviser, who chaired the review, separated three questions.

**Was the Gate 5 decision wrong on what was known?** No. The competitor's sales figure was not available on 21 April 2026 in any reliable form, and the review judges the decision on the information at Gate 5. On that information the kit was worth A$739.1k more than a full launch.

**Does the new figure say the market is High?** Very little. About ten units is a dealer estimate, not a sales record, for a different product at a different price, sold through a different network, in a first season with launch promotion. Corella's High state was a market that would take **40 Corella booms a year** for six years. Ten units of someone else's boom is consistent with a High, a Medium or even a Low market for Corella. The adviser tested the most generous reading: treating the competitor's season as the "sells well" signal of Chapter 5, which is four times as likely to occur in a High market as in a Low one, would raise P(High) from 6.55% to 14.8%. On that posterior a full launch would be worth A$661.1k, against A$664.3k for the kit. With the competitor now established, so that a late Corella boom would sell 28 a year in the High state rather than 40, the launch would be worth only A$259.5k. Even read generously, the competitor's season does not make a full launch the better choice now, let alone show that it was the better choice then.

**What should the business do with the new information?** Use it for the next decision, not to rewrite the last. The adviser proposed that the full boom be reconsidered at a gate in April 2027, with criteria written now: the kit's orders for the 2026–27 season, a dealer-verified count of the competitor's second-season sales, and field detection on stubble from the kit's installed units. Those are the conditions under which a full boom could come back, set before the evidence, in the same way as at Gate 4.

The episode is a standard hazard of reviews. An outcome arrives, it is vivid, and it seems to settle a question about a decision that was made on different information. The defence is the one the review used: put the decision back in its own time, with its own probabilities, and ask whether new evidence changes the next choice. [Stopping well: ending projects that no longer deserve the people and money](/reados/collections/project-sponsors-governance-and-decisions/stopping-projects-well/) makes the related point that a stopped project should be closed with its reasons recorded, so that later arguments start from the record rather than from memory.

## Exercise: two more forecasts

Two further forecasts were recorded at Gate 5 and resolved by the end of October 2026: that kit orders would reach at least 15 by 31 October 2026, forecast at 0.6, which did not happen; and that the welding cell would be commissioned by 30 September 2026, forecast at 0.8, which did. Add them to the six forecasts above and calculate the Brier score over all eight. What does the result suggest?

**Worked answer.** The kit forecast scores (0.6 − 0)² = **0.3600** and the welding cell forecast (0.8 − 1)² = **0.0400**. The sum of the six original squared errors is 0.0400 + 0.0625 + 0.7225 + 0.1828 + 0.8100 + 0.3025 = 2.1203; adding 0.3600 and 0.0400 gives 2.5203, and the Brier score over eight forecasts is 2.5203 ÷ 8 = **0.3150**. The score improves but is still worse than the 0.25 benchmark. The kit forecast is another forecast about Corella's own commercial execution that was too confident; the welding cell, a conventional purchase with a supplier's programme, came in as expected. Eight forecasts are still a small sample, but the direction is consistent: the business forecasts its own delivery too confidently, and its next decision tree should lower the probabilities it gives itself until its record says otherwise.
