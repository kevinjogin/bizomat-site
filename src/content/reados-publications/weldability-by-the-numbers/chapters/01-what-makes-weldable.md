---
book: weldability-by-the-numbers
chapterSlug: what-makes-a-metal-weldable
order: 1
title: "What makes a metal weldable"
description: "Compare metals by the handful of properties that decide how they weld, see where a 1915 handbook was right and wrong, and plan the pump-set repairs from properties first."
draft: false
---

Welders often speak of a metal as "easy" or "hard" to weld, as if weldability were a single property like density. It is not. A metal welds well or badly depending on how it conducts heat, how much it expands, what its surface oxide does, how its structure changes when it is heated and cooled quickly, and what it absorbs from the air and from contaminants while it is molten. Each of those can be measured, and together they explain almost every difference between welding mild steel and welding anything else.

Theodor Kautny's 1915 handbook took the same view. Autogenous welding, he wrote, applies to all metals and their alloys, but each must be discussed separately because its nature governs the work. This chapter sets out the properties that matter, compares the metals in the pump-set case, checks Kautny's figures against modern data, and shows why the workshop now plans every repair from the metal's properties before choosing a process.

## Weldability belongs to the job

A metal does not have one weldability. The same aluminium alloy may weld well by one process and poorly by another; the same cast iron may repair well in a small bracket and crack in a large, restrained casting; the same steel may be easy in thin section and need careful preheat in thick. Weldability is a property of the whole job: the metal, its thickness and form, the joint design, the process and filler, the restraint, and what the joint must do in service.

That is why the questions in this book always come in the same order. What is the metal, exactly? Which of its properties will cause trouble in this joint? What does each property demand of the process, the filler, the preheat and the procedure? Only then: which process?

## Six properties that decide the work

Six properties explain most of the difference between metals in welding.

1. **Melting point or range.** How much heat is needed to fuse the joint, and how the metal behaves near melting. Some metals give visible warning as they approach melting; aluminium gives almost none.
2. **Thermal conductivity.** How quickly heat flows away from the weld. High conductivity means the joint is hard to bring to temperature and the heat spreads widely.
3. **Thermal expansion.** How much the metal grows when heated and shrinks when it cools, which drives distortion and residual stress.
4. **Oxide behaviour.** Whether the surface oxide melts at a lower or higher temperature than the metal, and how quickly it reforms.
5. **Structural changes on heating and cooling.** Whether the metal hardens, softens or becomes brittle when heated and cooled quickly, as carbon steels and cast irons can, or loses strength gained by heat treatment or cold work, as many aluminium alloys do.
6. **Sensitivity to gases and contaminants.** Whether the molten metal absorbs hydrogen, oxygen or other gases and rejects them as pores when it freezes, and whether small amounts of elements such as sulphur embrittle it.

```figure
type: compare
title: Typical physical properties of the metals in the pump-set case
cols: Melting point (°C) | Thermal conductivity (W/m·K) | Expansion (10⁻⁶/°C)
caption: Typical values from The Engineering ToolBox tables. They vary with alloy and temperature; use certified data for design.
- Carbon steel | 1,425 to 1,540 | 54 | 10.8 to 12.5
- Grey cast iron | 1,127 to 1,204 | 52 | 10.8
- *Aluminium | 660 | 236 | 23
- Copper | 1,084 | 401 | 16 to 16.7
- Nickel | 1,453 | 94 | 13.0
- 316 stainless steel | about 1,510 | about 14 to 16 | 16.0
```

The table already tells a story. Aluminium melts at less than half the temperature of steel, conducts heat about four times as fast and expands about twice as much. Copper conducts heat about seven times as fast as carbon steel. Stainless steel conducts heat less than a third as well as carbon steel and expands about a third more. Cast iron is close to steel in conductivity and expansion but melts at a lower temperature and, as Chapter 5 shows, behaves very differently as it cools.

## Mild steel as the reference

Mild steel is the reference point because it is unusually tolerant on every count. Kautny explained one reason precisely: the melting point of mild steel is high enough to melt its own oxide, so the oxide flows together with the metal and no flux is needed. Its conductivity and expansion are moderate, so the heat stays reasonably near the joint and the shrinkage is manageable. And with low carbon it does not form much hard, brittle structure when it cools quickly.

Every other metal in the case departs from mild steel on at least one of the six properties. The departures tell the welder what to change: more heat or preheat for high conductivity, more care with restraint for high expansion or brittle structures, flux or gas shielding for refractory oxides, cleanliness and dry consumables for gas-sensitive metals.

## Strength that welding can take away

Some metals owe their strength to processing rather than composition, and welding undoes the processing. A metal strengthened by cold rolling softens where the weld heat anneals it. An aluminium alloy strengthened by heat treatment, such as the 6061-T6 cover in the case, loses part of that strength in the heat-affected zone, because, as TWI explains, fusion welding redistributes the constituents that harden it. Quenched and tempered steels can soften or harden beside a weld, depending on the heat. In all of these, the weld itself may be sound while the metal next to it is no longer as strong as the drawing assumed.

Kautny noticed a version of this in wrought iron. Rolled iron has a fibrous structure from the slag and flaws stretched out by rolling; melted under the flame, that structure becomes grainy. He observed that mechanical working after welding could restore the fibrous character. Today the equivalent questions are whether the alloy can be heat treated again after welding, whether the softened zone can be placed where the stress is low, or whether a joining method that does not melt the metal would serve better, which is where Chapter 10 ends.

## Gases, carbon and contaminants

Molten metal is chemically active, and what it picks up while molten it often cannot get rid of before it freezes. Kautny described several cases that still matter. Molten iron absorbs hydrogen and expels it as it solidifies, which can leave the weld foamed with small cavities. A flame with free carbon in it, a carburising flame, lets carbon into the molten iron, and the weld becomes harder and more brittle, so that wrought iron, in his words, could take on the character of steel or even cast iron. An oxidising flame burns the iron. The neutral flame matters for exactly these reasons, as the Library chapter on [flame chemistry and the neutral flame](/reados/publications/oxy-fuel-by-the-numbers/flame-chemistry-and-the-neutral-flame/) explains.

Each metal in this book has its own version. Hydrogen causes cracking in hardenable steels and porosity in aluminium. Oxygen combines with hydrogen to form steam in tough pitch copper. Sulphur embrittles nickel. Grey cast iron loses silicon and turns white. Knowing what a metal is sensitive to tells the welder what must be kept away from it: moisture, oil, paint, marker crayons, contaminated filler and the wrong flame or gas.

## Fume is a property too

What a metal gives off when it is heated is part of its weldability, because it decides the controls the work needs. Zinc from brasses and galvanised coatings, chromium from stainless steels, nickel from nickel alloys and fillers, copper, manganese and lead all produce fume with known health effects, and welding fume as a whole is recognised as a hazard. Safe Work Australia's model code of practice on welding processes sets out how the risks are managed, from substitution and ventilation to respiratory protection, and the material and consumable suppliers' safety data sheets give the specific hazards. A repair plan that lists the metals also lists the fume each will produce.

## Kautny's oxide rule

Kautny gave a rule about oxides that is still the clearest explanation of why some metals need flux and others do not. If a metal melts at a higher temperature than its oxide, the oxide melts first and the two flow together. If the metal melts at a lower temperature than its oxide, the oxide cannot be melted by the flame, because the molten metal beneath it holds the oxide film down to the metal's own melting temperature. However hot the flame, the oxide skin stays solid and gets in the way.

The remedy, he explained, is to destroy the oxide chemically with a flux or mechanically by stirring, scraping or hammering. Modern practice adds inert gas shielding and, for aluminium, the oxide-cleaning action of an alternating-current arc. But the rule itself explains why aluminium, many copper alloys and grey cast iron have traditionally needed fluxes in gas welding and why mild steel has not.

## Where the 1915 figures were right and wrong

Kautny's figures are a useful test of how far knowledge has moved. Some are close to modern values; others are well out.

```figure
type: compare
title: Kautny's figures against modern values
cols: Kautny, 1915 | Modern value
caption: Modern values from TWI for aluminium oxide and The Engineering ToolBox for the metals. The aluminium oxide figure was the largest error, but the rule built on it still holds.
- Aluminium melting point | 650 °C | 660 °C
- *Aluminium oxide melting point | above 3,000 °C | 2,060 °C
- Grey cast iron melting point | 1,050 °C | 1,127 to 1,204 °C
- Copper melting point | 1,084 °C | 1,084 °C
- Nickel melting point | 1,600 °C | 1,453 °C
```

The aluminium oxide figure was the largest error, but the gap between metal and oxide is still enormous: about 1,400 °C by modern figures. The conclusion Kautny drew from it, that the oxide must be destroyed rather than melted, is unchanged. His cast iron and nickel figures were also out, and Chapter 3 shows that his cast iron expansion figure was too high. A handbook's reasoning can outlast its numbers, and the reverse is also true; this book checks both.

## The pump-set repairs, property first

This is an illustration. The workshop lists each repair against the property most likely to cause trouble before anyone picks up a torch.

```figure
type: compare
title: The five repairs and the property that governs each
cols: Main hazard | Governing property
caption: This is an illustration. Each later chapter takes one of these repairs and works it through.
- Cast iron casing foot | cracking beside the weld | brittle structures and expansion, Chapters 3 and 5
- Medium-carbon steel shaft | hard, crack-prone HAZ | hardenability from carbon, Chapter 4
- *Aluminium cover boss | lack of fusion and porosity | oxide, conductivity, hydrogen, Chapter 6
- Copper coil header | joint never reaching fusion | conductivity, Chapters 2 and 7
- Stainless spool to mild steel | brittle mixed weld metal | dilution and expansion, Chapter 9
```

The list changes how the work is organised. The cast iron casing needs a preheat plan and a slow cool, so it goes first and is given the most time. The shaft needs its composition confirmed before any welding. The aluminium cover needs cleaning and dry filler. The copper header needs a heat source large enough for its mass. The stainless-to-steel joint needs a filler chosen for dilution. None of these decisions depends on which welding set happens to be free.

## A failure: the bracket welded like steel

This is an illustration. Some months earlier, the same workshop had repaired a cracked cast iron mounting bracket from a conveyor drive. The welder, experienced on steel structures, ground out the crack and welded it with steel electrodes, without preheat, as he would a steel bracket. The weld looked sound. The next morning a new crack ran along the edge of the weld, through the cast iron.

The investigation needed only the properties. Cast iron's high carbon and its brittleness had formed hard material beside the weld as it cooled quickly, and the weld's shrinkage had pulled on a metal that cannot stretch to accommodate it. Chapter 5 explains the details. The lesson the workshop took was procedural: no repair is planned until the metal is identified and its governing properties written down, which is how the pump-set list above came to exist.

## Identifying the metal

Property-first planning depends on knowing what the metal is, and in maintenance that is not always obvious. Drawings, part numbers, manufacturer's data and material certificates are the first sources. Where they are missing, simple shop checks give clues: a magnet separates carbon and ferritic steels and cast irons from austenitic stainless steels, aluminium and copper alloys; the sound and spark of a grinder separate cast iron from steel; colour and weight separate copper alloys from aluminium. A portable spectrometer, available from many inspection companies, gives a composition in minutes and is the only reliable way to confirm a grade when it matters. The cost of identification is small compared with the cost of a repair that fails because the metal was not what everyone assumed.

For the pump set, the casing's grey cast iron was confirmed from the manufacturer's drawing and a grinder spark test, the shaft's composition from a portable spectrometer reading, the cover's alloy and temper from its part marking, the coil's copper grade from the original supplier's data, and the spool's grade from the stamp on the pipe. Each identification and its source went onto the repair record before the planning began.

## Exercise: reading the property table

Using the property table above, calculate how many times faster than carbon steel copper, aluminium and 316 stainless steel conduct heat, and how much more each expands for the same temperature rise, using 12 × 10⁻⁶/°C for carbon steel. Say what each ratio implies for welding.

Conductivity ratios: copper 401 ÷ 54 ≈ **7.4**, aluminium 236 ÷ 54 ≈ **4.4**, stainless steel about 14.4 ÷ 54 ≈ **0.27**. Expansion ratios: copper about 16.5 ÷ 12 ≈ **1.4**, aluminium 23 ÷ 12 ≈ **1.9**, 316 stainless steel 16.0 ÷ 12 ≈ **1.3**. Copper and aluminium draw heat away from the weld so fast that more heat, or preheat, is needed to fuse the joint, and the heated area spreads widely. Stainless steel keeps the heat concentrated near the weld, so it overheats locally and, with its higher expansion, distorts more than carbon steel for the same heat. Aluminium's high expansion combined with a wide heated zone makes it prone to distortion and to cracking under restraint, which Chapter 3 quantifies.
