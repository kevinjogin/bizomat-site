---
book: random-error-and-drift-by-the-numbers
chapterSlug: drift-checks-and-the-uncertainty-budget
order: 8
title: "Drift, check intervals and the uncertainty budget"
description: "Model CW-5's span drift as a mean-reverting process, set the interval between check-weight tests, chart the checks, and combine every component into an uncertainty budget with an expanded uncertainty."
draft: false
---

Every chapter so far has dealt with one part of CW-5's error: scatter, correlated noise, zero wander, the thermal floor, the effect of speed. A measurement result needs all of them together, stated honestly as one number with its uncertainty. And one part has been left for last because it behaves differently from the rest: the slow drift in the scale's span, which zero tracking cannot see and which only a check with a known weight can find.

This chapter models CW-5's span drift as a mean-reverting process, calculates how far it can move between checks, sets the check interval from that, shows how to chart the checks so that real changes stand out from noise, and builds the full uncertainty budget following the international guide. The failure case is an uncertainty statement that counted only the scatter.

## A drift that comes back

CW-5's span, its sensitivity, depends on the temperature of the load cell and its electronics, and the packing hall's temperature follows the heating, the doors and the sun through the day. The span therefore wanders, but not without limit: when the temperature returns, so does the span. That is the behaviour of the **Ornstein–Uhlenbeck** process of Chapter 3, now on a much slower time scale. The noise model gives it a standard deviation of **0.15 g** at 500 g and a time constant of **30 minutes**, values read from the hump in the span's Allan chart in Chapter 5.

For a mean-reverting process, the change between two times Δt apart has a standard deviation of **σ √(2(1 − exp(−Δt ÷ τ)))**. For short intervals it grows like a random walk; for long intervals it levels off at **σ √2**, because by then the two values are effectively independent draws from the same distribution.

```figure
type: compare
title: How far CW-5's span can move between checks
cols: Interval since last check | Standard deviation of the change | For comparison, the zero's random walk if untracked
caption: This is an illustration with σ = 0.15 g and τ = 30 minutes. The span's change levels off at about 0.21 g because the drift reverts to its mean; a random walk, like the untracked zero of Chapter 4, would keep growing.
- 15 minutes | 0.133 g | 0.19 g
- *30 minutes | 0.169 g | 0.27 g
- 60 minutes | 0.197 g | 0.39 g
- 2 hours | 0.210 g | 0.55 g
- 4 hours or more | about 0.212 g | 0.77 g
```

The levelling-off has a practical meaning. Checking every four hours rather than every two barely changes the worst-case span error, because after a couple of hours the drift has already reached its full spread. Checking every fifteen minutes rather than every thirty does help, because at those intervals the drift has not yet had time to spread. The interval that matters is set by the drift's time constant, not by the calendar. A drift with a time constant of a day would call for daily checks; one with a time constant of minutes would need either very frequent checks or, better, a fix to whatever is driving it.

## Setting the check interval

At each check, the technician places the certified 500 g weight on the platform, takes the average of ten readings, and corrects the span if the error is significant by the rule from Chapter 1. Between checks, the span is free to drift by the amounts above. The check interval is therefore a choice between the span error that the business can accept and the time spent checking.

CW-5's line runs a 30-minute check, built into the routine of the line's operator, and the span error at the end of each interval has a standard deviation of about **0.169 g**. As the budget below shows, that is the largest single component of CW-5's uncertainty, so shortening the interval is the most effective improvement available. Better still would be reducing the drift itself: insulating the load cell from draughts, or keeping the packing hall's temperature steadier, attacks the cause rather than measuring around it.

## Charting the checks

Each check produces a number: the average of ten readings of the check weight, minus 500.00 g. Plotted in time order, those numbers form a **control chart**. With the noise of a single reading at about 0.092 g, the average of ten has a standard deviation of about 0.029 g, and limits at three times that, about ±0.087 g, mark the range within which a check would fall about 99.7% of the time if nothing had changed but noise.

Points outside the limits, or long runs of points on one side of the centre line, indicate a real change, a drift that has developed or a disturbance that has occurred, and justify a correction. Points within the limits are left alone, which is the discipline that prevents the tampering described in Chapter 1. The NIST/SEMATECH e-Handbook of Statistical Methods describes control charts of this kind and variants such as the exponentially weighted moving average chart, which is more sensitive to slow drifts.

CW-5's chart does something more: over weeks it shows the span drift's daily pattern, rising as the hall warms in the morning and falling in the evening. That pattern is evidence for the drift model, and a change in it, a larger swing after a door was propped open or a new heater was installed, is a reason to revisit the model and the check interval.

## The uncertainty budget

The guide to the expression of uncertainty, JCGM 100:2008, sets out how to state a measurement's uncertainty: identify every significant component, express each as a standard uncertainty, combine independent components as the square root of the sum of their squares, and multiply by a coverage factor, commonly 2, for an expanded uncertainty. For a pack weighed by CW-5 at 120 packs a minute with a 30-minute span check, the components are:

```figure
type: stats
title: Uncertainty budget for one pack weighed by CW-5
caption: This is an illustration using this book's model. Components are standard uncertainties in grams, assumed independent. The span drift between checks contributes about 72% of the combined variance; the weighing noise about 21%; everything else about 7%.
- 0.092 g | Weighing repeatability, 200 ms window | Type A, Chapters 2 and 3
- 0.029 g | Tracked zero, 30 s window | Type A, Chapters 4 and 5
- *0.169 g | Span drift since the last 30-minute check | Type A, from the span record
- 0.010 g | Certified check weight | Type B, from its certificate
- 0.029 g | Uncertainty of each span correction, ten readings | Type A
- 0.003 g | Display resolution, 0.01 g ÷ √12 | Type B
- 0.030 g | Static-to-dynamic difference | Type A, from dynamic tests
```

Combining them, the **combined standard uncertainty** is about **0.199 g**, and the **expanded uncertainty**, with a coverage factor of 2, is about **±0.40 g**. A pack that CW-5 weighs at 497.50 g therefore has a mass that could reasonably lie anywhere from about 497.10 to 497.90 g.

Two assumptions sit behind those numbers and are worth stating in the budget itself. The components are treated as independent; if two were correlated, for example if the zero wander and the span drift both followed the hall's temperature, they would need to be combined with their correlation, as the guide describes. And the span drift is entered at its value at the end of the check interval, the worst moment, rather than averaged over the interval; that is deliberately cautious, and a less cautious budget could use a smaller figure if it said so.

The budget immediately shows where effort pays. Halving the weighing noise, which took isolation mounts and a careful analysis in Chapters 2 and 3, would reduce the combined uncertainty only to about 0.183 g. Checking the span every 15 minutes instead of every 30 would reduce it to about **0.170 g**, and hourly checks would increase it to about **0.224 g**. Reducing the span drift itself would be better than either.

```figure
type: bars
title: CW-5's expanded uncertainty, k = 2, by span check interval
unit: g
max: 0.5
caption: This is an illustration. The check interval moves the expanded uncertainty more than any other practical change, because span drift dominates the budget.
- Every 15 minutes | 0.34
- *Every 30 minutes | 0.40
- Every 60 minutes | 0.45
```

### Budget, guard band and decision

The uncertainty budget and Chapter 7's guard band answer related but different questions. The guard band was set from the noise that varies pack to pack, because that is what decides which individual packs near the threshold are misjudged. The span drift, by contrast, is shared by every pack weighed in the same half-hour: it acts as a slowly changing offset. Chapter 7 showed that offsets are the more dangerous error for a pass-or-reject decision. A guard band that protects against noise but not against the span drift's possible 0.17 g offset protects less than it appears to. CW-5's final threshold therefore adds the span component to the guard band calculation, and the budget is the document that justifies the number.

## Checking is not calibrating

A span check with one weight, every half-hour, corrects the scale at one load against a reference whose own value comes from a certificate. It does not show whether the scale is linear across its range, whether the reference itself is still right, or whether something has changed in the weighing mechanics that affects packs differently from a static weight. Those questions are answered by periodic **calibration**: a fuller test at several loads across the range, against reference weights with a known traceable value, by a provider whose competence is established, in Australia usually through NATA accreditation. The calibration's certificate states its own uncertainty, which becomes the Type B component for the check weight in the budget above.

The calibration interval, like the check interval, should be set by evidence rather than habit: the history of calibration results, the control chart of daily checks and any changes to the scale. If successive calibrations find nothing outside the expected uncertainty, the interval can be reviewed; if a calibration finds a shift, the records between it and the last one show when the shift is likely to have occurred and which product may be affected. For trade-use instruments, verification and inspection requirements set by the trade measurement rules apply in addition, and are not replaced by any internal procedure.

### Linearity and the range in use

CW-5 weighs packs between about 495 and 510 g, close to its 500 g check weight, so an error in linearity across the cell's full 1 kg range barely matters: the span check corrects the scale exactly where it is used. A scale used for several products of different sizes is different. A check at one load does not correct a linearity error at another, and a multi-point check, or a check weight near each product's weight, is needed. The budget for each product then includes the linearity component found at calibration for its load.

### Keeping the budget alive

An uncertainty budget is a model, and models go stale. CW-5's budget is reviewed whenever its inputs change: a new line speed changes the repeatability; a new product changes the dynamic difference; a new heating system changes the span drift; a new check weight changes its certificate value. The review takes an hour with the logged data and this book's formulas. Without it, the budget becomes a number that once described a different scale, and the threshold built on it protects nobody.

## A failure case: the uncertainty that counted only the scatter

This is an illustration. An earlier checkweigher on a similar line was documented with a stated uncertainty of "±0.18 g", calculated as twice the standard deviation of twenty static check-weight readings. Nobody had counted the zero, the span drift, the check weight or the dynamic effects.

A customer's own inspection, using a calibrated laboratory balance, found a batch of packs averaging about 0.3 g lighter than the supplier's checkweigher records for the same packs, outside the stated ±0.18 g. The detection came from the customer; the investigation that followed rebuilt the budget component by component and found that the span drift alone was larger than the whole of the original statement. With every component included, the expanded uncertainty was about twice the stated figure, and the customer's 0.3 g difference sat comfortably inside it.

The correction was a documented budget, reviewed whenever the scale, the line speed or the check interval changed; a shorter check interval; and work on the drift itself. The supplier's records now state results with an uncertainty that includes every component, so the next comparison with a customer's balance will be judged against a figure that was honestly made.

## How this applies to a small Australian business

Model slow drift by how it behaves: as a random walk if it keeps wandering, as a mean-reverting process if it returns. Set check intervals from the drift's time constant, and remember that checking more often than the time constant helps while checking less often than about twice it hardly changes the worst case. Chart checks with limits set from the noise of the check itself, and act only on real changes. Build an uncertainty budget that lists every component, combine them by root-sum-square and state an expanded uncertainty. Use the budget to decide where improvement pays, and to justify thresholds and guard bands.

## Exercise: a steadier hall

After the packing hall's heating is improved, CW-5's span drift falls to a standard deviation of **0.08 g** with the same 30-minute time constant. With a 30-minute check, what is the standard deviation of the span change between checks? Replacing the 0.169 g component in the budget, what are the new combined and expanded uncertainties? What share of the variance does span drift now take?

**Worked answer.** The span change over 30 minutes is **0.08 × √(2 × (1 − e⁻¹)) ≈ 0.090 g**. The combined standard uncertainty becomes **√(0.092² + 0.029² + 0.090² + 0.010² + 0.029² + 0.003² + 0.030²) ≈ 0.139 g**, and the expanded uncertainty about **±0.28 g**, down from ±0.40 g. Span drift now contributes **0.090² ÷ 0.139² ≈ 42%** of the variance, and weighing repeatability about 44%: the budget is balanced, and further improvement would need work on both.
