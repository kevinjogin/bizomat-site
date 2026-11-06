---
book: arc-welding-by-the-numbers
chapterSlug: the-arc-as-a-heat-source
order: 1
title: "The arc as a heat source"
description: "Calculate arc power from voltage and current, see where the arc's heat is released, and use the 1921 measurements to show how little of the electrode is vaporised."
draft: false
---

A welding arc is an electrical discharge through hot, ionised gas between an electrode and the work. It is one of the most concentrated heat sources available in a workshop, and it is controlled with two numbers that any welder can read: the current through the arc and the voltage across it. Their product is the arc power, the rate at which electrical energy becomes heat. Almost every other calculation in arc welding, from heat input to deposition to cost, starts there.

This chapter calculates the arc power for the conveyor frames, looks at where in the arc the heat is released, and uses measurements made in 1921 to show what happens to the electrode.

## Arc power

The power delivered to the arc is

**P = V × I**

where P is power in watts, V is the arc voltage in volts and I is the welding current in amperes. For manual metal arc welding with direct current, the voltage and current are steady enough during welding that this simple product is a good estimate. With alternating current, or with pulsed processes, the instantaneous values change rapidly and the true arc power is the average of the instantaneous product, which modern meters calculate; the simple product of the meter readings is only an approximation.

This is an illustration. The shop welds the conveyor frames with low-hydrogen electrodes, 4.0 mm diameter at 170 A for the main fillet welds and 3.2 mm at 130 A for root and positional work. Measured at the electrode holder and the work, the arc voltages are about 26 V and 24 V respectively.

```figure
type: formula
title: Arc power for the conveyor-frame electrodes
formula: P = V × I
caption: This is an illustration. Voltages are measured close to the arc, not at the machine terminals, so cable losses are excluded.
- P | arc power, W
- V | arc voltage, V
- I | welding current, A
step: 4.0 mm electrode: P = 26 × 170 = 4,420 W
step: 3.2 mm electrode: P = 24 × 130 = 3,120 W
```

At 4.42 kW, the arc in a 4.0 mm electrode releases about as much heat as four domestic radiator bars, concentrated in a region a few millimetres across. That concentration is what makes arc welding possible: the heat is released faster than conduction can carry it away from the joint, so the metal melts locally.

## Arc voltage and arc length

For a given process and current, arc voltage rises with arc length. A longer arc has a longer column of hot gas, which adds resistance, so the power source must supply more voltage to drive the same current. Wanamaker and Pennington described gauging arc length in 1921 by connecting a voltmeter across the arc, noting a figure of about 18 volts for a proper arc in their bare-electrode practice; Hamilton and Oberg in 1918 gave arc voltages of about 15 to 25 volts for the metallic arc and 35 to 50 volts for the carbon arc.

The relationship matters for three reasons. A long arc spreads its heat over a wider area, so penetration falls and the weld becomes wide and flat. It exposes the molten metal to more air, which for low-hydrogen electrodes in particular causes porosity because the electrode's gas shield is less effective. And it makes the arc less stable and increases spatter. A short arc concentrates heat and keeps the shield effective, but too short an arc tends to stub out and short-circuit.

The arc voltage that a welder sees on the machine's meter includes the voltage lost in the cables and connections, which can be several volts (Chapter 3). The shop measures arc voltage with a meter clipped to the electrode holder and the work near the joint when it sets up its procedures, so that the procedure records the voltage at the arc.

## Where the heat is released

The arc has three regions: a thin layer at the negative terminal (the cathode), the arc column, and a thin layer at the positive terminal (the anode). Each has its own voltage drop, and the heat released in each is that voltage times the current. Wanamaker and Pennington quoted an estimate for an 18 V, 150 A arc with a bare mild steel electrode: about 9 V at the anode, 7 V at the cathode and only 2 V in the arc stream. In that short metallic arc, most of the energy was released at the two ends, not in the column.

```figure
type: bars
title: Estimated voltage drops in an 18 V, 150 A bare-electrode arc, 1921
unit: V
max: 10
caption: Figures quoted by Wanamaker and Pennington in 1921 as an estimate. In this short arc most of the heat was released at the electrode surfaces, very little in the column itself.
- Anode drop | 9
- Cathode drop | 7
- Arc stream | 2
```

That is why polarity matters, a subject for Chapter 7. Hamilton and Oberg noted in 1918 that carbon-arc welders made the work positive and the carbon negative, so that the greater heat at the positive terminal went into the work. With modern covered electrodes the picture is more complicated, because the coating's chemistry changes the arc, and makers specify the polarity for each electrode. The low-hydrogen electrodes used on the conveyor frames are run with the electrode positive or on alternating current, as their data sheet allows.

## How little of the electrode is vaporised

The 1921 book contains a neat calculation. In a test with an 18 V, 150 A arc, a 5/32 inch (3.9 mm) bare mild steel electrode was consumed at 3.1 lb (1.4 kg) per hour. The electrode was the negative terminal, where the estimated drop was 7 V, so the power released there was 7 × 150 = 1,050 W.

One pound of electrode took 1 ÷ 3.1 hours, or about 1,161 seconds, to consume. The energy released at the electrode end per pound was therefore about 1,050 × 1,161 ≈ 1.2 million watt-seconds, which is 1.2 MJ, matching the authors' figure. They then estimated that vaporising a pound of iron would need about 3.1 MJ, more than twice as much. Their conclusion was that only a small proportion of the electrode could be vaporised; the metal must be melted and transferred to the work as liquid drops.

That conclusion still holds, and it matters for estimating. Nearly all the electrode that melts reaches the weld pool as liquid, with losses mainly as spatter, a little fume, and the unused stub. Chapter 4 uses a 1921 weighed test and modern data to put numbers on those losses.

## Direct and alternating current

Hamilton and Oberg wrote in 1918 that the alternating-current arc, which falls to zero and reverses at every half-cycle, was not suitable for metallic arc welding with the bare electrodes of the day, because it went out and was hard to re-strike, so direct current from motor-generator sets was used. Wanamaker and Pennington described how, with a bare electrode on alternating current, the metallic vapour cooled at each reversal, making the arc hard to sustain.

Covered electrodes changed that. Their coatings contain compounds that keep the arc atmosphere ionised as the current passes through zero, so the arc re-strikes each half-cycle. Many modern electrodes, including the low-hydrogen type used on the conveyor frames, can run on either direct current or alternating current, as their data sheets state. Alternating current is less prone to the magnetic arc blow described in Chapter 7 and can be supplied by a simple transformer, while direct current gives a more stable arc, easier starting and the choice of polarity.

The choice affects the numbers in this chapter. With direct current, the meter readings of voltage and current can simply be multiplied. With alternating current, and with modern pulsed and waveform-controlled processes, the arc power must be measured by an instrument that averages the instantaneous product, because the product of two average readings is not the average power. Procedures for those processes often record arc energy measured by the welding machine itself.

## What the welder controls

In manual metal arc welding, the welder sets the current on the machine and controls the voltage with arc length, as described above. The machine is designed to hold the current roughly constant as arc length varies, so the welder's hand changes the voltage and therefore the power, while the current stays near its setting. A welder holding a long arc is putting in more power than one holding a short arc at the same current, but spreading it over a wider area.

In gas metal arc welding, the arrangement is reversed. The welder or operator sets the voltage on the machine and the wire feed speed, and the machine supplies whatever current is needed to burn off the wire at that speed. Chapter 2 explains how the two kinds of power source achieve this. For estimating, the point is that the recorded parameters differ: a manual metal arc procedure states current and an arc voltage range; a gas metal arc procedure states voltage, wire feed speed and the resulting current range.

In both processes, travel speed is entirely in the welder's hands, and it is the variable that changes most between welders. It sets the arc energy per millimetre, the size of the weld and, as Chapter 6 shows, the time and cost of the job.

## Arc energy and heat input

Arc power alone does not say how much heat goes into each millimetre of weld. That depends on how fast the arc travels along the joint. The arc energy per unit length is

**arc energy (kJ/mm) = 60 × V × I ÷ (1,000 × travel speed in mm/min)**

For the conveyor frames' 6 mm fillet welds, the 4.0 mm electrode at 26 V and 170 A travels at about 160 mm/min (Chapter 6 derives this speed from the deposition rate). The arc energy is 60 × 26 × 170 ÷ (1,000 × 160) ≈ **1.66 kJ/mm**.

Arc energy is the basis of heat input, which governs cooling rate, distortion and the metallurgical effects described in [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/heat-expansion-and-shrinkage/) and [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/). Heat input applies a thermal efficiency factor for the process, and welding procedures may set limits on it. The BIZOMAT [welding arc energy and heat input calculator](/tools/welding-heat-input/) performs the calculation. This book does not repeat that material; it uses arc power and arc energy mainly as inputs to the duty cycle, deposition, time and cost calculations that follow.

## Measuring the arc

Because arc power drives so much else, the shop measures it rather than trusting dial settings. Three points matter.

1. **Current is measured with a clamp meter or the machine's calibrated meter**, around the welding lead, not by the dial setting. Dial settings drift, and different machines set to the same number deliver different currents.
2. **Voltage is measured at the arc**, between the electrode holder and the work near the joint, so cable and clamp losses are excluded.
3. **Travel speed is measured** by timing a known length of weld, because it varies more between welders than any electrical setting.

```figure
type: checklist
title: Arc measurements recorded for each conveyor-frame procedure
caption: This is an illustration of the shop's set-up record. Each measured value is compared with the procedure's range.
- x Electrode type and diameter | low-hydrogen, 4.0 mm for fillets
- x Polarity | electrode positive, as the data sheet allows
- x Current at the lead | clamp meter, 170 A
- x Voltage at the arc | holder to work, 26 V
- x Travel speed | timed over 300 mm, about 160 mm/min
- *? Arc energy | calculated, about 1.66 kJ/mm, compared with any procedure limit
```

## A failure: porosity from a long arc

This is an illustration. Radiographs of a sample of butt welds on a batch of conveyor head-frame plates showed clusters of porosity, and a few fillet welds on the same frames showed surface pores at their ends. The electrodes came from a sealed container and were stored as the maker specified, which ruled out the most common cause of porosity with low-hydrogen electrodes, moisture.

The supervisor watched the welders and measured the arc. On the overhead and vertical joints, where the head-frame plates were hard to reach, one welder was holding a visibly long arc to see the weld pool. The voltage at the arc was about 31 V instead of the procedure's 24 to 26 V. The long arc let air into the arc atmosphere and weakened the shield, causing the porosity, and the pores at the weld ends came from the same long arc at restarts.

The correction had three parts: the head-frame plates were repositioned on a manipulator so that more of the welding could be done flat (Chapter 8), the welder was retrained in short-arc technique for positional work, and the procedure was amended to state the arc voltage range and to require the restart technique the electrode maker recommends. The porous welds were ground out and rewelded.

## Exercise: the 1921 deposition test

In a test reported in 1921, an arc ran at an average of 140 A and 21 V for 33 minutes. Calculate the arc power, and the energy delivered to the arc in watt-hours and kilowatt-hours. The welding equipment drew 2,976.9 watt-hours from its supply during the test. What fraction of the supply energy reached the arc?

The arc power was 21 × 140 = **2,940 W**. Over 33 minutes, or 0.55 h, the arc received 2,940 × 0.55 ≈ **1,617 Wh**, which is **1.62 kWh**. The fraction of the supply energy reaching the arc was 1,617 ÷ 2,976.9 ≈ **0.54**, so about 54%; the rest was lost in the welding equipment of the day. Chapter 2 shows where that loss came from, and why a modern inverter loses far less.
