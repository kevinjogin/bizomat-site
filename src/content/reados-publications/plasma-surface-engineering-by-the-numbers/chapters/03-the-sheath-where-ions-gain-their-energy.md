---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: the-sheath-where-ions-gain-their-energy
order: 3
title: "The sheath: where ions gain their energy"
description: "Why a charged sheath forms where a plasma meets a surface, how fast ions enter it, how thick it is, what energy ions arrive with, and how a Langmuir probe measures the plasma."
draft: false
---

Every useful thing a plasma does to a part happens within a few millimetres of its surface, in a layer that does not glow: the sheath. The plasma itself is nearly neutral and carries only small electric fields. The sheath carries almost all of the voltage between the plasma and the part, and it is there that ions are accelerated into the surface, delivering the energy that heats a load in a nitriding vessel, scrubs oxide off a tool before coating, and packs a growing PVD coating into a dense, hard layer.

This chapter explains why sheaths form, how fast ions enter them, how thick they are and what energy ions carry when they arrive, and why the answers differ so much between PN-1 at 300 Pa and PV-1 at 0.5 Pa. It then describes the Langmuir probe, the simplest instrument for measuring a plasma, and ends with a planetary fixture whose worn contact left some parts floating, coated by ions with a tenth of the energy the bias supply was meant to give them.

## Why a sheath forms

Electrons in a plasma move hundreds of times faster than ions, because they are thousands of times lighter and much hotter. If a surface were simply placed in a plasma with no voltage on it, electrons would reach it far more often than ions and charge it negatively. The surface therefore settles at a negative potential relative to the plasma, just negative enough to repel most electrons so that the electron and ion currents reaching it balance. That potential is the floating potential.

The negative surface repels electrons and attracts ions, so next to it the ion density exceeds the electron density: a layer of net positive charge, a few Debye lengths thick, across which the potential falls. That layer is the sheath. A surface driven more negative by a power supply, as the parts in PN-1 and PV-1 are, simply has a thicker sheath with a larger voltage across it; nearly all of the extra voltage appears across the sheath, not the plasma.

## The Bohm criterion and the ion flux

For a stable sheath to form, ions must enter it already moving towards the surface at a minimum speed, the Bohm speed, which depends on the electron temperature and the ion mass. A weak electric field in the plasma just outside the sheath, the presheath, accelerates them to that speed. The flux of ions into the sheath, and so the ion current reaching the surface, is then fixed by the plasma density and the Bohm speed, whatever the voltage on the surface.

```figure
type: formula
title: Bohm speed and ion current density at a sheath edge
formula: u_B = √(e × T_e ÷ M)
formula: J_i ≈ 0.61 × n × e × u_B
caption: u_B is the Bohm speed (m/s), T_e the electron temperature in volts, M the ion mass (kg), n the plasma density in the bulk (per m³) and J_i the ion current density at the surface (A/m²). The factor 0.61 allows for the fall of density through the presheath. The ion current does not depend on the sheath voltage, which is why a glow's current is set by its density.
- u_B | Bohm speed
- J_i | ion current density
- n | plasma density
```

```figure
type: compare
title: Bohm speed and ion current density at 2 eV and 10¹⁶ m⁻³
cols: Ion mass | Bohm speed | Ion current density
rowhead: Ion
- * Argon, Ar⁺ | 40 u | 2,200 m/s | 2.15 A/m²
- Nitrogen, N₂⁺ | 28 u | 2,630 m/s | 2.57 A/m²
- Hydrogen, H₂⁺ | 2 u | 9,820 m/s | 9.6 A/m²
caption: Calculated from the formulas above. Light ions enter the sheath faster, so a hydrogen-rich plasma carries more ion current at the same density, one reason hydrogen-rich mixtures heat a load readily.
```

The numbers can be checked against PN-1. Chapter 2 found an average current density of about 28 A/m² on order 27's load. Some of that current is electrons released from the parts by the arriving ions; if they add about a tenth, the ion current is about 25.5 A/m². For nitrogen ions at 2 eV that needs a plasma density of about 10¹⁷ per cubic metre near the parts, ten times the round figure used in Chapter 1. That is typical: the abnormal glow close to the cathode is denser than the bulk of the chamber.

## How thick is the sheath?

For a sheath with a large voltage across it and no collisions inside it, the space charge of the ions crossing it limits the current it can carry, and that sets its thickness. The result, known as Child's law, gives a thickness of a few Debye lengths multiplied by the ratio of the sheath voltage to the electron temperature raised to the three-quarters power.

```figure
type: formula
title: Collisionless sheath thickness by Child's law
formula: s ≈ (√2 ÷ 3) × λ_D × (2V ÷ T_e)^(3/4)
caption: s is the sheath thickness, λ_D the Debye length, V the voltage across the sheath and T_e the electron temperature in volts. The formula assumes ions cross the sheath without colliding; at high pressure it gives only the order of magnitude.
- s | sheath thickness
- V | sheath voltage
- λ_D | Debye length
```

For PN-1's parts, with a plasma density of 10¹⁷ m⁻³ and an electron temperature of 2 eV, the Debye length is 0.033 mm and a 600 V sheath comes out about 1.9 mm thick. For PV-1, with 5 × 10¹⁶ m⁻³ at 3 eV and 100 V of bias on the parts, the Debye length is 0.058 mm and the sheath about 0.63 mm thick. Both are millimetres thick, which is why the glow in PN-1 follows the parts' outlines so closely and why fine features smaller than a millimetre or two are smoothed over by the glow rather than followed into.

## What energy do ions arrive with?

Here the two machines part company. An ion crossing a sheath without collisions gains the full sheath voltage: in PV-1, with 100 V of bias and a mean free path of about 28 mm against a sheath of 0.63 mm, almost every argon or nitrogen ion strikes the growing coating with close to 100 eV plus the few volts of the plasma potential. That energy is controllable, and Chapter 7 shows how bias voltage controls the density and stress of a coating.

In PN-1 the mean free path, about 60 µm, is about thirty times shorter than the 1.9 mm sheath. An ion crossing it collides repeatedly with gas molecules. The most important collision is charge exchange: a fast ion takes an electron from a slow molecule, becoming a fast neutral that continues to the surface while the newly made slow ion starts accelerating again. The result is a broad spread of energies at the surface, most ions and fast neutrals arriving with tens of electron-volts rather than the full 600 eV. The total energy delivered still matches the electrical power, since every bit of it ends up as heat in the load, the gas or the walls, but it arrives in many small packets rather than few large ones.

```figure
type: compare
title: Sheaths in the shop's two machines
cols: PN-1 plasma nitriding | PV-1 sputter coating
rowhead: Quantity
- Plasma density near the parts | about 10¹⁷ m⁻³ | about 5 × 10¹⁶ m⁻³
- Electron temperature | about 2 eV | about 3 eV
- Voltage on the parts | about 600 V | 100 V bias
- Sheath thickness, Child's law | about 1.9 mm | about 0.63 mm
- Mean free path | about 0.06 mm | about 28 mm
- * Collisions in crossing the sheath | about 30 | almost none
- Typical ion energy at the surface | a broad spread, mostly tens of eV | close to 100 eV
- Ion current density | about 25 A/m² | about 13 A/m² of argon
caption: This is an illustration. Densities and temperatures are typical values for these discharges; sheath thicknesses from Child's law, which at PN-1's pressure gives only the order of magnitude.
```

## The energy budget at the surface

The sheath is also where a plasma machine's power is spent. In PN-1, almost all of the 24 kW flowing into order 27's load arrives as the kinetic energy of ions and fast neutrals striking the parts and is turned into heat in their surfaces. That is the whole heating system: PN-1 has no heating elements in its working space, and the load reaches 520 °C because the glow delivers about 17 kW per square metre of surface and the load loses that heat by radiation and gas conduction to the cooler walls. Chapter 5 balances the two. The secondary electrons that leave the parts carry a small share of the power away into the glow, where it ionises and excites the gas, and eventually reaches the walls.

In PV-1 the bias current is smaller and so is the voltage. With argon ions arriving at about 13 A/m² and 100 V, the bombardment delivers about 1.3 kW per square metre of part surface. That is enough to keep a load of cutters at a few hundred degrees during coating, on top of the heat from the condensing coating atoms and the radiation from the hot targets, which is why a load's temperature during coating depends on the bias, the target power and the load's mass as well as on any heaters in the chamber. Parts whose hardness depends on a low tempering temperature must be checked against the temperature they will reach during coating, not only against the coater's heater setting.

## Pulsed and radio-frequency bias

A DC bias works only if the surface conducts. If the parts are insulating, or are being coated with an insulating film such as aluminium oxide, ions arriving at the surface deposit positive charge that cannot flow away. Within microseconds the surface charges up towards the floating potential, the sheath voltage collapses and the bombardment stops; worse, the charged film can break down in small arcs that damage the coating.

Two remedies are common. A pulsed DC bias reverses the voltage briefly, for a few microseconds at tens to hundreds of kilohertz, so that electrons from the plasma neutralise the accumulated charge before the next negative pulse. A radio-frequency bias, usually at 13.56 MHz, alternates so fast that electrons, being much more mobile than ions, charge the surface negative on average, a self-bias that keeps ions arriving with a controlled energy even on an insulator. CrN conducts well enough for PV-1's pulsed DC bias, which the shop uses mainly because it reduces arcing on edges and contaminated spots during the early part of a run.

## Measuring a plasma with a Langmuir probe

The simplest way to measure a plasma's density and electron temperature is to put a small electrode into it and record the current it draws as its voltage is swept. That is a Langmuir probe, after Irving Langmuir, who developed the method in the 1920s. A typical probe is a tungsten wire a fraction of a millimetre across and a few millimetres long, sleeved in ceramic except at its tip. It is small enough not to disturb the plasma much, and cheap enough to replace when coating builds up on it, as it does quickly in a PVD chamber. Production machines rarely carry one permanently; the shop uses a probe when commissioning a new process or chasing an unexplained change, and relies on voltages, currents and the glow's spectrum in daily running.

The current–voltage curve has three regions. Far negative, the probe repels nearly all electrons and draws only the ion current, which by the Bohm formula gives the density. Near the floating potential, where the net current is zero, the electron current rises exponentially as the probe becomes less negative, and the slope of the logarithm of that current gives the electron temperature: if the electron current rises by a factor of e for every 2 V, the electron temperature is 2 eV. Above the plasma potential the probe collects all the electrons it can and the current levels off.

```figure
type: steps
title: Reading a Langmuir probe curve
caption: This is an illustration. It shows the method. Real probe curves need care with the probe's own sheath, magnetic fields near magnetrons and contamination of the probe tip.
- Strongly negative probe | Ion saturation current, which gives n through J_i = 0.61 n e u_B
- Zero net current | Floating potential, below the plasma potential by about 4.7 T_e in argon
- Exponential rise of electron current | Slope of ln(I_e) against V gives 1 ÷ T_e
- Knee of the curve | Plasma potential
- * Above the knee | Electron saturation current
```

The floating potential has a practical meaning. Any insulated object in the plasma charges to it. In argon, it lies about 4.7 electron temperatures below the plasma potential: about 9.4 V at 2 eV, about 14 V at 3 eV. An electrically isolated part in a PVD chamber is therefore bombarded by ions of only about 10 to 15 eV, far less than the bias supply is meant to give.

## When it goes wrong: parts left floating

In one of PV-1's runs for order 27's carbide cutter batch, cutters on two of the twelve planetary spindles came out with a matt, slightly brownish CrN coating instead of the usual silvery grey, and a Rockwell indentation test (Chapter 9) showed flaking around the indent on those cutters only.

The bias supply's display showed −100 V throughout the run. But the bias reaches each cutter through the rotating planetary fixture: through bearings, a sliding contact and the spindle holders. On two spindles, a sliding contact had worn and collected coating debris, and those spindles had been electrically isolated for part of the run. The cutters on them floated at around −14 V relative to the plasma instead of −100 V, so the ions reaching them carried a tenth of the intended energy. Coatings grown with too little ion bombardment are porous and columnar, absorb gases, look dull and adhere poorly.

```figure
type: checklist
title: Checking bias continuity on PV-1's fixture
caption: This is an illustration. It shows the shop's revised procedure. The check takes ten minutes and is done after loading, with the chamber open.
- x Resistance from the bias feedthrough to every spindle holder, rotating the fixture by hand through a full turn
- x Reading below the shop's set limit at every position
- x Sliding contacts cleaned of coating debris at every chamber clean
- x Bias current per run recorded and compared with similar loads
- ? Spare contact set held in stock
```

The shop now measures the resistance from the bias feedthrough to each spindle holder after loading, turning the fixture through a full revolution, and records the bias current of every run, since a bias current noticeably lower than usual for a similar load means less of the load is connected. The affected cutters were stripped chemically and recoated at the shop's cost, and the customer was told why.

## Exercise: a denser argon plasma

During sputter cleaning in PV-1, a Langmuir probe gives a density of 4 × 10¹⁶ m⁻³ and an electron temperature of 3 eV in argon, and the parts are held at −200 V.

1. What are the Bohm speed and the ion current density at the parts?
2. What are the Debye length and the Child's law sheath thickness?
3. Roughly what energy do the argon ions arrive with, and why?

**Answer.**

1. u_B = √(3 × 1.602 × 10⁻¹⁹ ÷ (40 × 1.661 × 10⁻²⁷)) = 2,690 m/s. J_i = 0.61 × 4 × 10¹⁶ × 1.602 × 10⁻¹⁹ × 2,690 = 10.5 A/m².
2. λ_D = √(8.854 × 10⁻¹² × 3 ÷ (4 × 10¹⁶ × 1.602 × 10⁻¹⁹)) = 0.064 mm. s ≈ 0.471 × 0.064 × (2 × 200 ÷ 3)^0.75 = 1.19 mm.
3. Close to 200 eV plus the plasma potential, because at 0.5 Pa the mean free path, about 28 mm, is more than twenty times the sheath thickness, so the ions cross it with almost no collisions. That energy is well above the threshold for sputtering oxide and metal from the parts, which is what sputter cleaning needs (Chapter 4).
