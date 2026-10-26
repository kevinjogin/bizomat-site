---
book: process-steam-by-the-numbers
chapterSlug: steam-for-a-process
order: 3
title: "Steam for a process"
description: "Work out the steam a process needs: duty and steam flow, heating a batch through a jacket, how steam pressure sets heat-up time, steam per batch and its cost, and why air in a jacket slows everything."
draft: false
---

A process does not use steam; it uses heat, and steam is the carrier. The question every process engineer asks is how much steam a piece of equipment needs, and how fast it will do its job. For a continuous process at steady duty, the answer is one division. For a batch heated through a jacket or coil, it depends on the jacket's area, how well heat crosses it, and the temperature difference between the steam and the product, which shrinks as the product warms. The steam pressure chosen sets that temperature difference, and with it the heat-up time, the risk of scorching and the steam flow at the start of each batch.

This chapter works through one of SV-8's jacketed cooking kettles. It turns duty into steam flow, heats a 500 kg batch of sauce through the jacket, compares heat-up times at three steam pressures, works out the steam and cost per batch, and explains why air and condensate in the jacket matter. The failure case is a kettle that heated slowly after maintenance because air was trapped in its jacket.

## From duty to steam flow

When steam condenses in a jacket, each kilogram gives up its latent heat. The steam flow needed for a heating duty is therefore the duty divided by the latent heat at the jacket's pressure.

The same division works for any steady process: a water heater, a dryer, a space heating coil. For SV-8's four kettles at 100 kW each, the total is about **675 kg/h**, as Chapter 2 found.

## Heating a batch through a jacket

A kettle is a heat exchanger: steam condenses on one side of a stainless steel wall, and product is heated on the other. The heat flow at any moment is the jacket's overall coefficient **U** times its area **A** times the difference between the steam's saturation temperature and the product's temperature. As the product warms, the difference shrinks, and so does the heat flow.

```figure
type: line
title: Heat flow through the kettle's jacket during one batch
x: Minutes from start
y: Jacket heat flow, kW
ymin: 0
ymax: 160
mark: 21 | 90 °C reached, about 64 kW
caption: This is an illustration from the lumped model, with steam at 143.1 °C, UA of 1,200 W/K, a 500 kg batch and a time constant of 1,500 s. The heat flow falls as the sauce warms, so the steam supply must meet about 148 kW at the start to average 100 kW over the batch.
- 0 | 147.7
- 5 | 120.9
- 10 | 99.0
- 15 | 81.1
- 21 | 63.8
```

Each SV-8 kettle heats a **500 kg** batch of sauce from **20 °C** to **90 °C**. The jacket has an area of **2.0 m²**, and with the product stirred, its overall coefficient is about **600 W/m²·K**. The sauce's specific heat is taken as **3.6 kJ/kg·K**. These three values are an illustration; real values come from the kettle's maker, measurements and the product's data.

The batch needs **500 × 3.6 × 70 = 126,000 kJ** of heat, and at the jacket's latent heat that is about **126,000 ÷ 2,133 ≈ 59.1 kg** of steam per batch.

The heat-up follows the lumped model from *Heat Transfer by the Numbers*: the product approaches the steam temperature exponentially, with a time constant equal to the batch's heat capacity divided by UA. Here that is **500 × 3,600 ÷ (600 × 2.0) = 1,500 seconds**. The time to reach 90 °C with steam at 143.1 °C is

**1,500 × ln((143.1 − 20) ÷ (143.1 − 90)) ≈ 1,500 × 0.841 ≈ 1,260 s, about 21 minutes.**

At the start, with the sauce at 20 °C and the steam at 143.1 °C, the jacket passes about **1,200 × 123 ≈ 148 kW**. By the end, with the sauce at 90 °C, only about **64 kW**. Averaged over the 21 minutes, the 126,000 kJ is delivered at about **100 kW**, which is how the kettle's rating is derived. The steam supply must be able to deliver the peak at the start of each batch, which is why staggering start-ups, Chapter 2, matters.

## Steam pressure sets the pace

Raising the steam pressure raises its temperature and shortens the heat-up; lowering it does the reverse.

Higher pressure is faster, but it has costs. A hotter jacket wall scorches sauce that touches it, especially at low stirring speeds or with thick, sugary products. The kettle's jacket is rated for a maximum pressure, which the operating pressure must not exceed. And the peak steam demand at the start of each batch rises, loading the boiler. SV-8's 400 kPa was chosen as the balance between batch time and product quality, after trials with the production team tasting and inspecting each trial batch, and is recorded in the kettle's operating instructions with the reasons, so that nobody raises it later simply to save time.

## Steam and cost per batch

Each batch uses about **59.1 kg** of steam in the jacket. At about **A$63** a tonne, from Chapter 2, that is about **A$3.72** of gas per batch, before counting the heat lost from the kettle's surfaces and pipes during the batch. Knowing the cost per batch lets the business compare process changes on a common basis: a lid that cuts evaporation, a hotter starting temperature for ingredients, a shorter hold time at temperature.

The steam per batch does not depend on the pressure chosen, because the product needs the same heat whichever pressure delivers it; only the time changes. The lower latent heat at higher pressure is offset by the condensate leaving hotter, which Chapters 6 and 7 deal with.

## Continuous duties

Not every steam user works in batches. SV-8 also heats water for its cleaning-in-place system in a steam-to-water plate heat exchanger, warming **2 m³/h** of water from 15 °C to 80 °C whenever cleaning runs. The duty is **(2,000 ÷ 3,600) × 4.19 × 65 ≈ 151 kW**, and the steam flow about **151 ÷ 2,133 × 3,600 ≈ 255 kg/h**. That is a large share of the boiler's output, and it often coincides with the end of a production run, when kettles are also being cleaned with hot water. Listing every steam user with its duty, its steam flow and when it runs is the only reliable way to see the plant's real peak, and SV-8's steam users list is kept with the boiler log.

```figure
type: compare
title: SV-8's steam users list
cols: Duty | Steam at 400 kPa absolute | When it runs
caption: This is an illustration. Steam flow is the duty divided by h_fg = 2,133 kJ/kg. Listing when each user runs, not just how much it needs, shows that the cleaning heater and the kettles can overlap at the end of a run.
- Kettles 1 to 4, each | 100 kW average, about 148 kW at a cold start | 169 kg/h each, 675 kg/h together | batch heat-ups, staggered by 15 minutes
- *Cleaning water heater | 151 kW, 2 m³/h from 15 to 80 °C | 255 kg/h | cleaning-in-place at the end of production runs
```

## Controlling the temperature

A kettle's temperature is controlled by a valve on its steam supply. When the valve throttles, the pressure in the jacket falls, and with it the steam's saturation temperature, so the heat flow falls. That is a neat and stable way to control heating. It has a catch. At low demand, the valve can throttle the jacket's pressure down close to, or even below, atmospheric pressure, especially as the product nears its set temperature. Condensate then cannot drain through the trap, because there is no pressure to push it out, and the jacket floods. This condition, called **stall**, makes temperature control erratic and causes water hammer. Chapter 6 shows how traps and condensate systems are arranged to prevent it.

## Direct steam injection

Some processes heat product by injecting steam straight into it rather than through a jacket. Every kilogram of steam then gives up both its latent heat and some sensible heat as it cools to the product's temperature, and every kilogram ends up in the product as water. Direct injection is fast and has no heating surface to foul, but it dilutes the product, and in food plants the steam must be of a quality fit to contact food, which usually means filtered steam from a treated supply, or clean steam made from purified water in a separate generator. The steam's chemical treatment, harmless in a boiler, may not be acceptable in product. These questions are settled with the plant's food safety plan before direct injection is used.

## Measuring a kettle's steam

Steam per batch can be measured without a steam meter, by weighing the condensate. Every kilogram of steam that condenses in the jacket leaves as a kilogram of condensate, so collecting the trap's discharge over one batch, in a closed, vented container with care for its heat and the flash steam it releases, and weighing it, gives the steam used. On SV-8, the test gave about **64 kg** for a 500 kg batch, a little above the calculated 59.1 kg. The difference, about 5 kg, was the heat lost from the kettle's lid and uninsulated surfaces during the batch, plus a little flash steam escaping from the collection drum. Measured once, the figure gives a reliable cost per batch and a baseline: a later rise means a fouled jacket, a lid left open or a trap passing steam.

## What slows a jacket

The calculation assumes the jacket's inside surface is covered only by condensing steam, with condensate draining away freely. Two things commonly spoil that.

```figure
type: svg
title: What has to happen inside SV-8's kettle jacket
alt: A cross-section of a jacketed kettle. Steam at 400 kPa absolute enters the jacket on the left. Air is pushed to the far, right-hand side of the jacket, where an automatic air vent lets it out. Condensate drains to the bottom of the jacket and leaves through a trap. The sauce inside the vessel is heated through the stainless steel wall.
caption: This is an illustration. Steam enters on one side; air must leave by the vent at the far side, and condensate must leave by the trap at the bottom. Air left in the jacket lowers its temperature, and condensate left in it covers heating surface with water.
viewbox: 0 0 640 320
body:
<path class="fs" d="M200 110V200Q200 260 320 260Q440 260 440 200V110Z"/>
<path class="li" d="M200 60V200Q200 260 320 260Q440 260 440 200V60"/>
<path class="ln" d="M180 90V205Q180 285 320 285Q460 285 460 205V90M180 90H200M440 90H460"/>
<text class="txb" x="320" y="178" text-anchor="middle">sauce, 500 kg</text>
<text class="tx txs" x="320" y="198" text-anchor="middle">20 °C to 90 °C</text>
<path class="la flow" d="M60 110H170"/>
<path class="ah" d="M168 104l12 6-12 6z"/>
<text class="txa" x="40" y="94">steam in</text>
<text class="tx txs" x="40" y="132">400 kPa abs, 143.1 °C</text>
<circle class="fa pulse" cx="450" cy="118" r="4"/>
<circle class="fa pulse" cx="450" cy="140" r="4"/>
<path class="ln" d="M460 104H500"/>
<rect class="bxa" x="500" y="92" width="24" height="24" rx="3"/>
<text class="tx txs" x="534" y="102">air vent</text>
<text class="tx txs" x="534" y="120">air pushed</text>
<text class="tx txs" x="534" y="136">to the far end</text>
<path class="la dsh" d="M214 246Q320 282 426 246"/>
<text class="tx txs" x="40" y="240">condensate film</text>
<text class="tx txs" x="40" y="256">drains to the bottom</text>
<path class="ln" d="M320 285V302H372"/>
<rect class="bx" x="372" y="292" width="26" height="20" rx="3"/>
<text class="tx txs" x="408" y="306">trap: lets condensate out, holds steam in</text>
<text class="tx txs" x="200" y="40">UA ≈ 2.0 m² × 600 W/m²·K = 1,200 W/K</text>
```

**Air.** When the jacket is cold, it is full of air. Steam entering pushes air towards the far end, where it must be vented. Air that stays behind mixes with the steam, and the mixture's temperature is lower than pure steam's at the same pressure, because the steam's share of the pressure, its partial pressure, is lower. Air also collects as a film on the heating surface, insulating it. A jacket's automatic air vent, at the point furthest from the steam inlet, lets air out at start-up and closes when steam arrives.

**Condensate.** Condensate that does not drain floods the bottom of the jacket, covering heating surface with water that transfers heat far less well than condensing steam. The trap at the jacket's outlet must remove condensate as fast as it forms, including the large flow at the start of a batch, which is Chapter 6's subject.

**Fouling** on the product side, such as burnt-on sauce, also lowers U. If U fell to 450 W/m²·K, the heat-up would take about **28 minutes**. Cleaning between batches keeps U, and the batch time, where they should be, and a creeping batch time is often the first sign that cleaning is falling behind.

## A failure case: air in the jacket

This is an illustration. After a maintenance shutdown, one of SV-8's kettles began taking about half as long again as its neighbours to heat a batch. The steam pressure gauge at its inlet read the normal 400 kPa absolute, and its trap was discharging condensate normally.

The maintenance engineer fixed a surface thermometer to the jacket's outlet end and found it about **20 °C** below the saturation temperature of 143.1 °C for that pressure. Pure steam at 400 kPa cannot be colder than 143.1 °C, so something other than steam was occupying the far end of the jacket. During the shutdown, the isolating valve under the jacket's automatic air vent had been closed and never reopened. Air entering the jacket during each cool-down was trapped there.

The detection came from comparing a measured jacket temperature with the saturation temperature for the measured pressure. The correction was to open the vent's isolating valve, after which the jacket's outlet temperature rose to the steam temperature within a minute of start-up and the heat-up time returned to normal. The shutdown checklist now includes a line for reopening every air vent isolating valve, and the valves were fitted with tags that must be removed and signed for when each valve is reopened after maintenance.

## How this applies to a small Australian business

Turn every process's duty into a steam flow by dividing by the latent heat at its pressure, and add them for the plant's demand. For batches heated through jackets or coils, use the lumped model with the jacket's UA to estimate heat-up time and the peak steam flow at the start. Choose the steam pressure as a balance between speed, product quality and the jacket's rating. Work out steam and cost per batch to compare process changes. And keep jackets free of air and condensate: a jacket colder than the saturation temperature for its pressure has air in it.

## Exercise: a larger batch

The business increases each batch to **600 kg**, with the same jacket and steam at 400 kPa absolute. How long does the heat-up from 20 °C to 90 °C now take, and how much steam does each batch use? What is the average heating rate?

**Worked answer.** The heat capacity becomes **600 × 3,600 = 2,160,000 J/K**, so the time constant is **2,160,000 ÷ 1,200 = 1,800 s**, and the heat-up takes about **1,800 × 0.841 ≈ 1,514 s**, about **25 minutes**. The heat needed is **600 × 3.6 × 70 = 151,200 kJ**, which needs about **151,200 ÷ 2,133 ≈ 70.9 kg** of steam. The average heating rate is about **151,200 ÷ 1,514 ≈ 100 kW**, unchanged, because the jacket's heat flow depends on the temperature difference, not on the batch size; the larger batch simply takes longer.
