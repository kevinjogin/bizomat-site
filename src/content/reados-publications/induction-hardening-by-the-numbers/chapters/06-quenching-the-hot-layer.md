---
book: induction-hardening-by-the-numbers
chapterSlug: quenching-the-hot-layer
order: 6
title: "Quenching the hot layer"
description: "Turning the heated layer into martensite: spray quenching and polymer quenchants, how fast is fast enough, the quench tank's heat balance per part and per hour, and a summer rush that warmed the bath."
draft: false
---

Heating sets up the transformation; quenching completes it. The austenite in the heated layer must be cooled fast enough, through the right temperature range, to turn into martensite rather than back into soft ferrite and pearlite. In induction hardening the quench comes seconds after the heat, usually as a spray from the coil itself or from a ring just behind it, and it is as much a part of the recipe as the frequency and the power.

This chapter explains what the quench must achieve and how spray quenching with a polymer solution achieves it, checks the quench tank's heat balance with a WORKOS tool, shows why a balance based only on the heated layer understates the real load, and works through a summer production rush that warmed the quench bath until shafts started coming out soft.

## What the quench must do

The heated layer's austenite must be cooled past the temperatures where ferrite and pearlite form, before they have time to form, and into the range where martensite forms (Chapter 5). For a plain medium-carbon steel, that window is short: the critical cooling is in the first second or so. Below the martensite start temperature the cooling rate matters less for hardness, but a gentler cooling there reduces the risk of cracking, because martensite forming suddenly and unevenly is what cracks parts.

The ideal quench is therefore fast at first and gentler later. Water is very fast throughout and cracks many parts. Oil is gentler throughout and may not be fast enough for a plain carbon steel's thin case. Aqueous polymer solutions, water containing a few per cent to a few tens of per cent of a soluble polymer, sit between them, and their speed can be adjusted by the polymer concentration, the bath temperature and the spray's flow and pressure. That adjustability is why polymer quenchants are widely used for induction hardening.

```figure
type: compare
title: Common induction quenchants
cols: Cooling speed | Cracking risk | Typical use
rowhead: Quenchant
- Water spray | fastest | highest | plain carbon steels of simple shape, shallow cases
- * Polymer solution spray | adjustable, between water and oil | moderate, controllable by concentration | most induction hardening of carbon and low-alloy steels
- Oil, immersion or spray | slower | lower | alloy steels of high hardenability, parts prone to cracking
- Air or no quench | slowest | lowest | self-quenching of very thin cases on heavy parts, where the cold core draws the heat out
caption: Qualitative comparison. The right quenchant, concentration and spray for a part are set with the quenchant supplier's data and proved by sectioned parts.
```

The IH-40 uses a polymer solution at about 10% concentration, a figure set from its supplier's guidance and the manufacturer's trials, sprayed through holes in the coil's inner face as soon as the power stops. The concentration is checked each shift with a refractometer, because it rises as water evaporates and falls as solution is dragged out on the parts and topped up with water.

### Keeping the concentration right

A polymer quenchant's concentration is read with a hand refractometer, which measures how strongly the solution bends light, in degrees Brix, and multiplied by a factor that the quenchant supplier gives for its product. The arithmetic of correcting it is the same as for any water-mixed fluid: water is added if the solution is too strong, concentrate if it is too weak, and a make-up mix of the right strength replaces what evaporates and what is dragged out on the parts.

The WORKOS [Coolant tank maintenance](/tools/coolant-tank-maintenance/) tool is written for metalworking fluid sumps, but its arithmetic applies unchanged to a polymer quench tank. From the refractometer reading and the product's factor, the target concentration, the tank volume, the water evaporated and the solution dragged out each day, the working days per month and the concentrate price, it gives the actual concentration, the water or concentrate to add to reach the target, the make-up mix strength that holds the target, the daily make-up volume and the monthly concentrate use and cost. Its tramp-oil check does not apply to a quench tank, but the same caution does: anything floating on the solution, such as oil from the parts, distorts the refractometer reading and should be skimmed first.

This is an illustration. The IH-40 tank reads 5.6 °Brix one morning; with the supplier's factor of 2.0, that is 11.2%, 12% above the 10% target. The tool calls for 240 L of water to bring 2,000 L back to 10%. With about 20 L evaporating and 10 L dragged out each day, it gives a make-up mix of 3.3% and about 22 L of concentrate a month. A tank that is only ever topped up with water creeps weaker; one only topped up with mixed solution creeps stronger as water evaporates. The make-up strength holds it steady.

### The spray

A spray quench must reach the whole hot surface evenly and at once. The holes in the coil's quench face are spaced and angled so that their jets overlap on the journal; the flow and pressure are set so that the jets break through the layer of vapour that forms on a very hot surface. If a few holes block with scale or dried polymer, the surface opposite them cools more slowly and may form soft spots. The flow is monitored on the machine, and the holes are inspected and cleared as part of the start-of-shift coil checks (Chapter 4).

### Quench time and the warm core

The spray runs for a set time after the heat, long enough to bring the case well below the martensite range so that the transformation is complete. Stopping it too early leaves the surface hot enough that heat from the core, which is still warm from conduction, flows back out and tempers the fresh martensite, a process called self-tempering. A little self-tempering is sometimes used deliberately to reduce cracking risk, but uncontrolled it gives a softer case than intended. Running the spray too long wastes cycle time and cools the shaft further than needed. The IH-40's quench runs for 8 seconds, a time set by trial and recorded with each part, and the shaft leaves the coil at roughly 60 °C, warm to the touch.

## The quench tank's heat balance

The quenchant is recirculated: sprayed onto the part, collected, returned to a tank, cooled and pumped back. Every part brings heat into the tank, and the tank's temperature rises unless a cooler takes the heat away. The quench's speed depends on the quenchant's temperature, so a tank that warms up through a shift changes the quench, and with it the hardness.

The WORKOS [Quench tank temperature check](/tools/quench-tank-temperature-check/) tool works out the balance. From the hot load's mass, mean specific heat and temperature, the quenchant's volume, density, specific heat and starting temperature, and its highest allowed temperature, it gives the bath's temperature after one load, the rise per load, the heat released per load, the number of loads in a row the bath can take before passing its limit with no cooling, and the average heat input at your rate of loads per hour against the cooler's capacity.

This is an illustration. The IH-40's tank holds 2,000 L of polymer solution with a density of about 1,010 kg/m³ and a specific heat of about 3,900 J/(kg·K), held at 30 °C with a maximum of 40 °C. Its chiller removes up to 10 kW. As a first estimate, each part's load is taken as the heated layer from Chapter 3: 0.274 kg at 900 °C with a mean specific heat of 600 J/(kg·K).

```figure
type: steps
title: The IH-40 quench in the quench tank tool, heated layer only
caption: This is an illustration. 0.274 kg at 900 °C, c = 600 J/(kg·K); 2,000 L at 1,010 kg/m³ and 3,900 J/(kg·K), 30 °C, limit 40 °C; 120 parts an hour; cooler 10 kW.
- Bath heat capacity | 2,000 × 1.01 × 3,900 = 7,878 kJ/K
- Rise per part | 0.018 K
- Heat released per part | 0.143 MJ
- Parts in a row before passing 40 °C with no cooling | 554
- * Average heat input at 120 parts an hour | 4.8 kW, within the 10 kW cooler
```

One part barely warms the bath: 0.018 K, far too little to measure on a thermometer. The question that matters is the average over hours. At 120 parts an hour, the layer-only estimate puts in 4.8 kW, comfortably within the 10 kW chiller.

### The real heat per part is larger

The layer-only figure understates the heat the quench must remove. Chapter 3 showed that heat conducts beyond the 3 mm layer during heating, so the real energy in the journal is larger; and the quench also cools the steel around the journal and some of the shaft that has warmed by conduction. On the other hand, the shaft leaves the quench still somewhat warm and carries some heat away. The manufacturer measured the tank's real load by logging the chiller's return and supply temperatures and flow over a steady shift: about 6 kW at 120 parts an hour, about 180 kJ per part reaching the quenchant, a quarter more than the tool's layer-only figure. It designs the tank and cooler on that measured figure, using the tool for the first sizing and for checking changes.

```figure
type: compare
title: Quench tank heat input at two production rates
cols: Layer-only estimate, kW | Measured basis, about 180 kJ per part, kW | Against the 10 kW chiller
rowhead: Rate
- * 120 parts an hour | 4.8 | 6.0 | ample
- 180 parts an hour | 7.1 | 9.0 | close to its limit; nothing left in hot weather
caption: This is an illustration. Layer-only figures from the quench tank tool; measured basis from the manufacturer's logging of the chiller. A chiller's capacity also falls as the outside air gets hotter.
```

### Keeping the quenchant healthy

A polymer quenchant does not last for ever. Scale from the parts settles as sludge; oil from machining or from the machine's own hydraulics floats on the surface; bacteria can grow in a warm, still tank; and the polymer itself slowly degrades with repeated heating at the hot surfaces of the parts. Each changes the quench. The manufacturer filters the recirculated solution, skims oil, keeps the tank circulating, and sends a sample to the quenchant supplier periodically for analysis of its concentration, its degradation and its cooling curve, the quenchant's own version of the thermocouple test in a standard probe. When the supplier's analysis shows the solution has degraded beyond its limits, the tank is drained, cleaned and refilled, and the change is recorded so that any shift in the parts' hardness can be checked against it.

### Spray or immersion

Some induction installations quench by plunging the part into a tank instead of spraying it. Immersion quenching is simple and suits parts that are heated all over or in several zones, but it is slower to start than a spray, which strikes the surface the moment the power stops, and the vapour blanket that forms on a very hot surface in still liquid slows the critical first moments of the quench. Agitating the tank helps. For a journal hardened in a coil with an integral spray, the spray's immediacy and evenness are hard to beat, which is why the IH-40 machine uses it.

## The error: a summer rush

This is an illustration. In a hot January, the manufacturer accepted a rush order and ran the IH-40 machine at 180 parts an hour for a week, by shortening the loading time. On the third afternoon, the routine hardness checks showed surface hardness drifting down towards 600 HV1, and the check shaft's section showed a few small soft patches on the journal.

The bath temperature log told the story. On a 38 °C day, the chiller, rated at 10 kW at moderate outdoor temperatures, was delivering only about 6 kW. Against about 9 kW of heat from 180 parts an hour, the bath gained about 3 kW. Over an eight-hour shift that is 3 × 3,600 × 8 = 86,400 kJ, and with a bath heat capacity of 7,878 kJ/K the bath rose about 11 K, from 30 °C to about 41 °C, past its 40 °C limit. A warmer polymer solution quenches more slowly, and the slowest-cooled parts of each journal, opposite partly blocked spray holes, had begun to form soft patches.

```figure
type: checklist
title: Keeping the quench consistent
caption: The open item is the one the rush order missed: the cooler's capacity on the hottest day, not on the nameplate.
- Polymer concentration checked each shift by refractometer | adjusted to the set range
- Bath temperature logged continuously, with an alarm at the limit | and the machine stopped above it
- ? Cooler capacity checked against the production rate on hot days | derate for ambient temperature
- Spray holes inspected and cleared | start of each shift
- Spray flow and pressure monitored | interlocked
- Tank cleaned of scale and sludge periodically | which insulates and blocks
```

Nobody had done anything obviously wrong. The machine ran its proven recipe on every part, the energy monitor was happy, and the bath was not watched closely because it had never given trouble at 120 parts an hour in milder weather. The failure lay in a margin that had quietly shrunk on two sides at once: more heat going in, and less cooling coming out. The week was rescued by running the rush order at 150 parts an hour during the hottest hours and 180 overnight, and by hiring a portable chiller. The manufacturer then fitted a larger chiller sized for the measured 9 kW plus a margin at the hottest expected outdoor temperature, interlocked the machine to stop when the bath passed 40 °C, and added the bath temperature to the part record.

## Exercise: a larger tank instead of a larger chiller

This is an illustration. Instead of a larger chiller, someone suggests a 4,000 L tank, so the bath warms more slowly.

1. What is the bath heat capacity of 4,000 L of the same solution?
2. With the same 3 kW excess heat on a hot day, how much would the bath rise over an eight-hour shift?
3. Is a larger tank a cure?

**Worked answer.**

1. 4,000 × 1.01 × 3,900 = **15,756 kJ/K**.
2. 86,400 ÷ 15,756 = **5.5 K**, from 30 to about 35.5 °C, within the 40 °C limit.
3. **Only partly.** A larger tank buys time, halving the rise over one shift, but if the excess heat continues into a second or third shift the bath keeps climbing: the tank can only store heat, not remove it. The cure is cooling capacity matched to the heat input on the hottest day; the larger tank is a useful buffer on top of that, not a substitute.
