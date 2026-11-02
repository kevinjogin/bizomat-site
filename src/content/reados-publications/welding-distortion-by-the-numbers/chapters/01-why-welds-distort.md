---
book: welding-distortion-by-the-numbers
chapterSlug: why-welds-distort
order: 1
title: "Why welds distort"
description: "Follow a weld from heating to cooling: expansion held back by cold metal, yielding at a temperature rise of about a hundred degrees, and the shrinkage left behind that pulls parts out of shape."
draft: false
---

A weld is a small region of metal heated to melting and beyond, surrounded by metal that stays relatively cool. The hot metal tries to expand, the cool metal holds it back, and when the weld cools, it tries to shrink to less than its original size and pulls the cool metal with it. That pull is the cause of every kind of welding distortion, and of the residual stresses that remain in a weld that cannot distort. Understanding it, in numbers, explains why distortion happens, why some joints distort more than others, and why some of the obvious remedies make things worse.

This chapter follows a weld through its heating and cooling, shows why the metal near a weld yields at a temperature rise of only about a hundred degrees, names the main kinds of distortion, and introduces the fabrication shop whose distortion problems the rest of the book addresses.

## Expansion held back

Steel expands when heated, by about 12 millionths of its length for each degree Celsius, so a 100 mm length heated by 600 °C would grow by about 0.72 mm if it were free. Near a weld, it is not free. The metal being heated is surrounded by cooler metal that does not expand as much, and that holds it back. The hot metal is squeezed, in compression, and the cooler metal around it is stretched, in tension.

How much squeezing can the hot metal take before it gives way? The answer is surprisingly little. If the hot metal were completely prevented from expanding, its compressive stress would rise by about E × α for each degree, where E is the steel's stiffness, about 205,000 MPa, and α its expansion coefficient.

```figure
type: formula
title: Temperature rise at which fully restrained steel begins to yield
formula: ΔT_yield = σ_y ÷ (E × α)
caption: This is an illustration for a structural steel with a yield stress of about 275 MPa at room temperature. In reality the yield stress falls as the steel heats, so yielding starts even sooner.
- σ_y | about 275 MPa
- E | about 205,000 MPa
- α | about 12 × 10⁻⁶ /°C
step: E × α ≈ 2.46 MPa per °C
step: ΔT_yield ≈ 275 ÷ 2.46 ≈ 112 °C
step: metal heated more than about a hundred degrees above its surroundings and held back will yield
```

Around a weld, the metal reaches hundreds of degrees, far more than the 112 °C or so needed to yield it. And as it heats, its yield stress falls, until near the weld it has very little strength at all. The hot metal therefore yields: it is squashed permanently, becoming shorter and thicker than it would have been, while it is hot.

## Shrinkage on cooling

When the weld and the metal around it cool, they contract. The metal that was squashed while hot is now shorter than the space it came from, because it was compressed into a smaller length while it was soft. As it cools and regains its strength, it tries to shrink to that shorter length, and it pulls on the surrounding metal to do so. The weld metal itself, which was liquid and filled the joint at its melting temperature, shrinks too as it cools to room temperature.

The result is a band of metal along the weld that wants to be shorter, and narrower, than the space it occupies. Either it pulls the parts towards it, which is distortion, or the parts resist, which leaves the band in tension and the surrounding metal in compression, which is residual stress. Usually some of each happens, in proportions set by how stiff the parts are and how firmly they are held.

```figure
type: steps
title: What happens to the metal beside a weld
caption: A simplified sequence for a single weld pass on steel. Real behaviour depends on the heat input, the plate thickness and the restraint, but the order is general.
- Heating | the metal near the weld expands; cooler metal around it holds it back
- Yielding | beyond a rise of roughly 100 °C, the restrained hot metal is squashed permanently
- *Peak temperature | the weld is molten; the metal beside it is soft and has little strength
- Cooling | the squashed metal and the weld metal contract and regain strength
- Shrinkage | the cooled band pulls the parts towards it: distortion, residual stress, or both
```

## The early welders' rule

The Davis-Bournonville course of 1919 put the principle in a phrase its students would remember: whatever goes up must come down, and whatever is expanded by heat must contract again when the temperature returns. It warned that a welder who tried to prevent expansion or contraction was likely to crack the joint or the work somewhere else, and described the beginner whose sound repair to a casting is followed by a fresh crack elsewhere as the casting cools, mending in one place and breaking in another. Its remedy for castings was preheating, so that the whole part expanded and contracted together, rather than one small region against the rest.

The lecture also explained why the oxy-acetylene flame was a poor tool for preheating: it gave a high temperature but comparatively little heat, at a high cost, so large castings were preheated with charcoal, oil blowtorches or furnaces. The same distinction between temperature and quantity of heat explains much of modern distortion behaviour: a concentrated, intense heat source makes a narrow hot band with steep temperature differences, while a broad, gentle heat spreads the expansion more evenly.

## Stainless steel and aluminium

Different metals distort differently, and the arithmetic of this chapter shows why. Austenitic stainless steel expands about half as much again as carbon steel for each degree, and conducts heat only about a third as well, so the heat of a weld stays concentrated in a narrow band that expands strongly; stainless steel fabrications are notorious for distortion, as the shop's panels show. Aluminium expands about twice as much as steel, but conducts heat several times better, so the heat spreads widely and a large region expands; aluminium also has a low stiffness and loses strength quickly as it heats, so it yields easily. Both need more care than carbon steel, and techniques that suit steel, such as long continuous welds at slow speeds, can be disastrous on thin stainless steel.

## Distortion during welding and after

Distortion changes as a weld is made. While the arc is near, the hot metal expands and the part may bend away from the weld; as the weld cools, the part bends back and past its starting position towards the weld. A welder who checks a part while it is still hot may see very little distortion and be surprised by how much there is when it has cooled. Measurements for control are taken when the part has cooled to near room temperature, and procedures that depend on the part being in a particular position, such as presetting (Chapter 8), are judged by the cooled result.

## Every pass adds a little

In a joint made in several passes, each pass adds its own shrinkage to the joint's total. The first passes, laid when the joint is most flexible, cause the most movement; later passes, laid when the joint is stiffer, cause less movement but more stress. That is why distortion in multi-pass joints is often controlled by what happens in the first few passes, such as tacking well, balancing the root passes on both sides, and getting the sequence right early, rather than by trying to correct it at the end.

## Kinds of distortion

The shrinking band of metal along a weld acts in several directions at once, and produces several kinds of distortion.

```figure
type: compare
title: The main kinds of welding distortion
cols: What shrinks | What you see
caption: General descriptions. Most welded parts show more than one kind at once; the chapters that follow deal with each.
- Transverse shrinkage | the weld across its width | parts drawn together; butt-welded plates shorter across the seam
- Longitudinal shrinkage | the weld along its length | members shortened; bowing when the weld is off the neutral axis
- *Angular distortion | more shrinkage at the weld face than the root | plates kinked at a butt weld; flanges tilted at fillets
- Rotational distortion | the gap opening or closing ahead of the weld | edges drawn together or apart as welding proceeds
- Buckling | compressive residual stress in thin plate | wavy panels; oil-canning
```

Chapter 2 deals with transverse shrinkage and the rotational distortion that Whittemore called creep; Chapter 3 with longitudinal shrinkage and bowing; Chapter 4 with angular distortion; and Chapter 5 with buckling.

## Heat input decides how much

The amount of distortion depends on how much metal is heated enough to yield, which depends mainly on how much heat is put into the joint per unit length, the heat input, and how quickly the surrounding metal carries it away. More heat input, from larger welds, more passes or slower travel, heats a wider band of metal past the yield temperature and produces more shrinkage. Thicker plate carries heat away faster and resists distortion more, but needs larger welds. Weld Repairs That Hold calculates heat input for two travel speeds in its chapter on [heat, expansion and shrinkage](/reados/publications/weld-repairs-that-hold/heat-expansion-and-shrinkage/), and the KEVOS® [welding heat input calculator](/tools/welding-heat-input/) does the arithmetic.

## Weld volume

Because heat input rises with the weld's size, the volume of weld metal is a good first guide to how much a joint will distort. A fillet weld's cross-section rises with the square of its leg, so an oversized fillet adds distortion out of proportion to its extra strength. Designing Welded Joints by the Numbers shows in its chapter on [weld volume, cost and distortion](/reados/publications/designing-welded-joints-by-the-numbers/weld-volume-cost-and-distortion/) how sizing welds to their loads, rather than by habit, cuts weld metal and distortion together. The cheapest distortion control is the weld that is not oversized. Next cheapest is the weld that is not there at all: a bent plate instead of two welded ones, a rolled section instead of a fabricated one, a bolted joint where welding is not essential. Every weld removed from a design removes its shrinkage with it, and the production manager's first question for each problem product was which welds could go.

## Distortion and residual stress are partners

A joint that is free to move distorts and is left with relatively low residual stress; a joint that is held rigidly cannot distort and is left with high residual stress, often close to the steel's yield stress near the weld. Clamping a part firmly while welding reduces distortion, but locks in stress, which can crack the weld as it cools, distort the part when it is released or later machined, and reduce its resistance to fatigue and brittle fracture. Chapter 6 deals with this trade-off; the point here is that distortion and residual stress are two outcomes of the same shrinkage, and reducing one usually increases the other unless the shrinkage itself is reduced.

## The running case

This is an illustration. The fabrication shop's three problem products are:

- **plate girders**, about 8 m long, made by welding two flange plates to a web plate with fillet welds, which come out of the shop bowed and with their flanges tilted;
- **machine base frames**, of welded hollow sections with a machined top plate, whose mounting faces warp after welding so that machinery rocks on them;
- **stainless steel panels**, 1.5 mm thick, welded to frames for food-processing equipment, which buckle into waves that customers reject.

Each of the three shows a different kind of distortion, and the production manager wants to know, for each, how much to expect, why it happens and what can be done.

## Measuring distortion

Control starts with measurement, made the same way each time. The shop records, for each product, the dimensions that matter before and after welding: the girder's camber and sweep along its length and the tilt of its flanges; the base frame's top plate flatness; the panels' waviness. A straight-edge, feeler gauges, a long string line, a laser level and a dial gauge cover most needs. The measurements turn complaints into numbers, show which kind of distortion matters most on each product, and let the shop test whether a change of procedure helped. They also give the shop a baseline: without knowing how much a girder bowed under the old procedure, nobody can say whether a new sequence improved it, and arguments about distortion become arguments about memory.

## A failure: the clamped frame

This is an illustration. Trying to stop a base frame warping, a welder had clamped it hard to a heavy table at every corner and welded it while clamped. The frame came off the table flat. A day later, after its top plate was machined, it had warped again, and a crack had appeared at one corner weld.

The clamps had not removed the shrinkage; they had stopped it from showing as distortion and turned it into residual stress, which was released partly when the clamps came off and partly when machining removed stressed metal from the top plate. The corner crack had opened under the high stress as it cooled. The fix, worked out in later chapters, combined smaller welds, a balanced sequence and machining in two stages.

## Exercise: when does it yield?

A strip of steel with a yield stress of 350 MPa is heated while its ends are held completely fixed. Taking E = 205,000 MPa and α = 12 × 10⁻⁶ /°C, at what temperature rise will it begin to yield? If it is then heated to 400 °C above its starting temperature and cooled back, what happens?

The temperature rise to yield is about 350 ÷ (205,000 × 12 × 10⁻⁶) = 350 ÷ 2.46 ≈ **142 °C**. Heated to 400 °C above its start, the strip yields in compression, and since its yield stress falls with temperature, it is squashed permanently by much of the extra expansion it was prevented from making.

When it cools back to its starting temperature, it tries to contract to a length shorter than the space between its fixed ends, because it was squashed while hot. The fixed ends prevent it, so it is left in tension, and if the restraint is high enough, the tension reaches the yield stress. That is the residual stress of a fully restrained weld, and the reason restraint and cracking go together.
