---
book: real-gases-by-the-numbers
chapterSlug: where-the-ideal-gas-law-fails
order: 1
title: "Where the ideal gas law fails"
description: "The compressibility factor, nitrogen's departure from the ideal law up to 30 MPa, LN-1's real contents of 232 kg against an ideal 264 kg, and a run-time plan that ran out early."
draft: false
---

Most engineers learn the ideal gas law early and use it for the rest of their working lives. It treats a gas as a crowd of tiny, independent points that never touch each other except to bounce, and from that picture it gives a simple rule: at a fixed temperature, the amount of gas in a container is proportional to its absolute pressure. Double the pressure and you double the contents. For air in a workshop main at 700 kPa, the rule is accurate to better than a tenth of a per cent, and nobody needs anything else.

In a cylinder at 30 MPa it is wrong by fourteen per cent. This chapter sets out how far real gases depart from the ideal law, defines the compressibility factor that measures the departure, uses it to find the real contents of the LN-1 nitrogen pack, and ends with a run-time plan for the laser cell that was built on the ideal law and ran short in production.

## The ideal gas law and what it assumes

The ideal gas law can be written for a mass of gas as:

p × V = m × R_s × T

where p is the absolute pressure, V the volume, m the mass, T the absolute temperature and R_s the specific gas constant, the molar gas constant 8.314462618 J/(mol·K) divided by the molar mass. For nitrogen, with a molar mass of 28.0134 g/mol, R_s = **296.80 J/(kg·K)**. Rearranged, the law gives the density of a gas from its pressure and temperature:

ρ = p ÷ (R_s × T)

Two assumptions sit behind it. The first is that the molecules occupy no volume of their own, so the whole container is free space for them to move in. The second is that they exert no forces on each other except at the instant of a collision, so nothing pulls them together and nothing holds them apart. At atmospheric pressure, a nitrogen molecule's nearest neighbour is on average about ten molecular diameters away, and both assumptions are very nearly true. At 30 MPa, the gas is about 264 times denser, so the molecules are about six times closer in each direction, little more than one molecular diameter apart; they are within reach of each other's attraction most of the time, and the space they physically occupy is no longer a trivial fraction of the cylinder. Neither assumption holds, and the law stops working.

## The compressibility factor

Engineers measure the departure with one number, the compressibility factor Z:

Z = p ÷ (ρ × R_s × T)

For an ideal gas, Z = 1 exactly, at every pressure and temperature. For a real gas, Z is found from measured or tabulated densities. When Z is greater than 1, the gas is harder to compress than the ideal law says, and a container holds less than the ideal law predicts. When Z is less than 1, it is easier to compress, and a container holds more. The real density is the ideal density divided by Z:

ρ = p ÷ (Z × R_s × T)

That one correction is enough for most engineering work. The rest of this book is about where Z comes from, how it varies, and what else changes when a gas is far from ideal.

```figure
type: formula
title: The compressibility factor
formula: Z = p ÷ (ρ × R_s × T)
caption: This is an illustration for LN-1's nitrogen when the pack is full. The density is NIST's tabulated value for nitrogen at 30.1 MPa and 15 °C.
- p | Absolute pressure, 30.1 MPa
- ρ | Real density from NIST, 309.06 kg/m³
- R_s | Specific gas constant of nitrogen, 296.80 J/(kg·K)
- T | 288.15 K
step: Ideal density = 30.1 × 10⁶ ÷ (296.80 × 288.15) = 351.95 kg/m³
step: Z = 351.95 ÷ 309.06 = 1.139
```

## Nitrogen from 0.1 to 30 MPa

The NIST Chemistry WebBook tabulates nitrogen's density from reference equations of state fitted to measurements. Dividing the ideal density by the real one at each pressure gives Z. At 15 °C:

- at **0.1 MPa**, Z = 0.9997;
- at **5.1 MPa**, Z = 0.9918;
- at **10.1 MPa**, Z = 0.9975;
- at **15.1 MPa**, Z = 1.0169;
- at **20.1 MPa**, Z = 1.0485;
- at **25.1 MPa**, Z = 1.0900;
- at **30.1 MPa**, Z = 1.1388.

Two things stand out. First, the departure is negligible below about 1 MPa, which is why the ideal law serves compressed air, pneumatics and low-pressure gas lines so well. Second, Z does not move steadily in one direction. It dips slightly below 1 at moderate pressure, where the gas is slightly easier to compress than ideal, passes back through 1 at around 11 MPa, and then climbs. The dip is the molecules' mutual attraction; the climb is their size. Chapter 2 explains both. For now, the practical point is that the correction at cylinder pressures is large, and its sign depends on the pressure.

```figure
type: compare
title: Nitrogen's compressibility factor at 15 °C
rowhead: Absolute pressure, MPa
cols: Real density, kg/m³ | Ideal density, kg/m³ | Z | Ideal law's error in contents
caption: Real densities from the NIST Chemistry WebBook; ideal densities from ρ = p ÷ (R_s × T). A positive error means the ideal law overstates the contents.
- 0.1 | 1.170 | 1.169 | 0.9997 | 0.0%
- 5.1 | 60.12 | 59.63 | 0.9918 | −0.8%
- 10.1 | 118.39 | 118.10 | 0.9975 | −0.2%
- 15.1 | 173.63 | 176.56 | 1.0169 | +1.7%
- 20.1 | 224.15 | 235.02 | 1.0485 | +4.8%
- 25.1 | 269.25 | 293.49 | 1.0900 | +9.0%
- * 30.1 | 309.06 | 351.95 | 1.1388 | +13.9%
```

## Temperature matters too

The compressibility factor also changes with temperature. At 30.1 MPa, nitrogen's Z is **1.1309 at 0 °C**, 1.1388 at 15 °C, **1.1470 at 35 °C** and **1.1517 at 50 °C**. At 10.1 MPa, it runs from 0.9850 at 0 °C to 1.0176 at 50 °C. For nitrogen at room temperature, warmer gas is slightly less ideal at high pressure and slightly more ideal at moderate pressure, but across a workshop's range of temperatures the change in Z is much smaller than the change in Z with pressure.

The bigger effect of temperature is the ordinary one. A fixed mass of gas in a fixed cylinder rises in pressure as it warms, and Chapter 4 shows that the real gas rises faster than the ideal law predicts. For now, all the contents calculations are made at 15 °C, the temperature at which the pack was filled.

## LN-1's real contents

This is an illustration. LN-1's pack holds 0.75 m³ of water capacity filled to 30.1 MPa absolute at 15 °C.

- **Ideal contents.** Density 351.95 kg/m³, so 0.75 × 351.95 = **263.96 kg**.
- **Real contents.** Density 309.06 kg/m³, so 0.75 × 309.06 = **231.79 kg**.

The ideal law overstates the contents by 32.2 kg, or 13.9%. Expressed as gas at 15 °C and atmospheric pressure, where nitrogen's density is 1.1851 kg/m³, the pack holds **195.6 m³**, not the 222.7 m³ the ideal law gives. Each 50 litre cylinder in the pack holds about **15.45 kg**, not 17.60.

Suppliers state the contents of their cylinders and packs, and those stated contents are the right figures to plan with, because they come from the same kind of real-gas data and the supplier's own filling practice. The calculation here matters when the contents are not stated, when a pack is part-used, when the pressure or temperature differs from the filling conditions, or when someone works the contents out for themselves from a pressure gauge. That last case is common, and it is where the ideal law causes trouble.

## Usable contents

Not all the gas in a pack can be used. LN-1's regulator needs at least about 2.5 MPa at its inlet to hold the line at 1.8 MPa gauge with the laser drawing gas, so the pack is changed at 2.5 MPa. What is left in it goes back to the supplier.

At 2.5 MPa and 15 °C, nitrogen's real density is 29.40 kg/m³, Z = 0.9943, so the residual is 0.75 × 29.40 = **22.05 kg**. The ideal law gives 21.92 kg, close, because at 2.5 MPa the gas is nearly ideal. The usable contents are therefore:

- real: 231.79 − 22.05 = **209.74 kg**;
- ideal: 263.96 − 21.92 = **242.04 kg**.

The ideal law's error is almost all at the top end, where the pack is full. The residual is small and nearly ideal, so it does not offset the error. The ideal estimate of usable gas is 15.4% too high.

```figure
type: bars
title: LN-1's contents at 15 °C, ideal and real
unit: kg
max: 280
caption: This is an illustration. The pack's 0.75 m³ at 30.1 MPa holds 231.79 kg of nitrogen, of which 22.05 kg stays behind at the 2.5 MPa changeover pressure.
- Full, ideal law | 263.96
- * Full, real | 231.79
- Usable, ideal law | 242.04
- * Usable, real | 209.74
- Residual at 2.5 MPa, real | 22.05
```

## The gauge is not a straight fuel gauge

Operators often read a cylinder's pressure gauge as a fuel gauge: half the full pressure means half the gas. For an ideal gas at constant temperature that would be exactly right. For nitrogen at cylinder pressures it is not, because Z falls as the pressure falls, so each megapascal at the top of the gauge holds less gas than each megapascal lower down.

This is an illustration for LN-1 at 15 °C. When the gauge shows two-thirds of the full pressure, 20.1 MPa absolute, the pack still holds **72.5%** of its full contents. At half pressure, 15.1 MPa, it holds **56.2%**. At a third, 10.1 MPa, it holds **38.3%**, and at 5.1 MPa it holds **19.5%**. The gauge reads pessimistically all the way down: the pack always has a little more gas than the pressure fraction suggests, because the first part of the gas to leave was the least ideal. For planning, that is the safe direction. The danger is the opposite calculation, from the full pressure up to an ideal-gas contents figure, which is the one the error below made.

## The run time

LN-1's laser draws 36.0 kg an hour with the beam on, so the real usable contents last 209.74 ÷ 36.0 = **5.83 hours** of cutting. The ideal estimate is 242.04 ÷ 36.0 = **6.72 hours**. The difference is 54 minutes of cutting, which is the difference between a pack that lasts a full day's six beam-on hours and one that does not.

The draw itself comes from the flow through the nozzle, which Chapter 7 calculates. At 1.6 MPa, nitrogen is so close to ideal that the nozzle calculation needs no real-gas correction, which is part of why the error in the pack is easy to miss: everything downstream of the regulator behaves as the ideal law says, and only the pack does not.

## Where the ideal law is safe and where it is not

A rule of thumb for nitrogen at room temperature, from the NIST data in this chapter: the ideal law is good to about 1% up to roughly 10 MPa, and the error grows quickly above 15 MPa. Nitrogen is a kind case. Argon and oxygen at 10 MPa and 15 °C have Z of 0.944 and 0.941, so the ideal law understates their contents by about 6%, and Chapter 3 shows why gases that look alike can differ this much. For gases that are close to liquefying at room temperature, such as carbon dioxide or refrigerants, the law can fail badly at a few megapascals, and for hydrogen and helium it fails in the opposite direction from argon and oxygen at the same pressure. Chapter 3 shows how to tell which case applies without a table for every gas.

```figure
type: checklist
title: When to stop trusting the ideal gas law
caption: For nitrogen at room temperature, from the NIST data in this chapter. Argon and oxygen depart further at moderate pressure, as Chapter 3 shows.
- Pressure below about 1 MPa | error well under 0.5%; use the ideal law
- Pressure 1 to 10 MPa | nitrogen within about 1%; argon and oxygen up to about 6%
- Pressure above 15 MPa | error several per cent and rising; always use Z or stated contents
- Gas near its critical temperature, such as CO₂ | ideal law unreliable even at a few MPa
- Hydrogen and helium | Z above 1 at every cylinder pressure; contents below ideal
- x Contents worked out from a gauge with pV = mRT | 13.9% too high for a full 30 MPa nitrogen pack
```

## The error: a run-time plan built on pV = mRT

This is an illustration. When the shop installed the laser cell, its production planner built a gas plan on a spreadsheet. The planner took the pack's water capacity, 0.75 m³, multiplied it by the pressure ratio 30.1 ÷ 0.101325, and got 222.8 m³ of gas at atmospheric pressure. At the laser's draw, converted to 30.4 m³ an hour, the planner worked out 6.7 hours of cutting from the pack's usable gas, and scheduled the pack change for the start of each day, with one pack expected to last a full six-hour cutting day with a margin.

In the first fortnight, the pack ran out mid-afternoon on four days out of ten, each time with the machine part-way through a nest of parts. The laser's controller stopped the cut when the assist gas pressure dropped, and the operators lost the part-cut sheets and about twenty minutes changing packs.

The production engineer checked the arithmetic. The pressure-ratio calculation was the ideal gas law in disguise: it assumed that a cylinder at 300 times atmospheric pressure holds 300 times as much gas as it would at atmospheric pressure. Using NIST's density for nitrogen at 30.1 MPa and 15 °C gave the real contents of 231.79 kg, 195.6 m³ at atmospheric pressure, and 5.83 hours of cutting from the usable gas, not 6.7. The days the pack ran out were the days the machine cut for more than about 5.8 hours.

The shop asked the gas supplier for the stated contents of its packs, which confirmed the real-gas figure, and rewrote the plan: the pack is changed when the cell's daily cutting reaches 5.5 hours or the pressure falls to 3 MPa, whichever is first, and a second pack is held on a changeover manifold so that the cell never waits. Chapter 8 takes the plan further. The planner's spreadsheet now has a column for Z.

## Exercise: a part-used pack

At the end of a short day, LN-1's pack reads 20.0 MPa gauge, 20.1 MPa absolute, at 15 °C. How much nitrogen is in it by the ideal law and in reality, and how many hours of cutting does it have left before the 2.5 MPa changeover?

**Worked answer.** From NIST, nitrogen at 20.1 MPa and 15 °C has a density of 224.15 kg/m³ and Z = 1.0485.

- Ideal density: 20.1 × 10⁶ ÷ (296.80 × 288.15) = 235.02 kg/m³; contents 0.75 × 235.02 = **176.27 kg**.
- Real contents: 0.75 × 224.15 = **168.11 kg**, 4.8% less than ideal.
- Usable, real: 168.11 − 22.05 = 146.06 kg, which lasts 146.06 ÷ 36.0 = **4.06 hours** of cutting.
- Usable, ideal: 176.27 − 21.92 = 154.35 kg, or 4.29 hours.

At 20 MPa the ideal law's error is about a third of what it is at 30 MPa, but it is still about 14 minutes of cutting, enough to matter if the plan has no margin.
