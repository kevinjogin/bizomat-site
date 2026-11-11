---
book: fair-dealing-by-the-numbers
chapterSlug: a-margin-you-can-explain
order: 3
title: "A margin you can explain: margin, markup and discounts"
description: "Check the tank quote's margin, catch the common error of applying a margin as a markup, measure what a discount does to gross profit and treat customers alike for like reasons."
draft: false
---

A price is fair, in the sense of Chapter 2, when it honestly estimates what it costs a going concern to supply the thing. That makes the margin part of the claim. If the workshop says, as a matter of policy, that it prices one-off stainless work at a 28% gross margin, then the margin on any particular quote should be 28%, and the workshop should be able to show it. A margin that drifts because of an arithmetic slip, or that bends for one customer and not another without a reason, makes the price less an estimate of worth and more an accident.

This chapter checks the tank quote with two BIZOMAT tools, examines a pricing error so common that the tools warn about it explicitly, measures what a modest discount does to the workshop's return, and asks when treating customers differently is fair. The arithmetic is simple. Its consequences are not.

## Margin and markup are different numbers

Gross margin is gross profit as a percentage of the selling price. Markup is gross profit as a percentage of cost. For the same price and cost they give different numbers, and confusing them is one of the commonest pricing errors in small businesses.

```figure
type: formula
title: Margin on price and markup on cost
formula: Margin = (Price − Cost) ÷ Price
formula: Markup = (Price − Cost) ÷ Cost
caption: For the tank, the same A$6,241.20 of gross profit is a 28.0% margin and a 38.9% markup.
- Price | A$22,290.00, excluding GST
- Cost | A$16,048.80, including contingency
step: Gross profit = 22,290.00 − 16,048.80 = A$6,241.20
step: Margin = 6,241.20 ÷ 22,290.00 = 28.0%
step: Markup = 6,241.20 ÷ 16,048.80 = 38.9%
```

The BIZOMAT [margin and markup](/tools/margin/) tool takes a unit cost and a selling price and returns the gross profit, the margin on price, the markup on cost and the cost's share of the price. It labels a margin of 30% or more as healthy, 10% to 30% as thin and below 10% as very low. Those bands are a generic rule of thumb, not a policy. The tool describes the tank's 28% margin as thin, which is a fair warning for many businesses but not a verdict on this one. The workshop's own policy, set from its overheads and the risk of one-off work, is what the quote must meet.

## Check the quote against its target

The BIZOMAT [quote margin check](/tools/quote-check/) adds material, labour and overhead or other costs to find the total cost, then compares the quoted price with a target margin. It reports the gross profit, the margin, the gap to target in percentage points and the price that would exactly meet the target. It reminds the user to check that freight, packaging, inspection, warranty, travel and contingency are included, and to check commercial terms such as payment and price validity before submitting.

This is an illustration. The workshop enters the tank quote.

| Input | Value |
|---|---|
| Quoted price | A$22,290.00 |
| Material | A$4,850.00 |
| Labour | A$6,510.00 |
| Overhead and other | A$4,688.80: subcontract A$1,200, overhead A$2,300, contingency A$1,188.80 |
| Target gross margin | 28% |

The tool reports a total cost of A$16,048.80, a gross profit of A$6,241.20 and a margin of 28.0%, which meets the target. The price needed to meet the target is A$22,290.00, the price quoted. The check confirms the arithmetic of Chapter 2 and, just as usefully, prompts the reviewer to confirm that the cost list is complete. In this case it is: the polishing hours found missing in Chapter 2 are in the labour line, and freight is in the subcontract line with the crane.

## A failure: the margin applied as a markup

The estimator who prepared the first version of the quote had been told to "put 28% on it". He multiplied the cost by 1.28. The result was A$20,542.46.

That is a 28% markup, not a 28% margin. On a price of A$20,542.46 the gross profit is A$4,493.66, a margin of only 21.9%. The quote margin check would have shown it immediately: below target by about 6.1 percentage points, with a price of A$22,290.00 needed to reach 28%. Sent as it was, the quote would have left A$1,747.54 of the workshop's intended return on the table.

```figure
type: compare
title: The same cost, three prices
cols: Price | Gross profit | Margin
caption: Applying the margin as a markup and conceding a 5% discount both cut the gross profit far more than the headline percentage suggests.
- *Quoted at 28% margin | A$22,290.00 | A$6,241.20 | 28.0%
- 28% applied as a markup | A$20,542.46 | A$4,493.66 | 21.9%
- Quoted price less 5% | A$21,175.50 | A$5,126.70 | 24.2%
```

The error was caught because the owner reviews every quote over A$10,000 with the quote check before it goes out, and the check reported the shortfall. The correction is partly arithmetic and partly language: the workshop's pricing note now says "28% gross margin on price", never "28% on it", and the estimator uses the price-from-target-margin tool rather than a multiplier.

It is worth asking what kind of unfairness the error would have caused. A price below the workshop's honest estimate does not wrong the customer, who pays less. It wrongs the workshop and, indirectly, the other customers whose prices carry a share of the overhead that this job would fail to cover. Commutative justice is about equality in the exchange, and an underpriced exchange is unequal too, just in the customer's favour. A business that routinely underprices by mistake ends up either raising prices elsewhere to compensate or failing.

## What a discount really costs

After receiving the corrected quote, the customer's buyer asks for 5% off. It is a normal request, and five percent sounds modest.

On A$22,290, a 5% discount is A$1,114.50, bringing the price to A$21,175.50. The cost does not change, so the whole discount comes out of gross profit, which falls from A$6,241.20 to A$5,126.70. That is a fall of about 17.9% in the workshop's return on the job, for a 5% change in price. The margin falls from 28.0% to 24.2%.

```figure
type: bars
title: Gross profit on the tank at three prices
unit: A$
caption: A 5% price cut removes almost 18% of the gross profit, because cost does not move with price.
- *Quoted price | 6241.20
- 2% discount | 5795.40
- 5% discount | 5126.70
- Markup error | 4493.66
```

Seeing the number does not settle whether to give the discount. That is a commercial decision. It does make the decision honest. Before agreeing, the owner now asks three questions and writes down the answers:

1. **What does the discount buy?** A larger order, a deposit, a faster decision, a quieter month filled, or nothing but the customer's goodwill.
2. **What does it cost in gross profit, not in price?** Here, A$1,114.50, which is 17.9% of the job's return.
3. **Would the same reason justify the same discount for the next customer?** If not, the discount is a favour, and favours should at least be recognised as such.

A discount that buys nothing is still the workshop's to give. It is simply not a price reduction justified by the exchange, and the owner should know that when giving it. An owner who believes a 5% discount costs 5% of the return will give it away too easily. The Library chapter on [gross margin and pricing power](/reados/collections/pricing-margins-and-profitability/gross-margin-and-pricing-power/) explores what a business's margin says about its ability to hold price.

## Treat like customers alike

The discount request raises a question of fairness between customers. Suppose the workshop gives this customer 5% off, and next month quotes an identical tank to another food manufacturer at full price. Is that unfair?

It is not, in itself, an unequal exchange with either customer. Each pays a price within the latitude Aquinas allows for an honest estimate (II-II q.77 a.1). But it does raise a question the workshop should be able to answer: why did one customer pay less for the same thing? Good answers exist. The first customer might be ordering three tanks, or paying a deposit that funds the materials, or accepting a longer lead time that fills a quiet month. Each of those changes the workshop's real cost or risk, and a price that reflects them still estimates worth honestly.

Bad answers exist too. "They asked" is a weak reason. "They are a big company" was rejected in Chapter 1 as the wrong kind of reason for an exchange. "The buyer is a friend of mine" is worse, because it gives something for a reason unconnected with the transaction, which is the vice Aquinas calls respect of persons when it happens in a distribution (II-II q.63 a.1). Chapter 6 discusses that vice in detail.

The workshop's practice is to write the reason for any discount on the quote file. If the reason would not survive being read aloud to another customer, it is not a reason.

## When costs change before the order

The quote states that it is valid for 30 days. Suppose that on day 35, with no order yet, the supplier's price for 316 sheet and fittings rises by 12%. The customer then accepts the quote. Is the workshop entitled to change the price?

The validity period is itself a fair allocation of risk. Within it, the workshop has promised to supply at the quoted price and carries the risk of cost changes; after it, the quote has lapsed and both parties are free to agree a new one. Holding a stale price after the validity period is generous, not required, and re-quoting is not unfair as long as the new price is built the same honest way as the old one.

The question is how to build it. The material increase is 12% of A$4,850, or A$582. With the 8% contingency applied to it, the cost rises by A$628.56 to A$16,677.36. Passing that through at cost would raise the price to A$22,918.56. Applying the workshop's 28% margin policy to the new total cost would raise it to A$23,163.00, an increase of A$873.00.

Both are defensible, and the choice says something about the workshop's policy. If the margin is understood as a return on all the resources the job ties up, then a dearer job ties up more, and applying the margin to the higher cost is consistent. If the customer has been promised a fixed fee for the workshop's work, then passing material through at cost is consistent. What is not defensible is choosing whichever method gives the higher number on this job and the other method on the next. The workshop's note now states that re-quotes apply the same margin policy as the original quote, so the customer can follow the change.

## Check quoted margins against what was earned

A quoted margin is an estimate. The margin actually earned is known only when the job is finished and its real costs are in. A business that never compares the two cannot tell whether its estimates are honest, because a systematic bias looks the same as bad luck one job at a time.

This is an illustration. When the tank is finished, the job records show 64.5 labour hours instead of 62: polishing ran 2.5 hours over. The other costs came in as estimated. The real cost of the job is therefore the base of A$14,860 plus A$262.50 for the extra hours, A$15,122.50. The contingency was there to cover exactly this, and only A$262.50 of its A$1,188.80 was used, about 22%.

On a price of A$22,290, the realised gross margin is 32.2%, higher than the 28% quoted, because most of the contingency was not needed. One job proves nothing. But if the records for the last ten stainless tanks showed the same pattern, the workshop would know that its contingency for this kind of work is larger than the risk requires, and that customers have been paying for risk the workshop is not really carrying. The fair response would be to reduce the contingency on future quotes, which is exactly the test suggested in Chapter 2.

## Make the price explainable, not necessarily explained

None of this means the workshop must show customers its cost build-up. It may keep its costs, rates and margin policy confidential, and most businesses do. Aquinas distinguishes sharply between asserting something false, which he never permits, and prudently keeping back the truth, which he does (II-II q.110 a.3, reply to objection 4). Chapter 8 develops that distinction.

What the workshop must be able to do is explain the price to itself: to show, from its own file, what each part of the price is for. A price that can be explained is one that can be defended if the customer, an auditor or a court ever asks. A price that cannot be explained, even internally, is closer to a guess than to an estimate of worth, and a business that prices by guesses will eventually guess unfairly.

## Exercise: a discount for a deposit

The customer offers a 50% deposit with the order in return for a 2% discount. Calculate the discounted price, the gross profit and the margin. Then say what the workshop would need to know to decide whether the trade is fair to both sides.

**Worked answer.** A 2% discount on A$22,290.00 is A$445.80, giving a price of A$21,844.20. With cost unchanged at A$16,048.80, the gross profit is A$5,795.40, about 7.1% less than at the full price, and the margin is 26.5%. Whether the trade is fair depends on what the deposit is worth to the workshop. A deposit of about A$10,922 would pay for the A$4,850 of 316 sheet and fittings before they are bought, removing the need to fund them from the overdraft and reducing the risk of being left with special material if the customer cancels. If the workshop's financing and risk saving on the deposit is close to A$445.80, the discount is a fair exchange of one benefit for another. If the workshop has ample cash and the customer is a reliable payer, the deposit is worth less and the discount gives away more than it receives. Either way, the reason should be written on the quote file.
