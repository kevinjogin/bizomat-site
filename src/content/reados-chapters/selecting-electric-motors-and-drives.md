---
title: "Selecting electric motors and drives: sizing, efficiency, starting, enclosures and variable speed"
description: "A motor's running cost usually dwarfs its price. How to size motors for the load, choose enclosures and starting methods, use variable speed drives well and keep motors reliable."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - operations
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

Electric motors drive most of the machinery in Australian businesses: pumps, fans, compressors, conveyors, mixers, machine tools and refrigeration. They are reliable, standardised and easy to buy, which makes motor selection look trivial. Pick a kilowatt rating at least as large as the load, choose a speed, check the price.

The consequences of that approach are expensive. A motor running continuously for years can use electricity worth many times its purchase price every year. A motor two sizes too large runs at poor efficiency for its whole life. One too small runs hot and fails early. The wrong enclosure lets in water or dust; the wrong starting method trips supplies or snaps couplings; a variable speed drive fitted without thought destroys the motor's bearings through electrical discharge. A good selection considers the load's torque and speed, the duty, the environment, the supply, the starting method, efficiency and maintenance together.

This article explains how induction motors work from a user's point of view, how to size them for the load, how to choose enclosures, mounting and insulation, the options for starting and speed control, the energy economics, and how to maintain motors. It is general information for designers, engineers and maintenance teams. Electrical installation work must be carried out by licensed electricians to AS/NZS 3000, and motor manufacturers and electrical engineers should be consulted for specific designs.

## Motor types

- **Three-phase squirrel cage induction motors** are the default for industrial drives wherever three-phase supply exists: robust, standardised, efficient and inexpensive.
- **Single-phase induction motors**, with capacitor start and run arrangements, suit small loads where only single-phase supply is available.
- **Permanent magnet synchronous motors** offer higher efficiency, especially at part load, but need an electronic drive.
- **Electronically commutated motors** combine a permanent magnet motor with built-in electronics, common in fans and small pumps.
- **Servo motors** provide precise position and speed control for automation.
- **Brake motors** include a spring-applied brake that holds the load when power is removed.
- **Hazardous area motors** are built and certified for explosive atmospheres under the AS/NZS 60079 series.

## Speed, poles and slip

An induction motor's speed is set by the supply frequency and the number of magnetic poles in its winding. Synchronous speed in rev/min is 120 times the frequency divided by the number of poles. On Australia's 50 Hz supply:

| Poles | Synchronous speed | Typical full-load speed | Common uses |
|---|---|---|---|
| 2 | 3,000 rev/min | About 2,900 rev/min | Pumps, fans, compressors |
| 4 | 1,500 rev/min | About 1,450 rev/min | The general-purpose default |
| 6 | 1,000 rev/min | About 960 rev/min | Conveyors, mixers, lower-speed drives |
| 8 | 750 rev/min | About 720 rev/min | Heavy, slow machinery |

The rotor runs slightly slower than synchronous speed, a difference called **slip**, which rises with load. Across the normal working range, speed changes only a few per cent, which is why induction motors are effectively constant-speed machines on a fixed supply.

## Torque and the load

Torque is power divided by angular speed. A 3 kW motor at 1,440 rev/min delivers about 19.9 N·m at full load. An induction motor's torque varies with speed along a characteristic curve: a **starting torque** at standstill, a **breakdown torque** that is typically two to two and a half times full-load torque, and a steep working region near full speed.

Loads differ in how their torque varies with speed:

- **Constant torque loads**, such as conveyors, positive displacement pumps and extruders, need roughly the same torque at all speeds and often a high starting torque.
- **Variable torque loads**, such as centrifugal fans and pumps, need torque that rises with the square of speed, so power rises with the cube of speed.
- **Constant power loads**, such as winders and some machine tool spindles, need high torque at low speed and less at high speed.

The motor must produce more torque than the load at every speed from standstill to running speed, or it will not accelerate. **High-inertia loads**, such as large fans and flywheels, take time to accelerate, and the motor heats up during long starts. Check acceleration time and the motor's starting capability for these loads.

## Sizing the motor

Size the motor to the actual load, with deliberate margin, rather than rounding up by habit:

- **Undersized motors** draw more current to meet the torque demand and overheat. Sustained overload degrades insulation and shortens life.
- **Oversized motors** cost more, need larger cabling and starters, and run at lower efficiency and power factor at light load. A motor two frame sizes too large may run permanently at less than half load.

Manufacturers publish efficiency at full, three-quarter and half load. Use the efficiency at the expected operating point.

Account for the **duty**: continuous running, short-time duty or intermittent duty with frequent starts are rated differently under IEC 60034-1. Frequent starting heats a motor more than steady running.

Account for the **environment**: standard ratings assume an ambient temperature up to 40 °C and altitude up to 1,000 m. Hotter or higher locations need derating or a larger motor. Insulation is classified by temperature limit, such as Class F at 155 °C, and many motors use Class F insulation with a lower Class B temperature rise, giving a thermal margin.

## Enclosures, protection and mounting

- **Enclosure**: totally enclosed fan-cooled motors are the industrial standard.
- **Ingress protection** is rated by IP codes. The first digit covers solids and dust, the second water. IP55, dust protected and protected against water jets, is a common standard; washdown areas often need IP56 or IP66 and suitable seals.
- **Mounting** is coded: B3 for foot mounting, B5 for large flange mounting, B14 for small face mounting, V1 for vertical shaft-down mounting, among others. Specify the code, not just a description.
- **Frame size** in the IEC system is the shaft centre height in millimetres, giving a quick check of physical size.
- **Shaft loads**: belts, chains and overhung components load motor bearings. Manufacturers publish permissible radial and axial loads by frame and speed, and small frames have modest limits. Check them, especially for belt drives with small motor pulleys.

## Starting methods

A motor started **direct on line** draws a starting current of typically six to eight times full-load current for a few seconds and delivers full starting torque as a sudden step. For small motors this is fine. For larger motors it can cause voltage dips, exceed supply authority limits, and shock couplings, gears and belts.

| Method | How it works | Starting current | Starting torque | Suits |
|---|---|---|---|---|
| Direct on line | Full voltage applied | Highest | Highest | Small motors, high starting torque loads |
| Star-delta | Starts in star at reduced voltage, then switches to delta | About one third of direct on line | About one third | Light starting loads such as fans |
| Soft starter | Electronic voltage ramp | Reduced and adjustable | Reduced and adjustable | Pumps, fans, conveyors needing gentle starts |
| Variable speed drive | Controls frequency and voltage | Low, near full-load current | Full torque available from low speed | Speed control, high-inertia starts, process control |

## Variable speed drives

A **variable speed drive**, also called an inverter or frequency converter, changes the supply frequency to vary motor speed. Drives offer soft starting, precise speed control and, for fans and pumps, large energy savings. Because power for a centrifugal fan or pump rises with the cube of speed, running at 80% speed needs only about 51% of full-speed power in a system without static head, compared with throttling flow with a valve or damper while the motor runs at full speed. Systems with a large static head, such as pumping uphill, save less, and the savings should be calculated on the actual system curve.

Drives also bring issues that must be managed:

- **Motor cooling**: self-cooled motors lose cooling at low speed; constant torque loads at low speed may need a separately powered cooling fan or a larger motor.
- **Bearing currents**: the drive's fast-switching output can induce currents that discharge through motor bearings, causing fluting and early failure, particularly in larger motors. Insulated bearings, shaft grounding devices and correct cabling and earthing prevent this.
- **Insulation stress**: long cables between drive and motor can create voltage spikes; inverter-rated motors and filters address this.
- **Harmonics and interference**: drives can distort the supply and cause electrical noise, needing filters, correct cable types and installation practice.
- **Mechanical resonance**: running at new speeds can excite resonances in fans and structures, which may need to be skipped.

## Energy and whole-of-life cost

For motors that run for long hours, electricity dominates whole-of-life cost. Consider a 15 kW motor running at 75% load for 6,000 hours a year. At 92% efficiency it draws about 12.2 kW and uses about 73,000 kWh a year, costing about $18,300 at 25 cents a kilowatt-hour. A motor at 94% efficiency draws about 12.0 kW, saving about 1,560 kWh, or about $390 a year, for the life of the motor.

Three-phase motors sold in Australia must meet minimum energy performance standards under the Greenhouse and Energy Minimum Standards scheme, and efficiency classes such as IE2, IE3 and IE4 are defined internationally. Choosing a higher class often pays back quickly on long-running motors. The biggest savings, however, usually come from the system: right-sizing motors, using variable speed on variable loads, and fixing inefficient pumps, fans, belts and controls. The [cutting energy use in business premises](/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/) article covers finding these savings.

When a motor fails, compare **rewinding** with **replacement**. Good-quality rewinding can maintain efficiency on larger motors; for smaller motors, a new higher-efficiency motor is often the better choice over its life. The [buying for the whole life of equipment](/reados/collections/investment-appraisal-and-business-cases/buying-for-the-whole-life-of-equipment/) article explains how to compare options this way.

## Maintenance

- **Keep motors clean and cool**: blocked cooling fins and fan covers raise temperatures.
- **Lubricate regreasable bearings** with the right grease, quantity and interval.
- **Monitor vibration and temperature**, including thermal imaging of motors and connections.
- **Test insulation resistance** periodically, especially for motors in damp environments or after long idle periods.
- **Check terminal connections** for tightness and overheating.
- **Check alignment and shaft loads** on coupled and belt-driven motors.
- **Record failures** and their causes.

## A worked example

This is an illustrative example. A factory's cooling water system uses a 22 kW centrifugal pump that runs about 7,000 hours a year. Most of the time, the process needs only about 80% of the pump's design flow, so a valve is partly closed to throttle the flow. Measured input power is about 19 kW.

**Analysis.** An electrical contractor and the maintenance engineer review the system. The pipework is a closed loop, so there is little static head, and the system curve is mainly friction. Reducing pump speed to about 80% would give the required flow at much lower power. Estimated input with a variable speed drive, including drive losses, is about 11.5 kW.

**Implementation.** A variable speed drive is installed, controlled from the process temperature. The throttling valve is opened fully. The motor is checked for suitability with inverter supply, a shaft grounding device is fitted to protect the bearings, and the drive is set to avoid a resonance found at one speed.

**Result.** Measured input power settles at about 11.5 kW, saving about 7.5 kW for 7,000 hours, or about 52,500 kWh a year, worth about $13,000 at 25 cents a kilowatt-hour. The installed cost is recovered in about a year, and the pump runs more quietly with less wear.

## Applying this in an Australian business

- **Size motors to the measured or calculated load**, with deliberate margin.
- **Match the motor to the load type** and starting requirements.
- **Allow for duty, ambient temperature and altitude.**
- **Choose enclosures and IP ratings** for the environment, and specify mounting codes.
- **Choose starting methods** that suit the supply and the machine.
- **Use variable speed drives** on variable loads, managing cooling, bearing currents and interference.
- **Compare motors on whole-of-life energy cost.**
- **Maintain cooling, lubrication and connections**, and record failures.

## Where motor selection goes wrong

- **Oversizing by habit**, leaving motors lightly loaded and inefficient.
- **Ignoring ambient temperature**, especially near ovens and in hot sheds.
- **The wrong IP rating** for washdown or dust.
- **Direct-on-line starting** of large or shock-sensitive drives.
- **Throttling pumps and fans** instead of controlling speed.
- **Drives fitted without** bearing protection or cooling checks.
- **Buying on price** without considering running cost.

## Questions to ask when choosing a motor

- What torque and speed does the load need, including at start-up?
- What duty, ambient temperature and environment will the motor see?
- Which starting method suits the supply and the machine?
- Would variable speed save energy or improve the process?
- What will the motor cost to run each year at its expected load?
- How will it be monitored and maintained?

## Bringing it together

Motor selection is an engineering and energy decision. Understand the load's torque and speed, including starting, and size the motor to it with deliberate margin. Choose enclosure, IP rating, mounting and insulation for the environment and duty, and a starting method that suits the supply and the machine. Use variable speed drives where loads vary, managing cooling, bearing currents and interference. Compare options on whole-of-life cost, where efficiency usually outweighs purchase price, and maintain motors with attention to cooling, lubrication and monitoring. The result is reliable machines that cost less to run.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on electric motor selection, electric motors, and electric motor types, performance, standards and selection, together with established electrical and mechanical practice. The worked example is illustrative. This article is general information; electrical work must be carried out by licensed electricians.*
