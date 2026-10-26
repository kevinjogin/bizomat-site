---
book: configure-price-quote-by-the-numbers
chapterSlug: control-discounts-and-margin
order: 6
title: "Control discounts and margin"
description: "Show the margin effect of every discount, set approval levels, separate earned price differences from concessions, remove manual overrides and measure discounting after the change."
draft: false
---

Chapter 1's baseline found that discounts gave away about A$29,000 of price a year at the bench fabricator, four times more than its pricing errors. Nobody had decided to give that money away. Each discount was a reasonable-looking decision by a sales representative trying to close a deal, made on the phone without seeing what it did to the margin, and never added up afterwards. A configurator can make prices consistent, but discounting happens after the quote, where the configurator cannot see it unless the process is designed so that it can.

This chapter puts discounts under control without taking away the sales team's ability to win work. It shows what a discount does to margin, separates price differences the firm earns from concessions it gives, sets approval levels, makes every discount visible in the quote record, and measures the result. The failure case is a manual price field that let discounting carry on untouched after the policy was written.

## What a discount does to margin

A discount comes straight off the margin, not off the price in proportion. This is an illustration. The 1,800 × 750 bench from Chapter 3 costs about **A$834.39** and is priced at **A$1,285**, a margin of about 35.1%.

```figure
type: bars
title: Margin on the A$1,285 bench at different discounts
unit: % margin
max: 40
caption: This is an illustration. Cost stays at A$834.39 whatever the discount, so each percentage point off the price costs more than a point of margin.
- No discount | 35.1
- 3% discount, A$1,246.45 | 33.1
- *8% discount, A$1,182.20 | 29.4
- 12% discount, A$1,130.80 | 26.2
```

A 12% discount takes the margin from about 35% to about 26%, a quarter of the margin gone. Another way to see it: at a 35% margin, a 7% discount means the firm must sell about **25%** more benches to earn the same gross profit, because each bench now contributes 28% of its price instead of 35%. Sales representatives rarely think about it that way, and the configurator's job is to make it visible.

## Earned differences and concessions

Not every price difference is a discount. The firm separated two kinds:

- **Earned differences** follow from real cost: quantity pricing from shared set-up, as Chapter 3 calculated; a lower freight charge for collection; a lower price for a configuration that is simpler to make. These are calculated by the configurator and keep the margin at target.
- **Concessions** are price reductions the firm chooses to give for a commercial reason: to win a new customer, match a competitor, or keep a large account. They reduce the margin, and they need a reason and an approval.

Treating the two differently changed the conversation. A sales representative offering a customer a lower price for ten benches is passing on an earned difference, not discounting, and needs no approval. Offering 8% off a single bench to beat a competitor is a concession, and someone with authority should decide it knowingly.

## Approval levels

The firm set approval levels by the size of the concession, using the margin effect as the guide.

```figure
type: decision
title: Who approves a concession?
question: How large is the concession on the configured price?
caption: This is an illustration of the firm's policy. Every concession records its reason; approvals are recorded in the quote by the approver, not by email.
- Up to 3% | Sales representative, with a reason | margin stays above about 33%
- *Over 3% up to 8% | Sales manager | margin falls to about 29%; must state the competing offer or strategic reason
- Over 8% | Owner | margin below about 29%; considered with the customer's history and the workshop's load
```

The reasons are a short list: matching a documented competing offer, a new customer the firm wants to win, a strategic account, a quiet workshop, and other, with a note. Over time, the list of reasons shows which pressures drive discounting. The firm found that "matching a competing offer" was often given without any record of the offer, and asked for the competitor's quote or a note of its price to be attached. That alone reduced the number of concessions, because some of the "competing offers" turned out to be guesses.

## Make the discount a visible line

In the quote, a concession appears as its own line beneath the configured price: "Discount, approved by" the approver, with the percentage and amount, excluding GST. It is never hidden by reducing the bench price itself. That has three effects. The customer sees the configured price and the concession, which supports the value of the product. The firm's records show the full price and the concession separately, so discounting can be measured. And next year's quote for the same customer starts from the full price, not from last year's discounted one, unless a concession is deliberately approved again.

## Watch the workshop's load

The owner's approval for large concessions considers how busy the workshop is. In a quiet month, a bench sold at a 26% margin still contributes to fixed costs that would otherwise be idle. In a busy month, the same bench displaces full-margin work or forces overtime. The configurator shows the approver the workshop load from Chapter 5 beside the request. The owner approved more concessions in quiet months and fewer in busy ones, which matched price to capacity without any formal yield-management system.

## A failure case: the price field nobody locked

This is an illustration. The discount policy was written and explained to the sales team in the first month of the configurator's use. Three months later, the discounting figures had barely moved: about 28% of won quotes still carried some reduction, at an average of about 6.5%.

The firm investigated. The configurator, as first built, had a field that let a user overwrite the configured price before sending the quote, intended for special requests priced by hand. Sales representatives, under pressure on the phone, were typing a lower price into that field rather than requesting an approval. The quote record showed only the final price, so the concession was invisible. The configured price was not stored separately.

The detection came from measuring after the change, which is why Chapter 8 exists. Without the measurement, the firm would have believed its policy was working. The corrections were to remove the overwrite field from standard configurations, keep it only for special requests routed through an estimator, record the configured price permanently on every quote, and make the discount line the only way to reduce a price. The figures moved within a month.

## Measure the result

Six months after the corrections, the firm repeated Chapter 1's measure. This is an illustration. About **18%** of won quotes carried a concession, at an average of about **4%**. Over a year, with about 576 won benches at about A$2,400, that is about **576 × 0.18 × 2,400 × 0.04 ≈ A$9,953**, against about **A$29,030** before: a saving of about **A$19,077** a year.

```figure
type: compare
title: Discounting before and after the policy and the configurator change
cols: Before | After six months
caption: This is an illustration from the firm's quote records. The win rate is the guard against controlling discounts so tightly that sales are lost.
- Won quotes with a concession | about 30% | about 18%
- Average concession | about 7% | about 4%
- Annual price given away | about A$29,030 | about A$9,953
- *Win rate | about 40% | about 41%
- Concessions with a recorded reason | almost none | all
```

The win rate held at about 41%, slightly above the baseline, helped by faster quotes. That was the most important line in the table, and the one the owner had been most worried about when the policy was first proposed. A discount policy that cut concessions but lost sales would have been a failure, and the firm watched the win rate monthly for that reason.

## What the reasons revealed

After six months, the recorded reasons told the firm something it had not known. This is an illustration. Of the concessions approved, about **41%** were to match a competing offer, about **27%** to win a new customer, about **14%** for strategic accounts, about **11%** to fill a quiet workshop and about **7%** for other reasons.

The competing offers were the most useful. With the competitor's price attached, the firm could see which competitors were cheaper, on which products, and by how much. Two patterns emerged. On short, simple benches, an importer was consistently about 10% cheaper, with a longer lead time and lighter gauge. On long benches with sinks, the firm was rarely undercut at all. The firm stopped matching the importer on simple benches, explaining its gauge, finish and lead time instead, and won about half of those quotes anyway. It also realised it had been conceding on sink benches when no competitor had asked it to, because representatives had assumed every customer wanted a discount.

The "new customer" concessions were reviewed after a year. Customers who came in on a concession and then reordered at full price justified it. Those who never reordered, about a third, had been bought at a discount for nothing. The firm kept new-customer concessions but limited them to the first order.

## Teach the arithmetic, not just the rule

A policy that people follow because they must is weaker than one they follow because they understand it. The firm spent an hour with its sales team working through the margin figures above with real benches from recent quotes. The exercise that changed most minds was the volume one: at a 35% margin, a 7% concession needs about a quarter more sales to earn the same gross profit. The representatives knew they could not sell a quarter more benches by discounting 7%. Several said they had assumed a 7% discount cost the firm 7% of its profit, not a fifth of it.

The configurator now shows the margin, not just the price, to anyone requesting a concession, with the gross profit in dollars for the whole quote. Seeing that a concession on a 20-bench order costs the firm A$1,800 of profit changes the conversation in a way that a percentage does not.

## Customer price agreements

Large customers sometimes ask for a standing agreement: a set price or discount for a year in exchange for a commitment to buy. The firm treats these as concessions approved once, at owner level, and loads them into the configurator against that customer, so every quote for them shows the agreed terms automatically. Each agreement records the volume the customer expected to buy, and the firm reviews it at the end of the year against what was actually bought. One agreement, renewed for three years without review, turned out to have given a 6% concession to a customer whose purchases had fallen to a third of the committed volume. The annual review now catches that.

## Price rises without losing customers

Controlling discounts is half of margin control. The other half is raising prices when costs rise, as Chapter 3 described for stainless steel. The firm announces price changes with at least 30 days' notice to regular customers, explains the reason in a sentence, and honours all quotes issued before the change for their full validity. Customers rarely enjoy price rises, but they accept them far more readily when they are given notice and a reason, than when they discover a higher price on their next quote. In the year after the configurator went in, the firm raised prices twice, by about 4% and about 3%, and lost no regular customer as a result.

## Distributors and trade customers

Some of the firm's benches were sold through kitchen and fit-out contractors who resold them to their own customers. They needed a trade price with room for their own margin. The firm set a published trade discount, applied automatically when the configurator user was a registered trade customer, and kept it separate from concessions. Trade customers could still ask for a concession on a large project, through the same approval route. Keeping trade pricing as a rule rather than a negotiation removed most of the haggling from those accounts, and it treated every trade customer the same way, which they noticed and valued.

## How this applies to a small Australian business

In small firms, the owner often is the sales team, and discounting decisions are made in the moment, by phone or at a site meeting. A simple rule helps: know the margin before agreeing any reduction, record the reason, and look at the totals each quarter. Australian customers in tight markets will always ask for a better price. A clear answer, the configured price plus a deliberate concession where it is justified, is easier to give and defend than an improvised one. Remove any way of quietly changing a price that bypasses the record. Then, each quarter, spend half an hour on the concessions list: who gave them, why, and whether the customers who received them came back. That half hour is usually the best-paid work a small manufacturer's owner does all quarter.

## Exercise: weighing the concession

A customer will order **8** benches at the configured price of A$1,285 each, with a cost of A$834.39 each, if the firm gives a **10%** concession. Without it, the firm believes it has a **40%** chance of winning the order anyway. Compare the expected gross profit of offering the concession, assuming it wins the order for certain, with not offering it.

**Worked answer.** With the concession, the price is **1,285 × 0.90 = A$1,156.50** per bench, and gross profit is **(1,156.50 − 834.39) × 8 ≈ A$2,576.88**, won for certain. Without it, gross profit per bench is **1,285 − 834.39 = A$450.61**, so **A$3,604.88** for eight, but only with a 40% chance: an expected **0.40 × 3,604.88 ≈ A$1,441.95**. On these assumptions the concession is worth giving, at the owner's approval level since it exceeds 8%. The decision rests on the 40% estimate, so the reason recorded should explain it, and the outcome can later show whether such estimates are reliable.
