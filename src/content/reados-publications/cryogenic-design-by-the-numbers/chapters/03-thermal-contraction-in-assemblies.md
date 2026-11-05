---
book: cryogenic-design-by-the-numbers
chapterSlug: thermal-contraction-in-assemblies
order: 3
title: "Thermal contraction in assemblies"
description: "Contraction of cryostat materials from NIST, mean coefficients for constant-property tools, fits that open, bolts that lose preload, supports that shrink, and two dowels that sheared."
draft: false
---

Every part of a cryostat shrinks as it cools, and no two materials shrink by the same amount. A spigot that locates an aluminium coil former in a copper plate fits snugly at room temperature and rattles at 40 K. A stainless steel bolt that clamps an aluminium flange tightly on the bench loses most of its grip when cold. Two dowels that hold parts of different materials in register try to pull apart. None of this is visible when the cryostat is assembled, and all of it happens inside a vacuum vessel where nobody can see it.

This chapter tabulates the contraction of CT-40's materials from NIST's data, shows how to turn them into the mean coefficients that the BIZOMAT thermal growth and differential expansion tools need, and works through CT-40's fits, bolted joints and supports. It ends with a pair of dowels that sheared on the first cooldown.

## How much each material shrinks

Chapter 1 explained why contraction follows the heat capacity down and almost stops below 40 K. NIST publishes it as the change in length from 293 K, which is exactly what a designer needs: the total shrinkage from the assembly temperature to the operating one.

```figure
type: bars
title: Contraction from 293 K to 40 K, from NIST's cryogenic fits
unit: % of length
max: 2.2
caption: NIST Cryogenic Technologies Group fits. G-10 contracts much less along its glass fibres than across them; PTFE contracts most of all. Invar contracts least, which is why it is used to correct mismatches.
- PTFE | 2.08
- G-10 across the fibres | 0.69
- 6061 aluminium | 0.41
- * OFHC copper | 0.32
- Beryllium copper | 0.31
- 304 stainless steel | 0.30
- G-10 along the fibres | 0.23
- Ti-6Al-4V | 0.17
- Invar | 0.04
```

What matters in an assembly is not each contraction but the differences between them. Aluminium on copper differs by 0.088% of length, aluminium on stainless steel by 0.114%, and copper on stainless steel by only 0.025%. Copper and stainless steel are a forgiving pair; aluminium with either needs care; PTFE with anything needs a great deal. A useful habit is to write the contraction difference of every pair of materials that touch on the assembly drawing itself, next to the joint, so that whoever reviews or changes the design sees the movement as well as the dimensions.

## Mean coefficients for constant-property tools

The BIZOMAT expansion tools take a constant coefficient. As in Cryogenic Liquids by the Numbers, they give exact answers if they are given the mean coefficient over the actual range: the total contraction divided by the temperature change.

```figure
type: compare
title: Mean expansion coefficients from 293 K to 40 K
cols: Contraction to 40 K | Mean coefficient | Room-temperature value for comparison
caption: Mean coefficient = contraction ÷ 253.15 K, from NIST's fits. Room-temperature values are the slope of the same fits near 293 K and are shown only to make the point that they must not be used here.
- OFHC copper | 0.3233% | 12.77 µm/(m·K) | 16.6 µm/(m·K)
- 6061 aluminium | 0.4115% | 16.26 µm/(m·K) | 22.6 µm/(m·K)
- 304 stainless steel | 0.2979% | 11.77 µm/(m·K) | 15.4 µm/(m·K)
- G-10 along the fibres | 0.2339% | 9.24 µm/(m·K) | 11.8 µm/(m·K)
- * Invar | 0.040% | 1.58 µm/(m·K) | 0.95 µm/(m·K)
```

This is an illustration. The [linear thermal growth tool](/tools/thermal-growth/) gives the signed change in length from a constant coefficient and two temperatures. For CT-40's 300 mm copper plate, with 12.77 µm/(m·K) from 20 °C to −233.15 °C, it gives a change of **−0.970 mm** in diameter, which is NIST's 0.3233% of 300 mm. Using the room-temperature slope of 16.6 µm/(m·K) would overstate it by 30%. Invar is the odd one out: its coefficient is smallest near room temperature, and most of its small contraction happens below it.

## Fits that open up

CT-40's aluminium coil former is located on its copper plate by a 150 mm spigot in a bore, a close sliding fit at room temperature. When the assembly cools, the aluminium spigot shrinks more than the copper bore around it, and the fit opens.

The [differential expansion tool](/tools/differential-expansion/) calculates the change in diametral clearance between a bore and a shaft of different materials for a uniform temperature change, from their two coefficients. With a 150 mm diameter, the copper bore at 12.77 µm/(m·K), the aluminium spigot at 16.26 µm/(m·K) and a temperature change of −253.15 K, it gives:

```figure
type: stats
title: CT-40's coil former spigot from the differential expansion tool
caption: This is an illustration. Mean coefficients from NIST's fits between 293 K and 40 K. A positive change means the clearance grows.
- −0.4848 mm | Bore growth, copper | a contraction
- −0.6174 mm | Spigot growth, aluminium | a larger contraction
- * +0.1325 mm | Change in diametral clearance | the fit opens by 0.13 mm
```

A spigot with a few hundredths of a millimetre of clearance at room temperature has about 0.15 mm at 40 K. The coil can shift sideways by half that on the plate, which matters if it is aligned with a field probe or a viewing window, and its contact with the plate, which carries its heat, depends then only on the clamping bolts. The cures are to make the former from copper, so that both parts contract together; to locate it with radial keys or slots that allow growth and shrinkage from a fixed centre; or to load it against one side with a spring that keeps it located at every temperature.

## Bolted joints that loosen

Bolts are the commonest mismatch in a cryostat. A bolt clamps a stack of parts with a preload set by tightening, which stretches the bolt slightly. If the stack shrinks more than the bolt as both cool, the bolt's stretch is taken back by the difference and its preload falls; if the stack shrinks less, the preload rises.

This is an illustration. An M6 stainless steel bolt clamps 20 mm of aluminium flange to the copper plate. At a preload of 6 kN, the bolt is stretched by 6,000 × 20 ÷ (20.1 mm² × 193,000 MPa) = 0.031 mm. Cooling to 40 K, the aluminium shrinks 20 × 0.4115% = 0.0823 mm and the bolt 20 × 0.2979% = 0.0596 mm, a difference of **0.0227 mm**. That takes back 73% of the bolt's stretch, and the joint's own compliance, which this simple estimate leaves out, makes the loss larger still. A joint tightened to 6 kN on the bench holds about 1.6 kN or less when cold.

```figure
type: steps
title: Restoring preload in an aluminium joint with an Invar washer
caption: This is an illustration. Contractions from NIST's fits between 293 K and 40 K: aluminium 0.4115%, stainless steel 0.2979%, Invar 0.040%. The washer's thickness t makes the stack shrink exactly as much as the bolt, whose grip grows by t.
- Condition | stack contraction = bolt contraction
- Equation | 20 × 0.4115% + t × 0.040% = (20 + t) × 0.2979%
- Rearranged | t = 20 × (0.4115 − 0.2979) ÷ (0.2979 − 0.040)
- * Washer thickness | t = 8.8 mm of Invar under the bolt head
- Alternative | conical spring washers that store enough deflection to cover 0.023 mm
```

Both cures are used. An Invar washer of the right thickness cancels the mismatch at every temperature; a stack of conical spring washers, chosen so that the 0.023 mm change uses only part of their deflection, keeps the preload nearly constant without balancing the materials. For copper joints with stainless steel bolts the mismatch is about a quarter as large and spring washers usually suffice. Joints that carry heat, such as CT-40's strap joints in Chapter 6, need their preload most of all, because their thermal contact depends on it.

## Supports that shrink

CT-40's cold plate hangs from the vessel's warm top flange on three G-10 tubes 150 mm long. Fully cold, G-10 along its fibres would shorten by 0.2339% of 150 mm, 0.35 mm. But a support has a temperature gradient along it, from 293 K at the flange to 40 K at the plate, and only its cold end shrinks fully. Integrating NIST's contraction along the temperature profile that Chapter 5 finds in the tube gives a shortening of about **0.17 mm**.

The plate therefore rises by about 0.17 mm towards the flange as it cools, and the coil with it. Because the three supports are the same, the plate rises without tilting. If one support were stainless steel and two G-10, it would tilt. And if the plate were also fixed sideways to the vessel at any point, say by a rigid current lead, the plate's own 0.97 mm of diametral shrinkage would pull on that lead. Every connection between the cold mass and the warm vessel, including leads, wiring and the cooler's strap, is designed to flex enough to take these movements.

## Uneven cooling and the stresses it brings

The contractions above are for a part that has reached its final temperature everywhere. During cooldown, parts are not at one temperature. CT-40's plate cools from the point where the strap joins it, so for the first hour or so its strap end is colder than its far edge, and the cold end tries to shrink while the warm end does not. For a well-conducting copper plate the differences stay small, a few kelvins, because copper spreads heat quickly. For a poorly conducting part, or a joint between a copper plate and a thick stainless steel or G-10 part, they can be large, and a bonded joint between such parts sees its worst stress during cooldown rather than at the operating temperature.

Two rules limit the risk. Bonded and soldered joints between materials of different contraction are kept short and thin, so that the mismatch is taken in the joint's own flexibility. And cooldown rates are kept modest for assemblies with brittle parts, such as ceramic feedthroughs, sapphire windows and epoxy-impregnated coils. CT-40's cooler, at 120 W into an 18.6 kg mass, cools its plate at about 50 K an hour at the start, well within what its parts tolerate. Large magnets and cryostats with long epoxy-impregnated windings are often cooled far more slowly than their coolers allow, under control of the temperature difference across the winding, for exactly this reason: the steady state is safe, and the risk lies in getting there.

## Leads, wires and the cooler's strap must flex

Everything that crosses from the warm vessel to the cold mass is a link between two parts that move relative to each other. The plate rises about 0.17 mm as its supports shorten, and shrinks 0.97 mm in diameter, so a point on its rim moves about 0.49 mm inwards. The cooler's cold stage also moves, because the cold head's own tube shrinks as it cools.

The design response is the same everywhere: give each link enough flexibility to take the movement without large forces. Current leads are made with a loop or a braided section near the cold end; instrument wires are left slack and anchored in coils; and the strap between the cold stage and the plate is made of thin laminations or braid, not solid bar, so that it carries heat well along its length while bending easily across it. Chapter 6 sizes that strap for heat; this chapter's movements set its shape.

## Seals at the warm end

CT-40's vacuum seals are all on the vessel at room temperature, where ordinary elastomer O-rings work. Seals that must work cold are a separate problem, because elastomers lose their elasticity and contract several times more than the metals around them. Cryogenic seals use metal: soft indium wire squeezed between flanges, or metal rings with a spring core. Indium has a particular virtue for cold seals and thermal joints alike: it stays soft at low temperatures, so it flows into the surfaces' roughness and keeps its contact as the flanges shrink. Wherever possible, though, the designer keeps every demountable seal warm.

## The error: two dowels that sheared

This is an illustration. CT-40's first coil former was located on the cold plate by two 6 mm hardened steel dowels, 180 mm apart, pressed into the copper plate and fitting closely into holes in the aluminium former. On the first cooldown the coil's position sensor showed a sudden jump at about 120 K, and when the cryostat was opened one dowel had sheared and the other was bent.

The calculation shows why. Between room temperature and 40 K the aluminium shrinks 0.088% more than the copper, so the dowel holes in the former move 180 × 0.088% = **0.159 mm** closer together than the dowels in the plate. Something had to give. Restraining that difference fully would stress the aluminium by about 77.7 GPa × 0.088% = 69 MPa, NIST's modulus for 6061 at 40 K times the mismatch strain, and across a former section of about 2,000 mm² that is a force of the order of 137 kN, far beyond what two 6 mm dowels can carry in shear.

The engineer found the cause by comparing the two materials' contractions over the dowel spacing, which takes a minute once the table above is to hand. The new former is located by one round dowel at its centre and one diamond or slotted locator on a radius, which fixes its position and rotation while letting it shrink towards the centre freely. The rule that came from it applies to any cryostat: between two materials that contract differently, locate at one point and guide at the others.

## Exercise: a stainless clamp across an aluminium former

A stainless steel strap 120 mm long is bolted at both ends across the aluminium coil former to hold the coil down, with the bolt holes in the strap fitting the bolts closely. Using the mean coefficients above, find how much the strap and the former each shrink between the bolts from 20 °C to 40 K, the mismatch, and what it means for the strap. Then check the former's contraction with the thermal growth tool.

**Worked answer.** This is an illustration. Over 120 mm, the aluminium former shrinks 120 × 0.4115% = **0.494 mm** and the stainless strap 120 × 0.2979% = **0.357 mm**, a mismatch of **0.136 mm**. The bolts in the former move closer together than the strap's holes, so the strap is pushed into compression, and with close-fitting holes it will either bow, slip or load the bolts in bending. The cures are those of this chapter: slot one end of the strap so that it can slide, or make the strap of aluminium so that it shrinks with the former. The thermal growth tool, with 120 mm, 16.26 µm/(m·K), 20 °C and −233.15 °C, gives −0.494 mm for the former, confirming the figure.
