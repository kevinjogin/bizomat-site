---
title: "Power screws and linear motion: leadscrews, ball screws, linear guides and cams"
description: "Turning rotation into accurate straight-line motion is central to machines and automation. How to size leadscrews and ball screws, choose guides and actuators, and design cam motion."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - automation
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

Many machines need to move something in a straight line: a jack lifting a load, a slide positioning a tool, a press closing, a gate opening, a pick-and-place head moving between stations. The usual way is to convert a motor's rotation into linear motion using a screw, a belt, a rack and pinion or a cam, and to guide the moving part on rails or slides. These are familiar machine elements, but choosing between them, and sizing them properly, decides whether an axis is accurate, fast, efficient, safe and long-lived.

Common problems come from choosing by habit. A trapezoidal screw is used where a ball screw was needed, so the motor is oversized and the nut wears out. A ball screw is used where the load must hold itself, so the axis drops when power fails. A long screw whips at speed. A cam profile that looks smooth produces shock loads at every cycle. A slide drifts out of position as the machine warms up.

This article explains how power screws work, how to calculate torque, efficiency and self-locking, how ball screws differ, how to choose linear guides and alternative actuators, how cam motion is designed, and what affects positioning accuracy. It is general information for designers and engineers. Manufacturers of screws, guides and actuators publish detailed sizing data and software, which should be used for specific designs.

## How power screws work

A **power screw**, also called a leadscrew or translation screw, converts rotation into linear motion and torque into force. The key difference from a fastening screw is purpose: a power screw is used constantly, so efficiency matters, while a fastening screw should stay tight, so friction is welcome.

Common arrangements have the screw rotating and the nut travelling, or the nut rotating and the screw travelling. The **lead** is the distance the nut advances per revolution: equal to the pitch for a single-start thread and pitch times the number of starts for multi-start threads.

Thread forms for power screws include:

- **Trapezoidal metric threads**, with a 30-degree included angle, the general-purpose choice.
- **Acme threads**, with a 29-degree included angle, the inch-based equivalent.
- **Square and modified square threads**, slightly more efficient but harder to make.
- **Buttress threads**, asymmetric, for heavy loads in one direction only, such as in presses and vices.

## Torque, efficiency and self-locking

The torque to raise a load with a sliding power screw depends on the load, the pitch diameter, the **helix angle**, set by the lead and diameter, and the **friction angle**, set by the coefficient of friction and the thread angle. Torque to raise is the load times half the pitch diameter times the tangent of the friction angle plus the helix angle. Torque to lower uses the friction angle minus the helix angle.

Consider a trapezoidal screw of 30 mm diameter and 6 mm pitch lifting 10 kN. Its pitch diameter is about 27 mm, giving a helix angle of about 4.1 degrees. With a friction coefficient of 0.125, a typical design value for lubricated steel on bronze, and allowing for the thread angle, the friction angle is about 7.4 degrees. The torque to raise the load is about 27 N·m, not counting any thrust collar or bearing friction, and efficiency is only about 35%. Most of the input energy becomes heat in the nut.

Because the friction angle is larger than the helix angle, this screw is **self-locking**: the load will not drive it backwards, and lowering needs a positive torque of about 8 N·m. Self-locking is useful for jacks and adjusters but cannot be relied on as a safety function, because vibration can let a self-locking screw creep.

Friction is higher at start-up, by about a third, so motors and handwheels must provide more torque to start than to keep running. Lubrication, surface finish and running-in all change friction considerably.

## Sizing a sliding screw

Check a sliding screw for:

- **Thread bearing pressure and wear**, using the nut material maker's limits, often bronze or engineering plastic nuts.
- **Heat**: in continuous duty, the low efficiency generates heat that limits speed and duty cycle, much as in plain bearings.
- **Stresses** in the screw under combined axial load and torque.
- **Buckling** for long screws in compression, which depends on length and how the ends are supported.
- **Critical speed**, the rotating speed at which a long screw whips.

Sliding screws suit manual adjustments, jacks, low-duty actuators, vertical axes needing self-locking and dirty environments where ball screws would be damaged. Split or adjustable nuts can take up wear.

## Ball screws

A **ball screw** places recirculating balls between screw and nut, turning sliding friction into rolling friction. Efficiency rises to around 90%, so much less torque and motor power are needed. For the same 10 kN load and 6 mm lead, the torque to raise is about the load times the lead divided by 2π times the efficiency, or about 10.6 N·m, compared with about 27 N·m for the trapezoidal screw.

```figure
type: bars
title: Torque to lift 10 kN on a 6 mm lead
unit: N·m
max: 30
caption: A ball screw can backdrive, so a vertical axis needs a holding brake.
- Trapezoidal screw, about 35% efficient | 27 | self-locking
- *Ball screw, about 90% efficient | 10.6
```

Ball screws bring other benefits and costs:

- **Life** is calculated like a rolling bearing, from the dynamic load rating and the equivalent load, giving travel distance before fatigue.
- **Backlash** can be removed by **preloading** the nut, giving precise, stiff positioning.
- **Accuracy grades** define lead accuracy. Ground screws give the highest accuracy; rolled screws are cheaper and suit many automation tasks.
- **Backdriving**: high efficiency means the load can drive the screw backwards. Vertical axes need a **brake**, usually a spring-applied motor brake.
- **Cleanliness**: ball screws need lubrication and protection from chips and dirt, with wipers, bellows or covers.
- **End support**: fixed and supported bearing arrangements at the screw ends raise critical speed and buckling capacity.

## Linear guides

The moving part needs guidance as well as drive:

- **Profile rail guides** with recirculating balls or rollers give high stiffness, accuracy and load capacity, and are rated for loads and moments much like bearings. They need flat, parallel, accurately machined mounting surfaces.
- **Round shaft guides** with linear bearings are cheaper and tolerate less accurate mountings, at lower stiffness.
- **Plain slides and dovetails** suit heavy, slow or damped applications such as some machine tools, with wear-resistant liners.
- **Wheels on track** suit long, light-duty travel.

Size guides for the loads and moments from the moving mass, process forces and acceleration, and check life using the manufacturer's method.

## Other ways to make linear motion

| Method | Strengths | Limitations | Typical uses |
|---|---|---|---|
| Sliding leadscrew | Simple, self-locking, tolerant of dirt | Low efficiency, wear, limited speed | Jacks, adjusters, low-duty axes |
| Ball screw | Efficient, accurate, stiff | Needs brake on vertical axes, sensitive to dirt, speed limited by length | Machine tools, precision automation |
| Belt-driven actuator | Fast, long strokes, light | Lower stiffness and thrust | Pick-and-place, transfer, packaging |
| Rack and pinion | Unlimited length, high force | Backlash unless compensated | Gantries, long axes, gates |
| Linear motor | Very high speed and accuracy, no mechanical transmission | Cost, heat, no holding force without power | High-dynamic precision machines |
| Pneumatic cylinder | Cheap, fast, simple for end-to-end moves | Hard to stop accurately between ends | Clamping, pushing, simple transfers |
| Hydraulic cylinder | Very high force | Leaks, pumps and maintenance | Presses, heavy equipment |
| Cam and follower | Repeatable motion locked to a cycle | Fixed motion, mechanical complexity | High-speed packaging and assembly machines |

## Cams

A **cam** is a shaped surface that drives a follower through a set motion as it rotates, locking the follower's movement to the machine's cycle. Cams remain common in high-speed mechanical machines.

The **motion law** chosen for the cam profile matters more than its overall shape. A constant-velocity profile looks simple, but its abrupt starts and stops imply very high accelerations, causing shock, noise and wear. Profiles such as simple harmonic and cycloidal motion, and modified profiles used in industry, control acceleration and its rate of change, so forces rise smoothly. Inertia forces equal mass times acceleration, so heavy followers and high speeds magnify the effect.

Other cam design points:

- **Pressure angle**: the angle between the follower's direction of motion and the force from the cam. Large angles push the follower sideways and can jam it; designers commonly limit it, often to about 30 degrees for translating followers.
- **Follower type**: roller followers reduce friction and wear.
- **Contact stress** between cam and follower must suit the materials and lubrication.
- **Follower return**: springs or a groove keep the follower in contact; springs must hold contact at the highest speeds.

**Electronic cams**, in which servo motors follow programmed motion profiles, now replace many mechanical cams, allowing motion to be changed in software for different products.

## Motion control and accuracy

Servo motors with encoders provide closed-loop control of position and speed. Stepper motors run open loop, simply and cheaply, but can lose steps if overloaded. The accuracy of a linear axis depends on more than the controller:

- **Lead accuracy** of the screw or pitch accuracy of a rack.
- **Backlash** in nuts, gears and couplings.
- **Stiffness** of screws, couplings, bearings and guides.
- **Thermal growth**: a steel screw grows about 11.7 micrometres per metre for each degree Celsius. A 1 m screw that warms by 5 °C lengthens by about 0.06 mm, which matters on precision axes. Fixing one end and letting the other float, or measuring position directly with a linear scale, addresses this.
- **Mounting accuracy** of guides and supports.

Linear scales measure the moving part's position directly, eliminating many of these errors from the control loop.

## Safety of powered axes

Powered linear axes can crush, shear and trap. Guarding, safe stopping and safe holding of loads must be designed in, using a risk assessment and machinery safety standards such as the AS/NZS 4024 series. Vertical axes need a means of holding the load when power is removed or a fault occurs, and maintenance procedures need to address stored energy, such as raised loads, springs and pressurised cylinders, before anyone works under or within reach of the axis.

Linear axes and actuators are building blocks of automation. The [automation, AI and the manufacturing workforce](/reados/collections/manufacturing-operations-and-design-for-manufacture/automation-ai-and-the-manufacturing-workforce/) article discusses how businesses approach automation more broadly.

## A worked example

This is an illustrative example. A test rig has a vertical axis that lifts a 10 kN load through 400 mm. It uses a 30 mm trapezoidal screw with a 6 mm lead driven by a stepper motor. When the business increases test frequency, the nut runs hot, the motor occasionally loses steps and the bronze nut needs replacing every few months.

**Analysis.** The trapezoidal screw needs about 27 N·m to lift the load at only about 35% efficiency, so most of the motor's power becomes heat in the nut. At the higher duty cycle, nut temperature and wear are too high. The stepper motor runs near its torque limit, so it loses steps under starting friction.

**Changes.**

- A ball screw with the same lead and a preloaded nut replaces the trapezoidal screw, reducing lifting torque to about 11 N·m.
- A servo motor with an encoder and a spring-applied holding brake replaces the stepper, because the ball screw can backdrive and the load must hold safely when power is removed.
- Screw end supports are arranged as fixed and supported, and critical speed and buckling are checked at the new speeds.
- Wipers and a bellows cover protect the screw from test debris.

**Result.** The axis runs faster and cooler, positioning is repeatable, and nut replacements stop. The brake ensures the load holds during power interruptions and maintenance.

```figure
type: compare
title: A vertical test axis, rebuilt for duty
cols: Before | After
best: 2
caption: End supports were rearranged, critical speed and buckling checked, and wipers and a bellows cover added.
- Screw | 30 mm trapezoidal, nut ran hot | Ball screw, same lead, preloaded nut
- *Motor | Stepper losing steps | Servo with encoder and spring-applied brake
```

## Applying this in an Australian business

- **Choose the linear motion method** for force, speed, stroke, accuracy, environment and safety.
- **Calculate torque and efficiency** for screws, including start-up friction.
- **Use self-locking screws** where holding is helpful, but never as the only safety function.
- **Fit brakes** on vertical ball screw axes.
- **Check buckling and critical speed** on long screws.
- **Size guides** for loads, moments and life, on accurate mountings.
- **Choose cam motion laws** that limit acceleration and shock.
- **Allow for backlash, stiffness and thermal growth** on precision axes.

## Where linear motion designs go wrong

- **Sliding screws in continuous high-duty applications.**
- **Ball screws on vertical axes without brakes.**
- **Long screws run near their critical speed.**
- **Guides mounted on rough or non-parallel surfaces.**
- **Constant-velocity cam profiles** at high speed.
- **Ignoring thermal growth** on precision axes.
- **Steppers sized without margin** for start-up friction.

## Questions to ask about a linear axis

- What force, speed, stroke, duty and accuracy does this axis need?
- Must the load hold itself when power is removed, and how is that guaranteed?
- What torque and efficiency does the chosen screw give?
- Have we checked buckling, critical speed and guide life?
- How will dirt, chips and lubrication be managed?
- Which errors limit accuracy, and how are they controlled?

## Bringing it together

Linear motion is a system of drive, guidance, motor and control. Sliding screws are simple and self-locking but inefficient; ball screws are efficient and accurate but need brakes on vertical axes and protection from dirt. Belts, racks, linear motors and cylinders suit other combinations of stroke, speed and force. Size screws and guides with manufacturers' data, checking torque, efficiency, life, buckling and critical speed. Design cams with motion laws that limit acceleration, and control accuracy by managing lead error, backlash, stiffness and thermal growth. The result is axes that move accurately, run cool and hold their loads safely.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on power screw design, Acme and trapezoidal power threads, ball and Acme leadscrews, cams and cam-follower design, motion control systems, and couplings, clutches and brakes, together with established machine design practice. The worked example is illustrative. This article is general information; use manufacturers' sizing data for specific designs.*
