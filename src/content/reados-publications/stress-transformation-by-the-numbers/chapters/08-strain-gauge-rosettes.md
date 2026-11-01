---
book: stress-transformation-by-the-numbers
chapterSlug: strain-gauge-rosettes
order: 8
title: "Strain gauge rosettes"
description: "How three gauges at known angles give the full surface stress state, how to reduce rosette readings to principal stresses, and how a fourth gauge and a prediction catch errors."
draft: false
---

A single strain gauge measures strain in one direction. Chapter 7 showed that this is enough only when the stress is known to be uniaxial along the gauge, which on a pressurised, twisted spindle it is not. The surface of a part has three unknown strain components, εx, εy and γxy, so three independent readings at different angles are needed. A rosette packs three gauge grids onto one backing at fixed angles, so that they measure at practically the same point.

This chapter reduces the RH-40 prototype test's rosette readings to principal stresses, compares them with the prediction from Chapter 7, and shows two errors that rosettes are prone to: a gauge mounted at the wrong angle, and a wiring or labelling mix-up. It also shows how a fourth gauge turns a rosette into a self-checking measurement.

## Rosette types

Two layouts cover most work.

- **Rectangular rosettes** have gauges at 0°, 45° and 90°. The 0° and 90° gauges read εx and εy directly, and the 45° gauge supplies the shear. They are the usual choice when the principal directions are roughly known, because the gauges can be lined up with the part's axes.
- **Delta rosettes** have gauges at 0°, 60° and 120°. They sample the directions evenly, which suits cases where the principal directions are unknown.

Each comes as a planar rosette, with the three grids side by side, or a stacked rosette, with the grids on top of each other. Planar rosettes are thinner and dissipate heat better; stacked ones measure closer to one point, which matters where strain changes quickly, as near a fillet. The gauge maker's technical notes on rosette selection and data reduction are the practical reference for both.

## Reducing a rectangular rosette

The strain transformation of Chapter 7, applied at 0°, 45° and 90°, gives three equations that can be solved directly.

```figure
type: formula
title: Data reduction for a rectangular rosette
formula: εx = ε0,  εy = ε90,  γxy = 2ε45 − ε0 − ε90
formula: ε1, ε2 = (ε0 + ε90) ÷ 2 ± (1 ÷ √2) × √[(ε0 − ε45)² + (ε45 − ε90)²]
formula: θp = ½ × atan2(2ε45 − ε0 − ε90, ε0 − ε90), from the 0° gauge to ε1
caption: Then the plane stress form of Hooke's law gives σx, σy and τxy, or the principal stresses straight from the principal strains. The 0° gauge defines x; the angle is positive towards the 45° gauge.
- ε0, ε45, ε90 | readings of the three gauges, with tension positive
- γxy | engineering shear strain
```

For a delta rosette, εx = ε0, εy = [2(ε60 + ε120) − ε0] ÷ 3 and γxy = 2(ε60 − ε120) ÷ √3. The rest of the reduction is the same.

## The RH-40 prototype test

The builder bonded a rectangular rosette to the outer surface of a prototype spindle, well away from the gear seat and its shoulder, with the 0° gauge along the spindle's axis and the 45° gauge turned towards the direction in which the test torque twists the surface. With the spindle at 7 MPa and 4,000 N·m, Chapter 7 predicted 25.47 µε along the axis, 103.82 µε around the hoop and 595.7 µε of shear. The transformation gives the readings each gauge should show: 25.5 µε at 0°, 362.5 µε at 45° and 103.8 µε at 90°. This is an illustration.

The gauges read 27, 359 and 101 µε after zeroing at the test temperature with the spindle empty and unloaded. This is an illustration.

```figure
type: steps
title: Reducing the RH-40 rosette readings
caption: This is an illustration. E = 205 GPa, ν = 0.29, so E ÷ (1 − ν²) = 223,824 MPa and G = 79,460 MPa.
- Axial and hoop strains | εx = 27 µε, εy = 101 µε
- Shear strain | γxy = 2 × 359 − 27 − 101 = 590 µε
- Principal strains | 64.0 ± 297.3: ε1 = 361.3 µε, ε2 = −233.3 µε
- Stresses | σx = 12.60 MPa, σy = 24.36 MPa, τxy = 46.88 MPa
- * Principal stresses | σ1 = 65.73 MPa, σ2 = −28.77 MPa, at 48.57° from the axis
```

The stresses go into the [principal stress tool](/tools/principal-stress/) of Chapter 3 to complete the picture: with Sy = 650 MPa it reports a von Mises stress of 83.89 MPa and a safety factor of 7.75 at this test load.

### Measured against predicted

```figure
type: compare
title: RH-40 rosette test: prediction and measurement
cols: Predicted | Measured | Difference
rowhead: Quantity
- 0° gauge, µε | 25.5 | 27 | +1.5
- 45° gauge, µε | 362.5 | 359 | −3.5
- 90° gauge, µε | 103.8 | 101 | −2.8
- * σ1, MPa | 66.40 | 65.73 | −1.0%
- σ2, MPa | −29.07 | −28.77 | −1.0%
- Principal angle | 48.75° | 48.57° | −0.18°
- von Mises, MPa | 84.76 | 83.89 | −1.0%
caption: This is an illustration. Agreement within about 1% in stress and a fifth of a degree in angle is a good result for a bonded rosette; differences of 3 to 5% are common and not by themselves a concern.
```

The agreement confirms three things at once: that the spindle's ends carry the pressure thrust as assumed, that the torque reaches the spindle as calculated, and that the material constants are about right. It does not confirm the stresses at the gear seat's shoulder, where no gauge was fitted; for those, the model and the stress concentration factor remain the evidence, unless a small stacked rosette is fitted in the fillet itself.

## The mistake: a rosette the wrong way round

On the second prototype, the 45° gauge read −236 µε at the same test load, and the reduction gave a shear strain of 2 × (−236) − 27 − 101 = −600 µε, a shear stress of −47.67 MPa and a principal angle of −48.52°. The magnitudes looked fine: σ1 = 66.51 MPa against 66.40 MPa predicted. Only the sign of the shear, and therefore of the angle, had changed.

A shear of the wrong sign means either that the torque was applied in the opposite direction, or that the 45° gauge was not at +45°. The test log confirmed the torque direction. The rosette had been bonded mirror-image, with its 45° grid towards −45°, and that gauge was reading the strain at −45°, which the transformation predicts as 64.6 − 297.8 = −233.2 µε. With the gauge's true angle in the reduction, the shear came out at +590 µε as on the first prototype.

The error would not have mattered for a von Mises check, which depends only on magnitudes. It would have mattered for a fatigue assessment that used the principal direction to locate the critical plane, or for any test where the sign of the shear identifies which way a part twists. It was caught because the predictions for each gauge, including their signs, were written on the test sheet before the test.

```figure
type: decision
title: A rosette result disagrees with the prediction
question: What kind of disagreement is it?
- One gauge reads with the right size but wrong sign | check the gauge's angle against the drawing and the load's direction
- Two gauges' readings appear swapped | check channel labels and wiring at the bridge and the logger
- All gauges low by a similar share | check gauge factor setting, bridge excitation and lead wire resistance
- Readings drift with time or temperature | check temperature compensation, moisture protection and the bond
- * Small, consistent differences of a few per cent | likely real: material constants, dimensions or load slightly different from assumed
caption: Every rosette channel should have a predicted reading, with its sign, before the test. Without a prediction, a swapped channel or a mirrored rosette can look like a plausible stress state.
```

## A fourth gauge closes the loop

A rectangular rosette has no redundancy: any three readings give some stress state. Adding a fourth gauge at 135° changes that. Because the transformation equations repeat every 180° with the cosine term reversed at 90° intervals, the readings must satisfy

ε0 + ε90 = ε45 + ε135.

Both sides equal twice the mean strain at the point, an invariant. For the RH-40 test, the three gauges predict ε135 = 27 + 101 − 359 = −231 µε, and a fourth gauge on the third prototype read −229 µε. The closure error of 2 µε, less than 1% of the largest reading, confirms that all four gauges are reading the same strain field at their true angles.

The idea of a closure check is old and general. A surveyor's traverse round a field must return to its starting point; a tolerance stack round a closed loop of dimensions must add to zero; a circuit drawn round a dislocation in a crystal fails to close by its Burgers vector, which is how a dislocation is defined. In each case, the failure to close is information: either about a defect in the measurement or about a defect in the thing measured. A four-gauge rosette applies the same thinking to strain.

```figure
type: stats
title: The four-gauge closure check on the third RH-40 prototype
caption: This is an illustration. Closure error = (ε0 + ε90) − (ε45 + ε135). A closure error of more than a few per cent of the largest reading means one gauge is wrong.
- ε0 + ε90 | 128 µε
- ε45 + ε135 | 359 − 229 = 130 µε
- * Closure error | −2 µε
- As a share of the largest reading | 0.6%
```

## Angle errors and strain gradients

Rosettes are sensitive to their alignment in a way that is easy to underestimate. On the RH-40 spindle the shear strain is large and the axial strain small, so a small rotation of the rosette mixes shear into the axial gauge. If the rosette were bonded 3° off the axis, the 0° gauge would read 56.8 µε instead of 25.5 µε, more than double, while the 45° gauge would change only from 362.5 to 364.9 µε. The principal stresses from the full reduction would still be right, because the reduction does not care where x points, but any stress read straight off the 0° gauge would be badly wrong.

Gauges also average strain over their grid length, typically a few millimetres. On the smooth part of the spindle that hardly matters, but near the gear seat's fillet the strain changes by tens of per cent over a millimetre, and a gauge reads an average lower than the peak. Fillet measurements need the shortest practical grids and a stacked rosette, and even then they underestimate the peak; the stress concentration factor is often better established by a model checked against the smooth-section gauges.

```figure
type: checklist
title: Fitting and reading a rosette
caption: The RH-40 test procedure. This is an illustration.
- x Rosette type chosen for the job: rectangular here, with directions known
- x Orientation marked on the part and photographed after bonding
- x Gauge angle convention written on the test sheet, with the 45° gauge's side
- x Predicted reading for each gauge, with its sign, before loading
- x Zero taken at test temperature, unloaded and unpressurised
- x Fourth gauge or repeat loading to check closure and repeatability
- ? Gauge factor and transverse sensitivity corrections from the gauge data sheet applied where the accuracy needed justifies them
```

### Transverse sensitivity

A gauge grid responds mainly to strain along its length, but slightly to strain across it too, through the end loops and the width of its conductors. Makers state this as a transverse sensitivity coefficient, typically a few per cent or less. Where the strain across a gauge is much larger than the strain along it, as for the RH-40's 0° gauge sitting beside a hoop strain four times its own, the error in that one gauge can reach several per cent of its small reading. The maker's correction formulas remove it; for this test, whose purpose was to confirm stresses to a few per cent, the builder applied them only to the 0° channel and recorded that it had.

## Separating bending from the rest

The prototype bench can also apply the gear's bending moment, by loading a dummy gear through a hydraulic cylinder. Then the strain at a point depends on where it sits relative to the load, and a single rosette cannot tell bending from axial load. The usual answer is a pair of gauges or rosettes on opposite sides of the section, in the plane of bending.

At 2,000 N·m, the bending stress at the outer fibre is 47.33 MPa, which on its own gives an axial strain of 47.33 ÷ 205,000 = 230.9 µε, positive on one side and negative on the other. Add the pressure test's 25.47 µε and the two axial gauges read 256.3 µε and −205.4 µε. Half their sum, 25.5 µε, is the part common to both: pressure, and pullback when it is applied. Half their difference, 230.9 µε, is the bending. The same pair of readings therefore checks the load path of the end thrust and the bending moment from the gear, separately. A third gauge at 90° to the pair, on the neutral axis, reads neither bending nor anything new, but it confirms that the bending plane is where it was assumed to be.

On a rotating spindle in the field, the same separation happens over time instead of space: a single axial gauge sees a steady part and a part that alternates once per revolution. Reading it needs slip rings or a small telemetry transmitter on the shaft, and a logging rate of at least ten samples per revolution to capture the wave cleanly. At 150 rpm that is 25 samples a second, easily within any modern logger.

## Calibration and records

A rosette's output is a small change of electrical resistance, turned into strain by a bridge circuit and a gauge factor that the maker states for each lot of gauges. Three routine steps make the conversion traceable. The gauge factor of the lot is entered into the instrument, not a default. A shunt calibration, which connects a precision resistor across one arm of the bridge to simulate a known strain, is recorded before and after the test, so that any drift in the instrument shows. And the lead wires are recorded with their length and gauge, because long thin leads reduce the apparent strain unless the instrument corrects for them.

The RH-40 test record lists, for each channel, the gauge lot and factor, the shunt calibration readings, the predicted and measured strains at each load step, and photographs of the bonded rosettes with a scale and the axis mark visible. Without those, a later reader cannot tell a real difference from an instrument error, and the test cannot be repeated on the next spindle design.

## What a rosette cannot tell you

A rosette measures surface strain at one spot, under the loads present during the test. It cannot measure residual stresses already locked into the part when it was zeroed, because zeroing removes them; special methods such as hole drilling, in which a small hole relieves the local stress and a purpose-made rosette around it reads the relief, exist for that. It cannot see stresses below the surface. And it cannot tell whether the test loads match service: the RH-40's real drilling torque, pressure spikes and bending come from field records, not from the bench. A good test programme uses rosettes to prove the model on the bench, then trusts the proven model for the conditions the bench cannot reproduce.

## Exercise: a delta rosette on the same spindle

A delta rosette fitted on the RH-40 spindle, with its 0° gauge along the axis, reads 25.5, 342.2 and −173.7 µε at 0°, 60° and 120° under the test load. Reduce the readings to εx, εy and γxy, and then to principal strains. Do they agree with the rectangular rosette's prediction?

**Worked answer.** εx = ε0 = 25.5 µε. εy = [2 × (342.2 − 173.7) − 25.5] ÷ 3 = (337.0 − 25.5) ÷ 3 = 103.8 µε. γxy = 2 × (342.2 + 173.7) ÷ √3 = 1,031.8 ÷ 1.7321 = 595.7 µε.

Those are the predicted 25.47, 103.82 and 595.7 µε to rounding, so the principal strains match too: the centre is (25.5 + 103.8) ÷ 2 = 64.65 µε, the radius √(39.15² + 297.85²) = 300.4 µε, so ε1 = 365.1 µε and ε2 = −235.8 µε, at ½ × atan2(595.7, −78.3) = 48.74° from the axis. A delta rosette and a rectangular one give the same state; they differ only in how evenly they sample the directions. This is an illustration.
