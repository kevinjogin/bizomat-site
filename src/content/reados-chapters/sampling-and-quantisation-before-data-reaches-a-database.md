---
title: "Sampling and quantisation before data reaches a database"
description: "Understand how sampling, aliasing, converter resolution and signal conditioning affect measurement records before storage, reporting or analysis begins."
publishDate: 2026-10-10
category: "Engineering"
tags:
  - manufacturing
  - systems
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A database can preserve every measurement it receives and still hold a misleading picture of the physical process. Information may already have been lost through slow sampling, limited resolution, clipping or unsuitable filtering. Better storage cannot recover distinctions that the acquisition system never captured.

**Sampling** observes a signal at selected times. **Quantisation** represents its amplitude using a finite set of numerical levels. An analogue-to-digital converter, or ADC, participates in turning a physical signal into digital values, usually as part of a larger chain that includes sensors, conditioning circuits and timing.

Understanding that chain helps engineers specify useful records and helps analysts interpret their limits. The practical question is whether the stored samples preserve the features needed for the intended decision, with sufficient context to explain how those samples were obtained.

## Begin with the physical question

Specify what the measurement must reveal. Tracking a slowly changing tank level, detecting a brief pressure excursion and analysing machine vibration place different demands on acquisition.

A reporting interval is not automatically a suitable sampling interval. A dashboard updated once per minute may still depend on faster acquisition to detect peaks or calculate an appropriate summary.

This is an illustrative example. A process produces a short pressure pulse every few seconds. Recording one instantaneous reading per minute can repeatedly miss the pulse, while recording the maximum over each minute can retain evidence of its magnitude if the underlying acquisition is fast enough.

Define the required amplitude range, relevant frequency content, shortest event of interest and acceptable timing uncertainty. Also identify whether the decision concerns average behaviour, extremes, duration or detailed waveform shape.

Those requirements should drive sensor and acquisition choices. Starting with an available database storage rate and working backwards can produce a convenient dataset that cannot answer the original engineering question.

## Distinguish sampling rate from signal bandwidth

The **sampling rate** is the number of observations taken per second. **Bandwidth** describes the range of signal frequencies being considered. They are related, but they are not the same property.

For ideal reconstruction of a baseband signal with bounded frequency content, the sampling rate must exceed twice the highest retained frequency. Real systems also need practical margin and filtering; choosing a rate exactly at the theoretical boundary is not a complete acquisition design.

A slowly changing quantity can still be accompanied by high-frequency interference. Those unwanted components matter because the sampler observes the combined input, not just the part an analyst intended to study.

Sensor bandwidth, conditioning bandwidth and converter behaviour all influence the signal arriving at the sampling stage. A sensor unable to respond to a brief event cannot be made faster simply by reading its output more frequently.

Use the complete signal path when specifying bandwidth. Record which components limit the response and what their effect means for the intended observation, including delay or attenuation of features near the useful boundary.

## Understand aliasing as a loss of distinction

**Aliasing** occurs when different continuous signals produce indistinguishable sampled sequences under the acquisition conditions. A high-frequency component can appear in sampled data as a lower-frequency component.

This is an illustrative example. A sinusoidal component at 70 Hz sampled at 100 samples per second can appear as a 30 Hz component, with the corresponding phase relationship. Looking only at the samples cannot reliably establish which original component produced them.

The issue is not merely that a plotted line looks rough. Aliasing can introduce a plausible but false feature into analysis. A low-frequency oscillation in a stored dataset may therefore originate from higher-frequency interference at acquisition.

Increasing the number of points drawn between existing samples does not recover the lost distinction. Interpolation can provide a useful representation under assumptions, but it does not create new physical observations.

When unexpected frequency content appears, investigate acquisition settings and filtering before attributing it to the machine or process. The database may be faithfully preserving an artefact introduced upstream.

## Filter before the sampling ambiguity occurs

An **anti-aliasing filter** reduces unwanted frequency content before it can fold into the retained band. Its requirements depend on the useful signal, unwanted input components and chosen sampling rate.

Real filters have a transition region rather than an infinitely sharp cutoff. The design needs room to pass useful content while sufficiently attenuating components that could alias into it. Oversampling can provide additional separation, but does not eliminate every filtering requirement.

Digital filtering after an initial sampling stage cannot distinguish already aliased interference from a genuine component at the same apparent frequency. Acquisition must address that ambiguity before it is created. Analog Devices provides a practical explanation of the relationship between sampling and anti-alias filtering. [Anti-aliasing filter basics](https://www.analog.com/en/resources/technical-articles/guide-to-antialiasing-filter-basics.html).

Filters also affect time-domain behaviour. A filter suitable for a frequency measurement may alter a short transient's amplitude or shape. Specify acceptable effects using the features the application needs to retain.

Check the actual acquisition device's architecture and documentation. Some devices include filtering and oversampling stages; others require external conditioning. The recorded output rate alone does not reveal the full internal signal-processing path.

## Separate nominal resolution from measurement accuracy

An N-bit converter provides a finite set of output codes. For a simple ideal uniform model, the input span divided by two raised to N gives the nominal code step. That step describes resolution, not the total uncertainty of the measurement.

This is an illustrative example. An ideal twelve-bit converter covering a 0–10 V span has 4,096 codes and a nominal step of approximately 2.44 mV. A small change below that scale may not produce a code change under the simplified model.

Real measurements also depend on sensor error, reference stability, offset, gain error, noise and nonlinearity. A sixteen-bit data field does not prove sixteen bits of useful accuracy in the measured physical quantity.

The selected input range matters. Using a wide converter range for a small signal wastes available code levels unless suitable conditioning brings the signal into a useful portion of the span.

Avoid claiming precision from the number of decimal places stored. A database column can retain many digits that merely result from a conversion formula. Displayed precision should reflect the measurement's supported information, not the software's formatting capacity.

## Recognise clipping and lost amplitude information

**Clipping** occurs when the signal exceeds the usable input range and the recorded output reaches a limiting value. Once the top of a waveform has been clipped, its true peak cannot be recovered from that record alone.

This is an illustrative example. A sensor-conditioning chain is configured for an expected range, but a transient exceeds it. The database records several identical maximum codes. Treating those codes as the true measured peak understates the unknown excursion.

Preserve overrange or quality flags where the equipment provides them. If the system detects saturation through other means, record the detection rule and its limitations rather than silently replacing clipped values with plausible estimates.

Range selection balances headroom against resolution. More headroom can accommodate unexpected peaks while making each code step larger for a fixed converter resolution. The useful compromise depends on the process and the consequences of missing an excursion.

Test expected extremes and credible abnormal conditions within an appropriate controlled setup. A system calibrated around its usual midpoint may behave differently near its limits or after a large step.

## Treat noise and averaging according to their character

Noise can obscure small changes even when nominal resolution is fine enough to represent them. Averaging can reduce some uncorrelated random variation, but it does not remove every error source.

A stable offset remains after averaging. Periodic interference can interact with sampling in structured ways. Drift over the observation period can make an average less representative of any particular moment.

This is an illustrative example. Repeated readings fluctuate randomly around a value that is itself shifted by a calibration error. Averaging may make the displayed result steadier while leaving the calibration error unchanged.

Choose the averaging window according to the decision. A long window can improve the stability of a slow trend while concealing a short event. Record whether a stored value is an instantaneous sample, a moving average, a block average or another statistic.

Do not describe all quantisation effects as independent white noise without checking the assumptions. With particular signals and timing relationships, quantisation error can be correlated with the input. The useful noise model depends on the acquisition conditions.

## Preserve timing information through the pipeline

The time attached to a record may represent physical acquisition, device transmission, gateway receipt or database insertion. These can differ substantially during buffering or network interruption.

This is an illustrative example. A device samples regularly while disconnected, then uploads a batch later. If every row receives only its insertion timestamp, the dataset appears to contain a burst of simultaneous measurements instead of the original sequence.

Preserve acquisition timestamps or a start time and reliable sample sequence where appropriate. Also retain the time basis, clock synchronisation information and quality indicators needed to interpret timing accuracy.

Clock drift and sampling jitter are different concerns. Drift changes the relationship between clocks over time; jitter varies sample timing around its intended position. Their effects depend on the signal and analysis being performed.

When comparing channels, establish whether samples are simultaneous or sequentially multiplexed. A small inter-channel delay may be irrelevant for a slow temperature trend but important when calculating relationships between rapidly changing signals.

## Reduce stored data without changing the question silently

High-rate acquisition can generate more data than routine reporting needs. Reduction can be sensible, provided the retained representation preserves the features required by the intended use.

**Decimation** reduces sample rate. A suitable low-pass filtering step is generally needed before rate reduction to prevent higher-frequency content from aliasing into the lower-rate representation.

Selecting every hundredth sample without considering frequency content is different from calculating a filtered lower-rate sequence. Likewise, storing an average is different from storing minimum, maximum or duration-above-threshold information.

This is an illustrative example. A one-minute summary retains average pressure, minimum, maximum, sample count and a quality flag. It supports broader interpretation than an average alone, but it still cannot reconstruct the detailed waveform or establish exactly when a short peak occurred.

Document the limits of each retained level. Keep raw or higher-resolution records where the use requires them, under an appropriate storage and lifecycle policy. Do not imply that a summary is equivalent to its discarded observations.

## Store acquisition metadata as part of the measurement

Event-driven recording needs its own interpretation rules. A device may report only when a value changes beyond a threshold, rather than at a fixed interval. That can be efficient for a stable process, but the absence of a new record then means something different from a missing sample in a regularly sampled series.

This is an illustrative example. A level transmitter sends an update only after a meaningful change. Ten minutes without an update might indicate stability, a communication failure or a device fault. A separate heartbeat or quality signal can help distinguish these conditions. Treating all three as a continuous measured constant would overstate what the stored records establish.

Document the trigger threshold, any maximum reporting interval and the treatment of small cumulative changes. Analysis that assumes evenly spaced samples needs to account for irregular event timing. The acquisition method determines which interpolation or duration calculation is defensible, so preserve that method alongside the values rather than expecting an analyst to infer it from timestamp gaps.

A useful measurement record includes more than a value and timestamp. Relevant context can include sensor identity, unit, range, calibration version, sample rate, filter configuration and processing method.

Not every field needs to be repeated on every row. A configuration record with an effective period or version can describe many samples, provided the relationship is preserved and changes are recorded reliably.

This is an illustrative example. A channel's scaling changes after a sensor replacement. Historical raw codes must remain associated with the old scaling, while later codes use the new one. Applying only the current conversion formula to all history changes the meaning of old measurements.

Preserve quality states explicitly: missing sample, communication failure, overrange, maintenance mode or substituted value. A zero should remain a genuine measured zero where that is what the source recorded.

Make transformations traceable. Analysts should be able to determine whether a stored engineering value came directly from a calibrated device, from a gateway conversion or from a later database calculation.

## Validate acquisition and storage together

Use known inputs and controlled changes to verify the complete path from physical or electrical stimulus to stored record. Check amplitude, timing, units, quality flags and the handling of configuration changes.

Test missing and delayed data. Confirm that a sequence gap remains distinguishable from a stable process and that buffered samples retain their intended timing when they arrive late.

Include a signal near the useful bandwidth boundary and a relevant out-of-band disturbance when the test setup and engineering requirements call for them. These tests assess whether the acquisition chain preserves the intended features, rather than merely whether the database accepts rows.

Reconcile sample counts and time coverage between device output and stored data. A database that loses every tenth record can create a misleading acquisition pattern even if the converter itself is operating correctly.

Record the tested settings and limitations with the dataset. Reliable analysis begins with knowing what the acquisition system could observe, what it transformed and what it could not preserve. Database design then maintains that meaning through storage and use.

*Source basis: coding, quantisation, sampling theory and converter-error discussions in Data Conversion Handbook (2005), supplied in the collection. This is an electronics book despite its location in the database folder. The article is general measurement-system education, not a component specification or engineering compliance approval.*
