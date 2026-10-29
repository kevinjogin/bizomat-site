---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: steam-turbines-condensing-and-back-pressure
order: 8
title: "Steam turbines: condensing and back-pressure"
description: "The Rankine cycle from steam-table enthalpies: condensing plant for scale, a back-pressure turbine in place of a pressure-reducing valve, exhaust dryness, heat rate and fuel chargeable to power."
draft: true
---

The steam turbine is the oldest of the engines in this book and still the one that makes most of the world's electricity from heat. It differs from the gas engine and the gas turbine in a way that matters for any site with a boiler: its working fluid is condensed back to liquid and pumped, so it needs almost no work to raise its pressure, and the heat it rejects can be taken at whatever pressure the turbine exhausts to. A steam turbine can therefore be a power station that throws most of its heat into a river, or a pressure-reducing valve that makes electricity on the side.

This chapter works the Rankine cycle from steam-table enthalpies. It sizes a condensing plant to show why such plant suits only large sites, then tests a small back-pressure turbine in place of the laundry's pressure-reducing valve, checks the dryness of the steam it exhausts, and shows why the usual heat rate says nothing useful about a back-pressure set.

## The Rankine cycle in four steps

The simple Rankine cycle has four components. A feed pump raises condensate from the condenser pressure to the boiler pressure. The boiler heats it to steam, often superheated. The turbine expands the steam to the condenser pressure, making work. The condenser turns the exhaust back into saturated liquid.

Because each step is a steady-flow process with no significant change in kinetic or potential energy, its work or heat per kilogram is simply the change in enthalpy, which is why the cycle is worked from a steam table rather than from an ideal-gas formula. The pump's work is small enough to estimate from the liquid's specific volume and the pressure rise, v_f × Δp. The turbine's work is its isentropic efficiency times the isentropic enthalpy drop.

The [steam Rankine cycle check](/tools/rankine-cycle-check/) does exactly this. You enter the boiler pressure, the steam enthalpy at the turbine inlet, the enthalpy after isentropic expansion to the condenser pressure, the saturation values at the condenser pressure and the two machine efficiencies; it returns the pump, turbine and net work, the heat added and rejected, the thermal efficiency, the back-work ratio, the heat rate, the steam flow and boiler and condenser duties for the net power you need, and the exhaust dryness against your minimum. It takes no steam properties of its own, so all enthalpies must come from one steam table or program; the values here are IAPWS-IF97 values.

## A condensing plant for scale

This is an illustration. A condensing set of the size a timber or sugar site might burn residues in: steam at 3 MPa and 400 °C (h = 3,231.6 kJ/kg) expands through a turbine of 85% isentropic efficiency to a condenser at 10 kPa, where water boils at 45.81 °C. Isentropic expansion would end at h = 2,193.0 kJ/kg. The feed pump is 80% efficient. The target is 2,000 kW net.

```figure
type: formula
title: The condensing cycle, worked from enthalpies
formula: w_t = η_t (h₃ − h₄s) · w_p = v_f (P_b − P_c) ÷ η_p
formula: η = (w_t − w_p) ÷ (h₃ − h₂)
caption: This is an illustration. IAPWS-IF97 properties: h_f = 191.81 kJ/kg, h_fg = 2,392.1 kJ/kg and v_f = 0.001010 m³/kg at 10 kPa. Results match the steam Rankine cycle check.
- h₃, h₄s | turbine inlet and isentropic exit enthalpy, 3,231.6 and 2,193.0 kJ/kg
- h₂ | feedwater enthalpy leaving the pump, h_f + w_p
step: Turbine 0.85 × 1,038.6 = 882.8 kJ/kg; pump 0.001010 × 2,990 ÷ 0.80 = 3.77 kJ/kg; net 879.0 kJ/kg
step: Heat added 3,231.6 − 195.6 = 3,036.0 kJ/kg; efficiency 879.0 ÷ 3,036.0 = 28.95%
step: Heat rate 3,600 ÷ 0.2895 = 12,434 kJ/kWh; steam flow 2,000 ÷ 879.0 = 2.275 kg/s (8.19 t/h)
step: Exhaust enthalpy 3,231.6 − 882.8 = 2,348.8 kJ/kg; dryness (2,348.8 − 191.81) ÷ 2,392.1 = 0.9017
```

Two numbers stand out. The back-work ratio is only 0.43%, against 56.6% for the microturbine of Chapter 6, because pumping a liquid takes a tiny fraction of the work of compressing a gas. And the condenser rejects 4,908 kW against a boiler duty of 6,908 kW, 71% of the heat, at 45.8 °C: too cold to wash linen, heat a building to a useful standard or raise anything. A condensing plant makes sense where the fuel is cheap or free and the site is large enough for the boiler, turbine, condenser, cooling tower and operators to be worth their cost. At the laundry's scale, 450 kW of electrical demand, it is not a candidate.

```figure
type: stack
title: Where the condensing plant's boiler heat goes
unit: kW
caption: This is an illustration for 2,000 kW net at 28.95%. The net work is the turbine's work less the feed pump's 8.6 kW; boiler duty 6,908 kW equals the two parts shown. Almost three-quarters of the heat leaves at 45.8 °C.
- Net electrical-equivalent work | 2000
- Heat rejected in the condenser | 4908
```

## A turbine in place of the pressure-reducing valve

The laundry's calorifier takes steam at 2 bar gauge, 301.3 kPa absolute, through a pressure-reducing valve from the 10 bar gauge main at 1,101.3 kPa. A valve drops the pressure at constant enthalpy and produces nothing; [Process Steam by the Numbers](/reados/publications/process-steam-by-the-numbers/pressure-reduction-and-distribution/) covers how such stations are designed. A small back-pressure turbine drops the same pressure while taking work out of the steam, and sends its exhaust, still carrying most of its energy, to the calorifier.

This is an illustration. Saturated steam at 1,101.3 kPa has h = 2,780.7 kJ/kg and s = 6.5516 kJ/kg·K. Expanded isentropically to 301.3 kPa it would reach h = 2,546.7 kJ/kg, so the isentropic drop is 234.0 kJ/kg. Small single-stage turbines are not efficient; the engineer uses 50%, so the turbine takes 117.0 kJ/kg and its exhaust leaves at h = 2,663.7 kJ/kg, a dryness of (2,663.7 − 562.09) ÷ 2,163.0 = 0.9716.

The calorifier needs 350 kW. With the valve, the steam reaches it at h = 2,780.7 kJ/kg, slightly superheated at 159.2 °C, and gives up 2,780.7 − 562.09 = 2,218.6 kJ/kg as it condenses: 0.1578 kg/s. With the turbine, each kilogram brings only 2,101.6 kJ/kg, so 0.1665 kg/s is needed. The steam Rankine cycle check, set with the calorifier as the "condenser" at 301.3 kPa, a 70% pump and a net power of 19.28 kW, confirms the flow of 0.1665 kg/s, a condenser duty of exactly 350 kW, a boiler duty of 369 kW and an exhaust dryness of 0.9716.

```figure
type: compare
title: Pressure-reducing valve or back-pressure turbine for the calorifier
cols: Valve | Turbine, 50%
rowhead: Quantity
caption: This is an illustration for 350 kW at the calorifier. IAPWS-IF97 properties at 1,101.3 and 301.3 kPa absolute. The turbine's power is paid for with extra boiler steam, almost kilowatt for kilowatt.
- Steam to the calorifier | 0.1578 kg/s | 0.1665 kg/s
- State at the calorifier | 159.2 °C, 25.5 K superheat | wet, dryness 0.9716
- Heat given per kilogram | 2,218.6 kJ/kg | 2,101.6 kJ/kg
- Boiler duty | 349.8 kW | 369.3 kW
- *Shaft power, net of feed pump | 0 kW | 19.28 kW
- Electrical, generator 90% | 0 kW | 17.35 kW
```

## Heat rate and fuel chargeable to power

The tool reports a thermal efficiency of 5.22% and a heat rate of 68,950 kJ/kWh for this set, figures that would condemn any power station. They are the wrong measure. The 350 kW the "condenser" rejects is not lost; it is the calorifier's product, and it would have been supplied anyway. What the turbine costs is the extra heat the boiler must provide so that the calorifier still gets its 350 kW.

That extra is 369.3 − 349.8 = 19.5 kW of steam, the turbine's shaft power to within rounding, as the first law requires. At the boiler's 82% efficiency it takes 19.5 ÷ 0.82 = 23.7 kW of gas on the gross heating value. With a 90% efficient generator, 17.35 kW of electricity costs 23.75 kW of gas, so the **fuel chargeable to power** is 73.1%, a heat rate of about 4,927 kJ/kWh. No engine in this book comes close, because the back-pressure turbine's "waste" heat is all used.

This is an illustration, excluding GST. Over 4,800 hours the set would make 83,293 kWh worth A$16,659 at A$0.20/kWh and burn 410.4 GJ of extra gas costing A$6,566 at A$16.00/GJ: a gross margin of about A$10,090 a year before maintenance. That is the most the laundry could pay each year for the turbine, generator, controls, connection and upkeep. Its value depends entirely on the steam flow through it, which brings a twist.

## Exhaust dryness and wet steam

Steam expanding in a turbine starts to condense once it crosses the saturation line, and the droplets erode blades, especially in the last stages where they travel fastest. Turbine makers state the wettest exhaust a machine will accept. The steam Rankine cycle check compares the exhaust dryness with a minimum you enter; this book uses 0.88 as an illustration, never as a substitute for the maker's figure.

The back-pressure turbine's 0.9716 is comfortably dry. Its exhaust is wet, though, where the valve's was superheated, so the calorifier's steam line needs a separator and good drainage to keep condensate from collecting and causing water hammer.

## The error: a condensing turbine on saturated steam

This is an illustration. At a planning meeting someone suggested that the boiler, idle at weekends, could run a condensing turbine to sell power: saturated steam from the 10 bar main expanded to a 10 kPa condenser in a used turbine of 80% isentropic efficiency.

The engineer ran the case. Saturated steam at 1,101.3 kPa (h = 2,780.7, s = 6.5516) expanded isentropically to 10 kPa ends at h = 2,074.4 kJ/kg, dryness 0.787. With the 80% turbine the steam Rankine cycle check gave a thermal efficiency of 21.78%, a heat rate of 16,526 kJ/kWh and an exhaust dryness of **0.8461**, flagged EXHAUST TOO WET against the 0.88 minimum. Saturated steam starts its expansion already on the saturation line, so a long expansion leaves it very wet.

The correction was twofold. Technically, the cycle would need superheat, which the laundry's fire-tube boiler cannot provide, or a separator and reheat, which no small site would install. Economically, a 21.78% cycle on gas costing A$0.0576 per kWh of heat makes electricity, after the boiler's 82%, for about 0.0576 ÷ (0.2178 × 0.82) = A$0.32 per kWh in fuel alone, more than the grid price, before a condenser and cooling tower are even bought. The proposal was dropped in one meeting, on the strength of two enthalpies.

## When the heat demand changes

The back-pressure turbine's value is proportional to the steam that passes through it, and Chapter 10's gas engine would supply 230 kW of the hot water from its jacket. The calorifier would then need only 120 kW, a steam flow of 120 ÷ 2,101.6 = 0.0571 kg/s, and the turbine would make 0.0571 × 117.0 = **6.7 kW** of shaft power. A machine sized for one plant arrangement can be stranded by the next. Any back-pressure turbine should be assessed against the heat demand that will exist after every other project on the site's list, not before.

Back-pressure and extraction steam turbines remain central to cogeneration at larger sites: paper mills, sugar mills and food factories that raise high-pressure steam from residues or gas and use the exhaust for process heat. In combined-cycle plant, a gas turbine's exhaust raises steam for a Rankine cycle below it, which is the large-scale answer to the hot exhaust of Chapter 6.

## Screening a reducing station for a turbine

A quick screen, before any supplier is called, needs only the site's own records and a steam table.

1. **Log the flow.** Read the steam flow through the reducing station over at least a typical week, from a flow meter or from the downstream heat demand. Note the hours at each flow, not just the average.
2. **Find the isentropic drop.** From the upstream pressure and state, and the downstream pressure, read h₃ and h₄s from one steam table. For the laundry, 2,780.7 − 2,546.7 = 234.0 kJ/kg.
3. **Estimate the power.** Multiply flow by the drop and a realistic small-turbine efficiency, 0.4 to 0.6 as an illustration, then by a generator efficiency. Check the exhaust dryness.
4. **Charge the fuel.** The extra boiler steam equals the shaft power; divide by the boiler efficiency for the gas.
5. **Value it.** Electricity at the site's avoided price, less the extra gas, over the logged hours. Compare the annual margin with the installed and maintenance cost a supplier quotes.
6. **Test the future.** Repeat steps 1 to 5 for the heat demand after every other planned project, as the next section does for the laundry.

```figure
type: checklist
title: Questions for a back-pressure turbine proposal
caption: Each question ties the proposal back to a number the site can check against its own records.
- Steam flow and hours used for the energy estimate | stated by hour, not as one average
- Turbine isentropic efficiency at the site's flow and pressures | from the maker's curve
- Exhaust state and dryness at the process | with separator and drainage shown
- Generator efficiency and the auxiliary loads | net electrical output stated
- Bypass valve | so the process keeps its steam when the turbine trips
- ? Effect of planned heat-recovery projects on the flow | asked before purchase
```

## How this applies to a small Australian business

Many Australian sites reduce steam pressure through valves: food factories, laundries, hospitals and breweries. A back-pressure turbine pays only where the flow through the valve is large and steady for many hours a year, because its electricity, though cheap in fuel, is small in quantity. A rough screen is the steam flow times about half the isentropic enthalpy drop: at the laundry, 0.1665 kg/s × 117 kJ/kg gives under 20 kW. Sites passing several tonnes an hour through a reducing station have more to gain.

Boilers, turbines and steam pipework are pressure equipment. In Australia their design, registration, installation, inspection and operation are governed by work health and safety law in each state and territory and by the relevant Australian Standards, and some boilers need certified operators. Any change of this kind belongs to qualified engineers and the plant's competent person; this chapter teaches how to judge it, not how to build it.

## Exercise: a better turbine

A supplier offers a two-stage back-pressure turbine with an isentropic efficiency of 60% for the same duty: saturated steam at 1,101.3 kPa to 301.3 kPa, 350 kW at the calorifier. Find the exhaust enthalpy and dryness, the steam flow, the net shaft power after the 70% feed pump and the electrical output with a 90% generator.

**Worked answer.** The turbine takes 0.60 × 234.0 = 140.4 kJ/kg, so the exhaust enthalpy is 2,780.7 − 140.4 = **2,640.3 kJ/kg** and its dryness (2,640.3 − 562.09) ÷ 2,163.0 = **0.9608**. Each kilogram gives the calorifier 2,640.3 − 562.09 = 2,078.2 kJ/kg, so 350 kW needs **0.1684 kg/s**.

The feed pump takes 0.001073 × (1,101.3 − 301.3) ÷ 0.70 = 1.23 kJ/kg, so the net work is 140.4 − 1.23 = 139.2 kJ/kg and the net shaft power 0.1684 × 139.2 = **23.44 kW**. The steam Rankine cycle check, run with these values, gives the same flow, dryness and net work. With a 90% generator the electrical output is **21.09 kW**, 3.7 kW more than the 50% machine for the same calorifier duty. The extra boiler fuel rises in proportion, so the gain is worth having only if the dearer turbine's extra cost is recovered by about 3.7 kW over the laundry's hours.
