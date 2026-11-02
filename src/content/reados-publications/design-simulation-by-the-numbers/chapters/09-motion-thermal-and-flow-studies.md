---
book: design-simulation-by-the-numbers
chapterSlug: motion-thermal-and-flow-studies
order: 9
title: "Use motion, thermal and flow studies as load sources"
description: "Derive loads from a motion study, check them by hand, apply temperature with the right restraint and decide when a flow study earns its place in the plan."
draft: false
---

A static stress analysis is only as good as its loads, and many loads come from somewhere else: the motion of a mechanism, a change in temperature or the flow of a fluid. CAD packages offer tools for each, and they are often most valuable not as answers in themselves but as sources of loads for the structural model. Used that way, each needs the same discipline as the stress analysis: a question, a hand estimate, a convergence check and a clear record of what was passed on.

This chapter uses a motion study to confirm the bracket's start-up torque, shows how temperature can produce either no stress or a large stress depending on restraint, and sets out when a flow study belongs in an analysis plan.

## What a motion study calculates

A motion study treats parts as rigid bodies connected by joints, such as hinges, sliders and gear pairs, and drives them with motors, forces or prescribed movements. It solves the equations of motion over time and reports positions, velocities, accelerations and the forces at every joint. Because the bodies are rigid, it says nothing about stress; but the joint forces it reports are exactly the loads a stress analysis needs.

The workflow is a chain. Each link must be checked before its output is used.

```figure
type: steps
title: From a motion study to a stress result
caption: The motion study supplies forces at a chosen instant. The stress model checks the part under those forces. Each step has its own check.
- Define bodies, joints and drives | Check: degrees of freedom match the real mechanism, no redundant constraints
- Set masses and inertias | Check: mass report agrees with the CAD and supplier data
- Run with a time step fine enough | Check: peak forces stable when the step is halved
- *Find the instant of peak joint force | Check: compare with a hand estimate of the same force
- Transfer forces to the stress model | Check: reaction check in the stress model matches the transferred loads
```

## Confirm the start-up torque

The bracket's LC4 assumed a start-up torque of 120 N·m, twice the gearmotor's rated output torque. A motion study of the drive can check that assumption from the conveyor's own inertia and friction.

This is an illustration. The drive designer estimates that the head pulley, belt, tail pulley and typical product load, together with the motor rotor's inertia reflected through the gearbox, amount to an equivalent inertia of 3.2 kg·m² at the gearbox output shaft. The conveyor's friction torque at the output shaft is about 40 N·m when running. The drive accelerates from rest to the output speed of 120 rev/min in 0.5 s.

The hand estimate needs only two lines. The final angular speed is **120 × 2π / 60 ≈ 12.57 rad/s**, so the average angular acceleration over 0.5 s is **12.57 / 0.5 ≈ 25.1 rad/s²**. The torque needed is the friction torque plus inertia times acceleration:

**T = 40 + 3.2 × 25.1 ≈ 120 N·m.**

The motion study, with the same inertia, friction and a prescribed speed ramp, reports a peak reaction moment at the motor's mounting joint of 121 N·m, reached just after the ramp begins, when the drive's slack has been taken up. That agrees with the hand estimate within 1% and confirms the value used for LC4. If the drive designer later shortens the start to 0.3 s, the inertia torque rises to **3.2 × 12.57 / 0.3 ≈ 134 N·m**, and the total to about 174 N·m. The load table, the analysis plan and the stress check would all need updating.

## A failure case: the time step that missed the peak

This is an illustration. An earlier run of the same motion study reported a peak mounting moment of only 85 N·m. The analyst had accepted the default output interval of 0.05 s, which produced just ten samples during the half-second start.

The real torque peak, when the belt's slack is taken up and the inertia torque begins, lasts only a few hundredths of a second. With samples every 0.05 s, the peak fell between two output points and was never reported. Halving the step to 0.025 s raised the reported peak to 108 N·m; halving again to 0.0125 s gave 119 N·m; at 0.005 s the result settled at 121 N·m.

```figure
type: compare
title: Reported peak mounting moment against motion-study time step
cols: Output interval | Samples in the 0.5 s start | Reported peak
caption: Teaching values. The peak settles only when the step is small compared with the duration of the event being captured.
- Default | 0.05 s | 10 | 85 N·m
- Halved | 0.025 s | 20 | 108 N·m
- Halved again | 0.0125 s | 40 | 119 N·m
- *Fine | 0.005 s | 100 | 121 N·m
```

This is a convergence study in time, exactly analogous to the mesh study in Chapter 6. The detection came from the hand estimate of about 120 N·m, which made 85 N·m look suspiciously low, and from halving the step until the peak stopped changing. A motion study with no time-step check is as unreliable as a stress result from a single mesh.

## Watch for redundant constraints

Motion solvers dislike redundant constraints: joints that prevent the same motion twice. A real hinge supported by two bearings is a common example. In CAD, an analyst might model each bearing as a full hinge joint, which over-constrains the shaft. The solver may still run, but it has to remove the redundancy internally, and the way it shares the load between the two joints is then arbitrary. The total is right; the split may be badly wrong.

For the bracket's drive, the gearmotor's output shaft is supported by its own bearings inside the gearbox, and the head pulley by two plummer blocks on the conveyor frame. Modelling both plummer blocks as hinges would create a redundancy. Modelling one as a hinge and the other as a joint that allows axial sliding, as a real non-locating bearing does, removes it. Most tools report redundant constraints; read that report and resolve each one, especially if joint forces are being transferred to a stress model.

## Know when rigid bodies are not enough

A motion study's rigid bodies cannot stretch, so anything elastic in the real mechanism is either left out or represented by a spring element. For the bracket's drive, the belt is the main source of elasticity. A real belt stretches under the start-up torque, so the driven pulley lags behind the motor and then catches up. That springiness can soften the torque peak, or, if the belt has slack that is suddenly taken up, it can sharpen it into a shock.

The rigid model used above, with a prescribed speed ramp, gives the smooth average torque needed to accelerate the inertia. It cannot show a snatch load from a slack belt. If the drive designer is worried about snatch, a spring and damper representing the belt's stiffness can be added between the two pulleys, with values from the belt supplier. The time step must then be small enough to resolve the belt's own oscillation, which may be much faster than the half-second start.

For the bracket, the plan accepts the rigid result because the belt is tensioned before start-up and the drive uses a controlled ramp, so snatch should not occur. It records that assumption, and the tap test and a short strain measurement during a start, described in Chapter 10, will show whether the real torque peak is close to the predicted 121 N·m.

## Check the motion model's mass properties

A motion study's forces come straight from its masses and inertias, so the same mass report check used for the stress model applies here. The motor rotor's inertia is usually given by the supplier at the motor shaft, and must be multiplied by the square of the gear ratio to give its equivalent at the output shaft, because the rotor turns twelve times faster. A rotor inertia of 0.0025 kg·m² at the motor shaft becomes **0.0025 × 12² = 0.36 kg·m²** at the output, a significant part of the 3.2 kg·m² total. Forgetting the ratio, or applying it once instead of squared, is a common error that the hand estimate will catch if the hand estimate is done.

## Transfer the right loads at the right instant

The stress model needs the forces at the instant that governs, not the maximum of each force taken from different instants. At the start of the ramp, the mounting moment peaks while the belt tension may still be rising. Taking the peak of each and combining them would overstate the combined load. Sometimes that is acceptable as a simple, conservative envelope; sometimes it leads to an unnecessarily heavy design.

For the bracket, the analysis plan already combines the start-up torque with the full belt pull and the vertical design load in combination C1, which is conservative. The motion study confirms that the torque value is right. Had the margins been small, the analyst could export the complete set of joint forces at the instant of peak torque and run that as an additional load case.

## Temperature: the restraint decides the stress

Temperature changes the size of a part. Whether that produces stress depends entirely on whether something stops the change. A free part that warms up simply grows; a part held between rigid supports cannot grow, and the restraint generates stress instead.

Suppose a new oven is installed near the conveyor and the bracket's arm warms by 40 K above the conveyor frame. With an expansion coefficient of about 12 × 10⁻⁶ per kelvin for carbon steel:

```figure
type: formula
title: Thermal growth and fully restrained thermal stress
formula: ΔL = α × L × ΔT        σ = E × α × ΔT
caption: Free growth produces no stress. Full restraint produces stress independent of length. Real supports fall somewhere between.
- α | Expansion coefficient, about 12 × 10⁻⁶ per K for carbon steel
- L, ΔT | Length (mm) and temperature change (K)
- E | Young's modulus, 200,000 MPa
step: Free arm: ΔL = 12 × 10⁻⁶ × 250 × 40 = 0.12 mm, stress zero
step: Fully restrained arm: σ = 200,000 × 12 × 10⁻⁶ × 40 = 96 MPa
```

The bracket's arm is a cantilever with a free end, so it simply grows by about 0.12 mm along its length. That moves the motor 0.12 mm away from the frame, which the belt tolerates easily, and produces no thermal stress at all. A thermal stress plot of the bracket, correctly restrained, should be almost entirely blue.

Now suppose the guard designer adds a rigid stay from the end plate back to the frame, to stop the guard rattling. The arm can no longer grow freely. If the stay were truly rigid, the arm would carry a compressive stress of about 96 MPa from temperature alone, more than six times the stress from all the mechanical loads at that section. In reality the stay and its fixings would flex and the stress would be lower, but the point stands: a harmless-looking addition changed a stress-free thermal case into the governing one.

The KEVOS® [thermal stress calculator](/tools/thermal-stress/) and [thermal growth calculator](/tools/thermal-growth/) give both results for other materials and temperature changes.

## Model thermal cases with the same care as mechanical ones

A thermal stress analysis needs a temperature field and the same restraints as the mechanical model. The temperature field may be a uniform change, a measured distribution or the result of a heat transfer analysis. Each is an input with a source, and the analysis plan should record which was used.

Restraints matter even more than usual. A model restrained by fixing the whole back face of the base plate prevents the plate from growing in its own plane, which a real bolted plate with clearance holes may partly allow. That can produce large, fictitious thermal stresses in the base plate. The bolt-and-contact scheme from Chapter 5, with bolts in clearance holes, is a better representation. If the plan needs thermal stress in the base plate itself, the bolt clearance and friction become important inputs.

Combining thermal and mechanical loads is valid in a linear analysis, by adding the results. With contact present, as in the bracket's base, run the combination as a single case and compare.

## Decide when a flow study belongs in the plan

Computational fluid dynamics in a CAD package can predict pressures, velocities and temperatures in flowing air or liquid. It is powerful and expensive in time, and its results are sensitive to mesh, turbulence modelling and boundary conditions in ways that need specialist judgement.

A flow study belongs in the plan when a fluid load or a thermal result drives a criterion and cannot be bounded by hand or by supplier data. Examples include the pressure on a large panel in a fan housing, the cooling of an enclosure full of electronics or the force on a valve disc. For the bracket, no fluid matters: wind load inside a factory is negligible, and the motor's cooling is the motor supplier's concern. The plan says so in one line, which tells a reviewer the question was considered.

Where a flow study is used, the same checks apply: a hand estimate of the main quantity, a mesh study, a check that mass and energy balance and, ideally, comparison with a measurement or published case. A flow plot without those checks is decoration.

## Exercise: a heavier conveyor load

The drive designer reports that a new product increases the equivalent inertia at the output shaft to 4.0 kg·m², with the same 40 N·m friction and the same 0.5 s start. Estimate the start-up torque and say what changes in the bracket's analysis.

**Worked answer.** The angular acceleration is unchanged at about 25.1 rad/s², so **T = 40 + 4.0 × 25.1 ≈ 140.5 N·m**, about 141 N·m. LC4 rises from 120 to about 141 N·m. The torsional shear in the arm scales with torque, from about 5.93 MPa to about **5.93 × 141 / 120 ≈ 6.97 MPa**, and the von Mises stress at the top root corner under C1 becomes about **√(21.9² + 3 × 6.97²) ≈ 25.0 MPa**, still far below 150 MPa. The bolt shear from torque also rises by the same proportion. The plan, load table and report must be updated, and the motion study rerun with the new inertia and its time step checked again.
