---
book: ultrasonic-testing-by-the-numbers
chapterSlug: probes-beams-and-the-near-field
order: 3
title: "Probes, beams and the near field"
description: "How a probe makes a pulse and a beam, near field length, beam spread, axial resolution and the dead zone, and how to choose a probe size and frequency for a thickness, weld or shaft job."
draft: false
---

A probe is a loudspeaker and a microphone in one. A thin disc of piezoelectric ceramic, struck by a short electrical pulse, rings at its natural frequency and pushes a pulse of sound into the part; when the echo returns, the same disc turns the pressure back into a voltage. The disc's diameter and frequency decide the shape of the beam it makes, and its damping decides how short the pulse is. Those three choices determine what a test can resolve, how close to the surface it can see, how far it can reach, and whether an echo's height means anything.

This chapter explains the beam from a flat circular probe, works out the near field and beam spread for the probes the mill uses, explains axial resolution and the dead zone, and finishes with a corroded reducer that a thickness gauge read at twice its true wall.

## How a probe makes a pulse

The piezoelectric element changes thickness when a voltage is applied across it and produces a voltage when it is squeezed. An element half a wavelength thick, in the element's own material, resonates at the frequency the probe is named for. Struck by a sharp voltage spike, it would ring for many cycles, like a bell. A heavily loaded backing behind the element absorbs the ringing so that the pulse lasts only one to three cycles. A short pulse contains a broad range of frequencies around the nominal one; a long pulse contains a narrow range. Heavily damped, broadband probes give short pulses and good resolution; lightly damped probes give longer pulses, more sensitivity and poorer resolution.

The pulse length in time matters because two echoes arriving closer together than about half a pulse length overlap into one. A 5 MHz probe whose pulse lasts two cycles produces a pulse 0.4 µs long. In steel, at 5,920 m/s, that corresponds to 2.37 mm of travel, and since the sound travels down and back, two reflectors closer together in depth than about half of that, 1.18 mm, cannot be separated. That is the axial resolution, and it is roughly one wavelength for a two-cycle pulse.

## The beam from a flat probe

A flat circular element does not produce a pencil of sound. Every point on its face radiates, and the waves from different points add or cancel depending on how far each has travelled. Close to the probe, the path lengths from the centre and the edge of the face differ by large fractions of a wavelength, and the pressure along the axis rises and falls through a series of maxima and minima. This is the near field. Beyond a certain distance the path differences become small, the waves add steadily, and the pressure on the axis falls smoothly with distance. This is the far field, and the boundary between the two, where the last maximum occurs, is the near field length.

```figure
type: formula
title: Near field length and beam spread of a flat circular probe
formula: N = D² ÷ (4λ) = D² f ÷ (4c)
formula: Half-angle to the −6 dB edge: sin γ₆ ≈ 0.51 λ ÷ D
formula: Half-angle to the first null: sin γ₀ = 1.22 λ ÷ D
caption: D is the element diameter and λ the wavelength in the material being tested. The near field formula is the usual approximation for D much larger than λ. The −6 dB edge is where the pressure has fallen to half its value on the axis.
- N | near field length, mm
- D | element diameter, mm
- λ | wavelength, mm; c sound speed; f frequency
- γ | beam spread half-angle
```

The near field matters for two reasons. Within it, the echo from a small reflector can rise or fall by several decibels as the reflector moves a few millimetres along the beam, so echo height is not a reliable guide to reflector size there. And the beam is narrowest, and most sensitive to small reflectors, around the end of the near field, where it naturally converges before spreading. Probes for sizing reflectors are therefore chosen so that the region of interest lies beyond about one near field length, or a delay line is used to move the near field out of the part.

Beyond the near field the beam spreads as a cone. The half-angle depends only on the ratio of wavelength to diameter: a larger probe, or a higher frequency, makes a narrower beam. The beam has no sharp edge; the −6 dB half-angle, where the pressure has halved, is the usual working definition of its width, and the first null marks the edge of the main lobe.

```figure
type: compare
title: The mill's straight-beam probes in steel
cols: Wavelength | Near field N | −6 dB half-angle | First null half-angle
rowhead: Probe
- 10 mm, 5 MHz, thickness and lamination checks | 1.18 mm | 21.1 mm | 3.5° | 8.3°
- 12 mm, 5 MHz | 1.18 mm | 30.4 mm | 2.9° | 6.9°
- 24 mm, 2 MHz, shaft end face | 2.96 mm | 48.6 mm | 3.6° | 8.7°
- 24 mm, 4 MHz, alternative for the shaft | 1.48 mm | 97.3 mm | 1.8° | 4.3°
caption: This is an illustration. Longitudinal waves at 5,920 m/s. N = D² ÷ 4λ; sin γ₆ = 0.51λ ÷ D; sin γ₀ = 1.22λ ÷ D.
```

### Reading the table

A 10 mm, 5 MHz probe has a near field of 21 mm, so on the 10 mm vessel shell and the 7 mm juice line wall the whole wall lies within it. For thickness gauging that does not matter: the back wall is a large, flat reflector that fills the beam, and the gauge times its echo, not its height. For sizing small reflectors in the same wall, it matters a great deal, which is one reason thin-wall flaw sizing uses delay-line or dual-element probes.

On the roll shaft, the 24 mm, 2 MHz probe's near field ends 49 mm into the shaft, so both journal fillets, at 650 mm and 2,550 mm, lie well into the far field, where echo heights fall predictably with distance. The beam spreads at a −6 dB half-angle of 3.6°, so at the far fillet it is about 2 × 2,550 × tan 3.6° = 321 mm across between its −6 dB edges, most of the 450 mm journal. Chapter 9 uses that spread both as an advantage, since one probe position covers much of the cross-section, and as a cost, since spreading sound weakens with distance.

### How echoes fall with distance in the far field

Beyond about three near field lengths, the sound pressure on the beam axis falls in inverse proportion to distance, because the same energy spreads over a cone whose area grows with distance squared. How an echo falls depends on what returns it.

```figure
type: compare
title: How echo amplitude falls with distance in the far field, ignoring attenuation
cols: Falls as | Per doubling of distance | Why
rowhead: Reflector
- Large flat back wall square to the beam | 1 ÷ distance | 6 dB | the wall returns the whole spreading beam, which behaves as if from a mirror image of the probe
- Small disc or flat-bottomed hole smaller than the beam | 1 ÷ distance² | 12 dB | the sound reaching it and the sound it returns both spread
- Long side-drilled hole across the beam | 1 ÷ distance^1.5 | 9 dB | spreading in one direction only along the hole
caption: These are the far-field ideal laws for a flat circular probe. Material attenuation adds a further loss proportional to the path length, which Chapter 9 adds to the shaft's signal budget.
```

These laws are why reference reflectors of known size are placed at several depths when a test is calibrated. The distance–amplitude curve of Chapter 8 measures, rather than calculates, how the echo from a standard reflector falls with depth in the actual probe and material, so that each indication is compared with a reference at its own depth.

## Near-surface resolution and the dead zone

A single-element contact probe cannot hear while it is still ringing from its own transmitted pulse. For a short time after the pulse, typically a microsecond or so, the receiver is swamped and any echo from a reflector very close to the surface is lost in the ring-down. In steel, a microsecond of ring-down is about 3 mm of depth. This dead zone is why a single-element probe cannot measure thin walls or find reflectors just under the surface.

Two designs overcome it. A delay-line probe has a plastic block between element and part, so the ring-down is over before the echo from the part's surface arrives. A dual-element probe has separate transmitting and receiving elements, side by side and separated by an acoustic barrier, each on its own plastic delay angled slightly towards the other. The receiver does not hear the transmitter's ring-down, and the two beams cross in a focal zone a few millimetres below the surface. Dual-element probes are the standard for corrosion thickness gauging because they work on thin, rough and pitted walls and respond well to the deepest point of a pit within their footprint.

```figure
type: decision
title: Choosing a probe type for the mill's jobs
caption: This is an illustration. Starting points that each procedure then confirms on reference blocks.
- Corrosion thickness on juice line and vessel | Dual-element, 5 MHz, about 10 mm footprint | Works from about 1 mm; sees the bottom of pits; small V-path error corrected in calibration (Chapter 4)
- Precise thickness of smooth new plate | Single-element with delay line, 5 to 10 MHz | Echo-to-echo timing; best resolution on parallel surfaces
- Lamination check of the 12 mm insert plate | Dual-element or 10 mm single-element, 5 MHz | Lamination shows as a strong early echo with loss of back wall
- Butt welds in the 12 mm insert | Angle-beam shear wave, 4 MHz, 60° and 70° | Chapters 7 and 8
- Roll shaft from the end face | Single-element, 24 mm, 2 MHz | Far field at both fillets; low attenuation (Chapter 9)
```

## The mistake: a reducer that read twice its wall

During the juice line survey, the technician scanned the eccentric reducer downstream of the flow control valve, a known erosion spot outside the twelve condition monitoring locations. With a single-element 10 mm, 5 MHz probe left on the gauge from the lamination check, the lowest reading on the reducer was 5.2 mm, comfortably above the structural minimum. The reliability engineer, who had expected heavy wear at that spot after a bad season for sand in the cane, asked to see the A-scan, the trace of echo amplitude against time that the gauge can display behind its digital reading.

```figure
type: steps
title: Finding the doubled reading on the reducer
caption: This is an illustration. The gauge's echo detection skipped the first echo, hidden in the probe's ring-down, and locked onto the second.
- Digital reading at the worst spot | 5.2 mm, with a 10 mm single-element probe
- A-scan displayed | first back-wall echo barely visible on the tail of the ring-down; strong echoes at 5.2 and 7.8 mm
- Interpretation | echoes evenly spaced at 2.6 mm: the gauge had timed the second echo, not the first
- * Re-measured with the dual-element 5 MHz probe | 2.62 mm at the worst spot, 2.6 to 3.1 mm over an area 40 mm across
- Action | reducer below the 3.0 mm structural minimum: replaced during the slack season; dual-element probe made mandatory for corrosion readings
```

The A-scan showed a train of evenly spaced echoes at about 2.6, 5.2 and 7.8 mm, with the first barely visible on the tail of the probe's ring-down. A wall 2.6 mm thick returns its first back-wall echo only 0.88 µs after the pulse, inside the single-element probe's dead zone, and the gauge's detection had skipped it and timed the second echo, which had travelled the wall four times. Re-measured with the dual-element probe, the reducer's worst spot read 2.62 mm, below the line's 3.0 mm structural minimum, and the reducer was replaced before the crushing season.

A doubled reading is the most dangerous error in thickness gauging because it errs on the unsafe side and looks entirely plausible. It happens on thin walls below a probe's working minimum and on walls where the first echo is weakened by a rough or pitted back surface. Two defences work: using a probe whose range suits the walls being measured, and looking at the A-scan whenever a reading is lower than expected, higher than expected, or taken on a surface known to be corroded. The mill's procedure now requires both, and the reducer has been added to the survey as condition monitoring location 13.

## Flat probes on curved surfaces

A flat probe face on a pipe touches along a line, not over its whole face, and the couplant fills a wedge-shaped gap on either side. On the juice line's 168.3 mm outside diameter, a 10 mm probe face sits about 0.15 mm clear of the pipe at its edges, a gap the couplant fills easily, and the probe can be held steady by orienting the dual-element probe's acoustic barrier across the pipe's axis, so that both elements sit on the curve symmetrically. On small-bore pipe the gap grows quickly: the edge clearance of a face of width w on a pipe of outside diameter D is about w² ÷ 4D, so the same probe on a 26.7 mm DN20 pipe sits 0.94 mm clear at its edges and rocks. Small pipes need small-footprint probes or contoured shoes, and the gauge should be checked on a curved reference of similar diameter, because the couplant wedge adds a little delay and the beam enters a curved surface less squarely than a flat one.

## What the beam means for scanning

A thickness gauge reports one number for the area under its probe, and that number belongs to the strongest echo within the beam, usually from the thickest or the flattest part of the back wall. A dual-element probe responds well to the deepest pit within its footprint, but a pit smaller than the beam's focal spot, or tucked under its edge, may return an echo too weak to be detected beside the larger back-wall echo from the surrounding wall. Spot readings at fixed points can therefore miss isolated pits between them, and the probe's footprint sets the smallest area of local thinning a scan can be relied on to find. Chapter 5 turns that into the spacing of a survey grid and the decision on when to scan an area continuously.

## Exercise: choosing the frequency for the shaft probe

The mill owns two 24 mm straight-beam probes, at 2 MHz and 4 MHz, for the roll shaft. Using a longitudinal speed of 5,920 m/s, calculate for each probe the wavelength, the near field length, the −6 dB beam spread half-angle and the −6 dB beam width at the far journal fillet, 2,550 mm from the end face. Then say which probe gives the better chance of seeing the far fillet's whole circumference from one position, and what the other probe offers instead.

### Answer

**Given:** D = 24 mm; f = 2 MHz and 4 MHz; c = 5,920 m/s; path to the far fillet L = 2,550 mm.

**Assumptions:** flat circular probes; far-field beam spread from the −6 dB rule; beam width measured across the axis at the fillet's distance, ignoring the shaft's sides.

**Method:** λ = c ÷ f; N = D² ÷ 4λ; sin γ₆ = 0.51λ ÷ D; width = 2L tan γ₆.

**2 MHz:** λ = 5.920 ÷ 2 = 2.96 mm; N = 576 ÷ (4 × 2.96) = 48.6 mm; sin γ₆ = 0.51 × 2.96 ÷ 24 = 0.0629, γ₆ = 3.61°; width = 2 × 2,550 × tan 3.61° = 321 mm.

**4 MHz:** λ = 1.48 mm; N = 576 ÷ 5.92 = 97.3 mm; sin γ₆ = 0.51 × 1.48 ÷ 24 = 0.0315, γ₆ = 1.80°; width = 2 × 2,550 × tan 1.80° = 160 mm.

**Result:** at the far fillet, the 2 MHz beam is 321 mm wide between its −6 dB edges, the 4 MHz beam 160 mm. The journal is 450 mm in diameter, so neither covers its whole circumference from the centre of the end face, but the 2 MHz beam covers far more of it; with the probe placed at four positions 90° apart, each 150 mm from the centre of the end face, every point of the fillet’s circumference lies within 160 mm of a beam axis, inside the 2 MHz beam’s −6 dB edges.

**Interpretation:** the 4 MHz probe offers a shorter wavelength, which helps to find smaller cracks and to separate echoes from the fillet and nearby features, and a narrower beam that locates an indication more precisely. It pays for that with higher attenuation over the 5.1 m round trip, which Chapter 9 shows is decisive in the forged steel of the shaft. The 2 MHz probe is the right first choice; the 4 MHz probe is a follow-up tool for an indication found at the near fillet.

**Verification:** halving the wavelength should double the near field and roughly halve the spread, as the results show: 97.3 ÷ 48.6 = 2.00, and 3.61 ÷ 1.80 = 2.01.
