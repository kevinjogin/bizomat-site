---
book: design-simulation-by-the-numbers
chapterSlug: bound-the-answer-by-hand
order: 2
title: "Bound the answer by hand before you mesh"
description: "Use beam theory, section properties, mass and a one-mass frequency estimate to predict each result, reject a weak design early and catch unit errors."
draft: false
---

A hand calculation is the cheapest analysis available and the most underused. It takes minutes, it shows which variables matter and it gives a number that any later model must agree with, or explain. An engineer who runs a finite element model without first estimating the answer has no way to tell a good result from a plausible-looking wrong one.

This chapter estimates every quantity in the bracket's acceptance criteria for both proposals. The estimates are enough to reject the flat bar outright and to choose a section for the detailed model. They also set the values that Chapters 5 to 8 use to check the model.

## Choose one consistent unit system

Before calculating anything, fix the units. Most structural CAD simulation is done in millimetres and newtons, which give stress in megapascals directly, because one newton per square millimetre is one megapascal. That system has a trap: if length is in millimetres, force in newtons and time in seconds, then mass must be in tonnes and density in tonnes per cubic millimetre for Newton's second law to hold. Steel at about 7,850 kg/m³ becomes **7.85 × 10⁻⁹ t/mm³**.

Static stress and deflection under applied forces do not involve mass, so a wrong density does no harm there. Gravity loads, natural frequencies and motion results all involve mass, and a wrong density ruins them silently. The failure case later in this chapter shows how to catch it.

```figure
type: compare
title: A consistent mm–N–s unit system
cols: Unit | Steel example
caption: Mass must be in tonnes when length is in millimetres and force in newtons. Most frequency errors start here.
- Length | mm | Arm length 250
- Force | N | Weight 314
- Stress and modulus | MPa = N/mm² | E = 200,000
- *Mass | t | Motor 0.032
- *Density | t/mm³ | 7.85 × 10⁻⁹
- Acceleration | mm/s² | Gravity 9,810
```

## Treat the arm as a cantilever

The bracket's arm is fixed at the base plate and loaded at its free end, 250 mm away. The base plate and frame are not perfectly rigid, so a fixed-end cantilever will slightly underestimate deflection and overestimate frequency. That direction of error is worth remembering; it reappears in Chapter 10.

For a cantilever of length L with an end load F, the largest bending moment is at the root:

```figure
type: formula
title: Cantilever formulas used in this chapter
formula: M = F × L        σ = M / Z        δ = F × L³ / (3 × E × I)
formula: k = 3 × E × I / L³        f = (1 / 2π) × √(k / m)
caption: Standard results for a uniform cantilever with an end load. The frequency formula treats the motor as a single mass on a massless spring.
- M | Root bending moment, N·mm
- Z, I | Section modulus (mm³) and second moment of area (mm⁴) about the bending axis
- δ, k | End deflection (mm) and end stiffness (N/mm)
- f, m | Natural frequency (Hz) and the mass carried (kg, with k in N/m)
- E | Young's modulus, taken as 200,000 MPa for carbon steel
```

These are the standard beam results found in any mechanics of materials text. They assume a slender beam, small deflections, linear elastic material and a load applied at the centroid. The bracket's arm satisfies the first three well. The fourth matters only for torque, which is treated separately below.

## Revision A: the 12 × 50 flat bar

A rectangle of width b and depth h has a second moment of area of b h³ / 12 about the axis parallel to b. For the flat bar with its 50 mm dimension vertical:

- Strong axis, resisting vertical loads: **I = 12 × 50³ / 12 = 125,000 mm⁴**, so **Z = I / 25 = 5,000 mm³**.
- Weak axis, resisting sideways loads: **I = 50 × 12³ / 12 = 7,200 mm⁴**, so **Z = I / 6 = 1,200 mm³**.

Under LC2, the vertical design load of 628 N, the root moment is **628 × 250 = 157,000 N·mm** and the root stress is **157,000 / 5,000 = 31.4 MPa**. Under LC3, the 450 N belt pull, the moment is **450 × 250 = 112,500 N·mm** and the stress on the weak axis is **112,500 / 1,200 ≈ 93.8 MPa**. At one corner of the root the two add, giving about **125 MPa** before torsion is considered. That is under the 150 MPa criterion, but with little to spare.

The deflections are more revealing. Under LC2, **δ = 628 × 250³ / (3 × 200,000 × 125,000) ≈ 0.131 mm**, comfortably under 0.5 mm. Under LC3, **δ = 450 × 250³ / (3 × 200,000 × 7,200) ≈ 1.63 mm**, more than three times the limit. The belt pull bends the bar about the axis where it is weakest.

The frequency settles it. The sideways stiffness is **k = 3 × 200,000 × 7,200 / 250³ ≈ 276.5 N/mm**, or 276,500 N/m. With 32 kg on the end, **f = (1 / 2π) × √(276,500 / 32) ≈ 14.8 Hz**. The motor runs at 24 Hz and must pass through 14.8 Hz every time it starts. Revision A fails two of the three criteria, and no finite element model is needed to show it.

## Revision B: a 50 × 50 × 5 square hollow section

A square hollow section has the same stiffness about both axes, which suits a load that comes from two directions. Treating the corners as sharp, which slightly overstates the properties of a real section with rounded corners:

- **A = 50² − 40² = 900 mm²**
- **I = (50⁴ − 40⁴) / 12 = 307,500 mm⁴**, the same about both axes
- **Z = 307,500 / 25 = 12,300 mm³**

Under LC2 the root stress is **157,000 / 12,300 ≈ 12.8 MPa**; under LC3 it is **112,500 / 12,300 ≈ 9.1 MPa**. The deflections are **0.053 mm** and **0.038 mm**. The stiffness is **3 × 200,000 × 307,500 / 250³ = 11,808 N/mm**, and the frequency with the motor alone is **(1 / 2π) × √(11,808,000 / 32) ≈ 96.7 Hz**.

```figure
type: compare
title: Hand estimates for the two revisions
cols: Revision A, 12 × 50 flat bar | Revision B, 50 × 50 × 5 SHS | Criterion
caption: Fixed-base cantilever estimates. Revision A fails on sideways deflection and frequency; Revision B passes all three with wide margins.
- Root stress, LC2 | 31.4 MPa | 12.8 MPa | No separate limit
- Root stress, LC3 | 93.8 MPa | 9.1 MPa | No separate limit
- Von Mises at the root, C1 | Over 125 MPa | 24.2 MPa | ≤ 150 MPa
- Deflection, LC2 | 0.131 mm | 0.053 mm | ≤ 0.5 mm
- *Deflection, LC3 | 1.63 mm | 0.038 mm | ≤ 0.5 mm
- *First natural frequency | 14.8 Hz | 96.7 Hz | ≥ 48 Hz
- Arm mass | 1.18 kg | 1.77 kg | No limit set
```

The cost of the change is small. The flat bar has a cross-section of 600 mm² and the hollow section 900 mm², so the arm gains about **0.59 kg** of steel. Both are common stock items. The analysis has already paid for itself by moving the design onto a section that passes before anyone builds a mesh.

## Add the torque by hand

The start-up torque of 120 N·m twists the arm about its own axis. For a thin-walled closed section, the shear stress from torque is approximately T / (2 A_m t), where A_m is the area enclosed by the mid-line of the wall and t is the wall thickness. For the hollow section, the mid-line square is 45 mm across, so **A_m = 45² = 2,025 mm²** and:

**τ = 120,000 / (2 × 2,025 × 5) ≈ 5.93 MPa.**

Combine it with the two bending stresses at the worst corner using the von Mises formula for a normal stress σ and a shear stress τ, **σ_vm = √(σ² + 3τ²)**. With σ = 12.8 + 9.1 ≈ 21.9 MPa:

**σ_vm = √(21.9² + 3 × 5.93²) ≈ 24.2 MPa.**

That is about a sixth of the 150 MPa criterion. The bracket is governed by stiffness and frequency, not by strength, which is common for machine brackets carrying modest loads at a distance. The WORKOS [thin-walled tube torsion calculator](/tools/thin-tube-torsion/) and [section properties calculator](/tools/section-properties/) repeat these calculations.

An open flat bar is a different matter. Its torsional stiffness and stress depend on a shape coefficient that must be taken from a reference table, and they are far worse than for a closed tube of similar area. That is a second reason to prefer the hollow section, but it was not needed to reject Revision A.

## Refine the frequency estimate for the arm's own mass

The frequency formula assumed a massless arm. A standard energy-method correction for a uniform cantilever with a tip mass adds about 0.24 of the beam's own mass to the tip mass. For Revision B the arm weighs about **900 × 250 × 7.85 × 10⁻⁶ ≈ 1.77 kg**, so the effective mass is **32 + 0.24 × 1.77 ≈ 32.4 kg**. The frequency becomes about **96.0 Hz**, less than 1% lower.

```figure
type: bars
title: First natural frequency against the 48 Hz criterion
unit: Hz
max: 100
caption: Fixed-base estimates with the motor as a point mass. The arm's own mass changes Revision B by less than 1%.
- Revision A, sideways | 14.8
- Revision A, vertical | 61.6
- *Criterion, 2 × running speed | 48
- Revision B, motor only | 96.7
- Revision B, with arm mass | 96
```

This kind of refinement is useful because it shows which effects are small. The arm's mass is negligible here. The flexibility of the base plate and the frame, which this estimate ignores entirely, is not, and Chapters 5, 8 and 10 return to it.

## Read the formulas for sensitivity

The formulas do more than produce numbers. They show how each result responds to each input, which tells the designer where effort pays. Deflection rises with the cube of the arm length, so an arm 10% longer deflects about **1.1³ ≈ 1.33** times as much. Frequency varies with the square root of stiffness over mass, and stiffness falls with the cube of length, so the same 10% increase lowers the frequency to about **1 / 1.1^1.5 ≈ 0.87** of its value. Stress rises only in proportion to length.

Section depth works the other way. The second moment of area of a solid rectangle rises with the cube of its depth, so a modest increase in depth buys a large increase in stiffness. That is why turning the flat bar on its side would have helped the sideways deflection a great deal and the vertical deflection a great deal less. A closed section gives depth in both directions at once.

Mass enters only the frequency. Doubling the motor mass lowers the frequency by a factor of **√2 ≈ 1.41**, whatever the bracket. When the drive designer changes the motor, the frequency check is the one to repeat first.

## Know when the hand calculation stops being enough

Hand calculations are reliable for uniform members carrying simple loads away from joints. They become unreliable, or impossible, in several places that matter for the bracket. The stress where the hollow section meets the base plate depends on the weld, the plate's bending and the local shape, none of which beam theory describes. The flexibility of a bolted base plate depends on plate thickness, bolt positions and contact, which a simple formula handles poorly. Torque and bending interact in the end plate where the motor bolts on.

Those are exactly the places where a finite element model earns its cost. The hand calculation has not been replaced; it has defined the job. The model's task is to describe the joints and the base, and its global results, such as tip deflection and frequency, must still land close to the hand values once the base flexibility is accounted for.

## A failure case: the density that was off by a thousand

This is an illustration. The detailed model of Revision B is built and its modal analysis returns a first natural frequency of **3.0 Hz**. The designer, not having a hand estimate, begins to redesign the bracket with gussets.

A reviewer compares the number with the hand estimate of about 96 Hz. The ratio is **96 / 3.0 = 32**, and **32² ≈ 1,000**. Frequency falls with the square root of mass, so a frequency 32 times too low means a mass about 1,000 times too large. The reviewer opens the material record and finds the density entered as 7.85 × 10⁻⁶, the value in kilograms per cubic millimetre, in a model whose mass unit is the tonne.

The detection did not need a deep understanding of the solver. It needed a hand estimate and the habit of comparing. A second check catches the same error directly: the model's mass report. The arm should weigh about 1.8 kg. A mass report of 1,770 kg, or 1.77 t shown in a field labelled kilograms, is an immediate alarm. Run the mass report for every model before running any analysis that depends on mass.

## Check the CAD mass properties as well

The CAD model's own mass properties offer a free cross-check. For Revision B, the hand value for the arm is 1.77 kg with sharp corners. If the CAD model uses the real section with rounded corners, its mass will be slightly lower; a catalogue section of this size typically has a mass per metre a few per cent below the sharp-corner value. A CAD mass within a few per cent of the hand value confirms the geometry, the material and the units. A CAD mass that differs by a factor of ten, or of a thousand, says one of them is wrong.

The same report gives the centre of mass and the moments of inertia. For the motor, the centre of mass position is an input to the load cases, so confirm it against the supplier's drawing rather than accepting the default from a simplified CAD body.

## Record the estimates where the model will be checked

Write the hand estimates into the analysis plan as expected values, with a tolerance band that reflects their simplifications. For Revision B, the plan records a tip deflection under LC2 of about 0.053 mm for a fixed base, with the model expected to show somewhat more because the base plate bends. It records a frequency of about 96 Hz for a fixed base, with the model expected to show somewhat less for the same reason. These expectations tell the reviewer which direction of disagreement is plausible and which is a warning.

A model result that differs from a hand estimate is not automatically wrong. The model may include a real effect that the estimate left out. The difference must be explained, though, and the explanation must be physical. "The model is more accurate" is not an explanation; "the base plate bends and adds about 15% to the deflection" is.

## Exercise: the 41 kg motor on Revision B

Using Revision B with a fixed base, estimate the tip deflection under the new LC2 of 804 N and the first natural frequency with a 41 kg motor. Does the bracket still pass?

**Worked answer.** Deflection scales with load: **δ = 804 × 250³ / (3 × 200,000 × 307,500) ≈ 0.068 mm**, well under 0.5 mm. Frequency uses the same stiffness of 11,808 N/mm with the new mass. Including the arm, the effective mass is **41 + 0.24 × 1.77 ≈ 41.4 kg**, so **f = (1 / 2π) × √(11,808,000 / 41.4) ≈ 85.0 Hz**. That still passes the 48 Hz criterion on a fixed base. The margin has narrowed from about 2.0 times to about 1.8 times the criterion, and base flexibility will narrow it further, so the plan should keep the first-article tap test.
