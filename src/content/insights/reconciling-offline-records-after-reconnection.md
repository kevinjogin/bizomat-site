---
title: "Reconciling offline records after reconnection"
description: "Design offline data capture around provisional work, durable local records, conflict rules and clear reconciliation when devices reconnect to shared systems."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

A field application may need to keep working in a basement, a remote workshop or a vehicle with intermittent connectivity. Saving a form locally is only the beginning. While the device is disconnected, other people may change the same work order, consume the same stock or revise the instructions on which the local work depends.

Reconnection brings those independently changing views together. The system must determine which records can be accepted automatically, which conflict and which describe work that has already happened even though it no longer fits the current central state.

Reliable offline design starts with the meaning of local acceptance. A device can promise that it has saved an observation without promising that a shared reservation or approval has been confirmed. Making that distinction explicit allows the data model, interface and reconciliation process to support the real operating conditions.

## Decide which actions can legitimately proceed offline

Consider technicians inspecting equipment at a remote site. This is an illustrative example. They need to record observations, photographs and materials used. They may also want to allocate a scarce replacement component or approve a change to the work scope.

These actions have different coordination needs. Recording that a technician observed damage can usually proceed as a local fact. Reserving the last centrally managed component depends on whether someone else has already claimed it. The device's old stock balance cannot establish current availability.

Classify operations by the promise they make. Some can be completed locally, some can be recorded as provisional requests and some require current central authorisation. This classification should be based on business invariants, rather than treating every screen as equally suitable for offline use.

Where a disconnected action consumes a scarce resource, consider whether the resource can be allocated in advance. A technician might receive a defined stock allowance or a set of authorised jobs before departure. That changes the coordination problem, but it also creates rules for issuing, tracking and returning the allocation.

Avoid presenting a provisional action as final merely to simplify the interface. Users will reasonably act on a confirmation message. The system should state what has been saved, what is pending and what further work depends on central acceptance.

## Distinguish observations from instructions to change state

An observation says that something happened or was measured. An instruction asks the system to change a business state. The two may be related, but treating them as interchangeable can cause information loss during reconciliation.

A technician's note that a seal was replaced remains evidence of work even if the central work order was cancelled during the disconnection. Rejecting the work-order update should not silently erase that observation. Instead, the system may need to retain it as an exception requiring operational review.

Conversely, a local instruction to reserve a component should not be accepted merely because the device recorded it successfully. The central service must evaluate the request against the current allocation rules or a valid pre-authorised allowance.

Design separate records where the meanings differ. An immutable observation can identify the asset, actor, local sequence and relevant instruction version. A workflow request can record the desired transition and the conditions under which it should be accepted.

This separation makes conflict handling more precise. The organisation can preserve evidence while declining an incompatible state transition. Users receive an explanation of the unresolved business issue instead of a generic message suggesting that their entire day's work failed to save.

## Give locally created records durable identities

Offline records need identifiers that remain stable through retries, synchronisation and reconciliation. If a device assigns a new identity every time it reconnects, the central system may interpret repeated transmission as several independent observations or material issues.

Identity generation must account for multiple devices. A simple counter beginning at one on each device is not globally unique unless it is qualified by a stable device or allocation identity. The chosen scheme should preserve uniqueness even when records are created without contacting the server.

Distinguish the identity of a record from the identity of an operation on that record. An observation may have one permanent identifier, while a correction or submission attempt has its own operation identifier and version context. This helps the receiver recognise a retry without confusing it with a legitimate later change.

Local storage must retain pending work through application restarts and ordinary device interruptions. A queue held only in memory provides no such assurance. Define what the application means by saved, including when the data has reached durable local storage and when a central acknowledgement has been recorded.

Plan for device replacement and recovery as well. If a device is restored from an old backup, its queue or counters may reappear in an earlier state. Duplicate detection and reconciliation should remain correct under that recovery scenario rather than relying on the device never being restored.

## Record the version on which an edit was based

When an offline user edits a shared record, the system should retain the version they originally saw. On reconnection, that base version helps distinguish a straightforward update from a change made against stale information.

Suppose a technician changes an equipment location while an office user changes its service classification. If the fields are genuinely independent, a controlled merge may preserve both edits. If one change affects the validity of the other, combining them mechanically may create an invalid record.

A field-by-field merge is therefore a policy, not a universal truth. It needs rules about dependencies, authority and business meaning. Two edits to different fields can still conflict, such as changing a unit of measure while another user changes the associated numeric value.

The base version also supports a useful conflict explanation. A reviewer can compare what the offline user saw, what they proposed and what the shared record now contains. Showing only two unexplained final values makes the decision harder and encourages arbitrary selection.

Retain enough context to support that comparison for the expected offline period. If the central system discards all relevant version information before a device returns, it may be unable to distinguish a safe merge from an uncertain overwrite. Version-retention policy and maximum disconnection time should be designed together.

## A last-write rule does not settle business authority

Choosing the update with the latest timestamp is attractive because it produces a simple winner. It can also discard a valid change. Device clocks may disagree, and the latest transmission may describe an earlier observation that was delayed in transit.

Separate event time, local recording time, central receipt time and reconciliation time. Each answers a different question. The order in which a server receives messages is not necessarily the order in which work happened, and a user-editable device clock may not establish a trustworthy global sequence.

Even a perfectly ordered sequence would not determine which change should have authority. A later edit by an unauthorised role should not override an approved instruction. A newer count may use a different stock location or measurement basis from the value it appears to replace.

Use last-write rules only where their consequences are acceptable and their ordering basis is defined. For other records, use explicit version checks, ownership rules, merge semantics or human resolution. The decision should be visible in the design rather than hidden in a synchronisation library's default.

Preserve the evidence behind a resolved conflict when it matters to later explanation. The final accepted value alone may not show why an offline observation was retained, superseded or referred for review. A resolution record can connect the outcome to the competing proposals and the decision made.

## Treat deletion as information that must travel

If a central record disappears while a device remains offline, the returning device may still hold a copy. Without a record of the deletion, synchronisation can mistake that copy for a new record and recreate something that was intentionally removed.

A deletion marker, often called a tombstone, communicates that the identity existed and was deleted. Its retention and propagation need to cover the supported reconnection behaviour. Deleting the marker too soon can make an old replica indistinguishable from a legitimate new submission.

Deletion can also conflict with an offline edit. The organisation must decide whether the edit should be rejected, restored as an exception or used to create a new entity through an explicit process. Automatically choosing either deletion or resurrection can be wrong for particular records.

Distinguish removal from ordinary use from physical erasure. An asset may be retired while its inspection history remains necessary. A cancelled job may still need to receive evidence of work performed before the technician learned about the cancellation.

These distinctions should be reflected in the data model. A lifecycle status often communicates a business decision more accurately than simply removing the row. Where actual deletion is required, the synchronisation protocol needs a defined way to prevent stale copies from silently reversing it.

## Reconcile dependent records in a meaningful order

Offline work frequently creates several related records. A technician may create an inspection, attach photographs and record defects against particular inspection items. Reconnection must preserve those relationships even if transfers arrive out of order or stop halfway through.

Stable identifiers allow child records to refer to parents before all payloads have arrived. The receiver still needs rules for pending references, completeness and visibility. A partially received inspection should not appear complete simply because its main row has been accepted.

Large attachments create a separate concern. A form can arrive successfully while photographs fail to upload. Track attachment status explicitly and verify the expected content before announcing that the entire inspection is available centrally.

Choose appropriate local transaction boundaries for related changes. A central operation may atomically accept a set of small records, while larger transfers use a staged process. Either approach needs a recoverable status that survives retries and avoids duplicate child records.

The interface should reflect this structure in language users understand. Saved on device, submitted, awaiting attachments and accepted are different outcomes. Clear status reduces repeated manual entry and helps users identify the particular item requiring attention rather than resubmitting an entire job blindly.

## Make conflicts visible without overwhelming the user

Not every difference needs a person. Independent observations can often be retained together, and defined merge rules can handle routine non-conflicting edits. Human review should focus on cases where business meaning or authority prevents a safe automatic outcome.

Present the relevant context concisely: the record involved, the original value, the offline proposal, the current accepted value and why the system could not decide. Include the related work already performed so that a reviewer understands the consequence of each resolution.

Avoid a generic choice between local and remote when the conflict involves several facts. A reviewer may need to retain one observation, reject a reservation request and create follow-up work. The resolution interface should match the actual decision rather than force an entire document to win or lose.

Assign ownership and monitor age. A conflict queue that nobody is responsible for becomes a hidden backlog of incomplete business records. Urgency should reflect operational consequences, such as missing inspection evidence or unresolved material usage.

The result of manual resolution must synchronise back to the device. Otherwise the local application may continue showing an obsolete pending state or repeatedly resubmit a rejected request. A complete reconciliation loop communicates both the accepted outcome and any next action required from the user.

Authorisation changes deserve an explicit rule during reconciliation. A person may have been entitled to perform work when the device went offline but have different permissions when it returns. The central system needs to distinguish accepting evidence of earlier work from authorising a new action now. Retain the relevant actor and context, verify them through the application's supported trust model and route uncertain cases for review. An unverified local timestamp alone should not establish that an action occurred before permission was withdrawn. This policy also affects shared devices, where the person submitting a queue may differ from the person who originally recorded an observation.

## Test the full disconnected lifecycle

Testing should include more than disabling the network during one form submission. Start with a known central state, take multiple devices offline, make competing changes and reconnect them in different orders. Confirm that the final business result follows the documented rules.

Interrupt transfer after the server commits but before the device records acknowledgement. Repeat the submission and verify that it produces one logical effect. Restart the application with pending records and confirm that it resumes without inventing new identities.

Test long absences, expired context, deleted records and changed instructions. A device returning after weeks may need a different process from one reconnecting after a brief interruption. Define a supported offline horizon and a controlled recovery path for work outside it.

Inspect reports during partial synchronisation. Determine whether they distinguish accepted facts from provisional requests and incomplete attachments. Operational dashboards should not imply completeness merely because some records have arrived.

Finally, run the process with users performing realistic work. Confirm that they understand what is safe to do offline, what each status means and how to resolve an exception. The system succeeds when locally useful work can be reconciled into shared records without losing evidence or making promises that disconnected data cannot support.

## Source basis and further reading

The mobile-transaction chapter in the source collection's *Advanced Topics in Database Research, Volume 2* distinguishes disconnection support, local execution, replication and acceptable final states. This article applies those enduring design questions to an original field-inspection example; the chapter's historical mobile-platform assumptions are not treated as current limits.

Apache CouchDB's [replication and conflict documentation](https://docs.couchdb.org/en/stable/replication/conflicts.html) offers a concrete example of a system that can retain conflicting revisions while selecting one for ordinary reads. That behaviour illustrates why successful replication and resolved business meaning are separate concerns, and should not be assumed to describe every synchronisation product.
