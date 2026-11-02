---
book: connected-products-by-the-numbers
chapterSlug: service-supply-and-end-of-life
order: 10
title: "Service, supply and end of life"
description: "Price a connected product with its cost to serve, compare service models under churn, decide what to make and buy, and plan for network closures, battery replacement and end of life."
draft: false
---

A connected product keeps costing money after it is sold. Every unit uses the network every month, the platform runs every day, owners ask questions, security fixes must be released until the published end of the support period, and one day the network or the battery will run out. A product whose price ignores those costs can sell well and still lose money on every unit. A product that ignores its end of life can strand its owners, as Australia's 3G closure showed.

This chapter brings the engineering of the previous chapters into the business decisions that follow from it. It calculates the tank monitor's cost to serve, compares service models with and without customer churn, works through a pilot finding that turned the subscription's margin negative, decides what to make and what to buy, and plans the product's end of life. The money values are illustrations, not market prices, and none of this is financial or tax advice.

## Three ways to charge

The industry eBook that informed this series describes how connected products let makers move from selling a product to selling a service. There are three common variants:

- **One-off sale.** The owner pays once and the maker carries any running costs from that payment. This works only if running costs are tiny or limited in time.
- **Hardware plus subscription.** The owner pays for the device and a monthly fee for the service. The fee pays for running costs and ongoing support.
- **Full service.** The owner pays no upfront price, only a higher monthly fee. The maker owns or finances the hardware and recovers its cost over the subscription.

The tank monitor's makers chose hardware plus subscription. The numbers below show why.

## The cost to serve

This is an illustration. The makers' estimated monthly cost to serve each unit, excluding GST:

- **Connectivity**, A$1.20, the pooled data plan budgeted in Chapter 5.
- **Platform**, A$0.25, cloud hosting, storage and notifications for a fleet of about 2,000 units.
- **Support and upkeep**, A$0.80, owner support, monitoring and security updates for the defined support period of Chapter 8, spread across the fleet.

The total is **A$2.25** per unit per month.

The prices are **A$249** for the device and **A$6.60** a month for the service, both including GST. GST in Australia is one-eleventh of a GST-inclusive price, as the Australian Taxation Office's guidance explains for taxable supplies. The business keeps the amounts excluding GST.

```figure
type: formula
title: Prices, GST and the monthly margin
formula: amount excluding GST = price including GST ÷ 1.1        monthly margin = subscription excluding GST − cost to serve
caption: This is an illustration. All costs exclude GST. The cost to serve was the makers' estimate before the pilot.
- Device | A$249 including GST
- Subscription | A$6.60 a month including GST
- Cost to serve | A$1.20 + A$0.25 + A$0.80 = A$2.25 a month
step: device excluding GST = 249 ÷ 1.1 ≈ A$226.36, so GST ≈ A$22.64
step: subscription excluding GST = 6.60 ÷ 1.1 = A$6.00
step: monthly margin = 6.00 − 2.25 = A$3.75 a unit
```

## A failure case: the support cost that ate the margin

This is an illustration. The cost-to-serve estimate assumed that support would cost A$0.80 a unit a month, roughly one contact every two years at A$20 per contact. The pilot's support log in Chapter 9 recorded about **1.5** contacts per property over six months, or about **0.25** a month. At A$20 each, that is **A$5.00** a unit a month for support alone.

With support at that level, the monthly margin becomes **6.00 − 1.20 − 0.25 − 5.00 = −A$0.45**. Every unit would lose money every month it was in service.

The detection came from treating the pilot's support log as data and costing it, not just fixing the individual questions. The finding did not mean the price was wrong. It meant the product was not finished. Chapter 9's analysis showed most contacts came from installation and false alerts, both fixable. The makers set a target of **0.04** contacts a unit a month, one every 25 months, and delayed launch until the installation dipstick check, the learned overnight pattern and the simpler password reset were in place. The first three months of sales were then measured against that target before the makers committed to a larger production run. The lesson is that the cost to serve is an engineering output as much as a financial input. Every false alert and confusing installation step has a price.

## Compare the service models under churn

This is an illustration. The makers compared their chosen model, hardware plus subscription, with a full-service model at **A$11** a month including GST and no device price. Each unit costs **A$110** to make and deliver, excluding GST. They looked at the contribution per unit over five years, before overheads, with and without churn. Churn is the share of customers who cancel each month, and the makers assumed **2%**.

With no churn, the arithmetic is simple. Hardware plus subscription returns **226.36 − 110 + 60 × 3.75 ≈ A$341** over five years. Full service returns **−110 + 60 × (10.00 − 2.25) = A$355**, slightly more.

With 2% monthly churn, the expected number of paid months from each new customer over five years is the sum of a declining series, **(1 − 0.98⁶⁰) ÷ 0.02 ≈ 35.1** months instead of 60. Hardware plus subscription then returns about **116.36 + 35.1 × 3.75 ≈ A$248**. Full service returns about **−110 + 35.1 × 7.75 ≈ A$162**.

```figure
type: bars
title: Five-year contribution per unit by service model
unit: A$ per unit, excluding GST
max: 400
caption: This is an illustration with a A$110 unit cost, A$2.25 monthly cost to serve and 2% monthly churn where shown. Overheads, financing and battery replacement are excluded.
- Hardware plus subscription, no churn | 341
- Full service, no churn | 355
- *Hardware plus subscription, 2% churn | 248
- Full service, 2% churn | 162
```

Full service looks better only if customers stay. Its cost is recovered only after **110 ÷ 7.75 ≈ 14.2** months, so every customer who leaves earlier is a loss, and the makers carry the risk of the hardware in the field. Hardware plus subscription recovers the unit's cost on the day of sale and is far less sensitive to churn. For a small maker without much capital and with an uncertain churn rate, that was decisive. The KEVOS® [Subscription Value](/tools/subscription-value/) calculator can test other assumptions.

## Decide what to make and what to buy

A connected product spans several kinds of work, and few small companies can do all of them well. The eBook that informed this series argues that electronics, electrical systems and embedded software can be outsourced to capable suppliers. It also argues that systems engineering and the data platform are core competencies a company should keep, because they hold the product together and the data becomes one of its most valuable assets. The tank monitor's makers applied that reasoning to each part.

```figure
type: compare
title: Make or buy for the tank monitor
cols: Decision | Reason
caption: This is an illustration of the makers' choices. Buying a part does not remove the need to specify it, test it and manage the supplier.
- Board manufacture and assembly | buy, from a contract manufacturer | specialised equipment and volume; the makers own the design files and tests
- Radio module and its software stack | buy | certification and network approval are the module maker's core business
- Device firmware | make the application, buy the operating system and libraries | the measurement and alert logic is the product's know-how
- *Systems engineering and integration | make | the requirements, interfaces and error budget hold everything together
- Platform and data | make, on rented cloud services | the data and its analysis are the long-term asset
- Phone app | contract developer, makers own the design and code | specialised skills; the makers keep control of the interface
```

Buying a part does not remove responsibility for it. The contract manufacturer builds to the release package, which the makers must keep complete. The module maker's support period limits the product's own, as Chapter 8 showed. The app developer must build to the message specification and interface register of Chapter 2. Each supplier relationship is managed with the same documents that run the engineering.

## Plan spares and component supply for the support period

A published support period is also a supply commitment. If a unit fails in year five, the makers need a replacement unit, or the parts to build one, in year five. Electronic components do not stay available that long by default. Makers discontinue parts and issue end-of-life notices, and radio modules in particular are revised as networks change.

This is an illustration. The makers estimated replacement demand from the pilot's failure rate. With a fleet of **2,000** units and the pilot's point estimate of **0.15** failures per unit-year, they would replace about **2,000 × 0.15 = 300** units a year. Using the pilot's 90% upper bound of about 0.33, the figure would be about **660**. Neither figure is comfortable for a small company. The gap between them shows how much the spares plan depends on driving the failure rate down with the corrective actions from the pilot, and on measuring it again as the fleet grows.

The supply plan has three parts. First, the bill of materials is reviewed every quarter against component makers' lifecycle notices, and any part with an announced end of life triggers either a last-time buy sized for the remaining support period or a qualified alternative. The architecture of Chapter 2 and the test ladder of Chapter 6 make qualifying an alternative a defined piece of work rather than a crisis. Second, the contract manufacturer holds a buffer of finished units sized from the measured failure rate, reviewed as the fleet grows. Third, returned units are examined (Chapter 9's survivorship lesson applies) so that the failure rate behind the spares plan is real, not estimated from units that are still talking.

The cost of these commitments, including stock held and engineering time for alternatives, sits in the support line of the cost to serve. It is one more reason the A$0.80 figure had to be checked against the pilot rather than assumed.

## Plan for the network's end

Australia's major mobile operators closed their 3G networks in 2024. The government's business guidance warned that EFTPOS terminals, security systems, cameras, scanners, smartwatches and asset trackers could be affected. Connected products that depended on 3G stopped connecting unless their radios were replaced. Some makers replaced units at their own cost. Others left owners with devices that no longer worked.

The tank monitor's makers built three protections into the product and its contracts. They recorded their operator's stated plans for LTE-M and set the defined support period inside that horizon. They chose a module footprint shared by several makers, so that a future change of radio technology would need a new board revision, not a new product. And their terms of service say what happens if the network the product depends on closes before the end of a customer's subscription: the makers will offer a replacement or a refund for the remaining term. That promise has a cost, and it sits in the support line of the cost to serve.

## Plan for the battery and the end of life

The tank monitor's cell lasts about 8.4 years in good coverage (Chapter 4). That is close to the end of the support period for early units, and less at marginal sites. The charge counter reports each unit's remaining life, so the makers know months ahead which units need attention. When a unit's cell nears its end, the owner is offered a replacement unit at a reduced price if the support period still has time to run. Otherwise the owner is told plainly that support is ending, and how to retire the unit.

Retiring the unit is part of the design. Lithium primary cells must not go into household waste, and the tank monitor contains a circuit board, a radio and a sealed housing. The makers run a free return scheme: owners post the unit back in a prepaid satchel, the makers record the returned unit against its serial number (which also closes its record in the reliability data of Chapter 9), and the cell and electronics go to recycling through Australia's battery and e-waste collection networks. The housing is designed to be opened with a tool so the cell can be removed for recycling.

## How this applies to a small Australian business

Connected products tempt small makers into pricing that covers the hardware and hopes for the rest. Build the cost to serve from the engineering: data per message, platform costs, support contacts per unit and the years of security upkeep you have published. Measure each one in the pilot. State prices including GST, as Australian consumer pricing requires, and plan on the amounts excluding GST. Keep the work that holds the system together in-house, buy what specialists do better, and write the end of the network and the end of the battery into your terms before you sell the first unit. The general make-or-buy arithmetic is in the KEVOS® [Make or Buy](/tools/make-buy/) quick check.

Finally, revisit the numbers once real customers arrive. The pilot gives the first measured support rate, failure rate and data use, but a few hundred paying customers will give better ones within months. Put the cost to serve, the churn rate and the failure rate on a single page that the whole team reviews each quarter, and change the product, not just the price, when they drift.

## Exercise: a cheaper plan and a higher churn

The makers find a connectivity plan at **A$0.90** a month excluding GST, but market research suggests churn could be **3%** a month rather than 2%. With the hardware plus subscription model, support at the target A$0.80 and the platform at A$0.25, what is the new monthly margin and the five-year contribution per unit under 3% churn? Use (1 − 0.97⁶⁰) ÷ 0.03 ≈ 28.0 months.

**Worked answer.** The cost to serve becomes **0.90 + 0.25 + 0.80 = A$1.95**, so the monthly margin is **6.00 − 1.95 = A$4.05**. The five-year contribution is **226.36 − 110 + 28.0 × 4.05 ≈ 116.36 + 113.4 ≈ A$230**. That is less than the A$248 at 2% churn with the original plan. The cheaper network saves 30 cents a month, but the extra churn costs more. Retaining customers is worth more than shaving connectivity costs, which brings the makers back to the product's reliability, alert quality and support, the engineering in every earlier chapter.
