---
book: modular-projects-by-the-numbers
chapterSlug: comparing-bespoke-and-modular
order: 9
title: "Comparing bespoke and modular: cost, time and risk"
description: "A$10.32m against A$8,446,131, break-even at the fourth cell, the last cell in week 92 or 68, borrowed cost ratios for the risk, and a comparison that left out A$520,000."
draft: false
---

The earlier chapters have each looked at one part of the choice between a bespoke and a modular programme: the outcome, the module, the pilot, learning, people, exposure on site and the rhythm of the rollout. This chapter puts the parts together into one comparison on cost, time and risk, and asks where the difference really comes from. The answer is not quite the one most people expect.

It sets the two options side by side, takes the cost difference apart, finds the number of cells at which the modular option starts to pay, compares when each option's benefits arrive, and then looks at the spread of outcomes around both estimates, using a borrowed outside view. It ends with the conditions under which bespoke is the right choice, and with an early version of this comparison that left out the cost of designing the module.

## The two options side by side

This is an illustration. All amounts are Australian dollars excluding GST, and every figure comes from the running case as built up in the earlier chapters.

```figure
type: compare
title: Bespoke and modular programmes for twelve cells
cols: Bespoke | Modular
best: 2
caption: This is an illustration, in A$ excluding GST. Bespoke is ahead on early benefit; modular is ahead on cost, finish date and exposure, and slightly ahead on benefit from week 104.
- Programme cost | A$10,320,000 | A$8,446,131
- Average cost per cell, including design | A$860,000 | A$703,844
- First benefit | week 22, two cells | week 35, the pilot
- Last cell earning | week 92 | week 68
- Mean benefit start | week 57 | week 55.83
- Benefit earned to week 52 | A$332,308 | A$90,000
- Benefit earned to week 104 | A$1,952,308 | A$2,000,769
- Working days of lines stopped | 180 | 36
- Chance of a disruptive event per installation | 69.9% | 21.3%
```

On cost, the modular programme is cheaper by **A$1,873,869**, about 18% of the bespoke cost. On time, it starts later and finishes earlier. On exposure, it stops lines for a fifth of the days. The rest of the chapter tests each of these claims.

## Where the cost difference comes from

The bespoke cell costs A$860,000: engineering of 700 hours at A$160, A$112,000; equipment, A$520,000, including its builder's assembly; site works, A$60,000; lost contribution over 15 working days, A$120,000; and expected disruption, A$48,000. The modular programme pays A$520,000 once for design and the emulation model, then for each cell A$470,000 of hardware, assembly hours on the learning curve at A$120, A$25,000 of site works, A$24,000 of lost contribution and A$9,600 of expected disruption.

```figure
type: compare
title: The cost difference taken apart, twelve cells
cols: Bespoke | Modular | Modular minus bespoke
caption: This is an illustration, in A$ excluding GST. Making the cells costs the modular option slightly more; installing them costs it far less. The modular assembly total is 13,191 hours on the unit learning curve at A$120.
- Engineering and design | A$1,344,000 | A$520,000 | −A$824,000
- Equipment or hardware | A$6,240,000 | A$5,640,000 | −A$600,000
- Workshop assembly | in equipment price | A$1,582,931 | +A$1,582,931
- * Making the cells, subtotal | A$7,584,000 | A$7,742,931 | +A$158,931
- Site works | A$720,000 | A$300,000 | −A$420,000
- Lost contribution | A$1,440,000 | A$288,000 | −A$1,152,000
- Expected disruption | A$576,000 | A$115,200 | −A$460,800
- * Installing the cells, subtotal | A$2,736,000 | A$703,200 | −A$2,032,800
- Total | A$10,320,000 | A$8,446,131 | −A$1,873,869
```

The table shows something easily missed. Making twelve modular cells costs **A$158,931 more** than making twelve bespoke ones: the saving on engineering and hardware is more than used up by the workshop assembly hours, even with the learning curve. The whole of the saving, and more, comes from installation: **A$2,032,800** less in site works, lost contribution and disruption, because each cell spends three working days on site instead of fifteen.

The two equipment lines are not quite like for like, and the table is laid out to show it. The bespoke price of A$520,000 includes its builder's assembly and commissioning in place; the modular hardware price of A$470,000 buys the same four machines, the guarding and the controls as a repeated order to one specification, including the format-B change-part kit, with assembly priced separately by the hour. Comparing A$520,000 with A$470,000 alone would flatter the modular option by the A$1.58m of assembly it leaves out, which is why the subtotal for making the cells is the fair comparison.

That has two consequences. First, the modular case depends on the installation really taking three days. Chapter 7's error case, a fourth day nobody planned, cost A$11,200 on one cell; if every installation took twice as long, the saving would shrink by about 12 × 3 × A$11,200 = A$403,200. Second, a business that cannot shorten installation, for example because its lines must be rebuilt around each cell, loses most of the modular advantage, however well it designs the module.

## Break-even: how many cells it takes

The modular option pays its A$520,000 of design before the first cell is built, and its first cells carry the most assembly hours. A bespoke programme pays the same A$860,000 for every cell. The two cumulative costs therefore start apart and cross.

```figure
type: line
title: Cumulative programme cost by number of cells
x: Number of cells
y: Cumulative cost, A$m
legend: Bespoke | Modular
ymin: 0
ymax: 11
mark: 4 | break-even
caption: This is an illustration, in A$m excluding GST. Modular starts at A$0.52m for design and the emulation model; it is still dearer after three cells (A$2.61m against A$2.58m) and cheaper from the fourth (A$3.28m against A$3.44m).
- 0 | 0 | 0.52
- 1 | 0.86 | 1.24
- 2 | 1.72 | 1.93
- 3 | 2.58 | 2.61
- 4 | 3.44 | 3.28
- 6 | 5.16 | 4.59
- 8 | 6.88 | 5.89
- 10 | 8.60 | 7.17
- 12 | 10.32 | 8.45
```

After three cells, the modular programme has cost A$2,609,400 against the bespoke A$2,580,000, still A$29,400 more. After four, it has cost **A$3,276,720** against **A$3,440,000**, and it stays cheaper from then on, by an amount that grows with every cell. A programme of three or fewer cells is cheaper bespoke in the case; a programme of four or more is cheaper modular. The break-even is specific to these numbers. A dearer design, a smaller saving on site, or a steeper learning curve each move it, which is why the exercise below tests how far they can move before the conclusion changes.

## Time: an earlier start or an earlier finish

The bespoke programme starts earning sooner. It installs cells in pairs, the first pair in week 22, and by week 52 it has earned **A$332,308** against the modular programme's **A$90,000**, because the modular option spends its first months on the design, the emulation model and the pilot. The modular programme then installs a cell every two or three weeks and finishes in week 68, while the bespoke programme, installing a pair every 14 weeks, finishes in week 92.

```figure
type: compare
title: Benefit earned by each option to three dates
cols: Bespoke | Modular | Modular minus bespoke
caption: This is an illustration at A$3,461.54 a cell-week, excluding GST. Once both programmes are complete, the difference stays fixed at the value of 14 cell-weeks.
- To week 52 | A$332,308 | A$90,000 | −A$242,308
- * To week 104 | A$1,952,308 | A$2,000,769 | +A$48,462
- To week 156 | A$4,112,308 | A$4,160,769 | +A$48,462
```

Over the long run, the timing difference is small. The mean benefit start is week 57 for bespoke and week 55.83 for modular, a difference of 14 cell-weeks across twelve cells, worth 14 × A$3,461.54 = **A$48,462**. That figure is fixed once both programmes are complete, so from week 92 onward the modular programme stays A$48,462 ahead on benefit. On these numbers the choice is decided by cost and risk, not by timing.

The same 14 cell-weeks measure the manual handling each option leaves in place. Counting one line-week for every week a line is still packed by hand, the bespoke programme leaves 684 line-weeks of manual packing before its last cell runs and the modular programme 670. The bespoke programme removes the lifting from its first four lines much sooner, the modular programme from its last four, and over the whole programme the two are almost level. A business that ranked its lines by injury exposure could narrow the gap further in either option by installing the worst lines first.

Discounting would change the picture slightly. The bespoke programme's early benefits are worth a little more in present-value terms than the same dollars later, and the modular programme spends A$520,000 on design before any cell earns. At ordinary discount rates, those effects are tens of thousands of dollars, not the A$1.87m difference in cost. A present-value comparison of the two cash flows, such as the [Benefit–Cost Ratio calculator](/tools/benefit-cost-ratio/) produces from annual benefits, costs and a discount rate, is still worth doing before the decision, because it makes the timing visible to the people approving the money.

## Risk: the spread around the estimates

Both columns of the comparison are estimates made from the inside: each option planned on its own merits. Neither has been tested against how projects like it actually turn out. The snack-food maker has no automation history of its own, so, as in Chapter 6, it borrows the outside view built for a fictional machining firm in *Reference Class Forecasting by the Numbers*. In that firm's records, five automation projects finished at a mean cost ratio of **1.332** (P80 **1.496**), and seven catalogue machines at a mean of **1.020** (P80 **1.046**).

This is an illustration. Each bespoke cell is engineered for its own line, so each is a first-of-a-kind automation project, and its capital cost of A$692,000 is read against the automation class. In the modular option, the design-once work and the pilot, whose capital is A$520,000 + A$470,000 + 1,600 × A$120 + A$25,000 = A$1,207,000, are first of a kind and read against the automation class too. The eleven rollout cells, built to a proved design, are read against the machine class, with capital of **A$6,835,931**. Means can be added across cells, which percentiles cannot, so the comparison uses means.

```figure
type: bars
title: Expected capital outturn using the borrowed classes
unit: A$
max: 11200000
caption: This is an illustration, in A$ excluding GST, using the borrowed mean ratios 1.332 for first-of-a-kind work and 1.020 for rollout cells. Expected growth is A$2,756,928 bespoke and A$537,443 modular.
- Bespoke capital estimate, 12 × A$692,000 | 8304000
- * Bespoke expected outturn, × 1.332 | 11060928
- Modular capital estimate | 8042931
- Modular expected outturn | 8580374 | design and pilot × 1.332, rollout × 1.020
```

On this reading, the bespoke programme's expected capital rises by **A$2,756,928** to A$11,060,928, and the modular programme's by **A$537,443** to A$8,580,374. Adding the costs of time on site, which the ratios do not scale, the expected totals are **A$13,076,928** bespoke and **A$8,983,574** modular, a gap of about A$4.09m, more than twice the gap between the estimates. Even if the bespoke cells grew only half as much, because the same integrator learns something across twelve bespoke projects, the expected gap would still be about A$2.71m.

The cautions of Chapter 6 apply with force. The classes are borrowed and small, and their means are pulled about by single projects. Percentiles for the whole programme cannot be found by adding the cells' P80s, because that assumes every cell goes badly together; [Forecasting by component](/reados/publications/reference-class-forecasting-by-the-numbers/forecasting-by-component/) shows how simulation combines components properly. What survives the cautions is the direction: repetition of a proved design narrows the spread, and twelve first-of-a-kind projects widen it twelve times.

The same discipline applies to schedules. Both options' week numbers are inside-view plans. Uplifting one option's schedule with a reference class and leaving the other at its plan would bias the comparison; either both are adjusted or neither is.

## What the comparison leaves out

The table prices what the case can price. Several effects are left out, and they do not all point the same way.

In the modular option's favour, twelve identical cells share spare parts, training, operating instructions and fault-finding experience. A maintenance technician from site A can work on a cell at site C, a spare gripper fits any cell, and a fault solved once is solved for the fleet. Chapter 10 shows how those benefits depend on keeping the standard, and they are real money over the cells' working life, though the case does not count them.

Against it, repetition also repeats faults. A flaw in the standard design is a flaw in twelve cells, and a defect found in year three, perhaps in a component the supplier later changes, may need twelve retrofits at once. The programme also depends on one integrator and one family of machines: if that supplier fails or withdraws a product, every cell is affected, whereas twelve bespoke cells from several builders would spread that risk. These are **common-mode** risks, and they are the price of the narrow spread that repetition otherwise buys. They are managed rather than avoided: by keeping design documents and software in the business's own hands, by a spares holding sized for the fleet, and by choosing machines with a credible support life.

## When bespoke is the better choice

Modular delivery is not always right, and the case's own numbers show where it fails.

```figure
type: decision
title: Bespoke or modular for a multi-unit programme
question: Does the programme repeat enough of the same thing, and can installation be made short?
caption: This is an illustration of the reasoning, not a rule. The case's break-even of four cells and its 94.0% commonality are specific to its numbers.
- Fewer units than the break-even | bespoke | in the case, three cells or fewer cost less bespoke
- Units differ beyond what settings and change kits absorb | bespoke or a smaller module | variants erode commonality and learning
- Design still changing with the requirement | prove the requirement first | a frozen standard built on a moving target repeats the error
- * Four or more similar units, installation can be made short | modular | the saving comes from time on site, as the cost table shows
- Early benefit outweighs cost | consider bespoke for the first units | bespoke earned A$242,308 more by week 52
```

The first condition is simple arithmetic. The second is where judgement matters: the case's format-B cells fit the module with a change-part kit inside the hardware price, but a line that needed a different robot, a different guarding layout and its own controls would be a variant in all but name, and Chapter 10 shows what variants cost. The third is the trap of standardising too soon: the module captures today's requirement twelve times, so a requirement that is still moving should be settled on a pilot before it is frozen.

## The error: a comparison without the design

This is an illustration. The first draft of the business case compared the options cell by cell. The modular column listed each cell's cost, from A$720,600 for the pilot to A$635,819 for cell 12, and totalled them: **A$7,926,131**. Against the bespoke A$10,320,000, that showed a saving of **A$2,393,869** and a modular programme cheaper from the very first cell, A$720,600 against A$860,000.

The design-once cost was missing: 3,000 engineering hours at A$160, A$480,000, and the A$40,000 emulation model. They sat in a separate engineering budget line and had not been carried into the comparison. The draft overstated the saving by A$520,000, about **27.8%** of the true saving of A$1,873,869.

The reviewer who found it was suspicious of one result: a modular programme cheaper for a single cell. If one standard cell costs less than one bespoke cell, nobody would ever build bespoke, so the cost of making the cell standard had to be somewhere else. Reconciling the comparison's modular total against the programme's cost sheet showed a difference of exactly A$520,000. The correction restored the break-even at the fourth cell, and the business adopted two rules for comparisons: each option's total must reconcile to its own cost sheet, and a result that makes one option better at every scale must be explained before it is believed. The error mattered beyond the headline. A proposal for site C alone, two cells, would have looked A$307,600 cheaper modular on the draft's numbers; on the correct numbers it is A$212,400 dearer.

## Exercise: how much can go wrong before modular loses

The [sensitivity and scenario analysis](/reados/collections/investment-appraisal-and-business-cases/sensitivity-and-scenario-analysis/) chapter defines a **switching value** as the value of one input at which a decision changes. Find two switching values for the twelve-cell comparison, holding everything else at the case's values: the design-once engineering cost, and the hardware price per cell. How robust is the modular choice?

**Worked answer.** The modular saving is A$1,873,869. The design engineering could rise from A$480,000 to A$480,000 + A$1,873,869 = **A$2,353,869** before the saving disappears, which is 2,353,869 ÷ 160 ≈ **14,712 hours**, about 4.9 times the 3,000 hours planned. The saving per cell is A$1,873,869 ÷ 12 = A$156,156, so the hardware price could rise from A$470,000 to **A$626,156**, an increase of **33.2%**, before the options cost the same. Both switching values are far from the estimates, so on cost alone the modular choice is robust. The more fragile assumption is the three-day installation, because the whole saving comes from time on site; a business should test that one hardest, with the evidence of its pilot installation.
