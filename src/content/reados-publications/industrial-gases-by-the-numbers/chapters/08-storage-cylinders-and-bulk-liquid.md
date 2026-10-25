---
book: industrial-gases-by-the-numbers
chapterSlug: storage-cylinders-and-bulk-liquid
order: 8
title: "Storage: cylinders and bulk liquid"
description: "Compare cylinders, manifolds and bulk liquid, calculate the gas a litre of liquid makes, cost a year of argon both ways, and store cylinders and cryogens safely."
draft: false
---

Gas reaches a workshop in one of three ways: as compressed gas in cylinders, swapped full for empty by the supplier; as gas from several cylinders joined on a manifold; or as a cryogenic liquid delivered by tanker into an insulated tank on site and evaporated as needed. Each way has its own costs, its own handling and its own hazards. The choice between them is one of the largest decisions in a workshop's gas plan, and it is often made by default, by carrying on with whatever was set up years ago.

This chapter calculates how much gas a litre of liquid makes, compares the costs of supplying the workshop's argon-based gases from cylinders and from a bulk liquid tank, and sets out the main storage rules for cylinders and cryogenic liquids. It names AS 4332, the Australian standard for the storage and handling of gases in cylinders, by number and scope only; the standard, the supplier's instructions and the safety regulator's requirements set the actual rules.

## Gas in a cylinder

A compressed gas cylinder holds gas at high pressure in a steel or aluminium shell. Its contents are stated as the volume of gas it delivers at atmospheric pressure and a reference temperature, which for a modern full-size cylinder of oxygen, argon or nitrogen is typically around 10 cubic metres, though sizes vary widely. The arithmetic is simple to a first approximation: a cylinder of 50 litres water capacity filled to about 200 times atmospheric pressure holds roughly 50 × 200 = 10,000 litres of gas. Real gases at such pressures depart from the ideal-gas law, so suppliers state the actual contents of each cylinder size and gas, and those stated contents are the ones to use.

Chapter 1 noted the exceptions: acetylene is dissolved in acetone, and carbon dioxide and propane are liquids under pressure in their cylinders. Oxy-Fuel by the Numbers explains how to estimate the remaining contents of oxygen and acetylene cylinders in its [cylinders chapter](/reados/publications/oxy-fuel-by-the-numbers/cylinders-contents-and-withdrawal/).

## The hidden costs of cylinders

The price of cylinder gas is more than the price on the delivery docket. A workshop on cylinder supply pays for the gas, and also for:

- **rental** on every cylinder it holds, full or empty, often by the day or month;
- **residual gas** returned in each empty cylinder, which it has paid for but not used, because cylinders are returned with some pressure left (Chapter 4);
- **handling**: the time spent changing cylinders, moving them, checking connections and arranging deliveries;
- **downtime** when a cylinder runs out in the middle of a job.

For gases used in small quantities, the rental can exceed the cost of the gas, and for gases used in large quantities, the handling and residual gas become significant. Both points push a workshop to review its cylinder holdings and, for its largest gases, to consider a manifold or bulk supply.

## Manifolds

A manifold joins several cylinders to one outlet through a common header, with a regulator, and often a changeover device that switches from an empty bank to a full one automatically. The welding bays are then fed through fixed piping from a cylinder store, rather than from cylinders standing beside each machine. Manifolds reduce cylinder handling in the work area, remove cylinders from the bays, allow the store to be outside or in a ventilated room, and, with an automatic changeover, stop jobs being interrupted by empty cylinders. They do not reduce the price of the gas, and the piping must be designed and installed for the gas by competent people, as Chapter 9 explains.

## Gas as a liquid

Oxygen, nitrogen and argon can also be delivered as cryogenic liquids, at temperatures far below zero, in insulated tanks. The advantage is density: a litre of liquid makes hundreds of litres of gas. The ratio follows directly from the densities of the liquid at its boiling point and the gas at 15 °C.

```figure
type: formula
title: Gas made by one litre of cryogenic liquid
formula: expansion ratio = ρ_liquid ÷ ρ_gas
caption: Liquid densities at the normal boiling point; gas densities at 15 °C and atmospheric pressure, calculated from molar mass. Reference values differ slightly with the conditions chosen.
- ρ liquid argon | about 1,395 kg/m³
- ρ argon gas at 15 °C | about 1.69 kg/m³
step: argon: 1,395 ÷ 1.69 ≈ 826 litres of gas per litre of liquid
step: oxygen: 1,141 ÷ 1.35 ≈ 843
step: nitrogen: 807 ÷ 1.19 ≈ 681
```

```figure
type: bars
title: Litres of gas at 15 °C from one litre of cryogenic liquid
unit: litres of gas per litre of liquid
max: 900
caption: Calculated from liquid density at the normal boiling point and gas density at 15 °C. The same ratios explain why a small liquid spill or leak releases a large volume of gas.
- Liquid oxygen | 843
- *Liquid argon | 826
- Liquid nitrogen | 681
```

A bulk tank holding a few hundred litres of liquid argon therefore stores a few hundred cubic metres of gas, as much as thirty or more cylinders, in one vessel, refilled from a tanker without anyone handling a cylinder.

## How a bulk tank works

A bulk liquid tank is a double-walled vessel with a vacuum and insulation between the walls, holding the liquid at low temperature and modest pressure. Gas is drawn from the space above the liquid, or liquid is drawn off and passed through an evaporator, a finned heat exchanger that warms it to gas using the surrounding air, before it enters the workshop's piping through a regulator. Because no insulation is perfect, heat leaks in steadily and some liquid evaporates all the time. When gas is being drawn, the evaporated liquid simply supplies part of the demand; when no gas is drawn for a long period, the pressure rises until a relief valve vents gas to the atmosphere. That loss, often called boil-off, means a bulk tank suits a steady user better than an occasional one.

Mixed gases, such as the workshop's argon and carbon dioxide mixture, can be supplied from bulk argon and carbon dioxide through an on-site mixer, which blends the gases to the required composition. The mixer must be maintained and checked, because a drifting mixture changes the weld.

## The workshop's argon, two ways

This is an illustration. After the fixes in Chapter 7, the workshop expects to use about 980 m³ of its argon and carbon dioxide mixture and about 400 m³ of pure argon a year. Of the mixture, 82%, about 804 m³, is argon and 18%, about 176 m³, is carbon dioxide, so the workshop's total argon demand is about 1,204 m³ a year, about 1.46 m³ of liquid. The supplier offered two options, with prices, rentals and costs invented for teaching and excluding GST.

```figure
type: compare
title: A year of argon-based gases from cylinders and from a bulk tank
cols: Cylinders | Bulk argon tank with mixer
caption: This is an illustration. All prices, rentals and allowances are invented for teaching and exclude GST. Real offers differ greatly with location, volume, contract term and the supplier.
- Gas | A$13,220 (mixture A$9.00/m³, argon A$11.00/m³) | A$7,680 (argon A$5.50/m³, carbon dioxide A$6.00/m³)
- Rental | A$2,560 for 16 cylinders | A$4,800 for tank, evaporator and mixer
- Residual gas returned | about A$660 | none
- Boil-off allowance | none | about A$330
- Handling | about A$2,420 (138 changes) | small
- Installation, spread over 5 years | none | about A$2,400
- *Total a year | about A$18,860 | about A$15,210
```

On these illustrative numbers, bulk supply saves about A$3,650 a year. But the offer came with conditions: a five-year contract, a minimum annual volume close to the workshop's expected use, and a tank site that needed a concrete pad, a vehicle access path for the tanker and separation from the building and boundaries set by the supplier's siting rules. If the workshop's welding fell by a quarter, the minimum volume charge would erase most of the saving; if the tank stood idle over a long shutdown, boil-off would rise.

## The decision

The manager decided to stay with cylinders for now, for three reasons: the saving depended on volumes the workshop could not guarantee for five years; the fixes in Chapter 7 had already saved about A$3,780 a year with no contract; and the yard had no easy site for a tank. Instead, the workshop installed a two-bank manifold for the mixture in a ventilated store outside, piped to the welding bays, which removed most cylinder changes from the bays and ended jobs stopped by empty cylinders. The bulk option was recorded in the gas plan, with the volume at which it would be revisited. The decision was made on numbers, conditions and risks together, not on the headline saving.

## Temperature and the gauge

The pressure in a compressed gas cylinder changes with its temperature, in proportion to the absolute temperature for an ideal gas. This is an illustration. A cylinder filled to 20 MPa at 15 °C would read about 20 × 308 ÷ 288 ≈ **21.4 MPa** if left in the sun until it reached 35 °C, and about 20 × 273 ÷ 288 ≈ **19.0 MPa** on a cold morning at 0 °C, with exactly the same gas inside. Two practical points follow. A cylinder left in direct sun or near a heat source carries a higher pressure than it was filled to, which is one reason storage rules keep cylinders away from heat, and a cylinder in a fire can reach pressures that burst it. And a gauge reading taken on a cold morning makes a cylinder look emptier than it is, so contents estimates from the gauge should allow for the temperature, as the cylinders chapter of Oxy-Fuel by the Numbers explains for oxygen.

## Storing cylinders safely

Cylinders are heavy, under high pressure and contain gases with the hazards described in Chapter 1. The common rules of good practice, set out in detail in AS 4332 and the suppliers' instructions, include:

- store cylinders upright, secured against falling with chains or brackets, with valve guards or caps fitted when not in use;
- store them outdoors or in a well-ventilated store, away from heat, ignition sources, corrosive materials and vehicle traffic;
- separate oxygen and other oxidising gases from fuel gases, by distance or a fire-resisting barrier, as the standard specifies;
- keep full and empty cylinders apart and clearly marked;
- move cylinders with a trolley, never by rolling them on their sides or lifting them by the valve;
- display signage and keep the safety data sheets available.

```figure
type: checklist
title: The workshop's cylinder store, after the review
caption: This is an illustration. AS 4332, the supplier's instructions and the regulator's requirements set the actual separation distances, ventilation and signage.
- x Cylinders upright and chained | every cylinder, in store and in use
- x Store outside, roofed and ventilated | replacing the closed internal store room
- x Oxygen separated from fuel gases | by the distance or barrier the standard requires
- x Full and empty segregated | marked bays, with empties returned promptly
- x Trolleys for every move | no rolling or carrying by the valve
- *? Cylinder count reviewed quarterly | returning rarely used cylinders to cut rental
```

## Cryogenic hazards

Cryogenic liquids add hazards that compressed gases do not. Liquid argon and nitrogen are cold enough to cause severe cold burns on contact, and to make ordinary materials such as carbon steel and many plastics brittle, so that a splash can crack a fitting or a floor. A small spill releases a very large volume of gas, as the expansion ratios show, and the cold gas is denser than air at first, flowing along the floor and into pits. Liquid trapped between two closed valves warms and expands, building enough pressure to burst a pipe, which is why cryogenic piping has relief valves on every section that can be isolated. And liquid oxygen, or oxygen-enriched liquid that condenses on very cold surfaces, can make combustible materials, including asphalt, explosive on impact, which is why liquid oxygen tanks stand on concrete.

This is an illustration. If a small dewar spilled 10 litres of liquid nitrogen in a closed room of 30 m³, it would release about 10 × 681 ≈ 6,810 L, or **6.8 m³**, of gas. Mixed evenly into the room, with the displaced mixture leaking out, the oxygen concentration would fall to about 20.9 × e^(−6.8 ÷ 30) ≈ **16.7%**, well below the 19.5% that Safe Work Australia's confined spaces code treats as the lower limit of safe air. Near the floor, before the cold gas mixed, it would be far lower.

## Siting a bulk tank

A bulk tank is sited by the supplier according to its rules and the applicable standards: on a suitable pad, with access for the tanker, away from drains, pits and building openings where cold gas could collect, separated from combustible materials, boundaries and ignition sources, and protected from vehicle impact. Its relief valves vent to a safe place. The tank, evaporator and controls remain the supplier's equipment, maintained by the supplier, and the workshop's people are trained not to operate valves they are not authorised to touch.

## A failure: the empty that wasn't

This is an illustration. A cylinder marked as empty with chalk was found in the full bay and connected to a welding set, where it delivered gas for a few minutes before running out mid-weld. Another, marked full, was found nearly empty in the empty bay and returned to the supplier with most of its contents.

Neither mistake was dangerous, but both cost money and time, and both came from the same cause: chalk marks that rubbed off and cylinders put back in whichever bay had space. The workshop changed to cylinder tags that are turned from "full" to "in use" to "empty", and marked the floor of the store with labelled bays. Returned cylinders are now checked for pressure before they leave, and the number returned with significant contents has fallen to almost none.

## Exercise: rental against use

The workshop holds four nitrogen cylinders on rental at an illustrative A$160 a year each, and uses about 12 cylinders of nitrogen a year at A$70 each for the gas, excluding GST. Calculate the share of its nitrogen cost that is rental, and what it would save by holding two cylinders instead of four, if two were enough to keep it supplied between deliveries.

Rental is 4 × 160 = A$640 a year and gas is 12 × 70 = A$840, a total of A$1,480, so rental is about 640 ÷ 1,480 ≈ **43%** of the cost. Holding two cylinders would save about **A$320** a year, a fifth of the nitrogen cost, for nothing more than a review of how many cylinders the workshop actually needs on hand. The same check across all its gases is one of the easiest savings in the gas plan.
