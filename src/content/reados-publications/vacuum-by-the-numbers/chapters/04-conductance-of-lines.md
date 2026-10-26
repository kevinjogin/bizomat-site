---
book: vacuum-by-the-numbers
chapterSlug: conductance-of-lines
order: 4
title: "Conductance of openings, tubes and lines"
description: "Conductance and throughput, series and parallel elements, orifices and tubes in viscous and molecular flow, VC-200's effective pumping speed at the chamber, and a hose swapped for a thin tube."
draft: false
---

A pump's rated speed is measured at its own inlet. What the chamber sees is less, because the gas has to get from the chamber to the pump through ports, valves, filters, hoses and fittings, each of which resists the flow. Vacuum engineers describe that resistance by its inverse, **conductance**, and combine conductances with the pump's speed to find the **effective pumping speed** at the chamber, the number that actually governs pump-down and the pressure a system can hold. A generous pump on a mean line can be beaten by a modest pump on a good one.

This chapter defines conductance and throughput, shows how conductances combine, gives the formulas for openings and tubes in each flow regime, calculates VC-200's line and its effective speed across its working range, and ends with a hose replaced by a thin tube that looked nearly the same and pumped far worse.

## Throughput and conductance

Chapter 1 introduced **throughput**, Q, the flow of gas measured as pressure times volume per second, in pascal cubic metres a second or millibar litres a second. Throughput is conserved along a line: in steady flow, what leaves the chamber passes through every element of the line and enters the pump.

The **conductance** C of an element relates the throughput through it to the pressure difference across it:

Q = C × (p₁ − p₂)

Conductance has the units of volume flow, litres a second or cubic metres a second. It plays the role that electrical conductance plays in a circuit, with throughput as the current and pressure difference as the voltage, and the analogy carries over to how elements combine.

- In **series**, the reciprocals add: 1 ÷ C_total = 1 ÷ C₁ + 1 ÷ C₂ + …. The smallest conductance dominates.
- In **parallel**, the conductances add: C_total = C₁ + C₂ + ….

## Pumping speed at the chamber

A pump's **speed** S is the volume flow it takes in at its inlet pressure, so its throughput is Q = S × p_inlet. Connected to a chamber through a line of conductance C, the speed the chamber sees, S_eff, follows from the series rule:

1 ÷ S_eff = 1 ÷ S + 1 ÷ C

If the line's conductance equals the pump's speed, the chamber sees half the pump's speed. If the line's conductance is ten times the pump's speed, the chamber sees 91% of it. A rule of thumb in vacuum design is to make the line's conductance several times the pump's speed at the working pressure; beyond that, a bigger line buys little.

```figure
type: formula
title: Effective pumping speed at the chamber
formula: 1 ÷ S_eff = 1 ÷ S + 1 ÷ C
caption: This is an illustration for VC-200 at 200 Pa: a 4.44 L/s pump through 1.5 m of 25 mm hose, whose viscous conductance at that mean pressure is about 72.8 L/s.
- S | Pump speed at its inlet, 16 m³/h = 4.44 L/s
- C | Line conductance at 200 Pa, 72.8 L/s
step: 1 ÷ S_eff = 1 ÷ 4.44 + 1 ÷ 72.8 = 0.2250 + 0.0137 = 0.2387
step: S_eff = 4.19 L/s, 94% of the pump's speed
```

## Openings

An opening in a thin wall, such as a port or an aperture, has a conductance that depends on the flow regime.

- In **molecular flow**, it is the effusion rate of Chapter 2: C = A × v̄ ÷ 4, which for nitrogen at 20 °C is **11.8 L/s per square centimetre**, independent of pressure.
- In **viscous flow**, an opening between two pressures behaves like a nozzle. When the downstream pressure is less than about half the upstream pressure, the flow through it **chokes**: the gas reaches the speed of sound in the narrowest section and the throughput stops rising, however low the downstream pressure goes. At the start of a pump-down from atmospheric pressure, a small port can therefore limit the flow even though it would offer a large conductance at lower pressures. Choked-flow formulas are in the vacuum handbooks and the makers' data.

## Tubes in molecular flow

For a long round tube of diameter d and length L in molecular flow, kinetic theory gives:

C = (π ÷ 12) × v̄ × d³ ÷ L

For nitrogen at 20 °C, with d and L in centimetres, that is about **12.3 × d³ ÷ L** litres a second. The conductance goes as the cube of the diameter and is independent of pressure. A short tube has an additional resistance at its entrance, which is approximated by putting the entrance's orifice conductance in series with the tube's.

For VC-200's hose, 2.5 cm by 150 cm, the molecular formula gives 12.3 × 2.5³ ÷ 150 = **1.28 L/s**. Chapter 3 showed that this figure is irrelevant to VC-200, whose hose is in viscous flow throughout its working range.

## Tubes in viscous flow

For a long round tube in laminar viscous flow, the Poiseuille relation for a compressible gas gives:

C = π × d⁴ × p̄ ÷ (128 × μ × L)

where p̄ is the mean of the pressures at the two ends and μ the gas's viscosity. For nitrogen at 20 °C, with d and L in centimetres and p̄ in pascals, it is about **1.40 × d⁴ × p̄ ÷ L** litres a second. Two features make it very different from the molecular formula:

- conductance goes as the **fourth power** of the diameter: halving a tube's bore cuts its viscous conductance to a sixteenth;
- conductance is **proportional to the mean pressure**: the same tube conducts ten times as well at 1,000 Pa as at 100 Pa.

The second feature is the reason a line that is generous at the start of a pump-down can become a restriction as the pressure falls, and why lines for low-pressure work are larger than lines for rough vacuum.

## VC-200's line

This is an illustration. VC-200's hose is 1.5 m of 25 mm bore, and its pump is rated at 4.44 L/s. With the viscous formula:

- at a mean pressure of **10 kPa**: C = 1.40 × 2.5⁴ × 10,000 ÷ 150 = **3,640 L/s**; S_eff = 4.44 L/s;
- at **1 kPa**: C = **364 L/s**; S_eff = **4.39 L/s**;
- at **200 Pa**: C = **72.8 L/s**; S_eff = **4.19 L/s**, 94% of the pump's speed;
- at **50 Pa**: C = **18.2 L/s**; S_eff = **3.57 L/s**, 80%.

Down to the working pressure, the hose costs VC-200 at most 6% of its pump's speed. Below about 50 Pa it would start to matter, which is worth knowing if the shop ever runs a lower-pressure process in the same chamber.

VC-200's line also has a ball valve at the chamber, so that the pump can run while the chamber is vented. Its maker rates its conductance at about 60 L/s at 200 Pa, as an illustration. In series with the hose, the line's total conductance at 200 Pa is 1 ÷ (1 ÷ 72.8 + 1 ÷ 60) = **32.9 L/s**, and the effective speed falls to **3.92 L/s**. The valve, not the hose, is the larger restriction, which is common: valves, filters and quick-release fittings often have smaller bores than the lines they sit in.

```figure
type: compare
title: VC-200's hose conductance and effective speed by mean pressure
rowhead: Mean pressure
cols: Hose conductance, L/s | Effective speed, L/s | Share of the 4.44 L/s pump
caption: This is an illustration: 1.5 m of 25 mm hose, nitrogen at 20 °C, laminar viscous flow, without the valve. Conductance falls in proportion to pressure.
- 10 kPa | 3,640 | 4.44 | 100%
- 1 kPa | 364 | 4.39 | 99%
- * 200 Pa, working pressure | 72.8 | 4.19 | 94%
- 50 Pa | 18.2 | 3.57 | 80%
```

## Bends, fittings and the transitional range

The tube formulas assume long, straight, round tubes. Real lines have bends, flexible hose with corrugated walls, reducers and fittings, and each adds resistance. Corrugated metal hose, in particular, conducts noticeably less than smooth tube of the same nominal bore. For layout work, the practical approach is to treat each fitting with its maker's conductance, or as an equivalent extra length of tube, and to keep lines as short and wide as the installation allows. The pump belongs as close to the chamber as vibration and access permit.

In the transitional range, between viscous and molecular flow, neither formula is exact. A common engineering approach is to calculate both and use a blending formula from a vacuum handbook; a simpler cautious approach is to take the larger of the two as an upper bound and the molecular one as a lower bound, and to design the line so that both give an acceptable effective speed.

## Parallel paths and manifolds

Conductances in parallel add, which is useful when one pump serves several chambers or one chamber has two ports. If VC-200 were fitted with a second 25 mm port and hose to the same pump, of the same length, the two hoses in parallel would have twice the conductance of one: 145.6 L/s at 200 Pa, and with the pump's 4.44 L/s the effective speed would rise only from 4.19 to 4.31 L/s. A second hose would not be worth it, because one hose already conducts sixteen times what the pump can take.

The reverse case is more common in factories: one pump serving several chambers through a manifold. Each chamber then sees the pump's speed shared with the others and reduced by its own branch's conductance, and a chamber that is opened to the atmosphere while the others are pumping floods the manifold with gas and raises every chamber's pressure. Manifolds need valves that isolate each branch, and a pump sized for the gas loads of all the chambers at once, not for one.

## Measuring a line's conductance

Conductance can be measured as well as calculated, which is worth doing when a line includes components without published ratings. The method follows from Q = C × (p₁ − p₂).

1. Put a gauge at each end of the line, one at the chamber and one at the pump's inlet.
2. Admit a known, steady throughput into the chamber, through a calibrated leak or a needle valve with a flow meter on its atmospheric side. A flow meter reading in standard litres a minute converts to throughput by multiplying by the standard pressure: one standard litre a minute is 101,325 × 0.001 ÷ 60 = **1.69 Pa·m³/s**.
3. When the pressures are steady, the conductance is the throughput divided by the pressure difference.

This is an illustration. With a throughput of 0.89 Pa·m³/s admitted, VC-200's gauges read 212 Pa at the chamber and 200 Pa at the pump. The hose and valve together conduct 0.89 ÷ 12 = 0.074 m³/s, about **74 L/s** at a mean pressure of 206 Pa. That is more than the 32.9 L/s calculated for hose and valve together, which suggests that the valve's published rating, taken from a catalogue table, was conservative. The shop records the measured figure and uses it.

The gauges must agree with each other closely for the method to work, since it depends on a small difference between two readings; swapping them and repeating the measurement cancels a constant offset between them.

## The error: a thin tube that looked nearly the same

This is an illustration. VC-200's hose was crushed when a trolley ran over it, and a maintenance technician replaced it from stores with **4 m of 12 mm bore** nylon tube, the nearest thing to hand, routing it around the bench instead of across the floor. The fittings were adapted, the chamber pumped down, and production resumed.

Over the next shift, the operators noticed that the chamber took much longer to reach 200 Pa, and on several cycles did not reach it in the allowed six minutes. The process engineer calculated the new tube's conductance. Its bore was 0.48 of the old hose's, so its viscous conductance per unit length was 0.48⁴ = **0.053** of the hose's, and it was 2.67 times as long:

- conductance at 200 Pa: 72.8 × 0.053 ÷ 2.67 = **1.45 L/s**;
- effective speed at 200 Pa: 1 ÷ (1 ÷ 4.44 + 1 ÷ 1.45) = **1.09 L/s**, a quarter of the pump's speed.

At high pressure the thin tube conducted well enough, so the first part of each pump-down looked normal; it was only near the working pressure, where viscous conductance had fallen in proportion to pressure, that it throttled the pump. The fourth-power dependence on bore had turned a tube "nearly the same size" into one that cost three quarters of the pumping speed.

A replacement 25 mm hose was fitted, with a guard where it crossed the floor. The maintenance work instruction for VC-200 now specifies the hose's bore, length and part number, and the shop keeps a spare.

```figure
type: bars
title: VC-200's effective speed at 200 Pa with different lines
unit: L/s
max: 4.6
caption: This is an illustration with the 4.44 L/s pump. Bore matters to the fourth power in viscous flow; the thin replacement tube cut the speed by three quarters.
- Pump alone | 4.44
- * 1.5 m of 25 mm hose | 4.19
- Hose and ball valve | 3.92
- 4 m of 12 mm tube | 1.09
```

## Exercise: a longer line for a remote pump

To reduce noise in the potting room, the shop considers moving VC-200's pump to a plant room, with **6 m** of line. Find the effective speed at 200 Pa with 6 m of 25 mm hose, and with 6 m of 40 mm pipe, ignoring the valve. Which keeps the effective speed above 90% of the pump's?

**Worked answer.** Using C = 1.40 × d⁴ × p̄ ÷ L, with d and L in centimetres:

- 25 mm × 6 m: C = 1.40 × 2.5⁴ × 200 ÷ 600 = **18.2 L/s**; S_eff = 1 ÷ (1 ÷ 4.44 + 1 ÷ 18.2) = **3.57 L/s**, 80%.
- 40 mm × 6 m: C = 1.40 × 4.0⁴ × 200 ÷ 600 = **119 L/s**; S_eff = **4.28 L/s**, 96%.

The 40 mm line keeps more than 90% of the pump's speed at the working pressure; the 25 mm hose over 6 m does not. A longer line needs a larger bore, and because viscous conductance goes as d⁴ ÷ L, a modest increase in bore more than makes up for a large increase in length.
