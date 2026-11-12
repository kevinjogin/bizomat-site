---
title: "Exact Words for Real Parts"
subtitle: "Bertrand Russell's analytical method applied to one machined bracket, from a customer's complaint to a certificate that can be checked"
description: "Use Russell's analysis, theory of descriptions, logical constructions, types, vagueness, structure and atomic facts to write engineering requirements and records that can be checked."
category: Ideas
tags: [quality, communication, validation, design]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: draft
publishDate: 2026-11-13
referencesChecked: 2026-11-13
edition: "1"
level: "Intermediate professional practice"
audience: "Engineers, inspectors, quality leads and technical managers who write or rely on drawings, inspection records and certificates, and want a disciplined way to say exactly what a requirement or a record claims."
outcomes:
  - "Analyse a vague complaint or requirement into simple statements that a measurement can settle."
  - "Test every definite description in a drawing, procedure or record for existence and uniqueness."
  - "Separate what was measured directly from what is known only through a chain of records."
  - "Treat derived quantities such as a hole centre as constructions, and check how they were constructed."
  - "Keep items, collections, documents and registers at separate levels so that lists cannot loop."
  - "Write records as atomic results, and state the completeness claim that every certificate of conformance makes."
coverVariant: category
references:
  - title: "On Denoting, Mind, New Series, vol. 14, no. 56, pp. 479–493"
    creator: "Bertrand Russell"
    year: "1905"
    url: "https://en.wikisource.org/wiki/On_Denoting"
    note: "Primary source for the theory of definite descriptions used in Chapter 2: the analysis of 'the F is G' into existence, uniqueness and predication, and the two scopes of negation. Paraphrased."
  - title: "The Problems of Philosophy"
    creator: "Bertrand Russell"
    year: "1912"
    url: "https://www.gutenberg.org/ebooks/5827"
    note: "Primary source for the distinction between knowledge by acquaintance and knowledge by description (chapter 5 of Russell's book), applied in Chapter 3. Paraphrased."
  - title: "Mysticism and Logic and Other Essays"
    creator: "Bertrand Russell"
    year: "1918"
    url: "https://www.gutenberg.org/ebooks/25447"
    note: "Contains 'The Relation of Sense-data to Physics' (1914), the source of the maxim that logical constructions should replace inferred entities wherever possible, used in Chapter 4, and the 1911 essay on acquaintance and description used in Chapter 3. Paraphrased; the maxim is quoted once."
  - title: "Our Knowledge of the External World as a Field for Scientific Method in Philosophy"
    creator: "Bertrand Russell"
    year: "1914"
    url: "https://www.gutenberg.org/ebooks/37090"
    note: "Background for Russell's method of analysis, from a complex datum back to simpler premises, applied in Chapter 1. Paraphrased."
  - title: "Vagueness, Australasian Journal of Psychology and Philosophy, vol. 1, no. 2, pp. 84–92"
    creator: "Bertrand Russell"
    year: "1923"
    note: "Source for Chapter 6: Russell's argument that every representation, including a measurement, is vague to some degree, and that precision is a matter of degree. DOI 10.1080/00048402308540623. Paraphrased; no passage reproduced."
  - title: "The Philosophy of Logical Atomism, The Monist, vols. 28 and 29"
    creator: "Bertrand Russell"
    year: "1918–1919"
    note: "Source for Chapter 8: atomic and molecular propositions, and Russell's argument that general and negative facts cannot be reduced to a list of atomic ones. Paraphrased."
  - title: "Mathematical Logic as Based on the Theory of Types, American Journal of Mathematics, vol. 30, no. 3, pp. 222–262"
    creator: "Bertrand Russell"
    year: "1908"
    note: "Source for the theory of types and the vicious-circle principle summarised in Chapter 5. Paraphrased."
  - title: "Mr. Russell's 'Causal Theory of Perception', Mind, vol. 37, no. 146, pp. 137–148"
    creator: "M. H. A. Newman"
    year: "1928"
    note: "Source of the objection to Russell's structuralism, in The Analysis of Matter (1927), that a bare claim of shared structure is almost empty unless the relations are fixed in advance. Used in Chapter 7 to explain why a best-fit alignment can hide a real error."
  - title: "The Cambridge Companion to Bertrand Russell"
    creator: "Nicholas Griffin (editor); Cambridge University Press"
    year: "2003"
    note: "Supplied source. The introduction and the chapters on analysis, descriptions, the theory of types, logical atomism, structuralism and knowledge by acquaintance were read for orientation and to check claims about Russell's development. No passages, chapter structure, examples or arguments specific to the Companion are reproduced; claims about Russell are checked against his own texts."
  - title: "Russell's Paradox, Stanford Encyclopedia of Philosophy (Spring 2005 edition)"
    creator: "A. D. Irvine"
    year: "2003 (archived edition)"
    url: "https://plato.stanford.edu/archives/spr2005/entries/russell-paradox/"
    note: "General reference for the history of the paradox, its discovery in 1901 and the letter to Frege in 1902, used in Chapter 5."
  - title: "Russell's Logical Atomism, Stanford Encyclopedia of Philosophy (Spring 2006 edition)"
    creator: "Stanford Encyclopedia of Philosophy"
    year: "2005 (archived edition)"
    url: "https://plato.stanford.edu/archives/spr2006/entries/logical-atomism/"
    note: "General reference for the dates and scope of Russell's logical atomism, used in Chapter 8."
  - title: "ASME Y14.5-2018, Dimensioning and Tolerancing"
    creator: "American Society of Mechanical Engineers"
    year: "2018"
    note: "Named by number and scope only, for the position tolerance, datum reference frame and material condition concepts used in Chapters 1, 4 and 7. No clause or value is quoted."
  - title: "ISO 14253-1:2017, Geometrical product specifications (GPS): Inspection by measurement of workpieces and measuring equipment, Part 1: Decision rules for verifying conformity or nonconformity with specifications"
    creator: "International Organization for Standardization"
    year: "2017"
    note: "Named by number and scope only, as the standard that governs decision rules when a reading falls near a limit (Chapter 6). The book's one-uncertainty guard band is the BIZOMAT tool's simple rule, not a statement of the standard's requirements."
related:
  - title: "Arguments That Hold"
    href: "/reados/publications/arguments-that-hold/"
  - title: "Bills of Materials by the Numbers"
    href: "/reados/publications/bills-of-materials-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
---

## About this book

Most engineering failures that reach a customer are not failures of calculation. The stress was right and the tolerance was sensible. What went wrong was a sentence: a drawing note that pointed at two features, a record that reported a measurement nobody made, a certificate that claimed more than its evidence. Bertrand Russell spent the first quarter of the twentieth century building tools for exactly this problem. He wanted to know what a sentence really claims, what would make it true, and how a complex claim breaks down into simple ones that can each be checked.

This book takes those tools out of the philosophy seminar and puts them to work on one machined part. It is written for engineers, inspectors, quality leads and technical managers who write requirements and records, or who sign on the strength of them. It assumes no background in philosophy or formal logic. It assumes you can read a drawing with a position tolerance and follow a simple calculation.

Each chapter takes one idea of Russell's, states it in plain terms, and applies it to the running case with real numbers:

1. analysis, from a vague complaint to simple checkable statements;
2. definite descriptions, and the hidden claims in the word "the";
3. knowledge by acquaintance and by description, or measured against reported;
4. logical constructions, such as a hole centre built from probe points;
5. classes and types, and why lists that contain themselves break;
6. vagueness, and the borderline part that no measurement can settle;
7. structure, and why a best-fit alignment can make any pattern look good;
8. atomic facts, and what a certificate of conformance actually asserts.

## How to use the book

Read the chapters in order the first time, because each one carries the case forward. Every chapter ends with an exercise and a worked answer. Where a BIZOMAT tool performs a calculation the chapter uses, the text links to it and says what it does and does not calculate. The tools check numbers; none of them decides what a sentence means.

The book is a companion to [Arguments That Hold](/reados/publications/arguments-that-hold/), which deals with conditions, inference and evidence. This book deals with an earlier step: making sure each statement says one definite thing before anyone argues from it.

## The running case

This is an illustration. A small contract machining workshop in regional Australia makes 60 aluminium camera brackets, part CB-12, for a builder of packaging-line inspection stations. The price is A$85 per bracket excluding GST, so the order is worth A$5,100 excluding GST, or A$5,610 including 10% GST. Each bracket is a 6061-T6 plate, 120 × 80 × 12 mm, with a central bore, a dowel hole and four clearance holes for M6 screws on a 90 mm pitch circle. The customer mounts one bracket on each of six camera modules per line, across ten lines.

Thirty brackets reach the customer's fitter and will not take their screws. The workshop's certificate of conformance says all 60 conform. The book follows the investigation from the complaint to a corrected certificate. The workshop, the customer, the drawing, the prices and every measurement are invented for teaching. They are not a real organisation, and they are not BIZOMAT work, clients or claims.

## An independent treatment

Russell's ideas are taken from his own writings, cited by title and year so that you can read them. Short paraphrases are used throughout, and his words are quoted only where the exact wording matters. Most of the works cited were published before 1929 and are freely readable online; their copyright status differs between countries, and in Australia Russell's works remain in copyright, so the book does not reproduce them. *The Cambridge Companion to Bertrand Russell*, supplied for this book, was read for orientation and is credited; its text, structure and examples are not reproduced. The book uses Russell's methods and does not argue for or against his wider philosophy, which changed several times over his career.

The engineering is deliberately ordinary: position tolerances, measurement uncertainty, inspection plans and bills of materials. Geometric tolerancing and decision rules are governed by standards such as ASME Y14.5 and ISO 14253-1, which the book names but does not quote.

This book is educational. It is not engineering, quality-system or legal advice. Drawings, inspection plans and certificates of conformance carry contractual and sometimes regulatory weight. Real decisions about them belong to competent people working to the applicable standards, the contract and their own quality system, with qualified review where the consequences warrant it.
