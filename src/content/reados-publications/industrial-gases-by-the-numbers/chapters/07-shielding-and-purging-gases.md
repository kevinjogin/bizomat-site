---
book: industrial-gases-by-the-numbers
chapterSlug: shielding-and-purging-gases
order: 7
title: "Shielding and purging gases"
description: "Compare argon, helium, carbon dioxide and their mixtures, find where a workshop's shielding gas really goes, and calculate how long a pipe purge takes."
draft: false
---

The early welding manuals had nothing to say about shielding gases, because the arc welding of their day was done in open air with bare or lightly coated electrodes, and the weld metal paid for it in nitrogen, oxygen and brittleness. The inert-gas processes that followed from the 1940s onwards, tungsten arc welding under argon or helium and then metal arc welding with a continuously fed wire under argon, carbon dioxide or their mixtures, made shielding gas one of the largest gas costs in a modern fabrication workshop. In the running case, the argon and carbon dioxide mixture is the largest single item on the gas bill.

This chapter explains what shielding does, how the main shielding gases differ, where a workshop's shielding gas actually goes, which turns out to be well beyond the arc, and how long it takes to purge the inside of a stainless steel pipe before welding, using a simple exponential dilution model.

## Why the arc needs shielding

Molten steel at well over 1,500 °C reacts readily with the air around it. Oxygen forms oxides in the weld pool and on its surface; nitrogen dissolves in the molten metal and forms nitrides as it cools, which make the weld brittle; and moisture in the air breaks down in the arc, putting hydrogen into the weld. The coated electrodes of manual metal arc welding protect the weld with gas and slag from their coatings. The gas-shielded processes do it with a stream of gas from the torch or gun that pushes the air away from the arc and the weld pool for as long as they are hot.

Shielding only works if the gas stream is steady and covers the weld pool completely. Too little flow lets air in at the edges; too much flow turns the stream turbulent, which also draws air in, and wastes gas. Draughts, fans and open doors can blow the shield away entirely, and an arc in a draught is a common cause of porosity.

## The main shielding gases

Argon and helium are inert: they do not react with the weld metal at all. Carbon dioxide and oxygen are active: in the arc they react with the metal to some extent, which changes the arc and the weld. Most shielding gases for steel are mixtures that balance those effects.

```figure
type: compare
title: Main shielding gases and their effects
cols: Character | Typical use | Effect on arc and weld
caption: General characteristics. The welding procedure and the gas and consumable makers' data govern the choice of gas for each material and process.
- Argon | inert, heavier than air | tungsten arc on most metals; base of most mixtures | stable, easily started arc; good coverage
- Helium | inert, much lighter than air | added to argon for thick aluminium and copper | hotter arc, higher voltage, wider penetration
- Carbon dioxide | active | metal arc on steel, alone or mixed | deep penetration; more spatter on its own
- *Argon with carbon dioxide | mildly active | metal arc on carbon steel | smoother arc and less spatter than carbon dioxide alone
- Argon with a little oxygen | mildly active | some metal arc work on stainless and carbon steel | stabilises the arc; small oxidising effect
```

The physics behind the differences is well established. Helium needs more energy than argon to ionise, about 24.6 electronvolts against argon's 15.8, so a helium arc runs at a higher voltage for the same current and puts more heat into the work, and helium conducts heat far better, widening the hot zone. Carbon dioxide breaks down in the arc into carbon monoxide and oxygen, which makes it mildly oxidising, so the welding wires used with it contain extra deoxidisers. Argon's density, about 1.38 times that of air, helps it blanket a downhand weld, while helium's lightness means it needs a higher flow to give the same coverage.

## Carbon dioxide in the cylinder

Carbon dioxide differs from the other shielding gases in its cylinder, because at room temperature it is a liquid under pressure. The cylinder pressure is the vapour pressure of the liquid, about 5.7 MPa at 20 °C according to standard property data, and it stays at that value until the last of the liquid has evaporated, so the gauge says almost nothing about how full the cylinder is; weighing it does. As gas is drawn off, liquid evaporates to replace it and absorbs heat, cooling the cylinder and the regulator. At high flows the regulator can freeze, which is why high-flow carbon dioxide installations use regulator heaters or draw from several cylinders through a manifold.

## How much gas the arc needs

A shielding gas flow is set on a flowmeter in litres per minute, and the welding procedure, or the gas and wire makers' guidance, gives a suitable range for each process, nozzle and position. The gas actually needed in a year is the flow multiplied by the time the gas is flowing at the arc, plus the pre-flow and post-flow at each start and stop, plus any purging. Everything else is waste.

```figure
type: formula
title: Shielding gas needed for a year's arc time
formula: V_year = Q × t_arc + V_starts + V_purge
caption: This is an illustration for the workshop's three metal arc welders. Arc time is the time the arc is actually burning, a fraction of paid hours (see Arc Welding by the Numbers).
- Q, flow the procedure needs | 15 L/min
- t_arc, arc time for three welders | about 1,000 hours a year
step: Q × t_arc = 15 × 60 × 1,000 ≈ 900,000 L ≈ 900 m³
step: pre-flow, post-flow and purges add a few per cent
step: about 950 m³ a year is a reasonable need
```

The arc time comes from the welders' records. Arc Welding by the Numbers explains how arc time relates to paid hours in its chapter on [arc time and operator factor](/reados/publications/arc-welding-by-the-numbers/arc-time-and-operator-factor/), and the workshop used that method to estimate its welders' arc time from wire use and observation.

## Where the workshop's gas goes

This is an illustration. The workshop bought about 1,400 m³ of the argon and carbon dioxide mixture last year, at an illustrative A$9.00 per cubic metre for the gas, excluding GST, plus cylinder rental. Against a need of about 950 m³, roughly a third of the gas was not doing useful work. The manager walked the welding bays with a flow gauge and a leak detection solution, timed starts and stops, and found three causes.

First, the flowmeters were set at about 20 L/min on average, against the procedure's 15, because welders had turned them up over time to deal with draughts and never turned them down. At 20 L/min, 1,000 hours of arc time uses about 1,200 m³, 300 m³ more than at 15.

Second, every time a welder pulled the trigger, the gas stored in the hose at regulator pressure rushed out in a surge, much of it wasted. Third, a cracked hose and two loose fittings were leaking continuously, day and night.

```figure
type: bars
title: Where the workshop's 1,400 m³ of mixture went in a year
unit: m³ a year
max: 1000
caption: This is an illustration. The surge and leak figures are estimates from the calculations in this chapter and the walk-round; the flow excess is the difference between the set and required flows over the arc time.
- *Useful shielding at 15 L/min, plus starts | 950
- Excess flow, 20 rather than 15 L/min | 300
- Start surges | 100
- Leaks | 50
```

## The start surge

When the gun is idle, the gas valve in the wire feeder is closed, and the hose between the regulator and the feeder fills to the regulator's outlet pressure, typically a few hundred kilopascals, well above the small pressure the flow at the nozzle needs. When the trigger is pulled, that stored gas rushes out at a much higher flow than the meter setting until the hose pressure falls.

This is an illustration. A 10 m hose with a 6 mm bore holds about π × 0.003² × 10 ≈ 0.28 L. Pressurised to 350 kPa above atmospheric, it holds about 0.28 × 350 ÷ 101.3 ≈ **1.0 L** of gas more than it would at atmospheric pressure, and most of that extra gas is blown out in the first second or so of each start. With each of the three welders making about 130 starts a day over 250 days, the surges waste about 3 × 130 × 250 × 1.0 ≈ **98,000 L**, nearly 100 m³ a year. Shorter hoses, lower static pressure and devices that limit the surge all reduce it; the welders' habit of long continuous welds rather than many short tacks reduces it too.

## What the fixes saved

This is an illustration. Resetting the flowmeters to the procedure's 15 L/min, with draught screens where the draughts had been, saves about 300 m³ a year. Fitting surge-limiting flow controls at each feeder and shortening the longest hose cut the surge waste to an estimated 30 m³, saving about 70 m³. Replacing the cracked hose and tightening the fittings saved the 50 m³ of leaks. In all, about 420 m³ a year, at A$9.00, is about **A$3,780** a year, excluding GST, for an outlay of a few hundred dollars and a morning's work. The manager also asked the welders to check their flowmeter at the start of each shift and report any draught that tempted them to turn it up.

## Nozzles, distance and coverage

The flow a weld needs depends on more than the flowmeter. A nozzle clogged with spatter breaks the gas stream into jets and lets air in, whatever the flow. A nozzle held too far from the work lets the shield spread and thin before it reaches the pool, while one held too close traps heat and spatter. A joint that is open on the far side, such as an outside corner, lets gas spill away and needs more care than a fillet in a corner that holds the gas. In tungsten arc welding, a gas lens, a fine mesh in the nozzle that straightens the gas stream, gives smoother coverage at a lower flow and lets the tungsten stick out further. Each of these changes the gas the weld really needs, which is why the procedure's flow assumes a clean nozzle, the right distance and a sheltered joint, and why cleaning nozzles is as much a gas saving as resetting meters.

## Purging the inside of a pipe

When stainless steel pipe is welded from one side, the inside of the root is exposed to whatever is inside the pipe. In air, the hot root oxidises, forming a heavy coloured scale that weakens its corrosion resistance and may be unacceptable. The cure is to replace the air inside the pipe with an inert gas, argon or nitrogen or, for some steels, a nitrogen and hydrogen mixture, before and during welding. The procedure usually sets a maximum residual oxygen, measured with an analyser at the vent, before the root is welded.

A simple model gives the purge time. If the incoming gas mixes completely with the gas already in the pipe, each volume of purge gas that flows through reduces the oxygen concentration by a factor of e, about 2.72. After N volume changes, the oxygen concentration is C₀ × e^(−N). This is the same exponential decay that READOS explains in its chapter on [growth, decay and logarithms](/reados/collections/practical-mathematics-for-engineering/growth-decay-and-logarithms/).

```figure
type: line
title: Oxygen remaining in a pipe purge with complete mixing
x: Volume changes of purge gas
y: Oxygen remaining (%)
ymin: 0
ymax: 21
caption: Calculated from C = 20.9 × e^(−N), starting from air. Real purges, with gas entering at one end and leaving at the other, often clear faster near the vent than complete mixing predicts, but dead pockets clear more slowly. An analyser at the vent shows when the target is reached.
legend: Complete mixing
- 0 | 20.9
- 1 | 7.7
- 2 | 2.8
- 3 | 1.0
- 4 | 0.38
- 5 | 0.14
- 6 | 0.05
```

## A purge in numbers

This is an illustration. The workshop is welding a 150 mm bore stainless pipe spool 6 m long, and the procedure calls for a residual oxygen of 0.1% before the root is welded. Reducing oxygen from 20.9% to 0.1% under complete mixing needs N = ln(20.9 ÷ 0.1) ≈ **5.3** volume changes.

The whole spool holds about π × 0.075² × 6 ≈ 0.106 m³, or 106 L. Purging it all would take about 5.3 × 106 ≈ **570 L** of argon, or about 28 minutes at 20 L/min. Fitting purge dams on each side of the joint, 1 m apart, reduces the volume to about 17.7 L, needing about 5.3 × 17.7 ≈ **94 L**, under five minutes at the same flow. The dams save both gas and the welder's time, and that is why they are used.

## Purge flow and pressure

A purge is not simply a matter of more flow. Too high a flow can raise the pressure inside a dammed section enough to push the molten root outwards or blow it through, especially when the joint is nearly closed and the vent area is small. Procedures therefore set a purge flow for filling the volume and a lower flow for welding, and the vent must stay open throughout. As the last part of the root is closed, the purge flow is often reduced further so that the pressure does not disturb the weld.

## The asphyxiation hazard of purging

Purging deliberately fills a space with a gas that cannot support life. Inside a large pipe or vessel, the purge gas is lethal to anyone who enters it, and the vent discharges purge gas into the space around the welder. Argon, being heavier than air, flows out of the vent and down into pits and low places. Large-bore purging inside vessels and pipes is confined-space work, and the controls in Chapter 10 and in Safe Work Australia's code of practice for confined spaces apply. Even for small purges, the vent should discharge where the gas can disperse safely.

## A failure: the porous corner

This is an illustration. Welds on a steel frame made near the workshop's roller door began to show porosity on windy days, and only in the corner bay. The welder had turned the flowmeter up to 25 L/min, which made the porosity worse rather than better.

The draught from the open door was sweeping across the bay, and the higher flow turned the gas stream turbulent, so it drew more air into the shield instead of less. A portable welding screen across the door side of the bay, and a return to the procedure's flow, cured the porosity. The case shows why a flow higher than the procedure's is not a fix for poor shielding: the cause is usually draught, distance or a damaged nozzle, and finding it saves gas as well as rework.

## Exercise: the cost of a high flowmeter

One welder's flowmeter is found set at 24 L/min, against the procedure's 15 L/min. The welder's arc time is about 350 hours a year. Calculate the extra gas used in a year and its cost at A$9.00 per cubic metre, excluding GST.

The excess flow is 24 − 15 = 9 L/min. Over 350 hours, that is 9 × 60 × 350 = 189,000 L, or about **189 m³** a year, costing about 189 × 9.00 ≈ **A$1,700**. One flowmeter, turned up and forgotten, costs as much each year as a good welding screen several times over, which is why checking flow at the start of each shift is one of the workshop's routine checks.
