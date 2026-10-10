---
title: "Transaction isolation and concurrent business decisions"
description: "Understand why individually valid database transactions can conflict, how isolation affects business rules, and how to test concurrent decisions and retries."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - validation
  - operations
author: "KEVOS"
featured: false
draft: false
---

Two users can each receive a valid answer from a database and still make a jointly invalid decision. Both may see the last available item, both may see room under an allocation limit, or both may see another person covering an operational role. The problem emerges between their observations and their completed changes.

**Transaction isolation** governs how concurrent database operations interact. It is part of making a business operation correct when other operations are happening at the same time. A workflow that passes every single-user test can still fail if its assumptions about concurrent change are wrong.

Understanding isolation does not require treating every application as a research project. It requires identifying the business rule, the information used to decide, the writes that follow, and the competing operations that could invalidate the decision. Those elements make the required protection concrete.

## Define the business operation as a transaction

A **transaction** groups database work into a unit with defined success or failure behaviour. For a transfer between stock locations, the operation might reduce one balance, increase another and record the movement. Partial completion would misrepresent the stock position.

Atomicity concerns whether the transaction's database changes take effect together. Isolation concerns interaction with concurrent transactions. These are related protections, but atomicity alone does not guarantee that a decision based on earlier reads remains valid.

Start by writing the transaction's intended invariant: the condition that must remain true. For a simple transfer, the transferred quantity must be represented consistently at both locations. For a reservation, accepted allocations must not exceed the permitted quantity.

Then identify the decision boundary. Does the application read availability, wait for a user to confirm and later write? Does it perform the check and change in one database operation? Does the operation also depend on an external system? These differences affect what a database transaction can guarantee.

## Understand serial execution as a reference point

If transactions ran one at a time, each would see the effects of the earlier completed transaction. This **serial execution** provides a useful reference for reasoning about correctness, although running everything serially would unnecessarily limit many workloads.

**Serializable** execution permits concurrency while requiring an outcome consistent with some serial ordering of the committed transactions. It does not mean every transaction literally runs alone or that the database guarantees a particular ordering selected by the application.

The starting assumption remains important: each transaction must preserve the business rules when run against a valid state. Serializability cannot repair a transaction whose own logic accepts an invalid result. It coordinates correct operations; it does not invent the rules they should follow.

Likewise, database isolation does not automatically coordinate unrelated external effects. Sending a message, charging through another service or changing a machine controller introduces boundaries beyond one local transaction. Those need an integration design appropriate to their guarantees.

## Recognise different kinds of interference

A dirty read observes another transaction's uncommitted change. A non-repeatable read occurs when rereading a value reveals a committed change made by someone else. A phantom concerns a changed set of rows satisfying a condition, such as another matching reservation appearing.

These names describe useful symptoms, but business correctness often requires considering the whole operation. Two transactions may each work with internally consistent snapshots and update different rows, yet together violate a rule spanning those rows.

A lost update is another familiar concern. One user reads a record, another changes it, and the first later writes a replacement based on the old version. Without suitable protection, the later write can erase a change the first user never saw.

Do not infer guarantees from an isolation-level name alone. Products implement the levels differently and may provide stronger behaviour than a minimum definition in some respects. Verify the documented behaviour and test the actual database configuration.

## Follow a decision made from a snapshot

This is an illustrative example. A dispatch desk requires at least one coordinator to remain assigned during a shift. Two coordinators, A and B, are currently assigned. Each can withdraw only if another assigned coordinator remains.

Two transactions begin from a view containing both assignments. Transaction A checks that B remains assigned and removes A's assignment. Transaction B checks that A remains assigned and removes B's assignment. The transactions update different records.

| Step | Transaction A | Transaction B |
| --- | --- | --- |
| Read | Sees A and B assigned | Sees A and B assigned |
| Decide | B provides remaining cover | A provides remaining cover |
| Write | Removes A's assignment | Removes B's assignment |
| Combined result | No coordinator remains | The coverage rule is violated |

Each transaction would be valid if run alone against the starting state. Their combined result is not equivalent to either serial order: the second withdrawal in a serial execution would find no remaining colleague and be refused.

This pattern is commonly called **write skew**. It demonstrates why “the transactions update different rows” is not sufficient evidence that they are independent. Their decisions depend on a shared condition across the records.

## Distinguish a stable view from serializable behaviour

A stable snapshot can make reporting easier by keeping a transaction's view consistent over several reads. That does not necessarily ensure that several concurrent decisions based on their own snapshots can all be accepted together.

PostgreSQL provides a concrete example: its Repeatable Read implementation uses snapshot isolation and can permit serialization anomalies, while Serializable adds protection against those anomalies. Its documentation also requires applications to handle transaction retries where serialization failures occur. See the [transaction isolation reference](https://www.postgresql.org/docs/current/transaction-iso.html) for the product's specific guarantees.

The distinction is between seeing a coherent view and participating in a jointly valid history of decisions. Both properties can matter, but they answer different questions.

For a multi-query report, a stable view may be the central requirement. For releasing scarce capacity based on several related reads, the interaction between readers and writers may require stronger coordination. Choose the mechanism from the operation's rule rather than assuming one setting suits every use.

## Keep simple state changes close to the condition

Some races can be reduced by expressing a condition and change together. Instead of reading a quantity into the application and later writing a calculated replacement, an operation can request a relative change subject to a condition on the current row.

The application must then inspect whether the expected row was actually changed. A zero-row outcome can mean the condition no longer holds, the record does not exist or another required predicate failed. It should not automatically be reported as success.

This approach is especially useful when the invariant is confined to one controlled record. It becomes more complex when the rule involves several rows, such as a sum of independent allocations. Moving arithmetic into SQL does not automatically coordinate the wider condition.

Verify the database's locking and update semantics for the operation. The design should explain why concurrent attempts cannot both produce an invalid result, rather than relying on the assumption that a compact statement must be safe.

## Use version checks for edits based on old data

An **optimistic concurrency** pattern records a version with a row. A user reads the row and its version, then requests an update only if the version remains unchanged. A successful update advances the version; a mismatch indicates that the user was editing an older state.

This can prevent a blind overwrite of someone else's change without holding a database lock while a person fills in a form. The application can ask the user to review the newer state or apply an explicitly defined merge policy.

The version must represent all changes relevant to the protected decision. If another write path changes the row without advancing it, the guarantee is weakened. The check and update also need to be performed atomically through a suitable database operation.

Row versioning addresses stale edits to that row. It does not, by itself, protect an invariant involving several independently versioned rows. The dispatch-desk example can still fail if each transaction successfully updates its own unchanged assignment.

## Use explicit locks as a protocol

Explicit locking can coordinate a business operation by making competing transactions wait at a shared resource. For the dispatch example, a shift-control record could provide a common coordination point before reading and changing assignments.

The protocol matters more than the presence of a lock statement. Every operation capable of changing the relevant assignments must acquire the same coordination lock and then evaluate the rule using the appropriate current data. A single bypassing import can invalidate the reasoning.

Keep the locked transaction short. Do not wait for human decisions or slow external calls while holding shared operational resources. Perform preparation before acquiring the lock where possible, then recheck the conditions that may have changed.

Define lock ordering if an operation coordinates several resources. Inconsistent acquisition order can create deadlocks even when the individual rules are sensible. The application needs an explicit failure and retry policy for these situations.

Locks provide a useful mechanism, but an undocumented convention is fragile. Include the protocol in the operation's design and in tests for every participating write path.

## Make retries part of the operation

Some concurrency mechanisms preserve correctness by rejecting an attempted execution. A transaction may need to retry after a serialization conflict or deadlock. This is expected control flow under those conditions, not necessarily evidence of a broken database.

A retry must reconsider the decision using the new state. Replaying only the last write with values calculated from the earlier attempt can repeat the original mistake. The relevant reads, validation and choice of action belong to the retried unit.

Limit retries and handle exhaustion. Repeated conflicts may indicate heavy contention or a design that needs a clearer coordination strategy. An infinite retry loop converts a controlled conflict into an unbounded user wait.

Keep irreversible external actions outside assumptions about local rollback. A message sent during the failed attempt could be sent again on retry. A reliable design records an intended external action within the transaction and coordinates its later delivery with suitable duplicate protection.

The exact integration pattern depends on the external service. The central requirement is that a database retry does not silently repeat a business action whose first execution already took effect elsewhere.

## Distinguish retryable conflicts from unknown outcomes

A known transaction rollback is different from losing the connection while waiting for commit confirmation. In the latter case, the application may not know whether the transaction committed. Blindly repeating the operation can create a duplicate business event.

Use stable operation identifiers where duplicate submission is a realistic possibility. The receiving system can associate the identifier with the completed outcome and recognise a repeated request, subject to a carefully defined scope and retention policy.

Do not describe this as a universal guarantee of exactly-once execution. It is a design for recognising repeated operations and returning or reconciling their outcomes. External systems, retention windows and partial failures still need consideration.

Expose uncertainty honestly to the user. “The result is being checked” can be more accurate than either “failed” or “successful” when commit acknowledgement was lost. The recovery path should establish the outcome before creating another operation.

## Test the interleaving deliberately

Concurrency defects can be difficult to reproduce with random load alone. Construct a controlled test with two sessions and pauses at the critical decision points. Make both sessions read before either completes the relevant write.

For the dispatch example, start with both coordinators assigned. Have both transactions evaluate the withdrawal condition, then attempt the changes. The acceptable result must preserve at least one assignment, whether through waiting, rejection or retry.

Test the recovery behaviour as well as the final data. A rejected transaction should not leave a misleading success message, an external notification or an unhandled error. A retry should reevaluate the changed condition and may legitimately produce a different business answer.

Repeat tests for imports and background jobs that affect the same invariant. A well-protected interactive path is insufficient if an automated process changes the data under weaker assumptions.

Use load tests afterwards to assess throughput and conflict rates. Correctness tests establish that the protocol works; workload tests establish whether its operational behaviour is acceptable.

## Choose protection according to the invariant

There is no need to apply the most restrictive approach indiscriminately. Some operations only append independent events. Others update one controlled record. Others make decisions over a changing set of related rows. Their coordination requirements differ.

For each important operation, record the invariant, competing changes, chosen isolation or locking approach, and retry behaviour. This creates a reviewable explanation that can be revisited when the schema or workflow changes.

Consider the cost of contention alongside the cost of incorrect acceptance. Serialising access to one shared control record may be simple and effective for a modest workload, while a high-volume system may need a more specialised design.

Measure with the actual workload rather than assuming that stronger isolation is always prohibitively slow or always inexpensive. The frequency and shape of conflicts matter as much as the nominal isolation level.

## Give business users a clear outcome

Concurrent systems sometimes have to refuse a request that looked possible a moment earlier. Explain that the underlying state changed and provide an appropriate next step. Do not conceal the conflict by accepting an invalid result or endlessly retrying without feedback.

For suppliers and internal developers, ask for evidence that critical operations have been tested with competing sessions. A demonstration performed by one person clicking through screens cannot establish this property.

Transaction isolation becomes easier to reason about when it is tied to a concrete business promise. Identify what must remain true, coordinate the operations that can challenge it, and make retries and uncertain outcomes explicit. The result is a workflow that remains correct when real people work at the same time.

---

*Source: the supplied Database Management Systems, second edition, chapters 18 and 19 on transactions and concurrency control; PostgreSQL transaction-isolation documentation linked above. The dispatch-desk scenario and operational examples are original illustrations. Isolation names and guarantees must be verified for the database product and version in use.*
