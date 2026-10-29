---
book: outcome-first-projects-by-the-numbers
chapterSlug: measures-from-questions
order: 3
title: "Measures from questions: goal, question, metric"
description: "Goal–question–metric turns the laundry's outcome into four tight measures: OTIF per delivery, cost per clean kg, L/kg and MJ/kg, with a 6.1% denominator error and an absolute-gas trap."
draft: false
---

A measure that is named but not defined will drift. "On-time delivery" can mean the van left on time or the customer signed on time; "cost per kilogram" can be divided by soiled weight or by clean weight; "energy" can mean the gas bill or the gas bill plus electricity. Each version gives a different number, and the differences are often larger than the improvement a project is meant to achieve. This chapter turns the four measures named in Chapter 1 into definitions tight enough that two people with the same records would get the same answer.

It uses the goal–question–metric method, which derives each measure from a stated goal through the questions that goal raises, and then writes an operational definition for each: the unit counted, the numerator, the denominator, the data source and the period. It ends with two errors the laundry made before the definitions were fixed, one in a denominator and one in the choice between an absolute measure and an intensity.

## Goal, question, metric

The method began in software engineering. Victor Basili and David Weiss (1984) set out a way of collecting data about software development that started from the goals of the study rather than from whatever data happened to be available. Each goal was refined into questions, and only then were the data defined that would answer the questions. The reasoning was that data collected without such a chain is hard to interpret and cannot be checked against any purpose, while data collected with it can be traced to the question it answers.

Basili, Caldiera and Rombach (1994) later described the approach as the Goal Question Metric method, with three levels. At the **conceptual level**, a goal is stated for an object, with a purpose, a quality focus and a viewpoint. At the **operational level**, questions characterise how the goal will be assessed. At the **quantitative level**, metrics give the data needed to answer each question. A goal stated in that template is hard to leave vague, because each slot forces a choice: what exactly is being measured, why, in respect of which quality, and from whose point of view.

Park, Goethert and Florac, in the Software Engineering Institute's *Goal-Driven Software Measurement* guidebook (1996), added a step between question and metric: the **indicator**, the chart or table that will show the answer to someone who has to act on it. Sketching the indicator before defining the data is a useful discipline. If nobody can say what the chart would look like or what decision it would inform, the measure is probably not needed.

The method travels well beyond software. A laundry's goals, questions and metrics are different from a software team's, but the chain is the same, and so is its main benefit: every number collected can be traced to a question someone needs answered.

## The four goals

This is an illustration. Stated in the template, the laundry's four goals read as follows.

1. **Delivery.** Analyse deliveries to the hospitals and hotels, to evaluate and improve them, with respect to timeliness and completeness, from the viewpoint of the customer who signs for them.
2. **Cost.** Analyse the laundry's operation, to evaluate and reduce its cost, with respect to the full cost of each unit of clean linen delivered, from the viewpoint of the owners and the finance manager.
3. **Water.** Analyse the laundry's water use, to evaluate and reduce it, with respect to water used per unit of clean linen, from the viewpoint of the hospital group as tender assessor and of the owners as payers of the water bill.
4. **Energy.** Analyse the laundry's energy use, to evaluate and reduce it, with respect to energy used per unit of clean linen, from the same two viewpoints.

The viewpoint slot did real work in the first goal. From the dispatch supervisor's point of view, a delivery is on time when the van leaves on schedule. From the customer's, it is on time when the linen is in the ward or the housekeeping store before the cut-off, complete. The tender is judged from the customer's side, so the measure must be too. Chapter 4 shows what happened when the laundry's records took the other view.

Each goal then raises questions. For delivery, the operations manager wrote four:

- What share of deliveries are signed for before the customer's cut-off and complete?
- How does that share vary from week to week, and between hospitals and hotels?
- What is the primary cause of each failure?
- Are failures concentrated on particular days of the week?

The first question defines the outcome measure. The others are diagnostic: they do not measure the outcome but explain it, and Chapter 6 depends on them. Writing them down at this stage meant that the data needed to answer them, such as a cause code and a customer type on every failed docket, were collected from the start instead of reconstructed later.

```figure
type: tree
title: Goal, questions and metrics for delivery
caption: This is an illustration. The first question defines the outcome measure; the other three are diagnostic and feed the cause analysis in Chapter 6.
- Goal: timely, complete deliveries from the customer's viewpoint | object, purpose, quality focus, viewpoint
  - * Q1: what share of deliveries are signed for before cut-off and complete | outcome question
    - * M1: OTIF = deliveries signed before cut-off and complete ÷ all deliveries | per delivery, from signed dockets
  - Q2: how does that share vary by week and by customer type | diagnostic
    - M2: weekly OTIF; OTIF for hospitals and for hotels | 180 deliveries a week
  - Q3: what is the primary cause of each failure | diagnostic
    - M3: failures by cause code | one code per failed docket
  - Q4: are failures concentrated on particular days | diagnostic
    - M4: failures by day of the week | six production days
```

The cost, water and energy goals raise their own questions. For cost: what does a clean kilogram cost, fully loaded; which cost elements drive it; and how much of it varies with volume? For water: how many litres per clean kilogram, and where are they used, in washing or in rinsing? For energy: how many megajoules per clean kilogram, split between washing, drying and ironing, and how much does the season move them? The last question matters because heating wash water takes more gas in winter, when the incoming water is colder; Chapter 4 measures the effect.

## Operational definitions

An operational definition says exactly how a number is produced: what is counted, from which source, over which period, and with which exclusions. The laundry's four definitions are these.

**OTIF.** The unit is **one delivery**: one scheduled drop to one customer site on one production day. The laundry makes 30 a day, 8 to hospitals and 22 to hotels, 180 a week. A delivery succeeds only if it is signed for by the customer before the cut-off, **06:00 for hospitals and 10:00 for hotels**, **and** it is complete, meaning every ordered line item in the ordered quantity. "Ordered" means the customer's standing order plus any amendment received by the agreed time. The time source is the customer's signature on the docket, not the dispatch system. A delivery that is both late and short counts as one failure. OTIF is successful deliveries divided by all deliveries in the period.

**Cost per clean kilogram.** The numerator is the fully loaded annual cost of running the laundry: labour with on-costs, gas, electricity, water and trade waste, chemicals, vehicles, maintenance, premises and overheads, plus a **capital charge** on plant and buildings at 8% a year, spread over the asset's life. The capital charge is included so that an option that buys equipment and an option that hires people are compared on the same footing. The denominator is **clean dispatched kilograms**, weighed at dispatch, which is also the weight the customers are invoiced on.

**Water intensity.** Mains water in kilolitres from the utility meter, multiplied by 1,000 to give litres, divided by clean dispatched kilograms in the same period. Water reused within the plant is not counted again; its effect is to reduce the mains intake.

**Energy intensity.** Gas in gigajoules multiplied by 1,000, plus electricity in kilowatt-hours multiplied by 3.6, giving megajoules of site energy, divided by clean dispatched kilograms. Electricity is converted at its energy content, not at the energy used to generate it, and the method is stated with every reported figure so that the tender assessor can see it.

```figure
type: formula
title: The four operational definitions
formula: OTIF = deliveries signed for before cut-off and complete ÷ all deliveries
formula: cost per kg = fully loaded annual cost, including capital charge ÷ clean dispatched kg
formula: water, L/kg = mains water, kL × 1,000 ÷ clean dispatched kg
formula: energy, MJ/kg = (gas, GJ × 1,000 + electricity, kWh × 3.6) ÷ clean dispatched kg
caption: This is an illustration. One denominator, clean dispatched weight, for every per-kilogram measure. The steps apply the definitions to the laundry's baseline year, which Chapter 4 examines.
- cut-off | 06:00 for hospitals, 10:00 for hotels, from the customer's signature
- complete | every ordered line item in the ordered quantity
- capital charge | 8% a year on plant and buildings, spread over each asset's life
- clean dispatched kg | weighed at dispatch, the weight invoiced
step: Cost: A$5,337,704 ÷ 3,120,000 kg = A$1.711/kg
step: Water: 43,680 kL × 1,000 ÷ 3,120,000 kg = 14.0 L/kg
step: Energy: (15,912 GJ × 1,000 + 780,000 kWh × 3.6) ÷ 3,120,000 kg = 6.00 MJ/kg
```

The definitions are short, but each clause closes a door. The customer's signature closes the gap between departure and arrival. "Complete" closes the gap between a delivery that arrived and a delivery that was useful. The capital charge stops capital-heavy options from looking cheap. The single denominator stops measures from being quietly improved by changing what is divided by what.

## Intensity and absolute measures

Cost, water and energy can each be reported in two ways: as a total for the period, or per clean kilogram. The tender scores the intensities, and the business's margin depends on cost per kilogram, so the intensities are the outcome measures. Totals still matter for budgets and bills, but on their own they mix two things, how efficiently the laundry works and how much linen it processes. A quiet month looks frugal and a busy month looks wasteful, whatever happens to efficiency. The second error below shows how easily that misleads.

Intensities have a weakness of their own: they can improve while totals rise, if volume grows faster than use. For the tender that is the right behaviour, because the hospital group is judging efficiency. For the owners' water bill it is not, so the monthly report carries both, with the intensity as the measure and the total beside it.

## Gaming and how definitions close it

Any measure that matters will attract ways of improving the number without improving the outcome. Two are common with delivery measures.

**Splitting deliveries.** If a van leaves with most of an order and a second drop brings the rest after the cut-off, the first drop can be recorded as an on-time delivery and the second as a separate one. One late delivery becomes one success and one failure, or two successes if the second is not booked as an order at all. The definition prevents this by making the unit one scheduled drop per site per day: a delivery completed by a later drop is still one failure.

**Moving the cut-off.** If items requested late are recorded as next-day orders, deliveries become "complete" by definition. Similarly, if a cut-off is quietly treated as 06:30, more hospital deliveries become "on time". The definition prevents both by fixing what "ordered" means and by taking the cut-offs from the customer's contract, changed only by written agreement.

Neither is a reason to distrust the people involved. Measures under pressure drift towards what is easy to count, often with the best intentions. A tight definition protects the people as well as the number.

```figure
type: checklist
title: Tests for each measure before it is used
caption: Applied to all four of the laundry's measures. The open question is the one the definitions cannot settle by themselves.
- Traces through a question to a stated goal | goal, question, metric
- States the unit counted | one delivery, one clean dispatched kilogram
- Names its data source and who records it | customer signature, dispatch scale, utility meters
- Uses the same denominator as the related measures | clean dispatched kg throughout
- States its period and how it is averaged | weekly and 26-week OTIF; monthly and annual intensities
- Cannot be improved without improving the outcome | split deliveries and moved cut-offs closed off
- ? Matches the method the tender assessor will use | to confirm with the hospital group's procurement team
```

[Choose your decision measures before the design: why criteria belong at the start](/reados/collections/project-sponsors-governance-and-decisions/choosing-decision-measures-before-design/) sets out five tests for measures in general. The tests here are narrower: they are about making a measure that has already been chosen impossible to read two ways.

## The first error: the wrong denominator

This is an illustration. Before the definitions were written, a cost review was prepared from the production system, which records linen weight when soiled linen is received and sorted. Soiled linen is heavier than clean linen, because of moisture and soil; in this laundry by about 6.5%. The review divided the year's fully loaded cost by soiled weight: 5,337,704 ÷ (3,120,000 × 1.065) = 5,337,704 ÷ 3,322,800 = **A$1.606/kg**. On clean dispatched weight the same cost is **A$1.711/kg**. The review understated cost per kilogram by **6.1%**, about A$0.104/kg.

The error mattered more than its size suggests. Chapter 5 derives a cost ceiling of A$1.66/kg from the new price and the margin. At A$1.606, the laundry would have appeared already to meet it, and cost would have dropped off the list of things the project had to change.

It was found when the finance manager reconciled the review's kilograms with the year's invoices. The invoices are raised on clean weight, and the review's total was 202,800 kg higher than anything the laundry had billed. The correction was the rule now written into all four definitions: every per-kilogram measure uses **clean dispatched kilograms**, from the dispatch scale, and any report that uses another weight must say so in its title.

## The second error: an absolute figure reported as a saving

This is an illustration. A normal four-week month at the laundry processes 240,000 kg of clean linen and uses 1,224 GJ of gas, 5.1 MJ/kg. In one quieter month the laundry processed **236,000 kg**, 1.7% less than normal, and used **1,210 GJ** of gas. The monthly report noted that gas was down 1.1% on a normal month and credited the change to a new habit of shutting down idle washers.

The intensity told a different story. 1,210 GJ × 1,000 ÷ 236,000 kg = **5.127 MJ/kg** of gas, **0.5% above** the usual 5.1. Gas fell because volume fell, and it fell by less than volume did. Efficiency had worsened slightly, most likely because partly filled machines run the same heating cycles as full ones.

The operations manager found it by recalculating the month in the defined measure, MJ per clean kilogram, before passing the report to the owners. The correction was to report the intensity as the measure and the absolute total beside it, never the total alone, and to treat any claimed saving that is not visible in the intensity as unproven.

## Measures as the common language

The four definitions are now the laundry's common language for the rest of the project. Baselines in Chapter 4 are measured in them, targets in Chapter 5 are set in them, options are scored in them, and the benefits are tracked in them after go-live. That last use is where loose definitions do the most harm, because a benefit tracked in a different measure from the one it was promised in cannot be compared with the promise. [Tracking benefits against a phased plan](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/tracking-benefit-realisation/) in *Demand and Benefit Forecasts by the Numbers* shows benefits being forecast and tracked month by month, which is only possible when the measure stays fixed throughout. The next chapter, [Baselines you can defend](/reados/publications/outcome-first-projects-by-the-numbers/baselines-you-can-defend/), measures where the laundry stands on each of the four.

## Exercise: the quiet month in full

For the quieter month above, the laundry's records show 236,000 kg of clean linen dispatched, 1,210 GJ of gas, 60,500 kWh of electricity and 3,400 kL of mains water. Using the operational definitions, calculate water intensity in L/kg and energy intensity in MJ/kg, and compare both with the baseline year's 14.0 L/kg and 6.00 MJ/kg.

**Worked answer.** Water: 3,400 kL × 1,000 ÷ 236,000 kg = **14.41 L/kg**, 2.9% above the baseline. Energy: gas 1,210 × 1,000 ÷ 236,000 = 5.127 MJ/kg; electricity 60,500 × 3.6 ÷ 236,000 = 0.923 MJ/kg; total 5.127 + 0.923 = **6.05 MJ/kg**, 0.8% above the baseline. Both intensities worsened in a month whose gas bill fell. In absolute terms the month's water use, 3,400 kL, was actually higher than a normal month's 3,360 kL at 14.0 L/kg, despite the lower volume, which points to partly filled machines or a leak worth checking. The month is a small example of why the targets in Chapter 5 are set on intensities.
