---
book: configure-price-quote-by-the-numbers
chapterSlug: price-from-cost-and-rules
order: 3
title: "Price from cost and rules"
description: "Build a configured product's price from material, labour and overhead with a target margin, avoid the markup-margin mix-up, round sensibly, show GST and keep prices in step with costs."
draft: false
---

A configurator that produces valid configurations in seconds but prices them badly only makes mistakes faster. Pricing is where the firm's margin is decided, and for configurable products it has to work for hundreds of combinations without anyone checking each one. That means the price must come from a model: costs that follow from the configuration, a margin set by policy, rounding rules, and a way of keeping the costs current when steel prices or wages change.

This chapter builds the bench range's price model. It costs one configuration in full, applies a target margin correctly, compares cost-based pricing with an option price list, rounds and shows GST, and plans for cost changes. It includes the most common arithmetic error in small-business pricing, confusing markup with margin, which in the running case cost about 12% of the price on every bench before it was found.

## Cost one configuration completely

Start with one representative configuration and cost it in full, line by line. This is an illustration: a bench **1,800 mm** long and **750 mm** deep, with one undershelf, a **100 mm** splashback, no castors and no sink.

```figure
type: formula
title: Costing one bench from its configuration
formula: cost = material + labour + overhead        price = cost ÷ (1 − target margin), rounded up to the next A$5
caption: This is an illustration. Stainless sheet at an assumed A$95 per square metre including allowance for offcuts; labour at A$85 an hour; overhead at 25% of labour; target margin 35%. Amounts exclude GST.
- Top, 1.35 m² | A$128.25
- Undershelf, 1.08 m² | A$102.60
- Splashback, 0.18 m² | A$17.10
- Legs and feet, four of each | A$152.00 + A$36.00
- Labour, 225 minutes | A$318.75
- Overhead, 25% of labour | A$79.69
step: cost ≈ 435.95 + 318.75 + 79.69 ≈ A$834.39
step: price = 834.39 ÷ 0.65 ≈ A$1,283.67, rounded up to A$1,285
step: GST = A$128.50, so A$1,413.50 including GST
```

Each line comes from a rule. The sheet areas follow from the length, depth and options. The legs follow from the length: four up to 2,400 mm, six above, as Chapter 2's consequence rule says. The labour minutes come from a labour table built by timing the factory's operations: cutting, folding, welding, polishing and assembly, with minutes per metre of edge or per component. The overhead rate comes from the firm's accounts: indirect costs such as rent, supervision and equipment, spread over direct labour.

```figure
type: stack
title: Where the bench's A$834.39 of cost goes
unit: A$, excluding GST
caption: This is an illustration from the costing above. Labour and its overhead are almost half the cost, which is why the labour table deserves as much care as the material prices.
- Material, sheet, legs and feet | 435.95
- Labour, 225 minutes | 318.75
- Overhead on labour | 79.69
```

## Margin is not markup

The firm's target is a **35% margin**: 35% of the selling price is left after costs. The price that achieves it is cost divided by 0.65. Many businesses instead apply a **markup**, cost multiplied by 1.35, believing it gives the same result. It does not.

A markup of 35% on A$834.39 gives a price of about **A$1,126.43**. The margin on that price is **(1,126.43 − 834.39) ÷ 1,126.43 ≈ 25.9%**, not 35%. The price is about **A$158.57**, or **12.3%**, below the price the policy intended. On every bench.

```figure
type: compare
title: Margin and markup on the same A$834.39 bench
cols: Price, excluding GST | Margin earned
caption: This is an illustration. A markup of m gives a margin of m ÷ (1 + m) whatever the cost, so a 35% markup always earns about 25.9%.
- 35% markup, cost × 1.35 | A$1,126.43 | 25.9%
- *35% margin, cost ÷ 0.65, rounded up | A$1,285.00 | 35.1%
- 54% markup, close to the markup that gives a 35% margin | A$1,284.96 | 35.1%
```

The two ideas are easy to confuse because they use the same number. The rule is simple: margin is a share of price, markup is a share of cost. The firm writes its policy as a margin and the configurator calculates the price as cost divided by one minus the margin, with the formula shown in the price model so anyone can check it.

## Price lists or cost-plus

Many manufacturers publish a price list: a base price for each size plus a fixed price for each option. Customers and sales staff like price lists because they are easy to read. The risk is that a list built years ago drifts from the cost of each combination, especially when options interact.

For the bench range, the cost model gives an option's price as the change in cost it causes, divided by 0.65. This is an illustration. A second undershelf on the 1,800 × 750 bench adds about **A$155.73** of cost, so about **A$239.58** of price. Raising the splashback from 100 mm to 300 mm adds about **A$51.91** of cost, about **A$79.86** of price. On a 2,700 mm bench, the same options cost more, because the areas and minutes scale with length.

The firm decided to price every configuration from the cost model, and to generate a printed price list from the model for the most common sizes, refreshed whenever costs change. The list is then a view of the model, not a separate source of truth that can drift away from it.

## Round, and say how

Customers see prices, and A$1,283.67 looks like a calculation, not a price. The firm rounds every configured price **up to the next A$5** excluding GST, which adds at most A$4.99 and keeps the margin at or slightly above target. Rounding up rather than to the nearest keeps rounding from ever eroding the margin. The rule is written in the price model, so that every quote rounds the same way.

## Show GST correctly

The firm is registered for GST, so it adds 10% to its prices for Australian customers. Its quotes show each line excluding GST, the GST and the total including GST, in the same format on every quote. For the bench above that is A$1,285.00, GST A$128.50 and A$1,413.50 including GST. Chapter 4 covers the rest of the quote document.

## Check the price model against reality

A price model is only as good as its costs. The firm checked it against the actual costs of benches it had built, from its accounts and job records. This is an illustration. For 30 benches built in the previous quarter, the model's cost was within **±6%** of the recorded actual cost for 26 of them. The four outliers were all long benches with sinks, where the labour table underestimated the time to weld and polish around the sink bowl. The labour table was updated with a separate entry for sink cut-outs, after timing three of them.

The check is repeated every six months, because a labour table that was right last year drifts as methods, people and equipment change. The production manager also asks the workshop to flag any bench that took noticeably longer than its job card allowed. Those flags, a few a month, point straight at the entries in the labour table most likely to be wrong, and they cost nothing to collect.

## Keep prices in step with costs

Stainless steel prices move with world markets and exchange rates, and wages rise each year. A configurator that keeps quoting last year's costs quietly erodes margin.

This is an illustration. The bench above uses about **2.61 m²** of sheet, about **A$247.95** at A$95 per square metre. If the sheet price rises **12%**, the bench's cost rises by about **A$29.75** to about **A$864.14**. At the old price of A$1,285, the margin falls from about **35.1%** to about **32.8%**. The model, updated with the new sheet price, gives a new price of about A$1,329.45, rounded to **A$1,330**.

The firm's rule is that the purchasing officer updates the sheet price in the cost table whenever the supplier's price changes by more than 3%, and that every material, labour and overhead rate is reviewed at least each quarter. Each change has a date, and the configurator stamps the cost-table revision on every quote. Chapter 7 covers how such changes are tested before they reach customers.

## Price quantities from the set-up

Customers fitting out a new line often order several identical benches. The labour table separates **set-up** time, done once per order line, from **run** time, done for each bench. This is an illustration. Of the 225 minutes for the bench above, about **45 minutes** is set-up: programming the folder, preparing jigs and first-off checks. The other 180 minutes are run time.

For five identical benches, each bench carries a fifth of the set-up: **180 + 45 ÷ 5 = 189 minutes**, A$267.75 of labour and A$334.69 with overhead. The cost per bench falls to about **A$770.64**, and the price to about **A$1,185.60**, rounded up to **A$1,190**, A$95 less per bench than a single bench. The configurator calculates quantity prices this way automatically, so a quantity discount is a consequence of real cost, not a concession, and it does not erode the margin. Chapter 6 deals with discounts that are concessions.

## Costs the model leaves out

Some costs do not belong in a per-bench price and need their own lines:

- **Freight**, which depends on the delivery address and the number of benches, quoted as a separate line from a freight table by postcode zone.
- **Installation**, quoted separately when the customer wants it, from a time estimate.
- **Small orders**, where setup and administration are a large share of a single cheap bench, covered by a minimum order value.
- **Special requests**, which Chapter 2 routes to an estimator and which are priced by hand with the same margin rule.

Leaving freight inside the bench price would make every bench's price depend on where it goes, which customers find confusing and which makes comparisons between quotes misleading. Separate lines also let a customer collect from the factory, or arrange their own installer, and see exactly what they save.

## Decide who may change what

A price model has several kinds of input, and each should have one owner who changes it through a recorded step:

- **material rates**, owned by the purchasing officer, who sees supplier prices first;
- **the labour table**, owned by the production manager, from timed operations;
- **the overhead rate**, owned by the accountant, from the annual accounts;
- **the target margin and rounding rule**, owned by the owner, as pricing policy;
- **the formulas** that combine them, owned by whoever maintains the configurator, changed only with a test against the reference benches in Chapter 7.

Separating them matters because each person knows their part and nobody knows all of it. A purchasing officer can update a sheet price without understanding the margin formula. An owner can change the margin policy without touching the labour table. And when a price looks wrong, the revision history shows which input changed, when and by whom. In the old spreadsheet, all of these were mixed together in one file that anyone could edit, which is how a markup formula survived for years without anyone questioning it.

## A failure case: 35% the wrong way

This is an illustration. The spreadsheet the estimators used before the configurator calculated prices as cost multiplied by 1.35. Everyone in the firm believed this gave a 35% margin. It had been set up years earlier by a bookkeeper who had since left.

The error was found during the cost-model work for the configurator. The production engineer compared the configurator's first prices with the spreadsheet's for the same benches, and every configurator price was about 14% higher than the spreadsheet's. The first assumption was that the configurator was wrong. The owner and the accountant worked through one bench by hand and found the spreadsheet's markup.

The detection came from comparing two independent calculations of the same thing, which is why the price model's first test was against the old prices, not just against hand calculations. The correction was straightforward in the model and difficult in the market. A 14% price rise overnight would lose customers. The firm moved prices up in two steps over six months, starting with new customers and special requests, while watching the win rate from Chapter 1's measures. The realised margin rose from about 26% to about 33% over the year, and the win rate held.

## How this applies to a small Australian business

Small manufacturers often price from a spreadsheet set up long ago by someone no longer there. Check the margin arithmetic in it today, with one bench worked by hand: the markup-margin confusion is common and expensive. Build the price from costs that can be updated in one place, and let the purchasing officer own the material rates, because they see supplier price changes first. Australian steel and stainless prices can move quickly with exchange rates, so a quarterly review is a minimum. Quote prices with GST clearly shown, and keep freight and installation as separate lines.

## Exercise: a long bench with a sink

A customer configures a **2,700 mm** by **750 mm** bench with a centre sink, one undershelf, a 300 mm splashback and no castors. The cost model gives material **A$712.40**, labour **340 minutes** at A$85 an hour, overhead at 25% of labour and a sink bowl bought in at **A$185.00**. Calculate the cost, the price at a 35% margin rounded up to the next A$5, and the price including GST. What would a 35% markup have given, and what margin would that have earned?

**Worked answer.** Labour is **340 ÷ 60 × 85 ≈ A$481.67** and overhead **0.25 × 481.67 ≈ A$120.42**. Cost is **712.40 + 185.00 + 481.67 + 120.42 ≈ A$1,499.48**. Price is **1,499.48 ÷ 0.65 ≈ A$2,306.90**, rounded up to **A$2,310** excluding GST, and **A$2,541** including GST. A 35% markup would have given **1,499.48 × 1.35 ≈ A$2,024.30**, a margin of **(2,024.30 − 1,499.48) ÷ 2,024.30 ≈ 25.9%**. Whatever the cost, a 35% markup always earns a margin of 0.35 ÷ 1.35 ≈ 25.9%, which is why the error was so consistent.
