---
title: "Backfilling data while old and new schemas coexist"
description: "Plan a database backfill that preserves concurrent updates, supports mixed application versions and proves completeness before the old representation is retired."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - projects
  - validation
author: "KEVOS®"
featured: false
draft: false
---

Adding a new database column is often easier than making it trustworthy. Existing records need values, new writes continue to arrive and several application versions may remain active during the transition. A one-time update can appear to complete while leaving the new representation inconsistent with later changes.

A **backfill** populates a new or revised representation using existing data. In a live system, it is part of a transition involving both historical records and ongoing writes. Its correctness depends on how those two streams interact.

The useful design question is how to move from one authoritative representation to another while preserving meaning and maintaining a recoverable state at every stage. That requires explicit compatibility rules, repeatable processing and evidence that the new representation is ready before the old one is removed.

## Define the change in business terms

Describe what the new representation means and how it relates to the old one. Renaming a field, splitting a value and changing a business concept require different migration logic.

This is an illustrative example. A system stores one contact label containing a person's name and role. A new model separates display name and contact role. Some historical labels may be ambiguous, so a mechanical split cannot safely populate every new field.

Distinguish deterministic conversion from interpretation. A unit conversion with known units may be repeatable and exact within defined precision. Extracting structure from free text may require exceptions or human review.

Write acceptance rules for converted, unresolved and invalid records. Do not force every record into a plausible new value merely to make a progress counter reach 100%.

Identify whether the new representation can express every old state and whether the old representation can express every new state. That determines which application versions can coexist and whether rollback remains possible after new writes begin.

## Inventory every reader and writer

The main application is rarely the only database client. Reports, imports, scheduled jobs, support tools and external integrations may read or write the affected fields.

Record each client's version, owner and deployment cadence. A transition cannot safely assume simultaneous upgrades if one monthly process or independently managed integration still uses the old form.

This is an illustrative example. The interactive application has moved to a new address structure, but a weekly import still updates the old single-field address. Unless the transition accounts for that writer, new data can become stale after an apparently successful backfill.

Separate readers from writers. An old reader may be supported through a compatibility view, while an old writer needs a defined translation path. The risks are different because writes can introduce new divergence.

Use observed access where available to complement the inventory, but do not equate a quiet observation period with proof that no client exists. Rare jobs and recovery procedures may remain important even if they did not run during monitoring.

## Establish authority during each transition stage

When both representations exist, state which one is authoritative and how the other is maintained. Two writable copies without a conflict rule create a new consistency problem.

One transition may keep the old form authoritative while backfilling the new form, then switch authority after validation. Another may introduce a single write path that maintains both forms under a suitable transaction boundary.

The correct approach depends on whether conversion is reversible and where writes occur. Bidirectional synchronisation is especially difficult when the representations contain different information or permit different states.

This is an illustrative example. A new model permits several contact methods while the old model has one telephone field. There is no universal reverse conversion. The compatibility rule must say which value old clients see and which edits they are allowed to make.

Document authority as a sequence of states. For each state, specify accepted writers, read behaviour, synchronisation and the conditions required to advance. This is more useful than a deployment checklist that assumes every step succeeds immediately.

## Close the race between backfill and live updates

A backfill reads old data and writes a converted value. A live transaction can modify the source between those operations. Without coordination, the backfill can overwrite a newer result with a conversion of older data.

This is an illustrative example. The backfill reads version 4 of a record. A user commits version 5 and updates the new representation. The delayed backfill then writes its version 4 result over that newer value.

```figure
type: timeline
title: A backfill overwriting a newer value
caption: The backfill must check the version it read is still current before writing.
- 1 | Backfill reads version 4
- 2 | A user commits version 5 | the new representation updated
- *3 | Backfill writes its version 4 result | the newer value lost
```

Possible protections include conditional updates based on a source version, transactional locking of the relevant record, or a change-capture mechanism that reliably brings the target up to a defined boundary. The chosen method must fit the database and workload.

Simply processing only null target values is not always sufficient. It may avoid one overwrite while failing to propagate subsequent source changes, or it may confuse a legitimate null result with an unprocessed record.

Define a completion marker separate from the business value where necessary. A converted record whose correct target is null still needs to be distinguishable from a record the backfill has never examined.

```figure
type: checklist
title: A backfill you can stop and resume
caption: Do not force every record into a plausible value just to reach 100%.
- x Rules for converted, unresolved and invalid records
- x Every reader and writer inventoried
- x Bounded units with durable progress
- x Load controlled by operational evidence
- *x Equivalence validated at the right level
```

## Process bounded units with durable progress

A large backfill can affect locks, transaction logs, replication and storage. Bounded batches can make resource use and recovery easier to control, provided each batch has a clear correctness boundary.

Choose a stable traversal key and record progress. A changing offset through a live table can skip or revisit records as the population changes. The traversal rule should account for new inserts and updates explicitly.

This is an illustrative example. A backfill records the last processed immutable identifier and continues with greater identifiers, while a separate mechanism handles new writes. That can provide a simple traversal for existing rows, but only if the identifier ordering and write-handling assumptions hold.

Commit progress with the corresponding data changes where the architecture allows. Otherwise, a failure can leave uncertainty about whether a batch was applied, recorded or both.

Make repeated processing safe. A restart should not concatenate values twice, duplicate child records or apply a unit conversion again to already converted data. Idempotence needs to be designed into the operation rather than inferred from its name.

## Control load using operational evidence

Batch size and delay should reflect measured impact. A fixed large batch that is acceptable overnight may interfere with peak interactive traffic. A tiny batch may add excessive overhead and prolong the transition unnecessarily.

Observe transaction duration, lock waits, database resource use, replication lag and application response times. Select the indicators that matter to the actual deployment rather than relying on one generic load number.

Define pause and resume behaviour. A backfill should be able to stop between safe units when the system needs capacity, then continue from a verified position without manual reconstruction.

Record whether failed batches are retryable and how exceptions are isolated. One malformed historical record should not necessarily cause repeated rescanning of millions of valid records, but skipping it must leave a visible unresolved state.

Avoid changing unrelated application or database settings simply to accelerate the job. The purpose is a controlled transition, and its performance should be assessed within the operating constraints that must remain in place.

## Validate equivalence at the correct level

Row counts and non-null counts provide useful progress signals, but they do not prove that the new representation means the same thing as the old one.

Compare values through the defined transformation. For a split or normalised structure, reconciliation may require reconstructing the relevant old meaning from several new rows. For a semantic change, exact equality may not be the intended criterion.

This is an illustrative example. Moving repeated contact numbers into a child table can preserve the number of source customers while still losing one number per customer. Validation needs to examine the contact population and relationships, not only customer counts.

Use complete checks where practical and targeted samples for interpretation-heavy cases. Include unusual characters, empty values, duplicates, maximum lengths and records with a known history of corrections.

Reconcile exceptions explicitly. State how many records remain unresolved, why and whether they block the next stage. A conversion that is complete for accepted cases should not be presented as complete for the entire source population.

## Test mixed application versions deliberately

Compatibility is a behaviour to demonstrate. Run old and new readers and writers against each transition state that may exist during deployment.

Test interleavings: an old client writes after a new client reads, a new client writes while the backfill is running and an old job retries a previously submitted update. Confirm that the declared authority and conversion rules hold.

This is an illustrative example. A new client stores a longer value permitted by the new schema. An old client later reads and rewrites the record using its shorter field limit. The transition can truncate information even though both applications pass their separate tests.

Include connection pools and cached application metadata where relevant. Some clients may retain prepared statements or schema assumptions beyond the moment a deployment changes files.

Document the supported overlap window and its exit criteria. A calendar date can coordinate teams, but evidence that all required clients have moved is more important than the passage of time alone.

## Make rollback claims specific

Rolling back application code is not the same as reversing a data transformation. Once the new representation accepts states the old one cannot express, returning to old code may require a separate compatibility or correction process.

Define the rollback boundary for each stage. Before authority changes, stopping the backfill may be enough. After new-only writes begin, a reverse transformation may be lossy or impossible without retained source information.

This is an illustrative example. A single classification field becomes several independent flags. New records can hold combinations that have no equivalent old classification code. Reinstalling the old application cannot invent a correct reverse mapping.

Preserve appropriate recovery evidence and tested backups under the existing operational process. A backup is valuable, but restoring an earlier database also affects unrelated valid work performed after that backup.

Where a forward correction is safer than rollback, document and rehearse it. The plan should identify how to detect affected records, stop further divergence and repair the new representation while preserving legitimate concurrent changes.

## Prove readiness before switching reads

Before the new representation becomes the default read path, confirm that historical conversion and ongoing write propagation meet their acceptance criteria.

Compare old and new outputs for representative operations while the old path remains available. Differences should be classified as intended semantic changes, known exceptions or defects requiring correction.

Monitor the new path's performance as well as its values. A normalised structure may require different query patterns or indexes. A correct transformation can still produce an operational regression if the application continues using assumptions suited to the old layout.

Switch a bounded population first where the deployment supports it, with clearly defined observation and recovery conditions. The exact rollout mechanism depends on the system; the principle is to retain evidence and control while uncertainty remains.

Record the authority switch and the versions that depend on it. That information helps operators interpret later incidents and prevents a delayed job from assuming the previous representation is still authoritative.

## Introduce stricter rules only after their prerequisites hold

A new representation often comes with stronger constraints: required values, uniqueness or new references. The timing of those rules matters. Applying a requirement before historical exceptions are resolved can block the backfill or ordinary application writes.

This is an illustrative example. A new customer classification must eventually be present on every active record. Some old records cannot be classified automatically. Making the field mandatory immediately either stops the transition or encourages an invented default that conceals the unresolved population.

Separate the desired final rule from the temporary states needed to reach it. Record unresolved cases explicitly, establish how new writes satisfy the rule and prove that the historical population has been addressed before enforcing the final condition. Product-specific facilities for staged constraint validation should be checked against the installed database rather than assumed.

Uniqueness changes require investigation before enforcement. Two previously distinct records may map to the same new identifier after case folding, punctuation removal or another standardisation. The collision is a business identity question, not merely an error to bypass in the import script.

Preserve the original values and explain each resolution. Merging, rejecting or assigning a new identity can affect references elsewhere, so the decision needs to follow the data's meaning. A technically unique result can still represent the wrong entities if the resolution was arbitrary.

Finally, test deletion during the backfill. A record removed or retired after being read should not be recreated by a delayed conversion unless that is the explicitly intended history model. Version checks and target-write conditions need to account for lifecycle changes as well as ordinary value updates.

## Retire compatibility work as a separate change

Temporary columns, views, triggers and translation code can become permanent complexity if nobody owns their removal. Give each compatibility mechanism an explicit purpose and exit condition.

Verify that no required client still depends on the old representation before removal. Check rare jobs, support procedures and recovery paths as well as normal application traffic.

Remove compatibility in a separately reviewed step with its own validation. Combining initial creation, conversion, authority change and removal into one irreversible action makes failures harder to isolate.

Preserve the migration record after cleanup. Future maintainers need to know how older values were interpreted and which exceptions remained, even when the temporary database objects no longer exist.

A dependable backfill is a controlled passage between two data models. Explicit authority, race-safe conversion, repeatable batches and demonstrated compatibility turn a large update from a one-off gamble into an understandable engineering process.

*Source basis: deprecation periods, source-data migration, regression testing and transitional schema support in Refactoring Databases: Evolutionary Database Design (2006), supplied in the collection. The examples and operational framework are original synthesis; historical recommendations for fixed transition durations or universal trigger use were not adopted.*
