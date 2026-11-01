---
book: random-vibration-by-the-numbers
chapterSlug: isolating-the-enclosure
order: 5
title: "Isolating the enclosure"
description: "Choosing isolators against both a machine tone and broadband random vibration: frequency ratio and transmissibility, the isolator tool, Miles' response on soft mounts, sway space, damping and run-up."
draft: false
---

An isolator is a deliberate resonance. Putting an enclosure on soft mounts creates a mass-spring system with a low natural frequency, and above about 1.4 times that frequency the mounts transmit less vibration than they receive. Below it they transmit all of it, and near it they amplify. Isolation therefore works only if the natural frequency sits well below everything the enclosure needs protecting from, and it fails badly if it lands on top of a strong excitation. Random vibration, spread over a broad band, is forgiving of the exact choice; a machine tone, concentrated at one frequency, is not.

This chapter tells the story of CB-7's mounts. It starts with the field failures that followed from mounts resonating at the engine's frequency, uses the WORKOS isolator selection tool to choose mounts that isolate the tone, checks the enclosure's random response and sway on the softer mounts with Miles' equation, and sets out what damping, rocking modes and engine run-up add to the picture.

## The error: mounts tuned to the engine

This is an illustration. CB-7 was first mounted on four stiff rubber bushes, giving a natural frequency of about 25 Hz with Q = 4. Chapter 4 found that on the random profile alone this was a reasonable mounting: 1.40 g RMS at the enclosure against 2.55 g at the frame. Within a few weeks of operation, two plants reported loose terminal screws in CB-7, and one a cracked bush.

The measurement of Chapter 3 found the cause: a tone at 25 Hz, 0.80 g peak, from the diesel engine running at 1,500 rpm. The mounts' natural frequency coincided with it. A sine input at a resonance is amplified by Q, not by √Q, so the enclosure was shaken at 4.1 × 0.80 = 3.3 g peak at 25 Hz, continuously, on top of its random response. The enclosure moved 1.27 mm peak relative to the frame at that frequency, every cycle, 25 times a second, for every hour the engine ran. Terminals loosened and the bush fatigued.

```figure
type: compare
title: CB-7's response to the engine tone on two mountings
cols: Natural frequency, Hz | Frequency ratio at 25 Hz | Transmissibility | Enclosure acceleration, g peak | Relative motion, mm peak
rowhead: Mounting
caption: This is an illustration. Engine tone 0.80 g peak at 25 Hz; mount damping ratio 0.125. The stiff bushes put the resonance on the tone; the soft mounts put the tone well into the isolation region.
- * Stiff bushes, as first built | 25.0 | 1.00 | 4.12 | 3.30 | 1.27
- Soft mounts, 15 N/mm each | 9.19 | 2.72 | 0.19 | 0.15 | 0.37
```

The random specification had been met, and the design had still failed, because the specification did not include the tone. Nobody had measured the frame before the specification was written; it had been adapted from a profile for road transport, which has no engine tone of this kind. The revised specification lists the engine's speed range and tone amplitude as a separate sine requirement, and every new mounting is checked against both.

## How isolation works

The transmissibility of Chapter 4, |H|, depends on the frequency ratio r = f ÷ fₙ and the damping. At r = 1 it equals about Q; at r = √2 it equals exactly one whatever the damping; above √2 it falls, roughly as 1 ÷ r² for light damping. Isolation efficiency is 1 − T: the share of the vibration the mounts keep out. The chapter on [isolating a fan on springs](/reados/publications/vibrating-machine-elements-by-the-numbers/isolate-the-fan-on-springs/) in Vibrating Machine Elements by the Numbers works the same transmissibility curve for a machine whose own running speed is the forcing. To isolate a tone at frequency f by a given efficiency, the mounts' natural frequency must sit a corresponding factor below f.

The [vibration isolator selection tool](/tools/vibration-isolator-selection/) does this calculation. From the machine's mass on the mounts, the number of mounts, the lowest running speed of the forcing, the target isolation and the mounts' damping ratio, it finds the frequency ratio needed, the natural frequency, the static deflection and the stiffness per mount that achieve the target; for a chosen mount stiffness it gives the actual natural frequency, transmissibility and isolation, and it warns near resonance. It models a single vertical degree of freedom.

```figure
type: stats
title: CB-7's mounts from the isolator selection tool
caption: This is an illustration. 18 kg on 4 mounts, forcing at 1,500 rpm (25 Hz), target isolation 80%, damping ratio 0.125; then a chosen catalogue mount of 15 N/mm.
- 2.64 | Frequency ratio needed | for 80% isolation with ζ = 0.125
- 9.48 Hz | Natural frequency needed | 25 ÷ 2.64
- 2.76 mm | Static deflection needed | 16.0 N/mm per mount
- * 9.19 Hz, 81.2% | Chosen 15 N/mm mounts | transmissibility 0.188
```

The 15 N/mm catalogue mount gives 9.19 Hz and 81.2% isolation at 25 Hz, meeting the target. Its rated load per mount comfortably exceeds CB-7's 44 N share of the weight, including the dynamic loads of the next sections. Its static deflection under CB-7's weight is 18 × 9.807 ÷ 4 ÷ 15 = 2.94 mm, which is also a quick way to check a mount in place: measure how far the enclosure sinks when it is lowered onto it.

## Static and dynamic stiffness

Catalogue stiffness figures for elastomer mounts are usually static: measured by loading the mount slowly. Rubber is stiffer when it is deflected quickly, and the dynamic stiffness that governs vibration is often noticeably higher than the static figure; makers publish a dynamic-to-static ratio for their compounds. The difference matters because the natural frequency varies with the square root of stiffness.

This is an illustration. If the 15 N/mm mount's dynamic stiffness were 1.3 times its static value, the natural frequency would be 9.19 × √1.3 = 10.5 Hz, the frequency ratio at 25 Hz 2.39, and the isolation 75.4% instead of 81.2%, below the target. The design check should use the dynamic stiffness at the expected amplitude and frequency, from the maker's data, and the installed mounting should be measured, as below. For CB-7, the maker's data gave a ratio close to 1.05 for the chosen compound, and the measured natural frequency in place was 9.4 Hz, which kept the isolation at about 80%.

Elastomers also change with temperature and age. Cold stiffens them, sometimes a great deal below freezing; heat and time soften some compounds and harden others. A mounting on a quarry plant that works through frosty mornings and hot afternoons, near a warm engine, should be checked at the stiffness the maker gives for its coldest and hottest conditions, because the coldest morning gives the highest natural frequency and the least isolation.

## Random response on soft mounts

The softer mounts change the random response too. On 9.19 Hz mounts with Q = 4, the resonance sits in the low-frequency part of CB-7's profile, where the input PSD is only 0.0046 g²/Hz. Miles' equation gives the enclosure √(1.5708 × 9.19 × 4 × 0.0046) = 0.52 g RMS, against 1.40 g on the stiff bushes and 2.55 g at the frame. Above the resonance, the mounts attenuate everything: at the circuit board's 180 Hz, the transmissibility is 0.013, and Chapter 6 follows that into the enclosure.

The price is motion. The enclosure's random relative displacement on its mounts rises from 0.56 mm RMS to 1.52 mm RMS, 4.5 mm at 3σ, because the same acceleration at a lower frequency means more movement, as Chapter 1 showed.

## Sway space

Soft mounts need room. The enclosure must be able to move on its mounts without striking the frame, a neighbouring panel or its own cable entries, under every load it meets: the static sag, the random response at 3σ, the engine tone, and shocks from towing or from rock striking the screen.

```figure
type: steps
title: CB-7's vertical clearance budget on 15 N/mm mounts
caption: This is an illustration. Each term from this chapter; the shock term is an allowance from towing measurements, not calculated here. Cables and hoses must have slack for the same movement.
- Static deflection under weight | 2.9 mm, taken up at installation
- Random response, 3σ | 4.5 mm
- Engine tone at 25 Hz | 0.4 mm peak
- Towing shock allowance | 6 mm
- * Clearance provided | 15 mm all round, with snubbers at 12 mm to limit travel in a severe shock
```

Snubbers, stops that the enclosure meets only in an unusually large movement, protect the mounts and the surroundings from shocks without stiffening the mounting in normal running. Cable entries need loops long enough for the full travel; a cable pulled tight by sway becomes a stiff spring that bypasses the isolators and carries vibration straight in.

## Tone and random together

The two requirements pull the mounting in the same direction but not by the same amount. For the tone, the natural frequency must sit far enough below 25 Hz to give the isolation required, and the lower it is, the better. For the random profile, a lower natural frequency also lowers the enclosure's acceleration, because the resonance moves to where the input is weak, but it raises the sway. Somewhere the sway, the cable slack, the static sag and the mounts' load capacity set a lower limit on the natural frequency, and the design sits between that limit and the one the tone sets.

```figure
type: compare
title: CB-7's mountings against both requirements
cols: Isolation of the 25 Hz tone | Random response, g RMS | Random sway, 3σ, mm
rowhead: Mounting
caption: This is an illustration, from Miles' equation and the transmissibility with ζ = 0.125. The 15 N/mm mount meets the tone target with sway that a 15 mm clearance accommodates.
- Stiff bushes, 25 Hz | amplifies 4.1 times | 1.40 | 1.7
- 25 N/mm mounts, 11.9 Hz | 67.5% | 0.67 | 3.5
- * 15 N/mm mounts, 9.2 Hz | 81.2% | 0.52 | 4.5
```

## Damping: a trade

More damping lowers the resonant peak and raises the transmissibility above it. With ζ = 0.25 instead of 0.125, Q falls from 4 to 2, but the transmissibility at 25 Hz rises from 0.19 to 0.26 and at 180 Hz from 0.013 to 0.026: twice as much high-frequency vibration gets through. For CB-7, whose mounts sit well below every strong excitation, light damping is the better choice. Heavier damping suits mountings that must pass through their resonance often, during run-up or under shock, where the peak matters more than the isolation.

## Rocking, run-up and idle

The tool's single vertical model is the right first step, and three refinements follow. First, an enclosure on four mounts has six rigid-body modes, three translations and three rotations, and if the mounts are not arranged symmetrically about the centre of gravity, vertical vibration excites rocking. Mounting in the plane of the centre of gravity, or choosing mount positions that decouple the modes, keeps the vertical model honest; otherwise each mode's frequency must be checked against the tone.

Second, the engine does not start at 1,500 rpm. It passes through the mounts' 9.19 Hz, about 550 rpm, every time it starts and stops. A brief passage through resonance is usually harmless, because the response needs many cycles to build up, but a slow run-up or a long stop with the engine labouring near that speed would not be. Third, the engine idles at 800 rpm, 13.3 Hz, a frequency ratio of only 1.45: barely above √2, with a transmissibility of about 0.91. At idle the mounts neither isolate nor amplify much. The operators were asked not to leave the plant idling for long periods, and the plant's controller now raises the idle speed after a few minutes.

The horizontal directions need the same checks. Elastomer mounts are usually softer in shear than in compression, so CB-7's horizontal natural frequencies on the same mounts are lower than its vertical one, which is good for isolation and bad for sway. The towing condition, with its braking and cornering, loads the mounts sideways more than the screening does. CB-7's horizontal frequencies, about 6 Hz from the mount maker's shear stiffness, were checked against the engine tone, which they isolate well, and against the clearance budget, which needed the same 15 mm sideways as vertically. A mounting checked in one axis only has been checked a third of the way.

## Measuring the installed mounting

A mounting should be checked in place, because the installed natural frequency depends on the real mount stiffness, the real mass and centre of gravity, the stiffness of the frame under the mounts and anything else, such as cables, that connects the enclosure to the frame. The simplest check is a transmissibility measurement: one accelerometer on the frame beside a mount and one on the enclosure directly above it, recorded together while the plant runs. The ratio of their spectra, frequency by frequency, is the installed transmissibility; its peak gives the natural frequency and Q, and its value at 25 Hz gives the isolation of the tone directly.

This is an illustration. On the first plant fitted with the new mounts, the measured transmissibility peaked at 9.4 Hz with a value of about 4, and fell to 0.20 at 25 Hz, an isolation of 80%. Above 100 Hz it fell into the noise of the measurement, as it should. A second plant showed a peak at 14 Hz and only 40% isolation at 25 Hz; the cause was a hydraulic hose clamped tightly to both the enclosure and the frame, acting as a stiff spring in parallel with the mounts. Re-routing it with a slack loop brought that plant into line. The measurement takes an hour and catches problems that no calculation can.

## Exercise: a stiffer catalogue mount

A cheaper mount of 25 N/mm is offered. For CB-7, find the natural frequency, the frequency ratio at 25 Hz, the transmissibility and the isolation, using T = √[(1 + (2ζr)²) ÷ ((1 − r²)² + (2ζr)²)] with ζ = 0.125. Does it meet the 80% target, and what would its random response be? The input PSD at 11.9 Hz is 0.0059 g²/Hz.

**Worked answer.** This is an illustration. The natural frequency is √(4 × 25,000 ÷ 18) ÷ 2π = 74.5 ÷ 6.283 = **11.86 Hz**, the frequency ratio 25 ÷ 11.86 = **2.11**, and the transmissibility **0.325**, an isolation of **67.5%**: short of the 80% target, as the isolator tool reports. The enclosure's random response would be √(1.5708 × 11.86 × 4 × 0.0059) = **0.67 g RMS**, a little higher than on the 15 N/mm mounts, with a 3σ relative displacement of about 3.5 mm. The cheaper mount reduces the sway but lets through nearly twice as much of the engine tone; the 15 N/mm mount stays.
