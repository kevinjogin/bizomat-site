---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: compressors-and-recovered-heat
order: 7
title: "Compressors and recovered heat"
description: "Calculate the ideal work to compress air, see why real compressors use more and why staging with intercooling helps, and recover the heat that nearly all compressor power becomes."
draft: false
---

Compressors are at the heart of refrigeration plant and heat pumps, and they also supply almost every factory's compressed air. All of them do the same thing: they squeeze a gas into a smaller volume at a higher pressure, and in doing so they heat it. Thermodynamics sets the least work a compressor could possibly need, depending on how the gas is cooled while it is compressed, and shows why real compressors need noticeably more. It also shows something easy to overlook: almost all of the electricity a compressor uses ends up as heat, which can be recovered and used rather than blown away.

This chapter applies thermodynamics to the food factory's air compressor. It calculates the ideal work to compress air with perfect cooling and with none, compares both with a real compressor's consumption, explains why compression in stages with cooling between them saves work, follows where a compressor's electricity goes, and puts a value on recovering its heat. The failure case is a compressor room that overheated in summer because nobody had allowed for the heat the compressor makes.

## The least work to compress air

Compressing a gas takes work, and how much depends on what happens to the heat that compression generates.

If the gas is kept at its starting temperature throughout, with the heat removed as fast as it forms, the compression is **isothermal**, and the work is the least possible. For an ideal gas, it is **p₁ × V₁ × ln(p₂ ÷ p₁)**, with absolute pressures.

If no heat is removed at all, the compression is **adiabatic**, and the gas heats up as it is squeezed, which makes it harder to squeeze further. For air, with its ratio of specific heats of 1.4, the ideal adiabatic work is **3.5 × p₁ × V₁ × ((p₂ ÷ p₁)^0.286 − 1)**.

```figure
type: formula
title: Ideal work to compress 1 m³ of free air to 7 bar gauge
formula: isothermal W = p₁ V₁ ln(p₂ ÷ p₁)        adiabatic W = 3.5 p₁ V₁ ((p₂ ÷ p₁)^0.286 − 1)
caption: This is an illustration for 1 m³ of air at 101.325 kPa and 20 °C compressed to 8.013 bar absolute, a pressure ratio of about 7.91. Real compressors fall between the two ideals and above them, because of friction and other losses.
- p₁ × V₁ | 101,325 Pa × 1 m³ = 101.3 kJ
- Pressure ratio | 8.013 ÷ 1.013 ≈ 7.91
step: isothermal: 101.3 × ln 7.91 ≈ 209.6 kJ ≈ 0.058 kWh
step: adiabatic: 3.5 × 101.3 × (7.91^0.286 − 1) ≈ 285.7 kJ ≈ 0.079 kWh
step: adiabatic outlet temperature ≈ 293.15 × 7.91^0.286 ≈ 530 K ≈ 256 °C
```

Isothermal compression of a cubic metre of free air to 7 bar gauge needs about **0.058 kWh**; adiabatic compression about **0.079 kWh**, about 36% more, and would deliver the air at about **256 °C**. Real compressors are cooled, by oil injected into screw compressors, by water jackets or by fins, so they sit between the two ideals in their thermodynamics, and above both in practice because of friction, leakage and motor losses.

## A real compressor against the ideal

*Pneumatics by the Numbers* used a typical specific power of about **7 kW per m³/min** of free air for a loaded screw compressor at about 7 bar. That is about **0.117 kWh** per cubic metre. The ideal isothermal work, 0.058 kWh, is about **50%** of it; the ideal adiabatic work, 0.079 kWh, about 68%. The rest goes in the compressor's mechanical and thermodynamic inefficiencies, its motor and drive, and the energy used by its fans and controls.

```figure
type: bars
title: Energy to compress 1 m³ of free air to 7 bar gauge
unit: kWh
max: 0.13
caption: This is an illustration. The ideals are calculated; the real figure is a typical loaded screw compressor's specific power from Pneumatics by the Numbers. Two-stage compression with intercooling sits between the single-stage adiabatic ideal and the isothermal ideal.
- Isothermal ideal | 0.058
- Two-stage adiabatic with intercooling, ideal | 0.068
- Single-stage adiabatic ideal | 0.079
- *Typical real screw compressor | 0.117
```

The comparison shows where improvement is possible. A real compressor using nearly twice the isothermal ideal is not badly designed; it reflects the practical limits of cooling a gas during compression and of the machinery itself. But the gap explains why compressor efficiency, specific power at the actual operating pressure, is worth comparing carefully when buying.

## Staging and intercooling

Compressing in two stages, with the air cooled back to near its starting temperature between them, saves work. Each stage compresses through a smaller ratio, about **√7.91 ≈ 2.81**, so the air heats less in each, and the cooler air entering the second stage is easier to compress. The ideal two-stage work, with perfect intercooling, is about **243.8 kJ**, about **0.068 kWh** per cubic metre, about **15% less** than single-stage adiabatic compression, and each stage's outlet is only about **121 °C** instead of 256 °C. More stages approach the isothermal ideal more closely, at more cost and complexity. Large compressors and high-pressure machines use multiple stages for this reason; small factory compressors usually use a single, well-cooled stage.

## Lower pressure, less work

The work grows with the pressure ratio, so delivering air at a lower pressure saves energy. *Pneumatics by the Numbers* quoted the U.S. Department of Energy's rule of thumb: about 1% of energy for each 2 psi, about 0.14 bar, of reduced discharge pressure in systems around 7 bar. The thermodynamics shows why: the work depends on the logarithm or a fractional power of the pressure ratio, so every reduction in delivery pressure reduces it, and with it the heat to be removed.

## Refrigeration compressors work the same way

A refrigeration compressor compresses refrigerant vapour rather than air, but the thermodynamics is the same. Its work depends on the pressure ratio between the evaporator and the condenser, which is set by the evaporating and condensing temperatures, which is why Chapters 2 and 6 found the lift so important: a larger lift means a larger pressure ratio and more work per kilogram of refrigerant. The refrigerant leaves the compressor hot, superheated well above its condensing temperature, for the same reason air does, and that superheat must be removed in the condenser. Refrigeration compressors are rated by their makers in terms of capacity and power input at stated evaporating and condensing temperatures, which is the data a designer uses in place of the ideal formulas here.

## Part load and control

Compressors rarely run at full load all the time, and how they handle part load affects their energy use as much as their full-load efficiency. A load-and-unload compressor runs at full output until its pressure limit, then unloads, still turning and still using a substantial share of its full-load power while delivering no air. A compressor that spends much of its time unloaded therefore has a much worse average specific power than its rating. Variable-speed compressors slow down to match demand and avoid most of that waste, and on sites with varying demand they often save a large share of compressor energy. A receiver of adequate size, as *Pneumatics by the Numbers* explained, reduces cycling for fixed-speed machines.

## Measure the specific power

A compressor's real specific power can be measured with a power meter on its supply and a flow meter on its outlet, over a representative week. Dividing the energy used by the free air delivered gives kilowatt-hours per cubic metre, which can be compared with the maker's figure at the same pressure and with the ideals above. The same measurement, repeated each year, shows whether the compressor's performance is falling, through worn elements, dirty coolers or blocked filters, and tells the business when a service or replacement will pay.

## Leaks waste compressor work

Every leak wastes the full work of compressing the air that escapes. At the real specific power of about 0.117 kWh per cubic metre, a total leakage of 1 m³/min, spread across many small leaks, wastes about **7 kW** continuously. *Pneumatics by the Numbers* describes how to measure leakage with a compressor's load and unload times and how to find and fix leaks. In thermodynamic terms, a leak destroys the air's pressure energy entirely, creating entropy and wasting the work that put it there, which is the second law's measure of waste from Chapter 1.

## Where a compressor's electricity goes

By the first law, the electricity a compressor uses must go somewhere. A little is stored in the compressed air as pressure energy, but compressed air leaves the aftercooler at close to room temperature, and most of the work done on it has already been removed as heat. In practice, nearly all of a compressor's electrical input is rejected as heat: through its oil cooler, its aftercooler, its motor and its casing. Makers of compressors with heat recovery state how much of the input their designs make recoverable, and for oil-injected screw compressors it is usually a large majority.

```figure
type: compare
title: Where the factory's 30 kW air compressor's input ends up
cols: Typical destination | Recoverable
caption: This is an illustration. Most of the input becomes heat in the oil cooler; the maker's heat recovery data give the recoverable share for a particular compressor. This book uses 80% as a teaching value.
- *Oil cooler | hot oil, the largest share of the heat | yes, by an oil-to-water heat exchanger
- Aftercooler | heat from the compressed air | partly
- Motor and drive | heat into the enclosure's cooling air | as warm air, if ducted
- Radiation from the casing | heat into the compressor room | not usefully
- Stored in the compressed air | a small fraction, as pressure energy | used by the factory's tools and cylinders
```

## Recovering the heat

The food factory's air compressor is rated at **30 kW**. Running loaded for about **4,000 hours** a year, it uses about **120,000 kWh** of electricity, costing about **A$30,000** at A$0.25 per kWh. If **80%** of that input could be recovered as useful heat, a teaching value, it would yield about **96,000 kWh** a year of heat. Used to preheat boiler make-up water or wash-down water, displacing gas heat at about A$0.093 per kWh, it would be worth about **A$8,950** a year.

The usual method is an oil-to-water heat exchanger, fitted by the compressor's maker or supplier, that heats water to around 60 to 70 °C as the oil cools, or ducting the compressor's warm cooling air into a space that needs heating in winter. The heat is only available when the compressor runs loaded, so the water side needs storage or a load that coincides. Compared with the heat pump options in Chapter 4, compressor heat recovery is often cheaper and quicker to pay back, because the heat is already being produced and paid for.

## Matching recovered heat to a use

Recovered heat is only worth something if it displaces heat the factory would otherwise buy. The compressor's heat is available whenever it runs loaded, which in the food factory means both production shifts. The best matches are loads that run at the same time and need water at the temperatures heat recovery can give: preheating the boiler's make-up water, which flows whenever steam is used; preheating the wash-down system's cold feed, which runs during and after production; or warming a workshop in winter. The factory's plan connects the compressor's heat recovery exchanger to the boiler feed tank's make-up line, because make-up flows steadily through the shifts and every degree it is preheated is a degree the boiler does not have to supply, as *Process Steam by the Numbers* showed.

## A failure case: the overheating compressor room

This is an illustration. The factory's air compressor stands in a small room with a louvred door. Each summer, it tripped on high temperature on the hottest afternoons, stopping the factory's air supply. The supplier serviced it, found nothing wrong and suggested a larger compressor.

The maintenance engineer measured the room. On a hot afternoon, the air entering the compressor was over 45 °C, well above the outside temperature, because the compressor's own heat, around 30 kW, had nowhere to go except through the louvres. The room was, in effect, an oven heated by the compressor. Hot inlet air also made the compressor less efficient, because warm air is less dense, so each cubic metre it drew in contained less mass of air to deliver.

The detection came from measuring the inlet air temperature and comparing the compressor's heat output with the room's ventilation. The correction was to duct the compressor's hot cooling air out of the room through a fan, drawing cooler outside air in through a dedicated inlet, and, as a later project, to fit an oil-to-water heat exchanger for heat recovery. The trips stopped, and the larger compressor was never needed. The compressor's inlet air temperature is now logged alongside the compressor's pressure and running hours, so any return of the problem shows up well before the next summer's first hot afternoon.

## How this applies to a small Australian business

Know the least work your compressors could need, and compare it with what they use: a well-run screw compressor uses about twice the isothermal ideal, and comparing specific power at your operating pressure when buying matters. Deliver air at the lowest pressure that works. Remember that nearly all compressor electricity becomes heat, give that heat somewhere to go, and recover it where there is a use for warm water or air. And ventilate compressor rooms for the heat they make, because hot inlet air costs efficiency and reliability.

## Exercise: a smaller compressor

A packing plant's compressor delivers **1.2 m³/min** of free air at 7 bar gauge, at the typical specific power of 7 kW per m³/min, for 4,000 hours a year. What is its electrical input and annual electricity? How does its specific energy compare with the isothermal ideal? If 80% of its input could be recovered as heat displacing gas at A$0.093 per kWh, what would that be worth?

**Worked answer.** The input is **1.2 × 7 = 8.4 kW**, about **33,600 kWh** a year. Its specific energy is **7 ÷ 60 ≈ 0.117 kWh/m³**, about **twice** the isothermal ideal of 0.058 kWh/m³. Recoverable heat is about **0.8 × 33,600 ≈ 26,900 kWh** a year, worth about **26,900 × 0.093 ≈ A$2,500** a year in displaced gas heat, if there is a use for it when the compressor runs.
