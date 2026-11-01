---
book: solvent-vapours-by-the-numbers
chapterSlug: substitution-reduction-and-proof
order: 11
title: "Substitution, reduction and proof"
description: "Choosing a less volatile substitute that still cleans and spares plastic parts, measuring use per part, proving a reduction with a fair trial, and the solvent balance before and after."
draft: false
---

The most effective controls in the hierarchy are at the top: eliminate the hazard, or substitute something less hazardous. For solvents, that means using less, using a less volatile or less hazardous solvent, or changing the process so that no solvent is needed. These are also the hardest controls to evaluate, because a substitute has to do the job, must not cause new problems, and has to be shown to have made a real difference in the workshop, not just on paper. This chapter brings together the numbers from the earlier chapters to choose a substitute, test it fairly and account for the result.

The chapter compares candidate wiping solvents, screens them against the plastic windows fitted to some of Plant S's guards, proves the change with a trial, and closes the plant's solvent balance. Its error is a saving claimed from monthly totals in a quiet month.

## What a substitute must do

A substitute solvent has to pass several tests at once, and a solvent that wins on one can fail on another.

```figure
type: checklist
title: Tests for a substitute wiping solvent
caption: The first three are about the job; the rest are about the hazards this book has measured. A substitute that fails the job will be quietly replaced with the old solvent, so the job tests come first.
- x Cleans the surface well enough | water-break or contact angle check, and paint adhesion
- x Evaporates fast enough for the process | a wiped part ready to paint within the flash time allowed
- x Does not attack parts it touches | plastic windows, seals, labels
- x Releases less vapour per part | lower volatility, less used per wipe
- x Raises the temperature at which its headspace becomes flammable | Chapter 4's screen and its flash point
- x Cools the surface less | less blush and condensation risk, Chapter 6
- ? Lower health hazard | its workplace exposure limit and safety data sheet, assessed by a competent person
```

Plant S's candidate for the wiping bench was isopropanol, dispensed from the plunger cans of Chapter 5. Against acetone it had a mixed record on paper. Its evaporation rate by mass at 20 °C was about 0.18 of acetone's, by Chapter 2's ranking, so less vapour would be released while wiping and more of each wipe would do its work on the surface before leaving. Its headspace reached its lower explosive limit at about 8 °C rather than −24 °C, and its flash point is above many winter mornings rather than far below every day of the year. A surface wetted with it cooled to a limit of about 4 °C rather than −18 °C at 28 °C. Against that, isopropanol is a weaker solvent for heavy oils than acetone, and it dries more slowly.

## Plastic windows on the guards

Some of Plant S's guards carry polycarbonate viewing windows, fitted before the final wipe so that the whole guard is cleaned at once. Acetone had occasionally left a haze on them, which operators had learned to avoid by wiping round the windows. A substitute had to be safe on the windows.

The [Hansen solvent compatibility tool](/tools/hansen-solvent-compatibility/) screens whether a liquid or a blend of two is likely to dissolve, swell or be resisted by a polymer, from the three Hansen solubility parameters of each and the polymer's interaction radius. The plant used the same published polycarbonate parameters as the companion book on adhesive bonding, δD 19.1, δP 10.1 and δH 9.3 MPa½ with R₀ 6.4, and solvent parameters from Hansen's handbook.

```figure
type: compare
title: Wiping solvents screened against polycarbonate windows
rowhead: Solvent
cols: δD / δP / δH | RED | Screen verdict
caption: From the Hansen solvent compatibility tool, polycarbonate 19.1 / 10.1 / 9.3 MPa½ with R₀ 6.4, one published fitted set. RED below 1 means inside the sphere. The screen cannot predict stress cracking, so the window supplier's chemical resistance guidance and a wipe test on a real window decide.
- Acetone, the current solvent | 15.5 / 10.4 / 7.0 | 1.18 | likely to resist, close to the boundary
- * Isopropanol | 15.8 / 6.1 / 16.4 | 1.64 | likely to resist
- n-Heptane, a hydrocarbon considered for oily parts | 15.3 / 0 / 0 | 2.45 | likely to resist
```

Acetone's position near the boundary of the polycarbonate sphere agreed with the haze the operators had seen. Isopropanol sat well outside, and the window supplier's guidance listed it as suitable for cleaning. A wipe test on twenty windows, followed by a week in the warm workshop under the stress of their mounting, showed no haze or cracking. The companion book's chapter on [preparing surfaces for bonding](/reados/publications/adhesive-bonding-by-the-numbers/preparing-surfaces-for-bonding/) works through the same screen for a bonded polycarbonate window.

## Does it clean?

The plant's oily steel came in with light rolling and cutting oils, not heavy grease. The engineer checked cleaning in two ways that the companion bonding book uses for surfaces: a water-break test on wiped panels, and water contact angles measured from phone photographs. Panels wiped with isopropanol from the plunger cans broke water slightly sooner than acetone-wiped ones but passed the plant's acceptance after a second wipe on the oiliest parts. Paint adhesion, checked by a cross-cut test on painted test panels after curing, was the same for both solvents. For the few heavily oiled parts, a hydrocarbon pre-clean was kept, applied in the hooded area with its own closed dispenser, so that the substitution did not quietly lower the quality of the parts that most needed cleaning.

## The error: monthly totals in a quiet month

The plant switched the wiping bench to isopropanol at the start of a month. At the end of it, the purchase records showed 33 kg of isopropanol used for wiping, against 70 kg of acetone in a typical month before. The monthly report claimed a 53% reduction in wiping solvent.

The engineer checked the production records. The month after the switch had been quiet: 190 frames against the usual 260. Per frame, acetone use had been about 70,000 ÷ 260 = 269 g, and isopropanol use was 33,000 ÷ 190 = 174 g. The real reduction was about 35%, not 53%. Part of the claimed saving was simply fewer frames.

A per-frame comparison from two different months was better than monthly totals, but still not fair. The two months differed in more than the solvent: in the mix of frames and guards, in the weather, and in how carefully people were working in the first month of a change. The engineer ran a proper trial.

## A fair trial

The [process change trial tool](/tools/process-change-trial/) plans a before-and-after comparison and evaluates it with Welch's two-sample t-test. The engineer took the wiping solvent per frame as the measure, weighed by dispensing can before and after each frame, expected a standard deviation of about 45 g a frame, and set the smallest worthwhile reduction at 30 g. At a significance level of 0.05 and 80% power, the tool gave **36 frames per group**.

For two weeks, the wiping bench alternated solvents frame by frame, with the operators and frame types shared equally between the two. Acetone frames used a mean of 270 g with a standard deviation of 45 g; isopropanol frames used 175 g with a standard deviation of 38 g.

```figure
type: compare
title: Three ways of measuring the wiping solvent saving
rowhead: Method
cols: Before | After | Reduction | Comment
caption: This is an illustration. The trial result is from the process change trial tool, 36 frames per group, interleaved. Only the interleaved trial separates the solvent change from production volume, product mix and timing.
- Monthly totals | 70 kg | 33 kg | 53% | confounded by a quiet month
- Per frame, two different months | 269 g | 174 g | 35% | confounded by mix and timing
- * Interleaved trial, per frame | 270 g | 175 g | 35%, 95 g, interval 75 to 115 g | improvement confirmed
```

The tool reported an improvement of 95 g a frame, a t statistic of 9.68 on about 68 degrees of freedom, a 95% confidence interval from 75 to 115 g, and the verdict improvement confirmed, with the sample size and practical size both met. The per-frame estimate from two months had been close to the truth; the monthly total had not. The trial also gave the plant a defensible number to put in its records.

### Why weigh per frame

Weighing the dispensing can before and after each frame took a few seconds and turned a vague quantity, solvent used at the bench, into a number attached to each part. It also exposed variation that monthly totals hide. Frames with large flat surfaces used about twice the solvent of compact guards, and one operator consistently used about 40% more than the others, with no better cleaning to show for it. Both findings were useful beyond the trial: the plant now plans solvent by frame type, and the operator's technique was brought into line with the others by a short demonstration of the two-wipe method.

The interval from the trial, 75 to 115 g a frame, also gave the plant an honest range for its records. At about 3,100 frames a year, the saving lies between about 230 and 360 kg of solvent a year, with a best estimate of about 295 kg. That is the figure the plant reports, rather than the single most flattering number.

## The balance before and after

With the trial done, the engineer closed the plant's solvent account for a typical month after all the changes of this book: the lids and plunger cans of Chapter 5, the still of Chapter 10, and the isopropanol at the wiping bench.

```figure
type: compare
title: Plant S's monthly solvent balance before and after
rowhead: Item
cols: Before | After | Change
caption: This is an illustration. Lids and plunger cans save about 200 kg of evaporation; the still returns about 75 kg of toluene-rich distillate that replaces purchased thinner for gun washing; isopropanol at 175 g a frame instead of acetone at 270 g saves about 25 kg. Paint and its own solvent are unchanged.
- Solvent bought, including the paint's | 618 kg | about 318 kg | about 49% less
- * Solvent evaporated | 536 kg | about 311 kg | about 42% less
- Waste thinner to disposal | 120 L | about 34 L of still residue | about 72% less
- Oven's maximum share of the LEL at peak | 46%, damper throttled | about 14%, damper open | restored margin
```

The changes were mostly cheap, and most of the evaporation saving came from the cheapest of them, lids and dispensers. Recovery reduced purchases and waste but not evaporation, because the recovered solvent is used and evaporates in its turn. Substitution at the wiping bench gave a modest saving in vapour and a larger gain in safety margin and surface quality. The biggest remaining sources are the paint's own solvent, in the booth and the oven. The next step, which the plant's supplier is now trialling with it, is a higher-solids paint that carries less solvent per square metre, the kind of change that eliminates vapour rather than managing it.

## Elimination: does it need solvent at all?

Substitution asks which solvent; elimination asks whether any is needed. Plant S's engineer put that question to each use in turn.

- **Wiping oily steel.** Much of the oil on the plant's steel arrived with it, from the mill and the laser cutter's supplier. Asking the steel supplier for dry, unoiled sheet for parts that would be painted within a few weeks, and storing it indoors, removed the need for the heaviest wiping on about a third of the parts.
- **Cleaning frames before painting.** An aqueous alkaline washer, a heated spray cabinet using a water-based cleaner followed by a rinse and a hot-air dry, cleans oily steel with no solvent vapour at all. It trades vapour for water, heat and wastewater, and needs space and a drain to an approved trade waste connection. The plant costed one for a future expansion.
- **Flushing spray guns.** An enclosed gun washer, which sprays recovered thinner through the gun inside a closed cabinet and drains it back, uses the still's distillate repeatedly and releases far less vapour than flushing into an open drum.
- **The paint itself.** Higher-solids and water-based coatings carry less organic solvent per square metre. The exercise below estimates one such change.

None of these is free, and each changes something else. But each removes vapour at its source rather than catching it afterwards, which is why elimination sits at the top of the hierarchy.

## Keeping the gains

Solvent reductions decay unless they are watched. Lids go missing, a new operator brings in an open tin, a hot week tempts someone to thin the paint with whatever is to hand. Plant S kept four routines going after the project ended.

```figure
type: checklist
title: Plant S's routines for keeping solvent use down
caption: This is an illustration. Each routine repeats a measurement from an earlier chapter, cheaply and on a schedule, so that a drift is noticed in weeks rather than at the next audit.
- x Monthly solvent balance in kilograms | purchases, still distillate and waste, Chapter 1
- x Monthly weighing of dispensers and the gun-wash drum | open lids show up at once, Chapter 5
- x Annual measurement of hood capture and oven exhaust | converted to reference conditions, Chapters 8 and 9
- x Solvent register with components and the dominant vapour | updated when a product changes, Chapter 3
- ? Exposure monitoring by an occupational hygienist | before and after the changes, then as advised
```

## What the numbers do not settle

The calculations in this book put sizes on hazards and savings, and they were enough to find Plant S's largest problems and the cheapest fixes. They do not settle the questions that need measurement or specialist judgement: the actual exposure of each worker, which only personal sampling shows; the hazardous area classification of the booth, store and mixing room; the design and certification of the oven and still; and the health assessment of any substitute. The engineer's report listed those separately, with who was responsible for each, so that the numbers were used for what they could do and no more.

## How this applies to a small Australian business

Look for substitutes that do the job with less vapour: lower volatility, smaller quantities and lower hazard. Test them on the job first, and screen them against any plastics they touch, then confirm with the real parts and the supplier's guidance. Measure use per part, not per month, and prove a change with an interleaved trial planned for the size of saving that matters. Keep the solvent balance going, so that every change shows up in purchases, waste and evaporation, and so the next step is chosen by the numbers. Report savings as ranges from fair trials, not as the most flattering total, and separate what your calculations show from what needs measurement or a specialist.

## Exercise: a higher-solids paint

The supplier's higher-solids paint carries 30% solvent by volume instead of 40%, at the same applied dry film. (a) If paint use by volume falls by 14% because more of each litre is solids, how much paint solvent is used per month, compared with 103 kg before? (b) By how much would evaporation fall? (c) What would you check before switching?

**Worked answer.** (a) Paint volume falls from 300 L to 300 × 0.86 = 258 L, and its solvent content from 40% to 30%, so the solvent is 258 × 0.30 × 0.861 = **about 66.6 kg** a month, against 103 kg. (b) Evaporation falls by about 103 − 66.6 = **36 kg a month**, about 12% of the 311 kg evaporated after the earlier changes, and the oven's share falls with it. (c) Spraying viscosity and the thinner needed, which could take back some of the saving; film build, flow and appearance; cure in the existing oven; the blush risk on humid days; and the new paint's safety data sheet. A trial, interleaved with the current paint and planned with the process change trial tool, would show whether the saving is real at the spray gun.
