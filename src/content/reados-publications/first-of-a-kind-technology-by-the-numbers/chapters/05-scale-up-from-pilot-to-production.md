---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: scale-up-from-pilot-to-production
order: 5
title: "Scale-up from pilot to production: what changes with size"
description: "From a 0.30 t/h pilot to a 3.0 t/h plant: numbering-up ten cyclones, sorter loading up 2.5 times, and a water loop whose pilot never saw the plant's 3,000 mg/L."
draft: false
---

A pilot plant is built to answer questions cheaply, and it answers the questions it was built to answer. The trouble at scale-up comes from the questions it was not built to answer, usually because nobody thought to ask them. This chapter compares Option B's 0.30 t/h pilot with the 3.0 t/h plant it is meant to prove, quantity by quantity. It shows that one scale factor hides several, that some equipment can be multiplied rather than enlarged, that a sorter four times wider is not four pilots side by side, and that a water loop is a system that changes with time as well as size. It ends with the comparison that found the most important gap in the pilot evidence.

## One scale factor is not enough

This is an illustration. The design feed is 3.0 t/h and the pilot ran at 0.30 t/h, so the throughput **scale factor** is 3.0 ÷ 0.30 = **10**. The supplier's material describes the plant as "the pilot scaled up ten times", and for the flows of solid material that is true.

But a process plant contains quantities that scale in different ways, and each of them has its own scale factor. Some scale with **throughput**: feed, product, residue, make-up water. Some scale with **area**: a sorter's belt width, a screen's open area, the surface of a dryer. Some scale with **volume**: tanks, the water loop's hold-up, and therefore residence times. And some depend on **time**: anything that accumulates, wears, fouls or drifts. A pilot can match the full plant on one of these and miss on the others, and the misses are where scale-up surprises come from.

```figure
type: matrix
title: Four ways a quantity can scale
x: Size of the plant, then time in service
y: Flows and sizes
caption: This is an illustration. A tenfold throughput factor sets only the first box. Each of the others needs its own comparison between pilot and plant, made per tonne of feed.
- Throughput | feed, flake, residue, make-up water and bleed: ×10 if the design keeps the same ratios
- Area | sorter belt width ×4, so loading per metre of belt rises 2.5 times
- Volume | loop hold-up ×30, so the loop's response time grows from 8 h to 60 h
- Time | accumulation, wear and fouling: what 400 pilot hours cannot show about 6,000 h a year
```

The discipline that follows is simple to state: put every flow and every size on a per-tonne basis, compare the pilot with the design line by line, and treat every ratio that differs as a question the pilot has not answered.

## Numbering-up and scaling-up

There are two ways to make equipment ten times bigger. **Scaling-up** builds one larger unit; **numbering-up** builds several units of the proven size and runs them in parallel.

Option B's design numbers up its hydrocyclones. The pilot ran one 250 mm hydrocyclone at 0.30 t/h; the plant will run **ten identical 250 mm hydrocyclones**, each at 0.30 t/h, fed from one manifold. This is a sound choice. A hydrocyclone's separating performance depends strongly on its diameter, and a single cyclone ten times the capacity would be much larger and would separate at a different, coarser particle size; the pilot would have said little about it. Ten cyclones of the pilot's size, each at the pilot's duty, keep the evidence for the cyclone itself directly relevant.

Numbering-up removes one question and adds others. The manifold must split flow and solids evenly between ten cyclones; a cyclone that receives more than its share separates worse, and one that receives less wastes capacity. A blocked underflow outlet on one cyclone, a routine event in solids handling, now reduces the stage by a tenth rather than stopping it, which is good for availability but must be detected, because a partly failed stage still makes flake, only less of it and of lower quality. None of this appears on a pilot with one cyclone. That is why Chapter 2 rated the hydrocyclone stage TRL 6 rather than 7: the cyclone has been shown at its true size, the stage has not.

## The sorter: four times wider, not four pilots

The pilot sorter belt was 0.5 m wide; the plant's will be **2.0 m**, a width scale factor of 4, running at the same belt speed. Throughput, however, rises by 10. The flake loading per metre of belt width rises from 0.30 ÷ 0.5 = **0.60 t/h per metre** on the pilot to 3.0 ÷ 2.0 = **1.50 t/h per metre** at full scale, **2.5 times** higher.

Loading matters to an optical sorter because it decides how often particles touch or overlap on the belt. A sorter identifies each particle by its spectrum and removes the rejects with air jets; when particles lie close together, a jet aimed at a reject can carry good flake with it, and an overlapped particle can be misread. A sorter that performs well at one loading can perform worse at two and a half times that loading, and the pilot tells nothing about by how much. To match the pilot's loading at full throughput, the belt would have to be 3.0 ÷ 0.60 = 5.0 m wide, which the sorter's model does not offer.

The full-width trial on dry flake at another recycler, which supports the sorter's TRL 7, helps here: it shows the 2.0 m machine working at full width. What it cannot show is the machine on wet fines at this loading. The qualification run in Chapter 6 must therefore load the sorter at the full-scale 1.50 t/h per metre, not at the pilot's easier figure.

```figure
type: compare
title: Pilot against full-scale design, per tonne of feed
cols: Pilot | Full scale | Ratio
caption: This is an illustration. Three different scale factors hide behind the headline 10. The highlighted rows are the ones where the pilot ran in easier conditions than the plant will.
- Feed rate | 0.30 t/h | 3.0 t/h | ×10
- Hydrocyclones | one, 250 mm | ten, 250 mm | ×10 in number, same size
- Feed per hydrocyclone | 0.30 t/h | 0.30 t/h | ×1
- Sorter belt width | 0.5 m | 2.0 m | ×4
- * Sorter loading per metre of belt | 0.60 t/h | 1.50 t/h | ×2.5
- Water loop volume | 4 m³ | 120 m³ | ×30
- Bleed | 0.5 m³/h | 2.0 m³/h | ×4
- * Bleed per tonne of feed | 1.667 m³/t | 0.667 m³/t | ×0.4
- * Steady COD in the loop | 1,200 mg/L | 3,000 mg/L | ×2.5
- Loop time constant | 8 h | 60 h | ×7.5
```

## The water loop changes with time

A closed water loop is not a piece of equipment that either works or does not. It is a balance between what enters the water and what leaves it, and its state at any moment depends on how long it has been running.

Washing removes contamination from the flake: food residues, label adhesives, dirt. A convenient measure of the dissolved and fine organic load is **chemical oxygen demand (COD)**, in milligrams per litre. This is an illustration: the case assumes that washing releases **2.0 kg of COD per tonne of feed** into the loop. In a simple model, the loop's treatment removes suspended solids but the dissolved load leaves only with the bleed, the loop is well mixed, and the load per tonne is constant. Then a mass balance gives two results.

```figure
type: formula
title: Steady concentration and time constant of a bled water loop
formula: C(steady) = L × F ÷ Q
formula: τ = V ÷ Q, and C(t) = C(steady) × (1 − e^(−t/τ))
caption: This is an illustration. L = 2.0 kg COD per tonne is the case's illustrative load. The steady level depends on the bleed per tonne of feed; the time to reach it depends on the loop's volume over its bleed.
- L | contaminant load released per tonne of feed, kg/t
- F | feed rate, t/h
- Q | bleed rate, m³/h, equal to the fresh make-up
- V | volume of water held in the loop, m³
- τ | time constant: about 3τ to reach 95% of steady state, about 4.6τ to reach 99%
step: Pilot: 2.0 × 0.30 ÷ 0.5 = 1.2 kg/m³ = 1,200 mg/L; τ = 4 ÷ 0.5 = 8 h; 95% after 24 h
step: Full scale: 2.0 × 3.0 ÷ 2.0 = 3.0 kg/m³ = 3,000 mg/L; τ = 120 ÷ 2.0 = 60 h; 95% after 180 h, 99% after 276 h
```

The first result says that the steady concentration depends on the **bleed per tonne of feed**, Q ÷ F, and nothing else in this model: halve the bleed per tonne and the concentration doubles. The second says that the time taken to get there depends on the loop's volume divided by its bleed. A small loop with a generous bleed settles quickly at a low level; a large loop with a lean bleed settles slowly at a high level.

The pilot's loop settled within a day at 1,200 mg/L and stayed there for the rest of its 400 hours, about 50 time constants. The full-scale loop will take about 180 operating hours to come within 5% of its steady level of **3,000 mg/L**. Whether flake washed in water at 3,000 mg/L meets the product specification, whether the treatment holds up at that load, and whether anything else builds up in the loop at the lower bleed, are questions the pilot never put to the process.

```figure
type: line
title: COD in the water loop after start-up, pilot and full scale
x: Operating hours after start-up
y: COD in the loop, mg/L
ymin: 0
ymax: 3200
legend: Pilot as run, 1.667 m³/t | Full-scale design, 0.667 m³/t | Pilot retest, 0.667 m³/t
mark: 30.6 | Plant passes the pilot's highest level
caption: This is an illustration. The pilot settled at 1,200 mg/L within a day; the plant passes that level 30.6 h after start-up and settles near 3,000 mg/L after about 180 h. The retest at the design bleed per tonne reaches 3,000 mg/L with a 20 h time constant.
- 0 | 0 | 0 | 0
- 10 | 856 | 461 | 1180
- 20 | 1101 | 850 | 1896
- 30 | 1172 | 1180 | 2331
- 40 | 1192 | 1460 | 2594
- 60 | 1199 | 1896 | 2851
- 90 | 1200 | 2331 | 2967
- 120 | 1200 | 2594 | 2993
- 180 | 1200 | 2851 | 3000
- 240 | 1200 | 2945 | 3000
- 300 | 1200 | 2980 | 3000
```

## Solids, wear and what short pilots miss

The last kind of scale is time itself. Merrow's 1986 RAND study of solids-processing plants found that their key performance problems resulted from physical and mechanical difficulties rather than from process chemistry. In a washing line the physical difficulties are familiar: abrasive grit wearing cyclone liners, pump impellers and granulator knives; screens and spray nozzles blinding; fines packing into corners of chutes; and seals failing in wet, gritty service. All of them develop over hundreds or thousands of hours. A pilot that ran 400 hours, on one selected feed, with two unplanned stops of its hydrocyclone stage, has said very little about the wear rates of a plant that must run 6,000 hours a year on whatever bales arrive.

Scaling-up also changes the hazards. Shredders, granulators and conveyors are hazardous plant, and Safe Work Australia's *Model Code of Practice: Managing the risks of plant in the workplace* is the national model guidance for the people who design, install, commission and use them; whether it has legal effect in Western Australia, and what the state regulator requires, should be checked with the regulator. A pilot run by its designers is not a guide to how guarding, isolation and cleaning will work on a production roster.

Prototypes are always simpler than the thing they stand for, and choosing what a test leaves out is a design decision in its own right. [Choosing prototype fidelity: the cheapest build that answers the question](/reados/publications/prototypes-and-simulation-by-the-numbers/choosing-prototype-fidelity/) in *Prototypes and Simulation by the Numbers* treats that choice in general; the pilot here is a case where one simplification, a generous bleed, removed the very condition the test needed to include.

## What the pilot does show

None of this makes the pilot worthless. Read per tonne, it gives good evidence on several points. The hydrocyclone ran at its true size and its true duty of 0.30 t/h, on real post-consumer flake, so its separation of polyolefins from heavier material is directly relevant to each of the ten cyclones in the plant. The sorter's optics distinguished the target polymers from contaminants in wet fines, which the dry-flake trial elsewhere could not show, even if at an easier loading. And the wash itself cleaned real packaging, not a laboratory substitute.

The comparison therefore sorts the evidence into three groups rather than passing or failing the pilot as a whole: questions the pilot answered (cyclone separation at true size, sorting by spectrum on wet fines), questions it answered in easier conditions than the plant (sorter loading, water-loop concentration), and questions it could not answer at all (manifold distribution across ten cyclones, wear over thousands of hours, the recycler's own feed). Each group calls for a different response: accept, retest at plant conditions, or carry as risk into the allowances and the qualification plan.

## The error: a pilot that never saw the plant's water

This is an illustration. The supplier's pilot report described the water loop as "proven closed-loop operation over 400 hours, with stable water quality throughout". That statement was accurate, and it was the basis on which the first assessment had rated the loop as proven.

The pilot had bled **0.5 m³/h** on **0.30 t/h** of feed: **1.667 m³ per tonne**. The full-scale design bleeds **2.0 m³/h** on **3.0 t/h**: **0.667 m³ per tonne**, because a lower bleed per tonne is what makes the closed loop cheaper to run than a conventional system. The pilot's water was therefore diluted two and a half times more than the plant's would be, and its stable 1,200 mg/L was stable at a level the plant would pass **30.6 hours** after start-up, on its way to 3,000 mg/L. "Stable water quality" was true of the pilot and silent about the plant.

The gap was found at the design review, when the process engineer, at the independent reviewer's request, put every flow in the pilot report and the design on a per-tonne basis in one table, the comparison shown in the figure above. Bleed per tonne was the line that did not match. Nothing else in the pilot report would have shown it, because each number in the report was correct; only the ratio was wrong.

The correction was a retest, not a calculation. The supplier agreed to rerun the pilot loop with the bleed cut to **0.2 m³/h**, which on 0.30 t/h is 0.667 m³ per tonne, matching the design. At that bleed the pilot loop settles at **3,000 mg/L**, with a time constant of 4 ÷ 0.2 = **20 hours**, reaching 99% of steady state after about **92 hours**. Only after that point does the pilot represent the plant's water, and the qualification run of [Qualification testing: run length, feed envelope and yield basis](/reados/publications/first-of-a-kind-technology-by-the-numbers/qualification-testing/) starts its endurance hours there, not at start-up. The water loop stays at **TRL 5** in [Technology readiness levels and critical technology elements](/reados/publications/first-of-a-kind-technology-by-the-numbers/technology-readiness-levels/) until the retest shows it holding water quality and product quality at the design concentration; Chapter 8's exercise shows what moving it to TRL 6 is worth in the cost allowance.

## Exercise: a more generous bleed

To reduce the risk of the loop, the design team considers raising the full-scale bleed from 2.0 to 3.0 m³/h, with everything else unchanged. What are the new steady COD and time constant, how much more water does the plant use a year, and what does that cost at an illustrative A$4.50/m³ for supply and trade-waste charges combined, excluding GST? Does the change remove the need for the retest?

**Worked answer.** The steady concentration is 2.0 kg/t × 3.0 t/h ÷ 3.0 m³/h = 2.0 kg/m³, or **2,000 mg/L**. The time constant is 120 ÷ 3.0 = **40 hours**. The extra bleed is 1.0 m³/h, replaced by the same amount of make-up water, so over 6,000 hours the plant uses **6,000 m³ a year** more, which costs 6,000 × 4.50 = **A$27,000 a year**. The change does not remove the need for the retest. The bleed per tonne becomes 1.0 m³/t, still below the pilot's 1.667 m³/t, and the full-scale loop would still pass the pilot's highest level of 1,200 mg/L after about 36.7 hours and settle a further two-thirds above it. A more generous bleed narrows the gap between pilot and plant; only a test at the plant's own bleed per tonne closes it.
