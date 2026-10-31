---
book: magnetic-workholding-by-the-numbers
chapterSlug: residual-magnetism-and-proving-the-hold
order: 10
title: "Residual magnetism and proving the hold"
description: "Why parts leave a chuck magnetised and what that costs, measuring and specifying residual fields, demagnetising thick parts, and a plan of tests and records that proves a magnetic set-up."
draft: false
---

A part that has been held on a magnetic chuck or lifted with a magnet does not always return to its unmagnetised state when the magnet is switched off. It can keep a residual magnetisation that attracts swarf, sticks parts together, deflects welding arcs and upsets sensors downstream. Removing it is routine, but only if someone checks that it has been removed.

This chapter explains why steel keeps magnetism, how to measure and specify the residual field, why demagnetising thick parts needs care, and then brings the book together into a plan of tests and records that proves a magnetic set-up does what its set-up sheet says. The error is a batch of BP-600 plates that reached the customer magnetised.

## Why steel keeps magnetism

Chapter 2 described domains, regions of aligned magnetisation, which grow and rotate when steel is magnetised. When the applied field is removed, the domains do not all return to their random arrangement. Domain walls, the boundaries between domains, are held up at defects, inclusions, grain boundaries and the strains of hardening and cold work, and some of the alignment remains. The steel then has a remanent magnetisation, and its surfaces carry a field.

How much remains depends on the material's coercivity, the reverse field needed to bring the magnetisation back to zero. Soft, annealed low-carbon steel has a low coercivity and keeps little. Hardened steels, with many obstacles to wall movement, have much higher coercivities and keep much more. That is why hardened gauge plates and tool steel parts come off a chuck noticeably magnetised, while a mild steel plate like BP-600 usually keeps only a little, unless something such as an interrupted demagnetising cycle or a lifting magnet has left more.

### What residual magnetism costs

- **Swarf and cleanliness.** A magnetised part holds fine chips and grinding swarf. On a ground surface they scratch the next operation; in an assembly with bearings, linear guides or hydraulic passages they become contamination.
- **Handling.** Magnetised parts stick together and to tools, and small parts cling to each other in bins and feeders.
- **Welding.** Residual fields deflect the arc, the arc blow covered in *Arc Welding by the Numbers*.
- **Measurement and sensors.** Fields near magnetic encoders, Hall sensors and some gauges affect their readings.
- **Inspection.** Residual fields from an earlier operation can confuse magnetic particle testing, which is why its general standard, ISO 9934-1, also deals with demagnetisation after testing.

## Measuring and specifying the residual field

The residual field at a surface is measured with a Hall-effect gaussmeter and a probe held against the surface, or checked roughly with a field indicator, a simple meter with a pointer. Fields are given in millitesla (mT) or in gauss (G): 1 mT is 10 G. For comparison, the Earth's field is about 0.05 mT.

A residual field limit belongs in the drawing or the customer's specification, with where and how it is measured. There is no single universal limit; requirements depend on what the part does next. This is an illustration. BP-600's customer, who mounts linear guide rails on it, specifies a residual field of no more than 0.3 mT at any point on the rail seats, measured with a Hall-effect gaussmeter after demagnetising.

## Demagnetising

A part is demagnetised by taking its material round a series of magnetising cycles, each in the opposite direction to the last and each a little weaker, until the field is too small to leave any alignment behind. The first cycle must be strong enough to reach well into the material's existing magnetisation; each later one undoes most of the previous one.

There are three common ways to do this. A magnetic chuck's controller runs a demagnetising cycle of reversing, decaying pulses when it is switched off, which treats the part while it still sits on the chuck. A tunnel or plate demagnetiser, powered by alternating current at mains frequency, has a field that reverses 100 times a second; the part is passed slowly through and away from it, so the field it experiences decays as it leaves. And a reversing direct-current demagnetiser steps the current down through slow reversals for large parts.

### The skin depth problem

An alternating field does not penetrate a conductor fully. Eddy currents induced in the steel oppose the change and confine the field to a surface layer, whose thickness is the skin depth. For a conductor of resistivity ρ and relative permeability μr at frequency f:

```figure
type: formula
title: Skin depth of an alternating field in steel
formula: δ = √(2ρ ÷ (2π × f × μ₀ × μr))
formula: Mild steel, ρ ≈ 1.5 × 10⁻⁷ Ω·m, μr = 200, f = 50 Hz: δ ≈ 1.95 mm
caption: The field falls to about 37% of its surface value at one skin depth, and the effect on magnetisation deeper inside is correspondingly weaker. The relative permeability of steel varies widely with the field, so the figure is an order of magnitude, not a precise depth.
- ρ | electrical resistivity of the steel, Ω·m; an assumed typical value for mild steel
- μr | relative permeability during demagnetising
- f | frequency of the alternating field, Hz
```

At mains frequency the field reaches only a couple of millimetres into a steel part. A 25 mm plate passed through a mains-frequency tunnel demagnetiser is demagnetised in a surface layer, while its interior may keep its magnetisation. A reading taken on the middle of a face straight afterwards can be misleadingly low, because the surface layer under the probe has been demagnetised, while the interior's magnetisation still drives flux out of the plate where its poles are, typically at its ends and edges.

```figure
type: compare
title: Approximate skin depth in mild steel by frequency
cols: μr = 100 | μr = 200 | μr = 500
rowhead: Frequency
- 50 Hz, mains tunnel | 2.8 mm | 2.0 mm | 1.2 mm
- 5 Hz | 8.7 mm | 6.2 mm | 3.9 mm
- * 1 Hz, slow reversing DC | 19.5 mm | 13.8 mm | 8.7 mm
caption: Calculated from the formula above with ρ = 1.5 × 10⁻⁷ Ω·m. Thick parts need slow reversals, which is why demagnetisers for heavy work use low-frequency or stepped DC cycles.
```

For thick parts the cure is a slow cycle: low-frequency or reversing DC, from a chuck's controller or a dedicated demagnetiser, with enough time at each step for the field to penetrate. The electro-permanent chuck's demagnetising cycle, a sequence of slow pulses, reaches through BP-600 in a way a mains tunnel does not.

The field around the part also matters. A part demagnetised and then laid on a steel bench, picked up with a lifting magnet, or left beside an energised chuck can pick up magnetisation again. Demagnetising is the last magnetic operation before the part is measured and packed.

## Where else parts pick up magnetism

The chuck is only one source. A shop that demagnetises parts as they leave the chuck can still deliver magnetised parts if they are magnetised again afterwards. The common sources are:

- **Lifting magnets.** A permanent lifting magnet leaves a strong local field where it sat. Plates lifted by magnet after demagnetising need checking again, or should be moved with slings.
- **Magnetic bases and holders.** Indicator bases, magnetic squares and magnetic trays leave local spots of magnetisation, especially on hardened parts.
- **Welding and earthing.** Welding current flowing through a part, and current through a poorly placed earth clamp, can magnetise it.
- **Magnetic particle testing.** Testing deliberately magnetises the part, and must be followed by demagnetising if the part is to be used.
- **Steel benches and racks.** A part left in contact with magnetised steel, or near an energised chuck, can pick up a field.

The practical rule follows: demagnetise as the last magnetic operation, measure after that, and move and store measured parts in ways that do not magnetise them again.

## Demagnetising hardened parts

Hardened parts are both the most likely to keep magnetism and the hardest to clear. Their high coercivity means the first cycle of a demagnetiser must reach a stronger field to undo their magnetisation, and they respond less to each weaker cycle. A demagnetiser that clears mild steel parts easily may only reduce the field on a hardened gauge plate.

Three practices help. Running the demagnetising cycle with the part in the orientation in which it was magnetised, for example still on the chuck where it was held, makes the first reversal oppose the existing magnetisation directly. Repeating the cycle, or using a demagnetiser with a higher initial field, reaches further into the material's hysteresis loop. And measuring at several points, including near edges and corners where hardened parts often keep spots of higher field, confirms the result rather than assuming it.

## Checking the demagnetiser

A demagnetiser is itself a piece of equipment that can fail quietly: a coil can open, a controller can skip steps, a tunnel's field can weaken. The case's shop checks its demagnetisers monthly with a reference part. This is an illustration. The reference part is an offcut of hardened 4140 bar, 50 mm in diameter and 150 mm long, kept for the purpose. It is magnetised on the chuck at full power and released without demagnetising, and its end field is measured, typically about 2 mT. It is then put through the demagnetiser under test and measured again at both ends.

For the electro-permanent chuck's cycle, the shop expects the reference part's end field to fall below 0.2 mT; for the tunnel, with the bar passed through slowly and carried well clear before it is turned, below 0.3 mT. A result outside those values withdraws the demagnetiser until it is checked. The readings go into the same register as the chuck's pull tests, so that a slow decline in either shows up as a trend rather than as a rejected batch.

The gaussmeter used for all of this needs its own care: it should be zeroed in a zero-field chamber or away from steel before use, and calibrated at the interval its maker recommends. A field indicator, the simple pointer type, is useful for a quick screen on the shop floor, but the readings reported to a customer should come from a calibrated instrument.

## Specifying and reporting the limit

A residual field requirement that cannot be checked is not a requirement. A useful specification states the limit, the instrument, where on the part it is measured, and when: for example, a Hall-effect gaussmeter reading at named points along each rail seat, after the final demagnetising and before packing. It should also say what happens to a part that fails: whether it is demagnetised again and re-measured, and how many attempts are allowed.

The case's shop now reports residual field readings on its inspection certificate for every BP-600 batch, at six points on each rail seat, with the instrument's identity and calibration date. Reporting the readings, not just a pass, lets the customer see how close the batch was to the limit and lets the shop see a trend before it becomes a rejection.

## The error: a magnetised batch

This is an illustration. A customer's receiving inspection rejected a batch of 20 BP-600 plates because fine swarf was clinging to the rail seats, and their gaussmeter read between 0.8 and 1.4 mT on several seats, against the 0.3 mT limit.

The shop's investigation found two causes. First, during a busy shift some plates had been released from the grinder's chuck by switching off its power at the isolator rather than through the controller, which skips the demagnetising cycle; the grinder's electromagnetic chuck had left more residual magnetism in those plates. Second, the shop had then passed the plates through its mains-frequency tunnel demagnetiser, which brought the readings down to 0.2 mT at the one point the shop measured, the middle of each rail seat. The customer measured along the whole seat, and found the high readings near the plates' ends, where the magnetisation left in the plates' interiors, beyond the tunnel's reach at 25 mm thickness, drove its flux out.

The batch was recalled, demagnetised on the electro-permanent chuck with its full slow cycle, and checked with a gaussmeter at six points on each rail seat the next day; all read below 0.15 mT. The isolator was fitted with a guard and a sign, the tunnel demagnetiser was reserved for thin parts, and the inspection record now carries the residual field readings and the time they were taken.

## Proving the hold

Each chapter of this book has added a check. Together they form a plan that proves a magnetic set-up before it is trusted and keeps proving it afterwards, in the same three layers used for any process: validate once, accept each time, monitor for change.

```figure
type: layers
title: Proving a magnetic set-up
caption: This is an illustration of the case's plan. Each line comes from an earlier chapter; the records are what let someone who did not make the set-up check it.
- Validate, once per chuck and part family | pull tests with the reference block and with shims to fit the gap model, Chapter 3; sliding tests dry and wet, Chapter 5; first-part check on the surface plate, Chapter 6 | proves the estimates for this chuck and this kind of part
- * Accept, every set-up | the five-line set-up sheet: normal force, friction, peak force, what takes the sideways load, safety factor; contact and rock checks; material and thickness factors | proves this set-up before the first cut
- Monitor, routinely | monthly pull test with the reference block; test-piece check of lifting magnets; chuck face and cable inspection; residual field readings on finished parts | shows when the chuck, magnets or process have changed
```

```figure
type: checklist
title: Records for a magnetic set-up
caption: The open item was missing when this chapter's error happened. A record that is not made at the time cannot be reconstructed afterwards.
- x Set-up sheet with the five lines | for every new part or change of condition
- x Pull and sliding test results with dates | reference block, shims, dry and wet
- x Lifting magnet register | inspections, test-piece checks, examinations, repairs
- ? Residual field readings with the time measured | at named points, after demagnetising
- x Chuck maintenance | face regrinds, insulation tests, pull test after any repair
```

## Exercise: demagnetising a thicker plate

This is an illustration. A customer orders a plate like BP-600 but 50 mm thick, with the same residual field limit.

1. Using μr = 200 and ρ = 1.5 × 10⁻⁷ Ω·m, what share of the plate's half-thickness does a 50 Hz field's skin depth reach, and what share does a 1 Hz cycle's?
2. What demagnetising method should the shop use, and when should it measure?

**Worked answer.**

1. Half the thickness is 25 mm. At 50 Hz, δ ≈ 1.95 mm, **about 8%** of the half-thickness. At 1 Hz, δ ≈ 13.8 mm, **about 55%**, and the field still acts, more weakly, beyond one skin depth. Slower still would be better for a plate this thick.
2. **A slow reversing cycle, measured at the ends and edges.** The chuck's slow demagnetising cycle, or a stepped DC demagnetiser, rather than the mains tunnel. The residual field should be measured at points along the whole seat, including near the plate's ends and edges where any interior magnetisation shows, not only at the middle of each face.
