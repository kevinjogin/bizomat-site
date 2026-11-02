---
book: electronics-packaging-by-the-numbers
chapterSlug: write-the-packaging-brief
order: 1
title: "Write the packaging brief"
description: "Turn an electronics idea into numbered mechanical requirements for space, heat, sealing, vibration, connection, radio, compliance and assembly before anyone draws an enclosure."
draft: false
---

Most packaging problems in a product with electronics start as a sentence nobody questioned. "It needs to be rugged." "Make it waterproof." "The board is about the size of a credit card." Each sentence hides a number, and each number decides some part of the enclosure: wall thickness, seal design, screw spacing, mounting stiffness, connector choice, where the antenna can go. If the numbers are not written down early, the mechanical designer guesses them. The electronics designer guesses a different set. The two sets meet for the first time at the prototype, where changing anything costs weeks.

This chapter writes the packaging brief for the gearbox monitor that runs through the book. The brief is a short controlled document, usually two or three pages, that turns the product idea into measurable requirements for the enclosure and everything inside it. It is not a specification for the electronics, and it does not choose a design. It records what the package must do, the environment it must survive and who owns each number.

## Why the brief comes before the enclosure

A product with electronics has two design teams with different rhythms. The electronics designer works from a schematic towards a board layout, and the board outline is often one of the last things fixed. The mechanical designer works from the outside in: mounting, envelope, sealing, then the space left inside. If both wait for the other, the board is drawn to whatever space happens to remain, and the enclosure is drawn around a board that does not exist yet.

The brief breaks that deadlock by fixing the shared constraints first. The board does not need to be finished for the mechanical designer to know its maximum outline, its tallest component zone, its heat output, its connectors and where its antenna must sit. The enclosure does not need to be modelled for the electronics designer to know the space available, the mounting points and the temperature the board will see. Each side can then work in parallel within agreed limits.

There is a second reason. Many of the requirements in a packaging brief come from outside the design team: the installer, the site, the regulator and the factory that will build the product. Writing them down early is the cheapest way to find out what you do not yet know.

## Five sources of requirements

A useful brief collects requirements from five places. Missing any one of them is a common cause of late redesign.

```figure
type: layers
title: Where a packaging brief's requirements come from
caption: Each layer adds requirements the enclosure must meet. The brief records them as numbers with an owner.
- The board and its parts | outline, component heights, heat, connectors, antenna, test points
- The environment | temperature, water, dust, sun, vibration, chemicals, impact
- The installer and user | mounting, cable route, access for maintenance, labels they must read
- *The regulator | radio and EMC compliance, electrical safety, marking and records
- The factory | assembly order, fasteners, sealing checks, production test, serial numbers
```

**The board.** The electronics designer supplies the maximum board outline, keep-out zones, the height of the tallest parts in each zone, the average and peak power dissipated, the connectors and their positions, the antenna type and its clearance needs and any test points that must stay reachable. At brief stage most of these are limits, not final values.

**The environment.** This is where the mechanical designer leads. The brief records the range of air temperature, the temperature of anything the product touches, solar exposure, water exposure (rain, spray, hose, immersion), dust, vibration and shock, chemical exposure and the risk of impact.

**The installer and user.** How is the product fixed? How far away is the power supply? Will the cable be pulled during installation? Does anyone need to open the enclosure in service, and with what tools? What must a person be able to read on the label once it is installed?

**The regulator.** A product with a radio and a cable carrying power has compliance obligations in Australia. Chapter 8 deals with them. At brief stage the question is simply which regimes apply, because they affect the design: an RCM mark needs space on the label, and EMC performance depends on how the enclosure and cable entry are built.

**The factory.** How many units a year? What assembly equipment is available? How will each unit be tested for sealing and function before it leaves? The answers decide fastener types, assembly order and whether a pressure-decay leak tester or a simple functional test will be used.

## Turn adjectives into numbers

The core skill in writing a brief is refusing to accept an adjective. Every adjective is replaced with a quantity, a test or a reference.

"Rugged" might mean survives a 1 m drop onto concrete, or withstands a 5 J impact on the lid, or keeps working under the gearbox's vibration. "Waterproof" might mean rain, a hose, a pressure washer or immersion in a flooded pit, and each needs a different seal design. "Small" might mean fits between two flanges 120 mm apart, or weighs under 500 g so a single M8 stud can carry it. Each translation is a decision, so it is recorded with who made it and why.

A quantity alone is not enough. Each requirement also needs a verification method, so that the team knows at the brief stage how it will be proven. A temperature requirement might be verified by calculation in Chapter 4 and by a heated-plate test in Chapter 9. A sealing requirement is verified by a laboratory IP test on prototypes and by a production leak test on every unit.

## The gearbox monitor's environment

This is an illustration. The gearbox monitor bolts to the housing of a helical conveyor gearbox driven by a four-pole motor at 1,480 rpm. The conveyor runs outdoors at a quarry. The site's maintenance team supplied these figures for the brief:

- The gearbox housing runs at up to **75 °C** on a hot summer afternoon, measured with a contact thermometer at the proposed mounting pad.
- Shade air temperature reaches **40 °C** in summer and falls to **−5 °C** on winter mornings.
- The gearbox sits in full sun for part of the day.
- The conveyor is hosed down weekly to remove dust, with a hand-held hose at mains pressure, not a pressure washer.
- The structure carries fine abrasive dust whenever the plant runs.

The vibration requirement comes from what the monitor must measure as well as what it must survive. The motor shaft turns at **1,480 ÷ 60 ≈ 24.7 Hz**. The input pinion has 19 teeth, so the first gear stage meshes at **24.7 × 19 ≈ 469 Hz**, with its second harmonic near **937 Hz**. The reliability engineer wants to see both, so the measurement band is set at 10 Hz to 1 kHz. That number matters in Chapter 3, because anything inside the enclosure that resonates within the measurement band will corrupt the data, not just risk fatigue.

```figure
type: stats
title: The gearbox monitor's brief in five numbers
caption: This is an illustration. Each number has an owner and a verification method in the full brief.
- 75 °C | Mounting surface | gearbox housing, summer maximum
- 40 °C | Shade air | with full sun for part of the day
- 10 Hz–1 kHz | Measurement band | covers 469 Hz gear mesh and its harmonic
- *IP66 and IP67 | Ingress | hose-down and temporary immersion
- 25 m | Supply cable | 24 V d.c. from the control cabinet
```

## The board's side of the brief

This is an illustration. At brief stage the electronics designer committed to these limits for the board:

- Maximum outline **80 mm × 50 mm**, 1.6 mm thick, four mounting holes at the corners.
- Tallest component **12 mm** (a radio module with its shield can), all other parts under 4 mm.
- A triaxial MEMS accelerometer whose mounting must be stiff relative to the housing.
- Average power drawn from the 24 V supply about **0.6 W**, peak about **2 W** during radio transmissions lasting a few seconds.
- An LTE-M radio with an embedded antenna that needs a clear zone free of metal, details to follow from the antenna maker's guide.
- Six test pads that must be reachable with spring pins during production test.

Each of these is a limit the electronics designer agrees not to exceed without a change request. The mechanical designer agrees, in return, to leave the space and services they need. That mutual commitment is what makes parallel design possible.

## Who owns each number

A requirement without an owner drifts. In the brief, every line carries the name of the role that sets the value and the role that verifies it. For the gearbox monitor, the site's maintenance team owns the environment figures and the installation constraints. The electronics designer owns the board limits. The mechanical designer owns the enclosure envelope, mounting and sealing. The product manager owns the volume and target cost, and the compliance lead owns the regulatory list.

The brief is placed under revision control in the same product data system as the CAD and board files, so that a change to a requirement has a revision, a reason and a date. The value of doing this is felt in Chapter 10, when the release package has to show that every requirement was met by a specific design revision and test.

## Allow margins, but say where they are

Engineers instinctively add margins, and margins added silently in several places multiply. If the site says 75 °C, the mechanical designer designs for 80 °C, the electronics designer chooses parts for 85 °C and the test engineer tests at 90 °C, nobody knows which figure is the real requirement. The brief therefore records the measured or stated value and, separately, any design margin and its reason. For the gearbox monitor, the design temperature for the mounting surface is set at 75 °C with no added margin, because the maintenance team measured it directly. The margin is placed instead on the electronics, which are chosen from parts rated to 85 °C so that Chapter 4 can show a measurable gap.

## A failure case: the IP rating that did not cover the hose

This is an illustration. The first draft of the brief, written from a sales enquiry, said only "IP67". At the brief review, the mechanical designer asked how the conveyor is cleaned. The answer was a weekly hose-down.

The IP code's second digit describes protection against water, and the higher digits are not a ladder in which each includes all those below it. A rating for temporary immersion does not by itself claim resistance to water jets. A product expected to meet both conditions is dual coded, for example IP66/IP67, and is tested to both. IEC 60529 defines the tests; Chapter 5 explains the code in more detail.

Had the brief stayed at IP67, the lid seal and its screw spacing would have been designed and tested for a slow static pressure, not for a jet striking the seal line. The prototype would probably have passed the immersion test and still taken water at the first hose-down. The error was detected by asking the installer a plain question about cleaning. It was corrected by changing the requirement to IP66 and IP67 and adding the jet test to the Chapter 9 test plan before any enclosure was modelled.

## Keep the brief short and controlled

A packaging brief that runs to twenty pages will not be read. The gearbox monitor's brief is a one-page table of requirements, one page of environmental notes and a list of open items. It links to the source of each figure, such as the site's temperature measurement or the antenna maker's integration guide, rather than repeating it.

```figure
type: checklist
title: Packaging brief review for the gearbox monitor
caption: This is an illustration. Open items are tracked with an owner and a date; avoid items are traps found in earlier products.
- Board outline, height zones and heat stated as limits | agreed with the electronics designer
- Environment stated as measured values with sources | site temperature, washdown method, dust
- Measurement band set from the gear mesh frequency | 10 Hz to 1 kHz
- ? Antenna keep-out dimensions | awaiting the antenna maker's integration guide
- ? Mounting pad flatness and thread on the gearbox | site to confirm on the actual housing
- x Adjectives such as rugged or waterproof without a number | rewrite as a test or quantity
- x Margins added silently by each discipline | record the stated value and margin separately
```

The open items are as important as the agreed ones. A brief that admits it does not yet know the antenna keep-out is more useful than one that guesses, because the guess would be built into the enclosure.

## How this applies to a small Australian business

Small product companies often skip the brief because the same two or three people do everything. That makes the brief more useful, not less, because the person drawing the enclosure on Monday will not remember the assumption made about the hose on Friday. A brief also helps when work goes to an outside electronics designer or contract manufacturer: it becomes the agreed basis of their quote and the reference for any variation. For the regulatory items, the Australian Communications and Media Authority and the electrical safety regulators publish guidance for suppliers, and reading it at brief stage is far cheaper than redesigning a label or a cable entry later.

## Exercise: rewrite three vague requirements

A colleague's draft brief for a different product, a monitor for a pump in a covered water-treatment building, contains these lines: "Must be rugged." "Should be waterproof." "Board will be small." Rewrite each as one or more measurable requirements with a verification method, stating any assumption you make and the question you would ask to confirm it.

**Worked answer.** One reasonable set, with assumptions marked:

- "Rugged" becomes: survives a 1 m drop onto concrete, in its packaging and unpackaged, without loss of function (assumption: it may be dropped during installation; verified by drop test). It also keeps working when mounted on the pump at the pump's measured vibration (question: what vibration was measured at the mounting point, and at what frequencies?).
- "Waterproof" becomes: protected against water jets and temporary immersion, IP66 and IP67 (assumption: the building is hosed down and the pit can flood; question: how is the area cleaned, and has the pit ever flooded?). It is verified by laboratory tests to IEC 60529 on prototypes and a leak test on every production unit.
- "Small" becomes: maximum board outline stated by the electronics designer as a limit, and an enclosure envelope that fits the space at the mounting point (question: what is the clear space around the pump's mounting pad, measured on site?). It is verified by a CAD clash check against a model of the pump and by a trial fit on a production pump.

The exact numbers may differ. What matters is that each line now has a value, a source or an assumption, a test and an owner.
