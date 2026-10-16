---
title: "Powers, roots and scientific notation: index laws, SI prefixes and why some quantities grow so fast"
description: "A practical guide to powers, roots and scientific and engineering notation, converting squared and cubed units, and why energy, stiffness and fan power rise with the square or cube of a change."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Engineering quantities span an enormous range. A machined tolerance may be a few thousandths of a millimetre, a building may weigh thousands of tonnes, an electrical signal may be a few microvolts and a power station may produce hundreds of megawatts. Writing and calculating with such numbers by hand is error-prone, which is why engineers use powers of ten, scientific notation and SI prefixes. Powers also appear inside the relationships that matter most in design: kinetic energy rises with the square of speed, beam stiffness with the cube of depth, fan power with the cube of speed and radiated heat with the fourth power of absolute temperature.

These relationships explain many practical surprises. A forklift travelling 50% faster carries more than twice the energy into a collision. A beam made 50% deeper becomes more than three times stiffer. A fan slowed by 20% uses about half the power. Converting square metres to square millimetres is not a matter of multiplying by 1,000. Understanding powers and roots turns these facts from surprises into tools.

This article explains the index laws, negative, zero and fractional powers, scientific and engineering notation, SI prefixes, converting squared and cubed units and the powerful effect of squares and cubes in physical relationships, with worked examples and checks.

## Powers and the index laws

A **power** or **index** shows repeated multiplication: 10³ means 10 × 10 × 10 = 1,000, and a⁴ means a × a × a × a. The **index laws** follow directly:

- **Multiplying powers of the same base adds the indices**: a³ × a² = a⁵.
- **Dividing subtracts the indices**: a⁵ ÷ a² = a³.
- **A power of a power multiplies the indices**: (a²)³ = a⁶.
- **A power of a product applies to each factor**: (a × b)² = a² × b².

These rules make calculations with powers of ten especially easy: 10⁶ × 10³ = 10⁹, and 10⁶ ÷ 10⁹ = 10⁻³.

## Zero, negative and fractional powers

The index laws extend naturally:

- **Any non-zero number to the power zero is 1**: a⁰ = 1, because a³ ÷ a³ = a⁰ = 1.
- **A negative power is a reciprocal**: a⁻² = 1 ÷ a², so 10⁻³ = 0.001.
- **A fractional power is a root**: a^(1/2) is the square root of a, and a^(1/3) the cube root. A power such as a^(3/2) means the square root of a, cubed.

Fractional powers appear in many engineering formulas and in spreadsheet functions, where =A1^(1/3) calculates a cube root.

## Roots

The **square root** of a number is the value that, multiplied by itself, gives the number: √81 = 9. The **cube root** of 27 is 3. Roots undo powers, and they appear whenever a formula is rearranged to solve for a squared or cubed quantity, such as finding a diameter from an area or a side length from a volume.

Estimating roots helps catch errors. Since 7² = 49 and 8² = 64, the square root of 55 lies between 7 and 8, a little closer to 7. Since 4³ = 64 and 5³ = 125, the cube root of 100 lies between 4 and 5.

## Scientific notation

**Scientific notation** writes a number as a value between 1 and 10 multiplied by a power of ten. The speed of light is about 3.00 × 10⁸ m/s; the thickness of a typical coating might be 5.0 × 10⁻⁵ m. Scientific notation makes very large and very small numbers compact, shows the number of significant figures clearly and simplifies multiplication and division:

(3.0 × 10⁸) × (2.0 × 10⁻³) = 6.0 × 10⁵

Calculators enter powers of ten with a key often labelled EXP or EE. A common error is to type "× 10 EXP 3" for 10³, which gives 10⁴. On most calculators, 10³ is entered as 1 EXP 3.

## Engineering notation and SI prefixes

**Engineering notation** uses powers of ten that are multiples of three, matching the SI prefixes:

- giga (G) = 10⁹
- mega (M) = 10⁶
- kilo (k) = 10³
- milli (m) = 10⁻³
- micro (µ) = 10⁻⁶
- nano (n) = 10⁻⁹

Thus 47,000 ohms is 47 × 10³ ohms or 47 kΩ, and 0.000 22 farads is 220 × 10⁻⁶ F or 220 µF. Prefixes make quantities easier to read and say, but they must be used carefully: a lower-case m means milli, an upper-case M means mega, a factor of a billion apart. The [SI units and calculation checking](/insights/si-units-and-calculation-checking/) article explains unit discipline and prefixes in more detail.

## Squared and cubed units

When units are squared or cubed, so are their conversion factors. Because 1 m = 1,000 mm:

- 1 m² = 1,000 × 1,000 mm² = 10⁶ mm²
- 1 m³ = 1,000 × 1,000 × 1,000 mm³ = 10⁹ mm³

A painted area of 2,400,000 mm² is 2.4 m², not 2,400 m². A tank measuring 1.2 m × 0.8 m × 0.6 m holds 0.576 m³, and since 1 m³ is 1,000 litres, that is 576 litres. Errors in area and volume conversions are among the most common in quantity estimates, especially in spreadsheets where dimensions are entered in millimetres and results reported in square or cubic metres.

## When the square matters: energy and speed

Kinetic energy is E = ½ × m × v², where m is mass and v speed. Because speed is squared, energy rises much faster than speed. Raising speed by 50% multiplies energy by 1.5², or 2.25. That has direct safety consequences: a forklift, vehicle or moving machine part travelling only modestly faster carries far more energy into a collision, needs more distance to stop and causes more damage. Speed limits in workplaces and guards on fast-moving machinery reflect this square law.

Aerodynamic drag and fluid friction also rise roughly with the square of speed, which is why fuel use climbs at higher road speeds and pressure losses in pipes and ducts rise steeply with flow.

## When the cube matters: stiffness and fan power

The bending stiffness of a rectangular beam depends on its second moment of area, which for a rectangle is proportional to the width multiplied by the cube of the depth. Making a beam 50% deeper multiplies its stiffness by 1.5³, or about 3.4, while making it 50% wider only multiplies stiffness by 1.5. This is why beams are deep rather than wide and why I-sections put material far from the centre. The [structural steel sections and grades](/insights/structural-steel-sections-and-grades/) article explains how standard sections use this effect.

For fans and centrifugal pumps, power varies approximately with the cube of speed. Reducing speed by 20% reduces power to about 0.8³, or roughly half. The cube law makes variable-speed control one of the most effective energy savings in industry, as described in the [pipe flow, pressure drop and pump selection](/insights/pipe-flow-pressure-drop-and-pumps/) article.

## When the fourth power matters: radiated heat

The heat radiated by a hot surface rises with the fourth power of its absolute temperature, measured in kelvin. A surface at 80 °C (353 K) radiates about (353 ÷ 293)⁴, or roughly 2.1 times as much as one at 20 °C (293 K), and the difference grows rapidly at higher temperatures. Insulating hot surfaces such as furnaces, ovens and steam pipes therefore saves far more energy than their modest temperatures might suggest, and it also protects people from burns.

## Scales built on powers: decibels and pH

Some quantities vary over such huge ranges that they are measured on scales built from powers of ten. Sound levels in **decibels** compare sound intensity with a reference using a logarithmic scale: every increase of 10 dB represents ten times the sound intensity, and an increase of 3 dB roughly doubles it. Two identical machines running together are about 3 dB louder than one, not twice as loud in decibels. Workplace noise exposure standards are expressed in decibels, so understanding the scale matters when assessing whether hearing protection is needed or whether a quieter machine will make a noticeable difference.

The **pH** scale for acidity works similarly: each step of one pH unit represents a tenfold change in hydrogen ion concentration. A solution at pH 3 is ten times more acidic than one at pH 4 and a hundred times more acidic than one at pH 5. Small changes in pH readings in cleaning, water treatment and food processes can therefore represent large chemical changes.

## Powers of two

Computers work in binary, so powers of two appear throughout digital technology. Memory and storage sizes are built from powers of two: 2¹⁰ is 1,024, close to a thousand. Some software reports storage in units based on 1,024 while manufacturers use 1,000, which is why a drive sold as one terabyte appears smaller when connected. The difference is small for a kilobyte but grows with each prefix, reaching about 10% at the terabyte level. Specifying storage and network capacities carefully avoids misunderstandings when buying equipment or services.

## Doubling, halving and quick checks

Powers make useful rules of thumb. Ten doublings multiply a quantity by about a thousand, since 2¹⁰ is 1,024. A quantity growing by 7% a year roughly doubles in ten years. In a square law, halving a quantity quarters its effect rather than halving it, and in a cube law it reduces the effect to one eighth: halving the depth of a beam reduces its stiffness to one eighth, and halving the speed of a fan cuts its power to about one eighth. Keeping a few of these relationships in mind lets engineers spot implausible results in seconds.

## Orders of magnitude

An **order of magnitude** is a factor of ten. Estimating the order of magnitude of an answer before calculating it, for example "this tank should hold a few hundred litres, not a few thousand", catches decimal point and unit errors immediately. Engineers often do quick calculations to the nearest power of ten to test whether an idea is feasible before investing time in detailed analysis.

## Significant figures with scientific notation

Scientific notation shows precision clearly. Writing 1.20 × 10³ indicates three significant figures, while 1,200 is ambiguous about whether the zeros are significant. Results should not be reported with more significant figures than the least precise input justifies. A calculation using a measured length of 2.4 m and a load of 1,500 N should not report a result to seven figures.

## A worked example

This is an illustrative example. The site and figures are hypothetical.

A warehouse manager is reviewing forklift speed limits after a near miss. The forklifts weigh about 4,000 kg loaded. At 10 km/h (about 2.78 m/s), the kinetic energy is ½ × 4,000 × 2.78², or roughly 15,400 J. At 15 km/h (about 4.17 m/s), it is roughly 34,700 J, about 2.25 times as much. A 50% increase in speed more than doubles the energy that must be absorbed in a collision and increases stopping distance accordingly.

The same review looks at a racking upgrade. The engineer proposes replacing 100 mm deep beams with 150 mm deep beams of the same width. Because stiffness rises with the cube of depth, the deeper beams are about (150 ÷ 100)³, or 3.4 times, as stiff, reducing deflection under the same load to less than a third. The manager uses both results to explain the changes to the team: lower speed limits in pedestrian areas, and stiffer beams that reduce sagging and the risk of pallets dislodging.

## How this applies to a small Australian business

- **Use SI prefixes and engineering notation** consistently in drawings, reports and spreadsheets.
- **Square or cube conversion factors** for area and volume units.
- **Remember the square law for speed**, when setting speed limits and guarding.
- **Use the cube law** when considering fan and pump speed control.
- **Insulate hot surfaces**, because radiated heat rises steeply with temperature.
- **Estimate the order of magnitude** before trusting a calculated answer.

## Common mistakes

- **Converting m² to mm² by multiplying by 1,000.**
- **Typing "× 10 EXP n"** on a calculator.
- **Confusing m (milli) with M (mega).**
- **Assuming energy rises in proportion to speed.**
- **Widening beams to stiffen them** when deepening would be far more effective.
- **Reporting results with false precision.**
- **Adding decibel values arithmetically** instead of on their logarithmic scale.

## Frequently asked questions

**Why is 10⁰ equal to 1?** Because dividing a power by itself gives 1, and the index law for division subtracts equal indices to give zero.

**What is the difference between scientific and engineering notation?** Scientific notation uses a coefficient between 1 and 10 with any power of ten; engineering notation uses powers that are multiples of three, matching SI prefixes.

**Why do temperatures need to be in kelvin for radiation calculations?** Because radiation depends on absolute temperature. Using degrees Celsius gives meaningless results, especially near zero.

## Questions to ask

- Do our spreadsheets convert squared and cubed units correctly?
- Are SI prefixes used consistently in our documents?
- Do our speed limits and guards reflect the energy of moving equipment?
- Which fans and pumps could save energy through speed control?
- Which hot surfaces on our site are uninsulated?

## Bringing it together

Powers and roots compress large and small numbers and govern some of the most important physical relationships in engineering. The index laws, negative and fractional powers, scientific and engineering notation and SI prefixes make calculations manageable. Squared and cubed units need squared and cubed conversion factors. Energy rises with the square of speed, beam stiffness with the cube of depth, fan power with the cube of speed and radiated heat with the fourth power of absolute temperature. Estimating orders of magnitude and reporting sensible precision keep calculations honest.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
