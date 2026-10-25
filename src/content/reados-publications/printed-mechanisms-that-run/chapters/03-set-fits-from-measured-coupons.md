---
book: printed-mechanisms-that-run
chapterSlug: set-fits-from-measured-coupons
order: 3
title: "Set fits from measured coupons"
description: "Print calibration coupons, measure how holes and shafts really come out, and turn the results into named CAD offsets for press, slip and running fits."
draft: false
---

Every desktop printer has a personality. Holes come out a little small, outside dimensions a little large, and the exact amounts depend on the material, the settings, the machine and even the room. Advice found online, such as "add 0.2 mm to every hole", is a reasonable starting point and a poor finishing point. It describes someone else's printer.

The reliable approach is to measure your own. A few small calibration coupons, printed with the same material, settings and orientation as the real parts, show exactly how features come out. Those measurements become named offsets in the CAD model, so every fit in the mechanism is designed from evidence. This chapter does that for the indexing table's bearing bores, shaft holes and locating features.

## Understand why printed sizes differ from CAD

Several effects push printed sizes away from their nominal values, and they do not all act the same way.

- **Line placement.** The slicer places the outer wall's centre line half a line width inside the part's boundary, but the extruded plastic spreads slightly beyond its nominal width, especially at corners and on curves.
- **Shrinkage.** Plastic contracts as it cools. A hole's material shrinks inwards towards the centre of the material around it, which tends to make holes smaller.
- **Tessellation.** Many workflows export parts as triangle meshes. A circle becomes a polygon, and a polygon inscribed in a circle is smaller across its flats.
- **Seams and blobs.** Each layer starts and stops somewhere, and that point often leaves a small bump that can catch on a mating part.
- **First layers.** As Chapter 2 described, the bottom layers flare outwards.

The combined result on most machines is that **holes print undersize and bosses print oversize**, by amounts that are consistent for a given setup. Consistency is the useful property. A printer that makes every 22 mm hole 0.18 mm small is easy to design for; one that varies by 0.2 mm from print to print is not.

## Check the export first

Tessellation is the one effect that can be removed rather than compensated. When a circle is exported as a polygon with N straight sides, the distance across the flats is smaller than the true diameter by **2r(1 − cos(π ÷ N))**.

```figure
type: bars
title: Diameter lost across the flats of a 22 mm hole, by mesh resolution
unit: mm
max: 0.09
caption: Calculated for a polygon inscribed in a 22 mm circle. Coarse export settings can add a hidden undersize of nearly a tenth of a millimetre.
- *36 segments | 0.084
- 72 segments | 0.021
- 128 segments | 0.007
```

A 22 mm bearing bore exported with 36 segments loses about 0.08 mm across its flats, almost half the total undersize this chapter measures. Export at a fine resolution, or use a format the slicer can read as true curves where one is available. Then set the export settings once, record them and keep them, because changing them later changes every fit.

## Design the coupons

A coupon is a small test print that isolates one kind of feature across a range of sizes. Good coupons are quick to print, use the same material and settings as the real part, and have the feature in the same orientation.

This is an illustration. The table needs three kinds of fit, so the designer printed three coupons:

1. **Bearing bore strip.** A flat bar, 6 mm thick, with five holes designed at 21.8, 21.9, 22.0, 22.1 and 22.2 mm, axis vertical, each labelled by a number embossed beside it. It tests the press and slip fits for 608 bearings, whose outside diameter is 22 mm.
2. **Shaft hole strip.** The same idea with holes at 8.0, 8.2, 8.3 and 8.4 mm, for the 8 mm steel shafts and pins.
3. **Peg and socket pair.** A plate with square sockets and a matching plate with pegs at a range of clearances, for the printed dowel bosses that locate the frame's side plates.

Each coupon was printed three times, on different days, from the same project file. Each hole was measured with calipers at two angles 90° apart, and the smaller reading kept, because the tighter direction is the one that matters for a fit.

## Read the bearing bore results

This is an illustration. The bearing bore strip gave consistent results across the three prints:

```figure
type: compare
title: Bearing bore coupon, PLA, axis vertical, three prints
cols: Designed | Measured, mean | Fit with a 22.00 mm bearing
caption: This is an illustration. Every hole printed about 0.17 to 0.19 mm undersize, and the three prints agreed within about ±0.03 mm.
- Hole 1 | 21.80 mm | 21.62 mm | 0.38 mm interference: bearing would not enter
- Hole 2 | 21.90 mm | 21.71 mm | 0.29 mm interference: forced, plate cracked
- Hole 3 | 22.00 mm | 21.83 mm | 0.17 mm interference: very tight
- *Hole 4 | 22.10 mm | 21.92 mm | 0.08 mm interference: firm press in a vice
- Hole 5 | 22.20 mm | 22.03 mm | 0.03 mm clearance: bearing slips in
```

Bearings are made to tight tolerances, and the outside diameter of a standard 608 is within about a hundredth of a millimetre of 22.00 mm. That precision makes the bearing a useful gauge: pressing it into each hole is a direct, practical test of the fit.

The designer chose **22.1 mm** for bearings that should be pressed in and stay, giving about 0.08 mm of interference after printing. Pressed in with a bench vice and two flat blocks, the bearing seated squarely with firm pressure and could not be pushed out by hand. For a bearing that must be removable, **22.2 mm** gives a slip fit with about 0.03 mm clearance, and the bearing is then held axially by a cover or clip.

Note what the coupon did not show: whether the press fit stays tight over months. PLA creeps under the sustained hoop stress of an interference fit, and the grip can relax over time, especially if the part gets warm. The table's bearings are also captured axially by the frame, so a relaxed press fit cannot let a bearing walk out. A press fit in a printed part should locate, not be the only thing holding.

## Read the shaft hole results

This is an illustration. The shaft hole strip showed the same pattern:

```figure
type: compare
title: Shaft hole coupon, PLA, axis vertical, with an 8.00 mm steel shaft
cols: Designed | Measured, mean | Result
caption: This is an illustration. Each fit type gets one designed size, stored as a named offset in the CAD model.
- Locate, no movement | 8.20 mm | 8.03 mm | 0.03 mm clearance: snug, slides with a twist
- *Running, rotates on the shaft | 8.40 mm | 8.22 mm | 0.22 mm clearance: turns freely, little wobble
- Too tight | 8.00 mm | 7.84 mm | Shaft will not enter without drilling
- Between | 8.30 mm | 8.12 mm | 0.12 mm clearance: free but stiff when dirty
```

The running fit matters for parts that turn on a steel pin, such as an idler or a lever. A 0.22 mm clearance lets the part turn freely without noticeable wobble at this size. The 0.12 mm option worked when clean but stiffened when a little dust or a stray string of plastic got in, which is a useful reminder that a printed running fit needs more room than a machined one.

The locate fit, 8.20 mm designed and about 8.03 mm printed, suits shafts that should not move in the part, such as the dial shaft in its hub, where a grub screw or a flat on the shaft then prevents rotation. It is snug enough that the shaft does not rattle, yet loose enough to slide in by hand with a twist, so no force is needed that could crack the part.

## Store the offsets in the model

The coupon results are only useful if every designer uses them, every time. The way to make that happen is to store them as named parameters in the CAD model, not as numbers typed into sketches.

```figure
type: formula
title: Named fit parameters for the indexing table
formula: designed size = nominal mating size + fit offset
caption: This is an illustration. Each offset was set from the coupons. If the printer or material changes, rerun the coupons and update the five values; every feature follows.
- bearing_press | 22.00 + 0.10 = 22.10 mm
- bearing_slip | 22.00 + 0.20 = 22.20 mm
- shaft_locate | 8.00 + 0.20 = 8.20 mm
- shaft_run | 8.00 + 0.40 = 8.40 mm
- peg_slide | peg + 0.25 mm per side
```

Each bore in the model references one of these names. A colleague reading the model can see at a glance which fit each feature is meant to have. When the printer changes, or the material changes from PLA to PETG, the designer reprints the coupons, updates five values and rebuilds. Every bearing bore, shaft hole and peg socket updates at once.

Keep the coupon files in the project too. They are part of the design: they define what the offsets mean.

## Watch the spread, not just the mean

A fit designed on the average measurement can still fail if the spread is large. The bearing coupon's three prints agreed within about ±0.03 mm, so the 22.1 mm hole's interference ranged from about 0.05 to 0.11 mm. Both ends of that range still gave a usable press fit. If the spread had been ±0.10 mm, the same hole would have ranged from a loose fit to a cracked plate, and no single designed size would have worked reliably.

Where spread is large, look for its causes before choosing sizes: inconsistent filament diameter, a loose belt, a warm room one day and a cold one the next, or parts placed at different positions on the plate. Reducing the spread is often more valuable than tuning the mean.

The READOS book [Fits That Work](/reados/publications/fits-that-work/calculate-the-dimensional-bounds/) covers the calculation of fit limits from tolerances in detail, and the same reasoning applies to printed fits once the printed tolerances are known.

## Design features that forgive variation

Measured offsets narrow the variation; good feature design makes the remaining variation harmless. Three techniques are especially useful in printed mechanisms.

**Crush ribs.** Instead of a plain round bore, a press-fit housing can have a slightly oversize bore with three or more narrow ribs running along it. The ribs are sized to interfere with the bearing; the bore between them clears it. When the bearing is pressed in, the ribs deform locally while the rest of the wall stays unstressed. Because only the ribs carry the interference, the fit is much less sensitive to small size changes, and the hoop stress that cracked the first side plate is avoided. The trade-off is that the bearing is located at a few lines rather than around its full circumference, which is acceptable for a lightly loaded teaching mechanism.

**Lead-in chamfers.** A chamfer at the entry of every press-fit bore and every shaft hole lets the mating part start straight and centre itself. Without one, a bearing pressed into a tight bore tends to tilt, scraping material from one side and seating crooked. A chamfer of about 0.5 mm by 45° is enough at these sizes, and it doubles as the first-layer chamfer from Chapter 2 when the bore starts on the build plate.

**Adjustment where precision cannot be printed.** Some positions need more accuracy than the printer can hold, such as the Geneva wheel's centre distance from the driver, which Chapter 6 shows is sensitive. Rather than relying on two printed holes being exactly 60 mm apart, the motor mount carrying the driver is fastened through short slots, so its position can be adjusted by a millimetre or so during assembly and then locked. An alignment tool, printed to the correct spacing, sets the position before the screws are tightened. Slots and alignment tools move precision from the printer to a deliberate, checkable assembly step.

## Stack the tolerances where parts add up

Some fits depend on several printed parts at once. The indexing table's planetary gearbox has one: the axial gap that lets the carrier and planets turn without rubbing the housing.

This is an illustration. The gearbox housing pocket is 16.8 mm deep. Inside it sit the carrier plate, 4.0 mm thick, the planets, 8.0 mm wide, and a spacer ring, 4.0 mm thick. The nominal axial gap is **16.8 − 4.0 − 8.0 − 4.0 = 0.8 mm**. The designer wants it between about 0.3 mm and 1.3 mm: less risks rubbing, more lets the planets tilt.

Each printed dimension in Z can vary by about ±0.1 mm, partly because heights are quantised to the 0.2 mm layer height. With four dimensions, the worst-case variation is **±0.4 mm**, giving a gap from 0.4 to 1.2 mm, still inside the target. A root-sum-square estimate, which assumes the variations are independent and unlikely to all reach their limits together, gives **±√(4 × 0.1²) = ±0.2 mm**, a gap from 0.6 to 1.0 mm. Because the worst case fits, the design does not need to rely on the statistical estimate. The [RSS tolerance stack](/tools/rss-tolerance-stack/) tool in WORKOS runs the same comparison for longer stacks.

## Detect a fit failure

This is an illustration. Before the coupons were printed, the first frame side plate used a 22.0 mm bore, on the theory that a printed hole would come out "about right" for a press fit. The bearing went in with heavy pressure in the vice, and a crack appeared in the plate between the bore and the nearest edge, running along a layer line. The bearing also sat slightly tilted.

The coupon later explained it: a 22.0 mm design prints at about 21.83 mm, giving 0.17 mm interference, roughly double the chosen value. The fix had two parts. The bore moved to the 22.1 mm press-fit size, and the wall between the bore and the plate edge was thickened from 3 mm to 5 mm. The reprinted plate accepted its bearing squarely with firm pressure and no cracking.

## Exercise: switch the gears to PETG

The gears are printed in PETG, not PLA. Their bores must run on 8 mm steel shafts. Explain how you would set their bore size, and what you would expect if you simply used the PLA running-fit value of 8.40 mm.

**Worked answer.** Print the shaft hole coupon in **PETG**, with the gear settings: 0.12 mm layers, the same walls and the same orientation, axis vertical. Measure three prints and choose the designed size that gives about 0.2 mm running clearance on the 8.00 mm shaft. Store it as a separate parameter, such as `shaft_run_petg`, because the material behaves differently.

Using the PLA value blindly could go either way. PETG often prints with slightly different shrinkage and stringing, so the 8.40 mm hole might come out a little larger or smaller than 8.22 mm. The only way to know is to measure. If the coupon shows, for example, 8.28 mm from an 8.40 mm design, the clearance would be 0.28 mm, looser than intended, and the gears could wobble enough to affect their mesh in Chapter 5.
