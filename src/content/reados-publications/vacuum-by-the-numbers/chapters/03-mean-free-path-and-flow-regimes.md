---
book: vacuum-by-the-numbers
chapterSlug: mean-free-path-and-flow-regimes
order: 3
title: "Mean free path and flow regimes"
description: "Mean free path from viscosity, why gas viscosity barely changes with pressure, the Knudsen number, flow regimes, VC-200's regime, and the wrong formula for its hose."
draft: false
---

The single most useful number in vacuum work is the distance a molecule travels, on average, between one collision with another molecule and the next. At atmospheric pressure it is less than a ten-thousandth of a millimetre, and the gas behaves as a continuous fluid: it flows, it has viscosity, it pushes along pipes as a whole. At very low pressure it is longer than the chamber, and the molecules bounce from wall to wall without meeting each other: the gas no longer flows as a fluid at all. Which of those two worlds a vacuum system is in decides which formulas apply to it, and getting that wrong is the most common error in vacuum calculations.

This chapter finds the mean free path of nitrogen from its measured viscosity, uses NIST's data to show one of kinetic theory's most surprising predictions, defines the Knudsen number and the flow regimes, places VC-200's hose and chamber in them, notes the turbulence at the start of pump-down, and ends with a conductance calculated with the formula for the wrong regime.

## Mean free path

Molecules are not points. Each has an effective size, and two molecules that pass closer than that size collide. A molecule moving through a gas sweeps out a cylinder, and it collides whenever another molecule's centre lies inside it. The average distance between collisions, the **mean free path** λ, is therefore inversely proportional to the number density of molecules, and so to pressure: halve the pressure and the molecules travel twice as far between collisions.

The effective size of a molecule is not something that can be measured with a ruler, but it can be inferred from properties that depend on collisions, viscosity in particular. Kinetic theory relates viscosity to the mean free path, and one widely used form of the relation, rearranged, gives:

λ = (μ ÷ p) × √(π k T ÷ (2 m))

where μ is the gas's viscosity. NIST gives nitrogen's viscosity at 20 °C as **17.56 µPa·s**. Substituting, λ × p = **6.49 × 10⁻³ pascal metres** for nitrogen at 20 °C, a constant worth remembering. Then:

- at atmospheric pressure, λ = 6.49 × 10⁻³ ÷ 101,325 = **64 nm**;
- at 1 kPa, **6.5 µm**;
- at VC-200's 200 Pa, **32 µm**, about a third of the thickness of a sheet of paper;
- at 1 Pa, **6.5 mm**;
- at 0.01 Pa, **0.65 m**, longer than VC-200 is wide.

Simpler models of molecular collisions give relations between viscosity and mean free path that differ by numerical factors, the elementary model in introductory texts giving a mean free path about one and a half times as long. The differences do not matter for engineering purposes: what matters is the order of magnitude, and the fact that λ goes as 1 ÷ p.

```figure
type: formula
title: Mean free path of nitrogen from its viscosity
formula: λ = (μ ÷ p) × √(π k T ÷ (2 m))
caption: One common kinetic theory relation, with NIST's viscosity for nitrogen at 20 °C. Simpler collision models change the numerical factor but not the inverse dependence on pressure.
- μ | Viscosity of nitrogen at 20 °C, 17.56 µPa·s (NIST)
- m | Mass of a nitrogen molecule, 4.652 × 10⁻²⁶ kg
- T | 293.15 K
step: λ × p = 17.56 × 10⁻⁶ × √(π × 1.380649 × 10⁻²³ × 293.15 ÷ (2 × 4.652 × 10⁻²⁶)) = 6.49 × 10⁻³ Pa·m
step: At 200 Pa: λ = 6.49 × 10⁻³ ÷ 200 = 32 µm
```

## Viscosity that does not depend on pressure

The relation above contains a prediction that seems wrong at first sight. Viscosity is the transfer of momentum across a flowing gas by molecules moving between faster and slower layers. Halve the pressure and there are half as many molecules to carry momentum, but each travels twice as far between collisions and so carries it across twice the distance. The two effects cancel: kinetic theory predicts that a gas's viscosity is **independent of its pressure**, over the range where the mean free path is small compared with the apparatus.

Maxwell made the prediction in the nineteenth century and confirmed it by experiment, and it remains one of kinetic theory's classic results. NIST's data show it plainly for nitrogen at 20 °C:

- at **0.1 MPa**, about atmospheric pressure, viscosity is **17.573 µPa·s**;
- at **100 Pa**, a thousand times lower, it is **17.560 µPa·s**.

A thousandfold drop in pressure changes the viscosity by 0.07%. Thermal conductivity, which works the same way with energy in place of momentum, behaves the same: 0.025472 and 0.025439 W/(m·K) at the same two pressures, a change of 0.13%.

The cancellation fails when the mean free path becomes comparable with the size of the apparatus, because molecules then travel from wall to wall instead of from layer to layer, and the wall, not other molecules, limits how far they carry momentum and energy. Below that point, a gas's thermal conductivity falls in proportion to pressure, and that is exactly the effect a Pirani gauge uses to measure pressure (Chapter 9).

```figure
type: compare
title: Nitrogen's viscosity and thermal conductivity at 20 °C, NIST data
rowhead: Pressure
cols: Viscosity, µPa·s | Thermal conductivity, W/(m·K) | Mean free path
caption: A thousandfold change in pressure changes viscosity by 0.07% and thermal conductivity by 0.13%, as kinetic theory predicts while the mean free path is small compared with the apparatus.
- 0.1 MPa | 17.573 | 0.025472 | 65 nm
- 100 Pa | 17.560 | 0.025439 | 65 µm
- Change | 0.07% | 0.13% | a thousandfold
```

## Other gases

The same relation gives the mean free path of any gas from its viscosity and molecular mass. NIST gives, at 20 °C and 1 kPa, a viscosity of **19.61 µPa·s** for helium and **9.55 µPa·s** for water vapour. Then:

- helium: λ × p = **1.92 × 10⁻² Pa·m**, three times nitrogen's, so about **96 µm** at 200 Pa;
- water vapour: λ × p = **4.40 × 10⁻³ Pa·m**, about two thirds of nitrogen's, so about **22 µm** at 200 Pa;
- nitrogen, for comparison: 6.49 × 10⁻³ Pa·m, **32 µm** at 200 Pa.

Helium's long mean free path comes from its small molecules and high speed: it reaches the molecular regime at about three times the pressure nitrogen does in the same pipe. Water vapour's shorter one comes from its stronger interactions between molecules. In a mixture, each gas has its own mean free path, which depends on collisions with all the others, and the figures above are a guide to the regime rather than exact values for a mixture.

## Why the regime decides the equipment

The regime does not only choose a formula. It decides what kinds of equipment work.

- **Pumps.** Mechanical pumps that trap and compress pockets of gas, such as rotary vane, diaphragm, scroll and screw pumps, work from atmospheric pressure in the viscous regime. Pumps that act on individual molecules, such as turbomolecular pumps, which knock molecules towards the exhaust with fast-moving blades, work only when the gas is near molecular, and need a mechanical backing pump below them.
- **Seals and valves.** In viscous flow a small gap leaks as a fluid would, and for laminar flow of a gas through a long gap the throughput goes as the difference of the squares of the pressures on each side; in molecular flow, gaps leak in proportion to the pressure difference itself, and a gap's geometry matters in a different way.
- **Gauges.** Gauges that depend on the gas's thermal conductivity work only where the mean free path is comparable with their own dimensions (Chapter 9).
- **Heat.** Gas in the viscous regime carries heat between surfaces almost as well as at atmospheric pressure, as the thermal conductivity figures above show. In the molecular regime it carries almost none, which is why vacuum insulates so well, and why a part being dried or degassed in a good vacuum warms only by radiation and contact.

VC-200's equipment, an oil-sealed rotary vane pump, a 25 mm hose and a capacitance diaphragm gauge, is all suited to the viscous regime in which it works.

## The Knudsen number

The ratio that decides how a gas flows is the mean free path divided by a characteristic size of the apparatus, usually a pipe's diameter d. It is the **Knudsen number**:

Kn = λ ÷ d

Three flow regimes are distinguished by it. The boundaries are guide values, and sources draw them in slightly different places:

- **Viscous flow**, Kn below about 0.01: molecules collide with each other far more often than with the walls. The gas flows as a fluid, with viscosity, laminar or turbulent flow, and pressure-driven bulk motion. Conductance depends on pressure.
- **Molecular flow**, Kn above about 0.5: molecules mostly collide with the walls, not each other. Each molecule's path is independent, and the "flow" is the net result of random flights. Conductance does not depend on pressure.
- **Transitional flow** in between, where neither description is exact and conductance is estimated by blending the two.

## VC-200's regime

This is an illustration. For VC-200's 25 mm hose:

- at atmospheric pressure, Kn = 64 nm ÷ 25 mm = **2.6 × 10⁻⁶**: deeply viscous;
- at 200 Pa, Kn = 32 µm ÷ 25 mm = **1.3 × 10⁻³**: still viscous;
- at 10 Pa, Kn = **0.026**: just into the transitional range;
- at about **0.52 Pa**, Kn reaches **0.5**: molecular below that.

The 0.6 m chamber stays viscous even longer: its Knudsen number at 200 Pa is 5.4 × 10⁻⁵. VC-200's whole working range, from atmosphere down to 200 Pa, is viscous flow. Its hose behaves as a pipe carrying a fluid, and Chapter 4 calculates its conductance with the viscous formula. The future silicone process at 1 Pa (Chapter 2) would put the hose in transitional flow, Kn = 0.26, where neither simple formula is exact.

```figure
type: decision
title: Which flow regime applies
question: What is the Knudsen number, mean free path divided by the pipe's diameter?
caption: Guide values; sources draw the boundaries slightly differently. Find the regime before choosing a conductance formula.
- *Below about 0.01 | viscous flow; conductance rises with pressure | VC-200's hose from atmosphere to below 26 Pa
- 0.01 to about 0.5 | transitional; blend the viscous and molecular results | the hose from about 26 Pa down to about 0.5 Pa
- Above about 0.5 | molecular flow; conductance independent of pressure | the hose below about 0.5 Pa
```

## Turbulence at the start

Viscous flow is itself divided into laminar and turbulent flow by the Reynolds number, Re = ρ v d ÷ μ, where ρ is the gas density and v its mean velocity in the pipe. At the start of a pump-down, when the chamber is near atmospheric pressure, the gas moves fast and is dense.

This is an illustration. VC-200's pump takes in 4.44 L/s at its inlet whatever the pressure, so the gas in the 25 mm hose, whose bore area is 4.91 cm², moves at about 9.05 m/s near the pump. At atmospheric pressure, nitrogen's density is 1.165 kg/m³, and Re = 1.165 × 9.05 × 0.025 ÷ 17.56 × 10⁻⁶ = about **15,000**: turbulent. At 10 kPa the density is a tenth of that, and Re is about **1,480**: laminar. Below about 10 kPa, the hose carries laminar viscous flow, the case the simple viscous conductance formula describes. Above it, the flow is turbulent, the hose's resistance is higher than the laminar formula predicts, and the first moments of pump-down are slightly slower than a laminar calculation suggests. For VC-200 the effect is small, because the hose's conductance at those pressures is hundreds of times the pump's speed anyway (Chapter 4).

## Collisions and the time scale

The mean free path also gives the rate at which each molecule collides with others: its mean speed divided by its mean free path. At 200 Pa, that is 471 ÷ 32.5 × 10⁻⁶ = about **1.45 × 10⁷** collisions a second, nearly fifteen million. At atmospheric pressure it is about seven thousand million. In viscous flow, these collisions are what keep the gas behaving as a fluid: any molecule that wanders ahead of the flow is knocked back into it within microseconds.

## The error: the molecular formula in viscous flow

This is an illustration. When VC-200 was first specified, a junior engineer checked whether its 1.5 m of 25 mm hose would throttle the pump. Using a vacuum handbook's formula for a long tube, they found a conductance of **1.28 L/s**, less than a third of the pump's 4.44 L/s, giving an effective speed at the chamber of about 1.0 L/s. On that basis, pump-down to 200 Pa would take more than four times as long as the pump alone, and the engineer recommended a larger bore line and a larger pump.

The formula was the one for **molecular** flow. A senior engineer asked for the Knudsen number first: at 200 Pa, Kn = 0.0013, viscous. In viscous flow, the same hose's conductance at a mean pressure of 200 Pa is about **72.8 L/s** (Chapter 4), sixteen times the pump's speed, and the hose barely throttles it. The proposed larger pump and line were not needed.

The rule the engineers wrote down was simple: find the mean free path and the Knudsen number at the working pressure before choosing any conductance formula. The molecular formula would have been right for VC-200's hose below about half a pascal, a range the chamber never reaches.

```figure
type: checklist
title: Regime checks before any flow calculation
caption: The regime decides the formula; the formula decides the answer. The last line is this chapter's error.
- Mean free path at the working pressure | 32 µm at 200 Pa for nitrogen at 20 °C
- Knudsen number for each pipe and the chamber | hose 0.0013; chamber 0.000054
- Reynolds number at the start of pump-down | about 15,000 at atmospheric pressure; laminar below about 10 kPa
- Formula chosen to suit the regime | viscous for VC-200's whole working range
- Transitional range flagged for blending | the hose between about 26 Pa and 0.5 Pa
- x Molecular formula used in viscous flow | 1.28 L/s predicted; about 72.8 L/s in fact
```

## Exercise: a freeze dryer's line

A freeze dryer works at **10 Pa** and connects to its pump through a 40 mm bore line. Find the mean free path of nitrogen at 20 °C, the Knudsen number of the line, and its regime. Then find the pressure at which the line becomes molecular, taking Kn = 0.5 as the boundary.

**Worked answer.**

- Mean free path: 6.49 × 10⁻³ ÷ 10 = **0.65 mm**.
- Knudsen number: 0.65 ÷ 40 = **0.016**, just into the transitional range.
- Molecular below: λ = 0.5 × 40 mm = 20 mm, so p = 6.49 × 10⁻³ ÷ 0.020 = **0.32 Pa**.

At 10 Pa the line is near the viscous end of transitional flow, and a viscous conductance calculation will be close, though slightly optimistic. Much of a freeze dryer's gas is water vapour, whose mean free path at the same pressure differs from nitrogen's, and its condenser, not its pump, removes most of that vapour; the regime check should be made for the gas actually flowing.
