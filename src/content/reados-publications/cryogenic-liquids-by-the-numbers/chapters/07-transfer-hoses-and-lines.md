---
book: cryogenic-liquids-by-the-numbers
chapterSlug: transfer-hoses-and-lines
order: 7
title: "Transfer: hoses, lines and phase separators"
description: "The nitrogen spent cooling a hose, its heat gain insulated and bare, the share that arrives as gas, phase separators and hose safety, and a slow top-up that delivered mostly vapour."
draft: false
---

Between the cylinder and the bath, liquid nitrogen travels about a metre and a half through a stainless steel hose. That short trip costs nitrogen in three ways. The hose must be cooled from room temperature before liquid can pass through it; heat leaks into it while liquid flows; and, as Chapter 2 showed, the liquid flashes as its pressure falls. Which of the three matters most depends on how the transfer is done, and the answer is not what most people expect.

This chapter calculates each loss for SF-180's hose with the BIZOMAT insulated pipe tool and NIST data, shows that the hose's cooldown and the flash outweigh its steady heat gain during a normal fill, describes phase separators and the rules that keep hoses safe, and ends with a slow top-up through a long bare hose that delivered more gas than liquid.

## Cooling the hose

This is an illustration. SF-180's hose is 1.5 m of corrugated 304 stainless steel with a braided cover, 17 mm in outside diameter and 0.45 kg/m: 0.675 kg of steel. NIST's fit for 304 stainless steel gives an enthalpy change of 83.3 kJ/kg from 293 K to 77 K, so cooling the hose removes 0.675 × 83.3 = **56.2 kJ**, which boils **0.28 kg** of nitrogen, about 0.35 L.

The amount is small, but it comes at the start of every transfer, and it comes as a burst of gas and spitting liquid from the hose outlet while the hose cools. Like the shaft in Chapter 5, the hose starts in film boiling: the first liquid entering it boils on contact with the warm wall and pushes vapour ahead of it, and liquid appears at the outlet only once the hose is cold along its length. For a short hose this takes tens of seconds; for a long uninsulated line it can take minutes.

Two habits reduce the cost. Holding the outlet in the bath's vapour space, not in the liquid, during the first seconds stops the spitting from throwing liquid out of the bath. And doing several transfers in quick succession, before the hose warms up again, pays for its cooldown only once. The difference adds up: a station that fills or tops up its bath four times a day, letting the hose warm between each, spends 4 × 0.28 = 1.1 kg a day on the hose alone, about 25 kg a month on a five-day week, against 0.28 kg a day if the transfers are grouped into one session.

## Heat gain during the transfer

Once the hose is cold, heat flows into it from the room through its insulation. A cylindrical layer of insulation is the classic radial conduction problem, with a film coefficient on the outer surface.

The [insulated pipe heat loss tool](/tools/insulated-pipe/) calculates the heat flow per metre and in total from an insulated pipe by radial conduction through the insulation and convection at its outer surface, with the outer surface temperature and a yearly energy figure. It is written for hot pipes, but its relation works in either direction: for a pipe colder than the room, the heat flow comes out negative, which means heat gained. It neglects the pipe wall, which suits a thin hose.

This is an illustration. The hose is sleeved with 25 mm of flexible foam rated for cryogenic service, with a mean conductivity of 0.024 W/(m·K) over its temperature range from the fictional maker's data. With the liquid at −190 °C, the room at 20 °C and an outside coefficient of 8 W/(m²·K):

```figure
type: compare
title: SF-180's transfer hose from the insulated pipe tool
cols: Heat gained per metre | Over the 1.5 m hose | Outer surface
caption: This is an illustration. Inputs: 17 mm outside diameter, liquid −190 °C, room 20 °C, outside coefficient 8 W/(m²·K), insulation conductivity 0.024 W/(m·K). The tool reports heat gain as a negative loss.
- *25 mm of foam | 21.7 W/m | 32.5 W | 7.1 °C
- Bare hose | 89.7 W/m | 134.6 W | about −190 °C, frosted
```

The bare figure needs a caution. A bare cryogenic hose frosts over within a minute, and the frost both insulates it and releases heat as moisture freezes onto it; it also condenses air, as Chapter 1 described. The tool's bare result is the heat gain of a clean, dry hose, a reasonable figure for the first minutes and an overestimate once a thick frost has built up. It is enough to show the scale of the difference: insulation cuts the heat gain to about a quarter.

## Why the steady gain hardly matters at full flow

What the heat gain does to the liquid depends on how fast the liquid flows. At SF-180's normal rate of 6 L/min, the hose carries 6 × 0.7765 ÷ 60 = 0.0777 kg/s of liquid. Boiling all of it would take 0.0777 × 190.5 = 14.8 kW. The insulated hose's 32.5 W boils 32.5 ÷ 14,800 = **0.2%** of the flow, and even the bare hose only 0.9%.

```figure
type: stack
title: Where nitrogen drawn for one 26 L bath fill goes, insulated hose at 6 L/min
unit: kg
caption: This is an illustration. Drawn mass 23.1 kg for 26.4 L delivered at 806 kg/m³ plus losses. Flash from Chapter 2 at 6.6%; hose cooldown 0.28 kg; heat gain at 32.5 W over the 4.9-minute fill.
- Liquid delivered to the bath | 21.28
- Flash at the outlet | 1.52
- Cooling the hose | 0.28
- Heat gained during the fill | 0.05
```

At full flow, the flash from Chapter 2 is about thirty times the steady heat gain, and the hose's cooldown about six times. That is why Chapter 2's advice, to run the cylinder at the lowest pressure that gives an acceptable rate, saves more nitrogen than better hose insulation. Insulating the hose still matters, but for other reasons: it stops frost and condensed air forming where people handle the hose, and it keeps the hose cold between closely spaced transfers.

The balance changes completely at low flow. The heat gain is the same in watts whether the liquid moves fast or slowly, so when the flow falls, the fraction of it that boils rises in proportion. The error later in this chapter is that case.

## Trading transfer rate for flash

Since flash is the largest transfer loss, it is worth asking what a lower cylinder pressure would save. The flow through the hose is driven by the pressure difference between the cylinder and the bath, and for a hose whose resistance behaves like an orifice, the flow rises with the square root of that difference. Halving the driving pressure from 100 to 50 kPa gauge therefore cuts the flow by a factor of √0.5 = 0.71, from 6 to about 4.2 L/min.

This is an illustration. At 50 kPa gauge, Chapter 2 gives a flash of 3.7% instead of 6.6%. Filling SF-180's cold bath with 26.4 L then takes about 6.6 minutes instead of 4.9, and the hose gains a little more heat over the longer fill, 0.06 kg against 0.05 kg. The cylinder supplies (21.28 + 0.28 + 0.06) ÷ (1 − 0.037) = 22.45 kg instead of 23.13 kg, a saving of **0.68 kg per fill**, nearly 3%.

```figure
type: compare
title: One cold-bath fill at two cylinder pressures
cols: Flow | Fill time | Flash | Drawn from the cylinder
caption: This is an illustration. Flow assumed proportional to the square root of the gauge pressure; flash from NIST enthalpies; insulated hose as above.
- *100 kPa gauge | 6.0 L/min | 4.9 min | 6.6%, 1.52 kg | 23.13 kg
- 50 kPa gauge | 4.2 L/min | 6.6 min | 3.7%, 0.83 kg | 22.45 kg
```

The saving is real but modest, and it costs time at every fill. Whether it is worth having depends on how many fills a day the station does and on how much the fitters' time is worth. The calculation does make one thing clear: raising the pressure to speed transfers, the error in Chapter 2, costs more than it saves, while lowering it saves a little. A cylinder that has built up pressure while standing should be brought back to its set point before a transfer, through its vent, rather than used at the higher pressure.

## Two-phase flow and the phase separator

What comes out of the hose's end is never pure liquid. It is liquid with flash vapour, and at the start of a transfer, mostly vapour. The two-phase mixture leaves at high speed, because the vapour occupies far more volume than the liquid: the 1.52 kg of flash in one fill becomes about 1.3 m³ of gas once warmed to room temperature, released in under five minutes.

A phase separator is a small vented vessel at the end of the hose, often with a float or a sintered element, that lets the vapour escape upward through a vent while the liquid drains out of the bottom gently. It does not reduce the flash, which is set by the pressures, but it puts the gas where it can be vented safely and stops liquid being blown out of the bath. For a station that fills an open bath many times a day, a separator, or a short sintered diffuser on the hose end, makes transfers quieter and less wasteful of splashed liquid. Where cold gas is released in a small room, the separator's vent can be piped to outside, which takes the flash out of Chapter 9's oxygen calculation. The separator itself must be cooled at the start of each session like the hose, so it should be small, light and made of stainless steel or aluminium.

## Hoses, valves and trapped liquid

A transfer hose for liquid nitrogen is a pressure-containing component at cryogenic temperature, and it is chosen and treated as one:

```figure
type: checklist
title: Transfer hose rules at SF-180
caption: This is an illustration of a station's rules; the supplier's instructions and AS 1894 govern a real installation. The open item is the subject of Chapter 8.
- x Hose rated by its maker for cryogenic service and for the cylinder's pressure | stainless corrugated with braid; never rubber or plain plastic hose
- x Hose end restrained or held in a fixed bracket during transfer | a two-phase jet makes a free hose whip
- x Hose inspected before use | kinks, damaged braid, frosting in patches that suggests a crushed sleeve
- x Outlet never immersed while the valve is opened | the first gas and spitting go into the vapour space
- ? No section of hose or pipe can be closed at both ends while full of liquid | relief valve on any section that can be isolated
```

The last rule is the most important. A hose full of liquid with the cylinder valve shut and a hand valve at the outlet also shut is a sealed space full of cryogen. As it warms, the pressure in it rises far beyond anything the hose can stand, as Chapter 8 calculates. Hoses with an outlet valve need a relief valve between the two valves, and the station's procedure closes the cylinder valve first and leaves the outlet open until the hose has emptied and warmed.

## Longer lines and vacuum jackets

Where liquid nitrogen is piped permanently, for example from a bulk tank outside a building to points of use inside, the line's steady heat gain is paid all day, not just during transfers, and it becomes worth insulating much better. Vacuum-jacketed pipe, which surrounds the inner line with a second pipe and a vacuum space wrapped in reflective insulation, gains far less heat per metre than any foam, for the same reasons that make a liquid cylinder far better than SF-180's foam bath. Such systems also have gas traps, keep-full arrangements and vents at their high points, because vapour formed in a long line collects there and blocks the liquid. They are designed by their suppliers to their own rules, and they are outside the scope of a workshop station.

## The error: a slow top-up through a long bare hose

This is an illustration. During the 120 kg shaft job described in Chapter 4, the bath was moved to a larger bay and fed through a borrowed 5 m bare hose, opened only a little so that it trickled liquid into the bath for half an hour to keep the level up. The cylinder's scale showed far more nitrogen leaving it than seemed to reach the bath, and most of what came out of the hose was a hissing white plume.

The calculation shows why. At 0.5 L/min the hose carried only 0.5 × 0.7765 ÷ 60 = 0.00647 kg/s, which could absorb 0.00647 × 190.5 = 1.23 kW by boiling. The bare 5 m hose gained 5 × 89.7 = 449 W, enough to boil **36%** of that flow before it reached the end. Of what remained, another 6.6% flashed at the outlet. Only 59% of the nitrogen drawn arrived in the bath as liquid.

```figure
type: compare
title: Half an hour of top-up at 0.5 L/min through a 5 m hose
cols: Heat gained | Boiled in the hose | Liquid reaching the bath | Lost as gas
caption: This is an illustration. 11.65 kg drawn in 30 minutes at 776.5 kg/m³; heat gain from the insulated pipe tool; flash of 6.6% at the outlet.
- Bare hose | 449 W | 36% | 6.92 kg, 59% | 4.73 kg
- *25 mm of foam | 108 W | 8.8% | 9.92 kg, 85% | 1.72 kg
```

The supervisor found it by comparing the cylinder's scale with the bath's level, and by holding a hand (gloved) near the hose outlet, which was blowing gas, not pouring liquid. Two fixes followed. Top-ups are now done as short transfers at full flow, a few litres at a time, which keeps the hose's heat gain a small fraction of the flow. And any hose longer than SF-180's own is insulated before use. The cold gas from the bare hose had also gone straight into the larger bay's air, which is part of the reason Chapter 9 sets limits on the rate of release.

## Exercise: fill time and losses for a full refill

SF-180's bath has been emptied for cleaning and is refilled from the cylinder through the usual insulated hose at 6 L/min. The bath, liner and foam are warm. Using this chapter and Chapters 2 and 4, find how long the fill takes and how much nitrogen leaves the cylinder to leave 26.4 L of liquid in the cold bath.

**Worked answer.** This is an illustration. The bath must end with 26.4 × 0.806 = 21.28 kg of liquid. Cooling the liner and foam boils 2.42 + 1.05 = 3.47 kg, and the hose 0.28 kg, so 25.03 kg must arrive as liquid or be boiled at the bath. The steady heat gain at full flow adds about 0.2%, 0.05 kg, giving 25.08 kg. Flash at 6.6% means the cylinder must supply 25.08 ÷ (1 − 0.0659) = **26.9 kg**. At 0.0777 kg/s that takes 26.9 ÷ 0.0777 = 346 s, about **5.8 minutes** of flow, plus the time to cool the hose at the start. The cylinder's scale should fall by about 27 kg, a fifth of a full cylinder, for one refill from warm.
