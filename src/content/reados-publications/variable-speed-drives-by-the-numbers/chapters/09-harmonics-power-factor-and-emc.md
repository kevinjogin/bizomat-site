---
book: variable-speed-drives-by-the-numbers
chapterSlug: harmonics-power-factor-and-emc
order: 9
title: "Harmonics, power factor, cables and interference"
description: "How a drive's rectifier draws harmonic current, true and displacement power factor, how fast switching stresses cables, insulation and bearings, and how screening controls interference."
draft: false
---

A drive is a good neighbour to its motor in many ways and a difficult one to everything else. Its diode rectifier draws current from the supply in short pulses rather than a smooth sine wave, and those pulses carry harmonics that heat transformers and distort the voltage for other equipment. Its inverter switches hundreds of volts in a fraction of a microsecond, and every edge pushes high-frequency current through the capacitance of the motor cable and the motor itself to earth, where it can trip earth-leakage protection, interfere with instruments and pit the motor's bearings. None of these is a reason not to use drives. All of them are reasons to install drives properly.

This chapter explains rectifier harmonics and power factor for DP-4's fan drive, the effects of fast switching on cables, motor insulation and bearings, and the earthing, screening and protection that control them. It ends with a fan motor whose bearings failed early.

## The rectifier's current

A six-pulse diode rectifier with a smoothing capacitor conducts only near the peaks of the supply voltage, when the supply is above the capacitor's voltage. Each phase therefore draws two short pulses of current every cycle instead of a sine wave. Expressed as a sum of sine waves, that current contains, besides the 50 Hz fundamental, harmonics at 6k ± 1 times the supply frequency: the 5th at 250 Hz, the 7th at 350 Hz, the 11th, the 13th and so on, decreasing with order. A choke in the DC link or the supply lines spreads the pulses out and reduces the harmonics considerably.

```figure
type: formula
title: Harmonic distortion and power factor
formula: THD_I = √(I₅² + I₇² + I₁₁² + …) ÷ I₁
formula: I_rms = I₁ √(1 + THD_I²)
formula: Displacement power factor = cos φ₁, the phase angle of the fundamental
formula: True power factor = P ÷ (√3 V I_rms) = cos φ₁ ÷ √(1 + THD_I²)
caption: I₁ is the fundamental current, Iₕ the rms current at harmonic h. A diode rectifier draws its fundamental almost in phase with the voltage, so its displacement power factor is high, about 0.95 to 0.98; its true power factor is lower because harmonic current carries no average power.
- THD_I | total harmonic distortion of current
- I_rms | total rms current, A
- P | real power, W
```

For DP-4's fan drive at full load, with its DC choke, the maker's data give harmonic currents of about 35% of the fundamental at the 5th, 12% at the 7th, 7% at the 11th and 5% at the 13th, a total harmonic distortion of √(0.35² + 0.12² + 0.07² + 0.05²) = 38.0%. The drive takes 32.61 kW from the supply (the motor's 32.05 kW plus the drive's 0.56 kW loss). With a displacement power factor of 0.98, the fundamental current is 32,610 ÷ (√3 × 400 × 0.98) = 48.0 A and the total rms current 48.0 × √(1 + 0.38²) = 51.4 A. The true power factor is 0.98 ÷ 1.070 = 0.916.

```figure
type: compare
title: The supply current of F-1's motor, on the mains and on the drive, at full load
cols: Real power | Displacement power factor | Current distortion | True power factor | Supply current
rowhead: Supply
- Motor direct on the mains | 32.05 kW | 0.86 | negligible | 0.86 | 53.8 A
- * Drive with DC choke | 32.61 kW | 0.98 | 38% | 0.916 | 51.4 A
- Drive without choke, typical | 32.61 kW | 0.97 | about 108% | about 0.66 | about 71 A
caption: This is an illustration. Harmonic shares with the choke from the drive's data; without a choke, typical shares of 80%, 65%, 25% and 18% at the 5th, 7th, 11th and 13th. The motor on the drive still draws its magnetising current, but from the DC link, not from the supply.
```

Two things stand out. The drive draws slightly less current from the supply than the motor did on the mains, despite its harmonics, because the motor's reactive magnetising current now circulates between the motor and the DC link and no longer flows from the supply. And a drive without a choke draws far more current for the same power. That matters for cable, fuse and transformer sizing, and for the site's power factor correction capacitors, which can resonate with the supply's inductance at a harmonic frequency and fail.

The [three-phase motor power tool](/tools/motor-power/) gives the motor's current and apparent power on the mains, 53.79 A and 37.27 kVA at 30 kW. Its formulas assume sinusoidal current, so they do not apply to the drive's input; the drive's own data, or a power quality analyser, give its supply current.

## Harmonics on the site

Harmonic currents flowing through the supply's impedance distort the voltage that every other load on the site receives. A few small drives on a large transformer cause little distortion; many drives on a small one can cause enough to make other equipment misbehave, overheat transformers and neutral conductors, and exceed what the network allows. IEC 61000-3-12 sets harmonic current limits for equipment drawing between 16 A and 75 A per phase connected to public low-voltage systems, and network service providers in Australia set their own requirements for larger customers, commonly referring to the AS/NZS 61000.3 series. Remedies, in rising order of cost, are DC or line chokes, passive harmonic filters, multi-pulse rectifiers fed from phase-shifting transformers, and active front ends or active filters. For DP-4's three drives on the plant's 1,000 kVA transformer, chokes were enough; a power quality survey after installation showed the voltage distortion at the main switchboard was well within the network's limit.

## Power factor correction capacitors

Many factories have banks of capacitors at the main switchboard to correct the power factor of their induction motors, and so reduce their maximum demand charges and their supply current. Drives change that picture in two ways. First, motors on drives no longer draw their magnetising current from the supply, so the site needs less correction, and a capacitor bank sized for the old motors may over-correct at light load. Second, capacitors and the supply transformer's inductance form a resonant circuit. If its resonant frequency falls near a harmonic the drives produce, commonly the 5th or 7th, the capacitors amplify that harmonic, drawing large currents that overheat and fail them and distorting the voltage across the whole site.

The usual protection is detuned capacitor banks, with a reactor in series with each capacitor step that moves the resonance below the 5th harmonic, so that the bank looks inductive to the harmonics and cannot resonate with them. When DP-4 was installed, the plant's capacitor bank was already detuned; had it not been, its supplier would have been asked to check it before the drives were commissioned.

## Measuring power quality

The plant had a power quality survey done at the main switchboard before and after DP-4 was commissioned, each over a week of normal production. A class A power quality analyser, measuring to the methods of IEC 61000-4-30, recorded the voltage and current on each phase, their harmonic spectra to the 50th harmonic, the power factor, and voltage dips and swells, as 10-minute averages. The survey showed the 5th harmonic current at the switchboard rising, as expected, while the voltage distortion stayed low and the site's true power factor at full load improved slightly, because the motors' reactive current had been replaced by the drives' smaller harmonic current. The surveys are kept with the plant's electrical records as the baseline against which later changes, such as more drives, can be judged.

## Fast switching and the motor cable

The inverter's output voltage changes by 540 V in about 0.1 µs at each switching edge, a rate of several kilovolts per microsecond. A motor cable behaves like a transmission line for such fast edges. The edge travels down the cable at about half the speed of light, about 150 m/µs, reflects at the motor, whose impedance is much higher than the cable's, and comes back. If the cable is long enough that the reflection returns after the edge has finished rising, the reflected wave adds to the incoming one, and the voltage at the motor terminals can approach twice the DC link voltage: about 2 × 566 = 1,132 V peak. The critical length is roughly the rise time times the wave speed divided by two: 0.1 × 150 ÷ 2 = 7.5 m. DP-4's motor cables run 45 m to F-1 on the roof, 30 m to P-3 and 20 m to C-2, all longer than that.

Standard motors have insulation that can withstand these peaks to a degree, and motors intended for drives have reinforced winding insulation. IEC TS 60034-25 gives guidance on which motors suit which drives and cable lengths. For long cables or old motors, a dv/dt filter or a sine filter at the drive's output slows the edges and removes the overshoot. P-3's and C-2's motors were new and drive-rated; F-1's was the original motor, rewound some years before, and its insulation class was not documented.

## Common-mode voltage, leakage and bearings

A three-phase inverter's output phases never sum to zero at every instant, as a balanced sine supply's do: at each switching state, the average of the three output voltages, the common-mode voltage, jumps in steps of a third of the DC link voltage. That voltage drives current through the stray capacitance between the motor's windings and its frame, and between the cable's cores and its screen or the earth, back to the drive. The current flows in pulses at every switching edge.

It has three consequences.

- **Earth leakage.** The pulses, and the drive's EMC filter capacitors connected to earth, give drives a high leakage current to earth. Residual current devices of the common type A can nuisance-trip on it, and some cannot detect the smooth direct fault currents a drive's rectifier can produce. Where residual current protection is required for a drive circuit, the drive maker's manual specifies the type, often type B.
- **Interference.** The same high-frequency currents radiate and couple into instrument cables, causing noisy sensor readings and communication errors. IEC 61800-3 sets electromagnetic compatibility requirements for drives and their installation categories.
- **Bearing currents.** Part of the common-mode voltage appears across the motor's bearings, between the shaft and the frame. A bearing's lubricant film is an insulator until the voltage across it breaks down, when a tiny spark discharges through the balls. Millions of such discharges pit the races, and in time the pits organise into a pattern of grooves across the race, called fluting, which makes the bearing noisy and leads to failure.

## Installation that controls the problems

The remedies are mostly about the return path for high-frequency current. A symmetrical screened motor cable, with three phase cores arranged symmetrically and a concentric copper screen, carries the high-frequency current back to the drive along the screen instead of through the plant's structure and the motor's bearings. The screen must be terminated all the way round, 360°, in metal glands at both the drive and the motor, not as a twisted pigtail, which has too much inductance at these frequencies. The motor frame must be bonded to the driven machine and to the drive's earth with a low-impedance high-frequency bond. Where bearing currents are still a risk, as on larger motors, an insulated bearing at the non-drive end or a shaft earthing ring diverts the current away from the bearings. Instrument cables are run separately from motor cables and cross them at right angles.

## The error: the fan motor's bearings

Eighteen months after F-1's drive was fitted, the fan's vibration monitoring showed a rising peak at the motor's drive-end bearing's outer race defect frequency, and the motor developed a distinct whine. When the bearing was removed, its outer race showed fluting: regular grey bands across the raceway.

The investigation found that F-1's motor had been connected with the plant's existing four-core unscreened cable, kept to save the cost of a new run to the roof, with its earth core as the only return path. With no screen and the motor frame bolted to the fan's steel base and thence to the building, the common-mode current had found its way back to the drive through the motor's bearings, the fan structure and the building's steel. The 45 m run, longer than the other two drives' cables, made the problem worse.

```figure
type: checklist
title: Corrective work on F-1
caption: This is an illustration. All done in one planned shutdown.
- x Motor bearings replaced, with an insulated bearing at the non-drive end
- x New symmetrical screened motor cable, with 360° EMC glands at the drive and the motor terminal box
- x High-frequency bond strap from the motor frame to the fan base and the drive's earth bar
- x dv/dt filter at the drive's output for the 45 m run to the rewound motor
- ? Vibration and bearing defect frequencies trended monthly for a year to confirm the cure
```

The second set of bearings has run without fluting since. The lesson is that a drive installation includes the cable and the earthing, and that the cheapest-looking part of it, re-using an old cable, can be the most expensive.

## Exercise: a drive without a choke

A replacement drive offered for P-3 has no DC choke. It takes 18.0 kW from the supply at 400 V, with a displacement power factor of 0.97 and harmonic currents of 80%, 65%, 25% and 18% of the fundamental at the 5th, 7th, 11th and 13th.

1. What is the total harmonic distortion of its current?
2. What are its fundamental and total rms supply currents, and its true power factor?
3. What would you ask the supplier before accepting it?

### Worked answer

1. THD = √(0.80² + 0.65² + 0.25² + 0.18²) = √(0.64 + 0.4225 + 0.0625 + 0.0324) = √1.1574 = 1.076, about 108%.
2. I₁ = 18,000 ÷ (√3 × 400 × 0.97) = 26.8 A. I_rms = 26.8 × √(1 + 1.1574) = 26.8 × 1.469 = 39.3 A. True power factor = 0.97 ÷ 1.469 = 0.660.
3. Whether a DC or line choke is available and what the harmonic currents are with it; whether the drive complies with the harmonic limits that apply to the site and the network's requirements; the supply cable and fuse sizes needed for 39.3 A instead of about 28.4 A with a choke like DP-4's; and the effect on the site's power factor correction equipment. A choke usually costs far less than the larger cables and the extra losses it saves.
