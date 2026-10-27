---
book: accelerated-life-testing-by-the-numbers
chapterSlug: thermal-cycling-and-solder-fatigue
order: 5
title: "Thermal cycling and solder fatigue"
description: "Why solder joints crack under temperature cycles, Coffin–Manson and Norris–Landzberg acceleration, FL-60's LED board test, and a chamber profile the board never followed."
draft: false
---

Every time FL-60 switches on, its LED board warms from the night air to about 60 °C; every morning it cools again. The LED packages and the aluminium-core board they are soldered to expand by different amounts as they warm, and the solder joints between them are forced to take up the difference. Each cycle strains the joints a little, and after enough cycles a crack starts, grows, and eventually opens the joint. This is fatigue, and unlike the chemical processes of the earlier chapters, it is not accelerated by holding the product hot. It is accelerated by making the temperature cycles larger and more frequent.

This chapter explains where the strain in a solder joint comes from, sets out the Coffin–Manson relationship and the Norris–Landzberg model that adds the effects of frequency and peak temperature, applies them to FL-60's LED board to design a thermal-cycling test, discusses how to monitor the joints and what the models' parameters are worth, and ends with a test whose chamber cycled correctly while the board inside it did not.

## Where the strain comes from

Materials expand as they warm, each at its own rate, its coefficient of thermal expansion. Aluminium expands by about 23 parts per million for each kelvin; a ceramic LED package by roughly a third of that. Soldered together and warmed, the board tries to grow more than the package, and the solder between them is sheared. [How materials grow with temperature](/reados/publications/thermal-expansion-by-the-numbers/how-materials-grow-with-temperature/) in *Thermal Expansion by the Numbers* gives the expansion coefficients of common materials.

The shear strain in a joint is roughly the difference in expansion coefficients, times the temperature swing, times the distance from the package's centre to the joint, divided by the joint's height. This is an illustration. With an expansion difference of about **17 parts per million per kelvin**, a distance of **1.5 mm** from the centre of a 3 mm package to its joint, and a joint **0.05 mm** high, FL-60's daily swing of **40 K** gives a shear strain of 17 × 10⁻⁶ × 40 × 1.5 ÷ 0.05 = about **2%**. A test swing of 140 K gives about **7%**. Strains of this size go well beyond the solder's elastic range, so each cycle does a little plastic damage, and the damage accumulates.

```figure
type: svg
title: Why a solder joint is sheared by a temperature change
alt: A side view of a small rectangular LED package sitting on two solder joints on a long aluminium board. Arrows show the board expanding more than the package when warmed. The solder joints at each end are drawn leaning outward, sheared by the difference. Labels give the expansion difference, the distance from the package centre to the joint and the joint height.
caption: This is an illustration. The board grows more than the package, and the joints, which hold them together, take up the difference as shear. A larger swing, a larger package or a thinner joint means more strain.
viewbox: 0 0 640 250
body:
<rect class="bx" x="40" y="160" width="560" height="40" rx="3"/>
<text class="tx txs" x="50" y="222">aluminium-core board, about 23 ppm/K</text>
<rect class="bxa" x="220" y="96" width="200" height="40" rx="3"/>
<text class="txb" x="252" y="122">LED package</text>
<text class="tx txs" x="440" y="110">ceramic, roughly a third as much</text>
<path class="li" d="M232 136L222 160H250L256 136Z"/>
<path class="li" d="M388 136L394 160H422L412 136Z"/>
<path class="la" d="M300 182H140M340 182H500"/>
<path class="ah" d="M140 182l12-6v12zM500 182l-12-6v12z"/>
<text class="txa" x="252" y="196">board grows more</text>
<path class="ln dsh" d="M320 80V144"/>
<path class="ln" d="M320 72H420"/>
<text class="tx txs" x="330" y="64">distance to joint, 1.5 mm</text>
<text class="tx txs" x="40" y="40">shear strain ≈ Δα × ΔT × distance ÷ joint height</text>
```

## Coffin–Manson: bigger cycles, fewer of them

Fatigue experiments on many materials show that the number of cycles to failure falls steeply as the strain range per cycle rises, following a power law. This relationship, associated with Coffin and Manson, means that if the strain in each cycle is proportional to the temperature swing, the number of cycles to failure varies as the swing raised to a negative power. The acceleration factor between a test swing and a use swing is then the ratio of the swings raised to that power: AF = (ΔTtest ÷ ΔTuse)^n.

The exponent n is the parameter that matters, and like the activation energy of Chapter 2 it belongs to a material and a mechanism. For FL-60's test swing of 140 K against its daily 40 K, an exponent of 2 gives AF = 3.5² = **12.3**, and an exponent of 2.5 gives **22.9**. The choice of exponent nearly doubles the answer, so it must come from data for the solder alloy and joint type.

## Norris–Landzberg: frequency and peak temperature

Solder is not an ordinary engineering metal at these temperatures. It is close enough to its melting point that it creeps, deforming slowly under a steady load. In a slow cycle with long dwells at the extremes, the joint has time to creep, and more damage is done per cycle than in a fast one. Norris and Landzberg, studying flip-chip joints at IBM in 1969, extended the Coffin–Manson relationship with two more terms: one for cycling frequency and one, Arrhenius-like, for the peak temperature of the cycle.

```figure
type: formula
title: The Norris–Landzberg acceleration factor for solder fatigue
formula: AF = (ΔTtest ÷ ΔTuse)^1.9 × (fuse ÷ ftest)^(1/3) × exp[1,414 × (1/Tmax,use − 1/Tmax,test)]
caption: Constants fitted for tin–lead eutectic solder, as summarised by Accendo Reliability; one study cited there suggests they apply to lead-free solder as well, which should be checked for the alloy in use. Temperatures in the last term are absolute.
- ΔT | temperature range of the cycle, K
- f | cycling frequency, cycles per day
- Tmax | peak temperature of the cycle, K
- 1,414 | the fitted constant Ea/k, K
step: FL-60 use: 20 °C to 60 °C, once a day. Test: −40 °C to +100 °C, 24 cycles a day
step: Range term (140 ÷ 40)^1.9 = 10.81; frequency term (1 ÷ 24)^(1/3) = 0.347; peak term exp[1,414 × (1/333.15 − 1/373.15)] = 1.576
step: AF = 10.81 × 0.347 × 1.576 = 5.91
```

The frequency term works against the test. Cycling 24 times faster than service gives each cycle less time to creep, so each test cycle does less damage than its size alone would suggest, and the factor falls by about a third. The peak-temperature term works the other way: a hotter peak lets the solder creep more, so the 100 °C test peak adds about 58% to the damage per cycle.

## FL-60's LED board test

This is an illustration. FL-60's LED board sees about one cycle a day for 10 years, **3,650 cycles**. With an acceleration factor of 5.91, the test must run 3,650 ÷ 5.91 = **618 cycles** to represent one design life, about **26 days** at 24 cycles a day. To demonstrate two design lives, which Chapter 7 shows is useful with a small sample, the test needs about **1,235 cycles**, about 51 days.

```figure
type: compare
title: Thermal-cycling test options for FL-60's LED board
cols: Acceleration factor | Cycles for one design life | Days of chamber time
caption: This is an illustration, from the Norris–Landzberg model with the tin–lead constants. A milder profile is safer for the materials but needs more cycles; a faster one needs more cycles but fewer days.
- 0 °C to 100 °C, 24 a day | 3.12 | 1,171 | 48.8
- * −40 °C to 100 °C, 24 a day | 5.91 | 618 | 25.8
- −40 °C to 100 °C, 48 a day | 4.69 | 779 | 16.2
```

The choice of profile has limits of its own. The upper temperature must stay below anything that would change the mechanism, such as the board's or the LED package's maximum ratings, the glass transition of the board's dielectric, and the point where the solder's microstructure changes quickly. The lower temperature must not introduce cracking of brittle materials that never meets such cold in service. The ramp rate must be one the chamber can deliver to the board, not just to its air, and the dwells at each extreme must be long enough for the board to reach the set temperature and for creep to occur. FL-60's profile of −40 °C to +100 °C sits within the LED maker's storage and operating ratings, with 10-minute dwells at each end.

### Chamber cycling and power cycling

In service, FL-60's LED board is not warmed by the air around it. It is warmed from inside, by the LEDs' own heat, which flows from each package through its solder joints into the board and out through the housing. The package is therefore hotter than the board during warm-up and in steady running, and the joints see a temperature gradient as well as a temperature change. A chamber, by contrast, warms everything from outside, and the package and board change temperature together.

The two kinds of cycling strain the joints differently. In a chamber cycle, the strain comes only from the difference in expansion coefficients at a common temperature. In a power cycle, the hotter package expands more than its coefficient alone would suggest, which partly offsets the board's larger coefficient, while the gradient adds bending. For some packages the chamber test is the harsher, for others the power cycle. A sound plan for a product that heats itself includes some **power cycling**: switching the LEDs on and off in a chamber held at a low ambient temperature, so that each cycle reproduces the real pattern of internal heating. FL-60's plan runs a smaller power-cycling test alongside the chamber test, with its own cycle count from the same use profile, and compares the failure modes from the two. If both produce the same crack path through the solder, the chamber test's faster cycling can be trusted as the main evidence.

## Monitoring the joints

A cracked solder joint often keeps making contact while the board is at one temperature and opens only at the other extreme, or for a few milliseconds as the crack faces slide. A test that checks the board only at room temperature at the end can miss it. FL-60's test therefore monitors each LED string continuously, measuring the string's voltage and current through every cycle, and records an event whenever the resistance of a string rises above a threshold, even briefly. A joint is counted as failed at its first confirmed event, and every failed joint is sectioned and examined to confirm that it failed by fatigue cracking through the solder, not by some other mechanism.

Fatigue cracks also grow gradually, so periodic measurements can show progress before failure. A light-output measurement and a forward-voltage measurement at intervals show whether the LEDs' thermal path, which passes through the same solder joints, is degrading as cracks grow, which is often the first sign.

## How firm are the numbers?

Of all the models in this book, the fatigue models are the most dependent on their fitted constants and on the details of the joint. The Norris–Landzberg constants were fitted for tin–lead joints of a particular kind; modern lead-free alloys have different creep behaviour, and published refits for them differ, even though one study suggests the original values are a reasonable approximation. Package size, joint height, board material and the solder's microstructure all change the answer. The business therefore treats the calculated factor as a planning figure, tests to two design lives rather than one, and compares its results with the LED maker's own board-level reliability data where the maker publishes it. Where the stakes are high, a finite-element model of the joint strain and a test at two different temperature ranges can pin down the exponent for the real joint. Whatever the source of the constants, the report should state them, show how the required cycle count changes across a plausible range of the exponent, and say which way the uncertainty would have to go to make the product fail its target.

## The error: a profile the board never followed

This is an illustration. FL-60's first thermal-cycling test ran 618 cycles of a chamber profile from −40 °C to +100 °C, with 10-minute dwells, and no joints failed. The test report concluded that the board had demonstrated one design life.

A reviewer asked for the board's temperature record, not the chamber's. The LED boards had been mounted on a heavy aluminium fixture plate inside the chamber, and nobody had put a thermocouple on a board. When one was fitted, the board was found to lag the chamber air badly: with 10-minute dwells, it reached only about **−30 °C** and **+75 °C** before the chamber reversed. Its real cycle was 105 K with a peak of 75 °C, not 140 K with a peak of 100 °C.

Recalculating with the board's real cycle, the range term is (105 ÷ 40)^1.9 = 6.26 and the peak term is exp[1,414 × (1/333.15 − 1/348.15)] = 1.20, so the acceleration factor is about 6.26 × 0.347 × 1.20 = **2.60**. The 618 cycles therefore represented only about 1,609 days of service, about **4.4 years**, less than half the design life. To demonstrate one design life on that profile would have needed about **1,402 cycles**.

The test was repeated with the boards mounted on thin standoffs instead of the heavy plate, longer dwells set from a measured board temperature, and thermocouples bonded to two boards for the whole test, so that the profile that counts, the board's, is recorded. The test report now gives the acceleration factor from the measured board cycle, not the chamber's setting.

```figure
type: checklist
title: Thermal-cycling test checks for FL-60's LED board
caption: The open item is this chapter's error. The stress that matters is the one on the joint, and the chamber's set points are not it.
- x Use cycle described | 20 °C to 60 °C, once a day, 3,650 cycles
- x Model and constants stated with their source | Norris–Landzberg, tin–lead constants, checked for lead-free
- x Profile within every material's limits | −40 °C to +100 °C inside the LED and board ratings
- x Joints monitored continuously through each cycle | event detection, sectioning of failures
- ? Board temperature measured, and AF calculated from it | heavy fixture: −30 °C to +75 °C, AF 2.60, not 5.91
```

## How this applies to a small Australian business

Daily thermal cycles are the normal life of outdoor equipment in Australia, where a dark enclosure in summer sun can swing by 40 K or more between night and afternoon, and of anything that switches on and off. Any product with large components on a board, or a board on a metal base, has solder joints that fatigue. A small manufacturer can do most of what this chapter describes with a hired chamber and a few thermocouples: count the use cycles, estimate the swing, choose a test profile within the parts' ratings, measure the board, not the chamber, and monitor the joints through the test. The models give a planning figure; the measured board temperature and the sectioned joints are what make the result believable.

## Exercise: a faster chamber

A test laboratory offers a fast-ramp chamber that can run FL-60's −40 °C to +100 °C profile, measured on the boards, at **48 cycles a day**. Using the Norris–Landzberg model, what is the acceleration factor, how many cycles represent two design lives, and how many days would the test take?

**Worked answer.** The range term and peak term are unchanged at 10.81 and 1.576. The frequency term becomes (1 ÷ 48)^(1/3) = 0.275, so AF = 10.81 × 0.275 × 1.576 = **4.69**. Two design lives are 7,300 field cycles, so the test needs 7,300 ÷ 4.69 = about **1,557 cycles**, which at 48 a day takes about **32 days**. The faster chamber needs more cycles than the 24-a-day chamber's 1,235, because each fast cycle allows less creep, but it finishes in about 32 days instead of 51. It is worth taking, provided the board temperature is measured to confirm that the boards really follow the faster profile.
