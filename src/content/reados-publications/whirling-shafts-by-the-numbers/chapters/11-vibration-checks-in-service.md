---
book: whirling-shafts-by-the-numbers
chapterSlug: vibration-checks-in-service
order: 11
title: "Vibration checks in service"
description: "Reading a rotating machine's vibration: levels, trends and spectra, what 1×, 2× and other peaks point to, bearing defect frequencies, and the wrong bearing geometry that hid a failing race."
draft: false
---

A rotating machine reports its own condition through its vibration. Unbalance, a soft foundation, misalignment, looseness, a failing bearing and a resonance each leave a recognisable signature, and most can be read with a portable meter and a little arithmetic long before they cause a failure. The earlier chapters of this book used vibration readings to diagnose a near-critical prototype, a soft mezzanine, a mirror-image balance weight and a static-only balance. This chapter sets out how the HM-30's maker and its customers measure and read vibration in service, uses a BIZOMAT tool to identify a bearing defect, and describes how the wrong bearing data nearly hid one.

## What to measure

For machines like the HM-30, the usual measurement is vibration velocity on the bearing housings, in millimetres per second, as a root-mean-square value over a broad frequency range. Velocity suits machines running at hundreds to thousands of revolutions per minute because it relates well to the energy of the vibration and so to its potential for damage. Readings are taken in three directions at each bearing, vertical, horizontal and axial, because different faults show in different directions: Chapter 4's soft mezzanine showed mostly horizontally, and misalignment shows strongly axially.

General guidance on evaluating machine vibration by measurements on non-rotating parts, including how to measure and how to set zones of acceptability for classes of machine, is given in the ISO 20816 series, with Part 1 covering general guidelines. A maker sets its own acceptance and alarm levels for each product, informed by such guidance and its own records. This is an illustration. The HM-30's maker uses:

```figure
type: range
title: HM-30 vibration levels at the bearing housings
min: 0
max: 10
unit: mm/s
ticks: 0 | 2.5 | 5 | 8 | 10
caption: This is an illustration. Overall velocity, RMS, any direction, on a stiff foundation. The values are the case maker's own settings, not quotations from a standard.
- New or rebalanced, acceptable for handover | 0 | 2.5
- * Acceptable for continued running | 2.5 | 5.0
- Alarm: investigate at the next opportunity | 5.0 | 8.0
- Trip: stop and investigate before restarting | 8.0 | 10
```

### Trends matter more than single readings

An overall level within the acceptable band says little on its own. A level that has doubled since the last reading, even if it is still within the band, says a great deal. The maker's service plan asks for a baseline reading at commissioning, readings after every hammer change, and monthly readings in between, all at the same points marked on the housings, with the mill in the same state, empty or grinding. A plot of those readings against time is the single most useful record a customer can keep.

## Reading a spectrum

A spectrum breaks the vibration into its frequencies, and frequencies point to causes. The reference is the running speed: 2,950 rpm is 49.17 Hz, called 1×. Frequencies are often stated as orders, multiples of 1×.

```figure
type: compare
title: Common peaks in a rotating machine's spectrum and what they suggest
cols: Frequency | Typical direction | Suggests | Where in this book
rowhead: Peak
- * 1× running speed, steady | radial, in phase or with a steady phase | unbalance; amplified near a critical speed | Chapters 1, 5 to 7
- 1× with a large axial component, often with 2× | axial | misalignment of the coupling | below
- Many harmonics of 1×, sometimes ½× | radial | mechanical looseness, a cracked foot, a loose bearing | Chapter 9's loose cap bolts
- A little under ½× | radial | oil whirl in fluid-film bearings | Chapter 4
- Non-integer multiples, with harmonics | radial | rolling bearing defects | this chapter
- 2× supply frequency, 100 Hz on 50 Hz | radial, at the motor | electrical: uneven air gap or a motor fault | motor specialist
caption: The table is a starting point for diagnosis, not a set of rules. Most faults produce more than one peak, and confirmation needs phase readings, trends and physical inspection.
```

### Unbalance or resonance?

A large 1× peak is the signature of unbalance, but Chapters 1 and 4 showed that a resonance near running speed amplifies a small unbalance into a large 1× peak. The two have different cures, and phase readings tell them apart. A resonance shows a large phase change between nearby measurement points, and the phase shifts sharply if the speed is changed a little; it also shows in a bump test. A plain unbalance on a stiff machine shows a steady phase and a level that rises smoothly with speed. Balancing a machine that is really resonant reduces the symptom but leaves the machine as sensitive as before, as the mezzanine in Chapter 4 showed.

### Misalignment

A misaligned coupling forces the shafts to bend or the coupling to flex twice per revolution, producing 2× vibration and large axial vibration at 1×. The HM-30's flexible coupling tolerates small misalignment, but the coupling maker's limits are much tighter than what can be judged by eye; the shafts are aligned with dial indicators or a laser system at installation and checked after any work on the motor or pillow blocks.

### Taking a reading that can be compared

A trend is only as good as the consistency of its readings. The HM-30's maker marks a small flat spot on each bearing housing, vertical, horizontal and axial, and asks that every reading be taken there, with the sensor on a magnet seated firmly on the clean flat, with the same instrument settings and with the mill in the same state, running empty after a few minutes' warm-up. A sensor held by hand, placed on a curved casting or on a guard instead of the housing, or a reading taken while grain is feeding unevenly, can differ by more than the change being looked for. The record notes the date, speed, state and instrument for every reading.

## Rolling bearing defect frequencies

A rolling bearing with a defect, a spall on a race or a damaged roller, produces a small impact every time a rolling element passes over it. The rate of those impacts depends only on the bearing's geometry and the shaft speed, so each kind of defect has its own frequency, usually not a whole multiple of the running speed:

```figure
type: formula
title: Rolling bearing defect frequencies, outer race stationary
formula: Outer race defect (BPFO): (n ÷ 2) × f_r × (1 − (d ÷ D) × cos φ)
formula: Inner race defect (BPFI): (n ÷ 2) × f_r × (1 + (d ÷ D) × cos φ)
formula: Rolling element spin (BSF): (D ÷ 2d) × f_r × (1 − ((d ÷ D) × cos φ)²)
formula: Cage (FTF): (f_r ÷ 2) × (1 − (d ÷ D) × cos φ)
caption: These are kinematic frequencies assuming pure rolling with no slip. Real bearings slip slightly, so measured peaks usually fall within a percent or two of them.
- n | number of rolling elements in one row
- f_r | shaft rotation frequency, Hz
- d | rolling element diameter, mm
- D | pitch diameter, mm
- φ | contact angle
```

The BIZOMAT [Bearing defect frequency check](/tools/bearing-defect-frequency-check/) tool calculates the four frequencies from the shaft speed, number of rolling elements, element diameter, pitch diameter and contact angle, in hertz, cycles per minute and orders of shaft speed, with their first three harmonics. Given a measured peak and a matching tolerance, it reports which defect frequency or harmonic the peak matches, if any, and how closely. Its check reminds the user to confirm with the envelope spectrum, sidebands, the trend and physical inspection before replacing a bearing.

### A peak at 348.9 Hz

This is an illustration. Eighteen months after commissioning, an HM-30's monthly readings showed the overall level at the non-drive-end bearing creeping up, from 2.1 to 3.4 mm/s over three months, still in the acceptable band. The spectrum showed a new peak at 348.9 Hz, with a smaller one at 697.3 Hz, and an envelope spectrum (a processed spectrum that brings out repetitive impacts) showed the same frequencies clearly. Neither was a multiple of 49.17 Hz.

The bearing is a double-row spherical roller bearing; the technician took its geometry from the bearing maker's data for the exact designation stamped on the bearing: 17 rollers per row, 22 mm roller diameter, 130 mm pitch diameter, 10° contact angle.

```figure
type: compare
title: Defect frequencies of the HM-30 non-drive-end bearing at 2,950 rpm
cols: Frequency, Hz | Order of shaft speed | Measured peak
rowhead: Defect
- * Outer race (BPFO) | 348.27 | 7.083 | 348.9 Hz, within 0.18%; 697.3 Hz is its second harmonic, within 0.11%
- Inner race (BPFI) | 487.57 | 9.917 | no peak
- Rolling element spin (BSF) | 141.23 | 2.872 | no peak
- Cage (FTF) | 20.49 | 0.417 | no peak
caption: This is an illustration. Bearing geometry for the case, not a particular maker's bearing. Shaft frequency 49.17 Hz.
```

The tool matched the 348.9 Hz peak to the outer race defect frequency within 0.18%, and the 697.3 Hz peak to its second harmonic. Outer race defects are often the first to appear in a bearing whose outer ring sits stationary in its housing, because the defect stays in the loaded zone. The bearing was replaced at the next planned stop, two weeks later; the removed outer race had a spall about 6 mm long in the load zone.

### How a bearing defect develops

Rolling bearing damage usually develops through recognisable stages, which is why monthly readings can catch it in time. At first, a tiny spall produces impacts too small to show in the overall level; they appear only in high-frequency measurements and the envelope spectrum. As the spall grows, the defect frequency and its harmonics appear in the ordinary spectrum, with sidebands at the shaft frequency if the defect is on the rotating race. Later the peaks spread into a raised, noisy floor, the overall level rises noticeably, and the bearing runs warm and sounds rough. In the last stage, the clearance grows, the 1× vibration rises as the shaft moves in the worn bearing, and failure can follow quickly. The time between stages varies from weeks to many months with load, lubrication and contamination, so the right response to a confirmed defect frequency is to plan a replacement, not to wait for the next stage.

### Envelope analysis

The impacts from a small defect are short and sharp, and the energy in each is spread over a high frequency range where it excites the bearing housing's own natural frequencies, usually in the kilohertz range. In an ordinary velocity spectrum those high-frequency rings are weak and mixed with everything else. An envelope spectrum filters the signal to the high-frequency band where the rings are, follows the envelope of their amplitude, and then finds the frequencies at which that envelope repeats, which are the impact rates. It turns a faint, high-frequency rattle into a clear peak at the defect frequency, often months before the defect shows in the overall level. Most data collectors used for machinery monitoring offer it, and the HM-30's service plan uses it at every monthly reading of the non-drive-end bearing, the one most exposed to the mill's dust.

## The error: the wrong bearing's data

This is an illustration. On another HM-30, a similar rising trend and a peak at 348.9 Hz appeared. The site's own technician calculated the defect frequencies from a bearing data sheet in the maintenance office, which showed 18 rollers of 20 mm on a 128 mm pitch diameter with no contact angle, and found an outer race frequency of 373.4 Hz and an inner race frequency of 511.6 Hz. Nothing matched the measured peak within 2%, and the technician concluded that the peak was "not a bearing frequency" and probably structural. The mill ran on. Five weeks later the bearing failed, and the rotor dropped onto the housing's seal, damaging the shaft.

The data sheet was for the bearing originally specified in the HM-30's first design, which had been replaced in production by a different design with 17 larger rollers. The bearing in the machine was stamped with its designation; the data sheet was not. With the correct geometry the peak matched the outer race frequency within 0.2%, as it had on the first machine.

```figure
type: checklist
title: Before deciding a peak is or is not a bearing frequency
caption: The open item is the one the site technician skipped.
- Shaft speed measured, not taken from the nameplate | slip changes it by a percent or two
- ? Bearing geometry taken from the bearing actually fitted | read the designation stamped on it or recorded at installation
- Harmonics and sidebands checked | a real defect usually shows harmonics; inner race defects show 1× sidebands
- Envelope spectrum used for early defects | it brings out repetitive impacts
- Trend reviewed | a defect frequency that grows is a defect
- Confirmed by inspection or by the next stop | before a costly replacement, but not after a failure
```

The maker added the bearing designations, and their defect frequencies at 2,950 rpm, to the HM-30's manual, and the customer's maintenance system now records the designation of every bearing at installation.

## The machine's record

The whole of this book comes together in one page of records for each machine. The HM-30's maker supplies, and asks its customers to keep:

- the rotor's balance record: grade, residual unbalance in each plane, correction weights and their positions;
- the critical speed estimate and the bump-test frequencies on the factory plinth and on site;
- the foundation's stiffness requirement and how it was met;
- the bearing designations and their defect frequencies;
- the vibration baseline at commissioning and the acceptance, alarm and trip levels;
- each hammer change, with the set's weights and the vibration afterwards;
- the speed limit, the drive's locked settings and the starting limits.

Every item on that list answers a question that one of this book's errors raised too late. A machine that keeps it can be diagnosed in an afternoon; one that does not is diagnosed from scratch, often after it has failed.

## Bringing it together

The eleven chapters of this book follow one rotor from a prototype that shook to a machine that reports its own condition. Their lessons fit together. A spinning shaft is a spring with a natural frequency, and the rotor's running speed must be kept well away from it, with a margin defined in one agreed form and checked with the conservative estimate. The shaft's stiffness, not its strength, usually sets its size on a fast, heavy rotor, and the stiffness of the bearings, pedestals and foundation counts just as much as the shaft's. Unbalance is a rotating force that grows with the square of speed, and a balance grade turns a rotor's mass and speed into a tolerance in gram-millimetres; long rotors need two planes, and hammer mills keep their balance through weighed sets and maintenance discipline more than through machining. Speed multiplies every centrifugal load, so a rotor's maximum speed is a design limit to be protected, not a setting to be tuned. A rotor whose axis turns feels gyroscopic loads; a heavy rotor's start puts its stored energy through the motor as heat. And in service, vibration measured consistently, trended and read against the running speed and the bearings' own frequencies tells the owner what is changing before it fails.

## Exercise: a peak at a lower speed

This is an illustration. A customer runs an HM-30 on a variable-speed drive at a reduced speed of 2,900 rpm for a fine-grind product. A peak appears at 342.9 Hz at the non-drive-end bearing, the bearing whose geometry is in the table above.

1. What is the shaft frequency?
2. What is the outer race defect frequency at this speed? (It scales directly with speed.)
3. Does the peak match it within 2%?
4. What would you do next?

**Worked answer.**

1. 2,900 ÷ 60 = **48.33 Hz**.
2. The order is unchanged, 7.083, so BPFO = 7.083 × 48.33 = **342.3 Hz**.
3. (342.9 − 342.3) ÷ 342.3 = **0.16%**: it **matches**.
4. Check for the second harmonic near 684.7 Hz and in the envelope spectrum, compare with the trend, and plan a bearing change at the next stop. Record the speed with every reading: a defect frequency means nothing until it is compared with the shaft speed at which it was measured.
