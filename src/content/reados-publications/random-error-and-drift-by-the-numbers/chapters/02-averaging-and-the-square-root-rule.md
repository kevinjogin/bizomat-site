---
book: random-error-and-drift-by-the-numbers
chapterSlug: averaging-and-the-square-root-rule
order: 2
title: "Averaging and the square-root rule"
description: "Apply the square-root rule to CW-5's 200-sample window, see why its measured scatter is nearly three times what the rule predicts, and use window length to cancel conveyor vibration."
draft: false
---

Averaging is the oldest and most useful tool against random error. Take several readings, add them and divide, and the random parts partly cancel. The rule that says how much they cancel is simple, powerful and frequently misused: the standard deviation of an average of n independent readings is the standard deviation of one reading divided by √n. Every word of that sentence matters, and "independent" matters most.

This chapter applies the square-root rule to CW-5's averaging window, compares the prediction with what the scale actually achieves, shows why taking more samples per second did not help, and uses the length of the averaging window to cancel the conveyor's vibration. The failure case is the faster converter that should have halved the noise and did not.

## The square-root rule

If readings are independent and each has a standard deviation σ, then their sum has a variance n σ², because independent variances add, and their average, the sum divided by n, has a variance σ² ÷ n. Its standard deviation is **σ ÷ √n**.

The rule assumes three things, and each is worth checking before relying on it: that the readings are **independent**, so that one reading's error tells nothing about the next; that they have the **same standard deviation**, so that no reading is noisier than the others; and that the noise has **no common component**, such as a drift shared by every reading in the set. The rule does not need the readings to be normally distributed; it holds for any distribution with a finite standard deviation, which is one reason it is so widely useful.

The rule has a sobering consequence: improvement is slow. Averaging four readings halves the scatter; halving it again needs sixteen; a tenfold improvement needs a hundred readings. Time spent averaging buys precision at a diminishing rate.

```figure
type: compare
title: Square-root rule for CW-5's broadband noise of 0.5 g per sample
cols: Samples averaged | Window at 1,000 per second | Predicted standard deviation
caption: This is an illustration for the broadband part of CW-5's noise alone, assuming each sample is independent. Doubling the samples improves the result by only √2.
- 50 | 50 ms | 0.5 ÷ √50 ≈ 0.071 g
- 100 | 100 ms | 0.5 ÷ √100 = 0.050 g
- *200 | 200 ms | 0.5 ÷ √200 ≈ 0.035 g
- 400 | 400 ms | 0.5 ÷ √400 = 0.025 g
```

The rule is the same one behind the counting statistics of particle counters and the sampling plans of quality inspection. It is also the same mathematics as the spreading of a Brownian particle, which Chapter 4 develops: a sum of n independent random steps grows by √n, and an average of them shrinks by √n.

## Prediction against measurement

With 200 samples in its window and 0.5 g of broadband noise per sample, CW-5 should weigh with a standard deviation of about **0.035 g**. The twenty check-weight readings of Chapter 1 showed **0.092 g**, nearly three times as much. Something in the noise is not independent from sample to sample.

That something is the correlated vibration component of the noise model: **0.2 g**, smaller than the broadband 0.5 g per sample, but with a correlation time of **20 ms**, so that samples a few milliseconds apart are nearly equal and share most of their error. Averaging 200 such samples is nothing like averaging 200 independent ones; over a 200 ms window there are only about five or six independent "chunks" of vibration. Chapter 3 calculates the effective number exactly, and finds that the vibration alone contributes about **0.085 g** to the average, while the broadband noise contributes **0.035 g**. Combined as independent components, √(0.035² + 0.085²) ≈ **0.092 g**, which is what the scale shows.

```figure
type: bars
title: What CW-5's 200 ms average is made of
unit: g
max: 0.1
caption: This is an illustration. The broadband noise, though larger per sample, averages down well; the correlated vibration, though smaller per sample, barely averages at all over 200 ms and dominates the result.
- Broadband noise, 0.5 g per sample, averaged | 0.035
- Correlated vibration, 0.2 g, averaged | 0.085
- *Combined | 0.092
```

The general lesson is that the square-root rule gives a **lower bound** on the scatter of an average. It is achieved only when the noise is independent from sample to sample. Any correlation, from vibration, slow electrical interference, mechanical bounce or drift, makes the average worse than the rule predicts, sometimes much worse.

### How well is the scatter itself known?

The 0.092 g came from twenty readings, and a standard deviation estimated from a sample has its own uncertainty. For normally distributed readings, the relative standard uncertainty of a sample standard deviation from n readings is roughly **1 ÷ √(2(n − 1))**. Twenty readings give a standard deviation known to about **±16%**; ten readings to about **±24%**; five readings to about **±35%**; fifty to about **±10%**. That is why the comparison with the square-root rule above is convincing: a factor of nearly three is far outside a 16% uncertainty. A difference of 20% between two standard deviations each estimated from ten readings would not be. When noise is the subject of a decision, the noise needs estimating from enough readings to support it.

## Averaging is filtering

An average over a window is a filter. It passes slow changes, which it cannot distinguish from the signal, and attenuates fast ones. For a sinusoidal disturbance of frequency f, an average over a window of length T reduces its amplitude by the factor **|sin(π f T) ÷ (π f T)|**. That factor is zero whenever the window contains a whole number of cycles of the disturbance: the positive and negative half-cycles cancel exactly.

CW-5's conveyor motor and gearbox shake the weigh platform at about **20 Hz**, with an amplitude at the load cell of about **0.3 g**. A 200 ms window contains exactly four cycles of 20 Hz, so the average rejects that vibration completely, which is no accident: the window was chosen with it in mind.

```figure
type: stats
title: Residual of a 0.3 g, 20 Hz vibration after averaging over different windows
caption: This is an illustration using the attenuation factor |sin(πfT) ÷ (πfT)|. Whole numbers of cycles cancel the vibration; a window a few milliseconds off leaves a residual.
- *200 ms, 4 cycles | 0.000 g | cancelled
- 210 ms, 4.2 cycles | 0.013 g | factor 0.045
- 225 ms, 4.5 cycles | 0.021 g | factor 0.071, the worst case near this length
- 250 ms, 5 cycles | 0.000 g | cancelled
```

Matching the window to a known disturbance is cheap and effective, but fragile: if the conveyor speed changes, the vibration frequency changes with it, and the cancellation is lost. CW-5's controller sets the window from the conveyor's speed setting, so that the window always contains a whole number of vibration cycles. Broadband noise, which has no single frequency, cannot be cancelled this way and must be averaged down by the square-root rule.

### Other averages

The simple average, every sample weighted equally, is not the only choice. A **median** of the samples ignores a few wild values, such as a spike when a pack's edge catches a guide, at the cost of slightly more scatter for well-behaved noise. A **weighted** window, with less weight at its ends, rejects broadband noise slightly less well but rejects disturbances at frequencies between the nulls better. Digital filters in checkweigher controllers often combine a low-pass filter with an average. The choice is made by testing on real data from the line, not by preference; for CW-5, the plain average matched to the vibration frequency did best.

The 20 Hz shake is one identifiable, periodic disturbance, and the window removes it. The correlated component in the noise model is different: a random, low-frequency wander made up of many small mechanical and electrical disturbances with no single frequency, from air currents over the conveyor, belt flutter and the bounce of each pack settling. It cannot be cancelled by choosing a window, which is why it survives the average and dominates the result.

## When averaging hides a problem

Averaging removes random error, and it also smooths over things that are not random. Two cases matter on a checkweigher.

The first is a **transient**. A pack that arrives on the weigh conveyor bounces and rocks for a few tens of milliseconds, and the load cell reads high and low as it does. If the averaging window starts before the bounce has died away, the average includes part of it. That part is not random from pack to pack: every pack arrives in much the same way, so it adds a nearly constant offset, a systematic error, that averaging cannot remove and that a static check-weight test cannot see. CW-5 discards the first 100 ms on the platform for exactly that reason, and its maker set that delay by recording the raw signal from real packs and finding where it settled.

The second is a **spike**. If a pack's edge catches a side guide for a moment, the load cell sees a brief jolt. An average spreads the jolt over the window, producing a modest error that looks like noise; a median would ignore it; a plot of the raw samples would show it plainly. A checkweigher whose results scatter more than its noise model predicts, on real packs but not on a static weight, is often suffering from spikes or transients that the average is quietly absorbing. Logging raw samples for a few hundred packs, and looking at them, finds them quickly.

## Averaging across packs

Averaging within a window improves each pack's weighing. Averaging across packs answers a different question: what is the line's average fill? Here the noise of the scale is usually the smaller part. If CW-5's packs vary in true weight with a standard deviation of about 2 g, then the average of 100 packs has a standard deviation of about **2 ÷ √100 = 0.2 g** from the fill variation alone, while the scale's own noise contributes only about **0.092 ÷ √100 ≈ 0.009 g**. For estimating the line's average, the product's variation dominates and the scale's precision hardly matters; its systematic error, which does not average away, matters a great deal. Each question needs its own error analysis.

## Averaging time is not free

Every millisecond of averaging is a millisecond the pack must spend on the weigh conveyor. At 120 packs a minute, each pack has a pitch of 0.5 s, and the weigh conveyor's length and speed give it about 300 ms on the platform, of which the first 100 ms are lost to the transient as it arrives. That leaves 200 ms. A longer window would need a longer, slower weigh conveyor or a slower line. Chapter 7 develops the trade between line speed and precision; here, the point is that averaging time is a resource to be spent where it does most good.

## A failure case: the faster converter

This is an illustration. Before the noise was understood, CW-5's maker offered an upgrade: an analogue-to-digital converter running at **4,000** samples a second instead of 1,000. The reasoning was the square-root rule: four times as many samples in the same 200 ms window should halve the scatter, from about 0.092 g to about 0.046 g.

After the upgrade, the twenty-reading check gave a standard deviation of about **0.087 g**, an improvement of about 6%. The detection was the check itself; the explanation followed from separating the noise. The broadband part did halve, from 0.035 g to about **0.018 g**, as the rule predicted. The correlated vibration did not change at all, because sampling it more often within the same 200 ms window only takes more samples of the same few chunks of vibration. With the vibration's 0.085 g untouched, the combined result barely moved: √(0.018² + 0.085²) ≈ 0.087 g.

The correction was to attack the vibration: the weigh platform was isolated from the conveyor frame with elastomer mounts and the drive was rebalanced, reducing the correlated component. Chapter 3 calculates the benefit. The shop's rule now is to measure what the noise is made of before buying a cure for it.

The isolation mounts brought a second benefit that the faster converter could never have delivered: the scale's readings on real packs became steadier as well as its static readings, because the same mounts also damped the bounce of each pack arriving, shortening the transient the window has to wait for.

## How this applies to a small Australian business

Use the square-root rule to predict how averaging improves a measurement, and treat its answer as the best case. Measure the actual scatter of an average and compare; if it is worse than the rule predicts, look for correlated noise. Match averaging windows to known periodic disturbances, and tie the window to the machine's speed if the disturbance moves with it. Remember that more samples per second only help if the noise is independent between samples. Spend averaging time where it buys the most.

## Exercise: a shorter window

If CW-5 had to run with a 150 ms averaging window, how many samples would it average at 1,000 per second, and what would the broadband part of its noise contribute? How many cycles of the 20 Hz vibration would the window contain, and would it cancel the vibration? What window length closest to 150 ms would?

**Worked answer.** A 150 ms window averages **150** samples, so the broadband part contributes about **0.5 ÷ √150 ≈ 0.041 g**. The window contains **0.150 × 20 = 3** cycles of 20 Hz, a whole number, so it cancels the vibration exactly; 150 ms is itself a cancelling length. The nearest alternatives are 100 ms, two cycles, and 200 ms, four cycles. (The correlated noise component still averages less well over 150 ms than over 200 ms, which Chapter 3 quantifies.)
