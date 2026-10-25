---
book: building-approval-for-factory-projects
chapterSlug: storeys-mezzanines-and-construction-type
order: 3
title: "Storeys, mezzanines and the type of construction"
description: "Count the rise in storeys the way the NCC does, test when a mezzanine becomes a storey, and see how one size decision can move a factory from Type C to Type B."
draft: false
---

The type of construction is the NCC's master setting for fire resistance. It decides how much of the building's structure must be fire-resisting, and so it reaches into steel sizes, wall materials, cladding choices and cost. For Class 5 to 9 buildings it depends on just two inputs: the class and the rise in storeys.

The rise in storeys sounds like something you could count from a photograph. It is not. The NCC has specific rules for roof plant, partly buried storeys, very tall single-storey industrial spaces and mezzanines. In a factory, the mezzanine rule is the one that most often catches owners out, and the running case shows why.

## The type of construction table

Table C2D2 of NCC 2022 Volume One sets the minimum type of construction. Type A is the most fire-resistant and Type C the least. Under C2D2(2), each building element must then comply with Specification 5 for that type, which sets out which elements need a fire-resistance level (FRL) and what it is.

```figure
type: compare
title: Minimum type of construction, NCC 2022 Table C2D2
cols: Class 2, 3 or 9 | Class 5, 6, 7 or 8
caption: Values from Table C2D2 of NCC 2022 Volume One, subject to the concessions elsewhere in Part C2 and to state variations.
- Rise in storeys 4 or more | Type A | Type A
- Rise in storeys 3 | Type A | Type B
- Rise in storeys 2 | Type B | Type C
- *Rise in storeys 1 | Type C | Type C
```

For a Class 5 to 8 building, the step that matters is between a rise of 2 (Type C) and a rise of 3 (Type B). Moving from Type C to Type B can mean fire-resisting structure and walls that a Type C building would not need, or a fire engineering exercise to show why they are not needed. Specification 5 decides the detail, and this book does not quote its values. The direction is enough: a higher type costs more, and it is decided early.

Where a building has more than one classification, C2D4(1) sets the type as the most fire-resisting one from Table C2D2, applying the classification of the top storey to all storeys, with a concession for a Class 4 part on the top storey.

## How the NCC counts storeys

A storey, in the NCC's definitions, is the space between one floor level and the floor level above, or the ceiling or roof if there is no floor above. It excludes spaces that contain only a lift shaft, stairway or meter room, sanitary compartments, or parking for not more than three vehicles, and it excludes a mezzanine.

C2D3 then gives the rules for the rise in storeys:

1. **Count at the external walls.** The rise in storeys is the greatest number of storeys at any part of the external walls above finished ground, plus any storeys within the roof space (C2D3(1)).
2. **Ignore a top storey of plant.** A top storey containing only heating, ventilating or lift equipment, water tanks or similar service units is not counted (C2D3(2)(a)).
3. **Ignore a mostly buried storey.** A storey partly below ground is not counted if its ceiling is not more than 1 m above the average finished ground level at the external wall, with a rule for long walls (C2D3(2)(b)).
4. **Count a tall industrial storey twice, sometimes.** A Class 7 or 8 storey with an average internal height of more than 6 m counts as one storey if it is the only storey above ground, and otherwise as two (C2D3(3)).
5. **Count a large mezzanine as a storey.** A mezzanine counts as a storey if its floor area is more than 200 m² or more than one-third of the floor area of the room, whichever is less. Two or more mezzanines at or near the same level count as one storey if their combined floor area exceeds that threshold (C2D3(4)).

```figure
type: formula
title: When a mezzanine counts as a storey
formula: threshold = the lesser of 200 m² and (room floor area ÷ 3)
caption: From C2D3(4) of NCC 2022 Volume One. This is an illustration using the running case's 1,500 m² workshop; the room's floor area is measured within its internal finished surfaces, so it is a little under 1,500 m².
- room floor area | area of the room containing the mezzanine, m²
- threshold | largest mezzanine floor area that does not count as a storey, m²
step: Room ÷ 3: about 1,500 ÷ 3 = 500 m², so 200 m² is the lesser value
step: 240 m² mezzanine: more than 200 m², so it counts as a storey
step: 190 m² mezzanine: not more than 200 m², so it does not count
```

## The running case: a 240 m² mezzanine

This is an illustration. The owner's first sketch shows a 24 m by 10 m storage mezzanine, 240 m², in the north-west corner of the workshop. Its deck is 3.0 m above the floor. Under C2D3(4) it counts as a storey, because 240 m² is more than 200 m².

Now apply the tall-storey rule. The workshop is a high single space. Its average internal height depends on how it is measured. Measured to the underside of the roof, the building's cross-section is a rectangle 30 m wide and 6.0 m high plus a triangle 1.5 m high:

**30 × 6.0 + 0.5 × 30 × 1.5 = 180 + 22.5 = 202.5 m²**

Dividing by the 30 m width gives an average height of **6.75 m**. Even if the office part is taken only to its 2.7 m ceiling, the storey's average is **(10,125 + 300 × 2.7) ÷ 1,800 = 10,935 ÷ 1,800 = 6.08 m**, still over 6 m. (The 10,125 m³ is the workshop's 50 m length times the 202.5 m² cross-section.)

With the 240 m² mezzanine counted as a storey, the high ground storey is no longer the only storey above ground. On a plain reading of C2D3(3), it then counts as two storeys, and the counted mezzanine as a third. That gives a rise in storeys of **three**, and Table C2D2 requires **Type B** for a Class 5 to 8 building. On a narrower reading, the certifier might count two storeys, giving Type C. The owner's design would then depend on how an ambiguous combination of clauses is read.

## Designing out the ambiguity

The designer's response was not to argue for the narrower reading. It was to change the design so that the reading no longer mattered. Reducing the mezzanine to 19 m by 10 m, **190 m²**, takes it below the 200 m² threshold. It is then not a storey. The workshop storey is the only storey above ground, so under C2D3(3) it counts as one. The rise in storeys is **one**, and Table C2D2 gives **Type C** under every reading.

```figure
type: compare
title: The mezzanine size decision
cols: 240 m² mezzanine | 190 m² mezzanine
caption: This is an illustration. The 50 m² difference in storage area moves the building's type of construction, depending on how the certifier reads C2D3(3) and C2D3(4) together.
- Counts as a storey under C2D3(4)? | Yes, over 200 m² | No
- High workshop storey counts as | two storeys, on a plain reading | one storey, the only storey
- Rise in storeys | three, or two on a narrower reading | one
- *Type of construction, Table C2D2 | Type B, or Type C on a narrower reading | Type C
- Exposure to interpretation | high | none
```

The owner lost 50 m² of storage. In exchange, the building's fire-resistance requirements were settled at the lowest level available for its class, and the decision did not rest on a contested interpretation. Fifty square metres of racking can be found elsewhere; a change of construction type usually cannot be absorbed so cheaply.

## A second mezzanine is a second trap

A few weeks later, the office manager asked for a 60 m² archive mezzanine above the office kitchen and toilets. On its own, 60 m² is well under the threshold. But C2D3(4) also says that two or more mezzanines at or near the same level count as one storey if their combined floor area exceeds the threshold. If the office mezzanine sat at a similar level to the workshop mezzanine:

**190 + 60 = 250 m², which is more than 200 m².**

The pair could then count as a storey, which would reopen the whole construction-type question. The office mezzanine is in a different room, and whether mezzanines in separate rooms are combined is a question for the certifier. The owner chose not to test it: the archive went into compactus shelving on the office floor. This is the kind of failure that is detected only if someone keeps the earlier decision visible. The project's compliance plan noted beside the workshop mezzanine: "190 m², kept below 200 m² to hold the rise in storeys at one; any further mezzanine must be checked against C2D3(4)".

## Why the code cares about storeys

It helps to understand why the rise in storeys drives fire resistance, because the reasoning explains the mezzanine and tall-storey rules. A fire on a lower level threatens people above it, who must travel further and often down through the fire's smoke to escape. Fire fighters need the structure to stand long enough for them to work inside it. The more levels a building has, the longer evacuation and fire fighting take, and the more the structure must resist.

A large mezzanine behaves like a storey in that respect: people on it are above a possible fire and depend on a stair to get out. A small mezzanine does not change the picture much, which is why the NCC ignores mezzanines below the threshold. A very tall single-storey industrial space is treated as more than one storey when there are other storeys, because the volume of smoke and heat it can hold, and the height of its structure, resemble a two-storey building. The rules are blunt instruments, but they aim at real hazards. When a design sits on a threshold, it is worth asking whether the hazard the rule targets is present, because that is exactly the argument a Performance Solution would have to make.

## Measuring the room and the mezzanine

The mezzanine threshold compares two areas, and both must be measured the NCC's way.

- **The room** is measured within its internal finished surfaces. Thick blockwork or insulated panels reduce the room's floor area a little compared with the area over the walls. In a 1,500 m² workshop that makes no difference to the result, because 200 m² governs long before one-third of the room does. In a small room, it can.
- **The mezzanine** is the intermediate floor itself. Include the whole deck, landings that form part of it and any extension the owner may add later. Measure from the drawings, not the brochure; a "200 m²" standard mezzanine kit can measure more once the stair landing and loading bay are added.
- **Racking platforms and pick floors** need care. A raised floor built into or onto racking may be treated as a mezzanine if people walk and work on it. Ask the certifier before ordering one, and give them the drawings and the intended use.

The running case drawings show the mezzanine at 19.0 m by 10.0 m to the outside of its edge beams, with the stair outside that rectangle and landing directly onto the deck. The designer added a note: "Total deck area 190 m²; no extensions without a C2D3(4) check."

## Effective height and why it matters later

The NCC also uses effective height: the vertical distance between the floor of the lowest storey included in the rise in storeys and the floor of the topmost storey, excluding a top storey of plant. In a building with a rise in storeys of one, the lowest and topmost storey are the same, so the effective height is zero.

Many triggers in Volume One use effective height. Sprinklers are required throughout a building with any part more than 25 m in effective height (E1D5), as are two exits from each storey in Class 2 to 8 buildings in most cases (D2D3(2)) and a fire control centre (E1D15). None of those apply to the running case. Keep the number in the record anyway, because it is one of the first things a certifier or fire engineer will look for.

## What Type C does and does not settle

Type C does not mean that nothing in the building needs fire resistance. Specification 5 still applies to Type C buildings, for example to some external walls depending on their distance from a boundary or another building, and other Parts may require fire separation for particular reasons. Chapter 4 shows that the running case needs a fire wall for a reason unrelated to the type of construction.

What Type C settles is the baseline. Once it is fixed, the designer can select the structure, cladding and roof without designing for a higher fire-resistance level than the class and size require.

```figure
type: checklist
title: Storey and construction-type record for the running case
caption: This is an illustration. Each line cites the clause relied on, so that a later change can be checked against the same reasoning.
- x Mezzanine 190 m², below the 200 m² threshold | C2D3(4), not a storey
- x Workshop storey average height over 6 m, only storey above ground | C2D3(3), counts as one
- x Rise in storeys one; effective height zero | C2D3, Schedule 1 definition
- x Type C construction for Class 5 and Class 8 parts | Table C2D2, C2D4
- ? Specification 5 requirements for external walls near boundaries | designer to check
- ? Any further mezzanine | must be checked against the combined-area rule in C2D3(4)
```

## Exercise: a wider mezzanine in a smaller room

A different owner wants a 180 m² mezzanine inside a 450 m² Class 8 room. The building is single storey and its average internal height is 5.5 m. Does the mezzanine count as a storey, and what type of construction applies?

**Worked answer.** The threshold is the lesser of 200 m² and one-third of the room's floor area: **450 ÷ 3 = 150 m²**, so the threshold is **150 m²**. A 180 m² mezzanine is more than 150 m², so it counts as a storey under C2D3(4), even though it is under 200 m².

The average internal height is 5.5 m, not more than 6 m, so the tall-storey rule in C2D3(3) does not apply. The rise in storeys is **two**: the ground storey and the counted mezzanine. For a Class 8 building with a rise in storeys of two, Table C2D2 requires **Type C**.

The owner should still note how close the design is to other thresholds. If the room were later made taller, or the mezzanine extended, the answer could change. Keeping the mezzanine to 150 m² or less would remove it from the storey count entirely and leave more margin for future changes.
