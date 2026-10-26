---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: waves-modes-and-excitations
order: 1
title: "Waves, modes and the forces that excite them"
description: "Use wave speed, wavelength and the standing-wave rule to find natural frequencies, then list every excitation of a belt-driven fan across its speed range."
draft: false
---

A part vibrates at a natural frequency because a disturbance runs along it, reflects from its ends and returns in step with itself. That picture explains why a longer belt span hums at a lower note, why a tighter guy rope sings higher and why a steel bar rings far above anything a fan can push it at. It also gives a practical method: find how fast a wave travels in the part, find which wavelengths fit between its ends, and the natural frequencies follow.

This chapter sets up that method and the running case. It introduces wave speed, standing waves and the end conditions that decide which wavelengths fit. It then lists every frequency at which the RF-3 exhaust fan pushes on its own parts, across the whole speed range of its drive. The other chapters each take one family of parts and test it against that list.

## Speed, frequency and wavelength

A wave is a pattern of disturbance that moves through a material while the material itself only oscillates in place. Three numbers describe a steady wave train:

- **Wave speed c**, in metres per second: how fast the pattern travels.
- **Frequency f**, in hertz: how many cycles pass a fixed point each second.
- **Wavelength λ**, in metres: the distance between neighbouring crests.

They are tied together by **c = f λ**. If a wave travels at 61 m/s and has a wavelength of 1.2 m, its frequency is 61 ÷ 1.2, or about 51 Hz.

The wave speed depends on the part and on the kind of motion. For sideways motion of a taut string, belt or rope, it depends on tension and mass per metre. For stretching and compressing waves along a bar, it depends on the elastic modulus and density. For twisting waves in a shaft, it depends on the shear modulus and density. Later chapters give each formula and work it through. The table shows the speeds this book uses.

```figure
type: compare
title: Wave speeds used in this book
rowhead: Part and motion
cols: Formula | Teaching values | Wave speed
caption: This is an illustration. Belt and rope speeds depend on tension, so they change when the part is adjusted; bar and shaft speeds are fixed by the material.
- Belt span, sideways | c = √(T / m) | 450 N, 0.12 kg/m | 61.2 m/s
- Guy rope, sideways | c = √(T / m) | 1,200 N, 0.14 kg/m | 92.6 m/s
- * Steel bar, along its length | c = √(E / ρ) | 200 GPa, 7,850 kg/m³ | 5,048 m/s
- Steel shaft, twisting | c = √(G / ρ) | 79.3 GPa, 7,850 kg/m³ | 3,178 m/s
```

The spread is wide. A disturbance runs along a steel bar more than eighty times faster than along a tensioned belt. That difference decides which parts of a machine behave as vibrating waves at the frequencies a fan produces and which behave as simple springs.

## Standing waves and the end conditions

When a wave reaches the end of a part it reflects. A wave travelling one way and its reflection travelling back add together. At most frequencies the returning waves arrive out of step and cancel each other over time. At certain frequencies they arrive in step, and the result is a **standing wave**: a pattern that stays in place, with points that never move, called nodes, and points of largest motion, called antinodes. Those frequencies are the natural frequencies, and each pattern is a mode.

Which wavelengths fit depends on how the ends are held:

- **Both ends fixed**, as for a belt span between pulleys or a rope between anchors: each end must be a node, so a whole number of half-wavelengths must fit in the length L. The natural frequencies are **f = n c ÷ (2L)**, for n = 1, 2, 3 and so on.
- **Both ends free**, as for a loose bar ringing after a tap: each end is an antinode, and the same rule f = n c ÷ (2L) applies.
- **One end fixed and one free**, as for a cantilevered bar or a shaft held at one end: the fixed end is a node and the free end an antinode, so an odd number of quarter-wavelengths must fit. The natural frequencies are **f = (2n − 1) c ÷ (4L)**.

```figure
type: svg
title: The first three modes of a part fixed at both ends
alt: Three rows show a span fixed at both ends. The top row has one half-wave loop between the ends, the middle row two loops with a node in the centre, and the bottom row three loops with two nodes. Each row shows the shape at both extremes of its swing.
caption: Mode n fits n half-wavelengths between the fixed ends, so its frequency is n times the first. The dots are nodes, where the span does not move.
viewbox: 0 0 640 300
body:
<path class="cl" d="M80 60H560M80 150H560M80 240H560"/>
<path class="la draw" pathLength="1" d="M80 60L100 56.6L120 53.3L140 50.1L160 47L180 44.2L200 41.6L220 39.4L240 37.5L260 36L280 34.9L300 34.2L320 34L340 34.2L360 34.9L380 36L400 37.5L420 39.4L440 41.6L460 44.2L480 47L500 50.1L520 53.3L540 56.6L560 60"/>
<path class="li dsh" d="M80 60L100 63.4L120 66.7L140 69.9L160 73L180 75.8L200 78.4L220 80.6L240 82.5L260 84L280 85.1L300 85.8L320 86L340 85.8L360 85.1L380 84L400 82.5L420 80.6L440 78.4L460 75.8L480 73L500 69.9L520 66.7L540 63.4L560 60"/>
<path class="la draw" pathLength="1" d="M80 150L100 143.3L120 137L140 131.6L160 127.5L180 124.9L200 124L220 124.9L240 127.5L260 131.6L280 137L300 143.3L320 150L340 156.7L360 163L380 168.4L400 172.5L420 175.1L440 176L460 175.1L480 172.5L500 168.4L520 163L540 156.7L560 150"/>
<path class="li dsh" d="M80 150L100 156.7L120 163L140 168.4L160 172.5L180 175.1L200 176L220 175.1L240 172.5L260 168.4L280 163L300 156.7L320 150L340 143.3L360 137L380 131.6L400 127.5L420 124.9L440 124L460 124.9L480 127.5L500 131.6L520 137L540 143.3L560 150"/>
<path class="la draw" pathLength="1" d="M80 240L100 230.1L120 221.6L140 216L160 214L180 216L200 221.6L220 230.1L240 240L260 249.9L280 258.4L300 264L320 266L340 264L360 258.4L380 249.9L400 240L420 230.1L440 221.6L460 216L480 214L500 216L520 221.6L540 230.1L560 240"/>
<path class="li dsh" d="M80 240L100 249.9L120 258.4L140 264L160 266L180 264L200 258.4L220 249.9L240 240L260 230.1L280 221.6L300 216L320 214L340 216L360 221.6L380 230.1L400 240L420 249.9L440 258.4L460 264L480 266L500 264L520 258.4L540 249.9L560 240"/>
<rect class="bx" x="64" y="30" width="16" height="250"/>
<rect class="bx" x="560" y="30" width="16" height="250"/>
<circle class="fa" cx="320" cy="150" r="4"/>
<circle class="fa" cx="240" cy="240" r="4"/>
<circle class="fa" cx="400" cy="240" r="4"/>
<text class="txb" x="584" y="65">n = 1</text>
<text class="txb" x="584" y="155">n = 2</text>
<text class="txb" x="584" y="245">n = 3</text>
<text class="tx txs" x="250" y="20">length L between fixed ends</text>
```

The same standing-wave rule covers a belt, a rope and a bar. Only the wave speed changes. That is why one chapter's method transfers to the next.

## When a part is a spring and when it is a wave

Many machine parts are analysed with a simpler model: a spring carrying a mass. The fan shaft twisting under the impeller's inertia, or the fan unit bouncing on its isolators, are treated that way in later chapters. The wave picture tells you when that simplification is safe.

Compare the part's length with the wavelength at the highest frequency you care about. A twisting wave in the steel fan shaft travels at 3,178 m/s. At 124 Hz, the highest blade-pass frequency in the case, its wavelength is 3,178 ÷ 124, about 25.6 m. The shaft is 0.5 m long between its pulley and impeller. Every point on it twists in step, so a single spring constant describes it well.

A belt span is the opposite. Its sideways wave travels at only about 61 m/s, so at 51 Hz its wavelength is about 1.2 m, twice the 0.6 m span. Exactly half a wave fits: the span is at its first natural frequency. The belt must be treated as a wave carrier.

As a working rule in this book, a part whose length is less than about a tenth of the wavelength at the highest frequency of interest can be modelled as a lumped spring. Longer parts need the standing-wave treatment, or at least a check that the lumped model has not hidden a mode.

## The running case: RF-3 and its excitations

This is an illustration. RF-3 is a belt-driven rooftop exhaust fan on a variable speed drive (VSD). Its key data are:

- **Motor:** 4-pole, 1,450 rpm at 50 Hz supply, which is 24.17 revolutions per second.
- **Pulleys:** 160 mm on the motor and 250 mm on the fan, pitch diameters, with a 600 mm centre distance.
- **Fan speed:** 1,450 × 160 ÷ 250 = 928 rpm, or 15.47 revolutions per second at full speed.
- **Impeller:** eight blades.
- **Belts:** two wedge belts, assumed to weigh 0.12 kg per metre each. This is a teaching value; real values come from the belt maker's data.
- **Drive range:** 30 Hz to 50 Hz supply. The case treats speed as proportional to supply frequency, so the minimum fan speed is 60 per cent of full speed, 9.28 revolutions per second.

Anything that repeats once per revolution, such as residual unbalance or a bent shaft, pushes at the shaft speed. Misalignment and looseness add twice and three times that. The impeller blades pass any fixed point eight times per revolution, producing pressure pulses at the **blade-pass frequency**. The belt passes over its pulleys once per belt length, so a belt joint or flaw repeats at the **belt-pass frequency**.

The belt pitch length for open pulleys is 2C + π(D + d) ÷ 2 + (D − d)² ÷ (4C), which here is 1,200 + 644.0 + 3.4, about 1,847 mm. The belt speed is π × 0.160 × 1,450 ÷ 60, about 12.15 m/s, so the belt-pass frequency is 12.15 ÷ 1.847, about 6.58 Hz at full speed.

```figure
type: compare
title: RF-3 excitation frequencies across the drive range
rowhead: Source
cols: At 30 Hz supply | At 50 Hz supply | Notes
caption: This is an illustration. Speed is taken as proportional to supply frequency. Every natural frequency in the book is tested against these bands, not against single values.
- Belt pass | 3.95 Hz | 6.58 Hz | once per belt revolution
- Fan shaft, 1× | 9.28 Hz | 15.47 Hz | unbalance, bent shaft
- Motor shaft, 1× | 14.50 Hz | 24.17 Hz | motor unbalance
- Fan shaft, 2× and 3× | 18.6 and 27.8 Hz | 30.9 and 46.4 Hz | misalignment, looseness
- Motor shaft, 2× | 29.0 Hz | 48.3 Hz | misalignment
- * Blade pass, 8× fan | 74.2 Hz | 123.7 Hz | aerodynamic pulses
```

A VSD changes the problem. A fixed-speed fan has a short list of single frequencies. A variable-speed fan sweeps each excitation across a band, and any natural frequency inside a band will be met at some speed. The fan's 1× band alone runs from 9.28 Hz to 15.47 Hz.

## Margin: how close is too close

A part excited exactly at its natural frequency responds with a motion limited only by damping, which in welded steel and bolted sheet metal is often small. A little away from resonance the response falls quickly. Engineers therefore keep natural frequencies a margin away from excitation frequencies.

There is no single correct margin. Fan specifications, the equipment maker or a client standard may set one. This book uses **15 per cent** as its own working margin for the RF-3 case: a natural frequency is treated as clear if it lies at least 15 per cent above or below every excitation it could meet. This is a teaching choice, not a value from a standard.

### Why 15 per cent is a reasonable working figure

The reason for a margin shows up in the response of the simplest vibrating system, a single mass on a spring, driven by a steady force. Its dynamic magnification is the ratio of the vibration it shows to the deflection the same force would cause if applied slowly. With no damping, the magnification at frequency ratio r, the excitation frequency divided by the natural frequency, is **1 ÷ |1 − r²|**.

At r = 0.5 the magnification is 1.33: the part moves a third more than under the same static load. At r = 0.85 it is 3.6, and at r = 1.15 it is 3.1. At r = 0.9 it reaches 5.3. At r = 1 it is limited only by damping, and with a damping ratio of 0.02, typical of a lightly damped steel structure, it reaches 1 ÷ (2 × 0.02) = 25. At r = 2 it falls to 0.33: well above resonance, the part moves less than under a static load.

```figure
type: bars
title: Dynamic magnification of a lightly damped part
unit: ×
max: 26
caption: Single-mass model with a damping ratio of 0.02 at resonance and the undamped formula elsewhere. Inside the 15 per cent margin the response climbs steeply towards resonance.
- r = 0.5 | 1.33
- r = 0.85 | 3.6
- r = 0.9 | 5.26
- * r = 1.0 | 25
- r = 1.1 | 4.76
- r = 1.15 | 3.1
- r = 2.0 | 0.33
```

A 15 per cent margin keeps the magnification at roughly three or below, provided the part is a simple one. It does not make the part safe on its own: a large force times three can still be too much, and a part with several modes close together can have one inside the margin while another is checked. The margin is a screening rule that tells you where to look harder.

Applied to a band, the rule means a natural frequency must sit outside the band widened by 15 per cent at each end. The fan 1× band of 9.28 to 15.47 Hz widens to about 7.9 to 17.8 Hz. Any part with a natural frequency in that range needs attention.

## A failure case: checking only at full speed

This is an illustration. An early design review of RF-3 compared each natural frequency with the excitations at 50 Hz supply only. It recorded a twisting mode of the fan shaft and impeller at 114.2 Hz, which Chapter 6 calculates, against the blade-pass frequency of 123.7 Hz, and wrote "8 per cent apart, acceptable".

That conclusion is wrong twice. First, 8 per cent is inside the case's 15 per cent margin even at full speed. Second, the blade-pass band runs from 74.2 Hz to 123.7 Hz across the drive range, so 114.2 Hz lies inside it. Blade pass equals 114.2 Hz when the fan turns at 114.2 ÷ 8 = 14.28 revolutions per second, which is a supply frequency of about 46.2 Hz. The fan will sit at that resonance whenever the drive settles near that speed.

The error was detected when a later reviewer rebuilt the excitation table as bands rather than single values. The correction is not yet a design change. It is a rule: every natural frequency is tested against the full band of each excitation, and the review records the speed at which any crossing occurs. Chapter 6 then decides whether to stiffen the shaft or set the drive to skip that speed band.

## The method this book follows

Each chapter applies the same sequence to one family of parts. It mirrors how a resonance problem is found and fixed on real plant.

```figure
type: steps
title: The resonance check used in every chapter
caption: The output of each chapter is one or more rows in the RF-3 resonance register built in Chapter 10.
- Describe the part | length, end conditions, mass per metre, stiffness or tension
- Find the wave speed | from tension and mass, or modulus and density
- Fit the standing waves | first natural frequency and the next one or two modes
- * Compare with the excitation bands | 15 per cent working margin, whole drive range
- Choose a change | tension, length, stiffness, mass, damping or a skipped speed band
- Confirm on the machine | tap test, frequency meter or spectrum
```

The last step matters most. Formulas assume uniform parts and ideal ends. A belt span is not quite fixed where it meets a pulley, a panel is neither simply supported nor clamped at its bolted flanges, and a guy rope sags. The calculation tells you where to look and which change is likely to help. The measurement tells you whether it did.

## Exercise: excitations at 40 Hz supply

The drive is set to 40 Hz supply. Using the case's proportional-speed assumption, find the fan speed, the motor speed, the blade-pass frequency and the belt-pass frequency. Then find the first natural frequency of a 0.6 m span fixed at both ends with a wave speed of 61.2 m/s, and say whether it is within 15 per cent of any of the four excitations or of the 2× and 3× fan harmonics.

**Answer.** Speed scales by 40 ÷ 50 = 0.8. The fan turns at 0.8 × 15.47 = 12.37 revolutions per second and the motor at 0.8 × 24.17 = 19.33. Blade pass is 8 × 12.37 = 99.0 Hz and belt pass is 0.8 × 6.58 = 5.26 Hz.

The span's first natural frequency is 61.2 ÷ (2 × 0.6) = 51.0 Hz. The fan harmonics are 24.7 Hz at 2× and 37.1 Hz at 3×, and the motor 2× harmonic is 38.7 Hz. The nearest excitation is the motor 2× harmonic, and 51.0 ÷ 38.7 is about 1.32, so the span is 32 per cent above it and clear of the 15 per cent margin at this speed. Chapter 2 finds the real span length and tension, and Chapter 3 shows why the running frequencies differ from this static figure.
