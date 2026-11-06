---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: small-holes-and-punch-strength
order: 4
title: "Small holes and punch strength"
description: "Why small punches fail, Hodgson's 1903 limit on hole size restated in SI, crushing and buckling checks for MP-40's punches, guided punches, and a Ø3 punch that broke on its first stroke."
draft: false
---

A punch carries the whole cutting force on its end. For a large punch that is no burden: MP-40's blanking punch has a face of nearly 4,000 mm² to spread its 139.8 kN over. A small punch carries a force proportional to its perimeter on an area proportional to the square of its diameter, so as holes get smaller the stress on the punch rises, and below a certain size the punch crushes, chips or buckles before the sheet gives way. Every die with small holes needs both checks, and they are quick.

This chapter restates Hodgson's 1903 limit on the smallest hole a punch can make, checks MP-40's punches for crushing, checks a slender punch for buckling, shows how guiding a punch changes the answer, and ends with a small punch added in a revision that broke on its first stroke.

## Hodgson's limit

Hodgson set out the argument in 1903, for punching iron plates. At the instant the sheet gives way, the force on the punch's end equals the sheet's resistance to shearing around the punch. For a round punch of diameter d cutting sheet of thickness t:

- force the punch can carry: π × d² ÷ 4 × σc, where σc is the stress the punch can safely take in compression;
- force the sheet resists with: π × d × t × τ, where τ is the sheet's shear strength.

Setting them equal and cancelling gives:

d ÷ t = 4 × τ ÷ σc

or, written as a minimum hole size, d_min = 4 × t × τ ÷ σc. His book's errata put it that way: the minimum diameter of a hole in a plate t thick is four times t times the shearing stress, divided by the crushing stress of the punch.

Hodgson's own figures were a shear strength of 19 tons per square inch for good wrought-iron plate and a crushing stress of 85 tons per square inch for tempered cast steel, which in SI are about 293 MPa and 1,313 MPa. They give d ÷ t = 0.894, a smallest hole of about 0.9 times the thickness, and he noted that this agrees with the old workshop rule that the thickest plate a punch can pierce equals the diameter of the hole. The rule is still taught, and Sheet Metal Parts by the Numbers applies the same stress relationship to holes near bends.

```figure
type: formula
title: The smallest hole a punch can make
formula: d_min = 4 × t × τ ÷ σc
caption: This is an illustration for MP-40's 2.0 mm sheet with a shear strength of 280 MPa and an assumed allowable punch stress of 1,200 MPa. The ratio, not the absolute size, is what the rule controls.
- t | Sheet thickness, 2.0 mm
- τ | Sheet shear strength, 280 MPa (assumed)
- σc | Allowable compressive stress in the hardened punch, 1,200 MPa (assumed)
step: d_min = 4 × 2.0 × 280 ÷ 1,200 = 1.87 mm
step: d_min ÷ t = 0.93
```

## Crushing stress on MP-40's punches

The same relationship gives the stress on any round punch: σ = 4 × t × τ ÷ d. For a non-round punch, the stress is the cutting force divided by the punch's face area.

**Hole punches.** At Ø8.58 mm, σ = 4 × 2.0 × 280 ÷ 8.58 = **261 MPa**.

**Slot punch.** The 16.08 × 8.08 mm obround has a face area of 8.00 × 8.08 + π × 4.04² = **115.9 mm²** and a perimeter of 41.38 mm, so its force is 41.38 × 560 = 23.2 kN and its stress **200 MPa**. (Chapter 2's 23.0 kN used the slot's nominal size; the punch is 0.08 mm larger.)

**Blanking punch.** About 3,920 mm² of face carrying 139.8 kN: roughly **36 MPa**.

Hardened tool steel punches carry compressive stresses of well over 1,000 MPa in service, and the allowable figure used for checking depends on the steel, its hardness and the toolmaker's experience; this book's 1,200 MPa is an illustration. Against it, MP-40's working punches are lightly loaded: the hole punches at about 22% of the allowable, the slot punch at 17%. The stress that matters on these punches is not crushing but the bending and impact at breakthrough, and the wear at their edges.

The figure changes quickly as holes get smaller. A Ø3.0 mm punch in the same sheet carries 4 × 2.0 × 280 ÷ 3.0 = **747 MPa**, 62% of the allowable, and a Ø2.0 mm punch, d = t, carries 1,120 MPa, close to it. That is where the old rule earns its keep: holes smaller than the thickness need special punches, special care or a different process.

```figure
type: compare
title: Compressive stress on punches in MP-40's 2.0 mm sheet
rowhead: Punch
cols: Size | Force, kN | Stress, MPa | Share of an assumed 1,200 MPa
caption: This is an illustration with a shear strength of 280 MPa. Stress on a round punch is 4tτ ÷ d; on others, force divided by face area. Small round punches are the ones that approach the limit.
- Blanking punch | 79.62 × 49.62 mm | 139.8 | 36 | 3%
- Slot punch | 16.08 × 8.08 mm | 23.2 | 200 | 17%
- Hole punch | Ø8.58 mm | 15.1 | 261 | 22%
- * Added hole punch | Ø3.0 mm | 5.3 | 747 | 62%
- Hole equal to thickness | Ø2.0 mm | 3.5 | 1,120 | 93%
```

## Buckling

A punch can also fail as a column. A slender punch loaded on its end bows sideways and snaps long before its crushing stress is reached, especially if the strip pushes it slightly off line as it enters. Euler's formula gives the load at which an ideal straight column buckles:

P_cr = π² × E × I ÷ (K × L)²

where E is the steel's modulus, about 210,000 MPa, I is the second moment of area of the punch's section, π × d⁴ ÷ 64 for a round punch, L is the unsupported length, and K is a factor for how the ends are held. Two cases matter in a die:

- a punch held in its punch plate and **free** at the cutting end until it touches the strip: fixed at one end, free at the other, **K = 2**;
- a punch **guided** close to its tip by a bushed stripper plate: fixed at one end and held in line at the other, K of about **0.7**.

Real punches are not ideal columns, so the result is used with a generous margin: a punch should not work above about a third of its buckling load. The BIZOMAT [column buckling calculator](/tools/column-buckling/) does the arithmetic for other end conditions.

**The Ø8.58 mm hole punches.** I = π × 8.58⁴ ÷ 64 = 266 mm⁴. With 30 mm unsupported and the free-end factor, P_cr = π² × 210,000 × 266 ÷ 60² = about 153 kN, ten times the 15.1 kN they carry. No concern.

**A Ø3.0 mm punch.** I = π × 3⁴ ÷ 64 = 3.98 mm⁴, about a sixty-seventh of the Ø8.58 punch's 266 mm⁴. With 30 mm unsupported and a free end, P_cr = π² × 210,000 × 3.98 ÷ 60² = **2.29 kN**. It needs 5.28 kN to cut. It will buckle before it cuts.

The two remedies are to shorten the unsupported length and to guide the tip.

- **Shorten it.** For a third of the buckling load with a free end, P_cr must be at least 3 × 5.28 = 15.8 kN, which needs an unsupported length of no more than about **11 mm**.
- **Guide it.** With the same 30 mm length guided by a bush in the stripper plate, K = 0.7 and P_cr = π² × 210,000 × 3.98 ÷ 21² = **18.7 kN**, 3.5 times the cutting force.

Small punches are usually both shortened and guided, and many are **stepped**: a short Ø3 tip on a much thicker body, so that only a few millimetres are slender.

```figure
type: line
title: Buckling load of a Ø3.0 mm punch against unsupported length
x: Unsupported length, mm
y: Buckling load, kN
ymin: 0
ymax: 80
legend: Free at the tip, K = 2 | Guided at the tip, K = 0.7 | Force to cut, 5.28 kN
mark: 30 | As first fitted
caption: Euler's formula with E = 210,000 MPa. The free punch falls below the cutting force at about 20 mm; the guided punch keeps a margin of 3.5 at 30 mm. A third of the buckling load is a sensible working limit.
- 15 | 9.16 | 74.75 | 5.28
- 20 | 5.15 | 42.05 | 5.28
- 25 | 3.30 | 26.91 | 5.28
- 30 | 2.29 | 18.69 | 5.28
- 35 | 1.68 | 13.73 | 5.28
- 40 | 1.29 | 10.51 | 5.28
```

## Guided punches and the spring stripper

MP-40's die has a spring stripper (Chapter 5), a plate that rides on springs, touches the strip before the punches do and holds it flat while they cut. If the punches pass through the stripper in close-fitting bushes, the stripper also guides each punch's tip, supporting it a millimetre or two above the strip at the moment of cutting. That is the single most effective protection for small punches, and it also keeps their tips on centre with the die openings, which matters when the clearance is only 0.15 mm.

A guiding stripper needs its own guidance: it must be located on the die set's pillars, or on its own guide pins, so that it moves square to the punches. A stripper that is located loosely and guides the punches is worse than one that does not touch them, because it pushes them off line.

## Other ways punches fail

Crushing and buckling are the failures that arithmetic predicts. Most punches that fail in service fail in other ways, and the arithmetic only tells the toolmaker which punches are at risk.

- **Chipping at the edge.** A corner or edge breaks out, usually from too little clearance, a misaligned punch that rubs the die, or a slug pulled back and struck. The punch then cuts a ragged hole with a growing burr.
- **Breakage at breakthrough.** At the instant the slug separates, the load drops and the press frame springs back, and a punch that was aligned under load can be flicked sideways. Slender punches feel it most.
- **Pulling out of the punch plate.** On the upstroke the stripper pulls the strip off the punch, and the punch is pulled the other way. A punch held only by a press fit can creep out of its plate; most are held by a head or shoulder, a ball lock or a retaining screw.
- **Fatigue at a section change.** A stepped punch that changes diameter at a sharp shoulder can crack there after a few hundred thousand strokes. A generous fillet at the step, ground smooth, spreads the stress.
- **Cracking from heat treatment.** Sharp internal corners and abrupt section changes crack in hardening, or are left with stresses that open in service. Choosing the steel and designing for hardening are covered in the Library’s chapter on [choosing tool steels](/reados/collections/machining-and-metal-parts/choosing-tool-steels/).

Each of these leaves a recognisable fracture face, and a broken punch is worth keeping and looking at under a magnifier before it is thrown away. A clean, flat break across a slender punch at roughly mid-length suggests buckling; a shell-shaped break starting at a shoulder suggests fatigue; a chipped corner with smeared metal on the punch's side suggests rubbing against the die.

## Damage around a punched hole

Hodgson also noted, citing Professor Goodman's work on boiler plate, that the metal immediately around a punched hole is damaged by the severity of the cut, and that structural plates were therefore reamed or planed after punching. The modern understanding is the same in principle: a punched edge is work-hardened and may contain fine cracks from the fracture zone, which lowers its fatigue strength compared with a drilled, reamed or machined edge. For MP-40, a static mounting plate, that does not matter. For parts under repeated load, such as springs, chain links or brackets on vibrating machines, the edge condition is a design decision, and a punched hole may need a shaving station, reaming or a different process.

## The error: a punch added without a guide

This is an illustration. Eight months into production, the customer revised MP-40 to add a Ø3.0 mm hole for an earth-tag rivet, 6 mm in from one long edge. The toolmaker added a Ø3.0 mm punch to the piercing station, made from standard punch stock with a 30 mm length below the punch plate to match the other punches, and opened a 4 mm clearance hole for it through the spring stripper.

The punch snapped on the first stroke of the trial strip. The broken end, bent and fractured partway along, showed it had buckled rather than crushed. The check that had been skipped is the one above: an unguided Ø3.0 mm punch with 30 mm free has a buckling load of about 2.29 kN, less than half the 5.28 kN needed to cut. The 4 mm hole in the stripper gave the punch no support.

The replacement was a stepped punch with a Ø3.0 mm tip 6 mm long on a Ø6 mm body, guided in a hardened bush fitted to the stripper with 0.01 mm clearance. The tip's short slender length and the guide at the strip together give a buckling load many times the cutting force. The trial strip ran clean, and the shop added a buckling check to its die-change procedure for any punch whose diameter is less than about twice the sheet's thickness.

```figure
type: checklist
title: Checks for a small punch before it is fitted
caption: Each check takes a few minutes and is cheaper than a broken punch and a damaged die opening.
- Diameter against thickness | Ø3.0 in 2.0 mm, d ÷ t = 1.5
- Crushing stress against the allowable | 747 MPa against 1,200 MPa assumed
- Buckling load at the unsupported length, at least three times the force | 2.29 kN free, 18.7 kN guided
- Tip guided by a bushed stripper located on the die set | bush with 0.01 mm clearance
- Stepped punch where the slender length can be short | Ø3.0 tip, 6 mm long, on a Ø6 body
- x Clearance hole in the stripper, full length free | snapped on the first stroke
```

## Exercise: a slot for a thinner tie

The customer asks whether the 16 × 8 mm slot can be made 16 × 3 mm, for a narrower cable tie, in the same 2.0 mm sheet. Find the slot punch's face area, its cutting force and its compressive stress, and say what the punch needs.

**Worked answer.** A 16 × 3 mm obround has straight sides of 16 − 3 = 13 mm and full-radius ends of R1.5.

- Face area: 13 × 3 + π × 1.5² = 39.0 + 7.07 = **46.1 mm²**.
- Perimeter: 2 × 13 + π × 3 = 26.0 + 9.42 = **35.4 mm**, so force = 35.4 × 560 = **19.8 kN**.
- Stress: 19.8 kN ÷ 46.1 mm² = **430 MPa**, about 36% of the assumed allowable.

The crushing stress is acceptable, but the punch is only 3 mm thick across its narrow direction, d ÷ t = 1.5, and it is slender in that direction. It should be checked for buckling about its weaker axis, where I = 13 × 3³ ÷ 12 + π × 3⁴ ÷ 64, about 33 mm⁴, a little over eight times a Ø3 round punch's, and it should be short, guided in a bushed stripper with a matching slot, and preferably stepped onto a thicker body.
