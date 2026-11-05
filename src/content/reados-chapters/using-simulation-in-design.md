---
title: "Using simulation in design: finite element analysis and motion studies without false confidence"
description: "How FEA and motion studies work, where errors come from in geometry, materials, meshes and boundary conditions, how to recognise stress singularities and how to verify results before trusting them."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - product-development
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

Simulation tools have never been more accessible. Most 3D CAD systems now include finite element analysis, motion studies and often flow and thermal simulation, and a designer can produce a colourful stress plot within minutes of finishing a model. That accessibility is a genuine advance. Problems that once needed a specialist analyst, a mainframe and weeks of work can now be explored early in design, when changes are cheap, and many weak designs are improved before a prototype is made.

Accessibility has a downside. A stress plot looks authoritative whether it is right or wrong. The software will solve almost any model it is given and present the answer with several decimal places. If the loads are wrong, the supports unrealistic, the material properties inappropriate or the mesh too coarse, the result can be confidently and dangerously misleading. Many simulation errors are not software faults but modelling decisions made by people who did not realise they were making them.

This article explains, in general terms, what finite element analysis and motion studies do, the assumptions behind a typical analysis, where errors usually come from, how to recognise stress singularities, how to verify results before relying on them and how simulation fits alongside hand calculations, testing and engineering responsibility. It is general information. Simulation does not replace engineering judgement, applicable standards or, where required, review and certification by qualified engineers.

## What simulation tools do

Common design simulation tools include:

- **Finite element analysis (FEA)**, which divides a part or assembly into many small elements and solves for displacements, strains and stresses under loads.
- **Modal or frequency analysis**, which finds natural frequencies and mode shapes, important where machines vibrate.
- **Buckling analysis**, which estimates loads at which slender structures become unstable.
- **Thermal analysis**, which predicts temperatures and heat flow.
- **Motion studies**, which simulate mechanisms moving through their range, checking clearances, interference, velocities, accelerations and the forces or torques needed to drive them.
- **Computational fluid dynamics (CFD)**, which simulates fluid flow and heat transfer.
- **Process simulations**, such as mould flow for injection moulding or casting solidification.

This article concentrates on structural FEA and motion studies, the tools designers use most often.

## Plan the analysis before building the model

Good analyses start with questions, not software. Before building a model, write down:

- **the question** the analysis must answer, such as "will this bracket yield under the maximum load?" or "how much will this frame deflect?";
- **the decision** that depends on it;
- **the load cases**, including normal operation, worst credible loads, handling and faults;
- **the acceptance criteria**, such as allowable stress, deflection limit or minimum natural frequency;
- **the simplifications** that are acceptable; and
- **how the result will be checked**.

This plan keeps the model focused, makes reviews easier and prevents a common trap: producing impressive results that do not answer the question that matters.

## The assumptions behind a typical static analysis

Most quick FEA studies in CAD are **linear static** analyses. They assume:

- **Linear elastic material**: stress is proportional to strain, and the material returns to shape when unloaded. Results above the yield strength are not physically meaningful in a linear analysis.
- **Small deformations**: the shape of the part does not change enough under load to alter how it carries the load.
- **Static loads**: loads are applied slowly and do not vary with time, so inertia and impact are ignored.
- **Fixed contact conditions**: unless contact is modelled, parts are either bonded or ignored.

Many real problems violate one or more of these: bolted joints that open, rubber parts, plastic deformation, impact, snap-fits and thin structures that buckle. They need **nonlinear** or dynamic analyses, which require more skill and care.

## Where errors come from

### Geometry

Analysis geometry is usually simplified, or **defeatured**, to remove details that do not affect results but complicate meshing, such as small cosmetic fillets, logos and tiny holes. Defeaturing is legitimate, but removing the wrong feature, such as a fillet at a high-stress corner, changes results significantly.

### Materials

Results depend on the material properties entered. Library values may not match the actual grade, supplier, heat treatment, temperature or manufacturing process. Plastics vary with temperature, moisture and time; castings and printed parts may have lower and more variable properties than wrought material.

### Mesh

FEA approximates the geometry and the stress field with elements. A coarse mesh can underestimate peak stresses. The standard check is a **mesh convergence** study: refine the mesh in areas of interest and confirm that the results of interest stop changing significantly. If they keep changing, the result is not yet reliable.

### Boundary conditions and loads

Boundary conditions, how the model is supported and loaded, are the most common source of serious errors. Examples include:

- **Over-constraining**: fixing a face rigidly when in reality it can flex or slide, making the model stiffer and changing stress distribution.
- **Under-constraining**: leaving a model free to move, so the solver fails or produces meaningless results.
- **Point loads and point supports**: applying force at a single node, creating artificial stress spikes.
- **Wrong load paths**: applying a bolt load as a pressure on a face instead of through the bolt and its clamped area.
- **Ignoring load cases**: analysing the normal load but not handling, transport, misuse or fault conditions.

Getting the boundary conditions right requires understanding how the real part is held and loaded, which is engineering judgement, not software operation.

## Stress singularities

At a perfectly sharp re-entrant corner, or under a point load or point support, theoretical stress is infinite. In FEA, such locations show stresses that keep rising as the mesh is refined, never converging. These are **stress singularities**. They are artefacts of the idealised model, not predictions of real stress.

Recognising them matters, because a designer may either panic about a huge stress that does not exist in that form or, worse, ignore a genuine stress concentration. The remedies are to model the real geometry, such as the actual fillet radius, which allows stress to converge, to distribute loads and supports realistically and to evaluate stresses a short distance away from artificial singular points where appropriate, using sound engineering methods.

Genuine stress concentrations at real fillets, holes and notches matter greatly, particularly for fatigue. The difference between a singularity and a real concentration is whether the stress converges as the mesh is refined around the real geometry.

## Verifying results

Before trusting a result, check it:

1. **Check reactions.** The support reactions should balance the applied loads.
2. **Check deformation.** View the deformed shape, exaggerated; does it move the way the real part would?
3. **Compare with a hand calculation** of a simplified version, such as beam bending or direct stress. The FEA result away from stress concentrations should be in the same range.
4. **Check convergence** of the results you are relying on.
5. **Check units and material properties.**
6. **Vary uncertain inputs**, such as support conditions, to see how sensitive the result is.
7. **Compare with test data** wherever possible, from prototypes, strain gauges or previous products.

Documenting the model, its assumptions, its checks and its limitations allows someone else to review it and allows the result to be reused when the design changes.

## Assemblies, contact and plastics

Analysing assemblies brings additional choices. Parts can be bonded together, allowed to slide or separate through contact definitions, or connected through simplified connectors such as bolts, pins and springs. Bonding everything together is simple but can hide how loads really transfer through joints. Contact analysis is more realistic but nonlinear, slower and more sensitive to settings.

Plastic parts need particular care. Their stiffness and strength vary with temperature, humidity, loading rate and time, and they creep under sustained load. Fibre-filled plastics have properties that depend on fibre orientation, which follows the flow during moulding. For plastic parts carrying significant or sustained loads, use material data that reflects service conditions and consider testing prototypes.

## Motion studies

Motion studies use the assembly's mates and joints to simulate how a mechanism moves. They are valuable for:

- **checking clearances and interference** through the full range of motion;
- **verifying linkages** reach the required positions;
- **estimating velocities and accelerations**, such as at the end of a stroke; and
- **estimating forces and torques** needed to drive the mechanism, for sizing motors, cylinders and springs.

Their accuracy depends on realistic masses, inertias, friction, spring characteristics and driving profiles. Motion studies usually treat parts as rigid, so forces from the motion study may then be applied in an FEA of individual parts. The [design intent in parametric 3D CAD](/reados/collections/cad-modelling-and-design-intent/design-intent-in-parametric-cad-and-large-assemblies/) article explains how assembly mates and structure affect how well models behave in motion and change.

## Simulation, hand calculations and testing

Simulation is one of three complementary tools:

- **Hand calculations** are fast, transparent and good for checking orders of magnitude and simple cases.
- **Simulation** handles complex geometry and load paths and allows many options to be explored cheaply.
- **Testing** provides physical evidence of real behaviour, including effects the model left out.

Good engineering uses all three: hand calculations to frame and check, simulation to explore and refine, and testing to validate, especially for safety-critical, novel or high-volume designs. The [notes on prototyping early](/reados/collections/product-development-and-launch/notes-on-prototyping/) article covers how prototypes answer questions that models cannot.

## Competence and responsibility

Running simulation software is easy; interpreting it correctly requires knowledge of mechanics, materials and the software's methods. Businesses should match the complexity of analysis to the competence of the person doing it, provide training and review, and seek specialist help for nonlinear, dynamic, fatigue, thermal or safety-critical analyses. Where a design requires certification by a qualified engineer, simulation results support that engineer's judgement but do not replace it.

## A worked example

This is an illustrative example. The figures are hypothetical and simplified.

A designer analyses a steel cantilever bracket, 10 mm thick and 60 mm deep where it joins a mounting plate, carrying a 2 kN load 150 mm from the support. A hand calculation gives a bending moment of 2,000 N × 150 mm = 300,000 N·mm. The section modulus is 10 × 60² ÷ 6 = 6,000 mm³, so the nominal bending stress at the root is 300,000 ÷ 6,000 = 50 MPa.

The first FEA model fixes the mounting plate's back face rigidly and models the bracket meeting the plate with a perfectly sharp corner. Away from the corner, the stress is about 52 MPa, close to the hand calculation. At the corner, the peak stress is 140 MPa with a coarse mesh, 190 MPa when the mesh is refined and 260 MPa when refined again. It never converges: a stress singularity.

```figure
type: bars
title: Peak stress at a perfectly sharp corner
unit: MPa
max: 280
caption: A singularity: the peak keeps rising as the mesh is refined, while the stress away from the corner stays near 52 MPa.
- Coarse mesh | 140
- Refined | 190
- *Refined again | 260 | never converges
```

The real bracket has a 5 mm fillet. When the fillet is modelled and the mesh refined around it, the peak stress converges at about 75 MPa, a genuine stress concentration about 1.5 times the nominal value. The designer also replaces the rigid fixed face with modelled bolts and contact against a supporting structure, which changes the stress distribution slightly. Reactions balance the applied load. Because the bracket will vibrate in service, the designer then checks fatigue using the converged fillet stress, rather than either the misleading singular peak or the nominal value.

```figure
type: stats
title: A cantilever bracket checked three ways
caption: 2 kN at 150 mm on a 10 × 60 mm section; the hand calculation anchors the model.
- 50 MPa | Hand calculation | 300,000 N·mm ÷ 6,000 mm³
- 52 MPa | FEA away from the corner
- *About 75 MPa | Converged peak at the 5 mm fillet | about 1.5 × nominal
```

## How this applies to a small Australian business

- **Use simulation early** to compare options, but verify before relying on results.
- **Get boundary conditions right**; they matter more than the mesh.
- **Model real fillets** where stress matters, and watch for singularities.
- **Check against hand calculations and tests.**
- **Document assumptions and checks**, so results can be reviewed and reused.
- **Match analysis complexity to competence**, and seek specialist help when needed.

## Common mistakes

- **Trusting colourful plots** without checking.
- **Rigid fixtures** where real supports flex.
- **Point loads and sharp corners** producing singularities interpreted as real stress.
- **Ignoring mesh convergence.**
- **Library material properties** that do not match the real material.
- **Linear analysis of nonlinear problems**, such as contact, large deformation or plasticity.
- **Treating simulation as certification.**

## Frequently asked questions

**How fine should the mesh be?** Fine enough that the results you care about stop changing significantly with further refinement. Check this with a convergence study in the regions that matter.

**Can we rely on the CAD system's default settings?** Defaults are a starting point. Mesh controls, contact settings, solver options and result smoothing can all affect results, so check the settings that matter for each analysis.

**Is a stress above yield in a linear analysis a failure?** Not necessarily, and not reliably. A linear analysis is not valid above yield; it signals that the region needs closer examination, possibly with nonlinear analysis or design changes.

## Questions to ask

- What assumptions does this analysis make, and are they valid for this part?
- Are the supports and loads realistic, including all relevant load cases?
- Have the key results converged with mesh refinement?
- Do reactions balance loads, and does the deformed shape make sense?
- How does the result compare with a hand calculation or test?
- Who reviewed the model, and is it documented?

## Bringing it together

Simulation lets designers explore stresses, deflections, frequencies and motion early, when design changes are cheap. Its results are only as good as the geometry, materials, mesh, boundary conditions and loads behind them. Recognising stress singularities, checking convergence, balancing reactions, comparing with hand calculations and validating with tests turns simulation from a source of false confidence into a reliable design tool. Used with appropriate competence and review, it complements, rather than replaces, engineering judgement and testing. The [what engineering failures teach any business](/reados/collections/engineering-design-practice/what-engineering-failures-teach-a-business/) article shows why checking assumptions matters so much.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. Simulation does not replace engineering judgement, applicable standards or certification by qualified engineers.*
