---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: choosing-and-testing-a-stiffened-panel
order: 9
title: "Choosing and testing a stiffened panel"
description: "Compare every stiffening option against all the targets at once, test the chosen panel for deflection, snap-through, heat and frequency, and catch a tap test done on the bench."
draft: false
---

Each earlier chapter judged one way of stiffening a panel against one kind of failure. A real decision has to judge every option against every target at once, and then confirm with a test that the panel built behaves like the panel calculated. The calculations in this book are honest estimates for ideal edges and small deflections; the real panel has screwed edges, residual stresses, adhesive joints and a frame that moves a little. A test is not an afterthought to the design. It is the step that turns estimates into evidence.

This chapter brings SP-90's options together in one table, explains the final choice, sets out a set of simple workshop tests for deflection, snap-through, thermal behaviour and frequency, and records a frequency test that measured the wrong thing.

## All the options against all the targets

This is an illustration. The table collects the numbers from Chapters 1 to 8 for every option the builder considered. Masses include the 20 mm returns and 10 mm lips of Chapter 4 on every option, so that the options compare like with like, and exclude the cable opening, which is the same for all.

```figure
type: compare
title: SP-90 options against the builder's targets
cols: Deflection, 250 Pa | Lowest mode near a band | Thermal buckle, 10 °C | Mass
caption: This is an illustration. Targets: 3 mm; no mode within 18.1–30.2 Hz or 36.0–60.0 Hz; 2 mm; 8.0 kg. Flat deflections are small-deflection estimates for simply supported edges.
- Flat 1.2 mm | 7.9 mm, fails | 22.2 Hz, fails | 4.2 mm, fails | 5.93 kg
- Flat 1.6 mm | 3.3 mm, fails | 29.6 Hz, fails | 4.2 mm, fails | 7.91 kg
- Flat 2.0 mm | 1.7 mm | 19.3 Hz, fails | 4.2 mm, fails | 9.89 kg, fails
- Five beads across | 1.5 mm | 24.0 Hz, fails | 1.0 mm | 5.93 kg
- Two horizontal hats | 0.68 mm | 40.0 Hz, fails | 2.1 mm, fails | 7.07 kg
- *Three horizontal hats | 0.26 mm | 64.9 Hz, clear | 1.6 mm | 7.64 kg
```

Read as a whole, the table makes three points that no single chapter could:

1. **Thickness fails on every count but deflection**, and even there 1.6 mm is not enough. The thermal buckle estimate does not improve with thickness at all, because it depends on bay size.
2. **Beads pass everything static and fail on vibration.** They are the lightest option and an excellent one for a panel away from rotating machinery.
3. **Three hats pass everything**, at a mass inside the limit. Two hats are lighter but leave a bay mode inside the motor band and bays just too wide for the thermal target.

The builder chose three horizontal hats, bonded with four rivets each, with their end tabs riveted to the returns; 20 mm returns with 10 mm lips on all four edges, fixed at 300 mm pitch; and a cable opening with 75 mm corner radii and a 10 mm flange. That is the panel the tests below were run on.

## Four workshop tests

Each target gets a test that a small workshop can run with ordinary tools. None of them is a laboratory measurement, and none needs to be: they confirm that the real panel is in the region the calculations predicted, and they catch gross errors.

```figure
type: steps
title: Testing a stiffened panel in the workshop
caption: This is an illustration of the builder's test sequence on the first assembled enclosure. Every test is run with the panel installed on its own frame and fasteners, not on a bench.
- Deflection | dial gauge on a bridge fixed to the frame; read at the bay centre with extraction off and on
- Snap-through | push by hand at each bay centre and at the panel centre; listen and feel for a pop
- Thermal | warm the panel with a heat lamp to 10 °C above the frame; check the bays with a straightedge
- Frequency | tap each bay with a soft mallet; record the ringing with a phone vibration or sound app
- Running | run the fan and motor through their speeds; look for peaks at the running frequencies
```

### Deflection

A dial gauge needs a reference that does not move with the panel. The builder made a light bridge of aluminium angle that bolts across the frame's vertical members, so that the gauge's plunger reaches the centre of each bay. With the extraction off, the gauge is zeroed; with it on, the reading is the bay's deflection relative to the frame. A manometer in the extraction duct, or a simple U-tube on a tapping in the enclosure, confirms that the enclosure is at 250 Pa during the reading.

This is an illustration. The original flat SP-90 measured 4.8 mm at its centre, about 61% of the 7.9 mm small-deflection estimate, as Chapter 3's membrane effect and the screws' partial clamping predicted. The three-hat panel measured 0.2 mm at the worst bay, inside the 0.26 mm estimate.

Two practical points make the reading trustworthy. The gauge should read to 0.01 mm, because the stiffened panel's deflection is a fraction of a millimetre and a 0.1 mm gauge would show almost nothing. And each reading should be repeated three times, cycling the extraction off and on, because the first cycle often shows a small permanent shift as the panel settles on its fasteners. The builder records the average of the second and third readings and notes the first-cycle shift separately; a shift larger than the deflection itself suggests a fastener that has not seated, and the test is repeated after the fasteners are checked.

### Snap-through and heat

The push test is crude and effective: a firm hand push at the centre of each bay and the centre of the panel, then the same from inside. The original panel popped loudly at its centre. The three-hat panel did not pop anywhere. For the thermal test, a heat lamp warmed the panel while an infrared thermometer watched both panel and frame until the difference reached 10 °C; a straightedge and feeler gauges across each bay showed no gap above 0.5 mm, inside the 1.6 mm estimate because the oversize screw holes let the panel slide.

### Frequency

A **tap test** strikes the panel lightly and measures how it rings. A phone with a vibration-analysis or audio-spectrum app, held against the panel or near it, shows the ringing as peaks at the panel's natural frequencies. Tapping each bay in turn and noting the peaks gives the lowest bay modes well enough for this purpose. The running test then runs the machine through its speeds and looks for any peak in the panel's response that grows sharply at a particular speed.

This is an illustration. Installed on its frame, the three-hat panel's bays showed their lowest peaks at about 71 Hz, 9% above the calculated 64.9 Hz, consistent with the screws providing some edge restraint. The running test showed small peaks at 24 Hz and 48 Hz, the forcing itself transmitted through the frame, with no growth and no hum, and nothing at the fan's blade-passing frequency of about 218 Hz.

## The error: a tap test on the bench

This is an illustration. The first frequency test of a three-hat panel was done the day it was assembled, before the enclosure frame was ready. The technician laid the panel on a foam mat on the bench, tapped it, and recorded a lowest peak at about 17 Hz. That was inside the fan band, and the result caused a day of alarm and a meeting about adding a fourth hat.

The designer asked how the panel had been held. A panel lying on foam has free edges, not supported ones, and a free panel vibrates in entirely different modes: it twists and flexes as a whole, with its edges and corners moving most. The stiffened bays had not been tested at all. The 17 Hz peak was the whole panel twisting on the foam, a mode that cannot exist once the panel is screwed to a frame every 300 mm.

When the frame was ready and the panel installed, the bays measured about 71 Hz, as reported above. The lesson the builder recorded is that **a test must reproduce the boundary conditions of the calculation it checks, or of the service it represents**. A bench test with free edges answers a question nobody asked. The test sequence now begins with the words "panel installed on its own frame with all fasteners at the specified torque", and a test result is recorded with a line describing how the panel was held.

## The test record

A test result is useful only if someone can find it and trust it later. The builder records each first-article test on one page, kept with the panel's drawing revision.

```figure
type: checklist
title: SP-90 first-article test record
caption: This is an illustration. One record per drawing revision; repeated when the panel's material, stiffeners, fasteners or the machine's running speeds change.
- x Panel and revision | SP-90, three-hat redesign, 1.2 mm zinc-coated sheet
- x Mounting | installed on enclosure frame, 10 fasteners at 300 mm pitch, specified torque
- x Deflection at 250 Pa | worst bay 0.2 mm against 3 mm target
- x Snap-through | none at any bay or at panel centre, both directions
- x Thermal, ΔT 10 °C | largest gap under straightedge 0.5 mm against 2 mm limit
- x Lowest bay mode | about 71 Hz, clear of 18.1–30.2 Hz and 36.0–60.0 Hz
- x Running test | no resonant growth at fan, motor or blade-passing frequency
- ? Field check | repeat the running test on the first customer installation
```

The last line is open on purpose. A workshop frame bolted to a concrete floor is not the same as a customer's machine on a mezzanine, and the first installation is the first real test. The builder's practice is to repeat the running test with a phone app on the first installation of any revised panel and add the result to the record.

## Feeding the results back

A test that agrees with a calculation is reassuring. A test that differs from it by a consistent amount is more useful still, because the difference calibrates the next calculation. This is an illustration. The builder's records now hold two calibration factors for its own panels on its own frames:

- **Deflection.** The flat SP-90 deflected 4.8 mm against an estimate of 7.9 mm, a ratio of 0.61. That ratio reflects both large-deflection stiffening and partial clamping, and it applies only to flat panels in the large-deflection range. For the stiffened panel, the measured 0.2 mm against the estimated 0.26 mm is a ratio of about 0.8, closer to one because the bays deflect less than their own thickness and the small-deflection formula fits better.
- **Frequency.** The stiffened bays rang at about 71 Hz against an estimate of 64.9 Hz, a ratio of 1.09. That reflects the screws and hats restraining the bays' edges more than simple supports would.

The builder does not use these factors to relax its targets. It uses them to judge how much margin a future design really has. A new panel on the same frame, with the same fasteners and stiffener style, whose calculated bay frequency is 50 Hz is probably at about 55 Hz in reality, inside the motor band either way; one calculated at 58 Hz might be at 63 Hz, just clear, and needs a test before anyone relies on it. Calibration factors belong to a particular construction. A change of frame, fastener pitch or stiffener attachment makes them unreliable, and the record notes the construction they came from.

## Checks on every batch

A first-article test proves the design. Batch checks prove that each panel is made to the design, which matters because stiffening depends on details that are easy to get wrong in production and hard to see on a finished panel.

This is an illustration. The builder's batch checks for SP-90 are short:

1. **Sheet thickness and coating**, checked against the delivery's certificate and with a micrometer on one blank, because a batch of 1.0 mm sheet delivered as 1.2 mm would lose 42% of the panel's stiffness and lower its frequencies.
2. **Hat count, position and orientation**, by eye against a template, since a hat fitted upside down or in the wrong place changes the bays.
3. **Adhesive coverage**, by checking the squeeze-out along both flanges of each hat and pulling one test coupon per batch, since a hat that is only riveted at its ends is far less effective than one bonded along its length.
4. **End-tab rivets**, counted, since a hat whose ends are not connected to the returns delivers its load to the bare panel.
5. **Fastener torque** on installation, since loose screws lower the edge restraint and with it the frequencies.

None of these takes more than a few minutes, and all of them are cheaper than a hum discovered by a customer. They are written on the panel's route card, so that the person who makes the panel also checks it.

## When to stop calculating and test

A designer can always refine a calculation: finer coefficients, a better effective width, a finite-element model of the panel with its stiffeners and fasteners. For a panel like SP-90, the hand calculations in this book bracket the answer well enough to choose between options and to set up a test, and the test then answers the remaining questions faster and more convincingly than further analysis. Finite-element analysis earns its place when the panel is expensive, made in large numbers, safety-critical, or too irregular for the classical formulas; even then, the hand numbers are the check that the model is behaving.

For safety-critical panels, such as guards, pressure-containing casings and structural cladding, the test regime and acceptance criteria are set by the applicable standards and by a competent engineer, not by a builder's working rules like those in this book.

## Exercise: a revised fan

A year later, the builder changes to a quieter fan running at 1,750 rpm with seven blades. The motor is unchanged.

1. What are the new fan frequency, its 25% band and its blade-passing frequency?
2. Does the tested three-hat SP-90, with bays measured at about 71 Hz and hats calculated at about 153 Hz, need retesting?

**Worked answer.**

1. 1,750 / 60 = **29.2 Hz**, so the band is 21.9 to 36.5 Hz. The blade-passing frequency is 7 × 29.2 = **204 Hz**.
2. The bays at about 71 Hz are far above the new fan band, and the hats at about 153 Hz are 25% below the blade-passing frequency, right at the edge of the builder's margin if the same rule were applied to it. The panel's calculations say it is probably fine, but the rule in the test record is that a change to the machine's running speeds triggers a repeat of the running test. The builder should run the new fan through its speeds on an installed panel and watch for growth near 204 Hz. If any appears, a damping pad on each hat's top, or bonding the hats with a more damped adhesive, would be the first remedies to try, before any change to the stiffener layout.
