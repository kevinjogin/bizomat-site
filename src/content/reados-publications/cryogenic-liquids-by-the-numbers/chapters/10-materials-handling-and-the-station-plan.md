---
book: cryogenic-liquids-by-the-numbers
chapterSlug: materials-handling-and-the-station-plan
order: 10
title: "Materials, handling and the station's nitrogen budget"
description: "Which materials stay tough at −196 °C and how much they shrink, the protective equipment and procedure for a cold station, and SF-180's monthly nitrogen budget, where only a third reaches the parts."
draft: false
---

The earlier chapters each took one part of SF-180 apart. This chapter puts the station back together. It starts with the materials that can and cannot be used near liquid nitrogen, because the station's own equipment, lifting gear and floor have to survive it as well as the parts. It then sets out the protective equipment and the step-by-step procedure that the earlier chapters' rules add up to. And it finishes with the station's monthly nitrogen budget, built from every loss in Chapters 2 to 7, which shows where the nitrogen really goes and what grouping the work would save.

The budget carries the chapter's warning. When the workshop first added it up, barely a third of the nitrogen it bought went into the shafts. The rest boiled off in the bath, the cylinder and the hose, or was left in the bath at the end of the day. None of that was a fault; all of it was predictable, and much of it could be changed.

## Tough or brittle

Most metals become stronger as they cool, but some also become brittle, and the difference is set by their crystal structure. Metals with a face-centred cubic structure, including austenitic stainless steels such as 304 and 316, aluminium and its alloys, copper and its alloys, and nickel, stay tough down to the lowest temperatures; they are the standard materials of cryogenic equipment. Metals with a body-centred cubic structure, including ordinary carbon and low-alloy steels and ferritic stainless steels, pass through a ductile-to-brittle transition as they cool, below which a small notch or a sudden load can start a fast fracture. For ordinary structural steels that transition lies far above −196 °C.

The exception proves the rule. Steels with about 9% nickel are body-centred cubic, but their composition and heat treatment move the transition low enough for them to be used for liquefied natural gas tanks, and NIST publishes cryogenic data for them. A low-alloy steel shaft like SF-180's spends half an hour at −196 °C without load and warms before it carries any, so it is not at risk in the bath. A carbon steel shackle that holds it in the bath, or a carbon steel bracket that gets splashed while loaded, is a different matter.

Plastics and rubbers fare worse still. Most become glassy and brittle well above −196 °C, and they contract far more than metals. PTFE is a useful exception: it stays usable for seals and bearings at nitrogen temperatures, though NIST's data show it contracting nearly 2% on the way there, ten times as much as steel.

```figure
type: compare
title: Common materials near liquid nitrogen
cols: Behaviour at −196 °C | Contraction from 20 °C to −196 °C | Use at SF-180
caption: Contraction from NIST's cryogenic fits at 77 K. "Low-alloy steel" uses the nickel steel fit as a proxy. The toughness entries are general guidance; check specific grades with their maker.
- *304 and 316 stainless steel | tough | 0.28% | liner, hose, hooks, fasteners, lifting gear
- 6061 aluminium | tough | 0.39% | baskets, light fixtures
- Copper and its alloys | tough | 0.30% for copper | fittings, valves
- Carbon and low-alloy steel | brittle when cold under load | 0.19% | parts being shrunk; never cold lifting gear
- PTFE | usable, contracts a lot | 1.94% | seals, slides; allow for shrinkage
- Glass-fibre epoxy laminate (G-10) | tough | 0.21% along the fibres, 0.64% across | insulating supports
- Most rubbers, nylon, PVC | brittle | large | not in contact with liquid
```

The table also shows a trap for anyone building fixtures. A stainless steel fixture holding a steel part, or a PTFE pad bearing on aluminium, changes its fit as it cools, because each material shrinks by a different amount. Cryogenic Design by the Numbers treats those mismatches in detail.

## Floors, benches and splashes

Spilled liquid nitrogen runs across a floor on a cushion of vapour, as Chapter 5's Leidenfrost effect predicts, and chills whatever it stops on. Ceramic tiles, vinyl and some coatings crack or lift; asphalt and bitumen can become impact-sensitive if oxygen-enriched liquid condensed from air drips onto them, as Chapter 1 explained. SF-180's bath stands on a stainless bench over a sealed concrete floor, with no timber, oil or bitumen within reach of a splash, and the bench has a lip so that a spill runs to one end rather than onto a person's feet.

## Protective equipment

```figure
type: checklist
title: Protective equipment at SF-180
caption: This is an illustration of a station's equipment list; the supplier's safety data sheet and the workshop's risk assessment set the requirements for a real station.
- x Full face shield over safety glasses | splashes and spitting at immersion and transfer
- x Loose-fitting insulated cryogenic gloves | can be shaken off; for splashes, not for holding cold metal
- x Long sleeves, and trousers worn outside boots | liquid must run off, not into a boot
- x Closed leather or safety footwear | no mesh or fabric uppers
- x No rings, watches or bracelets | metal traps liquid against skin
- x Tongs, slings and fixtures for every cold part | never a gloved hand alone
```

Cold burns from liquid nitrogen or cold metal are treated according to the safety data sheet's first aid instructions, and serious ones need medical attention. The station's first aid kit and the data sheet are kept beside it.

## The station procedure

Every rule in the earlier chapters ends up as a line in the station's procedure. Written down, SF-180's procedure for one session reads:

```figure
type: steps
title: SF-180's session procedure
caption: This is an illustration of how the book's calculations become a procedure. It is not a procedure for any real station, which needs a risk assessment and approval by a competent person.
- Before | oxygen monitor reading normal; extraction fan on; cylinder at its set point, relief outlet clear; bore and shaft measured at 20 °C
- Fill | hose checked and cooled with the outlet in the vapour space; bath filled to 220 mm; lid closed
- Cool | shaft lowered in on a stainless sling; lid closed; at least 30 minutes, and until the bath is quiet
- Fit | carrier fixed and bore clean; shaft lifted, moved and pushed to its stop in one movement
- Between shafts | lid closed; bath level checked against the 130 mm minimum for the next shaft
- After | cylinder valve closed first, hose left open to drain and warm; bath lid closed; record kept
```

## Who uses the station

A cryogenic station is simple to run and easy to get wrong, and most of the mistakes described in the earlier chapters were made by capable people doing something reasonable that they had not been taught was unsafe or wasteful: raising a regulator, leaving a lid open, judging a part by its boiling, tightening a cap. The workshop therefore limits SF-180 to fitters who have been taken through the procedure at the station itself, including where the monitor and its alarm are, what the alarm means, how to close the cylinder and leave, and why the hose is never closed at both ends. A short written check, with the reasons as well as the rules, is kept on file for each person, and repeated when the procedure changes.

Visitors and other trades working in the bay are told that the station is there and what the alarm means. Cleaners in particular need to know not to close doors, switch off the extraction fan or move the cylinder into a cupboard.

## Inspection and records

```figure
type: checklist
title: SF-180's inspection and record schedule
caption: This is an illustration of a station's schedule. Equipment makers' and the supplier's instructions set the actual intervals and checks.
- x Every session | monitor reading, cylinder pressure and weight, hose condition, bath lid and hinge, session record
- x Monthly | bath idle loss weighed for one hour and compared with 0.68 kg/h; scale checked against a test weight
- x At the monitor maker's intervals | bump test and calibration, with records
- x At the relief valve maker's intervals | inspection of the hose section's relief valve; replacement if iced or seized
- x Each cylinder delivery | weight on arrival against the docket; jacket checked for frost or sweating
- ? Annually | review of the procedure, the budget and the risk assessment against the year's records
```

The records do more than satisfy an auditor. The session records give the shaft count; the scale records give the nitrogen drawn and the bath's losses; the delivery dockets give the nitrogen bought. Put together each month, they produce the budget that follows, measured rather than estimated, and any line that moves without a reason points to a fault: a bath losing more than its 0.68 kg/h has wet or cracked foam, a cylinder losing more than its 2.8 kg a day has lost vacuum, and sessions that use more than their 26.8 kg have a lid left open or a hose left warm.

## The monthly nitrogen budget

This is an illustration. SF-180 fits two shafts per session, in twenty sessions a month: forty shafts. Each session starts with a warm bath, fills it once to 220 mm, cools two shafts with the lid closed between them over about an hour and a half, and leaves the bath with its remaining liquid at the end, to boil away overnight. The cylinder loses its normal evaporation rate every day of the month.

Using the numbers from earlier chapters, one session draws 26.8 kg from the cylinder: 21.28 kg of liquid in the bath, 3.47 kg to cool the liner and foam, 0.28 kg to cool the hose, and 6.6% of the total as flash. Of the 21.28 kg in the bath, the two shafts boil 10.69 kg, the bath's standing loss over the session takes 1.0 kg, and 9.58 kg is left, about 99 mm deep, which is lost overnight.

```figure
type: stack
title: Where SF-180's nitrogen goes in a month of 40 shafts in 20 sessions
unit: kg
caption: This is an illustration. From Chapters 2 to 7: shafts 5.35 kg each; bath cooldown 3.47 kg per session; hose 0.28 kg per session; flash 6.6% of everything drawn; bath standing loss 0.67 kg/h for 1.5 h a session; liquid left in the bath 9.58 kg a session; cylinder 2.8 kg a day for 30 days. Total about 620 kg.
- Cooling the shafts | 214
- Liquid left in the bath after each session | 192
- Cylinder's standing boil-off | 84
- Cooling the bath at the start of each session | 69
- Flash at every transfer | 35
- Bath's standing loss during sessions | 20
- Cooling the hose | 6
```

The month draws about **620 kg**, 4.4 cylinders of 140 kg, of which **214 kg, about 35%**, cools shafts. The largest single loss is the liquid left in the bath when each session ends, 192 kg a month. The next largest are the cylinder's own boil-off and the daily cooldown of a warm bath.

## The error: a budget built from the shafts alone

This is an illustration. The workshop's first supply contract was based on the figure from Chapter 4: 5.35 kg per shaft, 40 shafts a month, 214 kg, or two cylinders with a margin. In the first month the station needed four and a half. The supplier was asked whether the cylinders were being under-filled.

They were not. The scale records, read with this chapter's budget, accounted for almost every kilogram: the cylinders arrived at 140 kg, and the nitrogen went to the losses in the chart above. The estimate had counted only the useful part. The lesson the supervisor wrote into the station's file is that a cryogenic budget is built from every loss, in this order of size for a small station: what is left in vessels at the end of use, standing boil-off, cooldown of warm equipment, flash, and only then the useful cooling.

The budget also showed what to change. Grouping the work into fewer, longer sessions cuts the daily bath cooldown and the liquid left over, as the exercise shows. A narrower bath, sized so that a shaft is covered with less liquid around it, would leave less behind. And because liquid left in a bath must never be poured back into a cylinder, which could contaminate it and is not permitted by suppliers, the leftover can at least be decanted into a transport dewar for small jobs elsewhere.

## A narrower bath

The liquid left in the bath is set by the bath's floor area: the last shaft must stay covered, so the depth at the end of a session cannot go below about 100 mm, and every square metre of floor holds 100 mm × 806 kg/m³ = 81 kg of liquid at that depth. SF-180's bath is 400 × 300 mm, wider than an 80 mm shaft lying in it needs.

This is an illustration. A bath 400 × 200 mm and 350 mm deep, with the same foam, would leave 0.08 × 0.1 × 806 = 6.45 kg behind instead of 9.67 kg. Its liner and wall area fall from 0.61 to 0.50 m², so its cooldown at the start of a session falls from 3.47 to about 2.84 kg and its standing loss from 0.67 to about 0.55 kg/h. To cool two shafts it would be filled with 17.96 kg, to about 279 mm, and each session would draw about 22.6 kg instead of 26.8 kg. Over twenty sessions that saves about 85 kg a month, a cylinder every seven weeks, for the cost of a new liner and box. Combined with the grouping in the exercise, the two changes together would bring the month down from about 620 kg to about 436 kg for the same forty shafts, a saving of 30%.

## Lifting gear for cold parts

Everything that goes into the bath with a part becomes as cold as the part, and it is loaded while it is cold. SF-180's shafts are lifted on a stainless steel wire sling with stainless shackles, rated by its maker for the temperature, hung from a small jib crane so that nobody stands over the bath while a part goes in or out. Ordinary carbon steel chain and shackles, synthetic round slings and polyester webbing are kept away from the station: the steel may be brittle when cold, and the synthetics stiffen and crack. The sling is inspected at every session for broken wires and frost damage, like any other lifting gear, and its rating is checked against the heaviest part the station handles, which since Chapter 4 includes a 120 kg shaft.

## Supply choices

At a few cylinders a month, liquid cylinders exchanged by the supplier suit a station like SF-180. Larger users move to microbulk, a permanently installed vacuum-insulated tank refilled in place by a small tanker, which has a lower boil-off per kilogram stored and no handling of cylinders, and then to bulk tanks. Each step changes the budget's standing-loss line and the flash at the vessel's pressure, and Real Gases by the Numbers shows how to compare supply options on mass in [Specifying and checking a gas supply](/reados/publications/real-gases-by-the-numbers/specifying-and-checking-a-gas-supply/). Whatever the supply, the arrangement is the supplier's design, under AS 1894, and the user's job is to give the supplier an honest budget.

## Exercise: four shafts per session

The workshop proposes to fit four shafts per session, in ten sessions a month. Each session fills the warm bath to 220 mm, tops it up once during the session with a second transfer, runs about three hours with the lid closed between shafts, and ends with at least 100 mm (9.67 kg) left so that the fourth shaft stays covered. Using this chapter's figures, find the top-up needed, the nitrogen drawn per session and per month, and the share that cools shafts.

**Worked answer.** This is an illustration. Over a session the bath must supply 4 × 5.35 = 21.39 kg to the shafts and 0.67 × 3 = 2.0 kg of standing loss, and end with 9.67 kg, a total of 33.06 kg, so the top-up is 33.06 − 21.28 = **11.79 kg**. The liquid arriving from the hose is 3.47 + 2 × 0.28 + 21.28 + 11.79 = 37.10 kg, and with 6.6% flash the cylinder supplies 37.10 ÷ (1 − 0.0659) = **39.7 kg per session**. Ten sessions draw 397 kg, and with the cylinder's 84 kg the month needs about **481 kg**, 3.4 cylinders instead of 4.4. The shafts' 214 kg is now **44.5%** of the total, against 34.5% before. Grouping the work saves about 139 kg a month without any new equipment.
