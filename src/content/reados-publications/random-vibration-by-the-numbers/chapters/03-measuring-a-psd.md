---
book: random-vibration-by-the-numbers
chapterSlug: measuring-a-spectrum
order: 3
title: "Measuring a spectrum and trusting it"
description: "From accelerometer to PSD: sampling and aliasing, resolution and record length, averaging and the statistical error of a spectrum, resolution bias, and checks for Gaussian, stationary data."
draft: false
---

A vibration specification is often built from measurements, and a measured spectrum is an estimate, not a fact. It comes from a finite record of a random signal, cut into pieces, transformed and averaged, and every one of those steps trades one kind of error against another. Too few averages and the spectrum is ragged with random error; too coarse a frequency resolution and sharp resonances are flattened; too low a sampling rate and high frequencies masquerade as low ones. A spectrum is only as useful as the engineer's knowledge of how uncertain it is.

This chapter follows a measurement on CB-7's mounting point from the accelerometer to the PSD. It sets out how the sampling rate, the record length and the number of averages determine what the spectrum can show, how large its statistical error is, how coarse resolution understates a resonance, and how to check that the data are Gaussian and stationary enough for a PSD to describe them. It ends with two measurements that disagreed by a factor of two and were both right.

## From accelerometer to samples

This is an illustration. To check the specification against reality, the plant's engineer mounted an accelerometer on the frame at CB-7's mounting point, with a threaded stud on a spot-faced pad, and recorded the vertical acceleration for 60 seconds while the plant screened rock at its normal rate.

The mounting matters. A stud-mounted accelerometer on a flat, clean surface follows the frame faithfully to several kilohertz; one on a magnetic base or a thick adhesive pad has its own mounting resonance, sometimes within a few hundred hertz, which distorts the measured spectrum above it. For a 5 to 500 Hz measurement on a screen frame, a stud or a thin, rigid adhesive mount is the safe choice.

The signal is then sampled. To capture frequencies up to 500 Hz, the sampling rate must be more than twice that, the Nyquist rate, and in practice comfortably more, because the anti-aliasing filter that removes higher frequencies before sampling needs room to roll off. Analysers commonly sample at 2.56 times the highest frequency of interest, 1,280 Hz here; the engineer used 2,048 samples a second. Without an anti-aliasing filter, vibration above half the sampling rate folds back into the measured band and appears at a false, lower frequency: a 1,500 Hz gear-mesh tone sampled at 2,048 Hz without filtering would appear at 548 Hz.

## Resolution and record length

The spectrum is calculated by cutting the record into blocks, transforming each block into frequency components with the fast Fourier transform, and averaging the squared magnitudes. The frequency resolution, the spacing between spectral lines, is the reciprocal of the block's duration. A block of 1,024 samples at 2,048 samples a second lasts 0.5 seconds and gives lines 2 Hz apart.

Resolution has to be fine enough for the sharpest feature in the spectrum. A resonance with quality factor Q at frequency fₙ has a half-power bandwidth of fₙ ÷ Q; the sensor bracket's 120 Hz resonance with Q = 15 is 8 Hz wide. Spreading the analysis over lines much wider than that averages the peak with its lower flanks and understates it.

```figure
type: compare
title: How resolution flattens the sensor bracket's resonance
cols: Lines across the half-power bandwidth | Peak PSD read, share of the true peak
rowhead: Line spacing
caption: Calculated by averaging a single-degree-of-freedom response with Q = 15 at 120 Hz over one analysis line centred on the peak. Lines of a quarter of the bandwidth or finer lose little; a line as wide as the bandwidth loses about a fifth.
- 1 Hz | 8 | 99.5%
- * 2 Hz | 4 | 98.0%
- 8 Hz | 1 | 78.6%
```

## Averaging and the statistical error

A single block's spectrum is very noisy. For a Gaussian random signal, the squared magnitude in each line from one block is an exponentially distributed random variable whose standard deviation equals its mean: a single-block spectrum is uncertain by 100% at every frequency. Averaging n independent blocks reduces the normalised random error to 1 ÷ √n, a result set out in Bendat and Piersol's standard text, and the averaged value follows a chi-square distribution with 2n degrees of freedom, from which confidence intervals follow.

```figure
type: compare
title: Statistical uncertainty of a PSD estimate by number of averages
cols: Normalised random error | 90% confidence range for the true PSD | In decibels
rowhead: Independent averages
caption: For a Gaussian random signal, from the chi-square distribution with 2n degrees of freedom. CB-7's 60-second record at 2 Hz resolution gives 120 independent blocks.
- 4 | 50% | 0.52 to 2.94 times the estimate | −2.9 to +4.7 dB
- 16 | 25% | 0.69 to 1.59 times | −1.6 to +2.0 dB
- * 120 | 9.1% | 0.87 to 1.17 times | −0.6 to +0.7 dB
```

The trade is now visible. For a fixed record length, finer resolution means longer blocks, fewer of them and a noisier spectrum; coarser resolution means more averages and a smoother spectrum that may flatten real peaks. CB-7's 60-second record at 2 Hz gives 120 blocks and a random error of 9%, smooth enough to read and fine enough for the bracket's 8 Hz resonance. Overlapping blocks by half, with a smoothing window such as the Hann window to reduce the leakage of energy between lines, recovers some of the information lost at the block ends and is standard practice.

## What the measurement showed

This is an illustration. The averaged spectrum at CB-7's mounting point showed a broadband level close to the specification's shape but somewhat lower, an overall 2.1 g RMS from 5 to 500 Hz against the specification's 2.55 g. Standing above the broadband level was a sharp peak at 25 Hz: the engine's firing and imbalance at 1,500 rpm, a near-sinusoidal tone that the random specification did not mention. And a broad hump around 110 to 140 Hz came from the screen frame's own resonances.

The specification enveloped the measured broadband spectrum at most frequencies, with margin, which is what a specification should do. It did not describe the 25 Hz tone at all, and Chapter 5 shows that the tone, not the random vibration, was the governing problem for CB-7's mounts.

```figure
type: stats
title: The 60-second measurement at CB-7's mounting point
caption: This is an illustration. Vertical axis, stud-mounted accelerometer, 2,048 samples a second, 2 Hz lines, 120 averages with a Hann window. The tone's size comes from the area of its spike, not its height.
- 2.1 g RMS | Overall, 5 to 500 Hz | specification 2.55 g RMS
- * 0.80 g peak | Engine tone at 25 Hz | spike area 0.32 g², RMS 0.57 g
- 110 to 140 Hz | Frame resonances | broad hump, below the specification's flat level
- 3.4 | Kurtosis of the time history | slightly spiky from rock impacts
```

## Tones on a spectrum

The engine tone needs care to read. A sinusoid puts all its mean square into one or two lines of the spectrum, so its apparent PSD is its mean square divided by the line spacing: halve the spacing and the spike doubles in height. The spike's height therefore means nothing on its own. Its area does: the sum of the PSD over the lines the spike occupies, times the spacing, is the tone's mean square. This is an illustration. The 25 Hz spike's area was 0.32 g², which is a sine of 0.57 g RMS or 0.80 g peak. At 2 Hz lines it showed as about 0.16 g²/Hz, eight times the broadband level near it; at 1 Hz lines it would have shown as 0.32 g²/Hz. Reporting the tone as a sine amplitude, not as a PSD, avoids the ambiguity, and that is how CB-7's revised specification lists it.

## Windows and leakage

The Fourier transform assumes each block repeats endlessly. A tone whose period does not fit a whole number of times into the block appears with ragged ends, and its energy leaks into neighbouring lines, smearing the spike and raising the apparent level around it. Multiplying each block by a smooth window that falls to zero at both ends, the Hann window being the usual choice for random data, suppresses most of the leakage at the cost of slightly widening each line. The window also reduces the signal's average power, and analysers correct the spectrum for it; a home-made analysis that forgets the correction understates the PSD by a fixed factor, about 2.7 for the Hann window, whose mean square is 0.375. Checking a new analysis against a known signal, such as a sine of known amplitude, catches that.

## Calibrating the chain

Every number above depends on the accelerometer's sensitivity, the amplifier's gain and the recorder's scaling. A hand-held vibration calibrator, which shakes the accelerometer at a known level and frequency, checks the whole chain in a minute, and the check should be made before and after each measurement. A chain that reads 10% high at the calibrator's frequency produces a PSD 21% high everywhere, because the error is squared. The calibration record belongs with the measurement, together with the accelerometer's serial number, mounting method and location, so that the spectrum can be trusted, or questioned, later.

## Gaussian and stationary?

## Gaussian and stationary?

A PSD describes a Gaussian stationary signal completely, and anything else only partly. Two quick checks on the record show whether the description is adequate. The kurtosis of the time history, the average fourth power divided by the square of the mean square, is 3 for Gaussian data; the screen frame's record gave 3.4, slightly spiky from rock impacts, close enough for a PSD-based analysis but worth noting, because peaks will be a little more frequent than Chapter 7's Gaussian formulas predict. For stationarity, the engineer compared the spectra of the first and second 30 seconds: they agreed within the expected random error, so the screening condition was steady over the record.

When either check fails, the remedies are to split the record into conditions that are each stationary, to add a shock specification for the impacts, or to use analysis methods based on the time history itself rather than on the spectrum.

A histogram of the time history, plotted on a logarithmic vertical scale against the Gaussian curve with the same RMS, shows the same thing more vividly than the kurtosis alone. A Gaussian record falls away as a parabola on that scale; a spiky one keeps a straighter tail well beyond 3σ. For the screen frame, the tail followed the Gaussian curve to about 3.5σ and then ran a little high, which is what a kurtosis of 3.4 suggests: mostly Gaussian, with some impacts.

## From measurements to a specification

A single 60-second record describes one condition on one day. A specification has to cover the plant's life: different rock, different feed rates, a worn screen deck, a loose bolt, the towing between sites. Building one is a matter of measuring enough conditions, enveloping them sensibly and adding a stated margin.

This is an illustration. For CB-7's revised specification, the engineer measured six screening conditions over two weeks, chosen with the plant's operators to include the hardest rock and the highest feed rate, and two towing runs on the roads between sites. For each, the averaged spectrum at the mounting point, its kurtosis and its tones were recorded. The broadband spectra were enveloped by straight log-log segments, with a margin of 3 dB, a doubling of the spectral density, for variation between plants and over time. The tones were listed separately as sines with their frequency ranges, since the engine's speed varies with load. The towing condition, spikier and with a different shape, became a separate profile with its own duration. Each choice was recorded with its reason, so that a later engineer can tell how much of the specification is measurement and how much is margin.

## The error: two measurements a factor of two apart

This is an illustration. Before the 60-second measurement, two technicians had each taken a quick reading on the sensor bracket with a hand-held analyser set to 4 averages, on consecutive days. One reported a PSD at the bracket's 120 Hz resonance of 0.62 g²/Hz, the other 0.30 g²/Hz. A debate followed about whether the screen's feed or the rock type had changed between the days.

The engineer calculated the uncertainty instead. With 4 averages, the normalised random error is 50% and the 90% range for the true value runs from about half to nearly three times the estimate. Two estimates of the same true spectrum differing by a factor of two is unremarkable at that level of averaging. A measurement with 120 averages settled it: 0.41 g²/Hz, within the range of both quick readings. Nothing had changed between the days; the measurements simply could not tell.

The hand-held analyser's default setting of 4 averages suits a quick look at whether a machine is vibrating at all, not a comparison between days. The procedure that came out of it was simple: every spectrum reported from the plant states its resolution, number of averages and normalised random error, and no decision is taken on a spectrum with fewer than about 30 averages.

## Exercise: planning a measurement

The engineer wants to measure the main circuit board's response inside CB-7, expected to resonate near 180 Hz with Q about 12, with a random error of no more than 10%. Choose a line spacing, and find the number of averages and the minimum record length without overlap.

**Worked answer.** This is an illustration. The half-power bandwidth is 180 ÷ 12 = **15 Hz**, so lines no wider than about a quarter of that, say **4 Hz** or finer, keep the resolution bias small; 2 Hz gives extra margin. A 10% random error needs 1 ÷ n^0.5 ≤ 0.1, so **n ≥ 100** independent averages. At 2 Hz, each block lasts 0.5 s, so the record must be at least **50 seconds** without overlap; at 4 Hz, 25 seconds. With 50% overlap and a Hann window, the same accuracy comes from a somewhat shorter record. Recording 60 seconds at 2 Hz, as for the frame, meets both requirements and allows the first and second halves to be compared for stationarity.
