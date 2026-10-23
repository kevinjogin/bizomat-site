---
title: "Correlation, causation and natural experiments: telling what drives results from what merely moves with them"
description: "Why correlated measures may not be cause and effect, how confounding, reverse causation and Simpson's paradox mislead, and how experiments, natural experiments and comparisons establish causes."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - strategy
  - experimentation
author: "KEVOS"
featured: false
draft: false
---

Business data is full of relationships. Customers who receive more visits from sales staff buy more. Sites with more training hours have fewer incidents. Machines that are serviced more often break down more often. Months with more advertising have higher sales. Some of these relationships reflect cause and effect; others do not. Sales staff may visit the customers who already buy most. Sites with more incidents may be required to run more training. Machines that break down get serviced more. Advertising may rise in the months when demand is naturally strongest.

Mistaking **correlation**, the tendency of two measures to move together, for **causation**, one measure actually driving the other, is one of the most common and expensive errors in management. It leads businesses to invest in activities that do not produce results, to cut activities that do, and to draw lessons from successful competitors that would not work for them. The opposite error, dismissing all observational evidence because correlation is not proof, also has costs, because many decisions must be made without the luxury of a controlled experiment.

This article explains what correlation measures, the main reasons correlations mislead, including confounding, reverse causation, selection and Simpson's paradox, and the practical ways to get closer to causes: randomised experiments, natural experiments, difference-in-differences comparisons, thresholds and structured reasoning about evidence. It is part of a series on research and evidence for business decisions.

## What correlation measures

The **correlation coefficient**, often written r, measures the strength of a straight-line relationship between two numerical measures, from −1 (a perfect negative relationship) through 0 (no linear relationship) to +1 (a perfect positive relationship). Its square, r², is the proportion of variation in one measure that a straight line through the other explains.

Correlation has important limits even before questions of cause:

- it measures only **linear** relationships, so a strong curved relationship can have a low correlation;
- it is sensitive to **outliers**, which can create or hide a correlation; and
- it says nothing about the **size** of the effect in practical units.

A **scatter plot** should always accompany a correlation. It shows the shape of the relationship, outliers and clusters that the single number hides.

## Why correlation is not causation

### Confounding

A **confounder** is a third factor that influences both measures. Larger customers receive more sales visits and also buy more; customer size, not the visits, may explain most of the relationship. Older machines need more servicing and also break down more; machine age confounds the relationship between servicing and breakdowns. Failing to account for confounders is the most common reason correlations mislead.

### Reverse causation

The direction of cause may run the opposite way from what is assumed. Incidents prompt training; poor performance prompts management attention; falling sales prompt advertising. Data collected at the same time cannot show which came first.

### Selection effects

Data that includes only certain cases can create relationships that do not exist in the wider population. Studying only businesses that survived, only customers who responded to a survey or only projects that were completed can produce correlations driven by who was included. The [what would have happened anyway](/reados/collections/investment-appraisal-and-business-cases/what-would-have-happened-anyway/) article explains why the right comparison matters.

### Coincidence

With enough measures, some will correlate by chance. Two unrelated series that both rise over time, such as a company's revenue and the number of streaming subscriptions in the country, will be correlated simply because both trend upwards. Correlations between trending series are especially prone to this.

## Simpson's paradox

Combining groups can reverse a relationship that holds within each group. Suppose two technicians handle repair jobs:

- Technician A completes 90 of 100 easy jobs (90%) and 40 of 80 hard jobs (50%), 130 of 180 overall (about 72%).
- Technician B completes 85% of 200 easy jobs (170) and 25% of 20 hard jobs (5), 175 of 220 overall (about 80%).

Technician B has the better overall success rate, yet Technician A does better on both easy and hard jobs. The overall figures mislead because A takes on far more hard jobs. This is **Simpson's paradox**, and it arises whenever groups differ in their mix of a factor that affects the outcome. Comparing like with like, by stratifying data, avoids it.

## The gold standard: randomised experiments

The most reliable way to establish cause is a **randomised experiment**: assign cases at random to receive a change or not, then compare outcomes. Randomisation balances confounders, known and unknown, between the groups on average, so a difference in outcomes can be attributed to the change. Businesses can randomise more often than they think: offers to customers, quote formats, procedures on shifts, maintenance strategies on comparable machines and web page versions can all be assigned at random.

## Natural experiments

When deliberate experiments are impractical, **natural experiments** can help. These occur when a change affects some cases and not others for reasons unrelated to the outcome. A new regulation applies in one state but not another; a supplier changes its process at one plant first; a system is rolled out to branches in an order decided by IT capacity rather than performance; a road closure diverts traffic past some stores but not others. Comparing affected and unaffected cases approximates an experiment, provided the reason for the difference is genuinely unrelated to the outcome.

## Difference-in-differences

A practical method for natural experiments and staged rollouts is **difference-in-differences**. Measure the outcome before and after the change in both the group that received it and a comparison group that did not. The effect is estimated as the change in the treated group minus the change in the comparison group. This removes changes that affected both groups, such as seasons, economic conditions or company-wide initiatives.

For example, if absenteeism at a site that introduced a new roster fell from 6% to 3%, while at a similar site without the change it fell from 6% to 5%, the estimated effect of the roster is a reduction of about 2 percentage points, not 3. The method relies on the two groups following similar trends before the change, which should be checked with earlier data.

## Thresholds

Some business rules create sharp thresholds: discounts above a certain order size, inspections triggered above a score, programs available to businesses below a certain number of employees. Cases just above and just below the threshold are usually similar in every other respect, so comparing their outcomes reveals the effect of whatever the threshold triggers. This approach, known as a **regression discontinuity** design, can be powerful when thresholds are applied consistently.

## Reasoning about causes without experiments

When neither experiments nor natural experiments are available, structured reasoning helps judge whether a relationship is likely to be causal. Considerations developed in fields such as epidemiology include:

- **Strength**: stronger associations are less likely to be explained entirely by confounding.
- **Consistency**: the relationship appears across different places, times and data sources.
- **Timing**: the supposed cause comes before the effect.
- **Dose-response**: more of the cause produces more of the effect.
- **Mechanism**: there is a plausible explanation of how the cause produces the effect.
- **Alternatives**: other explanations have been examined and found weaker.

```figure
type: checklist
title: Reasoning about causes without an experiment
caption: No single test settles it; the more of these that hold, the stronger the causal case.
- x Strength | a strong association
- x Consistency | across places, times and sources
- x Timing | the cause comes first
- x Dose-response | more cause, more effect
- x Mechanism | a plausible explanation of how
- *x Alternatives | other explanations examined and weaker
```

No single consideration is decisive, but together they build or weaken a causal case. Diagrams of causes and evidence, such as those described in the [Bayesian networks](/reados/collections/decision-making-machines/bayesian-networks-cause-and-evidence/) article, help make these judgements explicit.

## Mediators and moderators

Causes often work through intermediate steps and under particular conditions. A **mediator** is the mechanism through which a cause has its effect: training may reduce errors by improving how operators set up machines, so set-up quality mediates the effect. A **moderator** changes the strength of an effect: training may help new operators a great deal and experienced ones very little, so experience moderates it. Understanding mediators shows what to measure to confirm a change is working; understanding moderators shows where it will work best. Both help explain why an initiative succeeds in one place and fails in another.

## Attribution in marketing

Marketing is a common arena for confusing correlation with cause. Customers who see an advertisement and then buy may have bought anyway; digital analytics often credit the last click before a purchase, ignoring everything that came earlier; and campaigns are usually run when demand is expected to rise. Holding out a random group of customers or regions from a campaign, and comparing their purchases with those who received it, is the most reliable way to measure what marketing actually adds.

## Stating causal claims carefully

The words used to report findings should match the strength of the evidence. "Customers who received visits bought more" describes an association; "visits increased purchases" claims a cause. Reports should say which kind of evidence supports each claim, what alternatives were considered and how confident the conclusion is. Careful wording prevents readers from treating a correlation as a proven lever.

## Causes in operations

Operations and quality work deals with causes constantly. Root cause analysis methods, such as the five whys, cause-and-effect diagrams and DMAIC, aim to identify real causes rather than correlated symptoms. Their strongest step is verification: confirming a suspected cause by changing it and observing the effect, or by checking that the problem appears when the cause is present and disappears when it is removed. The [fixing a recurring problem with DMAIC](/reados/collections/lean-and-continuous-improvement/fixing-a-recurring-problem-with-dmaic/) article describes this discipline.

## Practical habits

- **Ask what else could explain** a relationship before acting on it.
- **Stratify data** by obvious confounders such as size, age, type or location.
- **Check timing**: which came first?
- **Look for natural comparisons** created by staged rollouts, regional differences or rules.
- **Randomise** when introducing changes that can be tested on some cases first.
- **Treat strong claims of cause from observational data** with caution until confirmed.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A maintenance contractor's data shows that machines receiving more preventive maintenance visits have more breakdowns, and a manager suggests that maintenance visits may be causing problems. The reliability engineer considers alternatives. Older and more heavily used machines receive more visits under the maintenance plan and also break down more, so age and usage are likely confounders. Breakdowns also trigger additional inspection visits, which is reverse causation.

Stratifying machines by age and usage band reverses the pattern: within each band, machines with more preventive visits have fewer breakdowns. To strengthen the evidence, the contractor uses a natural experiment. A software upgrade a year earlier had extended service intervals for an arbitrary subset of machines, unrelated to their age or condition, because of a configuration error, later corrected. Comparing breakdown rates for those machines with similar machines on standard intervals, before and after the error, shows breakdowns rising by about a third during the period of extended intervals. The contractor concludes that preventive visits reduce breakdowns and keeps its maintenance plan.

```figure
type: compare
title: Do maintenance visits cause breakdowns?
cols: Raw data | After checking
best: 2
caption: An accidental extension of service intervals acted as a natural experiment: breakdowns rose by about a third.
- Pattern | More visits, more breakdowns | Within each age and usage band, fewer
- Explanation | Visits cause problems | Older, busier machines get more visits
- *Test | A correlation only | A natural experiment from a configuration error
```

## How this applies to a small Australian business

- **Plot relationships** before calculating correlations.
- **Identify likely confounders** and stratify by them.
- **Check the direction and timing** of relationships before assuming a cause.
- **Use randomised trials** where changes can be tested on some cases first.
- **Exploit natural experiments** such as staged rollouts.
- **Use difference-in-differences** to compare changes against a similar group.
- **Hold out a random group** when measuring the effect of marketing campaigns.
- **Word findings to match the evidence**: association or cause.
- **Verify root causes** by testing them, not just identifying correlates.

## Common mistakes

- **Investing in activities that merely correlate** with results.
- **Ignoring confounders** such as size, age and mix.
- **Comparing overall rates** across groups with different mixes.
- **Reading before-and-after changes as effects** without a comparison group.
- **Correlating two trending series** and finding meaning.
- **Crediting the last click** for every online sale.
- **Dismissing all observational evidence** instead of weighing its strength.

## Frequently asked questions

**Is a high correlation strong evidence of cause?** Not on its own. Strong correlations can still be driven by confounders, reverse causation or shared trends.

**How can a small business run experiments?** By introducing changes to some customers, shifts, machines or regions first, chosen at random where possible, and comparing results with the rest over the same period.

**What is a confounder in simple terms?** A third factor that affects both the supposed cause and the outcome, creating a relationship between them that is not cause and effect.

**When is observational evidence good enough to act on?** When the relationship is strong, consistent, correctly timed and plausible, alternatives have been examined, and the decision can be reviewed if later evidence disagrees.

**Why does an initiative work at one site and not another?** Often because of moderators: conditions such as staff experience, equipment, customer mix or management support that change the strength of the effect. Studying where it worked and where it did not reveals those conditions.

## Questions to ask

- What else could explain this relationship?
- Which came first, and could the cause run the other way?
- Are we comparing groups with different mixes?
- Is there a natural comparison group we could use?
- Do our reports distinguish associations from proven causes?
- Could we test this change on some cases before others?

## Bringing it together

Correlation measures how measures move together, but confounding, reverse causation, selection and coincidence mean it rarely proves cause on its own, and Simpson's paradox shows that combined figures can even reverse the truth. Randomised experiments establish causes most reliably; natural experiments, difference-in-differences comparisons and thresholds approximate them when experiments are impractical; and structured reasoning about strength, consistency, timing, dose, mechanism and alternatives helps judge the rest. Asking what else could explain a relationship is the single most useful habit.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
