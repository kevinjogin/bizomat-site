---
book: ductwork-by-the-numbers
chapterSlug: adding-up-the-fan-duty
order: 6
title: "Adding up the fan duty"
description: "Total the index path's friction, fittings and equipment into a fan duty, size the branches' balancing, estimate air and shaft power and running cost, and catch a fan chosen for a clean filter."
draft: false
---

A fan is specified by two numbers: the flow it must move and the pressure it must develop at that flow. The flow is the sum of the hoods' flows plus leakage. The pressure is the total loss along the system's hardest path, the index path, from the hood that needs most suction to the stack. Every chapter so far has produced pieces of that total; this one adds them, decides what margin to carry, and turns the result into power, energy and cost.

The running case totals EX-1's index path, updates the branches' balancing, estimates the fan's power and running cost, and finds that the first fan selection was made for the collector's clean-filter loss, leaving the system short as soon as the filters began to load.

## The index path, item by item

B1's path runs from its hood, along the whole main, through the collector and fan, and out of the stack. This is an illustration, using the losses of Chapters 2, 4 and 5 and an illustrative collector loss.

- **Hood B1**, acceleration and entry: 342 Pa.
- **B1 to N2**, 8 m of 140 mm duct: 277 Pa; the 0.5 m of flexible hose kept at the hood, as Chapter 4 decided, adds 24 Pa; two elbows: 137 Pa.
- **N2 to N3**, 6 m of 200 mm duct: 128 Pa.
- **N3 to the fan**, 10 m of 250 mm duct: 150 Pa; the mezzanine crossing adds 14 Pa of friction and 59 Pa in its transitions; two elbows: 121 Pa.
- **Collector**: the maker's stated loss at this flow with clean filters, **800 Pa** in this illustration.
- **Stack**, 6 m of 250 mm duct: 90 Pa; exit: 202 Pa.

The total is about **2,344 Pa**.

```figure
type: stack
title: EX-1's index path, by kind of loss
unit: Pa
caption: This is an illustration with clean filters. Fittings, including the hood and the stack exit, are the largest share; the collector is the largest single item.
- Straight duct and hose | 683.5
- Fittings, hood and exit | 860.5
- Collector, clean filters | 800
```

The split is typical of a compact extraction system: the duct itself is under a third of the total, the fittings rather more, and the collector, a single piece of equipment, about a third.

## The pressure along the path

Plotting the total pressure along the index path shows where the fan's work goes. The air starts at atmospheric pressure in the booth, falls below it as it enters the hood and travels the duct, falls most steeply through the collector, is lifted above atmospheric by the fan, and returns to atmospheric as it leaves the stack. Everything upstream of the fan is under suction; the short run from the fan to the stack top is under positive pressure.

```figure
type: line
title: Total pressure along EX-1's index path, clean filters
x: Point on the path
y: Total pressure relative to atmosphere, Pa
ymin: -2200
ymax: 400
caption: This is an illustration. The fan raises the total pressure by about 2,344 Pa, from about −2,052 Pa at its inlet to about +292 Pa at its outlet; the stack's friction and exit use the last 292 Pa.
- Booth | 0
- Hood | -342
- N2 | -780
- N3 | -908
- Collector in | -1252
- Fan in | -2052
- Fan out | 292
- Stack | 202
```

The plot also explains why leaks matter more on some parts of the system than others. Upstream of the fan, a leak draws air in, which wastes fan capacity and weakens the hoods. Downstream, a leak pushes exhaust out into the building, which is a hazard if the exhaust carries anything harmful. A fan placed close to the stack keeps the positive-pressure section short, which is one reason extraction fans are usually at the end of the system, after the collector, rather than at its start.

## The fan's flow

The fan must move the hoods' flow plus whatever leaks into the suction ductwork. Chapter 1 estimated 3% leakage in this illustration, so the fan's design flow is 0.90 × 1.03 = about **0.927 m³/s**, at the fan's inlet conditions. The leakage air passes through the fan and the collector, so it is part of their duty, but it does no useful work at any hood.

## Updating the branches' balance

Chapter 3 balanced B2 and B3 against B1's path as first calculated. Since then, the flexible hose at B1 has added 24 Pa to B1's path upstream of N2, which raises the suction needed at both junctions by the same amount. The mezzanine crossing is downstream of N3, on the shared part of every path, so it does not change the balance.

```figure
type: compare
title: Branch balancing, as first calculated and updated
cols: First calculation | Updated | Orifice plate to absorb
caption: This is an illustration. Any change upstream of a junction on the index path changes the balancing of every branch that joins below it.
- B2 at N2 | Shortfall 185 Pa | B1's path 780 Pa against 571 Pa | 209 Pa
- *B3 at N3 | Shortfall 313 Pa | Main 908 Pa against 571 Pa | 337 Pa
```

The orifice plates were resized from these figures before they were made. The lesson is that balancing figures are not finished until the index path is, and every change on it should prompt a recheck of the branches below it.

## The fan's duty and margin

The fan duty in this illustration is 0.927 m³/s at about 2,344 Pa with clean filters. Designers commonly add a margin, both to flow and to pressure, for uncertainty in the K values, for some build-up in the duct and for minor additions. The size of the margin is a design decision, and it should be written down with its reason. A margin added silently at each stage, a little on every K value, a little on the roughness, a little on the total, compounds into an oversized fan running throttled, which wastes energy for the life of the system.

This is an illustration. A single, stated margin of 10% on the dirty-filter pressure would make the fan's selection point 0.927 m³/s at about 3,348 Pa. With a variable-speed drive, the margin costs little in service, because the drive simply runs the fan slower until it is needed; without one, the system would be throttled with a damper to the right flow, and the fan would spend the margin as wasted pressure across the damper for as long as it ran.

## What a shortfall does to the hoods

A system's resistance rises roughly with the square of its flow, so a fan that delivers less pressure than the system needs gives a flow lower by the square root of the ratio. If EX-1's fan could develop only 2,744 Pa at the dirty-filter condition, 300 Pa short of the 3,044 Pa needed, the whole system's flow would fall to about √(2,744 ÷ 3,044) = 0.95 of design, about 5% low. That sounds modest, but it is spread unevenly: the balancing plates were sized for design flow, and the furthest hood usually loses most. A 5% shortfall at the fan can be a 10% shortfall at B1, enough to let fume escape a booth that was working at commissioning.

## The error: a fan chosen for clean filters

This is an illustration. The first fan selection for EX-1 used the collector's clean-filter loss of 800 Pa, the figure on the first line of its data sheet. Further down, the same sheet stated that the filters should be cleaned or replaced when their loss reached **1,500 Pa**, so in service the collector's loss would rise from 800 to 1,500 Pa between cleanings.

At the end of a cleaning cycle the system needs about 2,344 + 700 = **3,044 Pa**. A fan selected for 2,344 Pa would deliver progressively less air as the filters loaded, and the hoods, B1 first, would weaken week by week until the filters were cleaned. The design review caught it by reading the whole data sheet. The fix was to select the fan for the dirty-filter duty and to fit a variable-speed drive, so that the fan runs slower, using less power, while the filters are clean, and speeds up as they load to hold the flow.

```figure
type: bars
title: Fan pressure needed for EX-1, by filter condition
unit: Pa
max: 3200
caption: This is an illustration. The collector's loss rises from 800 Pa clean to 1,500 Pa at its cleaning point; the fan must meet the higher figure or the flow will fall between cleanings.
- *Clean filters | 2344
- Filters at their cleaning point | 3044
```

## Air power and shaft power

The power the fan delivers to the air is the flow times the pressure rise: **air power = Q × Δp**. The shaft power is the air power divided by the fan's efficiency.

```figure
type: formula
title: Fan air power and shaft power
formula: air power = Q × Δp;   shaft power = air power ÷ fan efficiency
caption: This is an illustration at 0.927 m³/s, with an illustrative fan total efficiency of 60%. Real efficiencies come from the selected fan's data at its operating point.
- Q | Flow through the fan, m³/s
- Δp | Total pressure rise across the fan, Pa
step: Clean filters: 0.927 × 2,344 = 2,173 W of air power; ÷ 0.60 = 3.62 kW at the shaft
step: Dirty filters: 0.927 × 3,044 = 2,822 W; ÷ 0.60 = 4.70 kW at the shaft
```

The motor must be rated for the highest shaft power the fan will need, with the margin the fan maker recommends; in this illustration the dirty-filter case, 4.70 kW, governs.

## Running cost

This is an illustration, in Australian dollars excluding GST. If EX-1 runs 2,000 hours a year at the clean-filter duty, with a motor efficiency of 90% and electricity at A$0.30 per kWh, it uses about 3.62 ÷ 0.90 × 2,000 = **8,050 kWh** a year, costing about **A$2,410**. Running nearer the dirty-filter duty for part of each cycle raises that.

The same figures give the value of a pascal. Each 100 Pa of the system's loss costs about 0.927 × 100 ÷ 0.60 ÷ 0.90 = 0.17 kW, about **343 kWh** and **A$103** a year at these assumptions. The 410 Pa that Chapter 5's single-mitre elbows would have added would have cost about A$420 a year for as long as the system ran, quite apart from weakening B1.

## The duty sheet

The fan's duty should be written on one sheet that the fan supplier, the installer and the commissioning engineer all use. For EX-1 it states:

- **flow**: 0.927 m³/s at the fan inlet, including 3% leakage, for 0.90 m³/s at the hoods;
- **pressure**: 3,044 Pa total pressure rise with filters at their cleaning point, 2,344 Pa clean;
- **air**: density 1.2 kg/m³, near 20 °C, carrying fine dust after the collector;
- **arrangement**: fan after the collector, discharging to a 250 mm vertical stack;
- **control**: variable-speed drive to hold flow as the filters load.

A fan selected from a duty sheet that leaves out the density, the arrangement or the dirty-filter case is selected for a different system from the one that will be built. The sheet also gives the commissioning engineer the numbers to measure against, as Chapter 10 does.

## Every path at the fan

Once the orifice plates are in, every path needs the same suction at the fan inlet, because the plates have made up each short path's difference. The fan therefore sees one system, with one resistance, and a single operating point on its curve. If a plate is removed, a blast gate opened or a booth added, the system's resistance changes, and so does the fan's operating point, which Chapter 8 shows how to find.

## Checking the total

A fan duty is a sum of many small items, and the easiest error is to leave one out. Three checks help:

- **List the path in order**, from hood to stack exit, and tick each item against the layout drawing, so that no elbow, transition, hose or piece of equipment is missed.
- **Compare the split** with a similar system: in a compact extraction system, if the duct friction is more than half the total, look for a duct sized too small or an extra length; if the fittings are tiny, look for missing ones.
- **Check every path**, not just the one expected to be the index. A short branch with an unusual hood can need more suction than the longest run.

For EX-1, the check on B2's path is a good example. From its hood to N2 it needs 342 Pa at the hood and 229 Pa in its duct and fittings, 571 Pa, plus its orifice plate's 209 Pa: 780 Pa, the same as B1's path at N2. From N2 onwards the two paths share the main, the collector, the fan and the stack. B2's total is therefore the same 2,344 Pa as B1's, which is what the plate was for. If a path's total, plate included, does not come out equal to the index path's, either a plate is mis-sized or an item is missing from one of the lists. The same check on B3 gives 571 Pa to N3 plus its 337 Pa plate, 908 Pa, matching the main's 908 Pa there, and again 2,344 Pa at the stack exit, with clean filters.

## Exercise: the fourth booth's effect on the fan

Chapter 1's fourth booth, B4, would add 0.40 m³/s, joining the main between N3 and the fan in 160 mm duct, with the main downstream enlarged to 280 mm. Suppose its addition raises the index path's loss, with dirty filters, from 3,044 Pa to 3,400 Pa in this illustration, because the higher flow through the shared main, collector and stack raises their losses. With 3% leakage and 60% fan efficiency, what are the new fan flow, air power and shaft power? Could the existing fan be reused?

**Worked answer.** The hoods would draw 0.90 + 0.40 = 1.30 m³/s, so with 3% leakage the fan moves about **1.339 m³/s**. At 3,400 Pa, the air power is 1.339 × 3,400 = about **4.55 kW**, and the shaft power 4.55 ÷ 0.60 = about **7.59 kW**, against 4.70 kW before.

The existing fan was selected for 0.927 m³/s at 3,044 Pa. Whether it can deliver 1.339 m³/s at 3,400 Pa depends on its fan curve and speed range, which Chapter 8 discusses; a fan selected closely for the original duty almost certainly cannot, and its motor would be overloaded if it tried. Adding a booth to an extraction system is a fan decision, not just a duct decision.
