---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: design-reviews-and-release
order: 10
title: "Design reviews and the release decision"
description: "Five BPU-5 reviews at A$3,640 each, 42 issues against the plan's 42.3, a fan swap approved without a re-test that cost A$85,000, release criteria for R1 to R3, and the outturn."
draft: true
---

Every chapter so far has produced evidence: a capture rate, a prototype result, a test with its bound, a measured mean with its interval, a simulated probability, a queue length. A design review is where that evidence meets a decision. Done well, a review asks whether the evidence supports the design as it now stands, and finds the gaps while they are still cheap. Done badly, it reviews slides about the evidence and approves changes that quietly make the evidence out of date.

This chapter covers the BPU-5's five formal reviews: what they cost, what they found, how the issue log compared with the plan made at concept, the change rule that keeps evidence current, and the criteria for releasing the product to production. Its error is a fan substitution approved as "like for like" at the DVT review, which cost thirty-five times what a re-test would have. It ends with the programme's outturn against its budget and its date.

## What a review is for

IEC 61160:2005, *Design review*, is the international standard giving guidance on planning and conducting formal design reviews. It treats a review as a documented, independent examination of a design against its requirements, and that is the core of the practice here. The BPU-5's reviews each asked three questions of every requirement: what evidence exists, is it current for the configuration being reviewed, and what decision follows from it. A review that cannot answer the second question for a requirement has not reviewed it.

Independence matters as much as content. Each BPU-5 review panel included at least two people who had not worked on the design under review: the operations manager, the managing director, and an engineer from the business's lighting products. Their job was to ask for the evidence behind each claim, not to propose design changes. That is the habit that stopped "drop test passed, 3 of 3" at the DVT review in [Pass-fail tests: what a small sample can and cannot show](/reados/publications/prototypes-and-simulation-by-the-numbers/pass-fail-tests-and-small-samples/), when a reviewer asked for the lower bound.

## Five reviews and what they cost

This is an illustration. All amounts are Australian dollars excluding GST. The programme held five formal reviews: concept at week 10, EVT at week 24, DVT at week 44, PVT at week 62, and production release, planned for week 72. A review took six people for three hours, plus eight hours of preparation by the product manager and the lead engineers: 6 × 3 + 8 = 26 hours at A$140 an hour, **A$3,640** a review and **A$18,200** for all five.

Of the 42 design issues found during development, **16** were found in the formal reviews themselves: 7 at the concept review, 4 at EVT, 3 at DVT and 2 at PVT. The rest came from analysis, prototypes and tests between reviews. The value of the review finds can be bounded. If each would otherwise have been found one stage later, at the stage costs set out in [Finding problems while they are cheap: the cost of change by stage](/reados/publications/prototypes-and-simulation-by-the-numbers/finding-problems-while-they-are-cheap/), the extra fixing cost would have been 7 × A$5,000 + 4 × A$9,000 + 3 × A$20,000 + 2 × A$85,000 = **A$301,000**. That is an upper estimate, because some would have been found within the same stage, but even a fraction of it dwarfs the A$18,200 the reviews cost.

```figure
type: timeline
title: The BPU-5's formal reviews
caption: This is an illustration. Weeks from concept approval. Each review cost about A$3,640 in people's time. Release slipped from week 72 to week 76.
- Week 10 | Concept review | 7 issues found in the review; requirements R1 to R3 agreed
- Week 24 | EVT review | 4 issues; thermal rig error and fan-duct redesign confirmed
- * Week 44 | DVT review | 3 issues; 120 Ah cells chosen; fan supplier change approved without a re-test
- Week 62 | PVT review | 2 issues; hottest cell 47.5 °C found; 0 critical, 2 major, 7 minor open
- Week 76 | Production release review | planned for week 72; criteria met
```

## The questions a review asks

The BPU-5's reviews used a short, fixed list of questions, applied to each requirement and each open issue. The list made the reviews faster, because the evidence pack was prepared against it, and harder to pass with confident talk.

```figure
type: checklist
title: Questions at every BPU-5 review
caption: Asked of each requirement and each open issue. The last item is the one the DVT review did not ask of the fan change.
- What is the requirement, in measurable terms | R2: hottest cell at most 45 °C after 1 h at 3 kW in 35 °C ambient
- What is the evidence, and what does it show with its uncertainty | a bound, an interval or a simulated probability, not "passed"
- Was the evidence produced on the configuration now being reviewed | same cells, fan, duct, firmware
- What was the test condition, and could it have revealed the failure | 35 °C in the chamber, not 23 °C on a bench
- Which issues are open, with severity, owner and containment | critical, major, minor
- ? Which changes since the last review touch this evidence | every change listed against the requirements it affects
```

## The issue log against the plan

At concept, the programme planned to find more of the BPU-5's expected 45 latent issues early, through analysis and focused rigs (Plan B in Chapter 1). Plan B expected 20.3 issues to be found at concept, 12.4 at EVT, 6.2 at DVT and 3.4 at PVT, 42.3 before release, leaving 2.8 for the field.

The log at the PVT review recorded **19, 13, 7 and 3**, a total of **42**. At the stage costs, fixing them cost 19 × A$1,000 + 13 × A$6,000 + 7 × A$15,000 + 3 × A$35,000 = 19,000 + 78,000 + 105,000 + 105,000 = **A$307,000**. Plan B's expected cost for the same four stages was **A$307,625**. The plan was close, which is partly luck: the counts are small, and an issue more at PVT or fewer at concept would move the total by tens of thousands of dollars. What the comparison does show is that the shape held. Most issues were found where they were cheapest, and the PVT count was small.

```figure
type: bars
title: Issues found by stage, Plan B expected against actual
unit: issues
max: 22
caption: This is an illustration. Plan B was the concept-stage plan for 45 latent issues. Actual counts are from the BPU-5 issue log; 42 found before release against 42.3 expected, costing A$307,000 against an expected A$307,625.
- Concept, Plan B | 20.3
- * Concept, actual | 19
- EVT, Plan B | 12.4
- * EVT, actual | 13
- DVT, Plan B | 6.2
- * DVT, actual | 7
- PVT, Plan B | 3.4
- * PVT, actual | 3
```

The log also says something about what remains. At the LT-4's PVT capture rate of 0.556, or 5 in 9, finding 3 issues at PVT suggests that about 3 × 4 ÷ 5 = **2.4** issues are still in the design. At the field cost of A$120,000 each, that is about **A$288,000** of expected field fixes. Release does not mean that the design has no problems left; it means that the known ones are closed or contained and that the cost of the unknown ones is planned for.

At the PVT review the log showed **0 critical, 2 major and 7 minor** issues open.

The severities were defined at the concept review, so that nobody could downgrade an issue to clear a gate. A critical issue could cause injury or fire, or breach a safety requirement. A major issue stops the product meeting a stated requirement, such as R1 to R3, or would cause failures in the field. A minor issue affects appearance, convenience or documentation without stopping the product doing its job. Each open issue carried an owner and a target date, and each major one a containment: a temporary measure, such as a full inspection at the end of the line, that stops the effect reaching a customer until the fix is in.

## Change control: a change reopens its evidence

Evidence is produced on a particular configuration. When the configuration changes, every result that depended on the changed part may no longer apply. The BPU-5 made two significant changes after the DVT build.

The first was deliberate and well handled. The DVT review chose the 120 Ah cells to meet R1, as [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/) describes. The change was listed against every requirement and test that involved the cells: usable energy, thermal behaviour, mass and handling, the drop specimens' tray loads, and the battery safety and transport testing that a real product would need. Requalification tests cost **A$12,600** and took **1 week** on the critical path.

The second was treated as trivial, and was not.

## The error: a fan approved as like for like

This is an illustration. At the DVT review, purchasing proposed changing the cooling fan to a second supplier's model with the same frame size, voltage and rated airflow, for a better price and shorter lead time. The datasheets matched, and the review approved it as "like for like" without re-running the thermal test.

A fan's rated airflow is measured in free air. In the BPU-5, the fan pushes air through a duct, the battery module and the vent grilles, and that path resists the flow. What matters is the airflow the fan delivers against that resistance, which depends on the shape of its pressure curve, not its free-air rating. The new fan's curve fell away faster with back-pressure, so in the duct it moved less air.

The PVT units were built with the new fan. In the PVT thermal check, run on the pilot build in the chamber at 3 kW and 35 °C, the hottest cell reached **47.5 °C**, against **43.0 °C** for the DVT units with the original fan, and against R2's limit of **45 °C**. The issue was detected in the PVT thermal data and traced to the fan by swapping the original fan back into one unit.

Fixing it at PVT took a revised fan selection, a duct change and new parts for the pilot units: one issue at the PVT cost of **A$35,000**, plus **2 weeks** on the critical path at A$25,000 a week, **A$85,000** in all. A thermal re-test at DVT, a day in the chamber with the test technician, would have cost about **A$2,400**. After the fix, the hottest cell across the 30 pilot units was **43.5 °C**.

The correction was a rule, added to the change procedure: **any change to a part on the thermal path, including the fan, duct, grilles, cell spacing, inverter mounting and fan control firmware, re-runs the 3 kW, 35 °C test before it is approved.** The datasheet comparison is still made, but it is no longer evidence.

## Release criteria

The production release review applied three criteria, written into the programme plan at the PVT review, before the final evidence was in:

1. **No open critical issue.**
2. **No open major issue without an approved containment.** Each of the two majors open at PVT was either closed or had a containment the review approved.
3. **Evidence for R1 to R3 current for the released configuration:** the 120 Ah cells, the revised fan and duct, and the redesigned tray bracket.

Writing criteria before the evidence arrives is what stops them being adjusted to fit it. [Stopping rules and kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) in *Stage Gates and Stopping Rules by the Numbers* makes the same argument for gate decisions, including the attempt to move the goalposts once the results are known.

```figure
type: compare
title: Release evidence against the BPU-5's requirements
cols: Requirement | Evidence on the released configuration | Status
caption: This is an illustration. All evidence was produced on 120 Ah cells and the revised fan and duct. Compliance with battery safety, site electrical and transport standards is a separate assessment by competent people.
- R1 site day | at most 5% short days at 2 years | PVT 30 units, mean 5.27 kWh; Monte Carlo 2.33% at 2 years | met
- R2 thermal | hottest cell at most 45 °C | 43.5 °C, highest of 30 PVT units after the fan fix | met
- * R3 drop | R 0.90 at 90% confidence | 22 of 22 tray specimens after redesign; lower bound 0.901 | met
- Issues | no open critical; majors contained | 0 critical; 2 majors closed or contained | met
```

The development requirements are not the whole of release. A battery power unit for building sites must also be assessed by competent people against the standards that apply to it. Examples of the kinds involved are IEC 62619:2022 on the safety of secondary lithium cells and batteries for industrial applications, AS/NZS 3012:2019 on electrical installations on construction and demolition sites, including the in-service testing of equipment used there, and subsection 38.3 of the UN Manual of Tests and Criteria on tests for transporting lithium batteries. Which apply to a real product, and how, is a compliance question for qualified people, not something a development review settles. The step from an approved design to the first production units, with tooling, first-off samples and launch readiness, is covered in [From approved design to first production](/reados/collections/product-development-and-launch/from-approved-design-to-first-production/).

## The outturn

This is an illustration. The BPU-5 was released at **week 76**, four weeks after the planned week 72, having spent **A$1,512,000** against a development budget of A$1,450,000, an over-spend of A$62,000 or **4.3%**.

- **Over-spend:** the fan fix A$35,000, the hired climatic chamber A$14,400 (Chapter 8), and the 120 Ah cell requalification tests A$12,600, totalling A$62,000.
- **Delay:** 2 weeks for the fan fix, 1 week waiting for the chamber before the hired one arrived, and 1 week for cell requalification: 4 weeks at A$25,000, **A$100,000** of cost of delay.

Read against the plan, the outturn has two kinds of item. The cell change was a good decision made late: the averages-only check at concept had hidden the R1 shortfall, and finding it earlier would have saved the requalification week. The fan and the chamber were avoidable at small cost: a A$2,400 re-test would have saved the fan's A$85,000, and a second chamber booked ahead of the DVT peak would have saved the A$25,000 week, together about A$107,600 of the A$162,000 of over-spend and delay. Neither required better engineering, only reviews that asked for evidence on the configuration being approved, and a plan that treated a shared test resource as a queue.

## Exercise: the price of the change rule

After release, the business expects about **6 changes a year** to parts on the BPU-5's thermal path, mostly supplier substitutions. Each re-test under the new rule costs about A$2,400. Suppose each change has a **0.2** chance of degrading the thermal performance enough to fail R2, and that a degradation not caught by a re-test would be found later at a cost like the fan's, A$85,000. What does the rule cost a year, what does it save, and at what chance of degradation per change does it break even?

**Worked answer.** The re-tests cost 6 × A$2,400 = **A$14,400** a year. Without the rule, the expected number of degradations escaping is 6 × 0.2 = 1.2 a year, at A$85,000 each, **A$102,000** a year, so the rule saves about A$87,600 a year net. It breaks even when the chance of degradation per change equals 2,400 ÷ 85,000 = **0.0282**, about one change in 35. A refinement: a degradation caught by the re-test still needs fixing, at about the DVT cost of A$15,000 with no delay, so the saving per caught degradation is nearer A$70,000 and the break-even chance rises to 2,400 ÷ 70,000 = 0.034, about one in 29. Either way, a re-test pays for itself if even a small fraction of "like for like" changes are not.
