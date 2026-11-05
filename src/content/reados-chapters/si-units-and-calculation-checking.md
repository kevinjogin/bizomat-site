---
title: "SI units and calculation checking: keeping engineering numbers honest"
description: "How SI units and prefixes work, the unit traps that cause real failures, consistent unit sets for engineering, sensible precision and a practical routine for checking calculations and spreadsheets."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - systems
author: "BIZOMAT"
featured: false
draft: false
---

Engineering errors are rarely caused by difficult mathematics. They are far more often caused by simple things: a pressure in bar treated as megapascals, a mass in kilograms used where a force in newtons belonged, a torque in newton-millimetres read as newton-metres, a spreadsheet cell that quietly referenced the wrong row, or an answer reported to six significant figures when the inputs were rough estimates. These errors are easy to make, easy to miss and occasionally very expensive.

Two widely reported incidents show what can happen. In 1999, NASA's Mars Climate Orbiter was lost after one team's software produced results in imperial units while another team's software expected metric units, and the mismatch went undetected. In 1983, an Air Canada aircraft ran out of fuel in flight after a fuel load calculation confused pounds and kilograms during a period when the airline was converting to metric units; the crew glided the aircraft to a safe landing. Neither failure involved complex physics. Both involved units and checking.

This article explains, in general terms, how the International System of Units (SI) is structured, how to write units correctly, the unit traps most common in engineering work, how to choose a consistent set of units, how much precision to report and a practical routine for checking calculations and spreadsheets. It is general information for engineers, technicians, designers and anyone who works with technical numbers.

## The SI in brief

The **International System of Units** is the modern metric system and the legal basis for measurement in Australia. It defines seven **base units**:

| Quantity | Unit | Symbol |
|---|---|---|
| Length | metre | m |
| Mass | kilogram | kg |
| Time | second | s |
| Electric current | ampere | A |
| Thermodynamic temperature | kelvin | K |
| Amount of substance | mole | mol |
| Luminous intensity | candela | cd |

All other units are **derived** from these. Common engineering examples include:

- the **newton** (N), the unit of force, equal to one kilogram metre per second squared;
- the **pascal** (Pa), the unit of pressure or stress, equal to one newton per square metre;
- the **joule** (J), the unit of energy, equal to one newton metre;
- the **watt** (W), the unit of power, equal to one joule per second; and
- the **newton metre** (N·m), used for torque.

### Prefixes

Prefixes scale units by powers of ten: kilo (k, 10³), mega (M, 10⁶), giga (G, 10⁹), milli (m, 10⁻³), micro (µ, 10⁻⁶) and nano (n, 10⁻⁹) are the most common in engineering. Case matters: "M" is mega and "m" is milli, so 1 MPa and 1 mPa differ by a factor of a billion.

### Writing units correctly

A few conventions prevent ambiguity:

- Leave a space between the number and the unit: 25 mm, not 25mm.
- Use the correct case: kg, not Kg; kN, not KN; mm, not MM.
- Do not add an "s" to symbols: 5 kg, not 5 kgs.
- Use a raised dot or a space between units in products, such as N·m, and a solidus or negative exponent for division, such as m/s or m·s⁻¹.
- Write temperature in degrees Celsius with the degree sign (20 °C), but temperature differences can also be expressed in kelvin.

## Consistent unit sets

The safest way to avoid unit errors in calculations is to use a **consistent set of units**, in which every derived unit follows directly from the base units without conversion factors. Two sets are common in mechanical engineering:

| Quantity | SI base set | Engineering millimetre set |
|---|---|---|
| Length | m | mm |
| Force | N | N |
| Stress and pressure | Pa (N/m²) | MPa (N/mm²) |
| Moment and torque | N·m | N·mm |
| Mass | kg | tonne (t) |
| Density | kg/m³ | t/mm³ |
| Modulus of elasticity | Pa | MPa |

```figure
type: balance
title: Two consistent unit sets
left: SI base set
right: Millimetre set
caption: Pick one set and stay in it; 1 MPa is exactly 1 N/mm².
- m, N, Pa, N·m, kg | mm, N, MPa, N·mm, tonne
- Common in physics and fluids | Common in mechanical design
```

The millimetre set is popular in mechanical design because drawings use millimetres and 1 MPa equals exactly 1 N/mm². Using it consistently means a stress in MPa follows directly from a force in newtons divided by an area in square millimetres. Mixing sets, for example using metres in one formula and millimetres in another, is a common source of errors by factors of a thousand or a million.

Finite element and simulation software usually does not know which unit system you intend; it simply uses the numbers you enter. Choosing and documenting a consistent set before building a model is essential.

## The most common unit traps

### Mass and force

A kilogram is a unit of mass, not force. The weight of a mass of 1 kg under standard gravity is about 9.81 N. Load ratings expressed in kilograms are really describing the mass that can be supported, and calculations of stress, torque or power need forces in newtons. Older units such as kilogram-force (kgf) add to the confusion.

### Pressure

Pressure appears in many units: pascal, kilopascal, megapascal, bar and pounds per square inch. Useful relationships include:

- 1 bar = 100 kPa = 0.1 MPa;
- 1 MPa = 10 bar = 1 N/mm²; and
- 1 psi is about 6.895 kPa.

Also distinguish **gauge pressure**, measured relative to the atmosphere, from **absolute pressure**, measured relative to a vacuum. Gas calculations generally need absolute pressure.

### Torque and moment

Torque in newton-metres and newton-millimetres differs by a factor of 1,000. Torque specifications from overseas suppliers may use pound-feet or pound-inches, which differ by a factor of 12.

### Rotational speed

Revolutions per minute must be converted to radians per second for many dynamic calculations: multiply by 2π and divide by 60.

### Flow and volume

Flow rates appear in litres per minute, cubic metres per hour and cubic metres per second. One cubic metre per hour is about 16.67 litres per minute.

### Imperial conversions

Some conversions are exact by definition, such as 1 inch = 25.4 mm and 1 pound (mass) = 0.45359237 kg. Others are rounded values, such as 1 pound-force being about 4.448 N and 1 mechanical horsepower being about 745.7 W. Using rounded factors is fine for most engineering work, but be aware of when accuracy matters.

## Precision and significant figures

A calculation can never be more precise than its inputs. If a load is estimated as "about 5 kN" and a material strength is taken from a typical value, reporting a result as 47.3826 MPa implies a precision that does not exist and can mislead decisions. Practical habits include:

- carrying full precision through intermediate steps to avoid rounding errors;
- rounding the final answer to a precision consistent with the least precise input;
- stating key assumptions and their uncertainty; and
- distinguishing between **precision**, how finely a number is stated, and **accuracy**, how close it is to the truth.

On drawings, the number of decimal places often implies a tolerance, so dimensions should be stated with the precision that matters. The [setting up CAD drawings with consistent units](/reados/collections/cad-drafting-and-drawing-standards/setting-up-cad-drawings-with-consistent-units/) article covers unit settings and dimension precision in CAD.

## A routine for checking calculations

Most calculation errors are caught by simple, disciplined checks rather than by repeating the same calculation the same way. A practical routine includes:

1. **Carry units through every step.** Writing units alongside numbers in each line exposes inconsistencies immediately.
2. **Check dimensions.** Confirm that the units of the result match the quantity calculated. A stress should come out in pascals or megapascals, not newtons.
3. **Estimate the order of magnitude first.** A quick mental estimate tells you whether the answer should be tens, thousands or millions.
4. **Test limiting cases.** What happens if a load is zero, a length doubles or a radius becomes very large? The result should behave sensibly.
5. **Compare with known results.** Use published tables, previous designs or simple standard cases.
6. **Use an independent method.** Check a hand calculation with software, or software with a hand calculation, rather than repeating the same method.
7. **Have someone else check.** An independent checker who did not do the work catches errors the author cannot see.
8. **Record the check.** Note who checked, what was checked and the outcome.

## Calculation sheets that others can check

A calculation is only as useful as its record. A calculation that cannot be followed by someone else cannot be checked, reused or defended later. A good calculation sheet, whether handwritten, in a spreadsheet or in mathematical software, usually includes:

- a title, project, revision and date;
- the purpose of the calculation and the decision it supports;
- the design basis: loads, codes or standards applied, material properties and their sources;
- assumptions, clearly listed, including simplifications and their justification;
- a sketch or diagram showing geometry, loads and supports;
- the calculation itself, with units on every line;
- the result, compared with the acceptance criterion; and
- the name of the person who prepared it and the person who checked it.

Keeping calculations with the drawings and models they support, under the same revision control, means a later change can be assessed against the original basis rather than recalculated from scratch.

## Spreadsheets need checking too

Spreadsheets are powerful and error-prone. Common problems include formulas that reference the wrong cells, hard-coded numbers hidden inside formulas, units that are not labelled, copied formulas that drift and old versions circulating after updates. Good practices include:

- labelling every input with its unit and source;
- separating inputs, calculations and outputs;
- avoiding hard-coded numbers inside formulas;
- protecting calculation cells from accidental change;
- testing the spreadsheet against a hand calculation for a known case; and
- controlling versions, so that everyone uses the current, checked file.

## A worked example

This is an illustrative example. The figures are hypothetical.

A designer needs the extending force of a hydraulic cylinder with an 80 mm bore at a system pressure of 150 bar.

**Consistent units.** Using the millimetre set, the piston area is π × 40², which is about 5,026.5 mm². The pressure is 150 bar, which is 15 MPa, or 15 N/mm². The force is 5,026.5 mm² × 15 N/mm², which is about 75,400 N, or about 75.4 kN.

**A tempting error.** Multiplying 150 by 5,026.5 without converting units gives about 754,000, a number ten times too large if read as newtons. Writing units on every line exposes the problem immediately: bar multiplied by square millimetres is not a newton.

```figure
type: steps
title: Cylinder force with units on every line
caption: An 80 mm bore at 150 bar; skipping the bar-to-MPa step gives an answer ten times too large.
- Area | π × 40² ≈ 5,026.5 mm²
- Pressure | 150 bar = 15 MPa = 15 N/mm²
- Force | 5,026.5 × 15 ≈ 75,400 N
- *Check | about 7,700 kg equivalent: plausible
```

**Checking.** An order-of-magnitude check helps: a pressure of about 15 N/mm² acting on about 5,000 mm² gives about 75,000 N. The equivalent mass that the cylinder could lift, ignoring friction and other losses, is 75,400 ÷ 9.81, or about 7,700 kg, which is a plausible figure for a cylinder of this size.

The designer also needs the torque from a 5.5 kW motor running at 1,450 rev/min. The angular speed is 1,450 × 2π ÷ 60, or about 151.8 rad/s, so the torque is 5,500 W ÷ 151.8 rad/s, or about 36.2 N·m. A familiar shortcut, torque in newton-metres equals 9,550 multiplied by power in kilowatts divided by speed in revolutions per minute, gives the same result and provides an independent check.

## How this applies to a small Australian business

- **Choose a consistent unit set** for each type of work and state it on calculation sheets and models.
- **Write units on every line** of calculations.
- **Watch the common traps**: mass and force, bar and megapascals, newton-metres and newton-millimetres.
- **Report sensible precision.**
- **Check independently** and record the check.
- **Control spreadsheets** like any other engineering document.
- **Be careful with overseas data**, which may use imperial units or different conventions, such as commas as decimal separators.

## Common mistakes

- **Mixing millimetres and metres** within one calculation.
- **Using mass where force is needed.**
- **Confusing gauge and absolute pressure.**
- **Case errors in prefixes**, such as M and m.
- **False precision** in reported results.
- **Unchecked spreadsheets** with hidden constants.
- **Assuming software knows your units.**

## Frequently asked questions

**Is it acceptable to use bar in engineering work?** Bar is widely used for hydraulic and pneumatic pressures and is accepted for use alongside SI, but calculations are safer when pressures are converted to pascals or megapascals before combining with other quantities.

**Should we convert supplier data from imperial units?** Yes, convert it once, carefully, record the conversion and the source, and use the converted values consistently. Repeated conversions by different people introduce errors.

**How many significant figures should we report?** Usually two or three for engineering results based on typical inputs, unless the inputs are known more precisely and the decision depends on it.

## Questions to ask

- Which unit set do we use for each type of calculation and model, and is it stated?
- Do our calculation sheets show units on every line?
- Who checks our calculations, and how is the check recorded?
- Are our spreadsheets tested, labelled and version-controlled?
- How do we handle data supplied in imperial units?

## Bringing it together

The SI provides a coherent system of units, and using it consistently removes most of the conversion factors that cause errors. The common traps, mass and force, pressure units, torque units, rotational speed and imperial conversions, are well known and easily avoided with discipline. Carrying units through every step, estimating orders of magnitude, testing limiting cases, using independent methods and having calculations checked by someone else catch most of the remaining errors. As the incidents described above show, simple unit mistakes can have serious consequences, and simple checking habits prevent them. The [what engineering failures teach any business](/reados/collections/engineering-design-practice/what-engineering-failures-teach-a-business/) article draws wider lessons from failures of this kind.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
