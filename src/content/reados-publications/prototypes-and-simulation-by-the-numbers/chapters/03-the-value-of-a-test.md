---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: the-value-of-a-test
order: 3
title: "The value of a test: buying information before committing"
description: "Expected value of perfect and sample information for a drop test before a A$65,000 rotomould tool: EVPI A$55,800, EVSI A$43,800, and why the test pays only if run in parallel."
draft: false
---

A test costs money and often time. What it buys is information, and information is worth something only if it might change what you do. A test whose result would not change any decision is worth nothing, however thorough it is. A test that could stop the business from committing to an expensive mistake can be worth a great deal, even if it is crude and sometimes wrong. The value of a test can be calculated before it is run, and the calculation often gives a surprising answer.

This chapter values one test in the BPU-5 programme: a drop test on a fabricated enclosure shell before the business commits A$65,000 to a rotomould tool. It works out the expected value of perfect information, which sets a ceiling on what any test could be worth, then the expected value of the real, imperfect test, and compares both with the test's cost and its delay. It ends with a test programme that the team approved because they compared its cost with the wrong number.

## A test is worth what it changes

The method comes from decision analysis. Howard (1966) set out how to value information by what it changes in a decision under uncertainty. The idea is simple to state. Work out the best decision you can make now, with what you know, and its expected cost. Then work out the expected cost if you first obtained the information and then made the best decision given each possible result. The difference between the two is the **expected value of the information**. If it is less than the cost of getting the information, do not get it.

Three consequences follow, and all three matter in practice. Information is valuable only when there is a decision that its result could change. Its value depends on how uncertain you are now: a result you are already sure of is worth little. And its value is bounded: no test can be worth more than knowing the answer for certain, so the value of **perfect information** is a ceiling on the value of any test. The same reasoning, applied to choosing research projects rather than single tests, is in [Choosing and governing R&D projects](/reados/collections/product-development-and-launch/choosing-and-governing-r-and-d-projects/). At a project gate, where the decision is whether to fund the next stage at all, [Paying for information: perfect, sample and useless](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/paying-for-information/) in *Stage Gates and Stopping Rules by the Numbers* works the same method on market tests.

## The decision: commit the tool or test first

This is an illustration. The BPU-5's enclosure is rotationally moulded polyethylene, made in a production tool costing **A$65,000**, excluding GST, with a long lead time. The tool must be ordered soon after the EVT review if the production units are to arrive on time. Requirement R3 says the unit must survive a **300 mm corner drop** onto concrete with no damage to the battery tray and no loss of function. The EVT units, built with hand-fabricated enclosure parts, cannot show whether the moulded enclosure will pass, because a fabricated part does not have the wall thickness distribution of a moulded one.

The team has two options: commit the tool now, or first drop-test a **fabricated polyethylene shell** made to represent the moulded wall thickness at the corners, with a dummy battery tray and the correct mass inside.

The mechanical design engineer, drawing on the business's experience of previous moulded enclosures and the corner details of this design, puts the probability that the enclosure as drawn would fail R3 at **0.30**. That is the **prior** probability, before any test. If the enclosure fails after the tool is made, the fix costs **A$48,000** in tool modification and redesign, and **6 weeks** on the critical path while the tool is modified and the parts requalified. At the cost of delay from Chapter 1, A$25,000 a week, the total is 48,000 + 6 × 25,000 = **A$198,000**.

If a failure is known before the tool is ordered, the redesign costs only **A$12,000**: an engineer's time to thicken or reshape the failed corner and check the change, with no tool to modify. That figure assumes the team knows what to fix. A redesign with no failure to aim at is not a real option, because there is nothing specific to change, so the choices are to commit or to find out first.

## The expected loss of committing now

If the team commits the tool now, it pays A$198,000 with probability 0.30, and nothing extra with probability 0.70. The expected loss is 0.30 × 198,000 = **A$59,400**. This is the number every test must be compared against.

## The value of perfect information

Suppose an oracle could say, for free, whether the enclosure would pass. When it would fail (probability 0.30), the team would redesign before tooling for A$12,000. When it would pass, the team would commit with no extra cost. The expected cost with perfect information is 0.30 × 12,000 = **A$3,600**.

The **expected value of perfect information (EVPI)** is the expected loss acting now minus the expected loss with perfect information: 59,400 − 3,600 = **A$55,800**. No test, however thorough, can be worth more than A$55,800 to this decision. A test programme that costs more, including the cost of any delay it causes, is not worth running, whatever it would show.

```figure
type: formula
title: The value of information for the tool decision
formula: EVPI = expected loss acting now − expected loss with perfect information
formula: EVSI = expected loss acting now − expected loss acting on the test result
caption: This is an illustration, excluding GST. EVPI is a ceiling on the value of any test. EVSI is the value of a particular test; it pays only if it exceeds the test's cost including any delay.
- Expected loss acting now | 0.30 × A$198,000 = A$59,400
- Expected loss with perfect information | 0.30 × A$12,000 = A$3,600
- Expected loss acting on the shell test | A$15,600, from the decision tree
step: EVPI = 59,400 − 3,600 = A$55,800
step: EVSI = 59,400 − 15,600 = A$43,800
step: Net value in parallel = 43,800 − 14,000 = A$29,800
```

## An imperfect test

The fabricated shell is not the moulded enclosure, so the test can be wrong in two ways. From the business's experience of correlating fabricated shells with moulded parts, the team estimates that if the design really would fail, the shell test shows a failure with probability **0.80**, its **sensitivity**. If the design really would pass, the shell test still shows a failure with probability **0.10**, its **false-alarm rate**, because a hand-welded seam can crack where a moulded corner would not.

The probability that the test shows a failure is the sum of true and false alarms: 0.30 × 0.80 + 0.70 × 0.10 = 0.24 + 0.07 = **0.31**.

A failed test does not mean the design would certainly fail. By Bayes' rule, the probability that the design would fail given a failed test is 0.24 ÷ 0.31 = **0.774**. Given a passed test, the probability that the design would still fail is 0.30 × 0.20 ÷ 0.69 = 0.06 ÷ 0.69 = **0.087**. The test moves the probability of failure from 0.30 to 0.774 or to 0.087, depending on its result. It does not reduce it to zero, and that residual 0.087 is what makes the test worth less than perfect information.

```figure
type: tree
title: Commit the tool now, or test a fabricated shell first
caption: This is an illustration, excluding GST. Probabilities after the test come from Bayes' rule with sensitivity 0.80 and false-alarm rate 0.10. The test's own cost is not yet included.
- Commit the A$65,000 tool now | expected loss A$59,400
  - Enclosure fails R3, probability 0.30 | A$198,000: tool change A$48,000 plus 6 weeks × A$25,000
  - Enclosure passes, probability 0.70 | no extra cost
- * Drop-test a fabricated shell first | expected loss A$15,600 before test cost
  - Shell fails, probability 0.31 | redesign before tooling, A$12,000; design would have failed with probability 0.774
  - Shell passes, probability 0.69 | commit the tool; design still fails with probability 0.087, expected A$17,217
```

With the test, the team redesigns before tooling whenever the shell fails, at A$12,000, and commits whenever it passes, accepting the 0.087 chance of a A$198,000 failure. The expected loss is 0.31 × 12,000 + 0.69 × 0.087 × 198,000 = 3,720 + 11,880 = **A$15,600**. The **expected value of sample information (EVSI)** is 59,400 − 15,600 = **A$43,800**, 78.5% of the EVPI. An imperfect test is worth less than a perfect one, but here it is worth most of it.

## The test's cost, and its delay

The shell test costs **A$14,000**: fabrication of the shell, a dummy tray, the drop rig, and the test technician's time. As first planned, it also put **1 week** on the critical path, because the tool order would wait for the result. At A$25,000 a week the test's full cost was 14,000 + 25,000 = **A$39,000**, and its net value 43,800 − 39,000 = **A$4,800**. Positive, but only just: a small change in any estimate would make it negative.

The operations manager then rearranged the work. The shell could be fabricated and tested while the tool maker completed the tool design, which had to happen anyway, so that the result arrived before the date the tool order had to be placed. Run **in parallel** like this, the test costs only its A$14,000, and its net value is 43,800 − 14,000 = **A$29,800**.

```figure
type: bars
title: Expected total cost of each way to make the tool decision
unit: A$
max: 120000
caption: This is an illustration, excluding GST. Each bar is the expected cost of failures and redesigns plus the cost of the test and its delay. The shell test run in parallel is the cheapest real option.
- Commit now, no test | 59400
- * Shell test in parallel | 29600 | A$15,600 expected plus A$14,000
- Shell test with 1 week delay | 54600 | A$15,600 plus A$14,000 plus A$25,000
- Whole-unit programme, even if perfect | 114600 | A$3,600 plus A$111,000
- Perfect information, if it were free | 3600 | the lower limit
```

The comparison shows how much of a test's cost can be delay. The shell test's A$14,000 was never the problem; the A$25,000 week was. Reinertsen (2009) makes the general point that development decisions which ignore the cost of delay systematically over-value thoroughness and under-value speed, and the BPU-5's numbers are a small instance of it. The cost of delay itself rests on a forecast of sales, about 10 units a week in the case; [Building a demand forecast from its drivers](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/demand-from-drivers/) in *Demand and Benefit Forecasts by the Numbers* shows how such a forecast is built and checked.

## How sensitive the answer is to the prior

Working the algebra through, the EVSI of this test is a straight line in the prior probability of failure p: EVSI = 150,000 × p − 1,200. Setting it equal to the test's cost gives the prior at which the test just pays for itself:

- **In parallel**, A$14,000: p = 15,200 ÷ 150,000 = **0.101**.
- **With 1 week of delay**, A$39,000: p = 40,200 ÷ 150,000 = **0.268**.

The team's prior of 0.30 is far above the parallel break-even and only just above the break-even with delay. That is a useful way to present the decision: run in parallel, the test is worth doing unless the team believes the chance of failure is below about 1 in 10; run with a week's delay, it is worth doing only if they believe it is above about 1 in 4, and the case for it would vanish with a slightly more optimistic engineer.

## Where the prior comes from

The prior is the weakest number in the calculation, and it should be argued from evidence, not assumed. The best source is the business's own records: how often have previous moulded enclosures, or corners of this kind, failed their first drop test? Chapter 1's issue log, priced and classified by stage, is the start of such a record. Where records are thin, the prior is a judgement by the engineer who knows the design best, checked by asking what features of this design make failure more or less likely than in past ones. Writing the prior down, with its reasons, matters for a second reason: when the test result arrives, the team can see whether its judgement was well calibrated, and improve the next one.

The sensitivity and false-alarm rate deserve the same treatment. They describe how well the fabricated shell represents the moulded part, which is the fidelity question of Chapter 2 in numerical form. A shell with seams in different places from the moulding, or walls thicker than the moulded corner, would have a lower sensitivity and a lower EVSI.

## The error: valuing the test at EVPI

This is an illustration. When the team first discussed the drop test, the product manager presented the EVPI of **A$55,800** as "what the drop test is worth". The mechanical design engineer argued that a thorough test was better than a quick one and proposed a **3-week drop programme** on whole EVT-standard units with fabricated enclosures, at **A$36,000**. Against A$55,800 this looked like good value, and the team approved it.

Two things were wrong. First, the programme's full cost included 3 weeks on the critical path, because the tool order would wait for it: 36,000 + 3 × 25,000 = **A$111,000**. Second, EVPI is the value of a perfect test, and no real test reaches it. The approved programme cost about twice as much as perfect information could be worth.

The error was caught at the managing director's sign-off by a simple question: "what would we do differently depending on the result?" The answer was the same for the whole-unit programme as for the shell test: redesign the corner before tooling if it failed, and commit the tool if it passed. A more thorough test could only raise the sensitivity a little and lower the false-alarm rate a little, and the most it could add over the shell test's EVSI was the gap to EVPI, 55,800 − 43,800 = A$12,000. That was far less than the extra A$97,000 it cost over the parallel shell test. The programme was cancelled before any money was spent and replaced by the shell test, run in parallel. The whole-unit drop tests still had a place, later, in the DVT build, where the question was not whether to commit the tool but whether the moulded product met R3, and [Pass-fail tests: what a small sample can and cannot show](/reados/publications/prototypes-and-simulation-by-the-numbers/pass-fail-tests-and-small-samples/) takes up what those tests can show.

The business added the question to its test-approval form. Every proposed test now states the decision it informs, what the team would do after each result, and its full cost including any critical-path delay, and the approver compares that cost with the EVSI, never with the EVPI. The same discipline applies to rounds of iteration, the subject of [How many loops](/reados/publications/prototypes-and-simulation-by-the-numbers/how-many-loops/).

## Exercise: a lower prior

Suppose the mechanical design engineer's prior probability that the enclosure would fail R3 is **0.15** instead of 0.30, and everything else is unchanged: A$198,000 if it fails after tooling, A$12,000 for a redesign before tooling, sensitivity 0.80, false-alarm rate 0.10, and a test cost of A$14,000, plus A$25,000 if it delays the tool order by a week. What are the expected loss of committing now, the expected loss with the test, the EVSI, and the net value of the test in parallel and with the delay?

**Worked answer.** Committing now, the expected loss is 0.15 × 198,000 = **A$29,700**. With the test, the probability of a failed shell is 0.15 × 0.80 + 0.85 × 0.10 = 0.12 + 0.085 = 0.205, and the probability that the design fails after a passed shell is 0.15 × 0.20 ÷ 0.795 = 0.038. The expected loss is 0.205 × 12,000 + 0.795 × 0.038 × 198,000 = 2,460 + 5,940 = **A$8,400**. The EVSI is 29,700 − 8,400 = **A$21,300**, which agrees with the straight line, 150,000 × 0.15 − 1,200. Run in parallel, the test's net value is 21,300 − 14,000 = **A$7,300**, so it is still worth running. With a week's delay, its net value is 21,300 − 39,000 = **−A$17,700**, so it should be run only if it can be kept off the critical path.
