---
title: "Heat treatment and surface hardening explained for designers and buyers"
description: "A drawing that just says \"harden\" invites cracked, distorted or soft parts. How heat treatment works, which process suits which part, and how to specify and verify the result."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - manufacturing
  - design
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

Heat treatment changes the properties of a metal part without changing its shape: softening it for machining, hardening it for wear, toughening it for shock, or relieving the stresses left by welding and machining. It is one of the most powerful tools in mechanical engineering and one of the most frequently misunderstood. Drawings often carry a single word, "harden", or a single hardness number with no tolerance, no scale and no location. The heat treater has to guess, and the result can be parts that crack, distort, wear quickly or fail in service.

Most heat treatment problems trace back to three causes: a material that cannot achieve the required result, a part shape that invites distortion and cracking, or a specification that does not say clearly what is needed and how it will be checked. All three are within the control of the designer and the buyer. Understanding the basics makes it possible to choose the right process, design parts that survive it and write specifications that suppliers can meet and verify.

This article explains how steel heat treatment works, the main processes and what each is for, how surface hardening gives wear resistance with a tough core, how to design parts that heat treat well, and how to specify and verify heat treatment. It is general information for designers, engineers and buyers. Heat treatment of critical parts should follow the relevant standards and the advice of a qualified metallurgist or experienced heat treater.

## How steel heat treatment works

Steel's internal structure changes with temperature. Heated above a **critical temperature**, typically somewhere between about 730 and 900 °C depending on the carbon content, steel becomes **austenite**, a structure in which carbon dissolves freely. What happens next depends on how fast the steel cools:

- **Slow cooling** lets the carbon separate out, forming soft **ferrite** and layered **pearlite**. The steel is soft, ductile and easy to machine.
- **Rapid cooling**, called **quenching**, traps the carbon before it can separate, forming **martensite**, which is very hard but brittle.

The amount of carbon decides how hard the martensite can become. Low-carbon steels, below about 0.25% carbon, cannot be hardened significantly by quenching. Medium- and high-carbon steels can. Alloying elements such as chromium, molybdenum and nickel slow the transformation, so thicker sections can harden with slower, gentler quenches in oil or air. This property is called **hardenability**.

## The main heat treatment processes

| Process | What it involves | Purpose |
|---|---|---|
| Annealing | Heating into the austenite range and cooling slowly, often in the furnace | Softest condition for machining and forming, relieves stress |
| Normalising | Heating into the austenite range and cooling in still air | Fine, uniform grain structure with moderate strength |
| Stress relieving | Heating below the critical temperature and cooling slowly | Relieves stresses from welding, machining or forming without changing structure much |
| Hardening | Heating into the austenite range and quenching in water, polymer, oil or gas | High hardness and strength |
| Tempering | Reheating hardened steel to a moderate temperature | Trades some hardness for toughness, relieves quench stresses |
| Hardening and tempering | Hardening followed by tempering, sometimes called quenching and tempering | A chosen balance of strength and toughness through the section |

**Tempering** is almost always needed after hardening. As-quenched martensite is too brittle to trust, and quenching leaves high internal stresses. Tempering at somewhere between about 150 and 650 °C relieves those stresses and restores toughness. Low tempering temperatures keep most of the hardness for cutting edges and wear surfaces; higher temperatures give the toughness that shafts, gears and structural parts need. Heat treaters avoid tempering ranges that can reduce toughness in some steels.

Other metals have their own treatments. Heat-treatable aluminium alloys are **solution treated** and **aged**, a process called precipitation hardening, which gives tempers such as T6. Austenitic stainless steels cannot be hardened by heat treatment but are **solution annealed** to restore corrosion resistance after some processing. Precipitation-hardening stainless steels such as 17-4PH are aged to high strength.

## Surface hardening: a hard skin on a tough core

Many parts need a hard, wear-resistant surface over a tough core that resists shock and fatigue: gear teeth, cams, shaft journals, pins and rollers. Surface hardening provides this in two main ways.

### Case hardening by diffusion

**Carburising** heats low-carbon or low-alloy steel in a carbon-rich atmosphere, so carbon diffuses into the surface. The part is then quenched, hardening the high-carbon skin while the low-carbon core stays tough, and tempered.

**Carbonitriding** adds nitrogen as well as carbon, suiting thinner cases. **Nitriding** diffuses nitrogen into suitable alloy steels at lower temperatures, around 500 to 570 °C, without quenching, giving a very hard, wear-resistant surface with little distortion. **Nitrocarburising** produces a thin, hard compound layer for wear and scuffing resistance.

Diffusion depth grows roughly with the square root of time. If a process reaches a 0.5 mm case in 4 hours, doubling the case to 1.0 mm takes about 16 hours, four times as long. Deep cases are therefore slow and expensive.

```figure
type: bars
title: Diffusion case depth against time
unit: hours
max: 18
caption: Depth grows with the square root of time, so doubling the case takes four times as long.
- 0.5 mm case | 4
- *1.0 mm case | 16
```

### Selective hardening

**Induction hardening** uses an electrical coil to heat only the surface layer of a medium-carbon or alloy steel part rapidly, followed by a quench. It hardens specific areas, such as journals or gear teeth, quickly and repeatably, and suits production volumes. **Flame hardening** does the same with a gas flame and suits large parts and small quantities.

Both leave the core and unhardened areas in their original condition, typically already hardened and tempered to a moderate level for core strength.

### Choosing a surface hardening method

| Method | Suitable steels | Case depth | Distortion | Typical uses |
|---|---|---|---|---|
| Carburising | Low-carbon and low-alloy case-hardening steels | Moderate to deep | Moderate to high; often ground afterwards | Gears, heavily loaded shafts and pins |
| Nitriding | Alloy steels containing nitride-forming elements | Shallow | Low | Precision parts, dies, crankshafts |
| Nitrocarburising | Most steels | Very shallow | Low | Wear and scuffing resistance on lightly loaded parts |
| Induction hardening | Medium-carbon and alloy steels | Moderate | Local, controllable | Shafts, journals, pins, gear teeth |
| Flame hardening | Medium-carbon and alloy steels | Moderate | Local | Large parts, low volume |

## Measuring hardness

Hardness is measured by pressing an indenter into the surface:

- **Rockwell C (HRC)** suits hardened steels.
- **Brinell (HB)** suits softer steels, castings and forgings, using a larger ball indenter.
- **Vickers (HV)** suits thin cases and small areas, and is used for measuring hardness profiles through a case on a sectioned sample.

Conversions between scales are approximate, so specify the scale you intend to measure on. Case depth is usually specified as an **effective case depth**: the depth at which hardness falls to a specified value, such as 550 HV, measured on a sectioned sample or test piece.

## Designing parts that heat treat well

Heat treatment, especially quenching, causes **distortion** and can cause **cracking**, because different parts of a component cool and transform at different times. Design choices reduce the risk:

- **Keep sections as uniform as practical**, and avoid thin sections next to heavy ones.
- **Use generous radii** at shoulders, keyways and grooves. Sharp corners concentrate stresses and are common sites for quench cracks.
- **Keep holes away from edges** and from each other where possible.
- **Balance the geometry** so the part does not bend as it cools unevenly.
- **Leave grinding allowance** on surfaces that must be precise after hardening.
- **Plan the sequence**: rough machining, stress relieving if needed, hardening and tempering, then finish machining or grinding.
- **Choose a steel with enough hardenability** for the section, so a gentler quench can be used.
- **Mark areas to stay soft**, such as threads or areas to be drilled or welded later.

Grinding hardened parts needs care. Aggressive grinding can overheat the surface, softening or cracking it, damage known as **grinding burn**. It can be detected by etch inspection and prevented by sound grinding practice.

## Welded parts and residual stresses

Welding heats metal locally and lets it cool quickly, leaving **residual stresses** and, in hardenable steels, hard zones next to the weld. **Post-weld heat treatment**, usually a controlled stress relief, reduces these stresses and tempers hard zones. It is required by some pressure equipment and structural codes for thicker sections or certain materials, and it is often used before precision machining of large fabrications so they do not move when material is removed. Large fabrications need suitable furnace capacity and support during treatment, so plan this early.

Residual stresses can also be beneficial. **Shot peening** bombards a surface with small, hard media, creating a layer of compressive stress that slows fatigue crack growth. It is widely used on springs, gears and highly stressed shafts and can be specified alongside heat treatment where fatigue life matters.

## Specifying heat treatment on drawings

A clear specification states:

- **Material** by standard and grade, so the heat treater knows what it can achieve.
- **Process**, such as hardened and tempered, carburised, induction hardened or nitrided.
- **Hardness as a range with a scale**, such as 28 to 34 HRC, not a single number.
- **Case depth as a range**, with the hardness definition used, for surface-hardened parts.
- **Core hardness**, where it matters.
- **Areas to be hardened** and areas to be kept soft or masked, shown on the drawing.
- **Where hardness will be tested**, and whether on the part or on a test piece.
- **Certificates and records** required, such as hardness results, furnace charts and material certificates.
- **Additional inspection**, such as magnetic particle crack testing after hardening or grinding for critical parts.

## Verifying the result

Hardness testing is quick and cheap, but it shows only surface hardness at the test point. Case depth needs a sectioned sample or a representative test piece processed with the batch. Crack detection needs magnetic particle or dye penetrant inspection. Agree the sampling plan with the supplier, keep batch traceability, and include heat treatment checks in supplier inspection plans. The [inspection and test plans for supplier work](/reados/collections/suppliers-contractors-and-government-work/inspection-and-test-plans-for-supplier-work/) article explains how to set these up.

When a heat-treated part fails, investigate rather than simply replacing it. The fracture surface, the hardness and a metallurgical section often show whether the cause was material, heat treatment, design or service conditions. The [small failures worth explaining](/reados/collections/records-business-data-and-learning/small-failures-worth-explaining/) article covers how to learn from failures like these.

## A worked example

This is an illustrative example. A business makes drive pins for agricultural equipment from 1045 steel, with a drawing note that says only "harden". The heat treater water-quenches the pins for maximum hardness. Some pins crack at a sharp-edged cross-hole during heat treatment or soon after assembly, and others wear quickly at the bearing surface.

**Investigation.** Sectioning shows that the cross-hole cracks started at sharp edges and that hardness varied widely between batches. The drawing gave no hardness range, no scale, no tempering requirement and no indication of where hardness mattered.

**Revised design and specification.**

- The material changes to 4140, supplied hardened and tempered to 28 to 34 HRC for core strength.
- Cross-hole edges are chamfered and radiused.
- The bearing surface is induction hardened to 50 to 55 HRC with an effective case depth of 1.5 to 2.5 mm; the cross-hole area is excluded.
- The heat treater supplies hardness results and a sectioned sample from each batch, and the first batches are magnetic particle inspected in full, moving to sampling once results are consistent.

**Result.** Cracking stops, hardness is consistent between batches, and wear-related returns fall over the following seasons. The specification also makes it straightforward to quote the work with other heat treaters.

```figure
type: compare
title: Drive pins: "harden" against a real specification
cols: Before | After
best: 2
caption: Cracking stopped and the specification can now be quoted by other heat treaters.
- Material | 1045, water-quenched | 4140, hardened and tempered to 28–34 HRC
- Cross-hole | Sharp edges that cracked | Chamfered and radiused, excluded from hardening
- Bearing surface | Variable hardness, fast wear | Induction hardened to 50–55 HRC, 1.5–2.5 mm case
- *Verification | None | Hardness results and a sectioned sample each batch
```

## Applying this in an Australian business

- **Choose a steel** that can achieve the required hardness in the section size.
- **Pick the process** for the job: through-hardening, case hardening or selective hardening.
- **Design for heat treatment**, with uniform sections and generous radii.
- **Specify hardness and case depth as ranges**, with scales and locations.
- **Plan the machining sequence** around heat treatment.
- **Ask for test results** and traceability.
- **Inspect for cracks** on critical parts.
- **Investigate failures** before changing suppliers or materials.

## Where heat treatment goes wrong

- **A drawing note that just says "harden".**
- **Trying to harden low-carbon steel** by quenching.
- **Sharp corners and holes near edges** that crack during quenching.
- **No tempering**, leaving brittle parts.
- **No allowance for distortion** or finish grinding.
- **Grinding burn** after hardening.
- **Checking surface hardness only** when case depth or core hardness matters.

## Questions to ask before sending parts for heat treatment

- Can this steel reach the hardness we need in this section size?
- Which areas need to be hard, which need to stay soft, and why?
- What hardness range, scale and case depth do we need?
- How will distortion be controlled and corrected?
- How will the results be tested, recorded and traced?
- Which inspection is needed for cracks on critical parts?

## Bringing it together

Heat treatment can make the same steel soft and machinable, hard and wear resistant, or tough and strong. Getting the right result needs a steel with suitable carbon content and hardenability, a process matched to the part's function, a shape designed to resist distortion and cracking, and a specification that states hardness ranges, scales, case depths, locations and verification. Surface hardening by carburising, nitriding or induction gives hard surfaces over tough cores for gears, shafts and pins. Plan machining around heat treatment, ask for records, inspect critical parts for cracks and investigate failures. The result is parts that wear well, resist shock and are consistent from batch to batch.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT engineering handbooks on hardening, tempering and annealing, tool steels and standard steels, together with established heat treatment practice. The worked example is illustrative. This article is general information; seek qualified metallurgical advice for critical parts.*
