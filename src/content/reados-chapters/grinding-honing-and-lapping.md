---
title: "Grinding, honing and lapping: finishing hard parts to tight tolerances"
description: "How abrasive processes work, how to read a grinding wheel specification, the main grinding methods, honing and lapping, avoiding grinding burn and the design details that make finishing easier."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - quality
  - design
author: "KEVOS"
featured: false
draft: false
---

Some surfaces cannot be finished with a cutting tool alone. A shaft journal that runs in a bearing, a hardened pin that locates a fixture, a hydraulic bore that must seal, a valve seat that must not leak and a gauge face that must be flat to within a fraction of a micrometre all need a combination of accuracy, finish and, often, hardness that conventional turning and milling struggle to deliver. For these surfaces, manufacturers turn to **abrasive processes**: grinding, honing, lapping and their relatives.

Abrasive processes remove material with countless small, hard grains rather than a defined cutting edge. Each grain removes a tiny chip. That allows them to cut hardened steels and other hard materials, to produce fine finishes and to hold tight tolerances on size, roundness and flatness. They also bring their own risks. Grinding generates heat that can damage the part invisibly. Wheels can fail dangerously if misused. Finishing processes are slower and costlier than machining, so specifying them where they are not needed wastes money.

This article explains, in general terms, how abrasive processes work, how to read a grinding wheel specification, the main grinding methods, honing and lapping, how to avoid thermal damage, how deburring fits in, and the design and specification choices that make finishing reliable and economical. It is general information. Grinding wheel safety requirements and manufacturers' instructions must always be followed.

## Why abrasive processes are used

Abrasive finishing is usually chosen for one or more of these reasons:

- **Hardness.** Parts that have been hardened by heat treatment are often too hard to machine economically with conventional tools, so they are machined oversize before heat treatment and ground to size afterwards. The [heat treatment and surface hardening explained](/reados/collections/machine-elements-and-mechanical-design/heat-treatment-and-surface-hardening-explained/) article describes why distortion during hardening makes this sequence common.
- **Accuracy.** Grinding can hold size, roundness and position more tightly than most machining processes.
- **Finish.** Fine surface finishes reduce wear, improve sealing and fatigue life and help bearings and seals perform.
- **Geometry.** Honing and lapping improve roundness, straightness and flatness beyond what the previous process left.

## Reading a grinding wheel specification

Grinding wheels are specified using a standard marking system that describes their abrasive, grain size, grade, structure and bond. A typical conventional wheel marking might read something like "A 60 K 5 V", meaning:

| Position | Example | Meaning |
|---|---|---|
| Abrasive | A | Aluminium oxide; other common types include silicon carbide, ceramic (seeded gel) alumina, cubic boron nitride (CBN) and diamond |
| Grain size | 60 | Grit size; lower numbers are coarser and remove material faster, higher numbers give finer finishes |
| Grade | K | How strongly the bond holds the grains, often described as hardness; earlier letters are softer |
| Structure | 5 | The spacing between grains; more open structures clear chips and coolant better |
| Bond | V | Vitrified; other bonds include resinoid, rubber and metal |

The choice of **abrasive** follows the workpiece material:

- **Aluminium oxide** suits most steels.
- **Silicon carbide** suits cast iron, non-ferrous metals and non-metallic materials.
- **Ceramic alumina** grains fracture to stay sharp and suit demanding steel grinding.
- **CBN** (cubic boron nitride) suits hardened steels and superalloys, offering long wheel life and good thermal behaviour.
- **Diamond** suits carbides, ceramics, glass and some composites, but is generally unsuitable for steel.

The **grade** is often counter-intuitive. For hard materials, a softer grade is usually preferred, because the dull grains need to release so that fresh, sharp grains are exposed. A wheel that is too hard for the job glazes, rubs and overheats the work.

## The main grinding methods

- **Surface grinding** produces flat surfaces, usually with a reciprocating or rotary table and a magnetic chuck.
- **Cylindrical grinding** produces external diameters, typically with the work held between centres or in a chuck. Plunge grinding feeds the wheel straight in; traverse grinding moves along the part.
- **Internal grinding** finishes bores using a small wheel on a long quill.
- **Centreless grinding** supports the work on a rest blade and a regulating wheel rather than centres. Through-feed centreless grinding is very efficient for high volumes of simple cylindrical parts such as pins; in-feed grinding handles parts with shoulders or forms.
- **Creep-feed grinding** takes very deep cuts at slow table speeds, producing profiles that might otherwise be milled.
- **Tool and cutter grinding** sharpens and manufactures cutting tools.
- **Jig and profile grinding** produce precise holes and forms in hardened tooling.

### Truing and dressing

A grinding wheel must be **trued** to run concentrically and **dressed** to expose sharp grains and restore its cutting ability. Dressing is done with diamond tools or rotary dressers. The dressing method strongly affects finish and cutting performance: a coarse dress cuts freely but leaves a rougher finish; a fine dress produces a better finish but cuts more slowly and generates more heat. Many grinding problems, including burn and poor finish, trace back to dressing practice.

## Grinding burn and thermal damage

Most of the energy in grinding becomes heat at the contact zone. If that heat is not controlled, it can damage the workpiece surface in ways that are not visible to the eye:

- **Tempering**, softening a hardened surface;
- **Rehardening**, creating a brittle untempered layer in some steels;
- **Residual tensile stress**, which reduces fatigue life; and
- **Cracking**, in severe cases.

This damage, often called **grinding burn**, may be visible as discolouration, but it can also exist without obvious marks. It can cause premature failure of gears, shafts, bearings and other highly stressed parts.

Common causes include a wheel that is too hard or dull, insufficient or poorly directed coolant, excessive infeed and inadequate dressing. Prevention relies on the right wheel, frequent and appropriate dressing, effective coolant application at the contact zone, sensible infeed rates and a **spark-out**, a final pass or dwell with no further infeed that allows the wheel to clean up the surface. For critical parts, inspection methods such as controlled etching or electromagnetic techniques can detect burn.

## Wheel safety

Grinding wheels store considerable energy at operating speed, and a wheel failure can cause serious injury. Basic practices include:

- never exceeding the maximum operating speed marked on the wheel;
- inspecting wheels before mounting, including a ring test for vitrified wheels where appropriate;
- mounting with the correct flanges and blotters;
- keeping guards in place and correctly adjusted;
- standing clear of the plane of rotation when starting a wheel; and
- training operators in safe use.

These practices sit within an employer's broader obligations under work health and safety legislation. Wheel and machine manufacturers' instructions should always be followed.

## Honing

**Honing** finishes bores using abrasive stones mounted on a tool that rotates and reciprocates through the bore while expanding gently. Honing improves size, roundness, straightness and cylindricity, and produces a characteristic **crosshatch** pattern. The crosshatch angle and finish can be controlled to suit the application; in engine cylinders and hydraulic bores, for example, the pattern helps retain an oil film.

Honing generally follows the existing bore axis, so like reaming it improves geometry and finish more than position. It is widely used for hydraulic cylinders, engine bores, gear bores and bushes. **Plateau honing** removes the peaks from a honed surface while keeping valleys for oil retention, producing surfaces that run in quickly.

## Lapping and polishing

**Lapping** uses loose abrasive particles in a carrier fluid between the workpiece and a lap, a plate or tool usually softer than the workpiece. Relative motion causes the abrasive to remove tiny amounts of material, producing very flat surfaces and fine finishes. Lapping is used for sealing faces, valve components, gauge blocks, optical and measuring surfaces and precision flat parts. Flatness of lapped surfaces is often checked with optical flats, which show interference bands.

**Polishing** and **superfinishing** further reduce roughness, often for appearance, cleanliness, sealing or fatigue performance. They improve finish but usually do little to correct geometry.

## Deburring and edge finishing

Almost every machined part needs its edges finished. Burrs cause assembly problems, injuries and stress concentrations. Methods range from hand files and rotary burrs, through abrasive belts and brushes, to mass-finishing methods such as vibratory finishing and tumbling, and specialised processes for internal intersections. Specifying edges on drawings, for example "break all sharp edges 0.2 to 0.5 mm" or a defined chamfer where it matters, prevents both sharp edges and unnecessary hand work.

## Choosing the finishing process

The finishing processes overlap, so the choice depends on what the surface needs most.

| Need | Usual first choice | Alternatives worth considering |
|---|---|---|
| Accurate external diameter on hardened steel | Cylindrical or centreless grinding | Hard turning with CBN tools |
| Flat, parallel faces on hardened parts | Surface grinding | Double-disc grinding for volume; lapping for very high flatness |
| Bore with good roundness, straightness and finish | Honing | Internal grinding; precision boring for softer materials |
| Sealing face that must not leak | Lapping | Fine grinding plus polishing, depending on the seal |
| Smooth surface for appearance or cleanliness | Polishing or mass finishing | Electropolishing for some stainless applications |
| Sharp edges removed consistently | Mass finishing or brushing | Defined chamfers machined in the main operation |

Process choice also depends on volume. Centreless grinding, double-disc grinding and automated honing suit high volumes, while manual surface grinding and hand lapping suit small batches and tooling work.

## Design and specification choices

Designers can make abrasive finishing more reliable and less expensive:

- **Specify ground surfaces only where function needs them.** Bearing seats, sealing diameters and locating surfaces may need grinding; most other surfaces do not.
- **Allow grinding relief.** At a shoulder, a cylindrical grinding wheel cannot grind cleanly into a sharp internal corner. An undercut or relief groove, or a defined corner radius the wheel can form, avoids uncleaned corners and stress concentrations.
- **Provide stock allowance.** Parts machined before heat treatment need enough allowance for distortion and finishing, but not so much that grinding becomes slow and hot.
- **Avoid interrupted surfaces where possible.** Holes, slots and keyways across a ground surface can cause burn and chatter at the edges.
- **Specify finish and geometry clearly.** State the surface roughness and any roundness, cylindricity or flatness requirement that matters, rather than relying on "grind" notes.
- **Consider hard turning.** For some hardened parts, turning with CBN tools on a rigid lathe can replace grinding, offering flexibility and lower cost for suitable geometries and tolerances.

The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains how to choose finishes and tolerances that match function.

## A worked example

This is an illustrative example. The part, figures and events are hypothetical.

A small manufacturer makes hardened steel locating pins for its own fixtures and for a customer, about 2,000 pins a year. The pins are turned, case hardened and then ground on the locating diameter to a close tolerance with a fine finish. The customer reports that several pins have cracked in service at the shoulder.

The investigation finds two problems. First, the drawing shows a sharp internal corner at the shoulder, which the grinder cannot form cleanly; operators blend it by hand, leaving a stress concentration. Second, the grinding wheel has been dressed only at the start of each shift. Towards the end of a batch, the wheel dulls and the pins show faint discolouration near the shoulder, suggesting grinding burn.

The manufacturer makes three changes. It revises the drawing to include a small relief groove at the shoulder, with a defined radius that the wheel can generate. It dresses the wheel every 50 pins, with the interval set from a trial that monitored spindle load and finish. It improves coolant delivery to the contact zone and adds a spark-out pass. It also asks its heat treater to confirm case depth on sample pins, so that grinding does not remove too much of the hardened layer. Cracking does not recur, and the hand blending step disappears.

## How this applies to a small Australian business

- **Grind only where function requires it.** Every ground surface adds cost and lead time.
- **Design for the process.** Relief grooves, sensible allowances and clear finish requirements prevent problems.
- **Treat dressing as a controlled variable.** Set and record dressing intervals and methods.
- **Watch for burn on critical parts.** Discolouration is a warning, and its absence is not proof of soundness.
- **Follow wheel safety rules.** Wheel failures are rare but serious.
- **Ask about alternatives.** Hard turning, precision boring or honing may be more economical for some features.
- **Specify edges.** Define edge breaks and chamfers to avoid both sharp edges and unnecessary hand finishing.

## Common mistakes

- **Specifying grinding everywhere** "to be safe".
- **Sharp internal corners at ground shoulders.**
- **Too much or too little stock** left for grinding after heat treatment.
- **Wheels that are too hard for the material**, causing glazing and heat.
- **Infrequent dressing**, leading to burn and poor finish.
- **Assuming no discolouration means no damage.**
- **Ignoring wheel speed and guarding requirements.**

## Frequently asked questions

**Why is a softer wheel used for harder materials?** Because hard materials dull the abrasive grains quickly. A softer bond releases dull grains so that sharp ones are exposed, keeping the wheel cutting rather than rubbing.

**Can grinding fix a part that is out of position?** Grinding between centres or on a properly located set-up can correct some position and runout errors, but only within the stock available. Honing and reaming largely follow existing geometry.

## Questions to ask

- Which surfaces genuinely need grinding, honing or lapping, and why?
- Do our drawings provide relief grooves and clear finish and geometry requirements?
- How much stock is left for grinding after heat treatment, and is it consistent?
- How are wheels selected, dressed and inspected, and is that recorded?
- How would we detect grinding burn on critical parts?
- Could hard turning or another process replace grinding for any features?

## Bringing it together

Abrasive processes finish hard materials to tolerances and finishes that cutting tools cannot easily achieve. Choosing the right abrasive, grade, structure and bond, controlling dressing, coolant and infeed, and including a spark-out produces accurate, sound surfaces; ignoring those factors produces grinding burn that may not show until a part fails. Honing and lapping extend accuracy further for bores and flat faces. Designers contribute by specifying finishing only where function needs it, providing relief at shoulders, allowing sensible stock and stating finish and geometry requirements clearly.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow grinding wheel and machine manufacturers' instructions and applicable safety requirements.*
