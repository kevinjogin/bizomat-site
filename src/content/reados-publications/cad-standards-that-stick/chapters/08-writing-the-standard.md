---
book: cad-standards-that-stick
chapterSlug: writing-the-standard-people-will-read
order: 8
title: "Writing the standard people will read"
description: "Write a CAD standard short enough to be read, with testable rules, reasons and examples, that points to templates and drawing standards instead of copying them."
draft: false
---

Most written CAD standards fail in the same way. They begin as a sensible list, grow with every incident and every enthusiastic contributor, and end as a long document that nobody reads except when looking for a rule to quote in an argument. The office then has two standards: the written one, and the one people actually follow, which is whatever the templates and their colleagues do.

This chapter writes a standard for the running case office that is short enough to read in one sitting, precise enough to check against and honest about what it does not cover. It sets out the structure, the wording of rules and the relationship between the document and the templates. Its error case is the commonest conflict of all: the document says one thing and the template does another.

## What the written standard is for

The settings file, the templates and the library already enforce a great deal. The written standard does not need to repeat what they enforce. Its jobs are narrower:

- to state the rules that software cannot enforce, such as the modelling rules in Chapter 7 or the description convention in Chapter 5;
- to explain the reasons behind the enforced settings, so that people understand them and do not work around them;
- to tell a new starter where everything is and how the environment fits together;
- to record decisions, so that the next administrator inherits reasons rather than habits.

Anything the software already enforces should be described briefly and referenced, not restated in detail. Restating it creates a second copy, and Chapter 5's lesson about copies applies to documents as much as to data.

## Start from a reading budget

The running case office's first draft was assembled from old notes, a vendor training manual's table of contents and contributions from every designer. It ran to 64 pages. At roughly 300 words a page that is about **19,200 words**, and at a typical reading speed of 220 words a minute it would take about **87 minutes** to read once. Nobody did.

The administrator set a reading budget instead: the main document should be readable in under half an hour. At the same speed, 30 minutes allows about 6,600 words. The revised standard ran to **18 pages**, about **5,400 words**, which takes about **25 minutes**. Two single-page checklists, one for modelling and one for drawings, sat alongside it for daily use.

```figure
type: bars
title: Estimated reading time of the written standard
unit: min
max: 90
caption: This is an illustration, at about 300 words a page and 220 words a minute. A reading budget forces decisions about what belongs in the document.
- First draft, 64 pages | 87
- *Revised standard, 18 pages | 25
- Each daily checklist, 1 page | 1.4
```

The cut from 64 pages to 18 was not achieved by shrinking the type. About 20 pages repeated what the templates and settings enforced, and became a two-page summary with references. About 15 pages were general CAD tuition copied or paraphrased from training material, which belongs in training, not in a standard. Several pages described one person's preferred way of doing things that the office did not need to standardise. The rest was tightened.

## Structure for two kinds of reader

A standard has two kinds of reader: the new starter reading it through once, and the experienced designer looking up one rule. The structure should serve both.

```figure
type: tree
title: Structure of the running case office's CAD standard
caption: This is an illustration. Sections 3 to 6 hold the rules; everything else helps people find, understand and change them.
- CAD standard, revision and date
  - 1 Purpose and scope | what it covers and what it does not
  - 2 The environment | where settings, templates, library and register live, and who owns them
  - 3 Files and properties | naming, the property schema summary, description convention
  - 4 Part modelling rules | the eight rules with reasons and examples
  - 5 Assembly modelling rules | the six rules with reasons and examples
  - 6 Drawings | templates, reference to AS 1100 and the office's additions
  - 7 Exceptions and changes | how to record an exception and request a change
  - Appendix | abbreviations list, revision history
```

Sections 1, 2 and 7 serve the new starter and are read once. Sections 3 to 6 serve the daily reader and are written as numbered rules that can be cited. The appendix holds reference material that changes occasionally.

Section 6 is deliberately thin. Drawing conventions belong to the drawing standard the office's work calls up, normally AS 1100 in Australia. The CAD standard says which standard applies, points to the templates that implement it and lists only the office's own additions, such as which general tolerance note to use. It does not restate line types or projection rules; the Library’s [Drawings That Make Parts](/reados/publications/drawings-that-make-parts/) covers those conventions, and the standard itself is the authority.

## Write rules that can be checked

A rule that cannot be checked cannot be followed reliably. Many standards are full of wording such as "should be kept tidy", "where appropriate" and "as far as possible". These phrases express good intentions and give no guidance.

```figure
type: compare
title: Rewriting vague rules as checkable rules
cols: Vague wording | Checkable wording
caption: This is an illustration. A checkable rule states what a checker would see in the file.
- Sketches | should be properly constrained | sketches used by released features are fully defined
- References | avoid unstable references where appropriate | locate holes and interfaces from planes, axes or sketches, not from model faces
- Properties | fill in properties correctly | complete every schema property due at this stage; descriptions are 40 characters or fewer, noun first
- *Rebuilds | models should rebuild without problems | released files rebuild with no errors or warnings at every configuration
```

Use "must" for rules and "should" for recommendations, and say so in section 1. The distinction tells a checker which departures are faults and which are judgement calls. A standard in which everything is a "must" will be ignored selectively; a standard in which everything is a "should" will be ignored entirely.

Each rule needs a reason, in one sentence. The reason does more than persuade. It tells the reader what the rule is protecting, so they can apply its spirit to cases it does not mention, and it tells a future administrator whether the rule still matters.

Each rule that is easily misunderstood needs an example, ideally a screenshot or simple sketch of right and wrong. For the running case office, the most useful example was the side member from Chapter 7: the original equation, the failure at 2,100 mm and the corrected equation. People remembered the story long after they had forgotten the wording.

## The error case: the document and the template disagree

Three months after the standard was released, a checker rejected a drawing because its general note text height did not match section 6 of the written standard. The designer pointed out, correctly, that they had used the A3 template without changing anything. The checker opened the template and found that it applied a different height from the one stated in the document.

Both had been right. The standard had been drafted from an older note, the template had been built from a later decision, and nobody had compared them. Neither the designer nor the checker could tell which was intended.

The administrator resolved the immediate question by asking the engineering manager which height the office wanted, then correcting whichever document was wrong. In this case it was the written standard. The more important correction was structural. The office adopted a principle that has served it since: **where software can enforce a value, the template or settings file is the authority and the written standard refers to it rather than repeating it.** Section 6 now says that text heights, line weights and dimension styles are those set by the current drawing templates, and gives their register location. The document can no longer disagree with the template, because it no longer states the values.

```figure
type: decision
title: Where should this value live?
question: Can the CAD software apply this value automatically?
caption: This is an illustration of the principle the office adopted after the conflict. One authority per value removes the possibility of disagreement.
- *Yes | Template or settings file | the written standard names the file and explains why, but does not repeat the value
- No | Written standard | state it as a checkable rule with a reason and, if needed, an example
```

A quick search of the revised standard found eleven other values that were also set by templates or settings. All eleven were replaced with references.

## Decide who approves it

The administrator writes the standard, but should not be its only approver. A standard approved by its author alone is easily seen as one person's preferences, and it carries no authority when a deadline makes a shortcut tempting. In the running case office, the engineering manager approves each revision, after the designers have had a week to comment on a draft.

The comment week matters more than the signature. Designers who have read a draft and had their objections answered are far more likely to follow the result than designers who meet it for the first time on release. In the office's first comment round, eleven comments arrived. Six led to changes, mostly clearer wording. Three were declined with reasons recorded in the revision history. Two were requests for new rules that the administrator judged premature and added to the request list for the next review. Every commenter received a short reply saying what had happened to their comment.

Approval also defines the boundary of the administrator's authority. The charter in Chapter 1 lets the administrator reject changes to shared items that bypass the request list, but the content of the standard is the engineering manager's decision. That separation keeps the administrator out of arguments about whose preferences should win and puts design-practice decisions with the person responsible for design.

## Control the standard like a drawing

The written standard is a controlled document. It carries a revision letter, a date, an owner and a revision history. Changes go through the request list described in Chapter 1 and are released together at intervals rather than edited continuously. The current revision lives in one place, linked from the register, and printed copies are marked as uncontrolled.

That may sound heavy for an 18-page document in a six-person office, but it costs little and prevents the drift that made the first draft unusable. It also gives the office a record. When a designer asks why a rule exists, the revision history shows when it was added and which incident prompted it.

## Say what the standard does not cover

Section 1 should state the scope plainly, including its limits. The running case office's standard applies to new files and to existing files when they are revised. It does not require old released files to be brought up to date, for the reasons given in Chapters 3 and 5: changing released files without a revision is worse than leaving them as they are. Saying so in the standard prevents two opposite mistakes, a checker rejecting a small revision because the untouched parts of an old file do not meet the new rules, and a designer assuming that old files are good examples to copy.

The office's wording became: "When revising a file made before revision A of this standard, bring the features and properties you change into line with this standard, and record in the revision description that the rest of the file predates it." That sentence turned an awkward judgement into a routine one.

The scope should also say what the standard is not. It is not a design manual: it says how files are built, not whether a design is adequate. It is not a substitute for the drawing standard or for engineering approval. Stating these limits protects the standard from being stretched into roles it cannot fill, and protects the office from treating a compliant file as an approved design.

## Keep a short abbreviations list

Descriptions limited to 40 characters need abbreviations, and abbreviations invented on the spot multiply. The office found "GALV", "GALVD", "GAL" and "HDG" used for galvanised finishes, which are not all the same thing. The appendix now holds a list of about 60 abbreviations with their meanings, covering materials, finishes, part types and common terms such as LH and RH.

The list is short on purpose. It contains only abbreviations the office actually uses, and new ones are added through the change process rather than invented by individuals. A designer who needs an abbreviation that is not on the list asks for it, and the list grows from need rather than from someone's attempt to anticipate every term.

## Test the standard on someone new

The best test of a standard is a person who has not helped to write it. When the graduate joined, the administrator asked them to read the revised standard and then build a simple part, a cross-member, without help. The graduate's questions showed where the document was unclear. Two rules used terms the graduate did not know, the description convention lacked an example for purchased parts, and the location of the library was described in a way that only made sense to someone who already knew it.

Each of those gaps took minutes to fix. Without the test, they would have stayed, and each new starter would have learned the answers by asking colleagues, which is exactly the informal route the written standard is supposed to replace. Repeat the test whenever someone joins, and treat their questions as the most useful review the document will get.

## Make it known, not just available

Publishing the standard to a shared folder does not mean anyone has read it. The running case office introduced the revised standard in a one-hour session in which the administrator walked through sections 2 to 7 using the office's own files as examples. Each person then checked one of their own recent models against section 4 and reported what they found, which turned the session into practice rather than a lecture.

New starters read the standard in their first week and then spend an hour with the administrator going through a model they have built. Chapter 10 describes how this fits into wider training. A signed acknowledgement that someone has read the standard proves very little; a model checked against it proves a great deal more.

## Exercise: decide what goes in

The engineering manager proposes adding three items to the standard: (a) the full list of 31 controlled settings with their values; (b) a rule that every weldment drawing includes a cut list; (c) a two-page tutorial on creating sheet metal flanges. The standard is currently 18 pages, about 5,400 words. Which items belong, and what happens to the reading time if all three are added in full at about 300 words a page, assuming (a) takes 3 pages?

**Answer.** Item (a) is enforced by the settings file; the standard should name the file, summarise what it controls and explain the principle, not list values. Item (b) is a drawing rule that software does not enforce automatically, so it belongs in section 6 as a checkable rule with a reason. Item (c) is tuition and belongs in training material.

Adding all three in full would add about **3 + 0.1 + 2 = 5.1 pages**, roughly **1,530 words**, giving about **6,930 words** and a reading time of about **6,930 ÷ 220 ≈ 31.5 minutes**, just over the 30-minute budget. Adding only (b), a few lines, keeps the standard at about 25 minutes. The budget does its job: it makes the office decide where each item belongs.
