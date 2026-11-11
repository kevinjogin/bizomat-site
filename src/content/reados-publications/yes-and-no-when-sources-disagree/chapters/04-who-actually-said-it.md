---
book: yes-and-no-when-sources-disagree
chapterSlug: who-actually-said-it
order: 4
title: "Who actually said it: tracing a number to where it began"
description: "How to trace a value back through spreadsheets, charts and quotations to its first statement, expose misattributed claims and repeated copies, and recompute the number from its true origin."
draft: false
---

A number in a document carries an implied signature. "Per standard", "manufacturer's value" and "from the handbook" all tell the reader whose authority stands behind it. Often the signature is wrong. The number was copied from somewhere else, and the attribution was added by someone who assumed where it came from.

Abelard knew this problem well. He warned that works were sometimes attributed to respected authors who never wrote them, and that even careful writers quoted the mistaken views of others, leaving readers to separate the quotation from the author's own position. Some authors also relied on others' opinions rather than their own examination. The engineering equivalents are everywhere: the spreadsheet that says "per standard", the manual that reproduces a supplier's table "for information", the web chart that appears on twenty sites and so seems to have twenty independent confirmations. This chapter traces source S4 in the planner's register back to its origin, and shows how tracing changes what the number is worth.

## The spreadsheet that cites a standard

Source S4 is a contractor's spreadsheet from an earlier shutdown. Its bolting tab lists "M16 flange bolts 312 N·m (per standard)". The planner's conversion in Chapter 1 showed that 312 N·m on dry M16 8.8 bolts would produce 97.5 kN, 103.7% of the 94.0 kN proof load. If the claim really came from a standard that governs these joints, the conflict with S1 and S2 would be serious. If it did not, the claim may not be a conflict at all.

The planner asks three questions of any attributed number:

1. **Which document, exactly?** "The standard" is not a reference. A real attribution names the document, its edition and, ideally, the clause or table.
2. **Does that document actually contain the number?** An attribution is a claim about another document, and it can be checked.
3. **If not, where did the number come from?** Every number was first written by someone. Finding that first statement shows what conditions it was written for.

### Follow the trail

The spreadsheet's author has left the contractor, but the cell holding 312 has a comment with a web address. It points to a metric bolt torque chart published by a fastener retailer. The chart lists torques for several property classes. Its M16 row for class 10.9 shows 312 N·m. The header says the values are for 75% of proof load, dry threads, with a nut factor of 0.20, and the footer says they are for reference only.

So the trail is:

```figure
type: tree
title: The provenance of the 312 N·m value
caption: This is an illustration. The spreadsheet's attribution pointed to a standard. The number actually came from a retailer's chart, for a stronger bolt grade than the one being installed.
- Contractor spreadsheet: 312 N·m, labelled per standard
  - Cell comment: link to a fastener retailer's torque chart
    - *Retailer chart, M16 row, class 10.9 column: 312 N·m
      - Chart header: 75% of proof load, dry, K = 0.20
      - Chart footer: reference only
  - Claimed standard: not named; no standard found that tabulates this torque for these joints
```

The attribution was apocryphal. No standard was involved. A real chart supplied the number, but for a different bolt grade, and the spreadsheet's author either took the wrong column or assumed the joint used 10.9 bolts.

### Recompute from the true origin

Once the origin is known, the number can be tested against its own stated assumptions. The [bolt torque and preload tool](/tools/bolt-torque-preload/) is set to the chart's conditions: M16 × 2, K = 0.20, 75% of proof load, and a proof stress of 830 MPa, which is the figure the retailer's chart itself gives for class 10.9 bolts. The tool returns a proof load of 130.03 kN, a preload of 97.53 kN and a tightening torque of **312.1 N·m**.

The recomputation matches the chart. That confirms the trace: S4 is the retailer's 10.9 value, correctly calculated for 10.9 bolts and wrongly applied to 8.8 bolts. For the bolts actually being installed, the same tool at a proof stress of 600 MPa gives 225.6 N·m dry, the value already found in S1.

```figure
type: compare
title: The same chart method applied to two bolt grades
cols: Proof load | Preload at 75% | Dry torque at K = 0.20
caption: This is an illustration. Results from the bolt torque and preload tool. The method behind S4 is sound; only the bolt grade it was applied to is wrong.
- Class 10.9, proof stress 830 MPa, as on the chart | 130.03 kN | 97.53 kN | 312.1 N·m
- *Class 8.8, proof stress 600 MPa, as installed | 94.0 kN | 70.5 kN | 225.6 N·m
```

The register entry for S4 now reads: "Origin traced to a retailer's chart, class 10.9 column. Attribution to a standard not supported. Correct for 10.9 bolts; not applicable to the 8.8 bolts in J1 to J3. Status: misattributed, wrong grade. Not a source for this job."

## The failure case: an attribution nobody checked

S4 was not just a stray file. The planner finds that it was attached to the contractor's method statement for the earlier shutdown, and the method statement was accepted by the plant. Nobody asked which standard. The spreadsheet looked like an engineering calculation and carried the word "standard", so it passed.

The plant was lucky. The work orders show that the contractor's fitters used impact wrenches on the spool, not torque wrenches, so the 312 N·m figure was never applied with any accuracy. If a careful contractor had applied it with a calibrated wrench and lubricated threads, as many do, the tool shows what would have happened: 312 N·m at K = 0.12 gives **162.5 kN**, 172.9% of proof load. Every bolt would have yielded or broken during tightening.

The failure is detected the same way every time: by asking for the document behind the attribution. If the answer is "it's the standard" without a name, edition and table, the attribution has not been established. The correction is to record the true origin and, where the spreadsheet will be reused, remove the false attribution so the next reader is not misled.

## Repeated copies are not independent confirmation

While tracing S4, the planner searches the web for "M16 torque 312". The value appears on many sites: retailers, tool makers, forums and blogs. It would be easy to conclude that 312 N·m is widely agreed.

It is not agreement; it is repetition. Most of those pages reproduce the same kind of chart, built from the same relation T = K F d with the same assumptions: class 10.9, 75% of proof load, K = 0.20. Twenty copies of one calculation are one source. They confirm only that the arithmetic has been copied correctly, not that the assumptions fit your joint.

```figure
type: funnel
title: How many independent sources stand behind the 312 N·m value
caption: This is an illustration. Pages were grouped by the assumptions they state. Most share one origin; none establishes that the value fits 8.8 bolts in a gasketed flange.
- Web pages giving 312 N·m for M16 | 24
- Pages stating their assumptions | 15
- Distinct sets of assumptions | 2
- *Sets that match an M16 8.8 gasketed flange | 0
```

A practical test for independence is to ask whether two sources could have reached their value without either seeing the other or a common parent. Two manufacturers who each tested their own product independently are two sources. Two websites showing the same table are one. Two engineers who both used the same spreadsheet are one. The register should count origins, not mentions.

## When a manual quotes someone else

The trace for S4 sends the planner back to S5, the pump installation manual, with fresh eyes. In an appendix headed "Typical bolt torques, for information", the manual lists M16 8.8 at 210 N·m, with a note that the table was supplied by a fastener maker. That sits awkwardly beside the main text's limit of 110 N·m on the pump's own flanges.

At first sight the manual contradicts itself. Read with Abelard's warning in mind, it does not. The appendix reports another party's general values for information. The main text states the pump maker's own requirement for its own flanges. Quoting is not endorsing.

The tool shows that 210 N·m on dry M16 8.8 bolts gives 65.6 kN, 69.8% of proof load: a reasonable general figure for steel joints, and close to S1. It is not the pump maker's requirement for a grey iron flange, and the manual does not say it is. The register records the appendix as "reported values from a third party; not the manual's own requirement; general steel-joint figure consistent with S1".

### Signs that a source is reporting rather than requiring

- Headings such as "typical", "for information", "for reference only" or "guidance".
- A credit to another organisation, a supplier or a reference work.
- Placement in an appendix, an annex or a sidebar rather than the procedure itself.
- Language of description ("is usually", "values of about") rather than instruction ("tighten to", "do not exceed").

When a document both reports and requires, its requirement governs for the item it covers. Its reports are leads to other sources, which can be traced in turn.

## Primary, secondary and tertiary sources

Tracing places each source somewhere on a chain from the person who knows the facts to the person repeating them. A simple classification is enough for most registers.

```figure
type: layers
title: Where each source in the register sits after tracing
caption: This is an illustration. Tracing does not decide which source wins; Chapter 7 does that. It establishes what each source actually is.
- Primary | the maker of the part, for its own part: pump manual main text (S5); gasket maker's sheet (S2)
- Derived | a calculation with a recorded basis: site torque card and its sheet (S1)
- *Secondary or misattributed | a value taken from elsewhere and relabelled: contractor spreadsheet (S4); manual appendix
- Damaged or withdrawn | a copy that lost its meaning, or a superseded statement: drawing note (S3)
```

Two cautions apply. First, a primary source is primary only for what its author knows directly. The pump maker is primary for the pump's flanges, not for the gasket or the valve. Second, a derived source can be as good as a primary one if its basis is recorded and checkable, as the torque card's calculation sheet is. What makes a source weak is not distance from the origin but the loss of information along the way.

## A procedure for tracing

The planner's steps for S4 generalise into a short procedure:

1. **Read the attribution literally.** Note exactly what it claims: which author, which document, which edition.
2. **Look for the trail.** Cell comments, file properties, footnotes, email threads, method statements and the author's colleagues often hold the link.
3. **Open the cited document.** Check whether the number is there, and under what conditions.
4. **If it is not, keep going.** Search for the number with its context, then group what you find by stated assumptions.
5. **Recompute from the origin.** If the origin gives its assumptions, rerun the calculation. A match confirms the trace; a mismatch means another step is missing.
6. **Record the result in the register,** including dead ends. "Attribution to a standard not supported" is a finding.

Tracing can take an hour or a day. For a value that decides whether bolts yield, the time is well spent.

### When to stop tracing

Not every trail ends at a clear origin. Authors leave, websites disappear and files lose their history. The planner uses a simple stopping rule. Tracing stops when one of three things happens:

- **the origin is found and the number recomputes from it**, as with S4: the source is then classified and its conditions recorded;
- **the trail reaches a primary source for the item in question**, such as the part's manufacturer, who can state the value directly;
- **the trail goes cold**, with no further link and no author to ask.

The third outcome is not a failure of the method. It is a finding: the value is **unverified**. An unverified value can still be useful as a lead, for example to suggest what grade or condition someone once assumed, but it should not decide anything. If an unverified value is the only source available, the right response is to obtain a verified one, usually by asking the manufacturer or by calculating from first principles with recorded assumptions.

The effort spent should match the consequence. A torque value for a pressure joint deserves a full trace. A value for a cover-plate screw on a guard may only need a check that it is plausible.

## Ask for sources before work starts

The cheapest place to trace a number is before it is accepted. The planner's site now asks every contractor's method statement to cite, for each tightening value, the document, its edition or revision, and the table or clause the value comes from. A value calculated by the contractor must come with its inputs: bolt grade, proof stress, target share of proof load and nut factor.

This does two things. It makes misattribution visible at review, because "per standard" with no name cannot pass. And it puts the contractor's own engineers in the habit of tracing their numbers, so the conflict does not reach the plant at all. A method statement that cites its sources properly takes a few more minutes to write and saves the kind of investigation this chapter describes.

## Exercise: the valve maker's 180 N·m

In Chapter 1, the valve maker's data sheet for the valve at J2 gave "flange bolt torque 180 N·m, lubricated threads". The tool showed that 180 N·m at K = 0.12 produces 93.75 kN, 99.7% of the 94.0 kN proof load of an M16 8.8 bolt. Trace it.

The data sheet's bolting table has a header the planner had not noticed: "Values for alloy steel studs, high-strength grade, 75% of proof load". Use the torque–preload relation to estimate what proof stress the 180 N·m value implies, and decide how to record the source.

**Worked answer.** If 180 N·m is 75% of proof load at K = 0.12 on an M16 thread, the preload is F = 180,000 ÷ (0.12 × 16) = 93,750 N. That is 75% of a proof load of 93,750 ÷ 0.75 = 125,000 N. Dividing by the tensile stress area of 156.67 mm² gives an implied proof stress of about **798 MPa**.

That is far above the 600 MPa of the class 8.8 bolts being installed, and consistent with the header's high-strength alloy studs. The valve maker's value is correctly derived for its own fasteners, and wrong for the plant's. The register entry reads: "Valve maker's sheet, 180 N·m lubricated. Origin: maker's table for high-strength alloy studs at 75% of proof load; implied proof stress about 798 MPa. Not applicable to class 8.8 bolts. If the plant changes to the maker's specified studs, revisit." The trace also raises a useful question for Chapter 7: does the valve maker *require* its high-strength studs at J2, or merely assume them? If it requires them, the conflict is about the bolt specification, not the torque.
