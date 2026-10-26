---
book: pipe-flow-by-the-numbers
chapterSlug: friction-in-straight-pipe
order: 4
title: "Friction in straight pipe"
description: "Darcy–Weisbach, roughness and the friction factor by Colebrook and Swamee–Jain, CW-2's header and branch losses, friction against flow and bore, and a Fanning factor in a Darcy formula."
draft: false
---

Friction is the price of moving liquid through a pipe. Every metre of pipe takes a little of the energy the pump put in and turns it into heat, and over a long header the total is large enough to decide the pump's size and the electricity bill. Of all the losses in a pipe system, straight-pipe friction is the best understood and the most reliably calculated, and it is the backbone of every system curve.

This chapter sets out the Darcy–Weisbach equation, the friction factor and the roughness it depends on, and two ways to calculate the factor for turbulent flow. It calculates the friction in CW-2's headers and branches, shows how friction changes with flow and with bore, and ends with a friction factor from the wrong family.

## The Darcy–Weisbach equation

The head lost to friction in a length of straight pipe is

h_f = f × (L ÷ D) × v² ÷ 2g,

where f is the **Darcy friction factor**, L the length, D the bore, v the average velocity and v² ÷ 2g the velocity head. The equation says that the loss is a number of velocity heads, one for every D ÷ f of pipe length: a pipe of length L costs f × L ÷ D velocity heads.

The friction factor depends on the flow's regime and, in turbulent flow, on the pipe's roughness. Chapter 3 gave it for laminar flow, f = 64 ÷ Re. For turbulent flow, it must be calculated from the Reynolds number and the pipe's relative roughness.

## Roughness

Every pipe's inside surface has some roughness, the height of the bumps on its wall. What matters for friction is the **relative roughness**, the roughness divided by the bore, ε ÷ D, because a given bump matters more in a small pipe than a large one.

Roughness values for new pipes come from tests. Moody's widely used 1944 chart gives an absolute roughness of 0.045 mm for commercial steel pipe and 0.0015 mm for drawn tubing such as copper. Pipes in service get rougher: corrosion, scale and biofilm can raise the effective roughness several times over, and narrow the bore too. The values for used pipe are uncertain, and a designer allows for ageing deliberately rather than hoping it will not happen.

For CW-2's new steel header, ε ÷ D = 0.045 ÷ 80.9 = 0.000556.

## The friction factor in turbulent flow

The standard formula for the turbulent friction factor is the **Colebrook equation**, published in 1939:

1 ÷ √f = −2 × log₁₀(ε ÷ 3.7D + 2.51 ÷ (Re × √f)).

The friction factor appears on both sides, so the equation is solved by iteration: guess f, calculate the right-hand side, take the new f from it, and repeat. It converges quickly, and a spreadsheet does it in a few cells. For CW-2's header, with Re = 158,700 and ε ÷ D = 0.000556, starting from a guess of 0.02 gives 0.019491 after one round, 0.019517 after two and 0.019516 after three, and it is settled: **f = 0.01952**.

For hand calculation, an explicit approximation is convenient. The **Swamee–Jain** equation, published in 1976, gives

f = 0.25 ÷ [log₁₀(ε ÷ 3.7D + 5.74 ÷ Re⁰·⁹)]²,

which for CW-2's header gives f = 0.01963, 0.6% above Colebrook. That is closer than the roughness is known, and the approximation is good enough for most plant work; this book uses Colebrook throughout because a spreadsheet iterates it without effort.

## Friction in CW-2's header

```figure
type: formula
title: Friction in 100 m of CW-2's supply header at the design flow
formula: h_f = f × (L ÷ D) × v² ÷ 2g
caption: Water at 25 °C, new steel pipe. The result, 36.9 kPa per 100 m, is the header's friction gradient at 9.0 L/s.
- f | Darcy friction factor, 0.01952 by Colebrook
- L ÷ D | 100 ÷ 0.0809 = 1,236.1
- v² ÷ 2g | Velocity head, 1.751² ÷ (2 × 9.807) = 0.1563 m
step: h_f = 0.01952 × 1,236.1 × 0.1563 = 3.771 m per 100 m
step: As pressure: 3.771 × 9.778 = 36.9 kPa per 100 m
```

The supply header's flow falls at each tee, so its friction is calculated length by length, each at its own flow, velocity, Reynolds number and friction factor. Adding up the six lengths from the pump to the last machine gives a supply header friction of **1.315 m**. The return header, whose last 26 m carries the full flow back to the tank, loses **1.466 m**. And the 12 m of 36.0 mm branch to and from the farthest machine, at 1.474 m/s with f = 0.02419, loses 0.02419 × (12 ÷ 0.036) × 0.1107 = **0.893 m**.

Those three, 3.674 m in all, are the straight-pipe friction of CW-2's longest path at the design flow. They are worked out once in the CW-2 workbook, one row per length, so that a change of flow or bore anywhere can be followed through to the total in a moment. Chapter 5 adds the fittings and equipment, and Chapter 6 assembles them into the system curve.

## The hydraulic grade line

A useful picture of friction is the **hydraulic grade line**, the height to which water would rise in a thin tube tapped into the pipe at each point: the elevation plus the pressure head. Along a straight pipe of constant bore, friction makes the grade line fall steadily, by the friction gradient, 3.771 m per 100 m in CW-2's first header length. Where the pipe rises, the pressure falls by the rise, but the grade line does not, because it includes the elevation.

Plotted along CW-2's longest path, the grade line starts at the tank's water level, jumps up by the pump's head, falls gently along the supply header, more steeply through each machine's branch and coolers, gently again along the return, and ends at the return's discharge, 1.2 m above the tank's level. Wherever the pipe itself rises above the grade line, the pressure there is below atmospheric, which is how Chapter 9 finds the return's high point.

The grade line also shows at a glance where the loss is. On CW-2, the machines' coolers and branches take a larger share of the fall than the 128 m of headers do, which is typical of a loop with short, fast branches and long, slower headers.

## Checking friction on site

Friction can be measured as well as calculated, and on an existing system it should be, because roughness and bore are rarely known exactly. Two pressure gauges at the same height, on a straight length of pipe with no branches or fittings between them, read a difference that is purely friction. On CW-2, the plant fitted test points 20 m apart on the first header length, at the same height. This is an illustration: at a measured 9.0 L/s, they read 7.6 kPa apart, against a calculated 20 × 0.369 = 7.4 kPa.

The match within 3% confirms the roughness and bore assumed, within the gauges' accuracy. Years later, the same test, repeated at the same flow, measures the header's ageing directly: a reading of 10 kPa would mean the effective roughness or the bore had changed enough to raise friction by a third. A test of that kind, made once a year at a recorded flow, is one of the cheapest condition checks on a pipe system.

For the check to mean anything, the gauges must be accurate at the difference being measured. A pair of ordinary 0 to 600 kPa gauges, each accurate to perhaps 1% of full scale, could disagree by more than the 7.4 kPa being measured. A differential pressure gauge, or a pair of calibrated test gauges swapped between the points, is needed.

## How friction grows with flow

In turbulent flow, the friction factor falls slightly as the Reynolds number rises, so friction grows a little more slowly than the square of the flow. For CW-2's header, over 100 m:

```figure
type: compare
title: Friction in 100 m of 80.9 mm header by flow
rowhead: Flow
cols: Velocity, m/s | Friction factor | Head lost, m per 100 m
caption: This is an illustration for new steel pipe and water at 25 °C. Between 4.5 and 12 L/s, the loss grows as about the 1.89th power of the flow.
- 4.5 L/s | 0.875 | 0.02119 | 1.024
- 6.0 L/s | 1.167 | 0.02041 | 1.753
- * 9.0 L/s | 1.751 | 0.01952 | 3.771
- 12.0 L/s | 2.335 | 0.01901 | 6.529
```

Treating friction as rising with the flow squared is the usual simplification for system curves, and it is slightly conservative at flows above the design point and slightly generous below. For CW-2, the exponent between 4.5 and 12 L/s is 1.89. Chapter 6 uses the square law and checks it against the full calculation.

## How friction shrinks with bore

Friction is very sensitive to the bore. At a fixed flow, the velocity rises with the inverse square of the bore, the velocity head with the inverse fourth power, and L ÷ D adds one more power. The result is that friction at a fixed flow falls roughly as the fifth power of the bore.

For CW-2's 9.0 L/s, a 62.7 mm bore would lose 13.70 m per 100 m; the actual 80.9 mm loses 3.771 m; a 102.3 mm bore would lose 1.165 m. Between the smallest and largest, the exponent is 5.03. One pipe size smaller would have nearly quadrupled the header's friction, and one size larger would have cut it by two-thirds. That sensitivity is why Chapter 1 insisted on the true bore: a bore 2% too small in the calculation makes the friction about 10% too large.

## Other friction formulas

Water supply and fire protection work often uses the **Hazen–Williams** formula instead of Darcy–Weisbach. It is an empirical formula, fitted to tests on water in pipes at ordinary temperatures, and it describes the pipe by a single coefficient, C, instead of a roughness and a Reynolds number. Within its range, it gives sensible answers quickly, and many water authorities' design rules and many fire sprinkler calculations are written around it.

Its limits are the reason this book does not use it. It applies only to water, only at ordinary temperatures, and only in turbulent flow; it does not respond correctly to viscosity, so it cannot handle oil, glycol or hot water; and its coefficient is not tied to a measurable property of the pipe. Darcy–Weisbach with Colebrook has none of those limits. Where a rule or standard calls for Hazen–Williams, it should be used as the rule requires; elsewhere, Darcy–Weisbach is the general method, and the one that the rest of this book builds on.

## Ageing and roughness

This is an illustration. If CW-2's header corroded until its effective roughness reached 0.5 mm, eleven times the new value, the friction factor at the design flow would rise from 0.01952 to 0.03294, and the header's friction per 100 m from 3.771 to 6.364 m, an increase of **69%**. If the corrosion also narrowed the bore with scale, the increase would be larger still. The plant's design therefore allows for some ageing in the pump's selection, and Centrifugal Pumps by the Numbers shows how a pump's flow falls as its system ages.

```figure
type: bars
title: Friction in 100 m of CW-2's header by roughness
unit: m
max: 8
caption: This is an illustration at 9.0 L/s and 25 °C, with the bore unchanged. Only 0.0015 and 0.045 mm are new-pipe values from Moody; the others represent pipe in service.
- Drawn tubing, 0.0015 mm | 3.189
- * New steel, 0.045 mm | 3.771
- Lightly corroded, 0.15 mm | 4.660
- Corroded, 0.5 mm | 6.364
- Heavily corroded, 1.0 mm | 7.943
```

## The error: a Fanning factor in a Darcy formula

This is an illustration. A process engineer checking CW-2's header used a friction factor from a chemical engineering reference, which tabulated the **Fanning** friction factor. For the same flow and pipe, the Fanning factor is exactly a quarter of the Darcy factor: about 0.00488 for CW-2's header, against Darcy's 0.01952. The engineer put it straight into the Darcy–Weisbach equation.

The result was a friction loss of **0.943 m** per 100 m, a quarter of the true 3.771 m, about 9.2 kPa instead of 36.9. On that basis, the engineer concluded that the existing pump had a large margin and could supply two more machines without change.

The conclusion was caught at review, by a colleague who checked the friction factor against the Moody chart and found it a quarter of the chart's value. Both factors are correct in their own equations: the Fanning factor belongs in a formula with 4f in place of f. The rule the plant adopted is to write the name of the factor, Darcy or Fanning, next to every friction factor in a calculation, and to check any factor below about 0.008 in turbulent water flow, because no Darcy factor for real pipe at plant Reynolds numbers is that small.

## Exercise: the return header's last length

CW-2's return header's last length carries the full 9.0 L/s for 26 m to the tank, in the same 80.9 mm steel pipe at about 32 °C, where water's kinematic viscosity is about 0.769 mm²/s. Find its Reynolds number, its friction factor by Swamee–Jain, and its friction loss.

**Worked answer.**

- The velocity is 1.751 m/s, as on the supply side, since the bore and flow are the same.
- Re = 1.751 × 0.0809 ÷ (0.769 × 10⁻⁶) = **184,200**.
- Swamee–Jain: f = 0.25 ÷ [log₁₀(0.000556 ÷ 3.7 + 5.74 ÷ 184,200⁰·⁹)]² = **0.01936**.
- h_f = 0.01936 × (26 ÷ 0.0809) × 0.1563 = **0.973 m**.

The warmer water, being less viscous, has a higher Reynolds number and a slightly lower friction factor than the supply's. The difference is about 1%, and CW-2's calculations, made at 25 °C throughout, are slightly conservative for the warm return.
