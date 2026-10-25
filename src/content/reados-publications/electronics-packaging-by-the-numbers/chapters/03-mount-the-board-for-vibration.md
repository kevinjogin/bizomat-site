---
book: electronics-packaging-by-the-numbers
chapterSlug: mount-the-board-for-vibration
order: 3
title: "Mount the board for vibration"
description: "Estimate a circuit board's natural frequency, compare it with the excitation, place standoffs and sensors where they work, and couple a vibration monitor to the machine it measures."
draft: false
---

A circuit board on four screws is a thin plate on four points, and a thin plate has natural frequencies. When the machine it is bolted to vibrates near one of them, the board's motion is amplified. Solder joints, connector pins and heavy components then see far more cycles of strain than the designer expected. In most products this is a durability problem. In a vibration monitor it is also a measurement problem, because a sensor on a resonating board reports the board's motion, not the machine's.

This chapter estimates the gearbox monitor's board frequency by hand, compares it with the gearbox's excitation, uses a simulation to check the result, and then chooses standoff and sensor positions that serve both durability and measurement. It ends with the mounting of the whole enclosure to the gearbox, which matters as much as the mounting of the board inside it.

## The board as a plate

A bare circuit board is a composite laminate, usually glass-fibre-reinforced epoxy, carrying components whose mass is spread unevenly over its surface. A first estimate treats it as a uniform thin plate with the components' mass smeared over the area. That is crude, but it gives the right order of magnitude and shows which variables matter.

For a thin rectangular plate simply supported along all four edges, the classical solution for the lowest natural frequency is reproduced in NASA's public-domain survey *Vibration of Plates*. In the form used here it depends on the plate's bending stiffness and its mass per unit area.

```figure
type: formula
title: Lowest natural frequency of a simply supported rectangular plate
formula: f = (π ÷ 2) × √(D ÷ ρh) × (1 ÷ a² + 1 ÷ b²)        D = E h³ ÷ (12 (1 − ν²))
caption: This is an illustration. E = 20 GPa and ν = 0.13 are assumed laminate values, not data for a specific product; use the laminate supplier's figures. The 28 g mass includes components.
- a, b | board length and width, 0.080 m and 0.050 m
- h | board thickness, 0.0016 m
- E, ν | laminate modulus and Poisson's ratio, assumed 20 GPa and 0.13
- ρh | mass per unit area, 0.028 kg ÷ 0.004 m² = 7.0 kg/m²
step: D = 20 × 10⁹ × 0.0016³ ÷ (12 × (1 − 0.13²)) ≈ 6.94 N·m
step: f = 1.571 × √(6.94 ÷ 7.0) × (156.25 + 400) ≈ 870 Hz
```

The bare laminate would weigh only about **0.080 × 0.050 × 0.0016 × 1,900 ≈ 12.2 g** at an assumed density of 1,900 kg/m³. The components more than double the mass, which is why a populated board's frequency is so much lower than a bare one's.

## Why the hand result is an upper bound

The formula assumes the board is supported along all four edges. The gearbox monitor's board is held only at four corner screws. A plate supported at points is far more flexible than one supported along its edges, because the middle of each edge is free to move. The 870 Hz figure is therefore an upper bound, and the real fundamental frequency will be well below it.

Point-supported plates have no simple closed-form answer that covers every case, which is why a modal simulation is the normal next step. This is an illustration. A modal study of the board, with the components modelled as distributed and lumped masses and the screws as fixed points, gave a first mode at about **360 Hz**, roughly 40% of the edge-supported bound. A simulation should be checked against a hand bound and later against a test, as described in [Check stiffness, frequency and buckling](/reados/publications/design-simulation-by-the-numbers/check-stiffness-frequency-and-buckling/).

## Compare the board with the excitation

Chapter 1 found the gearbox's main excitation: the first gear stage meshes at about **469 Hz**, with a second harmonic near **937 Hz**, and the shaft rate is about 24.7 Hz.

The ratio of excitation frequency to natural frequency decides how much the board's motion is amplified. For a single-degree-of-freedom system excited at its base, the transmissibility is the ratio of the response amplitude to the input amplitude. It is close to 1 well below resonance, rises to a peak at resonance and falls below 1 well above it. With a light damping ratio of 0.025, which is an assumption here (a resonant magnification of 20), the transmissibility is:

- at resonance, about **20**;
- at the gear mesh frequency with a 360 Hz board, a ratio of **469 ÷ 360 ≈ 1.30**, about **1.43**;
- at the gear mesh frequency with a 980 Hz board, a ratio of **469 ÷ 980 ≈ 0.48**, about **1.30**;
- at the second harmonic with a 980 Hz board, a ratio of **937 ÷ 980 ≈ 0.96**, about **10**.

The last figure is the important one. A frequency target based only on the main excitation would have missed it.

A common design guideline is to keep a structure's fundamental frequency at least an octave, a factor of two, above the highest significant excitation. The gearbox's highest significant excitation is the second harmonic at 937 Hz, which would require a board fundamental near 1.9 kHz. That is hard to achieve with a board of this size. When stiffening cannot get far enough, the next step is to place the parts that matter where the resonance cannot reach them.

```figure
type: bars
title: Board fundamental frequency by support arrangement
unit: Hz
max: 1200
caption: This is an illustration. The edge-supported figure is the hand bound; the others are from the modal study. The gear mesh is at 469 Hz and its second harmonic at 937 Hz, both inside the 10 Hz to 1 kHz measurement band.
- Four corner screws | 360
- Edges simply supported, hand bound | 870
- *Four corners and a centre standoff | 980
```

## Put the sensor at a support

A resonating plate does not move everywhere. Its supports move with the base, and in the first mode the largest motion is near the middle of the unsupported span. A sensor placed directly over a support, clamped between the board and a rigid standoff, sees essentially the base motion even when the rest of the board is resonating.

The gearbox monitor's final arrangement uses this idea twice:

1. A fifth standoff is added at the centre of the board, screwed into a boss that rises from the base directly above the mounting stud. This raises the board's fundamental to about **980 Hz** and reduces its amplitude at the gear mesh frequency.
2. The accelerometer is placed on the board directly over that centre standoff, so that it is clamped through the shortest, stiffest path to the stud and the gearbox. The modal study showed the accelerometer location as a node of the first three modes.

The result is a board that is safer against fatigue and a sensor that measures the gearbox, not the board.

```figure
type: decision
title: Where should a vibration sensor sit inside a product?
question: Must the sensor measure the machine's vibration accurately across a frequency band?
caption: This is an illustration of the reasoning used for the gearbox monitor. A sensor that only needs to detect gross shocks has more freedom.
- *Yes | Rigid path to the mounting point | place it over a support or on a stiff sub-board fixed directly to the base above the stud, and check the path's first mode is above the band
- No | Anywhere the board is stiff enough to survive | still avoid the middle of a large unsupported span, where strain and motion are greatest
```

## Choose the standoffs

A standoff looks like the simplest part in the product, but it sets the board's support stiffness, its height in the zone map, its electrical connection to the base and the clamping load on the laminate. The gearbox monitor team compared two options.

**Cast bosses with screws.** The die-cast base can carry bosses that rise to the board, drilled and tapped or fitted with thread-forming screws. They are part of the casting, so they cost nothing to assemble and their stiffness is high. Their heights depend on the casting tolerance and on any machining of their tops, which the drawing must specify if the board's height matters for a light pipe or a connector.

**Separate threaded spacers.** Hexagonal metal or plastic spacers screwed into the base are easy to change between prototypes and come in many lengths. Each adds two threaded joints that can loosen, and plastic spacers creep under clamp load at high temperature.

The production design uses cast bosses with their tops machined flat in one set-up, so that all five support faces lie in one plane. A board clamped onto bosses that are not coplanar is bent before any vibration arrives, and the static strain adds to the dynamic strain at the solder joints. The drawing therefore specifies the flatness of the five boss faces together, not each boss on its own.

The screw clamp load matters too. A board is a laminate, and an overtightened screw crushes it locally and can crack nearby solder joints or vias. The assembly drawing gives a screw torque and calls for a flat washer under each screw head to spread the load. Where a boss also makes a ground connection, the board's mounting-hole pad is plated, and the washer and boss face are left unpainted.

## Secure the heavy and the tall

Plate resonance is not the only vibration problem. Individual components can also resonate on their own leads or solder joints, and parts that overhang the board act as small cantilevers.

The gearbox monitor's board has three such items:

- **The radio module.** It is soldered over its full footprint and weighs a few grams, so it moves with the board. Its position was chosen in Chapter 2 between ribs, near the centre standoff, where board motion is small.
- **The bulk capacitor** for the radio's transmit pulses. Tall cylindrical capacitors on thin leads are a known fatigue risk. It is fixed to the board with a bead of a compatible staking adhesive, applied in production and shown on the assembly drawing.
- **The flying leads** from the M12 connector to the board header. Loose wires whip under vibration and fatigue at the point where they leave a solder joint or crimp. They are tied to a moulded anchor point on the base, within 15 mm of the header, so that the header carries no wire mass.

Screws in standoffs can also loosen under vibration. The board screws use captive washers or a thread-locking compound compatible with the standoff material. The assembly drawing states which, so the choice is not left to the assembler.

## Couple the enclosure to the machine

The board is only as well coupled as the enclosure it sits in. The enclosure is attached to the gearbox housing, and that joint has its own stiffness and resonance.

For the gearbox monitor, the enclosure mounts on a single M8 stud screwed into a tapped hole in a spot-faced pad on the gearbox housing. The base's underside has a flat machined face around the stud. A single stud is simple for the installer, but it allows the enclosure to rock if the faces are not flat and in full contact, and rocking modes are low in frequency. This is an illustration. The modal study of the complete enclosure on its stud, with full face contact, showed the first rocking mode at about **2.1 kHz**, above the measurement band. With a 0.1 mm gap at one edge, simulating a poorly prepared pad, it fell below 1 kHz.

The installation instructions therefore specify the pad's flatness and surface finish, a tightening torque from the stud supplier's data and a thin film of coupling grease. These are all common practice for permanently mounted vibration sensors. Adhesive pads and magnetic mounts are quicker to fit, but sensor makers generally show them reducing the usable frequency range compared with a stud. The brief's 1 kHz upper limit decided which methods the installer may use.

## A failure case: the peak that was not in the gearbox

This is an illustration. The first prototypes had four corner standoffs and the accelerometer near one long edge, where the electronics designer had found room. On the test gearbox, the monitor's spectrum showed a strong peak near **360 Hz** that the reliability engineer could not explain from the gearbox's geometry.

The team mounted a laboratory reference accelerometer on a stud beside the monitor. The reference showed the 469 Hz gear mesh clearly and nothing unusual at 360 Hz. A tap test on the bench, striking the monitor's base lightly with a small hammer while logging the monitor's own sensor, showed the board ringing at 360 Hz.

The peak was the board, not the gearbox. Worse, the monitor's reading at 469 Hz was about 40% higher than the reference, consistent with the transmissibility of about 1.43 calculated earlier. The data was wrong in two ways, a false peak and an inflated real one. Either could have triggered a maintenance call.

The correction was the arrangement described above: a centre standoff, the accelerometer over it and a repeat comparison with the reference sensor. The comparison is now a standard step in the test plan of Chapter 9, because it is the only test that shows whether the monitor measures what it claims to.

## Survival as well as measurement

Even with the sensor problem solved, the board must survive years of continuous excitation. A board running at a few hundred hertz accumulates about **469 × 3,600 × 24 ≈ 40.5 million** cycles a day at the gear mesh frequency alone. Fatigue of solder joints and component leads depends on how much the board bends, so the stiffening that helped the measurement also reduces the strain. The environmental test in Chapter 9 checks survival directly with a vibration test profile agreed with the test laboratory.

If a product only needed to survive vibration and did not need to measure it, isolation mounts would be worth considering, because they reduce the vibration reaching the electronics. For a monitor, isolation would destroy the measurement. That difference is why the brief records what the product must measure as well as what it must survive.

## Exercise: a thicker board

The electronics designer offers a 2.0 mm board instead of 1.6 mm, which adds about **0.0004 × 0.004 × 1,900 ≈ 3.0 g** of laminate. Using the simply supported formula with the same assumed properties, estimate the new upper-bound frequency. Then estimate the frequency for the original 1.6 mm board if the component mass rises so that the total is 35 g instead of 28 g. What does this suggest about the most effective way to raise the frequency?

**Worked answer.** For the 2.0 mm board, **D = 20 × 10⁹ × 0.002³ ÷ (12 × (1 − 0.13²)) ≈ 13.6 N·m** and the mass per area is **(0.028 + 0.003) ÷ 0.004 ≈ 7.76 kg/m²**, so **f ≈ 1.571 × √(13.6 ÷ 7.76) × 556.25 ≈ 1,155 Hz**, about 33% higher than 870 Hz. For the heavier 1.6 mm board, frequency varies with the inverse square root of mass, so **f ≈ 870 × √(28 ÷ 35) ≈ 778 Hz**. Thickness helps because stiffness rises with the cube of thickness while mass rises only linearly. Added support points, such as the centre standoff, usually help more than either, because they shorten the span that can bend. All of these are upper-bound estimates. The modal study and the reference-sensor comparison remain the check.
