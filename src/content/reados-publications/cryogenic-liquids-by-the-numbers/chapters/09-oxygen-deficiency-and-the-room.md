---
book: cryogenic-liquids-by-the-numbers
chapterSlug: oxygen-deficiency-and-the-room
order: 9
title: "Oxygen deficiency and the room"
description: "How far oxygen falls when nitrogen is spilled, boiled or vented into a room, with ventilation, why small rooms and lifts are dangerous, monitoring, and a cylinder planned for a store."
draft: false
---

Nitrogen is not toxic. It makes up 78% of the air everyone breathes. It kills by taking the place of oxygen, and it does so without any warning: air with too little oxygen looks, smells and feels exactly like normal air, and the first effects, impaired judgement and coordination, take away the ability to notice them. People have died in rooms, pits and lifts where liquid nitrogen was spilled or vented, and would-be rescuers have died after them.

This chapter puts numbers on the risk at SF-180. It sets out the safe band for oxygen, calculates the oxygen left in a room after an instant release with a simple mixing model, follows the oxygen during a shaft cooling with the room's ventilation, explains why cold nitrogen makes a floor-level hazard worse than any mixed calculation, and ends with a plan to lock the cylinder in a small store over a long weekend.

## The safe band

The confined spaces model code published by Safe Work Australia gives the normal oxygen content of air as about 21% by volume, and treats a range from 19.5% to 23.5% as safe. This chapter uses 20.9% for normal air and 19.5% as the lower limit, the same values as Industrial Gases by the Numbers in [Hazards and the gas plan](/reados/publications/industrial-gases-by-the-numbers/hazards-and-the-gas-plan/), which covers argon, carbon dioxide and fuel gases in the same way.

```figure
type: gauge
title: Oxygen in SF-180's bay after a full bath of liquid nitrogen is spilled, well mixed
min: 10
max: 24
value: 18.75
unit: % oxygen
label: after the spill
caption: This is an illustration. 26.4 L of liquid, 21.28 kg, becomes 18.3 m³ of gas at 20 °C in a 168 m³ room with no ventilation. The band boundaries are from Safe Work Australia's model code of practice for confined spaces.
- 10 | 19.5 | Oxygen-deficient
- 19.5 | 23.5 | Considered safe
```

## An instant release in a closed room

The simplest model treats the release as sudden and the room's air as perfectly mixed, with the displaced mixture leaking out through gaps so that the room stays at atmospheric pressure. Each small volume of nitrogen added pushes out the same volume of the current mixture, and the oxygen falls exponentially with the volume of gas released.

```figure
type: formula
title: Oxygen after releasing an inert gas into a closed, well-mixed room
formula: C = 20.9% × exp(−V_gas ÷ V_room)
formula: V_gas = m × 0.858 m³/kg for nitrogen at 20 °C and 101.325 kPa
caption: Gas volume from the NIST density of nitrogen at 293.15 K, 1.165 kg/m³. The model ignores ventilation and assumes perfect mixing, which a cold release does not achieve near the floor.
- V_room | free volume of the room, m³
- V_gas | volume of nitrogen released, as gas at room conditions
- 19.5% is reached when V_gas = 0.0693 × V_room
```

The last line gives a rule of thumb: a well-mixed closed room reaches the lower limit of the safe band when the nitrogen released is about 7% of the room's volume. For SF-180's 168 m³ bay, that is 11.65 m³ of gas, which is 13.6 kg, or **16.8 L of liquid**. The bath holds 26.4 L.

```figure
type: compare
title: Oxygen after an instant release, well mixed, no ventilation
cols: Gas at 20 °C | SF-180's bay, 168 m³ | A small store, 20 m³ | A lift car, 4 m³
caption: This is an illustration. Exponential mixing model; gas volumes from NIST density. Values below about 10% are in the range where people collapse quickly; the model shows only how far below the safe band each case falls.
- 10 L transport dewar, 8.1 kg | 6.9 m³ | 20.1% | 14.9% | about 4%
- * Full bath, 21.3 kg | 18.3 m³ | 18.8% | 8.5% | near 0%
- Full cylinder, 140 kg | 120 m³ | 10.2% | near 0% | near 0%
```

Two lessons stand out. The same release that the bay absorbs with a modest fall makes a small room deadly, so the size of the space matters as much as the size of the release. And a lift car is the worst space of all: a single 10 L dewar spilled or venting in a lift would leave almost no oxygen. Cryogenic liquids travel in lifts unaccompanied, with someone sending the lift and someone receiving it on the other floor, and nobody rides with them.

## Releases over time, with ventilation

Most releases are not instant. A shaft cooling in the bath boils its nitrogen over about half an hour, fastest at the start, and the room's ventilation removes some of the nitrogen while it is being released. Following both through time needs a small step-by-step calculation: in each second, ventilation brings in fresh air at 20.9% and removes the mixture, and the boiling adds pure nitrogen.

This is an illustration. Using Chapter 5's film boiling estimate for the rate of boiling, SF-180's 80 mm shaft releases 5.34 kg of nitrogen, peaking at 6.6 g/s, about 20 m³/h of gas at room temperature, in the first minutes. The bath's standing loss adds 0.67 kg/h throughout.

```figure
type: compare
title: Lowest oxygen in the 168 m³ bay while cooling one shaft, well mixed
cols: 80 mm shaft, 5.3 kg boiled | 120 kg shaft, 46 kg boiled
caption: This is an illustration. Step-by-step mixing model with the boiling rates of Chapter 5's film boiling estimate, including the bath's standing loss, over two hours for the small shaft and three for the large one. Air changes are of the whole room per hour.
- No ventilation | 20.2% after 2 h | 16.3% after 3 h
- 1 air change an hour | 20.5% | 18.5%
- 2 air changes an hour | 20.6% | 19.2%
- * 4 air changes an hour | above 20.6% | 19.7%
```

For SF-180's normal job, the bay's volume absorbs the release comfortably, even with poor ventilation. The large 120 kg shaft from Chapter 4 is a different matter: in the same room it needs about four air changes an hour to stay inside the safe band, and with no ventilation it would take the room to 16.3% over three hours. The job that ran the bath dry in Chapter 4 also, with the doors closed, put the bay's air at risk.

A steady-state check gives a quick, conservative answer for continuous releases. If gas is released at a steady rate G into a room ventilated at Q, the oxygen settles at 20.9% × Q ÷ (Q + G), and staying at or above 19.5% needs Q ≥ 13.9 × G. For the 80 mm shaft's peak of 20.4 m³/h, that is 284 m³/h, about 1.7 air changes an hour. The time-stepped calculation shows that the room's volume carries it through a short peak with much less, which is why short releases can be judged with it while continuous ones, such as a cylinder venting, should be judged by the steady-state rule.

## Cold gas goes down

Every calculation above assumes the nitrogen mixes evenly through the room. Cold nitrogen does not. Vapour leaving the bath at 77 K is 3.8 times as dense as room air, and it flows over the rim, down the side of the bench and across the floor, warming and mixing as it goes. Until it mixes, the air near the floor, in a pit, a trench, a sump or a low cupboard holds far less oxygen than the room average.

That has practical consequences for the station's layout. The bath stands away from floor pits and drains, and away from the door to any lower room. Nobody kneels or lies on the floor beside the bath while it is boiling hard, which is exactly what a fitter does to watch a shaft's position in a low fixture. And the oxygen monitor's sensor is placed where the cold gas goes, low down beside the bath, as well as at breathing height where people work. The same logic places the bath on a bench rather than on the floor: gas that spills from a bench-height rim has more room to warm and mix before it reaches anyone working low down.

## Why there is no warning

The body's urge to breathe comes mainly from the level of carbon dioxide in the blood, not from the level of oxygen. Breathing nitrogen-diluted air removes carbon dioxide normally, so a person in oxygen-deficient air does not feel short of breath. They feel nothing unusual at first. As the oxygen falls further, judgement, coordination and the ability to recognise danger go first, then consciousness, and at very low levels collapse can follow within a few breaths. There is no smell, no colour and no discomfort to prompt anyone to leave.

That is why the controls for oxygen deficiency are designed, not left to people's senses: the release is kept small relative to the space, the space is ventilated, and a monitor watches the air. It is also why a visible white plume over the bath is not a guide. The plume is water from the room's air condensed into fog by the cold gas, and it disappears long before the nitrogen that made it has mixed away.

## Ventilation that works

Not all ventilation is equal for cold nitrogen. An extraction fan high in a wall removes the warm air near the ceiling, while the cold nitrogen pools near the floor; a fan at low level, close to the bath, removes the nitrogen where it collects and replaces it with air drawn in from elsewhere. Make-up air must have somewhere to come from: an extraction fan in a sealed room moves very little air. And natural ventilation through open doors varies with the weather and with whether someone has closed the door to keep out the cold or the dust.

For SF-180, the workshop placed the bath near an outside wall with a low-level extraction grille beside it, ducted to a fan discharging outdoors, and kept a high-level opening on the opposite side for make-up air. The fan runs whenever the bath is in use, interlocked with the station's light so that it cannot be forgotten. The air changes in the tables above are whole-room figures; low-level extraction near the source does better than they suggest, because it removes the nitrogen before it spreads.

## Releases the station plans for

A risk assessment for a cryogenic station lists its credible releases and checks each against the space. SF-180's list, worked with this chapter's models:

```figure
type: compare
title: SF-180's credible releases checked against the 168 m³ bay
cols: Nitrogen released | Model | Lowest oxygen | Control
caption: This is an illustration of a station's assessment, using this chapter's well-mixed models. A real assessment also considers the floor-level layer and the occupied positions.
- Normal job, one 80 mm shaft | 5.3 kg over 30 min | time-stepped, 1 air change | 20.5% | none beyond normal ventilation
- Large job, 120 kg shaft | 46 kg over 1 to 2 h | time-stepped | 18.5% at 1 air change | extraction fan on; doors open; monitor
- Bath tipped over | 21.3 kg at once | instant, no ventilation | 18.8% | leave the bay; ventilate before re-entry
- Cylinder relief over a weekend | about 10 kg | instant equivalent | 19.9% | cylinder stays in the bay, never in a store
```

The table shows where the margins are thin: the large job and the tipped bath both take the well-mixed room below 19.5%, and the floor near the bath lower still. Both have controls written against them, and both are reasons the bay has a monitor.

## Monitoring

A fixed oxygen monitor is the backstop for every calculation in this chapter. It measures the oxygen at its sensor continuously and sounds and shows an alarm when it falls below a set level. For SF-180 the workshop chose a monitor with a sensor near the floor beside the bath and an alarm at 19.5%, with the alarm audible and visible both inside the bay and at its door. The rules that go with it:

```figure
type: checklist
title: Oxygen monitoring rules at SF-180
caption: This is an illustration of a station's rules. The monitor maker's instructions govern installation, calibration and testing, and the risk assessment governs the alarm levels.
- x Sensor low beside the bath and a second at breathing height | cold gas collects low
- x Alarm at 19.5%, audible and visible inside and at the door | nobody enters an alarmed room to investigate
- x Bump test and calibration at the maker's intervals | records kept
- x Doors not propped closed during large jobs | ventilation is part of the design
- ? Large jobs such as the 120 kg shaft assessed separately | extra ventilation or a different location
```

The second rule matters most. A person who collapses in an oxygen-deficient room is lost within minutes, and a rescuer who walks in after them without breathing apparatus becomes a second casualty. The alarm is an instruction to stay out, ventilate from outside and call for help.

## Vehicles

A vehicle is a small, closed space, and the models above apply to it as harshly as to a lift. A van's load space of about 6 m³ reaches 19.5% after only 0.42 m³ of nitrogen gas, about 0.48 kg or 0.6 L of liquid, by the instant-release rule. A transport dewar venting normally on a long drive can exceed that, and a tipped dewar exceeds it many times over. Liquid nitrogen is therefore carried in dewars designed for transport, upright and secured, in a load space that is separated from the cabin and ventilated, and the vehicle is never left closed up with the dewar inside. The supplier and the dangerous goods transport rules set the details for each type of vessel and vehicle.

## The error: the cylinder in a small store over a long weekend

This is an illustration. Before a four-day long weekend, the supervisor planned to wheel SF-180's half-full cylinder into a small lockable store, 3 × 2.5 × 2.7 m, to keep it secure. The store had a solid door and no ventilation.

A check with the numbers from Chapter 8 stopped the plan. The half-full cylinder would reach its relief pressure in about 16 hours and then vent about 0.124 kg/h for the rest of the weekend: roughly 10 kg, or 8.6 m³ of gas. In the 168 m³ bay that would bring the oxygen down only to about 19.9%. In the 20.25 m³ store it would bring it to **13.7%**, and the store would pass below 19.5% after about 13 hours of venting, around 29 hours after the door was locked. The first person to open the store on the Tuesday morning would have stepped into air capable of causing collapse.

The supervisor found the problem by asking the question this chapter teaches: where does the gas go, and how big is the space it goes into? The cylinder stayed in the bay, chained to the wall, and the workshop added a rule that cryogenic vessels are never stored in small rooms, cupboards or vehicles, and that any store for them has ventilation designed for the gas they release.

## Exercise: ventilation for continuous venting

A workshop plans to keep a second, full liquid cylinder as a spare in a 60 m³ room with mechanical ventilation. Its normal evaporation rate is 2.0% a day on 140 kg. Once it reaches its relief pressure, find the steady oxygen level with ventilation of 10 m³/h and with 1 air change an hour, and the least ventilation that keeps the room at or above 19.5%.

**Worked answer.** This is an illustration. The cylinder vents 2.8 kg a day, 0.117 kg/h, which is 0.117 ÷ 1.165 = **0.100 m³/h** of gas. With 10 m³/h of ventilation, the steady oxygen is 20.9 × 10 ÷ 10.1 = **20.7%**; with 60 m³/h it is 20.9 × 60 ÷ 60.1 = **20.87%**. The least ventilation for 19.5% is 13.9 × 0.100 = **1.4 m³/h**. Continuous venting at the normal rate is easily handled by any real ventilation. The design case is not the normal boil-off but a fault, such as the loss of vacuum in Chapter 8, which could raise the venting a hundredfold to about 10 m³/h of gas and would need about 140 m³/h, more than two air changes an hour, plus a monitor to warn of anything worse.
