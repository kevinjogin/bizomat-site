---
book: adhesive-bonding-by-the-numbers
chapterSlug: proving-a-bonding-process
order: 11
title: "Proving a bonding process"
description: "Planning and running a fair trial of a process change under production conditions, setting up a bonding bay and its records, and counting the cost of bonding against what it replaced."
draft: false
---

By the end of the trials, Plant K knew what had gone wrong with its first bonded doors: a solvent wipe that smeared oil, cold stock wet with condensation, square stiffener ends that peeled, a brittle adhesive tried as a remedy, a rigid bond on a window that needed to move, an ageing test aimed at the wrong mechanism and a low coupon explained away. Each had a fix. What remained was to prove that the fixed process worked, in production, with production people, and to set it up so it would keep working.

This chapter runs the trial that compared the old surface preparation with the new, shows how an unfair trial nearly overstated the improvement, sets out the bonding bay and its records, and counts what bonding costs and saves against the studs it replaced.

## The change to be proved

Chapters 9 and 10 showed that abrasion with a non-woven pad and an isopropanol wipe gave a process that was not capable against the 15 MPa minimum, with a Cpk of 0.872, and not durable, keeping only 64% of its strength after hot, humid ageing with interfacial failure at the overlap edges. The candidate replacement was a light grit blast of the bond zones with fine aluminium oxide in a small cabinet, followed by a silane primer applied with a lint-free wipe and allowed to dry for the time the supplier specified.

The question for the trial was simple: does the new preparation give stronger coupons, and by how much?

## Planning the trial

The [process change trial tool](/tools/process-change-trial/) plans and evaluates a before-and-after comparison. For planning, it gives the number of parts needed in each group to detect the smallest difference worth detecting at a chosen significance level and power, from an expected standard deviation. For evaluation, it runs Welch's two-sample t-test on the two groups' means, standard deviations and sizes, gives the p-value and a confidence interval for the difference, and decides whether the change is an improvement, makes no proven difference or made things worse, with checks of the sample size and of whether the change is large enough to matter.

The engineer set the smallest worthwhile improvement at 2 MPa in mean lap shear strength, expected a standard deviation of about 2.5 MPa, and chose a significance level of 0.05 and 80% power, with higher values better. The tool gave **25 coupons per group**.

## The error: a trial in the lab

The first trial was quick. The old preparation's 25 coupons came from production records: five per shift, made by the operators over five shifts. The new preparation's 25 coupons were made by the engineer in the laboratory over two afternoons, using a new grit cabinet, fresh primer and a cartridge opened for the purpose.

The result looked excellent: a mean of 26.8 MPa with a standard deviation of 1.6 MPa against 21.8 MPa and 2.6 MPa, an improvement of 5.0 MPa with a 95% confidence interval from 3.8 to 6.2 MPa. The tool's verdict was improvement confirmed.

The engineer then noticed what the comparison really measured. The new coupons differed from the old in more than the preparation. They were made by a careful engineer instead of busy operators, on a quiet afternoon instead of a production shift, from one fresh cartridge instead of many, in a laboratory instead of a bonding bay beside a press. Each of those differences could raise the mean and lower the scatter. The trial compared a new preparation in ideal conditions with an old one in real conditions, and could not separate the two.

```figure
type: compare
title: Two trials of the new surface preparation
rowhead: Trial
cols: New preparation, mean and SD | Improvement over the old 21.8 MPa | 95% confidence interval
caption: This is an illustration. From the process change trial tool, 25 coupons per group, old preparation from production shifts. The laboratory trial overstated the improvement by about 60%, because it also compared a careful engineer with production conditions.
- Laboratory, made by the engineer | 26.8 and 1.6 MPa | 5.0 MPa | 3.8 to 6.2 MPa
- * Production, interleaved with the old preparation | 24.9 and 1.9 MPa | 3.1 MPa | 1.8 to 4.4 MPa
```

The trial was repeated in production. For five shifts, the operators prepared coupons by both methods in alternating pairs, from the same cartridges and the same stock, so that the only systematic difference between the groups was the preparation. The new preparation gave 24.9 MPa with a standard deviation of 1.9 MPa. The tool reported an improvement of 3.1 MPa, a t statistic of 4.81 on about 44 degrees of freedom, a p-value of about 0.00002 and a 95% confidence interval from 1.8 to 4.4 MPa: improvement confirmed, with the sample size and the practical size both met.

The improvement was real, but it was about 60% of what the laboratory trial claimed. A plan or a business case built on 5 MPa would have expected more than the process could give. The lesson is general: a trial of a process change is fair only if everything except the change is the same in both groups, and the surest way to arrange that is to run both methods side by side, interleaved, in the conditions where the process will be used.

```figure
type: checklist
title: Making a process change trial fair
caption: Every item removes a difference between the groups other than the change being tested. Interleaving the two methods in time is the most powerful single step.
- x Same people | the operators who will run the process, not the engineer
- x Same place and conditions | the production bay, not the laboratory
- x Same materials | the same stock and adhesive batches for both groups
- x Interleaved in time | alternate the methods, so drifts affect both alike
- x Planned size | the number of coupons from the planning step, decided before the results
- x Analysis fixed in advance | primary comparison and acceptance decided before testing
```

### Durability and capability after the change

Strength on the day is only half of the case. The new preparation also kept 88% of its strength after hot, humid ageing with cohesive failures, against the old one's 64% with interfacial failures, and its wedge test cracks grew 6 mm instead of 18 mm, as Chapter 9 showed. A capability run of 30 production coupons gave a mean of 24.9 MPa and a standard deviation of 1.9 MPa, a sample Cpk of 1.737 and, from the capability confidence check, a lower 95% bound of 1.349 against the required 1.33. The process was approved, and the plant's rule is to repeat the capability run whenever the adhesive batch supplier, the grit or the primer changes.

### Reading the interval, not just the verdict

The confidence interval says more than "improvement confirmed". The production trial's interval, 1.8 to 4.4 MPa, means the data are consistent with an improvement as small as 1.8 MPa, slightly below the 2 MPa the plant set as worthwhile, or as large as 4.4. The best single estimate is 3.1. For a decision that depends on the size of the gain, such as whether a grit cabinet pays for itself in fewer rejected coupons, the lower end of the interval is the cautious figure to plan with.

The interval also shows why the laboratory trial misled. Its interval, 3.8 to 6.2 MPa, did not even overlap the production result's best estimate of 3.1. Two trials of the same preparation gave incompatible answers, which is the signature of a difference between the trials themselves rather than chance.

### The window process

The window process was proved differently, because its risk was movement rather than strength. Plant K built a test door with three windows bonded by the production operators, mounted it facing north outside the workshop through a summer, and logged its surface temperature. The hottest reading was 78 °C, above the 70 °C design figure but within the bondline's margin, as Chapter 8 suggested a dark door could be. At the end of the summer the windows had no cracks, and pulling one out with a wire cutter showed a continuous bead of the right thickness with cohesive failure throughout. Production windows bonded since have been checked at final inspection for bead continuity at the corners.

## Training and sign-off

A proved process is only as good as the people running it. Plant K trained each bonding operator on the reasons for every step, using the failed coupons, the peeled stiffener and the cracked window from the trials as teaching pieces, because an operator who knows why a cartridge is purged is far less likely to skip it. Each operator then made a set of ten coupons on their own, which had to pass the strength minimum with cohesive failures before they bonded production doors. Operators repeat a sign-off set once a year and after any absence of more than a month.

The engineer also wrote down the reasons behind the procedure's limits in a short note kept with it: why the two-hour window, why the 3 K dew point margin, why the purge length, why the end rivets. Procedures without reasons tend to be "simplified" by the next person to take them over, often by removing the steps whose purpose has been forgotten.

## Setting up the bonding bay

A process proved in trials stays proved only if the bay is set up to repeat it. Plant K's bonding bay was rearranged around the sequence of the earlier chapters.

```figure
type: steps
title: The flow through Plant K's bonding bay
caption: This is an illustration. Each station corresponds to a chapter, and each has a check recorded against the door number.
- Acclimatise | skins and stiffeners racked inside overnight, part temperature checked against the dew point, Chapter 4
- Degrease and blast | solvent wipe, then grit blast of bond zones only, Chapter 4
- Prime | silane primer wiped on, dried for the supplier's time, water drop check on a sample, Chapters 2 and 4
- Bond | cartridge purged, bead applied, stiffeners placed with fillets kept, end rivets set, Chapters 5 and 7
- Fixture | held at 20 °C or above until handling strength, about 5 hours at 20 °C, Chapter 5
- Oven | passes through the powder-coat oven cure, which completes the epoxy's cure, Chapter 5
- Inspect | fillets and corners checked, stiffeners tap-tested, Chapter 10
```

At 40 doors a week, eight a day, and with each fixture held for about 5 hours at 20 °C, a fixture can be used about once and a half per shift. The plant found that four fixtures kept the line moving with a margin for the slower winter cure. The window bonding, with its moisture-curing adhesive, takes place in a separate bay where doors rest on a rack with locating blocks until the bead has skinned over.

### Records

Every door carries a traveller card that records: the date and shift, the stock batch, the part temperature and dew point at preparation, the primer batch and drying time, the adhesive cartridge batch, the bay temperature, the time on the fixture, the oven cycle, the inspection results and the coupon set made beside it. The record costs a minute a door. Its value was shown the one time it was needed, when the low coupon of Chapter 10 led within an hour to the two doors bonded from the same cartridge.

## What bonding costs and saves

The plant's case for bonding in Chapter 1 counted only the removal of stud marks. The proven process costs more than that early estimate, because of the grit blast, the primer, the rivets and the testing. It is still clearly cheaper than the studs.

```figure
type: compare
title: Cost per door of studs against the proven bonding process
rowhead: Item
cols: Welded studs | Bonded, as proved
caption: This is an illustration. Labour at A$78 an hour excluding GST. Bonding labour covers preparation, blasting and priming, dispensing and placing, and twelve end rivets. Testing adds about A$170 a week across 40 doors.
- Labour | 86.4 min, A$112.32 | 34 min, A$44.20
- Materials | studs and nuts, small | adhesive, rivets, primer and nozzle, A$13.10
- * Total per door | A$112.32 plus studs | A$57.30
- Per week at 40 doors, after testing costs | baseline | about A$2,030 lower
```

The saving of about A$55 a door, a little over A$2,000 a week after testing, is smaller than the early estimate suggested, because the early estimate left out the work that makes a bond reliable. It is also the saving from a process that has been proved capable and durable, rather than one that looked cheap until its first drop test.

## What the proof does not cover

The plant's engineer ended the qualification report with a short list of what had not been proved. The ageing tests compared preparations over 1,000 hours; they did not show that a bonded door would last twenty years at a coastal site, and a set of coupons was placed on the roof of the workshop for testing at one, three and five years. The drop test covered one drop height and one orientation, not every way a door is handled on a truck. The window test covered one summer on one test door. None of these gaps was a reason to stop; each was a reason to keep watching, and to treat the first field returns of bonded doors as data rather than as complaints.

Writing down what a proof does not cover keeps the next decision honest. When a customer later asked for a kiosk in a hotter inland climate, the list showed at once that the window bondline's margin, not the stiffeners, was the property to check again.

## How this applies to a small Australian business

Prove a bonding process with a fair trial: plan its size, run both methods side by side in production, interleaved, and fix the analysis in advance. Check strength, durability and capability, not just one of them. Set up the bonding area so that each step of the proved process happens the same way every time, with a simple record against each part. And count the full cost of a reliable process, including preparation and testing, when comparing it with the method it replaces.

## Exercise: a cheaper primer

A supplier offers a cheaper primer. The plant runs 25 coupons with it, interleaved in production with 25 using the current primer. The current primer gives 24.9 MPa with a standard deviation of 1.9 MPa; the cheaper one gives 24.1 MPa with 2.2 MPa. (a) Using Welch's t-test, is the difference significant at 0.05? (b) Is the cheaper primer proven to be as good? (c) What else is needed before switching?

**Worked answer.** (a) The difference is 0.8 MPa. Its standard error is √(1.9² ÷ 25 + 2.2² ÷ 25) = 0.581 MPa, so t = 0.8 ÷ 0.581 = **1.38**, with about 47 degrees of freedom: a two-sided p-value of about 0.17, **not significant**. (b) **No.** A non-significant difference is not proof of equivalence: the 95% confidence interval for the difference runs from about −0.37 to 1.97 MPa, which includes a loss close to the 2 MPa the plant regards as worth detecting. Proving the primers equivalent needs a larger trial designed for that purpose. (c) Durability is the primer's main job, so wedge tests and hot, humid ageing with retained strength and failure surfaces are needed before any switch, and a fresh capability run afterwards.
