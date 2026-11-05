---
book: metal-casting-by-the-numbers
chapterSlug: gating-filling-the-mould
order: 5
title: "Gating: filling the mould"
description: "Sizing a gating system so the mould fills in time without turbulence: metal velocity from the head, the choke area for a pouring time, gating ratios, gate velocity, and oxide films from fast metal."
draft: false
---

The gating system is the plumbing of a mould: the pouring basin, the sprue that carries metal down, the runner that carries it along, and the gates through which it enters the casting. It has two jobs that pull against each other. It must fill the mould fast enough that the metal does not freeze in the thin walls before the cavity is full. And it must fill it gently enough that the metal does not splash, fold over on itself and trap its own oxide skin and air. Aluminium is especially unforgiving of the second, because its oxide film forms instantly and does not float out.

This chapter sizes GB-12's gating with a BIZOMAT tool, explains why the area at one point, the choke, controls the flow, shows how gating ratios set the velocity at the gates, and works through a gating system copied from an iron job that filled GB-12's castings with oxide.

## Velocity from height

Metal falling down a sprue accelerates like any falling body. Neglecting friction, the velocity at the bottom of a sprue with an effective head h above it is v = √(2gh). With friction, bends and the sprue's entry losses, the real flow is less, which is allowed for with a flow efficiency, or discharge coefficient.

```figure
type: formula
title: Choke area for a pouring time
formula: Velocity at the choke: v = √(2 × g × h)
formula: Choke area: A = W ÷ (ρ × t × C_d × v)
formula: Runner and total gate areas: choke area × the gating ratio for each
caption: The choke is the smallest cross-section in the system, which controls the flow rate; it is usually at the base of the sprue. A simple Bernoulli model with all losses lumped into C_d.
- W | metal poured through the system, casting plus risers plus gating, kg
- ρ | density of the liquid metal, kg/m³
- h | effective metallostatic head above the choke, m
- t | pouring time, s
- C_d | flow efficiency, 0.8 is a common working value
```

The BIZOMAT [Casting gating system choke area](/tools/gating-choke-area/) tool applies these. From the poured mass, liquid density, effective head, pouring time, flow efficiency and the runner and total gate areas as ratios of the choke, it reports the velocity at the choke, the choke area, the equivalent round sprue diameter, the runner area and the total gate area. Its single check compares the velocity at the gates, the choke velocity divided by the gate ratio, with about 0.5 m/s, a level aluminium foundries commonly try to stay below at the gates. Its guide notes that pouring time rules and gating ratios depend on the alloy and casting and should come from foundry practice.

## GB-12's gating

This is an illustration. Each GB-12 mould takes 12.1 kg of metal, including the casting, two risers and the gating itself (Chapters 4 and 7). The liquid alloy's density at pouring temperature is about 2,400 kg/m³, less than the solid's 2,680 because the liquid is hotter and less densely packed. The mould gives an effective head of 150 mm above the base of the sprue. The foundry's pouring time for a casting of this size and wall thickness is 8 seconds, from its own trials of how fast the 6 mm walls must fill. GB-12 uses an unpressurised system, with the choke at the base of the sprue, the runner twice the choke area and the gates four times, a ratio written 1 : 2 : 4.

```figure
type: steps
title: GB-12's gating in the choke area tool
caption: This is an illustration. Poured mass 12.1 kg, liquid density 2,400 kg/m³, effective head 150 mm, pouring time 8 s, flow efficiency 0.8, ratio 1 : 2 : 4.
- Velocity at the choke | √(2 × 9.81 × 0.150) = 1.72 m/s
- * Choke area | 12.1 ÷ (2,400 × 8 × 0.8 × 1.72) = 459 mm²
- Equivalent round sprue diameter at the base | 24.2 mm
- Runner area | 919 mm²
- Total gate area | 1,837 mm², two gates of about 920 mm² each
- Velocity at the gates | 1.72 ÷ 4 = 0.43 m/s, below about 0.5 m/s
```

The flow is about 1.5 kg of metal a second, or 0.63 litres a second. The choke controls it; everything downstream is larger, so the metal slows as it spreads into the runner and slows again into the gates. A useful habit is to check that figure against what a pourer can actually deliver from a hand ladle: 1.5 kg a second for 8 seconds is a steady, deliberate pour, well within what a trained pourer can hold.

### Pressurised and unpressurised systems

The gating ratio decides where the system runs full and how fast the metal enters the casting.

```figure
type: compare
title: Two kinds of gating ratio
cols: Typical ratio, choke : runner : gates | Where the system is choked | Metal velocity at the gates | Usual use
rowhead: System
- Pressurised | 1 : 0.75 : 0.5, gates smallest | at the gates | high, faster than at the sprue | grey iron and steel, where the oxide is less harmful and a full system keeps air out
- * Unpressurised | 1 : 2 : 4, gates largest | at the sprue base | low, a fraction of the sprue velocity | aluminium and magnesium alloys, whose oxide films damage the casting
caption: The ratios are typical examples of each family, not rules; each foundry settles its own by trial for its alloys and castings.
```

An unpressurised system has a weakness: the larger runner and gates may not run full, and partly full channels can let the metal surge and splash. Good design keeps the runner shallow and wide, places the gates so the metal enters at the bottom of the casting and rises steadily, and often uses a ceramic foam filter at the runner to slow and calm the flow and trap oxide. GB-12's mould has a filter at the base of the sprue, which also adds resistance the foundry has allowed for in its flow efficiency.

### Tapering the sprue

As metal falls down a sprue it speeds up, and a stream that speeds up gets thinner. A parallel sprue lets the falling stream pull away from its walls, drawing air in through the porous sand. The sprue is therefore tapered, narrower at the bottom, so that it stays full. This is an illustration. With 40 mm of metal in the pouring basin above the sprue's top and 150 mm of head at its base, continuity of flow requires the top area to be the choke area times √(150 ÷ 40), or 459 × 1.94 = 889 mm², a diameter of about 33.6 mm, tapering to 24.2 mm at the base.

## Where the metal enters

Gate area is only half the story; gate position is the other half. Metal that enters at the top of a casting falls through the cavity, and a fall of 100 mm alone accelerates it to √(2 × 9.81 × 0.1) = 1.4 m/s, about three times the velocity the gates were sized to give. It hits the bottom of the cavity, splashes and traps oxide, however well the gates were sized. Bottom gating, with the metal entering at the lowest point and rising steadily through the cavity, avoids the fall. GB-12's two gates enter at the lower edge of the cover's joint flange, the lowest point of the casting as it lies in the mould, and the metal rises up the walls to the risers above the boss.

Bottom gating has a cost. The metal that reaches the top of the casting has travelled furthest and is coolest, while the risers, which should be the hottest metal in the mould, are filled last with cool metal. Placing the risers so that metal flows through them on its way, or topping them up from the ladle after the mould is full, helps. These are the trade-offs a foundry settles with trial castings, sections and, increasingly, filling simulation software.

## Keeping the system full

The choke controls the flow only if there is always metal above it. A pourer who lets the pouring basin run nearly empty, or who pours in surges, lets air into the sprue and destroys the careful velocities of the gating design. GB-12's foundry pours from a hand ladle into a basin deep enough to hold a few seconds' flow, and trains its pourers to fill the basin quickly and keep it full until the risers show metal, then stop. The pouring time is checked with a stopwatch on the first moulds of each shift; a time far from 8 seconds means either the pourer or the system has changed.

### Gases from the mould

A mould contains more than air. Resin-bonded sand releases gas as the hot metal burns its binder, and cores, surrounded by metal, release theirs from the inside. That gas must escape through the sand or through vents, not through the metal. GB-12's core has vent passages formed into it and led out through its prints, and the mould is vented above the high points of the cavity. A core that cannot vent can blow gas into the casting as it fills, leaving smooth-walled holes near the core, a defect easily mistaken for shrinkage until it is sectioned (Chapter 8).

## Pouring time: the other side of the balance

The pouring time sets the choke area, and it is a judgement. Too long, and the thin walls cool while the metal creeps across them: the metal fronts meet without fusing, leaving cold laps, or fail to meet at all, leaving misruns. Too short, and the metal must flow faster, increasing the risk of turbulence everywhere. This is an illustration.

```figure
type: compare
title: GB-12's choke for three pouring times, ratio 1 : 2 : 4
cols: Choke area, mm² | Sprue base diameter, mm | Risk
rowhead: Pouring time
- 6 s | 612 | 27.9 | faster filling; more care needed at the gates and in the casting
- * 8 s | 459 | 24.2 | the foundry's trial result for 6 mm walls
- 12 s | 306 | 19.7 | cold laps and misruns in the far walls
caption: This is an illustration. From the choke area tool. The velocity at the choke, 1.72 m/s, is set by the head, not the time; a shorter time needs a larger choke, not faster metal.
```

The choice of 8 seconds came from three trial moulds poured at 6, 8 and 12 seconds and sectioned: the 12-second casting had a cold lap in its far wall, and the 6-second casting showed more oxide in its gate area than the 8-second one.

## The error: an iron gating system on an aluminium casting

This is an illustration. Before the match plate was made, an experienced moulder who had spent most of his career on grey iron cut the gating for GB-12's first moulds by hand. He made the runner and gates the same size, a ratio of 1 : 2 : 2, which had always worked for iron.

The castings filled well and looked good. But when the first machined covers were pressure tested, a quarter of them leaked through their walls, and sections showed thin, crumpled, dark films running through the metal near the gates: oxide films folded into the casting by turbulent flow.

The choke area tool showed why. With gates only twice the choke area, the velocity at the gates was 1.72 ÷ 2 = 0.86 m/s, twice that of the 1 : 2 : 4 system and well above the 0.5 m/s the foundry aimed for, and the tool's gate velocity check flagged it.

```figure
type: compare
title: GB-12's gating at two ratios
cols: Total gate area, mm² | Velocity at the gates, m/s | Tool check | Outcome
rowhead: Ratio
- 1 : 2 : 2, cut by hand from iron practice | 919 | 0.86 | warning | oxide films near the gates; a quarter of covers leaked
- * 1 : 2 : 4, the foundry's aluminium practice | 1,837 | 0.43 | pass | no leakers in the next 200 covers
caption: This is an illustration. Same choke of 459 mm² and pouring time of 8 s. Fast metal at the gates jets into the mould, breaks its own surface and folds the oxide skin into the casting.
```

The foundry's metallurgist explained the mechanism. Liquid aluminium is always covered by a thin film of oxide. When the metal flows gently, the film stays on its surface and is pushed ahead of it. When the metal jets or splashes, the surface folds over onto itself, and two layers of oxide come together dry side to dry side, trapping a thin layer of air between them. That double film, which does not float out because it is nearly as dense as the metal, becomes a crack-like defect inside the casting, and a path for leaks. The gating was recut to 1 : 2 : 4 with a filter, and the match plate was made to the corrected design. The moulder's iron experience was not wrong; it was the right practice for a different metal. Iron's oxide is liquid at its pouring temperature and largely floats out, and a pressurised system that keeps the channels full suits it. The lesson the foundry recorded was that gating practice belongs to the alloy, and that every new job's gating is checked with the tool's gate velocity, whoever cuts it.

## The gating's share of the metal

Every kilogram in the sprue, runner and gates is melted, poured and then cut off and remelted. This is an illustration. GB-12's gating weighs about 1.34 kg, a fifth of the casting's mass (Chapter 7). With the risers it brings the casting yield down to 55%. A foundry trying to improve yield is tempted to shrink the gating, but the areas are set by the flow and the velocity limits, and cutting them below those values trades a few hundred grams of returns for oxide defects, as the error above showed. Shorter runners, gates placed closer to the sprue, and a sprue no taller than the head requires reduce the metal in the system without raising its velocities.

## Checking a gating design

A gating calculation is a starting point, and the foundry proves it three ways before production. Trial moulds are poured and timed, to confirm the 8-second fill. Sections are cut through the gate area and the far walls of trial castings and examined for oxide films, cold laps and porosity. And a number of castings are X-rayed or pressure tested before the pattern is released for production (Chapter 10). Casting simulation software, which models the flow and the freezing of the metal in the mould, can show the filling sequence and flag jetting or late-filling areas before any metal is poured; the foundry uses it on new jobs and checks its predictions against the first sections.

## Exercise: a heavier variant

This is an illustration. A larger version of the cover, GB-16, needs 18.0 kg poured, with the same 150 mm head, 0.8 flow efficiency and a 10-second pouring time, at 1 : 2 : 4.

1. What are the choke area and sprue base diameter?
2. What are the runner and total gate areas, and the velocity at the gates?
3. What would the velocity at the gates be if the ratio were cut to 1 : 2 : 3 to save metal in the gating?

**Worked answer.**

1. A = 18.0 ÷ (2,400 × 10 × 0.8 × 1.715) = 0.000547 m² = **547 mm²**; diameter √(4 × 547 ÷ π) = **26.4 mm**.
2. Runner **1,093 mm²**; total gates **2,187 mm²**; gate velocity 1.715 ÷ 4 = **0.43 m/s**, the same as GB-12, because the velocity depends on the head and the ratio, not the casting's size.
3. 1.715 ÷ 3 = **0.57 m/s**, above the 0.5 m/s aim. The metal saved in smaller gates would be paid for in oxide risk; a better saving is a shorter runner.
