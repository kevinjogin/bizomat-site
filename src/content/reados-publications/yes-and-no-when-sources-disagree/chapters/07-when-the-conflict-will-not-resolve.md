---
book: yes-and-no-when-sources-disagree
chapterSlug: when-the-conflict-will-not-resolve
order: 7
title: "When the conflict will not resolve: authority, consequence and changing the question"
description: "Some conflicts survive every check. How to weigh each authority within its own scope, compare consequences, avoid splitting the difference, and change the design so both requirements can be met."
draft: false
---

Most of the conflicts in the planner's register dissolved once they were examined. Two torque values meant the same preload. A drawing note had lost its unit and been withdrawn. A spreadsheet's number came from a different bolt grade. A design calculation gave a minimum, not a target. One conflict did not dissolve, because it was never a misunderstanding in the first place.

*Sic et non* deliberately left its questions open. Abelard compiled opposed authorities and gave readers principles for reconciling them, but in the body of the work he did not settle the questions himself; scholars have read it as a set of exercises for students. Engineering does not have that luxury. The work pack has to say something, and the fitters will tighten the bolts on Thursday. This chapter covers what to do when a real conflict between two good sources survives every test in Chapters 2 to 6.

## The conflict at joint J1

Joint J1 connects the spool to the pump's grey cast iron discharge flange. Two primary sources set limits on it:

- **The pump maker (S5)** says bolts on the pump's own flanges must not be tightened above 110 N·m with clean, dry threads. The [bolt torque and preload tool](/tools/bolt-torque-preload/) converts that to **34.4 kN per bolt** at K = 0.20. The pump maker confirms in writing that the limit is meant to restrict bolt load on the casing to about 34 kN per bolt, and that it was expressed as a dry torque for simplicity.
- **The gasket maker (S2)** gives a minimum assembly stress of 40 MPa over the contact area for the specified compressed-fibre gasket, gasket A. Over the 9,220 mm² contact area, divided among eight bolts, that is **46.1 kN per bolt**.

For J1, the ceiling is below the floor. No tightening value can satisfy both. Every earlier explanation has been tested: the meanings are clear and confirmed by both makers, neither document is a copy or a withdrawn revision, both are primary sources for their own products, the conditions are the same joint at the same state, and no measurement is involved yet.

## Weigh each authority within its scope

The first instinct in a conflict between authorities is to ask which one is more authoritative overall. That is the wrong question. Each maker is the best authority on its own product and has no special authority on the other's. The pump maker knows its casing; the gasket maker knows its gasket. Neither knows the combination.

A more useful question is: **what happens if each requirement is broken?**

- Break the pump maker's ceiling, and the grey iron flange may crack, either at assembly or later under thermal and pressure cycling. A cracked discharge flange releases hot water at pressure, which can injure anyone nearby, and puts the pump out of service until the casing is replaced.
- Break the gasket maker's floor, and the joint may weep or leak, most likely at start-up or after the gasket relaxes. A small leak of hot water is a hazard too, but usually a detectable, slower one, and the remedy is a joint remake rather than a casing replacement.

The consequences are not symmetrical. Breaking the ceiling risks a sudden, possibly injurious failure of an expensive part. Breaking the floor risks a slower, more detectable failure of an inexpensive one. That asymmetry gives the pump maker's limit the status of a **hard constraint** for this job. The gasket maker's floor is still a real requirement, but it becomes the problem to solve rather than the rule that wins.

The plant scores both outcomes with the [risk rating tool](/tools/risk-score/), which multiplies a likelihood rating by a consequence rating, each on a 1 to 5 scale, and reports a band. The plant's own descriptors set the scales. Tightening J1 to gasket A's floor, above the pump maker's limit, is rated likelihood 3 and consequence 4, a score of **12/25, medium**. The tool's guidance for that band is to mitigate and assign an owner, which is what the rest of this chapter does.

## The failure case: splitting the difference

A common response to two incompatible limits is to compromise. The ceiling corresponds to 110 N·m dry, and the gasket floor to about 147.5 N·m dry, so why not specify something in between, say 128 N·m?

The bolt torque and preload tool answers that directly. At 128 N·m and K = 0.20, each bolt carries **40.0 kN**. That is 16% above the pump maker's limit of 34.4 kN and 13% below the gasket maker's floor of 46.1 kN. The compromise breaks both requirements at once. It exposes the casing to the load its maker forbade, and still does not seat the gasket properly.

```figure
type: decision
title: Options considered for joint J1
caption: This is an illustration. Loads per bolt from the bolt torque and preload tool. Only the last option meets both makers' requirements, because it changes the gasket rather than the torque.
- Gasket A at its floor, about 147.5 N·m dry, 46.1 kN | Exceeds the pump maker's limit by about a third | Rejected
- Split the difference, 128 N·m dry, 40.0 kN | Above the pump limit and below the gasket floor | Rejected
- Pump limit with gasket A, 110 N·m dry, 34.4 kN | Below gasket A's floor; leak likely | Rejected
- * Change to gasket B for low bolt loads, 55 N·m lubricated, about 28.7 kN, stretch-checked | Inside both limits with margin for scatter and temperature | Adopted
```

Splitting the difference feels fair because it treats both sources equally. But the sources do not set preferences; they set limits. A value between two limits that do not overlap is outside both. The same reasoning applies to averaging tolerances, design loads or test results from incompatible sources: the average describes no condition that either source would accept.

### How the error is detected

The compromise is caught by the same check that has worked throughout the book: convert the proposed value into the quantity both sources talk about, and place it against both limits. If it falls outside either one, it is not a compromise but a double violation.

## Change the question

When two limits cannot both be met, the useful move is to change something that sets one of them. The pump casing is fixed; the plant is not going to replace a serviceable pump to raise its flange limit. The gasket, however, is a choice.

The planner asks the gasket maker whether it offers a gasket intended for low bolt loads, such as on cast iron or non-metallic flanges. It does: gasket B, a softer material with a minimum assembly stress of 20 MPa and a maximum of 60 MPa over the contact area. For J1's contact area of 9,220 mm² and eight bolts, gasket B's floor is **23.05 kN per bolt**, and its maximum is far above anything J1 will see.

The new window for J1 is therefore 23.05 kN to 34.38 kN per bolt. The floor is now below the ceiling. The question has changed from "which maker should we disobey?" to "can we tighten reliably inside a window both makers accept?"

Before relying on gasket B, the planner checks that it still satisfies the code bolt-load method. With gasket factors of m = 2 and y = 11 MPa, invented for this illustration, the [gasketed flange bolt load tool](/tools/flange-bolt-load-check/) gives a seating bolt load of 43.1 kN in total, **5.39 kN per bolt**, and an operating bolt load of 32.2 kN. The bolting is adequate, and the code minimum is far below the new floor.

## Fit the tightening method to the window

A window is only useful if the tightening method can hit it. The ratio of J1's ceiling to its floor is 34.38 ÷ 23.05 = **1.49**. Torque tightening scatters, mainly because the nut factor varies from bolt to bolt, so the planner checks two methods against the window.

**Dry threads.** With dry threads, the nut factor might reasonably range from 0.15 to 0.25. Aiming for the middle of the window, about 28.5 kN, needs 91.2 N·m at K = 0.20. Across the range of nut factors, that torque would give **22.8 to 38.0 kN**: below the floor at one end and above the ceiling at the other. Dry torque tightening cannot hold this window.

**Lubricated threads and nut faces, controlled.** With compound C, applied as the instruction now defines it and confirmed by stretch measurement on the steel joints in Chapter 6, the nut factor is much more consistent. The planner assumes ±10% around 0.12, that is 0.108 to 0.132. At **55 N·m**, the tool gives a nominal preload of **28.65 kN**, 30.5% of proof load, and across the range of nut factors **26.0 to 31.8 kN**. Both ends are inside the window.

The temperature check from Chapter 5 completes the picture. The grey iron flange loses about 1.58 kN of preload between assembly and operating temperature, whatever the starting value. Hot, the range becomes **24.5 to 30.3 kN**, still above the gasket floor of 23.05 kN.

```figure
type: range
title: Preload per bolt at J1 against the window both makers accept
min: 20
max: 40
unit: kN
ticks: 20 | 25 | 30 | 35 | 40
caption: This is an illustration. Window from gasket B's floor (23.05 kN) to the pump maker's ceiling (34.38 kN). Dry torque scatter spills out at both ends; controlled lubricated tightening stays inside, cold and hot.
- Window accepted by both makers | 23.05 | 34.38
- Dry, 91.2 N·m, K from 0.15 to 0.25 | 22.8 | 38.0
- * Lubricated, 55 N·m, K from 0.108 to 0.132 | 26.0 | 31.8
- Lubricated, at 85 °C, after a 1.58 kN loss | 24.5 | 30.3
```

Because the window is narrow, the planner adds a verification step: every bolt on J1 has its stretch measured after tightening, against an acceptance band of 23.1 kN to 34.3 kN, slightly inside the window. This is the Chapter 6 lesson put to work: where the margin is small, measure the quantity that matters rather than trusting the torque.

## Record the decision and its residual risk

With the gasket changed, the method fitted to the window and verification added, the plant re-rates the risk. A leak is now unlikely, since the gasket floor is met with margin, and its consequence is limited to a detectable weep at a joint that can be remade. The plant rates likelihood 2 and consequence 3; the risk rating tool gives **6/25, low**, with the guidance to accept and monitor. The flange-cracking risk is controlled by keeping every bolt below the pump maker's limit, confirmed by measurement.

```figure
type: compare
title: Risk at joint J1 before and after changing the question
cols: Likelihood | Consequence | Score and band
caption: This is an illustration. Scores from the risk rating tool on the plant's own 1 to 5 scales. The score falls because the gasket change removes the need to exceed the casing limit, not because the ratings were adjusted.
- Gasket A tightened to its floor, above the pump limit | 3 | 4: casing crack, hot water release | 12/25, medium
- *Gasket B, 55 N·m lubricated, every bolt measured | 2 | 3: detectable weep, joint remake | 6/25, low
```

A risk score is only as good as the reasoning behind each rating, and it is easy to lower a score by talking the ratings down. The test of an honest reduction is whether something physical changed. Here it did: the casing is no longer asked to carry more than its maker allows, and the gasket is no longer asked to seal with less than its maker requires. If the only change between two scores is a different opinion, the register should say so.

Australian work health and safety law expects risks to be eliminated or, where that is not reasonably practicable, minimised, and Safe Work Australia's model code on managing work health and safety risks sets out a process of identifying hazards, assessing risks, controlling them and reviewing the controls. The decision record for J1 follows that pattern, in the plant's own words:

- **Conflict.** Pump maker's ceiling of 34.4 kN per bolt below gasket A's floor of 46.1 kN per bolt.
- **Decision.** Change J1 to gasket B; tighten to 55 N·m with compound C on threads and nut faces; measure every bolt's stretch.
- **Basis.** Pump maker's written confirmation of the limit's meaning; gasket maker's data for gasket B; tool calculations recorded; window and scatter check.
- **Residual risk.** Rated 6/25 after controls. Gasket B costs A$41.80 including GST (A$38.00 plus A$3.80 GST), against A$24.20 including GST for gasket A. This is an illustration.
- **Approved by.** The plant's responsible engineer, under its procedure for technical deviations.
- **Review.** Inspect J1 for weeping at first start-up and after one month.

A decision record like this is not paperwork for its own sake. It is the only place where the reasoning survives. Without it, the next planner will find two documents that contradict a work pack and will have to repeat the whole investigation, or will simply follow one of them.

## Who should decide

The planner does not make the final decision alone, and neither should anyone facing an unresolved conflict that affects safety. Her role is to bring the register, the tests, the options and the calculations to the person with authority to accept the residual risk. In this case that is the plant's responsible engineer, who signs the deviation. Where a conflict involves pressure equipment registered with a regulator, a design verifier or the equipment's original designer may also need to be involved.

The conflict register makes that decision much easier to take well. The decision-maker is not choosing between five numbers. She is choosing between four clearly described options, three of which demonstrably fail.

## Exercise: a looser nut factor

The compound supplier will only commit to a nut factor of 0.12 ± 15% for this application, rather than ±10%. At 55 N·m, does the tightening still fit J1's window? What would you do about it?

**Worked answer.** With K from 0.102 to 0.138, the bolt torque and preload tool gives preloads from 55,000 ÷ (0.138 × 16) = **24.9 kN** to 55,000 ÷ (0.102 × 16) = **33.7 kN**. Both are inside the window of 23.05 to 34.38 kN. Hot, the lower end falls by 1.58 kN to **23.3 kN**, only about 0.3 kN above the gasket floor.

The method still fits, but with almost no margin at the hot, high-friction end. Since every bolt's stretch is being measured anyway, the practical response is to rely on that measurement: any bolt below the acceptance band is loosened, relubricated and retightened. If repeated bolts fall low, the friction is not as controlled as assumed, and the next step is a torque–tension test of compound C on these bolts to establish the nut factor directly, rather than a higher torque that risks the ceiling.
