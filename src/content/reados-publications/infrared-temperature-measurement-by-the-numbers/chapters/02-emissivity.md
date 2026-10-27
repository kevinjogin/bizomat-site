---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: emissivity
order: 2
title: "Emissivity: why real surfaces read low"
description: "What emissivity is, how a wrong setting moves the reading at 1 µm and 10 µm, IH-40's scaled billets, measuring emissivity on site, and bright bar that sent the heater 55 K too hot."
draft: false
---

Chapter 1 described the black body, which radiates the most any surface can at its temperature. A real billet radiates less. How much less is its **emissivity**, a number between 0 and 1 that depends on the material, its surface, its temperature and the wavelength. An infrared thermometer cannot measure emissivity; it is told it, by a setting, and it divides the radiation it receives by that setting to work out what a black body would have sent. If the setting is wrong, the temperature is wrong.

This chapter defines emissivity, gives the error a wrong setting causes at the wavelengths used in practice, applies it to IH-40's scaled billets, sets out how to measure emissivity on site, and ends with a change of steel supplier that changed the billets' surface and drove the heater's control loop 55 K too hot.

## What emissivity is

The emissivity of a surface at a wavelength is the ratio of what it radiates to what a black body at the same temperature radiates at that wavelength:

ε = L_λ, surface ÷ L_λ, black body

For an opaque surface, one that transmits nothing, the radiation falling on it is either absorbed or reflected, and a surface absorbs at each wavelength exactly the fraction it emits. So:

ε = 1 − ρ

where ρ is its reflectivity. Shiny surfaces reflect a lot and emit little; dull, dark, rough or oxidised surfaces reflect little and emit a lot. That single relation explains most practical emissivity behaviour, and Chapter 5 uses its other half, the reflected radiation that a low-emissivity surface sends to the instrument.

## Typical values, and why they are only a start

Makers of infrared instruments publish tables of emissivity. AMETEK Land, for example, gives indicative values at 1 µm of **0.85** for oxidised steel and **0.35** for unoxidised steel. Optris's table gives oxidised steel values from 0.74 at 100 °C to 0.88 to 0.89 at several hundred degrees and above, polished steel from 0.07 at 100 °C up to about 0.38 at 1,000 °C, and polished copper as low as 0.02. Both makers stress that the values depend on surface finish, oxidation, temperature and wavelength, and Optris advises verifying emissivity under the actual measurement conditions for critical work.

The spread is the point. An oxidised steel billet and a freshly machined one, at the same temperature, differ in emissivity by a factor of two or more. Scale thickness, roughness, and even the angle of view change it by several hundredths. Tables are a starting point for choosing an instrument and a first setting. The setting used in production comes from a measurement on the real surface.

## The error from a wrong setting

An instrument set to emissivity ε_set, looking at a surface whose true emissivity is ε_true, receives ε_true × L_black body(T) and reports the temperature at which ε_set × L_black body would equal it. On the short-wavelength side of the peak, where Wien's approximation to Planck's law holds, the result is a simple formula:

1 ÷ T_indicated = 1 ÷ T_true − (λ ÷ c₂) × ln(ε_true ÷ ε_set)

For small errors it gives ΔT ≈ (λ × T² ÷ c₂) × (Δε ÷ ε). Two features stand out: the error grows with the wavelength, and with the square of the absolute temperature.

This is an illustration for IH-40's billet at 1,200 °C, 1,473.15 K, with the pyrometer at 1.0 µm set to 0.85. If the true emissivity is 0.80, the formula gives 1 ÷ T_indicated = 1 ÷ 1,473.15 − (10⁻⁶ ÷ 0.01438777) × ln(0.80 ÷ 0.85), so T_indicated = **1,190.9 °C**, a **9.1 K** low reading. Each 0.01 of emissivity is worth about 1.8 K at 1.0 µm at this temperature.

```figure
type: formula
title: Temperature error from a wrong emissivity setting
formula: 1 ÷ T_indicated = 1 ÷ T_true − (λ ÷ c₂) × ln(ε_true ÷ ε_set)
caption: This is an illustration for IH-40 at 1.0 µm. Wien's approximation; the full Planck law gives the same result to 0.1 K here.
- T_true | 1,473.15 K, the billet at 1,200 °C
- λ | 1.0 × 10⁻⁶ m
- ε_true, ε_set | 0.80 and 0.85
step: (λ ÷ c₂) × ln(0.80 ÷ 0.85) = −4.21 × 10⁻⁶ per K
step: T_indicated = 1 ÷ (6.788 × 10⁻⁴ + 4.21 × 10⁻⁶) = 1,464.0 K = 1,190.9 °C
```

## The same error at other wavelengths

Working the full Planck law for the same billet and the same setting of 0.85 gives the error for each true emissivity at four common working wavelengths:

- true emissivity **0.80**: −9.1 K at 1.0 µm; −14.5 K at 1.6 µm; −32.1 K at 3.9 µm; **−55.5 K at 10 µm**;
- true emissivity **0.90**: +8.7 K at 1.0 µm; +13.9 K at 1.6 µm; +31.5 K at 3.9 µm; +55.2 K at 10 µm;
- true emissivity **0.70**: −28.7 K at 1.0 µm; −167.6 K at 10 µm.

The 1.0 µm instrument keeps a ±0.05 uncertainty in emissivity inside about ±9 K, well within IH-40's ±30 K band. A 10 µm instrument looking at the same billet would turn the same uncertainty into ±55 K, wider than the whole band. This is the main reason pyrometers for hot metal work at the shortest wavelength that will read the temperature range, as Chapter 3 develops.

At lower temperatures, all the errors shrink, because the error goes as T². With true emissivity 0.80 and a setting of 0.85, the 1.0 µm error is −1.9 K at 400 °C and −4.8 K at 800 °C.

```figure
type: compare
title: Reading error on IH-40's 1,200 °C billet with the emissivity set to 0.85
rowhead: True emissivity
cols: 1.0 µm | 1.6 µm | 3.9 µm | 10 µm
caption: Calculated with the full Planck law. Positive means the instrument reads high. The accepted band is ±30 K.
- 0.70 | −28.7 K | −45.3 K | −98.6 K | −167.6 K
- 0.75 | −18.6 K | −29.5 K | −64.9 K | −111.3 K
- * 0.80 | −9.1 K | −14.5 K | −32.1 K | −55.5 K
- 0.85 | 0 | 0 | 0 | 0
- 0.90 | +8.7 K | +13.9 K | +31.5 K | +55.2 K
- 0.95 | +17.0 K | +27.3 K | +62.3 K | +110.0 K
```

## IH-40's scaled billets

A carbon steel billet heated in air grows a thin layer of oxide scale, and for most of IH-40's billets that scale is what the pyrometer sees. Its emissivity at 1.0 µm is high, around the 0.85 of the AMETEK Land table, but it is not constant. It depends on how thick the scale has grown, whether it has cracked or flaked, and how long the billet was stored and how rusty it was before heating.

This is an illustration. Suppose the forge's billets carry scale whose emissivity varies between 0.80 and 0.90 from billet to billet. At 1.0 µm and a setting of 0.85, that spreads the readings by about −9 to +9 K around the true temperature, with no change in the steel. The heater's control is trimming the coil's power against that spread; the diverter is sorting billets with it. Against a ±30 K band it is tolerable, and a large part of the reason is the short wavelength.

Two habits help. The setting should be made on billets of the kind and condition actually being run, and checked when the material or its storage changes. And anything that changes the surface, such as descaling, a different bar finish or a new heating rate, should trigger a new check.

## Emissivity moves with wavelength, temperature and angle

Three further effects make a single emissivity number less constant than it looks.

**Wavelength.** Bare metals emit noticeably better at short wavelengths than at long ones. AMETEK Land's 0.35 for unoxidised steel is a 1 µm figure; the same kind of surface measured across the long-wave band used by thermal cameras is far lower, and Optris lists polished steel at 0.07 near 100 °C. Oxides, paints and most non-metals vary much less with wavelength. A surface whose emissivity varies with wavelength is called **non-grey**, and that variation is exactly what limits the ratio pyrometer of Chapter 4.

**Temperature.** The emissivity of a bare metal rises as it heats: Optris's polished steel runs from 0.14 to 0.38 between 400 and 1,000 °C. Oxidation then raises it further, because a hot metal surface in air does not stay bare for long. A setting found at one temperature may not hold at another, which is why IH-40's setting is checked at production temperature, not on a cool billet.

**Angle.** Emissivity is usually stated for viewing square-on to the surface. Viewed at a steep angle, a surface's emissivity changes, and for many materials it falls off sharply as the view approaches grazing. A pyrometer should look at the target as nearly square-on as the installation allows, and the emissivity measured on site should be measured from the same angle as the production view. On a round billet, that means aiming at the middle of its side, not at its edge, where the view is oblique; Chapter 6 adds that the edge is also where the measured spot is most likely to spill off the target.

Taken together, these effects mean that the emissivity setting on an instrument is a calibration constant for one surface, one wavelength band, one temperature range and one viewing geometry. Change any of them and the setting should be checked again.

## Measuring emissivity on site

There are three practical ways to find the right setting.

1. **A reference temperature.** Bring the surface to a known temperature by another method, and adjust the emissivity setting until the pyrometer agrees. For a billet, a thermocouple in a small drilled hole near the measured surface, read once the billet has evened out, is the classic method; Chapter 8 deals with its pitfalls.
2. **A reference surface.** Paint a patch or fix a high-emissivity tape of known emissivity on the object, read both the patch and the bare surface, and set the emissivity so the bare surface reads the same as the patch. This suits objects up to the temperature limit of the paint or tape, and is the usual method in thermography (Chapter 7). It does not suit a billet at 1,200 °C.
3. **A cavity.** A deep hole or crevice in the surface behaves almost like a black body, because radiation is trapped in it, so a pyrometer looking into it reads close to the true temperature with the emissivity set to 1. Comparing the hole with the plain surface gives the surface's emissivity.

Each gives the emissivity at the instrument's own wavelength, which is the only one that matters for that instrument. A value measured with a 10 µm thermal camera does not transfer to a 1 µm pyrometer.

```figure
type: steps
title: Setting emissivity for IH-40's exit pyrometer
caption: Done on billets of the steel and surface condition in production, at production temperature, and repeated when either changes.
- Run billets of the production steel and surface | as they come from store, not cleaned
- Read a reference temperature | thermocouple in a drilled hole, or a portable instrument of known accuracy
- Adjust the pyrometer's emissivity | until it agrees with the reference at 1,200 °C
- Repeat on several billets | the spread shows the billet-to-billet variation in emissivity
- * Record the setting and its basis | steel, surface, date and the range found
```

## The error: bright bar and a control loop that chased it

This is an illustration. The forge changed its steel supplier, and the new bar came peeled and bright rather than as rolled with mill scale. In the few seconds a billet spends in IH-40's coil there is time for only a thin oxide to form, and the exit surface of the new billets was patchy and much more reflective than before. Nobody connected the change of bar with the pyrometer.

Within a day, the press operators were reporting billets that forged soft and sticky and showed signs of overheating, and the hot-reject bin was almost empty, which was odd. The pyrometer showed every billet close to 1,200 °C, because the heater's controller was raising the coil's power until it did. A check with a portable ratio pyrometer (Chapter 4) put the billets at about **1,255 °C**.

The process engineer worked the numbers. If the bright billets' emissivity at 1.0 µm had fallen to about **0.60**, a billet at 1,200 °C would read only 1,149 °C on the pyrometer set to 0.85, and the controller would push the coil until the reading came up to 1,200 °C, which for that surface meant a true temperature of about **1,254.5 °C**: 55 K hot and outside the band, with the diverter passing every one. A closed loop on a pyrometer does not just report an emissivity error; it acts on it.

The forge reset the emissivity for the new bar using drilled-hole thermocouple billets, found values between 0.58 and 0.66, and set 0.62. Because that spread is wider than with scaled bar, the forge also ordered the ratio pyrometer that Chapter 4 evaluates, and added a line to its purchasing procedure: any change of bar supplier or surface condition triggers an emissivity check before production.

## Exercise: finding the true emissivity

With the emissivity set to 0.85, IH-40's pyrometer reads 1,188 °C on a billet whose drilled-hole thermocouple, after the billet has evened out, reads 1,200 °C. What is the billet's true emissivity at 1.0 µm, and what setting should be used?

**Worked answer.** The pyrometer's signal is ε_true × L_black body(1,200 °C), and it reports 1,188 °C because that signal equals 0.85 × L_black body(1,188 °C). So:

ε_true = 0.85 × L(1.0 µm, 1,461.15 K) ÷ L(1.0 µm, 1,473.15 K)

From Planck's law, the ratio of the two radiances is 0.9230, so ε_true = 0.85 × 0.9230 = **0.785**. Wien's formula gives the same: ln(ε_true ÷ 0.85) = (c₂ ÷ λ) × (1 ÷ 1,473.15 − 1 ÷ 1,461.15) = −0.0802, so ε_true = 0.85 × e^−0.0802 = 0.785. The setting should be changed to about **0.79**, and the check repeated on several billets to see whether 0.79 is typical or one billet's value. If the billets vary, the setting should be the middle of their range, and the range itself goes into the uncertainty budget of Chapter 8: at 1.0 µm and 1,200 °C, a spread of ±0.03 around 0.79 is worth about ±5.6 K.
