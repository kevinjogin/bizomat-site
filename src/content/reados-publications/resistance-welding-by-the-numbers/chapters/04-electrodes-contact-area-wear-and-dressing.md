---
book: resistance-welding-by-the-numbers
chapterSlug: electrodes-contact-area-wear-and-dressing
order: 4
title: "Electrodes: contact area, wear and dressing"
description: "Calculate current density and contact pressure at the electrode tip, see how tip growth starves the weld, and plan cooling, dressing and current stepping."
draft: false
---

The electrodes are the part of a resistance welder that touches the work, and they do three jobs at once. They carry the welding current into the sheets, they apply the force that holds the sheets together and contains the nugget, and they carry heat away from the sheet surfaces. They do all of this at the hottest, most heavily loaded point in the machine, made from a metal that is softer than the steel it welds. Hornor's 1920 account of the shipyard machines quoted their designer: making the electrode tips stand up had been the most serious problem in developing them.

This chapter looks at the cabinet welder's electrodes in numbers: current density, contact pressure, cooling and wear, and the dressing and stepping routine that keeps the weld inside its window.

## Why copper, and why alloyed copper

An electrode must conduct electricity and heat very well, so that it produces little heat itself and removes heat from the sheet surface. Copper is the obvious choice. Pure copper, though, softens at temperatures well below the welding temperature of steel, and under repeated heavy force at elevated temperature it flattens quickly.

Electrode materials are therefore copper alloys that trade a little conductivity for much greater strength and resistance to softening at temperature. ISO 5182 classifies materials for resistance welding electrodes and ancillary equipment. TWI notes that Class 2 copper-chromium-zirconium alloys are commonly used for steel, while higher-conductivity copper-zirconium and aluminium oxide dispersion-strengthened copper can reduce sticking and improve life on coated steels. The shop's procedure names the electrode class its supplier recommends for each material; it does not let the stores substitute whatever caps are cheapest.

## Current density and contact pressure

The cabinet welder uses truncated-cone electrode caps with a 6 mm face. The face area is π/4 × 6² = **28.27 mm²**. With 9,000 A and 3.0 kN, two quantities follow:

- current density, 9,000 ÷ 28.27 ≈ **318 A/mm²**;
- mean contact pressure, 3,000 N ÷ 28.27 mm² ≈ **106 MPa**.

Hornor reported that the 1918 shipyard machines worked with a current density in the electrode material of about 60,000 amperes per square inch, which is about 93 A/mm², under pressures of 15,000 to 20,000 pounds per square inch, about 103 to 138 MPa. The contact pressure of the cabinet welder is in the same range as the shipyard machines a century earlier; its current density is more than three times higher, because modern welds on thin sheet are made far faster.

```figure
type: formula
title: Current density and contact pressure at the electrode face
formula: J = I ÷ A;  p = F ÷ A;  A = π × d² ÷ 4
caption: This is an illustration for a 6 mm face. Both quantities fall as the face grows with wear, but heat at the interface falls faster because it follows J².
- J | current density, A/mm²
- p | mean contact pressure, MPa (N/mm²)
- d | electrode face diameter, mm
step: A = π × 6² ÷ 4 = 28.27 mm²
step: J = 9,000 ÷ 28.27 ≈ 318 A/mm²
step: p = 3,000 ÷ 28.27 ≈ 106 MPa
```

## Mushrooming: how wear starves the weld

Under repeated heat and force, the electrode face spreads, a process called mushrooming. As it grows, the same current is spread over a larger area, so current density falls; the same force is spread over a larger area, so pressure falls. The heat generated per unit area at the interface depends roughly on J², so the heating falls faster than the area grows.

This is an illustration. The cabinet's tips start at 6.0 mm. If the face grows to 7.0 mm:

- area = π/4 × 7² = 38.48 mm², 36% larger;
- current density at 9,000 A = 9,000 ÷ 38.48 ≈ 234 A/mm²;
- relative heating per unit area = (28.27 ÷ 38.48)² ≈ **0.54** of the original;
- current needed to restore the original density = 9,000 × 7 ÷ 6 = **10,500 A**.

At 10,500 A the cabinet welder would be at the expulsion limit of the original window (Chapter 2). So a 1 mm growth in face diameter is enough to move the weld from comfortable to unworkable, which is why tip condition is controlled closely.

```figure
type: compare
title: The cabinet electrode face as it wears
cols: 6.0 mm (new) | 6.6 mm (dressing point) | 7.0 mm (worn)
caption: This is an illustration at 9,000 A and 3.0 kN. The shop dresses at 6.6 mm, before the loss of heating pushes welds below the minimum.
- Face area, mm² | 28.27 | 34.21 | 38.48
- Current density, A/mm² | 318 | 263 | 234
- Contact pressure, MPa | 106 | 88 | 78
- Relative heating per unit area | 1.00 | 0.68 | 0.54
- Current to restore density, A | 9,000 | 9,900 | 10,500
```

## Dressing and current stepping

There are two ways to deal with mushrooming, and the cabinet shop uses both.

**Dressing** restores the face. A tip dresser, a rotating cutter shaped to the electrode profile, cuts the cone back to its original angle so that the face returns to its original diameter. TWI's guidance is that little material should be removed from the face itself, only enough to clean off pitting and erosion, and that the tip diameter should be restored by cutting the cone angle. Alignment must be checked after dressing, because two faces that meet at an angle produce an oval, off-centre weld.

**Stepping** compensates between dressings. The control raises the current in steps as the number of welds since the last dressing increases, following the growth of the face. TWI notes that stepping can prolong electrode life and be combined with dressing, but that the interval and percentage increase must be set by experiment, because wear rates vary.

This is an illustration. The shop's tip-life trial showed that its 6.0 mm faces grew to about 6.6 mm in 500 welds on clean uncoated sheet. To keep current density roughly constant, the current would need to rise in proportion to diameter, from 9,000 A to 9,000 × 6.6 ÷ 6.0 = 9,900 A, a 10% increase over 500 welds. The shop set the stepper to add 2% every 100 welds and to call for dressing at 500 welds:

| Welds since dressing | Expected face diameter | Stepped current |
|---|---|---|
| 0 to 99 | 6.0 to 6.1 mm | 9,000 A |
| 100 to 199 | 6.1 to 6.2 mm | 9,180 A |
| 200 to 299 | 6.2 to 6.4 mm | 9,360 A |
| 300 to 399 | 6.4 to 6.5 mm | 9,540 A |
| 400 to 499 | 6.5 to 6.6 mm | 9,720 A |
| 500 | dress back to 6.0 mm | reset to 9,000 A |

At 2,560 welds a day, the welder needs dressing about five times a day. The stepper and the dresser together keep the effective heating within the window as the tips age. The table is only valid for this material and electrode; Chapter 9 shows how much faster the tips wear on galvanised sheet.

## Cooling: the heat the electrodes must carry

Chapter 1 estimated that most of the 1,620 J generated in each weld is conducted away, much of it into the electrodes. Suppose about 1,000 J per weld goes into the two electrodes together. At 20 welds a minute, that is 20,000 J per minute, or about **333 W** of continuous heat to remove.

Water carries this away easily if it flows. At an illustrative flow of 4 L/min through the electrodes, the water's temperature rise is 333 ÷ (4 ÷ 60 × 4,186) ≈ **1.2 °C**. Without water, the picture changes completely: if 333 W went into about 200 g of copper with no cooling, its temperature would rise by about 333 ÷ (200 × 0.385) ≈ 4.3 °C per second, which is roughly 260 °C after a minute. Copper alloys lose hardness as they get hot, so uncooled electrodes mushroom and stick rapidly.

TWI's guidance for coated steels includes good water cooling and an electrode body diameter of at least 2.5 to 3 times the tip diameter, to improve heat flow from the face. For the 6 mm face, that means a body of at least 15 to 18 mm. The cooling water tube inside the electrode must reach close to the face, and the flow must be checked; a flow indicator on the return line is cheap insurance.

```figure
type: checklist
title: Electrode condition checks at the cabinet welder
caption: This is an illustration of the shop's routine. Each check prevents a failure that is invisible on the outside of the weld.
- x Electrode class matches the procedure | Class 2 CuCrZr caps for uncoated steel
- x Face diameter at dressing | 6.0 mm after dressing; dress by 500 welds
- x Face alignment | faces meet flat and centred, checked with carbon paper imprint
- x Cooling water flow | flow indicator showing; tube reaching the face
- x Stepper count | reset after each dressing
- *? Face pick-up or pitting | dress early and investigate the cause
```

## Where the force comes from

Electrode force on most pedestal and press welders comes from a pneumatic cylinder, so it depends directly on air pressure. The force is the gauge pressure times the piston area, less friction and any spring or weight acting against it.

This is an illustration. The cabinet welder's cylinder has an 80 mm bore. Its piston area is π/4 × 80² ≈ 5,027 mm², so at 6.0 bar (0.60 MPa) it produces 5,027 × 0.60 ≈ 3,016 N, close to the 3.0 kN in the schedule once a small allowance for friction is made. At 4.8 bar the force falls to 5,027 × 0.48 ≈ 2,413 N. That is the drop from 3.0 to about 2.4 kN that narrowed the welding window in Chapter 2's failure: a knock to a regulator, invisible at the electrodes, had removed a fifth of the force.

Two consequences follow for the electrodes. First, force is part of the schedule, so the air pressure that produces it must be recorded, regulated and protected from casual adjustment. Second, the gauge reading is not the force. Friction in the cylinder and guides, a sticking slide or a worn pivot reduce the force at the tips without changing the gauge. The shop therefore checks the actual tip force at the start of each shift with a load cell placed between the electrodes, and compares it with the schedule.

The way the force is applied matters too. When the nugget melts and the metal softens, the electrodes move together slightly as the indentation forms. The moving electrode must follow quickly, so that force is maintained while the nugget is liquid. A heavy, sluggish moving arm, or a cylinder with restricted exhaust, lets the force drop momentarily at exactly the wrong time, which shows up as unexplained expulsion. Makers call this follow-up, and it is one of the reasons a robust machine produces more consistent welds than a light one with the same nominal settings.

## Electrode shapes

Electrode faces come in several shapes. Truncated-cone faces, as on the cabinet welder, give a defined face diameter and, according to TWI, the longest lives on coated steels. Dome or radius faces concentrate force at the centre and tolerate slight misalignment, and they are used for aluminium (Chapter 9) and where appearance matters less. Flat faces with a large diameter are used on the outside of visible panels to minimise marking, often paired with a smaller electrode on the hidden side. Offset and cranked electrodes reach into corners and flanges.

Each shape changes the effective face area, and therefore the current density and pressure, so a change of electrode shape needs a new lobe check. That is one reason the shop keeps a drawing of each electrode in its schedule book, with the face diameter and material, and does not allow substitutions without approval.

Caps are consumables, and each dressing removes a little copper. The shop records how many dressings each pair of caps receives before it is too short to dress again, so that it can order caps and budget for them. On uncoated steel its caps last many dressings; on galvanised steel, as Chapter 9 shows, they are dressed and replaced far more often, and their cost becomes a noticeable part of the cost per weld in Chapter 10.

## A failure: the kinked hose

This is an illustration. On a Thursday afternoon, the cabinet welder began sticking: after several welds the electrodes welded themselves to the sheet and had to be twisted free. The setter dressed the tips, and within a few dozen welds they were sticking again, with copper smears on the steel and the faces visibly flattened.

The rapid mushrooming and sticking pointed to overheated electrodes, and the cooling estimate above showed how quickly uncooled copper heats. The fitter checked the water flow indicator on the return line: it was barely moving. A trolley had been parked on the cooling water hose behind the machine, kinking it almost shut.

The hose was rerouted through a protective channel, the flow indicator was moved to where the operator could see it, and a flow switch was fitted that stops the welder if flow drops below the set value. The damaged caps were replaced rather than dressed, because they had softened, and the welds made during the afternoon were checked by peel tests on coupons and by a sample of chisel tests on parts (Chapter 10). Several parts were reworked.

## Exercise: a smaller face

For a thin-sheet variant, the shop considers 5 mm faces at 3.0 kN and 9,000 A. Calculate the face area, current density and contact pressure. Then calculate how much the face could grow before its heating per unit area fell to 0.68 of the new value, the same relative loss at which the 6 mm faces are dressed.

Face area, π/4 × 5² = **19.63 mm²**. Current density, 9,000 ÷ 19.63 ≈ **458 A/mm²**. Contact pressure, 3,000 ÷ 19.63 ≈ **153 MPa**.

Heating per unit area follows the square of the area ratio, so a heating ratio of 0.68 means an area ratio of √0.68 ≈ 0.825, and because area follows diameter squared, a diameter ratio of √(1 ÷ 0.825) ≈ 1.10. The 5 mm face reaches the same relative loss at about 5 × 1.10 ≈ **5.5 mm**, a growth of only 0.5 mm. Smaller faces concentrate current and pressure more strongly, so they make smaller welds at lower current, but they also run hotter and lose their effectiveness after less growth, so they need more frequent dressing. The 153 MPa pressure would also deepen indentation, which matters on visible cabinet faces.
