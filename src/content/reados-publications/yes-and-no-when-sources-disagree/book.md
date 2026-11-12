---
title: "Yes and No: When Engineering Sources Disagree"
subtitle: "Reconciling conflicting data sheets, drawings, standards, spreadsheets and test results before they reach the job"
description: "A method for resolving conflicting engineering sources: test meanings, copies, origins, conditions and measurements, then decide, record the reasons and correct the sources."
category: Engineering
tags: [design, quality, validation, communication, systems]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-11
referencesChecked: 2026-11-11
edition: "1"
level: "Intermediate engineering practice"
audience: "Design, maintenance and quality engineers, supervisors and technical officers who must act on documents, data sheets and test results that do not agree with each other."
outcomes:
  - "Set out a conflict between sources as a register of exact claims, with their conditions and origins."
  - "Separate real contradictions from differences of wording, units, revision, provenance and conditions of use."
  - "Use calculation and measurement to test which reading of a conflicting source is true for the job."
  - "Decide an unresolved conflict by authority, consequence and evidence, and record the decision and its limits."
  - "Close the question by correcting, superseding or annotating every source that caused it."
coverVariant: category
references:
  - title: "From Sic et Non, 1120 (extract)"
    creator: "Peter Abelard; Internet Medieval Sourcebook, ed. Paul Halsall, Fordham University"
    year: "c. 1120; online 1998"
    url: "https://sourcebooks.web.fordham.edu/source/1120abelard.asp"
    note: "Public-domain extract of the prologue. Its list of reasons why authorities appear to disagree (shared words with different meanings, copying errors, misattributed works, reported opinions, retractions) supplies the plan of Chapters 2 to 5. Paraphrased; nothing is quoted."
  - title: "Prologue to Sic et Non"
    creator: "Peter Abelard, translated by Wendy Lewis; Internet Medieval Sourcebook, Fordham University"
    year: "c. 1120; translation online"
    url: "https://sourcebooks.web.fordham.edu/source/Abelard-SicetNon-Prologue.asp"
    note: "Fuller translation, read for the prologue's emphasis on unfamiliar usage and different meanings of the same word. Used for background only; no passage is reproduced."
  - title: "The Cambridge Companion to Abelard"
    creator: "Jeffrey E. Brower and Kevin Guilfoy (eds); Cambridge University Press"
    year: "2004 (Cambridge Companions Online 2006)"
    note: "Supplied source. The introduction and John Marenbon's chapter on Abelard's life and contexts informed the description of Sic et non as a working collection of opposed authorities. The book's structure, prose, case and exercises are original; nothing is copied."
  - title: "Guide for the Use of the International System of Units (SI), NIST Special Publication 811, 2008 edition"
    creator: "Ambler Thompson and Barry N. Taylor, National Institute of Standards and Technology"
    year: "2008"
    url: "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication811e2008.pdf"
    note: "Reference for the kilogram-force and standard gravity (9.80665 m/s²) used in the unit-conversion check in Chapter 3."
  - title: "Two-Sample t-Test for Equal Means, NIST/SEMATECH e-Handbook of Statistical Methods, section 1.3.5.3"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://itl.nist.gov/div898/handbook/eda/section3/eda353.htm"
    note: "Background for comparing two sets of preload measurements in Chapter 6. The case data are invented."
  - title: "Model Code of Practice: How to manage work health and safety risks"
    creator: "Safe Work Australia"
    year: "current model code"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-how-manage-work-health-and-safety-risks"
    note: "Background for treating a residual hazard from an unresolved technical conflict as a work health and safety risk in Chapter 7. Readers must apply the code adopted in their own jurisdiction."
  - title: "ASME Boiler and Pressure Vessel Code, Section VIII, Division 1, Mandatory Appendix 2; ASME PCC-1, Guidelines for Pressure Boundary Bolted Flange Joint Assembly"
    creator: "ASME"
    year: "current editions"
    note: "Named by number and scope only. The flange bolt-load method used by the BIZOMAT tool in Chapters 5 and 7 follows the Appendix 2 approach; PCC-1 is the usual guide to assembly practice. No clause, table or value from either document is reproduced, and the gasket factors in the case are invented."
related:
  - title: "Bolted Joints by the Numbers"
    href: "/reados/publications/bolted-joints-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Engineering Design Practice"
    href: "/reados/collections/engineering-design-practice/"
---

## About this book

Engineering work runs on documents written by other people: data sheets, drawings, standards, manuals, spreadsheets, test reports and the laminated cards on the workshop wall. Most of the time they agree. When they do not, someone has to decide which one to follow, and the decision is often made at the job by whoever is holding the spanner.

This book is about making that decision deliberately. It takes its method from an unexpected place. In the early 1120s the logician Peter Abelard compiled *Sic et non*, "Yes and No": a collection of passages from respected authorities that seemed to give opposite answers to the same questions. In his prologue he listed reasons such passages can appear to disagree without either author being careless. A word can carry a different meaning in each. A copyist can introduce an error. A text can be attributed to someone who never wrote it. A writer can report another person's view without holding it, or later withdraw an opinion. His advice was to look for these explanations before deciding that an authority was simply wrong, and to treat doubt as the start of an inquiry rather than the end of one.

Engineers need one more explanation on the list: two statements can each be right under different conditions. Every one of these explanations has an engineering equivalent. Torque values differ because one assumes dry threads and the other lubricated threads. A drawing note loses its unit when it is retyped. A spreadsheet cites "the standard" for a number that came from somewhere else. A gasket maker and a pump maker each state a limit that is right for their own part. The method in this book works through those explanations in order, tests each with calculation or measurement, and keeps a record of what was decided and why.

## Who it is for and how to use it

The book is for engineers, technical officers, supervisors and quality staff who already read drawings and data sheets and can follow a short calculation. No knowledge of medieval philosophy is needed; Abelard supplies the checklist, not the content.

Read the chapters in order the first time. Chapter 1 sets up a conflict register. Chapters 2 to 6 each test one explanation for a disagreement: meaning, copying, origin, conditions and measurement. Chapter 7 covers the conflicts that survive those tests, and Chapter 8 closes the question and corrects the sources. Each chapter ends with an exercise and a worked answer.

The calculations use several BIZOMAT tools, including the bolt torque and preload, gasketed flange bolt load, bolted joint temperature, bolt preload verification, two-sample comparison and risk rating tools. Each chapter states exactly what the tool calculates and where its model stops.

## The running case

This is an illustration. A process plant is replacing the discharge spool on a cooling-water pump skid. The spool has three DN100 flanged joints, each with eight M16 × 2 bolts of property class 8.8 and a compressed-fibre gasket. Joint J1 bolts the spool to the pump's grey cast iron discharge flange. Joints J2 and J3 are steel-to-steel joints at a valve and the downstream pipe.

The maintenance planner asks one plain question: what should the flange bolts be tightened to? Five sources answer it, and they give five different numbers. The book follows that question from the first conflicting answer to a decision, a verified assembly and a corrected set of documents.

All companies, documents, values, test results and costs in the case are invented for teaching. They are not BIZOMAT work, and they are not recommended tightening values for any real joint.

## Source limits and professional responsibility

This book is educational. It teaches a way of handling disagreement between sources; it does not supply design data. Bolted joints on pressure equipment, cast components and anything whose failure could injure people need the manufacturer's current instructions, the applicable standards and the review or approval of a competent person under your organisation's procedures and the work health and safety law of your jurisdiction.

Standards are named by number and scope only. Where a calculation follows a code method, the gasket factors and allowable stresses are invented inputs, not values from the code. The supplied source on Abelard informed the framing; the structure, case, calculations and exercises are original.
