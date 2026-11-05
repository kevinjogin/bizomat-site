---
book: cryogenic-design-by-the-numbers
chapterSlug: cryocoolers-and-the-heat-budget
order: 9
title: "Cryocoolers and the heat budget"
description: "Assemble CT-40’s heat budget, find where the cooler balances it, check the cooler against the Carnot limit, commission the budget by measurement, and a claim that broke the second law."
draft: false
---

Chapters 5 to 8 each counted one way heat gets into CT-40. This chapter adds them up and sets the total against what the cryocooler can remove. The meeting point of the two, where the cooler's capacity equals the heat load, is the temperature the cold stage will run at, and everything else, the strap's drop, the joints, the plate's temperature and the margin for a test coil, follows from it.

The chapter assembles CT-40's heat budget, finds its operating point on the cooler's curve, checks the cooler's efficiency against the Carnot limit with the BIZOMAT heat pump and chiller claim tool, tells how the budget was checked by measurement during commissioning, and ends with a cooler offered for a future 4 K insert whose data sheet claimed more than physics allows.

## CT-40's heat budget

This is an illustration. With the plate at its design temperature and 100 A in the leads, Chapters 5 to 8 give:

```figure
type: stack
title: CT-40's heat budget at 100 A, cold end at 40 K
unit: W
caption: This is an illustration. Leads from the Wiedemann–Franz minimum (Chapter 8); radiation from Parma's MLI formula with 10 layers (Chapter 7); supports from NIST's G-10 integral (Chapter 5); wiring from the phosphor bronze wires (Chapter 8). The G-10 push rod adds a further 0.005 W. Evaluated with the cold end at 40 K, which slightly overstates the loads at the plate's actual 33.6 K.
- Current leads, two at 100 A | 9.08
- Radiation through 10 layers of MLI | 1.07
- G-10 supports | 0.43
- Instrument wiring | 0.004
```

The total is **10.58 W**. One item, the current leads, is 86% of it. That is typical of small cryostats that carry real current: the leads dominate, and work on anything else gives little. It is also why Chapter 8's error, running the leads at 150 A, moved the plate so far.

## Where the cooler balances the load

A cryocooler does not regulate its power to suit the load; it runs at its full input power, and its cold stage settles at the temperature where its capacity equals the load. On CT-40's curve, capacity = 2.0 × (T − 25 K), so a load of 10.58 W puts the cold stage at 25 + 10.58 ÷ 2 = 30.3 K. The strap and joints of Chapter 6 then add 3.3 K.

```figure
type: range
title: CT-40 cold plate temperature against its 40 K target
unit: K
min: 25
max: 50
caption: This is an illustration. Cold stage on the fictional cooler curve; strap from NIST's RRR 50 integral; joints at 0.04 K/W each. The coil test case adds 3 W.
- Target | 40 | 40 | the coil must be tested at or below this
- * Design, 100 A | 30.3 | 33.6 | cold stage to plate
- With 3 W of coil heat | 31.8 | 36.2 | still inside the target
- Without MLI (Chapter 7) | 37.3 | 46.5 | outside
- Leads at 150 A (Chapter 8) | 36.1 | 44.2 | outside
```

The design case leaves 6.4 K between the plate and the target. In heat terms, the cooler has 30 W at 40 K, the budget takes 10.6 W, and about 19 W of capacity remains before the cold stage would reach 40 K; but the strap and joints make the plate warmer than the stage, so the useful margin is smaller. CT-40's laboratory works to a rule that the static budget should use no more than about half the cooler's rated capacity at the target temperature, leaving the rest for test heat, ageing of the cooler and the things the budget did not foresee.

## How uncertain is the budget?

Each line of the budget has its own uncertainty, and they are not alike. The leads' figure rests on the Wiedemann–Franz law and NIST's copper data, and Ballarino notes that real metals change the minimum by only a few per cent. The supports' figure rests on NIST's G-10 fit, stated to about 5%, and on the actual laminate, which can differ more. The radiation figure is the least certain: it rests on coefficients fitted to a different blanket in a different machine, and on workmanship, as the commissioning story showed.

```figure
type: compare
title: Uncertainty in CT-40's budget, item by item
cols: Budget | Plausible range | Main source of uncertainty
caption: This is an illustration of how a designer might judge the ranges; they are engineering judgements, not measured spreads.
- * Current leads | 9.08 W | about ±0.3 W | departure from the Wiedemann–Franz law; actual RRR
- Radiation, 10-layer MLI | 1.07 W | 0.6 to 2 W | blanket quality, penetrations, packing
- G-10 supports | 0.43 W | about ±0.05 W | laminate grade and fibre direction
- Wiring | 0.004 W | negligible | too small to matter
- Total | 10.58 W | about 10 to 11.8 W | radiation dominates the uncertainty
```

The range explains why the laboratory accepted a 0.2 W difference at commissioning and why its margin rule asks for half the cooler's capacity to be left free. A budget that used 90% of the capacity would be at the mercy of the least certain line.

## Kinds of cryocooler

CT-40's cooler is a Gifford–McMahon machine: a compressor at room temperature, joined by flexible gas lines to a cold head in which a displacer moves helium gas back and forth through a regenerator, a matrix of fine material that stores the cold from one half of the cycle and returns it in the other. Its strengths are robustness and a wide range of sizes; its weaknesses are the vibration of the moving displacer and the need for periodic service of the cold head.

Pulse-tube coolers replace the moving displacer with a gas column whose phase is controlled by valves and reservoirs at the warm end, so the cold head has no moving parts. They vibrate less and run longer between services, at some cost in efficiency for the same size. Stirling coolers, small and efficient, are common for single sensors such as infrared detectors and for space use. All of them are judged the same way: by their capacity curves at each stage, their input power, their second-law efficiency, their vibration at the cold end and their service intervals.

Two-stage versions of Gifford–McMahon and pulse-tube coolers have a first stage at about 30 to 60 K carrying tens of watts, and a second stage reaching 4 K or lower with a watt or so. A second stage would let CT-40 intercept its leads, supports and wiring, as Chapters 5 and 8 described, and cool a radiation shield, moving most of its heat to the stage where it is cheaper. That is the usual path when a cryostat's demands outgrow a single stage. It brings its own costs: a larger compressor, a more complex cold end and more joints to maintain.

## Power, water and the room

The cooler's 7.0 kW of input does not disappear: nearly all of it, plus the few watts lifted from the cold end, leaves the compressor as heat. CT-40's compressor is water-cooled, and the laboratory's chilled water must carry that heat away. This is an illustration. Allowing the water to warm by 5 K, it needs 7,000 ÷ (4,186 × 5) = 0.334 kg/s, about 20 L/min. If the water arrives warmer than the maker allows, the compressor's discharge temperature rises and the cooler's capacity falls, so the water supply is part of the cryostat's specification. An air-cooled compressor would put the same 7 kW into the room, which then needs its own air conditioning.

The same logic applies to any cold apparatus that has to fit into a building. A cryostat's true footprint includes its compressor, its water or air cooling, its electrical supply sized for the compressor's starting current, and the space to service the cold head, and those are best settled with the building's services engineer before the cryostat arrives rather than after.

## Vibration and the cold head

A Gifford–McMahon cold head vibrates at its cycle frequency, typically about once or twice a second, and that vibration reaches the cold plate through the strap. For CT-40's coil tests it does not matter. For measurements sensitive to movement, such as optical alignment or very small voltages on long leads in a magnetic field, it can. The flexible laminated strap of Chapter 6 isolates much of the cold head's motion from the plate, and the cold head is mounted on its own flange with a bellows to the vessel where isolation matters more. Thermometers and voltage taps near a vibrating, current-carrying conductor also pick up induced noise, which is one more reason to twist the instrument wires in pairs and anchor them firmly.

## What the cooler costs, against the Carnot limit

Chapter 1 gave the Carnot limit for a refrigerator, COP = T_c ÷ (T_h − T_c). It is the yardstick for any cryocooler. Strobridge's surveys of cryogenic refrigerators for the US National Bureau of Standards expressed every machine's efficiency as a percentage of Carnot, and found that efficiency rises with capacity: large plants come far closer to the ideal than small ones.

The [heat pump, chiller and heat engine claim tool](/tools/carnot-limit-check/) does exactly this comparison. For a chiller, it takes the hot and cold temperatures, the cooling delivered and the input power, and reports the actual COP, the Carnot COP, the second-law efficiency (actual ÷ Carnot), whether the claim is possible, whether it meets the user's acceptance level, and the yearly energy and its cost.

This is an illustration. With the cooler's rating of 30 W at 40 K (−233.15 °C), heat rejected to cooling water at 25 °C, and 7.0 kW of input:

```figure
type: stats
title: CT-40's cryocooler from the Carnot claim tool
caption: This is an illustration. Inputs: chiller mode, hot side 25 °C, cold side −233.15 °C, output 0.030 kW, input 7.0 kW, acceptance level 2%, 2,000 hours a year, an illustrative A$0.30/kWh including GST.
- 0.00429 | Actual COP | 30 W ÷ 7,000 W
- 0.155 | Carnot COP | 40 ÷ (298.15 − 40)
- * 2.8% | Second-law efficiency | within the limit and above 2%
- 14,000 kWh | Yearly input energy | A$4,200 at the illustrative tariff
```

The second-law efficiency of 2.8% is the honest measure of what a small cryocooler does: it uses 233 W of electricity for each watt of its rated capacity at 40 K, where an ideal machine would use 6.5 W. And because it runs at full power whatever the load, the real cost of each watt of CT-40's 10.58 W budget is 7,000 ÷ 10.58 = 662 W of input. At the cold stage's actual 30.3 K, the Carnot COP is 0.113, so carrying 10.58 W ideally would take 94 W; the machine's second-law efficiency at its operating point is 1.3%. Saving a watt of heat leak does not save electricity on a cooler like this, but it does buy temperature margin, and on a cooler with variable speed it would save power too.

## Commissioning the budget

A heat budget is a prediction, and a cryostat's commissioning tests it. This is an illustration. CT-40's first budget, made before the errors in Chapters 5 and 7 were found, totalled 10.35 W: it used G-10's conductivity at 40 K for the supports, 0.20 W instead of 0.43 W, and it left out the stainless steel push rod.

The laboratory measured the real load from the cooler's balance. With the leads at 100 A into a shorted dummy coil, the cold stage settled at a temperature that, on a curve first checked with a known heater power on the plate, implied a load of about 11.4 W, a little over a watt more than the budget.

```figure
type: steps
title: Closing the gap between CT-40's budget and its measured load
caption: This is an illustration of commissioning by difference. Each step is a calculation or a change followed by a new balance measurement.
- First budget | 10.35 W, against about 11.4 W measured
- Supports recalculated with the conductivity integral | +0.23 W, budget 10.58 W
- Stainless steel push rod found and counted | +0.10 W, budget 10.68 W
- Remaining gap, about 0.7 W | traced to uncollared MLI penetrations
- Push rod replaced with G-10, penetrations collared | measured about 10.8 W against a budget of 10.59 W
- * Accepted | 0.2 W unexplained, within the uncertainty of the cooler's curve
```

The method is worth noticing. Nobody measured a heat leak directly. The cooler, once its curve was checked with a heater, acted as a calorimeter for the whole cold end, and each change to the cryostat was tested by its effect on the balance. That is the standard way to commission a cryocooled cryostat, and it is why CT-40 has a calibrated heater and thermometers at the cold stage and the plate.

## The error: a cooler that beat the second law

This is an illustration. Planning a future insert to test low-temperature superconductors at 4.2 K, the laboratory received a brochure for a compact cooler that appeared to offer 50 W at 4.2 K for 1 kW of input. It was much cheaper than anything else on offer, and a purchase request had been drafted.

The engineer ran the claim through the Carnot claim tool before signing. With a cold side of 4.2 K (−268.95 °C), heat rejected at 25 °C, 0.050 kW of cooling and 1.0 kW of input, the tool reported a Carnot COP of 0.0143 and a second-law efficiency of **350%**, with the verdict that the claim exceeds the Carnot limit and is impossible as stated. Even an ideal machine would need 3.5 kW to remove 50 W at 4.2 K.

The brochure, read again, gave 50 W for the cooler's first stage at 40 K, not at 4.2 K; at 40 K the same figures give a plausible, though very good, 32% of Carnot. Its second stage was rated at a fraction of a watt at 4.2 K. Capacity figures without their temperatures, or with the temperature of the wrong stage, are a common source of such misreadings. The laboratory's rule now is that no cooler is specified without its capacity curve at each stage and a second-law check on every quoted point.

## Exercise: an ageing cooler

Cryocooler capacity falls as the cold head's seals and regenerator wear. Suppose CT-40's cooler loses 20% of its capacity at every temperature, so that its curve becomes 1.6 × (T − 25 K) watts. With the design load of 10.58 W, find the new cold stage temperature and, given that the strap and joints add 3.40 K at that temperature, the plate temperature. Then find the cooler's new rating at 40 K and its second-law efficiency there with the same 7.0 kW input.

**Worked answer.** This is an illustration. The cold stage settles where 1.6 × (T − 25) = 10.58, at T = 25 + 10.58 ÷ 1.6 = **31.6 K**, and the plate at 31.6 + 3.40 = **35.0 K**, still inside the 40 K target but with 5 K of margin instead of 6.4. The cooler's rating at 40 K falls to 1.6 × 15 = **24 W**, and its second-law efficiency to 24 ÷ 7,000 ÷ 0.155 = **2.2%**; the Carnot claim tool gives the same. A slow rise in the plate's temperature at a constant load is the usual first sign of a cooler that needs service, which is why CT-40's records log the cold stage temperature at the same lead current at every test.
