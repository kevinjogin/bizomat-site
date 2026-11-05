---
title: "Paging database results without skips or duplicates"
description: "Choose a pagination strategy with explicit ordering, continuation and consistency rules, and test how inserts, deletes and changing sort values affect traversal."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

Displaying a large result set a page at a time seems like an interface decision. It is also a data-consistency decision. While someone reads the first page, new records may arrive, existing records may disappear and values used for sorting may change. The next request needs a precise definition of where to continue.

A paging strategy must balance predictable traversal, database work and the experience users expect. Browsing current search results has different needs from exporting every record exactly once from a defined population.

The design begins with an ordering and a consistency promise. Page size and button labels come later. Without those foundations, a fast query can still skip records, repeat them or give the user an inaccurate impression of completeness.

## Define the result population and its order

Consider a maintenance application listing open work orders. This is an illustrative example. The interface sorts by creation time and displays 25 records per page. Several work orders can share the same creation timestamp, especially when imported together.

Sorting only by creation time does not uniquely order those tied rows. The database may return them in different relative orders between requests. A row near the page boundary can therefore move between pages even when the underlying records have not changed.

Add a stable tie-breaker, such as the unique work-order identifier, to define a complete order. The order used by the query, continuation condition and interface must agree. If creation time is descending and the identifier is ascending, the continuation logic must respect that mixed direction.

The population definition also needs to remain explicit. Open work orders at one site differ from all work orders or those assigned to one technician. A continuation token from one filter should not be silently reused after the user changes that filter.

PostgreSQL's LIMIT and OFFSET documentation emphasises the need for a unique ordering when selecting portions of a result. The general lesson is that a row's position is meaningful only relative to a fully specified query and order.

## Offset pagination refers to a position in the current result

Offset pagination asks the database to skip a specified number of rows and return the next group. Page one might skip none, page two skip 25 and page three skip 50. This matches the familiar idea of numbered pages.

The position is evaluated against the result visible to that query. It is not a durable identity for the rows the user has already seen. If the population changes between requests, the same offset can refer to a different boundary.

Suppose the first page contains records numbered 1 through 25 in the selected order. Before page two is requested, a new record is inserted before them. Skipping 25 rows now starts with a record the user already saw. Deleting a record before the boundary can create the opposite problem and skip an unseen record.

```figure
type: svg
title: Why offset paging repeats a record
alt: Page one shows records 1 to 25. A new record is then inserted before them, shifting every record down by one. Skipping 25 rows for page two now starts at the old record 25, which the user has already seen.
caption: Skipping 25 rows refers to a position in the current result, which moves when rows are inserted.
viewbox: 0 0 640 200
body:
<text class="txb" x="20" y="28">Page 1 as seen</text>
<rect class="bx" x="20" y="40" width="250" height="34" rx="5"/>
<text class="tx" x="145" y="62" text-anchor="middle">records 1 – 25</text>
<text class="txb" x="20" y="112">After one insert, skip 25</text>
<rect class="bxa pulse" x="20" y="124" width="40" height="34" rx="5"/>
<text class="txb" x="40" y="146" text-anchor="middle">new</text>
<rect class="bx" x="64" y="124" width="250" height="34" rx="5"/>
<text class="tx" x="189" y="146" text-anchor="middle">old 1 – 24</text>
<rect class="bx dsh" x="318" y="124" width="50" height="34" rx="5"/>
<text class="tx txs" x="343" y="146" text-anchor="middle">old 25</text>
<path class="la flow" d="M343 180V162"/>
<text class="tx txs" x="380" y="186">page 2 starts here: seen already</text>
```

This behaviour may be acceptable for casual browsing of a live list, provided the application does not promise a complete, stable traversal. It is problematic for a process that must visit every eligible record once without omissions.

Offset also has a performance dimension. PostgreSQL documents that skipped rows still need to be computed within the server. Large offsets can therefore require substantial work even when the returned page is small. Measure the intended deep-page workload rather than extrapolating from the first page.

## Keyset pagination continues from the last ordering key

Keyset pagination records the ordering values of the last row returned and asks for rows after that boundary. For an ascending creation time and identifier, the next page contains rows with a later creation time, or the same time and a larger identifier.

This makes the boundary depend on values rather than the count of rows before it. Inserting or deleting unrelated earlier rows does not shift the boundary merely by changing their number. An appropriate index can also help the database begin near the requested position.

The full ordering key must be preserved. Saving only the timestamp loses the tie-breaker and can omit remaining rows sharing that timestamp. Saving only the identifier is also insufficient when timestamp order and identifier order are not equivalent.

The comparison must handle nulls deliberately. If the order places missing timestamps last, the continuation condition needs to reproduce that rule rather than rely on ordinary comparisons with null. Text ordering similarly depends on the database's collation and comparison semantics.

Keyset pagination is particularly natural for next-page traversal. Arbitrary jumps to page 300 are less direct because the boundary values for that page are not known automatically. The interface and navigation requirements should reflect the chosen strategy instead of pretending every strategy provides the same capabilities.

```figure
type: compare
title: Offset or keyset paging
cols: Offset | Keyset
caption: Order by a unique key, such as creation time plus identifier, so ties cannot split unpredictably.
- How it continues | Skip a number of rows | Continue after the last key seen
- Inserts and deletes | Can skip or repeat records | Boundary stays stable
- Jump to page 300 | Direct | Less direct
- *Best for | Numbered pages on stable data | Next-page traversal and exports
```

## A stable boundary does not create a snapshot

Keyset pagination improves continuity, but it does not freeze the result population. New rows can appear after the boundary, and existing rows can leave the filter while the user is browsing. The traversal still reflects a changing database unless the design provides a stable snapshot or equivalent population definition.

Changing sort values is especially important. A work order already displayed can move after the current boundary and appear again. An unseen work order can move before it and never appear in the remaining traversal.

An immutable ordering key avoids that particular movement, but it does not solve every consistency question. A row may be deleted or become inaccessible before it is fetched. A late-arriving row can have an earlier business timestamp than the current boundary.

Define the promise in practical terms. A live list may show the latest available state and allow users to refresh. A complete export may need the records that satisfied a particular query at a defined point. A background job may need a durable work queue rather than repeated browsing queries.

Do not advertise exactly-once processing merely because the interface uses cursor-like tokens. A continuation mechanism identifies where to look next; an exactly-once business effect requires additional rules about population, processing state, retries and side effects.

## Choose an explicit strategy for complete exports

An export needs a defined scope. It might represent all rows visible within one database snapshot, a captured list of record identities or a bounded append-only sequence. Each approach has different resource and correctness implications.

A database cursor within an appropriate transaction can support traversal under the database's documented visibility rules. Keeping that transaction open for a long export may consume connections and other resources. The operational cost depends on the engine, isolation level and cursor behaviour.

Capturing identifiers can separate population selection from later retrieval. However, fetching current values later does not reproduce the original snapshot automatically. Records can change or disappear between selection and retrieval. The export must state whether it preserves only membership or both membership and values.

A high-water mark can bound an append-oriented dataset, but its meaning needs scrutiny. An identifier generated before a transaction commits does not necessarily provide commit order. A late commit with an earlier identifier can be missed by a naive boundary strategy.

Select the method according to the required guarantee and verify it against the actual database behaviour. A small page size reduces memory use; it does not, by itself, make a multi-request export consistent.

## Treat continuation tokens as a contract

A continuation token can carry the last ordering values, the chosen query version and enough context to reject incompatible reuse. It should be interpreted as an application contract rather than an incidental encoding of one database expression.

Bind it to the relevant filters and ordering. If a user changes the selected site or switches from oldest-first to newest-first, begin a new traversal or explicitly translate the request through a supported mechanism. Reusing the old boundary can otherwise produce an unexplained partial result.

Do not treat possession of a token as authorisation to see records. Every request must still apply the current access policy. A token issued under broader permissions should not preserve access after those permissions change.

If clients must not alter token contents, use an appropriate integrity mechanism and validate the decoded structure. Encoding values in an opaque-looking string does not itself prevent modification. Avoid exposing sensitive values unnecessarily through tokens that may appear in logs or shared links.

Version the contract when ordering or filtering semantics change. A token created by an older application version may no longer identify a meaningful boundary. Returning a clear restart instruction is safer than silently interpreting it under a different query definition.

## Page the entity users recognise

Joins can make page size ambiguous. If each work order joins to several task lines, limiting the joined rows to 25 may return only a few distinct work orders, with one work order split across pages.

Decide whether the page unit is a work order, a task line or a flattened report row. The query must preserve that choice. For an entity-oriented screen, it may be appropriate to select a page of work-order identities first and then retrieve the related details for those identities.

That two-stage approach still needs a consistency policy. A work order can change between the identity query and the detail query. Depending on the application, an appropriate transaction or an explicitly accepted live-view behaviour may be required.

Avoid applying duplicate removal after an arbitrary row limit and assuming the result is a complete entity page. The database may have selected only part of the joined population needed to establish the intended set of entities.

Test entities with many children, no children and tied ordering values. These cases reveal whether the paging boundary belongs to the intended entity or to an accidental intermediate query result. The interface should not need to conceal a structural mismatch by displaying inconsistent page lengths without explanation.

## Distinguish page size from transport and fetch size

The number of items shown to a user is not necessarily the number of rows a database driver fetches in one network operation. Drivers can buffer data, and a database cursor can expose rows through an interface that does not reveal each underlying transfer.

Treat user page size, query limit and driver fetch size as related but separate settings. A page of 25 work orders may require more than 25 database rows if related data is included. A background export may fetch larger batches while writing a streaming output.

```figure
type: layers
title: Three sizes that are easy to confuse
caption: A page of 25 work orders may need more than 25 database rows once task lines are included.
- *User page size | the entities people recognise
- Query limit | rows the database returns
- Driver fetch size | rows moved per round trip
```

Measure memory, transferred data, round trips and response time together. Fetching everything eagerly can waste resources when users rarely go beyond the first page. Fetching extremely small batches can add avoidable communication overhead.

Close resources when traversal ends early. Users abandon searches, cancel exports and close browser tabs. A server-side cursor or retained transaction should not remain open indefinitely because the last page was never requested.

Define timeout and restart behaviour. If an export cursor expires, the application needs to know whether it can resume from a durable position or must restart from a newly defined population. A timeout should not lead to an apparently complete file that silently omits the remaining rows.

## Counts and navigation need their own promises

An exact total count can be expensive and can become stale while the user browses. The interface should not demand it automatically if a simple next-page indication meets the user's need.

One approach fetches one extra item beyond the displayed page size to determine whether another item exists at that moment. The extra item should not be discarded from the continuation logic incorrectly: the next boundary normally remains the last displayed item, so the additional candidate can be returned on the next request.

If an exact count is displayed, identify its scope and timing. A count from one query and a page from another may observe different committed states. The application should not imply that the page sequence and count form one immutable snapshot unless they actually do.

Previous-page navigation requires careful ordering too. A reverse keyset query may fetch items before the current boundary in reverse order, then arrange them for display. Test the boundary conditions rather than assuming the forward predicate can simply be reused.

Make refresh behaviour clear. In a live list, users may prefer an explicit indication that new items are available instead of having the visible page reorder while they act on it. Interface stability and database freshness are related design choices that should be made deliberately.

## Test traversal under change

Create a controlled dataset with tied timestamps, unusual text values, missing sort values and entities with multiple children. Traverse it using a small page size so that boundary conditions occur frequently. Compare the returned identities with the expected population.

Then introduce changes between pages. Insert before and after the boundary, delete an earlier row, change an unseen row's sort value and revoke access to a record. Check the result against the documented live-view or snapshot promise.

For exports and background processing, interrupt after fetching a page but before recording completion. Retry and inspect both the output and any business side effects. A duplicated page should not silently become duplicated work where the process promises one logical effect.

Measure deep traversal with realistic volumes. Inspect the execution plan and resource use at early, middle and late positions. A design that performs well on the first page may degrade as offsets grow or as the remaining population becomes less selective.

Pagination is reliable when its ordering, population and continuation rules are explicit and tested together. The next button is only the visible part of that contract.

## Source basis and further reading

The Paging Iterator pattern in the source collection's *Data Access Patterns* discusses bounded fetching, resource ownership and the trade-off between eager loading and frequent database interaction. This article develops original work-order examples and extends the discussion to changing result populations and continuation contracts.

PostgreSQL's [LIMIT and OFFSET documentation](https://www.postgresql.org/docs/current/queries-limit.html) explains ordering requirements and the work associated with skipped rows. Cursor visibility, transaction costs and comparison syntax should be verified for the particular database and driver used.
