---
book: pipe-flow-by-the-numbers
chapterSlug: pressure-head-and-the-energy-equation
order: 2
title: "Pressure, head and the energy equation"
description: "Gauge and absolute pressure, head as metres of liquid, the energy equation with pump head and losses, CW-2's pressures from pump to riser, and a 47 kPa 'loss' that was mostly height."
draft: false
---

A pipe system is a set of energy conversions. A pump puts energy into the water as pressure. As the water rises, pressure turns into height; as it speeds up through a reducer, pressure turns into velocity; and all along the way, friction turns a little of it into heat that is never recovered. The energy equation keeps the books on those conversions, and it is the single most useful tool for reading a pipe system's gauges and knowing what they mean.

This chapter sets out pressure, gauge and absolute, and head, the habit of measuring pressure in metres of liquid. It then states the energy equation with a pump and losses, follows CW-2's water from the tank through the pump and up the riser, and ends with a pressure drop that a technician read as a loss and that was mostly height.

## Pressure, gauge and absolute

Pressure is force per unit area, measured in pascals: one newton per square metre. Plant pressures are usually given in kilopascals, kPa, or in bar, where 1 bar is 100 kPa.

Pressure is measured from one of two zeros.

- **Absolute pressure** is measured from a perfect vacuum. It can never be negative.
- **Gauge pressure** is measured from the atmosphere's pressure where the gauge is. It is what an ordinary pressure gauge reads, and it is negative wherever the pressure is below atmospheric, as it can be on a pump's suction or at the top of a siphon.

Atmospheric pressure at sea level is about 101.3 kPa absolute, and it falls with altitude and changes with the weather. Every pressure in this book is gauge unless it says otherwise. Absolute pressure matters in two places: where liquid may boil or air may come out of solution, which Chapter 9 deals with, and on a pump's suction, which the Library’s Centrifugal Pumps by the Numbers deals with.

## Head: pressure as height

A column of liquid presses on its base with a pressure equal to its density times gravity times its height, p = ρ × g × h. Turned round, any pressure can be expressed as the height of a column of the liquid that would produce it, h = p ÷ (ρ × g). That height is called **head**, and it is measured in metres.

For water at 25 °C, with a density of 997.05 kg/m³ and gravity of 9.807 m/s², one metre of head is 9.778 kPa. A pressure of 100 kPa is a head of 10.23 m; ten metres of water is 97.78 kPa.

Head is convenient because it puts pressure, height and velocity in the same units. A pump that adds 10 m of head lifts water 10 m, or overcomes 10 m of friction, or produces 97.8 kPa of pressure, or some mixture, whatever the liquid's density. Pumps are rated in head for exactly that reason.

## Head and temperature

Because head is pressure divided by density, the same pressure is a slightly different head in water at different temperatures. Over the range a cooling loop or a hot-water system works in, the difference is small but not zero.

```figure
type: compare
title: Pressure per metre of head in water
rowhead: Water temperature
cols: Density, kg/m³ | kPa per metre | Metres per 100 kPa
caption: Densities from public property data at atmospheric pressure. The difference between 20 °C and 80 °C is about 2.7%.
- 20 °C | 998.21 | 9.789 | 10.22
- * 25 °C | 997.05 | 9.778 | 10.23
- 40 °C | 992.22 | 9.730 | 10.28
- 60 °C | 983.20 | 9.642 | 10.37
- 80 °C | 971.79 | 9.530 | 10.49
```

For CW-2, which runs between 25 °C and 32 °C, using 9.78 kPa per metre throughout is accurate to a fraction of a per cent. For a hot-water loop at 80 °C, using the cold figure overstates the pressure of a given head by nearly 3%, which matters when a pressure relief valve's setting or a pump's shut-off head is being checked against a tall building's static head.

## The energy equation

The water at any point in a pipe carries energy in three forms, each expressible as a head.

- **Pressure head**, p ÷ (ρ × g), from its pressure.
- **Velocity head**, v² ÷ (2 × g), from its motion.
- **Elevation head**, z, from its height above a chosen datum.

Between two points along a pipe, the total of the three changes only by what a pump adds and what friction and fittings take away.

```figure
type: formula
title: The energy equation between two points in a pipe
formula: p₁ ÷ ρg + v₁² ÷ 2g + z₁ + H_pump = p₂ ÷ ρg + v₂² ÷ 2g + z₂ + h_loss
caption: Every term is in metres of the liquid. Without the pump and loss terms, it is Bernoulli's equation for an ideal fluid.
- p ÷ ρg | Pressure head at each point; 9.778 kPa per metre for water at 25 °C
- v² ÷ 2g | Velocity head; 0.156 m at CW-2's header velocity of 1.751 m/s
- z | Elevation above a datum, here the tank's water level
- H_pump | Head added by a pump between the points
- h_loss | Head lost to friction and fittings between the points
```

The equation without the pump and loss terms is **Bernoulli's equation**. It describes an ideal fluid with no friction, and it is exact for short distances where friction is negligible, such as across a reducer or through a flow meter's throat. With the two extra terms, it describes any real pipe, and it is the equation this book uses.

## Following CW-2's water

This is an illustration. CW-2's pump stands beside the tank with its centreline 0.5 m below the tank's water level, so the water flows into it under a small positive head. The datum is the tank's water level, z = 0.

**From the tank to the pump's suction.** At the tank's surface, the pressure is atmospheric, zero gauge, the velocity is effectively zero, and z is zero. At the pump's suction, z is −0.5 m and the velocity is the header's, 1.751 m/s, a velocity head of 0.156 m. Between them, the suction strainer loses, as Chapter 5 will show, 0.313 m. So the suction's pressure head is 0 + 0 + 0 − (−0.5) − 0.156 − 0.313 = **0.031 m**, a gauge pressure of 0.3 kPa. The suction is barely above atmospheric, which is why the strainer must be kept clean: a half-blocked strainer takes the suction below atmospheric.

**Through the pump.** Chapter 6 will show that the whole loop needs 10.84 m of head at the design flow. The pump adds that, so the discharge's pressure head is 0.031 + 10.84 = 10.87 m, a gauge pressure of **106.3 kPa**. The velocity is the same either side of the pump, so all of the pump's head appears as pressure.

**Up the riser.** From the pump, the header rises 4.5 m to its overhead run at z = +4.0 m, through 6 m of pipe and two elbows that together lose 0.320 m. The velocity is unchanged. So the pressure head at the top of the riser is 10.87 − 4.5 − 0.320 = 6.05 m, a gauge pressure of **59.2 kPa**.

```figure
type: bars
title: CW-2's pressure from the pump to the top of the riser
unit: kPa
max: 120
caption: This is an illustration. Gauge pressures at the design flow of 9.0 L/s. Of the 47.1 kPa fall up the riser, 44.0 kPa is height and only 3.1 kPa is friction and fittings.
- Pump suction, z = −0.5 m | 0.3
- * Pump discharge, z = −0.5 m | 106.3
- Top of the riser, z = +4.0 m | 59.2
```

## Velocity head and where it matters

CW-2's velocity head in the header is 0.156 m, about 1.5 kPa, small beside the pump's 10.8 m. It matters wherever the velocity changes. Where the 80.9 mm header feeds a 36.0 mm branch, the velocity falls from 1.751 to 1.474 m/s and the velocity head from 0.156 to 0.111 m; by Bernoulli, that change on its own would raise the pressure by 0.45 kPa, a negligible amount here. But where the water passes through a flow meter's narrow throat, or leaves the return pipe into the tank, the velocity head is the whole story, and Chapters 5 and 10 use it.

Velocity head also explains a confusing gauge. A gauge whose tapping faces into the flow reads the pressure plus the velocity head, because the water stops against it; a gauge tapped flush with the pipe wall reads the pressure alone. On CW-2, the difference is 1.5 kPa, small enough to hide in a gauge's error. In a fast-flowing line, it is not.

## Where the pressure goes below atmospheric

The energy equation does not care whether a pressure comes out positive or negative. In a pipe that rises above the level it is fed from, or that runs downhill to a free discharge, the pressure head at a high point can come out negative: the pressure there is below atmospheric. That is how a siphon works, and it is perfectly real, down to a limit. Water cannot be pulled below its vapour pressure, about 3.2 kPa absolute at 25 °C, without boiling, and long before that, air dissolved in it begins to come out of solution.

On CW-2, the return header runs overhead at 4.0 m before dropping to discharge 1.2 m above the tank's level. If the friction between the high point and the discharge is small, the pressure at the high point is close to −(4.0 − 1.2) × 9.778 = −27.4 kPa gauge, about 74 kPa absolute at sea level. Air comes out of solution there, collects, and gurgles down the return. Chapter 9 works through that high point and what to do about it. For now, the point is that the energy equation predicts it, and a gauge with a compound scale, reading below zero as well as above, confirms it.

## Open and closed loops

CW-2 is an **open loop**: its water returns to a tank open to the atmosphere, and the pump must lift the water from the tank's level to wherever the return discharges, 1.2 m above it, as well as overcome friction. Many heating and chilled-water loops are **closed**: the water never meets the atmosphere, the pipe is full from end to end, and every metre the water rises on the way out it falls again on the way back. In a closed loop, the heights cancel, the pump overcomes only friction, and the static pressure is set separately, by an expansion vessel or a pressurisation unit.

The difference matters when reading the energy equation. In an open loop, the pump's head includes a static lift that does not change with flow. In a closed loop, there is none, and the pump's head falls to zero as the flow falls to zero. Chapter 6 builds both kinds of system curve, and the difference is plain on them.

## Gauges, heights and datums

Every pressure reading belongs to a height. Two gauges on the same pipe at different heights read differently even when nothing is flowing, by ρ × g times their height difference: 9.8 kPa per metre for water. Comparing them to find a friction loss means correcting for the height first.

The shop's practice, an illustration, is to record every gauge reading with its height above a single datum, the tank's water level for CW-2. A spreadsheet then converts each reading to a total head, pressure head plus elevation plus velocity head, and the difference between any two total heads along a pipe without a pump is the loss between them, with no further correction.

## The error: a loss that was mostly height

This is an illustration. During commissioning, a technician read 106 kPa on the pump's discharge gauge and 59 kPa on a gauge at the top of the riser. They reported a pressure loss of 47 kPa over 6 m of pipe and two elbows, which would have been an extraordinary loss, about 7.8 kPa per metre, and suggested that the riser was partly blocked.

The engineer who read the report checked the gauges' heights. The riser gauge was 4.5 m above the discharge gauge, which accounts for 4.5 × 9.778 = **44.0 kPa** of the difference with no flow at all. The friction and fitting loss was the remaining **3.1 kPa**, which is what the calculation predicted. Nothing was blocked. The technician had compared two pressures without their heights, and a riser that was working exactly as designed had nearly been cut open.

The check that would have caught it on the spot is to stop the pump and read the gauges again. With no flow, the riser gauge would read 44 kPa less than the discharge gauge, and that difference is purely height. Any further difference while running is the loss.

## Exercise: the pressure at a machine

The supply header runs overhead at z = +4.0 m, and each machine's branch drops to its connection at z = +0.8 m. At the tee for machine 1, the header's gauge pressure is 53.0 kPa. Ignoring the branch's friction for now, what is the gauge pressure at the machine's connection? What is it when the branch's 0.40 m of friction and fittings between the tee and the connection is included?

**Worked answer.**

- The connection is 4.0 − 0.8 = 3.2 m below the tee, which adds 3.2 × 9.778 = **31.3 kPa** of pressure.
- Ignoring friction, and with the branch's slightly lower velocity head making a negligible difference, the connection's pressure is 53.0 + 31.3 = **84.3 kPa**.
- Including 0.40 m of loss, 3.9 kPa, it is 84.3 − 3.9 = **80.4 kPa**.

The machine's connection sees more pressure than the overhead header, because the water has dropped 3.2 m to reach it. The drop down to the machine recovers the height that the riser cost, and the return riser will cost it again. A gauge at the machine's connection reading 80 kPa is therefore healthy; the same reading on the overhead header would mean something upstream was wrong.
