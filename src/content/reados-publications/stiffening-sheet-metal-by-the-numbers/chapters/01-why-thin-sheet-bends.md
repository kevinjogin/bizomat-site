---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: why-thin-sheet-bends
order: 1
title: "Why thin sheet bends so easily"
description: "See why a thin panel's stiffness depends on the cube of its thickness, put a number on how far a flat panel bows, and catch a thicker-sheet fix that adds mass but misses the target."
draft: false
---

Sheet metal is strong in its own plane and weak out of it. Pull on a strip of 1.2 mm steel and it carries hundreds of kilograms before it yields. Push on the middle of the same strip, supported at its ends, and it bends under a fingertip. The difference has nothing to do with the metal's strength and everything to do with shape: in bending, only the material far from the middle of the section does useful work, and a thin sheet has almost no material far from its middle.

Every way of stiffening a panel in this book works by changing that. Thicker sheet moves material outwards a little. Flanges, beads, wired edges and attached stiffeners move a small amount of material a long way outwards. This chapter sets out the arithmetic that makes the second approach so much more effective than the first, puts a number on how far the running case's panel bows, and records the targets its redesign must meet.

## Bending stiffness and the cube of thickness

A strip of sheet bent across its width behaves like a very wide, very shallow beam. A beam's resistance to bending is its modulus of elasticity, E, multiplied by its second moment of area, I. For a rectangle of width b and depth t, I = b t³ / 12. Depth appears cubed: double the depth and the beam is eight times stiffer.

For a plate, which bends in two directions at once, the equivalent quantity is the **flexural rigidity**, D, the bending stiffness per unit width:

```figure
type: formula
title: Flexural rigidity of a flat plate
formula: D = E t³ / (12 (1 − ν²))
caption: This is an illustration using E = 200,000 MPa and ν = 0.3, typical values for carbon steel sheet. D has units of N·mm (newton-millimetres per millimetre of width).
- E | Modulus of elasticity, 200,000 MPa for steel
- t | Sheet thickness, 1.2 mm for SP-90
- ν | Poisson's ratio, 0.3 for steel
step: t³ = 1.2³ = 1.728 mm³
step: D = 200,000 × 1.728 / (12 × 0.91) = 31,648 N·mm
```

The term 1 − ν² appears because a plate bent in one direction is restrained from the sideways curl a narrow beam would take; for steel it raises the stiffness by about 10% over a beam of the same width. It does not change the main point. A plate's stiffness, like a beam's, grows with the cube of its thickness and only in direct proportion to its modulus.

## The running case: what 250 Pa does to SP-90

This is an illustration. SP-90 is a 600 × 900 mm panel of 1.2 mm zinc-coated steel, screwed to a frame at 150 mm pitch, with the inside of the enclosure held 250 Pa below the workshop. A pressure of 250 Pa is 0.00025 MPa, or 0.00025 N on each square millimetre. Over the panel's 540,000 mm², that is 135 N, about the weight of a 13.8 kg mass, spread evenly over the panel.

That is a small load, and the panel's stress under it is low, as Chapter 2 shows. Its deflection is not small. Treating the edges as simply supported, which is roughly what a row of screws into a light frame provides, the classical small-deflection result for a 600 × 900 mm plate gives a deflection at the centre of about **7.9 mm**. Chapter 2 sets out the calculation and its coefficients. For now, 7.9 mm is enough to explain the customers' first complaint: a panel bowing inwards by the thickness of a pencil is easy to see, especially when the extraction cycles on and off and the panel moves with it.

The figure is also an overestimate, for a reason Chapter 3 explains: a deflection more than about half the thickness puts the panel into a regime where stretching of its middle surface starts to carry load, and the small-deflection formula no longer applies. That correction helps a little. It does not make a bowing panel acceptable.

## What thicker sheet does

The obvious fix is thicker sheet. Because deflection under a given pressure is inversely proportional to D, and D is proportional to t³, deflection falls with the cube of thickness. The table shows the effect on SP-90 of the four thicknesses the builder's supplier keeps in stock.

```figure
type: compare
title: SP-90 as a flat panel in four thicknesses
cols: D, N·mm | Stiffness relative to 1.2 mm | Deflection under 250 Pa | Panel mass
caption: This is an illustration. Simply supported edges and small-deflection theory, so the deflections above about half the thickness are overestimates. Mass is for 0.54 m² of steel at 7,850 kg/m³.
- 1.0 mm | 18,315 | 0.58 | 13.7 mm | 4.24 kg
- *1.2 mm, as built | 31,648 | 1.00 | 7.9 mm | 5.09 kg
- 1.6 mm | 75,018 | 2.37 | 3.3 mm | 6.78 kg
- 2.0 mm | 146,520 | 4.63 | 1.7 mm | 8.48 kg
```

Going from 1.2 mm to 2.0 mm makes the panel 4.6 times stiffer and cuts the deflection to 1.7 mm, within the 3 mm target. It also adds 3.39 kg, two-thirds more steel, to every side panel, and makes the panel harder to fold, heavier to lift off for maintenance and dearer to buy. And, as Chapter 8 shows, a stiffer flat panel is not necessarily a quieter one.

### Stiffness per kilogram

A useful way to compare stiffening options is stiffness per kilogram. A flat panel's stiffness rises with t³ and its mass with t, so its stiffness per kilogram rises with t². Relative to 1.2 mm sheet, 1.6 mm sheet gives 1.78 times the stiffness per kilogram and 2.0 mm gives 2.78 times. That sounds respectable until it is compared with shape. Chapter 6 shows that rolling one shallow bead 20 mm wide and 4 mm deep into a 150 mm strip of 1.2 mm sheet raises that strip's second moment of area about ten times, for no extra mass at all, because the bead moves a little material 2 to 3 mm away from the middle of the section. Thickness moves all of the material a fraction of a millimetre.

```figure
type: bars
title: Bending stiffness of a 150 mm strip, relative to flat 1.2 mm sheet
unit: ×
max: 11
caption: This is an illustration. Second moment of area of a 150 mm wide strip about its own centroid. The beaded strip has the same mass as the flat 1.2 mm strip; the 2.0 mm strip has 67% more.
- Flat 1.2 mm | 1.0
- Flat 1.6 mm | 2.4
- Flat 2.0 mm | 4.6
- *1.2 mm with one 20 × 4 mm bead | 10.0
```

## The error: a quote for thicker sheet

This is an illustration. When the first complaints arrived, the builder's sales engineer asked the sheet supplier to requote SP-90 in 1.6 mm, reasoning that a third more thickness would surely fix a panel that only bowed a few millimetres. The price came back, the order was nearly placed, and the design office was asked to update the drawing.

The designer ran the numbers before changing the drawing. Deflection scales with 1/t³, so the thickness needed to bring 7.9 mm down to 3 mm is 1.2 × (7.9 / 3)^(1/3) = **1.66 mm**. The 1.6 mm panel would come out at 3.3 mm under 250 Pa, just outside the target, while adding 1.69 kg per panel. The designer also checked the panel's natural frequencies, as Chapter 8 does, and found that the 1.6 mm panel would have a mode at about 29.6 Hz, inside the band the builder had set around the fan's 24.2 Hz. A thicker flat panel would bow a little less and still hum.

The order was stopped. The lesson recorded was that thickness is the least efficient stiffener a sheet metal designer has, and that any proposed fix must be checked against every target, static and dynamic, before it is priced. The office added a line to its design review checklist: "If a panel is changed for stiffness, show the deflection and the first three natural frequencies before and after."

## Why shape works

The reason shape beats thickness lies in the second moment of area. For any section, I is the sum of each small piece of area multiplied by the square of its distance from the section's neutral axis. In a flat sheet, no material is more than t/2 from the neutral axis, 0.6 mm for SP-90. In a flange 20 mm deep, the flange's far edge is roughly 16 mm from the neutral axis of the flange and the sheet it is folded from, so each square millimetre there contributes over 700 times as much stiffness as a square millimetre at the surface of the flat sheet.

That is the whole idea of this book. Fold an edge, roll a bead, curl a rim over a wire or rivet on a light hat section, and a small amount of metal is placed far from the neutral axis where it does the most good. The remaining chapters put numbers on each method and on the trade-offs that come with it: forming strain, distortion, extra parts, and the effect on vibration.

### Where the panel actually fails

It helps to be clear about which of a panel's behaviours is the real problem, because they have different fixes:

- **Bowing under steady load** is a stiffness problem. It is solved by raising D or by dividing the panel into smaller bays.
- **Oil-canning**, the sudden pop of a panel from one shape to another, is a stability problem. It comes from residual stress and slight initial curvature, and Chapter 3 shows how small the stresses involved are.
- **Buckling in the sun** is a thermal stability problem, caused by a panel expanding against a frame that does not. It is solved by shape, curvature or freedom to move.
- **Drumming** is a resonance problem. It is solved by moving the panel's natural frequencies away from the excitation, or by damping, and Chapter 8 shows that static stiffness alone does not guarantee it.

SP-90 has all four, which is common for a large flat panel of thin sheet. A redesign that fixes only one will produce a new complaint.

### The loads a panel actually sees

Before choosing a stiffener it is worth listing what a panel must resist, because the loads on enclosure and cover panels are usually small and easily forgotten. For SP-90 the builder listed five:

1. **Steady pressure difference.** The extraction's 250 Pa is the design case for bowing. Ventilated enclosures, air-handling casings, ducts and cabinets with filtered fans all see something similar, and the pressure can reverse when a door opens or a damper closes.
2. **Hand loads.** People lean on, push against and bump into side panels. A hand push is a concentrated load over a palm-sized area, and it is what reveals oil-canning, because it pushes a slightly curved panel through its flat position.
3. **Temperature differences.** Sun through a window, a heater nearby or a hot motor inside can warm the panel a few degrees more than its frame. Chapter 3 shows why a few degrees matter.
4. **Vibration from machinery.** The fan and motor shake the frame at their running frequencies and at multiples of them, and the panel responds strongly to any that match its own.
5. **Handling.** A lift-off panel is carried, leaned against a wall and dropped on a corner. Its edges take knocks that a fixed panel never sees, which is one reason Chapter 5 deals with edge treatments.

Each load points to a different property of the panel: stiffness for the first, stability for the second and third, frequency for the fourth, and edge robustness for the fifth. A designer who writes the loads down at the start is less likely to fix the obvious one and miss the rest.

### Edges: supported or clamped

A panel's behaviour depends heavily on what holds its edges. A panel whose edges can rotate freely but not move sideways is called **simply supported**; one whose edges can neither move nor rotate is **clamped**. A row of screws at 150 mm pitch into a light frame is somewhere between the two, closer to simply supported because the thin sheet rotates easily between and around the screws. Chapter 2 shows that the same panel deflects about three and a half times as much when simply supported as when clamped, so the assumption matters. This book uses simply supported edges for SP-90's design calculations, because that assumption errs on the safe side for deflection, and checks the result with a test in Chapter 9.

## The design targets

This is an illustration. Before looking at options, the builder's designer wrote down what a successful SP-90 must do, so that every option could be judged against the same list.

```figure
type: checklist
title: SP-90 redesign targets
caption: This is an illustration. Targets set by the builder for its own product. Panels that guard people or contain noise exposure have their own requirements in addition to targets like these.
- ? Deflection under 250 Pa | no more than 3 mm at any point
- ? Natural frequencies | no panel mode within 25% of 24.2 Hz (fan) or 48.0 Hz (motor)
- ? Thermal stability | no visible buckling with a 10 °C difference between panel and frame
- ? Oil-canning | no snap-through when pushed by hand at the centre
- ? Mass | no more than 8.0 kg per side panel, so one person can lift it off
- ? Manufacture | made with the folder, bead roller and riveting tools already in the workshop
```

The fan's frequency is 1,450 rpm ÷ 60 = 24.2 Hz and the motor's is 2,880 ÷ 60 = 48.0 Hz. A 25% band around each gives 18.1 to 30.2 Hz and 36.0 to 60.0 Hz. Those bands are the builder's own working rule, chosen because the panel's edge conditions and the machines' speeds are both uncertain; a different product might justify a narrower or wider margin.

### What the targets rule out

The targets already eliminate the simplest fix. A plain 2.0 mm panel meets the deflection target at 1.7 mm, but at 8.48 kg it exceeds the mass limit, and Chapter 8 shows its second mode sits at 37.0 Hz, inside the motor band. A plain 1.6 mm panel fails on deflection and on frequency. Whatever SP-90 becomes, it will be shaped, not merely thickened.

## Exercise: an aluminium panel

A customer asks whether SP-90 could be made from aluminium sheet instead, to save weight. Take E = 70,000 MPa and ν = 0.33 for the aluminium, and a density of 2,700 kg/m³.

1. What is the flexural rigidity of a 1.0 mm aluminium panel, and roughly how far would it deflect under 250 Pa as a simply supported 600 × 900 mm plate, using the 1.2 mm steel panel's 7.9 mm as a reference?
2. What thickness of aluminium would match the 1.2 mm steel panel's D, and what would that panel weigh?

**Worked answer.**

1. D = 70,000 × 1.0³ / (12 × (1 − 0.33²)) = 70,000 / 10.69 = **6,546 N·mm**. Deflection is inversely proportional to D, so the aluminium panel deflects 7.9 × 31,648 / 6,546 = **38.2 mm** under the same pressure, far outside the small-deflection range and clearly unacceptable. It weighs only 1.46 kg, but a 1.0 mm aluminium panel of this size is a sail.
2. To match D, t³ must equal 31,648 × 12 × (1 − 0.33²) / 70,000, so t = **1.69 mm**. That panel weighs 2,700 × 0.00169 × 0.54 = **2.47 kg**, a little under half the steel panel's 5.09 kg, with the same stiffness and the same bowing problem. Aluminium can save weight at equal stiffness, but it does not by itself solve any of SP-90's four problems. With the same D and less than half the mass per square metre, its natural frequencies come out about 1.44 times the steel panel's, which moves the second and third modes to about 31.9 Hz and 51.0 Hz. The first is just clear of the fan band and the second sits inside the motor band. The drumming question has moved, not gone. Shape is still needed.
