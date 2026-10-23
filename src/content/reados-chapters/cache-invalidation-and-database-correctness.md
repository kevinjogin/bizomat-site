---
title: "Cache invalidation and database correctness"
description: "Design database caches around acceptable staleness, update races, missing records and failure recovery, with practical ways to test their correctness."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A cache can make a business application feel much faster by avoiding repeated database work. It can also make the application confidently display information that is no longer true. The engineering problem is deciding which differences are acceptable, how long they can last and what happens when an update takes an unexpected path.

A **cache** stores a reusable representation of information that can be obtained elsewhere. In the design considered here, the database remains the authoritative record and the cache is a disposable copy. That distinction allows the cache to improve performance without silently becoming a second, poorly controlled system of record.

Correctness depends on the complete lifecycle: the first read, repeated reads, updates, deletions, expiry and recovery. A cache that behaves properly during ordinary use can still return stale information after two individually reasonable operations occur in an unfortunate order.

## Define the promise before the mechanism

Begin with the decision a user makes from the cached information. A product description, an estimated workload and permission to release a payment have different consequences when stale. Giving them one universal expiry period hides those differences.

An **acceptable staleness interval** states how far information may lag behind the authoritative source for a particular use. Sometimes the rule is time-based. Sometimes it is conditional: a summary can be approximate while a final confirmation must recheck the database.

This is an illustrative example. A planning screen may display capacity totals refreshed every minute, provided the screen shows when the information was assembled. Allocating the final available machine slot then requires a transaction against authoritative booking data. The cached planning view informs the user without becoming the concurrency control for booking.

Make the promise testable. “Usually current” gives little guidance during an incident. “The planning display may lag, but confirmation checks availability within the booking transaction” identifies separate responsibilities that can be verified.

Also decide what happens when freshness cannot be established. Some screens can show an older value with its age. Others should fail or require an authoritative lookup. The decision belongs to the meaning of the operation, rather than to whichever cache behaviour is easiest to implement.

## Choose exactly what the cache represents

An individual database row, a joined business object and an aggregate report have different dependencies. A cached customer name may depend on one row. A cached outstanding balance may depend on invoices, adjustments, receipts and the rules used to classify each item.

Write down those dependencies before designing invalidation. Every change that can alter the cached answer needs a path to refresh, invalidate or eventually expire it. If the dependency list is unclear, the freshness promise will be difficult to uphold.

The cache key must identify the complete meaning of the answer. An identifier alone may be insufficient if the result varies with currency, language, tenant, permissions, effective date or calculation version. Two requests may ask about the same entity but legitimately require different representations.

Avoid embedding sensitive information in keys that appear in logs or monitoring tools. Keys also need an unambiguous encoding. Concatenating variable strings without clear boundaries can produce accidental collisions between different requests.

Treat calculation changes as changes to cached meaning. If a release changes how an amount is calculated, old cached results may remain syntactically valid while representing the previous rule. A versioned namespace or controlled invalidation can distinguish those generations.

## Understand the first-read path

A common approach checks the cache, reads the database when no usable entry exists and then stores the result. This is often called **cache-aside**. It is straightforward to understand, but the sequence is not automatically atomic with concurrent database changes.

A cache miss should mean that the application needs to obtain the value. It should not be confused with an authoritative answer that the requested record does not exist. Those are different states and can lead to different behaviour.

Demand-based population avoids loading unused information, but initial requests pay the database cost. A newly started application or emptied cache can therefore behave very differently from a warmed system. Performance testing should include both conditions.

Consider the size of each cached value as well as the number of keys. A few large reports can consume more memory than thousands of small lookups. Fetching more data than callers need also increases database work and serialisation cost before any reuse benefit appears.

Caching is most useful where reuse offsets those costs. Information read once and then discarded may gain little from a general-purpose cache. Record the expected repeated access and measure whether it actually occurs.

## Expiry and eviction solve different problems

**Expiry** makes an entry unusable after a defined condition, often an elapsed interval. **Eviction** removes entries to manage resources, such as memory. A least-recently-used policy can keep memory bounded without ensuring that a frequently accessed value is fresh.

An inactivity timeout presents a related trap. If each read extends the lifetime, a popular entry may survive for a long time after the underlying data changes. That can be appropriate for resource management, but it is not a maximum age guarantee.

A fixed lifetime gives a more understandable limit on how long a stored entry remains eligible for use. Even then, the limit begins at a defined point: insertion time, source observation time or some other event. A slow refresh can insert information that was already old before the cache accepted it.

This is an illustrative example. A report begins reading a source snapshot at 09:00, finishes at 09:08 and receives a ten-minute lifetime at insertion. It can remain available until 09:18 while representing a 09:00 view. Calling it “at most ten minutes old” would be misleading if age means the underlying snapshot time.

```figure
type: timeline
title: How old can a ten-minute cache entry be?
caption: Lifetime counts from insertion, but the data dates from when the read began.
- 09:00 | Report starts reading | the data's real time
- 09:08 | Result cached | ten-minute lifetime begins
- *09:18 | Entry expires | showing 09:00 data, 18 minutes old
```

Store the observation or source watermark when age matters. Distinguish when a value was calculated, when it entered the cache and which source state it represents. These timestamps answer different operational questions.

## Examine the update race explicitly

One common strategy updates the database and then removes the corresponding cache entry. A subsequent read fetches the new value. This handles many ordinary cases, but concurrent reads can produce a race.

This is an illustrative example. A reader misses the cache and reads database version 7. Before it stores that result, a writer commits version 8 and invalidates the key. The delayed reader then inserts version 7. The cache contains an old value even though the writer performed its intended invalidation.

```figure
type: timeline
title: A stale value outliving its invalidation
caption: The writer invalidated correctly; the delayed reader still restored the old version.
- 1 | Reader misses the cache | reads version 7
- 2 | Writer commits version 8 | invalidates the key
- *3 | Reader stores version 7 | stale until it expires
```

Reversing the order to invalidate before the database update creates another window: a reader can refill the cache from the old database state before the update commits. The operations need a deliberate coordination strategy if that window violates the required promise.

Possible designs include comparing source versions, preventing older refreshes from replacing newer entries, coordinating updates for a key, or accepting a bounded stale period with authoritative checks at critical points. Each approach has costs and implementation assumptions.

Do not present a delayed second deletion or a short expiry as universal proof of correctness. Timing-based measures can reduce exposure, but their limits depend on delays, failures and concurrent work. Test the actual invariant the application requires.

## Account for every writer

An application may invalidate its own cache correctly while another writer bypasses the mechanism. Administrative tools, import jobs, scheduled processes and separate applications can all modify the authoritative data.

Map those write paths. If updates originate from several places, application-local notification may be insufficient. A change feed or a shared update service can provide broader visibility, but it introduces its own delivery and recovery requirements.

Notifications can be delayed, duplicated or processed out of order. A consumer should distinguish a harmless repeat from a new change. If events carry source versions, the consumer can avoid replacing a newer cached value with an older one, provided version ordering is meaningful for that entity.

Deletion requires equal care. A delete event followed by a delayed update event must not resurrect a record that should remain absent. A deletion marker or version-aware state can preserve the ordering information needed to reject that update.

If notifications are lost, the system needs a way to recover. That might involve replay from a durable position, periodic reconciliation or expiry that limits the effect of missed events. Document how long inconsistency can persist when the notification path fails.

## Handle missing records as real cached answers

A **negative cache entry** records an authoritative result that a requested item was absent. It can prevent repeated expensive lookups for the same nonexistent identifier. It also creates an additional invalidation responsibility when that item is later created.

This is an illustrative example. A catalogue service repeatedly receives requests for an item that has not yet been imported. Caching “not found” reduces unnecessary reads. Once the import creates the item, the negative entry must be removed or expire before the item becomes visible through that path.

The negative-entry lifetime may therefore differ from the lifetime for an established item description. A short absence lifetime can suit a workflow where new records appear frequently, while a more deliberate event-driven policy may be warranted for predictable imports.

Keep absence distinct from an error. A database timeout does not prove that a record does not exist. Caching a temporary connectivity failure as “not found” converts an infrastructure problem into misleading business information.

Similarly, lack of permission is not always equivalent to absence for internal application logic. The public response may intentionally avoid revealing existence, but the caching design must still preserve access boundaries and avoid sharing one user's authorised result with another.

## Prevent many misses from becoming one large surge

When a popular entry expires, many requests may miss together and independently execute the same database query. This **cache stampede** can overload the source precisely when the cache is least able to help.

One approach allows a single refresh for a key while other requests wait for its result. Another serves an eligible older value during a background refresh. Either design needs a policy for refresh failure and a limit on waiting or staleness.

A refresh owner can fail while others are waiting. If coordination uses a lease or lock, its lifetime and release behaviour need careful design. A lease expiring too early can permit duplicate refreshes; a lease that never expires can prevent recovery.

Spreading expiry times can reduce simultaneous refresh across many keys. It does not by itself prevent a stampede on one exceptionally popular key. Match the measure to the observed demand pattern.

Test a completely cold cache and a cache service outage. Falling back to the database for every request may overwhelm it. Controlled concurrency, selective bypass and explicit overload responses can be necessary to keep the authoritative system usable during cache failure.

## Keep security decisions within their own rules

Caching data does not remove the need to authorise access. A shared cache containing customer-specific or tenant-specific information must enforce the same boundaries as the source access path.

Permission changes create particularly sensitive staleness questions. If access is revoked, an older permission result or previously cached response may continue to grant visibility unless the design addresses revocation. A general display-data expiry policy may be unsuitable for this purpose.

Separate the permission to retrieve a cached object from the fact that the object exists in memory. Do not assume that a cache hit is evidence of current authorisation. Review whether access is checked before retrieval, after retrieval or through a correctly partitioned representation.

Operational tools also need appropriate access controls. Cache inspection can expose information that was carefully protected in the database. Treat exports, debug logs and administrative interfaces as additional access paths when reviewing the design.

## Measure correctness alongside hit rate

The **hit rate** describes how often a requested usable entry is found. It is useful for assessing reuse, but a high hit rate can coexist with stale or incorrectly shared information. Performance statistics alone cannot validate the freshness promise.

Measure source age, refresh failures, invalidation lag, rejected old versions and the rate of authoritative rechecks where those concepts apply. Relate cache behaviour to business outcomes such as failed confirmations or discrepancies between displayed and committed values.

Sampling can compare selected cache entries against authoritative data, but interpret differences against the agreed rules. A permitted brief lag is different from an unexplained value that survives beyond its maximum age. Record enough context to distinguish them.

Test specific interleavings deliberately. Pause a reader after its database lookup, perform an update and invalidation, then let the reader continue. Deliver duplicate and out-of-order change events. Create a record after a negative lookup. Restart the cache during peak demand.

These scenarios expose behaviour that ordinary sequential tests rarely exercise. Keep the tests focused on observable promises: old data cannot replace a newer version, revoked access is handled as specified, and failed refreshes do not silently become authoritative absence.

## Make disposal and reconstruction routine

A cache that cannot be emptied without losing essential information has become more than a disposable optimisation. That may be an intentional architecture, but it needs the durability and recovery design appropriate to a system of record.

For a conventional database cache, prove that reconstruction works within acceptable limits. Identify which information should be warmed first, which can be loaded on demand and how source load is constrained during recovery.

Record the dependency map, freshness promise, update paths and failure behaviour with the application design. Those details are often more valuable than the cache library's default settings when a future change introduces a new writer or a new use for the data.

The strongest design is the simplest one that meets the real correctness and performance requirements. Where a direct, efficient database lookup is already adequate, another consistency mechanism may add little value. Where caching is justified, make its temporary nature and its promises explicit enough to test.

*Source basis: the Demand Cache, Cache Collector, Cache Replicator and Cache Statistics patterns in the supplied book Data Access Patterns (2003). The scenarios and decision framework are original synthesis; they describe general design concerns rather than guarantees from a particular cache product.*
