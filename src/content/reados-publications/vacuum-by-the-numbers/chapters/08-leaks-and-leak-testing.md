---
book: vacuum-by-the-numbers
chapterSlug: leaks-and-leak-testing
order: 8
title: "Leaks and leak testing"
description: "Leak rate units, telling a leak from outgassing and virtual leaks, rate-of-rise testing, helium leak detection, temperature effects, and a leak hunted bottom up."
draft: false
---

Every vacuum system leaks. The question is never whether, but how much, and whether that much matters. A leak's throughput is constant: it never tires, never dries out, never declines with pumping, and so it sets a permanent floor under everything else. For VC-200, working at 200 Pa, a leak has to be large to matter. For a leak-test station or a high-vacuum chamber, a leak too small to hear or see can make the system useless. Either way, leaks have to be measured, told apart from the gas loads of Chapter 7, and found.

This chapter sets out leak rate units, shows how to tell a real leak from outgassing and from a virtual leak, applies a rate-of-rise test to VC-200 with an acceptance criterion, explains helium leak detection and why helium is used, deals with temperature's effect on leak tests, and ends with a leak hunt that went the wrong way up the chamber.

## Leak rates and their units

A leak is a throughput, so its rate is measured in pressure-volume per second. Several units are in use, and converting between them is routine.

- **Pa·m³/s**, the SI unit used in this book.
- **mbar·L/s**, common on leak detectors: 1 mbar·L/s = 100 Pa × 0.001 m³ ÷ s = **0.1 Pa·m³/s**.
- **Torr·L/s**: 1 Torr·L/s = **0.133 Pa·m³/s**.
- **atm·cc/s**, or "standard cc per second", common in American specifications: 1 atm·cm³/s = **0.101 Pa·m³/s**.

The mbar·L/s and atm·cc/s are within about 1.3% of each other, close enough to be confused but not equal. Leak specifications run over many orders of magnitude: a leak of 10⁻² Pa·m³/s is gross by laboratory standards, and leak detectors routinely find leaks a million times smaller.

```figure
type: compare
title: Leak rate units
rowhead: Unit
cols: In Pa·m³/s | Typical use
caption: All four are pressure times volume per second, and all are throughputs. The conversions are exact from their definitions.
- * Pa·m³/s | 1 | SI; this book
- mbar·L/s | 0.1 | leak detectors and European data
- Torr·L/s | 0.133 | older and American vacuum data
- atm·cc/s | 0.101 | American leak specifications
```

## Leak or outgassing

A rate-of-rise test, isolating the chamber from the pump and recording the pressure (Chapter 7), measures the total gas load. Its shape over time distinguishes the sources.

- A **real leak** from the atmosphere has a constant throughput, as long as the chamber's pressure is small compared with atmospheric. The pressure rises in a **straight line**, and keeps rising until it approaches atmospheric pressure.
- **Outgassing and vapour** come from sources inside the chamber that approach equilibrium. The pressure rises quickly at first and then **levels off**, as vapours approach their saturation pressures and surfaces their equilibrium with the gas.
- Real chambers show both: a curve that bends at first and then becomes a straight line, whose slope is the leak.

Recording the rise for long enough to see its shape is the key. A minute's rise shows the total; ten or twenty minutes show which part will level off and which part will not.

```figure
type: decision
title: Reading a rate-of-rise curve
question: How does the pressure rise after the pump is isolated?
caption: Record long enough to see the shape. Most chambers show some of each; the straight part's slope is the leak.
- *Straight line that keeps rising | constant throughput from outside | a real leak; find and fix it
- Rises fast, then levels off | sources inside approaching equilibrium | outgassing or vapour; dry, warm or wait
- Bends at first, then straight | both together | the straight part's slope is the leak
```

## VC-200's rate-of-rise test

This is an illustration. With the chamber empty, dry and closed since its last cycle, VC-200 is pumped to 200 Pa, isolated, and its pressure logged for 20 minutes. The rise is about 3 Pa in the first minute, settling to a steady **3 Pa per minute** after about five minutes.

- Steady throughput: Q = V × dp/dt = 0.2 × 3 ÷ 60 = **0.01 Pa·m³/s**, 0.1 mbar·L/s.
- Floor it sets with the pump running: 0.01 ÷ 0.00391 = **2.6 Pa**.

For a process at 200 Pa, a floor of 2.6 Pa is negligible. The shop sets an acceptance limit for VC-200 of a steady rise no greater than **6 Pa per minute** at 200 Pa, 0.02 Pa·m³/s, checked monthly and after any work on the door, viewport, valves or hose. The limit is deliberately well below anything that would affect the process, so that a seal starting to fail is caught long before it matters.

A leak-test chamber for components, by contrast, may need its own leak rate a thousand times smaller, because its whole purpose is to detect small leaks in the parts placed in it.

The test is only as good as its record. The shop logs each monthly result, the date and what was done to the chamber since the last test, so that a slow upward trend, the usual sign of a seal hardening or a fitting working loose, is visible months before the acceptance limit is reached.

```figure
type: formula
title: Leak rate from a rate-of-rise test
formula: Q = V × Δp ÷ Δt
caption: This is an illustration for VC-200, empty and dry, from the steady part of a 20-minute rise. The early, faster rise is vapour from the walls.
- V | Chamber volume, 0.2 m³
- Δp ÷ Δt | Steady rise, 3 Pa per minute
step: Q = 0.2 × 3 ÷ 60 = 0.01 Pa·m³/s = 0.1 mbar·L/s
step: Floor with 3.91 L/s: 0.01 ÷ 0.00391 = 2.6 Pa
step: Acceptance limit: 6 Pa per minute, 0.02 Pa·m³/s
```

## Virtual leaks

A **virtual leak** is gas trapped inside the vacuum system that escapes slowly into the chamber: the space at the bottom of a blind tapped hole under a screw, the gap behind a seal in a poorly designed groove, a double weld with a pocket between the passes, the inside of a hollow part. It behaves like a real leak for a time, a steady throughput, but it is finite and eventually runs out, and no amount of searching on the outside of the chamber will find it.

Virtual leaks are designed out: vented screws or vented tapped holes, seal grooves that do not trap volumes, single full-penetration welds made from the vacuum side, and no hollow parts sealed at atmospheric pressure inside the chamber. VC-200's internal shelf brackets are fixed with vented screws, which have a hole drilled along their axis for exactly this reason.

## Helium leak detection

The total leak rate says how much; finding where takes a tracer. The most widely used method connects a **helium leak detector**, a small mass spectrometer tuned to helium's mass of four, to the vacuum system, and sprays helium on the outside of the suspect joints one at a time. Helium that enters through a leak is pumped through the detector, which reports its throughput.

Helium suits the job for reasons that come straight from kinetic theory and from its chemistry.

- **It is rare in air**, about five parts per million, so the detector's background is low and a small leak stands out.
- **It is light and fast.** Its mean speed at 20 °C is 1,245 m/s, 2.65 times nitrogen's (Chapter 2), so it passes through small leak paths readily, especially those in molecular flow, where conductance goes with speed.
- **It is inert and harmless** at the quantities used.
- **It rises.** Being far lighter than air, helium sprayed outside a chamber drifts upward, which matters for how a leak is hunted.

The detector has a response time set by its own volume and pumping speed and by the system's, and a sprayed joint must be watched for long enough to see a signal before moving on. For VC-200, the shop connects a hired detector through a tee in the pump line.

```figure
type: steps
title: Hunting a leak with helium on VC-200
caption: An outline for orientation; the detector maker's instructions govern its connection and calibration. Spraying from the top down keeps rising helium from reaching leaks above the joint being tested.
- Measure the total | rate of rise, to know the size of what is being hunted
- Connect and check the detector | through a tee in the pump line; check with a calibrated leak
- Spray from the top down | small puffs, one joint at a time, waiting for the response
- Confirm the location | repeat with a smaller puff and a shielded nozzle
- Repair and re-measure | rate of rise back within the acceptance limit
```

## Other leak tests

Helium spraying with a detector on the vacuum side is the most sensitive common method, but not the only one, and the right method depends on the size of leak that matters.

- **Rate of rise**, as above, measures the total and needs only a good gauge. It cannot locate a leak, and its sensitivity is limited by outgassing and temperature.
- **Bubble testing** pressurises the part or chamber slightly with air and brushes or immerses its joints in a soap solution or water. It finds moderate leaks cheaply and locates them exactly. A vacuum chamber can be tested this way only if it is designed to take a small internal pressure, and the pressure must be kept within what its door, viewport and seals are rated for.
- **Sniffing** fills the part with helium, or a helium mixture, at slightly above atmospheric pressure and passes a sniffer probe connected to a detector over its outside. It suits parts that will be pressurised in service and is less sensitive than spraying into a vacuum.
- **Pressure decay** pressurises a part and measures the fall in pressure over time; it is common for production testing of components, with the temperature precautions described below.
- **Ultrasonic** listening finds leaks in pressurised systems by the hiss of escaping gas, and is the usual tool for compressed-air leak surveys; it is of little use on a vacuum chamber, whose leaks draw air in quietly.

VC-200's routine check is a rate of rise; when that fails, a helium hunt locates the leak.

## Where vacuum chambers leak

Most leaks in a chamber like VC-200 are at joints, not in the steel.

- **Elastomer seals**, door seals, O-rings and gaskets, leak when they are damaged, dirty, dry, compressed unevenly or worn hard. Hair and dust across a door seal are a common cause after cleaning. A seal is wiped clean and inspected every time the door is serviced, and greased only as the maker directs; too much vacuum grease collects dirt and outgasses.
- **Hose connections** on barbed fittings with hose clamps are a weak point; clamped vacuum fittings with centring rings and O-rings seal more reliably and are easier to check.
- **Valves** leak across their seats, which shows as a pressure rise in a chamber isolated by a closed valve, and through their stem seals, which shows from outside.
- **Welds and castings** occasionally have porosity or cracks, more often in fabricated chambers than in purchased ones.
- **Viewports and feedthroughs**, where glass or electrical conductors pass through the wall, have their own seals, which age with heat and ultraviolet light.

Elastomer seals also let atmospheric gas **permeate** through them slowly, a small, constant load that behaves like a tiny leak and cannot be found with a spray; it is reduced by choosing seal materials suited to vacuum and by keeping seal cross-sections exposed to the atmosphere small.

## Temperature and leak tests

A sealed volume of gas changes pressure with temperature, p ∝ T, and a rate-of-rise or pressure-decay test cannot tell that change from a leak.

- At VC-200's 200 Pa, a 1 °C warming of the gas raises the pressure by 200 ÷ 293.15 = **0.68 Pa**, about a quarter of a minute's rise from its small leak. Over a 20-minute test the effect of a warming room is small but not negligible, which is one reason the shop reads the steady slope rather than the total rise.
- A **pressure-decay** test on a component pressurised to 600 kPa absolute is far more sensitive to temperature: a change of only 0.1 °C in the trapped air changes its pressure by **205 Pa**, which can be larger than the leak being tested for. Pressure-decay test stations stabilise the part's temperature first, compensate with a temperature measurement, or test against a reference volume at the same temperature.

## The error: a leak hunted from the bottom up

This is an illustration. VC-200's monthly rate-of-rise check showed a steady rise of **15 Pa per minute**, 0.05 Pa·m³/s, five times its usual figure and well over its acceptance limit. The floor that leak set with the pump running, 0.05 ÷ 0.00391 = 13 Pa, did not yet affect the 200 Pa process, but the trend was wrong.

The maintenance technician hired a helium leak detector and began spraying at the bottom of the door seal, working upward. The detector responded strongly at the lower door clamp, and the door seal was replaced there. The next rate-of-rise test showed no change.

On the second attempt, with the supplier's technician, the hunt started at the **top**. The detector responded at the viewport gasket, above the door's centre, and nowhere else. The first hunt had been fooled by the helium's buoyancy: helium sprayed at the lower clamp had drifted up the face of the door to the leaking viewport and entered there, so the detector had responded while the nozzle was pointed at an innocent joint. The viewport gasket was replaced, the rate of rise fell to 3 Pa per minute, and the shop's procedure now says to spray from the top down, with small puffs, and to confirm any response with a shielded nozzle before anything is dismantled.

```figure
type: checklist
title: Leak checks for a vacuum chamber
caption: Measure, read the curve, then hunt. The last line is this chapter's error.
- Rate of rise logged long enough to see its shape | 20 minutes; steady 3 Pa per minute
- Leak rate in one unit, compared with an acceptance limit | 0.01 against 0.02 Pa·m³/s
- Virtual leaks designed out | vented screws; no trapped volumes
- Temperature steady during the test | 0.68 Pa per °C at 200 Pa
- Helium sprayed from the top down; responses confirmed | shielded nozzle before dismantling
- x Hunt started at the bottom | rising helium blamed the door clamp for the viewport's leak
```

## Exercise: a leak-test chamber's specification

A component leak-test chamber of **50 L** must have a background leak no greater than **1 × 10⁻⁵ Pa·m³/s**. What steady rate of rise, in pascals per minute, corresponds to that? If its pump's effective speed is 10 L/s, what floor does such a leak set? Express the leak in mbar·L/s and atm·cc/s.

**Worked answer.**

- Rate of rise: Δp ÷ Δt = Q ÷ V = 1 × 10⁻⁵ ÷ 0.05 = 2 × 10⁻⁴ Pa/s = **0.012 Pa per minute**.
- Floor: 1 × 10⁻⁵ ÷ 0.010 = **1 × 10⁻³ Pa**.
- Units: **1 × 10⁻⁴ mbar·L/s**, or about **9.9 × 10⁻⁵ atm·cc/s**.

A rise of 0.012 Pa a minute is far below what a rate-of-rise test with an ordinary gauge can resolve against outgassing and temperature effects at that pressure, so a chamber with a specification like this is qualified with a helium leak detector rather than by rate of rise alone.
