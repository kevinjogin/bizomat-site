---
title: "Compensating business workflows across databases"
description: "Design recovery for workflows that commit changes in several systems, with explicit compensation, durable progress, safe retries and visible unresolved work."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - operations
  - automation
author: "KEVOS®"
featured: false
draft: false
---

A database transaction can make several changes succeed or fail together inside its supported boundary. A business workflow often extends beyond that boundary. It might reserve material, arrange transport and release a production order through services that each control their own records. The overall request can fail after some of those services have committed useful, externally visible work.

Recovery then requires more than issuing a database rollback. The organisation needs to decide which completed actions should remain, which should be counteracted and which consequences can no longer be reversed. These are business decisions expressed through software.

A **compensating workflow** records the actions already completed and performs appropriate follow-up actions when the original objective cannot be achieved. Its purpose is to reach an acceptable business outcome despite partial completion. Understanding that outcome is the foundation for reliable implementation.

## Begin with the boundary of atomicity

Consider a manufacturer coordinating a special delivery. This is an illustrative example. A planning service reserves a machine slot, a warehouse service allocates material and a carrier service accepts a collection request. Each service records its own commitment. The customer then cancels while the final confirmation is being prepared.

One local transaction cannot normally undo all three commitments. The planning database may know nothing about the carrier's booking. Even if the databases could participate in a distributed transaction, an email already delivered or a vehicle already dispatched remains an external consequence.

Write down the boundary within which a transaction actually provides atomicity. Include the database connection, participating resources and the behaviour of external calls. A function named `completeOrder` is not itself an atomic boundary. Neither is a sequence of calls wrapped in one application method.

For every step, distinguish a request being sent, a request being accepted and the resulting business action becoming effective. Those moments can differ. A timeout after sending a booking request does not prove that the carrier rejected it. Recovery must sometimes establish what happened before deciding what to do next.

This inventory reveals where the workflow needs explicit intermediate states. It also prevents a local success message from being mistaken for completion of the entire business process.

## Compensation is a new action with its own meaning

Suppose the material reservation succeeds but the machine slot is unavailable. Releasing the reservation may compensate for the allocation. The release is a new recorded action. It should identify the reservation it affects, preserve the history and respect any work that has occurred since the allocation.

Restoring an old snapshot is usually too crude. If other orders have subsequently reserved material, replacing the stock record with its earlier value could erase legitimate changes. Compensation should act on the commitment created by this workflow, using the current state and appropriate conditions.

The same distinction applies to money, capacity and documents. A refund is not the disappearance of a payment. Cancelling a booking is not the disappearance of a booking request. Withdrawing an issued document does not make earlier recipients forget it. Each action leaves evidence that may matter to later decisions.

Define compensation in business language before translating it into updates. For a reservation, the rule might be to release its unused quantity if it has not entered picking. If picking has started, the workflow may require a separate return process. If material has been consumed, releasing a reservation alone would misrepresent reality.

Some completed actions need no compensation because retaining them is acceptable. Others cannot be counteracted automatically. A sound design identifies both cases instead of assuming every forward operation has a simple inverse.

## Model the states people need to understand

A single success or failure flag cannot adequately describe partial completion. The workflow needs states that distinguish work not yet attempted, an uncertain response, confirmed completion, compensation requested and compensation confirmed. It also needs a visible state for an unresolved problem requiring attention.

State names should communicate the business position. A dispatch coordinator needs to know whether a collection remains booked, not merely that a network request failed. The internal error detail belongs alongside that information, with enough context for technical investigation.

For the manufacturer, a failed workflow could still hold a material reservation while its carrier cancellation is pending. Those obligations should remain visible independently. Marking the whole workflow cancelled too early can hide commitments that still consume capacity or trigger work.

Record the intended overall outcome as well as individual step outcomes. After the customer cancels, a delayed success response from a reservation request should not automatically return the workflow to fulfilment. The recorded cancellation intent determines the next action.

Transitions need explicit preconditions. A worker should confirm that it is acting on the expected workflow version and current intent before making a consequential change. Otherwise, two workers handling different responses can each make a locally reasonable decision that produces an inconsistent overall result.

```figure
type: svg
title: Undoing a workflow that spans systems
alt: A special-delivery workflow allocates material in the warehouse service, then tries to reserve a machine slot, which is unavailable. A compensating action then releases the material reservation as a new recorded action, rather than restoring an old snapshot.
caption: Releasing the reservation is a new recorded action; restoring an old stock snapshot could erase other orders' changes.
viewbox: 0 0 640 210
body:
<rect class="bx" x="40" y="40" width="220" height="44" rx="6"/>
<text class="tx" x="150" y="67" text-anchor="middle">Allocate material ✓</text>
<rect class="bx dsh" x="380" y="40" width="220" height="44" rx="6"/>
<text class="tx" x="490" y="67" text-anchor="middle">Reserve machine slot ✕</text>
<path class="la flow" d="M260 62H380"/>
<rect class="bxa" x="40" y="140" width="220" height="44" rx="6"/>
<text class="txb" x="150" y="167" text-anchor="middle">Release the reservation</text>
<path class="la flow" d="M490 84V162H260"/>
<text class="tx txs" x="380" y="152" text-anchor="middle">compensate with a new action</text>
```

## Keep progress durable enough to resume

An in-memory list of completed steps disappears when the process stops. Reliable recovery requires durable records of the workflow identifier, its current objective, completed commitments and outstanding actions. After a restart, another worker should be able to determine what remains without relying on the original worker's memory.


Store identifiers returned by participating systems. A reservation identifier is more useful for compensation than a general note saying that stock was allocated. Preserve the relevant operation identifier, request version and response evidence, while avoiding unnecessary sensitive payloads in logs.

There is a difficult interval between a remote action taking effect and the coordinator recording its success. If the coordinator crashes in that interval, the action may have happened even though its progress record says otherwise. The recovery design must resolve that uncertainty through a stable request identifier, a status lookup or another supported reconciliation mechanism.

The participant's own local changes should be recorded consistently. If it changes business data and creates a message describing that change, those records need a defined relationship. A transactional outbox can place the business update and an outgoing event record in one local transaction; later delivery still requires duplicate-aware handling.

Durability is therefore more than writing a workflow row. It includes the evidence needed to reconcile ambiguous outcomes and the local guarantees on which subsequent recovery decisions depend.

## Make retries safe at the business boundary

Retries are unavoidable when responses can be lost. The important property is that repeating the same logical request does not repeatedly create its business effect. A request identifier must therefore refer to the intended operation, rather than being regenerated every time the caller tries again.

For example, releasing reservation R should not release another quantity each time a worker retries. The participant can record that release operation C has already been applied and return its established result. It must also reject an attempt to reuse C for a different reservation or quantity.

The protection must surround the actual business update. Checking a separate log and then performing an unprotected change leaves a race in which two requests both appear new. The check, decision and effect need an appropriate atomic or concurrency-controlled implementation at the participant.

Idempotency also has a retention dimension. If a participant forgets operation identifiers before delayed messages can arrive, an old retry may be treated as a new instruction. Define retention in relation to the workflow's retry, recovery and replay behaviour rather than choosing a convenient short interval without analysis.

Some external systems offer no reliable duplicate protection. In that case, automatic retries may be unsafe after an ambiguous response. The workflow should pause for reconciliation rather than blindly repeat a potentially consequential instruction. The uncertainty is an operational state to manage, not an error message to suppress.

## Choose compensation order from dependencies

Reversing the order of completed steps is a useful starting point, but it is not a universal business rule. Dependencies, safety and the time sensitivity of commitments determine the actual sequence. Some actions can proceed independently; others must wait for a prerequisite to be confirmed.

The manufacturer may need to stop a collection before releasing material back into available stock. Releasing material first could allow another order to claim goods that are still physically on a loading dock. A different process may safely release a machine reservation immediately while transport cancellation continues.

Describe these dependencies as rules rather than burying them in a sequence of service calls. State which actions must complete before others begin, which may run independently and what evidence establishes completion. This makes the recovery process reviewable by people responsible for the work.

Compensation can introduce new commitments of its own. Returning goods might require a collection booking, inspection and a decision about reuse. Treating that process as a single instantaneous reversal hides both cost and risk. It may be better represented as a linked workflow with its own status and accountable owner.

Avoid holding a database transaction open while waiting for a long external recovery process. The business workflow may last minutes or days. Local transactions should protect well-defined local state changes while durable workflow records connect those changes over time.

```figure
type: checklist
title: Making compensation dependable
caption: Failed compensation is expected work, not an exceptional disaster.
- x Progress stored durably enough to resume
- x Retries safe at the business boundary
- x Compensation order follows dependencies
- x A queue and owner for failed compensation
- *x Tests for uncertain outcomes, not only rejections
```

## Treat failed compensation as expected work

The service needed to undo a commitment may be unavailable for the same reason that caused the original workflow to fail. Recovery therefore needs its own retry policy, monitoring and escalation path. An exception thrown from a compensation handler cannot be the end of the design.

Classify failures by what they mean. A temporary connection failure may justify retrying. A response that the reservation has already been consumed requires a different decision. An unknown identifier may indicate stale evidence, a mismatch between environments or an earlier successful cancellation whose record has expired.

Give unresolved workflows an owner and a useful work queue. The queue should show the outstanding commitment, attempts made, current uncertainty and the safe actions available. People should not have to infer the business position from several unrelated application logs.

Manual intervention also needs a record. Capture the decision, supporting evidence and resulting state so that automated workers do not later repeat or contradict it. Where a human resolves an external booking directly, the coordinator needs a controlled way to recognise that resolution.

Set expectations about time. A workflow that remains unresolved for a few seconds may be routine; one that holds scarce material overnight may require urgent attention. Measures should reflect the business cost of outstanding commitments, not just the number of errors in a technical dashboard.

Control the rate of recovery work during a wider outage. Thousands of workflows retrying together can prevent a recovering participant from serving either normal requests or cancellations. Use bounded concurrency and a retry schedule appropriate to the failure, while preserving the priority of urgent commitments. A recovery queue also needs capacity planning: an acceptable retry interval means little if the queue grows faster than workers can resolve it. Watch the age of the oldest outstanding action alongside the total queue size so that a small number of stranded workflows remains visible.

## Understand when coordination is a different option

Some systems support distributed transactions in which a coordinator asks participating resource managers to prepare and then decides whether they should commit. This can provide a stronger atomic outcome for supported resources, but it introduces coordination and recovery responsibilities of its own.

Prepared work can retain resources while a decision remains unresolved. PostgreSQL, for example, documents prepared transactions as a facility intended for an external transaction manager and warns against leaving them unresolved. A team considering that approach must understand the participating systems, failure handling and operational ownership.

A compensating workflow makes a different business promise. Intermediate effects may become visible, and recovery can take time. That may suit reservations, provisioning or fulfilment processes whose commitments have meaningful cancellation actions. It is less suitable when the business cannot tolerate the intermediate exposure at all.

The choice should follow the required invariant. If two records must never be observably inconsistent, first examine whether they should share an atomic boundary. If a long process inherently involves independent organisations and physical activity, pretending it is one short transaction may be misleading.

Do not select compensation solely because it avoids coordination technology. Select it when the intermediate states, corrective actions and unresolved cases form an acceptable operating model. The business semantics are as important as the transport and database mechanisms.

## Test uncertainty, not only explicit rejection

The most revealing tests interrupt a workflow at uncomfortable moments. Stop the coordinator after a participant commits but before the response is recorded. Deliver the same request twice. Delay an old response until after cancellation. Restart a worker while compensation is in progress.

For each test, inspect business records in every participant as well as the coordinator's status. A green workflow dashboard is insufficient if a carrier booking or inventory reservation remains active elsewhere. Reconciliation should compare the actual commitments with the intended outcome.

Test competing activity too. Another order may reserve stock while a cancellation is being processed. A warehouse operator may start picking before a delayed release arrives. The compensation rules must preserve those legitimate later actions and reject transitions that are no longer valid.

Define completion criteria in concrete terms. A cancelled delivery workflow might require no active machine reservation, no unused material allocation and either a confirmed transport cancellation or an explicitly accepted exception. Recording that the last handler returned successfully does not prove those conditions.

Finally, rehearse the unresolved path with the people who will operate it. Give them a deliberately ambiguous case and confirm that the evidence supports a decision. A workflow is recoverable when both its automatic mechanisms and its human procedures can establish and resolve the real business position.

## Source basis and further reading

The source collection's *Data Access Patterns* provides the Transaction and Compensating Transaction patterns used as the starting point for this article. The examples and operational analysis here are original, and the book's historical implementation details are not treated as current product guidance.

Microsoft's [Compensating Transaction pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction) discusses recovery actions, repeatability and cases requiring manual intervention. AWS documents the local record-and-event relationship in its [transactional outbox guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html). PostgreSQL explains the operational responsibilities of prepared work in [PREPARE TRANSACTION](https://www.postgresql.org/docs/current/sql-prepare-transaction.html).
