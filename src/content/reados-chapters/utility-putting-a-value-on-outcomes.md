---
title: "Utility: putting a value on outcomes when choices are uncertain"
description: "Expected value is not enough when outcomes are risky. How utility theory, rational preferences, risk attitudes and the maximum expected utility principle help make consistent choices."
publishDate: 2026-10-03
category: "Business"
tags:
  - strategy
  - finance
  - validation
author: "GoCore"
featured: false
draft: false
---

Imagine being offered a choice: receive $50,000 for certain, or take a 50% chance of receiving $120,000 and a 50% chance of receiving nothing. The gamble has a higher expected value, $60,000, yet many people would take the certain $50,000. Are they being irrational?

Not necessarily. For most people, the difference between having nothing and having $50,000 matters far more than the difference between $50,000 and $120,000. The first $50,000 might clear a debt or secure a home; the next $70,000 is welcome but less essential. A sensible way to choose must account for how much outcomes actually matter, not just their dollar amounts.

This is the role of **utility**: a measure of how desirable outcomes are to a particular decision maker. Utility theory, combined with probability, provides the foundation for rational decision making under uncertainty. This article explains the ideas as presented in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray: the requirements of rational preferences, utility functions, risk attitudes, how utilities can be measured, the maximum expected utility principle, and decision networks. It is part of GoCore's series on decision making.

## Preferences and lotteries

Decision theory describes uncertain choices as **lotteries**: sets of possible outcomes, each with a probability. "50% chance of $120,000, 50% chance of nothing" is a lottery. So is "launch the product: 40% chance of strong sales, 60% chance of weak sales". A certain outcome is simply a lottery with one outcome at 100%.

A decision maker has **preferences** between lotteries: they prefer one, prefer the other, or are indifferent between them.

## The requirements of rational preferences

The mathematicians John von Neumann and Oskar Morgenstern showed that if preferences satisfy a few reasonable requirements, they can be represented by a utility function, and the best choice is always the one with the highest expected utility. The requirements are often summarised as:

- **Completeness:** for any two options, the decision maker either prefers one or is indifferent. They do not simply refuse to compare.
- **Transitivity:** if A is preferred to B, and B to C, then A is preferred to C.
- **Continuity:** if A is preferred to B and B to C, there is some probability at which a lottery between A and C is exactly as good as B for certain.
- **Independence:** if A is preferred to B, then mixing each with the same third option, in the same proportions, does not reverse the preference.

These requirements look almost obvious, which is the point: they describe what most people would agree consistent preferences should look like.

### Why consistency matters: the money pump

Consider someone whose preferences violate transitivity: they prefer A to B, B to C, and C to A. They would pay a small amount to swap C for B, then to swap B for A, then to swap A for C, and so on, ending where they started but poorer each time. This thought experiment, sometimes called a **money pump**, shows why consistent preferences matter: inconsistent ones can be exploited, or simply lead to wasted effort.

In organisations, inconsistent preferences often appear when different people or committees decide related questions separately, each with its own priorities. Making the trade-offs explicit is the remedy.

## Utility functions

A **utility function** assigns a number to each outcome, reflecting how desirable it is. The numbers matter only relative to each other: utility is usually scaled so that the worst relevant outcome has utility 0 and the best has utility 1, though any consistent scale works.

The **expected utility** of a lottery is the sum of the utilities of its outcomes, each weighted by its probability.

### Utility of money

For money, utility usually increases more slowly as wealth increases. Each additional dollar adds less utility than the one before. This idea, **diminishing marginal utility**, was proposed by Daniel Bernoulli in the eighteenth century and is widely accepted.

Return to the opening example, using an illustrative utility function in which utility is the square root of the dollar amount:

| Option | Calculation | Expected utility |
| --- | --- | --- |
| $50,000 for certain | √50,000 | about 224 |
| 50% chance of $120,000 | 0.5 × √120,000 + 0.5 × √0 | about 173 |

The certain amount has higher expected utility, so this decision maker rationally prefers it, despite the gamble's higher expected value.

```figure
type: line
title: Diminishing utility of money: utility = √$
x: Dollars ($'000)
y: Utility
ymin: 0
ymax: 360
mark: 50 | certain $50,000: 224
mark: 30 | gamble's certainty equivalent
caption: The gamble's expected utility (about 173) equals the utility of about $30,000 for certain, so this decision maker takes the certain $50,000.
- 0 | 0
- 10 | 100
- 30 | 173
- 50 | 224
- 80 | 283
- 120 | 346
```

The **certainty equivalent** of a lottery is the certain amount with the same utility. For this decision maker, the gamble is worth about $30,000 for certain (because √30,000 ≈ 173). They would accept any certain offer above $30,000 in place of the gamble.

## Risk attitudes

Utility functions capture **risk attitudes**:

- **Risk averse:** prefers a certain outcome to a lottery with the same expected value. Utility curves bend downward. Most people and most businesses are risk averse for large amounts.
- **Risk neutral:** indifferent between a certain outcome and a lottery with the same expected value. Utility is a straight line in money. Large organisations making many small, independent decisions can often act as if risk neutral, because the outcomes average out.
- **Risk seeking:** prefers the lottery. Utility curves bend upward. This is rare as a general attitude, though people sometimes behave this way when facing losses.

Risk attitude depends on circumstances. A small business might reasonably be risk averse about a decision that could bankrupt it, while being close to risk neutral about routine purchases. The same $50,000 loss means something very different to a business with $5 million in reserves than to one with $60,000.

### Common utility shapes

The book describes several standard forms. **Quadratic** and **exponential** utility functions are mathematically convenient ways to represent risk aversion, with a single parameter controlling how strongly risk is avoided. **Power** and **logarithmic** utility functions represent attitudes where the importance of a gain depends on the size of current wealth. The choice of form matters less than the habit of thinking explicitly about how outcomes should be valued.

## Measuring utility

How can a utility function be established for a particular person or organisation? The book describes **utility elicitation**: asking questions about preferences between simple lotteries.

A common method works as follows:

1. Identify the best outcome (utility 1) and worst outcome (utility 0) under consideration.
2. For an intermediate outcome, ask: "At what probability p would you be indifferent between this outcome for certain and a lottery with a probability p of the best outcome and 1 − p of the worst?"
3. The answer p is the utility of the intermediate outcome.

For example, if a business owner would be indifferent between a certain profit of $40,000 and a lottery with a 70% chance of $150,000 profit and a 30% chance of a $50,000 loss, then the utility of a $40,000 profit, on a scale where a $50,000 loss is 0 and a $150,000 profit is 1, is 0.7.

Repeating this for several outcomes traces out a utility curve.

### Practical cautions

People find these questions hard, and their answers can be inconsistent or influenced by how questions are phrased. The article [Framing, certainty and the limits of rational choice](/reados/collections/judgement-markets-and-learning/framing-certainty-and-the-limits-of-rational-choice/) explains why. Asking several questions in different ways, checking for consistency and discussing discrepancies produces more reliable results.

## Multiple objectives

Many decisions involve several objectives: profit, risk, time, quality, safety, reputation, wellbeing. **Multiple-attribute utility** combines them, often as a weighted sum of separate utilities for each objective. The weights express the trade-offs: how much profit would you give up for a given reduction in risk, or a given improvement in quality?

Setting these weights explicitly is uncomfortable but valuable. Without them, trade-offs are made implicitly and inconsistently, and different people in the same organisation may pull in different directions. The article [Be careful what you reward](/reados/collections/decision-making-machines/be-careful-what-you-reward/) explores this further.

## Outcomes over time

Many outcomes arrive over time rather than all at once: a stream of profits from an investment, a series of savings from a new process, or ongoing costs from a lease. Decision makers usually value near-term outcomes more than distant ones, because distant outcomes are less certain and because resources available sooner can be put to other uses.

A common way to reflect this is **discounting**: multiplying each future outcome by a factor that shrinks the further away it is. With a discount factor of 0.9 per year, $100 received in one year counts as $90 today, and $100 in five years counts as about $59. Choosing a discount rate is itself a value judgement, and different choices can change which option looks best. Sequential decision methods, described in [Sequential decisions](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/), build discounting in directly.

## The maximum expected utility principle

The **maximum expected utility principle** states that a rational agent should choose the action with the highest expected utility, given its beliefs about the probabilities of outcomes. It combines the two foundations of decision theory: probability for beliefs, and utility for preferences.

In practice, applying the principle requires:

1. listing the available actions
2. identifying the possible outcomes of each, and their probabilities
3. assigning utilities to the outcomes
4. calculating expected utility for each action
5. choosing the highest

```figure
type: steps
title: Applying the maximum expected utility principle
caption: The arithmetic is simple; the judgement lies in the probabilities and utilities.
- List the actions
- Identify outcomes and probabilities
- Assign utilities to outcomes
- Calculate expected utility
- *Choose the highest
```

## Decision networks

A **decision network** extends a Bayesian network (explained in [Bayesian networks](/reados/collections/decision-making-machines/bayesian-networks-cause-and-evidence/)) with two additional kinds of node:

- **decision nodes**, representing choices the agent controls
- **utility nodes**, representing the value of outcomes

Chance nodes represent uncertain variables, as before. Arrows show which variables influence outcomes and which information is available when decisions are made.

The book uses a medical example: deciding whether to treat a patient, given test results that are imperfect indicators of disease. The decision network combines the probability of disease given the test results with the utilities of treating or not treating a patient with or without the disease, and identifies the action with the highest expected utility.

The same structure suits business decisions: whether to recall a product given quality test results, whether to extend credit given a customer's payment history, or whether to replace a machine given condition readings.

## A worked illustration

This is an illustration, not a real business.

A small manufacturer must choose between two projects with the same expected profit:

- **Project A:** a 90% chance of $100,000 profit and a 10% chance of a $100,000 loss. Expected value: $80,000.
- **Project B:** a certain $80,000 profit, but it ties up the main machine for three months, delaying other work.

On expected value alone, they are equal, before considering the delay. But a $100,000 loss would force the business to draw on its overdraft and delay paying suppliers, which the owner considers very harmful. Through a few elicitation questions, the owner establishes that a $100,000 loss has utility far below what a straight-line scale would suggest.

Taking risk aversion into account, Project B has the higher expected utility even after allowing for the delay. The owner chooses B and records the reasoning, which helps the team understand why the apparently "safer but slower" option was chosen.

```figure
type: compare
title: Equal expected value, unequal utility
cols: Project A | Project B
best: 2
caption: A $100,000 loss would force overdraft use and late supplier payments, so its utility sits far below a straight line.
- Outcomes | 90%: +$100,000; 10%: −$100,000 | Certain +$80,000
- Expected value | $80,000 | $80,000, before the delay
- Downside | Survival-threatening loss | Main machine tied up three months
- Risk-averse choice | Lower expected utility | Higher expected utility
```

## Common mistakes

**Choosing on expected value alone when stakes are large.** Risk attitude matters when losses could be severe.

**Leaving trade-offs implicit.** Unstated weights lead to inconsistent decisions.

**Assuming everyone shares the same risk attitude.** Owners, managers and investors may differ.

**Treating elicited utilities as precise.** They are approximations; check consistency.

**Ignoring the money pump.** Inconsistent preferences waste resources over many decisions.

## Questions to ask

- What are the possible outcomes, and how much does each genuinely matter?
- Could any outcome threaten the survival of the business?
- What is our risk attitude for decisions of this size?
- What trade-offs between objectives are we willing to make, explicitly?
- For your own business: what certain amount would you accept in place of your riskiest current opportunity?

## Bringing it together

Utility theory provides a principled way to value uncertain outcomes. If preferences are complete, transitive, continuous and independent, they can be represented by a utility function, and the rational choice is the action with the highest expected utility. Utility functions capture risk attitudes, explaining why a certain $50,000 can rightly be preferred to a gamble worth more on average.

Utilities can be measured through simple lottery questions, combined across multiple objectives and built into decision networks alongside probabilities. Even without formal calculation, the habits of utility thinking (valuing outcomes by how much they matter, making trade-offs explicit and taking risk seriously) lead to more consistent decisions.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; figures in the examples are illustrations. This article is general information, not financial or professional advice.*
