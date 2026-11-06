---
book: viscosity-by-the-numbers
chapterSlug: leakage-through-clearances
order: 8
title: "Leakage through clearances"
description: "Calculate laminar leakage through annular clearances, see why it follows the cube of the gap and falls with viscosity, track a pump's efficiency through the year and size it for hot oil."
draft: false
---

A hydraulic pump, valve or cylinder seals its high-pressure side from its low-pressure side not with rubber but with a very small gap. The piston in an axial piston pump, the spool in a directional valve and the plunger in a flow control all slide in bores a few micrometres larger than themselves, and oil leaks through every one of those gaps. The leak is part of the design: it lubricates the sliding parts and carries away their heat. But it is also lost flow, and its size depends directly on the oil's viscosity.

This chapter derives the leakage through a thin annular gap, shows why it rises with the cube of the clearance and falls in proportion to viscosity, and uses that to follow HPU-40's pump through the year. It estimates how fast a press ram would drift through a spool valve's clearance, explains why a pump has a best viscosity at which its total losses are lowest, uses the BIZOMAT hydraulic power unit sizing tool to size a pump for hot oil, and ends with two pump tests at different temperatures that were mistaken for a worn pump.

## Flow through a thin gap

A thin gap between two surfaces, with a pressure difference along it, carries laminar flow with a parabolic velocity profile across the gap, exactly like the pipe of Chapter 7 but flattened. An annular clearance around a spool or piston is such a gap wrapped round a circle, and because the clearance is tiny compared with the diameter, it can be treated as a flat gap whose width is the circumference.

```figure
type: formula
title: Laminar leakage through an annular clearance
formula: Q = π d c³ Δp ÷ (12 μ L) × (1 + 1.5 ε²)
caption: c is the radial clearance and ε the eccentricity ratio, 0 when the part is centred and 1 when it touches one side. A part pushed hard to one side leaks 2.5 times as much as a centred one.
- Q | leakage flow, m³/s
- d | diameter of the bore, m
- c | radial clearance, m
- Δp | pressure difference along the gap, Pa
- μ | dynamic viscosity, Pa·s
- L | length of the sealing land, m
- ε | eccentricity ratio, offset ÷ c
```

Three features of the formula govern everything that follows. The leakage is inversely proportional to viscosity, so hot oil leaks more. It is proportional to the cube of the clearance, so wear that doubles a clearance multiplies leakage by eight. And it doubles with the pressure difference, so a pump's leakage is far larger at working pressure than when it idles. Chapter 5 showed that the oil's viscosity rises with pressure inside the gap, which reduces the leakage at 160 bar by about 15% below this constant-viscosity formula; the formula is the usual design estimate and errs on the side of more leakage.

## A spool valve and a drifting ram

This is an illustration. HPU-40's press is held in position by a directional control valve whose spool is 10 mm in diameter, with a radial clearance of 5 µm and a sealing land 2 mm long between the cylinder port and the tank port. With the press holding against 160 bar at the normal 50 °C, where the oil's dynamic viscosity is 25.44 mPa·s, the leakage past the centred spool is:

```figure
type: steps
title: Leakage past the press valve's spool at 50 °C
caption: This is an illustration. Real spool clearances vary along their length and between valves; makers state leakage at a given pressure and viscosity, and that figure should be used where it is available.
- Clearance cubed | (5 × 10⁻⁶)³ = 1.25 × 10⁻¹⁶ m³
- Numerator | π × 0.010 × 1.25 × 10⁻¹⁶ × 16 × 10⁶ = 6.28 × 10⁻¹¹
- Denominator | 12 × 0.02544 × 0.002 = 6.11 × 10⁻⁴
- Centred spool | 1.03 × 10⁻⁷ m³/s = 6.2 mL/min
- * Spool against one side, ε = 1 | 2.5 × 6.2 = 15.4 mL/min
```

The press cylinder has a 220 mm bore, an area of 0.0380 m², which gives 608 kN at 160 bar. A leak of 6.2 mL/min lets the ram drift at 6.2 × 10⁻⁶ ÷ 0.0380 = 0.16 mm per minute; with the spool pushed to one side, 0.41 mm per minute. That is far too much for a press that must hold a part under load, which is why load-holding circuits use poppet-type check valves, which seal on a seat rather than a clearance, and why a spool valve's "zero leakage" claim always deserves a question about the conditions. On a summer afternoon, with the oil at 65 °C and 14.61 mPa·s, the drift would be 1.74 times faster.

## HPU-40's pump through the year

A pump's internal leakage follows the same laws, summed over its many gaps: between pistons and bores, slippers and swash plate, and the cylinder block and valve plate. For a given pump at a given pressure and speed, the leakage is roughly inversely proportional to the oil's viscosity, and the delivered flow is the pump's theoretical flow less the leakage.

This is an illustration. HPU-40's pump displaces 30 cm³ per revolution at 1,450 rpm, a theoretical flow of 43.5 L/min. At the normal 50 °C and 160 bar it delivers 40.0 L/min, a volumetric efficiency of 92.0%, so it leaks 3.5 L/min. Scaling that leakage by the ratio of dynamic viscosities gives its delivery at other temperatures.

```figure
type: compare
title: HPU-40's pump at 160 bar through the year
cols: Dynamic viscosity | Leakage | Delivered flow | Volumetric efficiency
rowhead: Oil temperature
- 20 °C | 116.0 mPa·s | 0.77 L/min | 42.7 L/min | 98.2%
- 40 °C | 39.3 mPa·s | 2.26 L/min | 41.2 L/min | 94.8%
- * 50 °C, normal | 25.4 mPa·s | 3.50 L/min | 40.0 L/min | 92.0%
- 60 °C | 17.4 mPa·s | 5.12 L/min | 38.4 L/min | 88.2%
- 65 °C, summer peak | 14.6 mPa·s | 6.09 L/min | 37.4 L/min | 86.0%
- 70 °C | 12.4 mPa·s | 7.17 L/min | 36.3 L/min | 83.5%
caption: This is an illustration. Leakage taken as inversely proportional to dynamic viscosity from the measured 3.5 L/min at 50 °C. Real pumps also have leakage terms that depend on speed and on the pressure effect of Chapter 5; makers' efficiency curves should be used where they exist.
```

On the hottest afternoons the pump delivers 6.5% less oil than normal, and the press's ram moves 6.5% more slowly. The leaked oil, 6.1 L/min at 160 bar, is turned entirely into heat inside the pump, about 1.6 kW, which warms the oil further. This is the loop Chapter 4 traced the summer complaints to: hot oil leaks more, the leakage heats the oil, and the slowing and noise grow together. Chapter 9 calculates the heat balance that breaks the loop.

## Why a pump has a best viscosity

If thin oil leaks more, it might seem that thicker is always better. It is not, because viscosity also creates losses that rise with it: the shear of oil in the pump's sliding films, the drag of rotating parts in the oil-filled case, and the pressure losses in its passages. Leakage losses fall as viscosity rises; friction losses rise. The total has a minimum.

This is an illustration. At 50 °C, HPU-40's pump loses 3.5 L/min at 160 bar, which is 3.5 ÷ 60,000 × 16 × 10⁶ = 933 W of leakage power, and suppose its viscous friction losses at the same temperature are 500 W, a fictional figure of a plausible size. If leakage loss is inversely proportional to viscosity and friction loss directly proportional, the total is smallest when the two are equal, at a viscosity of 25.44 × √(933 ÷ 500) = 34.7 mPa·s, which this oil reaches at 42.7 °C.

```figure
type: line
title: HPU-40's pump losses against oil temperature at 160 bar
x: Oil temperature, °C
y: Power loss, kW
ymin: 0
ymax: 2.6
legend: Total of leakage and viscous friction | Leakage alone
caption: This is an illustration. Leakage loss 0.933 kW and friction loss 0.500 kW at 50 °C, scaled inversely and directly with dynamic viscosity. The total is lowest at about 43 °C, where the oil is at 40.7 mm²/s.
- 20 | 2.485 | 0.205
- 30 | 1.641 | 0.366
- 40 | 1.376 | 0.604
- 50 | 1.433 | 0.933
- 60 | 1.707 | 1.366
- 70 | 2.155 | 1.911
```

The best viscosity for this fictional pump, 40.7 mm²/s, sits just above the maker's preferred band of 16 to 36 mm²/s, and the band is broad because the total loss curve is flat near its minimum. That is the logic behind every pump maker's preferred viscosity range: it brackets the region where the pump is both efficient and adequately lubricated. It is also why HPU-40's summer peak, at 17.4 mm²/s, costs more than it appears: the total loss at 65 °C is about a third higher than at 50 °C.

## Sizing the pump for hot oil

The [hydraulic power unit sizing tool](/tools/hydraulic-power-unit-sizing/) calculates a pump's displacement from the flow needed, the drive speed and the volumetric efficiency, together with the hydraulic and shaft power, the drive torque, a reservoir volume and the heat to be removed. The volumetric efficiency entered should be the one at the hottest oil temperature the machine will see, because that is when the delivered flow is lowest.

This is an illustration. To deliver 40 L/min at 1,450 rpm with a volumetric efficiency of 92.0%, the tool gives a displacement of 29.99 cm³/rev, HPU-40's 30 cm³/rev pump. To deliver the same 40 L/min at the summer peak, where the efficiency falls to 86.0%, it gives 32.08 cm³/rev: the next standard size up would have been needed if the press's speed had to be held on the hottest days. The press shop chose instead to cool the oil, which keeps both the flow and the pump's life.

## Clearance, wear and the cube law

The cube of the clearance makes leakage a sensitive indicator of wear. A pump whose internal clearances have worn by a quarter leaks 1.25³ = 1.95 times as much at the same viscosity; one worn by half leaks 3.4 times as much. A measured fall in delivered flow at running temperature, with the viscosity unchanged, is therefore a good sign of wear, provided that the viscosity really is unchanged.

```figure
type: bars
title: Leakage multiplied by clearance growth, same oil and pressure
unit: ×
max: 8.5
caption: Leakage through a thin gap varies with the cube of the clearance. Wear shows first and most strongly in leakage.
- Clearance as new | 1.00
- 10% larger | 1.33
- 25% larger | 1.95
- 50% larger | 3.38
- * Doubled | 8.00
```

## Case drain flow as a health check

Many piston pumps and motors return their internal leakage to the tank through a separate case drain line, and that line offers a direct window on leakage without stopping the machine. A flow meter, or even a timed measuring container on a drain that can be safely diverted, shows how much oil is escaping past the pump's internal clearances. Because the drain carries leakage alone, a change in it is far easier to see than the same change in a delivered flow of 40 L/min.

The same viscosity correction applies. A case drain flow that rises in summer and falls in winter is following the oil temperature; one that rises steadily at the same temperature is following wear. The press shop records HPU-40's case drain flow at the weekly inspection, with the reservoir temperature beside it, and plots the flow corrected to 50 °C by the ratio of dynamic viscosities. A corrected rise of more than about half, which by the cube law corresponds to clearances some 15% larger, triggers a closer look. That threshold is the shop's own choice, not a maker's figure; pump makers publish expected case drain flows for their products, and those should be used where they exist.

Hydraulic motors and cylinders follow the same rules in their own ways. A motor's internal leakage makes it slow down under load, more so when the oil is hot, which is why a conveyor driven by a hydraulic motor can creep more slowly on a hot day. A cylinder's piston is usually sealed by elastomer seals rather than a clearance, so its leakage is small when the seals are sound and rises abruptly, rather than gradually with temperature, when a seal fails. A cylinder that drifts more on hot days than on cold ones is more likely to be leaking through a valve clearance than through its own seals.

## The error: two pump tests at different temperatures

This is an illustration. The press shop tests HPU-40's pump each year by measuring its delivered flow at 160 bar with a flow meter in the pressure line. In the first year the test was done early on a cool morning, with the oil at 30 °C, and gave 42.1 L/min. The second year's test was done in the afternoon with the oil at 55 °C and gave 39.2 L/min. The technician calculated the leakage from the theoretical 43.5 L/min: 1.4 L/min the first year and 4.3 L/min the second, a threefold rise, and recommended replacing the pump for wear.

The reliability engineer noticed the oil temperatures on the test sheets and corrected both leakages to the same viscosity. At 30 °C the oil's dynamic viscosity is 64.9 mPa·s; at 55 °C it is 20.9 mPa·s, 3.1 times less. Scaling the second year's leakage to 30 °C gives 4.26 × 20.9 ÷ 64.9 = 1.37 L/min, the same as the first year's. The pump had not worn at all; the oil had simply been hotter. The tests were consistent with an unchanged pump leaking 3.5 L/min at 50 °C.

```figure
type: compare
title: Two annual pump tests, as recorded and corrected to 30 °C
cols: Oil temperature | Delivered flow | Leakage as measured | Leakage at 30 °C
rowhead: Test
- Year one | 30 °C | 42.1 L/min | 1.37 L/min | 1.37 L/min
- Year two | 55 °C | 39.2 L/min | 4.26 L/min | 1.37 L/min
caption: This is an illustration. Leakage scaled by the ratio of dynamic viscosities, 20.9 ÷ 64.9 mPa·s. A pump replacement was avoided.
```

The pump stayed in service, and the press shop changed its test procedure: pump tests are done at the normal running temperature of 50 °C, held within two kelvin, with the oil temperature and the latest oil viscosity result recorded on the sheet. Where a test cannot be done at 50 °C, the leakage is corrected to 50 °C by the viscosity ratio before it is compared with any previous test.

## Bringing it together

Leakage through a thin clearance is laminar flow, proportional to the pressure difference and to the cube of the clearance, and inversely proportional to viscosity. A press valve's spool leaks enough to let a ram drift; HPU-40's pump loses 6.5% of its flow on the hottest afternoons and turns that leak into 1.6 kW of heat. A pump has a best viscosity where leakage and friction losses balance, which is why its maker gives a preferred band. Pumps must be sized, and tested, with the oil's temperature in view. The next chapter follows the heat that every pressure drop and every leak puts into the oil.

## Exercise: a worn valve at summer temperature

After several years the press valve's spool clearance has worn from 5 µm to 7 µm. Estimate the leakage past the centred spool at 160 bar with the oil at 65 °C (14.61 mPa·s), and the ram drift it would cause. How much of the increase over the new valve at 50 °C is due to wear and how much to temperature?

**Worked answer.** This is an illustration. Wear multiplies the leakage by (7 ÷ 5)³ = 2.744, and the hotter oil by 25.44 ÷ 14.61 = 1.741. From the new valve's 6.2 mL/min at 50 °C, the leakage becomes 6.2 × 2.744 × 1.741 = **29.5 mL/min**, and the ram drifts at 29.5 × 10⁻⁶ ÷ 0.0380 = **0.78 mm per minute**. Of the 4.8-fold increase, wear accounts for a factor of 2.74 and temperature for 1.74. The wear is the larger effect, but temperature alone would nearly double the drift on any hot day.
