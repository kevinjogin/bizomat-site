---
book: electronics-packaging-by-the-numbers
chapterSlug: release-a-package-production-can-build
order: 10
title: "Release a package production can build"
description: "Assemble one bill of materials across mechanical, electronic and firmware items, specify assembly and end-of-line leak and function tests, and control changes that cross disciplines."
draft: false
---

A product with electronics is released three times over: as mechanical drawings, as board manufacturing files and as firmware. Each discipline has its own tools and habits for release, and each can be correct on its own while the product as a whole is not. The board revision that passed the vibration test may not be the one in the production files. The firmware that ran the EMC test may not be the one loaded on the line. The lid drawing may still show the screw positions from before the antenna moved.

This chapter assembles the gearbox monitor's release package. It builds a single bill of materials across the disciplines, specifies the assembly sequence and the end-of-line tests, works through a leak test whose physics nearly undid it, and sets up a change process that sees across mechanical, electronic and firmware boundaries.

## One bill of materials

The bill of materials (BOM) is the backbone of the release. For a product with electronics, it must include every discipline's items in one structure, so that a single top-level part number and revision describes the whole product, including its firmware.

```figure
type: tree
title: The gearbox monitor's top-level bill of materials
caption: This is an illustration. Firmware is a BOM item with its own part number and version, loaded at a defined assembly step, so that a unit's build record states exactly which code it carries.
- Gearbox monitor assembly | top-level part number and revision
  - Base sub-assembly | machined casting, vent, M12 receptacle with leads, laser-marked label panel
  - Board assembly | bare board, components, staking adhesive, thermal pad
    - Firmware image | part number and version, loaded at the function test
  - Lid sub-assembly | moulded polycarbonate lid, closed-ring silicone seal
  - Fasteners | six shouldered lid screws, five board screws and washers
  - Stainless spacer | supplied in the installation kit, not fitted in the factory
  - Installation kit | spacer, M8 stud, coupling grease, torque tool, instructions
```

The structure reflects how the product is built and supported. The base sub-assembly is prepared first because the connector and vent must be fitted and torqued before the board goes in. The board assembly arrives from the board assembler already staked and inspected, as Chapter 9's corrective action required. The firmware sits under the board assembly because it is loaded into the board's processor. The installation kit is a separate item because it ships with the unit but is fitted on site.

Every item has one part number and one revision, owned by the discipline that designs it. The top-level revision changes whenever any item below it changes in a way that affects form, fit, function or compliance.

## Specify the assembly, not just the parts

The mechanical drawings define the parts. The assembly specification defines how they come together, including anything that, done wrongly, would not be visible afterwards. For the gearbox monitor it states:

- **The order**, as modelled in Chapter 2: connector and vent into the base, thermal pad, board, board screws, flying leads and tie, seal, lid.
- **Every torque**, taken from the fastener, connector and vent makers' data, with the tool and its calibration interval.
- **Every material applied in assembly**: the staking adhesive (applied by the board assembler), the thread-locking compound for the board screws and the coupling grease for the installer.
- **Handling of the seal**: the closed-ring seal is fitted into the groove without stretching, and the groove and seal are checked for dust and damage immediately before the lid is fitted.
- **Inspection points**: staking present, leads tied, seal seated, all screws torqued.

Each step that a test cannot later detect, such as a missing thread-locker, gets an inspection point with a record. Steps that a later test will detect, such as a misplaced seal that the leak test will reveal, need less inspection.

## Test every unit before it ships

Prototype tests prove the design. End-of-line tests prove each unit was built to it. They must be fast, repeatable and able to detect the faults that assembly can introduce. The gearbox monitor has two end-of-line tests.

**A functional test** through the M12 connector. A fixture supplies 24 V, enters the firmware's test mode, loads the released firmware if needed, reads the sensors and checks the radio module registers on a test network. A small handheld reference shaker held against the base checks that the accelerometer responds with the expected amplitude. The test records the unit's serial number, board serial number, radio module identity, firmware version and every reading.

**A leak test** by pressure decay. The enclosure is pressurised slightly through a test port, isolated and the pressure is watched. If it falls by more than a limit within a set time, the unit leaks.

The vent complicates the leak test, because a membrane vent is designed to pass air. The gearbox monitor is therefore leak-tested through the vent's threaded hole before the vent is fitted, with a test adapter screwed into that hole. The vent is fitted after the test, and its own O-ring seal is checked by a torque-and-inspect step.

## The physics of a leak test

```figure
type: formula
title: Pressure decay leak test for the gearbox monitor
formula: Q = V × Δp ÷ Δt        Δp from temperature = p_abs × ΔT ÷ T
caption: This is an illustration. The free volume and limits are the team's; the reject limit was set by testing units with a calibrated leak. Temperature drift of a fraction of a kelvin produces a pressure change comparable to the limit.
- V | free internal volume, about 150 cm³ = 150 × 10⁻⁶ m³
- Test pressure | 10 kPa above atmospheric, about 111.3 kPa absolute
- Reject limit | decay of more than 50 Pa in 20 s
step: Q = 150 × 10⁻⁶ × 50 ÷ 20 ≈ 3.75 × 10⁻⁴ Pa·m³/s, about 3.75 × 10⁻³ mbar·L/s
step: a 0.1 K fall in air temperature: Δp ≈ 111,325 × 0.1 ÷ 293.15 ≈ 38 Pa
```

The reject limit corresponds to a leak rate of about **3.75 × 10⁻⁴ Pa·m³/s**. That number does not come from the IP standard. The team found it by testing DVT units that had passed the laboratory IP tests, and units with a calibrated leak deliberately introduced. Units with leaks large enough to fail the hot-day and hose-down cycle decayed well beyond 50 Pa in 20 s, and good units decayed well below it. The limit sits between the two groups with a margin on each side.

The second line of the formula is the trap. A change in the air temperature inside the enclosure changes its pressure in proportion to the absolute temperature. At about 111.3 kPa absolute, a fall of only **0.1 K** lowers the pressure by about **38 Pa**, three-quarters of the reject limit. A unit that is cooling slightly during the test looks like a leaking unit.

## A failure case: the afternoon leaks

This is an illustration. In the first production week, the leak test rejected about 2% of units in the morning and about 15% in the afternoon. Units that were rejected in the afternoon and retested the next morning nearly all passed. The design had not changed, and neither had the assembly method.

The pattern pointed to temperature. The bases arrived from the machining supplier and sat in a goods-in area near a roller door on the western side of the building. In the afternoon, the sun warmed the stacked bases several degrees above the air temperature in the assembly cell. Assembled straight from the stack and placed on the leak tester, each warm base cooled during the 20-second test, and the air inside it cooled with it.

The corrections were to move incoming bases into the assembly area at least four hours before use, to add a 30-second stabilisation period after pressurising and before measuring, and to log the part temperature with an infrared thermometer at the test station. The afternoon reject rate fell to the morning level. Some leak testers also compare the test part with a sealed reference volume at the same temperature, which cancels much of this effect. The team noted that option for higher volumes.

The lesson is general. A test limit derived from physics must also allow for the physics that is not the thing being tested. The release package now states the stabilisation time and the permitted part temperature range alongside the leak limit.

## Trace every unit

Each gearbox monitor carries a laser-marked serial number on its label panel. The functional test links that serial number to the board serial, the radio module identity, the firmware version, the test results and the leak test record. When a field unit reports a fault, the team can find exactly what it contains and how it tested. When a supplier reports a problem with a batch of components, the team can find every unit that used it. The general methods are described in [Product traceability in manufacturing](/reados/collections/manufacturing-quality/product-traceability-in-manufacturing/).

## Release the firmware with the hardware

Firmware changes more often than hardware, and it can be updated in the field. That makes it tempting to treat it as a separate product with its own release cycle. The risk is that a firmware version reaches units it was never tested on, or that a hardware revision ships with firmware that does not know about it.

The gearbox monitor's rule is that every released firmware version states the hardware revisions it supports, and every hardware revision states the minimum firmware version it needs. The functional test checks both before a unit ships, and the field-update system refuses to send a version to a unit whose hardware revision it does not list. The firmware also reports its own version and the hardware revision in every message, so the installed fleet's configuration is always known. The companion book on connected products covers field updates in detail. For the mechanical designer, the point is that a change to the board, even a resistor value, can need a firmware change, and the change process must see both.

## Release the installation as well as the product

The gearbox monitor is only as good as its installation, as Chapters 6 and 7 showed. The installation instructions are therefore a released document with a part number and revision, listed in the BOM under the installation kit and changed through the same process as the drawings.

The released instructions include the isolation and lockout requirement, the pad preparation and flatness, the spacer and stud with their torque, the permitted orientations, the cable route with drip loop and clamp, the signal check with guards closed and the commissioning record with photographs. Each instruction can be traced to a requirement or a lesson from the trials. When an installer asks why a step exists, the answer is in the design record, and when a step causes trouble in the field, the change process can revise it as precisely as a drawing.

## Plan for units that come back

Some units will come back from the field: damaged in an accident, failed in service or returned for checking. The release package plans for them from the start, because a returned unit is the best evidence the team will ever get about real conditions.

Each returned unit is logged against its serial number and examined in a set order before anything is disturbed: external damage, connector and cable condition, a leak test as received, a functional test as received, then opening the lid and inspecting the seal, vent, board and internal leads. The order matters. Opening a unit before leak-testing it destroys the evidence of whether it leaked. The findings are compared with the unit's build record and its last messages from the field.

The team decided at release that units would not be repaired in the field. A failed unit is replaced, and the failed one is returned for examination. That keeps the factory's leak and functional tests as the only proof of a sealed, working unit, and it means every failure reaches the people who can learn from it.

## Control changes across disciplines

After release, every change goes through one change process, whichever discipline proposes it. The process asks the same questions for every change:

1. **What does it touch?** A change to one discipline's item can affect another's. Moving a lid screw affects the antenna keep-out. Changing a regulator affects heat, EMC and the supply-voltage range.
2. **Does it affect compliance?** The compliance file records the tested configuration. A change to anything that the evidence depended on needs an assessment and possibly new tests, as the exercise in Chapter 8 showed.
3. **Which tests must be repeated?** The test plan from Chapter 9 is traced to the requirements, so the affected requirements point to the affected tests.
4. **From which unit does it apply?** Every change states its effectivity, the serial number or date from which it is built, so that service and traceability records stay correct.

```figure
type: checklist
title: Release review for the gearbox monitor
caption: This is an illustration. The release is signed off only when every line is closed or formally accepted as a deviation with a reason.
- Every requirement in the brief traced to a passed test or analysis | test reports on file
- Single BOM covering mechanical, board and firmware items | firmware version is a BOM item
- Assembly specification with order, torques, materials and inspection points | staking on the board drawing
- End-of-line functional and leak tests with limits, stabilisation and temperature range | limits set from DVT and calibrated leak
- Compliance file matches the released configuration | module, antenna, connector, label
- Installation instructions and kit tested by installers in the field trial | orientation, torque, drip loop, signal check
- x Releasing firmware separately from the hardware revision it was tested on | one product revision
```

## How this applies to a small Australian business

Small teams often keep firmware on a developer's laptop and board files in an email thread. A single BOM that includes the firmware version, kept in the same revision-controlled system as the drawings, removes a whole class of mistakes at very little cost. If production is outsourced, the release package is the contract: the contract manufacturer will build what the documents say, not what the designers intended. Australian manufacturing sites vary widely in temperature through the day and the year, so any test that depends on pressure, dimensions or temperature should state its stabilisation conditions.

## Exercise: tightening the leak limit

The customer asks whether the leak limit could be halved to 25 Pa in 20 s for extra assurance. If the leak tester measures to ±2 Pa and the part temperature is held stable to ±0.02 K during the test, is the tighter limit workable? What leak rate would it correspond to?

**Worked answer.** A temperature change of **0.02 K** produces about **111,325 × 0.02 ÷ 293.15 ≈ 7.6 Pa**, so together with the tester's ±2 Pa the measurement uncertainty is about ±9.6 Pa in the worst case. A 25 Pa limit leaves good units decaying perhaps 5 Pa only about 10 Pa of clearance, which is workable if temperature stability is genuinely held to ±0.02 K. That needs controlled stabilisation, or a reference-volume tester. The limit corresponds to **Q = 150 × 10⁻⁶ × 25 ÷ 20 ≈ 1.9 × 10⁻⁴ Pa·m³/s**. Before adopting it, the team should retest the calibrated-leak units to confirm that the tighter limit separates good and bad units without rejecting good ones. A tighter limit that mainly rejects good units adds cost, not assurance.
