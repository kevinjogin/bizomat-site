---
title: "What the NPV spreadsheet hides: timing, incremental cash and the assumptions behind the number"
description: "Net present value turns future cash into today's dollars, but it is only as good as its inputs. How to check incremental cash flows, timing, the discount rate and how fragile the answer is."
publishDate: 2026-10-04
category: "Business"
tags:
  - finance
  - validation
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

A business case arrives with a net present value of $62,000. The spreadsheet is tidy, the formula is correct and the number is positive. The discussion moves quickly to funding and timing. But what does the $62,000 actually represent? That depends on which cash flows were included, when they are assumed to arrive, whether ongoing costs were captured, what discount rate was used and how realistic the forecasts are.

**Net present value (NPV)** is one of the most useful tools for investment decisions, because it puts money spent and received at different times on a common footing. Its danger is that a precise output can make uncertain inputs feel settled. The formula does not remove judgement. It concentrates judgement inside the assumptions, where it is easy to overlook.

This article explains the idea of the time value of money in plain terms, why only incremental cash flows belong in the calculation, why timing changes the answer, what the discount rate really represents, how to test how fragile a result is, and why static NPV can understate the value of staging a decision. It is general information; your accountant can help apply these ideas to your own figures.

## Why timing matters

A dollar today is worth more than a dollar in five years. Money available now can be used: invested, used to pay down debt, spent on another opportunity or held as a buffer. Money promised later also carries the risk that it will not arrive as expected, and inflation may reduce what it buys.

Two ideas follow:

- **Compounding** moves value forward: money invested at a return grows, and the growth builds on itself.
- **Discounting** moves value back: it converts a future amount into its equivalent value today, at a chosen rate.

The basic relationship is: **present value = future amount ÷ (1 + rate) raised to the number of years**. At 8% a year, $10,000 received in five years is worth about $6,800 today.

```figure
type: line
title: What $10,000 due in the future is worth today at 8%
x: Years until received
y: Present value ($)
ymin: 0
ymax: 10500
mark: 5 | about $6,800
caption: Present value = future amount ÷ (1 + rate)^years. The later the cash, the less it is worth now.
- 0 | 10000
- 1 | 9259
- 2 | 8573
- 3 | 7938
- 4 | 7350
- 5 | 6806
- 10 | 4632
```

**Net present value** adds up the present values of all the cash flows from an investment, with the initial spending counted as negative. A positive NPV means that, under the model's assumptions, the investment is expected to earn more than the rate used to discount it.

The practical consequence is simple but often ignored: two projects with the same total benefit are not equally valuable if one delivers its benefit earlier. Earlier benefits can fund the next investment, reduce borrowing or protect cash. Business cases that present benefits as five-year totals hide this.

## Only incremental cash flows count

The most important discipline in investment appraisal is to include only **incremental cash flows**: the difference between the business's cash with the investment and without it. That sounds obvious but is often missed:

- **Labour savings** count only if staff costs actually fall, or the freed time is genuinely used for something valuable.
- **Extra output** counts only if the business can sell it.
- **New running costs** count: maintenance contracts, software licences, training, spare parts, energy, insurance.
- **Lost sales elsewhere** count: a new product may take sales from an existing one.
- **Working capital** counts: extra stock or longer customer payment terms tie up cash.
- **Downtime during installation** counts.
- **Benefits that would have happened anyway** do not count.

Profit and cash are also different. Depreciation affects accounting profit and tax but is not a cash payment; buying equipment is a cash payment but is not an expense in the year it happens. Build the model from cash, not from accounting profit. The [what would have happened anyway](/reados/collections/investment-appraisal-and-business-cases/what-would-have-happened-anyway/) article covers how to set a realistic comparison.

## Place cash where it actually moves

Cash flows should sit in the periods when cash really moves, not when it would be convenient to recognise them. Common errors include assuming benefits start on the day equipment is installed when there is a ramp-up period, forgetting that a major component needs replacing partway through the asset's life, and ignoring the cost of disposing of the asset at the end. Separate benefit start dates from project completion dates, and show cash flows year by year rather than only as totals.

## The discount rate is a decision

The **discount rate** represents the return the business requires to justify committing money to this investment rather than another. It may reflect the cost of borrowing, the return owners expect or the risk of the project. It is not a neutral input:

- A rate that is too low makes distant benefits look more valuable than they are.
- A rate that is too high suppresses long-term investments.
- A riskier project may justify a higher rate than a safe one.

Three questions help govern it: who set the rate, what does it represent, and does the decision still hold across a reasonable range of rates? If a project's NPV turns negative with a small change in the rate, the decision depends on that assumption and should be discussed as such.

## Test how fragile the answer is

The number at the bottom of the spreadsheet is a summary of many assumptions. Before relying on it, find out which ones matter most:

- **Which three assumptions have the biggest effect on the result?**
- **What combination of reasonable adverse changes would make the NPV zero or negative?**
- **What evidence supports each major assumption**: contracts, quotes, pilots, historical data, or someone's judgement?

A project that remains attractive across a wide range of assumptions is a different decision from one that is attractive only if everything goes to plan. The [testing the numbers you are given](/reados/collections/investment-appraisal-and-business-cases/testing-the-numbers-you-are-given/) article covers how to check the rates a forecast depends on.

## Positive NPV is not automatic approval

A positive NPV is a strong signal, not a decision rule:

- Another option may have a higher NPV.
- The business may not be able to fund every positive investment and must choose.
- The business may lack the people to deliver it alongside other priorities.
- The benefits may depend on another project or on customer behaviour.
- Waiting and learning more might be worth more than committing now.

```figure
type: checklist
title: Why a positive NPV is not automatic approval
caption: Equally, a weak NPV may still be right for safety, compliance, resilience or capability.
- ? Another option may have a higher NPV
- ? The business may not fund every positive project
- ? People may not be available to deliver it
- ? Benefits may depend on other projects or customers
- ? Waiting and learning may be worth more than committing now
```

Equally, an investment with a weak NPV may still be the right choice for reasons the cash flows do not capture, such as safety, compliance, resilience or a strategic capability. When that happens, make the trade-off visible: state the financial cost of the choice and why the business is accepting it.

## What the model leaves out

NPV works well when the important costs and benefits can be expressed credibly as cash. It struggles with resilience, safety, reputation, staff capability, customer trust and environmental effects. These should not be ignored because they do not fit the spreadsheet, nor given invented dollar values to make the model look complete. Keep a clear boundary between what has been quantified and what matters but has not, and present both to whoever decides.

## Static NPV can undervalue staging

A standard NPV assumes a fixed set of future cash flows. Real investments change as information arrives. A pilot reveals whether customers buy; a trial reveals whether a process works; early engineering firms up the cost. An investment structured in stages, where the business can stop or change course after learning, can be worth more than a single all-or-nothing commitment with the same expected cash flows, because the business keeps the option to avoid the bad outcomes.

Where uncertainty is significant and commitments are hard to reverse, ask whether the investment could be structured as a sequence of smaller decisions. The [learn before you commit](/reados/collections/growth-business-models-and-new-markets/learn-before-you-commit/) article explores this.

## A review checklist

| Area | Question |
|---|---|
| Comparison | What happens if we do not invest? |
| Incremental cash | Which cash flows change only because of this investment? |
| Completeness | Are running costs, replacements, working capital and end-of-life costs included? |
| Timing | Are benefits placed when they will realistically arrive, including ramp-up? |
| Life | Is the assumed life of the investment realistic? |
| Discount rate | Who set it, what does it represent, and does the answer hold across a range? |
| Dependencies | Which benefits depend on other projects or customer behaviour? |
| Sensitivity | Which assumptions could change the answer? |
| Alternatives | Is this still the best use of the money and people? |

## A worked example

This is an illustration. A printing business is considering a new $400,000 press. The supplier's business case shows savings of $100,000 a year for six years: $600,000 in total against a $400,000 cost. At an 8% discount rate, the NPV is about $62,000, comfortably positive.

The owner checks the cash flows:

- **The savings assume two operators' wages disappear.** In practice, the business plans to keep both and use them on finishing work it currently outsources. That outsourcing saving is real, but smaller than the wages. The owner estimates net labour and outsourcing savings of about $100,000 a year are still achievable once fully running.
- **A maintenance contract of $12,000 a year** is required and was not in the case.
- **The first year will be a ramp-up**, with savings of about half the full level while staff learn the press and work is moved across.

The revised cash flows are about $38,000 in the first year ($50,000 of savings less $12,000 of maintenance) and $88,000 a year for the following five years. The nominal total is still $478,000, more than the price. But at 8%, the NPV is about −$39,000. At 6% it is about −$14,000, and at 10% about −$62,000. The investment does not pay its way on these assumptions at any of these rates.

```figure
type: bars
title: The $400,000 press: supplier case against the checked case
unit: $ NPV at 8%
caption: Missing maintenance, a ramp-up year and wages that do not disappear turn a positive case negative at any rate from 6% to 10%.
- Supplier's case: $100,000 a year | 62000
- *Checked case at 8% | −39000
- Checked case at 6% | −14000
- Checked case at 10% | −62000
```

The owner does not reject the idea outright. Two options are tested: a lease that shifts more of the cost into later years and includes maintenance, and a smaller press that handles most of the work at a lower price. The smaller press shows a positive NPV across the range of rates, and the business chooses it, recording the assumptions so the actual savings can be compared with the forecast after a year.

## How this applies to a small Australian business

Small businesses often compare a purchase price with a total of future savings and stop there. Practical steps:

- **Build cash flows year by year**, not just as totals.
- **Include only incremental cash**, and include all of it.
- **Allow for ramp-up**, replacements and end-of-life costs.
- **Choose a discount rate deliberately**, and test the answer across a range.
- **Find the assumptions that matter most** and the evidence for them.
- **Keep unquantified factors visible** beside the NPV.
- **Consider staged or smaller options** where uncertainty is high.
- **Compare forecasts with actual results** after approval.
- **Ask your accountant** about tax, depreciation and financing effects.

## Signals worth watching

- Business cases that show only totals, not timing.
- Savings that assume costs disappear when they will not.
- Missing maintenance, licences or replacement costs.
- A discount rate nobody can explain.
- NPVs that turn negative with small changes in assumptions.
- No comparison of actual results with the original forecast.

## Common mistakes

- **Treating NPV as a fact** rather than a model.
- **Building the model from profit** instead of cash.
- **Counting benefits that would have happened anyway.**
- **Ignoring timing and ramp-up.**
- **Treating positive NPV as automatic approval.**
- **Ignoring the value of staging** a decision.

## Frequently asked questions

**What discount rate should a small business use?** There is no single answer. Many businesses use a rate reflecting their cost of borrowing plus an allowance for risk, or the return the owners expect. Test the answer across a range, and ask your accountant for a sensible starting point.

**Is payback period good enough?** Payback is easy to understand and useful as a quick check on how long money is at risk, but it ignores what happens after payback and the timing of cash within the period. Use it alongside NPV, not instead of it.

**Should inflation be included?** Be consistent. If cash flows include expected price increases, use a rate that also includes inflation. If cash flows are in today's dollars, use a rate without it.

**How long should the analysis run?** For the realistic useful life of the investment, including any major replacement costs and end-of-life value or disposal cost.

**What if the important benefits cannot be put in dollars?** Present them clearly alongside the NPV, with whatever evidence is available, and make the trade-off explicit.

**Who should build the model?** Whoever knows the numbers best, with review by someone who does not benefit from the decision. Finance can check consistency, operations can check running costs and ramp-up, and sales can check demand assumptions.

## Questions to ask

- Which cash flows in this case would happen anyway?
- What running and replacement costs are missing?
- When will the benefits actually start?
- Who chose the discount rate, and does the decision hold across a range?
- What would make this NPV negative?
- Could we stage this decision to learn before committing fully?

## Bringing it together

NPV is valuable because it forces costs and benefits at different times onto a common basis. But it organises uncertainty rather than removing it. Include only incremental cash flows and include all of them, place them when cash really moves, treat the discount rate as a decision, test how fragile the answer is, keep unquantified factors visible and consider whether staging the decision would preserve valuable options. The stronger question is not whether the spreadsheet is correct, but whether the decision still makes sense when reality departs from the plan.

---

*Source: BIZOMAT notes, drawing on teaching material on the time value of money and capital budgeting, and on T. Arnold and T. Nixon, "Measuring Investment Value: Free Cash Flow, Net Present Value, and Economic Value Added", in H. K. Baker and P. English (eds), Capital Budgeting Valuation (2011). Examples and figures in this article are illustrations. This article is general information, not financial advice.*
