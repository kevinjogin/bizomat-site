---
book: thermal-expansion-by-the-numbers
chapterSlug: how-materials-grow-with-temperature
order: 1
title: "How materials grow with temperature"
description: "Calculate linear, area and volume expansion from published coefficients, see why holes grow with their material, why water must be handled with density tables, and which temperature change to use."
draft: false
---

Heat makes the atoms in a solid vibrate more, and on average they sit slightly further apart. The material grows in every direction. For most engineering materials over everyday temperature ranges, the growth is very nearly proportional to the temperature change and to the size of the part, which makes it one of the easiest things in engineering to calculate. It is also one of the easiest to forget, because the growth is invisible on a drawing and small per metre. Over a long pipe, a large tank or a close fit, it becomes centimetres of movement or tenths of a millimetre of interference.

This chapter sets out the basic calculation. It defines the coefficient of linear expansion and gives published values for HW-60's materials, calculates the growth of the 60 m hot water pipe, extends the idea to areas and volumes, explains why a hole grows as if it were made of the material around it, shows why water needs density tables rather than a single coefficient, and discusses which temperature change to use. The failure case is an expansion joint chosen with the coefficient for carbon steel on a stainless steel line.

## The coefficient of linear expansion

For a length **L** of material, warmed through a temperature change **ΔT**, the change in length is:

**ΔL = α × L × ΔT**

The **coefficient of linear expansion α** is the fractional growth per degree, usually given in millionths per degree Celsius, written ×10⁻⁶ per °C or µm/m·°C. A coefficient of 12 × 10⁻⁶ per °C means each metre grows by 12 micrometres, 0.012 mm, for every degree.

```figure
type: bars
title: Growth of a 1 m length warmed by 50 °C, by material
unit: mm
max: 4
caption: Published coefficients: steel 10.8 to 12.5 (12 used), austenitic stainless steel 304 17.3, copper 16 to 16.7 (16.5 used), aluminium 23 and PVC 54 to 110 millionths per °C (70 used). Plastics grow several times as much as metals.
- Carbon steel | 0.60
- Copper | 0.83
- *Stainless steel 304 | 0.87
- Aluminium | 1.15
- PVC | 3.5
```

The differences matter. Austenitic stainless steel, the usual choice for food plant pipework, grows about **44% more** than carbon steel. Aluminium grows nearly twice as much as steel, and PVC several times as much. Coefficients also vary between grades and alloys and with temperature, so the published figure for the actual material, over the actual temperature range, is the one to use.

## HW-60's pipe

HW-60's pipe is austenitic stainless steel, **60 m** long, installed at about **15 °C** and run at **85 °C**, a change of **70 °C**.

```figure
type: formula
title: Growth of HW-60's 60 m hot water pipe
formula: ΔL = α × L × ΔT
caption: This is an illustration. The pipe is installed at 15 °C and operates at 85 °C; the metal is taken to be at the water's temperature, which is close for an insulated pipe.
- Coefficient α, stainless steel 304 | 17.3 × 10⁻⁶ per °C
- Length L | 60,000 mm
- Temperature change ΔT | 85 − 15 = 70 °C
step: ΔL = 17.3 × 10⁻⁶ × 60,000 × 70 ≈ 72.7 mm
step: each 30 m half grows about 36.3 mm
```

Seventy-three millimetres is not a tolerance. It is a movement the pipe will make every time the system heats up and reverse every time it cools, and it must go somewhere. Chapters 3 and 4 deal with where.

## Areas and volumes

A part grows in every direction at once. A flat area grows by about **2α** per degree, because both its dimensions grow; a volume grows by about **3α**, because all three do. For HW-60's stainless storage tank, 1.5 m in diameter:

- its diameter grows by **17.3 × 10⁻⁶ × 1,500 × 70 ≈ 1.82 mm** from 15 °C to 85 °C;
- its volume grows by about **3 × 17.3 × 10⁻⁶ × 70 ≈ 0.36%**.

The approximation 2α and 3α holds because the coefficients are so small that their products, the terms such as α², are negligible.

## A hole grows like the material around it

A useful and sometimes surprising rule: when a part with a hole in it is warmed, the hole **grows**, by exactly the amount a solid disc of the same material filling the hole would grow. It does not shrink as the material "expands into it". Every dimension of a uniformly heated part scales up by the same factor, holes included.

That rule is the basis of shrink fitting, Chapter 5's subject: heating a hub enlarges its bore, so it can be slipped over a shaft that is slightly too large for it cold. It also explains why a bore in an aluminium housing grows away from a steel bearing when both warm up: the aluminium's bore grows at aluminium's rate, the bearing at steel's, and the fit loosens, as Chapter 8 shows.

## Liquids grow much more

Liquids expand far more than solids, and their expansion is less uniform. Water is the important case, and it is unusual. Its density is greatest at about 4 °C, **999.97 kg/m³**, and falls as it warms: **999.10 kg/m³** at 15 °C, **983.20** at 60 °C, **968.61** at 85 °C. Below 4 °C it expands again as it cools, which is why ice floats.

Because of that curve, water's expansion is not described well by a single coefficient. The reliable method is to use the densities at the two temperatures: a mass of water occupying 1 litre at 15 °C occupies **999.10 ÷ 968.61 ≈ 1.0315 litres** at 85 °C, an increase of about **3.15%**. Compare that with the stainless tank's own volume growth of about 0.36%. The water grows nearly nine times as much as the tank that holds it. In an open, vented tank, the surplus simply rises in the tank or overflows. In a closed system, it has nowhere to go, which is why closed hot water systems need expansion vessels, Chapter 6's subject.

```figure
type: compare
title: Density of water and the volume of one kilogram
cols: Density, kg/m³ | Volume of 1 kg, litres
caption: Published densities of water at atmospheric pressure. Volume is 1,000 ÷ density. Between 15 °C and 85 °C, a kilogram of water grows from about 1.0009 to about 1.0324 litres, about 3.15%.
- 4 °C | 999.97 | 1.0000
- *15 °C, HW-60 cold | 999.10 | 1.0009
- 40 °C | 992.22 | 1.0078
- 60 °C | 983.20 | 1.0171
- *85 °C, HW-60 hot | 968.61 | 1.0324
```

## Gases grow most of all

Gases expand far more again, roughly in proportion to their absolute temperature, as Chapter 7 explains. Air warmed from 20 °C to 85 °C at constant pressure grows by about 22%. If it cannot grow, because it is sealed in a vessel, its pressure rises instead.

## Which temperature change to use

The ΔT in the calculation is the difference between the temperature at which the part was made, fitted or installed and the temperature it reaches in service. Three questions settle it.

- **From what temperature?** A pipe installed on a cold winter morning starts from a lower temperature than one installed in summer, and grows more when it warms. HW-60's design assumed an installation temperature of 15 °C, recorded on the drawings, and the installers were asked to note the actual temperature on the day.
- **To what temperature?** The metal's temperature, not the fluid's or the air's. An insulated pipe's metal is close to its water temperature. A bare pipe in wind may be cooler. A pipe in the sun may be far hotter than the air.
- **Both ways?** Many systems cycle between hot and cold, and some go below their installation temperature, such as outdoor equipment on a winter night. The design must allow for the full range in both directions.

Uneven temperatures also matter. If one side of a pipe is hotter than the other, as happens when hot water sits above cold in a partly filled horizontal pipe, the hot side grows more and the pipe bows. A tank heated from one side leans. These effects are second-order for HW-60, but they cause real failures in process plant where temperature differences across equipment are large.

## Coefficients are averages

A published coefficient is usually an average over a stated temperature range, often from about room temperature to 100 °C. Most metals' coefficients rise slowly with temperature, so an average taken from 20 °C to 100 °C slightly understates growth at several hundred degrees. For HW-60's range, 15 °C to 85 °C, a room-temperature to 100 °C average is appropriate. For furnace parts, exhaust systems and steam lines, the designer uses the mean coefficient over the actual range, from the material's data sheet or a handbook table of mean coefficients, rather than a single room-temperature figure. Plastics are more variable still: their coefficients depend on the grade, fillers and fibre orientation, which is why the PVC range in the bar chart is so wide.

## Check the growth on site

Calculated growth can be checked with a tape. When HW-60's pipe was commissioned, the installers marked the pipe beside each guide while it was cold, at 15 °C, with a pen line on the pipe and a matching line on the guide. After the system had run at 85 °C for an hour, they measured how far each mark had moved. Near the anchor at one end, the marks hardly moved; near the expansion loop, about 30 m away, they had moved about 36 mm, matching the calculation for half the run. A mark that has not moved where it should means the pipe is stuck in a guide; one that has moved more than calculated means an anchor has slipped. Both are found far more cheaply on the day than after a guide or anchor has failed. The measurements went into the commissioning record, with the date, the temperatures and who took them.

## Growth every day: cycles and fatigue

Expansion is not a one-off event. HW-60's pipe heats every morning and cools every night, and on a weekend shutdown cools further. Each cycle moves every guide, flexes every loop and stresses every anchor and branch connection. Over ten years, that is thousands of cycles. Materials that cope easily with one movement can crack after thousands, a process called fatigue. That is why expansion loops are sized for an allowable stress range, as Chapter 4 explains, and why branch connections near anchors are checked for the movement of the main pipe they join.

## Parts made of two materials

When two materials with different coefficients are joined, they cannot both grow freely. A steel bolt clamping aluminium parts, a copper pipe soldered to a steel bracket, a plastic cover screwed to a metal frame: each pair fights as the temperature changes. The difference in coefficients, multiplied by the length between fixings and the temperature change, is the movement one material tries to make relative to the other. Unless the joint allows it, with slotted holes, sliding fixings or flexible mounts, the difference becomes stress, bowing or loosening. Chapter 8 returns to this for machines.

## A failure case: the wrong coefficient

This is an illustration. Before HW-60's present design, an extension of the hot water line was added by a contractor who allowed for its expansion with a bellows expansion joint in a straight run between two anchors. The contractor's calculation used a coefficient of **12 × 10⁻⁶ per °C**, the figure for carbon steel, for what was a stainless steel line, and selected a joint with a working movement of about 55 mm for the 60 m run.

With carbon steel's coefficient, the calculated growth was **12 × 10⁻⁶ × 60,000 × 70 ≈ 50.4 mm**, which the joint covered. With stainless steel's correct coefficient, the growth was about **72.7 mm**, nearly **44%** more. At full temperature, the joint was compressed well beyond its rated movement.

The detection came from the factory's maintenance inspection, which found the bellows' convolutions closed up and distorted at full temperature, and scored guides at one anchor where the pipe had been forced sideways. The correction was to replace the joint with one rated for the correct movement, with a margin, and to check the anchors and guides for damage. The calculation record now states the material and the coefficient used, so the check can be repeated by anyone.

## How this applies to a small Australian business

For every long run, large vessel or close fit, calculate the growth: α × L × ΔT, with the coefficient for the actual material and the temperature change from installation to the hottest and coldest service conditions. Remember that areas grow by about 2α and volumes by about 3α, that holes grow with their material, and that stainless steel, aluminium and plastics all grow more than carbon steel. Use density tables, not a single coefficient, for water. And write down the material, coefficient and temperatures used, because the commonest error is a coefficient for the wrong material.

## Exercise: a PVC drain

A 6 m run of PVC drain pipe carries hot wash-down water at up to **60 °C**. It was installed at **20 °C**. Using the published range of 54 to 110 × 10⁻⁶ per °C, and 70 × 10⁻⁶ as a typical value, how much does it grow? How does that compare with a 6 m stainless steel pipe over the same change?

**Worked answer.** The temperature change is **40 °C**. With the typical coefficient, the PVC grows **70 × 10⁻⁶ × 6,000 × 40 ≈ 16.8 mm**, and across the published range between about **13.0 mm** and **26.4 mm**. A 6 m stainless pipe over the same change grows **17.3 × 10⁻⁶ × 6,000 × 40 ≈ 4.2 mm**, about a quarter as much. The PVC drain needs expansion joints or sliding supports designed to its maker's instructions, and the wide published range is a reminder to use the maker's figure for the actual product.
