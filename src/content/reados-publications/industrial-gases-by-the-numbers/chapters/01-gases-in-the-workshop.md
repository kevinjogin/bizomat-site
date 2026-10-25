---
book: industrial-gases-by-the-numbers
chapterSlug: gases-in-the-workshop
order: 1
title: "Gases in the workshop"
description: "Compare the gases a fabrication workshop uses by what they do, how heavy they are relative to air, and how they burn, feed burning or suffocate."
draft: false
---

Walk through a typical fabrication workshop and count the gases. There are tall oxygen cylinders and squat acetylene cylinders on the cutting trolley, a rack of argon and argon mixture cylinders by the welding bays, a nitrogen cylinder beside the stainless pipe bench, a propane cylinder on the heating torch, and perhaps a carbon dioxide cylinder for an older wire feeder. Each gas does a different job, and each behaves differently when it leaks: some rise and disperse, some sink and collect in pits and trenches, some burn, some feed burning, and some simply displace the oxygen people need to breathe.

This chapter sets out the gases a workshop uses, what each is for, and the handful of physical properties that explain most of their behaviour: molar mass and density relative to air, whether they burn and over what range of mixture, and whether they support combustion. It introduces the workshop whose gas system the rest of the book reviews.

## Why the workshop needs gases at all

A workshop uses gases for four broad purposes. **Fuel gases**, such as acetylene, propane and hydrogen, burn to release heat for cutting, heating, brazing and welding. **Oxygen** burns with the fuel gas in the torch to give a hotter flame than air could, and, in cutting, burns the steel itself. **Shielding gases**, such as argon, carbon dioxide and helium, and their mixtures, keep the air away from molten weld metal in the arc processes, because oxygen and nitrogen from the air would make the weld porous and brittle. **Purging and inerting gases**, mainly nitrogen and argon, displace air from the inside of pipes and vessels being welded, or from tanks before hot work, so that the inside of a stainless steel weld does not oxidise and so that flammable vapours cannot ignite.

Some gases appear in more than one role. Argon shields the tungsten arc and also purges the back of a stainless pipe weld; carbon dioxide is a shielding gas on its own and part of most mixtures for steel; oxygen appears in small percentages in some shielding mixtures, as well as feeding the torch.

## The running case

This is an illustration. The workshop in this book is a regional fabrication and repair business with eleven staff. It cuts and heats steel with oxy-acetylene, brazes and heats with an oxy-propane torch, welds structural steel with a wire process under an argon and carbon dioxide mixture, welds stainless steel and aluminium with the tungsten arc under pure argon, and purges stainless pipe with nitrogen or argon. All its gases come in cylinders from one supplier, on a rental and refill basis.

Over the past year the workshop's gas bill has risen to an illustrative **A$38,000**, excluding GST, and the manager has noticed that the argon mixture seems to run out faster than the welding work can explain. A cylinder of argon was also found hissing at its valve one Monday morning in a small store room with the door shut. Nobody was hurt, but the manager wants to understand the whole gas system before deciding what to change. This is an illustration, not a real business, and the figures are invented for teaching.

## Molar mass and density relative to air

The first property that explains a gas's behaviour when it escapes is how heavy it is compared with air. For gases at the same temperature and pressure, density is proportional to molar mass, because equal volumes contain equal numbers of molecules. Dry air has an average molar mass of about 28.97 g/mol, so a gas's density relative to air is simply its molar mass divided by 28.97.

```figure
type: formula
title: Density of a gas relative to air
formula: relative density = M_gas ÷ M_air, with M_air ≈ 28.97 g/mol
caption: For ideal gases at the same temperature and pressure. Real gases depart slightly, but not enough to change any practical conclusion.
- Argon, M | 39.95 g/mol
- Propane, M | 44.10 g/mol
- Hydrogen, M | 2.016 g/mol
step: argon: 39.95 ÷ 28.97 ≈ 1.38, so it sinks
step: propane: 44.10 ÷ 28.97 ≈ 1.52, so it sinks
step: hydrogen: 2.016 ÷ 28.97 ≈ 0.07, so it rises fast
```

The same calculation gives oxygen about 1.10, nitrogen about 0.97, carbon dioxide about 1.52 and acetylene about 0.90. The NIOSH Pocket Guide lists acetylene's relative gas density as 0.91 and propane's as 1.55, close to the ideal-gas values; the small differences come from real-gas behaviour and rounding.

```figure
type: bars
title: Density of workshop gases relative to air
unit: relative density, air = 1.00
max: 1.6
caption: Calculated from molar mass for ideal gases. Gases above 1.00 tend to sink and collect in low places; those below 1.00 tend to rise. Cold gas from a liquid is denser than these values until it warms.
- Hydrogen | 0.07
- Acetylene | 0.90
- Nitrogen | 0.97
- Oxygen | 1.10
- *Argon | 1.38
- Carbon dioxide | 1.52
- Propane | 1.52
```

The practical lessons follow directly. Argon, carbon dioxide and propane are heavier than air and flow downhill like an invisible liquid, collecting in pits, trenches, basements, tank bottoms and the low corners of rooms. Hydrogen rises quickly and collects under roofs and in ceiling voids. Acetylene and nitrogen are close to air and mix with it readily, so they do not collect strongly either way unless the gas is cold. Oxygen is slightly heavier than air and tends to linger in clothing and low places, which matters for the oxygen enrichment hazard discussed below.

## Cold gas behaves differently

A gas that has just evaporated from a liquid, or expanded rapidly from high pressure, is cold, and cold gas is denser than the same gas at room temperature. Nitrogen gas at its boiling point of about −196 °C is roughly 3.7 times as dense as at 15 °C, because density at constant pressure is inversely proportional to absolute temperature (288 K ÷ 77 K ≈ 3.7). Nitrogen vented from a liquid tank therefore flows along the floor at first, even though warm nitrogen is a little lighter than air, and it can fill a pit before it warms and mixes. The same applies to argon and oxygen from liquid storage. Chapter 8 returns to this when it looks at bulk liquid supply.

## Gases that burn

Acetylene, propane and hydrogen are flammable: mixed with air or oxygen in the right proportions, they ignite and burn. The range of mixtures that will burn is bounded by the lower and upper flammable or explosive limits, usually stated as percentages of the gas by volume in air. Below the lower limit, there is too little fuel for a flame to spread; above the upper limit, too little oxygen.

```figure
type: range
title: Flammable ranges in air of three workshop fuel gases
unit: % of the gas by volume in air
min: 0
max: 100
caption: Acetylene and propane from the NIOSH Pocket Guide; hydrogen from the US Department of Energy's gaseous hydrogen Safetygram. Acetylene's upper limit of 100% reflects its ability to decompose without air at all under some conditions.
- Propane | 2.1 | 9.5
- Acetylene | 2.5 | 100
- *Hydrogen | 4 | 75
```

The limits explain a great deal about practice. Propane has the lowest lower limit, about 2.1%, and the narrowest range, so a small leak that collects in a low place soon reaches a flammable mixture near the floor. Acetylene's range runs from about 2.5% all the way to 100%, because, as Chapters 2 and 3 explain, acetylene can decompose explosively without any air at all if it is compressed or heated enough. Hydrogen's range, about 4% to 75%, is very wide, and hydrogen ignites with very little energy, but it rises and disperses quickly in a well-ventilated building.

## Gases that feed burning

Oxygen does not burn, but it makes everything else burn faster and hotter. Air is about 21% oxygen; raising the oxygen concentration by even a few per cent makes materials ignite more easily and burn far more fiercely. Clothing that would smoulder in air can flare in oxygen-enriched air, and oil and grease can ignite spontaneously in contact with high-pressure oxygen. That is why the early manuals warned again and again against oil and grease on oxygen fittings, and why the oxygen hose is never blown out to clean clothing or skin. Chapter 9 explains the materials and cleaning rules for oxygen piping, and Chapter 10 the enrichment hazard.

## Gases that suffocate

Nitrogen, argon, carbon dioxide and helium are not toxic in the ordinary sense, but they can kill by displacing oxygen. A person breathing air with too little oxygen may feel nothing at all before collapsing; there is no warning smell or breathlessness, because the urge to breathe comes mainly from carbon dioxide in the blood, not from lack of oxygen. Carbon dioxide is different again: at higher concentrations it is itself harmful, affecting breathing and heart rate, before it displaces enough oxygen to suffocate.

Safe Work Australia's model code of practice for confined spaces notes that air normally contains about 21% oxygen by volume and that oxygen levels between 19.5% and 23.5% are considered safe. The leaking argon cylinder in the workshop's store room is the kind of event that can move a room outside that band, as Chapter 10 calculates.

## A table of the workshop's gases

The properties so far can be gathered into one table for the gases the workshop uses. It is a teaching summary, not a substitute for each gas's safety data sheet, which the supplier provides and which governs.

```figure
type: compare
title: The workshop's gases and their main hazards
cols: Main use | Relative density | Main hazard
caption: Relative densities calculated from molar mass. Safety data sheets from the supplier give the authoritative properties and hazards for each product.
- Oxygen | cutting, torch flames | 1.10 | oxygen enrichment, fire
- Acetylene | cutting, heating, welding | 0.90 | fire, explosion, decomposition
- Propane | heating, brazing | 1.52 | fire, collects low
- Argon and mixtures | arc shielding, purging | 1.38 | asphyxiation, collects low
- Carbon dioxide | arc shielding | 1.52 | asphyxiation, toxicity at high levels
- Nitrogen | purging, inerting | 0.97 | asphyxiation
- Hydrogen | some mixtures and flames | 0.07 | fire, rises
```

## Pressure, volume and the cylinder

Most of the workshop's gases are stored as compressed gas in steel cylinders at high pressure, often around 15 to 20 megapascals for oxygen, argon and nitrogen in modern cylinders. A small cylinder holds a large volume of gas because, at a pressure about 200 times atmospheric, the gas occupies roughly a two-hundredth of the volume it would at atmospheric pressure. Swingle noted the same principle in 1915, observing that a cylinder charged to 120 atmospheres held more than 120 times its own volume of gas, and that cylinders were hydraulically tested to about twice their working pressure.

Two gases are exceptions. Acetylene cannot safely be compressed as a gas to high pressure, so it is dissolved in acetone held in a porous mass inside the cylinder, as Chapter 3 explains. Carbon dioxide and propane liquefy at room temperature under moderate pressure, so their cylinders hold a liquid with vapour above it, and the pressure depends on the temperature rather than on how full the cylinder is. Oxy-Fuel by the Numbers works through cylinder contents, weights and withdrawal rates in its [cylinders chapter](/reados/publications/oxy-fuel-by-the-numbers/cylinders-contents-and-withdrawal/), and this book does not repeat it.

## Gas quantities and standard conditions

Gas is bought and used by volume, but a volume of gas means little unless its temperature and pressure are stated, because the same mass of gas occupies more volume when warm or at low pressure. Suppliers state cylinder contents at a reference temperature and atmospheric pressure, commonly 15 °C and 101.325 kPa, and this book uses those conditions unless it says otherwise. At 15 °C and atmospheric pressure, one mole of an ideal gas occupies about 23.6 litres, which is used throughout the calculations in later chapters. Some references use 0 °C, where the molar volume is about 22.4 litres, or 20 °C, where it is about 24.0 litres, and the difference of several per cent matters when comparing yields or prices from different sources.

## What a year of gas looks like

This is an illustration. The workshop's records, once gathered, show roughly how much of each gas it bought in the past year. The manager listed the cylinders delivered, their contents and their cost, including rental, and found that the shielding gases cost more than the cutting gases, which surprised everyone.

```figure
type: bars
title: The workshop's annual gas spend by gas
unit: A$ a year, excluding GST, including cylinder rental
max: 16000
caption: This is an illustration. Prices and quantities are invented for teaching. Cylinder rental is a significant share of the cost of gases used in small quantities.
- *Argon and carbon dioxide mixture | 14200
- Oxygen | 7600
- Acetylene | 6400
- Pure argon | 5200
- Propane | 2100
- Nitrogen | 1600
- Carbon dioxide | 900
```

The mixture used for wire welding is the largest single cost. Given the welding hours the workshop logs, the manager's first suspicion is that some of that gas is not reaching the weld at all, through leaks in hoses and fittings, flow meters set far higher than needed, or gas left flowing when the gun is idle. Chapters 7 and 9 test those suspicions with numbers.

## The early manuals and the gases they knew

The manuals of 1914 to 1919 discussed only a few of these gases. Oxygen and acetylene were central, with hydrogen as a fuel for some work and coal gas mentioned as a weaker alternative. Shielding gases had no place in their books, because arc welding then used bare or lightly coated electrodes in open air, and the inert-gas arc processes that made argon and carbon dioxide everyday workshop gases came decades later. What the early writers did discuss, at length, was where gases came from: how acetylene was made from carbide, how oxygen was made by electrolysis or from liquid air, how impurities crept in, and what went wrong when gases were mishandled. Their concerns, translated to modern supply, still frame a workshop's gas review.

## A failure: the hissing cylinder

This is an illustration. When the store-room cylinder was found hissing on that Monday morning, the first person in opened the door, heard the hiss, shut the cylinder valve and propped the door open. The cylinder, a full argon cylinder delivered on Friday, had a damaged valve seal; the gauge on the next cylinder showed that it had lost a large part of its contents over the weekend.

Nobody had thought of the store room as a hazard. It was small, had no ventilation opening, and held a dozen cylinders of argon, mixture and nitrogen, all heavier or about as heavy as air. Had someone gone in to work at the back of the room for some time before noticing the hiss, they would have been breathing air with reduced oxygen, without any sensation of danger. The manager's review began with that near miss, and Chapter 10 calculates how far the oxygen in the room could have fallen and what controls the workshop put in place.

## Exercise: which way does it go?

A trench 1.2 m deep runs across the workshop floor for a conveyor. List which of the workshop's gases would tend to collect in the trench if released nearby, and which would not. Then calculate the density relative to air of a mixture of 82% argon and 18% carbon dioxide by volume.

Argon (relative density 1.38), carbon dioxide (1.52) and propane (1.52) are heavier than air and would tend to flow into and collect in the trench. Cold nitrogen, argon or oxygen fresh from a liquid supply would also collect there until it warmed. Hydrogen (0.07) would rise away. Acetylene (0.90) and warm nitrogen (0.97) are close to air and would tend to mix with it, and oxygen (1.10), slightly heavier, would linger in low places without collecting strongly.

The mixture's average molar mass is 0.82 × 39.95 + 0.18 × 44.01 ≈ 32.76 + 7.92 ≈ **40.68 g/mol**, so its density relative to air is about 40.68 ÷ 28.97 ≈ **1.40**. It is heavier than air, slightly more so than pure argon, and would collect in the trench like either of its components.
