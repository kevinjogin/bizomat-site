---
book: springs-by-the-numbers
chapterSlug: square-wire-and-nested-springs
order: 5
title: "More force in less space: square-wire and nested springs"
description: "What to do when a round-wire spring will not fit: square and rectangular wire, nested pairs, load sharing, coil clearance and hand of winding, compared on one fixture."
draft: false
---

Some springs are designed by their force and some by their space. When a spring must give a large force in a short, narrow pocket, a round-wire design runs out of room: the wire that would carry the force at an acceptable stress needs so many coils for the rate that the spring is solid before it reaches its working length. There are two common ways to put more spring into the same space. One is to wind the spring from square or rectangular wire, which packs more steel into each coil. The other is to put a second spring inside the first.

This chapter compares both on the VM-8's first production job, a fixture whose pressure pads are pushed by springs in shallow pockets. It uses three KEVOS® tools: one for square-wire springs, one that compares square and round wire on the same coil, and one that checks a nested pair. Its mistake is a nested pair that jammed because both springs were wound the same way.

## The fixture and its pads

The VM-8's first job is a cast-iron pump bracket machined on three faces in one set-up. The fixture locates the casting on three pads and two pins, then two hydraulic clamps hold it down. Before the clamps close, two spring-loaded pressure pads push the casting sideways against its locating pins so that the clamps do not drag it off them. Each pad needs at least 650 N at its working position, and no more than about 900 N, because more would distort the thin wall it bears on. This is an illustration.

The pads sit in pockets bored into the fixture body: 37 mm diameter, so the spring's outside diameter may be at most 36 mm, and deep enough for a spring of 64 mm free length that is compressed to 52 mm when the pad is in its working position. A shoulder on the pad stops it at 46 mm, so the spring can never be driven further.

## Round wire runs out of room

The obvious first design is a round-wire spring with a 30 mm mean coil diameter and 5 mm wire, giving a 35 mm outside diameter. With 6 active coils and closed and ground ends it is 40 mm long when solid, which leaves 12 mm between solid and the working length.

Its rate is 79,300 × 5⁴ ÷ (8 × 30³ × 6) = 38.24 N/mm, so it gives 38.24 × 12 = 459 N at 52 mm. That is 191 N short. A stiffer round spring needs either fewer coils, which leaves less deflection before solid, or thicker wire, which fills the pocket and makes the solid length longer. With 6 mm wire the spring would be at the pocket's 36 mm limit on outside diameter and solid at 48 mm, only 4 mm below the working length and 2 mm above the pad's stop.

## Square wire

A square wire of side a has more steel than a round wire of diameter a, and more of it far from the centre where it resists twisting. Wound on the same coil with the same number of turns, it gives a stiffer spring that carries more force at a similar stress, and its solid length is the same because each coil is still a thick.

The handbook formulas for square wire use different constants from round wire:

```figure
type: formula
title: Rate and stress of a square-wire helical spring
formula: k = G a⁴ ÷ (5.58 Na D³)
formula: S = F D ÷ (0.416 a³),  corrected S × 0.96 K
caption: a is the side of the square wire and D the mean coil diameter. K is the round-wire Wahl factor for the index D ÷ a; the 0.96 adjusts it for the square section. The formulas assume the wire stays square in the coil.
- k | rate, N/mm
- S | uncorrected torsional stress
- Na | active coils
```

The [square-wire compression spring tool](/tools/square-wire-spring/) takes the wire side, mean coil diameter, active coils, shear modulus, free and working lengths, and an allowable shear stress. It returns the rate, the load at the working length, the uncorrected and corrected stresses and the spring index, and asks the user to confirm that the working length stays above solid length, the coils times the wire side. It assumes the section stays square in the coil; in practice square wire deforms into a keystone shape as it is coiled, thicker on the inside of the coil than the outside, which changes the rate.

With 5 mm square wire on the same 30 mm coil, 6 active coils, free length 64 mm and working length 52 mm, the tool gives a rate of 54.83 N/mm, a load of 658 N and a corrected stress of 456 MPa against the shop's allowable of 600 MPa for this oil-tempered wire. This is an illustration.

### Square against round, side by side

The [square versus round wire spring comparison](/tools/square-round-spring-compare/) runs both calculations for the same coil diameter, active coils, free and working lengths, with the round wire's diameter equal to the square wire's side. It returns both rates, loads and corrected stresses, the solid length they share, and which of them gives the load needed within the allowable. It reminds the user that square wire keystones in coiling and that the rate should be confirmed on a sample.

```figure
type: steps
title: The pressure pad spring in the square versus round comparison
caption: This is an illustration. Wire 5 mm (side or diameter), mean coil 30 mm, 6 active coils, free length 64 mm, working length 52 mm, allowable 600 MPa, load needed 650 N.
- Rate: square / round | 54.83 / 38.24 N/mm
- Load at 52 mm: square / round | 657.9 / 458.9 N: square gives 1.43 times the load
- Corrected stress: square / round | 456 / 351 MPa
- Solid length, both | 40.00 mm
- * Result | SQUARE WIRE MEETS THE NEED
```

The factor of 1.43 does not depend on the coil or the lengths: it is the ratio of the two rate constants, 8 ÷ 5.58. Square wire of the same size always gives about 43% more force on the same coil, at a stress about 30% higher in this case.

### Testing a square-wire sample

Because keystoning changes the section, a square-wire spring's real rate can differ from the formula by several per cent, and the direction depends on the coiling. The usual practice is to have a sample wound, measure its force at two lengths on a tester, and adjust the active coils for production. For the pads, a rate 5% low would have given 625 N at 52 mm, under the need; a rate 5% high would have given 691 N, comfortably within the 900 N limit. So the shop would have had to specify a slightly stiffer spring than the formula's minimum and accept the sample loop. Round wire carries no such uncertainty: its rate formula is within a per cent or two for a well-made spring.

Square wire is also dearer than round wire and held by fewer spring makers, so it usually means a longer lead time, and its fatigue behaviour is less well documented than round wire's. Most makers recommend it for static or modest cyclic duty unless they have test data for the product.

### Rectangular die springs

The commonest square-section springs in workshops are die springs, wound from rectangular wire with the long side across the coil. They are made to standard sizes, for example to ISO 10243, which sets their housing dimensions and a colour code for their load class, and are sold off the shelf with the maker's load and deflection limits. A die spring that fits the pocket is usually the quickest answer to a fixture problem like this one. The shop looked at them first; at the time, the size that fitted was only available in a load class above the 900 N limit at 52 mm.

## Nested springs

The other way to put more spring in the pocket is to fill the space inside the first spring with a second. The two springs work side by side, so they are in parallel: their rates add, each carries its own share of the load, and each must be checked on its own.

For the pads, the shop tried the 5 mm round spring of 30 mm mean diameter as the outer spring, with an inner spring of 3.2 mm wire on a 19 mm mean diameter, 9 active coils, both 64 mm free.

The [nested compression spring check](/tools/nested-spring-check/) takes the wire, coil diameter and active coils of each spring, a common end type, shear modulus, free length and working length, the allowable stress, the load needed and the least radial clearance between the springs. It returns each spring's rate, load and corrected stress at the working length, its stress and length at solid, the combined rate and the share of the load each carries, the radial clearance between the inner spring's outside and the outer spring's inside, and the total load against the need. It assumes equal free lengths and static load, and reminds the user to wind the springs in opposite hands.

```figure
type: steps
title: The nested pressure pad springs in the nested spring check
caption: This is an illustration. Outer 5 mm wire, 30 mm mean, 6 coils; inner 3.2 mm wire, 19 mm mean, 9 coils; both closed and ground, free 64 mm, working 52 mm; allowable 600 MPa; need 650 N; least clearance 1 mm.
- Rates: outer / inner / combined | 38.24 / 16.84 / 55.08 N/mm
- Loads: outer / inner | 458.9 / 202.1 N, outer carries 69%
- * Total load | 661.0 N against 650 N needed
- Stress: outer / inner | 351 / 375 MPa
- Stress at solid: outer / inner | 703 / 899 MPa
- Solid length: outer / inner | 40.00 / 35.20 mm
- Radial clearance between springs | 1.40 mm: SPRING SET ADEQUATE
```

### Clearance between the springs

The radial clearance is half the difference between the outer spring's inside diameter and the inner spring's outside diameter: ((30 − 5) − (19 + 3.2)) ÷ 2 = 1.4 mm. Both springs grow slightly in diameter as they are compressed, and the inner spring needs room to do so without rubbing on the outer. The shop uses at least 1 mm for springs of this size. This is an illustration.

### Stress at solid in a nested pair

The tool reports each spring's stress at its own solid length, and the inner spring's figure, 899 MPa, is well over the allowable. In this pair it can never be reached. The outer spring is solid at 40 mm, before the inner one at 35.2 mm, and the pad's shoulder stops both at 46 mm. At 46 mm the outer spring carries 688 N at 527 MPa and the inner 303 N at 562 MPa, both within 600 MPa. A nested pair must be checked at the shortest length either spring can actually reach, which is set by whichever goes solid first or by a stop.

## Choosing between them

```figure
type: compare
title: Three ways to fill the pressure pad pocket
cols: Load at 52 mm, N | Highest stress, MPa | Parts | Notes
rowhead: Design
- Round 5 mm, 6 coils | 459 | 351 | 1 | 191 N short of the need
- Square 5 mm, 6 coils | 658 | 456 | 1 | Special wire; keystone changes the rate; sample test needed
- * Nested round 5 mm + 3.2 mm | 661 | 375 | 2 | Stock wire; lower stresses; must be wound in opposite hands
caption: This is an illustration. All three fit the 37 mm pocket and stay off solid. The nested pair meets the need with the lowest stresses, from wire the spring maker holds.
```

The shop chose the nested pair. It meets the 650 N need with both springs below 400 MPa, uses wire the local spring maker stocks, and its rate is predictable from the round-wire formulas; the square-wire spring would have needed a sample made and tested before the rate could be trusted. The cost was one more part per pad, and a specification that says which way each spring is wound.

## The mistake: two springs wound the same way

The first nested sets arrived with both springs wound right-handed, the default for a spring maker when nothing is said. On the bench they worked. In the fixture, after a few hundred parts, one pad stuck in its pocket and the casting was machined off its locator.

When the pad was dismantled, a coil of the inner spring was found wedged between two coils of the outer one. Springs wound in the same hand have coils that lie parallel; when the pair is knocked sideways, as a fixture pad is every time a casting is loaded against it, a coil of one can slip into the gap between coils of the other, and once there it is held. Springs wound in opposite hands cross each other at every turn and cannot interlock.

```figure
type: svg
title: Why nested springs are wound in opposite hands
alt: Two side views of a pair of nested coil springs, drawn as sloping lines. On the left, both springs' coils slope the same way, and one coil of the inner spring is drawn lodged between two coils of the outer spring, marked with a cross. On the right, the inner spring's coils slope the opposite way and cross the outer spring's coils, marked with a tick.
caption: Same hand, left: the coils are parallel and one can slip between the other's. Opposite hands, right: the coils cross at every turn and cannot lodge. The nested spring check reminds the user of this; it cannot see the hand of winding.
viewbox: 0 0 640 240
body:
<rect class="bx" x="40" y="30" width="240" height="180"/>
<path class="ln" d="M60 50L100 190M100 50L140 190M140 50L180 190M180 50L220 190M220 50L260 190"/>
<path class="la" d="M90 70L110 170M120 70L140 170M150 70L170 170M180 70L200 170M210 70L230 170"/>
<path class="fa" d="M150 110l12 12M162 110l-12 12"/>
<text class="tx txs" x="60" y="228">Same hand: coils can interlock</text>
<rect class="bx" x="360" y="30" width="240" height="180"/>
<path class="ln" d="M380 50L420 190M420 50L460 190M460 50L500 190M500 50L540 190M540 50L580 190"/>
<path class="la" d="M430 70L410 170M460 70L440 170M490 70L470 170M520 70L500 170M550 70L530 170"/>
<path class="la" d="M470 115l6 6 12-14"/>
<text class="tx txs" x="380" y="228">Opposite hands: coils cross</text>
```

The fix was to reorder the inner springs left-handed and add the hand of winding to the specification for both. The shop's spring specification form now has a field for hand of winding, filled in for every nested pair and for any spring that runs over a threaded rod or inside a threaded bore, where the same problem can occur.

## Equal free lengths

The nested spring check assumes both springs have the same free length, so that they start loading together. If the inner spring were 2 mm shorter, it would carry nothing for the first 2 mm of travel and 16.84 × 2 = 34 N less at the working length, and the outer spring would carry a larger share. The shop specifies both springs to the same free length with a tolerance of ± 0.5 mm, and checks the pair's combined force at 52 mm on the tester before fitting.

```figure
type: checklist
title: Specifying a nested pair
caption: The VM-8 fixture's nested pad springs. This is an illustration.
- x Same free length for both springs, with a tight tolerance
- x Opposite hands of winding, stated for each spring
- x Radial clearance of at least 1 mm between the springs
- x Each spring's stress checked at the shortest length either can reach
- x Combined force tested at the working length before fitting
- x Pocket deep enough that the spring with the longer solid length governs
```

## Exercise: a heavier inner spring

The spring maker suggests a heavier inner spring, 3.5 mm wire on a 19.5 mm mean diameter with 8 active coils, same 64 mm free length, in the same outer spring. Find the inner spring's rate and load at 52 mm, the total load, the radial clearance and the inner spring's stress at 52 mm. Is it still within the pad's 900 N limit and the 600 MPa allowable?

### Worked answer

The inner rate is 79,300 × 3.5⁴ ÷ (8 × 19.5³ × 8) = 25.08 N/mm, so at 12 mm of deflection it carries 300.9 N. With the outer spring's 458.9 N, the total is 759.8 N, between the 650 N need and the 900 N limit, with the outer spring carrying 60%.

The radial clearance is ((30 − 5) − (19.5 + 3.5)) ÷ 2 = 1.0 mm, exactly the shop's minimum.

The inner spring's index is 19.5 ÷ 3.5 = 5.57 and its Wahl factor 1.274, so its stress at 52 mm is 1.274 × 8 × 300.9 × 19.5 ÷ (π × 3.5³) = 444 MPa, within 600 MPa. At the pad's stop of 46 mm its load is 25.08 × 18 = 451 N and its stress 666 MPa, over the allowable. The nested spring check, run at 52 mm, passes the set at 759.8 N with a clearance of 1.00 mm; run at the stop length of 46 mm, it fails the inner spring on stress. The heavier inner spring gives more force than the pads need and is overstressed at the stop, so the original 3.2 mm spring stays.
