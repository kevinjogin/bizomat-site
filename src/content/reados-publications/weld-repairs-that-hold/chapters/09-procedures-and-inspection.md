---
book: weld-repairs-that-hold
chapterSlug: procedures-welders-and-inspection
order: 9
title: "Procedures, welders and inspection"
description: "Replace judgement by eye with qualified procedures, qualified welders, suitable inspection and the approvals regulated equipment requires."
draft: true
---

The 1919 Airco booklet ends its foreword with a revealing qualification: the cost of welding was less than riveting, depending on the skill of the welder. Everything in the booklet depended on that skill. There was no written procedure tested beforehand, no qualification test for the welder, no inspection method that could look inside the weld, and the only evidence of success was that the joint stopped leaking.

Modern repair practice exists largely to remove that dependence. This chapter describes the controls that now surround a repair weld: the procedure, the welder, the inspection and, for regulated equipment, the approval.

## A procedure that has been proven

A **welding procedure specification** sets out how a weld is to be made: the process, base material, consumables, joint preparation, position, preheat and interpass temperatures, electrical or gas settings, and any post-weld heat treatment. Behind it sits a **procedure qualification record**: evidence that a test weld made to those parameters was examined and tested and met the required properties.

The point is not paperwork. A qualified procedure turns the questions this book has raised, about groove shape, preheat, hydrogen control and heat input, into tested answers for a specific combination of material and thickness. If the repair's conditions fall outside the qualified range, such as a thicker plate, a different material or an untested position, the procedure no longer covers it.

## A welder who has been tested

A procedure is only as good as the hands that follow it. Welder qualification tests a person's ability to produce a sound weld in a given process, position and material range. Qualifications have scope and expiry rules, and they are recorded. For pressure equipment and structural work, the applicable standards specify which qualification schemes apply.

The booklet's practice of a second welder smoothing the inside of a seam while the first welded the outside was, in its way, a quality measure. Today the equivalent is a qualified welder working to a qualified procedure, with the parameters recorded as the work proceeds.

## Inspection that can see the defect

No single inspection method finds everything. The choice depends on the defect being sought, the access and the standard's requirements:

- **Visual inspection** finds surface profile faults, undercut, surface porosity, cracks open to the surface and misalignment. It comes first and costs least.
- **Penetrant testing** reveals fine surface-breaking cracks in most metals by drawing a dye into them.
- **Magnetic particle testing** finds surface and near-surface cracks in ferromagnetic steels, often more sensitively than penetrant on rough surfaces.
- **Ultrasonic testing** detects internal defects such as lack of fusion and cracks, and also measures thickness.
- **Radiographic testing** images internal volumetric defects such as porosity and slag inclusions, and some planar defects depending on their orientation.

```figure
type: decision
title: Matching inspection to the defect
question: What are you looking for?
caption: Inspection is chosen by the defect and the standard, then done by qualified personnel.
- Surface profile, undercut, visible cracks | Visual inspection | always first
- Fine surface cracks | Penetrant or magnetic particle
- *Lack of fusion or internal cracks | Ultrasonic testing
- Porosity and inclusions inside the weld | Radiography
- Remaining plate thickness | Ultrasonic thickness gauging
```

Timing matters as much as method. Chapter 5 explained that hydrogen cracks can form hours after welding, which is why procedures for susceptible steels often require a delay before final inspection.

## Tests that prove the whole part

For pressure equipment, a **hydrostatic test**, pressurising the vessel with water to a pressure set by the applicable standard, demonstrates that the repaired item is tight and has not been weakened enough to yield. It is not a substitute for weld inspection: a vessel can pass a hydrostatic test with defects that will grow in service. It is one piece of evidence among several.

## Who decides, and under which rules

For ordinary fabrications, the owner and their engineer decide what repair and evidence are acceptable. For regulated equipment, other parties have a say, and their requirements govern.

In Australia, boilers and pressure vessels are covered by work health and safety laws administered by state and territory regulators, with plant design and item registration requirements for many classes of pressure equipment. Standards Australia publishes pressure-equipment standards, including AS 1228 for boilers, whose scope includes guidance on locomotive and other heritage boilers, and AS 4458 for the manufacture of pressure equipment. In-service inspection, repair and alteration have their own standard, which should be checked for its current status before use. Operating railways, including heritage operators running steam locomotives, are also regulated by the Office of the National Rail Safety Regulator.

In the United States, steam locomotive boilers are regulated by the Federal Railroad Administration under 49 CFR Part 230, discussed in Chapter 8, and the National Board Inspection Code includes requirements specific to locomotive boilers.

This book does not summarise those documents and cannot substitute for them. The practical rule is simple: for regulated equipment, identify the governing requirements and the parties who must approve the repair before any welding plan is finalised.

```figure
type: layers
title: Controls around a modern repair weld
caption: Each layer narrows what depends on one person's skill on the day.
- Owner and engineer | define the repair and acceptance
- Qualified procedure | tested parameters for this material and thickness
- Qualified welder | proven ability in the process and position
- Inspection | methods matched to the defects sought
- *Regulator or inspection body | approval for regulated equipment
```

## The tank case: an inspection plan proportionate to the job

This is an illustration. The tank is atmospheric. Its stresses come from the water it holds rather than an internal gas pressure. For a cylindrical tank 3 m in diameter with water 2 m deep, the hydrostatic pressure at the base is:

**p = ρ × g × h = 1,000 × 9.81 × 2 ≈ 19,620 Pa, or about 0.0196 MPa**

The hoop stress in 10 mm plate at the base is approximately:

**σ = p × D / (2 × t) = 0.0196 × 3,000 / (2 × 10) ≈ 2.9 MPa**

That is very small compared with the strength of the steel. The tank's repairs are governed by corrosion, fatigue at attachments and the quality of the welds, not by pressure stress. Its inspection plan reflects that: visual inspection of every weld, penetrant inspection of the crack repair and the insert perimeter after a delay, ultrasonic thickness readings around the repaired areas, and a fill test with water before the tank returns to use. A pressurised boiler of similar size would need far more, under the rules that apply to it.

## Exercise: hoop stress at greater depth

Repeat the tank calculation for water 4 m deep in a tank 5 m in diameter with 10 mm plate.

The base pressure is **1,000 × 9.81 × 4 ≈ 39,240 Pa, or about 0.0392 MPa**. The hoop stress is **0.0392 × 5,000 / 20 ≈ 9.8 MPa**. Explain why, even at this level, the inspection plan would still focus on the weld quality, corrosion and attachments rather than on the calculated pressure stress.
