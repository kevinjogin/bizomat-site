---
title: "Testing Welded Joints by the Numbers"
subtitle: "Tensile, bend, hardness, impact, macro and non-destructive tests, measurement, variation and sampling, from the 1910 Illinois weld tests to modern qualification"
description: "Plan, run and read weld tests with numbers: joint efficiency, measurement uncertainty, scatter and sample size, bend strain, hardness, impact, macro, NDT, sampling and qualification."
category: Manufacturing
tags: [manufacturing, quality, validation, process-improvement, operations]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-25
referencesChecked: 2026-10-25
edition: "1"
level: "Intermediate welding quality, inspection and engineering"
audience: "Welding supervisors, quality managers, inspectors, fabrication engineers and students who commission, interpret or rely on weld test results and need to know what a result does and does not prove."
outcomes:
  - "Calculate stresses, joint efficiency, bend strain and averages from weld test data, and state the uncertainty in each."
  - "Judge how many specimens or welds must be tested, and what a sample can and cannot reveal about the rest."
  - "Explain what tensile, bend, hardness, impact and macro tests each reveal about a welded joint."
  - "Choose non-destructive testing methods and sampling levels, and estimate the chance that a defect is found."
  - "Plan a procedure qualification test and the records that make test results trustworthy."
coverVariant: category
references:
  - title: "The Strength of Oxyacetylene Welds in Steel (University of Illinois Engineering Experiment Station, Bulletin 45)"
    creator: "Herbert L. Whittemore"
    year: "1910"
    note: "Historical source for one of the earliest systematic studies of weld strength: the definition of weld efficiency, the efficiencies of twelve welded strips, the effect of rough weld surfaces on measured area, the comparison of ground and unground specimens and the testing method. Its results are summarised and analysed in new words; no text, tables or illustrations are reproduced."
  - title: "Welding: Theory, Practice, Apparatus and Tests (electric, thermit and hot-flame processes)"
    creator: "Richard N. Hart (McGraw-Hill, New York)"
    year: "1910"
    note: "Historical source for early test reports on welds and for Hart's caution that test and cost data should be taken with a grain of salt. Summarised in new words."
  - title: "Electric Arc Welding"
    creator: "E. Wanamaker and H. R. Pennington (Simmons-Boardman Publishing)"
    year: "1921"
    note: "Historical background on tests of metallic arc welded joints in ship plate around 1920, consulted for context. Summarised in new words."
  - title: "Spot and Arc Welding"
    creator: "H. A. Hornor (J. B. Lippincott, Philadelphia)"
    year: "1920"
    note: "Historical source for the 1919 tensile tests comparing spot-welded and riveted attachments, cited in Chapter 1. Summarised in new words."
  - title: "ISO 15614-1, Specification and qualification of welding procedures for metallic materials, welding procedure test, Part 1: arc and gas welding of steels and arc welding of nickel and nickel alloys"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named in Chapter 10 by number and scope. No content or values are reproduced."
  - title: "ISO 4136 (transverse tensile test), ISO 5173 (bend tests), ISO 9015-1 (hardness test on arc welded joints), ISO 9016 (impact tests on welds) and ISO 17639 (macroscopic and microscopic examination of welds)"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Destructive test standards for welds, named in Chapters 2, 5, 6, 7 and 8 by number and scope. No content or values are reproduced."
  - title: "ISO 17637, Non-destructive testing of welds: visual testing of fusion-welded joints; ISO 5817 and AS/NZS ISO 5817, quality levels for imperfections in fusion-welded joints"
    creator: "International Organization for Standardization; Standards Australia"
    year: "current editions"
    note: "Named in Chapters 8 and 9 by number and scope, including ISO 5817's quality levels B, C and D. No content or values are reproduced."
  - title: "AS/NZS 1554.1, Structural steel welding, welding of steel structures; AS/NZS 2980 and ISO 9606-1, qualification of welders"
    creator: "Standards Australia and Standards New Zealand; International Organization for Standardization"
    year: "current editions"
    note: "Named in Chapters 9 and 10 by number and scope. No content or values are reproduced."
  - title: "ISO 6892-1 (tensile testing of metallic materials), ISO 148-1 (Charpy pendulum impact test) and ISO 18265 (conversion of hardness values)"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Material test standards named in Chapters 2, 6 and 7 by number and scope. No content or values are reproduced."
  - title: "ISO 9712 (qualification and certification of NDT personnel), ISO 3834 series (quality requirements for fusion welding) and ISO 14731 (welding coordination, tasks and responsibilities)"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Named in Chapters 9 and 10 by number and scope. No content is reproduced."
related:
  - title: "Weld Repairs That Hold"
    href: "/reados/publications/weld-repairs-that-hold/"
  - title: "Arc Welding by the Numbers"
    href: "/reados/publications/arc-welding-by-the-numbers/"
  - title: "Welded joints for fabricators"
    href: "/reados/collections/manufacturing-operations-and-design-for-manufacture/welded-joints-for-fabricators/"
---

## About this book

A weld test is a question asked of a piece of metal. Is this joint as strong as the plate? Will it bend without cracking? Is the heat-affected zone too hard? Will it stay tough in the cold? Is there a crack inside it? Each test answers its own question, about the specimen tested, with a certain precision. The skill in using tests is knowing which question each one answers, how precise the answer is, and how far it can be stretched to the welds that were not tested.

This book is for welding supervisors, quality managers, inspectors, fabrication engineers and students who commission tests, read test reports or rely on them. It assumes basic familiarity with welding and with simple algebra and statistics in SI units. It does not reproduce the test methods or acceptance criteria in standards, which must be read in full and applied as written. It explains, with numbers, what the results mean.

## A 1910 bulletin as a starting point

In 1910, Herbert L. Whittemore of the University of Illinois Engineering Experiment Station published *The Strength of Oxyacetylene Welds in Steel*, one of the first systematic studies of how strong welds actually were. He welded strips of steel plate, cut them into specimens, pulled them apart in a testing machine and expressed each result as an efficiency: the strength of the welded specimen as a percentage of the unwelded plate.

His results were variable, and his discussion of why is as valuable as the results themselves. Some strips averaged around half the plate's strength, others over three-quarters, and individual specimens ranged more widely still. Rough weld surfaces made the cross-section hard to measure and produced apparent efficiencies over 100%. Grinding the surface smooth reduced the scatter. His bulletin is a lesson in specimen preparation, measurement and variation, the subjects that decide whether a test result means anything. Richard N. Hart, writing the same year, put the same caution in one line: test and cost data must be taken with a grain of salt.

## The running case

This is an illustration. A structural fabricator builds mining hoppers from 12 mm steel plate, with full-penetration butt welds in the shell and fillet welds attaching stiffeners. The customer requires the butt-weld procedure to be qualified by testing, the welders to be qualified, and production welds to be inspected. Through the book, the fabricator plans and reads its tests: tensile, bend, hardness, impact and macro tests on the qualification plate, and visual and non-destructive testing of production welds, with the statistics and sampling behind each decision.

The fabricator, the hoppers, test results and costs are invented for teaching. They are not KEVOS® work, and the results are not values from any standard or acceptance criteria for any product.

## How to use the book

Chapter 1 asks what a test can prove. Chapters 2 to 4 cover the tensile test, measurement uncertainty and the variation between specimens, using Whittemore's results. Chapters 5 to 8 cover bend, hardness, impact and macro and visual examination. Chapter 9 deals with non-destructive testing and sampling, and Chapter 10 with procedure qualification, records and the cost of testing. Every chapter ends with an exercise and its worked answer.

## Limits and professional responsibility

This book is educational. Testing for qualification, certification or acceptance must follow the applicable standards and specifications in full, be carried out by competent people and, where required, by accredited laboratories, and be interpreted against the acceptance criteria those documents set. In Australia, structural steel welding is covered by the AS/NZS 1554 series and welder qualification by AS/NZS 2980 with ISO 9606-1, among others. Test results support engineering judgement; they do not replace it.

## An original treatment

The Library covers welding procedures and inspection for repairs in [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/procedures-welders-and-inspection/) and arc welding practice in [Arc Welding by the Numbers](/reados/publications/arc-welding-by-the-numbers/). This book concentrates on testing. The explanations, the hopper case, the calculations, figures and exercises are original KEVOS® writing. The historical works are public-domain works in the United States; their results are summarised and analysed in new words, and none of their text, tables or illustrations is reproduced.
