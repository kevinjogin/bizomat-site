---
book: steam-systems-by-the-numbers
chapterSlug: flash-steam-and-condensate-return
order: 7
title: "Flash steam and condensate return"
description: "Calculate flash steam from hot condensate, see what venting it costs, recover it at low pressure, and value returned condensate in heat, water and treatment against what goes to drain."
draft: false
---

When the condensate leaving a kettle's jacket passes through its trap, it moves from 400 kPa absolute to a condensate line at lower pressure. At 400 kPa, the water is at its saturation temperature, 143.1 °C. At the lower pressure, water can only exist as liquid up to that lower pressure's saturation temperature. The surplus heat has nowhere to go but into boiling some of the water, instantly. That is **flash steam**: the plume rising from a vented condensate receiver, often mistaken for a leak or a failed trap. It is neither; it is the steam table at work, and it is a real loss if it is simply vented. Understanding it, and measuring how much there is, is the first step to recovering it.

This chapter calculates flash steam with the steam table, works out what venting it costs SV-8, shows how flash steam can be recovered at low pressure, puts a value on returned condensate in heat, water and treatment, and looks at why condensate is sometimes sent to drain and how to make it safe to return. The failure case is a condensate stream that had been dumped for years because of a contamination scare long since resolved.

## How much flashes

When saturated water at a higher pressure is released to a lower pressure, its enthalpy stays the same, as with the throttling in Chapter 4. The water's enthalpy at the higher pressure, h_f, is more than saturated water at the lower pressure can hold. The fraction that flashes to steam is that surplus divided by the latent heat at the lower pressure.

```figure
type: formula
title: Flash steam from SV-8's kettle condensate
formula: flash fraction = (h_f at the high pressure − h_f at the low pressure) ÷ h_fg at the low pressure
caption: Published steam table values. Condensate at 400 kPa absolute released to atmospheric pressure in a vented receiver.
- h_f at 400 kPa | 604.7 kJ/kg
- h_f at 101.3 kPa | 419.1 kJ/kg
- h_fg at 101.3 kPa | 2,257 kJ/kg
step: flash fraction = (604.7 − 419.1) ÷ 2,257 ≈ 0.0822, about 8.2%
step: from 800 kPa to atmospheric, (720.9 − 419.1) ÷ 2,257 ≈ 13.4%
```

About **8.2%** of the kettles' condensate becomes steam the moment it reaches the vented receiver. By mass it looks small. By volume it is not: a kilogram of steam at atmospheric pressure occupies **1.67 m³**, so flash steam makes a large, visible plume from a modest mass. And by heat it is large: each kilogram of flash steam carries its latent heat, 2,257 kJ, away.

## What venting costs SV-8

On average, about **420 kg/h** of condensate returns to SV-8's vented receiver, 70% of the 600 kg/h of steam used, most of it from the 400 kPa kettles. About **420 × 0.0822 ≈ 34.5 kg/h** flashes off and leaves through the receiver's vent, about **58 m³/h** of steam. Its heat is about **34.5 × 2,257 ÷ 3,600 ≈ 21.7 kW**, and over 4,000 hours, about **A$8,100** a year at about A$0.093 per kWh, before counting the lost water.

```figure
type: bars
title: Where the heat in SV-8's returning condensate goes, average flows
unit: kW
max: 35
caption: This is an illustration at 420 kg/h of condensate from 400 kPa. Flash steam vented at the receiver is the largest loss after the heat already used in the kettles; the rest returns to the feed tank as hot water.
- Flash steam vented at the receiver | 21.7
- *Hot condensate returned to the feed tank, above 15 °C make-up | 31.8
```

## Recovering flash steam

Flash steam is low-pressure steam, and it can be used wherever low-pressure heat is needed. The usual method is a **flash vessel**: condensate from higher-pressure equipment is discharged into a vessel held at a chosen low pressure, the flash steam separates and is piped to a low-pressure user, and the remaining condensate drains through a trap to the receiver.

If SV-8 flashed its kettle condensate at **190 kPa absolute** instead of atmospheric pressure, about **(604.7 − 497.8) ÷ 2,206 ≈ 4.8%** would flash, about **20 kg/h** from 420 kg/h, carrying about **12.5 kW** at 118.6 °C. That steam could preheat the boiler's make-up water or warm the cleaning system's water. The rest of the flash, from 190 kPa down to atmospheric, would still occur at the receiver, but it would be smaller.

Flash recovery only pays if there is a low-pressure user that needs heat at the same times the condensate flows. SV-8's cleaning water heater, which runs mostly at the end of production when the kettles are also finishing, matches reasonably well, and the business has costed a flash vessel feeding it. Where no user exists, the next best step is to route the receiver's vent through a small heat exchanger that preheats the make-up water, condensing the flash steam and keeping its heat.

## The value of condensate

Returned condensate is valuable three ways.

**Heat.** Condensate reaching the feed tank at about 80 °C carries about **4.19 × 65 ≈ 272 kJ/kg** more heat than mains make-up water at 15 °C. At SV-8's 420 kg/h, that is about **31.8 kW**, about **A$11,800** a year. Chapter 2 showed that hot feedwater also raises the boiler's capacity.

**Water.** Every kilogram returned is a kilogram of make-up water not bought.

**Treatment.** Condensate is distilled water, nearly free of dissolved solids, so it needs little treatment and reduces the blowdown the boiler needs. Make-up water must be softened and dosed, and every kilogram of it brings in solids that must later be blown down.

```figure
type: compare
title: Raising SV-8's condensate return from 70% to 85%
cols: Extra condensate | Heat saved a year | Water saved a year
caption: This is an illustration over 4,000 hours, with heat at about A$0.093 per kWh and water and its treatment at an assumed A$3 per kilolitre, excluding GST.
- *Extra 15% of 600 kg/h | about 90 kg/h | about 6.8 kW, about A$2,540 | about 360 kL, about A$1,080
```

## Condensate lines carry steam too

Flash does not wait for the receiver. It begins as soon as the condensate passes the trap, so the line from the trap to the receiver carries a mixture of water and flash steam. By mass it is mostly water; by volume it is mostly steam. At SV-8's average flows, about **420 kg/h** of water occupies only about **0.42 m³/h**, while the **34.5 kg/h** of flash steam occupies about **58 m³/h**, more than a hundred times as much. Condensate lines after traps are therefore sized for the flash steam's volume, not the water's, and are much larger than a water pipe for the same mass would be. An undersized line raises the back pressure at the traps, which reduces their capacity and brings on the stall described in Chapter 6.

The receiver's vent must likewise be large enough to pass the flash steam without pressurising the receiver, and it must discharge somewhere safe and visible, as SV-8's does, above the roof.

## Pumping condensate back

Condensate collects at the lowest points of the plant and must be lifted back to the boiler house. SV-8 uses a receiver with an electric pump, started and stopped by level switches, below the kettles. Steam-driven pumps, which use steam pressure to push condensate out of a small vessel in batches, are an alternative where electricity is inconvenient or the condensate is too hot for a conventional pump. Hot condensate near its boiling point can flash inside a pump's inlet and damage it by cavitation, so pumps for hot condensate need enough height of water above their inlet, a requirement their makers state. The pump's status and the receiver's level are alarmed, because Chapter 2 showed what a failed condensate pump does to the boiler.

## Corrosion in condensate systems

Condensate is pure water, which sounds benign, but it absorbs carbon dioxide released from the boiler water's carbonates, forming a weak acid that attacks steel condensate pipes, especially at the bottom of the pipe and at threaded joints. Dissolved oxygen, from air drawn into vented receivers and lines, makes it worse. Corroded lines leak, and leaking condensate is lost condensate. Treatment programs include chemicals that neutralise or film-coat condensate lines, and good practice keeps air out with vents and traps that work. When SV-8 replaced a section of corroded condensate line, the business chose stainless steel for it, at higher first cost and much longer life.

## Measuring the return rate

The return rate is simply the share of steam produced that comes back as condensate. With a steam meter and a make-up water meter, it is about **one minus the make-up divided by the steam**, after allowing for the water discharged as blowdown, which must also be made up. SV-8 records both meters daily in the boiler log; a falling return rate is the first sign of a new loss, such as a trap discharging to drain, a leak or a diverting valve stuck open.

## When condensate cannot come back

Some condensate is too far away, too small in quantity or too uncertain in quality to justify a return line. Its heat can still be used locally. Hot condensate from a remote user can preheat a nearby water supply through a small plate heat exchanger before it goes to drain, which also cools it for the sewer. It can feed a hot water tank for washing equipment or floors, where its quality does not matter and it never contacts food. What it should not do is simply run to drain at near 100 °C, carrying heat, water and treatment chemicals away and creating flash steam in the drains. SV-8's maintenance workshop, at the far end of the site with a small steam heater, sends its condensate through a coil in the workshop's wash-water tank, recovering most of its heat before it is discharged. The arrangement cost a few hundred dollars and keeps the workshop's wash water warm for free, without the expense of a long condensate line back to the boiler house.

## Why condensate is lost

Condensate goes to drain for several reasons: equipment too far from the return system to be worth piping; condensate lines that have corroded and leak; traps that discharge to drain because nobody connected them; and fear of contamination. The last is legitimate. A heat exchanger or jacket that develops a leak can let product or process water into its condensate, and contaminated condensate returned to the boiler can foam, carry over and damage it.

The answer is to monitor, not to dump. A **conductivity or contamination monitor** on the condensate line, with an automatic diverting valve, sends condensate to drain only when its quality is out of limits, and returns it the rest of the time. Water treatment advisers set the limits for the boiler and the likely contaminants.

Hot condensate sent to drain also creates its own problems. Trade waste agreements often limit the temperature of discharges to sewer, and flashing condensate in drains is a scald hazard. Hot condensate is therefore cooled, usually with cold water, before discharge, which wastes more water.

## A failure case: condensate dumped for years

This is an illustration. When SV-8's make-up water meter was first read against its steam meter, the condensate return came out at only about 55%, well below what the plant's layout suggested. A walk round the condensate system found that the steam-to-water heat exchanger for the cleaning system discharged its condensate to drain.

The maintenance file explained why: years earlier, the exchanger's plates had leaked, cleaning chemicals had entered its condensate, and the contaminated condensate had caused foaming in the boiler. The exchanger had since been replaced, but the condensate had been left going to drain "to be safe", and a cold water quench had been added to cool it for the sewer.

The detection came from comparing make-up water with steam produced. The correction was to fit a conductivity monitor and diverting valve on the exchanger's condensate line, set with the water treatment adviser, and return it to the receiver. Return rose to about the 70% used in this book, the quench water was no longer needed, and the business now has an alarm if the monitor diverts condensate for more than a few minutes, which would point to a new leak.

## How this applies to a small Australian business

Expect flash steam whenever hot condensate drops in pressure, and calculate it from the steam table: the difference in liquid enthalpies divided by the latent heat at the lower pressure. Recover it at low pressure where a user can take the heat at the same time, or condense it to preheat make-up water. Return every kilogram of condensate you safely can, valuing its heat, water and treatment together. Protect the boiler with monitoring and diverting valves rather than dumping condensate by default. And compare make-up water with steam produced, regularly, to see how much condensate you are losing.

## Exercise: blowdown flash

SV-8's boiler blows down **30 kg/h** of water at 800 kPa absolute into a vessel at atmospheric pressure. What fraction flashes, how much flash steam is that, and what heat does it carry? Could it be recovered?

**Worked answer.** The flash fraction is **(720.9 − 419.1) ÷ 2,257 ≈ 0.134**, about **13.4%**, so about **30 × 0.134 ≈ 4.0 kg/h** flashes. It carries about **4.0 × 2,257 ÷ 3,600 ≈ 2.5 kW**. The flash steam can be piped to the feed tank, where it condenses and heats the feedwater, and the remaining hot water, about 26 kg/h at 100 °C, can preheat make-up water through a small exchanger before it goes to drain. On a boiler of SV-8's size, the combined recovery of about 3 kW is modest; on larger boilers with more blowdown, it is a standard fitting.
