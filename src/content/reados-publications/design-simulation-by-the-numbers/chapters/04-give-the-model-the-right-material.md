---
book: design-simulation-by-the-numbers
chapterSlug: give-the-model-the-right-material
order: 4
title: "Give the model the right material"
description: "Know which material properties each analysis uses, where to get them, what linear elastic models cannot represent and how a wrong modulus hides in a stress plot."
draft: false
---

A finite element solver knows nothing about steel. It knows a handful of numbers that the analyst types into a material record, and it applies them exactly as given. If a number is wrong, the solver does not complain; it produces a confident, smoothly coloured result built on the error. Choosing and checking material data is therefore one of the analyst's main jobs, not a formality.

This chapter sets out which properties each kind of analysis actually uses, where trustworthy values come from and what a linear elastic material model can and cannot represent. It ends with a failure that is easy to make and easy to miss: a modulus entered in the wrong unit, which leaves the stress plot looking perfectly reasonable.

## Know which properties each analysis reads

Different analyses read different properties. A static stress analysis under applied forces needs only the elastic constants. A gravity load or a frequency analysis also needs density. A thermal stress analysis needs the coefficient of expansion, and a heat transfer analysis needs conductivity. Strength properties, such as yield and tensile strength, are not used by a linear solver at all; they are used afterwards, by the analyst, to judge the result.

```figure
type: compare
title: Which material properties each analysis uses
cols: Static, applied forces | Gravity or frequency | Thermal stress | Judging the result
caption: Yield and tensile strength never enter a linear solution. They matter only when the analyst compares the result with a limit.
- Young's modulus, E | Used | Used | Used | Not used
- Poisson's ratio, ν | Used | Used | Used | Not used
- *Density, ρ | Not used | Used | Not used | Not used
- Expansion coefficient, α | Not used | Not used | Used | Not used
- Yield and tensile strength | Not used | Not used | Not used | Used
- Fatigue data | Not used | Not used | Not used | Used for cyclic loads
```

This table explains several common surprises. A static model with the wrong density gives correct stresses under applied forces, because density is not read. The same model gives a wrong frequency, because it is. A model with a yield strength of 250 MPa will happily report 400 MPa, because the solver never compares stress with yield. The comparison is the analyst's job, and Chapter 7 discusses how to make it properly.

## Use values that match the question

For the bracket, the analysis uses the following values for carbon steel. They are typical teaching values; the real grade's data should come from its standard and the supplier's documentation.

- **Young's modulus:** 200,000 MPa. Carbon steels vary little, typically within a few per cent of this value.
- **Poisson's ratio:** 0.3.
- **Density:** 7.85 × 10⁻⁹ t/mm³, equivalent to 7,850 kg/m³.
- **Expansion coefficient:** about 12 × 10⁻⁶ per kelvin.
- **Yield strength for judging results:** 250 MPa, the assumed minimum from the analysis plan.

Two distinctions matter. The first is between typical and minimum values. Elastic modulus and density are physical constants for a given alloy family and vary little, so a typical value is appropriate. Strength varies from batch to batch and with thickness, so the value used to judge a design should be a specified minimum, not a typical or average figure from a library. Many CAD material libraries list typical strengths. Check the source before using one as a limit.

The second distinction is between the base metal and the joints. Weld metal, heat-affected zones and galvanised surfaces have their own properties. A linear model of the bracket treats the whole fabrication as one homogeneous steel, which is adequate for stiffness and global stress but not for judging the strength of the welds themselves. That judgement uses the weld design methods named in Chapter 3.

## Understand what linear elastic means

Most CAD simulation runs a linear static analysis by default. Linear means three things at once. The material is linear: stress is always proportional to strain, with no yield. The geometry is linear: deflections are small enough that the structure's shape does not change the way it carries load. The contacts are linear: surfaces that touch stay in contact, and surfaces that do not touch never will.

```figure
type: svg
title: What a linear elastic model assumes about steel
alt: A stress-strain graph. A real steel curve rises steeply and straight, then bends over and flattens at the yield stress. A dashed straight line representing the linear elastic model continues upwards past the yield point without bending. The region above yield is labelled as fictitious for the linear model.
caption: Below yield the two agree. Above yield the linear model keeps climbing, so a reported stress above yield describes a state the steel cannot reach.
viewbox: 0 0 600 300
body:
<path class="ln" d="M60 260H560M60 260V30"/>
<text class="tx txs" x="566" y="264">Strain</text>
<text class="tx txs" x="22" y="24">Stress</text>
<path class="la draw" pathLength="1" d="M60 260L200 110C230 100 260 98 300 97L540 94"/>
<path class="li dsh" d="M200 110L280 24"/>
<path class="lf dsh" d="M60 110H560"/>
<text class="txa" x="320" y="88">Real steel yields and flattens</text>
<text class="txb" x="292" y="40">Linear model keeps rising</text>
<text class="tx txs" x="430" y="126">Yield stress, about 250 MPa</text>
<circle class="fa pulse" cx="200" cy="110" r="5"/>
<text class="tx txs" x="86" y="200">Both agree here</text>
```

Above yield, a linear result is not an overestimate of a real stress; it is a stress that cannot exist. A linear analysis reporting 400 MPa in a steel with a 250 MPa yield is saying "if steel did not yield, the stress here would be 400 MPa". What actually happens is that the steel yields locally, redistributes load to its neighbours and ends up with a different stress and strain pattern. Whether that is acceptable depends on where it happens, how often and how much. Answering that needs either a nonlinear material model or a design method that knows how to interpret elastic peaks.

For the bracket, the hand calculations predict about 24 MPa at the root under combination C1. The linear model is comfortably within its valid range everywhere except at singular points, which Chapter 6 deals with.

## Recognise materials that need more than two constants

Steel and aluminium are close to isotropic: their stiffness is the same in every direction. Several common engineering materials are not, and a model that treats them as isotropic can be badly wrong.

- **Moulded plastics** are viscoelastic. Their stiffness depends on temperature, load duration and loading rate, and they creep under sustained load. A modulus from a short tensile test can overstate the stiffness of a part carrying a load for months.
- **Fibre-reinforced plastics** are stiffer along the fibres than across them, and fibre orientation in a moulding follows the flow of the melt.
- **Additively manufactured parts** often have different properties along and across their build layers, with weaker bonding between layers.
- **Timber** differs greatly along and across the grain.

None of these appear in the bracket, but the warning is general. When the material is not a metal, ask whether a single modulus and Poisson's ratio describe it, and for what duration and temperature.

## Run a material sensitivity study

A quick way to understand how much the material matters is to change it and compare. Suppose the team wonders whether an aluminium arm of the same 50 × 50 × 5 section would save weight. Common wrought aluminium alloys have a modulus of about 69,000 MPa and a density of about 2,700 kg/m³.

```figure
type: compare
title: Revision B in steel and in aluminium, fixed base
cols: Steel arm | Aluminium arm | Criterion
caption: Same section and loads. Stress is unchanged because the arm is statically determinate; stiffness falls by about two-thirds and the frequency margin almost disappears.
- Root bending stress, LC2 | 12.8 MPa | 12.8 MPa | Judged against each alloy's own strength
- Tip deflection, LC2 | 0.053 mm | 0.154 mm | ≤ 0.5 mm
- Arm mass | 1.77 kg | 0.61 kg | No limit set
- *First natural frequency | 96 Hz | 56.7 Hz | ≥ 48 Hz
```

The arithmetic is short. Stiffness scales with modulus, so the aluminium arm's stiffness is **11,808 × 69,000 / 200,000 ≈ 4,074 N/mm** and its deflection under LC2 is **628 / 4,074 ≈ 0.154 mm**. Its mass is **900 × 250 × 2.7 × 10⁻⁶ ≈ 0.61 kg**, a saving of about 1.2 kg. The motor dominates the moving mass, so the effective mass barely changes, at **32 + 0.24 × 0.61 ≈ 32.1 kg**, and the frequency becomes **(1 / 2π) × √(4,074,000 / 32.1) ≈ 56.7 Hz**.

The aluminium arm passes on a fixed base, but with a margin of only about 18% above the criterion. Base and frame flexibility, which the next chapters show lowering the frequency by around 10% to 15%, would bring it close to failing. A 1.2 kg saving on a bracket carrying a 32 kg motor is not worth that risk, and the team stays with steel.

The stress result is the instructive one. For a statically determinate structure, such as a cantilever with an end load, the internal forces follow from equilibrium alone, so stress does not depend on modulus at all. Changing the material changes deflection and frequency but leaves the stress plot untouched. That fact sets up the failure case below.

## Decide when a nonlinear material is worth it

Sometimes the question itself lies beyond yield. Suppose the site asks what happens if a pallet strikes the motor during a forklift manoeuvre, and the team agrees to examine an accidental sideways load of 4,000 N at the load point. This is an illustration, not a design load from any standard. A linear estimate on Revision B gives a root bending stress of **4,000 × 250 / 12,300 ≈ 81 MPa**, which is still elastic, so the hollow section survives without yielding and a linear model is adequate.

Repeat the same strike on Revision A, the flat bar, bending about its weak axis, and the linear estimate becomes **4,000 × 250 / 1,200 ≈ 833 MPa**. That number is meaningless as a stress. It says the bar yields across its whole root section and forms what structural engineers call a plastic hinge, after which it bends permanently. A nonlinear analysis with an elastic-plastic material model, or a plastic collapse calculation by hand, is needed to say how far the arm would bend and whether the motor would stay attached.

The rule is simple. If the linear result anywhere that matters exceeds yield, either the design is changed until it does not, or the analysis moves to a nonlinear material model with properly sourced stress-strain data. Reporting a linear stress of 833 MPa and a factor of safety below one is not an analysis of what happens; it is a statement that the linear model no longer applies.

## Remember that properties change with temperature

Material data sheets give properties at room temperature unless they say otherwise. The modulus and strength of steel fall slowly as temperature rises, and the change over the range a conveyor normally sees, perhaps 0 to 50 °C, is small enough to ignore for the bracket. Plastics are different: their stiffness can fall substantially between 20 °C and 60 °C, and a design checked at room temperature may sag or creep in a hot enclosure.

Where the operating temperature differs from the data sheet temperature, record which temperature the properties belong to and why that is acceptable. For the bracket, a line in the material table saying "room-temperature values; operating range 0 to 50 °C; effect on steel properties negligible" closes the question for any reviewer.

## Check the material record field by field

Before solving, open the material record and read every field rather than trusting its name. Confirm that the modulus is in the model's stress unit, that the density is in the model's mass and length units, that Poisson's ratio lies between 0.25 and 0.35 for a metal, and that the expansion coefficient is per kelvin rather than per degree Fahrenheit. Confirm that the record assigned to each body is the one intended; assemblies often contain parts that kept a default material from their template.

This takes two minutes and prevents the most embarrassing class of simulation error, in which every later check is performed carefully on a model of the wrong material.

## A failure case: the modulus in the wrong unit

This is an illustration. An analyst creates a custom material for the bracket and enters Young's modulus as 200, intending gigapascals, in a model whose stress unit is the megapascal. The solver reads 200 MPa, which is a thousand times too soft.

The stress plot for LC2 looks normal. The root stress away from the weld is about 12 MPa, close to the hand value, because the arm is statically determinate and its stress does not depend on modulus. A reviewer who looked only at stress would approve it.

The deflection tells a different story. The tip deflection is about a thousand times the hand value: roughly 60 mm instead of roughly 0.06 mm. The deformed-shape plot, if viewed at true scale, shows the arm drooping visibly. The modal analysis returns a first natural frequency of about **96 / √1,000 ≈ 3 Hz**.

The detection is the habit from Chapter 2: compare every result with its hand estimate, not only the result you are most interested in. A stress that agrees and a deflection that disagrees by a factor of a thousand cannot both be right. In a statically indeterminate structure, the stresses would be affected too, but less obviously, because a uniform error in modulus changes all stiffnesses in proportion and leaves the load sharing unchanged.

## Record the material data with its source

The analysis report should list every material property used, its unit, its value and its source. For the bracket, that is a short table with a line for each property, citing the steel standard or supplier data for strength and a reference text for the elastic constants. If a library value was used, say which library and confirm that it was checked.

This record does three jobs. It lets a reviewer confirm the inputs without opening the model. It shows which properties are typical and which are minimum values. And when the grade changes, perhaps because the supplier offers a different section, it shows immediately which results must be rerun. For the bracket, a change of steel grade would leave stiffness and frequency unchanged and alter only the strength margin, so only the judgement in Chapter 7 would need revisiting.

## Exercise: a stainless steel arm

The site asks whether the arm could be stainless steel for wash-down. Take a modulus of 193,000 MPa and a density of 8,000 kg/m³ as typical teaching values. Estimate the change in tip deflection under LC2 and in first natural frequency, relative to carbon steel, on a fixed base.

**Worked answer.** Deflection scales inversely with modulus: **0.053 × 200,000 / 193,000 ≈ 0.055 mm**, about 4% more. The stiffness becomes **11,808 × 193,000 / 200,000 ≈ 11,395 N/mm**. The arm's mass becomes **900 × 250 × 8.0 × 10⁻⁶ = 1.8 kg**, so the effective mass is **32 + 0.24 × 1.8 ≈ 32.4 kg**. The frequency is **(1 / 2π) × √(11,395,000 / 32.4) ≈ 94.3 Hz**, about 2% lower than carbon steel. Both criteria are still met easily. The decision will turn on corrosion, cost, weldability and the strength of the chosen stainless grade, which must be checked separately because stainless steels' yield strengths differ from carbon steel's.
