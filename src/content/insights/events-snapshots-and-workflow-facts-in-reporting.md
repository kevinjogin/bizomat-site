---
title: "Events, snapshots and workflow facts in reporting databases"
description: "How to choose reporting rows for events, periodic observations and workflow milestones, reconcile their populations and avoid confusing activity with outstanding work."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - operations
  - design
author: "KEVOS®"
featured: false
draft: false
---

A manager asks how many repair jobs arrived last week, how many remain open and how long completed jobs took. All three questions concern the same workshop, but they describe different populations. Arrivals are events, open jobs are a state observed at a point in time, and turnaround belongs to a journey between defined milestones.

A reporting database can make these distinctions explicit. If every question is forced through one vaguely defined table, analysts may count repeated status changes as new jobs, lose historical backlog figures or report only the easy jobs that have already finished. The resulting numbers can all be calculated correctly while answering different questions from those intended.

Choosing the meaning of one reporting row is therefore a business design decision. Event facts, periodic snapshots and workflow summaries provide complementary ways to represent activity. The practical challenge is to define their boundaries and reconcile them without pretending they are interchangeable.

## Declare the grain in one sentence

The **grain** of a reporting table states what one row represents. “One row per repair event” is incomplete if the system records several kinds of event. A more useful definition is “one row per accepted receipt of a repair job at a workshop, identified by the source receipt event”.

Include the relevant scope and time meaning. A periodic table might contain one row per open job at each agreed end-of-day observation. A workflow table might contain one row per repair attempt, updated as that attempt passes through recognised milestones. Each definition identifies a different counting unit.

Test the sentence against awkward cases. A job can be transferred, reopened or split into separate repair attempts. Decide whether these actions create new rows, change existing rows or belong in another table. If the answer changes depending on which report is being discussed, the grain has not yet been settled.

Keep a few examples beside the definition. A clear diagram is useful, but concrete records reveal ambiguity faster. Ask whether two valid rows could share the proposed key and whether one real occurrence could be represented twice through different loading paths.

## Use events to describe occurrences

An event fact records something that happened: receipt, dispatch, inspection completion or an accepted quantity adjustment. Its business timestamp describes when the occurrence belongs in the process. Its source identity helps distinguish a new occurrence from the same occurrence delivered again.

Event rows are useful for questions about flow. They can show how many jobs entered a workshop, which movements occurred or how much material was issued during a period. They do not automatically show the state of every job at the end of that period.

An event table also needs a correction policy. A duplicate source delivery should not create another business event. A genuine reversal should remain distinguishable from an accidental duplicate. Overwriting an event without preserving the correction context can make previously issued reports impossible to reconcile.

Avoid putting unrelated event populations into one table merely because they share a timestamp and an amount. A quotation, an accepted order and a shipment have different meanings. A common event envelope can be useful technically, but business measures still need explicit event types, units and counting rules.

## Use periodic observations to describe state

A periodic snapshot records state at a defined observation boundary. For open repair work, it might capture which jobs were open at the end of each workshop day and their status at that point. The observation time is part of the row's meaning, not simply metadata about when a file was loaded.

Such a table makes historical backlog analysis direct. Analysts do not need to reconstruct every prior state from an event stream for each report. The trade-off is that information between observations is not preserved by the snapshot alone. A job opened and closed between two observations may never appear as open in either.

Define completeness explicitly. An absent job row could mean the job was not open, the job was outside the workshop's scope, or the snapshot failed to load. A separate record of completed observations can help distinguish a genuine zero from an incomplete data delivery.

The observation boundary should match the business question. A calendar midnight, a shift handover and a reporting cutoff are different choices. Where workshops operate in different timezones, record which business day each snapshot represents rather than assuming the database server's date supplies the answer.

## Use workflow summaries for milestone questions

A workflow summary, often implemented as an **accumulating snapshot**, holds a row for a process instance and updates selected milestone fields as the process progresses. It might record receipt, assessment, approval, completion and dispatch times for one repair attempt.

The Kimball Group's [discussion of complementary fact table types](https://www.kimballgroup.com/2014/06/design-tip-167-complementary-fact-table-types/) describes event, periodic and accumulating fact tables as different views of business activity. The important design implication is that several representations can be useful when their grains and purposes remain explicit.

A milestone summary is convenient for elapsed-time questions, but it simplifies the path taken. A repair can return from testing to assembly several times. One “testing date” cannot preserve all those visits unless the business has chosen a specific meaning, such as the first entry or final successful completion.

Retain detailed events where repeated transitions matter. The summary can provide a convenient current interpretation without pretending to be the complete process history. A predictable, mostly linear workflow is easier to summarise this way than one with many loops, branches and parallel tasks.

## Compare the three views in one example

This is an illustrative example. A workshop begins Monday with eight open repair jobs. Five additional jobs are accepted during Monday and four existing jobs are completed and leave the open-work population. Assume no transfers, cancellations or reopenings occur, and assume the opening count is complete.

The closing backlog is eight plus five minus four, giving nine open jobs. An event report shows five arrivals and four completions. A Monday closing snapshot shows nine open jobs. A workflow summary contains milestone details for the relevant repair attempts, including the four that finished.

| Reporting question | Suitable row meaning | Example result |
|---|---|---|
| Jobs accepted on Monday | One accepted receipt event | Five arrivals |
| Jobs open at Monday close | One open job at that observation | Nine open jobs |
| Completion time for Monday's finished jobs | One repair attempt with defined milestones | Four completed journeys to analyse |

Adding the nine closing jobs to the five arrivals gives fourteen, but fourteen has no useful meaning as a count of distinct jobs handled that day. Some arrivals remain among the nine open jobs. The two numbers describe different views, not non-overlapping groups.

Likewise, four completion rows do not describe the experience of every job in the workshop. The nine still-open jobs have not reached the selected endpoint. A turnaround report should state that population rather than presenting completed-job duration as a full picture of waiting work.

## Reconcile populations with a movement equation

For a clearly defined open-work population, the starting count plus entries minus exits should explain the ending count. More complicated workflows require additional terms. Transfers in, transfers out, cancellations and reopenings must be assigned to the appropriate side of the equation.

Write the equation before building the dashboard. It forces people to decide whether a completed-but-undispatched job is still open, whether a suspended job remains in backlog and whether an internal workshop transfer changes the organisation-wide population. Different management views may legitimately use different definitions.

Reconcile at a useful level of detail. Matching the overall count can conceal offsetting errors between workshops or statuses. Compare the job identities that entered and left, not just their totals. A duplicated entry and a missing entry can cancel numerically while still making the report wrong.

Expect exceptions to be investigated rather than automatically adjusted away. A residual of one job may reveal a late event, an incomplete observation or a previously undocumented business transition. Treat the residual as evidence about the model instead of inserting an unexplained balancing row.

## Distinguish event time from arrival time

A repair completed late on Monday may be recorded in the reporting database on Tuesday. Its business event time and its data arrival time describe different facts. Using whichever timestamp is easiest can make Monday's flow disagree with Monday's snapshot.

Decide how reports handle late information. A business may restate recent periods, freeze issued reports after a cutoff, or retain both the latest interpretation and the version originally reported. Each choice has operational consequences. The loading process should not make this policy accidentally through its file schedule.

Retain enough provenance to explain late adjustments. The source record identity, business timestamp and ingestion timestamp can help trace why a figure changed. More fields are not automatically better; choose information that supports reconciliation and the agreed correction process.

The existing article on [keeping history in business data](/insights/keeping-history-in-business-data/) explains why the time a fact applies and the time it was recorded can differ. Reporting rows should preserve that distinction where it affects decisions.

## Represent reopening and repeated attempts deliberately

Suppose a repaired item fails its final test and returns to assembly. If the workflow summary overwrites its first completion date with the later completion, it changes the meaning of the original duration. If it keeps only the first completion, it may imply the job finished earlier than it actually did.

One approach models distinct repair attempts within the overall job. Each attempt has its own identity and milestones, while the job remains the customer-facing record. Another approach keeps detailed transition events and derives a specific first or final milestone according to the report's definition.

The right choice depends on the questions being asked. Measuring repeated attempts, customer elapsed time and active workshop effort are different objectives. A single duration column cannot answer all of them without qualification. Name measures so that the population and endpoints are understandable.

Do not assume reopening is rare enough to ignore. Even an infrequent case can have a large effect on long-duration reports or disputed service records. Include one reopened job in the design fixture and trace what each fact table should contain before approving the model.

## Keep event detail and reporting summaries connected

Several fact tables can describe the same process without being joined directly row by row. Joining each job's many events to each of its many daily observations can multiply rows. The connection through a common job identity does not make their grains compatible.

Aggregate each view to the level required by the comparison, then combine the results using keys whose meaning is explicit. For example, compare daily arrival totals with daily closing backlog totals for each workshop. Keep the underlying detail available for investigation rather than forcing every record into one flattened report table.

Use consistent definitions for shared classifications. If a workshop code or service category changes, decide whether each report uses the classification at the event time or the current classification. Two individually correct tables can still disagree if one restates history and the other preserves it.

Document reconciliation routes alongside the model. An analyst should know which source event supports a milestone and which completed observation supports a backlog figure. This makes the reporting database explainable when somebody asks why a number differs from the operational screen.

## Load each representation according to its meaning

An event loader should identify previously accepted source events so repeated delivery does not inflate activity. A snapshot loader should establish whether the intended observation is complete before presenting it as final. A milestone loader should apply updates to the correct process instance and handle out-of-order information.

These are different acceptance rules. Reusing one generic “insert unless present” routine may work for an append-only event but fail for a workflow row that must acquire later milestones. Conversely, replacing an entire daily snapshot without a version policy can alter a previously issued report silently.

Record loading status separately from business status. A job can be complete while its reporting data is incomplete. Conflating these concepts makes operational staff appear responsible for delays caused by a failed data feed. Dashboards should expose relevant data freshness rather than implying that every displayed state is current.

For a small system, this can be simple: a completed-load marker, a documented observation time and an exception list. The design does not need a large platform to make its completeness assumptions visible.

## Test absence, zero and partial progress

Use a fixture containing a day with no arrivals, a job open across several observations, a same-day arrival and completion, a cancellation, a transfer and a reopening. These cases reveal whether the design distinguishes no activity from missing data.

For workflow measures, include a job that has reached assessment but not approval, and another approved job that has not finished. Null milestone values should have a defined meaning. Replacing them with the current time or a convenient default can turn unfinished work into misleading duration figures.

Check the movement equation against the fixture and compare the identities behind any discrepancy. Test late arrival of an event and rerunning the same input. A loader that produces a different count each time the same file is processed has not established a reliable event identity.

Also review the report labels with someone who makes the operational decision. “Jobs processed” is often too vague. “Jobs accepted during the shift” and “jobs open at shift close” tell the reader what the number actually represents.

## Choose only the views the business needs

A small workshop does not need three reporting tables simply because three patterns exist. Start with the decisions that are currently difficult: controlling backlog, understanding incoming demand or finding delays between approval and completion. Select the representation that directly supports the question.

Add complementary views when they provide a distinct benefit and can be reconciled. The cost includes not only storage but also definitions, loading logic, exception handling and staff understanding. A compact model with explicit meanings is more useful than a larger model whose tables all claim to represent “the jobs”.

Events describe occurrences, observations describe state, and workflow summaries describe selected progress through a process. Preserving those distinctions allows a reporting system to explain why arrivals, completions, backlog and turnaround can all be valid while referring to different populations.

---

*Source basis: original KEVOS® editorial analysis drawing on fact-table and dimensional-design discussions in the supplied Designing Effective Database Systems (2005), with the linked Kimball Group reference used to verify the three table-type definitions. The repair workflow, reconciliation and examples are hypothetical.*
