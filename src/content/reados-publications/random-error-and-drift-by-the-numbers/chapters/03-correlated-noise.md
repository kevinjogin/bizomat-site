---
book: random-error-and-drift-by-the-numbers
chapterSlug: correlated-noise
order: 3
title: "Correlated noise and the effective number of samples"
description: "Model CW-5's vibration as an Ornstein–Uhlenbeck process, calculate how many independent samples its averaging windows really contain, and find why a short zeroing window added noise to every pack."
draft: false
---

Chapter 2 found that CW-5's 200-sample average scattered nearly three times more than the square-root rule predicted, and traced the gap to a component of the noise that is correlated from one sample to the next. Correlated noise is the rule, not the exception: anything mechanical, thermal or electrical with a time constant produces it. To design averaging windows, zeroing routines and filters, the correlation has to be put into numbers.

This chapter describes correlated noise with the process Ornstein and Uhlenbeck introduced in 1930 for the velocity of a Brownian particle, calculates its autocorrelation and the variance of its average over a window, defines the effective number of independent samples, and applies them to CW-5's weighing and zeroing windows. The failure case is a zero taken over too short a window, which quietly added noise to every pack.

## A noise with memory

White noise has no memory: each sample is independent of the last. The correlated component of CW-5's noise has a memory of about **20 ms**: if it is above average now, it is probably still above average a few milliseconds later, and it drifts back towards its average over a few tens of milliseconds.

The simplest model of such a noise is the **Ornstein–Uhlenbeck process**. In 1930, Uhlenbeck and Ornstein used it for the velocity of a Brownian particle, which is constantly kicked by molecular impacts and constantly pulled back towards zero by friction; the supplied lecture notes treat it as the "truly dynamical" theory of Brownian motion. In electrical terms, it is white noise passed through a first-order low-pass filter, such as a resistor and capacitor. In mechanical terms, it is the random motion of a damped mass on a soft mount. Its two parameters are its **standard deviation**, σ, and its **correlation time**, τc.

### The autocorrelation

The correlation between the noise at two times separated by a lag t falls off exponentially: **ρ(t) = exp(−t ÷ τc)**. For CW-5's τc = 20 ms:

- samples 5 ms apart are correlated at about **0.78**;
- samples 20 ms apart, one correlation time, at about **0.37**;
- samples 60 ms apart, three correlation times, at about **0.05**, nearly independent.

The correlation time can be measured from a recording of the noise: calculate the correlation between the signal and a copy of itself delayed by increasing lags, and find the lag at which it falls to 1 ÷ e, about 0.37.

### Measuring it on CW-5

CW-5's controller can record its raw 1,000-per-second samples for a few seconds with the platform empty and the conveyor running. From such a recording, the technician subtracts the average, calculates the correlation between the series and itself shifted by 1, 2, 3 and more samples, and plots the result against the lag. The curve starts at 1 at zero lag, drops sharply at the first lag, because the broadband part of the noise is uncorrelated even one sample apart, and then decays smoothly as the correlated part fades. The size of the sharp drop shows how much of the noise is broadband; the smooth decay's 1 ÷ e point gives the correlation time. CW-5's recording showed a drop consistent with about 0.5 g of broadband noise and a decay with a correlation time close to 20 ms, which is how the noise model of this book was set. A few seconds of data, a spreadsheet and half an hour gave numbers that no specification sheet could.

### The same process in a Brownian particle

The connection with Brownian motion is direct. In the Ornstein–Uhlenbeck theory, a particle's velocity is the correlated process: kicked at random by molecules and relaxed towards zero by friction with a time constant equal to the particle's relaxation time. *Fine Particles by the Numbers* calculates that time for fume particles in air, where it is a fraction of a microsecond. In CW-5, the correlated process is the platform's random motion, kicked by vibration and air currents and relaxed by its mounts and damping, with a time constant of tens of milliseconds. Different physics, same mathematics: whenever something is disturbed at random and pulled back towards a rest position, the Ornstein–Uhlenbeck model is the first one to try.

### The frequency view

A correlated noise can also be described by its frequency content. An Ornstein–Uhlenbeck process has a spectrum that is flat at low frequencies and falls away above a **corner frequency** of 1 ÷ (2π τc). For τc = 20 ms the corner is at about **8 Hz**. Below 8 Hz the correlated noise looks like white noise; above it, it fades. An average over 200 ms is a low-pass filter with its first null at 5 Hz, which does not reach far below the corner, so most of the correlated component's power, which sits below 8 Hz, passes through the average. That is the frequency-domain version of the effective-sample calculation, and engineers comfortable with filters often find it the more intuitive picture.

## Averaging correlated noise

Averaging a correlated noise over a window of length T reduces its variance less than averaging the same number of independent samples would. For an Ornstein–Uhlenbeck process, the variance of the average works out to σ² × 2r × [1 − r(1 − exp(−1 ÷ r))], where r = τc ÷ T. When the window is long compared with the correlation time, this approaches **σ² × 2τc ÷ T**: the window behaves as if it held about **T ÷ (2τc)** independent samples, however many samples are actually taken.

```figure
type: formula
title: Effective number of independent samples in CW-5's windows
formula: n_eff = σ² ÷ Var(average) ≈ T ÷ (2τc) when T ≫ τc
caption: This is an illustration for CW-5's correlated component, σ = 0.2 g and τc = 20 ms. A 200 ms window contains 200 samples but only about 5.6 independent ones; the exact formula and the long-window approximation converge as the window lengthens.
- 50 ms window | n_eff ≈ 2.0 | correlated part of the average ≈ 0.142 g
- 100 ms window | n_eff ≈ 3.1 | ≈ 0.113 g
- *200 ms window | n_eff ≈ 5.6 | ≈ 0.085 g
- 400 ms window | n_eff ≈ 10.5 | ≈ 0.062 g
- 1 s window | n_eff ≈ 25.5 | ≈ 0.040 g
```

Combining the correlated part with the broadband part, which does average by the square-root rule, gives CW-5's total noise for each window. The two are independent, so their variances add.

```figure
type: compare
title: CW-5's total noise for a single average, by window length
cols: Broadband part | Correlated part | Total
caption: This is an illustration. At every window length the correlated part dominates, so lengthening the window helps less than the square-root rule suggests, and sampling faster helps hardly at all.
- 50 ms | 0.071 g | 0.142 g | 0.159 g
- 100 ms | 0.050 g | 0.113 g | 0.124 g
- *200 ms | 0.035 g | 0.085 g | 0.092 g
- 400 ms | 0.025 g | 0.062 g | 0.067 g
- 1 s | 0.016 g | 0.040 g | 0.043 g
```

## Reducing correlated noise at its source

Since averaging attacks correlated noise so inefficiently, the better cure is to reduce it. Chapter 2's failure case ended with elastomer mounts isolating CW-5's weigh platform from the conveyor frame. Suppose that halved the correlated component, from 0.2 g to **0.1 g**, with the same correlation time. The correlated part of a 200 ms average would halve to about **0.042 g**, and the total would fall from 0.092 g to about **0.055 g**: a 40% improvement from a few mounts. Adding the faster converter on top would then bring the total to about **0.046 g**, because with the vibration reduced, the broadband part is a larger share and does respond to more samples. The order matters: first reduce correlated noise, then average harder. The mounts also have a cost to check: a softer mount lowers the platform's natural frequency, and if it falls too low the platform takes longer to settle when a pack arrives, eating into the 200 ms window. The maker's mount selection balances the two, and the settling time is measured again after any change.

### Why "more data" can mislead

Correlated noise also misleads anyone estimating uncertainty from a recording. Ten seconds of 1,000-per-second data is 10,000 samples, and dividing their standard deviation by √10,000 suggests an average known to a hundredth of the single-sample noise. With a 20 ms correlation time, those 10,000 samples hold only about **10 ÷ 0.04 = 250** independent pieces of information, and the true uncertainty of the correlated part of their average is about **√(10,000 ÷ 250) ≈ 6.3** times larger than the naive figure suggests. Only the broadband part averages as the naive formula assumes, and in CW-5 it is the smaller contributor once averaged. Software that reports a "standard error of the mean" assumes independence; for instrument data, that assumption should be checked before the number is believed. The effective number of samples, not the count of samples, sets the uncertainty.

## Where correlated noise comes from

On a checkweigher, correlated noise has many sources, each with its own correlation time:

- **mechanical vibration** of the frame and platform, filtered by the platform's own natural frequency and damping, with correlation times of tens of milliseconds;
- **air movement** over the conveyor from fans and doors, with correlation times of seconds;
- **electrical interference**, such as mains hum at 50 Hz and its harmonics, which is periodic and cancelled by windows that are a multiple of 20 ms;
- **thermal effects** in the load cell and electronics, with correlation times of minutes to hours, which Chapters 4 and 8 treat as drift.

Each appears at a different time scale, which is why a single measurement of "the noise" is rarely enough. Chapter 5 introduces the Allan deviation, which displays all of them on one chart.

## Zeroing in a short window

Between packs, CW-5's weigh conveyor is empty for about 200 ms, and the controller uses part of that gap to measure the empty-platform reading, the **zero**, which it subtracts from the next pack's reading. That corrects for product dust, temperature and other slow changes. But the zero is itself a measurement, with its own noise, and that noise is added to every pack weighed against it.

The original controller took its zero from a **50 ms** average in each gap, to leave margin either side for packs arriving and leaving. Its designers assumed 50 independent samples of 0.5 g noise, and a zero noise of about **0.5 ÷ √50 ≈ 0.071 g**. The correlated component made the real figure about **0.159 g**, more than twice that, and larger than the 0.092 g noise of the pack weighing itself. Subtracting a zero with 0.159 g of noise from a reading with 0.092 g of noise gives each pack a combined noise of about **√(0.092² + 0.159²) ≈ 0.184 g**.

```figure
type: bars
title: Noise in each pack's net weight, by how the zero is taken
unit: g
max: 0.2
caption: This is an illustration. A zero measured in a short window adds its own noise to every pack. Averaging the zero over many gaps, as Chapters 4 and 5 justify, makes its noise small compared with the weighing's.
- Weighing alone, 200 ms | 0.092
- Zero from one 50 ms gap | 0.159
- *Net weight with that zero | 0.184
```

## A failure case: the zero that doubled the noise

This is an illustration. When CW-5 was commissioned, its static check-weight test, which uses a single zero taken with the platform empty and steady for several seconds, showed a standard deviation of 0.092 g. On the running line, a test with the same check weight passed through repeatedly with the product showed about **0.18 g**, double the static figure. The detection was the comparison of the static and dynamic tests, which the commissioning procedure required.

The explanation was the zeroing routine. In the static test, the zero was averaged over seconds and its noise was negligible; on the running line, it was averaged over 50 ms per gap, and its noise, inflated by the correlated component, was added to every pack. The correction was to change the controller to update the zero as a running average over the last **twenty** gaps, about 1 s of empty-platform data in total. Because the gaps are half a second apart, far longer than the 20 ms correlation time, their zeros are independent of each other, and the running average's noise falls by the square-root rule to about **0.159 ÷ √20 ≈ 0.036 g**, while the zero still tracks slow changes over about ten seconds. The dynamic test then gave about **0.10 g**. Chapter 5 shows how the Allan deviation confirms the choice of twenty gaps.

## How this applies to a small Australian business

Assume noise is correlated until shown otherwise. Measure its correlation time from a recording of the signal, and calculate the effective number of independent samples in each averaging window, about T ÷ (2τc) for long windows. Reduce correlated noise at its source before trying to average it away. Remember that a zero or tare is a measurement too, and that its noise is added to every result it corrects; average it over enough time to make its noise small. Compare static and dynamic tests, because they reveal what each misses.

## Exercise: a slower vibration

After a conveyor change, CW-5's correlated component has the same 0.2 g standard deviation but a correlation time of **50 ms**. Using the long-window approximation, what is the effective number of independent samples in a 200 ms window, and roughly what does the correlated part contribute to a single average? Is the approximation reliable here?

**Worked answer.** The long-window approximation gives **n_eff ≈ 0.2 ÷ (2 × 0.05) = 2**, so the correlated part contributes about **0.2 ÷ √2 ≈ 0.14 g**, worse than the 0.085 g before. The approximation is poor here, because the window is only four correlation times long; the exact formula, with r = 0.25, gives a variance factor of 2 × 0.25 × [1 − 0.25 × (1 − e⁻⁴)] ≈ 0.377, so **n_eff ≈ 2.7** and the correlated part about **0.2 × √0.377 ≈ 0.12 g**. Either way, a slower vibration is much harder to average out, and isolating it becomes more urgent.
