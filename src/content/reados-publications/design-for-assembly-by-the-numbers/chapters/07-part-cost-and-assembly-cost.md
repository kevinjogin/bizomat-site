---
book: design-for-assembly-by-the-numbers
chapterSlug: weigh-part-cost-against-assembly-cost
order: 7
title: "Weigh part cost against assembly cost"
description: "Build a full unit cost for both designs, with parts, labour, test, defects and part-number overhead, then test the redesign's tooling payback, a make-or-modify choice and its sensitivity to volume."
draft: false
---

Design for assembly is often sold on its assembly savings, and those are real, but they are rarely the whole story or even the largest part of it. Combining parts makes the remaining parts more complicated and sometimes more expensive. A redesign needs tooling, drawings and testing before it saves anything. And the savings that matter most, fewer defects and fewer part numbers to manage, are the ones least likely to appear in a costing spreadsheet. A redesign that looks marvellous on assembly time can lose money once everything is counted; one that looks marginal on labour can pay handsomely once defects are included.

This chapter builds a full unit cost for both revisions of the IP-16, works out what the redesign costs to introduce and how quickly it pays back, uses a break-even calculation to decide how to make the new knob, and tests how sensitive the result is to volume. The failure case is the business case for a similar redesign two years earlier, which was rejected on numbers that were wrong.

## A full unit cost for each design

```figure
type: compare
title: Unit cost of revision A and revision B
cols: Revision A | Revision B | Difference
caption: This is an illustration, in A$ excluding GST at A$62 an hour and 6,000 units a year. Revision B's parts include the lock nut packed loose. Defect costs are revision A's measured figure and revision B's estimate from Chapter 6. Part-number overhead is the company's rough estimate of A$350 a year per part number, shown separately because it is the least certain line.
- Parts | 16.91 | 16.99 | +0.08
- Assembly labour | 1.197 (69.5 s) | 0.448 (26.0 s) | −0.749
- Packing the loose lock nut | none | 0.034 (2 s) | +0.034
- Function test | 0.103 | 0.103 | none
- Rework and returns | 0.197 | 0.060 | −0.137
- *Unit cost without overhead | 18.41 | 17.64 | −0.77
- Part-number overhead | 0.642 (11 numbers) | 0.408 (7 numbers) | −0.233
```

Three points stand out.

**Parts cost slightly more.** Revision B's six assembled parts and the loose nut cost A$16.99, eight cents more than revision A's eleven. The plunger, body and knob became more complicated and dearer; the rear bush is cheaper than the threaded cap; and four small parts disappeared. The combined parts did not get cheaper. They rarely do. The saving comes from what is no longer assembled.

**Labour is the largest single saving**, at about 75 cents a unit, but it is not large compared with the price of the product. At 7% of revision A's unit cost, assembly labour could never transform the IP-16's economics by itself.

**Defects nearly match the labour saving in importance.** The fall from about 20 cents a unit to about 6 cents is an estimate, but it comes from eliminating the parts that caused most of revision A's rework and returns, and it is worth about A$819 a year.

Without the overhead line, revision B saves about **A$0.77** a unit, about **A$4,620** a year. The part-number overhead adds roughly another A$1,400 a year, from four fewer part numbers, if the company's estimate is right.

## What the redesign costs to introduce

Revision B cannot be built without new tooling and some engineering work.

```figure
type: bars
title: One-off costs of introducing revision B
unit: A$
max: 7000
caption: This is an illustration. Quotes and estimates obtained during the review. Total A$10,550, excluding GST.
- Knob mould modification for the insert and lug | 6500
- Bush press fixture with hard stop | 1800
- O-ring loading cone | 250
- Drawings, first-article inspection and pilot tests | 2000
```

The total is **A$10,550**. The largest item by far is the knob mould modification, which adds the moulded-in insert and the lock-out lug. That item is the subject of a make-or-modify decision below.

## Does it pay back?

The [Tooling Payback tool](/tools/tooling-payback/) compares the old and new unit costs against a tooling investment and the annual volume. It returns the saving per unit, the annual saving, the number of units needed to pay back the tooling, and the payback period, with reminders to check that the tooling will last that many units and that demand will last that long.

With the old unit cost at **A$18.30** and the new at **A$17.53**, the unit costs from the table above without the overhead line, the tooling at A$10,550 and 6,000 units a year, the tool gives a saving of **A$0.77** a unit, **A$4,620** a year, **13,701** units to pay back and a payback of **2.28 years**.

If the part-number overhead estimate is included, the annual saving rises to about A$6,020 and the payback falls to about **1.75 years**, by hand. The team presented the 2.28-year figure as its main case and the overhead as an upside, because the overhead estimate was the weakest number in the case and the owner should not have to trust it.

The tool's two reminders apply directly. The knob mould must survive at least 13,701 more shots, which the moulder confirmed is well within its life. And the IP-16 must stay in production for well over two years, which the sales history of the last eight years supported.

## Modify the mould, or buy a knob?

The A$6,500 mould modification is more than half the tooling cost. The alternative was to buy a standard catalogue knob with a threaded insert, at about **A$2.40** each and no tooling, instead of modifying the company's own mould for a knob costing **A$1.65**. The catalogue knob has no lock-out lug, so the lock-out would need a different feature, but the team costed the choice first to see whether that problem was worth solving.

The [Process Selection Break-Even Quantity tool](/tools/process-breakeven/) compares two methods with different set-up or tooling costs and unit costs. It returns the break-even quantity, the total and unit cost of each at a planned quantity, and the cheaper choice.

```figure
type: compare
title: Modified mould against catalogue knob, at one year and five years
cols: At 6,000 units | At 30,000 units
caption: This is an illustration. Method A: modified mould, A$6,500 tooling, A$1.65 a knob. Method B: catalogue knob, no tooling, A$2.40 a knob. Break-even 8,667 knobs, about 17 months at 6,000 a year.
- Modified mould, total and per unit | A$16,400, A$2.73 | A$56,000, A$1.87
- Catalogue knob, total and per unit | A$14,400, A$2.40 | A$72,000, A$2.40
- *Cheaper choice | catalogue knob, by A$2,000 | modified mould, by A$16,000
```

The break-even is **8,667** knobs, about 17 months of production. Over one year the catalogue knob is cheaper; over five years the modified mould is cheaper by about A$16,000. The decision therefore depends on how long the product will be made. With eight years of sales history, the team chose the modified mould.

The break-even also showed something more important. With the catalogue knob, revision B's unit cost would rise by 75 cents to about A$18.28, almost exactly revision A's A$18.30. The saving per unit would fall to about **2 cents**, and even the reduced tooling of A$4,050 would take about 34 years to pay back. The redesign only pays because the knob, which carries the threaded insert and the lug, is made cheaply in the company's own mould. A design-for-assembly change is often like this: the saving depends on one part that takes over several jobs being made at a low cost.

## How sensitive is it?

A business case built on one volume is fragile. The team tested the result at half the volume, in case the largest customer's orders fell away.

At **3,000** units a year, the tooling payback tool gives an annual saving of **A$2,310** and a payback of **4.57 years**. The redesign still pays back within the product's likely life, but slowly. At that volume the break-even between the knob options, 8,667 knobs, would take nearly three years to reach.

The opposite case is also worth knowing: if volume doubled, the payback would roughly halve, and the case for automating parts of the bench, discussed in Chapter 3, would begin to appear.

## The case over five years

A payback period says when the money comes back; it says nothing about what happens after. The team drew the cumulative cash position over the five years the sales history supported, without the overhead line and without discounting, so that the owner could see the whole shape.

```figure
type: line
title: Cumulative cash from introducing revision B, main case
x: End of year
y: Cumulative cash, A$
ymin: -12000
ymax: 14000
caption: This is an illustration. Year 0 is the A$10,550 of one-off costs; each later year adds A$4,620 of savings at 6,000 units. Undiscounted. The line crosses zero early in the third year, matching the 2.28-year payback.
- 0 | -10550
- 1 | -5930
- 2 | -1310
- 3 | 3310
- 4 | 7930
- 5 | 12550
```

After five years the redesign is about **A$12,550** ahead, before counting the part-number overhead. Discounting at the company's cost of capital would reduce that figure somewhat, and a proper investment appraisal would include it; for a project of this size, payback and the five-year total were the measures the owner asked for. [NPV, IRR and payback answer different questions](/reados/collections/investment-appraisal-and-business-cases/npv-irr-and-payback-answer-different-questions/) explains what each measure tells a decision-maker and when payback alone can mislead, which is worth reading before a larger case.

## Presenting the case

The owner had rejected a similar case before, so the team kept the new one to a page and arranged it around the decision rather than the analysis.

1. **The decision asked for:** approve A$10,550 to introduce revision B of the IP-16.
2. **The measured basis:** 69.5 s against 26.0 s of assembly, from timed builds; defects from the rework log and returns register.
3. **The result:** about A$0.77 a unit and A$4,620 a year, a payback of about 2.3 years, about A$12,550 ahead after five years.
4. **The least certain numbers, shown separately:** revision B's defect rate, an estimate until the pilot; and the part-number overhead, a rough figure worth perhaps another A$1,400 a year.
5. **What would change the decision:** volume falling below about 3,000 a year, or the product's life being much shorter than five years.
6. **The risks and how they will be checked:** press-fit holding at the smallest interference, and knob loosening, both tested in the pilot of Chapter 8 before production is switched over.

The owner approved it, with a condition: the pilot must confirm the assembly time and the two risks before the old parts were run down.

## What the numbers leave out

Some effects of the redesign were real but deliberately left out of the payback, so as not to overstate it.

- **The customer's time.** Every customer no longer unscrews a lock nut before mounting the plunger, and no longer has knobs work loose. That is a selling point, not a cost saving for the company.
- **Bench capacity.** The IP-16 bench's yearly hours fall from about 116 to about 47 including the packing step, freeing the assembler for other products. That has value only if there is other work to fill the time.
- **Ergonomics.** The awkward cross pin and the tangled springs are gone. The assemblers noticed the difference before the accountants did.
- **The IP-12.** The same redesign applies to the smaller plunger from Chapter 1's exercise, with similar savings at 4,000 a year, for much less additional tooling if the two products can share the rear bush and knob, as Chapter 8 discusses. It was kept out of this case because it needs its own review and its own numbers.

## A failure case: the case that was rejected

This is an illustration. Two years before this review, an engineer proposed a redesign very like revision B. The business case was built in an afternoon. It took revision A's assembly time from the costing spreadsheet, the 40 s estimate that Chapter 1 found was wrong, and estimated the new design at 26 s. The saving looked like 14 s a unit, about **A$0.24**, or about **A$1,447** a year. Against similar tooling of about A$10,550, that gave a payback of about **7.3 years**, and it counted nothing for defects or part numbers. The owner rejected it, reasonably, on those numbers.

Every number in the case was plausible, and the decision followed from them. What was wrong was the evidence. The assembly time was a guess, defects were left out because nobody had added up the rework log and returns register, and the part-number overhead was never considered. With measured numbers, the same redesign pays back in about two and a quarter years.

The detection was this review's time study and defect count, two years late. The correction is a rule for business cases about product changes: use measured times and recorded defect costs, show the least certain numbers separately, and state which numbers would change the decision. A case that is rejected on bad evidence is as costly as one that is approved on it.

## How this applies to a small Australian business

Cost a redesign across the whole unit: parts, labour, test, defects and, separately, part-number overhead. Expect combined parts to cost a little more, and look for the saving in what is no longer assembled and what no longer goes wrong. List every one-off cost before claiming a payback, and test the payback at a lower volume. Use a break-even to decide how to make any part whose tooling dominates the investment, and check whether the whole case depends on that part. Build business cases on measured numbers, and show the uncertain ones separately.

## Exercise: a cheaper modification

The moulder offers a simpler mould modification for **A$4,200**, adding the insert but not the lug, which would leave the lock-out to a small separate clip costing **A$0.08** and adding **3 s** of assembly. What would revision B's unit cost become, and what would the [Tooling Payback tool](/tools/tooling-payback/) give with tooling reduced by A$2,300?

**Worked answer.** The clip adds A$0.08 in parts and 3 s × 62 ÷ 3,600, about **A$0.052**, in labour, so the new unit cost is about 17.53 + 0.13 = **A$17.66**. The saving against A$18.30 falls to about **A$0.64** a unit, about A$3,840 a year. The tooling falls from A$10,550 to **A$8,250**. The payback tool gives about **12,900** units to pay back and a payback of about **2.15 years**, slightly quicker than before. But the clip is a candidate part by the questions of Chapter 2: it does not move, needs no different material and need not be separate. It would add a part number, a handling step and a new way to assemble the product wrongly. The faster payback is real but small, and the team kept the lug in the mould.
