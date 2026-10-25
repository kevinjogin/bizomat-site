---
book: design-simulation-by-the-numbers
chapterSlug: read-stress-results-correctly
order: 7
title: "Read stress results without fooling yourself"
description: "Choose von Mises, principal or Tresca stress for the question, benchmark the solver, read averaged and unaveraged results and judge margins against the criteria."
draft: false
---

A stress plot is a map of numbers coloured by a scale the analyst may not have chosen, showing a quantity the analyst may not have selected, on a deformed shape exaggerated by a factor nobody wrote down. It is easy to read the colours and miss the meaning. Good post-processing starts with three decisions: which stress measure answers the question, which numbers are trustworthy and what each will be compared with.

This chapter reads the converged Revision B model under combination C1, compares its key numbers with hand values and the acceptance criteria, and shows how the solver itself can be checked against a closed-form solution before its results are trusted.

## Choose the stress measure for the question

At any point in a loaded part, the state of stress has six components. Plots usually show a single number derived from them, and different derived numbers answer different questions.

```figure
type: compare
title: Common stress measures and what they answer
cols: What it is | Best used for | Sign shown
caption: Von Mises is the default in most tools because it predicts yield in ductile metals well. It cannot say whether a point is in tension or compression.
- *Von Mises | A combination of all components, equal to the uniaxial stress that would cause the same distortion | Yield of ductile metals such as steel and aluminium | Always positive
- Maximum principal | The largest normal stress on any plane through the point | Brittle materials, cracks, cast iron, glass, many plastics in tension | Signed
- Minimum principal | The most compressive normal stress | Buckling of thin walls, crushing, contact | Signed
- Tresca | Twice the maximum shear stress | A slightly conservative yield check for ductile metals | Always positive
- Component, for example bending stress along the arm | One direction only | Comparing directly with beam theory and strain gauges | Signed
```

The von Mises and Tresca criteria both predict when a ductile metal begins to yield, and both are covered in standard mechanics of materials texts. For steel, von Mises is the usual choice. It has one important blind spot: because it is always positive, a plot of von Mises stress cannot show whether a region is being pulled or pushed. For fatigue and for brittle materials, that distinction matters, and a principal stress or component plot is needed alongside.

## Work one point by hand

At the top corner of the arm's root, under combination C1, the hand calculations in Chapter 2 gave a bending stress of about 21.9 MPa along the arm and a torsional shear stress of about 5.93 MPa. Those two components define the stress state well enough to compute every measure in the table.

For a normal stress σ and a shear stress τ, the principal stresses are **σ/2 ± √((σ/2)² + τ²)**. With σ = 21.9 MPa and τ = 5.93 MPa:

- **σ₁ = 10.95 + √(10.95² + 5.93²) ≈ 10.95 + 12.45 = 23.4 MPa**
- **σ₃ = 10.95 − 12.45 ≈ −1.5 MPa**
- **Tresca = σ₁ − σ₃ ≈ 24.9 MPa**
- **Von Mises = √(σ² + 3τ²) ≈ 24.2 MPa**

Tresca is about 3% higher than von Mises here, which is typical of the difference between the two. The WORKOS [principal stress calculator](/tools/principal-stress/) reproduces these figures. Doing this once by hand makes the plots legible: the analyst knows roughly what each measure should show at a point where beam theory holds, and can spot when the model disagrees.

## Benchmark the solver before trusting it

Before reading the bracket's results, it is worth confirming that the software, element type and settings reproduce a problem with a known answer. A classic benchmark is a small circular hole in a wide plate under uniform tension, where linear elasticity gives a peak stress at the edge of the hole of exactly three times the remote stress, as shown in standard texts.

This is an illustration. The analyst models a steel plate 400 mm wide and 10 mm thick with a central Ø20 mm hole, using the same shell elements and settings as the bracket, and applies a remote tensile stress of 50 MPa. The expected peak, for an infinitely wide plate, is **3 × 50 = 150 MPa**. After a convergence study at the hole, the model gives 151.8 MPa.

The model is about 1.2% above the infinite-plate value. That direction and size are plausible, because a real plate of finite width carries the load around the hole through a slightly narrower section, raising the peak a little. Had the model given 120 MPa or 190 MPa, the element type, the mesh or the settings would be suspect, and no bracket result would deserve trust until the cause was found.

```figure
type: stats
title: Benchmark: hole in a wide plate
caption: The model agrees with the closed-form value within about 1%, and the small excess is explained by the plate's finite width.
- 50 MPa | Remote tensile stress | Applied
- 150 MPa | Closed-form peak at the hole | 3 × remote, infinite plate
- *151.8 MPa | Model peak after convergence | About 1.2% higher
```

Benchmarks like this take less than an hour and can be reused for years. Keep a small library of them, and rerun them when the software version, element formulation or default settings change.

## Read the converged results for combination C1

With the benchmark passed and the mesh converged, the analyst reads the Revision B results for combination C1: the vertical design load, the belt pull and the start-up torque together.

```figure
type: compare
title: Revision B results for combination C1 against the criteria
cols: Model | Hand estimate | Criterion | Margin
caption: Teaching values. Stresses are converged values; the singular corner peak is excluded by the analysis plan. Margins are criterion divided by result.
- Von Mises, top root corner away from weld | 24.5 MPa | 24.2 MPa | ≤ 150 MPa | 6.1
- *Von Mises, drain hole edge | 38.2 MPa | About 35 MPa from bending alone | ≤ 150 MPa | 3.9
- Tip deflection, LC2 | 0.061 mm | 0.053 mm, fixed base | ≤ 0.5 mm | 8.2
- Tip deflection, LC3 | 0.044 mm | 0.038 mm, fixed base | ≤ 0.5 mm | 11.4
- Sharp corner at the root | Singular | Not applicable | Not used | Weld assessed separately
```

The drain hole is the highest meaningful stress in the arm, at 38.2 MPa. That is a little above the bending-only estimate because the torque adds shear around the hole. Against the 150 MPa criterion, the margin is about **150 / 38.2 ≈ 3.9**. Against the assumed 250 MPa yield, the factor of safety is about **250 / 38.2 ≈ 6.5**.

The deflections are slightly above the fixed-base hand estimates, as Chapter 5 predicted, because the base plate pries against the frame. The agreement and the direction of the differences both make physical sense, which is what a reviewer looks for.

## Read the right surface of a shell

Shell elements carry results on two faces, often called top and bottom, and sometimes on the mid-surface as well. In bending, the two faces carry stresses of opposite sign: one face is stretched while the other is compressed. The mid-surface carries only the membrane part, which in pure bending is zero. A plot of the wrong face can show a stress of the wrong sign, and a plot of the mid-surface can show almost nothing where the bending stress is highest.

For the bracket's arm, the top wall's outer face carries the tensile bending stress from the motor's weight, about 12 MPa at the root, while its inner face carries slightly less because it is closer to the neutral axis. Which face the software calls top depends on the direction of each element's normal, which in turn depends on how the mid-surfaces were created. Most tools can display the maximum of the two faces, which is a safe default for a von Mises check. For a signed result compared with a strain gauge, confirm which physical surface the plotted face corresponds to before comparing.

## Look for stress where you did not expect it

The plan names the regions of interest, but the first look at a result should cover the whole model. Surprises are information. A high stress in an unexpected place may reveal a load path the designer did not intend, a modelling artefact or a genuine weakness.

In the Revision B model, the first full look shows small red spots at the four bolt positions on the base plate, reaching about 60 MPa. They sit exactly where each bolt connector attaches to the plate at a single ring of nodes. A connector that joins at a ring of nodes concentrates the bolt force into a line, which is another form of singularity: refine the mesh and the spots get hotter. The real bolt head and washer spread the force over an annulus, and the real stress there is far lower.

The response is to recognise the artefact, confirm that it does not affect the results that matter, and either spread the connector over a washer-sized area or exclude the bolt rings from the stress assessment, as the plan does for the weld corner. The bolt forces themselves, which come from the connectors, remain valid and are the right input for the bolt check. What would be wrong is to quote 60 MPa as a plate stress, or to add a thicker plate to cure a number that exists only in the model.

A second look shows the end plate stressed at about 8 MPa around the motor bolt circle, consistent with the motor's moment entering the plate through the flange. Nothing there approaches a criterion, but the look confirms that the load path runs where the designer intended.

## Know what averaged and unaveraged stresses tell you

Finite element stresses are calculated inside each element, at points called integration points, and then extrapolated to the nodes. Where several elements share a node, each gives its own value. Most plots average them, producing a smooth picture. Unaveraged plots show each element's own value, so the colours jump at element boundaries.

The size of the jump is a free error indicator. In a well-converged region, neighbouring elements agree and the averaged and unaveraged values are close. In a poorly converged region, they disagree, and the averaged plot hides the disagreement by smoothing it away.

## A failure case: the smooth plot on the coarse mesh

This is an illustration. Early in the project, before the convergence study, a designer reads the drain hole stress from the 4 mm mesh using the default averaged plot. It shows 24.8 MPa and a pleasant, smooth gradient. The designer records 24.8 MPa as the peak at the hole.

The same result viewed unaveraged shows element values around the hole ranging from about 17 to 33 MPa, with sharp steps between neighbours. A spread of that size, nearly half the average, says the mesh cannot represent the stress gradient at the hole. The convergence study in Chapter 6 later shows the converged peak to be about 34.7 MPa under LC2, some 40% higher than the recorded value.

The detection is to compare averaged and unaveraged results wherever a stress will be used against a criterion. If they differ by more than a few per cent, refine. A smooth plot is evidence of averaging, not of accuracy.

## Read the scale before the colours

Every contour plot has a legend, and most tools scale it automatically from the minimum to the maximum value in the model. That default is often unhelpful. If the singular corner shows 51 MPa, an automatic scale makes it red and turns almost everything else blue, including the drain hole at 35 MPa, which is the stress that matters.

Set the scale deliberately. A useful practice is to fix the upper limit at the acceptance criterion, so that any red region fails and the colours show the margin directly. For Revision B, a scale from 0 to 150 MPa makes the whole bracket blue and green, which is an honest picture of a stiffness-governed design with large stress margins.

The deformed shape needs the same care. Displacements are usually exaggerated so the shape is visible; a scale factor of 1,000 is common for a stiff bracket. State the factor on every image in the report, and look at the true-scale shape at least once, to confirm the deformation is small enough for a linear analysis.

## Check signs where fatigue or brittle behaviour matters

The bracket's loads reverse. Each start applies the torque in one direction, and some drives reverse in service. The belt pull may change direction if the drive arrangement changes. A von Mises plot shows the size of the stress but not whether it alternates, so it cannot support a fatigue judgement on its own.

For fatigue, read the component or principal stresses at the critical points under each load case, and form the stress range between the extreme states. At the drain hole, the bending stress from the motor's weight is compressive and steady, while the torque at start-up adds a shear that appears and disappears with each start. If the conveyor starts 20 times a day, 300 days a year, for ten years, that is **20 × 300 × 10 = 60,000** start cycles. Fatigue is assessed with the stress range, the number of cycles and the detail's fatigue category, using the methods discussed in the READOS chapter on [designing against fatigue](/reados/collections/machine-elements-and-mechanical-design/designing-against-fatigue/). The welds at the root, in particular, need assessment by a recognised weld fatigue method using the nominal or structural stress from the model.

## State margins in the terms of the criteria

The analysis plan set criteria; the report states results against them. For Revision B under C1, every criterion is met with a margin of at least about 3.9, the smallest being the drain hole stress. A factor of safety against yield is useful context, but the criterion is what the decision rests on, and mixing the two invites confusion. Write "38.2 MPa against a 150 MPa criterion" rather than "factor of safety 6.5", or give both and say which is which.

When a margin depends on an excluded or singular result, say so. The report for Revision B states that the sharp corner at the arm root was singular and was not used, and that the welds are assessed separately using nominal stress. A reviewer can then see that the highest number in the model was deliberately set aside, not overlooked.

## Exercise: a principal stress check

Suppose the arm were made from a cast material with no useful ductility, and the relevant criterion were a maximum principal tensile stress of 40 MPa. Using the hand values at the top root corner under C1, does the corner pass?

**Worked answer.** The maximum principal stress at the corner is about **23.4 MPa**, from σ = 21.9 MPa and τ = 5.93 MPa. That is below 40 MPa, so the corner passes with a margin of about **40 / 23.4 ≈ 1.7**. For a brittle material, though, the drain hole and any sharp corner would need much closer attention, because brittle materials do not redistribute stress by yielding. The hole's peak principal stress, and any real corner radius at the root, would have to be modelled and converged, and the singular-corner idealisation could not be set aside as it was for welded steel.
