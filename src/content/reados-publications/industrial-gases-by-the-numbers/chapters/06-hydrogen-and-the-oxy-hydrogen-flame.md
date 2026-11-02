---
book: industrial-gases-by-the-numbers
chapterSlug: hydrogen-and-the-oxy-hydrogen-flame
order: 6
title: "Hydrogen and the oxy-hydrogen flame"
description: "Understand hydrogen: the first welding flame, its heat against acetylene's, its place in modern mixtures, and why its leaks behave unlike any other gas."
draft: false
---

Hydrogen was the first fuel gas used with oxygen for welding. The oxy-hydrogen flame was in use for lead burning and light welding before oxy-acetylene, and Viall's 1921 manual described how widely it was used until acetylene's hotter flame took over. Hydrogen kept a place for some cutting, brazing, preheating and lead work, especially where electrolytic oxygen plants made it as a by-product. Today it appears in the workshop mainly as a small part of some shielding and purging mixtures, but its properties are so different from those of other gases that anyone handling it needs to understand them.

This chapter explains why the oxy-hydrogen flame needed so much excess hydrogen, compares hydrogen's heat with acetylene's, looks at where hydrogen is used in welding now, and works through the ways hydrogen leaks and burns that make it unlike any other workshop gas.

## The lightest gas

Hydrogen, H₂, has a molar mass of about 2.016 g/mol, so its density at 15 °C and atmospheric pressure is only about 0.085 kg/m³, about 7% of the density of air. A kilogram of hydrogen occupies about **11.7 m³**. Viall quoted a figure, attributed to McCormack, of 192.4 cubic feet per pound, about 12.0 m³/kg, close to the modern value once the different reference temperatures are allowed for. That lightness has three consequences: hydrogen rises and disperses very fast in open air, it escapes through gaps that would hold other gases, and a cylinder of compressed hydrogen holds very little mass, and so very little energy, for its size.

## The first welding flame

The theory of the oxy-hydrogen flame is simple: two volumes of hydrogen burn with one volume of oxygen to form water vapour. Viall explained the practical problem. A flame with oxygen to spare oxidises, or burns, the hot metal, and the water vapour in the flame is itself mildly oxidising. To protect the metal, welders used a large excess of hydrogen, so that any free oxygen in the flame combined with hydrogen rather than with the metal. Viall gave the practical ratio as four or five volumes of hydrogen to one of oxygen, and Swingle's 1915 manual described a typical torch mixture of four volumes of hydrogen to one of oxygen, with half the hydrogen burning in the flame with the cylinder oxygen and the rest later in oxygen drawn from the air.

```figure
type: compare
title: Theoretical and practical oxy-hydrogen mixtures
cols: Hydrogen to oxygen by volume | What it does
caption: From Viall (1921) and Swingle (1915), restated in new words. The excess hydrogen protected the metal from oxidation at the cost of a larger, cooler flame.
- Theoretical | 2 to 1 | all the hydrogen burns with the cylinder oxygen; flame tends to oxidise the metal
- *Practical, early manuals | 4 or 5 to 1 | excess hydrogen takes up free oxygen; larger, cooler, less oxidising flame
```

The excess hydrogen was wasteful, as Viall noted, because the heat available was still limited to what the cylinder oxygen could burn, while the flame grew larger and cooler. And even the excess did not remove the water vapour, which stayed in contact with the hot metal. The oxy-hydrogen flame was therefore best for thin sheet, lead, brazing and preheating, and Viall advised against it for steel more than a few millimetres thick.

## Heat per cubic metre

Hydrogen releases much less heat per cubic metre than acetylene, because each molecule is so small. From standard enthalpies of formation, burning a mole of hydrogen to water vapour releases about 241.8 kJ, and burning a mole of acetylene to carbon dioxide and water vapour releases about 1,255 kJ, including the 226.7 kJ stored in acetylene's triple bond.

```figure
type: formula
title: Heat released per cubic metre of fuel gas, burned completely to water vapour
formula: heat per m³ = heat per mole ÷ molar volume
caption: Lower heating values at 15 °C and atmospheric pressure, from NIST formation enthalpies. Swingle's 1915 figures, converted, were about 13 and 61 MJ per cubic metre, on a different basis but in a similar ratio.
- Hydrogen, per mole | about 241.8 kJ
- Acetylene, per mole | about 1,255 kJ
- Molar volume at 15 °C | 23.6 L
step: hydrogen ≈ 241.8 ÷ 0.0236 ≈ 10.2 MJ per cubic metre
step: acetylene ≈ 1,255 ÷ 0.0236 ≈ 53.1 MJ per cubic metre
step: acetylene gives about 5.2 times the heat of the same volume of hydrogen
```

Swingle gave 350 British thermal units per cubic foot for hydrogen and 1,630 for acetylene, about 13 and 61 MJ/m³, a ratio of about 4.7; his figures appear to be on a gross basis, counting the heat of condensing the water vapour, and at a different reference temperature, but the conclusion is the same. Hydrogen's heat is spread through a large, cool flame, while acetylene's is concentrated in a small, very hot inner cone, which is why acetylene took over welding.

## Why hydrogen kept a place in cutting

Viall noted that oxy-hydrogen had a wide field in cutting, especially of heavy sections. In a cut, the preheat flame only has to bring the steel to its ignition temperature; the cutting oxygen does the rest. Hydrogen's long flame was useful for preheating deep into thick sections, and because it contains no carbon, it produced no carbon monoxide to dilute the cutting jet. Viall reported a comparison in which an oxy-hydrogen cut was smoother and freer of slag than an oxy-acetylene cut on the same work, and suggested that the acetylene flame's carbon monoxide diluted the cutting oxygen. Modern cutting uses acetylene, propane, propylene, natural gas and, in some places, hydrogen, each chosen on cost, availability and the work.

## Making hydrogen

In the early manuals, hydrogen came mainly from electrolysis of water, which produces two volumes of hydrogen for every volume of oxygen, as Chapter 5 explained. At a practical cell voltage of about 2 V, the electricity needed is about 4.5 kWh per cubic metre of hydrogen, half the 9.1 kWh per cubic metre of oxygen, because the same charge produces twice the volume of hydrogen. Viall pointed out that electrolysis suited private installations precisely because it gave hydrogen and oxygen together, and many early users burned the hydrogen in their own torches.

Today most industrial hydrogen is made from natural gas by steam reforming, with electrolysis growing where low-emission hydrogen is wanted. For a workshop, hydrogen arrives in cylinders, or already mixed into a shielding or purging gas.

## Hydrogen in modern welding gases

Hydrogen appears in two common types of workshop gas. Mixtures of argon with a small percentage of hydrogen are used for tungsten arc welding and plasma processes on austenitic stainless steels and some nickel alloys, where the hydrogen gives a hotter, more constricted arc and a cleaner, brighter weld surface, because it reacts with oxygen at the weld. Mixtures of nitrogen with a small percentage of hydrogen, often called forming gas, are used for back purging stainless steel welds, for the same reason. The suppliers specify which materials each mixture suits.

Hydrogen must not be used in shielding gases for welding carbon and low-alloy steels, or for aluminium, because hydrogen dissolved in the weld metal causes cracking in hardenable steels and porosity in aluminium. The Library explains those mechanisms in Weldability by the Numbers, in its chapters on [carbon, cooling rate and hardness](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/) and on [aluminium, oxide, hydrogen and heat](/reados/publications/weldability-by-the-numbers/aluminium-oxide-hydrogen-and-heat/). A cylinder of argon-hydrogen mixture left on a bay that welds steel or aluminium is an accident waiting to happen, which is why the workshop keeps such mixtures, if it uses them, on a labelled, dedicated station.

## How hydrogen leaks

Hydrogen escapes more readily than any other gas. Its molecules are the smallest, so it passes through gaps, threads and seals that hold other gases, and a fitting that is tight on argon may weep hydrogen. Its low density means a leak rises immediately, so a leak indoors collects under the roof, in ceiling voids, skylights and the upper parts of rooms, where it may not be noticed. And because hydrogen has no smell, colour or taste, a leak cannot be detected by the senses at all; the hissing of a large leak is the only warning without instruments.

The modern flammable range, from the US Department of Energy's gaseous hydrogen safety information, is about 4% to 75% by volume in air, wider than almost any other common gas. Viall's 1921 manual gave a range of about 10% to 66%, and noted that another writer gave 6% to 72%; the variation shows how much such figures depended on the test conditions of the time, and why modern safety data sheets, not old manuals, are the source to use.

```figure
type: range
title: Hydrogen's flammable range in air, then and now
unit: % of hydrogen by volume in air
min: 0
max: 100
caption: The 1921 ranges are those reported by Viall; the modern range is from the US Department of Energy's gaseous hydrogen Safetygram. Use the current safety data sheet for any assessment.
- Viall 1921 | 10 | 66
- Another writer, quoted by Viall | 6 | 72
- *Modern reference | 4 | 75
```

## The invisible flame

Hydrogen burns with a very pale flame that can be almost invisible in daylight, and it radiates little heat compared with hydrocarbon flames, so a person can walk into a hydrogen fire without seeing or feeling it until they are burned. A hissing hydrogen leak that has ignited may show only shimmering air. Specialist guidance on hydrogen therefore recommends flame detectors suited to hydrogen, and people approaching a suspected hydrogen leak treat the area as though a flame may already be present, because one may be.

## Hydrogen and metals

Hydrogen can also harm some metals, particularly high-strength steels, by diffusing into them and making them brittle. That is why hydrogen cylinders, valves and piping are made from materials selected for hydrogen service, and why equipment intended for other gases must not be converted to hydrogen. It is the same mechanism, on a different scale, that makes hydrogen in weld metal a cause of cracking.

## A leak under the roof

This is an illustration. Suppose a hydrogen cylinder's fitting leaked about 1 L/min into a workshop with a closed roof void of 300 m³ above a suspended ceiling, and none of the hydrogen escaped from the void. To reach the lower flammable limit of about 4% throughout the void would take about 0.04 × 300 = 12 m³ of hydrogen, or 12,000 minutes, roughly **200 hours** at 1 L/min.

That sounds reassuring, but the calculation assumes the hydrogen mixes evenly through the whole void. It does not. Hydrogen rises and collects at the highest points first, so a pocket under the ridge or in a corner could exceed 4% long before the average does, and a light fitting or fan motor in that pocket could ignite it. The lesson is not the 200 hours but the need to stop leaks, keep hydrogen cylinders outdoors or in well-ventilated places with high-level ventilation, and keep ignition sources away from where hydrogen collects.

## Storing and using hydrogen

The practical rules follow from the properties. Hydrogen cylinders are stored outdoors or in ventilated stores with openings at high level, away from oxidising gases and ignition sources. Connections are leak tested with a suitable solution or detector every time a cylinder is changed. Regulators and fittings rated for hydrogen are used, and hydrogen equipment is not interchanged with equipment for other gases. Mixtures containing hydrogen are labelled and kept apart from the stations that weld steel and aluminium. And the safety data sheet for each hydrogen-containing product, which states whether the mixture is classified as flammable, governs its storage and use.

## Hydrogen in the running case

This is an illustration. The workshop had been offered an argon-hydrogen mixture for its stainless steel tungsten arc work, with the promise of faster welding and brighter welds. The manager weighed the offer against the workshop's layout. Its tungsten arc bay welded stainless steel and aluminium on the same machine, with the gas changed according to the job, and the risk of the hydrogen mixture being left connected for an aluminium weld was real. The manager decided to stay with pure argon until the workshop had a dedicated stainless bay, and noted the decision and its reason in the gas plan described in Chapter 10.

## A failure: the weeping fitting

This is an illustration. A laboratory-style test rig in a neighbouring business used a small hydrogen cylinder with a regulator and fitting taken from an old argon setup. The fitting passed a quick leak test with soapy water on installation, but a hydrogen detector later fitted in the room showed a small, persistent reading near the ceiling.

The fitting's seal, adequate for argon, was weeping hydrogen too slowly to make bubbles. Replacing the fitting with one rated for hydrogen, and checking it with the detector rather than by eye, cleared the reading. The business also added a high-level vent to the room. The case illustrates two points from this chapter: hydrogen finds leaks that other gases do not, and hydrogen equipment should be rated for hydrogen rather than borrowed from another gas.

## Exercise: hydrogen against acetylene for a preheat

A preheating job needs about 50 MJ of heat delivered by the flame. Estimate the volume of hydrogen and of acetylene needed if each delivered its lower heating value to the work with the same efficiency, and the number of volumes of hydrogen per volume of acetylene. Then say why the comparison favours acetylene even more in practice for most welding.

At about 10.2 MJ/m³, hydrogen would need about 50 ÷ 10.2 ≈ **4.9 m³**; at about 53.1 MJ/m³, acetylene would need about 50 ÷ 53.1 ≈ **0.94 m³**. Hydrogen needs about 5.2 times the volume of acetylene for the same heat.

In practice, the comparison favours acetylene further for welding, because acetylene concentrates its heat in a small, very hot inner cone that melts steel quickly at the point of the weld, whereas the oxy-hydrogen flame, run with excess hydrogen to protect the metal, is larger and cooler and spreads its heat. For broad preheating of thick sections, where spreading heat is the aim, hydrogen's disadvantage is smaller, which is why the early manuals recommended it for that work.
