---
book: combustion-by-the-numbers
chapterSlug: excess-air-and-the-flue-gas-analyser
order: 2
title: "Excess air and the flue gas analyser"
description: "What a flue gas analyser measures and calculates, how to turn an oxygen reading into excess air and CO₂, air-free carbon monoxide, where to sample, and a probe that was reading room air."
draft: false
---

A burner's air–fuel ratio cannot be seen. The flame's colour and shape give hints, but two flames that look alike can differ by twenty per cent in excess air, and that difference is worth several per cent of the fuel bill and can be the difference between a clean flue and a dangerous one. The way to know is to measure the flue gas.

This chapter explains what a portable flue gas analyser measures directly and what it calculates, derives the relationship between oxygen and excess air for natural gas, covers carbon monoxide and its air-free correction, explains where a sample must be taken, and follows a technician who tuned TF-120's burners carefully to a reading that was not measuring the furnace at all.

## What an analyser measures

A typical portable combustion analyser draws a sample of flue gas through a probe, cools it to condense out most of its water, and passes it over a set of sensors. It measures three or four things directly:

- **Oxygen**, usually with an electrochemical cell.
- **Carbon monoxide**, with another electrochemical cell, in parts per million.
- **Flue gas temperature**, with a thermocouple at the probe tip, and usually the air temperature at the instrument.
- Sometimes **nitric oxide**, **nitrogen dioxide** or **carbon dioxide** directly, with further sensors.

From these it calculates several other figures: carbon dioxide (if it does not measure it), excess air, and a combustion efficiency or flue loss. Those calculated figures depend on the fuel selected in the instrument's menu, because each fuel has its own CO₂max and its own flue gas composition. An analyser set to the wrong fuel measures oxygen correctly and reports everything else wrongly.

Because the sample is cooled and its water removed, an analyser's readings are on a **dry basis**: percentages of the gas with the water taken out. That is why CO₂max for methane is quoted as 11.70% of the dry products, not of the wet.

## From oxygen to excess air

Chapter 1 gave the products of burning one cubic metre of methane with exactly the stoichiometric air: 1 m³ of carbon dioxide and 7.547 m³ of nitrogen, a dry total of 8.547 m³. With a fraction e of excess air, the extra air adds 9.547e m³ to the dry products, of which 2e m³ is unused oxygen. The oxygen fraction of the dry flue gas is therefore 2e ÷ (8.547 + 9.547e), and that can be turned round to give the excess air from a measured oxygen reading.

```figure
type: formula
title: Excess air from dry flue gas oxygen, natural gas
formula: excess air = 0.895 × O₂ ÷ (20.95 − O₂)
caption: O₂ as a percentage of the dry flue gas. The factor 0.895 is the ratio of dry stoichiometric products to stoichiometric air for methane, 8.547 ÷ 9.547. CO₂ follows from CO₂max.
- O₂ | measured oxygen, % dry
- 20.95 | oxygen in dry air, %
- CO₂ | CO₂max × (20.95 − O₂) ÷ 20.95, with CO₂max = 11.70% for methane
step: TF-120 at 3.0% O₂: excess air = 0.895 × 3.0 ÷ 17.95 = 15.0%
step: CO₂ = 11.70 × 17.95 ÷ 20.95 = 10.0%
```

A common shortcut, excess air ≈ O₂ ÷ (21 − O₂), leaves out the 0.895 factor and so overstates excess air by about 12% of its value. At 3% oxygen it gives 16.7% instead of 15.0%. The difference is small at low oxygen but grows, and the exact form costs nothing to use.

```figure
type: compare
title: Dry flue gas oxygen, excess air and CO₂ for natural gas
cols: Excess air | CO₂, dry | Shortcut O₂ ÷ (21 − O₂)
rowhead: O₂, dry
caption: Calculated for methane. The US DOE tip sheet's example pairs 10% excess air with 2.1% oxygen, which this relation reproduces. Oxygen changes about 0.2 percentage points for each 1% of excess air near the usual settings.
- 0% | 0% | 11.70% | 0%
- 1% | 4.5% | 11.14% | 5.0%
- 2% | 9.4% | 10.58% | 10.5%
- *3% | 15.0% | 10.03% | 16.7%
- 4% | 21.1% | 9.47% | 23.5%
- 5% | 28.1% | 8.91% | 31.3%
- 6% | 35.9% | 8.35% | 40.0%
- 8% | 55.3% | 7.23% | 61.5%
```

### Why oxygen, not carbon dioxide

Older practice set burners by carbon dioxide, measured with chemical absorption kits. Modern practice uses oxygen, for three reasons. The oxygen–excess air relation is almost the same for every hydrocarbon fuel, while the CO₂ relation depends on the fuel's CO₂max. Oxygen reads zero at stoichiometric and rises steadily with excess air, while CO₂ peaks at stoichiometric and falls on both sides, so a CO₂ reading of 10% could mean 15% excess air or a dangerous shortage of air. And oxygen cells are small, cheap and fast. Carbon dioxide remains a useful cross-check: if an analyser measures both, they must agree with the fuel's CO₂max.

Larger burners often measure oxygen continuously, with a zirconia probe mounted in the flue, and use the reading to trim the air–fuel ratio automatically. A zirconia cell works at high temperature and measures oxygen in the hot, wet flue gas, so its readings are on a **wet basis** and run lower than a portable analyser's dry readings of the same gas: at TF-120's setting, the 2e = 0.3 m³ of oxygen sits in 11.98 m³ of wet products instead of 9.98 m³ of dry, so 3.0% dry is about 2.5% wet. Mixing the two bases is a common source of disagreement between a fixed analyser and a service technician's portable one, and both instruments should state which basis they report. An oxygen trim system is only as good as its probe's calibration and position, for the same reasons as a portable analyser.

## Carbon monoxide

Carbon monoxide in flue gas means some fuel was not burned completely. A well-adjusted gas burner with adequate excess air produces a few tens of parts per million at most. Higher levels point to a shortage of air, poor mixing, a flame cooled by impinging on a cold surface, or a burner fault. Carbon monoxide is also a poison, and Chapter 8 deals with it as a hazard.

A CO reading taken at high excess air is diluted by the extra air, and the same burner looks cleaner at 8% oxygen than at 3% even if it makes the same amount of carbon monoxide. To compare readings fairly, analysers report **air-free CO**: the concentration the flue gas would have with no excess air at all.

```figure
type: formula
title: Air-free carbon monoxide
formula: CO_air-free = CO_measured × 20.95 ÷ (20.95 − O₂)
caption: Both CO and O₂ on the same dry basis. Air-free CO is the figure to compare across burners or against limits that are stated air-free.
- CO_measured | ppm, dry
- O₂ | %, dry
step: TF-120: 25 ppm at 3.0% O₂ gives 25 × 20.95 ÷ 17.95 = 29.2 ppm air-free
```

TF-120's burners, at 3.0% oxygen and 25 ppm carbon monoxide, are burning cleanly with modest excess air: **15% excess air, 10.0% CO₂ and 29 ppm air-free CO**. That is the state the shop wants to keep.

## Where to take the sample

An analyser measures whatever reaches its probe. The sample has to represent the gas leaving the combustion chamber, before anything is added to it, and that rules out several convenient places.

- **After a draught diverter or barometric damper.** These deliberately admit room air into the flue to stabilise the draught. A probe downstream of one measures flue gas diluted with air.
- **Near leaking joints in a flue under suction.** Air drawn in through gaps dilutes the gas.
- **In the corner of a wide duct.** Gas streams from different burners may not have mixed, and a single point may see one burner's flue gas and not another's.
- **Inside a furnace with air leaks.** A furnace run under negative pressure draws air in at its door and seams, and that air shows up as excess air in the flue even though the burners did not supply it. It also costs fuel, because it is heated to flue temperature and carried away.

The right place is a test port at the furnace exit or in the flue before any dilution, with the probe tip in the main stream. Where there is doubt, readings at two points along the flue should agree; if the oxygen rises downstream, air is getting in between them.

### What leaking air costs

Air that leaks into a furnace is not just a nuisance for the analyser. It enters at room temperature and leaves at flue temperature, and the burners pay to heat it. The cost is easy to estimate from the enthalpy of air.

This is an illustration. Heating air from 25 °C to 650 °C takes about **19.2 kJ per mole**, from NIST's heat-capacity data for nitrogen and oxygen. Suppose TF-120 ran under slight suction and drew in **10 m³/h** of room air at standard conditions through its door seal and a worn sight-glass gasket. That is 10 ÷ 0.023645 ≈ 423 moles an hour, taking 423 × 19.2 ÷ 3,600 ≈ **2.25 kW** of heat up the flue. Because only about 63% of the fuel's heat is available at 650 °C, as Chapter 3 shows, the burners need about 2.25 ÷ 0.626 ≈ **3.6 kW** more fuel to supply it, about 3% of their input at high fire, all the time the furnace is hot.

That is why furnaces like TF-120 are usually run with a slightly positive chamber pressure, controlled by a damper in the flue, so that leaks blow hot gas out rather than draw cold air in. A small outward leak wastes a little heat at the leak; an inward leak wastes heat across the whole chamber and confuses every flue gas reading. Checking the chamber pressure belongs in the same service visit as checking the oxygen.

## Looking after the analyser

A flue gas analyser is a measuring instrument with sensors that age, and its readings are only as good as its care. Three habits keep it honest. Before every set of readings, it is started and zeroed in fresh air away from any flue, so that the oxygen cell reads 20.9% and the CO cell reads zero; an instrument that cannot hold those values is not used. Its condensate trap and filters are emptied and checked, because a flooded trap or a blocked filter slows the sample and can draw air in at a loose fitting, which is the dilution error of this chapter in miniature. And it is checked against certified test gases, at the interval its maker recommends or the shop's quality system sets, with the results kept. Electrochemical cells drift slowly and fail gradually, so a check against a known gas is the only way to know a 25 ppm reading is not really 50.

### Checking an analyser's reading

Three checks catch most bad readings before anyone adjusts a burner:

1. **Do O₂ and CO₂ agree with the fuel?** If both are measured, CO₂ should equal CO₂max × (20.95 − O₂) ÷ 20.95 to within a few tenths.
2. **Does the excess air agree with the metered flows?** If gas and air are metered, their ratio gives the excess air independently.
3. **Does the CO make sense with the O₂?** At several per cent of oxygen, a properly mixing burner should not make hundreds of ppm of CO. High CO with apparently high oxygen means either a burner fault or a sample that is not what it seems.

## The error: tuning to diluted gas

This is an illustration. During a routine service, a technician measured TF-120's flue gas through a convenient test hole in the flue duct above the furnace, about a metre downstream of the barometric damper that stabilises the furnace's draught. The analyser read **5.2% oxygen**, which it reported as 28% excess air. The service sheet called for 3%, so the technician closed the combustion air damper in steps until the analyser read 3.0%.

As the damper closed, the carbon monoxide reading climbed past a few hundred ppm and kept rising, which is not how a burner with 15% excess air behaves. The technician stopped, reopened the damper to its original setting, and measured at the furnace exit port on the side of the chamber instead. With the damper at its original setting, the furnace exit read **3.0% oxygen** and 25 ppm CO: the burners had been correctly set all along. The duct test hole sat downstream of the damper, which was admitting about 14 m³ of room air for every 100 m³ of dry flue gas, enough to raise the oxygen reading from 3.0% to 5.2%.

The numbers show what the adjustment would have done. To make the diluted reading fall to 3.0%, the furnace itself would have had to drop to about **0.46% oxygen**, or 2% excess air, close to the point where carbon monoxide rises steeply. The rising CO reading was the warning sign that saved the adjustment.

```figure
type: steps
title: What the technician measured, and what the furnace was doing
caption: This is an illustration. The duct reading included room air admitted at the barometric damper, about 14 m³ per 100 m³ of dry flue gas.
- As found, furnace exit | 3.0% O₂, 15% excess air, 25 ppm CO
- As found, duct test hole | 5.2% O₂, read as 28% excess air
- * After closing the air damper to read 3.0% in the duct | furnace exit near 0.46% O₂, 2% excess air, CO climbing
- Restored, measured at the exit port | 3.0% O₂, 15% excess air
```

The shop changed three things. The duct test hole was plugged and labelled "not for combustion testing". The service sheet now names the furnace exit port as the only sampling point and requires CO to be recorded beside every oxygen reading. And any adjustment that raises CO by more than a set amount is stopped and investigated before it continues.

## Exercise: a reading with dilution

At the furnace exit, after a burner service, TF-120 shows **2.0% oxygen** and **40 ppm CO**. Find the excess air, the CO₂ and the air-free CO. Then work out what a probe in a duct with 10 m³ of room air leaking in for every 100 m³ of dry flue gas would read for oxygen, and the excess air the analyser would report from it.

**Worked answer.** Excess air = 0.895 × 2.0 ÷ 18.95 = **9.4%**. CO₂ = 11.70 × 18.95 ÷ 20.95 = **10.6%**. Air-free CO = 40 × 20.95 ÷ 18.95 = **44.2 ppm**. With 10% dilution by air, the duct sees oxygen of (2.0 + 0.1 × 20.95) ÷ 1.1 = **3.72%**, and the analyser would report 0.895 × 3.72 ÷ 17.23 = **19.3% excess air**, double the true value. A technician who trusted it would be tempted to close the air further, exactly the mistake of this chapter. The burner itself is at the low end of the 10 to 20% range the DOE tip sheet describes, which is acceptable only while the CO stays low.
