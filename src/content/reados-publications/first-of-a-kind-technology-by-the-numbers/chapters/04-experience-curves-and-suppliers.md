---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: experience-curves-and-suppliers
order: 4
title: "Experience curves, supplier track records and the operating team"
description: "A builder's 41st line against a first unit on a 90% curve, the novel package on an 85% curve from A$9.33m, who pays for learning, and a sorter scored on borrowed experience."
draft: true
---

Chapters 2 and 3 measured novelty in the technology. Experience is the other side of the same coin: the learning that a supplier, a technology and an operating team have accumulated before this plant, and the learning they still have to do on it. This chapter uses the experience curve to place each supplier's offer on the path from first unit to mature product, asks who pays for the learning still to come, reads each supplier's track record for the duty that matters, and looks at the team that will run the plant. It ends with a sorter that was rated on experience it did not have.

## Learning and the experience curve

T. P. Wright, studying aircraft production in the 1930s, observed that the labour needed to build each airframe fell by a roughly constant percentage every time the cumulative number built doubled. Wright published the relationship in 1936, and it became the **learning curve**. Later work extended the idea from the labour on one product to the whole cost of a product or plant, as the **experience curve**: each doubling of cumulative experience brings cost down by a roughly constant fraction, through better designs, standardised parts, practised installation crews and known remedies for known problems. Bruce Henderson wrote in 1984 about the application and misapplication of the experience curve, and the warning this book takes from that literature is simple: the curve describes reductions that are earned by learning that is captured and reused, not reductions that arrive automatically with volume.

In its usual form the cost of the nth unit is

**C(n) = C(1) × n^b, with b = log₂(r)**

where r is the **learning rate**, the fraction of cost that remains after each doubling. On a 90% curve, b = log₂(0.90) = −0.1520, so each doubling leaves 90% of the cost. On an 85% curve, b = log₂(0.85) = −0.2345, so each doubling leaves 85%. The mathematics of fitting such curves, and the difference between unit and cumulative-average forms, is set out in [Learning curves: unit and cumulative-average models](/reados/publications/modular-projects-by-the-numbers/learning-curves/) in *Modular Projects by the Numbers*; the [Learning Curve Unit Time and Cost calculator](/tools/learning-curve/) reproduces the arithmetic.

Learning is not a property of the product alone. Argote and Epple (1990), reviewing learning curves in manufacturing, stressed how much learning rates differ between organisations and even between plants making the same product, and that knowledge can be lost as well as gained. That matters twice in this case: for the suppliers, whose learning is embedded in their designs and their commissioning teams, and for the recycler's own staff, who will have to learn to run whichever plant is built.

## Position on the curve: a 41st line against a first unit

This is an illustration. All amounts are A$ excluding GST. Option A's builder has supplied 41 similar lines, and its offer of A$16,000,000 is, in effect, the price of its 41st. The builder's actual cost history is not known to the recycler, so the curve is used here to show position, not to audit the price. If the builder's costs had followed a 90% experience curve, its 41st line would cost 41^−0.1520 = **0.569** of its first, and the first line, in today's money and scope, would have cost 16,000,000 ÷ 41^−0.1520, about **A$28,136,373**.

```figure
type: line
title: Option A's builder on a 90% experience curve, units 1 to 41
x: Cumulative lines built
y: Cost of that line, A$ million
ymin: 0
ymax: 30
mark: 41 | Option A
caption: This is an illustration. If the builder's costs follow a 90% curve, its 41st line costs 0.569 of its first: A$16.00 million against a unit-1 equivalent of A$28.14 million. The curve is nearly flat by unit 41, so most of the learning has already been paid for.
- 1 | 28.14
- 2 | 25.32
- 4 | 22.79
- 5 | 22.03
- 8 | 20.51
- 10 | 19.83
- 16 | 18.46
- 20 | 17.84
- 32 | 16.61
- 41 | 16.00
```

Two things follow. First, the difference between the first and the 41st line, about A$12.1 million on these assumptions, is the value of the learning the builder has done, and it was paid for by the builder and by the owners of the earlier lines through higher prices, longer start-ups and early problems. Second, the curve is almost flat where Option A sits. The 42nd line would be only about A$58,500 cheaper than the 41st. The recycler gains little by waiting for the builder to learn more, and loses little by being the 41st customer rather than the 100th. An nth-of-a-kind buyer is buying learning that is already complete.

## The novel package on an 85% curve

Option B's novel package, the hydrocyclone stage, the closed water loop and the fines sorter, is at the other end of its curve. The supplier prices it at **A$7,000,000**. For a first full-scale unit, the expected cost is higher. Chapter 8 sets out allowances graded by readiness, using the book's own illustrative teaching values rather than published rates; applied to these three elements, they put the median (P50) cost of the novel package as a first unit at **A$9,330,000**. A young technology usually learns faster per doubling than a mature one, because there is more to learn, so this book places the novel package on an **85% curve** from that first-unit P50.

```figure
type: bars
title: Expected cost of Option B's novel package by unit number on an 85% curve
unit: A$
max: 9330000
caption: This is an illustration. From a first-unit P50 of A$9,330,000, the book's own teaching value. The supplier's price of A$7,000,000 sits at about unit 3.4: it assumes learning that has not yet happened.
- * Unit 1, the recycler's plant | 9330000
- Unit 2 | 7930500
- Unit 3 | 7211295
- Supplier's price | 7000000 | about unit 3.4
- Unit 4 | 6740925
- Unit 5 | 6397311
- Unit 8 | 5729786
- Unit 10 | 5437714
```

The supplier's A$7,000,000 corresponds to about **unit 3.4** on that curve. That is not dishonest pricing. Technology companies commonly price their first commercial plant at the cost they expect once the design settles, because a first-unit price would not sell. But it means the price assumes learning that has not yet happened, and the question is **who pays for the learning**. On these numbers the gap between the first-unit P50 and the price is 9,330,000 − 7,000,000 = A$2,330,000. If the supplier carried it, the supplier would need the means to do so; the recycler's due diligence found that Supplier B has net assets of about **A$2.1 million**, less than the gap. In practice, cost growth on a first plant lands on the owner, through variations, extra equipment found necessary during commissioning, and lost output while it is fixed. A fixed price from a supplier who cannot absorb the overrun is less fixed than it looks; [Lump sum contracts: price certainty and what it costs](/reados/publications/project-teams-and-contracts-by-the-numbers/lump-sum-contracts/) in *Project Teams and Contracts by the Numbers* works through what a fixed price really transfers.

## Track record in the same duty

A supplier's list of installations is evidence only for the duty those installations perform. Reading a track record therefore means filtering it.

Option A's builder has supplied 41 lines, of which 23 run on rigid polyolefin feed like the recycler's. The process engineer contacted 8 reference plants nominated by the builder and asked one question of each: how many months after first saleable flake did the line first reach 90% of design throughput? Seven of the 8 had done so within 4 months. Two of the 8, however, wash PET bottles rather than polyolefins, so only 6 of the references are in the recycler's duty. The engineer asked the builder for two more polyolefin references and asked of each reference which month 90% was reached and what had held it back. Chapter 7 turns this record into a ramp-up curve for Option A.

Supplier B has 14 staff, one 0.30 t/h pilot plant that has run for 400 hours, and no commercial plant. Its record in the duty is its pilot. That is not a criticism of the company, because every technology has a first plant, but it means the evidence about full-scale performance, start-up time and reliability that Option A's references supply simply does not exist for B. Some of it can be borrowed from equipment makers. The fines sorter's maker has about 300 sorters in service, and its experience with the machine, its optics and its service network is real. Whether that experience transfers to this duty is the subject of this chapter's error.

## The operating team

The plant will be run by the recycler's own people, and their experience is part of the risk. The recycler has operated balers and conveyors for years; it has never run a wash line, a water treatment plant or an optical sorter. Whichever option is chosen, the operating team starts at unit 1 of its own learning curve.

The two options differ in what that team can lean on. Option A comes with a builder's commissioning crew that has started up 41 similar lines, an operating manual written from them, and other owners who can be visited and phoned. Option B comes with the supplier's pilot engineers, who know the process better than anyone but have never run it at full scale on a production roster, and with no other owners at all. The recycler's team would be learning alongside the supplier rather than from it. [Experience, proven technology and keeping the team](/reados/publications/modular-projects-by-the-numbers/experience-and-the-team/) in *Modular Projects by the Numbers* covers choosing an integrator and keeping an experienced crew together; for a first-of-a-kind plant the same point applies with more force, because the few people who learn how the plant really behaves become hard to replace.

The practical difference shows up in training. For Option A, the recycler's future shift leaders can spend time at a reference plant running the same equipment on similar feed, learn the start-up and shutdown sequences from people who have done them hundreds of times, and arrive at commissioning knowing what normal looks like. For Option B, the nearest equivalent is time on the pilot, which teaches the process but not the full-scale plant: ten cyclones on a manifold, a 120 m³ loop that changes over days rather than hours, and a sorter four times wider. The team would be writing the operating procedures during start-up rather than following them. That is not a reason to reject B, but it is a reason to expect its operators' learning curve to start lower and to budget for it, which Chapter 7 does in the ramp-up curve, and to keep the people who climb it.

```figure
type: checklist
title: Experience questions for any supplier, and for the owner's team
caption: Ticks are evidence to obtain from every supplier; question marks are the questions this case left open for Option B. The answer to each must be in the same duty, not a neighbouring one.
- Installations in the same duty | same feed, product, scale and operating hours; list separately from the rest
- References chosen by the owner as well as the supplier | include the plants the supplier would rather not name
- Months from first product to 90% of design at each reference | and what held each one back
- Commissioning crew | how many of the people starting up this plant started up earlier ones
- Financial capacity | net assets against the gap between first-unit cost and price
- ? Equipment experience in a different duty | does it transfer, and what test would show it
- ? Owner's team learning curve | who will run the plant, what they have run before, and how they will be trained before start-up
```

## The error: a sorter scored on borrowed experience

This is an illustration. In the first readiness assessment, before the independent reviewer joined, the process engineer's draft rated the hyperspectral fines sorter at **TRL 9**. The supporting note cited its maker's installed base: about 300 sorters of the same family in food processing, some with many years of operation. On a list of proven equipment, the sorter looked like the most proven item in Option B.

The reviewer asked the question this chapter has been building towards: how many of those installations are in the same duty? The answer was none. All 300 sort food products, typically dry or surface-damp, with known spectral signatures. None sorts wet plastic fines of 2 to 6 mm, where water films change the spectrum and particles stick together. The closest evidence was the three-month trial of a full-width 2.0 m unit on dry plastic flake at another recycler, which supports **TRL 7**: a full-scale prototype in an operational environment, but not in this one. The sorter was rescored at TRL 7, as Chapter 2 reports.

The error did not change system readiness, which the water loop holds at TRL 5. It did change the money. Using the cost-growth factors of Chapter 8's table, the book's own illustrative teaching values, a TRL 9 element carries a P50 factor of 1.05 and a P80 factor of 1.12, while a TRL 7 element carries 1.20 and 1.45. On the sorter's A$2,500,000 estimate, the TRL 9 score gave a P50 of A$2,625,000 against A$3,000,000 at TRL 7, understating it by **A$375,000**, and a P80 of A$2,800,000 against A$3,625,000, understating it by **A$825,000**. It would also have lowered the first-unit P50 of the novel package, and so the size of the learning gap above.

The correction had two parts. The sorter's rating went to TRL 7 with the dry-flake trial as its evidence, and the assessment procedure gained a rule: every installation cited as evidence must be listed with its duty, and only installations in the same duty count towards TRL 8 or 9. Borrowed experience is still worth recording, because it shortens the path to qualification, but it is recorded as a reason to expect a test to pass, not as a passed test.

## Exercise: buying a later unit

Suppose the recycler waited and bought the novel package as the 5th or the 10th full-scale unit, with the same 85% curve from a first-unit P50 of A$9,330,000. What would each be expected to cost, and how much below the first unit is the 10th?

**Worked answer.** With b = log₂(0.85) = −0.2345, unit 5 costs 9,330,000 × 5^−0.2345 = **A$6,397,311** and unit 10 costs 9,330,000 × 10^−0.2345 = **A$5,437,714**. Unit 10 is 1 − 10^−0.2345 = **41.7%** below unit 1, and the supplier's A$7,000,000 price would then sit comfortably above expected cost. The calculation shows why first-unit buyers carry the learning: the same equipment is expected to cost about A$3.9 million less once nine other owners have paid for the lessons. It also shows the limit of the comparison, because waiting for nine other plants could take many years, during which the recycler's bales would still need a washing line. That trade, between the learning a later buyer avoids and the value lost while waiting, is what strategy C and the valuation in Chapter 9 address.
