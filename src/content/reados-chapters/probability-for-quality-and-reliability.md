---
title: "Probability for quality and reliability: sampling risk, rare events, redundancy and false alarms"
description: "How basic probability explains acceptance sampling, defect counts, the normal distribution, series and parallel reliability and why inspections with good accuracy still reject many good parts."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - quality
  - operations
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

Quality and reliability are probabilistic by nature. A batch of parts contains some unknown fraction of defects, and a sample taken from it may or may not reveal them. A machine might run for months without trouble or fail next week. A process produces parts that vary around a target, and some fall outside tolerance. An automated inspection system rejects most bad parts but also some good ones. Decisions about sampling plans, inspection, spare parts, redundancy and maintenance all rest on estimates of how likely different outcomes are.

A handful of probability ideas covers most practical needs: how probabilities combine for "and" and "or", the chance of at least one event among many, the binomial and Poisson distributions for counts of defects and failures, the normal distribution for measurements, the reliability of systems built from components in series or in parallel, and conditional probability, which explains why accurate inspections can still produce mostly false alarms when defects are rare. None of these needs advanced mathematics, but each overturns common intuitions.

This article explains these ideas with worked examples drawn from manufacturing, maintenance and quality assurance, and shows how they inform sampling plans, inspection decisions and reliability design.

## Probability basics

A probability is a number between 0 (impossible) and 1 (certain). The probability that an event does not happen is 1 minus the probability that it does. If a part has a 2% chance of being defective, it has a 98% chance of being good.

### Combining independent events

Events are **independent** when the outcome of one does not affect the other. For independent events:

- the probability that **both** happen is the product of their probabilities;
- the probability that **at least one** of several happens is 1 minus the probability that none happen.

If each of 100 components has a 1% chance of failing in a year, independently, the probability that at least one fails is 1 − 0.99¹⁰⁰ ≈ 63%. Small individual risks accumulate quickly across many items, which explains why large systems experience frequent component failures even when each component is reliable.

### Mutually exclusive events

Events are **mutually exclusive** when they cannot happen together. The probability that one or another of them happens is the sum of their probabilities. A part that is either undersize, oversize or within tolerance has probabilities for the three outcomes that add to 1.

## Sampling and the binomial distribution

When parts are sampled from a large batch with a defect rate p, the number of defects found in a sample of n follows the **binomial distribution**. The probability of finding no defects is:

P(0 defects) = (1 − p)ⁿ

For a batch with 2% defects and a sample of 50, P(0 defects) = 0.98⁵⁰ ≈ 36%. A sampling plan that accepts a batch when the sample contains no defects will therefore accept a 2% defective batch more than a third of the time. Allowing one defect in the sample raises the acceptance probability to about 74%.

This is the logic behind **acceptance sampling**. Each plan, defined by sample size and acceptance number, has an operating characteristic curve showing the probability of accepting batches with different defect rates. Sampling can never guarantee that a batch is defect-free; it controls the risk of accepting batches of a given quality. Published sampling standards provide plans for various risk levels, and customers often specify the plan to be used.

## Rare events and the Poisson distribution

When events occur randomly and independently at an average rate, such as defects per square metre of coated surface, breakdowns per month or customer complaints per week, the count in a period often follows the **Poisson distribution**. With an average of λ events per period, the probability of exactly k events is:

P(k) = e^(−λ) × λᵏ ÷ k!

With an average of three breakdowns a month, the probability of none in a month is e^(−3) ≈ 5%, of exactly three about 22%, and of five or more about 18%. The Poisson model helps distinguish a genuinely bad month from normal random variation, and it helps size spare parts stocks for random failures.

## The normal distribution and measurements

Measurements from a stable process often follow the bell-shaped **normal distribution**, described by its mean and standard deviation. In a normal distribution:

- about 68% of values fall within one standard deviation of the mean;
- about 95% within two standard deviations; and
- about 99.7% within three standard deviations.

These figures link process variation to tolerances. If a process is centred and its tolerance limits are three standard deviations either side of the mean, about 0.3% of parts fall outside tolerance. Process capability indices summarise this relationship, and statistical process control uses limits at three standard deviations to distinguish ordinary variation from special causes. The [statistical process control on the shop floor](/reados/collections/manufacturing-quality/statistical-process-control-on-the-shop-floor/) article explains control charts and capability in practice.

Many real distributions are not normal: they may be skewed, have long tails or be mixtures of several processes. Plotting data before assuming normality avoids misleading conclusions.

## Reliability in series

A system whose parts must all work for the system to work is a **series** system. Its reliability is the product of the component reliabilities:

R_system = R₁ × R₂ × R₃ × …

Five components, each with 98% reliability over a period, give a system reliability of 0.98⁵ ≈ 90%. Adding components in series always reduces reliability, which is why simple designs with fewer parts tend to be more reliable.

## Reliability in parallel: redundancy

A system that works if **any one** of several components works is a **parallel** or redundant system. Its probability of failure is the product of the component failure probabilities, so:

R_system = 1 − (1 − R₁) × (1 − R₂) × …

Two pumps, each 95% reliable, arranged so that either can do the job, give a system reliability of 1 − 0.05 × 0.05 = 99.75%. Redundancy is powerful, but its benefit depends on the components failing **independently**. A common cause, such as a shared power supply, a flood or the same maintenance error made on both, can defeat redundancy entirely.

```figure
type: bars
title: Reliability in series and in parallel
unit: %
max: 100
caption: Series chains multiply reliabilities down; independent redundancy multiplies the failure chances down.
- Five components in series, 98% each | 90
- One pump | 95
- *Two pumps in parallel, 95% each | 99.75
```

## Failure patterns over time

Failures do not occur at a constant rate throughout a product's life. A common pattern, the **bathtub curve**, has three phases: early failures from manufacturing defects or installation errors, a period of low and roughly constant random failures, and rising wear-out failures as components age. Burn-in testing and careful commissioning reduce early failures; preventive replacement addresses wear-out; and spares and redundancy manage random failures. The [maintenance that prevents breakdowns](/reados/collections/lean-and-continuous-improvement/maintenance-that-prevents-breakdowns/) article explains how to match maintenance strategies to failure patterns.

## Conditional probability and false alarms

Inspection and testing involve **conditional probabilities**: the probability of a result given the true state. An inspection system might detect 99% of defective parts and wrongly reject 1% of good parts. Those figures sound excellent, but what matters to the operator is different: given that a part has been rejected, what is the chance that it is really defective?

The answer depends on how common defects are. Suppose 0.5% of parts are defective. Of 10,000 parts, 50 are defective, and the system rejects about 49.5 of them. Of the 9,950 good parts, it wrongly rejects about 99.5. In total, it rejects about 149 parts, of which only about a third are truly defective. When defects are rare, most rejects are false alarms, even with an accurate system. Re-inspection of rejects, adjustment of thresholds and efforts to reduce the underlying defect rate all follow from this. The [thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) article explains the reasoning behind conditional probability and Bayes' rule.

```figure
type: funnel
title: Rejects from an accurate inspection system
caption: 99% detection and 1% false rejects, with 0.5% of parts defective: only about a third of rejects are truly bad.
- Parts inspected | 10,000
- Total rejected | about 149
- *Truly defective among them | about 49.5
```

## Expected values and the cost of risk

Probabilities become decisions when they are combined with consequences. The **expected value** of a risk is its probability multiplied by its cost. A 5% chance each year of a breakdown costing $40,000 has an expected annual cost of $2,000. Comparing expected costs with the cost of prevention, such as a spare part, an extra inspection or a backup unit, gives a rational starting point for spending on reliability. Expected values are averages over many years or many items, though, and a business may reasonably pay more than the expected cost to avoid a single loss it could not survive.

## Spares for random failures

When a part fails randomly at a known average rate, the Poisson distribution estimates how many spares are needed to cover a lead time with a given confidence. If a part fails on average once every two months across a site, and replacements take three months to arrive, the expected number of failures during the lead time is 1.5. Holding three spares covers the lead time with roughly 93% probability, and holding four with roughly 98%. Holding only the average of one or two spares would leave a substantial chance of running out. Critical parts with long lead times deserve this kind of calculation rather than a rule of thumb.

## Estimating probabilities from records

Probabilities used in these calculations come from data: inspection records, maintenance histories, warranty returns and supplier quality reports. Records are more useful when failures and defects are recorded consistently, with dates, causes and the number of items at risk. Small amounts of data give uncertain estimates, so ranges are more honest than single figures, and estimates should be revisited as more data arrives.

## Practical cautions

- **Independence is often assumed but rarely guaranteed.** Defects cluster in time, failures share causes and samples taken together may not represent the whole batch.
- **Small samples give imprecise estimates.** A sample with no defects does not prove the defect rate is zero.
- **Rates change.** Process changes, new suppliers and ageing equipment shift probabilities, so models need updating.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A manufacturer receives batches of 2,000 machined parts and inspects a sample of 50, accepting the batch if no defects are found. A customer complaint reveals that a batch with about 2% defects was accepted. The quality manager calculates that such a batch passes the plan about 36% of the time, so the outcome was not bad luck but a property of the plan. The business adopts a plan from a recognised sampling standard that gives a much lower chance of accepting batches at that defect level, and asks the supplier for process capability data so that inspection can focus on the dimensions most likely to vary.

The same manufacturer reviews its compressed-air supply, which depends on a single compressor with an estimated 95% chance of running a month without a stopping failure. Adding a second, independent compressor raises the estimated monthly reliability to about 99.75%, provided the two machines do not share a single electrical supply or a common air dryer. The manager checks those common points and adds a bypass around the dryer.

```figure
type: stats
title: Two probability checks for one manufacturer
caption: Sampling plans and redundancy both have measurable odds; common points such as one supply or one dryer undo independence.
- 36% | Chance a 2% defective batch passes | sample of 50, accept on zero defects
- *99.75% | Monthly air supply reliability | with a second, independent compressor
```

## How this applies to a small Australian business

- **Know the risks in your sampling plans**, and use recognised standards where possible.
- **Count small risks across many items**, using 1 − (1 − p)ⁿ.
- **Use Poisson models** to judge whether a bad period is unusual.
- **Design with fewer series components** and add redundancy where failure is costly.
- **Look for common causes** that could defeat redundancy.
- **Size critical spares** from failure rates and lead times.
- **Expect false alarms** when defects are rare, and plan for re-inspection.

## Common mistakes

- **Treating a clean sample as proof** of a defect-free batch.
- **Assuming independence** where failures share causes.
- **Assuming all data is normally distributed.**
- **Judging inspection systems by detection rate alone.**
- **Ignoring early failures** after installation.
- **Holding only the average number of spares** for critical parts.
- **Ignoring consequences** and judging risks on probability alone.
- **Overreacting to random variation** in monthly counts.

## Frequently asked questions

**Why does a sample with no defects not prove the batch is good?** Because defective parts may simply not have been sampled. A 2% defective batch passes a zero-defect sample of 50 more than a third of the time.

**Is redundancy always worthwhile?** It is worthwhile where failure is costly and where the redundant components can fail independently. If a single cause can disable both, the benefit is small.

**What is the difference between reliability and availability?** Reliability is the probability of operating without failure for a period; availability is the proportion of time a system is ready for use, which also depends on how quickly it is repaired.

**How many spares should be held for a part that fails randomly?** Estimate the expected number of failures during the replacement lead time, then use the Poisson distribution to find the stock that covers the lead time with the confidence the business needs. Holding only the average leaves a high chance of running out.

## Questions to ask

- What is the chance our sampling plans accept a batch at an unacceptable defect rate?
- Which critical systems depend on single components, and what would redundancy cost?
- What common causes could defeat our backups?
- How many of our inspection rejects turn out to be false alarms?
- Do we hold enough spares for critical parts with long lead times?
- Are our probability estimates updated when processes change?

## Bringing it together

Probability explains how quality and reliability behave. Independent risks multiply and accumulate; binomial and Poisson models describe defect counts and random events; the normal distribution links variation to tolerances; series systems lose reliability with every component while redundancy gains it if failures are independent; and conditional probability shows why accurate inspections produce many false alarms when defects are rare. Applying these ideas to sampling plans, inspection and redundancy leads to quality and reliability decisions based on evidence rather than intuition.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
