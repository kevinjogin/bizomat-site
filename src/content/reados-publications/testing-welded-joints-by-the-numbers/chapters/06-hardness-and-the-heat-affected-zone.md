---
book: testing-welded-joints-by-the-numbers
chapterSlug: hardness-and-the-heat-affected-zone
order: 6
title: "Hardness and the heat-affected zone"
description: "Calculate Vickers hardness from an indentation, plan a hardness traverse that finds the hardest zone beside a weld, and see why heat input and carbon equivalent move the result."
draft: false
---

The metal beside a weld is heated almost to melting and then cools quickly, drained of heat by the cold plate around it. In many steels that thermal cycle produces a narrow zone harder and less ductile than either the parent or the weld metal. A hard heat-affected zone is prone to hydrogen cracking during fabrication and to brittle fracture and cracking in service. The hardness test finds and measures it, quickly, cheaply and with a specimen no bigger than a matchbox, which is why it appears in almost every procedure qualification for steel.

This chapter explains the Vickers hardness test, plans a hardness traverse across the hopper procedure's weld, shows how heat input and the steel's composition move the result, and looks at the uncertainty of a hardness number.

## The Vickers test

In the Vickers test, a square-based diamond pyramid is pressed into the polished surface of a specimen under a known force, then removed. The two diagonals of the square indentation are measured under a microscope, and the hardness is calculated from the force and the mean diagonal. With the force F in newtons and the mean diagonal d in millimetres:

**HV ≈ 0.1891 × F ÷ d²**

The hardness is quoted with the test force, for example HV10 for a force of 10 kilograms-force, which is 98.07 N. ISO 9015-1 describes hardness testing of arc-welded joints, including where the indentations are placed.

```figure
type: formula
title: Vickers hardness from two indentations on the hopper procedure specimen
formula: HV ≈ 0.1891 × F ÷ d²
caption: This is an illustration at HV10. Because hardness depends on the inverse square of the diagonal, a small indentation means a hard zone, and small errors in reading the diagonal matter.
- F | test force, 98.07 N (HV10)
- d | mean diagonal of the indentation, mm
step: parent metal, d = 0.340 mm: HV ≈ 0.1891 × 98.07 ÷ 0.340² ≈ 160 HV10
step: heat-affected zone, d = 0.254 mm: HV ≈ 0.1891 × 98.07 ÷ 0.254² ≈ 287 HV10
```

A small indentation means a hard material, and because hardness depends on the inverse square of the diagonal, a 25% smaller diagonal means about 80% higher hardness. That sensitivity is both the test's strength and the reason for care in measurement.

## Why the heat-affected zone hardens

The heat-affected zone is the band of parent metal that was heated by the welding but did not melt. Close to the fusion line, it was heated far into the austenite range, where grains grow coarse, and then cooled quickly. If the steel has enough carbon and alloying elements, and if it cools quickly enough, it transforms into hard structures, martensite or hard bainite, rather than the softer ferrite and pearlite of the parent plate. [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/) explains the metallurgy and the carbon equivalent that summarises how hardenable a steel is.

Two things therefore set the hardness: the steel's hardenability, summarised by its carbon equivalent, and the cooling rate, set by the heat input, the plate thickness and any preheat. Higher carbon equivalent, lower heat input, thicker plate and colder plate all make the heat-affected zone harder.

## A hardness traverse

A single hardness indentation tells you the hardness at one point. To find the hardest zone, indentations are made in a row, a traverse, across the weld from parent metal through the heat-affected zone into the weld metal and out the other side, on a polished and etched cross-section. The etching shows where the zones are, so that indentations can be placed where they matter, particularly in the coarse-grained heat-affected zone just beside the fusion line, which is often less than a millimetre wide and is usually the hardest.

This is an illustration. A traverse across the hopper procedure's 12 mm butt weld, about 2 mm below the cap surface, gave:

```figure
type: line
title: Hardness traverse across the hopper procedure weld, 2 mm below the cap
x: Position from weld centre (mm)
y: Hardness (HV10)
ymin: 120
ymax: 320
caption: This is an illustration. The peak in each heat-affected zone sits just outside the fusion line, in the coarse-grained region. The customer's maximum for this example is 350 HV10.
legend: HV10
- -12 | 158
- -8 | 162
- -6 | 205
- -5 | 281
- -4 | 211
- 0 | 206
- 4 | 214
- 5 | 287
- 6 | 199
- 8 | 161
- 12 | 160
```

The parent metal sits around 160 HV10, the weld metal around 206 to 214 HV10, and each heat-affected zone peaks at about 281 to 287 HV10 just outside the fusion line, about 5 mm from the weld centre at this depth. The customer's specification for this example sets a maximum of 350 HV10, so the procedure passes with a margin of about 60 HV.

## Preparing the section

A hardness traverse is only as good as the section it is made on. The specimen is cut across the weld, ground flat and polished so that the indentation's corners are sharp and its diagonals can be read accurately, then etched lightly to reveal the weld metal, the fusion line and the heat-affected zone. Heat from cutting or heavy grinding can temper or harden the surface and change the reading, so the cut is made with cooling and the damaged layer is ground away. Indentations are spaced far enough apart that one does not sit in the deformed zone around its neighbour; test standards set the minimum spacing as a multiple of the indentation size. The same polished and etched section usually serves for the macro examination in Chapter 8, so the two tests are planned together.

## The effect of heat input

The fabricator also welded a trial plate at a deliberately low heat input, with faster travel and lower current than the procedure, to see how sensitive the hardness was. The heat-affected zone peak rose to about 322 HV10, an indentation diagonal of about 0.240 mm. That is still below 350, but the margin halved, from about 60 to about 28 HV.

The trial plate was cheap insurance, and the test told the fabricator two things. The procedure's heat input range should not be extended downwards without retesting. And the root and first runs, which are deposited on cold plate with small electrodes and so cool fastest, deserve attention, because they produce the hardest heat-affected zone in the joint, often harder than the traverse near the cap shows. A second traverse near the root is therefore part of the qualification, as the standards usually require.

```figure
type: compare
title: Heat-affected zone peak hardness at two heat inputs
cols: Procedure heat input | Low heat input trial
caption: This is an illustration. Faster cooling at low heat input raised the peak hardness and halved the margin to the 350 HV10 maximum used in this example.
- Mean diagonal at the peak | 0.254 mm | 0.240 mm
- Peak hardness | about 287 HV10 | about 322 HV10
- Margin to 350 HV10 | about 63 HV | about 28 HV
```

## Uncertainty of a hardness number

Because hardness depends on 1 ÷ d², the relative uncertainty in hardness is about twice the relative uncertainty in the diagonal. This is an illustration. If the diagonal of a 0.254 mm indentation can be read to within about 0.002 mm, that is about 0.8% of the diagonal and about 1.6% of the hardness, roughly ±4.5 HV at 287 HV. Indentation edges in a coarse-grained or poorly polished zone are harder to see, so the reading uncertainty there is larger, exactly where the peak hardness lies.

Placement adds a further uncertainty that no calculation captures. The coarse-grained zone is narrow, and an indentation placed half a millimetre too far from the fusion line can miss the peak entirely and read the softer, fine-grained zone beyond, as the failure below shows.

## Why hardness limits exist

Specifications limit heat-affected zone hardness mainly because hard zones crack. Hydrogen cracking, also called cold or delayed cracking, needs three things together: a susceptible hard microstructure, hydrogen dissolved in the weld region, and tensile stress, which welding shrinkage always supplies. Remove any one and the risk falls sharply. Hydrogen comes from moisture in consumables, fluxes and the joint, and from contaminants on the plate; the stress is unavoidable; so controlling hardness, through heat input, preheat and steel selection, is one of the main levers. [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/preheat-hydrogen-and-cooling/) explains how preheat and hydrogen control work together.

Hydrogen cracks can appear hours or even days after welding, as hydrogen diffuses to the hard zone and the stress builds. That is why some specifications require a delay before final inspection of welds in susceptible steels, and why a hardness result near its limit is a warning about cracking risk as well as about strength and toughness.

Some service environments set much stricter hardness limits. Steels in contact with wet hydrogen sulphide, in oil and gas service, can crack at hardness levels that would be quite safe in air, and the standards for that service set low maximum hardness values for welds and heat-affected zones. The hopper's dry, abrasive service has no such requirement, which is one reason its maximum in this example is relatively generous.

## Softening as well as hardening

In some modern steels the heat-affected zone softens rather than hardens. Quenched and tempered steels, and thermomechanically processed steels that gain their strength from controlled rolling, can lose some of that strength in the part of the heat-affected zone that was reheated to below its transformation temperature. A hardness traverse across such a weld shows a dip below the parent hardness, and if the soft zone is wide enough, a transverse tensile specimen may break in it at a lower stress than the plate. The traverse is how the dip is found and measured, and high heat input, which widens the soft zone, is limited in procedures for those steels.

## Other hardness tests

Vickers is the standard method for weld cross-sections because its small indentation can be placed precisely in narrow zones and because one scale covers soft and hard metals alike. Other methods have their places:

- **Brinell** uses a large ball and a large force, producing a wide indentation that averages over a coarse structure; it suits castings and plate but is too coarse for a heat-affected zone a millimetre wide.
- **Rockwell** measures the depth of indentation rather than its size and is fast, which suits production testing of heat-treated parts, but is less suited to precise placement in narrow weld zones.
- **Low-force Vickers**, using forces of a kilogram or less, makes very small indentations for very narrow zones, at the cost of greater sensitivity to surface preparation and reading errors.

## Hardness on site

Portable hardness testers, using rebound or ultrasonic contact impedance principles, can check hardness on production welds without cutting them, for example to confirm that a repair weld's heat-affected zone is not excessively hard. They are quick and useful as screening tools, but they need a carefully prepared surface, they convert their own measurement into a hardness scale through calibration that depends on the material, and their small or dynamic indentations are hard to place precisely in a narrow zone. Results are treated as indications, with laboratory Vickers testing on a sectioned specimen as the reference where a definitive value is needed.

## Hardness and strength

Hardness is related to tensile strength, and for carbon and low-alloy steels a rough rule is that the tensile strength in megapascals is around three times the Vickers number. Conversion tables, such as those in ISO 18265, give more precise relationships for particular materials, and also make clear how approximate such conversions are. Hardness is useful as a quick indication of strength in a zone too small for a tensile specimen, but a converted hardness is not a substitute for a tensile test where strength must be proved.

## A failure: the missed peak

This is an illustration. A customer's metallurgist reviewing an earlier qualification report from the fabricator queried its hardness traverse: the indentations were evenly spaced at 1 mm intervals across the whole joint, and the highest heat-affected zone reading was only 235 HV10, surprisingly low for the steel's carbon equivalent.

Sectioning a spare piece of the test plate and etching it showed why. The coarse-grained heat-affected zone was about 0.6 mm wide, and the evenly spaced indentations had fallen on either side of it, one in the weld metal and the next in the fine-grained zone beyond. A new traverse, with indentations placed at the fusion line and stepping out from it at small intervals, found a peak of 301 HV10. The procedure still passed, but the original report had understated the peak by more than 60 HV, enough to have hidden a real problem on a more hardenable steel.

The fabricator now requires the laboratory to place traverse indentations by reference to the etched fusion line, as the hardness standard intends, and to show their positions on a photograph of the etched section in the report.

## Exercise: two indentations

At HV10, an indentation in a weld metal has a mean diagonal of 0.310 mm, and one in a heat-affected zone has a mean diagonal of 0.230 mm. Calculate the two hardness values. Then calculate how much the heat-affected zone value changes if its diagonal is misread as 0.232 mm.

For the weld metal, HV ≈ 0.1891 × 98.07 ÷ 0.310² ≈ **193 HV10**. For the heat-affected zone, HV ≈ 0.1891 × 98.07 ÷ 0.230² ≈ **351 HV10**. With the diagonal misread as 0.232 mm, the hardness becomes about 0.1891 × 98.07 ÷ 0.232² ≈ **345 HV10**, about 6 HV lower.

A misreading of 0.002 mm, two micrometres, moves the result from just above a 350 HV10 limit to just below it. Near a limit, the uncertainty of the measurement matters as much as the measurement, as Chapter 3 showed for tensile results, and a heat-affected zone reading this close to a maximum would justify repeat indentations and a closer look at the procedure's heat input.
