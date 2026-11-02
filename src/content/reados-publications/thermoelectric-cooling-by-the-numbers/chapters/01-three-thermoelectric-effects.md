---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: three-thermoelectric-effects
order: 1
title: "Three thermoelectric effects"
description: "How electrons carry heat as well as charge, the Seebeck voltage, Peltier heat at a junction and the Thomson effect, how they are related, and the heat balance at a cooler's cold junction."
draft: false
---

A thermocouple and a thermoelectric cooler are the same device used in opposite directions. Heat one junction of two different conductors and a small voltage appears: that is how a thermocouple measures temperature. Drive a current through the same junction and it absorbs or gives out heat: that is how a cooler pumps it. Both effects come from one fact about conductors. The particles that carry electric charge also carry heat, and they carry different amounts of it in different materials.

This chapter explains the three thermoelectric effects from that fact, shows how they are tied together, works out the heat balance at a cooler's cold junction, and finishes with a module mounted upside down in the pump station's sample box, found with nothing more than a multimeter and a warm hand.

## Carriers carry heat

In a metal or a semiconductor, electric current is carried by mobile charges: electrons, or, in some semiconductors, holes, the gaps left where an electron is missing, which move like positive charges. These carriers are not all moving at the same speed. They have a spread of energies, and the spread depends on temperature. When carriers drift through the material as a current, each carries its energy with it, so a current of charge is also a current of energy.

Where the material is warmer, its carriers are more energetic and, in most materials, more numerous at the energies that matter for conduction. Put one end of a bar in a flame and the carriers at the hot end diffuse towards the cold end faster than cold carriers diffuse back. Charge accumulates at the cold end until the electric field it creates holds back any further net flow. The result is a voltage between the two ends, proportional to the temperature difference. That is the Seebeck effect, and the voltage per kelvin is the material's Seebeck coefficient.

```figure
type: formula
title: The three thermoelectric effects and how they are related
formula: Seebeck: open-circuit voltage V = S_AB × (T_hot − T_cold)
formula: Peltier: heat absorbed or released at a junction Q = Π_AB × I
formula: Thomson: heat per unit length in a conductor carrying current along a temperature gradient = τ × I × dT/dx
formula: Kelvin relations: Π_AB = S_AB × T      τ = T × dS/dT
caption: S_AB is the difference between the Seebeck coefficients of the two materials, Π_AB the Peltier coefficient of their junction and τ the Thomson coefficient. T is the absolute temperature of the junction, in kelvin.
- S | Seebeck coefficient, V/K
- Π | Peltier coefficient, V, or W per ampere
- I | current, A
- T | absolute temperature, K
```

The sign of the Seebeck coefficient follows the sign of the carriers. In a material where electrons carry the current, the cold end becomes negative, and the coefficient is negative; where holes carry it, the cold end becomes positive. Semiconductors are made one way or the other by doping: n-type with mobile electrons, p-type with mobile holes. That difference in sign is what a cooler exploits.

### Only differences can be measured

A voltmeter connected across a heated bar uses leads that also have a temperature difference along them, and they generate their own Seebeck voltage. What the meter reads is the difference between the bar's and the leads' effects. That is why a thermocouple is always two materials joined at the measuring junction: its voltage depends on the difference of the two Seebeck coefficients and on the temperature difference between the measuring junction and the reference junction where the wires meet the instrument. A copper–constantan thermocouple produces about 40 µV per kelvin near room temperature, about 1.2 mV for a 30 K difference.

## The Peltier effect

Now drive a current through a junction of two materials. On each side of the junction the carriers flowing through carry an amount of heat per unit charge that depends on the material, and that amount is the material's Peltier coefficient. If the carriers arriving at the junction carry less heat per unit charge than they must carry away on the other side, they make up the difference by absorbing heat from the junction's surroundings, and the junction cools. Reverse the current and the junction warms.

Lord Kelvin showed, and later theory confirmed, that the Peltier coefficient of a junction is its Seebeck coefficient multiplied by the absolute temperature. The two effects are one property of the materials seen from two sides: the Seebeck coefficient says how much voltage a temperature difference produces; the Peltier coefficient says how much heat a current carries. A material with a large Seebeck coefficient is therefore also a good heat pump per ampere.

### The n–p couple

A practical cooler joins a leg of p-type and a leg of n-type semiconductor at one end with a copper strip, the cold junction, and connects their other ends to copper strips at the hot side. Current flows down the n-type leg and up the p-type leg, or the reverse. In the n-type leg the electrons move against the current; in the p-type leg the holes move with it. Arrange the current so that in both legs the carriers move from the cold strip to the hot ones, and both legs carry heat away from the cold junction. Each leg's Seebeck coefficient is about 200 µV/K in magnitude, with opposite signs, so the couple's coefficient is the sum of the magnitudes, about 400 µV/K.

```figure
type: svg
title: One n–p couple pumping heat from the cold plate to the hot plate
alt: A cross-section of one thermoelectric couple. Two vertical semiconductor legs, labelled n and p, stand between a top ceramic plate marked cold side and a bottom ceramic plate marked hot side. A copper strip joins the tops of the legs; separate copper strips are at their bottoms. Arrows show current entering the n leg at the bottom left, flowing up and over and down the p leg, while carriers in both legs move downward, carrying heat from the cold plate to the hot plate.
caption: This is an illustration. Electrons in the n leg move against the current and holes in the p leg move with it, so in both legs the carriers, and the heat they carry, move from the cold junction to the hot side. Reversing the current reverses the heat flow.
viewbox: 0 0 640 300
body:
<rect class="bxi" x="140" y="30" width="360" height="22" rx="3"/>
<text class="txb" x="270" y="47">cold side ceramic</text>
<rect class="bx" x="180" y="52" width="280" height="12"/>
<rect class="bxa" x="190" y="64" width="80" height="140"/>
<text class="txa" x="222" y="140">n</text>
<rect class="bxa" x="370" y="64" width="80" height="140"/>
<text class="txa" x="402" y="140">p</text>
<rect class="bx" x="160" y="204" width="130" height="12"/>
<rect class="bx" x="350" y="204" width="130" height="12"/>
<rect class="bxi" x="140" y="216" width="360" height="22" rx="3"/>
<text class="txb" x="275" y="233">hot side ceramic</text>
<path class="li" d="M100 210 L160 210"/>
<path class="ah" d="M152 204 L162 210 L152 216 Z"/>
<text class="tx txs" x="50" y="200">current in</text>
<path class="li" d="M480 210 L540 210"/>
<path class="ah" d="M532 204 L542 210 L532 216 Z"/>
<text class="tx txs" x="510" y="200">current out</text>
<path class="la flow" d="M230 80 L230 190"/>
<path class="la flow" d="M410 80 L410 190"/>
<text class="tx txs" x="282" y="110">heat carried</text>
<text class="tx txs" x="282" y="128">downwards in</text>
<text class="tx txs" x="282" y="146">both legs</text>
<text class="tx txs" x="200" y="280">heat absorbed at the top, rejected at the bottom</text>
```

A module repeats the couple many times, electrically in series and thermally in parallel, between two thin ceramic plates that insulate the copper strips electrically while conducting heat. The trust's modules have 127 couples on a 40 mm square. Their datasheet ratings, which Chapter 3 decodes, imply a module Seebeck coefficient of 51.3 mV/K, which divided by 127 gives 404 µV/K per couple, exactly the figure the materials suggest.

## The Thomson effect

The third effect appears in a single material. If the Seebeck coefficient changes with temperature, as it does in every real material, then a current flowing along a conductor with a temperature gradient absorbs or releases heat along its length, not just at junctions. That is the Thomson effect, and its coefficient is the absolute temperature multiplied by the rate of change of the Seebeck coefficient with temperature.

In a cooler's legs, the Thomson heat is small compared with the Peltier heat at the junctions and the Joule heating, and the standard engineering model of a module ignores it, using a single Seebeck coefficient for the whole module. That model, fitted to the module's datasheet as Chapter 3 shows, absorbs the Thomson effect and the variation of the materials' properties with temperature into its fitted constants. It is accurate enough for design within the range of temperatures the module was rated for, and less accurate far outside it.

## The heat balance at the cold junction

A real couple is not a perfect heat pump. Three heat flows meet at its cold junction.

```figure
type: formula
title: Net heat pumped from the cold side of a module
formula: Q_c = S I T_c − ½ I² R − K (T_h − T_c)
formula: Electrical power: P = S I (T_h − T_c) + I² R      Heat rejected: Q_h = Q_c + P
caption: S, R and K are the module's Seebeck coefficient, electrical resistance and thermal conductance; T_c and T_h are the cold and hot side temperatures in kelvin. Half the Joule heat is taken to reach each side.
- Q_c | heat pumped from the cold side, W
- S I T_c | Peltier heat absorbed at the cold junctions
- ½ I² R | half the Joule heat, which flows back to the cold side
- K (T_h − T_c) | heat conducted back from hot to cold through the legs
```

The Peltier term grows in proportion to the current; the Joule term grows with its square. At low current the Peltier term wins and the net cooling rises with current; at high current Joule heating catches up, and beyond a certain current more current gives less cooling. The conduction term does not depend on the current at all: it is the heat that leaks back through the legs because the hot side is hotter than the cold, and it grows with the temperature difference the module is asked to hold.

For one of the trust's modules with both faces at 27 °C, 300.15 K, and a current of 3.0 A, the Peltier heat is 0.0513 × 3.0 × 300.15 = 46.2 W. The Joule heat is 3.0² × 1.985 = 17.9 W, half of which, 8.9 W, flows to the cold side. With no temperature difference there is no conduction, and the net heat pumped is 37.3 W. Ask the same module to hold its cold face 30 K below its hot face, at 10 °C against 40 °C, and conduction takes 0.5255 × 30 = 15.8 W, the Peltier term falls slightly because T_c is lower, and the net falls to 18.9 W, about half.

```figure
type: bars
title: Where the Peltier heat goes at 3.0 A, cold face 10 °C and hot face 40 °C
unit: W
max: 45
caption: This is an illustration for one of the trust's modules: S = 51.3 mV/K, R = 1.985 Ω, K = 0.5255 W/K. Peltier heat S I T_c = 0.0513 × 3.0 × 283.15 = 43.6 W.
- Peltier heat absorbed at the cold junctions | 43.6
- Half the Joule heat returned to the cold side | 8.9
- Conduction back from the hot side, 30 K | 15.8
- * Net heat pumped from the cold side | 18.9
```

The figure explains the whole character of thermoelectric cooling. Less than half the Peltier heat is useful when the module holds a 30 K difference; the rest is cancelled by losses that grow with current and with temperature difference. The electrical power to drive it, 22.5 W at this operating point, is all rejected at the hot side along with the heat pumped, 41.4 W in total. Chapters 3 to 5 turn those three terms into a design.

## Where thermoelectric cooling earns its place

The heat balance already shows the trade a designer makes. A thermoelectric module gives up efficiency in return for qualities a compressor cannot match, and the jobs it suits are those where those qualities matter more than the electricity.

It is solid-state and sealed. With no refrigerant circuit, there is nothing to leak, no oil to migrate, no service ports and no refrigerant handling licence needed for maintenance; the only moving parts are fans. It works in any orientation and survives vibration, which suits vehicles, portable equipment and wall-mounted cabinets. It is small and light for small loads: a few tens of watts of cooling from a package the size of a book. It controls temperature precisely, because heat pumped follows current smoothly, so a controller can hold a laser diode or a sample to a fraction of a kelvin. And it reverses: the same module heats when the current is reversed, which lets one device hold a cabinet above its dew point on a winter night and below its limit on a summer afternoon.

Against those qualities stand its limits. The coefficient of performance is low, typically below one at the temperature differences of cabinet cooling, so the hot side rejects more than twice the heat removed and the running cost is high. The temperature difference a module can hold is limited, about 68 K for the trust's modules with no load at all, and much less with a useful load. And the capacity is modest: beyond a few hundred watts, a compressor is smaller, cheaper to run and usually cheaper to buy. The trust's two jobs, a sealed 45 W cabinet in a dusty place and a tiny 4 °C sample box, sit on the thermoelectric side of that line. Chapter 10 checks that judgement with numbers.

## The mistake: a module mounted upside down

SC-1's module failed after four years and was replaced by a maintenance electrician who had not worked on the sample box before. The new module looked identical on both faces. After reassembly the sample box's temperature alarm tripped within an hour: the box was at 18 °C and rising, and its cold-side exchanger was warm to the touch.

```figure
type: steps
title: Finding the inverted module with a Seebeck test
caption: This is an illustration. A module's own Seebeck voltage identifies its faces: warm one face by a few kelvin and the polarity of the open-circuit voltage shows which face is which.
- Symptom | sample box at 18 °C and rising; cold-side exchanger warm, hot-side sink cooler than usual
- Supply checked | correct polarity at the module's leads, red lead positive, current 3.0 A
- Module removed and disconnected; multimeter on its leads | one face warmed by hand, about 5 K above the other
- * Open-circuit voltage | about 0.26 V with the red lead negative: the module had been mounted with its faces reversed
- Remounted with the marked cold face against the box | sample box back at 4 °C within 40 minutes
- Procedure changed | mark the cold face before removal; check orientation with the Seebeck test before reassembly
```

The supply was correct, so the module itself had to be inverted. A module's leads and faces have a fixed relationship: with the red lead positive, one face cools and the other heats, and makers mark the faces or state which face is cold with the leads towards the viewer. The new module's label had been lost under thermal grease. Disconnected and warmed by hand on one face, the module itself said which face was which: a 5 K difference produced 0.0513 × 5 = 0.26 V across its leads, and the polarity showed that the face mounted against the sample box was the hot face. Remounted the right way up, the box was back at 4 °C within 40 minutes. The test takes a minute and needs no data beyond the fact that a thermoelectric module is also a thermocouple.

## Exercise: the sample box module at its design point

SC-1's module runs at 3.0 A with its cold face at 1 °C and its hot face at 45 °C. Using the module constants S = 51.31 mV/K, R = 1.985 Ω and K = 0.5255 W/K, calculate the Peltier heat at the cold junctions, half the Joule heat, the heat conducted back, the net heat pumped, the electrical power and the coefficient of performance. Then explain why the COP is so much lower than for the cabinet cooler.

### Answer

**Given:** I = 3.0 A; T_c = 1 °C = 274.15 K; T_h = 45 °C = 318.15 K; S = 0.05131 V/K; R = 1.985 Ω; K = 0.5255 W/K.

**Assumptions:** the ideal module model; constant S, R and K; no contact or heat exchanger resistances inside the faces.

**Method:** the heat balance at the cold junction, the power equation, then COP = Q_c ÷ P.

**Peltier heat:** 0.05131 × 3.0 × 274.15 = 42.2 W.

**Half the Joule heat:** ½ × 3.0² × 1.985 = 8.9 W.

**Conduction:** 0.5255 × (318.15 − 274.15) = 0.5255 × 44 = 23.1 W.

**Net heat pumped:** 42.2 − 8.9 − 23.1 = 10.1 W.

**Electrical power:** 0.05131 × 3.0 × 44 + 3.0² × 1.985 = 6.8 + 17.9 = 24.6 W.

**COP:** 10.1 ÷ 24.6 = 0.41.

**Interpretation:** at a 44 K difference, conduction alone takes more than half the Peltier heat, so the module pumps only 10 W while consuming 25 W, and the hot side must reject 35 W. The cabinet cooler, working across a smaller difference at its modules, keeps far more of its Peltier heat, which is why Chapter 3 finds its COP about twice as high. Every kelvin of temperature difference a module must hold costs pumping capacity; Chapter 5 shows that much of that difference is added by the heat sinks, not by the job.

**Verification:** the heat rejected must equal the heat pumped plus the power, 10.1 + 24.6 = 34.7 W, and the thermoelectric cooler check tool, given these temperatures, the current and the datasheet ratings of Chapter 3, gives the same heat pumped, voltage of 8.21 V and COP of 0.41.
