---
book: brazing-and-soldering-by-the-numbers
chapterSlug: difficult-metals
order: 9
title: "Difficult metals: carbide, stainless, aluminium and cast iron"
description: "Braze carbide to steel without cracking it, deal with the stubborn oxides of stainless steel and aluminium, and see why graphite makes cast iron hard to wet, with the 1905 Ferrofix process as a case."
draft: false
---

Copper, brass and carbon steel braze easily: their oxides dissolve in ordinary fluxes, their expansions are not far apart, and silver fillers wet them readily. Other metals are harder. Tungsten carbide expands less than half as much as steel and cracks if the joint is not designed for it. Stainless steel and aluminium carry oxide films so stable that ordinary fluxes cannot remove them. Cast iron has graphite in its surface, which molten filler will not wet. Each of these needs its own approach, and each was a problem the early manuals either struggled with or could not solve.

This chapter works through the four, starting with the manufacturer's cracked carbide tips, where the problem is thermal expansion, and moving on to stainless steel, aluminium and cast iron, where the problem is the surface.

## Carbide tips and expansion

Cemented tungsten carbide, carbide grains held in a cobalt binder, is hard, stiff and brittle, and it expands with temperature far less than steel: about 5.5 millionths per degree against about 12 for carbon steel, using the approximate values of Chapter 3. When a carbide insert is brazed to a steel shank, both are at brazing temperature as the filler freezes, and from that moment they are locked together. As they cool to room temperature, the steel tries to shrink more than the carbide, and the difference must be taken up somewhere.

```figure
type: formula
title: Mismatch strain between steel and carbide after brazing
formula: ε = (α_steel − α_carbide) × ΔT
caption: This is an illustration, taking a filler that freezes at about 650 °C and approximate expansion coefficients. The stress is an order-of-magnitude upper bound for full elastic constraint; real stresses are lower because the filler and steel yield, but are still high enough to crack carbide.
- α steel | about 12 × 10⁻⁶ /°C
- α carbide | about 5.5 × 10⁻⁶ /°C
- ΔT, from the filler's freezing point to room temperature | about 630 °C
step: ε ≈ 6.5 × 10⁻⁶ × 630 ≈ 0.0041
step: over a 20 mm insert, the steel tries to shrink about 0.08 mm more than the carbide
step: fully constrained in carbide with a stiffness of about 600 GPa: stress of order 2,000 MPa
```

A strain of about 0.4% does not sound large, but carbide cannot stretch, and the stress it implies, if the joint held the two parts rigidly, would be far above the stress carbide can carry in tension. In practice the filler layer yields and the steel bends, relieving much of the stress, but what remains bends the tip and puts the carbide surface in tension at its edges, where cracks start, sometimes during cooling and sometimes only when the tool is first loaded.

## Keeping carbide whole

Several measures reduce the mismatch stress, and practical carbide brazing usually combines them:

- **A ductile interlayer.** A tri-metal shim, a sheet of copper with a layer of brazing filler on each side, puts a thicker layer of soft metal between the carbide and the steel. The copper yields and absorbs much of the mismatch, so that less stress reaches the carbide.
- **A lower freezing point.** A filler that freezes at a lower temperature shortens the ΔT over which mismatch builds, reducing the strain in proportion.
- **Slow, even cooling.** Cooling slowly, for example by burying the tool in an insulating material, lets the filler and steel relax, and avoids the steep temperature gradients that add stress of their own. Quenching a freshly brazed carbide tool in water is a common cause of cracked tips.
- **Joint shape.** Small inserts and joints that let the carbide sit in a pocket, rather than on a long flat lap, reduce the length over which mismatch accumulates.
- **A filler that wets carbide.** Carbide is not wetted by every filler; makers offer fillers formulated for carbide, and the Open University's brazing table lists a copper-nickel-silicon filler, at about 1,100 °C, for tungsten carbide to steel joints.

## The running case: cracked tips

This is an illustration. The machine shop that buys the manufacturer's re-tipped tools reported a run of carbide inserts cracking in the first week of use. Inspection showed fine cracks running in from the edges of the inserts, parallel to the joint, on tools from one batch.

The production manager traced the batch to a week when the regular tool brazer was on leave. The relief brazer had used ordinary silver filler wire without the tri-metal shim the work instruction called for, because the shim stock had run out, and had quenched each tool in water to clean off the flux faster. Both changes increased the mismatch stress: no ductile interlayer to absorb it, and a fast quench that added steep thermal gradients. The cracks had started during cooling and grown when the tools were first loaded. The remaining tools from the batch were scrapped, shim stock was added to the reorder list with a minimum level, and the work instruction was revised to forbid quenching carbide tools and to require cooling in the insulated box.

## Stainless steel and its oxide

Stainless steels resist corrosion because chromium in them forms a thin, tough, self-healing oxide film. That film is exactly what a brazing filler must get through. Ordinary borax-type fluxes do not dissolve chromium oxide well, so stainless steels need fluxes designed for refractory oxides, which the Open University guide lists as fluorine and boron compounds active between about 600 and 1,000 °C, or furnace brazing under vacuum or a dry hydrogen atmosphere, which removes or prevents the oxide.

Stainless steel brings two further cautions. Some austenitic stainless steels, heated for long periods in a range of several hundred degrees, can have their corrosion resistance reduced next to the joint as chromium is drawn into carbides; the steel maker's data say which grades are at risk and how to avoid it, often by using low-carbon or stabilised grades or by keeping the heating short. And joints in stainless steel exposed to water can suffer crevice corrosion at the edge of the filler; filler makers offer alloys with better resistance, and the Open University table lists a silver-copper-palladium filler for good crevice corrosion resistance.

## Aluminium: the long problem

Aluminium was the great failure of early soldering. Cravens wrote in 1921 that it had so far been practically impossible to solder aluminium commercially, and that most of the many processes devised for it had failed. Hart's 1910 manual explained two reasons. Aluminium forms an oxide film instantly in air, which no ordinary flux removes. And aluminium is electropositive to almost all the metals used in solders, so that a soldered aluminium joint in a damp place becomes a galvanic cell and corrodes, the aluminium dissolving at the joint. Hart's conclusion was that aluminium parts should be joined by welding or riveting rather than by solder, though he noted experimental self-fluxing solders containing phosphorus and fluxes based on fluorides.

The problem was eventually solved by brazing with aluminium-silicon fillers, which are close to aluminium in composition and so avoid most galvanic corrosion, using fluoride-based fluxes or vacuum to deal with the oxide. Furnace brazing of clad sheet, aluminium sheet with a thin layer of aluminium-silicon filler rolled onto it, now makes most car radiators and air-conditioning heat exchangers. The difficulty that remains is the narrow margin: aluminium-silicon fillers melt not far below the aluminium alloys they join, so the temperature must be controlled closely or the parts themselves begin to melt. Weldability by the Numbers discusses aluminium's oxide and hydrogen in its chapter on [aluminium, oxide, hydrogen and heat](/reados/publications/weldability-by-the-numbers/aluminium-oxide-hydrogen-and-heat/).

```figure
type: compare
title: Four difficult metals and what makes them difficult
cols: The difficulty | Usual answers
caption: General summary. The filler, flux and furnace makers' data, and the parent metal maker's guidance, govern each combination.
- *Tungsten carbide | expansion far below steel; brittle | tri-metal shim; low-freezing or carbide-wetting filler; slow cooling
- Stainless steel | tough chromium oxide; corrosion at the joint | refractory-oxide flux or vacuum or hydrogen furnace; corrosion-resistant filler
- Aluminium | instant oxide; galvanic corrosion; narrow temperature margin | aluminium-silicon filler; fluoride flux or vacuum; close temperature control
- Cast iron | graphite in the surface resists wetting | remove surface graphite; braze welding; fillers and fluxes for cast iron
```

## Cast iron and graphite

Grey cast iron contains flakes of graphite, and where they break the surface, molten filler will not wet them, because graphite is not wetted by most brazing fillers. A fracture face or a machined surface of cast iron exposes many graphite flakes, so a filler that wets steel readily may stand off cast iron in beads. The usual remedies are to remove the graphite from the surface, by special cleaning, by brief oxidation that burns it out of the surface layer, or with fluxes made for cast iron, and to use braze welding rather than capillary brazing where the joint is a repair of a broken casting.

## A 1905 answer: the Ferrofix process

Hart described an early solution, the Ferrofix brazing process devised by Frederick Pich, reported in 1905. The broken pieces of iron were joined with a thin film of hard brass that alloyed with the iron surfaces, which Hart reported had been shown by sectioning a joint to reach a depth of about one-sixteenth of an inch, about 1.6 mm. The solder had to melt at no less than 650 °C for the alloying to happen. The flux was equal parts of sodium carbonate and boric acid with a little common salt for fluidity, and the process used kerosene torches and a small furnace of fire-brick round the work.

Hart explained the chemistry of the flux as given in the patent: the sodium carbonate took up grease from the iron, and on heating it reacted with the boric acid to form anhydrous borax and carbon dioxide, so that freshly made borax, with no water of crystallisation to make it swell, lay in close contact with the clean metal. That is the same problem of swelling borax described in Chapter 5, solved by making the borax on the work. The claims for the depth of alloying belong to their time, but the process shows how early brazers attacked the surface problem of cast iron with chemistry. Modern cast iron repair is discussed in Weldability by the Numbers, in its chapter on [cast iron, graphite, silicon and repair](/reados/publications/weldability-by-the-numbers/cast-iron-graphite-silicon-and-repair/).

## Coated steels

Galvanised and other zinc-coated steels are difficult for a different reason: the zinc coating melts at about 420 °C and boils at about 907 °C, below most brazing temperatures, so heating burns off the coating near the joint and gives off zinc oxide fume. Low-temperature brazing fillers and braze welding, often with copper-silicon or copper-aluminium fillers and processes that keep the heat low, limit the damage, but the coating near the joint is usually lost and must be restored, for example with a zinc-rich paint, if the corrosion protection matters. The zinc fume needs extraction at the joint, as Chapter 10 explains, and parts are best cleaned of coating in the joint area before brazing where the design allows, so that less zinc is heated at all.

## Dissimilar pairs

Many difficult joints are difficult because they are dissimilar: carbide to steel, copper to aluminium, stainless steel to copper. Brazing is often the best way to join such pairs, because neither part melts, but the joint must deal with the larger of the two parts' problems, the expansion mismatch of the pair, and any galvanic corrosion between them and the filler in service. Weldability by the Numbers covers these questions in its chapter on [joining different metals](/reados/publications/weldability-by-the-numbers/joining-different-metals/).

## The revised carbide procedure

The manufacturer's revised work instruction for re-tipping set out each step that the cracked batch had shown to matter, so that a relief brazer would follow the same method as the regular one. The instruction names the filler, the shim, the flux and the torch, and it is kept at the brazing bench with photographs of a correctly assembled and a correctly cooled tool.

```figure
type: checklist
title: The manufacturer's carbide re-tipping steps
caption: This is an illustration of the business's revised instruction. The carbide and filler makers' guidance sets the materials, temperatures and cooling for each tool.
- x Pocket and insert cleaned | old filler removed, carbide degreased, steel ground bright
- x Tri-metal shim fitted | cut to the insert, never omitted
- x Carbide-rated flux on all faces | including the shim
- x Heat the shank first | the carbide heats by conduction, never in the direct flame
- x Seat the insert and hold | press down lightly as the filler runs
- *? Cool slowly in the insulated box | never quench; clean flux only when cold
```

## Reactive and refractory metals

Beyond the four metals in this chapter lie others that are harder still. Titanium, zirconium and similar reactive metals absorb oxygen, nitrogen and hydrogen at brazing temperatures and become brittle, so they are brazed only in high vacuum or very pure inert gas, with fillers designed for them. Refractory metals such as molybdenum and tungsten have very high melting points and stubborn oxides, and ceramics must often be metallised or brazed with active fillers that react with the ceramic surface. These are specialist processes, carried out by firms that do nothing else, and their procedures are developed and qualified for each combination. For a general workshop, the lesson is to recognise when a joint has moved out of ordinary brazing and to seek that specialist help rather than improvise.

## Exercise: a lower-freezing filler

The manufacturer's carbide tools are brazed with a filler that freezes at about 650 °C. A filler maker offers an alternative that freezes at about 600 °C. Using the approximate expansion coefficients in this chapter, compare the mismatch strain from each filler on cooling to 20 °C, and the extra shrinkage of the steel over a 25 mm insert.

With the 650 °C filler, ε ≈ 6.5 × 10⁻⁶ × 630 ≈ **0.0041**, and over 25 mm the steel tries to shrink about 25 × 0.0041 ≈ **0.102 mm** more than the carbide. With the 600 °C filler, ε ≈ 6.5 × 10⁻⁶ × 580 ≈ **0.0038**, and the difference over 25 mm is about **0.094 mm**.

The lower-freezing filler reduces the mismatch by about 8%, a useful but modest gain. A tri-metal shim, which absorbs much of the mismatch in its copper layer, and slow cooling usually do more, which is why the manufacturer kept the shim and the cooling box and treated the filler change as an additional measure, not a replacement.
