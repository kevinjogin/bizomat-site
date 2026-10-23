---
title: "Sampling: who to ask and how many responses you need"
description: "How to define a population and sampling frame, choose probability or non-probability sampling, estimate margins of error and sample sizes, and deal with small populations, subgroups and non-response."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - customers
  - quality
author: "KEVOS"
featured: false
draft: false
---

Almost all practical research studies a sample rather than everyone. A business surveys some of its customers, interviews a handful of staff, inspects a selection of parts from a batch, reviews a sample of invoices for errors or times a few cycles of a process. The results are then used to draw conclusions about the whole group: all customers, all staff, the whole batch, every invoice. Whether those conclusions are justified depends on two things: how the sample was chosen and how big it is.

Most sampling problems in business research come from the first of these. A large sample chosen badly can mislead more than a small sample chosen well. Surveying only customers who responded to a newsletter, interviewing only staff nominated by their managers or inspecting only parts from the top of a bin produces samples that differ systematically from the whole group, and no amount of extra responses fixes that bias. Size matters too: small samples produce estimates with wide uncertainty, and results for subgroups within a sample are less precise than results for the whole.

This article explains populations, sampling frames and samples, the main sampling methods, the difference between sampling error and bias, how to estimate the margin of error and sample size for proportions, how to handle small populations and subgroups, the problem of non-response and practical guidance for qualitative and operational samples. It is part of a series on research and evidence for business decisions.

## Population, frame and sample

- **Population**: the whole group the research wants to describe, such as all active customers, all employees or all parts produced this week.
- **Sampling frame**: the list or source from which the sample is drawn, such as the customer database, payroll list or production log.
- **Sample**: the cases actually selected and studied.

Problems arise when the frame does not match the population. A customer database that omits customers who buy through distributors, or a staff list that leaves out casual workers, means some members of the population can never be selected. Checking how well the frame covers the population is the first sampling task.

## Probability sampling

In **probability sampling**, every member of the frame has a known, non-zero chance of selection. This allows sampling error to be estimated mathematically. Common methods are:

- **Simple random sampling**: every member has an equal chance, as in drawing names at random from a complete list.
- **Systematic sampling**: selecting every kth member from a list after a random start, which is simple and works well unless the list has a repeating pattern.
- **Stratified sampling**: dividing the population into groups, or strata, such as customer size or region, and sampling within each. It ensures that each group is represented and can improve precision.
- **Cluster sampling**: selecting groups, such as sites or days, and studying all or some members within them. It reduces cost but usually increases uncertainty.

## Non-probability sampling

In **non-probability sampling**, selection depends on convenience, judgement or availability:

- **Convenience samples** use whoever is easiest to reach.
- **Quota samples** fill set numbers for groups, such as a number of large and small customers, without random selection within them.
- **Purposive samples** choose cases deliberately for their relevance, such as long-standing customers or recent defectors.
- **Snowball samples** ask participants to suggest others.

```figure
type: tree
title: Ways to choose a sample
caption: Use random or systematic selection where results must be generalised to the whole population.
- Sampling
  - *Probability | simple random, systematic, stratified, cluster
  - Non-probability | convenience, quota, purposive, snowball
```

Non-probability samples are common, cheap and often appropriate for exploratory and qualitative research. Their limitation is that the precision of their results cannot be calculated, and they may be biased in unknown ways.

## Sampling error and bias

**Sampling error** is the natural variation that occurs because a sample is not the whole population. Different random samples give slightly different results, and larger samples reduce this variation. **Bias** is a systematic difference between the sample and the population, caused by how the sample was chosen or who responded. Larger samples do not reduce bias; better methods do. A survey of 2,000 self-selected website visitors may be more biased than a random sample of 200 customers.

## Margin of error for proportions

For a simple random sample, the uncertainty in an estimated proportion, such as the share of customers satisfied, can be approximated by the **margin of error** at 95% confidence:

margin of error ≈ 1.96 × √(p × (1 − p) ÷ n)

where p is the proportion and n the sample size. The margin is largest when p is 50%. Using that worst case, approximate margins are:

- n = 50: about ±14 percentage points;
- n = 100: about ±10;
- n = 200: about ±7;
- n = 400: about ±5; and
- n = 1,000: about ±3.

Halving the margin of error requires roughly four times the sample. These figures assume random sampling and apply to the whole sample; they do not account for bias. The [analysing counts and categories in business data](/reados/collections/operational-data-records-and-controls/analysing-counts-and-categories-in-business-data/) article explains how to judge whether differences between groups are real.

```figure
type: line
title: Margin of error at 95% confidence, worst case
x: Completed responses
y: Margin (± percentage points)
ymin: 0
ymax: 15
caption: Halving the margin needs roughly four times the sample, and none of this accounts for bias.
legend: Margin of error
- 50 | 14
- 100 | 10
- 200 | 7
- 400 | 5
- 1000 | 3
```

## Sample size for a target precision

Rearranging the formula gives the sample needed for a chosen margin of error. For ±5 percentage points at 95% confidence, with the worst-case p of 50%, the answer is about 384 completed responses for a large population. For ±10 points, about 96.

### Small populations

When the population is small, fewer responses are needed because each response is a larger share of the whole. A common adjustment is:

n_adjusted = n ÷ (1 + (n − 1) ÷ N)

where N is the population size. For a business with 300 customers, the 384 responses needed for ±5 points in a large population becomes about 169. With 2,000 customers, it becomes about 322. In small populations, contacting everyone, a census, is often simpler than sampling.

### Subgroups

If results are needed separately for subgroups, such as large and small customers, each subgroup needs enough responses for the precision required. A sample of 400 split into four equal groups gives only about 100 in each, and margins of about ±10 points within each group. Planning subgroup analysis before deciding sample size avoids this surprise.

## Confidence levels

The margins of error above use a 95% confidence level, the most common convention. It means that if the sampling were repeated many times, intervals calculated this way would contain the true value about 95% of the time. A 90% level gives narrower intervals with less confidence; a 99% level gives wider intervals with more. The choice should reflect the consequences of being wrong: a low-stakes marketing decision may accept less confidence than a safety or major investment decision.

## Sampling over time

Many business populations change. Customers come and go, processes drift, seasons shift demand and staff turn over. A sample taken in one week or season may not represent the year. Spreading data collection across time, such as surveying customers continuously after each job rather than once a year, or sampling production across shifts and days, gives a more representative picture and shows changes as they happen. When comparing periods, keep sampling methods consistent so that differences reflect real change rather than changes in method.

## Samples for comparisons and trials

When the aim is to compare two groups, such as customers who received a new service and those who did not, or two versions of a web page, the sample must be large enough in each group to detect the difference that matters. Smaller differences need larger samples, and detecting a difference of a few percentage points between two proportions can require hundreds or thousands of cases per group. Deciding in advance the smallest difference worth detecting, and checking that the planned sample can detect it, avoids running trials that cannot give a clear answer.

## Response rates and non-response

The sample size that matters is the number of **completed responses**, not the number of invitations. If 40% of invited customers are expected to respond, achieving 169 responses requires inviting about 420.

More important than the rate itself is whether non-respondents differ from respondents. Satisfied and dissatisfied customers, busy and idle staff, may respond at different rates. Ways to assess and reduce **non-response bias** include comparing respondents with the population on known characteristics such as size or region, following up a small sample of non-respondents by phone, sending reminders and making participation easy. Where respondents differ from the population on known characteristics, results can be **weighted** to correct the balance, although weighting cannot fix differences on characteristics that are not known. The [the customers who say nothing](/reados/collections/marketing-brands-and-customer-experience/the-customers-who-say-nothing/) article explores why silent customers matter.

## Qualitative samples

Qualitative research, such as interviews and focus groups, uses smaller, purposive samples chosen to cover a range of perspectives rather than to estimate proportions. The guiding idea is **saturation**: continuing until new interviews add few new insights. For a focused business question with a fairly similar group of participants, saturation often comes after something like eight to fifteen interviews, but more varied groups need more. Selecting participants who differ in relevant ways, such as large and small customers, new and long-standing, satisfied and dissatisfied, matters more than raw numbers.

## Sampling in operations

Operational sampling follows the same principles. Inspecting parts only at the start of a shift, timing only experienced operators or auditing only invoices that look unusual introduces bias. Random or systematic selection across shifts, operators, machines and times gives a fairer picture. **Work sampling**, taking many random snapshots of what people or machines are doing, estimates the proportion of time spent on different activities without continuous observation.

## Small samples, honestly reported

Small samples are sometimes all that is available. Their results can still inform decisions if their uncertainty is reported honestly. Statements such as "7 of 10 customers interviewed raised delivery problems" convey both the finding and its basis, while "70% of customers have delivery problems" overstates it. The [learning from small numbers](/reados/collections/marketing-brands-and-customer-experience/learning-from-small-samples/) article explains how to estimate rates sensibly when data is scarce.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

An equipment hire business with about 300 active customers wants to estimate the proportion who would use an online booking system, with a margin of error of about ±5 percentage points. Using the small-population adjustment, it needs about 169 completed responses. Past surveys achieved a 40% response rate, so it invites all 300 customers rather than sampling, expecting about 120 responses at best.

The business recognises that 120 responses would give a margin of roughly ±6 to 7 points after the adjustment, and accepts this, given the decision. It also checks the frame: the customer list includes only account customers, omitting cash customers who hire occasionally, so it adds a short card survey at the counter for cash customers over two weeks.

When 132 account customers respond, the business compares them with the full list. Larger customers responded at a higher rate, so results are weighted by customer size before estimating the overall proportion. The counter cards show that cash customers are much less interested in online booking, a finding that the original frame would have missed entirely.

```figure
type: funnel
title: Surveying an equipment hire business's customers
caption: Counter cards for cash customers, missing from the customer list, showed much less interest in online booking.
- Active account customers, all invited | 300
- Needed for ±5 points | about 169
- *Responses, weighted by customer size | 132
```

## How this applies to a small Australian business

- **Define the population** and check that the sampling frame covers it.
- **Use random or systematic selection** where results must be generalised.
- **Plan sample sizes** for the precision and subgroups needed.
- **Survey everyone** when the population is small.
- **Invite enough people** to achieve the completed responses required.
- **Check respondents against the population** and weight if needed.
- **Spread sampling across time**, shifts and seasons.
- **Size comparison trials** to detect the smallest difference that matters.
- **Report sample sizes and uncertainty** alongside results.

## Common mistakes

- **Assuming a big sample cannot be biased.**
- **Using a frame that misses part of the population.**
- **Ignoring subgroup sample sizes.**
- **Confusing invitations with completed responses.**
- **Inspecting or timing only convenient cases.**
- **Running trials too small** to detect the difference that matters.
- **Reporting percentages from tiny samples** without counts.

## Frequently asked questions

**Is 10% of the population a good sample size?** Not as a rule. Precision depends mainly on the number of responses, not on the percentage of the population, except in small populations.

**Can a convenience sample ever be useful?** Yes, for exploration and early learning, as long as conclusions are not generalised beyond what it can support.

**What response rate is acceptable?** There is no universal threshold. A low rate is a concern mainly when respondents are likely to differ from non-respondents on the topic being studied.

**How many interviews are enough?** Enough to reach saturation for the range of perspectives that matter, often in the low teens for a focused business question.

**Does a 95% confidence level mean a 95% chance the answer is right?** Not exactly. It describes how often intervals calculated this way would capture the true value over many repeated samples, assuming no bias.

## Questions to ask

- Who exactly is our population, and does our list include all of them?
- How precise do our results need to be, overall and for subgroups?
- How will we select the sample, and could the method introduce bias?
- How will we check whether respondents represent the population?
- Is our planned trial large enough to show a difference worth acting on?
- Do our reports show sample sizes and uncertainty?

## Bringing it together

Sampling determines whether results from some can be applied to all. Define the population, check the frame, prefer probability methods where generalisation matters, and remember that bias is cured by method, not size. Margins of error shrink slowly as samples grow, small populations need fewer responses or a census, subgroups need their own numbers and non-response must be checked. Qualitative and operational samples follow the same principles of deliberate, fair selection and honest reporting. Well-chosen samples, honestly described, give small businesses evidence they can act on without the cost of studying everyone.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
