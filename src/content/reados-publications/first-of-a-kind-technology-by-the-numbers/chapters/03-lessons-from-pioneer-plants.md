---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: lessons-from-pioneer-plants
order: 3
title: "Pioneer plants: where cost growth and performance shortfalls come from"
description: "What RAND's pioneer-plant studies found drives cost growth and start-up shortfalls, applied to a 40% novelty fraction, open effluent scope, a recycle loop and wet fines."
draft: false
---

Chapter 2 measured how ready Option B's elements are. It did not say what happens to a plant built before its elements are ready, or by how much. For process plants, the best published answer comes from a series of studies made at the RAND Corporation between 1979 and 1986, which followed pioneer plants, the first commercial plants of their kind, from estimate to operation. This chapter summarises what those studies measured and found, applies each finding to the recycler's two options, and closes with an estimate that left out part of the plant because the team believed it could not exist.

## The pioneer-plant studies

The first two reports were prepared for the US Department of Energy, and the subtitle of the first names its concern: the implications of cost estimation in new technologies for energy process plants. Three RAND reports matter here.

**Merrow, Chapel and Worthing, *A Review of Cost Estimation in New Technologies* (R-2481-DOE, 1979)**, reviewed the record of cost estimates across several kinds of large new-technology systems. The principal factors in estimation error common to all the system types reviewed were the degree of system definition when the estimate was made, scope and system changes, and the level of technological innovation.

**Merrow, Phillips and Myers, *Understanding Cost Growth and Performance Shortfalls in Pioneer Process Plants* (R-2569-DOE, 1981)**, is the central study. It rests on detailed proprietary data from **44 process plants built by 34 oil, chemical and mineral companies**. It examined two outcomes: cost growth, comparing each plant's actual capital cost with its estimates, and performance, comparing output after start-up with the plant's design. Most of the variation in cost-estimation error was explained by three things: how far the plant's technology departed from that of earlier plants, how well the project and site were defined, and how complex the plant was. Most of the variation in performance was explained by two: new technology, and whether the plant processed solids.

**Merrow, *A Quantitative Assessment of R&D Requirements for Solids Processing Technology* (R-3216, 1986)**, looked more closely at plants that handle solids. It found that their key performance problems resulted from physical and mechanical difficulties rather than from the process chemistry, and that newer plants showed no tendency towards better performance.

The plants in these studies were mostly large North American plants of the 1960s to 1980s, far bigger than a 3.0 t/h washing line. Their findings are used here for what drives cost growth and shortfalls, not for how much: the studies' coefficients and percentages are not quoted in this book, and a recycler cannot borrow them as rates. The drivers, however, are general, and each of them can be checked on the recycler's options.

```figure
type: tree
title: Drivers of cost growth and of performance shortfalls in pioneer process plants
caption: After Merrow, Phillips and Myers (1981) and Merrow (1986), in this book's words. The highlighted drivers are the ones on which Options A and B differ most.
- Cost-estimation error | why final capital cost departs from the estimate
  - * Departure from prior technology | how much of the plant has not run at full scale before
  - Project and site definition | how much was known and settled when the estimate was made
  - Plant complexity | how many linked steps and recycle streams the plant has
- Performance shortfall | why output after start-up falls short of design
  - * New technology | unproven steps take longer to start up and may never reach design
  - Solids processing | wear, blockage and particle behaviour that the process chemistry does not predict
```

## Driver 1: departure from prior technology

The first cost driver asks how much of the plant is new. One natural measure, and the one this book uses, is the **novelty fraction**: the share of capital in elements that have not run at full scale in this duty.

This is an illustration. All A$ amounts are excluding GST. In Option A every element has run at full scale on rigid polyolefin feed, so its novelty fraction is **0%**. In Option B the hydrocyclone stage (A$2,800,000), the closed-loop water treatment (A$1,700,000) and the hyperspectral fines sorter (A$2,500,000) are new to this duty, a total of A$7,000,000 out of A$17,500,000, so its novelty fraction is **40.0%**.

```figure
type: bars
title: Option B's capital estimate by element, novel elements highlighted
unit: A$
max: 3600000
caption: This is an illustration. A$17,500,000 in total. The three highlighted elements, A$7,000,000 or 40.0%, have not run at full scale in this duty; Option A's novelty fraction is 0%.
- Bale breaking, conveying, shredding and granulating | 3600000
- Electrical, controls, building works and installation | 3200000
- * Hydrocyclone wash and separation | 2800000 | TRL 6
- * Hyperspectral fines sorter | 2500000 | TRL 7
- Pre-wash and friction washing | 1900000
- Drying, silos and bagging | 1800000
- * Closed-loop water treatment | 1700000 | TRL 5
```

The novelty fraction and the readiness level answer different questions, and both are needed. Readiness, from Chapter 2, says how far the least proven element still has to go; the novelty fraction says how much of the money is exposed while it goes there. A plant could have a single novel element at TRL 5 that is a small fraction of its cost, or several modestly novel elements that make up most of it. Option B has both a low system readiness and a large exposed share.

## Driver 2: project and site definition

The second cost driver is definition: how much of the plant and its site was known and settled when the estimate was made. An estimate prepared before the design basis, the site layout, the utility connections and the permits are settled is an estimate of something that does not yet fully exist, and the parts not yet designed are usually the parts left out.

The recognised way to state this is to classify the estimate by the maturity of the project definition behind it. AACE International Recommended Practice 18R-97 sets out such a classification for engineering, procurement and construction in the process industries, linking the class of an estimate to how much of the project has been defined. Its classes and ranges belong to [Estimate classes: reading a number by how much is defined](/reados/publications/front-end-planning-by-the-numbers/estimate-classes-and-ranges/) in *Front-End Planning by the Numbers*, and this book does not repeat them.

For the recycler the definition question has a sharp edge. Option A's builder supplies a defined package, and its interfaces with the site are known from 41 earlier installations: the power, the water supply, the trade-waste discharge, the residue handling. Option B's novel elements are defined only as far as the pilot defined them. The pilot showed what the hydrocyclone and sorter need, but the water loop's design basis was still open when the first estimate was made: how much it would bleed at full scale, how the bleed would be treated before discharge, and how the loop's separated solids would leave the site. Those open items are the kind the pioneer-plant research found behind cost growth, and they sit in the same elements as the novelty.

## Driver 3: complexity

The third cost driver is complexity. This book treats it simply: count the linked process steps and, above all, the recycle streams, because a recycle couples stages that would otherwise be independent.

Option A is a long line but an open one. Water is treated and partly reused in a conventional way, and a problem in one stage shows up in that stage. Option B adds a closed water loop, so the wash stages, the hydrocyclones and the water treatment share one body of water. Contaminants removed from the flake accumulate in the loop until the bleed carries them away; a change in feed shows up later as a change in water quality; and a problem in treatment shows up as dirtier flake two stages upstream. Each of those couplings is a way for start-up to take longer than planned and for design changes to spread from one element to another. Chapter 5 shows how the loop's behaviour depends on time as well as size.

## The performance drivers: new technology and solids

The two performance drivers apply with particular force to a washing line. Both options are solids-processing plants: they shred, wash, separate, dry and convey wet plastic flake, fines and grit. On the second driver, then, both carry risk, and Option A's start-up will not be trouble-free. But Option A's builder has met its solids problems 41 times, and the remedies are in the design.

Option B's novel steps are all steps that handle **fines**, the small, light, wet particles that are hardest to move, separate and dry. The hydrocyclone stage exists to recover fines that sink-float tanks lose; the sorter exists to sort fines; and the closed loop has to keep fines and dissolved contaminants from building up in the water. Merrow's 1986 finding is directly relevant: the difficulties that held solids plants below design were physical and mechanical, of the kind that are found by running full-scale equipment for a long time, not by analysing the process. In a washing line those are things like abrasive wear in cyclones and pumps, screens and nozzles that blind, and particles that do not flow or separate as the pilot suggested. A short pilot on a selected feed is the least likely place to find them.

```figure
type: compare
title: Options A and B on each pioneer-plant driver
cols: Option A, proven | Option B, novel
caption: This is an illustration. B is worse on every driver except solids, where both carry risk, and B's novel steps all handle the hardest solids, the fines.
- Departure from prior technology | novelty fraction 0%; 41 lines built | novelty fraction 40.0%; system readiness TRL 5
- Project and site definition | defined package; site interfaces known | water loop bleed, treatment and solids disposal open at first estimate
- Complexity | open water circuit; stages fail separately | closed loop couples wash, separation and treatment
- New technology, for performance | none | hydrocyclone stage, closed loop, fines sorter
- * Solids processing, for performance | wet flake and grit; remedies already in the design | wet flake and grit; every novel step handles fines
```

## Proven equipment in a new duty

The pioneer-plant findings are sometimes read as a warning against new machines. They are better read as a warning against new **duties**. A hydrocyclone is a well-understood device, used for decades in mineral processing, and the fines sorter's maker has about 300 sorters at work in food processing. What is new in Option B is the duty each is asked to perform: separating wet plastic fines by density in a recycle loop, and sorting wet fines by spectrum. Equipment that is proven in one duty and new in another departs from prior technology in the sense that matters, because the plant's behaviour, not the machine's, is what has never been seen.

That is also why a supplier's list of installations must be read for duty, not for numbers. Chapter 4 shows what happens when it is not.

## The error: the effluent that a closed loop could not have

This is an illustration. The first full estimate for Option B, built from the supplier's quotation and the recycler's own pricing of site works, came to **A$17,320,000**. It contained no trade-waste connection and no pre-treatment pit for discharged water. The reasoning recorded in the estimate notes was that "a closed loop has no effluent".

A closed loop does have effluent. Contaminants removed from the flake accumulate in the water and must leave somewhere; in Option B's design they leave with a continuous bleed of **2.0 m³/h**, replaced by fresh make-up water. Over 6,000 operating hours that is **12,000 m³ a year** of wastewater to be pre-treated and discharged to sewer under a trade-waste agreement, or about **A$54,000 a year** at an illustrative A$4.50/m³ for supply and trade-waste charges combined.

The gap was found by a definition question, not by a cost check. During the estimate review the independent reviewer walked the site boundary on the layout drawing and asked, for each option, what crossed it: bales and power in; flake, residue and water out. For Option A the answer for water was a trade-waste connection, priced. For Option B it was nothing, which was physically impossible for a loop that bleeds. [Finding the hidden scope before approval](/reados/publications/front-end-planning-by-the-numbers/finding-the-hidden-scope/) in *Front-End Planning by the Numbers* treats this kind of search systematically.

The correction added **A$180,000** for the trade-waste connection and bleed pre-treatment pit to the electrical, controls, building works and installation element, bringing B's estimate to the **A$17,500,000** used throughout this book. The running cost needed no change: it was already inside B's extra A$5 per tonne of variable cost, which over 18,000 t is A$90,000 a year. The lesson for the definition score was larger than the dollars. An element defined only by its pilot carries scope that nobody has yet been asked to draw, and the only reliable way to find it is to trace every flow across the boundary of the full-scale plant. Chapter 5 does exactly that for the water loop, flow by flow, and finds something more serious than a missing pit.

## What the drivers predict for Option B

Put together, the drivers predict that Option B's capital cost will grow more than A's, because it is more novel, less defined and more complex; that its schedule will stretch for the same reasons; and that its start-up will be slower and may stop short of design, because its new technology handles solids. None of that is yet a number. Chapter 7 turns the performance prediction into a ramp-up curve for each option, and [Contingency and schedule allowances that grow with novelty](/reados/publications/first-of-a-kind-technology-by-the-numbers/contingency-that-grows-with-novelty/) turns the cost prediction into allowances graded by each element's readiness, so that the 40% of B's capital that is novel carries most of the range.

## Exercise: the novelty of a separable module

The board later considers a third strategy, C: build Option A now, and add a separable fines-recovery module later, made up of a hyperspectral fines sorter (A$1,600,000) and a small hydrocyclone stage (A$600,000), working on Option A's residue stream. Both module elements are new to this duty. What is the novelty fraction of the combined plant, and how does the position of the novelty differ from Option B's?

**Worked answer.** The combined plant costs A$16,000,000 + A$2,200,000 = A$18,200,000, of which A$2,200,000 is novel, so the novelty fraction is 2,200,000 ÷ 18,200,000 = **12.1%**, against 40.0% for Option B. The position matters as much as the share. In Option B the novel elements sit in the main product path: if the water loop or the hydrocyclone stage fails to perform, the whole plant makes less flake or none. In strategy C the novel elements sit on the residue stream, outside the main product path: the proven line makes its guaranteed 72% whether or not the module works, and the module can only add to it. A pioneer-plant driver applied to a module that cannot stop the plant is a much smaller risk than the same driver applied to the plant itself, and Chapter 9 values the difference.
