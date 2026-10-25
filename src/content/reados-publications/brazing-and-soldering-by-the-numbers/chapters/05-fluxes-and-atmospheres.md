---
book: brazing-and-soldering-by-the-numbers
chapterSlug: fluxes-and-atmospheres
order: 5
title: "Fluxes and atmospheres"
description: "See what a flux does to oxide and why it works only near the filler's melting range, why old manuals calcined borax, which soldering fluxes corrode, and when an atmosphere replaces flux."
draft: false
---

Almost every metal in air is covered with a film of oxide, often only a few millionths of a millimetre thick, and that film is what a molten filler meets. Most oxides are not wetted by molten metal, so a filler on an oxidised surface beads up and will not flow, as Chapter 2 explained. Heating makes the problem worse, because metals oxidise faster as they get hotter, and a brazing temperature of 700 °C in air grows a fresh oxide film in seconds. Something must remove the oxide and keep it from re-forming until the filler has wetted the surface. That something is a flux, or, in a furnace, a protective atmosphere or a vacuum.

This chapter explains what fluxes do, why each works only over a limited range of temperature, why the early manuals insisted on calcined borax, which soldering fluxes are corrosive and which are not, and when a controlled atmosphere replaces flux altogether.

## What a flux does

A flux has three jobs. It **dissolves or reduces the oxide** already on the surfaces as it melts. It **covers the surfaces** with a liquid layer that keeps air away while the joint heats, so that new oxide cannot form. And it **helps the filler wet**, by lowering the surface energy between the filler and the metal. When the filler arrives, it displaces the flux from the gap, flowing in behind it onto clean metal. The flux is then a waste product, carrying the dissolved oxide, and must be removed.

A flux can do those jobs only while it is molten and active. The Open University's brazing guide notes that a flux is active over a band of roughly 50 °C either side of the melting temperature of the brazing filler. Below that band, the flux has not yet melted or is too viscous to flow; above it, the flux is exhausted quickly, having dissolved all the oxide it can, or begins to break down. A flux is therefore chosen to match a particular filler and temperature, not just a particular metal.

## Fluxes by temperature and metal

```figure
type: compare
title: Brazing flux families by temperature and use
cols: Working range | Use
caption: Summarised from the Open University brazing guide. Each flux maker's data sheet gives the actual working range, the metals and fillers it suits, and its hazards.
- Borax and fluoroborate types | general use above about 750 °C | most metals except those with refractory oxides
- *Fluoride types | general use below about 750 °C | most metals except those with refractory oxides; silver brazing
- Fluorine and boron compounds | about 600 to 1,000 °C | metals with refractory oxides, such as stainless steels with chromium
- Alkali-halide types | the low temperatures of aluminium brazing | aluminium and its alloys
```

The "refractory oxides" in the table are tough, stable oxides, such as the chromium oxide that protects stainless steels and the aluminium oxide on aluminium, which ordinary fluxes cannot dissolve. Stainless steel, aluminium and some other metals therefore need special fluxes or a controlled atmosphere, as Chapter 9 describes.

## Borax and its water

Borax, sodium tetraborate, was the brazing flux of the early manuals and remains a base of many fluxes. Hart's 1910 manual and Cravens's 1921 manual both insisted that borax be burnt, or calcined, before use, to drive off its water of crystallisation; otherwise, they warned, it would swell up in the flame, blister, jump off the work and be lost, while calcined borax simply melted and ran over the surface in a thin glassy layer that cleaned off oxide and grease. Both noted that boric acid was cheaper and could be used for rough work, and both recommended cleaning the metal by filing or scraping, and removing grease, before fluxing.

The chemistry explains the warning. Ordinary borax crystals carry ten molecules of water for each formula unit of sodium tetraborate.

```figure
type: formula
title: Water of crystallisation in ordinary borax
formula: water fraction = (M_decahydrate − M_anhydrous) ÷ M_decahydrate
caption: Calculated from molar masses. The water boils off violently when crystals are heated suddenly, which is why the early manuals calcined borax first.
- Borax decahydrate, Na₂B₄O₇·10H₂O | about 381.4 g/mol
- Anhydrous borax, Na₂B₄O₇ | about 201.2 g/mol
step: water fraction = (381.4 − 201.2) ÷ 381.4
step: about 47% of ordinary borax crystal is water by mass
```

Nearly half the mass of a borax crystal is water. Heated suddenly in a flame, that water turns to steam inside the crystal and puffs it up into a light, frothy mass that blows off the work. Calcining first, by heating the borax gently until the water is driven off, leaves a glassy anhydrous flux that melts cleanly. Modern commercial fluxes are supplied as pastes and powders made to behave properly when heated, but the reason old borax had to be calcined is a neat example of chemistry turned into workshop practice.

## Applying flux

Flux is applied to both surfaces of the joint, after cleaning and before assembly, so that the inside of the gap is covered as well as the outside. A paste is brushed on; a powder may be mixed to a paste with water or applied by dipping a hot filler rod into it. Hart described mixing powdered spelter with flux and spreading it on the joint, a practice still used in pastes that combine filler and flux. The flux should cover the area that will be heated, a little beyond the joint, so that the surrounding metal does not oxidise and draw the filler away from the joint.

Too little flux is exhausted before the joint is made. Too much does no harm to the joint but adds cost and cleaning. A useful sign while heating is the flux's appearance: a good silver brazing flux bubbles as its water evaporates, then turns clear and fluid as it becomes active, which tells the brazer the joint is approaching brazing temperature.

## How much oxide a flux must handle

The quantity of oxide on a clean surface is small, but not negligible. This is an illustration. Suppose the inside of a 22 mm socket 12 mm deep, about 829 mm² of surface, carries an oxide film 1 micrometre thick after heating in air under a thin flux. At a density of about 6.3 g/cm³ for copper oxide, that film is about 829 × 0.001 × 6.3 ≈ **5 mg** of oxide on the socket alone, and as much again on the tube. A few milligrams sounds like nothing, but the film thickens quickly as the temperature rises and the flux layer thins, and a flux spread too thinly or heated too long reaches its limit. The calculation is one reason flux makers specify a generous, even coating, and why heating time matters as much as temperature.

## Exhausting the flux

A flux can dissolve only so much oxide. If a joint is heated too long before the filler is applied, or heated far above the filler's melting range, the flux takes up oxide until it is saturated, then stops protecting the surface, which oxidises again. The flux darkens, turns glassy or black, and the filler balls up, as in the carbide tip failure of Chapter 2. The cures are to heat quickly, to apply the filler as soon as the flux shows the joint is ready, and to use a flux with a working range that suits the joint's heating time. Large joints that take a long time to heat need fluxes that stay active longer, and the flux maker's data sheet says which those are.

## Flux residues

The flux left after brazing contains the dissolved oxide and active chemicals, and most brazing flux residues are corrosive if left on the work, especially in damp conditions. Hart noted that acids used as fluxes were liable to remain in a joint and decompose it slowly. Modern practice removes residues promptly, usually by soaking or washing in hot water while the residue is still fresh, sometimes with brushing or a mild chemical cleaner where the residue has become glassy. Residues trapped inside a joint or an assembly, where washing cannot reach, are a reason to choose a flux-free process or a filler that needs no flux.

## Self-fluxing fillers

Some fillers carry their own flux. Copper-phosphorus fillers, widely used for joining copper to copper, contain phosphorus that reacts with copper oxide at brazing temperature and removes it, so they can join copper without a separate flux. Hart mentioned an early aluminium solder that used phosphorus in the same way. The same phosphorus that makes them self-fluxing on copper is the reason copper-phosphorus fillers must not be used on steel or nickel alloys, where it forms brittle phosphides at the interface; their makers state this restriction plainly. Joining copper to brass with a copper-phosphorus filler needs a flux, because the zinc and other elements in brass form oxides that phosphorus does not remove.

## Soldering fluxes

Soldering fluxes work at much lower temperatures and fall into three broad groups. **Inorganic acid fluxes**, such as zinc chloride and ammonium chloride solutions, are strongly active and clean heavily oxidised metals well. Hart described zinc chloride, made by dissolving zinc in hydrochloric acid, as the best flux for plumbing in his day, and listed sal ammoniac, resin, tallow and borax among the others. **Organic acid fluxes**, based on weaker acids, are active but less aggressive and are designed to be washed off. **Rosin and similar resin fluxes** are mildly active and leave a residue that is relatively benign, which is why they are used for electrical and electronic work.

```figure
type: compare
title: Soldering flux groups
cols: Activity | Residue | Typical use
caption: General characteristics. The flux maker's data, the product standard and the application's requirements decide which flux may be used; electrical work in particular restricts corrosive fluxes.
- Inorganic acid, such as zinc chloride | high | strongly corrosive; must be washed off | sheet metal, some plumbing
- Organic acid | moderate | corrosive if left; water-washable | plumbing, general work
- *Rosin and resin types | mild | relatively benign; often left on | electrical and electronic work
```

Using the wrong group is a common cause of failure. An acid flux on an electrical connection leaves residues that corrode the wire and the terminal over months, in a way that can raise resistance until the joint overheats.

## Protective atmospheres and vacuum

In a furnace, flux can be replaced altogether by controlling the gas around the parts. The Open University guide lists argon, nitrogen, hydrogen, cracked ammonia and vacuum as furnace brazing atmospheres used without flux. Inert atmospheres, such as argon and nitrogen, stop new oxide forming but do not remove oxide already present, so the parts must be very clean. Reducing atmospheres containing hydrogen actively remove the oxides of copper, iron and nickel at brazing temperature, converting them back to metal and water vapour; their effectiveness depends on how dry they are, measured by the dew point. Vacuum brazing removes the air altogether and suits stainless steels, nickel alloys and other metals with stubborn oxides.

Furnace brazing without flux leaves no residue and lets clearances be smaller, close to zero for some fillers according to filler makers' guidance, because there is no flux to displace. It suits production of many identical assemblies. Industrial Gases by the Numbers describes the hazards of the gases involved, including hydrogen's flammability, in its chapter on [hydrogen and the oxy-hydrogen flame](/reados/publications/industrial-gases-by-the-numbers/hydrogen-and-the-oxy-hydrogen-flame/).

## Purging inside tubes

Torch brazing of copper tube in air oxidises the inside of the tube as well as the outside, leaving a black scale that flakes off later and can block valves and filters, a serious problem in refrigeration and some hydronic systems. The usual practice is to pass a slow flow of nitrogen through the tube while it is brazed. This is an illustration. A 3 m length of tube with a 20 mm bore holds about π × 0.01² × 3 ≈ 0.94 L, so five volume changes, enough to sweep most of the air out, need about 4.7 L of nitrogen, about a minute at 5 L/min, before the joint is heated. The purge is kept flowing gently until the joint has cooled below the temperature at which scale forms. The same exponential dilution reasoning is explained in the shielding chapter of Industrial Gases by the Numbers.

## Flux hazards

Fluxes carry hazards of their own. Many brazing fluxes contain fluorides, which release irritating and toxic fume when heated and can burn skin and eyes; their residues are also harmful. Soldering fluxes release fume when heated, and rosin fume can sensitise the airways of some people, causing asthma. Each flux's safety data sheet sets out its hazards and controls, which typically include local exhaust ventilation at the joint, skin and eye protection, and washing hands before eating. Chapter 10 brings the fume controls together.

## A failure: green joints

This is an illustration. A distributor reported green deposits on several of the manufacturer's manifolds after a few months in a damp store. The deposits were round the brazed outlets and had begun to pit the brass. They were flux residue: after the brazing line had been rearranged, the hot-water soak that removed residues had been skipped on some batches to save time, and the fluoride-containing residue had absorbed moisture and attacked the metal.

The soak tank was put back on the line with a minimum soak time on the work instruction, and a visual check for residue was added to the final inspection. The manufacturer also checked its control boxes and found that a new technician had been using an acid plumbing flux on the electrical connections; those boxes were reworked with a rosin-type flux suited to electrical work.

## Exercise: borax for a job

An old brazing instruction calls for 200 g of calcined borax. If only ordinary borax crystals, the decahydrate, are available, how much must be calcined to give 200 g of anhydrous borax? And how much water will be driven off?

Anhydrous borax is about 201.2 ÷ 381.4 ≈ 0.528 of the mass of the decahydrate. To give 200 g of anhydrous borax, about 200 ÷ 0.528 ≈ **379 g** of crystals must be calcined, and about 379 − 200 ≈ **179 g** of water will be driven off. Nearly half of what goes into the pan comes out as steam, which is why the early manuals told brazers to calcine it slowly and separately, never in the flame on the work.
