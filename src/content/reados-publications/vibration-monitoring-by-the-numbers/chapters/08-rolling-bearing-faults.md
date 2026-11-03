---
book: vibration-monitoring-by-the-numbers
chapterSlug: rolling-bearing-faults
order: 8
title: "Rolling bearing faults"
description: "Where a rolling bearing's defect frequencies come from, calculating them, the stages of bearing damage, envelope analysis, lubrication faults, and a 3× peak taken for an outer-race defect."
draft: false
---

Rolling bearings fail in a way that vibration monitoring is especially good at catching. A defect starts small, a crack under the surface of a race or a dent from contamination, and grows into a spall over weeks or months, and each time a ball rolls over it there is a small impact. The impacts repeat at a rate set by the bearing's geometry and speed, they ring the bearing and its housing at high frequencies, and they show in the vibration long before the bearing runs hot or noisy. The P-F interval of Chapter 1, about eight weeks for the mill's bearings, is mostly the time between the first detectable impacts and failure.

This chapter derives the four bearing defect frequencies, calculates them for P-4's 6309 bearing with the bearing defect frequency tool, follows a defect through its four stages, explains envelope analysis, which finds defects in their early stages, considers lubrication faults, and finishes with a peak at three times running speed that was diagnosed as an outer-race defect because it fell within the tool's matching tolerance.

## Where the defect frequencies come from

A deep-groove ball bearing has an inner race turning with the shaft, an outer race fixed in the housing, a set of balls, and a cage that keeps them evenly spaced. As the shaft turns, the balls roll around between the races and the cage turns at a speed between the two races' speeds. Four frequencies follow from that geometry.

```figure
type: formula
title: Rolling bearing defect frequencies, outer race stationary
formula: FTF = (f_s ÷ 2) × (1 − (d ÷ D) cos φ)
formula: BPFO = (n f_s ÷ 2) × (1 − (d ÷ D) cos φ)        BPFI = (n f_s ÷ 2) × (1 + (d ÷ D) cos φ)
formula: BSF = (D f_s ÷ 2d) × [1 − ((d ÷ D) cos φ)²]
caption: f_s is the shaft's rotational frequency, n the number of balls, d the ball diameter, D the pitch diameter and φ the contact angle. BPFO is the rate at which balls pass a point on the outer race, BPFI on the inner race; BSF is the ball's spin rate; FTF is the cage's rotation rate.
- FTF | fundamental train (cage) frequency
- BPFO, BPFI | ball pass frequencies, outer and inner race
- BSF | ball spin frequency
```

An outer-race defect sits still in the load zone, so every ball strikes it with the same force: BPFO and its harmonics, steady in amplitude. An inner-race defect turns with the shaft, passing in and out of the load zone once per revolution, so its impacts are modulated at the running speed: BPFI with sidebands spaced at 1×. A ball defect strikes both races as the ball spins, at twice BSF, and is carried round by the cage, so it is modulated at FTF. A cage problem itself shows at FTF, below the running speed. These modulation patterns are often more telling than the defect frequency itself: a family of peaks at BPFI with sidebands exactly 24.67 Hz apart points to the inner race as surely as the frequency does, and helps confirm a diagnosis when the bearing's geometry data are uncertain.

## P-4's 6309 bearing

The [bearing defect frequency check](/tools/bearing-defect-frequency-check/) calculates all four frequencies from the bearing's geometry and speed, gives their first three harmonics, and compares a measured peak with them within a tolerance. For P-4's 6309 bearing, taken for illustration as 8 balls of 17.462 mm on a 72.5 mm pitch diameter with a contact angle of 0°, at 1,480 r/min, the tool gives a shaft frequency of 24.67 Hz, BPFO of 74.90 Hz, BPFI of 122.43 Hz, BSF of 48.24 Hz and FTF of 9.363 Hz.

```figure
type: compare
title: Defect frequencies of P-4's 6309 bearing at 1,480 r/min
cols: Hz | Orders of running speed | Signature
rowhead: Frequency
- FTF, cage | 9.36 | 0.380 | below 1×; cage wear or damage
- BSF, ball spin | 48.24 | 1.956 | 2 × BSF with FTF sidebands for a ball defect
- * BPFO, outer race | 74.90 | 3.036 | steady peak and harmonics
- BPFI, inner race | 122.43 | 4.963 | peak and harmonics with 1× sidebands
caption: This is an illustration from the bearing defect frequency check, with typical geometry for a 6309; real geometry comes from the bearing maker. The frequencies are non-integer orders, which is how they are told from running-speed harmonics.
```

The non-integer orders are the key to recognising bearing frequencies. BPFO, at 3.036 orders, sits close to 3× but not on it, and its harmonics drift further away: 2 × BPFO at 6.07 orders, 3 × BPFO at 9.11. Running-speed harmonics stay at exact whole numbers. With enough resolution, the two families separate.

## Four stages of bearing damage

Bearing damage is commonly described in four stages, which help decide how urgent a finding is.

```figure
type: steps
title: Stages of a rolling bearing defect and what each shows
caption: Typical progression for guidance; the time in each stage varies widely with load, speed and lubrication.
- Stage 1 | microscopic damage; energy only at very high frequencies, tens of kilohertz; seen by ultrasonic and stress-wave methods
- Stage 2 | small defect; impacts ring the bearing's components at their natural frequencies, typically 1 to 5 kHz; envelope analysis begins to show defect frequencies
- * Stage 3 | visible spall; defect frequencies and harmonics clear in the velocity spectrum, with sidebands; envelope levels high; the time to plan replacement
- Stage 4 | extensive damage; defect frequencies merge into raised broadband noise and a rising 1×; noise and heat; failure close
```

The mill aims to replace bearings during stage 3, planned at the next convenient stop. Stage 2 findings shorten the machine's monitoring interval. Stage 4 findings mean the machine should be stopped as soon as the process allows.

## Envelope analysis

In stages 2 and early 3, a bearing defect's impacts are small and its defect frequencies are buried beneath the machine's much larger low-frequency vibration. But each impact rings the bearing and housing at their natural frequencies, in the kilohertz range, where there is little else. Envelope analysis exploits that. It filters the acceleration signal to keep only a high-frequency band where the ringing appears, say 2 to 5 kHz; takes the envelope of the filtered signal, a rectified and smoothed curve that rises with each burst of ringing and falls between them; and analyses the envelope's spectrum. The envelope repeats at the rate of the impacts, so its spectrum shows the defect frequency and its harmonics clearly, free of the running-speed vibration below.

```figure
type: compare
title: P-4's drive-end bearing on four routes, envelope spectrum
cols: Envelope at BPFO, 74.9 Hz | Harmonics | High-frequency acceleration
rowhead: Route
- Baseline | below noise | none | 0.12 g RMS
- Week 8 | 0.05 g | 2 × BPFO | 0.20 g
- Week 10 | 0.18 g | to 4 × BPFO, 1× sidebands absent | 0.41 g
- * Week 12 | 0.42 g | to 6 × BPFO | 0.60 g
caption: This is an illustration. The steady BPFO family without 1× sidebands pointed to the outer race; the bearing removed at week 15 had a spall about 4 mm long in the outer race's load zone.
```

P-4's envelope spectrum showed a small BPFO peak at the week 8 route and a growing family of harmonics after it, with no 1× sidebands, the signature of an outer-race defect in the load zone. The bearing was replaced at a planned stop at week 15. Its outer race had a spall about 4 mm long in the load zone. Chapter 4 told the same story from the alarm side: the high-frequency acceleration band rose fivefold while the overall velocity barely moved.

### Choosing the envelope band

The band filtered before enveloping must contain the ringing and as little else as possible. If it is set too low, it takes in harmonics of the running speed and gear mesh, which modulate the envelope and bury the bearing's frequencies; if it is set above the sensor's mounted range, it sees only noise. On P-4, an acceleration spectrum taken when the defect was first suspected showed a broad hump of raised energy between about 2 and 4 kHz, the housing's ringing, and the 2 to 5 kHz band was chosen to cover it. On G-3, whose gear mesh harmonics extend into the low kilohertz, the band was set higher, from 5 to 10 kHz, with a stud-mounted sensor, which Chapter 3 showed is needed to measure that high. Many instruments offer a few standard bands; the right one is the one that contains the machine's ringing and excludes its other strong sources.

## Lubrication

Not every rise in high-frequency energy is a defect. A bearing short of grease, or with grease that has degraded, runs with metal-to-metal contact between the balls and races, which produces broadband high-frequency noise without discrete defect frequencies. Regreasing such a bearing drops the noise within minutes. Over-greasing has its own signature, a rise in temperature and sometimes in high-frequency noise as the balls churn excess grease. The mill uses the high-frequency acceleration trend after each greasing as a check: a level that falls after greasing confirms the bearing needed it; one that does not fall, or rises, prompts a check of the grease quantity and type.

## Why bearings fail early

A rolling bearing's catalogue life is a fatigue life, the number of revolutions that 90% of a large group of identical bearings would complete before the first sign of fatigue, under the stated load and with clean, adequate lubrication. In industry, most bearings never reach it. The common causes of early failure are contamination, from dust, water or wear particles entering past seals or during regreasing; inadequate or wrong lubrication; misalignment and unbalance, which add loads the bearing was not sized for; poor fitting, with hammers, heat or the wrong fits; and electrical current through the bearing. Vibration monitoring detects the damage these cause, but preventing them is cheaper than detecting them. The mill's bearing failure records show contamination as the leading cause on its dusty sawmill machines, which led to better seals on F-2 and P-4 and to cleaning grease nipples and guns before each greasing.

## Slow machines

The chipper runs at about 500 r/min, 8.3 Hz, and its large spherical roller bearings have defect frequencies of only a few tens of hertz. The impacts from a defect at such low speed are gentle, and the high-frequency ringing they excite is weak, so slow-speed bearings are harder to monitor. The chipper's online sensors use a lower-frequency envelope band, longer measurements to resolve the closely spaced low frequencies, and more averages to lift the weak impacts above the noise. The chipper's own impacts, as its knives strike logs, are far larger than any bearing impact, so its bearing measurements are taken between logs, triggered by the chipper's load signal, a refinement only an online system can easily provide.

## Bearings on variable-speed drives

A motor fed from a variable-speed drive can develop voltages on its shaft that discharge through the bearings, each discharge pitting the races microscopically. Over months the pits form a regular washboard pattern, fluting, that produces vibration at a ball pass frequency and a characteristic noise. Insulated bearings or a shaft grounding ring on the motor prevent it. If P-4's motor is run from a drive, as the exercise below considers, the mill will fit a grounding ring at the same time, because fluting would otherwise look in the vibration data exactly like an ordinary outer-race defect.

## The mistake: a 3× peak called an outer-race defect

On the gearbox G-3's input bearing, also running at 1,480 r/min, a new technician found a peak at 74.0 Hz in the velocity spectrum, taken at the route's coarse setting. Entered in the bearing defect frequency check with the input bearing's geometry, which happened to be similar to P-4's 6309, the peak was reported as matching BPFO within 1.2%, inside the tool's 2% default tolerance, and the technician raised a work order to replace the bearing.

```figure
type: steps
title: Separating 3× running speed from BPFO
caption: This is an illustration. A tolerance wide enough to allow for speed and geometry uncertainty can also match a running-speed harmonic that happens to lie nearby.
- Peak | 74.0 Hz, matched to BPFO, 74.9 Hz, within 1.2%
- 3× running speed | 3 × 24.67 = 74.0 Hz, exactly
- Harmonics check | peaks at 148.0 Hz and 222.0 Hz (6× and 9×), none at 149.8 Hz or 224.7 Hz (2 and 3 × BPFO)
- Envelope spectrum | no BPFO family
- * Diagnosis | 3× from looseness at G-3's base, the cracked foot weld of Chapter 7, not a bearing defect
- Procedure | a bearing diagnosis needs non-integer harmonics or an envelope peak, not one matching line
```

The peak was at exactly 3 × 24.67 = 74.0 Hz, a running-speed harmonic. The deciding test was the harmonics: a bearing defect would have produced peaks at 149.8 and 224.7 Hz, 2 and 3 × BPFO, while running-speed harmonics fall at 148.0 and 222.0 Hz, 6× and 9×. The spectrum had the second family, not the first, and the envelope spectrum showed no BPFO at all. The peak belonged to the looseness at G-3's base described in Chapter 7. The bearing work order was cancelled. The tool's tolerance exists to allow for slip and imperfect geometry data; it is not a diagnosis on its own, and the mill's rule is that a bearing defect is called only when the non-integer family or an envelope peak confirms it.

## When a bearing has to come out

When a bearing is replaced, the old one is kept, cleaned and inspected, and the finding is recorded against the vibration history: where the damage was, what kind, and what might have caused it. Outer-race damage in the load zone, as on P-4, is ordinary fatigue or contamination. Damage evenly spaced around a race at the ball spacing, false brinelling, comes from vibration while stationary, such as transport or a neighbouring machine. Fluting, a washboard pattern, comes from electrical current passing through the bearing, common with variable-speed drives. Each points to a different fix, and only the bearing itself tells which. Over a few years these inspections build the mill's own picture of why its bearings fail, which is more useful for prevention than any general list.

## Exercise: the defect frequencies at a lower speed

P-4's motor is to be run from a variable-speed drive at 1,200 r/min for a slower carriage cycle. Using the bearing geometry of this chapter, calculate BPFO, BPFI, BSF and FTF at the new speed, and check which of them would lie within 2% of a running-speed harmonic. Then say how the envelope analysis band should change, if at all.

### Answer

**Given:** n = 8; d = 17.462 mm; D = 72.5 mm; φ = 0°; 1,200 r/min, f_s = 20.0 Hz.

**Assumptions:** the bearing's geometry and the formulas of this chapter; outer race stationary.

**Method:** d ÷ D = 0.2409; apply the four formulas; compare with whole multiples of 20.0 Hz.

**FTF:** (20.0 ÷ 2) × (1 − 0.2409) = 7.59 Hz.

**BPFO:** 8 × 7.59 = 60.73 Hz, which is 3.036 × 20.0.

**BPFI:** (8 × 20.0 ÷ 2) × 1.2409 = 99.27 Hz, which is 4.963 × 20.0.

**BSF:** (72.5 × 20.0 ÷ (2 × 17.462)) × (1 − 0.2409²) = 41.52 × 0.9420 = 39.11 Hz, 1.956 orders.

**Near harmonics:** BPFO is 1.2% from 3× (60.0 Hz) and BPFI 0.7% from 5× (100.0 Hz), both within 2%; BSF is 2.2% from 2× (40.0 Hz). The orders do not change with speed, so the same near-coincidences exist at every speed.

**Envelope band:** the band is set by the bearing's and housing's ringing frequencies, which do not depend on speed, so it can stay at 2 to 5 kHz. The defect frequencies in the envelope spectrum scale down by 1,200 ÷ 1,480 = 0.811.

**Verification:** the bearing defect frequency check, entered at 1,200 r/min with the same geometry, gives BPFO 60.73 Hz, BPFI 99.27 Hz, BSF 39.11 Hz and FTF 7.59 Hz, each 0.811 times the 1,480 r/min values.
