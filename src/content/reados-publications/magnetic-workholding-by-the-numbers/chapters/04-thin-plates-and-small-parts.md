---
book: magnetic-workholding-by-the-numbers
chapterSlug: thin-plates-and-small-parts
order: 4
title: "Thin plates and small parts"
description: "Why thin parts saturate and small parts fail to bridge the poles: a minimum thickness from pole width and saturation, fine-pole chucks, pole extensions and how to choose pole pitch."
draft: false
---

A chuck that holds a 25 mm plate so firmly that it cannot be moved by hand can let a 3 mm plate slide off with a push. Nothing is wrong with the chuck. A thin part cannot carry the flux that the chuck's poles are able to deliver, and a small part cannot reach from one pole to the next. Both limits come straight from the magnetic circuit, and both can be estimated before a part is put on the chuck.

This chapter derives a minimum thickness for full holding force from the pole width and the steel's saturation, applies it to thin parts on the case's chuck, compares the chuck with a fine-pole chuck, and sets out what small parts need. The error is a batch of thin spacer strips milled on the coarse-pole chuck.

## Why thin parts hold less

Chapter 1 described the flux path: from a north pole up into the part, sideways through the part, and down into the neighbouring south pole. The flux crossing the contact over one pole face has to turn and travel through the part's cross-section. If the pole face is w wide and the flux density at the contact is B, then per unit length of pole the flux is B × w. Roughly half goes each way to the neighbouring poles of opposite polarity, through a cross-section of the part's thickness t. The flux density inside the part is therefore about B × w ÷ 2t.

The part can carry flux only up to its saturation, Bs. Setting the flux density inside the part equal to Bs gives the thickness below which the part saturates:

```figure
type: formula
title: Minimum thickness for full holding force
formula: t_min ≈ B × w ÷ (2 × Bs)
formula: Below t_min: B_contact ≈ 2 × Bs × t ÷ w, so force ∝ t²
formula: Case's chuck: t_min ≈ 1.2 × 50 ÷ (2 × 2.0) = 15 mm
caption: A one-dimensional estimate. Real flux spreads in three dimensions and some leaks, so the change from full force to the thin-part law is gradual rather than sharp. The estimate shows the scale and how it depends on pole width.
- B | flux density at the contact with a thick part, T
- w | pole width in the direction the flux travels, mm
- Bs | saturation flux density of the part, about 2.0 T for low-carbon steel
- t | part thickness, mm
```

Below the minimum thickness, the flux density at the contact can be no more than the part can carry away, about 2Bs × t ÷ w, and since force goes as the square of the flux density, the force falls as the square of the thickness. Halving the thickness of a thin part quarters its holding force.

```figure
type: bars
title: Holding force on a BP-600-sized plate by thickness, case's coarse-pole chuck
unit: kN
max: 80
caption: This is an illustration. 54 poles fully covered, ground contact, B = 1.2 T for thick parts, Bs = 2.0 T. Below 15 mm the force follows the square of the thickness.
- 3 mm | 3.1
- 6 mm | 12.4
- 10 mm | 34.4
- 12 mm | 49.5
- * 15 mm and thicker, BP-600 at 25 mm | 77.3
```

BP-600, at 25 mm, is comfortably above the minimum, so its thickness costs nothing. A 3 mm sheet of the same size on the same chuck gets 4% of the force: 3.1 kN normal and about 0.6 kN of sliding resistance at a friction coefficient of 0.2, enough to resist a light hand push but not a cutter.

## Pole pitch: the cure for thin parts

The minimum thickness is proportional to the pole width. Narrow poles, close together, need only a thin part to carry their flux, because each pole's flux travels a short distance to its neighbour. That is the reason fine-pole chucks exist: their poles are a few millimetres wide, typically as parallel strips of steel separated by thin non-magnetic spacers, and they hold thin sheet that a coarse-pole chuck cannot.

The price is a shallower field. Fine poles deliver less flux per unit area of the chuck, because there is less room for magnets or coils behind each pole, and their flux does not reach far into the part. They also have a small equivalent gap g₀ in the sense of Chapter 3: they are very sensitive to rough or scaled contact.

This is an illustration. The shop's grinder has a fine-pole electromagnetic chuck with 8 mm poles on a 10 mm pitch, and its maker's data give 0.7 T at the contact with a thick ground part.

```figure
type: compare
title: Coarse-pole and fine-pole chucks on parts of BP-600's outline, ground contact
cols: Coarse poles, 50 mm on 60 mm pitch | Fine poles, 8 mm on 10 mm pitch
rowhead: Quantity
- Flux density at the contact, thick part | 1.2 T | 0.7 T
- Minimum thickness for full force | about 15 mm | about 1.4 mm
- Normal force, 25 mm plate | 77.3 kN | 37.4 kN
- Normal force, 6 mm plate | 12.4 kN | 37.4 kN
- * Normal force, 3 mm plate | 3.1 kN | 37.4 kN
- Sensitivity to rough or scaled contact | lower | higher
caption: This is an illustration. Fine-pole figures assume 80% of the chuck face is pole and only the pole area pulls. The fine-pole chuck holds thin plate twelve times as hard and thick plate half as hard.
```

The comparison also shows where the two chucks cross over. On the coarse chuck the force on a plate of this outline rises as the square of its thickness until about 15 mm; the fine-pole chuck's force is flat from about 1.4 mm upwards. Setting 77.3 × (t ÷ 15)² equal to 37.4 kN gives t = 15 × √(37.4 ÷ 77.3) = 10.4 mm. Below about 10 mm the fine-pole chuck holds harder; above it the coarse chuck does, provided the contact is good enough for both. The case's shop wrote that crossover onto its chuck selection sheet as a round 10 mm, with a note that rough or scaled parts favour the coarse chuck at any thickness because of its larger equivalent gap.

Neither chuck is better in general. Thick, rough plate belongs on coarse poles; thin, flat, ground parts on fine poles. A shop that runs both, as the case's shop does, should decide which chuck each part goes on from its thickness, not from which machine is free.

## Small parts and bridging the poles

A part holds only if it bridges at least one north pole and one south pole, so that flux can enter it from one and leave it through the other. On a chequerboard of 50 mm poles on a 60 mm pitch, two neighbouring poles of opposite polarity span 110 mm. A part smaller than that in both directions can never cover two whole poles; it sits on one pole and parts of others, and its holding force depends on exactly where it lies.

The working rule is to count only fully covered poles and to require at least two, of opposite polarity. For smaller parts there are three options:

- **A fine-pole chuck.** On 10 mm pitch, a part 25 mm long already bridges two poles.
- **Pole extensions.** Steel blocks that sit on the chuck's poles, separated by non-magnetic spacers, and carry the flux up to a smaller or shaped part. They add two gaps to the circuit, so they lose force, but they let a coarse chuck hold small or awkward parts and keep the cutter clear of the chuck face.
- **A fixture.** A vice or a set of clamps that the chuck holds, as for non-magnetic parts in Chapter 2.

```figure
type: decision
title: Holding a small or thin part
question: Does the part cover at least two whole poles of opposite polarity, and is it at least the minimum thickness?
caption: The two checks are independent. A large thin plate fails the second; a small thick block fails the first.
- Both | hold it directly | check gap and sliding force as for any part
- * Covers the poles but too thin | use a fine-pole chuck or accept the reduced force with stops | force falls as thickness squared
- Thick enough but too small | use pole extensions, a fine-pole chuck or a fixture | count only fully covered poles
- Neither | use a fixture or a different workholding method | do not rely on the magnet
```

### Orienting parts on parallel-pole chucks

On a chuck with parallel strip poles, a long narrow part should lie across the poles, not along them. Laid along a single pole, it covers one polarity only and the flux has nowhere to go. Laid across, it bridges many poles. Chuck makers mark the pole direction on the chuck for this reason, and a set-up sheet should say which way each part lies.

## Checking the thin-part law with a test

The thin-part law is a one-dimensional estimate, and the shop tested it before relying on it. This is an illustration. It cut 120 × 120 mm blocks of ground mild steel at 3, 6 and 10 mm and pulled each from the same four poles it had used for the 50 mm reference block, which had pulled 5.5 kN.

The law predicts pulls of 5.5 × 0.040 = 0.22 kN for the 3 mm block, 5.5 × 0.16 = 0.88 kN for the 6 mm block and 5.5 × 0.444 = 2.44 kN for the 10 mm block. The shop measured 0.3, 0.9 and 2.6 kN. The measured pulls were a little higher than the law at every thickness, which is what spreading of the flux in three dimensions would do: the law slightly underestimates thin-part holding, which is the safe direction. The shop kept the law for estimates and the measured values for its set-up sheet.

## Stacks of thin parts

Grinding or milling several thin parts stacked on top of each other looks like a way to make a thick part out of thin ones. Magnetically it is not. The interface between two stacked plates is a gap, like the contact with the chuck, and the flux that enters the bottom plate mostly turns sideways inside it rather than crossing that gap into the plate above. The bottom plate is held roughly as a single thin plate; the plates above it are held weakly, through the bottom plate, by whatever flux leaks upwards.

The same effect is used deliberately in sheet handling. Magnetic sheet fanners, placed beside a stack of thin steel sheets, magnetise the sheets' edges with the same polarity so that they repel each other and fan apart, which helps a destacker pick one sheet at a time. A stack of thin parts on a chuck behaves partly like that, with the upper parts lifting slightly at their edges.

For machining, the safe rule is that a stack is held only as well as its bottom part, and the parts above it must be held mechanically or not at all. Grinding stacks of thin shims on a magnetic chuck is a common source of shims thrown from the wheel.

## Perforated and laminated parts

Perforated sheet, mesh and parts with many holes have less cross-section to carry the flux sideways than a solid plate of the same thickness. As a first estimate, a perforated part behaves like a solid part whose thickness is reduced in proportion to the open area along the flux path, and it saturates sooner. Laminated parts, such as stacks of electrical steel bonded together, carry flux well along their laminations and poorly across them, so their holding depends on how they lie on the poles.

In both cases the minimum-thickness estimate gives the direction of the effect, and a pull test gives the number.

## Thin parts and distortion

A thin part is not only held less firmly; it is also pulled flat more easily. From Chapter 3, the force to flatten a plate falls as the cube of its thickness. A 6 mm plate with a 0.3 mm bow needs only a few hundred newtons to be pulled flat, and even the weak hold of a coarse chuck on a thin part can do that. When the part is released after machining or grinding, it springs back to its bow, now with a flat face machined into a curved part. Chapter 6 returns to this, because it is the main cause of thin parts that measure flat on the chuck and not flat on the inspection table.

## The error: spacer strips on the coarse chuck

This is an illustration. A job needed 40 spacer strips, 250 × 60 × 6 mm in mild steel, with one long edge milled straight with a 16 mm end mill. The machinist put them on the electro-permanent chuck on the machining centre, because the grinder was busy, with each strip lying across four poles. With full force, four poles would give 5.7 kN of normal force; that figure was in the machinist's head, and no stop was used.

The first strip slid as soon as the end mill engaged, ruining the strip and chipping the cutter. The calculation the machinist had not done gives the reason:

- **Bridging:** the 60 mm width covers only one pole across, so the four covered poles lie in a single row along the strip's length, alternately north and south, which does give a flux path. That check passed.
- **Thickness:** 6 mm is far below the 15 mm minimum. The contact flux density is at most 2 × 2.0 × 6 ÷ 50 = 0.48 T, 16% of the force: 0.92 kN normal and 0.18 kN of sliding resistance.

A side-milling pass with a 16 mm end mill can easily exceed 180 N of sideways force.

The rest of the batch was milled on a small machining centre fitted with a fine-pole chuck of the same pattern as the grinder's, with a fence against the cutting force: 0.015 m² of strip at 156 kPa of effective pull gives 2.3 kN normal and 0.47 kN of sliding resistance, with the fence taking the cutting force against its direction. The shop's set-up sheet now has a thickness check beside the material check: part thickness against the minimum for the chuck's poles, with the force reduction if it is below.

## Exercise: a 10 mm plate

This is an illustration. A plate the size of BP-600 but 10 mm thick goes on the coarse-pole chuck, ground contact.

1. What flux density can it carry at the contact?
2. What share of the full force does it get, and what normal force?
3. What pole width would let a 10 mm plate take the full 1.2 T?

**Worked answer.**

1. B ≈ 2 × 2.0 × 10 ÷ 50 = **0.80 T**, below the 1.2 T the poles could deliver to a thick part.
2. (0.80 ÷ 1.2)² = **44.4%** of the full force, so 77.3 × 0.444 = **34.4 kN** normal, and 6.9 kN of sliding resistance at μ = 0.2.
3. From t_min = B × w ÷ 2Bs, w = 2Bs × t ÷ B = 2 × 2.0 × 10 ÷ 1.2 = **33 mm** or narrower. A chuck with 30 mm poles would hold this plate with its full contact flux density, if its poles still delivered 1.2 T.
