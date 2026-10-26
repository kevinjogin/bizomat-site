---
book: machine-noise-control-by-the-numbers
chapterSlug: decibels-and-how-they-combine
order: 1
title: "Decibels and how they combine"
description: "Read sound levels in decibels, add and subtract sources correctly, rank what sets the level at a work position, and catch a noise budget spent on the source that did not matter."
draft: false
---

Noise control is done in decibels, and decibels do not behave like ordinary numbers. Two machines that each make 85 dB together make 88 dB, not 170. A machine 10 dB quieter than its neighbour adds less than half a decibel to the total. Removing the quieter of two sources can make almost no difference, while removing the louder one can transform a room. An engineer who reasons about decibels as if they added like kilograms will spend money on the wrong machine and promise reductions that never arrive.

This chapter explains what a decibel measures, why the scale is logarithmic, how levels from several sources add, how a background level is subtracted, and how to rank the sources that set the level at a work position. The running case finds that a workshop's first noise budget went on quieter bench grinders, which would have lowered the level at the fitter's bench by about 0.2 dB, because the compressor in the corner set that level almost on its own.

## What a decibel measures

Sound is a small, rapid fluctuation of air pressure above and below the atmosphere's. The ear responds to an enormous range of those fluctuations: the quietest sound a young person can hear has a pressure fluctuation of about 20 micropascals, and sounds that damage hearing in moments reach tens of pascals, a million times more. A scale that covered that range in pascals would be awkward, and it would also be unlike hearing, which responds roughly to ratios rather than differences. The decibel scale compresses the range by using logarithms.

```figure
type: formula
title: Sound pressure level in decibels
formula: L_p = 20 × log₁₀(p ÷ p₀), with p₀ = 20 µPa
caption: The reference pressure p₀ is the conventional threshold of hearing in air. Each tenfold increase in pressure adds 20 dB.
- p | Root-mean-square sound pressure, Pa
- p₀ | Reference pressure, 20 µPa
- L_p | Sound pressure level, dB re 20 µPa
step: p = 0.02 Pa gives 20 × log₁₀(1,000) = 60 dB
step: p = 1 Pa gives about 94 dB
step: p = 20 Pa gives 120 dB
```

Because sound energy, or intensity, is proportional to the square of pressure, the same level can be written as 10 × log₁₀ of an energy ratio. Both forms give the same number. The energy form is the one used for adding sources, because what adds is sound energy, not pressure.

A few reference points help. A quiet office is around 40 to 50 dB, normal conversation at a metre around 60 dB, a busy workshop 80 to 95 dB, and a grinder or air carbon arc gouging close to the operator 100 dB and more. An increase of 3 dB doubles the sound energy; an increase of 10 dB multiplies it by ten, and is commonly described as sounding roughly twice as loud. A change of 1 dB is hard to hear; a change of 3 dB is noticeable; a change of 5 dB is clearly noticeable.

## Adding levels

Sound from separate machines is **incoherent**: their pressure fluctuations are unrelated, so their energies add, not their pressures. The total level of several sources at a point is found by converting each level to an energy, adding, and converting back.

L_total = 10 × log₁₀(10^(L₁÷10) + 10^(L₂÷10) + …)

Two rules follow, and between them they cover most practical cases. Two equal levels add to 3 dB more than either; four equal levels add to 6 dB more; ten add to 10 dB more. And a level more than 10 dB below another adds almost nothing.

```figure
type: compare
title: Adding two levels: how much the higher one rises
cols: Difference between the two levels | Add to the higher level
caption: Values from L_total = 10 × log₁₀(10^(L₁÷10) + 10^(L₂÷10)), rounded to 0.1 dB.
- *Equal levels | 0 dB | 3.0 dB
- One apart | 1 dB | 2.5 dB
- Two apart | 2 dB | 2.1 dB
- Three apart | 3 dB | 1.8 dB
- Four apart | 4 dB | 1.5 dB
- Six apart | 6 dB | 1.0 dB
- Ten apart | 10 dB | 0.4 dB
- Fifteen apart | 15 dB | 0.1 dB
```

The table is worth knowing by heart, because it answers the most important question in noise control without a calculator: which source matters? For more than two sources, or for subtracting a background, the WORKOS [Machinery Noise calculator](/tools/sound-level/) does the arithmetic. A source well below the loudest is not worth treating until the loudest has been dealt with.

## Subtracting a background

The same arithmetic runs backwards. If a measured total includes a known background, the level of the source alone is found by subtracting energies:

L_source = 10 × log₁₀(10^(L_total÷10) − 10^(L_background÷10))

This is an illustration. If a machine's position measures 88 dB with the machine running and 84 dB with it stopped, the machine alone makes about 10 × log₁₀(10^8.8 − 10^8.4) ≈ **85.8 dB**. The subtraction becomes unreliable as the two numbers approach each other: when the total is only 1 or 2 dB above the background, small measurement errors produce large errors in the result. Chapter 10 returns to this when measuring the effect of a change.

## The running case: what sets the level at the bench

This is an illustration. CP-30 has an A-weighted sound power level of about **100.3 dB(A)**, a quantity Chapter 2 explains. At the fitter's bench, 4 m away across the workshop, it produces about **86.8 dB(A)**, including the sound reflected from the walls and roof, which Chapter 5 works out. The rest of the workshop's work, grinding, hammering and the occasional cut-off saw, adds an average of about **78 dB(A)** at the bench when the compressor is stopped.

The total at the bench is 10 × log₁₀(10^8.68 + 10^7.8) ≈ **87.3 dB(A)**. The compressor contributes about 88% of the sound energy arriving at the bench, the rest of the shop about 12%.

## The error: treating the source that did not matter

This is an illustration. The fitter complained about noise at the bench, and the workshop's first response was to replace two old bench grinders with quieter models, which lowered the shop's background at the bench from about 78 dB(A) to about 75 dB(A). The purchase was a reasonable reaction to the noisiest thing anyone could see being used.

At the bench, the new total is 10 × log₁₀(10^8.68 + 10^7.5) ≈ **87.1 dB(A)**: a reduction of about **0.2 dB**, which nobody could hear and no meter would reliably show. Even removing the rest of the shop's noise entirely would only have reduced the bench to the compressor's own 86.8 dB(A), half a decibel. By contrast, reducing the compressor's contribution at the bench by about 11 dB, to 76 dB(A), would bring the total down to about **80.1 dB(A)**.

```figure
type: bars
title: Level at the fitter's bench, dB(A)
unit: dB(A)
max: 90
caption: This is an illustration. Quieter grinders cut the bench level by about 0.2 dB because the compressor sets it; treating the compressor cuts it by about 7 dB.
- As found: compressor and shop | 87.3
- Quieter grinders, compressor unchanged | 87.1
- Compressor alone, shop silent | 86.8
- *Compressor reduced to 76 dB(A) at the bench | 80.1
```

The check that would have found it is a **source ranking**: measure the bench with the compressor stopped and with it running, or estimate each source's contribution, and list them from loudest to quietest. The list shows at once that the compressor dominates, and that nothing else is worth treating until it has been. The grinders were a sensible purchase for the grinding operator's own exposure, but they did nothing for the fitter. The general lesson is that a noise budget should be spent in order of contribution at the receiver, and the contribution must be found before the money is committed.

## Ranking sources in practice

A source ranking can be made by measurement, by estimate or both.

- **By switching**: measure the level at the receiver with each source running alone, or with each source stopped in turn, and subtract the background. This is the most direct method, but it needs the machines to be controllable and the background to be steady.
- **By estimate**: calculate each source's contribution at the receiver from its sound power, distance and the room, as the following chapters show, and add them. This works before the machines are installed, which is when changes are cheapest.
- **By a combination**: estimate, then check the dominant contributions with a few measurements.

The ranking should be made at each receiver that matters, because a source that dominates at one work position may be insignificant at another. CP-30 dominates at the fitter's bench; at the grinding station across the shop, the grinders dominate and the compressor is a background.

## When energies do not simply add

The energy addition above assumes that the sources are unrelated, which is true of separate machines and of broadband noise generally. It is not quite true of two sound waves that come from the same source and carry the same pure tone, such as the direct sound of a transformer's hum and its reflection from a nearby wall. Such waves are **coherent**: at some points they arrive in step and their pressures add, giving up to 6 dB more than one alone; at others they arrive out of step and largely cancel. The result is a pattern of loud and quiet spots, spaced about half a wavelength apart, which is about 1.7 m at 100 Hz and about 0.17 m at 1,000 Hz.

Two practical consequences follow. A measurement of a tonal machine taken at one point can be several decibels high or low by chance, so tonal noise is measured at several positions and the results averaged on an energy basis. And attempts to cancel noise by adding sound, active noise control, work well only for low-frequency, tonal noise in a confined space such as a duct or a headset, where the coherence can be controlled. For the broadband noise of most machines, including CP-30's, the energy addition is the right tool, and the rest of this book uses it.

## Receivers, not machines

A machine does not have a single "noise level"; it has a sound power, and it produces different levels at different places. The levels that matter are the ones at the receivers: the ears of the people who work nearby, the windows of a neighbour, the microphone of a test bench. A noise control decision should therefore start from a list of receivers, the level at each and the target for each, and only then turn to the sources. For CP-30's workshop, the first list has two receivers: the fitter's bench, where the level is 87.3 dB(A) and the fitter spends six hours a day, and the compressor itself, where a maintenance fitter spends perhaps half an hour a week at about 93 dB(A).

## Levels at different times

The arithmetic above adds levels that occur at the same time. A worker's exposure is a different question: it averages the levels that occur at different times through a shift, weighted by how long each lasts. The mathematics is the same energy average, with each level weighted by its duration, and Chapter 4 works it through. The two must not be confused: a machine that runs for half the shift contributes half its energy to the daily average, which is about 3 dB less than if it ran all day, not half the decibels.

## Decibels of other quantities

The decibel is a way of expressing a ratio, so it appears for other quantities in noise control: sound power level, which Chapter 2 introduces, uses a reference power of 1 picowatt; transmission loss and insertion loss, in Chapters 6 to 8, are differences between two levels; and vibration levels can also be expressed in decibels. In every case, a decibel figure without its reference or its meaning is incomplete. A brochure that says a machine is "75 dB" without saying whether that is sound power or sound pressure, at what distance, and with what weighting, has not yet said anything useful, as Chapter 2's error shows.

## Rounding and precision

Sound levels in noise control are normally stated to the nearest decibel, or to a tenth for calculations that will be combined. Field measurements of the same machine on different days commonly vary by a decibel or two, and estimates by more. A calculation carried to a tenth of a decibel is useful for seeing which way a change goes and for adding levels consistently; it is not a claim that the result will be measured to that precision. When a prediction is compared with a target, the margin should be several decibels, not a fraction of one.

## Exercise: a second compressor

The workshop plans a second, identical compressor, placed so that it is about 8 m from the fitter's bench. In this book's illustrations it would contribute about 86.0 dB(A) at the bench, because at 8 m the reflected sound in the room dominates. What would the bench level be with both compressors and the shop's background of 78 dB(A)? How much of the increase does a 3 dB rule of thumb predict?

**Worked answer.** The total is 10 × log₁₀(10^8.68 + 10^8.60 + 10^7.8) ≈ **89.7 dB(A)**, an increase of about 2.4 dB over the present 87.3 dB(A). The two compressors alone would give about 89.4 dB(A), almost 3 dB above one, because their contributions at the bench differ by less than a decibel.

The rule of thumb, "two equal sources add 3 dB", predicts the increase well here because the two compressors' contributions are nearly equal and together they dominate the background. It would predict badly if the second machine were much further away or much quieter. The second compressor also changes the treatment plan: any measure that treats only one compressor leaves the other one setting the bench level, so the controls of the following chapters must be planned for both.
