---
book: process-chillers-by-the-numbers
chapterSlug: saturation-pressure-and-temperature
order: 4
title: "Saturation pressure and temperature"
description: "Why boiling point follows pressure, the Clapeyron equation checked against NIST R-134a data, reading gauges, superheat and subcooling, and air in a condenser."
draft: false
---

A refrigerant is chosen for one property above all: at the pressures a compressor can reasonably produce, it boils at the temperature the evaporator needs and condenses at the temperature the condenser can reject heat. The link between a liquid's boiling temperature and the pressure above it is fixed by thermodynamics, and it is what lets a service technician read a chiller's evaporating and condensing temperatures from two pressure gauges, check its superheat and subcooling with a thermometer, and find faults that no one can see.

This chapter sets out R-134a's saturation curve from NIST's data, checks it against the Clapeyron equation, shows why the simpler Clausius–Clapeyron form misses by more than 10% for a refrigerant, explains how temperatures are read from gauges and how superheat and subcooling are measured, and ends with air trapped in CH-30's condenser after a repair.

## Saturation: one pressure, one temperature

A pure liquid and its vapour in equilibrium can coexist at a given temperature only at one pressure, the **saturation pressure**, and at a given pressure only at one temperature, the **saturation temperature**. Statistical mechanics explains why: at equilibrium the molecules must be equally content, in the precise sense of equal chemical potential, in either phase, and that condition fixes one variable once the other is chosen.

NIST gives R-134a's saturation pressure as, in absolute megapascals:

- −10 °C: **0.2006**; 0 °C: **0.2928**; 2 °C: **0.3146**;
- 10 °C: **0.4146**; 20 °C: **0.5717**; 25 °C: **0.6654**; 30 °C: **0.7702**;
- 35 °C: **0.8870**; 40 °C: **1.0166**; 45 °C: **1.1599**; 50 °C: **1.3179**; 55 °C: **1.4915**.

Two things stand out. The pressure rises steeply with temperature, by about 13 to 14% for each 5 K near CH-30's condensing temperature. And the whole working range of a process chiller, from 2 °C evaporating to 45 °C condensing, lies between about 0.3 and 1.2 MPa, pressures that ordinary compressors, piping and heat exchangers handle comfortably. That is no accident; it is why R-134a and its relatives were chosen for this kind of duty.

```figure
type: line
title: R-134a saturation pressure against temperature
x: Saturation temperature, °C
y: Absolute pressure, MPa
ymin: 0
ymax: 1.6
mark: 2 | Evaporating
mark: 45 | Condensing
caption: NIST data. CH-30 evaporates at 0.315 MPa and condenses at 1.160 MPa; the curve steepens as the temperature rises.
- -10 | 0.2006
- 0 | 0.2928
- 10 | 0.4146
- 20 | 0.5717
- 30 | 0.7702
- 40 | 1.0166
- 45 | 1.1599
- 50 | 1.3179
- 55 | 1.4915
```

## The Clapeyron equation

The slope of the saturation curve is fixed by thermodynamics. For any pure substance, the **Clapeyron equation** relates it to the latent heat and the change of volume on evaporation:

dp/dT = h_fg ÷ (T × (v_g − v_f))

where h_fg is the latent heat per kilogram and v_g and v_f the specific volumes of the vapour and liquid. It is exact; it follows from the equality of the two phases' Gibbs free energies along the curve.

It can be checked against NIST at 5 °C. Between 4 and 6 °C, NIST's pressures are 0.33766 and 0.36198 MPa, a slope of about **12,160 Pa per kelvin**. At 5 °C, the vapour's density is 17.131 kg/m³ and the liquid's 1,278.1, so v_g = 0.05837 and v_f = 0.000782 m³/kg. Then:

h_fg = 278.15 × (0.05837 − 0.000782) × 12,160 = **194.8 kJ/kg**

NIST's own latent heat at 5 °C, the difference between its vapour and liquid enthalpies, is 253.35 − 58.61 = **194.7 kJ/kg**. The equation and the data agree to 0.03%.

```figure
type: formula
title: The Clapeyron equation checked against NIST R-134a data at 5 °C
formula: h_fg = T × (v_g − v_f) × dp/dT
caption: Exact for a pure substance. The slope is taken from NIST's pressures at 4 and 6 °C; the volumes from NIST's densities at 5 °C.
- dp/dT | (0.36198 − 0.33766) MPa ÷ 2 K = 12,160 Pa/K
- v_g, v_f | 1 ÷ 17.131 and 1 ÷ 1,278.1 m³/kg
step: h_fg = 278.15 × 0.05759 × 12,160 = 194.8 kJ/kg
step: NIST: 253.35 − 58.61 = 194.7 kJ/kg, agreement 0.03%
```

## Where the simple form fails

Physics texts often simplify the Clapeyron equation by neglecting the liquid's volume and treating the vapour as an ideal gas, which gives the **Clausius–Clapeyron** form used in Vacuum by the Numbers for water: ln(p₂ ÷ p₁) = (L ÷ R) × (1 ÷ T₁ − 1 ÷ T₂). For water vapour at a few kilopascals, it agrees with NIST's data to a fraction of a per cent.

For R-134a between 0 and 10 °C it does much worse. Using NIST's pressures of 0.29280 and 0.41461 MPa and R-134a's molar mass of 102.03 g/mol, it gives a latent heat of **219 kJ/kg**, 12.6% above NIST's 194.7. The reason is that R-134a vapour at a few bar is not an ideal gas: its compressibility factor, pV ÷ (RT) for one mole, is about **0.90** at 5 °C, so it occupies about a tenth less volume than an ideal gas would, and the simple form's assumption is out by about that much. Refrigerants are used at pressures where their vapours are noticeably non-ideal. Their properties come from tables or equations of state fitted to measurements, such as NIST's, and the simple textbook relations are for understanding, not for numbers.

## Reading temperatures from gauges

Because saturation pressure and temperature are locked together, a pressure gauge on a two-phase region reads a temperature. Service gauges for refrigeration carry temperature scales for common refrigerants alongside the pressure scale, and digital manifolds calculate the saturation temperature for a selected refrigerant.

This is an illustration. On CH-30 at its design point:

- the suction gauge reads about **213 kPa** gauge, 0.3146 MPa absolute with a standard atmosphere, which is a saturation temperature of **2 °C**: the evaporating temperature;
- the discharge gauge reads about **1,059 kPa** gauge, 1.1599 MPa absolute, a saturation temperature of **45 °C**: the condensing temperature.

The gauges must be read in the right place and the right units, and the refrigerant set correctly on a digital manifold; the same pressure is a very different temperature for a different refrigerant. Pressure drops along the lines mean that the suction gauge at the compressor reads slightly below the evaporator's own pressure, and service technicians learn the size of those drops for the plant they work on.

## Superheat and subcooling

The two numbers that tell a technician most about a running system come from a gauge and a thermometer together.

- **Superheat** at the evaporator's outlet or the compressor's inlet: the measured suction line temperature minus the saturation temperature at the suction pressure. CH-30: 7 − 2 = **5 K**.
- **Subcooling** at the condenser's outlet: the saturation temperature at the discharge pressure minus the measured liquid line temperature. CH-30: 45 − 40 = **5 K**.

Together they diagnose most charge and flow faults. Low subcooling with high superheat suggests the system is short of refrigerant; high subcooling with low superheat suggests too much refrigerant, or a restriction after the condenser; high superheat with normal subcooling suggests the expansion valve is starving the evaporator. Each reading means something only alongside the conditions, the water and air temperatures and the load, at which it was taken.

```figure
type: compare
title: Reading CH-30's design point from gauges and thermometers
rowhead: Reading
cols: Gauge, kPa(g) | Absolute, MPa | Saturation temperature, °C | Line temperature, °C | Result
caption: This is an illustration with a standard atmosphere. Superheat is line minus saturation on the suction side; subcooling is saturation minus line on the liquid side.
- Suction | 213 | 0.3146 | 2 | 7 | 5 K superheat
- Discharge | 1,059 | 1.1599 | 45 | 40, liquid line | 5 K subcooling
```

## Standstill pressure

When a chiller has been off long enough for everything to reach the same temperature, the refrigerant settles at the saturation pressure for that temperature, on both sides of the circuit, as long as some liquid remains. A standstill reading is therefore a check on the refrigerant itself: at 25 °C, R-134a should read **0.6654 MPa** absolute, about **564 kPa** gauge, whatever the system.

A reading higher than the saturation pressure for the measured temperature means something other than R-134a is present. A reading that follows a different refrigerant's curve means the wrong refrigerant, or a mixture. Both checks cost only a few minutes and a thermometer.

## Blends and glide

R-134a is a single substance, so at a given pressure it boils and condenses at one temperature. Many refrigerants are blends of two or more substances, and some of those, the **zeotropic** blends, do not: at a fixed pressure they start to boil at one temperature, the **bubble point**, and finish at a higher one, the **dew point**, because the more volatile component boils off first. The difference is the **temperature glide**, which for some common blends is several kelvin.

Glide changes how gauges are read. Superheat is measured from the dew point, and subcooling from the bubble point, and service tables for blends give both. It also means that a leak from the vapour space of a blend's container or a system can change the blend's composition, because the more volatile component leaks preferentially, and a system topped up after such a leak may no longer hold the blend it was designed for. Manufacturers' charging rules for blends, typically charging from the liquid phase, follow from that.

## Pressures and the equipment's rating

The saturation curve also sets the pressures the equipment must be built for. A refrigeration circuit's highest pressure is not usually reached in operation but at standstill, on a hot day, when the whole circuit, condenser in the sun, reaches a high temperature and the refrigerant's pressure rises to match. If CH-30's outdoor condenser could reach 55 °C in summer sun, its refrigerant would stand at 1.49 MPa absolute, more than its design-point condensing pressure of 1.16 MPa.

The design pressures of the components, the settings of the pressure relief devices and the high-pressure cut-out are chosen with that in mind, under the applicable standards, by the system's designer. For an operator, the practical points are that a chiller's pressures are normal at standstill as well as in operation, that relief devices must not be blocked or altered, and that a refrigerant with a different saturation curve cannot be put into equipment rated for another, even if it is described as a replacement, without the designer's check.

## Choosing a refrigerant by its pressures

Every refrigerant has its own saturation curve, and the curve decides much about the equipment.

- A refrigerant with **higher pressures** at a given temperature has denser suction vapour, so a smaller compressor moves the same heat; its piping and components must be rated for higher pressures.
- A refrigerant with **lower pressures** needs a larger compressor and larger suction pipes for the same duty, and at very low evaporating temperatures may run below atmospheric pressure on the suction side, which lets air in through any leak.
- The **critical temperature**, above which the refrigerant cannot be condensed at any pressure, must be comfortably above the condensing temperature, or the cycle's efficiency suffers badly.

R-134a sits in the middle of the range, which suits a process chiller condensing at 45 °C. The other properties that matter in choosing a refrigerant, flammability, toxicity and environmental effect, and the rules that follow from them, are set out in the Library’s chapter on [refrigerants, rules and safety](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/refrigerants-rules-and-safety/).

## The error: air in the condenser

This is an illustration. After CH-30's evaporator was replaced, the contractor evacuated the circuit for less time than the procedure required, before recharging it. On the first hot afternoon, the discharge gauge read **1.30 MPa** absolute, which on the R-134a scale is a condensing temperature of about 49 °C, while the condenser's air entered at 35 °C and the liquid line was at about 41 °C. The compressor's power was well above its usual figure.

The moulder's maintenance technician ran a standstill check the next morning, with the chiller off overnight and the whole circuit at 25 °C. The gauges read **0.745 MPa** absolute against R-134a's saturation pressure of 0.6654 MPa at 25 °C: about **80 kPa** too high. By Dalton's law of partial pressures, the excess was the partial pressure of another gas, and the only candidate was air left in the circuit. Air does not condense at the condenser's temperature; it collects in the condenser, takes up surface the refrigerant needs, and adds its own partial pressure to the refrigerant's. The compressor had been discharging against something like a 50 °C condensing pressure, which Chapter 7 shows costs about 16% more power than 45 °C.

The refrigerant was recovered, the circuit evacuated properly, a deep vacuum held and checked for rise (the method in Vacuum by the Numbers), and the charge weighed back in. The standstill check now forms part of the contractor's commissioning sheet for any work that opens the circuit.

```figure
type: checklist
title: Pressure–temperature checks on a refrigeration circuit
caption: Two gauges and a thermometer find most faults. The last line is this chapter's error.
- Refrigerant set correctly on the manifold | R-134a
- Gauge readings converted to absolute before using tables | 213 and 1,059 kPa(g)
- Superheat and subcooling measured with the conditions | 5 K and 5 K at 12 °C water, 35 °C air
- Standstill pressure matches saturation at the measured temperature | 0.6654 MPa at 25 °C
- Non-condensables suspected when head pressure is high and subcooling odd | Dalton's law
- x Circuit opened and poorly evacuated | 80 kPa of air; compressor working against about 49 °C
```

## Exercise: a standstill reading

A chiller using R-134a has been off overnight in a plant room at **30 °C**. Its gauges read **690 kPa** gauge on both sides. Taking a standstill atmosphere of 101 kPa, is the reading consistent with pure R-134a? What would 790 kPa gauge suggest?

**Worked answer.** NIST's saturation pressure at 30 °C is 0.7702 MPa absolute, 770 kPa.

- 690 kPa gauge is about **791 kPa** absolute, about 21 kPa above saturation. That is within the combined uncertainty of a service gauge and a plant-room temperature reading, but close enough to the limit to repeat the check with a calibrated gauge and a thermometer on the pipework itself.
- 790 kPa gauge is about **891 kPa** absolute, about 121 kPa above saturation at 30 °C, and close to the saturation pressure at 35 °C. Either the circuit holds a large amount of non-condensable gas, or the refrigerant is warmer than the room, or it is not pure R-134a. A refrigerant sample analysis settles which.
