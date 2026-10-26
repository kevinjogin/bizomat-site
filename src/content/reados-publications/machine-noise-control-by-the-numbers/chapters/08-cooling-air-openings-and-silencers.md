---
book: machine-noise-control-by-the-numbers
chapterSlug: cooling-air-openings-and-silencers
order: 8
title: "Cooling air, openings and silencers"
description: "Size the air openings an enclosed machine needs, see how they limit the enclosure, estimate a lined silencer's attenuation, and catch an enclosure quoted at its sealed figure with plain louvres."
draft: false
---

Most machines worth enclosing produce heat, and their enclosures need air. A compressor, a generator, a hydraulic power pack or a fan rejects most of the power it draws as heat, and an enclosure that traps it soon trips the machine or shortens its life. The air must come in through one opening and go out through another, and Chapter 7 showed that openings are the weakest acoustic path of all: a few per cent of open area can halve an enclosure's insertion loss. The answer is to make the air pass through **silencers**, lined passages that let air flow freely but absorb the sound travelling with it.

This chapter works out how much air CP-30's enclosure needs, how large its openings must be, what those openings do to the enclosure if they are left plain, and how much a lined silencer recovers. The running case finds that the enclosure was first quoted at its sealed insertion loss of about 20.9 dB and supplied with plain weather louvres over its air openings, which gave about 11.9 dB.

## How much air

The air flow needed to carry heat out of an enclosure follows from the heat load and the temperature rise allowed:

```figure
type: formula
title: Cooling air flow and a lined passage's attenuation
formula: q ≈ P ÷ (ρ × c_p × ΔT);   attenuation per metre ≈ 1.05 × α^1.4 × (perimeter ÷ area)
caption: This is an illustration for CP-30 rejecting about 30 kW with a 10 K rise in air temperature through the enclosure. The attenuation formula is a long-established empirical approximation for lined ducts at mid frequencies; silencer makers' measured data replace it for design.
- P | Heat rejected inside the enclosure, W
- ρ, c_p | Density and specific heat of air, about 1.2 kg/m³ and 1,005 J/(kg·K)
- ΔT | Temperature rise allowed, K
- α | Absorption coefficient of the lining in the band
step: q ≈ 30,000 ÷ (1.2 × 1,005 × 10) ≈ 2.49 m³/s
step: At 3 m/s through each opening: about 0.83 m² for the inlet and 0.83 m² for the outlet
step: Together about 6.3% of the enclosure's 26.4 m² of walls and roof
```

Many compressors are built to draw cooling air in at one side and blow it out at another, and their makers state the air flow, the maximum inlet temperature and the static pressure the machine's own fan can overcome. Those figures, not an estimate, should set the openings and the silencers, because a silencer that the fan cannot push enough air through will overheat the machine as surely as no opening at all.

## What plain openings do

An opening of 6.3% of the enclosure's area, left open, caps the enclosure's transmission loss at about 12 dB in every band, because the power escaping through the openings swamps what passes through the panels. This is an illustration. With CP-30's lined panels and two open holes, the A-weighted insertion loss falls from about 20.9 dB sealed to about **10.1 dB**. Weather louvres, which keep out rain and leaves but offer almost no acoustic resistance, change little: at an illustrative 2 dB of transmission loss, the enclosure gives about **11.9 dB**.

## The error: the sealed figure on the quote

This is an illustration. The revised enclosure of Chapter 7, lined and sealed, was quoted by its supplier with an insertion loss of "about 21 dB", the figure for the sealed box. Its two cooling openings, each about 0.83 m², were fitted with plain weather louvres, because the specification had asked for "louvred openings for cooling air" without saying they must be acoustic. Measured in the workshop, the compressor's contribution at the bench fell from 86.8 to about **74.9 dB(A)**, a reduction of about 11.9 dB, not the 20.9 dB the quote implied.

```figure
type: bars
title: CP-30's enclosure with cooling openings: A-weighted insertion loss, dB
unit: dB
max: 22
caption: This is an illustration. The quote's 20.9 dB applied only to a sealed box; plain louvres over 6.3% of the area gave 11.9 dB, and 1.2 m lined splitter silencers recovered most of the difference.
- Sealed box, as quoted | 20.9
- Openings left open | 10.1
- Plain weather louvres | 11.9
- 0.6 m lined splitter silencers | 15.7
- Acoustic louvres | 19.2
- *1.2 m lined splitter silencers | 19.0
```

The result just met the workshop's target of 76 dB(A) at the bench, with about a decibel to spare, but it was far from the promise, and it left the maintenance fitter and the store room little better off. The check that would have caught it was a composite calculation of the enclosure with its openings and their treatments, attached to the quote, which showed at once that the openings set the result. The fix was to replace the louvres with lined splitter silencers. The general lesson is that an enclosure's insertion loss must be quoted with its ventilation in place, and that a specification for "louvred openings" has specified weather protection, not noise control.

## Silencers

A **dissipative silencer** is a passage lined with absorbent material, usually divided into several parallel channels by absorbent **splitters**, through which the air flows while the sound travelling with it is absorbed by the lining. Its attenuation rises with its length, with the lining's absorption and with the ratio of lined perimeter to open area, which is why narrow channels between thick splitters work well.

This is an illustration. A splitter silencer with 150 mm air channels between 100 mm splitters, whose lining has illustrative absorption coefficients of about 0.2 at 63 Hz, 0.45 at 125 Hz, 0.8 at 250 Hz and 0.9 to 0.95 at mid frequencies, has a perimeter-to-area ratio of about 2 ÷ 0.15 ≈ 13.3 per metre. By the approximation above, 1.2 m of it attenuates about 2 dB at 63 Hz, 6 dB at 125 Hz, 12 dB at 250 Hz and about 15 to 16 dB from 500 to 2,000 Hz.

```figure
type: compare
title: CP-30's enclosure with 1.2 m splitter silencers, by octave band
cols: Silencer attenuation | Enclosure TL with silenced openings | Enclosure insertion loss
caption: This is an illustration. The silencers raise the openings' transmission loss to roughly the panels' level at mid frequencies; at low frequencies, neither silencer nor panel does much. The A-weighted insertion loss is about 19.0 dB.
- 63 Hz | 1.8 dB | 7.6 dB | 0 dB
- 125 Hz | 5.5 dB | 12.9 dB | 6.1 dB
- 250 Hz | 12.3 dB | 19.1 dB | 16.2 dB
- 500 Hz | 15.6 dB | 24.2 dB | 22.9 dB
- *1,000 Hz | 15.6 dB | 26.5 dB | 25.5 dB
- 2,000 Hz | 14.5 dB | 26.3 dB | 25.3 dB
- 4,000 Hz | 12.3 dB | 24.3 dB | 23.3 dB
- 8,000 Hz | 10.2 dB | 22.2 dB | 21.2 dB
```

With 1.2 m silencers at inlet and outlet, the enclosure's A-weighted insertion loss is about **19.0 dB**, and CP-30's contribution at the bench about **67.8 dB(A)**, well under the 76 dB(A) target. With the roof absorber of Chapter 5 as well, it is about 64.2 dB(A). Shorter, 0.6 m silencers give about 15.7 dB; acoustic louvres, which are short, deep-bladed lined louvres, give about 19.2 dB in this illustration and take less space, though real acoustic louvres' data should be compared with silencers' for each case.

## Reading a silencer maker's data

Silencer makers publish three sets of figures for each model, and a selection needs all three. The **insertion loss** by octave band, measured with air flowing, sometimes called dynamic insertion loss, is the acoustic performance. The **pressure drop** at each face velocity is the cost in fan power. And the **self-generated noise**, the sound produced by the air itself rushing through the channels, sets a floor below which the silencer cannot reduce the level, however long it is. Self-generated noise rises steeply with velocity, which is another reason to keep face velocities modest. A silencer chosen for its insertion loss at a velocity well above the one it will run at may be fine; one chosen at a lower velocity than it will see may be noisier than expected and too restrictive for the fan.

## High frequencies and beaming

At high frequencies, where the wavelength is small compared with the channel width, sound can travel straight down the middle of a silencer's channels without touching the lining, a behaviour called **beaming**, and the attenuation falls below what the simple formula suggests. Silencers for high-frequency noise use narrower channels, bends or staggered splitters so that there is no straight line of sight through. CP-30's noise is strongest in the mid bands, where the formula is most reliable, but the silencer maker's measured data, which include beaming, should be used in a real design.

## Pressure drop and air flow

A silencer resists air flow as well as sound. Its pressure drop rises roughly with the square of the face velocity, so a silencer sized for 3 m/s has about a quarter of the pressure drop of one sized for 6 m/s, but is twice the face area. The compressor's cooling fan must overcome the silencers' pressure drop at inlet and outlet together, plus the louvres and grilles, and still deliver its rated air flow. If it cannot, the silencers must be larger, or an auxiliary fan must be added, which is itself a noise source to be included in the calculation. The silencer maker's data give the pressure drop at each face velocity, and the compressor maker's data give what the fan can deliver.

## Where the air goes

The hot air from CP-30's outlet must go somewhere. Discharged into the workshop, it adds about 30 kW of heat, welcome in winter and unwelcome in summer. Ducted outdoors through the wall, it relieves the workshop's summer heat, but the duct's outlet becomes a noise source outdoors, which may matter to neighbours, and its silencer must then be sized for the outdoor receiver too. For CP-30, the outlet silencer discharges into a short duct to the outside wall, with the duct lined for its last metre, and the inlet draws from inside the workshop through its own silencer, so that the workshop's air, not cold outdoor air, feeds the compressor in winter.

## Other openings

Air openings are the largest openings in most enclosures, but not the only ones. Cable and pipe entries need glands, drains need traps or lined sleeves, and inspection windows need double glazing sealed into their frames. Each should be listed with its area and its treatment, and the composite calculation should include them, because a list of small openings totalling a fraction of a per cent can take a decibel or two off the result, as Chapter 7 showed.

## Reactive silencers for low frequencies and tones

Dissipative silencers rely on absorbent material, and like every porous absorber they are weak at low frequencies, which is why the table above shows only about 2 dB at 63 Hz. **Reactive** silencers work differently: they use changes of cross-section, chambers and side branches to reflect sound back towards its source. An **expansion chamber**, a sudden enlargement of a pipe followed by a contraction, reflects sound over bands set by its length; a **Helmholtz resonator**, a cavity connected to the duct by a short neck, removes a narrow band around its tuned frequency. Reactive silencers suit low-frequency and tonal noise in pipes and ducts with modest flow, such as engine exhausts and the pulsations in a compressor's intake or discharge pipework, and many practical silencers combine reactive chambers with absorbent linings to cover a wide range. Their design is a specialised calculation, and makers' data or tests are used for real installations.

## The compressor's own small noises

Some of CP-30's noise does not come through the cooling openings at all. Its **condensate drain**, which periodically blows water out of the air system, releases a short, sharp burst of compressed air that can be among the loudest events in the workshop and a source of peak noise. Its **blow-down** at shutdown, and the **safety valve** on the air receiver, behave the same way. Each should discharge through a muffler or into a drain separator designed for it, and the receiver, which is often outside the enclosure, should be checked as a source in its own right. The air distribution system also carries noise: air leaking from fittings and blow-guns used for cleaning can each exceed the compressor's level at the person using them. Fixing leaks saves energy and noise together.

## Checking the result

After the silencers were fitted, the workshop checked two things. The acoustic result was measured at the bench and at 1 m from the enclosure, with CP-30 loaded and with it stopped to correct for background, as Chapter 10 describes. The thermal result was checked by logging the air temperature inside the enclosure and at the compressor's inlet over a hot day at full load, against the maker's maximum inlet temperature, because a silenced enclosure that overheats the compressor in January has failed whatever its decibels. Both results were recorded with the enclosure's design calculation, so that a later change, a larger compressor or a blocked silencer, can be checked against them.

Silencers need maintenance too. Their linings can be damaged by handling or clogged by dust and oil mist, and their facings can corrode. A silencer whose channels are partly blocked restricts air flow and raises the compressor's temperature; one whose lining has been torn out of its facing loses its attenuation. A visual check at each service, and a temperature log that shows a rising trend, catch both before they matter.

## Exercise: halving the silencers

Space at CP-30's end of the workshop is tight, and the supplier proposes 0.6 m silencers instead of 1.2 m. Using the same approximation, about how much attenuation would each give at 1,000 Hz, what would the enclosure's A-weighted insertion loss become, and would the target still be met?

**Worked answer.** Attenuation is proportional to length, so 0.6 m gives about half: about **7.8 dB** at 1,000 Hz instead of 15.6 dB. The enclosure's A-weighted insertion loss falls to about **15.7 dB**, and CP-30's contribution at the bench rises to about **71.1 dB(A)**, still under the 76 dB(A) target, or about 67.5 dB(A) with the roof absorber.

The shorter silencers would meet the target with less margin. The choice depends on what else must be achieved: the store room's low-frequency rumble, the maintenance fitter's exposure and any outdoor receiver. A silencer is the one part of the enclosure where extra length buys decibels directly, so if space can be found, the 1.2 m units are the better choice.
