---
title: "Building self-describing database archive packages"
description: "Preserve database records with the definitions, relationships, versions and validation evidence needed to understand them after the original application retires."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - operations
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Exported database files can survive for years while the knowledge needed to interpret them disappears. A column called status may retain every original value, yet nobody remembers what its codes meant in the version of the application that created them. Preserving bytes is necessary, but it does not by itself preserve usable records.

A **self-describing archive package** brings a bounded set of data together with the information needed to identify, interpret, validate and retrieve it. It aims to reduce dependence on the original application, its operating environment and the memory of the people who maintained it.

The package is an engineering arrangement rather than a universal file format. Its contents should follow the records being preserved and the questions future users need to answer. This article focuses on that technical design; retention periods and authority to dispose of records remain separate organisational decisions.

## Begin with future retrieval questions

Define what an authorised future user must be able to establish. They may need to retrieve an issued order, explain an inspection result, reconstruct the recorded state of a job or reconcile a period's accepted transactions.

Those questions determine the required scope. Exporting one large transaction table may omit the reference values, attachments and relationships needed to answer them. Exporting every database object may preserve unnecessary complexity without explaining any of it.

This is an illustrative example. A completed inspection record refers to a specification revision, instrument identifier and acceptance code. The measured value alone cannot show which limit applied or what the original acceptance decision meant.

Write a small set of retrieval tasks in plain language. Include ordinary lookups, relationship traversal and interpretation of an exceptional record. Use those tasks later to test whether the package works independently of the original application.

Separate preservation requirements from convenient current reports. A report may omit details that future investigation needs. Conversely, a database may contain transient operational state that has no enduring meaning after processing finishes.

## Choose a coherent package boundary

A package needs an identifiable population. It might contain completed jobs from a defined period, a closed project or records created under one schema version. The boundary should support retrieval and interpretation without breaking essential relationships.

Calendar boundaries are convenient but not always sufficient. A job started in one year and completed in another can have related records on both sides. Archiving each year's rows independently may scatter the facts needed to understand that job.

Identify references that cross the proposed boundary. Decide whether the package includes the referenced data, carries a preserved reference to another managed package or documents a deliberate limitation.

Give the package a stable identifier and record its scope in a manifest. The manifest should state where the data came from, which selection rule was applied, when extraction occurred and which source version or boundary it represents.

Do not use a filename alone as the scope definition. A label such as archive_2024 can mean creation year, transaction year, completion year or extraction year. The package documentation must resolve that ambiguity.

## Preserve business definitions alongside structure

A schema describes columns, types and relationships, but it rarely explains every business meaning. Future users need both structural metadata and domain definitions.

For important fields, record the meaning, unit, permitted values and treatment of absence. Explain distinctions such as planned versus actual dates, recorded versus approved quantities and current versus historical classifications.

This is an illustrative example. An archived weight field contains 12500. Without its unit and scale, a reader cannot tell whether that means grams, kilograms or an integer representation of 12.500 kilograms.

```figure
type: decision
title: What does 12500 mean?
question: An archived weight field holds 12500
caption: Without its unit and scale, the value cannot be read; the package must carry its own definitions.
- Grams? | 12.5 kg
- Kilograms? | 12,500 kg
- *Scaled integer? | 12.500 kg
```

Preserve code lists as they applied to the package. A code can change meaning between application versions. Linking only to the current online list leaves old records dependent on an evolving external interpretation.

Include concise relationship descriptions. A field called parent_id needs the referenced entity, key scope and relationship meaning. A diagram can help, but a diagram without definitions may simply preserve the same ambiguity in another form.

## Keep metadata versions attached to their data

Long-lived archives commonly contain data produced under several definitions. Columns can be added, units changed and codes reinterpreted. The archive must identify which definition belongs to each preserved population.

This is an illustrative example. Before a system change, a completion date was entered when workshop work ended. Afterwards, it was entered only after quality acceptance. Combining both eras under one definition creates a misleading historical measure.

Record schema and business-rule versions separately where they differ. A business definition can change without a column being renamed or its database type changing.

Choose whether to preserve each source version directly, transform it into a documented common model or retain both original and transformed representations. Each option has costs. The critical requirement is that transformation does not silently imply historical information that was never recorded.

New fields deserve particular care. A value unavailable in an older source should remain distinguishable from a genuine recorded value. Filling it with a modern default may make loading easier while misrepresenting the historical record.

## Document transformations as part of the evidence

Extraction often changes representation. Character encoding, decimal formatting, timestamp notation and identifier types may need to be made portable. Those changes should preserve meaning and be described precisely.

Keep a transformation record identifying the input field, output field, conversion rule and version of the process. Record exceptions and any manual decisions that affected accepted data.

Distinguish binary content from text. Applying character conversion to a field that actually contains binary data can corrupt it. Attachments and large objects need their own identity, media description and relationship back to the business record.

Where exact original representation matters, retain it through an approved method alongside the usable projection. A transformed table can support retrieval while the original provides a reference for checking a disputed conversion.

Avoid relying on undocumented application calculations to explain stored values. Either preserve the relevant calculation definition and inputs or preserve an explicitly labelled calculated result with enough context to explain what it represents.

## Select formats for sustained usability

Format choice should consider documentation, available readers, type fidelity, size and the complexity of the preserved information. No single format is automatically best for every database archive.

A simple delimited table can be easy to inspect, but it needs a precise description of encoding, delimiters, quoting, null representation and types. A database-specific backup may preserve implementation detail well while retaining dependency on compatible software.

Structured formats can preserve richer relationships or metadata, but a complex format is not self-explanatory merely because it contains tags or field names. Future users still need the definitions and tools required to interpret it.

The Library of Congress maintains technical format descriptions and sustainability analysis intended to support long-term digital preservation planning. These resources can inform a format assessment without replacing the archive's own requirements and validation. [Library of Congress digital format resources](https://www.loc.gov/preservation/digital/formats/intro/intro.shtml).

Record the selected format version and required interpretation rules in the package. Test reading it with an independent supported tool where practical. Successful export from the original application is only the first half of the portability claim.

## Build a manifest that can be checked

A **manifest** lists package contents and the identifying information needed to manage them. Useful entries include relative file paths, sizes, cryptographic checksums, roles and links to the relevant metadata definitions.

Checksums support **fixity checking**: detecting whether stored bytes differ from a previously recorded state. They do not prove that the original data was complete, accurate or authorised. Those claims require separate evidence.

Record how the manifest itself is protected and versioned. If both a file and its expected checksum can be changed without accountability, a later comparison provides less assurance about the historical state.

Include row counts and other relevant logical checks in addition to byte-level checks. A file can remain unchanged while containing a truncated export that was already incomplete when its checksum was recorded.

Keep the package navigable. A future reader should be able to find the manifest, scope statement, schemas, code lists and retrieval instructions without knowledge of an internal folder convention that has been forgotten.

## Reconcile extraction against the intended source

Validate the package before treating it as an accepted archive copy. Compare the extracted population with the source under the same selection rule and consistency boundary.

Check counts by meaningful groups, not only one grand total. Equal totals can hide a missing site offset by duplicated records elsewhere. Verify keys, relationships and significant measures where those checks are appropriate.

This is an illustrative example. An extraction contains the expected number of inspection results, but all records from one instrument are missing and an equal number from another instrument are duplicated. A total row count passes while a grouped reconciliation exposes the error.

Account for rejected records and unresolved references. Acceptance criteria should state whether any such exceptions are permitted, who reviews them and how they are represented in the package.

Preserve validation evidence with the accepted package. Record the checks performed, their source boundary, results and any approved qualifications. A later user should not have to infer completeness solely from a folder labelled final.

## Test interpretation without the original application

The strongest independence test is to give an authorised reader a copy of the package and the retrieval questions, without access to the original application or its maintainers.

Observe whether the reader can identify the right records, follow relationships and explain important values. Difficulty interpreting a code or distinguishing two dates indicates a metadata gap, even if every file opens successfully.

Include unusual records in the exercise. Cancelled transactions, superseded specifications, missing values and historical code changes often depend on knowledge that ordinary examples do not expose.

Record the time and tools required. An archive that is technically readable but takes weeks of specialist reconstruction to answer an ordinary question may not meet its operational purpose.

Repeat interpretation checks when tools, staff or retrieval requirements change. Metadata that seems obvious to the original team can become unclear as that team's experience leaves the organisation.

## Separate immutable records from evolving assistance

Preserved records may need to remain unchanged while explanatory material improves. A later discovery can clarify a code meaning or correct a description without silently rewriting the original data.

Keep original package content and subsequent explanatory additions distinguishable. Record who added the clarification, when, why and which package or field it concerns.

If a preserved record is found to be wrong, follow an authorised correction process that retains the relationship between original and corrected information. Simply replacing the value erases the distinction between what was recorded and what was later established.

Search indexes and convenient viewing copies can be rebuilt from the preserved package. Treat them as derived access aids, with their generation and transformation rules recorded. Their failure should not destroy the underlying preserved information.

This separation allows usability to improve while the archive remains accountable about which information is original and which is a later interpretation or transformation.

## Operate the archive as a maintained service

An archive needs ownership, controlled access, recoverable storage and periodic checks. Creating a package and leaving it on an unmanaged drive does not establish durable availability.

Plan how packages are located, restored and read after storage migration or application retirement. Maintain the catalogue that connects business identifiers and date ranges to package identifiers.

Check fixity on an appropriate schedule and after relevant transfers. Test restoration from protected copies. Investigate discrepancies rather than replacing expected checksums merely to make the check pass.

Access controls should cover data, metadata and supporting attachments. Explanatory files can reveal sensitive business context even when the main tables are carefully restricted.

Lifecycle actions require the organisation's approved authority. Technical packaging should make it possible to identify and act on the correct population, but it should not invent retention periods or automatically dispose of information based on an assumed rule.

```figure
type: steps
title: Building an archive package that explains itself
caption: Test interpretation without the original application before accepting the package.
- Start from future retrieval questions
- Choose a coherent boundary
- Keep business definitions with the structure
- Attach metadata versions to their data
- Document transformations
- Build a checkable manifest
- *Reconcile and test without the application
```

## Use acceptance criteria that match the purpose

Exercise the catalogue as well as individual packages. A perfectly preserved package is of limited use if the organisation cannot determine that it contains the requested records. Test searches by the identifiers, date ranges and historical names that future users are likely to possess, including identifiers that changed during migration.

This is an illustrative example. An old service record uses a retired equipment number, while the current asset register uses a replacement identifier. A retrieval process that recognises only current identifiers can make the old record effectively invisible. Preserving an authorised cross-reference, with its period and meaning, helps locate the record without rewriting its original identifier.

Document retrieval boundaries too. A package may contain a complete project but only a subset of a customer's overall history. Search results should indicate that scope so the absence of a record in one package is not mistaken for proof that the record never existed anywhere.

A package is ready when it is complete within its declared scope, interpretable using preserved definitions, verifiable against extraction evidence and retrievable through a tested process. Those are separate checks and should be reported separately.

Record known limitations plainly. An unavailable attachment, undocumented historical code or unverified transformation should remain visible to future users. A narrow, honest claim is more useful than a broad claim that the archive preserves everything.

Keep the acceptance record with the package and its catalogue entry. This gives future operators a starting point for understanding both the preserved information and the confidence that can reasonably be placed in it.

The long-term value comes from preserving a usable explanation of the records as well as their values. When data, definitions, versions and evidence remain connected, the organisation is less dependent on keeping an obsolete application alive simply to remember what its own information means.

*Source basis: archive independence, metadata affinity, validation and metadata-clarity testing in Database Archiving: How to Keep Lots of Data for a Very Long Time (2009), supplied in the collection. Historical product limitations and universal format claims were not adopted. This article addresses technical preservation design, not legal retention advice.*
