---
book: machine-noise-control-by-the-numbers
chapterSlug: sound-in-the-room
order: 5
title: "Sound in the room: absorption and reverberation"
description: "Split a room's sound into direct and reverberant parts, find the room constant, reverberation time and critical distance, size absorption, and catch an absorber sold on a 10 dB promise."
draft: false
---

Indoors, a machine's sound reaches a listener by two routes. Some travels straight from the machine, falling with distance as Chapter 2 described. The rest arrives after bouncing off the walls, floor and roof, often many times, and builds up into a **reverberant field** that fills the room at a nearly uniform level. In a hard-surfaced workshop, the reverberant field is strong, and beyond a few metres from a machine it, not the direct sound, sets the level. Adding absorption to the room's surfaces weakens the reverberant field and lowers the level everywhere it dominates, but it does almost nothing close to the machine, where the direct sound rules.

This chapter sets out the room equation that combines the two parts, the room constant and the reverberation time, the critical distance where they are equal, and what absorption can and cannot achieve. The running case finds that a roof absorber was sold to the workshop on the promise of "up to 10 dB", and that the reduction it gave was about 0.6 dB at the compressor and 3.6 dB at the fitter's bench, worthwhile but far short of the target.

## Absorption and the room constant

Every surface absorbs some of the sound that strikes it and reflects the rest. The fraction absorbed is the surface's **absorption coefficient**, α, from 0 for a perfect reflector to 1 for a perfect absorber, and it varies with frequency, as Chapter 3 showed. Bare steel, concrete and glass have coefficients of a few per cent; thick porous absorbers reach 0.8 to 1.0 at mid and high frequencies.

The room's total absorption, A, is the sum of each surface's area times its coefficient, in square metres, sometimes called sabins. The **room constant** R = S × ᾱ ÷ (1 − ᾱ), where S is the room's total surface area and ᾱ its average coefficient, sets the strength of the reverberant field: the larger R, the weaker the reverberant field for a given sound power.

```figure
type: formula
title: The room equation and the reverberation time
formula: L_p = L_W + 10 × log₁₀( Q ÷ (4πr²) + 4 ÷ R );   T₆₀ ≈ 0.161 × V ÷ A
caption: This is an illustration for the workshop, 24 × 16 × 7 m, with surfaces of about 1,328 m² at an average coefficient of 0.08, and CP-30's sound power of 100.3 dB(A). The single-figure calculation stands for a band-by-band one.
- R | Room constant, S × ᾱ ÷ (1 − ᾱ), m²
- A | Total absorption, S × ᾱ, m²
- V | Room volume, m³
- T₆₀ | Reverberation time, the time for sound to decay by 60 dB, s
step: A ≈ 1,328 × 0.08 ≈ 106 m²; R ≈ 115.5 m²
step: T₆₀ ≈ 0.161 × 2,688 ÷ 106 ≈ 4.1 s
step: At the bench, 4 m: direct term 2 ÷ 201 ≈ 0.0099, reverberant term 4 ÷ 115.5 ≈ 0.0346; L_p ≈ 86.8 dB(A)
```

The first term in the bracket is the direct sound, falling with distance; the second is the reverberant field, the same everywhere. At the fitter's bench, the reverberant term is about three and a half times the direct term: most of the energy at the bench has reflected off the room's surfaces.

## Reverberation time

A room's **reverberation time**, T₆₀, is how long a sound takes to die away by 60 dB after its source stops. It is the most commonly measured property of a room, because it can be measured by stopping a noise or firing a starting pistol and recording the decay, and because it gives the room's total absorption by Sabine's formula. The workshop's estimated 4.1 s is typical of a hard industrial building: a shout lingers, speech is hard to follow at a distance, and every machine seems louder than it is. A room with absorption added to give, say, 1.3 s feels markedly quieter and speech carries better, even where the level falls by only a few decibels.

## Critical distance

The **critical distance** is the distance from a source at which the direct and reverberant terms are equal: r_c = √(Q × R ÷ 16π). Inside it, the direct sound dominates; outside it, the reverberant field does.

This is an illustration. For CP-30 in the bare workshop, r_c ≈ √(2 × 115.5 ÷ 50.3) ≈ **2.1 m**. The fitter's bench, at 4 m, is well outside it, in the reverberant field. Someone servicing CP-30 at 1 m is well inside it, in the direct field. That single number predicts what absorption will do at each place.

## What absorption can do

Adding absorption increases R and lowers the reverberant field by 10 × log₁₀(R_new ÷ R_old) decibels. It does nothing to the direct sound. So absorption helps most far from the source, where the reverberant field dominates, and least close to it.

This is an illustration. A treatment of **300 m²** of 50 mm porous absorber on the underside of the roof, with an illustrative coefficient of 0.8 at mid frequencies, replaces 300 m² of steel at 0.08. The total absorption rises from about 106 to about **322 m²**, the average coefficient to about 0.24, the room constant to about **425 m²**, and the reverberation time falls from about 4.1 s to about **1.3 s**. The reverberant field falls by 10 × log₁₀(425 ÷ 115.5) ≈ **5.7 dB**, and the critical distance grows to about 4.1 m.

```figure
type: line
title: CP-30's illustrative level by distance, before and after the roof absorber
x: Distance from CP-30, m
y: Sound pressure level, dB(A)
legend: Bare workshop | With 300 m² roof absorber
ymin: 75
ymax: 100
caption: This is an illustration from the room equation. Close to the machine the direct sound sets the level and the absorber changes little; far away the reverberant field sets it and the absorber helps most, approaching its 5.7 dB limit.
- 0.5 | 98.6 | 98.4
- 1 | 93.2 | 92.6
- 2 | 89.0 | 87.2
- 4 | 86.8 | 83.2
- 8 | 86.0 | 81.1
- 12 | 85.8 | 80.5
```

## The error: the 10 dB promise

This is an illustration. The absorber's supplier described its product as reducing noise "by up to 10 dB", and the workshop's manager expected it to bring CP-30's 86.8 dB(A) at the bench down to about 77 dB(A), close to the 76 dB(A) target of Chapter 4, and to quieten the compressor itself for the maintenance fitter.

The room equation gives a different picture. The reverberant field falls by 5.7 dB, which is the most the treatment can achieve anywhere. At the bench, where direct sound still contributes, the level falls by about **3.6 dB**, to about 83.2 dB(A). At 1 m from CP-30, it falls by about **0.6 dB**. Nowhere does it approach 10 dB.

```figure
type: bars
title: Reduction from the roof absorber, by position, dB
unit: dB
max: 11
caption: This is an illustration. The promised 10 dB would need roughly a tenfold increase in the room constant; this treatment increases it about 3.7 times.
- Promised | 10.0
- Reverberant field, the most achievable | 5.7
- *At the fitter's bench, 4 m | 3.6
- Servicing CP-30, 1 m | 0.6
```

A 10 dB fall in the reverberant field needs the room constant to increase tenfold. The bare workshop's R of 115.5 m² would have to become about 1,155 m², which in this room means treating most of the walls and the roof with highly absorbent material, and even then the direct sound near CP-30 would not change. The supplier's "up to 10 dB" was not impossible in some room, a hard one with a very small initial absorption treated very extensively, but it was not a property of the product; it was a property of a room. The workshop installed the 300 m² treatment, because a 3.6 dB reduction at the bench, a shorter reverberation time and a quieter shop overall were worth its cost, but it recognised that the enclosure of Chapter 7 would still be needed. The general lesson is that absorption's benefit is a calculation for a particular room and a particular position, and that a single decibel figure attached to a product cannot be the answer.

## Doubling and diminishing returns

Because the reverberant reduction is 10 × log₁₀ of the ratio of room constants, doubling the absorption gives about 3 dB, and doubling again another 3 dB. The first treatment of a bare, hard room gives the best return; later treatments give less. This is an illustration. Doubling the workshop's treatment to 600 m² would raise R to about 905 m² and lower the reverberant field by about 8.9 dB in all, only about 3.2 dB more than the first 300 m², and the bench by about 4.9 dB in all. Beyond that point, money spent on the path at the source, an enclosure, buys far more.

## Where absorption is the right answer

Absorption is the right control when the receivers are in the reverberant field, when there are many sources spread round a room, and when the room's reverberation itself is part of the problem: a workshop where nobody can hear a warning or follow a conversation, a canteen, an open-plan office beside a plant area. It also helps every other control, because an enclosure's or a barrier's benefit is limited by the reverberant field the room builds up, as Chapter 6 shows. Inside an enclosure, absorption is essential, as Chapter 7 explains. It is the wrong control, used alone, for a single dominant machine with its operator close by.

## Measuring the room

The room's absorption can be estimated from its surfaces, as above, but it is better measured, because real buildings contain stacked materials, racking, vehicles and openings that no surface list captures. The usual method is to measure the reverberation time in each octave band: a loudspeaker plays broadband noise, the noise is switched off, and a meter records how fast the level decays; or an impulse, a balloon burst or a starting pistol, is recorded and the decay is analysed. Several source and microphone positions are averaged. Sabine's formula, run backwards, then gives the room's total absorption in each band: A ≈ 0.161 × V ÷ T₆₀.

This is an illustration. If the bare workshop's measured reverberation time at 1,000 Hz were 4.1 s, its absorption at that frequency would be about 0.161 × 2,688 ÷ 4.1 ≈ 106 m², matching the estimate. A measured value much lower than the estimate, say 2.5 s, would mean the room already had about 173 m² of absorption, from the stock on its racks perhaps, and the treatment's benefit would be smaller, because each square metre added is a smaller fraction of what is there. Measuring the reverberation time before and after a treatment is also the simplest way to verify that the absorber was installed and performs: the decay time is far less sensitive to background noise and machine operating conditions than a sound level is.

Sabine's formula is accurate for rooms with modest average absorption, up to about 0.3. For very absorbent rooms, other formulae give better estimates, and for long, low rooms such as many factory floors, where sound decays differently along the length than across the height, the simple room equation itself becomes approximate and computer models are used. The workshop's proportions, 24 × 16 × 7 m, are close enough to a box for the simple method to give a sound first estimate.

## Speech and warnings

A reverberant workshop is not only louder; it smears sound in time, so that each syllable of speech is overlaid by the reverberant tail of the one before. Speech that would be clear at a given level in a dead room becomes hard to follow in a live one, and people raise their voices, which raises the level further. Warning signals suffer the same way: a reversing alarm or a fire alarm that is clearly audible in a quiet, absorbent space can be masked in a hard, noisy one. The workshop's roof absorber, cutting the reverberation time from about 4.1 s to about 1.3 s, makes speech between the fitter and a colleague markedly easier and alarms more distinct, a benefit that a decibel figure at the bench does not show but the people in the shop notice at once.

## Band by band

The calculation above uses single A-weighted figures for clarity. A real design repeats it in each octave band, with the absorber's coefficients in each band and the room's existing absorption in each band, and adds the results. Because absorbers are weak at low frequencies, a band-by-band calculation shows the A-weighted improvement coming from the mid and high bands, and the 63 and 125 Hz bands changing little, exactly as the store room of Chapter 3 found. The design should report the low-frequency bands separately, so that nobody expects the treatment to touch a rumble.

## Where to put it

Absorption on the roof's underside is usually the most effective place in a workshop, because the roof is the largest surface, the sound from floor-standing machines strikes it, and it is out of reach of damage. Wall absorption near noisy machines helps the reflections that reach nearby work positions, and **hanging baffles**, absorbent panels hung vertically from the roof, can be added without covering the roof sheet and work well in tall buildings. In every case, the material must suit the environment: oily mist, dust, moisture and fire requirements all limit the choice, and an absorber that fills with dust or oil soon stops absorbing.

## Exercise: moving the bench

Instead of, or as well as, adding absorption, the workshop could move the fitter's bench from 4 m to 8 m from CP-30. Using this chapter's figures, what would the bench level be at 8 m in the bare workshop and with the roof absorber? Why is moving the bench less effective than the inverse square law suggests?

**Worked answer.** In the bare workshop, the level at 8 m is about **86.0 dB(A)**, only 0.8 dB below the level at 4 m. With the roof absorber, it is about **81.1 dB(A)**, 2.1 dB below the treated level at 4 m.

In open space, doubling the distance would lower the level by 6 dB. In the bare workshop, the bench is already in the reverberant field, which is the same at 4 m and 8 m, so moving the bench changes only the small direct part. Absorption makes moving worthwhile, because it lowers the reverberant field and enlarges the critical distance, so that distance begins to count again. The two measures work together: absorption first, then distance.
