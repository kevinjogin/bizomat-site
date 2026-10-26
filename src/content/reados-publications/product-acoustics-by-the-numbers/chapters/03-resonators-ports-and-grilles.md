---
book: product-acoustics-by-the-numbers
chapterSlug: resonators-ports-and-grilles
order: 3
title: "Resonators, ports and grilles"
description: "Find a Helmholtz resonance from a cavity and its neck, add the end corrections that short holes depend on, design a speaker grille, and catch a front-cavity peak predicted above the band."
draft: false
---

Put a volume of air behind a short neck and you have a resonator. The air in the neck is a mass; the air in the volume is a spring; together they resonate at one frequency, as anyone who has blown across the top of a bottle knows. Helmholtz resonators appear everywhere in products, mostly by accident: the space in front of a loudspeaker and the holes of its grille, the cavity in front of a microphone and its port, a gap behind a panel and the slot that leads to it. Sometimes they are designed in on purpose, as tuned absorbers or as the port of a vented enclosure. Either way, their frequency can be calculated, and the calculation depends on a detail that is easy to forget: the end corrections, which for the short necks of grilles and ports are larger than the necks themselves.

This chapter gives the Helmholtz resonance formula, explains end corrections, applies both to a speaker grille and its front cavity, and shows how resonators are used on purpose. The running case finds that AP-40's grille and front cavity were predicted to resonate at about 9.2 kHz, safely above the prompt band, because the end corrections were left out, and resonated in fact at about 6.7 kHz, inside it.

## The Helmholtz resonance

A cavity of volume V connected to the outside through a neck of area S and effective length L' resonates at:

```figure
type: formula
title: Helmholtz resonance with end corrections
formula: f_H = (c ÷ 2π) × √( S ÷ (V × L') );   L' ≈ L + 1.7 × a for a short round neck with flanged ends
caption: This is an illustration for AP-40's speaker grille: 48 holes of 1.5 mm diameter in a 1.5 mm faceplate, in front of a cavity of about 2 cm³. The end correction of about 0.85 a at each flanged end is a standard approximation.
- S | Total open area of the neck or holes, m²
- V | Cavity volume, m³
- L | Physical length of the neck, the plate thickness for a grille, m
- a | Radius of each hole, m
step: S = 48 × π × 0.00075² ≈ 84.8 mm²
step: Without end corrections, L' = 1.5 mm: f_H ≈ 9.2 kHz
step: With them, L' ≈ 1.5 + 1.7 × 0.75 ≈ 2.78 mm: f_H ≈ 6.7 kHz
```

The formula follows directly from the acoustic circuit of Chapter 2: the neck's acoustic mass ρL' ÷ S in series with the cavity's compliance V ÷ ρc², resonating where their impedances are equal. Several holes in parallel act as one neck with the total area, provided they are close together and lead into the same cavity.

## End corrections

The air that moves with a neck is not only the air inside it. A little air just outside each end moves with it too, as if the neck were longer, and the resonator behaves as though its neck had an **effective length** L' longer than its physical one. For a round neck opening into a large space through a flange, the extra length at that end is about 0.85 times the neck's radius; for an unflanged open end it is about 0.61 times. A hole in a plate, opening into a cavity on one side and the room on the other, is roughly flanged at both ends, so L' ≈ L + 1.7a.

For a long neck the correction is a small adjustment. For the short holes of a grille it dominates: a 1.5 mm hole in a 1.5 mm plate has an end correction of about 1.28 mm, nearly doubling its effective length. Holes close together interact and reduce the correction somewhat, and their exact value is refined by measurement, but leaving it out altogether is a large error.

## The running case: AP-40's speaker grille

This is an illustration. AP-40's prompt speaker sits behind its faceplate, with a small **front cavity** of about 2 cm³ between the cone and the plate. The plate is 1.5 mm thick and perforated with 48 holes of 1.5 mm diameter over the cone, an open area of about 12% of the grille's 30 mm diameter. The front cavity and the holes form a Helmholtz resonator that the speaker drives directly. Below its resonance, the grille passes sound almost unchanged; near it, the response rises to a peak; above it, the response falls away steeply. The design aim is to put the resonance above the prompt band's upper limit of 8 kHz, so that the band is unaffected.

## The error: the end corrections left out

The first grille design was checked with the Helmholtz formula using the plate's thickness as the neck length, L = 1.5 mm, and gave a resonance of about **9.2 kHz**, comfortably above 8 kHz. The first prototype's prompts sounded harsh and sibilant, and a response measurement showed a peak of several decibels at about **6.7 kHz**, inside the band, where hearing is sensitive and sibilants live.

```figure
type: bars
title: AP-40's grille and front-cavity resonance, kHz
unit: kHz
max: 12
caption: This is an illustration. Leaving out the end corrections put the resonance above the band; including them put it inside. The redesign moved it to about 11.7 kHz.
- Predicted without end corrections | 9.2
- Prompt band upper limit | 8.0
- *As built, with end corrections | 6.7
- Redesign: 72 holes, 1 cm³ front cavity | 11.7
```

With the end corrections, the effective neck length was about 2.78 mm, not 1.5 mm, and the resonance about √(1.5 ÷ 2.78) ≈ 0.73 times the first prediction. The check that would have caught it is simply to include the end corrections in every short-neck calculation; a neck shorter than its own diameter is almost all end correction. The redesign attacked both terms of the formula: a gasket moved the speaker closer to the plate, halving the front cavity to about 1 cm³, and the grille was perforated with 72 holes instead of 48, raising the open area to about 18%. Together they moved the resonance to about **11.7 kHz**, well above the band. The general lesson is that a grille and the space behind it are a resonator whether or not the designer intended one, and that its frequency must be calculated with effective, not physical, lengths.

## Open area and the grille

The calculation shows why grille open area matters so much. The resonance rises with the square root of the open area, so doubling the area raises it by about 41%, and falls with the square root of the cavity volume. A grille with small open area and a deep front cavity resonates low and also adds acoustic mass that rolls off the high frequencies; a grille with large open area over a shallow cavity is nearly transparent. Grille fabric and mesh behave differently: their many fine openings add little mass but some resistance, which damps resonances and slightly reduces the level. Many products combine a perforated metal or plastic grille for strength with a fabric or mesh behind it, and the combination is modelled as a mass and a resistance in series.

Industrial design often wants small, few or patterned holes for appearance, and water and dust protection want small holes and membranes. Each of those wishes has an acoustic cost that the formula makes visible, so the compromise can be argued with numbers.

## Comparing grille options

The two terms of the formula, open area and cavity volume, give the designer two independent handles, and the options can be laid side by side before any tooling is cut.

```figure
type: compare
title: AP-40's grille and front cavity: resonance by option
cols: Open area | Front cavity | Resonance
caption: This is an illustration with 1.5 mm holes in a 1.5 mm plate and end corrections included. Resonances above about 10 kHz leave the 300 Hz to 8 kHz prompt band clear with margin.
- 48 holes, first design | 84.8 mm² | 2 cm³ | 6.7 kHz
- 72 holes | 127.2 mm² | 2 cm³ | 8.3 kHz
- 48 holes, shallower cavity | 84.8 mm² | 1 cm³ | 9.5 kHz
- *72 holes, shallower cavity | 127.2 mm² | 1 cm³ | 11.7 kHz
```

Seen together, the options show that neither change alone gives much margin, and that the combination does. They also show the industrial designer what is at stake: the 72-hole pattern is a visible change to the product's face, and the shallower cavity needs a gasket and a tighter tolerance on the speaker's position, so both are decisions for the whole team, made with the acoustic cost of each alternative in front of them.

## Membranes for water and dust

A product that must resist water or dust often puts a membrane behind its grille: a thin film or a microporous fabric that blocks liquid and particles but lets sound through. A membrane is not acoustically invisible. A thin film adds its own mass and stiffness, and a microporous one adds resistance; either way, the membrane becomes another element in the circuit, in series with the grille. Its makers publish its acoustic effect, usually as an insertion loss by frequency measured in a test fixture, and the effect depends on the area left exposed: a membrane stretched over a small hole adds more loss than the same material over a large one. A membrane also has a resonance of its own, set by its tension and mass, which can add a peak or a dip in the band if it falls there.

For AP-40, an indoor product, a dust mesh behind the grille is enough, and its resistance damps the front-cavity resonance a little, which is welcome. An outdoor product would need a waterproof membrane, and its insertion loss in the prompt band would have to be made up by a more sensitive driver or a higher drive level, a trade-off to settle in the requirements of Chapter 1 rather than discover in the prototype.

## Resonators on purpose

A Helmholtz resonator can be used to remove a tone. Attached to a duct as a side branch, it presents a very low impedance at its resonance and short-circuits the sound at that frequency, reflecting it back towards the source. Tuned to a fan's blade-passing frequency, it can remove a tone that broadband treatment barely touches.

This is an illustration. AP-40's fan has seven blades and, at 1,200 rpm, a blade-passing frequency of 7 × 20 = **140 Hz**. A side-branch resonator with a neck 20 mm across and 20 mm long, an effective length of about 37 mm, would need a cavity of about **1.3 L** to resonate at 140 Hz. The limits are clear from the numbers: the resonator works over a narrow band, so it suits a fixed speed, and AP-40's fan runs at several. At its night setting of 500 rpm, the blade-passing frequency is about 58 Hz, and a resonator for that would need about 7.4 L, larger than any space in the cabinet. For a variable-speed product, the better answer to a blade-pass tone is in the fan itself, as Chapter 9 shows.

## Ports in enclosures

The port of a vented loudspeaker enclosure is also a Helmholtz resonator: the port's air mass resonates with the box's air spring, and the designer tunes it to extend the low-frequency response, as Chapter 6 discusses. The same end corrections apply, with a flanged correction at the end that meets the baffle and an unflanged or partly flanged one inside the box. A port tuned without its end corrections resonates lower than intended, the opposite of the grille's error, because a long port's correction is a smaller fraction of its length but still lengthens it.

## Resonators that nobody designed

Resonators hide in products. A gap between a panel and the chassis, opening through a slot, can resonate when the fan's noise excites it; a battery compartment with a small vent can ring; the space behind a button can buzz. When a prototype has an unexpected peak or a whistle, the first suspects are any cavity connected to the outside through a narrow opening. The Helmholtz formula, with the cavity's volume and the opening's area and effective length, gives the frequency to look for, and the fix is usually to fill the cavity with foam, enlarge or close the opening, or add a little resistance with a mesh or felt. Tapping or blowing gently across a suspect opening with the product switched off, and listening for a note at the frequency the formula predicts, is a quick way to confirm the culprit before changing anything.

## Damping a resonance

Not every resonance can be moved out of the band, and some, such as a vented enclosure's port, are wanted. Where a resonance must stay, it can be damped. A layer of acoustic mesh across the holes adds resistance in series with the neck's mass, lowering and broadening the peak; a little porous foam in the cavity adds loss to the spring. The resonator's **quality factor**, the ratio of its centre frequency to the width of its peak, falls as resistance is added, and a well-damped grille resonance might rise only a decibel or two instead of several. Too much resistance, though, lowers the level across the whole band above it, so the mesh's resistance is chosen by trial against the response measurement.

## Exercise: a smaller cavity alone

Suppose the redesign could only reduce the front cavity from 2 cm³ to 1 cm³, keeping the original 48 holes. What would the resonance be? Would it clear the prompt band?

**Worked answer.** The resonance rises with the inverse square root of the volume, so halving the volume raises it by √2: about 6.7 × 1.414 ≈ **9.5 kHz**, which a direct calculation with the formula confirms. That clears the 8 kHz band edge by about 1.5 kHz.

It would work, but with less margin than the full redesign's 11.7 kHz. A resonance peak has width: its rise begins below the resonance itself, so a peak at 9.5 kHz may still lift the response near 8 kHz by a decibel or so, depending on its damping. The combination of a smaller cavity and more open area, or the addition of a damping mesh, gives a flatter band edge, and the measurement of the prototype, not the formula, has the last word. The formula's job is to make sure the prototype is close enough that the measurement confirms a design rather than starting one.
