---
book: the-burden-of-proof
chapterSlug: acting-while-unproven
order: 8
title: "Acting while unproven: staging the decision, pricing the claims and setting review triggers"
description: "How to decide when some claims are proven, some not proven and some refuted: act on what is supported, stage the rest, recompute the payback on evidence and set review triggers."
draft: false
---

The plant engineer now holds a mixed set of verdicts. One claim has become a site prediction backed by well-established physics. One is not proven but low in consequence. One was true at different conditions. One has been partly refuted and partly left untested. One turned out to be a maintenance schedule. The last, the payback, was built on the others. No single answer, buy or decline, fits all of them.

This chapter turns the verdicts into a decision. It takes up William James's objection to Clifford from Chapter 5, that some decisions cannot wait for complete evidence, and shows how to act on what is supported, stage what is not, and price the difference.

## Waiting has a cost too

Clifford's principle asks for sufficient evidence before belief. James replied that when a choice is forced, refusing to decide is itself a decision, with its own consequences. Both points apply to the retrofit.

The factory is not forced to buy anything. But declining is not free. Chapter 4's site prediction puts the energy saving from the two drives at about A$11,800 a year, roughly A$980 a month. Each month spent waiting for more evidence on the drives costs about that much, if the prediction is right. And the evidence on the drives is already strong: the physics of slowing a throttled pump is well established, the factory has measured its own duty, and the remaining uncertainty is about the drive's own losses and the exact saving, not whether there is one.

So the question for each claim is not only "is it proven?" but "what does waiting for more evidence cost, and what does acting now risk?" Where acting risks little and waiting costs much, the factory should act, with a check afterwards. Where acting risks much, the factory should wait, or act only on a part that can be undone.

## Where each claim stands

```figure
type: compare
title: The six claims after Chapters 1 to 7
cols: Verdict | Consequence if wrong | Decision
caption: This is an illustration. Each claim gets its own decision. Only the drives and controller are bought now; the rest wait for evidence or are replaced by something definite.
- C1 Energy, up to 40% | Replaced by a site prediction of 28 to 33% (Ch. 4) | Low: a smaller saving | Buy, and meter the result against the baseline
- C2 Heat pump COP 7.5 | True at 35 to 50 °C, not shown at 70 °C (Ch. 3) | High: A$21,500 a year more running cost | Do not buy until rated or witnessed at 35 to 70 °C
- C3 Seals 3 times as long | Robustness refuted; wear life untested (Ch. 7) | Low on cooling water | Continue the trial at the supplier's cost; no premium paid yet
- C4 Controller MTBF | Not proven at 90% (Ch. 2) | Low: fails to fixed speed | Buy, with warranty and the factory's own hour records
- C5 Maintenance-free | Replaced by the manuals' schedule (Ch. 4) | Low | Budget A$400 a year for drive maintenance
- C6 Payback in 14 months | Built on C1 at 40% and C3 | Depends on the inputs | Recompute on the evidence, below
```

## Recompute the payback on evidence

The supplier's payback of fourteen months assumed the full 40% energy saving on both pumps and a seal saving of about A$2,800 a year. The plant engineer recomputes it three ways.

The [equipment investment appraisal](/tools/investment-appraisal/) in BIZOMAT Tools appraises a purchase with uniform yearly savings and running costs: net present value at your interest rate, internal rate of return, simple and discounted payback, the benefit–cost ratio and the equivalent annual cost of ownership, against the longest payback you accept. Its limitations are stated: it works before tax and inflation, and it assumes uniform yearly flows.

This is an illustration. All three cases use a ten-year life, no salvage value, an 8% hurdle rate and a two-year payback limit, in Australian dollars excluding GST.

- **As claimed.** The whole package at A$21,300, with savings of A$18,122 a year: A$15,322 from 40% on two pumps and A$2,800 from the seals, and no running cost.
- **On the evidence.** The whole package at A$21,300, with savings of A$11,805 a year from the site prediction of 30.8% and nothing from the seals, which are unproven, less A$400 a year of drive maintenance.
- **Staged.** Only the drives and controller, at A$16,100, with the same A$11,805 saving and A$400 running cost. The seals stay in the trial at the supplier's cost, and the heat pump waits.

```figure
type: compare
title: The payback three ways
cols: Cost | Net yearly flow | Simple payback | NPV at 8%, 10 years
caption: This is an illustration. From the equipment investment appraisal. The claimed payback of about 14 months becomes about 22 months on the evidence. Staging the purchase brings it back to about 17 months and keeps most of the value.
- As claimed | A$21,300 | A$18,122 | 1.18 years | A$100,300
- On the evidence | A$21,300 | A$11,405 | 1.87 years | A$55,228
- * Staged: drives and controller only | A$16,100 | A$11,405 | 1.41 years | A$60,428
```

The claimed 1.18 years, about fourteen months, becomes 1.87 years, about twenty-two months, when the inputs are the ones the evidence supports. The investment is still justified at the factory's two-year limit, and its net present value is still well positive. The claim was not false so much as built on two other claims, one of which was overstated for this site and one of which was not yet proven.

Staging the purchase does better than buying the whole package on the evidence. It saves the A$5,200 for seals whose benefit is unproven, keeps nearly all of the energy saving, and shortens the payback to 1.41 years. The seal decision can be made later, on the trial's result, and nothing is lost by waiting for it, because the supplier is carrying the trial's cost.

## A fallback that rests on what is known

The seal trial may end with the wear-life claim refuted, or with the factory deciding that the new seals are too sensitive to fitting. In either case, the factory still has to look after its seals. The plant engineer checks what its own baseline evidence supports, so that the fallback is decided before it is needed.

The [preventive replacement interval plan](/tools/maintenance-interval-plan/) in BIZOMAT Tools works out a planned replacement policy for a wearing component from its Weibull parameters: reliability and hazard over an interval, the B10 and mean lives, the interval that gives a target reliability, and the interval with the lowest cost per operating hour, weighing a planned replacement against the higher cost of a failure. Its limitations are stated: a planned replacement is assumed to restore the part to as new, and the parameters must come from failures of the same part in the same duty.

This is an illustration. With the present seals' β of 2.2 and η of 9,000 hours, a planned change costing A$1,100, a failure costing A$4,500 including the unplanned stop, a target reliability of 90% and 6,000 operating hours a year, the tool finds that planned replacement pays.

```figure
type: stats
title: The fallback for the present seals, per pump
caption: This is an illustration. From the preventive replacement interval plan. Planned replacement at about 5,000 hours costs less than running to failure, on the factory's own failure data.
- 5,057 h | Lowest-cost replacement interval | Reliability 75.5% over the interval
- 3,236 h | Interval for 90% reliability | Shorter, if reliability matters more than cost
- A$0.42 / A$0.56 | Cost per hour, planned against run to failure | Planned is cheaper
- * A$891 | Yearly saving against run to failure | Without any new seal at all
```

The result is a useful reminder. The factory's own evidence already supports an improvement, planned seal replacement, that does not depend on any of the supplier's claims. Whatever the trial shows, the factory should consider it. Acting on what is known is often worth more than waiting to learn what is not.

## The decision record

The plant engineer's recommendation goes to the operations manager with a short decision record. It states what is being bought, what is not, why, and what would change the decision.

```figure
type: steps
title: The decision and its review triggers
caption: This is an illustration. Each trigger has a date or an event, and an owner. The decision reopens itself at each one, rather than waiting for someone to remember it.
- Buy now | Two drives and the controller, A$16,100 excluding GST, with a written fixed-speed fallback and warranty
- Meter after four weeks | If the saving per pump is below 25%, reopen with the supplier: the prediction has failed
- Seal trial at 6,000 h from refit | Apply the new signed rule; buy the seals only if the wear-life claim is not refuted and fitting is reliable
- Heat pump | Reopen only with a rating or witnessed test at 35 to 70 °C
- Controller hours | Add the factory's controller hours to the supplier's record each year; reopen if a failure occurs
- Fallback for seals | If the seals are not adopted, introduce planned replacement at about 5,000 hours
```

The record does what the supplier's proposal did not: it states each claim's status, the evidence behind it, and what would change it. A decision made on incomplete evidence is not a reckless one if it is made knowingly, with the uncertain parts staged and their checks written down. That is the practical answer to the Clifford and James debate for anyone who has to buy plant.

## What the supplier gets

A staged decision can look, to a supplier, like a partial rejection. The plant engineer presents it the other way, because it is the other way. The supplier receives an order now for the part of its package whose case is strongest. It receives a signed, fair rule for its seal trial, with the factory's records as the baseline, so that a good result will be one it can show other customers. It receives a clear statement of what evidence would sell the heat pump: a rating at 35 to 70 °C. And it is not asked to accept any rule the factory would not accept for itself.

What the supplier does not receive is payment for claims the evidence does not yet support. That is the whole point of the burden of proof, and most suppliers who make sound products prefer it to the alternative, a sale on overstated claims followed by a dispute. The supplier in the case accepts the order and the trial terms within a week, and asks whether the factory would serve as a reference site if the seals do well.

## When the purchase cannot be staged

Some purchases cannot be split. A heat pump cannot be half bought, and a production line cannot be installed one station at a time if it only works as a whole. When a decision must be made all at once on claims that are not proven, the factory has other ways to move the risk of a wrong claim back towards the party that made it.

- **Pay on performance.** Part of the price is paid only when a stated performance is measured on site, under conditions written into the contract. A heat pump supplier confident of its COP at 70 °C should accept payment of, say, a fifth of the price on a measured COP over a stated period.
- **Witnessed acceptance.** The equipment is tested before delivery or before final payment, with the buyer present, to a written procedure. The test's pass rule is set in advance, on the pattern of Chapter 6.
- **Retention.** A share of the price is held back for a stated period after commissioning, released when the claims that matter have been shown in service.
- **Warranties tied to the claim.** A warranty that repeats the claim in definite terms, with the conditions stated, gives the claim a remedy if it fails.

None of these makes an unproven claim proven. Each makes the supplier carry more of the cost if the claim is wrong, which is where Chapter 1 placed the burden. A supplier that refuses all of them, for a claim it says is sound, is telling the buyer how much it believes its own claim.

## The failure case: waiting for certainty

This is an illustration. Chapter 1 described a compressor controller bought without a baseline. The factory's response, the following year, was to refuse to buy variable speed drives for its two largest fans until a supplier could prove the saving at the site. No supplier could prove it before installation, because the saving depended on the fans' future operation. The decision waited three years. When the drives were finally fitted, metering showed a saving of about A$7,000 a year. The three years of waiting had cost about A$21,000, more than the drives.

### How it is detected and corrected

The failure is detected by pricing the wait. For any decision deferred for lack of evidence, ask what the evidence would cost to obtain, how long it would take, and what the deferral costs in the meantime if the claim is true. If waiting costs more than the risk of acting, and the action can be checked or undone, act and check. The correction for the fans would have been a staged purchase: one drive, metered against a baseline, with the second bought only if the first delivered.

## What the book has done

The retrofit proposal arrived with six claims and a price. Each claim has now been placed. The burden of evidence was allocated to whoever made each claim or held the facts behind it. Each claim was given one of three verdicts rather than two. The remarkable claim was tested against the physical limit, then against prior plausibility, then against its conditions. The claims that could not fail were rewritten until they could. The evidence demanded was scaled to the consequence of being wrong. The seal claim was given a test that could refute it, with the rule written first; and when the result went against it, the supplier's explanation was heard, checked and turned into conditions rather than accepted or dismissed. Finally, the decision was staged so that the factory acts on what is supported and waits, at little cost, for what is not.

None of this required distrust of the supplier, and none of it required certainty. It required asking, of each claim in turn, who must show it, what would count, and what would follow if it were wrong.

## Exercise: the prediction at its limit

Suppose the metering after four weeks shows a saving of exactly 25% per pump, the threshold in the prediction from Chapter 4.

1. Using the equipment investment appraisal, what is the payback on the staged purchase at that saving, with the same costs, life and hurdle rate?
2. Is the prediction confirmed, and what would you do?

**Worked answer.**

1. A 25% saving on two pumps of 11.4 kW for 6,000 hours at A$0.28 per kWh is about A$9,576 a year. Less A$400 of maintenance, the net flow is A$9,176. With A$16,100 invested, the tool gives a simple payback of 1.75 years, a discounted payback of 1.97 years and a net present value of A$45,472 at 8% over ten years. The investment still meets the two-year limit, just.
2. A saving of 25% is at the edge of the prediction's failure threshold and below its predicted range of 28 to 33%. The prediction has not failed by its own rule, but it is close, and the gap needs explaining before anyone relies on the model again. Check the drive's actual losses, the valve position, which should be fully open, the flow and the production weeks compared. If the explanation is found and fixed, the saving may rise towards the predicted range. If not, the drives are still worth having, and the business case for any further drives should use the measured 25%, not the model.
