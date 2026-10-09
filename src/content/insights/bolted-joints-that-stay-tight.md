---
title: "Bolted joints that stay tight: preload, torque, fatigue and locking"
description: "A bolt holds a joint by clamping it. How preload works, why torque is an unreliable proxy, how to resist fatigue and loosening, and how to specify bolted joints that last in service."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - quality
author: "KEVOS"
featured: false
draft: false
---

A conveyor drive keeps shaking its mounting bolts loose. Every few weeks a maintenance technician finds them backed off, tightens them again and adds a spring washer, then a second nut, then thread-locking compound. Eventually a bolt breaks. The investigation finds the problem was never the bolts themselves. They had been run up with an impact wrench to an unknown tension, on a joint that flexed under every start, and they had never been clamping the parts firmly enough to stop the joint moving.

Bolted joints are everywhere in machinery, fabrication and equipment, and most of the time they are treated as simple: pick a size, pick a grade, do it up tight. Yet loose, broken and leaking bolted joints are among the most common causes of breakdowns and failures. The underlying reason is nearly always the same. A bolted joint works by **clamping**: the bolt is stretched like a stiff spring, and the tension in it presses the joint parts together. If that clamping force, called **preload**, is too low, too variable or lost in service, the joint moves, the bolt fatigues and the joint loosens or leaks.

This article explains how preload works, why tightening torque is only a rough proxy for it, how to choose a target, how to tighten more reliably, how to design joints that resist fatigue and self-loosening, how locking methods compare and what to put on the drawing. It is general information. Structural steel connections, pressure equipment, lifting gear and other safety-critical joints must be designed and assembled to the applicable standards by qualified people.

## A bolt is a spring

When a bolt is tightened, it stretches slightly, and the parts it clamps compress slightly. The stretched bolt pulls the joint together with its preload. Properly preloaded, a joint carries external loads mainly by changing how hard its parts are pressed together, not by adding much extra load to the bolt.

That has three important consequences:

- **Fatigue resistance.** In a well-preloaded joint, a fluctuating external load mostly reduces the compression in the clamped parts. The bolt sees only a fraction of the fluctuation, and it is the fluctuating stress that causes fatigue cracking.
- **Resistance to loosening.** High clamping force creates friction that stops the parts sliding relative to each other, and sliding is what drives self-loosening.
- **Shear resistance by friction.** In many joints, friction between the clamped faces carries shear loads before the bolt shank ever bears on the hole.

A slack bolt loses all three. That is why, for most joints, the greater danger is a bolt that is too loose, not one that is too tight.

## Choosing a preload target

The target preload is usually set as a high fraction of the bolt's strength. A widely used guideline for reusable joints is about 75% of the bolt's **proof load**, which is the load it can carry without permanent stretch. Higher fractions are sometimes used for permanent joints.

Bolt strength is calculated on the **tensile stress area** of the thread, which is slightly larger than the area at the thread root. For an M10 coarse thread bolt the stress area is about 58 mm². A property class 8.8 bolt of this size has a proof stress of about 580 MPa, giving a proof load of roughly 33.6 kN, so a 75% preload target is about 25 kN.

Metric bolt property classes are written as two numbers, such as 4.6, 8.8 and 10.9. The first number is roughly one hundredth of the minimum tensile strength in megapascals, and the second is the ratio of yield to tensile strength. Class 4.6 is a commercial low-strength grade; 8.8 is the common high-tensile grade for machinery. Nuts must be of a matching or higher class.

## Torque is not preload

Torque is used to tighten bolts because it is easy to apply and measure. The approximate relationship is:

**Torque = K × nominal diameter × preload**

where **K**, the nut factor, bundles together all the friction and thread geometry. For plain steel fasteners it is often around 0.2; for lubricated fasteners it may be around 0.15; plating, coatings and surface condition change it again.

The trouble is that most of the torque never reaches the bolt as tension. For an M10 bolt with K of 0.2, only about 12% of the tightening effort goes into stretching the bolt. The rest is consumed by friction, roughly half under the head or nut and the rest in the threads. Small changes in friction therefore cause large changes in preload.

The **lubrication trap** shows how dangerous this can be. To reach the 25 kN target in a plain M10 8.8 bolt with K of 0.2 needs about 50 N·m. If someone oils the same bolt, K falls to about 0.15, and the same 50 N·m now produces about 33.6 kN: the full proof load. A helpful drop of oil has taken the bolt right to its limit. Torque figures are only valid for the friction condition they were calculated for, so the drawing or procedure must state that condition: dry, lightly oiled, coated or with a specified lubricant.

## Tightening methods and their accuracy

Different methods give very different control over preload:

| Method | How it controls preload | Typical consistency |
|---|---|---|
| **By feel or impact wrench without control** | Operator judgement | Very poor and unpredictable |
| **Torque control** | Calibrated torque wrench or tool | Moderate; preload scatter is often around plus or minus 25% or more |
| **Torque plus angle (turn-of-nut)** | Snug torque, then a specified further rotation | Better, especially beyond the elastic range for suitable bolts |
| **Direct tension indicators** | Washers with protrusions that flatten at a set tension | Good, with visual verification |
| **Bolt elongation or ultrasonic measurement** | Measures the stretch of the bolt | Very good, for critical joints |
| **Hydraulic tensioning** | Stretches the bolt directly before the nut is run down | Very good, for large bolts |

Choose the method by the consequence of failure. For a guard bracket, a calibrated torque wrench is fine. For a structural connection, a pressure flange or a heavily loaded machine joint, use a more controlled method and the procedure the relevant standard requires. In Australia, high-strength structural bolting follows AS 4100 and AS/NZS 1252, which specify tightening methods for tensioned bolts. For pressure flanges, guidance such as ASME PCC-1 sets out tightening sequences and passes.

Whatever the method, calibrate tools, follow a tightening sequence for multi-bolt joints, usually a cross or star pattern in several passes, and train the people doing it. Include critical joints in planned maintenance checks, as described in the [maintenance that prevents breakdowns](/insights/maintenance-that-prevents-breakdowns/) article, so loss of preload is found before failure.

## Design for fatigue resistance

Many bolt failures are fatigue failures: small cracks that grow under fluctuating load, usually at the first engaged thread or under the head. Good practice:

- **Preload high and reliably**, so the bolt sees only a small part of the fluctuating load.
- **Make the bolt elastic relative to the joint.** Longer bolts with a longer grip, and bolts with reduced shank diameters, stretch more for the same preload and lose less preload when the joint settles.
- **Use rolled threads**, which have compressive surface stresses that resist crack initiation, rather than cut threads, for fatigue-loaded bolts.
- **Avoid bending.** Prying action, where the joint opens at one edge, adds bending to the bolt and greatly increases fatigue stress. Stiff flanges, bolts close to the load path and flat, parallel seating faces reduce it.
- **Provide enough thread engagement.** In tapped holes, engagement of at least one diameter is common in steel, with more in softer materials such as aluminium and cast iron. Check by calculation for critical joints.
- **Use hardened washers** under heads and nuts on soft or slotted surfaces, to spread the load and reduce embedding.

## Design for shear

Where a bolted joint carries shear, there are two design approaches. In a **friction-grip** joint, the preload clamps the parts so firmly that friction carries the shear, and the bolts never bear on the holes; this needs reliable, high preload and controlled faying surfaces. In a **bearing** joint, the bolt shank bears against the hole walls. In bearing joints, make sure the **unthreaded shank**, not the thread, passes through the shear plane, by choosing bolt length, thread length and washer stack deliberately. Where bolts carry both tension and shear, check the combined stresses: a bolt that passes a tension check can still fail a combined check.

## Self-loosening and locking methods

Under transverse vibration, when the clamped parts slip sideways relative to each other, nuts and bolts can rotate loose even at moderate preload. Testing using the transverse vibration method, often called the Junker test, has shown that the most important defence is adequate, maintained preload that stops the joint slipping in the first place. Locking devices vary widely in how well they help:

| Method | Effectiveness against rotational loosening |
|---|---|
| **Adequate preload with stiff, non-slipping joint** | The primary defence |
| **Split spring washers** | Little resistance to self-loosening in vibration testing; not recommended as a locking method |
| **Plain flat washers** | Spread load; do not lock |
| **Prevailing-torque nuts** (nylon insert or all-metal) | Resist rotation and can prevent complete loss of the nut; may lose effectiveness with reuse or high temperature |
| **Chemical thread-locking compounds** | Fill the thread clearance and resist rotation well when applied correctly |
| **Wedge-locking washer pairs** | Designed to resist rotation through cam geometry; effective in testing |
| **Positive locking** (split pins, lock wire, tab washers) | Prevent nut rotation mechanically; common in safety-critical and aerospace uses |

Choose locking to suit the joint's vibration, temperature, reuse and inspection needs, but treat it as a backup to good preload and joint design, not a substitute. A joint that keeps loosening is telling you something about its design or assembly; the [small failures worth explaining](/insights/small-failures-worth-explaining/) article covers investigating repeat problems like this before they become breakdowns.

## Coatings, galvanising and dissimilar metals

Zinc plating, hot-dip galvanising and other coatings change friction and therefore the torque needed. Hot-dip galvanised nuts are tapped oversize to suit the coating, so use matched galvanised bolt and nut assemblies. Where stainless steel fasteners are used, galling of the threads is a risk, especially at speed; anti-seize compounds help, but they also change the nut factor. Fasteners of a different metal from the joint parts can cause galvanic corrosion in wet conditions, so consider insulating washers or compatible materials.

## Put the joint on the drawing

A complete specification for an important bolted joint includes:

- **Fastener designation**: size, thread, length, property class, nut class, standard and finish.
- **Washers**: type, hardness and material.
- **Target preload or tightening method**, including torque values with the stated friction condition, any angle, and the sequence.
- **Lubrication or thread treatment**: dry, oiled, anti-seize or thread-locking compound.
- **Locking method**, if any.
- **Inspection**: torque audit, marking after tightening, or other checks.

## A worked example

This is an illustrative example. A 40-person materials handling business supplies conveyor drives. On one design, the four bolts holding the gearmotor base to the frame keep loosening in service. They are M12 class 8.8 bolts with split spring washers, tightened by impact wrench, through a 10 mm base plate onto a 12 mm frame plate.

**Diagnosis.** An investigation finds no specified torque, unknown preload, and a short grip that gives the bolts little stretch. The motor start torque makes the base slip slightly on the frame with every start. The spring washers have flattened.

**Changes.**

- **Preload target.** For M12 8.8, with a stress area of about 84.3 mm² and a proof stress of about 580 MPa, the proof load is about 48.9 kN. The target is set at 75%, about 36.7 kN.
- **Torque and condition.** The drawing specifies lightly oiled threads and a tightening torque of about 66 N·m, based on a nut factor of about 0.15, applied with a calibrated torque wrench in a cross pattern in two passes.
- **More elastic bolts.** Spacer sleeves are added so longer bolts can be used, increasing stretch and reducing the effect of settling.
- **Washers and locking.** Split spring washers are replaced with hardened flat washers, and prevailing-torque nuts are added as a backup.
- **Slip resistance.** The paint is removed from the clamped faces, which had been reducing friction and allowing creep.
- **Verification.** Assemblers mark each nut after tightening, and a torque audit is done on the first ten units.

**Result.** Field reports of loosening stop. The torque, lubrication condition and method are now part of the drawing and the assembly instruction, so the result does not depend on who does the work.

## Applying this in an Australian business

- **Treat preload as the design variable**, and torque as one way to achieve it.
- **State the friction condition** with every torque value.
- **Choose a tightening method** that matches the consequence of failure.
- **Design for fatigue**: high preload, elastic bolts, rolled threads, no prying.
- **Put the shank, not the thread,** through shear planes in bearing joints.
- **Stop relying on split spring washers** for locking.
- **Use matched galvanised assemblies** and account for coatings.
- **Follow AS 4100, AS/NZS 1252** and other applicable standards for structural and safety-critical joints.
- **Specify the whole joint** on the drawing and in the assembly instruction.

## Where bolted joints go wrong

- **Tightening by feel** or with uncontrolled impact tools.
- **Torque values with no stated lubrication condition.**
- **Short, stiff bolts** that lose preload as the joint settles.
- **Prying and bending** in the joint.
- **Painted or soft clamped faces** that creep.
- **Split spring washers** treated as a cure for vibration.
- **Reusing prevailing-torque nuts** beyond their limits.

## Questions to ask about a bolted joint

- What preload does this joint need, and how will we achieve it?
- What friction condition does our torque value assume?
- Could the clamped parts slip sideways in service?
- Is the bolt long enough to stretch usefully?
- Does the shank or the thread sit in the shear plane?
- Which standard governs this joint, if any?
- How will we know each bolt was tightened correctly?

## Bringing it together

Bolted joints stay tight when they are clamped firmly and consistently. Treat preload as the design variable, set a sensible target, and remember that torque is only a rough proxy that depends on friction, so state the lubrication condition with every value and use a more controlled method where failure matters. Design for fatigue with high preload, elastic bolts, rolled threads and no prying, and design shear joints so friction or the shank carries the load. Rely on preload rather than split washers to prevent loosening, using proven locking methods as a backup. Then put the whole joint on the drawing and the assembly instruction, so every joint is made the same way.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS machine design handbooks on bolted joint design, preload and torque, fastener selection and washer function, together with established fastening practice. The worked example is illustrative. This article is general information and does not replace design to the applicable standards by qualified engineers.*
