---
book: design-simulation-by-the-numbers
chapterSlug: check-stiffness-frequency-and-buckling
order: 8
title: "Check stiffness, frequency and buckling"
description: "Use modal analysis to keep the bracket away from resonance, check each mode against a hand estimate, test sensitivity to the frame and use buckling results with caution."
draft: false
---

Many machine parts never come close to their strength limit. They fail by deflecting too far, vibrating too much or buckling, and a stress check alone never finds those failures. The bracket is a clear example: its stresses sit at a sixth to a quarter of the criterion, while its first proposal was rejected for deflection and frequency. This chapter treats stiffness and dynamics as first-class results.

It reads the modal analysis of Revision B, checks the first modes against hand estimates, explains why a natural frequency well above the running speed matters, tests how sensitive the result is to the unmodelled conveyor frame and closes with what a buckling analysis can and cannot tell a designer.

## Stiffness as a result in its own right

The deflection criterion in the plan comes from the belt drive. The belt stays aligned if the motor's pulley moves less than 0.5 mm. The model gives 0.061 mm under LC2 and 0.044 mm under LC3, so the bracket is roughly eight to eleven times stiffer than the criterion requires.

Alignment also depends on angle. If the arm tilts, the pulley's face tilts with it, and a tilted pulley can walk a belt sideways even when its displacement is small. For a cantilever with an end load, the slope at the tip is **θ = F L² / (2 E I)**. Under LC2, Revision B's arm tilts by about **628 × 250² / (2 × 200,000 × 307,500) ≈ 0.00032 rad**, or about 0.018°, on a fixed base. Base flexibility adds to that, but the result stays far below the fraction of a degree that belt drives typically tolerate. Asking the drive designer for an angular limit, as well as a displacement limit, would make the criterion complete.

## Read the modal results

A modal analysis finds the natural frequencies of the structure and the shape it takes when vibrating at each one. It does not predict how large the vibration will be; that needs a forced response analysis with damping and a defined excitation. What it does tell the designer is where the resonances lie, which is enough to keep them away from known excitations.

This is an illustration. The converged modal analysis of Revision B, with the bolt-and-contact base treated as bonded for small vibrations and the motor as a 32 kg point mass with estimated rotary inertia, gives four modes below 400 Hz.

```figure
type: bars
title: Revision B natural frequencies against the running speed and the criterion
unit: Hz
max: 340
caption: Teaching values. All modes lie well above the 48 Hz criterion and far from the 24 Hz motor speed.
- Motor running speed | 24
- Criterion, 2 × running speed | 48
- *Mode 1, sideways bending | 88.9
- Mode 2, vertical bending | 90.2
- Mode 3, motor rocking about the arm axis | 142
- Mode 4, end plate bending | 330
```

The first two modes are bending of the arm, sideways and vertically, as the hand estimates expected. They are close together because the hollow section is equally stiff about both axes; the small difference comes from the base plate, which is taller than it is wide and so resists vertical rocking slightly better. The third mode is the motor rocking about the arm's axis, controlled by the arm's torsional stiffness and the motor's rotary inertia. The fourth is local bending of the end plate, far above any excitation of concern.

## Check each mode against a hand estimate

Chapter 2's fixed-base estimate was about 96 Hz. The model includes the bolted base, so a direct comparison needs a hand estimate with the same flexibility. The static results provide one. Under LC2, the model's tip deflection was 0.0612 mm for 628 N, so the vertical stiffness including the base is **628 / 0.0612 ≈ 10,261 N/mm**. Under LC3, it was 0.044 mm for 450 N, giving a sideways stiffness of about **450 / 0.044 ≈ 10,227 N/mm**.

With the effective mass of 32.4 kg from Chapter 2, the one-mass estimates are:

- Vertical: **(1 / 2π) × √(10,261,000 / 32.42) ≈ 89.5 Hz**
- Sideways: **(1 / 2π) × √(10,227,000 / 32.42) ≈ 89.4 Hz**

The model's 88.9 and 90.2 Hz lie within about 1% of these. That agreement shows that the modal analysis uses the same stiffness and mass as the static analysis, which is not guaranteed: a wrong density, a missing point mass or a different restraint in the modal study would break it. The order of the two modes differs slightly between the estimate and the model, which is unimportant at this level of difference. The comparison checks the size of the frequencies, not their exact ranking.

## Understand why the margin above running speed matters

A structure excited at a frequency close to one of its natural frequencies responds far more strongly than the same force would produce statically. The ratio of dynamic to static response, called the dynamic magnification, depends on the frequency ratio and on damping. For a simple one-mass system with light damping, it rises sharply near a frequency ratio of one.

```figure
type: line
title: Dynamic magnification of a one-mass system with 5% damping
x: Frequency ratio, excitation ÷ natural frequency
y: Dynamic magnification
ymin: 0
ymax: 10.5
mark: 0.27 | Revision B in service
mark: 1 | Resonance
caption: At a ratio of 0.27, Revision B's motor force is magnified by about 8%. At resonance with 5% damping, the magnification is 10.
- 0 | 1
- 0.25 | 1.07
- 0.5 | 1.33
- 0.75 | 2.25
- 0.9 | 4.76
- 1 | 10
- 1.1 | 4.22
- 1.25 | 1.74
- 1.5 | 0.79
- 2 | 0.33
```

For Revision B, the motor runs at 24 Hz and the first mode is at 88.9 Hz, a ratio of about **24 / 88.9 ≈ 0.27**. Any out-of-balance force at running speed is magnified by only about **1 / (1 − 0.27²) ≈ 1.08** times. With damping of 5% of critical, a typical teaching value for a bolted steel structure, the peak magnification at resonance would be about **1 / (2 × 0.05) = 10**. Real damping in a welded steel bracket may be lower, and the peak higher.

The rejected Revision A shows the other side of the curve. Its sideways mode at 14.8 Hz sits below the 24 Hz running speed, at a ratio of about 1.62, where the steady running response is actually reduced. Every start, though, sweeps the motor speed up through 14.8 Hz, and every stop sweeps it down again, briefly exciting resonance. A soft-start drive that accelerates slowly through the resonance makes this worse, not better. Designing the bracket to sit well above the running speed avoids the problem entirely.

## Test sensitivity to the unmodelled frame

The model treats the conveyor frame as rigid. That was an open item in the analysis plan, and the modal result is the one it affects most. A quick sensitivity study shows how much it could matter.

Treat the frame as an extra spring in series with the bracket. If the frame's flexibility at the bracket adds a fraction of the bracket's own flexibility, the combined stiffness falls and the frequency falls with its square root. If the frame adds 20%, the frequency becomes **88.9 / √1.2 ≈ 81.2 Hz**.

```figure
type: compare
title: First natural frequency if the frame adds flexibility
cols: Combined stiffness | First frequency | Against 48 Hz criterion
caption: Teaching sensitivity study. Even a frame that doubled the total flexibility would leave the bracket above the criterion, but with a much smaller margin.
- Rigid frame, as modelled | 100% | 88.9 Hz | Passes, ratio 1.85
- Frame adds 20% flexibility | 83% | 81.2 Hz | Passes, ratio 1.69
- Frame adds 50% flexibility | 67% | 72.6 Hz | Passes, ratio 1.51
- *Frame adds 100% flexibility | 50% | 62.9 Hz | Passes, ratio 1.31
```

The study turns an unknown into a bounded risk. Even a frame as flexible as the bracket itself would leave the first mode above the criterion. The first-article tap test in Chapter 10 will measure the real value, and the plan now states what result would be acceptable: anything above 48 Hz, with a value below about 70 Hz prompting a review of the frame.

## Look beyond the bracket's own motor

The bracket's own motor is the excitation the plan names, but it is not the only machine in the building. A neighbouring compressor, a vibrating feeder or a fan on the same mezzanine can shake the conveyor frame at frequencies of their own, and the bracket will respond to any of them that lands near one of its modes. A short walk around the installation, or a question to the site, can identify those sources and their speeds.

For the running case, the site reports a screw compressor on the same floor running at 2,950 rev/min, about **2,950 / 60 ≈ 49** Hz, and a vibrating feeder at 25 Hz. Neither is close to the bracket's first modes near 89 Hz. The compressor's second harmonic, at about 98 Hz, is within about 10% of the first two modes, though, and harmonics of rotating machines are common. That does not fail the bracket, because the compressor is mounted on isolators and its energy at the second harmonic is likely to be small, but it is worth recording in the plan and checking during the tap test, when the compressor can be run and the bracket's response measured.

This is the sort of finding that no amount of meshing would produce. It comes from treating the analysis as part of a real installation rather than a part floating in empty space.

## Remember what a modal analysis leaves out

A linear modal analysis assumes small vibrations about a fixed configuration, linear stiffness and no damping. It ignores the belt's tension, which slightly stiffens the drive sideways, and the gyroscopic effects of the spinning rotor, which are negligible at this speed and size. It cannot represent a base plate that lifts and lands during vibration, because contact is nonlinear. For Revision B, with preloaded bolts and modest vibration, none of these omissions threatens the conclusion. For a heavily loaded, lightly bolted or high-speed system, each might.

When the plan needs a vibration amplitude, rather than a frequency margin, the next step is a harmonic or random response analysis with measured or estimated forces and damping. That is a larger study, and the plan should say whether it is needed. For the bracket, it is not, because the frequency margin is large and the out-of-balance force from a balanced motor is small.

## Use buckling results with caution

Buckling is a stiffness failure in compression: a slender member or thin wall suddenly deflects sideways at a load far below its crushing strength. A linear buckling analysis finds the load factor at which an ideal, perfectly straight structure would buckle, and the shape it would take.

The bracket has no slender compression members, and the hollow section's walls, with a width-to-thickness ratio of about 10, are far too stocky to buckle locally at 13 MPa. Suppose, though, that the 41 kg motor variant from earlier exercises needed a diagonal brace below the arm, made from a 20 × 20 × 2 mm hollow section, 300 mm long between pinned ends. Its second moment of area is about **(20⁴ − 16⁴) / 12 ≈ 7,872 mm⁴**, and the classical Euler load for a pinned strut is **π² E I / L²**:

**P_cr = π² × 200,000 × 7,872 / 300² ≈ 172,700 N, about 173 kN.**

If the brace carried 1 kN, the linear buckling load factor would be about 170. That number is not a safety factor in the usual sense. Real struts have initial crookedness, residual stresses from manufacture and eccentric loads, and they fail at loads well below the ideal Euler value, sometimes by a large fraction for members of intermediate slenderness. Structural design standards use column curves derived from tests to account for this.

A linear buckling result is therefore an upper bound and a mode-shape finder. A load factor of 170 says buckling is not a concern for this brace. A load factor of 3 would not say the brace is safe by a factor of three; it would say a nonlinear analysis with imperfections, or a check to the relevant structural standard, is required. The KEVOS® [column buckling calculator](/tools/column-buckling/) gives the Euler load for common end conditions.

## A failure case: the mode that was a mechanism

This is an illustration. An early modal run of Revision B reports a first natural frequency of 0.0003 Hz, followed by the expected modes near 89 Hz. A designer, unsure what to make of the tiny value, deletes it from the report as a numerical oddity.

A frequency near zero means the model can move without straining: it has a rigid body motion or an internal mechanism. Animating the mode shows the end plate and motor rotating freely about the arm's axis. The end plate had been connected to the arm by a bonded contact on only one face, which acted as a hinge line for twisting. The torsional mode at 142 Hz was missing from the results because the model could not represent it.

The detection was in the first line of the result. Any frequency near zero in a supposedly restrained model points to an unrestrained freedom, and the mode shape shows where. Never delete it; find it, fix the connection and rerun. Here the fix was to bond the full weld line, after which the near-zero mode vanished and the rocking mode appeared at 142 Hz.

## Exercise: the effect of the 41 kg motor on the first mode

Using the base-flexible sideways stiffness of about 10,227 N/mm, estimate the first natural frequency with the 41 kg motor, then estimate it again assuming the frame adds 50% to the flexibility. Does the bracket still meet the 48 Hz criterion?

**Worked answer.** The effective mass is **41 + 0.24 × 1.77 ≈ 41.4 kg**. With a rigid frame, **f = (1 / 2π) × √(10,227,000 / 41.4) ≈ 79.1 Hz**. If the frame adds 50% to the flexibility, the stiffness falls to two-thirds and the frequency falls by a factor of **√(2 / 3) ≈ 0.816**, to about **64.6 Hz**. Both pass the 48 Hz criterion. The second result sits close to the 70 Hz review threshold set for the tap test, so with the heavier motor the test becomes more important, and the brace may be worth reconsidering if the measured value is low.
