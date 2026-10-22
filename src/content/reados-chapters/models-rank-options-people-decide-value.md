---
title: "Models rank options, people decide value: trade-offs, efficient choices and what counts"
description: "A scoring model gives the best answer to the question it was given. How to remove clearly worse options, see real trade-offs, treat weightings as decisions and agree what value means."
publishDate: 2026-10-04
category: "Business"
tags:
  - strategy
  - systems
  - finance
author: "KEVOS®"
featured: false
draft: false
---

Businesses increasingly use models to help with decisions: a weighted scoring sheet for choosing a supplier, a spreadsheet ranking improvement projects, software that optimises delivery routes, stock levels or production schedules. These tools are valuable. They can test combinations no person could check by hand and bring discipline to choices that would otherwise be made by enthusiasm or habit.

But a precise answer can hide the choices behind it. A model can find the best option for the objective it was given. It cannot decide whether that objective was the right one, how much cost matters compared with reliability, whether a constraint is genuinely fixed or which trade-offs the business is willing to make. A project that scores 92.4 looks better than one scoring 89.7, but the gap may reflect a weighting someone chose in a hurry rather than any real difference in value.

This article explains why every model answers the question "best, given what?", how to separate clearly worse options from genuine trade-offs, why weightings are decisions rather than facts, why choosing between projects involves negotiation as well as analysis, and how to agree what value means before measuring it.

## Best, given what?

Every optimisation or scoring model is conditional: it identifies the best option **given** a set of objectives, measures, weightings and constraints. Those inputs are management choices, even when they are buried in a spreadsheet.

Published research shows this clearly. Studies from 2017 designed models for locating water-quality monitoring stations, planning municipal waste networks and configuring hybrid renewable power systems. Each model balanced several objectives: cost, coverage of the population, environmental and social effects. In the hybrid power study, the model could identify cost-effective configurations, but the acceptable payback period came from the owner. The models were sophisticated; the definition of "good enough" still came from people.

The governance task is to make the "given what" explicit:

- **What is the model trying to maximise or minimise, and why?**
- **Do the measures reflect what we actually care about**, or what is easy to count?
- **Which constraints are genuinely fixed**, by law, safety or physical capacity, and which are assumptions that could be changed?
- **What would the answer be if we changed a constraint?** This question often reveals more than the optimal answer itself.

## Clearly worse options and genuine trade-offs

When several objectives are involved, there is often no single best answer, only a set of options that each balance the objectives differently. Two ideas help:

- An option is **dominated** when another option is at least as good on every relevant objective and better on at least one. Dominated options can usually be removed quickly.
- The options that remain are **efficient**: improving one objective means giving up some of another. Together they form what economists call the **Pareto frontier**.

Research on remanufacturing systems by Su, Shi and Dou, for example, found that larger buffers between process steps could increase throughput but also increased work in progress, so the study produced a set of efficient options rather than one answer. Research on an engineered cooling fluid by Amani and colleagues found that increasing a particular ingredient improved heat transfer but also made the fluid thicker and harder to pump. In both cases, analysis could identify the efficient options. Choosing among them was a question of priorities.

The practical lesson: **let analysis remove the clearly worse options, then spend leadership time on the genuine trade-offs.** Choosing a point on the frontier is not finding the mathematical optimum. It is choosing a balance, and the business should own that choice explicitly.

```figure
type: svg
title: Dominated options and the efficient frontier
alt: A chart of cost against throughput shows several options. Options on the frontier trade cost for throughput; an option behind the frontier is worse on both measures than another and is dominated.
caption: Analysis can remove dominated options; choosing a point on the frontier is a preference, not a calculation.
viewbox: 0 0 640 300
body:
<path class="ln" d="M70 30V250H610"/>
<text class="tx" x="70" y="22">Throughput ↑</text>
<text class="tx" x="610" y="272" text-anchor="end">Capital cost →</text>
<path class="la draw" pathLength="1" d="M140 200C260 120 380 80 560 64"/>
<circle class="fa" cx="140" cy="200" r="8"/>
<circle class="fa" cx="330" cy="98" r="8"/>
<circle class="fa" cx="460" cy="72" r="8"/>
<circle class="bxi" cx="470" cy="150" r="8"/>
<path class="li dsh" d="M462 142L338 106"/>
<text class="txb" x="484" y="155">Dominated: costs more, does less</text>
<text class="txa" x="150" y="190">Efficient</text>
<text class="txa" x="340" y="90">Efficient</text>
<text class="txa" x="470" y="64">Efficient</text>
```

## Constraints, objectives and preferences

Not everything belongs in the same trade-off. A sound decision separates three things:

- **Must-meet constraints**: safety, legal compliance, ethical limits and essential technical requirements. Options that fail these are removed, not traded.
- **Objectives to optimise**: cost, throughput, quality, lead time, energy use.
- **Strategic preferences**: how the business chooses to balance those objectives, given its strategy, cash position and risk appetite.

Keeping constraints separate protects against using optimisation language to justify an unacceptable outcome.

## Weightings are decisions

Weighted scoring combines several objectives into one number. That is convenient, but it means values have entered the arithmetic. Changing the weights can change the winner. If a small shift in one weighting reverses the ranking, the decision depends on preference, not on clear superiority, and should be discussed as such. The [choosing between quotes](/reados/collections/procurement-and-tendering/choosing-between-quotes-and-tenders/) article looks at weightings in supplier selection.

Two practical habits help:

- **Keep objectives separate long enough** to see the trade-off before combining them into a score.
- **Test sensitivity**: change each weighting a little and see whether the order changes.

## Robust choices under uncertainty

An option that is efficient under today's assumptions may become clearly worse if demand, costs, supplier reliability or customer behaviour change. Where uncertainty is significant, prefer options that remain reasonable across several plausible futures over the option that wins narrowly under one forecast.

## Choosing between projects is partly negotiation

Many businesses rank improvement projects or investments with a scoring model. That brings useful comparability, transparency and challenge. But research on project portfolio management, including a 2013 review by Miia Martinsuo, describes portfolio decisions in practice as involving negotiation, situational judgement and reorganisation as well as rational analysis. Information keeps changing, and different parts of the business legitimately see different kinds of value.

A 2015 practitioner case study by Guitarte described prioritisation as a "wicked problem": stakeholders define success differently, decisions affect each other and each choice changes the situation for the next. It suggested three simple questions for every candidate: **is it strategic, is it valuable and is it doable?**

The implication is not that models are useless. It is that they are a representation of the decision, not the decision itself. Use analysis to narrow the field and expose trade-offs, use judgement to resolve what the model cannot, and use clear governance to make that judgement accountable and revisable. A model that pretends to remove judgement can be more dangerous than no model, because it creates false confidence.

## Agree what value means before measuring it

"Maximise value" sounds objective, but different people mean different things. The owner may think of cash and margin, operations of reliability and safety, sales of customer responsiveness, technical staff of capability for the future. None is wrong, and they cannot always all be maximised together.

Research by Martinsuo and Killen in 2014 on strategic value in project portfolios emphasised that when stakeholders hold different expectations, value has to be interpreted and negotiated before it can be measured meaningfully. If a business has not agreed what it means by value, a scoring model simply hides the disagreement inside its criteria and weightings.

A short **value statement** helps, covering five points:

1. **Purpose**: which goals the business's investments are meant to advance.
2. **Value types that count**: financial return, customer outcomes, safety, resilience, future capability, compliance.
3. **Non-negotiables**: conditions every option must meet regardless of return.
4. **Trade space**: where the business is willing to accept less of one thing for more of another, and within what limits.
5. **Review conditions**: what would cause the business to redefine value or change its choices.

This does not require everyone to agree. It requires clarity about what the business values and who decides.

## Watch for optimising the wrong measure

The more powerful the tool, the more efficiently it pursues whatever it was told to pursue. Routing software told to minimise kilometres may schedule deliveries that frustrate customers who need morning arrivals. Stock software told to minimise holding cost may run critical parts down to the point where one late shipment stops production. A scoring sheet that rewards short payback may consistently reject investments in skills and reliability.

When a tool is used repeatedly, check from time to time whether the measure it optimises still represents the outcome the business wants. If people start working around the tool's recommendations, that is often a sign the measure and the real goal have drifted apart. This becomes more important as businesses adopt AI and automated decision tools, which can pursue a proxy measure very effectively while the real outcome quietly suffers.

## Good enough, with a review date

Because conditions change, a portfolio of projects or a chosen option may be the best available today and wrong in six months. Aim for a choice that meets the important thresholds and remains adaptable, rather than a permanently optimal answer. Give significant decisions a review condition, so changing course when evidence changes is treated as good management rather than failure.

## A worked example

This is an illustration. A contract packing business is choosing a layout for a new packing area. The analyst presents five options and a weighted score. Before accepting the ranking, the owner works through the decision step by step.

**Constraints first.** One option routes forklifts across a pedestrian walkway. It fails the business's safety rule and is removed, regardless of its score.

**Dominated options next.** Option D costs $270,000, packs 1,000 units an hour and takes 45 minutes to change between products. Option B costs $240,000, packs 1,100 units an hour and takes 40 minutes to change over. B is better on every measure, so D is removed.

**The efficient options** remain:

| Option | Capital cost | Units per hour | Changeover time |
|---|---|---|---|
| A | $180,000 | 900 | 45 minutes |
| B | $240,000 | 1,100 | 40 minutes |
| C | $260,000 | 1,050 | 15 minutes |

Each is better than the others on something. The analyst's scoring sheet rates each option out of 10 on cost, throughput and changeover, weighted 40%, 40% and 20%:

| Option | Cost score | Throughput score | Changeover score | Weighted 40/40/20 | Weighted 40/35/25 |
|---|---|---|---|---|---|
| A | 10 | 5 | 3 | 6.6 | 6.5 |
| B | 7 | 10 | 4 | 7.6 | 7.3 |
| C | 6 | 8 | 9 | 7.4 | 7.45 |

On the original weights, B narrowly wins. Moving five points of weight from throughput to changeover reverses the order. The decision is preference-sensitive, so the owner discusses the preference directly rather than accepting the score.

```figure
type: compare
title: Five points of weight reverse the ranking
cols: Weights 40 / 40 / 20 | Weights 40 / 35 / 25
caption: The decision is preference-sensitive: discuss how much changeovers matter instead of trusting the decimal.
- Option A: $180,000, 900/h, 45 min | 6.6 | 6.5
- Option B: $240,000, 1,100/h, 40 min | 7.6, first | 7.3
- Option C: $260,000, 1,050/h, 15 min | 7.4 | 7.45, first
```

The business's customers are increasingly ordering smaller batches of more varied products, which means more changeovers each day. That strategic direction favours C's much faster changeover over B's slightly higher speed. The owner chooses C, records the reasoning and sets a review condition: if average batch sizes have not fallen within a year, the choice will be reviewed before the next packing line is planned.

## How this applies to a small Australian business

Small businesses often use simple scoring sheets or software recommendations without questioning what they assume. Practical steps:

- **Ask "best, given what?"** of any model or score.
- **Remove options that fail must-meet constraints** before scoring.
- **Eliminate clearly worse options**, then focus on genuine trade-offs.
- **Keep objectives separate** long enough to see what you are trading.
- **Test whether small weighting changes** reverse the ranking.
- **Agree what value means** for your business before ranking projects.
- **Record your preferences and set review conditions.**

The [who wins, who pays](/reados/collections/valuing-time-delay-and-uncertainty/who-wins-who-pays-in-business-decisions/) and [difficult, complex or ambiguous](/reados/collections/project-sponsors-governance-and-decisions/difficult-complex-or-ambiguous/) articles cover related judgements.

## Signals worth watching

- Decision papers claiming an "optimal" answer with several objectives involved.
- Scores reported to a decimal place from subjective ratings.
- Weightings copied from a previous decision.
- Constraints nobody can explain.
- Rankings that reverse with small weighting changes.
- Disagreements about value hidden inside scoring criteria.
- Projects protected by their score long after their assumptions changed.

## Common mistakes

- **Treating a model's answer** as self-justifying.
- **Trading away safety or legal requirements** inside a score.
- **Combining objectives too early** into a single number.
- **Ignoring sensitivity** to weightings.
- **Assuming one definition of value** that everyone shares.
- **Treating the chosen option** as permanently right.

## Frequently asked questions

**Should we stop using scoring models?** No. They bring consistency and make assumptions visible. Use them to narrow the field and expose trade-offs, then make the final choice explicitly.

**How do we find dominated options without software?** Put the options in a table with one column per objective and compare them pair by pair. Any option that another beats or equals on every column can be removed.

**Who should set the weightings?** The people accountable for the outcome, ideally before seeing how the options score, and with a short explanation of why each weighting has its value.

**What if people disagree about what value means?** Bring the disagreement into the open, separate non-negotiables from trade-offs, and have the person with authority decide, recording the reasoning.

**How often should we review our choices?** When the review condition you set is met, or when a significant assumption changes.

## Questions to ask

- What exactly is our model or scoring sheet trying to achieve?
- Which options are clearly worse and can be removed?
- Which trade-offs remain, and which do we prefer, and why?
- Would a small change in weighting change our choice?
- Have we agreed what value means for this decision?
- What would make us revisit the choice?

## Bringing it together

A model gives the best answer to the question it was given; people decide whether it was the right question. Remove options that fail must-meet constraints, eliminate clearly worse options, examine the genuine trade-offs, treat weightings as decisions and test their sensitivity. Recognise that choosing between projects involves negotiation, agree what value means before measuring it, and make the final choice explicitly, with a review date. Models should sharpen judgement, not hide it behind decimals.

---

*Source: KEVOS® notes, drawing on published research including Su, Shi and Dou (2017) and Amani and colleagues (2017) on multi-objective optimisation, M. Martinsuo (2013) on project portfolio management in practice, A. Guitarte (2015) on portfolio prioritisation, and M. Martinsuo and C. P. Killen (2014) on strategic value in project portfolios. Examples and figures in this article are illustrations.*
