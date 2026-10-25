---
book: design-simulation-by-the-numbers
chapterSlug: prepare-geometry-for-analysis
order: 3
title: "Prepare geometry that answers the question"
description: "Turn a manufacturing CAD model into analysis geometry by removing irrelevant detail, keeping stress-raising features and choosing beam, shell or solid idealisation."
draft: false
---

The CAD model that drives manufacture is rarely the best geometry for analysis. It carries chamfers, cosmetic threads, engraved part numbers, tiny clearance gaps and fillets on edges that carry no load. Each one adds elements, slows the solution and can create badly shaped elements that distort results nearby. At the same time, it may lack things the analysis needs, such as a split face where a load is applied or a representation of the weld.

Preparing analysis geometry is a design task in its own right. The aim is a model that is as simple as possible while keeping every feature that affects the answers in the analysis plan. This chapter applies that aim to Revision B of the bracket.

## The Revision B geometry

This is an illustration. Revision B has four parts joined by fillet welds:

- an arm of 50 × 50 × 5 mm square hollow section, 240 mm long;
- a base plate 150 mm tall, 120 mm wide and 10 mm thick, with four Ø13 mm holes on a 110 × 80 mm pattern for M12 bolts;
- an end plate 120 × 120 × 10 mm, to which the gearmotor's flange bolts with four M10 bolts;
- 6 mm fillet welds all round the arm at each end.

The arm's length plus the end plate's thickness put the motor flange face 250 mm from the base plate face, matching the load point in the hand calculations. The manufacturing model also has 2 × 45° chamfers on the plate edges, a part number engraved on the base plate, cosmetic thread features in the motor bolt holes and a Ø8 mm drain hole in the underside of the arm near its root, added so that galvanising fluid can escape.

## Decide what each feature does to the answer

For each feature, ask whether it changes any result in the analysis plan. A feature can matter because it carries load, because it raises stress where stress is being assessed, because it changes stiffness, or because it changes mass. If it does none of these, remove it from the analysis geometry.

```figure
type: decision
title: Keep or remove a feature in the analysis geometry
question: Does the feature change any result in the analysis plan?
- Carries load or changes stiffness | Keep | Base plate, end plate, bolt holes, arm walls
- *Raises stress where stress is assessed | Keep, and mesh it finely | The drain hole near the arm root
- Changes mass in a frequency or gravity case | Keep or replace with equivalent mass | The motor, represented as a point mass
- None of these | Remove | Chamfers, engraving, cosmetic threads
```

The chamfers, the engraving and the cosmetic threads affect nothing in the plan, so they go. The motor's detailed CAD body is replaced by a point mass of 32 kg at its centre of mass, connected to the end plate's bolt circle; Chapter 5 discusses how. The bolt holes stay, because the base plate's flexibility depends on where it is held.

The drain hole deserves a second look. It sits on the underside of the arm, 20 mm from the root, where the bending stress from the vertical load is close to its maximum and compressive. A hole in a stressed wall raises the local stress; for a small hole in a wide, uniformly stressed plate, the peak at the edge of the hole is about three times the remote stress. A hand estimate puts the bending stress 20 mm from the root at about **628 × 230 / 12,300 ≈ 11.7 MPa**, so the local peak could approach **35 MPa**. That is still far below the criterion, but the hole sits near a weld and in a region that sees reversing loads, so it is kept and meshed finely. Removing it would have hidden the highest stress in the arm.

## Choose the idealisation: beam, shell or solid

The same steel can be represented by different element families, each with its own assumptions.

```figure
type: compare
title: Three ways to idealise the bracket's arm
cols: Beam elements | Shell elements | Solid elements
caption: Element counts are rough teaching estimates for a 2 mm element size. The right choice depends on the question, not on which looks most realistic.
- What is modelled | The arm's centreline and section properties | The mid-surface of each wall | The full volume
- Approximate elements for the arm | About 25 | About 11,000 | About 240,000
- Good for | Global deflection, frequency, quick studies | Thin walls, plate bending, welded fabrications | Thick parts, local detail, fillets and holes
- Cannot show | Local stress at joints or holes | Through-thickness stress at weld roots | Nothing in principle, but at high cost
- *Bracket use | Hand-check companion | Arm and plates in the main model | A local submodel of the root, if needed
```

A beam model of the arm reproduces the hand calculations almost exactly, which makes it a useful check but adds little. A solid model captures everything in principle, but a 5 mm wall needs at least two or three solid elements through its thickness to represent bending, and the element count grows quickly. A shell model places one surface at the middle of each wall and gives it a thickness property, so bending through the wall is built into the element formulation.

The rough counts come from simple arithmetic. The arm's mid-surface area is about **4 × 45 × 240 ≈ 43,000 mm²**; at a 2 mm element size, each quadrilateral covers about 4 mm², giving roughly 11,000 elements. The arm's volume is about **900 × 240 = 216,000 mm³**; a tetrahedron with 2 mm edges has a volume of a little under 1 mm³, giving roughly a quarter of a million elements. The numbers are approximate, but the ratio of about twenty to one is typical.

For the bracket, the main model uses shells for the arm and the two plates, with the weld represented as described below. If the stress at the root needs more detail later, a solid submodel of that region can be driven by displacements from the shell model.

## Extract mid-surfaces carefully

Shell models need mid-surfaces, and the CAD system's automatic extraction is not always tidy. At the joint between the arm and the base plate, the arm's mid-surface ends 5 mm from the plate's mid-surface, because the plate is 10 mm thick and the arm sits on its face. The gap must be closed, either by extending the arm's surfaces to the plate's mid-surface or by connecting the two with a rigid or bonded link.

Extending the surfaces adds a little length and stiffness to the arm, about half the plate thickness. For the bracket, that adds 5 mm to a 250 mm arm, which would change the beam-theory deflection by about **(255 / 250)³ − 1 ≈ 6%**. Whatever method is used, record it, and remember the effect when comparing with hand values. Small idealisation choices at joints often explain differences of several per cent.

## Represent the welds deliberately

A fillet weld is a load path, a stiffness and a stress concentration all at once. A shell model cannot represent its true shape, so a decision is needed. Common choices are to merge the parts at the joint line, which treats the weld as a perfectly stiff seam, to add a strip of shell elements with an equivalent thickness across the weld throat, or to model the joint in solids in a local submodel.

For the bracket's global results, merging the arm to the plate at the joint line is adequate, and it is the choice made here. It slightly overstates the joint's stiffness and says nothing reliable about the stress at the weld toe or root. The analysis plan therefore does not use the model's peak stress at the weld as an acceptance value. Weld strength is assessed with the nominal stress from the model and the methods in the relevant welding design standard; the [fatigue chapter of Designing Welded Joints by the Numbers](/reados/publications/designing-welded-joints-by-the-numbers/fatigue-of-welded-joints/) explains why the nominal or structural stress, not the singular peak, is what weld design methods expect.

## Use symmetry only when the loads are symmetric

The bracket looks symmetric about its vertical mid-plane, and a half model would halve the element count. Symmetry boundary conditions, though, impose symmetric behaviour. They are valid only when the geometry, the restraints and every load in the case are symmetric about the same plane.

LC1 and LC2, which act vertically through the arm's axis, are symmetric about the vertical mid-plane. LC3, the sideways belt pull, is not, and neither is LC4, the torque. A half model with a symmetry plane cannot represent either.

## A failure case: the half model and the sideways load

This is an illustration. To save time, an analyst builds a half model of Revision B, cut on the vertical mid-plane, and runs all four load cases. For LC3 they apply half the belt pull, 225 N, to the half model, perpendicular to the symmetry plane. The solver reports a sideways deflection at the load point of essentially zero and a stress that looks like pure compression in the arm walls.

The symmetry condition prevents any displacement perpendicular to the cut plane, which is exactly the direction of the belt pull. The model has been told the arm cannot move sideways, so it does not. The load has nowhere to go except into the restraint.

Two checks catch the error. The reaction check, described in Chapter 5, shows that the sideways reaction is taken by the symmetry plane instead of the bolts. The comparison with the hand estimate shows a deflection of nearly zero where about 0.04 mm was expected, and a disagreement of that size, in that direction, is not explained by any real effect. The fix is to run LC3 and LC4 on the full model, and to record in the plan which load cases may use the half model.

## Split faces where loads and restraints belong

Loads and restraints are applied to faces, edges or points of the geometry. If the face does not exist, the analyst may apply the load to a larger face than intended. For the bracket, the motor flange bears on a ring around the end plate's bolt circle, not on the whole plate. Splitting the end plate face to create that ring lets the load go where it really goes.

The same applies to the base plate. The conveyor frame contacts the back of the base plate over the area of the frame's flange, which may be narrower than the plate. A split line at the frame's edge lets Chapter 5 restrain the right region. These splits are cheap to make in CAD and expensive to fake in the analysis.

## Find and remove geometry that breaks the mesh

Some features do no harm to the answer but great harm to the mesh. A sliver face a few hundredths of a millimetre wide, left by an imported model or a fillet that almost meets an edge, forces the mesher to create tiny, distorted elements. A short edge where two surfaces nearly coincide does the same. Those elements stiffen or soften the model locally and can produce stress spikes that have nothing to do with the design.

Most CAD systems can list faces smaller than a chosen area and edges shorter than a chosen length. For the bracket, a sensible threshold is a tenth of the intended element size: with 2 mm elements, any edge shorter than 0.2 mm deserves attention. Merge, delete or repair those features in the analysis configuration, and record what was done. A model that meshes cleanly at the first attempt is usually one whose geometry was checked first.

## Define the regions of interest before meshing

The analysis plan names the results that matter, and each one has a place in the geometry. For Revision B, the regions of interest are the arm root and its weld, the drain hole, the base plate around the bolts and the load point. Everywhere else, the mesh only has to carry load and stiffness accurately enough for the global results.

Marking those regions in the geometry, by splitting faces or creating named selections, lets the mesh be refined where it matters and left coarse elsewhere. It also makes the convergence study in Chapter 6 practical, because refinement can be targeted at a named region rather than applied to the whole model. A uniform fine mesh everywhere is rarely necessary and is often the reason an analysis overruns its time budget.

Write the regions of interest into the analysis plan beside the criteria they serve. The arm root and drain hole serve the stress criterion, the load point serves the deflection criterion and the whole assembly serves the frequency criterion. When a result is reported, the reviewer can check that it came from the region the plan named.

## Check the analysis geometry before meshing

Before meshing, check the prepared geometry as carefully as the manufacturing model.

```figure
type: checklist
title: Analysis geometry checks for Revision B
caption: Each item has a number or a yes or no answer, so a reviewer can confirm it independently.
- Mass report agrees with hand value | Arm, plates and welds about 4.3 kg of steel, motor 32 kg as a point mass
- Units confirmed | mm, N, t and MPa throughout
- No gaps or overlaps at joints | Mid-surfaces connected, joint method recorded
- Stress-raising features kept | Drain hole retained and flagged for fine mesh
- Irrelevant features removed | Chamfers, engraving and cosmetic threads suppressed
- Load and restraint faces split | Flange ring and frame contact area exist as faces
- x Symmetry used for asymmetric loads | Half model limited to LC1 and LC2
- ? Weld representation | Merged seam; weld stress assessed by nominal method
```

The steel mass in the first line follows from the parts: the arm is about 1.7 kg, the base plate **150 × 120 × 10 × 7.85 × 10⁻⁶ ≈ 1.41 kg** before holes, and the end plate **120 × 120 × 10 × 7.85 × 10⁻⁶ ≈ 1.13 kg** before holes. With the welds and less the holes, about 4.3 kg is a reasonable expectation, and a mass report between about 4 and 4.6 kg would be credible. A report of 46 kg or 0.46 kg would point to a unit or density error.

## Keep the analysis geometry linked to the design

Analysis geometry is often made by copying the CAD model and editing it. The copy then drifts away from the design as the design changes. A better practice is to create the simplified geometry as a configuration or derived part of the manufacturing model, so that a change to the arm length or plate thickness flows through to the analysis automatically, and the suppressed features are recorded as suppressed rather than deleted.

Name the configuration so that it is obviously for analysis, and record its revision in the analysis report. When a reviewer asks which design the stress plot describes, the answer should be a part number and revision, not "the one on my desktop last Tuesday".

## Exercise: should the motor bolt holes stay?

The end plate has four Ø11 mm holes for the motor's M10 bolts, on a 100 mm pitch circle. The analysis plan's criteria concern the arm root, the load point deflection and the first natural frequency. Should the holes stay in the analysis geometry?

**Worked answer.** The holes do not lie near the arm root and do not carry the arm's bending stress, so they do not affect the stress criterion. They slightly reduce the end plate's mass and stiffness, but the end plate is short and stiff compared with the arm, so their effect on tip deflection and frequency is negligible. They can be removed for the global model.

They do become important if the plan is extended to assess the end plate or the motor's bolts. In that case, the holes and the flange contact ring should be modelled, and the bolt loads taken from the model or from a hand calculation of the bolt group. The decision depends on the question, which is why it belongs in the plan.
