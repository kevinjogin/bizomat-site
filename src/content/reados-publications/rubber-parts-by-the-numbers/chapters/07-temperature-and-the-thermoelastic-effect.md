---
book: rubber-parts-by-the-numbers
chapterSlug: temperature-and-the-thermoelastic-effect
order: 7
title: "Temperature and the thermoelastic effect"
description: "See why rubber stiffens as it warms and warms as it stretches, follow the test plug's trapped air from a hot ute to a cold pipe, and catch a falling gauge blamed on a valve that was not leaking."
draft: false
---

Rubber's response to temperature runs against an engineer's instincts. Warm a steel spring and it gets very slightly softer; warm a stretched rubber band and it pulls harder. Stretch a steel bar quickly and nothing much happens to its temperature; stretch a thick rubber band quickly and hold it to your lip, and it is noticeably warm. Both effects come from the same source, the entropic nature of rubber's stiffness described in Chapter 1, and the thermodynamics text listed in the references uses rubber as one of its main examples for exactly that reason.

For an inflated rubber part, temperature also acts through the gas inside it, which loses pressure as it cools. This chapter puts numbers on all three effects for TP-100, explains the limits set by the compound's low- and high-temperature behaviour, and records a plug whose falling pressure was misdiagnosed.

## Stiffness proportional to absolute temperature

In an ideal rubber network, stiffness comes entirely from the thermal motion of the chains, and the shear modulus is proportional to absolute temperature: G = N k T, where N is the number of network chains per unit volume and k is Boltzmann's constant. Real rubbers follow that rule approximately over their normal working range, with deviations caused by thermal expansion and by the small energy contribution to their stiffness.

```figure
type: formula
title: Shear modulus of an ideal rubber network
formula: G(T) = G(T₀) × T / T₀
caption: This is an illustration for TP-100's compound, with G = 0.82 MPa at 20 °C. Temperatures must be absolute, in kelvin. Real compounds follow the trend only approximately and depart from it near their glass transition and at high temperature.
- G(T₀) | Modulus at the reference temperature, 0.82 MPa at 293.15 K
- T | Working temperature, K
step: At 5 °C: G = 0.82 × 278.15 / 293.15 = 0.78 MPa, 5.1% lower
step: At 40 °C: G = 0.82 × 313.15 / 293.15 = 0.87 MPa, 6.8% higher
```

Because temperatures enter as kelvin, the effect is modest over the range a test plug sees: about 5% softer at 5 °C and 7% stiffer at 40 °C. For TP-100 in its pipe, that moves the pressure taken by the sleeve from 33.2 kPa at 20 °C to 31.5 kPa at 5 °C and 35.5 kPa at 40 °C, a change of a couple of kilopascals in a contact pressure of over 100 kPa. The ideal-network effect matters little for the plug's grip. It matters more for a part whose function is its stiffness, such as a rubber spring, and it is a useful check on the physics: a compound that softens markedly as it warms over this range is showing something other than ideal network behaviour, such as filler effects or degradation.

## The thermoelastic effect

If rubber's stiffness is entropic, stretching it lowers its entropy, and in a rapid stretch with no time for heat to escape, the lost entropy appears as a rise in temperature. For an ideal rubber, the work done in stretching it is turned entirely into heat, so in a fast stretch the temperature rise is about the stored energy per unit volume divided by the rubber's heat capacity per unit volume. Released quickly, the rubber cools by about the same amount. The effect was first described by Gough in the early nineteenth century and studied by Joule, and it is often called the Gough–Joule effect.

This is an illustration. Taking a density of 1,100 kg/m³ and a specific heat of 1,900 J/kg·K for TP-100's filled compound, values typical of filled natural rubber but not measured for it, the heat capacity per unit volume is about 2.1 MJ/m³·K.

```figure
type: compare
title: Temperature rise in a fast stretch of TP-100's compound
cols: Stored energy, neo-Hookean | Temperature rise if no heat escapes
caption: This is an illustration. Ideal rubber, all stretching work turned to heat; G = 0.82 MPa; heat capacity about 2.1 MJ/m³·K, an assumed typical value. At very small strains, around 10% or less, real rubber's thermal expansion reverses the effect and it cools slightly on stretching.
- Sleeve in the pipe, plane strain, λ = 1.149 | 0.032 MJ/m³ | about 0.02 K
- Strip stretched to λ = 4 | 5.5 MJ/m³ | about 2.6 K
- Strip stretched to λ = 6 | 13.6 MJ/m³ | about 6.5 K
```

For TP-100 in its pipe, the effect is negligible: a fiftieth of a degree. Even if the sleeve were cycled rapidly between deflated and inflated, the temperature change per cycle would be tiny, and the heat would leak away into the pipe and the air long before it accumulated. The effect would only matter for a sleeve stretched a long way, quickly and often, which is exactly the situation the plug's design and instructions are meant to prevent. For rubber stretched several times its length, it is easily felt, which is the classic classroom demonstration. Two more consequences matter in engineering:

- **Heat build-up in cycled parts.** Real rubber is not ideal; in every load cycle some of the work is lost as heat through hysteresis rather than returned. Parts that flex rapidly and repeatedly, such as tyres, belts, pump diaphragms and vibration mounts, warm up steadily, and their temperature limit, not their strength, often sets their life.
- **A stretched band contracts when heated.** Hang a weight on a rubber band and warm it, and the band shortens and lifts the weight, because its stiffness rises with temperature. It is the opposite of most materials, and it can surprise a designer whose rubber part holds a tension in a warm environment.

## Trapped air and temperature

The bigger temperature effect on TP-100 is not in the rubber at all. Once the plug is charged from its fixed-charge cylinder, as Chapter 5 recommended, it holds a fixed quantity of air. At constant volume, which the pipe wall imposes, the absolute pressure of that air is proportional to its absolute temperature, as [Thermal Expansion by the Numbers](/reados/publications/thermal-expansion-by-the-numbers/gases-pressure-and-temperature/) sets out for gases in general.

This is an illustration. A plug charged to 150 kPa gauge with its air at 30 °C, then cooled to 15 °C by the pipe and the ground around it, falls to (150 + 101.3) × 288.15 / 303.15 − 101.3 = **137.6 kPa** gauge. A plug charged while hot from lying in the sun, at 45 °C, and cooled to 15 °C, falls to **126.3 kPa**.

```figure
type: compare
title: TP-100's inflation and grip after its air cools
cols: Inflation pressure | Contact pressure | Grip, wet PVC, μ 0.32
caption: This is an illustration. Fixed charge of air at constant volume; atmospheric pressure 101.3 kPa; sleeve in a 100 mm bore with its modulus adjusted for temperature; contact length 100 mm. The plug still meets its targets, with less margin.
- Charged at 20 °C, stays at 20 °C | 150.0 kPa | 116.8 kPa | 1,174 N
- Charged at 30 °C, cools to 15 °C | 137.6 kPa | 104.9 kPa | 1,055 N
- *Charged at 45 °C in the sun, cools to 15 °C | 126.3 kPa | 93.6 kPa | 941 N
- Charged at 20 °C, cools to 5 °C | 137.1 kPa | 105.6 kPa | 1,062 N
```

Even the worst case leaves a contact pressure more than three times the 29.4 kPa test head, so the plug still seals; its grip falls by about a fifth. With a regulated supply connected throughout, there would be no fall, which is one of the few advantages of a regulated supply and one reason that, for long tests, some procedures call for topping up the charge after the plug has settled to pipe temperature.

## Cold and hot limits

The ideal-network picture holds only over a compound's working range. At the cold end, every rubber has a **glass transition temperature**, below which the chains can no longer move freely and the rubber becomes hard, leathery and eventually glassy. For natural rubber it is far below anything a plumbing test meets, around −70 °C, but compounds stiffen noticeably well above their glass transition, and natural rubber stored cold for long periods can also stiffen by slow crystallisation, reversibly on warming. At the hot end, rubber softens as its compound ages, and above the compound's rated temperature it degrades: it hardens or softens permanently, loses strength and cracks.

For TP-100, used between 5 °C and 40 °C, both limits are far away. Storage is a different matter: a plug left for a summer in a closed vehicle can reach temperatures well above 40 °C, and repeated heating speeds the ageing that Chapter 8 describes. The manufacturer's instructions ask for plugs to be stored deflated, in their bag, out of direct sun. For an inflatable seal in an oven door, or a bladder in a cold store, they would govern the choice of compound, and the supplier's rated temperature range, tested by ageing and low-temperature methods, is the number to design to.

## The error: a falling gauge and a good valve

This is an illustration. A plumber testing a long drain on a winter morning charged two TP-100 plugs from the fixed-charge cylinder, which had been sitting on the ute's dashboard in the sun and was warm to the touch. Within twenty minutes of inserting the plugs, both inflation gauges had fallen from 150 kPa to about 127 kPa. Suspecting leaking valves, the plumber deflated both plugs, replaced their valves from the van's spares, recharged them from the same warm cylinder and watched the gauges fall again, to the same reading.

The manufacturer's service line asked two questions: how warm was the charging cylinder, and did the pressure keep falling after twenty minutes? It had been in the sun, perhaps 45 °C, and the pressure had stopped falling at about 127 kPa. That is the gas law, not a leak: air charged at 45 °C and cooled to the pipe's 15 °C falls from 150 kPa to about 126 kPa and then stays there. A leaking valve produces a pressure that keeps falling.

No harm was done beyond an hour's lost time and two good valves thrown away, but the misdiagnosis could have gone the other way: a real leak mistaken for cooling. The manufacturer added two lines to its instructions. Store the charging cylinder in the shade and charge plugs after they have reached pipe temperature. And distinguish cooling from leaking by watching the gauge: cooling levels off within about twenty minutes; a leak does not. The test record sheet now has columns for the gauge reading at insertion, at twenty minutes and at the end of the test.

## Temperature and the free-inflation limit

Chapter 5's limit pressure, G T / R for the held-end sleeve, is proportional to the shear modulus, and so to absolute temperature. At 5 °C it falls to about 74 kPa and at 40 °C it rises to about 83 kPa. The change does not alter the conclusion that a regulated 150 kPa supply has no equilibrium in free air, but it shows that a design that sat close to its limit at room temperature could cross it on a cold morning. Any inflatable part designed to work just below its limit pressure, rather than far below or far above it with restraint, needs its limit checked at the coldest temperature it will see.

The fixed charge of Chapter 5 is affected both ways in the cold: the rubber is slightly softer, so the sleeve would grow a little further in free air, while the cold air holds less pressure, so it pushes a little less. For TP-100 the two effects nearly cancel over the plug's working range.

## The rubber's own expansion

Rubber also expands with temperature, much more than metal. Typical natural rubber compounds have linear expansion coefficients of the order of 2 × 10⁻⁴ per °C, roughly fifteen to twenty times that of steel; the compound's data sheet should be used where it matters. This is an illustration. Over TP-100's 35 °C working range, the sleeve's 42 mm mean radius changes by about 42 × 0.0002 × 35 = 0.29 mm, small beside the 6 mm it stretches to reach the pipe wall. The effect matters more for rubber parts fitted closely into metal grooves, such as seals and the sleeve's own clamped ends: a rubber ring that fits its groove snugly at 20 °C may be loose when cold and overfill the groove when hot, and grooves for rubber are sized with room for that expansion.

## Testing at temperature

Calculations of temperature effects are useful for spotting problems; tests settle them. This is an illustration. TP-100's manufacturer runs its inflation and slip tests at three temperatures, with the plug, test pipe and air conditioned in a cold room at 5 °C, in the workshop at about 20 °C, and in a warm room at 40 °C, and records the inflation curve, the grip and the gauge drift at each. The results confirmed the calculated trends within the scatter of the tests and, more usefully, showed that the friction on wet PVC was a little lower in the cold, a change no calculation in this chapter predicts. Temperature effects on friction, like friction itself, have to be measured.

## Exercise: an oven-door seal

An inflatable rubber seal on an oven door is charged with a fixed quantity of air at 20 °C to 100 kPa gauge. The seal is enclosed so its volume is nearly constant, and in service its air reaches 120 °C.

1. What gauge pressure does the air reach?
2. What does the ideal-network rule say about the seal rubber's stiffness at 120 °C, and what else should the designer check?

**Worked answer.**

1. Absolute pressure scales with absolute temperature: (100 + 101.3) × 393.15 / 293.15 = 270.0 kPa absolute, or **168.7 kPa** gauge. The seal's pressure rises by about 69%, which its housing and the door's structure must carry, and which raises the seal's contact force.
2. The ideal rule predicts a modulus 393.15 / 293.15 = **1.34** times its value at 20 °C. In practice, the compound's behaviour at 120 °C depends on its type: natural rubber would be ageing rapidly at that temperature, while silicone and some fluoroelastomers are rated well above it. The designer should check the compound's rated temperature, its compression set and ageing at 120 °C, and whether the seal's limit pressure from Chapter 5, which rises with G, still exceeds the hot air pressure if the door is opened while the seal is inflated.
