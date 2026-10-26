---
book: product-acoustics-by-the-numbers
chapterSlug: fans-motors-and-panel-resonances
order: 9
title: "Fans, motors and panel resonances"
description: "Trace a product's noise to its fan and motor: broadband and blade-pass noise, inlet flow, motor whine, mounts, panels that resonate, and catch a panel tuned to the fan's top-speed tone."
draft: false
---

In most products that move air, the fan is the dominant noise source, and its noise has two parts. A broadband rush comes from turbulence in the air flowing over its blades and through its housing; a set of tones comes from the regular passage of its blades, at the **blade-passing frequency** and its harmonics. The motor adds its own tones, from its magnetic forces and its drive electronics. And every tone looks for something to excite: a panel of the cabinet, a grille, a bracket, whose resonance can turn a faint tone into a drone. Most product noise complaints that survive a good air-path design come from this chain of source, path and resonance inside the product.

This chapter covers the fan's broadband and tonal noise and the conditions that make its tones strong, the motor's tones, isolating the fan and motor from the cabinet, and the cabinet panels that radiate. The running case finds that a side panel of AP-40's cabinet, between its ribs, had its first resonance at about 142 Hz, close to the fan's blade-passing frequency of 140 Hz at maximum speed, and droned whenever the fan ran near full speed.

## Broadband and tonal fan noise

A fan's broadband noise grows steeply with its speed, as the 50 log rule of Chapter 6 describes, and depends on the fan's design, its operating point and the smoothness of the flow through it. A fan running near its best efficiency is quieter than the same fan pushed against a high resistance, where the flow separates from its blades. Choosing a fan whose best-efficiency point matches the product's air flow and pressure is the first and largest noise decision in an air-moving product.

The tones come from the blades. Each blade, passing a fixed point, produces a pressure pulse, so a fan with B blades turning at N revolutions per minute produces a tone at:

```figure
type: formula
title: Blade-passing frequency and a panel's first resonance
formula: f_BPF = B × N ÷ 60;   f₁₁ ≈ (π ÷ 2) × (1 ÷ a² + 1 ÷ b²) × √(D ÷ (ρ × h)), with D = E × h³ ÷ (12 × (1 − ν²))
caption: This is an illustration. The panel formula is for a flat, simply supported rectangular plate, a rough model for a bay of a moulded cabinet between ribs, with illustrative ABS properties: E ≈ 2.2 GPa, ρ ≈ 1,050 kg/m³, ν ≈ 0.35.
- B, N | Number of blades; fan speed, rpm
- a, b, h | Panel bay's length, width and thickness, m
- E, ρ, ν | Panel material's Young's modulus, density and Poisson's ratio
step: AP-40's 7-blade fan: 140 Hz at 1,200 rpm, 93.3 Hz at 800 rpm, 58.3 Hz at 500 rpm
step: A 135 × 195 mm bay of 2.5 mm ABS: f₁₁ ≈ 142 Hz
step: The same bay at 3.0 mm: f₁₁ ≈ 171 Hz
```

The blade-pass tone is strongest when the flow into the fan is uneven. A strut, a motor bracket, the edge of a filter frame or a sharp corner of the housing close to the fan's inlet makes each blade see a disturbance once per revolution, and the fan sings. Keeping obstructions well clear of the inlet, by a fraction of the fan's diameter, and giving the air a smooth, unobstructed approach reduce the tones far more than any treatment downstream. For centrifugal and backward-curved fans like AP-40's, the gap between the impeller and the **cut-off**, the point of the scroll housing closest to the impeller, has the same effect: too small a gap produces a strong tone.

## Motor noise

AP-40's fan is driven by a brushless DC motor. Its magnetic forces vary as its rotor's poles pass its stator's teeth, producing tones at multiples of its rotational speed set by its pole and slot counts. Its drive electronics switch the motor's current on and off at a **switching frequency**, and if that frequency is within hearing, the motor's windings and laminations can whine audibly at it. Many products set the switching frequency above about 20 kHz, beyond hearing, for exactly that reason, and check the motor's sound with its own drive electronics rather than with a laboratory supply. The motor's maker can say which tones to expect; a measurement with the motor running on its own, without the fan, separates its tones from the fan's.

## Isolating the fan and motor

The fan and motor shake as they run, from small imbalances in the impeller and from the motor's magnetic forces, and they pass that vibration to whatever holds them. The principles of vibration isolation are those of any machine, as Machine Noise Control by the Numbers explains for a compressor: the mounts' natural frequency must be well below the forcing frequencies to be isolated. For a product, that means elastomer grommets or mounts soft enough that the fan assembly's natural frequency on them sits well below its blade-passing frequency at the lowest speed of interest.

This is an illustration. AP-40's fan turns at between 500 and 1,200 rpm, so its rotational frequency ranges from about 8.3 to 20 Hz and its blade-passing frequency from about 58.3 to 140 Hz. Isolating the rotational frequency at 8.3 Hz would need very soft mounts that let the fan sway; isolating the blade-passing frequency, at 58.3 Hz and above, is practical with modest grommets whose natural frequency is below about 20 Hz. The mounts were chosen for the blade-pass tone, and the impeller was balanced to keep the rotational forcing small, the usual combination for small fans.

## The running case: a drone at full speed

This is an illustration. AP-40's cabinet is moulded in 2.5 mm ABS, with ribs dividing its side panels into bays. One bay on the side nearest the fan, about 135 × 195 mm, has a first resonance, by the plate formula, of about **142 Hz**. At maximum speed, the fan's blade-passing frequency is **140 Hz**.

## The error: a panel tuned to the blade-pass tone

On the first full prototype, AP-40 droned at maximum speed: a steady hum that listening panels described as irritating, though its A-weighted sound power was within 1 dB of the target. A vibration measurement found the side bay moving strongly at 140 Hz, and as the fan's speed was varied, the drone peaked at about 1,166 rpm, where the blade-passing frequency matched the bay's resonance, and fell away on either side.

```figure
type: line
title: AP-40's blade-passing frequency against the side bay's first resonance, by fan speed
x: Fan speed, rpm
y: Frequency, Hz
legend: Blade-passing frequency, 7 blades | Side bay's first resonance, as moulded
ymin: 40
ymax: 160
caption: This is an illustration. The blade-pass tone sweeps up with speed and crosses the bay's resonance near 1,166 rpm, just below maximum speed, where the product droned.
- 500 | 58.3 | 142
- 600 | 70.0 | 142
- 800 | 93.3 | 142
- 1000 | 116.7 | 142
- 1100 | 128.3 | 142
- 1200 | 140.0 | 142
```

The panel's resonance had not been checked against the fan's tones because the two were designed by different people: the cabinet for stiffness and appearance, the fan for air flow. The check that would have caught it is a simple table, made at the design stage, of the fan's and motor's forcing frequencies over their speed range, against the natural frequencies of the cabinet's bays, brackets and grilles, estimated by formula or by simulation, with a margin required between them. The fix had to avoid trading one coincidence for another.

```figure
type: compare
title: Options for moving the side bay's resonance away from the fan's tones
cols: Bay's first resonance | Against the blade-pass tone, 58 to 140 Hz, and its second harmonic, up to 280 Hz
caption: This is an illustration by the plate formula. A rib through the middle of the bay would have moved its resonance onto the second harmonic at full speed; an off-centre rib clears both.
- As moulded, 135 × 195 mm, 2.5 mm | About 142 Hz | Coincides with the tone at about 1,166 rpm
- 3.0 mm wall | About 171 Hz | Clears the tone by about 22%, at a cost in material
- Centre rib, two bays of 135 × 97.5 mm | About 280 Hz | Coincides with the second harmonic at full speed
- *Off-centre rib, bays of 135 × 115 and 135 × 80 mm | About 229 Hz and higher | Clears the tone by about 64% and the harmonic by about 22%
```

The fix was the off-centre rib, which moved the larger bay's first resonance to about 229 Hz, above the blade-pass tone's highest frequency with good margin and below its second harmonic at full speed. The drone disappeared. The general lesson is that every tone a product makes sweeps through a range of frequencies as its speed changes, and that every structure it can excite must be kept clear of that whole range and its harmonics, not of the tone at one speed.

## Seeing tones against speed

The clearest way to see a product's tones and resonances together is a **speed sweep**: the fan is run slowly from its lowest speed to its highest while a microphone or an accelerometer records, and a narrowband analysis at each speed is stacked into a map of frequency against speed, sometimes called a waterfall or, in machinery work, a Campbell diagram. Tones that follow the fan's speed, the blade-pass tone and its harmonics, the motor's tones, appear as sloping lines whose slope is their order, the number of events per revolution. Resonances of the cabinet, which do not move with speed, appear as horizontal bands where every sloping line passing through them brightens. A drone like AP-40's shows at once as a bright spot where the blade-pass line crosses the side bay's band near 1,166 rpm.

The map also shows which tones matter. A tone that is faint everywhere except where it crosses a resonance points to the structure; a tone that is strong at every speed points to the fan or its inlet flow. For AP-40, the map after the rib change showed the blade-pass line crossing no strong resonance below 229 Hz, and a faint brightening where the second harmonic crossed 229 Hz near 981 rpm, small enough that listening panels did not notice it.

## Working with the fan's supplier

A fan bought from a supplier comes with performance data, and its noise data are only useful if they are measured in conditions like the product's. A fan's sound power measured on a test rig with a smooth, open inlet can be several decibels below what the same fan makes in a cabinet with a filter frame close to its inlet and a tight scroll. The specification for AP-40's fan therefore asked for sound power in octave or one-third-octave bands at its operating points, the test arrangement used, and the blade count and expected tonal content, and the team measured the fan in a mock-up of the cabinet's air path before committing the cabinet's tooling. A fan that is quiet on its supplier's rig and loud in the product is not a faulty fan; it is a fan in a different installation.

## Speed bands and blade counts

Two other measures are available in variable-speed products. The controller can **skip** a band of speeds where a tone coincides with an unavoidable resonance, passing through it quickly rather than running in it. And a fan with a different number of blades moves every tone: a 9-blade fan at 1,200 rpm has its blade-passing frequency at 180 Hz instead of 140 Hz. Changing the blade count changes the fan's aerodynamics too, so it is a decision for early in the design, made with the fan maker, not a fix for a prototype.

## Simulation and its checks

The plate formula is a first estimate for a flat, uniform bay with idealised edges; a real moulded panel has curvature, draft, bosses and ribs of finite stiffness, and its resonances can differ from the formula's by tens of per cent. A finite-element modal analysis of the cabinet, run from the CAD model early in the design, gives better estimates of its bays' resonances, and a tap test on the first moulded part, an accelerometer and a small hammer, confirms them. The table of forcing frequencies against resonances is then updated with the measured values before the tooling is finalised.

## Damping panels

Where a panel cannot be moved off a resonance, damping lowers its response. A bonded damping pad, a constrained-layer patch or a foam pad pressed against the panel converts its vibration into heat at its resonances. For a moulded plastic cabinet, which already has some internal damping, a small pad at the centre of a droning bay can reduce the drone noticeably. Damping is a remedy, not a design method: it costs material and assembly time on every unit, where a rib in the mould costs nothing per unit once the tool is cut.

## Rattles and buzzes

Loose parts make the most objectionable sounds of all: a cable that taps a panel, a clip that buzzes against its housing, a filter that rattles in its frame at one fan speed. Each is excited by the fan's or the speaker's vibration and by the air pressure inside the cabinet, and each comes and goes with speed and temperature, which makes them hard to find. A **rattle sweep**, running the fan slowly through its whole speed range and playing the speaker's loudest content, while listening and measuring in a quiet room, is part of every prototype's test, and cable routing, clip preload and foam pads at contact points are designed in from the start.

## Exercise: a faster maximum

Marketing asks whether AP-40's maximum speed could be raised to 1,350 rpm for a "boost" mode. What would the blade-passing frequency and its second harmonic become at 1,350 rpm, and do they clear the side bay with the off-centre rib, whose first resonance is about 229 Hz? What does the 50 log rule say about the boost mode's sound power?

**Worked answer.** At 1,350 rpm, the blade-passing frequency is 7 × 1,350 ÷ 60 = **157.5 Hz** and its second harmonic **315 Hz**. The tone now sweeps from 58.3 to 157.5 Hz, still well below 229 Hz, which is about 45% higher; the second harmonic sweeps up to 315 Hz and passes 229 Hz at about 981 rpm, where its frequency is 229 Hz.

The second harmonic already crossed 229 Hz within the original speed range, at the same 981 rpm, so the boost mode adds no new coincidence for the larger bay, but the smaller bay's resonance, above about 370 Hz, should be checked against the third harmonic at boost speed, which reaches about 472 Hz. By the 50 log rule, the boost mode's sound power is about 55.0 + 50 × log₁₀(1,350 ÷ 1,200) ≈ **57.6 dB(A)**, 2.6 dB above the present maximum, which the declared values of Chapter 10 must include.
