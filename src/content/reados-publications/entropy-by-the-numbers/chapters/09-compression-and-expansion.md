---
book: entropy-by-the-numbers
chapterSlug: compression-and-expansion
order: 9
title: "Compression and expansion"
description: "The minimum work to compress air, isothermal and isentropic benchmarks, why intercooling helps, what heat of compression is worth, and why air tools cost far more energy than electric ones."
draft: false
---

A compressor is a machine for creating exergy in a gas, and almost every compressor in a small plant is judged by a single number on a datasheet. The trouble is that there are several numbers it could be, measured against different ideals, and they differ by twenty percentage points or more for the same machine. The second law clears up the confusion by asking one question: what is the least work that could possibly produce this air, and how far is the machine from it?

This chapter calculates the minimum work for the running case's compressor, compares it with the isentropic benchmark that most efficiency figures use, shows why intercooling moves a compressor towards the minimum, and asks what the heat of compression is worth. It then follows the air to its end use, an air tool, and ends with two quotations whose efficiency figures could not be compared.

## The minimum work: reversible and isothermal

To compress a gas from the surroundings' pressure and temperature to a higher pressure at the same temperature, the least work is the increase in its exergy. For an ideal gas that is the reversible isothermal work, which Chapter 4 found by another route:

W_min = ṁ R T₀ ln(p₂ ÷ p₁)

For the plant's 0.06 kg/s of air, from 1.01325 bar to 8 bar absolute at 20 °C, W_min = 0.06 × 0.287 × 293.15 × ln(7.895) = **10.43 kW**. No machine can deliver this air with less, however it is built. The real compressor takes 22 kW. Its **isothermal efficiency**, the minimum divided by the actual, is 10.43 ÷ 22 = **47.4%**.

The isothermal process is the reversible ideal because the compressed air leaves at the surroundings' temperature, which is where the plant uses it after the aftercooler. Any compression that lets the air get hot, and then cools it back down, has thrown away the exergy of that heat.

## The isentropic benchmark

Real compressors work too fast for much heat to leave the air during compression, so the air gets hot. The natural ideal for such a machine is a reversible adiabatic, or **isentropic**, compression, in which the air's entropy stays constant. For an ideal gas with a constant ratio of specific heats γ, the discharge temperature and work are:

```figure
type: formula
title: Isentropic compression of an ideal gas
formula: T₂s = T₁ × (p₂ ÷ p₁)^((γ − 1) ÷ γ)
formula: W_s = ṁ × c_p × (T₂s − T₁)
caption: For air near ambient, γ = 1.4 and c_p = 1.005 kJ/kg·K. The isentropic work is the benchmark behind most compressor efficiency figures, but it is not the minimum: it includes the exergy of heat that the aftercooler then rejects.
- T₂s | discharge temperature of an ideal adiabatic compressor, K
- γ | ratio of specific heats, 1.4 for air
step: Single stage, 1.01325 to 8 bar: T₂s = 293.15 × 7.895^0.2857 = 529.0 K, or 255.9 °C
step: W_s = 0.06 × 1.005 × (529.0 − 293.15) = 14.22 kW
step: Isentropic efficiency of the real machine: 14.22 ÷ 22 = 64.7%
```

The same compressor is 64.7% efficient against the isentropic benchmark and 47.4% against the isothermal one. Neither figure is wrong. They measure the machine against different ideals, and the gap between the ideals, 14.22 − 10.43 = 3.79 kW, is the exergy destroyed when hot air at 255.9 °C is cooled back to 20 °C in the aftercooler. An isentropic compressor would be reversible, but the plant does not want hot air; the cooling that follows makes the overall process irreversible.

```figure
type: bars
title: Work to deliver the running case's compressed air
unit: kW
max: 24
caption: This is an illustration for 0.06 kg/s from 1.01325 to 8 bar absolute at 20 °C. Two stages with intercooling to 20 °C at the optimum intermediate pressure, 2.85 bar, close more than half the gap between single-stage isentropic and isothermal work.
- * Reversible isothermal, the true minimum | 10.43
- Two isentropic stages, intercooled | 12.14
- One isentropic stage | 14.22
- Real compressor | 22.0
```

## Intercooling

Because the isothermal process is the minimum, any way of keeping the air cooler during compression saves work. The classic method is to compress in stages and cool the air between them. With two stages and an intercooler returning the air to 20 °C, the work is least when each stage has the same pressure ratio, which puts the intermediate pressure at the geometric mean, √(1.01325 × 8) = 2.85 bar. Each stage then has a ratio of 2.81, its air reaches only 120.7 °C, and the total isentropic work is 12.14 kW, against 14.22 kW for one stage. More stages would approach the isothermal 10.43 kW, at the cost of more machinery.

Small screw compressors achieve a similar effect differently: oil injected into the compression chamber absorbs heat as the air is compressed, keeping discharge temperatures far below the single-stage isentropic figure. The principle is the same. Heat removed during compression is work not spent.

## Inlet temperature

The minimum work is proportional to the absolute temperature of the intake air. A compressor drawing air from a hot plant room at 35 °C instead of outside air at 20 °C needs 308.15 ÷ 293.15 = 1.051 times the work, 5% more, for the same mass of air. Ducting the intake from a cool, shaded outside location is one of the cheapest compressed-air improvements there is, and the second law explains why it works. The intake should still be protected from rain, dust and exhaust fumes, since dirty air costs more in filter pressure drop and wear than cool air saves.

## The heat of compression

Nearly all the 22 kW a compressor takes ends up as heat: in the aftercooler, the oil cooler and the motor. Only the 10.43 kW of air exergy survives as the product, and even that becomes heat when the air is eventually expanded at the point of use. Many oil-injected compressors offer heat recovery, capturing a large share of the input as hot water.

This is an illustration. Suppose 60% of the compressor's input, 13.2 kW, could be recovered as water at temperatures up to about 70 °C, a figure that would have to come from the manufacturer's data for the actual machine. Fed into the wash-water stream after the effluent exchanger of Chapter 6, it would raise 0.50 kg/s from 42 °C by 13.2 ÷ (0.50 × 4.18) = 6.3 K, to about 48 °C, and the heat pump would then do correspondingly less.

The exergy of that recovered heat is small, about 1.0 kW at the water's logarithmic mean temperature of 318.3 K, but its value to the plant is the 13.2 kW of heat that would otherwise be bought. Heat recovery from compressors is an example of the second-law principle from Chapter 6 working in the plant's favour: low-grade heat put to a low-grade duty, at the temperature it is already at.

## Expansion: using the air

Compressed air does work at the point of use by expanding, in a cylinder, an air motor or a nozzle. A perfect air tool supplied with air at 5 bar absolute and 20 °C could obtain at most the air's exergy, 134.3 kJ/kg, from Chapter 7. To deliver 1 kW of shaft work, it would need at least 1 ÷ 134.3 = 0.00745 kg/s of air.

Follow that air back to the compressor. The plant's compressor takes 22 kW for 0.06 kg/s, or 367 kW per kg/s, so 0.00745 kg/s costs at least 2.73 kW of electricity. **Even a perfect air tool, fed by this plant's compressor and regulators, takes 2.73 kW of electricity for each kilowatt of shaft work.** Real air tools fall well short of perfect, so the true figure is higher. An electric tool takes its power straight from the supply, losing only its motor's inefficiency.

```figure
type: tree
title: Where the electricity goes on its way to a perfect air tool's shaft
caption: This is an illustration per kilowatt of shaft work at a perfect air tool. The compressor destroys more than half its input; the regulators destroy part of what is left; even the perfect tool can use only the air's remaining exergy.
- 2.73 kW electricity into the compressor
  - 1.44 kW destroyed in compression and aftercooling | the 52.6% between the real 22 kW and the 10.43 kW minimum
  - 1.29 kW exergy in the air at 8 bar
    - 0.29 kW destroyed in the regulators, 8 to 5 bar | Chapter 8's throttling loss
    - * 1.00 kW shaft work at the tool | the air's exergy at 5 bar, all used
```

Expansion can also be made to return work deliberately. Large gas-processing and refrigeration plants use expansion turbines in place of throttling valves, recovering part of the work that a throttle would destroy, and the external-work method of gas liquefaction relies on an expander to cool the gas further than a throttle could. In a small plant the flows are too small for such machines to pay, but the comparison shows what a throttle gives up: an expander and a regulator take the same air from the same high pressure to the same low one, and only the expander turns the drop into something useful.

This is why compressed air is best kept for jobs that need it, such as cylinders that must stall safely, tools that must run in wet areas and actions that must be fast and simple, and why converting continuous duties to electric drives is often worthwhile.

## Part load: running without producing

A compressor's efficiency at full load says little about its efficiency over a day, because demand varies and many compressors do not follow it smoothly. A fixed-speed machine controlled by loading and unloading spends part of its time running unloaded, drawing a substantial fraction of its full-load power while delivering no air at all. In second-law terms, every kilowatt-hour drawn while unloaded is exergy destroyed with no product, a second-law efficiency of zero for that interval.

Variable-speed compressors, and systems with several compressors sequenced to match demand, reduce this waste by producing air only as it is needed. The amount they save depends on the plant's demand profile, which is why a logged record of flow or power over a typical week is worth more than any datasheet in choosing a machine. The isothermal minimum still applies at every moment: the useful product is the air's exergy, and the comparison is between that and the electricity actually drawn, averaged over real operation.

## Measuring a compressor on site

A plant can check its own compressor against the minimum without special instruments beyond a power meter and a flow meter.

1. Log the electrical input at the compressor's supply, including the dryer if it is part of the package, over at least a full production day.
2. Log the delivered flow, as free air delivery or mass flow, with a flow meter on the main header, and the discharge pressure.
3. Calculate the isothermal minimum for each interval from the mass flow and pressure, using the intake temperature.
4. Divide the total minimum by the total electrical energy over the same period. That is the system's average isothermal efficiency, including unloaded running.
5. Repeat after any change, such as a setpoint reduction, a leak repair or a new machine, to see the effect in the same terms.

The result is a single, honest figure for the whole compressed-air supply, comparable over time and between sites. It will usually be lower than the full-load figure on any datasheet, and the size of the difference is itself a useful finding: it measures how much the plant loses to part-load running, which better control can recover without touching the compressor itself.

## The error: two quotations, two benchmarks

This is an illustration. When the plant sought quotations for a replacement compressor, supplier A offered a machine with "72% efficiency" and supplier B a machine with "52% efficiency". The purchasing officer, comparing the numbers, favoured A.

The engineer asked both suppliers which benchmark their figures used. A's figure was an isentropic efficiency; B's was an isothermal efficiency. Converted to power for the plant's duty, A's machine would take 14.22 ÷ 0.72 = 19.75 kW and B's 10.43 ÷ 0.52 = 20.06 kW. The two were within 2% of each other, well inside the uncertainty of quoted figures, and the 20-point difference in "efficiency" was entirely a difference in definitions.

The plant now asks every compressor supplier for one figure: the **specific power**, the electrical input in kilowatts at the motor terminals, including fans and controls, for a stated free air delivery at a stated pressure. That figure can be compared directly with the isothermal minimum for the same duty, and between suppliers, without any argument about benchmarks.

## How this applies to a small Australian business

For many small manufacturers, the air compressor is the largest single electrical load after refrigeration, and it runs for long hours. The second law gives three practical lessons. Generate air at the lowest pressure the plant truly needs, because the minimum work rises with the logarithm of pressure and every bar of excess is also throttled or leaked away, as Chapter 8 showed. Keep the intake cool. And treat compressed air as an expensive form of energy, about three times the electricity per unit of useful work even with perfect tools, so that it is reserved for jobs that justify it.

Heat recovery from oil-injected compressors is often one of the best-paying energy projects in a plant with a hot water demand, because it turns a large, steady heat rejection into heat that would otherwise be bought. The manufacturer's data, not a rule of thumb, should set the recoverable amount and temperature.

## Exercise: three stages

Find the total isentropic work to compress 0.06 kg/s of air from 1.01325 to 8 bar absolute in three equal-ratio stages, with intercooling to 20 °C before each stage after the first. Compare it with the one-stage, two-stage and isothermal values.

**Worked answer.** Each stage has the same pressure ratio, the cube root of the overall ratio: 7.895^(1/3) = 1.991. The discharge temperature of each stage is 293.15 × 1.991^0.2857 = 356.9 K, or 83.8 °C. Each stage's work is 0.06 × 1.005 × (356.9 − 293.15) = 3.84 kW, so the total is 3 × 3.84 = **11.53 kW**.

The sequence is 14.22 kW for one stage, 12.14 kW for two, 11.53 kW for three and 10.43 kW for infinitely many, the isothermal limit. Each extra stage saves less than the one before, which is why small plant compressors seldom have more than two.
