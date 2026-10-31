---
book: adhesive-bonding-by-the-numbers
chapterSlug: peel-cleavage-and-joint-shape
order: 7
title: "Peel, cleavage and joint shape"
description: "Why bonded joints are weak in peel and cleavage, how bending in a single lap joint creates peel at its ends, peel strength and toughness, and the end details that stop peel from starting."
draft: false
---

Chapter 6 treated the adhesive as if it were loaded only in shear. Real joints are never so tidy. A single lap joint bends as it is pulled, a stiffener's end lifts as a panel flexes, and a bracket's top edge is pried away by a hanging load. In each case, part of the bondline is pulled apart across its thickness, and when that pull concentrates on a line at one edge, the joint is in peel or cleavage: the loading adhesives resist worst.

This chapter explains peel and cleavage and why they are so much more dangerous than shear, shows how bending in a single lap joint generates peel at its ends, introduces peel strength and toughness, and works through the end details that fixed Plant K's stiffeners. Its error is the obvious remedy for a weak joint, a stronger adhesive, which made the problem worse.

## Why peel is so damaging

In shear, load passes through the adhesive over a length of several millimetres at each end of an overlap, as Chapter 6 showed. In peel, a flexible adherend is pulled away from the other at an angle, and the whole load is carried by a narrow strip of adhesive at the point where the two separate, perhaps a fraction of a millimetre wide. The stress there is enormous even when the load is small, and once the adhesive at the line fails, the line simply moves on to the next strip. A peeling joint fails progressively, like a zip, and its strength is described not as a stress but as a force per unit width of the peel front.

Cleavage is the rigid-adherend version. Two stiff parts are pried apart from one edge; the stress is highest at that edge and falls across the joint, so a larger area resists than in peel, but the loaded edge still sees far more than the average. Both loadings are the reason good bonded design arranges for shear and avoids anything that opens the bondline.

### A comparison in Plant K's numbers

Each stiffener flange is 20 mm wide. In shear, Chapter 6's elastic model puts a ceiling on the load one end can pass into the skin at 2τ_max b ÷ ω = 2 × 32 × 20 ÷ 0.267, about 4.8 kN, before the peak stress reaches the adhesive's limit. In peel, the same epoxy has an illustrative T-peel strength of 6 N per millimetre of width, so a peel front across the 20 mm flange advances at about 120 N.

```figure
type: bars
title: What one 20 mm stiffener flange end resists in shear and in peel
unit: newtons
caption: This is an illustration. The shear figure is the elastic shear-lag ceiling from Chapter 6 at a 32 MPa peak; the peel figure is an illustrative T-peel strength of 6 N/mm across 20 mm. The same bondline carries about 40 times as much in shear as in peel.
- * Shear, elastic ceiling | 4790
- Peel at 6 N/mm | 120
```

A load of 120 N is roughly the weight of a 12 kg mass. A dropped door easily generates that at a stiffener's end.

## Peel in a single lap joint

Even a joint loaded in nominal shear develops peel. In a single lap joint, the two adherends' centre lines are offset by about the adherend thickness plus the bondline, so the pulling forces form a couple that rotates the overlap. The adherends bend at the ends of the overlap, and that bending pulls the bondline open exactly where Chapter 6 found the shear stress highest.

```figure
type: formula
title: The bending moment at the end of a single lap overlap
caption: After Goland and Reissner (1944). The factor k is close to 1 at small loads and short overlaps and falls as the joint rotates under load, which reduces the eccentricity. The peel stresses that result are of the same order as the peak shear stresses.
- M₀ = k P (t + η) ÷ 2 | moment per unit width at the overlap end, P per unit width
- step: 0 < k ≤ 1 | the bending moment factor, falling with load and overlap length
- step: peel stress at the end ∝ M₀ | so thin adherends and high loads peel most
```

Goland and Reissner's analysis, published in 1944, showed that the peel stresses at the overlap ends are comparable to the peak shear stresses, and since adhesives are weaker in tension across the bondline than in shear, peel often starts the failure. That is why single lap joints of thin adherends commonly fail at lower average stresses than the elastic shear model alone predicts, and why the plant's 1.6 mm coupons gave lower strengths than the data sheet's thicker ones.

## Peel strength and toughness

Peel strength is measured by pulling apart two flexible adherends bonded face to face. In the T-peel test, standardised as ASTM D1876 and named here for scope only, the two free ends are bent apart into a T and pulled in a tensile machine, and the steady force per unit width is recorded. Other peel tests use a rigid and a flexible adherend, or wind the flexible one round a drum.

Peel strength is closely related to the **toughness** of the adhesive: the energy it absorbs as a crack advances through it. A brittle adhesive breaks with little deformation at the crack tip and peels easily, however high its shear strength. A toughened adhesive contains dispersed rubber or thermoplastic particles that make the material near the crack tip deform plastically, absorbing far more energy. For a T-peel test the energy released per unit area of new crack is roughly twice the peel force per width, so 6 N/mm corresponds to about 12 kJ/m², most of it spent bending the arms and deforming the adhesive. Compared with the work of adhesion of about 0.1 J/m² found in Chapter 3, the joint's toughness is over a hundred thousand times larger, which shows how little of a joint's strength comes from the bare surface attraction and how much from the adhesive's ability to deform.

## Where the drop test put the peel

Plant K's drop test lets a door fall a set height onto its bottom edge on a concrete floor. Each hat-section stiffener has a girth of about 100 mm of 1.6 mm sheet, 160 mm² of aluminium, so it weighs about 0.43 kg a metre and 0.69 kg over its 1,600 mm. If the door's edge stops within a few millimetres, the deceleration can reach tens of g. At an illustrative 50 g, the stiffener's own inertia is about 340 N, which the bondline has to hold against the skin as the door stops.

Along most of the stiffener, that load is spread as shear over a long bonded length, and nothing happens. At the bottom end, though, the skin buckles and flexes outward as the edge strikes the floor, while the stiffener, much stiffer in bending, tries to carry on straight. The flange end is pulled away from the skin across its 20 mm width: peel. A small share of the 340 N, concentrated at the end, is all it takes to exceed the 120 N at which a peel front advances. Once it starts, the front runs back until the opening force falls, which on the trial doors happened 60 to 80 mm along.

The calculation is rough, because how much of the load ends up opening the end depends on how the skin flexes. That is why the plant tested rather than calculated, and why the cure is a detail that prevents peel starting, whatever its exact size.

## Cleavage at a bracket

A rigid bracket pried from one edge spreads the opening load over a larger area than a peeling strip does, but not evenly. If the bracket and panel were perfectly rigid, the bondline stress would vary linearly across the bonded height, like the bending stress in a beam, with a maximum at the loaded edge of 6M ÷ (b h²) for a moment M on a bonded area b wide and h high. For the bracket in Chapter 1's exercise, a moment of about 73.6 N·m on a 40 mm wide, 60 mm high foot gives 6 × 73,575 ÷ (40 × 60²) = 3.07 MPa at the top edge, which looks harmless against a strength of 20 MPa or more.

Real brackets and panels are not rigid. A 3 mm bracket foot and a 2 mm panel both bend, so the opening concentrates near the top edge far more than the linear distribution suggests, and the peak there can be several times the rigid estimate. Cleavage therefore behaves somewhere between the rigid case and peel, nearer to peel for thin parts. The practical rules are the same as for peel: make the parts stiff where the opening load enters, extend the bond in the direction of the opening, and add a fixing at the edge.

### Toughness at low temperature

Toughened adhesives owe their peel resistance to the material near the crack tip yielding. At low temperatures the adhesive stiffens and the toughening particles become less effective, so peel strength and impact resistance usually fall. A kiosk on a frosty morning is dropped as easily as one on a summer afternoon. Data sheets that give peel strength at several temperatures show how large the fall is for a given product, and drop or impact tests on bonded parts should include the coldest temperature the part will meet in service or transport.

## The error: a stronger adhesive

After the first drop-test failures, a supplier's representative suggested a different epoxy with a higher lap shear strength, 30 MPa on the data sheet against 25 for the plant's adhesive. If the joint was too weak, a stronger adhesive seemed the obvious answer, and the plant bonded a batch of doors with it.

The drop test was worse. Four of six doors had stiffeners peel at their ends, against two of six before, and the separations ran farther. The higher-strength adhesive was less toughened. Its data sheet, read further down, gave a T-peel strength of 1.5 N/mm against the original's 6.

```figure
type: compare
title: Two epoxies for the stiffeners
rowhead: Property
cols: Original toughened epoxy | Higher-strength epoxy
caption: This is an illustration. Data-sheet values on the suppliers' own coupons, and Plant K's drop test on six doors each. Shear strength did not predict the drop result; peel strength did.
- Lap shear strength, data sheet | 25 MPa | 30 MPa
- * T-peel strength, data sheet | 6 N/mm | 1.5 N/mm
- Doors with a stiffener end peeled in the drop test | 2 of 6 | 4 of 6
- Typical length of separation | 60 to 80 mm | 100 to 180 mm
```

The error was to treat strength as a single property. Shear strength measures resistance to one loading; peel strength and toughness measure resistance to another. A joint that fails in peel needs either a tougher adhesive or a shape that removes the peel, and a stronger, more brittle adhesive provides neither. The plant returned to the toughened epoxy and turned to the ends.

## Designing the ends

Peel starts at an edge, so the cure lies in what the edge looks like. Four details are widely used, separately or together.

```figure
type: checklist
title: End details that resist peel at the end of a bonded stiffener or strap
caption: Each detail lowers the stiffness change or the opening force at the end, where shear lag and bending both concentrate stress. A mechanical fixing near the end also holds the joint if peel starts.
- x Taper the end of the stiffer part | a chamfered or thinned end makes the stiffness change gradual
- x Leave a fillet of adhesive at the end | a spew fillet lowers the peak stresses at the edge
- x Cut the flange end to a point or a radius in plan | the peel front starts narrow and grows gradually
- x Add a rivet or spot fixing near each end | rivet-bonding stops peel starting and holds parts during cure
- ? Keep the flange end away from where the panel flexes most | change the layout if possible
```

Plant K changed its stiffener drawing so that each flange ended in a 45° taper in plan over its last 30 mm, and its procedure so that a continuous fillet of squeezed-out adhesive was left at the flange ends rather than wiped away. It then added one blind rivet through each flange, 15 mm from its end, set after the adhesive was applied so that it also clamped the bondline during cure. The rivet head sits on the inside face; the outer face of the door is untouched.

```figure
type: compare
title: Plant K's drop tests with different stiffener end details
rowhead: End detail
cols: Doors tested | Doors with an end peeled | Comment
caption: This is an illustration. The same drop height and toughened epoxy throughout. The tapered ends with fillets helped; the rivet near each end stopped peel starting in every test.
- Square end, fillet wiped off | 6 | 2 | separations of 60 to 80 mm
- Tapered end with fillet | 6 | 1 | separation of about 20 mm
- * Tapered end, fillet and one rivet per flange end | 12 | 0 | no separations
```

The rivets cost about 30 seconds and a few cents each, twelve per door, a small fraction of the 36 studs they replaced, and they leave no mark on the outer face.

### Other ways to avoid peel

Peel can also be designed out at the layout stage. Brackets can be turned so their load acts along the bondline rather than across it. Bonded areas can be extended in the direction of the opening load to spread cleavage. Joints can be made double-sided, so the load-carrying part is held between two bonded faces and cannot rotate. And where a joint must resist peel, a flexible adhesive with a thick bondline spreads the opening over a wider area, which is the strategy Chapter 8 uses for the window for a different reason.

## How this applies to a small Australian business

Check every bonded joint for the load that opens it, not only the load that slides it. Read the peel strength on an adhesive's data sheet as carefully as its shear strength, and choose a toughened grade when peel or impact is possible. Taper ends, keep fillets and consider a rivet or spot fixing at each end: they cost little and stop the most common bonded-joint failure before it starts. Then prove the details with a drop or impact test on real parts, at the coldest temperature they will meet.

## Exercise: a bonded bracket under a drop

A 2 mm aluminium bracket is bonded to a panel with its 40 mm wide foot, and a 1.5 kg instrument hangs from it. In a drop test the bracket sees a deceleration of 30 g. (a) What is the inertial load on the instrument? (b) If the bracket's geometry turns that load into a peel force at the edge of the foot, will an adhesive with a T-peel strength of 4 N/mm hold? (c) What would you change?

**Worked answer.** (a) The load is 1.5 × 30 × 9.81 = **441 N**. (b) A peel front across the 40 mm foot advances at 4 × 40 = **160 N**, far below 441 N, so the foot would peel. (c) Turn the bracket so the load acts in shear along the bonded foot, enlarge the foot in the direction of the opening load, use a toughened adhesive with a higher peel strength, and add a rivet or screw near the edge where peel would start. Then confirm with a drop test, because the conversion of the load into peel depends on the bracket's stiffness.
