---
book: front-end-planning-by-the-numbers
chapterSlug: estimate-classes-and-ranges
order: 4
title: "Estimate classes: reading a number by how much is defined"
description: "Northbank's Class 5, 4 and 3 estimates of A$5.41m, A$5.96m and A$6.43m, their ranges, why the point rose 18.8% as definition grew, and a loan sized on the wrong class."
draft: true
---

An estimate travels further than the conditions it was made under. A figure written on a concept sketch in November is quoted in a board paper in December, a bank's credit submission in January and a conversation with a supplier in March, and by then nobody remembers that it was a sketch. The cure is to attach two things to every estimate wherever it goes: its **class**, which says how much of the project was defined when it was made, and its **range**, which says how far the outcome could reasonably fall from it.

This chapter explains estimate classes, sets out Northbank's own range guideline and applies it to the three estimates its front end produced. It shows why the point estimate rose as definition grew, and why that is the normal direction rather than a sign of poor estimating. It covers what contingency at each class is for, and ends with a loan facility that was sized on the first estimate and never revisited.

## Classes by definition maturity

AACE International's Recommended Practice **18R-97** classifies cost estimates for the process industries into **five classes**, from **Class 5**, prepared with the least project definition, to **Class 1**, prepared with the most. The primary characteristic that sets the class is the **maturity of project definition** at the time of the estimate, not the effort spent on the estimate or the seniority of the estimator. Each class has an expected accuracy range that narrows as definition grows. The recommended practice treats those ranges as typical outcomes, not as targets the estimator must meet, and it is written for process plants; other AACE practices adapt the scheme to building and other industries. This book quotes none of its numeric ranges, which vary between revisions; Northbank's ranges below are its own.

The useful idea is the link between the class and the definition behind it. Chapter 3 measured Northbank's definition with a weighted index. The class is the estimator's equivalent statement: at concept the business knew roughly what it wanted and had budget prices; at Gate 2 it had chosen an option and investigated the largest unknowns; at Gate 3 it had a developed design, a ground investigation, a fire engineering basis and tender prices for half of the delivery cost. Northbank tied its classes to its gates: **Class 5 at concept, Class 4 at Gate 2, Class 3 at Gate 3**. Classes 2 and 1 come later, when detailed design and most contracts are in place, and a business seldom needs them to decide.

## Northbank's own ranges

This is an illustration. Northbank's estimating guideline, written for this project by its project engineer and finance manager, sets a range for each class as a percentage below and above the point estimate. These are the business's invented working values, not AACE's figures and not a benchmark.

- **Class 5**: −30% to +50%.
- **Class 4**: −20% to +30%.
- **Class 3**: −10% to +20%.

```figure
type: formula
title: Turning a point estimate into a range
formula: low = point × (1 + low %); high = point × (1 + high %)
caption: This is an illustration. Northbank's own guideline percentages, applied to its three estimates. All amounts are A$ excluding GST.
- point | the estimator's best single figure for total project cost
- low %, high % | the class's guideline percentages, negative below and positive above
step: Class 5: 5,410 × 0.70 = 3,787 and 5,410 × 1.50 = 8,115; width A$4,328k
step: Class 4: 5,960 × 0.80 = 4,768 and 5,960 × 1.30 = 7,748; width A$2,980k
step: Class 3: 6,428 × 0.90 = 5,785 and 6,428 × 1.20 = 7,714; width A$1,928k
```

The ranges are deliberately lopsided: the room above the point is larger than the room below it. That is not pessimism. The ways an estimate goes wrong are not balanced. A concept leaves things out far more often than it includes things that turn out to be unnecessary, quantities grow as design develops, and unknown ground, services and approvals add cost much more often than they remove it. A symmetric range around an early estimate would understate the likely upside and suggest savings that seldom arrive.

## The three estimates

All money in this chapter is in Australian dollars excluding GST. The three estimates, their ranges and the money approved at each stage were:

- **Class 5, week 0: A$5,410k**, prepared from budget prices on the concept: building and civil 1,900, refrigeration plant and rooms 1,450, grader and packing line 1,480, electrical 180, fire services nothing, design, approvals and management 400. Range A$3,787k to A$8,115k.
- **Class 4, Gate 2, week 10: A$5,960k**, the Class 5 figure plus an electrical supply upgrade of A$380k and A$170k of extra refrigeration capacity, both found in FEL 2. Range A$4,768k to A$7,748k.
- **Class 3, Gate 3, week 22: A$6,428k**, a delivery base of A$6,180k prepared by a quantity surveyor from developed design and tender prices, plus the A$248k front end. Range A$5,785k to A$7,714k.

```figure
type: range
title: Northbank's three estimates and their ranges
min: 3000
max: 9000
unit: A$'000
ticks: A$3m | A$6m | A$9m
caption: This is an illustration. Each range narrows as definition grows, and each later point sits inside the earlier ranges. The rush budget sits below the Class 3 point; the Gate 3 funding sits inside the Class 3 range.
- Class 5, concept | 3787 | 8115 | point A$5,410k
- Class 4, Gate 2 | 4768 | 7748 | point A$5,960k
- * Class 3, Gate 3 | 5785 | 7714 | point A$6,428k
- Rush budget, Class 5 plus 10% | 5950 | 5950 | below the Class 3 point by A$478k
- Gate 3 funding, including front end | 6948 | 6948 | 8.1% above the Class 3 point
```

The width of the range is a measure of what the business does not yet know. It fell from A$4,328k at concept to A$1,928k at Gate 3, a reduction of more than half, for A$248k of front-end work.

A range is also a test of the decision, not only of the estimate. At the top of the Class 5 range, A$8,115k, option (a) would still have an NPV of about A$870k over ten years at 9%, with its A$1,400k a year of benefit, and a simple payback of 5.8 years. The project was worth defining even in the bad case, which is what justified spending on FEL 2. At the top of the Class 3 range, A$7,714k, the NPV would be about A$1,271k. A project whose NPV turns negative inside its own range is not ready for approval, however attractive its point estimate looks, and the range is what makes that visible.

## Reading the class of an estimate someone hands you

Estimates rarely arrive labelled. A contractor's budget price, a supplier's quotation and a consultant's cost plan look alike on a page, and each can be quoted to the nearest thousand dollars whatever it rests on. Three questions place an estimate in its class.

- **What was defined when it was made?** A sketch and an equipment list support a Class 5 estimate; a chosen option with the main unknowns investigated supports Class 4; a developed design, a ground report and an approvals path support Class 3. The definition score from Chapter 3 answers this question directly.
- **How was it priced?** Rates per square metre and allowances belong to the early classes. Measured quantities priced at current rates, and tender prices for the large packages, belong to Class 3.
- **What does its largest uncertain line rest on?** An estimate is only as mature as its least defined large component. Northbank's Class 5 estimate included a firm supplier quotation for the grader, A$1,480k, about 27% of the total. That line was close to final from the start, but it did not lift the estimate out of Class 5, because the building, refrigeration and electrical lines beside it were budget allowances on a sketch, and the fire services line was empty.

The third question catches the most common mistake in reading an estimate: treating a total as firm because some of its parts are. At Gate 3 the position was different in kind. The refrigeration and grader packages, A$3,200k or 51.8% of the delivery base, were tender prices, and the rest was measured from developed design by a quantity surveyor.

## Why the point rises as definition grows

The Class 3 point is **A$1,018k**, or **18.8%**, above the Class 5 point. None of the increase is inflation: all three estimates are in the same dollars. It is scope. The concept described what the business wanted, and the front end found what the site, the network operator, the building surveyor and the old plant required as well. Chapter 5 tells how each item was found.

```figure
type: stack
title: Growth from Class 5 to Class 3, A$1,018k
unit: A$'000
caption: This is an illustration. Five discovered items account for A$990k; design and management account for A$28k, because the A$400k concept allowance became A$180k in delivery plus the A$248k front end. The grader line did not change, because its price was a supplier's quotation from the start.
- Electrical supply upgrade | 380 | found in FEL 2
- Refrigeration plant for old and new rooms | 270 | A$170k in FEL 2, A$100k in FEL 3
- Fire services | 190 | from the fire engineering basis
- Building and civil: ground improvement and dock equipment | 150 | A$120k and A$30k
- Design, approvals and management | 28 | A$400k became A$180k plus A$248k
```

The growth arrived in two steps. From Class 5 to Class 4 the point rose by A$550k, 10.2%, as FEL 2 found the electrical and most of the refrigeration items. From Class 4 to Class 3 it rose by A$468k, 7.9%, as FEL 3 found the ground improvement, the fire services and the dock equipment and completed the refrigeration specification. Each step was smaller than the one before, which is what better definition should produce.

Two lessons follow. First, an early estimate that later rises has not necessarily been badly made. Northbank's Class 5 estimate was a fair price for what the concept described; the concept simply did not describe everything the project needed. Second, the rise is predictable in direction, if not in size, which is why the ranges lean upwards and why approving a budget at a Class 5 point is a bet that the concept is complete.

## What contingency is for at each class

**Contingency** is money held for costs that are expected to arise within the defined scope but cannot yet be priced item by item: quantities that grow as the design is detailed, minor items not yet drawn, rates that move between estimate and contract, and the known risks that have not been designed out. It is not for changes to the scope, and it is not meant to reach the top of the range.

```figure
type: compare
title: Contingency at each class
cols: Point | Contingency | Share | Budget
caption: This is an illustration. Contingency did not fall steadily with class. It rose at Gate 2, when FEL 2 had identified risks it could not yet price, and fell at Gate 3, once FEL 3 had priced them into the base.
- Class 5, rush budget | A$5,410k | A$540k | 10.0% of the point | A$5,950k
- Class 4, Gate 2 | A$5,960k | A$715k | 12.0% of the point | A$6,675k
- * Class 3, Gate 3 | A$6,180k delivery base | A$520k | 8.4% of the delivery base | A$6,700k for delivery; A$6,948k with the front end
```

The 10.0% on the Class 5 estimate was the figure in the managing director's rush proposal, chosen because it was round. Against a range reaching 50% above the point, it covered almost none of the likely growth: the rush budget of A$5,950k is A$478k below the eventual Class 3 point. At Gate 2 the project engineer raised contingency to 12.0%, because FEL 2 had identified the ground, the fire services and the old plant as risks that FEL 3 would investigate but had not yet priced. At Gate 3 those risks were in the base estimate, and contingency fell to A$520k, 8.4% of the delivery base, for what remained: the stormwater question left open in Chapter 3, quantity growth in a developed design, and the weather.

The Gate 3 funding of A$6,948k sits 8.1% above the point, well inside the Class 3 range but A$766k below its top. Whether to fund nearer the top is a separate decision about how much confidence the business wants to buy. [Uplifts and contingency: from a percentile to a budget](/reados/publications/reference-class-forecasting-by-the-numbers/uplifts-and-contingency/) in *Reference Class Forecasting by the Numbers* sets a budget from the outcomes of comparable past projects at a chosen percentile, and [From estimate to commitment: keeping the range and setting rules for money held back](/reados/collections/project-estimates-schedules-and-costs/from-estimate-to-commitment/) separates the contingency a project team can spend from the reserve the owner holds.

## The error: a loan sized on the wrong class

This is an illustration. In November 2026, while the rush proposal was before the board, the finance manager opened a discussion with the bank about a construction loan facility, sized at the rush budget, **A$5,950k**, because that was the only figure on the table, and the bank's credit submission was prepared on that basis. When the board chose the front-end path, the loan discussion continued in the background, and the facility was approved in principle in February 2027 at the figure it had started with. The Gate 2 paper reported a Class 4 budget of A$6,675k, but nobody connected that paper with the loan file.

The mismatch surfaced in week 21, when the quantity surveyor's Class 3 estimate arrived and the project engineer drafted the funding line of the Gate 3 paper. Total funding needed was the A$6,700k delivery budget plus the A$248k front end, **A$6,948k**. Against a facility of A$5,950k, the gap was **A$998k**, about 17% of the facility. If the project had been approved on the assumption that the facility covered it, the business would have discovered the shortfall when the drawdowns ran out, with the plant and grader contracts already signed.

It was corrected before approval. The finance manager took the Class 3 estimate, the fixed-price tenders and the definition score to the bank, which increased the facility on the strength of a better-defined project; the business also agreed to fund part of the gap from its own cash. Gate 3 stayed at week 22.

The lasting change was a reporting rule: any cost figure quoted before Gate 3, in any document, carries its class and its range. The figure that went to the bank in November would then have read "Class 5, A$5,410k, range A$3,787k to A$8,115k". A lender reading that line would not have sized a facility at A$5,950k without asking how the business planned to cover the rest of the range.

The business added one more check to its gate papers. Each paper now lists every external commitment that depends on the project's cost, such as the loan facility, the insurance declaration and the board's capital plan, beside the current estimate and its class. Each one is marked as matching or not matching. At Gate 2 that list would have shown the facility at A$5,950k against a Class 4 budget of A$6,675k, eleven weeks before the gap reached the Gate 3 paper.

## Exercise: one class inside another

Is the Class 3 point estimate of A$6,428k inside the Class 4 range, and how far is it from the Class 4 point?

**Worked answer.** The Class 4 range is 5,960 × 0.80 = **A$4,768k** to 5,960 × 1.30 = **A$7,748k**. A$6,428k lies within it. It is 6,428 − 5,960 = A$468k above the Class 4 point, which is 468 ÷ 5,960 = **7.9%**, well inside the +30% allowed above the point. The Class 4 range did its job: it warned that the point was more likely to rise than fall, and the later estimate stayed within it. A Class 3 point outside the Class 4 range would have meant either that the Class 4 estimate missed something large or that the guideline percentages were too narrow, and either would be worth investigating before approval.
