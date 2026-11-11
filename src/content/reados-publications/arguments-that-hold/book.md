---
title: "Arguments That Hold"
subtitle: "Logic for engineering decisions: checkable claims, conditions, valid inference, evidence and written justifications"
description: "Practical logic for engineers: turn opinions into checkable claims, read conditions correctly, spot invalid inferences, weigh evidence and write a justification that survives review."
category: Engineering
tags: [design, quality, validation, communication]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-11
referencesChecked: 2026-11-11
edition: "1"
level: "Intermediate engineering practice"
audience: "Engineers, reliability and quality staff, supervisors and technical managers who must reason from incomplete evidence to decisions that others will review, challenge and act on."
outcomes:
  - "Rewrite vague opinions as claims with a quantity, a scope and a condition that evidence can test."
  - "Read and write conditional requirements correctly, separating necessary from sufficient conditions."
  - "Recognise valid inference forms and the common slips that imitate them in fault-finding."
  - "Judge what a sample, a test or a period without failures can and cannot support."
  - "Write an engineering justification with explicit grounds, warrant, qualifier and limits."
coverVariant: category
references:
  - title: "The Cambridge Companion to Abelard, chapter 5, Logic"
    creator: "Christopher J. Martin, in Jeffrey E. Brower and Kevin Guilfoy (eds); Cambridge University Press"
    year: "2004 (Cambridge Companions Online 2006)"
    note: "Supplied source. Martin's account of Abelard's view that an entailment needs both necessity and a relevant connection, and that a locus is what warrants an inference, informed Chapters 5 and 6. Paraphrased; the book's structure, case and exercises are original."
  - title: "Peter Abelard, Stanford Encyclopedia of Philosophy"
    creator: "Peter King and Andrew Arlig"
    year: "first published 2004; substantive revision 2026"
    url: "https://plato.stanford.edu/entries/abelard/"
    note: "General reference for Abelard's logic and its place in twelfth-century dialectic. Background only."
  - title: "The Uses of Argument"
    creator: "Stephen E. Toulmin; Cambridge University Press"
    year: "1958; updated edition 2003"
    note: "Source of the claim, grounds, warrant, backing, qualifier and rebuttal layout adapted in Chapter 8. The layout is described in the book's own words and applied to an original case."
  - title: "Causes and Conditions, American Philosophical Quarterly, vol. 2, no. 4, pp. 245–264"
    creator: "J. L. Mackie"
    year: "1965"
    note: "Source of the account of a cause as a non-redundant part of a sufficient set of conditions, summarised in Chapter 2 and used in Chapter 7 to test several conditions together."
  - title: "A System of Logic, Ratiocinative and Inductive"
    creator: "John Stuart Mill"
    year: "1843"
    note: "Origin of the methods of agreement and difference used informally in Chapter 7 to compare the two conveyor drives."
  - title: "Choosing a Sampling Plan with a given OC Curve, NIST/SEMATECH e-Handbook of Statistical Methods, section 6.2.3.2"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://itl.nist.gov/div898/handbook/pmc/section2/pmc232.htm"
    note: "Background for the operating characteristic of a sampling plan in Chapter 4. The case's certificate and lot are invented."
  - title: "Two-Sample t-Test for Equal Means, NIST/SEMATECH e-Handbook of Statistical Methods, section 1.3.5.3"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://itl.nist.gov/div898/handbook/eda/section3/eda353.htm"
    note: "Background for the trial and hardness comparisons in Chapters 6 and 7. The data are invented."
  - title: "Exponential life distribution (or HPP model) tests, NIST/SEMATECH e-Handbook of Statistical Methods, section 8.3.1.1"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://itl.nist.gov/div898/handbook/apr/section3/apr311.htm"
    note: "Background for the reliability demonstration test in Chapter 8, including its constant failure rate assumption, which the chapter shows does not fit gear tooth fatigue."
  - title: "ISO 6336 (calculation of load capacity of spur and helical gears); ANSI/AGMA 2001 (fundamental rating factors and calculation methods for involute spur and helical gear teeth)"
    creator: "ISO; AGMA"
    year: "current editions"
    note: "Named by number and scope only. The Lewis calculation in Chapter 5 is a screening comparison, not a gear rating; real gear drives should be rated to one of these methods. No values are taken from either document."
related:
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Shaft Alignment by the Numbers"
    href: "/reados/publications/shaft-alignment-by-the-numbers/"
---

## About this book

Engineering decisions are made by argument. Someone says why a part failed, why a design is adequate, why a test result means what it means, or why a change is safe. Others accept the argument, challenge it or act on it. Most of the time nobody calls this logic, but that is what it is, and the same few mistakes recur in failure investigations, design reviews and acceptance decisions everywhere.

This book teaches the parts of logic that engineers use, applied to engineering evidence. It takes its starting point from Peter Abelard, the twelfth-century logician whose work on conditional statements and inference was among the most advanced of his age. Two of his ideas run through the book. First, that an inference needs a warrant: if someone claims that one thing follows from another, it is fair to ask in virtue of what it follows. Second, that a genuine consequence requires a real connection between the claims, not just a pattern that happens to hold. Both ideas are as useful in a breakdown investigation as they were in a medieval classroom.

## Who it is for and how to use it

The book is for engineers, reliability and quality staff, supervisors and technical managers who reason from evidence to decisions that other people will review. It assumes basic engineering calculation and a little statistics, but no formal logic.

Read the chapters in order. Chapters 1 to 3 cover claims, conditions and inference forms. Chapter 4 covers what samples and periods without failure can support. Chapters 5 and 6 cover where arguments get their force and why a connection must be real. Chapter 7 brings the methods together to eliminate causes, and Chapter 8 shows how to write the conclusion as a justification that survives review. Each chapter ends with an exercise and a worked answer.

Several BIZOMAT tools carry the calculations: gear tooth forces, Lewis bending stress, acceptance sampling probability, process change trial, two-sample comparison and reliability demonstration test planning. Each chapter states what the tool calculates and the limits of its model, because a tool's model is itself a warrant, and an argument is only as good as its warrant.

## The running case

This is an illustration. A bulk materials depot runs two belt conveyors, C1 and C2, with identical drives. Each drive has a motor turning an 18-tooth spur pinion, module 4 mm, 40 mm face width and 72 mm pitch diameter, at 1,450 rpm, meshing with a 63-tooth wheel. For years both drives ran with 11 kW motors and pinions from one supplier, made to a drawing that calls for through-hardened steel at 280 to 320 HB.

Over six months, several things change on C1. The conveyor is extended and its motor upgraded to 15 kW. Its drive base is moved and re-grouted. Purchasing switches pinions to a new supplier. A site-wide change of gear lubricant follows. Then three pinions on C1 lose teeth in ten weeks. C2, which received one of the new supplier's pinions in a routine change, has not failed.

Everyone at the depot has an explanation. The book follows the investigation from those explanations to a written justification for the fix, using each chapter's method on the same evidence.

All companies, people, values, measurements and test results in the case are invented for teaching. They are not BIZOMAT work, and the gear calculations are screening comparisons, not ratings for any real drive.

## Source limits and professional responsibility

This book is educational. It teaches reasoning, not gear design. Failure investigations, equipment ratings and decisions affecting safety need competent people, manufacturers' data and the applicable standards, and are governed by your organisation's procedures and the work health and safety law of your jurisdiction. Statistical methods are applied here to small invented data sets to show the reasoning; real decisions need data collected for the purpose.

The supplied source on Abelard informed the treatment of warrants and relevance. The structure, case, calculations and exercises are original. Standards are named by number and scope only.
