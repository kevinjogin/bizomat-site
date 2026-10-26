---
book: sheet-metal-joints-by-the-numbers
chapterSlug: testing-joints
order: 9
title: "Testing joints"
description: "Test sheet joints with coupons and product tests, decide specimen numbers and pass criteria first, read the spread and failure modes, and catch a low result hidden in an average."
draft: false
---

Every strength figure in this book so far has been either a maker's rating or a calculation with simplified properties. Both are starting points. A joint made with a particular rivet, in a particular sheet, with a particular tool and operator, has a strength that only a test can give, and a product made of hundreds of joints has behaviour that only a product test can show. Testing sheet joints is quick and cheap compared with the cost of a joint that fails in service, and the results, read properly, say not only how strong a joint is but how consistent it is and how it fails.

This chapter covers the coupon tests used for sheet joints, the product-level tests that check joints together, how many specimens to test and what to record, and how to read a set of results. The statistics are kept simple here; *Testing Welded Joints by the Numbers* treats specimen numbers and variation more fully. The running case tests EN-700's redesigned bracket joint and finds that one specimen's low result, hidden in an average that passed, pointed to a drilling error that would have reached production.

## Coupon tests

A **coupon** is a small, standard specimen that reproduces one joint, made with production materials, fasteners and tooling.

- **Lap-shear test**: two strips overlapped and joined by one or more fasteners, pulled apart in line, loading the joint in shear. It measures the joint's shear strength and shows its failure mode.
- **Cross-tension or peel test**: two strips joined at right angles or in a T, pulled apart so that the fastener is loaded in tension. It measures pull-out and pull-through.
- **Push-out and torque-out tests** for self-clinching fasteners and rivet nuts: the fastener pushed or twisted out of its sheet with a gauge, as its maker's ratings describe.
- **Seam coupon**: a strip cut across a folded seam and pulled apart, as Chapter 7 described.

```figure
type: compare
title: Coupon tests for EN-700's joints
cols: Loads the joint in | Measures | Used for
caption: This is an illustration of a test plan. Methods for each test are set by the relevant standards, the fastener maker or the product's own specification.
- *Lap-shear, one rivet | Shear | Strength and failure mode | Bracket and hinge rivets
- Cross-tension | Tension | Pull-out and pull-through | Bracket rivets under prying
- Lap-shear, one clinch | Shear | Strength, compared with tool maker's data | Body seams
- Push-out and torque-out | Axial force, torque | Fastener's hold in the sheet | Self-clinching nuts and earth stud
- Seam coupon | Tension across seam | Strength per metre | Rain hood seam
```

## Failure mode is a result

A coupon's failure load is only half its result; the other half is **how** it failed. A lap-shear coupon of EN-700's bracket rivet that fails by the rivet shearing, with the sheets' holes undamaged, confirms that the rivet governs, as Chapter 2's redesign intended. One that fails by the sheet tearing out, or the hole elongating, says that the sheet governs, which means either the design check was wrong or the coupon was not made as designed. Every test record should note the failure mode alongside the load, and a change in failure mode between specimens is often more informative than the loads themselves.

## Coupons that represent production

A coupon is only useful if it is made the way production joints are made. That means the same sheet, from the same supplier and coating, not an offcut of a different thickness; the same fastener from the same batch; the same hole-making method, punched or drilled, with or without a jig; the same tool, nose-piece and setting force; and an operator who sets production joints. A coupon made carefully in the toolroom by the most skilled person in the shop tests what that person can do, not what the line does. EN-700's coupons are made at the production bench, from the production bins, by whoever is on the shift.

## Decide the pass criterion first

The pass criterion should be written before the test, not chosen after seeing the results. For EN-700's bracket coupons, it was: every specimen at or above the rivet's rated 2,400 N, every specimen failing by rivet shear, and the set's mean less three standard deviations not more than a few per cent below the rated value. Written that way, the first set failed on two counts, a specimen below 2,400 N and a specimen failing by tear-out, however the mean looked. A criterion written after the results tends to be written around them.

## The running case: the bracket coupons

This is an illustration. After the redesign of Chapter 2, five lap-shear coupons were made of the bracket joint: a 2.0 mm strip and a 1.2 mm strip, joined by one 4.8 mm steel blind rivet, with edge distances of 10 mm in each strip. Their failure loads were 2,520, 2,610, 1,980, 2,575 and 2,540 N.

The mean of the five is **2,445 N**, above the rivet's rated 2,400 N, and the first reading of the results was a pass.

## The error: a low result in a passing average

This is an illustration. The test record also had a failure-mode column. Four coupons failed by rivet shear, as expected. The third, at 1,980 N, failed by **tear-out** in the 1.2 mm strip. Measuring that coupon found its hole drilled 6.8 mm from the strip's end instead of 10 mm. Chapter 2's formula predicts a tear-out strength of 2 × (6.8 − 2.45) × 1.2 × 192 = about **2,005 N** at that edge distance, close to the 1,980 N measured.

```figure
type: bars
title: Failure loads of five bracket coupons
unit: N
max: 2800
caption: This is an illustration. Four coupons failed by rivet shear; the third failed by tear-out at a short edge distance. The mean of 2,445 N hides it.
- Coupon 1, rivet shear | 2520
- Coupon 2, rivet shear | 2610
- *Coupon 3, tear-out at 6.8 mm | 1980
- Coupon 4, rivet shear | 2575
- Coupon 5, rivet shear | 2540
```

The coupon had been drilled by hand from a marked line, as the production back walls then were. If coupons drilled that way could land 3 mm off, so could production holes. The fix was a drilling jig for the back wall's holes, aligned from the bracket as Chapter 4 described, and a repeat set of five coupons made with the jig, all of which failed by rivet shear. The lesson is that the mean alone says little. The individual results and their failure modes found the fault, and the average would have passed it straight into production.

## Spread and a lower bound

The variability of a set of results matters as much as their average, because the weakest joint in a product, not the average one, is where failure starts. A simple measure of variability is the **standard deviation**. A common, simple way to express a result conservatively is the mean less a multiple of the standard deviation; design standards and test specifications set the multiple and the statistical method for their own purposes.

This is an illustration. The four rivet-shear results alone, 2,520, 2,610, 2,575 and 2,540 N, have a mean of about 2,561 N and a small spread. All five together, including the tear-out, have a mean of 2,445 N and a standard deviation of about **262 N**, so the mean less three standard deviations is only about **1,658 N**. The single low specimen pulls the lower bound far below the rated value, which is the statistical way of saying what the failure mode already said: something in the process produced a weak joint.

```figure
type: compare
title: Bracket coupon results summarised
cols: Mean | Standard deviation | Mean less three SD
caption: This is an illustration. The second set, made with a drilling jig, is consistent and all specimens failed by rivet shear.
- First five, including the tear-out | 2,445 N | 262 N | 1,658 N
- *Five made with the drilling jig | 2,545 N | 50 N | 2,395 N
```

The repeat set with the jig, in this illustration 2,520, 2,610, 2,480, 2,575 and 2,540 N, has a mean of **2,545 N**, a standard deviation of **50 N** and a lower bound of about **2,395 N**, close to the rated 2,400 N, with every specimen failing by rivet shear.

## Destructive and non-destructive checks

Coupon tests are destructive: the specimen is broken to learn its strength. Production joints cannot be tested that way, so production relies on non-destructive checks that correlate with strength, backed by periodic destructive tests that confirm the correlation. For EN-700, the non-destructive checks are the visual inspection of rivet heads and mandrel breaks of Chapter 3, the clinch bottom-thickness measurement of Chapter 5, the hinge rattle check, a torque audit on a sample of the equipment plate's screws and the push test along the rain-hood seam. The destructive checks are the coupons, and occasionally a **section** through a clinch or a set rivet, cut, polished and examined to see the interlock or the blind head's shape. A section shows what no outside check can, and one every few weeks keeps the non-destructive checks honest.

## How many specimens

More specimens give a more reliable estimate of both mean and spread, at more cost. Five is a common minimum for a development check of a simple joint; production checks often test one or a few coupons per shift or per batch, as Chapter 5's clinching routine did; qualification of a joint for a demanding duty may need many more, set by the applicable standard or the customer's specification. The important rule is that every specimen is reported, with its failure mode, and none is discarded as an "outlier" without finding out why it was different.

## Product tests

Coupons test one joint at a time. Product tests check the joints together, in the product's real geometry, under the loads and environment it will see:

- **Vibration and shock** tests for joints that carry loads in transport, such as EN-700's brackets;
- **Water spray or immersion** tests for sealed seams and gasketed plates;
- **Cycle tests** for hinges, latches and removable covers;
- **Salt-spray or field exposure** for mixed-metal joints, as Chapter 8's hinge showed, though accelerated tests rank coatings and joints more reliably than they predict service life.

Each test should state what it checks, the conditions, the pass criterion and what is inspected afterwards. EN-700's vibration test, for example, checks the brackets, the plate's screws and the seams, and afterwards inspects every bracket rivet hole for elongation, the screws' torque-stripes for movement and the seams for gaps.

## Reading accelerated tests

Accelerated tests, such as continuous salt spray or rapid vibration at high amplitude, compress months of service into hours. They are good at **ranking**: showing that one joint detail resists corrosion better than another, or that a bracket survives a vibration profile that a weaker one does not. They are poor at **predicting** life, because the mechanisms at work in the test do not scale simply to the real environment's cycles of wetting, drying and temperature. EN-700's salt-spray test of its first spot-welded seams in Chapter 1 correctly ranked them as worse than clinched seams; it did not say how many years either would last on a particular site. Field exposure, and the inspection record of Chapter 8, answer that question slowly and honestly.

## When to retest

A tested joint stays tested only while nothing about it changes. EN-700's joint schedule lists the triggers for a retest: a change of fastener part or supplier; a change of sheet thickness, grade, coating or supplier; a new tool, nose-piece, die or punch; a change of hole-making method; a new operator on a joint that depends on skill; and any field failure or customer complaint involving the joint. Chapter 5's clinching error, a thickness change without a die change, would have been caught by the second trigger even without the shift check, because the change of roof sheet would have required a coupon before production.

## Records

A joint test is worth little if its record cannot be found or understood later. EN-700's test records give the joint, the drawing revision, the materials and their certificates, the fasteners' part and batch numbers, the tool used, the operator, each specimen's load and failure mode, and the conclusion. When a field problem appears months later, the record says whether the joint that failed was the joint that was tested, and when a supplier changes a rivet or a sheet, it says what must be retested. Kept together, the records also show trends across batches and years, which no single test can, such as a rivet supplier's results drifting downwards long before any batch fails.

## Exercise: torque-out of the nuts

Five of EN-700's self-clinching nuts in the 2.0 mm bracket flange are torque-tested to spin-out, giving 9.4, 9.1, 9.6, 8.9 and 9.3 N·m in this illustration. What are the mean, the standard deviation and the mean less three standard deviations? Is the assembly torque of 5 N·m from Chapter 6 well clear of them?

**Worked answer.** The mean is **9.26 N·m** and the standard deviation about **0.27 N·m**, so the mean less three standard deviations is about **8.45 N·m**. The assembly torque of 5 N·m is about 59% of that lower bound, a margin of about 1.7, consistent with the choice made in Chapter 6.

The results also confirm the nut maker's rating of about 9 N·m in this sheet. Had any nut spun at, say, 6 N·m, the investigation would start with that nut's hole size, the sheet's hardness at that point and the pressing force, because a single weak result in a self-clinching fastener usually means one installation went wrong, which is exactly what the assembly torque's margin is there to tolerate.
