---
title: "EDM, micromachining and other non-traditional processes: when cutting tools are not the answer"
description: "How wire and sinker EDM work, what they can and cannot do, the recast layer, other non-traditional processes such as ECM, etching and ultrasonic machining, and the challenges of very small features."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

Conventional machining relies on a cutting tool that is harder than the workpiece and strong enough to withstand the forces of cutting. That works for most parts. It struggles when the material is already hardened, when the feature is a sharp internal corner or a deep narrow slot, when the part is too thin or delicate to resist cutting forces, or when the features are so small that cutters become fragile. Tool and die makers, mould makers and precision component manufacturers meet these limits every day.

A family of **non-traditional machining** processes removes material in other ways: with electrical sparks, electrochemical dissolution, chemical etching, focused light or high-pressure water. The best known in workshops is **electrical discharge machining** (EDM), in its wire and sinker forms. These processes do not care how hard a conductive material is, impose little or no mechanical force and can produce shapes that cutting tools cannot. They are also slower, more specialised and bring their own effects on the surface that designers need to understand.

This article explains, in general terms, how wire and sinker EDM work, their capabilities and limitations, the recast layer and why it matters, other non-traditional processes and their uses, the particular challenges of micromachining, and design guidance for parts that will use these processes. It is general information; specialist suppliers can advise on what is achievable for a particular part and material.

## How electrical discharge machining works

EDM removes material through a rapid series of controlled electrical sparks between an electrode and the workpiece, which are separated by a small gap filled with a **dielectric** fluid. Each spark melts and vaporises a tiny amount of material, and the fluid flushes the debris away. Because material is removed thermally rather than by cutting, the hardness of the workpiece does not matter, but it must conduct electricity.

Key consequences follow:

- **Hard materials are no obstacle.** Hardened tool steels, carbides and heat-resistant alloys can be machined after heat treatment.
- **There are no cutting forces.** Thin walls, fine ribs and delicate features can be produced without distortion from the tool.
- **The electrode determines the shape.** In wire EDM the wire path defines the profile; in sinker EDM the electrode's shape is reproduced in the workpiece.
- **Removal rates are low** compared with conventional machining, so EDM is used for features that justify it, not for bulk material removal.

## Wire EDM

In **wire EDM**, a thin wire, typically a fraction of a millimetre in diameter and often brass or coated brass, travels continuously between two guides and cuts through the workpiece like a very precise bandsaw, following a programmed path. Deionised water is commonly used as the dielectric.

Wire EDM is widely used for:

- punches, dies and stripper plates for press tools;
- extrusion dies and profile tooling;
- precision slots, keyways and gear forms;
- parts from hardened material where distortion from heat treatment must be avoided; and
- prototype parts with complex profiles in hard materials.

Important characteristics include:

- **It needs a through path.** The wire must pass through the part, so internal profiles need a **start hole**, often drilled by small-hole EDM.
- **Internal corners have a minimum radius**, set by the wire radius plus the spark gap. External corners can be sharp.
- **Taper cutting** is possible by tilting the wire, producing die clearance or angled features.
- **Skim passes improve accuracy and finish.** A first roughing cut is followed by one or more lighter passes that remove the damaged layer and refine size.
- **Speed depends on thickness and finish.** Cutting time is usually estimated from the cut area, the perimeter multiplied by the thickness, and rises with each skim pass.

## Sinker EDM

In **sinker EDM**, also called ram or die-sinking EDM, a shaped electrode, commonly graphite or copper, is advanced into the workpiece under a dielectric oil, reproducing its shape as a cavity. Sinker EDM is used for:

- mould cavities, including deep ribs and fine details in injection moulds;
- blind features, such as blind keyways, splines and polygon pockets;
- sharp internal corners and details that a rotating cutter cannot reach; and
- features in hardened tooling after heat treatment.

The electrode itself wears during machining, so roughing and finishing electrodes are often used, and some machines orbit the electrode to improve finish and compensate for wear. Electrodes must be designed and machined, which adds cost and time but allows complex shapes to be reproduced repeatedly.

### Small-hole EDM

A specialised form uses a rotating tubular electrode to drill small, deep holes quickly in conductive materials, regardless of hardness. It is commonly used for wire EDM start holes and for small holes in hard or difficult materials.

## The recast layer

Because EDM melts the surface, a thin **recast layer**, sometimes called a white layer, forms on the machined surface, with a heat-affected zone beneath it. The recast layer can be harder and more brittle than the base material and may contain micro-cracks. For many tooling applications it is acceptable or removed by skim passes. For parts subject to high cyclic stresses, such as aerospace components or highly loaded springs and fixtures, it may reduce fatigue life and may need to be minimised or removed by additional finishing.

Designers of critical parts should consider whether recast layer limits need to be specified and, where relevant, how they will be verified.

## Other non-traditional processes

| Process | How it removes material | Typical uses | Notes |
|---|---|---|---|
| Electrochemical machining (ECM) | Controlled anodic dissolution in an electrolyte | Turbine components, deburring internal passages, complex shapes in hard alloys | No tool wear or recast layer; specialised equipment and electrolyte management |
| Laser machining | Focused laser energy melts or vaporises material | Cutting sheet, drilling small holes, marking, micromachining | Heat-affected zone; capabilities vary widely with laser type |
| Abrasive waterjet | High-pressure water with abrasive particles erodes material | Cutting plate, stone, glass, composites, heat-sensitive materials | Cold process; taper and edge finish depend on speed |
| Ultrasonic machining | Vibrating tool drives abrasive slurry against brittle materials | Holes and shapes in ceramics, glass and other brittle materials | Slow; suited to hard, brittle non-conductors |
| Photochemical machining (etching) | Chemical etching through a patterned resist | Thin metal parts such as shims, meshes, flexures and precision springs | No burrs or stresses; limited to thin material |

```figure
type: decision
title: Choosing a non-traditional process
question: What is the part or material like?
caption: EDM needs a conductive workpiece; other processes cover what it cannot.
- Hard alloy, complex shape, no recast wanted | Electrochemical machining
- Sheet, small holes, marking | Laser
- Heat-sensitive plate, stone, glass, composites | Abrasive waterjet
- Brittle non-conductors | Ultrasonic machining
- *Thin precision metal parts | Photochemical etching
```

The [choosing a cutting process for plate and sheet](/reados/collections/machining-and-metal-parts/choosing-a-cutting-process-for-plate-and-sheet/) article compares laser, plasma, waterjet and other profile-cutting processes in more detail.

## Micromachining

**Micromachining** generally refers to producing features in roughly the sub-millimetre range: tiny holes, slots, channels and fine details in medical devices, electronics, optics, watch parts and microfluidic components. At these scales, several things change:

- **Tools become fragile.** Micro end mills and drills can be well under a millimetre in diameter and break easily. Spindle runout that would be negligible for a larger tool can be a significant fraction of a micro tool's diameter.
- **Speeds must be very high** to achieve reasonable cutting speeds with tiny diameters, requiring high-speed spindles.
- **Size effects matter.** When the chip thickness approaches the cutting edge radius, the tool may plough rather than cut, affecting finish and burrs.
- **Burrs are proportionally large.** A burr that is trivial on a large part may be larger than the feature itself.
- **Measurement is harder.** Optical, vision and specialised contact systems are often needed to verify features.

Micro EDM, laser micromachining and photochemical etching are often used alongside micro milling and drilling, each suiting different materials and features.

## Choosing a process

The right process depends on the material, feature, tolerance, volume and cost:

- **Is the material conductive?** EDM and ECM require it; ultrasonic machining, waterjet and some laser processes do not.
- **Is it already hardened, or would heat treatment distort it?** EDM after hardening often avoids distortion problems. The [heat treatment and surface hardening explained](/reados/collections/machine-elements-and-mechanical-design/heat-treatment-and-surface-hardening-explained/) article covers why distortion occurs.
- **Is the feature internal, blind or sharp-cornered?** Wire EDM needs through paths; sinker EDM suits blind features and sharp internal corners.
- **How important is surface integrity?** Recast layers and heat-affected zones may matter for fatigue-critical parts.
- **What volume is needed?** EDM suits tooling and low to moderate volumes; for high volumes, other processes may be more economical once tooling exists.

## How EDM work is costed

Understanding how suppliers price EDM helps when comparing quotes and making design choices. Wire EDM is usually priced on machine time, which depends on the cut area (perimeter multiplied by thickness), the number of skim passes needed for the required accuracy and finish, set-up and alignment time, and any start holes. Thicker parts and finer finishes take longer. Stacking several thin parts and cutting them together can reduce cost per part.

Sinker EDM costs include electrode design and manufacture, which can be a large share of the total, as well as burn time, which rises with cavity volume, depth and finish requirements. Reusing standard electrodes for repeated features, and avoiding unnecessary fine finishes on non-functional surfaces, reduces cost.

When a quote seems high, ask how many passes are assumed and why. Sometimes relaxing a finish requirement on one surface, or allowing a slightly larger internal radius, removes a pass or an electrode.

## Accuracy and finish in practice

EDM is capable of high accuracy and fine finishes, but achieving them consistently depends on the machine, wire or electrode, number of passes, material, part thickness and temperature control. Thick parts may show slight barrelling or taper, and long cuts may move slightly as internal stresses in the material are released during cutting. Stress-relieving material before cutting, cutting a relief slot first or leaving small tabs that are removed later are common techniques to control this movement. Ask suppliers what they can reliably hold on parts like yours, rather than relying on general capability figures.

## Design guidance

- **Use EDM where it adds value**, such as hardened material, delicate features, sharp internal corners or complex profiles, not as a default.
- **Allow internal radii for wire EDM** that suit the wire and gap.
- **Provide start holes** or specify their location for internal wire-cut profiles.
- **Specify finish and recast requirements** for critical surfaces, rather than leaving them implicit.
- **Consider electrode cost** for sinker EDM, and standardise details where repeated electrodes can be reused.
- **Talk to the specialist early.** EDM and micromachining suppliers can often suggest small changes that reduce time dramatically.

## A worked example

This is an illustrative example. The figures, including cutting rates, are hypothetical and chosen only to show the reasoning.

A small toolmaker is making a punch and die for a bracket blanked from 3 mm steel. Previously, it machined the die plate in the soft state, heat treated it and then hand-finished the profile, but distortion during hardening often required rework and occasionally scrapped a die block.

It now rough machines the die plate, heat treats it to final hardness and wire cuts the die opening afterwards. The die opening has a perimeter of about 300 mm, and the plate is 20 mm thick, giving a cut area of 300 × 20 = 6,000 mm². Assuming a roughing rate of about 150 mm² per minute for this material and thickness, the main cut takes about 40 minutes, and two skim passes add further time, so the total wire time is around two hours including set-up. The punch is wire cut from hardened stock in the same way, with the die clearance built into the programmed offsets, so that punch and die match precisely.

```figure
type: timeline
title: Cutting a die after hardening
caption: Wire cutting after heat treatment removed the distortion rework that had sometimes scrapped die blocks.
- Rough machine | Die plate in the soft state
- Heat treat | To final hardness
- Wire cut | 300 mm perimeter × 20 mm: 6,000 mm² | main cut about 40 minutes at 150 mm² a minute
- *Skim passes | Total wire time about two hours | punch cut the same way, clearance in the offsets
```

Distortion-related rework disappears, and the die clearance is consistent around the profile, which improves the quality of the blanked parts and the life of the tool.

## How this applies to a small Australian business

- **Know where non-traditional processes help.** Hardened tooling, delicate parts, sharp internal corners and fine features are the usual cases.
- **Use specialist subcontractors.** Many small manufacturers buy wire and sinker EDM services rather than owning the machines.
- **Plan heat treatment around EDM.** Hardening before final EDM often avoids distortion problems.
- **Specify surface integrity for critical parts.** Do not leave recast layer requirements to chance.
- **Respect the scale of micromachining.** Small features need specialised tools, spindles and measurement.

## Common mistakes

- **Using EDM for bulk removal** that conventional machining could do faster.
- **Forgetting start holes** for internal wire-cut profiles.
- **Specifying sharp internal corners** for wire EDM.
- **Ignoring the recast layer** on fatigue-critical parts.
- **Underestimating electrode cost and wear** in sinker EDM.
- **Treating micro features like small versions of normal ones**, without accounting for tool fragility, burrs and measurement.

## Frequently asked questions

**Can EDM machine non-conductive materials?** Conventional EDM requires an electrically conductive workpiece. Non-conductive materials such as most ceramics, glass and plastics need other processes, such as ultrasonic machining, laser machining, waterjet or grinding.

**Is a wire-cut surface ready for use?** For many tooling applications, yes, after appropriate skim passes. For fatigue-critical parts or sliding surfaces, further finishing may be needed.

## Questions to ask

- Which of our parts would benefit from machining after heat treatment?
- Do our designs include features that only EDM can produce economically, and are they necessary?
- Do our drawings specify start holes, internal radii and finish requirements for EDM features?
- Are recast layer limits relevant to any of our critical parts?
- Which subcontractors can we rely on for EDM, laser, waterjet or etching work?

## Bringing it together

Non-traditional processes extend machining beyond the limits of cutting tools. Wire EDM cuts precise through profiles in hardened conductive materials, sinker EDM forms cavities, blind features and sharp internal details, and small-hole EDM drills fast holes in hard materials. ECM, laser, waterjet, ultrasonic machining and photochemical etching each serve particular materials and features. All bring trade-offs in speed, cost and surface integrity, and micromachining adds challenges of tool fragility, burrs and measurement. Used deliberately, for the features where they add real value, these processes solve problems that conventional machining cannot.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
