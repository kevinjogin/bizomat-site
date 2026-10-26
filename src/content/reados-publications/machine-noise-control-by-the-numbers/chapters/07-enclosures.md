---
book: machine-noise-control-by-the-numbers
chapterSlug: enclosures
order: 7
title: "Enclosures: mass, lining and leaks"
description: "Estimate a panel's transmission loss by the mass law, turn it into an enclosure's insertion loss with an absorbent lining, see what gaps cost, and catch an enclosure built without a lining."
draft: false
---

An enclosure is the most powerful control for a single noisy machine. It surrounds the source with panels that reflect most of its sound back inwards and let little through, so that the sound power escaping into the room falls by 10, 20 or more decibels. Both the direct and reverberant sound at every position in the room fall with it, which is what absorption and barriers could not achieve. But an enclosure's performance depends on three things that are easily got wrong: the panels must be heavy enough, the inside must be lined with absorbent material, and there must be no gaps. A heavy enclosure with a bare inside, or a lined one with leaks, can lose half or more of its potential.

This chapter estimates a panel's transmission loss from its mass, shows how the enclosure's internal absorption turns transmission loss into insertion loss, and works out what gaps and openings cost. The running case finds that CP-30's first enclosure was built from plain steel panels with no lining, and achieved an A-weighted insertion loss of about 10.9 dB, when the same panels lined with 50 mm of mineral wool would achieve about 20.9 dB.

## Transmission loss and the mass law

A panel's **transmission loss**, TL, is the ratio, in decibels, of the sound power striking it to the sound power passing through: TL = 10 × log₁₀(1 ÷ τ), where τ is the fraction transmitted. Over most of the frequency range that matters, a single solid panel's transmission loss is set mainly by its **surface mass**, its mass per square metre, and by frequency. Doubling either adds about 6 dB. This is the **mass law**.

```figure
type: formula
title: Transmission loss by the mass law, and enclosure insertion loss
formula: TL ≈ 20 × log₁₀(m × f) − 47 dB;   IL ≈ TL + 10 × log₁₀(ᾱ_inside), and never more than TL
caption: This is an illustration for 1.2 mm steel, about 9.4 kg/m², using the field-incidence form of the mass law. The insertion-loss estimate is a simple approximation for a close-fitting enclosure; the lining's average absorption coefficient, ᾱ_inside, decides how much of the panel's TL the enclosure delivers.
- m | Panel surface mass, kg/m²
- f | Frequency, Hz
- ᾱ_inside | Average absorption coefficient of the enclosure's inside surfaces
step: At 125 Hz: 20 × log₁₀(9.42 × 125) − 47 ≈ 14.4 dB
step: At 1,000 Hz: about 32.5 dB; at 4,000 Hz about 44.5 dB
step: With a lining averaging 0.80 at 1,000 Hz: IL ≈ 32.5 − 1.0 ≈ 31.5 dB
```

The mass law has limits at both ends. At low frequencies, a panel's stiffness and its resonances on its frame control its behaviour, and the transmission loss can be lower than the law predicts. At high frequencies, every panel has a **coincidence frequency**, where the wavelength of bending waves in the panel matches the wavelength of sound in air, and its transmission loss dips well below the law over a band around it. For 1.2 mm steel, coincidence lies near 10,000 Hz, above the range that matters here; for thicker or stiffer panels, such as 12 mm plasterboard or plywood, it falls in the speech range, and makers' measured data should be used.

## Why the lining matters

Inside a closed box, the sound that does not pass through the panels reflects back and forth, building up a reverberant field inside, just as in the workshop of Chapter 5 but much stronger, because the box is small. The sound pressure inside rises until the power leaking out through the panels balances the power the machine produces. The less absorption inside, the higher that internal level climbs, and the more sound is pushed through the panels.

The simple estimate IL ≈ TL + 10 × log₁₀(ᾱ_inside) captures the effect. With an absorbent lining averaging 0.80, the enclosure delivers almost all of its panels' transmission loss: 10 × log₁₀(0.80) ≈ −1.0 dB. With a bare steel inside averaging about 0.03, it loses about 15.5 dB of it. A heavy, bare enclosure is therefore a poor one: its mass is wasted on a reverberant interior.

## The running case: a lined enclosure for CP-30

This is an illustration. CP-30's enclosure is a box of 1.2 mm steel panels on a frame, about 2.6 × 2.0 × 2.3 m inside, giving room for service access, with walls and roof of about 26.4 m² and the concrete floor as its base. Its walls and roof are lined with 50 mm of mineral wool behind a perforated sheet facing. With the floor bare, the inside's average absorption coefficient is about 0.09 at 63 Hz, 0.21 at 125 Hz, 0.50 at 250 Hz and about 0.76 to 0.80 from 500 Hz up.

```figure
type: compare
title: CP-30's enclosure by octave band, sealed and lined
cols: Panel TL | Average ᾱ inside | Insertion loss, lined | Insertion loss, unlined
caption: This is an illustration by the mass law and the simple insertion-loss estimate, before cooling openings are added. At 63 Hz the estimate gives no useful reduction either way. A-weighted over CP-30's spectrum, the lined enclosure gives about 20.9 dB and the unlined one about 10.9 dB.
- 63 Hz | 8.5 dB | 0.09 | 0 dB | 0 dB
- 125 Hz | 14.4 dB | 0.21 | 7.7 dB | 0 dB
- 250 Hz | 20.4 dB | 0.50 | 17.5 dB | 5.0 dB
- 500 Hz | 26.5 dB | 0.76 | 25.2 dB | 11.0 dB
- *1,000 Hz | 32.5 dB | 0.80 | 31.5 dB | 17.0 dB
- 2,000 Hz | 38.5 dB | 0.80 | 37.5 dB | 23.0 dB
- 4,000 Hz | 44.5 dB | 0.80 | 43.5 dB | 29.0 dB
- 8,000 Hz | 50.5 dB | 0.80 | 49.6 dB | 35.1 dB
```

Applied band by band to CP-30's sound power, the lined enclosure lowers its A-weighted sound power from 100.3 to about **79.4 dB(A)**, an insertion loss of about **20.9 dB**, and the compressor's contribution at the bench from 86.8 to about **65.9 dB(A)**, well below the 76 dB(A) target. That is before the enclosure has any openings for cooling air, which Chapter 8 adds, and which take back much of the gain.

## The error: panels without a lining

This is an illustration. CP-30's first enclosure was ordered from a sheet metal shop as a box of 1.2 mm steel panels, with a door, to the same dimensions, and was delivered and installed without a lining: the order described the panels and the door but not the inside. In the workshop, it lowered CP-30's contribution at the bench by about **10.9 dB**, short of the 20.9 dB the same box would give lined, and only about the 11 dB the target needed, with no margin for the cooling openings still to come.

```figure
type: bars
title: CP-30 enclosure options: A-weighted insertion loss, dB
unit: dB
max: 22
caption: This is an illustration, before cooling openings. The lining doubles the enclosure's effect; gaps of a fraction of a per cent of its area take back several decibels.
- Unlined, sealed | 10.9
- *Lined, sealed | 20.9
- Lined, 0.5% of area open | 18.2
- Lined, 1% of area open | 16.5
- Lined, 5% of area open | 11.0
```

The check that would have caught it is the enclosure's insertion loss calculated band by band from the panels and the inside's absorption, attached to the order, so that the lining is part of the specification rather than an assumption. The fix was to line the walls and roof with 50 mm of mineral wool behind perforated steel, which the frame could accept without rebuilding the box. The general lesson is that an enclosure's mass and its lining work together, and an order for "an acoustic enclosure" that specifies only the panels has specified half of one.

## Gaps and openings

Sound passes through an opening almost completely, so a small open area can carry as much sound as a large solid one. The combined transmission loss of a wall with an open fraction f is TL_combined = −10 × log₁₀((1 − f) × τ_panel + f), and the open area sets an upper limit of 10 × log₁₀(1 ÷ f) however heavy the panels.

This is an illustration. For CP-30's lined enclosure, an open area of 0.1% of its 26.4 m², about 264 cm², the area of a few unsealed pipe and cable entries, lowers the A-weighted insertion loss from 20.9 to about **20.2 dB**. An open area of 0.5%, about 0.13 m², the gaps round an unsealed door, takes it to about **18.2 dB**. At 1%, the limit at high frequencies is 20 dB and the A-weighted insertion loss falls to about **16.5 dB**. At 5%, the panels' mass hardly matters and the enclosure gives about **11.0 dB**. Every penetration for pipes, cables and ducts needs a sealed gland or a lined sleeve, and every door needs compression seals on all four sides, including the threshold.

## Panels, frames and vibration

An enclosure's panels can be excited by the machine directly, through the frame or the floor, as well as by the airborne sound inside. A panel rigidly fixed to a frame that sits on the same floor as a vibrating machine radiates the vibration as sound, and the enclosure can become a loudspeaker. The machine should therefore stand on vibration isolators, as Chapter 9 explains, and the enclosure should not touch it: pipes and cables through the enclosure wall need flexible connections, and the enclosure's frame should not be fixed to the machine's base. Panels can also be damped, by a viscoelastic layer or a damping compound, which lowers their resonant response without much extra mass.

## Doors, access and service

CP-30 must be serviced, its filters changed and its oil checked, so its enclosure needs doors or removable panels large enough for the work, which must seal as well as the walls when closed. Interlocks, inspection windows and lighting inside help the service fitter, and the enclosure must be designed so that it is closed again after every service. An enclosure whose door is propped open because it is awkward to close achieves nothing, and the gaps table above shows why even a door left slightly ajar matters. A sign on the door, and a check in the service procedure, keep the enclosure working. Quick-release latches that pull the door onto its seals, rather than bolts that are left out after the first service, make the right thing the easy thing.

## Heat

A closed enclosure traps the machine's heat, and CP-30, drawing 30 kW, rejects most of that as heat. Without ventilation it would overheat in minutes. The cooling air must pass in and out through openings, which are exactly the kind of gaps that the table above shows to be fatal, unless they are silenced. Chapter 8 deals with them.

## Double walls and composite panels

Where a single panel is not enough, two panels separated by an air space filled with absorbent material give much more transmission loss than one panel of their combined mass, above a low-frequency resonance set by the masses and the air gap's stiffness. This is how partition walls in buildings achieve high ratings with modest mass. For machine enclosures, double-skinned composite panels, steel outer and perforated steel inner with mineral wool between, combine mass, lining and a second skin in one product, and their makers publish measured transmission loss by band, which should be used in place of the mass law.

## Close-fitting and walk-in enclosures

The simple estimate used here suits enclosures whose inside dimensions are a modest multiple of the machine's, where a reverberant field builds up inside. Very close-fitting enclosures, with only a few centimetres between machine and panel, behave differently at low frequencies: the trapped air layer acts as a spring between the machine's vibrating surfaces and the panel, and at some frequencies the enclosure can even make the noise worse. Close-fitting covers are therefore designed with makers' data and testing. At the other extreme, a walk-in enclosure or a separate plant room behaves like a small room, and the room equation of Chapter 5 applies inside it, with its walls' transmission loss deciding what escapes. CP-30's enclosure, about 2.6 × 2.0 × 2.3 m around a machine about 1.6 × 1.0 × 1.5 m, sits between the two, which is where the simple estimate is most useful.

## Specifying an enclosure

An order for an enclosure should describe its acoustic performance, not only its construction, and should cover everything the performance depends on:

- the **insertion loss** required in each octave band, or the sound power or sound pressure at stated positions with the machine running in a stated condition;
- the **panels**, their construction and their measured transmission loss by band;
- the **lining**: its material, thickness, facing and fire, oil and moisture properties;
- **seals** for every door and removable panel, and sealed glands or lined sleeves for every penetration;
- **ventilation**: the airflow and temperature rise required, and the silencers that will treat the openings, as Chapter 8 shows;
- **isolation**: the machine's mounts, the flexible connections and the separation between machine and enclosure, as Chapter 9 shows;
- **access**: doors, panels, interlocks, lighting and the service clearances the maker of the machine requires;
- **verification**: how the result will be measured, and what happens if it falls short.

The specification for CP-30's enclosure, revised after the unlined box, listed all eight, with the insertion loss stated by band and the A-weighted target at the fitter's bench, so that a supplier quoting for it would price the lining, the seals and the silencers rather than a box of panels.

## Exercise: a heavier panel

The supplier offers 2.0 mm steel panels, about 15.7 kg/m², instead of 1.2 mm. By the mass law, how much does the transmission loss rise in each band? Would the heavier panels be worth it for CP-30's enclosure, given that it will have cooling openings?

**Worked answer.** Transmission loss rises by 20 × log₁₀(15.7 ÷ 9.42) ≈ **4.4 dB** in every band where the mass law holds. For the sealed, lined enclosure, the A-weighted insertion loss would rise by a little less than 4.4 dB, because the 63 and 125 Hz bands, where the estimate gives little, are unchanged in effect.

For the real enclosure, the heavier panels are unlikely to be worth their cost. Chapter 8's cooling openings, even silenced, will limit the enclosure's insertion loss well below what the 1.2 mm panels can give, so the panels are not the weakest path. The rule is to strengthen the weakest path first: until the openings and the seals carry less sound than the panels, extra panel mass buys almost nothing.
