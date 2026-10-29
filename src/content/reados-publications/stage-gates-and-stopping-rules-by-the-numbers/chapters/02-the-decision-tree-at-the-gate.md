---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: the-decision-tree-at-the-gate
order: 2
title: "Expected value and the decision tree at the development gate"
description: "Three market states, Bayes' rule for a field signal and a rolled-back tree that values Gate 3 at A$323.1k, against a single-scenario paper that said stop at −A$868.2k."
draft: true
---

A gate decides whether to spend the next stage's money. To decide well, it needs to know what the programme is worth if the money is spent, and that worth depends on things nobody knows yet: whether the prototypes will work, what the field trial will show, and how many units the market will buy. A single "most likely" forecast hides all of that. A decision tree lays it out: the decisions the business will make later, the uncertain events between them, the probabilities and the payoffs, and then works backwards to a value for the decision being made today.

This chapter builds the tree for Corella's Gate 3, held on 4 August 2025, where the gatekeepers had to decide whether to spend A$560,000 developing two prototype booms. It explains expected value, sets out the three market states, uses Bayes' rule to turn a field-trial signal into revised probabilities, and rolls the tree back to a value of **A$323.1k**. It ends with the first Gate 3 paper, which used one scenario, reached the opposite answer, and was caught before the gate.

## Expected value is an average, not a forecast

The **expected value** of an uncertain payoff is the sum of each possible payoff multiplied by its probability. If a venture returns A$1,000 with probability 0.3 and loses A$200 with probability 0.7, its expected value is 0.3 × 1,000 + 0.7 × (−200) = A$160. The venture will never return A$160. It will return A$1,000 or lose A$200. The expected value is what the venture would average if the same decision could be made many times over, and it is the right yardstick for comparing choices when the amounts at stake are small enough that the business can absorb the bad outcomes.

That last condition matters. A business choosing by expected value is treating itself as a portfolio, accepting a likely small loss for a less likely large gain because, over many such decisions, the gains pay for the losses. If one bad outcome would break the business, expected value is not enough on its own, and the spread of outcomes must be looked at too. This chapter computes the expected values; Chapter 3 looks at the spread.

## Three market states and their payoffs

This is an illustration. All money is in Australian dollars excluding GST, and in this chapter the case values are shown in thousands with one decimal, as in "A$323.1k", so that the sums can be checked.

The SB36 sells at a list price of A$168,000 with a variable cost of A$116,000, a **contribution of A$52,000 a boom**. Corella values the payoff at the launch date over six selling seasons at 10% a year; the annuity factor for six years at 10% is **4.3553**. Rather than one sales forecast, the sales and dealer manager and the engineering manager agreed three **market states**, each a coherent story about how the market would respond.

```figure
type: compare
title: The three market states for the full SB36 boom
cols: Prior at Gate 3 | Booms a year | Contribution a year | PV of contribution | Launch NPV
caption: This is an illustration. PV is six seasons at 10% (annuity factor 4.3553); launch NPV deducts the A$1,800k launch cost. Medium barely pays for the launch; Low loses most of it.
- High | 0.25 | 40 | A$2,080k | A$9,058.9k | A$7,258.9k
- Medium | 0.40 | 8 | A$416k | A$1,811.8k | A$11.8k
- Low | 0.35 | 2 | A$104k | A$452.9k | −A$1,347.1k
- * Expected, on the prior | 1.00 | | | | A$1,348.0k
```

In the High state, 40 booms a year return 40 × 52 = A$2,080k a year, worth 2,080 × 4.3553 = A$9,058.9k at launch, or A$7,258.9k after the A$1,800k launch cost. The **prior** probabilities, 0.25, 0.40 and 0.35, are the gatekeepers' judgement at Gate 3, before any field evidence. They must add to 1, because exactly one state will turn out to be true.

The expected launch NPV on the prior is 0.25 × 7,258.9 + 0.40 × 11.8 + 0.35 × (−1,347.1) = **A$1,348.0k**. Launching looks attractive on average, but that average is carried almost entirely by the High state, which contributes A$1,814.7k of it, while Low takes away A$471.5k and the most likely single state, Medium, adds A$4.7k. Where the states, their volumes and their probabilities should come from, and how to check them against what similar products achieved, is the subject of [Building a demand forecast from its drivers](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/demand-from-drivers/) in *Demand and Benefit Forecasts by the Numbers*. For the stage costs themselves, the overrun allowances in [Uplifts and contingency: from a percentile to a budget](/reados/publications/reference-class-forecasting-by-the-numbers/uplifts-and-contingency/) in *Reference Class Forecasting by the Numbers* show how an outside view would adjust a budget like the A$560k for Stage 3.

## What the field season can tell: Bayes' rule

The field season in Stage 4 is designed to give a market signal, which the gatekeepers will classify as **Strong** or **Weak**. The signal is imperfect. Even in a High market a field season can go badly, and even in a Low market some growers will be enthusiastic. Corella's estimates of how often each state produces a Strong signal, the **likelihoods**, are:

- P(Strong | High) = 0.85
- P(Strong | Medium) = 0.45
- P(Strong | Low) = 0.10

Bayes' rule turns these into the probabilities the gate needs: the chance of a Strong signal, and the revised, or **posterior**, probability of each state after seeing it. Multiply each prior by its likelihood to get the joint probability of that state and a Strong signal: 0.25 × 0.85 = 0.2125, 0.40 × 0.45 = 0.1800, 0.35 × 0.10 = 0.0350. Their sum, **0.4275**, is P(Strong). Each posterior is its joint probability divided by that sum: 0.2125 ÷ 0.4275 = 0.4971 for High, and so on. The same steps with the complements of the likelihoods give the Weak branch.

```figure
type: compare
title: From prior to posterior with the field signal
cols: Prior | Joint with Strong | Posterior after Strong | Joint with Weak | Posterior after Weak
caption: This is an illustration. Each posterior is the joint probability divided by its column total. A Strong signal roughly doubles the weight on High; a Weak signal cuts it to about a quarter.
- High | 0.25 | 0.2125 | 0.4971 | 0.0375 | 0.0655
- Medium | 0.40 | 0.1800 | 0.4211 | 0.2200 | 0.3843
- Low | 0.35 | 0.0350 | 0.0819 | 0.3150 | 0.5502
- * Total | 1.00 | 0.4275 | 1.0000 | 0.5725 | 1.0000
- Expected launch NPV | A$1,348.0k | | A$3,502.9k | | −A$261.2k
```

The expected launch NPV after a signal can be computed straight from the joint probabilities, which avoids rounding the posteriors. After a Strong signal it is (0.2125 × 7,258.9 + 0.1800 × 11.8 + 0.0350 × (−1,347.1)) ÷ 0.4275 = 1,497.5 ÷ 0.4275 = **A$3,502.9k**. After a Weak signal it is (0.0375 × 7,258.9 + 0.2200 × 11.8 + 0.3150 × (−1,347.1)) ÷ 0.5725 = −149.5 ÷ 0.5725 = **−A$261.2k**. The signal does what it is paid for: it separates a launch worth making from one that is not. [Thinking in probabilities: degrees of belief for better decisions](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) explains Bayes' rule from the beginning, with a simpler example.

## Building the tree at Gate 3

A decision tree has two kinds of node. A **decision node**, drawn as a square, is a point where the business chooses. A **chance node**, drawn as a circle, is a point where something uncertain happens. Branches leave each node to the right: choices from a decision node, outcomes with their probabilities from a chance node. Payoffs and costs sit on the branches or at the ends.

At Gate 3 the sequence is: decide whether to spend A$560k on Stage 3; find out at Gate 4 whether the prototypes pass, judged at Gate 3 to have a **0.75** chance; if they pass, decide whether to spend A$320k on the field season; see a Strong or Weak signal; then decide at Gate 5 whether to launch for A$1,800k; then the market state is revealed.

```figure
type: tree
title: The Gate 3 decision tree, rolled back
caption: This is an illustration. Values in A$k at each node after roll-back; Stage 1 and 2 spending (A$220k) is sunk and excluded. Development spending inside the nine months to Gate 5 is not discounted, a stated simplification.
- * Gate 3 decision: spend A$560k on Stage 3 | value −560 + 0.75 × 1,177.5 = 323.1; stopping now is worth 0
  - Technical fail at Gate 4, p 0.25 | stop: 0 further
  - Technical pass at Gate 4, p 0.75 | Gate 4 decision: spend A$320k on the field season, value 1,177.5
    - Strong signal, p 0.4275 | Gate 5 decision: launch, EV 3,502.9
      - High, posterior 0.4971 | launch NPV 7,258.9
      - Medium, posterior 0.4211 | launch NPV 11.8
      - Low, posterior 0.0819 | launch NPV −1,347.1
    - Weak signal, p 0.5725 | Gate 5 decision: stop, 0 (launch would be −261.2)
```

## Rolling back from the right

A tree is solved from the right-hand end, a procedure called **roll-back**. At each chance node, replace the branches by their expected value. At each decision node, replace the choices by the best of them. Then move one step left and repeat.

```figure
type: formula
title: Rolling back the Gate 3 tree
formula: value at a chance node = Σ probability × value of branch; value at a decision node = best branch
caption: This is an illustration. Values in A$k. Each step uses only the values to its right, so the later decisions are built into the earlier value.
- EV after Strong | posterior-weighted launch NPVs, 0.4971, 0.4211 and 0.0819: 3,502.9, so launch
- EV after Weak | −261.2, worse than stopping at 0: stop
- V4, at Gate 4 | −320 + 0.4275 × 3,502.9 + 0.5725 × 0
- Gate 3 | −560 + 0.75 × V4 + 0.25 × 0
step: V4 = −320 + 1,497.5 = 1,177.5
step: Gate 3 value = −560 + 0.75 × 1,177.5 = −560 + 883.1 = 323.1
```

The Gate 5 decisions come first. After a Strong signal, launching is worth A$3,502.9k against 0 for stopping, so the business would launch. After a Weak signal, launching is worth −A$261.2k, so the business would stop and the branch is worth 0. Moving left, the value at Gate 4 of going into the field season is **V4 = A$1,177.5k**. Moving left again, the value at Gate 3 of spending A$560k on Stage 3 is **A$323.1k**. Stopping at Gate 3 is worth 0, so the gate should say go.

Two rules are built into those numbers. The A$220k already spent on Stages 1 and 2 does not appear anywhere: it is spent whichever branch is taken, so it cannot change which branch is best. And the figures are before tax and ignore any R&D Tax Incentive offset administered by the ATO with the Department of Industry, Science and Resources; including tax would change the amounts but, in this case, not the structure of the tree.

## The outcomes behind A$323.1k

The value of A$323.1k is an expected value, and none of the outcomes is anywhere near it. Seen from Gate 3, there are five ways the programme can end.

```figure
type: bars
title: The five ways the staged programme can end, seen from Gate 3
unit: A$'000
max: 6400
caption: This is an illustration. Probabilities in brackets; values exclude the sunk A$220k. The probability-weighted sum is A$323.1k, although 84.1% of outcomes lose money.
- Technical fail, stop (p 0.2500) | -560.0
- Pass, Weak signal, stop (p 0.4294) | -880.0
- * Pass, Strong, launch, High (p 0.1594) | 6378.9
- Pass, Strong, launch, Medium (p 0.1350) | -868.2
- Pass, Strong, launch, Low (p 0.0262) | -2227.1
```

The probability of each outcome is the product of the probabilities along its path: for Strong then High, 0.75 × 0.4275 × 0.4971 = 0.1594. The value of each is the sum of the cash along it: for Strong then High, −560 − 320 + 7,258.9 = A$6,378.9k. The five probabilities add to 1, and the five values weighted by their probabilities add to A$323.1k, which is a useful check on the roll-back. The chance of making money is only 15.9%, the High-after-Strong branch. The programme is worth doing because that branch is very large and because the gates cap the losses on the others at A$560k or A$880k in most cases. Seen from Gate 3, the chance of reaching a full launch at all is 0.75 × 0.4275 = 0.3206, which is where Chapter 1's 0.6794 chance of no launch came from.

## The error: one scenario, and probabilities that did not add up

This is an illustration. The first draft of the Gate 3 paper, prepared by the engineering manager's team in July 2025, did not use a tree. It costed the programme in the "most likely" market, Medium: Stage 3 A$560k, Stage 4 A$320k, launch A$1,800k, against a present value of A$1,811.8k. The result was −560 − 320 − 1,800 + 1,811.8 = **−A$868.2k**, and the paper recommended stopping. The sales and dealer manager responded with a High-case version: −560 − 320 − 1,800 + 9,058.9 = **+A$6,378.9k**. The draft also gave the three states probabilities of 0.30, 0.45 and 0.35, which add to 1.10.

```figure
type: compare
title: The Gate 3 programme valued three ways
cols: Value in A$k | What it assumes | Recommendation
caption: This is an illustration. Both single scenarios assume the business will launch whatever it learns; only the tree lets the later gates stop the programme when the evidence is bad.
- "Most likely" Medium only | −868.2 | the market is Medium for certain; launch regardless | stop
- High case only | +6,378.9 | the market is High for certain; launch regardless | go
- * Decision tree | +323.1 | three states with probabilities; stop at Gate 4 or 5 if the evidence is bad | go
```

The independent board adviser, reading the draft before the gate, asked two questions: what is the range of outcomes, and how likely is each? The answers showed that both papers had the same flaw. Each assumed a single state for certain and, without saying so, assumed that Corella would spend all A$2,680k whatever it learned along the way. In fact the programme's later gates exist precisely so that the business does not launch into a Medium or Low market if the field season says it is probably there. The probability error was simpler: a set of states of which exactly one will occur must have probabilities adding to 1, and the 0.30 for High had been carried over from an earlier draft without reducing anything else. The sales and dealer manager and the engineering manager agreed 0.25, 0.40 and 0.35, and the corrected paper presented the tree and its value of A$323.1k. Gate 3 said go.

Single-scenario appraisals are common because they are easy to explain, and a "most likely" case sounds prudent. The case shows why they mislead at a gate. The most likely state contributes almost nothing to the expected value; the decision turns on the unlikely large outcome and on the later gates' power to avoid the bad ones, and a single scenario can show neither.

## What the tree does not do

The tree is only as good as its inputs, and every one of them here is a judgement: the 0.75 technical pass probability, the priors, the likelihoods of the field signal, the volumes in each state and the launch cost. Decision analysis, as Howard (1988) described its practice, is a way of making those judgements explicit so that they can be examined, argued about and improved, not a way of making them disappear. Chapter 4 asks how much better information about the market is worth; Chapter 3 uses the same tree to value the right to stop.

Before a tree goes to a gate, four checks catch most of the mistakes that make one misleading. The probabilities leaving every chance node must add to 1: 0.25 and 0.75 at Gate 4, 0.4275 and 0.5725 for the signal, and each set of posteriors. The outcome table must reproduce the rolled-back value: here the five outcomes, weighted by their probabilities, return A$323.1k. Each cost must appear exactly once on every path that incurs it: the A$320k field season sits on the pass branch only, and the launch cost sits inside the launch NPVs, not on the branch as well. And each decision must use only what is known when it is made: the Gate 5 choice depends on the signal, never on the market state, which is revealed only after launch. A tree that passes all four can still rest on poor judgements, but it will not contain arithmetic that nobody intended.

## Exercise: a less certain prototype

The engineering manager argues that the camera supplier's new sensor makes the prototypes riskier than the gatekeepers assumed, and that the chance of passing at Gate 4 is 0.6, not 0.75. Everything else stays the same. What is the value of the programme at Gate 3, and at what technical pass probability would the gate be indifferent between going on and stopping?

**Worked answer.** Nothing to the right of Gate 4 changes, so V4 is still A$1,177.5k. The Gate 3 value becomes −560 + 0.6 × 1,177.5 = −560 + 706.5 = **A$146.5k**: still positive, so the gate should still say go, but the margin has more than halved. The gate is indifferent when −560 + p_T × 1,177.5 = 0, which gives p_T = 560 ÷ 1,177.5 = **0.4756**. A gatekeeper who believes the prototypes have less than about a 48% chance of passing should vote to stop. Expressing the break-even as a probability is useful in itself: it turns a debate about a number nobody can know precisely into a question that people can answer, namely whether they believe the chance is above or below about one in two.
