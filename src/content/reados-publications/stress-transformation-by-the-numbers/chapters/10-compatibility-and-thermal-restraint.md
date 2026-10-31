---
book: stress-transformation-by-the-numbers
chapterSlug: compatibility-and-thermal-restraint
order: 10
title: "Compatibility, thermal restraint and locked-in stress"
description: "Why stresses need compatibility as well as equilibrium: restrained thermal expansion and buckling, a fit between different metals as temperature changes, and locked-in stress."
draft: false
---

Every chapter so far has leaned on equilibrium: forces on an element balance, so stresses transform as they do and integrate to the applied loads. Equilibrium alone could not say how the hoop stress is shared across a thick wall in Chapter 5, or how an interference turns into a pressure in Chapter 9. In both, a second condition did the work: the deformed parts must still fit together, without gaps or overlaps. That is compatibility, and in this final chapter it takes centre stage.

Compatibility matters most where something other than a load tries to change a part's shape: a change of temperature, a fit between two parts, a weld that shrinks as it cools, a region that has yielded. The part cannot follow its own preferred shape, because its neighbours will not let it, and the mismatch becomes stress. The chapter works three RH-40 examples with WORKOS tools: guide rods that heat in the sun, a bronze bush in a steel housing, and the locked-in stresses that the earlier chapters created on purpose.

## Two conditions, always

Any stress analysis must satisfy two sets of conditions at every point.

- **Equilibrium:** the stresses balance the loads and each other. In the language of continuum mechanics, the stress field has zero divergence wherever there is no body force.
- **Compatibility:** the strains come from a continuous displacement, so that the material neither tears nor overlaps. Strains cannot be chosen freely at each point; they must fit together.

In a statically determinate problem, such as a simple bar under a known load, equilibrium alone fixes the stress and compatibility follows automatically. In a statically indeterminate problem, such as a bar held between two rigid walls, equilibrium allows any internal force, and compatibility picks the one that is right.

The total strain at a point can be split into parts: an elastic part, which Hooke's law links to stress, and parts that cause no stress on their own, such as thermal expansion αΔT and plastic strain. Compatibility applies to the total. Stress appears when the stress-free parts, on their own, would not be compatible, and the elastic part has to make up the difference. Thermal stress, fit stress and residual stress are all this one mechanism.

```figure
type: formula
title: Total strain as the sum of its parts
formula: ε total = ε elastic + ε thermal + ε plastic
formula: ε elastic = σ ÷ E (with Poisson terms in 2D and 3D),  ε thermal = α ΔT
formula: fully restrained bar: ε total = 0, so σ = −E α ΔT
caption: Compatibility constrains the total strain; only the elastic part produces stress. A free bar that warms has total strain αΔT and no stress. A bar held at both ends has no total strain, so its elastic strain must cancel the thermal strain.
- α | coefficient of thermal expansion, about 12 µm/(m·K) for steel and 18 for bronze
- ΔT | temperature change from the stress-free state
```

## Guide rods in the sun

The RH-40's head slides on two 32 mm bright steel guide rods held between brackets on the mast, 2,400 mm apart. The brackets are welded to the mast and stiff. The rig works in the Goldfields, where a rod in full sun on a summer afternoon can be 45 K warmer than when it was fitted on a cool morning, while the mast beneath it, shaded and more massive, warms much less. This is an illustration.

The [thermal stress tool](/tools/thermal-stress/) gives the stress and force in a bar whose expansion is fully or partly restrained: for the rod at 45 K with full restraint, a free strain of 540 µm/m, a compressive stress of 110.7 MPa, a force on the brackets of 89.03 kN and a factor of 3.16 against the rod's 350 MPa yield strength. Its check flags compressive stress for a separate buckling check.

The [restrained bar heating tool](/tools/restrained-bar-thermal-check/) does that check as well: the same thermal stress, the buckling load of the rod for its effective length by Euler or Johnson, and the temperature rises at which yield and buckling would begin.

```figure
type: steps
title: An RH-40 guide rod in the restrained bar heating tool
caption: This is an illustration. d = 32 mm, 2,400 mm between brackets, effective length factor 0.5 (both ends fixed), E = 205 GPa, α = 12 µm/(m·K), 45 K rise, 100% restraint, Sy = 350 MPa, required factor 1.5.
- Thermal stress and force | 110.7 MPa; 89.03 kN on the brackets
- Yield safety factor | 3.16
- Slenderness and mode | 150.0, above the Euler limit of 107.5: Euler
- Buckling load | 72.32 kN
- * Buckling safety factor | 0.81: BAR NOT ADEQUATE
- Temperature rise at buckling and at yield | 36.6 K and 142.3 K
```

The rod would not yield; it would bow. At 36.6 K above its fitting temperature, its thermal force reaches its Euler buckling load and it bends sideways, taking the sliding head out of line. That is the check's real message: for slender members, restrained heating is a stability problem long before it is a strength problem.

### The mistake: assuming the brackets would give

The original layout assumed that the mast brackets were "flexible enough" to let the rods grow. Nobody had put a number on it. A finite element model of the bracket and a simple test, a hydraulic jack and a dial indicator against a bracket on the prototype mast, showed a stiffness of several hundred kilonewtons per millimetre: for practical purposes, rigid. The rod's own axial stiffness is EA ÷ L = 205,000 × 804.25 ÷ 2,400 = 68,696 N/mm, so with brackets that stiff the restraint was close to 100%, and a prototype rod did bow visibly on a hot day in the yard.

The fix was to mount one end of each rod in a bracket built as a flexible plate, with a stiffness calculated at about 45,800 N/mm in the rod's direction. In series with the rod, that gives a restraint of about 40%: the rod and bracket share the thermal growth, the rod taking 60% of it as free expansion and the bracket 40% as a small deflection.

```figure
type: compare
title: The guide rod at 45 K, rigid and flexible brackets
cols: Restraint | Thermal stress, MPa | Force on brackets, kN | Buckling factor | Temperature rise at buckling, K
rowhead: Bracket
- Welded, rigid | 100% | 110.7 | 89.03 | 0.81 | 36.6
- * Flexible plate | 40% | 44.28 | 35.61 | 2.03 | 91.4
- Pinned ends instead of fixed, rigid | 100% | 110.7 | 89.03 | 0.20 | 9.1
caption: This is an illustration. Restraint in the tool scales the thermal stress from full to none. The last row shows the cost of the opposite change: pinned ends double the effective length, quarter the buckling load and leave the rod unable to take even 10 K.
```

## Gradients: restraint from within

A part does not need external brackets to be restrained thermally. If one region is hotter than another, the cooler material resists the hotter material's expansion, and stress appears with no outside force at all. When the RH-40 starts flushing with 70 °C water on a cold morning, the spindle's bore heats before its outside. With a 20 K difference across the wall, the inner layers try to grow more than the outer ones and cannot, because the wall must stay one continuous tube.

For a thin-walled tube with a linear temperature difference ΔT across its wall, the resulting hoop and axial stresses at the surfaces are about E α ΔT ÷ [2(1 − ν)], compressive at the hot face and tensile at the cool one. For the spindle, that is 205,000 × 12 × 10⁻⁶ × 20 ÷ 1.42 = 34.6 MPa. It is a transient stress, which fades as the wall's temperature evens out, and here it is modest beside the service stresses. In thick sections and with faster heating it is not: quenching in heat treatment, thermal shock in castings and the cracking of brittle materials poured with hot liquid are all gradient stresses. The thermal tools in this chapter assume uniform temperature, as their limitations say, so gradients need their own estimate.

## A bronze bush in a steel housing

The RH-40's water swivel supports the spindle in a bronze bush pressed into a steel housing. The bush has a 110 mm outside diameter and a 90.1 mm bore; the housing is 150 mm across. The interference at the 20 °C assembly temperature is 0.06 mm, the friction coefficient 0.12, and the bush must not turn in its housing under a friction torque from the spindle of up to 150 N·m, with a slip factor of 2. The swivel runs at up to 70 °C with hot water. This is an illustration.

Bronze expands about 18 µm/(m·K) and steel about 11.5, so as the swivel warms, the bush tries to grow more than its housing and the fit tightens. On a frosty morning before start-up, it loosens. The [interference fit at operating temperature tool](/tools/fit-at-temperature-check/) handles exactly this: the interference at the operating temperature from the difference in expansion, then the pressure, holding torque and hub stress at assembly and at operating temperature, checked against the torque at the weaker condition and the hub stress at the tighter one.

```figure
type: compare
title: The RH-40 swivel bush fit in the interference fit at temperature tool
cols: Interference, µm | Pressure, MPa | Holding torque, N·m | Housing von Mises, MPa
rowhead: Condition
- Assembly, 20 °C | 60.0 | 8.98 | 1,230 | 35.3
- * Running, 70 °C | 95.8 | 14.34 | 1,962 | 56.3
- Cold start, 0 °C | 45.7 | 6.84 | 936 | 26.9
caption: This is an illustration. Housing: steel, E = 205 GPa, ν = 0.29, α = 11.5 µm/(m·K), yield 300 MPa. Bush: bronze, E = 110 GPa, ν = 0.34, α = 18 µm/(m·K). The tool reports FIT HOLDS AT TEMPERATURE for both the 70 °C and 0 °C runs, with a housing factor of 5.33 at the tightest condition.
```

The fit grips at every temperature, with at least three times the 300 N·m it needs. The housing stress is small. The compatibility condition has done its work quietly: the same fit carries more pressure when hot and less when cold, because the free expansions of the two parts no longer match.

### The mistake: boring the bush before pressing

The prototype swivel ran hot and scored its spindle within an hour. The bush had been finish-bored to 90.10 mm before it was pressed in, to give 0.10 mm of running clearance on the 90.00 mm spindle journal. After pressing, a bore gauge read 90.055 mm.

Compatibility again: the bush, a thin bronze tube under external pressure from the fit, shrinks at its bore. The hollow cylinder formula from Chapter 9 gives its bore hoop stress as −2p d² ÷ (d² − di²), and the bore's change of diameter is that stress divided by the bush's modulus, times the bore diameter. At 8.98 MPa the bore closes by 0.045 mm, which matches the measurement. At 70 °C the tighter fit closes the bore by 0.071 mm in total, before allowing for the spindle's own thermal growth. The 0.10 mm clearance had become 0.055 mm cold and less when hot.

The cure is standard practice for pressed bushes: either bore or ream the bush to size after pressing it in, or bore it oversize beforehand by the calculated closure and confirm with a measurement after assembly. The RH-40 drawing now calls for finish-boring after pressing, with the running clearance specified at operating temperature.

```figure
type: checklist
title: Fits between different materials
caption: The RH-40 swivel review. This is an illustration.
- x Interference checked at the coldest and hottest temperatures, not only at assembly
- x Grip at the loosest condition, with a slip factor
- x Outer member's stress at the tightest condition
- x Bore closure of the inner member calculated, and bores finished after pressing
- x Running clearance specified at operating temperature
- ? Creep of the bronze under sustained pressure at temperature, if the fit pressure were higher
```

## Locked-in stress

A stress that remains in a part with no external load is a residual stress, and every residual stress is a compatibility story. Some part of the material has a stress-free shape that no longer fits its neighbours, through yielding, a temperature history, a phase change or a fit, and the elastic strains needed to make everything fit together leave stresses behind. Because there is no load, the residual stresses must balance among themselves: tension somewhere is always paired with compression somewhere else.

The RH-40 contains several, some deliberate:

- **The gear's shrink fit** of Chapter 9 is a designed residual stress: tension in the hub, compression in the spindle.
- **The rolled threads and shot-peened fillets** that the fatigue design specifies leave compressive stress in the surface layer, balanced by a little tension beneath it, and that compression delays fatigue cracks.
- **The welds** on the mast and head frame leave tension in and near the weld bead, up to about the yield strength, balanced by compression in the plate around it.
- **The induction-hardened spindle journals** carry surface compression from the volume change of the hardened layer.

Residual stresses add to service stresses exactly like any other stress, by superposition while everything stays elastic, so they belong in the stress state at a point. They are hard to measure, because zeroing a strain gauge on a finished part hides them, and Chapter 8's hole-drilling method or X-ray diffraction is needed to read them. They can also be relaxed: by stress-relief heat treatment, by yielding under an overload, or by vibration and cycling over time. [Yield and Plastic Flow by the Numbers](/reados/publications/yield-and-plastic-flow-by-the-numbers/restraint-residual-stress-and-annealing/) covers how they form during forming and how annealing removes them, and [Thermal Expansion by the Numbers](/reados/publications/thermal-expansion-by-the-numbers/thermal-stress-when-growth-is-stopped/) covers thermal restraint in pipes and structures.

## What the book's methods add up to

The ten chapters have built one way of thinking. Write the stress at a point as components on an element, in whatever axes are convenient. Transform them to find the principal stresses and the largest shear, which are the same in every frame. Check thin and thick walls, three-dimensional states and the third principal stress. Measure strains with enough gauges and a prediction for each. And when parts must fit together, or temperatures change, add compatibility to equilibrium. The yield, fatigue and code checks that decide whether a part is acceptable all start from the stress state these methods produce.

The RH-40's design file now carries those stress states for every critical point, with their assumptions. Whether the head is fit for service is the decision of its competent designers, its tests and the standards that apply, and the risks of a pressurised, rotating machine must be managed under the model WHS laws.

## Exercise: how much restraint can the rod take?

For the RH-40 guide rod at a 45 K rise, with fixed ends (K = 0.5), the buckling load is 72.32 kN and the fully restrained thermal force 89.03 kN. What is the largest degree of restraint that keeps a buckling safety factor of 1.5? What bracket stiffness, in series with the rod, gives that restraint?

**Worked answer.** The thermal force scales with the restraint R, so the buckling factor is 72.32 ÷ (89.03 × R). Setting it to 1.5 gives R = 72.32 ÷ (1.5 × 89.03) = 0.5415, so no more than 54% restraint.

With the rod's stiffness of 68,696 N/mm and a bracket stiffness kb in series, the share of the free growth the bracket prevents is R = kb ÷ (kb + 68,696). Setting R = 0.5415 gives kb = 0.5415 × 68,696 ÷ 0.4585 = 81,100 N/mm. Any bracket softer than about 81 kN/mm in the rod's direction, such as the flexible plate at 45.8 kN/mm, meets the requirement at 45 K. This is an illustration.
