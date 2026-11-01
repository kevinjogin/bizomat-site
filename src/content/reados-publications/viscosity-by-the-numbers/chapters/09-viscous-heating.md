---
book: viscosity-by-the-numbers
chapterSlug: viscous-heating
order: 9
title: "Viscous heating and the oil's heat balance"
description: "Turn pressure drops and leaks into heat, calculate the temperature rise across a relief valve, build a hydraulic unit's heat balance with the feedback through viscosity, and size a cooler."
draft: false
---

Every pascal of pressure that oil loses without doing useful work becomes heat in the oil. A pressure drop in a line, a leak past a spool, oil spilling over a relief valve, the shear in a pump's sliding films: each one turns mechanical energy into internal energy, and nothing else. That heat raises the oil's temperature, the higher temperature lowers its viscosity, and the lower viscosity changes the losses that produced the heat. A hydraulic system's running temperature is the point where that loop comes to rest.

This chapter calculates the heating where oil is throttled across a valve, using the WORKOS liquid throttling tool, builds HPU-40's heat balance with the WORKOS hydraulic power unit sizing tool, adds the feedback through viscosity that the simple balance leaves out, and sizes the cooler that ends the summer peak. It ends with the original cooler sizing, which was done at the wrong ambient temperature.

## Where the heat comes from

When oil flows through a restriction that drops its pressure by Δp without driving anything, the energy released per unit volume is Δp. Over a flow Q, the power turned to heat is Q times Δp, exactly the "power lost as heat" that Chapter 7's line sizing tool reports.

```figure
type: formula
title: Heat from a pressure loss
formula: P = Q × Δp
formula: ΔT ≈ Δp ÷ (ρ c_p), for oil flowing through the restriction
caption: The simple temperature rise assumes all the pressure energy stays in the oil passing through. Thermal expansion makes the real rise somewhat smaller, as the next section shows.
- P | heat, W
- Q | flow, m³/s
- Δp | pressure lost, Pa
- ρ, c_p | density, kg/m³, and specific heat, J/(kg·K)
```

This is an illustration. If HPU-40's fixed-displacement pump ever ran with its full 40 L/min spilling over the relief valve at 175 bar, the heat would be 40 ÷ 60,000 × 17.5 × 10⁶ = 11.7 kW, most of the motor's output. With 120 L of oil, that would warm the whole reservoir at about 3.6 K per minute with no cooling at all. This is why fixed-pump circuits that hold pressure for long periods unload the pump to tank at low pressure when the press is idle, and why a relief valve that is set too low, or that leaks across its seat, is one of the commonest causes of hot oil.

## Throttling a liquid: the temperature rise across a valve

The simple estimate Δp ÷ (ρ c_p) is slightly too large. When a liquid is throttled at constant enthalpy, part of the pressure energy goes into the liquid's thermal expansion rather than its temperature, and the true rise is reduced by a factor (1 − Tβ), where T is the absolute temperature and β the volumetric expansion coefficient. For oil at ordinary temperatures, Tβ is about 0.2, so the real rise is about four fifths of the simple estimate. The relation is the Joule–Thomson effect applied to a liquid, and it warms liquids where it cools most gases.

The [liquid throttling temperature rise tool](/tools/liquid-throttling-temperature-rise/) calculates it from the liquid's density, expansion coefficient and specific heat, its temperature before the restriction and the pressure dropped, and checks the rise against a limit.

```figure
type: steps
title: HPU-40's oil across its relief valve at 175 bar
caption: This is an illustration. Inputs: density 848.7 kg/m³, expansion coefficient 700 × 10⁻⁶ per kelvin, specific heat 1.9 kJ/(kg·K), 50 °C before the valve, 175 bar dropped, limit 10 K. No heat is lost to the valve body.
- Pressure energy turned to heat | 17.5 × 10⁶ ÷ 848.7 = 20.6 kJ/kg
- Simple estimate, ignoring expansion | 20.6 ÷ 1.9 = 10.85 K
- Share removed by expansion, Tβ | 323.15 × 0.0007 = 22.6%
- * Temperature rise across the valve | 10.85 × (1 − 0.226) = 8.40 K
- Temperature after the valve | 58.4 °C; verdict: within the 10 K limit
```

Oil leaving the relief valve is 8.4 K hotter than oil entering it, and oil leaking across the pump's pistons at 160 bar is heated by 7.7 K on the way. These local rises are why the oil in a pump's case and in its leakage paths is always hotter than the reservoir, as Chapter 4 warned. They also matter where hot leakage oil reaches seals and where a valve throttles a small flow continuously, because the local temperature can be far above the bulk oil temperature even when the total heat is small.

## HPU-40's heat balance

The heat that the oil must shed is the shaft power that does not end up as useful work at the press. The [hydraulic power unit sizing tool](/tools/hydraulic-power-unit-sizing/), introduced in Chapter 8 for sizing the pump, also estimates the heat load from the share of input power lost and the share of time on load, the heat the reservoir can shed naturally from its surface, and the cooler capacity still needed.

This is an illustration. With 40 L/min at 160 bar, pump efficiencies of 92% volumetric and 90% mechanical, a 120 L reservoir, a quarter of the input power turned to heat while on load and the press on load half the time, the tool gives:

```figure
type: stats
title: HPU-40's heat balance from the hydraulic power unit sizing tool
caption: This is an illustration. The tool estimates a near-cubic reservoir's surface as 6.5 × V^(2/3), with V in cubic metres, and uses the heat transfer coefficient and allowed temperature rise entered.
- 10.7 kW | Hydraulic power | 160 bar × 40 L/min
- 12.9 kW | Shaft power | after both pump efficiencies
- * 1.61 kW | Average heat load | 25% lost × 50% on load
- 1.58 m² | Reservoir surface | 120 L reservoir
- 19.0 W/K | Reservoir dissipation | 12 W/(m²·K) × 1.58 m²
```

The reservoir alone sheds 19.0 W for every kelvin the oil runs above the air. To shed 1.61 kW it would need the oil 85 K above the air, which is why HPU-40, like most power units of its size, has an air-blast oil cooler. The cooler's capacity is usually expressed the same way, in watts per kelvin of difference between oil inlet and air.

## The feedback through viscosity

The tool's heat load is a single number, but part of it depends on the oil's temperature. Chapter 8 found that the pump's leakage, inversely proportional to viscosity, is 3.5 L/min at 50 °C and 6.1 L/min at 65 °C. At 160 bar and half the time on load, that leakage alone puts 0.47 kW into the oil at 50 °C and 0.81 kW at 65 °C. Hotter oil leaks more and so makes more heat.

The equilibrium temperature is where the heat made equals the heat shed: the air temperature plus the heat load divided by the total conductance of reservoir and cooler. Because the heat load rises with temperature, the equilibrium must be found by trial, or by a few lines of spreadsheet iteration.

This is an illustration. HPU-40's existing cooler has a capacity of 54.2 W/K, which with the reservoir gives a total of 73.2 W/K. On a typical day, with the factory air at 28 °C, the balance settles at 50.0 °C with a heat load of 1.61 kW. On a summer afternoon with the air at 38 °C, it settles at 64.6 °C, with the heat load risen to 1.95 kW, because the hot oil leaks more.

```figure
type: compare
title: HPU-40's oil temperature with the existing and the upgraded cooler
cols: Total conductance | Typical day, air 28 °C | Summer afternoon, air 38 °C
rowhead: Cooling
- * Existing cooler, 54.2 W/K, plus reservoir | 73.2 W/K | 50.0 °C | 64.6 °C
- Upgraded cooler, 81.7 W/K, plus reservoir | 100.7 W/K | 42.8 °C | 55.0 °C
caption: This is an illustration. Heat load 1.61 kW at 50 °C, with the leakage share of 0.47 kW scaled inversely with dynamic viscosity; equilibrium found by iteration.
```

Without the feedback, the summer rise would have been 1.61 kW ÷ 73.2 W/K = 22 K above 38 °C, giving 60 °C rather than 64.6 °C. The loop adds about 4.6 K on the hottest afternoons, a modest amount, but it comes on top of an already thin viscosity margin and is part of why hot systems tend to run away.

## Sizing the cooler

The upgrade aims to hold the oil at no more than 55 °C on the hottest afternoon. At 55 °C the heat load is 1.71 kW, so the total conductance needed is 1.71 kW ÷ (55 − 38) K = 100.7 W/K. Subtracting the reservoir's 19.0 W/K leaves 81.7 W/K for the cooler, half as much again as the existing 54.2 W/K.

The tool gives a slightly different figure. Entering an allowed rise of 17 K, it reports a cooler capacity of 1.29 kW, because it uses the 1.61 kW heat load evaluated at its stated efficiencies and does not know that the leakage rises as the oil warms. Dividing 1.29 kW by 17 K gives 75.8 W/K, about 7% less than the 81.7 W/K found with the feedback. For a first estimate the tool's number is useful; for the final selection, the press shop evaluated the heat load at the target temperature, which is the simplest way to include the feedback.

With the upgraded cooler, the oil runs at 42.8 °C on a typical day and 55.0 °C at the summer peak. Chapter 4's grade check then shows VG 46 at 24.7 mm²/s at the peak, comfortably inside the preferred band, and Chapter 8's leakage falls to 4.26 L/min, restoring most of the press's summer speed.

```figure
type: checklist
title: Keeping a hydraulic system's oil temperature in hand
caption: Most hot-oil problems are solved by removing heat sources before adding cooling.
- Unload fixed pumps when idle | Pressure held over a relief valve turns the full flow into heat
- Check the relief valve setting and seat | A low setting or a leaking seat is a constant heat source
- Size the cooler at the hottest air temperature | And for the heat load at the target oil temperature
- Keep the cooler clean | Fouled fins can halve an air-blast cooler's capacity
- x Treat a hot system with thicker oil | It adds line and friction losses; Chapter 4 explains why it moves the problem
- ? Ask what the oil temperature is at the pump case | It runs hotter than the reservoir by the throttling rise of the leakage
```

## The error: a cooler sized for an average day

This is an illustration. When HPU-40 was installed, the installer sized its cooler for an oil temperature of 50 °C with the factory at 28 °C, the average summer day in the installer's design notes. The heat load was 1.61 kW, so the total conductance needed was 1.61 kW ÷ 22 K = 73.2 W/K, and subtracting the reservoir gave the 54.2 W/K cooler that was fitted. The calculation was arithmetically correct, and on an average day the oil does run at 50 °C.

The error was in the choice of design condition. A cooler has to cope with the hottest air it will see, not the average, and on the press shop's hottest afternoons the air reaches 38 °C. Ten kelvin more air temperature, plus the extra leakage heat from the hotter oil, took the oil to 64.6 °C, close to the edge of the pump maker's preferred band. The press shop found it by plotting the reservoir temperature against the air temperature from its building management records over a summer: the points lay on a line that matched the heat balance, which confirmed that the cooler was undersized rather than faulty or fouled.

The fix was the 81.7 W/K cooler sized above. The installer's method was fine; the input was wrong. The press shop now gives every equipment supplier a design air temperature for its site, taken from the hottest days in its own records rather than an average, and asks for the heat load at the target oil temperature, not at a convenient one.

## The other end: keeping oil warm overnight

The same heat balance sizes the reservoir heater that Chapter 7's cold-start fix relies on. Overnight, with the pump stopped and the cooler's fan off, the oil loses heat mainly through the reservoir's surface, at the 19.0 W/K the tool estimated, plus a little through the lines and the cooler's core.

This is an illustration. To hold the oil at 20 °C with the factory air at 5 °C, the reservoir loses 19.0 × 15 = 285 W. A thermostatically controlled heater of 500 W, allowing for the lines and a margin, holds the oil there. Bringing the oil up from 5 °C instead would take much longer: 120 L of oil at 876 kg/m³ and 1.9 kJ/(kg·K) needs 200 kJ per kelvin, and with perhaps 69 kJ per kelvin for the steel of the reservoir and its fittings, warming by 15 K with the heater's net 0.5 kW takes over two hours. Holding a temperature overnight is far cheaper than recovering it in the morning, and it keeps the filter from bypassing at every start.

Immersion heaters for oil need a low surface power density so that the oil touching the element does not overheat and oxidise, which is a further reason to keep them small and on all night rather than large and on briefly. The heater's maker states the power density suitable for mineral oil, and the heater needs a thermostat and an interlock against running with the element uncovered.

## Viscous heating in films and bearings

The same physics heats every oil film. In a film of thickness h sheared at speed U, the power dissipated per unit area is μU² ÷ h. Chapter 1's press gib, at 0.1 m/s with a 0.05 mm film at 40 °C, dissipates 0.03932 × 0.1² ÷ 0.00005 = 7.9 W per square metre, or 0.16 W over its 0.02 m²: nothing. A journal bearing turning at 6.2 m/s with a 0.06 mm clearance dissipates hundreds of watts, because the power rises with the square of the speed. That heat is the central problem of the companion book, Plain Bearings by the Numbers, whose bearings must reach a temperature where the heat made in their film balances the heat carried away by oil and housing, the same loop as HPU-40's.

## Bringing it together

Every pressure loss becomes heat at a rate of flow times pressure drop. A liquid throttled across a valve warms by Δp ÷ (ρ c_p) reduced by the factor (1 − Tβ), which for HPU-40's oil at 175 bar is 8.4 K. The system's running temperature is set by the heat load and the conductance of reservoir and cooler, and because hot oil leaks more, the heat load rises with temperature. Coolers must be sized for the hottest air and the heat load at the target temperature. With the oil's temperature under control, the last chapter uses viscosity to watch the oil itself age.

## Exercise: a relief valve that leaks

During the summer survey the press shop found that HPU-40's relief valve was leaking 1.5 L/min across its seat whenever the system was at 160 bar, half the time. Find the average heat this adds to the oil, the temperature rise of the leaking oil across the seat at 50 °C, and the effect on the summer peak temperature with the existing cooler, ignoring any change in the pump's leakage.

**Worked answer.** This is an illustration. The heat while leaking is 1.5 ÷ 60,000 × 16 × 10⁶ = 400 W, so the average over half the time is **200 W**. The leaking oil warms by (1 − 0.226) × 16 × 10⁶ ÷ (848.7 × 1,900) = **7.7 K** across the seat, which the liquid throttling tool confirms. With the existing cooler's total of 73.2 W/K, an extra 200 W raises the equilibrium by 200 ÷ 73.2 = **2.7 K**, before the feedback through the pump's leakage adds a little more. Repairing the valve seat was cheaper than any cooler and was done first.
