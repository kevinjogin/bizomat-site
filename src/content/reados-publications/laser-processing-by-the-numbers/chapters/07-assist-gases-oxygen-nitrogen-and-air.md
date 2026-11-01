---
book: laser-processing-by-the-numbers
chapterSlug: assist-gases-oxygen-nitrogen-and-air
order: 7
title: "Assist gases: oxygen, nitrogen and air"
description: "What oxygen, nitrogen and compressed air each do in a laser cut, the heat from burning iron, nozzle gas flow, and supplying nitrogen from cylinders, bulk liquid or a generator."
draft: false
---

The gas that flows through a laser cutting nozzle does three jobs. It blows the molten metal out of the bottom of the kerf. It either reacts with the hot metal, adding heat, or shields it from the air. And it keeps spatter and fume away from the protective window. The choice between oxygen, nitrogen and compressed air decides the cutting speed in thick steel, the colour and condition of the cut edge, and a running cost that, for nitrogen, can rival the electricity bill.

This chapter quantifies each gas for the LC-4: the heat from burning iron in an oxygen cut, the nitrogen flow through a nozzle, and the cost of supplying nitrogen from cylinders, a bulk liquid tank or an on-site generator. Its mistake is a generator trial that saved money and spoiled the doors.

## Three gases, three jobs

```figure
type: compare
title: Assist gases on the LC-4
cols: Pressure at the nozzle | Flow | What it does | Edge
rowhead: Gas
- Oxygen | 0.5 to 1 bar for thick mild steel | Low | Burns iron in the kerf, adding heat; low pressure is enough because the reaction helps eject the melt | Oxidised, dark, slightly rough; oxide layer on the face
- Nitrogen | 10 to 20 bar | High | Inert; blows the melt out by momentum alone; shields the hot edge | Bright, oxide-free; ready for welding or visible use on stainless steel and aluminium
- Compressed air | 10 to 16 bar | High | About 78% nitrogen and 21% oxygen; partly inert, partly reactive | Light oxide; acceptable on thin mild steel and aluminium for painted parts
caption: General guide for a fibre laser cutting machine; the laser maker's process tables give pressures and nozzles for each material and thickness.
```

## Oxygen: the iron fire

When oxygen meets iron at cutting temperatures, the iron burns. The simplest reaction, iron to iron(II) oxide, FeO, releases about 272 kJ for every mole of iron, which is 272 ÷ 0.05585 = 4.87 MJ per kilogram of iron burned. For comparison, Chapter 6's figure for heating and melting steel is about 7.5 J/mm³, or roughly 0.95 MJ/kg. Burning a kilogram of iron releases about five times the energy needed to melt a kilogram.

In the 6 mm grade 350 bracket cut at 2.6 m/min with a 0.45 mm kerf, the metal leaves the kerf at v t w ρ = 43.3 × 6 × 0.45 × 7,850 × 10⁻⁹ = 0.918 g/s. Not all of it burns; much leaves as molten iron blown out before it can react. If 40% to 60% of the kerf metal is oxidised, an assumed range for illustration, the reaction adds:

```figure
type: formula
title: Heat added by burning iron in an oxygen cut
formula: Q_ox = f × v t w ρ × ΔH
caption: This is an illustration. f is the share of the kerf metal oxidised, assumed 0.4 to 0.6; ΔH = 4.87 MJ/kg for iron to FeO. Kerf mass rate 0.918 g/s for the 6 mm bracket.
- Q_ox at f = 0.4 | 0.4 × 0.000918 kg/s × 4.87 × 10⁶ J/kg = 1,790 W
- Q_ox at f = 0.6 | 0.6 × 0.000918 × 4.87 × 10⁶ = 2,680 W
```

Set against the 2.8 kW the laser contributes in the kerf, the oxygen provides between 39% and 49% of the total heat. That is why a 4 kW fibre laser cuts 6 mm mild steel with oxygen at 2.6 m/min but needs much more power to cut it with nitrogen at a similar speed, and why oxygen cutting of thick mild steel needs only modest laser power. The price is the edge: a layer of iron oxide on the cut face, which flakes under some paints and must be removed before welding where weld quality matters. The reaction also makes the process less controllable on very thin sheet and around sharp corners, where the burning can run ahead of the beam and leave a ragged edge.

Oxygen use is small, because the pressure is low and the nozzle bore moderate. The LC-4 draws its oxygen from a manifolded cylinder pack, which lasts weeks.

## Nitrogen: flow and pressure

Nitrogen does not react, so it must clear the melt by momentum. That needs high pressure, and through a nozzle at high pressure the flow is choked: the gas reaches the speed of sound at the nozzle's narrowest point, and the mass flow depends only on the upstream pressure, the gas, its temperature and the nozzle bore.

```figure
type: formula
title: Choked mass flow of gas through a nozzle
formula: ṁ = C_d A p₀ √(γ ÷ (R T₀)) × (2 ÷ (γ + 1))^((γ + 1) ÷ (2(γ − 1)))
caption: Valid when the absolute upstream pressure is above about 1.9 times the absolute downstream pressure for nitrogen or air. For nitrogen, γ = 1.4 and R = 296.8 J/(kg·K). Flow rises in proportion to the nozzle area and the absolute pressure.
- ṁ | mass flow, kg/s
- C_d | discharge coefficient, about 0.85 assumed for a laser nozzle
- A | nozzle bore area, m²
- p₀, T₀ | absolute pressure and temperature upstream, Pa and K
```

```figure
type: compare
title: Nitrogen flow through LC-4 nozzles, choked flow, C_d = 0.85, gas at 20 °C
cols: Pressure | Mass flow | Volume at 15 °C, 1 atm | Volume flow
rowhead: Nozzle bore
- 1.5 mm | 15 bar | 20.1 kg/h | 17.0 m³/h | 283 L/min
- * 2.0 mm | 15 bar | 35.7 kg/h | 30.2 m³/h | 503 L/min
- 2.0 mm | 12 bar | 29.0 kg/h | 24.5 m³/h | 409 L/min
- 3.0 mm | 15 bar | 80.4 kg/h | 67.9 m³/h | 1,131 L/min
caption: This is an illustration. Gauge pressures; flow uses the absolute pressure. A 3 mm nozzle uses 2.25 times the gas of a 2 mm nozzle at the same pressure.
```

A 2 mm nozzle at 15 bar uses about 30 m³ of nitrogen an hour while the gas is on. The nozzle bore and pressure are set by the thickness: thicker stainless needs larger nozzles and higher pressures to clear a longer kerf. A nozzle one size larger than the job needs wastes gas in proportion to its area, which is the first thing to check when nitrogen use rises.

## Supplying nitrogen

The LC-4 runs nitrogen for about 2,000 hours a year with the gas on, mostly with the 2 mm nozzle at 15 bar, so it uses about 30 × 2,000 = 60,000 m³ a year. There are three ways to supply that.

### Cylinders

A pack of twelve 50 L cylinders filled to 200 bar holds a lot of gas, but not a day's cutting. The [gas cylinder contents and duration tool](/tools/gas-cylinder-real-gas-duration/) calculates the contents with the Peng–Robinson equation of state, because at 200 bar nitrogen is not an ideal gas.

```figure
type: steps
title: A 12-cylinder nitrogen pack in the gas cylinder contents and duration tool
caption: This is an illustration. 600 L water capacity, 200 bar g, usable down to 20 bar g to keep the regulator above the cutting pressure, 20 °C, nitrogen (molar mass 28.014 g/mol, critical temperature 126.2 K, critical pressure 33.98 bar, acentric factor 0.037), use 500 L/min at 15 °C.
- Compressibility factor Z now / at 20 bar g | 1.0228 / 0.9909
- Gas in the pack now | 135.5 kg; the ideal gas law would say 138.6 kg, 2.3% too much
- Usable gas down to 20 bar g | 120.9 kg = 102,051 standard litres
- * Running time at 500 L/min | 3.4 h against the 8 h needed: RUNS OUT TOO SOON
```

A pack lasts 3.4 hours of continuous gas flow, or about 5.7 hours of a shift in which the gas is on 60% of the time. Cylinder packs suit low or occasional use; for a production laser cutting stainless steel daily they mean several pack changes a week and a high price per cubic metre.

### Bulk liquid

The LC-4 is supplied from a rented vacuum-insulated tank of liquid nitrogen, with an ambient evaporator that turns the liquid into gas and a pressure-building circuit that keeps the supply at about 20 bar. The gas supplier fills the tank by tanker. The cell pays for gas and for tank rental: assumed for illustration at A$0.30 a cubic metre and A$6,000 a year, both excluding GST, A$24,000 a year for 60,000 m³, or A$0.40 a cubic metre all in.

### An on-site generator

A pressure swing adsorption generator separates nitrogen from compressed air by passing the air through beds of carbon molecular sieve that adsorb oxygen faster than nitrogen. Its running cost is mostly the electricity for the air compressor, and that depends strongly on the purity required: the purer the nitrogen, the more air must be compressed for each cubic metre of product.

The [nitrogen or oxygen generator energy check tool](/tools/gas-generator-energy-check/) compares a generator's specific energy with the thermodynamic minimum work of separation and gives its yearly energy cost. A generator supplier offered the cell a unit with two operating points.

```figure
type: compare
title: Generator operating points in the generator energy check tool, 30 m³/h for 2,000 h a year
cols: Oxygen in product | Air factor | Specific energy | Second-law efficiency | Yearly energy | Yearly cost at A$0.28/kWh
rowhead: Purity
- 99.5% nitrogen | 0.5% | 2.6 | 0.25 kWh/m³ | 3.39% | 15,000 kWh | A$4,200
- 99.99% nitrogen | 0.01% | 4.5 | 0.42 kWh/m³ | 1.94% | 25,200 kWh | A$7,056
caption: This is an illustration. Supplier's assumed figures; flows at 0 °C and 1 atm as the supplier quotes them; electricity price excluding GST. The tool confirms both are well above the thermodynamic minimum, so neither claim is impossible.
```

The low second-law efficiencies are normal for small gas separation plants; the tool's purpose is to catch a claim that is below the thermodynamic minimum, which would mean an error in the units or the basis. Here the claims are plausible.

The generator would cost A$95,000 installed, last ten years, be worth A$10,000 at the end and cost A$3,000 a year to maintain. The [equipment investment appraisal tool](/tools/investment-appraisal/) compares it with bulk supply at the cell's 9% hurdle rate.

```figure
type: compare
title: The generator against bulk liquid, in the investment appraisal tool
cols: Running cost a year | Net yearly saving | Net present value at 9% | Internal rate of return | Simple payback
rowhead: Generator purity
- 99.5% nitrogen | A$7,200 | A$16,800 | A$17,041 | 12.77% | 5.65 years
- 99.99% nitrogen | A$10,056 | A$13,944 | −A$1,288 | 8.71% | 6.81 years
caption: This is an illustration. Purchase A$95,000, salvage A$10,000, 10 years; saving is the bulk cost of A$24,000 a year less the generator's energy and maintenance. Before tax; all amounts excluding GST.
```

At 99.5% the generator pays: positive net present value, a 12.77% return. It just misses the cell's five-year payback rule, at 5.65 years. At 99.99%, it does not pay at all.

### The mistake: tinted doors

Encouraged by the 99.5% figures, the cell borrowed a demonstration generator for two weeks and set it to 99.5%. Mild steel and aluminium cut perfectly well. The stainless steel doors came off with a faint straw-yellow tint along every cut edge. The customer's specification called for bright, oxide-free edges on visible faces, and the first delivery was rejected.

The tint was oxide. At 99.5%, every cubic metre of nitrogen carries 0.5% oxygen, enough to form a thin oxide film on stainless steel at cutting temperatures. The demonstration was ended, the doors were recut with bulk nitrogen and the trial's lesson recorded: purity is a property of the job, not of the gas supply. The doors need 99.99% or better; at that purity the generator does not pay. The cell stayed with bulk liquid and filed the analysis to be re-run if its stainless volume grows enough to change the answer.

### When the generator would pay

The analysis can be turned round to find the volume at which a 99.99% generator would pay. With bulk nitrogen at A$0.30 a cubic metre plus A$6,000 a year rental, and the generator's energy at 0.42 kWh/m³ × A$0.28 = A$0.1176 a cubic metre plus A$3,000 a year maintenance, each cubic metre switched to the generator saves A$0.1824, and the fixed costs differ by A$3,000 a year in the generator's favour. A net present value of zero at 9% over ten years needs a net yearly saving of A$14,145, which is reached at about 61,100 m³ a year, only 2% above the present use. The cell's five-year payback rule needs A$19,000 a year, which is reached at about 87,700 m³. The case therefore hangs on growth and on the payback rule, and the cell recorded both thresholds so that the decision can be revisited when its stainless work grows by about half.

## Compressed air

Compressed air is the cheapest assist gas, because the cell makes it. Cutting with air gives an edge with a light oxide film, acceptable on thin mild steel and aluminium parts that will be painted or powder-coated. It needs air at about 16 bar g, more than the 7 bar of a workshop air system, so the LC-4 has its own two-stage booster compressor with a refrigerated dryer and fine oil filters, because oil or water reaching the cutting head contaminates the optics.

The [air compressor power tool](/tools/compressor-power/) gives the power for 0.6 m³/min of free air delivered at 16 bar g in two intercooled stages at 70% overall efficiency: an isothermal power of 2.86 kW, adiabatic 3.52 kW and a shaft power of 5.03 kW, a specific power of 8.38 kW per m³/min. At A$0.28 a kilowatt-hour, that is about A$1.41 for each hour the gas is on, against about A$12 for an hour of nitrogen at 30 m³ and A$0.40 a cubic metre.

```figure
type: bars
title: Gas cost per hour with the gas on, LC-4
x: Gas and supply
y: Cost per gas-on hour, A$ excluding GST
caption: This is an illustration. Nitrogen at 30 m³/h: bulk A$0.40/m³ including rental; generator at 99.5%, energy only, 0.25 kWh/m³ at A$0.28. Air: compressor shaft power 5.03 kW at A$0.28. Generator and compressor capital and maintenance are not included.
- Nitrogen, bulk liquid | 12.00
- Nitrogen, generator at 99.5%, energy only | 2.10
- * Compressed air, energy only | 1.41
```

## Getting the gas to the nozzle

The pressure that matters is the pressure in the cutting head, not at the tank. At 30 m³/h, a long or narrow supply line loses pressure, and the loss grows as the square of the flow, so it is worst on the jobs that need the most gas. The LC-4's commissioning included a check of the head pressure with the largest nozzle flowing, and the cell repeats it whenever the supply line is altered. A regulator that reads 15 bar at the tank while the head sees 13 bar will produce dross that no parameter change will cure.

Gas quality matters as well. Nitrogen evaporated from liquid is extremely dry and clean. Generator nitrogen and compressed air carry whatever moisture and oil the compressor, dryer and filters let through, and the cutting head's maker specifies the dew point and oil content the head will tolerate. Filters are changed on a schedule, and a cutting head that starts fogging its protective window soon after a filter change is the first sign of a problem upstream.

The nozzle itself shapes the gas jet. The LC-4 holds the nozzle about 0.7 mm above the sheet for nitrogen cuts; a larger stand-off lets the jet spread and lose pressure before it enters the kerf, and a damaged nozzle bore throws the jet to one side, which shows up as a direction-dependent cut, as Chapter 3 noted.

## Gas safety

Each gas brings its own hazard. Nitrogen is not toxic, but in a poorly ventilated space a leak displaces air, and an oxygen-depleted atmosphere gives no warning before it causes collapse. The bulk tank stands outside, its relief valves vent away from the building, and the laser room's ventilation is sized so that a leak from the head's supply cannot build up. Liquid nitrogen at about −196 °C causes cold burns, and only the gas supplier's trained drivers fill the tank. Oxygen makes fires burn far more fiercely: oxygen-enriched clothing ignites easily, so oxygen is never used to blow down clothing or benches, its fittings are kept free of oil and grease, and cylinders are restrained and stored away from fuel gases. These controls belong in the cell's risk assessment alongside the laser hazards of Chapter 10.

## Exercise: the smaller nozzle

For thin stainless sheet, the LC-4 can use a 1.5 mm nozzle at 15 bar. Using the choked-flow table, what nitrogen flow does it use? If the cell ever had to fall back on the 12-cylinder pack during a bulk tank outage, how long would the pack last with the gas on continuously? Use the gas cylinder contents and duration tool with the same pack.

### Answer

The table gives 17.0 m³/h at 15 °C for a 1.5 mm nozzle at 15 bar, 283 L/min. Flow scales with the nozzle area, so the 1.5 mm nozzle uses (1.5 ÷ 2.0)² = 0.5625 of the 2 mm nozzle's 30.2 m³/h, which agrees.

With the use rate set to 283 L/min, the gas cylinder contents and duration tool gives the same 102,051 standard litres of usable gas and a running time of 6.01 hours, still short of an 8-hour shift: RUNS OUT TOO SOON. With the gas on 60% of the time, the pack would last about ten hours, a little over one shift. For an outage, the cell would plan one pack per shift and keep thin stainless jobs, which can use the small nozzle, at the front of the queue.
