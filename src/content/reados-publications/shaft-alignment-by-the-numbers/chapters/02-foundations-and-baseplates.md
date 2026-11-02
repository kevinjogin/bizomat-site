---
book: shaft-alignment-by-the-numbers
chapterSlug: foundations-and-baseplates
order: 2
title: "Foundations, baseplates and grout"
description: "Why alignment starts with the foundation: a first estimate of a concrete block for mass, bearing pressure and resonance, and how baseplates, grout and holding-down bolts hold alignment."
draft: false
---

An alignment is a relationship between two machines, and the foundation is what keeps that relationship. A perfect alignment on a baseplate that rocks, twists or settles will not last the week. A modest one on a stiff, well-grouted base will hold for years. That is why fitters who have chased an alignment for a day on a poor base speak of the foundation with feeling, and why this book starts there.

This chapter follows the HW-3 pump set from its foundation block to its baseplate. It uses the KEVOS® machine foundation block tool for a first estimate of the block, shows how that estimate found a resonance problem in the first sketch, and sets out the checks on baseplate, grout and bolts that must pass before any alignment reading means anything. The final foundation design belongs to a structural engineer; the purpose here is to understand what that design must achieve.

## What a foundation must do for alignment

A machine foundation has three jobs that matter to alignment.

1. **Carry the weight** of the machines and itself to the ground without excessive settlement, and without the settlement differing from one end to the other.
2. **Stay stiff** so that the machines' feet keep their relative positions under the running forces, and so that tightening holding-down bolts does not distort the base.
3. **Stay clear of resonance** so that the forces from residual unbalance and misalignment do not build up into large vibration of the whole block.

The first two are mostly about the block's mass, size and the ground under it. The third is about the block's natural frequency on the ground, compared with the running speed.

## Sizing the block: a first estimate

A common starting rule for blocks under rotating machines is to make the block several times heavier than the machines it carries. The [machine foundation block tool](/tools/machine-foundation-block/) turns such a rule into numbers. It takes the machine mass, the ratio of block mass to machine mass, the concrete density, the block's plan dimensions, the allowable soil bearing pressure, the soil's vertical subgrade modulus and the lowest running speed. It returns the block mass and depth, the bearing pressure on the soil, the vertical stiffness of the soil under the block, the natural frequency of the block and machines on that stiffness, and the ratio of running to natural frequency, which it requires to be below 0.5 or above 1.5 to stay clear of resonance.

The HW-3 pump set, with its baseplate, has a mass of 1,450 kg and runs at 1,480 rpm, 24.67 Hz. The pump room stands on natural ground, which the geotechnical report describes with an allowable bearing pressure of 150 kPa and a vertical subgrade modulus of 40 MN/m³. The baseplate is 2.2 m by 0.9 m, so the block was sketched at 2.6 m by 1.3 m to give a 200 mm margin round the base. This is an illustration.

```figure
type: steps
title: The first HW-3 block sketch in the machine foundation block tool
caption: This is an illustration. Machine mass 1,450 kg, block mass three times the machine mass, concrete 2,400 kg/m³, block 2.6 × 1.3 m, allowable bearing 150 kPa, subgrade modulus 40 MN/m³, 1,480 rpm.
- Block mass and depth | 4.35 t; 0.54 m
- Soil bearing pressure | 16.8 kPa against 150 kPa: pass
- Vertical stiffness of the soil under the block | 135 MN/m
- Natural frequency of block and machines | 24.30 Hz
- * Running ÷ natural frequency | 1.02: REVISE THE FOUNDATION
```

### The mistake: a rule of thumb that landed on resonance

The sketch used the familiar three-times-the-machine rule, and it passed the bearing check easily. The resonance check failed: the block and machines would bounce on the soil at 24.30 Hz, almost exactly the running frequency of 24.67 Hz. Any vertical force at running speed, such as residual unbalance, would be amplified many times.

The rule had not failed in general. It failed for this combination of plan area, soil stiffness and speed, which the rule cannot see. The tool's frequency ratio made the problem visible before any concrete was poured.

## Moving away from resonance

There are two ways out of resonance: make the natural frequency much lower than the running frequency, or much higher. For a block on soil, the natural frequency is √(k ÷ m) ÷ 2π, so lowering it means adding mass or reducing stiffness, and raising it means adding stiffness or removing mass.

```figure
type: compare
title: HW-3 block options on the same plan area
cols: Block mass, t | Depth, m | Bearing pressure, kPa | Natural frequency, Hz | Running ÷ natural | Tool verdict
rowhead: Block mass ratio
- 3 | 4.35 | 0.54 | 16.8 | 24.30 | 1.02 | REVISE
- 5 | 7.25 | 0.89 | 25.2 | 19.84 | 1.24 | REVISE
- 8 | 11.60 | 1.43 | 37.9 | 16.20 | 1.52 | ACCEPTABLE, just
- * 9 | 13.05 | 1.61 | 42.1 | 15.37 | 1.61 | ACCEPTABLE
caption: This is an illustration. Plan 2.6 × 1.3 m, subgrade modulus 40 MN/m³, 1,480 rpm. The soil stiffness depends only on the plan area, so on this ground only more mass moves the frequency down.
```

Raising the frequency above twice the running speed would need far more stiffness than this ground provides: on 40 MN/m³ even a very shallow block cannot reach 49 Hz. That route needs piles or a stiffer founding layer, which is the engineer's call. Lowering it needs a block about nine times the machine mass, 1.6 m deep. The pump room's floor was already planned with a pump pit, so a deep block suited the layout, and the preliminary sizing went to the structural engineer with that option.

```figure
type: bars
title: Frequency ratio against block mass ratio, HW-3 plan and ground
x: Block mass ÷ machine mass
y: Running ÷ natural frequency
caption: This is an illustration. The tool accepts ratios below 0.5 or above 1.5. On this plan area and ground, the ratio rises only slowly with mass, because the natural frequency falls with the square root of the mass.
- 3 | 1.02
- 5 | 1.24
- 8 | 1.52
- * 9 | 1.61
```

The square root is the reason a rule of thumb can mislead. Tripling the block's mass from three to nine times the machine mass lowers the natural frequency only by a factor of about 1.6. Where the starting point is close to resonance, a large change of mass is needed to get clear of it, and a smaller plan area, which softens the soil spring, is sometimes the cheaper lever. Each option changes the bearing pressure and the block's stability, which is why the choice belongs to the engineer.

### Springs instead of mass

Another way to separate a machine's running frequency from its support is to mount it on vibration isolators, steel springs or elastomer mounts, chosen so that the machine bounces on them at a frequency well below its running speed. Isolators protect the building from the machine's vibration and are common on fans and on equipment on suspended floors. For alignment they bring a complication: the driver and driven machines must share one stiff inertia base on the isolators, so that the isolators cannot move one machine relative to the other, and pipes must be connected through flexible connectors so that they do not pull the base. The HW-3, on natural ground with heavy pipes, uses a solid block instead.

### What the tool does not do

The tool's model is a rigid block bouncing vertically on a single soil spring. Real blocks also rock and slide, and their rocking modes are often lower than the vertical one; the soil's stiffness depends on the block's size and embedment; and the ground has damping that the model ignores. The tool's own limitations say that it is a rule-of-thumb sizing and that the final design is for a structural engineer, and its checks include that reminder. Its value is in catching an obvious problem, such as the first sketch's resonance, before the design is drawn.

## Baseplates

The block carries a baseplate, and the baseplate carries the machines. For alignment, the baseplate's most important properties are that its machine mounting pads are flat, coplanar and stiff.

- **Flat pads** let each machine foot sit fully on its pad, so the foot does not rock.
- **Coplanar pads** for each machine mean that its feet start at the same height, so soft foot (Chapter 3) does not begin as a built-in error.
- **A stiff base**, well supported by grout, does not twist when holding-down bolts are tightened or when the machines run.

For the HW-3, the site's installation specification requires each mounting pad to be flat within 0.05 mm and the pads under each machine to be coplanar within 0.10 mm, checked with a precision level and straightedge before the base is grouted. These are the site's figures, labelled as illustrations; industry practices such as API RP 686 describe how pads are checked and machined, and the base maker's drawing sets the values for a real base.

## Grout

Grout fills the space between the baseplate and the block and turns them into one structure. Cementitious and epoxy grouts are both used; epoxy grouts are common under pumps and compressors because they bond well, resist oil and reach strength quickly. Whatever the material, the aim is complete contact between the underside of the base and the block, with no voids.

A void under a baseplate is a hidden soft support. The base flexes over it when the bolts are tightened or the machine runs, and the alignment moves with it. After grouting, the HW-3's base was tapped over a grid of points with a light hammer; a hollow sound marks a void. Two small voids were found near one corner and filled through drilled and tapped holes with injected epoxy, then re-tapped.

```figure
type: checklist
title: HW-3 base acceptance before alignment
caption: The site's checks, all to be signed before the motor is set. This is an illustration.
- x Block cured to the engineer's specified strength
- x Holding-down bolts at the drawing positions, with sleeves allowing a little sideways adjustment
- x Pads flat within 0.05 mm and coplanar within 0.10 mm under each machine
- x Grout placed, cured and tap-tested; voids filled and re-tested
- x Base level along and across within the installation specification
- x Machine feet and pads clean, free of burrs, paint and rust
```

## Holding-down bolts

Holding-down bolts, or anchor bolts, tie the base to the block. They must be tight enough that the base cannot shift, but they are not alignment tools: tightening them should not move anything. Sleeves around the bolts' upper lengths let them flex a little so that the base can be positioned before grouting without bending them.

The order of tightening matters. Tightening one corner fully before the others can lift or twist a base that is not perfectly seated. The HW-3 specification calls for the bolts to be tightened in a cross pattern in two passes, to the torque on the base maker's drawing, with a dial indicator on the base at the far corner during the first pass to catch any lift.

## Level and why it still matters

A shaft alignment does not need the machines to be level. Two shafts can be in perfect line on a slope. Level matters for other reasons: oil-lubricated bearings and gearboxes set their oil levels for a level machine, some pumps rely on level casings to vent air, and a level base makes the later shim and soft foot work simpler because the feet start square to gravity.

The HW-3 base was levelled on six screw-adjusted levelling wedges before grouting (Chapter 3), using a precision machinist's level with a sensitivity of 0.02 mm per metre, read along and across each set of pads. Its installation specification set level within 0.10 mm per metre for the pads; that is the site's figure, labelled as an illustration. The final readings were recorded on the base acceptance sheet, so that a later re-check can tell whether the block has tilted.

## Vibration of the block in service

The foundation's performance shows up later in vibration readings. When the HW-3 is commissioned, vibration is measured on the bearing housings of both machines and on the block itself. If the block vibrates almost as much as the bearing housings, the block is moving with the machine rather than holding it, which points to a resonance or a loss of grout contact. Large differences in vibration between points on the base point to looseness or a cracked weld. Those readings, taken with the alignment readings, become the reference for the life of the installation (Chapter 10).

## How foundations change with time

A foundation that is right at installation can still change. Concrete shrinks and creeps as it ages, mostly in its first months. Ground under a new block settles. Grout can lose its bond with a baseplate that runs hot or is soaked in oil. Each of those changes moves the machines, and none is visible without measurement.

For that reason the HW-3's alignment plan includes a re-check after the first three months of running, and the as-left readings from installation are kept so that the change can be measured. A change of a few hundredths of a millimetre is normal settling. A large or continuing change points to the foundation, not to the alignment.

## Exercise: a smaller pump on the same ground

A second pump set in the same room has a machine and base mass of 600 kg and runs at 2,950 rpm. Its block is planned at 1.8 m by 0.9 m on the same ground: 150 kPa allowable, 40 MN/m³. With a block mass of three times the machine mass and concrete at 2,400 kg/m³, find the block depth, the bearing pressure, the natural frequency and the frequency ratio. Does the tool accept it?

**Worked answer.** The block mass is 3 × 600 = 1,800 kg. The plan area is 1.62 m², so the depth is 1,800 ÷ (2,400 × 1.62) = 0.46 m. The total mass is 2,400 kg, so the bearing pressure is 2,400 × 9.807 ÷ 1.62 ÷ 1,000 = 14.5 kPa, well within 150 kPa.

The soil stiffness is 40 × 10⁶ × 1.62 = 64.8 MN/m. The natural frequency is √(64,800,000 ÷ 2,400) ÷ 2π = 26.15 Hz. The running frequency is 2,950 ÷ 60 = 49.17 Hz, so the ratio is 49.17 ÷ 26.15 = 1.88, above 1.5, and the tool accepts it: FOUNDATION ACCEPTABLE. A faster machine moves the running frequency away from the block's natural frequency, so the same rule of thumb that failed for the HW-3 works here. This is an illustration.
