---
book: arguments-that-hold
chapterSlug: where-arguments-come-from
order: 5
title: "Where arguments get their force: definition, cause, comparison and part and whole"
description: "Most engineering arguments draw their force from a few kinds of warrant. How to ask what warrants an inference, check where it holds, and catch comparisons that ignore uneven loading."
draft: false
---

Chapter 3 dealt with arguments that hold by form alone. Most engineering arguments are not like that. "The original pinion survived 11 kW, so a pinion of the same quality will survive 9.8 kW" is not valid by form; it depends on something about gears and fatigue. The force of the inference comes from a principle outside the argument itself, and the argument is only as good as that principle and its fit to the case.

Medieval logicians catalogued these outside principles under the heading of topics, or *loci*: the places arguments come from. Abelard gave the idea a sharp edge. As Christopher Martin explains in the *Cambridge Companion to Abelard*, Abelard treated a locus as what gives an inference its force, its warrant. If a logician was asked "whence the locus?", the right reply was not a name for a rule but an account of the fact in virtue of which the conclusion follows. That question is the most useful single question an engineer can ask of an argument: **in virtue of what does this follow?**

This chapter sets out the kinds of warrant engineers use most, shows how each can fail, and applies them to the depot's gear drive with a tooth stress calculation.

## Six common sources of engineering arguments

```figure
type: compare
title: Where engineering arguments get their force
cols: Warrant, stated as a principle | Depot example | Fails when
caption: Each kind of argument rests on a general principle. The argument holds only where the principle applies to the case, which is what "whence the warrant?" asks you to check.
- From definition | What meets the definition has the property defined | A pinion below 280 HB at tooth mid-height is nonconforming | The definition is applied to a different measurement or place
- From cause | A cause, when present with its conditions, produces its effect | Higher root stress shortens tooth fatigue life | The other conditions of the cause are absent
- From greater and lesser | What withstands the greater withstands the lesser, in the same respect | The drive withstood 11 kW for nine years, so it withstands 9.8 kW | The two cases differ in some other respect that matters
- *From whole and part | What holds of the whole holds of each part | The face as a whole is lightly stressed, so every part of it is | The load is not shared evenly across the whole
- From similar cases | Like causes in like conditions give like effects | C2 is identical to C1, so what holds for C2 holds for C1 | The cases are alike only in irrelevant respects
- From authority | A competent source with access to the facts is usually right | The supplier certifies the lot | The authority lacks access, competence or independence
```

None of these warrants is wrong in itself. Each is a general truth that holds under conditions. The work lies in checking that those conditions hold in the case at hand. An argument from greater and lesser is excellent when the two cases differ only in degree. It is worthless when they also differ in kind.

## The tooth stress calculation

The depot's arguments about the gear drive all turn on tooth stress, so the reliability engineer calculates it for each case. The [Lewis bending stress tool](/tools/lewis-bending/) in BIZOMAT Tools gives the bending stress at a gear tooth root from the tangential force, the module, the face width and the Lewis form factor, multiplied by a Barth velocity factor for the manufacturing method, and compares it with an allowable stress. Its output describes it as a screening method only, not a gear rating, and directs the user to rate the gear to ISO 6336 or AGMA 2001 before release.

```figure
type: formula
title: Lewis bending stress with the Barth velocity factor
formula: σ = Kv × Ft ÷ (b × m × Y)
caption: σ is the root bending stress (MPa), Kv the velocity factor for the manufacturing method, Ft the tangential force (N), b the face width carrying the load (mm), m the module (mm) and Y the Lewis form factor. For the C1 pinion at 5.47 m/s pitch-line velocity, hobbed teeth give Kv = 1.657.
- σ | root bending stress
- Ft | tangential force at the pitch circle
- b | face width that actually carries the load
- Y | Lewis form factor for the tooth shape
```

This is an illustration. The inputs come from the drawing and the designer's original calculation sheet: module 4 mm, face width 40 mm, pitch diameter 72 mm, 1,450 rpm, hobbed teeth, and a Lewis form factor of 0.309 for the 18-tooth pinion. The designer's sheet gives an allowable stress of 120 MPa for the drawing's material at 280 to 320 HB. Tangential forces come from the gear tooth forces tool in Chapter 1.

## Argument from greater and lesser

The reliability engineer's opening claim, that nine years at 11 kW showed the design was adequate, is an argument from greater and lesser in disguise. Its warrant is: what withstands the greater load withstands the lesser, in the same respect. Applied to C2 it goes:

1. The original pinions withstood the 11 kW duty for nine years.
2. C2's current duty, 9.8 kW, is less.
3. So a pinion of the original quality, in the same conditions, will withstand C2's duty.

The Lewis tool supports premise 2 in stress terms: at 9.8 kW, a tangential force of 1,793 N gives a root stress of **60.1 MPa**, against **67.4 MPa** at the original 11 kW. The argument is sound for what it claims, which is carefully limited: a pinion of the original quality, in the same conditions.

Now apply the same warrant to C1. At the measured 12.4 kW, the tool gives **76.0 MPa**, about 13% more than the original duty, and still well inside the allowable 120 MPa. The argument from greater and lesser runs the other way here: C1 now carries more than the drive ever carried before, so nine years of history at 11 kW does not cover it. But the margin to the allowable is still large, at a ratio of 0.633.

That is where the production manager stopped. His argument was: "The stress is up 13%, but it's still well under the allowable, so overload can't be the problem." On these numbers, that looks right.

## Argument from whole and part

The Lewis formula has a hidden premise, and it is an argument from whole and part. It divides the tangential force by the whole face width b, which assumes that the load is shared evenly across the face. The warrant is: what holds of the whole face holds of each part of it. That warrant holds only if the gear teeth are aligned so that contact runs the full width of the face.

The depot's evidence says it may not. All three C1 fractures started at the same end of the face, and the project engineer's chain in Chapter 3 linked the base relocation to possible misalignment. When the C1 gear set is marked with engineer's blue and turned through mesh, the contact pattern covers only about 16 mm of the 40 mm face, at the coupling end. C2's pattern covers the full face.

If the load is carried on 16 mm rather than 40 mm, the stress on that part of the face is not the average. As a first estimate, the reliability engineer reruns the Lewis tool with b = 16 mm, treating the loaded strip as the effective face.

```figure
type: bars
title: Lewis root stress on the pinion for each case
unit: MPa
max: 200
caption: This is an illustration. Results from the Lewis bending stress tool against an allowable of 120 MPa. Taking the 16 mm contact strip as the loaded face is a first estimate; real misalignment loads the face unevenly rather than in a sharp-edged strip.
- C2, 9.8 kW, full face | 60.1
- Original duty, 11 kW, full face | 67.4
- C1 measured, 12.4 kW, full face | 76.0
- C1 at motor rating, 15 kW, full face | 92.0
- Original duty, 11 kW, on 16 mm | 168.6
- *C1 measured, 12.4 kW, on 16 mm | 190.0
```

On the loaded strip, the stress at the measured duty is **190 MPa**, 2.5 times the full-face figure and well above the 120 MPa allowable. Even at the original 11 kW, the same misalignment would give 168.6 MPa. The argument "stress is well under the allowable" was valid for the whole face and false for the part that actually carries the load.

The 16 mm estimate is crude. A misaligned gear does not carry its load on a sharp-edged strip with nothing beyond it; the load tapers across the face, and proper rating methods use a face load distribution factor to account for it. The numbers above are not a rating. What they show is the size of the effect, and it is large: the alignment question matters more than the motor question by a wide margin.

## The failure case: a comparison that ignored the parts

The production manager's argument was not careless. It used a real calculation, a reasonable allowable and a sensible margin. It failed because it relied on a warrant, whole-to-part, whose condition was not met, and nobody asked whether it was.

### How it is detected

Ask "whence the warrant?" of every comparison. For "stress is under the allowable", the answer is the Lewis model, and the Lewis model assumes full-face load sharing. The next question writes itself: is the load shared across the full face? That question leads straight to the contact pattern check, which takes half an hour with engineer's blue and a turning bar.

### How it is corrected

The argument is restated with its warrant and condition: "At the measured duty, full-face Lewis stress is 76.0 MPa against an allowable of 120 MPa, **provided the load is shared across the full face**. On C1 it is not: contact covers about 16 mm of 40 mm, giving a first-estimate stress of 190 MPa on that strip." The correction to the drive is a realignment, covered in the [Shaft Alignment by the Numbers chapter on what misalignment is](/reados/publications/shaft-alignment-by-the-numbers/what-misalignment-is/) and the chapters that follow it, with the contact pattern rechecked afterwards.

## Argument from cause: stress needs cycles

The causal warrant behind the whole investigation is that a higher root stress shortens a tooth's fatigue life. It is a sound principle, but like the others it holds under conditions, and stating them sharpens what the evidence can show.

Fatigue needs repetition. Each tooth on the pinion is loaded once per revolution, as it passes through mesh, and unloaded in between. At 1,450 rpm that is 1,450 load cycles a minute for every tooth, or 87,000 an hour. The C1 pinions failed after roughly three to four weeks each, around 500 running hours, which is about **43.5 million** load cycles per tooth. The C2 pinion has run about 1,400 hours, about **122 million** cycles per tooth, at the lower full-face stress of 60.1 MPa.

Those figures make the causal argument quantitative in the right way. The C1 failures are consistent with fatigue at a stress well above what the material at that hardness can sustain for tens of millions of cycles. The C2 survival is consistent with a stress the material can sustain, but it does not prove the C2 pinion is hard: the stress there is lower and is spread across the full face. The causal warrant also has a material condition, that fatigue strength depends on the material's hardness at the root, so the same stress can be safe for a properly hardened pinion and unsafe for a soft one.

What the warrant cannot do is choose between causes on its own. Raised load, concentrated load and reduced hardness all act through the same principle. To find out which were present, the investigation needs evidence that distinguishes them, which is the subject of Chapter 7.

## Arguments from similar cases and from authority

Two more warrants appear in the investigation, and both need their conditions checked.

**From similar cases.** "C1 and C2 are identical drives" was used to argue that C2's survival proves the pinions are sound. The warrant, like causes in like conditions give like effects, requires likeness in the respects that matter. C1 and C2 share a design, but differ in load (12.4 kW against 9.8 kW), in alignment (16 mm contact against full face), and possibly in pinion hardness. On every respect that the Lewis calculation and the fracture evidence say matters, they are unlike. The comparison is still useful, as Chapter 7 shows, but as a contrast rather than a likeness.

**From authority.** The supplier's certificate is an argument from authority: the supplier knows its product. That warrant requires that the authority had access to the relevant facts and reported them competently. Chapter 2 showed that the first certificate measured hardness in the wrong place, which removes the access condition for the claim that mattered. Authority is a legitimate source of evidence, especially from a manufacturer about its own product, but it is the weakest of the six when its basis is not shown.

## Ask for the warrant in reviews

In design and failure reviews, the question "in virtue of what does that follow?" is the most productive one to ask, and the least confrontational. It does not say the argument is wrong. It asks the person making it to name the principle that carries it, and then everyone can look at whether that principle applies. A short list of follow-up questions helps:

- What principle connects the evidence to the conclusion?
- Under what conditions does that principle hold?
- Do those conditions hold here, and how do we know?
- If they do not, what does the argument become?

The last question is the generous one. An argument whose warrant fails is rarely worthless; it usually becomes a narrower argument that is still true. "Stress is under the allowable" became "stress is under the allowable if the load is shared across the full face", which turned out to be exactly the information the investigation needed. Asking for the warrant improves arguments more often than it defeats them.

## Exercise: how much misalignment matters

Using the Lewis model, at the measured C1 duty of 12.4 kW (tangential force 2,268 N, Kv = 1.657, module 4 mm, Y = 0.309), how narrow does the loaded strip of the face have to become before the first-estimate stress reaches the 120 MPa allowable? Express the answer as a share of the 40 mm face, and say what this tells you about acceptance of the contact pattern after realignment.

**Worked answer.** Lewis stress is inversely proportional to the loaded face width. Setting σ = 120 MPa:

b = Kv × Ft ÷ (m × Y × σ) = 1.657 × 2,268 ÷ (4 × 0.309 × 120) = **25.3 mm**,

which is about **63%** of the 40 mm face. In this screening model, a pinion whose contact pattern covers less than about two-thirds of the face at the measured duty is above the allowable on the loaded part.

The result gives the realignment a quantitative acceptance criterion: the contact pattern after realignment should cover substantially more than two-thirds of the face, and ideally the full face, as on C2. It also shows why the original drive survived nine years: with full-face contact, the stress at 11 kW was 67.4 MPa, little more than half the allowable. The model's crudeness cuts both ways, so the criterion should be confirmed by a proper rating with a face load distribution factor, but the order of magnitude is clear.
