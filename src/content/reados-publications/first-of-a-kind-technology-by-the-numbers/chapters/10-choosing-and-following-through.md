---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: choosing-and-following-through
order: 10
title: "Choosing between proven and novel, and following the choice through"
description: "The risk-adjusted choice of the proven line now and a fines module later, ramp-up tracked against its curve, and a module pass criterion that a two-week clean-bale trial nearly bypassed."
draft: false
---

The board now has what it lacked in March 2024: each input with its evidence, each element with its readiness, a qualification standard, ramp-up curves, allowances graded by novelty and four strategies valued in one model. This chapter puts them side by side, traces how the novel process's paper lead disappeared step by step, and records the decision and what would have changed it.

A decision is only the start of the evidence, though. The second half of the chapter follows the choice into operation: tracking the proven line's ramp-up against its curve, and holding the fines module to pass criteria written before its trial. The error case is the most ordinary in the book, and the most tempting: a short trial on good feed that looked like proof.

## The four strategies side by side

This is an illustration. All amounts are A$ excluding GST, net present values at 8% a year real over the 144 months to the end of the site lease, from 10,000 simulated trials per strategy.

```figure
type: compare
title: The four strategies, simulated net present value
cols: Mean | P10 | P90
caption: This is an illustration. B falls below A's median NPV of A$12,688,729 in 82.0% of trials and below zero in 2.0%; A never falls below zero. D's mean is the probability-weighted value of its pass and fail branches.
- A, proven line now | A$12,676,871 | A$10,927,083 | A$14,397,617
- B, novel process now | A$8,760,870 | A$3,281,476 | A$14,210,284
- * C, proven line now, fines module later | A$13,408,066 | A$11,051,836 | A$15,959,907
- D, qualify B first | A$11,351,626 | pass branch mean A$12,546,926 | fail branch mean A$9,558,675
```

Three things stand out. C has the highest mean and the highest P10 and P90: it is better on average and in the bad cases. B's best outcomes are similar to A's, but its worst are far worse, with a P10 of A$3.28 million against A's A$10.93 million; that spread is the price of novelty Chapter 8 measured. And D, qualifying B first, costs more in delay and in the design written off on failure than its information is worth, for the reason [Chapter 9](/reados/publications/first-of-a-kind-technology-by-the-numbers/buying-down-technology-risk/) found: the yield it would measure sits at the break-even.

## Where the paper lead went

The two bridges below run from the paper NPVs of Chapter 1 to the NPVs at the case's P50 inputs, changing one assumption at a time.

```figure
type: compare
title: From paper NPV to NPV at P50 inputs, one step at a time
cols: Option A, proven | Option B, novel
caption: This is an illustration. B loses A$18,476,851 between paper and P50 inputs, A loses A$1,625,322. The yield correction of Chapter 6 is B's largest single step, 36.9% of its loss.
- Paper NPV, nameplate from the first month | A$14,904,837 | A$28,734,379
- Capital cost at P50 growth | −A$800,000 | −A$3,015,000
- Schedule at P50 | −A$352,824, month 16.8 | −A$2,618,875, month 21.25
- * Yield on the recycler's basis | none, 72% guaranteed | −A$6,815,304, 84% to 78.9%
- Ramp-up and plateau | −A$472,498 | −A$6,027,672, 93% plateau
- NPV at P50 inputs | A$13,279,515 | A$10,257,528
```

The order of the steps changes the size of each, but not the total, and the message is clear either way. The corrections to A are small because each of its inputs came with full-scale evidence in the same duty. Every correction to B came from asking a question its paper figures had not answered: what does the novel element cost when graded by readiness, how long does a pioneer plant take, on what basis was the yield measured, and how does a first-of-a-kind plant start up. The single largest step, **−A$6,815,304**, came from the yield's measurement basis, a question that cost nothing to ask.

## The decision

In the case, the board chose **strategy C**: the proven line now, and a fines-recovery module qualified on the plant's own residue and added later if it passed. The board paper recorded the decision from the outcome the business needed, washed and sorted flake from 18,000 t of bales a year, starting soon and reliably, rather than from a preference for either technology. [Options derived from the outcome, and why the choice changed](/reados/publications/outcome-first-projects-by-the-numbers/options-derived-from-the-outcome/) in *Outcome-First Projects by the Numbers* makes the same move in a different setting.

The mean was not the only reason. The recycler is a family-owned business of about 55 staff, and the board weighed the bad outcomes as heavily as the average. B needed about A$5.6 million more capital than A at P80 (A$22,899,181 against A$17,330,037), started producing about five months later at the median, and in one trial in ten was worth less than A$3.3 million. A business of this size can survive a disappointing first plant, but not easily, and C offered a higher mean without that exposure. The novel idea the board liked most, recovering fines, survived in the module; the parts it had least evidence for, the closed loop above all, did not.

The paper also recorded what would have had to be true for B to be the better choice, so that the question could be reopened on evidence rather than enthusiasm:

- a qualified yield on the recycler's own bales of about **80% or more**, at which a qualified B would lead A by about A$1.5 million at P50 inputs;
- **cleaner feed**, since at 5% contamination the expected yield rises to 81.4%;
- a **full-scale reference plant** of the novel process running elsewhere in the same duty, which would raise its readiness and shrink both its allowances and its ramp-up.

The line is hazardous plant: shredders, granulators and conveyors are covered by Safe Work Australia's model Code of Practice on managing the risks of plant in the workplace, and their design, installation and commissioning sit with competent people under the work health and safety laws of Western Australia; whether the model code applies there is a question for the state regulator.

## Following through: tracking the ramp-up

The proven line produced its first saleable flake in **month 17, August 2025**, one month later than planned and inside its P80 of 17.9 months. From then on, the operations manager compared actual attainment each month with the expected curve of [Chapter 7](/reados/publications/first-of-a-kind-technology-by-the-numbers/ramp-up-to-nameplate/), 1.00 − 0.40e^(−t/2), under a rule written before start-up: **raise a flag if attainment is more than 5 points below the curve in two consecutive months.**

```figure
type: line
title: Option A's ramp-up, observed against its expected curve
x: Months after start-up, August 2025 = 0
y: Attainment, % of design feed rate
legend: Observed | Expected curve
ymin: 40
ymax: 100
mark: 1 | flag raised
caption: This is an illustration. Gaps of −8.0 and −5.7 points in months 0 and 1 triggered the flag; after the granulator screen was changed the line ran at or above the curve. The shortfall was 246 t of bales, A$86,404 of contribution.
- 0 | 52 | 60.0
- 1 | 70 | 75.7
- 2 | 83 | 85.3
- 3 | 90 | 91.1
- 4 | 95 | 94.6
- 5 | 97 | 96.7
```

This is an illustration. Observed attainment over the first six months, August 2025 to January 2026, was 52%, 70%, 83%, 90%, 95% and 97%, against the curve's 60.0%, 75.7%, 85.3%, 91.1%, 94.6% and 96.7%. Month 0 was 8.0 points short and month 1 was 5.7 points short, so the flag went up at the end of September 2025. The cause was found within the month: a granulator screen that blinded with wet labels and held back the whole line's feed rate. After a change of screen, the gaps closed to −2.3 and −1.1 points and then turned slightly positive.

Over the six months the line processed **246 t** of bales fewer than its curve, about 177 t of flake, at a margin of A$351.20 a tonne of feed: **A$86,404** of contribution. That is small, and the point is that it stayed small. Without a curve to compare against, a 52% first month looks like a normal start-up and a 70% second month like progress; against the curve, both were signals, and the cause was found while the loss was still small.

## Pass criteria written before the trial

The fines module's qualification ran from month 18 to month 30, September 2025 to September 2026, on a slip-stream rig fed from the line's own residue. Its pass criteria were written into the board paper before the rig was built:

- an **80% lower confidence bound on the yield gain of at least +4.0 points**, measured by mass balance on the dry, saleable basis of Chapter 6;
- over **at least 1,500 operating hours** on **routine bales**, drawn as received;
- and an **MTBF of at least 500 h at 80% confidence**, by the chi-square bound of Chapter 6.

The +4.0 points was not arbitrary. The module breaks even at a gain of 3.26 points at its P50 capital cost and **3.76 points** at its P80 capital cost, so a lower bound of 4.0 means that, with 80% confidence, the gain pays for the module even if its capital cost reaches P80. [Stopping rules and kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) in *Stage Gates and Stopping Rules by the Numbers* explains why criteria fixed in advance resist the pressure that results create.

## The error: two weeks on clean bales

Early in the qualification, the supplier of the sorter ran a **two-week trial on hand-picked clean bales** to tune the machine, and reported a gain of **+5.8 points**. At that gain the module's NPV would be **A$2,733,542** at P50 capital cost. The figure reached the managing director, the sorter maker offered an early-order discount, and a purchase order was drafted.

It was stopped by the criteria already in the board paper. The finance manager, preparing the order, checked it against them: two weeks is far short of 1,500 hours, hand-picked bales are not routine bales, and the report gave a point estimate with no lower bound. [Reading a pilot honestly: what a successful trial proves and what it does not](/reados/collections/records-business-data-and-learning/reading-a-pilot-honestly/) describes exactly this pattern: a trial run in its most favourable conditions, by the people most interested in its success.

The trial was not dishonest, and it was not useless. It was a tuning run, and for tuning, clean feed is sensible: it lets the sorter's settings be found without the noise of contamination. What it could not do was predict the gain on the plant's real residue. Routine bales carry more labels, paper fibre and dirt, and on a residue stream those concentrate in exactly the fines the module is meant to recover, so the sorter has more to reject and less good polymer to find. Two weeks also says nothing about wear on the small hydrocyclones or fouling of the sorter's optics, which take months to show. The fault was not in running the trial but in treating its result as an answer to a question it had not been designed to ask.

The full run went ahead. It lasted **1,520 h** with **one unplanned stop**, an 80% lower bound on MTBF of 2 × 1,520 ÷ 5.989 = **507.6 h**, which passes. The yield gain on routine bales was **+4.6 points**, with an 80% lower bound of **+4.1 points** from the weekly mass balances, which also passes. At +4.6 points the module's NPV is **A$1,443,768** at P50 capital cost and **A$899,284** at P80. The module was approved in September 2026, at month 30, for output planned from March 2027. It was worth building, but at about half the value the clean-bale trial suggested; had the order been placed on +5.8 points, the board would have been expecting A$1.3 million more than the module could deliver.

## Tracking the module once it runs

The module gets the same treatment as the line. Its expected ramp-up, from the case model, starts at 30% of its full gain in its first month and closes the gap with a time constant of 4 months: 1.00 − 0.70e^(−t/4). It is expected to deliver 45.5% of its gain in its second month, 66.9% in its fourth and 90% after **7.8 months**, averaging 74.9% over its first year. The flag rule is the same: more than 5 points below the curve in two consecutive months. A month at full gain is worth about A$71,500 of net contribution (A$857,800 ÷ 12), so a month lost to a slow start is worth chasing, but not worth panic.

The tracking also tests the forecasts themselves. If the module reaches 90% in four months, the case's curve was cautious, and the next module, or the next plant, can be planned with a shorter time constant. If it takes a year, the curve was optimistic, and the record says by how much.

## Recording the outcome for the next decision

The last task is the one most often skipped. The recycler will face another technology choice, and the best evidence it will have is its own record of this one: what was forecast, what happened and why. The decision record kept for this purpose is short. Over several decisions it becomes the business's own reference class: a set of forecasts and outturns from which it can see whether its P80s held about four times in five, whether its ramp-up curves were too cautious or too hopeful, and whether its readiness ratings predicted the cost growth that followed. *Reference Class Forecasting by the Numbers* ends with the same step, applied to cost forecasts.

```figure
type: checklist
title: The decision record kept for the next technology choice
caption: Each item is kept with its date and its evidence class, so that the next decision can be compared with this one rather than with memory.
- Every input with its evidence class | guarantee, reference plants, pilot, estimate
- Readiness of each critical element, and who rated it | with the reviewer's changes
- Capital cost and start month at estimate, P50, P80 and outturn | per element where possible
- Expected ramp-up curve and monthly actuals | with each flag, its cause and its fix
- Pass criteria and the trial results against them | including trials that were not counted, and why
- Conditions that would reopen the choice | B at about 80% qualified yield, cleaner feed, a reference plant
```

## Exercise: a lower bound of +3.6 points

Suppose the module's 1,500-hour run had produced an 80% lower bound on the yield gain of **+3.6 points**. Does it pass? Taking 3.6 points as the gain, what is the module's NPV at P50 and at P80 capital cost, and what should the board do?

**Worked answer.** It fails: 3.6 is below the criterion of 4.0. At a gain of 3.6 points the module's NPV is **A$368,956** at P50 capital cost and **−A$175,527** at P80. The break-even gains are 3.26 points at P50 capital and 3.76 at P80, so with 80% confidence the module pays only if its capital cost stays near its median, and it loses money if the capital grows as a novel module's often does. The criterion was set to exclude exactly this case. The board has two sound choices: decline the module and keep the proven line as it is, or find the cause of the lower gain, for example dirtier residue than expected, and retest under the same rules with better feed. What it should not do is lower the criterion after seeing the result.
