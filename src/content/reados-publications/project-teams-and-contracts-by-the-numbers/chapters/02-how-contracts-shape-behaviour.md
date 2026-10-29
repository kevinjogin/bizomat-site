---
book: project-teams-and-contracts-by-the-numbers
chapterSlug: how-contracts-shape-behaviour
order: 2
title: "How contracts shape behaviour: who keeps a dollar saved"
description: "Who keeps a A$100k saving under five contract models, incentive against flexibility, a four-risk register priced at 1.6 times expected value, and overtime paid at cost plus 8%."
draft: false
---

Every construction contract contains a rule for dividing money that nobody has yet spent. When the work costs less than expected, someone keeps the saving; when it costs more, someone pays the overrun. The rule is rarely written as a single clause, but it is there in the pricing method, the fee, the share terms and the variation provisions, and every party to the contract can work out where it leaves them.

People respond to that rule, usually quite rationally, whether or not anyone intended them to. This chapter sets out how five common payment models divide a A$100,000 saving or overrun, excluding GST, explains the trade-off between a strong incentive to cut cost and the flexibility to change the work, and prices four of the distribution centre's risks to show why each belongs with the party best able to control it. It ends with an acceleration that cost the owner almost twice what it saved, because of how the hours were paid.

## A contract as a rule for sharing

This is an illustration. The works for the distribution centre have a direct cost, the contractors' own cost before overhead and profit, of **A$13.50m excluding GST** at the median estimate. Suppose the outturn differs from that by A$100,000 either way, and nothing else changes. The table shows who gains and who pays under five payment models, each with the case's 8% fee for overhead and profit.

```figure
type: compare
title: Who keeps a A$100k saving and who pays a A$100k overrun
rowhead: Payment model
cols: Contractor, from a saving | Contractor, from an overrun | Owner, from a saving | Owner, from an overrun
caption: This is an illustration. A$k excluding GST, for a change in the contractor's direct cost with no change in scope. Target cost and alliance shares apply inside the bands and caps set out in Chapters 5 and 6.
- Lump sum | +100 | −100 | 0 | 0
- Cost-plus, 8% percentage fee | −8 | +8 | +108 | −108
- Cost-plus, fixed fee | 0 | 0 | +100 | −100
- * Target cost, 50% contractor share | +50 | −50 | +50 | −50
- Alliance, 50% share, pain capped | +50 | −50 | +50 | −50
```

Read across each row and the behaviour each model rewards becomes plain.

Under a **lump sum**, the contractor keeps every dollar it saves and pays every dollar it overspends. That is a strong incentive to control cost, and it gives the owner a fixed price, subject to variations and claims. It also gives the contractor a reason to resist anything that adds work without adding price, and to look hard for grounds to claim when the job is losing money. [Lump sum contracts: price certainty and what it costs](/reados/publications/project-teams-and-contracts-by-the-numbers/lump-sum-contracts/) works the numbers in Chapter 3.

Under **cost-plus with a percentage fee**, the incentive points the wrong way. A A$100,000 saving reduces the contractor's fee by A$8,000; a A$100,000 overrun increases it by A$8,000. No competent contractor deliberately wastes money to earn 8 cents in the dollar, and reputation and the next job push the other way. The point is that the contract offers nothing for saving and a small reward for spending, so it relies entirely on supervision and goodwill.

Under **cost-plus with a fixed fee**, the contractor is indifferent: its fee is the same whatever the cost. The owner gets the full saving and pays the full overrun. Indifference is better than a perverse incentive, but it is still not an incentive. Chapter 4 compares the two fee types.

Under **target cost**, the contractor keeps a share of any saving and pays a share of any overrun against an agreed target, here 50%. Both parties gain from a saving and both lose from an overrun, which is the first model in the table where their interests point the same way. Chapter 5 works the shares, bands and caps.

An **alliance** shares in the same way, but among all the main parties under one agreement, and usually limits the non-owner participants' pain to their profit. Chapter 6 covers its arithmetic.

The table describes only the first-order effect. A lump-sum contractor that is losing money may recover some of it through claims, which moves the owner's column; a cost-plus contractor may work hard to save money because it wants the next job. But first-order effects are the ones a contract controls directly, and they are the ones that persist when relationships are under strain.

## Discrete and relational exchange

Macneil's work on relational contracts, set out in *The New Social Contract* (1980), draws a distinction that helps explain why the table is not the whole story. A **discrete** exchange is a one-off transaction between strangers: buying a pallet of steel at a published price, where the written terms say everything that matters and the parties need never deal again. A **relational** exchange is long, uncertain and dependent on cooperation that cannot be fully specified in advance, so the relationship carries much of the load and the written terms are a framework and a fallback.

A distribution centre built over 18 months by the six organisations mapped in [Many organisations, one project](/reados/publications/project-teams-and-contracts-by-the-numbers/many-organisations-one-project/) is firmly relational. No contract can specify every decision the team will make. The design will develop, the owner will change its mind about things, the ground and the market will surprise everyone, and hundreds of small judgements will be made by people on site. A contract that treats the project as a discrete purchase, with every change a negotiation and every problem a claim, works against the cooperation that the project actually needs.

That does not mean relational projects need soft contracts. It means the contract should make cooperation the rational choice, by sharing savings and overruns in a way that rewards joint problem-solving, and by making change cheap to process. The collection chapter [Designing incentives that enforce themselves](/reados/collections/teams-incentives-and-performance/designing-incentives-that-enforce-themselves/) sets out the general principles; this book puts numbers on them.

## Incentive against flexibility

Bajari and Tadelis (2001) gave the trade-off a precise form. A **fixed-price** contract gives the contractor the strongest incentive to reduce cost, because it keeps every saving. But when the design is incomplete and changes are likely, every change must be renegotiated, and renegotiation under a fixed price is expensive: the contractor holds a strong bargaining position once it is on site, both parties spend time and money on the negotiation, and delays build while it runs. A **cost-plus** contract weakens the cost incentive but makes change cheap, because the owner simply pays for the revised work. Their analysis predicts, and they observed, that cost-plus contracts are preferred to fixed-price contracts as projects become more complex and their designs less complete.

```figure
type: balance
title: What a payment model trades
left: Fixed price
right: Cost-plus
caption: Strong cost incentives and cheap change pull in opposite directions. Target cost and alliances try to keep part of each; the case's numbers for each model follow in Chapters 3 to 6.
- Contractor keeps every saving | Owner keeps every saving
- Owner knows the price at award | Owner knows the price only at the end
- Change needs a priced variation | Change is paid at cost plus fee
- Suits a complete, stable design | Suits an incomplete or uncertain design
- Claims when the contractor is losing | Little reason for the contractor to save
```

For the distribution centre, the design is complete for the building, reasonably complete for the racking, and least complete for the conveyors, controls and WMS integration, which depend on the owner's final order profiles and software configuration. That suggests different packages might suit different models, a possibility Chapter 10 tests by simulation.

## Allocating each risk to the party that can control it

The most practical use of the sharing table is to decide who should carry each risk. The principle is old and sound: a risk belongs with the party best able to control it, or, where no one controls it, with the party best able to bear it at least cost. Transferring a risk to a party that cannot control it does not remove it; it adds that party's price for carrying it.

This is an illustration. The owner's project director and an independent estimator listed four risks in the works before tender, each with a probability and a cost if it occurs.

- **Rock in footings.** The geotechnical investigation is complete, so the builder can read the borehole logs and price the risk. Probability 0.10, cost A$0.25m, expected value **A$0.025m**.
- **Owner scope change to a chilled zone.** The owner is considering a chilled zone for sauces that need it; the decision is entirely the owner's. Probability 0.30, cost A$0.60m, expected value **A$0.180m**.
- **Conveyor and WMS integration defects.** The conveyor integrator and the WMS vendor each control half of the problem and neither controls it alone. Probability 0.25, cost A$0.40m, expected value **A$0.100m**.
- **Steel price movement.** No one on the project controls the steel market. Probability 0.40, cost A$0.15m, expected value **A$0.060m**.

The four expected values total **A$0.365m**. A contractor asked to carry a risk adds more than its expected value, because it must cover the chance that the risk occurs, it has less information about some risks than the owner, and it needs a return on the capital at risk. As an illustrative loading for this case, assume a contractor prices each risk at **1.6 times** its expected value. That multiplier is a teaching assumption, not a market rate; real loadings vary widely with the risk, the market and the contractor.

```figure
type: bars
title: Expected value and contractor's price for each risk
unit: A$m
max: 0.3
caption: This is an illustration. A$m excluding GST. The contractor's price is 1.6 times expected value, an assumed loading. Transferring all four risks would cost A$0.584m against A$0.365m expected, A$0.219m more.
- Rock in footings, expected | 0.025
- Rock in footings, contractor's price | 0.040
- Chilled-zone change, expected | 0.180
- * Chilled-zone change, contractor's price | 0.288
- Integration defects, expected | 0.100
- Integration defects, contractor's price | 0.160
- Steel price movement, expected | 0.060
- Steel price movement, contractor's price | 0.096
```

Transferring all four risks would add premiums of A$0.040m, A$0.288m, A$0.160m and A$0.096m, a total of **A$0.584m**, against expected costs of **A$0.365m**. The owner would pay **A$0.219m** more than the risks are expected to cost, in exchange for not carrying them.

That premium is worth paying only where the transfer changes behaviour or buys real certainty. For the chilled zone, it does neither: the owner decides whether the change happens, so the builder cannot reduce its probability, and the owner would be paying A$0.288m to avoid an expected A$0.180m that it controls. For rock, the transfer does change behaviour: the builder chooses the footing design and excavation method and can manage the risk directly, so paying A$0.015m above expected value buys a price the owner can rely on and puts the risk where it can be reduced.

```figure
type: decision
title: Who should hold a risk
question: Who can change the risk's probability or cost?
caption: This is an illustration of the principle, applied to the four risks in the case. Sharing suits a risk that two parties can only control together.
- The contractor | rock in footings | transfer: the contractor prices and manages it
- * The owner | chilled-zone change | retain: paying a premium would not change the decision
- Two or more parties together | conveyor and WMS integration | share: a target or alliance share gives each a stake
- Nobody on the project | steel price movement | retain, or index the price to a published series
```

The integration risk sits in between. Neither the integrator nor the WMS vendor can control it alone, so transferring it to either buys a premium without buying control. A shared arrangement, such as a target-cost share between the owner and the integrator with the WMS vendor tied into the same measure, gives both a stake in preventing defects. Chapters 5 and 6 show how.

Risk allocation is also one of the most effective ways to shorten the tail of a project's cost distribution before approval, because a risk managed by the party that controls it is less likely to grow. [Cutting the tail before approval](/reados/publications/reference-class-forecasting-by-the-numbers/cutting-the-tail/) in *Reference Class Forecasting by the Numbers* works through that wider exercise.

## The error: paying for speed by the hour

This is an illustration. The integrator's commissioning labour was let on a cost-reimbursable basis, at actual cost plus an **8% percentage fee**, because the amount of commissioning work was hard to predict before the controls software was written. In month 17, with commissioning a week behind, the integrator proposed to recover the week with overtime across all four conveyor zones and both shifts. The owner's DC manager-designate, under pressure from the sales team, agreed.

The acceleration took **1,040 overtime hours** at the blended rate of A$140 an hour, **A$145,600**. The 8% fee added **A$11,648**, so the owner paid **A$157,248** for the week. A week of the owner's delay is worth **A$80,000**, so the net cost of the acceleration was **A$157,248 − A$80,000 = A$77,248**. The owner had paid almost twice the value of the time it bought.

The problem was not that the integrator overcharged. Every hour was worked and paid at the agreed rate. The problem was that the contract made overtime across the board the easy answer. Overtime in all four zones was simpler to organise than a targeted plan, it kept every crew busy, and each hour earned the fee. Nothing in the payment terms asked whether all 1,040 hours were on the critical path.

The owner's contract administrator found the problem in the weekly open-book cost report, where commissioning labour had jumped from its usual level. Comparing the overtime hours against the commissioning programme showed that only zone 3, the case-picking zone, was on the critical path; zones 1, 2 and 4 had float.

The remaining commissioning was re-planned with a **fixed fee** and a **A$20,000 completion bonus**, payable if zone 3 was handed over by the target date. With the fee no longer tied to hours and a bonus tied to the outcome that mattered, the integrator concentrated its overtime on zone 3: **380 hours** at A$140, **A$53,200**, plus the bonus, **A$73,200** in total for the same week of gain. That is **A$84,048** less than the original plan and **A$6,800** less than the week was worth to the owner, so the acceleration now paid for itself.

## Exercise: who should hold each risk

For the four risks above, decide whether the owner should transfer each to the contractor or retain it, and show the cost of each choice against the expected value. Then show what transferring all four would cost the owner over their expected value.

**Worked answer.** **Rock in footings**: transfer. The contractor controls it, and the cost is a premium of **A$0.040m** against an expected **A$0.025m**, A$0.015m for certainty and better management. **Chilled-zone change**: retain. The owner controls it, and retaining saves the premium over expected value, **A$0.288m − A$0.180m = A$0.108m**. **Integration defects**: share between the integrator and the WMS vendor under the owner's control, at an expected cost of A$0.100m, rather than transfer at A$0.160m to a party that cannot control it alone. **Steel price movement**: retain, or index the steel content of the price to a published series. Retaining saves **A$0.096m − A$0.060m = A$0.036m**. Transferring all four would cost **A$0.584m**, against the expected **A$0.365m**: **A$0.219m** more. The recommended allocation costs A$0.040m + A$0.180m + A$0.100m + A$0.060m = **A$0.380m** in expected terms, A$0.204m less than transferring everything and A$0.015m more than retaining everything, the price of handing the one controllable risk to the party that controls it.
