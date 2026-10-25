---
book: design-simulation-by-the-numbers
chapterSlug: prove-the-mesh-has-converged
order: 6
title: "Prove the mesh has converged"
description: "Run a mesh refinement study, estimate the converged value with Richardson extrapolation, report a grid convergence index and recognise a singularity that never converges."
draft: false
---

A finite element result is an approximation whose error depends on the mesh. Make the elements smaller and a well-behaved result settles towards a stable value; that settling is called convergence. A result reported from a single mesh carries an unknown error, which may be a fraction of a per cent or a factor of two. The only way to know is to refine the mesh and watch what happens.

This chapter runs a refinement study on the bracket's three most important results, estimates their converged values with a standard method and quantifies the remaining uncertainty. It also shows the result that never converges, however fine the mesh, and explains why that is a property of the model, not a failure of the software.

## Why the mesh matters

Each element approximates the displacement inside it with a simple function, often linear or quadratic. Where stress changes slowly, a few large elements describe it well. Where stress changes rapidly, near a hole, a fillet or a joint, large elements cannot follow the change, and the result is too low, too smooth or misplaced. Smaller elements follow the change better, at the cost of more equations to solve.

Global quantities, such as tip deflection and natural frequency, depend on the stiffness of the whole structure and converge quickly. Local quantities, such as the peak stress at a hole, depend on a small region and converge slowly. Stresses at sharp re-entrant corners do not converge at all. A good study looks at each kind separately.

## Design a refinement study

A practical study uses at least three meshes, each refined by a constant ratio, usually halving the element size in the region of interest. Three meshes are the minimum needed to estimate how fast the result is converging, not just whether it is changing. Refine the region that controls the result; refining everything wastes time without improving the estimate.

For Revision B, the analyst uses shell meshes of 8, 4 and 2 mm overall, with local refinement to 1 and 0.5 mm around the drain hole and the arm root. The load case is LC2, the 628 N vertical design load, with the bolt-and-contact restraint from Chapter 5. Three results are tracked: the tip deflection, the bending stress on the top face 20 mm from the root, well away from the weld, and the peak stress at the edge of the drain hole.

## Estimate the converged value

When three meshes refined by a constant ratio r give results f₃, f₂ and f₁, from coarsest to finest, the observed order of convergence and an extrapolated value can be estimated. This approach, Richardson extrapolation, and the grid convergence index described below are set out in a widely used NASA verification tutorial based on Roache's work.

```figure
type: formula
title: Observed order, Richardson extrapolation and grid convergence index
formula: p = ln[(f₃ − f₂) / (f₂ − f₁)] / ln r
formula: f₀ ≈ f₁ + (f₁ − f₂) / (rᵖ − 1)        GCI = Fs × |(f₁ − f₂) / f₁| / (rᵖ − 1)
caption: f₁ is the finest mesh. Fs is a factor of safety, taken as 1.25 when three meshes are used and 3.0 when only two are available.
- p | Observed order of convergence
- r | Refinement ratio, here 2 because the element size halves
- f₀ | Estimated value at zero element size
- GCI | Grid convergence index, an uncertainty band on the finest result
step: Tip deflection: f₃ = 0.0596, f₂ = 0.0608, f₁ = 0.0611 mm
step: p = ln(0.0012 / 0.0003) / ln 2 = 2.0
step: f₀ ≈ 0.0611 + 0.0003 / (2² − 1) = 0.0612 mm, GCI ≈ 0.2%
```

The tip deflection converges cleanly. Its observed order of 2.0 matches what quadratic-displacement shells should deliver for a smooth result, its extrapolated value is 0.0612 mm and the grid convergence index says the finest mesh is within about 0.2% of the converged answer. That is far more precision than the deflection criterion of 0.5 mm needs, which means even the 8 mm mesh, at 0.0596 mm, would have been adequate for that criterion.

## Apply the method to stress away from the joint

The bending stress on the top face, 20 mm from the root, is a local result, but it sits in a region where beam theory applies. The hand estimate for a fixed base is **628 × 230 / 12,300 ≈ 11.7 MPa**, because the moment arm from the load point is 230 mm.

```figure
type: compare
title: Mesh refinement results for Revision B under LC2
cols: 8 mm | 4 mm | 2 mm | Extrapolated | GCI
caption: Teaching values. Both results converge smoothly, and the stress agrees with the hand estimate of 11.7 MPa within 0.2%.
- Tip deflection, mm | 0.0596 | 0.0608 | 0.0611 | 0.0612 | 0.2%
- *Top-face stress 20 mm from root, MPa | 11.32 | 11.61 | 11.69 | 11.72 | 0.3%
```

The observed order here is about **ln(0.29 / 0.08) / ln 2 ≈ 1.86**, the extrapolated stress is about **11.69 + 0.08 / (2^1.86 − 1) ≈ 11.72 MPa** and the grid convergence index is about 0.3%. The converged model value lies within 0.2% of the hand estimate. That agreement is strong evidence that the loads, restraints, material and units are all correct, because an error in any of them would show up as a disagreement here.

## Converge the stress at the drain hole

The drain hole is the place where the arm's stress is genuinely highest. A small hole in a wide plate under uniform stress has a peak at its edge of about three times the remote stress, so with about 11.7 MPa nearby the peak should be roughly 35 MPa. The hole sits in a 50 mm wall rather than an infinite plate, and the wall is bending rather than in pure tension, so the true factor will differ somewhat from three.

Around a hole, the element size must be small relative to the hole's radius. The analyst refines locally from 4 mm to 0.5 mm, giving four results: 24.8, 31.6, 34.1 and 34.6 MPa. At 4 mm, the Ø8 hole is only a few elements around its circumference and the peak is badly underestimated. Using the three finest meshes, the observed order is about 2.3, the extrapolated peak is about **34.6 + 0.5 / (2^2.32 − 1) ≈ 34.7 MPa** and the grid convergence index is about 0.5%.

Had the analyst stopped at the three coarsest meshes, 4, 2 and 1 mm, the same method would have given an extrapolated peak of about 35.6 MPa with a grid convergence index above 5%. That larger index is the method's warning that the meshes were not yet fine enough for a confident estimate. It is not wrong; it is honest about its uncertainty.

## A failure case: the stress that keeps rising

This is an illustration. The analyst tracks one more result: the peak stress at the sharp corner where the arm's wall meets the base plate, in a model where the weld is represented as a merged seam with no fillet. The results for 8, 4, 2, 1 and 0.5 mm elements are 21.6, 26.9, 33.4, 41.5 and 51.4 MPa.

```figure
type: line
title: Peak stress against mesh refinement at the hole and at the sharp corner
x: Refinement step, element size halved each step from 4 mm
y: Peak stress, MPa
legend: Drain hole edge | Sharp corner at the root
ymin: 20
ymax: 55
caption: Teaching values. The hole converges towards about 35 MPa. The sharp corner rises by about a quarter at every refinement and never settles.
- 1 | 24.8 | 26.9
- 2 | 31.6 | 33.4
- 3 | 34.1 | 41.5
- 4 | 34.6 | 51.4
```

Each halving of the element size raises the corner stress by about 24%. Applying the convergence formula gives a negative observed order, because the differences grow instead of shrinking. There is no converged value to extrapolate to.

This is not a software fault. In linear elasticity, the stress at a perfectly sharp re-entrant corner is theoretically infinite: the exact solution has a singularity there. A finer mesh simply samples closer to the infinite point. The model is reporting faithfully on an idealised geometry that does not exist, since every real corner has some radius and every real weld has a toe of some shape.

The detection is the study itself. A result that rises steadily with every refinement, by a roughly constant ratio, is a singularity. The response is not to pick the mesh that gives a convenient number. It is to stop treating that point's peak stress as a result, and to answer the question with a quantity that is meaningful: the converged nominal stress nearby, a stress at a defined distance used by a recognised weld assessment method, or the stress at a real fillet radius if the geometry has one and it is modelled.

## Converge the natural frequency too

The frequency criterion needs its own study, because modal results depend on how well the mesh represents both stiffness and mass. Frequencies are global quantities and usually converge quickly, but a coarse mesh tends to overestimate them, since a coarse displacement field makes the structure behave a little more stiffly than it really is.

For Revision B with the bolt-and-contact restraint, the first natural frequency on the 8, 4 and 2 mm meshes is 89.10, 88.95 and 88.91 Hz. The observed order is about 1.9, the extrapolated value is about 88.9 Hz and the grid convergence index is well under 0.1%. Chapter 8 uses 88.9 Hz as the model's prediction and compares it with a hand estimate that includes the base flexibility.

One caution applies to modal studies with contact. A modal analysis is linear, so it cannot let the base plate lift from the frame during vibration. Most tools either bond the contact surfaces for the modal run or use the contact state from a preceding static case. Both are approximations, and the choice should be recorded. For a bracket whose bolts are well preloaded, bonding is a reasonable representation of small vibrations about the static position.

## Use adaptive meshing with care

Many CAD simulation tools offer adaptive meshing, which refines the mesh automatically where an error estimate is largest and repeats until a target is met. Two families are common: h-adaptive methods, which make elements smaller, and p-adaptive methods, which raise the order of the displacement function inside each element. Both can save a great deal of manual effort.

They converge on whatever their error measure tracks, which is usually a global energy measure, not the particular stress you care about. A model can satisfy an energy target while the stress at a small hole is still well short of its converged value, because the hole contributes little to the total strain energy. Adaptive methods also refine relentlessly towards singularities, since the error estimate there never falls, and may spend most of their effort on a corner whose peak stress is meaningless.

Treat an adaptive run as a convenient way to produce a sequence of meshes, then check the results that matter with the same convergence table as a manual study. If the tool reports the history of each refinement step, the history is the convergence study.

## Check mesh quality as well as size

Element size is not the only property that matters. Badly shaped elements, such as long thin slivers or heavily skewed quadrilaterals, give poor results even when they are small. Most CAD meshers report quality measures such as aspect ratio and Jacobian ratio, and flag elements beyond set limits. For the bracket, the analyst checks that no element in the regions of interest exceeds the tool's recommended limits, and that the flagged elements lie in unimportant places, such as a corner of the base plate far from any bolt.

Element order matters too. First-order tetrahedra, with straight edges and a linear displacement field, are notoriously stiff in bending, especially when only one or two span a thin wall. A model meshed with them can underestimate deflection and stress significantly. Most CAD tools default to second-order elements for solids for this reason; confirm the setting, and if first-order elements are used, prove by a convergence study that they are adequate.

## Decide how much convergence is enough

Convergence is a means, not an end. The required precision follows from the margin in the analysis plan. For Revision B, the tip deflection is 0.061 mm against a 0.5 mm criterion and the stresses are around 35 MPa against 150 MPa. A 5% uncertainty in either would not change the decision, so a moderate mesh is adequate for the release, and the study's main value is in proving that the model behaves and agrees with hand calculations.

Where margins are thin, the convergence index becomes part of the acceptance argument. If a stress converged to 140 MPa with a grid convergence index of 4% against a 150 MPa criterion, the upper end of the band, about **140 × 1.04 ≈ 146 MPa**, is still acceptable. If the index were 10%, the band would reach **154 MPa** and the result could not support the release without a finer mesh or a design change.

## Report the study, not just the finest mesh

The report should include a short table like the one above for every result used against a criterion: element sizes, results, extrapolated value and convergence index. It should state which results were singular and how they were handled. It should name the mesh used for the final results and confirm that it lies within the converged range.

A reviewer reading that table can judge the evidence in a minute. A reviewer given a single stress plot with "fine mesh" in the caption cannot judge it at all.

## Exercise: two meshes only

A colleague has run only the 2 mm and 1 mm meshes at the drain hole, getting 31.6 and 34.1 MPa. They assume second-order convergence, p = 2. Estimate the converged peak and the grid convergence index using the two-mesh factor of safety of 3.0, and comment.

**Worked answer.** With r = 2 and p = 2, rᵖ − 1 = 3. The extrapolated peak is **34.1 + (34.1 − 31.6) / 3 ≈ 34.9 MPa**. The grid convergence index is **3.0 × (2.5 / 34.1) / 3 ≈ 7.3%**, giving an uncertainty band of roughly 32 to 37 MPa around the finest result. The estimate is close to the three-mesh value of 34.7 MPa, but the larger index reflects the extra uncertainty of assuming the order rather than measuring it. For a result at about a quarter of its criterion, that is adequate; for a result near its limit, run a third mesh.
