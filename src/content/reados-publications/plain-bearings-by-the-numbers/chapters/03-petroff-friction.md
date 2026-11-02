---
book: plain-bearings-by-the-numbers
chapterSlug: petroff-friction
order: 3
title: "Petroff's friction and power loss"
description: "Derive Petroff's equation for a journal bearing's friction, use the KEVOS® Petroff tool for torque, friction coefficient, power loss and Sommerfeld number, and correct the result for eccentricity."
draft: false
---

The first useful number about any running journal bearing is how much power its oil film absorbs. It sets the bearing's temperature, its share of the machine's energy bill and, through the temperature, its oil's viscosity and therefore its film. In 1883, the same year Tower found the film pressure, Nikolai Petroff in Russia published a formula for that friction which is still the starting point of every bearing calculation. It treats the journal as centred in its bore and the oil film as a simple shear layer, which sounds crude and works remarkably well.

This chapter derives Petroff's equation, applies it to FB-75's bearings with the KEVOS® journal bearing friction tool, looks at how the friction depends on speed, size, clearance and viscosity, corrects it for the journal's real off-centre position using the short-bearing solution, and ends with a clearance entered in the wrong form.

## A sheared ring of oil

Imagine the journal centred in its bore. The oil film is then a thin ring of uniform thickness c, the radial clearance, with the journal's surface moving at speed U and the bore stationary. The oil in it is sheared exactly like the film between two plates in Chapter 1 of the companion book, at a shear rate of U ÷ c, so the shear stress on the journal is μU ÷ c everywhere around it.

```figure
type: formula
title: Petroff's equation for a centred journal
formula: Torque T₀ = 4π² r³ L μ N ÷ c
formula: Friction coefficient f₀ = 2π² × (μN ÷ P) × (r ÷ c)
formula: Power loss = 2π N T₀
caption: Shear stress μU ÷ c acts over the journal's surface 2πrL at radius r; with U = 2πrN this gives the torque. P is the unit load W ÷ (2rL). All in SI units, N in revolutions per second.
- r | journal radius, m
- L | bearing length, m
- μ | dynamic viscosity at the film temperature, Pa·s
- N | speed, rev/s
- c | radial clearance, m
- P | unit load, Pa
```

The striking feature of the result is that the load W does not appear in the torque. A centred journal shears the same film whatever it carries. The friction coefficient, friction force divided by load, therefore falls as load rises, which is why lightly loaded bearings have high friction coefficients and heavily loaded ones low.

## FB-75 by hand

This is an illustration. FB-75's journal is 80 mm in diameter, its bearing 60 mm long, its radial clearance 0.06 mm and its speed 1,480 rpm, 24.67 rev/s. At its running temperature of about 66 °C, its VG 68 oil's dynamic viscosity is 19.1 mPa·s, a figure Chapter 6 derives from the bearing's heat balance.

```figure
type: steps
title: Petroff friction in FB-75's drive-end bearing at 66 °C
caption: This is an illustration. The journal is assumed centred; the next sections correct for its real position.
- Surface speed | U = π × 0.080 × 24.67 = 6.20 m/s
- Shear stress | τ = 0.0191 × 6.20 ÷ 0.00006 = 1,973 Pa
- Friction force on the journal | 1,973 × π × 0.080 × 0.060 = 29.8 N
- Torque | 29.8 × 0.040 = 1.190 N·m
- * Power loss | 2π × 24.67 × 1.190 = 184.5 W
- Friction coefficient | 29.8 ÷ 6,000 = 0.00496
```

A friction coefficient of 0.005 is about a twentieth of what dry or boundary-lubricated metals give, and comparable with a rolling bearing's, as Chapter 10 discusses. The power loss of 184.5 W per bearing, 369 W for the pair, is small beside the fan's 75 kW, but it all becomes heat in a housing holding a few litres of oil, and that heat sets the bearing's temperature.

## The journal bearing friction tool

The [journal bearing friction tool](/tools/journal-bearing-petroff/) performs this calculation from the journal diameter, bearing length, radial clearance, oil viscosity at the operating temperature in millipascal-seconds, speed and radial load. It reports the unit load, Petroff friction torque, coefficient of friction, power loss, Sommerfeld number and clearance ratio, and it checks the Sommerfeld number to judge whether the Petroff estimate is reasonable on its own.

This is an illustration. Entering 80 mm, 60 mm, 0.06 mm, 19.1 mPa·s, 1,480 rpm and 6,000 N gives a unit load of 1.250 MPa, a friction torque of 1.1904 N·m, a coefficient of friction of 0.00496, a power loss of 184.5 W, a Sommerfeld number of 0.1675 and a clearance ratio of 0.0015. Because the Sommerfeld number is above the tool's threshold of 0.15, it reports the bearing as lightly loaded, with Petroff a reasonable estimate. At lower Sommerfeld numbers it advises using design charts with the Sommerfeld number it has calculated, which Chapter 4 does with the short-bearing solution.

## What the friction depends on

Petroff's equation shows at a glance how each design choice moves the friction loss, and the dependences are steep.

```figure
type: compare
title: How Petroff's power loss scales with each variable
cols: Power loss proportional to | Doubling it multiplies the loss by
rowhead: Variable
- Viscosity μ | μ | 2
- Speed N | N² | 4
- Journal diameter d | d³ | 8
- Bearing length L | L | 2
- Radial clearance c | 1 ÷ c | 0.5
- Load W | not at all, for a centred journal | 1
caption: Speed enters squared because torque rises with speed and power is torque times speed; diameter enters cubed through surface area, surface speed and lever arm.
```

The cubic dependence on diameter is why large slow shafts and small fast ones can have similar losses, and why increasing a journal's diameter to raise its load capacity is expensive in friction. A 100 mm journal in place of FB-75's 80 mm, at the same length, clearance ratio and oil, would lose (100 ÷ 80)³ = 1.95 times as much, before allowing for the larger clearance a larger journal would usually get. The square dependence on speed is why high-speed bearings run hot and why their oil must be pumped through them to carry the heat away, rather than lifted by a ring.

The viscosity dependence is the one that changes in service. At 50 °C, on a cold morning before the bearing has warmed, the oil's viscosity is 36.3 mPa·s and the Petroff loss is 350 W, almost twice the running figure. That is the beginning of the heat balance of Chapter 6: the bearing makes more heat when cold and less when hot, and so settles at a temperature where the heat it makes equals the heat it can shed.

## Correcting for eccentricity

A loaded journal is not centred; Chapter 1 explained that it must move off centre to form its wedge. The film is then thinner on one side and thicker on the other, and the shear is no longer uniform. Where the film is thin, the shear rate and stress rise; where it is thick, they fall. The two do not cancel, because shear stress varies inversely with film thickness, and the average of the inverse of a varying thickness is larger than the inverse of its average. The off-centre journal therefore has more friction than Petroff's centred one.

DuBois and Ocvirk's short-bearing analysis, published by the NACA in 1953, gives the correction in a simple closed form, which they called the friction ratio.

```figure
type: formula
title: The friction ratio of an eccentric journal
formula: F ÷ F₀ = 1 ÷ √(1 − ε²)
caption: F₀ is Petroff's friction force for the centred journal and ε the eccentricity ratio. From NACA Report 1157, which found the relation in useful agreement with its tests. Chapter 4 finds ε for FB-75.
- F | friction force on the eccentric journal
- F₀ | Petroff friction force
- ε | eccentricity ratio, from 0 (centred) to 1 (touching)
```

This is an illustration. Chapter 4 finds FB-75's journal running at an eccentricity ratio of 0.523 at 66 °C. The friction ratio is 1 ÷ √(1 − 0.523²) = 1.174, so the torque rises from 1.190 to 1.397 N·m and the power loss from 184.5 to 216.6 W, a friction coefficient of 0.0058. The correction is 17% for this bearing; for a heavily loaded bearing at ε = 0.8 it would be 67%, and at ε = 0.9, 129%. Petroff's equation is therefore a good estimate for lightly loaded bearings and a lower bound for heavily loaded ones, which is what the tool's Sommerfeld check is guarding against.

```figure
type: bars
title: Friction ratio to the Petroff value at different eccentricity ratios
unit: ×
max: 2.5
caption: From F ÷ F₀ = 1 ÷ √(1 − ε²). FB-75 at 66 °C runs at ε = 0.523.
- ε = 0.2 | 1.02
- ε = 0.4 | 1.09
- * ε = 0.523, FB-75 | 1.17
- ε = 0.7 | 1.40
- ε = 0.8 | 1.67
- ε = 0.9 | 2.29
```

## Petroff's assumptions and where they bend

Petroff's equation rests on four assumptions, and knowing them tells an engineer when to trust it.

The first is that the film is laminar. The film's own Reynolds number, density times surface speed times clearance divided by viscosity, is 838.9 × 6.20 × 0.00006 ÷ 0.0191 = 16 for FB-75: deeply laminar. Only very large, fast bearings with thin oils approach the conditions in which the film becomes turbulent and friction rises above the laminar value, and their makers allow for it.

The second is that the viscosity is the same everywhere in the film. In reality the oil heats as it is sheared, so it is hotter where it leaves the loaded zone than where it enters, and hotter near the bearing surface that is cooled least. The calculation uses a single effective viscosity, which Chapter 6 takes from the bearing's heat balance; the uncertainty in that choice is usually larger than the error in the equation itself.

The third is that the oil fills the whole clearance. In a real journal bearing, the film breaks up into streamers of oil and air or vapour in the diverging half of the clearance, where the pressure would otherwise fall below atmospheric. The broken film shears less oil, which lowers the friction there and partly offsets the eccentricity increase described below. The short-bearing friction ratio assumes a full film and so errs slightly on the high side.

The fourth is that the journal and bore are perfectly round, straight and aligned. Misalignment and distortion concentrate the film's thin region at the bearing's ends, raising friction and, more importantly, threatening the film's thinnest point, which Chapter 4 calculates.

## Inferring friction in a running machine

A bearing's friction torque is hard to measure in place, because it is a tiny fraction of the shaft torque and the motor's current cannot resolve it. It can be inferred from heat. A bearing in steady running sheds all its friction power as heat, through its housing to the air and, for pressure-fed bearings, into the oil that passes through it. For a pressure-fed bearing, the oil flow times its density, specific heat and temperature rise gives the friction power directly. For an oil-ring bearing like FB-75's, the housing's rate of heat loss per kelvin, which Chapter 6 estimates and which can be measured by a warming test, multiplied by the oil's temperature above the air, gives the same thing. A bearing whose oil runs hotter than its usual margin above the air, at the same speed and air temperature, is making more heat, and the cause is worth finding.

## What the friction costs

This is an illustration. FB-75's two journal bearings absorb about 434 W between them. Running 8,000 hours a year, they use about 3,470 kWh, which at a fictional tariff of A$0.25 per kWh including GST costs about A$870 a year. That is a small share of the fan's own energy cost, and not a reason to change the bearings. It is, however, a reason not to raise the oil's viscosity without cause, as Chapter 1's error showed, and a fair comparison when Chapter 10 weighs plain bearings against rolling bearings. It is also a reminder that friction in a full-film bearing is a design choice: the clearance, length and oil grade that set it are all chosen, and each choice that lowers friction has a cost elsewhere, which the next three chapters weigh.

## The error: diametral clearance entered as radial

This is an illustration. A graduate engineer checking FB-75's bearings took the clearance from the bearing's design sheet, which gave the running clearance as "0.12 mm", and entered it in the friction tool's radial clearance field. The tool returned a friction torque of 0.595 N·m, a power loss of 92 W and a Sommerfeld number of 0.042, and advised that the bearing was heavily loaded and needed design charts. The graduate was puzzled: the loss looked low, and the warning looked alarming for a bearing that had run well for years.

The reliability engineer recognised the pattern at once. Bearing makers usually state the diametral clearance, the difference between bore and journal diameters, while the tool, like Petroff's equation, uses the radial clearance, half of it. Entering a diametral value as radial doubles the clearance in the formula, which halves the torque and the friction coefficient and divides the Sommerfeld number by four. With 0.06 mm, the radial clearance that matches the design sheet's 0.12 mm diametral, the tool gave 1.190 N·m, 184.5 W and S = 0.168, a lightly loaded bearing as expected.

```figure
type: compare
title: The same bearing with its clearance entered two ways
cols: Torque | Power loss | Sommerfeld number | Tool's check
rowhead: Clearance entered
- 0.12 mm, diametral entered as radial | 0.595 N·m | 92 W | 0.042 | Heavily loaded: use design charts
- * 0.06 mm, radial | 1.190 N·m | 184.5 W | 0.168 | Lightly loaded: Petroff reasonable
caption: This is an illustration. Diametral clearance is twice radial clearance. The Sommerfeld number contains the clearance squared, so the error is fourfold there.
```

The clue that caught it was a mismatch between the result and experience: a bearing that had run cool and quiet for years did not suddenly become heavily loaded. The plant's calculation template now has two clearance fields, labelled diametral and radial, with the radial one calculated from the diametral, and every clearance quoted in a report states which it is.

## Bringing it together

Petroff's equation treats the film as a uniform sheared ring and gives the friction torque 4π²r³LμN ÷ c, independent of load, with a friction coefficient 2π²(μN ÷ P)(r ÷ c). For FB-75 at 66 °C it gives 1.19 N·m and 184.5 W per bearing, a friction coefficient of 0.005. The loss rises with viscosity, with the square of speed and the cube of diameter, and falls with clearance. An off-centre journal has more friction, by the factor 1 ÷ √(1 − ε²), 17% more for FB-75. Finding ε is the job of the next chapter.

## Exercise: friction on a cold morning

Early on a winter morning FB-75 has just started and its bearings' oil is at 50 °C, where the VG 68 oil's dynamic viscosity is 36.3 mPa·s. Use the friction tool to find the Petroff torque, power loss and Sommerfeld number. If Chapter 4's method gives an eccentricity ratio of 0.390 at this viscosity, what is the corrected loss?

**Worked answer.** This is an illustration. With 80 mm, 60 mm, 0.06 mm, 36.3 mPa·s, 1,480 rpm and 6,000 N, the tool gives a torque of **2.26 N·m**, a power loss of **350 W** and a Sommerfeld number of **0.318**, lightly loaded. The friction ratio is 1 ÷ √(1 − 0.390²) = 1.086, so the corrected loss is 350 × 1.086 = **380 W**, 75% more than at the running temperature. The bearing makes most heat when it is coldest, which is how it warms itself up to its equilibrium.
