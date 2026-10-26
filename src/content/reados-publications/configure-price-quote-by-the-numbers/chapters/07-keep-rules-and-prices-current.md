---
book: configure-price-quote-by-the-numbers
chapterSlug: keep-rules-and-prices-current
order: 7
title: "Keep rules and prices current"
description: "Update costs and rules through a controlled step, test every change against a set of reference quotes, review the price differences before release and catch unit errors before customers do."
draft: false
---

A configurator is right on the day it goes live and starts drifting the day after. Steel prices move, wages rise, the factory buys a new folder that changes the labour minutes, the product manager adds a length, the production engineer tightens a rule. Every one of those changes is necessary, and every one can introduce an error that the configurator will then repeat in every quote until someone notices. Keeping the system current is a continuous job, and doing it safely needs the same discipline as changing a drawing.

This chapter sets up the bench fabricator's process for changing costs and rules. It builds a set of reference quotes, defines who changes what and how, reviews the price differences each change causes before release, dates changes so open quotes are honoured, and checks inputs for impossible values. The failure case is a sheet price entered per sheet instead of per square metre, which would have raised every price by more than half.

## Reference quotes

The heart of the process is a set of **reference quotes**: configurations whose correct prices, bills of materials and outputs have been checked and approved. The firm used the roughly 40 configurations from Chapter 2's pairwise test set, which together cover every pair of option values, plus the boundary configurations for each rule. For each, it stores the approved configuration, price, cost breakdown and bill of materials.

Every proposed change is run against all of them before it is released. The configurator produces a difference report: which reference quotes changed, by how much and why, line by line in the cost breakdown. A change that is supposed to affect only benches with sinks should change only those reference quotes. A change that moves prices by more than a set amount is flagged for a closer look.

## Who changes what

Chapter 3 set owners for each input. The update process for each is the same short sequence.

```figure
type: steps
title: Changing a cost, rule or option
caption: This is an illustration of the firm's procedure. A change is not live until the reference run has been reviewed and approved by the input's owner and the product manager.
- Propose | the owner enters the change in a draft copy of the table, with the reason and the effective date
- Run references | the configurator prices all reference quotes with the draft and lists every difference
- *Review | the owner and the product manager check each difference is expected; anything over 10% is explained
- Approve and date | the change is released with a revision number and an effective date
- Communicate | sales staff are told what changed; price lists generated from the model are refreshed
```

The difference report is the part people actually read. It lists each reference quote with its old price, new price and change, sorted with the largest changes first, and for each one the input that caused it. A reviewer can see in a minute whether the change did what it was meant to do and nothing else. A report that showed only "42 prices changed" would invite a tick without a look.

The steps take about an hour for a routine cost change. A rule change takes longer, because the production engineer and the estimator review the reference configurations it affects for buildability as well as price.

## See how a cost change spreads

A single cost change affects configurations very differently, depending on how much of each one is that cost. This is an illustration. When the stainless sheet price rose **12%**, from A$95 to about A$106.40 per square metre, the reference run showed:

```figure
type: bars
title: Price change from a 12% sheet price rise, by configuration
unit: % change in price
max: 6
caption: This is an illustration from the firm's reference run. Benches with more sheet area per dollar of price, such as long benches with two undershelves and a high splashback, move most.
- 900 × 600, no options | 1.4
- 1,800 × 750, one undershelf, 100 mm splashback | 3.6
- 3,000 × 750, one undershelf, centre sink | 3.1
- *2,700 × 750, two undershelves, 300 mm splashback | 4.6
```

The small plain bench moved about **1.4%**, because labour, legs and feet dominate its cost. The long bench with two undershelves and a high splashback moved about **4.6%**, because sheet is a larger share. The bench with a sink moved less than its size suggests, because the bought-in sink bowl is a large share of its cost. A flat 4% increase across the price list would have overcharged small benches and undercharged large ones. Pricing from the model, with the change reviewed through the references, avoided both.

## Date every change

A change has an effective date, and quotes are priced with the tables in force on the day they are issued. A quote issued last week at the old sheet price remains valid at that price for its 30 days, as Chapter 4 promised. The configurator keeps every revision of every table, so it can re-create any past quote exactly: the configuration, the costs and the rules in force on the day. That matters when a customer accepts a quote near the end of its validity, and when an auditor or the accountant asks how a price was set.

## Check inputs for the impossible

Most errors in cost tables are not subtle. They are a value typed in the wrong unit, a misplaced decimal point or a number pasted into the wrong row. The firm added range checks to every input: a sheet price per square metre between A$40 and A$250, a labour rate between A$50 and A$150 an hour, labour minutes for any single operation under 600. A value outside its range cannot be saved without the owner confirming it, with a reason. Each unit is shown beside its field, in words: "A$ per square metre, excluding GST".

## Imported parts and the exchange rate

Some costs move with the exchange rate rather than a supplier's letter. The firm's sink bowls are imported and priced by the importer in US dollars, converted at the rate on the day of purchase. This is an illustration. A bowl costing about **US$122.10** is about **A$185.00** when the Australian dollar buys 66 US cents. If the dollar falls to 62 US cents, the same bowl costs about **122.10 ÷ 0.62 ≈ A$196.94**, about A$11.94 more, which at a 35% margin is about **A$18.36** more in price for every bench with a sink.

The firm does not chase every movement. The cost table holds the bowl in Australian dollars, and the purchasing officer reviews it each month against the importer's current price, changing it through the normal process when it moves by more than 3%. The reference run then shows exactly which configurations change, which here means only benches with sinks. Holding imported parts in a separate line of the cost table, rather than folding them into a general material rate, is what makes that possible. When the exchange rate moves sharply, the firm can see in minutes which part of its range is exposed and by how much.

## Rules change too

Rule changes need the same care. When the product manager added the 3,300 mm length described in Chapter 2, the change touched the option list, the leg rule, the centre-sink rule and the labour table for the longest benches. The reference set gained four new configurations at the new length. The production engineer reviewed each for buildability and the estimator priced one by hand to check the model. Only then was the length released, about three weeks after the decision to add it. The release note told sales staff, who had been fielding requests for it, that it was now available and what lead time to expect.

## Test the outputs as well as the prices

A rule change can leave every price correct and still break something downstream: a bill of materials missing a part, a drawing that no longer fits its sheet, a job card with the wrong operation. The reference run therefore compares every output for each reference configuration, not just the price.

```figure
type: checklist
title: What the reference run compares for each configuration
caption: This is an illustration of the firm's reference checks. A difference in any line must be explained before a change is released.
- Validity: the configuration is still allowed or refused as before | refusal messages unchanged unless the rule changed
- Price and every cost line | differences listed with the input that caused them
- Bill of materials, part by part, with quantities | must match the priced parts exactly
- Drawing generated or reused, with the right identifier and revision | spot-checked by the estimator
- Job card operations and standard minutes | consistent with the labour table
- Lead time calculation with a fixed test backlog | unchanged unless capacity inputs changed
- x A change released with unexplained differences | review again or withdraw
```

## Retire what no longer sells

Ranges grow by addition and rarely shrink, but every option has a cost: rules, tests, drawings, stock of bought parts and the estimator's attention. Once a year, the product manager reviews sales by option value from the configurator's records. Values that have not sold in two years are candidates for retirement. This is an illustration. In the first annual review, the 300 mm splashback on 600 mm deep benches had sold three times in two years, each time to the same customer. The firm kept it for that customer as a special request and removed it from the standard model, which removed several reference configurations and one awkward rule about wall brackets on shallow benches.

Retiring an option follows the same change process, with one extra step: open quotes that include the option are honoured, and the customers who bought it recently are told it is now a special request rather than discontinued, because some will reorder.

## Watch the margin in the accounts

The reference run checks that the model gives the intended prices. It cannot check that the model's costs match reality. That needs the accounts. Each month, the accountant compares the margin each completed order was priced at with the margin it achieved, using the actual material and labour recorded against its job. A gap that persists for one kind of bench points to a cost table or labour entry that has drifted, which then goes through the change process. Chapter 3's six-monthly check is the deep version; the monthly comparison is the early warning.

## Keep the model's history

Every table, rule set and price list lives under revision control, with who changed it, when, why and with which reference run. When a customer queries a price from six months ago, or a margin looks wrong in the accounts, the history answers the questions quickly: which revision was used, what it contained and what it replaced. The configurator stamps the model and cost-table revisions on every quote, as Chapter 2 described, so the trail starts from the document the customer holds.

## A failure case: the price per sheet

This is an illustration. The firm's stainless supplier sent a new price list quoting sheets, not square metres: **A$273.60** for a 2,400 × 1,200 mm sheet of 1.2 mm 304. The purchasing officer, in a hurry, typed A$273.60 into the field for the sheet price per square metre. The correct figure was **273.60 ÷ 2.88 = A$95.00**, unchanged from before.

This was before range checks existed. The reference run caught it. Every reference quote's price had risen, by up to more than half. For the 1,800 × 750 bench, the sheet cost would have risen from about A$247.95 to about **A$714.10**, and the price from about A$1,283.67 to about **A$2,000.82**, a rise of about **56%**. The review step flagged every reference quote as changing by more than 10%, and the purchasing officer saw the mistake immediately.

Without the reference run, the change would have gone live, and the next quotes would have gone out at prices no customer would accept. The firm would probably have noticed within a day, when the win rate collapsed or a representative questioned a price, but not before some customers had been sent absurd quotes. The correction was the range check described above, and a habit: purchasing converts supplier prices to the table's unit on a worksheet that shows the conversion, attached to the change. The reference run was the safety net. The range check is now the first line of defence, and the conversion worksheet is the habit that stops the mistake being made at all.

## How this applies to a small Australian business

Small manufacturers update prices informally: someone edits a spreadsheet when a supplier's letter arrives. That works until it does not. A set of 30 to 40 reference quotes, re-priced and reviewed whenever a cost or rule changes, is the cheapest insurance a configurator can have, and it costs an hour per change. Supplier prices in Australia come in many units, per sheet, per kilogram, per metre and per tonne, and with or without GST, so convert them on a worksheet and range-check the result. Keep every revision, because a past quote you cannot reproduce is a quote you cannot defend. If the configurator was built by an outside developer, make sure the reference run is something your own staff can start and read, not a service you have to book.

## Exercise: a labour rate rise

The workshop's labour rate rises from A$85 to **A$90** an hour, with overhead still at 25% of labour. For the 1,800 × 750 bench, with material A$435.95 and 225 minutes of labour, what is the new cost, the new price at a 35% margin rounded up to the next A$5, and the percentage change from A$1,285? Would you expect the 900 × 600 plain bench, with 150 minutes of labour, to change by more or less in percentage terms, and why?

**Worked answer.** Labour is **225 ÷ 60 × 90 = A$337.50**, overhead **A$84.38**, so cost is **435.95 + 337.50 + 84.38 ≈ A$857.83**. Price is **857.83 ÷ 0.65 ≈ A$1,319.73**, rounded up to **A$1,320**, about **2.7%** above A$1,285. The 900 × 600 plain bench should change by **more** in percentage terms, because labour is a larger share of its cost: it has little sheet and the same legs and feet. That is the opposite of the sheet price rise, where it changed least. The reference run would show both effects, which is why reviewing the run is more useful than applying one percentage to the whole list.
