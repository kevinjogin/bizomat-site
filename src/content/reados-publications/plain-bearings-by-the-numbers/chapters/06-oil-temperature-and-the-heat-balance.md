---
book: plain-bearings-by-the-numbers
chapterSlug: oil-temperature-and-the-heat-balance
order: 6
title: "Oil temperature and the heat balance"
description: "Find a journal bearing's running temperature where the heat its film makes equals the heat its housing sheds, check the oil there with the KEVOS® tool, and compare grades."
draft: false
---

Every calculation in Chapters 3 to 5 needed one number before it could start: the oil's viscosity in the film. That viscosity depends on the film's temperature, and the film's temperature depends on how much heat the film makes, which depends on the viscosity. A journal bearing is a small thermal system that finds its own operating point, and the designer's job is to find it too.

This chapter sets out the heat balance of FB-75's oil-ring bearings, solves it by plotting the heat made and the heat shed against temperature, checks the result with the KEVOS® journal bearing oil check, compares oil grades and air temperatures, looks at how long the bearing takes to reach its balance and what alarm limits mean, and ends with a load increase that was checked at the data sheet's 40 °C instead of at the temperature the bearing would actually reach.

## Heat made, heat shed

In steady running, all the friction power in the film becomes heat, and all of it must leave the bearing. In a pressure-fed bearing most leaves in the oil that flows through it to a cooler. In an oil-ring bearing like FB-75's, the oil circulates only within the housing, carrying heat from the film to the sump and the housing walls, and the heat leaves through the housing's outer surface to the surrounding air, with some conducted along the shaft.

The heat shed is therefore roughly proportional to the difference between the oil temperature and the air temperature, through a single coefficient: the housing's heat loss per kelvin. It combines the housing's surface area, the convection and radiation from it, and the conduction along the shaft. It can be estimated from the housing's surface area and a heat transfer coefficient, as Heat Transfer by the Numbers explains, but it is better measured, as described below.

```figure
type: formula
title: The heat balance of an oil-ring bearing
formula: Heat made = friction power(T)
formula: Heat shed = G × (T − T_air)
formula: Running temperature: friction power(T) = G × (T − T_air)
caption: The friction power falls as the oil warms, because its viscosity falls; the heat shed rises. They cross at one temperature, the running temperature.
- T | oil temperature in the bearing, °C
- G | housing heat loss per kelvin, W/K; FB-75: 6.0 W/K
- T_air | air temperature around the housing, °C
```

## Solving the balance for FB-75

This is an illustration. FB-75's drive-end bearing sheds 6.0 W per kelvin to fan house air at 30 °C on a summer afternoon. Evaluating the friction power with the short-bearing solution at a series of oil temperatures, and the heat shed at the same temperatures, gives two curves that cross.

```figure
type: line
title: Heat made and heat shed by FB-75's drive-end bearing, air at 30 °C
x: Oil temperature, °C
y: Heat, W
ymin: 0
ymax: 400
legend: Heat made by the film | Heat shed by the housing
caption: This is an illustration. Heat made from the short-bearing friction with VG 68 oil; heat shed at 6.0 W/K above 30 °C air. The curves cross at about 66 °C and 217 W.
- 50 | 380.3 | 120.0
- 55 | 314.4 | 150.0
- 60 | 263.9 | 180.0
- 65 | 224.4 | 210.0
- 70 | 193.1 | 240.0
- 75 | 167.9 | 270.0
- 80 | 147.3 | 300.0
```

At 65 °C the film makes 224 W and the housing sheds 210 W, so the bearing is still warming; at 70 °C it makes 193 W and sheds 240 W, so it would cool. The crossing, found by narrowing the interval, is at 66.1 °C, where both are 216.8 W. That is the running temperature used throughout this book, with a viscosity of 22.8 mm²/s and 19.1 mPa·s.

The balance is stable: if anything nudges the bearing hotter, it makes less heat and sheds more, and returns. This self-correction is one of the great strengths of a hydrodynamic bearing, and it is why oil-ring bearings run for years without attention. It holds only while the film stays complete; a starved or contaminated film makes heat in a different way and can run away.

## The journal bearing oil check

The [journal bearing oil check](/tools/journal-bearing-oil-check/) evaluates a chosen oil at a chosen running temperature. From the oil's two catalogue viscosities it finds the kinematic viscosity at the running temperature by the ASTM D341 relation, converts it to dynamic viscosity with the density entered, and then calculates the unit load, Sommerfeld number, Petroff friction torque and power loss. It checks the viscosity against the least the user accepts and the Sommerfeld number against a limit, and warns if the temperature lies outside the catalogue points.

This is an illustration. For FB-75 at 66 °C, the inputs are 40 °C and 68 cSt, 100 °C and 8.6 cSt, a running temperature of 66 °C, a density at that temperature of 838.9 kg/m³, a least accepted viscosity of 15 cSt chosen by the plant, and the bearing's 6,000 N, 80 mm, 60 mm, 0.06 mm, 1,480 rpm with a smallest Sommerfeld number of 0.05.

```figure
type: steps
title: FB-75's drive-end bearing in the journal bearing oil check at 66 °C
caption: This is an illustration. The tool's friction is Petroff's; Chapter 3's eccentricity correction raises it to about 217 W. The least accepted viscosity is the plant's choice.
- Viscosity at 66 °C | 22.89 cSt; dynamic 19.21 mPa·s
- Unit load | 1.250 MPa
- * Sommerfeld number | 0.168, against 0.05
- Friction torque and power loss | 1.197 N·m; 185.5 W
- Checks | viscosity 22.9 cSt against 15 cSt; temperature between the catalogue points
- Verdict | OIL SUITABLE
```

The tool does not find the running temperature itself; it evaluates the oil at a temperature the user supplies. The two methods work together: use the heat balance to find the temperature, then the tool to check the oil there, and repeat the tool at the hottest air temperature and with the oil's alarm limit to see the margins.

## Grade and air temperature

The heat balance answers two practical questions directly. The first is what a different grade would do.

```figure
type: compare
title: FB-75's drive-end bearing on four grades, air at 30 °C
cols: Running temperature | Viscosity there | Friction loss | Thinnest film
rowhead: Grade
- ISO VG 32 | 57.6 °C | 16.5 mm²/s | 165 W | 25.0 µm
- ISO VG 46 | 61.7 °C | 19.5 mm²/s | 190 W | 26.8 µm
- * ISO VG 68 | 66.1 °C | 22.8 mm²/s | 217 W | 28.6 µm
- ISO VG 100 | 70.9 °C | 26.5 mm²/s | 246 W | 30.3 µm
caption: This is an illustration. Each grade with typical fictional data sheet values; heat balance at 6.0 W/K. Heavier grades run hotter but still end with more viscosity and a thicker film.
```

The heat balance compresses the differences between grades. VG 100 is about 38% more viscous than VG 68 at the same temperature, but because it runs 4.8 K hotter its viscosity at its own running temperature is only 16% higher, and its film only 6% thicker, while its friction is 13% higher. VG 32 runs 8.5 K cooler with a film 13% thinner. All four would satisfy the plant's 10 µm minimum; VG 68 is the bearing maker's recommendation and gives a comfortable film at a moderate temperature. Choosing among them is a balance between film margin, temperature and the other machines that share the plant's oil stock.

The second question is what the season does. On a winter afternoon with the fan house at 15 °C, the bearing settles at 59.6 °C; at 20 °C air, at 61.6 °C; at 30 °C, 66.1 °C. A 15 K change in air temperature moves the bearing by only 6.5 K, because the hotter bearing makes less heat. The bearing's temperature above the air is a better health indicator than its absolute temperature, and it is the one the plant trends.

## How long the balance takes

The heat balance gives the temperature the bearing will reach, not how quickly. A housing holding about 4 L of oil in about 60 kg of cast iron has a heat capacity of roughly 4 × 0.85 × 1.9 + 60 × 0.46 = 34 kJ per kelvin. Divided by its heat loss of 6.0 W/K, that gives a time constant of about 5,700 seconds, or 1.6 hours: after starting, the bearing covers about 63% of its rise in the first 1.6 hours and is within a kelvin or so of its final temperature only after five or six hours. This is an illustration with fictional masses, but the order is typical: oil-ring bearings take hours, not minutes, to settle.

Two consequences follow. A bearing's temperature during its first hour says little about whether it will be acceptable, so commissioning tests must run long enough for the temperature to stop rising. And the time constant gives a practical way to measure the housing's heat loss: run the fan until the bearing is steady, note the temperature above the air and the friction loss calculated for that temperature, and their ratio is G. FB-75's 6.0 W/K came from just such a test, and its value was then used for every calculation in this book.

## Improving the housing's cooling

When a bearing runs hotter than its oil or lining should, the heat balance shows two ways to cool it: make less heat or shed more. Making less heat usually means a lighter grade or a larger clearance, each with the costs this chapter and the last have shown. Shedding more means raising the housing's heat loss per kelvin, G, and it has no cost to the film at all.

Housings can be given more surface with cast or bolted fins, more air movement with a small fan on the shaft or a baffle that directs the main fan's air over them, or a water-cooled coil in the sump for heavy duties. Each raises G. This is an illustration of the effect: if FB-75's housing were improved from 6.0 to 9.0 W/K, the drive-end bearing would settle at 59.7 °C instead of 66.1 °C on a summer afternoon, with a thinnest film of 31.5 µm instead of 28.6 µm. At 12 W/K it would settle at 55.6 °C with a 33.6 µm film. The friction loss rises as the bearing cools, to 267 W and 307 W, because the oil is more viscous; that heat is now being shed, and the bearing's lower temperature extends the oil's life and keeps the white metal well below the temperatures at which its strength falls.

Cooling the housing is often the cheapest fix for a bearing that runs hot without any fault, such as one moved to a hotter location or run at a higher speed. It is not a cure for a fault. A bearing that has started to run hotter than its own history, at the same speed, load and air temperature, is telling its owner that something has changed in its film, and more cooling would only hide it.

## Alarms and trips

Bearing temperature is the most widely monitored quantity on plain bearings, by a sensor in the oil sump or, better, in the white metal near the thinnest film. The plant set an alarm at 80 °C and a trip at 90 °C on its sump thermometers. These are its own choices, made with the bearing and oil makers' guidance, and are given as an illustration. They leave about 14 K between the summer running temperature and the alarm, enough for normal variation but not for a starved film, failing oil ring or misaligned journal, which are exactly the faults the alarm exists to catch.

```figure
type: range
title: FB-75's drive-end bearing temperatures against its limits
min: 50
max: 95
unit: °C
ticks: 50 | 65 | 80 | 95
caption: This is an illustration. Running range from the heat balance at 15 °C to 30 °C air; alarm and trip are the plant's settings.
- Normal running range | 59.6 | 66.1
- Alarm | 80 | 80
- Trip | 90 | 90
```

## The error: a load increase checked at 40 °C

This is an illustration. The plant planned to fit FB-75 with a larger impeller, which would raise the drive-end bearing's load from 6.0 to 9.0 kN. An engineer checked the bearing with the short-bearing solution, taking the oil's viscosity from its data sheet at 40 °C, 68 mm²/s, or 58.1 mPa·s. The result was reassuring: a Sommerfeld number of 0.340, an eccentricity ratio of 0.375 and a thinnest film of 37.5 µm, thicker than the existing bearing's 28.6 µm. The engineer concluded that the bearing had more than enough margin.

A reviewer asked why a heavier load should give a thicker film. The answer was that the calculation had been done at 40 °C, a temperature the bearing never runs at. Repeated with the heat balance, at 9.0 kN, the bearing would settle at 67.2 °C, with 18.4 mPa·s, a Sommerfeld number of 0.108, an eccentricity ratio of 0.606 and a thinnest film of 23.7 µm, about 17% thinner than now. Its peak film pressure would rise from 3.59 to 6.04 MPa.

```figure
type: compare
title: The 9 kN impeller checked two ways
cols: Oil viscosity | Sommerfeld number | Thinnest film | Peak pressure
rowhead: Method
- At the data sheet's 40 °C | 58.1 mPa·s | 0.340 | 37.5 µm | not checked
- * With the heat balance, 67.2 °C | 18.4 mPa·s | 0.108 | 23.7 µm | 6.04 MPa
caption: This is an illustration. Short-bearing solution, air at 30 °C, housing 6.0 W/K. The heavier load raises the running temperature only slightly, because the eccentric film makes little more heat.
```

The corrected film was still more than twice the plant's 10 µm minimum, so the upgrade went ahead, but with the peak pressure drawn to the bearing maker's attention, a commissioning run long enough for the temperature to settle, and the alarm settings reviewed. The lesson recorded was the same as the companion book's for hydraulic lines: a viscosity-dependent calculation must be made at the temperature the oil will reach, not at the temperature on its data sheet.

## Bringing it together

A journal bearing's running temperature is where the heat its film makes, which falls as the oil warms, equals the heat its housing sheds, which rises. For FB-75's drive-end bearing that is 66.1 °C with 30 °C air, 217 W, at a viscosity of 19.1 mPa·s. The oil check tool evaluates an oil at that temperature. Heavier grades run hotter and end with only slightly more viscosity; the bearing's rise above the air is the best indicator of its health; and it takes hours to settle. Every film calculation needs the balance first. The next chapter makes sure the film has the oil it needs.

## Exercise: a faster fan

A variable-speed drive would let FB-75 run at 1,780 rpm at its existing 6.0 kN load. Use the heat balance with the existing housing to estimate the new running temperature and film, then check the oil at that temperature with the oil check tool.

**Worked answer.** This is an illustration. Repeating the balance at 1,780 rpm, the film makes more heat at every temperature, because friction rises with the square of speed, and the curves cross at about **72.4 °C**, where the loss is about **254 W**. At that temperature the VG 68 oil is at about 18.5 mm²/s, and the faster journal drags in more oil, so the thinnest film is **28.2 µm**, almost unchanged. The oil check at 72.4 °C, with a density of 835.0 kg/m³, passes the plant's 15 cSt minimum. The bearing's main cost is 6 K of temperature, taking it to within 8 K of its alarm on a summer afternoon; the plant would either accept that or improve the housing's cooling, which Chapter 7 discusses.
