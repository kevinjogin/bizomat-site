---
book: arguments-that-hold
chapterSlug: eliminating-causes-with-evidence
order: 7
title: "Eliminating causes with evidence: hypotheses, diagnostic tests and combined conditions"
description: "How to test several explanations against the same evidence, separate diagnostic evidence from evidence that fits everything, and conclude with a set of conditions, not one convenient cause."
draft: false
---

By this point the depot's investigation has a register of checkable claims, a habit of testing the form of arguments, a sense of what samples and quiet periods can support, a demand for warrants, and a test for relevance. This chapter puts them together. It tests every live explanation against all the evidence at once, separates the evidence that discriminates between explanations from the evidence that fits them all, and reaches a conclusion that is more complicated, and more useful, than any single cause.

The method is old. Investigators have long eliminated hypotheses by finding evidence each one predicts and checking whether it appears. What changes in practice is discipline: writing the hypotheses and evidence down together, and refusing to stop at the first explanation that fits.

## The hypotheses

This is an illustration. After Chapters 1 to 6, the depot has six candidate explanations for the root fractures on C1's pinions:

- **H1, raised steady load** from the extension;
- **H2, soft pinions** from the new supplier's first lot;
- **H3, the new lubricant**;
- **H4, misalignment** from moving the drive base;
- **H5, starting torque peaks** from the larger motor's direct-on-line starts;
- **H6, a manufacturing defect at the root**, such as a sharp or torn fillet.

The investigation does not assume that exactly one of these is true. Chapter 2 introduced the idea that a failure usually needs a set of conditions acting together. The aim is to find which conditions were present and which were needed.

## The evidence

The evidence gathered so far, with two new items:

- **E1.** All three fractures are at the tooth root, and all started at the coupling end of the face.
- **E2.** The failed teeth's flanks show light, even wear, with no scuffing or pitting (Chapter 6).
- **E3.** C1's contact pattern covers about 16 mm of the 40 mm face, at the coupling end; C2's covers the full face (Chapter 5).
- **E4.** Steady transmitted power on C1 is 12.4 kW; full-face Lewis stress is 76.0 MPa against an allowable of 120 MPa (Chapters 1 and 5).
- **E5.** A fourth pinion failed with the 11 kW motor refitted (Chapter 1).
- **E6.** On C2, where only the lubricant changed, vibration has not risen by a worthwhile amount (Chapter 6).
- **E7.** Hardness at tooth mid-height on new-supplier pinions is far below the drawing minimum (below).
- **E8.** The fillet radius at the fracture origin measures within the drawing's tolerance with a profile gauge, and the fillet surface is smooth.
- **E9.** Start-current logs show each start produces about 1.6 times the steady torque for about 3 seconds, six times a day.

### The hardness evidence

The reliability engineer tests five new-supplier pinions from the first lot, the three that failed and two unused ones from stores, at tooth mid-height on sections. For comparison she tests five pinions from the original supplier: two old spares and three removed at earlier routine changes. New supplier: mean **212 HB**, standard deviation 9 HB. Original supplier: mean **296 HB**, standard deviation 7 HB.

Every new-supplier reading is below the drawing minimum of 280 HB, so by the criterion written in advance in Chapter 1, the claim that these pinions are soft is confirmed directly. The comparison with the original supplier adds a measure of how large the gap is. The [two-sample comparison tool](/tools/two-sample-t/) runs Welch's t-test from the two groups' means, standard deviations and sample sizes. It gives a difference of **84 HB**, t = 16.47 with 7.54 degrees of freedom, a two-sided p-value of about 0.0000003, and a 95% confidence interval for the difference of **72.1 to 95.9 HB**. The gap is real and very large: the new supplier's pinions are about 70 to 96 HB softer than the originals.

At its next planned stop, C2's new-supplier pinion is tested too. It measures **218 HB**. It is soft as well, and it has not failed.

```figure
type: bars
title: Hardness at tooth mid-height
unit: HB
max: 320
caption: This is an illustration. Means of five pinions per group, and the single C2 pinion, against the drawing minimum of 280 HB. Difference between the supplier groups from the two-sample comparison tool: 84 HB, 95% interval 72.1 to 95.9 HB.
- Original supplier, five pinions | 296
- Drawing minimum | 280
- *New supplier, three failed and two unused | 212
- New supplier, C2 pinion, not failed | 218
```

## Test every hypothesis against every item

The reliability engineer sets out the evidence against the hypotheses in one table. Each cell records whether the evidence is consistent with the hypothesis, inconsistent with it, or neutral.

```figure
type: compare
title: Hypotheses against evidence
cols: H1 load | H2 soft | H3 lubricant | H4 misalignment | H5 starts | H6 fillet
caption: This is an illustration. C means consistent, X inconsistent, N neutral. E1's root location fits nearly everything; its coupling-end origin and E3 discriminate. E5 and E6 eliminate H1 and H3 as sole causes; E8 eliminates H6.
- E1 root fracture, coupling end | C, end not explained | C, end not explained | X | C, explains end | C, end not explained | C, end not explained
- E2 flanks clean | N | N | X | N | N | N
- E3 contact on 16 mm at coupling end | N | N | N | C | N | N
- E4 full-face stress well under allowable | X as sole cause | N | N | N | N | N
- *E5 failure with 11 kW motor | X as sole cause | C | N | C | C | C
- E6 no rise on C2 | N | N | X | N | N | N
- E7 hardness 212 HB | N | C | N | N | N | N
- E8 fillet within drawing | N | N | N | N | N | X
- E9 starts: 1.6 times torque, 3 s, six a day | N | N | N | N | C, but few cycles | N
```

Reading the table column by column:

- **H1, raised steady load,** is inconsistent as a sole cause with E4, because the full-face stress is well under the allowable, and with E5, because a pinion failed with the original motor refitted. That is a modus tollens: if the raised load were the cause, restoring the old motor would stop the failures; it did not. H1 survives only as a possible contributor.
- **H2, soft pinions,** is consistent with everything and directly confirmed by E7. But it does not explain why the fractures started at the coupling end. A uniformly soft pinion under uniform load would be expected to crack wherever the stress was highest, which in an aligned drive is spread along the face.
- **H3, lubricant,** is inconsistent with E1 (no mechanism for root-end origin), E2 (no surface distress) and E6 (no effect on C2). It is eliminated as a cause of these failures.
- **H4, misalignment,** is consistent with everything and is the only hypothesis that explains the coupling-end origin. E3 confirms the misalignment directly.
- **H5, starts,** is consistent but weak on magnitude. Each tooth sees about 72 load cycles per start, about 435 a day, against about 1.74 million a day in steady running, roughly 0.025% of the cycles. The peaks are higher, but on so few cycles they are unlikely to be the main driver of a fatigue failure that took tens of millions of cycles. H5 survives as a minor contributor.
- **H6, fillet defect,** is inconsistent with E8 and is eliminated.

## Diagnostic and non-diagnostic evidence

The table shows something every investigation should notice: most evidence is consistent with most hypotheses. "The teeth broke at the root" fits nearly every explanation, so on its own it discriminates almost nothing. It was the most discussed fact at the Wednesday meeting, and the least informative.

Evidence is **diagnostic** when it is much more likely under one hypothesis than under another. In the depot's table, the diagnostic items are few: the coupling-end origin, the contact pattern, the hardness readings, the failure with the 11 kW motor, the clean flanks and the C2 trial. Six items did most of the work. A good investigation spends its effort finding diagnostic evidence, by asking what each hypothesis predicts that the others do not, rather than piling up evidence that fits everything.

## Separate the conditions with comparisons

The table shows that both H2 and H4 were present. It does not yet show whether each was needed. For that, the investigation uses contrasts between cases, the methods John Stuart Mill described as agreement and difference. The question is: among cases where some conditions were present and others absent, where did failures occur?

```figure
type: compare
title: Cases that separate soft pinions from misalignment
cols: Pinion | Alignment | Exposure | Outcome
caption: This is an illustration. Only the case with both conditions failed within its exposure. Exposure figures are approximate running hours. Survival over a limited period is weak evidence, as Chapter 4 warned, so the conclusion is stated with that limit.
- C1 after the extension, original pinion | Hard, about 296 HB | Misaligned | About 840 hours | No failure
- *C1, new-supplier pinions | Soft, about 212 HB | Misaligned | About 500 hours each | Four failures
- C2, new-supplier pinion | Soft, 218 HB | Aligned | About 1,400 hours | No failure
- C1 and C2, nine years before | Hard | Aligned | Years | No failures recorded
```

The pattern is clear, and it fits the account of causes in Chapter 2. A soft pinion on an aligned drive, C2, survived about 1,400 hours, nearly three times as long as the soft pinions on misaligned C1 lasted. A hard pinion on misaligned C1 survived about 840 hours, longer than any of the soft ones did. Only the combination of soft material and concentrated load produced failures within the observed exposure. Each condition appears to be a non-redundant part of the set that was sufficient for these failures.

The limits must travel with that conclusion. The hard pinion's 840 hours on a misaligned drive and the soft pinion's 1,400 hours on an aligned one are survival records, not proofs of safety. Chapter 5's screening calculation put the stress on C1's loaded strip at 190 MPa, above the allowable, so a hard pinion on the misaligned drive might well have failed later. The comparison shows which combination failed quickly. It does not show that either condition alone is safe.

## The failure case: stopping at the first confirmed cause

When the hardness results came back, the maintenance supervisor's reaction was understandable: "There it is. The pinions are soft. Fit hard ones and we're done." It was the first explanation to be confirmed by a measurement, and it was true.

It was also incomplete. Soft pinions do not explain why every fracture started at the coupling end. If the depot had fitted hard pinions and left the alignment as it was, the screening calculation suggests the loaded strip would have carried about 190 MPa against an allowable of 120 MPa. The failures would probably have slowed, and the slowdown would have been taken as proof that softness was the whole story, until a hard pinion broke months later and the investigation started again.

### How it is detected and corrected

The detection is the specificity test from Chapter 6: does the confirmed cause explain the details of the evidence, or only that a failure occurred? Softness explained the failure; it did not explain the location. Any unexplained detail is a sign that another condition is involved. The correction is to keep the hypothesis table open until every diagnostic item is explained by some combination of surviving hypotheses.

## The conclusion

The reliability engineer writes the conclusion as a set of conditions with their roles:

- **Present and needed:** pinion hardness well below the drawing (E7), and load concentrated on about 16 mm of the face by misalignment after the base was moved (E1, E3).
- **Present, contributing:** the 13% rise in steady load (E4), and starting peaks on a small fraction of cycles (E9).
- **Not supported:** the lubricant change (E2, E6), and a fillet defect (E8).

The corrective actions follow from the conditions, not from a single cause: hardness-verified pinions with 100% receiving inspection (Chapter 4), realignment of C1 with a full-face contact pattern as the acceptance criterion (Chapter 5), and a soft starter on C1 as a low-cost reduction of starting peaks. The supplier is asked for its corrective action on the furnace loading.

## Keep the table as the record

The hypothesis table is more than a working tool; it is the investigation's record. It shows which explanations were considered, which evidence was gathered and why each explanation was kept or dropped. Many organisations already use a structured problem-solving format such as 8D, and the table fits naturally into its root-cause step: the [chapter on responding to a quality complaint with 8D](/reados/collections/manufacturing-quality/responding-to-a-quality-complaint-with-8d/) describes that wider process.

Two habits keep the table honest. First, record eliminated hypotheses with the evidence that eliminated them, not just the survivors. A reviewer who sees that the lubricant was considered and why it was dropped will not reopen the question, and if new evidence appears, the reason for dropping it can be re-examined. Second, record what evidence would change the conclusion. For the depot, a failure of a hard pinion on the realigned C1, or a failure of a soft pinion on aligned C2, would each mean the conditions identified here were not the whole story. Writing that down in advance makes the conclusion a testable claim, in the sense of Chapter 1, rather than a closed verdict.

## Exercise: weigh the starting peaks

A manager proposes that the starting peaks, not misalignment, are the real problem, because "the peaks are 1.6 times the running torque". Using the figures in E9 and the steady running pattern of 20 hours a day at 1,450 rpm, compare the number of load cycles each tooth sees during starts with the number in steady running, and say what that comparison does and does not show.

**Worked answer.** At 1,450 rpm the pinion turns 24.17 times a second, so each tooth is loaded 24.17 times a second. A 3-second start gives about **72.5 cycles**; six starts a day give about **435 cycles**. Steady running for 20 hours gives 1,450 × 60 × 20 = **1,740,000 cycles** a day. Starts therefore account for about **0.025%** of the daily load cycles.

That shows that starts cannot be the main source of fatigue cycles: a fatigue failure after tens of millions of cycles is driven by the stress in the bulk of those cycles, which is steady running. It does not show that starts are harmless. Their peaks are 1.6 times the steady stress, and on a misaligned, soft pinion the peak stress on the loaded strip is high. They are a contributor worth reducing cheaply, which is why the soft starter is included, but they do not displace misalignment and softness as the conditions that made these failures happen.
