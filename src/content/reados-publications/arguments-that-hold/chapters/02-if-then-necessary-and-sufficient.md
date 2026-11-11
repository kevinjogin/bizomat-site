---
book: arguments-that-hold
chapterSlug: if-then-necessary-and-sufficient
order: 2
title: "If, then: necessary and sufficient conditions in specifications and diagnosis"
description: "How to read and write conditional statements correctly: what follows from if, only if and unless, why a converse is not equivalent, and how treating a necessary condition as sufficient goes wrong."
draft: false
---

Much of engineering is written as conditions. A drawing says a part is acceptable only if its hardness is in range. A procedure says stop the machine if the temperature exceeds a limit. A failure guide says that if a tooth fails by fatigue, the fracture face shows certain features. Each of these is a conditional statement, and each can be misread in a small number of predictable ways.

Abelard spent much of his logical work on conditionals: what makes "if this, then that" true, and what can be inferred from one. The engineering stakes are concrete. Reading "only if" as "if" can accept a non-conforming lot. Reading a converse as equivalent can send an investigation after the wrong cause. This chapter sets out the few rules that matter and applies them to the depot's pinions.

## Sufficient and necessary

A conditional "if A, then B" says that whenever A holds, B holds too. It makes A a **sufficient** condition for B: A is enough to guarantee B. It also makes B a **necessary** condition for A: A cannot hold without B.

Two everyday engineering statements show the difference.

- "If the oil temperature exceeds 80 °C, stop the conveyor." Exceeding 80 °C is sufficient for stopping. It is not necessary: the conveyor may also be stopped for a jam, a guard fault or a planned shutdown.
- "A pinion is acceptable only if its hardness is between 280 and 320 HB." Hardness in range is necessary for acceptance. It is not sufficient: a pinion can be the right hardness and still have the wrong tooth profile.

The words matter. "If A, then B" and "A only if B" say the same thing: A is sufficient for B, and B is necessary for A. "A if B" reverses them: B is sufficient for A. "A if and only if B" says both, making each necessary and sufficient for the other. "A unless B" means "if not B, then A".

## Four statements that look alike

From any conditional, three related statements can be formed. Only one of them is equivalent to the original.

```figure
type: compare
title: A conditional and its three relatives
cols: Form | Equivalent to the original
caption: The contrapositive always has the same truth as the original. The converse and inverse do not, although they are equivalent to each other. Confusing them is the root of most conditional errors.
- Original: if a tooth breaks by bending fatigue, the crack starts at the root | If A, then B | Yes
- Contrapositive: if the crack did not start at the root, it was not bending fatigue | If not B, then not A | Yes
- Converse: if the crack started at the root, it was bending fatigue | If B, then A | No
- *Inverse: if it was not bending fatigue, the crack did not start at the root | If not A, then not B | No
```

The tooth example is deliberately chosen. Suppose the original statement is true for the depot's pinions: bending fatigue cracks start at the root fillet, where the bending stress is highest. Then the contrapositive is also true: a crack that started elsewhere was not bending fatigue. But the converse, "a root crack means bending fatigue", does not follow. Other mechanisms can also start cracks at the root: a single overload, a material defect, a grinding burn, or a notch from a damaged cutter. A root origin is consistent with bending fatigue, but it is not proof of it.

Engineers meet this pattern constantly. "If the bearing is overloaded, it runs hot" does not mean "it runs hot, so it is overloaded". "If the weld is cracked, it will leak on test" does not mean "it did not leak, so it is not cracked". The original and its contrapositive travel together; the converse and the inverse are separate claims needing separate evidence.

## What refutes a conditional

A conditional rule makes a narrow promise, and it is useful to know exactly what would break it. "If A, then B" is false in only one situation: A holds and B does not. Every other combination is consistent with it.

```figure
type: compare
title: Which cases test the rule "if a pinion meets the drawing, it survives two years"
cols: Meets the drawing | Survives two years | What the case shows about the rule
caption: This is an illustration. Only the starred case refutes the rule. Failures of pinions that did not meet the drawing say nothing about it, however many there are.
- Original supplier's pinions | Yes | Yes | Consistent; one more confirming case
- *A conforming pinion that fails early | Yes | No | Refutes the rule
- New supplier's soft pinions that fail | No | No | Says nothing about the rule
- A soft pinion that happens to survive | No | Yes | Says nothing about the rule
```

This matters when evidence is being sorted. At the depot, someone argues that the three failures prove the drawing is inadequate. But all three failed pinions came from the new supplier, and if they did not meet the drawing, their failures do not test the drawing's rule at all. They test a different claim, about what happens to pinions that do not meet it. To test the drawing, the investigation needs pinions that do meet it, in the current duty and alignment, and evidence of whether they survive.

The same reasoning protects against the opposite mistake. A soft pinion that survives ten weeks on C2 does not show that the hardness requirement is unnecessary. It is a case where the condition was not met, so it cannot refute a rule about cases where it was. It may be weak evidence for some other claim, such as that soft pinions survive longer at C2's lower load, but that claim has to be stated and argued separately.

## The failure case: a necessary condition treated as sufficient

This is an illustration. When the new supplier's first lot of pinions arrived, the depot's purchasing officer checked the delivery against the drawing. The supplier's certificate stated: "Hardness 285 HB. Conforms to drawing." The officer accepted the lot.

The reasoning, written out, was:

1. The drawing requires hardness of 280 to 320 HB.
2. The certificate shows 285 HB.
3. So the pinions conform to the drawing.

The drawing's hardness requirement is a **necessary** condition for conformance. The officer treated it as **sufficient**. Step 3 does not follow from steps 1 and 2, because the drawing contains other requirements that the certificate did not address.

```figure
type: checklist
title: Necessary conditions on the pinion drawing, against the certificate
caption: This is an illustration. The certificate addressed one requirement, and only partly. Conformance needs every necessary condition; the drawing states them as a set that is intended to be sufficient together.
- x Material grade | named on the certificate
- ? Hardness at tooth mid-height, 280 to 320 HB | certificate gives 285 HB measured on the hub face
- ? Heat treatment | through-hardened; method not stated
- ? Tooth profile and accuracy grade | not reported
- ? Root fillet radius | not reported
- ? Face width and bore | not reported
```

Even the hardness line is not settled. The drawing calls for hardness at tooth mid-height, while the certificate reports a reading on the hub face. Those can differ if the heat treatment did not harden the part uniformly, which is exactly the kind of fault that through-hardening is meant to avoid and that a hub-face reading cannot detect. The certificate does not meet even the one necessary condition it addresses, because it measured at a different place.

### How the error is detected and corrected

The error was detected late: after three failures, when the reliability engineer asked for every drawing requirement and the evidence for each. The cheap detection is at receiving inspection, with a rule that a conformance decision lists every necessary condition on the drawing and the evidence for each. A single line of evidence can support a single condition. It cannot support "conforms to drawing".

The correction has two parts. The receiving procedure is changed so that the inspector works from a checklist generated from the drawing, not from the certificate. And the drawing itself is reviewed to make its conditions explicit, as described below.

## Read "only if" and "unless" correctly

Specifications and procedures often use "only if" and "unless", and both are frequently misread.

**"Only if"** introduces a necessary condition. "Restart the conveyor only if the guard is refitted" means that refitting the guard is required before restarting. It does not mean that refitting the guard is a reason to restart. A fitter who refits the guard and restarts a conveyor that is still waiting for an inspection has read "only if" as "if".

**"Unless"** combines a negation and a condition. "The pinion shall be rejected unless its hardness is in range" means "if the hardness is not in range, reject it". It does not say that a pinion with hardness in range must be accepted; other rejection criteria may still apply. "Unless" introduces a necessary condition for avoiding the outcome, not a sufficient one.

The same distinction is built into machine safety. An interlock that says "the conveyor can run only if the guard is closed" makes the closed guard a necessary condition for running. It must never become a sufficient one. A control circuit that started the conveyor whenever the guard switch closed would turn a protective condition into a start command, and a fitter closing a guard to test its fit could set the drive moving. Control designers express this by requiring a separate, deliberate start action after the guard is closed. The logic of "only if" is, in that setting, the difference between a safeguard and a hazard.

A useful habit when reading either word is to rewrite the sentence as an explicit "if, then" and say aloud which condition is necessary and which is sufficient. It takes a few seconds and removes most of the ambiguity.

## Write conditions so they cannot be misread

The pinion drawing's requirements were correct but presented as a list of separate notes. Nowhere did it say that all of them together were required for acceptance, or that meeting all of them was sufficient. The reliability engineer redrafts the acceptance note:

> A pinion is acceptable if, and only if, it meets every requirement in table 1. A certificate or inspection record must give evidence for each requirement separately. Hardness is measured at tooth mid-height on a sectioned sample or on the tooth flank, not on the hub.

That wording makes the set of requirements jointly necessary and sufficient, says what kind of evidence counts for each, and removes the hub-face loophole. It is longer than "hardness 280 to 320 HB", but each extra word closes a misreading that has already happened.

Some practical rules for writing conditional requirements:

- State whether a list of conditions is **all required**, **any one sufficient**, or something else. "And" and "or" in a list are often left implicit.
- Put the **condition that triggers an action** first: "If the oil exceeds 80 °C, stop the conveyor," not "Stop the conveyor; oil limit 80 °C."
- Avoid **double negatives** such as "do not restart unless not isolated".
- Where an **exception** applies, state it as its own condition rather than burying it in "normally".
- Give the **evidence** that will show each condition is met.

## Conditions in diagnosis: what is necessary for a failure

Conditionals also structure failure analysis. For a gear tooth to fail by bending fatigue, several things are needed together: a cyclic bending stress at the root, enough cycles, and a stress high enough relative to the material's fatigue strength at that location. Each is necessary; none alone is sufficient.

This explains why a single-cause argument so often fails in investigations. The philosopher J. L. Mackie described a cause as typically an insufficient but non-redundant part of a set of conditions that is itself sufficient, though not necessary, for the effect. In the depot's case, the set of conditions sufficient for tooth breakage might include a raised load, a lowered fatigue strength and a concentration of load on part of the face. Each could be a necessary part of that particular set. Remove any one, and that set no longer produces the failure, though a different set might.

That framing changes the question the investigation asks. Instead of "what is the cause?", it asks "which conditions were present, and which of them were necessary for these failures?" Chapter 7 uses this to test several explanations at once, rather than eliminating all but one.

## Biconditionals and overclaiming

A biconditional, "A if and only if B", is a strong claim: A and B always go together. Engineers sometimes make biconditional claims without intending to. At the depot, the reliability engineer's first draft of the fix said: "The drive will be reliable if and only if the pinions meet hardness and the shafts are aligned."

Read literally, that says two things. Meeting hardness and alignment is sufficient for reliability, which is the intended claim. And meeting them is necessary, so any other failure route is ruled out, which nobody can know. Lubrication failure, a bearing collapse or a jam could still damage the gears. The engineer revises the statement to the claim the evidence can support: "Restoring pinion hardness to the drawing and correcting alignment removes the conditions identified in these failures."

## Exercise: the restart rule

The depot's restart procedure for C1 says: "Do not restart the conveyor unless the guard is refitted and the pinion has been inspected."

1. Rewrite the rule as an explicit "if, then" statement.
2. Write its contrapositive.
3. For each of the following, say whether it follows from the rule: (a) the guard is refitted and the pinion has been inspected, so the conveyor may be restarted; (b) the conveyor was restarted, so the guard had been refitted; (c) the pinion was not inspected, so the conveyor must not be restarted.

**Worked answer.**

1. "Do not restart unless G and I" means: **if not (G and I), then do not restart**. Equivalently, **restart only if G and I**: the guard and the inspection are jointly necessary for restarting.
2. The contrapositive is: **if the conveyor is restarted, then the guard is refitted and the pinion has been inspected**.
3. (a) **Does not follow.** The rule makes G and I necessary, not sufficient. Other conditions, such as the isolation permit being cleared, may also be needed before restart. Reading the rule as permission is the "only if" misreading. (b) **Follows.** It is a direct application of the contrapositive: a restart, done in accordance with the rule, implies both conditions held. In practice, of course, it shows what should have been true, not what was; a restart in breach of the rule is evidence of a breach, not of a refitted guard. (c) **Follows.** If I is false, then "G and I" is false, so the rule says do not restart.
