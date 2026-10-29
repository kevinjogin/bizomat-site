---
book: front-end-planning-by-the-numbers
chapterSlug: scoring-project-definition
order: 3
title: "Scoring project definition with a weighted checklist"
description: "A PDRI-style index of 20 weighted elements: 807 at concept, 507.5 at Gate 2, and an independent rescore that moves 185.5 to 254.5 before targeted work brings it to 202."
draft: true
---

"Is the project ready to approve?" is a question that invites a confident yes. The team has worked on the project for months, knows it well and wants to get on with it. What the question needs is something more specific: which parts of the project are defined, how well, on what evidence, and which of the poorly defined parts matter most. A weighted checklist turns that into a number that can be tracked from stage to stage, compared with a threshold set in advance and, most usefully, taken apart to show where the remaining work should go.

This chapter describes the best-known such checklist, the Project Definition Rating Index, and builds a small-business version of it for Northbank's upgrade. It scores the case at concept, at Gate 2 and at Gate 3, shows how the largest contributors directed the work of FEL 3, and ends with a Gate 3 self-assessment that passed comfortably until someone outside the team asked to see the evidence.

## The PDRI idea

The **Project Definition Rating Index (PDRI)** was developed by the Construction Industry Institute (CII) in the United States. The version for industrial projects, by Gibson and Dumont (1996, CII Research Report 113-11), is a weighted checklist of **70 scope definition elements** arranged on a score sheet. Each element is rated for how completely it has been defined, and each rating carries a weight; the weights were set with input from **54 experienced project managers and estimators**. The weighted ratings add up to a score with a maximum of 1,000, and **a lower score means better definition**. A version for buildings, by Cho and Gibson (2001) in the Journal of Architectural Engineering, has **64 elements**.

The CII reports that industrial projects scoring **under 200** consistently outperformed those scoring above 200 on cost, schedule and change orders. Gibson, Wang, Cho and Pappas (2006), summarising about 14 years of CII research across more than 200 capital projects, reported the same direction: better-defined projects performed better. Published copies of the validation tables differ between editions and samples, so this book states only that direction and quotes no percentages.

Two features of the PDRI matter more for a small business than its exact numbers. First, it rates definition, not effort: an element is complete when its evidence exists, not when the team has worked hard on it. Second, the weights tell the team which gaps matter. A gap in the electrical supply is not equal to a gap in the project team's contact list, and a score that treated them equally would send effort to the wrong places.

## A small-business version

This is an illustration. Seventy elements is more than a A$6.4 million packhouse upgrade needs, and the PDRI's weights were set for a different population of projects. Northbank built its own index, keeping the method and writing its own content: **20 elements in three sections**, with weights that sum to 1,000.

- **A, Basis of decision** (weight 300): business objectives and benefit measures, throughput and storage requirement, options and selection basis, site and seasonal constraints, funding and approval path.
- **B, Basis of design** (weight 450): site survey and ground, electrical supply, refrigeration duty, packing line layout, building and fire safety, planning and building approvals, food safety and environmental requirements, equipment list and long-lead items.
- **C, Execution approach** (weight 250): delivery strategy and packages, schedule with deadline and float, cost estimate and contingency basis, risk register, commissioning and pre-season trials, project team and decision rights, change control after the gate.

Each element is rated at one of five levels, and the level sets the fraction of its weight that counts against the project.

```figure
type: formula
title: How Northbank scores an element
formula: element score = weight × level factor; project score = sum of the 20 element scores
caption: This is an illustration. The scale runs from 100, every element complete, to 1,000, nothing defined. Lower is better.
- Level 1, factor 0.10 | complete: the evidence exists, is current and has been checked by someone other than its author
- Level 2, factor 0.30 | minor gaps that cannot change cost or schedule materially
- Level 3, factor 0.55 | some gaps; the answer is expected but not yet in hand
- Level 4, factor 0.80 | major gaps; the work has started but little is settled
- Level 5, factor 1.00 | not defined
step: B1, site survey and ground, weight 60, at level 4: 60 × 0.80 = 48
step: B2, electrical supply, weight 70, at level 3: 70 × 0.55 = 38.5
step: Both at level 1: 60 × 0.10 + 70 × 0.10 = 13; the two gaps were worth 73.5 points
```

General level descriptions invite argument, so Northbank wrote a short description of each level for each element, in terms of the evidence that would exist. For B2, electrical supply capacity and connection, they read:

- **Level 5**: nothing known beyond the existing bills.
- **Level 4**: the site's present maximum demand and the new load estimated.
- **Level 3**: a capacity study by an electrical engineer, stating whether the existing supply can carry the new load and, if not, what upgrade is needed.
- **Level 2**: a written connection offer from the distributor, with its cost and conditions.
- **Level 1**: the offer accepted, the connection works dated and the date carried into the schedule.

Writing these took the project engineer about two days for all 20 elements. It turned each rating from an opinion into a question with a yes or no answer: does the document for the next level exist? It also made the ratings repeatable, so that the same project scored by two people lands on the same level more often than not, which is the property the reviewer tested at Gate 3.

Northbank set its approval threshold at **250 or less**. It did not borrow the CII's 200, because that figure belongs to the full PDRI, its weights and the projects it was tested on; a 20-element index with invented weights has no such evidence behind it, and its scores are not on the same footing. The business chose 250 by looking at what it means: a project with every element at level 2 scores 300, so 250 requires the heaviest elements to be fully defined and allows only minor gaps elsewhere. The threshold was written into the front-end plan before any scoring, so that it could not drift towards whatever the project happened to score. [Stopping rules and kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) in *Stage Gates and Stopping Rules by the Numbers* explains why criteria fixed in advance carry weight that criteria set at the meeting do not. Chapter 10 revisits the threshold once there is an outcome to test it against.

## Scoring the case at each stage

The project engineer scored the index at concept, at Gate 2 and at Gate 3. The full record shows each element's level.

```figure
type: compare
title: Northbank's definition index, levels at each stage
cols: Weight | Concept | Gate 2 | Gate 3 final
caption: This is an illustration. Level 1 is complete and level 5 is not defined. By Gate 3, ten elements are complete, nine have minor gaps and one, B7, is left at level 3.
- A1 Business objectives and benefit measures | 60 | 3 | 2 | 1
- A2 Throughput and storage requirement | 70 | 3 | 2 | 1
- A3 Options considered and selection basis | 60 | 4 | 2 | 1
- A4 Site and seasonal constraints | 60 | 4 | 2 | 1
- A5 Funding and approval path | 50 | 3 | 2 | 1
- B1 Site survey and ground investigation | 60 | 5 | 4 | 2
- B2 Electrical supply capacity and connection | 70 | 5 | 3 | 2
- B3 Refrigeration duty and room specification | 70 | 4 | 3 | 1
- B4 Packing line process and layout | 60 | 3 | 2 | 1
- B5 Building and fire safety design basis | 60 | 5 | 4 | 2
- B6 Planning and building approvals path | 50 | 5 | 3 | 2
- * B7 Food safety, hygiene and environmental requirements | 40 | 5 | 4 | 3
- B8 Equipment list and long-lead items | 40 | 4 | 3 | 1
- C1 Delivery strategy and packages | 50 | 4 | 3 | 2
- C2 Schedule with deadline and float | 50 | 4 | 3 | 1
- C3 Cost estimate and contingency basis | 50 | 4 | 3 | 2
- C4 Risk register and owner actions | 30 | 5 | 3 | 2
- C5 Commissioning, handover and pre-season trials | 30 | 5 | 4 | 2
- C6 Project team and decision rights | 20 | 3 | 2 | 1
- C7 Change control after the gate | 20 | 5 | 4 | 2
```

At **concept** the score was **807**: section A 195, B 401 and C 211. Eight elements were at level 5, mostly in the basis of design, which is what a concept is: a statement of intent with a sketch. At **Gate 2** it was **507.5**: A 90, B 272.5 and C 145. Section A fell furthest in proportion, from 195 to 90, because FEL 2 is where the business decisions are made: what the upgrade is for, how much storage, which option. Section B fell by less than a third, because most of the basis of design is FEL 3 work.

```figure
type: bars
title: Definition score at each stage, threshold 250
unit: points
max: 1000
caption: This is an illustration. Lower is better. The self-assessment passed the 250 threshold easily; the independent review failed it; three weeks of targeted work passed it with evidence.
- Concept | 807
- Gate 2 | 507.5
- Gate 3, team's self-assessment | 185.5
- * Gate 3, independent review | 254.5 | above the threshold of 250
- Gate 3, final | 202
```

## Reading the score by its largest contributors

The total says whether the project is ready. The contributions say what to do about it. At Gate 2, five elements made up 205 of the 507.5 points, about 40%:

- **B1 Site survey and ground investigation, 48**: a survey existed, but no ground investigation.
- **B5 Building and fire safety design basis, 48**: no fire engineering basis, and the building surveyor had not been consulted.
- **B2 Electrical supply capacity and connection, 38.5**: the capacity study had shown that an upgrade was needed, but no connection had been applied for.
- **B3 Refrigeration duty and room specification, 38.5**: the options study had sized the plant roughly; no duty study or specification.
- **B7 Food safety, hygiene and environmental requirements, 32**: requirements known in general terms, nothing assessed for this site.

The first four map directly onto FEL 3 budget lines: the A$14k geotechnical investigation, the A$11k fire engineering basis, the connection application made in week 12, and the A$12k refrigeration duty study. Chapter 5 shows what each of them found. The fifth, B7, had no budget line of its own; it was to be covered by design development. That gap in the plan is visible in the table: B7 is the only element that finished FEL 3 at level 3.

Reading the contributors also stops a common misuse of the total. A team can lower its score fastest by tidying many light elements, such as decision rights or the risk register, while the heavy ones stay open. The contribution list puts the heavy ones at the top every time.

The index measures how well the project is defined, not whether its technology works. The imported optical grader was proven elsewhere but new to Northbank, and the grader trials in FEL 2 were the business's way of testing that. [Technology readiness levels and critical technology elements](/reados/publications/first-of-a-kind-technology-by-the-numbers/technology-readiness-levels/) in *First-of-a-Kind Technology by the Numbers* gives a separate scale for that question, and a project with any genuinely new equipment needs both ratings at its gate.

## The error: a self-assessment that flattered

This is an illustration. In week 19 (Monday 15 March 2027), three weeks before Gate 3, the project engineer and the operations manager scored the index for the gate paper. Their score was **185.5**, comfortably below 250. Borrowing the idea behind Victoria's Gateway reviews, an independent look before a major commitment, the business had asked a retired project director from another food business to review the gate package. The reviewer did not rescore the elements from personal impressions, but asked, for each element rated at level 1 or 2, to see the document that justified the rating.

Five ratings did not survive the request:

- **B1, level 2 to 3 (+15).** The geotechnical report recommended ground improvement under the plant room pad, but the improvement had not been designed or priced.
- **B2, level 1 to 2 (+14).** The team had rated the connection as settled because the distributor's engineer had confirmed the capacity by telephone. The written offer was not due until week 20, it would not be accepted until approval, and the connection works had no dates.
- **B7, level 2 to 3 (+10).** The council's stormwater requirements for the new roof and hardstand had not been checked. Nobody could say whether detention would be required.
- **C2, level 1 to 3 (+22.5).** The schedule used lead times the team had assumed for the plant and the grader, not lead times confirmed in writing by the tenderers, and it did not show the November to January window in which the packing line can be changed.
- **C5, level 3 to 4 (+7.5).** Commissioning was a single two-week bar, with no allowance for pulling the rooms down to temperature and no trial of the grader on fruit.

The reviewed score was 185.5 + 69 = **254.5**, above the threshold. The project would have failed its own gate.

```figure
type: checklist
title: Evidence the reviewer required for a level 1 rating
caption: This is an illustration. A rating is only as good as the document behind it. Items marked as avoid are what the self-assessment had relied on.
- A named, dated document that answers the element | report, drawing, letter or plan, not a meeting note
- External facts confirmed by the party that controls them | distributor, council, supplier, building surveyor
- Dates and quantities that flow into the schedule and estimate | the same figures in all three places
- Checked by someone other than its author | initials and date on the score sheet
- x Rating from memory or from work in progress | "the report is nearly done"
- x An offer, quote or advice counted as an agreement | received is not accepted
```

The team had three weeks before the gate. It used them on the elements that the review had moved, in order of the points at stake. Both tenderers confirmed lead times in writing, 26 weeks for the refrigeration plant and 30 weeks for the grader, and the schedule was redrawn to show them, the line-change window and 7 weeks of float to the deadline: **C2 back to level 1 (−22.5)**. A commissioning plan set out refrigeration pull-down in weeks 52–56 and grader trials on fruit in weeks 56–58: **C5 to level 2 (−15)**. The structural engineer designed the ground improvement and the quantity surveyor priced it into the Class 3 estimate: **B1 to level 2 (−15)**, with the pad's final details waiting on the refrigeration supplier's layout drawings.

Two elements stayed where the reviewer put them. B2 remained at level 2 because the connection offer was to be accepted at approval, not before. B7 remained at level 3: there was no time to commission a stormwater assessment before the gate, and the business accepted it as a known risk, recorded in the risk register with an allowance to be met from contingency. The final score was 254.5 − 52.5 = **202**, below 250 on evidence rather than on confidence.

The error was not dishonesty. It was the ordinary optimism of a team scoring its own work, and the correction was cheap: one reviewer, one question asked consistently, and three weeks of work that was going to be needed anyway. B7 returns in Chapter 10, where its cost turns out to be A$64k. The [Project Gate Review tool](/tools/project-gate/) can record a gate's wider judgement on value, fit, urgency, risk and readiness; it does not score definition, so the two are complements, not substitutes.

## Exercise: closing the last gaps

At Gate 3 the final score is 202. Suppose the business had commissioned the stormwater assessment, raising B7 from level 3 to level 2, and accepted the distributor's offer before the gate, raising B2 from level 2 to level 1. What would the score have been?

**Worked answer.** B7 has weight 40, so moving from level 3 to level 2 changes its score from 40 × 0.55 = 22 to 40 × 0.30 = 12, a fall of **10**. B2 has weight 70, so moving from level 2 to level 1 changes its score from 70 × 0.30 = 21 to 70 × 0.10 = 7, a fall of **14**. The score would have been 202 − 10 − 14 = **178**. The 24 points are small beside the 305.5 removed during FEL 3, but they sit in the two elements most likely to produce a surprise in delivery, which is why the contribution list matters more than the total.
