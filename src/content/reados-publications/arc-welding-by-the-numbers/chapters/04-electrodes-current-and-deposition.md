---
book: arc-welding-by-the-numbers
chapterSlug: electrodes-current-and-deposition
order: 4
title: "Electrodes, current and deposition"
description: "Choose an electrode size and current from maker's data, measure deposition rate and losses as a 1921 test did, and work out how many electrodes a job needs."
draft: false
---

In manual metal arc welding the electrode is both the source of the arc and the source of the weld metal. Its diameter sets the range of current it can carry, the current sets how fast it melts, and only part of what is bought ends up in the joint: the stub is thrown away, some metal is lost as spatter and fume, and the coating, essential to the weld, is not weld metal at all. Estimating a job needs all of these numbers.

This chapter chooses the conveyor-frame electrodes and currents from maker's data, measures their deposition the way a 1921 test did, and works out how many electrodes each frame needs.

## What the coating does

A covered electrode is a steel core wire coated with a flux. As the arc melts it, the coating forms a gas shield that keeps air away from the molten metal, a slag that floats on the weld and protects it while it cools, and ionising compounds that keep the arc stable. It can add alloying elements and deoxidisers to the weld metal, and many coatings contain iron powder that adds to the deposit.

The 1921 railway welders were moving from bare wire to coated electrodes. Wanamaker and Pennington reported a comparison in which the loss of metal as vapour and spatter was about 12% with bare wire and about 5.9% with a coated electrode, a reduction of about half. Coatings have developed enormously since, and the low-hydrogen electrodes used on the conveyor frames have coatings designed to keep hydrogen out of the weld, which is why they must be stored and handled as the maker specifies. The hydrogen question links to the preheat discussion in [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/preheat-hydrogen-and-cooling/).

## Reading an electrode classification

Electrodes are sold under classifications that summarise what they deposit and how they are used. The data sheet in this chapter, for example, lists classifications under the American AWS A5.1 system and its metric counterpart, and Australian purchasers will also see classifications to AS/NZS 4855, the Australian standard for covered electrodes for non-alloy and fine-grain steels. Each system encodes, in a short string of letters and digits, the weld metal's strength, the welding positions the electrode suits, the type of coating and current it uses, and, where stated, the diffusible hydrogen level of the deposit and its toughness at a test temperature.

The classification matters to the estimator only indirectly, but it matters to the job directly. The welding procedure names the classification, and sometimes the specific brand, that was qualified; a substitute must meet the same classification and any additional requirements in the procedure, such as hydrogen level or toughness. The conveyor shop's structural procedures specify a low-hydrogen classification with a stated maximum hydrogen level, because the frames include thicker plate at the head and tail ends and some higher-strength brackets.

The classification also tells the welder which current and polarity to use. The 1921 bare wire was run on direct current with the electrode negative, as Chapter 1 described; the low-hydrogen electrodes on the conveyor frames are run on direct current with the electrode positive, or on alternating current where the data sheet allows. Running an electrode on the wrong polarity changes the arc, the penetration and the deposition, and can make a good electrode weld badly.

## Choosing size and current

Each electrode size has a current range set by the maker. Below it the arc is unstable and the weld lacks fusion; above it the electrode overheats, its coating breaks down and spatter and porosity increase. As one example, the data sheet for Hobart 418, a low-hydrogen electrode classified to AWS A5.1 E7018 H4R and A5.1M E4918, gives these amperage ranges and optimum settings:

```figure
type: range
title: Amperage range by diameter for one low-hydrogen electrode
unit: A
min: 50
max: 400
caption: Ranges and optimum currents from the Hobart 418 data sheet, as one maker's data. Other electrodes, even of the same classification, have their own ranges. The data sheet also advises reducing the optimum amperage by 15% out of position.
- 2.4 mm (3/32 in) | 75 | 100 | optimum 90 A
- 3.2 mm (1/8 in) | 90 | 150 | optimum 130 A
- *4.0 mm (5/32 in) | 110 | 230 | optimum 170 A
- 4.8 mm (3/16 in) | 150 | 300 | optimum 220 A
- 6.4 mm (1/4 in) | 270 | 380 | optimum 340 A
```

The conveyor shop's settings, 130 A for 3.2 mm and 170 A for 4.0 mm, sit at those optimum values, but the shop's own electrodes come from another maker, and its procedures were qualified with that maker's electrodes and data. The ranges are similar for electrodes of the same classification, but the shop never assumes they are identical.

Larger electrodes carry more current and deposit metal faster, so they are used wherever the joint and position allow. They also put more heat into the work, need more skill out of position and may not fit into a narrow root. The shop uses 4.0 mm for the flat and horizontal fillet welds on the frames and 3.2 mm for roots, vertical and overhead work, and the small brackets.

## A 1921 deposition test

Wanamaker and Pennington described a careful test to measure three things: the energy used per pound of metal, the loss of electrode as stub ends and vapour, and the rate at which metal could be deposited. Coated electrodes 3/16 inch in diameter were weighed before coating, and a piece of boiler plate was weighed before and after welding a single layer on it, with the scale removed. The arc ran for 33 minutes at an average of 140 A and 21 V.

The weighed results were:

- electrode used: 1.5935 lb (about 0.723 kg);
- metal deposited on the plate: 1.25 lb (0.567 kg);
- stub ends: 0.25 lb (0.113 kg), 15.7% of the electrode used;
- lost as vapour and thrown from the arc: 0.0937 lb (0.042 kg), 5.9%;
- deposited: 78.4% of the electrode used.

The deposition rate was 1.25 lb in 33 minutes, about 2.27 lb an hour, or about 1.03 kg an hour. The welding equipment drew 2,976.9 watt-hours, which the authors expressed as 1.862 kWh per pound of electrode used and 2.370 kWh per pound deposited. Recalculating from their figures gives 2,976.9 ÷ 1.25 ≈ 2,382 Wh per pound deposited, slightly above their printed 2.370, a small discrepancy within their rounding. Per kilogram, that is about 5.2 kWh for each kilogram deposited.

```figure
type: bars
title: Where the electrode went in the 1921 deposition test
unit: % of electrode used
max: 100
caption: Results reported by Wanamaker and Pennington for coated 3/16 inch electrodes, weighed without their coating. The stub was the largest loss; vapour and spatter were small.
- *Deposited on the plate | 78.4
- Stub ends | 15.7
- Vapour and metal thrown from the arc | 5.9
```

Note what the 1921 percentages are based on: the weight of core wire, because the coating was removed before weighing. Modern data sheets usually state deposition efficiency on a different basis, and the basis must be checked before figures from different sources are compared.

## Measuring the shop's own electrodes

This is an illustration. The shop repeated the essence of the 1921 test with its own 4.0 × 350 mm low-hydrogen electrodes at 170 A. It weighed a batch of new electrodes, a test plate, the plate after welding and the stubs, each burnt down to the shop's standard 50 mm stub. The results, averaged over twenty electrodes, were:

- gross mass of a new electrode, core and coating: **48 g**, of which the core wire is about π/4 × 4.0² × 350 × 0.007 85 ≈ 34.5 g;
- metal deposited per electrode: **25 g**;
- arc time per electrode: about **60 s**.

The deposition rate is therefore 25 g per minute, which is **1.5 kg an hour**. The ratio of metal deposited to gross electrode mass bought is 25 ÷ 48 ≈ **0.52**. For each kilogram of weld metal, the shop buys about 1 ÷ 0.52 ≈ 1.9 kg of electrodes. Makers' deposition efficiencies are often higher, because they exclude the stub or are based on different conditions; the Hobart data sheet, for instance, lists efficiencies between about 62% and 73% for different diameters. The shop uses its own figure because it reflects its own stub length and practice.

```figure
type: stats
title: The shop's 4.0 mm electrode at 170 A
caption: This is an illustration of the shop's weighed trial. The deposited metal includes iron from the coating as well as the core wire.
- 48 g | Gross mass per electrode | core and coating
- *25 g | Metal deposited per electrode
- 60 s | Arc time per electrode
- 1.5 kg/h | Deposition rate
- 0.52 | Deposited ÷ gross mass bought
```

## How many electrodes a frame needs

Chapter 5 calculates that each conveyor frame's 20 m of 6 mm fillet welds needs about 3.11 kg of weld metal. At 25 g deposited per electrode, that is 3,109 ÷ 25 ≈ 124.4, so about **125 electrodes**, weighing 125 × 48 g = **6.0 kg**, and about 125 minutes, just over two hours, of arc time. Chapter 6 turns arc time into the welder's time.

The stub length matters more than it seems. If welders habitually discard electrodes with 75 mm left instead of 50 mm, each electrode deposits proportionally less. Of the 300 mm of each electrode normally burnt, only 275 mm would be used, about 8% less, so the frame would need about 136 electrodes instead of 125. Over a year of frames, the extra electrodes are a noticeable cost, and the shop's procedure states the stub length.

The number of electrodes also sets the number of stops and restarts. Each of the 125 electrodes on a frame means stopping the arc, removing the stub, fitting a new electrode, chipping slag at the crater if needed and restarting on the end of the previous run. Every restart is a place where porosity, lack of fusion or a cold lap can form, so restarts are a quality issue as well as a time issue. Chapter 6 counts the time; the procedure covers the restart technique; and a process with fewer stops, such as a continuous wire, removes most of them.

## Deposition rate and current

Within an electrode's range, deposition rate rises with current, because more current melts the electrode faster. The relationship is not exactly proportional, because part of the melting comes from resistance heating of the electrode itself, which follows current squared, and part from the arc. For estimating, the shop measures deposition at each of its procedure currents rather than scaling from one measurement.

The temptation is obvious: if a higher current deposits faster, why not use the top of the range? The answer lies in the failure below, and in the heat input limits that some procedures set (Chapter 1). Higher current means more heat per millimetre unless travel speed rises in proportion, larger weld pools that are harder to control out of position, more spatter and fume, and a greater risk of the coating overheating near the end of each electrode. The right current is the one the procedure qualified, chosen to give sound welds at a good rate for the joint and position.

## Storage and handling

Low-hydrogen electrodes absorb moisture from the air, and moisture in the coating brings hydrogen into the weld, which can cause cracking in hardenable steels or restrained joints. Makers specify how their electrodes are to be stored, how long they may be exposed after the container is opened, and whether and how they may be re-dried. The shop follows the maker's instructions, keeps opened electrodes in a heated holding oven at the temperature the maker specifies, and records when containers are opened. Electrodes that have been dropped in water, left out overnight or damaged are discarded, not dried and used.

## A failure: speeding up with current

This is an illustration. To get a large batch of frames out, one welder turned the 4.0 mm electrodes up from 170 A to about 195 A, still inside the maker's range but well above the procedure. The welds went down faster, but the supervisor noticed that the last third of each electrode was glowing red, that the arc became erratic as the electrode burnt down, and that there were pores near the end of each run. Two fillet welds also showed undercut along the upper toe.

At the higher current, the electrode's own resistance heating raised the temperature of the core and coating ahead of the arc. By the time the electrode was two-thirds burnt, the coating had overheated and partly decomposed, so it no longer produced its full gas shield and slag, which caused the porosity. The higher current also dug deeper and melted the top edge of the joint faster than the weld metal could fill it, causing undercut.

The welder returned to the procedure's 170 A. The porous and undercut welds were ground and repaired to the procedure. The shop reminded its welders that a current inside the maker's range is not necessarily inside the qualified procedure, and that faster deposition at a higher current is only worth having if it has been qualified.

## Exercise: the 3.2 mm electrode

The shop's 3.2 × 350 mm electrodes have a gross mass of 30 g. A weighed trial at 130 A shows each deposits 15 g in an arc time of 65 s. Calculate the deposition rate in kg per hour, the number of electrodes and the gross mass of electrodes needed per kilogram of weld metal, and compare them with the 4.0 mm electrode.

The deposition rate is 15 g in 65 s, which is 15 × 3,600 ÷ 65 ≈ 831 g an hour, about **0.83 kg/h**. One kilogram of weld metal needs 1,000 ÷ 15 ≈ 66.7, so **67 electrodes**, with a gross mass of about 67 × 30 g ≈ **2.0 kg**.

The 4.0 mm electrode deposits 1.5 kg/h, so the 3.2 mm electrode is about 45% slower, and it needs a similar mass of electrodes per kilogram deposited but more than twice as many electrode changes. That is why the shop keeps the 3.2 mm electrodes for work where the larger size cannot be used.
