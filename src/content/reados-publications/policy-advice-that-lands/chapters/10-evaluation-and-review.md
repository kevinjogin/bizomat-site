---
book: policy-advice-that-lands
chapterSlug: evaluation-and-review
order: 10
title: "Evaluation and review"
description: "Plan evaluation while you design the policy: a baseline, outcome measures and attribution, a sample you can defend, performance records and the reviews the law schedules."
draft: true
---

Every policy is a hypothesis: if government does this, that will change. Evaluation tests it. Without evaluation, the next decision about a program rests on the same estimates as the first, plus whatever people remember.

This is an illustration. The decision of Tue 9 May 2028 funded 800 bridges and made a review the gate for the remaining 400 (Chapter 6). The mid-term review report is due on Thu 28 Feb 2030. The decision did not fund the A$0.25 million final evaluation that the 1,200-bridge proposal had included, and Grace Mitchell raised that gap with the Director, Strategy and Policy, in the week of the Budget. Tom Becker had to design an evaluation that could answer ministers with the money and data the program already had.

## Why evaluate

Section 17A(d) of the [Australian Public Service Commissioner's Directions 2022](https://www.legislation.gov.au/F2022L00088/latest/text) (the Directions) says that upholding the APS Value of Stewardship requires "reflecting on and learning from past experience and institutional knowledge, including through robust evaluation, to inform operations, advice, and decisions". It is a requirement, applied having regard to each person's duties and responsibilities. It names three uses: improving a program while it runs, making the next advice better, and informing decisions to continue, change or stop.

Evaluation is not the same as performance reporting. Performance measures say what happened: bridges assessed, cost per assessment, limits changed (Chapter 9). An evaluation asks why it happened, whether the program caused it, what it was worth and what to do next. The PGPA Act requires the first, as explained below. It does not require a policy evaluation. Read the *Commonwealth Evaluation Policy* and your agency's own evaluation guidance for what is expected of you.

## Plan the evaluation when you design the policy

An evaluation planned at the end must work with whatever data happens to exist. One planned at design time can make sure the right data is collected from the first day, often at almost no cost. Settle the questions, the data and the timing before the program starts.

The questions come from the objectives. A program logic sets out the chain from money to results: inputs, activities, outputs and outcomes. Give each link a measure, so the evaluation can test the links, not only the ends.

```figure
type: steps
title: The bridge program's logic, from money to outcomes
caption: This is an illustration. Each step has a measure. The evaluation asks whether each step led to the next, and how much of the change the program caused.
- Inputs | A$10.0 million, a panel of engineering firms, the data standard and the register
- Activities | councils nominate bridges; engineers assess them to the standard
- Outputs | 800 bridges assessed, results in the register; measured by bridges assessed and cost per assessment
- Outcomes for councils | limits lifted, eased, confirmed or tightened, and unsafe bridges acted on
- *Outcomes for road users | shorter detours for heavy vehicles and fewer unsafe bridges left open; measured by the mean detour avoided
```

This is an illustration. Tom drafted NRIO's evaluation plan in June 2028 and finalised it in September, before the first assessment. It asks four questions:

1. Was the service delivered as planned: on time, to the data standard and at the expected cost?
2. Did the assessments change what councils did, and were unsafe bridges acted on?
3. Were the benefits as large as the proposal estimated?
4. Should the remaining 400 bridges be assessed, and should anything change if they are?

With no money for a final evaluation, the plan builds data collection into the program. The nomination form records each bridge's starting point (Chapter 9), the register records every result and each council's decision, and the panel contract requires reports in the data standard's format. Most of the data costs nothing extra, and Tom runs the mid-term review within the program's staff time. The plan also says what a final evaluation in 2031–32 would add and cost, so the review can propose funding it. Nobody has yet decided.

## The baseline

A baseline is the measure before the program starts, taken with the same definitions you will use afterwards. Without one, nothing measured later can be called a change.

This is an illustration. The 2027 council survey is the baseline. Ninety-six of 142 councils responded. Their 4,410 bridges and major culverts included 1,540 with no load assessment in the last 10 years, 410 with precautionary limits and 37 closed (Chapter 2). The survey's definitions of an assessment, a limit and a detour became the data standard's, so later counts compare like with like.

The baseline has two gaps, and the plan fills both. The 46 councils that did not respond have no baseline, so any bridge they nominate gets one from the nomination form. And the survey is a snapshot of 2027, while some councils will assess bridges at their own cost during the program. So the plan repeats the survey's core questions to all 142 councils in August and September 2029, before the review's data cut-off.

## Outcome measures and attribution

Outcomes are harder to measure than outputs, and harder to credit. Attribution is the question of how much of a change the program caused. A limit lifted after an NRIO assessment is not automatically the program's success, because some councils would have paid for that assessment themselves.

Three approaches help, and stronger evaluations use more than one:

- **Before and after**, for the same bridges. It shows change, not cause.
- **A comparison group**: similar bridges the program did not assess. The repeat survey shows what happened to limits outside the program. The comparison is rough, because councils nominated their most important bridges first, and the evaluation must say so.
- **Contribution**: for each eased limit, ask the council whether it would have assessed the bridge within two years without the program, and why. Self-reports favour the program, so treat them as one line of evidence, not proof.

When the methods disagree, report a range, and never claim all of a change as the program's.

This is an illustration. One outcome carries most of the program's value: the detour each eased limit removes. Tom's estimate of what the limits cost assumed an average extra distance of 20 km a trip (Chapter 2), and Chapter 4 found that the case for Option C rests mainly on its benefit estimate. Measuring the mean detour avoided per eased limit tests that assumption directly.

## Sizing the sample

Measuring every eased limit's detour means mapping routes and checking each with councils and operators, which is slow. A random sample can estimate the mean, if it is large enough.

The [Sample Size to Estimate a Mean](/tools/sample-size-mean/) tool works it out from the expected standard deviation σ (how much individual values vary, from earlier data or a pilot), the margin of error E (the plus-or-minus half-width you need) and the confidence level. It calculates n₀ = (z × σ ÷ E)², with z = 1.960 for 95 per cent confidence. For a finite population of N items it applies a correction, n = n₀ ÷ (1 + (n₀ − 1) ÷ N), and rounds up to a whole number.

This is an illustration. Tom wants the mean detour avoided within ±5 km, at 95 per cent confidence. In August 2028 he piloted the method at 15 limited bridges in five councils, comparing each signed detour with the route heavy vehicles actually used, and found σ = 18 km.

Why ±5 km? Detour costs rise in proportion to distance, and 5 km on a 20 km average is 5 ÷ 20 = 25 per cent. On the proposal's estimates, 25 per cent of the A$2.7 million a year of avoided detour costs is A$0.675 million, or 0.675 ÷ 3.6 = 18.75 per cent of Option C's total benefits. That is inside the 30 per cent fall Chapter 4 showed C could absorb, with a benefit–cost ratio of 1.14. So ±5 km is precise enough to tell whether the case for C holds.

```figure
type: formula
title: How many eased limits to measure
caption: This is an illustration. The Sample Size to Estimate a Mean tool gives 50 without the correction and 45 with N = 410, showing 44.49 before rounding.
formula: n₀ = (z × σ ÷ E)²
formula: n = n₀ ÷ (1 + (n₀ − 1) ÷ N)
- z | 1.960, for 95 per cent confidence
- σ | 18 km, from Tom's pilot at 15 bridges
- E | 5 km, the margin of error
- N | 410, the precautionary limits in the 2027 survey
step: n₀ = (1.960 × 18 ÷ 5)² = 7.056² = 49.79, which rounds up to 50
step: n = 49.79 ÷ (1 + 48.79 ÷ 410) = 49.79 ÷ 1.1190 = 44.49
step: Rounded up: measure 45 eased limits
```

Why N = 410? In 2028 nobody knows how many limits will be eased by the review. The survey's 410 is the best planning count, and a generous one, since the first 800 assessments are expected to ease far fewer. A smaller population needs a smaller sample, never a larger one, so 45 is enough. If fewer than 45 limits have been eased by the cut-off, Tom measures them all.

The sample must be random, drawn from the list of eased limits at the cut-off, not the easiest to reach. And a σ from a pilot of 15 is itself uncertain, as the tool warns. The exercise tests what happens if it is too low.

## The mid-term review and the 400 bridges

Design a review backwards from the decision it informs: who decides, when, what they will ask, and what evidence could change their minds.

This is an illustration. The decision on the remaining 400 bridges is the government's, through the Budget process; NRIO advises. The report is due on Thu 28 Feb 2030, four months before the funded assessments end on 30 June 2030, so that ministers can decide before the panel's work runs out. Working back, the data cut-off is Wed 31 Oct 2029. November and December are for measuring the sample, January for analysis and drafting, and February for clearance.

Ministers will ask about the measures Chapter 6 listed, and whether the benefits are real, which the detour sample answers.

Two disciplines keep the review honest. First, write down, before any data arrives, which results would support each recommendation: continue as designed, continue with changes, or stop. Criteria set afterwards tend to fit the answer someone already wants. Second, have someone outside the team check the method and the draft. A review must be able to recommend stopping, or it is not a review.

## Performance records and reporting under the PGPA Act

The [PGPA Act](https://www.legislation.gov.au/C2013A00123/latest/text) gives the accountable authority three duties, and a program's records feed all of them:

- **Records.** Section 37(1) says it "must cause records to be kept that properly record and explain the entity's performance in achieving its purposes", kept in a way that enables the annual performance statements (s 37(2)(b)). The responsible Minister and the Finance Minister are entitled to full and free access to them (s 37(3)).
- **Measurement.** Section 38(1) says it "must measure and assess the performance of the entity in achieving its purposes", in line with any requirements in the rules (s 38(2)).
- **Reporting.** Section 39(1) requires annual performance statements as soon as practicable after each reporting period, included in the annual report tabled in the Parliament. They must "provide information about the entity's performance in achieving its purposes" (s 39(2)(a)).

None of these requires an evaluation. They do require data that an evaluation also uses, so collect it once and use it for both.

This is an illustration. NRIO's 2028–29 annual performance statements will report the program's four measures, each traced to the register. Tom keeps a file showing, for every published number, the query and the date it came from.

## Sunsetting: a review the law schedules

Many policies rest on a legislative instrument, and the [Legislation Act 2003](https://www.legislation.gov.au/C2004A01224/latest/text) gives most instruments a review date. Part 4 exists "to ensure that legislative instruments are kept up to date and only remain in force for so long as they are needed" (s 49).

The rule is a date rule, not "ten years". Section 50(1) repeals an instrument "on the first 1 April or 1 October falling on or after the tenth anniversary of registration". An instrument registered on Tue 14 Mar 2028 reaches its tenth anniversary on 14 March 2038 and is repealed on 1 April 2038. One registered on Mon 3 Apr 2028 has its anniversary after 1 April 2038, so it lasts until 1 October 2038.

Three further provisions shape the timing:

- **Deferral is possible, not assumed.** On the rule-maker's written application, the Attorney-General may defer sunsetting to a 1 April or 1 October on or before the second anniversary of the sunsetting day, if satisfied of a ground in section 51(1)(b). The certificate's explanatory statement must give the reasons (s 51(5)).
- **Some instruments are exempt.** Part 4 does not apply to instruments covered by section 54, including those prescribed by regulation under section 54(2)(b). The PGPA Rule is one, under section 12, table item 53A, of the Legislation (Exemptions and Other Matters) Regulation 2015. Exempt instruments still need review; they just have no deadline. Acts do not sunset under Part 4.
- **Lists give warning.** The Attorney-General must arrange for lists of instruments due to sunset to be tabled in each House on its first sitting day within 18 months before the sunsetting day (s 52).

The Register shows the Directions themselves as due to be repealed by sunsetting on 1 April 2032.

```figure
type: decision
title: Will this legislative instrument sunset, and when?
question: Does Part 4 of the Legislation Act apply to the instrument?
- No, it is exempt under s 54 | No sunsetting date | for example the PGPA Rule; schedule your own reviews
- *Yes | Repealed on the first 1 April or 1 October on or after the tenth anniversary of registration | s 50(1); finish the review well before the s 52 list is tabled
- Yes, and a s 51(1)(b) ground applies | The Attorney-General may defer, by certificate, to a date on or before the second anniversary | on the rule-maker's written application; reasons in the explanatory statement, s 51(5)
caption: General guidance on the Legislation Act 2003, Part 4. Your legal area confirms the date for a particular instrument.
```

This is an illustration. The bridge program needs no legislative instrument (Chapter 2), so its review trigger is the Budget decision. If a later stage did rest on an instrument, Grace's team would put its sunsetting date in the evaluation plan and finish the review before the list is tabled, leaving time to consult (s 17) and make a replacement.

## When it goes wrong: a program with no before

This is an illustration. In 2023, before the bridge work began, NRIO funded six freight consolidation depots in remote towns, at A$0.9 million each: 6 × A$0.9 million = A$5.4 million. The aim was cheaper, more frequent deliveries. Nobody recorded freight rates or delivery days in the six towns before the depots opened.

In early 2026 a proposal to fund four more depots, 4 × A$0.9 million = A$3.6 million, reached the Minister's office, which asked whether the first six had worked. An evaluation costing A$80,000 found all six built and in use. It could not say whether freight had become cheaper or more frequent. Operators' rates had moved with fuel prices, and there was nothing to compare against. The proposal was deferred for a year while a baseline was collected in the candidate towns.

The cost was A$80,000 for an evaluation that could not answer its question, a year's delay for towns that might have benefited, and an office that now asks for evidence before every NRIO proposal. The controls are this chapter's: an evaluation plan written at design time, a baseline collected before the money flows, and comparison towns measured the same way.

## Exercise: design the evaluation plan

This is an illustration. It is Mon 4 Sep 2028, and Tom's pilot is done. Grace asks him for the final one-page evaluation plan for the mid-term review. It should set out:

- the measures, with their source and baseline;
- the detour sample, including what happens if the pilot's σ of 18 km is too low and the true value is 22 km;
- a timetable that works back from Thu 28 Feb 2030;
- the results that would support each recommendation on the 400 bridges;
- how the plan deals with the unfunded final evaluation.

### Worked answer

This is an illustration. The questions are the four above. The measures:

| Measure | Source | Baseline |
| --- | --- | --- |
| Bridges assessed against the target | the register | none at Mon 3 Jul 2028; targets 300 by 30 June 2029 and 800 by 30 June 2030 |
| Cost per accepted assessment, excluding GST | finance system and register | A$9,500, from the costing |
| Limits lifted, eased, confirmed or tightened | register and councils' notices; repeat survey for bridges outside the program | 410 limits in the 2027 survey; nomination forms |
| Unsafe bridges found and acted on | register and notification log | none recorded before the program |
| Mean detour avoided per eased limit | random sample of eased limits | 20 km average signed detour, 2027 survey |

**The sample.** At σ = 18 km the tool gives 45, as shown above. At σ = 22 km, n₀ = (1.960 × 22 ÷ 5)² = 8.624² = 74.37, which rounds up to 75 without the correction. With N = 410, n = 74.37 ÷ (1 + 73.37 ÷ 410) = 74.37 ÷ 1.1790 = 63.08, rounded up to 64. So Tom puts the eased limits in a random order at the cut-off and measures the first 45. He then works out σ from those 45, and if it is above 18 km, reruns the tool and continues down the same list. A wrong guess costs up to 64 − 45 = 19 more measurements, and the timetable allows for them.

```figure
type: timeline
title: The evaluation timetable, working back from the review
caption: This is an illustration. The case's dates. Each step must finish before the next starts, so a slip anywhere comes out of February's clearance time.
- Mon 23 Aug to Fri 17 Sep 2027 | Baseline survey | 96 of 142 councils
- June to September 2028 | Evaluation plan | drafted, piloted and finalised before any data arrives
- August and September 2029 | Repeat survey | the core questions, to all 142 councils
- Wed 31 Oct 2029 | Data cut-off | sample of eased limits drawn
- November and December 2029 | Detours measured | 45, or up to 64 if σ is higher
- *Thu 28 Feb 2030 | Mid-term review report | informs the decision on 400 bridges
```

**Decision criteria, agreed with the Director before any data arrives.**

- *Continue as designed* if at least 90 per cent of the assessments due by the cut-off are done; the average cost is no more than A$10,450, which is 10 per cent above A$9,500; every unsafe finding was notified within two working days; and measured benefits are no more than 30 per cent below the proposal's estimate, the fall Chapter 4 showed C could absorb.
- *Continue with changes* if delivery or cost misses but the benefits hold: for example, more panel firms or a slower pace.
- *Do not continue on this design* if benefits fall more than 30 per cent short.

**The final evaluation.** The plan records the gap plainly: a final evaluation in 2031–32 is not funded. The review will say what it would cost and recommend how to fund it, with any further tranche or from NRIO's existing running costs, for the Director and the CEO to decide. Meanwhile the register keeps the data, so any later evaluation can start where the review stopped.

This book has followed one fictional proposal from a request for a fund to a review that will decide its second half. Each chapter added a question that advice must answer before it lands: what the problem is, what the evidence shows, what else could be done, what each option is worth, what it costs, how the Budget weighs it, how ministers will read it, what the minister needs to hear, whether it can be delivered, and how anyone will know it worked. The answers are rarely tidy, and the decision is never the adviser's. The adviser controls something smaller and just as important: whether the person who decides sees the problem, the options, the costs and the risks clearly, in time and in writing, and whether the record lets the next adviser learn from what happened.
