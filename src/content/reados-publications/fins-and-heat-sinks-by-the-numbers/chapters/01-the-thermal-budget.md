---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: the-thermal-budget
order: 1
title: "The thermal budget: from junction to air"
description: "A heat sink's job is set by a budget from the device's junction to the hottest air it will meet. HS-150's budget is written, with the summer failure of a budget written at 25 °C."
draft: false
---

A heat sink does one job: it carries a device's heat to the air while keeping the device below its temperature limit. The size of that job is not set by the heat sink. It is set by a **thermal budget**: the temperature the device must not exceed, the hottest air the product will ever meet, the power the device dissipates, and the resistances along the path between them. Only when the budget is written down does the heat sink have a target, and most overheating problems trace back to a budget that was never written, or was written for the wrong conditions.

This chapter builds the budget for HS-150, turns it into a required heat sink resistance, and shows why that resistance is not a fixed property of the sink. Its failure case is a budget written at the 25 °C of the design office instead of the 40 °C of the factory floor in summer, which picked a catalogue sink that overheated the drive on the first hot day.

## Heat flows through resistances

Steady heat flow through a chain of materials behaves like current through resistors in series. Each step in the path has a **thermal resistance** R, in kelvin per watt, and the temperature drop across it is the power multiplied by the resistance, ΔT = P × R, just as a voltage drop is current times resistance. For a device on a heat sink, the usual chain has three steps:

- **junction to case**, R_jc: from the semiconductor junction, where the heat is made, to the module's baseplate;
- **case to sink**, R_cs: across the interface between baseplate and heat sink, including any grease or pad;
- **sink to ambient**, R_sa: from the sink's base, through its fins, to the surrounding air.

The junction temperature is then:

T_j = T_a + P × (R_jc + R_cs + R_sa)

The first two resistances belong to the device and how it is mounted; the third belongs to the heat sink. The budget's purpose is to find how large the third may be.

## HS-150's budget

This is an illustration. HS-150's power module dissipates 150 W at full load. The module's datasheet, for this illustration, gives a junction-to-case resistance of 0.10 K/W for the whole module and a case-to-sink resistance of 0.04 K/W when mounted with a thin layer of thermal grease to the maker's instructions. The device maker allows a higher junction temperature, but the drive's designer has set a limit of 125 °C for reliability, a deliberate margin below the maker's maximum. The cabinet stands in a factory whose air reaches 40 °C on a hot summer afternoon near the machine.

```figure
type: formula
title: HS-150's thermal budget and the required sink resistance
formula: R_sa ≤ (T_j,max − T_a,max) ÷ P − R_jc − R_cs
caption: This is an illustration. The module values stand in for a real datasheet; the 125 °C limit is the drive designer's derated limit, not the device's maximum.
- T_j,max | 125 °C, the designer's limit
- T_a,max | 40 °C, the hottest air at the cabinet
- P | 150 W at full load
- R_jc + R_cs | 0.10 + 0.04 = 0.14 K/W
step: (125 − 40) ÷ 150 = 0.567 K/W for the whole path
step: R_sa ≤ 0.567 − 0.14 ≈ 0.427 K/W
step: Target 0.40 K/W, keeping about 4 K in reserve for spreading and tolerances
```

The arithmetic is simple; the decisions behind each input are not. The power must be the dissipation at the worst operating point, not the average, unless the thermal mass is large enough to average it, which Chapter 9 examines. The ambient must be the air the sink actually breathes, which near a hot machine or inside a crowded cabinet is often well above the room's thermostat. And the limit must be the one the designer is prepared to defend, which is usually below the device's absolute maximum.

The 0.40 K/W target holds back about 0.027 K/W, about 4 K at 150 W, for the things the budget has not yet counted. The main one, spreading resistance in the sink's base, will turn out in Chapter 9 to use most of that reserve.

## Where the temperature goes

With the target met exactly, the budget distributes the 85 K between junction and air as follows.

```figure
type: stack
title: HS-150's 85 K temperature budget at full load, 40 °C air
unit: K
caption: This is an illustration with R_sa at its 0.40 K/W target and the reserve unallocated. The heat sink takes most of the budget, which is why it is the part worth designing.
- Junction to case, 150 W × 0.10 K/W | 15
- Case to sink, 150 W × 0.04 K/W | 6
- Sink to air, 150 W × 0.40 K/W | 60
- Reserve | 4
```

The heat sink takes 60 of the 85 kelvin. Halving the interface resistance would gain 3 K; a sink 10 % better would gain 6 K. Effort spent on the sink usually pays most, but the interface, as the next chapter shows, is where the largest avoidable losses hide.

## A sink's resistance is not a constant

A catalogue lists a heat sink's thermal resistance as one number, but for a natural-convection sink that number changes with the temperature difference. Natural convection is driven by buoyancy: the hotter the sink, the faster the air rises through its fins, and the better it is cooled. Radiation, too, grows faster than in proportion to the temperature difference. So a natural-convection sink's resistance falls as its power rises.

This is an illustration. The design Chapter 6 arrives at for HS-150, 18 fins on the 200 mm × 250 mm base, has a calculated resistance from base to air, with an isothermal base, of about 0.485 K/W at 50 W, 0.402 K/W at 100 W, 0.363 K/W at 150 W and 0.323 K/W at 250 W, all with 40 °C air.

```figure
type: bars
title: HS-150's natural-convection sink resistance by power, 40 °C air
unit: K/W
max: 0.5
caption: This is an illustration from the natural-convection and radiation models of Chapters 6 and 7, with an isothermal base. Radiation carries about a fifth of the heat throughout. A single catalogue figure applies only at the temperature rise it was measured at.
- 50 W, base about 64 °C | 0.485
- 100 W, base about 80 °C | 0.402
- *150 W, base about 95 °C | 0.363
- 250 W, base about 121 °C | 0.323
```

Two practical consequences follow. A catalogue rating must be read with its test conditions: the temperature rise, the orientation, whether the sink was in free air or in a duct, and the surface finish. And a natural-convection sink rated at a large temperature rise looks better than it will perform at a small one. The forced-convection sinks of Chapter 8 behave differently: their resistance depends mainly on the airflow and hardly at all on the temperature.

## The failure case: a budget written at 25 °C

This is an illustration. The drive's first prototype budget was written in the design office, where the air is held at about 25 °C. With that ambient, the required sink resistance came out at (125 − 25) ÷ 150 − 0.14 ≈ 0.527 K/W. A catalogue extrusion rated at 0.50 K/W was chosen, the prototype was tested on the bench at 25 °C, and the junction ran at about 25 + 150 × 0.64 ≈ 121 °C. The budget appeared to be met with a few degrees to spare.

The first drives installed in a factory ran through a hot summer afternoon with the air at the cabinet near 40 °C. The same sink then put the junction at about 40 + 150 × 0.64 ≈ **136 °C**, 11 K over the designer's limit. The drive's over-temperature protection began tripping the machine in mid-afternoon, which is how the error was found: a pattern of trips that clustered on hot days and in the hottest part of the day.

```figure
type: compare
title: The prototype sink against HS-150's budget, at the office's and the factory's air temperatures
cols: Air at 25 °C | Air at 40 °C
caption: This is an illustration with R_jc + R_cs = 0.14 K/W and 150 W. A sink rated at 0.50 K/W meets the 125 °C limit in the office and fails it on the factory floor.
- Required R_sa | 0.527 K/W | 0.427 K/W
- Junction with a 0.50 K/W sink | 121 °C | 136 °C
- *Margin to 125 °C | 4 K | −11 K
```

The correction had three parts. The budget was rewritten at the worst ambient the product will meet, 40 °C, and the required resistance fell to 0.427 K/W. The sink was redesigned to meet a 0.40 K/W target, which the rest of this book works through. And the product's documentation gained a stated maximum ambient, so that an installer who mounts the cabinet beside a furnace knows that the budget no longer holds. The general lesson is that the ambient in a thermal budget is a design decision with a name and a number, not the temperature of the room where the calculation was done.

## Choosing the worst ambient

The worst ambient is the hottest air that will reach the sink's fins, over the hottest period that lasts long enough for the sink to reach equilibrium, which for HS-150 is about an hour (Chapter 9 calculates its time constant). Several things push it above the weather:

- heat from neighbouring machines, furnaces, compressors and lighting;
- the cabinet's own heat, if the sink breathes air that has passed over other equipment;
- solar heating of an outdoor enclosure, which can add many kelvin to the air in and around it;
- poor ventilation in plant rooms and roof spaces.

A short logging exercise, a temperature logger at the proposed position for a few hot days, is the most reliable way to set the figure. Where that is not possible, the product's datasheet should state the ambient it was designed for, and the installer should check it.

## Partial load and power that varies

The drive does not run at full load all the time, and its module's losses depend on the load, the switching frequency and the junction temperature itself, rising as the junction gets hotter. The budget above uses the worst steady case: full load, at the highest switching frequency the drive allows, at the hottest junction. That is deliberately pessimistic. A more refined budget would use the module maker's loss calculation at the actual operating points, and would check that the losses, recalculated at the resulting junction temperature, still fit. For a first sizing, the worst steady case is the safe start, and the refinement belongs to the electrical designer with the maker's tools.

## More than one limit

The junction is not the only thing with a temperature limit. HS-150's budget has at least two more, and either can become the one that governs.

The first is the **other components** that share the sink or sit near it. The drive's electrolytic capacitors and its control electronics are mounted close to the module, and their life falls quickly as their temperature rises. If the sink's base runs at 95 °C, the air around those parts inside the cabinet will be warmer than the factory's 40 °C. A budget for each sensitive part, using the same series-resistance arithmetic, shows whether the sink's base temperature, not just the junction, needs a limit.

The second is **touch**. At full load in 40 °C air, HS-150's base runs at about 95 °C, and its fins only a few kelvin cooler. A surface that hot, on the back of a cabinet that maintenance staff walk past, is a burn hazard. Acceptable surface temperatures for touchable parts are set by product safety standards and depend on the material and how long contact might last; this book does not quote them, but it notes that a metal surface at 95 °C will exceed them for any contact longer than a moment. HS-150 therefore needs either a guard that keeps hands off the fins while letting air through, or a location where people cannot reach it. Either choice affects the sink's cooling, because a guard restricts the air, and Chapter 6 shows how sensitive natural convection is to restrictions.

## How big a reserve?

The 0.027 K/W reserve in HS-150's budget is small, and it is worth asking what it must cover. Real assemblies vary: the grease layer is thicker on some units than others, the extrusion's flatness varies, the anodised finish's emissivity varies with colour and process, and the factory air near one machine is warmer than near another. Each of these moves the junction by a few kelvin. Unknowns that have not been calculated yet, such as spreading resistance in the base, can add more.

A practical approach is to list the known uncertainties with a plausible range for each, convert each to kelvin at full power, and combine them. Independent variations are usually combined as the square root of the sum of squares, because they are unlikely all to be at their worst at once; variations that move together, such as a hotter factory and a hotter cabinet, are added. The reserve should cover the combination. For a first design, a few kelvin of reserve is common, and the calculations of later chapters, especially Chapter 9's spreading resistance and Chapter 10's tests, are what turn that guess into a known number.

## How this applies to a small Australian business

Most small manufacturers that build electronics into their products buy heat sinks from catalogues, and the catalogue figure is only as good as the budget it is compared with. Writing the budget takes a few minutes: the device's limit, its losses, the datasheet resistances and an honest worst ambient. Australian factories, sheds and plant rooms regularly see air well above 35 °C in summer, and outdoor enclosures in sun more than that. A budget written at office temperature is the commonest single cause of thermal trips in the field, and it is entirely avoidable.

## Exercise: the 250 W version

The next version of the drive will dissipate 250 W in the same module footprint, with the same junction-to-case and case-to-sink resistances, the same 125 °C limit and the same 40 °C air. Find the required sink resistance, and say whether HS-150's natural-convection design, at about 0.323 K/W at 250 W, could meet it.

**Worked answer.** The whole path may have (125 − 40) ÷ 250 = 0.34 K/W. Subtracting the module's 0.14 K/W leaves **0.20 K/W** for the sink, before any reserve.

At 250 W, the natural-convection design reaches about 0.323 K/W, so the junction would sit at about 40 + 250 × (0.14 + 0.323) ≈ **156 °C**, 31 K over the limit. No reasonable change of fin spacing closes a gap that large in the same footprint: Chapter 6 shows that the spacing is already near its optimum. The 250 W version needs a fan, a larger sink, or both, and Chapter 8 sizes the fan.
