---
book: brazing-and-soldering-by-the-numbers
chapterSlug: heating-methods
order: 8
title: "Heating methods"
description: "Compare torch, furnace, induction, resistance and dip heating for brazing and soldering, calculate the heat a joint needs and where it should go, and cost a move from torch to induction."
draft: false
---

A capillary joint is made by heat, and the way the heat arrives decides much of its quality. The filler flows towards heat and stops where the joint is cold (Chapter 2); the flux works only in a band around the filler's melting range and is exhausted by too long a heating (Chapter 5); the parts must reach temperature together, though one may be ten times the mass of the other (Chapter 4). Every heating method is a different answer to the same problem: bring the whole joint, and only the joint, to the right temperature, quickly and evenly, and hold it there just long enough.

This chapter calculates the heat a typical joint needs and where it must go, compares the main heating methods, from the brick hearth of 1910 to the induction coil, and costs the manufacturer's move from hand torch brazing to induction for its most common joint.

## The heat a joint needs

A joint needs enough heat to raise the parts in the joint zone to brazing temperature, plus whatever is lost to conduction along the parts, to the air and to fixtures while that happens. The first part is easily estimated.

```figure
type: formula
title: Heat to bring a manifold outlet joint to brazing temperature
formula: Q = Σ (m × c × ΔT)
caption: This is an illustration for the manufacturer's 15 mm outlet, assuming about 0.15 kg of the brass body and 0.02 kg of copper tube around the joint must reach about 750 °C from 20 °C. Losses by conduction and to the air add considerably to these figures.
- Brass body zone, m × c | 0.15 kg × about 380 J/(kg·°C)
- Copper tube zone, m × c | 0.02 kg × about 385 J/(kg·°C)
- ΔT | 730 °C
step: body ≈ 0.15 × 380 × 730 ≈ 41.6 kJ
step: tube ≈ 0.02 × 385 × 730 ≈ 5.6 kJ
step: total ≈ 47 kJ, nearly 90% of it into the body
```

The proportion is the lesson. Nearly nine-tenths of the heat must go into the brass body, which is heavy and conducts heat away from the joint, and only a tenth into the light copper tube. A brazer who plays the flame on the tube, because that is where the filler is fed and where the joint seems to be, brings the tube to temperature in a few seconds while the body lags far behind. The filler melts on the hot tube and forms a fillet at the mouth of the socket, but it will not run into the cold body. That was the leaking manifold of Chapter 1.

## Where the heat should go

The rule that follows is old and simple: heat the heavier part first and most, and the lighter part last. For a tube in a heavy fitting, the flame is played on the fitting all round the socket until the flux shows it is nearly at temperature, then moved briefly onto the tube, and the filler is fed at the mouth of the joint, where it should be drawn in at once towards the hotter body. Hart described the same principle in 1910 for brazing broken iron parts: heat slowly and evenly, avoid overheating any part, and cool evenly to allow for equal shrinkage.

## Torch heating

The torch is the most flexible heating method: cheap, portable and suited to any joint the flame can reach. Its weakness is that it depends entirely on the operator. The choice of gas sets the heat available. Oxy-acetylene gives the hottest, most concentrated flame, which suits small joints and high-temperature fillers but easily overheats thin parts and the flux. Oxy-propane and air-propane give softer, broader flames that spread heat over a larger area, better suited to heavy fittings and to silver brazing, where overheating is the main risk. Hart's brazing burners were air-gas torches, blown by a fan, with the work set in a small hearth of fire-brick built round it to hold the heat, an arrangement that let one operator heat a casting slowly and evenly.

This is an illustration. If the torch delivers about 1.5 kW into the manifold joint after losses, the 47 kJ calculated above takes about 47,000 ÷ 1,500 ≈ **31 seconds**, plus extra time for heat conducted away along the body and tube. That is consistent with the half minute or so that experienced brazers spend heating each outlet. A torch that delivers far more heat into a small area would heat the surface faster than the heat can spread into the body, overheating the flux on the outside while the inside of the joint was still cold.

## Flame chemistry for brazing

Both Hart and Cravens warned that the fuel and flame for brazing should be free of sulphur and soot, and the flame non-oxidising, and that coal or coke fires must not touch the parts. A reducing or neutral flame avoids oxidising the parts under the flux; an oxidising flame grows oxide faster than the flux can remove it. Modern fuel gases are clean, but the flame setting still matters: a slightly reducing flame is the usual choice for silver brazing. The Library covers flame chemistry and the neutral flame in Oxy-Fuel by the Numbers, in its chapter on [flame chemistry and the neutral flame](/reados/publications/oxy-fuel-by-the-numbers/flame-chemistry-and-the-neutral-flame/).

## Furnace heating

A furnace heats whole assemblies evenly, many at a time, with the filler preplaced as rings, foil or paste. Batch furnaces suit small runs; continuous belt furnaces, through which assemblies travel on a mesh belt, suit high volumes. Most production furnace brazing uses a protective atmosphere or vacuum instead of flux (Chapter 5), which leaves no residue to clean. A furnace's even heat removes the operator's skill from the heating, and every joint in an assembly reaches temperature together, so heavy and light parts are no longer a problem. The penalties are slow heating, which can cause liquation of wide-range fillers (Chapter 6), the annealing of whole parts rather than just the joint zone, and the cost of the furnace and its gases.

## Induction heating

Induction heating passes a high-frequency alternating current through a copper coil placed round or near the joint, inducing currents in the parts themselves, which heat by their own resistance. It is fast, local and repeatable: the same coil, power and time give the same joint every time, and heat goes where the coil puts it. Coils can be shaped to put more heat into the heavier part, solving the problem of unequal masses by design rather than by skill. Industrial Electric Heating by the Numbers explains how induction works and why the heated depth depends on frequency and material in its chapter on [induction and infrared](/reados/publications/industrial-electric-heating-by-the-numbers/induction-and-infrared/).

Induction suits high volumes of the same joint, because each joint needs its own coil and settings. It is less suited to one-off work, large assemblies or joints the coil cannot surround. The Open University's brazing guide notes induction is mainly used for ferrous parts, though it is widely used on copper and brass assemblies too, with coils and frequencies chosen for them.

## Resistance heating

Resistance heating passes a large current directly through the joint, as in resistance welding, so that the joint heats by its own resistance between clamps or electrodes. Hamilton's 1918 manual described resistance soldering of spectacle frames and other small parts. The joint was held between jaws, a heavy current heated it until the solder fed in melted and flowed, and the current was cut; the whole cycle took about three to five seconds, depending on the size of the joint. Because only the short length between the jaws heated, about twice the diameter of the work, and the large jaws drew the heat away almost as soon as the current stopped, the parts kept their temper: Hamilton reported that two hardened wires joined this way resisted bending as well at the joint as anywhere else.

```figure
type: stats
title: Resistance soldering of spectacle frames, as Hamilton described it in 1918
caption: Hamilton's figures, with the energy per joint and its cost at an illustrative 30 cents per kilowatt-hour calculated here.
- 1,500 | Joints per kilowatt-hour | for spectacle-frame work
- 2.4 kJ | Energy per joint | 3,600 kJ ÷ 1,500
- 3 to 5 s | Time per joint | heat, solder, cut current
- *0.02 c | Electricity per joint | at 30 cents per kWh
```

Hamilton also noted that the process gave off no fumes or smoke from gas flames, so that workers no longer suffered the fatigue that breathing the combustion products of many small gas flames had caused them. Cravens described electric brazing done in a butt or seam welding machine in the same way. Resistance Welding by the Numbers explains how resistance heating develops its heat in its chapter on [how resistance welding makes heat](/reados/publications/resistance-welding-by-the-numbers/how-resistance-welding-makes-heat/).

## Dip brazing and soldering

Dipping immerses the joint in a bath, of molten filler or of molten salt. Hart and Cravens both described dip brazing for repeat work: parts painted with graphite wherever the spelter was not wanted, heated, and lowered into a bath of molten spelter with molten flux floating on top, so that the flux cleaned the parts on the way in and the spelter wetted and filled the joints. Salt bath brazing, listed in the Open University guide, heats preassembled parts with preplaced filler in a bath of molten salt that both heats evenly and fluxes. Dip soldering and wave soldering apply the same idea to soldered joints. Dipping is fast and even, but it heats the whole immersed part and needs careful masking, drainage and cleaning.

## Cooling

Heating gets most of the attention, but the way a joint cools matters too. A joint moved or loaded before the filler has frozen can crack or separate, especially with wide-range fillers that pass through a mushy stage. Quenching a hot brazed joint in water, a common way of breaking up flux residue quickly, is acceptable for many copper and steel joints but can crack brittle parts, such as carbide tips or cast iron, and distort thin assemblies. Hart advised that brazed parts, especially intricate castings with long arms, be cooled slowly and evenly so that every part shrank together. The manufacturer's work instructions now state, for each joint, how long the part must be left still after brazing and whether it may be quenched; for the carbide tools, the answer is never, for reasons Chapter 9 explains.

## Temperature measurement

Every heating method needs a way of knowing when the joint is at temperature. In torch brazing, the flux is the usual indicator, turning clear and fluid as it becomes active, backed by the colour of the work and the behaviour of the filler. Temperature-indicating crayons and paints, which melt or change colour at a stated temperature, check the brazer's judgement during training and process setting. Furnaces and induction cells use thermocouples or pyrometers, and record the temperature cycle so that each batch has evidence of what it saw. Setting up a new joint by measuring its temperature, rather than by watching it, turns a brazer's feel into a number that can be written down and repeated.

## Comparing the methods

```figure
type: compare
title: Heating methods for brazing and soldering
cols: Best for | Strengths | Limits
caption: General characteristics. The choice depends on volume, joint size and access, materials, and the cost of equipment and labour.
- Torch | one-off and small batch; repairs | cheap, flexible, portable | depends on operator skill; uneven heat
- Furnace | many assemblies, many joints each | even heat; atmosphere, no flux | slow; anneals whole parts; equipment cost
- *Induction | high volume of one joint | fast, local, repeatable | a coil for each joint; access needed
- Resistance | small parts, wires, terminals | very fast; parts keep their temper | small joints only; electrodes wear
- Dip | repeat work, sheet assemblies | fast, even, many joints at once | heats whole part; masking and cleaning
```

## The running case: torch or induction?

This is an illustration. The manufacturer's 15 mm outlet is its commonest joint, about 40,000 a year, all brazed by hand with air-propane torches. An induction supplier proposed a brazing cell with a coil shaped to put most of the heat into the brass body, a preformed filler ring on each tube, and a timed heating cycle. The cell would cost an illustrative A$45,000, excluding GST, installed.

The trial showed that induction cut the time per joint by about 0.6 minutes, because heating was faster and the operator no longer had to judge it, and gave a consistent fillet with the calculated quantity of filler. At 40,000 joints, the saving was about 40,000 × 0.6 ÷ 60 = **400 hours** a year, worth about 400 × 70 = **A$28,000** at A$70 an hour, plus filler savings and fewer rebrazed joints. The simple payback was about 45,000 ÷ 28,000 ≈ **1.6 years** on labour alone. The manager approved the cell for the 15 mm outlets and kept torch brazing for the 22 mm outlets and the steel headers, which were made in smaller numbers and in more varied sizes.

## A failure: the eroded tube

This is an illustration. A new brazer, trying to speed up, changed from air-propane to an oxy-acetylene torch for the 15 mm outlets and turned up the flame. Within a day, the pressure test found pinholes in several copper tubes just inside the brazed joints.

The concentrated flame had heated the thin tube wall far above the filler's brazing range, and the molten filler had dissolved copper from the overheated tube, a process called erosion, until the wall was thinned through in places. The flux had also been exhausted, leaving dark, oxidised joints. The brazer went back to air-propane, with training on heating the body first, and the work instruction now names the torch, gas and tip for each joint. Erosion is a reminder that more heat is not better heat: the filler that wets the parts can also dissolve them if they are too hot for too long.

## Exercise: heat for a 22 mm outlet

The manufacturer's 22 mm outlet has about 0.25 kg of brass body and 0.04 kg of copper tube in the joint zone. Estimate the heat needed to bring them from 20 °C to 750 °C, the share that must go into the body, and the heating time at 2.0 kW delivered, before losses.

The body needs about 0.25 × 380 × 730 ≈ **69.4 kJ** and the tube about 0.04 × 385 × 730 ≈ **11.2 kJ**, a total of about **80.6 kJ**, of which about 86% must go into the body. At 2.0 kW, heating takes about 80,600 ÷ 2,000 ≈ **40 seconds**, plus losses. The 22 mm joint needs about 70% more heat than the 15 mm joint, and the same habit of heating the body first, which is why the manufacturer kept experienced torch brazers on the larger outlets while induction took over the smaller ones.
