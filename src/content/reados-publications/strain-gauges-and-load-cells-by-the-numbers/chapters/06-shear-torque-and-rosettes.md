---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: shear-torque-and-rosettes
order: 6
title: "Shear, torque and rosettes"
description: "Why gauges at 45° measure shear, how torque transducers work on a shaft, and how a three-gauge rosette gives the principal strains and stresses on a surface whose stress directions are unknown."
draft: false
---

A single gauge measures strain in one direction. That is enough on a column or a beam, where the direction of the main strain is known in advance. It is not enough in a shear web, on a shaft carrying torque or on a bracket with stresses in several directions, where the largest strain may run at an angle nobody predicted. This chapter is about measuring strain on a surface where the stress is two-dimensional.

It starts with how strain at a point changes with direction, shows why pure shear is the same thing as tension and compression at 45°, and uses that to check the stress in BH-2's shear beam webs. It then applies the same idea to a torque transducer on the screw feeder under BH-2, and to a three-gauge rosette on one of BH-2's lugs, where a technician's shortcut underestimated the peak stress by a third.

## Strain in two directions

On a free surface there is no stress perpendicular to the surface, so the state of stress is two-dimensional: two normal stresses and a shear stress in the plane of the surface. The strains are likewise two normal strains, εx and εy, and a shear strain γxy. A gauge laid at an angle θ to the x axis reads a combination of all three.

```figure
type: formula
title: Strain read by a gauge at angle θ, and the principal strains
formula: ε(θ) = (εx + εy) ÷ 2 + (εx − εy) ÷ 2 × cos 2θ + γxy ÷ 2 × sin 2θ
formula: ε₁, ε₂ = (εx + εy) ÷ 2 ± √[((εx − εy) ÷ 2)² + (γxy ÷ 2)²]
formula: σ₁ = E ÷ (1 − ν²) × (ε₁ + ν ε₂),  σ₂ = E ÷ (1 − ν²) × (ε₂ + ν ε₁)
caption: εx, εy and γxy are the strains in a chosen x–y frame on the surface. The principal strains ε₁ and ε₂ are the largest and smallest normal strains, at right angles to each other; the stresses follow from Hooke's law for plane stress. The same mathematics, drawn as a circle, is Mohr's circle.
- ε(θ) | strain a gauge at angle θ reads
- ε₁, ε₂ | principal strains
- σ₁, σ₂ | principal stresses, MPa
```

The Library's [Stress Transformation by the Numbers](/reados/publications/stress-transformation-by-the-numbers/) develops the same transformation for stresses and draws Mohr's circle in detail. For strain gauges the practical result is this: three gauges at three known angles give three readings, which are exactly enough to find εx, εy and γxy, and from them the principal strains, their direction and the principal stresses.

## Pure shear is tension and compression at 45°

Set εx = εy = 0 in the first formula and leave only shear. A gauge along x or y then reads nothing at all, but a gauge at 45° reads +γ ÷ 2 and one at −45° reads −γ ÷ 2. Pure shear is indistinguishable from equal tension and compression at right angles to each other, turned 45° from the shear directions. That is why the gauges in a shear beam's web are set at ±45°, and why they read a strain equal to half the shear strain.

The [principal stresses and von Mises tool](/tools/principal-stress/) finds the principal stresses, their direction, the maximum shear stress and the von Mises and Tresca equivalent stresses for a plane stress state, with safety factors against a yield strength. For the web of BH-2's cells at rated load, Chapter 5 found a shear stress of 161.5 MPa with no normal stress.

```figure
type: steps
title: The web of a BH-2 load cell at its rated 2,000 kg
caption: This is an illustration. Results from the principal stresses and von Mises tool with σx = σy = 0, τxy = 161.5 MPa and an assumed yield strength of 1,000 MPa for the cell's alloy steel. At a full batch, 1,216.7 kg per cell, all stresses are 61% of these.
- Principal stresses | +161.5 and −161.5 MPa
- Principal angle | 45°
- Strain along the 45° gauges, 161.5 ÷ (2 × 76,900) | 1,050 µε
- * von Mises equivalent stress, √3 × 161.5 | 279.7 MPa
- Tresca equivalent stress, 2 × 161.5 | 323 MPa
- Safety factor against yield by von Mises | 3.57
```

The equivalent stress of 280 MPa sits at 28% of the assumed yield strength at rated load, which leaves room for the overload ratings in the datasheet and for a long fatigue life (Chapter 10).

## Torque transducers

A round shaft carrying torque is in pure shear on its surface, with the shear along and around the shaft. Gauges at ±45° to the shaft's axis therefore read ±γ ÷ 2, and four of them, two on each side of the shaft, make a full bridge whose output is the gauge factor times γ ÷ 2. Placed this way the bridge also cancels the strains from bending and axial load, which act along the axis and affect all four gauges in ways that subtract out, so a well-made torque transducer reads torque alone.

Under BH-2, the screw feeder that meters each batch into the mixer is driven at 40 rpm by a 5.5 kW geared motor, and its drive had been tripping on overload when damp meal bridged in the screw. Maintenance wanted to know the actual torque in the screw shaft during a discharge, so they fitted a temporary torque bridge to the 60 mm solid shaft, with a battery-powered telemetry transmitter strapped to the shaft to carry the signal off the rotating part.

At the motor's full 5.5 kW and 40 rpm the shaft carries 9,549 × 5.5 ÷ 40 = 1,313 N·m. The [circular shaft torsion tool](/tools/shaft-torsion/) works out the polar moment of area, peak shear stress and angle of twist of a uniform solid or hollow round shaft from its diameters, loaded length, torque and shear modulus. For the 60 mm shaft with 80,000 MPa and a 200 mm gauged length, it gives 30.96 MPa and a twist of 0.148°.

```figure
type: compare
title: Torque bridge on the screw feeder shaft at 1,313 N·m
cols: Shear stress | Shear strain | Gauge strain at ±45° | Bridge output
rowhead: Gauged section
- 60 mm solid shaft as it is | 30.96 MPa | 387 µ | ±193.5 µε | 0.387 mV/V
- * Purpose-made 40 mm transducer section | 104.5 MPa | 1,306 µ | ±653 µε | 1.306 mV/V
caption: This is an illustration. Shear stress from the circular shaft torsion tool with G = 80,000 MPa; bridge output = GF × γ ÷ 2 with GF = 2.0. Gauging the existing shaft gives a usable but small signal; a permanent transducer is made with a reduced section to raise the strain, checked for fatigue and stress concentration at its shoulders.
```

The temporary bridge on the 60 mm shaft gives 0.387 mV/V at full motor torque. That is a fifth of a load cell's output, but a diagnostic measurement over a few days does not need a load cell's stability, only enough signal to see the shape and size of the torque during each discharge, and modern telemetry resolves a few microvolts without difficulty. The next section describes how the signal was taken off the shaft and what it showed. The cure, as it turned out, was in the meal's moisture and the bin's flow, not a bigger motor: a larger motor would only have delivered a harder blow to the screw and gearbox each time the bridged meal collapsed.

## Getting the signal off a turning shaft

A torque bridge on a rotating shaft has a problem a hopper does not: its wires go round with it. There are three common answers.

**Slip rings.** Brushes running on rings carry the excitation in and the signal out. They are simple, but every brush contact adds a small, noisy resistance that varies as the shaft turns, which is serious for a signal of a few hundred microvolts. Slip rings suit slow shafts and short tests, and need cleaning and wear checks.

**Telemetry.** A small battery-powered or inductively powered unit on the shaft excites the bridge, digitises the signal and sends it by radio to a receiver nearby. This is what the mill used on the screw feeder: a clamp-on collar carrying the electronics and a battery good for a few days of logging. It needs no changes to the machine beyond access to a length of bare shaft.

**Rotary transformers and complete transducers.** Permanent in-line torque transducers, fitted between motor and gearbox or gearbox and load, carry their own non-contact power and signal transfer. They are the right choice for a test stand or a machine where torque is monitored continuously, at the cost of a coupling and the space to fit it.

Whatever the method, the bridge on the shaft must be calibrated. With a temporary bridge, the simplest way is to lock the screw against rotation and hang a known mass from a lever clamped to the shaft. A 50 kg mass on a 1 m arm applies 490 N·m, which on the 60 mm shaft should give 0.387 × 490.3 ÷ 1,313 = 0.145 mV/V. If the reading differs, the difference shows how far the gauge factor, the shear modulus or the gauge placement depart from the assumptions, and the measured calibration replaces the calculated one. A shunt check (Chapter 2) then confirms that the telemetry chain still reads correctly at the start and end of each day of logging.

The logging itself gave the mill the numbers it needed. A normal discharge ran at about 525 N·m, 40% of the motor's 1,313 N·m. When damp meal bridged above the screw and then collapsed onto it, the torque peaked at about 1,576 N·m, 120% of the motor's rating, for one to two seconds, long enough for the drive's overload protection to trip. The Library's [Variable-Speed Drives by the Numbers](/reados/publications/variable-speed-drives-by-the-numbers/) explains how a drive's overload settings respond to such peaks.

## Rosettes

Where the stress directions are unknown, three gauges are stacked or set side by side on one backing at fixed angles: a rectangular rosette at 0°, 45° and 90°, or a delta rosette at 0°, 60° and 120°. From the three readings the principal strains and their direction follow from the formulas above.

During a review of BH-2's structure the mill's engineer had a rectangular rosette fitted to the side of one hopper lug, close to its weld to the cone, where a finite element model showed stresses in several directions. The gauges were zeroed with the hopper empty and read at the end of a full batch, so the readings are the strains due to the 2,500 kg batch alone.

```figure
type: steps
title: Rosette on a BH-2 lug under a 2,500 kg batch
caption: This is an illustration. Readings at 0°, 45° and 90° to the lug's axis: 180, 260 and −40 µε. Plane stress with E = 200,000 MPa and ν = 0.30. The x–y stresses were entered in the principal stresses and von Mises tool, which returned the same principal values with a yield strength of 250 MPa and a required factor of 2.
- Readings ε₀, ε₄₅, ε₉₀ | 180, 260, −40 µε
- Shear strain, 2ε₄₅ − ε₀ − ε₉₀ | 380 µ
- Principal strains | 289.5 and −149.5 µε
- Direction of ε₁ from the 0° gauge | 30.0°
- Stresses in the gauge frame, σx, σy, τxy | 36.9, 3.1, 29.2 MPa
- * Principal stresses | 53.8 and −13.8 MPa
- von Mises stress and safety factor against 250 MPa | 61.8 MPa, 4.04
```

The lug is in no danger: its largest stress under a full batch is 54 MPa, with a von Mises safety factor of 4.04 against the plate's 250 MPa yield. The model had predicted 58 MPa at the same point, close enough to give the engineer confidence in its predictions elsewhere on the hopper, where no gauges could be fitted. Chapter 10 considers whether repeated batches matter for the weld's fatigue.

## Placing a rosette

A rosette's analysis assumes the gauges sit at exactly the angles it was designed for. On a surface where the strain changes quickly with direction, small misalignments matter. On the lug, the readings imply a strain circle centred on 70 µε with a radius of 219.5 µε and the largest strain at 30° to the lug's axis. A gauge meant to be at 0° but bonded at 5° would read 211 µε instead of 180 µε, 17% more, and an analysis that assumed it was at 0° would place the principal direction and stresses wrongly.

Near a principal direction the effect is far smaller: in a uniaxial stress field a gauge 2° off the stress direction reads only 0.16% low, and 5° off about 1% low. That is why single gauges on simple members are forgiving and rosettes on complex surfaces are not. In practice, rosettes are laid out with fine scribed lines on the prepared surface, aligned with the marks on their backing, and photographed after bonding with a scale and a reference direction in the picture.

Stacked rosettes, with the three grids on top of each other, measure at one point and suit steep gradients; planar rosettes, with the grids side by side, average over a slightly larger area but dissipate heat better and are easier to bond flat. On the lug, near a weld toe, a stacked rosette was chosen and placed a defined distance from the toe so that the result could be compared with the finite element model at the same point.

## When it goes wrong: one gauge of three

The first report of the lug survey came from a technician who, short of time, took only the 0° gauge, the one along the lug's axis, and multiplied its reading by Young's modulus: 180 µε × 200,000 MPa = 36 MPa. That is wrong twice over. It ignores the shear strain the other two gauges reveal, so it misses that the largest strain runs 30° from the lug's axis. And it ignores Poisson's effect between the two directions, which plane-stress Hooke's law includes. The result understated the peak stress, 53.8 MPa, by a third.

```figure
type: compare
title: Three ways to turn the lug's rosette into a stress
cols: Result | Error against the full analysis
rowhead: Method
- 0° gauge × E | 36.0 MPa | −33%
- 0° and 90° gauges with plane-stress Hooke's law, no shear | 36.9 MPa | −31%
- * All three gauges, principal stresses | 53.8 MPa | correct
caption: This is an illustration. The rosette exists because the stress direction is not known in advance; using fewer than its three readings throws away the information it was fitted to provide.
```

The error was caught because the report gave a stress below the finite element model's prediction near the weld, and the engineer asked for the raw readings. Getting raw readings, angles and the gauge's orientation on a sketch with every strain survey is the habit that makes such checks possible.

## Exercise: a second rosette reading

Under a different loading, the same lug's rosette reads 400 µε at 0°, 100 µε at 45° and −100 µε at 90°.

1. What are the principal strains and the direction of the larger one?
2. What are the principal stresses and the von Mises stress?
3. What does the 0°-gauge shortcut give, and how wrong is it this time?

**Answer.**

1. The centre of the circle is (400 − 100) ÷ 2 = 150 µε. The shear strain is 2 × 100 − 400 − (−100) = −100 µ, and the radius √(250² + 50²) = 255 µε. So ε₁ = 405 µε and ε₂ = −105 µε, with ε₁ at −5.65°, almost along the lug.
2. σ₁ = 200,000 ÷ 0.91 × (405 − 0.3 × 105) × 10⁻⁶ = 82.1 MPa and σ₂ = 3.6 MPa. The [principal stresses and von Mises tool](/tools/principal-stress/) with σx = 81.3 MPa, σy = 4.4 MPa and τxy = −7.7 MPa gives the same, with a von Mises stress of 80.3 MPa.
3. The shortcut gives 400 × 0.2 = 80 MPa, only 2.5% below σ₁, because this time the principal direction happens to lie close to the 0° gauge. The shortcut is not always badly wrong, but nobody can know whether it is without the other two readings.
