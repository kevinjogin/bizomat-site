---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: thermistors-and-the-boltzmann-factor
order: 6
title: "Thermistors and the Boltzmann factor"
description: "Why a thermistor's resistance falls exponentially, the Beta and Steinhart–Hart equations, sensitivity, self-heating and resolution, and a replacement part that read 4 K low."
draft: false
---

A thermistor is a small bead, disc or chip of semiconducting ceramic whose resistance falls steeply as it warms. A common type has 10,000 Ω at 25 °C, about a third of that at 50 °C and about a quarter at 60 °C. That steepness makes it the most sensitive of the common contact sensors, more than ten times as sensitive as a Pt100 near room temperature, and it is cheap enough to fit in every power supply, battery pack, motor winding and data logger. CV-180 has two: one on the data logger's terminal block for cold-junction compensation, and one watching the temperature inside the control cabinet.

This chapter explains where the steep, exponential curve comes from, which turns out to be the same physics that governs chemical reaction rates and semiconductor devices. It then sets out the two equations used to convert resistance into temperature, the Beta equation and the Steinhart–Hart equation, the sensitivity and resolution a simple circuit gives, and the self-heating that matters far more for a thermistor than for a platinum sensor. It ends with a replacement thermistor that looked identical, read correctly at room temperature, and was 4 K low at the cabinet's alarm point.

## Why the resistance falls exponentially

In a metal, the number of electrons free to carry current is fixed by the metal's structure and hardly changes with temperature, and the resistance rises as lattice vibrations scatter them, as Chapter 4 explained. In a semiconductor, the number of free carriers itself depends on temperature. Electrons have to be lifted across an energy gap, or hop between sites, before they can carry current, and the energy to do it comes from the random thermal energy of the material.

Statistical physics gives the chance that a state of energy E above the ground is occupied at absolute temperature T: it is proportional to the **Boltzmann factor**, exp(−E/kT), where k is the Boltzmann constant, 8.617 × 10⁻⁵ eV/K. At room temperature kT is about 0.026 eV, so an energy step of a few tenths of an electronvolt is occupied only rarely, and a modest rise in temperature increases the occupation sharply. The number of carriers, and so the conductance, follows the Boltzmann factor; the resistance follows its inverse and falls exponentially as temperature rises.

For a pure semiconductor, the number of carriers rises as exp(−Eg/2kT), where Eg is the band gap, so the resistance varies as exp(Eg/2kT). The negative temperature coefficient (NTC) thermistors used in industry are mixed transition-metal oxides, in which carriers hop between metal ions rather than crossing a clean band gap, but the hopping is also thermally activated and follows the same exponential form. Either way, the resistance can be written R = R∞ exp(B/T), and B, in kelvin, is an activation energy divided by k. For a thermistor with B = 3,950 K, the effective activation energy is 3,950 × 8.617 × 10⁻⁵ = **0.340 eV**. The same factor reappears in the Arrhenius equation for chemical rates and in the life of electronic components, which is why it is worth recognising here.

## The Beta equation

Writing the exponential relative to a reference point gives the **Beta equation**, which is how most thermistors are specified.

```figure
type: formula
title: The Beta equation for an NTC thermistor
formula: R(T) = R₂₅ × exp(B × (1/T − 1/T₂₅))
caption: This is an illustration with R₂₅ = 10,000 Ω and B = 3,950 K. Temperatures in the equation are absolute, in kelvin. The inverse gives temperature from a measured resistance.
- R₂₅ | resistance at 25 °C (298.15 K), Ω
- B | the material constant, K, stated between two temperatures such as 25 °C and 50 °C
- T | absolute temperature, K
step: R(0 °C) = 10,000 × exp(3,950 × (1/273.15 − 1/298.15)) = 33,621 Ω
step: R(60 °C) = 2,486 Ω; R(85 °C) = 1,087 Ω
step: Inverse: 1/T = 1/298.15 + ln(R/R₂₅)/B
```

The equation's sensitivity follows directly: the fractional change in resistance per kelvin is −B/T². At 25 °C that is −3,950/298.15² = **−4.44% per kelvin**, against about +0.39% per kelvin for platinum. It falls as the temperature rises, to −3.56% per kelvin at 60 °C and −3.08% per kelvin at 85 °C, because the exponential flattens.

```figure
type: compare
title: A 10 kΩ, B = 3,950 K thermistor across its useful range
cols: Resistance | Sensitivity
caption: This is an illustration computed from the Beta equation. A Pt100 changes by about 0.39% per kelvin over the same range.
- −10 °C | 58,246 Ω | −5.70% per K
- 0 °C | 33,621 Ω | −5.29% per K
- * 25 °C | 10,000 Ω | −4.44% per K
- 40 °C | 5,301 Ω | −4.03% per K
- 60 °C | 2,486 Ω | −3.56% per K
- 85 °C | 1,087 Ω | −3.08% per K
```

### Where the Beta equation falls short

B is not truly constant. A real thermistor's curve departs slightly from a single exponential, so the value of B depends on the two temperatures used to define it, and makers state it as, for example, B₂₅/₅₀ or B₂₅/₈₅. A thermistor described by B₂₅/₈₅ will be read slightly wrongly near 50 °C, and one described by B₂₅/₅₀ will be read slightly wrongly at 0 °C or 85 °C. The Beta equation is exact at its two defining temperatures and good to a few tenths of a kelvin over a modest range around them, which suits many products, but not a reference or a wide range.

## The Steinhart–Hart equation

When better accuracy is needed over a wider range, the **Steinhart–Hart equation** adds a term that captures the curve's departure from a pure exponential:

1/T = a + b·ln R + c·(ln R)³

Its three coefficients are found by measuring the thermistor at three temperatures spanning the range of use and solving three simultaneous equations. Makers often publish coefficients for each part type, and a calibration laboratory can supply coefficients for an individual sensor.

This is an illustration. The logger's terminal-block thermistor is calibrated at three points, giving **32,650 Ω at 0 °C, 10,000 Ω at 25 °C and 3,602 Ω at 50 °C**. Solving gives a = 1.127355 × 10⁻³, b = 2.343978 × 10⁻⁴ and c = 8.674848 × 10⁻⁸, typical values for a 10 kΩ part. For comparison, a Beta equation through the 25 °C and 50 °C points gives B = 3,935 K, and through 0 °C and 25 °C it gives 3,855 K; the difference shows how far this part's curve is from a single exponential.

```figure
type: compare
title: The logger's thermistor read two ways
cols: Steinhart–Hart, three points | Beta, B₂₅/₅₀ = 3,935 K
caption: This is an illustration. Both agree at 25 °C and 50 °C, where the Beta value was defined. Away from those points the Beta equation drifts; at 0 °C it is nearly half a kelvin off.
- 32,650 Ω | 0.000 °C | 0.470 °C
- 10,000 Ω | 25.000 °C | 25.000 °C
- 5,301 Ω | 40.116 °C | 40.062 °C
- 3,602 Ω | 50.000 °C | 50.000 °C
- 2,486 Ω | 60.024 °C | 60.149 °C
```

For a cold-junction sensor, the half-kelvin difference at 0 °C matters: Chapter 3 showed that a cold-junction error passes almost directly into every thermocouple channel. A logger used outdoors on a winter morning, with its terminals near 0 °C, would carry it in every reading if its compensation used the Beta equation fitted at 25 °C and 50 °C. Good loggers use Steinhart–Hart coefficients or a stored table for exactly this reason.

## Interchangeability

A thermistor's tolerance is usually stated in two parts: the tolerance on R₂₅, often ±1%, and the tolerance on B, also often ±1%. Because the sensitivity at 25 °C is 4.44% per kelvin, a ±1% resistance tolerance is worth about **±0.23 K** at 25 °C. The B tolerance adds an error that grows away from 25 °C: a part whose true B is 1% higher than the nominal 3,950 K reads about **0.39 K** high at 60 °C and **0.23 K** low at 0 °C. Precision "interchangeable" thermistors are made to tighter curves, so that any part can replace any other without recalibration, and they cost more. For CV-180's cabinet sensor, ±1% parts are adequate; for the logger's cold junction, the maker's individual calibration or tight-curve parts are what make a channel accuracy of a few tenths of a kelvin possible.

## The measuring circuit and its resolution

A thermistor is usually measured in a voltage divider: a fixed resistor in series from a reference voltage, with the thermistor to ground, and the voltage at their junction read by a converter. A fixed resistor equal to R₂₅ puts the output at half the reference voltage at 25 °C, where the response is most linear.

This is an illustration. The cabinet monitor uses a 3.3 V reference, a 10 kΩ fixed resistor and a 12-bit converter, which divides 3.3 V into 4,096 steps of 0.81 mV.

```figure
type: stats
title: The cabinet monitor's thermistor divider
caption: This is an illustration: 3.3 V reference, 10 kΩ fixed resistor, 10 kΩ B = 3,950 K thermistor, 12-bit converter. Resolution falls as the curve flattens at higher temperatures.
- 1.650 V | output at 25 °C, half the reference
- 36.7 mV/K | output change per kelvin at 25 °C
- 0.022 K | one converter step at 25 °C
- 0.043 K | one converter step at 60 °C
- 0.141 K | one converter step at 100 °C
```

Even a cheap 12-bit converter resolves a few hundredths of a kelvin near room temperature, which is why thermistors suit electronics so well. The resolution falls away at temperatures far from R₂₅, because the divider's output flattens there; a thermistor meant to measure near 100 °C should be paired with a smaller fixed resistor, or a part with a lower R₂₅ chosen.

## Self-heating

Self-heating matters far more for a thermistor than for a Pt100, because a thermistor is small, often held in still air on a circuit board, and measured with more power for the sake of a larger signal. Makers state a **dissipation constant**, in milliwatts per kelvin, under defined conditions: the power that raises the part 1 K above its surroundings.

This is an illustration. With a dissipation constant of 1.5 mW/K assumed for the cabinet thermistor in still air, the 10 kΩ divider at 3.3 V passes 0.165 mA at 25 °C and dissipates **0.27 mW** in the thermistor, raising it by about **0.18 K**. If the designer had used a 1 kΩ fixed resistor to get a larger signal, the dissipation would have been **0.90 mW** and the self-heating **0.60 K**. Powering the divider only while a reading is taken, a few milliseconds every second, cuts the average power and the error almost to nothing, which is how battery loggers do it.

```figure
type: checklist
title: Specifying a thermistor input
caption: Each line maps to a number in this chapter. The open item is the error that follows.
- x Nominal R₂₅ and tolerance | 10 kΩ ±1%, about ±0.23 K at 25 °C
- x B value and the temperatures that define it | B₂₅/₅₀ or B₂₅/₈₅, matched to the range of use
- x Conversion equation | Beta for a narrow range; Steinhart–Hart for a wide range or a reference
- x Divider, reference and converter resolution | 0.022 K per step at 25 °C
- x Self-heating at the chosen current | 0.18 K with a 10 kΩ divider, continuous
- ? Replacement part has the same R₂₅ and B as the configuration | B = 3,435 K part read as 3,950 K: 4 K low near 50 °C
```

## Positive temperature coefficient thermistors

A second family, **PTC thermistors**, has a resistance that stays roughly constant up to a switching temperature and then rises steeply over a few kelvin. They are not used for measurement but as protective switches: embedded in motor windings to trip a relay when the windings overheat, or used as self-resetting fuses. CV-180's recirculating fan motor has PTC sensors in its windings connected to a protection relay, which is separate from the temperature measurement covered here and is set by the motor maker.

## How this applies to a small Australian business

Thermistors hide inside equipment that a small business buys rather than designs: controllers, loggers, chillers, battery chargers, motor drives and cabinet coolers. Their curves are set in the equipment's firmware, and a replacement sensor must match the curve, not merely the resistance at 25 °C. Businesses that design their own products meet thermistors more directly, and Australian summers make the high end of the range matter: a cabinet or enclosure in a non-air-conditioned shed can sit well above 40 °C for days. The practical rules are short. Order replacement thermistors by full part number, including B and its defining temperatures. Check any replacement at two temperatures, one of them near the alarm or control point. And in a design, choose R₂₅ and the fixed resistor for the temperature that matters most, keep the measuring power low, and convert with the maker's Steinhart–Hart coefficients or table when the range is wide.

## The error: a replacement with the wrong curve

This is an illustration. The control cabinet's monitor raises an alarm at a displayed **50 °C**, which is set to protect the solid-state relays that switch the heaters. When the cabinet thermistor's lead was damaged during maintenance, it was replaced from stock with a 10 kΩ thermistor that looked identical. The technician checked the reading against a thermometer in the cabinet, at about 25 °C, and both showed 25.0 °C.

The replacement had **B = 3,435 K**, another common value for 10 kΩ parts, while the monitor was configured for 3,950 K. Both curves pass through 10,000 Ω at 25 °C, so the check at room temperature could not show the difference. Away from 25 °C the two curves part: at a true 45 °C the new thermistor has 4,847 Ω, which the monitor converts with B = 3,950 K to **42.2 °C**; at a true 60 °C it reads **55.0 °C**. The alarm at a displayed 50 °C would not sound until the cabinet reached about **54 °C**.

The error was found during a hot spell in February, when the cabinet's cooling fan failed. The solid-state relays went into thermal shutdown and the oven stopped heating mid-cure, but the cabinet alarm never sounded. Investigating, the technician found the cabinet's displayed temperature at 49 °C and a hand-held thermometer reading about 53 °C. Comparing the thermistor's part number with the stores record found the different B value. The monitor's configuration was changed to the new part's curve, a two-temperature check (at room temperature and in warm water) was added for any thermistor replacement, and the stores record now carries B as well as R₂₅.

## Exercise: the logger on a cold morning

The business takes its logger to profile a customer's oven on a winter morning. The logger has sat in a vehicle and its terminals are at **0 °C** when the first run starts. Suppose its cold-junction thermistor were converted with the Beta equation through 25 °C and 50 °C (B = 3,935 K) instead of the Steinhart–Hart coefficients. What error would every thermocouple channel carry, and in which direction?

**Worked answer.** At 0 °C the thermistor's calibrated resistance is 32,650 Ω. The Beta equation with B = 3,935 K converts that to **0.47 °C**, so the logger believes its terminals are 0.47 K warmer than they are. It adds the type K voltage for 0.47 °C instead of 0 °C, about 0.019 mV too much, and every channel reads about **0.47 K high**. The error shrinks as the logger warms towards 25 °C and vanishes there, so readings taken over the first hour drift downwards by about half a kelvin while the logger warms, an effect that could be mistaken for a change in the oven. Using the Steinhart–Hart coefficients, or letting the logger reach room temperature before the run, removes it.
