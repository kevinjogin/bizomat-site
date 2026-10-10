---
title: "Optimistic concurrency for long-lived user edits"
description: "Protect database records edited across separate requests by checking versions atomically, defining conflict scope and preserving users' work when changes collide."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - validation
  - design
author: "KEVOS"
featured: false
draft: false
---

A user opens a job record, spends several minutes updating its details and presses save. During that time, someone else changes the same record. If the application writes the first user's entire copy back without checking, it can silently erase the second person's work.

A database transaction around the final save does not automatically detect that the user's starting information came from an earlier request. The application needs to carry the original version forward and decide whether the proposed change is still valid against the current record.

**Optimistic concurrency control** allows people to work without holding a database lock throughout their editing time. At the point of writing, it checks whether the relevant data has changed. The quality of the design depends on an atomic check, a well-defined conflict boundary and a useful response when that check fails.

## Trace the lost update before selecting a mechanism

Consider a service coordinator editing a work order. This is an illustrative example. The record initially assigns technician T4 and contains a note to call before arrival. The coordinator opens the form to change the note.

Another coordinator then changes the technician to T9 and saves. The first form still contains T4. If its save operation writes every displayed field, it can restore T4 while updating the note, even though the first coordinator never intended to reverse the reassignment.

The two writes may each be valid local transactions. The problem is that the second write uses stale assumptions from an earlier read. Protecting the physical update does not necessarily protect the meaning of the user's editing session.

Writing only changed fields can reduce accidental overwrites, but it does not solve every conflict. A note may depend on the assigned technician, or two users may edit the same field. Independent-looking fields can also participate in a shared business rule.

Describe the intended outcome before adding a version column. Determine whether the system should reject any stale edit, merge demonstrably independent changes or ask the user to resolve differences. The version mechanism detects change; the business policy decides what that change means.

## Carry the version that the user actually read

When the application retrieves an editable record, include a version token representing the relevant state. The client returns that token with its proposed change. The server then compares it with the current version as part of the write.

The token must represent the original read, not a fresh version fetched immediately before saving and substituted without review. Replacing the old token with the latest one would remove the evidence that the user edited a stale copy.

Keep the token separate from the user's ordinary editable fields. It is concurrency context, not a value the user chooses. The server should still validate its format and scope, and should not rely on it as proof of authorisation.

A record identifier and version together identify the state being challenged. If the client accidentally supplies a token from another record or editing context, the server should reject the request rather than interpret the token loosely.

Decide how long an editing session can remain meaningful. A form left open for days may reference retired choices or changed permissions in addition to a stale row. The final save must apply current validation and access rules as well as the version comparison.

## Compare and change within one protected operation

The essential operation is conditional: update the record only if its identifier and expected version still match, and advance the version as part of the same protected change. The application then checks whether the intended row was updated.

Reading the current version, comparing it in application code and then issuing an unconditional update leaves a gap. Another writer can change the row between the comparison and the write. The check and effect must be connected by the database operation or an equivalent transaction mechanism.

For a simple integer counter, a successful change advances version seven to version eight. A competing request still expecting seven must not succeed after that change. The exact SQL and affected-row behaviour depend on the database and driver, so test the chosen implementation directly.

A result indicating that no row matched needs interpretation. The record might have changed, been deleted or become inaccessible. The response should preserve necessary access boundaries while giving the user an appropriate explanation. Do not assume every zero-row result means the same kind of conflict.

This approach does not mean that the database uses no locks internally. The final write still participates in the engine's concurrency control. The benefit is avoiding a lock held across the user's long period of reading and editing, while detecting stale assumptions when the write is attempted.

## Choose a token that changes whenever the protected state changes

An incrementing version counter is easy to explain, but its reliability depends on every relevant writer advancing it. Administrative scripts, imports and background jobs can undermine the protection if they change the data without participating in the version scheme.

Database-generated version mechanisms or controlled update paths can reduce that risk, depending on the engine. Whatever mechanism is chosen, document its scope and test each supported writer. A version column maintained only by one application is not a universal guarantee for a shared table.

Timestamps require care. Two changes can receive indistinguishable stored timestamps if precision is insufficient, and application-generated clocks may disagree. A timestamp useful for display is not automatically a reliable concurrency token.

Comparing original field values is another possible approach, but it changes the conflict definition. It detects differences in those selected fields, not necessarily every relevant intervening change. Null handling and type comparison also need explicit treatment.

Avoid resetting or reusing versions in ways that allow an old token to become valid again for a different state. Restoring a backup, copying a row or deleting and recreating an identity can raise this issue. The surrounding identity and recovery design should preserve the intended meaning of version equality.

## Define whether the conflict belongs to a row or a business object

A work order may span a header, task lines, assignments and approvals. A version on the header detects only the changes that cause that version to advance. It does not automatically protect decisions based on related rows.

Suppose a user approves the total cost shown on a form while another process adds a task line. If the added line does not change the checked version, the approval can succeed against a total the user never reviewed.

One design advances a business-object version whenever relevant components change. Another checks the versions of the specific components on which the decision depends. The right boundary follows the invariant and the degree of independent work the application needs to support.

A broad version is simpler but may reject harmless concurrent edits. A narrow set of versions permits more concurrency but requires a more precise account of dependencies. Splitting the version by field or component should not be done merely to reduce visible conflicts if it allows invalid combined outcomes.

Document which facts a command relies on. Approval, reassignment and note editing may need different conflict scopes. The system can support different commands without pretending that every update is an undifferentiated replacement of the entire object.

## Preserve atomicity when several records must change together

Some operations update multiple rows whose changes must succeed together. Checking each version and committing each update separately can leave a partially applied business operation if a later check fails.

Use an appropriate transaction boundary for the combined operation. If a required version check fails, roll back the related changes rather than reporting a general conflict after some effects have already become permanent.

The transaction also needs to protect rules involving rows that are not directly updated. A capacity decision may depend on the absence or aggregate state of other records. Row-version checks on the rows being saved do not automatically prevent anomalies involving newly inserted or independently changed rows elsewhere.

Choose the additional constraint, locking or isolation mechanism needed for those rules. Optimistic editing checks and database transaction isolation solve related but different problems. One should not be presented as a replacement for all of the other’s guarantees.

Keep external effects outside assumptions about local rollback. Sending a message or invoking another service during the operation can create a consequence that the local transaction cannot undo. Record the intended follow-up through an appropriate reliable process rather than assuming a failed version check reverses everything the application attempted.

## A conflict response should protect the user's work

A generic message saying that the record changed is technically correct but often unhelpful. Users need to understand what changed and how to continue without re-entering a long form from memory.

Retain the user's proposed changes while retrieving the current record through an authorised path. Where appropriate, show the original value, the user's proposed value and the current accepted value. This three-way context makes the conflict easier to resolve than comparing two unexplained final states.

Highlight meaningful differences rather than every technical field. A background update to an unrelated display timestamp may not deserve the same attention as a changed assignment or approval status. The conflict policy should already define which changes matter to the command.

Offer explicit actions that match the business situation: review current data, reapply selected edits, abandon the proposal or submit for another review. An overwrite-anyway option, if provided, is a separate command with its own authority and validation requirements.

Record the outcome where accountability is needed. The system should be able to explain that a user reviewed a newer state before applying a change. Merely replacing the expected version and retrying behind the scenes can defeat the purpose of detecting the conflict.

## Automatic merging needs a rule stronger than different field names

Two edits to different fields are not necessarily independent. Changing a measurement unit and changing its numeric value can produce an invalid combination. Changing a customer and retaining a contact from the old customer can do the same.

Define which fields or components can be merged and under what conditions. A merge may be safe when the user's edited field remains unchanged from the original and has no relevant dependency on other changed fields. That conclusion needs domain knowledge, not just a comparison of property names.

For text, a mechanical merge may preserve both strings while changing meaning. A maintenance instruction assembled from two edits can contradict itself even if there is no character-level conflict. The cost of a wrong merge should influence how much automation is acceptable.

Apply validation to the merged result and protect the final write with the version of the current state used for the merge. Another update can occur while the merge is being prepared, so conflict handling itself must remain concurrency-aware.

Where uncertainty remains, preserve both proposals and ask for a deliberate resolution. The aim is to reduce lost work while maintaining correct business state, not to make every save appear successful regardless of the changes made by others.

## Check framework behaviour and bypass paths

Object-relational mapping libraries may support version counters, but the guarantee applies only to the operations that use the feature. Bulk updates, direct SQL and separate applications can follow different paths.

SQLAlchemy's versioned 2.0 documentation, for example, explains that its mapped version check operates during individual object flushing and does not cover certain multirow update and delete methods in the same way. This illustrates why enabling a mapping option is only the start of the assessment.

Inspect the actual statements and failure behaviour produced by the chosen library. Confirm that the original token appears in the condition, the new token is retrieved correctly and a failed match becomes a recognised conflict rather than an ignored result.

Test deletion as well as update. A user should not delete a record using stale assumptions if the application's policy requires reviewing intervening changes. Likewise, restoring a logically deleted record may need current-version validation.

Include maintenance jobs and migrations in the version policy. A bulk correction that intentionally bypasses ordinary editing semantics should still leave future user edits able to detect relevant changes. The operational procedure needs to preserve that property deliberately.

## Test the conflict with controlled interleavings

A useful test reads the same version in two independent sessions, commits a change from the first and then attempts a conflicting change from the second. The second operation should produce the documented conflict outcome without losing the first change.

Extend the test to independent fields, dependent fields, related rows and deletion. Include a writer outside the main application to verify that relevant changes still advance or invalidate the token.

Check the user's experience as well as the final database state. The proposed edits should remain available, the current state should be shown accurately and the next action should be clear. A database-safe implementation can still be operationally poor if conflicts repeatedly erase users' input.

Measure conflict frequency in production at an appropriate level. Frequent conflicts may indicate that the version scope is too broad, that users leave forms open for long periods or that a heavily contested record needs a different workflow. Do not respond automatically by weakening the check.

Optimistic concurrency works when its promise is precise: the system detects that the assumptions behind a proposed edit have changed and handles that change deliberately. The version token is the mechanism; preserving the meaning of concurrent work is the objective.

## Source basis and further reading

The Optimistic Lock pattern in the source collection's *Data Access Patterns* provides the starting point. The work-order example and conflict-handling analysis here are original, and the book's description of avoiding locking is qualified to distinguish long editing periods from database locks used during actual writes.

For one concrete implementation and its boundaries, see SQLAlchemy's [version-counter documentation for version 2.0](https://docs.sqlalchemy.org/en/20/orm/versioning.html). Database-specific transaction and update semantics still need verification for the chosen application stack.
