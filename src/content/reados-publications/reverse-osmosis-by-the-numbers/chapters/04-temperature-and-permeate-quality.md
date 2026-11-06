---
book: reverse-osmosis-by-the-numbers
chapterSlug: temperature-and-permeate-quality
order: 4
title: "Temperature, seasons and permeate quality"
description: "The membrane maker's temperature correction factor, feed pressure and permeate flow from winter to summer, how salt passage rises with temperature, and controlling a plant through the seasons."
draft: false
---

A reverse osmosis membrane is far more sensitive to temperature than the osmotic pressure it works against. Between BW-12's coldest and warmest feed, 18 °C and 30 °C, the osmotic pressure changes by 4%, but the membrane's water permeability changes by almost half. A plant whose pump is set on a summer afternoon will be short of water on a winter morning, and a plant set in winter will push its lead elements hard in summer while its salt passage creeps up. Most of the "mystery" changes in a reverse osmosis plant's output turn out to be temperature.

This chapter sets out the membrane maker's temperature correction, recalculates BW-12's feed pressure and permeate flow through the seasons with the BIZOMAT pressure tool, shows how salt passage and permeate quality move with temperature, and sets out a control strategy that holds the plant steady. It ends with a pump set at commissioning in summer and a set of membranes cleaned in winter that did not need cleaning.

## The temperature correction factor

Water diffuses through the dense polymer of a reverse osmosis membrane more easily when it is warm, for the same reason that water's own viscosity falls and diffusion in solids speeds up with temperature: molecular motion has more thermal energy behind it. The effect follows an Arrhenius form, the same exponential dependence on the reciprocal of absolute temperature that governs diffusion of carbon in steel in the chapter on [temperature and the Arrhenius law](/reados/publications/diffusion-by-the-numbers/temperature-and-the-arrhenius-law/) in Diffusion by the Numbers.

Membrane makers express it as a temperature correction factor, TCF, that multiplies the 25 °C water permeability. The FilmTec system design equations give two branches.

```figure
type: formula
title: Temperature correction factor for water permeability
formula: TCF = exp[2640 × (1 ÷ 298 − 1 ÷ (273 + T))] for T ≥ 25 °C
formula: TCF = exp[3020 × (1 ÷ 298 − 1 ÷ (273 + T))] for T ≤ 25 °C
caption: From the FilmTec system performance projection equations, with T in °C. The constants correspond to activation energies of about 22 and 25 kJ/mol. Other makers publish their own factors; use the one for the membrane installed.
- 18 °C | TCF = exp[3020 × (1 ÷ 298 − 1 ÷ 291)] = 0.784
- 20 °C | 0.841
- 25 °C | 1.000 by definition
- 30 °C | TCF = exp[2640 × (1 ÷ 298 − 1 ÷ 303)] = 1.157
```

The factor is large. From 18 °C to 30 °C BW-12's permeability rises from 0.784 to 1.157 of its reference value, a ratio of 1.48. A rule often quoted on site, about 3% per kelvin, is a fair summary of that range: 1.03 raised to the power of 12 is 1.43. The factor applies to the design permeability, so at 18 °C BW-12's 2.80 L/(m²·h·bar) becomes 2.19, and at 30 °C it becomes 3.24.

## Pressure and flow through the seasons

There are two ways to look at the seasons. If the feed pressure is held, the permeate flow follows the temperature. If the permeate flow is held, the feed pressure must follow it. The pressure tool from Chapter 3 answers both questions: enter the temperature-corrected permeability and the temperature, and it gives the permeate flow at the present pressure and the pressure needed for the flow required.

```figure
type: compare
title: BW-12 through the seasons, from the reverse osmosis pressure check
cols: TCF | Permeability, L/(m²·h·bar) | Permeate at 11.5 bar g, m³/h | Feed pressure for 12.0 m³/h, bar g | Concentrate-end NDP at that pressure, bar
rowhead: Feed temperature
caption: This is an illustration. 2,400 mg/L feed, 75% recovery, 3.0 bar pressure drop, 0.5 bar gauge permeate, 666 m², design permeability 2.80 at 25 °C multiplied by the TCF. The osmotic pressure moves only from 1.569 to 1.634 bar.
- 18 °C, winter | 0.784 | 2.19 | 9.65 | 13.11 | 3.34
- 20 °C | 0.841 | 2.36 | 10.32 | 12.57 | 2.75
- * 25 °C, reference | 1.000 | 2.80 | 12.18 | 11.40 | 1.48
- 30 °C, summer | 1.157 | 3.24 | 13.99 | 10.58 | 0.55
```

Two consequences follow. In winter BW-12 needs 13.1 bar at the membrane inlet to make its 12 m³/h, 1.7 bar more than at 25 °C. The high-pressure pump must be selected for the coldest credible feed, with a margin for fouling between cleans, and its motor for the corresponding power. In summer the same flow needs only 10.6 bar, and if the pump delivers more, the plant overproduces or something must throttle it.

```figure
type: line
title: Feed pressure BW-12 needs for 12.0 m³/h, against feed temperature
x: Feed temperature, °C
y: Feed pressure at membrane inlet, bar gauge
ymin: 10
ymax: 14.5
caption: This is an illustration. From the pressure check with the TCF applied to the design permeability. At 15 °C the plant would need 14.0 bar; Chapter 9 shows how a fouled membrane adds to these figures.
- 15 | 14.02
- 18 | 13.11
- 20 | 12.57
- 25 | 11.40
- 30 | 10.58
```

The last column of the comparison shows the less obvious summer problem. With the pressure reduced to hold the permeate flow, the concentrate end of the train gets only 0.55 bar of driving pressure, while the lead elements get more than they did in winter. The flux at the lead element is roughly the permeability times the feed-end driving pressure: about 2.19 × (13.11 − 0.5 − 1.57) ≈ 24 L/(m²·h) in winter and 3.24 × (10.58 − 0.5 − 1.63) ≈ 27 L/(m²·h) in summer, against an average of 18. Warm water shifts the work to the front of the train. The lead elements foul faster and the tail elements make little water. This is why makers' design programs check the flux of the lead element against a limit as well as the average, and why warm-water plants are sometimes designed with fewer elements per stage or with permeate back pressure on the first stage to spread the flux.

## Salt passage rises with temperature

Salt diffuses through the membrane faster when it is warm too. The makers' equations apply the same temperature correction factor to the salt permeability, so at constant water flux the permeate strength rises in proportion to the TCF. If the water flux is held constant by raising the pressure in winter and lowering it in summer, BW-12's estimated permeate is about 26 mg/L at 18 °C, 33 mg/L at 25 °C and 38 mg/L at 30 °C.

```figure
type: bars
title: BW-12's estimated permeate strength by season at constant 12.0 m³/h
unit: mg/L
max: 45
caption: This is an illustration. The 25 °C estimate of 33.2 mg/L from Chapter 3 multiplied by the TCF. The plant's rinse specification, an illustration, is 60 mg/L; the summer figure uses most of the margin once the membranes have aged.
- 18 °C | 26.0
- 20 °C | 27.9
- 25 °C | 33.2
- * 30 °C | 38.4
```

If instead the pressure is held and the flux falls in winter, the dilution effect of Chapter 3 works the other way and the permeate gets saltier as it gets colder. The two effects pull in opposite directions, which is why an operator's impression of how a plant behaves in winter depends on how it is controlled. The calculation settles it.

The rinse water specification, 60 mg/L of dissolved solids (an illustration), has a comfortable margin at the design point. But the margin shrinks in summer and as the membranes age, and Chapter 9 shows how salt passage drifts upwards over the life of a membrane. The plant's permeate conductivity alarm should be set from the specification, not from the commissioning reading.

## Sizing the pump for the worst week

The pump's duty is set by the combination that needs the most pressure: the coldest feed, the saltiest credible water and the most fouled membrane the plant will tolerate before it is cleaned. This is an illustration. BW-12's designer allowed for a 10% loss of permeability between cleans, so in the worst week the permeability is 2.80 × 0.784 × 0.9 = 1.975 L/(m²·h·bar). The average driving pressure for 12.0 m³/h is then 12,000 ÷ (1.975 × 666) = 9.12 bar, and the feed pressure at the membrane inlet is 9.12 + 1.5 + 2.90 + 0.5 = **14.02 bar**. Adding about 0.6 bar for the check valve, flow meter and pipework between the pump and the first vessel puts the pump's discharge duty near 14.6 bar.

The pump must also not exceed the maximum pressure that the elements, the pressure vessels and the pipework are rated for, and the plant needs a high-pressure trip set below the lowest of those ratings. In summer, the same pump must turn down to about 10.6 bar at the membrane inlet without running far off its best efficiency point, which favours a variable-speed drive over a throttle valve. The chapter on [head, flow, power and efficiency](/reados/publications/centrifugal-pumps-by-the-numbers/head-flow-power-and-efficiency/) in Centrifugal Pumps by the Numbers explains how a pump's efficiency moves as its speed and duty change.

## Fitting the plant's own temperature constant

The makers' constants describe their membranes in general. A plant's own membranes, its own fouling and its own instruments produce data that can check them. This is an illustration. Soon after a clean, BW-12's engineer ran two short tests at fixed pressure, one on a hot afternoon and one on a cold morning, and logged the permeate flow at each.

```figure
type: compare
title: Two clean-membrane tests used to fit BW-12's temperature constant
cols: Feed pressure, bar g | Mean osmotic pressure, bar | Average NDP, bar | Permeate, m³/h | Permeability, L/(m²·h·bar)
rowhead: Test
caption: This is an illustration. Permeability is the permeate flow divided by area and driving pressure. The fitted constant, 2,902 K, sits between the maker's two constants and reproduces its factor over this range within half a per cent.
- Hot afternoon, 29 °C | 10.8 | 3.01 | 5.79 | 13.38 | 3.47
- Cold morning, 19 °C | 12.9 | 2.91 | 7.99 | 13.29 | 2.50
```

The ratio of the two permeabilities is 3.47 ÷ 2.497 = 1.390. For an Arrhenius form, the constant is the natural logarithm of that ratio divided by the difference of the reciprocal temperatures: ln(1.390) ÷ (1 ÷ 292 − 1 ÷ 302) = 0.329 ÷ 0.0001134 = 2,902 K. The maker's factor gives a ratio of 1.385 between the same temperatures. The plant follows the published correction closely, so the operators can trust it for normalisation in Chapter 9. Had the fitted constant differed widely, the likely causes would have been a flow meter or temperature sensor error, or tests too far apart in time, with fouling between them.

## Holding the plant steady

A plant that must deliver a steady flow at a steady quality needs a control strategy that does the temperature correction automatically. The usual arrangement for a plant of BW-12's size has three loops.

```figure
type: steps
title: BW-12's control loops
caption: This is an illustration. A variable-speed drive on the high-pressure pump does the seasonal work; the concentrate valve holds recovery; the conductivity loop protects the users.
- Permeate flow | variable-speed drive on the high-pressure pump holds 12.0 m³/h; pressure rises in winter and falls in summer
- Recovery | concentrate flow controller holds 4.0 m³/h, so recovery stays at 75% whatever the temperature
- Permeate quality | conductivity alarm and divert valve send off-specification permeate to drain or back to the feed tank
- * Limits | high feed pressure trip below the element and vessel rating; low concentrate flow alarm; high pressure-drop alarm
- Records | temperature, pressures, flows and conductivities logged for normalisation, Chapter 9
```

Throttling a fixed-speed pump with a valve also holds the flow, but it wastes the pressure dropped across the valve, which Chapter 8 prices. A pump selected for winter and throttled in summer burns the difference between 13.1 and 10.6 bar across a valve for half the year.

The feed tank also deserves attention. BW-12's bore water arrives at a fairly steady temperature, and most of the 12 K seasonal swing comes from the feed tank standing in the sun in summer and the cold in winter. Shading or insulating the tank narrows the swing, reduces the summer flux imbalance and the winter pressure, and costs little. Some plants heat the feed in winter with waste heat; BW-12's boiler blowdown and the plant's compressor heat are candidates, as long as the heated feed does not exceed the membrane maker's temperature limit.

The temperature measurement itself needs care, because every correction in this chapter and in Chapter 9 depends on it. The sensor should sit in the feed line close to the first pressure vessel, after the cartridge filter and the high-pressure pump, so that it reads the water the membranes actually see; the pump adds a little heat, and a sensor in the feed tank can lag the line by an hour or more after a refill. It should be checked against a reference thermometer at each calibration round. An error of 1 K changes the TCF by about 3%, which is enough to make a clean membrane look fouled or a fouled one look clean. A plant that logs temperature every few minutes, alongside its pressures and flows, has the data to separate the season from the membrane; a plant that writes one temperature on a shift sheet does not.

## The error: a summer set point and a winter clean

This is an illustration. BW-12 was commissioned in February with a feed at 30 °C. Its high-pressure pump was then a fixed-speed machine, and the commissioning contractor set a throttle valve to give 12.0 m³/h of permeate at 10.6 bar. By July the feed tank was at 18 °C, and the plant made only 8.3 m³/h. The permeate, which had read 38 mg/L at commissioning, now read about 38 mg/L as well, which the operators took as a sign that nothing in the membrane had changed except its output, and they concluded that it had fouled.

The membranes were cleaned, at a cost of a day's production and a drum of chemicals. Output did not change. The engineer then ran the pressure check at 18 °C and 10.6 bar: average driving pressure 5.68 bar, permeability 2.19, permeate 8.30 m³/h. The plant was performing exactly as a clean membrane should at that temperature. The unchanged permeate quality was the clue the operators had misread: at 18 °C the salt permeability falls with the TCF, but the water flux had fallen to 12.5 L/(m²·h), and the two effects happened to cancel, giving about 37.7 mg/L.

The remedy was to open the throttle valve to give 13.1 bar, which restored 12 m³/h, and in the next budget to fit a variable-speed drive. The lesson was to normalise before acting: Chapter 9 shows how to correct each day's readings to reference conditions, so that a fall in output caused by temperature is never mistaken for fouling, and a fall caused by fouling is never hidden by a warm week.

## Exercise: a cold snap

During an unusually cold week the feed tank falls to 15 °C. The high-pressure pump can deliver at most 14.0 bar gauge at the membrane inlet. Using the design permeability of 2.80 L/(m²·h·bar) at 25 °C, find the TCF, the permeability, the permeate flow at 14.0 bar and 75% recovery, and the pressure needed for the full 12.0 m³/h. The osmotic pressure of the feed at 15 °C is 1.553 bar.

**Worked answer.** This is an illustration. Below 25 °C, TCF = exp[3020 × (1 ÷ 298 − 1 ÷ 288)] = exp(−0.3519) = **0.703**, so the permeability is 2.80 × 0.703 = **1.97 L/(m²·h·bar)**. The mean osmotic pressure is 1.553 × 1.8484 = 2.870 bar, so at 14.0 bar the average driving pressure is 14.0 − 1.5 − 2.870 − 0.5 = **9.13 bar**, and the permeate flow is 1.969 × 9.13 × 666 ÷ 1,000 = **11.97 m³/h**, a whisker short. The full 12.0 m³/h needs 12,000 ÷ (1.969 × 666) + 1.5 + 2.870 + 0.5 = **14.02 bar**. The shortfall is 0.03 m³/h, well inside the permeate tank's buffer, so for a cold week the plant can run at its pressure limit. If cold spells like this became common, or the membranes were fouled, the options would be insulating or warming the feed tank, adding elements, or accepting lower output in the coldest weeks.
