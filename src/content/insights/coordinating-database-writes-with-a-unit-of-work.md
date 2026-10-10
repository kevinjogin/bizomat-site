---
title: "Coordinating database writes with a unit of work"
description: "How to collect related application changes, distinguish flushing from committing, order dependent writes and handle failures without leaving a business operation half complete."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS"
featured: false
draft: false
---

Accepting an order can involve creating its header, saving several lines, reserving material and recording an approval. These are separate database changes, but the user experiences one decision. A system that saves whichever object was edited most recently can make that decision difficult to complete consistently or abandon cleanly.

Applications also need a way to remember changes before sending them to the database. A new object needs an insert, an edited object may need an update, and a removed relationship may require its own operation. The order and scope of these writes matter when records depend on one another.

A unit of work coordinates this pending change set. Used with a clearly bounded database transaction, it can make application behaviour easier to understand. Its value depends on keeping several different concepts separate: changes in memory, statements sent to the database, a successful commit and effects outside the database.

## Define the business operation before its implementation

Begin with a sentence describing the decision that must succeed or fail together. “Accept this order and record its accepted lines” is more useful than “save everything on the page”. The latter can accidentally include an unrelated address correction, a draft note or a cached object loaded by another component.

The sentence should identify preconditions, affected records and the accepted outcome. If acceptance depends on available stock, the operation must check and change that stock under a concurrency policy that remains valid when another order arrives. Grouping SQL statements does not automatically make a prior availability check reliable.

Also define what failure means to the user. A rejected order should not appear accepted in one screen and draft in another. An operation waiting for an external acknowledgement may need an explicit pending state. These distinctions establish the boundary the unit of work is meant to support.

## Understand the pending change set

The **unit of work** pattern tracks objects or changes affected by an application operation and coordinates their persistence. Martin Fowler's [pattern description](https://martinfowler.com/eaaCatalog/unitOfWork.html) identifies the central responsibility: remember the work that affects the database and organise how it is written.

An implementation might track new, changed and deleted entities. Some compare current values with snapshots taken when objects were loaded. Others receive explicit change notifications or commands. These approaches have different costs, but each needs an unambiguous owner for the collected changes.

The change set is not simply a list of every object the application has read. Reading a supplier name should not schedule an update. Nor should calculating a displayed total automatically change stored commercial data unless the application deliberately treats that calculation as part of the accepted operation.

It helps to distinguish a business command from a field mutation. “Increase the reserved quantity by three” expresses an intention. “Replace reserved quantity with seven” expresses a value that might have been calculated from stale information. A unit of work can carry either representation, but it cannot infer the correct concurrency meaning from a number alone.

## Separate tracking, flushing and committing

Changing an object in memory does not necessarily execute SQL. **Flushing** sends pending changes to the database within the relevant transaction. **Committing** asks the database to accept that transaction's changes as completed. A successful flush can still be followed by a failed commit or a deliberate rollback.

This distinction explains apparently surprising behaviour in persistence libraries. A read can trigger pending writes before the query executes, depending on the library and configuration. A constraint failure may therefore emerge from an operation labelled “search” even though the invalid value was entered earlier.

The [SQLAlchemy session documentation](https://docs.sqlalchemy.org/en/20/orm/session_basics.html) is one implementation example: it describes automatic flushing at specified boundaries and the need to handle a failed transaction appropriately. Other libraries expose different triggers. Check the actual framework rather than assuming that only a method named Save writes data.

Application code should make the final acceptance boundary visible. A helper that silently commits can divide a business operation into separately durable pieces. The calling code may then discover it cannot roll back everything it intended to treat as one decision. Transaction ownership belongs at a level that understands that decision.

## Work through a dependent write sequence

This is an illustrative example. A workshop accepts an order containing two lines: four brackets and six covers. Each line requires an order identifier, and a reservation record refers to its corresponding order line. Assume all these records belong to one database and the business requires the complete acceptance to be atomic.

The pending change set includes one order header, two order lines and two reservations. That is five new records, but not necessarily five separate network round trips. The persistence mechanism may batch statements or use another supported write strategy. The logical dependencies remain the same whichever transport optimisation is used.

| Record group | Required dependency | Validation before acceptance |
|---|---|---|
| Order header | Existing customer identity | Customer can place this order |
| Bracket line | New order identity | Quantity is positive and item is valid |
| Cover line | New order identity | Quantity is positive and item is valid |
| Bracket reservation | Bracket line identity | Reservation can be accepted under stock rules |
| Cover reservation | Cover line identity | Reservation can be accepted under stock rules |

If the cover reservation fails, the transaction should not leave an accepted header with only the bracket reservation. The application rolls back the database transaction, presents a meaningful failure and creates a fresh attempt only under the agreed retry policy. It should not claim success because the first four inserts happened to execute.

The quantities four and six are deliberately different, making it easier to detect a swapped relationship during testing. A useful test examines the resulting associations, not just a total of ten units. Summing different products is not a substitute for checking that each reservation belongs to the intended line.

## Order writes according to dependencies

New child records often require keys assigned when parent records are inserted. A coordinator can insert the parent, obtain its identity and use that identity when constructing dependent writes. Application-assigned keys can change the mechanics, but foreign-key constraints still express relationships that must hold at the database boundary.

Deletes can require a different order. Removing a parent while referenced children remain may fail, cascade or be prohibited by business rules. Do not infer the desired outcome from the presence of a delete method on an object. Decide whether the business operation removes relationships, retires a record or erases a dependent set.

Some schemas permit deferred constraint checking; others require every statement to leave relevant constraints satisfied immediately. A unit-of-work implementation must respect the actual database configuration. Circular dependencies deserve explicit design attention rather than a growing collection of special-case save calls.

Ordering also matters for uniqueness. Suppose two records exchange a unique display position. Updating one directly to the other's occupied position may fail before the second update executes. The application needs a valid strategy for its database and model, such as a different representation or carefully controlled intermediate state, rather than assuming the coordinator can solve every ordering conflict automatically.

## Keep validation close to the accepted state

Early validation improves feedback. It can explain that a required reference is missing before attempting any database writes. However, a check performed while the user edits does not necessarily remain true when the operation is accepted. Other operations can change stock, permissions or record status in the meantime.

Use database constraints for invariants the database can enforce, and transactionally appropriate checks for conditions involving current state. Application validation and database enforcement complement one another. Removing a constraint because the form already validates the field leaves imports, background jobs and concurrent requests outside the protection.

A unit of work should report a failed operation in terms the caller can act on. “The selected item is no longer available for reservation” is different from “the database connection failed”. The first might require a revised order; the second may permit a controlled retry. Hiding both behind a generic success message makes recovery less reliable.

The related discussion of [keeping history in business data](/insights/keeping-history-in-business-data/) explains why a completed change may also need a durable account of its context. Tracking an unsaved object and preserving an accepted business history serve different purposes.

## Recover the application state after failure

Rolling back SQL does not rewind arbitrary application memory. An object may still hold a generated identifier, a changed status or a calculated total from the failed attempt. Messages may already have been assembled from that state. Continuing to use these objects without a policy can make the next attempt start from a false picture.

One straightforward approach is to dispose of the failed persistence context, reload the records needed for a new attempt and reapply an explicit business command. Frameworks may provide supported ways to reset or repair a context, but their details should be understood and tested. An exception handler that merely clears an error message is not a recovery strategy.

Distinguish a known rollback from an uncertain outcome. A network failure while waiting for a commit response may leave the caller unable to tell whether acceptance occurred. Repeating the operation blindly can create a second order or reservation. A stable operation identifier and a way to inspect the recorded result help resolve this ambiguity.

These concerns are particularly important when retry logic sits in a general database helper. That helper might know a connection failed but not know whether rerunning the business command is safe. The operation's owner must define how duplicate effects are detected and how a previously accepted result is returned.

## Treat external effects as separate commitments

An email, payment request or machine instruction normally does not roll back just because the database transaction does. Sending such an effect before database acceptance can tell somebody an order exists when its records are later discarded. Sending it afterward introduces a different gap if the process fails between commit and dispatch.

A common design records the intention to send an external message in the same transaction as the business change. A separate delivery process then reads that intention and attempts dispatch. This still requires duplicate handling and delivery monitoring, but it gives the application a durable account of what remains to be done.

The unit of work can include that local message record if it belongs to the same database transaction. It cannot turn the remote recipient into part of that transaction merely by calling a function before returning. Describe external acknowledgements and failures as part of the workflow rather than hiding them behind a method called Commit.

For ordinary business users, the distinction can appear as “accepted, notification pending”. That is more informative than an uncertain spinner or an instruction to submit the whole order again. Clear intermediate states reduce the temptation to repeat work whose outcome is already durable.

## Bound memory and transaction duration

Collecting a change set has a resource cost. Tracking thousands of objects, their original values and their relationships can use substantial memory. A transaction that holds many changes open can also create contention or expensive recovery work. The right boundary is determined by the business operation and measured behaviour, not a universal batch size.

For independent imported records, processing smaller committed batches may be appropriate. Keep a durable checkpoint and identify which records were accepted, rejected or left unattempted. If the whole file must be atomic, quietly committing each batch changes the promised semantics and should not be treated as a performance-only adjustment.

Avoid holding an open transaction while someone reads a screen or answers a phone call. Collect the user's proposed changes separately, then perform a short acceptance operation with current checks. The business conversation can span minutes without requiring the database transaction to span the same interval.

Large set-based updates deserve separate consideration. A direct SQL operation may be more suitable than constructing thousands of tracked objects. If it bypasses the unit of work, the application must account for objects already in memory whose state is now stale. Mixing the two approaches needs an explicit synchronisation boundary.

## Make the coordinator visible in tests and diagnostics

Test failures at different stages: before the first write, after a parent insert, after one dependent write and around the commit response. For each case, verify both persisted records and the user-visible result. Success-path tests alone cannot show whether the operation is genuinely all-or-nothing.

Record a non-sensitive operation identifier that connects application logs, transaction attempts and the final business outcome. Log enough to identify which stage failed without copying passwords, personal records or entire SQL parameter sets into diagnostic storage. A useful trace explains the sequence of decisions, not merely the number of exceptions.

Check that lower-level repositories do not unexpectedly commit, that failed contexts are not reused accidentally, and that cancellation follows the same cleanup path as other failures. Tests should also cover two concurrent attempts affecting the same business condition, because a tidy local change set does not establish isolation by itself.

## Put the pattern to work in a small business application

When reviewing an order or production system, choose one operation that currently leaves partial results. Write down its accepted outcome, its database records and its external effects. Ask the maintainer to identify the tracking scope, transaction owner and recovery behaviour for that operation.

This exercise often exposes a sequence of independent saves where the user expects one decision. Correcting the boundary may require less code than adding another retry around each save. The goal is a workflow whose status is understandable even when a dependency fails.

A well-designed unit of work gives pending changes one place to be coordinated. The database transaction protects the agreed persistence boundary, while explicit workflow states handle the wider world. Together, these mechanisms let users trust that an accepted operation has a clear meaning and that an unsuccessful attempt has a defined path forward.

---

*Source basis: original KEVOS editorial analysis of Update Factory and Transaction discussions in the supplied Data Access Patterns (2003). The linked pattern catalogue and persistence documentation verify terminology. The order scenario and failure analysis are illustrative.*
