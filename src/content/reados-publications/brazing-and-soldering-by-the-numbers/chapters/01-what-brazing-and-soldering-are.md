---
book: brazing-and-soldering-by-the-numbers
chapterSlug: what-brazing-and-soldering-are
order: 1
title: "What brazing and soldering are"
description: "Define brazing, soldering and braze welding by temperature and by how the filler fills the joint, see how a bond forms without melting the parts, and weigh where capillary joints beat welding."
draft: false
---

A brazed or soldered joint looks simple: a thin line of filler metal between two parts, perhaps with a small fillet at the edge. Yet it does something welding cannot. It joins copper to steel, carbide to steel, a thin tube to a thick block, or a hundred joints in one furnace, without melting either part, and often with so little heat that the parts barely distort. The price is that the joint depends on things that cannot be seen: a gap measured in hundredths of a millimetre, surfaces clean at the atomic level, and a filler that wets those surfaces and is drawn into the gap.

This chapter defines brazing and soldering, explains how a bond forms without melting the parts, separates them from braze welding, and sets out where capillary joints suit and where they do not. It introduces the manufacturer whose joints the rest of the book follows.

## Definitions by temperature

Brazing and soldering both join metal parts with a filler metal that melts at a lower temperature than the parts, so that the parts themselves do not melt. They are separated by convention, by the temperature at which the filler melts. The Open University's materials guide on brazing describes brazing fillers as those melting above 450 °C but below the melting point of the materials being joined; fillers melting below 450 °C are solders, and the process is soldering. The boundary is a convention, not a change in physics, and the same principles of wetting and capillary flow govern both.

```figure
type: bars
title: Melting and working temperatures across the joining processes
unit: °C
max: 1600
caption: Pure-metal melting points are standard values; the eutectics are from NIST's solder phase diagrams; the silver-copper and copper-zinc brazing temperatures are from the Open University's brazing table. Steel melts over a range depending on composition; about 1,500 °C is shown.
- Tin-lead eutectic solder | 182
- Tin-silver-copper eutectic solder | 216
- *Boundary between soldering and brazing | 450
- Aluminium melts | 660
- Silver-copper brazing filler, brazing temperature | 820
- Copper melts | 1085
- Copper-zinc brazing filler, up to | 1120
- Steel melts, about | 1500
```

The figure shows the ladder on which every choice in this book sits. A tin-lead solder works hundreds of degrees below the copper it joins; a silver brazing filler works several hundred degrees below steel; a copper-zinc filler works close to copper's own melting point, which is why it can be used on steel and cast iron but not on copper itself without care.

## How the bond forms

In a weld, the parts melt and mix, and the joint is the parts' own metal, resolidified. In a brazed or soldered joint, the parts stay solid. The molten filler wets their surfaces, spreading over them as water spreads over clean glass, and a thin layer of the parts' metal dissolves into the filler or the filler diffuses a short distance into the parts. As the joint cools, the filler solidifies and is bonded metallurgically to each part through that thin interface layer. The bond is not glue in the sense of an adhesive sticking to a surface; it is metal joined to metal through a thin zone where they have alloyed.

Hart's 1910 manual put the idea in its own terms, describing a solder as a metallic glue that must amalgamate with, or wet, the metals it joins. He also observed that the melted weld of the gas flame could be seen as a soldering process in which the metal provides its own solder, an image that captures the continuity between the processes. The word "amalgamate" was loose, but the requirement it described, that the filler must wet and alloy with the surfaces, is exactly right.

## Why the filler flows into the gap

The filler reaches the inside of a joint by capillary action. When a liquid wets a solid, it is pulled along the surface, and in a narrow gap between two surfaces it is pulled in from both sides, so a molten filler placed at the edge of a well-made joint is drawn right through it, even upwards against gravity. Chapter 2 calculates the forces and shows why the gap must be narrow. For now, the point is that brazing and soldering depend on two conditions that welding does not: the surfaces must be wettable, which means clean and free of oxide at the moment the filler arrives, and the gap must be narrow and even.

## Braze welding is different

Braze welding uses a brazing filler, but not capillary action. The joint is prepared like a weld, with a groove, and the filler is deposited into it with a torch, building up a bead that wets the groove faces. Braze welding is tolerant of wide gaps and suits repairs of cast iron and joints in galvanised or thin steel, where its lower heat avoids cracking or burning off the coating. Weldability by the Numbers discusses braze welding of cast iron in its chapter on [cast iron, graphite, silicon and repair](/reados/publications/weldability-by-the-numbers/cast-iron-graphite-silicon-and-repair/). This book deals mainly with capillary brazing and soldering, and notes braze welding where it matters.

## Stronger than the filler

A well-made brazed joint can be surprisingly strong, stronger than the filler metal on its own. Hart reported that tests of well-brazed iron joints showed them 10 to 25% stronger than the iron, and claimed that a brazed cast iron part would never fracture at the braze. Those claims belong to their time and to particular joints, but modern tests point the same way for a different reason. A thin layer of filler, bonded to stronger parts on both sides, cannot stretch or narrow freely when it is loaded, because the parts hold it; the constraint lets it carry a stress far above its own strength as a bar. Lucas-Milhaupt's test series, discussed in Chapter 2, recorded a tensile strength of about 930 MPa in a stainless steel butt joint with a silver filler at the best clearance, far higher than such a filler would reach in a tensile test of its own. The effect falls away as the gap widens and the filler layer behaves more like a bar of filler, which is one more reason why gaps are kept small.

## What capillary joints do well

Brazing and soldering have advantages that make them the first choice for many joints:

- **No melting of the parts**, so thin parts can be joined to thick ones, and parts close to their finished shape and properties stay that way.
- **Low distortion**, because the heat is lower and often spread evenly over the whole assembly.
- **Dissimilar metals**, such as copper to steel, brass to stainless steel or carbide to steel, which are difficult or impossible to weld together.
- **Sealed joints**, because the filler fills the whole gap, which suits pipework, heat exchangers and refrigeration.
- **Many joints at once**, in a furnace or by induction, which suits production.
- **Electrical conduction**, in soldered and brazed electrical joints.

## What they do less well

They also have limits. The filler is usually weaker than the parts, so joints are designed as laps or sleeves, not butts (Chapter 4). The joint loses strength at temperatures approaching the filler's melting point, so a soldered joint is no use in a hot place and a silver-brazed joint is limited well below red heat. The joint needs close fit-up and clean surfaces, and the flux, if used, must be removed or it may corrode the joint. Dissimilar metals in the joint may corrode galvanically in wet service, a point Weldability by the Numbers makes in its chapter on [joining different metals](/reados/publications/weldability-by-the-numbers/joining-different-metals/). And the joint's quality is hard to see from outside, because what matters is inside the gap.

```figure
type: compare
title: Brazing, soldering and welding compared
cols: Soldering | Brazing | Fusion welding
caption: General characteristics. Strength depends on the filler, the joint design and the parts; the Library compares joining methods more broadly in Choosing a joining method.
- Filler melts | below 450 °C | above 450 °C, below the parts | parts melt, with or without filler
- How it fills | capillary | capillary | deposited into a groove or fused
- Typical joint | lap, socket, through-hole | lap, socket, sleeve | butt, fillet, groove
- Strength | lowest | moderate to high | highest
- Heat and distortion | lowest | moderate | highest
- Dissimilar metals | many | many | limited
```

## Where capillary joints are found

Brazed and soldered joints are everywhere once you look. Copper water and gas pipes in buildings are joined by soldering or brazing into capillary fittings. Refrigeration and air-conditioning circuits, with their copper tube, brass valves and steel compressor shells, are brazed. Car radiators, heater cores and the heat exchangers of air conditioners are brazed in furnaces, hundreds of joints at a time. Carbide tips on saw blades, drills and turning tools are brazed to their steel bodies. Electrical machines have brazed joints in their windings and bars, and every electronic circuit board carries hundreds or thousands of soldered joints. Jewellers have brazed gold and silver, which they often call soldering, for thousands of years. Across all of them, the same three conditions recur: a narrow, even gap, clean surfaces, and enough heat at the right place.

## A short history

Hart's 1910 manual listed iron, brass, copper, gold and silver as the metals joined by brazing, and described the work: flux the joint, add the filler, called spelter, heat until it melts and runs in, and finish the joint. It also described dip brazing, in which parts were lowered into a bath of molten spelter under a layer of molten flux, a production method for repeat work. Cravens's 1921 manual noted that aluminium had so far been practically impossible to solder commercially, and that most of the many processes devised for it had failed. The century since has added silver and nickel fillers, controlled-atmosphere and vacuum furnaces, induction heating, aluminium brazing for heat exchangers and lead-free solders for electronics, but the work Hart described, flux, filler and heat, is recognisably the same.

## The running case

This is an illustration. The manufacturer in this book employs fourteen people. Its main product is a range of hydronic heating manifolds: brass bodies with copper tube outlets, silver brazed by hand with a torch, and larger steel headers with copper tube branches, brazed in batches. Its control boxes have soldered electrical connections, and it re-tips carbide cutting tools for a local machine shop, brazing new carbide inserts onto steel shanks.

In the past year, the manufacturer has had three manifolds returned for leaks at brazed joints, a run of carbide tips that cracked in the machine shop's first week of use, and a question from a large customer about whether its solder contained lead. The production manager, who came from a machining background, wants to understand the processes well enough to fix all three. This is an illustration, not a real business.

## The cost of a joint

Brazing and soldering are often chosen because they are cheap, and much of their cost lies outside the filler. This is an illustration. A silver-brazed copper-to-brass joint on a manifold uses about 0.6 g of filler, perhaps A$1.10 worth at an illustrative price, excluding GST, and a little flux and gas. But it also takes the brazer about two and a half minutes, including cleaning, fluxing, heating, cooling and cleaning off the flux, which at a labour cost of A$70 an hour is about A$2.90. The filler is less than a third of the joint's cost, and a leaking joint that comes back from the field costs many times the joint itself. Chapter 10 builds the full cost of a joint; the point here is that saving filler or time at the expense of a sound joint is rarely a saving.

## A failure: the joint that looked perfect

This is an illustration. One of the returned manifolds leaked at a copper outlet where the outside of the joint showed a neat, continuous fillet of silver filler all the way round. The production manager assumed the brazer had done good work and that the tube had cracked. Sectioning the joint showed otherwise: the filler had formed the fillet at the mouth of the socket but had penetrated only a few millimetres into the gap, leaving most of the socket length empty.

The cause was heat. The brazer had heated the copper tube, which was easy to heat, until the filler melted on it, but the heavy brass body, which drew the heat away, had not reached brazing temperature at the bottom of the socket. Capillary flow goes towards heat, and the filler stopped where the joint was too cold. The fix, heating the body first and the tube last so that the whole joint reached temperature together, is the subject of Chapter 8. The lesson for this chapter is that a capillary joint is judged by what is inside it, not by its fillet.

## Exercise: which process?

Classify each of the following as soldering, brazing, braze welding or fusion welding, and say why: joining a copper tube into a brass fitting with a silver-copper filler at about 750 °C; joining a component lead to a circuit board with a tin-silver-copper alloy at about 240 °C; building up a bead of copper-zinc filler in a V-groove to repair a cracked cast iron bracket; joining two steel plates with a fillet of melted electrode and plate.

The copper tube into brass fitting, with a filler melting above 450 °C drawn into the socket, is **brazing**. The circuit board joint, with a filler melting below 450 °C, is **soldering**. The cast iron repair, with a brazing filler deposited into a groove rather than drawn into a gap, is **braze welding**. The steel plates, where the parts themselves melt, are **fusion welding**. The first two depend on capillary flow and close fit; the last two do not.
