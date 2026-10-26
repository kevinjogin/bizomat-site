---
book: ductwork-by-the-numbers
chapterSlug: branches-and-the-main
order: 3
title: "Branches and the main"
description: "Size a main as branches join it, by flow rather than by adding areas or diameters, shape junctions, see why paths must balance, and catch a main sized by adding diameters that ran at half speed."
draft: false
---

An extraction or ventilation system is a tree. Branches gather air from hoods or deliver it to outlets, and join a main that grows as each branch adds its flow. The main's size at each stage, the way each branch enters it, and the pressure each path needs all have to be worked out together, because air does not divide itself according to the drawing. It divides according to resistance: each branch takes whatever flow its path's resistance allows, and a branch with an easy path takes more than its share while a branch with a hard one starves.

This chapter covers sizing the main as branches join it, the old equal-area rule and its limits, the shape of junctions, and the idea of balance between paths, which Chapters 6 and 10 complete. The running case sizes EX-1's main and finds that its middle section was first sized by adding the branches' diameters, giving a duct that ran at half the transport velocity.

## Sizing the main by flow

Each section of the main carries the sum of the flows upstream of it, and should be sized for that flow at the required velocity, exactly as a branch is. For EX-1, as Chapter 1 found:

- from B1 to N2, **0.30 m³/s** in 140 mm at 19.49 m/s;
- from N2 to N3, **0.60 m³/s** in 200 mm at 19.10 m/s;
- from N3 to the fan, **0.90 m³/s** in 250 mm at 18.33 m/s.

The rule is to size every section from its own flow and the velocity required, not from the sizes of the ducts that feed it.

## The equal-area rule

Older sheet metal practice sized a main so that its area equalled the sum of the areas of the branches feeding it. When every branch runs at the same velocity, that rule gives the main the same velocity too, and it agrees with sizing by flow.

This is an illustration. Two of EX-1's 140 mm branches have a combined area of 2 × 0.01539 = 0.03079 m², which a round duct of **198 mm** matches; three have 0.04618 m², matched by **242.5 mm**. The chosen 200 and 250 mm sections are close to those, because all three branches run at the same velocity.

The rule fails when branches run at different velocities. A branch that has been made smaller to raise its velocity, or one serving a hood with a lower flow, does not contribute area in proportion to its flow, and the equal-area main will run faster or slower than intended. Sizing by flow works in every case; equal area works only in the special case.

```figure
type: compare
title: Three ways to size the main from N2 to N3
cols: Basis | Diameter | Velocity at 0.60 m³/s
caption: This is an illustration. Sizing by flow and by equal area agree here because both branches run at the same velocity; adding diameters is never right.
- *By flow, 18 m/s minimum | 0.60 ÷ 18 = 0.0333 m² | 200 mm chosen | 19.10 m/s
- By equal area | 2 × 0.01539 = 0.0308 m² | 198 mm, so 200 mm | 19.10 m/s
- By adding diameters | 140 + 140 | 280 mm | 9.74 m/s
```

## The error: a main at half speed

This is an illustration. The first layout drawing of EX-1 sized the main from N2 to N3 at **280 mm**, by adding the two 140 mm branches' diameters. The drafter's reasoning was that two pipes joined together make one pipe "twice as big", which is true of their flows and their areas but not of their diameters: area goes as the diameter squared, so a duct of twice the diameter has four times the area.

At 0.60 m³/s in 280 mm, the velocity would have been 0.60 ÷ (π × 0.28² ÷ 4) = **9.74 m/s**, barely half the 18 m/s minimum. Dust from B1 and B2 would have settled along the whole section. The checker's velocity column caught it, as it had caught the branch of Chapter 1, and the section was resized to 200 mm. The general check is quick: a main downstream of two equal branches should have about √2, 1.41 times, their diameter, and downstream of three about √3, 1.73 times. Twice the diameter means four times the area, and is a sign that diameters were added.

```figure
type: bars
title: Main from N2 to N3, velocity by sizing method
unit: m/s
max: 22
caption: This is an illustration at 0.60 m³/s with an 18 m/s minimum.
- *200 mm, by flow or equal area | 19.10
- 280 mm, by adding diameters | 9.74
```

## Junctions

How a branch enters the main affects both its pressure loss and how well the dust is carried. Good practice for extraction systems includes:

- **Angled entries.** A branch that enters at 30° or 45° to the main's flow merges with it smoothly; one that enters at 90° collides with it, which costs pressure and turbulence and wears the opposite wall.
- **Entry from the side or the top**, not the bottom, so that dust does not fall back into the branch when the fan stops.
- **One branch per junction.** Two branches entering at the same point from opposite sides meet head-on, and their combined loss is far higher than if they entered a little apart.
- **The main enlarged at the junction**, with a short taper downstream of each branch rather than a sudden step, as Chapter 7 describes for transitions.

EX-1's B2 and B3 enter the main at 45° from the side, each at its own junction, and the main tapers from 140 to 200 mm just after N2 and from 200 to 250 mm just after N3.

## Paths and balance

Every hood in EX-1 is connected to the fan by a **path**: B1's path runs the whole length of the main; B2's joins it at N2; B3's at N3. At each junction, the two paths that meet there must need the same suction, because they share one point. If one path needs less suction for its design flow than the other, it will draw more than its design flow, and the other will draw less, until their resistances balance at whatever flows result.

This is an illustration, using the pressure losses that Chapters 4 and 5 calculate. At N2, B1's path from its hood needs about **756 Pa** of suction for 0.30 m³/s; B2's shorter path needs only about **571 Pa**. Left as drawn, B2 would take more than 0.30 m³/s and B1 less. At N3, the main's path from B1 and B2 needs about **884 Pa**, and B3's short path only about 571 Pa, a shortfall of about 313 Pa.

```figure
type: compare
title: Suction needed at each junction, by path
cols: Path's need | Other path's need | Shortfall
caption: This is an illustration at design flows, from the losses of Chapters 4 and 5. A branch whose path needs less suction than the main at its junction takes more than its share unless resistance is added.
- N2: B2 against B1 | 571 Pa | 756 Pa | 185 Pa
- *N3: B3 against the main | 571 Pa | 884 Pa | 313 Pa
```

## What happens without balance

The losses in a duct path rise roughly with the square of the flow through it, so a path given more suction than it needs takes more flow, in proportion to the square root of the ratio. This is an illustration, and an approximation, because in reality all the flows shift together until every path balances. If B2 were left unbalanced and saw the 756 Pa that B1's path needs at N2, instead of the 571 Pa its design flow needs, its flow would rise towards 0.30 × √(756 ÷ 571) = about **0.345 m³/s**, some 15% over design. B3, seeing about 884 Pa instead of 571 Pa, would rise towards **0.373 m³/s**, about 24% over.

The extra air in B2 and B3 has to come from somewhere. With the fan delivering roughly its design flow, B1, the furthest hood, gets what is left, and it falls well short of its 0.30 m³/s. The booth with the longest duct, which is often the one that needs the most care, ends up with the weakest extraction. That is the usual result of an unbalanced tree, and it is why commissioning measures every hood, not just the total.

## Balancing by design or by damper

There are two ways to add the missing resistance to B2 and B3.

**Balance by design** makes the short branches smaller, so that their higher velocity raises their losses to match. This is an illustration. Reducing B2 to 125 mm raises its path's need to about 921 Pa, overshooting the 756 Pa it must match; 140 mm gives 571 Pa. Neither standard size balances it closely, and the smaller duct runs at 24.45 m/s, faster than it needs to be, with the extra wear that Chapter 1 described.

**Balance by damper** keeps the branch at 140 mm and adds a fixed resistance: an orifice plate or a locked blast gate sized to absorb the shortfall, 185 Pa in B2 and 313 Pa in B3. Its disadvantage is that the resistance is wasted energy at a single point, and an adjustable damper can be moved by anyone, which is why extraction systems often use fixed orifice plates or dampers locked after commissioning.

EX-1's designer chose fixed orifice plates in B2 and B3, sized from the shortfalls and confirmed at commissioning, as Chapter 10 describes. The fan is then selected for B1's path, the **index path**, the one that needs the most suction, which Chapter 6 adds up.

## Sizing an orifice plate

An orifice plate is a flat plate with a hole smaller than the duct, clamped between two flanges. Its pressure loss depends on the ratio of the hole's area to the duct's and on the velocity, and its size for a given loss comes from the plate's published coefficients or from a recognised design method; this book does not quote those coefficients. In practice the designer calculates a hole size from the shortfall, the plate is made slightly undersize in its bore, and the bore is opened out at commissioning until the measured hood flows match their design, as Chapter 10 shows. A plate sized only by calculation and never checked is a guess with a drawing number.

## Laying out the tree

The layout of a tree affects its balance before any plate is sized. Branches that join near the fan have short paths and tend to take too much air; branches at the far end have long paths and tend to take too little. A layout that keeps branches of similar length, by running the main past the booths rather than starting from one end, needs less correction. Where the layout is fixed by the building, the longest path should be made as easy as possible, with gentle elbows and angled entries, because every pascal saved on the index path is saved at the fan, while a pascal saved on a short branch is simply added back by its orifice plate.

## Why the index path matters

The fan must supply the suction that the hardest path needs at its design flow. Every other path needs less, and is brought up to the same need by its orifice plate or its size. A fan selected for an easier path would leave the hardest one short, and its hood, usually the furthest from the fan, would underperform first. In EX-1, B1 is both the furthest hood and the index path, which is common but not guaranteed: a short branch with a very resistant hood can be the index path instead, and every path should be added up to find out.

## Branches added later

Systems grow, as Chapter 1's fourth booth showed. A branch added to an existing main changes the flows in every section downstream of it, and the balance of every path. The new branch must be sized and balanced, but so must the main downstream of its junction, and the fan's duty rechecked. Adding a branch by cutting a hole and fitting a spigot, without the calculation, takes air from every other hood, often without anyone noticing until a booth fills with fume. The same applies to removing a branch or blanking one off: the air it took is redistributed to the others, and the main downstream of it may fall below its transport velocity, because it now carries less flow in the same size of duct. Blanking B3, for example, would leave the 250 mm main carrying about 0.60 m³/s at only 12.2 m/s, well below the dust's transport velocity.

## Exercise: equal area with unequal branches

Suppose B2 were reduced to 125 mm to balance it by design, still carrying 0.30 m³/s. Size the main from N2 to N3 by equal area, from B1's 140 mm and B2's 125 mm, and by flow at 18 m/s. What velocity does each give at 0.60 m³/s, and which would you use?

**Worked answer.** By equal area, the main's area would be 0.01539 + 0.01227 = 0.02766 m², a diameter of about **187.7 mm**. A main of that area would carry 0.60 m³/s at 0.60 ÷ 0.02766 = **21.7 m/s**, faster than needed, because B2 contributes less area than its share of the flow.

By flow, the main needs at least 0.60 ÷ 18 = 0.0333 m² for 18 m/s, a diameter of no more than **206 mm**, so the **200 mm** section chosen before still works, at 19.10 m/s. The flow method gives the right answer whatever the branches' sizes; the equal-area method gives a smaller, faster main whenever a branch has been reduced, and it should not be used once branches run at different velocities.
