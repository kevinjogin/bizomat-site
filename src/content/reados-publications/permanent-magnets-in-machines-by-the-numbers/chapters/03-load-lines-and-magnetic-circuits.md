---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: load-lines-and-magnetic-circuits
order: 3
title: "Load lines and magnetic circuits"
description: "Find a magnet's working point from its circuit: load line and permeance coefficient, leakage, keepers and pot magnets, why AlNiCo must stay in its circuit, and a magnetic catch against a detent."
draft: false
---

A magnet on its own does nothing useful. It is always part of a circuit: steel pieces that carry its flux, air gaps where the flux does its work, and leakage paths where some of it escapes. The circuit decides where on its demagnetisation curve the magnet works, and so how much flux it delivers and how close it sits to its knee. Change the circuit, by opening a gap, removing a steel part or taking the magnet out altogether, and the working point moves.

This chapter derives the load line that fixes a magnet's working point, shows what leakage and keepers do to it, explains the classic failure of AlNiCo magnets removed from their circuits, and compares a magnetic catch with a spring-loaded ball detent for the case's hopper lid, using the BIZOMAT ball detent check. The error is an old tachogenerator taken apart for cleaning.

## The load line

Consider a magnet of length Lm and pole area Am in a steel circuit with one air gap of length g and area Ag. With no current anywhere, the magnetomotive force round the loop is zero: the magnet's own field Hm along its length must balance the field Hg across the gap. If the steel needs little magnetomotive force, that gives Hm × Lm + Hg × g = 0. The flux is continuous round the loop, so Bm × Am = Bg × Ag, and in the gap Bg = μ₀Hg. Combining:

```figure
type: formula
title: The load line of a simple magnet circuit
formula: Bm ÷ (μ₀ × |Hm|) = Pc = (Lm ÷ g) × (Ag ÷ Am)
formula: With leakage and steel losses: Pc ≈ (Lm ÷ g) × (Ag ÷ Am) ÷ (f × r)
formula: Working point on a straight normal curve: Bm = Br × Pc ÷ (Pc + μrec)
caption: The load line runs from the origin at slope −μ₀Pc on the B–H plane, and the working point is where it meets the normal curve. f is the share of the magnet's flux that reaches the gap, and r allows for the magnetomotive force used in the steel; both make Pc a little different from the simple ratio.
- Lm, Am | magnet length in the magnetised direction, and pole area
- g, Ag | air gap length and area
- Pc | permeance coefficient, the load line's slope in units of μ₀
```

Long magnets and short gaps give high permeance coefficients and working points near Br; short magnets and long gaps give low ones. A gap that is wide relative to the magnet's length pulls the working point down the curve towards the knee.

Leakage matters because a magnet's flux does not all go where the designer wants. Some returns through the air round the magnet's sides, some through nearby steel that is not part of the intended path. A leakage factor between 0.4 and 0.8 is common in practice, and it means the magnet must make between 1.25 and 2.5 times the flux that the gap actually receives. Good designs keep the magnet close to the gap, surround it with steel that guides the flux, and keep other steel away.

### The case's coupling as a circuit

This is an illustration. In Line 4's pump coupling, the outer rotor carries NdFeB segments 6 mm thick on the inside of a steel ring, and the inner rotor carries matching segments 6 mm thick on the outside of a steel hub. Between them is the containment shell, 1 mm thick, with a 1.5 mm running clearance on each side of it. Flux crosses from an outer segment, through the clearances and the shell, into the facing inner segment, through the hub, back out through the neighbouring pair of segments, and round the outer ring.

Each flux loop crosses two pairs of segments, so the magnet length in the loop is 4 × 6 mm = 24 mm, and the non-magnetic gap is 2 × 4 mm = 8 mm. That is the same ratio as one pair of segments, 12 mm of magnet, across one 4 mm gap. The segments' area roughly equals the gap area, and the designer's estimate of the leakage factor between neighbouring segments is 0.8.

```figure
type: steps
title: Working point of the coupling's magnets at 20 °C
caption: This is an illustration. Br 1.28 T, μrec 1.05, from Chapter 1. The steel is assumed not to saturate.
- Magnet length to gap ratio | 12 mm ÷ 4 mm = 3
- Allowing for leakage, f = 0.8 | Pc = 3 ÷ 0.8 = 3.75
- Working flux density in the magnets | 1.28 × 3.75 ÷ (3.75 + 1.05) = 1.00 T
- Field in the magnets | −1.00 ÷ (4π × 10⁻⁷ × 3.75) = −212 kA/m
- * Flux density in the gap | 0.8 × 1.00 = 0.80 T
```

The working point, at −212 kA/m, is far from the magnet's 1,200 kA/m intrinsic coercivity at room temperature. Chapter 4 asks how far it is at 75 °C and above, and Chapter 5 uses the 0.80 T gap flux density to estimate the losses in the containment shell.

## Steel in the circuit

The load line assumes the steel needs almost no magnetomotive force, which is true only while the steel is well below saturation. Rotor rings, hubs, cups and pole pieces must be thick enough to carry the magnet's flux at a flux density comfortably below the steel's saturation, about 2 T for low-carbon steel and less for stainless or alloy steels. A thin steel part that saturates acts like an extra air gap and pulls the working point down. Where a designer has made a steel part thin to save weight or space, the circuit should be checked by calculating the flux density in that part from the flux it must carry and its cross-section, the same check that *Magnetic Workholding by the Numbers* applies to thin workpieces.

## Keepers and pot magnets

A keeper is a piece of soft steel placed across a magnet's poles when it is out of its circuit, closing the circuit and keeping the permeance coefficient high. A pot magnet is a magnet set in a steel cup whose rim forms the second pole; the cup turns a disc magnet, which on its own has a low permeance coefficient and a diffuse field, into a compact, high-permeance holding magnet that concentrates its flux at the face. Pot magnets are the usual choice for magnetic catches, holding fixtures and magnetic bases, because the cup multiplies the pull at contact and shields the back of the magnet.

The same features make a pot magnet sensitive to gaps, like the fine-pole chucks in *Magnetic Workholding by the Numbers*: with the cup closed by a steel striker, its flux paths are short, and a small gap is a large share of the circuit's reluctance.

## AlNiCo must not leave its circuit

AlNiCo magnets have high remanence, around 1.25 T for common grades, but low coercivity, tens of kiloamperes per metre. Their designs therefore use long magnets in circuits with high permeance coefficients, often 15 to 20, so that the working field Hm stays small. At Pc = 20 and B = 1.2 T, the field in the magnet is about −1.2 ÷ (4π × 10⁻⁷ × 20) = −48 kA/m, already close to the knee of many AlNiCo grades.

Take such a magnet out of its circuit and the permeance coefficient falls to that of the magnet alone in air, perhaps 4 for a long bar. For it to keep 1.2 T it would need a field of about −239 kA/m, far beyond its coercivity. The working point therefore falls down the curve, past the knee, to a much lower flux density. When the magnet is put back in its circuit, it does not return to its old working point; it recovers only along a recoil line from the low point it reached, to a flux density well below its original value. Only re-magnetising restores it.

```figure
type: steps
title: What happens to an AlNiCo magnet removed from its circuit
caption: Rare-earth magnets with intrinsic coercivity well above their normal coercivity do not suffer this at room temperature; AlNiCo, with its low coercivity, always does.
- In its circuit, Pc about 20 | working near 1.2 T, field about −48 kA/m
- Removed without a keeper, Pc about 4 | field needed to hold 1.2 T would be about −239 kA/m; the working point drops past the knee
- * Part of the magnet is demagnetised | the loss is irreversible
- Replaced in its circuit | recovers along a recoil line to a lower flux than before
- Re-magnetised in a fixture | full flux restored
```

## The case's hopper lid

The seasoning hopper on Line 4 has a hinged stainless lid that operators open several times a shift to check the level and add seasoning. It must stay closed against vibration from the drum and conveyor, and an operator must be able to open it with one hand, wearing gloves. The plant's guideline for one-handed opening is a force at the handle of no more than about 30 N, and it wants at least 15 N to stop the lid lifting under vibration.

Two catches were considered: a magnetic catch, a pot magnet on the frame with a steel striker on the lid, and a spring-loaded ball detent.

### The magnetic catch

This is an illustration. The pot magnet's maker publishes its pull against a steel striker at several gaps. The striker has a stainless steel lid between it and the magnet in one proposed layout, and sits directly on the magnet in the other.

```figure
type: bars
title: Pull of the proposed pot magnet against its striker, by gap
unit: N
max: 170
caption: This is an illustration. Invented maker's figures for a 20 mm NdFeB pot magnet against a 5 mm mild steel striker. The pull falls by three-quarters over the first millimetre of gap.
- Contact | 160
- 0.2 mm | 110
- 0.5 mm | 70
- * 1.0 mm | 40
- 2.0 mm | 18
```

At contact, 160 N is far more than an operator should need to pull. A deliberate non-magnetic spacer fixed to the magnet's face, 1 mm thick, brings the pull down to about 40 N, still above the 30 N guideline. At 2 mm it would be about 18 N, inside the range but on a steep part of the curve, where small changes in the gap, from wear of the spacer or seasoning dust on the face, change the force a great deal. The magnet's force is stable over time, since a well-chosen NdFeB grade at 40 °C does not age measurably, but it is sensitive to the gap, which is the one thing that varies in service.

### The ball detent

The BIZOMAT [ball detent check](/tools/ball-detent-check/) checks a spring-loaded ball or plunger detent: it calculates the spring's rate, preload and stress at the fitted length as a compression spring, the force along the sliding direction needed to push the ball out of a vee notch from the preload, the flank angle and the friction on one face, the spring load and stress when the ball has risen out of the notch, and the clearance to solid, against the release force range wanted and an allowable stress.

This is an illustration. The detent proposed uses a 1 mm wire spring, 6 mm mean diameter, 8 active coils, closed and ground ends, 15 mm free length, fitted at 12 mm, pressing a ball into a 45° notch with a friction coefficient of 0.15, and 1 mm of rise to clear the notch.

```figure
type: stats
title: The hopper lid detent, from the ball detent check
caption: This is an illustration. Tool inputs as above, release force range 15 to 30 N, allowable spring stress 700 MPa.
- 5.74 N/mm | spring rate
- 17.2 N and 329 MPa | preload and spring stress at the fitted length
- * 23.3 N | release force along the sliding direction, inside 15 to 30 N
- 23.0 N and 439 MPa | spring load and stress at full rise
- 10 mm | solid length, against 11 mm at full rise
```

The detent's force sits in the middle of the range and is insensitive to dust on the lid. It changes as the notch and ball wear, which lowers the release force over time, and as the spring relaxes. The tool flags wear in its checks: the notch and ball should be hardened.

### Measuring both in service

Either catch can be checked with a spring balance hooked to the lid handle, pulling slowly at right angles to the lid until it opens, and reading the peak force. The plant records that reading at commissioning and at each six-monthly guard inspection. For the detent, a falling trend shows wear of the notch and ball; for a magnetic catch, a falling trend would show a growing gap from dirt or a worn spacer. In both cases a single number, taken the same way each time, turns a judgement about whether the lid "feels right" into evidence.

### The choice

The plant chose the detent. Its force is set by geometry and a spring, not by a gap that seasoning dust and washdown residue can change; its wear is visible and its parts are cheap to replace; and it has no magnet to corrode or to attract fine steel particles from the product stream. The magnetic catch would have been the better choice for a dry, clean location where the gap could be controlled, or where a detent's wear and noise were unwelcome.

## The error: a tachogenerator taken apart

This is an illustration. A conveyor drive elsewhere in the plant used an old DC tachogenerator with an AlNiCo field magnet to feed back the belt speed. During a cleaning shutdown, a fitter dismantled it to clean the commutator, removing the armature and leaving the magnet housing open on the bench overnight. When reassembled, the tachogenerator's output at a given speed was about 30% lower than before, and the conveyor ran fast, because its controller saw a low speed signal.

The cause was the load line. With the armature removed, the AlNiCo magnet's circuit was open, its permeance coefficient fell, and part of the magnet was demagnetised. Reassembly restored the circuit but not the magnetisation. The tachogenerator was re-magnetised by a motor rewinder and recalibrated, and the plant added a note to its maintenance instructions for any device with AlNiCo magnets: fit a keeper across the poles before removing the armature or rotor, or do not dismantle it.

## Exercise: a keeper for a magnetic catch

This is an illustration. A spare pot magnet is kept in a drawer.

1. Is a pot magnet at risk of demagnetising itself in the drawer like an AlNiCo magnet? Why or why not?
2. Why might it still be worth fitting a steel keeper plate to it in storage?
3. If the detent's fitted length were 12.5 mm instead of 12 mm, the tool gives a release force of 19.4 N. Is that acceptable, and what does it show about tolerances?

**Worked answer.**

1. **No.** Its NdFeB magnet has an intrinsic coercivity well above its normal coercivity, so at room temperature its own demagnetising field cannot push it past the knee, even with the cup open to air.
2. **Safety and cleanliness.** A keeper shields the field, so the magnet does not pick up steel swarf from the drawer or snap onto tools and other magnets, which can chip it or pinch fingers.
3. **Yes, but it moves.** 19.4 N is still inside 15 to 30 N. Half a millimetre of fitted length changes the release force by about 17%, so the detent's housing depth needs a tolerance tight enough to keep the force in range across production.
