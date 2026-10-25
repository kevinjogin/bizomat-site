---
book: cutting-and-gouging-by-the-numbers
chapterSlug: laser-cutting
order: 7
title: "Laser cutting"
description: "See how a fibre laser cuts, how oxygen, nitrogen and air assist change speed, edge and cost, compare laser and plasma per metre at each thickness, and test whether a laser pays for the work."
draft: false
---

A laser cutter focuses a beam of light to a spot a fraction of a millimetre across, so intense that it melts or vaporises steel almost instantly, and blows the melt out of the kerf with a jet of assist gas. Its kerf is narrow, its edge square and smooth, its holes small and accurate, its heat-affected zone tiny, and on thin sheet it is far faster than any other method. Fibre lasers, which generate the beam in an optical fibre and deliver it through another, have made laser cutting cheaper, more efficient and more reliable than the older carbon dioxide lasers, and have spread into plate shops of every size. They are also the most expensive cutting machines most shops will buy, and they lose their advantage as plate gets thicker.

This chapter explains how a laser cuts, compares the assist gases, compares laser and plasma cost per metre across thicknesses, and works through whether a laser would pay for the running case's work.

## How the laser cuts

The beam is focused by a lens in the cutting head to a small spot at or near the plate's surface. The power density in that spot is enormous: a 6 kilowatt beam focused to a spot about 0.15 mm across delivers its power over less than a fiftieth of a square millimetre. The steel under the spot melts at once, and the assist gas, flowing through a nozzle round the beam, drives the melt out of the bottom of the cut. As the head moves, the cut front moves with it, and a narrow kerf, often 0.2 to 0.5 mm wide on thin sheet, follows. The concentration of the energy into such a small spot is what gives the laser its narrow kerf, its accuracy and its speed on thin material.

## Assist gases

The assist gas does two quite different jobs depending on which gas is used.

```figure
type: compare
title: Laser assist gases for cutting steel
cols: How it works | Edge | Cost and speed
caption: General description for teaching. The laser maker's cutting tables give gases, pressures, speeds and nozzles for each material and thickness.
- Oxygen | burns the iron in the kerf, adding heat, as in oxy-fuel cutting | thin oxide layer on carbon steel | low gas flow and cost; good speed on thick mild steel
- *Nitrogen | inert; only blows the melt out at high pressure | bright, oxide-free; ready to weld or paint | high gas flow and cost; very fast on thin sheet; essential for stainless and aluminium
- Compressed air | mostly nitrogen with some oxygen | light oxide | cheap; good on thin mild steel and aluminium where edge colour matters less
```

With oxygen, the laser cuts mild steel partly by burning it, which adds energy and lets a modest laser cut thick plate, but leaves an oxide layer on the edge that may need removing before painting or welding. With nitrogen at high pressure, the laser does all the melting and the gas only blows it out, so cutting is fastest on thin sheet where the laser's power is ample, and the edge is bright and oxide-free; but the nitrogen flow is large and costly. Air, compressed on site, sits in between and is increasingly used on thin mild steel and aluminium.

## Speed and thickness

```figure
type: bars
title: Illustrative cutting speed of a 6 kW fibre laser in mild steel
unit: mm per minute
max: 13000
caption: This is an illustration for teaching: nitrogen assist on 1.5 and 3 mm, oxygen on 6, 12 and 20 mm. Real speeds come from the laser maker's cutting tables for the machine, nozzle and gas; higher-power lasers cut thick plate faster.
- 1.5 mm, nitrogen | 12500
- *3 mm, nitrogen | 12000
- 6 mm, oxygen | 3500
- 12 mm, oxygen | 1500
- 20 mm, oxygen | 700
```

On thin sheet, the laser is several times faster than plasma; on 12 mm plate, it is slower than a 200 A plasma system; on 20 mm, much slower. Higher-power lasers of 12 kilowatts and more push the speeds up on medium and thick plate, cutting 12 mm much faster with nitrogen or air, and narrow the gap with plasma there. The laser's quality advantage, square edges, small holes and no dross, holds at every thickness, but its cost advantage depends on speed.

## The hourly rate

A laser's hour costs more than a plasma table's, mainly because of its capital.

As an illustration, a 6 kilowatt fibre laser with a loading table costs about A$900,000 installed. Over seven years and about 4,000 cutting hours a year, with maintenance, its share of each hour is about A$65. The operator costs about A$72; power, including the laser's own electrical efficiency of perhaps a third and its chiller, about A$6; consumables, nozzles and protective windows, about A$5. Gas depends on the job: oxygen on mild steel about A$5 an hour, high-pressure nitrogen on thin sheet perhaps A$30. The total is about A$153 an hour on oxygen and about A$178 on nitrogen, excluding GST.

## Laser against plasma by the metre

```figure
type: formula
title: Cost per metre on 3 mm and 12 mm mild steel, laser and plasma
formula: cost per metre = hourly cost ÷ metres cut per hour
caption: This is an illustration using the laser's hourly costs above and the plasma table's A$149 an hour from Chapter 6, with speeds of 12,000 and 1,500 mm/min for the laser and about 4,500 and 2,500 mm/min for plasma on 3 and 12 mm. Pierces and finishing are excluded. Figures exclude GST.
- 3 mm | laser A$178 an hour at 720 m/h; plasma A$149 at 270 m/h
- 12 mm | laser A$153 an hour at 90 m/h; plasma A$149 at 150 m/h
step: 3 mm: laser ≈ A$0.25 per metre; plasma ≈ A$0.55 per metre
step: 12 mm: laser ≈ A$1.70 per metre; plasma ≈ A$0.99 per metre
step: the crossover for this laser and plasma lies somewhere near 5 mm, before quality is counted
```

On thin sheet, the laser's speed more than pays for its dearer hour; on medium plate, plasma is cheaper per metre. But cost per metre leaves out quality. On thin sheet, plasma's wider kerf, bevel, dross and poor small holes may need finishing that the laser avoids, widening the laser's advantage; on medium plate, the laser's square edges and accurate holes may save drilling and grinding, narrowing plasma's. The comparison that decides is the cost per finished part, ready for the next process.

## Holes, features and accuracy

The laser's narrow beam cuts holes down to a fraction of the plate's thickness on thin sheet, and fine features, slots, tabs and lettering, that plasma cannot. Its accuracy, typically a tenth of a millimetre or better on thin sheet, makes it the natural tool for parts that will be bent and assembled without adjustment, and for the self-locating tab-and-slot designs that Welding Automation by the Numbers describes for robot welding. Its small heat-affected zone and lack of dross mean parts can often go straight to bending or welding.

## Reflective metals

Older carbon dioxide lasers struggled with copper, brass and aluminium, which reflect much of their infrared beam and could reflect it back into the machine. Fibre lasers, at a shorter wavelength that these metals absorb better, cut them well, with care over the back-reflection. Stainless steel and aluminium are cut with nitrogen for clean edges. The laser's range of materials is therefore wider than plasma's in thin gauges, and it also cuts some non-metals, though those need their own fume controls.

## Loading and running unattended

A laser cuts thin sheet so fast that loading and unloading can take longer than cutting. Lasers are therefore often fitted with shuttle tables, so that one sheet is loaded while another is cut, and with automatic loading and sorting systems that take sheets from a store, load them, and stack the cut parts, so that the machine can run through breaks and even overnight with little attention. Automation raises the machine's cutting hours, which, as the payback arithmetic shows, is what decides whether it pays, but it adds capital and needs reliable nesting, good sheet quality and parts that separate cleanly from the skeleton. The laser business the service centre subcontracted to ran its machine on two shifts with an automatic loader and a third, unattended shift on long runs of simple parts.

## Focus, nozzles and upkeep

A laser's cut depends on the beam being focused at the right height and the nozzle being clean, round and centred on the beam. Modern cutting heads adjust the focus automatically for each material and thickness, and hold the nozzle at a constant height above the sheet by sensing its capacitance. Spatter on the nozzle, a damaged nozzle tip or a dirty protective window in front of the lens degrade the cut quickly, so nozzles and windows are inspected and cleaned or changed often, and the beam's centring in the nozzle is checked. The chiller, the beam source and the optics need the maker's scheduled maintenance. These are small costs per hour, but neglecting them shows as dross, rough edges and slower speeds long before anything fails.

## Coated sheet

Galvanised, painted and plastic-coated sheet is commonly laser cut, but the coating changes the cut and the fume. Zinc on galvanised sheet vaporises at the cut, can affect edge quality, and produces zinc oxide fume that must be extracted; plastic films and paints burn and produce their own fume. Films are often laser-cut with the film side up or removed along the cut path first. The machine's extraction and filtration must suit the coatings cut, and the safety data sheets for the coated sheet should be read before it is processed.

## Tube and bevel lasers

Lasers that cut tube and sections, rotating the tube in a chuck while the head cuts holes, slots, mitres and copes, have changed the fabrication of frames and structures, because they produce tube parts that fit together accurately with self-locating features, ready for welding with little or no fixturing. Lasers with tilting heads can bevel plate edges for weld preparations. Both widen the range of work a laser can take, which can matter to whether it fills its hours.

## Does the laser pay?

The question for the running case was whether a laser would pay for the work the service centre had. Its thin sheet work, about 140 tonnes a year of mostly 1.5 to 5 mm, would have been the laser's core load.

At 3 mm, a tonne of sheet is about 1,000 ÷ (7.85 × 3) ≈ 42 square metres, and the centre's typical parts had about 6 metres of cut per square metre, so 140 tonnes meant roughly 36,000 metres of cut a year. At a saving of about A$0.30 a metre against plasma, that is only about A$11,000 a year, plus perhaps as much again in finishing saved, against a laser costing A$900,000. On thin sheet alone, the laser would never pay. It would pay only if it also won new work, from customers wanting laser-quality parts the centre could not then supply, and took a share of the medium plate where its quality saved drilling and grinding, enough to fill several thousand hours a year.

## The decision

The manager's analysis showed that the laser's case depended on winning about 2,500 hours a year of new laser work, which the centre's sales records could not yet support. The centre chose instead to subcontract its thin sheet and precision parts to a laser cutting business nearby, at a price that gave both a margin, and to track the volume and the enquiries it was turning away. If the subcontracted work grew to a level that would fill a laser, the case would be revisited with evidence rather than hope. Welding Automation by the Numbers makes the same point about robot cells: utilisation decides payback.

## Safety

Cutting lasers are class 4 lasers, whose direct and reflected beams can blind and burn instantly, and whose beam may be invisible. Laser cutting machines enclose the cutting area completely, with interlocked doors and viewing windows that block the laser's wavelength, so that no beam can escape during cutting. Maintenance that requires access to the beam path is done only by trained people under the maker's procedures. Laser cutting also produces fine fume, especially from coated and galvanised sheet, which the machine's extraction must capture. Chapter 10 discusses fume together with the other methods.

## The running case: the subcontract

This is an illustration. In the year after deciding to subcontract, the service centre sent about 160 tonnes of sheet and precision parts to the laser business, more than its own thin sheet volume, because customers who had gone elsewhere for laser parts began ordering them through the centre once it offered them. The manager's records showed the subcontracted laser work growing towards the volume that would justify a machine, and the next year's plan included a smaller, 3 kilowatt laser for the thin sheet, at about half the capital of the 6 kilowatt machine, with a business case built on the subcontract history.

## A failure: the nitrogen bill

This is an illustration. A shop with a new laser cut all its mild steel with high-pressure nitrogen, because the edges looked better and the operator preferred it, including medium plate where oxygen would have cut faster and with a fraction of the gas. Its nitrogen bill in the first quarter was several times the budget.

On 8 to 12 mm mild steel parts that would be painted, the oxide edge from oxygen cutting was perfectly acceptable. The shop now chooses the gas by the part's needs, nitrogen for stainless, aluminium and parts welded or painted without edge cleaning, and oxygen or air for the rest.

## Exercise: laser or plasma for a part

A bracket in 5 mm mild steel has 0.9 m of cut and eight small holes. On the laser it takes about 15 seconds to cut, at A$160 an hour; on plasma about 20 seconds, at A$149 an hour, but its holes must then be drilled, at about A$0.80 per bracket, and its dross ground, at about A$0.40. What does each cost per bracket?

On the laser, the bracket costs about 15 ÷ 3,600 × 160 ≈ **A$0.67**, with no finishing. On plasma, it costs about 20 ÷ 3,600 × 149 ≈ A$0.83 to cut, plus A$0.80 drilling and A$0.40 grinding, about **A$2.03**.

The laser makes the bracket for about a third of the plasma cost, almost entirely because it needs no finishing. The comparison per metre would have shown only a modest difference; the comparison per finished part shows the real one.
