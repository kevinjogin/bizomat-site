---
book: adhesive-bonding-by-the-numbers
chapterSlug: thermal-movement-and-bondline-thickness
order: 8
title: "Thermal movement and bondline thickness"
description: "Movement between bonded parts that expand differently, the stress when a rigid bond stops it, sizing an elastic bondline to absorb it, and temperature differences within one material."
draft: false
---

Every material changes size with temperature, and different materials change by different amounts. Bolted and riveted joints usually allow for this through clearance in their holes. A bonded joint has no clearance: the adhesive holds the two surfaces together over their whole area, so any difference in their expansion has to be taken somewhere. It is taken either by the adhesive shearing, by the parts being stressed, or by the joint breaking. Which happens depends on how stiff and how thick the bondline is.

This chapter calculates the movement between Plant K's polycarbonate window and its aluminium door, shows what happens when a rigid bond prevents it, sizes an elastic bondline that absorbs it, and looks at the less obvious case of one material at two temperatures. Its error explains the cracks in the first windows.

## How much the parts move

A free part of length L changes length by αLΔT for a temperature change ΔT, where α is the coefficient of linear expansion. Two parts of different α joined at a point move apart, away from that point, by (α₁ − α₂)LΔT. For a bonded window, which is held round its edge and has no fixed point, it is natural to take the centre as the point that does not move, so each edge moves relative to the door by half the total.

Plant K's window is 300 by 200 mm. The plant took an illustrative expansion coefficient of 65 µm/m·K for its polycarbonate from the sheet supplier's data and 23 µm/m·K for the aluminium door. The window is installed at about 20 °C. A dark kiosk door in summer sun can reach 70 °C, and on a frosty night it can fall to −5 °C, so the window must cope with a rise of 50 K and a fall of 25 K from its installed state.

The [plastic–metal thermal mismatch tool](/tools/plastic-thermal-mismatch/) works out both sides of the problem. From the two expansion coefficients, the plastic's modulus at temperature (or an apparent creep modulus read from a creep curve), the temperature change and the length between fixings, it gives the stress in the plastic if the metal fully restrains it, σ = (α_m − α_p)E_pΔT, whether that is tension or compression, the free expansion of each part, the relative movement if they were unrestrained, and a check of the stress against an allowable value you enter.

```figure
type: compare
title: The window against the door, along its 300 mm length
rowhead: Condition
cols: Free growth of window | Free growth of door | Relative movement | Stress if fully restrained
caption: This is an illustration. From the plastic–metal thermal mismatch tool with α 65 and 23 µm/m·K, a plastic modulus of 2,300 MPa and a 300 mm length. The relative movement at each short edge is half the total, measured from the window's centre.
- * Hot, +50 K | 0.975 mm | 0.345 mm | 0.63 mm, 0.315 mm each end | 4.83 MPa compression
- Cold, −25 K | −0.4875 mm | −0.1725 mm | 0.315 mm, about 0.16 mm each end | 2.41 MPa tension
```

Along the 200 mm direction, the same numbers scale down to a relative movement of 0.21 mm at each long edge when hot.

### How hot does a door get?

The 70 °C figure deserves a check, because the whole calculation scales with it. A surface in sun absorbs a fraction of the solar radiation falling on it, its solar absorptance, and loses heat to the air by convection and radiation. With nothing behind it to carry heat away, it settles where the two balance: its rise above the air temperature is roughly the absorbed solar flux divided by a combined surface heat transfer coefficient.

Taking a clear-sky solar flux of about 1,000 W/m² on a surface facing the sun and an illustrative combined coefficient of 18 W/m²K for a lightly breezy day, a dark door with an absorptance of 0.9 rises about 0.9 × 1,000 ÷ 18 = 50 K above the air, and a light grey or white door with an absorptance of 0.3 about 17 K. On a 35 °C day, that is about 85 °C for the dark door and 52 °C for the light one. The plant's 70 °C was therefore not the worst case for a dark door in still air, which is one reason it chose a bondline with a generous margin, and one reason its sales team now recommends light colours for kiosks in full sun. Measurements on a real door, with a contact thermometer or an infrared thermometer set to the coating's emissivity, settle the question better than any estimate.

### The corners move most

The movement is greatest not at the middle of an edge but at the corners, which are farthest from the centre. The window's half-diagonal is half of √(300² + 200²) = 180.3 mm, so a corner moves (65 − 23) × 10⁻⁶ × 180.3 × 50 = 0.379 mm relative to the door when hot, diagonally. In a 3 mm bondline that is a strain of 12.6%, a little above the 10.5% at the middle of the short edges. Corners are also where a bead of adhesive is most often thin or broken, because it has to turn, so the plant's procedure has the operator run the bead continuously round each corner on a radius and check the corners by eye after placing the window.

## Two ways to cope

The movement can be resisted or accommodated.

- **Resist it.** A rigid adhesive in a thin bondline forces the two parts to move together. The window is then stressed: in compression when hot, in tension when cold. The tool says that if the restraint were complete and uniform, the stress would be 4.83 MPa hot and 2.41 MPa cold.
- **Accommodate it.** A flexible adhesive in a thick bondline lets the window move relative to the door, the adhesive shearing to take up the difference. The window then carries almost no stress, and the adhesive's shear strain is the movement divided by the bondline thickness.

```figure
type: formula
title: Shear strain in a bondline that takes the movement
caption: The edge of the bond moves relative to the door by δ; the adhesive layer of thickness h shears by δ ÷ h. Elastic adhesives are specified with a movement or shear strain capability that the design must stay within for repeated cycles.
- γ = δ ÷ h | shear strain in the adhesive
- step: h_min = δ ÷ γ_allow | the least bondline thickness for an allowable strain
- step: τ = G γ | the shear stress the adhesive passes to the parts
```

At Plant K's hottest condition, δ = 0.315 mm at each short edge. The bondline strain then depends almost entirely on thickness.

```figure
type: bars
title: Shear strain in the window bondline at +50 K, by thickness
unit: percent
caption: This is an illustration. Movement of 0.315 mm at each short edge. A rigid epoxy cannot shear anything like 158%, so with a thin bondline the window is restrained and stressed instead. An elastic adhesive at 3 mm shears by about 10%.
- 0.2 mm rigid epoxy | 157.5
- 1 mm | 31.5
- * 3 mm elastic adhesive | 10.5
```

An elastic adhesive's data sheet usually states a movement capability for repeated cycling. If Plant K's chosen polyurethane allowed an illustrative 25% in cyclic shear, the least bondline would be 0.315 ÷ 0.25 = 1.26 mm. The plant chose 3 mm, set by double-sided foam spacer tape round the outside of the bead, giving about 10.5% when hot and about 5% when cold, comfortably within the limit and with margin for a hotter door than expected. With an illustrative shear modulus of about 1 MPa, the stress the adhesive passes to the window at 10.5% strain is about 0.1 MPa, negligible for the polycarbonate.

## The error: the stress looked acceptable

The first windows were bonded with the same toughened epoxy as the stiffeners, at the same thin bondline, because it was already on the bench and its strength was not in doubt. Before approving this, the engineer ran the thermal mismatch tool. It returned a restrained stress of 4.83 MPa in compression at +50 K, checked against an allowable of 20 MPa for the polycarbonate, and gave the verdict that the stress was acceptable. On that basis the windows were bonded with epoxy.

After a hot week, three of the first twenty windows showed fine cracks in the polycarbonate, running parallel to the bond edge on the inside of the window, close to where the bonded flange met the free, unbonded centre.

Three things had been overlooked, each of them in the tool's own notes.

- **The restraint was not uniform.** The tool's stress assumes the plastic is uniformly and completely restrained. The window was restrained only round its 20 mm bonded flange; the unbonded centre was free. At the edge of the bond, the strain the rigid bond imposed on the flange met the free expansion of the centre, and the stress concentrated there, at a sharp change in restraint, well above the uniform 4.83 MPa.
- **The loading was cyclic and sustained.** The window heats every sunny day and cools every night. A glassy plastic held under sustained or repeated stress can craze and crack at stresses well below its short-term strength, and polycarbonate is known for this, especially at a stress concentration. An allowable stress chosen from short-term strength does not apply.
- **The tool's fixing note had been ignored.** The tool advised allowing for about 0.63 mm of movement with slots or flexible fixings if full restraint was not needed. Full restraint was not needed. The window only had to be held and sealed.

```figure
type: decision
title: Restrain or accommodate the thermal movement?
question: Does the joint have to transfer structural load between the two parts?
caption: Where the joint must carry load, restraining the movement may be unavoidable, and then the stresses, including concentrations at bond edges and long-term behaviour, must be checked. Where it only has to hold and seal, accommodating the movement is almost always safer.
- No, it only holds and seals | accommodate | elastic adhesive, bondline at least movement ÷ allowable strain
- * Yes, but the parts expand very differently | accommodate if at all possible | flexible adhesive or mechanical fixing with slots
- Yes, and the parts expand alike | restrain | rigid structural adhesive, check temperature differences
```

The plant replaced the epoxy with the elastic polyurethane at 3 mm. Windows bonded this way went through a summer without cracking, and a check on a heated test door showed the window moving visibly relative to the door edge, as intended. The cracked windows were replaced.

## One material at two temperatures

The stiffeners raise a less obvious version of the same problem. Aluminium stiffener and aluminium skin have the same expansion coefficient, so they move together at a uniform temperature. But in sun, the outer skin is heated directly while the stiffener inside is shaded and runs cooler. A temperature difference between the parts produces a mismatch just as different materials do.

If the skin runs 20 K hotter than a stiffener and the rigid bond forces them to stay together, the stiffener is stretched by the difference in free growth. If the skin did all the forcing, the stiffener would carry a stress of E α ΔT = 70,000 × 23 × 10⁻⁶ × 20 = 32.2 MPa, and with a cross-section of about 160 mm², a force of about 5.15 kN. In reality the skin also gives a little, so the force is somewhat less. That force has to pass from skin to stiffener through the bondline, and Chapter 6's shear lag puts almost all of it through the last few millimetres at each end of the stiffener. It adds to whatever the panel's bending puts there.

```figure
type: stats
title: Sun on the door: a temperature difference between skin and stiffener
caption: This is an illustration. Skin 20 K hotter than a stiffener of the same aluminium, rigid bond, skin assumed to do all the forcing, which overstates the force somewhat. The force enters at the stiffener ends, the same place where peel starts.
- 20 K | temperature difference between skin and stiffener
- 32.2 MPa | stress in the stiffener if fully restrained
- 5.15 kN | force in a 160 mm² stiffener, passing through the bond at each end
- daily | how often the load cycles in summer
```

Plant K's tapered, riveted stiffener ends of Chapter 7 already deal with this, but the calculation showed why an end detail matters even on a door that is never dropped. A flexible adhesive would avoid the force but would also stop the stiffener stiffening the skin. For a structural stiffener, the rigid bond with good ends is the right choice.

### Bondline thickness control

The thermal calculations assume a known bondline thickness, and production has to deliver it. Thin structural bondlines are commonly controlled by glass or polymer beads of a set diameter mixed into the adhesive or sprinkled on the bead, which stop the parts being squeezed closer. Thick elastic bondlines are set by spacer tape, by blocks or by the geometry of the parts. Without a control, clamping pressure squeezes the adhesive out until the parts touch at high spots, and the bondline may be close to zero just where it matters.

The plant checks its window bondline on the first door of each batch by measuring the gap between door and window at each corner and at the middle of each edge with a feeler gauge before the adhesive skins over, and its stiffener bondline on scrap coupons by measuring the total thickness of the bonded pair with a micrometer and subtracting the two sheet thicknesses. Neither check takes more than a few minutes, and both have caught a missing spacer.

## How this applies to a small Australian business

When you bond unlike materials, calculate the movement over the full service temperature range, including sun and frost. If the joint only has to hold and seal, accommodate the movement with a flexible adhesive in a bondline at least the movement divided by the adhesive's allowable strain, and control that thickness in production. If you restrain the movement, remember that a uniform restrained-stress calculation understates the stress at the edges of a bond, and that plastics under sustained stress can crack well below their short-term strength. Watch for temperature differences between parts of the same material, too.

## Exercise: a larger window

A new door type has a polycarbonate window 600 by 400 mm, with the same materials and temperature range. (a) What is the relative movement at each short edge when hot? (b) What least bondline thickness does an adhesive with a 25% allowable cyclic shear strain need? (c) What else changes with a larger window?

**Worked answer.** (a) The total relative movement along 600 mm at +50 K is (65 − 23) × 10⁻⁶ × 600 × 50 = 1.26 mm, so **0.63 mm at each short edge**. (b) h_min = 0.63 ÷ 0.25 = **2.52 mm**, so the plant's 3 mm bondline still works, but with less margin: the strain would be 21%. A 4 mm bondline would restore a comfortable margin at about 16%. (c) The larger window is heavier and has more wind load and handling load on its bond, and the long edges move 0.42 mm each. The bond flange may need to be wider, and the window may need locating blocks while the adhesive cures, as Chapter 5 describes for moisture-curing adhesives.
