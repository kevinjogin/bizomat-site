---
book: production-leak-testing-by-the-numbers
chapterSlug: setting-the-reject-limit
order: 8
title: "Setting the reject limit"
description: "Turning a leak specification into a station threshold: gas conversion, an uncertainty budget, a guard band and its false-reject cost, and why retesting until a part passes defeats the limit."
draft: false
---

A leak specification says what the customer will accept. A reject threshold says what the station will reject. They are not the same number. Between them lie the conversion from the specification's gas and pressure to the test's, and the uncertainty of the measurement: a part whose true leak is just above the specification will sometimes read just below it, and a threshold set at the specification will pass it about half the time. Setting the threshold is a decision about how often the station may be wrong in each direction, and it should be made with numbers.

This chapter converts the OC-40's specification into a helium figure, builds an uncertainty budget for the helium station from its reference leak, sets a guard band, calculates what it costs in false rejects, and examines the retest policy. It finishes with a threshold set exactly at the specification and what a customer's own laboratory found.

## From specification to helium

The specification is 1 × 10⁻³ mbar·L/s of air at 10 bar gauge. The station fills the oil side with helium at 10 bar gauge, after evacuating it, so the pressure is already the specification's and needs no scaling. The gas does need conversion. Chapter 2 showed that leaks at this size are viscous, where helium passes 0.93 times the throughput of air, and Chapter 6 that the evacuated fill leaves 99.9% helium. The helium equivalent of the specification is 0.93 × 1 × 10⁻³ = 9.3 × 10⁻⁴ mbar·L/s.

That number is what a perfect measurement would compare each cooler with. A real measurement has an uncertainty, and the threshold must allow for it.

## An uncertainty budget for the helium station

The station's reading of a cooler's leak depends on the detector's calibration, the chamber's timing, the background subtraction and the repeatability of each measurement. All are tied to the external reference leak, whose own certificate carries an uncertainty. The quality engineer built the budget from the reference leak's certificate and twenty-five repeated measurements of it in the production cycle.

```figure
type: compare
title: Uncertainty budget for a helium station reading near the limit
cols: Source | Standard uncertainty, % of reading
rowhead: Contribution
- Reference leak certificate | ±8% at k = 2 | 4.0%
- Repeatability | standard deviation of 25 production-cycle readings of the reference leak | 3.5%
- Drift between shift checks | up to ±3%, rectangular | 1.7%
- Reference leak temperature | ±2 K at about 0.5% per kelvin for this capillary, approximated | 1.0%
- Background subtraction | background about 1% of the limit, known to half its value | 0.5%
- * Combined, root-sum-square | — | 5.7%
- Expanded, k = 2 | — | 11.4%
caption: This is an illustration. Contributions are treated as independent and combined by root-sum-square, as in a dimensional uncertainty budget. The reference leak's rate is 9.0 × 10⁻⁴ mbar·L/s of helium at the station's 10 bar gauge.
```

The expanded uncertainty, 11.4% of the reading at a coverage factor of 2, means that a cooler whose true helium leak is exactly at the limit could read anywhere from about 11% below to 11% above it with roughly 95% probability. The biggest single contribution is the reference leak's own certificate, which is why the station's reference leak is recalibrated by an accredited laboratory every year rather than every few years.

### The method is the dimensional one

The arithmetic is exactly that of a dimensional uncertainty budget, applied to a leak rate instead of a length. The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) shows the method for a dimensional gauge: it converts a calibration certificate's expanded uncertainty to a standard uncertainty, treats a resolution as a rectangular limit, adds repeatability, combines them by root-sum-square, expands with a coverage factor and sets a guard-banded acceptance zone inside the tolerance. Its Abbe and thermal expansion terms belong to length measurement and have no counterpart here, and its inputs are in micrometres, so the leak budget above was built by hand in percentages. The steps and their logic are the same.

### The station's Type 1 study

The repeatability in the budget came from a short study. The external reference leak, certified at 9.0 × 10⁻⁴ mbar·L/s of helium, was run through the full production cycle twenty-five times, on a known-good cooler, without changing anything between runs. The readings averaged 9.12 × 10⁻⁴ with a standard deviation of 0.32 × 10⁻⁴, 3.5% of the mean. The average differs from the certificate by 1.3%, and a t-test of that difference, (9.12 − 9.0) ÷ (0.32 ÷ √25) = 1.88, is not significant at the usual 5% level, so the station shows no bias that needs correcting. The study is repeated after any change to the detector, the chamber or the timing, and every six months in any case.

## The guard band

To make it unlikely that a cooler above the specification is passed, the threshold is set below the specification by the expanded uncertainty: 9.3 × 10⁻⁴ × (1 − 0.114) = 8.24 × 10⁻⁴ mbar·L/s, rounded to a threshold of 8.2 × 10⁻⁴. The gap between the threshold and the specification is the guard band.

```figure
type: range
title: The OC-40 helium station's guard band
unit: ×10⁻⁴ mbar·L/s He
min: 0
max: 12
caption: This is an illustration. Specification 9.3 × 10⁻⁴ mbar·L/s of helium at 10 bar gauge; expanded uncertainty 11.4%; threshold 8.2 × 10⁻⁴. Coolers reading between the threshold and the specification are rejected though some are within specification.
- Pass | 0 | 8.2 | reading below the threshold
- * Guard band: rejected, may be good | 8.2 | 9.3 | reading at or above the threshold, below the specification
- Reject: above the specification | 9.3 | 12 | reading above the specification itself
```

### What the guard band buys and what it costs

With the readings' standard uncertainty of 5.7%, the probability that a cooler passes can be worked out for any true leak rate, by treating its reading as normally distributed about the true value. The difference the guard band makes is large on both sides of the limit.

```figure
type: compare
title: Probability that a cooler passes, with and without the guard band
cols: Threshold at the specification, 9.3 | Threshold at 8.2, with guard band
rowhead: True helium leak, as a multiple of the specification
- 0.80, within specification | almost certain to pass | 97.3% pass, 2.7% rejected
- 0.85, within specification | almost certain to pass | 78.5% pass, 21.5% rejected
- 1.00, at the specification | 50% pass | 2.5% pass
- 1.05, out of specification | 20.2% pass | 0.3% pass
- 1.10, out of specification | 5.5% pass | 0.04% pass
caption: This is an illustration with readings normally distributed about the true value with a standard deviation of 5.7% of it.
```

The guard band nearly eliminates the chance of passing a cooler that is out of specification, which is the error the customer pays for, at the cost of rejecting some good coolers whose true leak is within about 20% of the limit. Whether that cost is acceptable depends on how many coolers lie near the limit. On the OC-40 line, the great majority of coolers read below 10⁻⁵ mbar·L/s, a hundred times below the threshold, and only a few per thousand fall anywhere near it. The guard band costs a handful of good coolers a week, each of which goes to the sniffer, has its leak found and is repaired, so the cost is labour, not scrap.

### Where the coolers' readings actually fall

The cost of the guard band depends on the population of readings, so the quality engineer looked at a month of the station's records. Of about 13,000 coolers, 98.6% read below 1 × 10⁻⁵ mbar·L/s, essentially the station's background; 0.8% read between 10⁻⁵ and the threshold; 0.2% read in the guard band, between 8.2 and 9.3 × 10⁻⁴; and 0.4% read above the specification. The guard band therefore sends about twenty-five coolers a month, 0.2%, to the sniffer that the old threshold would have passed. Most of them have real leaks just below the limit, and the repair team found and repaired a leak in nearly all of them, which says that the coolers in the guard band are not good parts unlucky in their readings but marginal parts. Sending them for repair is protection for the customer, and the line's yield barely moved.

## The mistake: a threshold at the specification

When the station was first commissioned, after the regime correction of Chapter 2, its threshold was set at 9.3 × 10⁻⁴ mbar·L/s of helium, exactly the specification's equivalent, with no guard band. The reasoning was that the station had been calibrated with a reference leak, so its readings were correct.

Six months later, the customer's own laboratory retested a sample of 50 coolers chosen from those whose station readings had been close to the limit, between 7 and 9.3 × 10⁻⁴. Two of the fifty measured above the specification.

```figure
type: steps
title: From a customer's findings to a guard band
caption: This is an illustration. Calibration makes a reading unbiased; it does not make it exact.
- Customer's audit | 50 coolers that had read 7 to 9.3 × 10⁻⁴ on the station; 2 above the specification in the customer's laboratory
- Station's own repeat test of the two | 9.6 and 9.9 × 10⁻⁴: both above the limit on retest
- Cause | threshold at the specification; readings carry ±11.4% expanded uncertainty
- * Guard band applied | threshold reset to 8.2 × 10⁻⁴; uncertainty budget recorded
- Containment | coolers in stock that had read above 8.2 × 10⁻⁴ retested; three more rejected
```

Both coolers read above the limit when retested on the station, at 9.6 and 9.9 × 10⁻⁴. They had passed the first time on readings just below 9.3 × 10⁻⁴, inside the scatter that the uncertainty budget predicts. Calibration had made the station's readings right on average; it had not made each reading exact. The threshold was reset to 8.2 × 10⁻⁴ with the guard band of this chapter, the uncertainty budget was added to the station's records, and coolers in stock that had read between 8.2 and 9.3 × 10⁻⁴ were retested. Three more were rejected.

## Retesting

A cooler that reads just above the threshold is often retested before it is sent for repair, and that is sensible: a single reading can be high by chance. But retesting must follow a rule, or it defeats the limit.

The commonest bad rule is to retest until the part passes. With the readings' scatter, a cooler whose true leak is 5% above the specification passes a threshold set at the specification 20.2% of the time on any one test. Allowed three tries, it passes at least once 1 − (1 − 0.202)³ = 49% of the time. Retest-until-pass turns a 20% escape rate into nearly 50%.

```figure
type: checklist
title: The OC-40 station's retest rule
caption: The rule treats a retest as more information, not as another chance to pass.
- x One retest allowed for a reading within 20% above the threshold | readings further above are rejected without retest
- x The cooler is not re-filled or disturbed beyond the station's own cycle
- x Both readings are recorded against the serial number
- x The cooler passes only if both readings are below the threshold
- x Retest counts are reviewed weekly; a rising rate points to the station, not the parts
```

The OC-40 station allows one retest, only for readings within 20% above the threshold, and passes the cooler only if both readings are below the threshold. A cooler near the limit therefore has to read low twice, which is less likely, not more, than reading low once. The weekly review of retest counts is a useful check on the station itself: a rise in the number of coolers that read high and then low points to increased scatter, from a drifting detector or a rising background, before the reference leak check catches it.

An alternative rule, used on some lines, is to average several readings and compare the average with the threshold. Averaging two independent readings reduces the repeatability part of the scatter by a factor of √2, from 3.5% to 2.5%, but it does nothing to the reference leak's certificate uncertainty or to drift, which affect every reading alike. The combined uncertainty falls only from 5.7% to about 5.1%. A guard band built on a single reading remains appropriate, and averaging, which doubles the cycle time for every cooler near the limit, buys little.

## Writing the limit down

The reject threshold belongs to the station, not to the drawing, and confusing the two causes trouble in both directions. The customer's drawing keeps its specification, 1 × 10⁻³ mbar·L/s of air at 10 bar gauge. The station's documented test method records the conversion to helium, the uncertainty budget, the guard band, the threshold, the reference leak's serial number and certificate, the cycle timing and the retest rule. When an auditor asks why a cooler that read 8.5 × 10⁻⁴ was repaired although the drawing allows 1 × 10⁻³, the document answers in a page. When the timing changes, as in Chapter 7, the same page shows which numbers must be redone.

## Limits for the pressure decay screen

The screen's limit was not guard-banded in the same way, for a reason. Its purpose is to catch gross leaks before they reach the helium chamber. A cooler with a moderate leak that passes the screen by chance is rejected by the helium station, so the screen's errors in that direction cost a little chamber contamination, not an escape. Its errors in the other direction, rejecting good coolers because of temperature, waste time but are caught on retest. The screen's limit is set where it best balances those two costs; the helium station's is set to protect the customer.

## Exercise: a guard band for the evaporator

The evaporator of Chapter 1's exercise has a specification equivalent to 2.27 × 10⁻⁵ mbar·L/s of R-134a, which the engineer converts to a helium equivalent of 6.0 × 10⁻⁵ mbar·L/s for testing by helium, since such fine leaks are close to molecular. At that level, the station's reference leak certificate gives ±10% at k = 2, repeatability is 6%, drift 3% rectangular, temperature 1%, and the background, about 1.5 × 10⁻⁶ mbar·L/s, is known to within half its value. Build the budget, set the threshold, and say what the background's larger share means.

### Answer

**Given:** helium limit 6.0 × 10⁻⁵ mbar·L/s; certificate ±10% at k = 2; repeatability 6%; drift ±3% rectangular; temperature 1%; background 1.5 × 10⁻⁶ known to ±0.75 × 10⁻⁶.

**Assumptions:** independent contributions; normal readings; the background uncertainty treated as a standard uncertainty.

**Method:** convert each contribution to a standard uncertainty in per cent of the limit, combine by root-sum-square, expand with k = 2, set the threshold at limit × (1 − U).

**Contributions:** certificate 10 ÷ 2 = 5.0%; repeatability 6.0%; drift 3 ÷ √3 = 1.7%; temperature 1.0%; background 0.75 × 10⁻⁶ ÷ 6.0 × 10⁻⁵ = 1.25%.

**Combined:** √(5.0² + 6.0² + 1.7² + 1.0² + 1.25²) = √(25 + 36 + 2.9 + 1 + 1.6) = √66.5 = 8.2%. **Expanded:** 16.3%.

**Threshold:** 6.0 × 10⁻⁵ × (1 − 0.163) = 5.0 × 10⁻⁵ mbar·L/s of helium.

**Interpretation:** the guard band widens from 11.4% to 16.3%, mainly because repeatability worsens at the lower level. The background, now 2.5% of the limit rather than 1%, is a larger share, and on a day when it doubled it would use 5% of the limit by itself. The station would need its background checked more often and its chamber kept cleaner for this product.

**Verification:** the threshold must lie below the limit by U, as it does: 6.0 × (1 − 0.163) = 5.02, and the budget's largest terms, repeatability and the certificate, together give √61 = 7.8%, nearly all of the 8.2% combined.
