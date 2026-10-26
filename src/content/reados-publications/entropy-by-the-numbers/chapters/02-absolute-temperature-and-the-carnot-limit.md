---
book: entropy-by-the-numbers
chapterSlug: absolute-temperature-and-the-carnot-limit
order: 2
title: "Absolute temperature and the Carnot limit"
description: "The kelvin, the reversible engine and the limit it sets: why no heat engine can beat 1 − Tc/Th, why temperatures must be absolute, and how to reject a heat-to-power claim in five minutes."
draft: false
---

In 1824 Sadi Carnot asked how much work a heat engine could produce, and answered without knowing what heat was. His insight was that an ideal engine is one in which nothing happens suddenly: heat enters only when the engine is at the temperature of the source, leaves only when it is at the temperature of the sink, and every step can be run backwards. Such an engine, he argued, is the best possible, and its output depends only on the two temperatures. The argument survived the overthrow of the caloric theory on which he built it, and it gave physics an absolute scale of temperature and engineering its most useful limit.

This chapter sets out that limit and the temperature scale it depends on. It applies the limit to the running case's warm effluent and steam, explains why every calculation must use kelvin, and ends with a heat-to-power proposal that promised more than the second law allows.

## The second law in two statements

The second law is usually stated in one of two forms, named after the physicists who first put them into words. Both are statements about what never happens.

- **Clausius:** no device working in a cycle can transfer heat from a colder body to a hotter one with no other effect. Heat flows uphill only if something, usually work, makes it.
- **Kelvin:** no device working in a cycle can take heat from a single source and convert it entirely into work. Some heat must always be rejected to a colder sink.

The two are equivalent. A machine that broke one could be combined with an ordinary engine or refrigerator to break the other, so either can be taken as the law. Neither is derived from anything more basic. They are summaries of experience that no experiment has ever contradicted, which is the strongest kind of foundation physics has.

## The reversible engine

A heat engine takes heat Q_h from a hot source at temperature T_h, delivers work W and rejects heat Q_c to a cold sink at T_c. Over a complete cycle the engine returns to its starting state, so by the first law W = Q_h − Q_c, and its thermal efficiency is W ÷ Q_h.

A **reversible** engine is one whose every step could be run in the opposite direction by an infinitesimal change in conditions. Heat passes only across vanishingly small temperature differences, there is no friction and nothing mixes. Run backwards, the same machine becomes a refrigerator or heat pump, taking in work and moving heat from the cold body to the hot one.

The argument that no engine can beat a reversible one runs like this. Suppose a better engine existed between the same two temperatures. Use its work to drive the reversible engine backwards as a heat pump. The pair together would then take heat from the cold sink and deliver it to the hot source with no work supplied from outside, which the Clausius statement forbids. So no engine can be more efficient than a reversible one, and by the same argument all reversible engines between the same two temperatures have the same efficiency, whatever they are made of.

## The absolute temperature scale

Because the reversible efficiency depends only on the two temperatures, the ratio of heat rejected to heat taken in, Q_c ÷ Q_h, depends only on them too. Kelvin saw that this ratio could define temperature without reference to any substance: the thermodynamic temperatures of two bodies are in the ratio of the heats a reversible engine exchanges with them. That is the absolute, or thermodynamic, scale.

Its size was originally fixed by assigning 273.16 K to the triple point of water. Since 2019, the SI defines the kelvin instead by fixing the numerical value of the Boltzmann constant at exactly 1.380 649 × 10⁻²³ J/K, as set out in the 9th edition of the SI Brochure. The size of the kelvin did not change. For engineering, the essentials are the same as they always were:

- Absolute zero is 0 K, and no temperature is lower.
- A temperature in kelvin is the Celsius temperature plus 273.15.
- A temperature difference of 1 K equals a difference of 1 °C, but a temperature ratio is meaningful only in kelvin.

The last point is the source of more second-law errors than anything else. A water heater that raises water from 20 °C to 60 °C has not made it "three times as hot": on the absolute scale it has gone from 293.15 K to 333.15 K, a rise of under 14%. Any formula in this book that divides one temperature by another, or takes a logarithm of a temperature, needs kelvin. Formulas that only subtract temperatures, such as Q = m c ΔT, work in either.

## The Carnot limit

With temperatures on the absolute scale, a reversible engine satisfies Q_c ÷ Q_h = T_c ÷ T_h, and its efficiency, the **Carnot efficiency**, follows directly.

```figure
type: formula
title: The Carnot limit on any heat engine
formula: η_max = W ÷ Q_h = 1 − T_c ÷ T_h
caption: Temperatures in kelvin. The limit applies to every engine, whatever its working fluid or design, when heat is taken in at T_h and rejected at T_c. Real engines fall well short of it.
- η_max | the highest possible thermal efficiency
- T_h | absolute temperature at which heat is supplied, K
- T_c | absolute temperature at which heat is rejected, K
step: Source 180 °C, sink 20 °C: 1 − 293.15 ÷ 453.15 = 35.3%
step: Same source, sink 30 °C: 1 − 303.15 ÷ 453.15 = 33.1%
```

Two features of the formula shape every engineering decision about heat and power. The efficiency rises steeply as the source gets hotter, and it is zero when the source is at the sink's temperature, however much heat there is. A warm stream may carry a great deal of energy and almost no capacity for work.

```figure
type: bars
title: Carnot efficiency for heat supplied at different temperatures, sink at 20 °C
unit: %
max: 100
caption: Calculated from 1 − 293.15 ÷ T_h. The running case's warm effluent and hot water sit at the bottom of the scale; combustion temperatures sit near the top.
- Effluent, 45 °C | 7.86
- Hot water, 60 °C | 12.01
- * Kettle steam, 102.5 °C | 21.97
- Steam, 180 °C | 35.31
- 600 °C | 66.43
- 1,200 °C | 80.10
```

## Temperatures that change

The Carnot formula assumes heat is taken in at one temperature. A real source, such as warm effluent, cools as it gives up heat, so the later heat is taken at a lower temperature than the first. The maximum work from such a stream is less than the Carnot efficiency at its inlet temperature would suggest.

The correct limit is the stream's exergy, which Chapter 7 calculates from its entropy change. For the running case's effluent, 0.50 kg/s of water at 45 °C cooling to the 20 °C surroundings, the heat given up is 0.50 × 4.18 × 25 = 52.25 kW, using a constant specific heat of 4.18 kJ/kg·K, and the exergy is 2.11 kW: **4.0%** of the heat. The Carnot efficiency at the inlet temperature, 7.86%, would overstate the limit by nearly a factor of two, because only the first trickle of heat comes off at 45 °C.

## Why real engines fall short

A real engine cannot take in heat at the source's temperature, because heat flows only across a temperature difference. Its working fluid must be colder than the source while it absorbs heat and hotter than the sink while it rejects it. The engine's own cycle therefore runs between a narrower pair of temperatures than the source and sink, and its limit is lower before any friction or leakage is counted.

The effect is large when the temperatures are close together. For a 180 °C source and a 20 °C sink, an engine whose fluid is 10 K colder than the source and 10 K hotter than the sink has an internal Carnot limit of 1 − 303.15 ÷ 443.15 = 31.6%, against 35.3% for the source and sink themselves. With 20 K at each end it falls to 27.7%. For a 45 °C source and a 20 °C sink, 10 K at each end leaves an internal cycle from 35 °C down to 30 °C, with a limit of only 1.6%. Small temperature differences make for large, expensive heat exchangers; large ones eat the limit. Low-temperature heat is hard to turn into power for both reasons at once.

Real engines also lose work to friction in their turbines or pistons, to pressure drops in their pipework and to heat leaking where it should not. A well-designed large power station recovers a respectable fraction of its Carnot limit. A small machine working from warm water recovers a small fraction of a small limit.

### What the Carnot limit does not cover

The limit applies to engines that turn heat into work. It does not apply to machines that convert one kind of work into another, such as electric motors, generators and transformers, which can approach 100% because their input is already pure exergy. Nor does it apply directly to fuel cells and batteries, which convert chemical exergy into electricity without first making heat. Applying the Carnot formula to them is a category error, and so is assuming that a device which beats the Carnot limit must be one of them. Chapter 3 applies the same limit in reverse, to machines that use work to move heat.

## The Carnot cycle on a temperature–entropy diagram

The reversible engine's cycle is easiest to see on a diagram of temperature against entropy. Chapter 4 shows that in a reversible process the heat transferred is the area under the path on such a diagram. A Carnot cycle, two reversible isothermal steps joined by two reversible adiabatic steps, is a rectangle.

```figure
type: svg
title: A Carnot cycle on a temperature–entropy diagram
alt: A rectangle on axes of entropy (horizontal) and temperature (vertical). The top edge is at T_h and the bottom at T_c. Heat in, Q_h, is the whole area under the top edge down to the entropy axis. Heat out, Q_c, is the area under the bottom edge. The rectangle between them, shaded, is the work.
caption: Heat taken in, Q_h = T_h × ΔS, is the area under the top edge; heat rejected, Q_c = T_c × ΔS, is the area under the bottom edge; the work is the rectangle between. The ratio of the areas is T_c ÷ T_h, which is the Carnot limit.
viewbox: 0 0 440 300
body:
<path class="ln" d="M60 260L60 30M60 260L410 260"/>
<rect class="fs" x="140" y="70" width="200" height="110"/>
<path class="la" d="M140 70L340 70L340 180L140 180Z"/>
<path class="lf" d="M140 180L140 260M340 180L340 260"/>
<path class="cl" d="M60 70L140 70M60 180L140 180"/>
<text class="txs" x="30" y="74">T_h</text>
<text class="txs" x="30" y="184">T_c</text>
<text class="txb" x="215" y="130">W</text>
<text class="txs" x="196" y="222">Q_c (below T_c)</text>
<text class="txs" x="210" y="60">heat in at T_h</text>
<text class="txs" x="190" y="200">heat out at T_c</text>
<text class="txs" x="370" y="278">entropy S</text>
<text class="txs" x="66" y="24">temperature T</text>
```

The diagram makes the limit visual. The work is the gap between two areas whose height ratio is fixed by the temperatures. Widening the rectangle, by taking in more heat, increases the work in proportion; only raising T_h or lowering T_c improves the efficiency.

## The error: a heat-to-power claim from 45 °C effluent

This is an illustration. While reviewing the plant's utilities, the engineer received a proposal for a small heat-to-power unit that would run on the 45 °C effluent and, the proposal said, "convert 12% of the available heat into electricity", or 6.27 kW from 52.25 kW of heat. The unit was offered as a way to turn waste into income.

The check took five minutes. The Carnot efficiency for heat taken in at 45 °C and rejected at 20 °C is 1 − 293.15 ÷ 318.15 = 7.86%, so even a perfect engine supplied with all the heat at 45 °C could deliver only 4.11 kW. Because the effluent cools as it gives up its heat, the true limit is its exergy, 2.11 kW, or 4.0%. The proposal claimed three times what the second law allows. A real machine working with a temperature difference of a few kelvin at each heat exchanger, as any real machine must, would produce a fraction of the limit, perhaps a few hundred watts.

The figure of 12% was traced to a calculation of 1 − T_c ÷ T_h with temperatures in degrees Celsius, which with a 40 °C source and a 35 °C sink would give 1 − 35 ÷ 40 = 12.5%, and with the plant's 45 °C and 20 °C would give 1 − 20 ÷ 45 = 55.6%. Neither means anything. The proposal was declined, and the engineer turned to Chapter 6's question: what is the best use of warm effluent, if not making power? The answer, preheating the incoming wash water, recovers heat at the temperature it is needed, which no power cycle can match.

## How this applies to a small Australian business

Small plants are offered heat-to-power units, waste-heat engines and energy-saving devices of every kind, and the sales literature often states efficiencies with confidence and without temperatures. The Carnot limit is the quickest filter there is. Ask for the temperatures at which heat is supplied and rejected, convert them to kelvin, and calculate 1 − T_c ÷ T_h. Any claim above it is impossible; any claim close to it is implausible, because real heat exchangers need temperature differences to work. Only claims well below it deserve the detailed checking that a business case needs.

The same calculation also tells a plant where its heat is worth something. Warm water and air below about 60 °C are seldom worth turning into power. They are almost always worth using directly as heat, at or below the temperature they are already at.

## Exercise: the kettle steam

The plant's cooking kettle condenses 0.02 kg/s of steam at 102.53 °C. The NIST saturation table gives an enthalpy of vaporisation of 2,249.65 kJ/kg at this temperature. Find the heat released by the condensing steam, the Carnot efficiency for heat at this temperature with the sink at 20 °C, and the most work a reversible engine could obtain from that heat.

**Worked answer.** The heat released is 0.02 × 2,249.65 = **45.0 kW**. Condensation takes place at a constant temperature, 102.53 + 273.15 = 375.68 K, so the Carnot formula applies exactly: 1 − 293.15 ÷ 375.68 = **22.0%**.

The most work obtainable is 0.22 × 45.0 = **9.9 kW**. Unlike the effluent, the condensing steam gives up all its latent heat at one temperature, which is why its limit equals the Carnot efficiency rather than falling below it. Chapter 6 shows what happens to the other 78% of the steam's work potential when its heat goes straight into a kettle of food at 90 °C.
