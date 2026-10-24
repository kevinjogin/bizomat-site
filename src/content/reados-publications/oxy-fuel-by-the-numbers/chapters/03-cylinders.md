---
book: oxy-fuel-by-the-numbers
chapterSlug: cylinders-contents-and-withdrawal
order: 3
title: "Cylinders: contents, weight and withdrawal"
description: "Estimate what is left in oxygen and acetylene cylinders, see why acetylene must be weighed rather than read from a gauge, and size a supply that respects withdrawal limits."
draft: false
---

A cylinder gauge invites a simple reading: high pressure means plenty of gas, low pressure means little. For oxygen that reading is roughly right. For acetylene it can be badly wrong, and the error has consequences beyond running out mid-cut. The 1921 investigators had to know exactly how much gas each torch used, so they could not take either gauge on trust, and what they found about acetylene cylinders still explains several rules that workshops follow without always knowing why.

This chapter treats the two gases separately, because they are stored in fundamentally different ways, then sizes the gas supply for the base-plate job.

## Oxygen: a compressed gas

Oxygen is stored as a compressed gas. To a first approximation, the quantity in the cylinder is proportional to its absolute pressure at a given temperature, so the gauge is a usable fuel gauge. At the very high pressures of a full cylinder, real gases depart somewhat from the ideal gas law, so the relationship is not exactly linear, and the supplier's stated contents at full pressure are the reference.

```figure
type: formula
title: Remaining oxygen from the gauge, first approximation
formula: V ≈ V_full × p ÷ p_full
caption: This is an illustration. A cylinder that holds 8.5 m³ at 17,500 kPa holds roughly 4.37 m³ at 9,000 kPa, at the same temperature. Use your supplier's figures.
- V_full | contents when full, m³
- p_full | full pressure, kPa
- p | gauge pressure now, kPa
step: V ≈ 8.5 × 9,000 ÷ 17,500
step: V ≈ 76,500 ÷ 17,500
step: V ≈ 4.37 m³
```

Temperature moves the gauge without changing the contents. A full cylinder at 17,500 kPa and 15 °C, left in the sun until it reaches 35 °C, reads about 7% higher, near 18,720 kPa, because pressure rises in proportion to absolute temperature. The same cylinder on a cold morning reads lower. Comparing a morning reading with an afternoon one can therefore suggest a leak that does not exist, or hide one that does.

The 1921 investigation checked the gauge method against its balances. For a bank of seven oxygen cylinders, each of 200 cubic feet, it found that each pound per square inch of gauge pressure represented about 0.68 cubic feet of gas. That figure implies the bank held its 1,400 cubic feet at a little over 2,000 lb/in², about 14,200 kPa, a sensible full pressure for the period. In metric terms, the bank lost about 0.279 m³ for every 100 kPa drop on the gauge. The investigators also noted that oxygen cylinders made by the liquid-air process often held some water, which took up space and added a little water vapour to the gas, especially near empty. They studied two banks to check that the difference was small, and estimated the density error from water vapour at under 0.5% above about 300 lb/in².

## Acetylene: a dissolved gas

Acetylene cannot safely be stored as a simple compressed gas, because free acetylene under pressure can decompose violently. A modern acetylene cylinder is filled with a porous mass, and the pores are partly filled with a solvent, usually acetone. Acetylene dissolves in the solvent, much as carbon dioxide dissolves in a bottle of soft drink, so a large quantity can be held at modest pressure.

That storage method breaks the link between pressure and contents. The pressure in an acetylene cylinder depends on how much acetylene is dissolved, on the temperature and on whether the solution is in equilibrium with the gas above it. When gas is drawn off, acetylene comes out of solution and seeps through the porous mass, which takes time. The gauge reading at the end of a heavy draw is lower than the reading after the cylinder has rested.

The 1921 report gives a vivid example. At the end of one day's testing the acetylene bank gauge read 70 lb/in², about 483 kPa, in a room at 85 °F. The next morning, at 84 °F, the same gauge read 85 lb/in², about 586 kPa. Nothing had been added; the gas had simply come out of solution overnight. The investigators also found that the gauge nearly always rose by 1 to 3 lb/in² in the few minutes after a test. They concluded that no generally useful constant could be found for converting acetylene gauge readings to volume, and that the common practice of estimating acetylene use as equal to the oxygen used, measured by the oxygen gauge, was the best a workshop of the day could do.

The modern answer is to **weigh acetylene**. An acetylene cylinder is stamped with its tare mass, which includes the porous mass and solvent. The mass of acetylene in it is the gross mass less the tare, and the mass used is the difference between two weighings. Acetylene weighs about 1.101 kg per cubic metre at 15 °C and atmospheric pressure, so each kilogram is about 0.908 m³.

```figure
type: compare
title: Oxygen and acetylene cylinders compared
cols: Oxygen | Acetylene
caption: The two gases need different methods of estimating what is left, and different handling rules.
- How it is stored | compressed gas | dissolved in solvent in a porous mass
- Gauge as fuel gauge | roughly proportional at a given temperature | unreliable; reading recovers after a draw
- *Best measure of contents | gauge, or weight | weight, gross minus stamped tare
- Effect of fast draw | regulator and valve cool; pressure drops | solvent carried out with the gas
- Orientation | as the supplier directs | upright, so solvent stays below the valve
```

## Acetone comes out with the gas

The 1921 investigators needed the density of the gas leaving their acetylene banks to convert flow meter readings to volume, and they could find no published data for acetylene drawn from dissolved-acetylene cylinders. So they measured it, by comparing the loss of weight of the bank with the volume through a calibrated gas meter. The results were not constant. The density rose as the cylinder pressure fell, it was higher at low rates of withdrawal, and different banks drawn at the same rate gave different densities, especially near empty.

The investigators explained this by acetone leaving with the acetylene, partly as vapour in equilibrium with the liquid and partly, they suspected, as a fine spray. Fast withdrawal cooled the gas and reduced the vapour, which is why the density was lower at high rates in their tests, but an interferometer study in the same report suggested the acetone content rose with the rate of draw, although the report itself treated those readings as unreliable. Either way, gas drawn from an acetylene cylinder is not pure acetylene, and its composition depends on how the cylinder is being used.

Acetone in the gas has two effects. It changes the flame and wastes solvent, and every gram of acetone that leaves is a gram that is no longer in the cylinder to hold the remaining acetylene in solution. That is the reason for the modern rule that acetylene must not be drawn faster than a stated fraction of the cylinder's contents per hour. Published guidance differs on the fraction. One-seventh of the contents per hour is widely quoted, and lower fractions are given by some suppliers and industry bodies, particularly for continuous use. The figure that applies is the one in your gas supplier's data for that cylinder.

## The withdrawal limit in the base-plate case

This is an illustration. Suppose the workshop's acetylene cylinders each hold 7.0 kg of acetylene when full, which is about 7.0 ÷ 1.101 ≈ **6.36 m³**, and the supplier's data limits withdrawal to one-tenth of the contents per hour. One cylinder may then supply about **0.636 m³/h**.

```figure
type: bars
title: Acetylene demand against one cylinder's withdrawal limit
unit: m³/h
max: 1.6
caption: This is an illustration, for a cylinder of 6.36 m³ and a limit of one-tenth of contents per hour, 0.636 m³/h. Setting A exceeds it; the heating nozzle needs three cylinders on a manifold.
- *Withdrawal limit, one cylinder | 0.636
- Setting B | 0.50
- Setting A | 0.70
- Heating nozzle for preheating | 1.5
```

Setting B, at 0.50 m³/h, is within the limit. Setting A, at 0.70 m³/h, is about 110% of it, so the chart setting is not only wasteful but also asks too much of a single cylinder. A large heating nozzle used to preheat thick sections, running at 1.5 m³/h, would need 1.5 ÷ 0.636 ≈ 2.4, so **three cylinders** connected through a manifold. If the supplier's fraction were one-seventh, a cylinder could give about 0.908 m³/h; if it were one-fifteenth, about 0.424 m³/h, and even setting B would need a second cylinder. The fraction matters enough that it belongs on the settings sheet.

Notice what the limit does not depend on. Setting B uses only 2.0 m³ of acetylene for the whole 96 m job, about 2.2 kg or less than a third of one cylinder's contents. Quantity is not the constraint; rate is.

## Manifolds share the rate, if the cylinders share evenly

The 1921 investigators drew acetylene from banks of three cylinders, and one detail of their density work shows the principle behind a manifold. A short study drew gas from a bank of two cylinders at about 30 cubic feet an hour, which they treated as equivalent to 45 cubic feet an hour from a bank of three. Both are 15 cubic feet an hour per cylinder. What governs the behaviour of a dissolved-acetylene cylinder is the rate drawn from each cylinder, not the total.

A manifold divides the draw, but only evenly if the cylinders are alike. Cylinders at different contents, different temperatures or with different histories do not give up gas at the same rate, and the 1921 report found that the earlier use of a bank changed what came out of it later. This is an illustration. Three cylinders feeding the 1.5 m³/h heating nozzle should each give 0.50 m³/h. If one cylinder is fuller and warmer than the others, the shares might instead be 0.70, 0.45 and 0.35 m³/h, and the first cylinder is then above the 0.636 m³/h limit although the bank as a whole is within it. Weighing each cylinder before and after a heavy job shows whether they shared the load.

Temperature works against the user in cold weather. Acetylene is less ready to come out of solution in a cold cylinder, so the pressure is lower and the cylinder is less able to sustain a high draw. A supply that is adequate on a warm afternoon can struggle on a winter morning, which is one more reason to allow a margin on the number of cylinders rather than sizing a manifold exactly.

## Sizing the job's oxygen

Oxygen is the opposite. At setting B the job uses 5.15 m³/h of oxygen for 4.0 hours of cutting, about **20.6 m³** in total. With cylinders of 8.5 m³, that is about 2.42 cylinders' worth. A four-cylinder manifold holds 34 m³ when full, leaving about 13.4 m³ for trial cuts, restarts and the unexpected. Two cylinders would not finish the job; three would, with little margin if any of them were less than full.

The usual practice of returning cylinders with some pressure remaining also reduces the usable contents. Leaving positive pressure in a cylinder keeps air and moisture from entering it. The amount to leave is a supplier's instruction, not a calculation, but it should be allowed for when counting how many cylinders a job needs.

## A failure: the heavy cylinder that was not

This is an illustration. During a preheating job before the base plates, the workshop ran a large heating nozzle from one acetylene cylinder. The flow meter, totalled over the job, showed 1.20 m³ of acetylene, which should weigh 1.20 × 1.101 ≈ 1.32 kg. The cylinder, weighed before and after, had lost 1.45 kg. The extra 0.13 kg was not acetylene. It was solvent carried out with the gas, because the draw had been well above the cylinder's withdrawal limit for most of the job.

Two checks made the problem visible: the cylinder was weighed, and the weighed loss was compared with the flow meter. Either alone would have looked normal. The correction was to connect three cylinders through a manifold for that nozzle, as the calculation above requires, to tell the supplier that one cylinder had been over-drawn so that it could be checked before refilling, and to add the withdrawal limit to the settings sheet for every nozzle the workshop uses for heating.

## Handling, storage and the standard

How cylinders are stored, secured, transported, connected and returned is governed in Australia by work health and safety laws, regulators' guidance, AS 4839 for portable and mobile oxy-fuel systems, and the supplier's safety data sheets and instructions. Common themes are that cylinders are secured against falling, acetylene cylinders are kept upright, valves are protected and kept free of oil and grease, cylinders are kept away from heat and from the cutting area, and leaks are found with a suitable leak detector and fixed before work. Gas suppliers' safety data sheets also limit the pressure at which free acetylene may be drawn from a cylinder, typically to around 100 kPa gauge; the figure on your supplier's sheet is the one to follow, and regulators for acetylene are made to suit it.

```figure
type: checklist
title: Cylinder entries on the base-plate settings sheet
caption: This is an illustration. Each entry turns a habit into a number someone else can check.
- x Oxygen supply | four-cylinder manifold, 34 m³ when full
- x Oxygen needed | 20.6 m³ at setting B, plus margin
- x Acetylene contents | by weight; tare and gross recorded
- x Withdrawal limit | supplier's fraction, 0.636 m³/h per cylinder
- *x Setting check | B within limit; A and heating nozzle need a manifold
- ? Residual pressure | supplier's return figure to be confirmed
```

## Exercise: how far will this cylinder go?

An oxygen cylinder of the workshop's type, holding 8.5 m³ at 17,500 kPa, reads 6,000 kPa at the same temperature as when it was filled. Estimate its remaining contents and how many metres of 25 mm plate it can cut at setting B, which uses 0.2146 m³ of oxygen per metre.

Remaining contents ≈ 8.5 × 6,000 ÷ 17,500 ≈ **2.91 m³**. At 0.2146 m³ per metre, that is about 2.914 ÷ 0.2146 ≈ **13.6 m** of cut, a little over eight base plates at 1.6 m each. In practice the usable length is less, because some pressure must be left in the cylinder and the regulator needs an inlet pressure comfortably above its outlet setting to hold a steady flow. Explain why the same method would give a misleading answer for an acetylene cylinder, and what the workshop should do instead.
