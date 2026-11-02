---
book: metal-casting-by-the-numbers
chapterSlug: heat-treating-castings
order: 9
title: "Heat treating castings"
description: "Solution treating, quenching and ageing aluminium castings: what each step does, the furnace energy and cycle time per load, the quench tank's heat balance, and a tank too small for the load."
draft: false
---

GB-12's alloy is chosen because it can be hardened by heat treatment. As cast, it is soft and relatively weak. After the three-step treatment known as T6, solution treatment, quenching and artificial ageing, its strength and hardness roughly double. The treatment depends on magnesium and silicon forming fine particles inside the aluminium grains, and those particles form only if each step is done at the right temperature, for the right time, and with a fast enough quench in between.

This chapter explains what each step does, plans the solution and ageing furnace loads with one KEVOS® tool, checks the quench tank's heat balance with another, and works through a quench tank that was too small for the load and quietly took the castings out of specification.

## What T6 does

The hardening comes from tiny particles of a magnesium–silicon compound, too small to see in an optical microscope, spread through each aluminium grain, where they obstruct the movement of dislocations and so make the metal harder and stronger. Each step sets up the next.

```figure
type: timeline
title: The three steps of a T6 treatment for GB-12
caption: This is an illustration. Temperatures and times are the case foundry's procedure for this alloy and section size, agreed with the customer; real procedures come from the alloy supplier's data and the applicable specification.
- Solution treatment | about 540 °C for 6 h | dissolve the magnesium and silicon into the aluminium, and round off the eutectic silicon
- Quench | into water at about 65 °C, within seconds of leaving the furnace | trap the dissolved elements in solution at room temperature
- * Artificial ageing | about 155 °C for 5 h | precipitate the fine hardening particles throughout the grains
- Inspection | Brinell hardness on each load (Chapter 10) | confirm the treatment worked
```

The solution temperature must be high enough to dissolve the alloying elements but below the temperature at which the last parts of the casting to freeze, which are richest in alloying elements, would begin to melt. The quench must be fast enough that the elements do not come out of solution as coarse, useless particles on the way down. And the ageing must be long enough to form the fine particles but not so long that they grow coarse and the casting softens again, which is called over-ageing.

### Time and temperature in ageing

Ageing is a race between forming fine particles and coarsening them. At a given ageing temperature, hardness rises with time to a peak and then falls slowly as the particles grow and become fewer. A higher temperature reaches its peak sooner but at a lower hardness, and passes it faster; a lower temperature takes longer but peaks higher. Each alloy has an ageing curve, hardness against time at each temperature, that the alloy supplier and the foundry's own trials establish. GB-12's 5 hours at 155 °C sits on the broad top of the curve for this alloy, where a modest error in time or temperature changes the hardness little. Ageing well short of the peak, or a long way past it, puts the castings on the steep parts of the curve, where small variations in the oven make large variations in hardness, and Chapter 10's Brinell results spread accordingly.

## Planning a furnace load

The KEVOS® [Heat-treatment furnace load plan](/tools/furnace-heat-treat-plan/) tool estimates the energy and time for a furnace cycle. From the work's mass and its fixtures' and basket's mass, a mean specific heat over the temperature range, the start and set temperatures, the furnace's input power, the share of that power reaching the load while it heats, the furnace's standing heat loss at temperature, the soak time and the energy price, it gives the heat into the load, the heat-up time, the cycle time, the energy and cost per load, the cost per kilogram of work and the fixture's share of the heat. Its guide notes that the real heat-up slows as the load approaches the set temperature, and that the soak time must come from the heat-treatment specification for the section size.

This is an illustration. GB-12's solution furnace is an electric air-circulation furnace of 45 kW. A load is 40 castings, 267.2 kg, in a steel basket of 60 kg. The foundry uses a mean specific heat of 0.96 kJ/(kg·K) for both over the range, a heating efficiency of 55%, a standing loss of 4 kW at 540 °C and a soak of 6 hours.

```figure
type: compare
title: GB-12 solution and ageing loads in the furnace load plan tool
cols: Heat into the load, kWh | Heat-up time, h | Cycle, h | Energy per load, kWh | Cost per load | Cost per kg of castings
rowhead: Step
- * Solution treatment, 20 to 540 °C, 6 h soak, 4 kW loss | 45.4 | 1.83 | 7.83 | 106.5 | A$31.95 | A$0.12
- Ageing, 20 to 155 °C, 5 h soak, 3 kW loss | 11.8 | 0.48 | 5.48 | 36.4 | A$10.93 | A$0.04
caption: This is an illustration. 267.2 kg of castings and 60 kg of basket, c = 0.96 kJ/(kg·K), 45 kW at 55%, A$0.30 per kWh including GST. The basket takes 18% of the heat in both steps.
```

Two figures are worth noticing. The soak, not the heat-up, dominates the solution cycle: 6 hours of soaking against under 2 of heating, so the furnace's standing loss over the soak, 24 kWh, is a large part of the energy per load. And the basket, at 18% of the heated mass, takes 18% of the heating energy; a lighter basket or a larger load per basket is a direct saving.

The cycle time limits throughput: at nearly 8 hours per solution load of 40 castings, one furnace treats about 40 castings per shift, two-thirds of the 60 the foundry pours. The foundry runs its solution furnace on two shifts, and ages in a separate, cheaper oven.

### The time the clock starts

The soak time is measured from when the castings, not the furnace, reach the solution temperature. A load of thick castings heats more slowly than the furnace's air, and the castings' centres lag their surfaces. The foundry proved GB-12's cycle with a thermocouple drilled into the boss of a casting at the centre of a full basket, and found the boss reached 535 °C about 25 minutes after the furnace's air did. The heat-up time from the tool is an energy estimate; the time the soak starts comes from that survey. How loads heat through, and how to survey them with thermocouples, is covered in detail in [Thermocouples, surveys and proving the cycle](/reados/publications/heating-and-cooling-times-by-the-numbers/measuring-and-proving-the-cycle/).

### Tempers other than T6

T6 is not the only option. A casting can be artificially aged straight from the mould without solution treatment, a T5 temper, which gives a smaller increase in strength but avoids the solution furnace, the quench and their distortion. It can be solution treated and quenched and then left to age naturally at room temperature, a T4 temper, softer but more ductile. Or it can be solution treated and over-aged deliberately for stability at elevated temperature. Each temper is a different balance of strength, ductility, dimensional stability and cost, and the choice belongs in the casting specification, agreed between the designer and the foundry before the job is quoted. GB-12's customer needs the strength and hardness of T6 for the bearing boss, and pays for the solution furnace's energy and cycle to get it.

### Distortion and straightening

A casting is weakest at the solution temperature and most heavily stressed in the quench, so both steps can distort it. Long, thin castings sag in the furnace if supported badly, and thin walls quenched faster than thick bosses pull the casting out of shape. GB-12's baskets support each cover on its machined joint face, flat on a grid, and the castings enter the quench joint face down so that the walls and boss cool as evenly as possible. Covers that distort beyond the machining allowance can sometimes be straightened in a press between quenching and ageing, while the alloy is still soft, but the foundry treats any straightening as a deviation to be recorded and minimised, not a routine step.

### Safety at the quench

A basket of castings at 540 °C weighing a third of a tonne, lowered quickly into hot water, is a serious hazard. Steam erupts as the load enters, the basket's crane and rigging must be rated for the load and the heat, and nobody may stand where the steam or spray can reach them. The foundry's procedure fixes the crane path, keeps the area clear, and requires face and body protection for the operator, as its risk assessment under the model WHS laws requires.

## The quench

When a solution-treated load leaves the furnace, it must be in the quench within a few seconds: aluminium alloys begin to lose their supersaturation quickly as they cool in air, and the foundry's procedure sets a short, timed maximum transfer delay. The load drops into a tank of water held at about 65 °C. Hot water quenches more gently than cold, which reduces distortion and residual stress in a casting with walls and a boss of very different thickness, while still cooling fast enough for full hardening in GB-12's sections.

The quench water absorbs the load's heat. A tank too small for its loads warms up with each one, and as the water gets hotter the quench gets slower and gentler, until the castings no longer harden fully. The KEVOS® [Quench tank temperature check](/tools/quench-tank-temperature-check/) tool works out the heat balance. From the load's mass, mean specific heat and temperature, the quenchant's volume, density, specific heat and starting temperature, and its highest allowed temperature, it gives the bath's temperature after one load, the rise per load, the heat released, the number of loads in a row before the bath passes its limit with no cooling, and the average heat input at your loads per hour against the cooler's capacity. It assumes a well-mixed bath with no losses.

```figure
type: steps
title: GB-12's quench in the quench tank tool
caption: This is an illustration. Load 327.2 kg (castings and basket) at 540 °C with a mean specific heat of 960 J/(kg·K); 3,000 L of water at 65 °C, highest allowed 80 °C; one load an hour; cooler 45 kW.
- Heat capacity of the load | 327.2 × 960 = 314 kJ/K
- Heat capacity of the water | 3,000 × 4,180 = 12,540 kJ/K
- * Bath temperature after the load | 76.6 °C, a rise of 11.6 K, within 80 °C
- Heat released per load | 145.6 MJ
- Loads in a row before passing 80 °C with no cooling | 1
- Average heat input at one load an hour | 40.4 kW, within the 45 kW cooler
```

The tank is adequate, but only just, and only because it is cooled between loads. One load takes it from 65 °C to 76.6 °C; a second load before the cooler had brought it back down would take it past 80 °C. The foundry's procedure therefore requires the bath to be back at 65 °C, read from its thermometer and recorded, before each load is quenched.

## The error: a tank too small for the load

This is an illustration. Before GB-12, the foundry's solution furnace had quenched smaller loads into a 2,000 L tank. When GB-12's loads of 40 castings started, the same tank was used.

The castings came out of ageing with hardness readings spread from the top of the specification to below its minimum, and the low readings came from castings at the top of the basket, the last to be submerged and the ones surrounded by the hottest water. The quench tank check showed why.

```figure
type: compare
title: GB-12's 327.2 kg load in two quench tanks
cols: Water volume, L | Bath after one load, °C | Rise per load, K | Within the 80 °C limit?
rowhead: Tank
- Old tank | 2,000 | 82.2 | 17.2 | no: one load overheats the bath
- * New tank | 3,000 | 76.6 | 11.6 | yes, if cooled back to 65 °C between loads
caption: This is an illustration. From the quench tank tool, water at 65 °C, load at 540 °C. The average figure hides worse local heating: water near the top of a basket can be far hotter than the mixed bath during the quench.
```

The mixed bath reaching 82 °C was only part of the problem. During the quench itself, the water inside and just above the basket boils locally and is much hotter than the average, and castings at the top of a crowded basket quench most slowly of all. With too little water, the slowest castings missed the quench rate they needed and lost some of their hardening.

The foundry installed the 3,000 L tank with a pump to agitate the water during each quench, spaced the castings in the basket so water could flow between them, and added a bath thermometer reading to the load record. The hardness spread closed up within the specification on the next ten loads (Chapter 10).

## Records and proving the cycle

Heat treatment is a special process: its result cannot be fully seen by looking at the part afterwards, so it must be controlled while it happens. GB-12's foundry keeps, for every load, the furnace's chart record of temperature against time, the load's contents and position in the furnace, the transfer time to the quench, the bath temperature before and after, and the ageing record. Its furnace's temperature uniformity is surveyed periodically with thermocouples spread through an empty and a loaded furnace, and its controlling thermocouple is calibrated. Customers in demanding industries specify these surveys and records in detail; even where they do not, they are what allow a foundry to show that a soft casting was or was not caused by its heat treatment.

## Exercise: a heavier load

This is an illustration. To raise throughput, the foundry considers 60 castings per load, 400.8 kg, in a heavier basket of 80 kg, in the same furnace and tanks.

1. Using the furnace load plan with the same settings, what are the heat into the load, the heat-up time and the energy per solution load? (Use c = 0.96 kJ/(kg·K), 45 kW at 55%, 4 kW loss, 6 h soak.)
2. What is the cost per kilogram of castings, compared with the 40-casting load?
3. Would the 3,000 L tank, starting at 65 °C, keep the bath within 80 °C for this load, at 960 J/(kg·K)?

**Worked answer.**

1. Mass 480.8 kg. Heat 480.8 × 0.96 × 520 ÷ 3,600 = **66.7 kWh**; heat-up 66.7 ÷ (45 × 0.55) = **2.69 h**; energy 66.7 ÷ 0.55 + 4 × 6 = **145.2 kWh**.
2. Cost 145.2 × 0.30 = A$43.56; per kg of castings 43.56 ÷ 400.8 = **A$0.109**, about 10% cheaper per kilogram than the 40-casting load at A$0.120, because the standing loss is shared over more castings.
3. Load heat capacity 480.8 × 960 = 461.6 kJ/K; mixed temperature (461.6 × 540 + 12,540 × 65) ÷ (461.6 + 12,540) = **81.9 °C**: **no**, one load overheats the bath. The larger load needs a larger tank or colder starting water, and the agitation and spacing that the smaller load already needed.
