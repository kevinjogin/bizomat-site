---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: finding-problems-while-they-are-cheap
order: 1
title: "Finding problems while they are cheap: the cost of change by stage"
description: "Cost to fix a design issue from A$1,000 at concept to A$120,000 in the field, capture rates from the LT-4 record, and a plan that cuts BPU-5's expected fixing cost to A$637,625."
draft: true
---

Every new design carries problems that nobody has found yet: a fan that is too small for the air it must move, a bracket that cracks on the third drop, a charger that does not slow down when the battery is hot. The development plan cannot remove them, because nobody knows what they are. What the plan decides is where they will be found, and that decides what they cost. Found in a calculation, a problem costs an engineer's afternoon. Found in a customer's unit on a building site, the same problem costs field repairs, travel, replacement parts and goodwill.

This chapter sets up the running case and the cost model that the rest of the book uses. It defines the five stages at which a design problem can be found, puts a cost on fixing one at each stage, and uses the records of the business's previous product to measure how much of what remained each stage actually caught. From those records it builds an expected-cost plan for the new product and compares two ways of running the programme. It ends with a close-out report that counted the previous product's problems instead of pricing them, and drew the wrong lesson as a result.

## The BPU-5 and its programme

This is an illustration. A Brisbane manufacturer of temporary power and lighting equipment for building sites, with about 45 staff, is developing the **BPU-5**, a wheeled battery power unit meant to replace the small petrol generators used on residential building sites. The battery is lithium iron phosphate (LFP): 16 cells of 3.2 V and 100 Ah, **5.12 kWh** nominal, with a usable target of **4.50 kWh** of DC energy claimed at concept. A **3.0 kW** inverter (6.0 kW surge for 2 seconds, efficiency **92%**) supplies 230 V outlets with RCD protection, and a 2.0 kW charger refills the battery from an ordinary 10 A outlet in about 2.5 hours. The target mass is **82 kg**.

Three requirements matter most in this book:

- **R1, runtime.** Last a full site day, 7:00 to 15:30 (8.5 hours), on at least **95%** of days on a typical residential site, through the unit's first **2 years**.
- **R2, temperature.** The hottest cell stays at or below **45 °C** after 1 hour at 3 kW in a **35 °C** ambient, which in the case is the cell maker's limit for charging.
- **R3, handling damage.** Survive a **300 mm corner drop** onto concrete with no damage to the battery tray and no loss of function.

The unit sells for **A$6,900**, excluding GST, against a target unit cost of A$4,400, so each unit contributes A$2,500. The business expects to sell 1,000 units in the first year. The development budget is **A$1,450,000**: engineering labour A$720,000 at A$140 an hour, prototypes A$260,000, tooling A$310,000, and testing and certification A$160,000. The programme runs **72 weeks** from concept approval to production release.

The people in the case are known by their roles, such as the product manager and the lead electrical engineer. The business's previous new product was the **LT-4** LED lighting tower, released in 2022, and its records are the main evidence this chapter uses.

## Five stages, defined once

Product development is usually organised around a series of builds, each with a different purpose. This book uses five stages, and every chapter means the same thing by each name.

- **Concept and analysis.** Requirements, calculations, models, simulations and focused rigs, before any whole unit exists. A problem found here is fixed on paper or in a model.
- **EVT, engineering validation test.** The first whole units, built by hand from prototype parts, to find out whether the design works at all. The BPU-5 has an EVT build of **4 units** at A$22,000 each.
- **DVT, design validation test.** Units built to the intended final design, close to production parts, to show that the design meets its requirements and to support certification testing. The BPU-5 has **12 DVT units**.
- **PVT, production validation test.** A pilot build on the real production line with production tooling, to show that the line can build the design consistently. The BPU-5 pilot is **30 units**.
- **Field.** After production release, when units are in customers' hands.

```figure
type: timeline
title: BPU-5 programme, weeks from concept approval
caption: This is an illustration. Each build is followed by a formal review. The release review at week 72 is the planned end of development.
- Week 10 | Concept review | requirements, analysis and focused rigs reviewed
- Week 18 | EVT build | 4 hand-built units at A$22,000 each, A$88,000
- Week 24 | EVT review | does the design work at all
- Week 36 | DVT build | 12 units to the intended final design
- Week 44 | DVT review | does the design meet R1 to R3
- Week 54 | PVT build | 30 units on the production line
- Week 62 | PVT review | can the line build it consistently
- * Week 72 | Production release review | planned release
```

Each build costs more and commits more of the design than the one before it, so each is a more expensive place to discover that something is wrong.

## What a fix costs at each stage

This is an illustration. The business estimates the average cost of fixing one design issue by the stage at which it is found, from its LT-4 records and current rates:

- **Concept and analysis, A$1,000.** About 7 hours of engineering at A$140 an hour: understand the problem, change the calculation or drawing, and check the change.
- **EVT, A$6,000.** The same engineering, plus parts already bought or made for 4 units that must be modified or replaced, and the tests that must be repeated.
- **DVT, A$15,000.** Twelve units to rework, supplier parts on order to the old design, and certification test results that the change may invalidate.
- **PVT, A$35,000.** Production tooling, jigs, work instructions and test procedures already made to the old design, 30 pilot units to rework, and repeat qualification of the changed part.
- **Field, A$120,000.** Units in customers' hands: a retrofit campaign, travel to sites across south-east Queensland, replacement parts, warranty administration and service technicians' time. Lost goodwill is not priced.

```figure
type: bars
title: Cost to fix one design issue by the stage it is found
unit: A$
max: 120000
caption: This is an illustration, excluding GST. The field cost is 120 times the concept cost and 8 times the DVT cost. The ratios, not the exact values, drive every plan in this book.
- Concept and analysis | 1000 | engineer's time on a model or drawing
- EVT | 6000 | 4 hand-built units to modify and re-test
- DVT | 15000 | 12 units, supplier parts and certification tests
- PVT | 35000 | tooling, jigs and 30 pilot units
- * Field | 120000 | retrofit units in customers' hands
```

Each step rises because more has been built on the assumption that the design was right. The problem itself does not grow: a fan that is too small is the same fan at concept and in the field. What grows is the amount of work, material and evidence that depends on the faulty decision and must be redone. That is why the cost of a problem belongs to the stage at which it is found, not to the problem.

These are averages, good enough for planning over dozens of issues. A single issue, such as a label change at PVT or a safety problem in the field, should be costed on its own facts.

## What software research found

The rising cost of late change is one of the oldest findings in engineering management. For software, Boehm and Basili (2001) reported that finding and fixing a problem after delivery is often about 100 times more expensive than finding and fixing it during requirements and design. They also noted that for small, noncritical software systems the factor is more like 5:1 than 100:1. Both statements are about software, and the spread between them is itself the lesson: the factor depends on what has been built and shipped by the time the problem appears.

Neither ratio transfers to hardware, which has tooling, certification tests and physical units in the field, and no cheap remote update. The BPU-5's own ratio of 120:1 between field and concept comes from the business's records, and its closeness to Boehm and Basili's 100 is a coincidence, not a confirmation. A business needs its own costs by stage.

## The LT-4 record

The business logged every design issue on the LT-4 lighting tower with the stage at which it was found. This is an illustration. There were **38 issues**: 9 at concept, 12 at EVT, 8 at DVT, 5 at PVT and 4 in the field. Priced at today's costs by stage, they cost 9,000 + 72,000 + 120,000 + 175,000 + 480,000 = **A$856,000** to fix, an average of about A$22,526 an issue.

```figure
type: compare
title: LT-4 design issues by stage found: count against cost
cols: Issues | Share of issues | Fixing cost | Share of cost
caption: This is an illustration, excluding GST. Four field issues are 10.5% of the count and 56.1% of the cost. Concept and EVT together found 55.3% of the issues for 9.5% of the cost.
- Concept and analysis | 9 | 23.7% | A$9,000 | 1.1%
- EVT | 12 | 31.6% | A$72,000 | 8.4%
- DVT | 8 | 21.1% | A$120,000 | 14.0%
- PVT | 5 | 13.2% | A$175,000 | 20.4%
- * Field | 4 | 10.5% | A$480,000 | 56.1%
- Total | 38 | 100% | A$856,000 | 100%
```

The table shows the shape that matters. More than half the issues were found in the two cheapest stages, and they cost almost nothing to fix. The four that escaped to the field cost more than all the others put together.

### Capture rates

The LT-4 record can be turned into something more useful than a count. A **capture rate** is the share of the issues still present at the start of a stage that the stage finds. It measures how good each stage is at finding problems, independently of how many problems were there to find.

The LT-4 started with 38 issues. Concept found 9 of 38, a capture rate of **0.237**. That left 29, of which EVT found 12, a rate of **0.414**. That left 17, of which DVT found 8, **0.471**. That left 9, of which PVT found 5, **0.556**, and the remaining 4 reached the field.

The rates rise with each build, as the units examined become more real. They describe how the LT-4 programme was run, not a law of nature. A programme that spends more on analysis and focused rigs before the first build should capture more at concept; one that skips its DVT build would capture less before release. That is what makes capture rates a planning tool: the plan can change them.

## Planning where BPU-5's problems will be found

The BPU-5 is a more complex product than the LT-4: a battery, an inverter, a charger and their thermal management, where the LT-4 had lights, a mast and a simple power supply. The lead electrical engineer and the product manager estimate **45 latent issues**, about a fifth more than the LT-4's 38. The estimate is uncertain, but the comparison between plans below holds for any number of issues, because every expected count and cost scales with it.

Expected issues found at a stage are the issues remaining multiplied by that stage's capture rate. Applying the rates in turn gives the expected number found at each stage and, with the costs by stage, an expected fixing cost.

**Plan A** runs the BPU-5 the way the LT-4 was run, with the LT-4's capture rates. It expects to find 10.7 issues at concept, 14.2 at EVT, 9.5 at DVT and 5.9 at PVT, leaving **4.7** for the field. The expected fixing cost is 10,658 + 85,263 + 142,105 + 207,237 + 568,421 = **A$1,013,684**.

**Plan B** spends an extra **A$60,000** on analysis, models and focused rigs before and between the builds, chosen by the methods of [Choosing prototype fidelity](/reados/publications/prototypes-and-simulation-by-the-numbers/choosing-prototype-fidelity/). The team judges that this raises the concept capture rate to **0.45** and the EVT and DVT rates to **0.50**, leaving PVT at the LT-4's 0.556. It expects to find 20.3 issues at concept, 12.4 at EVT, 6.2 at DVT and 3.4 at PVT, leaving **2.8** for the field. The expected fixing cost is 20,250 + 74,250 + 92,813 + 120,313 + 330,000 = **A$637,625**.

```figure
type: compare
title: Plan A and Plan B for BPU-5's 45 expected latent issues
cols: Plan A, LT-4 practice | Plan B, analysis and focused rigs
best: 2
caption: This is an illustration, excluding GST. Plan B finds nearly twice as many issues at concept and sends about 2 fewer to the field. Its expected fixing cost is A$376,059 lower, A$316,059 after its extra A$60,000.
- Capture rates, concept / EVT / DVT / PVT | 0.237 / 0.414 / 0.471 / 0.556 | 0.45 / 0.50 / 0.50 / 0.556
- Expected found at concept | 10.7 | 20.3
- Expected found at EVT | 14.2 | 12.4
- Expected found at DVT | 9.5 | 6.2
- Expected found at PVT | 5.9 | 3.4
- Expected in the field | 4.7 | 2.8
- Expected fixing cost | A$1,013,684 | A$637,625
- Extra spend | none | A$60,000
- * Expected net saving against Plan A | | A$316,059
```

Plan B's expected fixing cost is A$376,059 lower, and after its extra A$60,000 it is still **A$316,059** better. The share of issues found before release moves only from 89.5% to 93.9%, which looks like a small improvement in a count. The cost falls by 37%, because the issues Plan B finds early are drawn from the expensive end of the distribution. Every issue moved from the field to concept saves A$119,000; every issue moved from DVT to concept saves A$14,000. The same question, how much to spend on finding out before committing, arises before a capital project is approved, and [How much front-end planning is enough](/reados/publications/front-end-planning-by-the-numbers/how-much-front-end-is-enough/) in *Front-End Planning by the Numbers* answers it with a diminishing-returns model.

The capture rates in Plan B are judgements, and the plan should say so. The rest of this book is largely about making them less of a judgement: Chapter 3 shows how to decide whether a particular test is worth its cost, Chapter 4 how many rounds of iteration to run, and Chapter 10 how the issue log is used at each review to check whether the plan's rates are being achieved.

## The cost of delay and the critical path

Finding problems costs money; it can also cost time, and time has a price. The business estimates that each week by which the BPU-5's release is delayed costs about **A$25,000**: roughly 10 units a week of sales that are lost or pushed beyond the product's selling life, at A$2,500 contribution each. This **cost of delay** is a business estimate, not an accounting entry, and it rests on a demand forecast. Reinertsen (2009) argues that development teams that do not put a number on it tend to treat time as free, and so trade it away for small savings in cost.

A delay costs the business only when it lands on the **critical path**, the chain of dependent tasks that sets the release date. A week spent redesigning a fan duct while the team waits for DVT parts that would not have arrived any earlier costs engineering time but no release time. A week spent redesigning the battery tray while the tooling order waits for it moves the release date and costs A$25,000. Throughout this book, a delay is charged at A$25,000 a week only when it is on the critical path, and the chapters say which.

The costs by stage exclude delay. Adding it makes late finds dearer still, because a problem found at PVT is far more likely to sit on the critical path than one found at concept.

## What the model leaves out

The expected-cost model is deliberately simple, and its limits should be stated alongside its answer.

- **Issues are not all alike.** A safety issue that escapes to the field can cost many times the average, and some issues can only be found by a particular kind of test. Later chapters treat the thermal and drop issues separately for that reason.
- **Capture rates are averages over issue types.** A stage that is good at electrical problems may be poor at handling damage. Chapter 4 shows a loop that could not see a whole class of problem.
- **The number of latent issues is unknown.** The comparison between plans holds for any number, but the absolute costs scale with it.
- **The past product is a guide, not a forecast.** Using one previous product as the base rate is a reference class of one. *Reference Class Forecasting by the Numbers* discusses how to choose and widen such a class in [Choosing the reference class](/reados/publications/reference-class-forecasting-by-the-numbers/choosing-the-reference-class/).

None of these limits changes the direction of the answer. A similar calculation for a packing-cell rollout, with its own costs by stage, is in [Iterating the plan: models, mock-ups and the cost of change](/reados/publications/modular-projects-by-the-numbers/iterating-the-plan/) in *Modular Projects by the Numbers*.

A related but different idea, that most of a product's unit cost is committed by design decisions, is covered in [The cost you commit before you spend](/reados/collections/specifications-product-quality-and-sustainability/the-cost-you-commit-before-you-spend/).

## The error: a close-out report that counted issues

This is an illustration. The LT-4's close-out report, written when the lighting tower went into production, judged the development programme a success because **34 of 38 issues, 89.5%**, had been found before release. The report recommended running the next programme the same way. When the BPU-5 plan was being prepared, the product manager went back to the issue log to estimate capture rates and, for the first time, priced each logged issue at its stage cost.

The priced log told a different story. The 4 field issues had cost **A$480,000** to fix, **56.1%** of the LT-4's A$856,000 total. The programme had been very good at finding cheap problems and poor at finding the expensive ones: a mast-lock that loosened under vibration, a power supply that overheated on hot days, a cable chafe and a controller fault that appeared only after weeks of use. All four were the kind of problem that a focused rig or a longer environmental test would have found before release, and none had been tested for.

The error was in the measure: a count treats a label change and a field retrofit as equal. The business corrected its practice in two ways. Every issue in the log now carries the stage at which it was found and its estimated fixing cost, and close-out and review reports state issue cost by stage, not count. Plan B's capture rates come from that corrected view of the LT-4 record.

```figure
type: checklist
title: Reporting the issue log
caption: This is an illustration. The crossed item is the LT-4 report's error. A count of issues found before release rewards finding cheap problems.
- Record the stage at which each issue was found | concept, EVT, DVT, PVT or field
- Price each issue at its stage cost | A$1,000 to A$120,000 in the case
- Report fixing cost by stage as well as count | 56.1% of the LT-4's cost was in 10.5% of its issues
- Work out capture rates from the log | issues found divided by issues remaining
- x Judge the programme by the share of issues found before release | 89.5% looked like success
- ? Which issue types escaped, and which test would have caught them | the basis for the next plan's focused rigs
```

## Exercise: a weaker concept stage

Suppose the extra analysis and focused rigs in Plan B lift the concept capture rate only to **0.35**, not 0.45, while EVT, DVT and PVT stay at Plan B's 0.50, 0.50 and 0.556. With the same 45 latent issues and the same A$60,000 of extra spend, what are the expected issues found at each stage, the expected fixing cost, and the net saving against Plan A?

**Worked answer.** Concept finds 45 × 0.35 = **15.75**, leaving 29.25. EVT finds half, **14.63**, leaving 14.63. DVT finds half of that, **7.31**, leaving 7.31. PVT finds 0.556 of that, **4.06**, leaving **3.25** for the field. The expected fixing cost is 15,750 + 87,750 + 109,688 + 142,188 + 390,000 = **A$745,375**. Against Plan A's A$1,013,684 that saves **A$268,309**, and after the A$60,000 of extra spend the net saving is **A$208,309**. The weaker concept stage costs A$107,750 of Plan B's expected fixing cost, mainly through the extra 0.5 issues that reach the field at A$120,000 each, but the plan still pays for its extra spend more than four times over.
