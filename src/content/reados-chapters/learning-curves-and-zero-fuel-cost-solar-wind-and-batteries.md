---
title: "Learning curves and zero fuel cost: how solar, wind and batteries were engineered, and what they teach businesses"
description: "Solar, wind and batteries improved through learning curves rather than breakthroughs. How they were engineered, why scale and zero fuel cost matter, and lessons for businesses."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - strategy
  - systems
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

Most of the engineering history that businesses learn from is a story of breakthroughs: the steam engine, the transistor, the moving assembly line. The technologies now reshaping electricity supply followed a different path. Solar cells, wind turbines and lithium-ion batteries were all invented decades before they mattered commercially. What changed was not a single discovery but the steady fall in cost that came from making them in ever larger volumes, combined with a feature no earlier power source had: once built, they need no fuel.

That combination has changed how power systems work, how electricity is priced and what businesses can do with their own sites. It also offers lessons that reach well beyond energy. It shows how to judge a technology that is still expensive, why manufacturability often decides adoption more than performance, why some products grow larger with every generation, and why the power and energy ratings of a storage system must be specified separately.

This article traces how photovoltaics, modern wind turbines, lithium-ion cells, hybrid drives and grid-scale batteries were engineered, explains the physics and economics that shaped them, including Australia's contributions, and draws out practical lessons for engineers, managers and business owners. It is general information, not advice on any particular energy investment.

## A different kind of progress: the learning curve

In 1936, the aeronautical engineer Theodore Wright reported that in aircraft manufacturing, the labour needed to build each aircraft fell by a roughly constant percentage every time the cumulative number built doubled. This relationship, now called a **learning curve** or experience curve, has since been observed in many industries. Costs fall not because time passes, but because making things in volume reveals thousands of small improvements in process, materials, equipment and supply chains.

Photovoltaic modules have followed such a curve for decades. Their price has fallen by a roughly constant proportion, often cited at around 20 per cent, for each doubling of cumulative production. Lithium-ion cells have followed a similar pattern.

The distinction between time and volume matters for anyone forecasting. A learning curve is driven by **cumulative production**, so when deployment grows faster than expected, costs fall faster than expected. Many projections of solar costs made over the past few decades proved too pessimistic because they extrapolated by calendar year while volumes grew much faster than assumed.

Two implications follow:

- **Deployment generates knowledge.** Many improvements are discovered only by making things in volume. Research and deployment are complements rather than alternatives, because each produces knowledge the other cannot.
- **Early cost is a poor predictor.** Judging a technology by its unit cost when few have been made understates it. The better questions are how steep the curve is and how much volume is plausible.

Learning curves are empirical patterns, not laws of nature. They can flatten as costs approach a floor set by materials or energy inputs, and supply shortages of a raw material can interrupt them. Treating a past curve as a guarantee would be a mistake; treating it as evidence about the future is reasonable.

## Photovoltaics: from satellites to rooftops

The photovoltaic effect, in which light falling on certain materials produces an electric current, was observed in 1839 by Edmond Becquerel. The first practical silicon solar cell was demonstrated at Bell Laboratories in 1954, converting about 6 per cent of sunlight into electricity. Solar cells were far too expensive for general power supply, but they suited satellites, where there was no alternative, and the Vanguard 1 satellite carried them in 1958. Remote uses such as navigation aids and telecommunications repeaters followed. Each market added volume, and volume brought costs down.

### Where the losses are

A silicon cell converts light into electrical charge carriers, and almost every design improvement addresses one of a few loss mechanisms:

| Loss | What happens | Typical response |
|---|---|---|
| Optical | Light is reflected from the surface or shaded by metal contacts | Textured surfaces, anti-reflection coatings, finer contacts |
| Transmission | Long-wavelength light passes through without being absorbed | A rear reflector that sends light back for a second pass |
| Thermalisation | Energetic photons lose their excess energy as heat | Inherent to a single-junction cell; the largest single loss |
| Recombination | Carriers recombine before reaching a contact, especially at surfaces | Passivation layers that reduce surface recombination |
| Resistive | Current flowing through the cell and contacts loses power | Balancing contact coverage against shading |

### PERC: a better design that waited for the economics

In the 1980s, researchers in Martin Green's group at the University of New South Wales developed the **passivated emitter and rear cell (PERC)**. It added a passivating layer on the rear of the cell with small contacts through it, reducing recombination at the rear surface and reflecting unabsorbed light back into the cell. One structural change addressed two loss mechanisms, and the group's cells set efficiency records.

Yet PERC did not become the mainstream commercial design until the late 2010s, about three decades later. The design was not in doubt. The extra manufacturing steps simply were not worth the efficiency gain until other costs had fallen far enough that cell efficiency became the dominant factor, and until production equipment for those steps had matured. Once that happened, PERC could be added to existing production lines with a manageable number of extra steps, and it spread quickly.

The lesson is broader than solar. A better design often waits until the economics of the surrounding system make it worth adopting. Judging a technology as a failure because it has not yet been adopted is a common and expensive mistake.

Australia has also become one of the world's heaviest users of rooftop solar, with more than three million rooftop systems installed. That scale has brought its own engineering challenges for electricity networks, including managing voltage and minimum demand on sunny days when rooftop output exceeds local use.

## Wind: why turbines grew so large

Windmills have ground grain and pumped water for centuries, and wind-driven electrical generators were built from the late nineteenth century. Modern wind power grew from Danish and other developments in the 1970s and 1980s, and in 1991 Vindeby in Denmark became the first offshore wind farm, with eleven turbines of 450 kilowatts each.

Since then, turbines have grown enormously, for reasons rooted in simple physics:

- The power in the wind passing through a rotor varies with the **swept area** of the rotor and the **cube of the wind speed**.
- Swept area varies with the **square of the rotor diameter**, so doubling the diameter quadruples the area.
- Wind speed generally increases with height above the ground, and because power varies with its cube, a modest increase in speed gives a large increase in power.

Meanwhile, many costs are incurred **per machine** rather than per unit of output: foundations, grid connections, installation vessel time, approvals and maintenance visits. Larger machines spread those fixed costs over more energy.

### The Betz limit

In 1919, the German physicist Albert Betz showed that no rotor can extract more than about 59 per cent of the kinetic energy in the wind passing through it. Extracting all of it would require the air to stop, and stopped air cannot move out of the way to let more air through. Modern rotors already capture a substantial fraction of that maximum, so further aerodynamic improvement has limited room. That is why the engineering effort now focuses on size, reliability and installation cost.

### What limits scaling

| Limit | Why it matters | How engineers have responded |
|---|---|---|
| Blade mass | Scaling a blade's shape increases its mass faster than its swept area | Carbon fibre in key structural parts, structural optimisation |
| Tip speed | Noise and erosion of the blade's leading edge rise with tip speed | Slower rotation at larger diameters, erosion-resistant coatings |
| Drivetrain reliability | Highly variable torque shortens gear and bearing life | Direct-drive generators and improved drivetrain designs |
| Transport and installation | Blades and towers exceed road and crane limits | Offshore sites, specialised vessels, segmented designs |
| Fatigue | Each revolution cycles the loads over a design life of decades | Fatigue-driven design and control that limits loads |

## Storing energy: the lithium-ion cell

Lithium is the lightest metal and has a strongly negative electrode potential, so cells using it can store a lot of energy for their mass. It is also highly reactive. Early rechargeable cells with lithium metal electrodes tended to grow fine metallic filaments, called dendrites, through the separator during repeated cycling, causing internal short circuits and fires.

The commercial lithium-ion cell resolved this through three contributions over roughly fifteen years:

- **Stanley Whittingham** showed in the 1970s that lithium ions could be inserted reversibly into a host material, a process called intercalation, rather than being plated as metal.
- **John Goodenough** identified oxide cathode materials around 1980 that substantially raised the cell's voltage.
- **Akira Yoshino** replaced the lithium metal anode with a carbon-based host in the mid-1980s, removing the dendrite problem and making a commercially safe cell possible.

Sony launched a commercial lithium-ion cell in 1991, and the three researchers shared the Nobel Prize in Chemistry in 2019. In operation, lithium ions shuttle from one host material to the other and back, so neither electrode is consumed. Cell life depends on how well the materials tolerate that repeated movement and on slow side reactions inside the cell.

Three engineering facts follow for anyone specifying or using lithium-ion batteries:

- **Thermal runaway.** Above a certain temperature, reactions inside a cell generate heat faster than it can escape, and the cell can fail violently and spread failure to neighbouring cells. Battery design is largely about preventing, detecting and containing that.
- **The battery management system is safety-related.** Each cell must be kept within voltage, current and temperature limits and balanced against the others. The management system is a safety control system, not an accessory.
- **Degradation has two clocks.** Capacity fades with use and with age, and both are accelerated by heat and by long periods at high charge. Warranties and specifications should address both.

## Hybrid drives: a buffer between source and load

A piston engine is efficient only over a narrow range of speed and load. In a conventional vehicle, the engine is tied mechanically to the wheels, so in stop-start traffic it spends much of its time well away from that range and wastes braking energy as heat.

Toyota's Prius, launched in Japan in 1997 as the first mass-produced hybrid car, used a planetary gearset and two electric machines between the engine and the wheels. Engine speed could then be set by the control system rather than by road speed, keeping the engine near its efficient range or switching it off, while the battery and motors made up the difference. Regenerative braking recovered energy that would otherwise be lost.

The transferable idea is **separating a source from a load with a buffer and a converter**, so that each can run at its best point. The same structure appears in a grid battery smoothing supply against demand, a surge tank in a process plant and a buffer stock between two production stages. The trade-off is always similar: better efficiency and smaller main components, paid for with the cost, losses and complexity of the buffer.

## Grid batteries: speed rather than bulk

The obvious use for a large battery on an electricity grid is to store cheap energy and release it when prices are high. The Hornsdale Power Reserve in South Australia, which began operating in late 2017 with a rating of 100 megawatts and 129 megawatt-hours, showed that another service could be even more valuable: responding to disturbances in grid frequency.

When a large generator trips, grid frequency starts to fall. Conventional steam and gas turbines respond through governors acting on large rotating machines, which takes seconds. A battery's inverter measures frequency and changes its output within a fraction of a second, because nothing mechanical needs to accelerate. For stopping a rapid frequency fall, that speed can be worth more than large energy capacity. Hornsdale was later expanded, and large batteries have since been built across Australia's grids.

### Power and energy are separate ratings

A battery system has a **power rating**, in kilowatts or megawatts, set by its inverters, connections and thermal limits, and an **energy rating**, in kilowatt-hours or megawatt-hours, set by its cells. They are independent design choices, and the right ratio depends on the service:

| Service | What sizes it | Typical duration |
|---|---|---|
| Fast frequency response | Power rating and response speed | Seconds |
| Reserve after a generator trips | Power, with modest energy | Minutes |
| Shifting energy to higher-priced periods | Energy capacity and round-trip efficiency | Hours |
| Easing local network limits | Location and power | Varies |
| Seasonal balancing | Very large energy capacity; rarely economic for batteries | Weeks to months |

Describing a battery by only one of the two numbers does not describe it.

## Zero fuel cost changes the whole system

Wind and solar farms have high upfront costs but almost no cost for each additional unit of energy, because they burn no fuel. In electricity markets where generators are dispatched in order of their offered price, that pushes prices down whenever wind and sun are plentiful. In parts of Australia's National Electricity Market, wholesale prices are now often very low or negative in the middle of sunny days.

Value therefore shifts. Energy at midday becomes cheap, while the ability to supply power when wind and sun are scarce, to respond quickly to disturbances and to shift demand becomes more valuable. Services that conventional generators once provided automatically, such as the inertia of large rotating machines that slows frequency changes, now have to be specified and procured deliberately. For businesses, the change shows up in time-varying tariffs, demand charges and opportunities to move flexible loads into cheaper periods.

## Lessons for businesses

### Forecast against volume, not dates

When assessing a technology on a learning curve, whether in energy, electronics, automation or materials, ask how much cumulative production is likely and how steep the curve has been. Equipment that is too expensive today may become economic sooner than a calendar-based forecast suggests.

### Manufacturability decides adoption

PERC waited three decades not because it failed to work, but because it was not yet worth manufacturing. Product improvements that fit existing production lines with few extra steps spread far faster than those that need new processes.

### Scale when costs are per unit, not per output

Wind turbines grew because many costs are incurred per machine. Wherever fixed costs per unit dominate, such as installation, approvals, inspection or delivery, fewer and larger units can be cheaper, until a physical or logistical limit intervenes.

### Know where the physical limit is

The Betz limit shows how close rotors are to the maximum possible. Knowing the theoretical limit of a process tells you where improvement effort can still pay off, and where it cannot.

### Specify power and energy separately

For batteries, backup systems, compressed air receivers or any storage, decide what service is needed and size power and energy for it. The [cutting energy use in business premises](/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/) article explains how to read interval data and demand charges before sizing equipment.

### Treat battery systems as safety-related

Use reputable equipment, qualified designers and installers, and the relevant installation standards, and maintain the management systems that keep cells within their limits.

### Judge equipment over its whole life

Battery capacity fades with use and with age, and warranties differ in how they treat each. The [buying for the whole life of equipment](/reados/collections/investment-appraisal-and-business-cases/buying-for-the-whole-life-of-equipment/) article covers how to compare options on whole-of-life cost.

## A worked example

This is an illustrative example. A food manufacturer in an Australian city already has a 150 kW rooftop solar system, and most of its output is used on site. Its electricity tariff includes a demand charge based on the highest 30-minute demand each month, assumed here at $15 per kilowatt per month. Interval data shows that demand is usually about 380 kW, but peaks at about 520 kW for around half an hour on most weekday mornings, when ovens, compressors and refrigeration start together before the sun is up.

**Step one: operations.** Staggering equipment start-ups over 40 minutes cuts the morning peak to about 450 kW. That 70 kW reduction is worth about 70 × $15 × 12, or $12,600 a year, at almost no cost.

**Step two: size for the service.** Holding demand at 400 kW would save a further 50 kW, worth about $9,000 a year. That needs a battery able to deliver about 50 kW for about half an hour, or about 25 kWh. Allowing for usable capacity, degradation over its life and mornings when the peak lasts longer, the engineer suggests about 60 kW and 60 kWh.

**Step three: compare offers.** One supplier proposes a 250 kW, 500 kWh system designed to store midday solar for evening use. Because the site already uses most of its solar output and its problem is a short morning peak, most of that energy capacity would add little value for this purpose. The business seeks quotes for the smaller system, assesses them on whole-of-life cost with both cycle and calendar degradation, and requires installation by qualified installers to the relevant battery installation standard, AS/NZS 5139.

The decision reflects the history: separate the service from the hardware, size power and energy for it, and change operations before buying equipment.

## Applying these lessons in an Australian business

- **Track the cost curves** of technologies relevant to your business.
- **Forecast with volume** as well as time when assessing new technology.
- **Favour improvements** that fit existing processes.
- **Look at fixed costs per unit** when choosing between many small and fewer large units.
- **Change operations first**, then size equipment for the remaining need.
- **Specify storage by power and energy**, matched to the service required.
- **Treat battery systems as safety-related**, with qualified design and installation.
- **Watch tariffs and prices** for opportunities to shift flexible loads.

## Questions worth considering

- Which technologies we rejected as too expensive are moving down a learning curve?
- Are we judging any new technology on today's cost alone?
- Which of our improvement ideas would fit our existing production with few extra steps?
- Do our equipment specifications state power and energy separately where both matter?
- Which of our loads could move to periods when electricity is cheapest?

## Bringing it together

Solar cells, wind turbines and lithium-ion batteries became central to electricity supply through learning curves, patient engineering and manufacturability rather than sudden breakthroughs. Turbines grew because physics rewards size and many costs are per machine; batteries became safe through three separate scientific contributions; hybrid drives and grid batteries showed the value of a buffer between source and load; and zero fuel cost reshaped how power is priced. For businesses, the lessons are to forecast against volume, value manufacturability, scale when fixed costs dominate, specify power and energy separately, treat storage as safety-related and change operations before buying equipment.

---

*Source: KEVOS® editorial notes, drawing on an earlier KEVOS® engineering history series on photovoltaics, wind turbines, lithium-ion cells, hybrid drives and grid-scale storage, together with established histories of technology. Tariff and cost figures in the worked example are illustrative assumptions. This article is general information, not advice on any particular energy investment; electrical and battery work must be designed and installed by appropriately licensed and qualified people.*
