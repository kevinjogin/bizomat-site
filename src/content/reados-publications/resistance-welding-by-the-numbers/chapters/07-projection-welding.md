---
book: resistance-welding-by-the-numbers
chapterSlug: projection-welding
order: 7
title: "Projection welding"
description: "Weld nuts and embossed parts by concentrating current and force on projections: sharing current between projections, collapse and follow-up, and push-out testing."
draft: false
---

In spot welding, the electrode face decides where the current flows. In projection welding, the part decides. Small raised projections are formed on one of the parts, and the electrodes are large and flat. When force is applied, the parts touch only at the projections, so the current and force concentrate there and each projection becomes a weld. Several welds can be made at once, in exact positions, with electrodes that hardly wear, which is why projection welding is the standard method for attaching weld nuts, studs and brackets to sheet.

This chapter attaches the cabinet's twelve M8 weld nuts. It looks at how current and force divide between projections, why the projections must all touch at once, what happens as they collapse, and how the welds are tested.

## How projection welding works

TWI describes projection welding as a process in which current, force and weld time are concentrated on raised projections on the surface, and notes that it is generally used for welds in thicker materials than spot welding. Hamilton and Oberg listed "point" or "projection" welding among the special resistance methods already in use in 1918.

The sequence is the same as a spot weld: squeeze, weld, hold. The difference is in where the heat appears. At the start of the weld each projection touches the sheet over a very small area, so the contact resistance and current density there are high, and heating starts at the projection tips. As the projections heat and soften, the force pushes them down. By the end of the weld they have collapsed into the joint, leaving the nut seated on the sheet with a small weld under each former projection.

Because the welds are located by the projections, the electrodes can be large, flat and cool. Their faces carry low current density and pressure, so they wear slowly and leave little mark on the visible side of the sheet.

```figure
type: steps
title: The stages of a projection weld on an M8 weld nut
caption: Current and force concentrate at the three projection tips until they collapse; the hold time keeps the nut seated while the welds freeze.
- Locate | nut placed over the hole on an insulated locating pin
- Squeeze | flat electrodes close; the three projections touch the rail
- *Weld | current flows through the projection tips, which heat and soften
- Collapse | force pushes the projections down into the joint
- Hold | force stays on while the welds freeze; the nut seats flat
```

## The cabinet's weld nuts

This is an illustration. Each cabinet has twelve M8 hex weld nuts attached to its 2.0 mm steel mounting rails, for equipment plates and hinges: 480 nuts a day. Each nut has three projections on its base. The shop's schedule, set by trials with the nut supplier's recommendations as a starting point, is 12 kA for six cycles (0.12 s) with a force of 4.5 kN, through flat electrodes 25 mm in diameter. The nut is located over a clearance hole in the rail by a pin in the lower electrode.

If the three projections share equally, each carries:

- current, 12,000 ÷ 3 = **4,000 A**;
- force, 4,500 ÷ 3 = **1,500 N**.

The total current is higher than a single cabinet spot weld, but each projection weld receives less than half the current of a spot. That works because the projection tip is so small at the start of the weld that the current density there is high, and because the heat is generated in the projection itself, which is surrounded by air rather than clamped between water-cooled electrodes.

## Every projection must touch at once

Equal sharing depends on all the projections touching the sheet together. If one projection is shorter than the others, the first contact is made on the remaining projections alone, and the current and force divide between fewer paths.

This is an illustration. Suppose one of the three projections on a damaged nut is 0.2 mm shorter than the other two. When the electrodes close, the nut rests on the two taller projections. The current divides between them, so each carries about 12,000 ÷ 2 = 6,000 A. The heat in each, following current squared, is (6,000 ÷ 4,000)² = **2.25 times** what was intended. They heat and collapse very quickly, often with expulsion, while the short projection receives little current until the nut has tilted or settled onto it. The result is two overheated welds and one weak one, a nut sitting at an angle and spatter that can reach the threads.

```figure
type: compare
title: Current and heat per projection on a three-projection weld nut
cols: All three touch | One projection 0.2 mm short
caption: This is an illustration at a total of 12 kA and 4.5 kN. Losing one contact at the start of the weld raises the heat in the other two by more than double.
- Projections carrying current | 3 | 2 at first
- Current per projection | 4,000 A | about 6,000 A
- Relative heat per projection | 1.00 | 2.25
- Force per projection | 1,500 N | 2,250 N
- Likely result | three sound welds | expulsion, tilted nut, one weak weld
```

The same reasoning applies to sheet that is not flat under the nut, to a rail with a burr around the hole, and to electrodes whose faces are not parallel. The electrode faces are checked for parallelism with a pressure-sensitive film, and the nuts are bought to a specification that controls projection height.

## Collapse and follow-up

The projections collapse in a few cycles. This is an illustration. If the projections are 1.0 mm high and collapse in about two cycles (0.04 s), the upper electrode must follow down at an average of 1.0 ÷ 0.04 = **25 mm/s**, while maintaining force. Chapter 4 introduced follow-up for spot welding; it matters even more here. If the moving head is heavy or its cylinder is slow, the force drops momentarily as the projections soften, the contact opens slightly and the current arcs at the projection, causing expulsion and burning. Projection welders are built with low-inertia heads, fast-acting cylinders or servo drives, and sometimes a spring cushion that keeps force on the electrodes during the first rapid movement.

The schedule must also give the projections time to collapse completely. If the current stops too soon, the nut sits on partly collapsed projections with a gap underneath; if it continues too long after collapse, the current flows through the whole nut face and heats it, which can distort the threads.

## The locating pin must not conduct

The pin that locates the nut over the hole passes through the nut's thread and the rail's hole. If the pin is metal and touches both, it forms a parallel path for the current that bypasses the projections, carries current through the threads and can arc or weld the pin to the nut. Locating pins for projection welding are made from, or sleeved with, insulating material such as a ceramic, and are often spring-loaded so the nut can move down as the projections collapse.

A worn or cracked pin sleeve is a common cause of intermittent problems: most welds are good, but now and then a nut welds weakly, or a burn mark appears in its thread. The shop's daily check includes the locating pin.

The large flat electrodes need attention too, even though they wear slowly. Each weld leaves a faint imprint of the nut on the upper electrode face, and over thousands of welds the face can develop shallow hollows or raised rims around the imprint. A face that is no longer flat presses harder on some projections than others, producing the same unequal sharing as a short projection. The shop resurfaces the upper electrode on a lathe at a set interval and checks flatness with a straightedge whenever push-out results drift.

## Embossed projections in sheet

Projections need not be on a fastener. Sheet-to-sheet projection welds are made by pressing small round embossments into one sheet, usually the thicker one, before welding it to the other. Several embossments can be welded in one stroke, so a bracket with four projections is attached in one weld instead of four spots. The embossment height, diameter and spacing are designed with the press tooling and must be consistent, because, as above, an embossment that is low or crushed in handling will not share the current. TWI notes that projection welding is mainly used in the electrical, automotive and construction industries, which matches its strength: many accurately placed welds in one fast cycle.

## Setting the schedule by trial

The nut supplier's data gave a starting schedule, but the shop confirmed it on its own machine with the production rail and nuts. This is an illustration. With force fixed at 4.5 kN and time at six cycles, it welded five nuts at each of four currents, pushed them out and examined the fracture faces:

| Current | Mean push-out force | Fracture | Comment |
|---|---|---|---|
| 10 kA | 7.1 kN | through two welds, one projection barely joined | collapse incomplete |
| 11 kA | 9.0 kN | through all three welds | collapse complete |
| 12 kA | 9.6 kN | rail torn around the nut | chosen |
| 13 kA | 9.4 kN | rail torn; spatter on two nuts | approaching expulsion |

The pattern is the projection-welding version of the weld lobe in Chapter 2. At low current the projections do not fully collapse and some barely weld. As current rises, all three weld and the push-out force rises until the rail, not the welds, becomes the weakest part. Beyond that, extra current adds expulsion and thread spatter without adding strength. The shop chose 12 kA, where the rail tore around the nut and none of the nuts spattered, and set its daily push-out check against the customer's minimum with a margin taken from these results.

## Projection or spot?

The twelve nuts could, in principle, be held in place and spot-welded, but each nut would need three separate spots, aligned under the electrode, with all the shunting and positioning problems of Chapter 5. Projection welding makes all three welds in one 0.12 s pulse, located exactly by the part, with flat electrodes that need dressing rarely. At 480 nuts a day, the time saved is large, and the consistency is better.

The cost is in the part and the machine. Weld nuts with controlled projections cost more than plain nuts, embossed sheet needs press tooling, and projection welders need high force, rapid follow-up and higher current for multi-projection parts. Coated weld nuts and coated sheet also change the schedule, as Chapter 9 explains for spot welds. For a few nuts on a prototype, a press-in or rivet nut may be cheaper; for production, projection welding is usually the better choice.

## Testing weld nuts

A weld nut that looks well seated can still have weak welds, so the shop tests nuts destructively and by gauge:

- **Push-out test.** A test rail with nuts welded on the production schedule is set in a fixture, and a ram pushes each nut off the rail from the thread side. The customer's specification requires a minimum push-out force for the M8 nut on 2.0 mm rail; the shop tests three nuts at the start of each shift and after any electrode change.
- **Thread gauge.** Every nut is checked with a go thread gauge before the rail leaves the cell, to catch spatter or distortion in the thread.
- **Visual check of seating.** Nuts must sit flat, with no visible gap under the base and no tilt.

```figure
type: checklist
title: Weld nut cell checks
caption: This is an illustration of the shop's routine for the M8 nuts on 2.0 mm rail.
- x Electrode faces parallel | pressure film check at start of shift
- x Locating pin insulation intact | no cracks or burn marks
- x Push-out test, three nuts | above the customer's minimum
- x Thread gauge, every nut | go gauge passes freely
- x Seating | flat, no gap or tilt
- *? Projection height of new nut batch | measured on a sample before use
```

## A failure: spatter in the threads

This is an illustration. Assemblers began reporting that some M8 screws would not start in the cabinet nuts, and that a few nuts on each rail had a gritty feel. Inspection showed small beads of spatter inside the threads of about one nut in thirty, and those nuts were often slightly tilted.

The push-out results were normal, which ruled out a general loss of weld strength. The tilt and spatter together pointed to unequal sharing between projections. A sample of nuts from the latest delivery showed projection heights varying by up to 0.25 mm on the same nut, against a supplier specification of 0.10 mm. With one low projection, the other two had been carrying more than double their intended heat, expelling metal that sprayed up through the hole into the thread.

The batch was returned, incoming inspection of projection height on a sample of each delivery was added to the procedure, and the go thread gauge check on every nut was introduced so that any nut with spatter is caught in the cell rather than on the assembly line. Affected rails were reworked by running a tap through the threads and re-gauging, with the customer's agreement.

## Exercise: a four-projection nut

The shop trials a square weld nut with four projections, using the same 12 kA and 4.5 kN. Calculate the current and force per projection when all four touch. Then calculate the current per projection and the relative heat, compared with the four-projection design value, if one projection is short and only three carry current at the start.

With four projections touching, each carries 12,000 ÷ 4 = **3,000 A** and 4,500 ÷ 4 = **1,125 N**. If only three touch, each carries 12,000 ÷ 3 = **4,000 A**, and the relative heat is (4,000 ÷ 3,000)² ≈ **1.78** times the design value.

A short projection is less damaging on a four-projection nut than on a three-projection nut, where it raised the heat 2.25 times, because the current is shared among more paths. But each projection on the four-projection nut carries less current and force when all are touching, so the schedule would need its own trials, and the shop would check whether 3,000 A per projection forms sound welds or whether the total current must rise.
