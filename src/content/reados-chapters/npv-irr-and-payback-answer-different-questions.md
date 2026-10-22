---
title: "NPV, IRR and payback answer different questions: reading investment measures when they disagree"
description: "One option has the higher return percentage and faster payback; another creates more value. How to read NPV, IRR and payback together, spot when IRR misleads and make the trade-off visible."
publishDate: 2026-10-08
category: "Business"
tags:
  - finance
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

An owner is choosing between two ways to automate a packing process. The accountant's summary shows three numbers for each. The smaller machine has the higher internal rate of return and pays for itself sooner. The larger system has the higher net present value. Two measures say one thing; one says the other. Which is right?

Usually, all three are right. They are answering different questions. Net present value asks how much value an investment creates in today's dollars. Internal rate of return asks what percentage return its cash flows imply. Payback asks how quickly the money comes back. When they disagree, the disagreement is information: it shows a trade-off between total value, rate of return and how long cash is tied up.

This article explains what each measure tells you, when the internal rate of return can mislead, how to compare two options that cannot both be chosen, and why relying on any single financial return can lead a business to underinvest in its future. It is general information. The examples ignore tax for simplicity; your accountant can help build after-tax cash flows for a real decision.

## What each measure answers

| Measure | The question it answers | What it ignores or hides |
|---|---|---|
| **Net present value (NPV)** | How much value, in today's dollars, does this create above our required return? | Depends heavily on forecasts and the discount rate chosen |
| **Internal rate of return (IRR)** | What discount rate would make the NPV exactly zero? | Size of the investment; can mislead with unusual cash flows |
| **Payback period** | How long until cumulative cash returns equal the investment? | The time value of money; everything after payback |
| **Return on investment (ROI)** | What profit relative to the investment? | Definitions vary; often ignores timing |

Each is a lens on the same commitment. The aim is not to choose a favourite but to understand what each reveals.

```figure
type: compare
title: Three measures, three questions
cols: The question it answers | What it hides
caption: Three lenses, not three votes: use NPV for value, IRR and payback as checks.
- NPV | How much value, in today's dollars, above the required return? | Depends on forecasts and the discount rate
- IRR | What discount rate makes NPV zero? | Scale; can mislead with unusual cash flows
- Payback | How long until the money is back? | Time value and everything after payback
```

## NPV: total value created

NPV discounts each future cash flow back to today at a chosen rate, usually the return the business requires for this level of risk, and subtracts the investment. A positive NPV means the investment is expected to earn more than the required return.

Its strength is that it captures both timing and scale. Its weakness is that it is only as good as the forecasts and the discount rate behind it. The [what the NPV spreadsheet hides](/reados/collections/investment-appraisal-and-business-cases/what-the-npv-spreadsheet-hides/) article covers checking incremental cash flows, timing and the discount rate.

## IRR: an intuitive percentage

IRR is the discount rate at which an investment's NPV equals zero. For a conventional investment, money out at the start and money back afterwards, the usual rule is simple: if the IRR exceeds the required return, the investment adds value.

People like IRR because a percentage feels easy to compare. That is also why it can mislead.

## When IRR misleads

- **It ignores scale.** A 40% return on $10,000 creates less value than a 20% return on $200,000. A list sorted by IRR tends to favour small, quick projects over larger ones that create more total value.
- **It can mislead when choosing between alternatives.** When only one of two options can be chosen, the one with the higher IRR is not necessarily the better choice. Compare NPV, or look at the return on the extra investment, as in the example below.
- **Unusual cash flows can produce more than one IRR.** If cash flows change direction more than once, for example a large repair, overhaul or clean-up cost later in the life, the IRR equation can have two answers, or none that make sense. Go back to the cash flows and look at the NPV across a range of discount rates.
- **The comparison rate matters.** IRR is only meaningful against an appropriate required return. One standard hurdle rate for every project can be misleading when risks differ: a routine equipment replacement and a new product launch do not deserve the same treatment.

## Payback: speed and exposure

Payback is simple: how long until the investment is recovered? It has real uses. It shows how long cash is tied up and how exposed the business is to forecasts far in the future. For a business with tight cash, or in a fast-changing market, that matters.

But simple payback ignores the time value of money and everything that happens after the payback date. A payback limit, such as "three years or less", is a statement about how long the business is willing to have cash tied up. It is not a measure of value. Rejecting a clearly valuable investment only because it misses an arbitrary payback limit can destroy value, unless cash really is the binding constraint.

## A worked example

This is an illustration. A small food business is choosing between two packing upgrades. Only one can be installed. Both last six years, and the business requires a 10% return.

- **Option A**, a semi-automatic packer, costs $40,000 and saves $16,000 a year.
- **Option B**, an automated line, costs $150,000 and saves $45,000 a year.

| | Option A | Option B |
|---|---|---|
| **Investment** | $40,000 | $150,000 |
| **Annual saving** | $16,000 | $45,000 |
| **NPV at 10%** | about $29,700 | about $46,000 |
| **IRR** | about 33% | about 20% |
| **Payback** | 2.5 years | about 3.3 years |

Option A wins on IRR and payback. Option B wins on NPV. To see which is better, look at the **extra** investment B requires compared with A:

```figure
type: compare
title: Two packing upgrades, only one can be installed
cols: Option A: semi-automatic | Option B: automated line
caption: A wins on IRR and payback; B creates more value at a 10% required return because its extra $110,000 earns about 15%.
- Investment | $40,000 | $150,000
- Annual saving, six years | $16,000 | $45,000
- NPV at 10% | about $29,700 | about $46,000
- IRR | about 33% | about 20%
- Payback | 2.5 years | about 3.3 years
```

- Extra cost: $150,000 − $40,000 = $110,000.
- Extra saving: $45,000 − $16,000 = $29,000 a year for six years.
- NPV of the extra at 10%: about $16,300.
- IRR of the extra: about 15%.

The additional $110,000 earns about 15%, above the 10% required return, so if the business can fund it and the risks are similar, Option B creates more value. That also explains the disagreement: at a discount rate of about 15%, the two options have roughly the same NPV. Below that rate B is better; above it A is better.

```figure
type: formula
title: Compare alternatives on the extra investment
formula: Incremental case = Option B − Option A
caption: At a discount rate of about 15% the two options have roughly the same NPV: below it B wins, above it A wins.
step: Extra investment: $150,000 − $40,000 = $110,000
step: Extra saving: $45,000 − $16,000 = $29,000 a year for six years
step: NPV of the extra at 10% ≈ $16,300; IRR of the extra ≈ 15%
```

One more check shows how fragile each answer is. At a 10% required return, Option B still breaks even if its annual saving falls to about $34,400, roughly 23% below forecast. Option A breaks even at about $9,200 a year, so its saving could fall by more than 40%. And the extra $29,000 a year that justifies choosing B over A only needs to fall by about 13%, to roughly $25,300, before the extra $110,000 stops paying its way. Option B creates more value if the forecasts hold; Option A is far more forgiving if they do not.

So the decision turns on the business's situation:

- **If cash is tight or the business needs funds for something more valuable**, Option A's lower cost and faster payback may be the right choice, and the business is consciously giving up about $16,000 of value for flexibility.
- **If volumes are uncertain beyond a few years**, Option A's quicker recovery reduces exposure.
- **If the business has the funds and confidence in volumes**, Option B creates more value.

Whichever is chosen, writing down the trade-off, "we chose A to keep cash available for the second shop fit-out, accepting a lower NPV", makes the decision honest and reviewable.

## Options with different lifespans

Comparisons get harder when alternatives last different lengths of time. A cheaper machine that lasts four years and a dearer one that lasts eight are not directly comparable on NPV, because the cheaper one would need replacing halfway through. Either compare them over a common period, including the replacement, or convert each NPV into an equivalent annual amount over its own life and compare those. Your accountant can help with the arithmetic. The point is to compare like with like, not to let a shorter life make an option look cheaper than it is.

## Use a sequence when measures disagree

1. **Name the objective.** Total value, rate of return, liquidity or reduced exposure?
2. **Name the binding constraint.** Is cash scarce? Are key people scarce? Is there a deadline?
3. **Check whether the options are alternatives.** For mutually exclusive options, compare NPV and the return on the extra investment, not IRR alone.
4. **Look at scale and timing.** Percentages hide size; payback hides later cash flows.
5. **Check the assumptions.** Measures sometimes disagree only because they were calculated on different cash flows or time horizons.
6. **Make the trade-off explicit.** If you choose faster payback over higher NPV, say so and say why.

## Present the numbers with their meaning

A one-line summary such as "IRR 20%, payback 3.3 years" invites a decision without understanding. For any significant investment, a short paper should show:

- **NPV, IRR and payback together**, each with a sentence on what it means here.
- **The main assumptions**, especially volumes, prices and how long savings last.
- **The break-even point** for the most uncertain assumption.
- **The alternatives considered**, including a cheaper or later option.
- **The trade-off being accepted**, in plain words.

That page takes an hour to prepare and makes the decision far easier to review a year later, when someone asks why this option was chosen.

## Do not let one number decide everything

Any single financial measure, applied to every decision, will steer the business in a particular direction. A business that approves only projects with a high return on investment or a short payback will systematically favour quick, small, certain improvements. Over time it will underinvest in things whose value is real but harder to put in a spreadsheet:

- **Options**: small investments that create the right to do something bigger later, such as a trial in a new market. The [risk is also the opportunity you miss](/reados/collections/risk-controls-and-assurance/risk-is-also-the-opportunity-you-miss/) article covers weighing these.
- **Capability**: skills, systems and data that make future projects cheaper or possible.
- **Resilience**: backup suppliers, spare capacity or systems that reduce the damage from a shock.
- **Must-do work**: safety and compliance, which may have no return at all.

These still need discipline. The answer is to judge them by what they enable or protect, and to decide deliberately how much of the business's money goes to them, rather than letting a single return measure crowd them out. The [saying no to good projects](/reados/collections/project-sponsors-governance-and-decisions/saying-no-to-good-projects/) article covers comparing proposals of different kinds.

## How this applies to a small Australian business

- **Ask for NPV, IRR and payback together** on significant investments.
- **Use NPV as the main measure of value**, with IRR and payback as checks.
- **Compare alternatives on the extra investment**, not on headline percentages.
- **Check cash flows that change direction** before trusting an IRR.
- **Use a required return that fits the risk** of each investment.
- **Treat payback limits as cash constraints**, not value tests.
- **Build after-tax cash flows** with your accountant for real decisions.
- **Write down the trade-off** whenever the measures disagree.

## Signals worth watching

- Investment decisions made on IRR alone.
- Small quick projects always beating larger strategic ones.
- One hurdle rate used for every kind of project.
- Valuable investments rejected only on payback.
- Capability and resilience projects never funded.
- Nobody able to explain why one option was chosen over another.

## Common mistakes

- **Treating the highest percentage as the best choice.**
- **Ranking alternatives on IRR** without checking NPV.
- **Ignoring cash flows after the payback date.**
- **Trusting an IRR** when cash flows change direction.
- **Using a single number** for every decision.
- **Forgetting tax and financing effects** in real decisions.

## Frequently asked questions

**Which measure should we use?** All three, with NPV as the main measure of value and IRR and payback as checks on return and exposure.

**What discount rate should we use?** A rate reflecting what the business could earn elsewhere at similar risk, or its cost of funds plus a margin for risk. An accountant or adviser can help set it.

**Is payback ever the right deciding measure?** When cash is genuinely the binding constraint, or the future is very uncertain, it can carry a lot of weight. Make that reason explicit.

**Should we include financing costs in the cash flows?** Usually not directly. The discount rate reflects the cost of funds. Including interest as well can double count. Ask your accountant.

**What about the instant asset write-off and other tax rules?** Tax rules affect after-tax cash flows and change over time. Check current rules with the ATO or your accountant before relying on them.

## Questions to ask

- What question is each measure answering for this decision?
- Are these options alternatives, and what does the extra investment earn?
- Do any cash flows change direction later in the life?
- Is our required return right for this level of risk?
- Is cash really the binding constraint?
- What valuable investments might a single measure be crowding out?

## Bringing it together

NPV, IRR and payback are three lenses, not three votes. NPV shows total value, IRR shows the implied rate of return, and payback shows how long cash is at risk. When they disagree, look at scale, timing and the return on the extra investment, and decide which concern genuinely binds. Make the trade-off explicit, use a required return that fits the risk, and take care not to let one number crowd out investments in options, capability and resilience that a spreadsheet struggles to value.

---

*Source: KEVOS® notes, drawing on teaching material on capital budgeting and investment appraisal, and T. Arnold and T. Nixon, "Measuring Investment Value", in H. K. Baker and P. English (eds), Capital Budgeting Valuation (2011). Examples and figures in this article are illustrations, calculated before tax. This article is general information, not financial advice.*
