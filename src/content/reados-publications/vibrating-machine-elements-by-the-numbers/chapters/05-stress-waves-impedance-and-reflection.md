---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: stress-waves-impedance-and-reflection
order: 5
title: "Stress waves in bars: speed, impedance and reflection"
description: "Estimate impact stress from wave speed and impedance, follow a stress wave through a shaft shoulder and a free end, and see why bearings must never be hammered on."
draft: false
---

Strike the end of a steel bar and the far end does not move at once. A pulse of compression runs along the bar at about five kilometres a second, reflects from the far end and comes back. For most machine design that journey is too fast to matter, and the bar can be treated as a single stiff piece. During an impact it is the whole story: the stress in the bar is set by how fast the struck end is pushed, not by the force of the blow.

This chapter uses longitudinal waves in bars for three jobs on RF-3. It confirms that the fan shaft's own natural frequencies along and around its axis are far above anything the fan produces. It estimates the stress from a hammer blow during bearing fitting, and it follows a stress pulse through a shaft shoulder and a free end, which explains a type of damage that otherwise looks mysterious. The same ideas, impedance and reflection, return in Chapter 8 where a soft layer stops vibration leaking through a spring.

## Wave speed along a bar

When a bar is squeezed at one end, the squeezed material pushes on its neighbour, which pushes on the next, and a compression pulse runs along the bar. For a slender bar whose diameter is small compared with the wavelength, the pulse travels at:

**c = √(E ÷ ρ)**

where E is the elastic modulus and ρ the density. Shear modulus G takes the place of E for twisting waves, covered in Chapter 6.

```figure
type: compare
title: Longitudinal wave speed and impedance of common materials
rowhead: Material
cols: E, teaching value | Density | Wave speed | Impedance per unit area
caption: Teaching values; real grades vary. Impedance ρc is the stress produced per metre per second of particle velocity. Steel and aluminium have nearly the same wave speed but very different impedance.
- * Steel | 200 GPa | 7,850 kg/m³ | 5,048 m/s | 39.6 MPa per m/s
- Aluminium alloy | 69 GPa | 2,700 kg/m³ | 5,055 m/s | 13.6 MPa per m/s
- Copper | 117 GPa | 8,960 kg/m³ | 3,614 m/s | 32.4 MPa per m/s
- Brass | 100 GPa | 8,500 kg/m³ | 3,430 m/s | 29.2 MPa per m/s
- Nylon | 3 GPa | 1,140 kg/m³ | 1,622 m/s | 1.85 MPa per m/s
- Soft rubber | 5 MPa | 1,100 kg/m³ | 67 m/s | 0.074 MPa per m/s
```

Steel and aluminium carry waves at almost the same speed, because aluminium's lower stiffness is matched by its lower density. They differ in impedance, which turns out to matter more during impact.

## The fan shaft is far too short to ring at fan frequencies

This is an illustration. RF-3's fan shaft is 40 mm in diameter and 0.7 m long overall. Treated as a free bar, its first longitudinal mode has half a wavelength along its length:

**f = c ÷ (2L) = 5,048 ÷ 1.4 ≈ 3,600 Hz**

Its first free twisting mode, using the twisting wave speed of 3,178 m/s from Chapter 1, is about 3,178 ÷ 1.4, or 2,270 Hz.

Both are more than eighteen times the highest blade-pass frequency of 123.7 Hz. Waves along and around the shaft play no part in RF-3's running vibration, and the shaft can be treated as a lumped spring in Chapter 6. The modes that do matter for a fan shaft are bending modes, which set its critical speed. Those depend on bearing positions and overhung masses rather than on a simple wave speed, and the [shaft design check tool](/tools/shaft-design-check/) covers them.

A loose shaft tapped on the bench rings at these kilohertz frequencies, which is why a cracked shaft sounds different from a sound one. The crack interrupts the wave path and changes the modes.

## Stress from velocity, not from force

When a bar end is suddenly pushed at velocity v, the material just behind the pulse moves at v and the material ahead of it is still at rest. The stress carried by the pulse is:

**σ = ρ c v**

The product ρc is the material's impedance per unit area. For steel it is 7,850 × 5,048, about 39.6 × 10⁶ kg/(m²·s), so **each metre per second of particle velocity carries about 39.6 MPa** of stress.

That number is worth remembering. A steel bar end driven at 1 m/s carries a 39.6 MPa pulse. At 2 m/s, 79 MPa. These are elastic stresses arriving in microseconds. They do not depend on how heavy the hammer is, only on how fast the struck face is made to move. The hammer's mass and the bar lengths decide how long the pulse lasts.

### Two bars colliding

When a moving bar strikes a stationary one end to end, the contact face moves at a velocity between the two. For bars of impedance Z1 and Z2, where impedance here means ρcA including the cross-section area, the contact force is:

**F = Z1 Z2 v ÷ (Z1 + Z2)**

For two identical bars, this halves: the contact face moves at v ÷ 2 and the stress in each is ρ c v ÷ 2. A bar striking a rigid wall sees the full ρ c v.

This is an illustration. A 30 mm steel drift, swung at 3 m/s, strikes the end of a 30 mm steel bar. The stress pulse in each is 39.6 × 3 ÷ 2 ≈ **59.4 MPa**, and the force is 59.4 × π × 15², about **42 kN**. For a 0.3 m drift, the pulse lasts about the time for a wave to cross the drift and return, 2 × 0.3 ÷ 5,048, or about 120 microseconds.

## The case: fitting the fan bearings

RF-3's fan shaft runs in two plain-bore ball bearings with an interference fit on the shaft. The fan pulley pulls sideways on the shaft with the belt tensions, roughly 2 × 900 N for two belts at the static setting from Chapter 2, so the bearings carry radial loads of the order of a kilonewton or two in service.

A blow struck through the wrong path can put tens of kilonewtons through the bearing's rolling elements for a fraction of a millisecond. If a drift is placed on the outer ring to drive a bearing whose inner ring is the interference fit, the whole fitting force passes from outer ring to balls to inner ring. The few balls in line with the blow carry most of it. Each impact can press small permanent dents into the raceways at the ball spacing. This damage is called true brinelling.

## A failure case: dents at the ball spacing

This is an illustration. A replacement fan bearing on RF-3 is fitted using a steel drift and hammer on its outer ring. Three months later the bearing is noisy and its vibration readings show a rising high-frequency level. The bearing is removed.

The inner raceway carries a row of shallow, evenly spaced dents. Their spacing matches the ball spacing. That pattern points to force passed through stationary balls, such as impact during fitting or heavy shock while the shaft was still, rather than to running wear, which spreads around the whole track.

The wave estimate shows why. A 3 m/s blow through a steel drift produces a force pulse of the order of 40 kN, perhaps twenty times the bearing's service radial load, delivered through a handful of balls. The correction was a change of method. Bearings are now fitted by pressing or by heating with an induction heater, with any force applied only to the ring being fitted. The bearing maker's fitting instructions govern the details, including the maximum heating temperature.

## Reflection at a change of section

A stress pulse travelling along a bar meets changes: a shoulder, a hole, a joint, the end of the bar. At each change part of the pulse passes on and part reflects. The split depends on the impedances on each side.

For a force pulse moving from section 1 into section 2, with impedances Z1 and Z2 including area:

- **reflected force = R × incident force**, where R = (Z2 − Z1) ÷ (Z2 + Z1);
- **transmitted force = T × incident force**, where T = 2 Z2 ÷ (Z1 + Z2).

For the same material, impedance is proportional to area. This is an illustration. A compression pulse in RF-3's 40 mm shaft reaches a step down to 30 mm. The area ratio is (30 ÷ 40)² = 0.5625. So:

- R = (0.5625 − 1) ÷ (0.5625 + 1) = **−0.28**: a reflected pulse of 28 per cent of the incident force, of opposite sign, so a compression pulse reflects as tension.
- T = 2 × 0.5625 ÷ 1.5625 = **0.72**: 72 per cent of the force passes on.

Because that 72 per cent of the force acts on only 56 per cent of the area, the stress in the smaller section is 0.72 ÷ 0.5625 = **1.28** times the incident stress. A pulse entering a thinner section is concentrated, not weakened.

```figure
type: svg
title: A compression pulse meeting a step from 40 mm to 30 mm
alt: A stepped shaft drawn from the side, 40 mm on the left and 30 mm on the right. Below it, a stress plot shows an incident compression pulse travelling right in the larger section, a smaller tension pulse reflected back to the left, and a taller compression pulse transmitted into the smaller section.
caption: Same material on both sides, so impedance follows area. The reflected pulse is 28 per cent of the incident force and changes sign; the transmitted stress is 1.28 times the incident stress.
viewbox: 0 0 640 330
body:
<rect class="bx" x="40" y="40" width="300" height="80"/>
<rect class="bx" x="340" y="50" width="260" height="60"/>
<path class="cl" d="M30 80H610"/>
<text class="txb" x="150" y="30">40 mm, Z1</text>
<text class="txb" x="430" y="30">30 mm, Z2 = 0.5625 Z1</text>
<path class="ln" d="M40 240H600"/>
<path class="lf dsh" d="M340 140V310"/>
<rect class="bxa" x="90" y="190" width="80" height="50"/>
<path class="la" d="M180 175H230"/>
<path class="ah" d="M240 175L228 169V181Z"/>
<rect class="bxi" x="200" y="240" width="80" height="14"/>
<path class="li" d="M270 275H220"/>
<path class="fi" d="M210 275L222 269V281Z"/>
<rect class="bxa" x="420" y="176" width="80" height="64"/>
<path class="la" d="M510 165H560"/>
<path class="ah" d="M570 165L558 159V171Z"/>
<text class="tx txs" x="80" y="182">incident, 1.0</text>
<text class="tx txs" x="190" y="300">reflected, −0.28 force</text>
<text class="tx txs" x="410" y="160">transmitted, 1.28 stress</text>
<text class="tx txs" x="515" y="222">compression up</text>
<text class="tx txs" x="515" y="262">tension down</text>
```

## Free ends and fixed ends

Two limiting cases follow from the same formula and explain most impact damage:

```figure
type: compare
title: What happens to a compression pulse at the end of a bar
rowhead: End condition
cols: Impedance beyond | Reflection | Consequence
caption: The reflection coefficient R = (Z2 − Z1) ÷ (Z2 + Z1) applied to force. A soft layer behaves almost like a free end.
- * Free end | zero | R = −1: returns as equal tension | far end can be pulled apart in tension
- Rigid support | very large | R = +1: returns as compression | stress at the face doubles
- Same bar continues | equal | R = 0: passes straight on | no reflection
- Steel into soft rubber | about 0.2 per cent of steel | R ≈ −0.996 | almost all reflected; little force transmitted
```

The free end is the surprising one. A compression pulse reaching a free end reflects as a tension pulse of the same size. A material that is weak in tension, such as cast iron, hardened steel or a brittle coating, can crack or flake at the far side from a blow, or at a point where the outgoing tension pulse meets the next incoming compression. Bearing rings are hardened steel. This is a second reason not to hammer near them.

The soft layer explains a vibration-control trick. Steel's impedance per unit area is about 39.6 MPa per m/s; soft rubber's is about 0.074. A wave in steel reaching rubber is almost completely reflected, and only about 0.4 per cent of its force passes into the rubber. At the frequencies of machinery, a thin rubber pad is usually much thinner than the wavelength in it, so it acts more like a soft spring than a wave carrier. The result is similar: a soft layer in the path blocks high-frequency vibration. Chapter 8 uses this to stop surge in RF-3's isolator springs reaching the roof.

## Echoes as a measuring tool

Reflection is not only a source of damage. Because a pulse reflects from every change in impedance and travels at a known speed, the time it takes to come back tells you where the change is. That is the principle of ultrasonic flaw detection and of the simple end-to-end checks used on long bolts and shafts.

This is an illustration. A pulse sent into one end of RF-3's 0.7 m shaft returns from the far end after 2 × 0.7 ÷ 5,048, about **277 microseconds**. If a crack lies across the shaft 0.25 m from the test end, part of the pulse reflects from it and returns after 2 × 0.25 ÷ 5,048, about 99 microseconds. An echo arriving early, before the end echo, points to a reflector partway along.

Real ultrasonic testing uses much higher frequencies, typically in the megahertz range, so the wavelength is short enough to resolve small flaws, and it uses calibrated probes and reference blocks. Interpreting the echoes from shoulders, keyways and threads takes training. In practice the inspection is done by personnel qualified under a scheme such as ISO 9712 for non-destructive testing. The wave picture explains what they are measuring and why a stepped shaft produces echoes even when it is sound: every shoulder is a change of impedance.

The same timing idea is used to check bolt tension. A bolt stretches and its stress changes the wave speed slightly as it is tightened, so the round-trip time of an ultrasonic pulse along the bolt changes with load. Calibrated equipment converts that change into bolt tension. It is one of the few ways to measure the tension in a bolt that is already tightened.

## Soft-faced tools

The collision formula explains why soft-faced mallets and drifts reduce damage. Replacing one bar with a lower-impedance material reduces the contact force for the same striking speed, because the contact face cannot be driven as fast.

```figure
type: bars
title: Stress from a 30 mm drift striking a 30 mm steel bar at 3 m/s
unit: MPa
max: 65
caption: Ideal bar collision, same diameters, F = Z1 Z2 v ÷ (Z1 + Z2). Real tools have shaped faces and plastic contact, so treat these as comparisons, not predictions.
- * Steel drift | 59.4
- Brass drift | 50.4
- Aluminium drift | 30.5
- Nylon drift | 5.3
```

A soft drift also lasts longer in contact, so the same impulse is spread over more time with a lower peak. This does not make hammering a bearing acceptable. It explains why, where a light tap is the only practical option on a non-bearing part, a soft-faced tool is far kinder than steel on steel.

## Exercise: an aluminium drift on the fan shaft

A fitter uses a 30 mm aluminium drift, struck at 3 m/s, to tap a 30 mm shaft end. Using the impedances in this chapter, find the stress in the shaft. Then find the stress transmitted into a 22 mm section of the same shaft further along.

**Answer.** Per unit area, aluminium is 13.6 and steel 39.6 MPa per m/s. Since both bars have the same area, the shaft stress is 13.6 × 39.6 ÷ (13.6 + 39.6) × 3 ≈ 10.15 × 3 ≈ **30.5 MPa**, about half the steel-on-steel value of 59.4 MPa.

At the step from 30 mm to 22 mm, the area ratio is (22 ÷ 30)² ≈ 0.538. The transmitted force fraction is 2 × 0.538 ÷ 1.538 ≈ 0.70, acting on 0.538 of the area, so the stress rises by 0.70 ÷ 0.538 ≈ 1.30 to about **39.6 MPa**. A compression pulse of about 0.30 × 30.5 MPa ≈ 9 MPa reflects back as tension into the 30 mm section.
