---
book: product-acoustics-by-the-numbers
chapterSlug: small-sealed-enclosures
order: 4
title: "Small sealed enclosures for drivers"
description: "Put a driver in a small sealed chamber: the air spring, the system resonance and Q from Thiele–Small parameters, the low-frequency roll-off, and catch a chamber shrunk to fit a circuit board."
draft: false
---

A loudspeaker driver on its own is useless at low frequencies: the sound from the back of its cone is the opposite of the sound from the front, and at wavelengths longer than the driver the two cancel. Mounting the driver in a sealed chamber stops the cancellation, but it adds a spring, the air trapped behind the cone, which stiffens the driver's suspension and raises its resonance. In a product, where every cubic centimetre is wanted for something else, the chamber is usually small, the spring is strong, and the resonance rises a long way. How far, and with what effect on the response, follows from a few parameters the driver's maker publishes.

This chapter introduces the Thiele–Small parameters that describe a driver at low frequencies, derives the sealed enclosure's system resonance and its quality factor, shows how they set the low-frequency response, and works through the choice of chamber volume. The running case finds that AP-40's speaker chamber was cut from 30 cm³ to 12 cm³ late in the design to make room for a circuit board, which raised the system's Q from about 0.96 to about 1.38, put a peak of about 3.4 dB near 1 kHz, and lost about 6 dB at 300 Hz.

## Thiele–Small parameters

The small-signal behaviour of a moving-coil driver at low frequencies can be described by a handful of measured parameters, named after the Australian engineer Neville Thiele and the American Richard Small, whose papers made them the standard language of enclosure design.

```figure
type: formula
title: Sealed-enclosure relationships from Thiele–Small parameters
formula: α = V_as ÷ V_b;   f_c = f_s × √(1 + α);   Q_tc = Q_ts × √(1 + α)
caption: This is an illustration for AP-40's 40 mm prompt driver, with f_s = 300 Hz, Q_ts = 0.5 and V_as = 80 cm³, in a 30 cm³ sealed chamber. The relationships neglect losses in the box, which damping material and leaks modify.
- f_s | Driver's free-air resonance, Hz
- Q_ts | Driver's total quality factor at f_s, electrical and mechanical damping combined
- V_as | Volume of air with the same compliance as the driver's suspension, m³
- V_b | Sealed chamber's internal volume, m³
step: α = 80 ÷ 30 ≈ 2.67, so √(1 + α) ≈ 1.92
step: f_c ≈ 300 × 1.92 ≈ 574 Hz
step: Q_tc ≈ 0.5 × 1.92 ≈ 0.96
```

**f_s** is the frequency at which the driver's moving mass resonates with its suspension in free air. **Q_ts** describes how strongly that resonance is damped, mostly by the voice coil's back-EMF through the amplifier and partly by the suspension's losses. **V_as** expresses the suspension's compliance as the volume of air that would have the same springiness on the driver's cone. Further parameters, the cone's effective area S_d, the motor's force factor Bl, the voice coil's resistance R_e and the linear excursion X_max, describe its output and limits, and Chapter 5 uses them.

## What the chamber does

The chamber's air spring adds to the suspension's. Their ratio, α = V_as ÷ V_b, says how much stiffer the air is than the suspension; Chapter 2 found it about 2.7 for AP-40's 30 cm³ chamber. Because the moving mass is unchanged and the total stiffness rises by the factor 1 + α, the resonance rises by √(1 + α), and so does the Q, because the damping stays roughly the same while the stiffness increases.

The result is a **second-order high-pass** response. Above f_c, the driver's output is roughly flat; below it, the output falls at 12 dB per octave. Q_tc sets the shape of the knee: at about 0.707, the response is maximally flat; below that, the roll-off starts earlier and more gently; above it, the response rises to a peak just above f_c before falling, a peak that sounds boomy in a large speaker and honky or nasal in a small one.

## The running case: choosing the chamber

This is an illustration. AP-40's prompt driver, with f_s = 300 Hz, Q_ts = 0.5 and V_as = 80 cm³, could sit in chambers of various sizes.

```figure
type: compare
title: AP-40's prompt driver in sealed chambers of different volumes
cols: α | f_c | Q_tc | Peak | Response at 300 Hz
caption: This is an illustration of the closed-box relationships with f_s = 300 Hz, Q_ts = 0.5 and V_as = 80 cm³. A Q_tc of 0.707 would need an 80 cm³ chamber, more than the cabinet could spare.
- 80 cm³ | 1.00 | 424 Hz | 0.71 | 0 dB | −6.0 dB
- 40 cm³ | 2.00 | 520 Hz | 0.87 | 0.5 dB | −9.0 dB
- *30 cm³, as designed | 2.67 | 574 Hz | 0.96 | 1.0 dB | −10.5 dB
- 20 cm³ | 4.00 | 671 Hz | 1.12 | 1.9 dB | −13.0 dB
- 12 cm³, as cut | 6.67 | 831 Hz | 1.38 | 3.4 dB | −16.9 dB
```

The designers chose 30 cm³ as the space the cabinet could give, accepting a Q_tc of about 0.96, a mild rise of about 1 dB above resonance, and a response at 300 Hz about 10.5 dB below the passband. For short spoken prompts, whose energy is concentrated between about 500 Hz and 4 kHz, that was a reasonable compromise, with the low end of the band treated as Chapter 5 describes.

## The error: the chamber cut to fit a board

This is an illustration. Late in the design, the electronics team needed space for a larger circuit board beside the speaker, and the mechanical team, treating the speaker chamber as a box of spare volume, reduced it from 30 cm³ to **12 cm³**. The driver, its position and its grille were unchanged, so the change looked harmless on the CAD model.

Acoustically, it was not. With V_b = 12 cm³, α rose from about 2.67 to about 6.67, the system resonance from about 574 Hz to about **831 Hz**, and Q_tc from about 0.96 to about **1.38**. The response gained a peak of about 3.4 dB near 970 Hz and lost low frequencies: about 16.9 dB down at 300 Hz instead of 10.5 dB, and about 11.2 dB down at 400 Hz instead of 5.3 dB.

```figure
type: line
title: AP-40's prompt driver: response relative to the passband, two chamber volumes
x: Frequency, Hz
y: Relative level, dB
legend: 30 cm³ chamber, as designed | 12 cm³ chamber, as cut
ymin: -26
ymax: 6
caption: This is an illustration of the closed-box response. The smaller chamber raises the resonance and the Q, adding a peak near 1 kHz and taking away the low end of the prompt band.
- 200 | -17.9 | -24.4
- 300 | -10.5 | -16.9
- 400 | -5.3 | -11.2
- 500 | -1.9 | -6.6
- 700 | 0.8 | 0.5
- 1000 | 0.9 | 3.4
- 1500 | 0.5 | 1.9
- 2000 | 0.3 | 1.1
```

The prompts from the next prototype sounded thin and nasal, and a listening panel rated them markedly worse. The check that caught it was a change review that included the acoustic engineer: the speaker chamber was listed on the product's acoustic circuit as a compliance, and any change to its volume triggered a recalculation of f_c and Q_tc. The fix found the board space elsewhere, by moving a connector, and restored the chamber to 28 cm³, giving a Q_tc of about 0.98, within a few hundredths of the original. The general lesson is that a speaker's chamber is an acoustic component with a specified volume, not empty space, and that the drawing should carry its volume as a controlled dimension.

## Damping material in the chamber

Filling a sealed chamber loosely with fibrous material, such as polyester or mineral wool, does two useful things. It absorbs the sound inside the chamber, damping the standing waves that form at higher frequencies between its walls, which would otherwise colour the response. And at low frequencies it makes the compression of the air closer to isothermal than adiabatic, which makes the air spring slightly softer, as if the chamber were somewhat larger. The effect on f_c and Q_tc is modest, typically equivalent to a volume increase of some per cent, and it is found by measurement. It never makes a 12 cm³ chamber behave like a 30 cm³ one.

## Leaks and seals

A sealed chamber must be sealed. A leak, a gap round the driver's frame, an unsealed cable exit, a joint in the housing, adds a parallel path whose acoustic mass and resistance let air escape at low frequencies. A small leak lowers the low-frequency output and adds a resonance of its own between the leak's mass and the chamber's compliance; a large leak turns the chamber into a crude vented box. Leaks also whistle at high drive levels. The driver's gasket and every joint in the chamber need specified seals, and a production test, Chapter 10's subject, checks that each unit's low-frequency response matches the design, which a leak would change.

## The chamber's other jobs

In a product, the speaker chamber is often also part of the cabinet's structure, a moulding with ribs, bosses and screw holes. Every boss, rib and screw head inside it takes volume, and the volume that matters acoustically is the net internal air volume after all of them, plus the volume behind the driver's cone inside its frame. A CAD model's volume calculation of the cavity, with the driver modelled to its actual rear shape, gives the figure. The chamber's walls must also be stiff: a thin, flexible wall vibrates with the pressure inside and radiates, or, at its own resonance, absorbs energy and adds a dip. Ribs and wall thickness should be chosen with the chamber's internal pressure in mind, which at the cone's full excursion is substantial for a small chamber.

## Electrical influences

The driver's Q_ts includes its electrical damping, which depends on the resistance it sees from the amplifier. The parameters are measured with a source of very low resistance, as a modern amplifier provides. Anything that adds resistance in series, long thin wiring, a series resistor for protection, a connector with poor contact or an amplifier with a high output impedance, reduces the electrical damping and raises Q_ts, and with it Q_tc. In a small product with a short cable and a class-D amplifier on the same board, the effect is usually small, but a series resistor of an ohm or two added late in the design to limit current is worth a recalculation.

## Bigger is not always possible

The table shows that a maximally flat Q_tc of about 0.707 would need about 80 cm³, nearly three times what the cabinet could give. In small products, that is typical: the chamber is a fraction of the driver's V_as, Q_tc is above 0.707, and f_c is well above f_s. The designer's options are to choose a driver whose parameters suit the available volume, with a lower Q_ts and a smaller V_as for the same output, to accept the response and correct it electronically within the driver's excursion limits, or to use a vented or passive-radiator arrangement, which Chapter 6 discusses. Choosing the driver for the box, rather than the box for the driver, is the normal situation in product design.

## Measuring the parameters

Thiele–Small parameters are measured, not calculated, and a designer should know how, because a datasheet's values are nominal and samples differ. The usual method uses the driver's **electrical impedance**, measured across frequency with a small signal. In free air, the impedance rises to a sharp peak at the driver's resonance; the peak's frequency gives f_s, and its height and width give the mechanical and electrical Q values, which combine to Q_ts. V_as is then found by changing the system in a known way and measuring how f_s moves: either by adding a known mass to the cone, which lowers f_s, or by mounting the driver on a test box of known volume, which raises it. Commercial measurement systems automate the process, but the principle is simple enough to check by hand from the impedance curve.

The parameters also change with conditions. A new driver's suspension is usually stiffer than it will be after some hours of use, so measurements are often made after a period of exercising the driver. Temperature changes the suspension's stiffness and the voice coil's resistance. Very small signals and large ones give somewhat different values, because a suspension is not perfectly linear. A design based on a datasheet should be checked with parameters measured on several samples of the driver actually bought.

## Designing for the tolerance

Drivers' parameters vary from unit to unit, and the maker's datasheet states the tolerances. A design is checked at the extremes, not only at the nominal values. This is an illustration, with spreads chosen to show the method. If f_s could vary by 10% either way and V_as by 20%, with the softer suspension going with the lower resonance, AP-40's driver in its 30 cm³ chamber would range from about f_c = 553 Hz with Q_tc = 1.02 to about f_c = 584 Hz with Q_tc = 0.89, against the nominal 574 Hz and 0.96. The spread in Q_tc of about 0.13 moves the response's shape near resonance by around a decibel, and the spread in f_c by about 30 Hz moves the low-end roll-off, small differences for prompts but worth knowing. For a product whose response is equalised electronically, the equalisation should suit the whole spread, not the nominal driver, or the production test of Chapter 10 will reject units that are within the driver's own tolerance.

## Exercise: a different driver

A second supplier offers a 40 mm driver with f_s = 350 Hz, Q_ts = 0.38 and V_as = 50 cm³. In AP-40's 30 cm³ chamber, what are f_c and Q_tc? Is it a better match?

**Worked answer.** α = 50 ÷ 30 ≈ 1.67, so √(1 + α) ≈ 1.63. Then f_c ≈ 350 × 1.63 ≈ **572 Hz** and Q_tc ≈ 0.38 × 1.63 ≈ **0.62**.

The system resonance is almost the same as the first driver's 574 Hz, but the Q is lower than 0.707, so the response has no peak and rolls off a little earlier and more gently; its −3 dB point is somewhat higher than its f_c. Whether it is better depends on its sensitivity and excursion, which set its output, and on its distortion. A lower Q generally means a stronger motor, a higher Bl, which often goes with higher sensitivity, so the second driver is worth testing, with its full parameters and an output calculation as in Chapter 5, before choosing.
