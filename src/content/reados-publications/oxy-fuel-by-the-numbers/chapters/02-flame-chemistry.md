---
book: oxy-fuel-by-the-numbers
chapterSlug: flame-chemistry-and-the-neutral-flame
order: 2
title: "Flame chemistry and the neutral flame"
description: "Follow the two-stage oxy-acetylene flame, estimate the gas, air and heat it uses, and see why operators in 1921 set oxidising flames while believing them neutral."
draft: false
---

Every setting on an oxy-fuel torch is a statement about chemistry. The ratio of oxygen to acetylene decides whether the flame adds carbon to the steel, burns it or leaves it alone. The flow decides how much heat arrives and how much air the flame draws from the room. Getting these right by eye is a skill, but it is a skill with a measurable target, and the 1921 investigation found that skilled operators routinely missed it in the same direction.

This chapter builds the chemistry from the reaction equations, puts numbers on the base-plate case and explains the 1921 finding about neutral flames, because it still shapes how flames should be set and checked.

## Burning acetylene completely

Acetylene, C₂H₂, burns completely to carbon dioxide and water. Balancing the atoms gives one molecule of acetylene to two and a half of oxygen. Because equal volumes of gas at the same temperature and pressure contain nearly the same number of molecules, the same ratio holds by volume:

**C₂H₂ + 2.5 O₂ → 2 CO₂ + H₂O**

One cubic metre of acetylene therefore needs 2.5 m³ of oxygen to burn completely. A mixture in exactly that proportion is 1 ÷ 3.5, or about 28.6%, acetylene by volume. As Chapter 6 shows, that proportion matters for safety as well as heat, because it is close to where the flame travels fastest through the mixture.

A torch does not supply 2.5 volumes of oxygen. The 1921 report states the working rule of its day: a properly adjusted welding torch burns equal volumes of the two gases, a ratio of one to one, and the flame takes the rest of its oxygen from the surrounding air. TWI's modern guidance for oxy-acetylene cutting gives a ratio of about 1.2 volumes of oxygen to one of acetylene. Either way, the torch supplies less than half the oxygen needed for complete combustion, and the flame finishes the job with air.

## A flame in two stages

The explanation lies in the structure of the flame. In the bright **inner cone**, acetylene reacts with the oxygen supplied through the torch. With a one-to-one mixture, the products are carbon monoxide and hydrogen:

**Primary: C₂H₂ + O₂ → 2 CO + H₂**

Carbon monoxide and hydrogen are both fuels and both reducing. Just beyond the tip of the inner cone, where the steel is heated in welding, the gas is hot and contains almost no free oxygen, which is why a correctly set oxy-acetylene flame protects molten steel from oxidation. In the larger, paler **outer envelope**, the carbon monoxide and hydrogen burn with oxygen drawn from the air:

**Secondary: 2 CO + H₂ + 1.5 O₂ → 2 CO₂ + H₂O**

Adding the two stages gives back the complete reaction, with one volume of oxygen from the torch and one and a half from the air.

```figure
type: formula
title: Air drawn in by the secondary flame
formula: air = (2.5 − R) × Q ÷ 0.2095
caption: Air is about 20.95% oxygen by volume. At a torch ratio of 1.0, each cubic metre of acetylene draws about 7.16 m³ of air; at 1.1, about 6.68 m³.
- R | oxygen-to-acetylene ratio supplied by the torch
- Q | acetylene flow, m³/h
- air | air drawn from the surroundings, m³/h
step: air = (2.5 − 1.1) × 0.50 ÷ 0.2095
step: air = 0.70 ÷ 0.2095
step: air ≈ 3.34 m³/h for setting B
```

That air demand has practical consequences. A cutting or heating flame in a confined space consumes oxygen from the air around the worker and releases carbon dioxide and water vapour, along with nitrogen oxides formed in the hot flame and fume from the steel and its coatings. Ventilation for oxy-fuel work is set by regulators' codes of practice and a competent assessment, not by this arithmetic, but the arithmetic shows why a flame in an unventilated tank or pit is a hazard even before anything goes wrong.

## Where the heat comes from

The two stages do not release the same heat. TWI's figures for acetylene are about **18,890 kJ per cubic metre** in the primary flame and **35,882 kJ per cubic metre** in the secondary. The inner cone therefore releases only about 34.5% of the total heat, but it releases it in a small volume at the highest temperature. TWI gives a maximum flame temperature for acetylene in oxygen of about 3,160 °C, the highest of the common fuel gases.

For setting B in the base-plate case, with 0.50 m³/h of acetylene:

- primary heat ≈ 0.50 × 18,890 ÷ 3,600 ≈ **2.62 kW**
- total heat ≈ 0.50 × (18,890 + 35,882) ÷ 3,600 ≈ **7.61 kW**

Concentrated primary heat is what makes acetylene good at piercing and at fast starts. Other fuel gases spread their heat differently. TWI's figures for propane, for example, put only about 10.9% of its heat in the primary flame, need about 4.3 volumes of oxygen per volume of propane, and give a flame speed of about 3.3 m/s against 7.4 m/s for acetylene. Propane pierces more slowly but, once cutting, can cut at speeds similar to acetylene's. The choice of fuel gas is a trade between preheat time, gas cost, oxygen consumption and convenience, and the same reasoning about primary and secondary heat applies to each.

```figure
type: bars
title: Share of total heat released in the primary flame
unit: %
max: 40
caption: From TWI's primary and secondary heat values. Concentrated primary heat favours fast piercing; propane releases most of its heat in the outer flame.
- *Acetylene | 34.5
- Propane | 10.9
```

## Neutral, carburising and oxidising flames

Changing the ratio changes the flame's character.

- A **carburising** flame has excess acetylene. A white feather extends beyond the inner cone into the outer envelope. The flame can add carbon to molten steel.
- A **neutral** flame has just enough oxygen to complete the primary reaction. The feather has just merged into the inner cone, and the hot zone beyond the cone neither adds carbon nor oxidises.
- An **oxidising** flame has excess oxygen. The inner cone is shorter, sharper and often more pointed, the flame may hiss, and free oxygen reaches the steel.

```figure
type: compare
title: Three flames and what they do to steel
cols: How it looks | Effect on hot steel
caption: The neutral flame is a narrow target between the two. Small changes in either gas move the flame across it.
- Carburising | feather beyond the inner cone | can add carbon; hard, brittle weld metal
- *Neutral | feather just merged; rounded cone tip | neither adds carbon nor oxidises
- Oxidising | short, sharp cone; may hiss | oxidises; porous, weak weld metal
```

The supplied ratio that gives a neutral flame depends on the torch, the tip and the conditions, which is why the 1921 rule says one to one and modern guidance about 1.1 to 1.2. In the base-plate case, the preheat flame is run at 1.1 volumes of oxygen to one of acetylene, so setting B uses 0.50 m³/h of acetylene and 0.55 m³/h of preheat oxygen.

## The 1921 finding: operators set oxidising flames

The welding tests in the 1921 investigation produced gas ratios much higher than the one-to-one target, meaning more oxygen than expected. Some of that was explained by the flashback mechanism described in Chapter 6, which shifts the mixture during welding. But even with the torch burning freely in air, mounted on a stand, the ratios were still higher than expected, although the flames had been set and approved by experienced operators from the manufacturers.

The investigator's explanation was simple. Every instruction book he could find described the neutral flame as one whose inner cone was sharp in outline, symmetrical and smooth. Operators had learned to keep reducing the acetylene until the whole cone, including its very tip, looked sharp. The tip of a truly neutral cone is slightly softer than that, and at high gas velocities its ragged edge made judgement harder. The habit produced flames that were oxidising.

To check the judgement, the Bureau looked at the flame through a diffraction grating. A carburising flame contains glowing particles of solid carbon, which add a continuous band of colour over the line spectrum of the burning gases. Adjusting each flame until that continuous band just disappeared gave gas ratios that were much more uniform, and close to one. The report concluded that nearly all the torches could burn equal volumes and give a neutral flame when burning freely, and that the operator's eye, trained by the wording of the instruction books, was the main source of error.

The lesson for today is not to buy a spectroscope. It is that the neutral flame is a judgement, that judgements drift in a consistent direction, and that a measurement can calibrate the judgement. Flow meters on both gases, or the weighing method of Chapter 1, show the ratio a particular operator actually sets.

## A failure: the drifting preheat

This is an illustration. During the base-plate job, the track machine's flow meters show the acetylene at 0.44 m³/h instead of 0.50, with the preheat oxygen unchanged at 0.55 m³/h. The operator had trimmed the acetylene after noticing a soft cone tip, to make the cone look crisper. The ratio is now 0.55 ÷ 0.44 = **1.25**, an oxidising flame by the workshop's own measurements.

The effects were small but real. Starts took slightly longer, because the primary flame had lost some of its heat, and the top edge of the cut showed more scale. On a weld or a braze the same drift would oxidise the joint. The supervisor's correction was to restore the measured flows, mark the meter positions for the setting, and add the flows to the settings sheet so the flame could be checked against numbers rather than appearance. The record of Chapter 1 had made the drift visible; without it, the trim would have become the new normal.

## Reading the ratio from two flow meters

A ratio computed from two flow meters is only as good as the meters. Suppose each meter is accurate to within 5% of its reading, a modest figure for a workshop instrument. If the oxygen meter is right and the acetylene meter reads 5% high, the true acetylene flow is 0.50 ÷ 1.05 and the true ratio is 1.1 × 1.05 ≈ 1.16. If it reads 5% low, the true ratio is 1.1 × 0.95 ≈ 1.05. With both meters wrong in opposite directions, the band widens further. A ratio that the meters say is 1.10 might really lie anywhere from about 1.05 to 1.16, a spread similar to the whole difference between the 1921 rule and TWI's modern figure.

That has two consequences. The first is that meters used to set flames should be checked, as Chapter 5 describes, and should be read at the pressure and on the gas for which they are scaled. The second is that the meters are best used for comparison rather than as an absolute truth: the flows that give a good neutral flame on a particular torch, as judged by a careful operator and confirmed by the cut, are written down, and later settings are compared with them. A drift of 12% in one gas, as in the failure above, is far larger than the meters' uncertainty and is easily seen.

The ratio also shows where the gas goes. In setting B the preheat flame takes 0.50 m³/h of acetylene and 0.55 m³/h of oxygen, but the cutting jet takes 4.6 m³/h of oxygen. Nearly nine-tenths of the oxygen leaves through the central jet. In welding and heating there is no jet, and the oxygen and acetylene flows are nearly equal. That is why the cost arguments of Chapter 9 for cutting turn mainly on oxygen and speed, while for heating they turn mainly on acetylene.

## Mixture and ratio side by side

The ratio and the acetylene fraction of the mixture are two views of the same thing. The fraction is 1 ÷ (1 + R), where R is the oxygen-to-acetylene ratio.

```figure
type: bars
title: Acetylene fraction of the torch mixture at different ratios
unit: % acetylene by volume
max: 55
caption: The normal working band is close to half acetylene. Complete combustion needs 28.6%, which the torch never supplies on its own.
- Ratio 1.0 | 50.0
- *Ratio 1.1, base-plate case | 47.6
- Ratio 1.2 | 45.5
- Ratio 1.3 | 43.5
- Ratio 2.5, complete combustion | 28.6
```

These numbers return in Chapter 6. A torch that is pushed from 47.6% acetylene towards 28.6% is moving its mixture towards the proportion in which flame travels fastest, and that is the first step towards a flashback.

## Cutting preheat and welding flame

The same chemistry applies to the preheat flames of a cutting torch, with one difference. A cutting nozzle surrounds a central oxygen jet with a ring of preheat flames, and opening the cutting oxygen can change how the preheat flames look and burn. The 1921 tests adjusted the preheat flames to neutral with the cutting oxygen valve fully open, so the flame was set under the conditions in which it would cut, and that is still the usual guidance. A preheat flame set with the cutting oxygen closed may become oxidising or carburising when the jet opens.

The preheat flame also has a different job. In welding, the flame must protect molten metal. In cutting, it must bring the steel to its ignition temperature quickly and keep the top of the cut hot, while the oxygen jet does the cutting. Some cutters deliberately run the preheat slightly oxidising, which matters less on a cut edge than in a weld, but they do it by adding oxygen, not by starving the flame of acetylene as in the failure above. Excess acetylene and excess flame size, on the other hand, waste gas and, as Chapter 8 shows, can spoil the top edge.

## Exercise: setting A's flame

Setting A runs 0.70 m³/h of acetylene with preheat oxygen at 1.1 times that flow. Calculate the preheat oxygen, the air drawn by the secondary flame and the total heat released, and compare the heat with setting B.

Preheat oxygen is 1.1 × 0.70 = **0.77 m³/h**. The secondary flame needs the remaining 2.5 − 1.1 = 1.4 volumes of oxygen per volume of acetylene, or 1.4 × 0.70 = 0.98 m³/h of oxygen, which is 0.98 ÷ 0.2095 ≈ **4.68 m³/h of air**. The total heat is 0.70 × (18,890 + 35,882) ÷ 3,600 ≈ **10.65 kW**, of which about 3.67 kW comes from the primary flame. Setting B releases 7.61 kW. Setting A therefore puts about 40% more heat and 40% more acetylene into the plate for the same cutting jet, which Chapter 8 shows is where its rounded top edge comes from.
