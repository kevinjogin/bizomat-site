---
book: connected-products-by-the-numbers
chapterSlug: firmware-you-can-test-before-the-board
order: 6
title: "Firmware you can test before the board"
description: "Structure device firmware as a testable state machine, climb from model to hardware-in-the-loop testing before boards arrive, and design field updates that cannot strand a device."
draft: false
---

In a connected product, the firmware decides almost everything the user experiences: when the device wakes, what it measures, how it compensates, when it alerts, how hard it tries to reach the network and whether it survives a software update in the field. Firmware is also the part most often left until the hardware arrives, because it seems to need the hardware to run. That habit makes firmware the critical path. Problems that could have been found in the first month are found after the circuit boards are built, when fixing them may mean another board revision.

This chapter structures the tank monitor's firmware so that most of it can be tested before any board exists. It climbs the ladder from model to hardware-in-the-loop testing, then designs the field update process, the riskiest thing a connected device does. The failure case is an update that stranded three devices on tank roofs.

## A state machine, not a loop

Firmware for a low-power device is best written as a small number of clearly defined states with explicit transitions. Each state has an entry action, a time limit and defined exits. This makes the device's behaviour easy to reason about and, more importantly, easy to test, because each transition can be exercised on its own.

```figure
type: cycle
title: The tank monitor's main operating cycle
caption: This is an illustration. Every state has a time limit enforced by a hardware watchdog; a state that overruns causes a reset into Sleep with the fault recorded and reported in the next message.
- Sleep, real-time clock running, radio in power-saving mode
- Measure, eight pings and two temperatures every 30 minutes
- Decide, compensate, check thresholds and quality flags
- *Transmit, hourly batch or an immediate alert, effort capped
- Receive, apply queued settings or schedule an update
- Return to Sleep and record the charge used
```

Two design rules matter most.

**Every state has a time limit.** The radio may never stay awake indefinitely waiting for a network that does not answer, which is what drained the batteries in Chapter 4. The firmware's own timers enforce the limits, and an independent hardware watchdog resets the processor if the firmware itself hangs. A watchdog reset is recorded and reported, because a device that resets silently can hide a fault for months.

**Decisions use data, not timing accidents.** The Decide state takes the readings and the settings as inputs and produces an action as output. It does not read hardware directly. That separation is what allows the decision logic to be tested on a desktop computer long before the hardware exists.

## Design the unhappy paths first

Most firmware effort goes into the normal cycle, but most field trouble comes from the abnormal ones: the echo that never returns because a spider has built a web on the transducer, the thermistor that reads open-circuit after water gets into its cable, the network that accepts a message and then never acknowledges it, the cell that sags below the processor's operating voltage. Each needs a defined response, decided in advance and written into the state machine.

The tank monitor's rule is that a failed measurement is reported as a failure, never replaced by a guess. If no valid echo arrives, the reading is sent with a quality flag that says so, and the platform shows a gap with a reason rather than a made-up level. If a thermistor fails, the device falls back to the other thermistor, flags the reading as reduced accuracy and asks for service. If the supply falls too low to transmit safely, the device stops transmitting, keeps measuring and storing, and tries again when the cell recovers in the warmth of the day. Each of these paths has its own tests on every rung of the ladder below.

## The test ladder

Model-based development tests the same logic at increasing levels of realism, from a model on a desktop computer to the real board with simulated surroundings. The value is that most errors are found on the lower rungs, where each test takes seconds, not on the top rung, where each test needs the hardware and takes minutes or hours.

```figure
type: compare
title: The tank monitor's firmware test ladder
cols: What runs | What it finds | When it was available
caption: This is an illustration. The board arrived in week 14; by then the compensation, alert and message logic had passed about 2,000 automated tests on the lower rungs.
- Model in the loop | the algorithm as a model or script, fed recorded and simulated echoes | wrong maths, wrong thresholds, edge cases | week 2
- Software in the loop | the production source code compiled for a desktop computer, same test cases | coding errors, rounding, overflow | week 4
- Processor in the loop | the code on the target processor on a maker's development kit | timing, memory, stack use, power modes | week 6
- *Hardware in the loop | the real board, with a rig simulating echoes, temperature, supply and network | integration faults, real timing, brownout behaviour | week 14
```

The test cases are the same on every rung wherever possible. This is an illustration. The echo-processing tests include simulated echoes at round-trip times from about **1.46 ms**, a 0.25 m air gap at 20 °C, to about **14.3 ms**, a 2.46 m gap, at temperatures from −5 °C to +60 °C. Each test has an expected depth computed independently from the speed-of-sound formula of Chapter 3, and a tolerance taken from the error budget of Chapter 2. A rounding error in the compensation that shifts the answer by 3 mm fails the same test on the desktop in week 4 that it would have failed on the board in week 14.

The hardware-in-the-loop rig is worth describing because it is cheap. It is the real board on a bench, with a small signal generator injecting synthetic echoes into the receiver at controlled delays, a resistor network in place of each thermistor, a programmable power supply that can sag and dip like a tired cell and a network simulator, or simply a radio shielded in a metal box to simulate poor coverage. It found three problems the lower rungs could not: a brownout during a radio peak at low supply voltage, a timer that drifted when the processor changed power modes and a message that was correctly built but sent twice when the network acknowledged it late.

## Logs that survive the field

A device on a tank roof cannot be debugged with a cable. The firmware therefore keeps a small diagnostic log in non-volatile memory: resets and their causes, watchdog events, failed transmissions, the longest time spent in each state and the lowest supply voltage seen. A summary goes out with each message, a few bytes, and the full log can be requested by the platform. The design cost is small. The value appears the first time a field unit behaves oddly, as it did in Chapter 3's temperature case and in the failure below.

## Settings are part of the software

Some behaviour is better changed by a setting than by new firmware: the alert thresholds an owner chooses, the reporting interval, the tank's dimensions and the effort cap on the radio. Settings are sent from the platform and stored on the device, and they change behaviour as surely as code does. They need the same discipline.

This is an illustration. Every setting in the tank monitor has a defined type, unit, range and default in the message specification. The device rejects a setting outside its range and reports the rejection, rather than applying it. A reporting interval of 0 minutes, entered by mistake in an early platform build, would otherwise have kept the radio permanently awake and flattened the battery in days. The device also keeps the last accepted set of settings and can revert to defaults on command, so that a bad combination can be undone remotely.

Settings are tested on the ladder like code. The software-in-the-loop tests include every setting at its minimum, maximum and default, and a set of invalid values that must be rejected. The platform keeps a history of every setting sent to every device and every acknowledgement, so the state of any unit can be reconstructed when a support question arrives.

## Know exactly what is running

A fleet of devices in the field will run several firmware versions at once, because updates roll out in stages and some units are offline when an update is sent. The team must be able to say exactly which code each unit runs and how that code was built and tested.

The tank monitor's firmware versions follow three rules. Each release has a unique version number, carried in every message, as Chapter 5's message design provides. Each release is built from a tagged revision in the source repository by an automated build, so the same source always produces the same image. And each release has a record listing the requirements it affects, the test results on every rung of the ladder and the hardware revisions it supports. The last rule links to the release package in the companion book: firmware is a controlled item in the product's bill of materials, not a file on a developer's laptop.

When a field problem appears, these rules let the team answer the first three questions in minutes: which units have the problem, which version they run and what changed in that version.

## Updating firmware in the field

Every connected product will need its firmware changed after it ships: to fix faults, to improve algorithms such as the temperature compensation, and to apply security fixes that, as Chapter 8 explains, Australian consumer products must provide for their published support period. Updating a device in the field is also the riskiest thing it does. If an update fails halfway through and the device cannot recover, it becomes a brick on a tank roof, and someone has to climb up and replace it.

The standard protection is to hold two complete firmware images, the running one and the new one, and switch between them only when the new one has proved itself.

```figure
type: formula
title: Memory and energy for an A/B firmware update
formula: flash needed = bootloader + 2 × image + data        download charge = current × time
caption: This is an illustration. Effective throughput on LTE-M depends on signal and network; 50 kbit/s is an assumption for a good site.
- Bootloader | 32 kB
- Firmware image | 180 kB, two copies
- Settings, logs and stored readings | 64 kB
- Download | 180 kB at an assumed 50 kbit/s effective, 150 mA average
step: flash needed = 32 + 2 × 180 + 64 = 456 kB, so a 512 kB device leaves about 56 kB of margin
step: download time ≈ 180 × 8 ÷ 50 ≈ 28.8 s
step: charge ≈ 150 mA × 28.8 s ÷ 3,600 ≈ 1.2 mAh, about a third of a day's normal budget
```

The energy cost of an update is small, about a third of a day's normal charge. The memory cost is large: two copies of the image dominate the flash. That is a hardware requirement the firmware design imposes, and it must be known before the processor is chosen. A device chosen with 256 kB of flash could not have held two images of this size at all.

## A failure case: three devices that did not come back

This is an illustration. The first field update went to all 40 pilot units at once, scheduled at 2 am to avoid disturbing anyone. Thirty-seven reported back with the new version within the hour. Three did not report again.

The team retrieved the three units. All had partially written firmware in the new image's memory area and were stuck in a reset loop. The logs on a fourth unit, which had updated successfully, showed the supply voltage dipping close to the processor's brownout threshold during the update. The update had erased and written flash while the radio was still active, at 2 am on a cold morning, when the cell's ability to deliver current was at its lowest.

Three design faults combined:

1. **The bootloader switched to the new image as soon as it was written**, before checking that the whole image had arrived intact and was signed. A brownout during the final write left an incomplete image marked as current.
2. **There was no trial boot.** The new image was not required to confirm that it was working before becoming permanent, so there was no automatic return to the old image.
3. **The update went to every unit at once**, so a fault that affected some conditions affected every unit in those conditions.

The corrections addressed each in turn. The bootloader now checks the complete image's integrity and signature before marking it bootable. The new image boots on trial and must confirm itself, by completing a measurement and a successful transmission, within three boots. Otherwise the bootloader returns to the old image and reports the failure. The device checks preconditions before starting: supply voltage under load above a threshold, temperature above 5 °C and adequate signal. If any check fails, it postpones and tries again at the next check-in. Updates are scheduled in the middle of the day, when cells are warmest. And updates are rolled out in stages: 5% of the fleet first, then 25%, then the rest, with a pause at each stage to check the fleet's health reports.

The detection worked only because the platform tracked which version each unit reported. Three units missing after an update stood out at once. Without version reporting, they might have looked like ordinary coverage dropouts for days.

## How this applies to a small Australian business

Small teams often have one firmware developer, and that person's time is the scarcest resource on the project. The test ladder protects it: logic tested on a desktop in week 4 does not need debugging on a tank roof in month 14. The hardware-in-the-loop rig can be built from bench equipment most electronics workshops already have. For updates, treat the two-image design, signed images, trial boot and staged rollout as non-negotiable from the first version, because the first field update is usually the one that goes wrong, and a recall in remote areas is expensive.

## Exercise: a bigger image

A future feature, adding the radar sensor considered in Chapter 2, is expected to grow the firmware image to **240 kB**. With the same bootloader and data allowances and a 512 kB device, does the A/B scheme still fit? How long would the download take at the same assumed throughput, and what would it cost in charge?

**Worked answer.** Flash needed is **32 + 2 × 240 + 64 = 576 kB**, which exceeds 512 kB by 64 kB. The scheme no longer fits. The options are a device with more flash, an external flash chip to hold the second image or a smaller image, for example by moving data tables out of the image. The first two need a board change, which is why the margin was worth checking at the start. The download would take **240 × 8 ÷ 50 ≈ 38.4 s** and use about **150 × 38.4 ÷ 3,600 ≈ 1.6 mAh**, still a small fraction of a day's budget.
