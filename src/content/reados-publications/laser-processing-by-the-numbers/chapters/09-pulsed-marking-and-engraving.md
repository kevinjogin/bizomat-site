---
book: laser-processing-by-the-numbers
chapterSlug: pulsed-marking-and-engraving
order: 9
title: "Pulsed lasers for marking and engraving"
description: "Pulse energy, peak power, fluence and spot overlap for a pulsed marking laser, marking time for a two-dimensional code, and fitting the marking station to the line's takt time."
draft: false
---

A marking laser does not melt through anything. It delivers its energy in short pulses, each heating a tiny spot for a fraction of a microsecond, and builds a mark out of tens of thousands of overlapping spots. Whether the mark is a dark oxide, a bleached spot in anodising or a groove engraved into the metal depends on how much energy each pulse puts into how small an area, and how closely the spots are packed. A mark that looks fine to the eye may still be unreadable to a code scanner, which is what happened to the first batch of codes on the cell's cabinet doors.

This chapter works through the M-20 marking laser's pulse energy, peak power and fluence, shows how spot overlap is set by speed and pulse frequency, times a two-dimensional code, and checks the marking station against the line's takt time with WORKOS tools.

## Pulse energy, peak power and fluence

The M-20 is a 20 W pulsed fibre laser at 1.06 µm. Twenty watts is its average power. It produces it as a train of pulses about 100 ns long, at a repetition rate the operator sets between 20 and 100 kHz. Each pulse carries the average power divided by the repetition rate, and because it is delivered in 100 ns, its peak power is thousands of times the average.

```figure
type: formula
title: Pulse energy, peak power and fluence
formula: E = P_avg ÷ f
formula: P_peak ≈ E ÷ τ
formula: Average fluence F = E ÷ (π w²);   peak fluence of a Gaussian spot F₀ = 2E ÷ (π w²)
caption: f is the pulse repetition rate and τ the pulse duration. w is the 1/e² radius of the focused spot. Fluence is energy per unit area; it decides whether a pulse heats, melts or removes material. Peak power is approximate because real pulses are not rectangular.
- E | pulse energy, J
- P_avg, P_peak | average and peak power, W
- f | repetition rate, Hz
- τ | pulse duration, s
- F | fluence, J/cm²
```

The M-20 focuses to a 50 µm spot (w = 25 µm = 0.0025 cm) through its flat-field lens. At three repetition rates:

```figure
type: compare
title: M-20 pulses at 20 W average, 100 ns, 50 µm spot
cols: Pulse energy | Peak power | Peak fluence at the spot centre
rowhead: Repetition rate
- 20 kHz | 1.0 mJ | 10 kW | 102 J/cm²
- 50 kHz | 0.4 mJ | 4 kW | 41 J/cm²
- 100 kHz | 0.2 mJ | 2 kW | 20 J/cm²
caption: This is an illustration. Pulse energy falls in proportion to the repetition rate at constant average power. A 20 W laser at 20 kHz has the peak power of a 10 kW continuous laser for a tenth of a microsecond.
```

These fluences are well above what is needed to start removing metal with nanosecond pulses. At such short times, Chapter 5's diffusion length is under a micrometre, so the energy stays in a thin surface layer and a high fluence vaporises and ejects it: engraving. At lower fluences or with the beam slightly defocused, the surface is heated without much removal: on stainless steel it grows a thin oxide whose thickness, and therefore its colour by thin-film interference, depends on the temperature it reaches; on anodised aluminium it bleaches or darkens the dye or the oxide.

The operator therefore chooses the repetition rate and focus for the effect wanted, not only for speed. High pulse energy at low repetition rate engraves deeply; lower pulse energy at higher repetition rate and greater overlap gives smooth, dark annealing marks with no groove, which is what the stainless doors need, because a groove would trap dirt and break the passive film.

## Spot overlap

Between pulses, the beam moves on. The distance between successive spots, the pitch, is the marking speed divided by the repetition rate. Comparing the pitch with the spot diameter gives the overlap.

```figure
type: formula
title: Spot pitch and overlap
formula: Pitch s = v ÷ f
formula: Overlap = 1 − s ÷ d
caption: v is the marking speed and d the spot diameter. Zero overlap means spots touching edge to edge, at the 1/e² diameter; negative overlap means gaps.
- s | pitch between spot centres, mm
- d | spot diameter, mm
```

```figure
type: compare
title: Overlap of 50 µm spots at different speeds and repetition rates
cols: Pitch | Overlap | Appearance
rowhead: Speed and rate
- 1,000 mm/s at 20 kHz | 0.050 mm | 0% | Row of dots touching at their edges; patchy line
- 500 mm/s at 20 kHz | 0.025 mm | 50% | Continuous line
- 250 mm/s at 20 kHz | 0.0125 mm | 75% | Continuous, more heat per millimetre
- * 1,000 mm/s at 50 kHz | 0.020 mm | 60% | Continuous line at full speed
caption: This is an illustration. A Gaussian spot's edges, at the 1/e² diameter, receive only 13.5% of the centre's fluence, so a line of just-touching spots has weak regions between spot centres.
```

Areas are filled by hatching: parallel lines a set distance apart, the hatch spacing, which must also overlap for an even fill. The M-20's code program fills each dark cell with lines 0.03 mm apart.

## Marking time for a code

The doors carry a two-dimensional data matrix code with the order and serial number, 18 cells square with 0.5 mm cells, 9 mm across. The time to mark it is the hatch length divided by the speed, plus the time for the mirrors to jump between lines.

A 9 mm square hatched at 0.03 mm needs ⌈9 ÷ 0.03⌉ + 1 = 301 lines of 9 mm, 2,709 mm of hatching if the whole square were filled. At 500 mm/s that is 5.42 s; with about 0.2 ms for each of the 301 jumps, 5.48 s. At 1,000 mm/s, 2.71 s, or 2.77 s with the jumps. A code fills only its dark cells, about half the square, so real times are lower, but the full-square figure is a safe planning number and scales with speed in the same way.

### The mistake: codes that would not scan

The first program marked the codes at 1,000 mm/s and 20 kHz, chosen because it gave the deepest, darkest-looking mark at the highest speed. The doors went to the customer, whose warehouse scanners failed to read about one code in eight. Under magnification the reason was visible: with 0% overlap, each hatch line was a row of touching dots, and the cells were speckled rather than solid. The pattern was readable by eye but gave a scanner poor contrast and uneven cells.

The cell checked its codes against a verifier. ISO/IEC 15415 sets out how the print quality of two-dimensional codes is graded, and ISO/IEC TR 29158 gives guidance for codes marked directly on parts, which is what a laser mark is. The verifier graded the codes low on cell modulation, the evenness of the dark and light cells.

The first fix was to slow the marking to 500 mm/s at 20 kHz, giving 50% overlap. The codes graded well. But marking is 12 s of the station's 36 s cycle, and halving the speed of all the marking doubled that to 24 s, making the cycle 48 s, 0.8 min.

```figure
type: compare
title: The marking station against takt in the cycle time tool
cols: Takt | Actual cycle | Headroom | Output in 450 min | Result
rowhead: Program
- Original: 1,000 mm/s, 20 kHz, 0% overlap | 0.75 min | 0.60 min | 0.15 min | 750 | MEETS REQUIRED PACE, but codes fail
- First fix: 500 mm/s, 20 kHz, 50% overlap | 0.75 min | 0.80 min | −0.05 min | 563 | TOO SLOW
- * Final: 1,000 mm/s, 50 kHz, 60% overlap | 0.75 min | 0.60 min | 0.15 min | 750 | MEETS REQUIRED PACE, codes pass
caption: This is an illustration. 450 minutes available a shift, 600 doors required. Takt is the available time divided by the demand.
```

The [cycle time tool](/tools/cycle-time/) showed the problem with the first fix: at 0.8 min against a takt of 0.75 min, the station could make only 563 of the 600 doors a shift. The final program kept the 1,000 mm/s speed and raised the repetition rate to 50 kHz instead, giving 60% overlap. The pulse energy fell to 0.4 mJ and the peak fluence to 41 J/cm², still ample for an annealing mark, and the marks became smoother and better graded than the 20 kHz marks had been. The cycle returned to 0.6 min.

The lesson is that overlap is set by the ratio of speed to repetition rate, and either can be changed. Raising the repetition rate keeps the speed and lowers the pulse energy; lowering the speed keeps the pulse energy and costs time. For annealing marks, where high pulse energy is not needed, raising the rate is usually the better choice. For deep engraving, where pulse energy matters, slowing down may be unavoidable.

## Curved and tilted surfaces

The galvanometer mirrors steer the beam across a flat field. If the surface is tilted by an angle θ to the field, the spot stretches into an ellipse whose area is larger by 1 ÷ cos θ, so the fluence falls by cos θ: at 30°, to 0.866 of its value. The beam's focus also moves off the surface across a tilted or curved part, enlarging the spot further. Chapter 3 noted that absorptivity changes little at these angles; the stretched and defocused spot is what fades a mark at the edge of a curved part. The cell marks curved nameplates in two zones, refocusing between them, and keeps code marks on flat faces.

## Three kinds of mark

The M-20 makes three kinds of mark for the cell, and each uses the pulse settings differently.

**Annealing marks on stainless steel.** The surface is heated, not removed, and a thin oxide grows whose colour depends on its thickness, from straw through brown and blue to near black. High overlap and moderate fluence give an even, dark mark with a smooth surface. The doors' codes are annealing marks. Because the oxide forms from the steel's own chromium and iron, a heavy annealing mark can lower the corrosion resistance at the mark slightly; the cell's door specification accepts that for the small area of a code, and the customer's specification was checked to confirm it.

**Marks on anodised aluminium.** The nameplates for the cabinets are dyed black anodised aluminium. A low-fluence pass bleaches the dye in the anodic layer to a light grey or white without breaking through to the metal, giving a high-contrast mark that remains sealed by the coating. Too much fluence cuts through the anodising to bright metal, which then corrodes and looks different from the rest; the cell's test plate of fluence steps sets the window for each batch of nameplates.

**Engraving.** For deep marks, such as part numbers on steel tooling that will be shot-blasted or painted over, the M-20 engraves by removing metal in many passes. At the high fluence of 20 kHz pulses, the cell's trials removed about 2.5 µm per pass on tool steel, so a 0.1 mm deep mark needs 40 passes. A 20 × 8 mm area hatched at 0.03 mm has 268 lines and 5,360 mm of hatching, taking 10.7 s a pass at 500 mm/s and about 7 minutes for 40 passes. Deep engraving is slow, and the heat of many passes builds up in a small part, so the program pauses between groups of passes to let it cool.

## Keeping marks readable

A code is only as good as the poorest scanner that must read it. The cell's rules follow from the scanner mistake. The cell size, 0.5 mm, is at least five times the 50 µm spot, so each cell is filled by many hatch lines and its edges are sharp. Each code has a clear margin, the quiet zone, of at least one cell on every side, kept free of text and scratches. The verifier checks the first door of each batch and one in fifty thereafter, and its grade is written on the batch record alongside the program number. A falling grade over several batches is the first sign of a dirty lens, a drifting focus or a change in the stainless steel's surface finish, and it is caught before the customer's scanners notice.

## Fume and safety at the marker

The M-20's source is a Class 4 laser, like the cutting and welding lasers. It is built into a Class 1 enclosure with an interlocked door, so that no laser radiation can escape in normal use and the operator needs no eye protection while it runs; the interlock stops the beam when the door opens. Marking removes small amounts of metal, oxide, dye and coating, and some coatings and plastics give off harmful fumes when vaporised. The enclosure has its own extraction with a particle and carbon filter, changed on the filter maker's schedule, and new materials are not marked until their safety data sheets have been checked for decomposition products.

## Cost per mark

The [machine hour rate tool](/tools/machine-hour-rate/) gives the M-20's hourly cost from its installed cost of A$28,000, a resale value of A$2,000 after six years, a 9% interest rate, 1,500 productive hours a year, A$1,500 a year of floor space, 0.5 kW at A$0.28 a kilowatt-hour, A$800 a year of maintenance and A$1 an hour of consumables, all excluding GST. The machine rate is A$6.66 an hour; with an operator at A$62 an hour, fully loaded, the rate is A$68.66. At 0.6 min a door, marking costs 68.66 × 0.6 ÷ 60 = A$0.69 a door, almost all of it labour. The first fix's 0.8 min would have cost A$0.92 a door as well as the lost output.

## Setting up a new material

The cell sets up every new marking material the same way. It marks a test plate with a grid of small squares, each with a different combination of repetition rate and speed at full power and focus, so that the rows step through pulse energy and the columns through overlap. The squares are inspected under magnification and, for codes, read with the verifier. The chosen square's settings become the program, and the next squares in each direction show how close the setting sits to the edge of the window. A setting in the middle of a broad window of good squares is robust; one at the edge of a narrow window will drift out of it as the lens gets dirty or the material changes. The test plate is kept with the program, so that a later problem can be compared with the original trial.

## Exercise: a different pulse setting

A new nameplate material is to be marked at 30 kHz with 120 ns pulses, at the M-20's 20 W average power, 50 µm spot and 800 mm/s. Find the pulse energy, the approximate peak power, the peak fluence at the spot centre and the spot overlap. Is the overlap likely to give a continuous line?

### Answer

The pulse energy is E = 20 ÷ 30,000 = 0.667 mJ. The peak power is approximately 0.000667 ÷ 120 × 10⁻⁹ = 5.56 kW. The peak fluence at the spot centre is F₀ = 2 × 0.000667 ÷ (π × 0.0025²) = 67.9 J/cm².

The pitch is 800 ÷ 30,000 = 0.0267 mm, and the overlap is 1 − 0.0267 ÷ 0.050 = 46.7%. That is close to the 50% that gave continuous lines on the doors, so a continuous line is likely. The setting should still be proved with a verifier on the new material, because the effect of each pulse depends on the material as well as the fluence.
