---
book: stress-transformation-by-the-numbers
chapterSlug: strain-and-hookes-law
order: 7
title: "Strain and Hooke's law in two and three dimensions"
description: "What normal and shear strains are, how they transform like stresses, how Hooke's law links stress and strain in three directions, and why a single gauge reading times E is usually the wrong stress."
draft: false
---

Stress cannot be measured directly. What can be measured is how a part deforms: a strain gauge's resistance changes as its grid stretches, an extensometer reads a change of length, a dial indicator reads a change of diameter. To get from those readings to the stresses of the earlier chapters, two things are needed: the rules for how strain behaves at a point, which turn out to be the same as for stress, and Hooke's law, which links the two.

This chapter sets out both and works them on the RH-40 spindle under the prototype test condition used in Chapter 8. It uses the WORKOS 3 × 3 matrix tool to invert Hooke's law, and it shows the most common mistake in turning a strain reading into a stress.

## Normal and shear strain

Draw a tiny square on the surface of a part before loading. After loading, its sides have changed length and its corners are no longer right angles. The change of length per unit length along a direction is the normal strain in that direction, ε (epsilon), positive when the material stretches. The change of the right angle between two directions, in radians, is the shear strain between them, γ (gamma). Strains are tiny in elastic steel, so they are usually given in microstrain, µε, millionths.

Engineers use γ, the total change of angle. The strain tensor uses half of it, εxy = γxy ÷ 2. With that half, strain obeys exactly the same transformation rule as stress, so every result of Chapters 2 and 3 carries over: there are principal strains on directions with no shear strain, they are the roots of a quadratic in the strain invariants, and Mohr's circle works with ε on the horizontal axis and γ ÷ 2 on the vertical.

```figure
type: formula
title: Transformation of plane strain
formula: εθ = (εx + εy) ÷ 2 + (εx − εy) ÷ 2 × cos 2θ + (γxy ÷ 2) × sin 2θ
formula: ε1, ε2 = (εx + εy) ÷ 2 ± √[((εx − εy) ÷ 2)² + (γxy ÷ 2)²]
caption: The same equations as for stress, with σ replaced by ε and τ by γ ÷ 2. Using γ in place of γ ÷ 2 is the most common error in strain work. For an isotropic material, the principal strain directions coincide with the principal stress directions.
- εθ | the normal strain along the direction at angle θ
- γxy | the engineering shear strain between x and y
```

The strain equations are pure geometry: they hold for any material, as long as the strains are small. The link to stress is a separate matter, and it depends on the material.

## Hooke's law in three directions

For an isotropic, linear-elastic material, a stress in one direction stretches the material in that direction by σ ÷ E and shrinks it in the two perpendicular directions by ν σ ÷ E, where ν is Poisson's ratio. Stresses in three directions add, and shear stress produces only shear strain, through the shear modulus G.

```figure
type: formula
title: Hooke's law for an isotropic material
formula: εx = [σx − ν (σy + σz)] ÷ E,  and likewise for εy and εz
formula: γxy = τxy ÷ G,  G = E ÷ [2 (1 + ν)]
formula: plane stress (σz = 0): σx = E ÷ (1 − ν²) × (εx + ν εy),  σy = E ÷ (1 − ν²) × (εy + ν εx)
caption: Only two constants are independent for an isotropic material. For the RH-40 spindle steel, E = 205 GPa and ν = 0.29, so G = 79.46 GPa and E ÷ (1 − ν²) = 223,824 MPa.
- E | elastic modulus, MPa
- ν | Poisson's ratio, about 0.27 to 0.30 for steels
- G | shear modulus, MPa
```

The plane stress form is the one used with surface strain gauges. It needs both in-plane normal strains to find either stress: the stress along x depends on the strain along y, through Poisson's ratio. That fact is the source of this chapter's mistake.

Hooke's law in this form assumes the material is isotropic, with the same properties in every direction. Rolled plate, drawn tube and forgings are slightly anisotropic, usually by a few per cent in E, which is small beside the other uncertainties. Fibre composites, timber and single crystals are strongly anisotropic and need more constants and a different matrix; the transformation of strain still holds for them, but the link to stress does not.

## The spindle under its test load

For the prototype test, the RH-40 builder loads a spindle on a bench with water at 7 MPa and a torque of 4,000 N·m, with no pullback or bending, and reads strain gauges on the outer surface away from the gear seat. Chapter 5's Lamé equations give the pressure stresses at the outside: 24.89 MPa around the hoop and 12.44 MPa along the axis. The exact torsion stress at the outside is 4,000,000 × 45 ÷ 3,802,912 = 47.33 MPa. This is an illustration.

Hooke's law gives the strains the gauges should see:

- εx = (12.44 − 0.29 × 24.89) ÷ 205,000 = 25.47 µε along the axis;
- εy = (24.89 − 0.29 × 12.44) ÷ 205,000 = 103.82 µε around the hoop;
- γxy = 47.33 ÷ 79,460 = 595.7 µε of shear;
- εz = −0.29 × (12.44 + 24.89) ÷ 205,000 = −52.81 µε through the wall, which no surface gauge can see.

```figure
type: compare
title: Predicted strains on the RH-40 spindle's outer surface under the test load
cols: Stress, MPa | Strain, µε | What it means
rowhead: Direction
- Axial, x | 12.44 | 25.47 | the pressure's end thrust, mostly cancelled by Poisson contraction from the hoop stress
- Hoop, y | 24.89 | 103.82 | the 90 mm diameter grows by 9.34 µm
- * Shear, xy | 47.33 | 595.7 | the surface twists 0.0132 rad per metre
- Through the wall, z | 0 | −52.81 | the wall thins slightly
caption: This is an illustration. 7 MPa and 4,000 N·m, E = 205 GPa, ν = 0.29. The shear strain dominates; the axial strain is small because the axial stress is half the hoop stress and Poisson's ratio takes back most of it.
```

Mohr's circle for these strains has its centre at (25.47 + 103.82) ÷ 2 = 64.64 µε and a radius of √(39.18² + 297.84²) = 300.4 µε, so the principal strains are 365.0 µε and −235.8 µε. Their direction is ½ × atan2(595.7, −78.35) = 48.75° from the axis, the same as the principal stress direction for this state. Chapter 8 compares these predictions with what the gauges actually read.

## Inverting Hooke's law

The three-dimensional form of Hooke's law for the normal components is a set of three linear equations, which can be written with a 3 × 3 matrix: the strains equal 1 ÷ E times a matrix with 1 on the diagonal and −ν off it, times the stresses. Going the other way, from three measured or computed strains to the stresses, means inverting that matrix.

The [3 × 3 matrix tool](/tools/matrix-3x3/) finds the determinant, the adjoint and the inverse of any 3 × 3 matrix by cofactors, and checks that the matrix times its inverse returns the identity. Enter the dimensionless matrix with ν = 0.29: 1 on the diagonal, −0.29 everywhere else.

```figure
type: steps
title: Hooke's law matrix for ν = 0.29 in the 3 × 3 matrix tool
caption: Inputs: a₁₁ = a₂₂ = a₃₃ = 1, all other entries −0.29. Multiply the inverse by E to get stresses from strains.
- Determinant | 0.69892, equal to (1 + ν)² (1 − 2ν)
- Adjoint | 0.9159 on the diagonal, 0.3741 off it
- * Inverse | 1.31045 on the diagonal, 0.53525 off it
- Check |A A⁻¹ − I| | zero to rounding
```

The inverse turns any three normal strains into stresses: σ1 = E × (1.31045 ε1 + 0.53525 ε2 + 0.53525 ε3), and likewise for the others. Applied to the principal strains that the triaxial stress check tool reported for the gear seat fillet node in Chapter 6, 1,074.2, −198.0 and −381.0 µε, it returns 225.04, 22.87 and −6.21 MPa, against the tool's 225.04, 22.87 and −6.20 MPa. The 0.01 MPa difference comes from the strains being rounded to one decimal. The round trip, stress to strain and back, is a useful test of any hand calculation or spreadsheet.

The diagonal and off-diagonal entries of the inverse, times E, are the stiffness constants of the material. In the elasticity literature they are written λ + 2μ and λ, with Lamé's constant λ and the shear modulus μ = G; for this steel, λ = 0.53525 × 205 = 109.7 GPa.

### When the matrix misbehaves

As Poisson's ratio approaches 0.5, the determinant (1 + ν)²(1 − 2ν) approaches zero and the inverse blows up. Physically, a material with ν = 0.5 cannot change volume, so a hydrostatic stress produces no strain at all and cannot be recovered from strain. Rubber, with ν close to 0.5, behaves this way, and its stresses cannot be recovered reliably from strains with this formula; the matrix tool's warning about ill-conditioned matrices applies. For metals, with ν near 0.3, the inversion is well behaved.

## How good are the elastic constants?

Every stress worked out from a strain is only as good as E and ν. For steels, E is fairly consistent, usually within a few per cent of 200 to 210 GPa, and it changes little with heat treatment. Poisson's ratio is less often measured and is usually taken from a handbook as somewhere between 0.27 and 0.30. The choice matters more than its small size suggests, because ν multiplies one strain into the other's stress.

Holding the RH-40 test strains fixed at 25.47 and 103.82 µε, the plane stress formulas give an axial stress of 11.83 MPa with ν = 0.27, 12.44 MPa with ν = 0.29 and 12.75 MPa with ν = 0.30: a spread of 7.4% from a modest uncertainty in ν. The hoop stress, dominated by its own strain, moves only from 24.48 to 25.11 MPa. Small stresses that come from the difference of large Poisson terms are the most sensitive, which is one more reason to compare measured strains with predicted strains, not measured stresses with predicted stresses. Where a test has to resolve a few MPa, the material's own constants are worth measuring on a coupon fitted with gauges in both directions.

## Volume change and the bulk modulus

Adding the three normal strains gives the change of volume per unit volume. For the spindle's outer surface under the test load it is 25.47 + 103.82 − 52.81 = 76.48 µε. The same number follows from the mean stress, (12.44 + 24.89 + 0) ÷ 3 = 12.44 MPa, divided by the bulk modulus K = E ÷ [3(1 − 2ν)] = 162.7 GPa. Shear changes shape but not volume, so the torque contributes nothing.

The bulk modulus matters when a part or a fluid is squeezed from all sides: hydraulic oil in a long hose, a rubber seal in a closed groove, the steel of a press platen under hydrostatic test. Chapter 6 showed that metals do not yield under hydrostatic stress; this is its elastic counterpart, the stiffness of the material against a change of size without a change of shape.

## Plane stress and plane strain

The surface of the spindle is in plane stress: σz = 0, and the wall is free to thin. The opposite idealisation, plane strain, applies where a long, thick body is prevented from changing length in one direction, so that εz = 0. Then Hooke's law forces a stress σz = ν(σx + σy) to appear. Long dams, the middle of a long thick-walled pipe fixed at its ends, and the material just ahead of a crack tip in thick plate are close to plane strain. The difference matters: under plane strain the third principal stress is tensile when the other two are, the hydrostatic tension rises, and the material yields later and fractures more easily. Fracture toughness tests are made on specimens thick enough to be in plane strain at the crack tip for exactly this reason.

## The mistake: stress equals E times strain

The RH-40's first bench test carried a single gauge along the spindle's axis, intended to confirm the axial stress from the water pressure. With 7 MPa in the spindle and no torque, it read 25.5 µε, as Hooke's law predicts. The test technician multiplied by E: 205,000 × 25.5 × 10⁻⁶ = 5.2 MPa, and reported that the axial stress was 58% below the 12.44 MPa calculated. The report suggested that the spindle's ends were not carrying the pressure thrust as assumed.

The ends were fine. The axial strain is small because the hoop stress, twice as large, contracts the spindle along its axis through Poisson's ratio. The plane stress form of Hooke's law needs both strains: σx = 223,824 × (25.47 + 0.29 × 103.82) × 10⁻⁶ = 12.44 MPa. A hoop gauge on its own would have misled the other way, giving 205,000 × 103.82 × 10⁻⁶ = 21.28 MPa against the true 24.89 MPa, 14.5% low.

```figure
type: compare
title: Stress from strain on the pressurised spindle, right and wrong
cols: Strain read, µε | E × strain, MPa | Plane stress Hooke's law, MPa | Error of E × strain
rowhead: Gauge
- Axial | 25.47 | 5.22 | 12.44 | −58%
- * Hoop | 103.82 | 21.28 | 24.89 | −14.5%
caption: This is an illustration. 7 MPa, no torque. Multiplying by E is correct only for a uniaxial stress, such as on the surface of a bar in pure tension or bending away from any other load.
```

The fix was to add a second gauge at right angles to the first, which is the beginning of a rosette, and to reduce the readings with the plane stress formulas. The lesson is general: one strain gauge gives one stress only when the stress state is known to be uniaxial in the gauge's direction. On a pressurised, twisted or biaxially loaded part, it is not.

## Temperature and the gauge

Strain gauges read all strain, not only the strain caused by stress. If the spindle warms by 5 K during a test, its steel expands freely by about 12 × 10⁻⁶ × 5 = 60 µε in every direction with no stress at all, and a gauge on it sees that too, along with any change in its own resistance with temperature. Gauges are made to compensate for the expansion of a stated material, and bridge circuits with a dummy gauge cancel most of the rest, but a test that runs hot water through a spindle needs those precautions or a temperature record to correct with. Chapter 10 returns to thermal strain, which is the strain that becomes stress when it is prevented.

```figure
type: checklist
title: Turning strain readings into stresses
caption: The RH-40 test plan after the single-gauge mistake. This is an illustration.
- x Enough gauges at each point to define the in-plane state: three for an unknown direction
- x Shear strain used as γ, and γ ÷ 2 in Mohr's circle
- x Plane stress Hooke's law used, never E × strain alone on a biaxial surface
- x E and ν for the actual material, with their source
- x Temperature compensation and a zero reading at test temperature
- ? Prediction for every gauge written down before the test, to compare against
```

## Exercise: strains from a known stress state

At the RH-40 gear seat in pullback, the outer surface on the bending tension side has σx = 115.48 MPa, σy = 31.50 MPa and τxy = 76.91 MPa (Chapter 1). With E = 205 GPa and ν = 0.29, what strains would gauges along the axis, around the hoop and in shear read? What are the principal strains, and do their directions match the principal stresses?

**Worked answer.** εx = (115.48 − 0.29 × 31.50) ÷ 205,000 = 518.76 µε. εy = (31.50 − 0.29 × 115.48) ÷ 205,000 = −9.70 µε. γxy = 76.91 ÷ 79,460 = 967.9 µε.

The centre of the strain circle is (518.76 − 9.70) ÷ 2 = 254.53 µε and its radius √(264.23² + 483.97²) = 551.40 µε, so ε1 = 805.9 µε and ε2 = −296.9 µε. Their direction is ½ × atan2(967.9, 528.46) = 30.68° from the axis, the same as the principal stress direction found in Chapter 3. The hoop gauge reads almost nothing, although the hoop stress is 31.50 MPa: Poisson contraction from the large axial stress cancels it. This is an illustration.
