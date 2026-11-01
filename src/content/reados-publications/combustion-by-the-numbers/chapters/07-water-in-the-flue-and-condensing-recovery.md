---
book: combustion-by-the-numbers
chapterSlug: flue-gas-dew-point-and-condensing-heat-recovery
order: 7
title: "Water in the flue gas and condensing heat recovery"
description: "How much water burning gas makes, the flue gas dew point and how excess air moves it, recovering latent heat with a condensing exchanger, and a flue that was never meant to be wet."
draft: false
---

Burning natural gas makes a surprising amount of water. Each cubic metre of methane produces two cubic metres of water vapour, about 1.5 kg, and that vapour leaves up the flue carrying nearly a tenth of the fuel's energy as latent heat. Cool the flue gas below its dew point and the vapour condenses, giving up that heat. That is how condensing boilers and water heaters reach efficiencies that non-condensing appliances cannot.

The same physics has a second face. A flue gas that cools below its dew point somewhere it was not meant to leaves acidic water on surfaces that were not designed for it. This chapter calculates the flue gas dew point, shows how much heat condensing can recover, sizes a flue gas heat recovery scheme for the parts washer beside TF-120, and describes the corrosion that followed when an existing flue was asked to carry cooler, wetter gas than it was built for.

## How much water

From the reaction in Chapter 1, each mole of methane burned makes two moles of water. On the methane basis, that is 2 × 18.015 ÷ 23.645 ≈ **1.52 kg of water per standard cubic metre** of gas, or about 0.040 kg per megajoule of fuel. TF-120 at high fire makes about **17.5 kg of water an hour**, and a typical load of 745 MJ about **30 kg**. All of it leaves as vapour in a furnace whose flue is at 650 °C. The figure scales directly with the gas burned, so the gas sub-meter of Chapter 5 is also, in effect, a water meter for the flue: every standard cubic metre of natural gas sends about one and a half kilograms of water up it, about a sixth of the flue gas by volume.

## The flue gas dew point

The flue gas dew point is found in the same way as the dew point of air in any humidity calculation: from the partial pressure of water vapour in the gas. At atmospheric pressure, the water vapour's partial pressure is its mole fraction in the wet flue gas times the total pressure.

```figure
type: formula
title: Water dew point of TF-120's flue gas
formula: p_w = n_H₂O ÷ n_wet × 101.325 kPa, then t_dew from the saturation curve of water
caption: Per mole of methane at 15% excess air. Dew point from the Magnus formula with the Alduchov–Eskridge coefficients, which agrees closely with steam-table values in this range.
- n_H₂O | 2 moles of water vapour
- n_wet | 1 CO₂ + 2 H₂O + 0.3 O₂ + 8.679 N₂ = 11.98 moles
step: mole fraction of water = 2 ÷ 11.98 = 16.7%
step: p_w = 0.167 × 101.325 = 16.9 kPa; dew point = 56.4 °C
```

Excess air dilutes the water and lowers the dew point. The figure shows the range for natural gas.

```figure
type: bars
title: Water dew point of natural gas flue gas by excess air
unit: °C
max: 65
caption: Calculated for methane at atmospheric pressure. Any surface in contact with the flue gas below these temperatures gathers condensate.
- 0% | 59.1
- * 15% | 56.4
- 50% | 51.4
- 100% | 46.0
```

This is the water dew point. Fuels containing sulfur, such as fuel oil or coal, also have an acid dew point well above the water dew point, set by sulfuric acid, and flues for those fuels must be kept hot. Pipeline natural gas contains very little sulfur, so its main threshold is the water dew point, but its condensate is still mildly acidic, from carbon dioxide dissolved in it and from traces of nitrogen oxides, and it corrodes ordinary steel.

## How much heat condensing recovers

Chapter 3's available heat assumed all the water left as vapour. If the flue gas is cooled further, it first gives up sensible heat, and below its dew point it starts to condense and gives up latent heat too. Not all the water condenses at once: at each temperature below the dew point, the gas stays saturated and holds as much vapour as its partial pressure allows, and the rest condenses.

```figure
type: compare
title: TF-120's fuel energy recovered, by flue gas exit temperature
cols: Available heat | Water condensed
rowhead: Flue gas leaving at
caption: Calculated for methane at 15% excess air, with the gas saturated below its 56.4 °C dew point. The step below the dew point is the latent heat being recovered.
- 650 °C, as now | 62.6% | none
- 150 °C | 84.9% | none
- 100 °C | 87.0% | none
- 60 °C | 88.7% | none
- *50 °C | 92.2% | 31%
- 40 °C | 95.6% | 61%
- 30 °C | 97.7% | 78%
```

Two things stand out. Cooling the flue gas from 650 °C to 60 °C recovers more than a quarter of the fuel's energy, all of it sensible heat, without any condensation. And below the dew point, each 10 K of further cooling recovers another three to four per cent of the fuel's energy as latent heat, more than the sensible heat over the same range. To recover latent heat, the heat sink must be cold: the water or air being heated has to enter the exchanger well below 56 °C.

Efficiencies quoted on the lower heating value can exceed 100% for condensing appliances, because the lower heating value leaves out the latent heat they recover. On the higher heating value, the basis of the gas bill, no appliance can exceed 100%, and the figures in this book never do.

## Heat for the parts washer

This is an illustration. Beside TF-120, the shop runs an aqueous parts washer that cleans parts before tempering. Its tank is topped up each day with about **1,500 litres** of fresh water at about 15 °C, which must be heated to its 60 °C working temperature. The [heating energy and time tool](/tools/heating-energy/) gives the energy to raise a mass through a temperature range from its specific heat: 1,500 kg × 4.18 kJ/kg·K × 45 K ≈ **282 MJ**, or 78.4 kWh, a day, at present supplied by an electric immersion heater.

TF-120 runs about two loads a day. If its flue gas were cooled from 650 °C to 50 °C in a flue gas heat exchanger, the available heat would rise from 62.6% to 92.2% of the fuel, recovering about 0.296 × 745 ≈ **221 MJ** a load, or about **441 MJ** a day. In principle that is more than the washer needs.

```figure
type: stats
title: Flue gas heat recovery for the parts washer
caption: This is an illustration. Recovery happens only while the furnace fires, and most of the fuel is burned during the heat-ups, so the scheme needs a buffer tank to store heat until the washer needs it.
- 221 MJ | recoverable per load, cooling the flue to 50 °C
- 441 MJ | per day at two loads
- 282 MJ | needed each day to heat the washer's make-up water
- 9 kg | of condensate per load at a 50 °C exit
```

In practice the scheme is less tidy. Recovery happens only while TF-120 fires, mostly in two heat-ups a day, while the washer needs heat at other times, so a buffer tank is needed. The latent part of the recovery happens only while the water entering the exchanger is cold; as the buffer tank warms towards 60 °C, the exchanger's cold end rises above the 56.4 °C dew point and condensing stops. And the exchanger, its flue connections and the flue beyond it must all be built to handle condensate, which leads to this chapter's error.

### Sizing the exchanger

The exchanger's duty and size follow from the same numbers. This is an illustration. At high fire, cooling the flue gas from 650 °C to 150 °C recovers the difference in available heat, 84.9% − 62.6% = 22.3% of the 120 kW input, about **26.8 kW**. If water enters at 15 °C and leaves at 55 °C in counterflow, the temperature differences at the two ends are 650 − 55 = 595 K and 150 − 15 = 135 K, and the log mean temperature difference is (595 − 135) ÷ ln(595 ÷ 135) ≈ **310 K**.

The [heat exchanger LMTD and area tool](/tools/lmtd-exchanger/) calculates the log mean temperature difference from the four terminal temperatures and the area needed for a duty and an overall heat-transfer coefficient. Gas-to-water exchangers are limited by the gas side, where coefficients are low; taking an overall coefficient of 40 W/m²·K for the illustration, the area is 26,800 ÷ (40 × 310) ≈ **2.2 m²**. The water flow to carry 26.8 kW with a 40 K rise is 26.8 ÷ (4.18 × 40) ≈ 0.16 kg/s, about **9.6 litres a minute**. A compact finned-tube coil of that area fits in a flue section, but the extra pressure drop it adds must be checked against the burners' and flue's draught, which is part of the approval question in Chapter 8.

### Is the washer scheme worth it?

This is an illustration. The washer's 78.4 kWh a day now comes from an electric immersion heater. At an assumed A$0.30/kWh including GST, that is about **A$23.50 a day**, or about **A$5,880 a year** over 250 working days. Because the furnace and the washer do not run at the same times, assume a buffer tank lets the flue gas supply about 70% of the washer's heat, saving about **A$4,100 a year**. If the exchanger, buffer tank, pump, controls and a condensate-rated flue cost about **A$30,000** installed, the simple payback is about 7 years.

That is a more promising case than the recuperator of Chapter 4, for two reasons. The heat recovered displaces electricity, which costs nearly three times as much per megajoule as gas at the prices assumed in this book, and it uses low-temperature heat the furnace would otherwise throw away. Whether 7 years is acceptable is the shop's call, and the investment appraisal tool used in Chapter 4 gives the discounted view. The calculation also shows where the risk lies: if the washer's real demand or the share the buffer tank can capture turns out lower, the payback stretches quickly, so both are worth measuring for a month before committing.

## Water vapour inside the furnace

The water vapour matters inside the furnace as well as in the flue. In a direct-fired furnace like TF-120, the work sits in the combustion products, which at 15% excess air are about **16.7% water vapour, 8.4% carbon dioxide and 2.5% oxygen** by volume, wet. At tempering temperatures all three react with steel surfaces: oxygen and water vapour form oxide, and carbon dioxide and water vapour can also take carbon from the surface of higher-carbon steels at higher temperatures. For most tempering work the thin oxide film, the familiar temper colours and light scale, is acceptable. Where it is not, the work is heated indirectly, in radiant tubes or a sealed muffle that keeps the combustion products away from it, or in a protective atmosphere. That is a process decision, but it starts with knowing what is in the flue gas.

## Where the condensate goes

Condensate from natural gas is mostly water with dissolved carbon dioxide and traces of nitrogen oxides, which make it mildly acidic. A condensing scheme on TF-120 would produce somewhere between 9 and 18 kg of it per load, depending on how cold the exchanger runs, so a few tens of litres a day. It has to be collected at the low points of the exchanger and flue, carried away in materials that resist it, and discharged where the local water authority's trade waste rules allow, which may require it to be neutralised first. Letting it run onto a roof, as in the error below, is not an option, both for the roof and for whatever drains from it.

## The error: a flue that was not built to be wet

This is an illustration. Before deciding on the full condensing scheme, the shop installed a simpler, non-condensing heat exchanger in TF-120's flue, designed to cool the flue gas to about 150 °C and preheat the washer's make-up water. On paper, at 150 °C the available heat rises from 62.6% to 84.9%, and no condensation was expected.

In the first winter, the maintenance team found rust streaks running down the outside of the steel flue above the exchanger, and drips of brown, acidic water falling from a flue joint onto the roof sheeting. The flue was the original one, built of mild steel with slip joints, designed to carry gas at 650 °C, and it ran about 8 m up the outside of the building, uninsulated.

A thermocouple at the top of the flue explained it. With the exchanger cooling the gas to 150 °C, the gas then lost more heat through the long, cold, uninsulated flue on winter days, and at low fire, when the flow was small, it reached the top at about **48 °C**, below its 56.4 °C dew point. Water condensed on the inside of the flue, ran down, dissolved carbon dioxide and corrosion products, and leaked out through slip joints that had been designed for dry gas.

The fix had three parts: the upper flue was replaced with a sealed stainless steel flue suitable for condensing appliances, fitted with a fall and a condensate drain at its base; the condensate was led to a drain suitable for it; and the change to the appliance's flue was made under the gasfitter's supervision and recorded against the appliance's approval. The shop's rule since then is that any change that lowers a flue gas temperature is checked against the dew point at the coldest point of the flue, at low fire and in winter, not just at the exchanger outlet at high fire.

```figure
type: checklist
title: Checks before cooling a flue gas
caption: The open item is this chapter's error. A dew point is crossed at the coldest point, which is often the far end of the flue.
- x Flue gas dew point calculated for the fuel and excess air | 56.4 °C at 15% excess air
- x Exchanger and downstream flue rated for condensate if it can form | stainless steel, sealed joints
- x Condensate drained and disposed of properly | falls to a drain, suitable materials
- x Draught and the appliance's approval checked for the changed flue | by the responsible gasfitter
- ? Coldest flue temperature checked at low fire in winter | 48 °C at the top, below the dew point
```

## Exercise: condensing for the washer

Suppose the full condensing scheme cools TF-120's flue gas to **40 °C** whenever the buffer tank's return water is cold enough. How much energy would one 745 MJ load then yield, how much condensate would form, and what share of the latent heat would be recovered?

**Worked answer.** At a 40 °C exit, the available heat is 95.6%, against 62.6% without recovery, so the extra recovery is 0.330 × 745 ≈ **246 MJ** a load. The load makes about 30.1 kg of water, of which 61% condenses at 40 °C, about **18.4 kg** of condensate a load. The latent heat of all the water is 9.9% of the fuel, about 74 MJ, and 61% of it, about **45 MJ**, is recovered; the rest of the 246 MJ is sensible heat. The figures show why condensing pays most where the water being heated is genuinely cold, and why the condensate drain needs to handle tens of litres a day.
