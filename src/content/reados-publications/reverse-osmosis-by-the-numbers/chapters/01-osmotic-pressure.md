---
book: reverse-osmosis-by-the-numbers
chapterSlug: osmotic-pressure-the-pressure-to-beat
order: 1
title: "Osmotic pressure: the pressure to beat"
description: "Why salty water pulls fresh water through a membrane, the van 't Hoff osmotic pressure with an osmotic coefficient, and how to calculate it from an ion analysis rather than one figure."
draft: false
---

Every reverse osmosis plant is a fight against one number. Put fresh water and salty water on either side of a membrane that passes water but not salt, and water moves towards the salty side on its own. To stop it, the salty side must be pressurised; to reverse it, and squeeze fresh water out of the salty side, the pressure must be higher still. The pressure that exactly stops the flow is the osmotic pressure of the salty water, and it is the floor under every feed pressure, pump selection and energy figure in this book.

This chapter explains where osmotic pressure comes from, sets out the van 't Hoff relation that gives it for dilute solutions, and shows how to calculate it properly from a water analysis rather than from a single dissolved-solids figure. It then applies the relation to BW-12's bore water with the WORKOS concentrate-end tool, and ends with a spreadsheet that counted the salt wrongly and chose a pump that could not reach the end of the membrane train.

## Why water moves towards salt

Water molecules in pure water and in salty water are the same molecules, but they are not equally free. In salty water some of the space and some of the arrangements available to water are taken up by dissolved ions, and the water's tendency to escape, which chemists call its chemical potential, is lower. Water therefore moves, by diffusion through any path open to it, from where its chemical potential is higher to where it is lower: from fresh to salty. A membrane that passes water but blocks ions turns that tendency into a measurable flow.

The flow stops when something raises the chemical potential of the water on the salty side back to that of the fresh side. Pressure does exactly that. Squeezing a liquid raises the chemical potential of every molecule in it in proportion to the pressure and the molar volume, so a pressure difference equal to the osmotic pressure balances the dilution effect of the salt, and the net flow is zero. Statistical physics derives the dilute-solution result from the entropy of mixing: the ions dilute the water, and the pressure needed to undo that dilution is proportional to how many dissolved particles there are and to the absolute temperature, and does not depend on what the particles are. That last point matters. A sodium ion and a sulfate ion count the same in the dilute limit, although a sulfate ion weighs four times as much.

```figure
type: svg
title: Osmosis, equilibrium and reverse osmosis across the same membrane
alt: Three panels side by side, each a tank divided by a vertical membrane with fresh water on the left and salty water on the right. In the first panel an arrow shows water crossing from left to right with no applied pressure. In the second a piston presses on the salty side with a pressure equal to the osmotic pressure and there is no flow. In the third the piston pressure exceeds the osmotic pressure and the arrow shows water crossing from right to left.
caption: The membrane is the same in all three panels; only the pressure on the salty side changes. Reverse osmosis is the third panel, and the pressure above the osmotic pressure is what drives the flow.
viewbox: 0 0 660 230
body:
<rect class="bx" x="20" y="60" width="180" height="120" rx="4"/>
<rect class="bx" x="240" y="60" width="180" height="120" rx="4"/>
<rect class="bx" x="460" y="60" width="180" height="120" rx="4"/>
<path class="ln dsh" d="M110 60V180M330 60V180M550 60V180"/>
<text class="tx txs" x="34" y="168">fresh</text>
<text class="tx txs" x="140" y="168">salty</text>
<text class="tx txs" x="254" y="168">fresh</text>
<text class="tx txs" x="360" y="168">salty</text>
<text class="tx txs" x="474" y="168">fresh</text>
<text class="tx txs" x="580" y="168">salty</text>
<path class="la flow" d="M70 120H150"/>
<path class="ah" d="M150 120l-10-6v12z"/>
<rect class="bxa" x="350" y="40" width="50" height="16" rx="2"/>
<path class="li" d="M375 20V40"/>
<rect class="bxa" x="570" y="40" width="50" height="16" rx="2"/>
<path class="li" d="M595 12V40"/>
<path class="la flow" d="M610 120H500"/>
<path class="ah" d="M500 120l10-6v12z"/>
<text class="txb" x="40" y="44">osmosis</text>
<text class="txb" x="250" y="34">pressure = π</text>
<text class="txb" x="460" y="30">pressure &gt; π</text>
<text class="tx txs" x="250" y="210">no net flow</text>
<text class="tx txs" x="40" y="210">water moves to the salt</text>
<text class="txa" x="470" y="210">reverse osmosis</text>
```

## The van 't Hoff relation

For a dilute solution the osmotic pressure is the ideal-gas law in disguise. If the dissolved particles were a gas occupying the volume of the solution, they would exert a pressure equal to their molar concentration times the gas constant times the absolute temperature. The osmotic pressure of a dilute solution is that same number. Jacobus van 't Hoff noticed the parallel in the 1880s, and the relation carries his name.

Real salt solutions fall a little short of the ideal because the ions attract and repel one another, and the shortfall is carried by an osmotic coefficient, φ, which is close to one in very dilute solutions and falls to around 0.92 to 0.95 for sodium chloride at the strengths found in brackish water. The coefficient is a measured property: Hamer and Wu's critically evaluated tables, published in 1972 in the Journal of Physical and Chemical Reference Data, give 0.944 at 0.05 mol/kg, 0.933 at 0.1 mol/kg, 0.924 at 0.2 mol/kg and 0.923 at 0.6 mol/kg, roughly seawater strength.

```figure
type: formula
title: Osmotic pressure of a dilute solution
formula: π = φ × Σcᵢ × R × T
formula: π in pascals when Σcᵢ is in mol/m³ (numerically mmol/L), R = 8.314 J/(mol·K) and T in kelvin
caption: This is an illustration: BW-12's bore water at 25 °C. Every dissolved particle counts once, whatever its mass or charge. One bar is 100,000 Pa.
- Dissolved particles | Σcᵢ = 69.70 mmol/L = 69.70 mol/m³, from the ion analysis below
- Ideal (φ = 1) | 69.70 × 8.314 × 298.15 = 172,770 Pa = 1.728 bar
step: With φ = 0.93: π = 0.93 × 1.728 = 1.607 bar
step: At 18 °C the same water gives 1.569 bar; at 30 °C, 1.634 bar
```

Temperature appears in the relation directly, but over the range BW-12 sees, 18 to 30 °C, the osmotic pressure changes by only about 4%. Chapter 4 shows that the membrane itself responds to temperature far more strongly, and that is where the season matters.

It helps to have a feel for the size of the number. A pressure of 1.607 bar is the weight of a column of water about 16.4 m tall. If a tube of BW-12's bore water were sealed at its foot with a perfect membrane and stood in a tank of pure water, pure water would leak in and the column would rise until its extra height was about 16 m, and then stop. In an operating plant the same number appears as the part of the feed pressure that does no useful work in moving water: it only cancels the pull of the salt. The permeate side has an osmotic pressure too, because a little salt passes the membrane. BW-12's permeate, at about 36 mg/L, has an osmotic pressure of about 0.024 bar, which slightly helps the flow, since it is the difference in osmotic pressure across the membrane that opposes the applied pressure. For brackish plants the permeate term is small enough to ignore in a first check, and the tools in this book carry it where it matters.

The relation also explains why seawater and brackish water plants are different machines. Seawater at about 35 g/L of dissolved salts behaves roughly like 0.6 mol/kg sodium chloride; with φ = 0.923 its osmotic pressure at 25 °C is about 27.4 bar, seventeen times BW-12's feed. A brackish plant's pressure is set mostly by the membrane's resistance and the concentrate; a seawater plant's is set mostly by osmotic pressure.

## From a water analysis to the particle count

A laboratory report gives dissolved solids as a mass, in mg/L, and lists the major ions. The mass is what the regulator and the boiler supplier care about, but the osmotic pressure needs the number of particles, and different ions bring very different numbers of particles per milligram. The method is simple: divide each ion's concentration by its molar mass to get mmol/L, and add them up.

```figure
type: compare
title: BW-12's bore water analysis, turned into particles
cols: mg/L | Molar mass, g/mol | mmol/L | Charge equivalents, meq/L
rowhead: Ion
caption: This is an illustration. Cations 38.98 meq/L, anions 39.25 meq/L: an ion balance error of −0.34%, which shows the analysis is complete. Silica is uncharged and counts as a particle but not in the balance.
- Sodium | 600 | 22.99 | 26.10 | 26.10
- Potassium | 12 | 39.10 | 0.31 | 0.31
- Calcium | 120 | 40.08 | 2.99 | 5.99
- Magnesium | 80 | 24.31 | 3.29 | 6.58
- Chloride | 1,060 | 35.45 | 29.90 | 29.90
- Sulfate | 260 | 96.06 | 2.71 | 5.41
- Bicarbonate | 240 | 61.02 | 3.93 | 3.93
- Silica | 28 | 60.08 | 0.47 | none
- * Total | 2,400 | 34.44 per particle | 69.70 | 38.98 and 39.25
```

Two checks come free with the table. The first is the ion balance: the positive and negative charge equivalents must match, because water is electrically neutral. BW-12's analysis balances to within 0.34%. A large imbalance means an ion is missing or misreported, and an osmotic pressure built on it will be wrong. The second is the mean molar mass per particle, here 2,400 ÷ 69.70 = 34.44 g/mol. It is lower than the 58.44 g/mol of sodium chloride because sodium chloride delivers two particles per formula unit, each averaging 29.2 g/mol, and BW-12's water is mostly sodium and chloride with some heavier divalent ions mixed in.

Membrane makers use the same idea in their design manuals. The FilmTec system design equations give the feed osmotic pressure in pounds per square inch as 1.12 × (273 + T) × Σmⱼ, where Σmⱼ is the sum of the molalities of all constituents. Converted to SI, the coefficient is 7.72 kPa per kelvin per mol/kg, which is 0.929 times the gas constant: the maker's formula is the van 't Hoff relation with an osmotic coefficient of about 0.93 built in. For BW-12's water it gives 1.604 bar, within 0.2% of the value above.

## Running the numbers with the WORKOS tool

The [reverse osmosis concentrate-end check](/tools/ro-concentrate-pressure-check/) calculates the osmotic pressure with an osmotic coefficient and then carries it through the stage. From the feed dissolved solids, the molar mass of the dissolved salt, the number of ions per formula unit, the osmotic coefficient and the temperature, it finds the molar concentration and the feed osmotic pressure. From the salt rejection and the recovery, it finds the permeate and concentrate strengths by a solute balance and their osmotic pressures. It then subtracts the element pressure drop and permeate back pressure to give the net driving pressure at the feed end and at the concentrate end, and the least feed pressure that keeps a required driving pressure at the concentrate end. It assumes one osmotic coefficient for all three streams and ignores the extra salt at the membrane surface, which Chapter 5 adds back.

The tool asks for a molar mass and ions per formula unit, which suits a single salt. For a mixed water the particle count can be entered directly by giving the mean molar mass per particle, 34.44 g/mol, and one particle per "formula unit". The tool then divides 2.4 g/L by 34.44 g/mol and gets the correct 69.70 mol/m³.

```figure
type: stats
title: BW-12 at its design point, from the concentrate-end check
caption: This is an illustration. Inputs: 2.4 g/L, 34.44 g/mol, 1 particle, φ 0.93, 25 °C, 75% recovery, 98.5% rejection, 11.5 bar gauge feed, 3.0 bar element pressure drop, 0.5 bar gauge permeate, 1.0 bar required at the concentrate end.
- 1.607 bar | Feed osmotic pressure | 69.70 mol/m³ of particles
- 9.49 g/L | Concentrate dissolved solids | osmotic pressure 6.355 bar
- 9.42 bar | Net driving pressure at the feed end | after 0.5 bar permeate pressure
- * 1.67 bar | Net driving pressure at the concentrate end | after 3.0 bar of pressure drop
- 10.83 bar g | Least feed pressure | to keep 1.0 bar at the concentrate end
```

The result shows the shape of every brackish plant. At the feed end the water is weak and the driving pressure is large, 9.42 bar. By the time it reaches the concentrate end it is four times as salty, it has lost 3.0 bar to friction, and only 1.67 bar of driving pressure remains. The last elements in the train make little water, and the feed pressure is chosen mainly to keep them working. Chapter 2 develops the mass balance behind the concentrate strength; Chapter 3 turns driving pressure into flow.

## The error: salt counted as one particle

This is an illustration. Before BW-12 was built, a supplier's sizing spreadsheet calculated osmotic pressure as dissolved solids divided by the molar mass of sodium chloride, times RT, with no factor for the two ions each formula unit releases. For BW-12's water that gives 41.07 mol/m³ instead of 69.70, and a feed osmotic pressure of 0.947 bar instead of 1.607 bar, 41% too low.

Everything downstream inherited the error. The spreadsheet's concentrate osmotic pressure was 3.74 bar instead of 6.35 bar, its concentrate-end driving pressure at 11.5 bar was 4.27 bar instead of 1.67 bar, and its least feed pressure for 1.0 bar at the concentrate end was 8.23 bar instead of 10.83 bar. The supplier offered a high-pressure pump rated for 10 bar at the membrane inlet, comfortably above its 8.23 bar.

```figure
type: compare
title: Three ways to count BW-12's particles, run through the concentrate-end check
cols: Particles, mol/m³ | Feed π, bar | Concentrate π, bar | Least feed pressure, bar g
rowhead: Method
caption: This is an illustration. Same inputs as the stats figure above, only the particle count changes. Treating the water as sodium chloride with two ions per unit overstates the pressure by 18%; forgetting the second ion understates it by 41%.
- Dissolved solids ÷ 58.44, one particle | 41.07 | 0.947 | 3.74 | 8.23
- Dissolved solids ÷ 58.44, two particles | 82.13 | 1.894 | 7.49 | 11.96
- * Sum of the ion analysis | 69.70 | 1.607 | 6.35 | 10.83
```

The plant's engineer found the problem with two checks that took ten minutes. The first was the maker's own osmotic pressure formula, which gave 1.60 bar against the spreadsheet's 0.95. The second was the expectation that a brackish water's concentrate end needs a feed pressure several bar above its concentrate osmotic pressure plus the train's pressure drop: 3.74 + 3.0 + 0.5 looked too low for a water that tastes distinctly salty. The pump was respecified for the 10.83 bar design point plus the winter margin of Chapter 4, and the supplier's spreadsheet was corrected to sum the particles from the analysis.

The opposite shortcut, sodium chloride with two particles, overstates the pressure by 18% for this water because its divalent calcium, magnesium and sulfate bring fewer particles per milligram than sodium chloride does. It errs on the safe side for the pump, but it oversizes the pump and the motor and makes the energy estimate of Chapter 8 pessimistic. The ion analysis is cheap; use it.

## Where the analysis comes from

A reverse osmosis design is only as good as its water analysis, and bore water is not constant. Salinity can change with pumping rate, season and years of drawdown, and a single sample taken when the bore was drilled may not represent the water the plant will see. Three habits help.

- **Ask for a full ion analysis, not just dissolved solids or conductivity.** It should include sodium, potassium, calcium, magnesium, iron, manganese, chloride, sulfate, bicarbonate or alkalinity, nitrate, fluoride, silica, pH and temperature. Ask for the ion balance error to be reported.
- **Use a laboratory accredited for the tests.** In Australia, accreditation by the National Association of Testing Authorities (NATA) for the specific methods gives confidence that the numbers are traceable.
- **Sample more than once.** Take samples after the bore has been pumped at its working rate for some time, in more than one season, and design for the saltiest credible water, not the average.

Conductivity meters on site are useful for watching trends, but conductivity converts to dissolved solids with a factor that depends on the mix of ions. Use the laboratory analysis for design and the meter for operation.

## Exercise: a second bore

The plant is considering a second bore with this analysis: sodium 450, calcium 60, magnesium 40, chloride 700, sulfate 150, bicarbonate 200 and silica 20 mg/L. Check the ion balance, find the particle concentration and the mean molar mass per particle, and calculate the osmotic pressure at 20 °C with an osmotic coefficient of 0.94. Compare it with the sodium chloride, two-particle shortcut.

**Worked answer.** This is an illustration. In mmol/L: sodium 19.57, calcium 1.50, magnesium 1.65, chloride 19.74, sulfate 1.56, bicarbonate 3.28 and silica 0.33. Cations: 19.57 + 2 × 1.50 + 2 × 1.65 = **25.86 meq/L**; anions: 19.74 + 2 × 1.56 + 3.28 = **26.15 meq/L**; the balance error is (25.86 − 26.15) ÷ (25.86 + 26.15) = **−0.55%**, acceptable. The particles sum to **47.63 mmol/L**, and the 1,620 mg/L of dissolved solids gives a mean molar mass of 1,620 ÷ 47.63 = **34.01 g/mol** per particle. The osmotic pressure at 20 °C is 0.94 × 47.63 × 8.314 × 293.15 = 109,130 Pa, or **1.091 bar**. The two-particle sodium chloride shortcut gives 0.94 × (2 × 1,620 ÷ 58.44) × 8.314 × 293.15 = **1.270 bar**, 16% high. The second bore is about a third less salty than the first, so blending the two would lower the feed osmotic pressure and the feed pressure BW-12 needs.
