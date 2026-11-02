---
book: ultrasonic-testing-by-the-numbers
chapterSlug: echoes-interfaces-and-couplant
order: 2
title: "Echoes, interfaces and couplant"
description: "Acoustic impedance, how much sound reflects and crosses at each interface, decibels, why couplant is needed, what a coating does to a reading and why cracks reflect so strongly."
draft: false
---

Ultrasonic testing works because sound reflects at boundaries. A pulse travelling through steel carries on unchanged until it meets something with different acoustic properties: the far surface, a crack, a slag inclusion, a lamination, a layer of paint. There, part of it reflects and part carries on. How much does each depends on one property of each material, its acoustic impedance, and the same rule explains why a probe held on a dry surface sends almost nothing into the steel, why a crack full of air is such a good reflector, and why a painted wall reads thicker than it is.

This chapter works out the reflection and transmission at the interfaces the mill's technician meets, introduces the decibel arithmetic every ultrasonic instrument uses, and finishes with a painted vessel shell that read three-quarters of a millimetre too thick.

## Acoustic impedance

A sound wave is a travelling pattern of pressure and particle velocity. In a given material, the ratio of the two is fixed: acoustic impedance, the product of density and sound speed. A dense, stiff material like steel needs a large pressure to produce a given particle velocity; water needs much less, and air almost none. Impedance is measured in rayls, kg/(m²·s), and the values for solids and liquids are conveniently written in millions of rayls, MRayl.

When a wave meets a boundary between two materials, the pressure and particle velocity must be the same on both sides of the boundary at every instant. If the impedances differ, the incoming wave alone cannot satisfy both conditions, and a reflected wave forms to make up the difference. The bigger the mismatch, the bigger the reflection.

```figure
type: formula
title: Impedance, reflection and transmission at a flat boundary, normal incidence
formula: Z = ρ × c
formula: R = (Z₂ − Z₁) ÷ (Z₂ + Z₁)        T = 2Z₂ ÷ (Z₂ + Z₁)
formula: Energy reflected = R²        Energy transmitted = 1 − R²
formula: Round trip through the same boundary, in and out: amplitude factor = 1 − R²
caption: The wave travels from material 1 into material 2. R and T are pressure amplitude ratios. A negative R means the reflected pulse is inverted, as at a steel–air boundary.
- Z | acoustic impedance, kg/(m²·s), written in MRayl
- R, T | pressure reflection and transmission coefficients
```

A pressure transmission coefficient greater than one, which the formula gives for sound passing from water into steel, does not create energy. The transmitted wave has a higher pressure but a much smaller particle velocity, and the energy it carries, which depends on both, is only the 12% left after reflection. Energy is always shared as R² reflected and 1 − R² transmitted.

## The mill's interfaces

The technician's work involves steel against six other materials: couplants between probe and part, the juice inside the pipe, paint on the vessel, slag in a weld, and air in cracks, laminations and gaps.

```figure
type: compare
title: Acoustic impedance and reflection at a steel boundary
cols: Density × speed | Impedance | Energy reflected | Round trip in and out
rowhead: Material against steel
- Water at 20 °C | 998 × 1,483 | 1.48 MRayl | 88.0% | −18.4 dB
- Glycerine | 1,260 × 1,920 | 2.42 MRayl | 81.2% | −14.5 dB
- Light oil | 870 × 1,400 | 1.22 MRayl | 90.0% | −20.0 dB
- Couplant gel | 1,050 × 1,600 | 1.68 MRayl | 86.5% | −17.4 dB
- Epoxy paint | 1,150 × 2,400 | 2.76 MRayl | 78.8% | not used
- Air | 1.2 × 343 | 0.0004 MRayl | 99.996% | −89 dB
caption: This is an illustration. Steel: 7,850 kg/m³ × 5,920 m/s = 46.47 MRayl. The couplant, paint and gel properties are typical values assumed for illustration. The round trip is the amplitude factor 1 − R² for a thick layer; thin contact layers are discussed in the text.
```

Two lessons stand out. The first is that steel is so much stiffer than any liquid that most of the sound reflects at every liquid–steel boundary. Only 12% of the energy crosses from water into steel, and an echo that crosses the boundary twice, in and back out, returns with 12% of the amplitude it would have had with no boundary, 18.4 dB down. This loss is the same for every echo, the back wall and the flaw alike, so it cancels when echoes are compared, which is why calibration on a reference block of the same material and surface matters more than the couplant's exact properties.

The second lesson is air. Its impedance is about one hundred thousandth of steel's, and a steel–air boundary reflects 99.996% of the energy. A probe placed on a dry surface sends practically nothing into the part: the round trip loses 89 dB, a factor of nearly thirty thousand. The same fact makes cracks, laminations and lack of fusion good reflectors. Even a gap a few micrometres wide, filled with air, reflects almost all the sound that reaches it.

### Why couplant matters more than which couplant

In contact testing, the couplant is not a thick layer but a film a few hundredths of a millimetre thick between the probe's wear face and the steel. A film much thinner than the wavelength does not behave like the thick layer of the table: sound passes through it almost as if it were not there, and the transmission is set mainly by the probe's wear face and the steel, provided the film is continuous. The couplant's job is to push the air out. Its impedance matters a little, and glycerine-based couplants transmit somewhat better than light oils for that reason, but continuity matters far more. A dry patch the size of a fingernail under a 10 mm probe face can cost 10 dB or more; a change from gel to glycerine typically gains a decibel or two.

Rough, rusty or scaled surfaces hold air in their hollows. The cure is surface preparation, a thicker couplant that fills the hollows, or both. On the juice line, where the outside surface is lightly rusted under failed paint, the technician wire-brushes each location to bright metal over a 50 mm square and uses a gel couplant rated for surfaces up to 150 °C, because the line runs at about 105 °C if it is inspected during a short stop and water-based gels boil off.

## Decibels

Ultrasonic instruments express signal heights and gains in decibels because the ratios involved span many orders of magnitude, from the 89 dB of an air gap to the fraction of a decibel separating two good readings. For amplitudes, the decibel difference between two signals is twenty times the logarithm of their ratio.

```figure
type: formula
title: Decibels for echo amplitudes
formula: ΔdB = 20 × log₁₀(A₂ ÷ A₁)
formula: 6 dB ≈ ×2   ·   12 dB ≈ ×4   ·   20 dB = ×10   ·   40 dB = ×100
caption: Decibel changes add where ratios multiply: an echo that loses 18.4 dB at the couplant and 4.6 dB at a slag inclusion is 23.0 dB below the same echo with neither.
- A₁, A₂ | echo amplitudes, for example screen heights
```

A flaw detector has a calibrated gain control in decibels. To compare two echoes, the technician brings each to the same screen height, usually 80% of full screen, and reads the gain needed. An echo that needs 14 dB more gain than the reference echo is 14 dB smaller, a factor of five. This method avoids relying on the screen's linearity and is the basis of the distance–amplitude curves of Chapter 8.

## Reflectors inside the steel

The same impedance rule describes what happens when the pulse meets something inside the metal or at its far side.

```figure
type: bars
title: Echo amplitude reflected at different boundaries, share of a perfect reflector
unit: %
max: 100
caption: This is an illustration for a large, flat reflector square to the beam. Steel to air: R = −1.000, 0 dB. Steel to juice (1,050 × 1,550 = 1.63 MRayl): R = −0.932, −0.6 dB. Steel to slag (3,000 × 4,000 = 12 MRayl, assumed): R = −0.590, −4.6 dB. Real echoes also depend on the reflector’s size, shape and orientation.
- * Back wall against air, empty pipe | 100
- Back wall against juice, full pipe | 93.2
- Slag inclusion, large and flat | 59.0
```

**The back wall.** At the inside of an empty pipe the pulse meets air and reflects completely, inverted. With the pipe full of juice, 93% of the amplitude still reflects, so the back-wall echo is only 0.6 dB lower; a thickness gauge works equally well on a full or empty line.

**Cracks, laminations and lack of fusion.** These are thin gaps filled with air or, in service, with corrosion product and liquid. Even when liquid fills them, a gap whose faces are not in intimate contact reflects strongly. A crack under compressive stress, with its faces pressed together, can transmit some sound, which is one reason a crack's echo can change when a part is loaded.

**Slag and other inclusions.** Non-metallic inclusions have impedances between liquids and steel, so they reflect less than a gap of the same size. Taking slag as 12 MRayl, a large flat inclusion would reflect 59% of the amplitude, 4.6 dB below a crack of the same area. Real inclusions are rounded and irregular, which scatters sound away from the probe and lowers the echo further.

**Porosity.** Gas pores are small spheres. Each reflects strongly at its surface, but a sphere sends most of the sound sideways, so a pore returns a small echo for its size, and a cluster of pores returns a group of small echoes.

### Size, shape and orientation dominate

The impedance mismatch sets the most a reflector can return. What it actually returns depends on its size relative to the beam and wavelength, its shape, its smoothness and, above all, its angle to the beam. A smooth planar crack tilted more than a few degrees from square to the beam reflects its sound away from the probe, like a mirror tilted away from a torch. That is why weld testing scans from several angles and directions, and why Chapter 8 relates echo height to reflector size only through reference reflectors of known size and orientation, never through impedance alone.

## Coatings and the echo-to-echo method

A coating, such as paint or a rubber lining, adds a layer that the pulse must cross before it reaches the steel. A thickness gauge in its ordinary mode measures the time from the start of the pulse, corrected for the probe's own delay, to the first back-wall echo. That time includes the trip through the coating. The gauge, set for steel, converts the whole time at steel's speed, and because the coating is slower than steel, its thickness appears multiplied by the ratio of the speeds.

The cure is to time something that does not include the coating. Successive back-wall echoes, the first, second and third bounce within the steel, are separated in time only by trips through the steel. A gauge in echo-to-echo mode measures the interval between two successive back-wall echoes and ignores the coating entirely.

```figure
type: svg
title: Why echo-to-echo timing excludes a coating
alt: A cross-section of a painted steel wall with a probe on top. The pulse passes down through the paint into the steel, reflects from the back wall several times, and each echo returns through the paint. A timeline below shows the paint delay at the start, then the first, second and third back-wall echoes evenly spaced, with the steel-only interval between first and second echoes highlighted.
caption: This is an illustration. The first back-wall echo arrives after the paint and steel delays together; the interval between successive back-wall echoes contains only the steel.
viewbox: 0 0 640 300
body:
<rect class="bxi" x="250" y="20" width="140" height="34" rx="3"/>
<text class="txb" x="290" y="43">probe</text>
<rect class="bxa" x="60" y="58" width="520" height="16"/>
<text class="tx txs" x="590" y="70">paint</text>
<rect class="bx" x="60" y="74" width="520" height="90"/>
<text class="tx txs" x="590" y="124">steel</text>
<path class="la" d="M300 58 L300 164 M320 164 L320 74 M340 74 L340 164 M360 164 L360 74"/>
<path class="ah" d="M295 156 L300 164 L305 156 Z"/>
<path class="ln" d="M60 250 L590 250"/>
<text class="tx txs" x="60" y="275">time →</text>
<path class="li" d="M80 250 L80 205"/>
<text class="tx txs" x="66" y="198">pulse</text>
<path class="li" d="M210 250 L210 215"/>
<text class="tx txs" x="182" y="208">1st echo</text>
<path class="li" d="M330 250 L330 222"/>
<text class="tx txs" x="302" y="215">2nd echo</text>
<path class="li" d="M450 250 L450 230"/>
<text class="tx txs" x="422" y="223">3rd echo</text>
<path class="la" d="M210 262 L330 262"/>
<text class="txa" x="222" y="292">steel only</text>
<path class="dsh ln" d="M80 262 L210 262"/>
<text class="tx txs" x="98" y="292">paint + steel</text>
```

Echo-to-echo measurement needs at least two clean back-wall echoes, which a heavily corroded or pitted back wall may not give. On such surfaces the coating must be removed at the measurement point, or its thickness measured separately and subtracted after conversion at its own speed.

## The mistake: a painted shell that read thick

The flash vessel V-12 was repainted three years ago with a two-coat epoxy system about 0.30 mm thick. The survey grid on its shell had always been measured with the paint removed at each point. This season, to save time, a new technician measured through the paint with a dual-element probe in the gauge's standard mode.

The readings came back between 10.6 and 10.9 mm on a shell supplied as 10 mm plate. Plate can be supplied a little over nominal, but the previous survey, on bare spots, had read 9.8 to 10.1 mm. Every point had apparently gained about 0.75 mm of steel.

```figure
type: steps
title: Explaining the thick readings on V-12
caption: This is an illustration. The epoxy's speed, 2,400 m/s, is an assumed typical value; measured on a painted coupon it gave the same answer to within 0.02 mm.
- Readings through paint | 10.6 to 10.9 mm, against 9.8 to 10.1 mm last survey on bare metal
- Average gain | about 0.75 mm at every point, a constant offset, not a ratio
- Paint 0.30 mm at 2,400 m/s, converted at 5,920 m/s | appears as 0.30 × 5,920 ÷ 2,400 = 0.74 mm of steel
- * Gauge switched to echo-to-echo mode | readings 9.86 to 10.12 mm, matching the previous survey
- Procedure changed | coated surfaces measured echo-to-echo, or paint removed; mode written on the survey sheet
```

The pattern of the error told the reliability engineer what kind of error it was. A velocity error is a ratio: every reading wrong by the same percentage, as in Chapter 1. This error was an offset: every reading wrong by the same amount, about three-quarters of a millimetre. An offset points to something added to every time measurement, and a 0.30 mm coat of paint at less than half steel's sound speed adds the equivalent of 0.74 mm of steel. Re-measured in echo-to-echo mode, the shell read 9.86 to 10.12 mm, consistent with the previous survey.

Had the inflated readings been accepted, the corrosion rate calculated in Chapter 6 for V-12 would have been negative for this survey and then strongly positive at the next bare-metal survey, giving an apparent loss of three-quarters of a millimetre in one interval and possibly an unnecessary shortening of the inspection interval. The procedure now names the gauge mode for every coated item, and the survey sheet has a column for it.

## Exercise: couplant for a hot line

During a two-day stop in the crushing season, the reliability engineer wants spot thickness readings on the juice line at its operating temperature of about 105 °C. Two high-temperature couplants are available: a glycerine-based paste and a light synthetic oil, with the impedances in this chapter's table. A third option is a water-based gel, which works well at room temperature. Using the thick-layer figures, calculate the energy transmitted into the steel and the round-trip amplitude loss for each couplant, and the difference between the best and the worst in decibels. Then decide which to use and what matters more than the choice.

### Answer

**Given:** steel 46.47 MRayl; glycerine 2.42 MRayl; light oil 1.22 MRayl; water-based gel 1.68 MRayl at room temperature.

**Assumptions:** normal incidence; thick-layer coefficients used to rank the couplants; the wear face of the probe ignored.

**Method:** R = (Z_steel − Z_c) ÷ (Z_steel + Z_c); energy transmitted 1 − R²; round-trip amplitude factor 1 − R², converted to decibels.

**Glycerine:** R = (46.47 − 2.42) ÷ 48.89 = 0.901; 1 − R² = 0.188, so 18.8% of the energy crosses, and the round trip is 20 log₁₀(0.188) = −14.5 dB.

**Light oil:** R = (46.47 − 1.22) ÷ 47.69 = 0.949; 1 − R² = 0.0996, or 10.0%, and −20.0 dB.

**Water-based gel:** R = (46.47 − 1.68) ÷ 48.15 = 0.930; 1 − R² = 0.135, or 13.5%, and −17.4 dB; but at 105 °C its water boils off, leaving air.

**Difference between best and worst usable couplant:** −14.5 − (−20.0) = 5.5 dB, a factor of 1.9 in amplitude.

**Decision:** use the glycerine paste, which is rated for the temperature and transmits best. The water-based gel is unusable hot: once it dries, the air gap costs about 89 dB and the gauge loses its echo.

**Interpretation:** in contact testing the film is thin and the real difference between glycerine and oil is smaller than 5.5 dB, but the ranking holds. What matters more is continuity: a dry patch or bubble costs far more than the choice of couplant. Hot readings also need a probe rated for the temperature, short contact times to protect it, and the temperature correction to the velocity in Chapter 4, which at 105 °C changes readings by about 1.5%.

**Verification:** energies reflected and transmitted must add to one for each couplant, as they do (81.2% + 18.8%, 90.0% + 10.0%, 86.5% + 13.5%), and the decibel difference matches 20 log₁₀(0.188 ÷ 0.0996) = 5.5 dB.
