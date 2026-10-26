---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: airflow-free-area-and-velocity
order: 1
title: "Airflow, free area and velocity"
description: "Work out the airflow PR-30's plant room needs from its heat load, separate a louvre's gross, core and free areas, and size the intake louvre for a chosen free-area velocity."
draft: false
---

Every louvre calculation starts with one number: the flow of air it must pass. Without it, a louvre is sized to fit the wall, the budget or the look of the building, and the room behind it finds out later whether that was enough. With it, the louvre's size follows from a simple division, provided the right area is used. Most louvre mistakes are not in the arithmetic; they are in dividing the right flow by the wrong area.

This chapter works out the airflow PR-30's plant room needs from the heat its compressors release, defines the three areas a louvre has, gross, core and free, and the velocities that go with them, and sizes the intake louvre for a chosen free-area velocity. The failure case is a louvre sized on its gross face area, which passed the air at more than twice the intended speed.

## Air to carry the heat away

PR-30's two screw compressors and its refrigerated dryer release about **36 kW** of heat into the room when they all run. Almost all the electrical power a compressor draws ends up as heat somewhere, in the compressed air's aftercooler, the oil cooler and the motor, and in a packaged compressor most of it is blown into the room by the machine's own cooling fan. The compressor maker's data gives the heat rejected for each model; the 36 kW here is a teaching figure for the case.

The room's air must carry that heat away. Air passing through the room at a volume flow Q, with density ρ and specific heat c, warms by ΔT as it picks up a heat load H. Rearranged, the flow needed to keep the temperature rise to ΔT is the heat divided by ρ, c and ΔT.

```figure
type: formula
title: Airflow needed to carry PR-30's heat away
formula: Q = H ÷ (ρ × c × ΔT)
caption: This is an illustration. The compressor maker's maximum ambient temperature, less the design outdoor temperature, sets the allowable rise. Here the room may run 8 K above the 35 °C outdoor design temperature, at 43 °C.
- Heat released, H | 36 kW
- Air density at 35 °C, ρ | about 1.15 kg/m³
- Specific heat of air, c | about 1.006 kJ/kg·K
- Allowable temperature rise, ΔT | 8 K
- Airflow, Q | 36 ÷ (1.15 × 1.006 × 8) ≈ 3.89 m³/s
step: That is about 4.5 kg of air every second, or about 117 air changes an hour in the 120 m³ room
```

The allowable rise is a design choice with consequences. Halve it to 4 K and the airflow doubles; let it rise to 12 K and the airflow falls by a third, but the compressors run hotter, closer to their trip temperature, and with less margin on the hottest days. PR-30's designer took the compressor maker's maximum ambient, subtracted a margin, and used 8 K.

### Air the compressors swallow

The compressors also draw their own intake air from the room, the air they compress and send to the factory. Their combined free air delivery, from the maker's data, is about 4.8 m³/min, or **0.08 m³/s**. That is about 2% of the cooling flow, small enough to be covered by the margin here, but in a room with large compressors and a small cooling load it can matter, and it is always added to the intake louvre's duty, never to the exhaust's.

## Three areas

A louvre has three areas, and catalogues, drawings and conversations use all of them.

```figure
type: compare
title: The three areas of a louvre and the velocities that go with them
cols: What it measures | PR-30's intake louvre | Velocity at 3.89 m³/s
caption: This is an illustration. Catalogue performance data, pressure drop and rain penetration, is almost always quoted at the free-area velocity. Dividing the flow by the gross area gives a reassuringly low number that predicts nothing.
- Gross, or face, area | the opening the louvre fills, outside the frame | 2.4 × 1.5 = 3.60 m² | 1.08 m/s
- Core area | inside the frame, less mullions | 2.25 × 1.40 = 3.15 m² | 1.23 m/s
- *Free area | the smallest open area between the blades, where the air is fastest | about 1.638 m², 45.5% of gross | 2.37 m/s
```

The **gross area**, or face area, is the size of the hole in the wall the louvre fills. The **core area** is what remains inside the louvre's frame and mullions. The **free area** is the smallest area the air must pass through on its way, the sum of the narrowest gaps between adjacent blades across the louvre's width. It is the area that sets how fast the air moves at its fastest point, and therefore how much pressure it loses, how much noise it makes and how much rain it carries in with it.

The **free-area ratio** is free area divided by gross area. For PR-30's louvre it is about 45%. Louvres with deep, closely spaced, rain-resistant blades may have free-area ratios of 30% or less; light architectural louvres with widely spaced flat blades may exceed 60%. Chapter 2 calculates PR-30's free area from its blade geometry. For this chapter, the number is taken as known: 14 gaps between blades, each 52 mm wide at its narrowest, across a clear width of 2,250 mm, so the free area is **14 × 0.052 × 2.25 ≈ 1.638 m²**.

## Choosing a free-area velocity

The designer chooses a free-area velocity, and the free area follows. Higher velocities mean smaller louvres but more pressure drop, more noise and, for intake louvres, more rain drawn through. Lower velocities mean bigger louvres, more wall and more cost. The right value depends on the louvre's tested performance, which Chapters 3 and 4 read from catalogue data, and on whether the louvre is an intake, where rain matters most, or an exhaust, where air is blowing outwards and rain penetration is far less likely.

PR-30's designer chose a free-area velocity of **2.5 m/s** for the intake, as a starting point to be confirmed against the selected louvre's rain and pressure data. The free area needed is then the flow divided by the velocity: **3.89 ÷ 2.5 ≈ 1.556 m²**.

```figure
type: stats
title: Sizing PR-30's intake louvre
caption: This is an illustration. The louvre was then drawn to fit the wall opening and checked: its actual free area gives a free-area velocity a little below the 2.5 m/s target.
- 3.89 m³/s | Airflow to carry 36 kW at an 8 K rise | Chapter 1
- 1.556 m² | Free area needed at 2.5 m/s | 3.89 ÷ 2.5
- *2,400 × 1,500 mm | Louvre selected, gross 3.60 m² | free area about 1.638 m²
- 2.37 m/s | Actual free-area velocity | 3.89 ÷ 1.638
```

The selected louvre is a little larger than the minimum, and its free-area velocity, **2.37 m/s**, a little lower than the target. That small margin is worth keeping: it covers the compressors' own intake air, a little dirt on the mesh and a little error in the heat estimate.

## The exhaust side

Air that enters must leave. PR-30's exhaust is two wall fans, each sized for about half the flow, **1.95 m³/s**, discharging through a motorised louvre in the east wall. The exhaust louvre is **2,000 mm wide by 1,500 mm high**, a gross area of 3.0 m², with a free area of about **1.40 m²**, so it runs at a free-area velocity of about **3.89 ÷ 1.40 ≈ 2.78 m/s** when both fans run.

The exhaust can run faster than the intake for two reasons. Air is blowing outwards through it, so rain has to fight the airflow to get in, and the fans can overcome a little more resistance on their discharge side than the room can tolerate as suction on its intake side. Its blades also close when the fans stop, which Chapter 7 deals with. The two louvres are designed together, because the pressure lost through both, in series, is what the fans must overcome, as Chapter 3 shows.

## Part load and the seasons

The 36 kW and 3.89 m³/s are a design peak: both compressors and the dryer running flat out on a 35 °C afternoon. Most of the time PR-30 runs one compressor, often partly loaded, and on a winter morning the outdoor air is 10 °C or less. Moving 3.89 m³/s of cold air through the room then would chill it far below what the machines need, and compressed air lines and the dryer's drains do not like near-freezing rooms.

PR-30's fans are therefore controlled by the room's temperature: one fan starts when the room reaches 30 °C, the second at 35 °C, and both stop below 25 °C, when the room ventilates naturally through the open motorised louvre, as Chapter 6 calculates. The intake louvre is fixed, so it is sized for the peak and simply carries less air at part load. That asymmetry, a fixed intake and a controlled exhaust, is common in plant rooms, and it means the intake's pressure drop and rain performance only need checking at the peak flow, where they are worst.

### A sense check: air changes

The airflow of 3.89 m³/s, in a room of **6.0 × 5.0 × 4.0 = 120 m³**, is about **117 air changes an hour**. That sounds enormous beside the handful of air changes an hour that an office or a house needs for fresh air, and it is a useful reminder that a plant room's ventilation is set by its heat, not by the people in it. A designer who sized PR-30's louvres on a rule of thumb in air changes per hour, borrowed from occupied rooms, would be wrong by an order of magnitude. Air changes are a check on the answer, never a way of getting it.

## Where the louvres go

Size is not the only decision. Position decides whether the air actually sweeps the room or takes a shortcut.

PR-30's intake is low in the south wall, its sill 200 mm above the floor, so that cool outdoor air enters at the level of the compressors' own cooling-air intakes. Its exhaust is high in the east wall, its head close to the ceiling, where the warmest air collects. The air enters low, crosses the room past the machines, rises as it warms and leaves high, which is the path heat wants to take anyway.

Two mistakes are common. The first is **short-circuiting**: putting intake and exhaust close together, or both high, so that air takes the short path between them and leaves the machines in a pocket of hot air. The second is **recirculation outside**: putting the exhaust where the wind or the building's shape blows the hot air back to the intake. PR-30's intake and exhaust are on different walls, separated by the room's south-east corner, and the exhaust discharges away from the intake. A plant room in a corner of a building with only one external wall needs more thought: often a duct to carry exhaust air up and away, which *Ductwork by the Numbers* covers.

### The wall opening

The louvre's gross size must also fit the wall. PR-30's south wall is concrete block on a 200 mm module, and the 2,400 × 1,500 mm opening was chosen to suit it, with a lintel designed by the building's structural engineer. Making the louvre fit the wall rather than the arithmetic is normal; what matters is that its free area is then calculated, not assumed, and the free-area velocity checked against the louvre's data.

## A failure case: sized on gross area

This is an illustration. On an earlier compressor room with the same heat load and airflow, a designer divided the airflow by 2.5 m/s and ordered a louvre whose **gross** area was the answer: about **1.556 m²**, roughly 1,300 × 1,200 mm. The louvre's free-area ratio was the same 45.5%, so its free area was only about **0.708 m²**.

The air then passed through the blades at about **3.89 ÷ 0.708 ≈ 5.49 m/s**, more than twice the intended velocity. The louvre whistled, its pressure drop was more than four times what had been allowed for, the wall fans delivered less air than intended, and in the first summer the compressors tripped on high temperature on hot afternoons. In the first winter storm, rain was carried through the blades at the higher velocity and puddled under the dryer.

The detection came from the compressors' temperature alarms and the puddle. The investigation found the gross-area error in a few minutes, once someone asked which area the 2.5 m/s referred to. The correction was a second louvre beside the first and a plenum to collect water behind both. The shop's design sheet now has separate lines for gross, core and free area, and the velocity is always calculated on the free area.

## How this applies to a small Australian business

Start every louvre from the airflow it must pass, worked out from the heat load and an allowable temperature rise, plus any air the equipment draws in. Know which area a number refers to, and calculate velocities on the free area, because that is what catalogue data uses. Choose a free-area velocity as a starting point and confirm it against the selected louvre's tested pressure and rain data. Place intake low and exhaust high, on different walls where possible, and check where the exhaust goes. Then fit the louvre to the wall, and recalculate.

## Exercise: a bigger dryer

PR-30's owner plans to replace the dryer with a larger one, raising the room's total heat release to **40 kW**. With the same 8 K rise, what airflow is needed, what free area would give 2.5 m/s, and what free-area velocity would the existing 1.638 m² louvre run at? If the compressor maker allows the room to run 9 K above outdoor instead of 8 K, what happens?

**Worked answer.** The airflow becomes **40 ÷ (1.15 × 1.006 × 8) ≈ 4.32 m³/s**. At 2.5 m/s it would need **4.32 ÷ 2.5 ≈ 1.73 m²** of free area, more than the existing **1.638 m²**, which would now run at about **4.32 ÷ 1.638 ≈ 2.64 m/s**. Allowing a 9 K rise cuts the airflow to **40 ÷ (1.15 × 1.006 × 9) ≈ 3.84 m³/s** and the free-area velocity to about **2.35 m/s**, back below the original design, but with the room 1 K hotter and closer to the compressors' limit. The owner must choose between a larger louvre and less temperature margin, and the louvre's rain data should be checked at the higher velocity before the first option is dismissed.
