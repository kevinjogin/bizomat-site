---
title: "Sensitivity and scenario analysis: testing a business case before you trust it"
description: "How to find which assumptions really drive an investment decision, using one-at-a-time sensitivity, tornado charts, switching values and coherent scenarios, with a fully worked equipment example."
publishDate: 2026-10-16
category: "Business"
tags:
  - finance
  - strategy
  - validation
author: "KEVOS"
featured: false
draft: false
---

A business case usually ends with a single number. The new machine has a net present value of $131,000. The product launch pays back in 2.4 years. The new site saves $85,000 a year. That number looks precise, and it is often the only thing the decision-makers remember. But every such figure is the output of a model built on assumptions about volumes, prices, costs, timing and life, and most of those assumptions are uncertain. A single figure hides how fragile, or how robust, the case really is.

**Sensitivity analysis** and **scenario analysis** are the two simplest tools for revealing that fragility. Sensitivity analysis asks how much the result changes when one assumption changes. Scenario analysis asks what happens when several assumptions move together in a consistent story. Neither requires sophisticated software. A spreadsheet and some discipline are enough. Used well, they change decisions: they show which assumptions deserve more investigation, which risks need managing, and whether a project that looks attractive on paper would survive a realistic bad year.

This article explains how to carry out both kinds of analysis, how to present the results so that they inform rather than decorate a decision, and the common mistakes that make them misleading. A worked example follows an equipment investment from a single net present value to a much more useful picture. It is general information, not financial advice.

## Why a single number is not enough

A base-case figure answers one question: what is the result if every assumption turns out exactly as estimated? It says nothing about how likely that is, or how bad things could get. Two projects with the same base-case value can carry very different risks. One may remain worthwhile even if volumes fall by a third; the other may become a loss if volumes fall by a tenth.

The aim of testing a business case is to answer three practical questions:

1. **Which assumptions matter most?** Those to which the result is most sensitive deserve the most scrutiny and the most management attention.
2. **How far can things go wrong before the decision changes?** The margin of safety is often more useful than the base-case value.
3. **What does a plausible bad outcome look like, and could the business live with it?**

These questions complement the core investment measures. The [NPV, IRR and payback](/reados/collections/investment-appraisal-and-business-cases/npv-irr-and-payback-answer-different-questions/) article explains what each measure tells you; this article is about testing whether the inputs behind them can be trusted.

## One-at-a-time sensitivity

The simplest method changes one input at a time, holding all others at their base values, and records the effect on the result.

To do it well:

- **Choose the inputs that could plausibly vary.** Volumes, prices, margins, key costs, the capital cost, the project life, the discount rate and timing are common candidates.
- **Use realistic ranges.** Changing every input by the same percentage, such as ±10%, is convenient but misleading. Some inputs are far more uncertain than others. A contracted price may vary little; a sales volume for a new product may vary a lot. Ranges should reflect the evidence.
- **Record the result for each change.** Usually the net present value or annual profit, sometimes the payback period.

One-at-a-time analysis is easy to understand and quickly shows which inputs matter. Its limitation is that in reality several inputs often move together, which scenario analysis addresses.

### Tornado charts

The results are often presented as a **tornado chart**: a bar chart in which each input is a horizontal bar showing the range of results between its low and high values, sorted with the widest bar at the top. The shape resembles a tornado. The inputs at the top are those the decision depends on most. A tornado chart communicates in seconds what a table of numbers takes minutes to explain.

## Switching values and break-even points

A **switching value** is the value an input would need to reach for the decision to change, typically the point at which the net present value becomes zero, holding everything else constant. It turns the question around. Instead of "what if sales are 20% lower?", it asks "how far can sales fall before this project stops being worthwhile?"

Switching values are often more useful to decision-makers than sensitivity ranges, because they can be compared directly with judgement and evidence. If a project needs at least 1,213 hours of work a year to break even, and the business is confident of 1,500 hours from existing customers, the margin of safety is clear. If the business is not confident of reaching 1,213 hours, that is equally clear.

Break-even analysis is a close relative. The [two breakeven numbers every owner should know](/reados/collections/pricing-margins-and-profitability/two-breakeven-numbers-every-owner-should-know/) article explains break-even in an operating business; switching values apply the same idea to each assumption in an investment case.

## Scenario analysis

Real uncertainty rarely affects one input at a time. A weaker economy may mean lower volumes, lower prices and slower payment all at once. A strong product launch may bring higher volumes and higher operating costs as the business stretches. **Scenario analysis** combines several input changes into a small number of coherent stories.

Good scenarios are:

- **Internally consistent.** The assumptions in each scenario should belong together. Low demand with high prices may be implausible unless there is a reason.
- **Few in number.** Three or four scenarios are usually enough: a pessimistic case, the base case, an optimistic case and perhaps a specific stress case.
- **Described in words as well as numbers.** "Our two largest customers reduce orders by a third, and we cut our hourly rate to win replacement work" is more useful than a column of percentages.
- **Plausible, not extreme.** A pessimistic scenario should be a bad outcome that could realistically happen, not the worst imaginable.

A **stress test** is a deliberately severe scenario designed to ask a different question: could the business survive it? Stress tests are especially important where an investment is large relative to the business or financed with debt.

### Going further: simulation

Where many inputs are uncertain and the stakes are high, **Monte Carlo simulation** assigns a probability distribution to each uncertain input and runs the model thousands of times to produce a distribution of outcomes. It can show, for example, the probability that the net present value is negative. Simulation is powerful but easy to misuse: its outputs are only as good as the ranges and relationships between inputs that are entered. For most small business decisions, careful sensitivity and scenario analysis captures most of the value.

## A worked example

This is an illustrative example. The business, figures and assumptions are hypothetical and simplified, ignoring tax, inflation and residual value.

A precision engineering business is considering a new machining centre costing $400,000. Its base-case assumptions are:

- 1,500 additional machine hours sold each year;
- a contribution of $120 per hour after materials and direct costs, giving $180,000 a year;
- additional operating costs of $40,000 a year for maintenance, tooling and power;
- a five-year life; and
- a discount rate of 10%.

The net annual cash flow is $180,000 less $40,000, or $140,000. At a 10% discount rate, the present value of $1 a year for five years is about 3.7908, so the present value of the cash flows is $140,000 × 3.7908, or about $530,700. The net present value is about $530,700 less $400,000, or **$130,700**. On a single-number basis, the investment looks attractive.

### Sensitivity results

The business tests each input over a range it considers realistic:

| Input changed | Change | Net present value | Change from base |
|---|---|---|---|
| Base case | — | $130,700 | — |
| Hours sold | 20% lower (1,200 hours) | −$5,800 | −$136,500 |
| Contribution per hour | 20% lower ($96) | −$5,800 | −$136,500 |
| Machine life | 4 years instead of 5 | $43,800 | −$86,900 |
| Machine cost | 10% higher ($440,000) | $90,700 | −$40,000 |
| Operating costs | 20% higher ($48,000) | $100,400 | −$30,300 |
| Discount rate | 12% instead of 10% | $104,700 | −$26,000 |

Arranged as a tornado chart, hours sold and contribution per hour sit at the top, followed by machine life. The machine's purchase price, which the business had spent weeks negotiating, matters much less than the volume and price of the work it will do.

```figure
type: bars
title: Tornado view of the machining centre case
unit: $ fall in NPV
caption: Sorted by effect. Hours sold and contribution per hour dominate; together with machine life they decide the case.
- *Hours sold 20% lower | 136500
- *Contribution per hour 20% lower | 136500
- Machine life 4 years, not 5 | 86900
- Machine cost 10% higher | 40000
- Operating costs 20% higher | 30300
- Discount rate 12%, not 10% | 26000
```

### Switching values

For the net present value to fall to zero, the annual cash flow must fall to $400,000 ÷ 3.7908, or about $105,500. Holding other inputs constant, that requires a contribution of about $145,500 a year, which at $120 per hour means about **1,213 hours**, 19% below the base case. Equivalently, at 1,500 hours, the contribution per hour could fall to about $97 before the case breaks even.

```figure
type: gauge
title: Switching value for hours sold
min: 1000
max: 1700
value: 1213
unit: hours
label: break-even, 19% below the 1,500-hour base
caption: Annual cash flow must stay above about $105,500. A supply agreement for at least 800 hours was sought before ordering.
- 1000 | 1213 | Loss
- 1213 | 1500 | Thin
- 1500 | 1700 | Base and above
```

### Scenarios

The business then builds three scenarios:

```figure
type: bars
title: Three internally consistent scenarios
unit: $ NPV
caption: Pessimistic: 1,250 hours at $110 and $45,000 costs. Optimistic: 1,700 hours at $125 and $38,000 costs.
- Pessimistic | −49400
- Base | 130700
- Optimistic | 261500
```

- **Pessimistic**: a key customer reduces orders, so hours fall to 1,250, competition pushes the contribution down to $110 per hour, and operating costs run at $45,000. Annual cash flow is $137,500 less $45,000, or $92,500, and the net present value is about **−$49,400**.
- **Base**: as above, about **$130,700**.
- **Optimistic**: new aerospace work lifts hours to 1,700 at $125 per hour, with operating costs of $38,000. Annual cash flow is $212,500 less $38,000, or $174,500, and the net present value is about **$261,500**.

### What changes in the decision

The analysis does not say "do not buy". It says the decision depends almost entirely on securing enough work at a sound rate. The business responds in three ways. It approaches its two largest customers about a supply agreement covering at least 800 hours a year before ordering the machine. It checks whether the machine's expected life could reasonably be extended through a maintenance contract. And it agrees an early signpost: if bookings for the new machine are below 100 hours a month by month four, it will actively market spare capacity. The single number has become a managed decision.

## Presenting the results

Sensitivity and scenario analysis only help if decision-makers understand them. Some practical guidance:

- **Lead with the drivers.** Show the tornado chart or a short list of the three most important assumptions before the detailed tables.
- **Show switching values.** "The project breaks even at 1,213 hours a year" is easier to judge than a set of percentages.
- **Describe scenarios in words.** Explain the story behind each scenario, not just its numbers.
- **Be honest about ranges.** Explain why each range was chosen and what evidence supports it.
- **Link to actions.** Show what the business will do to reduce the key uncertainties: contracts, trials, staged commitments or signposts.

## How this applies to a small Australian business

- **Test every significant investment.** Equipment, premises, product launches, acquisitions and large contracts all deserve at least a simple sensitivity table.
- **Use realistic ranges.** Base them on evidence and experience, not a standard percentage.
- **Find the switching values.** Ask how far each key assumption can move before the decision changes.
- **Build a pessimistic scenario you could survive.** If a plausible bad outcome would threaten the business, reconsider the size, timing or financing of the commitment.
- **Spend effort where sensitivity is highest.** Negotiate, validate and secure the assumptions at the top of the tornado chart, not those at the bottom.
- **Connect to the assumptions log.** The most sensitive assumptions are usually the critical assumptions that deserve testing and monitoring.

## Common mistakes

- **Uniform ranges.** Changing every input by ±10% hides the inputs that are genuinely uncertain.
- **Inconsistent scenarios.** Combining assumptions that would not occur together produces implausible results.
- **Extreme pessimism.** Worst-case-everything scenarios are easy to dismiss and do not inform decisions.
- **Analysis after the decision.** Sensitivity analysis added to an appendix after approval does not change anything.
- **Ignoring correlations.** Volumes and prices, or volumes and costs, often move together.
- **Precision theatre.** Simulation outputs with many decimal places can hide very rough input assumptions.
- **No follow-through.** Identifying the critical drivers is pointless unless the business acts to manage them.

## Frequently asked questions

**How many inputs should we test?** Start with every input that could plausibly move enough to matter, often eight to twelve in a typical investment case. The tornado chart will quickly show that only a few drive the result.

**What range should we use for each input?** Use the evidence: historical variation, quotes, contract terms, market data and the judgement of the people closest to each figure. Where evidence is thin, say so and consider testing the assumption before committing.

**Is scenario analysis the same as forecasting?** No. A forecast is a best estimate. Scenarios are deliberately different, plausible stories used to test whether a decision holds up across the range of futures the business might face.

## Questions to ask

- Which three assumptions does this decision depend on most?
- How far can each of them move before the decision changes?
- What evidence supports the ranges we have used?
- What does a plausible bad year look like, and could we survive it?
- Which assumptions can we test, secure or contract before committing?
- What signposts will tell us early if the key assumptions are failing?

## Bringing it together

A business case is only as reliable as its assumptions, and a single base-case figure says nothing about how reliable they are. One-at-a-time sensitivity analysis and tornado charts show which assumptions drive the result. Switching values show how much room there is before the decision changes. Coherent scenarios show what plausible good and bad outcomes look like together. Used before the decision, these tools redirect attention to the assumptions that matter, reveal whether the business could survive a bad outcome and turn a single number into a decision with known risks and planned responses. For the wider method of building the case in the first place, the [cost-benefit analysis for business decisions](/reados/collections/investment-appraisal-and-business-cases/cost-benefit-analysis-for-business-decisions/) article provides a practical framework.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article provides general information and does not constitute financial advice.*
