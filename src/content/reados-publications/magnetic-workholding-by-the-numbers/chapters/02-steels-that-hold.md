---
book: magnetic-workholding-by-the-numbers
chapterSlug: steels-that-hold
order: 2
title: "Steels that hold and materials that do not"
description: "Which materials a magnet can hold and how well: saturation and permeability, carbon and alloy steels, hardened steels, cast iron, stainless grades, and how to derate for each."
draft: false
---

A chuck's rating is measured on a block of low-carbon steel, because low-carbon steel is close to the best material a magnet can hold. Almost every other material holds less, some only a little less and some not at all. A shop that runs one material all day can ignore this; a jobbing shop that puts mild steel, tool steel, cast iron and stainless parts on the same chuck in one week cannot.

This chapter explains which properties of a material decide how hard a magnet holds it, goes through the families of material a machine shop meets, and applies a derating table to the parts the case's shop runs beside BP-600. The error is a cast-iron part set up as if it were steel.

## Two properties that matter

From Chapter 1, the pull depends on the flux density at the contact, and the flux density depends on the magnetic circuit. A workpiece affects the circuit in two ways.

The first is its saturation flux density. The flux that crosses into a part from one pole must turn and travel through the part to the next pole. The part can carry flux only up to its saturation; beyond that it behaves like air. A material that saturates at a lower flux density can carry less flux in a given thickness, and so needs to be thicker to take the full flux a pole can deliver. Low-carbon steel saturates at about 2 T. Alloying elements and carbon dilute the iron and lower the saturation, and non-magnetic phases inside the material, such as graphite flakes in cast iron, lower it further.

The second is its permeability, the ease with which it magnetises at moderate fields. A material with low permeability adds reluctance to the circuit even below saturation, as if the gap were wider. Soft, annealed low-carbon steel has high permeability. Hardening, cold work and high carbon content pin the domain walls that must move when the steel magnetises, which lowers the permeability and raises the coercivity, the reverse field needed to remove magnetism. That is also why hardened steels keep more residual magnetism after they leave the chuck, a problem Chapter 10 deals with.

Neither property can be read from a hardness or strength figure on a drawing, and neither is usually on a mill certificate. Makers of chucks and lifting magnets publish derating factors by material family, measured on their own products, and a pull test on the real material settles any doubt.

## The families a machine shop meets

```figure
type: compare
title: How common workshop materials respond to a magnet
cols: Magnetic? | What changes compared with low-carbon steel
rowhead: Material
- * Low-carbon and mild steel, annealed or hot-rolled | yes | the reference: high saturation and permeability
- Medium- and high-carbon steel, unhardened | yes | somewhat lower saturation and permeability
- Hardened tool and alloy steel | yes | lower permeability, higher coercivity, more residual magnetism
- Grey and ductile cast iron | yes | graphite lowers saturation and permeability; grey iron the most
- Ferritic and martensitic stainless steel | yes | chromium dilutes the iron; lower saturation than carbon steel
- Austenitic stainless steel, annealed | no, or barely | the face-centred cubic structure is not ferromagnetic
- Austenitic stainless steel, heavily cold-worked | weakly | some austenite transforms to magnetic martensite
- Duplex stainless steel | partly | the ferrite phase is magnetic, the austenite is not
- Aluminium, copper, brass, titanium, plastics | no | need mechanical clamping, vacuum or a fixture on the chuck
caption: General behaviour of the families. The size of the reduction for a particular grade and condition comes from the chuck maker's derating table or a pull test, not from this table.
```

Two families cause most surprises. Austenitic stainless steels, such as grades 304 and 316, are not attracted in the annealed condition but can be weakly attracted after bending, rolling or machining, because cold work transforms some of the structure into martensite, which is magnetic. A sheet that clings weakly to a magnet at one corner and not at all elsewhere is behaving normally, and it is not a material that a chuck can hold. Cast irons look and machine like steel but carry graphite, which is non-magnetic, distributed through the metal: in grey iron as flakes that interrupt the flux path, in ductile iron as nodules that interrupt it less.

## A derating table for the case's chuck

This is an illustration. The maker of the shop's electro-permanent chuck supplies a derating table: the share of the rated holding force achieved on each material, measured with thick, ground test blocks of each. The shop's set-up sheet reproduces it beside the parts the shop actually runs.

```figure
type: bars
title: Holding force by material, as a share of the rating on low-carbon steel
unit: %
max: 100
caption: This is an illustration. Invented factors for the case's chuck, of the kind chuck makers publish for their own products. Real factors depend on the grade, condition and the chuck's design; use the maker's table or a pull test.
- * Low-carbon steel, grade 250 plate | 100
- Medium-carbon steel, 1045 | 90
- Hardened alloy steel, 4140 at 50 HRC | 70
- Ductile cast iron | 60
- Grey cast iron | 45
- Ferritic stainless steel, 430 | 50
- Austenitic stainless steel, 304 | 0
```

The factors fall in the order the physics suggests: carbon and alloy content lower the force a little, hardening lowers it more, graphite more again, and chromium in a ferritic stainless steel about as much as graphite in grey iron. These factors apply on top of everything else in the book: the gap, the thickness and the size of the part each reduce the force further.

### The case's other parts

Beside BP-600, the shop runs three other parts on the same chuck, each with ground contact faces from an earlier operation, so that the contact is close to the maker's test block.

```figure
type: compare
title: Normal holding force on the case's parts, ground contact faces
cols: Poles fully covered | Material factor | Normal force, kN | Sliding resistance at μ = 0.2, kN
rowhead: Part
- * BP-600 base plate, grade 250 steel, 600 × 400 mm | 54 | 1.00 | 77.3 | 15.5
- Gauge plate, 4140 at 50 HRC, 200 × 150 mm | 6 | 0.70 | 6.0 | 1.2
- Bracket base, grey cast iron, 300 × 200 mm | 15 | 0.45 | 9.7 | 1.9
- Cover plate, 430 stainless, 400 × 300 mm, 25 mm thick | 30 | 0.50 | 21.5 | 4.3
caption: This is an illustration. Each fully covered pole pulls 1,432 N on low-carbon steel with ideal contact, from Chapter 1; partly covered edge poles are ignored. Weight is left out of the sliding resistance because it is small beside the magnetic force.
```

The figures for BP-600 are still the ideal ones from Chapter 1. Chapter 3 shows what its rough first-operation face does to them. The other three parts are smaller, so they cover fewer poles, and their materials hold less. The cast-iron bracket base covers two and a half times as many poles as the gauge plate but, because of its material factor, has only about 1.6 times the gauge plate's holding force.

## Measuring a material's response

When a material is not in the maker's table, or a grade's condition is uncertain, a pull test answers the question for the conditions that matter. The test block should be the material in question, at least as thick as the part, with the same contact finish, covering whole poles. The ratio of its pull to the pull of a low-carbon steel block of the same size, on the same poles, is the material factor for that chuck.

This is an illustration. After the error described below, the case's shop cut a 120 × 120 × 50 mm block from a grey cast-iron offcut supplied with the bracket castings, ground one face, and pulled it from the same four poles as its steel test block. The steel block had pulled 5.5 kN and the cast-iron block pulled 2.6 kN, a measured factor of 0.47 for that iron on that chuck, close to the maker's 0.45. The shop kept the maker's figure, the lower of the two, on its set-up sheets.

A hand magnet test, touching a small permanent magnet to the part, is not a substitute. It tells whether a material is magnetic at all, which is worth knowing; but a weakly magnetic material, such as a cold-worked austenitic stainless steel, can attract a hand magnet noticeably and still hold almost nothing on a chuck, and a strongly magnetic material in a thin section can feel as strong as a thick one to a hand magnet and hold a fraction of the force.

## Condition matters as much as grade

Two parts of the same grade can hold differently because they have different histories. Annealed or normalised steel has the highest permeability its composition allows. Quenching to martensite lowers it, and so, to a lesser degree, do heavy cold work and the fine, distorted structure near a flame-cut or sheared edge. Tempering a hardened part recovers some permeability.

Case-hardened parts are a useful special case. A carburised part has a thin, hard, high-carbon case on a soft, low-carbon core. The flux crosses the case at the contact, a millimetre or so of material with low permeability, and then runs through the core. The case behaves rather like a small extra gap, so a carburised part holds a little less than the same part before carburising, but much more than a through-hardened part of a similar surface hardness. Nitrided parts, with much thinner cases, are barely affected.

Welded assemblies combine several conditions in one part. The weld metal and heat-affected zone near a weld have a different structure from the parent plate, and a part made by welding a hardened insert to a mild steel base holds through the base. The rule for any composite part is to look at the material that actually touches the poles, and at the path the flux must take between neighbouring poles. If that path crosses a joint between two pieces of steel, the joint is a gap, however tightly it is bolted or welded at its edges.

## Coatings, plating and the material underneath

A coating is not part of the material for holding purposes; it is part of the gap. Zinc, chromium, copper and paint are non-magnetic, and a coat of any of them separates the steel from the pole face by its thickness. Hot-dip galvanising, typically tens of micrometres or more thick, holds noticeably less than bare steel of the same thickness for that reason alone. Nickel is ferromagnetic, but electroplated nickel layers are thin and their contribution is small; the steel underneath still does the work.

A coating can also mislead a hand magnet test. A galvanised steel part attracts a hand magnet firmly, because the hand magnet's own gap is large anyway, while on a chuck, where the gap is otherwise a few hundredths of a millimetre, the coating's thickness is a large addition. Chapter 3 gives the model that turns a coating thickness into a share of the force lost.

## Recording the material on the set-up sheet

The case's shop now records four facts on every set-up sheet for a magnetic set-up: the material and its condition as given on the drawing, the factor taken from the maker's table, the source of the factor (the table, or a pull test with its date and result), and the contact condition. The first three take a minute to fill in. They make the set-up reviewable by someone who did not write it, which is the point: magnetic holding fails silently, with no clamp that looks loose, and a written factor is the only evidence that the material was considered at all.

When a job's material is not in the table and the batch is large or the cut heavy, the shop runs a pull test before the first part is cut. A test takes a quarter of an hour; a part moving under a face mill can take a day to recover from, and can injure someone.

## Non-magnetic parts on a magnetic chuck

A non-magnetic part can still be held on a magnetic chuck with a fixture: a steel sub-plate or set of steel jaws that the chuck holds, which in turn grip the part mechanically. The magnetic force then holds the fixture, and the part is only as secure as the fixture's own clamping. Some shops use thin steel shims or a magnetic vice for small non-magnetic parts. In each case the calculation is a fixture calculation, not a magnetic one, and the clamping should be sized as in any fixture.

```figure
type: decision
title: What to do with a part on a magnetic chuck
question: Is the part's material in the maker's table, or has it been pull-tested?
caption: The derating factor must come from evidence about the chuck and the material. When the material is not magnetic, the chuck holds only the fixture.
- Yes, and magnetic | apply the factor | then check the gap, thickness and size in Chapters 3 and 4
- * No, and possibly magnetic | pull-test a block of the material | cast iron, stainless and hardened steels especially
- Not magnetic | hold the part in a steel fixture on the chuck | size the fixture's clamping as a fixture, not as a magnet
```

## The error: cast iron set up as steel

This is an illustration. A new customer's job was a batch of 40 brackets whose bases were to be milled flat and drilled. The drawing gave the material as grey cast iron, but the set-up sheet was copied from a similar steel bracket the shop had made the year before, with the same base size, the same poles covered and the same cutting data. The copied sheet listed a sliding resistance of 4.3 kN for the steel part, calculated with ground contact and a material factor of 1.00, and a peak face-milling force of 3.8 kN, so it relied on friction alone, with no stop.

On the third bracket, the part moved about 2 mm as the face mill entered the cut. Nobody was hurt and the cutter was not damaged, but the part was scrapped. The supervisor's check found the material factor: at 0.45 for grey cast iron, the sliding resistance was 0.45 × 4.3 = 1.9 kN, half the peak cutting force. The copied sheet had been accurate for steel and wrong by more than a factor of two for this part.

The shop fitted a stop bar against the cutting direction, which took the sideways load and left the magnet to hold the part down, and reduced the cut's width for the first pass. It also changed its set-up sheet template so that the material and its factor are entered, not copied, on every new job.

## Exercise: the gauge plate

This is an illustration. The 200 × 150 mm hardened 4140 gauge plate covers 6 poles fully, with ground contact.

1. What is its normal holding force, using the factor in this chapter?
2. What sideways force will it resist by friction, with a coefficient of 0.2?
3. A finishing pass produces a peak sideways force of 450 N. What is the safety factor against sliding?
4. Would a part of the same size in 304 stainless steel be held?

**Worked answer.**

1. 6 poles × 1,432 N × 0.70 = **6.01 kN**.
2. 0.2 × 6,014 N = **1.20 kN**, ignoring the plate's small weight.
3. 1,203 ÷ 450 = **2.7**. That is comfortable for a light finishing pass, but a roughing pass with several times the force would need a stop.
4. **No.** Annealed 304 is not ferromagnetic, and its factor in the table is zero. It must be held in a steel fixture or a vice on the chuck, or by another method.
