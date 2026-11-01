---
book: reverse-osmosis-by-the-numbers
chapterSlug: pumps-energy-and-the-least-work
order: 8
title: "Pumps, energy and the least work of separation"
description: "High-pressure and booster pump power, specific energy per cubic metre, the thermodynamic least work of separation from the entropy of mixing, where the energy goes and what saving it is worth."
draft: false
---

Reverse osmosis is the most energy-efficient way known to take salt out of water, and it still uses far more energy than the thermodynamic minimum. That gap is not a failing to be fixed but a set of choices: a membrane that makes water at a useful rate needs a driving pressure, a channel that keeps the membrane clean needs crossflow and therefore friction, and a concentrate that leaves the plant at pressure takes its energy with it unless something recovers it. Knowing where each kilowatt goes tells an owner which savings are worth having.

This chapter calculates the power of BW-12's high-pressure and booster pumps with the WORKOS pump power tool, turns it into specific energy and an annual bill, derives the least work of separation from the entropy of mixing, and divides the energy delivered to the water among the places it goes. It ends with a pump selection made on the permeate flow instead of the feed.

## The high-pressure pump

The high-pressure pump lifts the feed from the pressure after the cartridge filters to the pressure the membranes need, plus the losses in the pipework, check valve and flow meter between them. Its hydraulic power is the feed flow times that pressure rise; its shaft power divides by the pump's efficiency at the duty; the electrical power divides again by the motor's and drive's efficiencies.

The [pump shaft power tool](/tools/pump-shaft-power/) calculates the first two. From the flow in litres per minute, the total head in metres, the liquid's density and the pump's overall efficiency as a fraction, it gives the hydraulic power, ρ × g × Q × H, and the shaft power. It leaves out motor losses and sizing allowances, and it expects the efficiency read from the pump curve at the duty point.

```figure
type: compare
title: BW-12's high-pressure pump at the design point and in the worst winter week
cols: Discharge, bar g | Pressure rise, bar | Head, m | Hydraulic power, kW | Shaft power, kW | Electrical input, kW
rowhead: Duty
caption: This is an illustration. Feed 16.0 m³/h = 266.7 L/min, suction 2.7 bar g after the cartridge filters, 0.6 bar of losses between the pump and the first vessel, pump efficiency 0.65, motor 0.92 and drive 0.97. Head = pressure rise × 100,000 ÷ (1,000 × 9.807).
- * 25 °C, clean membranes | 12.0 | 9.3 | 94.8 | 4.13 | 6.36 | 7.13
- 18 °C, 10% permeability lost | 14.6 | 11.9 | 121.6 | 5.30 | 8.15 | 9.13
```

The booster pump that lifts water from the feed tank through the dosing points and cartridge filters adds its own share. This is an illustration. At 16.0 m³/h and 3.5 bar, a head of 35.7 m, with an efficiency of 0.60 and a 0.92 motor, it draws about 2.82 kW. Together the two pumps draw 9.94 kW at the design point and 11.95 kW in the worst winter week.

## Specific energy and the annual bill

Specific energy is the electrical energy per cubic metre of permeate, in kWh/m³. It is the figure to compare plants, quotations and operating periods by.

```figure
type: stats
title: BW-12's energy in numbers
caption: This is an illustration. 16 hours a day for 250 days, 48,000 m³ of permeate a year, averaging the design and worst-week figures; electricity at A$0.25 per kWh excluding GST, an illustrative tariff.
- 0.83 kWh/m³ | Specific energy at 25 °C | 9.94 kW ÷ 12.0 m³/h
- 1.00 kWh/m³ | Specific energy in the worst winter week | 11.95 kW ÷ 12.0 m³/h
- * about 43,800 kWh | Annual electricity | averaging the two
- about A$11,000 | Annual electricity cost, excluding GST | at A$0.25 per kWh
```

Whether energy is a large or small share of the cost of BW-12's water depends on what its membranes, cartridges, chemicals, concentrate disposal and labour cost, and the owner should price each of them rather than assume. Energy is still worth managing, and the variable-speed drive is the main tool. A fixed-speed pump selected for the winter duty and throttled to the summer duty would draw the winter shaft power all year: at the summer point of 10.58 bar at the membranes, a pump on a drive needs about 5.8 kW at the shaft against the throttled pump's 8.15 kW, a difference of 2.35 kW for every summer hour. The chapter on [head, flow, power and efficiency](/reados/publications/centrifugal-pumps-by-the-numbers/head-flow-power-and-efficiency/) in Centrifugal Pumps by the Numbers explains how a pump's power and efficiency change with speed.

## The least work of separation

How much energy would a perfect process need? Thermodynamics gives the answer, and the route to it is the entropy of mixing. Dissolving salt in water is spontaneous because the mixed state has more possible arrangements than the separate ones; Reichl and every text on statistical physics derive the entropy of mixing from that count, and the chapter on [what entropy counts](/reados/publications/entropy-by-the-numbers/what-entropy-counts/) in Entropy by the Numbers shows the same counting for gas molecules in a box. Unmixing reverses it, and the least work needed is the temperature times the entropy that must be removed.

For a dilute solution there is a simpler way to the same number. Imagine a perfect membrane and a piston that removes permeate slowly, always at a pressure just equal to the osmotic pressure of the water left behind. The work to remove a small volume of water is that pressure times the volume. As water leaves, the remainder gets stronger and the osmotic pressure rises as 1 ÷ (1 − y), where y is the fraction already removed. Adding up the work from y = 0 to the recovery r gives the least work per cubic metre of permeate.

```figure
type: formula
title: Least work to recover permeate from a dilute feed
formula: W_min per m³ of permeate = π_f × ln[1 ÷ (1 − r)] ÷ r
caption: π_f is the feed osmotic pressure. The factor is the log-mean concentration factor of Chapter 2: the least work equals the mean osmotic pressure along the train. 1 bar is 100 kJ/m³, and 1 kWh is 3,600 kJ. This is an illustration: BW-12.
- Feed osmotic pressure | 1.607 bar
- Log-mean factor at 75% | 1.848
step: W_min = 1.607 × 1.848 = 2.970 bar = 297 kJ/m³ = 0.0825 kWh/m³
step: As recovery approaches zero, W_min approaches π_f: 0.0446 kWh/m³
step: Second-law efficiency at 25 °C: 0.0825 ÷ 0.83 = 10%
```

The result is pleasing because it ties three chapters together: the least work per cubic metre of permeate is the same mean osmotic pressure that the membranes work against in Chapter 3's flux calculation. It also shows why higher recovery costs more energy even in principle: the last water squeezed out of a strong concentrate is the most expensive. And it shows the scale of the gap. BW-12 uses about ten times the least work, and the rest is spent in ways the next section lists.

Two details of the least work are worth noting. It is proportional to absolute temperature, because the osmotic pressure is, so it barely changes with the season: from 18 to 30 °C it moves by 4%, while the real specific energy moves by about 20% because of the membrane's temperature response. And it depends only on the feed and the recovery, not on the membrane, the array or the pump. It is therefore the right yardstick for comparing very different plants on the same water: a design that claims to beat it has made an error, and a design that uses twice as much as another on the same water and recovery is spending energy somewhere that can be found with the breakdown below.

## Where the energy goes

The pressure energy the pumps give the feed leaves the plant in identifiable places. Taking the feed at the membrane inlet, 16.0 m³/h at 11.4 bar gauge, as the energy delivered to the water, the design point divides as follows.

```figure
type: stack
title: Where the 5.07 kW of pressure energy in BW-12's feed goes, 25 °C
unit: kW
caption: This is an illustration. Least work = permeate flow × mean osmotic pressure; membrane resistance = permeate flow × average net driving pressure; concentrate = concentrate flow × its 8.4 bar gauge; permeate = permeate flow × 0.5 bar; channel friction is the remainder. Pump and motor losses, about 4.9 kW more, come on top.
- Least work of separation | 0.99
- * Pushing water through the membrane | 2.14
- Friction along the feed channels | 0.83
- Pressure left in the concentrate | 0.93
- Permeate back pressure | 0.17
```

The largest share, 42%, is the price of making water at a useful rate: the net driving pressure that pushes water through the membrane's resistance. It falls if the plant uses more membrane at lower flux, or more permeable membranes, and rises with fouling and cold. The least work is 20%. Channel friction, 16%, is the price of crossflow that keeps polarisation and fouling down. The concentrate's 18% is energy thrown away across the concentrate valve. Large seawater plants recover most of that with pressure exchangers or turbines, because their concentrate leaves at 50 bar or more and carries a large share of the energy. For BW-12, recovering 90% of the concentrate's 0.93 kW would save about 3,400 kWh a year, roughly A$840 at the illustrative tariff, which would not pay for the equipment.

The pump and motor losses, almost as much again as the energy delivered to the water, are the other place to look. A pump running far from its best efficiency point, an oversized motor at part load, or a throttle valve all add to them. That is where the variable-speed drive earns its place.

## Energy against the other costs

The energy figures help in three common decisions. When choosing recovery, the pumping energy per cubic metre of permeate rises with recovery, but the bore pumping and concentrate disposal per cubic metre of permeate fall, and for most brackish plants the latter dominate. When choosing membranes, a low-energy element with higher permeability lowers the feed pressure, usually at some cost in salt passage, and the energy saving can be priced directly from this chapter's numbers. When deciding when to clean, the extra pressure needed by a fouled membrane is extra energy: a 10% permeability loss at 25 °C needs about 0.7 bar more and about 0.5 kW more at the motor, which is small against the cost of a clean but grows if fouling is left to accumulate.

## Choosing the high-pressure pump

A brackish plant of BW-12's size usually uses a multistage centrifugal pump: several impellers in series on one shaft, each adding part of the head, which suits a duty of about 120 m at a modest flow. Three points matter beyond the duty itself.

- **The whole range.** The pump must reach the worst-week duty, 14.6 bar at 16.0 m³/h, and turn down to the summer duty without running far to the left of its best efficiency point, where efficiency falls and internal recirculation can damage it. Plotting both duties on the pump's curves at the speeds the drive will use shows whether one pump covers the range.
- **Suction conditions.** The booster pump and cartridge filters must deliver enough pressure at the high-pressure pump's suction, with the cartridges at their dirtiest, to keep it well clear of cavitation; BW-12's low suction pressure trip protects it if they do not.
- **Materials.** Brackish water and concentrate are corrosive to ordinary steels, and the pump, the high-pressure pipework and the concentrate valve must be in materials the makers recommend for the water's chloride content and temperature.

The pump's efficiency at the duty is the number that turns hydraulic power into electricity, so it should come from the selected pump's curve, not from a typical value, and be checked at commissioning by measuring flow, pressure rise and input power.

## Measuring energy on site

A plant that wants to manage its energy needs to measure it. The minimum is an energy meter on the supply to the plant, read daily alongside the permeate meter, so that specific energy can be logged. Better is a meter or the drive's own power reading for each of the two pumps, so that a change can be traced to the right machine. Specific energy should then be read against temperature, since Chapter 4 showed that BW-12 needs about 2.5 bar more in winter than in summer at clean conditions. A rise in specific energy at the same temperature points to fouling or a pump problem; a rise with falling temperature is the season.

Comparing the measured specific energy with the projection at commissioning gives a baseline. This is an illustration. BW-12's commissioning test at 25 °C measured 9.8 kW for 12.0 m³/h, 0.82 kWh/m³, within 2% of the calculated 0.83. Later readings are compared with that baseline after correcting for temperature, which is the subject of Chapter 9.

## The error: a pump sized on the permeate flow

This is an illustration. A quotation for BW-12's high-pressure pump was based on 200 L/min, the permeate flow of 12.0 m³/h, rather than 266.7 L/min of feed. The pump shaft power tool with 200 L/min and the winter head of 121.6 m gives 6.11 kW at an efficiency of 0.65, so the quotation offered a 7.5 kW motor. At the correct feed flow the winter shaft power is 8.15 kW, and the motor would have run overloaded in exactly the weeks when the plant most needed it.

The engineer found it by repeating the pump calculation with the tool and asking which flow the pump actually carries. Every litre of feed passes through the high-pressure pump, including the quarter that leaves as concentrate. The pump was resized at 266.7 L/min for the winter head, with an 11 kW motor and a drive, which also covered the efficiency loss at the summer turndown. The same mistake in reverse, using feed pressure with permeate flow to calculate the energy per cubic metre, would understate the specific energy by a quarter; specific energy divides the input power by the permeate flow, but the power itself depends on the feed.

## Exercise: least work at other recoveries

For BW-12's water, with a feed osmotic pressure of 1.607 bar, calculate the least work of separation per cubic metre of permeate at 70% and at 85% recovery, in kJ/m³ and kWh/m³. Compare them with the 75% figure and explain the trend.

**Worked answer.** This is an illustration. At 70%, the log-mean factor is ln(1 ÷ 0.30) ÷ 0.70 = 1.720, so W_min = 1.607 × 1.720 = 2.764 bar = **276 kJ/m³ = 0.0768 kWh/m³**. At 85%, the factor is ln(1 ÷ 0.15) ÷ 0.85 = 2.232, so W_min = 1.607 × 2.232 = 3.587 bar = **359 kJ/m³ = 0.0996 kWh/m³**. Against 0.0825 kWh/m³ at 75%, the least work rises by 7% from 70% to 75% and by 21% from 75% to 85%. The last water recovered comes from the strongest concentrate and costs the most, which is why the energy curve, like the pressure curve of Chapter 2, steepens as recovery rises.
