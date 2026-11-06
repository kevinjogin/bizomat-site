---
book: metal-casting-by-the-numbers
chapterSlug: risers-and-feeding
order: 7
title: "Risers and feeding"
description: "Sizing risers that hold enough metal as well as freezing last: feed volume from shrinkage and efficiency, feeding distance, metal poured, yield, and a riser that piped into the casting."
draft: false
---

A riser has two jobs. It must stay liquid longer than the section it feeds, which Chapter 6 checked with the modulus. And it must hold enough spare liquid to make up all the shrinkage of that section as it freezes, while keeping enough metal in itself that its own cavity does not reach down into the casting. A riser can pass the first test and fail the second: it freezes last, as it should, but runs out of metal before the casting has finished drawing on it.

This chapter checks GB-12's risers for volume with a BIZOMAT tool that brings the whole pour together: moduli, feed volume, metal poured, casting yield and gating. It explains feeding efficiency and feeding distance, shows why GB-12 needs two risers, and works through a riser that passed the modulus check but piped into the casting.

## How much metal a riser can give

As a casting section freezes, it shrinks by its solidification shrinkage, a few per cent of its volume. That volume must be supplied by liquid flowing in from the riser. But a riser cannot give up all of its metal: it freezes from its own walls inwards and from its top down, and only the liquid still in its centre can flow out. In a plain cylindrical riser in sand, only a modest fraction of its volume is available to feed the casting, the rest freezing in place around a cavity shaped like an inverted cone, the pipe. That fraction is the riser's feeding efficiency.

```figure
type: formula
title: The feed-volume check for a riser
formula: Feed volume needed: V_feed = V_casting × shrinkage ÷ efficiency
formula: Pass if: V_riser ≥ V_feed
formula: Casting yield: m_casting ÷ (m_casting + m_risers + m_gating)
caption: The shrinkage is the volumetric solidification shrinkage of the region the riser feeds. The efficiency is the fraction of a riser's volume that can flow into the casting; it is low for bare sand risers and higher for insulated or exothermic sleeves.
- V_casting | volume of the region the riser or risers feed, cm³
- shrinkage | solidification shrinkage, as a fraction
- efficiency | riser feeding efficiency, as a fraction
```

The figures for shrinkage and efficiency are the foundry's working values, found from its own castings. For GB-12, it uses 5% solidification shrinkage for the alloy and 15% efficiency for a bare cylindrical riser in its sand.

## The whole pour in one tool

The BIZOMAT [Casting pour plan](/tools/casting-pour-plan/) tool brings the casting's freezing, feeding, gating and pattern together for a gravity sand casting. From the casting's volume, cooling area and density, the mould constant and volumetric shrinkage, it works out the casting modulus and freezing time. From a cylindrical riser's diameter and height, the required modulus ratio and the riser's feeding efficiency, it gives the riser modulus and freezing time, the riser volume and the feed volume the casting needs. From the gating's share of the casting mass, it gives the metal poured and the casting yield. From the pouring time, sprue height and flow efficiency, it gives the choke area and sprue diameter, and finally the pattern dimension and a check of the metal against the ladle capacity. Its three checks are the modulus ratio, the feed volume and the ladle.

```figure
type: compare
title: GB-12 in the casting pour plan tool, one riser and two
cols: Riser volume, cm³ | Feed volume needed, cm³ | Metal poured, kg | Casting yield | Result
rowhead: Risering
- One 90 × 120 mm riser | 763 | 831 | 10.06 | 66.4% | modulus ratio passes; feed volume fails
- * Two 90 × 120 mm risers | 1,527 | 831 | 12.11 | 55.2% | all checks pass
caption: This is an illustration. Casting 2,493 cm³ with 2,600 cm² cooling area, density 2.68 g/cm³, B = 1.6 min/cm², 5% shrinkage, 15% riser efficiency, gating 20% of casting mass, ladle 20 kg. The whole-casting modulus is 0.959 cm; each riser's is 1.895 cm, a ratio of 1.98 to the whole casting.
```

With one riser, the modulus check passes comfortably against the casting as a whole, and against the boss (Chapter 6). But the casting's total shrinkage, 5% of 2,493 cm³ or about 125 cm³, needs 125 ÷ 0.15 = 831 cm³ of bare riser to supply it, and one riser holds only 763 cm³. With two, there is ample metal. The second riser also solves a second problem, feeding distance, below.

The pour plan with two risers gives a metal poured of 12.11 kg and a casting yield of 55.2%, which is where the 12.1 kg and 55% used in Chapters 2 and 4 came from. Of every 12.1 kg poured, 6.68 kg ships in the casting, 4.09 kg is risers and 1.34 kg is gating, all of which returns to the furnace.

```figure
type: stack
title: Where the 12.1 kg poured into each GB-12 mould goes
unit: kg
caption: This is an illustration. From the pour plan with two risers. The risers are the largest share of the returns.
- Casting | 6.68
- Two risers | 4.09
- Sprue, runner and gates | 1.34
```

### A note on the gating figures

The pour plan tool also sizes the choke, using the one density it is given for both the casting's mass and the flowing metal. Entered with the solid density of 2.68 g/cm³, it gives a choke of 412 mm². The gating tool of Chapter 5, given the liquid density of 2,400 kg/m³, gave 459 mm². The difference is simply the density used, and the foundry uses the larger, liquid-density figure for the gating. That kind of discrepancy is worth noticing rather than averaging: two tools agreeing to within 10% on different assumptions is a sign the inputs are consistent, and knowing why they differ shows which to trust.

## Feeding distance

A riser can only feed so far. Liquid flowing from a riser to a distant part of the casting must pass through sections that are themselves freezing, and through the mushy zone of a freezing-range alloy. Beyond a certain distance, the feeding path closes before the far region has finished freezing, and that region ends up with dispersed porosity even though the riser still has metal to spare. Feeding distances depend on the alloy, the section thickness and whether the section ends at an edge, which cools it and helps, and foundries use rules developed from experiments for their own metals.

On GB-12, the boss sits near one end of the 306 mm cover, and the heavy corner of the joint flange at the far end is beyond the reach of a riser on the boss. The second riser sits on that corner. It feeds the flange end, while the first feeds the boss and the walls around it, and between them they cover the whole casting.

```figure
type: checklist
title: Checking a riser layout
caption: The open item is the one that failed in the error below.
- Each region that freezes late has a riser, or is fed through a region that does | Chapter 6's freezing order
- Each riser's modulus at least about 1.2 times its region's | Chapter 6
- ? Total riser volume at least the feed volume for its region | shrinkage ÷ efficiency
- Every point within feeding distance of a riser | the foundry's rule for the alloy and section
- Riser neck large enough not to freeze before the riser | and small enough to break or cut off cleanly
- Metal poured within the ladle's capacity | with a margin for the pourer
```

## Top risers, side risers and necks

A riser placed on top of the section it feeds, open to the air, is a top riser. Gravity drives its metal down into the casting, and atmospheric pressure acts on its surface as the metal is drawn away. A blind or side riser, enclosed in the mould beside the casting, must be designed so that a skin cannot form over its top and seal it: otherwise, as metal is drawn out, a vacuum forms inside it and it stops feeding. Foundries use a small core or a pencil-shaped point in the riser's top to keep it open to the air. GB-12's two risers are both top risers, the simplest arrangement for a casting moulded with its heavy sections uppermost.

The riser joins the casting through a neck. The neck must stay open longer than the section it feeds, or it will cut the riser off early; but the smaller it is, the easier and cheaper the riser is to remove and the less of the casting's surface is disturbed. The foundry sizes its necks by modulus too, between the section's and the riser's, and checks them on the first sections. GB-12's risers are sawn off at their necks after shakeout, and the stubs are ground flush; the riser contact areas on the boss lie on surfaces that are later machined, so the grinding marks disappear.

## Proving the feeding

Calculations predict where the casting will be sound; sections and measurements prove it. For GB-12's trials, five castings were sawn through the boss and the far flange corner, polished lightly and examined for cavities and porosity, and five more were X-rayed. A simple quantitative check was added: the density of a sample cut from the boss, measured by weighing it in air and in water. This is an illustration. A sound sample of GB-12's alloy should be close to 2.68 g/cm³; a sample at 2.66 g/cm³ contains about 1 − 2.66 ÷ 2.68 = 0.75% porosity by volume. The foundry's acceptance limit for the boss, agreed with the customer for the bearing bore, is set on the density of samples from the trial castings, and the check is repeated whenever the pattern, the risers or the alloy change.

## Sleeves, toppings and yield

The 15% efficiency of a bare riser is a large part of why GB-12's yield is only 55%. An insulating or exothermic sleeve, a preformed cylinder of insulating or heat-producing material set around the riser, keeps the riser liquid longer for its size, raising both its effective modulus and the share of its metal it can give up. An insulating or exothermic powder spread on top of the riser after pouring does the same for the riser's top surface, which otherwise radiates heat into the air.

This is an illustration. Two sleeved risers of 75 mm diameter and 90 mm height, which the sleeve supplier's data let the foundry treat as feeding with 30% efficiency, would hold 795 cm³ between them, against a feed volume of 2,493 × 0.05 ÷ 0.30 = 416 cm³. The metal poured would fall to 10.15 kg and the yield would rise to 65.8%. On a run of thousands of castings, that saving in remelting, about 2 kg a casting, would pay for the sleeves. The foundry trialled them on GB-12's second order.

### Yield, returns and the furnace

Yield links the riser design back to the furnace. This is an illustration. At 55% yield, each GB-12 casting sends 5.43 kg of risers and gating back to the furnace; over a shift of 60 castings that is about 326 kg of returns. The 726 kg those castings need takes about five melts, and at Chapter 3's share of 40.8% returns, five 150 kg charges can absorb about 5 × 61.2 = 306 kg. The job makes slightly more returns than it can use, and the surplus grows if the yield falls or the charge is made richer in ingot. The foundry has other jobs in the same alloy that absorb the surplus, but a foundry running one job alone would find its returns piling up, or would have to run a richer ingot to carry more of them. A change of riser design is therefore also a change to the charge plan, the melting plan and the cost of each casting, and it goes back through Chapters 2 and 3 before it is adopted.

## The error: a riser that piped into the casting

This is an illustration. Early in the trial moulds, after the boss riser had been enlarged to 90 × 120 mm to pass the modulus check (Chapter 6), the foundry ran a batch with that single riser, reasoning that a riser large enough to freeze after the boss was large enough for the job.

The castings looked sound until the risers were sawn off. On several, the pipe in the riser ran down through the riser neck and into the top of the boss, leaving a cavity below the cut line. X-rays of others showed scattered shrinkage porosity in the heavy flange corner at the far end of the casting.

The pour plan tool explained both. With one riser, the feed volume check failed: 831 cm³ needed, 763 cm³ available. The riser had frozen last, as designed, but it had run out of metal while the boss and the casting were still drawing on it, so its pipe kept deepening until it reached the casting. And the far flange corner was beyond the boss riser's feeding distance and had no riser of its own.

The mistake was understandable. The modulus check is the more famous of the two, and a riser that passes it feels finished. But modulus answers only "will the riser still be liquid?", not "will it still have metal to give?", and a casting needs both answers to be yes. The foundry added the second riser on the flange corner, confirmed the layout with sections through five trial castings, and added the feed volume check to its riser design sheet beside the modulus check. The yield fell from 66% to 55%, a cost in remelting that the foundry accepted in exchange for castings that passed.

## Exercise: sleeved risers

This is an illustration. Using the sleeved risers described above, two of them, each 75 mm in diameter and 90 mm high, with a feeding efficiency of 30%:

1. What is the feed volume needed, and do the two risers hold enough?
2. What are the risers' mass, the metal poured with gating at 20% of the casting, and the casting yield?
3. How much metal is saved per casting compared with the two bare 90 × 120 mm risers, and over a shift of 60 castings?

**Worked answer.**

1. 2,493 × 0.05 ÷ 0.30 = **416 cm³** needed. Each riser holds π × 7.5² × 9 ÷ 4 = 397.6 cm³, so two hold **795 cm³**: **enough**.
2. Risers 795.2 × 2.68 ÷ 1,000 = **2.13 kg**; poured 6.68 + 2.13 + 1.34 = **10.15 kg**; yield 6.68 ÷ 10.15 = **65.8%**.
3. 12.11 − 10.15 = **1.96 kg** per casting less to melt and remelt; over 60 castings, about **118 kg**, most of a furnace charge. The modulus of the sleeved riser (Chapter 6's exercise, 2.02 cm effective) must also be confirmed by trial castings before the change is made.
