---
book: clutches-and-brakes-by-the-numbers
chapterSlug: plate-clutch-capacity
order: 3
title: "Plate clutch capacity"
description: "How a plate clutch carries torque: the uniform-wear and uniform-pressure models, friction radius, faces, spring force and lining pressure, checked against the torque the drive needs."
draft: false
---

A plate clutch is the simplest friction device to analyse and the most common in machinery. Flat annular linings are pressed together by springs, and the torque they carry is the friction force times the radius at which it acts, added up over every face that slips. The design questions are how much force, how many faces and what size of lining, and the answers depend on one modelling choice that this chapter explains: whether the pressure is spread evenly or the wear is.

The chapter sizes the SW-25's clutch on the gearbox output shaft with the BIZOMAT plate clutch and disc brake torque tool, checks it against the friction range from Chapter 2, and follows its capacity as the plates wear. Its mistake is a miscount of friction faces in a supplier's quotation.

## Torque from a ring of friction

Take a thin ring of lining at radius r, of width dr. If the pressure on it is p, the normal force on the ring is p × 2πr dr, the friction force is μ times that, and its torque about the axis is that force times r. The clutch's torque is the sum over all the rings from the inner radius Ri to the outer radius Ro, multiplied by the number of faces that slip.

What that sum gives depends on how the pressure is distributed, and that depends on the clutch's history.

### Two models

When linings are new and the plates are flat and stiff, the pressure is roughly the same everywhere: the uniform-pressure model. But the outer part of each ring moves faster than the inner part, so if the pressure is uniform, the outer part wears faster. After a short bedding-in, the plates wear until the wear is the same everywhere. Because wear is roughly proportional to pressure times rubbing speed, and rubbing speed is proportional to radius, uniform wear means p × r is constant: the pressure is highest at the inner radius and lowest at the outer.

```figure
type: formula
title: Plate clutch torque, the two models
formula: Uniform wear: T = μ F n (Ro + Ri) ÷ 2
formula: Uniform pressure: T = (2 ÷ 3) μ F n (Ro³ − Ri³) ÷ (Ro² − Ri²)
formula: Peak pressure, uniform wear: p max = F ÷ (2π Ri (Ro − Ri))
caption: F is the axial clamp force, n the number of friction faces that slip, μ the friction coefficient. Each formula is μ F n times an effective friction radius: the mean radius for uniform wear, a slightly larger radius for uniform pressure. Under uniform wear the largest pressure is at the inner radius.
- F | axial clamp force from the springs, N
- n | number of friction faces
- Ro, Ri | outer and inner radius of the lining
```

The uniform-wear model gives slightly less torque for the same force, because it moves pressure towards the inner radius where the lever arm is smaller. Designers use it for a clutch's working capacity because it describes a clutch that has bedded in, and because it is the conservative of the two. The uniform-pressure figure describes a new clutch and is useful for the highest torque a new clutch could pass.

## Sizing the SW-25's clutch

Chapter 1 gave the torque on the clutch shaft while hauling: 354.5 N·m. The yard applies a service factor of 1.5 to cover shock as the rope tightens and variation in the load, so the clutch must carry 531.7 N·m without slipping. This is an illustration; service factors come from the clutch maker's tables for the type of driven machine.

The clutch chosen is a dry, spring-applied unit with two driven plates, giving four friction faces, linings of 300 mm outer and 180 mm inner diameter, and springs giving 4,500 N of clamp force when new.

The [plate clutch and disc brake torque tool](/tools/clutch-torque/) takes the outer and inner diameters of the lining, the number of friction surfaces, the friction coefficient, the clamp force and the required torque including the service factor. It returns the torque by the uniform-wear model, the torque by the uniform-pressure model, the peak lining pressure at the inner diameter and the ratio of capacity to requirement, with a verdict on the uniform-wear capacity. It treats the linings as flat annuli and does not check heat or wear; the tool reminds the user to compare pressure and energy with the lining maker's limits.

```figure
type: steps
title: The SW-25 clutch in the plate clutch torque tool
caption: This is an illustration. Linings 300 × 180 mm, four friction faces, μ = 0.30, clamp force 4,500 N, required torque 531.7 N·m with a service factor of 1.5.
- Torque, uniform wear | 648.0 N·m
- Torque, uniform pressure | 661.5 N·m
- Peak lining pressure | 0.133 MPa
- * Capacity ÷ required | 1.22: CAPACITY SUFFICIENT
```

The effective friction radius under uniform wear is the mean radius, (150 + 90) ÷ 2 = 120 mm; under uniform pressure it is 122.5 mm, which is why the two torques differ by only 2%. For a ring as narrow as this one, the choice of model hardly matters. For a wide ring it matters more.

### Checking the friction range

Chapter 2 set out the lining maker's range of 0.25 to 0.40 for the clutch. At the low end the capacity is 540 N·m, still 1.02 times the requirement; the clutch holds even with the least friction expected. At the high end the clutch will pass 864 N·m before it slips. The open gear pinion, its key and the gearbox output shaft were checked for 864 N·m, a third more than the clutch's nominal capacity.

```figure
type: bars
title: SW-25 clutch capacity across the friction range
x: Condition
y: Torque, N·m
caption: This is an illustration. Uniform wear, four faces, 4,500 N. The required torque is 531.7 N·m with the service factor. The clutch protects the drive only up to its slipping torque, so the parts behind it must carry the highest of these.
- μ 0.25, least friction | 540.0
- * μ 0.30, design | 648.0
- μ 0.40, most friction | 864.0
- Required with service factor | 531.7
```

## Why the inner diameter is 180 mm

For a given outer diameter and a lining's pressure limit, there is an inner diameter that gives the most torque. Under uniform wear, the torque for a given peak pressure is proportional to Ri (Ro² − Ri²). A larger inner radius gives a bigger lever arm but less lining area; a smaller one gives more area but at a smaller radius, where the peak pressure sits. The product is greatest when Ri = Ro ÷ √3, about 0.577 Ro.

For the SW-25's 300 mm linings that is an inner diameter of 173 mm. At the same peak pressure of 0.133 MPa, linings with a 180 mm inner diameter carry 647.9 N·m, those with the optimum 173 mm would carry 649.4 N·m, and those with 120 mm or 240 mm would carry 566.9 N·m and 485.9 N·m. The optimum is flat: inner diameters between about 0.55 and 0.65 of the outer diameter all perform within a percent or two of it, which is why clutch makers' proportions sit in that range.

```figure
type: compare
title: Torque for the same peak pressure, by inner diameter
cols: Inner ÷ outer | Torque at 0.133 MPa peak
rowhead: Inner diameter
- 120 mm | 0.40 | 566.9 N·m
- 173 mm | 0.58 | 649.4 N·m
- * 180 mm | 0.60 | 647.9 N·m
- 240 mm | 0.80 | 485.9 N·m
caption: This is an illustration. Outer diameter 300 mm, four faces, μ = 0.30, uniform wear. The torque is π p max Ri μ (Ro² − Ri²) n, which peaks where Ri = Ro ÷ √3.
```

## Applying and releasing the clamp force

A spring-applied clutch is engaged by its springs and released by pulling the pressure plate back against them. Whatever operates it, a hand lever, a pneumatic cylinder or a hydraulic piston, must therefore overcome the full spring force plus a margin to compress the springs a little further and open a clearance between the plates. On the SW-25 that is at least 4,500 N through a release bearing on a rotating shaft, held for as long as the clutch is out. A hand lever with a 10:1 ratio needs more than 450 N at its handle, which is too much to hold for a ten-minute lowering, so the yard's clutch is released by a small pneumatic cylinder and engaged by its springs when the air is let out.

That arrangement has a useful property: if the air supply fails, the clutch engages. On a winch where the band brake controls a lowering with the clutch out, the operator must know that loss of air will connect the drum, after a brief slip of the clutch, to the stopped gearbox and motor, whose spring-applied brake then holds the load. The yard's operating instruction states it plainly.

## Wear and spring force

A spring-applied clutch loses clamp force as its plates wear, because the springs extend by the amount of wear. The SW-25's springs have a combined rate of 300 N per millimetre. After 1.5 mm of total wear across the plate pack, the clamp force falls by 450 N, to 4,050 N, and the capacity by the same proportion: to 583.2 N·m at μ = 0.30, or 486.0 N·m at the low friction value. At that point the clutch could slip on a bad day.

That is why the yard measures the spring force, or the clearance it depends on, at every annual service. Some clutches have an adjuster that restores the spring length after wear; others are designed to be replaced at a stated wear. Either way the clutch's capacity is a maintenance item, not a fixed property.

```figure
type: checklist
title: Plate clutch acceptance on the SW-25
caption: This is an illustration.
- x Faces counted from the drawing: two driven plates, four lined faces
- x Capacity at the least friction expected at or above the required torque
- x Parts behind the clutch checked for the torque at the most friction expected
- x Peak lining pressure within the lining maker's limit
- x Spring force at the worn limit recorded, with the capacity it gives
- x Seals between the gearbox and the clutch housing inspected for oil
- ? Heat of engagement (Chapter 4)
```

## Where the clutch sits

The SW-25's clutch could have been put on the motor shaft, between the motor and the gearbox, instead of on the gearbox output. There it would carry the motor's hauling torque of 18.85 N·m, or 28.3 N·m with the service factor: a nineteenth of the torque on the gearbox output shaft. A single-plate clutch with 200 × 120 mm linings would need only 589 N of clamp force. Small clutches on fast shafts are cheaper, lighter and easier to operate, which is why vehicles put their clutch between the engine and the gearbox.

The yard chose the slower shaft for three reasons, each of which comes from the duty, not from the clutch.

First, the purpose of the SW-25's clutch is to let the drum run free while the band brake controls a lowering. With the clutch on the gearbox output, declutching leaves only the open gears and drum connected to the rope. With the clutch on the motor shaft, the gearbox would stay connected to the drum and would have to be driven backwards by the load, through its own losses, at a speed the gearbox was never meant to run at.

Second, the inertia. The motor, brake disc, coupling and gearbox together have about 0.0406 kg·m² at 1,450 rpm. Seen from the drum, through the ratio of 450 squared, that is 0.0406 × 450² = 8,222 kg·m², more than three times the 2,275 kg·m² of the boat, cradle and drum. If the motor stayed connected during a lowering, the band brake would have to stop all of it.

Third, speed. Lowering at 10 m/min turns the drum at 5.3 rpm. If the clutch were still engaged, the motor would be driven at 1,450 × 5.305 ÷ 3.222 = 2,387 rpm, well beyond its rated speed. Declutching keeps the motor out of a lowering altogether.

```figure
type: compare
title: Two places for the SW-25's clutch
cols: Clutch on the motor shaft | Clutch on the gearbox output
rowhead: Question
- Torque to carry, with service factor | 28.3 N·m | 531.7 N·m
- Clutch size | Small single plate | Two plates, 300 mm linings
- Drum free for lowering | Gearbox still connected | * Only open gears and drum connected
- Inertia the band brake must stop | Includes about 8,222 kg·m² of motor and gearbox at the drum | * 2,275 kg·m²
- Motor speed when lowering at 10 m/min | 2,387 rpm unless restrained | * Motor stopped
caption: This is an illustration. The faster shaft needs a smaller clutch; the duty decides where it must go.
```

The general rule is that a clutch should sit where it separates the parts that must be separated, and then be sized for the torque on that shaft. Putting a clutch on a fast shaft to save size is sound only when that position does the clutch's job. Chapter 4 adds a further reason to think about the shaft: the heat of an engagement grows with the speed difference across the clutch.

## Oil on the plates

The worst case for a dry clutch is not worn linings but wet ones. The SW-25's clutch sits beside the gearbox output seal, and gear oil on the plates could drop the friction coefficient to something near the 0.08 of an oil-immersed clutch. At 0.08 the capacity would be 172.8 N·m, half of the hauling torque without any service factor: the clutch would slip as soon as the rope took the load. That is safe in one sense, because the boat would not move, but a slipping clutch on a hauling winch quickly overheats, and an operator who finds the winch will not haul may be tempted to try harder. The yard fitted a drain hole and a shield, and added the seal to the daily check.

## The mistake: four faces or two?

When the yard first sought quotations, one supplier offered a clutch "with 300 mm linings, 4,500 N springs, rated 648 N·m". The yard's engineer entered it in the tool with four faces and accepted the rating. A second check of the drawing showed a single driven plate, lined on both sides and running between the flywheel and the pressure plate. That is two friction faces, not four. Its capacity at μ = 0.30 is 324 N·m, below the 354.5 N·m needed to haul at all, before any service factor.

The rating in the quotation had been taken from a two-plate version of the same clutch. The error was found because the engineer's method required counting faces from the drawing, not from the description: a face counts only if it is a surface where slip occurs, with friction material on one side and a mating plate on the other. A single plate between two pressure surfaces has two; each extra driven plate, with its intermediate pressure plate, adds two more.

## Exercise: a single-plate clutch for a conveyor

**Problem.** A conveyor drive needs 280 N·m of clutch capacity including its service factor. A single-plate dry clutch has two friction faces, linings of 280 mm outer and 170 mm inner diameter, μ = 0.30 and a clamp force of 6,000 N. Find (a) the capacity by uniform wear and uniform pressure, (b) the peak lining pressure, (c) the capacity ratio, and (d) the least clamp force that would still meet the requirement.

**Answer.** (a) Mean radius = (140 + 85) ÷ 2 = 112.5 mm. Uniform wear: T = 0.30 × 6,000 × 2 × 0.1125 = 405.0 N·m. Uniform pressure: (2 ÷ 3) × 0.30 × 6,000 × 2 × (0.14³ − 0.085³) ÷ (0.14² − 0.085²) = 413.1 N·m.

(b) p max = 6,000 ÷ (2π × 85 × 55) = 0.204 MPa, at the inner diameter.

(c) 405.0 ÷ 280 = 1.45: capacity sufficient.

(d) F = 280 ÷ (0.30 × 2 × 0.1125) = 4,148 N.

**The check.** Entering the same clutch with four faces would give 810 N·m and hide the fact that the margin depends on just two surfaces. Count the faces from the drawing.
