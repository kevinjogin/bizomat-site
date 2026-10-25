---
book: industrial-gases-by-the-numbers
chapterSlug: making-oxygen
order: 5
title: "Making oxygen"
description: "Compare the ways oxygen has been made, from chemicals and electrolysis to distilling liquid air, and calculate the energy and yields that decided which method won."
draft: false
---

Cheap oxygen made oxy-fuel welding and cutting possible. Before about 1900, oxygen was a laboratory chemical, made in small quantities by heating chemicals, and far too dear for any workshop to burn in bulk. Within fifteen years, two industrial methods, electrolysis of water and the liquefaction and distillation of air, had brought its price down so far that a workshop could cut steel with it every day. Swingle's 1915 manual put it plainly: economical welding was the result of the fall in the price of oxygen that came from making it from air.

This chapter compares the methods of making oxygen that the early manuals described, calculates the yields and energy that separated them, and explains why air separation won. It also looks briefly at the on-site oxygen generators some workshops consider today.

## Oxygen in air

Air is the obvious source of oxygen: dry air is about 78.1% nitrogen, 20.9% oxygen and 0.9% argon by volume, with small amounts of carbon dioxide and other gases. Separating oxygen from it costs very little in principle and a great deal in practice. The minimum work needed to take pure oxygen out of air is set by thermodynamics, and for a small amount removed at 15 °C it is about RT × ln(1 ÷ 0.209), roughly 3.7 kJ per mole, or about **0.044 kWh per cubic metre** of oxygen. Real separation plants use many times that minimum, because no real process is perfectly efficient, but the low theoretical figure explains why air separation, once it was mastered, could beat every other method.

## Oxygen from chemicals

The oldest method, still used in laboratories, was to heat a chemical that gives up its oxygen. Swingle described heating manganese dioxide to a bright red heat, which gives up a third of its oxygen, and heating potassium chlorate, which gives up its oxygen more regularly if mixed with about an eighth of its weight of manganese dioxide. He was clear that these methods were not commercially useful for welding; they had been used only when oxygen could not be obtained any other way.

```figure
type: formula
title: Oxygen from heating potassium chlorate
formula: 2 KClO₃ → 2 KCl + 3 O₂
caption: Calculated at 15 °C and atmospheric pressure. The chemistry is historical context only: chlorate mixtures can be explosive and are not a workshop source of oxygen.
- M of KClO₃ | 122.55 g/mol
- V_m at 15 °C | 23.6 L/mol
step: moles of chlorate per kilogram = 1,000 ÷ 122.55 ≈ 8.16
step: moles of oxygen = 8.16 × 3 ÷ 2 ≈ 12.2
step: oxygen ≈ 12.2 × 23.6 ≈ 289 L per kilogram, about 3.5 kg of chlorate per cubic metre
```

Three and a half kilograms of a costly chemical for each cubic metre of oxygen, plus the fuel to heat it, put chemical oxygen far out of reach for cutting, which uses cubic metres an hour. Chlorate is also a strong oxidiser that can form explosive mixtures with fuels and organic matter, which made the method hazardous as well as dear.

## Cyclic chemical processes

Two nineteenth-century processes tried to make chemical oxygen cheap by regenerating the chemical. In one, attributed to Boussingault, barium oxide was heated gently in air, absorbing oxygen to form barium peroxide, and then heated more strongly to release the oxygen again, so that alternating the temperature gave a regular production of gas. In another, by Tessié du Motay and Maréchal, air was passed over a hot mixture of manganese dioxide and soda, which absorbed oxygen, and steam was then passed over it to release the oxygen and regenerate the mixture. Swingle noted that the barium process was still in use in 1915 but going out of use. Both processes took oxygen from air without using it up, which made them cheaper than chlorate, but they were slow and laborious, and they could not compete with the methods that followed.

## Portable chemical oxygen

Swingle also described products for making oxygen on site from chemicals, for places far from any oxygen works, where the rent and carriage of cylinders made compressed oxygen impossible. One was a perchlorate-based material that released its oxygen by burning itself; another was a mixture soaked in water that released gas slowly. Their only advantage was portability; they were costlier than cylinder oxygen wherever cylinders could be had. The modern descendants of those products are the chemical oxygen generators used in aircraft and mines for emergency breathing, not for welding.

## Oxygen by electrolysis

Passing an electric current through water, made conductive with a little acid or alkali, splits it into hydrogen and oxygen at the two electrodes, two volumes of hydrogen for each volume of oxygen. The Vulcan Process Company's 1914 manual illustrated an electrolytic oxygen plant producing oxygen of 99% purity, and the company strongly recommended electrolytic oxygen as the purest available. Swingle agreed that electrolytic oxygen was generally very pure, but warned that the cells needed great care and close supervision to stop the two gases mixing, since mixtures of hydrogen and oxygen are extremely dangerous, a risk he said had been reduced by automatic alarms that detected one gas diffusing into the other.

The energy needed follows from the chemistry. Each molecule of oxygen released takes four electrons, so each cubic metre of oxygen, about 42.3 mol at 15 °C, takes about 169 mol of electrons, or about 16.3 million coulombs of charge.

```figure
type: formula
title: Electrical energy to make a cubic metre of oxygen by electrolysis
formula: E = n_O₂ × 4 × F × V_cell
caption: At 15 °C and atmospheric pressure. 1.23 V is the theoretical minimum cell voltage at room temperature; practical cells run at around 2 V. The same energy also produces two cubic metres of hydrogen.
- n_O₂ per m³ | about 42.3 mol
- F, Faraday constant | 96,485 C/mol
- V_cell, practical | about 2.0 V
step: charge = 42.3 × 4 × 96,485 ≈ 16.3 MC
step: at 2.0 V: E ≈ 32.7 MJ ≈ 9.1 kWh per cubic metre of oxygen
step: at 1.23 V: E ≈ 5.6 kWh, the lower bound at room temperature
```

About 9 kWh per cubic metre is a great deal of electricity. This is an illustration. At an illustrative 30 cents per kilowatt-hour, the electricity alone for a cubic metre of electrolytic oxygen would cost about A$2.70, excluding GST, before the plant, the water, the compression and the labour. Electrolysis made economic sense only where electricity was cheap or where the hydrogen, made alongside, had a use of its own, which is why it survived longest as a source of hydrogen rather than of oxygen. Chapter 6 returns to electrolysis as a hydrogen source.

## Liquefying and distilling air

The method that won was the liquefaction of air followed by distillation. Carl von Linde developed the first industrial process for liquefying air in the 1890s and then for separating the liquid into oxygen and nitrogen; Georges Claude and others developed rival plants. Swingle described the main steps: air is compressed and then expanded, which lowers its temperature until it liquefies, and the liquid is then separated by fractional distillation, using the difference in the boiling points of its components. His conclusion was that the liquid-air process was the most economical and the most developed.

Viall's 1921 manual gave the boiling points that make the separation possible: about −182.7 °C for oxygen and −195.5 °C for nitrogen at atmospheric pressure, a difference of about 13 °C. Modern values are about −183.0 °C and −195.8 °C. In a distillation column, nitrogen, the more volatile component, rises as vapour and oxygen, the less volatile, collects as liquid at the bottom.

```figure
type: bars
title: Boiling points of the main components of air at atmospheric pressure
unit: °C below zero
max: 200
caption: Modern values. The small gap between oxygen and argon is why argon is the main impurity in cylinder oxygen and why recovering pure argon needs its own column.
- *Oxygen | 183.0
- Argon | 185.8
- Nitrogen | 195.8
```

## Argon as a by-product

The boiling points explain why argon, which makes up less than 1% of air, is so closely tied to oxygen production. Argon boils between oxygen and nitrogen, but much closer to oxygen, so it tends to stay with the oxygen in the column. Modern plants draw off an argon-rich stream from the column and purify it separately, which is the main source of the argon the workshop uses for shielding. If all the argon in the air processed were recovered, a plant would make about 9.3 ÷ 209 × 1,000 ≈ **44 litres** of argon for each cubic metre of oxygen, so argon supply follows oxygen production. Nitrogen, the largest component, is also recovered as a product.

## Why air separation won

Several things made air separation the winner. Its raw material, air, is free and everywhere. Its theoretical energy need is tiny, and even real plants, though many times less efficient than the ideal, use far less energy per cubic metre of oxygen than electrolysis. It scales well: large plants are much more efficient per cubic metre than small ones, which suits a few large works supplying a region. And it produces three saleable gases, oxygen, nitrogen and argon, from one plant.

```figure
type: compare
title: Methods of making oxygen compared
cols: Raw material | Energy and cost | Status
caption: Summarised from the early manuals and the calculations in this chapter. Real plant energy use depends on size, purity and design; only the theoretical figures are calculated here.
- Heating chlorate | potassium chlorate | about 3.5 kg of chemical per m³, plus heat | laboratory only
- Barium or manganate cycles | air, regenerated chemical | slow, laborious | abandoned
- Electrolysis | water and electricity | about 9 kWh per m³ at 2 V | used where hydrogen is wanted
- *Air separation | air | theoretical minimum about 0.044 kWh per m³; real plants several times more | the main source today
```

## Scale and the price of oxygen

Air separation rewards size in a way that chemical and electrolytic methods do not. The compressors, heat exchangers and distillation columns of a large plant lose proportionally less heat and energy than those of a small one, and a large plant runs continuously, day and night, at a steady rate that suits its cold equipment. Electrolysis, by contrast, needs the same electricity per cubic metre whatever the size of the plant, because the energy is set by the chemistry of the cell. That difference shaped the industry. By the time of the early manuals, oxygen was already being made in large central works and shipped in cylinders, and the history since has been one of ever larger plants serving ever wider regions, with distribution, not production, becoming the largest part of the price a small user pays. For the workshop, that means the cost of its oxygen depends more on how it is delivered than on how it is made, which is the subject of Chapter 8.

## From the plant to the workshop

Oxygen from an air separation plant is delivered in one of three ways. Large users close to a plant may be fed by pipeline. Medium users receive liquid oxygen by tanker into an insulated tank on site, from which it is evaporated as needed, as Chapter 8 describes. Small users, like the workshop, receive compressed gas in cylinders, filled at the plant or at a filling station from liquid. Each step adds cost, and the cylinder route, with its rental, handling and transport, adds the most per cubic metre, which is why the choice between cylinders and bulk supply, in Chapter 8, can matter so much.

## On-site oxygen generators

Some businesses consider making their own oxygen on site, with a generator that separates oxygen from compressed air using adsorbent materials that hold nitrogen more strongly than oxygen. These pressure-swing or vacuum-swing adsorption units are common for medical, aquaculture and some industrial uses. For welding and cutting, three questions decide whether one suits: the purity they deliver, which is generally lower than cylinder or liquid oxygen and matters greatly for cutting (Chapter 4); the compressed air and electricity they consume; and whether demand is steady enough to keep them running efficiently. For the workshop's intermittent, modest cutting, the manager found that an on-site generator did not suit, but the questions are the right ones for a larger, steadier user.

## The oil and grease warning

Every early manual warned against oil and grease near oxygen, and Swingle described the mechanism. High-pressure oxygen attacks oil, grease and fatty matter vigorously, and the heat produced can start combustion; the fire can spread to the valve's non-metallic parts and even its steel, letting oxygen escape in quantity into a fire that it then feeds. The Davis-Bournonville course of 1919 likewise warned that oxygen in contact with oil is an explosion risk, and told welders never to use oil, paint or white lead on oxygen joints. The warning applies with even more force to modern cylinders at higher pressures. Chapter 9 explains how oxygen fittings and piping are cleaned and what materials are compatible.

## A failure: the borrowed regulator

This is an illustration. A fitter whose oxygen regulator had failed borrowed one from the workshop's compressed-air bench, where it had been used on an air line for some months. The regulator had the right thread adapter fitted, and looked clean on the outside.

The supervisor stopped the substitution before the cylinder valve was opened. Air-line regulators are not cleaned for oxygen service, and compressed air commonly carries oil mist from the compressor, so the inside of the borrowed regulator was very likely contaminated with oil. Opening a high-pressure oxygen cylinder onto it could have ignited the oil in the regulator body. The fitter was given a regulator rated and cleaned for oxygen, the borrowed one was returned to the air bench, and the workshop labelled and stored oxygen equipment separately so that it could not be confused with equipment for other gases.

## Exercise: electrolysis and cutting oxygen

This is an illustration. The workshop uses about 120 m³ of oxygen a year for cutting. Calculate the electricity needed if that oxygen were made by electrolysis at a cell voltage of 2.0 V, its cost at 30 cents per kilowatt-hour, and the volume of hydrogen produced alongside. Compare the theoretical minimum work to separate the same oxygen from air.

At about 9.1 kWh per cubic metre, 120 m³ of electrolytic oxygen would need about 120 × 9.1 ≈ **1,090 kWh**, costing about 1,090 × 0.30 ≈ **A$327** a year in electricity alone, excluding GST, before any plant, compression or labour. The cells would also produce about 2 × 120 = **240 m³** of hydrogen, which the workshop has no use for.

The theoretical minimum work to separate 120 m³ of oxygen from air is about 120 × 0.044 ≈ **5.3 kWh**, about two hundred times less than the electrolysis figure. Real air separation plants use many times their theoretical minimum, but the gap explains why oxygen comes from air.
