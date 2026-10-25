---
book: electronics-packaging-by-the-numbers
chapterSlug: plan-compliance-in-the-design
order: 8
title: "Plan compliance in the design"
description: "Work out which Australian regimes apply to a connected product, build EMC and safety features into the enclosure and cable entry, and pre-scan before the laboratory."
draft: false
---

Compliance is often treated as a test at the end of a project, booked once the product is finished. By then, the features that decide whether it passes are fixed: how the enclosure is grounded, where the cable shield ends, which parts a person can touch, how much space the label has. A product that fails its electromagnetic compatibility (EMC) test at the end usually needs a mechanical change, and that means new tooling, new prototypes and a second test booking.

This chapter treats compliance as a set of design requirements. It identifies the regimes that apply to the gearbox monitor in Australia, shows the mechanical features that make EMC and safety achievable, describes a cheap in-house pre-scan, and works through a failure the pre-scan found. It is a map for designers, not legal advice. The regulators' own guidance and an accredited test laboratory are the authorities.

## Which regimes apply

Start by listing what the product is and does. The gearbox monitor contains electronics, so it can emit and be affected by electromagnetic interference. It contains a radio transmitter. It connects to a public mobile network. It is powered at 24 V d.c. from a separate power supply. It is sold to businesses for use on industrial plant, not to households.

```figure
type: tree
title: Regimes the team checked for the gearbox monitor
caption: This is an illustration of the team's scoping, confirmed with a test laboratory. It is not a complete list for every product, and the regulators' current guidance governs.
- Gearbox monitor
  - ACMA arrangements | supplier registers, tests, keeps records and labels
    - Electromagnetic compatibility | emissions and immunity for its environment
    - Radiocommunications | the LTE-M transmitter, including exposure arrangements
    - Telecommunications | equipment connecting to a public network
  - Electrical safety | 24 V d.c. is extra-low voltage
    - Outside EESS registration scope | below 120 V ripple-free d.c.
    - Still must be electrically safe | the external power supply is a separate product
  - Smart-device security standard | applies to consumer products
    - Industrial product, not for household use | checked and recorded as out of scope
  - Workplace health and safety | installation on running plant
```

**The Australian Communications and Media Authority (ACMA)** regulates radiocommunications, telecommunications and EMC. Its guidance for suppliers states the core duties: arrange any required testing, register as a responsible supplier on the national database, obtain and keep compliance records and make them available on request, and label products as required. The Regulatory Compliance Mark (RCM) is the label used to show compliance. Which standards and labelling notices apply depends on the product, and the ACMA's guidance and a test laboratory determine that.

**Electrical safety** for in-scope electrical equipment is registered under the Electrical Equipment Safety System (EESS). Its definitions exclude extra-low-voltage equipment operating below 50 V a.c. or 120 V ripple-free d.c. The gearbox monitor runs at 24 V d.c., so it is outside EESS registration. The EESS guidance notes that equipment outside scope must still be electrically safe. The mains-powered 24 V supply in the control cabinet is a separate product with its own compliance.

**The smart-device security standard** made under the *Cyber Security Act 2024* applies from 4 March 2026 to connectable products intended or likely to be acquired for personal, domestic or household use. The gearbox monitor is an industrial product sold to businesses. The team recorded that conclusion and its reasons in the compliance file, and still adopted the standard's practices, unique credentials and a published way to report security issues, because they are good engineering. The companion book [Connected Products by the Numbers](/reados/publications/connected-products-by-the-numbers/) covers the standard for a consumer product.

**Workplace health and safety** applies to the people installing and maintaining the product, not to the product's certification. Installing a monitor on a conveyor gearbox means working near moving machinery, so the installation instructions require the conveyor to be isolated and locked out under the site's procedures. They also forbid mounting the monitor anywhere that requires a guard to be removed or modified.

## A pre-certified module is not a certified product

The LTE-M radio module was bought already tested by its maker. That simplifies the radio side, but it does not certify the gearbox monitor. The module's test reports apply to the module with stated antennas, power supply conditions and installation constraints. The finished product adds its own board, switching regulator, cable and enclosure, all of which affect emissions and immunity. The module's reports become part of the evidence for the product, and the laboratory decides what further testing they allow the product to skip.

Network operators may also have their own device approval or certification processes for equipment that joins their networks. The team asked the chosen operator early what it required for an LTE-M device using a pre-approved module, because the answer affected the schedule.

## Build EMC into the enclosure

EMC has two halves: the product must not emit too much interference, and it must keep working in the presence of interference. The gearbox monitor's environment is industrial, with variable-speed drives, contactors and long cable runs, and the relevant generic EMC standards for industrial environments, the IEC 61000-6-2 immunity and IEC 61000-6-4 emission documents, were named in the compliance plan as the expected basis. The laboratory confirmed the final list.

The mechanical design contributes in five places.

1. **The metal base as a shield.** The die-cast aluminium base surrounds the board on five sides except at the antenna end. It is left unpainted on the inside and at the lid flange so that it forms a continuous conductive shell. The polycarbonate lid provides no shielding, which the antenna needs, so sensitive circuits are placed on the board away from the lid's window.
2. **A clean entry for the cable.** Interference enters and leaves mainly along cables. The M12 connector is metal-bodied and mounted on an unpainted, spot-faced face of the base, so the cable shield connects to the base all the way round, as described in Chapter 6. The input filter components on the board are placed immediately behind the connector, so interference is filtered before it reaches the rest of the board.
3. **Short ground paths.** The board's ground connects to the base through plated mounting holes at the standoffs nearest the connector, so the path from cable shield to board ground is a few millimetres long, not a loop around the board.
4. **Electrostatic discharge.** People touch products, and a charged person's discharge can upset or damage electronics. The IEC 61000-4-2 test method applies discharges to touchable points. The lid screws are recessed and the metal base is grounded through the stud to the gearbox. The gap between the lid and the board is designed so that a discharge to the lid edge jumps to the grounded base, not to the board.
5. **The internal leads.** The flying leads from the connector run along the base wall, close to the metal, and are kept away from the antenna and the accelerometer, as Chapter 6 required.

## Pre-scan before you pay for the laboratory

Accredited EMC testing takes laboratory time, and a failure means a second booking. Many problems can be found earlier with simple equipment. A near-field probe set and a spectrum analyser, or a low-cost receiver, can locate the main emission sources on a board and compare design changes, even though the readings cannot be compared directly with the standard's limits. A rented electrostatic discharge generator can show whether the product resets when the lid edge is zapped.

```figure
type: timeline
title: The gearbox monitor's compliance plan
caption: This is an illustration. Pre-scans run on every prototype build. The formal tests are booked once the design is frozen, with the pre-scan results sent to the laboratory beforehand.
- Brief | List regimes | scope confirmed with a test laboratory; operator asked about device approval
- Prototype 1 | First pre-scan | near-field scan of the open board and the closed enclosure
- Prototype 2 | Fix and re-scan | shield termination and input filter changed
- *Design freeze | Formal tests | EMC, radio and any operator testing on production-intent units
- Release | File and label | records kept, supplier registered, RCM on the label
```

## A failure case: the cable that radiated

This is an illustration. The first pre-scan of the closed gearbox monitor, with 5 m of supply cable attached, showed a series of emission peaks spaced at the switching frequency of the 24 V regulator, strongest in a band where the team expected the emission limits to be tight. The near-field probe found them weakest over the board and strongest along the first half-metre of cable.

The cable was acting as an antenna for the regulator's switching noise. Two details allowed it. The prototype connector was plastic-bodied, and its shield was brought inside on a 60 mm pigtail of wire to a board pad near the regulator. A pigtail of that length has enough inductance at high frequencies that the shield is barely connected at all where it matters, so the cable radiated as if unshielded. And the input filter was on the far side of the board, so the noise reached the connector before any filtering.

The corrections were mechanical and electrical together: the metal-bodied connector with the shield bonded all the way round to the unpainted base, a common-mode choke and capacitors placed immediately behind the connector, and the regulator moved away from the connector end. The re-scan showed the peaks about **12 dB** lower, measured on the same set-up. Because pre-scan readings are relative, the team treated that as evidence of improvement, not as a pass. The formal test later confirmed the margin.

## Prepare what the laboratory needs

A formal test session runs faster and costs less when the laboratory receives the right units and documents in advance. For the gearbox monitor, the test request included:

- **Units in the tested configuration**, built from production-intent parts, with their board, enclosure and firmware revisions recorded, plus a spare in case one is damaged.
- **A test mode in the firmware** that makes the radio transmit continuously or on command and runs the processor and sensors in a representative state, so the laboratory can measure worst-case emissions without waiting for the normal reporting schedule.
- **The cable and power supply** used in service, with the cable length the standard's set-up requires, because the cable is part of the system under test.
- **Operating and monitoring instructions**, so that the laboratory can tell during an immunity test whether the product is still working. For the monitor, that meant a laptop connection showing live readings and message counts.
- **The pre-scan results and the module's reports**, so the laboratory can focus on known risks and reuse what the module evidence covers.

The firmware test mode deserves a note for the mechanical designer. It must be reachable without opening the enclosure, because opening it changes the configuration under test. The gearbox monitor enters test mode through a command on the M12 connector's data line, set up during production test, not through a button under the lid.

## Make room for the label

The label is small, but it is a compliance item with mechanical consequences. It must carry the RCM and any supplier identification the applicable labelling notice requires, the product's identification and any information the installer needs. It must stay legible for the product's life in sun, dust and hose-downs.

The gearbox monitor's label is laser-marked into a recessed panel on the aluminium base's side wall, where it is shielded from direct sun and abrasion. The polycarbonate lid carries only a moulded-in logo, away from the antenna. Laser marking cannot peel, fade or be cleaned off, and it keeps metallic label materials out of the antenna zone.

## Keep the records

A supplier must be able to show the evidence of compliance when asked. The compliance file for the gearbox monitor holds the scope decisions and their reasons, the module maker's reports, the laboratory reports for the product, the declaration documents the applicable rules require, the label artwork and the configuration that was tested. The configuration matters, because a later change to the enclosure, the antenna, the board or the cable can invalidate the evidence. Chapter 10 links the change process to the compliance file for that reason.

```figure
type: checklist
title: Compliance features checked at design freeze
caption: This is an illustration of the gearbox monitor's design-freeze review.
- Regimes listed with scope reasons recorded | including those judged out of scope
- Metal base continuous and unpainted at the flange and connector face | shield and bond paths
- Cable shield bonded all round at the entry, filter directly behind it | pre-scan confirmed
- Discharge to touchable points reaches ground, not the board | in-house discharge trial
- Label space, content and durability | laser-marked recessed panel
- ? Operator device approval for the chosen module | operator's written answer awaited
- x Treating the module's reports as the product's certification | product testing still required
```

## How this applies to a small Australian business

The regulators publish clear supplier guidance, and an hour reading it at the brief stage is the best compliance investment a small team can make. Talk to an accredited test laboratory before the first prototype, not after. Laboratories will usually review a design and advise on the likely test plan, and their advice on the cable entry and grounding is often worth more than the test itself. Budget for at least one round of fixes between pre-scan and formal test, and keep every pre-scan result with the design record.

## Exercise: three cost-saving changes

After the gearbox monitor is released, the purchasing team proposes three changes to save cost: a plastic M12 connector instead of the metal one, a different LTE-M module from another maker with the same footprint and a printed polyester label instead of laser marking. For each, say which compliance evidence it could affect and what should happen before it is approved.

**Worked answer.** The **plastic connector** removes the 360° shield bond that fixed the emission failure, so it could affect EMC emissions and immunity. It also changes the seal at the wall. It needs a pre-scan comparison against the released design, likely formal EMC retesting and a repeat of the seal tests. The **different module** changes the radio, its certification, its antenna integration and its emissions. The radio compliance evidence, any operator approval, the antenna tests of Chapter 7 and the EMC tests would all need review, and some would need repeating. The **printed label** affects label durability and possibly the antenna if its materials are metallic. It needs a check that the content still meets the labelling requirements and a durability test in sun and hose-down. All three go through the change process in Chapter 10, with the compliance file updated before release.
