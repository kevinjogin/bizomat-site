---
book: flow-measurement-by-the-numbers
chapterSlug: electromagnetic-flowmeters
order: 4
title: "Electromagnetic flowmeters"
description: "How a conducting liquid moving through a magnetic field generates a voltage, signal size, conductivity, pulsed excitation, electrodes, liners and grounding, and a plastic pipe without grounding rings."
draft: false
---

An electromagnetic flowmeter has no moving parts, no restriction and no part that projects into the flow. It is a short length of lined pipe with a coil above and below and two small electrodes in the wall, and it measures any liquid that conducts electricity, from mains water to wort, beer and cleaning chemicals. Its principle is one of the oldest in electromagnetism: a conductor moving through a magnetic field has a voltage induced across it. In a magnetic flowmeter the conductor is the liquid itself.

This chapter explains the principle from the force on moving charges, works out the size of FT-101's signal at its normal and night flows, sets out the liquid's conductivity requirement and the reasons for pulsed excitation, and covers electrodes, liners and grounding. It finishes with a meter fitted to the brewery's new plastic reverse osmosis water line without grounding rings, whose reading wandered with every pump that started nearby.

## A conductor moving through a magnetic field

A charge moving through a magnetic field feels a force at right angles both to its motion and to the field. The same force that bends ions into circles in a mass spectrometer acts on the charges in any conductor that moves through a field. In a metal rod moving sideways through a field, the free electrons are pushed towards one end; the charge that builds up there creates an electric field that pushes back, and the build-up stops when the electric force exactly balances the magnetic force. The rod then has a steady voltage between its ends, equal to the field multiplied by the speed and the rod's length. That is the motional electromotive force, the principle of the homopolar generator, in which a conducting disc spinning in a field produces a steady voltage between its axle and its rim.

A conducting liquid flowing through a pipe across a magnetic field behaves the same way. Its ions are pushed towards the two sides of the pipe, and the potential difference that builds up between the sides is measured by two electrodes. The physics of electrically conducting fluids moving through magnetic fields, magnetohydrodynamics, governs things as large as the Sun's magnetic field and as small as this meter.

```figure
type: formula
title: The voltage induced across a magnetic flowmeter
formula: Balance of forces on a charge: q E = q v B        so E = v B
formula: Electrode voltage: U = k × B × v̄ × D
caption: B is the magnetic flux density across the pipe, v̄ the mean velocity and D the distance between the electrodes, the bore. For a uniform field and an axisymmetric velocity profile, the electrodes see the mean velocity exactly and k = 1; real meters have a calibration factor close to 1 for their own field shape.
- U | voltage between the electrodes, V
- B | magnetic flux density, T
- v̄ | mean velocity, m/s
- D | bore, m
```

The second line is remarkable. For an axisymmetric profile in a uniform field, the voltage depends on the mean velocity regardless of the profile's shape: laminar or turbulent, the electrodes see the same mean. Real meters are not perfectly uniform, and asymmetric profiles, like the jet behind Chapter 2's butterfly valve, do shift the reading, but magnetic meters are far less sensitive to profile than single-path ultrasonic or insertion meters.

## How big the signal is

The coils of a typical meter produce a field of a few millitesla across the bore. Taking 5 mT for FT-101, with its 80.0 mm bore and a mean velocity of 1.658 m/s at 30 m³/h, the voltage between the electrodes is 0.005 × 1.658 × 0.080 = 0.66 mV.

```figure
type: bars
title: FT-101's electrode voltage across its range, field 5 mT, bore 80.0 mm
unit: mV
max: 0.7
caption: This is an illustration. U = B × v̄ × D. At the night flow of 0.5 m³/h the signal is 11 µV, which the meter must separate from noise and electrochemical potentials many times larger.
- * 30 m³/h, 1.66 m/s | 0.663
- 9 m³/h, 0.50 m/s | 0.200
- 0.5 m³/h night flow, 0.028 m/s | 0.011
```

Signals of a fraction of a millivolt, falling to about ten microvolts at night, are small but entirely manageable with good electronics. The difficulty is not the size of the signal but the other voltages that appear between the electrodes: electrochemical potentials between the metal electrodes and the liquid, which can be hundreds of millivolts and drift slowly; voltages picked up from nearby electrical equipment; and noise from the liquid itself. The meter's design is largely about separating the flow signal from those.

### Pulsed excitation

Early meters drove their coils with alternating current at mains frequency. That avoided the electrochemical potentials, which are steady, but invited interference from every other mains-frequency source in the plant. Modern meters drive their coils with pulsed direct current, switching the field's direction a few to a few tens of times a second, and measure the electrode voltage after the field has settled in each direction. The flow signal reverses with the field; the electrochemical potential does not; subtracting the readings in the two directions removes the potential and its slow drift. The cost is a slower response, typically a fraction of a second to a few seconds, which is fine for most process flows and too slow for very fast batching.

## Conductivity

The liquid must conduct well enough that the electrodes and the meter's input see the induced voltage rather than noise. Makers state a minimum conductivity, commonly about 5 µS/cm for standard meters and lower for special designs. Mains water is typically in the hundreds of microsiemens per centimetre; wort and beer are well above that; cleaning caustic and acid are far above it. Purified waters are the hard case.

```figure
type: compare
title: Conductivity of the brewery's liquids against a typical 5 µS/cm minimum
cols: Typical conductivity | Suitable for a standard magnetic meter
rowhead: Liquid
- Mains water | a few hundred µS/cm | yes
- Reverse osmosis permeate | about 10 to 50 µS/cm, depending on the membrane and feed | yes, with care over grounding and noise
- Deionised or demineralised water | below 1 µS/cm | no: use another meter type
- Wort and beer | well above 1,000 µS/cm | yes
- Cleaning caustic and acid | very high | yes, with suitable electrodes and liner
- Glycol coolant | low and variable | check the maker's limit for the actual mixture
caption: Typical ranges for illustration; the actual liquid's conductivity should be measured. Oils, hydrocarbons and gases do not conduct and cannot be measured magnetically.
```

## Electrodes, liners and grounding

**Electrodes** must resist the liquid. Stainless steel suits water and beer; aggressive chemicals call for alloys such as Hastelloy, or titanium, tantalum or platinum. Coatings that build up on electrodes, such as fats, scale or protein, insulate them and reduce the signal, so some meters monitor electrode impedance as a diagnostic.

**Liners** insulate the liquid from the metal meter body, so that the induced voltage is not short-circuited through the pipe. PTFE and PFA suit food and hot cleaning; rubber linings suit water and abrasive slurries. A damaged liner short-circuits the signal and the meter reads low or zero.

**Grounding** gives the liquid a stable reference potential. The meter measures the voltage between its electrodes relative to the liquid's own potential, which it needs to know. In a metal pipe, the pipe is in contact with the liquid and is earthed, and the meter is bonded to it. In a plastic or lined pipe, nothing earths the liquid, which can float at whatever potential nearby equipment induces in it. Grounding rings, metal rings clamped between the meter's flanges and the pipe, contact the liquid on each side of the meter and connect it to the meter's earth.

## The mistake: a plastic pipe without grounding rings

The brewery added a reverse osmosis plant to soften its brewing water, feeding the brewhouse through a DN25 PVC line with a bore of 26.0 mm, at 1.2 m³/h. A small magnetic meter, FT-102, was fitted to measure the permeate. Within days the operators reported that its reading wandered by 10 to 20%, jumping whenever the reverse osmosis pump or the nearby cellar compressor started.

```figure
type: steps
title: Grounding the reverse osmosis meter
caption: This is an illustration. Signal at 1.2 m³/h: 8 mT × 0.628 m/s × 0.026 m = 131 µV; the liquid's floating potential changed by far more than that each time a motor started.
- Symptom | FT-102 wandering 10 to 20%, jumping with nearby motor starts
- Liquid | RO permeate at about 20 µS/cm, above the meter's 5 µS/cm minimum
- Pipe | PVC: nothing in contact with the liquid was earthed
- Signal | about 131 µV at 1.2 m³/h; the liquid's potential moved by much more as motors started
- * Fix | stainless grounding rings fitted between the meter and each PVC flange, bonded to the meter's earth terminal
- Result | reading steady within ±0.5% at constant flow
```

The permeate's conductivity, about 20 µS/cm, was above the meter's minimum, so conductivity was not the cause. The cause was the pipe. With PVC on both sides, nothing earthed the liquid, and each time a motor started nearby, the potential of the whole column of water shifted by far more than the 131 µV flow signal. The meter, measuring its electrode voltages against its own earth rather than against the liquid, saw those shifts as flow. Stainless steel grounding rings were fitted between the meter and each PVC flange and bonded to the meter's earth terminal, giving the liquid a fixed potential at the meter, and the reading settled to within half a per cent at steady flow. The installation instruction the plumber had followed, though correct for the meter, was written for metal pipe, and the brewery's standard now requires grounding rings on every magnetic meter in plastic or lined pipe.

## Sizing a magnetic meter

A magnetic meter's signal and its zero stability are fixed in velocity terms, so its accuracy at low flows depends on how fast the liquid moves through it. Makers typically quote their best accuracy above about 0.5 to 1 m/s and usable readings down to a few centimetres per second. A meter the same size as a generously sized pipe may therefore spend much of its time below its best range. The remedy is to reduce the meter one or two sizes below the pipe, with concentric reducers either side; the reducers' gentle contraction even improves the profile.

The [pipe flow velocity tool](/tools/pipe-flow-velocity/) shows what that does for FT-101. Taking each meter's bore as equal to its nominal size, at its 30 m³/h maximum a DN80 meter sees 1.66 m/s, a DN65 meter 2.51 m/s and a DN50 meter 4.24 m/s; at the 0.5 m³/h night flow, the same three sizes see 0.028, 0.042 and 0.071 m/s. Reducing to DN65 would raise the night velocity by half at the cost of more pressure loss at full flow, while DN50 would put full flow above the 3 m/s or so at which erosion and pressure loss start to matter. The brewery kept DN80 because its night flow reading, while not precise, is used only to watch for leaks, as Chapter 9 explains, and the meter's zero is checked each quarter with the line closed. Had the night flow been needed for billing a tenant or for an accurate water balance, a smaller meter, or a second small meter in a bypass for low flows, would have been the better design.

## Hygiene and cleaning

In food and beverage service the meter must also be cleanable. Hygienic magnetic meters have PFA or PTFE liners that withstand the hot caustic and acid of cleaning in place, electrodes flush with the liner so that nothing collects around them, and hygienic process connections instead of flanges. The cleaning solutions, being highly conductive, are easy to measure, and many breweries use the same meter to confirm that each cleaning cycle delivered its required volume. A meter whose liner has been damaged by a cleaning cycle hotter than its rating shows it first as a drifting zero, which is one more reason to check zeros routinely.

## Empty pipe and other diagnostics

A magnetic meter in a pipe that empties reads nonsense, since there is no conducting path between the electrodes. Most meters detect an empty pipe by measuring the resistance between their electrodes, which rises sharply when they are uncovered, and drive their output to zero with an alarm. Many also monitor coil current, electrode impedance and the noise level of the signal, and some can verify their own calibration electrically by checking the coils' field and the electronics' gain against stored values. That verification checks the meter, not its installation: it would not have found FT-101's butterfly valve or FT-102's grounding.

## What a magnetic meter cannot do

The magnetic meter's limits follow from its principle. It measures volume flow, not mass, so a recipe in kilograms needs a density and a temperature. It cannot measure non-conducting liquids, gases or steam. It needs the pipe full. And its accuracy at very low velocities, like FT-101's night flow, depends on its zero stability: a meter whose zero drifts by the equivalent of a few millimetres per second reads a significant fraction of the night flow when there is none, a matter Chapter 8 takes up.

## Exercise: the reverse osmosis meter's range

FT-102 has a field of 8 mT and a 26.0 mm bore. The reverse osmosis plant delivers between 0.2 and 1.2 m³/h. Calculate the mean velocity and the electrode voltage at both ends of the range, the turndown, and, if the meter's zero is stable to within the equivalent of 2 mm/s, the zero's share of the reading at each end. Then say whether the meter suits the duty.

### Answer

**Given:** B = 0.008 T; D = 0.026 m; Q from 0.2 to 1.2 m³/h; zero stability ±0.002 m/s.

**Assumptions:** the calibration factor k is 1; a full pipe; adequate conductivity and grounding.

**Method:** v̄ = Q ÷ A; U = B v̄ D; zero share = 0.002 ÷ v̄.

**Area:** π × 0.026² ÷ 4 = 5.309 × 10⁻⁴ m².

**At 1.2 m³/h:** v̄ = (1.2 ÷ 3,600) ÷ 5.309 × 10⁻⁴ = 0.628 m/s; U = 0.008 × 0.628 × 0.026 = 131 µV; zero share 0.002 ÷ 0.628 = 0.32%.

**At 0.2 m³/h:** v̄ = 0.105 m/s; U = 21.8 µV; zero share 0.002 ÷ 0.105 = 1.9%.

**Turndown:** 1.2 ÷ 0.2 = 6 to 1.

**Suitability:** at full flow the zero is negligible; at the bottom of the range it is about 2% of the reading, acceptable for monitoring the reverse osmosis plant's output but not for accurate batching at that flow. A meter one size smaller, DN15, would raise the velocities by about three times and cut the zero's share accordingly, at the cost of a little more pressure loss, which Chapter 10's choice of meter size considers.

**Verification:** the voltages scale with velocity, 131 ÷ 21.8 = 6.0, the same as the turndown, and 0.628 m/s is inside the 0.5 to 3 m/s range the checklist of Chapter 1 expects at full flow.
