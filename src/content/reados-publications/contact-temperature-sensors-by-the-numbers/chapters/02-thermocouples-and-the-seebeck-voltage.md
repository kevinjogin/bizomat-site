---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: thermocouples-and-the-seebeck-voltage
order: 2
title: "Thermocouples and where their voltage is made"
description: "The Seebeck effect, why a thermocouple's voltage is made along the wire and not at the tip, the NIST type K function, microvolt signals, and a junction that moved."
draft: false
---

A thermocouple is two wires of different alloys joined at one end. Heat the joined end, and a small voltage appears between the free ends, about 40 microvolts for each kelvin of difference in a type K couple. It needs no power supply, it can be made almost any size, and it survives temperatures that would destroy any other contact sensor. It is the most common temperature sensor in industry, and the most commonly misunderstood.

The common misunderstanding is that the voltage is made at the junction. It is not. It is made along the wires, wherever they pass through a temperature gradient, and the junction is only where the two wires meet. This chapter explains why, because nearly every thermocouple error in the next chapter follows from it. It then sets out how a voltage is turned into a temperature with the NIST reference functions, how small the signals are, how the common types differ, and how a damaged lead moved CV-180's measuring junction without anyone noticing at first.

## The Seebeck effect

In a metal, the conduction electrons behave like a gas that fills the metal. When one end of a wire is hotter than the other, the electrons at the hot end have a wider spread of energies, and there is a net drift of charge along the wire until an electric field builds up that balances it. The result is a voltage along any wire that has a temperature difference along its length. The size of that voltage per kelvin, the **Seebeck coefficient**, depends on the metal's electronic structure, which is why it differs from one alloy to another.

The voltage along a single wire cannot be measured on its own, because connecting a meter means adding wires that pass through the same temperature difference. What can be measured is the difference between two different wires that run side by side from the same hot place to the same cold place. If wire A develops 30 µV/K and wire B develops −10 µV/K, the pair develops 40 µV/K between their cold ends. That pair is a thermocouple, and the difference of the two Seebeck coefficients is the thermocouple's sensitivity.

Writing this as an equation makes the location of the voltage plain. Each small length of wire contributes its Seebeck coefficient times the temperature change across that length. Adding up all the lengths from the junction to the cold ends gives the thermocouple voltage. Where the temperature is uniform, a length contributes nothing, however long it is. Where the temperature changes steeply, a short length contributes most of the signal.

### Three practical laws

Three rules follow, and every thermocouple installation relies on them.

1. **Homogeneous wires depend only on their end temperatures.** If each wire's composition is the same all along it, the total voltage depends only on the temperature at the junction and at the cold ends, not on the temperatures along the route. A thermocouple can pass through hotter or colder places on the way and still read correctly, provided the wire is uniform.
2. **A third metal at a uniform temperature adds nothing.** A copper terminal, a solder joint or a brass connector inserted into the circuit adds no voltage if both of its ends are at the same temperature. This is what allows a thermocouple to be connected to an instrument at all.
3. **Voltages add across intermediate temperatures.** The voltage between 180 °C and 25 °C equals the voltage between 180 °C and 110 °C plus the voltage between 110 °C and 25 °C. This is how a reading is corrected for a cold junction that is not at 0 °C.

The first law carries a condition that is easy to forget. If a wire is not uniform, for instance because one length has been heated, worked or contaminated in service, the voltage depends on where that length sits in the temperature gradient. Moving the thermocouple deeper or shallower then changes the reading even though the junction's temperature has not changed. That is the main mechanism of thermocouple drift, and it is why the gradient region of a thermocouple deserves as much attention as its tip.

## Where CV-180's signal is made

This is an illustration. One of CV-180's trailing thermocouples is clipped to a base plate that has reached 180 °C. Its leads run through 200 °C oven air for about 2 m, pass under the door seal, and run 1 m through the 25 °C workshop to the logger. The figure follows the leads and shows where the signal comes from.

```figure
type: svg
title: Where a trailing thermocouple's voltage is made
alt: A diagram of a thermocouple running left to right. On the left, inside the oven, the junction sits on a part at 180 degrees. The leads run through oven air at 200 degrees, then pass through the door seal where the temperature falls steeply from 200 to 25 degrees, then run through the workshop at 25 degrees to the logger terminals on the right. Labels show 0.798 millivolts made between the part and the oven air, and 7.138 millivolts in the opposite sense made across the door seal, leaving 6.340 millivolts at the terminals.
caption: This is an illustration. Most of the signal is made where the leads cross the door seal, not at the junction. The net 6.340 mV depends only on the end temperatures, provided the wire is uniform.
viewbox: 0 0 640 280
body:
<rect class="bx" x="20" y="40" width="360" height="190" rx="6"/>
<text class="txb" x="32" y="64">Oven air 200 °C</text>
<rect class="bxa" x="40" y="150" width="70" height="40" rx="3"/>
<text class="tx txs" x="44" y="210">plate 180 °C</text>
<circle class="fa" cx="108" cy="150" r="5"/>
<path class="la draw" pathLength="1" d="M108 150C160 120 260 120 380 132H420C470 132 500 140 530 140"/>
<path class="li" d="M108 150C160 128 260 128 380 140H420C470 140 500 148 530 148"/>
<rect class="fs" x="380" y="40" width="40" height="190"/>
<text class="tx txs" x="372" y="252">door seal</text>
<text class="tx txs" x="372" y="266">200 → 25 °C</text>
<rect class="bxi" x="530" y="110" width="90" height="70" rx="4"/>
<text class="txb" x="542" y="138">Logger</text>
<text class="tx txs" x="542" y="160">terminals 25 °C</text>
<text class="tx txs" x="120" y="104">0.798 mV made from 180 to 200 °C</text>
<text class="txa" x="300" y="88">7.138 mV made across the seal</text>
<path class="ln dsh" d="M400 94V126"/>
<text class="txa" x="452" y="216">net 6.340 mV</text>
<text class="tx txs" x="440" y="100">workshop 25 °C</text>
```

The two contributions have opposite senses: between the plate and the oven air the leads get hotter, and across the door seal they get colder. Using the type K reference function, the leads make 0.798 mV between 180 °C and 200 °C, and 7.138 mV between 200 °C and 25 °C, so the net signal at the terminals is 7.138 − 0.798 = **6.340 mV**, which is exactly the voltage between 180 °C and 25 °C. The route through hotter air has made no difference, as the first law says it should. But almost all of the voltage came from the 40 mm or so of wire under the door seal, where the temperature fell by 175 K. If that length of wire were damaged or altered, the error would appear there, a long way from the part.

## From voltage to temperature

Thermocouple voltages are tabulated against temperature with the reference junction at 0 °C. The tables are generated from **reference functions**: polynomials in temperature, fitted to measurements and published for each standard type. NIST's ITS-90 thermocouple database gives them, with inverse functions for converting voltage to temperature. For type K above 0 °C, the reference function is a ninth-order polynomial with an extra exponential term that describes a small bump in the alloy's behaviour.

```figure
type: formula
title: The type K reference function above 0 °C
formula: E = c₀ + c₁t + c₂t² + … + c₉t⁹ + a₀·exp(a₁(t − a₂)²)
caption: Coefficients from the NIST ITS-90 thermocouple database. Every type K voltage in this book was computed from the function and checked against NIST's published table.
- E | thermocouple voltage with the reference junction at 0 °C, mV
- t | junction temperature, °C
- c₀ … c₉ | polynomial coefficients for 0 to 1,372 °C
- a₀, a₁, a₂ | 0.1185976, −1.183432 × 10⁻⁴ and 126.9686 °C for the exponential term
step: E(25 °C) = 1.000 mV; E(180 °C) = 7.340 mV; E(200 °C) = 8.138 mV; E(230 °C) = 9.343 mV
step: Sensitivity near 180 °C: (E(180.5) − E(179.5)) ÷ 1 K = 39.9 µV/K
```

An instrument reading a thermocouple does three things. It measures the voltage at its terminals; it measures the temperature of those terminals with a separate sensor and converts that to an equivalent voltage from the reference function; and it adds the two and converts the sum back to a temperature with the inverse function. For CV-180's plate, the terminals are at 25 °C, so the instrument measures 6.340 mV, adds E(25 °C) = 1.000 mV to get 7.340 mV, and the inverse function returns **180.0 °C**.

If the instrument skipped the second step and treated the terminals as being at 0 °C, it would convert 6.340 mV directly and report **155.0 °C**, about 25 K low. That missing correction, **cold-junction compensation**, is the subject of the next chapter.

## Signals measured in microvolts

At about 40 µV/K, a tenth of a kelvin is 4 µV. That is a small signal to carry through an oven full of switching heaters and a long lead, and it sets several requirements on the measuring instrument.

```figure
type: stats
title: The size of a type K signal in CV-180
caption: This is an illustration. Resolution figures assume a 16-bit converter spanning ±78 mV; real instruments state their own.
- 6.340 mV | signal from a 180 °C plate with 25 °C terminals
- 39.9 µV/K | type K sensitivity near 180 °C
- 4 µV | signal change for 0.1 K
- 2.38 µV | one step of a 16-bit converter over ±78 mV, about 0.06 K
```

The converter's resolution is the smallest problem. Interference is the larger one. CV-180's elements are switched by solid-state relays at mains frequency, and its trailing leads run close to them. A few millivolts of 50 Hz interference coupled onto a pair of thermocouple wires would swamp the signal if it were not rejected. Good instruments do three things about it: they measure the two wires differentially, so that interference that appears equally on both cancels; they integrate each reading over a whole number of mains cycles, 20 ms or a multiple of it, so that the 50 Hz component averages to zero; and they filter the input. The leads help by being twisted together, so that both wires pick up the same interference, and by being kept away from heater cables where possible. [Averaging and the square-root rule](/reados/publications/random-error-and-drift-by-the-numbers/averaging-and-the-square-root-rule/) in *Random Error and Drift by the Numbers* discusses how averaging treats different kinds of noise.

### Junction styles

The junction itself can be made in three ways, and the choice affects interference, response time and durability.

- **Exposed junction.** The bare welded bead is in direct contact with the air or surface. It responds fastest and is used for trailing thermocouples and air measurements, but it is fragile and is electrically connected to whatever it touches.
- **Grounded junction.** The junction is welded to the tip of a protective metal sheath, usually in mineral-insulated cable. It responds reasonably quickly and is robust, but it connects the thermocouple electrically to the sheath and so to the equipment's earth, which can create earth loops with an instrument that is also earthed.
- **Insulated junction.** The junction sits inside the sheath, insulated from it by compacted mineral powder. It is slower, but electrically isolated, which suits CV-180's limit thermocouple sharing an earthed oven with switched heaters.

### Making and joining thermocouple wire

Because the voltage comes from the wires and not the joint, a junction only has to make reliable electrical contact; it does not need any particular shape. A small welded bead is the usual choice because it is compact, strong and stays in contact at temperature. A twisted junction works at first but can loosen and oxidise, and a junction soldered with ordinary solder fails once the solder melts. A junction that has been remade several times, or a wire that has been joined to repair a break, is still a thermocouple, but only if the repair is made with wire of the same type and the joint is not in a steep gradient, where any difference in composition at the joint would add a voltage of its own.

The same reasoning sets the rules for connectors. A thermocouple connector has pins made of the thermocouple alloys, so that each pin continues its own wire, and it is colour-coded so the alloys cannot easily be crossed. A plain copper connector also works, by the second law, as long as both of its pins are at the same temperature, which is hard to guarantee near an oven door. CV-180's trailing thermocouples therefore use type K connectors, and the logger's own terminals sit in an isothermal block whose temperature is measured, as the next chapter explains. A record of each thermocouple's loop resistance when it is new costs a minute and gives a reference against which any later break, short or poor joint shows up immediately.

## Choosing a thermocouple type

The letter types are defined by their alloys and reference functions. The choice among them depends on temperature range, environment, sensitivity and cost.

```figure
type: compare
title: Common thermocouple types for a cure oven and its neighbours
cols: Alloys | Suits | Watch for
caption: General characteristics only. The reference functions and tolerances for each type are in the NIST database and the makers' summaries of IEC 60584.
- *Type K | nickel-chromium against nickel-aluminium | general use to about 1,200 °C in air; the default for CV-180 | drift from structural changes when cycled through roughly 250 to 550 °C; magnetic leg
- Type N | nickel-chromium-silicon against nickel-silicon | similar range to K with better stability at high temperature | slightly lower sensitivity; less common in cheap instruments
- Type J | iron against copper-nickel | lower temperatures in reducing atmospheres | the iron leg rusts; not for oxidising heat above a few hundred degrees
- Type T | copper against copper-nickel | below zero and up to a few hundred degrees; good accuracy | the copper leg conducts heat well, which matters for immersion
- Types R and S | platinum-rhodium against platinum | high temperatures with good stability | much smaller signal; expensive; easily contaminated
```

CV-180 runs at 200 °C in clean air, well inside type K's range and below the band where its drift is most marked. Type K also suits a business that already owns type K loggers and probes, and its connectors and extension cable are widely available. Type T would give slightly better accuracy at these temperatures, but would require a second set of instruments and cable; the business keeps to one type, which removes one source of mistakes.

## The error: a junction that moved

This is an illustration. During a profile run on a load of heavy frames, five of the six trailing thermocouples rose steadily in the usual way. The sixth, clipped to a base plate, rose with the others for the first ten minutes, then levelled off at about **110 °C** and stayed there for the rest of the run, while the base plate on the next frame went on climbing to 180 °C.

A cold plate was the first suspicion, and the operator nearly added time to the cycle because of it. The technician who reviewed the trace noticed that a real plate cannot stop heating at 110 °C in 200 °C air: the lumped model says its rate of rise falls steadily but never stops while the air is hotter. A trace that goes flat while the oven is hot means the junction is no longer seeing the plate.

When the thermocouple was examined, its glass-fibre insulation had worn through where it passed under the door seal, and the two bare wires were touching there, about 1 m from the tip. A thermocouple's measuring junction is wherever the two wires first touch, so the instrument was now reading the temperature at the door seal, about 110 °C in that position, not the plate. The loop resistance confirmed it: measured from the logger end, it had fallen to about a third of its recorded value, as it would if the circuit were now 1 m long instead of 3 m.

The thermocouple was replaced and the run repeated. The business added three checks to its profiling routine: inspect leads under the door seal before each run, measure and record each thermocouple's loop resistance when it is new and before each use, and treat a flat trace in a hot oven as a sensor fault until it is proved otherwise.

## Exercise: the signal at the limit

CV-180's limit thermocouple is set to trip at 230 °C. Its leads run out through the oven wall to a limit controller whose terminals are at 35 °C inside the control cabinet. What voltage appears at the controller's terminals when the oven air reaches 230 °C, and what would the controller display if it applied no cold-junction compensation?

**Worked answer.** From the type K reference function, E(230 °C) = 9.343 mV and E(35 °C) is about 1.407 mV, so the terminal voltage is 9.343 − 1.407 = **7.936 mV**. With correct compensation, the controller adds 1.407 mV back and reads 230 °C. Without it, it would convert 7.936 mV directly, which the inverse function gives as about **195 °C**, and the oven would run some 35 K above its intended limit before the trip operated. The limit controller compensates automatically, but the calculation shows how much rests on its compensation sensor, which is why Chapter 3 checks it.
