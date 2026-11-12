---
book: arguments-that-hold
chapterSlug: valid-forms-and-common-slips
order: 3
title: "Valid forms and the slips that look like them"
description: "The few inference patterns that carry most engineering reasoning, the invalid patterns that imitate them, and a substitution test that exposes a bad argument whatever its subject."
draft: false
---

An argument can fail in two ways. Its premises can be false, or its conclusion can fail to follow from them. The first kind of failure is about facts and is checked with evidence. The second is about form, and it can be checked without knowing anything about gears, bolts or conveyors. A conclusion that does not follow is not rescued by true premises, however strong the evidence for them.

This chapter covers the second kind. It sets out the handful of inference forms that carry most engineering reasoning, the invalid forms that look almost identical, and a simple test, borrowed from medieval logic, for telling them apart. It then applies them to arguments made at the depot.

## Valid, sound and persuasive

An argument is **valid** if its conclusion cannot be false while its premises are all true. Validity is a property of the argument's form, not its content. An argument is **sound** if it is valid and its premises are in fact true. A sound argument guarantees its conclusion.

Neither property is the same as being persuasive. Invalid arguments are often persuasive, especially when their conclusion is something the listener already believes. Valid arguments with a false premise can be equally persuasive. The habits in this chapter are about separating "does this sound right?" from "does this follow?"

## The substitution test

Abelard drew a distinction between inferences that hold by their form alone and those that need an outside principle to support them. As Christopher Martin explains in the *Cambridge Companion to Abelard*, Abelard tested formal validity by substitution: in a formally valid inference, whatever terms are put in place of the originals, keeping the pattern the same, the consequence cannot be broken. That is essentially the test modern logic uses.

For engineers it becomes a practical tool. To test whether an argument's form is valid, keep its structure and replace its content with something familiar where you know the facts. If the new argument has true premises and a false conclusion, the form is invalid, and the original argument does not follow either, however plausible its subject.

The test needs no formal logic, only a willingness to try a few substitutions. It is particularly useful in meetings, because it criticises the form of an argument rather than the person making it.

## Four forms that carry most reasoning

Most engineering inference uses conditionals, so most errors involve them. Four forms account for the bulk of both good and bad reasoning.

```figure
type: compare
title: Two valid forms and the two invalid forms that imitate them
cols: Pattern | Valid | Depot example
caption: The valid forms either affirm the condition or deny the result. The invalid forms do the reverse. All four use the same conditional, which is why they are easily confused.
- Modus ponens | If A then B; A; so B | Yes | If the pinion is below 280 HB it fails the drawing; it is 212 HB; so it fails the drawing
- Modus tollens | If A then B; not B; so not A | Yes | If C2 were misaligned, contact would sit at one end; contact covers the full face; so C2 is not misaligned
- *Affirming the consequent | If A then B; B; so A | No | If overloaded, teeth break at the root; they broke at the root; so overloaded
- Denying the antecedent | If A then B; not A; so not B | No | If overloaded, teeth break; C2 is not overloaded; so C2's teeth will not break
```

**Modus ponens** affirms the condition and concludes the result. It is the form of every specification check: if the reading is outside the limit, the part is rejected; this reading is outside; so this part is rejected.

**Modus tollens** denies the result and concludes that the condition did not hold. It is the form of every elimination: if this cause were present, we would see this sign; we do not; so this cause is absent. It is the most powerful tool in fault-finding, and Chapter 7 relies on it.

**Affirming the consequent** looks like modus ponens run backwards. It observes the result and concludes the condition. It is invalid because other conditions can produce the same result.

**Denying the antecedent** looks like modus tollens run backwards. It observes that the condition is absent and concludes that the result will be. It is invalid because the result can arise in other ways.

### Testing the invalid forms by substitution

Take the depot's overload argument: "If the pinion is overloaded, teeth break at the root. The teeth broke at the root. So the pinion was overloaded." Keep the form and change the content:

> If a car is out of fuel, it will not start. The car will not start. So it is out of fuel.

Both premises can be true while the conclusion is false: the battery may be flat. The form is invalid, so the original overload argument does not follow either. Root breakage is consistent with overload, and it is also consistent with soft material, concentrated load and several other conditions.

Now take the C2 argument: "If a drive is overloaded, its teeth break. C2 is not overloaded. So C2's teeth will not break." Substitute:

> If a pipe is over-pressured, it will burst. This pipe is not over-pressured. So it will not burst.

A corroded pipe can burst at normal pressure. The form is invalid. C2's lower load does not show that its soft pinion is safe; it only removes one route to failure.

## The failure case: the meeting's main argument

The Wednesday meeting described in Chapter 1 reached its decision through an argument that nobody wrote down. Reconstructed, it went:

1. A larger motor puts more load on the gears.
2. More load on the gears breaks teeth at the root.
3. C1 has a larger motor, and its teeth broke at the root.
4. So the larger motor broke the teeth.

Steps 1 and 2 form a chain, which is valid in form: if bigger motor then more load; if more load then root breakage; so if bigger motor then root breakage. The trouble is at step 4. It takes the observed result, root breakage, together with one condition that could produce it, and concludes that this condition did produce it. That is affirming the consequent with extra steps. It ignores the other routes to root breakage, and it also relies on premise 1, which Chapter 1 showed to be weaker than it sounds: the motor's rating is not the gear's load.

The decision that followed, refitting the 11 kW motor, failed when the fourth pinion broke with the smaller motor fitted. That outcome is itself a modus tollens: if the larger motor were the cause, refitting the smaller one would stop the failures; it did not; so the larger motor was not the cause, or at least not the whole cause. The depot learned by failure what the substitution test would have shown in a minute.

### How it is detected and corrected

The detection is to write the argument down as numbered premises and a conclusion, then check each step's form. Any step that goes from a result to one of its possible conditions is a candidate for affirming the consequent. The correction is not to abandon the hypothesis, but to restate it honestly: "Overload is one condition consistent with root breakage. To support it as the cause, we need evidence that distinguishes it from the other conditions consistent with root breakage." Chapter 7 shows how to gather that evidence.

## Reasoning backwards is still useful

None of this means that reasoning from an effect to a possible cause is worthless. It is how every investigation starts. Seeing root breakage and thinking "overload?" is a sensible first move. Philosophers call this kind of reasoning abduction, or inference to the best explanation: from an observation, propose a condition that would explain it.

The error is not in proposing the cause. It is in treating the proposal as a conclusion. Backward reasoning generates hypotheses; it does not establish them. A good investigation uses it deliberately and broadly, listing every condition that could produce the observed result, and then switches to forward reasoning to test each one. For each hypothesis it asks: if this were the cause, what else would we expect to see? Those predictions can then be checked, and modus tollens eliminates the hypotheses whose predictions fail.

At the depot, root breakage suggests at least four hypotheses: overload, soft material, load concentrated at one end of the face, and a stress raiser at the root such as a poor fillet. Each predicts something different. Overload alone predicts damage spread across the whole face width. Concentrated load predicts damage starting at one end. Soft material predicts low hardness readings. A poor fillet predicts a visibly sharp or torn root profile. The observation that all three fractures started at the same end of the face is already evidence against overload acting alone, and for concentration. Backward reasoning found the candidates; forward reasoning is beginning to sort them.

## Hidden premises

Many arguments in meetings are stated with a premise missing, because the speaker takes it for granted. Logicians call such an argument an enthymeme. The missing premise is often where the weakness lies.

The reliability engineer's opening statement, "the drive ran for nine years without a problem, so the design isn't the issue", is an example. Written out in full, it needs a second premise to be valid:

1. The drive ran nine years without a pinion failure.
2. *(Hidden)* The conditions now are the same as during those nine years.
3. So the design is adequate for the conditions now.

Premise 1 is true. Premise 2 is false: the load, the pinion supplier, the lubricant and possibly the alignment have all changed. The argument is valid in form once completed, but unsound. A useful discipline is to complete every important argument by writing down the premise that would make it valid, then checking that premise as carefully as the stated ones. The hidden premise is usually the one nobody has looked at.

## Chains and their weakest link

Long technical arguments are often chains of conditionals: if A then B, if B then C, if C then D, so if A then D. The form is valid. But a chain is only as strong as its least supported link, and confidence in a long chain is often much higher than the evidence for its weakest step justifies.

```figure
type: steps
title: The project engineer's chain about the drive base
caption: This is an illustration. The chain is valid in form. Its strength depends on step 2, the only link that needs measurement on C1 itself; the others rest on established mechanics.
- The drive base was moved and re-grouted during the extension | fact from the project records
- *If the base moved, the shaft alignment may have changed | needs an alignment check on C1
- If alignment changed, load concentrates at one end of the tooth face | established gear behaviour
- If load concentrates, root stress at that end rises | established mechanics; quantified in Chapter 5
- So moving the base may have raised root stress at one end | valid conclusion, as strong as step 2
```

The useful habit is to label each link with the kind of evidence it rests on: a record, an established principle, a calculation, or a measurement still to be made. The chain's conclusion should be stated with the confidence of its weakest link, not its strongest. Here, until the alignment check is done, the conclusion is a hypothesis worth testing, not a finding.

## Either-or arguments

Another common form is the disjunctive syllogism: either A or B; not A; so B. It is valid, but only if the "either-or" premise is exhaustive. When it leaves out possibilities, the argument becomes a false dichotomy.

At the depot, the maintenance supervisor argued: "It's either the new pinions or the extension. The supplier's certificate shows the pinions meet the drawing. So it's the extension." The argument has two faults. Its first premise omits the lubricant, the alignment, and every combination of conditions. And its second premise is false, as Chapter 2 showed: the certificate supports one condition only, measured in the wrong place.

The test for a disjunction is to ask what else could be true, and to write the list down. If the list cannot be closed, the either-or premise is not established, and eliminating one option does not prove another.

## A checklist for any argument

```figure
type: checklist
title: Checking the form of an argument before its facts
caption: This is an illustration. These checks need no knowledge of the subject. Arguments that pass them can then be tested on their premises.
- x Write it as numbered premises and a conclusion
- x Mark each conditional's condition and result
- x Look for steps from a result back to one of its conditions
- x Look for steps from an absent condition to an absent result
- x Check every either-or premise for missing options
- x Label each link in a chain with its evidence; state the conclusion at the weakest link's strength
- x Try a substitution on any step you doubt
```

## Exercise: three arguments from the investigation

Classify each argument's form, say whether it is valid, and where it is invalid, state a valid argument that would support a useful conclusion.

1. "If the new lubricant were damaging the gears, C2 would show rising vibration since the change. C2's vibration has not risen. So the lubricant is not damaging the gears."
2. "If a pinion is soft, it fails early. The C2 pinion from the new supplier has not failed. So it is not soft."
3. "Soft pinions fail early. The failed C1 pinions failed early. So the failed pinions are soft."

**Worked answer.**

1. **Modus tollens: valid.** Its soundness depends on the first premise, that lubricant damage would show as rising vibration within the period observed, and on the second, that vibration really has not risen by a detectable amount. Chapter 6 tests the second premise and finds the measurement was too small to show much either way, which weakens the argument's soundness without affecting its validity.
2. **Modus tollens in appearance, but the first premise is too strong.** "If soft, it fails early" with "early" undefined cannot be denied by ten weeks of survival. Restated: "If a pinion is soft, it fails within X hours at this duty." Ten weeks at C2's lower load may be shorter than X. A valid and useful version is: "If a pinion is soft, its core hardness measures below 280 HB. Measure it." That turns the question into a modus ponens on a direct measurement.
3. **Affirming the consequent: invalid.** Early failure is consistent with softness, and also with misalignment and overload. A valid route to the conclusion is direct: "If a pinion's core hardness is below 280 HB, it is soft by the drawing's standard. The failed pinions measure below 280 HB. So they are soft." That uses modus ponens and requires the hardness test, which Chapter 7 reports.
