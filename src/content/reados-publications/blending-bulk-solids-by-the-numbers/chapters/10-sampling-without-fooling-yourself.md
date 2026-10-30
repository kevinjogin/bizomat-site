---
book: blending-bulk-solids-by-the-numbers
chapterSlug: sampling-without-fooling-yourself
order: 10
title: "Sampling without fooling yourself"
description: "Why sampling particulate material adds its own error, the rules for a fair sample from a stream or container, sample dividing, how many samples a decision needs, and a scoop that rejected good premix."
draft: false
---

Every number in this book about a blend's quality came from a sample, and a sample can be wrong in two ways. It can be unrepresentative, drawn from a part of the material that differs from the rest, in which case its error is a bias that no amount of repeat testing removes. And it can be too small or too few, in which case its error is random but larger than the decision can tolerate. Particulate materials make both easy, because they segregate, because a sample of particles has its own random-mixture scatter, and because the tools used to take samples interact with the particles.

This chapter sets out the principles of fair sampling for blends, connects the sampling error to the random-mixture arithmetic of Chapter 2, covers dividing a large sample down to a test portion, and shows how to decide how many samples a decision needs. Its error is a premix sampling method that rejected good material.

## Two rules for sampling

Practitioners of particle sampling teach two rules, and almost every sampling failure breaks one of them.

1. **Sample a moving stream, not a stationary heap.** In a stream, every particle passes the sampling point; in a heap, bag or bin, the particles have already segregated by position, and a sample from one place represents only that place.
2. **Take the whole of the stream for many short periods, rather than part of the stream for the whole time.** A sample cup passed right across a falling stream at a steady speed collects every part of the stream's cross-section equally. A pipe poked into the side of the stream collects only the material that happens to be at that side, which after a chute or a belt is rarely typical.

Where a blend can only be sampled at rest, as in a blender at the end of a cycle, the samples must be spread over enough positions that segregation by position shows up as scatter rather than hiding as bias, as Plant C's ten fixed positions in Chapter 3 were.

## The sampling error is a counting error

Pierre Gy, whose theory of sampling particulate materials is the standard reference, showed that even a perfectly fair sample of a particulate material has an unavoidable random error, the **fundamental sampling error**, whose variance is proportional to the cube of the particle size and inversely proportional to the sample mass. That is the random-mixture variance of Chapter 2 in different clothes: the particle mass is proportional to the cube of its size, and the variance is proportional to particle mass divided by sample mass. Gy's theory adds factors for particle shape, the size distribution and how the component of interest is distributed among the particles, which this book does not reproduce.

Two practical consequences follow. Halving the top particle size cuts the fundamental error's variance by eight and its standard deviation by 2.8, which is why laboratories grind samples before dividing them. And a sample must be large enough for the coarsest particles present, not the typical ones, because the coarse tail dominates the error.

### Where the error is small

The same reasoning shows where sampling is easy. Each compound pellet from the extruder already contains filler mixed at the micrometre scale, so a single pellet is a fair sample of the compound made in the second or so it took to form. The fundamental error of a 5 g ash portion of compound pellets is tiny; what matters is when the pellets were made, because Chapter 8 showed that the composition varies in time. A dry blend of pellets is the opposite: the colour blend's sample must contain enough masterbatch pellets to measure, and a 60 g portion carries the 12.8% random scatter of Chapter 2 before any test is done. The sampling plan follows the material's structure.

## Dividing a sample

A sample large enough to be representative is usually too large to test, so it must be divided down to a test portion without introducing bias. A **riffle divider**, a box of alternating chutes that splits a poured stream into two halves, and a **rotary sample divider**, which passes a stream through a rotating set of collection cups, both obey the two rules: they cut the whole stream many times. Coning and quartering, shaking a sample into a heap and taking two opposite quarters, is common and much less reliable, because the heap segregates as it forms. Scooping from the top of a container is the least reliable of all.

```figure
type: compare
title: Ways of taking and dividing samples
rowhead: Method
cols: Follows the two rules | Typical problem
caption: General guidance. Methods that cut the whole of a moving stream many times are the reference; methods that take part of a stationary heap can carry large, consistent biases.
- Cross-stream cutter at a discharge or chute | yes | must pass right through at steady speed, with a cup large enough not to overflow
- Rotary sample divider | yes | needs a steady feed; expensive
- Riffle divider | yes, if poured evenly along its width | pouring from one end biases the halves
- Sampling spear or thief in a container | partly | drags material down, favours free-flowing fractions, disturbs the bed
- * Scoop from the top of a sack or bin | no | samples the most segregated layer
- Coning and quartering | partly | the heap segregates as it forms
```

## The error: a scoop that rejected good premix

This is an illustration. Before the changes described in Chapter 7, Plant C's quality check on each batch of premix was a scoop of about 5 g taken from the top of one of the batch's sacks after it had been filled and moved to the store, divided down to 0.5 g by eye and assayed for stabiliser. Over several weeks, about one batch in five read below the release limit of 19.5% and was quarantined, though the blender validation and the compound results gave no sign of a problem.

The engineer compared two methods on ten sacks from ten batches. From each sack, a scoop was taken from the top as before. The whole sack was then poured through a riffle divider, halved repeatedly down to about 50 g, and that portion divided again to 0.5 g test portions. The scoops averaged **19.3%** stabiliser with a standard deviation of 0.40 percentage points; the riffled whole-sack portions averaged **20.0%** with a standard deviation of 0.25. The difference, 0.7 points, was more than four times its standard error: the scoops were biased low.

```figure
type: compare
title: Premix stabiliser by sampling method, ten sacks
rowhead: Method
cols: Mean, % | Standard deviation | Below the 19.5% release limit
caption: This is an illustration. The same ten sacks sampled both ways. Sifting during handling had carried the fine stabiliser down through the coarser polypropylene powder, leaving the top layer lean. The scoop measured the top of the sack, not the sack.
- * Scoop from the top of the sack | 19.3 | 0.40 | 6 of 10
- Whole sack riffled to 0.5 g | 20.0 | 0.25 | 0 of 10
```

The bias had a physical cause. Moving and stacking the sacks vibrated them, and the 150 µm stabiliser sifted down through the 600 µm polypropylene, as Chapter 6 described, leaving the top few centimetres of each sack lean. The scoop sampled exactly that layer. Whole sacks were fine, and since each sack is emptied whole into the feeder's refill hopper, as Chapter 7 explained, the feeder receives the whole sack's average. The quarantined batches had been good, and some had been reworked unnecessarily.

The plant replaced the scoop with a sample taken where the premix is still a moving stream: a cross-stream cup passed through the falling stream from the blender's discharge valve as each sack is filled, three increments per sack, combined and riffled to 0.5 g.

```figure
type: steps
title: Plant C's premix sampling procedure after the change
caption: This is an illustration. Every step either samples a moving stream or divides without selecting by position. The test portion is the scale of scrutiny, 0.5 g, and is reached by halving, not by scooping.
- Cross-stream cup through the blender's discharge | three increments per sack, at the start, middle and end of filling
- Combine the increments | about 300 g per sack
- Riffle to about 50 g | repeated halving, poured evenly along the divider
- Riffle to 0.5 g test portions | two per sack for duplicate assays
- * Retain the remainder, labelled | kept for the premix's shelf life
```

The new procedure takes a few minutes longer per batch than the scoop did. It has not quarantined a good batch since, and its duplicate assays give the laboratory a running check on its own repeatability.

## How many samples?

A fair sampling method still leaves random error, and the number of samples decides how much. The [sample size for a mean tool](/tools/sample-size-mean/) gives the minimum number of measurements to estimate a mean within a chosen margin of error at a confidence level, from an expected standard deviation, with an optional finite-population correction.

The compound's filler content has a standard deviation of about 0.19 percentage points after Chapter 8's changes, including the ash test's own repeatability. To estimate a lot's mean filler content within ±0.10 points at 95% confidence, the tool gives **14** results. To halve the margin to ±0.05 needs **56**, four times as many, because the margin shrinks only with the square root of the number of results. With the scoop's standard deviation of 0.40, the same ±0.10 margin would have needed **62**.

```figure
type: bars
title: Results needed to estimate a mean, 95% confidence
unit: results
caption: From the sample size for a mean tool. Halving the margin quadruples the samples; a noisier sampling method costs as much as a tighter margin.
- Filler, s = 0.19, margin ±0.10 | 14
- Filler, s = 0.19, margin ±0.05 | 56
- * Scoop method, s = 0.40, margin ±0.10 | 62
```

The tool's caution about its own input applies with force to sampling: the standard deviation must come from a pilot study or history using the same sampling method. A standard deviation measured with careful riffling says nothing about the scatter of grab samples, and the bias of a poor method does not appear in any standard deviation at all.

## After the sample is taken

A sample can segregate in its own bag. A jar of premix carried to the laboratory and opened a day later has had a journey of its own, and the stabiliser may have sifted to the bottom. The laboratory's procedure therefore riffles every sample on arrival rather than tipping out the top few grams, and keeps a labelled retained portion of every released batch for at least the product's shelf life, so that a later complaint can be checked against the material actually supplied.

## Checking a method for bias

A sampling method's bias cannot be seen in its own results. It can be found only by comparing it with a reference method on the same material, as the engineer did with the scoop and the riffled whole sack. The comparison is worth repeating whenever the material, the containers or the sampling equipment change, and at intervals even if nothing obvious has changed. A paired design, both methods on each of several containers, is more sensitive than two separate sets of containers, because the container-to-container variation cancels out of each pair. The plant now runs such a check on the premix and the colour blend once a year, ten pairs each, and records the mean difference and its confidence interval so that a slowly growing bias would be noticed.

## Taking samples safely

Sampling points are often at the most hazardous places in a plant: under a discharge valve, beside a rotating feeder, at an open chute where dust escapes. Cross-stream samplers are best built in, with a guarded port and a cup on a handle or an automatic cutter, so that nobody reaches into a moving stream or a feeder to fill a jar. Fine powders sampled from an open stream should be taken with the dust extraction running and with the protective equipment the material's safety data sheet calls for.

## Sampling for a decision

How many samples a test needs depends on the decision it supports, which is worth stating before sampling starts.

- **Estimating a mean**, such as a lot's average filler content, needs enough samples to bring the margin of error well inside the distance to the specification limit. The tool above answers it.
- **Estimating a spread**, such as a blend's standard deviation, needs more. Chapter 3 showed that ten samples leave the true standard deviation uncertain by a factor of nearly three from bottom to top of its interval.
- **Detecting rare failures**, such as a blank lid, needs very many, as Chapter 9's rule of three showed, and is often better done by design arithmetic than by inspection.

A sampling plan written down before the samples are taken, stating where, how, how many, how large and for what decision, is the best defence against all of these errors. It also stops a result that is inconvenient from being explained away afterwards as a sampling problem, or a result that is welcome from being accepted without asking how the sample was taken.

## How this applies to a small Australian business

Look at how your samples are taken before trusting what they say. If they come from the top of a bag, the side of a bin or a single place in a blender, compare them once with samples taken from the falling stream as the container is filled or emptied, and with the whole container divided properly. A riffle divider is cheap and pays for itself the first time it stops good material being rejected or bad material released, and it takes only minutes to learn to use well. Then work out how many samples your decision actually needs, from a standard deviation measured with the method you will use.

## Exercise: a smaller margin on the premix

The plant wants to estimate each premix batch's mean stabiliser content within ±0.15 percentage points at 95% confidence, using the new stream sampling method, whose standard deviation is 0.25. (a) How many 0.5 g results does it need, using n = (z σ ÷ E)² with z = 1.96? (b) If each sack contributes one combined sample and a batch fills eight sacks, is that enough?

**Worked answer.** (a) n = (1.96 × 0.25 ÷ 0.15)² = 3.267² = 10.67, so **11** results, which is what the sample size for a mean tool returns after rounding up. (b) **No.** Eight sacks give eight results, enough for a margin of 1.96 × 0.25 ÷ √8 = ±0.17 points, a little wider than required. The plant could assay two test portions from each sack's combined sample, giving 16 results, provided it remembers that two portions from one sample share that sample's own error and are not fully independent.
