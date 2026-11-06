---
book: whirling-shafts-by-the-numbers
chapterSlug: what-whirling-is
order: 1
title: "What whirling is"
description: "Why a spinning shaft bows into a rotating curve near one particular speed: the critical speed, the single-disc rotor, amplification of unbalance and why rotors settle above it."
draft: false
---

A shaft carrying a rotor is a spring. Push the middle of it sideways and it springs back, and if it is let go it vibrates at its own natural frequency. When the shaft spins, the rotor's small unbalance pushes it sideways once every revolution. If the shaft spins at a speed equal to its natural frequency of sideways vibration, each push arrives just in time to add to the last, and the shaft bows out into a curve that whirls round with it. That speed is the shaft's critical, or whirling, speed.

This chapter explains what happens to a rotor below, at and above its critical speed, using the simplest possible model: one disc on a light shaft between two bearings. It introduces the running case and the first BIZOMAT tool, and it describes the prototype test that made the case's maker take critical speeds seriously.

## The running case

This is an illustration. An agricultural equipment maker in Wagga Wagga, New South Wales, designs and builds the HM-30, a hammer mill for grinding grain for stock feed. A 30 kW two-pole motor drives the rotor directly through a flexible coupling at 2,950 rpm on the 50 Hz supply.

- **Rotor:** a pack of seven steel discs, 520 mm in diameter, on the shaft between two pillow-block bearings 1,000 mm apart. Four hammer pins pass through the discs at a radius of 230 mm, each carrying twelve swinging hammers of 0.75 kg. The tips of the hammers sweep a circle of 560 mm.
- **Mass:** the disc pack, hammers, pins and spacers weigh 180 kg, spread over the middle 400 mm of the span.
- **Shaft:** 80 mm in diameter on the prototype, 90 mm in production.
- **Variants:** a 60 Hz export version running at 3,550 rpm, and a truck-mounted version.

The book follows the HM-30 from its prototype test to its service vibration checks. Every chapter takes up one part of the same question: what makes a spinning rotor move, and how is that movement kept small?

## One disc on a light shaft

The simplest rotor is a single disc of mass m at the middle of a light, flexible shaft between two rigid bearings. It is often called a Jeffcott rotor, after H. H. Jeffcott, who analysed it in 1919. The disc's centre of mass is not quite on the shaft's axis: it is offset by a small distance e, the eccentricity, because no disc is perfectly made or perfectly mounted.

When the shaft spins at angular speed Ω, the eccentric mass pulls outwards with a centrifugal force. The shaft bends under that pull, which moves the disc further out, which increases the pull. The shaft's stiffness k resists. The shaft settles into a bent shape that rotates with it, its middle travelling round a small circle of radius r. For a shaft with no damping, the radius is:

```figure
type: formula
title: Whirl radius of a single-disc rotor
formula: r = e × (Ω ÷ ω_n)² ÷ (1 − (Ω ÷ ω_n)²)
formula: Natural frequency: ω_n = √(k ÷ m), and critical speed n_c = 60 × ω_n ÷ 2π rpm
formula: Shaft stiffness at mid-span, simple supports: k = 48 × E × I ÷ L³
caption: Below the critical speed the whirl radius is positive: the disc's heavy side faces outwards. Above it the sign changes: the heavy side faces inwards and the whirl radius tends back towards e. At exactly the critical speed, an undamped shaft has no limit.
- e | eccentricity of the disc's centre of mass from the shaft axis, mm
- Ω | running speed, rad/s
- ω_n | natural frequency of sideways vibration of the shaft and disc, rad/s
- k | stiffness of the shaft against a sideways force at the disc, N/m
```

Two things in the formula matter for every chapter that follows. The whirl radius depends on the ratio of running speed to critical speed, not on either alone. And it is proportional to e: a better-balanced rotor whirls less at every speed. Chapter 5 turns e into the balance grades that rotors are built to.

### Below, at and above the critical speed

This is an illustration. Taking e = 20.4 µm, which Chapter 5 shows is the eccentricity of a rotor balanced to a common grade at HM-30's speed, the undamped whirl radius at different speed ratios is:

```figure
type: compare
title: Undamped whirl radius of a single-disc rotor with e = 20.4 µm
cols: Whirl radius ÷ eccentricity | Whirl radius, µm | Heavy side
rowhead: Running speed ÷ critical speed
- 0.25 | 0.07 | 1.4 | outwards
- 0.50 | 0.33 | 6.8 | outwards
- 0.75 | 1.29 | 26.2 | outwards
- 0.90 | 4.26 | 86.9 | outwards
- * 0.95 | 9.26 | 188.8 | outwards
- 1.05 | 10.8 | 219.4 | inwards
- 1.25 | 2.78 | 56.6 | inwards
- 2.00 | 1.33 | 27.2 | inwards
- 3.00 | 1.13 | 22.9 | inwards
caption: This is an illustration. From the undamped formula. Real rotors have some damping, from bearings, seals, the air and the structure, which keeps the peak finite: with a damping ratio of 5% the peak whirl radius is about ten times e.
```

At a quarter of the critical speed the shaft barely bends: the whirl is 7% of the eccentricity. At three-quarters it already exceeds the eccentricity. Within 5% of the critical speed it is nine or ten times the eccentricity, and every millimetre of whirl is a millimetre of shaft bending, a rotating force on the bearings and a vibration of the whole machine.

Above the critical speed something surprising happens. The heavy side of the disc swings round to face inwards, and the shaft bends less as the speed rises. Far above the critical speed the disc spins about its own centre of mass, which stays almost on the bearing axis, and the shaft's centre traces a small circle of radius e about it. The rotor is said to self-centre.

```figure
type: line
title: Whirl radius against speed ratio, single-disc rotor, e = 20.4 µm
x: Running speed ÷ critical speed
y: Whirl radius, µm
ymin: 0
ymax: 240
mark: 1 | critical speed
caption: This is an illustration. Undamped values, which have no limit at a speed ratio of 1; the plotted points stop at 0.95 and resume at 1.05. Real damping turns the spike into a finite but sharp peak.
- 0.25 | 1.4
- 0.5 | 6.8
- 0.75 | 26.2
- 0.9 | 86.9
- 0.95 | 188.8
- 1.05 | 219.4
- 1.1 | 117.5
- 1.25 | 56.6
- 1.5 | 36.7
- 2 | 27.2
- 3 | 22.9
```

### What the bearings feel

The force that the whirling shaft passes to its bearings is the shaft's stiffness times the whirl radius, which is the same as the centrifugal force of the disc travelling round a circle of radius r + e. Compared with the force the same unbalance would produce on a perfectly rigid shaft, the bearing force is larger by the factor 1 + r ÷ e.

This is an illustration. At 90% of the critical speed, r ÷ e = 4.26 from the table, so the bearings carry 5.26 times the force the unbalance alone would produce. For a 180 kg rotor with e = 20.4 µm at 2,950 rpm, the rigid-shaft unbalance force is 180 × 0.0000204 × 308.9² = 350 N; at 90% of critical it would be about 1,840 N, more than the rotor's own weight of 1,765 N, rotating once a revolution. That is why a machine near its critical speed shakes its frame, loosens its bolts and wears out its bearings, even when its rotor is well balanced.

### A rotating bend, not a flapping one

There is a subtle point about the stress in a whirling shaft. In the synchronous whirl described here, the shaft is bent into a fixed shape that rotates with it, like a bent wire spun about its ends. A fibre on the outside of the bend stays on the outside all the way round. Its stress is steady, not reversing. The shaft's sag under the rotor's weight is different: it stays pointing downwards while the shaft turns through it, so every fibre passes from tension to compression and back once each revolution. Gravity bending is therefore the fatigue load on a rotating shaft (Chapter 3), and synchronous whirl is mainly a problem of deflection, bearing forces and vibration of the machine. Large whirl can still break a shaft by rubbing, by overloading the bearings or by driving the frame into resonance, so the conclusion is the same: keep away from the critical speed.

### Higher critical speeds

A shaft has more than one critical speed. The first, the subject of this book, bends the shaft into a single bow between its bearings. The second bends it into an S, with a node near the middle; for a uniform shaft with no discs on simple supports it is four times the first, because the frequency of each mode rises with the square of the number of half-waves. A heavy rotor at mid-span barely takes part in the second mode, whose node sits under it, so for most industrial rotors the second critical speed is far above anything the machine will reach. Long, slender rotors such as paper machine rolls and some turbine rotors are the exceptions.

### Running above the critical speed

For much of the nineteenth century engineers believed a shaft could not run above its first critical speed. In the 1880s and 1890s Gustaf de Laval's small, fast steam turbines ran with very slender shafts well above it, and showed that a rotor can pass through its critical speed and run smoothly beyond, provided it passes through quickly and has enough damping to limit the peak. Many modern machines run above their first critical speed: centrifuges, high-speed turbines and some compressors. They are designed for it, with balanced rotors, damping and controlled run-up.

The HM-30 is not such a machine. Its maker wants the rotor to stay well below its critical speed at all times, so that the whirl is small and the machine never has to pass through a resonance. That is the usual choice for industrial machines of this kind, and it is the one this book follows.

## The first estimate

The BIZOMAT [Shaft critical (whirling) speed](/tools/critical-speed/) tool calculates the first critical speed of a uniform solid shaft with simple, fixed–free or fixed–fixed supports, optionally with a single disc. It works out the critical speed of the shaft alone from its own mass and stiffness, the critical speed of the disc on the massless shaft, and combines them by Dunkerley's method (Chapter 2). It compares the result with the operating speed and your required separation margin, and reports whether the shaft runs below, near or above its critical speed. It assumes rigid bearings and ignores gyroscopic effects.

This is an illustration. The maker's first estimate treated the whole 180 kg rotor as one disc at mid-span, on a simply supported steel shaft 1,000 mm between bearings.

```figure
type: compare
title: HM-30 rotor as one 180 kg disc at mid-span, simple supports
cols: Shaft alone, rpm | Disc on a massless shaft, rpm | Combined critical speed, rpm | Running at 2,950 rpm as a share of critical
rowhead: Shaft diameter
- 80 mm, prototype | 9,514 | 3,127 | 2,971 | 99.3%
- * 90 mm, production | 10,704 | 3,958 | 3,712 | 79.5%
caption: This is an illustration. E = 200 GPa, density 7,850 kg/m³. The single-disc model puts all of the rotor's mass at mid-span, where it bends the shaft most, so it gives a low and cautious estimate; Chapter 2 spreads the mass out.
```

With a required margin of 25%, a running speed of 79.5% of critical counts as "near critical" in the tool's terms, because it is not at least 25% below. The single-disc model is pessimistic, as Chapter 2 shows, but it gave the first warning about the prototype.

## The error: a prototype that shook

This is an illustration. The prototype HM-30 was built with an 80 mm shaft, sized for strength and twist, which needed far less (Chapter 3). Nobody had calculated its critical speed. On its first run, the mill ran smoothly up to about 2,500 rpm, then its vibration rose steeply, and at full speed the pillow blocks were shaking visibly and the base frame was ringing. The test engineer shut it down within a minute.

A handheld vibration meter on the bearing housings showed almost all of the vibration at exactly the running speed, the signature of unbalance amplified by a nearby resonance. A quick estimate with the single-disc model put the critical speed at 2,971 rpm, within 1% of the running speed. The more realistic model of Chapter 2 put it at 3,275 rpm, still only 10% above. Either way, the prototype was running on the shoulder of its critical speed, where every gram of unbalance was multiplied several times over.

```figure
type: steps
title: What the test engineer did next
caption: This is an illustration. The prototype was not run at full speed again until the shaft had been redesigned.
- Stopped the machine and locked it out | shaking pillow blocks can loosen their bolts
- Measured the vibration's frequency, not just its level | almost all of it at 1× running speed
- Estimated the critical speed | 2,971 rpm with one central disc; 3,275 rpm with the mass spread out
- * Concluded the machine was running near its critical speed | balancing alone would not fix it
- Redesigned for a critical speed at least 25% above running | 90 mm shaft (Chapters 2 and 3)
```

The lesson the maker wrote down was that the critical speed is a design quantity, to be calculated with the first layout, not discovered on the test bed. A shaft that is strong enough can still be far too flexible.

## Finding a critical speed by test

A calculated critical speed is an estimate, and on an existing machine it can be checked. Two tests are common. In a bump test, the stopped rotor is struck sideways with a soft-faced hammer while an accelerometer on the bearing housing records the ringing; the frequency of the ringing is the natural frequency of the shaft, rotor and supports together. In a coast-down test, the machine is switched off at full speed and the vibration at running speed is recorded as it slows; the amplitude rises and the phase swings as the speed passes any critical speed below the running speed. A bump test on a stopped rotor misses the stiffening and softening effects of rotation, such as oil films and gyroscopic moments, but for a machine with rolling bearings and a compact rotor, like the HM-30, it is usually close. Chapter 4 uses one.

## What raises a critical speed

Because the critical speed is the natural frequency of the shaft and rotor, everything that stiffens the shaft or lightens the rotor raises it, and everything that softens or loads it lowers it:

- **Shaft diameter**, to the power of four in the stiffness and two in the shaft's own mass: a larger shaft is much stiffer for a little more weight.
- **Bearing span**, to the power of three in the stiffness: shortening the span is the most powerful change of all.
- **Rotor mass and its position**: mass near mid-span lowers the critical speed most; mass near the bearings hardly at all.
- **Support stiffness**: flexible bearings, pedestals or frames act as springs in series with the shaft (Chapter 4).
- **Overhangs**: a pulley or impeller outside the bearings can have a low critical speed of its own.

## Exercise: a shorter span

This is an illustration. Instead of a larger shaft, the maker considered keeping the 80 mm shaft and shortening the bearing span from 1,000 mm to 900 mm by moving the pillow blocks inwards, with the 180 kg rotor still treated as one disc at mid-span.

1. By what factor does the shaft's mid-span stiffness change?
2. By what factor does the disc's critical speed on a massless shaft change, and what is it?
3. Is this enough on its own?

**Worked answer.**

1. Stiffness varies as 1 ÷ L³: (1,000 ÷ 900)³ = **1.37**.
2. The critical speed varies as the square root of stiffness: √1.37 = **1.17**, so 3,127 × 1.17 = about **3,660 rpm** for the disc on a massless shaft. Combined with the shaft's own mass the result would be a little lower.
3. **No.** Even ignoring the shaft's own mass, 2,950 ÷ 3,660 = 81% of critical, short of the 25% margin. Shortening the span also has a practical limit, because the disc pack is 400 mm long and the bearings must clear it. The maker kept the 1,000 mm span and increased the shaft to 90 mm.
