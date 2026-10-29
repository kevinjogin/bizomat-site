---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: gas-turbines-and-the-brayton-cycle
order: 6
title: "Gas turbines and the Brayton cycle"
description: "How a gas turbine turns fuel into shaft power: the Brayton cycle, pressure ratio, turbine inlet temperature, the back-work ratio, component efficiencies and why hot days cut output."
draft: true
---

A gas turbine does in one continuous stream what a piston engine does in a cylinder, one charge at a time. Air is compressed, heated by burning fuel in it, and expanded through a turbine that drives both the compressor and a generator. Because nothing reciprocates, a gas turbine is light, smooth and quick to maintain, and its exhaust leaves hot enough to raise steam. Those qualities make small gas turbines, sold as microturbines, a candidate for the laundry's energy plant.

The same arrangement has a weakness that a piston engine hides. The compressor is a large consumer of the turbine's own work, and every loss in either machine comes straight off the small difference between them. This chapter works through the ideal and the real Brayton cycle for a microturbine package, shows how pressure ratio and turbine inlet temperature set its output and efficiency, and ends with a quotation that rated the machine on a cooler day than the laundry will see.

## The machine and its cycle

The simple gas turbine has three parts on one shaft. The compressor raises the air pressure, the combustor burns gas in the compressed air at nearly constant pressure, and the turbine expands the hot gas back to atmospheric pressure. The turbine makes more work than the compressor takes because it expands hotter gas, which has a larger volume for the same pressure change. The difference drives the generator.

For analysis the cycle is idealised as the **Brayton cycle** on the cold-air standard: air as an ideal gas with constant specific heats (c_p = 1.005 kJ/kg·K, k = 1.4), compression and expansion adiabatic, heat added and rejected at constant pressure, and the small mass of fuel ignored. Four states describe it.

```figure
type: svg
title: A simple gas turbine and its four states
alt: A schematic of a simple gas turbine. Air enters a compressor at state 1, 25 °C. Compressed air leaves at state 2, 210.8 °C, and enters a combustor where gas is burnt. Hot gas leaves the combustor at state 3, 950 °C, and expands through a turbine to state 4, 622 °C, the exhaust. The compressor, turbine and a generator share one shaft. The turbine makes 329.7 kJ/kg, the compressor takes 186.7 kJ/kg and the generator receives the difference, 143.0 kJ/kg.
caption: This is an illustration for the microturbine package in this chapter, cold-air standard. More than half the turbine's work goes back into the compressor; the generator gets what is left.
viewbox: 0 0 640 270
body:
<path class="bx" d="M70 60L170 90V180L70 210Z"/>
<rect class="bxa" x="250" y="40" width="130" height="50" rx="6"/>
<path class="bx" d="M440 90L540 60V210L440 180Z"/>
<rect class="bxi" x="560" y="110" width="60" height="50" rx="4"/>
<path class="li" d="M170 135H440M540 135H560"/>
<path class="la flow" d="M20 135H70"/>
<path class="la" d="M170 100H215V65H250"/>
<path class="la" d="M380 65H410V100H440"/>
<path class="la flow" d="M540 185H620"/>
<text class="txb" x="88" y="140">C</text>
<text class="txb" x="478" y="140">T</text>
<text class="txb" x="574" y="140">G</text>
<text class="tx txs" x="268" y="70">combustor</text>
<text class="txa" x="16" y="122">1</text>
<text class="tx txs" x="16" y="160">25 °C</text>
<text class="txa" x="186" y="92">2</text>
<text class="tx txs" x="176" y="58">210.8 °C</text>
<text class="txa" x="414" y="92">3</text>
<text class="tx txs" x="390" y="30">950 °C</text>
<text class="txa" x="560" y="178">4</text>
<text class="tx txs" x="560" y="208">622 °C exhaust</text>
<text class="tx txs" x="60" y="240">compressor takes 186.7 kJ/kg</text>
<text class="tx txs" x="400" y="240">turbine gives 329.7 kJ/kg</text>
<text class="txa" x="230" y="160">shaft: 143.0 kJ/kg to the generator</text>
```

## The ideal cycle: pressure ratio sets the efficiency

With reversible compression and expansion, the temperature ratio across each machine is fixed by the pressure ratio r_p alone, and the efficiency of the ideal Brayton cycle depends on nothing else:

η = 1 − r_p^−(k−1)/k

At the microturbine's pressure ratio of 4, the exponent (k − 1)/k is 0.2857, 4^0.2857 = 1.486, and the ideal efficiency is 1 − 1 ÷ 1.486 = **32.7%**. The [gas turbine (Brayton) cycle check](/tools/brayton-regenerator-check/) gives the same figure when both machine efficiencies are entered as 100%: for 1.3 kg/s of air from 25 °C, a turbine inlet temperature of 950 °C and no regenerator, it reports 333.3 kW net, a back-work ratio of 36.2% and an exhaust at 550 °C.

The tool works the cold-air-standard cycle with the compressor and turbine isentropic efficiencies you enter. It returns the compressor and turbine exit temperatures, the work of each machine per kilogram, the back-work ratio, the thermal efficiency with and without a regenerator, the exhaust temperature, the heat input and the net power for the air flow, checked against the power you need. It does not model pressure losses, the fuel's mass, cooling air or leakage, so its results are an upper bound on what a real package delivers.

## Real machines and the back-work ratio

This is an illustration. The microturbine package offered to the laundry compresses 1.3 kg/s of air from 25 °C through a pressure ratio of 4, burns gas to a turbine inlet temperature of 950 °C, and has a compressor isentropic efficiency of 78% and a turbine isentropic efficiency of 82%. Each machine's efficiency enters the temperatures directly.

```figure
type: formula
title: The microturbine's cycle, step by step
formula: T₂ = T₁ + T₁ (r_p^0.2857 − 1) ÷ η_c
formula: T₄ = T₃ − η_t T₃ (1 − r_p^−0.2857)
caption: This is an illustration. Cold-air standard, c_p = 1.005 kJ/kg·K, k = 1.4, 1.3 kg/s, r_p = 4, T₁ = 298.15 K, T₃ = 1,223.15 K. The results match the Brayton cycle check.
- η_c, η_t | compressor and turbine isentropic efficiencies, 0.78 and 0.82
- r_p^0.2857 | 4^0.2857 = 1.486
step: Ideal compressor exit 298.15 × 1.486 = 443.05 K; real exit 298.15 + 144.90 ÷ 0.78 = 483.92 K (210.8 °C)
step: Ideal turbine exit 1,223.15 ÷ 1.486 = 823.12 K; real exit 1,223.15 − 0.82 × 400.03 = 895.12 K (622.0 °C)
step: Compressor 1.005 × 185.77 = 186.7 kJ/kg; turbine 1.005 × 328.03 = 329.7 kJ/kg; net 143.0 kJ/kg
step: Net power 1.3 × 143.0 = 185.9 kW; heat input 1.3 × 1.005 × 739.23 = 965.8 kW; efficiency 19.24%
```

The real cycle delivers 185.9 kW at 19.24%, a little over half of the ideal 333.3 kW. The reason is the **back-work ratio**, the compressor's work as a share of the turbine's: 186.7 ÷ 329.7 = **56.6%**. More than half of everything the turbine makes goes straight back into the compressor. A loss in either machine therefore comes off a net output that is only 43% of the turbine's gross.

The tool shows how sharp this is. Lower the compressor efficiency by three points to 75% and the turbine efficiency by two points to 80%, which is the kind of drift that fouling and erosion can cause, and the net power falls from 185.9 kW to 165.7 kW, a loss of 10.9%, while efficiency falls to 17.33%. Component efficiencies that a piston engine would barely notice decide whether a gas turbine is worth running. This is also why compressor washing and clean inlet filters are routine on gas turbines.

## Pressure ratio and turbine inlet temperature

In the ideal cycle a higher pressure ratio always raises efficiency. In the real cycle it raises the compressor's work faster than the turbine's, and both net work and efficiency pass through a maximum. The table holds everything else at the microturbine's values.

```figure
type: compare
title: The microturbine at different pressure ratios
cols: Net power | Efficiency | Back-work ratio | Exhaust
rowhead: Pressure ratio
best: 1
caption: This is an illustration. 1.3 kg/s, 25 °C inlet, 950 °C turbine inlet, η_c 78%, η_t 82%, no regenerator, from the Brayton cycle check. Net work peaks near a ratio of 5 and efficiency near 8; small machines choose a low ratio because a recuperator (Chapter 7) gains more than extra compression does.
- 2 | 126.1 kW | 11.47% | 46.5% | 769.8 °C
- 3 | 168.9 kW | 16.49% | 52.2% | 679.8 °C
- *4 | 185.9 kW | 19.24% | 56.6% | 622.0 °C
- 5 | 191.5 kW | 20.88% | 60.4% | 580.3 °C
- 6 | 191.2 kW | 21.86% | 63.6% | 548.1 °C
- 8 | 181.8 kW | 22.63% | 69.0% | 500.7 °C
- 10 | 166.9 kW | 22.44% | 73.6% | 466.5 °C
```

Turbine inlet temperature acts the other way. Hotter gas gives the turbine more work for the same compressor, so the back-work ratio falls and both output and efficiency rise. At a pressure ratio of 4, lowering the turbine inlet temperature from 950 °C to 900 °C cuts the net power from 185.9 kW to 168.3 kW; raising it to 1,000 °C lifts it to 203.4 kW. The limit is the turbine material. Large industrial machines run far hotter than a microturbine's uncooled wheel can survive, using cooled blades and special alloys, and they pair the higher temperature with a higher pressure ratio.

This is an illustration. An industrial gas turbine with a pressure ratio of 15, a turbine inlet temperature of 1,200 °C and efficiencies of 86% and 89%, on the same 1.3 kg/s, gives 393.8 kW and 39.14% in the Brayton cycle check, with a back-work ratio of 57.3% and an exhaust at 493.7 °C. The jump from 19% to 39% comes from temperature and component quality together. Machines of that class are built in sizes far larger than the laundry needs, which is why the small-plant choice is between a microturbine and a piston engine.

## Where the fuel goes

A gas turbine has no cooling jacket and almost no oil cooler. Apart from small casing and bearing losses, every kilowatt of fuel that does not become shaft power leaves in the exhaust. In the cold-air-standard microturbine, the heat input is 965.8 kW and the net work 185.9 kW, so the exhaust carries 779.9 kW. Checked directly: 1.3 × 1.005 × (622 − 25) = **780.0 kW** above the 25 °C surroundings. The first law balances to rounding.

That exhaust is the gas turbine's great asset for cogeneration. It is a single, clean, hot stream at 622 °C, hot enough to raise the laundry's 10 bar gauge steam at 184.1 °C with a wide margin. It is also the cycle's great weakness as a generator, because four-fifths of the fuel leaves as heat. Chapter 7 shows how a recuperator turns part of that heat back into efficiency, and what that does to the heat left for the laundry.

```figure
type: stack
title: Fuel to the simple-cycle microturbine
unit: kW
caption: This is an illustration, cold-air standard, 1.3 kg/s at a pressure ratio of 4. Real packages lose a few per cent more to casing heat, generator and power-electronics losses and the gas compressor that raises the fuel to combustor pressure.
- Net shaft power | 185.9
- Exhaust heat above 25 °C | 779.9
```

## Ambient temperature and rated output

A gas turbine's compressor is a volume machine. At constant speed it swallows a roughly constant volume of air each second, so its mass flow falls as the air gets warmer and thinner. Warmer air also takes more work to compress through the same ratio, because the compressor's work is proportional to the absolute inlet temperature. Both effects cut net output on a hot day.

Gas turbines are therefore rated at stated standard conditions, commonly 15 °C at sea-level pressure. This is an illustration. The package was assumed to pass 1.3 kg/s at 25 °C. Scaling the mass flow with the inverse of absolute inlet temperature as a first approximation, it passes 1.345 kg/s at 15 °C and 1.238 kg/s at 40 °C. The Brayton cycle check then gives the outputs below. Real machines also change speed, inlet guide vane position and turbine temperature limits with ambient, so the maker's derating curve, not this scaling, governs a real assessment.

```figure
type: bars
title: Net output of the microturbine against inlet air temperature
unit: kW
max: 210
caption: This is an illustration. Mass flow scaled from 1.3 kg/s at 25 °C with the inverse of absolute temperature; turbine inlet 950 °C; η_c 78%, η_t 82%. A 40 °C afternoon costs 17.6% of the 15 °C rating.
- Rated, 15 °C | 200.7
- Typical, 25 °C | 185.9
- Warm, 35 °C | 172.0
- * Hot afternoon, 40 °C | 165.3
```

Efficiency falls too, from 19.66% at 15 °C to 18.59% at 40 °C, because the compressor's work per kilogram rises from 180.4 to 196.1 kJ/kg while the turbine's stays at 329.7 kJ/kg.

## Reading a gas turbine datasheet

A gas turbine datasheet packs the cycle into a few lines, and each needs its conditions read with it.

1. **Net electrical output** at stated conditions: inlet temperature, site pressure, and the inlet and exhaust pressure losses assumed. Ducting, silencers and a heat-recovery boiler on the exhaust all add back pressure, and each raises the turbine's exit pressure, so it expands through a smaller ratio and gives less work.
2. **Heat rate**, the fuel energy per kilowatt-hour generated, in kJ/kWh. It is 3,600 divided by the electrical efficiency. The cold-air-standard microturbine's 19.24% corresponds to 3,600 ÷ 0.1924 = 18,711 kJ/kWh. Check which heating value the heat rate uses; datasheets normally use the lower heating value, while Australian gas is billed on the higher one (Chapter 5).
3. **Exhaust mass flow and temperature**, which fix the heat available for recovery. The product of the two, with the gas's specific heat, should roughly match the fuel energy less the electrical output and small casing losses. If it does not, one of the figures is at different conditions.
4. **Fuel gas pressure** required at the package inlet. If the site's supply pressure is lower, a gas compressor is needed, and its power comes off the net output.
5. **Part-load behaviour.** A gas turbine follows a falling load by reducing fuel and, in a microturbine, shaft speed. Both lower the cycle's temperatures and pressure ratio, so efficiency falls faster at part load than in a piston engine. Sites with varying demand often install several small units and switch them off in turn rather than throttle one.

Each of these figures can be checked against the cycle. A heat rate that implies an efficiency above the cold-air-standard value at the same pressure ratio and turbine inlet temperature deserves a question, because the real machine has losses the ideal cycle leaves out.

## The error: a rating from a cooler day

This is an illustration. A supplier's budget proposal offered two of the microturbines as "400 kW of on-site generation" against the laundry's 450 kW average demand. The plant engineer's first spreadsheet multiplied 2 × 200 kW by the 4,800 operating hours and credited every kilowatt-hour against grid purchases.

The check came from reading the datasheet's footnote. The 200 kW rating was at 15 °C. The laundry's dryer and ironer hall sits beside the plant room, and the intake air on a summer afternoon was logged at 40 °C. Running the Brayton cycle check with the scaled 40 °C mass flow gave 165.3 kW per unit, 330.6 kW for the pair: 69.4 kW, or 17.4%, below the proposal at the time of the site's highest electrical demand. The same check exposed a second slip. An earlier draft had estimated output from the turbine work alone, 1.3 × 329.7 = 428.6 kW per unit, forgetting that the compressor takes 56.6% of it back.

The engineer made three corrections. The intake was moved to draw outside air from a shaded wall rather than plant-room air. The supplier was asked for output and fuel use at the site's own hourly temperatures, with the derating curve and the gas compressor's power stated. The energy model was rerun hour by hour against a year of logged temperatures, so that hot afternoons were counted at their real output rather than at the rating.

## How this applies to a small Australian business

Inland Australian summers are hard on gas turbines. Output falls on exactly the hot afternoons when air conditioning, refrigeration and process cooling push a site's demand and its electricity prices to their highest. Any business case for a gas turbine should be built on the site's own temperature record and the maker's derating data, not on the rating at 15 °C.

Small gas turbines have real advantages for the right site. They have few moving parts, long service intervals compared with piston engines, low vibration, and a single hot, clean exhaust that suits steam raising or drying. Their weaknesses are low simple-cycle efficiency, sensitivity to ambient temperature and component fouling, and the need to supply gas at combustor pressure, which often means a fuel gas compressor with its own power draw. They suit sites whose heat demand is large, steady and hot compared with their electrical demand. Chapter 7 tests whether the laundry is one of them.

Gas turbines are gas appliances and pressure-producing plant. Their installation, gas supply and connection to the electricity network are regulated, and the work belongs to qualified engineers and licensed trades. This chapter teaches how to read the cycle; it is not a design.

## Exercise: a pressure ratio of 6

Using the cold-air standard, find the compressor and turbine exit temperatures, the net power and the thermal efficiency for the microturbine at a pressure ratio of 6, with all other values as in the running case: 1.3 kg/s, 25 °C inlet, 950 °C turbine inlet, η_c 78%, η_t 82%, no regenerator. Compare the result with the pressure ratio of 4.

**Worked answer.** The temperature ratio is 6^0.2857 = 1.669. The ideal compressor exit is 298.15 × 1.669 = 497.47 K, so the real exit is 298.15 + 199.32 ÷ 0.78 = 553.68 K, or **280.5 °C**. The ideal turbine exit is 1,223.15 ÷ 1.669 = 733.08 K, so the real exit is 1,223.15 − 0.82 × 490.07 = 821.29 K, or **548.1 °C**.

The compressor takes 1.005 × 255.53 = 256.8 kJ/kg and the turbine gives 1.005 × 401.86 = 403.9 kJ/kg, so the net work is 147.1 kJ/kg and the net power 1.3 × 147.1 = **191.2 kW**. The heat input is 1.005 × (1,223.15 − 553.68) = 672.8 kJ/kg, so the efficiency is 147.1 ÷ 672.8 = **21.86%**. The back-work ratio is 256.8 ÷ 403.9 = 63.6%.

The higher ratio gains 5.3 kW and 2.6 percentage points of efficiency, but its exhaust is 74 K cooler and its back-work ratio 7 points higher, so it is more sensitive to fouling. The Brayton cycle check returns the same figures.
