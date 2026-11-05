---
book: shaft-alignment-by-the-numbers
chapterSlug: levelling-and-soft-foot
order: 3
title: "Levelling and soft foot"
description: "How levelling wedges set a base and whether they hold, what soft foot is, how to measure it at every foot, how to tell parallel, angled and induced soft foot apart, and how to shim."
draft: false
---

A machine with four feet on a base is held by four bolts, and it would be pleasant to think that the four feet always sit flat on four pads at the same height. They rarely do. One foot sits a little high, or a pad a little low, or a foot is bent, and when that foot's bolt is tightened, it pulls the foot down and distorts the machine's frame to make it touch. That is soft foot, and it is the reason an alignment reading can change when nobody has touched the machine except to tighten a bolt.

This chapter covers the two adjustments that come before any alignment: setting the base's height and level on its levelling wedges, checked with the BIZOMAT levelling wedge tool, and finding and correcting soft foot on the HW-3's motor and pump. It shows the readings that were taken on the HW-3 before the soft foot was found, and why they could not be trusted.

## Levelling wedges

Before grouting, the HW-3's base stood on six screw-adjusted levelling wedges near its holding-down bolts. Each wedge unit has a sliding wedge between two inclined faces; turning its screw drives the wedge in and lifts the base, or draws it out and lowers it. Wedges of this kind are also used under machines on floors, where they stay in service as the machine's permanent supports.

Two questions decide whether a wedge works: can the screw drive it under the load, and will the wedge stay put once set? A wedge that the load can push out is not self-locking, and it will creep under vibration until the machine settles.

The [machine levelling wedge tool](/tools/machine-levelling-wedge-check/) answers both. It takes the machine mass, the number of wedges, the share of the weight on the worst-loaded wedge, the wedge angle, the friction coefficient on its faces, the height adjustment needed, the travel available and the drive force available. It returns the load on the worst wedge, the force to drive it and to withdraw it with friction on both faces, whether it self-locks, the travel needed for the adjustment and the lift per millimetre of travel.

```figure
type: steps
title: The HW-3 base wedges in the machine levelling wedge tool
caption: This is an illustration. 1,450 kg on six wedges, 25% of the weight on the worst one, 5° wedge angle, friction 0.15 on both faces, 3 mm adjustment, 50 mm travel available, 3,000 N drive force from the screw.
- Load on the worst wedge | 3.55 kN
- Force to drive | 1,441 N against 3,000 N available
- Force to withdraw | 760 N
- Friction angle | 8.53°
- * Self-locking | 2φ = 17.06° is greater than 5°: the wedge holds: WEDGES ADEQUATE
- Travel and fineness | 34.3 mm for 3 mm of lift; 87.5 µm of lift per millimetre of travel
```

The self-locking rule is simple: a wedge with friction on both faces holds its position if twice the friction angle exceeds the wedge angle. The fineness of adjustment is the other benefit of a shallow wedge: at 5°, one millimetre of wedge travel lifts the base by less than a tenth of a millimetre.

### The mistake that did not happen: a greased steep wedge

The first wedge units offered for the HW-3 were a steeper 15° design with greased faces, chosen for their range. Run through the same tool with a friction coefficient of 0.05, they drove easily, needing 1,345 N, and gave 268 µm of lift per millimetre, but their friction angle of 2.86° doubled is well under 15°. They were not self-locking: each would need 581 N held on its screw to stop the load pushing it out, and the tool reported WEDGES NOT ADEQUATE. Under a running pump set, a wedge relying on its screw to resist that force would creep. The 5° units were chosen instead.

### Wedges under grout

Under a grouted base, the levelling wedges carry the base only until the grout has cured. After that, the grout carries it, and the wedges are either removed and their pockets filled, or left in and grouted over, depending on the base maker's and grout maker's instructions. Leaving steel wedges as hard points in a grout bed can concentrate load and cause cracks round them, so the HW-3 specification calls for the wedge screws to be backed off once the grout has reached strength, leaving the grout to carry the full load. The tool's self-locking check still mattered during the hours of grouting and curing, when vibration from nearby plant could otherwise have let the base creep down before the grout set.

## Soft foot

Soft foot is any condition in which a machine's foot does not sit firmly on its support before its bolt is tightened. When the bolt is tightened, the bolt forces the foot down and the machine's frame bends to allow it. The bend moves the shaft, changes the internal clearances of bearings and seals, and may distort a pump casing or a motor's stator. Worse, the amount of distortion depends on the order and torque of tightening, so the alignment changes every time the bolts are disturbed.

### Kinds of soft foot

```figure
type: compare
title: Kinds of soft foot and how to recognise them
cols: What it is | How it shows | Correction
rowhead: Kind
- * Parallel | foot evenly clear of its pad | feelers show the same gap all round the foot | shim by the measured gap
- Angled | foot or pad not flat or not square | feelers show a tapered gap | step shims, or machine the foot or pad
- Springing | foot or base flexes like a spring | foot lifts and springs back without a clear gap | stiffen the base, or support the foot at its bolt
- Induced | an outside force lifts or twists the machine | gap changes with pipe, conduit or coupling loads | remove the force: pipe strain is the usual cause (Chapter 4)
caption: Measurement tells soft foot is present; feelers and inspection tell which kind. Correcting the wrong kind can make it worse.
```

## Measuring soft foot on the HW-3

The site measures soft foot with a dial indicator, mounted on the base with its tip on the top of the foot, near the bolt. With all four bolts tight, the indicator is zeroed, the foot's bolt is loosened, and the indicator reads how far the foot rises. The bolt is retightened and the next foot checked. Only one bolt is loose at a time. The site's limit is 0.05 mm at any foot; that is its working figure, labelled here as an illustration.

```figure
type: compare
title: HW-3 motor soft foot, first measurement
cols: Rise when the bolt is loosened, mm | Against the 0.05 mm limit
rowhead: Foot
- Front left | 0.02 | pass
- Front right | 0.03 | pass
- * Rear left | 0.11 | soft foot
- Rear right | 0.03 | pass
caption: This is an illustration. Measured with a dial indicator on each foot in turn, the other three bolts tight. The pump's four feet read 0.02, 0.02, 0.03 and 0.01 mm.
```

The pump was sound. The motor's rear left foot rose 0.11 mm, more than twice the limit.

Feeler gauges then showed what kind of soft foot it was. With the rear left bolt loose, a 0.10 mm feeler entered under the outer edge of the foot, but only 0.04 mm entered under the inner edge, near the motor's body. The gap was tapered: angled soft foot. The foot had been slightly bent in handling, or its machined face was not square to the motor's mounting.

### Correcting it

Shimming an angled soft foot with a flat shim of the average gap leaves it rocking on one edge. The fitters made a stepped shim pack instead, from thin stainless shim stock cut to cover the outer half of the foot only, then rechecked. After correction, the rear left foot rose 0.02 mm when loosened, and all four motor feet were within 0.05 mm.

```figure
type: checklist
title: Soft foot procedure on the HW-3
caption: The site's procedure. This is an illustration.
- x Feet and pads clean: no paint, rust, burrs or old shim debris
- x All bolts tightened to the drawing torque before measuring
- x Indicator on the base, tip on the foot beside the bolt
- x One bolt loosened at a time, rise recorded, bolt retightened
- x Any foot over 0.05 mm checked with feelers for the kind of soft foot
- x Corrected, then every foot measured again
- ? Induced soft foot rechecked after pipes are connected (Chapter 4)
```

## Why a bolt always wins

It is tempting to think that a small gap under a foot does not matter, because the bolt will simply pull the foot down. That is exactly the problem. A holding-down bolt on a machine of the HW-3 motor's size is tightened to a preload of many tens of kilonewtons. The motor's frame, by comparison, is not very stiff against a single foot being pulled down: suppose, for illustration, that it takes 50 kN to push one foot down 1 mm relative to the other three. Closing the rear left foot's 0.11 mm gap would then take about 5.5 kN, a small fraction of the bolt's preload. This is an illustration. The bolt closes the gap long before it reaches its full tension, and the rest of its tension then holds the frame in its distorted shape.

So soft foot is never resisted by the bolt; it is always transferred into the machine. The question is only where the distortion goes: into the frame, the bearing housings, the stator or the pump casing. In a motor, a distorted frame can make the air gap between rotor and stator uneven, which shows up as electrical vibration at twice line frequency. In a pump, a distorted casing can close the running clearance at the wear rings or misalign the mechanical seal. None of those effects shows in a static inspection; all of them show in service.

## Soft foot with a laser system

Many laser alignment systems include a soft foot routine. With the sensors mounted on the shafts, each bolt is loosened in turn and the system measures how much the shaft centreline moves, rather than how much the foot rises. The two measurements are related but not the same: a foot can rise without moving the shaft much, if it is far from the shaft's line, and a small rise can move the shaft noticeably if the frame is flexible. Both methods find the soft foot; the dial indicator on the foot shows the gap to be shimmed, and the laser routine shows the effect on the alignment. The HW-3 site uses the indicator on the foot to find and correct the gap, and the supervisor's check, watching the alignment readings while each bolt is loosened, to confirm that nothing else is moving.

## Recording soft foot

The as-found and as-left soft foot readings for every foot go on the alignment record with the shims fitted under each foot. That record is useful at the next alignment: if a foot that was corrected becomes soft again, something has moved, such as a cracked weld in the base, a loose grout pad or a pipe pulling the machine. Without the earlier record, the change would look like a fresh installation error.

## The mistake: readings taken on a soft foot

On the first day, before anyone measured soft foot, the installer set up dial indicators and took a full set of alignment readings. Before making any moves, the supervisor asked for a simple check: loosen the rear left bolt and watch the indicators. The vertical rim reading changed by 0.07 mm. Retightening the bolt brought it back, but not quite to the same value, and a second loosening moved it again.

Readings that change when a bolt is loosened are measuring the bolt, not the alignment. Any move calculated from them would be wrong by an amount that depended on how hard the rear left bolt happened to be tightened. The set was discarded, the soft foot found and corrected, and the readings taken again; those are the as-found readings in Chapter 1. The rule the site now applies before every alignment is the supervisor's check: with indicators set up, loosen each bolt in turn, and if any reading moves by more than about 0.02 mm, find out why before going further.

## Shims and shim packs

Shims raise the movable machine's feet to correct its height and angle, and the quality of the shimming decides whether the alignment stays put.

- **Material:** pre-cut stainless steel shims, slotted to slide round the bolt, in standard thicknesses. Brass and plain steel are also used; painted, rusty or crumpled shims are not.
- **Number:** as few shims as possible under each foot, because every interface is a little spring and a little uncertainty. The site limits a pack to four shims; that is its working rule, labelled as an illustration.
- **A starting pack:** a movable machine should be installed with a few millimetres of shims already under every foot, so that it can be lowered as well as raised. The HW-3 motor was set on a 2 mm pack under each foot for that reason.
- **Size:** each shim should cover the whole foot, so that the foot is supported across its area, not on a strip.

The motor's 2 mm starting pack means it can be lowered at a future alignment as well as raised, which matters because foundations settle and machines are replaced.

## Level, soft foot and alignment together

Levelling, soft foot correction and alignment interact. Raising one foot to correct soft foot changes the level slightly; shimming for alignment adds height that may reveal a new soft foot if the shims are not flat. The HW-3 procedure therefore repeats the soft foot check after the final alignment moves, as part of the acceptance in Chapter 10. If a foot has become soft during the moves, it is corrected and the alignment re-measured.

## Exercise: a steeper wedge with dry faces

A supplier offers an 8° wedge unit with dry steel faces, friction coefficient 0.15, for the same HW-3 base. With 1,450 kg on six wedges and 25% on the worst one, find the force to drive it, the force to withdraw it, whether it self-locks, and the travel for a 3 mm lift.

**Worked answer.** The load on the worst wedge is 1,450 × 9.807 × 0.25 = 3,555 N. The friction angle is arctan 0.15 = 8.53°, so twice it is 17.06°.

The drive force is 3,555 × tan(8° + 17.06°) = 3,555 × 0.4676 = 1,662 N. The withdrawal force is 3,555 × tan(17.06° − 8°) = 3,555 × 0.1595 = 567 N. Because 17.06° is greater than 8°, the wedge self-locks. The travel for 3 mm of lift is 3 ÷ tan 8° = 21.3 mm, and the fineness is 140.5 µm per millimetre of travel. The 8° unit holds and drives within 3,000 N, but its adjustment is 60% coarser than the 5° unit's, which matters when setting a base to a few hundredths of a millimetre. This is an illustration.
