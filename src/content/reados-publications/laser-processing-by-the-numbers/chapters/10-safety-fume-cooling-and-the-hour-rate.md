---
book: laser-processing-by-the-numbers
chapterSlug: safety-fume-cooling-and-the-hour-rate
order: 10
title: "Safety, fume, cooling and the hour rate"
description: "Laser classes and guarding, fume extraction duct checks, chiller duty in hot weather, the machine hour rate of a laser cutter, quoting on full machine time, and the cell's process record."
draft: false
---

The parts of a laser cell that do not touch the beam path decide whether it runs safely, through an Australian summer, at a price that pays for it. Guarding keeps a Class 4 beam inside the machine. Extraction carries away fume containing chromium and nickel from the stainless steel. A chiller removes about twice the laser's output power as heat. And the hour rate turns the machine's capital, power, gas, maintenance and operator into the number every quote depends on.

This chapter works through each for the LC-4 with WORKOS tools: the extraction duct, the chiller on a hot afternoon, the machine hour rate and a quote check. It ends with the process record that ties the book's checks together.

## Laser classes and guarding

Lasers are classified by the hazard their accessible emission presents. IEC 60825-1, adopted in Australia and New Zealand as AS/NZS IEC 60825.1, covers the safety of laser products: their classification from Class 1, safe under reasonably foreseeable conditions, through Classes 1M, 2, 2M, 3R and 3B to Class 4, whose direct and diffusely reflected beams can injure the eyes and skin and can start fires. Every laser in the cell is a Class 4 laser source. The safety of laser processing machines themselves is the subject of ISO 11553-1.

In normal use, the cell's machines are Class 1 products: the source is Class 4, but the enclosure, its filtered viewing windows and its interlocks keep any hazardous emission inside. The enclosure matters more than it might seem. Chapter 1 showed that about 1 kW of the LC-4's beam is reflected out of the kerf when cutting stainless steel, and much more when piercing reflective metals. That light strikes the inside of the enclosure, which must withstand it, and the viewing windows, which must block the wavelength. A window rated for the CO₂ laser's 10.6 µm may be transparent at the fibre laser's 1.07 µm, which is why windows, eyewear and curtains are specified for a particular wavelength and must never be swapped between machines.

```figure
type: checklist
title: The cell's laser safety controls
caption: This is an illustration. The controls follow the machine makers' instructions and the cell's documented risk assessment; Safe Work Australia's model Code of Practice on plant sets out the general duty to manage the risks of plant.
- x Class 1 enclosures with interlocked doors; interlocks tested weekly and recorded
- x Viewing windows and any eyewear specified for each machine's wavelength, never interchanged
- x Service work with the enclosure open only under the maker's procedure, in a controlled area, by trained people
- x Back-reflection monitoring left active; alarms investigated, not reset and retried
- x Fire controls: no combustible scrap left in the machine; extinguisher suited to metal fires at the cell
- x Fume extraction running whenever a machine runs; filters changed on schedule
```

## Fume extraction

Laser cutting turns the kerf metal partly into fume: fine particles of metal oxide. Stainless steel fume contains chromium and nickel compounds, including hexavalent chromium, for which Safe Work Australia's workplace exposure standards set very low limits. The LC-4's cutting table is divided into zones, and the extraction draws air down through the zone under the head, through a 250 mm duct 18 m long, to a cartridge filter unit.

The duct must be sized for two things. The air must move fast enough to keep the particles airborne, or they settle in the duct, where fine metal dust is a fire risk and a slowly growing restriction. And the fan must be able to overcome the resistance of the duct, fittings, filter and hood at the design flow. The [extraction duct check tool](/tools/extraction-duct-check/) checks both.

```figure
type: steps
title: The LC-4's extraction duct in the extraction duct check tool
caption: This is an illustration. One active zone of 3,000 m³/h, 250 mm duct 18 m long, roughness 0.15 mm, fittings loss coefficient 3.5, air at 1.2 kg/m³ and 15 cSt, least transport velocity 12 m/s from the extraction maker for this fume, hood entry loss 400 Pa, fan pressure available at this flow 2,200 Pa.
- Total airflow | 3,000 m³/h
- Duct velocity | 17.0 m/s against 12 m/s: pass
- Reynolds number / friction factor | 282,942 / 0.0188
- Duct pressure loss | 840 Pa
- * Fan pressure needed | 1,240 Pa against 2,200 Pa: EXTRACTION ADEQUATE
```

### The mistake that was avoided: a bigger duct

When the cell moved the filter unit to make room for the W-2 welding cell, the duct run grew and a contractor proposed replacing the 250 mm duct with 300 mm "to cut the resistance". The resistance would indeed fall, to a fan pressure need of 785 Pa. But the tool showed the cost: at 3,000 m³/h in a 300 mm duct, the velocity falls to 11.8 m/s, below the 12 m/s the maker requires, and the tool reports DUCT VELOCITY TOO LOW. Dust would settle along the run. The cell kept the 250 mm duct, whose fan margin was already ample, and the check went on file with the change. A larger duct is the right answer to a fan that cannot reach its flow; it is the wrong answer to a duct that is merely long.

### Checking that extraction works

A duct calculation shows that the extraction can work; only measurement shows that it does. When the LC-4 was commissioned, the cell had an occupational hygienist sample the air in the operator's breathing zone over full shifts of stainless steel cutting and compare the results with the exposure standards for the metals in the fume. The sampling is repeated when the cell changes its mix of work, its extraction or its layout, and the airflow at each table zone is measured each year against its commissioning value. A falling airflow usually means a loaded filter or a blocked duct, and it is found long before anyone can see fume escaping.

### Fire in the machine

Fires are the commonest serious incident in laser cutting machines, and they rarely start where the beam is cutting. They start in what collects under it: slag and fine particles in the table's collection trays, small offcuts that fall between the slats, protective plastic film peeled from stainless sheet and left on the table, and, worst of all, fine aluminium and magnesium-bearing dust, which burns fiercely and reacts with water. The LC-4's trays are emptied each shift and its slats cleaned weekly. Aluminium and steel cutting dust are collected separately, because mixed iron oxide and fine aluminium can react violently once ignited. The extraction duct's velocity check above is part of fire prevention as much as fume control, because dust that settles in a duct is fuel that nobody sees.

## Cooling: the chiller on a hot day

Chapter 1 traced 8.5 kW of the LC-4's 12.5 kW electrical input into heat inside the source. With the cutting head's optics and the beam-delivery fibre, the cooling water carries away about 8.8 kW. The water circuit runs at about 22 °C, and the chiller rejects the heat to the outside air through an air-cooled condenser. Its maker rates it at 9.0 kW of cooling for 3.2 kW of electrical input at an outside air temperature of 40 °C.

The [heat pump and chiller COP check tool](/tools/heat-pump-cop-check/) checks a chiller's claimed performance against the reversed Carnot limit at the refrigerant temperatures implied by the water and air temperatures and the approach temperatures entered. With the water at 22 °C and a 5 K evaporator approach, the refrigerant evaporates at 17 °C; with 40 °C air and a 10 K condenser approach, it condenses at 50 °C. The Carnot COP for cooling is then 8.79, the claimed COP 9.0 ÷ 3.2 = 2.81, and the second-law efficiency 32%, against the 25% the cell takes as a reasonable minimum for a small chiller. The claim is plausible, and running 3,000 hours a year at A$0.28 a kilowatt-hour, the chiller's electricity costs about A$2,688 a year, excluding GST.

### The mistake: afternoon shutdowns

In the first January after installation, the LC-4 stopped three afternoons running with a cooling alarm. The chiller had been placed in a corner of the yard against two walls, where its own warm discharge air recirculated into its condenser. On a 38 °C day, the air entering the condenser was about 45 °C.

At 45 °C, the condensing temperature rises to 55 °C, and the Carnot COP falls from 8.79 to 7.64. The chiller's measured performance that afternoon was 7.6 kW of cooling for 3.4 kW of input. Entered in the tool, that gave an actual COP of 2.24 and a second-law efficiency of 29.3%, still plausible: the chiller was not faulty. It simply could not deliver 8.8 kW of cooling with its condenser in 45 °C air.

```figure
type: compare
title: The LC-4's chiller at two condenser air temperatures, in the COP check tool
cols: Condensing temperature | Carnot COP | Cooling delivered | Input | Actual COP | Against the 8.8 kW load
rowhead: Air entering the condenser
- 40 °C, rating condition | 50 °C | 8.79 | 9.0 kW | 3.2 kW | 2.81 | Enough
- * 45 °C, recirculating corner | 55 °C | 7.64 | 7.6 kW | 3.4 kW | 2.24 | 1.2 kW short: alarm
caption: This is an illustration. Evaporating at 17 °C in both cases. A chiller's capacity falls as its condenser air gets hotter, and its input power rises.
```

The chiller was moved clear of the walls, under a shade roof that leaves its fans' discharge free, and its condenser coil was cleaned. The cell now specifies chillers by their capacity at the highest air temperature the site will see at the condenser, not at a rating condition, and checks the air temperature at the condenser on the hottest days of the first summer.

## The machine hour rate

Every quote in Chapter 6 used a rate of A$180 an hour for the LC-4. The [machine hour rate tool](/tools/machine-hour-rate/) builds the direct cost from the machine's capital and running costs over its productive hours.

```figure
type: compare
title: The LC-4's hour rate in the machine hour rate tool
cols: Basis | A$ per hour, excluding GST
rowhead: Item
- Capital recovery | A$620,000 installed, A$80,000 resale after 8 years, 9% interest: A$104,764 a year over 3,200 productive hours | 32.74
- Floor space | A$14,000 a year | 4.38
- Maintenance | A$24,000 a year, including the annual service and beam measurement | 7.50
- Power | 22 kW average for laser, chiller, extraction and drives at A$0.28/kWh | 6.16
- Consumables | Nozzles, windows, ceramics, oxygen and filters | 38.00
- Machine rate | Sum of the above | 88.77
- Operator | Fully loaded | 72.00
- * Machine and operator | The tool's total | 160.77
- Nitrogen | Bulk at A$12 a gas-on hour for 2,000 of the 3,200 hours (Chapter 7) | 7.50
- Overheads and margin for idle time | The balance of the quoted rate | 11.73
caption: This is an illustration. The quoted A$180 an hour is the tool's A$160.77 plus nitrogen and a share of general overheads that the tool deliberately excludes.
```

The tool's own check is the most important line in its output: base the productive hours on measured utilisation, not shift length. The LC-4 is available for about 3,800 hours a year on two shifts, but loading, programming, maintenance and waiting for work leave 3,200 productive hours. If it achieved only 2,400, the capital, space and maintenance per hour would rise by a third: the tool's machine-and-operator rate would rise from A$161 to A$176, and the quoted rate to about A$195.

### What the hour rate says about energy and automation

Two lines in the table are smaller than people expect. Electricity for the whole cell, laser, chiller, extraction and drives, is A$6.16 an hour: on a door with 12.1 s of beam time it is about two cents. The laser's efficiency matters for the site's demand charges and its chiller size, but hardly at all for the price of a part. Capital and labour, by contrast, are A$104.74 an hour together, two-thirds of the machine-and-operator rate. Anything that raises productive hours or reduces the operator's time per part moves the rate far more than any saving in power. That is why the case for automatic loading and part sorting, which the cell is now considering, rests on recovering the twenty seconds of loading per door found in Chapter 6 and on running unattended through breaks, not on any change in the cutting itself.

## Competence and supervision

None of the controls in this chapter works without people who understand them. The cell's operators are trained by the machine makers in each machine's safe operation and its daily checks. One person on each shift is responsible for the process record and knows how to run the power, focus and star tests. Service work that needs the enclosure open or the interlocks defeated is done only by the makers' engineers or by staff trained to their procedure, and the laser's beam path is never opened while the source can be energised. New starters work alongside an experienced operator until they have run each check under supervision and signed the record themselves. The training record sits alongside the process record, because a check done by someone who does not understand its purpose is the kind that drifts.

## Quoting on the full machine time

The [machine rate quote check tool](/tools/machine-rate-quote-check/) combines the hour rate with a job's set-up, cycle time, quantity and material to find the cost per part, the margin at a quoted price and the least price for a target margin. The cabinet door blanks were quoted at A$68 each for 120.

```figure
type: compare
title: The door blank quote in the machine rate quote check tool, 120 doors at A$68, 0.5 h set-up
cols: Cycle per door | Job hours | Cost per door | Margin at A$68 | Least price for 15%
rowhead: Cycle time used
- Beam time only, 12.1 s | 0.2017 min | 0.90 h | A$52.88 | 22.2% | A$62.21
- * Beam time plus loading, 32.1 s | 0.535 min | 1.57 h | A$53.77 | 20.9% | A$63.26
caption: This is an illustration. Material A$51.67 a door from Chapter 6's nesting check; machine and operator at the tool's A$160.77 an hour. Both cycles pass the 15% target, but the beam-time-only figure overstates the margin and understates the hours by 0.67 h.
```

The quote survives either way, because material dominates the door's cost. But the beam-time-only figure would book 0.90 machine hours for a job that takes 1.57, and on a machine-hour-dominated job, such as thick plate with little material, that difference would be the margin. The cell's quote check now uses beam time plus the loading share per part from Chapter 6.

## The cell's process record

Every check in this book leaves a number, and the numbers are only useful if they are recorded where the next person can find them.

```figure
type: checklist
title: What the laser cell records, and how often
caption: This is an illustration. The record is kept per machine, with the parameter tables and programs it refers to.
- x Protective window inspection, each shift (Chapter 1)
- x Power at the work with the power puck, weekly (Chapter 1)
- x Focus test and nozzle centring after any crash or optics change (Chapter 4)
- x Star test after beam path work, and quarterly on the CO₂ machine (Chapter 3)
- x Kerf width for each new material, thickness or gas (Chapter 6)
- x Hardness traverse for new hardenable steels with tapped or bent edges (Chapter 5)
- x Gas purity and head pressure after supply changes (Chapter 7)
- x Weld procedure evidence and weekly W-2 power checks (Chapter 8)
- x Code verifier grade, first door and one in fifty (Chapter 9)
- x Interlock tests weekly, extraction and chiller checks each summer (Chapter 10)
```

## Exercise: a smaller chiller

A supplier offers a cheaper chiller for the W-2 welding cell, rated at 4.0 kW of cooling for 1.6 kW of input with 40 °C air, and the cell expects about 3.6 kW of heat from the W-2's source and head. In the cell's yard, the condenser air can reach 45 °C. The supplier's data give 3.4 kW of cooling for 1.75 kW of input at 45 °C. With water at 22 °C and the same approach temperatures as the LC-4's chiller, use the COP check tool's method to find the Carnot COP and second-law efficiency at 45 °C. Is the claim plausible, and is the chiller big enough?

### Answer

The refrigerant evaporates at 22 − 5 = 17 °C, or 290.15 K, and condenses at 45 + 10 = 55 °C, or 328.15 K. The Carnot COP for cooling is 290.15 ÷ (328.15 − 290.15) = 7.64. The claimed COP at 45 °C is 3.4 ÷ 1.75 = 1.94, a second-law efficiency of 1.94 ÷ 7.64 = 25.4%, just above the cell's 25% benchmark. The claim is plausible.

The chiller is not big enough. At 45 °C it delivers 3.4 kW against a heat load of 3.6 kW, 0.2 kW short, and the W-2 would stop on hot afternoons as the LC-4 did. The cell should ask for the next size up, rated by its capacity at 45 °C, or site the chiller so that its condenser never sees air hotter than its rating.
