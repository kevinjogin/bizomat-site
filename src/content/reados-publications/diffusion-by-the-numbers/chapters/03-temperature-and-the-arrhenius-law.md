---
book: diffusion-by-the-numbers
chapterSlug: temperature-and-the-arrhenius-law
order: 3
title: "Temperature and the Arrhenius law"
description: "Calculate how carbon's diffusion coefficient rises with temperature, what that does to DS-40's furnace time, how far a temperature error moves the case, and why furnace surveys matter."
draft: false
---

Nothing changes diffusion as much as temperature. Raising a carburising furnace by 25 °C cuts the cycle by about a quarter; a thermocouple reading 15 °C high quietly takes a tenth off every case. The reason is that each atomic hop needs a burst of thermal energy to squeeze past its neighbours, and the fraction of hops that succeed rises exponentially with temperature. That exponential is the **Arrhenius law**, and it governs every diffusion process in this book.

This chapter states the Arrhenius law for the diffusion coefficient, calculates D for carbon in austenite across the carburising range, converts it into furnace times for DS-40's case, finds how sensitive the case depth is to temperature error, and sets out what a temperature survey of the furnace protects against. The failure case is a control thermocouple that read high.

## The Arrhenius law

The diffusion coefficient varies with absolute temperature T as **D = D₀ exp(−Q ÷ (R T))**, where D₀ is a constant for the diffusing species and host, Q is the **activation energy**, the energy barrier each hop must overcome, per mole, and R is the gas constant, 8.314 J/(mol·K). The exponential term is, in effect, the fraction of attempts with enough energy to succeed. The law is named after Svante Arrhenius, who proposed it in the 1880s for the rates of chemical reactions; diffusion follows it for the same reason reactions do, because both depend on atoms surmounting an energy barrier with the help of thermal agitation.

For carbon in austenitic iron, values widely quoted in materials science textbooks are **D₀ ≈ 2.3 × 10⁻⁵ m²/s** and **Q ≈ 148 kJ/mol**, consistent with experimental activation energies of about 148 to 157 kJ/mol. Alloying elements, carbon content and grain size shift the real values for a given steel; the textbook values are used here for teaching, as the book's introduction explains.

```figure
type: formula
title: Diffusion coefficient of carbon in austenite at 925 °C
formula: D = D₀ exp(−Q ÷ (R T))
caption: This is an illustration with the widely quoted textbook values for iron. Real case-hardening steels differ somewhat; the heat treater's coupon data refine them, as Chapter 2 showed.
- D₀ | 2.3 × 10⁻⁵ m²/s
- Q | 148,000 J/mol
- T | 925 °C = 1,198.15 K
- Q ÷ (R T) | 148,000 ÷ (8.314 × 1,198.15) ≈ 14.86
- D | 2.3 × 10⁻⁵ × exp(−14.86) ≈ 8.1 × 10⁻¹² m²/s
```

## D across the carburising range

Applying the law across the temperatures at which steel is carburised shows how steeply D climbs.

```figure
type: compare
title: Carbon diffusion in austenite and DS-40's time to a 0.8 mm case
cols: Diffusion coefficient | Time for 0.8 mm at 0.80% surface carbon
caption: This is an illustration. The time comes from Chapter 2: t = (0.8 mm ÷ (2 × 0.6841))² ÷ D. Going from 900 °C to 1,000 °C cuts the time by more than two-thirds.
- 875 °C | about 4.2 × 10⁻¹² m²/s | about 22.4 hours
- 900 °C | about 5.9 × 10⁻¹² m²/s | about 16.1 hours
- *925 °C | about 8.1 × 10⁻¹² m²/s | about 11.7 hours
- 950 °C | about 1.10 × 10⁻¹¹ m²/s | about 8.6 hours
- 975 °C | about 1.47 × 10⁻¹¹ m²/s | about 6.5 hours
- 1,000 °C | about 1.95 × 10⁻¹¹ m²/s | about 4.9 hours
```

Near 925 °C, D doubles for about every **56 °C** rise, from the approximation ΔT ≈ ln 2 × R T² ÷ Q. It rises about **13%** for every 10 °C. Because depth goes with √(Dt), a 10 °C change moves the depth at fixed time by about **6%**.

### Why not carburise hotter?

If 1,000 °C gives the case in under five hours instead of nearly twelve, why carburise at 925 °C? Because temperature affects the steel as well as the diffusion. Higher temperatures coarsen the austenite grains, which lowers toughness unless the steel is grain-refined or later re-hardened from a lower temperature; they increase distortion; they shorten the life of furnace fixtures, muffles and baskets; and they can raise the surface carbon solubility enough to form unwanted carbides at the surface. Modern low-pressure vacuum carburising, with fine-grained steels designed for it, does run hotter for exactly the time saving. For DS-40's steel and an atmosphere furnace, 925 °C is a common compromise, and the choice belongs to the heat treater and the materials engineer together.

### What the activation energy means physically

The activation energy is easier to grasp per atom. Divided by Avogadro's number, 148 kJ/mol is about **2.5 × 10⁻¹⁹ J** per hop, about 1.5 electron-volts. At 925 °C, the thermal energy kT available to an atom is about **1.65 × 10⁻²⁰ J**, roughly fifteen times smaller. The Boltzmann factor exp(−15) is only about **3.5 × 10⁻⁷**: a very small share of attempts carries enough energy to complete a hop. The attempt frequency, the number of neighbouring sites and other factors are folded into D₀, and together they still give the hundreds of millions of hops a second found in Chapter 1. Raise the temperature a little and the fraction of successful attempts rises sharply, because it sits far out in the tail of the energy distribution; that is the whole reason diffusion is so sensitive to temperature.

## The Arrhenius plot

Taking logarithms of the law gives **ln D = ln D₀ − (Q ÷ R) × (1 ÷ T)**: a straight line when ln D is plotted against 1 ÷ T, with a slope of −Q ÷ R. That **Arrhenius plot** is how activation energies are measured: carburise coupons at several temperatures, fit D from each coupon's profile as in Chapter 2, plot ln D against 1 ÷ T and read Q from the slope. A heat treater with coupon results from a few temperatures can build exactly that plot for their own steel and furnace, and use it to interpolate cycle times with confidence. Three coupons, at 900, 925 and 950 °C, are enough to see whether the line is straight and to estimate its slope; more points and repeats tighten it. Points off the line point to something else: a different surface carbon, a mis-recorded time or a temperature that was not what the controller said.

## Equivalent time at temperature

Because only the product D × t matters for the error-function profile, time at one temperature can be converted into equivalent time at another: **t₂ = t₁ × D(T₁) ÷ D(T₂)**. An hour at 950 °C is worth about 1.35 hours at 925 °C; an hour at 900 °C is worth about 0.73 hours. That simple conversion handles the parts of a real cycle that are not at the set point.

Furnaces do not jump to temperature. If DS-40's load is heated from 850 °C to 925 °C over an hour, in an atmosphere already carburising, the carbon diffusing during that ramp is equivalent to about **38 minutes** at 925 °C, found by adding up D over the ramp in small steps and dividing by D at 925 °C. A slow cool from 925 °C to 800 °C over half an hour adds about **15 minutes** more. Neither is negligible against an 11.7-hour cycle, and a recipe that times the cycle only from when the furnace reaches its set point will produce slightly deeper cases than planned; one that counts the ramp as if it were at full temperature will produce slightly shallower ones.

### The load lags the furnace

A furnace thermocouple measures the furnace, not the parts. In a large basket, the parts at the centre may reach temperature well after those at the outside, and they spend correspondingly less time at temperature. If DS-40's innermost shafts lagged by **45 minutes** in an 11.7-hour cycle, their case would be about **0.8 × √(10.95 ÷ 11.7) ≈ 0.77 mm**, slightly shallower than the outer shafts. Heat treaters manage that with load thermocouples placed among the parts, soak times counted from when the slowest part reaches temperature, and loading patterns that leave space for the atmosphere and heat to circulate. Test coupons are placed where the slowest parts are, not where it is convenient.

## How sensitive is the case to temperature?

A furnace never holds exactly its set point everywhere. The control thermocouple has a tolerance, the furnace has hot and cold zones, and a large load heats unevenly. Each degree of error changes D by about 1.3% and the depth by about 0.6%.

```figure
type: bars
title: DS-40's effective case after its 11.7-hour cycle, by actual furnace temperature
unit: mm
max: 0.9
caption: This is an illustration. The cycle is designed for 925 °C. If the parts actually see a different temperature, the case moves by about 0.025 mm per 5 °C near this temperature. The tolerance is 0.7 to 1.0 mm.
- 910 °C, 15 °C low | 0.728
- 915 °C, 10 °C low | 0.752
- 920 °C, 5 °C low | 0.775
- *925 °C, as designed | 0.800
- 930 °C, 5 °C high | 0.825
- 935 °C, 10 °C high | 0.851
```

DS-40's tolerance of 0.7 to 1.0 mm absorbs a furnace error of a few degrees easily. It does not absorb a combination of a 15 °C low furnace, a slightly low carbon potential and a slightly short cycle, each within its own tolerance, which together can take the case below 0.7 mm. Chapter 8 combines the errors properly.

## Different species, different sensitivities

The relative change in D per degree is **Q ÷ (R T²)**, so it depends on both the activation energy and the temperature at which the process runs. For carbon in austenite at 925 °C it is about **1.24% per degree**. Carbon in ferrite has a lower activation energy, about 80 kJ/mol by the same textbook data, but ferrite processes run at lower temperatures, and at 600 °C its sensitivity works out almost the same, about **1.26% per degree**. Hydrogen in steel has a far lower activation energy, around 20 kJ/mol taken as a teaching value, which is why it diffuses quickly even at room temperature. At a 200 °C bake its sensitivity is about **1.07% per degree**, and the whole rise from room temperature to 200 °C multiplies its D by only about **23**, compared with the many orders of magnitude carbon gains on heating to carburising temperatures. Substitutional alloying elements have much higher activation energies and barely move until temperatures are very high.

The practical reading is that a low activation energy means a species is already mobile at modest temperatures, not that its process is insensitive to temperature. Knowing Q and the process temperature tells a process engineer at once how much a few degrees of error matter.

### Logging the cycle

Every one of these effects, ramps, lag, uniformity and drift, is visible only if temperatures are recorded. DS-40's heat treater logs the control thermocouple, a load thermocouple among the parts and the carbon potential every minute, and keeps the log with the batch record. A batch whose case depth comes out unexpectedly can then be investigated from its own data: the equivalent time at 925 °C can be recalculated from the logged temperatures, and the Arrhenius law tells whether the temperature history explains the result or whether something else, such as the atmosphere, must be looked at.

## A failure case: a thermocouple that read high

This is an illustration. In a carburising furnace like DS-40's, the control thermocouple had drifted, as thermocouples do with age at high temperature, and was reading about **15 °C high**. The controller dutifully held the indicated 925 °C while the load sat at about 910 °C.

Over several weeks, the case depths measured on the routine test coupons crept down, from around 0.80 mm to around **0.73 mm**, still inside the 0.7 mm minimum but trending towards it. The detection came from plotting the coupon results in time order, which showed the drift long before any batch failed. The Arrhenius calculation confirmed the size of the error: at 910 °C, D is about 17% lower than at 925 °C, and the depth about 9% lower.

The coupons had done their job: no shaft left the plant below specification, but the margin had been quietly used up, and a few more weeks of drift would have produced failures. Without the trend chart, the first warning would have been a batch below 0.7 mm, and every batch since the drift began would have been under suspicion.

The correction was to replace the thermocouple, run a **temperature uniformity survey**, placing calibrated thermocouples at several points across the working zone with a representative load, and set a schedule for thermocouple replacement and periodic surveys based on the furnace's history. Industry pyrometry specifications describe such surveys in detail; for DS-40's heat treater, the lesson was that the furnace's indicated temperature is a claim to be checked, not a fact.

## How this applies to a small Australian business

Use the Arrhenius law to see how strongly temperature controls diffusion, and convert temperature changes into changes in time or depth before choosing a process temperature. Near carburising temperatures, expect D to rise about 13% per 10 °C and depth about 6%. Build an Arrhenius plot from your own coupon results to refine textbook data for your steels. Treat furnace temperature as a measured quantity with an uncertainty: survey the working zone, replace thermocouples on a schedule, and trend coupon results to catch drift early.

## Exercise: a hotter, shorter cycle

The heat treater proposes carburising DS-40 at **950 °C** to shorten the cycle. Using the textbook values, what is D at 950 °C and the time for a 0.8 mm case at 0.80% surface carbon? By what fraction is the cycle shortened? If the furnace were 10 °C low at that setting, what case would the 950 °C cycle actually give?

**Worked answer.** At 950 °C, T = 1,223.15 K, and **D = 2.3 × 10⁻⁵ × exp(−148,000 ÷ (8.314 × 1,223.15)) ≈ 1.10 × 10⁻¹¹ m²/s**. The time is **(0.585 × 10⁻³)² ÷ 1.10 × 10⁻¹¹ ≈ 31,100 s, about 8.6 hours**, about **26%** shorter than 11.7 hours. At 940 °C, D is about 9.8 × 10⁻¹² m²/s, about 11% lower, so the depth after 8.6 hours would be about **0.8 × √0.89 ≈ 0.75 mm**, still in tolerance but closer to the minimum.
