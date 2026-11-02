---
book: springs-by-the-numbers
chapterSlug: compression-spring-fatigue
order: 4
title: "Compression springs that cycle: stroke, stress range and fatigue"
description: "How to check a compression spring that cycles: the stress range from preload and stroke, wire endurance from Zimmerli's data, Goodman factors, and finding the real stroke."
draft: false
---

A spring that works once, or a few times a day, is designed for static strength. A spring that works every time a machine cycles is designed for fatigue, and fatigue in springs is decided less by the highest stress than by how far the stress swings each cycle. The VM-8's lock plunger spring moves every time a tool is changed. In a busy job shop that is tens of times an hour and hundreds of thousands of times a year, and the previous owner's records showed two broken springs in three years.

This chapter checks the plunger springs, old and new, for fatigue with the KEVOS® spring fatigue tool, using wire endurance strengths from Zimmerli's data. Metal Fatigue by the Numbers explains the theory behind those strengths in its [chapter on springs](/reados/publications/metal-fatigue-by-the-numbers/springs/); this chapter applies it. Its mistake is the one that explained the broken springs: the stroke on the drawing was not the stroke in the machine.

## The stress cycle of a spring

A preloaded compression spring never unloads. The plunger spring is compressed to 50 mm when the arm is parked and to 38 mm when the pin is pulled back, so its force swings between two values above zero, and so does its stress. Fatigue analysis describes that cycle by its mean and alternating parts.

```figure
type: formula
title: The stress cycle of a preloaded spring
formula: τ1 = K × 8 F1 D ÷ (π d³),  τ2 = K × 8 F2 D ÷ (π d³)
formula: τa = (τ2 − τ1) ÷ 2,  τm = (τ2 + τ1) ÷ 2
formula: Goodman factor n = 1 ÷ (τa ÷ Sse + τm ÷ Ssu)
caption: F1 is the force at the longer working length (the preload), F2 at the shorter. The Wahl factor K is applied to both parts of the stress, which is the conservative practice. Sse is the wire's torsional endurance limit for fully reversed stress and Ssu its ultimate shear strength.
- τa | alternating shear stress
- τm | mean shear stress
- n | fatigue safety factor
```

The preload raises the mean stress but does not change the alternating stress. The stroke, the distance the spring moves each cycle, sets the alternating stress through the rate: τa is proportional to k × stroke. That makes the stroke the most important number in a spring fatigue check, and the one most often taken on trust.

### How many cycles?

Whether a spring needs an infinite-life check depends on how many cycles it will see. The VM-8's shop expects about 40 tool changes an hour while machining, over two shifts of 8 hours, on 250 days a year: 40 × 16 × 250 = 160,000 cycles a year. Over a ten-year rebuild life that is 1.6 million cycles, and the plunger moves once per change. This is an illustration.

Steel springs that survive a few million cycles at a given stress range generally survive indefinitely, so a spring expected to see more than about a million cycles is checked for infinite life, which is what the KEVOS® fatigue tool does. A spring that cycles a few thousand times in its life, such as a lid counterbalance, can be designed for finite life at a higher stress range, using the spring maker's life data; that is not what this tool checks, and the shop does not try to stretch it to that case.

## Wire strengths for fatigue

Spring wire endurance has an unusual property that makes the check simpler than for most parts. Tests by Zimmerli on spring steels under about 10 mm diameter found that their torsional fatigue strength hardly depends on the wire's tensile strength or size: the surface sets it. Shigley's reports his results as an alternating strength of 241 MPa at a mean stress of 379 MPa for unpeened springs, and 398 MPa at 534 MPa for shot-peened ones.

A Goodman line from Zimmerli's point to the ultimate shear strength gives the fully reversed torsional endurance limit that the fatigue tool needs.

```figure
type: steps
title: Fatigue strengths of the plunger spring wires
caption: This is an illustration. Music wire, Sut = 2,211 ÷ d^0.145 MPa; Ssu = 0.67 Sut; torsional yield Ssy = 0.45 Sut; Sse = Ssa ÷ (1 − Ssm ÷ Ssu) from Zimmerli's data.
- 2.5 mm wire, old spring | Sut 1,936 · Ssu 1,297 · Ssy 871 · Sse 340.5 MPa unpeened
- 2.3 mm wire, new spring | Sut 1,959 · Ssu 1,313 · Ssy 882 · Sse 338.8 MPa unpeened
- * 2.3 mm wire, shot peened | Sse 398 ÷ (1 − 534 ÷ 1,313) = 670.9 MPa
```

Shot peening roughly doubles the endurance limit, because it leaves the wire's surface in compression, which holds fatigue cracks shut. It only works where the shot reaches: on the inside of the coil, where the stress is highest, the coils shade each other, and closely wound springs are hard to peen well.

## The plunger springs in the tool

The [compression spring fatigue check](/tools/spring-fatigue-check/) takes the wire and coil diameters, active coils, end type, shear modulus, free length, the preload length and the shortest working length, the wire's torsional endurance limit, ultimate and yield strengths, and a required factor. It returns the rate, the loads and corrected stresses at both lengths, the alternating and mean stresses, the Goodman, Soderberg and Gerber factors, the first-cycle yield factor and the solid length. It assumes infinite life and applies the Wahl factor to both stresses; it reminds the user to keep the operating frequency well below the spring's natural frequency.

The shop requires a Goodman factor of 1.3 for springs in machines. This is an illustration; it is lower than the 1.5 it uses for machined parts because spring wire and spring making are closely controlled and Zimmerli's data are for the product itself.

```figure
type: compare
title: Old and new plunger springs, 50 to 38 mm, unpeened
cols: Loads, N | Stresses, MPa | τa / τm, MPa | Goodman | Soderberg | First-cycle yield
rowhead: Spring
- Old, 2.5 mm, 10 coils, free 62 mm | 58.1 / 116.2 | 224 / 448 | 112.1 / 336.2 | 1.70 | 1.40 | 1.94
- * New, 2.3 mm, 9.25 coils, free 64.7 mm | 55.1 / 100.1 | 269 / 489 | 110.0 / 379.4 | 1.63 | 1.33 | 1.80
caption: This is an illustration. Both pass the shop's 1.3 on Goodman with the stroke on the drawing. The new spring's lower rate keeps its alternating stress almost the same as the old one's despite its thinner wire.
```

On the drawing's stroke, both springs pass comfortably. The old spring should not have broken.

## The mistake: the stroke on the drawing

The shop's maintenance fitter did not accept that. If the spring passed with a factor of 1.7 and still broke twice, something in the inputs was wrong. The wire and coil were measured; the endurance figures were textbook values for good wire. That left the lengths.

The fitter set a dial indicator on the plunger and cycled the changer slowly by hand. Parked, the spring was at 50 mm as drawn. Retracted, it was at 33 mm, not 38. The cam's return stop, a hardened screw that limits how far the follower travels, had worn and been backed off at some time, and the cam was pulling the pin 5 mm further than its design. Nothing else was affected: the pin cleared the notch earlier, and the changer worked normally.

```figure
type: compare
title: The plunger springs with the stroke the machine actually gave, 50 to 33 mm
cols: Peak stress, MPa | τa / τm, MPa | Goodman | Soderberg | Verdict
rowhead: Spring
- Old, unpeened | 542 | 158.8 / 382.9 | 1.31 | 1.10 | At the margin
- New, unpeened | 581 | 155.8 / 425.3 | 1.28 | 1.06 | FATIGUE FAILURE LIKELY against 1.3
- * New, shot peened | 581 | 155.8 / 425.3 | 1.80 | 1.40 | Passes; first-cycle yield 1.52 governs
caption: This is an illustration. A 5 mm longer stroke raised the alternating stress by 42% in the old spring. Fatigue factors near 1.3 leave no room for a surface that is less than perfect.
```

With the real stroke, the old spring's Goodman factor fell to 1.31: on paper still acceptable, in practice no margin at all. The broken springs, examined under a magnifier, showed fatigue cracks starting on the inside of the coil, at small pits where coolant mist had reached the spring through the plunger's open end. A surface like that is not the clean wire of Zimmerli's tests, and a spring with no margin will fail on it. The set of 1.5 mm fits the same picture: a spring worked hard over hundreds of thousands of cycles, at high mean stress, with no set removal.

The new spring, designed to the drawing's stroke, would have done no better: 1.28 on Goodman. Had it gone in without the fitter's measurement, it would have broken too, and the shop would have blamed the spring maker.

### Reading a broken spring

A fatigue fracture in spring wire has a recognisable look, and the fitter's magnifier was enough to read it. The crack starts at a point on the surface, usually on the inside of the coil, and runs across the wire at about 45° to its axis, because the wire is in torsion and the largest tensile stress lies at 45°. The part of the face that grew slowly is smooth, sometimes with curved marks centred on the origin; the last part, which broke in one cycle, is rough. A spring that broke from overload instead has a rough, often twisted face with no smooth zone.

Both broken plunger springs showed a smooth zone starting at a pit on the inner surface. That pointed to fatigue, helped by corrosion, and sent the fitter looking for a stress range larger than the drawing's.

### Why strokes grow

The cam stop is not unusual. Strokes in machines grow because stops wear, adjusting screws are moved during repairs and not reset, cams and followers are replaced with parts of slightly different profile, and linkages loosen at their pins. None of these shows on a drawing, and few of them change how the machine appears to work. A spring designed with a modest fatigue margin on a nominal stroke has no protection against any of them. Measuring the working lengths in the machine, through a full cycle, is the only way to know the stroke the spring actually sees.

### What was changed

The rebuild fixed the cause and added margin:

1. **The stroke.** A new cam stop screw was fitted, set so the spring is 38 mm with the pin retracted, and locked with thread-locking compound. Its setting is checked with the dial indicator at each annual service.
2. **The surface.** The plunger's open end was closed with a felt wiper and a rubber boot, so coolant mist cannot reach the spring.
3. **The spring.** The new springs were specified shot peened, with set removed. At the design stroke they have a Goodman factor of 2.21 instead of 1.63; if the stop wears again and the stroke grows to 33 mm, they still pass at 1.80.

```figure
type: bars
title: Goodman factor of the new plunger spring by stroke and finish
x: Condition
y: Goodman factor
caption: This is an illustration. 2.3 mm music wire, preload length 50 mm. The required factor is 1.3. Peening turns a marginal spring into a robust one; fixing the stroke does the same for less money. The rebuild did both.
- Unpeened, 50 to 38 mm | 1.63
- Unpeened, 50 to 33 mm | 1.28
- * Peened, 50 to 38 mm | 2.21
- Peened, 50 to 33 mm | 1.80
```

The peened spring at the design stroke has a first-cycle yield factor of 1.80, now the lower figure, which is what governs once fatigue is no longer the limit.

## Preload and stroke trade against each other

The changer needs a minimum force with the pin home, and the spring's fatigue life depends on its stress range. Those two needs pull in opposite directions only through the rate. A stiffer spring with less preload deflection gives the same parked force but a larger alternating stress for the same stroke; a softer spring with more preload gives the same parked force with a smaller alternating stress but a higher mean stress.

For a fixed stroke, softening the spring is usually the better trade, because the Goodman line punishes the alternating stress about four times as hard as the mean stress: for the 2.3 mm wire, 1 MPa of alternating stress uses up 1 ÷ 338.8 of the margin, and 1 MPa of mean stress only 1 ÷ 1,313. That is why Chapter 3's softer spring, 3.75 N/mm against the old spring's 4.84 N/mm, kept its alternating stress down even though its thinner wire raised its mean stress. The limit is space: a softer spring needs a longer free length or more coils to give the same parked force, and both need room.

## Reading the factors

The tool gives three fatigue factors and one yield factor because no single criterion is exact. Goodman's straight line from the endurance limit to the ultimate strength is the usual design line. Soderberg's line runs to the yield strength instead and is more conservative; for springs it often falls below 1 when Goodman passes, as it did for the old spring at the real stroke. Gerber's parabola fits test data more closely and is less conservative. The first-cycle yield factor compares the peak stress with the torsional yield strength and guards against a spring taking a set on its first stroke.

The shop designs to Goodman and treats a Soderberg factor below 1 as a warning that the spring is working close to its limits, which is what the old spring's figure of 1.10 said about it.

## Surge and frequency

The fatigue tool reminds the user to keep the operating frequency well below the spring's natural frequency. The new spring's natural frequency is 222 Hz from Chapter 3. The changer cycles a few times a minute and moves the pin over about a fifth of a second. Surge, which adds dynamic stress on top of the static stroke, is not a concern here. It would be in a fast cam-driven mechanism, where the cam's motion contains frequencies of tens of hertz.

## A checking routine for cycling springs

```figure
type: checklist
title: Before trusting a spring fatigue check
caption: The VM-8 rebuild's routine for any spring that cycles. This is an illustration.
- x Both working lengths measured in the machine, through a full cycle, not taken from the drawing
- x Number of cycles a year estimated, and infinite life required where it exceeds about a million in service
- x Endurance data matched to the wire's finish: unpeened, peened, or corroded
- x Spring kept dry and clean, or a corrosion-resistant wire chosen
- x Goodman factor at least 1.3, Soderberg reviewed if below 1
- x First-cycle yield factor above 1
- x Natural frequency well above the frequencies in the motion
```

## Exercise: the kit spring

Before the rebuild, a fitter had once replaced a broken plunger spring with one from an assorted kit: 2.0 mm music wire, 20.5 mm mean diameter so that its outside diameter matched, 6 active coils, closed and ground, 62 mm free length. Using Sut = 2,000 MPa for 2.0 mm wire, Ssu = 1,340 MPa, Ssy = 900 MPa and Sse = 336 MPa, check it for fatigue between 50 and 38 mm, and say whether it does the job.

### Worked answer

The rate is 79,300 × 2.0⁴ ÷ (8 × 20.5³ × 6) = 3.068 N/mm. The loads are 3.068 × 12 = 36.8 N at 50 mm and 3.068 × 24 = 73.6 N at 38 mm.

The index is 20.5 ÷ 2.0 = 10.25 and the Wahl factor 1.141. The stresses are 1.141 × 8 × 36.8 × 20.5 ÷ (π × 8) = 274 MPa and twice that, 548 MPa. So τa = 137.1 MPa and τm = 411.2 MPa.

Goodman: n = 1 ÷ (137.1 ÷ 336 + 411.2 ÷ 1,340) = 1 ÷ (0.408 + 0.307) = 1.40. Soderberg: 1 ÷ (0.408 + 411.2 ÷ 900) = 1.16. First-cycle yield: 900 ÷ 548 = 1.64.

The fatigue tool gives the same figures and a verdict of infinite life expected against 1.3. But the spring fails the job before fatigue matters: 36.8 N at the parked length is well short of the 50 N the changer needs to hold the arm. It is also more highly stressed than the designed spring for less force, because its thin wire carries its load on a large coil. Matching the outside diameter of a spring says nothing about its force or its stress.
