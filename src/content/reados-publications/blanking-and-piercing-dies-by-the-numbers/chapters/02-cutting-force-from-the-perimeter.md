---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: cutting-force-from-the-perimeter
order: 2
title: "Cutting force from the perimeter"
description: "Estimating a die's cutting force from cut length, thickness and shear strength, the MP-40 die's 192.8 kN, three estimates compared, stepped punches, shear angles and a slot left out."
draft: false
---

The first number anyone asks about a die is how much force it needs, because that decides which press can run it. The estimate is simple: the force to cut is the area of metal being sheared multiplied by the stress at which it shears. The area is the length of every edge being cut at once multiplied by the sheet's thickness. Getting that length right, and choosing a sensible shear strength, is most of the work.

This chapter works out MP-40's cut perimeters, estimates the die's force three ways, shows how stepping punches and grinding shear on them lowers the peak, and ends with a force estimate that missed a feature and nearly put the die in a press too small for it.

## The estimate

When a punch cuts, the metal resisting it is a band around the punch's whole outline, as deep as the sheet is thick. The peak force is roughly that band's area times the material's shear strength:

F = L × t × τ

where L is the total length of all edges cut in the same stroke, in millimetres, t is the sheet thickness in millimetres, and τ is the shear strength in megapascals. Since one megapascal is one newton per square millimetre, the result is in newtons. Hodgson used the same relationship in 1903, in inches and tons, and every punch maker publishes a version of it today. READOS's Sheet Metal Parts by the Numbers applies it to single holes in [its chapter on press brake and punching force](/reados/publications/sheet-metal-parts-by-the-numbers/press-brake-and-punching-force/), and WORKOS's [punching force calculator](/tools/punching-force/) does the arithmetic.

The estimate deliberately ignores several things: the friction of the punch in the sheet, the extra force of blunt edges, the effect of clearance, and the stripper springs, which press down on the strip at the same time. Chapter 5 adds the springs. The others are covered by the margin a press is chosen with, and they are why a force estimate is a starting point, not a press rating.

```figure
type: formula
title: Cutting force from perimeter, thickness and shear strength
formula: F = L × t × τ
caption: This is an illustration for the whole MP-40 die, every station cutting in the same stroke. With L in mm, t in mm and τ in MPa, F is in newtons.
- L | Total length cut in one stroke, 344.24 mm
- t | Sheet thickness, 2.0 mm
- τ | Shear strength, 280 MPa (assumed)
step: F = 344.24 × 2.0 × 280 = 192,774 N
step: F ≈ 192.8 kN
```

## MP-40's cut lengths

The perimeter has to be found for every edge cut in the same stroke. In a progressive die that has filled with strip, every station cuts at once, so the die's force is the sum of all its stations. MP-40 has three features to pierce and one outline to blank.

**The outline.** A rectangle 80 × 50 mm with four R6 corners. The straight parts are the rectangle's perimeter less two radii at each corner, and the four quarter-circle corners together make one full circle of radius 6:

- straight edges: 2 × (80 + 50) − 8 × 6 = 260 − 48 = 212.00 mm;
- corners: 2 × π × 6 = 37.70 mm;
- outline: **249.70 mm**.

**Each hole.** π × 8.5 = **26.70 mm**, so the two holes cut 53.41 mm.

**The slot.** An obround 16 mm long and 8 mm wide is two straight sides, each 16 − 8 = 8 mm long, and two semicircular ends that together make a circle of 8 mm diameter:

- straight sides: 2 × 8 = 16.00 mm;
- ends: π × 8 = 25.13 mm;
- slot: **41.13 mm**.

Pierced features add up to 94.54 mm and the outline to 249.70 mm, a total cut length of **344.24 mm** in every stroke. A CAD system will measure the same perimeters directly from the part's flat outline, and that is the better source for complicated shapes. The hand calculation is still worth doing once, because it checks the CAD figure and shows where the length is.

## The force at each station

Multiplying each length by t × τ = 2.0 × 280 = 560 N per millimetre of cut gives:

- outline, at station 3: 249.70 × 560 = **139.8 kN**;
- each hole: 26.70 × 560 = 14.95 kN, so **29.9 kN** for the pair;
- slot: 41.13 × 560 = **23.0 kN**;
- piercing station in total: **52.9 kN**;
- whole die: **192.8 kN**.

The outline takes almost three quarters of the force. That is typical of blanking dies: the blank's perimeter is usually the longest cut, and it is the place to look first if the force must come down.

```figure
type: bars
title: Cutting force by feature in the MP-40 die
unit: kN
max: 150
caption: This is an illustration with a shear strength of 280 MPa and 2.0 mm sheet, 560 N per millimetre of cut. The four features total 192.8 kN when they cut together.
- * Outline, station 3 | 139.8
- Slot, station 1 | 23.0
- Hole 1, station 1 | 15.0
- Hole 2, station 1 | 15.0
```

## Which strength to use

The weakest part of the estimate is τ. Shear strength is rarely on a mill certificate; tensile strength is. So shear strength is usually taken as a fraction of the tensile strength, and the fraction used makes a real difference.

- **Shear strength as 0.8 of tensile strength**, the assumption in this book: 0.8 × 350 = 280 MPa, giving **192.8 kN**.
- **The textbook estimate** in Kalpakjian and Schmid's Manufacturing Engineering and Technology, maximum punch force of about 0.7 × tensile strength × t × L: 0.7 × 350 × 2.0 × 344.24 = **168.7 kN**.
- **Tensile strength used directly**, a cautious upper bound some shops use when the material is uncertain: 350 × 2.0 × 344.24 = **241.0 kN**.

The three figures span more than 40% from lowest to highest. None is wrong; they reflect different assumptions about the material and how much margin is built into the number. What matters is that the shop knows which one it is using, uses the same one every time, and compares its estimates with measured forces when it can. A press with a tonnage monitor, or a load cell under a die on a trial, gives real numbers to calibrate against.

Material variation also matters. A steel sold to a minimum tensile strength may arrive well above it, and a die estimated on the minimum will need more force than its estimate. For MP-40, the shop uses the 0.8 ratio on the certificate's measured strength and then chooses the press with a margin.

```figure
type: compare
title: Three estimates of the MP-40 die's cutting force
rowhead: Method
cols: Strength used | Force, kN | Against the book's method
caption: This is an illustration with a tensile strength of 350 MPa, 2.0 mm sheet and 344.24 mm of cut. The spread is a reason to state the method with the number.
- Textbook, 0.7 × tensile strength | 245 MPa effective | 168.7 | −12.5%
- * Shear strength as 0.8 × tensile strength | 280 MPa | 192.8 | basis
- Tensile strength directly | 350 MPa | 241.0 | +25.0%
```

## Lowering the peak by stepping punches

The force estimate assumes that every edge cuts at the same instant. It does not have to. If the piercing punches are made shorter than the blanking punch, the blanking punch cuts first, breaks through, and only then do the piercing punches reach the strip. The peak force on the press is then the larger of the two stations, not their sum.

For MP-40, with the piercing punches stepped back by a little more than the sheet's thickness, say 2.5 mm, the peak falls from 192.8 kN to **139.8 kN**, the outline alone, a reduction of 27%. The total work done each stroke does not change, because the same metal is cut; it is spread over more of the stroke. The cost is a few millimetres more punch entry for the longer punch, more stroke used near the bottom, where a mechanical press has the most force available, and a little more care in setting so that the shorter punches still enter the die fully.

Stepping works best when the stations are close in force. MP-40's outline dominates, so stepping cannot bring the peak below the outline's 139.8 kN. To go lower, the outline's own force has to be spread.

## Shear on the cutting edges

A guillotine's blade is set at an angle, its rake, so that it cuts progressively along the sheet instead of all at once. Hodgson noted shearing machines with a dip on one blade of 5 to 15 degrees, for exactly that reason, and WORKOS's [shearing blade force calculator](/tools/shearing-blade-force/) estimates the force on a raked blade. A die can do the same by grinding **shear** into a cutting face: the face is ground in a shallow V or a wave, so that only part of the outline cuts at a time.

Shear has a cost in flatness. Whichever piece sits against the sheared tool is bent as it is cut. The rule follows from which piece is kept:

- for **blanking**, the shear goes on the **die**, so that the blank, which is pushed against the flat punch, stays flat, and the skeleton is distorted;
- for **piercing**, the shear goes on the **punch**, so that the strip, which sits on the flat die, stays flat, and the slug is distorted.

Shear also complicates sharpening, because the ground form must be restored at every regrind, and it can push a punch sideways if it is not symmetrical. For a 2.0 mm plate in a 192.8 kN die, MP-40's shop does not need it. It is the tool of choice when a long blank in thick sheet needs more force than the available press can give.

## Force, work and the press

Force decides whether a press is strong enough. **Work**, the energy used each stroke, decides whether its flywheel can supply the stroke without slowing too much, and it is roughly the force times the distance over which it acts. Because the cut is over before the punch has travelled the full thickness, the work is less than F × t. Stepping punches leaves the work unchanged and lowers the peak; shear lowers the peak and spreads the same work over more travel. Power Presses by the Numbers takes up the work side, and shows why a press can have enough force and still not enough energy.

## Checking the estimate on the press

An estimate is worth more once it has been checked against a measurement. Many presses carry a **tonnage monitor**: strain gauges on the frame or connecting rods that read the peak load each stroke. A die tried on a monitored press gives a direct comparison with its estimate, and a shop that records those comparisons builds a calibration for its own materials and dies that is better than any textbook ratio.

This is an illustration. On its first trial, the MP-40 die ran on a monitored press with a new, sharp set of tools and a coil whose certificate gave a tensile strength of 352 MPa. The monitor read a peak of **209 kN** per stroke, including the stripper springs. The estimate, 192.8 kN of cutting plus 28.5 kN of springs, was 221.3 kN, so the die ran about 6% under it. The shop noted three things.

- The estimate was conservative with sharp tools, which is what it should be. As the edges wear, the peak rises; the monitor's reading at the end of a sharpening interval is the more useful figure for choosing a press.
- The reading is the peak of everything happening at once, including any friction in the pilots and guide pillars. It cannot separate the cutting force from the springs; a trial with the springs removed, on inching, can.
- One trial is one data point. The shop's log of estimated against measured peak loads, die by die and material by material, is what turns the 0.8 ratio from an assumption into the shop's own number.

Monitors are also the press's protection. Set with an upper limit a little above the die's normal peak, they stop the press when a double blank, a slug or a misfeed drives the load up, before the die or the press is damaged. Power Presses by the Numbers returns to them.

## The error: a feature left out

This is an illustration. The first force estimate for the MP-40 die was made by copying an older estimate for a similar plate that had two holes and no slot, and updating the outline. It came to 139.8 + 29.9 = **169.7 kN**. With the stripper springs, about 28.5 kN at the bottom of the stroke (Chapter 5), the total looked like 198 kN, and a 200 kN press in the shop was pencilled in to run the die.

The toolmaker's design review caught it. The review checks the force estimate against the total cut length measured from the CAD model, and the CAD figure was 344.24 mm, not the 303.11 mm the estimate implied. The missing 41.13 mm was the slot, worth 23.0 kN. The corrected total, 192.8 kN of cutting plus 28.5 kN of springs, is 221.3 kN, which would have overloaded the 200 kN press by about 11% on every stroke, before any allowance for blunt edges or harder steel.

The fix was to move the die to a larger press, the subject of the companion book, and to change the estimating rule: every force estimate starts from the cut length measured on the current model, lists each feature with its length, and is checked by someone who did not make it.

```figure
type: checklist
title: Force estimate checks before a press is chosen
caption: Each check closes a way in which a die's force has been underestimated in practice.
- Every feature cut in the same stroke listed with its length | outline, two holes, slot
- Total length checked against the CAD model | 344.24 mm
- Strength method stated and used consistently | 0.8 × measured tensile strength
- Stripper and pressure pad springs added | 28.5 kN at the bottom (Chapter 5)
- Margin for blunt edges and material variation applied | in the press choice
- x Estimate copied from a similar die | slot left out, 23.0 kN missing
```

## Exercise: MP-40 in stainless steel

A customer asks for a version of MP-40 in 1.6 mm austenitic stainless steel, same outline, holes and slot. Taking an illustrative shear strength of 500 MPa, estimate the die's total cutting force, the outline's share, and the peak if the piercing punches are stepped back.

**Worked answer.** The cut length is unchanged at 344.24 mm. With t × τ = 1.6 × 500 = 800 N per millimetre:

- whole die: 344.24 × 800 = **275.4 kN**;
- outline: 249.70 × 800 = **199.8 kN**;
- piercing station: 94.54 × 800 = 75.6 kN.

The thinner stainless sheet needs 43% more force than the 2.0 mm steel, because its shear strength is higher by more than its thickness is lower. With the piercing punches stepped back by a little more than 1.6 mm, the peak falls to the outline's **199.8 kN**. The stainless version also wears the edges faster and needs a different clearance, which Chapter 3 considers.
