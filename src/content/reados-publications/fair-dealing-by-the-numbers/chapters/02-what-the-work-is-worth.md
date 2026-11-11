---
book: fair-dealing-by-the-numbers
chapterSlug: what-the-work-is-worth
order: 2
title: "What the work is worth: cost, price and the honest premium"
description: "Build the tank's cost from its parts, turn it into a price with a stated margin, and test any urgency premium against Aquinas's rule that the seller's loss may be charged but the buyer's need may not."
draft: false
---

A quote is a claim about worth. When the workshop sends a price for the stainless tank, it is saying, in effect, that this sum fairly represents what it costs a going concern to make and deliver this thing. If the claim is honest, the exchange that follows is equal in the sense of Chapter 1. If it is careless or opportunistic, the exchange is unequal before a single weld is made.

Aquinas held that the just price is an estimate, not a precise figure, so that small deviations either way do not make a sale unjust (*Summa Theologiae* II-II q.77 a.1). That is a realistic view for a fabrication shop, where no two jobs are identical and every price rests on judgement. He was firm about two other points. A seller may not charge more than a thing is worth simply because the buyer needs it badly. And a seller may charge more when parting with the thing costs the seller something real. This chapter builds the tank's cost and price, then applies that distinction to the urgency premium the owner was tempted to add.

## Build the cost from the work

This is an illustration. The customer's enquiry describes a vertical cylindrical tank, 1,400 mm inside diameter, for 3,000 litres of a salted food product, in grade 316 stainless steel, with internal welds ground and polished, a hinged lid, an outlet, a level gauge connection and three legs. The workshop estimates it from a work breakdown, not from a guess at the total.

| Element | Estimate | Basis |
|---|---|---|
| Materials | A$4,850 | Grade 316 sheet, plate, nozzles, legs and lid hardware, from a supplier's written quote |
| Labour | 62 hours × A$105 = A$6,510 | Cutting, rolling, fit-up, welding, grinding and polishing, testing, documentation |
| Equipment and subcontract | A$1,200 | Pickling and passivation by a subcontractor; crane hire for delivery |
| Allocated overhead | A$2,300 | The workshop's overhead rate applied to this job's hours |
| Contingency | 8% of the above | Moderate uncertainty in polishing time and material offcuts |

The BIZOMAT [job cost estimate](/tools/job-cost/) adds materials, labour hours multiplied by a loaded rate, equipment or subcontract, and allocated overhead, then applies a contingency percentage to that base. It reports the base, the contingency, the total and each element's share of the base. It flags a contingency under 5% as possibly too thin, and it states clearly that its total is a cost estimate, not a selling price.

```figure
type: stack
title: Where the tank's base cost goes
unit: A$
caption: Labour is the largest element at about 44% of the A$14,860 base, which is why errors in hours matter most.
- Labour | 6510 | 62 hours at A$105
- Materials | 4850 | grade 316 sheet and fittings
- Allocated overhead | 2300
- Equipment and subcontract | 1200 | passivation and crane
```

The base is A$14,860. Contingency at 8% adds A$1,188.80, for a total estimated cost of A$16,048.80.

### A failure: the hours that were not there

The first version of the estimate had 54 labour hours, not 62. It was built quickly from the last similar tank, which had been mild steel and painted. The internal weld grinding and polishing that food contact requires, about 8 hours, was missing.

The error was found when the owner compared the work breakdown line by line with the customer's specification and found no line for polishing. A second check confirmed it: the workshop's records for the last stainless tank with polished welds showed 61 actual hours for a slightly smaller vessel. The difference was not small. Eight hours at A$105 is A$840, and with contingency the total cost rises by A$907.20. Had the workshop priced from the 54-hour cost at its target margin, the price would have been A$21,030, and on the true cost the margin would have been about 23.7%, not 28%.

The correction is a habit rather than a number: build every estimate from a breakdown of the work the specification actually requires, and test the total against the records of the most similar completed job. The Library chapter on [pricing your product or service](/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/) covers cost floors and other pricing methods in more detail.

## Contingency is a cost of risk, not a hidden margin

The 8% contingency deserves a closer look, because it is the part of an estimate most easily used to disguise a price. A contingency is an allowance for identifiable uncertainty: here, the risk that polishing takes longer than planned and that offcuts from the 316 sheet are larger than expected. On a fixed-price quote, the workshop carries that risk. If polishing runs over, the workshop pays; if it runs under, the workshop keeps the difference. The contingency is the price of carrying that risk, and in that sense it is a legitimate cost of supplying the tank.

It stops being legitimate when it is sized to produce a result rather than to cover a risk. An estimator who adds 20% "contingency" to a job with little real uncertainty, and then presents the figure to the customer as cost, has hidden margin inside a word that implies something else. If the customer later asks to see the cost build-up, as some industrial buyers do, the description will mislead them about what they are paying for.

The workshop's practice is to set contingency from the uncertainty in specific line items and to write down which items it covers. For the tank, that means the polishing hours and the sheet yield. The BIZOMAT job cost tool's warning when contingency falls below 5% is a reminder in the other direction: an estimate with no allowance for uncertainty is not more honest, only more likely to be wrong. Somewhere between padding and pretending, there is a contingency that a competent estimator could defend line by line. That is the one to use.

A useful test is to ask what would happen to the contingency on a typical job. If the workshop's records show that, across similar tanks, about half the contingency is used on average, the allowance is doing its job. If it is never used, it has become margin, and it should either be reduced or moved into the stated margin where it belongs.

## Turn cost into price

A price is not cost plus whatever the market will bear. It is cost plus a margin that the business has decided, in advance, represents a fair return for its management, risk and continuity. The workshop's policy for one-off stainless work is a gross margin of 28% of the selling price.

The BIZOMAT [price from target margin](/tools/price-builder/) tool divides cost by one minus the target margin to find the selling price, and reports the equivalent markup on cost and the gross profit. It notes that its prices exclude GST and refuses a margin of 100% or more, which no price can reach.

```figure
type: formula
title: Price from a target margin
formula: Price = Cost ÷ (1 − Margin)
caption: A 28% margin on price is the same as a markup of about 38.9% on cost.
- Cost | A$16,048.80, including contingency
- Margin | 28% of the selling price
step: Price = 16,048.80 ÷ (1 − 0.28) = 16,048.80 ÷ 0.72 = A$22,290.00
step: Gross profit = 22,290.00 − 16,048.80 = A$6,241.20
step: Markup on cost = 0.28 ÷ 0.72 = 38.9%; GST at 10% = A$2,229.00; price including GST = A$24,519.00
```

The quoted price is A$22,290 excluding GST, A$24,519 including GST. The workshop can explain every dollar of it: what each element of cost is for, what the contingency covers, and what margin it applies to all similar work. That explanation is what makes the price an honest estimate of worth rather than a number chosen to see what happens.

## The urgency request

Two days after the quote goes out, the customer's operations manager phones. Their existing tank has developed a leak and is being patched. If the new tank cannot arrive in three weeks instead of five, they may have to stop the product line. They ask whether the workshop can bring delivery forward, and what it would cost.

The owner's first reaction is that the customer has no choice, and that the price should reflect it. A 25% urgency premium on A$22,290 would add A$5,572.50. "That's what a rush job is worth to them," the owner says.

Aquinas addresses almost exactly this situation. A buyer may gain great advantage from a thing, but if the seller loses nothing extra by supplying it, the seller may not charge for the buyer's advantage, because that advantage belongs to the buyer, not to the seller (II-II q.77 a.1). On the other hand, if the seller suffers a real loss by parting with the thing, the seller may charge for that loss. The test is not how much the buyer wants it. It is what supplying it now costs the seller.

## Price the seller's loss, not the buyer's need

So what does bringing the tank forward actually cost the workshop?

The welders would need to work about 20 hours of overtime to compress the schedule. The overtime premium is the extra wage cost above normal time. At half the base wage of A$45 an hour, it is A$22.50 an hour, or A$450 for 20 hours; the loaded rate already in the estimate covers the base hours. The owner would also spend about 2 hours replanning and talking to the quarry about its job, A$210 at the loaded rate. Together, the real additional cost of urgency is A$660, about 3.0% of the quoted price.

```figure
type: compare
title: Two ways to price the rush
cols: Basis | Amount
caption: The first premium recovers what urgency costs the workshop; the second charges the customer for its own predicament.
- *Overtime premium and replanning | The workshop's added cost | A$660
- Urgency premium of 25% | The customer's need | A$5,572.50
- Difference | Charged for nothing the workshop gives up | A$4,912.50
```

The A$660 premium is fair by Aquinas's rule: it recovers a real loss the workshop incurs by supplying sooner. The A$5,572.50 premium is not: about A$4,912.50 of it is a charge on the customer's predicament, for which the workshop gives up nothing.

There is one more cost the owner should consider honestly. If bringing the tank forward pushes another customer's job later, that customer bears a cost too, and the workshop may owe them something. That belongs in Chapter 6, where the shared capacity is distributed, but it should be noted here: an urgency premium that is fair to one customer may still be unfair to another if it is paid for with their time.

## What the law and the market say

Aquinas's position is stricter than common commercial practice. Many markets price urgency and scarcity directly, and charging more for faster service is lawful and often efficient: a higher price can ration scarce capacity towards those who value it most. A business owner can reasonably disagree with Aquinas on this point.

The Australian Consumer Law does not set prices, but it does prohibit unconscionable conduct in connection with the supply of goods and services, and among the matters a court may consider is the relative bargaining strength of the parties. Whether a particular premium would cross that line depends on all the circumstances, and this book does not suggest that it would. The ACCC's guidance on unconscionable conduct is the place to start for anyone who needs to know more.

The value of Aquinas's test is not that it settles legality. It is that it makes the owner say what a premium is for. A premium that recovers overtime and disruption can be explained to the customer in one sentence. A premium that exists because the customer has no alternative cannot be explained without saying so. The workshop quoted the A$660 premium, set out what it covered, and told the customer it would confirm the three-week date only after checking capacity, which Chapter 8 does.

## When a higher price is the seller's real loss

The distinction cuts both ways, and it is worth seeing a case where a large premium is fair. Suppose the only way to deliver in three weeks were to turn away a confirmed job from another customer that would have earned the workshop a gross profit of A$3,000. Supplying the tank sooner would then cost the workshop that A$3,000, a real loss, in addition to the overtime. Charging for it would satisfy Aquinas's rule, because it is the seller's loss and not the buyer's need that the price reflects.

The workshop must be able to show the loss, though. A displaced job that might have come in, or one the workshop could easily fit around, is not a real loss. The honest question is always: what, specifically, does supplying this now cost us?

## Exercise: a different rush

Another customer wants a smaller tank, quoted at A$12,400 excluding GST, delivered a week early. Bringing it forward needs 10 hours of overtime, with a premium of A$22.50 an hour, and one hour of replanning at A$105. The owner proposes a 15% urgency premium. Calculate the premium that recovers the workshop's real cost, the proposed premium, and the difference, and say what the workshop should quote.

**Worked answer.** The overtime premium is 10 × A$22.50 = A$225, and replanning adds A$105, so the real additional cost is A$330, about 2.7% of the price. A 15% premium would be 0.15 × 12,400 = A$1,860, which is A$1,530 more than the workshop's added cost. On Aquinas's test the workshop should quote A$330 plus GST for the earlier date, with a sentence saying what it covers. If bringing the tank forward would displace a confirmed job and lose a known gross profit, that loss could also be added, but only if it can be stated and shown.
