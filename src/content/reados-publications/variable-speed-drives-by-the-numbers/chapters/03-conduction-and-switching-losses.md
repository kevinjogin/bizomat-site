---
book: variable-speed-drives-by-the-numbers
chapterSlug: conduction-and-switching-losses
order: 3
title: "Conduction and switching losses"
description: "How to estimate a drive's conduction losses, switching losses and rectifier losses from datasheet values, how they change with load and switching frequency, and what a drive's efficiency really is."
draft: false
---

A drive that is 98% efficient sounds almost loss-free, and as a share of the power it handles it nearly is. But 2% of 30 kW is about 600 W, released in a few square centimetres of silicon, and every watt of it must be carried away through the module's baseplate and the heatsink into the cabinet air. Where those watts come from decides how hot the switches run, how the drive copes with a higher switching frequency or a hotter room, and how long it lasts.

This chapter estimates the losses in DP-4's fan drive: conduction in the IGBTs and diodes, switching in both, and the rectifier. It shows how the losses change with load and switching frequency and how they add up to the drive's efficiency, and it ends with a switching frequency raised to quieten a motor.

## Two kinds of loss

A switch loses energy in two ways. While it is on, the current through it times the voltage across it is the conduction loss. While it is changing state, current and voltage are both present for a short time, and the energy lost in each transition is the switching loss. Conduction loss depends on the current and how long the switch conducts; switching loss on the current, the DC link voltage and how many times a second the switch changes state.

Datasheets give the information needed to estimate both. For conduction, they give the on-state voltage curve of the IGBT and the diode, which is close to a straight line above a knee and is modelled as a threshold voltage plus a slope resistance: V = V₀ + r I. For switching, they give the energy lost at turn-on, at turn-off and in the diode's reverse recovery, measured at a stated current, DC link voltage and temperature. Over a reasonable range, each energy scales roughly in proportion to the current and to the DC voltage.

In a sinusoidal PWM inverter, the share of time each IGBT and each diode conducts varies through the output cycle, and depends on the modulation index M, the ratio of the output voltage to the most the DC link can provide, and on the motor's power factor. Averaging over a cycle gives standard expressions.

```figure
type: formula
title: Losses in one IGBT and its diode, sinusoidal PWM
formula: IGBT conduction: P_cT = V_CE0 Î (1/2π + M cos φ ÷ 8) + r_CE Î² (1/8 + M cos φ ÷ 3π)
formula: Diode conduction: P_cD = V_F0 Î (1/2π − M cos φ ÷ 8) + r_F Î² (1/8 − M cos φ ÷ 3π)
formula: IGBT switching: P_sT = f_sw (E_on + E_off) ÷ π × (Î ÷ I_ref) × (V_DC ÷ V_ref)
formula: Diode recovery: P_sD = f_sw E_rr ÷ π × (Î ÷ I_ref) × (V_DC ÷ V_ref)
caption: Î is the peak of the sinusoidal output current, √2 times its rms value; M the modulation index; cos φ the motor's power factor; f_sw the switching frequency; E_on, E_off and E_rr the datasheet energies at I_ref and V_ref. A three-phase inverter has six such pairs. The expressions are standard averages for sinusoidal PWM, as in power semiconductor makers' application manuals.
- V_CE0, r_CE | IGBT threshold voltage and slope resistance at the working temperature
- V_F0, r_F | diode threshold voltage and slope resistance
- E_on, E_off, E_rr | switching energies per event, J
- f_sw | switching frequency, Hz
```

The expressions show the structure of the losses. When the motor takes real power, with M cos φ large, the IGBTs conduct for most of each half cycle and the diodes for little; the IGBTs carry most of the conduction loss. At low speed or light load, when M or cos φ is small, the current is shared more evenly. Switching loss does not depend on M at all, only on the current, the voltage and the frequency.

## DP-4's fan drive at full load

The fan drive's module is rated 1,200 V and 100 A. Its datasheet gives, at a junction temperature of 125 °C, which is close to the working temperature at full load:

- IGBT: V_CE0 = 0.85 V, r_CE = 11 mΩ; E_on = 6.0 mJ and E_off = 7.5 mJ at 600 V and 100 A.
- Diode: V_F0 = 0.95 V, r_F = 8 mΩ; E_rr = 4.5 mJ at 600 V and 100 A.

At full load, F-1's motor draws 53.8 A rms, so Î = 76.1 A, with a power factor of 0.86. The DC link sits at 540 V and the drive switches at 4 kHz; take M = 1.0. Working the formulas:

```figure
type: compare
title: Losses in DP-4's fan drive at full load, 50 Hz
cols: Per IGBT and diode pair | Whole drive
rowhead: Loss
- IGBT conduction | 31.0 W | 186 W
- Diode conduction | 5.3 W | 32 W
- IGBT switching, 4 kHz | 11.8 W | 71 W
- Diode reverse recovery | 3.9 W | 23 W
- * Inverter total | 52.0 W | 312 W
- Rectifier, six diodes | — | 144 W
- Control, fans, DC link choke and capacitors, assumed | — | 100 W
- Drive total | — | 556 W
caption: This is an illustration. Motor current 53.8 A rms, Î = 76.1 A, cos φ = 0.86, M = 1.0, V_DC = 540 V, f_sw = 4 kHz, datasheet values at 125 °C. The motor takes 32.05 kW; the drive's efficiency is 32.05 ÷ (32.05 + 0.556) = 98.3%.
```

The rectifier is a large share. Each of its six diodes conducts for a third of the time, carrying the DC link current of about 59.9 A. With a threshold of 0.9 V and a slope resistance of 5 mΩ, the bridge loses 6 × (0.9 × 59.9 ÷ 3 + 0.005 × 59.9² ÷ 3) = 144 W. A drive with an active front end, using IGBTs instead of diodes so that it can return braking energy to the supply and draw sinusoidal current, would lose more here, not less.

The IGBTs' conduction loss is the largest single item, 186 W, and it rises with the square of current through the slope resistance. Switching losses total 94 W at 4 kHz.

## At part load

F-1 spends most of its time near 40 Hz (Chapter 1), with the motor drawing 29.3 A at a power factor of about 0.70 and the drive's output voltage at about M = 0.8.

```figure
type: bars
title: DP-4 fan drive losses at full load and at the usual 40 Hz duty
x: Operating point
y: Loss, W
caption: This is an illustration. At 40 Hz: Î = 41.4 A, cos φ = 0.70, M = 0.8; inverter 147 W, rectifier 45 W, other 100 W, total 292 W, for 11.94 kW into the motor, an efficiency of 97.6%. Fixed losses make the drive slightly less efficient at part load, but its total loss almost halves.
- Inverter, full load | 312
- Rectifier, full load | 144
- * Total, full load | 556
- Inverter, 40 Hz | 147
- Rectifier, 40 Hz | 45
- Total, 40 Hz | 292
```

Efficiency falls at part load, from 98.3% to 97.6%, because the 100 W of control and auxiliary losses is fixed while the power handled falls. That is normal and unimportant: what matters for the energy bill is the total, and the drive's 292 W at 40 Hz is small beside the roughly 11 kW the fan no longer draws (Chapter 7). IEC 61800-9-2 defines efficiency classes for drives and the standard operating points at which their losses are declared, so drives can be compared on a common basis.

## Switching frequency

Switching frequency is a setting, typically adjustable from about 2 kHz to 16 kHz. A higher frequency makes the motor current smoother, which reduces the motor's own ripple losses slightly and moves the magnetic noise the motor makes higher in pitch, where it is less audible, or above hearing altogether. The price is drive loss, because every switching event costs energy: switching loss is proportional to frequency.

```figure
type: compare
title: DP-4 fan drive inverter losses at full load by switching frequency
cols: Switching losses | Conduction losses | Inverter total | Change from 4 kHz
rowhead: Switching frequency
- 2 kHz | 47 W | 218 W | 265 W | −47 W
- * 4 kHz | 94 W | 218 W | 312 W | —
- 8 kHz | 188 W | 218 W | 406 W | +94 W
- 12 kHz | 283 W | 218 W | 500 W | +188 W
caption: This is an illustration. Same conditions as the full-load table. Drive makers allow for this by reducing the drive's rated output current at higher switching frequencies; the derating table in the manual must be checked before raising the frequency.
```

Drive makers rate their drives at a default switching frequency and publish derating tables for higher ones, because the extra loss raises the junction temperature. A drive that is comfortably sized at 4 kHz may be at its limit, or beyond it, at 12 kHz in a warm cabinet.

## Losses the drive causes in the motor

A drive's losses are not only its own. The PWM output current is close to a sine wave but carries a ripple at the switching frequency and its multiples, and that ripple causes extra losses in the motor: extra copper loss from the ripple current in the windings, and extra iron loss from the high-frequency flux it drives into the laminations. For a standard induction motor on a drive switching at a few kilohertz, these harmonic losses typically add a few per cent to the motor's own losses, which is a fraction of a percentage point of efficiency. IEC TS 60034-25 gives guidance on motors designed for, or used with, converter supplies, including these losses and the insulation stresses of Chapter 9.

The ripple falls as the switching frequency rises, so the motor's harmonic losses and the drive's switching losses pull in opposite directions. At DP-4's 4 kHz the balance is close to the usual default. A sine filter between the drive and the motor removes almost all the ripple, at the cost of its own losses, size and price; it is justified mainly for very long motor cables, for old motors with weak insulation, or where a motor must be quiet.

## The same drive in silicon carbide

Chapter 2 explained why a 1,200 V silicon carbide MOSFET has far less switching loss than a silicon IGBT. The loss formulas show what that would mean for F-1's drive. Take a silicon carbide module with an on-resistance of 25 mΩ per switch at 125 °C and switching energies of about 1.7 mJ per pair of events at 600 V and 100 A, roughly a sixth of the IGBT's.

A MOSFET conducts in both directions through its channel when it is on, so it can carry the freewheeling current itself instead of handing it to the diode, and its conduction loss is resistive throughout. Each switch carries an rms current of Î ÷ 2 over the output cycle, so its conduction loss is 0.025 × 76.1² ÷ 4 = 36.2 W, about the same as the silicon IGBT and diode pair's 36.3 W. Its switching loss at 4 kHz is 4,000 × 0.0017 ÷ π × (76.1 ÷ 100) × (540 ÷ 600) = 1.5 W instead of 15.7 W. The inverter's total would fall from 312 W to about 226 W at 4 kHz, and at 12 kHz to about 244 W, against 500 W for the silicon IGBTs.

At DP-4's ratings, the saving at 4 kHz, about 86 W, would be worth a few tens of dollars a year in energy and would not justify replacing a working drive. The real gains of silicon carbide are elsewhere: a drive can switch faster and run quieter without derating, its heatsink and cabinet cooling can shrink, and at higher powers and frequencies the losses saved become large. The rectifier, which has nothing to do with switching frequency, keeps its 144 W either way.

## How good is the estimate?

The formulas are averages for an idealised sinusoidal PWM, with switching energies scaled linearly. Real modulation schemes, such as space vector modulation, discontinuous modulation that leaves one phase unswitched for part of each cycle, and the drive's dead time between switching one device off and its partner on, change the numbers by perhaps 10% to 20%. Junction temperature matters too: on-state voltages and switching energies at 25 °C are lower than at 125 °C, so the loss estimate and the temperature estimate in Chapter 4 must be iterated, or the datasheet values taken at the expected working temperature, as here. For a check of a drive's thermal margin, the estimate is good enough; for designing a drive, makers use detailed simulation tools.

The drive's own reading of its losses is not usually available, but its efficiency can be measured with two power analysers, one on the supply side and one on the motor side, provided the motor-side analyser can measure a PWM waveform correctly.

## The error: a quieter motor and a hotter drive

F-1's fan sits outside the wash hall's office wall, and the office staff complained of a high whine from the motor when the drive was first fitted. A technician raised the switching frequency from 4 kHz to 12 kHz, which moved the motor's magnetic noise above the range of hearing and ended the complaints.

In February, on afternoons above 38 °C, the fan drive began tripping on heatsink overtemperature. The plant's engineer worked the losses. At full load, the inverter's losses had risen from 312 W to 500 W, an extra 188 W, and the drive's total from 556 W to 744 W, a third more heat in the same heatsink and the same cabinet. The drive is rated 60 A at 4 kHz, and its manual derated its output current at 12 kHz to about 80% of that, 48 A, below the 53.8 A the motor drew on hot afternoons. The drive was effectively undersized for its new setting.

```figure
type: decision
title: Options for the fan motor's noise
caption: This is an illustration. The plant took the second.
- Keep 12 kHz and fit a larger drive | Quiet and within rating, but a new drive for a noise problem | Not adopted
- * Set 8 kHz, check the manual's derating and add an acoustic panel | 8 kHz gave an acceptable sound level behind the panel; the drive's 60 A rating derates to about 54 A, just above the motor's 53.8 A; 94 W more loss than at 4 kHz | Adopted
- Return to 4 kHz and accept the noise | No drive change, but the complaints resume | Not adopted
```

The trips stopped. The general lesson is that the switching frequency is a design parameter of the drive's thermal rating, not a cosmetic setting, and that any change to it must be checked against the manual's derating table and the hottest conditions the drive will see.

The plant now records every drive's switching frequency in its drive register, together with the derated current the manual gives at that frequency and the cabinet's design air temperature, so that anyone changing a setting can see at once how much thermal margin is left. The register also notes why each non-default setting was chosen, so that a later technician does not quietly reverse a change that was made for a reason, or repeat one that has already been tried and rejected.

## Exercise: the conveyor drive

C-2's drive has a module rated 1,200 V and 25 A, with, at 125 °C: V_CE0 = 0.9 V, r_CE = 40 mΩ, E_on + E_off = 3.0 mJ and E_rr = 1.0 mJ at 600 V and 25 A. The conveyor motor draws 14.5 A at full load with a power factor of 0.82, at M = 1.0, V_DC = 540 V and f_sw = 4 kHz. Neglect diode conduction for this estimate.

1. What is the peak current?
2. Estimate one IGBT's conduction loss and switching loss, and the diode's recovery loss.
3. Estimate the inverter's total loss, neglecting diode conduction.

### Worked answer

1. Î = √2 × 14.5 = 20.5 A.
2. Conduction: 0.9 × 20.5 × (1/2π + 0.82 ÷ 8) + 0.040 × 20.5² × (1/8 + 0.82 ÷ 3π) = 0.9 × 20.5 × (0.1592 + 0.1025) + 0.040 × 420.5 × (0.125 + 0.0870) = 4.83 + 3.56 = 8.4 W. Switching: 4,000 × 0.0030 ÷ π × (20.5 ÷ 25) × (540 ÷ 600) = 2.82 W. Diode recovery: 4,000 × 0.0010 ÷ π × 0.820 × 0.9 = 0.94 W.
3. Per pair, about 8.4 + 2.82 + 0.94 = 12.2 W; for six pairs, about 73 W, plus perhaps 10 W of diode conduction. The conveyor drive's inverter loses about a quarter of the fan drive's, in proportion to its smaller current.
