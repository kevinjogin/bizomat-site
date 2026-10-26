---
book: process-steam-by-the-numbers
chapterSlug: pressure-reduction-and-distribution
order: 4
title: "Pressure reduction and distribution"
description: "Carry steam at high pressure and reduce it near use: what throttling does to enthalpy and dryness, the reducing station, the low-side safety valve and the cost of the main's heat loss."
draft: false
---

Chapter 1 explained why steam is distributed at high pressure and used at low pressure: high pressure keeps pipes small, low pressure gives the process the temperature it needs and a little more latent heat per kilogram. Between the two sits a pressure reducing station. It looks like a valve, and in a sense it is, but what it does to the steam passing through it is worth understanding, because it changes the steam's dryness and temperature in ways that help the process, and because if it fails, the equipment downstream is exposed to the full boiler pressure.

This chapter follows SV-8's steam from the boiler along the 60 m main to the reducing station before the kettles. It calculates the heat lost and condensate formed in the main, explains what throttling does to steam using the steam table, shows how reduction dries wet steam, lays out the parts of a reducing station, and explains why the safety valve on the low-pressure side is the most important component in it. The failure case is a reducing valve that stuck open and lifted the kettles' safety valve.

## The main and its heat loss

SV-8's main is **60 m** of steel pipe, 76.1 mm in outside diameter, carrying steam at **800 kPa absolute**, **170.4 °C**. Insulated with **50 mm** of mineral wool and calculated by the method of *Heat Transfer by the Numbers*, using a conductivity of 0.04 W/m·K and an outside coefficient of 9 W/m²·K, it loses about **42.5 W per metre**, about **2.55 kW** for the whole main. Real insulation's conductivity is somewhat higher at steam temperatures, so the actual loss will be a little more.

```figure
type: formula
title: Condensate formed in SV-8's 60 m main
formula: condensate formed = heat lost from the main ÷ h_fg at the main's pressure
caption: This is an illustration at 800 kPa absolute, where h_fg = 2,047 kJ/kg. Every kilogram of this condensate must be drained from the main by traps, and its latent heat is lost.
- Main | 60 m, 76.1 mm outside diameter, 170.4 °C
- Heat lost, 50 mm insulation | about 2.55 kW
- Heat lost, bare | about 32.4 kW
step: insulated: 2.55 ÷ 2,047 × 3,600 ≈ 4.5 kg/h
step: bare: 32.4 ÷ 2,047 × 3,600 ≈ 57 kg/h, about a third of one kettle's steam
```

That heat comes from condensing steam. At 800 kPa, each kilogram condensing gives up 2,047 kJ, so the main condenses about **2.55 ÷ 2,047 × 3,600 ≈ 4.5 kg/h** of steam into water, which must be drained from the main, as Chapter 5 explains. Over 4,000 hours, the loss costs about **A$950** a year.

A bare main would lose about **32 kW**, condensing about **57 kg/h**, more than a third of one kettle's steam, and cost about **A$12,000** a year. On steam, insulating every pipe, valve and flange pays back in months.

## What throttling does to steam

A pressure reducing valve throttles the steam: it passes through a narrow opening and emerges at lower pressure. No heat is added or removed, no work is done, and the change in the steam's speed is small, so the steam's **enthalpy stays the same** across the valve. That one fact, from the first law for a steady flow through a device, tells us what happens to the steam.

```figure
type: compare
title: Steam before and after SV-8's reducing valve
cols: At 800 kPa absolute | Enthalpy, unchanged by the valve | At 400 kPa absolute
caption: Published steam table values: h_f 720.9 and h_fg 2,047 kJ/kg at 800 kPa; h_f 604.7, h_fg 2,133 and h_g 2,738 kJ/kg at 400 kPa. The 0.96 row is the chapter's exercise.
- Dry saturated | 2,768 kJ/kg | about 30 kJ/kg above saturation, slightly superheated
- *Dryness 0.98 | about 2,727 kJ/kg | dryness about 0.995
- Dryness 0.96 | about 2,686 kJ/kg | dryness about 0.976
```

**Dry steam becomes slightly superheated.** Dry saturated steam at 800 kPa has an enthalpy of **2,768 kJ/kg**. At 400 kPa, dry saturated steam has only **2,738 kJ/kg**. The steam leaving the valve keeps its 2,768 kJ/kg, about **30 kJ/kg** more than saturated steam at its new pressure needs, so it emerges with a little superheat. In a short length of pipe, that small superheat is lost to the pipe wall and the steam is saturated again by the time it reaches the kettles.

**Wet steam becomes drier.** Steam at 800 kPa with a dryness of **0.98** has an enthalpy of **720.9 + 0.98 × 2,047 ≈ 2,727 kJ/kg**. After the valve, at 400 kPa, the same enthalpy corresponds to a dryness of **(2,727 − 604.7) ÷ 2,133 ≈ 0.995**. Throttling has evaporated most of the water droplets, using the heat they released as the pressure fell.

Distribution at high pressure with reduction near the point of use therefore delivers drier steam to the process, one more reason for the arrangement.

## The reducing station

A pressure reducing station is more than a valve. SV-8's has, in order of flow:

```figure
type: svg
title: SV-8's pressure reducing station, in order of flow
alt: A schematic of a steam pipe running left to right. In order of flow: an isolating valve, a separator with a trap below it, a strainer, a pressure gauge reading 800 kPa absolute, the pressure reducing valve with its actuator, a pressure gauge reading 400 kPa absolute, a safety valve on the low-pressure side with a discharge pipe running up to a safe place above the roof, and a second isolating valve.
caption: This is an illustration of a typical arrangement. The separator and strainer protect the reducing valve's seat; the low-side safety valve, set at or below the kettles' maximum allowable pressure and sized for the full flow of a failed-open reducing valve, protects everything downstream.
viewbox: 0 0 640 300
body:
<path class="ln" d="M20 150H620"/>
<path class="la flow" d="M20 150H620"/>
<path class="bx" d="M48 140L72 160V140L48 160Z"/>
<text class="tx txs" x="60" y="190" text-anchor="middle">isolating valve</text>
<rect class="bx" x="118" y="132" width="24" height="36" rx="4"/>
<path class="ln" d="M130 168V200"/>
<rect class="bx" x="121" y="200" width="18" height="12" rx="2"/>
<text class="tx txs" x="130" y="232" text-anchor="middle">separator and trap</text>
<rect class="bx" x="190" y="140" width="22" height="20" rx="2"/>
<path class="lf" d="M190 160L212 140"/>
<text class="tx txs" x="201" y="190" text-anchor="middle">strainer</text>
<path class="ln" d="M250 150V115"/>
<circle class="bx" cx="250" cy="103" r="12"/>
<text class="tx txs" x="250" y="76" text-anchor="middle">800 kPa abs</text>
<path class="bxa" d="M314 136L346 164V136L314 164Z"/>
<path class="ln" d="M330 136V112"/>
<rect class="bxa" x="316" y="98" width="28" height="14" rx="2"/>
<text class="txa txs" x="330" y="76" text-anchor="middle">reducing valve</text>
<text class="tx txs" x="330" y="190" text-anchor="middle">holds 400 kPa abs</text>
<path class="ln" d="M410 150V115"/>
<circle class="bx" cx="410" cy="103" r="12"/>
<text class="tx txs" x="410" y="76" text-anchor="middle">400 kPa abs</text>
<path class="ln" d="M480 150V110"/>
<rect class="bxa" x="470" y="96" width="20" height="14" rx="2"/>
<path class="la dsh" d="M480 96V40H600"/>
<circle class="fa pulse" cx="600" cy="40" r="4"/>
<text class="tx txs" x="404" y="26">discharge to a safe place above the roof</text>
<text class="txa txs" x="480" y="190" text-anchor="middle">safety valve</text>
<path class="bx" d="M558 140L582 160V140L558 160Z"/>
<text class="tx txs" x="570" y="190" text-anchor="middle">isolating valve</text>
<text class="tx txs" x="20" y="272">high-pressure side, 800 kPa abs</text>
<text class="tx txs" x="352" y="272">low-pressure side, 400 kPa abs, larger pipe</text>
```

The separator and strainer protect the valve: water droplets travelling at high speed erode its seat, and a fragment of scale lodged under the seat stops it closing. A reducing valve that cannot close fully lets pressure creep up on the low side whenever demand falls.

## The low-side safety valve

The kettles' jackets are designed and rated for a maximum pressure lower than the boiler's. If the reducing valve fails open, the full 800 kPa reaches them. The **safety valve on the low-pressure side** is what stops that from becoming a burst jacket. It must be set at or below the lowest maximum allowable pressure of anything on the low side, and, just as important, sized so that it can discharge the **whole flow** the reducing valve could pass when wide open at full upstream pressure. A safety valve that is set correctly but too small lets the pressure keep rising while it discharges. Its discharge must go somewhere safe, away from people, because it releases steam at full flow. SV-8's discharges through a pipe above the roof line, well clear of walkways, windows and air intakes, and its drain point at the low end of the discharge pipe is kept open so that rainwater and condensate cannot collect in it.

Safety valves are tested and maintained on a schedule set by the applicable standards, the equipment's registration requirements and the competent person responsible for the plant. Chapter 8 returns to this.

## Direct-acting and pilot-operated valves

Reducing valves come in two broad kinds. A **direct-acting** valve uses the downstream pressure acting on a diaphragm against a spring to open and close its main valve. It is simple, compact and cheap, but its downstream pressure falls noticeably as the flow increases, an effect called droop, and its capacity is limited. A **pilot-operated** valve uses a small pilot valve, sensing the downstream pressure, to control the steam that operates the main valve. It holds the set pressure much more closely over a wide range of flows and handles larger flows. SV-8's station has a pilot-operated valve, because the kettles' demand swings from nearly nothing to about 675 kg/h and their temperature depends directly on the pressure.

## Sizing the reducing valve

A reducing valve is sized for the steam flow at its actual inlet and outlet pressures, from its maker's capacity data, not for the size of the pipe it sits in. A valve that is far too large for the flow operates almost closed most of the time, where small movements make large changes in flow, and it hunts, cycling the downstream pressure up and down and wearing its seat. Where demand varies very widely, two valves in parallel, a small one for low loads and a larger one that opens only at high loads, give steadier control than one large valve. SV-8's valve was selected from its maker's data for about 750 kg/h, a little above the kettles' combined peak, and it controls steadily down to the flow of a single kettle near its set temperature.

## Bigger pipes after the valve

Reducing pressure increases the steam's volume. A kilogram at 800 kPa occupies 0.240 m³; at 400 kPa, 0.462 m³, nearly twice as much. For the same mass flow, the velocity in a pipe of the same size nearly doubles. The pipe after a reducing valve is therefore usually larger than the pipe before it, to keep the steam's velocity, noise and pressure drop reasonable. Chapter 5 sizes SV-8's pipes on both sides. A reducing valve discharging into a pipe the same size as its inlet is a common source of noise, erosion and a reduced pressure that sags at the far end of the low-pressure pipework.

## Insulating valves and stations

A reducing station is a cluster of valves, strainers, separators and flanges, all at steam temperature and all awkward to insulate. Left bare, it can lose as much heat as tens of metres of insulated main, as *Heat Transfer by the Numbers* showed for hot water valves; at steam temperatures the loss is larger. SV-8's station is fitted with removable insulated jackets on every valve body and flange, so that the station can be maintained without destroying its insulation, and the jackets are refitted as part of every maintenance job's sign-off.

## Choosing the reduced pressure

The reduced pressure is set by the process: the temperature it needs, with some margin for the temperature difference across the heating surface, and within the equipment's rating. Lower is not always better: lower pressure means lower temperature and slower heating, as Chapter 3 showed, and larger pipes downstream, as Chapter 5 will. SV-8's 400 kPa absolute was set from the kettles' trials. A second reducing station could serve a different user at a different pressure, which is common on larger sites, where each pressure is chosen for its users.

## Routine checks of the station

A reducing station needs little attention when it is working, which makes it easy to forget. SV-8's operators read both its gauges each shift as part of the boiler log, and the readings tell a story. A downstream pressure that drifts up when demand is low suggests a valve that is not closing fully. One that sags at high demand suggests a blocked strainer or an undersized valve. A separator trap that never discharges, or discharges continuously, points to a trap fault upstream of the valve. Every six months, the maintenance team isolates the station, cleans the strainer, inspects the valve's seat and pilot, and checks that the separator's trap and the station's insulation jackets are in order. The safety valve is tested as its own schedule requires. Recorded together, these checks make the station's behaviour predictable, and a change in it obvious.

## A failure case: the reducing valve that stuck open

This is an illustration. Two years after commissioning, SV-8's kettle supply pressure began to creep upwards during quiet periods, and one afternoon, with only one kettle running, the low-side safety valve lifted with a roar, venting steam through its discharge pipe above the roof. The kettle operators heard it and left the area as trained.

The maintenance engineer found the reducing valve's seat held open by a fragment of pipe scale, which had passed through a strainer whose screen had been removed during an earlier repair and not refitted. With little steam being drawn, the leaking valve had let the low side rise towards the boiler's pressure until the safety valve opened.

The detection came from the safety valve lifting, which is exactly what it is for. Nobody was hurt, and the kettles' jackets were not overpressured. The correction was to clean and lap the valve seat, refit the strainer screen, blow down the main to clear loose scale, and add the strainer screen to the reducing station's inspection checklist. A pressure alarm was also added on the low side, set above the normal working pressure and below the safety valve's set pressure, so that creeping pressure is noticed before the safety valve has to act.

## How this applies to a small Australian business

Distribute steam at the pressure that keeps mains small and reduce it near the point of use. Insulate every steam pipe, valve and flange: a bare steam main is one of the costliest wastes in a factory. Remember that throttling keeps enthalpy constant, which dries wet steam and adds a little superheat. Build reducing stations with a separator, strainer, gauges and, above all, a low-side safety valve set for the downstream equipment and sized for the full flow of a failed-open reducing valve, discharging somewhere safe. And keep strainers in place and inspected, because a reducing valve that cannot close fully puts everything downstream at boiler pressure.

## Exercise: wetter steam

During a period of heavy demand, the steam arriving at SV-8's reducing station has a dryness of **0.96** at 800 kPa absolute. What is its enthalpy, and its dryness after reduction to 400 kPa? How much more steam would one 100 kW kettle need than with dry steam?

**Worked answer.** The enthalpy is **720.9 + 0.96 × 2,047 ≈ 2,686 kJ/kg**. After reduction, the dryness is **(2,686 − 604.7) ÷ 2,133 ≈ 0.976**. Each kilogram then releases about **0.976 × 2,133 ≈ 2,081 kJ** on condensing, so the kettle needs **100 ÷ 2,081 × 3,600 ≈ 173 kg/h**, about **2.5%** more than the 169 kg/h of dry steam. Throttling has recovered most of the loss, but a separator before the reducing valve, removing the water before it reaches the valve, does better still and protects the valve's seat.
