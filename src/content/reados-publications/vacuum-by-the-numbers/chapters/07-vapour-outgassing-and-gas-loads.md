---
book: vacuum-by-the-numbers
chapterSlug: vapour-outgassing-and-gas-loads
order: 7
title: "Vapour, outgassing and gas loads"
description: "Gas load once the air is gone: vapour pressure and Clausius–Clapeyron checked against NIST, evaporation limited by heat, resin and walls, and a wet container."
draft: false
---

Pumping out the air a chamber was filled with is the easy part. Once it is gone, the pressure is set by the gas that keeps arriving: water coming off the walls, vapour and dissolved air coming out of the work, gas permeating through seals, and leaks. Vacuum engineers call it the **gas load**, and in a process like VC-200's, where the work is a batch of freshly mixed resin, it is large enough to decide how low the chamber can go and how long it takes. Most of it, in most industrial chambers, is water.

This chapter lists the sources of gas load, uses the Clausius–Clapeyron relation and NIST's data to explain vapour pressure and why it rises so steeply with temperature, shows that evaporation into a vacuum is limited by heat rather than by the vacuum, estimates VC-200's loads from the resin and the walls, measures the total by rate of rise, and ends with a wet mixing container that held a batch above its working pressure.

## Where the gas comes from

Once the original air has been pumped away, gas enters a chamber in several ways.

- **Desorption from surfaces.** Every surface exposed to air carries an adsorbed film, mostly water, which leaves as the pressure falls. It declines with time, slowly.
- **Outgassing from materials.** Polymers, elastomers, adhesives and porous materials hold dissolved gas and water in their bulk, which diffuses out over hours.
- **Vapour from liquids.** Any liquid in the chamber evaporates until its vapour reaches its saturation pressure, or until it is gone.
- **Gas from the work.** VC-200's resin releases the air entrained when it was mixed, any dissolved air, and small amounts of volatile components.
- **Permeation.** Gas passes through elastomer seals, slowly, from the atmosphere outside.
- **Leaks.** Gas flows in through cracks, porous welds and poor seals (Chapter 8).

## Vapour pressure

A liquid in a closed space evaporates until the vapour above it reaches a definite pressure, its **saturation vapour pressure**, at which molecules leave the liquid as fast as they return to it. The saturation pressure depends only on the substance and its temperature, and it rises steeply with temperature. If the pressure above a liquid is held below its saturation pressure, as a vacuum pump does, the liquid keeps evaporating, and if the pressure is well below, it boils.

Statistical thermodynamics relates the slope of the vapour pressure curve to the heat needed to evaporate the liquid. In its simplest form, treating the vapour as an ideal gas and the latent heat as constant, the **Clausius–Clapeyron relation** reads:

ln(p₂ ÷ p₁) = (L ÷ R) × (1 ÷ T₁ − 1 ÷ T₂)

where L is the molar latent heat of evaporation, R the gas constant and T₁, T₂ absolute temperatures.

It can be checked against NIST's water data. Water's saturation pressure is **1.2282 kPa** at 10 °C and **2.3393 kPa** at 20 °C. Solving for L: L = 8.314 × ln(2.3393 ÷ 1.2282) ÷ (1 ÷ 283.15 − 1 ÷ 293.15) = **44.5 kJ/mol**, which is **2,468 kJ/kg**. NIST's latent heat at 15 °C, the difference between its vapour and liquid enthalpies, is **2,465 kJ/kg**. Using the derived L to predict the saturation pressure at 25 °C gives **3.177 kPa**, against NIST's **3.170 kPa**. A relation derived from the second law and an ideal gas reproduces measured data to a fraction of a per cent over this range.

```figure
type: formula
title: The Clausius–Clapeyron relation checked against NIST water data
formula: ln(p₂ ÷ p₁) = (L ÷ R) × (1 ÷ T₁ − 1 ÷ T₂)
caption: Latent heat derived from NIST's saturation pressures at 10 and 20 °C, then used to predict 25 °C. The simple form assumes an ideal vapour and a constant latent heat.
- p₁, T₁ | 1.2282 kPa at 283.15 K (NIST)
- p₂, T₂ | 2.3393 kPa at 293.15 K (NIST)
step: L = 8.314 × ln(2.3393 ÷ 1.2282) ÷ (1 ÷ 283.15 − 1 ÷ 293.15) = 44.5 kJ/mol = 2,468 kJ/kg
step: NIST latent heat at 15 °C: 2,528.3 − 63.0 = 2,465 kJ/kg
step: Predicted at 25 °C: 3.177 kPa; NIST 3.170 kPa
```

## Water in VC-200

Water's saturation pressure at 20 °C, 2,339 Pa, is more than eleven times VC-200's working pressure. Any liquid water in the chamber boils. As it does, it draws its latent heat from itself and its surroundings and cools, and a small amount of water in a vacuum chamber can cool until it freezes, after which it sublimes more slowly as ice. Water also comes off the walls and out of the resin as vapour, and for VC-200's working range water vapour is usually the largest single part of the gas load once the original air has gone.

The amount of gas in a small amount of water is large. One gram of water is 1 ÷ 18.015 = 0.0555 mol, and as vapour at 20 °C it is n × R × T = **135 Pa·m³**. At 200 Pa, VC-200's pump removes about 0.87 Pa·m³/s, so a single gram of liquid water takes at least **155 s** of pumping to remove, longer than half of the chamber's whole pump-down. A film of water on the walls and containers, invisible but amounting to a gram or two, can double the time to the working pressure.

## Evaporation is limited by heat, not by vacuum

Kinetic theory gives the fastest rate at which a liquid can evaporate into a perfect vacuum: the rate at which its own vapour, at saturation pressure, would strike its surface (Chapter 2). For water at 20 °C, that ceiling is p_sat × √(m ÷ (2π k T)) = about **2.5 kg per square metre per second**. Supplying the latent heat for that would take about **6 megawatts per square metre**.

No chamber delivers anything like that. The surface of water in a vacuum cools at once, its vapour pressure falls with its temperature, and evaporation settles at the rate at which heat can reach the surface from the surroundings by conduction and radiation. Drying in a vacuum is therefore a heat-transfer problem: warming the chamber, the shelves or the work speeds it far more than a bigger pump does. For VC-200, which degasses resin rather than drying it, the same physics means that the resin cools slightly as it gives off vapour, and the shop's temperature range in the process sheet keeps that from thickening it.

```figure
type: compare
title: How much gas small amounts of water hold, as vapour at 20 °C
rowhead: Water
cols: Moles | As pV, Pa·m³ | Minimum time to pump at 200 Pa, s
caption: This is an illustration with VC-200 removing about 0.87 Pa·m³/s at 200 Pa. A gram of water holds more than three times as much gas as the chamber's air does at 200 Pa.
- 0.1 g, a film on a container | 0.0056 | 13.5 | 16
- * 1 g | 0.0555 | 135 | 155
- 2 g, a rinsed container not dried | 0.111 | 271 | 311
- VC-200's air at 200 Pa, for comparison | 0.0164 | 40 | 46
```

## The resin's gas

This is an illustration. A batch of VC-200's resin is 6 kg at a density of about 1.15 kg/L, about **5.2 litres**. Mixing entrains air; if 2% of the mixed volume is entrained air, that is 0.104 litres at atmospheric pressure, **10.5 Pa·m³** of gas, released over the first few minutes at low pressure as the bubbles rise and burst. Dissolved air and moisture in the resin and its fillers add more, and small amounts of reactive diluents or other volatile components contribute vapour; the resin's data sheet and safety data sheet say what is present.

Those sources are hard to calculate with confidence. They are easy to measure.

## Measuring the gas load by rate of rise

If the pump is isolated from a chamber, the gas load raises the pressure at a rate set by the load and the volume: Q = V × dp/dt. A **rate-of-rise** measurement isolates the chamber for a minute or so and records the rise.

This is an illustration. With a full batch in VC-200 at about 200 Pa, at the start of degassing, the ball valve is closed for 60 s and the pressure rises by **150 Pa**:

- Q = 0.2 × 150 ÷ 60 = **0.50 Pa·m³/s**.

Five minutes into degassing, the same test gives a rise of 30 Pa in 60 s, **0.10 Pa·m³/s**, as the entrained air has largely gone. With an empty, dry chamber, the rise at 200 Pa is about 3 Pa a minute, **0.01 Pa·m³/s**, which Chapter 8 shows is mostly a small leak. The resin dominates the load at the start; it is what keeps the chamber's floor near 130 Pa then (Chapter 6), and what the shop's staged pump-down is designed around.

A rate-of-rise measurement mixes all sources together. Repeating it at intervals separates them: loads from vapour and desorption fall with time and level off as their sources are exhausted or reach equilibrium, while a leak's load stays constant.

```figure
type: bars
title: VC-200's gas load at about 200 Pa, by rate of rise
unit: Pa·m³/s
max: 0.6
caption: This is an illustration: Q = V × dp/dt, from 60 s rate-of-rise tests in the 0.2 m³ chamber. The resin's load falls as it degasses; the empty chamber's is mostly a small leak.
- * Full batch, start of degassing | 0.50
- Full batch, after 5 minutes | 0.10
- Empty, dry chamber | 0.01
```

## Walls and seals

The walls of a clean stainless steel chamber that has not been baked give off water at a rate that falls roughly in inverse proportion to the time since pumping began. Published outgassing rates for unbaked stainless steel after an hour's pumping are very small per square metre, and for VC-200, with about 2.1 m² of interior surface, the walls' load is a tiny fraction of the resin's. The door's elastomer seal and the viewport's gasket outgas more per unit area than steel and let a little atmospheric gas permeate through them, but again far less than a batch of resin. Chambers for high vacuum are often baked, heated to well above 100 °C while pumping, to drive the adsorbed water off the walls in hours rather than weeks; that is far beyond what a rough-vacuum degassing chamber needs, and VC-200's door seal and viewport would not tolerate it. In VC-200, the walls and seals matter mainly in what they do between cycles: they adsorb water from the room whenever the chamber stands open, which is why it is kept closed between batches.

## Reducing the gas load

Because the gas load sets the floor and the end of the pump-down, reducing it is often cheaper than buying pumping speed. The usual measures, roughly in order of effect for a chamber like VC-200:

- **Keep liquids out.** Dry containers, tools and work before loading; a gram of water costs minutes.
- **Keep the chamber closed and dry.** Vent with dry gas where practicable, and close the door between cycles.
- **Prepare the work.** For resin, mixing gently, or under partial vacuum where the equipment allows, entrains less air in the first place.
- **Control the temperature.** Warm work gives off vapour faster and finishes sooner; cold work gives off less but takes longer. Choosing the temperature is a trade between the two, within the material's own limits.
- **Choose materials inside the chamber.** Porous materials, foams, cardboard, wood and some plastics hold a great deal of water and gas; metal, glass and suitable elastomers hold little.
- **Fix leaks.** A leak's load is constant and never declines; Chapter 8 deals with finding them.
- **Keep the pump's oil clean.** A contaminated pump adds its own vapour to every cycle (Chapter 5).

Each of these acts on the source of the gas. A larger pump acts only on its removal, and against a source such as a gram of boiling water, whose evaporation is limited by heat, it does surprisingly little.

## The error: a wet mixing container

This is an illustration. One afternoon, VC-200's pump-down log showed a batch that stopped falling at about **350 Pa** for several minutes before slowly continuing, well above the process tolerance. The controller, now started by the gauge (Chapter 6), held the degassing timer until the pressure reached 250 Pa, and the cycle ran nearly four minutes over time.

The operator explained that the mixing container had been rinsed and only wiped dry, because the usual containers were in the wash. A container wet with about **2 g** of water carries 271 Pa·m³ of vapour into the chamber. At 350 Pa, with an effective speed of about 3.91 L/s, the pump removes 350 × 0.00391 = 1.37 Pa·m³/s, so that water alone took about **200 s** to pump away, and the boiling water's vapour held the chamber near the pressure at which its evaporation, limited by heat, balanced the pump.

The batch was not harmed, because the timer waited for the gauge. The shop added a drying cabinet for containers and stirrers, a rule that they are stored dry and covered, and a note on the process sheet that any batch whose pump-down stalls above 300 Pa is checked for wet tools before the next one.

```figure
type: checklist
title: Gas load checks for a vacuum process
caption: The air in the chamber is pumped in minutes; these sources set the rest. The last line is this chapter's error.
- Liquids in the chamber identified, with their vapour pressures | water at 20 °C: 2,339 Pa
- Work's gas measured by rate of rise at the working pressure | 0.50 Pa·m³/s at the start of degassing
- Heat supply considered where liquids must evaporate | evaporation limited by heat, not vacuum
- Chamber kept closed and dry between cycles | walls adsorb water from room air
- Containers and tools dry before loading | a gram of water is 135 Pa·m³
- x A rinsed container wiped, not dried | stalled near 350 Pa; about 200 s lost
```

## Exercise: a drying process at 30 °C

A different chamber dries parts wet with about **5 g** of water at 30 °C. Using NIST's saturation pressure of water at 30 °C, **4.247 kPa**, and the latent heat found above, estimate the vapour's amount as pV at 30 °C, the heat needed to evaporate it, and the time to evaporate it if the parts and shelves can supply heat at **200 W**. Is the pump or the heat supply the likely limit, if the pump's effective speed is 10 L/s at 1 kPa?

**Worked answer.**

- Moles: 5 ÷ 18.015 = 0.278 mol; as pV at 303.15 K: 0.278 × 8.314 × 303.15 = **700 Pa·m³**.
- Heat: 5 g × 2.468 kJ/g = **12.3 kJ**.
- Time at 200 W: 12,340 ÷ 200 = **62 s** at best.
- Pump: at 1 kPa, 10 L/s removes 10 Pa·m³/s, so 700 Pa·m³ takes at least **70 s**.

The two limits are similar, and in practice the heat supply falls as the parts cool, so the drying usually takes longer than either figure. Warming the shelves raises both the heat supply and the vapour pressure, and is usually the cheapest way to dry faster.
