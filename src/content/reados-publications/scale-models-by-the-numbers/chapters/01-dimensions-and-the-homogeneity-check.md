---
book: scale-models-by-the-numbers
chapterSlug: dimensions-and-the-homogeneity-check
order: 1
title: "Dimensions, units and the homogeneity check"
description: "Express engineering quantities in mass, length and time, check any formula or spreadsheet for dimensional consistency, and find the hidden constants in unit-specific formulas."
draft: false
---

Every quantity an engineer calculates has a size and a kind. The size depends on the units: a pipe bore is 600 in millimetres and 0.6 in metres. The kind does not: the bore is a length whatever it is measured in. Dimensional analysis works with the kind. It strips each quantity down to its dimensions, the powers of mass, length and time it is built from, and asks whether an equation makes sense before any number goes into it.

That one question does a surprising amount of work. It catches unit errors in spreadsheets, exposes formulas that only work in one set of units, and, as Chapter 2 shows, tells you which combinations of variables a model test must reproduce. This chapter sets out the dimensions of the quantities used throughout the book, the rule of dimensional homogeneity, and the habit of checking every formula against it. It applies them to the PS-3 pump station's design figures and ends with a Froude number that changed by a factor of 32 when someone changed the units.

## Base dimensions and derived quantities

The SI defines seven base quantities. Mechanics and fluid flow need only three of them: mass (written M), length (L) and time (T). Heat transfer adds temperature (Θ). Every other mechanical quantity is a product of powers of these three, and its dimensions follow from its definition.

Velocity is a length divided by a time, so its dimensions are L T⁻¹. Acceleration is velocity per unit time, L T⁻². Force is mass times acceleration, M L T⁻². Pressure is force per unit area, M L T⁻² ÷ L², which is M L⁻¹ T⁻². Power is force times velocity, M L² T⁻³. None of these needs memorising: each can be rebuilt in a few seconds from a definition that every engineer knows.

```figure
type: compare
title: Dimensions of the quantities used in this book
rowhead: Quantity
cols: Symbol | SI unit | Dimensions
caption: Built from definitions: force = mass × acceleration, pressure = force ÷ area, power = force × velocity, dynamic viscosity = shear stress ÷ velocity gradient, surface tension = force ÷ length. Angles and ratios of like quantities are dimensionless.
- Length, head, diameter | L, H, D | m | L
- Velocity | V | m/s | L T⁻¹
- Volume flow | Q | m³/s | L³ T⁻¹
- Gravitational acceleration | g | m/s² | L T⁻²
- Density | ρ | kg/m³ | M L⁻³
- Pressure | p | Pa | M L⁻¹ T⁻²
- Power | P | W | M L² T⁻³
- Dynamic viscosity | μ | Pa·s | M L⁻¹ T⁻¹
- Kinematic viscosity | ν = μ ÷ ρ | m²/s | L² T⁻¹
- Surface tension | σ | N/m | M T⁻²
- Rotational speed | n, ω | rev/s, rad/s | T⁻¹
```

Two entries deserve a comment. Kinematic viscosity, the ratio of dynamic viscosity to density, has lost its mass dimension and has the same dimensions as a length times a velocity. That is why it turns up wherever a Reynolds number does, in Chapter 5. Surface tension, a force per unit length, has dimensions M T⁻²: it is the same kind of quantity as an energy per unit area, which is how physicists usually think of it, and why it matters for the small air-entraining vortices of Chapter 6.

Rotational speed is a frequency, T⁻¹, whether it is quoted in revolutions per minute or radians per second. The factor of 2π between revolutions and radians is a pure number, and the factor of 60 between minutes and seconds is a change of unit, not of dimension. Both are common sources of error, because neither shows up in a dimensional check.

## The rule of dimensional homogeneity

A physically correct equation is dimensionally homogeneous: every term that is added, subtracted or equated has the same dimensions. You can add a head to a head, or a pressure to a pressure, but never a head to a pressure. The rule also applies to the arguments of functions. The logarithm, the exponential and the trigonometric functions can only take pure numbers, because their series expansions add together powers of the argument, and powers of a dimensioned quantity cannot be added.

The rule has a useful consequence. If an equation is homogeneous, it holds in any consistent set of units, because changing the unit of length multiplies every term by the same power of the conversion factor. If it is not homogeneous, its answer depends on the units used, and it is either wrong or valid only in the particular units its author had in mind.

```figure
type: steps
title: Checking a formula for dimensional homogeneity
caption: The check takes a minute and catches most transcription and unit errors. It cannot catch a wrong pure number, such as a missing factor of 2 or 2π, or a mix-up of revolutions and radians.
- List every symbol | Write the dimensions of each quantity in M, L, T (and Θ if temperature appears)
- Simplify each term | Multiply and divide the dimensions within each term separately
- Compare terms | Every term added, subtracted or equated must come out the same
- Check function arguments | The argument of every log, exp, sin or power with a non-integer exponent should be dimensionless
- Test by changing units | Recalculate in different units; a homogeneous formula gives the same physical answer
- Record the result | Note in the calculation which formulas were checked and in what units any constants apply
```

## The PS-3 design figures, checked

The first job in the PS-3 model study is to check the design figures the station's designer supplied. This is an illustration. Each duty pump delivers Q = 0.45 m³/s against a head of H = 18 m with an efficiency of η = 82%, and the designer's sheet gives the shaft power as P = ρ g Q H ÷ η.

The dimensional check is quick. ρ g Q H has dimensions (M L⁻³)(L T⁻²)(L³ T⁻¹)(L) = M L² T⁻³, which is power; the efficiency is a ratio of two powers and has no dimensions. The formula is homogeneous. With water at 20 °C, ρ = 998.2 kg/m³ from the NIST WebBook, and g = 9.80665 m/s²:

P = 998.2 × 9.80665 × 0.45 × 18 ÷ 0.82 = 96,696 W, or **96.7 kW**.

The velocity at the 600 mm bellmouth follows from V = Q ÷ A, which is (L³ T⁻¹) ÷ L² = L T⁻¹, as it should be. The bellmouth area is π × 0.6² ÷ 4 = 0.28274 m², so V = 0.45 ÷ 0.28274 = **1.592 m/s**. The approach channel, 4.0 m wide and 1.8 m deep at the lowest level, carries the two duty pumps' 0.90 m³/s at 0.90 ÷ (4.0 × 1.8) = **0.125 m/s**.

```figure
type: formula
title: Pump shaft power, checked for dimensions
formula: P = ρ × g × Q × H ÷ η
caption: Every term is checked before the numbers go in. The efficiency is a ratio of powers and carries no dimensions, so the right-hand side has the dimensions of power.
- ρ | density, kg/m³, M L⁻³
- g | gravitational acceleration, m/s², L T⁻²
- Q | volume flow, m³/s, L³ T⁻¹
- H | pump head, m, L
- η | efficiency, dimensionless
step: Dimensions: (M L⁻³)(L T⁻²)(L³ T⁻¹)(L) = M L² T⁻³, a power
step: Numbers: 998.2 × 9.80665 × 0.45 × 18 = 79,291 W of water power
step: Shaft power: 79,291 ÷ 0.82 = 96,696 W = 96.7 kW per duty pump
```

## Hidden constants in unit-specific formulas

Many formulas in handbooks and on data sheets are written for particular units, with the conversion factors folded into a constant. A familiar one for water pumps is P = Q × H ÷ (102 × η), with P in kilowatts, Q in litres per second and H in metres. It gives the right answer, 450 × 18 ÷ (102 × 0.82) = 96.8 kW, but it is not homogeneous: it seems to say that a power equals a flow times a length, which is impossible.

The explanation is that the constant 102 is not a pure number. It stands for 1,000 ÷ (ρ g ÷ 1,000), with the density of water, the gravitational acceleration and two unit conversions folded into it, and it therefore carries dimensions and units of its own. Writing it out restores homogeneity and shows the formula's limits: it applies only to water, only near the density assumed, and only in kilowatts, litres per second and metres. Used for a pump moving a brine of density 1,200 kg/m³, it still gives 96.8 kW when the true figure is 96.8 × 1,200 ÷ 998.2 = 116.4 kW, about 17% low.

Empirical formulas fitted to test data often carry dimensioned coefficients in the same way. The Hazen–Williams formula for water pipes, still common in water supply work, relates velocity to the hydraulic radius raised to the power 0.63 and the friction slope to the power 0.54. Those exponents do not make a homogeneous equation, so its roughness coefficient C quietly carries dimensions of L^0.37 T⁻¹, and the formula comes in different versions with different constants for SI and US customary units. It also assumes water at ordinary temperatures, because viscosity does not appear in it at all. None of that makes it useless within its range, but it does mean it cannot be scaled to a model, a different fluid or a different temperature, which is exactly what this book needs to do. Chapter 8 returns to the friction factor, which is dimensionless and can be scaled.

Unit-specific formulas are not wrong, but they should be recognised for what they are. A good practice is to note beside each one the units it requires and what its constants contain. A better one, wherever a formula feeds a model study or a design decision, is to use the homogeneous form and let the units take care of themselves.

## Ratios and pure numbers

Some quantities are dimensionless because they are ratios of like quantities. Efficiency is a ratio of powers, a slope is a ratio of lengths, and strain is a change of length per unit length. Others are dimensionless because they are ratios of unlike quantities that happen to cancel, and these are the ones that matter for scaling.

The Froude number, for example, compares a velocity with the speed of a gravity wave on a depth or length D. It is written Fr = V ÷ √(g D). Its dimensions are (L T⁻¹) ÷ (L T⁻² × L)^½ = (L T⁻¹) ÷ (L T⁻¹), which cancel. For the PS-3 bellmouth, Fr = 1.592 ÷ √(9.80665 × 0.6) = **0.656**. That number means the same thing in any units, and Chapter 4 shows that a model which reproduces it reproduces the effect of gravity on the flow.

Angles are dimensionless too, as a ratio of arc length to radius, and so is the swirl angle that model studies measure in a pump's suction pipe. Quantities that are dimensionless but not ratios of like quantities, such as a Reynolds number, need more care in reporting, because their value depends on which length and velocity were chosen to define them. A Reynolds number based on the bellmouth diameter is not the same as one based on the submergence. The definition must always be stated.

## The error: a Froude number that depended on units

This is an illustration. The modelling laboratory's first planning spreadsheet for PS-3 contained a column headed "Froude number" calculated as V ÷ √D, with the velocity in metres per second and the diameter in metres. For the prototype bellmouth it gave 1.592 ÷ √0.6 = 2.055, and for the model at 1:6 scale it gave a different value. The spreadsheet's author concluded that the model did not reproduce the prototype's Froude number and proposed to increase the model flow to match.

The reviewing engineer ran the last check in the procedure above. They recalculated the prototype value in millimetres per second and millimetres: 1,591.5 ÷ √600 = 65.0, about 32 times the previous value. A true dimensionless number cannot change when the units change. The factor between the two answers, √1000 = 31.6, pointed directly at a square root of a length that had not been cancelled, and the missing term was g. With it restored, Fr = V ÷ √(g D) gives 0.656 for the prototype in any units, and the 1:6 model at its Froude-scaled flow gives exactly the same value, as Chapter 4 shows.

```figure
type: compare
title: The spreadsheet Froude number against the correct one
rowhead: Calculation
cols: Metres and seconds | Millimetres and seconds | Same in any units?
caption: The incorrect form changed by a factor of √1000 when the unit of length changed, which exposed the missing g. The correct form is the same in any consistent units and equal in prototype and model.
- Spreadsheet V ÷ √D, prototype | 2.055 | 65.0 | No
- Correct V ÷ √(g D), prototype | 0.656 | 0.656 | Yes
- * Correct V ÷ √(g D), 1:6 model at Froude-scaled flow | 0.656 | 0.656 | Yes
```

The proposed increase in model flow would have run the model 2.45 times too fast and made every vortex in it unrepresentative. The fix was one term. The laboratory's practice changed as well: every derived quantity in its planning sheets now carries its dimensions in the column heading, and every dimensionless group is recalculated once in a second set of units before the sheet is used.

## What dimensional analysis cannot catch

The homogeneity check is powerful but blind to pure numbers. It cannot tell whether a factor of ½ is missing from a kinetic energy, whether a rotational speed in revolutions per second has been used where radians per second were needed, or whether an efficiency has been entered as 82 instead of 0.82. Each of those errors is dimensionally invisible and must be caught another way: by checking against a known case, by comparing with a measurement or a data sheet, or by asking whether the answer is the right order of magnitude.

The PS-3 shaft power is a good example of the last test. A pump moving 0.45 m³/s against 18 m does about 79 kW of useful work on the water, and no pump does that with less input power. A sheet showing 0.97 kW, the result of entering the efficiency as 82, fails the order-of-magnitude test immediately. One showing 79.3 kW has left out the efficiency altogether, and fails a comparison with the motor rating. Dimensional checks, known cases and magnitudes work together.

## How this applies to a small Australian business

A fabricator, consultancy or test lab does not need a formal method to benefit from this chapter. It needs two habits. The first is to write the units beside every input and result in a calculation, and the dimensions beside every formula that came from a handbook or a supplier. The second is to recalculate any dimensionless number once in different units before relying on it. Both take minutes. Unit errors in pump, fan and flow calculations are among the commonest in engineering spreadsheets, and the cost of finding one after equipment has been ordered is far higher than the cost of the check.

## Exercise: the storage tank outlet

PS-3's 6.0 m diameter storage tank empties into the wet well through a 300 mm outlet with a discharge coefficient of 0.6. The outlet flow at a head h above it is often written Q = C_d × A × √(2 g h). Check that this formula is dimensionally homogeneous, then find the outflow when the tank is full to 3.0 m above the outlet, in cubic metres per second and in litres per minute.

**Worked answer.** C_d is a ratio of flows and is dimensionless. A has dimensions L², and √(2 g h) has dimensions (L T⁻² × L)^½ = L T⁻¹, a velocity; the factor 2 is a pure number. The product is L² × L T⁻¹ = L³ T⁻¹, a volume flow, so the formula is homogeneous.

The outlet area is π × 0.3² ÷ 4 = 0.070686 m². The ideal jet velocity is √(2 × 9.80665 × 3.0) = 7.672 m/s. The outflow is Q = 0.6 × 0.070686 × 7.672 = **0.3253 m³/s**, or 0.3253 × 60,000 = **19,520 L/min**. Chapter 4 calculates the same flow with the [orifice flow tool](/tools/orifice-flow/) and scales it to the model.
