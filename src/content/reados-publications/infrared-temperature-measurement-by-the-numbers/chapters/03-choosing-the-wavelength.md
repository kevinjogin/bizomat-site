---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: choosing-the-wavelength
order: 3
title: "Choosing the wavelength"
description: "The shortest-wavelength rule, emissivity errors from 0.65 to 12 µm, the lower range limit, the air in the path, materials that are see-through, and a handheld gun that said IH-40 read 150 K high."
draft: false
---

An infrared thermometer does not look at all of a surface's thermal radiation. It looks through a filter at a band of wavelengths, chosen by its maker, and the band decides more about its accuracy on a real surface than anything else about it. Chapter 1 showed that short wavelengths turn a small change in temperature into a large change in signal, and Chapter 2 that they turn a large error in emissivity into a small error in temperature. Short wavelengths also have a price: they cannot see cool objects.

This chapter turns those findings into a rule for choosing a band, works out the numbers for IH-40's billets and for a forging die at a quarter of their temperature, deals with the air between the instrument and the target and with materials that are partly transparent, and ends with a handheld thermometer that was used to check IH-40's pyrometer and disagreed with it by 150 K.

## The rule

The working rule for measuring a surface whose emissivity is uncertain is: **use the shortest wavelength at which the instrument can still read the lowest temperature you need**. The reason is the factor λ × T² ÷ c₂ in Chapter 2's error formula. At a fixed temperature, the temperature error from a given emissivity error is roughly proportional to the wavelength. Halving the wavelength roughly halves the error.

This is an illustration for an emissivity error of 10%, a true emissivity of 0.765 against a setting of 0.85, which is a plausible error on a surface whose condition is not well known. Using the full Planck law, the reading is low by:

- at **1,200 °C**: 10.3 K at 0.65 µm, **15.7 K at 1.0 µm**, 24.9 K at 1.6 µm, 55.0 K at 3.9 µm, **94.5 K at 10 µm**;
- at **800 °C**: 5.5 K at 0.65 µm, 8.4 K at 1.0 µm, 13.3 K at 1.6 µm, 31.0 K at 3.9 µm, 59.6 K at 10 µm;
- at **400 °C**: 2.1 K at 0.65 µm, 3.3 K at 1.0 µm, 5.3 K at 1.6 µm, 12.6 K at 3.9 µm, 28.2 K at 10 µm.

At every temperature, the 10 µm error is around six times the 1.0 µm error. A 10% emissivity error is barely noticed by a 1.0 µm instrument on IH-40's billets and is fatal at 10 µm.

```figure
type: compare
title: Reading error from a 10% emissivity error, by wavelength and temperature
rowhead: Wavelength
cols: At 400 °C | At 800 °C | At 1,200 °C
caption: True emissivity 0.765, setting 0.85, full Planck law. All readings are low. The error grows roughly in proportion to wavelength and to the square of absolute temperature.
- 0.65 µm | −2.1 K | −5.5 K | −10.3 K
- * 1.0 µm | −3.3 K | −8.4 K | −15.7 K
- 1.6 µm | −5.3 K | −13.3 K | −24.9 K
- 3.9 µm | −12.6 K | −31.0 K | −55.0 K
- 10 µm | −28.2 K | −59.6 K | −94.5 K
```

## The lower limit

The rule's second half, "at which the instrument can still read", comes from the steep fall of short-wavelength radiation at lower temperatures (Chapter 1). Relative to IH-40's billet at 1,200 °C, the signal at:

- **1.0 µm** is 2.6% at 800 °C, 0.66% at 700 °C, 0.12% at 600 °C and 0.014% at 500 °C;
- **1.6 µm** is 10.3% at 800 °C, 1.5% at 600 °C and 0.40% at 500 °C;
- **3.9 µm** is 37% at 800 °C and 9.6% at 500 °C.

Every detector has a noise floor, and each instrument's range starts where its signal is large enough to read cleanly. The shorter the wavelength, the higher that starting point. As a rough picture, instruments around 1 µm suit metals from several hundred degrees up; those around 1.6 µm reach a couple of hundred degrees lower; mid-wave instruments reach lower again; and long-wave instruments in the 8 to 14 µm band read down to and below room temperature. Each maker's data sheet states the actual range, and that, not a rule of thumb, decides whether an instrument suits a job.

```figure
type: bars
title: Signal from a 700 °C billet, as a share of the 1,200 °C signal
unit: %
max: 55
caption: Calculated from Planck's law. A cold reject at 700 °C gives a 1.0 µm instrument under 1% of its normal signal, which sets the bottom of its useful range.
- * 1.0 µm | 0.66
- 1.6 µm | 4.34
- 3.9 µm | 25.95
- 8 to 14 µm band | 48.62
```

For IH-40, the 1.0 µm pyrometer with a range from 700 °C covers everything the diverter sorts. It cannot read a billet that failed to heat at all, which Chapter 1's exercise dealt with by an interlock.

```figure
type: decision
title: Choosing a pyrometer band for a metal surface
question: What is the lowest temperature the instrument must read?
caption: The shortest band that reads the lowest temperature gives the smallest emissivity error. Confirm the range on the maker's data sheet.
- Above about 600 °C | around 1 µm, as for IH-40's billets
- About 250 to 600 °C | around 1.6 µm
- About 100 to 300 °C | mid-wave, or 1.6 µm if its range allows
- Near room temperature | long wave, 8 to 14 µm, with emissivity measured carefully
```

## Narrow bands and wide ones

The calculations above treat each instrument as if it looked at a single wavelength. Real instruments look through a filter with a band of some width, and the band behaves roughly like a single effective wavelength somewhere within it, weighted towards the end where the target radiates most. The 8 to 14 µm band, worked out with the full Planck law across the band, gives a reading 93.8 K low on IH-40's billet for the same 10% emissivity error, close to the single-wavelength result at 10 µm.

At the other extreme, a total-radiation instrument with no filter collects everything, and its reading follows the Stefan–Boltzmann law: a 10% emissivity error gives a reading low by the fourth root of 0.9, 38.3 K at 1,200 °C. That is better than a long-wave instrument on a hot target, because at 1,200 °C most of the radiation is at short wavelengths, but it is still more than twice the 1.0 µm error, and a broadband instrument also picks up every absorption band of the air and every reflection at every wavelength. For process measurement on hot metal, a narrow band at a short wavelength is the right choice; wide bands belong to cooler targets where there is no short-wavelength signal to use.

## IH-40's choice, in numbers

Putting the chapter's numbers together for IH-40's exit:

- the lowest temperature to read is a cold reject, about 700 °C, where the 1.0 µm signal is 0.66% of normal: inside a 700 to 1,400 °C instrument's range;
- the billet-to-billet emissivity spread of ±0.05 on scaled bar costs about ±9 K at 1.0 µm, against ±32 K at 3.9 µm and ±55 K at 10 µm;
- a 10% emissivity error, the size of a change of bar surface that nobody noticed, costs about 16 K at 1.0 µm: noticeable in the reject rates, but not a disaster;
- the protective window and the air path are transparent at 1.0 µm, and a silicon detector is fast enough to read a billet passing in a fraction of a second.

The forge's original choice of 1.0 µm was right. A shorter band, around 0.65 µm, would cut the emissivity error by another third, but would push the bottom of the range higher and make the instrument more sensitive to scattered daylight and the visible glow of the coil, so the forge stayed with 1.0 µm.

## The air in the way

Between the instrument and the target there is air, and air is not perfectly transparent in the infrared. Water vapour and carbon dioxide absorb strongly in some parts of the spectrum and hardly at all in others. Instrument makers place their working bands in the gaps, often called atmospheric windows, so that over the short paths of industrial measurement the air's absorption is negligible. The near-infrared bands around 1 µm and 1.6 µm, and the long-wave band from 8 to 14 µm used by most thermal cameras, are such windows.

Within a window, air at ordinary humidity over a metre or two takes away little. Steam, smoke, dust, flames and hot gases are another matter: they absorb, scatter and in the case of flames and hot gas add radiation of their own, and Chapter 5 deals with them as part of the path.

## Materials that are partly transparent

The emissivity relation ε = 1 − ρ holds for opaque surfaces. Some materials are not opaque at every wavelength. Glass transmits well in the visible and near infrared, so a 1 µm pyrometer aimed at glass sees through it to whatever is behind. Thin plastic films are transparent over much of the infrared. Silicon is transparent beyond about 1.1 µm.

For such materials the rule changes: the instrument must work in a band where the material is opaque, or at least strongly absorbing, so that what it sees comes from the material and not from behind it. Glass is measured at longer wavelengths where it absorbs strongly, and plastic films in narrow bands that match the plastic's own absorption. Instrument makers publish the bands for common materials. IH-40's steel billets are opaque at every infrared wavelength, so the question does not arise for them; it arises for the protective window in front of the pyrometer, which must be transparent at 1 µm, and Chapter 5 deals with it.

## The detectors behind the bands

The band also follows from the detector. Around 1 µm, silicon photodiodes are cheap, fast and quiet, which is one reason short-wavelength pyrometers are common on hot metal. Around 1.6 µm, indium gallium arsenide detectors extend the range downward. In the long-wave band, thermal detectors, such as the microbolometer arrays in thermal cameras, respond to the heating effect of the radiation and work at room temperature. Each has its own speed, noise and cost, but for the user the consequence is simple: the band, and therefore the emissivity sensitivity and lower limit, comes with the instrument type, and an instrument chosen for one job cannot be retuned for another.

## The error: a handheld gun that disagreed by 150 K

This is an illustration. The forge's maintenance technician, checking IH-40's pyrometer after the bright-bar trouble of Chapter 2, aimed the workshop's general-purpose handheld infrared thermometer at billets leaving the coil. The handheld works in the 8 to 14 µm band, has a range to 1,500 °C, and was left at its factory emissivity setting of 0.95. It read about **1,051 °C** on billets the fixed pyrometer reported at 1,200 °C. The technician concluded that the pyrometer was reading about 150 K high and raised an urgent work order to replace it, with a recommendation to cut the heater's power in the meantime.

The process engineer stopped the power cut and worked the numbers. The fixed pyrometer had been checked against drilled-hole thermocouple billets the week before. The scaled surface's emissivity in the 8 to 14 µm band had not been measured, but if it were about 0.80, a billet at 1,200 °C seen at 8 to 14 µm with the emissivity set to 0.95 would read, from the band-integrated Planck law, about **1,051 °C**, exactly what the handheld showed. At long wavelengths, a 16% error in emissivity is worth about 150 K at this temperature. The handheld was the instrument in error, not the pyrometer.

The work order was cancelled. The forge labelled the handheld "for surfaces below 300 °C with measured emissivity", and the comparison check for IH-40's pyrometer now uses a portable short-wavelength pyrometer with a calibration certificate, as Chapter 8 describes.

## What a long-wave handheld is good for

The handheld was not a bad instrument; it was the wrong one for that job. Long-wave handheld thermometers are excellent for comparisons on one surface: the same bearing housing this week and last, three phases of the same busbar, the inlet and outlet of the same pipe. In a comparison, an unknown emissivity affects both readings almost equally and largely cancels, especially near room temperature, where the emissivity error is small anyway. They are poor for absolute temperatures on hot metal of unknown emissivity, which is exactly where the forge used it.

Two habits keep them useful. Set the emissivity to a measured value, or measure a high-emissivity patch, whenever an absolute temperature matters. And never use a long-wave reading to adjust or condemn a short-wavelength process instrument: the two see different parts of the spectrum through different emissivities, and their disagreement on a hot, oxidised surface is expected, not a fault. Chapter 7 uses the same kind of instrument, a thermal camera, where it does belong.

## Exercise: the forging die

The press's die faces are preheated to about 250 °C before a run, and their surfaces are dull, oxidised steel with an emissivity somewhere between 0.80 and 0.90. The forge wants to check die temperature with a portable instrument set to 0.85. Would the 1.0 µm pyrometer do? How large is the emissivity error at 1.6 µm and in the 8 to 14 µm band?

**Worked answer.**

- At 1.0 µm, the signal from a 250 °C die is about **2 × 10⁻⁸** of the 1,200 °C billet signal, far below any 1 µm instrument's range. It cannot be used.
- At 1.6 µm, the signal is about 1.5 × 10⁻⁵ of the billet's: still too weak for most 1.6 µm instruments, whose ranges commonly start somewhat higher, so the data sheet must be checked.
- If a 1.6 µm instrument can read it, the emissivity uncertainty costs about **−1.8 K** at a true emissivity of 0.80 and **+1.7 K** at 0.90.
- In the 8 to 14 µm band, the same uncertainty costs about **−10.7 K** at 0.80 and **+10.5 K** at 0.90.

A long-wave instrument will read the die but needs its emissivity measured, for example with a high-emissivity paint patch on a cold die heated with it, to get much better than ±10 K. A 1.6 µm instrument whose range reaches 250 °C would give ±2 K without that effort.
