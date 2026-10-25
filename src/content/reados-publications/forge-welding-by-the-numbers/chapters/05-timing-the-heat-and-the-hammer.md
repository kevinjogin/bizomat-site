---
book: forge-welding-by-the-numbers
chapterSlug: timing-the-heat-and-the-hammer
order: 5
title: "Timing the heat and the hammer"
description: "Calculate how fast hot bars cool in air and on the anvil, plan the few seconds between fire and blow, set up the anvil and tools, strike in the right order, and decide when a second heat is needed."
draft: false
---

Every forge weld is a race. The bars come out of the fire at welding heat and start cooling and scaling at once, and the weld must be made before they fall below the temperature at which it will take. For small stock that is a matter of a few seconds. The smiths of the old manuals knew it well: Hart wrote in 1910 that the hammering must be done rapidly, that a slow smith or a large piece would lose the heat before the weld was finished, and that a second heating should be avoided if possible. What the manuals could not easily do was put numbers on the race. This chapter does.

It calculates how fast bars of different sizes cool in air, explains why contact with the anvil makes the race shorter still, sets out how the anvil and tools are prepared so that no second is wasted, describes the order of blows that makes a sound weld, and covers the second heat and the use of a striker or power hammer.

## How fast a hot bar cools

A bar at welding heat loses heat mainly by radiation, which at such temperatures is intense, and by convection to the surrounding air. The rate at which its temperature falls depends on how much surface it has for each kilogram of metal: thin bars, with much surface and little mass, cool fast; thick bars cool slowly.

```figure
type: formula
title: Initial cooling rate of a 20 mm round bar at welding heat
formula: cooling rate = (emissivity × σ × T⁴ + h × ΔT) × surface ÷ (mass × specific heat)
caption: This is an illustration with an assumed emissivity of 0.8 for scaled steel, a convection coefficient of about 15 W/(m²·°C), a specific heat of about 650 J/(kg·°C) near this temperature, and the bar at 1,300 °C (1,573 K) in a room at about 27 °C. σ is the Stefan–Boltzmann constant, 5.67 × 10⁻⁸ W/(m²·K⁴).
- Surface per unit length ÷ mass per unit length | 4 ÷ (density × diameter) for a round bar
- Heat lost per square metre | about 0.8 × 5.67 × 10⁻⁸ × 1,573⁴ + 15 × 1,273 ≈ 280,000 + 19,000 ≈ 300,000 W
step: mass per square metre of surface = 7,850 × 0.020 ÷ 4 ≈ 39 kg
step: cooling rate ≈ 300,000 ÷ (39 × 650) ≈ 12 °C per second
step: radiation does about nine-tenths of the cooling at this heat
```

Twelve degrees a second means that a 20 mm bar falls 100 °C in under ten seconds, even hanging in the air. Most of that loss is radiation, which grows with the fourth power of the absolute temperature, so a bar cools fastest just after it leaves the fire, at the very top of its heat, and slows as it falls.

```figure
type: bars
title: Illustrative seconds for stock to cool 100 °C from welding heat in still air
unit: seconds, from 1,300 °C to 1,200 °C
max: 22
caption: This is an illustration calculated by stepping the cooling relation above through time for each section. It ignores contact with the anvil and tongs, which shortens the time considerably at the faces being welded.
- 10 mm round | 5
- 6 mm thick flat bar | 6
- *20 mm round | 10
- 40 mm round | 20
```

The thin stock of a small class weld has about five seconds in still air to fall from a good welding heat to the bottom of the range, and less if the heat was taken at the lower end of the range. Heavier stock gives more time, but its larger faces need more blows to close, which is why big welds need heavier hammers or a striker.

## The anvil steals heat

Air is not the only thing cooling the bars. The moment a hot bar is laid on the anvil, its underside is in contact with a large mass of cold steel, which conducts heat away far faster than air removes it by radiation. The face in contact chills in a second or two. For a scarf weld laid on the anvil, the lower scarf's underside is chilled, but its upper face, the one to be welded, is protected by the bar's thickness for a moment longer; the upper scarf, laid on top, is touching the lower one at the joint, which is what is wanted. The smith minimises the time the work lies on the anvil before the first blow, and some warm the anvil face at the start of a welding session with a piece of hot scrap, so that it is not stone cold.

The tongs also steal heat at the point where they grip, which is one reason tongs should hold the work well back from the weld, and one reason small pieces are often welded by holding them in the fingers of a long bar instead of tongs.

## The seconds in sequence

A smith who knows the work has about five seconds plans every one of them. The sequence for a scarf weld in small stock, done by one smith, might be as follows.

```figure
type: steps
title: A one-person scarf weld in small stock, timed
caption: This is an illustration of the shop's teaching sequence. The times are typical for a practised smith with small stock; beginners take longer and should practise the transfer cold until it is smooth.
- 0 s: take the heat | both pieces at welding heat, flux runny; lift both from the fire together
- 0–1 s: knock off loose scale and fuel | a light tap of each on the anvil edge
- 1–2 s: lay the scarfs | lower piece on the anvil face; upper piece laid on it, scarf to scarf
- 2–3 s: first blows | light, quick blows at the middle of the joint; slag squeezes out
- 3–6 s: close the joint | heavier blows working outward; turn and strike the other side
- *6 s onward: back to the fire if needed | a lower welding heat to finish edges and dress
```

The movement from fire to anvil is the critical one, and smiths drill it until it is automatic. The fire is placed close to the anvil, usually a single step away, with nothing to walk round; the anvil's face is clear of scale and tools; the hammer lies where the hand will find it without looking. Cravens's guide to the shop advised setting the anvil so that the smith's knuckles just reach its face when standing beside it, which puts the face at a height where blows land squarely without stooping.

## Holding two pieces at once

A one-person weld needs both pieces in the fire and both brought out together, with one hand holding each, so that one hand must also free itself to pick up the hammer. Smiths manage it in several ways: by making one piece long enough to hold by hand at its cold end, by resting one piece on the anvil and holding it in place with the hammer's first light blow while the other hand lets go of its tongs, or by using a helper to hold one piece. Some joints, such as ring welds, have both scarfs on the same piece, which makes a one-person weld much easier.

## The order of blows

The first blows are always light, whatever the size of the work. Hart was explicit that they should not be heavy, and the reason is that the pieces are not yet joined; a heavy first blow can knock the upper scarf off the lower one, or slide it sideways, and it can spatter the fluid flux and slag in all directions. A few quick, light blows at the middle of the joint stick the pieces together and start the slag moving outward. Once the joint has taken at the middle, heavier blows close it towards the edges, and the smith turns the work to strike from the other side. A spray of glowing slag from the edges of the joint at the first blows is a good sign.

The blows also follow the joint's shape: along a scarf from its middle to its tips, round a ring's weld from the centre outward, and on a lap weld from the middle of the overlap to its edges. Cravens gave the same rule for lap welds: start at the centre and work towards the outside, or the slag will not escape and the metal will not unite.

## A second welding heat

Small welds are often finished in one heat; larger ones rarely are. After the first heat has stuck the joint together, the smith returns it to the fire for a second heat, at welding heat or a little below, with fresh flux at the edges if needed, to weld the scarf tips and edges and consolidate the whole joint. Hart warned that second heats risk slag getting into the weld and the pieces burning, so the second heat is taken carefully, not left too long, and the joint is hammered as soon as it is ready. Once the weld is complete, further heats at a lower, forging heat dress it to size.

## A striker and a sledge

Heavy work needs more blows, and heavier ones, than one smith can deliver in the seconds available. Traditionally, a striker stood opposite the smith and struck with a sledge where the smith's hand hammer indicated, while the smith held the work and directed the blows. Cravens described hand sledges handled by a helper and heavier swing sledges for larger work. Smith and striker had to work as one, with signals agreed beforehand, because a sledge blow in the wrong place could knock the weld apart or injure someone. Today, a power hammer or hydraulic press does most heavy welding, delivering many heavy blows a minute under the smith's control, and makes welds possible in sections that a hand smith, however quick, could never close in time.

## Practising the transfer

The shop teaches the transfer cold before any student attempts a weld. Students lay out the anvil and tools, put cold scarfs in the cold fire, and practise lifting them out, tapping off imaginary scale, laying them together and striking the first light blows, timing themselves until they can do it in two or three seconds without hesitation. Then they do it with the pieces at a red heat, without flux, to feel the work hot in the tongs. Only then do they take a welding heat. The owner has found that students who practise the transfer this way make their first good weld in about half as many attempts as those who do not.

## The heat, the hammer and the size of the weld

The arithmetic of cooling explains why forge welds have a practical size limit. A small bar cools fast but needs few blows; a large bar cools slowly but needs many more, and heavier, to close its broad faces. Above a certain size, a hand smith cannot close the weld before the heat goes, even with a striker, and the weld becomes unreliable. Hart recorded that large welds were considered unsafe and that welding a ship's sternpost or a large shaft had meant weeks of costly work that often failed before thermit welding arrived. Thermit Welding by the Numbers covers that later answer. Power hammers and presses moved the limit upward for forge welding, but did not remove it.

## Reading the weld as it forms

A smith learns to read the weld as it forms. When the faces stick at the first light blow, the sound of the hammer changes from a sharp ring, metal on loose metal, to a duller, solid note, and the upper piece no longer moves independently of the lower. The edges of the joint close from a visible line to a faint mark and then vanish as the work is struck round. If the faces do not stick, the upper piece bounces or slides, the line stays open, and the smith knows at once that the heat was too low, the flux too little or the scale too thick, and returns the work to the fire before hammering it into a cold shut.

## The running case: timing the class

This is an illustration. The owner timed the shop's students with a phone camera through a term, from the moment the work left the fire to the first blow. Students whose welds failed averaged about seven seconds to the first blow; those whose welds took averaged about three. Most of the lost time was in fumbling with tongs or looking for the hammer. Moving the class forges closer to the anvils, laying out the tools in the same place every time, and practising the transfer cold cut the average to about three and a half seconds, and the first-attempt success rate rose noticeably.

## A failure: the walk to the anvil

This is an illustration. At a demonstration day, a visiting smith worked at an unfamiliar set-up where the anvil stood about three metres from the forge, around a quench tub. The first two welds in 12 mm square bar failed, both cold shuts, though the heats were good. On the third attempt the smith moved the anvil next to the forge, and the weld took at once.

Three metres and a turn round the tub had added about three seconds to the transfer, more than half of the time the small stock gave. The lesson the owner took from it was to lay out the shop around the transfer, not around convenience, and to check the layout before any weld is attempted on a new set-up.

## Exercise: how long is the window?

A smith takes a welding heat on two pieces of 16 mm round bar at about 1,320 °C, and knows the weld will not take below about 1,220 °C. Using the cooling relation above with the same assumptions, estimate the initial cooling rate of 16 mm round bar, and roughly how long the smith has. If the transfer from fire to first blow takes four seconds, how much time is left for the welding blows?

For a round bar, the mass per square metre of surface is density × diameter ÷ 4 = 7,850 × 0.016 ÷ 4 ≈ **31 kg**. At about 1,320 °C (1,593 K), heat loss is about 0.8 × 5.67 × 10⁻⁸ × 1,593⁴ + 15 × 1,293 ≈ 292,000 + 19,000 ≈ 311,000 W/m², so the cooling rate is about 311,000 ÷ (31 × 650) ≈ **15 °C per second**.

As the bar cools the rate falls somewhat, so the 100 °C window lasts a little longer than 100 ÷ 15 ≈ 6.7 seconds, about **7 to 8 seconds** in air. After a four-second transfer, the smith has about **three to four seconds** for the welding blows, less where the anvil chills the work, which is why the transfer must be short and the first blows must count.
