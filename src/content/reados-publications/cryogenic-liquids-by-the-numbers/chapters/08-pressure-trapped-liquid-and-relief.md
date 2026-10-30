---
book: cryogenic-liquids-by-the-numbers
chapterSlug: pressure-trapped-liquid-and-relief
order: 8
title: "Pressure: trapped liquid, closed vessels and relief"
description: "The pressure trapped liquid nitrogen reaches as it warms, how fast a closed vessel pressurises, why every isolable space needs relief, and a vacuum flask sealed with its cap."
draft: false
---

A cryogenic liquid in an open vessel is at atmospheric pressure because its vapour can leave. Close the vessel, and the vapour cannot leave; the pressure rises as heat leaks in. Fill a closed space completely with liquid, and the pressure rises far faster, because the liquid itself expands as it warms and has nowhere to go. These are the two ways cryogenic liquids make pressure, and between them they account for most of the serious accidents with cryogenic equipment.

This chapter puts numbers on both. It uses NIST's tables to find the pressure in a pipe full of trapped liquid nitrogen as it warms, calculates how long SF-180's cylinder takes to reach its relief pressure when nothing is drawn from it, explains why every space that can be closed off needs a relief device, and ends with a vacuum flask carried to a job with its cap screwed on.

## Liquid trapped between two valves

When a hose or pipe full of liquid nitrogen is closed at both ends, the liquid's mass and volume are fixed, so its density is fixed. As the pipe warms, the liquid's temperature rises along a line of constant density, an isochore, and NIST's tables give the pressure along it directly.

This is an illustration. Liquid trapped in SF-180's hose at the cylinder's set point is saturated at 100 kPa gauge: 83.69 K and 776.5 kg/m³. Following the isochore at that density:

```figure
type: compare
title: Pressure of liquid nitrogen trapped at 776.5 kg/m³ as it warms
cols: Liquid temperature | Pressure | Warming from the set point
caption: NIST Chemistry WebBook isochoric data for nitrogen at 776.8 kg/m³. The liquid starts saturated at 83.69 K and 201.3 kPa absolute. Pressures are absolute.
- Trapped at the set point | 83.7 K | 0.2 MPa | 0 K
- * Warmed just over 2 K | 86 K | 3.8 MPa | 2.3 K
- Warmed 6 K | 90 K | 9.8 MPa | 6.3 K
- Warmed 16 K | 100 K | 24 MPa | 16 K
- Warmed 66 K | 150 K | 91 MPa | 66 K
- Room temperature | 294 K | 250 MPa | 210 K
```

The numbers are startling, and they are right. Liquid nitrogen near its boiling point expands by about 0.6% for each kelvin it warms, and it is only slightly compressible, so holding its volume fixed against that expansion takes enormous pressure. Two kelvins of warming takes the trapped liquid from 0.2 to 3.8 MPa; sixteen kelvins takes it to 24 MPa. No hose, valve or fitting in a workshop station is designed for those pressures, and a trapped section of line will rupture within seconds to minutes of being closed, depending on how fast heat reaches it.

## Partly full is still dangerous

A space that traps some vapour as well as liquid pressurises more slowly, because the vapour space can absorb part of the liquid's expansion and boiling. But it gets there in the end. Once everything in a closed space has warmed to room temperature, all the nitrogen is gas, and its pressure is set by how much nitrogen was trapped.

This is an illustration. SF-180's hose has a bore of about 12.5 mm, so its 1.5 m hold 0.184 L. If the valves at both ends are shut with the hose only one-tenth full of liquid, it holds 14.3 g of nitrogen. Warmed to 20 °C, that is gas at a density of 77.7 kg/m³, and the ideal gas law gives a pressure of 77.7 ÷ 0.028013 × 8.314 × 293.15 = **6.8 MPa**, sixty-seven times atmospheric pressure. A pipe that held liquid even briefly must never be closed at both ends unless it has a relief device between the closures.

## The rule that follows

```figure
type: checklist
title: Trapped-liquid rules for SF-180's pipework and hose
caption: This is an illustration of the rules a station applies; AS 1894, the supplier's instructions and the equipment maker's data govern real installations.
- x Every section that can be closed at both ends has a relief valve or bursting disc | set below the section's design pressure
- x Relief outlets point where cold gas and liquid cannot hit people | downwards and away from walkways
- x Shut-down sequence: close the supply valve first, leave the outlet open | the hose drains and warms open to the bath
- x No caps or plugs on anything that has held liquid until it is warm | applies to hoses, adaptors and dewars
- x Relief valves inspected and tested at the interval the maker states | iced or seized valves do not open
```

Cryogenic vessels and their relief devices are pressure equipment. In Australia their design is governed by pressure vessel standards such as AS 1210, and their storage and handling by AS 1894. A workshop does not size the relief valves on a supplier's cylinder; it does decide where its own pipework, hoses and adaptors can trap liquid, and it must protect each such place.

## How fast a closed vessel pressurises

A cryogenic vessel with its valves shut is a closed space with some vapour in it. Its heat leak keeps adding energy, the liquid warms, part of it evaporates into the vapour space, and the pressure rises along the saturation curve of Chapter 2. If the contents stay well mixed, the rise can be calculated from NIST's tables: the total internal energy of the liquid and vapour must rise by the heat that leaked in, at a fixed total volume and mass.

This is an illustration. SF-180's cylinder has a gross internal volume of 200 L, and its heat leak from Chapter 3 is 6.46 W. Starting at its 100 kPa gauge set point and closed off, how long does it take to reach its 150 kPa gauge relief setting?

```figure
type: steps
title: Time for SF-180's closed cylinder to rise from its set point to its relief pressure
caption: This is an illustration. Well-mixed liquid and vapour in 200 L, saturated throughout; internal energies and densities from NIST at 201.3 and 251.3 kPa absolute. The well-mixed result is an upper bound on the time.
- Specific volume of the contents, full | 0.200 m³ ÷ 140 kg = 1.429 L/kg
- Internal energy at 201.3 kPa, saturated mixture | liquid 90.0% of the volume
- Internal energy at 251.3 kPa, same specific volume | liquid 91.3% of the volume: the liquid expands as it warms
- * Energy needed | 665.9 kJ for the whole 140 kg
- Time at 6.46 W | 665,900 ÷ 6.46 = 103,000 s, about 28.7 hours
```

So a full cylinder, closed off at the end of a working day, reaches its relief pressure about a day later and then vents. A half-full cylinder gets there faster, because less liquid has to be warmed for the same rise in pressure.

```figure
type: bars
title: Time for SF-180's closed cylinder to rise from 100 to 150 kPa gauge, well mixed
unit: hours
max: 32
caption: This is an illustration. Same 200 L vessel and 6.46 W heat leak, with NIST saturated properties. Real vessels stratify and reach the relief pressure sooner, as Chapter 2 explained.
- * Full, 140 kg | 28.7
- Three-quarters, 105 kg | 22.2
- Half, 70 kg | 15.6
- Quarter, 35 kg | 9.1
```

These times are upper bounds. In a real vessel the heat leaking through the walls warms a layer at the liquid's surface, the pressure follows that warm layer, and the vessel reaches its relief pressure in less time than the well-mixed figure. The practical meaning is that a closed cylinder over a weekend or a holiday will certainly reach its relief pressure and vent, and the room it stands in must allow for that gas, which Chapter 9 calculates.

## Economisers: using the gas before it vents

Many liquid cylinders have an economiser, a regulator that connects the vapour space to the gas-use outlet when the pressure is above a set value, a little below the relief setting. When gas is being drawn from the cylinder, the economiser lets it come preferentially from the vapour space, which brings the pressure down and turns gas that would otherwise have vented into useful supply. For a cylinder that feeds a gas user, such as a purge line or a laser, as well as a liquid user, the economiser can recover most of the standing boil-off.

SF-180 draws only liquid, so its economiser has nothing to feed, and the boil-off goes to the relief valve. A station that also needed nitrogen gas, for example to purge a fixture or to dry the bath, could take that gas from the cylinder's gas-use outlet and recover part of the 2.8 kg a day that Chapter 3 calculated. That is worth knowing when choosing a supply arrangement, and Chapter 10 returns to it.

## Reading the gauge each morning

The cylinder's pressure gauge is the cheapest diagnostic instrument in the station. Recorded each morning, alongside the weight from the scale, it shows three things. A cylinder that stands at its set point after a day's use is normal: the pressure-building circuit held it there while liquid was drawn. A cylinder that has risen towards its relief setting overnight is normal too, at the rates in the chart above. But a cylinder at its relief pressure with frost on its jacket, or one whose weight is falling much faster than its normal evaporation rate on a day with no use, has a problem, and the record turns a vague worry into a clear report to the supplier.

## When the insulation fails

The relief devices on a cryogenic vessel are sized for the worst credible heat input, not the normal one. The two cases that set the size are loss of the insulating vacuum, which lets gas into the space between the inner and outer vessels and multiplies the heat leak many times, and fire around the vessel. Both are matters for the vessel's designer and its standard.

The size of the numbers is still worth seeing. If the heat leak into SF-180's cylinder rose a hundredfold, to about 650 W, the liquid would boil at about 12 kg an hour at the set point's latent heat, and the relief valve would have to pass that as gas continuously. A cylinder whose jacket is frosting or sweating all over, rather than only near its valves, has lost its vacuum and should be moved outdoors, vented as the supplier instructs and reported to the supplier at once.

## Ice: the relief path that blocks itself

A relief device protects nothing if its path is blocked. Cryogenic vents are cold, and moisture from the air freezes in them. A vent that points upward and collects rain, a relief valve outlet packed with ice from repeated small discharges, or the neck of an open dewar that frosts closed can all seal a vessel that was meant to vent.

The rules are simple: vent outlets point down or sideways and are protected from rain; relief valves are checked for ice during use, and thawed with warm, dry gas or left to warm, never chipped; and the neck plugs supplied with small dewars are loose-fitting by design and must never be replaced with tight stoppers, corks or tape.

## Open vessels and why they stay safe

SF-180's bath and the small open dewars used around a workshop are safe from pressure for one reason only: their vapour can always escape. The bath's lid rests on the rim and lifts with the slightest pressure; a dewar's neck plug is a loose foam or plastic stopper that keeps out moisture and dirt while letting gas out around it. Both rely on the opening staying open, and both can be defeated by well-meant changes: a lid clamped down to stop splashing, a plug wrapped in tape, a dewar neck that frosts solid because the plug was left out in humid air, or a flask chosen because it has a good tight cap.

A useful test is to ask, for every container that will ever hold liquid nitrogen, where the gas goes when it boils. If the answer is through a relief valve, the container is a pressure vessel and must be designed as one. If the answer is around a loose lid or plug, the lid or plug must stay loose. If there is no answer, the container must not be used.

The same question applies to the station's improvised parts: a length of tube used to pour liquid into a fixture, a cap pushed on to a hose end to keep dirt out, or a bucket with a fitted lid used to carry parts in liquid. Each of them has trapped liquid somewhere, sometime, in workshops that have had pressure accidents.

## The error: a vacuum flask with its cap on

This is an illustration. A fitter needed a litre of liquid nitrogen for a small job at another site and carried it in a domestic stainless vacuum flask, with its screw cap tightened so that it would not spill in the van. On arrival the cap was found blown off and the inside of the van's toolbox frosted; nobody was hurt.

A domestic flask is a good insulator, but it is not a pressure vessel and has no relief device. Taking a 1 L flask holding 0.8 L of liquid nitrogen at atmospheric pressure, with a heat leak of about 2 W, the well-mixed calculation from NIST's tables gives an absolute pressure of 0.3 MPa after about two hours and 0.5 MPa after about three. By then the liquid, expanding as it warms, fills 89% of the flask, and after about five hours it fills nearly all of it, after which the pressure rises as steeply as in a trapped pipe. The cap's thread let go long before that, which is the best outcome; a flask with a stronger closure can fail at its welds.

```figure
type: compare
title: A sealed 1 L domestic flask holding 0.8 L of liquid nitrogen, 2 W heat leak
cols: Time sealed | Absolute pressure | Liquid's share of the flask
caption: This is an illustration. Well-mixed contents with NIST saturated properties; a real flask stratifies and pressurises faster. A domestic flask is not designed for any internal pressure.
- At sealing | 0 h | 0.1 MPa | 80%
- Two hours | about 2 h | 0.3 MPa | 85%
- Three hours | about 3 h | 0.5 MPa | 89%
- * Nearly liquid-full | about 5 h | 1.0 MPa | 97%
```

The workshop's rule now is that liquid nitrogen leaves the station only in a dewar designed for transport, with its loose neck plug, secured upright in a ventilated part of the vehicle and never in the cabin. Transporting cryogenic liquids in vehicles has its own rules under the dangerous goods transport codes, which the supplier can explain.

## Exercise: a cylinder over a long weekend

SF-180's cylinder holds 70 kg when the workshop closes for a four-day long weekend. Its valves are shut and its pressure is at the 100 kPa gauge set point. Using this chapter's figures, estimate when it reaches its relief pressure, how much nitrogen it then vents over the rest of the four days, and what the workshop should do before closing.

**Worked answer.** This is an illustration. The well-mixed estimate for a half-full cylinder is **15.6 hours** to the relief pressure, and stratification makes it sooner. From then on it vents at about its normal evaporation rate: 6.46 W × 3,600 ÷ 187,000 J/kg at the relief pressure's latent heat ≈ 0.124 kg/h, or about 3.0 kg a day. Over the remaining 96 − 15.6 = 80 hours that is about **10 kg**, or roughly 8.6 m³ of gas at 20 °C released into the room where the cylinder stands. Nothing about this is a fault; it is what a closed cryogenic vessel does. Before closing, the workshop should check that the cylinder stands where its venting cannot lower the oxygen in an occupied or closed space (Chapter 9), that its relief outlet is clear of ice, and that no hose is left connected and closed at both ends.
