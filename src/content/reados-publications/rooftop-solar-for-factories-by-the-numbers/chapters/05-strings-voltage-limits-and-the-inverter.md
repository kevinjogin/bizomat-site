---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: strings-voltage-limits-and-the-inverter
order: 5
title: "Strings, voltage limits and the inverter"
description: "How to size strings against an inverter's voltage and current limits at the coldest and hottest cell temperatures, choose the DC to AC ratio, and estimate cable, inverter and clipping losses."
draft: false
---

Modules are wired in series into strings to build up a voltage the inverter can use, and strings are connected to the inverter's inputs in parallel to add their currents. Getting the numbers of each right is the core of array design. Too many modules in a string, and on a cold, bright morning the voltage can exceed what the inverter and the cables are rated for. Too few, and on a hot afternoon the voltage can fall below the range in which the inverter can find the maximum power point. Too many strings on one input, and the current exceeds the input's rating and the inverter throws energy away.

This chapter sets out the voltage and current checks, the choice of the ratio between module and inverter capacity, and the losses in cables and in the inverter itself. It works SF-90's strings against its inverters and ends with a draft wiring diagram that put three strings on each tracker.

## What the inverter does

A grid-connected inverter does three jobs. Its maximum power point tracker continually adjusts the current it draws from each input to keep the strings on the shoulder of their current–voltage curve (Chapter 2). Its power stage, a bridge of semiconductor switches under pulse-width modulation, turns the direct current into a three-phase alternating current synchronised with the grid; the physics and losses of that stage are the same as in a motor drive and are explained in READOS's [Variable-Speed Drives by the Numbers](/reados/publications/variable-speed-drives-by-the-numbers/). And its protection functions disconnect it from the grid if the voltage or frequency moves outside set limits or the grid is lost, so that it cannot keep a disconnected section of network live. Inverters connected to Australian networks must meet AS/NZS 4777.2, the standard for inverter requirements, and be installed to AS/NZS 4777.1, the installation requirements for grid connection through inverters.

SF-90 uses two identical three-phase inverters. Their datasheet gives, among other things:

```figure
type: compare
title: SF-90 inverter ratings used in this chapter
cols: Value | What it limits
rowhead: Rating
- Maximum DC input voltage | 1,000 V | The highest string open-circuit voltage at any temperature
- MPPT operating range | 200 to 950 V | Where the tracker can work at all
- Full-power MPPT range | 480 to 850 V | Where the inverter can reach rated output at its current limit
- Trackers | 3 per inverter | Independent inputs
- Maximum input current per tracker | 32 A | Current the tracker will draw; more is wasted
- Maximum short-circuit current per tracker | 40 A | Current the input can safely accept in a fault
- Rated AC output | 40 kW | Output above this is clipped
- European weighted efficiency | 98.0% | Conversion loss over a typical year
caption: This is an illustration. The figures are typical of commercial three-phase string inverters of this size. Use the real datasheet.
```

## The voltage window

The string's open-circuit voltage is highest when the cells are coldest and the light is bright enough to bring them to full voltage, which happens on clear winter mornings. With SF-90's design minimum of −4 °C and the voltage coefficient of −0.27% per kelvin, each module's open-circuit voltage is 38.2 × [1 − 0.0027 × (−4 − 25)] = 41.19 V. A string of 18 modules reaches 741.4 V, safely below the inverter's 1,000 V limit, with 258.6 V to spare. The longest string the inverter could accept is 1,000 ÷ 41.19 = 24.3, rounded down to 24 modules.

AS/NZS 5033, the standard for installation and safety of PV arrays, sets out how the array's maximum voltage must be worked out and places further limits on arrays on some premises, such as dwellings. The designer must apply the standard's own method and limits; this chapter's figures show the principle.

The lowest operating voltage comes at maximum power on the hottest afternoon. The datasheet gives a power coefficient of −0.32% per kelvin and a current at maximum power that rises at about +0.04% per kelvin, so the voltage at maximum power falls at about −0.36% per kelvin. With the workshop cells at up to 75 °C, each module's maximum power voltage falls to 31.9 × [1 − 0.0036 × 50] = 26.16 V, and the string's to 470.8 V. That sits inside the tracker's operating range, but just below the 480 V start of its full-power range.

```figure
type: range
title: SF-90 string of 18 modules against the inverter's voltage window
unit: V
min: 0
max: 1100
caption: This is an illustration. The string's working voltages run from 470.8 V at maximum power with 75 °C cells to 741.4 V open circuit at −4 °C, inside the tracker's 200–950 V range and below the 1,000 V input limit.
- Tracker can operate | 200 | 950 | below 200 V the inverter stops
- Full-power range | 480 | 850 | rated output at the current limit
- * String at maximum power, 75 °C to −4 °C cells | 470.8 | 634.1
- String open circuit, 25 °C to −4 °C cells | 687.6 | 741.4
```

Being just below the full-power range is not a problem here, and the reason is worth understanding. The full-power range is the voltage band in which the inverter can reach its rated output while drawing no more than its maximum input current. Below 480 V it can still track, but its output is limited to the voltage times its current limit. With three trackers each limited to 32 A, at 470.8 V the inverter could take 3 × 32 × 470.8 = 45.2 kW, more than the 38.5 kW its strings can deliver at 75 °C. The hot afternoon costs nothing beyond the temperature loss already in Chapter 3.

## The current limits

Two strings in parallel on one tracker carry twice the string current. At standard conditions that is 2 × 13.17 = 26.34 A at maximum power, inside the 32 A input limit, so the tracker can always draw the strings' full current.

Short-circuit current matters for fault protection and cable sizing. Irradiance above 1,000 W/m² happens, for instance at the edge of a bright cloud, and the short-circuit current rises with it. Array design standards apply a multiplier to the standard short-circuit current for this; with a multiplier of 1.25, two strings give 2 × 1.25 × 14.00 = 35.0 A, within the input's 40 A short-circuit rating.

The same arithmetic decides whether string fuses are needed. If one string develops a short circuit, the other strings in parallel on the same input drive current backwards into it. With two strings, the reverse current through the faulted string is at most that of the one healthy string, 1.25 × 14.00 = 17.5 A. The module datasheet gives a maximum series fuse rating, the reverse current the module can withstand, of 25 A. Since 17.5 A is below 25 A, no string fuses are needed with two strings per input. With three strings in parallel the reverse current would be 2 × 17.5 = 35.0 A, above 25 A, and each string would need a fuse.

## The DC to AC ratio

Each inverter carries 6 strings of 18 modules, 108 modules and 45.36 kW of DC capacity, against 40 kW of AC output: a DC to AC ratio of 45.36 ÷ 40 = 1.134. A ratio above 1 is normal and economic. The modules almost never deliver their full rating, because they rarely see 1,000 W/m² and are usually well above 25 °C when they do, so an inverter sized to the full DC rating would spend almost all its life part-loaded. A slightly smaller inverter costs less and runs nearer its efficient middle range.

The cost is clipping: when the DC power available exceeds what the inverter can deliver, the tracker moves the strings off their maximum power point and the excess is not collected. At SF-90's ratio it is rare. On a cool, clear day at 1,000 W/m² with cells at 45 °C and the DC losses of Chapter 4, each inverter would receive about 40.8 kW of DC and could deliver about 40.0 kW, right at its limit. Only a cool spring day with bright cloud-edge sunshine of 1,100 W/m² would give it more than it can use. The business assumed 0.3% of yearly energy lost to clipping; inverter logs in the first spring confirmed it was of that order.

## Cable and inverter losses

Each string runs to the inverter room on a pair of 6 mm² copper cables, about 60 m each way, 120 m of conductor. At a cable temperature of 60 °C, with copper's resistivity of 0.0172 Ω·mm²/m at 20 °C and its temperature coefficient of 0.00393 per kelvin, the resistance is 0.0172 × (1 + 0.00393 × 40) × 120 ÷ 6 = 0.398 Ω. At 13.17 A, the loss is 13.17² × 0.398 = 69.0 W per string, 0.91% of the string's 7,574 W at standard conditions, and the voltage drop is 5.24 V. Because cable loss goes with the square of current, the yearly energy loss is less than the full-sun percentage; with connectors and the shorter annex runs, the loss chain's 1% is a fair allowance.

The inverter's own loss varies with load. Its efficiency is lower at very light load, when fixed losses in control electronics and magnetics dominate, highest around half load, and slightly lower again at full load, when conduction losses rise with current. A single weighted figure summarises it for a typical year.

```figure
type: bars
title: Inverter efficiency by load, assumed curve, and the European weighting
x: Load, % of rated output
y: Efficiency, %
caption: This is an illustration. The European weighted efficiency is Σ wᵢ ηᵢ with weights 0.03, 0.06, 0.13, 0.10, 0.48 and 0.20 at 5%, 10%, 20%, 30%, 50% and 100% load. For this curve it is 98.00%, the 2% inverter loss in Chapter 4's chain. An Australian-style or Californian-style weighting uses different weights for sunnier climates.
- 5% | 94.0
- 10% | 96.5
- 20% | 97.8
- 30% | 98.2
- * 50% | 98.4
- 100% | 98.1
```

## Direct current is different

An array's direct-current side brings hazards that a factory's alternating-current wiring does not. A module produces voltage whenever light falls on it; there is no switch upstream of the modules. Isolating the inverter does not make the strings safe: in daylight, every string cable to the inverter room carries up to about 740 V. Covering modules is impractical on a roof array, so work on the DC side is planned on the basis that the conductors are live.

Direct current also sustains arcs. An alternating current passes through zero a hundred times a second, which helps an arc at a parting contact go out; a direct current does not. A loose or poorly made connector, like the one found on string 7 in Chapter 2, can arc and burn for as long as the sun shines. That is why connectors must be matched pairs from one maker, why DC isolators must be rated for DC at the array's full voltage and current, and why the installer's insulation-resistance test of each string at commissioning, part of the tests described in IEC 62446-1, matters. The inverter also monitors the insulation of the array to earth and stops if it falls too low, which is often the first warning of a damaged cable or water in a junction box.

## Grid settings and export limits

The inverters' protection settings and power-quality responses, such as how they reduce output when the grid voltage rises, are set to the requirements of AS/NZS 4777.2 and of the local network service provider, which approves the connection. For a business of this size, the network may also set an export limit: the most power the site may send back to the grid. SF-90's connection agreement included one. The inverters enforce it with a meter at the main switchboard that measures the site's net flow, and they reduce output whenever the factory's own load is too small to absorb the array's output. Chapter 10 shows what that limit costs on a weekend. These settings are part of the approved connection and must not be changed without the network's agreement.

## The error: three strings on each tracker

The first single-line diagram from the installer showed 12 strings arranged as three strings on each of four tracker inputs, two inputs per inverter. It had been copied from an earlier project that used a different inverter with two trackers rated at 45 A each. The business's engineer checked it against the datasheet of the inverter actually offered.

Three strings in parallel draw 3 × 13.17 = 39.51 A at maximum power under standard conditions, against the tracker's 32 A limit. On every bright day, the tracker would have held its current at 32 A by moving the strings up their curve towards open circuit, away from maximum power: 19% of the strings' current at full sun would have gone uncollected on those inputs. The reverse current into a faulted string would have been 35.0 A, above the modules' 25 A series fuse rating, so string fuses and fuse holders would have been needed in every string. And the design would have used only four of the six trackers available.

The corrected design uses two strings on each of the three trackers of each inverter. It needs no string fuses, keeps every tracker within its current rating and gives each roof area its own trackers: on inverter B, the two annex strings at 10° have a tracker to themselves, so their slightly different operating point does not drag on the workshop strings.

```figure
type: checklist
title: Design review checks for strings and trackers
caption: This is an illustration. Applied to the single-line diagram of every array before approval.
- x Maximum string open-circuit voltage at the coldest design temperature below the inverter's input limit and the standard's limit
- x Minimum string voltage at maximum power on the hottest afternoon inside the tracker's range
- x Current at maximum power on each tracker within its input rating
- x Short-circuit current with the standard's multiplier within the input's short-circuit rating
- x Reverse current into a faulted string below the module's series fuse rating, or string fuses fitted
- x Strings on one tracker share orientation, tilt, module type and string length
- x Datasheets match the equipment actually offered, not a previous project's
```

## Exercise: a longer string on the annex

A different inverter, with a 1,100 V input limit, a tracker range of 200 to 1,000 V and a full-power range of 500 to 850 V, is offered for a future extension. The designer proposes strings of 20 modules of the same type, flush on the workshop's south face.

1. What is the string's open-circuit voltage at −4 °C, and is it within the inverter's limit?
2. What is the string's voltage at maximum power with 75 °C cells and with −4 °C cells, and are both inside the full-power range?
3. With two such strings on a tracker rated at 32 A input and 40 A short-circuit current, are string fuses needed?

### Worked answer

1. 20 × 41.19 = 823.8 V, within the 1,100 V limit.
2. With 75 °C cells: 20 × 26.16 = 523.2 V; with −4 °C cells: 20 × 31.9 × [1 − 0.0036 × (−29)] = 704.6 V. Both are inside the 500 to 850 V full-power range.
3. The string current is unchanged by the string length: 2 × 13.17 = 26.34 A at maximum power, within 32 A; the short-circuit current is 2 × 1.25 × 14.00 = 35.0 A, within 40 A. The reverse current into a faulted string is 17.5 A, below the 25 A series fuse rating, so no string fuses are needed. Longer strings raise the voltage and lower the current for the same power, so they also reduce the cable loss per kilowatt.
