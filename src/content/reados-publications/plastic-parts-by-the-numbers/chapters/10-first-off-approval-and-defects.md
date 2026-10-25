---
book: plastic-parts-by-the-numbers
chapterSlug: first-off-approval-and-defects
order: 10
title: "First-off trials, defects and approval"
description: "Run first-off trials with a plan, recognise and correct common moulding defects, prove a process window, inspect first articles and approve the part against its brief."
draft: false
---

The first parts from a new mould are the moment of truth for every decision in this book. They show whether the shrinkage allowance was right, whether the ribs show through, whether the hooks snap and release, whether the cover lies flat and how long the cycle really is. They also show defects that no drawing predicted. A first-off trial run without a plan produces a box of parts and a list of opinions. A trial run against the brief produces evidence for a decision.

This final chapter plans the cover's trials, works through the common defects and their causes, establishes a process window, inspects the first articles and closes with the approval decision.

## Plan the trials before the mould arrives

Most moulds go through two or more trial stages. The first, often called T0 or T1 depending on the toolmaker's convention, checks that the mould runs: that it fills, ejects, vents and cools, and that its moving parts work. Parts from it are usually not dimensionally correct, because the steel-safe dimensions have not yet been adjusted. Later trials follow each round of corrections until the parts meet the brief. The final trial, run at production settings on the production machine with production material, provides the first-article samples for approval.

The trial plan should state, for each stage, what will be checked, how many parts will be kept, how they will be identified and who will judge them. For the cover, the plan keeps ten consecutive parts from each stage once the process is stable, marked with the stage and shot number, and conditions them for 24 hours at a controlled room temperature before measuring, as Chapter 6 requires.

## Prepare the material

Polycarbonate absorbs a small amount of moisture from the air, and moulding it wet causes trouble. At melt temperature, the moisture turns to steam, which streaks the surface and breaks down the polymer chains, weakening the part. The reference grade's data sheet specifies drying at 120 °C in dry air for two to three hours, to a maximum moisture content of 0.02%. That instruction belongs in the process sheet, and the dryer's settings and the material's residence time in it should be recorded at each trial.

## Recognise the common defects

Most moulding defects have a small number of typical causes, and the designer's knowledge of the part helps the moulder find them quickly.

```figure
type: compare
title: Common defects, their usual causes and where to look first
cols: What it looks like | Usual causes | First checks for the cover
caption: Many defects have more than one cause. Change one setting at a time and record each change and its effect.
- Short shot | Part not completely filled | Too little shot, frozen flow front, poor venting | Far skirt corners and rib ends
- Flash | Thin fin at parting line or around cores | Clamp too low, worn or poorly fitted mould, excess pressure | Skirt edge, lifter shut-offs
- *Sink | Shallow depression over a thick section | Thick rib or boss, short hold time, small gate | Over ribs and bosses on the top
- Splay | Silvery streaks fanning from the gate | Moisture in the material, overheating | Around the gate under the label
- Burn marks | Black or brown marks | Trapped, compressed air | Rib ends, skirt corners
- Weld lines | Visible line where fronts meet | Flow splitting around cores, cold fronts | Skirt corners only, by design
- Warpage | Part not flat or twisted | Uneven cooling, packing or thickness | Bow of the top, Chapter 6
```

The designer's contribution is to know where each defect is most likely on this part and why. The rib ends and skirt corners are the last places to fill and the most likely places for short shots and burns. The ribs and bosses are the likely places for sink. The gate region is where splay will show first. A trial inspection that looks there first finds problems faster.

## A failure case: silver streaks at the gate

This is an illustration. At the second trial, parts from the first hour were clean, but after a lunch break every part showed silvery streaks fanning out from the gate across the top, visible at the edges of the label recess. The streaks were the classic appearance of splay.

The cause was found in the material handling log. During the break, the dryer hopper had been topped up with polycarbonate from a bag that had been opened and left in the moulding hall overnight, and the new material had spent less than half an hour in the dryer before reaching the machine. The specified two to three hours at 120 °C had not been met, and the material's moisture content was well above the 0.02% limit.

The detection relied on two habits: keeping parts in sequence so the change could be tied to a time, and keeping a material log so the time could be tied to an event. The fix was to purge the barrel, return to properly dried material and add a rule to the process sheet that material must have the specified drying time before use. The streaked parts were scrapped, because moisture also degrades the polymer, and parts that look acceptable after a mild case of splay may still have reduced impact strength.

## Correct dimensions from measured shrinkage

The first dimensionally meaningful trial turns the shrinkage estimate from Chapter 6 into a measurement. This is an illustration. For the revised nominal skirt length of 159.9 mm, the toolmaker cut the cavity at **159.9 / (1 − 0.0065) ≈ 160.95 mm**, a little under that on the steel-safe side. Ten conditioned parts from the first trial average 159.81 mm. The measured shrinkage along the length is therefore about **1 − 159.81 / 160.95 ≈ 0.71%**, slightly more than the 0.65% assumed, but within the range a 2.5 mm part could reasonably show.

The part is about 0.09 mm short of nominal and within its ±0.25 mm tolerance. If it had been outside tolerance, the measured shrinkage would give the exact correction: the cavity length needed for 159.9 mm at 0.71% is about **159.9 / (1 − 0.0071) ≈ 161.04 mm**, an increase of about 0.09 mm, achieved by removing steel. Corrections calculated this way, from conditioned parts and a measured shrinkage, converge in one step. Corrections made by guessing, or from parts measured hot from the machine, often take several.

The measured values should also go back into the team's records, for the material, wall thickness and gate arrangement. The Covestro guide's advice that the most accurate shrinkage values come from existing moulds running similar parts applies to the team's own moulds too: the cover's 0.71% is the best starting figure for the next polycarbonate part of similar wall.

## Keep the trial record usable

A trial generates many changes in a short time, and memory is unreliable. Record each setting change, the time, the shot number and the effect, in the order they happened. Keep the parts in sequence and labelled. Photograph defects with a scale and note where on the part they occurred. Record the mould and material temperatures, the dryer settings, the cycle time and the clamp setting at the point where parts were accepted.

That record serves three purposes. It lets the team diagnose problems such as the splay above, where the cause lay in an event an hour earlier. It provides the process sheet for production, so that the next start-up begins from known good settings. And it is the evidence behind the approval: a reviewer can see how the process was reached, not just the final numbers.

## Establish a process window

A process that produces good parts at one exact setting is fragile. Material lots vary, the mould warms through the day and machines drift. Before approval, the moulder should show that the part stays within specification over a range of the settings that matter most, a process window.

For the cover, the moulder and designer agree to vary the two settings most likely to affect its critical dimensions and appearance: the melt temperature, between 290 and 310 °C within the data sheet's recommended range, and the holding pressure, between a low and a high value chosen by the moulder. Parts from each combination are measured for skirt length, flatness and sink.

```figure
type: matrix
title: Process window trial for the cover
x: Holding pressure: low → high
y: Melt temperature: 290 °C → 310 °C
caption: Teaching results. Parts pass at all four corners, so the production setting at the centre has margin in every direction. A failing corner would narrow the permitted range.
- Low pressure, 310 °C | Pass; slight sink over bosses, within limit
- High pressure, 310 °C | Pass; skirt length near upper limit
- Low pressure, 290 °C | Pass; flatness 0.3 mm
- High pressure, 290 °C | Pass; best flatness, 0.2 mm
```

The production setting is placed in the middle of the window, so that normal variation in any direction keeps the parts within specification. The window's boundaries and the production setting are recorded in the process sheet, which becomes part of the approval.

## Inspect the first articles

The first-article inspection measures every dimension on the drawing, on parts from the final trial, and compares each with its tolerance. For a moulded part, it is common to measure several consecutive parts from each cavity, so that both the mean and the spread are visible. The cover has one cavity, and ten parts are measured.

```figure
type: compare
title: First-article results for the cover against the brief
cols: Requirement | Result, ten parts | Verdict
caption: Teaching results. Every requirement is met; the skirt length is near the low end, as the steel-safe cavity intended.
- Skirt length at open edge | 159.9 ± 0.25 mm | 159.78 to 159.84 mm | Pass
- Skirt width at open edge | 99.9 ± 0.2 mm | 99.83 to 99.88 mm | Pass
- Flatness of the top | ≤ 0.5 mm | 0.18 to 0.24 mm | Pass
- Centre deflection, 50 N press | ≤ 1.0 mm | 0.71 to 0.74 mm | Pass
- Snap assembly force, two hooks | By hand | About 19 N | Pass
- *Snap cycles at 23 °C and 0 °C | 200 without whitening or cracking | 200, no damage | Pass
- Sink over ribs and bosses | Not visible under defined lighting | Not visible | Pass
- Gate vestige height in label recess | ≤ 0.1 mm | 0.04 to 0.06 mm | Pass
```

Several results can be compared with the earlier predictions. The press deflection of about 0.71 to 0.74 mm sits a little below the plate model's 0.78 mm from Chapter 4, a reasonable agreement in the expected direction, since the real skirt holds the top slightly more firmly than the model assumed. The assembly force of about 19 N for two hooks matches Chapter 5's estimate of about 9.9 N per tapered hook. The flatness of about 0.2 mm reflects the cooling correction from Chapter 6. The skirt length is about 0.06 to 0.12 mm below its nominal, comfortably within tolerance and on the steel-safe side; the toolmaker could open the cavity slightly to centre it, but the team decides to leave it, because the extra clearance helps the hot fit.

## Check the cycle and the cost assumptions

The final trial also confirms the economics. The production cycle settles at 18 s against the 17.5 s estimate, with a cooling timer slightly longer than planned while the moulder builds confidence in the process. At A$85 an hour, the extra half-second adds about **85 × 0.5 / 3,600 ≈ 1.2 cents** per cover, which does not change any decision. The part mass, weighed on ten parts, averages 79.1 g against the 79.4 g estimate. The clamp force needed to avoid flash is about 50 tonnes, close to the 49 tonnes calculated in Chapter 8.

Recording these comparisons is not a formality. They calibrate the estimating methods for the next part. A team that finds its cooling estimates consistently 10% short, or its clamp estimates consistently generous, can adjust the next brief accordingly.

## Approve the part against the brief

Approval is a decision with a defined scope, made by the people who own the brief. For the cover, the approval record states that the part, made from the named grade, in the approved mould, on the stated machine, within the recorded process window and with material dried as specified, meets every requirement of the brief as revised in Chapter 7 for the gate position. It lists the evidence: the first-article report, the process window results, the functional tests and the comparison with predictions.

```figure
type: checklist
title: Approval record for the polycarbonate access cover
caption: Approval applies to the stated material, mould, machine and process. A change to any of them is assessed before parts are supplied.
- First-article inspection | Ten parts, every drawing dimension, all within tolerance
- Functional tests | Press deflection, snap force and 200 cycles at 23 and 0 °C
- Cosmetic standard | No visible sink, vestige under the label, texture uniform
- Process window | Melt temperature and holding pressure range recorded
- Material control | Grade, colour, drying time and moisture limit in the process sheet
- Brief revisions | Gate in the label recess, approved and recorded
- ? Chemical resistance | Site cleaning products confirmed and checked with the supplier
- ? Flammability | Product standard requirement confirmed for the box
```

The two open items from Chapter 1 reappear. If either is still open, the approval is conditional, and the record says so. It is better to approve with named conditions than to let open questions disappear because the parts look good.

## Keep reference samples

Keep a small set of approved parts, labelled with the trial, date, shot numbers and process settings, as reference samples. They settle later arguments about appearance far better than words in a specification: a production part can be compared side by side with an approved sample under the same lighting. Store them away from sunlight and heat, record where they are, and keep at least one set with the designer and one with the moulder. When a change is proposed after approval, the reference samples are also the baseline against which the changed parts are judged.

## Control changes after approval

An approved part stays approved only while its inputs stay the same. A different material grade or colour, a mould repair, a move to another machine, a change of moulder or a process change outside the recorded window can each change the part, sometimes in ways inspection would not catch, such as reduced impact strength or increased moulded-in stress. The supply agreement should require the moulder to notify such changes before making them, and the designer should decide which changes need fresh first-article inspection.

Regrind is a common example. Using reground runners or rejects blended with new material saves money, but repeated reprocessing can degrade polycarbonate. With the hot tip there is no runner to regrind, but start-up rejects remain; the brief should state whether regrind is permitted and at what maximum proportion, with the material supplier's guidance as the basis.

## Close the loop for the next part

The cover's project leaves a record that makes the next moulded part easier: a brief template, the supplier guidance used and how it compared with the result, the cooling, clamp and cost estimates against the actual figures, the defects met and their causes, and the decisions about gate, hooks and tolerances. Stored with the drawing and the approval, it turns one project's experience into the starting point for the next.

## Exercise: a colour change

Marketing asks for a black version of the cover, using the same grade in a black colourant, from the same mould. Which parts of the approval would you repeat, and why?

**Worked answer.** A colourant can change a material's shrinkage, its flow, its heat absorption in the mould and sometimes its impact strength, and data sheets note that typical values may be affected by colouring. The black version should be treated as a change requiring at least a reduced first-article inspection of the critical dimensions, the flatness and the skirt fit, because shrinkage may differ slightly; a repeat of the snap cycling, because the colourant could affect the hooks' strain capacity; and a cosmetic check, because black parts show sink, gloss differences and flow marks more readily than grey ones. The process window should be confirmed at the production setting, and the material supplier's data for the black grade checked for any changed properties before parts are supplied.
