---
book: pipe-welding-by-the-numbers
chapterSlug: sizes-walls-and-pressure
order: 2
title: "Pipe sizes, wall thickness and pressure"
description: "Read nominal sizes and schedules, calculate hoop stress and the wall a pressure needs, see why most walls are chosen for corrosion and handling, and allow for the expansion of hot lines."
draft: false
---

Before a pipe can be welded, someone has to decide what pipe it is: what size, what wall, what material. Those choices fix how much weld metal each joint needs, which procedure and welder qualifications apply, how the ends are prepared and how long each weld takes. They also decide whether the line can hold its pressure. A welder who understands where the wall thickness came from is better placed to see when a pipe on the rack is not the pipe on the drawing, and a supervisor who understands it can estimate the welding before the first cut.

This chapter explains how pipe sizes and wall thicknesses are named, calculates the hoop stress a pressure causes, works out the wall a pressure actually needs, shows why most walls are much thicker than that, and covers the expansion of hot lines, which shapes the piping as much as the pressure does.

## Nominal size and outside diameter

Steel pipe is named by a nominal size, written in Australia as DN followed by a number, such as DN 100, and in North American practice as a nominal pipe size in inches, such as 4 inch. The nominal size is a label, not a measurement. What stays fixed for each nominal size is the outside diameter: DN 100 steel pipe is about 114.3 mm outside, whatever its wall, so that every DN 100 pipe fits the same fittings, flanges and clamps. A thicker wall makes the bore smaller, not the outside larger.

```figure
type: compare
title: Outside diameter and two common wall thicknesses for steel pipe
cols: Outside diameter | Schedule 40 wall | Schedule 80 wall
caption: Widely published dimensions for carbon steel pipe, given here for teaching. The pipe standard and the supplier's data for the pipe actually bought govern; stainless pipe has its own light-wall schedules.
- DN 50 | 60.3 mm | 3.91 mm | 5.54 mm
- DN 80 | 88.9 mm | 5.49 mm | 7.62 mm
- *DN 100 | 114.3 mm | 6.02 mm | 8.56 mm
- DN 150 | 168.3 mm | 7.11 mm | 10.97 mm
- DN 200 | 219.1 mm | 8.18 mm | 12.70 mm
```

The wall is given by a schedule number, such as Schedule 40 or Schedule 80, or by a stated thickness. Schedules are a set of standard walls for each size; the same schedule gives a thicker wall on a bigger pipe. Stainless pipe is often bought in lighter schedules, marked with an S, because stainless does not need a corrosion allowance in many services. Hygienic stainless tube for food plants is different again: it is sized by its actual outside diameter, such as 38.1 or 50.8 mm, with thin walls of a millimetre or two, and made to its own food-industry standard. Mixing the two systems on one job is a common source of mismatched fittings.

## Hoop stress

Pressure inside a pipe tries to split it along its length. The stress in the wall that resists this, the hoop stress, is found from a simple balance: the pressure acting across the diameter is held by the two walls.

```figure
type: formula
title: Hoop stress in a pipe wall
formula: hoop stress = (pressure × outside diameter) ÷ (2 × wall thickness)
caption: This is an illustration of the thin-wall relation, often called Barlow's formula, for a DN 100 Schedule 40 compressed air main at 1.0 MPa and for the same pipe at 1.6 MPa. Codes use refined forms of this relation with their own allowances.
- Pipe | 114.3 mm outside, 6.02 mm wall
- Pressure | 1.0 MPa and 1.6 MPa
step: at 1.0 MPa: 1.0 × 114.3 ÷ (2 × 6.02) ≈ 9.5 MPa
step: at 1.6 MPa: 1.6 × 114.3 ÷ (2 × 6.02) ≈ 15.2 MPa
step: a carbon steel's yield strength is many times higher, so pressure is not what sets this wall
```

The result surprises people who have not worked it through. A DN 100 Schedule 40 pipe at the pressure of a typical compressed air system has a hoop stress of only a few per cent of its material's strength. The wall is far thicker than the pressure alone would need.

The stress along the pipe's length from the same pressure, which acts on the circumferential welds, is half the hoop stress, because the pressure on the closed end of the pipe is carried by the whole ring of wall. That is why longitudinal seams in pipe and vessels, which carry the hoop stress, are treated more strictly than circumferential joints of the same size in many design rules. Circumferential welds, however, also carry the bending and thermal loads of the piping system, which can be much larger than the pressure load, as later sections show.

## The wall the pressure needs

Turned around, the same relation gives the thickness a pressure needs. A design code adds allowances to it: the allowable stress for the material at the design temperature, a factor for the kind of seam in the pipe, an allowance for corrosion and erosion over the pipe's life, and an allowance for the mill's tolerance, since pipe may be supplied somewhat thinner than its nominal wall.

```figure
type: formula
title: Wall thickness needed for pressure, with allowances
formula: thickness = (pressure × outside diameter) ÷ (2 × allowable stress × joint factor) + corrosion allowance
caption: This is an illustration only, using an assumed allowable stress of 130 MPa, a joint factor of 1.0 for seamless pipe, a corrosion allowance of 1.5 mm and a mill under-tolerance of 12.5%. Real values come from the piping code and the material specification, not from this book.
- Pipe | DN 100, 114.3 mm outside
- Design pressure | 1.6 MPa
step: pressure thickness = 1.6 × 114.3 ÷ (2 × 130 × 1.0) ≈ 0.70 mm
step: with corrosion allowance: 0.70 + 1.5 ≈ 2.2 mm
step: allowing for mill tolerance: 2.2 ÷ 0.875 ≈ 2.5 mm, against a Schedule 40 wall of 6.02 mm
```

Pressure needs well under a millimetre; the corrosion allowance needs more than the pressure does; and the pipe actually bought is more than twice the total. So why the thick wall?

## Why walls are thicker than pressure needs

Several things set the wall besides pressure. Threaded pipe must keep enough wall at the bottom of the thread, which on small sizes means a heavy schedule. Pipe must be stiff enough to span between supports without sagging, to resist being dented in handling, and to carry the weight of valves and the forces of the system. Corrosion and erosion, particularly in steam condensate and wet compressed air lines, eat walls faster than the allowance assumes. And standard schedules are what the mills make and the merchants stock: Schedule 40 is the commonest carbon steel pipe in many sizes, so it is cheaper and quicker to buy than a thinner, rarer wall.

For welding, the wall matters directly. The weld metal in a butt joint grows roughly with the square of the wall thickness, so a Schedule 80 joint can need nearly twice the weld metal of a Schedule 40 one of the same size, and thicker walls may also need preheat (Chapter 8). The contractor's estimator checks the schedule on every line before counting joints, because the same number of joints in a heavier wall is a different job.

## Large pipe and pipelines

On large pipe and long pipelines the balance changes, because the steel is a large share of the cost and a thinner wall saves a great deal of it. Pipeline walls are calculated closely from the design pressure, with stronger steels allowing thinner walls, and the welding procedure is qualified for that steel and wall.

```figure
type: bars
title: Hoop stress in DN 200 steel water main at 1.6 MPa by wall thickness
unit: MPa
max: 40
caption: This is an illustration using the thin-wall relation for a 219.1 mm outside diameter. The wall for a real main also allows for surge pressure, external loads from the soil and traffic, vacuum, handling, and the lining and coating.
- 4.8 mm wall | 36.5
- *6.4 mm wall | 27.4
- 8.18 mm wall | 21.4
- 12.7 mm wall | 13.8
```

The running case's raw water main uses DN 200 pipe with a 6.4 mm wall in this illustration, chosen by the designer for the pressure, the surge from the bore pumps stopping suddenly, the burial depth and handling, not for pressure alone. Its welding procedure, its welders' qualifications and its weld metal per joint all follow from that wall.

## Surge and water hammer

The pressure a line must hold is not always the steady pressure. When a valve shuts quickly or a pump stops, the moving fluid's momentum produces a pressure wave, water hammer or surge, that can briefly exceed the working pressure by a large margin. On water mains and condensate lines, surge often sets the design pressure. Welded joints are not more vulnerable to surge than the pipe, if they are sound, but defects such as lack of fusion at the root become starting points for fatigue cracks when surges repeat thousands of times. That is one reason the codes ask for full penetration and sound roots on lines with cyclic pressure.

## Temperature and the allowable stress

Steels grow weaker as they get hotter, so a design code's allowable stress falls with the design temperature. For steam lines at modest pressures and temperatures, the reduction is small for carbon steel. At higher temperatures, carbon steel loses strength steadily and eventually creeps, stretching slowly under constant stress, so high-temperature steam lines use alloy steels containing chromium and molybdenum, which keep their strength. Those steels need preheat and heat treatment when they are welded, which Chapter 8 deals with. The design temperature is therefore a welding decision as much as a materials one.

## Expansion of hot lines

A hot line grows. Steel expands by about 12 millionths of its length for each degree Celsius it warms, which sounds tiny until it is multiplied by a long line and a large temperature change.

A 50 m steam main heated from 20 °C to 180 °C grows by about 50,000 × 0.000012 × 160 ≈ 96 mm. If the line were held rigidly at both ends, that growth would be stopped by enormous forces, enough to bend supports, crack welds at fittings and pull branches out of equipment. Instead, the line is given flexibility: changes of direction, expansion loops and, where necessary, expansion joints, so that it can grow without overloading anything. Willis's manual showed a long length of pipe welded at its middle and bent into an expansion loop, one of the earliest uses of welding to save fittings on a hot line.

The welds at elbows, tees and branches carry the bending stresses that expansion causes, and on lines that heat and cool every day those stresses repeat. A sound weld with a smooth profile and no undercut has a long fatigue life; a weld with a notch at its toe or a lack of fusion at its root can crack after some thousands of cycles. That is the link between the piping designer's stress analysis and the welder's root and cap.

## Supports and the welds

Pipe supports, guides and anchors are often welded to the pipe through pads or lugs. The welds that attach them carry the weight of the pipe and its contents and the forces from expansion, and they put heat into the pipe wall. On thin-walled or alloy pipe, attachment welds need the same procedures and care as the main welds, and the code may require them to be examined. The contractor treats every weld on a pressure pipe, including small attachment welds, as part of the pressure envelope.

## External pressure and vacuum

Lines that can be under vacuum, such as condensate lines that cool after shutdown, product lines being drained, or pump suctions, must resist the outside atmosphere pushing in. Thin-walled pipe, especially large-diameter stainless tube, can collapse under vacuum even though it would never burst under internal pressure. The design checks external pressure where vacuum is possible, and the welds must not leave the pipe out of round, because ovality greatly reduces a thin pipe's resistance to collapse.

## Reading the pipe

Every length of pressure pipe carries markings stencilled or stamped along it: the standard it was made to, its grade, size, wall or schedule, the maker and a heat number that links it to the mill's test certificate. Those markings, and the certificate, are what prove the pipe in the line is the pipe the design called for. The contractor's storeman checks them on delivery, keeps the certificates filed by heat number, and transfers the heat number to any offcut that will be used, so that the marking is not lost when the length is cut.

## The running case: the line list

This is an illustration. The contractor's line list for the dairy project gave, for every line, its fluid, design pressure and temperature, size, schedule and material, the joint rule of Chapter 1, and the welding procedure that applied. Steam lines were carbon steel Schedule 40 at DN 50 and above, with Schedule 80 for small-bore threaded branches; compressed air was carbon steel Schedule 40; cooling water was galvanised medium-wall pipe with grooved joints; stainless product lines were hygienic tube in outside-diameter sizes. The estimator counted joints and weld metal line by line from that list, and the welding supervisor checked the pipe on each delivery against it before any was cut.

## A failure: the wrong wall

This is an illustration. On an earlier job, a delivery of DN 80 pipe for a condensate line arrived marked as Schedule 40, but some lengths in the bundle were a lighter wall that had been mixed in at the merchant's yard. The welders noticed nothing, because the outside diameter was the same, and the lighter lengths were welded into the line. Two years later, corrosion had thinned those lengths enough to leak, while the rest of the line was sound.

A wall thickness check on delivery, with a simple ultrasonic thickness gauge or a calliper on the cut ends, would have caught the mix. The contractor now checks the wall of every bundle and records the heat number on the weld log, so that any pipe in the line can be traced to its delivery.

## Exercise: the wall for a steam line

A steam line is DN 150, 168.3 mm outside, with a design pressure of 1.2 MPa. Using the illustrative allowable stress of 130 MPa, a joint factor of 1.0, a corrosion allowance of 1.5 mm and a mill under-tolerance of 12.5%, estimate the wall needed and compare it with Schedule 40 at 7.11 mm. Then estimate the hoop stress in the Schedule 40 pipe at the design pressure.

The pressure thickness is 1.2 × 168.3 ÷ (2 × 130) ≈ **0.78 mm**. With the corrosion allowance it is 0.78 + 1.5 ≈ 2.3 mm, and allowing for mill tolerance about 2.3 ÷ 0.875 ≈ **2.6 mm**, well under the Schedule 40 wall.

The hoop stress in Schedule 40 is 1.2 × 168.3 ÷ (2 × 7.11) ≈ **14.2 MPa**. As with the air main, pressure is a small part of what the wall is for; handling, supports, corrosion, expansion stresses and the stock schedule set it. The real check must use the code's allowable stress at the design temperature and its own allowances.
