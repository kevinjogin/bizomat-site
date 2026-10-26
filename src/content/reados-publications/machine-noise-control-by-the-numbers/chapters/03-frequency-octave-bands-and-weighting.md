---
book: machine-noise-control-by-the-numbers
chapterSlug: frequency-octave-bands-and-weighting
order: 3
title: "Frequency, octave bands and weighting"
description: "Break machine noise into octave bands, see what A and C weighting do, read a low-frequency problem from the gap between them, and catch a high-frequency absorber bought to stop a rumble."
draft: false
---

A single decibel figure hides most of what matters about a noise. Two machines with the same A-weighted level can sound completely different, one a high whine and the other a low rumble, and the same treatment will work on one and do almost nothing to the other. Absorbers, walls, barriers, silencers and isolators all perform differently at different frequencies, generally better at high frequencies and worse at low ones. Designing a noise control without knowing the frequency content of the noise is like choosing a filter without knowing what it must remove.

This chapter explains frequency and wavelength, the octave bands in which machine noise is measured and specified, the A and C frequency weightings, and how to read a spectrum. The running case finds that the store room behind CP-30's end wall was lined with thin acoustic foam to stop a rumble, which cut the A-weighted level by about 3 dB and left the rumble, which lived in the lowest octaves, almost exactly as it was.

## Frequency and wavelength

Frequency is the number of pressure fluctuations a second, in hertz. Young people hear from about 20 Hz to about 20,000 Hz; hearing is most sensitive between about 1,000 and 5,000 Hz, the range that carries most of the information in speech, and much less sensitive at low frequencies. Most machine noise sits between about 50 Hz and 10,000 Hz.

Each frequency has a **wavelength**, the distance between successive pressure peaks, equal to the speed of sound divided by the frequency. In air at about 20 °C, sound travels at about 343 m/s.

```figure
type: compare
title: Wavelength in air at the octave-band centre frequencies
cols: Wavelength | Quarter wavelength
caption: Wavelength = 343 m/s ÷ frequency, at about 20 °C. Many noise controls work only when they are comparable in size with the wavelength, which is why low frequencies are hard to control.
- 63 Hz | 5.44 m | 1.36 m
- 125 Hz | 2.74 m | 0.69 m
- 250 Hz | 1.37 m | 0.34 m
- 500 Hz | 0.69 m | 0.17 m
- *1,000 Hz | 0.34 m | 0.09 m
- 2,000 Hz | 0.17 m | 0.04 m
- 4,000 Hz | 0.09 m | 0.02 m
- 8,000 Hz | 0.04 m | 0.01 m
```

Wavelength is why frequency matters so much in noise control. A barrier 2 m high is large compared with a 0.17 m wavelength at 2,000 Hz and casts a deep acoustic shadow, but it is small compared with 5.44 m at 63 Hz, which bends round it easily. A porous absorber works well when its thickness is a reasonable fraction of a wavelength, roughly a quarter or more, so 50 mm of mineral wool absorbs well at 2,000 Hz and poorly at 125 Hz. A wall's resistance to sound rises with frequency. Every chapter that follows depends on this.

## Octave bands

Machine noise is analysed and specified in **octave bands**: frequency ranges each twice as wide as the one below, identified by their centre frequencies, 63, 125, 250, 500, 1,000, 2,000, 4,000 and 8,000 Hz. Each band covers a range from its centre divided by √2 to its centre multiplied by √2, so the 1,000 Hz band covers about 707 to 1,414 Hz. For finer work, each octave is split into three **one-third-octave bands**, and for tonal problems a narrowband analysis resolves individual tones.

The levels in all the bands add, by the energy addition of Chapter 1, to the overall level. A machine's octave-band sound power levels are the most useful data a maker can give, because they let every treatment be estimated band by band.

## A and C weighting

Because hearing is less sensitive at low and very high frequencies, a meter that weighted all frequencies equally would overstate the importance of low-frequency noise for hearing. The **A-weighting** applies a correction to each band that approximates the ear's sensitivity at moderate levels: it subtracts about 26 dB at 63 Hz, 16 dB at 125 Hz, 9 dB at 250 Hz and 3 dB at 500 Hz, leaves 1,000 Hz unchanged and adds about a decibel at 2,000 and 4,000 Hz. A-weighted levels, written dB(A), are used for hearing-loss risk, exposure and most noise limits.

The **C-weighting** is much flatter, reducing only the extreme bands slightly, and is used for peak noise measurement and for judging low-frequency content. An unweighted level, sometimes written dB(Z), applies no correction at all.

## The running case: CP-30's spectrum

This is an illustration. CP-30's octave-band sound power levels, unweighted, rise to a broad maximum between 125 and 250 Hz from its airend and motor, and fall towards high frequencies. Applying the A-weighting band by band shows which bands matter for hearing.

```figure
type: compare
title: CP-30's illustrative sound power spectrum
cols: Unweighted level | A-weighting | A-weighted level
caption: This is an illustration. The bands add to about 105.5 dB unweighted, 105.3 dB(C) and 100.3 dB(A). The A-weighted total is set mainly by the 500 to 2,000 Hz bands, even though the unweighted levels peak lower.
- 63 Hz | 98 dB | −26.2 dB | 71.8 dB(A)
- 125 Hz | 100 dB | −16.1 dB | 83.9 dB(A)
- 250 Hz | 99 dB | −8.6 dB | 90.4 dB(A)
- 500 Hz | 97 dB | −3.2 dB | 93.8 dB(A)
- *1,000 Hz | 95 dB | 0 dB | 95.0 dB(A)
- 2,000 Hz | 93 dB | +1.2 dB | 94.2 dB(A)
- 4,000 Hz | 89 dB | +1.0 dB | 90.0 dB(A)
- 8,000 Hz | 83 dB | −1.1 dB | 81.9 dB(A)
```

Two things follow for treatment. For the A-weighted level at the bench, and for the fitter's hearing, the bands from 500 to 2,000 Hz matter most, and those are bands where absorbers, enclosures and barriers work well. But the unweighted energy is largest at 125 to 250 Hz, and anywhere the higher frequencies are removed, by a wall for example, the low frequencies are what remain.

## Reading the gap between C and A

The difference between a noise's C-weighted and A-weighted levels is a quick indicator of its low-frequency content. Because the two weightings agree above about 500 Hz and differ sharply below, a noise with little low-frequency energy has C and A levels within a few decibels of each other, and a noise dominated by low frequencies has a C level well above its A level. CP-30's own spectrum has a gap of about 5 dB, a moderate amount of low-frequency content. A noise that has passed through a wall, which removes high frequencies far more than low, usually has a much larger gap.

## The error: a high-frequency cure for a low-frequency rumble

This is an illustration. Behind the workshop's end wall, near CP-30, is a store room about 6 × 4 × 3 m, where a storeperson works part of the day. They complained of a constant **rumble**. A sound level meter in the store read about **59.1 dB(A)**, which seemed modest, and the workshop lined 40 m² of the store's walls with 25 mm acoustic foam, bought because it was sold as "acoustic".

After the foam was installed, the A-weighted level fell to about **55.8 dB(A)**, but the storeperson reported no change. The C-weighted level told the story: about **73.9 dB(C)** before, about **73.4 dB(C)** after. The noise in the store, having passed through the end wall, was dominated by the 63 and 125 Hz bands, where 25 mm of foam absorbs almost nothing, because it is a small fraction of a 2.7 m or 5.4 m wavelength.

```figure
type: line
title: Illustrative absorption coefficients of two linings, by octave band
x: Octave-band centre frequency, Hz
y: Absorption coefficient
legend: 25 mm acoustic foam | 100 mm mineral wool on battens
ymin: 0
ymax: 1
caption: This is an illustration of typical behaviour, not a product's data. Thin porous linings absorb well only at higher frequencies; thicker linings with an air space reach lower.
- 63 | 0.05 | 0.25
- 125 | 0.08 | 0.60
- 250 | 0.25 | 0.95
- 500 | 0.60 | 1.00
- 1000 | 0.90 | 1.00
- 2000 | 0.95 | 1.00
- 4000 | 0.95 | 1.00
- 8000 | 0.95 | 1.00
```

The foam reduced the store's reverberant level by about 8.6 to 8.8 dB in the bands from 1,000 Hz up, by about 0.9 dB at 125 Hz and by nothing at 63 Hz. It removed the part of the noise the storeperson was not complaining about. The check that would have caught it is an octave-band measurement before choosing a treatment, or at least a C and A measurement: a gap of nearly 15 dB, as here, says the problem is low-frequency, and the treatment must work at low frequencies. The fix, which Chapters 7 and 9 support, was to deal with the rumble at its path, the end wall and the compressor's mounting, rather than in the room. The general lesson is that a treatment's performance is a curve over frequency, and it must be matched to the spectrum of the noise it is meant to reduce.

## Tones

Some machines produce strong **tones**, single frequencies that stand out above the broadband noise: the blade-passing frequency of a fan, the gear-mesh frequency of a gearbox, the electrical hum of a transformer at twice the mains frequency. A tone at a frequency where hearing is sensitive is far more annoying than broadband noise of the same level, and several assessment methods add a penalty for tonal noise. Tones also call for specific treatments: a resonator tuned to the tone, a change of speed or blade count, or a mount that isolates the frequency. A one-third-octave or narrowband analysis finds them; an octave-band analysis may hide a tone inside a band.

This is an illustration. If CP-30's cooling fan has 11 blades and turns at 1,470 rpm, its blade-passing frequency is 11 × 1,470 ÷ 60 ≈ **270 Hz**, in the 250 Hz octave band, and a tone there would add to the airend's broadband noise in the same band. A change to a fan with a different blade count, or a different speed, moves the tone, which can move it away from a structural resonance or into a band where the enclosure works better.

## Frequency and hearing damage

Noise-induced hearing loss is not spread evenly over frequency. It typically appears first as a loss of sensitivity around 3,000 to 6,000 Hz, seen on an audiogram as a dip, often called a notch, centred near 4,000 Hz, and spreads to neighbouring frequencies with continued exposure. Because those frequencies carry the consonants that make speech intelligible, an early loss shows up as difficulty following conversation in background noise, long before quiet sounds become inaudible. The A-weighting reflects the ear's sensitivity rather than its vulnerability, but in practice A-weighted exposure is the established measure of risk, and the exposure standard in Chapter 4 is set in dB(A).

The low-frequency rumble of the store room is a different kind of problem. At about 59 dB(A) it is no risk to hearing, but low-frequency noise is a common cause of annoyance, fatigue and complaint, it travels through walls and structures with little loss, and it is the part of a machine's noise that survives longest along every path. A noise control plan should therefore look at both: the A-weighted levels for hearing, and the low-frequency bands for the complaints that A-weighted figures do not explain.

## Measuring a spectrum on site

An octave-band measurement needs a sound level meter with octave-band filters, or a meter that records one-third-octave bands and combines them. For a steady machine like CP-30, a measurement of the **equivalent continuous level**, the energy average over the measurement period, in each band, over a period long enough to include its load and unload cycle, characterises its noise at that position. For a varying or impulsive machine, longer periods and the maximum levels in each band are recorded as well.

The position matters as much as the instrument. A spectrum measured at the bench describes the bench; one measured close to CP-30 describes the machine's near field; one measured in the store describes what has come through the wall. Each is useful for a different decision, and each should be recorded with its position, the machine's operating condition, the time, and the background with the machine stopped, as Chapter 10 sets out. The store-room error above would have been avoided by a single octave-band measurement at the storeperson's desk, taken in a few minutes before the foam was ordered.

## Specifying by band

Because treatments are frequency-dependent, a noise target is best specified by band as well as overall, and a treatment's performance should be stated by band. An enclosure maker who quotes a single "insertion loss of 20 dB" has quoted an average that may hide 8 dB at 125 Hz and 30 dB at 2,000 Hz. A noise control design calculates band by band, adds the bands at the end, and reports both the overall A-weighted result and the low-frequency bands, so that a rumble left behind is visible on paper before it is heard.

## Exercise: what the foam did, band by band

The store's octave-band levels before the foam were about 72, 70, 62, 55, 50, 45, 40 and 35 dB in the bands from 63 Hz to 8,000 Hz. The foam reduced them by about 0, 0.9, 3.9, 7.1, 8.6, 8.8, 8.8 and 8.8 dB. Using the A-weighting, which bands set the store's A-weighted level before the foam, and which set it after? Why did the storeperson hear no change?

**Worked answer.** Before the foam, the A-weighted band levels are about 45.8, 53.9, 53.4, 51.8, 50.0, 46.2, 41.0 and 33.9 dB(A), totalling about 59.1 dB(A), with the 125 to 1,000 Hz bands contributing most. After the foam, the higher bands fall by 7 to 9 dB, the 125 Hz band by less than a decibel and the 63 Hz band not at all, so the A-weighted total falls to about 55.8 dB(A), now set mainly by the 125 and 250 Hz bands.

The storeperson heard no change because what they were hearing was the rumble in the 63 and 125 Hz bands, about 72 and 70 dB unweighted, which barely moved. The A-weighting discounts those bands heavily, which is why the meter's dB(A) figure fell while the complaint did not. For a low-frequency complaint, the unweighted or C-weighted level, and the bands below 250 Hz, are the measures to watch.
