---
title: "Clutches, brakes and torque limiters: choosing, sizing and keeping them safe"
description: "How friction, positive, one-way and electromagnetic clutches and brakes work, sizing for torque, energy and heat, why fail-safe brakes matter and how torque limiters protect drives."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

Most machines need to start, stop, hold or disconnect motion at some point. A conveyor must stop quickly when a guard opens. A hoist must hold its load when power fails. A packaging machine must index precisely and then wait. A crusher must protect its drive when something too hard enters the chamber. These jobs fall to **clutches**, which connect and disconnect a driving shaft from a driven one, **brakes**, which slow, stop or hold a load, and **torque limiters**, which slip or disconnect when torque exceeds a safe level.

These components are often chosen late in a design, from a catalogue, by matching a torque figure. That approach catches the static requirement but misses the dynamic ones: how much energy the device must absorb every time it engages, how much heat that generates over an hour of operation, how quickly it must respond and what happens if power, air or control signals fail. Many clutch and brake failures, and some serious incidents, result from those missed requirements rather than from insufficient torque.

This article explains, in general terms, the main types of clutches, brakes and torque limiters, how to size them for torque, energy and heat, why fail-safe design matters, how stopping relates to machine safety and how to maintain them. It is general information. Manufacturers' selection procedures and applicable machine safety standards should always be followed, particularly where brakes protect people.

## What each device does

- A **clutch** connects a driven load to a running drive and disconnects it on demand. Clutches allow motors to start unloaded, allow loads to be engaged and disengaged without stopping the motor and allow indexing motions.
- A **brake** slows a moving load to rest, holds a stationary load or both. A **holding brake** keeps a stationary load in position; a **stopping brake** absorbs the energy of a moving load.
- A **torque limiter** protects a drive train by slipping or disengaging when torque exceeds a set value, for example during a jam.
- A **backstop** or one-way device allows rotation in one direction only, preventing loads such as inclined conveyors from running backwards.

## The main types

| Type | How it works | Strengths | Limitations |
|---|---|---|---|
| Friction disc or plate | Friction surfaces pressed together by springs, air, hydraulics or electromagnets | Smooth engagement at speed; widely available | Wear and heat; friction varies with condition |
| Cone, drum and band | Friction on conical or cylindrical surfaces | Compact for some applications | Generally older designs; heat and wear |
| Positive (jaw or tooth) | Interlocking teeth | No slip; compact for high torque | Engage only at rest or very low speed |
| Electromagnetic | Coil attracts an armature to engage friction faces | Fast, controllable, easy to automate | Heat; air gap adjustment |
| Spring-applied, power-released brake | Springs apply the brake; power releases it | Fail-safe holding when power is lost | Must be sized and released correctly |
| One-way (sprag, roller or ratchet) | Transmits torque in one direction only | Backstops and overrunning drives | Specific to direction; impact loads matter |
| Centrifugal | Shoes move outwards with speed and engage | Allows motors to start unloaded | Engagement depends on speed |
| Fluid and magnetic types | Hydrodynamic, magnetic particle or eddy current transmission | Smooth starts, controllable slip | Losses and heat; specific uses |
| Torque limiter (friction, ball detent, shear pin) | Slips, disengages or breaks at a set torque | Protects the drive train | Must be set correctly and reset or replaced |

**Positive** devices, such as jaw clutches, cannot be engaged at high speed difference without shock, so they are used where engagement happens at rest or near-synchronous speed. **Friction** devices allow engagement while slipping, which is why they dominate where loads must be picked up from a running drive.

## Sizing: torque is only the start

### Torque

The device must transmit or hold the required torque with a margin. Manufacturers usually specify:

- **static torque**, the torque the device can hold without slipping when engaged and stationary; and
- **dynamic torque**, the torque available while slipping, which is usually lower.

The required torque includes the load torque and the torque needed to accelerate or decelerate the load in the required time, multiplied by a **service factor** that reflects shock, duty and uncertainty. Manufacturers publish service factors for different applications.

### Inertia and stopping time

When a brake stops a rotating load, the deceleration depends on the braking torque and the **inertia** of everything that rotates, including motor rotor, couplings, gears, pulleys and the load itself. A simple estimate of stopping time, ignoring load torque and friction, is:

t = (J × ω) ÷ T

where J is the total inertia referred to the brake shaft, ω is the initial angular speed in radians per second and T is the braking torque.

When inertia is on the other side of a gearbox, it must be **referred** to the brake shaft. Inertia reflected through a reduction gearbox is divided by the square of the ratio, which is why brakes are often placed on the high-speed motor side, where less torque is needed.

### Energy and heat

Every time a friction clutch engages or a brake stops a load, it converts kinetic energy into heat. For a rotating load stopped from speed, the energy is:

E = ½ × J × ω²

Each device has limits on the energy it can absorb in a single engagement and on the average heat it can dissipate over time. A brake that easily handles the torque may still overheat if it stops a large inertia many times an hour. Overheating changes friction, accelerates wear, damages friction material and, in electromagnetic devices, can affect coils.

Duty must therefore consider:

- energy per engagement;
- engagements per hour;
- average heat dissipation compared with the device's thermal rating; and
- ambient temperature and ventilation.

## Fail-safe design and holding loads

For loads that could move under gravity or stored energy, such as hoists, vertical axes, lifts and inclined conveyors, the brake should normally be **fail-safe**: applied by springs and released by power, so that a loss of power, air or hydraulic pressure applies the brake rather than releasing it. Many motors are available with integral spring-applied brakes for this reason.

Fail-safe design also involves the control system. The brake must be released and applied in the right sequence with the drive, so that the motor does not drive against an applied brake and the load is not left unsupported between the drive losing torque and the brake engaging. Variable speed drives often provide brake control functions designed for this purpose. The [selecting electric motors and drives](/reados/collections/machine-elements-and-mechanical-design/selecting-electric-motors-and-drives/) article covers brake motors and drive selection.

## Stopping and machine safety

Stopping a machine safely is a safety function, not just a mechanical one. Machine safety standards distinguish categories of stop, for example removing power immediately, bringing the machine to a controlled stop and then removing power, or a controlled stop with power maintained. The right category depends on the risk assessment. A brake may be part of achieving a required stopping time, for example so that moving parts stop before a person can reach them after opening a guard.

In Australia, machine safety is addressed through work health and safety legislation and is commonly supported by the AS/NZS 4024 series of standards. Where a brake is part of a safety function, its performance, monitoring and testing need to match the required safety level, and competent advice is essential. Lifting equipment and lifts have their own specific requirements.

## Torque limiters

A torque limiter protects gearboxes, chains, couplings and motors from overloads such as jams. Common types include:

- **Friction torque limiters**, which slip above a set torque and resume driving when the overload clears.
- **Ball or roller detent limiters**, which disengage cleanly at a set torque and may re-engage automatically or require resetting; some include a switch to signal the drive to stop.
- **Shear pins**, which break at an overload and must be replaced; simple but inconvenient, and replacement with stronger pins defeats their purpose.

The set torque should be above normal peak operating torque, including start-up, but below the torque that would damage the weakest component. Signalling the control system when the limiter trips prevents the motor from continuing to drive a slipping limiter and overheating it.

## Installation and maintenance

- **Keep friction surfaces clean.** Oil or grease contamination dramatically reduces friction and holding torque.
- **Check and adjust wear.** Friction devices wear, and electromagnetic types have an air gap that must stay within limits.
- **Bed in new friction surfaces** according to the manufacturer's guidance, as torque may be lower until surfaces conform.
- **Test brakes.** For holding brakes on vertical or gravity-loaded axes, periodic testing confirms the brake still holds the required torque.
- **Check alignment and mounting.** Misalignment causes uneven wear and heat.
- **Monitor temperature.** Unusual heat suggests slipping, dragging or excessive duty.
- **Keep records.** Record adjustments, wear measurements, test results and replacements, so that changes in performance are noticed before they become failures.

## A worked example

This is an illustrative example. The figures are hypothetical and simplified, ignoring friction and load torque.

A small manufacturer is adding a brake to a machine with a large rotating drum. The total inertia referred to the motor shaft is 2.5 kg·m², and the motor runs at 1,450 rev/min. The designer considers a brake with a dynamic braking torque of 50 N·m.

The angular speed is 1,450 × 2π ÷ 60, which is about 151.8 rad/s.

The estimated stopping time is t = (2.5 × 151.8) ÷ 50, which is about 7.6 seconds.

The energy absorbed per stop is ½ × 2.5 × 151.8², which is about 28,800 joules, or 28.8 kJ.

The machine stops about 20 times an hour, so the brake must dissipate about 20 × 28.8 kJ = 576 kJ an hour, an average of 576,000 ÷ 3,600, or about 160 watts.

The risk assessment requires the drum to stop within 3 seconds of a guard being opened. A 50 N·m brake is far too slow. To stop in 3 seconds, the required torque is about (2.5 × 151.8) ÷ 3, or about 127 N·m, before adding a margin. The energy per stop remains about 28.8 kJ, because it depends on inertia and speed, not on stopping time, but the heat is released more quickly during each stop. The designer selects a brake rated well above 127 N·m dynamic torque, confirms with the manufacturer that its energy per stop and hourly heat ratings comfortably exceed 28.8 kJ and 160 W, and treats the stopping function as a safety function subject to the required safety level, monitoring and periodic testing.

## How this applies to a small Australian business

- **Size for energy and heat, not just torque.** Check energy per engagement and average heat for the real duty.
- **Refer inertia correctly.** Include all rotating parts and reflect them through gear ratios.
- **Use fail-safe brakes for gravity and stored-energy loads.**
- **Treat stopping as a safety function** where people could be harmed, with competent advice.
- **Protect drives with torque limiters** where jams are possible, and signal trips to the control system.
- **Maintain and test.** Contamination, wear and air gaps change performance over time.

## Common mistakes

- **Selecting on static torque alone.**
- **Ignoring heat from frequent stops**, leading to fade and rapid wear.
- **Placing a brake on the low-speed side** where much higher torque is needed, without reason.
- **Power-applied brakes on hoists or vertical axes**, which release when power fails.
- **Replacing shear pins with stronger ones**, defeating the protection.
- **Oil contamination of friction surfaces.**
- **Never testing holding brakes.**

## Frequently asked questions

**Why does a brake that holds the load sometimes fail to stop it in time?** Holding (static) torque is often higher than dynamic torque, and stopping also depends on inertia, speed and heat. A brake suitable for holding may be too small for dynamic stopping.

**Can a variable speed drive replace a mechanical brake?** Drives can decelerate loads electrically, often with braking resistors, but they do not hold loads when power is lost. Gravity loads still need a fail-safe holding brake.

**Where should a torque limiter be placed?** Usually as close as practical to the source of likely jams, so that it protects the most components between the jam and the motor, while still being accessible for resetting and inspection.

## Questions to ask

- What torque, energy per engagement and hourly heat must this device handle?
- What is the total inertia, and has it been referred to the device shaft correctly?
- What happens if power, air or hydraulic pressure is lost?
- Is the stopping function part of a safety function, and what performance does the risk assessment require?
- How will we protect the drive from jams?
- How will we inspect, adjust and test the device?

## Bringing it together

Clutches, brakes and torque limiters control when and how motion is transmitted, stopped and limited. Choosing them requires more than a torque figure: inertia, stopping time, energy per engagement, average heat, response and failure behaviour all matter. Fail-safe, spring-applied brakes protect loads that could move under gravity, and stopping functions that protect people must meet the performance their risk assessment requires. Torque limiters prevent jams from becoming expensive breakdowns. Correct sizing, careful integration with drives and controls, and regular maintenance and testing keep these components reliable. The [shafts, keys, couplings and alignment](/reados/collections/machine-elements-and-mechanical-design/shafts-couplings-and-alignment/) article covers the rotating connections these devices sit within.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow manufacturers' selection procedures and applicable machine safety requirements.*
