---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: technology-readiness-levels
order: 2
title: "Technology readiness levels and critical technology elements"
description: "The nine readiness levels in plain words, critical technology elements, Option B's ratings of 6, 5 and 7, and why system readiness is TRL 5, not the 7.85 average."
draft: false
---

Chapter 1 found that Option B's inputs rest on thinner evidence than Option A's, but "thinner" is not a measurement. This chapter introduces the scale most widely used to measure how far a technology has travelled from an idea to a working plant, the technology readiness level, and the assessment method that goes with it: find the elements the system depends on that are new, rate each against the evidence, and let the least mature one set the readiness of the whole. It then rates Option B element by element and corrects a first assessment that averaged its way to a reassuring answer.

## Where readiness levels came from

Technology readiness levels began at NASA in the 1970s as a way to judge whether a technology was mature enough to be built into a flight programme. John Mankins's 1995 NASA white paper set out the scale that is now familiar, with nine levels and a definition for each, and Mankins's 2009 retrospective in *Acta Astronautica* traces how the idea spread from NASA to other agencies and industries.

The US Government Accountability Office has used readiness levels in its audits for many years. In *Best Practices: Better Management of Technology Development Can Improve Weapon System Outcomes* (NSIAD-99-162, 1999) it recommended that key technologies reach a maturity analogous to **TRL 7** before a programme commits to a cost, schedule and performance baseline. That is a recommendation for defence acquisition, not a rule for a recycler, but the logic transfers: commit to a firm cost and schedule only after the technology has been shown working in the conditions it will face. GAO's *Technology Readiness Assessment Guide* (GAO-20-48G, 2020) describes how to assess readiness as a systematic, evidence-based process applied to the critical technologies of a larger system, and gives examples of how different organisations word the levels.

In Australia, ARENA, the Australian Renewable Energy Agency, uses the TRL index from 1 to 9, from research to full system demonstration, alongside its own **Commercial Readiness Index**, which runs from 1 to 6, from a hypothetical commercial proposition to a bankable asset class. The pairing is a useful reminder: a technology can be technically demonstrated and still lack the commercial track record that a lender or insurer looks for.

Because organisations word the levels differently, this book uses its own plain-language version. What matters is not the exact wording but that each level names a kind of evidence, and that the evidence must exist before the level is claimed.

## The nine levels in plain words

```figure
type: steps
title: The nine technology readiness levels in this book's words
caption: The book's own paraphrase; organisations word the levels differently. Each step names the evidence that must exist, not the effort spent. The jump that matters for a first plant is from 6 to 7 to 8.
- TRL 1, principle | the underlying physics or chemistry has been observed and reported
- TRL 2, concept | a practical application has been proposed, on paper
- TRL 3, proof of concept | the key function has been shown by analysis and experiment
- TRL 4, laboratory component | the parts work together in a laboratory, with simplified materials
- TRL 5, component in a relevant environment | the parts work under realistic conditions, such as real feed, but not as the full design
- * TRL 6, prototype in a relevant environment | a representative model of the system or subsystem works under realistic conditions at meaningful scale
- TRL 7, prototype in the operational environment | a near-full-scale prototype works in the actual conditions of use
- TRL 8, complete system qualified | the actual system, in its final form, has passed test and demonstration
- TRL 9, proven in operation | the actual system has run successfully in the intended duty
```

Two words carry most of the weight. A **relevant environment** reproduces the conditions that matter to the technology without being the real thing: a pilot rig running real post-consumer flake is a relevant environment for a wash stage. An **operational environment** is the real thing: the full-scale plant, the owner's own feed with all its variation, the plant's own operators, and continuous operation for thousands of hours. The difference between TRL 6 and TRL 7 is that step from realistic to real, and the difference between TRL 7 and TRL 9 is the step from a prototype working to the actual system proving itself over time.

Readiness is always readiness **for something**. A technology at TRL 9 in one duty can be at TRL 6 in another, because the environment that defines the levels has changed. A sorter proven on dry food products has not been proven on wet plastic fines. Chapter 4 returns to this, because it is the commonest way a readiness rating goes wrong.

## Critical technology elements

A process plant is made of many pieces of equipment, and rating every bolt is neither possible nor useful. The assessment concentrates on **critical technology elements**: the parts of the system that it depends on to meet its requirements, and that are either new or used in a new way, at a new scale or in a new environment. An element that is essential but proven in the same duty is not critical in this sense; an element that is novel but could fail without affecting output, cost or safety is not critical either.

The GAO guide sets out a five-step process, which this book follows in its own words:

1. **Plan the assessment and choose the team**, including at least one person independent of the technology's developer.
2. **Identify the critical technology elements**, starting from the system's requirements and asking which elements they depend on and which of those are new to this duty.
3. **Assess each element** against the readiness levels, using documented evidence: test reports, operating records and the conditions under which they were obtained.
4. **Report** the rating for each element, the evidence behind it and what is still missing.
5. **Use the findings** in the decision, the cost and schedule allowances and the plan for further testing.

The third step is where most of the work lies, and where the discipline matters. A rating is a statement about evidence that exists, not about evidence the supplier expects to produce.

## Rating Option B's elements

This is an illustration. The process engineer led the assessment, with the independent reviewer as the team member from outside both suppliers. The requirement that defined criticality was the business case itself: make saleable flake at 3.0 t/h, at the claimed yield, on the recycler's own bales. Option A's elements were all rated **TRL 9**: each has run at full scale in this duty on the builder's earlier lines.

For Option B, four of the seven capital elements are ordinary equipment in ordinary duty: bale breaking and granulating, pre-wash and friction washing, drying and bagging, and the electrical, controls and building works. They were rated TRL 9, although the integration element was noted as changed by the novel equipment around it. Three elements are new to this duty and decide the yield.

The **hydrocyclone wash and separation stage** (A$2,800,000) was rated **TRL 6**. The pilot ran one 250 mm hydrocyclone, the same size the full plant would use, on real post-consumer flake for 400 hours. That is a representative subsystem in a relevant environment. It is not TRL 7, because the full plant would run ten cyclones in parallel from one feed manifold, on the recycler's own bales rather than a feed the supplier selected.

The **closed-loop water treatment** (A$1,700,000) was rated **TRL 5**. The pilot loop worked, but it ran with a bleed far larger, per tonne of feed, than the design allows, so it never saw the concentration of dissolved contaminants the full-scale loop would run at. The components were shown working in a relevant environment, but not as the design. Chapter 5 works through the numbers.

The **hyperspectral fines sorter** (A$2,500,000) was rated **TRL 7**. Its maker has about 300 sorters of the same family in food processing, none on wet plastic fines. A full-width 2.0 m unit of the same model ran a three-month trial on dry plastic flake at another recycler. That is a full-scale prototype in an operational environment close to this one, but on dry flake rather than the wet fines it would see here, so it is not yet TRL 8.

```figure
type: compare
title: Option B's elements, capital and readiness
cols: Capital estimate | TRL | Evidence
caption: This is an illustration. A$17,500,000 in total. The three novel elements, A$7,000,000 or 40.0% of capital, are the ones that decide yield; the lowest of them sets system readiness.
- Bale breaking, conveying, shredding and granulating | A$3,600,000 | 9 | many full-scale plants in this duty
- Pre-wash and friction washing | A$1,900,000 | 9 | many full-scale plants in this duty
- Hydrocyclone wash and separation | A$2,800,000 | 6 | one 250 mm cyclone, 400 h pilot, supplier-selected feed
- * Closed-loop water treatment | A$1,700,000 | 5 | pilot loop with a bleed far above design
- Hyperspectral fines sorter, new application | A$2,500,000 | 7 | full-width unit, three months on dry flake elsewhere
- Drying, silos and bagging | A$1,800,000 | 9 | many full-scale plants in this duty
- Electrical, controls, building works and installation | A$3,200,000 | 9 | ordinary works; interfaces changed by the novel elements
```

Against the GAO recommendation of TRL 7 before committing to a baseline, two of B's three critical elements fall short. The rating does not say B will fail. It says that the evidence needed to commit to a firm cost, schedule and yield does not yet exist for the water loop and the hydrocyclone stage, and that it will have to be produced either before commitment or, at greater cost, during start-up of the first plant.

The ratings also say what evidence would move each element up. The water loop reaches TRL 6 when a representative loop runs at the design bleed per tonne of feed and holds water quality at the concentration the full plant will see. The hydrocyclone stage reaches TRL 7 when a multi-cyclone arrangement runs on the recycler's own bales under plant conditions. The sorter reaches TRL 8 when the full-width unit has been qualified on wet fines of the size and moisture this plant will feed it. Each of these is a test that can be specified, costed and scheduled, which is what makes the rating useful rather than merely cautious.

## Why the lowest element sets system readiness

A washing line is a chain. Flake that is not separated cannot be sorted, and wash water that cannot be reused cannot wash. If the closed loop does not hold its water quality at design bleed, the plant either stops, bleeds far more water than planned, or makes off-specification flake, and in each case the yield claim fails however well the sorter works. A plant whose output depends on every critical element working cannot be more ready than its least ready critical element. **System readiness is the lowest critical element's level**, which for Option B is **TRL 5**.

An average hides this. If the elements are averaged by capital, the large, ordinary items such as granulators and building works pull the result up, because they are expensive and proven. The figure below shows four ways of summarising the same seven ratings.

```figure
type: stats
title: Four summaries of the same seven ratings
caption: This is an illustration. Only the last answers the question the board needs answered: how mature is the least proven thing the plant depends on.
- 7.85 | Capital-weighted average of all seven elements | rounds to 8, which is what the first assessment reported
- 7.71 | Simple average of all seven elements | still looks close to commercial
- 6.11 | Capital-weighted average of the three novel elements | nearer the truth, still an average
- * TRL 5 | Lowest critical element, the closed water loop | system readiness
```

Averages are not useless. The capital share of novel elements, 40.0% for B against 0% for A, is a good measure of how much of the money is exposed to novelty, and Chapter 3 uses it. But exposure and readiness are different questions. The readiness of the system is set by its weakest critical link, and the money exposed is set by how much of the plant is new.

A readiness rating per element is also the natural basis for a gate. [Committing before you know: spending, committing and the gate plan](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/committing-before-you-know/) in *Stage Gates and Stopping Rules by the Numbers* shows how a project separates spending to learn from committing to build; a minimum readiness level for every critical element is one of the clearest criteria such a gate can use. Chapter 8 of this book uses the same ratings to grade cost and schedule allowances, so that the most novel elements carry the widest ranges.

## The error: TRL 8 overall

This is an illustration. The first readiness assessment was drafted quickly, from the supplier's information pack, before the independent reviewer joined. It listed B's seven elements, rated them as above, and reported a single number: the capital-weighted average, 7.85, rounded to **"TRL 8 overall"**. The draft board paper repeated it, with the comment that B was "one step from fully proven".

The reviewer did not dispute any individual rating. Instead, the reviewer listed the critical elements one at a time and asked, for each, what evidence would have to exist for the plant to make saleable flake on the recycler's bales, and whether it did. For the water loop the reviewer asked for the pilot's bleed rate and feed rate and divided one by the other. The pilot had bled 0.5 m³/h on 0.30 t/h of feed, about 1.67 m³ per tonne, against a full-scale design of 2.0 m³/h on 3.0 t/h, about 0.67 m³ per tonne. The pilot loop had been diluted two and a half times more than the design would be, so its clean water said little about the full-scale loop. That element could not be above TRL 5, and so neither could the system.

The average had answered a question nobody asked: how proven is the typical dollar of this plant? The board needed to know whether the plant would work. The correction was made in two places. The assessment now reports each critical element with its evidence and states system readiness as the lowest critical element, **TRL 5**, with the capital-weighted figure kept only as a measure of exposure. The board paper replaced "one step from fully proven" with the list of missing evidence: a loop run at design bleed, a multi-cyclone manifold, and wet fines on the sorter.

[Proving a new technology is ready to depend on: beyond the best result](/reados/collections/business-systems-security-and-it-decisions/proving-a-new-technology-is-ready-to-depend-on/) sets out the qualitative questions behind a readiness review; this book attaches a number to each of them, beginning with the readiness level.

## Exercise: a conventional water system

Suppose Option B replaces its closed-loop water treatment with the conventional water treatment of Option A, at A$1,000,000 and TRL 9, and keeps everything else. What are the new capital estimate, the system readiness, the novel share of capital and the capital-weighted average TRL?

**Worked answer.** Capital falls by A$700,000, from A$17,500,000 to **A$16,800,000**. The remaining critical elements are the hydrocyclone stage at TRL 6 and the fines sorter at TRL 7, so system readiness rises from TRL 5 to **TRL 6**, set now by the hydrocyclone stage. The novel capital is 2,800,000 + 2,500,000 = A$5,300,000, which is 5,300,000 ÷ 16,800,000 = **31.55%** of the total. The capital-weighted average TRL is (3,600 × 9 + 1,900 × 9 + 2,800 × 6 + 1,000 × 9 + 2,500 × 7 + 1,800 × 9 + 3,200 × 9) ÷ 16,800 = 137,800 ÷ 16,800 = **8.20**. The change raises readiness by one level and removes the element the reviewer was most worried about, but it also gives up some of what made B attractive, because a conventional system bleeds and buys more water. What it does to yield is a separate question, which Chapter 6 answers by rebuilding the yield claim from its measurement basis.
