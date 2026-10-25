---
book: plastic-parts-by-the-numbers
chapterSlug: define-the-part-before-the-mould
order: 1
title: "Define the part before you draw the mould"
description: "Write a moulded-part brief covering function, loads, environment, appearance, assembly, volume and tolerances, then choose the process and material against it."
draft: false
---

A plastic part is cheap to make and expensive to change. Once a mould has been cut, moving a wall by a millimetre may mean welding and recutting hardened steel, and adding a feature may mean a new slide. The decisions that fix a part's cost and quality are made early, often in the first sketch, and they are best made against a written brief rather than discovered at the first trial.

This chapter writes that brief for the running case, uses it to confirm that injection moulding is the right process and chooses a material. The brief then becomes the reference for every later chapter, and finally for approving the first parts.

## The access cover and what it must do

This is an illustration. A conveyor manufacturer fits a small steel control box beside each drive. The box needs a removable cover so that an electrician can reach the terminals during commissioning and maintenance. The current cover is folded and painted steel sheet, held by four screws. The manufacturer wants a moulded cover that clips on at one end, screws down at the other, needs no painting and costs less in assembly time.

The cover is 160 mm long, 100 mm wide and 20 mm deep, with a nominal wall of 2.5 mm. The steel box's opening, which the cover must close, is fixed, and so is the position of its two existing threaded holes, which will become clearance positions for the cover's screws into bosses. Demand is about 8,000 covers a year for at least five years.

## Write the requirements as numbers

A moulded-part brief lists what the part must do, under what conditions, and how success will be judged. Each requirement should be a number or a test wherever possible, because a toolmaker and a moulder cannot work to "strong enough" or "looks good".

```figure
type: checklist
title: Brief for the polycarbonate access cover
caption: Each line becomes an input to a later chapter and a check at first-off approval. Open items are marked with a question.
- Function | Close the box opening; clip at one end, two screws at the other
- Stiffness | Centre deflection under a 50 N hand press no more than 1.0 mm
- Assembly | Snap hooks engage by hand; cover removable for maintenance, at least 200 cycles
- Environment | Indoor factory, 0 to 60 °C at the cover, occasional cleaning with mild detergent
- Appearance | Grey, light texture on the outer face; no visible sink on the outer face
- Tolerances | Fit to the box opening with 0.5 mm nominal clearance per side
- Volume | About 8,000 a year for at least five years
- ? Flammability | Whether the product standard for the box requires a flammability rating
- ? Chemicals | Confirm cleaning products with the site and check the grade's resistance
```

The stiffness requirement turns a vague worry, a cover that feels flimsy, into a test that can be calculated in Chapter 4 and checked on the first parts. The assembly requirement of 200 cycles turns "removable" into a number that matters for the snap fit in Chapter 5, because a hook that is engaged many times must be strained less than one engaged once.

The two open items are typical. The flammability requirement depends on the electrical product standard that applies to the box, which the manufacturer must confirm. Polycarbonate, like many plastics, can crack under stress when exposed to some chemicals, so the cleaning products should be identified and checked against the supplier's chemical resistance data before the material is fixed.

## Confirm that moulding is the right process

Injection moulding is not automatically the right choice. It needs a mould costing tens of thousands of dollars and weeks to make, in exchange for low part cost and excellent repeatability. Whether the trade pays depends mainly on volume.

```figure
type: decision
title: Choosing a process for the cover at 8,000 a year
question: Which process suits a 160 × 100 × 20 mm cover at about 8,000 a year?
- Below a few hundred a year | Machined or 3D-printed plastic, or folded sheet | No tooling, high part cost
- A few hundred to a few thousand | Vacuum-formed sheet or a low-cost aluminium mould | Cheaper tooling, limited features
- *Several thousand a year and up | Injection moulding in a steel mould | Tooling cost repaid by low part cost and integral features
- Very high volume | Multi-cavity or family moulds | Higher tooling, lowest part cost
```

At 8,000 a year, a moulded cover with integral hooks, bosses and ribs replaces a folded steel cover, paint and two of its four screws. The integral features are the real gain: each hook moulded into the part removes a screw, a hole and the time to drive it. The boundaries in the figure are not fixed numbers; they depend on part size, complexity and local tooling prices. Chapter 9 calculates the break-even for the running case.

A useful habit is to ask, at this stage, whether any neighbouring parts could be combined into the moulding. A separate gasket retainer, a label holder or a cable clip on the inside of the cover can often be moulded in at almost no extra part cost. Each one consolidated removes a part number, a purchase and an assembly step.

## Choose a material family against the brief

Plastics divide broadly into amorphous materials, such as polycarbonate, ABS and PC/ABS blends, and semicrystalline materials, such as polypropylene, nylon and acetal. The distinction matters for design. Amorphous materials soften gradually over a range of temperature and shrink relatively little and fairly evenly. Semicrystalline materials melt more sharply, shrink more and less evenly, and generally resist chemicals better.

For the cover, the brief points to an amorphous material: the part is flat, so even, low shrinkage helps it stay flat, and the dimensions must fit a fixed opening. Within the amorphous family, two candidates stand out: unreinforced polycarbonate and a PC/ABS blend. Typical data sheet values for one published easy-flow grade of each are compared below.

```figure
type: compare
title: Typical values for two candidate materials
cols: Polycarbonate, easy flow | PC/ABS blend
caption: Typical data sheet values for one published grade of each, not specifications. Real parts should use the chosen grade's current data.
- Density | 1,200 kg/m³ | 1,130 kg/m³
- Tensile modulus | 2,400 MPa | 2,350 MPa
- Yield stress | 65 MPa | 54 MPa
- Yield strain | 6% | 4.4%
- Heat deflection temperature at 1.80 MPa | 124 °C | 102 °C
- Moulding shrinkage | 0.65 to 0.70% | 0.5 to 0.7%
- *Melt temperature for test specimens | 280 °C | 260 °C
```

Both materials would meet the stiffness and temperature requirements. The polycarbonate has more yield strain, which gives more room for the snap hooks, and a higher heat deflection temperature. The blend is a little lighter, easier to process and often less sensitive to stress cracking from some chemicals. For this book's case the manufacturer chooses the polycarbonate, mainly for the snap hooks' benefit, subject to the open chemical check.

## Read heat deflection temperature carefully

The heat deflection temperature is the temperature at which a standard bar, loaded in bending to a stated stress, deflects by a set amount as it is slowly heated. It is a useful comparison between materials, and Chapter 2 uses it as an estimate of the temperature at which a part is stiff enough to eject from the mould. It is not a safe service temperature.

A part in service may carry a load for months, and plastics creep: they deform slowly under sustained stress, faster as temperature rises. The brief's maximum of 60 °C at the cover is well below the polycarbonate's heat deflection temperature of 124 °C at 1.80 MPa, which is reassuring, but the stiffness check in Chapter 4 should still use a modulus appropriate to 60 °C and to the duration of the load, from the supplier's data. For a cover that carries only its own weight and an occasional hand press, creep is unlikely to matter. For a bracket carrying a motor, it would.

## Estimate mass and material cost early

A rough volume estimate turns the sketch into a cost and a shot size. For the cover:

- top plate: **160 × 100 × 2.5 = 40,000 mm³**
- skirt, using a mid-wall perimeter of **2 × (157.5 + 97.5) = 510 mm**, a height below the top of 17.5 mm and a wall of 2.5 mm: **510 × 17.5 × 2.5 ≈ 22,300 mm³**
- ribs, bosses and hooks, from the later chapters: about **3,900 mm³**

The total is about 66,200 mm³, or 66.2 cm³. At the polycarbonate's density of 1.20 g/cm³, the cover weighs about **66.2 × 1.20 ≈ 79 g**.

This is an illustration. If polycarbonate costs A$6.50 per kilogram excluding GST, the material in one cover costs about **0.079 × 6.50 ≈ A$0.51**, before allowing for the runner and scrap. That figure will be small next to the machine time, as Chapter 9 shows, but it is worth knowing early, because a design change that adds 20% to the wall adds 20% to this cost and much more to the cycle time.

## Separate the cosmetic face from the working face

Every moulded part has a face the customer sees and a face nobody sees, and the brief should say which is which. Moulders often call them the A-side and the B-side. The distinction decides where the toolmaker may put things that leave marks: ejector pins, which leave small circular witness marks; the gate, which leaves a vestige where the runner was broken or cut away; and the parting line, which leaves a fine line where the two mould halves meet.

For the cover, the outer face of the top and the outside of the skirt are cosmetic. The underside, with its ribs, bosses and hooks, is the working face. The brief therefore says that ejector marks and the gate vestige must be on the underside or on the inside of the skirt, and that the parting line should run around the bottom edge of the skirt, where it meets the box and is hidden.

The cosmetic face also needs a texture specification. A light texture hides minor flow marks and scratches and makes small variations in gloss less visible, which is why many industrial covers are textured rather than polished. Textures are specified by a reference from a texture supplier or a standard comparison set, and Chapter 3 shows that a texture also changes the draft the part needs. Choose it now, because it affects the mould design.

## Plan the life of the mould

A mould is a machine, and its construction should match the number of parts it must make. At 8,000 covers a year for five years, the mould must make at least **8,000 × 5 = 40,000** parts, and probably more if demand grows or the mould outlives the original plan. That is a modest life by moulding standards. A mould from prehardened tool steel, which the Covestro design guide describes as a good general choice for unfilled materials such as polycarbonate, would comfortably exceed it.

Higher volumes, abrasive glass-filled materials or very high cosmetic requirements push towards hardened steels, which cost more to machine and take longer to make but last longer and polish better. Lower volumes, or a short-run trial, can justify aluminium tooling. The brief should state the required mould life, so that every toolmaker quotes the same thing. Quotes for "a mould" with no stated life are not comparable.

## Say how the part will be judged

The last section of a good brief describes acceptance. Which dimensions will be measured on the first parts, with what instruments? How many parts, from which cavities, at what point in the trial? What cosmetic standard applies, and under what lighting? What functional tests, such as the 50 N press and a set of assembly cycles, must the first parts pass?

Writing this now forces the designer to identify the dimensions that really matter, which Chapter 6 develops as the critical-to-function list. It also tells the moulder what they will be held to, which affects how they set up the process. Chapter 10 uses this section as the approval checklist.

## A failure case: the brief that left out assembly

This is an illustration of what happens without a brief. A first concept for the cover, drawn quickly, used four snap hooks and no screws, sized so that the cover engaged firmly. Nobody had written down that the cover must be removed during maintenance. The prototype hooks, printed rather than moulded, engaged well. Two electricians later removed covers from a pilot installation by levering them off with a screwdriver, and both covers cracked at a hook root.

The hooks had been designed, implicitly, for a single assembly. A hook meant to be released repeatedly needs a lower strain and a release feature, such as a tab that can be pressed or a slot for a tool. The failure was detectable at the brief stage: a line saying "removable for maintenance, at least 200 cycles" would have sent the designer to Chapter 5's lower strain limit and to a release feature before any part was made. The revised concept, two hooks at one end with a press tab and two screws at the other, came from adding that one line.

## Agree the brief with the people who will make the part

The brief is also a communication with the toolmaker and the moulder. They should see it before the design is finished, not after, because they can often suggest a change that costs nothing in the design and saves a slide in the mould or seconds in the cycle. A short design-for-manufacture review at this stage, with the brief and an early model on the table, is one of the cheapest improvements in the whole process.

Record the review's outcome in the brief: who attended, what they recommended and which recommendations were accepted. When a question arises at the first trial, the record shows whether it was foreseen and what was agreed.

## Exercise: a thicker cover

A colleague proposes increasing the nominal wall from 2.5 to 3.0 mm everywhere to make the cover feel more solid. Estimate the change in part mass and material cost, using the volume breakdown above and assuming the ribs, bosses and hooks are unchanged.

**Worked answer.** The top plate becomes **160 × 100 × 3.0 = 48,000 mm³**. The skirt's mid-wall perimeter becomes **2 × (157 + 97) = 508 mm** and its height below the top 17.0 mm, so its volume is **508 × 17.0 × 3.0 ≈ 25,900 mm³**. With 3,900 mm³ for the other features, the total is about 77,800 mm³, so the mass is about **77.8 × 1.20 ≈ 93 g**, roughly 17% more. The material cost rises to about **0.093 × 6.50 ≈ A$0.61** excluding GST. Chapter 2 shows that the larger penalty is in cooling time, which rises with the square of the wall, and that ribs give more stiffness per gram than a thicker wall.
