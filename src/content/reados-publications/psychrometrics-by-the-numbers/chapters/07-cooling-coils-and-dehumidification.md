---
book: psychrometrics-by-the-numbers
chapterSlug: cooling-coils-and-dehumidification
order: 7
title: "Cooling coils and dehumidification"
description: "Calculate a cooling coil's total, sensible and latent load and condensate, find its apparatus dew point and contact factor, compare coil and room sensible heat ratios, and avoid sensible-only sizing."
draft: true
---

A chilled-water coil in summer does two jobs at once. It cools the air, and wherever its fins are colder than the air's dew point it condenses water out of it. In a print hall the second job matters as much as the first, because a hall that is cool but damp still swells the board and jams the presses. The coil's total load, the split between cooling and drying, and the temperature at which it must leave the air all follow from the same mass and energy balance used for winter in Chapter 6, run in the other direction.

This chapter calculates the running case's coil on the humid design day and the hot-dry day, explains the apparatus dew point and contact factor that describe a coil's line on the chart, shows why the coil's sensible heat ratio is far lower than the room's, and deals with the condensate the coil produces. It ends with a coil chosen on its sensible load alone.

## The summer duty

This is an illustration. On the humid design day, 29 °C and 70% outdoors, Chapter 5 found the mixed air at 24.59 °C and 60.5%, with a humidity ratio of 11.699 g/kg, an enthalpy of 54.49 kJ/kg and 9.311 kg/s of dry air. Chapter 4 found that the hall needs supply air at 13.58 °C and no wetter than 7.830 g/kg, whose dew point is 10.38 °C. The coil therefore has to take the air down below 10.38 °C at least at its fin surfaces, and leave it with no more than 7.830 g/kg.

The plant design sets the coil's leaving state at **11.0 °C and 95%**, which is 7.751 g/kg. That is slightly drier than the room needs; the margin of 0.08 g/kg covers sensor error and the spread of humidity across the coil face. Chapter 8 explains why the leaving temperature is fixed by drying rather than by cooling.

```figure
type: formula
title: Steady-flow balance on a cooling and dehumidifying coil
formula: ṁ_cond = ṁ_a × (ω₁ − ω₂)
formula: Q_coil = ṁ_a × (h₁ − h₂) − ṁ_cond × h_f(t₂)
caption: Subscript 1 is the air entering, 2 the air leaving. The condensate carries away a little enthalpy as liquid water, here taken to leave at the outlet air temperature, so it is subtracted from the air's enthalpy drop.
- ṁ_a | dry-air mass flow, kg/s
- ω₁, ω₂ | humidity ratio entering and leaving, kg/kg dry air
- h₁, h₂ | enthalpy entering and leaving, kJ/kg dry air
- h_f(t₂) | enthalpy of liquid water at the outlet temperature, 4.18 × t₂ kJ/kg
step: ṁ_cond = 9.311 × (0.011702 − 0.007751) = 0.03679 kg/s, or 132.4 kg/h
step: Q_coil = 9.311 × (54.50 − 30.59) − 0.03679 × 46.0 = 222.6 − 1.7 = 220.9 kW
```

The [cooling coil load and dehumidification check](/tools/cooling-coil-dehumidification-check/) carries out this balance from the inlet and outlet temperatures and relative humidities, the inlet volume flow and the pressure. It reports the total coil load, its sensible and latent parts, the sensible heat ratio, the condensate in kilograms per hour, the dry-air flow, and the humidity ratio, enthalpy and dew point in and out, and it compares the total load with the coil's rated capacity at those conditions. It does not model the coil itself: it cannot say what leaving state a given coil will reach. That comes from the coil maker's selection.

For the running case, inlet 24.59 °C and 60.5%, 8.0 m³/s, outlet 11.0 °C and 95%, it gives:

- **Total coil load: 220.9 kW**, of which **129.86 kW sensible** and **91.04 kW latent**.
- Coil sensible heat ratio **0.588**.
- Condensate **132.42 kg/h**, about 132 litres an hour.
- Humidity ratio 11.702 to 7.751 g/kg; enthalpy 54.50 to 30.59 kJ/kg; dew point 16.45 to 10.23 °C.

## Why the coil's ratio is not the room's

The room's sensible heat ratio is 80 ÷ 89 = 0.899: nine-tenths of its load is temperature. The coil's is 0.588: four-tenths of its load is water. The difference is the outdoor air. At 29 °C and 70% it carries 17.714 g/kg of water and 74.38 kJ/kg of enthalpy, against 8.225 g/kg and 43.01 kJ/kg in the room. Bringing 3.408 kg/s of it down to room conditions takes 3.408 × (74.38 − 43.01) = 106.9 kW, most of it latent, before the coil does anything for the room.

```figure
type: stack
title: Where the coil's 220.9 kW comes from on the humid design day
unit: kW
caption: This is an illustration. The coil also removes slightly more water than the room needs, because it leaves at 7.751 rather than 7.830 g/kg; that margin, less the enthalpy carried off by the condensate, accounts for the last 0.5 kW.
- Outdoor air brought to room conditions | 106.9
- Room sensible and latent loads | 89.0
- Supply fan heat, removed in advance | 15.0
- Reheat after the coil | 9.5
- Drying margin less condensate enthalpy | 0.5
```

Two of the items are not loads from the hall at all. The supply fan downstream of the coil adds 15 kW, so the coil must cool the air 1.58 K further than the room needs. The reheat of Chapter 8 adds 9.5 kW to bring the over-cooled air back up to the supply temperature, so the coil must remove that too. Together they are 24.5 kW, about 11% of the coil, paid for in chilled water.

## Apparatus dew point and contact factor

On the psychrometric chart a coil's process is close to a straight line from the entering state through the leaving state. Extended, the line meets the saturation curve at the **apparatus dew point** (ADP), which can be thought of as the effective temperature of the coil surface. A coil that brought every particle of air into full contact with that surface would deliver air at the ADP. Real coils let some air pass with less contact, and the leaving state lies partway along the line.

This is an illustration. Extending the line from 24.59 °C and 11.702 g/kg through 11.0 °C and 7.751 g/kg meets saturation at about **9.21 °C**, where the saturated humidity ratio is 7.229 g/kg. The **contact factor** is the fraction of the temperature drop to the ADP that the coil achieves:

(24.59 − 11.0) ÷ (24.59 − 9.21) = 13.59 ÷ 15.38 = **0.883**

The bypass factor is 1 − 0.883 = 0.117. A coil with more rows or closer fin spacing has a higher contact factor and can reach the same leaving state with a warmer surface, which allows warmer chilled water.

```figure
type: svg
title: The coil line on the psychrometric chart
alt: A sketch of the right-hand part of a psychrometric chart. A saturation curve rises from lower left to upper right. A straight line falls from the mixed-air point at 24.59 °C and 11.70 g/kg down to the coil leaving point at 11.0 °C and 7.75 g/kg, and continues as a dashed extension to meet the saturation curve at the apparatus dew point, 9.21 °C and 7.23 g/kg. The room point at 22 °C and 8.23 g/kg and the supply point at 13.58 °C and 7.83 g/kg are marked.
caption: This is an illustration, drawn roughly to scale with the axis labels omitted. The coil follows the solid line from mixed air to its leaving state; its dashed extension meets saturation at the apparatus dew point. The contact factor is the solid length divided by the whole length, 0.883. The thin dashed line is the fan heat and reheat that take the air from 11.0 °C to the 13.58 °C supply.
viewbox: 0 0 520 320
body:
<path class="ln" d="M60 290L480 290M480 290L480 40"/>
<path class="li" d="M60 279L114 246.8L150 220.8L186 192.5L222 160.5L258 123.6L294 83.3L312 61"/>
<path class="la draw" pathLength="1" d="M412.6 115.7L168 218.5"/>
<path class="la dsh" d="M168 218.5L135.8 232"/>
<path class="lf dsh" d="M168 218.5L214.4 216.4"/>
<circle class="fa" cx="412.6" cy="115.7" r="6"/>
<circle class="fa" cx="168" cy="218.5" r="6"/>
<circle class="fi" cx="135.8" cy="232" r="5"/>
<circle class="fi" cx="214.4" cy="216.4" r="5"/>
<circle class="fi" cx="366" cy="206.2" r="5"/>
<text class="txa" x="250" y="100">mixed air 24.59 °C, 11.70 g/kg</text>
<text class="txs" x="150" y="258">coil leaving 11.0 °C, 7.75 g/kg</text>
<text class="txs" x="222" y="238">supply 13.58 °C</text>
<text class="txs" x="326" y="228">room 22 °C, 8.23 g/kg</text>
<text class="txs" x="66" y="236">ADP 9.21 °C</text>
<text class="txs" x="90" y="150">saturation curve</text>
<text class="txs" x="360" y="310">dry-bulb temperature</text>
<text class="txs" x="486" y="50">ω</text>
```

The ADP has a practical meaning. The chilled water entering the coil must be colder than it, by a margin the coil maker's selection program determines. This is an illustration. A coil with an ADP of 9.21 °C might be selected for chilled water at, for example, 6 °C supply and 12 °C return; at a 6 K rise, 220.9 kW needs 220.9 ÷ (4.19 × 6) = 8.79 kg/s of water. If the plant's chiller only produces 9 °C water, no reasonable coil can reach 11.0 °C and 95% from this entering air, and the hall cannot be held at 50% on a humid day. The chilled-water temperature is therefore a humidity decision, not just a capacity one.

## The hot-dry day

This is an illustration. On the hot-dry day, 38 °C and 20% outdoors, Chapter 5 found the mixed air at 27.8 °C and 35.4%, 8.234 g/kg, with 9.262 kg/s of dry air. Taking the same leaving state, 11.0 °C and 95%, the coil check gives a total of **169.73 kW**, **158.72 kW sensible** and only **11.01 kW latent**, a coil sensible heat ratio of **0.935** and just **16.02 kg/h** of condensate. The mixed-air dew point, 11.12 °C, is barely above the coil-leaving dew point of 10.23 °C.

```figure
type: compare
title: The same coil leaving state on two summer design days
cols: Humid day, 29 °C 70% | Hot-dry day, 38 °C 20%
rowhead: Coil result
caption: This is an illustration from the cooling coil check at 8.0 m³/s, leaving 11.0 °C and 95%. The hotter day is the easier one for the coil.
- Mixed air entering | 24.59 °C, 60.5% | 27.8 °C, 35.4%
- Entering humidity ratio | 11.702 g/kg | 8.234 g/kg
- Total coil load | 220.9 kW | 169.73 kW
- Sensible / latent | 129.86 / 91.04 kW | 158.72 / 11.01 kW
- Coil sensible heat ratio | 0.588 | 0.935
- Condensate | 132.42 kg/h | 16.02 kg/h
```

The hotter day needs less coil. Its outdoor air is hotter but much drier, and the enthalpy that matters to the coil is lower: 48.94 kJ/kg entering against 54.50 kJ/kg. A coil selected for the hottest day on record would be too small for a warm, humid one. The design condition for a coil that must dehumidify is the day of highest outdoor enthalpy or dew point, which the AIRAH design data and weather records give separately from the highest dry-bulb temperature. On the hot-dry day the controls could also let the coil leave warmer, since the mixed air needs only 0.4 g/kg of drying; Chapter 8 describes how a dew-point control sequence does this.

## Condensate, drains and carryover

The coil makes about 132 litres of water an hour on the humid design day. It must leave the unit without flooding the drain pan, being blown into the duct or harbouring growth.

- **The drain trap.** With a draw-through fan the coil section is below atmospheric pressure. This is an illustration. If the section runs at −400 Pa, a column of water 400 ÷ 9,810 = 0.041 m, about 41 mm, is held up in the drain line by suction alone. The trap must be deep enough to overcome it and still keep its seal, following the AHU maker's rule; otherwise the pan fills, overflows into the unit and the fan draws air up the drain.
- **The drain pan.** Pans should slope to the outlet and drain completely, so that no water stands between humid days. Standing water in a pan is a site for microbial growth, which the AS/NZS 3666 series on microbial control of air-handling and water systems addresses through design, maintenance and cleaning requirements.
- **Carryover.** Above a certain air velocity across the coil face, condensate is blown off the fins and carried downstream. This is an illustration. A coil face of 3.2 m² at 8.0 m³/s gives 2.5 m/s; the coil maker states the velocity limit for its fin type and spacing, and a moisture eliminator is fitted where it is exceeded.

## Reading a coil selection

A coil maker's selection sheet answers the questions the balance cannot: whether a particular coil, with a particular chilled-water supply, actually reaches the leaving state. Checking one against the balance takes a few minutes and catches most errors before anything is ordered.

1. **Entering air.** Dry-bulb and either wet-bulb or relative humidity, at the coil, not outdoors. Many selection programs ask for wet-bulb; convert the mixed state of Chapter 5 with the same moist-air relations, and confirm that the program's entering enthalpy agrees with 54.5 kJ/kg to within about 0.5 kJ/kg.
2. **Air flow and its basis.** Volume flow at the coil inlet, or mass flow, stated clearly. A flow quoted at standard air density rather than at the actual entering state shifts the dry-air flow by a few per cent.
3. **Leaving air.** Dry-bulb and wet-bulb or humidity. Recalculate the leaving humidity ratio and compare it with the 7.830 g/kg the room needs. A coil that meets the leaving dry-bulb but leaves the air too wet has not met the duty.
4. **Total, sensible and latent load.** All three, compared with the balance. The latent figure is the one most often missing.
5. **Chilled water.** Supply and return temperature, flow and water-side pressure drop, plus any glycol, which lowers the coil's capacity for the same flow.
6. **Construction.** Rows, fin spacing and face area, with the face velocity and air-side pressure drop wet, not dry. A wet coil has a higher air pressure drop than the same coil dry, and the fan must be selected for the wet figure.

The selection should also state a fouling allowance or confirm that none is included. Over years of operation, dust that passes the filters settles on wet fins and lowers the contact factor, so a coil selected with no margin may meet its leaving state when new and fail a few summers later.

## The error: a coil chosen on its sensible load

This is an illustration. When the hall was first quoted, the cooling coil was selected from a schedule that listed only the sensible load on the coil, 129.86 kW, to which the contractor added 10% and chose a coil rated at 143 kW. Entered into the coil check as the rated capacity, 143 kW against 220.9 kW needed gives **COIL UNDERSIZED**: the coil lacks 78 kW, almost exactly the latent load it was never asked to remove.

The mistake was found before installation, because the engineer reviewing the submission ran the total balance. In service it would have shown on the first humid day: the chilled-water valve wide open, the coil-leaving temperature rising, and the hall growing both warmer and wetter. If such a coil still brought the air close to saturation, about 95%, removing only 143 kW would leave it at about 14.4 °C and 9.72 g/kg. The hall's humidity would rise to about 10.1 g/kg, which is 61% at 22 °C, far outside the printer's band.

The coil was re-selected for the total load at the stated entering and leaving states, with the chilled-water temperatures written on the schedule, and the chiller's capacity checked against the new total. Schedules for this plant now list total, sensible and latent load, entering and leaving dry-bulb and humidity, and the chilled-water temperatures for every coil.

## How this applies to a small Australian business

Most coastal and northern Australian summers are humid, and many inland ones have humid spells. Any process that cares about humidity, from printing and packaging to food handling, electronics and pharmaceuticals storage, needs its cooling coil sized on total load at the worst-enthalpy design day, with an explicit leaving dew point. Asking a contractor for those numbers, and checking them with a ten-minute balance, is far cheaper than discovering the shortfall in the first wet February.

## Exercise: a more humid hall

Suppose the printer relaxed the specification to 22 °C and 55%, whose humidity ratio is 9.059 g/kg. With the same room latent load, the supply must be 0.395 g/kg drier than the room, 8.664 g/kg, and with the same sensible load it must still reach 13.58 °C. Find the coil leaving state, the coil load and the condensate, and say what happens to the reheat.

**Worked answer.** The sensible duty alone needs the coil to leave at 13.58 − 1.58 = 12.0 °C, so that the fan brings the air to the supply temperature. Air leaving a coil at 12.0 °C and 95% holds 8.289 g/kg, already drier than the 8.664 g/kg the room now needs, so temperature, not humidity, now sets the coil and **no reheat is needed**. The leaving enthalpy is 1.005 × 12.0 + 0.008289 × (2,500.9 + 1.82 × 12.0) = 32.97 kJ/kg. The condensate is 9.311 × (0.011702 − 0.008289) = 0.03178 kg/s, or about **114.4 kg/h**. The coil load is 9.311 × (54.50 − 32.97) − 0.03178 × 50.2 = 200.5 − 1.6 = about **198.9 kW**. The cooling coil check, entered with 12.0 °C and 95% leaving, gives 198.88 kW, of which 120.31 kW sensible and 78.57 kW latent.

Five percentage points of relative humidity in the specification save about 22 kW of coil and chiller load on the humid design day, plus the 9.5 kW of reheat, which is why the humidity band belongs in the design conversation with the user, not just the temperature.
