---
book: arguments-that-hold
chapterSlug: claims-you-can-check
order: 1
title: "Claims you can check: turning opinions into propositions"
description: "How to turn opinions about a failure into claims with a subject, a measurable property, a limit and a condition, so that evidence can show them true or false before anyone acts on them."
draft: false
---

Every engineering argument is built from claims, and an argument cannot be better than the claims it is built from. "The pinions are rubbish" and "the motor is too big" sound like explanations, but they are not yet claims that evidence can confirm or refute. Until they are rewritten in a checkable form, a meeting can argue about them for hours without moving.

This chapter shows how to turn opinions into claims that are either true or false once their terms are fixed, and how to attach a method of checking to each one. It introduces the running case, and uses a gear force calculation to show how much a vague claim can hide.

## The meeting after the third failure

This is an illustration. The third pinion on conveyor C1 loses two teeth on a Tuesday night shift. On Wednesday morning the depot manager calls a meeting. In twenty minutes she hears five explanations:

1. The maintenance supervisor: "The new supplier's pinions are rubbish."
2. The production manager: "That 15 kW motor is too much for the gears."
3. A fitter: "It's that new oil. Everything was fine before we changed it."
4. The reliability engineer: "That drive ran for nine years without a problem, so the design isn't the issue."
5. The project engineer who managed the conveyor extension: "We put the drive back exactly where it was."

Each speaker is experienced and each statement has something behind it. But as stated, none of them can be tested, and several cannot even be false in any clear way. "Rubbish" has no threshold. "Too much" has no comparison. "Fine" has no measure. "Exactly where it was" is a statement about intention. The meeting ends with the manager choosing an explanation, which is the usual outcome when claims cannot be checked.

## What makes a claim checkable

Logicians since antiquity have treated the statement, or proposition, as the unit that is true or false. Abelard put propositions, rather than individual terms, at the centre of his logic, and worked on how the content of a statement determines what follows from it. For an engineer, the practical version of that idea is simple: before reasoning about a statement, make sure it says something definite enough to be true or false.

A checkable engineering claim usually has five parts:

- **A definite subject.** Which pinions? All pinions, the new supplier's pinions, one lot, or the three that failed?
- **A measurable property.** Hardness, power, alignment, vibration, temperature, with units.
- **A limit or comparison.** Below the drawing minimum, above the original duty, different from before by a stated amount.
- **A condition.** Under what load, at what speed, over what period, at which location on the part.
- **A way to find out.** The test, measurement or record that would show the claim true or false.

A claim that has all five can be checked, and the check can be planned before anyone argues about it. A claim missing one or more is not wrong, but it is not ready.

## Rewrite the five explanations

The depot's reliability engineer takes the five explanations and rewrites each as a claim, without changing what the speaker meant. Where a speaker's meaning is unclear, she asks them.

```figure
type: compare
title: From explanation to checkable claim
cols: As a checkable claim | How to check
caption: This is an illustration. Each rewrite keeps the speaker's meaning but adds a subject, a measure, a limit and a condition. Two of the five turn out to contain more than one claim.
- The new supplier's pinions are rubbish | Pinions from the new supplier have core hardness below the drawing minimum of 280 HB | Hardness test on failed and unused pinions from that supplier
- The 15 kW motor is too much for the gears | The C1 pinion now transmits more power than the drive's original duty of 11 kW, enough to raise tooth stress materially | Measure transmitted power; calculate tooth force and stress
- It's the new oil | Since the lubricant change, gear condition on a drive with no other change has altered by a measurable amount | Compare vibration or temperature on C2 before and after the change
- The drive ran fine for nine years | The original pinions survived nine years at 11 kW with aligned shafts | Records of duty and failures; a separate argument is needed to apply this to today
- *We put the drive back exactly where it was | After relocation, C1's pinion and wheel shafts are parallel within the drive maker's tolerance | Alignment check; contact pattern on the gear teeth
```

Three things happen in the rewriting.

First, **subjects become definite.** "The new supplier's pinions" now means pinions from a named supplier, which can be listed by lot. That matters because the claim might be true of one lot and not another.

Second, **hidden comparisons come out.** "Too much" becomes "more than the original duty of 11 kW, enough to raise stress materially". That exposes a question the original statement concealed: is the motor's rating the same as the power the gears actually carry?

Third, **claims about intentions become claims about results.** "We put the drive back exactly where it was" describes what the project team meant to do. The checkable claim is about where the shafts actually are. Both can be true at once: the team can have intended an exact reinstatement and still left the shafts out of parallel.

## How much a vague claim can hide: the motor

The production manager's claim is the best example, because it seems to contain a number. The motor is 15 kW; it used to be 11 kW; so the gears must be carrying 36% more load. Each step needs checking.

A motor's rating is the power it can deliver continuously, not the power it does deliver. The conveyor draws what its load demands, and a motor sized with margin for starting and future growth runs below its rating most of the time. The reliability engineer estimates the power transmitted to the pinion from the motor's measured input power and its efficiency at that load. Over a week of normal operation, C1's pinion transmits about **12.4 kW** in steady running. C2, unchanged, transmits about **9.8 kW**.

The [gear tooth forces tool](/tools/gear-forces/) in BIZOMAT Tools calculates the torque, tangential force, radial force and axial force on a spur or helical gear from the power, the speed and the pitch diameter. It gives static forces at the pitch point and leaves dynamic and application factors to be applied separately, as its own output notes.

For the C1 pinion at 1,450 rpm, 72 mm pitch diameter and a 20° pressure angle, it gives:

```figure
type: bars
title: Tangential force on the C1 pinion for three readings of the claim
unit: N
max: 3000
caption: This is an illustration. Static tangential force from the gear tooth forces tool. The motor rating suggests a 36% rise in tooth force; measured transmitted power shows about 13%.
- Original duty, 11 kW | 2012
- *Measured steady duty after the extension, 12.4 kW | 2268
- Motor rating after the extension, 15 kW | 2744
- C2 measured, 9.8 kW, for comparison | 1793
```

So "the 15 kW motor is too much for the gears" splits into two claims with different truth values. "The gears carry 36% more load than before" is false for steady running: the tooth force has risen by about 13%, from 2,012 N to 2,268 N. "The gears carry more load than before" is true. Whether a 13% increase is enough to matter is a further question, taken up in Chapter 5.

The reliability engineer also records what the measurement does not cover. Steady running is not the whole duty. A direct-on-line start, a jam, or a surge of material can produce torque well above the steady value for short periods. Those conditions belong to the claim's condition field, and they will need their own evidence.

## The failure case: acting on an uncheckable claim

At the Wednesday meeting, the manager accepted the production manager's explanation because it came with a number, and gave an instruction: fit the old 11 kW motor back to C1 and reduce the conveyor's throughput until a decision is made about the extension.

That decision cost a day of fitter time and reduced throughput by about a fifth. It did not stop the failures. Two weeks later, the fourth pinion on C1 lost a tooth with the 11 kW motor fitted.

The failure of the decision traces directly to the claim. "The motor is too much" was never a claim about measured load; it was a claim about a nameplate. Rewritten and checked, it would have shown a 13% rise in steady tooth force, which might contribute but was unlikely to explain three failures in ten weeks on a drive that had run nine years. The rewrite would have taken an hour. The check, a week of power logging, could have run alongside other checks.

### How it is detected and corrected

The failure is detected when the fourth pinion breaks, which is the expensive way. The cheap way is a rule for the meeting: **no action on a claim until it has a subject, a measure, a limit, a condition and a method of checking.** Urgent containment, such as fitting a spare pinion or inspecting more often, is allowed while checks run, because containment does not depend on which explanation is right.

The correction is to reopen the list of claims, assign each one a check and an owner, and agree what result would count as confirming or refuting it before the results arrive.

## Kinds of vagueness to remove

The five explanations show the main ways a statement falls short of a claim. Naming them makes them easier to spot in a meeting.

```figure
type: checklist
title: Ways a statement can fall short of a checkable claim
caption: This is an illustration. Each item appeared in the depot meeting. A statement can have several at once; "the 15 kW motor is too much" had three.
- x Vague predicate | rubbish, too much, fine, weak, poor quality
- x Unstated scope | the pinions: all of them, one supplier, one lot, the failed ones
- x Hidden comparison | too much compared with what: the rating, the old duty, the gear's capacity
- x Missing condition | at what load, speed, temperature, location on the part
- x Intention for result | we put it back exactly; we tightened them to spec
- x Rating for actual | motor nameplate for transmitted power; bolt class for measured preload
```

Not every vague word needs removing. "Fine" in "the drive ran fine for nine years" is acceptable once it means "no pinion failures recorded in the maintenance system". The test is whether two people could agree, by looking at the evidence, whether the claim is true.

## Claims about the past, present and future

The rewritten claims are of three kinds, and each is checked differently.

- **Claims about the past**, such as "the original pinions survived nine years at 11 kW", are checked against records: maintenance history, purchase records, operating logs. Their weakness is that records may be incomplete.
- **Claims about the present**, such as "the new supplier's pinions are below 280 HB" or "the shafts are out of parallel", are checked by measurement now. Their weakness is measurement error, which can be estimated.
- **Claims about the future**, such as "the fix will stop the failures", cannot be checked directly. They are predictions, supported by an argument from present and past claims. Chapter 8 shows how to state them with the qualification they need.

Mixing these kinds is a common source of confusion. "The drive ran fine for nine years" is a true claim about the past. "So the design is adequate now" is a prediction about the present drive under a new duty and a new alignment. The first does not settle the second, and Chapter 5 examines what kind of argument would connect them.

## A register of claims

The reliability engineer keeps the rewritten claims in a single register: the claim, its owner, the check, the result that would confirm it, the result that would refute it, and the status. The register does three useful things. It lets the investigation run several checks in parallel instead of debating which to run first. It records in advance what each result will mean, which protects against reinterpreting results after the fact. And it gives every explanation a fair test, including the ones that seem unlikely to the people in charge.

### Agree what would count before the results arrive

Writing the confirming and refuting results in advance is the step most often skipped, and the one that most improves an investigation. Two of the depot's entries show how it works.

- **Hardness.** Claim: pinions from the new supplier have core hardness below 280 HB. Confirmed if most of the supplier's pinions tested fall below 280 HB at the core. Refuted if all fall within 280 to 320 HB. Inconclusive if results straddle the limit, in which case more pinions are tested.
- **Alignment.** Claim: C1's shafts are out of parallel beyond the drive maker's tolerance. Confirmed if the alignment check exceeds the tolerance or the contact pattern covers less than the full face at one end. Refuted if both are within tolerance across the face.

Once these are written down, nobody can decide after seeing a hardness of 275 HB that it is "close enough" or that 295 HB is "suspiciously soft". The result means what the register said it would mean. If the team later learns something that changes the criteria, it changes them openly, with a note of why, rather than quietly shifting the goalposts to fit a favoured explanation.

By Friday the register holds seven claims. The two not discussed so far came from the checks themselves: the failed pinions all broke at the tooth root, and all three fractures started at the same end of the face width. Those observations are claims too, and they will matter more than any of the five explanations.

## Exercise: rewrite and test a claim

At the next meeting, the production manager restates his view: "The extension has increased the gear load by 36%." Is this a checkable claim? Is it true? Rewrite it so that it is both checkable and true on the evidence so far, using the gear tooth forces tool results above.

**Worked answer.** The statement is checkable: it has a subject (the gear load on C1), a measure (load), a comparison (the original duty) and a quantity (36%). It is false on the evidence. The 36% comes from the ratio of motor ratings, 15 ÷ 11 = 1.364. The measured steady power gives a ratio of 12.4 ÷ 11 = 1.127, and the gear tooth forces tool gives a tangential force of 2,268 N against 2,012 N, a rise of about 13%.

A checkable and true version is: "In steady running, the extension has increased the tangential tooth force on the C1 pinion by about 13%, from 2,012 N to 2,268 N, based on measured transmitted power of 12.4 kW against the original 11 kW duty. Peak loads during starting and surges have not yet been measured." The last sentence matters. It records the condition under which the claim holds and the part of the duty it does not cover, which keeps the claim honest when it is used in a later argument.
