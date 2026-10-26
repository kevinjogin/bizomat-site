---
book: heat-exchangers-by-the-numbers
chapterSlug: boiling-condensing-and-burnout
order: 10
title: "Boiling, condensing and burnout"
description: "Understand heat transfer with a change of phase: nucleate and film boiling, the critical heat flux, condensing and the gases that spoil it, and catch a dense heater element that scale burnt out."
draft: false
---

When a fluid boils or condenses at a heated or cooled surface, heat transfer changes character. A boiling liquid carries heat away from a hot surface as vapour bubbles, and its coefficients can be many times those of the same liquid without boiling. A condensing vapour gives up its latent heat at a cold surface, and it too transfers heat very effectively. But boiling has a limit. Above a certain heat flux, the bubbles merge into a vapour blanket that insulates the surface, its temperature leaps, and the surface can melt or fail. This **critical heat flux**, the point the DOE handbook calls the departure from nucleate boiling, governs the design of boilers, reactors, electric heating elements and evaporators.

This chapter describes the regimes of boiling, estimates the critical heat flux for water at atmospheric pressure, explains condensing and the non-condensable gases that ruin it, and turns to the most common industrial case of high heat flux into water: the electric immersion heater. The running case finds that the parts-washer heater, downstream of the heat recovery of Chapters 2 and 3, was fitted with replacement elements of nearly twice the watt density to fit a smaller flange, and that in the washer's hard water, scale on their sheaths raised their temperature until they failed within months.

## The regimes of boiling

Imagine a heated surface in a pool of water at its boiling point, with the surface temperature raised step by step. The **wall superheat**, the surface's temperature above the water's saturation temperature, determines what happens.

```figure
type: steps
title: Regimes of pool boiling as the wall superheat rises
caption: The regimes follow the classic boiling curve. Heat flux rises steeply through nucleate boiling to the critical heat flux, then falls in the transition region before film boiling takes over at much higher wall temperatures.
- Natural convection | A few kelvin of superheat; no bubbles; heat carried by convection currents
- *Nucleate boiling | Bubbles form at surface sites and lift away; heat flux rises steeply with small increases in superheat
- Critical heat flux | Bubbles crowd so densely that liquid cannot reach the surface fast enough; the maximum heat flux
- Transition boiling | A partial, unstable vapour film; heat flux falls as superheat rises
- Film boiling | A stable vapour blanket; heat crosses it by conduction and radiation; surface hundreds of kelvin above the liquid
```

In **nucleate boiling**, vapour bubbles form at tiny cavities in the surface, grow, detach and rise, stirring the liquid next to the surface and carrying latent heat away. Coefficients are very high: a modest wall superheat drives a large heat flux. In **film boiling**, the surface is covered by a vapour film, and heat must cross it by conduction and radiation, which needs a much larger temperature difference for the same heat flux. If the heat input is fixed, as it is for an electric element or a nuclear fuel rod, exceeding the critical heat flux forces a jump from nucleate to film boiling at the same heat flux, and the surface temperature leaps by hundreds of kelvin. That jump is **burnout**, and for a metal element or tube it is usually destructive within seconds.

The DOE handbook distinguishes **bulk boiling**, where the whole liquid is at saturation and vapour bubbles survive to the surface, from **subcooled** or local boiling, where the bulk liquid is below its boiling point and bubbles form at the hot surface but collapse as they move into cooler liquid. A heater in a washer tank at 65 °C boils locally on its sheath if its heat flux is high enough, while the tank as a whole never boils.

## The critical heat flux

The critical heat flux for pool boiling can be estimated from the liquid's and vapour's properties by a relationship derived by Zuber, which is widely used for water and many other liquids:

```figure
type: formula
title: Critical heat flux in pool boiling, Zuber form
formula: q″_max ≈ 0.131 × h_fg × √ρ_v × [σ × g × (ρ_l − ρ_v)]^(1/4)
caption: This is an illustration for saturated water at atmospheric pressure, with h_fg ≈ 2,257 kJ/kg, ρ_v ≈ 0.598 kg/m³, ρ_l ≈ 958.4 kg/m³ and surface tension σ ≈ 0.0589 N/m. Some authors use a coefficient of about 0.149, giving about 14% more.
- h_fg | Latent heat of vaporisation, J/kg
- ρ_v, ρ_l | Vapour and liquid densities, kg/m³
- σ | Surface tension, N/m
step: q″_max ≈ 0.131 × 2.257 × 10⁶ × √0.598 × (0.0589 × 9.81 × 957.8)^(1/4)
step: q″_max ≈ 1.1 × 10⁶ W/m², about 1.1 MW/m², or 110 W/cm²
step: Subcooling and flow raise it; a fouled or poorly wetted surface can lower it
```

About 1.1 MW/m² is a very large heat flux, far above what ordinary industrial water heaters impose. It matters greatly in boilers, steam generators and nuclear reactors, where the heat flux is pushed high for compactness and the margin to the critical value is a primary safety limit. For immersion heaters in tanks, the critical heat flux is rarely reached directly; their failures come from something that raises the sheath's temperature at a heat flux well below it.

## Condensing

A vapour touching a surface below its saturation temperature condenses, releasing its latent heat. If the condensate wets the surface, it forms a film that drains under gravity, and heat crosses the film by conduction; this **film condensation** gives high coefficients, typically thousands to tens of thousands of W/(m²·K) for steam. On some surfaces the condensate forms droplets instead, **dropwise condensation**, with even higher coefficients, but it is hard to sustain in practice and designs assume film condensation.

The great enemy of condensers is **non-condensable gas**: air or other gases mixed with the vapour. As the vapour condenses, the gas is left behind at the surface, forming a layer through which vapour must diffuse to reach the cold wall. Even a few per cent of air can cut a steam condenser's coefficient by half or more. Condensers and steam-heated equipment are therefore vented, continuously or periodically, at the point where gas collects, and a steam heater that underperforms is checked first for air, then for condensate that is not draining and is flooding part of its surface, before anyone suspects the heater's size.

On the temperature diagram of Chapter 1, a condensing or boiling stream is a horizontal line. The log mean temperature difference still applies, with that stream's temperature constant, and F is one, because with one stream at a constant temperature the flow arrangement no longer matters.

## The running case: the parts-washer heater

This is an illustration. The parts washer's tank holds water preheated to about 48 °C by the heat-recovery exchanger and raised to about 65 °C by three 6 kW electric immersion elements. The original elements had a **watt density**, the power per unit of sheath surface, of about **8 W/cm²**, 80 kW/m², so each had about 0.075 m² of sheath. That is about 7% of the water's critical heat flux at atmospheric pressure, a comfortable margin, and in water at 65 °C the sheaths boil locally in nucleate boiling, with bubbles collapsing a few millimetres away.

## The error: watt density and scale

When the elements were due for replacement, the washer's tank was modified and the new flange opening was smaller. A supplier offered compact elements of the same 6 kW but about **15 W/cm²**, about 0.040 m² of sheath each. At 150 kW/m², still about 14% of the critical heat flux, they appeared safe. Within months, two had failed.

The washer used hard water, and the sheaths carried a layer of scale. Scale is a poor conductor, of the order of 1 W/(m·K), so a layer 0.5 mm thick adds a temperature drop of heat flux × thickness ÷ conductivity. At the old 8 W/cm², that drop was about **40 K**; at the new 15 W/cm², about **75 K**. The heat had to cross the scale to reach the water, so the sheath ran 75 K hotter than the scale's outer surface, and the resistance wire inside, separated from the sheath by packed magnesium oxide, ran hotter still, beyond the element's design temperature.

```figure
type: bars
title: Temperature rise across 0.5 mm of scale on a heater sheath, K
unit: K
max: 80
caption: This is an illustration with a scale conductivity of about 1 W/(m·K). The temperature drop across a fouling layer is proportional to the heat flux, so a higher watt density turns the same scale into a much hotter sheath.
- Clean sheath, any watt density | 0
- 8 W/cm², original elements | 40
- *15 W/cm², replacement elements | 75
```

The diagnosis came from cutting open a failed element and finding scale and an overheated wire. The fix had three parts: elements of low watt density again, with a longer, folded sheath that fitted the smaller flange; water softening for the washer's makeup, to stop the scale forming; and a low-level cut-out, because an element exposed to air when the tank's level drops loses its cooling altogether and fails within minutes. The general lesson is that a surface's temperature depends on its heat flux and every resistance between it and the fluid, and that high heat flux turns a modest fouling layer into a large temperature rise. Watt density is the immersion heater's version of the critical heat flux margin, and scale is what consumes it. A replacement part with the same kilowatts is not the same part if its watt density differs, and the difference belongs on the purchase order.

## Heat flux as a design limit

The parts washer's lesson generalises. Wherever heat is forced into a fluid at a fixed rate, by an electric element, a flame, a fuel rod or a process reaction, the surface temperature is not set by the designer but by the heat flux divided by the coefficient, plus the flux times every resistance in the path. A low coefficient, a fouling layer, a gas pocket or a dry patch raises the surface temperature in proportion. Designs therefore limit the heat flux to leave margin against the worst coefficient and fouling expected, and they protect against loss of the fluid: low-level cut-outs on tanks, flow switches on heated pipes, and thermal cut-outs on the sheaths themselves.

## Steam heating in practice

Many plants heat tanks and process streams with steam rather than electricity, through coils, jackets or shell-and-tube heaters, and steam's condensing coefficient makes the steam side rarely the controlling one. [Steam Systems by the Numbers](/reados/publications/steam-systems-by-the-numbers/) works through steam supply, traps and condensate return in full. The practical problems are almost all about getting the condensate and the air out. Condensate must drain freely from the heating surface to a **steam trap**, a valve that passes condensate and holds back steam; a trap that fails closed, or a coil laid without fall, floods part of the surface with condensate, which transfers heat far less well than condensing steam and can cause water hammer when steam meets the trapped water, a subject *Water Hammer by the Numbers* covers. A trap that fails open passes live steam to the condensate system, wasting energy. Air, entering when the system cools and draws a vacuum or arriving with the steam, must be vented, as the condensing section above explained. A steam heater that underperforms is checked in that order: trap and drainage, then venting, then fouling on the process side.

## Evaporators

Refrigeration plant boils its refrigerant in an **evaporator**, a heat exchanger in which the refrigerant boils on one side while it cools water, air or a process fluid on the other. The boiling side has high coefficients, and evaporators are usually controlled by the other fluid's side, as an oil cooler is controlled by its oil. Lubricating oil carried round the circuit with the refrigerant collects in evaporators and lowers their boiling coefficients, which is why evaporator designs include oil return. The plant's chiller, which *Cooling Towers by the Numbers* considers alongside the tower, has an evaporator and a condenser of exactly this kind, and its performance depends on both exchangers' approaches, as Chapter 2 described for simpler duties.

## OC-35's record

The ten chapters of this book add up to one design record for OC-35, and the same structure suits any exchanger. In this book's illustrations, it reads:

- **Duty**: 35 kW, oil 55 °C to 45 °C at 127 L/min, tower water 29 °C to 34 °C at 101 L/min, both balances agreeing.
- **Temperature difference**: counterflow log mean 18.39 K, F ≈ 0.975 for one shell and four tube passes, corrected mean about 17.9 K.
- **Coefficient**: oil film 450, water film about 6,090 W/(m²·K), fouling 0.00018 m²·K/W each side, stainless tubes; service U about 349, clean about 404 W/(m²·K); oil side about 78% of the resistance.
- **Area**: about 5.6 m², 60 tubes of 12.7 × 0.9 mm, about 2.34 m long.
- **Rating**: ε ≈ 0.379 at design fouling; oil about 58.4 °C into the cooler on a 32 °C water day.
- **Hydraulics**: tube side about 28.6 kPa against 60 kPa available.
- **Monitoring**: commissioning conductance about 2.20 kW/K, design-allowance line about 1.91 kW/K, monthly readings logged.

Each line is checkable, and each points to the chapter that explains it. When the next engineer is asked why the oil runs hot, the record answers most of the question before anyone opens the exchanger.

## Exercise: a margin against the critical heat flux

A small steam generator for a cleaning system heats water at atmospheric pressure with electric elements, and its designer wants the elements' heat flux to stay below one-tenth of the critical heat flux for saturated water, as a margin. What maximum watt density does that allow, in W/cm²? With 0.3 mm of scale of conductivity about 1 W/(m·K), how much does the scale raise the sheath temperature at that flux?

**Worked answer.** One-tenth of about 1.1 MW/m² is about **110 kW/m²**, which is 110,000 ÷ 10,000 = **11 W/cm²**. The temperature drop across 0.3 mm of scale at that flux is about 110,000 × 0.0003 ÷ 1.0 ≈ **33 K**.

The critical heat flux margin protects against burnout in clean water; it says nothing about fouling. The 33 K that scale adds at the same flux is a separate limit, set by the element's maximum sheath temperature, and it is often the one that governs. The design therefore sets both: a heat flux comfortably below the critical value, and water treatment or a cleaning interval that keeps the scale, and its temperature rise, within the element's rating.
