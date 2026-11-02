---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: breakdown-and-the-glow-discharge
order: 2
title: "Breakdown and the glow discharge"
description: "How a gas breaks down into a glow discharge, why the voltage needed depends on pressure times gap, how normal and abnormal glows and arcs differ, and why holes in parts can overheat."
draft: false
---

A plasma nitriding vessel is, electrically, a very simple device. The load of parts sits on an insulated hearth connected to the negative terminal of a power supply; the chamber wall is earthed and acts as the positive electrode. Raise the voltage across a few hundred millimetres of low-pressure gas and, at some point, the gas stops insulating and starts to conduct with a glow. Exactly when that happens, what kind of glow forms and whether it stays a glow or collapses into an arc decide whether the parts are treated evenly or damaged.

This chapter explains how a gas breaks down: the electron avalanche, the part played by electrons knocked out of the cathode, and the Paschen curve that ties the breakdown voltage to the product of pressure and gap. It then describes the structure of the glow, the difference between the normal glow, the abnormal glow that nitriding uses and the arc that it must avoid, and the hollow cathode effect that makes holes in parts glow too brightly. It ends with order 27's cooling holes, which overheated in a trial run.

## The electron avalanche

A gas always contains a few free electrons. In an electric field, each is accelerated until it hits a molecule. If it has gained enough energy by then, it ionises the molecule, and now there are two electrons, each accelerated in turn. The number grows exponentially along the field, an avalanche, and the ions created drift the other way, towards the negative electrode, the cathode.

An avalanche on its own dies out when its electrons reach the anode. For the discharge to sustain itself, each avalanche must create at least one new electron at the cathode to start the next. That electron comes mostly from the ions striking the cathode: each ion has a small chance, typically a few per cent for metal surfaces, of knocking out an electron. The discharge becomes self-sustaining when the avalanche is large enough that the ions it produces release, on average, one new electron from the cathode. That condition defines breakdown.

## The Paschen curve

How much voltage is needed? Two effects pull in opposite directions. At high pressure the mean free path is short, so electrons collide before gaining enough energy to ionise, and a high field is needed. At very low pressure collisions are so rare that an electron may cross the gap without ionising at all, and again a high voltage is needed. Between the two lies a minimum. Paschen found in 1889 that the breakdown voltage depends not on pressure and gap separately but on their product, pd.

```figure
type: formula
title: Paschen's law for breakdown between parallel electrodes
formula: V_b = B × pd ÷ ln[A × pd ÷ ln(1 + 1 ÷ γ)]
caption: V_b is the breakdown voltage, p the pressure, d the gap, A and B constants of the gas and γ the number of electrons released at the cathode per incident ion. With textbook constants for air, A = 15 per cm·Torr, B = 365 V per cm·Torr and γ = 0.01, the minimum is about 305 V at pd ≈ 1.1 Pa·m. The formula is a simple model: it overestimates breakdown in air at atmospheric pressure by roughly a fifth, and real gases, electrode shapes and surfaces shift the curve.
- pd | pressure × gap, Pa·m
- γ | secondary electron yield of the cathode
- V_b | breakdown voltage, V
```

```figure
type: compare
title: Breakdown voltage by Paschen's law, air-like constants
cols: Breakdown voltage | Where it applies in the shop
rowhead: Pressure × gap
- 0.67 Pa·m | about 374 V | Left of the minimum: too few collisions
- * 1.1 Pa·m | about 305 V | Paschen minimum
- 2.7 Pa·m | about 390 V |
- 6.7 Pa·m | about 655 V |
- 13 Pa·m | about 1,050 V |
- 133 Pa·m | about 6,300 V | 1 cm of gas at about 13 kPa
caption: Calculated from Paschen's law with A = 15 cm⁻¹ Torr⁻¹, B = 365 V cm⁻¹ Torr⁻¹ and γ = 0.01, values used in textbooks for air; nitrogen–hydrogen mixtures and argon have their own constants, so treat these as an illustration of the shape of the curve rather than design values.
```

The curve explains how PN-1 starts. Its hearth sits about 300 mm from the wall. At the 300 Pa working pressure that is pd = 90 Pa·m, and the formula gives about 4,600 V to break the gap down, far above the supply's 1,000 V. At 10 Pa it is about 410 V, and near 3.7 Pa it reaches the minimum, about 305 V. Below about 1.5 Pa, breakdown across that gap is not possible at any practical voltage. So PN-1's controller ignites the glow while the chamber is still being filled, at a few tens of pascals, and then raises the pressure; once the discharge is running, a lower voltage sustains it than was needed to start it.

```figure
type: steps
title: Starting PN-1's glow
caption: This is an illustration. It shows the shop's start sequence; each machine's controller has its own.
- Pump down below 5 Pa and check the leak rate | Air and water removed (Chapter 4)
- Admit hydrogen and argon to about 30 Pa | Near enough to the Paschen minimum to ignite easily
- Apply a few hundred volts, pulsed, at low current | Glow forms over the load; arcs are suppressed
- Raise pressure and power over about an hour | Sputter cleaning and heating together
- * Switch to the nitriding mixture at 300 Pa and 520 °C | Abnormal glow covering every surface
```

## The structure of a glow

A glow discharge is not uniform. Close to the cathode, the parts in PN-1, is a dark region a few millimetres thick, the cathode dark space, across which almost all the applied voltage falls. Ions entering it from the glow are accelerated towards the parts, and electrons knocked out of the parts are accelerated away from them. Beyond it is the bright negative glow, where those fast electrons spend their energy ionising and exciting the gas. That is the glow seen through the viewing port, wrapping the parts at a distance of a few millimetres. Further out, towards the earthed wall, the discharge is dimmer, and the voltage across it is small.

The cathode dark space is the sheath of Chapter 3 in its collisional, high-pressure form. Its thickness shrinks as pressure rises, roughly in inverse proportion, because ionising collisions happen over a shorter distance. At PN-1's 300 Pa it is a few millimetres; at a tenth of that pressure it would be several centimetres.

## Normal glow, abnormal glow and arcs

As the current through a glow is raised from a low value, the discharge first spreads across the cathode at a constant current density and constant voltage, covering more and more of it: the normal glow. Once it covers the whole cathode, further current can only come from a higher current density, which needs a higher voltage: the abnormal glow. Plasma nitriding runs in the abnormal glow, because only then does the glow cover every surface of every part and heat them all.

Raise the current density further and the discharge can change abruptly into an arc: the current concentrates into a tiny spot on the cathode, hot enough to emit electrons thermally, the voltage collapses to a few tens of volts and the current rises sharply. An arc on a part melts a small crater, can stain or pit a polished mould surface and wastes the energy that should be heating the load. Arcs start from sharp edges, dirt, oxide inclusions and insulating particles on the surface, which is one reason careful cleaning before nitriding matters (Chapter 4).

```figure
type: compare
title: Three regimes of a DC discharge
cols: Voltage | Current density at the cathode | Coverage | Use in surface engineering
rowhead: Regime
- Normal glow | roughly constant | roughly constant | Part of the cathode | Not used: uneven treatment
- * Abnormal glow | rises with current | rises with voltage | Whole cathode | Plasma nitriding, sputter cleaning
- Arc | collapses to tens of volts | very high, in a spot | A spot that moves | Must be suppressed in nitriding; used deliberately in cathodic arc PVD (Chapter 7)
caption: General behaviour of a DC glow discharge. Pulsed power supplies switch the voltage off for microseconds many thousands of times a second, which interrupts arcs before they grow and allows more power without arcing.
```

Modern plasma nitriding supplies are pulsed: the voltage is switched on and off at tens of kilohertz, and if the current rises suddenly, the signature of an arc, the supply cuts off within microseconds. PN-1 counts its arc events; a rising count during a run is a warning that something on the load is dirty or that the power is being pushed too hard.

## Voltage, current and power in PN-1

Once running, an abnormal glow is described by three numbers the controller displays: voltage, current and their product, the power. For order 27, PN-1 holds about 600 V and 40 A during nitriding, 24 kW. The current is spread over every surface of the load that the glow covers: the 24 inserts, each with a cylindrical surface of π × 0.06 × 0.15 = 0.0283 m² and two ends of 0.0028 m², about 0.0339 m² each and 0.814 m² in all, plus about 0.6 m² of fixtures, hearth plate and dummy parts. That is about 1.41 m², so the average current density is 40 ÷ 1.41 = 28 A/m², or 2.8 mA/cm², the unit plasma nitriding data usually use.

```figure
type: steps
title: Order 27 in PN-1: from settings to current and power density
caption: This is an illustration. Surface areas from the insert dimensions; the fixture area is the shop's estimate. Current density sets the heating and the rate of nitrogen supply per unit area, and must be kept below the level at which arcs become frequent.
- Voltage and current during nitriding | 600 V, 40 A
- Power, 600 × 40 | 24 kW
- Surface of one insert, side plus ends | 0.0339 m²
- Load surface: 24 inserts plus about 0.6 m² of fixtures | about 1.41 m²
- * Average current density | 28 A/m², 2.8 mA/cm²
- Average power density | about 17 kW/m²
```

The numbers matter for two reasons. The power is the heat input that holds the load at temperature, and Chapter 5 balances it against the heat the load loses. And the current density is set by the glow, not by the operator: it rises wherever the glow is more intense, at edges, in hollow cathodes and on thin sections. Two parts of different shape in the same load therefore heat at different rates, and a load mixing thin and massive parts needs care, dummy parts or a slower heat-up to keep them at the same temperature.

## Why the surface matters to the discharge

The secondary electron yield γ in Paschen's law is a property of the cathode's surface, not of the gas. Clean metal, oxidised metal and surfaces carrying oil films all release different numbers of electrons per ion, so the voltage needed to sustain the glow changes as the surface cleans up during the first hour of a run. Operators see this as the voltage drifting at constant current during heat-up, and a voltage that stays unusually high for a long time often means a dirty or heavily oxidised load.

Insulating patches are worse. A film of oxide, a spot of dried coolant or a ceramic fragment on a part collects positive charge from the arriving ions because it cannot conduct it away. The charge builds up a voltage across the thin film until it breaks down in a tiny discharge, which can start an arc on the metal around it. That is the main reason the shop treats cleaning as part of the process (Chapter 4), and why the insulators that hold the hearth off the chamber floor are shielded so that sputtered metal cannot coat them and short them out.

## The hollow cathode effect

When two surfaces of the cathode face each other across a gap of the right size, such as the walls of a hole or slot in a part, their dark spaces and negative glows overlap. Fast electrons from one wall are repelled by the dark space of the opposite wall and bounce back and forth, ionising far more effectively than they would near a single wall. The result is a much brighter, denser discharge inside the hole, carrying a high current density and delivering much more heat: the hollow cathode effect.

It happens when the hole's width is roughly between one and a few times the thickness of the dark space. Holes much narrower than the dark space stay dark, because the glow cannot enter them, and their walls are not treated; holes much wider behave like flat surfaces. Since the dark space thickness changes with pressure, a hole that is safe at one pressure can glow brightly at another.

## When it goes wrong: order 27's cooling holes

Each of order 27's core inserts has a blind cooling hole drilled along its axis, 10 mm in diameter and 120 mm deep, through which water will flow in the die. In a trial run with four sample inserts, the shop's thermocouple in a dummy insert read 520 °C, but after nitriding the inserts showed a darkened band around the mouth of each cooling hole and the hole walls themselves were rainbow-coloured.

At 300 Pa, a 10 mm hole was in the range where the hollow cathode effect appears. Its intense glow had heated the region around the hole mouth well above the load temperature, and the hole walls had been nitrided unevenly. A hardness check on a sectioned sample showed the core near the hole mouth had softened, a sign that it had been hotter than the steel's tempering temperature.

How was the cause confirmed? The shop's engineer repeated the trial with the viewing port camera recording and saw, as the pressure rose through about 200 Pa, each hole mouth light up as a bright spot much more intense than the glow on the surrounding surfaces. A thermocouple pushed into the hole of a dummy insert read about 60 K above the load temperature at its deepest point. Both observations pointed the same way, and both are now part of the shop's trial procedure for any new part with holes.

```figure
type: decision
title: Dealing with the cooling holes in order 27
caption: This is an illustration. The toolmaker did not need the cooling holes nitrided, so plugging them was acceptable.
- Lower the pressure so the dark space is wider than the hole | Changes the whole process; other surfaces suffer | Not adopted
- Accept the overheating | Softened steel near the hole mouth; unacceptable | Not adopted
- * Plug each hole with a close-fitting steel plug | Glow cannot enter; hole walls untreated, which suits the die | Adopted
- Shield the hole mouth with a cap at a set gap | Works, but each cap needs checking | Considered
```

The shop's job card for order 27 now records the plug size and the instruction to fit them, and the shop's general rule is to ask every customer which holes, threads and slots must be treated and which may be plugged before any part goes into PN-1. Threaded holes are a frequent culprit: their roots are narrow slots in which the glow concentrates, and they are usually plugged with threaded steel plugs, or protected with a commercial stop-off paste where the thread must stay soft for later machining.

## Exercise: igniting PV-1

PV-1's magnetron targets sit 100 mm from the parts, and the coater runs at 0.5 Pa.

1. What is pd for a plain discharge across 100 mm at 0.5 Pa, and how does it compare with the Paschen minimum of about 1.1 Pa·m?
2. Would a plain DC discharge across that gap start easily at 0.5 Pa?
3. Magnetron sputtering does run at 0.5 Pa and a few hundred volts. What must the magnetron be doing differently?

**Answer.**

1. pd = 0.5 × 0.1 = 0.05 Pa·m, more than twenty times smaller than the minimum, far to the left of the Paschen curve.
2. No. With so few collisions in the gap, an electron crosses it without ionising enough molecules, and the simple formula gives no breakdown voltage at all. A plain glow would need a much higher pressure or a much longer path.
3. It lengthens the electrons' path. The magnetron's magnets trap electrons in a magnetic field close to the target surface, where they circulate many times, ionising the gas as they go, before they escape. Chapter 7 explains how crossed electric and magnetic fields make them drift around the target in a closed loop.
