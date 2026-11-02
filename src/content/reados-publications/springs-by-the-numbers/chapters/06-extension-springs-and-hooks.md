---
book: springs-by-the-numbers
chapterSlug: extension-springs-and-hooks
order: 6
title: "Extension springs: initial tension and the hooks that break"
description: "How to check an extension spring: rate and initial tension, body stress, bending and torsion at the hooks, natural frequency, and why the hook bend radius decides its life."
draft: false
---

An extension spring is a compression spring turned inside out. Its coils are wound tight against each other, it is pulled instead of pushed, and instead of seating on flat ground ends it hangs from hooks or loops formed from its own wire. Two of those differences change the design. The coils can be wound with an initial tension, a force that must be overcome before they start to separate, so the spring gives a useful force from the moment it is fitted. And the hooks, which carry the whole load through a tight bend in the wire, are almost always where an extension spring breaks.

This chapter checks the extension springs that pull the VM-8's magazine shutter closed. It uses the KEVOS® extension spring check for the body and the extension spring designer for the hooks, and its mistake is a hook bent so tightly that it doubled the stress in the wire.

## The shutter and its springs

The VM-8's tool magazine sits beside the machining area behind a sliding shutter. During a tool change, a pneumatic cylinder pulls the shutter open so the changer arm can reach through; when the arm withdraws, the cylinder exhausts and two extension springs pull the shutter closed, keeping coolant and chips out of the magazine. A switch confirms the shutter is closed before the spindle can start.

Each spring is 1.8 mm music wire on a 14 mm mean coil diameter, with 40 active coils, standard full loops at each end and an initial tension of 12 N. Fitted with the shutter closed, each is stretched 10 mm beyond the point where its coils begin to open; with the shutter open, 60 mm. The shutter cycles at every tool change, about 160,000 times a year. This is an illustration.

## Initial tension

When an extension spring is coiled, the wire can be twisted as it is wound so that each coil presses against its neighbours. The spring then needs a definite force, the initial tension, before the coils begin to separate. Below that force it does not stretch at all; above it, it stretches at its rate.

```figure
type: formula
title: Load and stress of an extension spring body
formula: F = Fi + k x
formula: k = G d⁴ ÷ (8 D³ Na)
formula: τ = K × 8 F D ÷ (π d³),  τi = 8 Fi D ÷ (π d³)
caption: x is the extension beyond the point where the coils begin to open. All the coils of the body are active, unlike a compression spring's. τi, the stress from initial tension alone, is what spring makers use to say how much initial tension a spring of a given index can be wound with.
- Fi | initial tension, N
- K | Wahl factor
- τi | initial-tension stress
```

Initial tension is useful because it gives a spring a substantial force at a small extension, which is what the shutter needs: enough pull to close it firmly from a short stretch, without a large extra force when it is fully open. But it can only be wound within limits. Too little and the coils are loose; too much and the maker cannot coil it. The limits depend on the spring index, and makers express them as a range of initial-tension stress. The shop uses 40 to 120 MPa for an index near 8, as the KEVOS® designer does by default. This is an illustration; the maker's own range governs.

## The body

The [helical extension spring check](/tools/extension-spring/) takes the wire diameter, mean coil diameter, active coils, shear modulus, initial tension, extension beyond the initial tension and an allowable body shear stress. It returns the rate, the load at the extension including the initial tension, the Wahl-corrected body stress, the initial-tension stress, and the index and Wahl factor. It checks the body only; it warns that hooks and loops usually limit extension springs and must be confirmed with the maker.

```figure
type: steps
title: A shutter spring in the extension spring check, shutter open
caption: This is an illustration. 1.8 mm wire, 14 mm mean coil, 40 active coils, G = 79.3 GPa, initial tension 12 N, extension 60 mm, allowable body stress 650 MPa.
- Spring rate | 0.948 N/mm
- * Load at 60 mm extension | 68.9 N
- Body shear stress | 501 MPa: BODY STRESS WITHIN ALLOWABLE
- Initial-tension stress | 73 MPa
- Spring index / Wahl factor | 7.78 / 1.190
```

With the shutter closed, at 10 mm extension, the same spring carries 21.5 N at 156 MPa. So the two springs together hold the shutter shut with 43 N and the cylinder must overcome 138 N, plus friction, to open it.

## The hooks

A standard full loop is formed by bending the last coil up until it stands across the end of the spring. The load then passes from the loop into the body through two tight bends. At the top of the loop, where the hook bears on its pin, the wire is in bending. At the small bend where the loop meets the body, it is in torsion, like the body, but around a much tighter radius.

```figure
type: svg
title: Where the stresses in an extension spring's hook are
alt: A side view of the end of an extension spring. Close-wound coils run along the bottom. At the right end the last coil is bent upward into a full circular loop standing across the spring's axis. A pin passes through the top of the loop. Point A is marked at the inside of the loop where it bears on the pin, labelled bending. Point B is marked at the tight bend where the loop joins the body, labelled torsion, with the small bend radius r2 shown. The loop's own radius r1 is also shown.
caption: At A the hook is bent like a curved beam and pulled directly; at B the wire is twisted around a tight bend. A small r2 raises the stress at B sharply, which is where most extension springs break.
viewbox: 0 0 640 260
body:
<path class="ln" d="M40 200H360M40 180H360"/>
<path class="ln" d="M60 180V200M90 180V200M120 180V200M150 180V200M180 180V200M210 180V200M240 180V200M270 180V200M300 180V200M330 180V200"/>
<path class="ln" d="M360 190C390 190 400 175 400 150"/>
<circle class="bx" cx="460" cy="100" r="60"/>
<circle class="fa" cx="460" cy="40" r="7"/>
<text class="tx txs" x="478" y="36">pin</text>
<path class="la" d="M460 47V75"/>
<text class="tx txs" x="470" y="80">A: bending</text>
<path class="la" d="M398 160L360 230"/>
<text class="tx txs" x="250" y="245">B: torsion at bend radius r2</text>
<path class="dsh" d="M460 100L520 100"/>
<text class="tx txs" x="525" y="104">r1</text>
```

The designer tool uses Wahl's formulas for both points:

```figure
type: formula
title: Stresses in a standard extension spring hook
formula: Bending at A: σA = F [K1 × 16 D ÷ (π d³) + 4 ÷ (π d²)],  K1 = (4C1² − C1 − 1) ÷ (4C1 (C1 − 1)),  C1 = 2 r1 ÷ d
formula: Torsion at B: τB = K2 × 8 F D ÷ (π d³),  K2 = (4C2 − 1) ÷ (4C2 − 4),  C2 = 2 r2 ÷ d
caption: r1 is the mean radius of the loop and r2 the mean radius of the bend where the loop meets the body. As r2 approaches the wire radius, K2 grows without limit. Spring makers recommend r2 of at least about twice the wire diameter.
- σA | bending stress at the loop
- τB | torsional stress at the bend
```

The [extension spring designer](/tools/extension-spring-designer/) takes the body's dimensions, initial tension and extension, the loop and bend radii, allowable stresses for the body, the hook in bending and the hook in torsion, the range of initial-tension stress the maker can wind, and the wire density. It returns the index and Wahl factor, the rate, the working load, the body stress, the hook bending and torsional stresses, the initial-tension stress against its range and the natural frequency with both ends fixed. It treats static stresses with standard loop hooks.

```figure
type: steps
title: A shutter spring in the extension spring designer, shutter open, bend radius 3.6 mm
caption: This is an illustration. As above, with loop radius 7 mm, bend radius 3.6 mm (twice the wire diameter), allowables 650 MPa body, 1,200 MPa hook bending, 650 MPa hook torsion, initial-tension range 40 to 120 MPa.
- Rate / load at 60 mm | 0.948 N/mm / 68.9 N
- Body shear stress | 501 MPa
- Hook bending stress at A | 958 MPa
- * Hook torsional stress at B | 526 MPa
- Initial-tension stress | 73 MPa: within 40 to 120 MPa
- Natural frequency | 82 Hz: SPRING ADEQUATE
```

The allowables are the shop's static figures for 1.8 mm music wire, whose tensile strength is about 2,030 MPa by the A ÷ d^m fit: 650 MPa body and hook torsion is 32%, 1,200 MPa hook bending is 59%. This is an illustration. They are deliberately lower than the static figures in Chapter 2, because the springs cycle, and the shop confirms the final design against the spring maker's fatigue data for extension springs, which the static designer does not hold.

## The mistake: a tight hook

The springs on the VM-8 when it arrived were the second set the previous owner had fitted. Both broken springs from the first set, kept in a bag in the machine's cabinet, had broken in the same place: at the small bend where the loop meets the body.

Measured with a radius gauge, the bend on the old springs was about 1.2 mm mean radius, two-thirds of the wire diameter. Bending wire that tightly is quick on a coiling machine and makes a compact hook, and the old springs had been bought as cheap stock springs with standard hooks of that form.

```figure
type: compare
title: Hook torsional stress by bend radius, shutter open
cols: C2 = 2 r2 ÷ d | K2 | Hook torsion, MPa | Against 650 MPa
rowhead: Bend radius r2
- 1.2 mm, 0.67 d | 1.33 | 3.25 | 1,368 | More than twice the allowable
- 1.8 mm, 1.0 d | 2.00 | 1.75 | 737 | Over
- * 3.6 mm, 2.0 d | 4.00 | 1.25 | 526 | Within
caption: This is an illustration. 1.8 mm wire, 14 mm mean coil, 68.9 N at full extension. The body stress, 501 MPa, is the same for all three. Only the bend changes, and with it the stress at the place the old springs broke.
```

With a 1.2 mm bend, the designer gives a hook torsional stress of 1,368 MPa at full extension, 2.7 times the body stress and more than twice the allowable. At that stress, cycling 160,000 times a year, the hooks were never going to last. Measuring only the body, as the simpler extension spring check does, would have passed the springs: 501 MPa against 650 MPa.

The fix was in the specification, not the size. The new springs are the same body, with the bend radius specified as at least 3.6 mm, twice the wire diameter, and with the hooks stress relieved after forming. The cost per spring rose, and the shutter has not lost a spring since. This is an illustration.

### Hooks and other ends

The standard loop is not the only end. Extended loops move the bend away from the body; swivel hooks and screwed-in end plugs take the load out of the wire bend altogether, at the cost of more parts. For a spring that cycles hundreds of thousands of times a year, a screwed-in plug is often the most reliable end. The shutter's mounting space did not allow plugs, so the specified bend radius was the remedy.

## Natural frequency and the slamming shutter

When the cylinder exhausts, the springs pull the shutter shut from 60 mm to 10 mm extension. The designer's 82 Hz is the natural frequency of each spring held at both ends. The shutter closes in about a quarter of a second, far slower than the spring's own vibration, so surge is not a concern. What is a concern is the shutter hitting its stop: the springs release 2 × 2.26 = 4.5 J of energy as they shorten, and unless the cylinder's exhaust is throttled, much of that arrives at the stop. The shop fitted an adjustable flow control to the cylinder's exhaust so that the shutter closes firmly but without a bang.

## Measuring initial tension

Initial tension is the least predictable property of an extension spring, because it depends on how the coiling machine was set, and a maker's tolerance on it is usually wider than on the rate. It cannot be measured directly, since the spring does not move until it is exceeded, but it can be found from two readings. The shop hangs each new spring on its tester, reads the force at two extensions in the working range, works out the rate from the difference, and extends the line back to zero extension. For the new shutter springs, readings of 31.0 N at 20 mm and 59.4 N at 50 mm give a rate of (59.4 − 31.0) ÷ 30 = 0.947 N/mm and an initial tension of 31.0 − 0.947 × 20 = 12.1 N, against 12 N specified. This is an illustration.

The two springs on the shutter are fitted as a matched pair, within 1 N of each other at the closed position, so that the shutter is pulled squarely and does not rack on its rails.

## Fatigue at the hooks

The designer checks static stresses, and the shutter springs cycle. For a cycling extension spring, the stress range matters as much at the hooks as it does in the body, and the hooks have less margin. With the 3.6 mm bend, the torsional stress at the bend swings from 164 MPa with the shutter closed to 526 MPa with it open: an alternating part of 181 MPa about a mean of 345 MPa. The hook's bending stress swings from 299 to 958 MPa.

Spring makers hold fatigue data for extension spring ends that the KEVOS® designer does not, and the shop sent its proposed design to the maker with the cycle count and both extensions. The reply confirmed that the design, with stress-relieved hooks of that bend radius, was within the maker's data for the expected number of cycles. The static check is the screen; the maker's fatigue data is the decision. This is an illustration.

## When an extension spring breaks

A broken compression spring usually stays in place and still carries some load, because its pieces bear on each other. A broken extension spring lets go completely, and whatever it was holding is free. The shutter is arranged so that this fails safe: if a spring breaks, the shutter stays open, the closed switch does not make, and the spindle cannot start. A spring that holds something in a dangerous position, such as a guard or a counterweight, needs either a second spring that can carry the load alone, or a drawbar arrangement that turns tension into compression, so that a broken spring still holds.

## Two springs or one

The shutter could have been closed by one spring of twice the rate on its centre line. The rebuild kept two, one at each side, for three reasons. Two springs pull the shutter evenly on its rails, where one at the centre would let it twist if the rails bind at one end. Each spring of a pair carries half the load, so its wire and hooks are lighter and less stressed for the same coil size. And if one breaks, the other still pulls the shutter part of the way, which makes the fault obvious to the operator rather than leaving the shutter hanging open with no sign of why. The cost is a second spring and the need to match the pair, which the tester does in a minute.

## Fitting extension springs

Extension springs are easily overstretched when fitted, by a fitter pulling one long to get its hook over a pin. A spring stretched beyond its design extension takes a set, which lowers its initial tension and leaves a gap between coils at rest. The shop fits the shutter springs with the shutter held open by the cylinder, so that the springs are hooked on at their working extension, and replaces any spring that shows open coils when unloaded.

## Specifying an extension spring

```figure
type: checklist
title: What the shutter spring specification states
caption: The VM-8 rebuild's extension spring fields. This is an illustration.
- x Wire, mean coil diameter and active coils
- x Initial tension, with a tolerance, and the load at one stated extended length
- x End type, loop mean radius and least bend radius at the body
- x Length inside the hooks, unloaded
- x Largest extension in service
- x Stress relief after hook forming
- x Duty: cycles a year, so the maker can check fatigue at the hooks
```

## Exercise: a shorter spring

To clear a new coolant line, a fitter proposes shorter shutter springs with the same wire, coil, initial tension and 3.6 mm hook bends, but only 30 active coils, still stretched 10 mm closed and 60 mm open. Find the rate, the loads closed and open, the body stress, and the hook bending and torsional stresses open. Does it pass the shop's allowables?

### Worked answer

The rate rises inversely with active coils: 0.948 × 40 ÷ 30 = 1.264 N/mm. The load closed is 12 + 1.264 × 10 = 24.6 N, and open 12 + 1.264 × 60 = 87.8 N.

The body stress scales with the load: 501 × 87.8 ÷ 68.9 = 639 MPa, just within 650 MPa. The hook stresses scale the same way. Bending: 958 × 87.8 ÷ 68.9 = 1,222 MPa, over the 1,200 MPa allowable. Torsion: 526 × 87.8 ÷ 68.9 = 671 MPa, over 650 MPa.

The extension spring designer gives a body stress of 639 MPa, hook bending of 1,222 MPa and hook torsion of 671 MPa, and a verdict of spring overstressed. The shorter spring stretches the same 60 mm with fewer coils, so it is stiffer and pulls harder; the body only just passes and both hook checks fail. The fitter's alternative is to keep 40 coils and reroute the coolant line, or to shorten the shutter's travel so the springs stretch less.
