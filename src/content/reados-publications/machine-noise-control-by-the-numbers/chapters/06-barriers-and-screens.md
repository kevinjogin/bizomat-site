---
book: machine-noise-control-by-the-numbers
chapterSlug: barriers-and-screens
order: 6
title: "Barriers and screens"
description: "Estimate a screen's attenuation from its path difference and Fresnel number, see why it works outdoors and fails in a reverberant room, and catch a barrier sold on an 18.8 dB free-field figure."
draft: false
---

A barrier, or screen, is a solid wall placed between a machine and a listener so that the listener cannot see the machine. Sound does not stop at the barrier's edge; it bends over and round it by diffraction, so the listener sits in an acoustic shadow that is partial, deep at high frequencies and shallow at low ones. Outdoors, a well-placed barrier can lower a machine's noise by 10 to 20 dB. Indoors, the same barrier often achieves almost nothing, because it blocks only the direct sound, and the sound that reaches the listener has mostly come the long way round, off the walls and roof.

This chapter shows how a barrier's attenuation is estimated from its geometry and the wavelength, what limits it, and why the room matters so much. The running case finds that a 2.4 m screen beside CP-30 was predicted, from a free-field calculation, to cut the compressor's noise at the bench by about 18.8 dB, and gave about 1.0 dB in the bare workshop.

## Path difference and the Fresnel number

A barrier lengthens the path the sound must take. Without it, sound travels straight from the source to the receiver; with it, the shortest route goes up to the barrier's top edge and down again. The extra length, the **path difference** δ, measured in wavelengths, decides how deep the shadow is. Its measure is the **Fresnel number**:

```figure
type: formula
title: A screen's attenuation from its path difference
formula: N = 2 × δ ÷ λ;   attenuation ≈ 10 × log₁₀(3 + 20 × N) dB, for a long, solid screen in a free field
caption: This is an illustration for CP-30's acoustic centre 0.8 m above the floor, a 2.4 m screen 1 m from the compressor, and the fitter's ear 1.6 m above the floor, 4 m from the compressor. The formula is a common engineering approximation to the measured screen attenuation charts of Maekawa (1968), for a point source and a long, solid screen.
- δ | Path difference: over the top, minus the direct distance, m
- λ | Wavelength, m
- N | Fresnel number
step: Over the top: √(1² + 1.6²) + √(3² + 0.8²) ≈ 1.887 + 3.105 = 4.992 m; direct: √(4² + 0.8²) ≈ 4.079 m
step: δ ≈ 0.912 m
step: At 1,000 Hz, λ ≈ 0.343 m, N ≈ 5.32, attenuation ≈ 20.4 dB; at 125 Hz, N ≈ 0.67, attenuation ≈ 12.1 dB
```

Because N is proportional to frequency, a barrier's attenuation rises with frequency, roughly 3 dB per octave once N is above about 1. At low frequencies, where the wavelength is comparable with the path difference, the shadow is shallow. Approximations of this kind are usually capped at about 20 to 25 dB for a single screen, because in practice scattering, the screen's own transmission and atmospheric effects limit what a real screen achieves.

## The running case: a screen beside CP-30

This is an illustration. After the roof absorber was ordered, the workshop was offered a 2.4 m high, 4 m wide steel-faced screen to stand between CP-30 and the fitter's bench, 1 m from the compressor. The screen's supplier calculated its effect band by band, as above, and added the A-weighted results: in a free field, the screen would lower the compressor's direct sound at the bench by about **18.8 dB(A)**.

```figure
type: compare
title: The 2.4 m screen's illustrative attenuation by octave band, free field
cols: Fresnel number N | Attenuation
caption: This is an illustration from the path difference of 0.912 m. Attenuation rises with frequency; the A-weighted total for CP-30's direct sound is about 18.8 dB.
- 63 Hz | 0.34 | 9.9 dB
- 125 Hz | 0.67 | 12.1 dB
- 250 Hz | 1.33 | 14.7 dB
- 500 Hz | 2.66 | 17.5 dB
- *1,000 Hz | 5.32 | 20.4 dB
- 2,000 Hz | 10.64 | 23.3 dB
- 4,000 Hz | 21.28 | 26.3 dB
- 8,000 Hz | 42.56 | 29.3 dB
```

## The error: a free-field figure in a reverberant room

The screen blocks only the direct path. In the bare workshop, as Chapter 5 showed, about three-quarters of the sound energy reaching the bench is reverberant, reflected off the walls and roof, and that sound arrives from every direction, including over and round the screen. The screen does not reduce CP-30's sound power, so it barely changes the reverberant field.

This is an illustration. Repeating the calculation band by band with the room's reverberant term included, the screen lowers the A-weighted level at the bench by about **1.0 dB** in the bare workshop. With the roof absorber installed, the reverberant field is weaker, the direct sound is a larger share of the total at the bench, and the screen's benefit rises to about **3.0 dB**. Only in a free field, outdoors or in a fully absorbent room, would it give its 18.8 dB.

```figure
type: bars
title: The screen's reduction of CP-30's noise at the bench, dB(A)
unit: dB
max: 20
caption: This is an illustration. The same screen gives 18.8 dB in a free field, about 3 dB with the roof absorber, and about 1 dB in the bare, reverberant workshop.
- Free field, as calculated by the supplier | 18.8
- *Workshop with 300 m² roof absorber | 3.0
- Bare workshop | 1.0
```

The workshop did not buy the screen. The check that caught the error was asking where the sound at the bench comes from: Chapter 5's room equation showed that the reverberant term was about three and a half times the direct term at the bench, so no treatment of the direct path alone could achieve more than about 1 dB. The general lesson is that a barrier's free-field attenuation applies only where the direct sound dominates, and that indoors its benefit is limited by the reverberant field unless the room is made absorbent first.

## Where barriers work indoors

Barriers can be useful indoors in particular conditions:

- the room is **absorbent**, especially its ceiling, so the reverberant field is weak and the ceiling does not reflect sound over the top of the barrier;
- the receiver is **close to the barrier** and the barrier is **close to the source**, so the path difference is large and the direct sound is strong compared with the reverberant field;
- the noise is **high-frequency**, so the shadow is deep;
- the barrier is **long** enough that sound does not simply go round its ends, and **solid** to the floor, with no gap underneath.

A screen between a noisy grinding bench and an office window in an absorbent workshop, or a partial enclosure that combines a barrier with an absorbent lining facing the machine, can work well. A free-standing screen in a bare steel shed seldom does.

## The ceiling and the ends

Two paths often defeat an indoor barrier. The first is the **ceiling**: a hard ceiling above the barrier reflects sound down into the shadow, and in a building 7 m high the reflection is strong. An absorbent ceiling over the barrier's region removes much of it. The second is the **ends**: sound diffracts round a barrier's vertical edges as well as over its top, and a short barrier is bypassed at each end. Each edge has its own path difference and its own attenuation, and the energies arriving over the top and round each end add. A barrier should extend well past the line of sight on each side, or wrap round the source. A practical check is to stand at the receiver and look: if any part of the machine, or any hard surface that the machine can see, is visible past an end or over the top, sound will arrive by that route, and the barrier must be lengthened, raised or helped by absorption on that surface.

## The barrier's own transmission

A barrier must also stop sound passing straight through it. If its transmission loss, the subject of Chapter 7, is not well above the diffraction attenuation, sound through the barrier limits the result. A useful working rule is that the barrier's transmission loss should exceed its expected attenuation by about 10 dB in each band. This is an illustration. A screen of about 10 kg/m², such as thin steel sheet over a frame, has an estimated mass-law transmission loss of about 9 dB at 63 Hz, 15 dB at 125 Hz and 33 dB at 1,000 Hz. At 1,000 Hz that is ample against 20.4 dB of diffraction attenuation; at 63 Hz, where the screen's diffraction attenuation is about 9.9 dB, the screen's own transmission sets the limit. Gaps, holes and joints matter as much: a barrier with a 50 mm gap under it is a barrier with a hole along its whole length.

## Outdoors

Barriers are most effective outdoors, where there is no reverberant field, and they are a standard control for plant noise reaching a site boundary or a neighbour. Outdoor barrier calculations add effects this chapter leaves out: ground reflections on each side, the barrier's position relative to both source and receiver, wind and temperature gradients that bend sound over a barrier at long distances, and reflections from buildings behind the source. Methods for outdoor propagation and barriers are set out in international standards and in environmental noise guidance, and the jurisdiction's environmental noise policy decides the targets. For a compressor that a neighbour can hear, a barrier on the site boundary may succeed where a barrier inside the workshop failed.

## Partial enclosures

Between a free-standing screen and a full enclosure lies the **partial enclosure**: a three-sided booth or a screen with a roof, lined with absorbent material facing the machine. The lining absorbs the sound that would otherwise reflect off the inside faces and out of the opening, and the roof blocks the path over the top. A partial enclosure can achieve several decibels more than a flat screen, particularly towards receivers that face its closed sides, and it leaves access for operators, materials and cooling air. For machines that must be tended continuously, it is often the practical compromise. For CP-30, which needs access only for servicing, a full enclosure is the better choice, as Chapter 7 shows.

## Screening the receiver instead

A barrier can be placed near the receiver as well as near the source, and the geometry works the same way: what matters is the path difference, which is large when the barrier is close to either end of the path. A further step is to enclose the receiver: a **refuge** or control booth, an enclosed space with its own walls, door and window, in which an operator spends the time between tasks. A refuge works on the same principles as a machine enclosure, Chapter 7's subject, but it protects a person instead of containing a machine, and it can be the right answer where many noisy machines share a large hall and no single source can be treated.

For CP-30's workshop, a refuge for the fitter is not practical, because the fitter's work is at the bench and the bench is a work surface, not a control station. But the idea of treating the receiver is worth keeping in view, particularly for workers who supervise noisy processes from one place for long periods.

## Checking a barrier in place

A barrier's real effect is its **insertion loss**: the level at the receiver without the barrier, minus the level with it, with the source in the same operating condition. It is measured in place, band by band, at the receiver positions that matter, with the background noise checked as Chapter 10 describes. Because a barrier's effect varies strongly with position, a few measurements across the shadow zone show where the shadow is deep and where it fades, which is useful when work positions might move.

The measured insertion loss can be compared with the prediction to check the assumptions. A measured loss much below the free-field prediction, but close to the room-corrected one, confirms that the reverberant field is the limit. A measured loss below even the room-corrected prediction points to a leak: a gap under the barrier, sound round an end, or reflections from a nearby hard surface such as a column, a stack of steel or a parked forklift. Each can be found by moving the microphone and listening.

## Barriers as part of a combination

The results of this chapter and Chapter 5 together show a general principle: indoor noise controls interact, and their effects do not simply add. Absorption lowers the reverberant field, which makes the direct sound a larger share of the total, which makes a barrier more effective. A barrier lowers the direct sound, which makes the reverberant field a larger share, which makes absorption more valuable. The right order is usually to deal with the room first, then with the direct paths, and to calculate the combination, not the separate measures.

This is an illustration. In the bare workshop, the screen gives about 1.0 dB at the bench and the roof absorber about 3.6 dB; together, about 3.6 + 3.0 = 6.6 dB, more than the sum of their separate effects, because each makes the other work better. Even so, 6.6 dB is short of the 11 dB that Chapter 4's target requires, which is why the workshop turned to treating CP-30 itself.

## Exercise: a taller screen

The supplier suggests raising the screen to 3.0 m. Keeping the same positions, what is the new path difference, and the attenuation at 1,000 Hz in a free field? What happens to the screen's benefit at the bench with the roof absorber?

**Worked answer.** Over the top, the path is √(1² + 2.2²) + √(3² + 1.4²) ≈ 2.417 + 3.311 = 5.727 m, so δ ≈ 5.727 − 4.079 ≈ **1.648 m**. At 1,000 Hz, N ≈ 2 × 1.648 ÷ 0.343 ≈ 9.61 and the attenuation is about 10 × log₁₀(3 + 192.2) ≈ **22.9 dB**, about 2.5 dB more than the 2.4 m screen. The A-weighted free-field attenuation rises from about 18.8 dB to about 21.3 dB.

At the bench, with the roof absorber, the screen's benefit stays at about **3.0 dB**. The direct sound was already reduced so far by the 2.4 m screen that what remains at the bench is almost all reverberant; making the shadow deeper removes a part of the total that no longer matters. Height buys attenuation only while the direct path is still a significant share of the sound at the receiver.
