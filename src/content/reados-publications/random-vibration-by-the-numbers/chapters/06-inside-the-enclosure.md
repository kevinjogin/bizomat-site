---
book: random-vibration-by-the-numbers
chapterSlug: inside-the-enclosure
order: 6
title: "Inside the enclosure: boards and nested resonances"
description: "Following vibration through mounts, panels and circuit boards: transmissibility in series, board deflection, why nested resonances should be an octave apart, and heavy components and their mounting."
draft: false
---

Vibration reaches a circuit board through a chain. The frame shakes the mounts, the mounts shake the enclosure, the enclosure's back plate or door shakes the board's standoffs, and the board flexes about its own resonance. Each link filters the vibration according to its own transmissibility, and the board sees the product. When the links' resonances are far apart, each passes on little at the others' frequencies and the chain is benign. When two resonances sit close together, the first amplifies exactly the band the second amplifies again, and the board can see many times what either link alone would give it.

This chapter follows CB-7's vibration from the frame to its main circuit board. It calculates the board's response and deflection with each mounting from Chapters 4 and 5, shows what happens when the board is moved onto a panel that resonates near its own frequency, explains the rule that nested resonances should be separated by at least a factor of two, and sets out how heavy components and their fixings change the picture.

## Transmissibility in series

When one single-degree-of-freedom system sits on another, and the upper one is light enough not to load the lower, the PSD at the top is the input PSD multiplied by each stage's |H|² in turn. The board's input is the frame's PSD times the mounts' |H|² times, if it is fixed to a panel, the panel's |H|²; the board's response is that, times its own |H|².

This is an illustration. CB-7's main circuit board, with its components, has a first natural frequency of 180 Hz and Q = 12, measured by a tap test. It is fixed by standoffs to the enclosure's back plate, which is stiff: the back plate's own first resonance is above 600 Hz, so at 180 Hz it simply follows the enclosure.

```figure
type: compare
title: CB-7's main circuit board under the specification profile
cols: Input PSD at 180 Hz, g²/Hz | Board deflection, µm RMS | Equivalent response, g RMS
rowhead: How the enclosure is mounted
caption: This is an illustration. Numerical integration of the chain over 5 to 500 Hz; deflection is the board's centre relative to its standoffs. On the soft mounts most of the remaining deflection is quasi-static, the board following the enclosure's slow 9 Hz motion rather than resonating.
- Board fixed directly to the frame | 0.020 | 62.5 | 8.2
- Enclosure on stiff bushes, 25 Hz | 0.000033 | 11.2 | 1.46
- * Enclosure on 15 N/mm mounts, 9.2 Hz | 0.0000034 | 4.0 | 0.52
```

The soft mounts reduce the PSD reaching the board at 180 Hz by a factor of nearly 6,000, and the board's own resonant response almost disappears: by Miles' equation it would be √(1.5708 × 180 × 12 × 0.0000034) = 0.11 g RMS. What deflection remains, 4 µm RMS, comes mostly from the enclosure's slow motion on its mounts, which bends the board a little as a whole without exciting its resonance. Isolation does its most valuable work at high frequencies, exactly where boards, solder joints and small components resonate.

## How much deflection a board can take

Circuit boards fail in vibration mainly through fatigue of solder joints and component leads, which are strained as the board flexes beneath them. The board's deflection at its centre is therefore the natural measure of severity, and Steinberg's text on electronic equipment gives an allowable-deflection criterion that depends on the board's size, its thickness and the type and position of the most sensitive component. Its values are not reproduced here; the principle is that the allowable deflection is a small fraction of a millimetre for a typical board, smaller for large stiff components such as ball-grid arrays near the board centre, and larger for small leaded parts near the edges.

For CB-7, the board's 4 µm RMS on soft mounts, 12 µm at 3σ, is comfortably small by any such criterion. On the frame, without isolation, 62.5 µm RMS and nearly 0.19 mm at 3σ would be uncomfortable for a large component near the centre, and the board would need stiffening, extra standoffs, or the isolation it now has.

## Nested resonances and the octave rule

This is an illustration. A later revision of CB-7 moved the main board from the back plate to the inside of the hinged door, so that technicians could reach its test points without removing other equipment. Nobody checked the door. Its sheet-steel panel, with the board's mass added, had a first resonance at about 170 Hz with Q = 10: almost on top of the board's own 180 Hz.

At 180 Hz the door's |H|² is about 39: the door amplifies the band around 180 Hz by that factor in mean square before the board amplifies it again. On the soft mounts, the board's deflection rose from 4.0 to 6.6 µm RMS, a 66% increase. That is still small, because the mounts had removed so much of the high-frequency input first. The same coupling on an unisolated installation would have been dramatic.

```figure
type: compare
title: The board on the back plate and on the door
cols: Board on the stiff back plate | Board on the door, panel at 170 Hz | Board on a stiffened door, panel at 360 Hz
rowhead: Installation
caption: This is an illustration. Board deflection, µm RMS, from numerical integration through each chain. Close resonances multiply; resonances an octave apart barely interact.
- * Enclosure on 15 N/mm mounts | 4.0 | 6.6 | 4.1
- Without isolation, on the frame | 62.5 | 393 | 85
```

Without isolation, putting the board on a door that resonates at 170 Hz would multiply its deflection more than sixfold, from 62.5 to 393 µm RMS: well into the range where solder joints crack within hours. Stiffening the door so that its resonance rose to 360 Hz, an octave above the board's, would bring the figure back to 85 µm, close to the back-plate value.

The chapter on [mounting a board for vibration](/reados/publications/electronics-packaging-by-the-numbers/mount-the-board-for-vibration/) in Electronics Packaging by the Numbers shows how to estimate a board's natural frequency from its supports before any test. The rule Steinberg and others give for nested assemblies follows: keep each resonance at least an octave, a factor of two in frequency, away from the resonance of whatever it is mounted on. A factor of two keeps one link's amplified band out of the other's, so the chain's response stays close to that of each link alone. CB-7's chain is mounts at 9 Hz, enclosure structure and back plate above 600 Hz, board at 180 Hz: well separated. The door at 170 Hz broke the rule.

## The fix

The revision was reversed for the board, which went back to the back plate, and the test points were brought out to a small connector panel on the door, which carries no components that matter in vibration. Had the door mounting been essential, a stiffening rib to raise the door's resonance above 360 Hz, or a damped mounting for the board, would have restored the separation. The checklist for future revisions now asks, for any component moved, what it is mounted on and what that surface's first resonance is.

## Mapping the chain

The octave rule can only be applied if the resonances in the chain are known, and the quickest way to know them is to measure. A tap test on each link, with the equipment assembled as it will be used, gives each first natural frequency and Q in a few minutes. The results go on one chart, which makes clashes obvious.

```figure
type: bars
title: First natural frequencies in CB-7's vibration chain
unit: Hz
max: 650
caption: This is an illustration, from tap tests on the assembled enclosure. The door panel, at 170 Hz, sits within a factor of two of the board; every other pair is separated by more than an octave. The engine tone at 25 Hz is shown for reference.
- Mounts, vertical | 9.2
- Engine tone | 25
- * Door panel with the board fitted | 170
- Main circuit board | 180
- Back plate | 600
```

The same map shows where the remaining risks lie. Nothing in CB-7's chain now sits near the engine tone, the mounts are an octave and more below everything they protect, and the board's resonance is isolated by a factor of thousands in PSD. A finite element model can produce the same map before anything is built, and the tap tests then confirm it; when the two disagree by more than ten per cent or so, the model's joints and boundary conditions usually need revisiting.

## Harnesses and cables

Cables inside an enclosure are small vibrating systems too. A loom that hangs unsupported between two terminal blocks has a low natural frequency and can whip, chafing its insulation on sharp edges and working its terminals loose. The usual practice is to support looms at short intervals with clips or ties to the structure, to leave a little slack at each termination so that the conductor does not carry the loom's motion into the terminal, and to protect any loom that crosses an edge. Cables that cross from the enclosure to the frame need more: enough slack and a smooth loop to accommodate the full sway of Chapter 5 without becoming a stiff link that bypasses the isolators. CB-7's harnesses were reviewed against those rules at the same time as the board's mounting, and two looms on the door were clipped back.

## Heavy components

A board's natural frequency falls when heavy parts are added, and their own fixings form small resonant systems of their own. A transformer of a few hundred grams soldered by its pins into the middle of a board lowers the board's frequency, concentrates strain at its pins, and, if it is tall, rocks on them. The usual remedies are to place heavy parts near standoffs or edges, where the board deflects least, to fix them to the board or the enclosure with clamps or adhesive rather than relying on their pins, and to add a standoff beneath them.

This is an illustration. CB-7's board carries a 240 g transformer. In the first layout it sat near the centre of the board; moving it beside a standoff and adding a strap raised the board's measured first frequency from 165 to 180 Hz and, more importantly, took the transformer's mass off its pins. The change cost nothing in board area and was made before any testing. A strap, a dab of adhesive or an extra standoff under a heavy part is the cheapest vibration fix there is, provided it is made at the layout stage.

## Analysis, test or both

The hand methods of this chapter treat each link as a single resonance and multiply transmissibilities, which is reliable when the links are well separated and each has one dominant mode, and approximate when they are not. A finite element model of the enclosure with its board, solved for random response to the measured or specified input, handles many modes, coupling and complex geometry, and gives deflections and stresses everywhere. It also depends on assumptions about joints, damping and boundary conditions that are hard to get right without measurement.

The sound practice is to use all three. The hand chain gives the first answer and sets the targets, such as the octave rule and the isolation required. The model refines it and finds problems the hand method cannot see, such as a twisting mode of the board under a heavy component. Tap tests and a shaker test, Chapter 9, check both. Where they agree, the design can be trusted; where they disagree, the disagreement is a finding in its own right, and usually points to a joint or a mounting that behaves differently from the drawing. CB-7's door problem would have been caught by a tap test of the revised door before the revision was released; it was caught instead by the vibration review that the revision triggered.

## Relays, connectors and fasteners

Not every failure inside an enclosure is fatigue. Relays can chatter, opening their contacts momentarily under acceleration along their armature's axis, and their data sheets give a vibration rating, usually as a sine acceleration over a frequency range, below which they do not. Connectors fret: their contacts rub microscopically under vibration and their plating wears through, leaving oxide that raises resistance. Screws loosen under transverse vibration unless they are locked by preload, thread-locking compound or a locking feature. The loose terminals that started CB-7's story in Chapter 5 were of this kind.

All three are governed by the acceleration and displacement at the component's own location, which the chain above gives. A relay's sine rating cannot be compared directly with a random level; the usual practical check is that the 3σ random acceleration at the relay's location, here about 1.6 g on the soft mounts, is well below the relay's rated acceleration, with the relay oriented so that its sensitive axis sees the smallest input.

## Exercise: the door without isolation

An unisolated version of the enclosure is proposed for a stationary plant with lower vibration, where the frame's PSD is a flat 0.005 g²/Hz from 20 to 500 Hz. The board is on a door with a 170 Hz, Q = 10 resonance; the board is 180 Hz, Q = 12. Using the PSD multiplication of this chapter, estimate the PSD reaching the board at 180 Hz, the board's response by Miles' equation, and how much the door's resonance raises it compared with a stiff back plate.

**Worked answer.** This is an illustration. The door's |H|² at 180 Hz is about **39**, so the PSD reaching the board at 180 Hz is 0.005 × 39 = **0.195 g²/Hz**, against 0.005 g²/Hz on a stiff back plate. Miles' equation, which treats the board's input as flat across its 15 Hz bandwidth, gives √(1.5708 × 180 × 12 × 0.195) = **25.7 g RMS** on the door against √(1.5708 × 180 × 12 × 0.005) = **4.1 g RMS** on the back plate, a factor of √39 = 6.2. The input is not really flat across the board's bandwidth, because the door's own peak is only 10 Hz away, so Miles' equation is approximate here; the full integration of this chapter gives a similar factor. Either way, the door mounting would need stiffening or the board moving back to the back plate, exactly as for CB-7.
