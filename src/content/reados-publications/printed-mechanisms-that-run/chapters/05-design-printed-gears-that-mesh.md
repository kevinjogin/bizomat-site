---
book: printed-mechanisms-that-run
chapterSlug: design-printed-gears-that-mesh
order: 5
title: "Design printed gears that mesh"
description: "Choose module and tooth counts a printer can make, lay out a planetary stage that assembles, check tooth bending against measured coupon strength and add the backlash printing needs."
draft: false
---

Printed gears have a reputation for being noisy, loose and short-lived. Much of that reputation comes from gears that were drawn rather than designed: a gear-shaped outline downloaded or sketched, printed at whatever size fitted, and meshed at the theoretical centre distance with no allowance for how printed teeth actually come out. Designed properly, printed gears are quiet enough, accurate enough and strong enough for light-duty mechanisms like the indexing table.

This chapter designs the table's 5:1 planetary stage. It covers module and tooth count, the layout rules that make a planetary assemble, a tooth-bending check against strength measured on the same printer, and the backlash and assembly marks that printed gears need. It assumes the involute basics covered in the Library book [Gears by the Numbers](/reados/publications/gears-by-the-numbers/module-pitch-and-gear-sizes/).

## Choose a module the printer can make

The module sets the size of the teeth. For a spur gear, the pitch diameter is the module times the number of teeth, and the tooth thickness at the pitch circle is about π × m ÷ 2. The printer has to lay down that tooth with a nozzle of fixed width.

```figure
type: compare
title: Tooth size against a 0.4 mm nozzle
cols: Tooth thickness at pitch circle | Nozzle widths across the tooth
caption: Below about three nozzle widths, the tooth is made mostly of outline and its shape becomes approximate. Module 1 is a practical lower limit for strong printed gears with a 0.4 mm nozzle.
- Module 0.8 | about 1.26 mm | about 3.1
- *Module 1.0 | about 1.57 mm | about 3.9
- Module 1.5 | about 2.36 mm | about 5.9
- Module 2.0 | about 3.14 mm | about 7.9
```

At module 1, a tooth is about 3.9 nozzle widths thick at its pitch circle, and much thinner at its tip. The slicer builds it from a few outline passes. The involute flank is approximated reasonably well, and the tooth is nearly solid, which Chapter 2 noted is good for strength. Smaller modules are possible with finer nozzles, but the tooth shape degrades quickly with a standard 0.4 mm nozzle. Larger modules make stronger, more accurate teeth at the cost of larger gears.

This is an illustration. The table uses module 1, which keeps the gearbox compact enough to sit under the dial while giving teeth the printer can form well.

## Lay out the planetary stage

A simple planetary stage has a central sun gear, several planet gears around it on a carrier, and an internal ring gear around them. With the ring held still, driving the sun turns the carrier slowly in the same direction. Three geometric rules decide whether a chosen set of tooth counts works.

```figure
type: formula
title: Rules for a simple planetary stage
formula: Ring = Sun + 2 × Planet; ratio = 1 + Ring ÷ Sun
caption: This is an illustration for the indexing table. All three rules must hold, or the gears will not fit or will not assemble.
- Sun | 12 teeth, pitch diameter 12 mm
- Planet | 18 teeth, pitch diameter 18 mm
- Ring | 12 + 2 × 18 = 48 teeth, pitch diameter 48 mm
step: Ratio, sun in, carrier out, ring fixed: 1 + 48 ÷ 12 = 5
step: Equal spacing: (12 + 48) ÷ 3 planets = 20, a whole number, so three equally spaced planets assemble
step: Neighbours: planet centres 2 × 15 × sin 60° ≈ 25.98 mm apart; planet tip diameter 20 mm; gap about 5.98 mm
```

The first rule makes the planets fit between sun and ring: the ring's tooth count must equal the sun's plus twice the planet's. The second, sometimes called the assembly condition, makes equally spaced planets mesh with both sun and ring at the same time: the sum of sun and ring teeth must divide evenly by the number of planets. The third makes sure neighbouring planets do not collide: the distance between planet centres must exceed a planet's tip diameter with some room to spare.

The sun-to-planet centre distance is m × (12 + 18) ÷ 2 = 15 mm. With three planets, their centres are 120° apart on that 15 mm radius, so neighbouring centres are about 25.98 mm apart. Each planet's tip diameter is (18 + 2) × 1 = 20 mm, leaving nearly 6 mm between neighbours, plenty of room for the carrier's pins and for printing tolerance.

The [planetary gear](/tools/planetary-gear/) tool in KEVOS® Tools checks ratios and assembly conditions for other tooth counts.

## Face the undercut honestly

A 12-tooth sun is smaller than ideal. For standard full-depth teeth at a 20° pressure angle, the cutting process used to define the involute profile removes material from the tooth root of any gear with fewer than about 17 teeth, a condition called undercut. The theoretical limit is 2 ÷ sin²(20°) ≈ 17.1 teeth. An undercut tooth has a thinner root and is weaker in bending, and part of its flank is not a true involute.

There are standard remedies. The most common is a positive profile shift on the small gear, which moves its teeth outwards and thickens the root, with matching adjustments elsewhere in the train. The Library chapter on [undercut and profile shift](/reados/publications/gears-by-the-numbers/undercut-and-profile-shift/) covers the method. Another is simply to use more teeth on the sun, which changes the ratio.

This is an illustration. The designer accepted a standard 12-tooth sun with its generated undercut, because the gearbox is lightly loaded and the stress check below uses a form factor for 12 teeth that reflects the weak root. The decision is recorded in the design notes with the remedy, should the soak test show sun-tooth wear: a profile-shifted sun or a 15-tooth sun with a revised train.

## Check tooth bending with stated assumptions

The Lewis equation, a classical starting point for gear tooth bending, treats each tooth as a short cantilever loaded at its tip. In SI units, the bending stress is the tangential force divided by the product of face width, module and a form factor Y that depends on the tooth count. The form factors used here come from Shigley's tables for 20° full-depth teeth: 0.245 for 12 teeth and 0.309 for 18 teeth.

This is an illustration. The motor's rated torque on the sun is 0.15 N·m, and the sun's pitch radius is 6 mm, so the total tangential force at the sun's pitch circle is **0.15 ÷ 0.006 = 25 N**. That force is shared between three planets, about 8.33 N each if shared equally. Printed planets never share perfectly, so the check assumes the most heavily loaded planet carries 1.5 times its equal share, **12.5 N**. The face width is 8 mm.

```figure
type: formula
title: Lewis bending check on the 12-tooth sun
formula: σ = F ÷ (b × m × Y)
caption: This is an illustration. The load-sharing factor of 1.5 is an assumption, not a measured value. Planet teeth, with Y = 0.309, see about 21% less stress than the sun's.
- σ | bending stress at the tooth root, MPa
- F | tangential force on one tooth, N
- b | face width, 8 mm
- m | module, 1 mm
- Y | Lewis form factor, 0.245 for 12 teeth
step: Rated: σ = 12.5 ÷ (8 × 1 × 0.245) ≈ 6.4 MPa
step: Stall, three times the torque: σ ≈ 19.1 MPa
```

A stress means nothing without a strength to compare it with. Printed material strength depends on the printer, settings and orientation, so the designer used the PETG coupons from Chapter 2. The flat coupons broke at an average of 182 N over a 40 mm span with a 10 mm by 4 mm section. The bending stress at break is 3 × F × L ÷ (2 × b × h²) = 3 × 182 × 40 ÷ (2 × 10 × 4²) **≈ 68 MPa**. The gear teeth are printed flat, so their bending acts in the same strong direction as the flat coupons.

Repeated loading is far more demanding than a single break. Polymers lose much of their strength under cyclic load, and the sun's teeth face about 1.8 million load cycles over the table's life. Without fatigue data for this printed material, the designer adopted a working limit of a quarter of the coupon strength, **about 17 MPa**, as a teaching assumption to be confirmed by a soak test.

```figure
type: bars
title: Sun tooth stress against the coupon strength and working limit
unit: MPa
max: 70
caption: This is an illustration. Rated running sits well inside the working limit; the stall case exceeds it slightly and is limited in time by the drive's current limit in Chapter 8.
- Rated running | 6.4
- *Stall | 19.1
- Working limit, a quarter of coupon strength | 17.1
- Single-break coupon strength | 68.3
```

Rated running, at 6.4 MPa, is well within the working limit. The stall case, at 19.1 MPa, exceeds it a little but remains less than a third of the single-break strength. Because a stall is rare and brief, especially once Chapter 8 adds a current limit and a jam detector, the designer accepted it. The [Lewis bending](/tools/lewis-bending/) and [plastic gear power](/tools/plastic-gear-power/) tools in KEVOS® Tools run the same kind of check for other cases.

Be clear about what this check is. The Lewis equation ignores stress concentration at the root, dynamic effects, the undercut's exact shape and the true load distribution across an imperfectly printed face. The coupon strength is from a crude rig. The working limit is an assumption. Together they give a reasonable screening of whether the gears are in the right range, which the soak test in Chapter 9 then confirms or refutes.

## Add the backlash printing needs

Machined gears are meshed at their theoretical centre distance with a small, controlled backlash built into the tooth thickness. Printed gears need more. Their teeth tend to come out slightly fat because of line spreading, a seam blob may sit on a flank, and two parts printed on different days may differ slightly in size. Meshed at exactly the theoretical centre distance, printed gears often bind at one point in every revolution.

The simplest remedy is to increase the centre distance a little. Increasing it by Δa opens up a circumferential backlash of about 2 × Δa × tan(pressure angle).

This is an illustration. Coupon gear pairs printed at several centre distances showed that an increase of 0.15 mm ran smoothly without noticeable play. That increase corresponds to a backlash of about **2 × 0.15 × tan 20° ≈ 0.11 mm**.

A planetary stage complicates the remedy. Moving the planets outwards opens the sun-to-planet mesh but closes the planet-to-ring mesh by the same amount, because the ring is outside the planets. So instead of moving any centres, the designer kept the 15 mm centre distance and generated the planet teeth slightly thinner, with a 0.11 mm backlash allowance set in the gear tool. Thinner planet teeth open both meshes equally, and every centre stays where the layout rules put it.

Backlash costs a little positional accuracy, because the output can move slightly before the input does. At the Geneva driver, which turns 60° of dial for every 120° of its own motion during the index and locks the dial during the dwell, a small backlash in the gearbox does not affect station position. That is one reason the Geneva is a good partner for printed gears.

## Print and finish the gears with care

The gear's geometry is only half the story; how it prints decides whether that geometry survives. The table's gears print flat, as Chapter 2 decided, at 0.12 mm layers with three walls. The slicer is set to place each layer's seam at a tooth tip rather than on a flank, where a seam blob would interfere with the mesh. Each gear has a 0.3 mm chamfer on the tooth tips at both faces, which removes the first-layer flare at the bottom and any curl at the top, and stops the edges of meshing teeth catching on each other.

Resist the urge to sand the tooth flanks. Sanding by hand removes material unevenly and destroys the involute shape that the generator produced. If a mesh is tight, fix the backlash allowance or the print settings and reprint; a printed gear is cheap. A short run-in, a few minutes at low speed with a little dry PTFE lubricant or a plastic-compatible grease, smooths the flanks evenly and is far better than abrasive finishing.

## Make the gears assemble only one way

A planetary stage can be assembled wrongly. Each planet must sit in a particular rotational position relative to the sun and ring, or the teeth will not engage all at once. If the tooth counts satisfy the assembly condition, there is a correct position for each planet, but a builder pushing planets in at random can end up one tooth out on one planet, which forces the carrier slightly out of position and makes the gears bind once per revolution.

Three design features prevent this:

1. **Timing marks.** A small notch or embossed dot on one tooth of each planet, and matching marks on the sun and ring, show the correct engagement.
2. **Numbered planets and pins.** Embossing 1, 2 and 3 on the planets and beside the matching carrier pins tells the builder which goes where, which matters if the planets are not identical, for instance after one has been reprinted.
3. **A check after assembly.** Turning the sun by hand through several full revolutions should feel smooth everywhere. A tight spot that recurs at the same carrier position means one planet is out of time.

## Detect a binding mesh

This is an illustration. The first gearbox prototype had planets in PLA meshed at the theoretical centre distance with no backlash allowance. It ran, but the motor's current, measured with a simple inline meter, rose from about 0.35 A to about 0.62 A once per carrier revolution, roughly 1.8 times higher, and the motor audibly slowed at the same point.

Two causes were found. The planet teeth were slightly fat, as expected without a backlash allowance, and one planet's seam had been placed on a tooth flank, leaving a small blob. Reprinting the planets in PETG with the 0.11 mm backlash allowance, and setting the slicer to place seams at the tooth tips, removed the tight spot. The current then varied only between about 0.34 and 0.37 A around the revolution.

The detection method, measuring current around a full revolution, is cheap and sensitive. Chapter 9 makes it a standard check in the build guide.

## Exercise: scale up the module

A colleague suggests using module 1.5 with the same tooth counts, to make the teeth stronger. What happens to the sun's rated tooth stress and to the size of the ring?

**Worked answer.** At module 1.5, the sun's pitch diameter becomes 18 mm, so its pitch radius is 9 mm. The total tangential force at rated torque falls to **0.15 ÷ 0.009 ≈ 16.7 N**, or about 8.33 N on the most loaded planet with the 1.5 sharing factor. The bending stress becomes 8.33 ÷ (8 × 1.5 × 0.245) **≈ 2.8 MPa**, less than half the module 1 value, and the stall case falls to about 8.5 MPa, comfortably below the working limit.

The cost is size. The ring's pitch diameter grows from 48 mm to **48 × 1.5 = 72 mm**, and the housing around it grows accordingly. If the gearbox still fits under the dial, the larger module is a sensible upgrade; if not, a wider face, a stronger material or a profile-shifted sun may be better ways to add margin.
