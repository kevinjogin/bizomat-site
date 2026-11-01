---
book: eddy-current-inspection-by-the-numbers
chapterSlug: sorting-steel-parts
order: 7
title: "Sorting steel parts by permeability and hardness"
description: "Comparator sorting of steel parts with an encircling coil, separating hardened from unhardened shafts, what overlapping populations do to a threshold, and a new bar supplier's shifted signals."
draft: false
---

In steel, permeability is usually the eddy-current inspector's enemy, a source of noise that masks cracks. In sorting, it becomes the signal. A steel's magnetic permeability and its conductivity both depend on its microstructure: hardened martensite is magnetically harder, with lower permeability, than the soft ferrite and pearlite of unhardened steel. Pass a shaft through a coil, compare its response with a known good shaft in a second coil, and a shaft whose journals missed hardening stands out at once. The test takes a second, touches nothing and can run on every shaft.

This chapter sets up the PH-6 shafts' comparator sort, shows why it separates hardened from unhardened shafts almost perfectly but cannot reliably sort shafts by case depth, and follows a change of bar supplier that made the sort reject almost a third of good shafts.

## The comparator bridge

The sorting station has two identical encircling coils connected in a bridge. A reference shaft, known to be correctly hardened, sits permanently in one coil. Each production shaft passes through the other, positioned so that the coil surrounds a hardened journal. If the test shaft responds exactly as the reference does, the bridge stays balanced; any difference in permeability, conductivity, diameter or position unbalances it, and the instrument displays the difference as a voltage.

The frequency is low, 1 kHz, so that the currents reach well into the hardened case. With the assumed hardened-steel properties of Chapter 2, the standard depth at 1 kHz is about 0.8 mm, and three standard depths reach 2.5 mm, just beyond the journals' 2 mm case. At that depth, the coil responds to the case and to the softer steel beneath it, so a shaft with no case, or a much shallower one, looks clearly different from the reference.

Diameter matters too. An encircling coil's response depends strongly on how much of its area the part fills, so the sort works only on shafts of the same ground diameter, and a shaft not yet ground, a few tenths of a millimetre larger, would read differently for that reason alone. The station sits after the grinder.

## Why hardened steel reads differently

Hardening by quenching turns the steel's surface layer into martensite, a strained structure with carbon trapped in solution and a very high density of dislocations. Both features obstruct the movement of magnetic domain walls, so martensite is magnetically harder than the soft ferrite and pearlite of the unhardened core: its permeability at the weak fields of an eddy-current coil is lower. The trapped carbon and the dislocations also scatter electrons, so its resistivity is higher, by the same reasoning as Matthiessen's rule in Chapter 3. Lower permeability and higher resistivity both change the coil's response, and together they make a hardened case look quite different from soft steel. Tempering relaxes the structure partly, so a tempered case lies between the two, and the comparator responds to tempering temperature as well as to hardening. The pump maker's shafts are all tempered at the same temperature, so that effect is constant.

## A measure of separation

A quick way to judge whether two groups can be sorted is to divide the difference between their means by their pooled standard deviation, the square root of the average of the two variances. For hardened against unhardened shafts, that is 1.30 ÷ 0.102 = 12.7. For hardened against short-case shafts, it is 0.35 ÷ 0.091 = 3.9. A threshold midway between two groups sits half that index from each mean in standard deviation units, so an index of 12.7 puts the threshold more than six standard deviations from each group and an index of 3.9 puts it under two. As a working rule, an index above about 10 sorts essentially without error; below about 6, a sort will make errors at rates that need counting; below about 3, it is barely better than a coin toss for parts near the middle. For the new supplier's hardened shafts against the original short-case group, the index is only 1.9.

## Running the station

The sorting station's set-up is short but must be done exactly. At the start of each shift, the operator balances the bridge with the supplier's verified reference shaft in the reference coil and nothing in the test coil, then passes two masters through the test coil: a good master, a verified hardened shaft from the same supplier, which must read within 0.15 V of that supplier's commissioning mean, and a fail master, a deliberately unhardened shaft, which must trip the alarm. If either check fails, nothing is sorted until the cause is found.

Temperature matters here as it does for conductivity. Shafts arriving from the grinder are warm from the coolant, and a shaft 10 K warmer than the reference reads differently because both its permeability and its resistivity change with temperature. The station's conveyor holds shafts for ten minutes so that they reach room temperature, and the reference shaft lives beside the coil, not on a cold shelf.

Every output is logged with the shaft's serial number. The log is how the supplier problem was quantified so quickly: the shift's readings for the new bar were already there, and a glance at their mean and spread showed that the whole population had moved, not that a few shafts were bad.

## Two populations and a threshold

During commissioning, the quality engineer passed 40 correctly hardened shafts and 40 shafts deliberately left unhardened through the bridge, recording the instrument's output for each.

```figure
type: compare
title: Comparator output for three groups of shafts
cols: Mean | Standard deviation | What it is
rowhead: Group
- Correctly hardened | 2.40 V | 0.08 V | Journals hardened to the 2 mm case
- * Unhardened | 1.10 V | 0.12 V | Induction step missed; journals soft
- Short case | 2.05 V | 0.10 V | Case about half the specified depth, from a trial with reduced power
caption: This is an illustration. The output is the bridge's unbalance voltage relative to its balance with no shaft in the test coil, so the reference shaft's own reading is near the hardened mean. Commissioning data from 40 shafts in each of the first two groups and 20 in the third.
```

The hardened and unhardened groups are far apart. A threshold placed where it is the same number of standard deviations from each mean, at (2.40 × 0.12 + 1.10 × 0.08) ÷ (0.08 + 0.12) = 1.88 V, sits 6.5 standard deviations from both. If the outputs are normally distributed, the chance of a hardened shaft reading below it, or an unhardened one above, is about 4 × 10⁻¹¹. For finding shafts that missed the induction step altogether, the comparator is as close to certain as an inspection gets.

The short-case group is a different matter. Its mean, 2.05 V, lies only 0.35 V below the hardened mean, and the two groups' spreads overlap. Any threshold between them trades one error against the other.

```figure
type: compare
title: Errors with a threshold of 2.20 V between hardened and short-case shafts
cols: Rule | Share wrongly classified
rowhead: Error
- Good shafts rejected | Hardened shaft reads below 2.20 V | 0.62%
- * Short-case shafts accepted | Short-case shaft reads above 2.20 V | 6.68%
caption: This is an illustration. Normal distributions with the commissioning means and standard deviations. The threshold is 2.5 standard deviations below the hardened mean and 1.5 above the short-case mean.
```

A threshold of 2.20 V rejects 0.62% of good shafts and lets through 6.68% of short-case shafts. Moving it up catches more short cases but rejects more good shafts. When commissioning, the pump maker accepted 2.20 V as a coarse screen for short cases, while the real control of case depth remained the induction machine's own monitoring and a sectioned shaft each shift, as [Induction Hardening by the Numbers](/reados/publications/induction-hardening-by-the-numbers/) describes. That decision was about to be tested.

## The mistake: a new bar supplier

When the pump maker added a second supplier of 42CrMo4 bar, the first week's shafts from the new bar were rejected by the comparator at an alarming rate: 23 of the first 80. The induction machine's records showed normal power, energy and scan speed for every shaft.

The quality engineer took the obvious step first: a rejected shaft was sectioned through a journal and given a Vickers hardness test at 10 kgf. The diagonals measured 0.181 and 0.183 mm. The [Vickers test check tool](/tools/vickers-test-check/) gave 560 HV10, with every validity check passing and the result inside the 520 to 620 HV10 specification for the case. A hardness traverse put the effective case depth at 2.1 mm. The shaft was correctly hardened.

So the comparator was reading the new bar differently. Forty hardened shafts from each supplier were passed through the bridge.

```figure
type: compare
title: Comparator output for hardened shafts from the two bar suppliers, 40 shafts each
cols: Mean | Standard deviation | Below the 2.20 V threshold
rowhead: Supplier
- Original | 2.40 V | 0.08 V | 0.62%
- * New | 2.27 V | 0.13 V | 29.5%
caption: This is an illustration. All 80 shafts hardened in the same machine with the same program, and a sample from each sectioned and confirmed.
```

The [two-sample comparison tool](/tools/two-sample-t/) confirmed the shift: a difference in means of 0.13 V, a Welch t statistic of 5.39 on 64.8 degrees of freedom, a p-value of about one in a million and a 95% confidence interval for the difference of 0.082 to 0.178 V. The [two-variance F test tool](/tools/two-variance-f-test/) showed that the spreads differed too: a variance ratio of 0.3787 against critical values of 0.5289 and 1.8907, a p-value of 0.0031, and a ratio of standard deviations, original to new, of 0.6154 with a 95% interval of 0.4475 to 0.8462. The new bar's shafts read lower and scattered more.

The cause lay in the steel, not the hardening. Both suppliers' bar met the 42CrMo4 composition range, but within it they differed: the new bar sat towards the high end for manganese and chromium and the low end for carbon. The permeability and conductivity of the hardened case, and of the core beneath it, depend on composition as well as structure, and the comparator, balanced against a reference shaft made from the original bar, read the difference as a lower signal. The larger spread suggested more heat-to-heat variation in the new supplier's bar, which went to the supplier as a question.

### What the pump maker changed

```figure
type: decision
title: How to sort when the material moves the signal
caption: This is an illustration. The first two rows were adopted.
- The comparator's real job | Catch shafts that missed hardening, which differ by about 1.2 V from hardened shafts whatever the bar | Kept on every shaft, with the threshold at the midpoint for each bar supplier's reference
- Case depth control | The induction machine's monitoring of power, energy and scan speed on every shaft, and a sectioned shaft each shift | Made the primary control; the 2.20 V short-case screen withdrawn
- A reference shaft per supplier | Balance the bridge on a verified shaft from the same supplier as the batch | Adopted; reference shafts sectioned to confirm, then kept as standards
- A single fixed threshold for all bar | Rejects good shafts from one supplier or accepts short cases from the other | Abandoned
```

The comparator went back to the job it does superbly: finding shafts that missed the induction step altogether. For each supplier, the bridge is balanced on that supplier's verified reference shaft, and the threshold is set midway between that supplier's hardened and unhardened means, measured when the supplier was approved. The short-case screen at 2.20 V was withdrawn, because no single threshold can sort two overlapping populations whose position moves with the bar.

## What sorting can and cannot do

The commissioning data and the supplier change point to the general rules for eddy-current sorting.

Sorting works when the conditions differ greatly in their magnetic and electrical properties and little within each condition: hardened against unhardened, one alloy against a very different one, annealed against hard-drawn wire. It fails when the difference sought is small compared with the variation from other causes: small differences in case depth, small differences in hardness, or any difference smaller than the variation between heats of the same steel.

Every sorting threshold depends on the populations it was set on. A new supplier, a new heat treatment furnace or a new grinding process can move the populations, and a threshold that was safe can begin rejecting good parts or, worse, accepting bad ones. The defence is a verified reference from the current material and a periodic check of the populations against it.

## Other sorting jobs

The same station, with a different coil and reference, handles the pump maker's other sorting tasks, and each follows the rules above.

**Mixed bar in the rack.** When a length of steel bar loses its colour code, a comparator with references of the candidate grades can show which one it most resembles. It can separate grades with very different composition or condition, such as a plain carbon steel from an alloy steel in the same heat-treated state, but it cannot certify a grade; a doubtful bar goes for chemical analysis.

**Heat treatment of small parts.** Bushes and pins that should have been through-hardened are sorted from any that missed the furnace, in the same way as the shafts' journals, because hardened and soft parts differ greatly.

**Bought-in fasteners.** Bolts of a high property class and a lower one look alike. A comparator balanced on verified bolts of each class can flag a mixed bag, but bolts from different makers differ in composition, as the bar suppliers did, so a reference from the same maker and batch is essential, and a suspect bolt is confirmed by a hardness test.

In every case the comparator is a fast screen that separates large differences reliably. The decision on a doubtful part rests on a direct test of the property that matters.

## Exercise: one threshold for both suppliers

Before the change, a planner proposed a single compromise threshold of 2.15 V for both suppliers' shafts. Using normal distributions, what share of the new supplier's correctly hardened shafts (mean 2.27 V, standard deviation 0.13 V) would it reject, and what share of short-case shafts (mean 2.05 V, standard deviation 0.10 V) would it accept? Is it a workable compromise?

### Answer

For the new supplier's hardened shafts, z = (2.15 − 2.27) ÷ 0.13 = −0.92, and the share below the threshold is Φ(−0.92) = 17.8%: nearly one good shaft in five rejected.

For short-case shafts, z = (2.15 − 2.05) ÷ 0.10 = 1.0, and the share above the threshold is 1 − Φ(1.0) = 15.9%: about one in six accepted.

It is not workable. It rejects far more good shafts than the original 0.62% and catches short cases less well than the original threshold, which let 6.68% through. When two populations overlap this much, moving a threshold only exchanges one error for another; the remedy is a different control for case depth, as the pump maker adopted, not a better threshold.
