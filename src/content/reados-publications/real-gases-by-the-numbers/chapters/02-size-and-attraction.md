---
book: real-gases-by-the-numbers
chapterSlug: size-and-attraction
order: 2
title: "Size and attraction: the van der Waals picture"
description: "Why molecules push the compressibility factor both ways, van der Waals constants for nitrogen from its critical point, the model in LN-1's pack, and a contents check it got wrong."
draft: false
---

Chapter 1 measured the departure from the ideal gas law with the compressibility factor and showed that, for nitrogen at room temperature, Z first dips below 1 and then climbs well above it as the pressure rises. A number from a table is enough to correct a contents calculation, but it does not say why the gas behaves that way, or what to expect from a gas, a pressure or a temperature that is not in the table. For that, engineers need a picture of what the molecules are doing.

The simplest useful picture is more than 150 years old. Johannes van der Waals proposed in 1873 that the ideal gas law fails for two reasons, and that each can be corrected with one constant. This chapter sets out his two corrections, finds the constants for nitrogen from its critical point, tests the model against NIST's data for LN-1's pack, uses it to explain the dip and the climb in Z, and ends with a contents check that trusted the model further than it deserved.

## Two things the ideal law leaves out

The ideal gas law treats molecules as points with no forces between them. Real molecules differ in two ways.

**They take up room.** Each molecule is a small object with a size of about a third of a nanometre, and two molecules cannot be in the same place. The space available for any one molecule to move in is therefore the container's volume less the room taken by all the others. When the gas is dilute, that excluded room is a tiny fraction of the volume and does not matter. When the gas is dense, it is a large fraction, the molecules collide with the walls more often than the ideal law expects, and the pressure is higher than ideal.

**They attract each other.** At distances of a few molecular diameters, molecules pull weakly on one another. A molecule deep in the gas is pulled equally in every direction, so the attraction cancels out. A molecule about to hit the wall has more neighbours behind it than in front, so it is pulled back slightly and strikes the wall with less force. The pressure is lower than ideal, by an amount that grows with the number of molecules near the wall and with the number pulling each one back, so with the square of the density.

The two effects pull in opposite directions. Which one wins depends on how dense the gas is and how hot, because a fast-moving molecule is less affected by a weak pull than a slow one.

## The van der Waals equation

Van der Waals wrote the two corrections into the ideal gas law for one mole of gas, with molar volume v:

p = R × T ÷ (v − b) − a ÷ v²

The constant **b** is the excluded volume per mole: the volume the molecules themselves deny to each other. Subtracting it from v makes the first term larger than the ideal R × T ÷ v, so it raises the pressure. The constant **a** measures the attraction: the term a ÷ v² lowers the pressure in proportion to the square of the density. With a = 0 and b = 0 the equation becomes the ideal gas law.

The equation can be read as a balance. The first term is the pressure the molecules would exert if they had size but no attraction. The second is the pressure their attraction takes away. The gauge reads the difference.

```figure
type: formula
title: The van der Waals equation of state
formula: p = R × T ÷ (v − b) − a ÷ v²
caption: The molar form. The first term is the push of molecules with size; the second is the pull of their attraction. Constants for nitrogen from its critical point.
- v | Molar volume, m³/mol
- b | Excluded volume, nitrogen 38.62 × 10⁻⁶ m³/mol
- a | Attraction constant, nitrogen 0.13676 Pa·m⁶/mol²
- R | Molar gas constant, 8.314462618 J/(mol·K)
```

## Constants from the critical point

The constants could be fitted to any set of data, but van der Waals' equation has a property that gives them directly. Every real gas has a **critical point**, a temperature above which it cannot be liquefied however hard it is compressed (Chapter 6). The van der Waals equation predicts such a point, and matching its prediction to the measured critical temperature T_c and pressure p_c gives:

- a = 27 × R² × T_c² ÷ (64 × p_c)
- b = R × T_c ÷ (8 × p_c)

For nitrogen, NIST gives the critical point as **126.192 K and 3.3958 MPa**. So:

- a = 27 × 8.3145² × 126.192² ÷ (64 × 3.3958 × 10⁶) = **0.13676 Pa·m⁶/mol²**;
- b = 8.3145 × 126.192 ÷ (8 × 3.3958 × 10⁶) = **38.62 × 10⁻⁶ m³/mol**, or 38.62 cm³ per mole.

The value of b can be checked against the size of a molecule. Divided by Avogadro's number, it is 6.41 × 10⁻²⁹ m³ per molecule. For hard spheres, the excluded volume works out at four times the molecules' own volume, which makes each nitrogen molecule a sphere about **0.31 nanometres** across. That is close to sizes found for nitrogen by entirely different methods, such as its viscosity, and it confirms that b really is about the size of the molecules.

## The model in LN-1's pack

This is an illustration. LN-1's pack, when full, holds nitrogen at 309.06 kg/m³, from NIST. One mole, 28.0134 g, then occupies v = 0.0280134 ÷ 309.06 = 9.064 × 10⁻⁵ m³. Putting that into the van der Waals equation at 15 °C:

- the excluded volume b is **43%** of the molar volume;
- the push of molecules with size, R × T ÷ (v − b), is **46.06 MPa**;
- the pull of attraction, a ÷ v², is **16.65 MPa**;
- the van der Waals pressure is 46.06 − 16.65 = **29.41 MPa**.

The real pressure is 30.1 MPa, and the ideal gas law, at the same density, would give only 26.43 MPa. The model gets most of the way from the ideal answer to the real one: it accounts for 3.0 MPa of the 3.7 MPa difference. It does so as the difference of two large numbers, which is why it cannot be expected to be precise.

```figure
type: balance
title: What sets the pressure in LN-1's full pack, by van der Waals
left: Raises the pressure, 46.06 MPa
right: Lowers the pressure, 16.65 MPa
tilt: left
caption: This is an illustration at NIST's density of 309.06 kg/m³ and 15 °C. The difference, 29.41 MPa, compares with 30.1 MPa measured and 26.43 MPa from the ideal law.
- Ideal push at this density, 26.43 MPa | Attraction, a ÷ v², 16.65 MPa
- Extra push from size, 19.63 MPa | 
```

## Why Z dips and then climbs

The same calculation at lower pressures shows the two effects changing places. At each of NIST's densities for nitrogen at 15 °C:

- at **5.1 MPa**, the excluded volume is 8% of v, the size term exceeds the ideal pressure by 0.47 MPa, and attraction takes away 0.63 MPa: attraction wins, and Z is below 1;
- at **10.1 MPa**, b is 16% of v, size adds 1.97 MPa, attraction takes 2.44 MPa: attraction still wins, narrowly;
- at **20.1 MPa**, b is 31% of v, size adds 8.57 MPa, attraction takes 8.76 MPa: nearly balanced;
- at **30.1 MPa**, b is 43% of v, size adds 19.63 MPa, attraction takes 16.65 MPa: size wins, and Z is well above 1.

The pattern is general. At low density, the attraction term grows with the square of the density while the size correction grows more slowly, so a gas below a certain temperature first becomes easier to compress than ideal. At high density, v − b becomes small, the size term grows without limit, and every gas eventually becomes much harder to compress than ideal. Van der Waals puts the crossover at somewhat different pressures from the real gas, but the shape is right, and it explains why the ideal law's error changes sign in Chapter 1's table.

```figure
type: compare
title: Van der Waals against NIST for nitrogen at 15 °C
rowhead: Real pressure, MPa
cols: Density from NIST, kg/m³ | b as share of v | Ideal pressure at that density, MPa | Van der Waals pressure, MPa | Van der Waals error
caption: Calculated with the constants from nitrogen's critical point. The model is low at every pressure here, by most at 10 to 15 MPa, but it follows the real gas's turn from below ideal to above it.
- 5.1 | 60.12 | 8% | 5.14 | 4.98 | −2.4%
- 10.1 | 118.39 | 16% | 10.13 | 9.66 | −4.4%
- 20.1 | 224.15 | 31% | 19.17 | 18.99 | −5.5%
- * 30.1 | 309.06 | 43% | 26.43 | 29.41 | −2.3%
```

## The Boyle temperature

At low density, the van der Waals equation can be expanded to show how Z first moves away from 1:

Z ≈ 1 + (b − a ÷ (R × T)) ÷ v

The bracket is the gas's **second virial coefficient**, B, the first correction to the ideal law. When the attraction term a ÷ (R × T) is larger than b, B is negative and Z starts below 1. When the gas is hot enough for b to win, B is positive and Z starts above 1. The temperature at which they balance, and the gas behaves ideally over a range of low pressures, is the **Boyle temperature**: a ÷ (R × b) in the van der Waals model, which works out at 27 ÷ 8 times the critical temperature.

For nitrogen, van der Waals predicts a Boyle temperature of 425.9 K, or 152.7 °C, and a second virial coefficient at 15 °C of −18.5 cm³/mol. NIST's data at 0.5 MPa give B = **−6.6 cm³/mol** at 15 °C, and B passes through zero at about **51.5 °C**. The model has the sign right and the trend right, but it overstates the attraction at room temperature by a factor of almost three. That is the honest summary of van der Waals for engineering: it explains the shape of real-gas behaviour, and it gives estimates within a few per cent at the densities of a cylinder, but it is not a source of design numbers when better data exist.

## Where van der Waals is useful

Four uses survive in modern engineering.

- **Explaining behaviour.** Why Z dips and climbs, why gases cool in some expansions (Chapter 5), why a gas has a critical point (Chapter 6). The model is the shortest route to each.
- **Checking orders of magnitude.** A van der Waals estimate of contents, within a few per cent, is enough to catch a gross error, such as Chapter 1's ideal-gas plan.
- **A starting point.** The cubic equations of state used in process simulators, such as those of Redlich and Kwong, Soave and Peng and Robinson, are van der Waals' equation with improved attraction terms. They share its structure and its use of the critical point.
- **Corresponding states.** The model predicts that all gases behave alike when their pressure and temperature are measured as fractions of their critical values. Chapter 3 tests that against real data and finds it far more accurate than the equation itself.

For contents, flows and safety numbers, use tabulated data or a modern reference equation of state, such as those behind the NIST WebBook, or the supplier's stated figures.

## The error: a supplier accused of short filling

This is an illustration. After the run-time trouble in Chapter 1, the shop's maintenance engineer wanted an independent check on the gas supplier's stated contents for LN-1's pack, which were given as 232 kg. The engineer had a textbook with the van der Waals constants for nitrogen and wrote a short calculation that solved the equation for the density at 30.1 MPa and 15 °C.

The calculation gave **313.54 kg/m³**, and contents of 0.75 × 313.54 = **235.16 kg**. The engineer concluded that the supplier was filling 3.2 kg, about 1.4%, short of a full pack, or overstating its pressure, and drafted an email asking for a credit.

The production engineer, reviewing the draft, asked what accuracy van der Waals could claim at 30 MPa. Running the same calculation at NIST's densities showed the model's pressures 2 to 6% low across the pack's range, which means its densities at a given pressure are high. NIST's density at 30.1 MPa and 15 °C, 309.06 kg/m³, gives 231.79 kg, which rounds to the supplier's 232 kg. The supplier was filling correctly. The model's 1.4% was the model's own error, not a shortfall.

The email was not sent. The shop now checks contents against NIST data or the supplier's tables, and keeps van der Waals for what it does well: showing at a glance that the ideal law's 264 kg could not be right, because even the simple model brings the figure down to 235 kg.

```figure
type: bars
title: LN-1's full contents at 30.1 MPa and 15 °C, by method
unit: kg
max: 280
caption: This is an illustration. Van der Waals closes about 90% of the gap between the ideal law and NIST's data, but its remaining 1.4% is too large for a contents audit.
- Ideal gas law | 263.96
- Van der Waals, critical-point constants | 235.16
- * NIST reference data | 231.79
```

## Exercise: argon at 20 MPa

The shop also uses argon at 20 MPa absolute and 15 °C. Argon's critical point is 150.687 K and 4.863 MPa, and NIST gives its density at 20 MPa and 15 °C as 355.99 kg/m³, with a molar mass of 39.948 g/mol. Find the van der Waals constants for argon, the model's pressure at NIST's density, and the second virial coefficient the model predicts at 15 °C. Is argon at this pressure easier or harder to compress than ideal?

**Worked answer.**

- a = 27 × 8.3145² × 150.687² ÷ (64 × 4.863 × 10⁶) = **0.13618 Pa·m⁶/mol²**; b = 8.3145 × 150.687 ÷ (8 × 4.863 × 10⁶) = **32.20 cm³/mol**.
- Molar volume at NIST's density: 0.039948 ÷ 355.99 = 1.1222 × 10⁻⁴ m³/mol. Van der Waals pressure: 8.3145 × 288.15 ÷ (1.1222 × 10⁻⁴ − 3.220 × 10⁻⁵) − 0.13618 ÷ (1.1222 × 10⁻⁴)² = **19.13 MPa**, 4.4% below the real 20 MPa.
- B = b − a ÷ (R × T) = 32.20 − 136,180 ÷ (8.3145 × 288.15) = **−24.6 cm³/mol**.

The ideal pressure at NIST's density would be 21.35 MPa, higher than the real 20 MPa, so Z = 20 ÷ 21.35 = 0.937 and argon at 20 MPa is **easier** to compress than ideal: a cylinder holds about 6.7% more than the ideal law predicts. Nitrogen at the same pressure holds less than ideal. The difference is that argon's critical temperature is higher, so at 15 °C it is relatively cooler and its attraction counts for more. Chapter 3 turns that observation into a method.
