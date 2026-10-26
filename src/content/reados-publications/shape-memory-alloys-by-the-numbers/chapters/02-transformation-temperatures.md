---
book: shape-memory-alloys-by-the-numbers
chapterSlug: transformation-temperatures
order: 2
title: "Transformation temperatures and choosing a grade"
description: "Read a wire's four transformation temperatures and hysteresis, pick a grade that neither triggers in a hot cabinet nor fails to reset, and catch a stock wire that could not re-latch."
draft: false
---

A shape memory wire is, among other things, a thermometer. It changes state at definite temperatures whether the heat comes from its own current, from the sun on a cabinet, or from a hot motor nearby. Choosing a wire grade is therefore choosing which temperatures it responds to, and the choice has two sides. The wire must not start to transform at the hottest temperature its surroundings reach, or it will operate by itself. And it must be able to cool far enough, in those same surroundings, to transform fully back, or it will not reset.

This chapter explains how transformation temperatures are measured and stated, compares two common wire grades against VL-25's 60 °C cabinet, and records what happened when the prototypes were built with the grade that happened to be in stock.

## Four temperatures and a hysteresis

Chapter 1 introduced the four temperatures: martensite start Ms and finish Mf on cooling, austenite start As and finish Af on heating. A wire heated from cold is fully martensite below As, partly transformed between As and Af, and fully austenite above Af. Cooled from hot, it stays austenite down to Ms, transforms between Ms and Mf, and is fully martensite below Mf.

Because As lies above Ms, and Af above Mf, the wire's state at a given temperature depends on whether it is heating or cooling. That is the transformation hysteresis. For an actuator, hysteresis is both a nuisance and a protection: a nuisance because the wire must be cooled well below the temperature at which it contracted before it relaxes, and a protection because a wire sitting at a temperature between Mf and As stays in whichever state it was last put in.

A convenient single number for the hysteresis is the difference between the midpoints of the heating and cooling ranges. This is an illustration. For the 90 °C grade lot in the table below, the heating midpoint is (82 + 90) / 2 = 86 °C and the cooling midpoint (70 + 62) / 2 = 66 °C, a hysteresis of 20 °C. The width of each range matters as well: the cooling range from Ms to Mf spans 8 °C, and a wire that must reset fully has to reach the bottom of that range, not its middle.

### How the temperatures are measured

The usual laboratory method is differential scanning calorimetry, which heats and cools a small sample at a steady rate and measures the extra heat absorbed or released as it transforms. The transformations show as peaks on a plot of heat flow against temperature, and the four temperatures are read where tangents to each peak's sides meet the baseline. ASTM F2004 describes the method for nickel-titanium. Another method, ASTM F2082, bends a wire sample cold, heats it slowly and watches it recover, which measures As and Af directly in the way an actuator uses them.

The values a supplier certifies are for the unloaded alloy. Under stress, every temperature rises, as Chapter 3 explains; a designer must add that shift before comparing a wire's temperatures with its environment.

## The running case: two grades for VL-25

This is an illustration. Actuator wire is commonly sold in grades by nominal activation temperature, and VL-25's designer considered two, here called the 70 °C grade and the 90 °C grade. Their unloaded transformation temperatures, from the supplier's certificates for the lots concerned, were:

```figure
type: compare
title: Unloaded transformation temperatures of two wire grades
cols: Mf | Ms | As | Af
caption: This is an illustration. Certificate values for two fictional lots, measured by thermal analysis without load. Real lots vary; the certificate for the lot used governs. Chapter 3 adds the shift caused by stress.
- 70 °C grade | 42 °C | 52 °C | 62 °C | 70 °C
- *90 °C grade | 62 °C | 70 °C | 82 °C | 90 °C
```

The cabinet's interior reaches 60 °C in summer sun, and the latch housing, close to a dark outer panel, has been measured at a few degrees more. Two questions decide the grade.

**Will it trigger by itself?** The wire must stay below As in the hottest conditions. The 70 °C grade's unloaded As of 62 °C is only 2 °C above the cabinet's 60 °C, and below the latch housing's local temperature. The 90 °C grade's As of 82 °C leaves 22 °C of margin. Under the bias spring's stress, both rise by about 11 °C, as Chapter 3 calculates, which helps both, but the 70 °C grade's margin remains thin.

**Will it reset?** After an operation, the wire must cool below Mf, as shifted by the bias stress, to transform fully back to martensite and let the spring re-stretch it. Under the bias spring's 69 MPa, Mf rises by about 11 °C: to about 53 °C for the 70 °C grade and about 73 °C for the 90 °C grade. In a 60 °C cabinet, the 70 °C grade's wire cannot cool below 53 °C at all, because its surroundings are hotter than that. It would stay partly austenite, partly short, and the latch could not re-engage.

```figure
type: range
title: Each grade's working window against VL-25's cabinet, with the bias stress shift
unit: °C
min: 20
max: 120
caption: This is an illustration. Each bar runs from Mf to Af with an 11 °C shift for the 69 MPa bias stress from Chapter 3. The cabinet reaches 60 °C. A grade is usable only if the cabinet's top temperature lies below the bar, so the wire can both reset and stay unactivated.
- 70 °C grade, loaded | 53 | 81 | cabinet at 60 °C lies inside the bar
- *90 °C grade, loaded | 73 | 101 | cabinet at 60 °C lies below the bar
```

The 90 °C grade passes both tests, with a reset margin of about 13 °C. That margin also decides how long the wire takes to cool, because a wire cools ever more slowly as its temperature approaches its surroundings; Chapter 7 calculates the reset time at 60 °C.

## The error: the grade in stock

This is an illustration. VL-25's first ten prototypes were built with the 70 °C grade, simply because a reel of it was in the stores and the 90 °C grade had a four-week lead time. They passed every bench test at room temperature: they released in under a second and reset in about four seconds. Five were fitted to cabinets on a test site for a summer.

The site's log showed the problem within a fortnight. On hot afternoons, latches that had been exercised would not re-latch when the flap was pushed shut; by evening, as the cabinets cooled, they would. One latch was also found partly withdrawn one afternoon without having been commanded, although the flap had not quite released. A temperature logger in one cabinet recorded 63 °C at the latch housing at 3 pm.

The explanation was the two tests above. At 63 °C, the 70 °C grade's wire, under its bias stress, could not cool below its shifted Mf of about 53 °C, so after an operation it stayed partly contracted and the latch pin could not return. And at 63 °C, the wire was above its unloaded As and close to its shifted As, so some transformation had begun on its own, pulling the pin part of the way. The bench tests at 20 °C had been run in the one condition where neither problem could appear.

The prototypes were rebuilt with the 90 °C grade. The design file now requires every wire actuator's grade to be checked against the hottest and coldest temperatures at the actuator, measured on site or calculated from the enclosure's heat balance, with the stress shift of Chapter 3 included, and every qualification test to include a run at the hottest temperature. The four weeks the team had saved by using stock wire cost them a summer.

## Temperature at the wire, not in the room

The temperature that matters is the wire's own, and in a sealed outdoor cabinet that can differ a good deal from the air temperature in the middle of the cabinet. Parts close to a sunlit outer panel run hotter; parts near a heat sink or a fan run cooler. VL-25's site logging, after the error described above, placed sensors at several points to find out how large the differences were.

```figure
type: bars
title: Afternoon temperatures in a VL-25 test cabinet in summer
unit: °C
max: 80
caption: This is an illustration from one fictional site's logger on its hottest day. The latch housing sits close to the cabinet's dark door. The design now uses the latch housing's temperature, not the cabinet air's, as the actuator's environment.
- Outside air in shade | 38
- Cabinet air at mid-height | 60
- *Latch housing near the door | 63
- Inside face of the sunlit door | 71
```

The design decision that followed was to treat 65 °C as the wire's maximum environment, a little above the measured 63 °C, and to keep the wire itself clear of the door's inside face by mounting it on the latch's far side. Both choices are cheap; neither would have been made without measurements at the actuator. A few days of logging on a hot site, with a handful of inexpensive temperature loggers, is the cheapest test in the whole programme.

### An intermediate phase

Some nickel-titanium alloys, depending on composition and processing, transform from austenite to martensite through an intermediate structure called the R-phase. The R-phase transformation involves a much smaller strain, a fraction of a per cent, and a much smaller hysteresis, a few degrees. On a calorimetry plot it shows as an extra peak on cooling, and in an actuator it can show as a small movement at a temperature different from the main transformation. For VL-25 the R-phase is a curiosity, because its strain is too small to move the latch, but for an actuator whose positioning matters to a fraction of a millimetre, or a temperature-sensing application, it can matter. The supplier's calorimetry trace, rather than a table of four temperatures, shows whether a lot has it.

## Specifying the grade

The enclosure maker's purchase specification for VL-25's wire now states the transformation temperatures as limits rather than nominal values: an unloaded As of at least 78 °C and an unloaded Mf of no more than 66 °C, by thermal analysis, with the certificate supplied for each lot. The As limit protects against self-triggering at the 65 °C environment with the stress shift; the Mf limit protects the reset margin. Both were set from the calculation above with a few degrees of allowance for lot-to-lot variation. A lot that falls outside either limit is returned, however attractive its price or delivery.

## Cold environments

The opposite environment raises different questions. In a cold cabinet, a wire's heating current must bring it from a lower starting temperature up past Af, which takes more energy and a longer pulse, and its reset is fast because the surroundings pull heat away quickly. For superelastic parts, which must stay above Af to remain superelastic, cold is the main concern: a superelastic part cooled below its Af partly loses its springiness and may not recover fully, as Chapter 9 discusses. VL-25's cabinets are not expected to go below about 0 °C, and the 90 °C grade wire is fully martensite there, as it should be, with ample heating margin from the controller.

## Reading a certificate

A wire supplier's certificate for a lot normally states the method used, the transformation temperatures it measured, and often the wire's diameter, resistance and tensile results. Before using a lot, the designer or inspector should check:

- the method and whether it was run with or without load, since the two give different numbers;
- that the certified temperatures are inside the range the design assumed, including any tolerance the purchase specification sets;
- that the lot number on the certificate matches the reel;
- that the wire's condition, for example straight-annealed and trained for actuator use, matches what was ordered.

A lot whose As is a few degrees lower than the design assumed may still be acceptable; one whose Mf is too high for the hottest environment is not, however good its other properties. Where the design's margins are small, the enclosure maker also runs its own bend-and-free-recovery check on a sample from each new reel, which takes a hot-water bath, a thermometer and twenty minutes, and confirms the certificate in the way the actuator actually uses the wire.

## Exercise: a warmer cabinet

A customer asks for VL-25 in cabinets that reach 70 °C at the latch. Using the 90 °C grade and an 11 °C shift for the bias stress:

1. What is the margin between the cabinet temperature and the loaded Mf, and what does that mean for resetting?
2. What is the margin against self-triggering?
3. What would you recommend?

**Worked answer.**

1. The loaded Mf is 62 + 11 = **73 °C**, only **3 °C** above the cabinet's 70 °C. The wire would just be able to reset, but very slowly, because its cooling slows sharply as it approaches its surroundings, and any lot with a slightly higher Mf, or a slightly higher bias stress, would not reset at all.
2. The loaded As is 82 + 11 = **93 °C**, 23 °C above the cabinet. Self-triggering is unlikely.
3. The reset margin is the problem. Options are a higher-temperature wire grade, if one with suitable fatigue performance is available; a lower bias stress, which lowers the shift but also the reset force, as Chapter 5 shows; ventilation or a heat shield at the latch to reduce its temperature; or a design in which the latch does not need the wire to reset fully, for example a mechanical re-cocking lever. The customer should also be told that a wire actuator at its temperature limit needs a qualification test at that temperature before it is trusted, and that the test should include a reset after operation, not only an operation, since resetting is the step the hot environment threatens.
