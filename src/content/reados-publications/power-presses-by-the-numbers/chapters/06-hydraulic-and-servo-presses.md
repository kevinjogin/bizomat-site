---
book: power-presses-by-the-numbers
chapterSlug: hydraulic-and-servo-presses
order: 6
title: "Hydraulic and servo presses"
description: "Sizing a 400 kN hydraulic press's cylinder, pressure, speed and power, its cycle time for MP-40 and AB-75, servo-driven presses, and the energy a compressed oil column releases at breakthrough."
draft: false
---

A hydraulic press works on a different principle from a crank press. Oil under pressure pushes a piston, and the force is the pressure times the piston's area, at any point in the stroke. There is no force curve and no flywheel to run out of energy: a hydraulic press delivers its full force at the top of its stroke as easily as at the bottom, and stops pushing when its relief valve opens, whatever the die does. What it gives up is speed, because the ram can move only as fast as the pump can fill the cylinder. A servo press keeps the crank and gains some of the hydraulic press's control, by driving the crank with a motor that can be told how to move.

This chapter sizes a 400 kN hydraulic press's cylinder, pressure, speed and power, works out its cycle time for Press 4's two jobs, describes servo presses and what they change, compares the three drives, and ends with the energy a hydraulic press stored in its oil and released at MP-40's breakthrough.

## Force from pressure and area

The ram's force is F = p × A, where p is the oil's pressure and A the piston's area. With p in megapascals and A in square millimetres, F is in newtons.

This is an illustration. A 400 kN hydraulic press with a cylinder of **150 mm** bore has a piston area of π × 150² ÷ 4 = **17,671 mm²**. To give 400 kN, it needs a pressure of 400,000 ÷ 17,671 = **22.6 MPa**. If its pump and valves are rated for 25 MPa, it could give 441.8 kN, and its relief valve is set to limit it to 400 kN, protecting the frame and the die.

The relief valve is a hydraulic press's great advantage. A double blank, a slug or a misplaced part makes the pressure rise to the relief setting, and the press stalls at its rated force. There is no flywheel to drive the ram through the obstruction, and no force curve to exceed above a rating point.

```figure
type: formula
title: Sizing a 400 kN hydraulic press
formula: F = p × A; v = Q ÷ A; P = p × Q
caption: This is an illustration: a 150 mm bore cylinder and a 40 L/min pump at the pressing pressure. Approach and return can be much faster, from a prefill valve or a second pump.
- A | Piston area, π × 150² ÷ 4 = 17,671 mm²
- p | Pressure for 400 kN, 400,000 ÷ 17,671 = 22.6 MPa
- Q | Pump flow, 40 L/min = 666,667 mm³/s
step: Pressing speed: v = 666,667 ÷ 17,671 = 37.7 mm/s
step: Hydraulic power while pressing: 22.6 MPa × 40 L/min = 15.1 kW
```

## Speed from flow

The ram moves as fast as oil fills the cylinder: v = Q ÷ A, where Q is the pump's flow. A pump delivering **40 litres a minute**, 666,667 mm³ per second, moves the 150 mm piston at 666,667 ÷ 17,671 = **37.7 mm/s** while pressing.

The power needed is pressure times flow: 22.6 MPa × 40 L/min = **15.1 kW** of hydraulic power while pressing at full force, before the losses in the pump and motor. A hydraulic press large enough to press quickly needs a large pump and motor; Press 4's mechanical candidate does the same work from a 7.5 kW motor, because its flywheel stores the energy between strokes.

Few hydraulic presses move at their pressing speed all the way. Most approach the work quickly, filling the cylinder from a tank through a large prefill valve, or with the ram falling under its own weight, or using a second, larger pump at low pressure; then they slow to pressing speed as the die meets the work; then they decompress the oil and return quickly. As an illustration, this chapter takes approach and return at **150 mm/s** and pressing at 37.7 mm/s, with 0.1 s to decompress and 0.3 s in all for the valves to shift at each change of direction and speed.

## Cycle times for Press 4's jobs

**MP-40**, with the stroke set to 30 mm, enough to clear the strip and pilots:

- approach 25 mm at 150 mm/s: 0.17 s;
- press 5 mm at 37.7 mm/s, covering the stripper, cut and entry: 0.13 s;
- decompress: 0.10 s;
- return 30 mm at 150 mm/s: 0.20 s;
- valve shifts: 0.30 s;
- cycle: **0.90 s**, about **67 strokes a minute** at best.

**AB-75**, with the stroke set to 60 mm for hand loading:

- approach 35 mm: 0.23 s;
- press 25 mm, the whole forming travel: 0.66 s;
- decompress: 0.10 s;
- return 60 mm: 0.40 s;
- valve shifts: 0.30 s;
- cycle: **1.70 s**.

MP-40's 67 strokes a minute is little more than half the mechanical press's 120, and in practice a hydraulic press running a progressive die is usually set slower than its best. At MP-40's volume that still means only about 20 press hours a year at 75% efficiency, against 11. AB-75's 1.7 s cycle is far quicker than the loader, about five seconds a part, so the hydraulic press costs it nothing in output.

```figure
type: compare
title: Cycle times on the illustrative hydraulic press
rowhead: Part of the cycle
cols: MP-40, 30 mm stroke | AB-75, 60 mm stroke
caption: This is an illustration with 150 mm/s approach and return, 37.7 mm/s pressing, 0.1 s decompression and 0.3 s of valve shifts. AB-75's long pressing travel is what makes its cycle longer.
- Approach | 0.17 s | 0.23 s
- Pressing | 0.13 s | 0.66 s
- Decompression | 0.10 s | 0.10 s
- Return | 0.20 s | 0.40 s
- Valve shifts | 0.30 s | 0.30 s
- * Cycle | 0.90 s, 67 a minute | 1.70 s
```

## What a hydraulic press does well

- **Full force anywhere in the stroke.** AB-75 could have had its 150 kN pressure pad (Chapter 3) on a hydraulic press, which would have pushed through it at 205 kN at 20 mm without complaint.
- **No energy limit per stroke.** The pump supplies the work as it is done; a long forming stroke cannot stall it for lack of stored energy.
- **Controlled speed, dwell and force.** The ram can be slowed for forming, held at force for a set time, and limited to a set force, which suits drawing, assembly, straightening and trial work.
- **Adjustable stroke.** The stroke can be set to just what the job needs, which shortens the cycle.
- **Overload protection by design.** The relief valve limits force every stroke.

## What it does less well

- **Speed.** It is slower than a mechanical press on short-stroke, high-rate work.
- **Power and heat.** Its pump runs whenever the press is ready, and the energy put into the oil and not used becomes heat, which must be removed.
- **Breakthrough.** A hydraulic press stores energy in its compressed oil and its stretched frame, and releases both at breakthrough, as the error in this chapter shows.
- **Maintenance.** Seals, hoses, valves and oil condition need attention that a mechanical press's drive does not.

## Holding the ram up

A hydraulic press's ram is held up by oil. If a valve leaks, a hose bursts or the oil is let out for maintenance, a ram that is above its die can fall under its own weight and the upper die's, and on a large press that is many hundreds of kilograms. Hydraulic presses therefore have **ram-holding valves** that lock the oil in the cylinder when the press is stopped, and mechanical locks or safety blocks for work under the ram. WorkSafe Victoria's guidance includes chocks to stop the ram falling during maintenance among a press's controls, and the press maker's instructions say how the ram is secured.

The same applies to a hydraulic press's stored energy in general. Accumulators, where fitted, hold oil under pressure after the pump stops, and must be discharged before work on the hydraulic circuit. Isolation of a hydraulic press means isolating its electrical supply, securing the ram and relieving its stored pressure, in the order its maker specifies.

## Pumps, accumulators and energy

A hydraulic press's pump must supply the pressing flow at full pressure, which for the illustrative press is 15.1 kW while pressing. Most of its cycle is approach, return and waiting, when little power is needed, so the pump and motor are large for the average load. Three common ways reduce that.

- **Variable-displacement pumps** reduce their flow when it is not needed, and so their power.
- **Accumulators** store oil under pressure during the waiting time and release it during pressing, so that a smaller pump can deliver a large flow for a short time.
- **Servo-driven pumps** run their motor only as fast as the press needs at each moment, and stop it while the press waits.

All three make a hydraulic press's energy use depend on how it is run, which is why Chapter 10's comparison uses an average demand for each option rather than its installed motor power.

## Servo presses

A servo press keeps the mechanical press's crank or linkage and replaces its flywheel and clutch with a servo motor, usually through a reduction gear, controlled to follow a programmed motion. Its force at each height is still set by the crank's geometry and the motor's torque, like a mechanical press's curve, but its motion is not fixed.

- **Programmable motion.** The ram can approach fast, slow down for the cut or the form, dwell at the bottom, and return fast, all within one stroke.
- **Pendulum or partial strokes.** For short-stroke work such as MP-40, the crank can swing back and forth through part of its rotation instead of turning fully, giving a shorter effective stroke and a higher rate.
- **Energy from the motor.** There is no flywheel to slow down, so a slow forming stroke loses no energy, though the motor's peak torque and power and the drive's energy storage, often capacitors, set their own limits.
- **Breakthrough control.** The ram can be slowed just before the cut breaks through, reducing snap-through.

This is an illustration of what that means for AB-75. On a servo press, the stroke could approach fast, slow to a steady forming speed for the last 25 mm, and return fast. If the forming took 0.5 s, the motor would deliver AB-75's 1,515 J at an average of about 3 kW during forming, with a peak at the bottom where the force rises to 180 kN; there is no flywheel to slow, so the speed setting no longer changes the energy available, and Chapter 4's stall at a low speed setting could not happen. What limits it instead is the motor's peak torque, which sets the force curve, and the drive's peak power, which sets how fast the ram can move under load. Both are in the maker's data.

Servo presses cost considerably more than mechanical presses of the same rating, and their capability depends heavily on the motor's ratings and the control's programming. Their makers publish force and motion data that must be read as carefully as a mechanical press's force curve.

```figure
type: compare
title: Mechanical, hydraulic and servo presses for Press 4's jobs
rowhead: Drive
cols: Force through the stroke | Energy limit | MP-40 speed | AB-75 | Breakthrough
caption: General characteristics with this book's illustrative presses. Each limit has to be checked against the maker's data.
- * Mechanical, flywheel and clutch | falls above the rating point | flywheel energy at the speed set | 120 a minute | fine at the highest speed setting | frame snap-through
- Hydraulic | full force anywhere | none per stroke; pump power | about 67 a minute at best | fine; could carry a pad | oil and frame release; needs damping
- Servo | crank geometry and motor torque | motor and drive ratings | 120 a minute or more in pendulum mode | fine; can slow near the bottom | can be slowed before the cut
```

## The error: the oil column at breakthrough

This is an illustration. During quoting, the supplier of the long-stroke hydraulic press from Chapter 1 offered to run MP-40's die on its demonstration press, which had a 150 mm bore and a 300 mm stroke. The die cut cleanly, but every stroke ended in a loud bang at breakthrough, the press's hoses jumped, and after a few hundred strokes one hose fitting was weeping oil.

The cause was stored energy. At MP-40's 221.3 kN, the oil in the cylinder was at 221,300 ÷ 17,671 = **12.5 MPa**. Oil is compressible; taking its bulk modulus as an illustrative 1.5 GPa, a volume V at pressure p stores p² × V ÷ (2 × bulk modulus). The cylinder's 300 mm stroke holds 5.3 litres, and with about 1 litre in the hoses, 6.3 litres were under pressure:

- energy in the oil: (12.5 × 10⁶)² × 0.0063 ÷ (2 × 1.5 × 10⁹) = **329 J**;
- MP-40's cutting energy, for comparison: about 231 J (Chapter 4);
- energy in Press 4's mechanical frame at the same load, ½ × 221.3 kN × 0.22 mm: about **24 J**.

The oil stored more energy than the cut itself used, and released it in milliseconds when the slug and blank broke through, throwing the ram and die downward. Air entrained in the oil, which lowers the bulk modulus, would have made it worse. A short-stroke hydraulic press, with 100 mm of stroke and less hose, would store about 118 J at the same load: better, but still five times the mechanical frame's.

The demonstration confirmed what the arithmetic predicted: hydraulic presses can blank, but they need short oil columns, controlled decompression before breakthrough, or damping cylinders, and the press must be specified with them. The shop recorded the result against the hydraulic option, which remained a strong choice for AB-75 and a weaker one for MP-40.

```figure
type: bars
title: Energy stored at MP-40's 221.3 kN, released at breakthrough
unit: J
max: 350
caption: This is an illustration with an oil bulk modulus of 1.5 GPa and Press 4's candidate's illustrative frame stiffness. The long-stroke hydraulic press stored more energy than the cut itself used.
- * Hydraulic, 300 mm stroke, 6.3 L under pressure | 329
- MP-40's cutting work, for comparison | 231
- Hydraulic, 100 mm stroke, 2.3 L under pressure | 118
- Mechanical frame, 0.22 mm stretch | 24
```

## Exercise: a faster pump

The hydraulic option's supplier offers a 63 L/min pump in place of the 40 L/min one. Find the new pressing speed, the hydraulic power at 22.6 MPa, and the new cycle times for MP-40 and AB-75, keeping the other parts of the cycle the same.

**Worked answer.** 63 L/min is 1,050,000 mm³/s.

- Pressing speed: 1,050,000 ÷ 17,671 = **59.4 mm/s**.
- Hydraulic power: 22.6 × 63 ÷ 60 = **23.7 kW**.
- MP-40: pressing 5 mm takes 0.08 s instead of 0.13 s; the cycle falls from 0.90 to about **0.85 s**, about 70 strokes a minute.
- AB-75: pressing 25 mm takes 0.42 s instead of 0.66 s; the cycle falls from 1.70 to about **1.45 s**.

A pump 58% larger, with a motor to match, buys MP-40 only about 5% more speed, because most of its cycle is approach, return, valve shifts and decompression, not pressing. For short-stroke work, a hydraulic press's speed is set by its valves and its approach and return circuits as much as by its main pump.
