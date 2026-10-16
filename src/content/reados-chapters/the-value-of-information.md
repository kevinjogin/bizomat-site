---
title: "The value of information: when is it worth finding out more?"
description: "Information is only valuable if it could change your decision. How to calculate the value of information, judge whether a test is worth its cost, and avoid analysis that changes nothing."
publishDate: 2026-10-03
category: "Business"
tags:
  - strategy
  - validation
  - experimentation
author: "GoCore"
featured: false
draft: false
---

Before almost any significant decision, there is a temptation to gather more information: another market study, another round of customer interviews, another quote, another test, another month of data. Sometimes this is wise. Often it is not. Information costs time and money, delays action, and in many cases would not change the decision anyway.

Decision theory offers a precise way to think about this trade-off, called the **value of information**. The central idea is simple: information is valuable only to the extent that it could lead you to make a better decision. If every possible result of a test would leave you choosing the same action, the test is worth nothing, however interesting its results might be.

This article explains the value of information as described in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray, works through detailed business examples, and offers practical rules for deciding when to gather more information and when to act. It builds on [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/) and is part of GoCore's series on decision making.

## The core idea

The value of information compares two situations:

1. **Deciding now**, using current beliefs, and choosing the action with the highest expected utility.
2. **Observing first**, then choosing the best action given what was observed.

The value of information is the improvement in expected utility from observing first, averaged over all the results the observation might produce.

Two properties follow immediately.

**The value of information is never negative.** In principle, you can always ignore information that turns out not to help, so having it cannot make your decision worse. (In practice, information can be costly, misleading or tempting to misuse, which is why its cost must be counted separately.)

**Information that cannot change the decision has zero value.** If the best action is the same whatever the result, observing adds nothing to the decision. The book gives a medical illustration: if the right decision is to treat a patient regardless of a test's outcome, the test has no value for that decision.

The value of information captures only the benefit. The **cost** of gathering it, in money, time, effort or risk, must be subtracted. Information is worth gathering when its value exceeds its cost.

## A worked example: should we test the market first?

This is an illustration with round numbers.

A business is considering launching a new product. Based on current knowledge:

- There is a 50% chance that demand will be strong. If it is, launching earns a profit of $200,000.
- There is a 50% chance that demand will be weak. If it is, launching loses $100,000.
- Not launching earns nothing.

For simplicity, assume the business is risk neutral, so expected profit stands in for expected utility.

### Deciding now

| Action | Calculation | Expected profit |
| --- | --- | --- |
| Launch | 0.5 × $200,000 − 0.5 × $100,000 | $50,000 |
| Do not launch | — | $0 |

The best decision without further information is to launch, with an expected profit of $50,000.

### The value of perfect information

Suppose a perfect market test could reveal exactly whether demand will be strong or weak. The business would launch if demand is strong ($200,000) and not launch if it is weak ($0).

Expected profit with perfect information = 0.5 × $200,000 + 0.5 × $0 = $100,000.

The **expected value of perfect information** is $100,000 − $50,000 = **$50,000**. No test, however good, is worth more than $50,000 for this decision. This upper bound is useful on its own: it immediately rules out expensive studies.

### The value of an imperfect test

Real tests are imperfect. Suppose a small trial launch costs $15,000 and correctly indicates strong demand 80% of the time when demand is strong, and correctly indicates weak demand 80% of the time when demand is weak.

First, how likely is each test result?

- Probability the test says "strong" = 0.5 × 0.8 + 0.5 × 0.2 = 0.5.
- Probability the test says "weak" = 0.5.

Next, using Bayes' rule (explained in [Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/)), how likely is strong demand given each result?

- If the test says "strong": probability of strong demand = 0.4 ÷ 0.5 = 80%.
- If the test says "weak": probability of strong demand = 0.1 ÷ 0.5 = 20%.

Now the best decision after each result:

| Test result | Expected profit if launch | Best action | Value |
| --- | --- | --- | --- |
| "Strong" | 0.8 × $200,000 − 0.2 × $100,000 = $140,000 | Launch | $140,000 |
| "Weak" | 0.2 × $200,000 − 0.8 × $100,000 = −$40,000 | Do not launch | $0 |

Expected profit with the test = 0.5 × $140,000 + 0.5 × $0 = $70,000.

The **value of the test** is $70,000 − $50,000 = **$20,000**.

Since the trial costs $15,000, it is worth running, with a net gain of $5,000 in expected terms. If it cost $25,000, it would not be worth it, even though it is informative.

### Why the test has value

The test has value only because a "weak" result would change the decision from launching to not launching, avoiding a likely loss. If the launch were attractive even when demand was weak, for example if weak demand still produced a small profit, the test would have no value for the launch decision, however accurate it was.

## Practical rules from the theory

### Ask what you would do with each possible answer

Before commissioning research, write down what you would decide under each plausible result. If the answers are all the same, the research will not change the decision. It may still have other uses, such as convincing stakeholders or planning later steps, but its decision value is zero.

### Calculate the ceiling first

The value of perfect information sets an upper limit on what any information is worth. It is often easy to estimate, and it quickly rules out expensive studies for modest decisions.

### Prefer information about the uncertainties that matter

Not all uncertainties affect a decision equally. Information is most valuable when it concerns uncertainties that are large and that would change the best action. Learning precisely about something that hardly affects the outcome is wasted effort.

### Count all the costs

The cost of information includes money, time, staff effort and delay. Delay can be particularly costly: a competitor might move first, a season might pass, or a customer might choose another supplier.

### Choose observations in sequence

When several pieces of information are available, the book describes a practical approach: calculate the value of each possible observation, subtract its cost, gather the one with the highest net value, update beliefs, and repeat until no remaining observation is worth its cost. This step-by-step approach is a heuristic rather than a guarantee of the best sequence, but it is sensible and practical. Truly optimal sequences of observations can be found with the sequential decision methods described later in this series.

## The value of information in everyday business

| Situation | Information option | When it is worth it |
| --- | --- | --- |
| New product launch | Small trial, pre-orders, customer interviews | When a poor result would stop or reshape the launch |
| Hiring | Work sample, reference checks, trial period | When results could change the hiring decision |
| Equipment purchase | Demonstration, trial rental, independent inspection | When reliability is uncertain and the cost is significant |
| New supplier | Sample order, site visit | When a bad result would lead you to choose another supplier |
| Pricing change | Test in one region or channel | When the response could make you reverse the change |
| Machine maintenance | Condition monitoring or inspection | When findings would change whether or when to service |

In each case, the test is the same: could the information change what you do, and is that change worth more than the cost of finding out?

## Information and reversibility

The value of information interacts with how reversible a decision is. For easily reversible decisions, acting now and learning from the results can be cheaper than studying in advance: the action itself becomes the experiment. For irreversible decisions, such as signing a long lease, building a factory or committing to a large inventory, information gathered beforehand is more valuable, because mistakes cannot easily be undone.

This is closely related to the trade-off between exploring and exploiting, covered in [Explore or exploit?](/reados/collections/competitive-strategy-and-positioning/explore-or-exploit/).

## Information when risk matters

The worked example assumed the business was risk neutral. For a risk-averse decision maker, the value of information is often higher than the dollar calculation suggests. Information that helps avoid a large loss is particularly valuable to someone for whom large losses are especially harmful, because it reduces the chance of the outcome they fear most.

This is one reason small businesses often benefit from cheap tests before major commitments. A $100,000 loss might be survivable for a large company but threatening for a small one. Using utilities rather than dollar amounts in the calculation, as described in [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/), captures this effect.

## Building the habit in a team

The value of information becomes most useful when it is part of how a team plans, rather than an occasional calculation. A few simple practices help:

- **Write the decision first.** Before approving research or testing, record the decision it supports and the options under consideration.
- **Write the decision rule.** State in advance what result would lead to each option. This prevents reinterpreting results afterwards.
- **Set an information budget.** For each decision, agree a rough limit on the money and time worth spending on information, guided by the value of perfect information.
- **Review afterwards.** Once outcomes are known, check whether the information gathered actually changed decisions. Over time, this shows which kinds of research earn their keep.

## When people gather too much or too little information

**Too much.** Organisations sometimes commission studies to delay uncomfortable decisions, to spread responsibility, or because gathering information feels productive. Analysis that cannot change the decision is a cost without a benefit.

**Too little.** People sometimes act on strong intuitions without checking cheap, informative evidence. A few customer conversations or a small trial can prevent expensive mistakes.

**The wrong kind.** Effort often goes into precise information about familiar uncertainties, while the largest, most decision-relevant uncertainty goes unexamined because it is harder to study.

## A worked illustration

This is an illustration, not a real business.

A small engineering firm is deciding whether to buy a $90,000 machine that would bring a type of work in-house. The owner considers commissioning a detailed market study, costing $12,000, to estimate demand for the new work.

The owner first asks what the study could change. Current estimates suggest the machine pays for itself in about two years if demand is moderate, and even at the low end of plausible demand it would pay back within four years, well within its working life. At the high end it pays back within a year. Under every plausible result, buying the machine remains the right decision.

The study has little value for this decision. Instead, the owner spends a few hundred dollars on a short trial rental to confirm that the machine handles the firm's typical materials well, which is the one uncertainty that could change the decision, and then buys the machine.

## Common mistakes

**Gathering information that cannot change the decision.** Its decision value is zero.

**Ignoring the cost of delay.** Waiting for information has a price.

**Overvaluing precision.** Information about small uncertainties adds little.

**Undervaluing cheap tests.** Inexpensive evidence about a key uncertainty can be extremely valuable.

**Treating any test as perfect.** Imperfect tests are worth less; account for their error rates.

## Questions to ask

- What would we decide under each possible result of this information?
- What is the most any information could be worth for this decision?
- Which uncertainty, if resolved, would most likely change our choice?
- What does gathering this information cost, including delay?
- For your own business: which upcoming decision would most benefit from a small, cheap test?

## Bringing it together

The value of information is the improvement in decision quality that information makes possible. It is never negative, it is zero when no result could change the decision, and it must be weighed against the full cost of gathering the information, including delay.

Calculating it, even roughly, transforms how research and testing are planned. The disciplined questions are simple: what would we do with each answer, what is the most any answer could be worth, and does this information cost less than that?

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; figures in the examples are illustrations. This article is general information, not professional advice.*
