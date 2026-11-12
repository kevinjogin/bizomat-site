---
book: practical-wisdom-by-the-numbers
chapterSlug: judge-each-case-against-the-rule
order: 4
title: "Judge each case against the rule as written"
description: "Apply the specification precisely to each flange, map every indication against the gasket band, allow for measurement and assembly offsets, and separate nonconforming from doubtful cases."
draft: false
---

Counsel and foresight prepare a decision. Judgement makes it. Aquinas names a particular virtue for judging well in ordinary cases, *synesis*, which gives right judgement about particular matters that fall under common rules (*Summa Theologiae* II-II q.51 a.3). He names another, *gnome*, for the exceptional cases the rules do not cover (q.51 a.4). The order matters. A team that reaches for the exception before it has applied the rule carefully is not exercising higher judgement; it is skipping the lower one.

This chapter applies the customer's specification to each of the 18 flanges exactly as written. It shows how a careful reading of the rule, a precise map of the indications and an honest allowance for assembly and measurement turn "18 rejects" into three distinct groups. Only one of those groups is a candidate for the exception that Chapter 5 considers.

## Read the rule before applying it

This is an illustration. The specification, invented for this book, states that each sealing face shall be examined by dye penetrant and that there shall be no linear indications and no rounded indications larger than 1.0 mm on the raised face. Three features of the wording matter.

First, the criterion applies to the whole raised face, not just to the part the gasket touches. The specification does not distinguish zones. Any rounded indication larger than 1.0 mm anywhere on the raised face is a nonconformance.

Second, "larger than 1.0 mm" means an indication of exactly 1.0 mm passes. A team that rejects 1.0 mm indications is applying a stricter rule than the customer wrote, which wastes good parts and, in a dispute, shows that the team did not read the requirement.

Third, the criterion is stated in terms of indications, which are what the inspector sees after the penetrant bleeds out, not in terms of the underlying pores. Penetrant indications usually look larger than the discontinuity that caused them. The specification has chosen to judge the indication, and the workshop must judge what the specification says.

Reading the rule this way is synesis in practice: judging the particular case according to the common rule, without adding to it or subtracting from it.

```figure
type: checklist
title: Read an acceptance criterion before applying it
caption: Four questions that prevent both over-rejection and quiet relaxation of a requirement.
- Where does it apply? | The whole raised face, not only the gasket band
- Is the limit inclusive? | "Larger than 1.0 mm" means 1.0 mm passes
- What is measured? | The penetrant indication, not the pore beneath it
- x Do not add zones the rule does not state | Zoning is a question for the rule's owner
```

A useful discipline is to paraphrase the criterion in one sentence and ask the person who wrote it, or the person who owns it, whether the paraphrase is right. In the case, the quality lead's paraphrase is: "Any linear indication anywhere on the raised face, or any rounded indication over 1.0 mm anywhere on the raised face, is a reject." The customer's engineer confirms it on the phone during the counsel described in Chapter 2. That confirmation costs two minutes and removes any later argument about what the rule meant.

## Map every indication

The re-inspection in Chapter 1 recorded every indication by flange serial number, type, size and position. Positions are measured as diameters on the raised face, from the flange centre. The geometry, invented for teaching, is as follows: the bore is 108 mm, the raised face is 162 mm in diameter, and the customer's gasket contacts the face between 115 mm and 150 mm.

The gasket band is therefore a ring 17.5 mm wide radially, covering about 63.6% of the raised-face area. The ring outside the gasket, between 150 mm and 162 mm, is 6 mm wide radially and covers about 25.7% of the face. The small land between the bore and the gasket's inner edge covers the remaining 10.7%.

```figure
type: svg
title: Where the 18 indications sit on the raised face
viewbox: 0 0 640 230
alt: A radial strip of the flange raised face from 108 mm to 162 mm diameter, showing the gasket contact band from 115 to 150 mm, a wider shaded zone allowing for gasket offset out to 153 mm, four rounded indications and two linear indications inside or near the band, and twelve rounded indications in the outer ring beyond 153 mm.
caption: Highlighted dots are rounded indications within the band allowing for offset; short lines are linear indications; the twelve plain dots lie wholly beyond the 153 mm limit.
body:
<rect class="bx" x="112" y="70" width="486" height="70"/>
<rect class="fs" x="148" y="70" width="369" height="70"/>
<rect class="bxa" x="175" y="70" width="315" height="70"/>
<text class="txb" x="332.5" y="58" text-anchor="middle">Gasket contact band, 115 to 150 mm</text>
<text class="txs" x="557.5" y="58" text-anchor="middle">Outer ring</text>
<path class="ln dsh" d="M517 62V148"/>
<text class="txs" x="517" y="164" text-anchor="middle">153 mm limit with offset</text>
<circle class="fa" cx="297.4" cy="84" r="4"/>
<circle class="fa" cx="409" cy="98" r="4"/>
<circle class="fa" cx="499" cy="112" r="4"/>
<circle class="fa" cx="508" cy="126" r="4"/>
<path class="la" d="M322 84H334"/>
<path class="la" d="M538 98H550"/>
<circle class="fi" cx="535" cy="112" r="4"/>
<circle class="fi" cx="540.4" cy="126" r="4"/>
<circle class="fi" cx="544" cy="84" r="4"/>
<circle class="fi" cx="549.4" cy="98" r="4"/>
<circle class="fi" cx="554.8" cy="112" r="4"/>
<circle class="fi" cx="560.2" cy="126" r="4"/>
<circle class="fi" cx="565.6" cy="84" r="4"/>
<circle class="fi" cx="569.2" cy="98" r="4"/>
<circle class="fi" cx="572.8" cy="112" r="4"/>
<circle class="fi" cx="576.4" cy="126" r="4"/>
<circle class="fi" cx="580" cy="84" r="4"/>
<circle class="fi" cx="581.8" cy="98" r="4"/>
<text class="txs" x="130" y="190" text-anchor="middle">110</text>
<text class="txs" x="220" y="190" text-anchor="middle">120</text>
<text class="txs" x="310" y="190" text-anchor="middle">130</text>
<text class="txs" x="400" y="190" text-anchor="middle">140</text>
<text class="txs" x="490" y="190" text-anchor="middle">150</text>
<text class="txs" x="580" y="190" text-anchor="middle">160</text>
<text class="tx" x="112" y="214">Diameter on the raised face, mm (bore 108, raised face 162)</text>
```

## Allow for how the gasket actually sits

The gasket band of 115 mm to 150 mm is nominal. In service, the gasket is centred by the bolts, and bolt holes have clearance. The workshop's assumption, which it will state in its request, is that the gasket may sit up to 1.5 mm off centre. On the side towards which it shifts, the gasket's outer edge could reach a diameter of 153 mm.

An indication also has size. A rounded indication 1.2 mm across, centred at 152 mm diameter, extends 0.6 mm either side of its centre. So the rule the inspector applies to decide whether an indication could lie under the gasket is: take the indication's innermost edge, and compare it with the 153 mm limit. If the innermost edge is at or inside 153 mm, the indication could sit under the gasket, and it is treated as within the band.

This is circumspection, the part of prudence that checks whether a means still suits its end once the particular circumstances are considered (II-II q.49 a.7). The nominal band is a fine description of the gasket on a drawing. It is not a safe description of where the gasket will be on a pump station.

## Sort the 18 flanges

Applying the rule as written, all 18 flanges are nonconforming: every one has either a linear indication or a rounded indication larger than 1.0 mm. Judgement does not stop there, because the customer will want to know which nonconformances could matter to the seal. Using the map and the offset allowance, the 18 fall into three groups.

```figure
type: compare
title: The 18 flanges, sorted by the rule and by position
cols: Flanges | What the map shows | Status
caption: All 18 fail the rule as written; only the third group is a reasonable candidate for a concession request.
- Linear indications | 2 | 2.5 mm and 3.0 mm, one inside and one outside the band | Nonconforming; not a concession candidate
- Rounded, within band allowing for offset | 4 | 1.1 to 1.8 mm; two of them within 2 mm of the nominal band edge | Nonconforming; not a concession candidate
- *Rounded, wholly beyond 153 mm | 12 | 1.1 to 1.4 mm, inner edges between 76.9 mm and 79.4 mm radius | Nonconforming; candidate for a concession request
```

The two linear indications are excluded from any concession whatever their position, because the specification forbids linear indications outright and a linear indication can grow as a crack. The four rounded indications within the band, including the two close to its edge, could sit under the gasket and are also excluded. The 12 rounded indications that lie wholly beyond 153 mm are the only group for which the rule's purpose, an intact seal, might be met despite the nonconformance.

## A failure: the quick sort that counted 14

Before the inspector finished the map, the production manager sorted the flanges from the raw list using one test: is the indication's centre outside 150 mm? That test produced 14 flanges "outside the band", not 12.

The two extra flanges, serial numbers 088 and 117, have rounded indications centred at 151.0 mm and 152.0 mm. Their centres are outside the nominal band, but their inner edges are at 149.8 mm and 150.9 mm diameter, and both lie inside the 153 mm limit once the gasket offset is allowed for. Either could sit under the gasket.

The error was detected because the inspector checked the quick sort against the map before it was sent to anyone. Two features of the quick sort gave it away: it ignored the size of each indication, and it used the nominal band rather than the band as installed. Either omission alone could have moved a flange into the wrong group.

The correction is procedural as much as numerical. The sorting rule is now written down, with the 1.5 mm offset assumption and the use of each indication's inner edge, and it goes into the concession request so the customer's engineer can check it. Had the quick sort been sent, the workshop would have asked the customer to accept two flanges that could leak, and when the error came to light it would have damaged trust in the other 12.

## Allow for measurement

Indications are measured with a graduated magnifier that reads to 0.1 mm. The inspector estimates the uncertainty of a reading at about plus or minus 0.1 mm. That raises two questions.

For the size criterion, could any of the 18 actually be 1.0 mm or smaller? The smallest rounded indication in the set is 1.1 mm. Allowing for the uncertainty, it could be as small as 1.0 mm, which would pass. The workshop does not rely on that. A reading at the limit is a doubtful case, and the prudent course is to treat it as nonconforming and include it in the request with the reading and its uncertainty stated, rather than quietly reclassify it as conforming. The Library's book [Accept or Reject by the Numbers](/reados/publications/accept-or-reject-by-the-numbers/) covers guard bands and readings near limits in detail.

For the position criterion, the uncertainty is small compared with the margins in the concession group. The nearest inner edge among the 12 is at 76.9 mm radius, 0.4 mm beyond the 76.5 mm limit, which is larger than the position uncertainty. The margin is still the smallest in the group, so the request will name that flange, serial number 023, and show its reading.

## Why the rule comes before the exception

It is tempting, once the map shows that 12 indications sit outside the gasket band, to say that those flanges are "really" acceptable and that the specification is simply too strict. That move skips a step Aquinas treats as essential. Rules are written for what usually happens, and in the usual case following them is what justice and good engineering require. The exceptional case is recognised only after the ordinary judgement has been made and found to fall short of the rule's purpose.

There are good reasons for the order. The first is that rules carry knowledge the person applying them may not have. The customer's engineer may have reasons for applying the criterion to the whole raised face that are not written in the specification: corrosion in a particular water chemistry, the possibility of a different gasket being fitted later, or experience of a previous failure. A workshop that treats the outer ring as unimportant because its own reasoning says so is substituting its judgement for knowledge it has not seen.

The second reason is that other people rely on the rule being applied consistently. The customer's inspectors will receive the flanges expecting that "accepted" means "met the specification". If the workshop silently applied its own zoning, the word would lose its meaning, and every future delivery would need to be checked again.

The third reason is self-protection. A team under schedule pressure is not a neutral judge of whether a rule is too strict. The same pressure that makes the exception attractive makes it harder to see clearly. Applying the rule first, and writing down the result, creates a fixed point against which the later argument for an exception can be measured.

## Write the judgement so it can be checked

A judgement that another person cannot check is only an opinion with a signature. For each of the 18 flanges, the workshop's record shows the serial number, the indication type, its measured size, its centre position, its inner-edge position, the group it falls into and the reason. The sorting rule itself is stated at the top of the record, with its assumptions: the nominal gasket band, the 1.5 mm offset allowance and the use of the inner edge.

The record also states what the judgement does not claim. It does not claim that the 12 flanges in the concession group are fit for purpose; that is for the customer to decide. It does not claim that the 222 accepted flanges are free of subsurface porosity, only that their surfaces met the criterion, supported by the section described in Chapter 3. Stating the limits of a judgement is part of making it honestly, and it is what lets the customer rely on the parts of it that are firm.

## What judgement has produced

At the end of day zero, judgement according to the rule has produced a clear and checkable statement:

| Finding | Flanges | Basis |
|---|---|---|
| Conforming | 222 | No indications larger than 1.0 mm, no linear indications |
| Nonconforming, to be replaced | 6 | Linear indications, or rounded indications that could lie under the gasket |
| Nonconforming, candidate for concession | 12 | Rounded, 1.1 to 1.4 mm, wholly beyond the 153 mm limit with offset |

The statement does not yet say what the workshop will do with the 12. It says what they are. That is the work of synesis: a faithful application of the common rule, which leaves the exceptional question visible instead of hiding it inside the ordinary one.

## Exercise: classify three more indications

The inspector finds three more indications on flanges from the next batch. Using the same rule (gasket band 115 mm to 150 mm, offset allowance to 153 mm, judge by the indication's inner edge), classify each:

1. Rounded, 1.0 mm, centred at 140 mm diameter.
2. Rounded, 1.4 mm, centred at 154 mm diameter.
3. Rounded, 1.6 mm, centred at 155 mm diameter.

**Worked answer.** Indication 1 is exactly 1.0 mm, which is not larger than 1.0 mm, so it conforms wherever it sits; no further judgement is needed. Indication 2 is larger than 1.0 mm, so it is nonconforming. Its radius is 77.0 mm and its inner edge is 0.7 mm closer to the centre, at 76.3 mm radius or 152.6 mm diameter, which is inside the 153 mm limit. It could sit under the gasket and is not a concession candidate. Indication 3 is also nonconforming. Its radius is 77.5 mm and its inner edge 0.8 mm closer, at 76.7 mm radius or 153.4 mm diameter, beyond the limit. It is a concession candidate, but with only 0.2 mm of radial margin, so the request should state the reading and the margin explicitly.
