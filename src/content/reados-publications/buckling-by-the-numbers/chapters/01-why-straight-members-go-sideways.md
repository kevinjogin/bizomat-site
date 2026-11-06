---
book: buckling-by-the-numbers
chapterSlug: why-straight-members-go-sideways
order: 1
title: "Why straight members go sideways"
description: "Why a straight member in compression fails by bending sideways at a load set by its stiffness, not its strength: Euler's load, the energy view and the fork between straight and bent."
draft: false
---

A short, stocky steel block in compression fails by squashing: the load rises until the steel yields. A long, slender bar of the same steel fails in a different way. Long before it is anywhere near yield, it bows sideways, and once it has started to bow it carries no more load, however strong the steel is. That sideways failure is buckling, and it is decided by stiffness and length, not by strength.

This chapter explains why it happens, derives the load at which it happens for the simplest case, and applies it to the legs of the book's running case. It also shows the error that buckling most often hides behind: a direct stress check that looks comfortable when the member is in fact close to its limit.

## The running case in one paragraph

This is an illustration. A fabrication shop in Toowoomba, Queensland, is building HT-8, an elevated stand for a stainless steel process-water header tank at a food plant. The tank is 2,200 mm in inside diameter, holds water to 2,000 mm, and weighs 420 kg empty. Full, it holds 7,603 L and weighs 8,023 kg. It sits on a square top frame carried by four legs of circular hollow section (CHS) 76.1 × 3.6 mm in grade C350 steel, each 4,000 mm long from base plate to top frame, set at the corners of a 2,200 mm square. Shared equally, the full tank puts 19.7 kN on each leg. Every chapter of the book works on some part of HT-8: its legs, its bracing, the hydraulic cradle that stands the tank upright, the tank shell itself and the temporary frames used on site.

## A ruler on the kitchen scales

The quickest demonstration of buckling needs a 300 mm steel rule, 25 mm wide and 1 mm thick, and a set of kitchen scales. Stand the rule on end on the scales and press down on its top with the flat of your hand, keeping your hand from moving sideways. The reading climbs to about 4 or 5 kg and then stops climbing. Press harder and the rule simply bows further sideways while the reading stays put.

The rule has not yielded. The steel in it is stressed to only about 2 MPa when it bows. What has happened is that a sideways deflection, once it exists, gives the load a lever arm. The load pushes down along a line that is now offset from the middle of the rule, so it bends the rule further. The rule's bending stiffness resists. At one particular load the two exactly balance, and above it the bending stiffness can no longer win.

```figure
type: svg
title: A pinned strut, straight and buckled
alt: A vertical strut is drawn twice. On the left it is straight between a pinned base and a pinned top, with a load P pressing down on the top. On the right the same strut has bowed into a single curve, a half sine wave, with its largest sideways deflection a at mid-height. Dashed lines show the line of the load, so the lever arm of the load about the mid-height section is the deflection a.
caption: Once the strut bows, the load acts at a lever arm equal to the deflection. The bending moment P × a at mid-height tries to bend it further; the strut's stiffness EI resists.
viewbox: 0 0 640 340
body:
<path class="ah" d="M150 30L160 50L170 30Z"/>
<path class="ln" d="M160 10V50"/>
<text class="txb" x="178" y="34">P</text>
<circle class="fa" cx="160" cy="60" r="6"/>
<path class="la draw" pathLength="1" d="M160 60V290"/>
<circle class="fa" cx="160" cy="290" r="6"/>
<path class="bx" d="M130 296H190V312H130Z"/>
<text class="tx txs" x="110" y="332">straight: no lever arm</text>
<path class="ah" d="M440 30L450 50L460 30Z"/>
<path class="ln" d="M450 10V50"/>
<text class="txb" x="468" y="34">P</text>
<circle class="fa" cx="450" cy="60" r="6"/>
<path class="la draw" pathLength="1" d="M450 60C482 110 500 150 500 175C500 200 482 240 450 290"/>
<circle class="fa" cx="450" cy="290" r="6"/>
<path class="bx" d="M420 296H480V312H420Z"/>
<path class="ln dsh" d="M450 60V290"/>
<path class="ln" d="M450 175H500"/>
<text class="txb" x="508" y="180">a</text>
<text class="tx txs" x="510" y="200">sideways deflection</text>
<text class="tx txs" x="380" y="332">buckled: moment P × a at mid-height</text>
```

## Euler's load

For a straight, pin-ended strut, the balance between the load's lever arm and the strut's stiffness gives a load at which a bent shape can stay in equilibrium. Leonhard Euler found it in 1744. It is the lowest load at which the strut can hold a bent shape:

```figure
type: formula
title: Euler's buckling load for a pin-ended strut
formula: P_E = π² × E × I ÷ L²
formula: Critical stress: σ_E = P_E ÷ A = π² × E ÷ (L ÷ r)²
formula: Radius of gyration: r = √(I ÷ A)
caption: The load depends on the material's stiffness E and the section's second moment of area I, and falls with the square of the length. Strength does not appear anywhere.
- P_E | Euler load, N
- E | elastic modulus, MPa (200,000 for steel)
- I | least second moment of area of the section, mm⁴
- L | length between the pinned ends, mm
- A | cross-section area, mm²
- L ÷ r | slenderness ratio, used in every later chapter
```

Three things in the formula decide almost everything in this book.

**Length is squared.** Double the length and the buckling load falls to a quarter. A leg that is safe at 2,000 mm may fail at 4,000 mm with nothing else changed. That is why bracing, which shortens the length that can buckle, is so effective (Chapter 2 and Chapter 6).

**Stiffness, not strength, appears.** All structural steels have practically the same elastic modulus, about 200,000 MPa. Buying a stronger grade of steel does not raise the Euler load at all. It only helps for stocky members, where yielding and buckling interact (Chapter 4).

**The least I governs.** A member buckles about the axis where it is least stiff. A flat bar buckles across its thickness, never across its width. Round and square hollow sections have the same I about every axis, which is one reason they make good compression members (Chapter 3).

For the ruler, I = 25 × 1³ ÷ 12 = 2.083 mm⁴, so P_E = π² × 200,000 × 2.083 ÷ 300² = 45.7 N, or the weight of about 4.7 kg. The scales agree.

## A fork in the road

The most useful way to think about buckling is through energy, because it shows what kind of event buckling is.

Imagine giving the pinned strut a small sideways bow of amplitude a, in the half-sine shape of the figure above. Two energies change. Bending stores strain energy in the strut, and that energy grows as a². At the same time the top of the strut moves down slightly, because a bowed strut is shorter between its ends than a straight one, so the load does work as it follows. That work also grows as a². For the half-sine shape the change in total energy is:

ΔΠ = (π² × a² ÷ 4L) × (π²EI ÷ L² − P)

The bracket on the right is the whole story. Below the Euler load it is positive: bowing the strut costs energy, so the strut springs back straight when released. The straight position sits at the bottom of an energy valley. Above the Euler load it is negative: bowing releases energy, so the straight position sits on top of an energy hill and the slightest disturbance sends the strut off to one side. At exactly the Euler load the valley has gone flat.

Physicists call this kind of change a bifurcation, or a fork, because one stable state (straight) becomes two equally possible ones (bowed left or bowed right), and nothing in a perfectly symmetric strut decides which. The same mathematics, a quadratic term in the energy that changes sign as a control variable passes a critical value, describes a magnet losing its magnetisation as it is heated through its Curie point and a liquid turning superfluid. The theoretical physics of such transitions, and of the line-like defects that appear when a symmetry breaks, is a large subject; this book uses only the engineering consequence.

```figure
type: steps
title: What happens as the load on a perfect strut rises
caption: The perfect strut is an idealisation. Real members are slightly crooked and their loads slightly off-centre, which turns the sudden fork into a smooth but rapid growth of deflection (Chapter 5).
- Load well below P_E | straight, stiff against sideways pushes
- Load approaching P_E | straight, but a sideways push of a given size deflects it more and more
- * Load reaches P_E | energy valley flat: the strut has no sideways stiffness at all
- Load held at P_E | strut bows to whatever size it is pushed to
- Load slightly above P_E | bows a long way; outer fibres yield; the member collapses
```

### After the fork: the load hardly rises

How much load does a buckled strut carry as it bends further? The exact large-deflection solution, known as the elastica, shows that the load rises only a little above the Euler load as the bow grows.

```figure
type: compare
title: Load on a buckled pinned strut against its bow
cols: Mid-height bow as a share of length | Load ÷ Euler load | Extra load over P_E
rowhead: Bow
- Just buckled | 0 | 1.0000 | 0.0%
- Small bow | 0.02 | 1.0005 | 0.05%
- Visible bow | 0.05 | 1.0031 | 0.3%
- Large bow | 0.10 | 1.0123 | 1.2%
- Very large bow | 0.15 | 1.0278 | 2.8%
- * Severe bow | 0.20 | 1.0493 | 4.9%
caption: From the small-deflection approximation to the elastica, P ÷ P_E ≈ 1 + π² × (a ÷ L)² ÷ 8. A 4,000 mm leg bowed by 400 mm carries only 1.2% more than its Euler load. Real steel yields long before such bows, so the practical capacity is the Euler load or less.
```

A 4,000 mm leg bowed sideways by 400 mm would be carrying only 1.2% more than its Euler load, and its outer fibres would long since have yielded. In practice the Euler load is the ceiling. There is no useful reserve after it.

## HT-8's legs as pinned struts

This is an illustration. The first check of HT-8 treats each leg as a pinned strut 4,000 mm long. The base plates have four bolts and the legs are welded to the top frame, so there is some fixity at both ends, but the shop starts from the pinned case, which Chapter 2 shows is the right starting point for a braced frame and an optimistic one for an unbraced frame.

```figure
type: steps
title: HT-8 leg as a pinned strut, CHS 76.1 × 3.6, C350
caption: This is an illustration. Section properties from the outside diameter and wall; the steel's modulus is 200,000 MPa and its yield 350 MPa.
- Area | A = π × (76.1² − 68.9²) ÷ 4 = 820 mm²
- Second moment of area | I = π × (76.1⁴ − 68.9⁴) ÷ 64 = 540,065 mm⁴
- Radius of gyration | r = √(540,065 ÷ 820) = 25.66 mm
- Slenderness | L ÷ r = 4,000 ÷ 25.66 = 155.9
- Euler stress | σ_E = π² × 200,000 ÷ 155.9² = 81.3 MPa
- Euler load | P_E = 81.3 × 820 = 66.6 kN
- * Factor against buckling | 66.6 ÷ 19.7 = 3.39
```

The Euler stress of 81.3 MPa is less than a quarter of the steel's 350 MPa yield. The leg would buckle elastically, with the steel still well within its elastic range, at 66.6 kN.

The BIZOMAT [Column buckling](/tools/column-buckling/) tool does this calculation. Its inputs are the elastic modulus, yield strength, cross-section area, least second moment of area, unsupported length, effective length factor, applied load and the safety factor you require. It works out the slenderness and a transition slenderness from the modulus and yield, uses Euler's formula above the transition and a parabola (Chapter 4) below it, and reports the critical stress, critical load and the factor of safety against your applied load. For HT-8's leg, entering E = 200 GPa, yield 350 MPa, A = 820 mm², I = 540,065 mm⁴, L = 4,000 mm, K = 1, P = 19,669 N and a required factor of 2.5, it reports Euler buckling, a critical load of 66.6 kN and a factor of 3.39. The tool assumes a straight, centrally loaded member and does not check local buckling of thin walls, which later chapters take up.

### What a factor of 3.39 does and does not mean

A buckling factor of 3.39 says that the four legs, if they behaved as ideal pinned struts, would buckle when the load on each reached 3.39 times the full-tank load: about 66.6 kN per leg, or a tank and contents weighing roughly 27 t. It does not say the stand is 3.39 times as strong as it needs to be in every respect.

Three things eat into the margin before any extra load arrives. The legs are not perfectly straight and the tank's weight does not land exactly on their centrelines, and Chapter 5 shows that both effects lower the load the leg can carry before its steel starts to yield. Wind on a tank this size adds compression to the downwind legs, also covered in Chapter 5. And the whole calculation assumes the top of each leg cannot move sideways relative to its base. If it can, as it can in a frame with no bracing, the leg behaves as a much longer strut, and Chapter 2 shows that the factor then falls below 1.

That is why the shop sets its required factor at 2.5 for a first check of a member like this, and why it treats the first check as the start of the work, not the end of it. A factor of safety covers uncertainty in loads, material and workmanship. It is not meant to cover a wrong model of how the member is held.

### Units that keep the arithmetic honest

Buckling calculations mix lengths in millimetres, stiffness in megapascals and loads in kilonewtons, and an error of a thousand is easy to make. Working throughout in newtons, millimetres and megapascals (N/mm²) avoids it: E = 200,000 MPa, I in mm⁴ and L in mm give P_E directly in newtons. The ruler and the leg both use that set. A useful sense check is the Euler stress itself: for steel it is about 2,000,000 ÷ (L ÷ r)² MPa, so a slenderness of 100 gives about 200 MPa and a slenderness of 200 gives about 50 MPa. Any answer far from that pattern has a units error in it.

## The error: a stress check that looked comfortable

This is an illustration. The shop's first design note for HT-8 was written quickly from a template used for short pedestals. It checked each leg for direct stress:

σ = P ÷ A = 19,669 ÷ 820 = 24.0 MPa, against a yield of 350 MPa, a factor of 14.6.

The note concluded that the legs were "very lightly loaded" and suggested dropping to a lighter section to save weight. Had the shop followed it, the lighter section would have been chosen for a failure mode that cannot occur in a 4,000 mm leg.

The checker caught it with one number. The template had no line for slenderness, and the checker's rule was that any compression member with a slenderness ratio over about 50 must have a buckling check before anything else. At 155.9, the leg is well into the range where buckling, not yield, sets the capacity. The buckling factor of 3.39 is less than a quarter of the stress factor of 14.6.

```figure
type: bars
title: Two checks of the same HT-8 leg
unit: ×
caption: This is an illustration. The direct-stress factor compares 24.0 MPa with the 350 MPa yield; the buckling factor compares the 19.7 kN leg load with the 66.6 kN Euler load. Only the second describes how the leg would fail.
- Direct stress against yield | 14.6
- * Buckling, pinned ends | 3.39
- Required factor for this book's checks | 2.5
```

The lesson the shop wrote into its template was simple. For any compression member, calculate L ÷ r first. If it is more than a few tens, the member is a column, and its capacity comes from a buckling formula, not from P ÷ A against yield.

The lighter section the note proposed, CHS 60.3 × 3.6, shows how fast the margin disappears. Its radius of gyration is 20.09 mm, so its slenderness at 4,000 mm is 199 and its Euler load is 31.9 kN: a factor of only 1.62 on the leg load, below the 2.5 the shop requires.

## What the rest of the book adds

Euler's pinned, perfectly straight, centrally loaded strut is the reference case. Real members differ from it in ways that each chapter takes up:

- their ends are neither pinned nor fixed, and a frame may sway (Chapter 2);
- their sections have different stiffness about different axes (Chapter 3);
- stocky members yield before they buckle elastically (Chapter 4);
- every real member is slightly crooked and every real load slightly off-centre (Chapter 5);
- bracing has to be stiff and strong enough to do its job (Chapter 6);
- machine members such as hydraulic cylinder rods carry whatever force the hydraulics can deliver (Chapter 7);
- temperature changes can load a member that carries no external load (Chapter 8);
- thin walls and shells buckle in their own way, under compression or external pressure (Chapter 9);
- temporary frames on site have their own buckling and stability traps (Chapter 10);
- and every calculation rests on a member that was built straight and to size (Chapter 11).

## Exercise: a taller stand

This is an illustration. The plant asks whether the same stand design could be used with legs 5,000 mm long, to give more head at the outlet, carrying the same full tank.

1. What is the slenderness ratio of the CHS 76.1 × 3.6 leg at 5,000 mm, pinned at both ends?
2. What are its Euler stress and Euler load?
3. What is the factor against buckling, and does it meet the shop's required 2.5?
4. What simple ratio gives the answer to question 2 from the 4,000 mm result without recalculating?

**Worked answer.**

1. L ÷ r = 5,000 ÷ 25.66 = **194.9**.
2. σ_E = π² × 200,000 ÷ 194.9² = **52.0 MPa**; P_E = 52.0 × 820 = **42.6 kN**.
3. 42.6 ÷ 19.7 = **2.17**, below the required 2.5. The 5,000 mm legs need either a stiffer section or bracing (Chapter 2).
4. The Euler load falls with the square of the length: 66.6 × (4,000 ÷ 5,000)² = 66.6 × 0.64 = **42.6 kN**, the same answer. A 25% longer leg loses 36% of its buckling load.
