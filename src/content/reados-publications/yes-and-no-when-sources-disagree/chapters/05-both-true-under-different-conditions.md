---
book: yes-and-no-when-sources-disagree
chapterSlug: both-true-under-different-conditions
order: 5
title: "Both true under different conditions: minimums, targets, limits and states"
description: "Two sources can both be right if they describe different kinds of limit, different operating states or different temperatures. How to place each claim and test whether the difference matters."
draft: false
---

Abelard's explanations for apparent disagreement were mostly about texts: words, copies, attributions and retractions. Engineers need one more, because engineering statements are always made about something under some condition. A minimum and a target can both be correct. A value for assembly and a value for operation can both be correct. A rating at 20 °C and a rating at 120 °C can both be correct. They only conflict if someone treats them as answers to the same question.

This chapter adds a new source to the planner's register, one that appears to contradict everything agreed so far, and shows how placing each claim on a common scale of conditions resolves it. It then tests two conditions that might matter for the job, test pressure and temperature, and shows how to decide whether a difference in conditions is large enough to change the answer.

## A sixth source: the design calculation

While tracing documents for Chapter 4, the planner finds the spool's original design file. Its calculation sheet, source S6, states: "Required total bolt load 117.5 kN. Bolt load per bolt 14.69 kN. Tightening torque per bolt 47 N·m (K = 0.2)." It is signed by a design engineer and checked by a second.

Set beside the site torque card's 226 N·m, S6 looks like a flat contradiction. Both are dry torques for the same bolts on the same joints, one nearly five times the other. And S6 has the strongest credentials of any source so far: a recorded basis, a signature and a check.

The planner reruns S6's calculation to see what it actually computes. The [gasketed flange bolt load tool](/tools/flange-bolt-load-check/) in BIZOMAT Tools follows the widely used ASME Section VIII Appendix 2 approach. From the design pressure, the gasket reaction diameter G, the effective gasket width b and two gasket factors (m for operation and y for seating), it calculates the hydrostatic end force, the bolt load needed in operation, the bolt load needed to seat the gasket, the required bolt area at an allowable bolt stress, and a torque per bolt from a nut factor. It does not check flange stresses or rotation; its own output says the full code check is still needed.

With the inputs from the design sheet, all of which are invented for this illustration (design pressure 1.0 MPa, G = 145 mm, b = 8.6 mm, m = 3, y = 30 MPa, eight M16 × 2 bolts, allowable bolt stress 200 MPa, K = 0.2), the tool gives:

- hydrostatic end force **16.5 kN**;
- operating bolt load W_m1 **40.0 kN**;
- seating bolt load W_m2 **117.5 kN**, which governs;
- required bolt area 588 mm² against 1,253 mm² provided;
- load per bolt **14.69 kN**, tightening torque **47 N·m** per bolt.

The recomputation matches S6 exactly. The design calculation is not wrong. The question is what it is an answer to.

## Identify what kind of number it is

The code method in S6 exists to size the bolting: to show that the bolts provided have enough area to carry the minimum load needed to seat the gasket and hold the pressure, at an allowable stress well below the bolt's strength. Its output is a **minimum required bolt load for design**. It is not an assembly instruction, and it says nothing about the preload needed to make a particular gasket seal reliably over time.

The gasket maker's sheet answers a different question. Read in full, it gives a minimum assembly stress of 40 MPa and a maximum of 100 MPa, both over the raised-face contact area, which is 9,220 mm² for this gasket and these flanges (Chapter 2). It says the minimum allows for the gasket's typical relaxation at temperatures up to 100 °C. That is an **assembly window** for tightness, with relaxation built in.

And S1 and S2 give an **assembly target**: 75% of the bolt's proof load, a common target for gasketed joints because it leaves margin for torque scatter on both sides.

Each source is placing its number at a different point on the same scale. Converting all of them to load per bolt makes that visible.

```figure
type: bars
title: Five statements about the same bolts, in load per bolt
unit: kN
max: 120
caption: This is an illustration. Code minimum from the gasketed flange bolt load tool; gasket limits from the maker's stresses over the 9,220 mm² contact area, divided by eight bolts; target and proof load from the bolt torque and preload tool. The gasket maximum is above proof load, so proof load is the real ceiling for J2 and J3.
- Code minimum for bolt sizing (S6) | 14.7
- Gasket maker's minimum assembly load | 46.1
- *Assembly target, 75% of proof (S1 and S2) | 70.5
- Bolt proof load | 94.0
- Gasket maker's maximum assembly load | 115.3
```

Read from the bottom up, the five numbers form a consistent picture for joints J2 and J3. The code minimum is far below the gasket maker's minimum, because the code method uses only an effective strip of the gasket, about π × b × G = 3,918 mm², and is designed for bolt sizing rather than tightness. The gasket minimum sits below the target. The target sits below proof load with a margin of 25%. The gasket maximum lies above proof load, so the bolts will yield before the gasket is overloaded. Nothing contradicts anything.

S6 is therefore compatible with S1 and S2. It is a minimum for a different purpose. The register entry reads: "S6, design calculation, 47 N·m. Kind: code minimum bolt load for bolt sizing. Not an assembly value. Status: compatible; confirms bolt area is adequate."

## The failure case: a minimum used as a target

The danger with a design minimum is that it looks like the most rigorous number on file. Suppose a careful supervisor, finding S6, decides that the design calculation must govern and writes 47 N·m into the instruction for J2 and J3.

Each bolt would then carry about 14.7 kN. Spread over the 9,220 mm² contact area, the eight bolts would give a gasket stress of 8 × 14,690 ÷ 9,220 = **12.7 MPa**, less than a third of the gasket maker's minimum of 40 MPa. The joint might hold at assembly, but the gasket would not be compressed enough to seal reliably, and the margin for relaxation would be gone.

### How it would be detected

- **On hydrostatic test**, by weeping at the joint, if the test is held long enough to show it.
- **On start-up**, by weeping once the joint warms and the gasket relaxes, which matches the leak history found in Chapter 3 for a different cause.
- **Before the job**, by placing the value on the scale above and seeing that it lies below the gasket maker's minimum. This is the cheap detection, and the only one that does not involve a leak.

### How it is corrected

The register records S6 as a minimum, not a target, and the work instruction states the target with its source. The planner also adds a line to the design file, cross-referencing the assembly instruction, so that the next person to find S6 sees immediately what kind of number it is.

### State the whole band, not just the target

The scale also shows how to write the instruction so that this kind of confusion cannot recur. A single number invites the reader to guess whether it is a minimum, a target or a maximum. A band answers the question in advance.

For J2 and J3 the planner writes the preload requirement as three numbers, each with its source:

- **floor: 46.1 kN per bolt**, from the gasket maker's minimum assembly stress over the contact area;
- **target: 70.5 kN per bolt**, 75% of proof load, reached with 135 N·m on lubricated threads;
- **ceiling: 84.6 kN per bolt**, 90% of proof load, set by the plant's own rule for reusable bolts rather than by the gasket.

The band is also what a later check is measured against. Chapter 6 compares measured preloads with the target using an acceptance tolerance of ±10%, which is 63.5 kN to 77.6 kN, comfortably inside the floor and ceiling. A bolt outside that tolerance but inside the band is a finding to investigate; a bolt below the floor or above the ceiling must be corrected before the joint is accepted.

## Different states: assembly, test and operation

A joint passes through several states, and a source may be speaking about any one of them. For the spool, the important states are assembly at ambient temperature, the hydrostatic test, and normal operation with hot water.

The planner checks whether the hydrostatic test changes anything. The plant's test is at 1.5 times the design pressure, 1.5 MPa. Rerunning the gasketed flange bolt load tool at 1.5 MPa gives a hydrostatic end force of **24.8 kN** and an operating bolt load W_m1 of **60.0 kN** in total, 7.5 kN per bolt. Seating still governs at 117.5 kN. Against an assembly preload of 70.5 kN per bolt, the test's operating demand of 7.5 kN per bolt is small, about a ninth. The test does not call for a different tightening value.

That matters because one of the fitters had suggested tightening "an extra bit for the test". The calculation shows there is no need, and every extra newton-metre on dry 8.8 bolts already at 75% of proof eats into the margin for scatter.

## Different temperatures: test whether the difference matters

The spool carries cooling water at about 85 °C, and the joints are assembled at about 20 °C, a rise of 65 K. When bolts and clamped parts expand by different amounts, the preload changes. The question is whether it changes enough to matter.

The [bolted joint temperature tool](/tools/bolted-joint-temperature/) calculates the bolt stiffness from the shank and thread lengths in the grip, the stiffness of the clamped parts by the frustum method, and the preload change from the difference in expansion coefficients, multiplied by the temperature change, the grip length and the combined stiffness. It then checks the hot preload against a least clamp force you enter and against the bolt's proof load. It assumes constant moduli and a uniform temperature, and it does not model gasket creep.

For each joint the planner enters a grip of 40 mm with 10 mm of thread in the grip, bolts at 207 GPa and 11.5 µm/m·K, an assembly preload of 75% of proof, a temperature rise of 65 K, and a least clamp force of 46.1 kN per bolt from the gasket minimum.

```figure
type: compare
title: Preload change from 20 °C to 85 °C
cols: Clamped parts | Preload change | Hot preload | Check against 46.1 kN
caption: This is an illustration. Results from the bolted joint temperature tool. The grey iron at J1 expands slightly less than the steel bolts, so the bolts lose a little preload; at the steel joints the change is zero.
- J2 and J3, steel flanges | steel, 207 GPa, 11.5 µm/m·K | 0 kN | 70.5 kN | Holds
- *J1, grey iron pump flange | iron, 100 GPa, 10.5 µm/m·K | −1.58 kN | 68.93 kN | Holds
```

At the steel joints, bolts and flanges expand together and the preload does not change. At J1, the grey iron expands slightly less than the bolts, and the preload falls by 1.58 kN, about 2% of the assembly value. Both results are well within the scatter of torque tightening. Temperature is a real difference in conditions, but for these joints it is not a material one.

That is a useful kind of conclusion. The point of testing a condition is not to prove that it exists, but to find out whether it changes the decision. Here it does not. The tool's own caution is worth repeating, though: it does not include gasket relaxation, which for a fibre gasket is usually the larger effect. The gasket maker's minimum, which allows for relaxation up to 100 °C, is what covers that.

There is one important qualification for J1. The hot preload result assumes J1 could be tightened to 70.5 kN, and S5 says it cannot. The temperature change does not depend on the preload level in this model, so the 1.58 kN loss will apply to whatever value J1 is finally given. That calculation is used again in Chapter 7.

## A checklist of conditions

When two sources disagree, ask in turn whether they differ in any of these conditions. The case touched every one.

```figure
type: checklist
title: Conditions to compare before calling two sources contradictory
caption: This is an illustration. Each condition separated two claims in the case. A difference is only a conflict if, after it is accounted for, the claims still cannot both hold.
- x Kind of limit | minimum, target or maximum; design value or assembly value
- x State | assembly, test, start-up, normal operation, upset
- x Environment | temperature, fluid, pressure; tested and found immaterial here
- x Item | which joint, which flange, which bolt grade
- x Time | new gasket or after relaxation; new bolts or reused
- ? Joint J1 | pump maker's ceiling against the gasket minimum: still open
```

The last line is the only one still open. Placing J1 on the scale shows why. The pump maker's ceiling for J1 is 110 N·m dry, which the bolt torque and preload tool converts to 34.4 kN per bolt. The gasket maker's minimum is 46.1 kN per bolt. For J1, the ceiling is below the floor. No change of meaning, copying, origin or condition removes that. It is a real conflict between two primary sources, each right about its own part, and it is the subject of Chapter 7.

## Exercise: extra tightening for the test

A contractor's supervisor asks whether the bolts on J2 and J3 should be tightened further before the 1.5 MPa hydrostatic test and slackened back afterwards, "to be safe". Using the gasketed flange bolt load tool results above, explain whether this is needed, and state one risk it would introduce.

**Worked answer.** At 1.5 MPa the tool gives an operating bolt load W_m1 of 60.0 kN in total, 7.5 kN per bolt, and a hydrostatic end force of 24.8 kN, or 3.1 kN per bolt. The assembly preload is 70.5 kN per bolt, more than nine times the test's operating demand. The joint does not need more preload for the test.

Tightening further would add risk. The bolts are already at 75% of proof load; extra torque on dry 8.8 bolts eats into the 25% margin that covers torque scatter, and some bolts could yield. Slackening and retightening afterwards would also disturb a gasket that has already been compressed, which can reduce its ability to seal. The register records the question and the answer: "Test at 1.5 MPa: no change to tightening required; W_m1 at test 7.5 kN per bolt against 70.5 kN preload."
