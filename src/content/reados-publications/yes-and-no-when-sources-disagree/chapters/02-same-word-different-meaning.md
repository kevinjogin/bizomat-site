---
book: yes-and-no-when-sources-disagree
chapterSlug: same-word-different-meaning
order: 2
title: "Same word, different meaning: torque, pressure and other loaded terms"
description: "Many conflicts between sources disappear once each word is defined. How to find the hidden conditions behind terms such as torque, pressure and stress, and write them into the instruction."
draft: false
---

The most common reason two good sources disagree is that they are not talking about the same thing. They use the same word, "torque", "pressure", "rating", "stress", and attach a different condition to it, usually without saying so. Once the condition is written down, the conflict often disappears.

Abelard put this explanation near the top of his list. His prologue points out that unfamiliar usage gets in the way of understanding, and that a single word can carry different meanings for different writers. Later readers singled this out as the most important of his rules for reconciling authorities. It is also the most important rule for engineers, because technical words are compressed. A number on a data sheet sits on top of a stack of assumptions, and the word beside it is the only clue to which stack.

## Two torque values, one preload

In the planner's register from Chapter 1, the site torque card (S1) gives 226 N·m for an M16 8.8 bolt and the gasket maker's sheet (S2) gives 135 N·m. As torque values they differ by 91 N·m, or 40% of the larger figure. Converted to preload in Chapter 1, they agreed to within half a kilonewton. The question is whether that agreement is real or an artefact of the assumptions made in the conversion.

The planner checks both meanings at their source.

- **S1.** The reliability engineer who made the card left a calculation sheet in the maintenance system. It shows the card was built from the torque–preload relation at 75% of proof load, for bolts "as supplied, plain finish, no lubricant", with a nut factor of 0.20. So S1's "torque" means **torque on dry threads**.
- **S2.** The gasket maker's sheet states that its values assume threads and nut faces coated with the anti-seize compound it supplies, and that the target is a stated share of the bolt's proof load. Its own note gives the compound's nut factor on steel as about 0.12. So S2's "torque" means **torque on lubricated threads and nut faces**.

With those meanings fixed, the [bolt torque and preload tool](/tools/bolt-torque-preload/) can be run in the direction each author used it. For a target of 75% of proof load, the tool gives 225.6 N·m at K = 0.20 and 135.4 N·m at K = 0.12, both for a preload of 70.5 kN in an M16 × 2 bolt with a proof stress of 600 MPa.

```figure
type: formula
title: Why two torque values can describe the same joint
formula: T = K × F × d
caption: This is an illustration. T is tightening torque (N·m), K the nut factor, F the bolt preload (N) and d the nominal diameter (m). For F = 70,500 N and d = 0.016 m, K = 0.20 gives 225.6 N·m and K = 0.12 gives 135.4 N·m. Both sources specify the same preload through different friction.
- T | tightening torque
- K | nut factor, set by thread and nut-face friction
- F | bolt preload, the quantity the joint needs
- d | nominal bolt diameter
```

S1 and S2 are therefore compatible. They are two instructions for reaching the same preload, each correct under its own friction condition. The disagreement in the register was a disagreement in wording.

## The failure case: mixing the meanings

Compatible sources become dangerous when their conditions are separated from their numbers. That is exactly what happens on many jobs.

Suppose the work pack says "Lubricate threads and nut faces (gasket maker's instruction). Tighten to 226 N·m (site torque card)." Each sentence comes from a correct source. Together they describe a tightening that neither source intended.

The bolt torque and preload tool, run the other way with T = 226 N·m and K = 0.12, gives a preload of **117.7 kN**, which is **125.2% of the 94.0 kN proof load**, and a bolt stress of 751 MPa. The bolts would yield during tightening. Some would neck and break; others would survive with permanent stretch and an unknown, reduced preload.

The reverse mix is less dramatic but still a fault. Dry threads tightened to the lubricated figure of 135 N·m give F = 135,000 ÷ (0.20 × 16) = **42.2 kN**, about 45% of proof load. That is less than two-thirds of the intended preload, and the joint may weep under pressure once the gasket relaxes.

```figure
type: compare
title: What happens when a torque value loses its condition
cols: Preload | Share of proof load | Likely result
caption: This is an illustration. Results from the bolt torque and preload tool for an M16 8.8 bolt with a proof load of 94.0 kN. The two mixed cases come from pairing a number with the other source's friction condition.
- 226 N·m, dry, as S1 intends | 70.6 kN | 75% | Intended preload
- 135 N·m, lubricated, as S2 intends | 70.3 kN | 75% | Intended preload
- *226 N·m on lubricated threads | 117.7 kN | 125% | Bolts yield or break
- 135 N·m on dry threads | 42.2 kN | 45% | Low clamp; leak risk after relaxation
```

### How the error is detected

A mixed meaning rarely announces itself on paper. On the job it shows up in a few recognisable ways:

- the wrench keeps turning while the torque reading barely rises, which is a sign of a bolt yielding;
- a bolt breaks at the wrench, or a nut runs on freely after reaching what should have been the final pass;
- an audit of bolt stretch, as in Chapter 6, gives preloads well away from the target;
- later, a joint leaks even though every bolt was "tightened to spec".

The earlier and cheaper detection is in the planning office. When an instruction contains a number from one source and a condition from another, flag it. A torque value has no meaning without its friction condition, so the work pack must state them together.

### How it is corrected

The planner rewrites the instruction so that the number and its condition cannot be separated:

> Steel-to-steel joints J2 and J3: coat threads and nut faces with compound C (gasket maker's specified anti-seize). Tighten to 135 N·m in the sequence on sheet 2. Do not use the site torque card value on lubricated bolts.

She also annotates the site torque card. It now reads "226 N·m: dry, plain bolts only; for lubricated bolts see the job instruction". That does not change the card's number, which was correct for its meaning. It makes the meaning visible.

## Other words that carry hidden conditions

Torque is not the only loaded word in the planner's documents. Each of the following appeared somewhere in the register or its supporting papers, and each has more than one meaning in common use.

```figure
type: checklist
title: Words to define before comparing two sources
caption: This is an illustration. Each word has caught out a comparison in the case or its supporting documents. The question-marked item was still open when the planner moved to Chapter 3.
- x Torque | dry or lubricated; tightening, check or breakaway torque; on the nut or the bolt head
- x Pressure | gauge or absolute; design, operating, test or relief setting
- x Rating | at which temperature, for which fluid, for which gasket
- x M16 | coarse 2 mm or fine 1.5 mm pitch; stress area differs by about 7%
- x Gasket stress | over the full gasket or over the raised-face contact area
- ? 23 on the drawing | which unit
```

A few deserve a closer look because they recur across engineering work.

**Pressure.** A hose rated at "16 bar" may mean 16 bar gauge, 16 bar absolute or 16 bar at 20 °C only. The difference between gauge and absolute is about one bar, small for a high-pressure system but not for a low one. The difference between a rating at 20 °C and one at operating temperature can be much larger for polymers and some gaskets.

**Thread designation.** "M16" without a pitch normally means the coarse 2 mm thread, but fine-pitch M16 × 1.5 bolts exist. Their tensile stress area is 167.25 mm² against 156.67 mm² for the coarse thread, so the same preload gives a stress of 422 MPa rather than 450 MPa. The torque–preload relation used here depends on diameter and nut factor, not pitch, but a stress or proof-load check does depend on pitch. If a source says M16, confirm which.

**Pump flange.** The pump manual's limit in S5 applies to "the pump's own flanges". The fitters read that as the flange cast on the pump casing, and some assumed the spool side of joint J1 could be tightened to the spool's value. But the bolts in J1 pass through both flanges and clamp them together with the same force, so a limit on one flange is a limit on the whole joint. The planner records S5's scope as "joint J1, all eight bolts", which is what the pump maker confirms when asked. The meaning of a scope word can matter as much as the meaning of a number.

**Check torque.** Some plants audit tightened joints by applying a wrench and reading the torque at which the nut first moves. That breakaway torque is usually higher than the tightening torque, because static friction exceeds sliding friction. A "check torque" figure in an audit report is a different quantity from a "tightening torque" figure in a work instruction, even though both are in N·m.

## Make definitions part of the register

The register from Chapter 1 had a column for stated conditions. After this chapter, it gains a second column for **conditions found**, the meaning established by going back to the source's author or supporting documents. The planner's S1 and S2 lines now read:

- S1, 226 N·m. Conditions stated: none. Conditions found: dry, plain finish, K = 0.20, 75% of proof load, from the card's calculation sheet. Status: compatible with S2.
- S2, 135 N·m. Conditions stated: lubricated with compound C. Conditions found: K about 0.12 from the maker's note, 75% of proof load. Status: compatible with S1.

### Ask the author, not the reader

When a meaning is not written down, the next best evidence is the author's own answer. The planner contacts the gasket maker's technical line and the reliability engineer who left the card, rather than asking colleagues how they read the documents. Colleagues can only report their own interpretation, which may be the very assumption that caused the conflict.

Useful questions are specific and closed, so the answer can go straight into the register:

- What friction condition does the value assume: dry, oiled, or a named compound?
- Is the value a target, a minimum or a maximum?
- Which share of proof load, or which gasket stress, was it calculated for?
- Is it the final-pass torque, or the torque for each pass?
- Which bolt grade, size, pitch and finish does it cover?

Record who answered, when, and in what form. A written reply is a source; a phone call is a lead until it is confirmed in writing.

## Write the definitions into the work pack

Settling the meaning in the register is not enough. The fitters read the work pack, not the register, so the definitions have to travel with the number. The planner adds a short definitions block to the instruction for J2 and J3:

- **Torque** means the final-pass tightening torque applied to the nut with a calibrated click-type wrench, not a check or breakaway torque.
- **Lubricated** means compound C applied to the bolt threads and to the nut's bearing face. Dry threads, oiled threads or a different compound do not meet the instruction.
- **Passes** means tightening in the cross pattern shown on sheet 2 at 30%, 60% and 100% of the final torque, followed by one full circular pass at 100%.

For the 135 N·m target, the pass torques are 0.30 × 135 = **40.5 N·m**, 0.60 × 135 = **81 N·m** and **135 N·m**. Writing them out removes another opportunity for someone to supply their own meaning, for example by reading "30%" as 30% of the dry torque from the card.

The definitions block takes a few lines and prevents the failure case above. It also helps the next person who compares this instruction with another source, because the conditions are already written down.

There is a limit to this step. A meaning can be found only if the source records it somewhere. When a document offers a number with no conditions and no traceable author, the honest register entry is "meaning not established". The number may still be correct, but it cannot be relied on until its meaning is known.

### Why authors leave conditions out

It helps to understand why sources omit conditions, because it tells you where to look for them.

- **The condition was obvious to the author.** The engineer who made the torque card worked in a plant where bolts were never lubricated, so "dry" went without saying.
- **The condition is in another part of the document.** The gasket sheet's lubricant note was in a footnote on the following page.
- **The condition is in a standard or company procedure the author assumed you had.** A drawing note may rely on a general note or a referenced specification.
- **The number was copied and the condition was not.** This is the subject of Chapter 3.

In each case the remedy is the same: go back to the fuller source before treating the number as a claim.

## Exercise: the gasket's maximum stress

The gasket maker's sheet also states a maximum gasket stress of 100 MPa. The planner checks it for the worst mixed-meaning case above, 226 N·m on lubricated bolts, by dividing the total preload of eight bolts by the gasket's area. The gasket is 115 mm inside diameter and 162 mm outside diameter. The flanges' raised faces are 158 mm across (this is an illustration). Does the gasket survive?

**Worked answer.** Total preload is 8 × 117.7 kN = **941.7 kN** (using the unrounded 117.71 kN per bolt from the tool).

Over the full gasket, the area is π/4 × (162² − 115²) = **10,225 mm²**, so the stress is 941,700 ÷ 10,225 = **92.1 MPa**, under the 100 MPa maximum.

But the gasket is only clamped where it meets the raised faces. Over the contact area, π/4 × (158² − 115²) = **9,220 mm²**, the stress is 941,700 ÷ 9,220 = **102.1 MPa**, over the maximum.

The answer depends on the meaning of "gasket stress". The gasket maker's sheet defines it over the contact area, so the gasket would be overstressed as well as the bolts. The full-area calculation would have hidden the problem. For the intended preload of 70.5 kN per bolt, 564.0 kN in total, the contact-area stress is 61.2 MPa, well inside the limit. The lesson is the chapter's lesson: before comparing a number with a limit, confirm that both use the same definition.
