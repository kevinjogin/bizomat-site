---
book: weldability-by-the-numbers
chapterSlug: aluminium-oxide-hydrogen-and-heat
order: 6
title: "Aluminium: oxide, hydrogen and heat"
description: "Deal with aluminium's refractory oxide, its appetite for hydrogen, its conductivity and expansion and the strength it loses beside a weld, and plan the rebuild of a corroded cover boss."
draft: false
---

Aluminium is light, corrosion resistant, conducts heat and electricity well and machines easily, and it is now one of the most widely welded metals. It is also the metal on which steel habits fail most quickly. It melts at a lower temperature than steel but needs more heat to weld; it gives no glowing warning before it melts; it is covered by an oxide that will not melt with it; it absorbs hydrogen and rejects it as pores; it expands twice as much as steel; and in many alloys the weld heat takes away strength the alloy gained by heat treatment.

Kautny's chapter on aluminium identified the central problem precisely, even though one of his figures was badly out. This chapter follows his reasoning, adds what modern practice has learned, and plans the rebuild of the corroded drain boss on the pump set's 6061-T6 cover plate.

## The oxide that will not melt

For Kautny, everything in aluminium welding turned on how far apart the metal and its oxide melt. He gave 650 °C for the metal and more than 3,000 °C for the oxide. TWI gives modern values of about 660 °C for the metal and 2,060 °C for aluminium oxide. The gap is smaller than Kautny thought but still about 1,400 °C.

```figure
type: bars
title: Melting points that govern aluminium welding
unit: °C
max: 2200
caption: TWI's figures for aluminium and its oxide; carbon steel from The Engineering ToolBox (upper end of its range). The oxide melts about 1,400 °C above the metal it covers.
- Aluminium | 660
- Carbon steel | 1540
- *Aluminium oxide | 2060
```

His explanation of why this matters, introduced in Chapter 1, is exact. The oxide forms a thin, tough film on every surface and on every droplet of molten metal. Heat from the flame cannot melt it, because the molten aluminium beneath it, holding its latent heat, keeps the film cooled down to the metal's own melting temperature. The film stays solid, separates drops of molten metal that should flow together, and can be trapped in the weld as a skin that prevents fusion.

He also made a point about soldered joints that still deserves attention. A soldered aluminium joint unites the metal without destroying the oxide, so a film remains between the parts. Because the metal and its oxide have different electrical properties, he argued, the joint forms a galvanic cell, which in an industrial atmosphere containing dilute acid will eventually destroy the union. A welded joint must destroy the oxide to achieve a true metallic bond.

## Destroying the oxide, then and now

Kautny described three ways of destroying the oxide.

- **Mechanically, by hammering or rolling.** Clean surfaces laid together, heated to about 400 °C and hammered gently but quickly, or rolled, break up the oxide films and weld the metal without melting it. He noted this was used at large scale in Germany for making aluminium vessels.
- **Mechanically, by stirring.** Melting the edges and stirring the pool with the filler rod breaks up the films and lets the drops run together, though he judged it unreliable and impractical in thin sheet.
- **Chemically, with flux.** A flux of alkali chlorides with fluorides dissolves the oxide. He warned that such fluxes are extremely hygroscopic and must be kept in sealed bottles, and that the flux must not be overheated by the flame or touched by the inner cone.

Modern practice keeps all three ideas in new forms. Fluxes are still used in gas welding and brazing of aluminium, and their residues are corrosive and must be removed after welding. Most aluminium welding now uses inert gas shielding, by tungsten inert gas and metal inert gas processes, which prevents fresh oxide forming on the pool; with alternating current, the tungsten arc also breaks up the surface oxide during the half-cycle when the work is the cathode. And Kautny's hammering and rolling have become friction stir welding, which Chapter 10 describes.

Whatever the process, preparation follows TWI's sequence: degrease first, then remove the oxide mechanically, for example by brushing with a stainless steel wire brush, scraping or filing. Degreasing must come first, or the brush drives oil into the surface. Because the oxide reforms quickly, the cleaned joint should be welded soon after preparation.

## No glowing warning

Steel glows red, orange and yellow as it heats, and an experienced welder reads the colour. Aluminium does not change colour noticeably before it melts. Combined with its high conductivity, which spreads the heat widely, this means that a whole region can approach melting together and then collapse suddenly, especially in thin sections. Welders learn to watch the surface for a change in sheen and the pool for wetting rather than colour, and supports beneath thin parts prevent collapse.

## Hydrogen and porosity

Molten aluminium dissolves hydrogen readily; solid aluminium holds very little. TWI describes a decrease in solubility of the order of twenty times as solidification takes place. Hydrogen that cannot escape before the pool freezes forms pores. TWI identifies hydrogen as the main cause of porosity in aluminium welds and notes that even trace levels may exceed the threshold at which pores form.

The hydrogen comes from moisture and hydrocarbons: oil, grease and moisture on the parent metal and filler, a hydrated oxide layer, and water vapour in the shielding gas or drawn into it. The controls are cleanliness and dryness: thorough cleaning of the joint and filler, filler stored dry and protected, an efficient gas shield, and, TWI advises, purging the gas system before use. Slower cooling, from higher heat input or lower travel speed, gives gas more time to escape.

## Cracking and the choice of filler

Aluminium alloys fall into two broad groups. TWI describes the 1xxx, 3xxx and 5xxx series as non-heat-treatable, strengthened by work hardening and alloying, and the 2xxx, 6xxx and 7xxx series as heat-treatable, strengthened by heat treatment. Several heat-treatable alloys are prone to hot cracking: solidification cracks along the weld centreline and in craters, and liquation cracks in the heat-affected zone, to which 6xxx and 7xxx alloys are more susceptible.

The principal defence is the filler. TWI explains that non-matching fillers are used for lean and heat-treatable alloys to prevent solidification cracking: 6xxx alloys such as 6061 are welded with a 4xxx (aluminium-silicon) filler such as R-4043A to reduce the risk of liquation cracking, or with R-5356 (aluminium-magnesium), while 4043-type fillers must not be used on high-magnesium alloys such as 5083. TWI also notes that non-matching fillers may give lower weld strength and may not respond to post-weld heat treatment.

```figure
type: compare
title: Aluminium alloy groups and welding
cols: How strengthened | Welding notes
caption: Summarised from TWI's job knowledge article on the weldability of aluminium alloys.
- 1xxx, 3xxx, 5xxx | work hardening and alloying | generally weldable; HAZ loses work hardening
- *6xxx, e.g. 6061 | heat treatment | weldable with 4xxx or 5xxx filler; HAZ softens; liquation risk
- 7xxx | heat treatment | medium-strength grades weldable; high-strength grades not recommended
- 2xxx | heat treatment | most not recommended for fusion welding
```

## Strength lost beside the weld

In a heat-treatable alloy such as 6061-T6, the T6 temper represents a solution treatment and artificial ageing that develop its strength. Fusion welding, TWI explains, redistributes the hardening constituents in the heat-affected zone and locally reduces strength. The weld may be sound and the alloy correctly filled, yet a band of softer metal remains beside it unless the whole part is heat treated again, which is rarely practical for a repair.

That has design consequences. A welded 6061-T6 part must be designed or assessed for the softened zone, not for the full T6 properties, and threaded or highly stressed features should be placed away from welds where possible. For a repair, it means asking whether the welded feature will carry its load once softened.

Kautny ended his chapter by saying that aluminium welding demands great skill and training, but that a well-made weld comes close to the strength of the unwelded metal. For the pure and lightly alloyed aluminium of his day, often in the soft condition, that was a fair claim. For a modern heat-treated alloy in the T6 temper, the weld and its heat-affected zone will normally be weaker than the parent metal unless the part is heat treated again, and the design or repair must allow for it.

## Aluminium castings

Many aluminium parts that need repair are castings, not wrought plate: pump bodies, gearbox covers, engine components. Cast aluminium alloys are usually rich in silicon and behave differently from the wrought 6061 of the cover. Castings can contain gas porosity from the casting process, which opens up under the weld, and parts that have run in oil absorb it into porous regions. Their compositions vary widely, so the filler must be chosen for the specific alloy, ideally from the casting supplier's data. A casting that has been in oil service is degreased and often heated to drive out absorbed oil before welding, and a trial weld on a hidden area, or on a scrap part of the same type, shows whether the casting itself will produce porosity regardless of preparation.

## Expansion and distortion

TWI describes aluminium's thermal expansion as twice that of steel and its contraction on solidification as typically 5% more than in equivalent steel welds. Chapter 3 set a distortion budget for the cover on these grounds. A 400 mm length of aluminium heated by 150 °C grows by about 23 × 10⁻⁶ × 150 × 400 ≈ 1.38 mm, against about 0.72 mm for steel. Clamping to a flat backing, balanced deposition and allowance for machining remain the practical controls.

## The cover boss rebuild

This is an illustration. The cover's 30 mm diameter threaded drain boss is pitted by corrosion to about 4 mm deep. The plan is to machine it back to sound metal, about 5 mm deep, rebuild it by tungsten inert gas welding, then face, drill and tap it again.

- **Volume.** Restoring a 30 mm diameter boss by 5 mm needs about π ÷ 4 × 30² × 5 ≈ **3,534 mm³** of metal, about 3.5 cm³ or 9.5 g of aluminium, plus an allowance for machining.
- **Preparation.** Degrease the whole cover, which has been in service with water and oil; then stainless steel brush the boss area immediately before welding.
- **Filler.** R-4043A, following TWI's guidance for 6061, stored sealed and dry.
- **Distortion.** Clamp the cover to a flat steel backing plate with an insulating layer, deposit in small runs around the boss, check flatness before and after.
- **Thread.** Because the heat-affected zone softens, the rebuilt boss will be weaker than the original T6 metal. The workshop decided to fit a thread insert rather than rely on threads cut directly into the softened weld and heat-affected zone, and recorded the reason.

```figure
type: checklist
title: Before welding the cover boss
caption: This is an illustration of the workshop's pre-weld checks for the aluminium cover.
- x Alloy and temper confirmed | 6061-T6 from part marking
- x Whole cover degreased | not just the boss area
- x Boss brushed with stainless brush | immediately before welding
- x Filler R-4043A | from a sealed, dry batch
- x Gas line purged | before the first arc
- x Clamped to flat backing | flatness measured and recorded
- ? Thread insert | size and type to be confirmed with the customer
```

## Inspecting aluminium welds

Porosity and lack of fusion, the two commonest aluminium weld defects, are often invisible on the surface. Dye penetrant testing finds surface-breaking cracks and pores but not those below the surface. Radiography and ultrasonic testing find internal defects in welds where they are justified. For a small repair, sectioning a trial weld made with the same procedure, material and position, as the workshop did after its failure, is a cheap and convincing check. Because TWI notes that high conductivity makes lack of fusion, lack of penetration and undercut more likely in aluminium, the edges of the weld deserve as much attention as its centre.

## A failure: the porous first boss

This is an illustration. On a first attempt, the boss was rebuilt, faced and drilled, and the drill broke into a cluster of fine pores just below the surface. A section through the boss showed porosity through much of the deposit.

Two hydrogen sources were found. The cover had been degreased only around the boss, so oil from the rest of the cover had crept back into the warm joint during preheating. And the filler rods came from an open tube stored in an unheated shed where condensation formed overnight. The correction followed TWI's controls: the cover was degreased completely and the boss brushed immediately before welding, a new sealed batch of filler was used and returned to sealed storage between uses, and the gas line was purged before starting. The second rebuild machined free of pores. The porous first boss also showed why the drilling and tapping stage is a useful inspection in its own right: a drill that breaks into pores, or a tap that tears out softened metal, reveals a problem before the part goes back into service.

## Exercise: comparing the boss with a steel boss

A steel boss of the same dimensions would be rebuilt by depositing about 3,534 mm³ of steel. Calculate the mass of that deposit using 7,850 kg/m³, compare it with the aluminium deposit, and list three reasons why the aluminium boss nevertheless needs more care than the steel one.

The steel deposit would weigh about 3.534 × 7.85 ≈ **27.7 g**, nearly three times the aluminium's 9.5 g. The aluminium needs more care because: its oxide, melting near 2,060 °C against the metal's 660 °C, must be removed and kept from reforming; its hydrogen solubility falls about twenty times on freezing, so any moisture or oil becomes porosity; and its heat-affected zone loses the strength of the T6 temper and its expansion is about twice steel's, so the rebuilt feature is both weaker and more prone to distortion than the original.
