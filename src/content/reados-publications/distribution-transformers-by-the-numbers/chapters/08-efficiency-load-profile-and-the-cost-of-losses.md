---
book: distribution-transformers-by-the-numbers
chapterSlug: efficiency-load-profile-and-the-cost-of-losses
order: 8
title: "Efficiency, load profile and the cost of losses"
description: "How to work out yearly losses from a load profile, check efficiency against Australia's minimum energy rules, and compare transformers by total cost of ownership, not price."
draft: false
---

A distribution transformer is one of the most efficient machines in a factory, typically better than 99% at its usual load. That makes it easy to overlook its losses, and a mistake to do so. TX-1 passes about 7,500 MWh a year to the plant, and the 1% or so it loses is close to 95 MWh, paid for at the plant's full electricity price every year for the transformer's life. Over thirty years the cost of a transformer's losses can exceed its purchase price several times over, and the difference in losses between two otherwise similar transformers can be worth more than the difference in their prices.

This chapter works out TX-1's yearly losses from the plant's load profile, compares them with two replacement options, checks the options against Australia's minimum energy performance requirements, and values the losses over a transformer's life with the KEVOS® investment appraisal and benefit–cost tools. It ends with a payback rule that nearly rejected the cheapest transformer to own.

## Two losses, two behaviours

Chapters 3 and 4 described the two losses. No-load loss is constant whenever the transformer is energised: 8,760 hours a year. Load loss rises with the square of the load, so it depends on the whole shape of the load profile, not just its average. A transformer feeding a plant that runs flat out around the clock should have low load loss; one feeding a load that sits idle most of the time should have low no-load loss.

The plant's profile, from the three weeks of logging in Chapter 4 and the tunnel's expected load, is as follows: on each of 300 production days, eight hours at 650 kVA, fourteen hours at 1,300 kVA and two hours at the 1,520 kVA peak; on each of the other 65 days, a steady 600 kVA of refrigeration around the clock. The average load is 1,012 kVA. The load loss depends on the sum of the load squared times the hours, which for this profile is 1.006 × 10¹⁰ kVA²·h a year, equivalent to a steady 1,072 kVA, slightly more than the average because the peaks count more than the troughs.

```figure
type: formula
title: Yearly energy losses of a transformer
formula: E_no-load = P₀ × 8,760 h
formula: E_load = P_k × Σ (S_i ÷ S_rated)² × t_i
formula: Cost per year = (E_no-load + E_load) × energy price
caption: P₀ is the no-load loss (kW), P_k the load loss at rated load (kW), S_i the load during each period t_i (h) and S_rated the transformer's rating. The square in the load term is why a transformer's size matters to its load loss: the same load is a smaller fraction of a larger transformer's rating.
- P₀ | no-load loss, kW
- P_k | load loss at rated current, kW
- Σ S² t | 1.006 × 10¹⁰ kVA²·h for the plant
```

## The options

The plant's replacement study compared TX-1 with two 2,000 kVA options, both with 6% impedance as Chapter 5 requires. Option B is a conventional transformer with a grain-oriented silicon steel core. Option C has an amorphous metal core (Chapter 3), with the same load loss but a much lower no-load loss, at a higher price. The plant's electricity price, energy and network charges together, averages about A$0.17 per kWh excluding GST.

```figure
type: compare
title: Yearly losses and their cost at A$0.17/kWh
cols: No-load loss | Load loss at rating | No-load energy | Load-loss energy | Total | Cost per year
rowhead: Transformer
- TX-1, 1,500 kVA | 2.40 kW | 16.5 kW | 21,024 kWh | 73,772 kWh | 94,796 kWh | A$16,115
- B, 2,000 kVA, silicon steel | 2.30 kW | 19.0 kW | 20,148 kWh | 47,784 kWh | 67,932 kWh | A$11,548
- * C, 2,000 kVA, amorphous core | 0.85 kW | 19.0 kW | 7,446 kWh | 47,784 kWh | 55,230 kWh | A$9,389
caption: This is an illustration. Losses are the options' guaranteed values; prices exclude GST. Load-loss energy = P_k × 1.006 × 10¹⁰ ÷ S_rated² kWh. The plant delivers about 7,540 MWh a year at a power factor of 0.85, so TX-1 loses 1.26% of it and option C 0.73%.
```

Two things stand out. Both new transformers lose far less than TX-1, mostly because of their load loss: at the same load, a 2,000 kVA transformer runs at a smaller fraction of its rating, and its load loss, which goes with the square of that fraction, is smaller. And option C's lower no-load loss saves 12,702 kWh a year over option B, worth A$2,159.

## Minimum energy performance

Since 2012 the Greenhouse and Energy Minimum Standards (Power Transformers) Determination, made under the Commonwealth's GEMS Act, has required distribution transformers from 10 kVA to 2,500 kVA, with a highest system voltage up to 24 kV, oil-immersed or dry-type, to meet the minimum energy performance standard set out in AS 2374.1.2-2003. The standard specifies minimum power efficiency levels at 50% of rated load for each type and rating, and products must be registered before they are supplied in Australia. Both replacement options fall within its scope.

```figure
type: compare
title: Efficiency at 50% of rated load and unity power factor
cols: Output at 50% | Losses at 50% | Efficiency
rowhead: Transformer
- TX-1, 1,500 kVA | 750 kW | 6.53 kW | 99.138%
- B, 2,000 kVA | 1,000 kW | 7.05 kW | 99.300%
- * C, 2,000 kVA | 1,000 kW | 5.60 kW | 99.443%
caption: This is an illustration. Losses at 50% load = P₀ + P_k × 0.5². Whether a transformer meets the minimum performance level depends on the table in AS 2374.1.2 for its type and rating, which must be checked for the actual offer; the levels are not reproduced here. A transformer built in 1996, like TX-1, predates the requirement.
```

The efficiency figures look almost identical, all a little over 99%, which is why efficiency is a poor basis for comparing transformers. The differences that matter are in the third decimal place, and the losses in kilowatts, valued over the transformer's life, show them far more clearly.

## Total cost of ownership

The fairest way to compare transformers is the total cost of ownership: the purchase price plus the present value of the losses over the transformer's life. Utilities and large buyers express it with two capitalisation factors, A for each kilowatt of no-load loss and B for each kilowatt of rated load loss, so that tenders can be compared on price + A × P₀ + B × P_k.

With an energy price of A$0.17/kWh, a 30-year life and a 7% discount rate, the present value of A$1 a year for 30 years is 12.409. A kilowatt of no-load loss, running 8,760 hours a year, is therefore worth 8,760 × 0.17 × 12.409 = A$18,480. A kilowatt of a 2,000 kVA transformer's rated load loss, scaled by the plant's profile, runs the equivalent of 1.006 × 10¹⁰ ÷ 2,000² = 2,515 hours a year and is worth 2,515 × 0.17 × 12.409 = A$5,305.

```figure
type: compare
title: Total cost of ownership of the two options over 30 years at 7%
cols: Price | No-load loss × A$18,480 | Load loss × A$5,305 | Total cost of ownership
rowhead: Option
- B, silicon steel | A$92,000 | A$42,504 | A$100,795 | A$235,299
- * C, amorphous core | A$114,000 | A$15,708 | A$100,795 | A$230,503
caption: This is an illustration. Prices exclude GST and installation, which is the same for both, A$38,000. Option C costs A$22,000 more to buy and A$4,796 less to own.
```

The same answer comes from treating the extra A$22,000 for option C as an investment that saves A$2,159 a year. The [equipment investment appraisal tool](/tools/investment-appraisal/) works out the net present value, internal rate of return, simple and discounted payback, benefit–cost ratio and equivalent annual cost of an equipment purchase with uniform yearly savings, and compares the payback with a limit. With A$22,000, A$2,159 a year, 30 years and 7%, it gives an NPV of A$4,795, an internal rate of return of 9.1%, a simple payback of 10.2 years and a discounted payback of 18.5 years. The [benefit–cost ratio tool](/tools/benefit-cost-ratio/) gives the same NPV as a net present benefit, with a benefit–cost ratio of 1.22.

## Who pays for the losses

The plant takes its supply at 11 kV and is metered there, on the high-voltage side of TX-1. Everything TX-1 loses therefore passes through the plant's meter and is paid for at the plant's tariff. A small business supplied at low voltage from the network's own transformer does not pay for that transformer's losses directly; the network does, and recovers them through its charges. For an HV customer, the transformer's losses are as much the plant's running cost as the electricity its motors use.

The tariff also matters to the value of each kilowatt. Large customers' network tariffs usually include demand charges, levied on the highest demand in a month, as well as energy charges. A transformer's losses add to the demand at the peak, by 19.34 kW for TX-1 at the tunnel peak and 11.82 kW for option C, so a tariff with high demand charges makes load loss worth a little more than the average energy price suggests. The plant's A$0.17/kWh is an all-in average that includes an allowance for this; a more careful study would value the peak losses at the demand charge separately.

## Where the loss figures come from

Every number in this chapter rests on the losses the makers quote. For a comparison of offers to mean anything, those figures must be guaranteed values, measured in a factory test after manufacture (Chapter 10), with an agreed consequence if the measured values exceed them. Standards for power transformers allow tolerances on measured losses unless the purchaser specifies otherwise, so a specification that capitalises losses should also say how any excess will be treated: typically a price reduction for each kilowatt above the guarantee, at the same A and B factors used in the evaluation, and the right to reject a unit whose losses exceed the guarantee by more than a stated margin. Without that, a supplier who quotes optimistic losses wins the tender and the buyer pays for the difference for thirty years.

## The losses and emissions

Losses also have an emissions cost. The Commonwealth publishes emission factors for electricity consumed in each state in its National Greenhouse Accounts Factors, and multiplying the kilowatt-hours saved by the factor for the plant's state gives the emissions avoided. Tasmania's grid, dominated by hydro-electricity, has one of the lowest factors in the country, so for this plant the emissions benefit of option C is small; for an identical plant on a grid with a higher factor it would be several times larger. The plant's sustainability report records the saving in kilowatt-hours and applies the current published factor each year, rather than fixing a number at the time of purchase.

## When it goes wrong: the payback rule

The plant's capital rules required every investment to pay back within 10 years. The investment appraisal tool, applying that rule, reported option C's extra cost as not justified, because its simple payback of 10.2 years narrowly exceeded the limit, although its NPV was positive and its return of 9.1% beat the plant's 7% cost of capital. A first draft of the recommendation chose option B.

The error was applying a short-payback rule to a thirty-year asset. Payback ignores everything after the cut-off, and a transformer bought today will still be losing, or saving, energy in 2056. The rule exists to protect the business from long-shot projects whose benefits are uncertain; a transformer's loss saving is about as certain as a saving can be, because the loss is guaranteed by the maker, tested in the factory and governed by physics, and the only uncertainty is the price of electricity.

```figure
type: compare
title: Option C's extra cost at different electricity prices
cols: Saving per year | NPV over 30 years at 7% | IRR | Simple payback
rowhead: Energy price, excluding GST
- A$0.12/kWh | A$1,524 | −A$3,086 | 5.6% | 14.4 years
- * A$0.17/kWh | A$2,159 | A$4,795 | 9.1% | 10.2 years
- A$0.25/kWh | A$3,176 | A$17,405 | 14.2% | 6.9 years
caption: This is an illustration. Results from the equipment investment appraisal tool with A$22,000 extra cost and 12,702 kWh saved a year. The case for option C rests on the price of electricity over thirty years, which is the real uncertainty to discuss.
```

The revised recommendation chose option C, with the sensitivity table attached, and noted that the plant's own price forecast favoured it. The engineers also proposed, and the finance manager accepted, that transformer and motor purchases be judged on total cost of ownership with an agreed electricity price, rather than on simple payback.

## Replacing TX-1 for its losses alone

Would the losses alone justify replacing TX-1? Replacing it with option B saves 94,796 − 67,932 = 26,864 kWh a year, A$4,567, for a cost of A$92,000 plus A$38,000 installation. The investment appraisal tool gives an NPV of −A$73,330 and an internal rate of return of 0.3%: nowhere near justified. TX-1's replacement is justified by its condition (Chapter 7) and its capacity for the tunnel and future loads, not by its losses. Once the replacement is decided on those grounds, though, the losses decide which replacement to buy.

## Choosing the rating

The study compared 2,000 kVA options, but the rating itself was a choice. A 2,000 kVA transformer runs at 76% of its rating at the tunnel peak, leaving room for the plant's next project, and its load loss on the plant's profile is far below TX-1's because each kilovolt-ampere of load is a smaller fraction of its rating. A 2,500 kVA unit would run at only 61% at the peak and lose less again under load, but it would cost more, carry a larger no-load loss for every hour of the year, raise the fault level further (Chapter 5) and stretch the existing switchboard and cables. A 1,750 kVA unit would be cheaper but would leave the plant at 87% of rating on the day the tunnel starts.

The total cost of ownership method handles the choice naturally: each rating is priced with its own losses and its own load-loss capitalisation, because the same profile is a different fraction of each rating. The plant's engineers ran all three ratings through it, together with the cost of the switchboard and protection changes each would need, and 2,000 kVA came out best. The general pattern is common: a transformer slightly larger than today's peak usually costs least to own, provided its no-load loss is low, because the plant pays for no-load loss in every hour and load loss mostly in the busy ones.

## Exercise: a third offer

A third supplier offers a 2,000 kVA silicon-steel transformer with a no-load loss of 1.60 kW and a load loss of 16.5 kW, at A$106,000.

1. What is its total cost of ownership with the plant's capitalisation factors?
2. How does it compare with options B and C?
3. What would you check before accepting it?

**Answer.**

1. A$106,000 + 1.60 × A$18,480 + 16.5 × A$5,305 = A$106,000 + A$29,568 + A$87,533 = A$223,101.
2. It is A$7,402 cheaper to own than option C and A$12,198 cheaper than option B, because its lower load loss is worth more on this profile than option C's lower no-load loss.
3. That its losses are guaranteed with stated tolerances and penalties (Chapter 10), that it meets the minimum energy performance requirement and is registered, that its impedance is 6% as specified, its noise acceptable (Chapter 9) and its delivery time realistic. A low-loss offer whose losses are not guaranteed is not a low-loss offer.
