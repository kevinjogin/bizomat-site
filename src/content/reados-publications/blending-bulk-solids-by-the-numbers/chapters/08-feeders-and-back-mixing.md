---
book: blending-bulk-solids-by-the-numbers
chapterSlug: feeders-and-back-mixing
order: 8
title: "Continuous blending: feeders, fluctuations and back-mixing"
description: "How feeder fluctuations become composition variation, how an extruder's back-mixing filters them by their time scale, how refill floods and slow drifts get through, and how capability is proved."
draft: false
---

In a continuous process there is no batch to validate. The blend is made second by second as feeders deliver each component into a mixer or straight into the process, and its quality depends on how steadily each feeder runs and on how much the downstream equipment smooths the result. Plant C's extrusion line is a continuous blender of this kind: three loss-in-weight feeders deliver polypropylene, calcium carbonate filler and premix into a twin-screw extruder, which melts, mixes and pelletises them.

This chapter shows how a feeder's fluctuation in rate becomes a fluctuation in the compound's filler content, how the extruder's back-mixing filters fluctuations according to how fast they are, and why some disturbances pass straight through. It follows the plant's investigation of occasional high-filler pellets, traced to the filler feeder's refills, and ends with the capability study that showed the fix had worked.

## Loss-in-weight feeders

A loss-in-weight feeder sits on load cells. Its screw or vibratory tray discharges the material, and its controller measures the rate at which the feeder's own weight falls and adjusts the screw speed to keep that rate at the set point. It is accurate over periods of tens of seconds to minutes, as long as it is weighing. Two things limit it.

- **Short-term pulsation.** A screw delivers material in a pulse each revolution, as each flight passes the outlet. At 60 rpm the filler feeder pulses once a second. The controller cannot correct within a revolution.
- **Refills.** When the feeder's hopper runs low, it must be refilled, and while material is pouring in the load cells cannot tell what is leaving. During refill the controller holds the screw at its last speed, running volumetrically, and any change in how much material each turn delivers goes uncorrected.

Feeder makers specify accuracy as a standard deviation of the rate over a stated sample period, such as one minute. That figure describes the feeder's gravimetric running; it says nothing about refills unless it says so explicitly.

## From feeder rate to composition

The filler fraction of the compound is x = F ÷ (F + R), where F is the filler rate and R the combined rate of everything else. A small relative change δ in the filler rate changes the filler fraction by a relative amount (1 − x) δ. At x = 0.30, a 1% rise in the filler rate raises the filler fraction by 0.7%, from 30.0% to 30.21%. A 1% rise in the polypropylene rate lowers it by 0.3 × 1%, a smaller effect, because polypropylene is the larger stream.

Independent fluctuations in the feeders add as variances, a direct application of the rule that independent random variables add variances, which Kadanoff's lectures and every statistics text derive from the central limit theorem. If each feeder's relative rate scatter is known over a given period, the composition scatter over that period follows.

## The extruder as a filter

The extruder does not deliver each second's feed as a separate slice. Material entering it spreads out along the screws, faster and slower parts overtake each other, and what leaves at any moment is a blend of what entered over the past minute or so. Danckwerts called the spread of times that material spends inside a continuous vessel its **residence time distribution**, and its effect on fluctuations is the same as a low-pass filter's: fast fluctuations are averaged out, slow ones pass through.

A simple model treats the extruder's mixing as equivalent to a single, perfectly mixed volume with a time constant τ. A fluctuation of period T is then reduced by a factor

A = 1 ÷ √(1 + (2π τ ÷ T)²)

For Plant C's extruder, a tracer test, in which a small amount of coloured masterbatch was added in one pulse and the colour of the strands timed as it rose and fell, gave a mean residence time of about 60 s and a spread equivalent to a mixing time constant of about **15 s**. This is an illustration.

```figure
type: compare
title: How the extruder attenuates a feed fluctuation, by its period
rowhead: Period of the fluctuation
cols: Typical source | Fraction passed, τ = 15 s
caption: This is an illustration. Single mixed-volume model with τ = 15 s. Fluctuations much faster than τ are averaged away; those much slower than τ reach the pellets unchanged.
- 1 s | screw pulsation at 60 rpm | 0.011
- 10 s | controller hunting, short surges | 0.11
- * 40 s | a refill flood lasting about 20 s | 0.39
- 2 min | slow controller oscillation | 0.79
- 10 min | refill cycle, calibration error | 0.99
- 1 hour | feeder drift, wrong set point | 1.00
```

The table explains which feeder problems matter. Screw pulsation, the most visible fluctuation in a feeder's rate trace, is almost completely removed: a ±5% pulsation once a second becomes ±0.05% at the die. Slow drifts and set-point errors pass through completely, however good the extruder's mixing. The disturbances that matter most are those in between, lasting tens of seconds, and those that last minutes or more.

## The error: a refill that flooded

This is an illustration. The compound's filler content is measured by ashing: a few grams of pellets are burned in a furnace and the residue weighed, a method of the type described in ISO 3451-1. Over a month the laboratory's 50 routine results averaged 30.05% with a standard deviation of 0.24 percentage points, against a specification of 29.0 to 31.0%. Most were close to 30%. A few, scattered without obvious pattern, were around 30.4 to 30.6%.

The engineer matched the times of the high results against the filler feeder's log. Every one had been sampled from product made within about a minute after a refill of the filler feeder. The feeder's own trend showed nothing unusual, because during a refill it was not weighing.

The cause was the filler itself. Calcium carbonate dropped into the feeder's hopper from the refill valve arrives aerated, as the companion discussion of bulk solids explains: freshly poured fine powder holds air and flows almost like a liquid. For the 15 to 20 seconds after each refill, the aerated powder ran through the screw's flights more freely than settled powder, so each turn delivered more, while the controller held the screw speed fixed. A test with the extruder stopped and the feeder discharging into a bin on a scale showed the rate rising about **4%** above set point for about 20 seconds after each refill.

A 20-second surge behaves roughly like half a cycle of a 40-second fluctuation, which the extruder passes at about 0.39. A 4% filler-rate surge therefore became about 4 × 0.39 = 1.6% at the die, and with the (1 − x) factor about 1.1% of the filler fraction: from 30.0% to about **30.33%** in the pellets made just after each refill. Pellets sampled at the peak of a surge read higher still, because the single mixed-volume model overstates the extruder's smoothing of a short pulse, as the next section explains.

## Measuring the residence time distribution

The extruder's smoothing is measured, not assumed. A pulse of tracer, here a few grams of a strongly coloured masterbatch dropped into the feed throat at a known moment, travels through the extruder and emerges spread out in time. Cutting the strand into short timed lengths, or measuring its colour continuously, gives the tracer concentration against time: the residence time distribution. Its mean is the mean residence time; its spread is what does the smoothing.

Plant C's tracer curve showed nothing for the first 35 seconds, a sharp rise to a peak at about 50 seconds and a tail lasting until about 100 seconds. A perfectly mixed volume would show tracer from the first instant, decaying exponentially; a pure plug flow would show a single sharp spike. A twin-screw extruder is in between: mostly plug flow with some axial dispersion. Fitting its spread with an equivalent mixed-volume time constant of 15 s gives a convenient filter model, but it is only an approximation of the real curve's shape.

### Where the simple model errs

Because the real distribution has a dead time and a narrower spread than a single mixed volume, it smooths very fast fluctuations even more strongly than the model, since the dispersion still spans many periods, but passes a short, isolated pulse with less reduction, because the pulse emerges as a narrower, taller peak. That is why the refill surges' peak readings ran above the model's 30.33%. For pulses and steps, the measured tracer curve itself should be used: the response of the compound to any feed disturbance is the disturbance convolved with the residence time distribution, a calculation any spreadsheet can do once the curve is tabulated.

## Proving the fix

The plant made three changes to the filler feeder: refills were made smaller and more frequent, so each brought in less aerated powder; a short de-aeration pause was added, with the refill valve closing before the hopper reached its low level; and the feeder's controller was set to hold the screw speed at the average of the last minute's gravimetric running rather than the last instant's.

To decide whether the line now met the customer's capability requirement, a Cpk of at least 1.33 shown with 95% confidence, the engineer used the [capability confidence check tool](/tools/capability-confidence-check/). From the number of results, their mean and standard deviation and the specification limits, it calculates Cp and Cpk, their lower confidence bounds following the NIST/SEMATECH e-Handbook, and the sample size at which the same Cpk would prove the requirement.

```figure
type: compare
title: Filler content capability before and after the refill changes
rowhead: Measure
cols: Before, 50 results | After, 50 results
caption: This is an illustration. Specification 29.0 to 31.0% filler; requirement Cpk ≥ 1.33 at 95% confidence. Before the change the sample Cpk was just under the requirement and its lower bound well under it; after, the lower bound clears it.
- Mean filler, % | 30.05 | 30.02
- Standard deviation, percentage points | 0.24 | 0.19
- Cp / Cpk from the sample | 1.39 / 1.32 | 1.75 / 1.72
- Lower 95% bound on Cpk | 1.09 | * 1.42
- Tool verdict | not capable | capability proven
```

Before the change, the sample Cpk of 1.32 was just short of 1.33, and its lower confidence bound, 1.09, showed how little 50 results could prove. After the change, the standard deviation fell to 0.19 and the lower bound on Cpk, **1.42**, cleared the requirement. The tool also noted that, at a Cpk of 1.72, about 30 results would have been enough to prove it. Its reminder that capability indices assume a stable, roughly normal process mattered here: the before data were not entirely stable, because the refill surges were a recurring special cause, which is why the plant fixed the cause rather than arguing over the index.

## A variance budget

The before and after results also show where the variation came from. Variances add, so the reduction from 0.24² = 0.0576 to 0.19² = 0.0361 square percentage points means the refill surges had contributed about 0.0215, a standard deviation of about 0.15 points. The laboratory's repeatability on the ash test, measured on a reference compound, is about 0.10 points, contributing 0.010. What remains, about 0.026, a standard deviation of about 0.16, is the combined effect of the feeders' gravimetric scatter and the extruder's incomplete smoothing.

```figure
type: stats
title: Where the filler content's variation came from
caption: This is an illustration. Variances, in square percentage points, add for independent sources; the total before the change was 0.0576.
- 0.0215 | refill surges, removed by the change
- 0.010 | ash test repeatability
- 0.026 | feeders' gravimetric scatter after the extruder's smoothing
- 0.0361 | total after the change, a standard deviation of 0.19
```

That budget tells the plant where further improvement must come from. The test method is now more than a quarter of what remains; a better feeder would reduce only part of the rest.

## Feeders at the edge of their range

One more source of trouble deserves mention because it is easy to design in. A feeder runs best in the middle of its speed range. Plant C's premix feeder, sized for a future 2% premix addition, runs at 15 kg/h near the bottom of its range, where each screw revolution is a larger share of a second's output and pulsation is relatively larger. The extruder smooths that pulsation, as the table shows, so it does no harm here. In a process with less back-mixing downstream, such as a feeder discharging onto a belt or into a bag, an oversized feeder running slowly can deliver a visibly lumpy stream. Sizing each feeder for the rate it will actually run at matters as much as its accuracy specification.

## How this applies to a small Australian business

In a continuous blend, find out how long material spends in the mixing step and compare it with the time scales of your feeders' disturbances. Fast pulsation is rarely the problem; refills, controller oscillations and slow drifts usually are. Match quality results to feeder events by time before blaming the mixer, and when you claim a process is capable, use the lower confidence bound on Cpk, not the sample value, so the claim survives the next 50 results.

## Exercise: a slower controller oscillation

The polypropylene feeder's controller is found to oscillate with a period of 90 s and an amplitude of ±2% of its rate. Using the single mixed-volume model with τ = 15 s, estimate the resulting oscillation in filler content. Recall that a change in the polypropylene rate changes the filler fraction by −x times the relative change, where x = 0.30, because polypropylene makes up most of the rest of the feed.

**Worked answer.** The attenuation is 1 ÷ √(1 + (2π × 15 ÷ 90)²) = 1 ÷ √(1 + 1.0966) = 1 ÷ 1.4479 = **0.691**. The polypropylene rate oscillation at the die is about 2 × 0.691 = 1.38%. The filler fraction changes by about −0.30 × 1.38% = −0.41% of its value, about **±0.12 percentage points** around 30.0%. That is small against the ±1.0 specification but comparable to the remaining feeder scatter in the budget, so it is worth tuning the controller.
