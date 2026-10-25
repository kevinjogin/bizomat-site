---
book: connected-products-by-the-numbers
chapterSlug: from-requirements-to-architecture
order: 2
title: "From requirements to architecture"
description: "Trace requirements through functions, logical blocks and physical parts, allocate an error budget, register the interfaces and use the trace to judge the impact of a change."
draft: false
---

A connected product is a system spread across several places: a sensor in a tank, a radio, a mobile network, a cloud platform and an app on a phone. Each piece can be designed well and the whole can still fail, because the pieces were designed against different assumptions about each other. The remedy is an architecture: a deliberate description of what the system must do, how that work is divided into parts and how the parts talk to each other, linked back to the requirements at every step.

This chapter builds the tank monitor's architecture using the requirements-functions-logical-physical approach common in systems engineering. It allocates the accuracy requirement into an error budget, records the interfaces between parts, and shows how the trace answers the question every product team faces repeatedly: if we change this, what else changes?

## Four views of one product

Systems engineers describe a product in four linked views. The names vary between organisations and handbooks, but the idea is consistent, and NASA's public *Systems Engineering Handbook* covers the underlying processes of requirements definition, logical decomposition and design solution definition.

```figure
type: layers
title: Four linked views of the tank monitor
caption: Each view answers a different question. Links between views let a change in one be traced to its effects in the others.
- Requirements | what the product must achieve, with numbers: R1 accuracy to R8 battery reporting
- Functions | what must happen, independent of how: measure distance, compensate temperature, decide alerts, send
- Logical blocks | how the functions group into parts that exchange defined flows of data, energy and material
- *Physical parts | the actual transducer, processor, radio module, battery, enclosure, platform services and app
```

The order matters. Jumping from requirements straight to physical parts, as most teams do under time pressure, tends to lock in the first technology considered. Writing the functions first, without naming parts, keeps alternatives open. Measuring distance to water could be done by ultrasound, radar, a pressure sensor at the bottom of the tank or a float. The functional view does not care, and the choice is made later with the alternatives in view.

## The functions

This is an illustration. The tank monitor's functions, written as verbs with objects and no technology:

- **F1** Measure the distance from a fixed point to the water surface.
- **F2** Measure the conditions that affect F1, such as air temperature.
- **F3** Convert distance to water depth and volume.
- **F4** Keep readings until they are delivered.
- **F5** Decide whether a reading needs an immediate alert.
- **F6** Deliver readings and alerts to the platform.
- **F7** Receive settings and software from the platform.
- **F8** Supply and manage energy for years.
- **F9** Report the device's own health.
- **F10** Store, analyse and present readings, and notify the owner.

Each function traces to at least one requirement. F5 and F6 trace to R5, the alert latency. F8 traces to R6, battery life. F9 traces to R8. A function with no requirement behind it is either missing a requirement or not needed.

## Logical blocks and physical parts

The logical view groups functions into blocks and defines what flows between them. The tank monitor has a sensing block (F1, F2), a processing block (F3, F4, F5, F9), a communications block (F6, F7), an energy block (F8) and a platform block (F10). The flows are named: echo timing and temperature from sensing to processing; message payloads from processing to communications; energy from the energy block to all others; settings and software from the platform back to the device.

Only then are physical parts chosen. This is an illustration. The sensing block became a sealed ultrasonic transducer with a driver circuit and a thermistor in the sensor's housing. Processing became a low-power microcontroller. Communications became an LTE-M module with an internal antenna. Energy became a primary lithium-thionyl chloride D cell with a buffer capacitor. The platform became a set of cloud services and a phone app. Some functions are split across physical parts. F3, converting distance to volume, is partly on the device, for the local alert decision, and partly on the platform, which holds the owner's tank dimensions.

## Choose the sensing principle with the alternatives in view

Because F1 was written without naming a technology, the team could compare principles on equal terms. This is an illustration. Four were considered for measuring the water level.

- **Ultrasonic time of flight from the roof.** No contact with the water, a single sealed unit installed from above and a well-understood principle. Its accuracy depends on the speed of sound, which changes with air temperature, and it has a minimum range close to the sensor.
- **Radar time of flight from the roof.** Also non-contact, largely unaffected by air temperature, but at the time of the decision its parts cost and power per reading were higher for the team's volumes.
- **Pressure at the tank floor.** Accurate and low in power, but the sensor sits submerged on a cable through the roof. It needs venting to atmosphere or a second sensor for barometric pressure, and it is in contact with drinking water, which raises material questions.
- **A float with a position sensor.** Simple in principle, but moving parts in a tank collect sediment and can stick, and installing a guide for the float in an existing tank is awkward.

The team scored each against the requirements and against installation, which the interviews had shown to be a major concern for owners who would fit the unit themselves. Ultrasonic won on installation and cost. Its weakness, temperature sensitivity, was known before the choice was made, and that is why F2, measuring the conditions that affect F1, appears as a separate function. Chapter 3 shows that the weakness is manageable with compensation. Radar was recorded as the alternative to revisit if part costs fell, and the architecture keeps the sensing block's interface to the processor general enough to allow it.

The record of this trade study matters as much as the choice. When a future team asks why the product uses ultrasound, the answer and its assumptions are written down, and they can see whether those assumptions still hold.

## Allocate the error budget

Requirement R1 says the depth must be within ±25 mm. That single number has to be divided between every physical cause of error, so that each part's designer knows their share. This is an error budget, and it is one of the most useful outputs of the architecture.

This is an illustration. The team listed five contributors and gave each a first allocation:

- timing resolution of the echo, ±2 mm;
- speed-of-sound error after temperature compensation, ±8 mm;
- installed height of the sensor above the tank floor, ±10 mm, measured by the installer with a tape;
- movement of the tank roof with temperature and loading, ±5 mm;
- ripple on the water surface from inflow, ±5 mm.

```figure
type: formula
title: The tank monitor's first error budget
formula: worst case = Σ |eᵢ|        root sum of squares = √(Σ eᵢ²)
caption: This is an illustration. The root sum of squares assumes the errors are independent and random. The installed-height error is a fixed offset for each tank, so the team removed it by calibration rather than relying on the statistics.
- Contributors | 2, 8, 10, 5 and 5 mm
step: worst case = 2 + 8 + 10 + 5 + 5 = 30 mm, over the 25 mm requirement
step: root sum of squares = √(4 + 64 + 100 + 25 + 25) ≈ 14.8 mm
step: with installed height calibrated to ±3 mm: worst case 23 mm, root sum of squares ≈ 11.3 mm
```

The worst-case sum exceeds the requirement, while the root sum of squares is well within it. Which to use depends on the nature of the errors. Random, independent errors rarely all reach their limits together, so the root sum of squares is a reasonable estimate of the combined spread. But the installed-height error is not random from reading to reading. It is a fixed offset in each installation, so a tank with a poorly measured height would read wrong by the same amount for its whole life.

The team's answer was to remove the largest contributor rather than argue about statistics. When the tank overflows, its water level is known exactly: at the overflow. The firmware detects a full tank from a sequence of readings that stop rising during rain, and the platform uses that event to correct the installed-height offset for that tank. With calibration bringing the installed-height error to about ±3 mm, the worst case becomes **2 + 8 + 3 + 5 + 5 = 23 mm**, inside the requirement even without the statistical argument.

## Register the interfaces

Most failures in a system happen at boundaries between parts designed by different people. An interface register lists every boundary, what crosses it, its units and limits, and who owns each side. For a connected product the register spans hardware, firmware, network and software.

This is an illustration. Part of the tank monitor's register:

```figure
type: compare
title: Part of the tank monitor's interface register
cols: What crosses | Units and limits | Owners
caption: This is an illustration. Each line is controlled: changing it needs agreement from both owners and a new revision of the register.
- Sensor to tank roof | mechanical thread and seal | 50 mm threaded port, IP67 | product designer and installer
- Transducer to processor | echo timing | microseconds, 0 to 15,000 | electronics and firmware
- Thermistor to processor | air temperature | °C, −20 to +80, ±1 K | electronics and firmware
- *Device to platform | reading message | depth in millimetres, integer; time in UTC | firmware and platform
- Platform to app | tank state | volume in litres, days remaining | platform and app
```

The device-to-platform message is the interface that most often goes wrong, because it connects firmware written by one person to platform code written by another, often months apart. It is defined in a written message specification with every field's name, type, units, range and meaning. Both sides test against that specification, not against each other's code.

## Use the trace to judge a change

The value of the architecture appears when someone proposes a change. This is an illustration. Six months into development, the platform developer suggested sending readings every two hours instead of hourly to halve network costs. The trace answered the question in minutes:

- **R4, reporting**, would be broken as written. It would need to be relaxed with the users' agreement.
- **R5, alert latency**, would be unaffected, because alerts are decided on the device (F5) and sent immediately, not with the regular batch.
- **R6, battery life**, would improve. Chapter 4 calculates by how much.
- **The leak-detection function in F10** would see the same readings, since sampling stays at 30 minutes, but would receive them later. A slow leak would be confirmed up to two hours later instead of one.

The team took the trade-off back to the users interviewed in Chapter 1. Most valued the hourly view, so the change was declined and the network cost was reduced instead by shrinking the message (Chapter 5). The decision and its reasons were recorded against R4.

## A failure case: the factor of ten

This is an illustration. On the first day of the internal trial, the app showed one tank holding about 2,250 L and another holding more than 220,000 L, from a 22,500 L tank. Both tanks were actually about two-thirds full.

The device sent water depth as an integer. The firmware developer, working from an early draft of the message specification, sent millimetres. The platform developer, working from a later draft that had been changed to save a byte, expected centimetres. A depth of 1,480 mm was read as 1,480 cm, giving an impossible volume. A second unit, with older firmware, sent depth in centimetres to a platform build that expected millimetres, giving a volume ten times too small.

The failure was detected because the platform's display showed volumes outside the tank's capacity, which anyone could see was wrong. It would have been harder to spot if the error had been a few per cent. Three corrections followed:

1. The message specification became a single controlled document with a revision number, and every message carries the specification revision it was built to.
2. The platform rejects and flags any message whose values fall outside their specified range, such as a depth greater than the tank's height, rather than displaying it.
3. An automated interface test sends known messages from a reference device to each new platform build, and checks the resulting volumes, before the build is released.

The broader lesson about who integrates the parts of a system is developed in [Systems integration: who makes the parts work together?](/reados/collections/business-systems-and-operating-rhythm/systems-integration-making-the-parts-work-together/). In a connected product, the integrator must own the interface register.

## How this applies to a small Australian business

A small team does not need an expensive modelling tool to work this way. A spreadsheet with requirements, functions, blocks and parts in linked columns, an interface register and a controlled message specification will carry a product a long way. What matters is that the links are kept current and used when changes are proposed. Teams using outside developers for firmware or the app should make the interface register and message specification part of the contract, so that every party builds to the same document.

## Exercise: the roof that moved

Field measurements show that some tank roofs move by up to ±12 mm with temperature, not ±5 mm. Recalculate the worst-case and root-sum-of-squares totals with the calibrated installed height (±3 mm). Does R1 still hold? If not, what could be done?

**Worked answer.** The contributors become 2, 8, 3, 12 and 5 mm. The worst case is **2 + 8 + 3 + 12 + 5 = 30 mm**, over the 25 mm requirement. The root sum of squares is **√(4 + 64 + 9 + 144 + 25) = √246 ≈ 15.7 mm**, within it. Roof movement with temperature is not random from reading to reading: it follows the daily temperature cycle, so a worst-case view is more appropriate for it. Options include mounting the sensor on a bracket fixed to the tank wall rather than the roof, correcting for roof movement using the measured air temperature if the relationship proves repeatable, or reallocating the budget by tightening another contributor, such as temperature compensation. The first is usually the most robust, because it removes the error rather than modelling it.
