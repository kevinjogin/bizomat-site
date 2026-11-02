---
book: oxy-fuel-by-the-numbers
chapterSlug: how-oxygen-cuts-steel
order: 7
title: "How oxygen cuts steel"
description: "Understand oxygen cutting as controlled burning, estimate the oxygen a cut needs from the chemistry, and see why purity, kerf and thickness govern economy."
draft: false
---

An oxy-fuel cutting torch does not melt its way through steel. It burns it. The preheat flame raises a small spot of steel to its ignition temperature, a jet of nearly pure oxygen then burns the iron to oxide, and the jet blows the molten oxide out of the cut. Once started, the reaction supplies most of its own heat. Seeing the process as combustion explains which metals can be cut, why oxygen purity matters so much and why a cut gets less economical as the plate gets thicker.

The 1921 investigation measured cutting torches more thoroughly than anyone had before, and its central observation about cutting, that no torch was economical across all thicknesses, makes most sense once the chemistry is clear.

## Four conditions for oxygen cutting

TWI sets out four conditions a metal must meet for oxygen cutting to work.

1. Its ignition temperature in oxygen must be below its melting point, so that it burns before it melts. For steel, TWI gives the ignition range as about 700 to 900 °C, a bright red heat.
2. Its oxide must melt at a lower temperature than the metal, so the oxide runs out as a fluid slag rather than forming a skin.
3. The heat released by the oxidation must be enough to keep the cut going.
4. The reaction should produce few gaseous products that would dilute the cutting oxygen.

Carbon and low-alloy steels meet all four. Stainless steels, cast irons and most non-ferrous metals do not, mainly because they form oxides that melt at higher temperatures than the metal and stay in the way. TWI notes that they can be cut only by injecting powder into the flame to form a fluid slag, which is a specialised process. The everyday consequence is the familiar rule: oxy-fuel cutting is for carbon and low-alloy steels. The Library’s [process selection chapter](/reados/collections/machining-and-metal-parts/choosing-a-cutting-process-for-plate-and-sheet/) places it beside the alternatives for other materials.

## The oxygen a cut needs

The burning of iron can form more than one oxide. Two simple cases bracket what happens in a cut:

**Fe + ½ O₂ → FeO** and **3 Fe + 2 O₂ → Fe₃O₄**

The first needs half a mole of oxygen for each mole of iron; the second, two-thirds. With iron at 55.845 g per mole and a mole of gas occupying about 23.645 litres at 15 °C and atmospheric pressure, one kilogram of iron needs about **0.212 m³** of oxygen to form FeO and about **0.282 m³** to form Fe₃O₄.

That gives a way to estimate the least oxygen a cut could use, if all the metal removed from the kerf were burned.

```figure
type: formula
title: Least oxygen to burn the metal in one metre of kerf
formula: V = w × t × L × ρ × k
caption: This is an illustration. A 2.0 mm kerf in 25 mm plate removes about 0.39 kg of steel per metre, needing about 0.083 m³ of oxygen as FeO or 0.111 m³ as Fe₃O₄.
- w, t, L | kerf width, plate thickness, length, m
- ρ | steel density, about 7,850 kg/m³
- k | oxygen per kg of iron, 0.212 m³ (FeO) to 0.282 m³ (Fe₃O₄)
step: mass = 0.002 × 0.025 × 1 × 7,850 ≈ 0.3925 kg
step: V = 0.3925 × 0.212 ≈ 0.083 m³
step: V = 0.3925 × 0.282 ≈ 0.111 m³
```

At setting B, the base-plate case supplies 4.6 m³/h of cutting oxygen at 24 m/h, or about **0.192 m³ per metre**. If every gram of metal in the kerf were burned, between about 43% and 58% of the jet's oxygen would be used. In practice not all the metal is burned. Some is melted by the heat of the reaction and blown out unburned, which reduces the oxygen needed, while some oxygen misses the reaction altogether, mixing with air or passing through the kerf. The calculation is therefore a bound, not a prediction. Its use is to show that the jet's oxygen is not all doing useful work, and that how much is wasted depends on the jet, the speed and the thickness.

## Heat that sustains itself

The oxidation of iron releases a great deal of heat, more than enough to bring the next layer of steel to ignition. That is why the preheat flame is mainly needed to start the cut and to keep the top surface hot, where the jet first meets cold metal and loses heat to the air. Further down the kerf, the reaction and the hot slag running down the cut face carry the heat along.

It is also why cutting gets slower as plate thickens. The jet must keep enough oxygen, momentum and heat all the way to the bottom of the cut. As it travels down the kerf it slows, spreads, mixes with combustion products and loses oxygen to the reaction. Near the bottom, less oxygen arrives, so the burning front lags behind the top. That lag is what draws the curved drag lines on a cut face, and Chapter 8 uses them as a diagnostic.

## Starting a cut: edges, pierces and scale

The chemistry also explains why the start of a cut takes the longest. At an edge, the preheat flame heats a corner, which has metal on only two sides to conduct heat away, so it reaches ignition temperature quickly. A pierce in the middle of a plate must heat a spot surrounded by cold metal, then burn down through the full thickness while the slag has nowhere to go but back up towards the nozzle. Piercing takes more preheat, more time and more care, and it is where nozzles are most often damaged by spatter.

This is where the fuel gas matters most. TWI's comparison of fuel gases puts acetylene's pierce time at about one third of propane's, because acetylene concentrates its heat in the primary flame, as Chapter 2 showed. Once a cut is running, the difference between fuels largely disappears, since the oxidation of the steel supplies most of the heat.

```figure
type: steps
title: What happens at the start of an oxygen cut
caption: The preheat flame's job is largely done once the cut is running; the oxidation of the steel then carries the heat forward.
- Preheat | flame raises a spot to about 700 to 900 °C
- Ignite | cutting oxygen opens; iron begins to burn
- Penetrate | burning front reaches the bottom of the plate
- *Travel | jet sustains the reaction; slag blown out below
- Finish | cut runs off the far edge; jet closed
```

Mill scale, rust and paint all get in the way. Scale and rust are already iron oxide, so they do not burn and release heat as steel does. They must be heated through and broken up before the steel beneath them can ignite, and paint adds fume and combustion products to the area around the cut. Heavy scale slows starts and can disturb the jet. As Chapter 8 records, the 1921 investigator doubted that burning scale off with oxygen made economic sense when a worker with a chisel could remove it more cheaply, and the same reasoning supports cleaning a strip along the line of a cut where scale is heavy. Coatings that give off hazardous fume when heated need their own assessment under the work health and safety duties that apply to the workplace.

## Oxygen purity

Because the cut is a combustion reaction in a stream of oxygen, any other gas in the stream is a diluent. TWI gives a minimum purity for cutting oxygen of 99.5% and states that a decrease of 1% in purity typically reduces cutting speed by about 25% and increases gas consumption by about 25%. In the base-plate case, that rule would cut setting B's 400 mm/min to about 300 mm/min. Purity matters far more than its small numbers suggest.

The 1921 investigators knew this, citing work by Alexander Tucker published in 1911 on the influence of impurities in cutting oxygen. During their calibrations they found the oxygen in individual cylinders ranged from about 97.2% to 99.3% pure, averaging close to 98.3%. They adopted 98.3% as the standard, selected cylinders so each bank matched it within about 0.2 percentage points, and analysed every bank. They deliberately chose oxygen made by the liquid-air process, then thought generally less pure than electrolytic oxygen, on the reasoning that a torch that worked well on the poorer gas would work at least as well on the better.

That choice had a consequence they reported honestly. Some torches that were generally regarded as good failed to cut the thicker metal, and at least one had been designed for higher-purity electrolytic oxygen. The investigators planned a study of purity and cutting efficiency but could not obtain cylinders of the purities they needed in reasonable time and abandoned it. Their experience is still a warning: a nozzle chart is valid for the gas purity it assumes.

Purity can also be lost after the cylinder. TWI points out that the nozzle's job includes protecting the oxygen stream from air drawn in around it. A damaged or dirty nozzle bore makes the jet turbulent, air mixes into it, and the oxygen reaching the steel is less pure than the oxygen leaving the cylinder.

## What the 1921 cuts showed about thickness

The investigators cut 1/2 inch, 2 inch and 6 inch steel by machine, and 10 inch steel by hand. On the 1/2 inch plate, the spread between torches cutting the same steel under the same conditions was remarkable.

```figure
type: range
title: Spread between torches on 1/2 inch (12.7 mm) plate, 1921
unit: multiple of the lowest value
min: 0
max: 4.5
caption: Converted from the 1921 report. Cutting speed ranged from about 10.1 to 33.2 m/h, oxygen from 0.85 to 3.68 m³/h, jet velocity index from about 162 to 602 m/s and acetylene from 0.20 to 0.59 m³/h.
- Cutting speed | 1 | 3.3
- *Oxygen used | 1 | 4.33
- Jet velocity index | 1 | 3.73
- Acetylene used | 1 | 3.0
```

The report concluded that if the torches had been designed to a theory, there was no generally accepted one. It then replotted its data as the area of metal cut for each cubic foot of oxygen, against thickness. If the kerf stayed the same width and the oxygen were used equally well at every thickness, that figure would be constant. It was not: the most economical cuts on the thinnest plate gave the most area per unit of oxygen, and the figure fell with thickness, partly because the kerf widens as the plate thickens. A straight line could be drawn close to the most economical results at each thickness, and on that line every torch was uneconomical on the 2 inch plate.

In the base-plate case, setting B cuts 0.025 m² of plate face for every 0.192 m³ of cutting oxygen, about **0.130 m² per cubic metre**. A workshop that records the same figure for each thickness it cuts builds its own version of the 1921 plot, and can see which thicknesses it is cutting less economically than the others.

## The 1921 limit of thickness

From its heavy cuts the report suggested that the practical maximum for an ordinary oxy-acetylene torch, cutting in one direction without preheating the metal or the oxygen, was about 12 inches, around 305 mm. An attempt on a 16 inch block with the best heavy-cutting torch penetrated about 12 inches and stopped, the bottom of the cut running almost square to the direction of travel.

The investigators offered a tentative explanation. Burning acetylene produces carbon dioxide, which is heavier than air and does not support combustion. Collecting at the bottom of a deep kerf, it might dilute the oxygen enough to slow or stop the reaction. Oxy-hydrogen torches, whose preheat produces water vapour instead, were known to give cleaner and deeper heavy cuts, and raising the oxygen pressure often rescued a deep cut by blowing the products clear. The report was careful to call this an indication for further work, not a finding. Modern practice has moved well beyond the 1921 limit: TWI's application note gives the typical range of oxy-fuel cutting as about 1 mm to 1,000 mm, with appropriate equipment and technique.

## A failure: the nicked nozzle

This is an illustration. Partway through the base-plate job, with nothing apparently changed, the track machine at setting B began leaving coarse, swept-back drag lines and a heavier bottom slag. The operator had to slow from 400 to about 330 mm/min to keep the cut clean. The flow meters showed the same flows, the torch-end pressure was correct and the oxygen came from the same manifold.

Looking down the nozzle bore against a light showed a small nick at the exit, where the nozzle had struck the plate during a pierce. The jet leaving a damaged bore is turbulent; it spreads sooner, draws in air and arrives at the bottom of the kerf with less oxygen and less momentum. The effect on speed, about 18% in this case, is of the same order as TWI's rule for a one-point loss of purity. A new nozzle restored the original speed. The workshop added nozzle inspection to the start of each shift and recorded the nozzle's identity on the settings sheet, so a change in performance could be traced to the part that caused it.

## Exercise: oxygen for thinner plate

The workshop also cuts 12 mm gussets, with a kerf of about 1.6 mm. Calculate the mass of steel removed per metre and the least oxygen needed to burn it to FeO and to Fe₃O₄.

Mass removed = 0.0016 × 0.012 × 1 × 7,850 ≈ **0.151 kg per metre**. Least oxygen ≈ 0.151 × 0.212 ≈ **0.032 m³** as FeO, or 0.151 × 0.282 ≈ **0.043 m³** as Fe₃O₄. Compare these with the 0.083 to 0.111 m³ per metre for the 25 mm plate. The thinner plate needs about 38% as much oxygen per metre in principle, but in practice a nozzle for 12 mm plate still supplies a jet and preheat flame that cannot be scaled down in the same proportion, which is one reason why the area cut per unit of oxygen is not the same at every thickness.
