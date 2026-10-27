---
book: real-gases-by-the-numbers
chapterSlug: corresponding-states
order: 3
title: "Corresponding states: one gas predicts another"
description: "Reduced pressure and temperature, a test of corresponding states on nitrogen, argon and oxygen, why argon holds more than ideal and hydrogen less, and an argon stocktake that used nitrogen's Z."
draft: false
---

Chapter 1 used NIST's tables to find nitrogen's compressibility factor, and Chapter 2 explained its shape with the van der Waals model. The same shop also stores argon and oxygen at high pressure, keeps a cylinder of hydrogen for a test rig, and buys carbon dioxide. A table for every gas is not always to hand, and the obvious shortcut, applying nitrogen's correction to the others because they are all permanent gases in similar cylinders, turns out to be wrong in the direction that matters.

There is a better shortcut. Van der Waals' equation implies that all gases behave alike if their pressure and temperature are measured against their own critical point. The real gases follow that rule far more closely than they follow van der Waals' equation itself. This chapter sets out the rule, tests it on nitrogen, argon, oxygen and carbon dioxide with NIST's data, uses it to explain why argon and nitrogen depart from the ideal law in opposite directions at the same pressure, shows where it fails, and ends with an argon stocktake that borrowed nitrogen's Z.

## Reduced pressure and temperature

Every gas has a critical temperature T_c and a critical pressure p_c (Chapter 6). Dividing the actual absolute pressure and temperature by them gives the **reduced** values:

- reduced temperature, T_r = T ÷ T_c;
- reduced pressure, p_r = p ÷ p_c.

The **principle of corresponding states** says that gases at the same reduced temperature and reduced pressure have nearly the same compressibility factor. The van der Waals equation obeys it exactly: written in reduced variables, its constants a and b disappear, and every gas follows one equation. Real gases obey it approximately, because molecules of different substances are not exact scaled copies of each other, but for small, nearly spherical, non-polar molecules the approximation is remarkably good.

```figure
type: formula
title: Reduced conditions
formula: T_r = T ÷ T_c and p_r = p ÷ p_c
caption: Critical points from NIST. This is an illustration for LN-1's full pack and for an argon cylinder at 20 MPa, both at 15 °C.
- T, p | Absolute temperature and pressure
- T_c, p_c | Critical temperature and pressure of the gas
step: Nitrogen, 30.1 MPa: T_r = 288.15 ÷ 126.192 = 2.283; p_r = 30.1 ÷ 3.3958 = 8.86
step: Argon, 20 MPa: T_r = 288.15 ÷ 150.687 = 1.912; p_r = 20 ÷ 4.863 = 4.11
```

## A test with real data

The principle can be tested directly. NIST's data give the compressibility factor of each gas at any temperature and pressure, so the factor can be compared across gases at matched reduced conditions. At a reduced temperature of **2.283**, which is LN-1's nitrogen at 15 °C, argon at 71 °C and oxygen at 80 °C:

- at p_r = 2: nitrogen 0.992, argon 0.985, oxygen 0.989;
- at p_r = 5: nitrogen 1.027, argon 1.012, oxygen 1.019;
- at p_r = 9: nitrogen 1.144, argon 1.121, oxygen 1.131.

At a much lower reduced temperature of **1.3**, nearer the critical point, where real-gas effects are far larger:

- at p_r = 3: nitrogen 0.644, argon 0.629, oxygen 0.636;
- at p_r = 6: nitrogen 0.828, argon 0.816, oxygen 0.819.

Across a range in which Z itself varies from 0.63 to 1.14, the three gases agree to within about 2%. Carbon dioxide, a larger, linear molecule, follows the same pattern less closely: at T_r = 2.283 and p_r = 9 its Z is 1.174, about 3% above nitrogen's. That is still far better than treating any of them as ideal.

```figure
type: compare
title: Compressibility factor at matched reduced conditions, from NIST data
rowhead: Reduced conditions
cols: Nitrogen | Argon | Oxygen | Carbon dioxide
caption: Each gas evaluated at its own temperature and pressure for the stated T_r and p_r. Nitrogen, argon and oxygen agree within about 2%; carbon dioxide departs further.
- T_r 2.283, p_r 2 | 0.992 | 0.985 | 0.989 | 1.005
- T_r 2.283, p_r 5 | 1.027 | 1.012 | 1.019 | 1.052
- * T_r 2.283, p_r 9 | 1.144 | 1.121 | 1.131 | 1.174
- T_r 1.3, p_r 3 | 0.644 | 0.629 | 0.636 | 0.672
- T_r 1.3, p_r 6 | 0.828 | 0.816 | 0.819 | 0.823
```

## Why argon and nitrogen differ at the same pressure

The principle explains the puzzle that ended Chapter 2. At 15 °C, the gases in the shop sit at very different reduced temperatures, because their critical temperatures differ:

- nitrogen, T_c 126.2 K: T_r = **2.28**;
- argon, T_c 150.7 K: T_r = **1.91**;
- oxygen, T_c 154.6 K: T_r = **1.86**;
- hydrogen, T_c 33.1 K: T_r = **8.69**;
- helium, T_c 5.2 K: T_r = **55.5**;
- carbon dioxide, T_c 304.1 K: T_r = **0.95**, below its critical temperature.

A gas at a low reduced temperature is, in its own terms, cool: its molecules move slowly compared with the strength of their attraction, so attraction dominates over a wide range of pressure and Z falls below 1. A gas at a high reduced temperature is hot in its own terms: its molecules move too fast for attraction to matter much, and their size is the only correction, so Z rises above 1 from the start. At 20 MPa and 15 °C, NIST's data give Z = **1.049** for nitrogen, **0.937** for argon, **0.931** for oxygen, **1.126** for hydrogen and **1.097** for helium. Argon and oxygen are below their Boyle temperatures at 15 °C; nitrogen is just below its Boyle temperature but already at a high enough reduced pressure for size to win; hydrogen and helium are far above theirs. Carbon dioxide at 20 MPa and 15 °C is not a gas at all but a compressed liquid, which is why it is sold by weight (Chapter 6).

```figure
type: bars
title: Compressibility factor of cylinder gases at 20 MPa and 15 °C
unit: ×
max: 1.2
caption: From NIST data. Below 1, a cylinder holds more than the ideal law predicts; above 1, less. Argon and oxygen fall on the opposite side from nitrogen, hydrogen and helium.
- Oxygen, T_r 1.86 | 0.931
- Argon, T_r 1.91 | 0.937
- * Nitrogen, T_r 2.28 | 1.049
- Helium, T_r 55.5 | 1.097
- Hydrogen, T_r 8.69 | 1.126
```

The difference also shows on the gauge. Chapter 1 found that LN-1's nitrogen pack at two-thirds of its full pressure still holds 72.5% of its contents, because nitrogen's Z falls as the pressure falls. Argon behaves differently. Its Z is 0.937 at 20 MPa and 0.944 at 10 MPa, almost the same, so an argon cylinder at half its full pressure holds 176.65 ÷ 355.99 = **49.6%** of its contents, and its gauge reads almost exactly as a fuel gauge. The welders' habit of judging argon by the needle is sound; the same habit applied to a 30 MPa nitrogen pack is pessimistic by several per cent all the way down.

## Predicting one gas from another

The principle gives a method for estimating a gas's compressibility factor when its own data are not to hand but its critical point is: find a well-tabulated reference gas, set it to the same reduced conditions, and read its Z.

This is an illustration for argon at 20 MPa and 15 °C, using nitrogen as the reference.

1. Argon's reduced conditions: T_r = 288.15 ÷ 150.687 = 1.912; p_r = 20 ÷ 4.863 = 4.113.
2. Nitrogen at the same reduced conditions: T = 1.912 × 126.192 = 241.3 K, or −31.8 °C; p = 4.113 × 3.3958 = 13.97 MPa.
3. NIST's density for nitrogen there is 204.74 kg/m³, which gives Z = 13.97 × 10⁶ ÷ (204.74 × 296.80 × 241.3) = **0.952**.
4. Argon's estimated density: 20 × 10⁶ ÷ (0.952 × 208.13 × 288.15) = **350.3 kg/m³**, where 208.13 J/(kg·K) is argon's specific gas constant.

NIST's own value for argon is 355.99 kg/m³, Z = 0.937. The corresponding-states estimate is 1.6% low. For comparison, the ideal law is 6.3% low and van der Waals, from Chapter 2, is 4.2% high. For a gas whose table is not to hand, borrowing a similar gas's Z at the same reduced conditions is the best quick estimate available, and it is how the generalised compressibility charts in engineering handbooks were built.

## Where the principle needs help

Four kinds of gas need more care.

- **Larger or polar molecules.** Carbon dioxide, refrigerants, water vapour and hydrocarbons beyond methane depart from the simple-gas pattern by a few per cent or more. Engineering correlations add a third parameter, the acentric factor, which measures how far a substance's vapour pressure curve departs from that of a simple gas, and use it to adjust Z.
- **Hydrogen and helium.** These light molecules are affected by quantum behaviour at low temperatures, and they do not follow the simple pattern well when their ordinary critical constants are used. Use their own data. At the 70 MPa used in hydrogen vehicle tanks, NIST's data give Z = **1.466** at 15 °C, so a tank holds only 68% of what the ideal law predicts.
- **Near the critical point.** Close to T_r = 1 and p_r = 1, Z changes very rapidly with both pressure and temperature, and small errors in the reduced conditions become large errors in Z.
- **Mixtures.** Air, shielding gas blends and natural gas have no single critical point. A common approximation, Kay's rule, uses a pseudo-critical temperature and pressure averaged by mole fraction. It works well for mixtures of similar gases and poorly for mixtures of very different ones.

## A shielding gas mixture by Kay's rule

The shop's welding bays also use a mixture of 82% argon and 18% carbon dioxide by mole, supplied in 50 litre cylinders. This is an illustration of how far the method can be pushed, and of where it should stop.

1. Pseudo-critical temperature: 0.82 × 150.687 + 0.18 × 304.128 = **178.31 K**.
2. Pseudo-critical pressure: 0.82 × 4.863 + 0.18 × 7.3773 = **5.316 MPa**.
3. At 20 MPa and 15 °C: T_r = 288.15 ÷ 178.31 = 1.616; p_r = 20 ÷ 5.316 = 3.763.
4. Nitrogen at the same reduced conditions, 203.93 K and 12.78 MPa, has a NIST density of 247.08 kg/m³, so Z = **0.854**.
5. The mixture's molar mass is 40.68 g/mol and its specific gas constant 204.39 J/(kg·K), so its estimated density is 20 × 10⁶ ÷ (0.854 × 204.39 × 288.15) = **397.5 kg/m³**, about **19.9 kg** per cylinder. The ideal law gives 339.6 kg/m³ and 16.98 kg.

The estimate says the ideal law understates this mixture's contents by about 15%, a larger correction than for argon alone, because the carbon dioxide raises the mixture's pseudo-critical temperature and so lowers its reduced temperature. That direction is reliable. The size of the correction is not: argon and carbon dioxide are different enough molecules that Kay's rule can be several per cent out for this mixture, and this book has not checked it against measured mixture data. A cylinder of mixture also raises a question a single gas does not: whether any carbon dioxide can condense out at low temperature, which would change the composition delivered to the torch. For a mixture, the supplier's stated contents and filling pressure are the only figures to plan with. Kay's rule tells the reader which way, and roughly how far, the ideal law will be wrong.

## The error: an argon stocktake with nitrogen's Z

This is an illustration. At the end of the financial year, the shop counted its gas stock. Besides LN-1, it held **20 full argon cylinders** of 50 litres water capacity at 20 MPa and 15 °C for its welding bays. The stores officer, who had learned from Chapter 1's run-time trouble that the ideal law overstates contents at high pressure, applied nitrogen's compressibility factor at 20 MPa, 1.0485, to the argon.

The ideal density of argon at 20 MPa and 15 °C is 20 × 10⁶ ÷ (208.13 × 288.15) = 333.48 kg/m³. Divided by 1.0485, it gave 318.06 kg/m³, or **15.90 kg** per cylinder and 318.0 kg in stock. The stock value came out lower than the supplier's invoices suggested, and the officer ordered four extra cylinders to cover what looked like a shortfall in the welding bays' reserve.

The welding supervisor, who knew the argon cylinders were labelled as holding about 10.5 m³, queried it: 15.90 kg at argon's atmospheric density of 1.69 kg/m³ is only 9.4 m³. The production engineer checked NIST's data for argon at 20 MPa and 15 °C: 355.99 kg/m³, Z = 0.937, and **17.80 kg** per cylinder, 356.0 kg in stock, 10.5 m³ each at atmospheric pressure. Argon at 20 MPa is easier to compress than ideal, not harder, because at 15 °C it sits at a lower reduced temperature than nitrogen. Borrowing nitrogen's correction had moved the estimate the wrong way and understated the argon by 10.7%.

The extra cylinders were cancelled. The shop's stock sheet now carries each gas's own Z, from NIST or the supplier's tables, and a note that the correction can go either way.

```figure
type: checklist
title: Estimating a gas's compressibility without its own table
caption: The order of preference for contents and stock calculations. The last line is this chapter's error.
- Supplier's stated contents for the cylinder and gas | the best figure for stock and planning
- Reference data for the gas, such as NIST | Z at the actual pressure and temperature
- Another simple gas at the same reduced conditions | argon from nitrogen to within about 2%
- Generalised compressibility chart with acentric factor | for larger molecules such as CO₂
- Van der Waals | explanation and order of magnitude only
- x Another gas's Z at the same actual pressure | argon understated by 10.7% using nitrogen's
```

## Exercise: oxygen from nitrogen data

The shop also holds oxygen at 20 MPa and 15 °C. Oxygen's critical point is 154.581 K and 5.04279 MPa, and its specific gas constant is 259.84 J/(kg·K). NIST gives nitrogen at 235.23 K and 13.468 MPa a density of 205.39 kg/m³. Estimate oxygen's compressibility factor and its contents per 50 litre cylinder by corresponding states, and compare with the ideal law and with NIST's oxygen density of 286.88 kg/m³.

**Worked answer.**

- Oxygen's reduced conditions: T_r = 288.15 ÷ 154.581 = 1.864; p_r = 20 ÷ 5.04279 = 3.966. Nitrogen at those reduced conditions is at 1.864 × 126.192 = 235.23 K and 3.966 × 3.3958 = 13.468 MPa, which is why those conditions were given.
- Nitrogen's Z there: 13.468 × 10⁶ ÷ (205.39 × 296.80 × 235.23) = **0.939**.
- Oxygen's estimated density: 20 × 10⁶ ÷ (0.939 × 259.84 × 288.15) = **284.4 kg/m³**, or **14.22 kg** per cylinder.
- NIST's density, 286.88 kg/m³, gives **14.34 kg** per cylinder. The estimate is 0.9% low.
- The ideal law gives 267.12 kg/m³, 13.36 kg per cylinder, 6.9% low.

Like argon, oxygen at 20 MPa and 15 °C holds more than the ideal law predicts, and the corresponding-states estimate captures nearly all of the difference.
