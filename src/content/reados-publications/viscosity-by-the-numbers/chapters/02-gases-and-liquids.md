---
book: viscosity-by-the-numbers
chapterSlug: gases-and-liquids
order: 2
title: "Why gases and liquids respond to heat in opposite ways"
description: "Explain gas viscosity from molecules carrying momentum, check Maxwell's density rule and Sutherland's formula against NIST data, and see why liquids thin as they warm."
draft: false
---

Heat a hydraulic oil and it thins. Heat air or nitrogen and it becomes more viscous. The two results surprise people who learned viscosity from oils alone, and they surprised Maxwell's contemporaries too, when his kinetic theory of gases predicted in the 1860s that a gas's viscosity should rise with temperature and not depend at all on its pressure. Both predictions were confirmed by experiment, and they remain the clearest way to understand what viscosity is at the scale of molecules.

This chapter explains gas viscosity as momentum carried between layers by moving molecules, checks Maxwell's density rule and the square-root temperature rule against NIST's data for nitrogen, fits Sutherland's better formula, and then turns to liquids, where viscosity comes from molecules squeezing past their neighbours and falls steeply as they warm. It ends with a gas flow measurement that was corrected in the wrong direction because someone assumed gases behave like oil.

## Momentum carried across a gas

Picture the sheared film of Chapter 1 filled with gas instead of oil. The gas molecules are far apart and fly in straight lines between collisions. A molecule that starts in a faster-moving layer and crosses into a slower one carries its extra momentum with it and, at its next collision, shares it. Molecules crossing the other way carry a momentum deficit. The net effect is a steady transfer of momentum from fast layers to slow ones, which is exactly a shear stress.

The elementary version of this argument, found in every kinetic theory text, gives a gas's dynamic viscosity as one third of its density times the mean molecular speed times the mean free path, the average distance a molecule travels between collisions.

```figure
type: formula
title: Elementary kinetic theory of gas viscosity
formula: μ ≈ (1 ÷ 3) × ρ × v̄ × λ
formula: v̄ = √(8kT ÷ πm), λ ∝ 1 ÷ (number of molecules per m³)
caption: Density and mean free path change in opposite directions with pressure, so their product, and the viscosity, do not depend on pressure. The mean speed rises with the square root of absolute temperature.
- ρ | gas density, kg/m³
- v̄ | mean molecular speed, m/s
- λ | mean free path, m
- k | Boltzmann constant, 1.380649 × 10⁻²³ J/K
- m | mass of one molecule, kg
```

Two predictions follow directly. Doubling the pressure doubles the density but halves the mean free path, because there are twice as many molecules to hit; the product is unchanged, so the viscosity does not depend on pressure. And because molecules move faster when hotter, at a mean speed proportional to the square root of the absolute temperature, the viscosity should rise as the square root of temperature. The more exact theories, built by Chapman and Enskog on Boltzmann's equation, keep both conclusions for an ideal gas of hard spheres and change only the numerical factor.

## Checking Maxwell's density rule

NIST's fluid property data for nitrogen make an easy test. Nitrogen matters to HPU-40 because its bladder accumulator is precharged with it, and air, which is mostly nitrogen, fills the space above the oil in its reservoir.

```figure
type: compare
title: Nitrogen at 20 °C over a two-hundredfold range of density
cols: Density | Viscosity | Change from 0.1 MPa
rowhead: Pressure
- 0.1 MPa | 1.150 kg/m³ | 17.57 µPa·s | none
- 2.1 MPa | 24.23 kg/m³ | 17.88 µPa·s | +1.7%
- 9.9 MPa | 113.7 kg/m³ | 19.70 µPa·s | +12.1%
- 19.9 MPa | 217.6 kg/m³ | 23.06 µPa·s | +31.2%
caption: NIST fluid property data. A twenty-one-fold rise in density changes the viscosity by under 2%, as kinetic theory predicts; at a hundred times atmospheric density and more, the gas is no longer dilute and the rule fails.
```

Between atmospheric pressure and 2.1 MPa the density rises twenty-one times and the viscosity by 1.7%. Maxwell's rule holds. At 10 MPa and above, nitrogen's molecules spend a significant part of their time close to one another, the gas is no longer dilute, and momentum starts to be carried by the forces between neighbouring molecules as well as by their flights. The viscosity then rises with density, moving towards the behaviour of a liquid. HPU-40's accumulator is precharged to 90 bar, where nitrogen's viscosity is about 11% above its atmospheric value; for gas flowing through a charging valve that difference rarely matters, but it is a reminder that "pressure does not matter" is a rule for dilute gases.

The same data give a feel for the mean free path. With nitrogen's mean speed at 20 °C of √(8 × 1.380649 × 10⁻²³ × 293.15 ÷ (π × 4.652 × 10⁻²⁶)) = 470.7 m/s, the elementary formula gives λ = 3μ ÷ (ρ v̄) = 3 × 17.573 × 10⁻⁶ ÷ (1.1496 × 470.7) = 97 nm at atmospheric pressure. Vacuum by the Numbers uses a more exact form of the same relation to find [mean free path and flow regimes](/reados/publications/vacuum-by-the-numbers/mean-free-path-and-flow-regimes/) at low pressure, where the gap between surfaces becomes comparable to λ and the simple picture of a viscous gas breaks down.

## Temperature: the square root and Sutherland

The square-root rule gets the direction right but not the size of the change. Real molecules attract one another weakly and are not hard spheres, so slower, colder molecules are deflected more easily, as if they were larger, and the viscosity falls faster with cooling than the square root predicts. In 1893 Sutherland proposed a correction with one constant, S, that captures this. The formula, with a reference viscosity μ₀ at a reference temperature T₀, is:

```figure
type: formula
title: Sutherland's formula for the viscosity of a dilute gas
formula: μ = μ₀ × (T ÷ T₀)^1.5 × (T₀ + S) ÷ (T + S)
caption: For nitrogen, fitted by KEVOS® to NIST's data at 0.1 MPa from −40 °C to 200 °C: μ₀ = 16.629 µPa·s at T₀ = 273.15 K and S = 114.8 K, with a largest error of 0.20%.
- T, T₀ | absolute temperatures, K
- μ₀ | viscosity at T₀
- S | Sutherland constant, K, fitted for each gas
```

```figure
type: compare
title: Nitrogen's viscosity at 0.1 MPa: NIST data against two formulas
cols: NIST | Square-root rule | Sutherland, S = 114.8 K
rowhead: Temperature
- −40 °C | 14.65 µPa·s | 15.36 µPa·s | 14.62 µPa·s
- 20 °C | 17.57 µPa·s | 17.23 µPa·s | 17.58 µPa·s
- 100 °C | 21.10 µPa·s | 19.44 µPa·s | 21.11 µPa·s
- 200 °C | 25.07 µPa·s | 21.89 µPa·s | 25.02 µPa·s
caption: Both formulas start from NIST's value at 0 °C. The square-root rule is 13% low at 200 °C; Sutherland's formula stays within 0.2% across the range.
```

Sutherland's formula is the standard engineering form for gas viscosity, and the constant should always be fitted to good data over the temperature range in use rather than copied without its range. Extrapolated far beyond its data, any one-constant formula will drift.

## Liquids: squeezing past the neighbours

In a liquid the molecules are packed almost as closely as in a solid. There is no room for free flights between layers, and momentum is carried instead by the forces between neighbouring molecules. For one layer to slide over another, molecules have to squeeze out of the cage formed by their neighbours and hop into the next gap, and each hop needs a certain amount of energy. Only molecules with enough thermal energy make the jump, and the fraction that do rises steeply with temperature, as an exponential of the energy barrier divided by temperature.

The result is that liquid viscosity falls as the liquid warms, and roughly exponentially with the reciprocal of absolute temperature. Andrade proposed the form μ = A × exp(B ÷ T) in 1930, and it is often called the Arrhenius form, because it is the same shape as a chemical reaction rate.

This is an illustration of how well the simple form works, using NIST's water data. Fitting it through water's viscosity at 20 °C (1,001.4 µPa·s) and 80 °C (354.0 µPa·s) gives B = 1,794 K. The formula then predicts 567.3 µPa·s at 50 °C, against NIST's 546.4 µPa·s, about 4% high, and 1,568 µPa·s at 0 °C against 1,791 µPa·s, 12% low. The shape is right and the detail is not: real liquids curve away from a straight line on an Arrhenius plot, which is why the oil industry uses a different, empirical relation for oils, the subject of Chapter 3.

## Gas, water and oil side by side

The opposite trends are clearest when each fluid's viscosity is divided by its own value at 20 °C.

```figure
type: line
title: Viscosity relative to its value at 20 °C, water and nitrogen at 0.1 MPa
x: Temperature, °C
y: Viscosity ÷ viscosity at 20 °C
ymin: 0
ymax: 2
legend: Water | Nitrogen
caption: NIST fluid property data. Water's viscosity falls to 28% of its 20 °C value at 100 °C; nitrogen's rises by 20%. HPU-40's VG 46 oil, not shown, falls to 8% of its 20 °C value by 80 °C.
- 0 | 1.789 | 0.946
- 20 | 1.000 | 1.000
- 40 | 0.652 | 1.052
- 60 | 0.465 | 1.103
- 80 | 0.354 | 1.153
- 100 | 0.281 | 1.201
```

Between 20 °C and 80 °C water's viscosity falls by a factor of 2.83, nitrogen's rises by 15%, and HPU-40's oil falls by a factor of 12.1, from 133.8 to 11.1 mm²/s. Oil molecules are long, tangled hydrocarbon chains, and the energy barrier to their moving past one another is larger than for small water molecules. Fitting the same exponential form to the oil's kinematic viscosity at 20 °C and 80 °C gives B = 4,296 K against water's 1,794 K: more than twice the temperature sensitivity. That is why oil temperature dominates every chapter of this book.

## Why oils come in grades

If the energy barrier to flow depends on how large and tangled the molecules are, then a liquid made of longer molecules should be more viscous, and that is how oil grades are made. A mineral base oil is a mixture of hydrocarbons; the refinery separates it into fractions by boiling range, and heavier fractions, made of longer and more branched molecules, are more viscous. A VG 46 hydraulic oil and a VG 220 gear oil can have nearly the same density, within a few per cent, and a viscosity at 40 °C that differs almost five times, because one is made from heavier molecules than the other. Synthetic oils are built the same way from chosen molecules, which lets their makers control how steeply the viscosity falls with temperature as well as its value.

The molecular picture also explains why the long-chain polymers added to some oils, which Chapter 5 covers, raise viscosity so effectively for so little mass, and why they can be torn apart by severe shear, losing some of that viscosity for good.

## Viscosity sets how fast things settle and spread

Viscosity is also the friction that a fluid offers to anything moving through it, which is how it enters the behaviour of the particles and droplets suspended in an oil. Stokes showed that a small sphere moving slowly through a viscous fluid feels a drag force of 6πμaU, where a is its radius and U its speed. Einstein used the same friction to show that a small particle's Brownian diffusion coefficient is kT divided by 6πμa: the more viscous the fluid, the more slowly a particle wanders. Both results appear in the fine-particle and Brownian motion chapters of other READOS books; [drag and settling](/reados/publications/fine-particles-by-the-numbers/drag-and-settling/) works them for dust in air.

This is an illustration. A steel wear particle 10 µm across, with a density of 7,850 kg/m³, settles in HPU-40's oil at 50 °C at 2/9 × (7,850 − 848.7) × 9.81 × (5 × 10⁻⁶)² ÷ 0.02544 = 0.0150 mm/s. To fall through 0.4 m of oil in the reservoir it needs 444 minutes, more than seven hours. The reservoir holds 120 L and the pump draws 40 L/min, so oil stays in it for about three minutes. Fine particles do not settle out in a working reservoir; they go round with the oil, which is why hydraulic systems rely on filters rather than on settling. At 5 °C the same particle falls 13 times more slowly; at 65 °C it falls 1.7 times faster. A water droplet of 50 µm, whose density is close to the oil's, needs almost 14 hours at 50 °C. Settling in a reservoir is therefore something that happens over a weekend shutdown, not between one pass of the oil and the next.

## What this means in a hydraulic shop

The molecular picture explains several things a hydraulic or lubrication engineer meets in practice.

```figure
type: checklist
title: Practical consequences of how gases and liquids behave
caption: Each follows from momentum carried by flights in a gas and by activated hops in a liquid.
- Gas restrictions get stiffer when hot | Laminar gas flow through a vent, filter or capillary falls as the gas warms, for the same pressure difference
- Oil restrictions get freer when hot | The same holds in reverse for oil, and far more strongly
- Gas viscosity ignores pressure, up to a point | Correct for dilute gases; check data above about 5 MPa for nitrogen
- Oil viscosity rises with pressure | Small at line pressures, large in loaded contacts (Chapter 5)
- x Never correct a gas reading with an oil rule | The direction of the temperature effect is opposite
- ? Ask which fluid a correction table was made for | Instrument correction tables are specific to a gas or a liquid
```

## The error: correcting a gas meter like an oil meter

This is an illustration. The press shop's maintenance team measures air leakage from the press's pneumatic guard cylinders with a laminar flow element: a bundle of fine capillaries through which the air flows in laminar flow, so that the pressure drop across it is proportional to the flow times the air's viscosity. The meter's display was calibrated with air at 20 °C.

One summer afternoon the air reaching the meter was at 60 °C, straight from a hot receiver. A technician knew that viscosity changes with temperature and, thinking of oil, reasoned that the hot air would be "thinner" and flow more easily, so the meter would read low. They raised the reading by 10%.

The direction was wrong. Air's viscosity, like nitrogen's, rises with temperature; from NIST's nitrogen data it is 19.383 ÷ 17.573 = 1.103 times its 20 °C value at 60 °C. The same flow therefore produced a pressure drop 10.3% larger than at calibration, and the meter's uncorrected display was already 10.3% high. The true flow was the display divided by 1.103, or 0.907 times it. The technician's correction multiplied it by 1.10 instead, making the reported leak 1.10 ÷ 0.907 = 1.21 times the truth, 21% high.

The error was found because the leakage figure did not match the compressor's loaded hours, which Pneumatics by the Numbers shows how to use as a check. The team now corrects laminar flow element readings with the maker's gas viscosity correction, which for air raises the viscosity with temperature, and labels each correction table with the fluid it applies to.

## Bringing it together

In a dilute gas, molecules carry momentum between layers in free flights. The viscosity is independent of density and rises with temperature, a little faster than its square root, as Sutherland's formula describes. In a liquid, molecules must hop past their neighbours, and the viscosity falls steeply as temperature rises, by a factor of three for water and twelve for HPU-40's oil between 20 °C and 80 °C. Oils need a relation of their own for that steep fall, and the next chapter introduces the one every oil data sheet relies on.

## Exercise: nitrogen in a hot accumulator room

HPU-40's accumulator charging kit includes a fine capillary bleed. Its maker states a flow of 2.0 L/min of nitrogen at 20 °C for a given pressure difference, in laminar flow. Estimate the flow through the same capillary, at the same pressure difference and the same inlet density, if the nitrogen is at 100 °C, using Sutherland's formula with S = 114.8 K and μ₀ = 16.629 µPa·s at 273.15 K. How does the answer compare with what the square-root rule would give?

**Worked answer.** This is an illustration. Laminar flow at a fixed pressure difference is inversely proportional to viscosity. Sutherland gives 17.58 µPa·s at 20 °C and 16.629 × (373.15 ÷ 273.15)^1.5 × (273.15 + 114.8) ÷ (373.15 + 114.8) = 21.11 µPa·s at 100 °C, a ratio of 1.201. The flow falls to 2.0 ÷ 1.201 = **1.67 L/min**. The square-root rule gives a ratio of √(373.15 ÷ 293.15) = 1.128 and a flow of 1.77 L/min, which overstates the flow by 6%. Both rules agree on the direction: the hotter gas flows less, not more.
