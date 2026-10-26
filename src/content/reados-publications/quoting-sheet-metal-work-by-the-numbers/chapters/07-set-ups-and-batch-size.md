---
book: quoting-sheet-metal-work-by-the-numbers
chapterSlug: set-ups-and-batch-size
order: 7
title: "Set-ups and batch size"
description: "Separate one-off, per-batch and per-unit costs, build price breaks from them, price repeats and call-offs correctly, and catch 200 off called off in 50s at the 200 price."
draft: false
---

Every quote mixes three kinds of cost. **Per-unit** costs, material, cutting, folding, joining, assembly, finishing, recur with every enclosure. **Per-batch** costs, set-ups, first-article inspection, freight to the coater, occur once each time the job runs, however many enclosures are in the batch. **One-off** costs, programming and any special tooling, occur once for the job at its revision. Price breaks come entirely from spreading the second and third kinds over more units, and a quote that does not keep the three apart cannot price a quantity, a repeat order or a call-off correctly.

This chapter separates EN-700's costs into the three kinds, builds its price breaks at 20, 50 and 200 off, and prices a repeat order and a call-off schedule. The running case finds that a customer ordering 200 off at the 200 price, but calling them off in four batches of 50, would have cost the shop about A$12.30 per enclosure more than it had quoted.

## Three kinds of cost

This is an illustration, in Australian dollars excluding GST, using the lines of the previous chapters.

```figure
type: compare
title: EN-700's costs by kind
cols: Behaviour | Amount | Source
caption: This is an illustration. Per-unit costs vary slightly with quantity through material and sheet handling; per-batch and one-off costs do not.
- Per unit | Every enclosure | About A$266 to A$274 | Material, laser, brake, joining, assembly, test, packing, coating
- Per batch | Every run of the job | A$596.67 | Brake and joining set-ups, first-article inspection, coater freight
- *One-off | Once per job revision | A$190.00 | Laser and brake programming, two hours
```

The per-batch costs are:

- **brake set-ups**, eight part types at 15 minutes, about A$220.00, and the hemming tool, about A$36.67;
- **joining set-ups**, the clinching die, riveting tool and nut press, about A$47.50;
- **first-article inspection**, one enclosure measured and checked against every drawing before the batch proceeds, about 1.5 hours, about A$142.50;
- **coater freight**, about A$150.00.

They total about **A$596.67** per batch. The programming of Chapter 3, about **A$190**, is one-off.

## The per-unit cost in detail

The per-unit cost is the sum of the lines of Chapters 2 to 6. At 50 off it is about A$269.74, made up as follows.

```figure
type: stack
title: EN-700 per-unit cost at 50 off, ex GST
unit: A$
caption: This is an illustration. Material and bought-in items are nearly half; fitting, testing and packing are over a quarter; cutting and folding together are only about an eighth.
- Sheet with on-cost | 85.95
- Bought-in items | 42.00
- Laser, deburring and brake | 35.34
- Joining, assembly, test, inspection and packing | 73.20
- Coating, area and masking | 33.26
```

The split matters for negotiation. A customer who asks for a lower price at higher quantities is asking, in effect, for a reduction in costs that are mostly per unit, and so mostly unchanged by quantity. The honest answer is that the per-unit costs can fall only through changes to the product, such as a simpler grille, a cheaper finish or fewer fasteners, or through improvements in the shop's methods, not through quantity alone.

## Price breaks

The cost per enclosure is the per-unit cost plus the per-batch and one-off costs divided by the quantity. This is an illustration.

- **20 off**: per-unit about A$274.19, plus (596.67 + 190) ÷ 20 = A$39.33, about **A$313.52**.
- **50 off**: per-unit about A$269.74, plus A$15.73, about **A$285.48**.
- **200 off**: per-unit about A$266.39, plus A$3.93, about **A$270.32**.

```figure
type: line
title: EN-700 cost per enclosure against batch size, ex GST
x: Enclosures in the batch
y: Cost per enclosure, A$
ymin: 250
ymax: 370
caption: This is an illustration. The curve falls steeply at small quantities as the A$786.67 of batch and one-off costs is spread, then flattens towards the per-unit cost of about A$266.
- 10 | 358.54
- 20 | 313.52
- 50 | 285.48
- 100 | 274.83
- 200 | 270.32
```

The curve's shape is the point. Between 10 and 50 off, the cost per enclosure falls by about A$73; between 50 and 200, by only about A$15. Customers often expect large price breaks at high quantities, but for a product like EN-700, whose costs are mostly per unit, most of the saving has already happened by 50 off.

## The error: 200 off, called off in 50s

This is an illustration. The customer ordered **200** enclosures at the 200-off price, then, as deliveries were scheduled, asked for them in four batches of 50, a month apart, to suit its own installation programme. The quote had not said that the 200-off price assumed a single batch.

Made as four batches, the job incurs the per-batch costs four times, about 4 × A$596.67 = A$2,386.68, plus the one-off programming once, A$190: about **A$12.88** per enclosure, against the A$3.93 the 200-off price had assumed. With the per-unit cost at the 50-off level, about A$269.74, each enclosure costs about **A$282.62** against the quoted A$270.32, a shortfall of about **A$12.30** per enclosure, about **A$2,461** across the order before margin.

```figure
type: bars
title: Cost per enclosure for 200 off, by how they are made, ex GST
unit: A$
max: 290
caption: This is an illustration. Four batches of 50 cost nearly as much per enclosure as a single batch of 50, because each batch carries its own set-ups.
- *One batch of 200, as quoted | 270.32
- Four batches of 50, as called off | 282.62
- One batch of 50, for comparison | 285.48
```

The shop negotiated a price adjustment for the remaining batches, which the customer accepted once the batch costs were shown to it, but the first batch had already shipped at the quoted price. The fix was a standard line in every quote with price breaks: "prices assume manufacture and delivery in a single batch of the quoted quantity; scheduled call-offs are priced separately". A call-off price can then be quoted properly, as the exercise shows.

## Batch costs that hide in other lines

Some per-batch costs are easy to leave in per-unit lines by mistake. Sheet handling on the laser looks per unit but has a per-batch element, the part-used last sheet of each material; delivery is per truck, not per enclosure; packing materials may come in minimum lots; a coater may have a minimum charge. Each such cost, if it is spread at the rate for the quantity being quoted and then carried into a different quantity's price, misprices the other quantity. The safest practice is to compute each quantity's price from scratch, with its own sheet counts, freight and minimums, as the material and laser lines of Chapters 2 and 3 did, rather than scaling one quantity's figure to another.

## Learning at small batches

The per-unit times in this quote are batch averages for 50 off, including the slower first units of Chapter 5's learning effect. At 20 off, the slower first units are a larger share of the batch, so the true average assembly time is a little higher; at 200 off, a little lower. EN-700's quote uses the same per-unit times at every quantity, which slightly flatters the 20-off price and slightly penalises the 200-off price. For a new product with a long assembly time, a shop may adjust the assembly time by quantity, using its own records of how quickly a team learns a product, and the adjustment can be larger than the difference in set-ups.

## Explaining the breaks to the customer

A quote that shows how its price breaks arise is easier to accept and harder to argue with. EN-700's quote shows, for each quantity, the per-unit price and a single line for "batch set-up and first-article inspection" and another for "programming, first order only". The customer can see why 20 off costs more per enclosure than 200, why a repeat order costs less than the first, and why a call-off schedule changes the price. Showing the structure, without exposing every internal rate, builds trust and leads naturally to conversations about batch sizes and schedules that suit both sides.

## Repeat orders

A repeat order at the same revision needs no programming, because the laser and brake programs already exist, but it still needs all its per-batch costs. This is an illustration. A repeat order for 50 EN-700s costs about A$269.74 + 596.67 ÷ 50 = about **A$281.67** per enclosure, about A$3.80 less than the first order of 50, the programming saved. A repeat at a new revision needs its changed parts reprogrammed, and possibly new set-ups, so it is priced from the parts that changed.

## Special tooling

Some jobs need tooling made or bought for them: a special punch, a forming die, a welding or assembly fixture, a coating jig. Special tooling is a one-off cost, like programming, but often much larger, and the quote must decide how to recover it. This is an illustration. If EN-700's grille were punched with a special slot tool, as Chapter 3's exercise considered, at about A$450, the tool could be charged separately as a line item, amortised over the first order, or amortised over an expected volume across several orders. Charging it separately is the clearest and leaves no risk if repeat orders never come. Amortising it over expected future orders makes the first price lower and carries the risk that the volume never arrives. Whichever is chosen, the quote should state who owns the tool, because a customer who has paid for it will expect it to be kept, maintained and available, and may ask for it if the work moves elsewhere.

## Which quantities to quote

Customers usually choose the quantities, but a shop can suggest others. If the customer's 20, 50 and 200 straddle a point where the shop's batch size naturally changes, such as the number of enclosures that fit one coating load or one truck, a quote at that quantity can show a better price. EN-700's coater loads 25 enclosures per rack in this illustration, so 50 is two full racks and 20 is less than one. A quote that adds a 25-off price, or points out that a batch of 50 fills the coater's racks exactly while a batch of 20 leaves one part-empty, helps the customer buy sensibly and helps the shop run efficient batches.

## Minimum order quantities

Because small batches carry their set-ups over few units, some shops set a minimum batch or a minimum order value, below which the price is set by the minimum rather than by the quantity. For EN-700, a batch of 5 would cost about A$157 per enclosure in batch and one-off costs alone, more than half its per-unit cost. A quote for such a small batch might offer it at a fixed minimum charge, or suggest that the customer combine it with a later order.

## Holding stock for a customer

Some customers ask the shop to make a large batch and hold it, delivering on demand. That gives the customer the large-batch price and the shop the efficient batch, but the shop then carries the material cost, the store space and the risk. If the customer changes the design, cancels or simply orders less than expected, the shop holds enclosures that nobody wants. A holding arrangement should be written into the order: how many enclosures, for how long, who pays for storage, and what happens to any left at the end of the period. The exercise below prices one such arrangement, and the price of holding stock should always be compared with the price of the batches it replaces.

## Reducing set-ups

Since set-ups drive the price breaks, reducing them helps every quote. Quick-change brake tooling, offline programming, standard tools used across many jobs, fixtures that make first-article checks faster, and grouping jobs that share tools all cut set-up time. A shop that halves its set-up time does not only save on each batch; it can quote competitively at smaller quantities, which is often where small shops win work from larger ones. These are improvements to the shop, not to the quote, but the quote's separation of set-up costs is what shows their value.

## First-article inspection

The first enclosure of a batch is checked thoroughly before the rest are made: every dimension against the drawings, every joint, the door's fit, the coating, the labels. It is a per-batch cost, about A$142.50 here, repeated on every batch including repeats, because tools, materials and people change between batches, and it is worth every cent, because it catches a programme error, a wrong tool or a wrong material before it is repeated fifty times. A customer who requires a formal first-article report, with every dimension recorded and submitted, adds the report's preparation to the cost; the quote should say whether one is included.

## Exercise: pricing the call-off

The customer would like 200 EN-700s delivered in four batches of 50 over four months, and asks for a price that reflects that schedule honestly. Using the figures above, what is the cost per enclosure, and what would it be if the shop could make all 200 in one batch and hold 150 in its store, at an illustrative storage and handling cost of A$4 per enclosure per month held?

**Worked answer.** As four batches, the cost is about **A$282.62** per enclosure, as calculated above.

Made in one batch, the cost is about **A$270.32**, but 150 enclosures must be stored: 50 for one month, 50 for two and 50 for three, an average of two months each for the 150, about 150 × 2 × A$4 = A$1,200, or about **A$6.00** per enclosure across the 200. The one-batch route costs about A$276.32 per enclosure, about A$6.30 less than four batches. It also needs the material bought and paid for up front, store space for 150 enclosures and the customer's agreement to the risk of a design change in the meantime. The quote can offer both prices, with the conditions of each, and the customer can choose the one that suits its own programme and cash flow.
