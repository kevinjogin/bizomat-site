---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: cold-junctions-and-extension-cable
order: 3
title: "Cold junctions, extension cable and thermocouple tolerances"
description: "Cold-junction compensation, extension and compensating cable, reversed and copper leads, tolerance classes and drift, and an over-temperature limit that tripped 25 K late."
draft: false
---

A thermocouple measures a difference: the temperature at its junction relative to the temperature where its alloy wires end and copper begins. Everything the instrument does to turn that difference into an absolute temperature depends on knowing where the alloy wires end and how hot that place is. Get either wrong and the reading is wrong by roughly the size of the mistake, with nothing on the display to show it.

This chapter deals with that cold end. It explains how instruments compensate for the cold junction, what extension and compensating cables are for, and what happens when the cable is copper or connected backwards. It then sets out the tolerance classes that say how far a new thermocouple may be from its reference function, the drift that moves it further in service, and an over-temperature limit in CV-180 that was wired with the wrong cable and passed every check it was given.

## Cold-junction compensation

As Chapter 2 showed, a type K thermocouple with its junction at 180 °C and its cold ends at 25 °C produces 6.340 mV, the voltage between those two temperatures. To report 180 °C, the instrument must know that its cold ends are at 25 °C and add the voltage the thermocouple would have produced between 0 °C and 25 °C, which is 1.000 mV. This addition is **cold-junction compensation**, and it relies on a second sensor, usually a thermistor or a small platinum element, mounted on the instrument's terminal block.

Two conditions make it work. The thermocouple wires must end at the terminal block, so that the block really is the cold junction; and both terminals must be at the temperature the compensation sensor reports. Instruments meet the second condition with an **isothermal block**: a mass of metal or a thermally conductive moulding that holds the terminals and the sensor at one temperature. Where the terminals sit on an ordinary circuit board next to a warm regulator, or where a cold draught blows across one terminal and not the other, the condition fails.

Any error in the compensation passes almost directly into the reading. If CV-180's logger thinks its terminals are at 27 °C when they are at 25 °C, it adds the voltage for 27 °C instead of 25 °C, and a plate at 180 °C reads **182.03 °C**. The error is slightly larger than the 2 K compensation error because type K's sensitivity is about 1.5% higher at 25 °C than near 180 °C, so 2 K at the terminals is worth a little more than 2 K at the junction. In practice it is safe to treat a cold-junction error as passing through one for one.

### Where the compensation goes wrong

The compensation sensor measures its own temperature, like every sensor in this book, and the question is whether that is the terminals' temperature.

- **A logger warmed on one side.** A logger placed on a bench beside the oven door warms unevenly. If its terminals are 1 K warmer than its compensation sensor, every channel reads about 1 K low: a plate at 180 °C reads **178.98 °C**.
- **A logger moved from a cold car to a warm workshop.** Its case warms over an hour or more, and the terminals and the sensor warm at different rates. Readings drift while the logger settles. Leaving it to stand before a run removes the effect.
- **A thermocouple connected through a plug-in board.** If the cold junction is at a connector outside the isothermal block, the compensation sensor is in the wrong place, and the reading is off by however much the connector differs from the block.

## Extension and compensating cable

Often the thermocouple cannot run all the way to the instrument. CV-180's limit thermocouple is a mineral-insulated probe with a terminal head on the oven wall, and the limit controller is in the control cabinet several metres away. Something has to carry the signal from the head to the cabinet, and the three laws from Chapter 2 decide what that something must be.

If the cable is made of the same alloys as the thermocouple, it simply continues the thermocouple, and the cold junction stays at the instrument's terminals where it is compensated. This is **extension cable**. If it is made of cheaper alloys chosen to match the thermocouple's voltage over a limited temperature range, typically the range a terminal head might reach, it does the same job within that range. This is **compensating cable**, and it is common for the expensive noble-metal types. Both are colour-coded by type.

If the cable is ordinary copper, it continues nothing. The alloy wires end at the terminal head, so the head becomes the cold junction. The instrument still compensates for the temperature of its own terminals, which are now in the wrong place, and the reading is wrong by roughly the difference between the head temperature and the instrument temperature.

```figure
type: steps
title: Where the cold junction ends up
caption: The cold junction is where the thermocouple alloys meet copper. The instrument always compensates for its own terminals, so the two must be the same place.
- Type K extension cable from head to instrument | the cold junction is at the instrument's terminals, where it is compensated | correct
- Compensating cable, head inside its stated range | as above, within the cable's matching tolerance | correct within tolerance
- Copper cable from the head | the cold junction is at the head; the instrument compensates for the wrong place | error ≈ head minus instrument temperature
- * Extension cable connected backwards | the two cable legs make a voltage in the wrong sense across the head-to-instrument gradient | error ≈ twice the head-to-instrument difference
```

The reversed cable is the most treacherous case, because the colour codes of different national standards have differed over the years and it is easy to connect positive to negative at a terminal head. Each leg of the reversed cable produces its share of the voltage between the head and the instrument with the wrong sign, so the error is about twice that temperature difference.

This is an illustration. A trailing thermocouple at 180 °C is connected through an extension lead, reversed at a connector that sits at 40 °C, to a logger at 25 °C. The logger reads about **149.5 °C**, some 30 K low. With the connector at 60 °C it would read about **109 °C**. But with the connector at 25 °C, the same temperature as the logger, it reads exactly **180 °C**, because there is no gradient in the reversed section to make a voltage. A reversed or copper cable is invisible whenever the head is at the instrument's temperature, which is exactly the condition under which most checks are made.

```figure
type: bars
title: Reading of a 180 °C junction with a cable fault, by head temperature
unit: °C
max: 200
caption: Calculated from the type K reference function, logger at 25 °C. Both faults disappear when the head is at the logger's temperature, so a check with everything cold proves nothing.
- Correct extension cable, any head temperature | 180.0
- Copper from a 40 °C head | 164.7
- Copper from a 60 °C head | 144.2
- Reversed extension, 40 °C head | 149.5
- * Reversed extension, 60 °C head | 109.0
- Either fault, head at 25 °C | 180.0
```

Compensating cable has its own, much smaller, error. Its alloys match the thermocouple only approximately, and the mismatch is specified as a tolerance over the cable's range. If a compensating cable's voltage differed from type K's by 2% across a head-to-instrument difference of 35 K, the error would be about 29 µV, or 0.72 K. For CV-180 the business avoids the question by using type K extension cable, which costs little at these lengths.

## Tolerance classes

A thermocouple made from standard wire does not follow its reference function exactly. The wire is made to a tolerance, and IEC 60584 groups thermocouples into classes by how far they may depart from the reference function. Makers summarise the type K classes as follows: **class 1**, ±1.5 °C from −40 °C to 375 °C, and ±0.004 × |t| above that to 1,000 °C; **class 2**, ±2.5 °C from −40 °C to 333 °C, and ±0.0075 × |t| above that to 1,200 °C.

```figure
type: range
title: Permitted error of a new type K thermocouple in CV-180's range
unit: °C
min: -3
max: 3
caption: From makers' summaries of the IEC 60584 classes. At CV-180's temperatures both classes have a fixed band. A calibration can replace the class tolerance with a much smaller, measured correction.
- Class 2 at 180 °C | -2.5 | 2.5 | ±2.5 °C
- * Class 1 at 180 °C | -1.5 | 1.5 | ±1.5 °C
- Class 1 at 230 °C, the limit setting | -1.5 | 1.5 | ±1.5 °C
```

A tolerance class is a limit, not a typical error. Most thermocouples from one reel of wire are much closer to each other than the class allows, which is why comparing several thermocouples with each other can reveal a faulty one even when none of them has been calibrated. It is also why a set of trailing thermocouples made from one reel and calibrated together, as Chapter 9 describes, can be trusted to a few tenths of a kelvin in CV-180's range, well inside class 1.

## Drift in service

A thermocouple's tolerance applies when it is new. In service its wires change, and because the voltage is made in the gradient region, the change shows up wherever the altered length sits in the gradient.

Type K has two well-known drift mechanisms. When it is held or cycled in roughly the 250 °C to 550 °C range, an ordering change in the nickel-chromium leg shifts its output; and at high temperatures in air, the legs oxidise and change composition, slowly at first and then faster. Both depend on time at temperature. CV-180's thermocouples work at 200 to 230 °C, below the range where the ordering change is pronounced, so their drift is small; the same probes used in a tempering furnace at 450 °C would need far more frequent checks.

Drift has a nasty property: a drifted thermocouple can pass a calibration and still read wrongly in service. If it is calibrated in a dry block at a different immersion from its working position, the altered length sits at a different place in the gradient, and the calibration measures a different error from the one it has in use. The safe check for a thermocouple that has spent a long time hot is either an in-place comparison with a reference sensor beside it, or replacement on a schedule.

## The error: a limit that tripped 25 K late

This is an illustration. CV-180's over-temperature limit uses an insulated type K probe with a terminal head on the oven wall. The head runs at about **60 °C** when the oven is at working temperature, because it sits against the warm casing. When the oven was installed, the electrician ran ordinary two-core copper instrument cable from the head to the limit controller in the cabinet, where the terminals sit at about **35 °C** with the cabinet's other equipment running.

The thermocouple's alloys therefore ended at the head. The limit controller compensated for its own 35 °C terminals, not for the 60 °C head. With the oven air truly at 230 °C, the controller saw E(230) − E(60) = 6.906 mV, added E(35) = 1.407 mV, and displayed about **204 °C**. The limit would not trip until its display reached 230 °C, which needs a terminal voltage of E(230) − E(35) = 7.936 mV, and that occurs at a true air temperature of about **255 °C**. The oven's protection was set 25 K higher than anyone intended.

The annual check never found it. Each year a technician removed the probe, put it in a dry-block calibrator at 230 °C, and confirmed that the limit tripped at a displayed 230 °C. With the oven cold, the head was at about 25 °C, the same as the cabinet, and the copper cable made no error.

The fault came to light after the controller's own Pt100 failed high one afternoon. The controller had read 200 °C, but the oven was actually around 250 °C and still climbing. The limit should have tripped and didn't. A load of white-coated panels came out yellowed, which is the kind of discolouration overbaking causes. The business's technician clipped a reference thermocouple into the oven air on a test run and compared it with the limit controller's display. The two disagreed by about 25 K, and the gap grew as the oven warmed. That growth pointed to the cold junction. Tracing the cable found the copper run.

```figure
type: checklist
title: Thermocouple wiring checks for CV-180
caption: The last item is this chapter's error. A check made with everything at room temperature cannot reveal a cold-junction fault.
- x Cable from head to instrument is extension cable of the same type | colour code checked against the cable's standard
- x Polarity checked at every joint | warm the junction and confirm the reading rises
- x Instrument's cold junction is inside its isothermal block | no copper joints outside it
- x Loop resistance recorded | new value kept for comparison
- ? Checked with the head at its working temperature | copper from the 60 °C head: limit 25 K late
```

The correction was to replace the copper cable with type K extension cable and to change the check. The annual check now includes an in-place comparison with the oven hot, against a calibrated reference thermocouple beside the limit probe, so that the whole chain, including the head and cable at their working temperatures, is tested. The controller's Pt100 was replaced, and the business also began comparing the controller's and the limit's displays at the end of each warm-up, which would have shown a growing difference long before the Pt100 failed.

## Exercise: a hot terminal head

Suppose CV-180's limit probe had been wired with copper cable as described, but the head ran at **45 °C** instead of 60 °C. At what true air temperature would the limit trip, with the cabinet terminals at 35 °C? And what would a cold check, with head and cabinet both at 25 °C, have shown?

**Worked answer.** The limit trips when the terminal voltage plus E(35 °C) corresponds to 230 °C, that is when the voltage between the junction and the head equals E(230) − E(35) = 9.343 − 1.407 = 7.936 mV. With the head at 45 °C, E(45) is about 1.817 mV, so the junction must reach E = 7.936 + 1.817 = 9.753 mV, which the inverse function gives as about **240 °C**. The limit trips about 10 K late. A cold check with both ends at 25 °C would have shown a correct trip at 230 °C, as before. The error is roughly the head-to-cabinet difference of 10 K, as the rule of thumb predicts.
