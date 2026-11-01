---
book: eddy-current-inspection-by-the-numbers
chapterSlug: coils-eddy-currents-and-the-impedance-plane
order: 1
title: "Coils, eddy currents and the impedance plane"
description: "How a coil induces eddy currents in a metal, why the coil's resistance and reactance change, how to read an impedance-plane display, and how to set the phase so lift-off is not read as a flaw."
draft: false
---

Every eddy-current instrument does the same basic thing: it drives an alternating current through a coil and measures the coil's impedance, the ratio of the voltage across it to the current through it. Bring the coil near a metal and the impedance changes. The instrument displays that change as a point moving on a screen, and the inspector's whole job is to know what moved it. Was it the metal's conductivity, the distance between coil and part, the part's thickness or a crack? Each moves the point in a characteristic direction, and the art of eddy-current testing lies in setting up the instrument so that the change that matters moves the point in a direction the others do not.

This chapter explains why the impedance changes, builds a simple model of the coil and the part that reproduces the shape of the impedance-plane display, and uses it to show how frequency separates conductivity from lift-off. Its mistake is an instrument whose phase was never set, so that a technician's hand movements were read as flaws.

## What the coil does to the metal

An alternating current in a coil makes an alternating magnetic field around it. When the field passes into a conductor, it induces an electromotive force around every loop of metal it threads, and currents flow in closed paths in the metal, roughly in circles parallel to the coil's windings: eddy currents. They flow most strongly near the surface closest to the coil and weaken with depth, as Chapter 2 calculates.

Eddy currents are themselves currents, so they make their own magnetic field, which opposes the coil's. Two things happen to the coil as a result. Its inductive reactance falls, because the opposing field cancels part of its own. And its resistance rises, because the energy dissipated as heat by the eddy currents in the metal has to come from the coil's supply, and to the instrument that looks exactly like extra resistance in the coil.

The size of both changes depends on how strongly the coil and the metal are coupled, which falls quickly as the gap between them grows, and on how easily the eddy currents flow, which depends on the metal's conductivity, the frequency, the part's thickness and anything, such as a crack, that blocks the current paths. In a ferromagnetic metal such as steel, the permeability also concentrates the coil's field and raises the reactance, an effect Chapter 7 uses.

## A simple model: the coil and one loop

A useful picture treats the part as a single loop of metal with its own resistance R₂ and inductance L₂, magnetically coupled to the coil, whose inductance in air is L₀, through a coupling coefficient k. This is the transformer model of an eddy-current probe. Working through the circuit gives the change in the coil's impedance.

```figure
type: formula
title: Coil impedance in the transformer model, normalised to the coil's reactance in air
formula: β = ω L₂ ÷ R₂
formula: Normalised resistance R_n = k² β ÷ (1 + β²)
formula: Normalised reactance X_n = 1 − k² β² ÷ (1 + β²)
caption: The coil's own winding resistance is subtracted and the result divided by its reactance in air, ωL₀. β grows with frequency and with the part's conductivity, because R₂ falls as conductivity rises. k² is the coupling, which falls as the coil lifts off the part.
- ω | angular frequency, rad/s
- L₂, R₂ | inductance and resistance of the equivalent loop in the part
- k² | square of the coupling coefficient, 0 to 1
- R_n, X_n | normalised resistance and reactance
```

As β runs from zero to infinity, the point (R_n, X_n) traces a semicircle. At β = 0, a non-conductor or zero frequency, the coil reads as it does in air: R_n = 0 and X_n = 1. As β rises, the resistance first rises, peaking at k² ÷ 2 when β = 1, and then falls again, while the reactance falls steadily towards 1 − k². At very high β, a perfect conductor, the eddy currents flow without loss and simply cancel part of the coil's field: no added resistance, reactance reduced.

The semicircle is the shape of the impedance-plane display on every eddy-current instrument, though for a real probe on a real part the curve is distorted from a perfect semicircle and its scale depends on the probe. The model is too simple for quantitative work, but it shows the directions in which things move, which is what the inspector needs.

```figure
type: svg
title: The normalised impedance plane in the transformer model
alt: A plot with normalised resistance increasing to the right and normalised reactance increasing upwards. The point for the coil in air sits at the top left. A large semicircle bulges to the right from the air point down to the lower left, labelled coupling squared 0.8. Points on it are marked for beta 0.3 near the top, beta 1 at the rightmost point and beta 3 near the bottom. A smaller semicircle labelled coupling squared 0.6 lies inside it. A dashed line runs from the beta 1 point straight back towards the air point, labelled lift-off. An arrow along the large curve points downward, labelled higher conductivity or frequency.
caption: This is an illustration. The coil in air sits at (0, 1). Raising the conductivity or the frequency moves the point clockwise along the curve. Lifting the coil off the part reduces the coupling, so the point moves along a straight line towards the air point onto a smaller curve.
viewbox: 0 0 520 380
body:
<path class="ln" d="M60 20V360H500"/>
<text class="tx txs" x="380" y="352">Normalised resistance</text>
<text class="tx txs" x="68" y="372">0</text>
<text class="tx txs" x="212" y="372">0.4</text>
<text class="tx txs" x="16" y="24">1.0</text>
<text class="tx txs" x="16" y="184">0.6</text>
<text class="tx txs" x="16" y="344">0.2</text>
<path class="lf" d="M60 20A160 160 0 0 1 60 340"/>
<path class="ln dsh" d="M60 20A120 120 0 0 1 60 260"/>
<circle class="fa" cx="60" cy="20" r="6"/>
<text class="txb" x="72" y="16">Air</text>
<circle class="fa" cx="148" cy="46" r="5"/>
<text class="tx txs" x="158" y="44">β = 0.3</text>
<circle class="fa" cx="220" cy="180" r="5"/>
<text class="tx txs" x="230" y="184">β = 1</text>
<circle class="fa" cx="156" cy="308" r="5"/>
<text class="tx txs" x="166" y="318">β = 3</text>
<path class="dsh" d="M220 180L60 20"/>
<text class="txa" x="120" y="110">Lift-off</text>
<text class="tx txs" x="262" y="80">k² = 0.8</text>
<text class="tx txs" x="160" y="230">k² = 0.6</text>
<path class="la" d="M250 230Q236 278 196 300"/>
<text class="tx txs" x="270" y="260">Higher σ or f</text>
```

## Separating conductivity from lift-off

The display gives two signals, which is its great advantage over a single meter reading. A change in conductivity moves the point along the curve; a change in lift-off moves it along a line towards the air point. If the two directions differ, the instrument can tell them apart.

How much they differ depends on where on the curve the test operates, and the operator controls that through the frequency. Using the model with k² = 0.8, the angle between the direction of a small rise in conductivity and the direction of a small rise in lift-off is:

```figure
type: compare
title: Angle between the conductivity and lift-off directions on the impedance plane, transformer model, k² = 0.8
cols: Point (R_n, X_n) | Conductivity direction | Lift-off direction | Angle between them
rowhead: Operating point
- β = 0.3, low frequency | (0.220, 0.934) | −33.6° | 163.3° | 163.1°
- β = 1, the knee | (0.400, 0.600) | −90.3° | 135.0° | 134.7°
- * β = 3, higher frequency | (0.240, 0.280) | −143.3° | 108.4° | 108.3°
caption: This is an illustration. Directions are measured anticlockwise from the resistance axis. At low β the two directions are nearly opposite, so a lift-off change looks like a conductivity change; at β = 3 they are about 108° apart, much easier to separate.
```

At low β, a small increase in conductivity and a small decrease in lift-off push the point in almost the same line, only reversed, so the instrument cannot tell a slightly more conductive metal from a probe pressed slightly harder against the part. Higher on β, beyond the knee of the curve, the two directions open up. Conductivity meters and crack detectors are designed to operate in the region where their signal of interest is well separated from lift-off, and that is the first reason the test frequency matters. The second, depth, is the subject of Chapter 2.

### Frequency and conductivity act together

In the model, the operating point depends on β = ωL₂ ÷ R₂, and the loop's resistance R₂ is inversely proportional to the metal's conductivity. So β is proportional to the product of frequency and conductivity: doubling the frequency on one alloy moves the point exactly as far along the curve as testing an alloy of twice the conductivity at the original frequency. Real probes behave the same way, with the probe's size entering as well: a larger coil reaches the knee at a lower frequency. This is why eddy-current instruments for different metals run at different frequencies. A probe that sits at the knee on copper at 20 kHz would need several hundred kilohertz to reach the same point on stainless steel, whose conductivity is about forty times lower.

## Probes and coils

The coil comes in many forms, chosen for the part and the job.

**Surface probes** sit on or near the surface with the coil's axis at right angles to it. A flat, wide coil, sometimes called a pancake coil, suits conductivity and coating measurement, where an average over a few square millimetres is wanted. A small coil in a pointed housing, a pencil probe, concentrates the field for finding cracks at edges, fillets and holes. A ferrite core and a metal shield concentrate the field further and reduce the effect of nearby edges.

**Encircling coils** surround a bar, tube or wire that passes through them, testing the whole circumference at once. Chapter 7 uses one for sorting shafts and Chapter 8 for tubes.

**Absolute and differential connection.** An absolute probe measures the impedance of one coil against a fixed reference, so it responds to everything that differs from the balance condition, gradual or sudden. A differential probe has two coils side by side and measures the difference between them, so it ignores slow changes that affect both coils together, such as gradual variations in conductivity or temperature, and responds sharply to small, local changes such as a crack passing under one coil and then the other. Conductivity and coating measurements are absolute; crack detection is often differential.

**Driver and pickup coils.** Some probes use one coil to make the field and another to sense it, a reflection or driver-pickup probe. The principle is the same: the sensed voltage changes with the eddy currents in the part.

The pump maker uses a shielded pancake probe on its conductivity meter, an amplitude-sensitive probe on its coating gauge, a four-element array of small differential coils on the journal scanner and an absolute encircling coil on the shaft sorting bridge.

## Putting numbers on the impedance

The impedance changes are small but easily measured. Take a probe coil with an inductance of 50 µH in air, driven at 100 kHz. Its reactance in air is ωL₀ = 2π × 100,000 × 50 × 10⁻⁶ = 31.4 Ω. Placed on aluminium at an operating point where β = 1 and k² = 0.8, the model gives an added resistance of 0.400 × 31.4 = 12.6 Ω and a reactance of 0.600 × 31.4 = 18.8 Ω.

```figure
type: compare
title: The 50 µH probe at 100 kHz on aluminium, transformer model
cols: R_n | X_n | Added resistance | Reactance
rowhead: Condition
- Reference: β = 1, k² = 0.8 | 0.400 | 0.600 | 12.57 Ω | 18.85 Ω
- Lifted off: k² = 0.6 | 0.300 | 0.700 | 9.42 Ω | 21.99 Ω
- Conductivity 20% higher: β = 1.2 | 0.393 | 0.528 | 12.36 Ω | 16.58 Ω
- Conductivity 20% lower: β = 0.8 | 0.390 | 0.688 | 12.26 Ω | 21.61 Ω
caption: This is an illustration. Near the knee, a conductivity change moves the reactance much more than the resistance, while lift-off changes both. The instrument displays these as a vector from a balance point.
```

The instrument does not display ohms. It balances, or nulls, the bridge on a reference condition, so the point sits at the centre of the screen, and then displays the change from that condition as a vector, amplified by the gain and rotated by the phase control. The operator sets the gain so that a reference signal fills a chosen part of the screen, and the phase so that the nuisance signal, usually lift-off, lies in a chosen direction, normally horizontal. Gain is set in decibels, and each 6 dB doubles the displayed signal, so a reference indication that fills 40% of the screen height at 50 dB fills 80% at 56 dB. Recording the frequency, gain and phase with every set-up lets the next operator reproduce it exactly.

## The mistake: a hand that made flaws

The pump maker bought a portable flaw detector with an impedance-plane display for checking the shafts by hand before the automated scanner was installed. A new technician, trained on a different instrument, balanced it on a sound shaft journal, set the gain on the reference block's 0.5 mm notch and began scanning. Within an hour he had rejected eleven shafts for crack indications. A senior technician rechecked them and found nothing.

The fault was the phase. It had been left at the setting the instrument arrived with, which on that probe put the lift-off signal almost vertical, the same direction as the notch signal. Every time the technician's hand rocked the pencil probe on the curved journal, or the probe crossed a slight change in the ground surface, the lift-off signal rose vertically past the alarm gate, exactly as a crack would.

```figure
type: steps
title: How the phase was set and the shafts cleared
caption: This is an illustration. The alarm gate is a box on the display; a signal crossing it triggers the alarm.
- Symptom | Eleven shafts rejected in an hour; none confirmed on recheck
- Test | Probe lifted 0.1 mm on a paper shim on the reference block: the signal moved vertically, the same direction as the notch
- Correction | Phase rotated until the lift-off signal ran horizontally to the left; notch signal then about 60° from horizontal
- Gate | Alarm set on the vertical component only, so horizontal lift-off no longer triggers it
- * Recheck | Eleven shafts rescanned: no indications; all released
- Procedure | Phase check with a 0.1 mm shim added to the start-of-shift set-up
```

Once the lift-off ran horizontally and the alarm was set on the vertical component only, rocking the probe moved the point sideways along the gate without triggering it, while the notch still crossed it. The eleven shafts were released after the recheck. The procedure now requires the phase to be checked at the start of every shift with a thin, non-conductive shim: lift the probe by the shim's thickness on the reference block and confirm the signal runs horizontally.

## What the display can and cannot tell apart

The impedance-plane display gives two numbers for each change, its size and its direction. That is enough to separate two influences, such as conductivity and lift-off, or a crack and lift-off, but not three at once. When three things vary, such as conductivity, lift-off and the part's thickness, the inspector must either hold one constant, by choosing a part thick enough that thickness does not matter, or use a second frequency, which gives another pair of numbers. Instruments with several frequencies at once, multifrequency instruments, mix the signals from two frequencies to cancel an unwanted influence, such as the support plates on a heat-exchanger tube.

The pump maker's three tests each separate two influences.

```figure
type: compare
title: What each of the pump maker's tests separates
cols: Signal wanted | Nuisance suppressed | How
rowhead: Test
- Conductivity of housing bar | Conductivity | Lift-off from surface roughness and anodising | Meter's operating point and lift-off compensation; thick enough part (Chapter 2)
- Anodising thickness | Lift-off | Conductivity of the substrate | Calibration on the same alloy (Chapter 5)
- Shaft journal cracks | Crack | Lift-off from probe wobble | Phase rotation and a vertical alarm gate (this chapter)
- Shaft hardness sort | Permeability | Shaft diameter and position | Fixed encircling coil, comparator on a reference shaft (Chapter 7)
caption: This is an illustration. Each test turns one influence into the signal and manages the other.
```

## Exercise: reading the knee

A conductivity test runs at an operating point where β = 1 on a probe with k² = 0.8. A batch of parts arrives with a slightly rougher surface, so the probe sits further off the metal, reducing k² to 0.7 at the same β. Using the transformer model, where does the point move to, and in what direction relative to the lift-off line? Would a meter that measures only the reactance read this as a change in conductivity?

### Answer

With k² = 0.7 and β = 1, R_n = 0.7 × 1 ÷ 2 = 0.350 and X_n = 1 − 0.7 × 1 ÷ 2 = 0.650. The point moves from (0.400, 0.600) to (0.350, 0.650): along the straight line towards the air point at (0, 1), which is the lift-off line, as the model predicts for any change of coupling at constant β.

A meter that measured only the reactance would see X_n rise from 0.600 to 0.650. The table above shows that a 20% fall in conductivity raises X_n from 0.600 to 0.688, so the roughness would read as a fall in conductivity of about 12% (in the model, X_n reaches 0.650 at β = 0.882). That is why conductivity meters use the direction of the change, not only its size, and compensate for lift-off, and why Chapter 4 checks a meter on parts with the same surface finish as production.
