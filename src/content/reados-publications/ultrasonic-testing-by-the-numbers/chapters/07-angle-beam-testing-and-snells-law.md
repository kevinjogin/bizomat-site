---
book: ultrasonic-testing-by-the-numbers
chapterSlug: angle-beam-testing-and-snells-law
order: 7
title: "Angle-beam testing and Snell's law"
description: "How a wedge refracts sound into an angled shear beam, critical angles, beam index and angle checks, skip distance, and how to locate a reflector in a butt weld from its sound path."
draft: false
---

A straight-beam probe sees reflectors that lie parallel to the surface: back walls, laminations, corrosion. The flaws that matter most in a butt weld lie the other way. Lack of fusion runs along the bevel faces, cracks run through the thickness, and incomplete root penetration sits at the bottom of the joint. A beam sent straight down passes them edge-on and returns nothing. Angle-beam testing sends the sound in at an angle, so that it strikes those flaws squarely or nearly so, and it reaches the weld from the plate beside it, where the weld cap does not get in the way.

This chapter explains how a plastic wedge bends sound into an angled shear beam, works out the critical angles and the skip geometry for the mill's 12 mm insert plate, shows how to locate a reflector from its sound path, and finishes with a worn wedge that sent a repair grinder to the wrong depth.

## Refraction at an interface

When a wave crosses an interface at an angle, its direction changes, because the wave travels at a different speed on each side. The rule is Snell's law, the same law that bends light entering water: the sine of each angle, measured from the normal to the interface, is proportional to the speed of the wave on that side. In a solid there is a complication. A longitudinal wave striking a solid at an angle generally produces both a longitudinal and a shear wave in the solid, each refracted at its own angle. This mode conversion is what makes angle-beam testing possible.

```figure
type: formula
title: Snell's law at a wedge–steel interface
formula: sin α ÷ c_wedge = sin β_L ÷ c_L = sin β_T ÷ c_T
formula: First critical angle: sin α₁ = c_wedge ÷ c_L      Second critical angle: sin α₂ = c_wedge ÷ c_T
caption: α is the incident angle in the wedge, β_L and β_T the refracted angles of the longitudinal and shear waves in the steel, all measured from the normal to the surface. Acrylic wedge c = 2,730 m/s; steel c_L = 5,920 m/s and c_T = 3,220 m/s.
- α | incident angle in the wedge
- β_L, β_T | refracted longitudinal and shear angles in the steel
```

The two critical angles divide the possibilities. Below the first, 27.5° for an acrylic wedge on steel, both a longitudinal and a shear wave enter the steel, at different angles, and two beams travelling at different speeds make every echo ambiguous. Between the first and the second critical angle, 58.0°, the refracted longitudinal wave would need an angle beyond 90° and does not form; only the shear wave enters the steel. Above the second critical angle neither wave enters, and the sound runs along the surface. A practical angle-beam probe uses an incident angle between the two critical angles, so that the steel holds a single shear beam, at an angle set by the wedge.

```figure
type: compare
title: Wedge angles for the mill's shear-wave probes on carbon steel
cols: Incident angle in acrylic | Shear wavelength at 4 MHz | Used for
rowhead: Refracted shear angle
- 45° | 36.8° | 0.81 mm | thick sections; cracks near vertical
- 60° | 47.2° | 0.81 mm | the insert's bevel faces at 30° to the vertical
- 70° | 52.8° | 0.81 mm | thin plate: the 12 mm insert's root and body
caption: This is an illustration. sin α = (2,730 ÷ 3,220) sin β_T. All three incident angles lie between the critical angles of 27.5° and 58.0°, so only a shear wave enters the steel.
```

The probe is named for the refracted angle in steel, not the wedge angle, and that name holds only for the steel the probe was designed for. On stainless steel, whose shear speed is lower, the same 70° probe refracts to a smaller angle, and its angle must be measured on a block of that material.

### Why shear, and why these angles

Shear waves have two advantages for weld testing besides their single beam. Their wavelength is little more than half the longitudinal wavelength at the same frequency, 0.81 mm at 4 MHz, so they resolve smaller reflectors. And at the steel's back wall, a shear wave at more than 33.0° to the normal reflects as a shear wave, without converting part of its energy into a longitudinal wave travelling at another angle, so the beam bounces cleanly through the plate. The 33.0° figure is the angle whose sine is c_T ÷ c_L; all three of the mill's probes are well above it.

## Beam index and angle

The beam leaves the wedge at a point on its base called the beam index point, usually marked on the side of the probe. All position measurements start from it. The refracted angle is the angle of the beam's axis below the normal. Both must be checked, on a calibration block such as the type described in ISO 2400, before each shift and after any suspicion of wear, because both change as the wedge's plastic face wears against rough steel.

The checks are simple in principle. The beam index point is found by maximising the echo from a curved surface of known radius and noting where on the probe the radius's centre lies. The angle is found by maximising the echo from a hole at a known depth and reading the angle from engraved scales or calculating it from the probe position. Range is calibrated on the same block, by setting the instrument's shear velocity and zero so that echoes from known radii appear at their correct sound paths. The result is a beam whose starting point, direction and distance scale are all known.

## The skip geometry in a 12 mm plate

A shear beam entering a 12 mm plate at 70° travels down to the back wall, reflects and travels back up to the surface, then repeats. Each straight segment is a leg. The distance along the surface from the beam index point to where the beam returns to the top surface is the full skip distance; the point where it reaches the back wall is half a skip.

```figure
type: formula
title: Skip distance and sound path in a plate of thickness t
formula: Half-skip sound path: S½ = t ÷ cos β        Full skip surface distance: 2 t tan β
formula: First leg (S ≤ S½): depth d = S cos β        surface distance = S sin β
formula: Second leg (S½ < S ≤ 2 S½): depth d = 2t − S cos β        surface distance = S sin β
caption: S is the sound path measured on the instrument, β the refracted angle and t the plate thickness. Depth is measured from the scanning surface.
- S | sound path, mm
- d | reflector depth below the scanning surface, mm
```

For the insert's 12 mm plate, a 70° probe has a half-skip sound path of 35.1 mm and a full skip of 65.9 mm along the surface. A 60° probe has 24.0 mm and 41.6 mm; a 45° probe 17.0 mm and 24.0 mm. The skip distances decide how far from the weld the probe must be moved to sweep the beam through the whole weld volume: the beam must pass through every part of the weld in the first or second leg as the probe moves between a little less than half a skip and a little more than a full skip from the weld's centreline.

```figure
type: svg
title: A 70° shear beam skipping through the 12 mm insert weld
alt: A cross-section of a single-V butt weld in 12 mm plate, with the angle-beam probe sitting on the plate surface to the left. The beam leaves the probe's index point at 70 degrees from the vertical, travels down to the back wall at half skip, reflects and travels up through the far side of the weld to the top surface at full skip. A reflector near the root on the near side is marked on the first leg.
caption: This is an illustration. The first leg reaches the back wall 33.0 mm along the surface from the index point; the second leg returns to the top surface at 65.9 mm. A reflector at sound path 30.0 mm lies on the first leg at a depth of 10.3 mm.
viewbox: 0 0 640 260
body:
<path class="ln" d="M20 80 L620 80 M20 200 L620 200"/>
<text class="tx txs" x="24" y="72">scanning surface</text>
<text class="tx txs" x="24" y="222">back wall, 12 mm</text>
<path class="bx" d="M261 80 L419 80 L350 200 L330 200 Z"/>
<text class="txb" x="320" y="104">weld</text>
<rect class="bxi" x="20" y="46" width="70" height="34" rx="3"/>
<text class="tx txs" x="26" y="40">70° probe</text>
<path class="la flow" d="M50 80 L380 200 L620 113"/>
<circle class="fa pulse" cx="332" cy="183" r="6"/>
<text class="txa" x="150" y="170">reflector, S = 30 mm</text>
<text class="tx txs" x="372" y="226">half skip, 33.0 mm</text>
<text class="tx txs" x="470" y="108">to full skip, 65.9 mm</text>
<path class="cl" d="M340 30 L340 240"/>
<text class="tx txs" x="346" y="40">weld centreline</text>
```

## Locating a reflector

The instrument shows an echo at a sound path S. The technician notes the probe's position, the distance from the beam index point to the weld centreline, and the beam's direction. With the angle and plate thickness, the formulas give the reflector's depth and its position across the weld.

Take the 70° probe with its index point 29 mm from the insert weld's centreline, and an echo at a sound path of 30.0 mm. The half-skip path is 35.1 mm, so the echo is on the first leg. Its depth is 30.0 × cos 70° = 10.26 mm and its surface distance from the index point is 30.0 × sin 70° = 28.19 mm, which puts it 0.81 mm short of the centreline, on the probe's side. In a single-V weld with a 2 mm root gap and 30° bevels, that is at the root, close to the near-side root face. An echo there, which reappears at the same position from the other side of the weld, is the signature of incomplete root fusion or penetration.

Had the echo appeared at 48.0 mm instead, it would be on the second leg, travelling upward. A first-leg calculation would give a depth of 16.4 mm, impossible in a 12 mm plate, and the second-leg formula gives the real depth: 24.0 − 48.0 × cos 70° = 7.58 mm. Getting the leg wrong is a common error that the plate thickness usually catches: any calculated depth greater than the thickness is a wrong-leg calculation.

### Accuracy of location

Each input carries an uncertainty, and they compound. An angle error of 1° at 70° changes the depth of a reflector at a 30 mm sound path by about 0.5 mm. An error of 1 mm in reading the index point shifts the position across the weld by 1 mm. The beam itself is several millimetres wide at these sound paths, so the reflector could lie anywhere within it; technicians maximise the echo to centre the beam on the reflector before reading S. Locations to about ±1 mm in depth and position are achievable on a 12 mm plate with a checked probe. Without the checks, the next section shows what can happen.

## Scanning the whole weld

To sweep the whole weld volume, the beam must pass through every part of the weld, from cap to root and from one fusion face to the other. The insert weld's cap is about 16 mm wide, so its edges are about 8 mm either side of the centreline. With the 70° probe, the first leg reaches the root when the index point is 33.0 mm from it, and the second leg returns to the top surface at the far edge of the cap when the index point is 65.9 − 8 = 58 mm from the centreline. In practice the technician moves the probe in a raster, forward and back across a band from about 25 mm to 75 mm from the centreline, stepping along the weld by less than the probe's width, and swivels it about 10° either way to catch reflectors that are not quite parallel to the weld. With the 60° probe the band is from about 13 mm to 50 mm.

Both probes are used from both sides of the weld where access allows, which gives each fusion face two looks at two angles. A separate scan with the probe pointing along the weld, on the ground-flush cap or alongside it, looks for transverse cracks, which a beam across the weld passes edge-on. The scan plan for the insert, recorded in the procedure, sets out each probe, each side, each band and each direction, so that the coverage can be checked afterwards rather than assumed.

## The mistake: a repair excavation that stopped short

The insert's first weld, on the vessel's lower side, gave an echo exceeding the acceptance level at the root. The technician located it with the 70° probe: sound path 30.0 mm, index point 29 mm from the centreline, depth 10.26 mm from the outside surface. Because the inside of the vessel needed a confined-space entry permit and the outside was accessible from scaffolding, the repair was planned from the outside: grind down along the weld to 11.3 mm, a millimetre past the reported depth, inspect, then reweld.

After the excavation and reweld, the re-test found the same echo, slightly weaker, in the same place.

```figure
type: steps
title: Tracing the wrong depth to a worn wedge
caption: This is an illustration. Wedge wear at the front edge reduced the incident angle, and with it the refracted angle, by 2.5°.
- Indication located with nominal 70° | S = 30.0 mm: depth 10.26 mm, 0.81 mm from the centreline
- Repair from the outside | ground to 11.3 mm and rewelded; re-test showed the same echo
- Probe checked on the calibration block | refracted angle 67.5°, not 70°: the wedge's front edge was worn
- * Recalculated at 67.5° | depth 30.0 × cos 67.5° = 11.48 mm, below the 11.3 mm excavation
- Second repair | ground to 12 mm through the root from outside, root rewelded with a backing technique; re-test clear
- Procedure changed | beam index and angle checked on the block at the start of each shift and before any repair is located
```

The probe's angle was checked on the calibration block. Its wedge, used for weeks on the rough plate of a previous job, had worn unevenly, and the refracted angle had fallen from 70° to 67.5°. At 67.5°, the same 30.0 mm sound path puts the reflector at a depth of 30.0 × cos 67.5° = 11.48 mm and 1.28 mm from the centreline, almost exactly on the near-side root face. The excavation had stopped 0.2 mm above it. The second repair went through the root, and the re-test was clear.

The extra repair cost a day of scaffolding, a welder and a second round of testing, and it was entirely avoidable with a five-minute check on the block. The mill's contract with its inspection company now requires the angle and index checks at the start of each shift and immediately before any indication is located for repair, with the measured angle written on the report.

## Exercise: a 60° probe on the bevel

To look for lack of sidewall fusion on the insert's 30° bevel faces, the technician uses a 60° probe, which strikes a 30° bevel face squarely. Calculate the incident angle in the acrylic wedge for 60° in steel, the half-skip sound path and full skip distance in the 12 mm plate, and the depth and surface distance of reflectors at sound paths of 18.0 mm and 40.0 mm. Then explain why a 60° beam strikes the far-side bevel face squarely on its first leg and the near-side face on its second leg.

### Answer

**Given:** β = 60°; acrylic 2,730 m/s; steel shear 3,220 m/s; t = 12 mm; S = 18.0 mm and 40.0 mm.

**Assumptions:** flat plate; the probe's angle and index checked on the block; carbon steel shear speed as stated.

**Method:** Snell's law for the incident angle; skip formulas; first- or second-leg depth by comparing S with S½.

**Incident angle:** sin α = (2,730 ÷ 3,220) × sin 60° = 0.8478 × 0.8660 = 0.7342, so α = 47.2°, between the critical angles of 27.5° and 58.0°.

**Skip:** S½ = 12 ÷ cos 60° = 24.0 mm; full skip = 2 × 12 × tan 60° = 41.6 mm.

**S = 18.0 mm:** first leg, since 18.0 < 24.0. Depth = 18.0 × 0.5 = 9.00 mm; surface distance = 18.0 × 0.866 = 15.59 mm.

**S = 40.0 mm:** second leg, since 24.0 < 40.0 ≤ 48.0. Depth = 24.0 − 40.0 × 0.5 = 4.00 mm; surface distance = 40.0 × 0.866 = 34.64 mm.

**Why the bevels are struck squarely:** each bevel face is inclined at 30° to the vertical, so its normal is inclined at 60° to the vertical. The far-side face slopes down towards the probe, and its normal points back up towards the probe at 60°; the first leg, travelling down and away at 60°, meets it head-on. The near-side face slopes the other way, and its normal points up and away from the probe; only the second leg, travelling up and away at 60° after the bounce, meets it head-on. A complete test of both faces therefore uses both legs from one side, or the first leg from both sides.

**Verification:** the second-leg depth must lie between 0 and 12 mm, as 4.00 mm does, and the surface distances must grow in proportion to S, as they do: 34.64 ÷ 15.59 = 2.22 = 40.0 ÷ 18.0.
