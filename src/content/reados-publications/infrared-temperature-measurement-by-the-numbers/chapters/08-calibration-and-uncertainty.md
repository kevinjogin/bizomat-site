---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: calibration-and-uncertainty
order: 8
title: "Calibration, traceability and the uncertainty budget"
description: "Black-body sources, traceability, field checks with drilled-hole billets, IH-40's uncertainty budget of ±8 K, guard bands, and an emissivity set against a thermocouple read too soon."
draft: false
---

Every chapter so far has found a way for an infrared reading to be wrong, and a way to make it less wrong. The last step is to put numbers on what is left: how far IH-40's pyrometer can be trusted, on a real billet, through a real window, once everything in the earlier chapters has been done as well as it reasonably can. That number, the **measurement uncertainty**, decides whether the instrument can sort billets into a ±30 K band at all, and how far inside the band the diverter's limits should be set.

This chapter explains how a pyrometer is calibrated against a black body and how that calibration is tied to the national temperature scale, describes the field checks that show whether the installed instrument still agrees with reality, builds an uncertainty budget for IH-40, uses it to set guard bands on the diverter, and ends with an emissivity setting that was made against a thermocouple read too soon.

## Calibration against a black body

A pyrometer is calibrated by pointing it at a source whose radiance is known, and adjusting or correcting it until it reads that source's temperature. The source is a **black-body cavity**: a heated hollow, usually a cylinder or cone with a small opening, whose interior walls are held at a uniform, measured temperature. As Chapter 1 explained, radiation leaving a small opening in a uniform cavity is very nearly black-body radiation, whatever the walls are made of. The cavity's effective emissivity, very close to 1, and the uncertainty of its temperature are stated on its own calibration certificate.

A calibration compares the pyrometer's reading with the cavity's temperature at several points across the instrument's range, with the emissivity set to the cavity's effective emissivity, usually 1.0, and records the differences and their uncertainty. A calibration certificate gives those results. It does not tell the user anything about emissivity, windows, reflections or spot fill on their own process, because none of those exist in the laboratory. It answers one question only: if this instrument looks at a black body, what does it read?

## The temperature scale and traceability

The temperature of the cavity is itself measured against something, and that chain of comparisons ends at the international temperature scale. The scale in use, ITS-90, defines temperature through fixed points, such as the freezing points of pure metals, and through prescribed instruments that interpolate between them. Above the freezing point of silver, 961.78 °C, it defines temperature by radiation thermometry itself, using Planck's law relative to a fixed-point black body. So the calibration of a pyrometer at IH-40's 1,200 °C rests directly on the same law this book began with.

In Australia, the National Measurement Institute maintains the national standards of measurement, and NATA accredits calibration laboratories whose results can be traced back to them. A calibration certificate from an accredited laboratory, with its stated uncertainty, is what makes a pyrometer's reading **traceable**: tied, by an unbroken chain of comparisons each with a stated uncertainty, to the national standard. Traceability does not make a reading right on the process; it makes the instrument's own contribution to the error known.

## Field checks

Between calibrations, the installed instrument should be checked on the process, which exposes everything the laboratory cannot: emissivity, window, path, alignment and the instrument's own drift. Three checks suit IH-40.

1. **A reference instrument.** A portable pyrometer at the same wavelength, with a current calibration certificate, aimed at the same spot on the same billets through a clean path. Agreement within the two instruments' combined uncertainty confirms the installed one; a steady difference points to its window, alignment or settings.
2. **Drilled-hole billets.** Billets with a small hole drilled to a known depth near the measured surface, fitted with a calibrated thermocouple and run through the heater. The thermocouple reads the billet's temperature directly, once the billet has evened out, which is the reference Chapter 2 used for emissivity.
3. **Instrument comparison.** The disagreement alarm between the ratio and single-wavelength instruments (Chapters 4 and 5), and the ratio instrument's signal strength, which watch the installation continuously between formal checks.

```figure
type: steps
title: IH-40's measurement assurance
caption: The laboratory calibration covers the instrument; the field checks cover the installation. Both are recorded.
- Laboratory calibration against a black body | annually, by an accredited laboratory; certificate kept
- Window transmission measured | at each cleaning, with and without the window
- Reference pyrometer comparison | monthly, on production billets
- Drilled-hole billets | when the bar, surface or heating cycle changes
- * Uncertainty budget reviewed | whenever any of the above changes a component
```

## IH-40's uncertainty budget

An uncertainty budget lists each source of error, estimates its size as a standard uncertainty, which is roughly the standard deviation it adds, and combines them by root-sum-of-squares, on the assumption that they are independent. The combined standard uncertainty is then multiplied by a coverage factor, usually 2, to give an expanded uncertainty that covers about 95% of cases.

This is an illustration for IH-40's single-wavelength pyrometer at 1.0 µm, reading a scaled billet at 1,200 °C. The sensitivities come from the earlier chapters: 1.78 K for each 0.01 of emissivity, and 1.51 K for each 1% of signal lost.

- **Calibration**, from the certificate: ±3.0 K at a coverage factor of 2, so **1.50 K** standard.
- **Emissivity**: billet-to-billet spread of ±0.03 around the setting, treated as rectangular, so 0.03 ÷ √3 = 0.0173, worth **3.09 K**.
- **Window**: transmission drifting by up to 2% between cleanings, treated as rectangular, worth 2 × 1.51 ÷ √3 = **1.75 K**.
- **Reflection**: 0 to +2.2 K from the hot surroundings (Chapter 5), corrected to its midpoint and treated as rectangular, **0.64 K**.
- **Drift** between calibrations: ±1 K, rectangular, **0.58 K**.
- **Repeatability** on steady billets, from the reading log: **1.00 K**.

The combined standard uncertainty is √(1.50² + 3.09² + 1.75² + 0.64² + 0.58² + 1.00²) = **4.07 K**, and the expanded uncertainty at a coverage factor of 2 is about **±8.1 K**. The largest component, by far, is emissivity, which is why Chapters 2 to 4 spent so long on it. The laboratory calibration, which is the part most people think of as accuracy, is the third largest.

```figure
type: bars
title: IH-40's uncertainty budget at 1,200 °C, standard uncertainties
unit: K
max: 4.5
caption: This is an illustration. Combined by root-sum-of-squares: 4.07 K standard, about ±8.1 K expanded at a coverage factor of 2. Emissivity dominates.
- * Emissivity, ±0.03 | 3.09
- Window drift, 2% | 1.75
- Calibration certificate | 1.50
- Repeatability | 1.00
- Reflection | 0.64
- Drift between calibrations | 0.58
- Combined | 4.07
```

## Guard bands

The diverter sorts billets against the accepted band of 1,170 to 1,230 °C. If it sorted on the limits themselves, a billet reading 1,228 °C might truly be 1,236 °C and be forged out of band. Setting the diverter's limits inside the band by the expanded uncertainty, a **guard band**, makes sure that a billet accepted is very probably inside the true band.

This is an illustration. With ±8.1 K expanded uncertainty, the diverter's limits become about **1,178 °C and 1,222 °C**. The price is that some billets truly inside the band are diverted: a billet at 1,175 °C that reads 1,175 °C goes back for reheating, although it was acceptable. The narrower the uncertainty, the less is lost to guard bands, which puts a cost on every component in the budget. Halving the emissivity spread, for example by better control of the bar's surface or by the ratio instrument where the surface is grey enough, would bring the expanded uncertainty from about ±8.1 K to about ±6 K and widen the usable band by about 4 K.

Random Error and Drift by the Numbers covers the statistics of repeated readings and drift in more depth, in [its chapter on drift checks and the uncertainty budget](/reados/publications/random-error-and-drift-by-the-numbers/drift-checks-and-the-uncertainty-budget/).

## The reference is not the truth either

Every field check compares the pyrometer with something else, and the something else has its own errors. A drilled-hole thermocouple has its calibration uncertainty and its tolerance class. It conducts heat along its sheath and wires out of the hole, so it can read slightly low if the hole is shallow relative to the sheath's diameter. It lags behind a changing temperature, because its tip must heat through. And it measures the temperature at the bottom of its hole, not at the surface the pyrometer sees, which in a billet still evening out after heating is not the same thing, as the error below shows.

A portable reference pyrometer has its own calibration, and it shares the installed instrument's sensitivity to emissivity if it works at the same wavelength with the same setting. That is a strength for checking the installation, because the comparison isolates the window, alignment and drift, and a weakness for checking the emissivity setting, which both instruments share.

The rule is to know the uncertainty of the reference as well as the instrument under test, and to choose the reference to suit the question. For the emissivity question, the drilled-hole billet, read once it has evened out. For the installation question, the reference pyrometer. For the instrument question, the black-body laboratory.

## How often to calibrate

There is no single right interval. A sensible starting point is the maker's recommendation, often a year for a process pyrometer. The interval is then adjusted on evidence: if successive calibrations find the instrument within a small fraction of its uncertainty, it can be lengthened; if they find it near or beyond its limits, it should be shortened, and the field checks between calibrations should be examined to see when the drift began. An instrument whose readings control product that cannot be recovered, such as IH-40's overheated billets, deserves a shorter interval than one used only for monitoring.

## The error: an emissivity set against a thermocouple read too soon

This is an illustration. When the forge first commissioned IH-40, the commissioning engineer set the pyrometer's emissivity using a drilled-hole billet. The hole was 10 mm deep, near the billet's mid-length, with a thermocouple in it. The billet was run through the coil, and the engineer read the thermocouple at the moment the billet passed the pyrometer: **1,185 °C**, against the pyrometer's 1,200 °C at its initial setting of 0.85. The engineer raised the emissivity setting until the pyrometer read 1,185 °C, which took it to about **0.94**, and wrote that into the setting sheet.

Induction heating puts heat into a billet from the outside in, so a billet leaving the coil has a surface hotter than its interior, and takes some seconds to even out. At the moment of passing the pyrometer, the thermocouple 10 mm down was still behind the surface, and its reading of 1,185 °C was not the surface temperature the pyrometer sees. Raising the emissivity to make the pyrometer agree with it built that lag into the setting. With the controller holding the reading at 1,200 °C and the setting at 0.94, billets left the coil with their surfaces at about **1,215 °C**, 15 K hotter than intended, and the cold-reject bin stayed almost empty.

The error was found at the first monthly reference check, when a calibrated portable pyrometer at 1.0 µm, set to 0.85, read about 1,215 °C on billets the installed instrument reported at 1,200 °C. Re-examining the drilled-hole record showed the thermocouple still rising after the billet had passed the pyrometer, levelling at about the pyrometer's reading some seconds later. The forge re-ran the check, recording the thermocouple until it levelled and comparing with the pyrometer's reading on the same billet held still, and reset the emissivity to 0.85. The setting sheet now states how emissivity is to be checked, including the wait.

```figure
type: checklist
title: Checks before trusting an uncertainty budget
caption: Each component must be estimated from evidence on the installed instrument, not from a data sheet alone. The last line is this chapter's error.
- Calibration uncertainty from a current certificate | at the working temperature
- Emissivity spread measured on production billets | the largest component for IH-40
- Window transmission measured at each cleaning | drift between cleanings estimated
- Reference instruments' own uncertainty known | thermocouple class, reference pyrometer certificate
- Guard bands set from the expanded uncertainty | 1,178 °C and 1,222 °C for IH-40
- x Reference read before the billet had evened out | emissivity set to 0.94; billets 15 K hot
```

## Exercise: the budget with a ratio pyrometer

On bright bar, the forge relies on the ratio pyrometer. Its calibration certificate gives ±4.0 K at a coverage factor of 2; its non-greyness on bright bar, from the trial in Chapter 4, varies by ±0.005 in the emissivity ratio, rectangular, worth about 9.5 K for each 0.01; window and reflection effects are negligible for it; its drift is ±1 K rectangular; and its repeatability is 2.0 K. What is its expanded uncertainty, and what guard-banded limits would the diverter use?

**Worked answer.**

- Calibration: 4.0 ÷ 2 = **2.00 K**.
- Non-greyness: 0.005 ÷ √3 = 0.00289 in the ratio, × 950 K per unit = **2.74 K**.
- Drift: 1 ÷ √3 = **0.58 K**.
- Repeatability: **2.00 K**.
- Combined: √(2.00² + 2.74² + 0.58² + 2.00²) = **3.98 K**; expanded, about **±8.0 K**.

The diverter's limits for bright bar would be about 1,178 °C and 1,222 °C, almost the same as the single-wavelength instrument's on scaled bar. The ratio instrument gives no improvement in uncertainty here; what it gives is freedom from re-setting the emissivity every time the bar's surface changes, which on bright bar is where the larger risk lay. Its budget also has a component that the single-wavelength budget lacks and the illustration has set aside: the hot-background effect of Chapter 4, which was removed by moving the aiming point rather than estimated. If the aiming point ever moves back towards the coil, that component returns, and it is large enough to dominate the budget, so the setting sheet records the aiming point as part of the instrument's calibrated state.
