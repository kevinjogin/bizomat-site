---
book: front-end-planning-by-the-numbers
chapterSlug: how-much-front-end-is-enough
order: 6
title: "How much front-end planning is enough"
description: "Diminishing returns on front-end spend: an illustrative optimum of A$256.9k against A$248k spent, and a three-week gate slip that would have lifted P(miss) from 5.3% to 24.1%."
draft: false
---

The chapters so far have made the case for the front end: it is cheap per week, it raises the definition score, it matures the estimate, and it finds scope that would cost far more on site. None of that means more is always better. Each study finds less than the one before, because the large problems tend to show up first, and every week spent studying is a week taken from somewhere. On a project with a fixed deadline, that somewhere is delivery float.

This chapter puts the question into numbers. It describes the two ways to get the amount wrong, builds a simple model of diminishing returns for Northbank's upgrade, reads the optimum and the margin from it, and shows how the harvest deadline caps the answer. It ends with a near miss: a third packing-line layout that would have held the approval gate for three weeks and cost far more in deadline risk than in fees.

## Too little and too much

**Too little** front end is the rush path. The concept estimate is approved, the contractor starts, and the problems the concept could not see turn up during delivery, where they are fixed with variations, rework and lost weeks. Chapter 5 priced what that meant for Northbank: five items worth A$990k excluding GST if found on paper, A$1,425k if found on site, plus the weeks of delay that go with them.

**Too much** front end is harder to recognise, because every individual study looks prudent. It shows up as definition that never freezes: another option compared after the selection is made, another layout drawn after the process is settled, another quote sought after the market has answered. The direct cost is modest, often a consultant's fee and the project engineer's time. The indirect cost is the one that matters: approval moves, long-lead orders move with it, and the delivery window that follows either shortens or slides towards the deadline.

The useful question is therefore not whether a study is worth doing in general, but whether **the next study** is worth its cost and its weeks, given what has already been learned. That is a marginal question, and it needs a model with a margin in it.

## Front-end spend as a share of cost

This is an illustration. Northbank spent **A$248k** on FEL 2 and FEL 3, which is **3.9%** of the Class 3 total of A$6,428k, or 4.2% including the A$22k concept study. Percentages like these are easy to compare between projects and are often used as rules of thumb. This book quotes no published percentage, for two reasons. The published research was mostly on larger industrial and building projects than a family packhouse, and a percentage says nothing about whether the money was spent on the right questions. Northbank's A$46k of investigations in Chapter 5 found A$435k of late premium; the same A$46k spent on a fourth set of renderings would have found nothing.

A share of cost is a sensible check after the fact. It is a poor target before it, because the right amount depends on how much is unknown and how expensive it would be to find out late, not on the size of the budget.

## A model of diminishing returns

The model used here is deliberately simple. It has one curve and two numbers, and both numbers are judgements. It is meant to show the shape of the decision, not to compute the fee for a geotechnical engineer.

Let x be the front-end spend in A$k. The share of discoverable problems the front end finds is assumed to follow

f(x) = 1 − e^(−x/k)

which starts at zero, rises steeply, and flattens towards 100% without reaching it. The constant **k** sets how quickly the curve rises: at x = k the front end has found 1 − e^(−1), about 63% of what can be found. For Northbank, k is taken as **A$110k**, a judgement that the first A$110k of well-directed work (the electrical capacity study, the duty study, the options study and the concept design) finds about two thirds of the problems, and that each further A$110k finds about two thirds of what is left.

The second number is **V**, the expected cost that a complete front end would avoid. It comes from the expected totals previewed in Chapter 1 and explained in Chapters 7 and 8: the rush path's expected total of A$7,451k, less the front-end path's expected total of A$6,562k without its A$248k front-end cost. V = 7,451 − (6,562 − 248) = **A$1,137k**. It bundles late scope, time-related cost and the expected cost of missing the harvest into one figure.

The **net value** of spending x is the cost avoided less the spend:

N(x) = V × f(x) − x

```figure
type: formula
title: Net value of front-end spend
formula: N(x) = V × (1 − e^(−x/k)) − x
caption: This is an illustration. The model is Northbank's own teaching device, not a published relationship. V and k are judgements; the shape matters more than the decimals.
- x | Front-end spend, A$k (FEL 2 plus FEL 3)
- k | Spend at which about 63% of discoverable problems are found, A$110k
- V | Expected cost a complete front end would avoid, A$1,137k
step: At x = 248: f = 1 − e^(−248/110) = 89.5%
step: Cost avoided = 1,137 × 0.8951 = A$1,017.7k
step: N(248) = 1,017.7 − 248 = A$769.7k
```

### What the model leaves out

Three simplifications deserve stating. First, it treats every dollar of front end as equally well aimed; a badly directed front end has a much larger k, and a front end that never investigates the electrical supply never finds the supply problem however much it spends. Second, it ignores time: x is money, not weeks, and the deadline is handled separately below. Third, V is an expected value built on the schedule simulation of Chapter 8, whose spread is an assumption. The model is useful for the questions "roughly where is the optimum" and "how flat is the top", and for nothing finer.

## Reading the curve for Northbank

This is an illustration. The cost avoided rises fast at first and then flattens; the spend rises in a straight line. Their difference, the net value, climbs steeply to about A$580k at A$100k of spend, reaches its top near A$250k, and then falls slowly as further studies cost more than they find.

```figure
type: line
title: Cost avoided and net value against front-end spend
x: Front-end spend, A$k
y: A$k
legend: Cost avoided, V × f(x) | Net value, N(x)
ymin: 0
ymax: 1200
mark: 248 | A$248k spent
caption: This is an illustration with V = A$1,137k and k = A$110k. Net value peaks at A$770.1k at A$256.9k of spend; Northbank's A$248k gives A$769.7k. Past the optimum each extra dollar finds less than it costs, but the top is flat from about A$204k to A$321k.
- 0 | 0.0 | 0.0
- 50 | 415.3 | 365.3
- 100 | 678.9 | 578.9
- 150 | 846.2 | 696.2
- 200 | 952.4 | 752.4
- 248 | 1017.7 | 769.7
- 300 | 1062.6 | 762.6
- 400 | 1107.0 | 707.0
- 500 | 1124.9 | 624.9
- 700 | 1135.0 | 435.0
```

The first A$50k is worth A$365.3k net, because it buys the cheapest and most informative work: the options study, the electrical capacity study and the site survey. By A$150k the front end has found 74.4% of what can be found and the net value is A$696.2k. The last part of the climb, from A$150k to A$248k, adds only A$73.5k more, and beyond the top the curve turns down: at A$400k the net value is A$707.0k, at A$700k only A$435.0k.

## The optimum and the margin

The top of the curve is where one more dollar of front end avoids exactly one dollar of expected cost. Setting the slope of N(x) to zero gives

x* = k × ln(V ÷ k) = 110 × ln(1,137 ÷ 110) = 110 × 2.3357 = **A$256.9k**

at which the front end finds 90.3% of discoverable problems and the net value is A$770.1k. Northbank spent A$248k, which in the model finds 89.5% and is worth A$769.7k. The difference is A$0.4k, well inside the error of every input.

The more useful reading is the **margin**. At A$248k, the next A$1,000 would avoid about A$1,080 of expected cost: still slightly positive, but only just. At the start, the first A$1,000 avoided about A$10,340. A team that judges each study by the marginal question can feel this change without the model: early studies answer questions that change the scope, the estimate or the option; late studies refine answers that are already good enough.

```figure
type: stats
title: Northbank's front end in the model
caption: This is an illustration. All values come from the model with V = A$1,137k and k = A$110k.
- * A$256.9k | Optimum front-end spend | 90.3% of discoverable problems found
- A$248k | Actual FEL 2 and FEL 3 spend | 89.5% found, net value A$769.7k
- A$1.08 | Cost avoided by the next A$1 at A$248k | against A$10.34 for the first A$1
- A$203.5k to A$320.5k | Spend within 2% of the best net value | the top of the curve is flat
```

### How sensitive the optimum is

Because k is a judgement, it is worth testing. If problems were easier to find (k = A$80k), the optimum would fall to A$212.3k, and spending A$248k would cost A$6.9k of net value against that optimum. If they were harder to find (k = A$150k), the optimum would rise to A$303.8k, and A$248k would fall A$11.8k short. Across that range, the actual spend is never more than about A$12k from the best, because the top of the curve is flat. A front end within roughly a fifth of the optimum loses very little; a front end of A$50k, a fifth of the optimum, keeps less than half the value.

The same reasoning, applied to a single test rather than a whole front end, is set out in [The value of information: when is it worth finding out more?](/reados/collections/valuing-time-delay-and-uncertainty/the-value-of-information/). In product development the equivalent question is how many design and test iterations to run; [How many loops](/reados/publications/prototypes-and-simulation-by-the-numbers/how-many-loops/) in *Prototypes and Simulation by the Numbers* works through diminishing returns on iteration loops, with and without a cost of delay. [Cutting the tail before approval](/reados/publications/reference-class-forecasting-by-the-numbers/cutting-the-tail/) in *Reference Class Forecasting by the Numbers* takes the same idea from the outside view: work aimed at the sources of the worst outcomes, done before the money is committed.

## Merrow's argument and its limit

Merrow (2011), drawing on Independent Project Analysis's records of large industrial projects, argues that front-end loading is the most reliable predictor of how those projects turn out, and that cutting it short to save time or money is a leading cause of failure. The model agrees with the direction: on Northbank's numbers, a front end of A$50k would leave about A$404k of net value on the table compared with A$248k.

The argument has a limit that matters for seasonal projects. Merrow's projects mostly had flexible completion dates, so a longer front end delayed benefits but rarely destroyed them. Northbank's benefits arrive with the 2028 harvest or not at all. Every week added to the front end after the plan is set comes straight out of the seven weeks of float between planned readiness at week 58 and the deadline at week 65, because the long-lead orders, the distributor connection and the delivery contracts all wait for Gate 3.

The schedule simulation of Chapter 8 shows what that costs. Holding everything else equal and moving Gate 3 later, one week at a time:

```figure
type: compare
title: Moving Gate 3 later against a fixed deadline
cols: Float to week 65 | Chance of missing the deadline | Expected cost of delay
rowhead: Gate 3 at
caption: This is an illustration from the book's seeded schedule simulation (36 planned delivery weeks, median ratio 1.05, σ 0.08). Each week of slip adds more expected cost than the one before.
- * Week 22 (planned) | 7 weeks | 5.3% | A$36k
- Week 23 | 6 weeks | 9.3% | A$65k
- Week 24 | 5 weeks | 15.6% | A$110k
- Week 25 | 4 weeks | 24.1% | A$171k
- Week 26 | 3 weeks | 35.3% | A$254k
- Week 27 | 2 weeks | 48.1% | A$352k
```

One week of front end costs Northbank about A$11.3k in fees. One week of slip at Gate 3 costs A$29k of expected cost of delay for the first week, A$45k for the second and A$61k for the third. Once the plan is set, the deadline makes extra front-end time expensive long before extra front-end money is.

## Deciding when to stop defining

The two parts of the chapter combine into one test for any proposed study late in the front end. The study must change a decision, not just refine a number; and it must fit within the weeks the plan allows. If it changes a decision but does not fit, the question becomes whether the decision can be deferred to delivery, or to a later stage of the project, without harm.

```figure
type: decision
title: Keep defining or freeze
question: Would the next study change the scope, the option, the estimate class or the order of work, and can it finish before the planned gate?
caption: The test is marginal. A study that only refines a number already good enough to decide is over-planning, whatever it costs.
- Changes a decision, fits the plan | do it now | the usual case in FEL 2 and early FEL 3
- * Changes a decision, does not fit | price the slip with the schedule model | defer the decision if the deadline risk exceeds what the study can save
- Refines a number only | freeze and record the residual risk | carry it in the risk register and contingency
- Nobody can say what it would change | do not commission it | the question is not yet framed
```

## The error: a third grader layout

This is an illustration. Late in FEL 3, the grader supplier offered a third packing-line layout, with a shorter conveyor run that the packhouse team liked. Layout two had already been developed, costed in the Class 3 estimate and checked against element A2: it met the throughput and storage requirement. The project engineer proposed developing layout three before approval. It needed three more weeks of engineer time at A$3.0k a week and A$7k of redesign by the supplier, **A$16k** in direct cost, and it moved Gate 3 from week 22 to **week 25**.

On fees alone it looked cheap, and it went into the draft Gate 3 paper that way. What caught it was the schedule check that element C2 requires before approval, rerun for the paper with delivery starting at week 25. Float fell from seven weeks to four. The chance of missing the 31 January 2028 deadline rose from **5.3% to 24.1%**, and the expected cost of delay from **A$36k to A$171k**, an increase of A$135k. The real expected cost of the third layout was A$16k + A$135k = **A$151k**, for an improvement nobody had valued, on a line that already met its requirement.

The business corrected it by applying the test in the decision figure. Layout three refined the design rather than changing any decision the gate depended on, and it did not fit the plan. Layout two was frozen, Gate 3 was held at week 22, and the supplier's suggestion was recorded for the next line change. It was a near miss: the slip never happened, and every later chapter uses Gate 3 at week 22. The lasting change was procedural. A proposal to extend the front end now goes to the gate with its schedule effect computed, not only its fee.

The error is the mirror of the rush path's. The rush treated weeks of front end as expensive and skipped them; layout three treated weeks of front end as free because the fees were small. Both priced time at the wrong rate.

## Exercise: a cheaper and a dearer front end

Using the model with V = A$1,137k and k = A$110k, compare spending A$150k and A$400k on the front end with the A$248k Northbank spent. Which loses more net value, and what does the model leave out that matters for the dearer option?

**Worked answer.** At A$150k the share found is 1 − e^(−150/110) = 74.4%, the cost avoided is A$846.2k and the net value is **A$696.2k**. At A$400k the share found is 97.4%, the cost avoided A$1,107.0k and the net value **A$707.0k**. Against A$769.7k at A$248k, the cheaper front end loses **A$73.5k** and the dearer one **A$62.7k**. On money alone the two are similar. The model leaves out time: if the extra A$152k were spent at Northbank's front-end rate of about A$11.3k a week, it would take about 13 more weeks, far beyond the five-week slip in the gate table that already gives a 48.1% chance of missing the harvest. Against a fixed deadline, the dearer front end is much the worse choice unless its extra work can run in parallel within the planned 22 weeks.