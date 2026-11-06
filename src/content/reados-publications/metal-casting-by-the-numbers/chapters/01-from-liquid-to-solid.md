---
book: metal-casting-by-the-numbers
chapterSlug: from-liquid-to-solid
order: 1
title: "From liquid to solid"
description: "What a foundry has to control when metal freezes in a mould: latent heat, freezing range, the three stages of shrinkage, and why most casting defects are decided by how the metal solidifies."
draft: false
---

A casting is made in a few minutes and decided in a few seconds. Liquid metal is poured into a cavity of sand, it fills the cavity, and it freezes. Everything that makes the casting good or bad, its shape, its soundness, its strength and its surface, depends on how those three things happen: how the metal was melted, how it flowed in, and how it turned from liquid to solid. A foundry that understands solidification can predict most of its defects before it pours. One that does not finds them afterwards, in the machine shop or in service.

This chapter introduces the physics of freezing that every later chapter relies on, the running case that the book follows, and the arithmetic of heat and shrinkage that turns a foundry's experience into numbers. Its error is the most common misunderstanding about casting: that a sound casting is mainly a matter of pouring hot enough.

## The running case

This is an illustration. A jobbing foundry in Ballarat, Victoria, has been asked to make GB-12, a gearbox cover for a machinery builder. The cover is sand cast in an aluminium–silicon–magnesium alloy of the widely used Al–7Si–0.35Mg type, heat treated to the solution-treated and artificially aged condition known as T6, and machined on its joint face, its two side faces and its bearing bore.

- **Size:** finished envelope 300 × 200 × 100 mm, mostly 6 mm walls, with one heavy bearing boss.
- **Mass:** 6.68 kg as cast; about 12.1 kg of metal poured per mould, including the gating and two risers.
- **Melting:** an electric crucible furnace of 100 kW, melting 150 kg at a time.
- **Volume:** 60 castings a shift for the first order.
- **Specification:** hardness 75 to 95 HBW after heat treatment, no visible porosity on machined faces, and a pressure-tight wall.

Each chapter takes one stage of making GB-12: melting, alloying, patternmaking, gating, solidification, feeding, defects, heat treatment and inspection. The numbers are the foundry's working figures for the case; real figures for a real alloy and mould come from the alloy supplier, the foundry's own trials and the customer's specification.

## Freezing takes heat away in three parts

To melt a metal, heat must be supplied in three parts: enough to warm the solid to its melting point, the latent heat that converts solid to liquid without changing its temperature, and enough to raise the liquid to the pouring temperature. To freeze it in a mould, the mould must take the same heat away again. The latent heat is the largest single part for most metals, and it is what makes freezing take time.

```figure
type: formula
title: Heat content of a charge from cold to pouring temperature
formula: Q = m × [c_s × (T_m − T₀) + L + c_l × (T_p − T_m)]
caption: The three terms are the sensible heat of the solid, the latent heat of fusion and the sensible heat of the liquid (superheat). Alloys melt over a range rather than at one temperature; for estimating, the liquidus is used as T_m.
- m | mass, kg
- c_s, c_l | mean specific heats of the solid and the liquid, kJ/(kg·K)
- L | latent heat of fusion, kJ/kg
- T₀, T_m, T_p | starting, melting (liquidus) and pouring temperatures, °C
```

This is an illustration. For GB-12's alloy, the foundry works with a liquidus of 615 °C, a pouring temperature of 720 °C, mean specific heats of 0.9 kJ/(kg·K) for the solid and 1.18 kJ/(kg·K) for the liquid, and a latent heat of 390 kJ/kg. For one kilogram from 20 °C:

```figure
type: stack
title: Heat to bring 1 kg of GB-12's alloy from 20 °C to 720 °C
unit: kJ
caption: This is an illustration. Total 1,049 kJ per kilogram. The latent heat is 37% of the total; the superheat above the liquidus is only 12%.
- Warming the solid, 20 to 615 °C | 535.5
- Latent heat of fusion | 390
- Superheat of the liquid, 615 to 720 °C | 123.9
```

The superheat, the heat above the liquidus, is all the casting has to spend while it flows into the mould before it starts to freeze. On the way in, the metal loses heat to the cold sand, and a thin wall far from the gate may begin to freeze before the cavity is full. The latent heat, three times as large, is what the mould must remove after filling for the casting to become solid. That is why superheat governs filling and latent heat governs freezing time.

## Pure metals, alloys and the freezing range

A pure metal freezes at one temperature. It cools to its melting point, stops cooling while it releases its latent heat, then cools again as a solid. The freezing front, the boundary between solid and liquid, is sharp and moves in from the mould wall as a smooth skin.

Most casting alloys freeze over a range of temperatures, between the liquidus, where the first solid appears, and the solidus, where the last liquid disappears. For an Al–7Si alloy the range is roughly 60 K. Within that range the metal is a mush: tree-like crystals called dendrites, growing from the wall and from nuclei in the liquid, with liquid between their branches. The wider the range, the deeper the mushy zone, and the harder it is for liquid to flow through it to replace the shrinkage of the metal already frozen.

```figure
type: compare
title: How freezing range shapes a casting
cols: Freezing pattern | Typical defects | What helps
rowhead: Freezing behaviour
- Pure metal or eutectic, narrow range | smooth skin growing inwards | a single concentrated shrinkage cavity at the last place to freeze | a riser placed to be the last place to freeze
- * Moderate range, such as Al–7Si | a skin with a mushy zone behind it | concentrated cavities and dispersed porosity in thick sections | risers plus steep temperature gradients towards them
- Wide range | mushy freezing through the whole section | dispersed shrinkage porosity everywhere, hot tears | chills to steepen gradients, careful alloy choice
caption: The descriptions are qualitative. The foundry's own trials and sectioned castings decide what each alloy and casting actually does.
```

### A note on what freezing is

Freezing is a phase transition: the atoms of the liquid, moving freely, arrange themselves into the ordered lattice of a crystal. It is a first-order transition, with a sudden change in order and density at the transition and a latent heat that must be removed for it to proceed. Physicists also study continuous transitions, such as the onset of superfluidity in liquid helium or the loss of magnetisation in iron at its Curie point, in which order appears gradually with no latent heat. The contrast is useful for a foundry worker. Because freezing is first-order, a liquid can be cooled below its freezing point without freezing, an effect called undercooling, until crystals have somewhere to start: a mould wall, an impurity particle or a deliberately added grain refiner. How many crystals start, and where, sets the grain size of the casting, which Chapter 8 returns to.

### Watching a melt freeze: the cooling curve

A foundry can watch freezing happen. A small sample of the melt is poured into a sand or steel cup with a thermocouple at its centre, and the temperature is logged as it cools. The trace, a cooling curve, shows the stages directly: a steady fall while the liquid cools, a pause or a bend where the first crystals form and release latent heat, a long, nearly flat stretch while most of the metal freezes, and a final fall once it is solid.

The details of the curve carry information. A dip below the liquidus followed by a small rise, called recalescence, shows that the melt undercooled before crystals could start, which means few nuclei and coarse grains; a melt with an effective grain refiner shows little or no dip. In aluminium–silicon alloys, the temperature of the long eutectic plateau shows whether the silicon has been modified into a fine, fibrous form, which improves ductility. Many aluminium foundries use cooling curves as a quick check on each melt before pouring, alongside a chemical analysis. GB-12's foundry takes one at the start of each shift and after any change of charge materials.

The cooling curve also makes the idea of latent heat concrete. The long plateau is the time it takes the cup's surroundings to draw out the latent heat. A larger sample, or one in a better-insulated cup, has a longer plateau, for exactly the reason a thicker section of a casting takes longer to freeze (Chapter 6).

## Three stages of shrinkage

Almost every metal is denser as a solid than as a liquid, and denser cold than hot. A casting therefore shrinks in three stages, and each needs a different remedy.

```figure
type: steps
title: The three stages of shrinkage and how each is dealt with
caption: The second stage, shrinkage during freezing, is the one that makes cavities inside the casting. Solid shrinkage changes the size, not the soundness.
- Liquid shrinkage, from pouring temperature to liquidus | made up from the sprue and risers while the metal is still liquid
- * Solidification shrinkage, from liquidus to solidus | must be fed with liquid through the mushy zone from a riser, or it leaves cavities and porosity
- Solid shrinkage, from solidus to room temperature | makes the casting smaller than the mould; allowed for by making the pattern larger (Chapter 4)
```

For aluminium alloys the solidification shrinkage is a few per cent by volume: the foundry uses 5% for GB-12's alloy in its feeding calculations (Chapter 7). The solid shrinkage, which the patternmaker allows for, is about 1.3% linear in GB-12's moulds. Both figures depend on the alloy, the section and the mould, and are working values the foundry checks against its own castings.

## Where a casting freezes last

The single most useful idea in practical foundry work is that a casting freezes progressively, from its thinnest, coolest parts towards its thickest, hottest parts, and that whatever freezes last will be short of liquid unless liquid can reach it. GB-12's 6 mm walls freeze within a minute or so. Its bearing boss, many times thicker, takes several minutes. If the walls around the boss freeze first, they cut the boss off from any supply of liquid, and the boss's own solidification shrinkage turns into a cavity inside it, exactly where the bearing bore will be machined.

The rest of the book turns that idea into numbers. Chapter 6 calculates freezing times from a casting's shape with Chvorinov's rule. Chapter 7 sizes risers that freeze after the parts they feed and hold enough metal to feed them. Chapter 5 makes sure the metal arrives without carrying oxide and air into the mould.

## The first estimate: heat and energy

The BIZOMAT [Energy and time to melt metal](/tools/melting-energy/) tool works out the three-part heat balance above for a whole charge, and then the energy drawn from the supply at the furnace's efficiency, the melting time at its power and the energy cost per melt. Its inputs are the charge mass, starting, melting and pouring temperatures, the solid and liquid specific heats, the latent heat, the furnace power and efficiency and the energy price. It uses average property values and does not include the heat lost while the metal is held waiting to pour, which its guide notes. Chapter 2 uses it for GB-12's melts. Here its first output is enough: of the energy that must go into the metal, 37% is latent heat, the share that the mould will later have to take away.

## The error: pouring hotter to cure porosity

This is an illustration. On an earlier aluminium job with a similar boss, the foundry found shrinkage porosity in the boss of the first castings. A new moulder suggested pouring hotter, at 780 °C instead of 720 °C, reasoning that hotter metal would "stay liquid longer and feed the boss".

The trial castings were worse. The porosity in the boss was larger, and new defects appeared: more gas porosity throughout, and a rougher surface where the hotter metal had penetrated the sand.

The foundry's metallurgist explained it with the numbers above. Pouring 60 K hotter adds about 71 kJ per kilogram of superheat, which helps the metal fill thin walls but does nothing for feeding. The heat must still be removed before the casting freezes, and most of it is removed from the walls and the boss alike, so the order of freezing, walls first and boss last, does not change. The boss still freezes last, still cut off from liquid, and now its liquid shrinkage is larger because it started hotter. Meanwhile, hotter aluminium dissolves more hydrogen, which comes out of solution as gas porosity when it freezes (Chapter 8), and it reacts more with the mould.

```figure
type: decision
title: What actually cures shrinkage porosity in a heavy section
question: Is the section that shows porosity the last part of its region to freeze, with no riser feeding it?
- * Yes | Feed it | Add or enlarge a riser that freezes after it (Chapters 6 and 7), or chill it so it freezes earlier and is fed from elsewhere
- No, it is fed but still porous | Check gas and feeding path | Degas the melt, check the mushy-zone feeding distance, check the riser has metal to spare
- Not sure | Section and look | Cut a trial casting through the defect and compare with the freezing order the numbers predict
```

The cure was a riser on the boss and a lower pouring temperature, the approach Chapter 7 follows for GB-12. The foundry wrote a rule into its process sheets: pouring temperature is set for filling; feeding is set by the riser.

## The questions every chapter answers

Each stage of a casting has its own small set of numbers, and the chapters follow them in the order the foundry meets them:

- How much energy and time does each melt take, and how much metal does a shift need? (Chapter 2)
- What charge gives the right chemistry, allowing for losses? (Chapter 3)
- How large must the pattern be, and how much metal is poured per casting? (Chapter 4)
- How big is the gating, so the mould fills in time without turbulence? (Chapter 5)
- How long does each section take to freeze? (Chapter 6)
- How big must the risers be, and how many? (Chapter 7)
- What causes gas, oxide and grain-size problems, and how are they measured? (Chapter 8)
- How much energy and quench capacity does heat treatment need? (Chapter 9)
- How is the casting proved to meet its specification? (Chapter 10)

## Exercise: a cast iron comparison

This is an illustration. A grey iron casting of the same 6.68 kg is poured at 1,400 °C from a liquidus of 1,200 °C. Take a mean solid specific heat of 0.6 kJ/(kg·K), a liquid specific heat of 0.85 kJ/(kg·K) and a latent heat of 230 kJ/kg.

1. How much heat is needed to bring 1 kg from 20 °C to the pouring temperature, and how is it split?
2. What share is latent heat, and how does that compare with GB-12's alloy?
3. Per kilogram, which metal needs more heat to melt and pour?

**Worked answer.**

1. Solid: 0.6 × (1,200 − 20) = **708 kJ**. Latent: **230 kJ**. Liquid: 0.85 × (1,400 − 1,200) = **170 kJ**. Total **1,108 kJ/kg**.
2. 230 ÷ 1,108 = **21%**, against 37% for the aluminium alloy. Iron's heat is mostly the sensible heat of getting to its much higher melting point.
3. **Iron, slightly**, 1,108 against 1,049 kJ/kg. But because iron is nearly three times as dense, a casting of the same volume needs nearly three times as much heat, and its higher temperature makes the furnace's heat losses much larger. Aluminium is cheap to melt per casting largely because it is light, not because its heat per kilogram is small.
