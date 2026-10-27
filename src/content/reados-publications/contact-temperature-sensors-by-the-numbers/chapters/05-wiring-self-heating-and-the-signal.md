---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: wiring-self-heating-and-the-signal
order: 5
title: "Wiring, self-heating and the measuring circuit"
description: "Two-, three- and four-wire Pt100 connections, lead and insulation errors, self-heating, 4–20 mA transmitters and converter resolution, and a three-wire probe wired as two."
draft: false
---

A Pt100 changes by about 0.37 Ω for each kelvin at CV-180's working temperature. The copper wires that connect it to the controller have resistance too, and a few metres of ordinary cable can add as much resistance as a couple of kelvin. The current that measures the sensor heats it. The converter that reads the voltage divides it into steps. Each of these adds to or blurs the reading, and each can be made small by the way the sensor is wired and measured.

This chapter works through the measuring circuit of a resistance thermometer: two-, three- and four-wire connections and the errors each leaves, the effect of insulation leakage, self-heating and how to detect it, and the transmitters and converters that carry the reading to a controller or a PLC. The same ideas apply to the thermistors of the next chapter. It ends with a three-wire probe that was connected with two wires.

## Lead resistance and the two-wire connection

The simplest way to measure a resistance is to pass a current through it and measure the voltage across it, using the same two wires for both. The instrument then measures the sensor plus both lead wires, and cannot tell them apart.

This is an illustration. CV-180's controller is about 10 m of cable away from its sensor. Copper has a resistivity of about 0.0172 Ω·mm²/m at 20 °C, so each 10 m conductor of 0.5 mm² cable has a resistance of 0.0172 × 10 ÷ 0.5 = **0.344 Ω**, and the pair adds **0.688 Ω**. At 200 °C, where the sensor changes by 0.3677 Ω/K, that is an error of **+1.87 K**. On a 25 m run, it would be **+4.68 K**. The error is always positive, because lead resistance adds to the sensor's.

The lead resistance also changes with the cable's temperature, at about 0.39% per kelvin for copper. A two-wire run of 10 m whose cable warms by 20 K, for instance because it passes over the oven roof, gains 0.054 Ω, worth another **0.15 K**, and that part cannot be removed by a one-off offset. A two-wire connection is acceptable only for short leads, for low-accuracy work, or with a Pt1000, whose tenfold larger sensitivity cuts the same 0.688 Ω loop to an error of **0.19 K**.

## Three- and four-wire connections

The three-wire connection adds a third wire to one end of the sensor. The instrument uses it to measure the resistance of one lead and subtracts it twice, on the assumption that the two current-carrying leads are equal. With leads of the same cable, length and temperature, they very nearly are, and the lead error almost vanishes.

The four-wire connection uses one pair of wires to carry the measuring current and a separate pair to measure the voltage across the sensor itself. The voltage pair carries almost no current, so its resistance causes almost no voltage drop, and the measurement does not depend on the leads at all. It is the method used for laboratory references and calibration.

```figure
type: svg
title: Two-, three- and four-wire Pt100 connections
alt: Three small circuit sketches side by side. In each, a sensor resistor marked Pt100 sits at the left end of the wires and the instrument is at the right. The two-wire sketch shows two leads, each marked with lead resistance, both inside the measured loop. The three-wire sketch shows a third lead joined to one end of the sensor, used to measure and subtract lead resistance. The four-wire sketch shows an outer pair carrying the current and an inner pair measuring the voltage across the sensor alone.
caption: In the two-wire circuit, both leads are measured with the sensor. Three wires let the instrument subtract the leads if they match. Four wires measure the sensor's voltage directly.
viewbox: 0 0 660 230
body:
<text class="txb" x="20" y="24">Two-wire</text>
<rect class="bxa" x="20" y="80" width="26" height="70" rx="3"/>
<text class="tx txs" x="12" y="170">Pt100</text>
<path class="ln" d="M33 80V56H180M33 150V174H180"/>
<rect class="bx" x="90" y="48" width="36" height="16" rx="2"/>
<rect class="bx" x="90" y="166" width="36" height="16" rx="2"/>
<text class="tx txs" x="86" y="42">lead</text>
<text class="tx txs" x="86" y="200">lead</text>
<rect class="bxi" x="180" y="46" width="22" height="138" rx="3"/>
<text class="txb" x="236" y="24">Three-wire</text>
<rect class="bxa" x="236" y="80" width="26" height="70" rx="3"/>
<path class="ln" d="M249 80V56H400M249 150V174H400M249 150V196H400"/>
<rect class="bx" x="306" y="48" width="36" height="16" rx="2"/>
<rect class="bx" x="306" y="166" width="36" height="16" rx="2"/>
<rect class="bx" x="306" y="188" width="36" height="16" rx="2"/>
<rect class="bxi" x="400" y="46" width="22" height="160" rx="3"/>
<text class="tx txs" x="296" y="224">third lead subtracts</text>
<text class="txb" x="456" y="24">Four-wire</text>
<rect class="bxa" x="456" y="80" width="26" height="70" rx="3"/>
<path class="la" d="M469 80V50H630M469 150V180H630"/>
<path class="ln dsh" d="M469 90H500V70H630M469 140H500V160H630"/>
<rect class="bxi" x="630" y="40" width="20" height="150" rx="3"/>
<text class="tx txs" x="512" y="44">current pair</text>
<text class="tx txs" x="512" y="200">voltage pair, no current</text>
```

The three-wire connection's residual error comes from any mismatch between the two current-carrying leads. If CV-180's 10 m leads differed by 5%, for example through a slightly corroded terminal on one, the uncorrected difference would be 0.05 × 0.344 = 0.0172 Ω, an error of **0.047 K**. A badly corroded terminal can add far more than that, which is why the lead check in Chapter 4's multimeter routine matters even for three-wire sensors.

```figure
type: bars
title: Lead error at 200 °C for CV-180's Pt100 by connection
unit: K
max: 5
caption: This is an illustration, with 0.5 mm² copper leads at 20 °C. The three-wire value assumes a 5% mismatch between the current-carrying leads; the four-wire error is negligible.
- Two-wire, 25 m | 4.68
- Two-wire, 10 m | 1.87
- Pt1000 two-wire, 10 m | 0.19
- * Three-wire, 10 m, 5% mismatch | 0.047
- Four-wire, any length | 0.00
```

## Insulation leakage

The insulation between the sensor's wires, and between the wires and the sheath, is not perfect. Any leakage acts as a resistor in parallel with the element and makes the sensor read low. For CV-180's 175.856 Ω element at 200 °C, an insulation resistance of 1 MΩ lowers the measured resistance by about 0.031 Ω, worth **0.08 K**. At 100 kΩ the error is **0.84 K**; at 20 kΩ it is **4.2 K**. Mineral-insulated probes that breathe moist air while cold can fall into this range, and the error then varies with humidity and with how long the oven has been hot to dry the insulation out. A probe whose reading creeps upwards over the first hour of each day, then holds steady, is worth testing for insulation resistance.

## Self-heating

To measure a resistance, the instrument must pass a current through it, and the current dissipates power in the element: P = I²R. That power has to escape to the surroundings, so the element runs slightly warmer than the medium. The **self-heating coefficient**, in kelvin per milliwatt, depends on the probe and especially on what surrounds it: it is small in stirred liquid, larger in moving air and largest in still air.

This is an illustration. With a self-heating coefficient of 0.05 K/mW assumed for CV-180's probe in the duct's moving air, a measuring current of **1 mA** dissipates 0.001² × 175.856 = **0.18 mW** and raises the element by about **0.009 K**. A current of **5 mA** dissipates **4.4 mW** and raises it by about **0.22 K**. Industrial instruments typically use currents around 1 mA or less, and some pulse the current only while measuring, so self-heating is usually negligible for a Pt100. It matters more for small thin-film elements, for sensors in still air, and above all for thermistors, as Chapter 6 shows.

Self-heating can be measured rather than assumed. Measure the sensor at its normal current, then at a current larger by √2, which doubles the power. If the reading rises by an amount δ, the self-heating at the normal current is also about δ, because self-heating is proportional to power. The test needs only an instrument with a selectable current, and it is part of a good calibration.

The medium matters as much as the current. A self-heating coefficient quoted by a maker applies to the conditions stated with it, often a probe in stirred water, where the heat escapes easily. The same probe in still air may self-heat ten or more times as much, and in a calibration bath of oil at a different temperature it will differ again. This is why a sensor calibrated in a liquid bath and then used in still air can carry a small, consistent offset that the calibration certificate does not show. For CV-180's controller at 1 mA, the effect stays well below a tenth of a kelvin in any of these media, so it is recorded and then set aside.

## Transmitters and converters

The resistance has to be converted into a number the controller or PLC can use. CV-180's controller measures it directly. Many plants instead fit a **head-mounted transmitter** in the probe's terminal head, which measures the Pt100 with three or four wires over a very short distance and sends a **4–20 mA** current along a two-wire loop to the PLC. The current signal is not affected by the loop's resistance, within limits, and is robust against interference.

```figure
type: formula
title: Resolution and range of a 4–20 mA temperature loop
formula: signal per kelvin = 16 mA ÷ span
caption: This is an illustration for a transmitter ranged 0 to 300 °C. The converter's step size limits resolution; the loop's supply voltage limits how much resistance it can drive.
- 16 mA | the signal range from 4 mA to 20 mA
- span | the transmitter's temperature range, K
step: 0 to 300 °C: 16 ÷ 300 = 0.0533 mA/K
step: A 12-bit input over 0 to 20 mA: one step is 20 ÷ 4,096 = 0.0049 mA, about 0.09 K
step: Loop budget: 24 V supply − 8 V transmitter minimum − 5 V across a 250 Ω input at 20 mA = 11 V, enough for 550 Ω of cable and barriers
```

A transmitter adds its own accuracy specification, usually a fixed part plus a percentage of span, and its own temperature coefficient, since it sits in a head that may be warm. A narrow span gives better resolution but must still cover every temperature the process can reach, including faults: a transmitter ranged 150 to 250 °C would saturate at 20 mA during an overheat and hide how bad it was.

Where the controller measures the sensor directly, its converter's step size is usually much finer. A 16-bit converter spanning 0 to 400 Ω divides the range into steps of about 0.006 Ω, under **0.02 K**. Good instruments measure **ratiometrically**: they pass the same current through the sensor and through a stable reference resistor and compare the two voltages, so that drift in the current cancels. What remains is the reference resistor's stability and the converter's linearity, both stated on the data sheet.

## Earthing and interference

Resistance thermometers carry larger signals than thermocouples, about 0.37 mV per kelvin at 1 mA against 0.04 mV per kelvin, but they share an oven with switched heaters, a fan motor and its variable-speed drive. Interference reaches the measuring circuit in three main ways, and each has a standard defence.

- **Capacitive and magnetic pickup along the cable.** Twisted, screened instrument cable, run in its own tray or conduit and crossing power cables at right angles rather than running beside them, keeps the pickup small. The screen is earthed at one end only, normally the instrument end, so that it cannot carry a circulating current.
- **Earth loops.** If the sensor's sheath is earthed at the oven and the measuring circuit is also earthed at the controller, any difference in earth potential between the two drives a current through the measuring circuit. Sensors with insulated elements, isolated controller inputs or isolated transmitters break the loop.
- **Mains-frequency noise in the converter.** As with thermocouples, a converter that integrates over a whole number of 20 ms mains cycles rejects 50 Hz interference strongly. Many controllers let the user select 50 Hz or 60 Hz rejection, and the wrong setting in Australia leaves a noisy reading.

A reading that jumps when the heaters switch, or that changes when a welding set or a forklift charger nearby starts, points to interference rather than to the sensor. Logging the controller's reading at a fast rate for a few minutes while the heaters cycle usually shows it plainly.

## How this applies to a small Australian business

Most wiring errors in small plants come from changes made under time pressure: a sensor replaced with whatever was in stock, a controller moved, a cable extended. A one-page record for each sensor, giving its type, class, number of wires, lead length, terminal numbers and the instrument's configuration, lets the next person reconnect it correctly. Electrical work on fixed wiring must be done by a licensed electrician under the state or territory rules, but the measurement decisions, such as how many wires and what configuration, belong to whoever is responsible for the process, and they should be written down before the electrician arrives.

## The error: a three-wire probe on two wires

This is an illustration. During a maintenance shutdown, CV-180's controller sensor was replaced with a new class A three-wire Pt100 on a 12 m flying lead, longer than the old one because the controller had been moved. The electrician found the controller's terminals labelled for a two-wire sensor, landed one red wire and the white wire on them, taped off the second red wire, and left the controller set to two-wire input.

The controller now measured the element plus about 12 m of lead in each direction. With 0.5 mm² conductors, each lead had 0.0172 × 12 ÷ 0.5 = 0.413 Ω, so the controller saw an extra **0.826 Ω**, worth **2.25 K** at 200 °C. It read 2.25 K high, held its display at 200 °C, and the oven air settled at about **197.8 °C**. Had the electrician landed both red wires together on one terminal, their parallel resistance would have cut the extra resistance to 0.619 Ω, but the error would still have been 1.7 K.

The first sign came from the next profile survey. Heavy frames reached 180 °C about two minutes later than in the previous survey, and the logger's air channel sat about 2 K below the controller's display, where earlier surveys had shown them within a few tenths. A check with the multimeter routine of Chapter 4 at the controller terminals found the third wire taped off in the cabinet. The controller's manual showed that its input accepted three-wire sensors on a different terminal set, selected in its configuration. The sensor was reconnected as three-wire, the configuration changed, and the next survey agreed with the controller again.

```figure
type: checklist
title: Wiring checks for a resistance thermometer
caption: The open item is this chapter's error. Every connection decision should be recorded where the next electrician will find it.
- x Connection matches the sensor and the instrument's configuration | two-, three- or four-wire
- x Lead resistance measured and recorded | each lead separately for three-wire
- x Insulation resistance measured | wires to sheath, and between wires
- x Instrument current and self-heating known | about 1 mA; 0.009 K for CV-180
- ? Three-wire sensor connected and configured as three-wire | two-wire on 12 m: 2.25 K high
```

## Exercise: a longer run

The business plans to add a second oven, CV-240, whose controller will be **30 m** from its sensor, using the same 0.5 mm² cable and a class A Pt100 at a 200 °C setpoint. What would the lead error be with a two-wire connection, with a three-wire connection whose leads mismatch by 3%, and with a Pt1000 on two wires?

**Worked answer.** Each 30 m conductor has 0.0172 × 30 ÷ 0.5 = **1.032 Ω**. Two-wire with a Pt100: 2 × 1.032 = 2.064 Ω, divided by 0.3677 Ω/K gives **5.6 K**, far too large. Three-wire with a 3% mismatch: 0.03 × 1.032 = 0.031 Ω, about **0.08 K**, which is acceptable beside the sensor's ±0.55 K class tolerance. Pt1000 on two wires: 2.064 Ω divided by 3.677 Ω/K is **0.56 K**, about the same as the class tolerance, and it would still change with the cable's temperature. The three-wire Pt100, or a head-mounted transmitter sending 4–20 mA, is the sound choice.
