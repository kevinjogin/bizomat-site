---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: everything-glows
order: 1
title: "Everything glows: Planck's law and the black body"
description: "Thermal radiation, Planck's law, Wien's peak and Stefan–Boltzmann for IH-40's 1,200 °C billets, why 1 µm signals swing 10% per 1% of temperature, and a pyrometer moved down the line."
draft: false
---

A billet leaving an induction coil at 1,200 °C glows a bright yellow-orange. A billet at 600 °C glows a dull red that is hard to see in daylight. A billet at room temperature does not seem to glow at all, but it does: it gives off thermal radiation at wavelengths the eye cannot see, and a thermal camera sees it clearly. Every object warmer than absolute zero radiates, and the amount and colour of what it radiates depend on its temperature in a way that physics has known exactly since 1900.

That exact relation is what makes an infrared thermometer possible. This chapter sets out Planck's law of thermal radiation and its two everyday consequences, Wien's displacement law and the Stefan–Boltzmann law, applies them to IH-40's billets, shows why a pyrometer working at a short wavelength sees a large change in signal for a small change in temperature, and ends with a pyrometer that was moved a metre down the line and started steering the heater wrongly.

## The black body

Physics describes thermal radiation through an idealised surface, the **black body**, which absorbs every bit of radiation that falls on it, at every wavelength, and reflects none. A black body in equilibrium must also emit, at every wavelength, exactly what it would absorb from surroundings at its own temperature, or it would heat or cool itself. The radiation it emits therefore depends on nothing but its temperature. It does not matter what it is made of.

No real surface is a perfect black body, and the difference is the subject of Chapter 2. But a small hole in the wall of a closed, uniformly heated cavity comes very close: radiation entering the hole bounces around inside and is almost all absorbed before it can find its way out, so the hole is very nearly black, and the radiation leaving it is very nearly black-body radiation. That is how the reference sources used to calibrate every infrared thermometer are built (Chapter 8).

## Planck's law

In 1900, Max Planck found the formula for the black-body spectrum, and in explaining it he started quantum physics. Gould and Tobochnik's text derives it by treating the radiation in a cavity as a gas of photons in equilibrium with the walls. For engineering, the result is the **spectral radiance**: the power radiated per unit area of surface, per unit solid angle, per unit wavelength, at wavelength λ and absolute temperature T:

L_λ = c₁ ÷ (λ⁵ × (e^(c₂ ÷ (λ × T)) − 1))

The two constants are fixed by fundamental physics. The **second radiation constant**, c₂ = h × c ÷ k = 1.438776877 × 10⁻² m·K, sets the shape of the curve; the first, c₁ = 2 × h × c² = 1.191042972 × 10⁻¹⁶ W·m² per steradian, sets its scale. Both are CODATA values with no uncertainty in the SI as it now stands.

This is an illustration for IH-40's billet at 1,200 °C, 1,473.15 K, at the pyrometer's 1.0 µm: c₂ ÷ (λ × T) = 0.01438777 ÷ (10⁻⁶ × 1,473.15) = 9.767, and the spectral radiance works out at **6.83 × 10³ W per square metre per steradian per micrometre**. That number is what the pyrometer's detector collects a small, fixed fraction of. Everything else in the instrument is bookkeeping.

```figure
type: formula
title: Planck's law of black-body radiation
formula: L_λ = c₁ ÷ (λ⁵ × (e^(c₂ ÷ (λ × T)) − 1))
caption: This is an illustration for IH-40's billet at 1,200 °C seen at 1.0 µm. Constants from CODATA.
- λ | Wavelength, 1.0 × 10⁻⁶ m
- T | Absolute temperature, 1,473.15 K
- c₁ | 1.191042972 × 10⁻¹⁶ W·m² per steradian
- c₂ | 1.438776877 × 10⁻² m·K
step: c₂ ÷ (λ × T) = 9.767
step: L_λ = 6.83 × 10⁹ W/(m²·sr·m) = 6.83 × 10³ W/(m²·sr·µm)
```

## Where the peak sits: Wien's law

At each temperature, the Planck curve rises from nothing at short wavelengths to a peak and then falls away slowly at long wavelengths. The peak's wavelength is inversely proportional to the absolute temperature, which is **Wien's displacement law**:

λ_peak = 2,897.8 µm·K ÷ T

- IH-40's billet at 1,200 °C: λ_peak = **1.97 µm**, in the near infrared. The visible red glow is the short-wavelength tail of the curve, which is why a billet at 1,200 °C looks yellow-orange and not white: most of its radiation is beyond the red.
- A billet at 900 °C: 2.47 µm.
- A motor housing at 20 °C: **9.88 µm**, in the middle of the 8 to 14 µm band used by thermal cameras.

The law explains why instruments for hot metal work at short wavelengths and instruments for objects near room temperature work at long ones: each works where its targets radiate strongly. Chapter 3 shows that the choice is about more than signal strength.

## How much in total: Stefan–Boltzmann

Adding up the Planck curve over all wavelengths and all directions gives the total power radiated per unit area by a black body, the **Stefan–Boltzmann law**:

M = σ × T⁴

with σ = 5.670374419 × 10⁻⁸ W/(m²·K⁴). At 1,200 °C, M = **267.1 kW/m²**; at 20 °C, 418.8 W/m². The fourth power is the reason hot objects lose heat so fast by radiation: a billet at 1,200 °C radiates 638 times as much per square metre as one at room temperature.

This is an illustration. IH-40's billet has a surface area of π × 0.040 × 0.100 + 2 × π × 0.020² = **0.01508 m²** and a mass of about **0.986 kg**. With its scaled surface's emissivity of about 0.85 (Chapter 2), it radiates about 0.85 × 5.670 × 10⁻⁸ × (1,473.15⁴ − 293.15⁴) × 0.01508 = **3.42 kW**. Taking an illustrative specific heat of 650 J/(kg·K) for hot steel, that is a cooling rate of about **5.3 K a second** averaged over the billet, before convection, which adds a little more. The surface, which loses the heat, cools faster than that at first. Heating and Cooling Times by the Numbers treats how heat flows out of a part like this in detail; here the point is simpler: a billet's surface temperature changes by several kelvin for every second it travels, so where along the line it is measured matters.

## Why distance does not change the reading

Radiance has a property that makes non-contact measurement practical: along a clear path through air it does not fall off with distance. Moving a pyrometer twice as far from a billet makes the billet's image on the detector a quarter of the size, but each part of the image is just as bright, because the instrument's optics collect light from a cone that widens with distance and takes in proportionally more of the surface. As long as the billet fills the instrument's measuring spot, the detector receives the same power and the instrument reads the same temperature at 0.3 m or 3 m.

That is why a pyrometer is calibrated in temperature, not in watts at a particular distance, and why its datasheet gives a distance-to-spot ratio rather than a range: it tells the user how large the measured spot is at each distance, so that they can make sure the target fills it. When the target does not fill the spot, the rule breaks down, and Chapter 6 shows by how much. The path also matters: steam, smoke, dust and the window in front of the lens all remove some radiation on the way, and Chapter 5 deals with them.

## Why a short wavelength is sensitive

The most useful feature of Planck's law for measurement is how steeply the radiance rises with temperature at short wavelengths. On the short-wavelength side of the peak, the exponential dominates, and the fractional change in radiance for a fractional change in temperature is:

(ΔL ÷ L) ≈ x × (ΔT ÷ T), with x = c₂ ÷ (λ × T)

where the exact factor is x × e^x ÷ (e^x − 1), which equals x for large x. For IH-40's billet at 1.0 µm, x = 9.77: a 1% rise in absolute temperature, about 15 K, raises the radiance by about **10%**. At 10 µm, x = 0.98 and the exact factor is 1.57: the same 1% rise raises the radiance by only **1.6%**.

The consequence for IH-40's accepted band, 1,170 to 1,230 °C, is striking. At 1.0 µm, the signal across the band runs from **81.6% to 121.5%** of its value at 1,200 °C. At 10 µm, it runs from 96.8% to 103.2%. The short-wavelength instrument sees the band as a 40% swing in signal; the long-wavelength one sees it as a 6% swing. Anything that disturbs the signal by a few per cent, a wrong emissivity, a dirty window, a reflection, moves the long-wavelength reading by a large share of the band and the short-wavelength one by very little. Chapters 2 and 3 work that out in detail.

```figure
type: compare
title: Signal change for IH-40's billets at different wavelengths
rowhead: Wavelength
cols: x = c₂ ÷ (λT) at 1,200 °C | Signal change for +1% in T | Signal change for +10 K | Signal at 900 °C, share of 1,200 °C
caption: Calculated from Planck's law. Short wavelengths turn small temperature changes into large signal changes, and see little of cooler objects.
- 0.65 µm | 15.03 | +16.0% | +10.7% | 2.1%
- * 1.0 µm | 9.77 | +10.2% | +6.8% | 8.2%
- 1.6 µm | 6.10 | +6.2% | +4.2% | 21.0%
- 3.9 µm | 2.50 | +2.7% | +1.9% | 50.6%
- 10 µm | 0.98 | +1.6% | +1.1% | 68.7%
```

## The price of a short wavelength

The steepness cuts both ways. At 1.0 µm, a billet at 900 °C gives only 8.2% of the signal of one at 1,200 °C, a billet at 600 °C 0.12%, and one at 300 °C about two parts in ten million. A short-wavelength pyrometer therefore has a high lower limit to its range, set by the point where the signal sinks into the detector's noise, and cannot read objects near room temperature at all. An instrument for IH-40's exit is chosen for a range that comfortably covers its rejects, say 700 to 1,400 °C, not for anything cooler.

The thermal camera the maintenance team uses for the power cabinet works at 8 to 14 µm precisely because at room temperature there is almost nothing to see at 1 µm. At 20 °C, the 8 to 14 µm band holds about 37% of everything a black body radiates; at 1,200 °C, only about 4%. Each instrument is matched to its targets.

```figure
type: bars
title: IH-40 pyrometer signal across the accepted band, share of the 1,200 °C signal
unit: %
max: 130
caption: Calculated from Planck's law. The 60 K band is a 40% swing in signal at 1.0 µm and a 6% swing at 10 µm.
- 1,170 °C at 1.0 µm | 81.6
- * 1,200 °C at 1.0 µm | 100
- 1,230 °C at 1.0 µm | 121.5
- 1,170 °C at 10 µm | 96.8
- 1,230 °C at 10 µm | 103.2
```

## The error: a pyrometer moved down the line

This is an illustration. IH-40's pyrometer was first mounted to look at each billet as it left the coil. During a rebuild of the coil, the maintenance team moved it 1 metre further along the conveyor, where it was easier to reach and out of the way of coil changes. At the conveyor's speed of 0.5 m/s, that was 2 seconds later in each billet's journey. The heater's controller uses the pyrometer's reading to trim the coil's power so that billets read 1,200 °C.

After the rebuild, the press operators reported that billets seemed hotter at the die and the hot-reject bin filled faster. The pyrometer and the controller both showed 1,200 °C, and the instrument was found to be in calibration. The process engineer worked out the radiation loss: about 5.3 K a second averaged over the billet, more at the surface, so at least **11 K** of surface cooling between the coil exit and the new position, before convection. To make the billet read 1,200 °C at the new position, the controller was sending it out of the coil about 11 K hotter, and the operators' hand checks at the coil exit, with a portable pyrometer, confirmed readings around 1,210 °C.

The fix was not to move the pyrometer back but to decide where the requirement applied. The forging requirement was for the billet at the die, which is further down the line still, so the team measured the temperature drop from coil exit to die with the portable pyrometer over a shift, set the controller's target at the measuring position to give 1,200 °C at the die, and wrote the measuring position into the setting sheet. A pyrometer reads the surface it sees, where it sees it, and the setpoint has to say where.

## Exercise: a cooler billet

For a billet at 900 °C, find the wavelength of peak radiation, the total black-body radiation per square metre, and the signal at 1.0 µm and at 10 µm as a share of the signal at 1,200 °C. What does the 1.0 µm answer imply for using the pyrometer to sort cold rejects?

**Worked answer.** T = 1,173.15 K.

- Peak wavelength: 2,897.8 ÷ 1,173.15 = **2.47 µm**.
- Black-body radiation: 5.670 × 10⁻⁸ × 1,173.15⁴ = **107.4 kW/m²**, 40% of the 1,200 °C value.
- At 1.0 µm, Planck's law gives **8.2%** of the 1,200 °C signal; at 10 µm, **68.7%**.

A cold reject at 900 °C still gives the 1.0 µm pyrometer 8% of its normal signal, comfortably above the noise of an instrument ranged from 700 °C, so it reads and rejects such a billet reliably. Below about 600 °C, where the signal falls to around a tenth of a per cent, the same instrument would be near the bottom of its range and could not be trusted to read an unheated billet that had slipped through. That case needs a different check, such as a simple presence-and-heat sensor or an interlock on the coil's power, because a billet that never heated gives the pyrometer almost nothing to read, and an instrument with no signal must be made to fail safe, sending the billet to the reject chute, not to the press.
