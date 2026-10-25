---
book: brazing-and-soldering-by-the-numbers
chapterSlug: clearance-and-thermal-expansion
order: 3
title: "Clearance and thermal expansion"
description: "Calculate how a joint's clearance changes between room and brazing temperature for copper, brass, steel and stainless pairs, and set room-temperature fits that give the right gap when it counts."
draft: false
---

Chapter 2 showed that a capillary joint needs a gap in a narrow band, for flux brazing about 0.05 to 0.13 mm according to the filler maker quoted there. But that is the gap at brazing temperature, several hundred degrees above the temperature at which the parts were machined and assembled. Between the two, every part grows, and if the two parts of a joint are of different metals, they grow by different amounts. A joint that has a perfect clearance on the bench can close up solid or open wide by the time the filler melts.

This chapter calculates how much clearance changes on heating for the pairs of metals the manufacturer brazes, shows how to set the room-temperature fit to give the right gap at temperature, and works through a run of leaking headers caused by a hole drilled to the right size for the wrong temperature.

## Radial and diametral clearance

Two ways of stating clearance are used, and mixing them up doubles or halves the gap. The **diametral** clearance of a tube in a socket is the difference between the socket's bore and the tube's outside diameter. The **radial** clearance is half of that: the gap on each side, if the tube is centred. Capillary flow sees the radial gap, the actual distance between the surfaces, and filler makers' clearances are usually radial or per side, though their data sheets should be read to be sure. This book states radial clearance unless it says otherwise. A tube of 22.00 mm diameter in a bore of 22.20 mm has a diametral clearance of 0.20 mm and a radial clearance of 0.10 mm.

## How much parts grow

A part heated through a temperature rise ΔT grows in every dimension by a fraction α × ΔT, where α is the coefficient of linear thermal expansion. For the metals in this book, α is roughly constant over the range from room temperature to brazing temperature, close enough for clearance calculations.

```figure
type: bars
title: Approximate coefficients of linear thermal expansion
unit: millionths per °C (10⁻⁶ /°C)
max: 25
caption: Approximate mean values from room temperature to several hundred degrees, for teaching. Actual values vary with alloy and temperature range; use the material maker's data for real fits.
- Tungsten carbide with cobalt, about | 5.5
- *Carbon steel, about | 12
- Copper, about | 17
- Austenitic stainless steel, about | 17
- Brass, about | 19.5
- Aluminium, about | 23
```

The spread is wide. Brass grows about one and a half times as much as carbon steel for the same heating, and carbide less than half as much. Whenever two different metals meet in a brazed joint, the clearance changes on the way to brazing temperature, and changes back on cooling, when the filler has solidified and can no longer adjust.

## The change in clearance

For a tube of diameter d in a socket of a different metal, both heated through ΔT, the socket bore and the tube both grow, and the radial clearance changes by half the difference in their growth.

```figure
type: formula
title: Change in radial clearance on heating, tube in socket
formula: Δc = d × (α_socket − α_tube) × ΔT ÷ 2
caption: This is an illustration for a 22 mm copper tube in a carbon steel header, heated from 20 °C to about 750 °C. A negative change means the gap closes.
- d | 22 mm
- α steel socket | about 12 × 10⁻⁶ /°C
- α copper tube | about 17 × 10⁻⁶ /°C
- ΔT | about 730 °C
step: Δc = 22 × (12 − 17) × 10⁻⁶ × 730 ÷ 2
step: Δc ≈ −0.040 mm: the radial gap closes by about 0.04 mm
```

Forty thousandths of a millimetre sounds trivial until it is compared with the recommended band of 0.05 to 0.13 mm. A copper tube fitted into a steel header with a radial clearance of 0.05 mm at room temperature would have only about 0.01 mm at brazing temperature, far too tight for flux to flow. The same tube fitted with 0.15 mm at room temperature would have about 0.11 mm when hot, comfortably in the band.

## Four pairs at brazing temperature

The direction of the change depends on which metal is outside. When the outer part expands more than the inner, the gap opens; when the inner part expands more, it closes.

```figure
type: bars
title: Radial clearance at about 750 °C for a 22 mm joint set to 0.05 mm at room temperature
unit: mm of radial clearance when hot
max: 0.12
caption: This is an illustration using the approximate expansion coefficients in this chapter. The recommended band for flux brazing quoted in Chapter 2 is about 0.05 to 0.13 mm.
- *Copper tube in steel header | 0.010
- Copper tube in stainless fitting | 0.050
- Copper tube in brass body | 0.070
- Steel tube in copper fitting | 0.090
```

Copper in steel closes up. Copper in stainless steel, with nearly equal coefficients, hardly changes. Copper in brass opens a little, because brass grows more than copper. Steel in copper opens markedly. The same room-temperature fit gives four different joints when hot, and only one of them, copper in steel, falls out of the recommended band.

## Setting the room-temperature fit

The calculation turns round easily. Choose the clearance wanted at brazing temperature, subtract the change on heating, and the result is the clearance to machine or drill at room temperature.

For the manufacturer's copper tubes in steel headers, aiming at about 0.10 mm when hot, the room-temperature radial clearance should be about 0.10 + 0.04 = **0.14 mm**, a bore of about 22 + 2 × 0.14 ≈ **22.28 mm** for a 22.00 mm tube. For copper tubes in brass bodies, aiming at the same hot gap, the room-temperature clearance should be about 0.10 − 0.02 = **0.08 mm**, a bore of about 22.16 mm. Those bores must then be held within a tolerance, and the tube's own diameter tolerance must be allowed for, as the next section shows.

## Tolerances

Neither the tube nor the bore is exactly its nominal size. Copper tube is made to a diameter tolerance set by its standard, and a drilled or reamed hole has its own tolerance, depending on the tool and the process. The clearance in any particular joint can be anywhere between the tightest combination, the largest tube in the smallest bore, and the loosest, the smallest tube in the largest bore.

This is an illustration. If the copper tube's outside diameter may be up to 0.04 mm above or below 22.00 mm, and the header bore is reamed to 22.28 mm with a tolerance of ±0.03 mm, the diametral clearance at room temperature can range from 22.25 − 22.04 = 0.21 mm to 22.31 − 21.96 = 0.35 mm, a radial clearance of about 0.105 to 0.175 mm. Subtracting the 0.04 mm closure on heating, the hot radial clearance ranges from about **0.065 to 0.135 mm**, which sits almost entirely in the recommended band. A drilled hole with a wider tolerance, say ±0.08 mm, would push the loosest joints well outside it.

## Concentricity

A clearance calculation assumes the tube sits in the middle of the bore. It rarely does unless something holds it there. A tube resting on one side of its bore has zero clearance there and twice the nominal clearance on the opposite side. The filler flows round the tight side poorly, if at all, and fills the wide side weakly. Production joints therefore use something to centre the parts: a fixture, a swaged or expanded tube end, a fitting designed with a stop and a lead-in, or simply the weight of a vertical tube in a well-fitted socket. For hand brazing, the brazer supports the tube so that it is not leaning in its socket while the joint is heated.

The effect of an offset is easy to underestimate. This is an illustration. A tube with a nominal radial clearance of 0.10 mm that rests against one side of its bore has 0 mm on that side and 0.20 mm on the other. The tight side is outside the recommended band at the bottom, the wide side outside it at the top, and the joint has the worst of both: flux trapped on one side and weak, sagging filler on the other. Centring is not a refinement; it is part of the clearance.

## Measuring what you made

A clearance that is calculated but never measured is a hope. For production joints, the bore and the tube are both checked: bores with a plug gauge or a bore gauge, tubes with a micrometer or a ring gauge, on a sample from each batch and whenever a tool is changed. A go and no-go plug gauge pair, made to the smallest and largest acceptable bore, lets an operator check every hole in seconds. Tube from a new supplier or a new batch is measured before use, because a change of a few hundredths of a millimetre in its diameter moves every joint. The manufacturer added a pair of plug gauges for each bore size after the header failure, and records the gauge check on the batch sheet with the brazing temperature and the filler lot.

## Surface finish

The finish of the surfaces in the gap matters as well as their size. Filler makers note that ordinary machined or mill-finish surfaces suit capillary flow, while highly polished surfaces can resist it, because the filler and flux spread less readily on a very smooth surface. Very rough surfaces, on the other hand, make the effective gap uneven, with high points touching and valleys open. A light abrasive cleaning just before brazing, with a clean abrasive cloth or a stainless wire brush kept for the purpose, both removes oxide and leaves a surface that wets well. Abrasives that leave embedded particles or residues, and any cleaning that leaves oil, defeat the purpose.

## Capillary fittings

Standard capillary fittings for copper plumbing and refrigeration tube are made with sockets sized to give a clearance suitable for soldering or brazing when used with tube of the matching standard. Where a business makes its own sockets and bores, as the manufacturer does in its brass bodies and steel headers, it takes on the job the fitting maker would otherwise do: choosing the bore, its tolerance and its finish for the tube, the filler and the expected temperature. The filler maker's data sheet and the tube standard are the starting points.

## Cooling and residual stress

Expansion matters on cooling too. The filler solidifies at its solidus temperature, hundreds of degrees above room temperature, and from then on the joint is locked. As it cools further, the two parts try to contract by different amounts, and the difference must be absorbed by the filler and the parts as strain. For tube joints between copper and steel, the strains are small and the ductile filler absorbs them. For flat joints between metals with very different coefficients, such as carbide and steel, the mismatch can be large enough to crack the carbide, which is the subject of Chapter 9.

## Expansion in large assemblies

Large brazed assemblies add a further effect: different parts of the assembly reach temperature at different times. A long steel header heated from one end grows at the hot end first, and a row of copper tubes brazed in sequence along it sees the header's length changing as each joint is made. Heating the whole header evenly, in a furnace or with several torches, keeps the dimensions consistent; brazing joint by joint along a cold header can leave the last joints under stress as the first ones cool. The manufacturer's batch-brazed headers are preheated along their full length before the branch joints are made, for this reason.

## Soldering clearances

Soldering works at much lower temperatures, so the changes in clearance are smaller. This is an illustration. For a 22 mm copper tube in a brass fitting heated from 20 °C to about 250 °C for soft soldering, the radial gap changes by about 22 × (19.5 − 17) × 10⁻⁶ × 230 ÷ 2 ≈ **0.006 mm**, negligible beside the clearance. For soldering, it is the room-temperature fit that counts, and standard capillary fittings are designed accordingly.

## A failure: holes drilled for the wrong temperature

This is an illustration. The manufacturer's second leak return was a steel header with copper branches, from a batch in which several joints had leaked on the pressure test and been rebrazed. The header holes had been drilled to 22.1 mm for 22 mm tube, a radial clearance of about 0.05 mm, on the reasoning that 0.05 mm was the bottom of the filler maker's range.

At brazing temperature, the copper tubes had grown into the steel holes, closing the gap to about 0.01 mm. The flux could not get in to clean the surfaces, the filler would not run, and the brazers had compensated by heating longer and feeding more filler at the mouth of each joint, forming good-looking fillets over joints that were largely empty inside. Changing the drill to a reamed 22.28 mm bore, as calculated in this chapter, brought the hot clearance back into the band, and the next batch passed its pressure test with no rebrazing.

## Exercise: a steel tube in a brass body

The manufacturer plans a new product with a 15 mm carbon steel tube brazed into a brass body at about 700 °C. Aiming for a radial clearance of 0.08 mm at brazing temperature, calculate the change in clearance on heating from 20 °C and the room-temperature bore for a 15.00 mm tube.

The change is Δc = 15 × (19.5 − 12) × 10⁻⁶ × 680 ÷ 2 ≈ 15 × 7.5 × 10⁻⁶ × 340 ≈ **+0.038 mm**: the gap opens, because the brass body grows more than the steel tube.

To reach 0.08 mm when hot, the room-temperature radial clearance should be about 0.08 − 0.038 ≈ **0.042 mm**, a bore of about 15 + 2 × 0.042 ≈ **15.08 mm**. That is a close fit at room temperature, almost a push fit, and the brazer may find it difficult to assemble parts with any burrs or out-of-roundness; the bore must be reamed, deburred and checked. The case is the reverse of the copper tube in the steel header: there, a joint that looked loose on the bench was right when hot; here, a joint that looks tight on the bench opens to the right gap at temperature.
