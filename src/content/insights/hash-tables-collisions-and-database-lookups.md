---
title: "Hash tables, collisions and database lookups"
description: "Understand how hashing supports equality searches, why collisions and skew matter, and how to evaluate hash-based database work without misleading speed claims."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - experimentation
author: "KEVOS®"
featured: false
draft: false
---

Finding a record by an exact identifier sounds simple. A system receives a part number and needs the corresponding stock record. Searching every stored part would waste effort, so database engines and applications use structures that narrow the search. A hash table is one important way to do that.

Hashing transforms a key into a value used to locate a smaller region of a structure. The attraction is direct access to likely candidates. The complications begin when different keys share that region, when the distribution is uneven or when the workload needs an ordering that the hash does not preserve.

Understanding these mechanics helps explain more than one index type. Hashing also appears in joins, grouping, duplicate detection and application caches. The same broad idea supports different operations, but their correctness requirements and resource costs must be examined separately.

## A hash locates candidates rather than proving identity

Imagine a small parts catalogue using numbered storage buckets. This is an illustrative example. A deliberately simple teaching function assigns a numeric key to a bucket by taking its remainder after division by ten. Keys 17, 27 and 47 all reach bucket seven.

The shared bucket does not mean the three parts are identical. It means the lookup must inspect the entries in that bucket and compare their actual keys. This is a **collision**: distinct inputs lead to the same hash value or bucket location, depending on the stage being discussed.

A practical hash function mixes the input more effectively than this teaching example. Nevertheless, a finite hash space cannot uniquely represent an unlimited set of possible keys. Correctness must not depend on collisions being impossible.

Keep three concepts separate: the original key, its hash value and the bucket selected from that value. Multiple hash values may map to one bucket, and different original keys may share a hash value. An implementation can use either distinction to narrow candidates, but it still needs an appropriate equality check.

This is why replacing a business identifier with a short hash can be dangerous. The hash is useful as an access aid; it is not automatically a uniqueness guarantee. The system must preserve enough information to distinguish the records it promises to distinguish.

## Equality must agree with the hashing rule

For a hash-based lookup to work, keys considered equal must be assigned compatible hash values. If one part of the system ignores letter case while another hashes the original bytes, a lookup can search a different bucket from the one containing an equal key.

The problem extends beyond uppercase and lowercase. Spaces, accents, Unicode representations and numeric formatting can affect how an identifier is interpreted. A part code entered as text may include leading zeroes that are meaningful even though a numeric conversion would discard them.

Define the key's equality rule first. Decide whether `ab-17` and `AB-17` represent the same code, whether trailing spaces are significant and whether separators are part of the identifier. The hash implementation must honour that definition consistently during insertion, lookup, update and deletion.

Composite keys require an unambiguous representation. Simply concatenating two fields can make the pair `12` and `345` indistinguishable from `123` and `45`. A suitable encoding preserves field boundaries, types and missing-value distinctions before hashing.

Changing the equality or normalisation rule is therefore a data-model change, not just a performance adjustment. It can merge previously distinct keys or separate previously equal ones. Existing entries may need to be rebuilt or migrated, and the business consequences of changed identity should be reviewed explicitly.

## Collision handling determines the path through a bucket

One common design stores a collection of entries for each bucket. A lookup visits the selected bucket and examines candidates until it finds an equal key or establishes that none exists. The collection might use linked entries or another internal arrangement.

Another family of designs places entries directly in an array and searches alternative positions when a collision occurs. The insertion and lookup procedures must follow the same probing rules. Deletion needs care so that removing an entry does not break the search path to entries placed farther along it.

These approaches have different trade-offs involving memory layout, cache behaviour, allocation and deletion. A conceptual diagram with one arrow into a bucket hides those costs. The important operational question is how much work remains after the initial hash calculation.

In the teaching catalogue, finding key 47 might require comparing it with both 17 and 27 first. A missing key assigned to the same bucket may require examining every entry before the system can confidently report no match. Successful and unsuccessful lookups can therefore have different cost distributions.

Database implementations also have persistence, concurrency and crash-recovery responsibilities. Their pages, locks and maintenance rules make them more complex than a small in-memory example. Use the example to understand the principle, while evaluating the actual engine through its documented behaviour and measured workload.

## Average occupancy does not describe the worst bucket

A basic measure of a hash table is its **load factor**: the number of stored entries relative to the number of buckets or slots, interpreted according to the design. If 800 entries occupy 1,000 buckets in a chaining arrangement, the average is 0.8 entries per bucket.

That average says little about concentration. Some buckets may be empty while one contains many entries. Lookup cost depends on the bucket reached by a request, so a small number of crowded buckets can dominate performance for common keys.

Poor distribution may come from the hash function, the input pattern or many equal values. These causes need different responses. A better mixing function can improve distribution of distinct structured keys. It cannot make thousands of rows with exactly the same join key stop matching each other.

Measure bucket occupancy or the engine's relevant proxy where available. Also inspect the distribution of requests. A moderately crowded bucket receiving most traffic can matter more than a very crowded bucket that is rarely accessed.

This distinction explains why a benchmark using uniformly generated unique keys can be misleading for a business workload. Real data often contains repeated statuses, common customers, default values and uneven activity. The benchmark should reproduce the characteristics that determine candidate counts and contention.

## Growth shifts work into insertion and maintenance

A table that performs well at one size may need to expand as more entries arrive. Depending on the implementation, expansion can allocate a larger structure, redistribute entries or split selected buckets incrementally. That work consumes time and resources even if ordinary lookups remain quick.

The timing matters. A bulk import may encounter repeated expansion while serving interactive requests. A process that appeared inexpensive in a small test can show latency spikes when growth occurs under load. Capacity estimates should include the transition, not just the final structure size.

Deletion introduces another distinction between logical contents and allocated storage. Removing entries does not necessarily return all associated memory or disk space immediately. Some structures retain capacity for reuse, and some require a separate maintenance operation to change their physical footprint.

Plan measurements around the expected lifecycle: initial load, steady updates, rapid growth, heavy deletion and reuse. Observe both throughput and latency, together with memory, storage and background work. A single elapsed time for a clean initial build cannot describe all these phases.

Avoid transferring a resizing rule from one library or database to another. The implementation decides how growth is triggered and which operations pay for it. Treat those details as version-specific facts to verify, while retaining the general principle that maintaining the access structure has a cost.

## Equality access does not provide a useful sort order

Hashing deliberately maps keys into locations that need not preserve their natural order. Nearby dates or consecutive part numbers may land in unrelated buckets. That is useful for distribution but does not directly support walking through a sorted range.

An ordered tree can locate the beginning of a range and continue through ordered entries. A hash structure designed for equality access lacks that same relationship between key order and physical search path. Asking for every value between two dates is a different problem from asking for one exact date.

The distinction also affects output order. Retrieving records from a hash structure does not establish a business ordering. If a report requires part-number order, it must request or create that ordering through an appropriate operation. An order observed during one test is not a reliable contract.

Consider the whole workload before choosing an access structure. A field used for exact lookups today may also support prefix searches, range reports and ordered pagination. Supporting one operation exceptionally well can still be a poor overall choice if the other operations become expensive.

This is not a universal argument against hashing. It is a reminder to match the structure to the questions. Equality, ordering, range selection and uniqueness are separate capabilities, and a particular implementation may provide only some of them.

## Hash joins use the same idea for a different job

A hash join commonly builds a hash structure from one input and probes it using rows from another input. Equal join keys lead to candidate matches, which are then checked according to the join condition. The structure belongs to the query's execution rather than necessarily being a persistent index.

The build input needs enough storage for the relevant keys and associated row information. If that work exceeds available memory, an engine may partition or spill intermediate data to temporary storage. The resulting cost can differ substantially from an entirely in-memory execution.

Repeated keys are especially important. If one input contains 100 rows for a key and the other contains 200, an ordinary matching join can produce 20,000 row pairs for that key. A fast hash lookup cannot remove the work required to produce a legitimately large result.

Inspect both estimates and actual cardinalities when diagnosing such a plan. A memory setting may be relevant, but an unintended many-to-many relationship or missing predicate can be the more important issue. Speeding up access to the wrong result does not correct its meaning.

Also distinguish a hash join from a hash index. An engine can choose a hash join even when neither table has a persistent hash index. Conversely, an equality index lookup is not necessarily a join. The shared term describes a mechanism, while the surrounding operation determines its purpose.

## Grouping and duplicate detection still need exact semantics

Hashing can group rows by a key so that an aggregate is updated as matching rows arrive. It can also help determine whether a value has already appeared. Both operations depend on the same agreement between hashing and equality used in a simple lookup.

For grouping, the key may contain several fields and null values. The operation's grouping semantics must determine which rows belong together. An application should not substitute its own casual string conversion and assume it matches the database's treatment of types and missing values.

For duplicate detection, a hash match is evidence that further comparison may be needed. Whether storing only a digest is acceptable depends on the required assurance, the digest design and the consequences of treating distinct records as identical. A performance shortcut should not silently redefine what counts as a duplicate.

Memory use depends on the number of distinct groups as well as the number of input rows. A million rows in ten groups has a different state requirement from a million rows in nearly a million groups. Distinct-count estimates can therefore influence the suitability and cost of hash-based aggregation.

Where the workload permits it, reduce unnecessary columns carried through intermediate structures. But preserve the information required for correct equality checks and output. Resource savings are useful only when they retain the operation's intended meaning.

## Evaluate the implementation with representative evidence

For a concrete example, PostgreSQL's documented hash indexes support equality comparisons, are limited to one indexed column and do not enforce uniqueness. The documentation also describes overflow pages and the effects of uneven distributions. These are implementation properties to check rather than assumptions to generalise to every database.

Use a comparison that reflects the actual decision. Measure the relevant equality queries against an appropriate alternative, with realistic data volume and distributions. Include warm and cold conditions where meaningful, concurrent writes and the expected growth pattern.

Record tail latency as well as averages. Rare slow requests can be important when they hold connections or delay a batch deadline. Separate the time spent locating candidates from time spent fetching rows, checking additional conditions and returning results to the client.

Verify the result set before interpreting the speed measurement. Check missing keys, deliberate collisions, duplicate business keys, unusual text values and composite-key boundaries. Include deletion and reinsertion if those operations occur in production.

Keep unrelated meanings of hashing separate during the review. A hash used to distribute lookup keys is not automatically suitable for password storage, tamper detection or protecting confidential identifiers. Those tasks have different requirements and need mechanisms designed for them. Likewise, distributing records across servers by a hash introduces placement and movement questions beyond the local lookup structure discussed here. Naming the specific operation prevents an attractive property in one context from becoming an unjustified assurance in another.

Finally, retain the measurements and assumptions with the design decision. If the data distribution or query mix changes, the conclusion may need review. Hashing is a powerful tool because it narrows equality work efficiently under suitable conditions. Knowing those conditions is more useful than repeating an unconditional claim that lookup takes constant time.

## Source basis and further reading

The hashtable chapter in the source collection's *Data Structures Demystified* explains bucket selection, linked entries and comparison of original keys. This article develops those principles into original database examples without reusing the book's historical C++ and Java implementations.

For the specific persistent-index behaviour mentioned here, see PostgreSQL's [Hash Indexes documentation](https://www.postgresql.org/docs/current/hash-index.html). Query execution, memory management and collision handling remain dependent on the chosen database or library.
