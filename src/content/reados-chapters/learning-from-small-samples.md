---
title: "Learning from small numbers: estimating rates with Bayesian thinking"
description: "How to estimate conversion rates, defect rates and success rates when you only have a little data, using priors, pseudo-counts and honest uncertainty instead of misleading percentages."
publishDate: 2026-10-03
category: "Business"
tags:
  - validation
  - experimentation
  - customers
author: "GoCore"
featured: false
draft: false
---

Small businesses and new ventures constantly face decisions based on very little data. A new product page has had 40 visitors and 3 purchases. A new supplier has delivered 25 batches without a defect. A sales approach has won 2 of the first 5 proposals. A trial has had 8 participants, of whom 6 liked the product.

The obvious response is to calculate a percentage: 7.5% conversion, 0% defects, 40% win rate, 75% approval. But percentages from small samples can be badly misleading. Zero defects in 25 batches does not mean the supplier never makes mistakes. A 40% win rate from five proposals could easily turn out to be 15% or 60% in the long run.

This article explains a better approach, based on the methods for learning model parameters described in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. It covers maximum likelihood estimation, Bayesian estimation with priors, the idea of pseudo-counts, how to express uncertainty honestly, and how to use these ideas in practical business decisions. It is part of GoCore's series on decision making.

## The problem with raw percentages

The simplest estimate of a rate is the number of successes divided by the number of trials. This is called the **maximum likelihood estimate**, because it is the rate that makes the observed data most likely.

With plenty of data, maximum likelihood estimates work well. With small samples, they have two serious problems.

**They can be extreme.** Zero successes produce an estimate of 0%; all successes produce 100%. Neither is usually believable. A supplier with no defects in 25 batches is unlikely to be perfect; a product liked by all four people who tried it is unlikely to be universally loved.

**They hide uncertainty.** "40%" sounds equally precise whether it comes from 2 of 5 or from 400 of 1,000. In reality, the first is barely informative, while the second is quite reliable.

## Bayesian estimation

The Bayesian approach treats the unknown rate itself as uncertain, and represents that uncertainty with a probability distribution. It starts with a **prior** distribution that reflects what was believed before the data, and updates it with the observed data to produce a **posterior** distribution.

For rates of yes-or-no outcomes (purchase or not, defect or not, win or lose), the natural choice of distribution is the **beta distribution**. It has a convenient property: updating it with new data is as simple as adding counts.

### Pseudo-counts

A beta distribution can be described by two numbers, often written α (alpha) and β (beta). They can be thought of as **pseudo-counts**: imaginary successes and failures that represent prior belief.

- A prior of α = 1 and β = 1 represents complete uncertainty: every rate from 0% to 100% is considered equally plausible. It is like having seen one success and one failure before starting.
- A prior of α = 2 and β = 98 represents a belief that the rate is around 2%, held about as firmly as if 100 previous trials had been observed.

After observing new data, the posterior simply adds the observed successes to α and the observed failures to β. The estimated rate, the **posterior mean**, is α ÷ (α + β).

### Example: a new product page

This is an illustration.

A product page has had 40 visitors and 3 purchases.

- **Maximum likelihood:** 3 ÷ 40 = 7.5%.
- **Bayesian with a uniform prior (1, 1):** posterior is (1 + 3, 1 + 37) = (4, 38). Posterior mean = 4 ÷ 42 ≈ 9.5%.

The Bayesian estimate is pulled slightly towards the middle, reflecting the limited data. More importantly, the posterior distribution shows a wide range of plausible rates: the true conversion rate could reasonably be anywhere from around 3% to 20%.

Now suppose the business has run similar product pages before, which typically converted at around 4%. It could use an informed prior such as (2, 48), equivalent to 50 previous visitors with 2 purchases.

- **Bayesian with an informed prior (2, 48):** posterior is (2 + 3, 48 + 37) = (5, 85). Posterior mean = 5 ÷ 90 ≈ 5.6%.

The informed prior pulls the estimate towards what similar pages have achieved, which is usually more realistic for a small sample. As more data arrives, the observed data dominates and the prior matters less.

### Example: a supplier with no defects

This is an illustration.

A new supplier has delivered 50 batches with no defects.

- **Maximum likelihood:** 0 ÷ 50 = 0%.
- **Bayesian with a uniform prior (1, 1):** posterior (1, 51). Posterior mean = 1 ÷ 52 ≈ 1.9%.
- **Bayesian with an industry prior (2, 98), suggesting about 2%:** posterior (2, 148). Posterior mean = 2 ÷ 150 ≈ 1.3%.

The Bayesian estimates recognise that a clean record over 50 batches is encouraging but not proof of perfection.

A useful rule of thumb from statistics, sometimes called the **rule of three**, says that if an event has not happened in n independent trials, a reasonable upper limit for its rate (at about 95% confidence) is roughly 3 ÷ n. For 50 batches, that is about 6%. Zero defects in 50 batches is entirely consistent with a true defect rate of several per cent.

## Expressing uncertainty honestly

The posterior distribution allows uncertainty to be stated clearly. Instead of "the conversion rate is 7.5%", a business can say "our best estimate is about 9%, and it is plausibly between 3% and 20%". That statement is more honest and more useful for decisions.

The width of the plausible range shrinks as data grows. Roughly speaking, quadrupling the amount of data halves the width of the range. This is a helpful guide to how much more data a decision needs.

| Data observed | Simple percentage | Plausible range (approximate) |
| --- | --- | --- |
| 2 wins from 5 | 40% | roughly 12% to 78% |
| 20 wins from 50 | 40% | roughly 28% to 54% |
| 200 wins from 500 | 40% | roughly 36% to 44% |

(Ranges are approximate, for illustration, and depend on the method used.)

The same headline percentage carries very different weight depending on the amount of evidence behind it.

## How much data is enough?

There is no universal sample size that makes a decision safe. The right amount of data depends on what is at stake and how different the options are.

Two questions help. First, how wide is the plausible range now, and would the decision change anywhere within it? If even the pessimistic end of the range supports the same decision, more data adds little. Second, what does it cost to gather more data, compared with the cost of a wrong decision? A cheap, reversible choice can be made on thin evidence; an expensive, irreversible one deserves more. The article [The value of information](/reados/collections/valuing-time-delay-and-uncertainty/the-value-of-information/) turns this reasoning into a calculation.

## Rates that change over time

Bayesian estimates assume the underlying rate is stable. In business it often is not. Conversion rates change with seasons and competitors; supplier quality changes with staff and equipment; customer payment behaviour changes with economic conditions.

A practical response is to give recent data more weight, for example by estimating from a rolling window of recent months, or by gradually reducing the influence of older observations. Watching for sudden shifts, such as a run of defects from a previously reliable supplier, matters more than refining an estimate that may no longer describe the present.

## Choosing a prior

Choosing a prior can feel subjective, and it is: it represents what you believed before seeing the data. That is a feature, not a flaw, provided it is done honestly.

Some sensible approaches:

- **Uniform prior (1, 1)** when there is genuinely no relevant prior knowledge.
- **Prior from similar past cases**, such as previous products, suppliers or campaigns, scaled to reflect how comparable they are.
- **Industry benchmarks**, where reliable figures exist.
- **Weak priors** that represent only a few pseudo-observations, so that real data quickly takes over.

A good test is to ask how many real observations the prior is worth. A prior worth 1,000 observations will barely move with 20 new data points; a prior worth 10 will move substantially. For most business decisions, priors worth somewhere between a handful and a few dozen observations are sensible.

## Comparing two options

Bayesian estimates are particularly useful for comparing options with small samples, such as two versions of a product page, two sales scripts or two suppliers.

This is an illustration.

Version A of an offer has 6 sign-ups from 60 visitors; version B has 9 sign-ups from 60.

- A's posterior (uniform prior): (7, 55), mean ≈ 11.3%.
- B's posterior: (10, 52), mean ≈ 16.1%.

B looks better, but the distributions overlap considerably. Rather than declaring a winner, the business can estimate the probability that B is genuinely better than A, which in this case is roughly 80%: encouraging, but far from certain. Whether that is enough depends on the cost of being wrong. If switching is cheap and reversible, acting on 80% may be fine; if it is expensive, more data may be worthwhile.

The related question of how to balance gathering more data against acting on current evidence is covered in [Explore or exploit?](/reados/collections/competitive-strategy-and-positioning/explore-or-exploit/).

## Learning with missing data

Real data is often incomplete. Some customers do not answer a survey; some deliveries are not recorded; some sensor readings are lost. Ignoring missing data can bias estimates, especially if the reason it is missing is related to the outcome. Customers who had a bad experience may be less likely to respond to a satisfaction survey, making satisfaction look higher than it is.

The book discusses methods that estimate missing values and model parameters together. For practical purposes, the key habits are to record how much data is missing, to ask why it is missing, and to be cautious about conclusions if the missing data might differ systematically from the rest.

## When data is plentiful

With large amounts of data, Bayesian and simple estimates converge, and the prior hardly matters. The value of the Bayesian approach lies mainly in the early stages: new products, new suppliers, new markets, new staff, pilot programmes and experiments. These are exactly the situations young businesses face most often.

## A worked illustration

This is an illustration, not a real business.

A small business tests two new wholesale customers' payment behaviour. Customer X has paid 4 of 4 invoices on time. Customer Y has paid 18 of 20 on time.

The simple percentages, 100% and 90%, suggest X is more reliable. A Bayesian view with a weak prior based on the business's other customers, who pay on time about 85% of the time, worth about 10 observations (prior 8.5, 1.5), gives:

- X: posterior (12.5, 1.5), mean ≈ 89%.
- Y: posterior (26.5, 3.5), mean ≈ 88%.

The two are essentially indistinguishable, and Y's estimate rests on far more evidence. The business decides to offer both the same credit terms, reviewing after another three months, rather than favouring X on the basis of four invoices.

## Common mistakes

**Trusting percentages from tiny samples.** They can be extreme and unstable.

**Treating zero occurrences as impossible.** Absence of evidence over a few trials is weak evidence of absence.

**Hiding uncertainty.** Report a range, not just a point estimate.

**Using an overconfident prior.** Make sure real data can move the estimate.

**Ignoring why data is missing.** Missing data can bias results.

## Questions to ask

- How many observations is this percentage based on?
- What did we believe before this data, and how strongly?
- What range of values is plausible given the evidence?
- If we are comparing options, how likely is it that the apparent winner is genuinely better?
- For your own business: which recent decision was based on a percentage from a very small sample?

## Bringing it together

Small samples are a fact of life for new products, suppliers and experiments. Raw percentages from small samples can be extreme and give a false sense of precision. Bayesian estimation offers a simple alternative: start with a prior expressed as pseudo-counts, add the observed successes and failures, and report both a best estimate and a plausible range.

These habits lead to steadier decisions: not overreacting to early results, not mistaking a short clean record for perfection, and knowing when more data is genuinely needed before acting.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; figures in the examples are illustrations, and ranges are approximate. This article is general information, not professional or statistical advice.*
