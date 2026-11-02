---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: the-wheatstone-bridge-leads-and-excitation
order: 4
title: "The Wheatstone bridge, leads and excitation"
description: "How a Wheatstone bridge turns tiny resistance changes into millivolts, how quarter, half and full bridges compare, and how lead resistance, cable heating and excitation errors are found and removed."
draft: false
---

The resistance changes worked out in Chapter 2 are a few parts per million. Measuring them directly would be like weighing a ship's captain by weighing the ship with and without him aboard. The Wheatstone bridge avoids the problem by never measuring the whole resistance: it compares resistances with each other and responds only to the differences. Arranged correctly, the same circuit adds up the strain signals of several gauges and cancels their common changes with temperature.

This chapter sets out how the bridge works and what quarter, half and full bridges deliver, explains the load cell's rated output in millivolts per volt, and works the signal from BH-2 through its junction box and cable to the indicator. It then shows how the resistance of leads and cables adds errors, how three-wire and six-wire connections remove them, and how a cable through a hot roof space made the afternoon batches read light.

## How the bridge works

A Wheatstone bridge is four resistors arranged in a diamond, with the excitation voltage applied across one diagonal and the output taken across the other. Each side of the diamond is a voltage divider, and the output is the difference between the two dividers' midpoint voltages. When the four resistances are equal the two midpoints sit at exactly half the excitation and the output is zero, however large the excitation and however much the resistances have all drifted together.

Now let the resistances change by small fractions. Numbering the arms around the diamond so that arms 1 and 2 share one output corner and arms 3 and 4 the other, the output is, to a very good approximation, a quarter of the sum of the changes in arms 1 and 3 minus the changes in arms 2 and 4. Changes in opposite arms add; changes in adjacent arms subtract.

```figure
type: formula
title: Output of a Wheatstone bridge of four equal arms
formula: V_out ÷ V_ex ≈ ¼ × (ΔR₁ ÷ R − ΔR₂ ÷ R + ΔR₃ ÷ R − ΔR₄ ÷ R)
formula: V_out ÷ V_ex ≈ (GF ÷ 4) × (ε₁ − ε₂ + ε₃ − ε₄)
caption: V_ex is the excitation voltage, V_out the output, R the resistance of each arm and ε₁ to ε₄ the strains of gauges in arms 1 to 4. Arms 1 and 3 are opposite each other, as are 2 and 4. Exact for one active arm only to first order; the exact quarter-bridge result is given in the next figure.
- Opposite arms | changes add
- Adjacent arms | changes subtract
- Equal change in all arms | no output
```

That rule is the whole design method. To get the most signal, put gauges that stretch in opposite arms and gauges that shorten in the other two, so that all four changes add. To cancel an unwanted effect such as temperature, make sure it changes adjacent arms equally, so that it subtracts out.

## Quarter, half and full bridges

A quarter bridge has one active gauge and three fixed resistors. It is common in stress surveys because each gauge needs only one bridge completion network, but it has the least signal, no built-in temperature compensation and a small non-linearity, because only one side of the bridge moves. At 1,000 µε with a gauge factor of 2.0 the exact output is 0.4995 mV/V instead of 0.5000: 0.1% low, rising to 0.2% at 2,000 µε.

A half bridge has two active gauges in adjacent arms, one stretched and one shortened, as on the top and bottom faces of a beam in bending. The signals add, the output doubles and the non-linearity disappears for equal and opposite strains. Temperature changes common to both gauges cancel.

A full bridge has four active gauges. With two stretched and two shortened by the same strain, the output is GF times the strain, four times the quarter bridge, linear, and compensated for any temperature change common to all four. That is how load cells are wired.

```figure
type: compare
title: Bridge arrangements at 1,000 µε with a gauge factor of 2.0
cols: Active gauges | Output | Linearity | Temperature compensation
rowhead: Bridge
- Quarter | 1 | 0.4995 mV/V | 0.1% low at this strain | None in the bridge; needs a matched gauge or a dummy
- Half, bending | 2 (+ε, −ε) | 1.0 mV/V | Linear | Common temperature changes cancel
- Full, Poisson (column) | 4 (2 × +ε, 2 × −0.3ε) | 1.3 mV/V | Very slightly non-linear | Common changes cancel
- * Full, bending or shear | 4 (2 × +ε, 2 × −ε) | 2.0 mV/V | Linear | Common changes cancel
caption: Outputs from the bridge formula; the quarter bridge from the exact expression (GF ε ÷ 4) ÷ (1 + GF ε ÷ 2). The Poisson bridge has two gauges along the axis of a column and two across it (Chapter 5).
```

## Millivolts per volt

The bridge output is proportional to the excitation. Double the excitation and the output doubles. Load cell makers therefore state their cells' sensitivity as a rated output in millivolts per volt of excitation at rated load: 2 mV/V for BH-2's cells. Good indicators also measure ratiometrically: they compare the signal with the excitation actually reaching the bridge, so that a slow drift of the excitation supply does not change the reading. That works only if the indicator knows the voltage at the bridge, not at its own terminals, which is the subject of the section after next.

## The case: BH-2's signal

BH-2's three cells are each rated 2,000 kg at 2 mV/V, so together they produce 2 mV/V for 6,000 kg on the hopper if the load is shared equally. In the junction box the three cells' outputs are connected in parallel through small trimming resistors, so the indicator sees the average of the three outputs, which is proportional to the total load. With 10 V excitation:

```figure
type: steps
title: From kilograms on BH-2 to microvolts at the indicator
caption: This is an illustration. Three 2,000 kg, 2 mV/V cells in parallel, 10 V at the bridges, equal sharing. A batch is weighed as the change from the empty hopper, so the net signal is what the indicator must resolve.
- Empty hopper, 1,150 kg: 1,150 ÷ 6,000 × 2 mV/V | 0.383 mV/V, 3.83 mV
- * Full batch, 3,650 kg gross | 1.217 mV/V, 12.17 mV
- Net batch, 2,500 kg | 0.833 mV/V, 8.33 mV
- One kilogram | 3.33 µV
- One 1 kg display division in 2,500 | 3.33 µV per division
```

Every indicator's datasheet states the smallest signal per display division it can resolve stably and the largest number of divisions it supports. With 3.33 µV per division BH-2's indicator is comfortably inside both, but a system with smaller cells' outputs used at a small fraction of their capacity, or with low excitation, can fall below the indicator's limit and give a reading that jitters by a division or two. The check is simple arithmetic and should be done before buying the cells.

The excitation also loads the indicator. Each 350 Ω bridge draws 28.6 mA at 10 V, so BH-2's three cells draw 85.7 mA together. Indicators state how many 350 Ω cells they can drive; a large vessel on eight cells needs 229 mA at 10 V, beyond some indicators, which then need a lower excitation or an external supply.

## The junction box and corner trimming

Paralleling the cells gives the average of their outputs, which is proportional to the total load only if every cell has the same sensitivity. Real cells do not quite. BH-2's three cells came with calibration certificates giving rated outputs of 2.002, 1.996 and 2.004 mV/V, all within the maker's ±0.25% tolerance. Calibrated with weights spread over the hopper, the system reads the total correctly. But if the load sits towards one cell, as it does when meal piles up on the side under the inlet chute, the reading depends on which cell carries the extra.

```figure
type: compare
title: Reading of 500 kg placed over each BH-2 cell before trimming
cols: Cell rated output | Reading | Error
rowhead: Load over
- Cell 1 | 2.002 mV/V | 500.3 kg | +0.3 kg
- Cell 2 | 1.996 mV/V | 498.8 kg | −1.2 kg
- Cell 3 | 2.004 mV/V | 500.8 kg | +0.8 kg
caption: This is an illustration. With the span calibrated to the average output, 2.0007 mV/V, a load carried entirely by one cell reads in proportion to that cell's output. Real loads are shared, so real errors are smaller, but meal that heaps on one side shifts the load and the reading with it.
```

A spread of 2 kg on a 500 kg corner load is small here, but on a hopper with less uniform cells, or a platform scale where loads are placed anywhere, it matters. Junction boxes therefore include a trimming resistor in each cell's circuit, usually in series with its excitation or signal, so that each cell's contribution can be reduced slightly until a test load gives the same reading over every support. Chapter 8 describes the test, and the same adjustment is how a cell that has been replaced is matched to the others.

Some cells are made with their outputs matched to a much tighter tolerance and with their output resistance trimmed, so that they can be paralleled without adjustment. They cost more and are worth it on platform scales; on a hopper where the load is roughly central they are less important than a correct installation.

The junction box is also where moisture, loose terminals and wrongly connected sense wires live. It should be sealed to the conditions of the site, with its glands tight and a desiccant sachet inside if condensation is possible, and opened only when necessary. Every terminal screw that is loose adds a contact resistance that changes with vibration and temperature, and in the excitation or signal circuit that becomes a reading that wanders for no visible reason.

## Leads in a quarter bridge

In a stress survey with a quarter bridge, the active gauge may be ten metres or more from the instrument. A two-wire connection puts both leads in series with the gauge, in the same arm. Two 10 m leads of 0.5 mm² copper have about 0.69 Ω between them. That has two effects.

First, the gauge's resistance change is now a fraction of 350.69 Ω, not 350 Ω, so the reading is 0.2% low. That is a small span error and can be corrected. Second, and much worse, the copper leads' resistance changes with temperature by 0.39% per kelvin, which in the gauge's arm looks like strain: 0.69 × 0.00393 ÷ (350 × 2.0) = 3.9 µε for each kelvin the leads warm. A lead that runs across a sunny floor during a test can produce tens of microstrain.

The cure is the three-wire connection. One lead goes to each end of the gauge, and a third joins one end to the bridge's output corner, so that one lead sits in the active arm and the other in the adjacent completion arm. Lead resistance and its changes now appear in adjacent arms and cancel, and the third lead carries almost no current. Every stress-analysis data logger supports it, and it should be the default.

## Cables, excitation and six-wire sensing

A load cell bridge sits in the cell, so its four arms do not include the cable. But the cable still matters, because it carries the excitation. The voltage reaching the bridges is the indicator's excitation less the voltage drop in the cable's two excitation cores, and that drop changes with the cable's temperature.

BH-2's original installation used a four-core cable from the junction box to the indicator, 20 m of 0.22 mm² copper cores. Each core has about 1.56 Ω, so the excitation loop has 3.13 Ω, feeding three 350 Ω bridges in parallel, 116.7 Ω. Only 9.74 V of the indicator's 10 V reaches the cells, 2.6% short. A calibration with weights simply absorbs that loss, so on the day of calibration all is well.

```figure
type: compare
title: Excitation at BH-2's load cells with a four-wire home-run cable
cols: Cable loop resistance | Voltage at the cells | Error on a 2,500 kg batch
rowhead: Condition
- Calibration day, cable at 20 °C | 3.13 Ω | 9.739 V | 0 kg (calibrated out)
- * Afternoon, cable 30 K warmer | 3.50 Ω | 9.709 V | 7.7 kg light (−0.31%)
- Six-wire cable, any temperature | Sensed at the junction box | Measured, so corrected | about 0 kg
caption: This is an illustration. 20 m of 0.22 mm² cores at 1.72 × 10⁻⁸ Ω·m, three 350 Ω bridges in parallel, 10 V at the indicator; copper's resistance rises 0.393% per kelvin. A six-wire cable adds two sense cores that carry no current, so the indicator measures the excitation actually at the junction box and its ratiometric measurement removes the error.
```

## When it goes wrong: the afternoon batches

After a hot week, the mill's quality officer noticed that the feed going to the pellet line was running slightly short of its formulated mass on afternoon batches, by about 7 to 8 kg in 2,500 kg, while morning batches were right. The difference was within the batch tolerance but consistent, and it cost money: the shortfall was made up by the cheapest ingredient, so formulations drifted.

Check weights placed on the empty hopper showed the same pattern: the span read about 0.3% low after midday and correct in the morning. The cell temperature hardly changed, because the hopper is inside the mill. But the 20 m cable from the junction box to the control room ran through the roof space under a steel roof, where the afternoon temperature was about 30 K above the morning's. The cable's resistance rose by 0.393% per kelvin × 30 K = 11.8%, from 3.13 Ω to 3.50 Ω, and the excitation at the cells fell by 0.31%, which the indicator, sensing at its own terminals, could not see.

The fix was a six-wire cable with sense cores, connected to the indicator's sense terminals, and a new route through the mill rather than the roof space. The afternoon shortfall disappeared. A four-wire connection is acceptable only where the cable is short and its temperature stable; where either is not true, the extra two cores pay for themselves.

Electrical noise is the other enemy of a microvolt signal. Load cell cables should run in their own conduit or tray, away from motor and drive cables, with their screen earthed at one end as the indicator maker specifies, so that interference from the screw feeder's drive and the mill's motors is not picked up and turned into a jittering reading.

## Self-heating

The excitation heats the gauges. In a full bridge at 10 V each gauge has 5 V across it and dissipates 5² ÷ 350 = 71 mW. On a load cell's thick steel spring element this is harmless: the heat spreads into the steel and all four gauges warm together, so it cancels. On a thin part, plastic, composite or a small bracket, the same power can warm the gauge several kelvin above the surface and make the reading drift as air moves past. The remedy is lower excitation: at 5 V each gauge dissipates a quarter as much, 18 mW, at the cost of half the signal.

## Exercise: halving the excitation

The mill considers replacing BH-2's indicator with one that supplies 5 V excitation and is specified to resolve 0.5 µV per display division, with a six-wire connection.

1. What is the signal per kilogram and for a full 2,500 kg net batch at 5 V?
2. Can the new indicator show 1 kg divisions stably?
3. What happens to the gauges' self-heating and to the six-wire correction?

**Answer.**

1. Each kilogram gives 1 ÷ 6,000 × 2 mV/V × 5 V = 1.67 µV, and a 2,500 kg net batch 4.17 mV, half the 10 V values.
2. Yes. 1.67 µV per division is more than three times the indicator's 0.5 µV limit, so 1 kg divisions are resolvable, although with less margin than before against electrical noise from the nearby motors and drives.
3. Self-heating falls to a quarter, 18 mW per gauge, which matters little on these cells. The six-wire connection still measures the excitation at the junction box, so cable temperature is still corrected. Because the indicator measures ratiometrically, the lower excitation itself causes no error, only less signal.
