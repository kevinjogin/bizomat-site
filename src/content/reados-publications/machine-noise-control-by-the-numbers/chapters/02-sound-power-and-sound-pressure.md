---
book: machine-noise-control-by-the-numbers
chapterSlug: sound-power-and-sound-pressure
order: 2
title: "Sound power and sound pressure"
description: "Separate what a machine emits from what a person hears: sound power level, the free-field fall with distance, directivity near floors and walls, and catch a brochure's pressure read as power."
draft: false
---

A machine's noise can be described in two quite different ways, and confusing them is one of the commonest errors in noise control. **Sound power** is what the machine emits: a property of the machine running in a stated condition, independent of where it stands or who is listening. **Sound pressure** is what arrives at a point: it depends on the sound power, on the distance, on the surfaces near the machine and on the room. A light bulb is a useful comparison. Its wattage is a property of the bulb; the brightness on a page depends on how far away the page is and how pale the walls are. A machine's sound power plays the part of the wattage.

This chapter defines sound power level, shows how sound pressure falls with distance in open space, explains how nearby floors and walls concentrate sound, and outlines how sound power is measured. The running case finds that a purchasing comparison set CP-30's sound power against a competitor's sound pressure at 1 m, concluded that the competitor was 25 dB quieter, and would have bought a machine that was in fact about 8.6 dB quieter.

## Sound power level

Sound power is measured in watts, and the acoustic power of machines is remarkably small compared with their mechanical power. Its level is expressed in decibels against a reference of one picowatt:

L_W = 10 × log₁₀(W ÷ W₀), with W₀ = 10⁻¹² W

This is an illustration. CP-30's A-weighted sound power level of **100.3 dB(A)** corresponds to about 0.011 W of acoustic power, from a machine that draws 30 kW. Only about four parts in ten million of its power become airborne sound; the rest becomes compressed air and heat. That is typical: noise is a tiny by-product, which is why small changes to a machine's design can change its noise a great deal, and why no energy argument limits how quiet a machine can be made.

Sound power level is the right quantity for comparing machines, for writing purchase specifications and for predicting levels in a room that does not yet exist. It is a single figure, or a set of figures by frequency band as Chapter 3 shows, for a machine in a stated operating condition.

## From power to pressure in open space

Far from reflecting surfaces, sound spreads out from a small source in all directions, and its energy is shared over an ever larger sphere. At distance r, the sphere's area is 4πr², so the intensity, and the square of the pressure, falls in proportion to 1 ÷ r². In decibels:

```figure
type: formula
title: Sound pressure from sound power in a free field
formula: L_p = L_W + 10 × log₁₀(Q ÷ (4 × π × r²))
caption: This is an illustration for CP-30, with an A-weighted sound power level of 100.3 dB(A), standing on a hard floor, so that Q = 2. Indoors, the room adds reflected sound, as Chapter 5 shows.
- L_W | Sound power level, dB re 1 pW
- r | Distance from the source's acoustic centre, m
- Q | Directivity factor: 1 in free space, 2 on a hard floor, 4 at a floor–wall edge, 8 in a corner
step: At 1 m: 100.3 + 10 × log₁₀(2 ÷ 12.57) ≈ 92.3 dB(A)
step: At 2 m: about 86.3 dB(A); at 4 m about 80.3 dB(A)
step: Each doubling of distance lowers the level by about 6 dB
```

The 6 dB fall per doubling of distance is the **inverse square law**. It holds outdoors and in very large, highly absorbent spaces, at distances more than about the size of the machine. Close to a large machine, in its **near field**, the level varies irregularly from point to point and does not follow the law. Indoors, beyond a few metres, the reflected sound in the room stops the level falling, as Chapter 5 explains.

## Directivity: floors, walls and corners

A machine on a hard floor radiates into a hemisphere instead of a sphere; the floor reflects the sound that would have gone downwards, concentrating the energy into half the space. Its directivity factor Q is 2, and the level at a given distance is 3 dB higher than in free space. Against a wall as well as the floor, Q is 4, another 3 dB; in a corner, between two walls and the floor, Q is 8.

```figure
type: compare
title: CP-30's illustrative free-field level at 4 m by position
cols: Directivity factor Q | Level at 4 m | Against the floor position
caption: This is an illustration from CP-30's sound power of 100.3 dB(A). Moving a machine out of a corner lowers the level nearby by up to 6 dB, before any treatment.
- Suspended in free space | 1 | 77.3 dB(A) | −3 dB
- *On the floor, clear of walls | 2 | 80.3 dB(A) | 0 dB
- On the floor against one wall | 4 | 83.3 dB(A) | +3 dB
- On the floor in a corner | 8 | 86.3 dB(A) | +6 dB
```

This is why machine placement is the cheapest noise control there is. CP-30 stands on the floor, clear of the walls, at one end of the workshop. Had it been pushed into the corner to save floor space, its direct sound at the bench would have been up to 6 dB higher. Machines also radiate unevenly in their own right, louder from their air intake, their cooling fan or their exhaust than from their sides, and a real machine's directivity in different directions is part of its noise data.

## Measuring sound power

Sound power cannot be measured directly; it is calculated from sound pressure measured over a surface that encloses the machine. The principle is the free-field formula run backwards. The machine is surrounded by an imaginary measurement surface, often a box or hemisphere at about 1 m, the sound pressure level is measured at a set of points over it, the levels are averaged on an energy basis, and the surface's area is added:

L_W ≈ L_p,average + 10 × log₁₀(S ÷ S₀), with S₀ = 1 m²

This is an illustration. A box surface 1 m out from CP-30's sides and top, which measures about 1.6 × 1.0 × 1.5 m, has an area of about 43.8 m², so 10 × log₁₀(43.8) ≈ 16.4 dB is added to the average pressure level. An average of about 83.9 dB(A) over the surface would correspond to CP-30's 100.3 dB(A). In a real room, corrections are applied for the background noise and for the room's reflected sound, which add to the pressure measured on the surface. ISO 3744 sets out an engineering method of this kind for a machine over a reflecting floor, and makers who declare sound power usually measure it to that or a related standard.

## Sound power depends on the operating condition

A machine's sound power is a property of the machine in a stated condition, and many machines have several. A screw compressor like CP-30 alternates between **loaded** running, compressing air into the receiver, and **unloaded** running, idling with its inlet closed while the receiver's pressure falls, and may stop altogether when demand is low. Each condition has its own sound power, and the noise at the bench depends on how the time divides between them.

This is an illustration. If CP-30's sound power were about 3 dB lower when unloaded than when loaded, and it ran loaded for 60% of the time and unloaded for the rest, its time-averaged sound power would be 10 × log₁₀(0.6 × 10^10.03 + 0.4 × 10^10.03 ÷ 2) ≈ **99.3 dB(A)**, about 1.0 dB below the loaded figure. The difference is small here, but for machines with a very loud working cycle and a quiet idle, such as presses, saws and impact tools, the operating pattern can change the daily average by many decibels. The noise data should therefore state the condition, and the prediction should use the pattern of conditions the machine actually runs in. This book uses CP-30's loaded figure throughout, which is the conservative choice.

## Measuring sound power in a working room

The surface method above needs corrections for background noise and room reflections, and in a busy workshop those corrections can become large and uncertain. **Sound intensity** measurement avoids much of the problem. An intensity probe, two closely spaced microphones with a processor that estimates the direction and size of the sound energy flow, measures the net energy flowing out through each part of the measurement surface. Sound arriving from other machines flows in on one side and out on the other, and largely cancels in the total. Intensity measurement therefore lets a machine's sound power be estimated in place, with other machines running, within limits that the method's standards set out. It is also useful for finding which part of a machine radiates most, because the probe shows where the energy flow is strongest: the intake, the cooling fan, a panel or the motor.

For CP-30, an intensity scan over its surfaces would show whether the cooling air outlet or the casing panels radiate most, which decides where a treatment should start, a point Chapters 7 and 8 return to.

## The running case: two compressors compared

This is an illustration. Before CP-30 was bought, the workshop had compared it with a second model, here called model B. CP-30's brochure gave a sound power level of **100.3 dB(A)**. Model B's brochure gave "**75 dB(A)**", which the buyer read as directly comparable, and concluded that model B was 25 dB quieter, a remarkable difference for machines of the same capacity.

## The error: pressure at 1 m read as power

Model B's figure was a sound pressure level, averaged over a measurement surface 1 m from the machine, which its maker published because it looked smaller. Model B measures about 1.8 × 1.0 × 1.6 m, so a box 1 m out from its sides and top has an area of about 46.8 m², and 10 × log₁₀(46.8) ≈ 16.7 dB. Its sound power level is therefore about 75 + 16.7 ≈ **91.7 dB(A)**: about **8.6 dB** quieter than CP-30, not 25 dB.

```figure
type: bars
title: The two compressors' published figures and their sound powers, dB(A)
unit: dB(A)
max: 105
caption: This is an illustration. Model B's 75 dB(A) is a sound pressure at 1 m; converted to sound power it is about 91.7 dB(A), about 8.6 dB below CP-30.
- CP-30, sound power as published | 100.3
- Model B, sound pressure at 1 m as published | 75.0
- *Model B, converted to sound power | 91.7
```

The difference mattered for the decision. In the workshop, a machine 8.6 dB quieter in sound power would give about 86.8 − 8.6 ≈ **78.2 dB(A)** at the fitter's bench, a useful improvement; the buyer's reading suggested about 61.5 dB(A), which would have made the bench quiet. Model B was also more expensive, and the workshop, judging its real advantage too small for the price, bought CP-30, which is why it now needs the controls of the following chapters. With a correct comparison, model B's 8.6 dB might have been worth its price after all, because it is roughly what a basic enclosure would achieve, as Chapter 7 shows.

The check that would have caught it is simple: every noise figure in a comparison must state whether it is sound power or sound pressure, and if pressure, at what distance, over what surface and under what conditions. Figures of different kinds are converted to sound power before they are compared. The general lesson is that a decibel figure without its quantity, reference and conditions cannot be compared with anything, and that a brochure's choice of figure is not neutral.

## Asking for sound power data

A purchase specification for a machine should ask for its sound power level, measured to a named standard, in octave bands as well as A-weighted, for the operating condition that matters, such as full load. It should also ask for the uncertainty or the declared value's basis, because a declared value includes a margin that differs between makers. Where a maker supplies only sound pressure at a distance, the specification should ask for the measurement surface, the distance and the environment, so that the figure can be converted. Chapter 10 returns to buying quiet as the most effective control of all.

## Several machines, one room

Because sound power is a property of the machine, the sound powers of several machines can be added, using the energy addition of Chapter 1, to give the total sound power in a room. A room with two CP-30s has a total sound power level about 3 dB higher than with one. That total sets the room's reflected sound level, as Chapter 5 shows, while each machine's direct sound depends on its own distance from each receiver. Keeping the two ideas apart, total power for the room and individual distances for the direct sound, is what makes room predictions straightforward.

## Exercise: free field against the workshop

Using CP-30's sound power of 100.3 dB(A) on a hard floor, what sound pressure levels would you expect at 1 m, 2 m and 4 m in open space? This book's later chapters give the levels in the workshop as about 93.2, 89.0 and 86.8 dB(A). What explains the difference, and why does it grow with distance?

**Worked answer.** In open space with Q = 2, the levels are about **92.3 dB(A)** at 1 m, **86.3 dB(A)** at 2 m and **80.3 dB(A)** at 4 m, falling 6 dB per doubling of distance. The workshop levels are about 0.9, 2.7 and 6.5 dB higher.

The difference is the sound reflected from the workshop's walls, floor and roof, which forms a **reverberant field** of roughly the same level throughout the room. Close to the machine, the direct sound is much stronger than the reverberant field and dominates; further away, the direct sound has fallen while the reverberant field has not, so the reverberant field takes over. At the bench, 4 m away, most of the sound arriving has bounced off a surface at least once. That is why Chapter 5's room treatment matters at the bench, and why moving the bench further from CP-30 helps much less than the inverse square law would suggest.
