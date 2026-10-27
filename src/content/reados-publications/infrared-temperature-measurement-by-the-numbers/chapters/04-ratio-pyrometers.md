---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: ratio-pyrometers
order: 4
title: "Ratio pyrometers: two colours instead of one"
description: "How a two-colour pyrometer cancels emissivity, windows and partial fill, why it amplifies non-greyness and noise, IH-40's trial on bright bar, and good billets rejected against a hot background."
draft: false
---

Chapter 2 ended with IH-40's heater driving bright billets 55 K too hot because their emissivity had changed and the single-wavelength pyrometer could not know. The obvious remedy is an instrument that does not need to know. A **ratio pyrometer**, also called a two-colour pyrometer, measures the radiation at two nearby wavelengths and works out the temperature from their ratio. If the surface's emissivity is the same at both wavelengths, it cancels, and so does anything else that reduces both signals equally: a dirty window, smoke, or a target that only partly fills the spot.

That is a large promise, and it comes with conditions. This chapter sets out how the ratio works, what it cancels and what it does not, how much it amplifies the effects that remain, how IH-40's trial on bright bar went, and how a ratio pyrometer at the coil exit rejected good billets because of what it saw behind them.

## How the ratio works

A ratio pyrometer splits the incoming radiation into two bands, at wavelengths λ₁ and λ₂, and measures both. This is an illustration with bands at **0.90 µm and 1.05 µm**, a common arrangement for hot metal using a layered silicon detector. For a surface with emissivities ε₁ and ε₂ at the two wavelengths, Wien's approximation gives the ratio of the two signals as:

R = (ε₁ ÷ ε₂) × (λ₂ ÷ λ₁)⁵ × e^(−(c₂ ÷ T) × (1 ÷ λ₁ − 1 ÷ λ₂))

The instrument assumes ε₁ = ε₂, a **grey** surface, and solves for T. If the surface really is grey, its emissivity has gone. It does not matter whether it is 0.85 or 0.60 or 0.20; the instrument reads the true temperature. For IH-40's billet at 1,200 °C, the full Planck law gives a ratio of **0.4586** between the 0.90 µm and 1.05 µm signals, and that ratio corresponds to 1,200 °C whatever the emissivity, as long as it is the same in both bands.

The same cancellation removes any loss that affects both bands equally. A window that transmits 70% of the radiation, a puff of smoke that blocks half of it, or a billet that fills only half of the measured spot against a cold background, all reduce both signals by the same factor, and the ratio is unchanged.

## What a single-wavelength instrument suffers from the same losses

The contrast with IH-40's single-wavelength pyrometer at 1.0 µm, set to 0.85, is stark. Losing part of the signal looks to it exactly like a lower emissivity:

- a window transmitting **90%**: reads **15.7 K** low;
- transmitting **70%**: reads **51.9 K** low;
- transmitting **50%**: reads **97.6 K** low;
- billet filling half the spot against a cold background: reads **97.6 K** low, at about 1,102 °C.

The ratio pyrometer reads 1,200 °C in every one of those cases. For a dirty sight path, a target smaller than the spot, or a surface whose emissivity changes but stays grey, it is the better instrument by a wide margin.

```figure
type: compare
title: Readings on IH-40's 1,200 °C billet with signal losses
rowhead: Condition
cols: Single-wavelength 1.0 µm, set to 0.85 | Ratio, 0.90 and 1.05 µm
caption: Calculated from Planck's law. Losses that affect both bands equally cancel in the ratio. A hot background does not cancel, as the last line shows.
- Clean path, full spot | 1,200.0 °C | 1,200.0 °C
- Window transmitting 70% | 1,148.1 °C | 1,200.0 °C
- Billet fills half the spot, cold background | 1,102.4 °C | 1,200.0 °C
- Emissivity 0.60 instead of 0.85, grey | 1,149.3 °C | 1,200.0 °C
- * Billet fills half the spot, 900 °C background | 1,113.5 °C | 1,172.3 °C
```

## What the ratio does not cancel

Three things survive the ratio, and the first two are amplified.

**Non-greyness.** If the emissivity differs between the two bands, the ratio is off by ε₁ ÷ ε₂, and the instrument cannot tell that from a change of temperature. The error behaves as if the instrument were a single-wavelength one at an **equivalent wavelength**:

λ_eq = λ₁ × λ₂ ÷ (λ₂ − λ₁)

For 0.90 and 1.05 µm, λ_eq = **6.3 µm**. A surface whose emissivity differs by just 1% between the two bands gives an error of about **9.5 K** at 1,200 °C, the same as a 6.3 µm single-wavelength instrument with a 1% emissivity error, and six times what the 1.0 µm instrument suffers from a 1% error. A 3% difference gives 28.6 K. Bare metals are often not grey: their emissivity typically falls as the wavelength increases, so ε₁ is larger than ε₂ and a ratio pyrometer on bare metal tends to read high. Oxidised surfaces are usually much closer to grey.

**Noise.** The ratio changes slowly with temperature. Its sensitivity, the fractional change in ratio for a fractional change in temperature, is (c₂ ÷ T) × (1 ÷ λ₁ − 1 ÷ λ₂) = **1.55** for IH-40's billet, against 9.77 for a single 1.0 µm signal. So 1% of noise in the ratio is worth about 9.5 K, against 1.5 K for 1% of noise in a single channel. Ratio instruments compensate with careful detector design and averaging, but they are inherently noisier at the same signal level, and they need more signal: when both channels are weak, the ratio of two noisy numbers is noisier still.

**Different temperatures in the spot.** When the spot holds two surfaces at different temperatures, the ratio of the summed signals does not correspond to either temperature. Against a cold background it does not matter, because the background contributes nothing at these wavelengths. Against a hot one, it does, and the error section below shows how much.

```figure
type: formula
title: The equivalent wavelength of a ratio pyrometer
formula: λ_eq = λ₁ × λ₂ ÷ (λ₂ − λ₁)
caption: This is an illustration for bands at 0.90 and 1.05 µm. A difference in emissivity between the bands acts like an emissivity error in a single-wavelength instrument at λ_eq.
- λ₁, λ₂ | 0.90 µm and 1.05 µm
step: λ_eq = 0.90 × 1.05 ÷ 0.15 = 6.3 µm
step: Error for ε₁ ÷ ε₂ = 1.01 at 1,473.15 K ≈ λ_eq × T² ÷ c₂ × ln 1.01 = 9.5 K
```

## Setting up a ratio instrument

A ratio pyrometer still has settings, and they matter.

**The ratio correction.** If a surface's emissivity is known to differ between the two bands by a steady factor, the instrument can be told it. Most ratio instruments accept a correction to the ratio, which some makers call the slope, and with it they remove a steady non-greyness the way a single-wavelength instrument removes a steady emissivity. It is set in the same way as Chapter 2's emissivity: against a reference temperature on the real surface. What it cannot remove is non-greyness that varies from billet to billet.

**The minimum signal.** Because the ratio survives large losses, a ratio instrument will happily report a temperature from a target that fills a tenth of its spot through a filthy window, using a fraction of its normal signal and with correspondingly more noise. Every ratio instrument should be given a minimum signal level below which it reports no reading, and a billet that never reaches it should be treated as unmeasured and diverted.

**The signal strength as a diagnostic.** The same signal strength, compared with what a clean window and a full spot give, is a free maintenance indicator. If IH-40's ratio instrument normally receives a given signal from a 1,200 °C billet and today receives 70% of it at the same reading, something in the path is taking 30%, most likely the protective window (Chapter 5). The ratio reading is unaffected, which is why the forge uses the signal level, not the temperature, to schedule window cleaning.

**Peak or average.** For discrete parts passing through the view, the reading must come from the time the part fills the spot. Instruments offer peak hold, valley hold and averaging over a gate; for IH-40's billets, a peak over the time the billet is in view, reset between billets, gives the reading from the fully filled spot.

## Beyond two colours

If two bands cancel a grey emissivity, it is natural to ask whether three or more could cancel a non-grey one. **Multi-wavelength** pyrometers do exactly that: they measure at several wavelengths and fit both a temperature and a model of how the emissivity varies with wavelength, such as a straight line. They are used on difficult surfaces, such as aluminium, whose emissivity is low and changes as it oxidises.

The catch is the model. With n bands, the instrument can solve for the temperature and at most n − 1 emissivity parameters, and the answer is only as good as the assumption that the real emissivity follows the chosen form. Where it does, a multi-wavelength instrument can do what neither a single-wavelength nor a ratio instrument can. Where it does not, the fit can be confidently wrong, and because the noise amplification grows with every parameter fitted, a multi-wavelength instrument needs strong signals. The rule from this chapter carries over: every extra wavelength removes a sensitivity to one property of the surface by adding a sensitivity to another, and the trade has to be tested on the real surface against a reference before it is trusted.

For IH-40's steel billets, scaled or bright, two colours were enough.

## IH-40's trial on bright bar

This is an illustration. After the bright-bar trouble of Chapter 2, the forge hired a ratio pyrometer for a fortnight and mounted it beside the single-wavelength instrument, both aimed at the billets leaving the coil. To find out whether the bright bar was grey enough between 0.90 and 1.05 µm, the forge ran billets with drilled-hole thermocouples, read once each billet had evened out, against both instruments.

The single-wavelength pyrometer, set to 0.62 as Chapter 2 concluded, read within ±10 K of the thermocouples, scattering with the patchy oxide. The ratio pyrometer read within about ±6 K, with a steady bias of a few kelvin high, the signature of a surface slightly non-grey in the direction bare steel usually is. On scaled bar from the old supplier, the two instruments agreed within a few kelvin.

The result was a decision, not a verdict on either instrument. For the bright bar, the ratio pyrometer was more consistent and needed no emissivity setting to be changed when the bar changed. For scaled bar, the single-wavelength instrument was as good and less noisy. The forge bought the ratio pyrometer for the coil exit and kept the single-wavelength one as a cross-check, with an alarm if the two disagreed by more than 15 K, which catches a dirty window (the single-wavelength reading drops) or a change of surface (both move, by different amounts).

## The error: good billets rejected against a hot background

This is an illustration. When the ratio pyrometer was first installed, it was aimed at the billet just as it emerged from the coil's exit, so that it would see each billet as early as possible. Within a shift, the cold-reject rate rose from a few per cent to nearly a fifth of billets, and the rejected billets, checked with the portable instrument, were at about 1,200 °C.

The instrument's reading log showed the problem. Each billet's reading started low, around 1,170 °C, and rose to 1,200 °C over a fraction of a second. The diverter was triggered on the first reading after the billet was detected. At that moment the billet's leading end only partly filled the spot, and behind it was the coil's exit liner, glowing at about 900 °C.

The engineer worked the numbers. With the billet filling half the spot and a 900 °C liner, emissivity about 0.9, filling the rest, the ratio of the summed signals corresponds to **1,172 °C**, only 2 K above the band's lower edge, so that with the instrument's normal noise many good billets fell below it. Against a cold background, the same half-filled spot would have read 1,200 °C exactly. The ratio pyrometer's tolerance of partial fill holds only when what fills the rest of the spot is cold.

The forge moved the aiming point 150 mm further from the coil, where the billet's background is the cold conveyor guard, and changed the diverter's logic to use the peak reading over the time the billet is in view, the standard way of handling discrete parts. The cold-reject rate returned to normal.

```figure
type: checklist
title: When a ratio pyrometer is the right choice
caption: The ratio cancels losses that are equal in both bands and amplifies differences between them. The last line is this chapter's error.
- Emissivity varies but the surface is close to grey | oxidised or scaled steel, many non-metals
- Dirty window, dust or smoke in the path | grey losses cancel
- Target smaller than the spot, cold background | reads true; set a minimum signal level
- Bare or non-grey metal | test against thermocouples; expect a bias
- Low signal or fast noise | single-wavelength may be steadier
- x Part-filled spot with a hot background | read 1,172 °C on a 1,200 °C billet
```

## Exercise: how grey is grey enough

IH-40's bright billets turn out to have emissivities of 0.62 at 0.90 µm and 0.60 at 1.05 µm. What will the ratio pyrometer read on a billet at 1,200 °C? What would the single-wavelength pyrometer at 1.0 µm read with its setting of 0.62, if the true emissivity at 1.0 µm is 0.607?

**Worked answer.**

- The emissivity ratio is 0.62 ÷ 0.60 = 1.033. The equivalent-wavelength approximation gives an error of about 6.3 × 10⁻⁶ × 1,473.15² ÷ 0.01438777 × ln 1.033 ≈ 31 K; the full Planck calculation gives **+31.8 K**, a reading of about **1,232 °C**, just outside the accepted band.
- The single-wavelength instrument with ε_true = 0.607 and ε_set = 0.62 reads low by about 1,473.15² × 10⁻⁶ ÷ 0.01438777 × ln(0.62 ÷ 0.607) ≈ **3.2 K**.

A difference of just 0.02 in emissivity between two bands 0.15 µm apart costs the ratio instrument ten times what the same surface costs a well-set single-wavelength instrument. A ratio pyrometer is not a cure for emissivity: it trades a sensitivity to the emissivity's value for a sensitivity to its slope.
