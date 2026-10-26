---
book: heat-exchangers-by-the-numbers
chapterSlug: film-coefficients-from-correlations
order: 5
title: "Film coefficients from correlations"
description: "Estimate film coefficients from Reynolds, Prandtl and Nusselt numbers: turbulent and laminar tube flow, the shell side, wall viscosity, and catch an oil coefficient taken at the wrong temperature."
draft: false
---

A film coefficient describes how readily heat passes between a flowing fluid and a wall. It depends on the fluid's properties, its velocity, the geometry of the passage and whether the flow is smooth or turbulent, and it cannot be looked up as a single number for a fluid. It is estimated from **correlations**: relationships between dimensionless groups, fitted to experiments over stated ranges, which turn a fluid's properties and a passage's geometry into a coefficient. Used inside their ranges and with the right properties, they give coefficients within about 10 to 25%. Used outside them, or with properties at the wrong temperature, they can be wrong by a factor.

This chapter introduces the three dimensionless groups, applies the classic turbulent tube correlation to OC-35's water side, explains why laminar flow behaves so differently, outlines how shell-side coefficients are estimated, and shows how strongly an oil's viscosity, and so its temperature, controls its coefficient. The running case finds that OC-35's oil-side coefficient was first estimated with the oil's viscosity at 100 °C, read from the wrong column of its data sheet, which overstated the coefficient by about 38% and undersized the exchanger by about 21%.

## Three dimensionless groups

Correlations are written in three dimensionless numbers, each with a physical meaning.

- The **Reynolds number**, Re = v × D ÷ ν, compares the fluid's inertia with its viscosity. Below about 2,300 in a tube, flow is laminar, smooth and orderly; above about 10,000 it is fully turbulent; between, it is transitional and unpredictable.
- The **Prandtl number**, Pr = μ × c_p ÷ k, compares how quickly momentum and heat diffuse in the fluid. Water at around 30 °C has a Prandtl number of about 5; oils have hundreds; gases about 0.7.
- The **Nusselt number**, Nu = h × D ÷ k, is the film coefficient in dimensionless form: how much better the flowing fluid transfers heat than pure conduction through a layer of thickness D would.

A correlation gives Nu from Re and Pr, and the coefficient follows as h = Nu × k ÷ D.

## Turbulent flow in tubes

The best-known correlation for fully turbulent flow inside smooth tubes is usually attributed to Dittus and Boelter, from work on automobile radiators published in 1930.

```figure
type: formula
title: Turbulent flow in a tube, Dittus–Boelter form
formula: Nu = 0.023 × Re^0.8 × Pr^n, with n = 0.4 when the fluid is heated and 0.3 when it is cooled
caption: This is an illustration for OC-35's tower water at about 31.5 °C in 10.9 mm tubes at 1.2 m/s, with illustrative properties ν ≈ 0.78 × 10⁻⁶ m²/s, k ≈ 0.618 W/(m·K) and Pr ≈ 5.3. The correlation is commonly used for Re above about 10,000 and Pr from about 0.6 to 160, in tubes long compared with their diameter.
- Re | v × D ÷ ν
- Pr | Fluid's Prandtl number at the bulk temperature
- Nu | h × D ÷ k
step: Re ≈ 1.2 × 0.0109 ÷ 0.78 × 10⁻⁶ ≈ 16,770, fully turbulent
step: Nu ≈ 0.023 × 16,770^0.8 × 5.3^0.4 ≈ 107.4
step: h ≈ 107.4 × 0.618 ÷ 0.0109 ≈ 6,090 W/(m²·K)
```

The exponent of 0.8 on the Reynolds number is the reason velocity is the designer's main lever on a turbulent film: doubling the velocity raises the coefficient by about 2^0.8 ≈ 1.74, as Chapter 4's doubled water flow did. Other correlations, notably Gnielinski's, are more accurate over a wider range and in the transitional region, and modern software uses them, but the Dittus–Boelter form shows the dependences clearly.

## Laminar flow

In laminar flow, there is no turbulent mixing to carry heat across the passage; heat crosses the slowly sliding layers by conduction alone. Far from the inlet, in **fully developed** laminar flow, the Nusselt number settles to a constant, about 3.66 for a tube with a uniform wall temperature and about 4.36 for a uniform heat flux, independent of velocity. Near the inlet, where the temperature profile is still developing, the coefficient is higher, and correlations for that region depend on the **Graetz number**, Re × Pr × D ÷ L, which grows with the tube's length in diameters. Viscous fluids in tubes, such as oil, are often laminar, and their coefficients are then low and much less sensitive to velocity than turbulent ones.

The practical consequence is that a turbulent correlation must never be applied to laminar flow. The Reynolds number is calculated first, and the correlation chosen to suit it.

## The shell side

The shell side of a baffled shell-and-tube exchanger is far more complex than a tube: the fluid crosses the tube bundle between baffles, turns in the windows where the baffles are cut, and partly leaks and bypasses, as Chapter 3 described. Simple shell-side correlations, such as the one Kern published in 1950, estimate the coefficient from a Reynolds number based on the flow area across the bundle and an equivalent diameter, typically in the form Nu = 0.36 × Re^0.55 × Pr^(1/3) × (μ ÷ μ_w)^0.14. More detailed methods, of which the Bell–Delaware method is the best known, correct an ideal crossflow coefficient for each leakage and bypass stream, and exchanger makers use their own validated versions. For OC-35, the shell-side oil coefficient of about **450 W/(m²·K)** used in this book stands for such a calculation.

## Wall viscosity

Oils' viscosity changes sharply with temperature, and the oil touching a cooled wall is cooler, and more viscous, than the oil in the bulk. Chapter 4 found OC-35's oil-side wall surface about 16 K cooler than the bulk oil at the hot end. The thicker oil next to the wall lowers the coefficient, and correlations for viscous fluids include a correction factor, commonly (μ ÷ μ_w)^0.14, where μ_w is the viscosity at the wall temperature. For water it is negligible; for oil being cooled it reduces the coefficient by several per cent, and for very viscous fluids by much more.

## Properties at the right temperature

Every property in a correlation is taken at a stated temperature, usually the fluid's bulk temperature, the average of its inlet and outlet. For water, properties change slowly with temperature and a few kelvin's error matters little. For oil, viscosity changes greatly: an oil's data sheet typically gives its kinematic viscosity at 40 °C and at 100 °C, and the viscosity at the bulk temperature must be found between them, from the supplier's viscosity–temperature chart or a standard interpolation method.

```figure
type: compare
title: Illustrative properties of an ISO VG 46 hydraulic oil
cols: Kinematic viscosity | Where it applies
caption: This is an illustration. ISO VG 46 denotes a nominal kinematic viscosity of 46 mm²/s at 40 °C; the other values are typical of such an oil and stand for the supplier's data. OC-35's bulk oil temperature is about 50 °C.
- At 40 °C, data sheet | 46 mm²/s | The grade's reference temperature
- *At 50 °C, from the viscosity chart | About 30 mm²/s | OC-35's bulk oil, for its coefficient
- At 100 °C, data sheet | About 6.8 mm²/s | Nowhere in OC-35
```

## The error: viscosity from the wrong column

This is an illustration. OC-35's first thermal estimate, prepared in a spreadsheet, took the oil's viscosity from its data sheet. The sheet had two columns, 40 °C and 100 °C, and the spreadsheet's formula picked up the 100 °C value, about **6.8 mm²/s**, instead of interpolating to the bulk temperature's **30 mm²/s** or so. With viscosity about 4.4 times too low, the shell-side Reynolds number was 4.4 times too high and the Prandtl number 4.4 times too low. In a correlation of the form Re^0.55 × Pr^(1/3), the coefficient scales with viscosity to about the power −0.22, so the estimate came out about **1.38 times** too high: about 621 W/(m²·K) instead of 450.

Because the oil side controls OC-35, the overall coefficient rose from about 349 to about 444 W/(m²·K), and the area calculated fell from about 5.6 to about **4.4 m²**, about 21% too small.

```figure
type: bars
title: OC-35: what the viscosity error did, at the same 35 kW duty
unit: m²
max: 6
caption: This is an illustration. With the oil's viscosity taken at 100 °C, the estimate called for about 4.4 m²; the duty needs about 5.6 m². Built at 4.4 m², the cooler would let the oil settle about 5 K hotter.
- *Area needed, viscosity at 50 °C | 5.59
- Area estimated, viscosity at 100 °C | 4.40
```

An exchanger built to 4.4 m² would have transferred only about 29.6 kW with oil entering at 55 °C; at the full 35 kW, the oil would have settled with about 59.7 °C entering and 49.7 °C leaving, about 5 K above its target, every day of production. The check that caught it was a sanity check on the overall coefficient: an oil-to-water cooler with a service coefficient above about 400 W/(m²·K) on plain tubes looked high to a reviewer who had seen many, and tracing it back found the viscosity. The general lesson is that a correlation's answer is only as good as the properties fed to it, and that for oils the viscosity must be taken at the actual temperature, with the wall correction applied.

## Natural convection

The correlations above are for **forced convection**, where a pump or fan drives the fluid. Where nothing drives it, as in a heating coil in an unstirred tank, a tank's wall losing heat to still air, or an exchanger's shell sitting in a room, the fluid moves only because warm fluid rises and cool fluid sinks. That is **natural convection**, and its coefficients are usually much lower than forced convection's for the same fluid. Its correlations use the **Grashof** or **Rayleigh** number, which compares buoyancy with viscosity, in place of the Reynolds number. A coil heating an unstirred tank of oil, for example, may have an outside coefficient of only tens of W/(m²·K), and adding a stirrer that turns the outside film into forced convection can raise it several times. *Heat Transfer by the Numbers* works through natural convection from surfaces, and the same reasoning applies whenever an exchanger relies on a fluid that is not pumped past it.

## Where the properties come from

A correlation needs four properties for each fluid at its temperature: density, viscosity, specific heat and thermal conductivity. For water and steam, internationally agreed formulations of their properties are published and built into most engineering software, and printed tables give them to more accuracy than any exchanger calculation needs. For oils, the supplier's data sheet and viscosity–temperature chart are the source; oils of the same grade from different suppliers can differ noticeably in viscosity at a given temperature, and their specific heat and conductivity are often given only as typical values. Glycol solutions, brines and process fluids each need their own data at their concentration. A property used in a design should have its source written beside it, so that a reviewer can check it and a later engineer can update it if the fluid changes.

## Raising a coefficient

When a film controls an exchanger, as OC-35's oil film does, several measures raise its coefficient, each with a cost in pressure drop:

- **Higher velocity**, by more passes, closer baffle spacing or fewer tubes, which raises Re;
- **Turbulence promoters**, such as twisted tapes or wire inserts in tubes, which disturb laminar or transitional flow and are especially effective for viscous fluids in tubes;
- **Enhanced surfaces**, such as low-finned, corrugated or internally ribbed tubes, which add area and disturb the boundary layer;
- **Corrugated plates**, in plate exchangers, whose chevron patterns make the flow turbulent at low Reynolds numbers, which is why plate exchangers achieve high coefficients with viscous fluids, as Chapter 8 discusses.

Each gain in coefficient comes with a rise in pressure drop, usually faster than the gain, and Chapter 9 sets out how to weigh them.

## A sanity check from experience

A calculated coefficient should be compared with experience before it is used. The comparison can be with published typical ranges for the service, with the measured U × A of a similar exchanger already on the plant, divided by its area, or with a maker's rating for a similar duty. A coefficient well outside experience is not necessarily wrong, but it needs a reason. OC-35's viscosity error was caught that way: the calculated service coefficient for a plain-tube oil cooler was higher than the reviewer had seen in similar units, and the question "why?" led to the wrong column of the data sheet.

## How accurate are correlations?

Correlations are fits to experiments, and their scatter is typically 10 to 25%, more for the shell side of a real exchanger with its leakage paths, and more again in transitional flow. That uncertainty is one reason exchangers are designed with a margin, though the fouling allowance of Chapter 6 should not be used to cover it silently. A designer who knows that a coefficient is uncertain by 20% should say so and decide the margin explicitly; one who buries it in a fouling factor loses track of both, and cannot later tell whether a disappointing exchanger is dirty or was simply optimistic from the start.

## Exercise: oil in the tubes

An alternative design puts the oil in the tubes, at about 1 m/s in 10.9 mm tubes, with the oil's viscosity at its bulk temperature of about 30 mm²/s. What is the tube-side Reynolds number? Which kind of correlation applies, and why would doubling the oil velocity help less than it would for water?

**Worked answer.** Re ≈ 1.0 × 0.0109 ÷ 30 × 10⁻⁶ ≈ **363**, far into the laminar range. A laminar correlation applies, with a developing-flow correction for tubes a couple of metres long: with a Prandtl number of a few hundred, the Graetz number is large and the coefficient is set mainly by the thermal entrance region.

In laminar developing flow, the coefficient grows roughly with the cube root of the Graetz number, and so of the velocity, so doubling the velocity raises it by only about 2^(1/3) ≈ 1.26, against 1.74 for turbulent water. That, and the oil's very high pressure drop in small tubes, is why oil coolers usually put the oil on the shell side, where baffles create crossflow and higher coefficients for the same pressure drop.
