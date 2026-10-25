---
book: pipe-welding-by-the-numbers
chapterSlug: preheat-heat-treatment-and-alloy-pipe
order: 8
title: "Preheat, heat treatment and alloy pipe"
description: "Judge when pipe needs preheat from carbon equivalent and wall, estimate the energy to heat a band, plan post-weld heat treatment with thermocouples and records, and weld chromium-molybdenum pipe."
draft: false
---

Carbon steel pipe of ordinary wall thickness is usually welded at room temperature, as long as it is dry. Thicker walls, higher-strength steels and the chromium-molybdenum steels used for hot steam lines are different: welded cold, they can crack, sometimes hours after the weld is finished, beneath a cap that looks perfect. Preheating the joint before welding, keeping it hot between passes, and in some cases heat treating it after welding, prevents those cracks and restores the toughness and softness the steel needs in service. Each of those steps costs time, equipment and energy, and each has to be recorded, because a weld that missed its preheat looks the same as one that did not.

This chapter explains why some pipe needs preheat, uses the carbon equivalent to judge a steel's sensitivity, estimates the energy to heat a band round a joint, describes post-weld heat treatment and how it is controlled, and covers the welding of chromium-molybdenum steam pipe. Weldability by the Numbers covers the metallurgy behind it in more depth.

## Why preheat

The heat-affected zone beside a weld is heated nearly to melting and then cooled quickly by the cold pipe around it. In steels with enough carbon and alloy, fast cooling forms hard, brittle martensite. If hydrogen is present, from moisture in the electrode coating, the flux, the air or the joint, it diffuses into the hard zone, and with the shrinkage stress of the weld it can crack it. That is hydrogen cracking, also called cold cracking, because it happens after the weld has cooled, often hours later.

Three things together cause it: a hard microstructure, hydrogen and stress. Preheat attacks two of them. By warming the pipe around the joint, it slows the cooling so that less martensite forms, and it keeps the joint warm long enough for much of the hydrogen to diffuse out. Low-hydrogen consumables, kept dry, attack the third.

## Carbon equivalent

How hardenable a steel is depends on its carbon and alloy content, which are combined into a single number, the carbon equivalent. One widely used form adds the carbon content to fractions of the manganese, chromium, molybdenum, vanadium, nickel and copper contents, each weighted by its effect on hardenability.

```figure
type: formula
title: Carbon equivalent of three pipe steels
formula: CE = C + Mn ÷ 6 + (Cr + Mo + V) ÷ 5 + (Ni + Cu) ÷ 15
caption: This is an illustration with typical compositions for teaching, in percent by mass. The mill certificate gives the real composition for each heat of pipe, and the welding procedure, not the carbon equivalent alone, sets the preheat.
- Carbon steel pipe | about 0.20 C, 1.0 Mn
- 1¼ chromium ½ molybdenum pipe | about 0.12 C, 0.45 Mn, 1.25 Cr, 0.5 Mo
- 2¼ chromium 1 molybdenum pipe | about 0.12 C, 0.45 Mn, 2.25 Cr, 1.0 Mo
step: carbon steel: 0.20 + 1.0 ÷ 6 ≈ 0.37
step: 1¼Cr-½Mo: 0.12 + 0.45 ÷ 6 + (1.25 + 0.5) ÷ 5 ≈ 0.54
step: 2¼Cr-1Mo: 0.12 + 0.45 ÷ 6 + (2.25 + 1.0) ÷ 5 ≈ 0.84
```

The higher the carbon equivalent, the more readily the steel hardens and the more preheat it needs. Ordinary carbon steel pipe of modest wall often needs none beyond drying and warming in cold weather; the chromium-molybdenum steels need substantial preheat at any thickness. The same carbon equivalent needs more preheat on a thicker wall, because the thicker pipe draws heat away from the weld faster, and more under high restraint or with higher-hydrogen consumables. Methods that combine all those factors are set out in the standards and in the welding procedure; the procedure qualification record proves the preheat that was actually tested.

## Heating the band

Preheat is applied to a band of the pipe on each side of the joint, wide enough that the weld zone stays at temperature through the thickness, and it is checked on the side away from the heat source where possible, so that the reading is of the pipe, not the flame or element.

```figure
type: formula
title: Heat stored in a preheated band of DN 200 Schedule 80 pipe
formula: heat = mass of band × specific heat × temperature rise
caption: This is an illustration for a 219.1 mm pipe with a 12.7 mm wall, heated over a band 75 mm each side of the joint from 20 °C to 150 °C, with a specific heat of about 0.48 kJ/(kg·°C). The heat conducted along the pipe and lost from its surface is far more than the heat stored in the band.
- Band | 150 mm wide in total
- Mass of band | π × (219.1 − 12.7) × 12.7 × 150 mm³ at 7.85 g/cm³ ≈ 9.7 kg
step: heat stored ≈ 9.7 × 0.48 × 130 ≈ 605 kJ, about 0.17 kWh
step: in practice, heat flows along the pipe and out from its surface, so the heater supplies several times that
step: a resistance heater of several kilowatts takes perhaps half an hour to bring the band to temperature and must keep running while welding continues
```

The stored heat is small; what makes preheat slow is that the pipe keeps conducting the heat away from the band and losing it from its surface, and the band must be held at temperature for as long as the welding lasts. Insulating blankets over the heater and around the band cut the losses greatly. Gas torches are quick and portable for small joints, but heat unevenly and are hard to control; electrical resistance heating pads wrapped round the pipe, or induction coils, controlled by thermocouples, give even, recorded heating and are the norm for alloy pipe and heat treatment. Industrial Electric Heating by the Numbers covers the electrical side of resistance heating.

## Interpass and holding

Once preheated, the joint must not be allowed to cool below the preheat temperature between passes, and must not exceed the procedure's maximum interpass temperature. On many alloy steel procedures, the joint is also held at or above the preheat for a time after welding, or raised to a higher temperature for a short soak, to let hydrogen diffuse out before the weld cools. If welding must stop part-way, for the end of a shift or a change of crew, the procedure says what to do: keep the heat on, or complete a minimum number of passes, cover the joint and cool it slowly under insulation, then reheat before welding resumes.

## Post-weld heat treatment

Some joints are heat treated after welding, by heating the whole circumference of the weld and a band each side to a temperature well below the steel's transformation range, holding it there, and cooling it slowly. Post-weld heat treatment tempers the hard heat-affected zone, reducing its hardness and restoring toughness, and relieves much of the residual stress left by the weld's shrinkage. For chromium-molybdenum steels it is essential; for thick carbon steel and some services, such as lines carrying fluids that cause stress corrosion cracking, codes require it above certain thicknesses or for certain fluids.

```figure
type: timeline
title: The stages of a post-weld heat treatment cycle
caption: This is an illustration of the stages only. Heating rates, soak temperature and time, and cooling rates come from the piping code and the welding procedure for the material and thickness, and are not given here.
- Insulate and fit thermocouples | heaters wrapped round the joint; thermocouples attached at the positions the procedure sets
- Controlled heating | temperature raised at no more than the permitted rate, so that thick sections heat evenly
- *Soak | held at the specified temperature for the time the thickness requires
- Controlled cooling | lowered at no more than the permitted rate to a stated temperature
- Free cooling | insulation left on or removed as the procedure allows
- Check | chart reviewed against the procedure; hardness tested if required
```

Every stage is controlled and recorded, by a programmable controller driving the heaters from the thermocouple readings and a recorder printing or logging the temperature of each thermocouple against time. The chart is the evidence that the joint was treated, and the code's examination requirements may include a hardness test on the weld and heat-affected zone afterwards to confirm that the treatment worked.

## Thermocouples

Thermocouples measure the temperature that matters only if they are attached where the procedure says, firmly, to the pipe surface, and shielded from the heater's direct radiation. A thermocouple that falls off, or reads the heater instead of the pipe, can show a perfect chart for a joint that was underheated or overheated. Thermocouples are usually attached by capacitor discharge welding of their wires to the pipe, which makes a reliable contact without damaging the surface. Their number and positions round the joint depend on the pipe size and orientation, because the top of a horizontal pipe runs hotter than the bottom in a heat treatment, and the procedure states them.

## Supporting the pipe during heat treatment

A pipe heated for post-weld heat treatment is much weaker at the soak temperature than when cold, and its own weight, the weight of valves and the forces from the rest of the line can bend it at the hot band. Long overhanging runs sag; restrained runs, unable to expand, push against their anchors and bend elsewhere. Before a joint is heat treated, the line is supported close to the band on both sides, and any restraint that would stop it growing is freed. The heat treatment technician and the piping supervisor check the supports together before the heaters are switched on, because a joint that was heat treated perfectly but left the line bent is still a joint to be cut out.

## Hardness after treatment

A hardness test on the weld and heat-affected zone after heat treatment is the simplest check that the treatment did its work. Portable hardness testers, used on a small area ground smooth on the cap and beside it, give a reading in a few seconds. A reading above the limit the procedure or code sets suggests the soak was too short or too cool, the thermocouples misread, or the wrong consumable was used, and the joint is investigated and usually treated again. The readings are recorded with the chart. Testing Welded Joints by the Numbers covers hardness testing and its uncertainty.

## Records that prove the heat

Preheat leaves no mark on the finished weld, so its record is the only evidence. For joints with resistance heating, the controller's log shows the temperature before and during welding; for joints preheated by torch, the welder records the temperature measured before the root and between passes, with the time and the instrument used. The contractor's weld log has a column for preheat and interpass readings on every joint whose procedure requires them, and a joint with a blank in that column is treated as not yet accepted.

## Chromium-molybdenum steam pipe

High-temperature steam lines, for boilers and turbines, use chromium-molybdenum steels because they resist creep, the slow stretching of metal under stress at high temperature, far better than carbon steel. They are among the most demanding pipe steels to weld: they need preheat at every thickness, matching chromium-molybdenum consumables, careful control of hydrogen, often a hold after welding, and post-weld heat treatment. Their consumables and pipe must be identified with certainty, because a carbon steel electrode in a chromium-molybdenum joint gives a weld that creeps and fails at service temperature, while looking perfectly sound when made. Many contractors check the composition of every length and fitting of alloy pipe, and sometimes of the deposited weld metal, with a portable analyser before and after welding, a practice called positive material identification.

## Cold weather and moisture

Even ordinary carbon steel that needs no preheat should not be welded wet or very cold. Moisture on the joint becomes hydrogen in the weld; frost and condensation on cold pipe are invisible until the arc boils them. Procedures commonly require the joint to be warmed to dry it and bring it above a stated minimum temperature in cold weather, which a gas torch or heater does quickly. In the running case's region, frosty winter mornings on the water main site meant warming every joint before the root, an extra few minutes per joint that the crew built into its rhythm.

## The cost of heat

Preheat and heat treatment add time, equipment and energy to every joint that needs them. A joint with resistance preheat and post-weld heat treatment can take several times as long, from start to finished chart, as the same joint in carbon steel without them, much of it waiting for the cycle to run. The equipment, heaters, controllers, recorders and insulation, is hired or owned and operated by trained technicians. The contractor's estimate prices heat treatment per joint by size, separately from welding, and plans the work so that several joints are heat treated together from one controller, which cuts the cost per joint considerably.

## The running case: the boiler connections

This is an illustration. Most of the dairy's steam piping was carbon steel of modest wall that needed only drying and warming. The connections to the new boiler, however, included a short run of chromium-molybdenum pipe specified by the boiler maker. The contractor engaged a heat treatment specialist, qualified a procedure with resistance preheat, a post-weld hold and full post-weld heat treatment, used matching consumables held in an oven, and checked the composition of every component and weld with a portable analyser. Each of the twelve joints had its heat treatment chart and hardness readings filed with the weld log, and the boiler maker's inspector accepted the records at the handover.

## A failure: the cracked branch

This is an illustration. At another plant, a welder repairing a leaking branch on an old chromium-molybdenum steam line, during a rushed weekend shutdown, made the weld without preheat because the heating equipment had not arrived, intending to heat treat it afterwards. The next morning, before the heat treatment, a crack was found running along the heat-affected zone beside the cap.

The steel had hardened in the cold heat-affected zone, and hydrogen and the weld's stress had cracked it within hours. The weld was cut out, and the joint rewelded with preheat, hold and heat treatment, adding a day to the shutdown. Waiting for the heater would have cost less time than the repair.

## Exercise: preheat energy and time

A DN 150 Schedule 80 joint, 168.3 mm outside with a 10.97 mm wall, is to be preheated to 150 °C from 15 °C over a band 60 mm each side of the joint. Estimate the mass of the band and the heat stored in it. If losses mean the heater must supply about five times the stored heat, how long would a 4 kW heater take?

The band is 120 mm wide in total, so its mass is about π × (168.3 − 10.97) × 10.97 × 120 mm³ × 7.85 × 10⁻⁶ kg/mm³ ≈ **5.1 kg**. The stored heat is about 5.1 × 0.48 × 135 ≈ **330 kJ**, about 0.09 kWh.

With five times that supplied, about 1,650 kJ, a 4 kW heater would take about 1,650 ÷ 4 ≈ 410 seconds, roughly **7 minutes**, if it delivered all its power to the pipe. Real heating takes longer, because some of the heater's output goes into the insulation and the air, and the heater cycles on and off as the controller approaches the set temperature, so the contractor plans for about a quarter of an hour on joints of this size.
