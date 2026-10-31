---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: what-a-permanent-magnet-is
order: 1
title: "What a permanent magnet is"
description: "Spontaneous magnetisation, domains and anisotropy, the hysteresis loop and its second quadrant, remanence, the two coercivities and the energy product, and the units on a magnet datasheet."
draft: false
---

A permanent magnet is a piece of material that stays magnetised after the field that magnetised it has gone, and that resists being demagnetised by the fields it meets in service. Both halves of that sentence matter. A soft steel bar can be magnetised strongly, and loses nearly all of it as soon as the field is removed. A good permanent magnet keeps its magnetisation and drives flux through the air gaps of a machine for decades.

This chapter explains where that behaviour comes from and how a magnet datasheet describes it. It covers spontaneous magnetisation and domains, the anisotropy that makes a material hard rather than soft, the hysteresis loop and the part of it that matters for magnets in machines, and the quantities a designer reads from it: remanence, the two coercivities and the energy product. The error is a datasheet read in the wrong units.

## Spontaneous magnetisation

Iron, cobalt, nickel and some of their alloys and compounds are ferromagnetic. Each atom carries a small magnetic moment, and a quantum-mechanical coupling between neighbouring atoms, the exchange interaction, makes the moments line up with each other. Below a critical temperature, the Curie temperature, the material is therefore magnetised spontaneously, without any applied field. The theory of the condensed state treats this ordered state and its disturbances: thermal energy excites spin waves that reduce the magnetisation, more as the temperature rises, until order disappears at the Curie point. Chapter 4 returns to temperature, because it causes most of the trouble with magnets in machines.

A lump of ferromagnet is not usually magnetised as a whole. It divides into domains, regions each magnetised in one direction, arranged so that their external fields largely cancel, because a single domain would store a large amount of energy in the field outside it. Magnetising a material means making one direction of domain win, by moving the walls between domains and rotating the magnetisation inside them.

### Hard and soft

Whether a ferromagnet is soft, like the steel of a chuck's pole pieces, or hard, like a permanent magnet, depends on how easily its magnetisation can be turned. In a soft material domain walls move easily and the magnetisation follows the applied field. In a hard material something resists both. The main resistance is magnetocrystalline anisotropy: the crystal structure gives the magnetisation a preferred axis, and turning it away from that axis costs energy. Materials such as neodymium-iron-boron and samarium-cobalt have very strong uniaxial anisotropy from their crystal structures, and their manufacture produces fine grains, aligned so that their easy axes point the same way, with grain boundaries that obstruct the formation and movement of reversed domains. Once magnetised along the easy axis, they hold that state against large reverse fields.

## The hysteresis loop

The behaviour of any magnetic material is summed up in its hysteresis loop: the magnetisation, or the flux density, plotted against the applied field as the field is taken up to saturation in one direction, back through zero, to saturation in the other direction and back again. A soft material's loop is tall and very narrow. A hard material's loop is tall and very wide.

For a magnet in a machine, only one part of the loop matters: the second quadrant, where the magnet has been magnetised in the positive direction and is now sitting in a negative field. A magnet in service always sits in a negative field, because its own poles create a field inside it that opposes its magnetisation. That self-field is the demagnetising field, and the second-quadrant curve, called the demagnetisation curve, shows how the magnet responds to it and to any other reverse field it meets.

### Two curves on one datasheet

Magnet datasheets show two second-quadrant curves. The normal curve plots the flux density B against the field H; it is what a designer uses to find the flux the magnet drives through its circuit. The intrinsic curve plots the magnet's own magnetisation, as the polarisation J = B − μ₀H, against H; it shows whether the magnet is being demagnetised.

```figure
type: formula
title: The quantities on a magnet's demagnetisation curve
formula: B = μ₀H + J
formula: Straight normal curve: B = Br + μ₀ × μrec × H
formula: Energy product at a working point: (BH) = B × |H|; maximum (BH)max ≈ Br² ÷ (4μ₀μrec) for a straight normal curve
caption: H is negative in the second quadrant. For modern rare-earth magnets the normal curve is close to a straight line from Br to HcB at room temperature, with a slope set by the recoil permeability μrec, about 1.05.
- Br | remanence: flux density at zero field, T
- HcB | normal coercivity: the reverse field at which B falls to zero, kA/m
- HcJ | intrinsic coercivity: the reverse field at which J falls to zero, kA/m
- (BH)max | maximum energy product, kJ/m³
```

**Remanence, Br**, is the flux density the magnet keeps at zero applied field, with its poles short-circuited by a perfect steel path. It sets the upper limit of the flux a magnet can drive.

**Normal coercivity, HcB**, is the reverse field at which the flux density through the magnet falls to zero. For a straight normal curve it is Br ÷ (μ₀μrec).

**Intrinsic coercivity, HcJ**, is the reverse field at which the magnet's own magnetisation falls to zero. It measures resistance to demagnetisation. In a magnet with high intrinsic coercivity, HcJ lies well beyond HcB, and the intrinsic curve stays nearly flat until close to HcJ, where it falls through a sharp bend called the knee. As long as a magnet's working point stays above the knee, any loss is reversible; once a reverse field or a temperature pushes it past the knee, part of the magnet is demagnetised and stays so.

**Maximum energy product, (BH)max**, is the largest value of B × |H| along the normal curve. It is a measure of how much magnet volume a job needs: a magnet working at its maximum energy product delivers a given flux into a given air gap with the least volume of magnet.

## The case's coupling magnet

This is an illustration. The magnetic coupling in Line 4's clean-in-place pump uses sintered NdFeB magnet segments. Their datasheet, at 20 °C, gives Br = 1.28 T, recoil permeability 1.05, and HcJ = 1,200 kA/m.

```figure
type: stats
title: The coupling magnet's room-temperature properties
caption: This is an illustration. Br, μrec and HcJ are the case's datasheet values; HcB and (BH)max follow from them for a straight normal curve.
- 1.28 T | remanence, Br
- 1.05 | recoil permeability, μrec
- 970 kA/m | normal coercivity, HcB = 1.28 ÷ (4π × 10⁻⁷ × 1.05)
- 1,200 kA/m | intrinsic coercivity, HcJ
- 310 kJ/m³ | maximum energy product, at B = Br ÷ 2 = 0.64 T
```

The intrinsic coercivity of 1,200 kA/m lies beyond the normal coercivity of 970 kA/m. At room temperature, any working point on the normal curve is therefore above the knee: this magnet cannot be demagnetised by its own field, however short its circuit, as long as it is at room temperature and no external reverse field is applied. Chapter 4 shows how that changes when it is hot, because HcJ falls quickly with temperature.

## Where on the curve a magnet works

A magnet's working point is where its demagnetisation curve meets the load line of the circuit it sits in. Chapter 3 develops the load line properly; the essential idea is a single number, the permeance coefficient Pc, the ratio of B to −μ₀H at the working point. A magnet in a nearly closed steel circuit, with a small gap, has a high permeance coefficient and works near Br. A thin magnet with its poles in open air, such as a flat disc magnetised through its thickness, has a low permeance coefficient and works far down the curve.

For a straight normal curve, the working flux density is:

B = Br × Pc ÷ (Pc + μrec)

```figure
type: compare
title: The coupling magnet's working point by permeance coefficient, 20 °C
cols: Flux density B, T | Field H, kA/m | Energy product B × |H|, kJ/m³
rowhead: Permeance coefficient
- 0.5, a thin disc in open air | 0.413 | −657 | 271
- * 1, near the energy-product maximum | 0.624 | −497 | 310
- 2 | 0.839 | −334 | 280
- 4 | 1.014 | −202 | 204
- 10, a nearly closed steel circuit | 1.158 | −92 | 107
caption: This is an illustration. Br = 1.28 T and μrec = 1.05. The energy product peaks where the permeance coefficient is close to the recoil permeability.
```

The permanence of the working point also depends on what else acts on the magnet. In a motor, the current in the windings creates a field that adds to or opposes the magnet's own demagnetising field, and at peak current it moves the working point further down the curve. In a coupling, the magnets of the other half do the same as the halves slip relative to each other. A design that is safe in its resting state can still push a magnet past its knee at peak load, which is why Chapters 4, 5 and 7 check the working point under the worst conditions, not the average ones.

Two lessons come out of the table. First, a magnet's flux density in service can be anywhere from a third of Br to nearly all of it, depending on the circuit, so a catalogue's Br alone says little about what a magnet will do. Second, the most volume-efficient design works the magnet at a permeance coefficient near 1, which is where most well-designed couplings and motors put their magnets; working a magnet nearer Br wastes material, and working it further down risks the knee.

## How magnets are made and magnetised

Most rare-earth and ferrite magnets are made by powder metallurgy. The alloy or oxide is milled to a fine powder, the powder is pressed in a strong magnetic field that turns each particle's easy axis in the same direction, and the pressed part is sintered, heat treated, ground to size and coated. The alignment during pressing is what makes the magnet anisotropic: it can be magnetised strongly along the pressing field's direction and much less well in any other. A magnet's drawing must therefore show its direction of magnetisation, and a segment ground from a block in the wrong orientation is useless however good its material.

Bonded magnets are made differently: magnet powder mixed with a polymer and moulded or pressed. They can be moulded into complex shapes with inserts, at the cost of a lower remanence, because part of their volume is polymer, and a lower working temperature, set by the binder.

Magnets are usually supplied magnetised, but they can be magnetised after assembly, which avoids handling strong magnets during assembly and lets a whole rotor be magnetised at once. Magnetising needs a field well beyond the material's intrinsic coercivity, so that every grain is driven to saturation; rare-earth magnets need very large pulsed fields from purpose-built magnetising fixtures. A magnet that has not been fully saturated when magnetised has a lower remanence than its datasheet and a lower resistance to demagnetisation, and it may pass a casual check while failing a careful one. Chapter 10 describes incoming inspection that would catch it.

The direction and pattern of magnetisation are part of the design. A coupling ring may have its segments magnetised alternately north and south radially; a sensor magnet may be magnetised through its thickness or across its diameter; a multipole ring for an encoder has dozens of poles round its edge. Each pattern sets the field the magnet produces and the way it interacts with its circuit, and each must be stated on the drawing and checked on receipt.

## Units on a datasheet

Magnet data are still published in two systems of units, and both appear on Australian datasheets and in software. SI units give B in teslas, H in kiloamperes per metre and energy product in kilojoules per cubic metre. The older CGS system gives B in gauss or kilogauss, H in oersteds or kilo-oersteds, and energy product in mega-gauss-oersteds.

```figure
type: compare
title: Converting magnet datasheet units
cols: CGS unit | SI equivalent
rowhead: Quantity
- Flux density B, remanence Br | 1 kG (kilogauss) | 0.1 T
- Field H, coercivities | 1 kOe (kilo-oersted) | 79.58 kA/m
- * Energy product (BH)max | 1 MGOe | 7.958 kJ/m³
- Example: Br 12.8 kG | 12.8 kG | 1.28 T
- Example: HcJ 15.1 kOe | 15.1 kOe | 1,200 kA/m
- Example: (BH)max 39 MGOe | 39 MGOe | 310 kJ/m³
caption: In free space 1 G corresponds to a field of 1 Oe, which is why the two are sometimes used interchangeably; inside a magnet they are different quantities and must not be mixed.
```

Grade names often carry the energy product in CGS units: a sintered NdFeB grade called "N38" or "N42" has a maximum energy product of about 38 or 42 MGOe. Suffix letters after the number, in many makers' naming, indicate higher intrinsic coercivity grades for higher temperatures. Neither the number nor the letter is a complete specification; the datasheet's curves at the working temperature are.

## The error: ten times stronger

This is an illustration. A maintenance planner at the plant was comparing two quotes for replacement magnet segments for a separator. One supplier's datasheet gave Br = 1.28 T; the other, an older format, gave Br = 12.8 kG. The planner, reading the numbers without the units, noted that the second magnet was "ten times stronger" and asked purchasing to prefer it, at a higher price.

The engineer who reviewed the request converted the second datasheet: 12.8 kG is 1.28 T, the same remanence, and its HcJ of 15.1 kOe is 1,200 kA/m, the same intrinsic coercivity. The two quotes were for magnets of essentially the same grade. The cheaper one was ordered, and the planning team added a units line to its magnet purchase template: every property is entered in SI units, converted if necessary, with the original value and unit kept beside it.

```figure
type: checklist
title: Reading a magnet datasheet
caption: The open item is the one this chapter's error missed. Datasheets are short, and every number on them matters.
- ? Units of every property checked | T or kG, kA/m or kOe, kJ/m³ or MGOe
- x Remanence Br at the working temperature | not only at 20 °C
- x Intrinsic coercivity HcJ at the working temperature | the measure of resistance to demagnetisation
- x Curves, not only figures | knee position at the highest working temperature
- x Temperature coefficients of Br and HcJ | Chapter 4
- x Coating and corrosion resistance | Chapter 2
```

## Exercise: reading a ferrite datasheet

This is an illustration. A ferrite magnet's datasheet gives Br = 4.0 kG, recoil permeability 1.1, HcB = 3.5 kOe and (BH)max = 3.6 MGOe.

1. Convert Br, HcB and (BH)max to SI units.
2. For a straight normal curve, what HcB would Br and μrec predict, and what (BH)max?
3. What flux density does the ferrite magnet give at a permeance coefficient of 2, and how does that compare with the NdFeB magnet at the same permeance coefficient?

**Worked answer.**

1. Br = **0.40 T**; HcB = 3.5 × 79.58 = **279 kA/m**; (BH)max = 3.6 × 7.958 = **28.6 kJ/m³**.
2. HcB = 0.40 ÷ (4π × 10⁻⁷ × 1.1) = **289 kA/m**, close to the datasheet's 279 kA/m. (BH)max = 0.40² ÷ (4 × 4π × 10⁻⁷ × 1.1) = **28.9 kJ/m³**, close to the datasheet's 28.6.
3. B = 0.40 × 2 ÷ (2 + 1.1) = **0.258 T**, against 0.839 T for the NdFeB magnet: less than a third. A ferrite design that must match the NdFeB magnet's flux needs a much larger magnet area, which is why ferrite is used where space is cheap and rare-earth magnets where it is not.
