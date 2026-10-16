---
title: "Identity maps and conflicting copies of database records"
description: "How applications keep one coherent object for each database record, manage its lifetime and avoid conflicting edits, stale values and accidental cross-customer reuse."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - design
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A dispatch screen loads a customer through an order, then loads the same customer again through an account search. Both copies came from the same database row. One component changes the delivery instructions while another changes the contact number. The screen appears to work, yet saving its objects can restore an old value or leave different parts of the application disagreeing about the customer.

This problem can occur inside a single request, without a second user or another database connection. Database identity and object identity are different things: a row has a key, while each newly constructed object occupies its own place in application memory. Repeatedly loading a row does not automatically give every caller the same object.

An identity map provides a controlled place to find the object already representing a record. Understanding its boundaries helps developers design coherent editing operations and helps people commissioning software ask useful questions about intermittent, difficult-to-reproduce data errors.

## Distinguish a record from its representations

A database key identifies a record within an agreed context. An application object is a particular representation of that record, loaded at a particular time with a particular set of attributes. A printed report, a search result and an editable customer object may all refer to the same customer while deliberately containing different information.

There is no general rule that all representations must be one object. An immutable report row can safely stand apart from an editable entity. The difficulty arises when several mutable objects each claim to be the authoritative working copy during one operation. Changes then accumulate in separate places, and saving requires a reconciliation policy that may never have been designed.

It is useful to distinguish equality from identity. Two objects can contain equal values without being the same object. Conversely, one object can change its values while remaining the same working representation of a record. Testing only whether customer numbers match will not reveal whether two application components share changes.

## Give the map a specific responsibility

An **identity map** associates a record identity with the object representing it within a defined scope. A loader checks the map, returns an existing object when appropriate, and registers newly constructed objects. Martin Fowler's [Identity Map description](https://martinfowler.com/eaaCatalog/identityMap.html) explains the core concern: loading the same record into multiple mutable objects complicates consistent updates.

That responsibility is narrower than storing every useful query result. A map can know customer 417 without knowing whether that customer belongs in a search for overdue accounts. The search may still need to run against the database. As rows arrive, the application can resolve their identities to objects already present in the map.

Nor does the map decide whether a value is current enough for a business decision. It can consistently return an object whose information is old. Identity answers which representation is being used; freshness answers when that representation must be refreshed. Keeping these questions separate makes both the implementation and the failure reports easier to understand.

## Build the identity from the whole context

A bare number is often an incomplete map key. Customer 417 and supplier 417 may belong to different entity types. Customer 417 in one tenant may have no relationship to customer 417 in another. A database shard, organisation or source-system identifier can be part of the identity even when a screen hides it.

Write down the identity components before selecting a dictionary or library API. A possible key is the tuple of entity type, organisation identifier and primary key. The exact form depends on the data model. The important property is that two genuinely different records cannot accidentally occupy the same entry.

Also distinguish record keys from lookup attributes. Names, email addresses and product descriptions can change or be shared. Searching by an email address may locate a customer, but that does not make the address a suitable permanent identity-map key. Resolve the search result to the record's stable identity before registering its mutable representation.

New records require a policy too. Before a database-generated key exists, the application can track a temporary identity or retain the new object directly in its pending-change set. After insertion, it must associate the assigned database identity with the same object. Accidentally creating another object during this transition recreates the original problem.

## Follow one record through a worked example

This is an illustrative example. A service application stores a customer with account number 417, delivery instructions of “Reception” and a contact number ending in 1200. An order component and an account component load this record independently. Each receives a different mutable object with those same initial values.

The order component changes the delivery instructions to “Goods entrance”. The account component changes the contact number to one ending in 3400. If both components save every field from their own object, the later save can reverse the earlier change. The outcome depends on save order, even though the user changed different fields.

| Working representation | Delivery instructions | Contact number |
|---|---|---|
| Original database row | Reception | Ends in 1200 |
| Order component's separate object | Goods entrance | Ends in 1200 |
| Account component's separate object | Reception | Ends in 3400 |
| Intended final record | Goods entrance | Ends in 3400 |

With an appropriately scoped identity map, both components receive the same customer object. The two edits then accumulate on that object. This removes the disagreement between local copies. It does not decide whether each change is authorised, validate the new contact number or protect against another session editing the database row.

An implementation that saves only changed columns might avoid this particular lost update without an identity map. However, its local components can still disagree while calculating prices, validating an order or displaying a confirmation. The broader design objective is coherent local state, not merely a successful final SQL statement.

## Choose a lifetime that matches the work

The map needs an owner and an end. For many applications, an individual request or explicitly bounded application operation is a useful scope. The components involved in that operation share a persistence context, and the context is discarded when the operation finishes. The appropriate boundary should be documented rather than inferred from whatever object happens to be globally accessible.

A browser session is usually a poor default lifetime for a mutable map. People can leave tabs open, switch organisations or return after another user has changed records. Retaining every loaded object for that whole period increases memory use and makes the freshness rules hard to explain. A long-running editing screen often needs an explicit draft model and version check instead.

Background jobs require the same discipline. A job that processes a large file might use one context per independent batch, provided those batches are valid transaction boundaries. Clearing tracking arbitrarily halfway through an indivisible operation can split one coherent graph into competing copies. Memory limits and business atomicity need to be considered together.

The database connection's lifetime is another separate boundary. A context may obtain and return connections as its framework permits, while still retaining object identity. Do not assume a pooled connection carries the application objects, or that returning a connection automatically disposes of all tracked state.

## Treat refresh as a potentially destructive operation

Suppose a local object contains an unsaved delivery instruction. A later query finds the same record in the database. Blindly copying every returned column over the existing object can erase the user's change. Avoiding duplicate objects is only half the design; the loader also needs a rule for combining incoming values with existing local state.

Possible policies include retaining already loaded values, refreshing only objects known to be clean, explicitly discarding local edits after confirmation, or raising a conflict. Different object-relational mapping libraries provide different operations for these cases. The application should choose deliberately and test the behaviour it relies on.

Partial loading makes the issue subtler. An object initially created from a short search result may have only its key and display name. A later detail query must distinguish an attribute that has never been loaded from one deliberately set to an empty value. Using a single null marker for both states can turn an innocent search into an unintended update.

The [SQLAlchemy session documentation](https://docs.sqlalchemy.org/en/20/orm/session_basics.html) provides one concrete implementation reference for identity management and explicit refresh behaviour. Its API details should be read for the installed version. A general design should not assume every persistence library makes the same automatic refresh choices.

## Keep concurrency protection at the database boundary

Two application requests normally have separate contexts. Each can contain one coherent object for customer 417 while still conflicting with the other request. An identity map does not create a lock across processes, and placing the map in shared memory does not turn it into a reliable distributed transaction coordinator.

For an editable record, a version value can help detect whether the database changed since the application loaded it. The update checks the expected version and fails if the assumption no longer holds. The application then needs a visible resolution path. Other operations may require stronger transactional checks around the business condition being protected.

There are therefore two different tests: all participating components within one operation should see the intended local representation, and competing operations should not silently overwrite each other's accepted work. Passing either test does not imply passing the other. The broader discussion of [keeping history in business data](/reados/collections/reporting-history-and-analytical-data/keeping-history-in-business-data/) also explains why a current working object is not an audit trail.

## Avoid sharing mutable contexts between concurrent tasks

A map that stores mutable objects also coordinates their changing state. If two tasks modify that state concurrently, the result depends on the framework's guarantees and the application's synchronisation. A thread-safe dictionary alone does not make the objects inside it safe or make a multi-step read-change-save sequence atomic.

A straightforward design gives each concurrent operation its own context and passes stable identifiers or immutable messages between operations. When work must be combined, an explicit owner performs the combination. This makes it possible to describe which operation is responsible for each pending change and when that change becomes persistent.

Be particularly careful when helper functions silently create their own contexts. A top-level operation may appear to share one customer object while a pricing helper loads a second copy through a private session. Dependency boundaries should make the context visible enough that developers can recognise this split during review.

## Protect organisation and permission boundaries

An identity map should never be used as evidence that a caller is allowed to access a record. Finding an object in memory proves only that somebody loaded it earlier. Permissions, organisation scope and the requested action still need to be checked through the application's access-control design.

Consider an operator who can work for two separately administered customer accounts. If account switching leaves an old map alive and the map key omits the account identifier, a later lookup can return the wrong customer's object. This is a serious design error even if no database query runs at that moment.

Permission changes during a long-lived operation also need an explicit policy. Some systems recheck authorisation before sensitive writes. Others define a short operation boundary within which a decision remains valid. The identity map should follow that policy rather than extending access accidentally through retained objects.

## Test behaviour across several loading paths

A meaningful test loads the same entity through two different paths that the real application uses. For example, load a customer through an order and then through a customer search. Verify the expected object identity, change an allowed field through one reference and check what the other reference observes.

Add a test in which the first load is partial, a test involving an unsaved local edit, and a test in which another transaction updates the row. Each test should state whether a second load preserves, refreshes or rejects local state. The intended answer depends on the operation; an unexplained answer is the defect.

Other useful cases include equal numeric keys belonging to different organisations, creation of a record with a generated key, disposal after an exception, and processing many independent records without unlimited memory growth. These cases exercise the map's boundaries instead of merely proving that a dictionary can return an inserted entry.

Observe query counts when relevant, but do not make zero repeat queries the sole success measure. A fresh database query may be necessary for a correct search or validation. The important combination is predictable object identity, valid business decisions and acceptable resource use.

## Apply the pattern to a small Australian business system

For a business commissioning an order, service or inventory application, this topic becomes practical when different screen sections show different values for the same record. Ask the developer to trace the record identity, loading paths and save sequence for one concrete example. That usually produces more useful evidence than a general request to “fix caching”.

Agree on what an editing operation includes. Changing a job's customer contact and delivery details may be one operation; leaving the screen open overnight is not necessarily part of that operation. Explain how the user will be told about a conflicting change and which edits can safely be retried.

For software maintainers, document context creation and disposal alongside transaction boundaries. Keep that explanation close to the application service that performs the work. A diagram of infrastructure components is less useful than a short statement identifying who owns the working objects and when they cease to be valid.

An identity map is most valuable when it makes ordinary operations easier to reason about. One well-defined working representation can prevent local contradictions, while explicit refresh, permission and concurrency policies handle the questions that object identity cannot answer.

---

*Source basis: original KEVOS® editorial explanation drawing on the Demand Cache, domain-object mapping and Transaction discussions in the supplied Data Access Patterns (2003), with the linked pattern catalogue and persistence documentation used for terminology and implementation checks. Examples are hypothetical.*
