---
book: weld-repairs-that-hold
chapterSlug: procedures-welders-and-inspection
order: 9
title: "Procedures, welders and inspection"
description: "Replace judgement by eye with qualified procedures, qualified welders, suitable inspection and the approvals regulated equipment requires."
draft: false
---

The 1919 Airco booklet ends its foreword with a revealing qualification: the cost of welding was less than riveting, depending on the skill of the welder. Everything in the booklet depended on that skill. There was no written procedure tested beforehand, no qualification test for the welder, no inspection method that could look inside the weld, and the only evidence of success was that the joint stopped leaking.

Modern repair practice exists largely to remove that dependence. This chapter describes the controls that now surround a repair weld: the procedure, the welder, the inspection and, for regulated equipment, the approval.

## A procedure that has been proven

A **welding procedure specification** sets out how a weld is to be made: the process, base material, consumables, joint preparation, position, preheat and interpass temperatures, electrical or gas settings, and any post-weld heat treatment. Behind it sits a **procedure qualification record**: evidence that a test weld made to those parameters was examined and tested and met the required properties.

The point is not paperwork. A qualified procedure turns the questions this book has raised, about groove shape, preheat, hydrogen control and heat input, into tested answers for a specific combination of material and thickness. If the repair's conditions fall outside the qualified range, such as a thicker plate, a different material or an untested position, the procedure no longer covers it.

## What a qualification test involves

Qualifying a procedure means making a test weld under controlled conditions and then examining and testing it. The details depend on the standard used, such as ISO 15614-1 for arc welding of steels or ASME Section IX in pressure-equipment work, but the pattern is similar:

1. **A preliminary procedure is written** with the intended parameters.
2. **A test piece is welded** to those parameters, with the actual values recorded as the weld is made: current, voltage, travel speed, preheat, interpass temperature and consumables.
3. **The test piece is inspected without damaging it**, by visual inspection and usually by radiographic or ultrasonic testing.
4. **Specimens are cut and tested.** Tensile tests show the joint is as strong as required. Bend tests stretch the face, root or side of the weld to show ductility and sound fusion. A polished and etched cross-section, called a macro, shows the fusion boundary and penetration. Where the service needs toughness, impact tests are made on the weld metal and the heat-affected zone, and hardness surveys check that the heat-affected zone has not become too hard.
5. **The results are recorded** in the procedure qualification record, and the final procedure specification is issued within the ranges the test supports.

```figure
type: steps
title: How a welding procedure is qualified
caption: The test turns a set of intended parameters into evidence for a defined range of work.
- Write a preliminary procedure
- Weld a test piece | record the actual parameters
- Inspect without damage | visual, radiography or ultrasonics
- Cut and test specimens | tensile, bend, macro, impact, hardness
- *Issue the procedure | within the qualified ranges
```

## Essential variables: when a procedure stops covering the job

Each qualification standard lists **essential variables**: changes that are judged to affect the properties of the weld, so that making them requires a new qualification. Typical examples include a change of welding process, a change to a different material group, thickness outside the qualified range, a change in consumable classification, a reduction in preheat, the addition or removal of post-weld heat treatment and, where toughness is specified, an increase in heat input beyond the qualified range.

The practical consequence is that a workshop cannot pick up a procedure written for one job and use it on a repair that differs in an essential way. Before the tank repair, the supervisor checks the procedure's qualified ranges against the plate's material and thickness, the welding position at the base of the tank, the consumable class and the preheat. Where any of them falls outside, the choice is to qualify a new procedure or to change the repair so that it fits the existing one.

## A welder who has been tested

A procedure is only as good as the hands that follow it. Welder qualification tests a person's ability to produce a sound weld in a given process, position and material range. Qualifications have scope and expiry rules, and they are recorded. For pressure equipment and structural work, the applicable standards specify which qualification schemes apply.

The booklet's practice of a second welder smoothing the inside of a seam while the first welded the outside was, in its way, a quality measure. Today the equivalent is a qualified welder working to a qualified procedure, with the parameters recorded as the work proceeds.

## Recording what was actually done

A procedure states ranges; the record shows where within those ranges the weld was actually made. For a repair whose failure would matter, the welder or supervisor records, for each joint or segment, the measured preheat and interpass temperatures, the current and voltage, the travel speed or the run length and time, and the consumable classification and batch. Those values allow the heat input to be checked against the qualified range after the event, using the same arithmetic as Chapter 2.

This is an illustration. If the tank procedure is qualified for an arc energy between 1.0 and 2.0 kJ/mm, and the welder records 24 V, 180 A and a 146 mm segment completed in 55 seconds, the travel speed is about 159 mm/min and the arc energy is:

**24 × 180 × 60 / (159 × 1,000) ≈ 1.63 kJ/mm**

That is inside the range. A segment completed far more slowly, say in 100 seconds, would give about 2.96 kJ/mm and fall outside it, which the record would show immediately.

Recording takes a few seconds per segment and needs nothing more than a clipboard, a contact thermometer and a watch, or the logging function many modern power sources provide. Its value appears later: when an inspector asks how a weld was made, the answer is a number rather than a recollection. It also protects the welder, whose good work is otherwise indistinguishable from careless work once the joint is ground and painted.

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

## Acceptance criteria: deciding what counts as a defect

Inspection finds **indications**. Whether an indication is a rejectable defect is decided by **acceptance criteria**, which must be agreed before inspection starts. Without them, every indication becomes an argument.

Acceptance criteria come from the governing standard or the contract. ISO 5817, for example, defines quality levels B, C and D for imperfections in arc-welded steel joints, from the most stringent to the least, with limits for each imperfection type such as porosity, undercut, excess reinforcement and misalignment. Structural and pressure-equipment codes have their own criteria. In nearly all of them, cracks are not acceptable at any size.

For the tank, as an illustration, the owner's engineer specifies that the repair welds meet ISO 5817 quality level C, with no cracks permitted, and that the inserts are flush to within the profile limits the standard sets. The inspector then judges each indication against a written limit, not against a feeling.

## The people who inspect

Inspection is only as reliable as the person doing it. Non-destructive testing personnel are commonly certified under ISO 9712, which sets levels of competence by method. In Australia, the Australian Institute for Non-Destructive Testing operates certification to that standard. Welding inspectors and supervisors may hold certification through national schemes or those of the International Institute of Welding. The dossier records who inspected each repair, their certification and the method used, so that the results can be trusted by someone who was not present.

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

## Hold points and the inspection and test plan

For any repair beyond the trivial, an **inspection and test plan** sets out, in order, each activity, the document that controls it, the acceptance criteria, who checks it and whether it is a **hold point**, where work stops until the check is signed off, or a **witness point**, where the owner or inspector may attend.

As an illustration, the tank's plan includes:

- **Fit-up of each insert:** gap, alignment and curvature template check. Hold point.
- **Preheat before each weld:** measured and recorded by the welder. Record only.
- **Root pass on each insert:** visual inspection before filling. Witness point.
- **Completed welds:** visual inspection against the acceptance criteria. Hold point.
- **Penetrant testing:** after the procedure's hold time. Hold point.
- **Fill test:** tank filled and inspected for leaks. Witness point for the owner.

The plan is short, but it fixes the moments at which the evidence is gathered, so nobody finds out after the paint is on that a check was missed.

## Repairing a repair

When inspection finds a rejectable defect, the repair is itself repaired: the defect is excavated, its complete removal confirmed by a surface method, the cavity rewelded to the procedure and the area reinspected by the same method, after the same hold time. Each re-repair adds heat and residual stress to the same spot, so owners and standards often limit the number of repairs at one location before engineering review is needed. The tank's one porosity indication, recorded in Chapter 10, followed exactly this route.

## Exercise: hoop stress at greater depth

Repeat the tank calculation for water 4 m deep in a tank 5 m in diameter with 10 mm plate.

The base pressure is **1,000 × 9.81 × 4 ≈ 39,240 Pa, or about 0.0392 MPa**. The hoop stress is **0.0392 × 5,000 / 20 ≈ 9.8 MPa**. Explain why, even at this level, the inspection plan would still focus on the weld quality, corrosion and attachments rather than on the calculated pressure stress.
