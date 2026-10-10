---
title: "Diagnosing database deadlocks and lock ordering"
description: "Understand database deadlocks, distinguish them from ordinary blocking, and use evidence, consistent lock ordering and bounded retries to improve reliability."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

A database operation that occasionally fails with a deadlock can be frustrating because it may succeed immediately when repeated. The data can look normal, the server can have spare capacity, and the same operation can work perfectly in a single-user test. The failure depends on how competing transactions overlap.

A **deadlock** occurs when transactions form a cycle of waiting: each holds a resource another needs, so none in the cycle can make progress without intervention. Databases commonly detect such cycles and abort a transaction to break them. The rejection protects progress; it does not by itself explain why the cycle formed.

Reliable handling combines two activities. The application must recover correctly from the rejected attempt, and the underlying workload should be examined for avoidable cycles. Retrying without investigation can conceal a recurring design problem, while redesigning locks without a recovery path leaves the application fragile.

## Distinguish blocking from deadlock

**Blocking** is ordinary waiting for a resource held by another transaction. Transaction B may wait while A updates a shared record. If A finishes, B can proceed. There is no cycle merely because the wait is long.

A deadlock requires a circular dependency. A waits for something B holds, while B waits directly or indirectly for something A holds. More than two transactions can participate, and the resources can include rows, keys, tables or other lockable objects depending on the database.

A timeout is different again. It means a configured waiting or execution limit was reached. A timeout may occur during blocking without any deadlock. Treating every timeout as a deadlock can send the investigation towards lock ordering when the real issue is one unusually long transaction.

Classify the actual error and collect the database's diagnostic evidence. The correct response depends on whether the transaction was aborted, whether work remains active and what the product guarantees after that error.

## Follow a two-resource cycle

This is an illustrative example. Two transactions update stock-control records for bins A and B. Transaction One acquires the lock for A first. Transaction Two acquires the lock for B first.

Transaction One then needs B and waits because Two holds it. Transaction Two then needs A and waits because One holds it. Each is waiting for the other to finish, but neither can finish its planned work.

| Sequence | Transaction One | Transaction Two |
| --- | --- | --- |
| First lock | Holds bin A | Holds bin B |
| Second request | Requests bin B and waits | Requests bin A and waits |
| Dependency | Waits for Two | Waits for One |

The database can break the cycle by aborting one transaction. The surviving transaction can then continue once the conflicting locks are released according to the database's behaviour.

This is not evidence that both transactions were trying to corrupt data. They may each represent legitimate operations. The problem is the combination of resources and the inconsistent order in which they were acquired.

## Read the deadlock evidence as a relationship

Useful diagnostics identify the participating transactions, resources held, resources requested and statements involved. A deadlock graph or report is most valuable when it explains the waiting relationships rather than merely naming the transaction chosen as the victim.

PostgreSQL's [explicit locking documentation](https://www.postgresql.org/docs/current/explicit-locking.html) describes deadlock detection and recommends consistent acquisition order for multiple locks. It also notes that applications should be prepared for transaction aborts due to deadlocks. Other products provide different diagnostic formats and victim-selection behaviour, so use their documentation for interpretation.

Collect the whole transaction context where possible. The statement shown waiting may not be the statement that acquired the earlier conflicting lock. Looking only at the last SQL statement can therefore miss the beginning of the cycle.

Record application operation names, transaction identifiers, timing and relevant parameter patterns without exposing unnecessary confidential values. These connections help translate an internal lock graph into the business workflows that need correction.

## Investigate the survivor as well as the victim

The transaction aborted by the database is not automatically the cause that should be redesigned. It is the selected point at which the cycle is broken. Another participant may hold locks for longer, acquire them in an unusual order or perform unnecessary work inside the transaction.

Review both sides symmetrically. Identify what each held before it began waiting, how it obtained those locks and what conditions caused it to request the next resource. Include triggers and related database operations that may not be visible in the application's immediate statement.

Look for recurring pairs of workflows: receipt processing against stock correction, order cancellation against allocation, or bulk maintenance against interactive updates. A pattern across incidents provides stronger evidence than one isolated failure.

Also examine the frequency and impact. A rare conflict with prompt, correct recovery differs operationally from a sustained retry storm. The objective is acceptable and correct service, not necessarily a claim that no deadlock can ever occur under any future workload.

## Establish a consistent acquisition order

For transactions that need the same class of multiple resources, define a common order. In the bin example, both operations could acquire the lower bin identifier before the higher one, regardless of the direction of the business transfer.

The order must be followed by every relevant path. If interactive transfers follow it but a reconciliation job does not, the cycle remains possible. Document the rule where developers and maintainers of all participating operations will find it.

Be cautious about assuming that the order of identifiers in a SQL expression dictates the physical order in which the database acquires locks. The optimiser may select a different access path. Use a supported mechanism whose lock acquisition behaviour matches the intended protocol.

If several resource classes are involved, define the class order as well: for example, a control record before its detail records. The exact order is system-specific; consistency across competing operations is the important property.

This approach can prevent particular cycles, but it should be supported by evidence that the chosen order covers the resources actually involved, including indirect locks.

## Examine lock upgrades and indirect work

Transactions may begin by taking one kind of lock and later request a stronger one. Two transactions can each hold a compatible weaker lock and then both wait to upgrade. The resulting cycle is different from simply visiting two rows in opposite order.

Where a transaction is known to require an update, review whether its initial access pattern obtains appropriate protection in a way supported by the database. Avoid changing lock strength blindly, because broader or earlier locks can reduce concurrency for unrelated work.

Foreign-key checks, unique-index maintenance and triggers can introduce resources beyond the obvious target row. A transaction that appears to update one table may participate in a cycle involving another structure.

Read schema relationships and procedural database code alongside the diagnostic report. If the lock graph references an unexpected object, treat that as evidence to explain rather than noise to ignore.

The investigation should account for the complete operation performed by the database, including work the application did not explicitly spell out in its final statement.

## Shorten the period for which locks are held

Long transactions create more opportunities for overlap. An operation that acquires a lock and then performs slow unrelated work keeps other transactions exposed to waiting while no progress is being made on the protected data.

Move preparation outside the transaction where it is safe to do so. Parse files, validate formats and gather non-volatile inputs before acquiring operational locks. Recheck the conditions that can change once the transaction begins.

Avoid waiting for user input or slow external calls while holding database locks. If a workflow requires a lengthy approval, represent that workflow state explicitly and use a later short transaction for the authorised change.

Do not shorten transactions by splitting an operation that must remain atomic without redesigning its semantics. Committing half a stock transfer merely to release locks replaces a concurrency problem with an integrity problem.

The aim is to remove unnecessary time inside the transaction while preserving the unit of work the business requires.

## Review access paths and batch size

An inefficient access path can cause a transaction to inspect or affect more data than expected, increasing duration and potential interference. Appropriate indexes can reduce that work, although the precise effect on locking depends on the database and statement.

Use the execution plan and observed locks to establish the connection. Do not assume every deadlock can be solved by adding an index, or that an index change cannot create a different acquisition pattern.

Bulk operations deserve particular attention. Large batches may hold many resources for a long period. Smaller batches can reduce the scope of interference when the business operation permits independent commits.

Define the consequences of partial completion before changing batch size. A batch that can be restarted safely needs a stable way to identify completed work and avoid applying the same change twice. Operational convenience does not remove the need for correct recovery.

Measure the effect under representative concurrent activity. A batch that is fast when run alone may still impose unacceptable delays on interactive work.

## Retry the complete logical attempt

When the database aborts a transaction to break a deadlock, the application needs a recovery policy appropriate to that product. Confirm that the transaction has been rolled back or explicitly roll it back as required before beginning a new attempt.

Retry the logical unit of work, including reads and decisions that depended on the earlier state. Repeating only the last statement can leave the application using assumptions that no longer hold after the competing transaction completes.

Use a bounded policy with an appropriate delay and variation between retries. Immediate synchronised retries by many callers can recreate contention. The exact retry limit and timing should reflect the operation's latency requirements and observed conflict rate.

After the limit is reached, provide a controlled failure or queue the work according to a defined process. Record enough context to investigate the incident. An endless loop can hide a serious problem while consuming resources and leaving the user waiting.

Do not automatically retry every database error under the same policy. Validation failures, permission errors and malformed queries require different treatment from transient concurrency conflicts.

## Protect external effects during recovery

A transaction retry can repeat application code that sends messages, calls services or records external actions. A database rollback does not necessarily reverse those effects. The application must know which steps can safely run again.

Use stable operation identifiers and duplicate recognition where appropriate. If an integration request might have completed before a connection failed, reconcile its outcome rather than assuming that the absence of a response means nothing happened.

One useful pattern records the intended outgoing work within the database transaction, then processes it separately with explicit delivery and duplicate-handling rules. This separates committed intent from the external action without pretending that the two systems share one atomic transaction.

The exact approach depends on the receiving service and business operation. The design requirement is clear: recovering from a deadlock must not cause duplicate dispatches, duplicate notifications with misleading content or repeated financial actions.

Test these paths with deliberate failures. A successful database retry is incomplete evidence if the surrounding application has already produced an inconsistent external result.

## Build a controlled reproduction

Use two sessions and a small test dataset to reproduce the observed ordering. Pause each session after it acquires its first resource, then request the resource held by the other. This makes the cycle deterministic enough to inspect.

Apply the proposed ordering or transaction change and repeat the test. Confirm not only that the original deadlock disappears, but that both operations still produce the correct business result. Waiting may remain, and that can be acceptable.

Add variations reflecting the real incident: multiple detail rows, reversed identifiers, concurrent imports or trigger activity. A reproduction simplified beyond the relevant resource relationships may pass while the production cycle remains possible.

Then run workload tests to assess throughput, latency and retry frequency. Controlled tests establish the causal mechanism; broader tests establish whether the revised behaviour is useful under realistic demand.

Retain the reproduction as a regression test when it is stable and meaningful. It protects the lock protocol against later changes that reintroduce an incompatible path.

## Monitor the outcomes that matter

Count deadlocks, but also measure affected operations, successful retries, exhausted retries and user-visible failures. Ten detected deadlocks recovered within the expected service level have a different impact from one incident that leaves important work unresolved.

Watch transaction duration and blocking time alongside deadlock counts. A change that removes cycles by serialising too much work may reduce deadlocks while making the system slower overall.

Group incidents by operation pair and resource pattern. This helps prioritise a recurring cause rather than treating every error message as a separate mystery. Include deployment and batch-schedule context when patterns change.

Define escalation thresholds according to business effect. A sudden increase after a release deserves investigation even if retries are currently masking it. Recovery is a protection, not a reason to stop observing the underlying condition.

## Prepare a useful supplier discussion

For a business using packaged software, direct schema or locking changes may be unsupported. Provide the supplier with operation names, timestamps, error details and reproducible steps through the supported application, together with database diagnostics collected by an authorised administrator.

Ask the supplier to explain the cycle, the intended retry behaviour and the scope of any proposed fix. A recommendation to increase a timeout does not by itself address a circular wait, although timeout settings may be relevant to other symptoms.

Request evidence across the affected workflows rather than a single successful rerun. If the fix changes transaction ordering, batch size or indexes, the supplier should verify correctness and workload effects as well as the original failure case.

Deadlocks are best managed as understandable interactions between transactions. Capture the cycle, identify every participant, establish consistent protocols where appropriate and recover safely from rejected attempts. That combination improves reliability without weakening the data rules the locks exist to protect.

---

*Source: the supplied Database Management Systems, second edition, particularly chapter 19 on concurrency control and deadlock handling; PostgreSQL explicit-locking documentation linked above. Bin transfers and diagnostic scenarios are original illustrations. Error handling and lock behaviour must be checked for the database product and version in use.*
