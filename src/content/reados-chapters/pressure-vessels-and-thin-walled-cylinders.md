---
title: "Pressure vessels and thin-walled cylinders: stresses, design codes, relief valves and inspection"
description: "Why pressurised cylinders split lengthwise, how hoop and longitudinal stresses are calculated, how vessels are designed to codes, and how relief valves and inspection keep them safe."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - operations
author: "KEVOS"
featured: false
draft: false
---

Pressure vessels are everywhere in industry, often in plain sight: the air receiver beside a workshop compressor, a hot-water storage cylinder, a hydraulic accumulator, an LPG tank, a steam boiler, an autoclave or a process vessel in a food or chemical plant. They are simple in shape and quietly reliable, which makes it easy to forget how much energy they store. When a pressure vessel fails, that energy is released in an instant, and the results can be catastrophic: flying fragments, blast, scalding steam or a release of hazardous contents.

The engineering of pressure vessels is therefore governed by long-established design codes and regulations, developed over more than a century in response to boiler explosions and other failures. The basic mechanics are straightforward and worth understanding for anyone who owns or works near pressure equipment. A cylinder under internal pressure carries stress around its circumference that is twice the stress along its length, which is why cylinders split lengthwise. Thin walls, corrosion, poor welds, cracks and openings all reduce a vessel's margin, and relief valves and inspection are what keep that margin in place throughout its life.

This article explains, in general terms, the stresses in thin-walled cylinders and spheres, how heads, nozzles and welds are designed, the role of codes and regulation in Australia, testing, relief devices and in-service inspection, and practical steps for owners. It is general information; pressure equipment must be designed, manufactured, registered, inspected and repaired by competent people in accordance with the relevant standards and state or territory regulations.

## Stress in a thin-walled cylinder

Consider a long cylinder of radius r and wall thickness t containing a gas or liquid at internal pressure p. If the wall is thin compared with the radius, the stresses can be estimated with two simple balances.

**Hoop stress.** Imagine cutting the cylinder in half along its length. The pressure pushing the two halves apart acts over an area of length × diameter, and it is resisted by the two cut walls, each of area length × thickness. Balancing these gives the circumferential, or hoop, stress:

σ_hoop = p × r ÷ t

**Longitudinal stress.** Now imagine cutting the cylinder across its length. The pressure acting on the end, over an area of π × r², is resisted by the ring of wall with area of about 2 × π × r × t. Balancing these gives the longitudinal stress:

σ_long = p × r ÷ (2 × t)

The hoop stress is twice the longitudinal stress. That is why an over-pressurised cylinder, from a burst sausage skin to a ruptured pipe, typically splits along its length, and why longitudinal welds in cylindrical vessels are especially important.

These formulas are reasonable when the wall is thin relative to the radius, commonly taken as a radius more than about ten times the thickness. Thick-walled cylinders, such as hydraulic cylinders and high-pressure tubing, need more detailed analysis because stress varies across the wall.

## Spheres

A sphere under internal pressure has the same stress in every direction:

σ = p × r ÷ (2 × t)

For the same pressure, radius and material, a sphere needs only half the wall thickness of a cylinder, which is why large gas storage vessels are sometimes spherical. Spheres are more expensive to fabricate, however, and cylinders are more practical for most vessels.

## Stored energy: gas versus liquid

The hazard of a pressure vessel depends not only on its pressure but on how much energy it stores, and that depends heavily on its contents. A liquid hardly compresses, so a vessel full of pressurised water stores relatively little energy. A gas compresses a great deal, so a vessel of the same size and pressure filled with compressed air stores far more, and releases it violently if the vessel ruptures. Hot water above its atmospheric boiling point adds another danger: if the vessel fails, the water flashes to steam, expanding enormously. That is why boilers and hot-water vessels have their own safety requirements, and why hazard classification standards consider pressure, volume and the nature of the contents together.

## Supports and external loads

Vessels must also carry their own weight, the weight of their contents, wind, earthquake loads, vibration from connected machinery and forces from attached pipework. Saddles, legs and skirts concentrate these loads into the shell, and poorly designed supports can crack a vessel that is otherwise well within its pressure rating. Pipework should be supported independently so that it does not hang from nozzles.

## Heads and ends

Cylinders must be closed at the ends with **heads**, and the shape of the head affects stress and thickness:

- **Hemispherical heads** have the lowest stress for a given thickness, but are the most expensive to form.
- **Ellipsoidal heads**, often with a 2:1 ratio of diameter to depth, offer a good compromise and are widely used.
- **Torispherical heads**, formed from a large-radius dish and a small-radius knuckle, are economical and common in moderate-pressure vessels.
- **Flat heads** must be much thicker because they carry pressure in bending rather than in membrane tension, which is why flat ends are mostly used for small diameters or low pressures.

Where the head meets the cylinder, local bending stresses arise because the two shapes want to expand differently under pressure. Design codes account for these discontinuity stresses.

## Openings, nozzles and reinforcement

Vessels need openings for inlets, outlets, instruments, manways and relief valves. Every opening removes material and concentrates stress around its edge. Codes require **reinforcement** to replace the strength lost, usually by thickening the shell around the opening, adding a reinforcing pad or using a thick-walled nozzle. Nozzles also carry loads from connected piping, which add to the stresses if pipework is poorly supported or forced into alignment.

## Welds and joint efficiency

Most steel pressure vessels are welded. Welds can contain defects such as porosity, lack of fusion and cracks, and the heat of welding changes the properties of the surrounding metal. Design codes link the allowable stress in welded joints to the type of joint and the extent of examination: joints that are fully radiographed or otherwise examined can be credited with a higher **joint efficiency** than joints examined only by spot checks. Welding procedures and welders must be qualified, and welding records are part of the vessel's documentation. The [welded joints for fabricators](/reados/collections/manufacturing-operations-and-design-for-manufacture/welded-joints-for-fabricators/) article explains weld types, procedures and qualification.

## Materials and corrosion allowance

Pressure vessel materials must have specified strength, toughness and, for vessels operating at low temperatures, adequate resistance to brittle fracture. Many vessels are made from carbon steel plate of pressure vessel grades; stainless steels and other alloys are used for corrosive contents, hygiene or temperature extremes.

Designers add a **corrosion allowance**, extra thickness beyond what is needed for pressure, to allow for the metal expected to be lost over the vessel's life. Internal corrosion is particularly common in compressed-air receivers, where condensed water collects at the bottom, and in vessels holding corrosive fluids. The [protecting metal parts from corrosion and wear](/reados/collections/machine-elements-and-mechanical-design/protecting-metals-from-corrosion-and-wear/) article explains corrosion mechanisms and protection.

## Codes and regulation in Australia

In Australia, pressure equipment is covered by a family of standards. The overarching standard for pressure equipment refers to design standards such as the Australian pressure vessel standard, a standard for classifying the **hazard level** of equipment based on pressure, volume and contents, and standards for fabrication, testing and **in-service inspection**. Internationally, the ASME Boiler and Pressure Vessel Code is also widely used.

Work health and safety regulations in each state and territory require certain pressure equipment, depending on its hazard level, to have its design registered and some items registered for operation. Requirements vary between jurisdictions, so owners should check the rules that apply to their equipment and site. Owners and persons conducting a business have duties to ensure that plant, including pressure equipment, is safe, inspected and maintained.

## Testing

New vessels are pressure tested before use to demonstrate strength and tightness. **Hydrostatic testing**, using water at a pressure above the design pressure as required by the applicable code, is preferred because water stores little energy when compressed: if a vessel fails during a hydrostatic test, it usually leaks or tears rather than exploding. **Pneumatic testing** with air or gas stores far more energy and is far more dangerous, so it is used only where hydrostatic testing is impractical and with strict precautions and exclusion zones.

## Relief valves

Every pressure vessel must be protected against pressure rising above its allowable limit. **Pressure relief valves**, also called safety valves, open automatically to release fluid when pressure reaches their set pressure. They must be:

- sized to discharge the maximum flow that could cause over-pressure, such as the full output of a compressor;
- set at or below the vessel's maximum allowable working pressure;
- installed without isolation valves that could cut them off from the vessel, unless permitted by the code with appropriate controls;
- discharging to a safe location; and
- tested and serviced at regular intervals.

Tampering with, adjusting or plugging a relief valve removes the last line of defence against over-pressure. Bursting discs, which rupture at a set pressure, are used in some applications instead of or alongside valves.

## In-service inspection

Vessels deteriorate in service through corrosion, erosion, fatigue from pressure cycling, cracking and damage. Australian standards for in-service inspection set out how the frequency and type of inspection should be determined according to hazard level, condition and history. Inspections may include external visual examination, internal inspection, thickness measurements by ultrasonic testing, crack detection around welds and nozzles, and checks of relief valves, gauges and supports.

Records of design, manufacture, testing, registration, inspection and repairs should be kept for the life of the vessel. Repairs and alterations, especially welding on pressure parts, must be carried out under appropriate procedures and may need re-testing and notification. The [designing against fatigue](/reados/collections/machine-elements-and-mechanical-design/designing-against-fatigue/) article explains why repeated pressure cycles can crack vessels that never see their design pressure.

## A worked example

This is an illustrative example. The vessel and figures are hypothetical, and real assessments must use the applicable code.

A workshop air receiver has an internal radius of about 300 mm and a shell thickness of 6 mm, operating at up to 1.0 MPa, about 10 bar. The approximate hoop stress is:

σ_hoop = 1.0 × 300 ÷ 6 = 50 MPa

and the longitudinal stress is half that, about 25 MPa.

At its scheduled inspection, ultrasonic measurements find that internal corrosion near the bottom of the shell, where condensate has collected for years because the drain valve was rarely opened, has reduced the wall locally to about 4 mm. At that point, the hoop stress becomes about:

σ_hoop = 1.0 × 300 ÷ 4 = 75 MPa

a 50% increase. Whether that is acceptable depends on the design code's allowable stress, the remaining corrosion allowance and the condition of the welds, and the inspector recommends removing the receiver from service pending an engineering assessment. The business replaces it with a new receiver fitted with an automatic condensate drain and adds a weekly check of the drain to its maintenance routine.

## How this applies to a small Australian business

- **List every pressure vessel on site**, including air receivers, hot-water cylinders and accumulators.
- **Check registration and inspection requirements** with the relevant state or territory regulator.
- **Keep relief valves untouched, unobstructed and tested.**
- **Drain condensate from air receivers** regularly or fit automatic drains.
- **Use competent, qualified people** for inspection, repair and any welding on pressure parts.
- **Keep records** of design, testing, inspection and repairs for each vessel.

## Common mistakes

- **Forgetting that small vessels can be dangerous**, especially those containing compressed gas.
- **Isolating, adjusting or plugging relief valves.**
- **Ignoring internal corrosion** in air receivers.
- **Welding on pressure parts** without approved procedures.
- **Losing the vessel's documents**, making registration and assessment difficult.
- **Pneumatic testing without precautions** when hydrostatic testing was possible.

## Frequently asked questions

**Why is hoop stress twice longitudinal stress?** The force trying to split a cylinder lengthwise acts over the full length times diameter, while the force trying to separate it across its length acts only over the end area. The walls resisting the first force must carry twice the stress.

**Is a compressor air receiver really a pressure vessel?** Yes. It stores compressed air with considerable energy and may be subject to registration, inspection and maintenance requirements depending on its size, pressure and the jurisdiction.

**Why is hydrostatic testing safer than pneumatic testing?** Water hardly compresses, so a vessel full of pressurised water stores little energy and usually leaks or tears rather than exploding if it fails.

## Questions to ask

- Which pressure vessels do we own, and are they registered where required?
- When were our relief valves last tested, and by whom?
- Are condensate drains on our air receivers working?
- What inspection regime applies to each vessel, and are we following it?
- Who is allowed to repair or modify pressure equipment on our site?
- Where are the design and manufacturing records for each vessel?

## Bringing it together

A thin-walled cylinder carries a hoop stress of p × r ÷ t, twice its longitudinal stress, which is why cylinders split lengthwise and why longitudinal welds matter. Heads, openings, welds, materials and corrosion allowances are designed to codes, and Australian standards and regulations govern design registration, hazard levels, testing and in-service inspection. Hydrostatic testing, relief valves and regular inspection keep a vessel's margin of safety in place throughout its life. For any business with pressure equipment, the practical steps are simple: know what you have, protect the relief valves, drain and inspect, use competent people for repairs and keep the records.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information and does not replace advice from a qualified pressure equipment engineer, inspector or regulator.*
