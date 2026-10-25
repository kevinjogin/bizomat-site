---
book: designing-welded-joints-by-the-numbers
chapterSlug: fatigue-of-welded-joints
order: 8
title: "Fatigue of welded joints"
description: "See why welded joints fail under repeated loads far below their static strength, estimate life from the stress range with a cube law, add mixed loads with Miner's rule, and improve details that crack."
draft: false
---

Most welded joints that fail in service do not break under a single overload; they crack slowly under loads repeated thousands or millions of times, each far below what the joint could carry once. A motor bracket vibrating at running speed, a conveyor frame flexing at every start, a walkway bouncing under footsteps, a gearbox plate twisted back and forth by a reversing torque: each puts the welds through a cycle of stress, and the cycles add up. Fatigue is the reason the earlier chapters kept choosing welds larger than the static calculation required, and the reason this chapter matters more than any other for machine frames.

This chapter explains why welded joints are especially prone to fatigue, introduces the stress range and the cube law that governs most welded details, estimates the life of the conveyor drive's critical joints, adds up mixed loads with Miner's rule, and sets out the ways to improve a detail that would otherwise crack. The detail categories and reference strengths in it are illustrations; design for fatigue uses the applicable standard's values.

## Why welds are weak in fatigue

Welded joints are poorer in fatigue than the plain steel they are made from, for three reasons. The weld toe, where the weld meets the plate surface, is a sharp change of section that concentrates stress. The toe also usually contains tiny defects, small undercuts, slag intrusions and sharp ripples, from which a crack can grow almost immediately, so that a welded joint spends nearly all its fatigue life growing a crack rather than starting one. And welding leaves residual stresses, often as high as the steel's yield stress, near the weld, so that even a load cycle that is nominally in compression can open the crack.

The practical consequences are that the fatigue strength of a welded joint depends mainly on the geometry of the detail, how severe a stress concentration its weld toe or root creates, and on the stress range, the difference between the highest and lowest stress in each cycle, and hardly at all on the steel's strength. A high-strength steel welded joint is no better in fatigue than a mild steel one with the same detail. Using a stronger steel to save weight can therefore make a frame worse in fatigue, because its higher working stresses mean larger stress ranges at the same welded details.

## The stress range

The stress range Δσ is the difference between the maximum and minimum nominal stress in the member at the detail during a load cycle. A load that goes from zero to a maximum and back gives a range equal to the maximum stress; a load that reverses fully, from plus to minus, gives a range of twice the maximum. The gearbox plate's reversing torque, which pushes one way at start-up and the other way at stopping, therefore gives a stress range twice as large as the torque in one direction alone would suggest.

## The cube law

Fatigue design standards classify welded details into categories, each with an S-N curve that relates the stress range to the number of cycles to failure. For most welded details, the curve's slope on logarithmic axes is about 3, so that the life is inversely proportional to the cube of the stress range: halve the stress range and the life rises about eight times. Each category is identified by a reference stress range, the range at which the detail survives a stated number of cycles, often two million.

```figure
type: formula
title: Fatigue life of a welded detail from the cube law
formula: N = N_ref × (Δσ_ref ÷ Δσ)³
caption: This is an illustration with an invented detail category whose reference stress range is 80 MPa at two million cycles. Real categories, their reference values, the cut-off limits and the safety factors come from the applicable fatigue standard.
- Δσ_ref, illustrative reference range | 80 MPa at 2,000,000 cycles
- Δσ, stress range at the detail | 40 MPa
step: N = 2,000,000 × (80 ÷ 40)³
step: N = 2,000,000 × 8 = 16,000,000 cycles
```

```figure
type: bars
title: Illustrative fatigue life of one welded detail at different stress ranges
unit: millions of cycles to failure
max: 40
caption: This is an illustration. Calculated from the cube law with an illustrative reference range of 80 MPa at two million cycles. The steepness is the point: small reductions in stress range give large gains in life.
- 60 MPa | 4.7
- *40 MPa | 16
- 30 MPa | 38
```

## The gearbox plate

This is an illustration. The gearbox plate's welds see the reversing torque every time the conveyor starts and stops, about 50 times a day, about 18,000 times a year, and over a 20-year life about 365,000 cycles. The designer estimated the stress range in the frame member at the weld toe from the reversing forces at about 40 MPa. For a detail with the illustrative reference range of 80 MPa, the life at 40 MPa is about 16 million cycles, more than 40 times the 365,000 the plate would see. The starts and stops are not a fatigue problem for this detail. Had the stress range been 80 MPa, double the estimate, the life would have been two million cycles, still more than five times the expected number, which gave the designer confidence that the estimate of the range did not need to be precise.

## The motor bracket and vibration

The motor bracket is different. A motor running slightly out of balance at 1,500 rev/min vibrates at 25 cycles per second, which over 16 hours a day and 300 days a year is about **432 million** cycles a year. Even a tiny stress range, repeated that often, can crack a weld. Fatigue standards recognise a constant amplitude fatigue limit, a stress range below which a detail under constant-amplitude loading is not expected to crack, and a cut-off below which small ranges do no damage; their values depend on the detail category. The design rule for vibrating parts is therefore to keep the vibration stress range at the welds well below the detail's limit, which in practice means a stiff bracket, a balanced motor and welds at well-detailed places.

The designer kept the bracket stiff, with a flange plate and stiffeners (Chapter 5), so that its natural frequency was well above the motor's running speed and the vibration stress was very small, and specified that the motor be balanced and its mounting checked at commissioning.

## Mixed loads and Miner's rule

Real loads are rarely all the same size. A walkway sees heavy loads occasionally, moderate ones often and light ones constantly. Miner's rule adds up the damage from each part of the load spectrum: each block of n cycles at a stress range with a life of N uses up a fraction n ÷ N of the detail's life, and the detail is expected to fail when the fractions add up to about one.

```figure
type: compare
title: Miner's rule for an illustrative walkway support spectrum over its design life
cols: Cycles expected, n | Life at that range, N | Damage, n ÷ N
caption: This is an illustration using the cube law with an illustrative reference range of 80 MPa at two million cycles. The total damage of about 0.05 is far below 1, so this detail is not expected to crack in its design life.
- 60 MPa range: crowds | 20,000 | about 4.7 million | about 0.004
- 40 MPa range: groups | 200,000 | 16 million | about 0.013
- 25 MPa range: single walkers | 2,000,000 | about 66 million | about 0.031
- *Total | — | — | about 0.05
```

Miner's rule is an approximation, and fatigue standards add factors and adjustments, but it lets a designer see which part of the spectrum does the damage. Here it is the many small cycles from single walkers, not the rare crowds, which is common: frequent small loads often matter more than rare large ones.

## Mean stress and residual stress

In plain, unwelded steel, fatigue life depends on the mean stress as well as the range: a cycle that stays mostly in tension is more damaging than one centred on zero. In as-welded joints, the residual stresses near the weld are already close to the steel's yield stress, so the actual stress at the toe cycles from near yield downwards whatever the nominal mean, and fatigue standards for welded details generally use the stress range alone. That is why stress-relieving a welded structure by heat treatment can improve its fatigue performance for some details, and why compressive stresses introduced at the toe by peening help: they change the local stress the crack sees.

## Root failures

Not every fatigue crack starts at the toe. In fillet-welded and partial penetration joints, the unfused root is itself a crack-like discontinuity, and if the load puts the throat under a high stress range, the crack can start at the root and grow through the weld, where it cannot be seen until it breaks the surface. Root failures are typical of undersized fillet welds in fatigue: the weld's throat stress range is higher than the plate's, so the weld cracks before the toe does. Making the weld larger moves the critical point from the root to the toe, which is one of the few cases where a larger weld genuinely improves fatigue life. The designer checks both the toe, using the member's stress range, and the throat, using the weld's.

## Corrosion and fatigue

Fatigue in a corrosive environment is worse than in dry air: corrosion pits start cracks, and the crack grows faster when the environment attacks its tip. Fatigue standards reduce the allowable stress ranges, or remove the fatigue limit altogether, for unprotected steel in corrosive conditions such as seawater. For machine frames in wet or chemical environments, keeping the steel protected, by paint, galvanising or choice of material, is part of fatigue design, and crevices such as those behind intermittent welds and backing bars, which hold moisture, are doubly to be avoided.

## Counting cycles honestly

Fatigue estimates are only as good as the cycle count. The designer must estimate how many times each load will be applied over the life of the structure, and the estimates are often the least certain part of the calculation. A conveyor that was expected to start 50 times a day may, in a busier plant, start 200 times; a walkway expected to carry occasional maintenance staff may become a route used all day. The designer records the cycle assumptions in the design note, so that a change of use can be checked against them, and allows a margin on the life for the uncertainty.

## Details that crack

Some welded details are notoriously poor in fatigue, and good design avoids them where loads repeat:

- **intermittent fillet welds**, whose many ends are each a crack starter;
- **short attachments and gussets** welded to a stressed member, whose weld ends concentrate the member's stress;
- **partial penetration and single-sided fillet welds** loaded so that the unfused root opens;
- **backing bars** left in place, with a crevice and a notch at their edges;
- **abrupt changes of section** at welds, such as cover plates that end suddenly;
- **welds on the tension flange** of a beam, where bending stress is highest.

## Improving a detail

The cube law means that improving a detail's category, or reducing the stress range, has large effects. The main methods are:

- **reduce the stress range**, by moving the weld to a less stressed place or stiffening the structure;
- **choose a better detail**, such as a continuous weld instead of an intermittent one, or a tapered transition instead of an abrupt one;
- **grind the weld flush** in the direction of the stress, removing the toe's stress concentration in butt welds;
- **improve the weld toe**, by grinding a smooth profile or by peening, which reshapes the toe and introduces compressive stress, methods that some standards recognise for certain details;
- **make complete penetration welds** where the root would otherwise be a crack.

## Inspection matters more in fatigue

A defect that would make no difference to static strength can halve the fatigue life of a joint. Undercut at the toe, lack of fusion at the root, porosity near the surface and cracks of any size all start fatigue cracks. Fatigue-loaded joints therefore deserve stricter inspection than statically loaded ones, and design standards for fatigue usually require weld quality to a higher level. The designer flags fatigue-critical welds on the drawing, so that the fabricator and inspector give them the attention they need.

## A failure: the gusset end

This is an illustration. On an earlier conveyor, a small gusset had been welded to the bottom flange of a frame beam, near midspan, to carry a guard bracket. The beam flexed every time the conveyor started under load. After about three years, a crack started at the end of the gusset's weld and grew across the beam's bottom flange.

The gusset's weld end was a severe detail at the place of highest bending stress range, exactly the combination fatigue design avoids. The guard bracket was moved to the beam's web near its neutral axis, where the stress range was small, and attached with a bolted clamp; the cracked flange was repaired, with the repair weld ground flush.

## Exercise: halve the stress range

A weld toe detail on the motor bracket's flange sees a stress range of 30 MPa from belt flapping, about 100,000 times a day. With the illustrative reference range of 80 MPa at two million cycles, estimate its life in days. If a stiffener halves the stress range, what is the new life?

At 30 MPa, N = 2,000,000 × (80 ÷ 30)³ ≈ 2,000,000 × 18.96 ≈ **37.9 million** cycles, about 37,900,000 ÷ 100,000 ≈ **379 days**, about a year, which is far too short.

Halving the range to 15 MPa raises the life eight times, to about 303 million cycles, about **3,030 days**, over eight years, and in practice the range may then fall below the detail's cut-off, so that the belt flapping does no damage at all. The stiffener, a few hundred grams of steel, is worth far more than any increase in weld size.
