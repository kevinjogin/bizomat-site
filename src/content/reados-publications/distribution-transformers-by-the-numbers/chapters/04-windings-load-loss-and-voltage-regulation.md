---
book: distribution-transformers-by-the-numbers
chapterSlug: windings-load-loss-and-voltage-regulation
order: 4
title: "Windings, load loss and voltage regulation"
description: "How a transformer's windings carry current, where its load losses come from, what its impedance means, how far its voltage falls under load, and how to add a new load correctly in kVA, not kW."
draft: false
---

The core sets a transformer's voltages; the windings carry its current. At TX-1's rating of 1,500 kVA its low-voltage winding carries 2,000 A in each phase, and every ampere of it heats the copper, sets up a magnetic field that spills out between the windings, and drops a little voltage on the way to the switchboard. Those three effects are the load loss, the leakage reactance and the voltage regulation. Unlike the core loss, they all grow with the load, so they decide how much load a transformer can carry and how well it holds its voltage while doing so.

This chapter works out TX-1's currents, splits its 16.5 kW load loss into its parts, explains what its 5% impedance means, and calculates how far the voltage at the switchboard falls under load. It then sizes the new freezing tunnel's load with the KEVOS® motor power tool, shows how adding the tunnel in kilowatts instead of kilovolt-amperes made TX-1 look comfortably large enough, and ends with what power factor correction does to both the loading and the voltage.

## Currents

A three-phase transformer's line current is its apparent power divided by √3 times the line voltage. At rated load TX-1's LV line current is 1,500,000 ÷ (√3 × 433) = 2,000 A, and its HV line current is 1,500,000 ÷ (√3 × 11,000) = 78.7 A. Inside the delta-connected HV winding the phase current is the line current divided by √3, 45.5 A.

```figure
type: compare
title: TX-1's LV current and load loss at the loads in the case
cols: LV line current | Load loss | Share of rated load loss
rowhead: Load
- Night refrigeration, 650 kVA | 867 A | 3.10 kW | 19%
- Today's peak, 1,175 kVA | 1,567 A | 10.12 kW | 61%
- Production with the tunnel, 1,300 kVA | 1,733 A | 12.39 kW | 75%
- * Peak with the tunnel, 1,520 kVA | 2,027 A | 16.94 kW | 103%
caption: This is an illustration. Current = S ÷ (√3 × 433 V); load loss = 16.5 kW × (S ÷ 1,500)², since load loss is proportional to the square of the current.
```

The LV winding in a transformer of this size is usually made of copper or aluminium foil as wide as the winding is tall, wound in a few dozen turns with paper or polymer film between them. Foil carries large currents compactly and keeps the current evenly spread across the winding's height. The HV winding has many more turns of insulated rectangular or round wire, arranged in layers or discs with ducts between them for oil to flow through. The paper between turns and layers is the insulation whose ageing Chapter 7 discusses.

Copper and aluminium are both used for windings. Aluminium conducts about 60% as well as copper by volume, so an aluminium winding of the same resistance needs more cross-section and a slightly larger core window, but it weighs about half as much and costs less. Either can give the same load loss; what matters to the buyer is the guaranteed loss and the quality of the joints between the winding and its leads, because aluminium joints need careful preparation to stay sound for decades. The choice is the maker's, within the purchaser's loss guarantees and specification.

## Load loss and its parts

The load loss in a test report is measured with the LV winding short-circuited and the HV voltage raised until rated current flows. The voltage needed is small, about 5% of rated, so the core's flux and its loss are negligible, and the power drawn is essentially the load loss. It has three parts.

1. **Resistive loss**, I²R, the current through the windings' DC resistance. It is by far the largest part.
2. **Eddy loss in the windings.** The leakage field between the windings passes through the conductors themselves and induces eddy currents in them, just as the main flux does in the core. The loss rises with the square of the conductor's dimension across the field and the square of the frequency, which is why foil and thin strip are used, and why harmonic currents raise it disproportionately (Chapter 9).
3. **Stray loss** in the tank walls, the core clamps and other steel parts that the leakage field reaches.

```figure
type: bars
title: The parts of TX-1's 16.5 kW load loss at rated current
x: Part
y: Loss, kW
caption: This is an illustration. A typical split for a distribution transformer of this size; the maker's design calculation gives the real one. The total is the test report's value at the reference temperature of 75 °C.
- * Resistive, I²R | 14.9
- Eddy loss in the windings | 0.9
- Stray loss in tank and clamps | 0.7
```

Resistance rises with temperature, about 0.39% per kelvin for copper, so the resistive loss of a hot winding is higher than that of a cold one. Test reports therefore correct the measured load loss to a reference temperature, commonly 75 °C. A copper winding at 75 °C has 1.216 times the resistance it has at 20 °C, so a load loss measured on a cold transformer straight from the store understates the loss it will have in service by about a fifth if it is not corrected.

## Impedance

When TX-1 is short-circuited on its LV side, 5% of its rated HV voltage drives rated current. That 5% is its impedance, written as a percentage of rated voltage. It has two parts. The resistive part is the load loss as a share of the rating: 16.5 kW ÷ 1,500 kVA = 1.1%. The reactive part comes from leakage flux, the field that runs between the HV and LV windings without linking both, and is found from the impedance and the resistance by Pythagoras: √(5.0² − 1.1²) = 4.88%.

The impedance is a design choice. A low impedance gives good voltage regulation but lets large currents flow in a fault; a high impedance limits fault currents but drops more voltage under load. Chapter 5 uses that trade-off to choose the impedance of TX-1's replacement.

## Voltage regulation

Under load, the voltage at the LV terminals falls below its no-load value by the voltage drop across the transformer's impedance. The drop depends on the load's size and power factor, because the reactive part of the impedance drops most voltage when the current lags the voltage, as it does with motor loads.

```figure
type: formula
title: Voltage regulation of a transformer
formula: ε% ≈ K × (R% × cos φ + X% × sin φ) + [K × (X% × cos φ − R% × sin φ)]² ÷ 200
caption: ε% is the fall in voltage from no load to the load as a percentage of the no-load voltage, K the load as a fraction of rated, R% and X% the resistance and reactance in per cent, and cos φ the load's power factor. The second term is a small correction that matters only at high reactance and load.
- K | load ÷ rating
- R%, X% | 1.1% and 4.88% for TX-1
- cos φ | load power factor
```

With the tunnel, TX-1's peak of 1,520 kVA at a power factor of 0.85 gives K = 1.013, and ε = 1.013 × (1.1 × 0.85 + 4.88 × 0.527) + a small correction = 3.62%. With the principal tap and a nominal 11 kV supply, the 433 V at no load falls to 417.3 V at the switchboard, before the voltage drop in the cables to the machines. With the plant's real supply of 11.3 kV and the +2.5% tap of Chapter 2, it falls from 434.3 V to about 418.6 V.

## Measuring the load properly

Every loading decision in this book starts from a measured load, and how it is measured matters. The plant's first figure, 1,175 kVA, came from the main switchboard's meter, which records the highest demand averaged over each 30-minute interval. That is a good measure for a transformer, because its oil and windings take hours to heat up and a few seconds or minutes at a higher load hardly affect their temperature. A figure read from an instantaneous display at a busy moment would overstate the thermal load; a monthly average from the electricity bill would hide the peaks entirely.

Before committing to the tunnel, the plant logged the LV side of TX-1 for three weeks with a portable power quality analyser: the current in each phase and the neutral, the voltage, real and apparent power and the harmonic content, all as 10-minute averages. The log confirmed the 1,175 kVA peak, showed that the peak lasted about two hours each afternoon when the blanchers and the existing freezers ran together, and gave the daily load profile used in Chapters 6 to 8. It also showed the harmonic currents that Chapter 9 deals with. Three weeks of logging cost a few days of an electrician's time and gave the plant numbers instead of estimates for every later decision.

## Unbalanced phases and the neutral

The three phases rarely carry exactly equal currents, because single-phase loads such as lighting, office equipment and some heaters are spread unevenly. The log showed TX-1's phases at the afternoon peak carrying about 2,090, 1,990 and 2,000 A, an average of 2,027 A. The most heavily loaded phase's winding carries 3% more current than the average and, since resistive loss goes with the square of current, makes about 6% more heat than it would at the average. Over the whole transformer the extra loss from this degree of unbalance is small, about 0.2%, but the hottest phase sets the hot-spot temperature, so the loading checks in Chapters 6 and 7 use the highest phase current, not the average.

The neutral carries the difference between the phase currents plus any triplen harmonic currents, which add in the neutral instead of cancelling. In a plant with many single-phase electronic loads the neutral current can be surprisingly large, and the LV neutral connection and cable must be sized for it. The delta HV winding of a Dyn transformer keeps the imbalance from reaching the 11 kV network as a zero-sequence current, but it does not stop the LV neutral and the transformer's own LV winding from carrying it.

## The case: sizing the tunnel's load

The new spiral freezing tunnel has two 110 kW screw compressors and eight 7.5 kW evaporator fans. The [three-phase motor power tool](/tools/motor-power/) works out a motor's line current, electrical input power, shaft output power, torque and apparent power from its voltage, power factor, efficiency and either its output power or its measured current. With 400 V at the motors and the motor makers' full-load figures:

```figure
type: compare
title: The freezing tunnel's motors at full load
cols: Line current | Input power | Apparent power | Number | Total apparent power
rowhead: Motor
- Compressor, 110 kW, power factor 0.87, efficiency 95.5% | 191.1 A | 115.2 kW | 132.4 kVA | 2 | 264.8 kVA
- Evaporator fan, 7.5 kW, power factor 0.82, efficiency 90.4% | 14.6 A | 8.30 kW | 10.1 kVA | 8 | 80.9 kVA
- * Tunnel | | 296.8 kW | | | 345.7 kVA
caption: This is an illustration. Results from the three-phase motor power tool. Adding the apparent powers of loads with similar power factors slightly overstates the total, a safe approximation; the tunnel's compressors run near full load for most of the production day.
```

The tunnel adds about 346 kVA to a peak that is now 1,175 kVA, so the peak becomes about 1,521 kVA, 101% of TX-1's rating. Chapters 6 and 7 work out whether TX-1 can carry that thermally; the short answer is that it can, for the hours it lasts, but with less margin than the plant would like.

## When it goes wrong: adding kilowatts to kilovolt-amperes

The first estimate of the tunnel's effect on TX-1 came from the tunnel supplier's sales sheet, which listed the installed motor power: 2 × 110 + 8 × 7.5 = 280 kW. The plant's maintenance planner added 280 to the 1,175 kVA peak shown by the switchboard's meter and concluded that the new peak would be 1,455 kVA, 97% of TX-1's rating, comfortably within it.

The sum mixed two different quantities. The 280 kW is the motors' shaft output. The electrical input is higher because no motor is 100% efficient, 296.8 kW in all. And the transformer is loaded by apparent power, not real power: a motor at a power factor of 0.85 draws 1 ÷ 0.85 = 1.18 kVA for each kilowatt of input. Correctly added, the tunnel is about 346 kVA and the peak 1,521 kVA, 101% of rating.

```figure
type: compare
title: Two ways to add the tunnel to TX-1's peak
cols: Tunnel added | New peak | Share of TX-1's rating
rowhead: Method
- Installed shaft power in kW | 280 | 1,455 | 97%
- * Apparent power of each motor in kVA | 345.7 | 1,521 | 101%
caption: This is an illustration. Transformers, cables and switchgear are rated in kVA or amperes because they carry current whatever its power factor; only the energy bill is in kWh.
```

The difference of 66 kVA was the difference between a transformer with margin and one without. The error was found when the electrical contractor's design report gave the tunnel's demand in amperes, which the planner converted to kVA to check, and the two figures did not agree. The plant's loading register now records every load in kVA and amperes, with its source.

## Power factor correction

The plant's switchboard has a power factor correction bank, but it was sized years ago for a smaller load, and with the tunnel the peak power factor would be about 0.85. Raising it to 0.95 does two useful things for TX-1. The real power at the peak, 1,521 × 0.85 = 1,293 kW, stays the same, but the apparent power falls to 1,293 ÷ 0.95 = 1,361 kVA, 91% of rating. And because less reactive current flows through the transformer's reactance, the regulation falls from 3.62% to 2.41%.

```figure
type: compare
title: TX-1 at the tunnel peak with and without more power factor correction
cols: Apparent power | Share of rating | LV current | Load loss | Regulation
rowhead: Power factor
- 0.85 | 1,521 kVA | 101% | 2,027 A | 16.94 kW | 3.62%
- * 0.95 | 1,361 kVA | 91% | 1,815 A | 13.58 kW | 2.41%
caption: This is an illustration. Same real power, 1,293 kW. Load loss = 16.5 kW × (S ÷ 1,500)²; regulation from the formula above with R = 1.1% and X = 4.88%.
```

Power factor correction is not free: capacitors need switching, protection and attention to harmonics, since a capacitor bank can resonate with the network's inductance at a harmonic frequency produced by drives. The Library's [Variable-Speed Drives by the Numbers](/reados/publications/variable-speed-drives-by-the-numbers/) discusses that risk. But as a way of freeing capacity in an existing transformer, an extra correction step is usually far cheaper than a bigger transformer.

## Exercise: the corrected load

With the power factor corrected to 0.95, TX-1 carries 1,361 kVA at the tunnel peak.

1. What is the LV line current, and the load loss?
2. What voltage does the switchboard see on the principal tap with a nominal 11 kV supply?
3. Why might the plant still choose a larger transformer?

**Answer.**

1. I = 1,361,000 ÷ (√3 × 433) = 1,815 A. Load loss = 16.5 × (1,361 ÷ 1,500)² = 13.58 kW.
2. The regulation is 2.41%, so 433 × (1 − 0.0241) = 422.6 V.
3. Because 91% of rating leaves little room for the next new load, because TX-1 is thirty years old and its condition (Chapters 3, 7 and 10) may make replacement wise anyway, and because a larger, lower-loss transformer may cost less to run over its life (Chapter 8). The correction makes the decision a choice rather than an emergency.
