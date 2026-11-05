---
title: "Text encoding, collation and reliable record matching"
description: "Why identical-looking names can compare differently, how text encoding and collation affect database matches, and how to migrate comparison rules without merging distinct records."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

Two customer names look identical on screen, yet a database treats them as different. Elsewhere, two product codes look different but a uniqueness check treats them as equal. Neither result necessarily means the database is broken. The application may be storing and comparing text under rules that do not match the business meaning of the field.

Text has several layers. Bytes must be decoded into characters, character sequences may have equivalent written forms, and comparison rules determine equality and ordering. Search adds another decision about how much variation should be tolerated. These layers often become visible only when systems exchange data or a database is migrated.

Understanding the distinctions helps businesses preserve names, match records reliably and avoid accidental duplicate merging. The goal is not one universal text-cleaning rule. It is a clear policy for each field, supported by tests that represent the actual languages, identifiers and documents the organisation handles.

## Separate storage from comparison

An **encoding** describes how characters are represented as bytes. UTF-8 is one such encoding. A **collation** supplies rules used for comparing or ordering text in a database operation. Correctly storing a character does not, by itself, decide whether it compares equal to another character sequence.

```figure
type: balance
title: Storing text and comparing text
left: Encoding
right: Collation
caption: Storing a character correctly says nothing about how it will be compared or sorted.
- How characters become bytes, such as UTF-8 | Rules for comparing and ordering
- Decides what can be stored | Decides what counts as equal
```

Consider an imported file containing a person's name. Reading its bytes with the wrong encoding can produce visibly incorrect text. Choosing a different sort order afterwards does not recover the original characters. The error occurred at the decoding boundary and must be investigated there.

Conversely, a database can store both uppercase and lowercase letters perfectly while treating them as equal for a particular comparison. That may be desirable for a name search and inappropriate for a case-sensitive external identifier. Storage capability and matching policy answer different questions.

Document both. A statement such as “the system supports Unicode” does not explain whether accents affect equality, how punctuation sorts or whether a unique index considers two strings the same. Those choices can change the set of records the application permits.

## Give each text field a business meaning

A display name is intended to be read by people. A part number identifies a product under a defined scheme. A supplier reference is meaningful according to the supplier's rules. A free-text note records what someone wrote. Applying the same transformation to all four can damage information.

For a display name, preserve the authorised spelling and punctuation even if a separate search representation makes matching more forgiving. For a part number, determine whether case, spaces or leading zeros are significant. For an externally issued identifier, verify the issuing system's rules instead of inventing local equivalence.

This distinction also affects uniqueness. Two people can share a name, so a unique display-name field is usually the wrong way to identify a person. Two locally assigned product codes may need to be unique under a much stricter policy. A comparison rule cannot repair a poorly chosen identity model.

Record examples in the field definition. Showing whether `AB-10`, `ab-10` and `AB10` represent one identifier or three makes the requirement testable. Phrases such as “ignore formatting” leave too much room for incompatible interpretations between an import script, a web form and a reporting tool.

## Understand visually equivalent Unicode sequences

Some written characters can be represented by different Unicode sequences. For example, an accented letter may have a precomposed representation or be formed from a base letter followed by a combining mark. The strings can look the same while containing different code points and bytes.

Unicode normalisation provides defined transformations for these cases. The [Unicode normalisation specification](https://unicode.org/reports/tr15/) distinguishes canonical forms from compatibility forms. Compatibility normalisation can remove distinctions that matter in some contexts, so it should not be applied to every business field simply because it produces more matches.

Normalisation is not translation, spelling correction or proof of identity. It does not establish that two differently written customer names belong to the same person. Nor does it make every visually similar character equivalent. A Latin letter and a similar-looking character from another writing system may still represent different text.

Choose a normalisation policy only after defining the field's purpose. Preserve original input where traceability or faithful reproduction matters, and document any derived comparison representation. Otherwise, a future investigator may be unable to explain why an imported value no longer matches the source document.

## Use a small comparison fixture

This is an illustrative example. A business receives customer descriptions from a form and an imported file. One source represents the name `Café` using a precomposed final letter. The other uses the letter `e` followed by a combining acute accent. The visible name is the same, but the original sequences differ.

In Python, the difference and a selected canonical normalisation can be demonstrated without connecting to a database:

```python
import unicodedata

first = "Caf\u00e9"
second = "Cafe\u0301"

assert first != second
assert len(first) == 4
assert len(second) == 5
assert unicodedata.normalize("NFC", first) == (
    unicodedata.normalize("NFC", second)
)
```

```figure
type: compare
title: Two ways to write "Café"
cols: Code points | Length
caption: They look identical; Unicode normalisation defines when such sequences should be treated as equivalent.
- Precomposed é | C a f é | 4
- *e plus a combining accent | C a f e ◌́ | 5
```

The character counts in this example describe code points in these Python strings, not a general rule for the number of user-perceived characters. Some visible characters involve several code points. A database's length function and a user interface's character counter may also use different units.

This fixture proves one narrowly defined transformation. It does not prove that the production database compares the original strings as equal, that all accents should be removed or that two customer records should be merged. Those are separate decisions requiring their own tests.

## Decide what a collation is allowed to equate

Comparison rules can consider case, accents and other language-dependent distinctions. Their behaviour depends on the database, provider, locale and configuration. The [PostgreSQL collation documentation](https://www.postgresql.org/docs/current/collation.html) is an example of official guidance that distinguishes provider choices and deterministic or nondeterministic comparisons. Equivalent-looking settings in another product need not behave identically.

Avoid treating a collation name as a complete business specification. Test representative values and record the expected equality and order. An upgrade to an operating-system or internationalisation library can also change comparison behaviour, so the dependency extends beyond the table definition itself.

Different operations may legitimately need different rules. A user-facing name list may use a language-appropriate order, while an integration identifier requires a strict comparison. The design should make the distinction deliberate and avoid silently switching rules between a lookup and a uniqueness check.

If the application lowercases text before searching, check how that interacts with the database's own comparison rules. Two independently chosen transformations can disagree about special cases. A centrally documented field policy is easier to maintain than scattered calls to lowercase or remove accents.

## Keep approximate search separate from identity

A helpful customer search may tolerate case differences, omitted accents or common spacing variations. Returning several plausible matches can make the system easier to use. Automatically deciding those matches are one customer is a much stronger claim.

Preserve a stable record identifier when the user selects a result. Subsequent operations should use that identifier and the appropriate permission checks, rather than repeating a fuzzy name search and hoping it returns the same record. Search helps a person locate an entity; the entity's key carries the choice forward.

Show enough context to distinguish similar records without exposing unnecessary personal information. An authorised business user might need an account reference or organisation name alongside the display name. The exact fields should reflect the workflow and access rules, not a universal desire to show every available detail.

For duplicate review, distinguish confirmed duplicates from candidate matches. A system can group records for human assessment while retaining their separate identities. This is safer than merging records solely because a comparison key removed the differences between their names.

## Treat uniqueness changes as data changes

Changing the comparison rule behind a unique field can cause previously distinct values to collide. Suppose `PartA` and `parta` have been separate valid codes. Moving to a case-insensitive uniqueness rule creates a business conflict, not merely an index maintenance task.

Before migration, compute candidate equivalence groups under the intended target rules. Review each collision with someone who understands the data. The resolution might be to preserve strict identifiers, rename selected values through a controlled process, or recognise genuine duplicates with an auditable mapping.

Do not resolve collisions by silently retaining the first row returned. That choice can discard references, history and contractual meaning. Any consolidation needs a record of the old identifiers, the surviving identity and the decisions applied to related data.

Check foreign systems too. If an external application continues to distinguish two codes that the new database now treats as equal, an import may select the wrong record even after local uniqueness checks pass. The migration boundary includes the full exchange path, not just one database server.

## Account for indexes and ordered results

Text indexes are built using assumptions about their keys and comparison behaviour. A change in those assumptions may require rebuilding affected indexes according to the database's documented procedure. Historical database manuals already identify this connection between collation changes and index maintenance; the specific commands must come from documentation for the actual system in use.

Ordering changes can also affect pagination and exports. If two names now compare as peers, their relative order may be unspecified unless a stable secondary key is included. A report that appeared deterministic under one dataset can start rearranging rows after a migration introduces new names or comparison rules.

Test filters as well as sorting. A range condition on text assumes an ordering, and changing the collation can change which values lie within the range. Business users rarely intend an alphabetical range to become an undocumented classification rule, so inspect any workflow that relies on it.

Performance requires measurement. Adding a normalisation function to a search expression can prevent use of an existing ordinary index in some designs. A supported indexed expression or stored search key may help, but it also adds a maintenance obligation. Preserve correctness first, then measure the intended query under realistic data.

## Inspect the entire import and export route

A text migration can fail before the database ever sees the intended characters. Check the source file's declared encoding, the importer, the database connection and the export path. A correctly configured destination cannot compensate for an importer that already substituted unknown characters with question marks.

Keep a small fixture containing ordinary names, accented characters, non-Latin scripts and meaningful punctuation. Round-trip it through each supported path and compare the result under the field's preservation policy. If exact preservation is required, compare the actual sequences as well as what the screen displays.

Avoid guessing a legacy file's encoding from a handful of common English words. Many encodings produce the same result for those bytes. Obtain the export specification or inspect representative non-ASCII data. When the source cannot be established, mark the uncertainty rather than performing irreversible bulk replacement.

Record the transformation applied during import. A rejected row should retain enough context to correct the source problem, while a successfully transformed row should be explainable. Silent repair makes later reconciliation harder because the receiving database no longer provides a faithful account of what arrived.

## Specify lengths using the relevant unit

A limit of 40 can refer to bytes, code points or visible characters, depending on the system and field. These are not interchangeable. Multibyte encodings mean a value that fits a character limit may exceed a byte-limited external format.

```figure
type: layers
title: What "40 characters" might mean
caption: In a multibyte encoding, a value within a character limit can exceed a byte limit.
- Bytes | storage units
- Code points | Unicode characters
- *Visible characters | what a person counts
```

Check downstream constraints before selecting local limits. A label printer, fixed-width file or older integration may have a narrower capability than the database. Truncating values silently to make them fit can create duplicate codes or unreadable names. Define whether the operation rejects, abbreviates through an approved mapping or uses an alternate display field.

When an interface shows a remaining-character counter, ensure its behaviour matches the acceptance rule or explain the limitation clearly. A user should not be told that an entry fits, only to receive an unrelated database error after submitting it. Validation messages should identify the relevant field and practical correction.

These decisions belong in the [data dictionary](/reados/collections/operational-data-records-and-controls/writing-a-data-dictionary/), alongside examples of accepted and rejected values. A length declaration without its unit and integration context is an incomplete requirement.

## Plan a comparison-rule migration as a controlled release

Create a representative test set before changing production rules. Include current data, known duplicates, legitimate near-matches and boundary cases from connected systems. Record the old results and the intended new results for equality, uniqueness, sorting and search.

Then rehearse the transformation on a copy of the data. Identify collisions, affected indexes and application queries whose behaviour changes. Validate counts and relationship mappings after any approved consolidation. Preserve the source values and the transformation record according to the organisation's normal data-handling controls.

Define a rollback or recovery path that accounts for data written after the change. Reverting a configuration setting does not undo a merge or restore text that was overwritten. The reversibility of a schema setting and the reversibility of a data transformation are separate questions.

## Make text behaviour a shared business decision

For a small Australian business dealing with diverse customer names and imported supplier records, reliable text handling is part of ordinary data quality. It affects whether people can find accounts, whether product references remain distinct and whether an export can be reconciled with its source.

Start with a short list of important fields and a few awkward real-world examples, using authorised or synthetic data. Agree which differences are meaningful, which searches may be forgiving and which original values must be preserved. Developers can then implement and test those rules consistently.

Encoding preserves characters, normalisation addresses defined sequence equivalences, collation governs comparison, and search policy controls discovery. Giving each layer an explicit role prevents a convenience transformation in one part of the system from quietly changing the identity of records elsewhere.

---

*Source basis: original BIZOMAT editorial explanation prompted by character-set, collation and re-indexing discussions in the supplied Advantage Database Server: The Official Guide (2003). Current Unicode and PostgreSQL references are linked for technical definitions. Historical product instructions are not presented as current operating procedures.*
