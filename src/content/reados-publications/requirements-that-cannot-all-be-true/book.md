---
title: "Requirements That Cannot All Be True"
subtitle: "Finding contradictory, physically impossible and improbable requirements in a specification before the design starts"
description: "How to test a specification for requirements that contradict each other, break a physical law together or are achievable only by luck, and how to rewrite it so a design can meet it."
category: Engineering
tags: [design, validation, quality, systems, communication]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-11
referencesChecked: 2026-11-11
edition: "1"
level: "Intermediate engineering practice"
audience: "Design, project and applications engineers, estimators and technical managers who receive, write or quote against specifications for machines, fixtures and equipment."
outcomes:
  - "Sort conflicts in a specification into contradictory, physically impossible and improbable requirements."
  - "Find the linking premise, usually a physical law or a cost relation, that turns separate requirements into a conflict."
  - "Use critical speed, rated life, error budget and beam stiffness calculations to prove that a set of requirements cannot be met together."
  - "Recognise acceptance tests and tolerance stacks that a compliant design will usually fail, and fix the test rather than the design."
  - "Rewrite an impossible specification by restating what each requirement is for, and record the decision and who approved it."
coverVariant: category
references:
  - title: "The Cambridge Companion to Atheism, chapter 10 (The Argument from Evil) and chapter 12 (Impossibility Arguments)"
    creator: "Andrea M. Weisberger and Patrick Grim, in Michael Martin (ed.); Cambridge University Press"
    year: "2007 (Cambridge Collections Online)"
    note: "Supplied source. Grim's account of arguments that a set of specified attributes cannot all hold together, including the paradox of the stone, the boat example he takes from J. L. Cowan, and the escapes by redefinition and vagueness, supplies the book's framework. Weisberger's distinction between the logical and evidential forms of an argument, and her point that a contradiction needs an added premise, supplies the three kinds of conflict in Chapter 1. Paraphrased; the book takes no position on the religious questions the chapters address, and its structure, case and exercises are original."
  - title: "Evil and Omnipotence, Mind, vol. 64, no. 254, pp. 200–212"
    creator: "J. L. Mackie"
    year: "1955"
    note: "The added qualifying premise that turns a set of claims into a contradiction, as reported by Weisberger. Used in Chapter 1 for the idea of a linking premise. Background only."
  - title: "What is Process Capability?, NIST/SEMATECH e-Handbook of Statistical Methods, section 6.1.6"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm"
    note: "Source of the confidence bound on Cpk used by the BIZOMAT capability tool in Chapter 7. The case's study results are invented."
  - title: "ISO 3408 series (ball screws); ISO 230-2 (accuracy and repeatability of positioning of numerically controlled axes); ISO 1 (standard reference temperature for geometrical product specification)"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Named by number and scope only. Chapters 3 to 5 refer to ball screw ratings, axis positioning tests and the reference temperature for dimensions; no clause, table or tolerance value is taken from these documents, and the screw ratings and test results in the case are invented."
  - title: "What is misleading or deceptive conduct, ACCC small business toolkit"
    creator: "Australian Competition and Consumer Commission"
    year: "current guidance"
    url: "https://www.accc.gov.au/business/selling-products-and-services/small-business-toolkit/misleading-conduct-and-advertising/what-is-misleading-or-deceptive-conduct"
    note: "Background for Chapter 9's point that quoting a specification known to be impossible risks misleading the customer, and that a verbal claim can mislead even when contradicted in writing. General information only, not legal advice."
  - title: "Misleading conduct and advertising: introduction, ACCC small business education program"
    creator: "Australian Competition and Consumer Commission"
    year: "current guidance"
    url: "https://accc.gov.au/business/selling-products-and-services/small-business-education-program/misleading-conduct-and-advertising/introduction"
    note: "States that misleading or deceptive conduct, and false representations, are prohibited whether made to consumers or to other businesses. Background only; not legal advice."
  - title: "Model Code of Practice: How to manage work health and safety risks"
    creator: "Safe Work Australia"
    year: "current model code"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-how-manage-work-health-and-safety-risks"
    note: "Background for Chapter 8: requirements that protect people are settled under the duty to eliminate or minimise risks so far as is reasonably practicable, not ranked against cost or speed. Apply the code adopted in your own jurisdiction."
related:
  - title: "Checking Drawings by the Numbers"
    href: "/reados/publications/checking-drawings-by-the-numbers/"
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
  - title: "Whirling Shafts by the Numbers"
    href: "/reados/publications/whirling-shafts-by-the-numbers/"
---

## About this book

Most specifications are written one requirement at a time. Someone needs a long travel, someone else needs speed, quality wants accuracy, maintenance wants nothing to service, and purchasing sets a price. Each line is reasonable on its own. The trouble starts when the design team discovers that no machine can meet all of them at once, usually after the quote has been accepted.

This book is about finding that trouble early. It borrows a method from an unexpected place: the philosophy of religion. Philosophers there have long examined arguments that a being with a given set of attributes cannot exist, because the attributes cannot all hold together. Patrick Grim's survey of these impossibility arguments, and Andrea Weisberger's distinction between logical and evidential arguments, supply a precise vocabulary for a problem engineers meet every week. A specification is a list of attributes. The engineering question is the same as the philosophical one: can anything have all of them?

The book takes no side on the religious questions those chapters address. It uses only the structure of the arguments, and it applies that structure to machines, beams, screws, error budgets and acceptance tests.

## Who it is for and how to use it

The book is for design and applications engineers, project engineers, estimators and technical managers who quote against specifications, write them, or must tell a customer that one cannot be met. It assumes a working knowledge of machine elements, basic statistics and engineering calculation.

Read the chapters in order. Chapter 1 sets out three kinds of conflict. Chapter 2 deals with words that promise everything. Chapters 3 to 6 work through physical conflicts, one law at a time: critical speed, rated life, error budget and beam stiffness. Chapter 7 covers requirements that can be met but are unlikely to be shown to be met. Chapter 8 examines the ways an impossible specification gets defended, and Chapter 9 rewrites it and records the decision. Each chapter ends with an exercise and a worked answer.

BIZOMAT Tools carry the calculations: ball screw critical speed and duty-cycle life, the machine axis error budget, beam sizing, the capability confidence check, tolerance stack design, the two-option comparison and the change impact assessment. Each chapter states what the tool calculates and the limits of its model, including one case where the requirement lies outside the range a tool accepts.

## The running case

This is an illustration. A small machine builder is asked to quote for an automated inspection station. A fabrication customer wants to check the hole positions on welded frames up to 1,500 mm long. The station has one long horizontal axis: a carriage, driven by a ball screw, carries a touch probe along a fixed beam above the part. The customer's request for quote lists twelve requirements, including 1,500 mm of travel, a rapid traverse of 1.0 m/s, positioning accuracy of ±0.010 mm over the full travel in a workshop that runs from 15 to 35 °C, a beam no deeper than 120 mm and no heavier than 75 kg, a life of 20,000 hours, maintenance-free operation, zero backlash, an axis cost of no more than A$9,000 excluding GST, and a 30-run acceptance test that must show a capability index of at least 1.67 at 95% confidence.

The applications engineer who receives the request suspects that not all of these can be true of one machine. The book follows her as she proves which ones conflict, why, and what the customer actually needs.

All companies, people, prices, ratings, measurements and test results in the case are invented for teaching. They are not BIZOMAT work. The calculations are screening checks of the kind done before a quote, not a design for any real machine.

## Source limits and professional responsibility

This book is educational. It teaches a way of examining specifications, not machine design. Real machines need competent designers, manufacturers' ratings and data, and the applicable standards. Where a requirement protects people, such as guarding, emergency stopping or structural safety, it is decided under the work health and safety law of your jurisdiction, not traded against commercial requirements in a specification review.

The supplied source informed the framework only. The structure, case, calculations and exercises are original, and standards are named by number and scope only.
