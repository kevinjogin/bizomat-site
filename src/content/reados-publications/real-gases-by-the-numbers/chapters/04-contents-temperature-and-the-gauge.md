---
book: real-gases-by-the-numbers
chapterSlug: contents-temperature-and-the-gauge
order: 4
title: "Contents, temperature and the gauge"
description: "How a full pack's pressure moves with temperature, why real gas moves faster than ideal, hot fills that settle short, temperature-corrected contents, and a full pack rejected on a cold morning."
draft: false
---

A gas cylinder's pressure gauge is the only instrument most users ever read, and they read it as if it measured contents. It does not. It measures pressure, and the pressure of a fixed amount of gas in a fixed cylinder depends on its temperature as well as on how much gas is there. A full pack on a frosty morning and a part-used pack in the afternoon sun can show the same reading. For an ideal gas the correction is simple proportion with absolute temperature. For a real gas at cylinder pressure the pressure moves faster than that, and the correction is half as large again.

This chapter follows LN-1's full pack through a year of Australian temperatures, shows how much faster its real pressure moves than the ideal law predicts, explains why a cylinder filled hot settles short, sets out a temperature-corrected contents check, and ends with a full pack that was turned away at the gate on a cold morning because its gauge read low.

## A fixed amount of gas in a fixed volume

Once a cylinder is filled and its valve is shut, two things are fixed: the mass of gas inside and the cylinder's volume, to within the small amount the steel stretches under pressure. So its density is fixed. Whatever happens to its temperature, the gas moves along a line of constant density, which thermodynamics calls an **isochore**. The gauge follows that line.

For an ideal gas, the pressure along an isochore is proportional to the absolute temperature. For a real gas, the pressure at each temperature is whatever the equation of state gives at that density, and NIST's data give it directly.

This is an illustration. LN-1's full pack holds nitrogen at 309.06 kg/m³, 30.1 MPa at 15 °C. Following that density through the year:

- at **0 °C**, a frosty winter morning: real **27.68 MPa**, ideal 28.53;
- at **5 °C**: real 28.49 MPa, ideal 29.06;
- at **15 °C**, the filling reference: 30.10 MPa for both;
- at **35 °C**, a summer afternoon in a shed: real **33.31 MPa**, ideal 32.19;
- at **45 °C**, in direct sun: real **34.91 MPa**, ideal 33.23.

Between 0 and 45 °C, the real pressure rises by 0.161 MPa for each kelvin; the ideal law predicts 0.105. The real gas is half as sensitive again to temperature as the ideal law says.

```figure
type: line
title: LN-1's full pack, pressure against temperature
x: Pack temperature, °C
y: Absolute pressure, MPa
legend: Real nitrogen, NIST | Ideal gas law
ymin: 26
ymax: 36
caption: This is an illustration at a fixed density of 309.06 kg/m³, the pack's contents of 231.79 kg. The two lines cross at the 15 °C filling reference and diverge either side of it.
- 0 | 27.68 | 28.53
- 5 | 28.49 | 29.06
- 15 | 30.10 | 30.10
- 35 | 33.31 | 32.19
- 45 | 34.91 | 33.23
```

## Why the real gas moves faster

The van der Waals picture of Chapter 2 explains the difference. At the pack's density, the pressure is the difference between a large push from molecules with size, about 46 MPa, and a large pull from their attraction, about 17 MPa. The push rises in proportion to the absolute temperature, as an ideal gas's would. The pull does not depend on temperature at all: it depends only on how close together the molecules are, and at fixed density that does not change.

So when the gas warms, the push grows and the pull stays put, and the difference between them, the gauge reading, grows by a larger fraction than the temperature. The push at the pack's density is roughly 1.5 times the gauge reading, so the pressure moves roughly 1.5 times as fast as the ideal law predicts. Van der Waals gives 0.160 MPa per kelvin at this density, close to NIST's 0.161. This is one of the things the simple model gets right, because it depends on the shape of the equation more than on its constants.

The practical consequence is that the temperature correction for a full high-pressure cylinder is larger than the ideal law suggests. A pack read at 0 °C needs 2.42 MPa added to compare it with its 15 °C rating, not 1.57.

## Filling heats the gas

When a cylinder is filled, its temperature rises, often by tens of degrees. The gas flowing in from the filling line is pushed into the cylinder by the gas behind it, and that push does work on it, which ends up as internal energy of the gas inside. At the same time, the gas already in the cylinder is compressed by the gas arriving. For an ideal gas filling an empty, insulated vessel from a supply at temperature T, the gas inside ends at γ × T, where γ is the ratio of specific heats, 1.4 for nitrogen. From a supply at 15 °C that would be 403 K, or 130 °C. Real fills start from part-full cylinders, take time, and lose heat to the steel and the air, so the rise is much less, but the effect is always in the same direction: a freshly filled cylinder is warmer than its surroundings.

That matters because the cylinder cools afterwards, and its pressure falls along its isochore. If a pack were filled until its gauge read 30.1 MPa while its gas was at 35 °C, its density would be NIST's value at 30.1 MPa and 35 °C, 286.93 kg/m³, and once it cooled to 15 °C it would read only **27.24 MPa** and hold 215.19 kg, 7.2% short of a properly filled pack. Filled at 45 °C, it would settle at 26.04 MPa and hold 207.84 kg, 10.3% short.

Gas fillers manage this in their filling procedures, for example by filling slowly, by filling in stages, or by allowing for the gas temperature so that the cylinder settles near its rated pressure at the reference temperature. The user's part is to understand that a cylinder's settled pressure, not the pressure it showed at the end of filling, is what describes its contents.

```figure
type: bars
title: LN-1's contents if filled to 30.1 MPa at different gas temperatures
unit: kg
max: 260
caption: This is an illustration from NIST's densities at 30.1 MPa. A pack filled cold holds more; one filled hot settles short when it cools to 15 °C.
- Filled at 0 °C | 246.22
- * Filled at 15 °C, the reference | 231.79
- Filled at 35 °C, settles at 27.24 MPa | 215.19
- Filled at 45 °C, settles at 26.04 MPa | 207.84
```

## Drawing gas cools the pack

The reverse happens when gas is drawn off. The gas left in the cylinder expands to fill the space the departing gas leaves, and in expanding it pushes the departing gas out, doing work on it. That work comes from the internal energy of the gas remaining, which cools. The steel wall then warms the gas back towards room temperature, at a rate set by the area of the wall, the temperature difference and how vigorously the gas inside is stirred.

Which effect wins depends on the rate of draw. LN-1's laser takes most of a day to empty a pack, and the steel, weighing far more than the gas, keeps the gas close to room temperature throughout; its gauge falls steadily with the contents. A heavy draw, such as purging a large vessel or blowing down a pipeline with the same pack, can empty a cylinder in minutes. The gas then cools markedly, the gauge drops faster than the contents, and when the draw stops the pressure recovers as the gas warms again. A reading taken during or straight after a heavy draw therefore understates the contents. The fair reading is the settled one, taken after the cylinder has returned to the temperature of its surroundings.

## Gauge and absolute pressure

Cylinder gauges read **gauge pressure**, the pressure above the surrounding atmosphere. Every equation of state, ideal or real, needs **absolute pressure**. The difference is about 0.1 MPa at sea level, and less at altitude, where the atmosphere is thinner.

At a full pack's 30 MPa, mixing the two up changes the answer by about 0.3%, which hardly matters. At the bottom of the pack it matters a great deal. LN-1's changeover pressure of 2.5 MPa absolute is 2.4 MPa on the gauge. If the changeover were set at 2.5 MPa on the gauge instead, the pack would be changed with about 0.75 × (30.58 − 29.40) = **0.89 kg** more nitrogen left in it, about a minute and a half of cutting, every time. Neither error is large for LN-1, but the habit of writing "gauge" or "absolute" next to every pressure prevents the cases where it is, such as a vacuum or a low-pressure line, where 0.1 MPa is the whole answer.

## Temperature-corrected contents

The method for reading contents from a gauge follows directly from the isochore.

1. Read the gauge and add the atmospheric pressure to get the absolute pressure.
2. Measure the gas temperature. The gas in a cylinder that has stood still for some hours is at the temperature of the cylinder wall, which a contact or surface thermometer can read. A cylinder in sun or just filled is not uniform and needs time to settle.
3. Look up the gas's density at that pressure and temperature from reference data, or calculate it from the compressibility factor.
4. Multiply by the cylinder's water capacity to get the mass of gas.
5. If a reading at the reference temperature is wanted, follow the same density to 15 °C.

This is an illustration for LN-1 on three days, each with a pack reading 30.0 MPa gauge, 30.1 MPa absolute.

- At **0 °C**, the density is 328.29 kg/m³: **246.22 kg**, more than the rated 231.79. This pack was filled generously, or filled warm and then cooled further than its reference temperature.
- At **15 °C**: **231.79 kg**, exactly as rated.
- At **35 °C**, the density is 286.93 kg/m³: **215.19 kg**, 7.2% short. A pack that reads full on a hot afternoon is not full.

The same gauge reading covers a range of 31 kg, or about 51 minutes of LN-1's cutting, depending only on the temperature.

```figure
type: steps
title: Reading a cylinder's contents from its gauge
caption: The density lookup is the real-gas step. For nitrogen at cylinder pressures, a simple ratio of absolute temperatures understates the correction by about a third.
- Read the gauge | and add atmospheric pressure, about 0.1 MPa, for absolute
- Measure the gas temperature | the cylinder wall, after the cylinder has stood for some hours
- Look up the density | at that absolute pressure and temperature, from reference data or Z
- Multiply by water capacity | 0.75 m³ for LN-1's pack
- * Compare at the reference temperature | follow the same density to 15 °C before judging the fill
```

## Heat, sun and safety

The isochore also sets the pressure a cylinder reaches when it is heated, and that is a safety matter. LN-1's full pack, left in direct sun until its gas reached 45 °C, would read 34.91 MPa absolute, 16% above its filling pressure; the ideal law would predict only 10%. A cylinder engulfed in a fire goes far higher, and its pressure relief device, where one is fitted, or its rupture, is what limits it.

Cylinders are designed and tested with a margin above their filling pressure for the temperatures they are expected to meet. That margin is not a licence to heat them. AS 4332 sets out how cylinders are to be stored and handled, including keeping them away from heat sources, and the supplier's instructions apply to each cylinder. For a gas user, the lesson of the isochore is that a pack stored in the sun on a hot day is under noticeably more pressure than the same pack in the shade, and more than a simple calculation suggests.

## The error: a full pack rejected on a cold morning

This is an illustration. After the run-time trouble of Chapter 1, the shop's goods-in officer started checking every delivered pack's gauge against its rated 30.0 MPa, and recording any shortfall for a credit. One July morning, after a clear, frosty night, the replacement pack was unloaded from the truck reading **27.6 MPa** gauge. The officer recorded it as 8% short and asked the driver to take it back.

The driver took it, the shop ran the rest of the day on the old pack's reserve and a rushed second delivery, and the supplier queried the rejection. The production engineer looked into it. The pack had stood overnight on an open truck, and the morning was close to 0 °C. At 0 °C, nitrogen at 27.68 MPa absolute has a density of 309.06 kg/m³, exactly the density of a properly filled pack at 30.1 MPa and 15 °C. The pack held the full 231.79 kg. The ideal-gas correction, which the officer might have applied if they had thought of the temperature, would have predicted 28.53 MPa at 0 °C and still made the pack look about 3% short; only the real-gas isochore matched the reading.

The shop changed its goods-in check. The officer now records the gauge reading and the cylinder's wall temperature, taken with a surface thermometer, and looks the pair up on a one-page chart prepared from NIST's data, which gives the expected reading of a full pack at each temperature from 0 to 45 °C. Only a reading more than 0.5 MPa below the chart value is queried.

```figure
type: compare
title: LN-1's goods-in chart, full pack readings by temperature
rowhead: Pack temperature
cols: Full pack, real nitrogen, MPa absolute | Full pack, gauge, MPa | Ideal law would predict, MPa absolute
caption: This is an illustration for a pack holding 231.79 kg of nitrogen in 0.75 m³. A full pack that reads below the middle column by more than 0.5 MPa is queried.
- 0 °C | 27.68 | 27.6 | 28.53
- 5 °C | 28.49 | 28.4 | 29.06
- * 15 °C | 30.10 | 30.0 | 30.10
- 35 °C | 33.31 | 33.2 | 32.19
- 45 °C | 34.91 | 34.8 | 33.23
```

## Exercise: a winter reading

On a winter morning, LN-1's pack reads 27.5 MPa gauge, 27.6 MPa absolute, with its wall at 5 °C. NIST gives nitrogen at 27.6 MPa and 5 °C a density of 301.91 kg/m³. How much nitrogen does the pack hold, what would it read at 15 °C, and how many hours of cutting does it have above the 2.5 MPa changeover? What would the ideal law have predicted for its reading at 15 °C?

**Worked answer.**

- Contents: 0.75 × 301.91 = **226.43 kg**, 2.3% below a full pack.
- At 15 °C, following the same density, NIST's data give **29.15 MPa** absolute, 29.05 MPa gauge.
- Usable: 226.43 − 22.05 = 204.38 kg, which lasts 204.38 ÷ 36.0 = **5.68 hours** of cutting.
- The ideal law would predict 27.6 × 288.15 ÷ 278.15 = **28.59 MPa** at 15 °C, which would make the pack look 5% short of its rated 30.1 MPa rather than 3%.

On the goods-in chart, a full pack at 5 °C reads 28.4 MPa gauge; this one reads 27.5, 0.9 MPa below, so it would be queried, correctly: it holds 5.36 kg less than a full pack.
