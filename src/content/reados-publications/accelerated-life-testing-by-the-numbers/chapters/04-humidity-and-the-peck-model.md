---
book: accelerated-life-testing-by-the-numbers
chapterSlug: humidity-and-the-peck-model
order: 4
title: "Humidity, corrosion and the Peck model"
description: "How moisture drives corrosion in electronics, the Peck temperature–humidity model, FL-60's 85/85 test and its sensitivity, why condensation is a different stress, and a seal that breathed."
draft: false
---

A circuit board that would run for decades in a dry office can fail in a few years in a humid shed, a coastal yard or an unsealed enclosure. Moisture brings ionic contamination to life: it lets current flow where none should, corrodes fine conductors, and grows metal filaments between closely spaced tracks. Like the chemical processes of Chapter 2, these processes speed up with temperature; unlike them, they also need water, and the amount of water available is a second stress that can be raised.

This chapter describes how humidity damages electronics, sets out the Peck model that combines temperature and humidity in one acceleration factor, applies it to FL-60's driver and to the familiar 85 °C and 85% relative humidity test, shows how much the answer depends on the model's two parameters, and explains why liquid water from condensation is a different problem that the model does not cover. It ends with a sealed housing that drew in humid air every night.

## How moisture damages electronics

Water vapour reaches a circuit board through any path the enclosure allows and through the plastics themselves, which are all slightly permeable. At the board's surface it adsorbs into a film a few molecules thick, more of them at higher relative humidity. That film, together with any ionic residue left from soldering, handling or the environment, is a weak electrolyte. Three things then happen, all needing the film, and most needing a voltage between neighbouring conductors.

- **Leakage** across the surface rises, shifting sensitive circuits such as high-impedance sensing and timing networks.
- **Corrosion** attacks exposed metals, such as thin tracks, component terminations and connector contacts, and eventually opens them.
- **Electrochemical migration** carries metal ions from one conductor to its neighbour under the applied voltage, where they deposit as filaments, or dendrites, that grow until they bridge the gap and short it.

Because these processes need a voltage, humidity tests on electronics are normally run with the product powered or biased, a **temperature–humidity–bias** test. An unpowered board in a humidity chamber is protected from migration by the absence of a field, and can pass a test that a powered board would fail. And because they need contamination, the cleanliness of the board and the protection of a conformal coating matter as much as the enclosure.

### Contamination and cleanliness

The film of water on a board does little harm on its own; pure water is a poor conductor. It becomes damaging when it dissolves ionic residues, such as flux activators left after soldering, salts from fingerprints, chlorides from coastal air or sulfur compounds from industrial atmospheres. The same humidity that leaves a clean board untouched can grow dendrites on a contaminated one within days. That is why a humidity test is only meaningful on boards made by the production process, with the production flux, cleaning or no-clean regime, and handling, and why a change of solder paste, flux or assembly house is a reason to repeat the test.

Conformal coatings help by keeping the water film away from the conductors, but they are not barriers to water vapour, which permeates them slowly. What they do is deny the film a continuous path between conductors and keep contamination from landing on the board after assembly. A coating that misses an area, for instance under a tall component or at a connector that was masked during coating, leaves exactly the place where corrosion will start.

### Water through plastics and seals

No plastic housing, gasket or potting compound is impermeable to water vapour. Silicone gaskets in particular are quite permeable, and over months the inside of a sealed housing comes towards the average humidity outside, whatever the quality of the seal. A seal keeps out liquid water and dust; it slows, but does not stop, water vapour. The design question is therefore not how to keep vapour out forever, but how to stop it condensing inside and how to let it out again, which is where the breathing behaviour discussed below becomes decisive.

## The Peck model

Peck's 1986 paper fitted a model to a large body of humidity life data from electronic components. It multiplies a power law in relative humidity by an Arrhenius term in temperature, and it has been widely used since for temperature–humidity acceleration.

```figure
type: formula
title: The Peck temperature–humidity acceleration factor
formula: AF = (RHtest ÷ RHuse)^n × exp[(Ea ÷ k)·(1/Tuse − 1/Ttest)]
caption: Parameters as attributed to Peck's paper by a secondary source: n = 2.7 and Ea = 0.79 eV. They were fitted to particular component data, mainly corrosion of aluminium conductors, and are a starting point, not a property of every product.
- RH | relative humidity, %
- n | humidity exponent, 2.7
- Ea | activation energy, 0.79 eV
- T | absolute temperature, K
step: Test 85 °C, 85% RH against use 30 °C, 75% RH: humidity term (85 ÷ 75)^2.7 = 1.40; temperature term 104.0; AF = 145.8
step: Against use 20 °C, 80% RH: humidity term 1.18; temperature term 291.7; AF = 343.5
```

The first step shows something important about the model: most of the acceleration comes from temperature, not humidity. Raising the humidity from 75% to 85% gives a factor of only 1.4, while raising the temperature from 30 °C to 85 °C gives a factor of about 104. A humidity test is, in large part, a high-temperature test with water present.

## FL-60's humidity exposure

When FL-60 is lit, its driver runs 30 K or more above the night air, and the relative humidity inside its housing falls sharply, because warming air lowers its relative humidity. Damp conditions inside the driver are therefore mostly a concern for the **off hours**, the 12 hours of each day when the floodlight is dark and its housing is at the outside temperature.

This is an illustration. The business characterises FL-60's off-hours exposure as **43,800 hours** over 10 years at an equivalent of **20 °C and 80% RH** inside the housing, a conservative summary of conditions across the regions it sells into. Against a test at 85 °C and 85% RH, the Peck model gives an acceleration factor of **343.5**, so the 10-year exposure corresponds to about **127 hours** of test. A temperature–humidity–bias test of **1,000 hours** at 85 °C and 85% RH, a duration in wide use for electronic components, covers about **7.8 times** the design life's exposure on this model.

```figure
type: compare
title: How much of FL-60's design life a 1,000-hour 85/85 test covers
cols: Acceleration factor at 20 °C, 80% RH | Design lives covered by 1,000 h
caption: This is an illustration. The answer swings by a factor of nine across plausible parameter values. A test that covers several design lives at the central values leaves margin for that uncertainty.
- Low parameters, n = 2 and Ea = 0.6 eV | 84.1 | 1.9
- * Peck, n = 2.7 and Ea = 0.79 eV | 343.5 | 7.8
- High parameters, n = 3 and Ea = 0.9 eV | 771.1 | 17.6
```

The spread in the table is the honest result. With the parameters attributed to Peck, the test covers nearly eight design lives. With plausible lower values it covers fewer than two; with higher values it covers more than seventeen. The business can either accept the central estimate and treat the margin as protection against the uncertainty, or find parameters for its own board's materials, coating and contamination. For FL-60, the decision was to run the 1,000-hour test on powered drivers with production-standard conformal coating, and to treat any failure as a design problem regardless of what the model said it represented.

### What a pass means

A humidity test that ends without failures is good news, but its meaning is limited in two ways. First, as Chapter 7 shows for any test with no failures, the number of units decides how much confidence the pass carries: a pass on three units says much less than a pass on twenty. Second, the pass says nothing about mechanisms the test did not exercise. Monitoring helps with both. Measuring the drivers' leakage current, output ripple and a few sensitive circuit parameters at intervals during the test shows whether anything is drifting towards failure, and a drift that would reach a limit soon after the test ends is a warning that a simple pass would hide. Inspecting the boards under magnification after the test, for discoloration, corrosion products or early dendrites, turns a pass into evidence of how much margin remained.

## Condensation is a different stress

The Peck model describes damage at high relative humidity, from adsorbed water films. It says nothing about **liquid water**, which forms whenever a surface is colder than the dew point of the air touching it. Liquid water is far more damaging: it dissolves contamination into a real electrolyte, bridges gaps in seconds, and carries salts and dirt with it. A product that sees condensation needs a different kind of test, typically cyclic damp heat, in which temperature cycles at high humidity cause condensation on each cooling, and a different kind of design defence.

This is an illustration. On an 80% RH night at 20 °C, the dew point is about **16.4 °C**. FL-60's glass and housing, radiating to a clear night sky after switch-off, can cool a few kelvin below the air, below the dew point, and any moist air inside the housing will then deposit water on them. Whether that happens depends on whether moist air gets in, which depends on what the housing does when it cools.

### Enclosures that breathe

A sealed housing does not stay sealed under a daily temperature cycle. When FL-60 switches off, the air inside cools from about 60 °C towards the night air. If the housing were perfectly rigid and perfectly sealed, its internal pressure would fall in proportion to absolute temperature, from 333 K to 293 K, about 12% or **12 kPa** below the outside. Few gaskets hold a vacuum of that size every night for ten years, and the housing draws outside air in through the weakest point, often the cable gland or a gasket corner, carrying moisture with it. The next day it warms and pushes dry air out. Over months, the housing acts as a pump that accumulates water inside. [Seal and vent the enclosure](/reados/publications/electronics-packaging-by-the-numbers/seal-and-vent-the-enclosure/) in *Electronics Packaging by the Numbers* treats the design of seals and vents for exactly this cycle.

The usual remedy is a **pressure-equalising vent**: a membrane that lets air pass freely, so the housing never develops a pressure difference, while blocking liquid water and dust. Air still enters as the housing cools, but through a controlled path and in smaller amounts, and without forcing water past the gasket. Where some condensation cannot be prevented, the design should decide where it forms and where it goes: a cold surface away from the electronics, a drip edge, a drain path at the lowest point, and no horizontal ledges above the board on which water can collect.

```figure
type: decision
title: Which humidity test does the product need?
question: What water will the electronics actually meet?
caption: The Peck model and the 85/85 test address the first row only. Products that meet condensation need cyclic damp heat and a design that manages breathing.
- High humidity, no condensation | indoor equipment, sealed and potted products | temperature–humidity–bias, e.g. 85 °C and 85% RH, Peck model for acceleration
- *Condensation from daily cycling | outdoor enclosures, vehicles, unheated sheds | cyclic damp heat with condensation; vents, coatings and drain paths
- Liquid ingress | spray, rain, washdown | ingress protection tests, which are not life tests
```

## The error: a housing that breathed

This is an illustration. FL-60's drivers passed the 1,000-hour temperature–humidity–bias test without a failure, and the business launched with confidence. Within 18 months, a distributor returned several units from a coastal site. Their drivers had failed with corrosion on the output connector and green deposits around the board's mounting holes, and their housings held a few millilitres of water.

The failure analysis found what the humidity test could not have found. The drivers had been tested bare, without their housing, so the test exposed them to high humidity but never to condensation or to salt. In service, the housing breathed through its cable gland every night, drawing in salty, humid air, and on clear nights water condensed on the cold glass and dripped onto the driver. The corrosion was from liquid salt water, a mechanism outside the Peck model's scope.

The fix had three parts: a pressure-equalising vent membrane in the housing, a drip shield over the driver, and conformal coating extended to the output connector's solder joints. The test plan gained a cyclic damp heat test on complete housings, with salt-laden conditions for products sold to coastal sites, and the field returns from that distributor became an input to the plan described in Chapter 9.

```figure
type: checklist
title: Humidity test checks for FL-60
caption: The open item is this chapter's error. The test item must meet the water it will meet in service, in the form it will meet it.
- x Mechanism identified | corrosion and migration from adsorbed films; condensation separately
- x Test powered or biased | drivers running during 85/85
- x Board finish and coating as in production | conformal coating to drawing
- x Peck parameters bracketed | 1.9 to 17.6 design lives covered
- ? Complete housing tested for breathing and condensation | bare drivers passed; housings drew in salt air
```

## How this applies to a small Australian business

Australia's climate spans tropical coasts, humid southern winters and dry inland heat, and outdoor products sold nationally will meet all of them, along with salt near the coast. A small manufacturer's humidity plan should start with where the product will be installed, describe the off-hours humidity exposure rather than the on-hours, and separate humid air from liquid water. Most humidity failures in outdoor products come from condensation and breathing, not from steady high humidity, and the cheapest fixes, a vent membrane, a drip path, a coating, are design changes that cost little in production and save a great deal in returns.

## Exercise: a tropical site

A customer in the tropics asks for evidence for an installation where the off-hours conditions inside the housing are best described as **30 °C and 85% RH**. Using the Peck parameters, what is the acceleration factor of an 85 °C, 85% RH test, and how many test hours represent 43,800 off-hours?

**Worked answer.** The humidity term is (85 ÷ 85)^2.7 = **1**, because the test and use humidities are equal. The temperature term is exp[(0.79 ÷ 8.617 × 10⁻⁵) × (1/303.15 − 1/358.15)] = **104.0**. The acceleration factor is therefore **104.0**, and 43,800 hours of exposure corresponds to about **421 hours** of test. The 1,000-hour test covers about 2.4 design lives at this site, against 7.8 at the business's general conditions: still a pass on the model, but with a much smaller margin for parameter uncertainty, and with nothing to say about the condensation that a tropical site will almost certainly produce.
