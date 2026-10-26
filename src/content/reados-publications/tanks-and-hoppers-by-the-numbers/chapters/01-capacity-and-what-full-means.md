---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: capacity-and-what-full-means
order: 1
title: "Capacity, and what full means"
description: "Define a tank's gross, working and usable capacity, keep litres, cubic metres and millimetres straight, and catch a tank sized 109 litres short because gross was mistaken for working."
draft: false
---

A tank's capacity sounds like a single number. It is at least three. The **gross** capacity is everything the tank could hold if it were filled to the brim. The **working** capacity is what it holds at its highest normal fill level, which is below the brim to leave freeboard. The **usable** capacity is what can be drawn out between that fill level and the lowest level at which the process still works. A customer who asks for "a 1,800 litre tank" usually means one of these, and the designer who assumes another can deliver a tank that is right by one definition and short by the one that mattered.

This chapter sets out the three capacities, the units they are calculated in, and the habits that keep the numbers straight from the first sketch to the nameplate. The running case calculates TK-1's capacities and finds that it was sized on gross capacity when the customer had specified working capacity.

## Three capacities

**Gross capacity** is the internal volume of the vessel up to the top of its shell, or to the underside of its lid. It is a geometric fact about the tank and the easiest number to calculate.

**Working capacity** is the volume up to the maximum normal operating level. That level sits below the top by a **freeboard**, which allows for surge when the tank is filled, splashing from an agitator, foam, thermal expansion of the contents, and the margin between the level instrument's high alarm and an overflow. The freeboard is a process decision, not a geometric one, and it should be stated with the capacity.

**Usable capacity** is the working capacity less the **heel**: the volume left below the minimum operating level, which may be set by a pump's suction, a level sensor, an outlet that sits above the bottom, or a need to keep an agitator covered. A tank with a bottom outlet and a cone may drain almost completely; one with a side outlet always keeps a heel.

```figure
type: stack
title: The three capacities of TK-1
unit: L
caption: This is an illustration. Heel below the minimum level, usable volume between minimum and maximum levels, and freeboard above the maximum level make up the gross capacity of about 1,861 L.
- Heel, below the minimum level | 12.7
- Usable, between minimum and maximum levels | 1678.5
- Freeboard, above the maximum level | 169.6
```

## Units

Capacity is usually specified in litres and calculated in cubic metres or cubic millimetres. The conversions are exact and worth writing down once:

- 1 m³ = 1,000 L;
- 1 L = 1,000,000 mm³, so volumes calculated in millimetres are divided by 10⁶ to give litres;
- 1 L of water at room temperature has a mass of very nearly 1 kg, which is a useful check but not a conversion: other liquids and all bulk solids have their own densities, which Chapter 6 uses.

Drawings in Australia are dimensioned in millimetres, so the dimensions come off the drawing in millimetres. The safest habit is to convert to metres before calculating, so that a volume comes out in cubic metres and a multiplication by 1,000 gives litres. Mixing millimetres and metres in one formula, a diameter of 1,200 with a height of 1.5, is how a tank's capacity comes out a thousand times too small.

Old drawings and imported equipment sometimes give capacities in gallons, and there are two. The imperial gallon is exactly 4.54609 L; the US gallon is exactly 3.785411784 L. A tank described as "400 gallons" holds about 1,818 L if the gallons are imperial and about 1,514 L if they are US, a difference of a fifth, so the first question about any capacity in gallons is which gallon.

## The running case: TK-1

This is an illustration. TK-1 has an internal diameter of 1,200 mm, a straight cylindrical shell 1,500 mm high and a conical bottom 400 mm deep that tapers to a 100 mm outlet. Chapters 2 and 3 derive the formulas; here they are used to show the three capacities.

- The shell holds π × 0.6² × 1.5 = **1.6965 m³**, about 1,696.5 L.
- The cone, a frustum from 1,200 mm down to 100 mm over 400 mm, holds **0.1644 m³**, about 164.4 L.
- The gross capacity is about **1,860.9 L**, from the outlet to the top of the shell.

The processor specifies a freeboard of 150 mm, so the maximum operating level is 150 mm below the top of the shell. The working capacity is the cone plus 1.35 m of shell, about **1,691.2 L**. The minimum operating level is 150 mm above the outlet, set by a level probe; the heel below it, a small frustum, holds about **12.7 L**. The usable capacity is about 1,691.2 − 12.7 = **1,678.5 L**.

```figure
type: compare
title: TK-1's capacities and the levels that define them
cols: Lower level | Upper level | Volume
caption: This is an illustration. Each capacity is the volume between two levels; stating the levels makes the capacity checkable.
- Gross | Outlet | Top of shell | 1,860.9 L
- Working | Outlet | 150 mm below top | 1,691.2 L
- *Usable | 150 mm above outlet | 150 mm below top | 1,678.5 L
- Freeboard | 150 mm below top | Top of shell | 169.6 L
```

## The error: 109 litres short

This is an illustration. The processor's enquiry asked for "1,800 L working capacity, 150 mm freeboard". The designer, working from an earlier tank, sized TK-1 so that its gross capacity, about 1,861 L, comfortably exceeded 1,800 L, and the quotation described it as "an 1,800 litre tank". At the design review, the processor's engineer asked for the working capacity. It was 1,691 L: **109 L short** of the specification.

The check that caught it was the simplest one: reading the specification's word "working" against the calculation's word "gross". The obvious fix was to lengthen the shell. Each millimetre of shell at 1,200 mm diameter holds π × 0.6² × 0.001 m³, about **1.131 L**, so the missing 109 L needed about 96 mm more shell; the exercise at the end of the chapter does the calculation exactly. The processor, whose headroom was tight, chose instead to keep the 1,500 mm shell and to run batches of 1,650 L, and the drawing was reissued with the true working capacity stated. The rest of this book uses that 1,500 mm design.

The general lesson is that every capacity on a drawing, a quotation or a nameplate should say which capacity it is and between which levels. "1,800 L" alone invites the misunderstanding; "1,800 L working, to 150 mm below top" does not.

## Freeboard and why it varies

A freeboard of 150 mm is reasonable for a small tank of water-like liquid filled at a modest rate, but the right figure depends on the process:

- **Foaming liquids** need room for the foam, which can be a large fraction of the liquid depth.
- **Agitated tanks** form a vortex and splash, and need more freeboard than still ones.
- **Heated contents** expand. Water expands by a few per cent between room temperature and boiling, and a tank filled cold to its maximum level and then heated can overflow.
- **Fast filling** produces surge and a delay between the level instrument's signal and the valve closing.

The freeboard should be agreed with whoever runs the process and recorded with the capacity, because it is the number most likely to change when the process does. It is better expressed as a height than as a percentage, because the level instrument works in height.

## Gross capacity and the drawing

The gross capacity is usually calculated from the drawing's internal dimensions. Two habits keep it right.

**Use internal dimensions.** A tank drawn with outside dimensions has a smaller internal diameter by twice the wall thickness. TK-1's 3 mm wall makes the difference between a 1,206 mm outside diameter and a 1,200 mm inside one. Calculated on the outside diameter, the gross capacity comes out at about 1,879 L instead of 1,861 L: about 1% high. For thin sheet the error is small; for thick plate and small tanks it is not, and it is always in the direction that flatters the tank.

**Include every part of the volume.** A tank's volume is the sum of its shell, its bottom and anything in its top, less anything inside it: an agitator shaft, internal coils, baffles. For TK-1 the internals are small, but a tank with heating coils can lose a noticeable part of its volume to them.

## What full means for a hopper

A hopper of powder or granules is "full" in a different way from a tank of liquid. A liquid finds a level surface; a bulk solid poured from above forms a heap, whose sides slope at the material's **angle of repose**, and a hopper filled from a central chute can hold more than its level-full volume, or less if it is filled from one side and the heap never reaches the far corners.

This is an illustration. HP-400's level-full volume, the pyramid frustum of Chapter 3 plus its 300 mm straight upstand, is about **0.694 m³**. Filled centrally with a powder whose angle of repose is taken as 35°, the heap above the 1,000 × 1,000 mm top is a square pyramid of height 0.5 × tan 35° = about 0.350 m, which holds 1.0 × 1.0 × 0.350 ÷ 3 = about **0.117 m³**. Heaped full, the hopper holds about 0.810 m³, some 17% more than level full.

```figure
type: bars
title: HP-400's capacity, by what full means
unit: m³
max: 1
caption: This is an illustration with an angle of repose of 35°. The heap adds about 17% to the level-full volume; filling from one side can lose some of the level-full volume instead.
- Level full, frustum plus upstand | 0.694
- *Heaped full, central fill | 0.810
```

Which figure to use depends on how the hopper is filled and what it must do. A hopper that must never overflow should be sized on its level-full volume with the heap allowed as margin; one whose capacity is guaranteed to a customer should state whether it is level or heaped, and at what angle of repose. The angle itself is a property of the material, measured by the customer or the supplier of the material, not a number to assume.

## Nominal capacity

Many tanks are sold by a **nominal** capacity, a round number that describes the tank's size class. A "2,000 L" tank may have a gross capacity a little more than 2,000 L and a working capacity a little less. Nominal capacities are useful for catalogues and dangerous to design with. If a customer specifies a nominal size, the first question is which real capacity they need, and the second is the freeboard and heel that define it.

## Capacity by measurement

A calculated capacity should be checked by measurement when the tank is made, and the easiest measurement is a water fill: fill the tank from a water meter, in stages, and record the level at each stage. The fill checks the gross capacity and, read in stages, gives the level-to-volume table of Chapter 5. It also tests the tank for leaks, which is usually required anyway. A fill that differs from the calculation by more than a percent or two points to a dimension that is not what the drawing says, such as a cone that was rolled shallower than drawn.

The water meter itself should be one whose accuracy is known; a garden hose and a stopwatch will not check a tank to a percent. Many fabricators fill through a calibrated meter or from a vessel of known volume, and record the water temperature, since water's volume changes slightly with it.

## Capacity and cost

Capacity drives cost through sheet area and weld length, which grow more slowly than volume as a tank gets bigger. Doubling every dimension of a tank multiplies its volume by eight but its surface, and so roughly its sheet and welding, by four. Small tanks are expensive per litre for this reason, and a customer who needs "about 1,800 L" may find that the next standard size up costs little more. Chapter 7 calculates TK-1's sheet; the point here is that capacity and cost should be discussed together, early, and with the real capacity the customer needs.

## Recording capacity on the drawing

TK-1's fabricator, after the shortfall above, put a capacity block on every tank drawing. For TK-1 it reads:

- **Gross**: 1,860.9 L, outlet to top of shell;
- **Working**: 1,691.2 L, to 150 mm below top of shell;
- **Usable**: 1,678.5 L, from 150 mm above outlet to the maximum level;
- **Basis**: internal dimensions, no deduction for internals.

The block takes a few minutes to complete and removes the commonest argument about a tank, because everyone reading the drawing can see which number is which.

## Exercise: lengthening the shell

The processor needs 1,800 L of working capacity with 150 mm of freeboard. Keeping TK-1's internal diameter of 1,200 mm and its 400 mm cone, how tall must the straight shell be? How much does the gross capacity become?

**Worked answer.** The cone holds 0.1644 m³ whatever the shell height. The shell must hold the rest of the working capacity below the maximum level: 1.800 − 0.1644 = 1.6356 m³. At a cross-sectional area of π × 0.6² = 1.1310 m², that needs a liquid height in the shell of 1.6356 ÷ 1.1310 = **1.4462 m**. Adding the 150 mm freeboard, the shell must be about **1,596 mm** tall, which the fabricator would round up to 1,600 mm.

With a 1,600 mm shell, the gross capacity is 1.1310 × 1.600 + 0.1644 = about **1,974 L**, and the working capacity, to 150 mm below the top, is 1.1310 × 1.450 + 0.1644 = about **1,804 L**, just over the 1,800 L specified. The extra 100 mm of shell is the 96 mm the shortfall needed, rounded to a dimension the workshop can roll and check easily.
