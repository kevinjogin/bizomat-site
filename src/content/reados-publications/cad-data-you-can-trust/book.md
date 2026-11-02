---
title: "CAD Data You Can Trust"
subtitle: "Numbering, references, revisions, vaults, backups, licences and upgrades for a small engineering team"
description: "Move engineering files from shared folders to controlled data: numbering, references, revisions, permissions, migration, tested backups, licences, upgrades and supplier exchange."
category: Engineering
tags: [systems, design, quality, operations, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate engineering data management"
audience: "Engineering managers, CAD administrators, designers and IT staff in small manufacturers who are responsible for keeping CAD files findable, correct, recoverable and released under control."
outcomes:
  - "Measure what shared folders are costing and choose part numbers and file names that will last."
  - "Protect file references, distinguish versions from revisions and release drawings that match their models."
  - "Design lifecycle states and permissions, and migrate legacy files into a vault without importing old faults."
  - "Set recovery objectives, back up a vault consistently and prove recovery with a timed restore."
  - "Size floating licences from usage data, run upgrades without stopping work and control data sent to suppliers."
coverVariant: category
references:
  - title: "SolidWorks Administration Bible"
    creator: "Matt Lombard; Wiley Publishing"
    year: "2010"
    note: "Supplied copy, ISBN 978-0-470-53726-8, reviewed for its table of contents and the range of subjects in file management, licensing, upgrades and product data management. Its product instructions describe SolidWorks 2010 and Workgroup PDM and are neither reproduced nor relied on. This book is vendor-neutral and uses its own structure, case, figures and exercises."
  - title: "SOLIDWORKS 2025 Installation and Administration Guide"
    creator: "Dassault Systèmes SolidWorks Corporation"
    year: "2025"
    url: "https://files.solidworks.com/Supportfiles/SW_Installation_Guide/2025/English/install_guide.pdf"
    note: "Current vendor documentation, checked for floating network licences that let the number of users exceed the number of licences, licence borrowing, returning idle licences to the pool, administrative images and rolling back a service pack. Used as an example of mechanisms that other CAD systems also offer in their own forms."
  - title: "NIST SP 800-34 Rev. 1, Contingency Planning Guide for Federal Information Systems"
    creator: "Marianne Swanson, Pauline Bowen, Amy Wohl Phillips, Dean Gallup and David Lynes; published by the National Institute of Standards and Technology"
    year: "2010"
    url: "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final"
    note: "Read for its definitions of maximum tolerable downtime, recovery time objective and recovery point objective in section 3.2.1. Chapter 7 paraphrases those definitions and applies them to a small engineering vault; no text or figures are reproduced."
  - title: "Essential Eight Explained"
    creator: "Australian Signals Directorate, Australian Cyber Security Centre"
    year: "current guidance"
    url: "https://www.cyber.gov.au/publication/essential-eight-explained"
    note: "Checked for its baseline mitigation strategies, including regular backups, restricting administrative privileges and patching applications. Cited in Chapters 5, 7 and 9 as Australian government context; follow the current version and its maturity model for actual requirements."
  - title: "ASME Y14.35 Revision of engineering drawings and associated documents"
    creator: "American Society of Mechanical Engineers"
    year: "edition as called up by the contract"
    note: "Named by number and scope only, as a widely used standard for identifying and recording drawing revisions. Not read for this book; Chapter 4's revision conventions are the running case office's own illustrative choices."
  - title: "ISO 10303 Industrial automation systems and integration: Product data representation and exchange (STEP)"
    creator: "International Organization for Standardization"
    year: "multi-part standard"
    note: "Named by number and scope only, as the basis of the neutral STEP format discussed in Chapter 10. No values or clauses are taken from it."
related:
  - title: "Product data management for small teams"
    href: "/reados/collections/engineering-design-practice/product-data-management-for-small-teams/"
  - title: "Controlled document management systems"
    href: "/reados/collections/operational-data-records-and-controls/controlled-document-management-systems/"
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
---

## About this book

A CAD file is rarely alone. A drawing depends on a model, an assembly depends on hundreds of parts, and a bill of materials depends on all of them carrying the right numbers and descriptions. On a shared network folder, those dependencies are held together by file paths and good intentions. They hold until someone renames a folder, saves a copy over the original, edits an old version or restores last month's backup. Then the office discovers how much of its engineering record depended on nothing more than everyone being careful.

This book is for the people who must keep engineering data trustworthy in a small business: the engineering manager who answers for what is released, the CAD administrator who looks after the files and the IT person who keeps the servers running. It works through the problem in a practical order: what shared folders cost, part numbers and file names, references, revisions and release, lifecycle states and permissions, migrating into a data management vault, backups that have been restored, licences and workstations, upgrades, and exchanging data with suppliers. Each chapter ends with an exercise and its worked answer.

It assumes working knowledge of a parametric CAD system and of how drawings are released. It is vendor-neutral. Product data management systems differ in their terms and screens; the chapters explain what to decide and how to test it, and leave the configuration steps to your vendor's current documentation.

## The running case

Every chapter follows one fictional engineering team. This is an illustration. A small Australian manufacturer of stainless-steel pump skids has nine CAD users: two engineers, five designers and two drafters. Fourteen other staff in production, purchasing and quality view drawings but do not model. For years the team has kept its CAD data on a shared drive, where a scan finds about 41,600 files occupying 186 GB. Each skid combines a pump, a motor, a baseframe, pipework, valves and instruments, so a single change to a common part can reach dozens of assemblies.

The team decides to move its data into a product data management vault. The chapters follow that decision from measurement to migration and on into daily operation. Money is in Australian dollars at an internal cost rate of A$95 an hour; internal labour carries no GST, and bought items are shown excluding GST. The business, its people, files, times and costs are invented. None of them describes KEVOS® work, a real company or the performance of a real software product.

## Source limits and professional responsibility

The supplied source was a 2010 book on administering one CAD product and its workgroup data management system. It shaped the list of subjects this book covers, but its instructions are out of date and nothing in its text, figures or procedures has been reproduced. Recovery terms follow NIST SP 800-34, and Australian cyber-security context follows the Australian Signals Directorate's Essential Eight guidance; both were checked for this book and are cited where used.

Data management protects the engineering record; it does not make the designs in it correct. Release and approval remain the responsibility of competent engineers. Backup, security and licensing decisions involve your IT provider, your software vendor's licence terms and, for regulated products, your customers' and regulators' requirements. Use this book to ask better questions and test the answers, and take specific advice where the consequences warrant it.
