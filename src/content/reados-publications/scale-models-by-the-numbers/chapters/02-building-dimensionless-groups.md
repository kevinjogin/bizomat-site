---
book: scale-models-by-the-numbers
chapterSlug: building-dimensionless-groups
order: 2
title: "Building dimensionless groups with the pi theorem"
description: "List the variables that govern a problem, reduce them to dimensionless groups by the Buckingham pi method, and read the Froude, Reynolds and Weber numbers as ratios of forces."
draft: false
---

A model test is an experiment on a problem with fewer variables than it seems to have. Whether a vortex forms over the PS-3 bellmouth might depend on ten things: the flow velocity, the bellmouth diameter, the submergence, the floor clearance, the channel width, the density and viscosity of the water, its surface tension and gravity, as well as the swirl that results. Testing each one separately would take years. Dimensional analysis shows that those ten variables only act through seven combinations, each a pure number, and that a model which reproduces those numbers reproduces the flow.

This chapter sets out the Buckingham pi theorem and a dependable way of applying it. It builds the groups that govern the PS-3 intake, reads each one as a ratio of forces, previews the groups that govern a pump, and ends with a variable that was left out of the list and would have sent the model study in the wrong direction.

## The pi theorem

The theorem is named after Edgar Buckingham, who stated it in a 1914 paper on physically similar systems, though others had used the idea before him. It says that if a physical relationship involves n variables, and those variables are built from k independent dimensions, then the relationship can be rewritten as a relationship between n − k independent dimensionless groups. The groups are conventionally written Π₁, Π₂ and so on, which gives the theorem its name.

Two consequences follow. First, the number of things to investigate falls by k, three for most problems in mechanics. Second, and more important for model testing, the relationship between the groups is the same at any size. If a model and its prototype have the same values of every group but one, they must have the same value of the last one too. That is the whole basis of scale modelling.

The theorem does not say what the relationship is. It only says which combinations it can depend on. Finding the relationship still takes experiment or theory, and a wrong list of variables gives wrong groups however carefully the algebra is done.

## A method that works

The algebra is mechanical once the list of variables is right. The repeating-variable method below is the one most textbooks teach, and it rarely goes wrong if each step is checked.

```figure
type: steps
title: The repeating-variable method
caption: The choice of repeating variables changes the form of the groups, not their number or their information. Choose variables that are easy to vary or measure and that appear in the familiar named groups.
- List every variable | Include the response you want to predict and every input that could affect it, including fluid properties and g
- Write their dimensions | Use M, L and T; count the independent dimensions, k
- Choose k repeating variables | Together they must contain all k dimensions and must not form a dimensionless group among themselves
- Form one group per remaining variable | Multiply it by powers of the repeating variables and solve for the powers that cancel M, L and T
- Check each group | Confirm it is dimensionless and has a physical meaning
- Tidy the set | Replace groups by products, powers or reciprocals that match named groups, without changing their number
```

## The groups for the PS-3 intake

The question for the PS-3 model is whether swirl and vortices form at the bellmouths. The laboratory takes the swirl angle θ in the suction pipe as the response, since it can be measured, and lists the variables that could affect it. This is an illustration.

```figure
type: compare
title: Variables for swirl at a PS-3 bellmouth
rowhead: Variable
cols: Symbol | Dimensions | Prototype value
caption: Ten variables in three dimensions give seven independent dimensionless groups. Water properties are NIST values at 20 °C.
- Swirl angle (response) | θ | none | to be found
- Bellmouth velocity | V | L T⁻¹ | 1.592 m/s
- Bellmouth diameter | D | L | 0.600 m
- Submergence above the lip | S | L | 1.20 m
- Floor clearance | C | L | 0.30 m
- Approach channel width | B | L | 4.0 m
- Density | ρ | M L⁻³ | 998.21 kg/m³
- Dynamic viscosity | μ | M L⁻¹ T⁻¹ | 1.0016 mPa·s
- Surface tension | σ | M T⁻² | 72.74 mN/m
- Gravitational acceleration | g | L T⁻² | 9.80665 m/s²
```

There are n = 10 variables and k = 3 dimensions, so there are 7 groups. The repeating variables are ρ, V and D: between them they contain M, L and T, and no product of their powers is dimensionless, because only ρ contains mass and only V contains time.

The swirl angle is already dimensionless and is its own group, Π₁ = θ. The three other lengths need only dividing by D: Π₂ = S ÷ D, Π₃ = C ÷ D and Π₄ = B ÷ D. These are the geometric ratios, and a geometrically similar model matches them automatically.

The fluid properties need the algebra. For viscosity, write μ × ρᵃ × Vᵇ × Dᶜ and require every dimension to cancel:

- mass: 1 + a = 0, so a = −1;
- time: −1 − b = 0, so b = −1;
- length: −1 − 3a + b + c = 0, so −1 + 3 − 1 + c = 0 and c = −1.

The group is μ ÷ (ρ V D), the reciprocal of the Reynolds number. Inverting it gives the familiar Π₅ = Re = ρ V D ÷ μ = V D ÷ ν.

```figure
type: formula
title: The three force-ratio groups for the intake
formula: Froude number: Fr = V ÷ √(g D)
formula: Reynolds number: Re = ρ V D ÷ μ = V D ÷ ν
formula: Weber number: We = ρ V² D ÷ σ
caption: Each comes from the repeating-variable algebra as a reciprocal or square root of the group it produces, and each compares the inertia of the flow with one other force. Values are for the PS-3 prototype bellmouth with water at 20 °C.
- Fr | inertia against gravity
- Re | inertia against viscous friction
- We | inertia against surface tension
step: Fr = 1.592 ÷ √(9.80665 × 0.6) = 0.656
step: Re = 1.592 × 0.6 ÷ 1.0034 × 10⁻⁶ = 951,700
step: We = 998.21 × 1.592² × 0.6 ÷ 0.07274 = 20,860
```

The same algebra for g gives g × ρ⁰ × V⁻² × D¹, the group g D ÷ V². Its reciprocal square root is the Froude number, Π₆ = V ÷ √(g D). For surface tension it gives σ ÷ (ρ V² D), whose reciprocal is the Weber number, Π₇ = ρ V² D ÷ σ. The theorem then says that the swirl angle is some function of the other six groups:

θ = f(S ÷ D, C ÷ D, B ÷ D, Fr, Re, We).

That statement is the brief for the model study. A geometrically similar model matches the first three groups. Chapter 4 shows that running it at the right flow matches the Froude number. Chapters 5 and 6 deal with the two it cannot match.

## Groups as ratios of forces

The named groups are easier to use when they are read as ratios of forces, because the ratio says which effect dominates. The inertia force on a lump of fluid of size D scales as its mass, ρ D³, times its acceleration, V² ÷ D, which is ρ V² D². Gravity on the same lump scales as ρ g D³. Viscous friction scales as a viscosity times a velocity gradient times an area, μ (V ÷ D) D² = μ V D. Surface tension scales as σ D.

Dividing inertia by each gives ρ V² D² ÷ (ρ g D³) = V² ÷ (g D), which is Fr²; ρ V² D² ÷ (μ V D) = Re; and ρ V² D² ÷ (σ D) = We. For PS-3, inertia is about 950,000 times the viscous force and 21,000 times the surface tension force at the scale of the bellmouth, while gravity and inertia are of the same order. That is the first sign that gravity will govern the free surface and the vortices that form on it, while viscosity and surface tension act only at small scales, in thin layers and in vortex cores. It is also why the model study can be designed around the Froude number.

## Choosing the form of the groups

The set of groups is not unique. Any product or power of groups is also a group, and a different choice of repeating variables produces a different but equivalent set. A Froude number based on the submergence instead of the diameter, V ÷ √(g S), is the diameter-based one times √(D ÷ S): 0.656 × √(0.6 ÷ 1.2) = **0.464** for PS-3. Both are correct. What matters is that the set is complete and independent, and that the report says which definitions it used.

In practice, choose groups that have a physical meaning, that match the literature for the problem, and that put the response variable in only one group. Intake studies often use a submergence-based Froude number because submergence is what a designer can change. Pump designers use the speed and impeller diameter as repeating variables instead of the velocity, because those are what they control.

## Traps in the variable list

Most errors in dimensional analysis happen before the algebra starts, in the list of variables. Four are common enough to check for every time.

1. **Dependent variables listed separately.** Listing density, dynamic viscosity and kinematic viscosity together adds a variable without adding information, because ν = μ ÷ ρ. The algebra then produces a "group" such as ρ ν ÷ μ that is always exactly 1. A group that cannot vary is a sign that two listed variables are tied together by a definition.
2. **A variable that does not act.** Including the water's bulk modulus for the PS-3 intake adds a Mach number, the ratio of flow velocity to the speed of sound, which is about 0.001 in both model and prototype. The group is harmless but wastes effort. Compressibility matters in water hammer, as [Water Hammer by the Numbers](/reados/publications/water-hammer-by-the-numbers/) shows, but not in a steady intake.
3. **A variable that acts but is missing.** This is the dangerous one, because nothing in the algebra reveals it. The error at the end of this chapter is an example.
4. **Repeating variables that are not independent.** Choosing D and S as two of the three repeating variables fails, because both are lengths and S ÷ D is already dimensionless. The method then cannot cancel the mass dimension in μ. The fix is to choose repeating variables that between them contain every dimension and that cannot form a group on their own.

A useful habit is to write each listed variable beside the force or mechanism it represents. Velocity and density carry inertia; g carries gravity; μ carries viscous friction; σ carries surface tension; the lengths carry geometry. A variable with no mechanism beside it is a candidate for removal, and a mechanism with no variable beside it is a candidate for something missing.

The theorem's count can also be checked independently. If the algebra gives more groups than n − k, two of them are not independent; if it gives fewer, a variable has been lost. For PS-3, ten variables and three dimensions give exactly seven groups, and each of the seven contains one variable that no other group contains, which is the simplest test that they are independent.

## A preview: the groups for a pump

The same method applied to a centrifugal pump gives the groups that Chapter 9 uses. The variables are the flow Q, the energy per unit mass g H, the shaft power P, the rotational speed n, the impeller diameter D, the density ρ and the viscosity μ. With ρ, n and D as repeating variables, the seven variables give four groups:

- the flow coefficient, Q ÷ (n D³);
- the head coefficient, g H ÷ (n² D²);
- the power coefficient, P ÷ (ρ n³ D⁵);
- a Reynolds number, ρ n D² ÷ μ.

If the Reynolds number has little effect, which is roughly true for large pumps on water, the other three are related by a single curve for every pump of the same geometry. Holding the flow coefficient constant while changing speed gives the affinity laws: flow proportional to speed, head to its square and power to its cube. Chapter 9 works them for PS-3's pumps.

## The error: a variable left off the list

This is an illustration. Before the laboratory was engaged, a graduate engineer prepared a first scoping note. Their reasoning was that the pumps, not gravity, drive the flow into the bellmouths, so g was left off the variable list. With nine variables and three dimensions the theorem gave six groups, and the only one involving a fluid property and the velocity together was the Reynolds number. The note concluded that the model must match the prototype Reynolds number.

At 1:6 scale with the same water, matching Re = V D ÷ ν means multiplying the velocity by 6, to 9.55 m/s at the model bellmouth. The supervising engineer checked what that implied. The flow per model pump would be 9.55 × π × 0.1² ÷ 4 = 0.075 m³/s, or 75 L/s, far beyond the laboratory's supply. The velocity heads would be 36 times the Froude-scaled values, and the model Froude number at the bellmouth would be 9.55 ÷ √(9.80665 × 0.1) = 9.64 against the prototype's 0.656.

```figure
type: compare
title: What leaving out g did to the scoping note
rowhead: Quantity at the model bellmouth
cols: Reynolds matched (g omitted) | Froude matched (g included) | Prototype
caption: The model at 1:6 scale with the same water. Leaving gravity out made the model match a group that matters less and violently mismatch the one that governs the free surface.
- Velocity | 9.55 m/s | 0.650 m/s | 1.592 m/s
- Flow per pump | 75 L/s | 5.10 L/s | 450 L/s
- Froude number | 9.64 | 0.656 | 0.656
- Reynolds number | 951,700 | 64,750 | 951,700
```

The flaw was in the list, not the algebra. Gravity drives every free surface, and surface vortices are free-surface features: water level, drawdown at the bellmouth and the funnel of a vortex all depend on g. With g restored, the Froude number joined the set and the study could be designed around it. The engineer's note was rewritten, and the laboratory's checklist gained a line: before any algebra, ask for each force in the problem (inertia, gravity, pressure, viscosity, surface tension, elasticity) whether it acts, and include the property that sets it.

## How this applies to a small Australian business

The pi theorem is not only for laboratories. A business testing a fan in a smaller duct, a nozzle at a lower pressure or a part at a different speed is relying on similarity whether it knows it or not. Listing the variables and forming the groups takes half an hour and shows whether the test conditions actually represent the product in service, which is cheaper to learn at a desk than after a test rig has been built. It also gives a test report a structure a client's engineer can check: the groups, their values in test and in service, and which were matched.

## Exercise: drag on a trash-rack bar

The force F on one bar of the PS-3 trash rack depends on the approach velocity V, the bar width d, the water density ρ and its viscosity μ. Find the dimensionless groups. If the Reynolds number has negligible effect, how does the force on a bar scale between a 1:6 model and the prototype when the velocities follow Froude scaling, so that model velocities are 1 ÷ √6 of the prototype's?

**Worked answer.** There are five variables (F, V, d, ρ, μ) and three dimensions, so two groups. With ρ, V and d repeating, F × ρᵃ Vᵇ dᶜ gives a = −1, b = −2 and c = −2: the force coefficient C_F = F ÷ (ρ V² d²). The viscosity gives the Reynolds number V d ÷ ν, as before. So C_F = f(Re).

If Re has negligible effect, C_F is the same in model and prototype, so F scales as ρ V² d². With the same water, the velocity ratio √6 and the length ratio 6, the prototype force is 6 × 6² = **216 times** the model force, which is 6³. Chapter 4 shows that every force in a Froude model scales as the cube of the length ratio, and Chapter 5 shows when the assumption about Re fails.
