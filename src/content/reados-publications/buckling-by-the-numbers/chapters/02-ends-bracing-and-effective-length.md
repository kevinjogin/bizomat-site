---
book: buckling-by-the-numbers
chapterSlug: ends-bracing-and-effective-length
order: 2
title: "Ends, bracing and effective length"
description: "How the way a member is held at its ends sets its buckling load: effective length factors, braced and sway frames, and why an unbraced tank stand can buckle under its own contents."
draft: false
---

Chapter 1 treated each of HT-8's legs as a pinned strut: free to rotate at both ends, but with its top held in line above its base. Real members are held in other ways. A leg welded into a stiff frame cannot rotate freely at its top. A leg on a heavy, grouted base plate is partly fixed at its foot. And a leg in a frame without bracing can have its top move sideways relative to its base, which changes everything.

This chapter shows how the end conditions are captured in a single number, the effective length factor K, how to choose it honestly, and how bracing turns a frame that can sway into one that cannot. Its error is the most serious in the book: an early sketch of HT-8 with no bracing, which would have buckled before the tank was full.

## Effective length

Every end condition gives a buckled shape, and every buckled shape contains a length that behaves like a pinned strut: the distance between points where the bent shape has no curvature, called points of contraflexure. That length, written K × L, is the effective length. Euler's formula then applies with K × L in place of L:

P_cr = π² × E × I ÷ (K × L)²

A smaller K means a shorter effective length and a higher buckling load. Because the length is squared, K matters a great deal: halving K multiplies the buckling load by four.

```figure
type: svg
title: Buckled shapes and effective length for four end conditions
alt: Four vertical members of the same length are drawn side by side in their buckled shapes. The first, pinned at both ends, bows in one half sine wave, effective length L. The second, fixed at both ends, bows in the middle with reverse curves near each end; the middle half behaves as a pinned strut, effective length 0.5 L. The third, fixed at the base and pinned at the top, has effective length 0.7 L. The fourth, fixed at the base and free at the top, leans over in a quarter wave, behaving as half of a pinned strut of length 2 L.
caption: The effective length is the length of the part of the buckled shape that acts like a pinned strut. These are the theoretical values for perfectly rigid fixings; real fixings are never perfectly rigid, so practical values are higher.
viewbox: 0 0 640 330
body:
<path class="bx" d="M50 286H110V298H50ZM200 286H260V298H200ZM350 286H410V298H350ZM500 286H560V298H500Z"/>
<path class="bx" d="M200 40H260V52H200Z"/>
<circle class="fa" cx="80" cy="52" r="5"/>
<circle class="fa" cx="80" cy="286" r="5"/>
<path class="la draw" pathLength="1" d="M80 52C110 110 118 150 118 169C118 188 110 228 80 286"/>
<path class="la draw" pathLength="1" d="M230 52C230 80 238 100 248 126C258 150 258 188 248 212C238 238 230 258 230 286"/>
<circle class="fa" cx="380" cy="52" r="5"/>
<path class="la draw" pathLength="1" d="M380 52C400 90 412 130 412 170C412 210 396 250 380 286"/>
<path class="la draw" pathLength="1" d="M530 286C530 230 540 170 556 130C566 100 574 72 580 52"/>
<path class="ln dsh" d="M80 52V286M230 52V286M380 52V286M530 52V286"/>
<text class="txb" x="54" y="24">Pinned–pinned</text>
<text class="txb" x="196" y="24">Fixed–fixed</text>
<text class="txb" x="344" y="24">Fixed–pinned</text>
<text class="txb" x="494" y="24">Fixed–free</text>
<text class="tx" x="64" y="318">K = 1.0</text>
<text class="tx" x="214" y="318">K = 0.5</text>
<text class="tx" x="364" y="318">K = 0.7</text>
<text class="tx" x="514" y="318">K = 2.0</text>
```

### Two families: braced and sway

The four cases above fall into two families, and confusing them is the commonest serious error in compression design.

In a **braced** (non-sway) member, the top cannot move sideways relative to the bottom. Something else, a wall, a diagonal brace or a stiff floor, holds the ends in line. K lies between 0.5 (both ends fixed) and 1.0 (both ends pinned). Taking K = 1.0 is safe whatever the end fixity.

In a **sway** member, the top can move sideways relative to the bottom. K is at least 1.0, even with both ends perfectly fixed, and it is 2.0 for a member fixed at its base and free at its top, the flagpole case. A sway member pinned at its base and held only by a rigid frame at its top is also K = 2.0: the frame stops the top rotating but not moving, and the leg leans over as a flagpole turned upside down.

```figure
type: compare
title: Theoretical effective length factors
cols: Base | Top | Can the top sway? | K, theoretical
rowhead: Case
- Pin-ended strut | pinned | pinned | no | 1.0
- Both ends fixed, braced | fixed | fixed | no | 0.5
- Fixed base, pinned top, braced | fixed | pinned | no | 0.7
- Both ends fixed, sway | fixed | fixed against rotation only | yes | 1.0
- * Pinned base, rigid frame at top, sway | pinned | fixed against rotation only | yes | 2.0
- Flagpole | fixed | free | yes | 2.0
caption: The values assume perfectly rigid fixings. Design guides recommend higher values for the "fixed" cases because no real fixing is perfectly rigid; use the governing code's values for design.
```

### How fixed is fixed?

A base plate with four bolts on a concrete slab is neither pinned nor fixed. It resists some rotation, but the plate bends, the bolts stretch and the grout crushes slightly. A leg welded into a top frame is restrained by the frame's members bending, and they are not infinitely stiff either. The honest approach for a first check is:

- take a braced member as pinned at both ends, K = 1.0, unless the fixity has been calculated or tested;
- take an unbraced (sway) member with "fixed" ends as K = 1.2 or more, never 1.0;
- take an unbraced member with any end that is not reliably fixed as K = 2.0.

The theoretical K = 0.5 of a fixed-fixed braced member is almost never achieved in steelwork, and a design that relies on it should show where the rotational stiffness comes from.

## HT-8: four ways to hold the legs

This is an illustration. The shop's engineer compared four ways of supporting HT-8's legs. In each, the leg is CHS 76.1 × 3.6 in grade C350 steel, 4,000 mm from base plate to top frame, carrying 19.7 kN.

```figure
type: compare
title: HT-8 leg buckling for four support arrangements
cols: Effective length, mm | Slenderness | Mode | Buckling load, kN | Factor
rowhead: Arrangement
- Unbraced, base plates as pins, rigid top frame (K = 2.0) | 8,000 | 311.7 | Euler | 16.7 | 0.85
- Unbraced, heavy grouted base plates (K = 1.2) | 4,800 | 187.0 | Euler | 46.3 | 2.35
- Braced full height, legs pinned (K = 1.0) | 4,000 | 155.9 | Euler | 66.6 | 3.39
- * Braced, with horizontal struts at mid-height (K = 1.0 on 2,000 mm) | 2,000 | 77.9 | Johnson | 209.7 | 10.66
caption: This is an illustration. E = 200,000 MPa, yield 350 MPa, A = 820 mm², r = 25.66 mm. The Johnson mode, used when the slenderness is below about 106 for this steel, is explained in Chapter 4.
```

The four answers span a factor of more than twelve, for the same leg carrying the same load. The difference lies entirely in how the leg is held.

### What the bracing does

The chosen arrangement uses two kinds of bracing. In each of the four faces of the stand, diagonal rods run from corner to corner, top to bottom, crossing in an X. They stop the top frame moving sideways relative to the base: the frame becomes braced, not sway. Each rod works only in tension; when the frame tries to lean one way, one diagonal of each X tightens and holds it.

Then a ring of horizontal struts at mid-height, 2,000 mm above the base plates, joins the four legs. The struts, held in place by the diagonals, stop the legs moving sideways at mid-height, so each leg can only buckle between the base and the struts, or between the struts and the top frame. The length that can buckle halves, and the buckling load would quadruple if the leg stayed elastic. It cannot quite do that, because at a slenderness of 77.9 the steel yields before it reaches the Euler stress, which is why the table's last row shows 209.7 kN, not four times 66.6.

Bracing has its own requirements: it must be stiff enough and strong enough, and its connections must work. Chapter 6 deals with them.

### A sway frame buckles as a whole

In a sway frame, the legs cannot buckle one at a time. If one leg leans, the top frame carries the others with it, so all four lean together in the same direction. Two consequences follow. First, a stiff leg cannot lend its stiffness to a weak one in the way a brace can: the frame's sway buckling load is roughly the sum of the legs' individual sway loads, and the total gravity load on the frame must be compared with that sum. Second, any load on the frame that does not sit on the legs, such as a heavy pump hung from the top frame, still adds to the total that drives the sway, even though no leg seems to carry it directly. A sway check is therefore always a check of the whole storey, not of one member.

### What the diagonals have to carry

The diagonals do more than prevent sway buckling. They are also the only route by which wind on the tank reaches the ground. This is an illustration. The shop's engineer used an assumed wind pressure of 1.0 kPa on the tank's projected area of 2.2 m × 2.0 m, with a drag coefficient of 0.8 for a cylinder, giving a horizontal force of 1.0 × 0.8 × 4.4 = 3.52 kN at the tank. The real design wind for a site comes from AS/NZS 1170.2 and depends on the region, terrain, height and shielding; the 1.0 kPa is a placeholder for this example, not a design value.

The two faces parallel to the wind share that force, 1.76 kN each. In each face the active diagonal of the upper panel runs 2,200 mm across and 2,000 mm up, a length of 2,973 mm, so it carries 1.76 × 2,973 ÷ 2,200 = 2.38 kN in tension, and passes 1.76 × 2,000 ÷ 2,200 = 1.60 kN of extra compression down into the leg at its foot. The rods have to be sized for that tension, with the connection checked too, and the legs have to carry their share of the overturning effect of the wind as well as the gravity load. Chapter 5 adds that compression to the leg check.

A stand with bracing in every face therefore has two separate benefits: the legs' effective length is controlled, and there is a defined, calculable path for sideways loads. A stand without bracing has neither.

### Other lengths that can buckle

Once the legs are braced at mid-height, it is easy to forget the other members in compression. The mid-height struts themselves are compression members 2,200 mm long, and their own buckling is checked in Chapter 6. The top frame members carry some compression from the diagonals. And each leg must be checked on both of its segments: from the base plate to the struts, and from the struts to the top frame. On HT-8 the two segments are equal and carry the same load, so one check covers both. On a stand with the struts set lower, to clear a pipe for example, the longer upper segment would govern.

## The tank stand tool

The BIZOMAT [Tank stand leg check](/tools/tank-stand-leg-check/) tool brings the steps together for a stand of this kind. From the tank's inside diameter, full-level height, contents density and empty mass, it works out the full volume, the full weight and the load on each of the legs you enter. From the leg's outside diameter and wall thickness it calculates the area and second moment of area of the tube, then the slenderness, the Euler or Johnson critical stress, the buckling load and the factor against your required value, using the effective length factor you give it.

This is an illustration. With HT-8's figures (2,200 mm diameter, 2,000 mm full level, 1,000 kg/m³ water, 420 kg empty, four legs of 76.1 × 3.6 mm, 2,000 mm unsupported length, K = 1.0, E = 200 GPa, yield 350 MPa, required factor 2.5) it reports a full volume of 7,603 L, a full mass of 8,023 kg, a load per leg of 19,669 N, Johnson buckling at 209,730 N, and a factor of 10.66.

The tool shares the load equally between the legs and takes it as concentric. It does not add wind, earthquake or sloshing loads, it does not check the welds or base plates, and it uses whatever K you give it. Choosing K is the user's job, and the error below shows why.

```figure
type: decision
title: Choosing K for a tank stand leg
question: Can the top frame move sideways relative to the base?
- Yes, nothing stops it | Sway frame | K = 2.0 for pinned bases, 1.2 or more for well-fixed bases; add bracing if the factor is short
- * No, diagonal bracing in every face | Braced frame | K = 1.0 on the length between braced points
- Only in one direction | Braced one way, sway the other | Check both directions; the sway direction usually governs
```

## The error: a stand with no bracing

This is an illustration. The first concept sketch for HT-8, drawn before the shop's engineer was involved, showed four legs, a top frame and no bracing at all, "to keep the area under the tank clear for the pumps". The sketch noted that the legs had a buckling factor of 3.39, calculated as pinned struts 4,000 mm long.

That calculation answered the wrong question. With no diagonals, nothing stops the top frame moving sideways relative to the base. The four legs and the frame form a sway frame. The base plates, with four bolts each on a slab, were assumed in the sketch to act as pins, and a sway frame with pinned bases and a rigid top has K = 2.0. The effective length is 8,000 mm, the slenderness 311.7 and the buckling load 16.7 kN per leg: a factor of 0.85.

A factor below 1 means the stand would buckle sideways before the tank was full. Four legs at 16.66 kN each support 66.6 kN, which is 6,795 kg. Take off the tank's 420 kg and that leaves 6,375 kg of water, a depth of 1.68 m, or 84% of the tank. Somewhere during the first fill the whole stand would have leaned over, all four legs bending together, and come down with several tonnes of water.

The engineer found it by asking the question in the decision figure above: "What stops the top moving sideways?" The answer, nothing, meant K could not be less than 1 and was probably 2. Heavier, grouted base plates would have helped (K about 1.2 and a factor of 2.35), but still not to the shop's required 2.5, and the stand would still have had nothing to resist wind. The bracing went back in. To keep access for the pumps, the diagonals in the front face stop at the mid-height struts, and the lower panel of that face is braced by a portal frame of heavier members instead, checked separately.

## Exercise: bracing in one direction only

This is an illustration. A later proposal suggests bracing only the north and south faces of HT-8, leaving the east and west faces open for access.

1. In which direction can the stand still sway?
2. What effective length factor applies to the legs for buckling in that direction, if the base plates are taken as pins?
3. What is the factor against buckling in that direction?
4. If heavy base plates could be shown to give K = 1.2 in the open direction, what is the largest K that would still meet the required factor of 2.5 for a 4,000 mm leg?

**Worked answer.**

1. Diagonals in the north and south faces resist movement in the north–south direction only (the plane of those faces). The stand can still **sway east–west**.
2. In the sway direction, pinned bases and a rigid top frame give **K = 2.0**.
3. The same as the unbraced sketch: effective length 8,000 mm, buckling load 16.7 kN, factor **0.85**. Bracing one direction does nothing for the other.
4. For a factor of 2.5 the buckling load must be at least 2.5 × 19.7 = 49.2 kN, a critical stress of 49,172 ÷ 820 = 60.0 MPa. That needs a slenderness of no more than √(π² × 200,000 ÷ 60.0) = 181.4, so K × 4,000 ÷ 25.66 ≤ 181.4 and **K ≤ 1.16**. The heavy base plates (K = 1.2) fall just short, which is consistent with the factor of 2.35 in the table. The open faces need a portal frame or bracing.
