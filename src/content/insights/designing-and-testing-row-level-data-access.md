---
title: "Designing and testing row-level data access"
description: "Turn business access rules into testable row-level policies, including trusted identity, write checks, role combinations, pooled sessions and privileged paths."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS"
featured: false
draft: false
---

Permission to query a table does not necessarily mean permission to see every record in it. A customer portal, regional operations system or shared application may store several groups' records together while requiring each reader to see only an authorised subset.

**Row-level access control** applies a rule to individual records or their eligibility for an operation. The rule may depend on ownership, organisation membership, assignment or other trusted context. It complements broader permissions that determine whether an identity can read or modify the table at all.

The difficult work is specifying and testing the policy across every relevant path. A filter that works in one screen can fail when used by an export, background job or pooled connection. A reliable design begins with explicit business rules and examines how identity, policy composition and privileged operations affect their enforcement.

## Write the policy independently of its implementation

State who may perform which action on which population. Distinguish reading from creation, modification, deletion and administrative access. Avoid using a vague role name as the complete explanation.

This is an illustrative example. A regional planner can read jobs assigned to any region in their current authorised region set, but can update scheduling fields only for jobs that remain open. That rule includes both a record boundary and an operation-specific condition.

Separate policy, model and mechanism. The policy expresses the business requirement. A model formalises the identities, attributes and relationships used to decide access. A mechanism, such as application checks or database policies, enforces that decision.

This separation makes review easier. Business owners can challenge whether a planner should see historical regional jobs without first interpreting SQL. Engineers can then assess whether the chosen mechanism actually enforces the agreed rule.

Record what happens when required context is absent or invalid. For protected data, an undefined identity should not quietly become a broad reporting identity. Make the default outcome explicit and test it.

## Establish a trustworthy request identity

An access rule is only as reliable as the identity and attributes it evaluates. A tenant or organisation identifier supplied by an untrusted client is a request value, not proof of membership.

The application must establish the user's identity through its approved authentication process and derive permitted scope from trusted records or verified claims. Client-selected filters can narrow that scope, but should not be able to expand it.

This is an illustrative example. A request includes organisation_id=27. The server must determine whether the authenticated user is authorised for organisation 27 before using that value as an access boundary.

If the database receives identity through session context, determine who can set or alter it. A policy that trusts a freely editable session variable may provide no meaningful protection against a caller capable of changing that variable.

Service identities require equally clear rules. A background worker may legitimately operate across organisations, but its authority should be limited to its function and distinguishable from an ordinary interactive user's authority.

## Define ownership and membership precisely

A record's scope may follow its owning organisation, current assignment or a historical association. Those are different rules and can produce different results after a record moves.

This is an illustrative example. A job transfers from one region to another. One policy grants access according to the current region, while another preserves access for the region that originally created it. The database cannot decide which is appropriate without a defined business requirement.

Membership can also be many-to-many. A person may work across several regions or organisations, and a record may be shared through an explicit collaboration relationship. Model those relationships deliberately instead of assuming one user has one scope forever.

Include effective dates where access depends on time. A current assignment may not authorise viewing historical confidential records, while an audit role may require a specifically approved historical population.

Keep access ownership distinct from descriptive classification. A product category used for reporting should not accidentally become the security boundary unless the organisation has chosen and maintained it for that purpose.

## Check the resulting row as well as the existing row

Read filtering determines which existing rows an identity can observe. Write control also needs to assess which new or changed rows that identity is allowed to create.

This is an illustrative example. A user can edit a record belonging to their organisation. If an update can change its organisation identifier to another organisation without a corresponding check, the user may move information across a protected boundary.

Define rules for the before and after states. The caller may need permission to act on the existing record and permission for the resulting record to belong to the proposed scope. Some transitions may require a separate authorised workflow.

Insert operations need an explicit source for scope identifiers. Relying on a form to submit the correct organisation is weaker than deriving or validating it against trusted context.

Bulk operations should follow the same policy. An import or update affecting many rows must not bypass checks merely because the application considers it an administrative convenience. Its identity, purpose and permitted population need to be explicit.

## Understand how policies and roles combine

Several rules can apply to one request. A user may inherit permissions from multiple roles, and a table may have more than one policy. The combined result depends on the system's composition rules.

An additional policy does not necessarily make access more restrictive. If applicable permissions combine as alternatives, adding a broad permission can widen access even when another policy is narrow.

This is an illustrative example. A regional rule allows access to assigned jobs, while a reporting role allows access to all jobs. A user with both roles may receive the broader scope unless the mechanism includes an explicit restriction that still applies.

Write examples of combined membership, not only each role in isolation. Include inherited roles, temporary support roles and users who have accumulated responsibilities over time.

Document conflict resolution and default behaviour. A statement such as “deny overrides allow” must reflect the actual mechanism; it is not a universal property of access-control systems. Review the resulting permission set rather than assuming the strictest-looking rule always wins.

## Verify product-specific bypass behaviour

Database implementations distinguish ordinary users, owners and privileged roles. A policy that protects ordinary queries may not constrain every administrative path.

PostgreSQL documents that superusers and roles with BYPASSRLS bypass row security, and that table owners normally do so unless configured otherwise. It also distinguishes expressions governing visible rows from checks on inserted or updated rows. Its policy combination and whole-table operation rules must be considered when designing the full permission boundary. [PostgreSQL row security documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).

Test with the identity actually used by the application. Running tests as a schema owner or administrator can conceal whether ordinary-user policies are effective.

Keep schema migration authority separate from routine application authority where the architecture permits. The ability to alter or disable an access policy is materially different from the ability to carry out a normal business operation.

Treat privileged access as a managed exception with an identifiable purpose. A broadly privileged account used by every background task makes it harder to demonstrate that those tasks respect the intended data boundaries.

## Prevent identity from leaking between pooled requests

A pooled database connection can be reused by successive application requests. If access context is stored in that session, it must be established and cleared according to a reliable lifecycle.

This is an illustrative example. A connection used for Organisation A is returned to the pool after an exception. The next request belongs to Organisation B. If the old context remains and the new request fails to replace it correctly, the database may evaluate the wrong identity or scope.

Use the implementation's documented transaction and session controls, and test their behaviour during normal completion, exceptions and cancellation. Do not assume that returning a connection resets every custom setting.

Context should be bound to the operation that needs it and should fail safely when absent. A design that depends on every caller remembering a manual cleanup statement is difficult to maintain reliably.

Test sequential requests with different scopes on the same physical connection. Tests that always create fresh connections will not expose this class of reuse problem.

## Trace access through views and functions

Applications often reach tables through views, stored procedures or functions. Those objects can affect which identity's privileges apply and how filtering is performed.

Review the complete path from caller to underlying data. A convenient function may execute with elevated privileges, or a view may expose a broader population than expected under the chosen database's rules.

Do not infer security behaviour from an object's name. A view called customer_safe is only safe if its definition, ownership and execution context enforce the intended result.

Check parameter handling as well as privileges. A procedure that accepts an organisation identifier must validate its relationship to the trusted caller where required. Encapsulation does not make an untrusted parameter authoritative.

Keep privileged helper functions narrow and reviewable. They should perform a defined task rather than provide a general route around policies. Test both intended use and inputs that attempt to cross the access boundary.

## Include derived data and exports in the boundary

Protecting base tables does not automatically protect copies derived from them. Cached responses, materialised reports, exports and search indexes may contain the same sensitive information under different access mechanisms.

This is an illustrative example. A report is generated correctly for one organisation, then stored under a cache key that omits the organisation identifier. A later request can receive the wrong report without the database policy being evaluated again.

Record how access scope travels into each derived representation. Where results are shared, ensure the cache key and retrieval authorisation preserve the intended separation.

An exported file has its own lifecycle after it leaves the application. The database cannot enforce row policies inside an ordinary downloaded copy. Limit export contents and permissions according to the business purpose.

Administrative reports need deliberate definitions too. A cross-organisation summary may be authorised while its underlying detail is restricted. The reporting path must preserve that distinction rather than assuming that access to one implies access to the other.

## Consider indirect disclosure without overclaiming protection

Access control usually focuses on direct reads and writes, but system responses can reveal other information. A uniqueness error may indicate that a value already exists, even if the caller cannot read the corresponding row.

Whether that disclosure matters depends on the protected information and application context. Review errors, existence checks and counts where they could reveal sensitive membership or activity.

Use consistent public responses when appropriate, while retaining useful protected diagnostics for operators. Avoid suppressing every error indiscriminately; that can make legitimate failures impossible to investigate.

Row filtering also does not automatically prevent inference from permitted aggregates. A user may learn information from very small groups or from comparing related reports. Those concerns require a separate assessment of the released information.

Describe the mechanism's scope accurately. A tested row policy can enforce a particular access rule through defined paths. It is not proof that every possible disclosure path in the entire application has been eliminated.

## Build an access test matrix

List representative identities, record populations and operations. For each combination, state the expected outcome before executing the test. Include both allowed and denied cases.

A useful matrix includes an ordinary member, a member of several scopes, an unassigned user, a background service and an administrator. The record set should include owned, shared, transferred, inactive and unrelated records where those states exist.

Test creation, reads, updates, deletion, exports and indirect paths. Include attempts to change scope fields and to access a known identifier outside the caller's permitted population.

Test policy changes and revocation. A user removed from a role should receive the intended outcome on subsequent operations, including those involving cached context or long-lived sessions.

Run the tests through the deployed identity path, not only through manually issued database commands. Application authentication, context propagation and database enforcement must work together for the policy to hold.

## Keep policy changes explainable

Review how newly created objects receive protection. A migration that adds another table containing scoped records must also establish its required permissions and policies. A naming convention alone does not ensure that the database will apply the same boundary automatically.

This is an illustrative example. A new attachment table stores document references linked to protected jobs. If callers can query that table directly without the intended restriction, they may discover attachment names or locations even though the job table remains correctly filtered. The relationship to a protected parent does not by itself prove that every access path to the child is protected.

Include new objects in migration acceptance checks and verify their behaviour under ordinary application identities. This extends the test matrix as the data model grows and makes the protection requirement part of the object's definition, rather than a task someone must remember after release.

Version policies alongside the data model and access requirements. A change should state which identities or populations gain or lose access and why that change is authorised.

Review existing role combinations before adding another exception. Repeated special cases can create a permission model that nobody can explain. Sometimes the underlying ownership or membership model needs refinement.

Monitor denied requests and unexpected scope changes without exposing protected records in logs. A rise in denials can reveal a configuration error, an application defect or inappropriate access attempts; the response should follow the evidence.

Retest when new tables, reports or background processes are introduced. Security boundaries are affected by the ways data is used, not only by edits to policy definitions.

Row-level access is dependable when the business rule, trusted identity and enforcement path remain aligned. Explicit write checks, tested composition and attention to derived data make that alignment visible enough to maintain as the application evolves.

*Source basis: the separation of access policies, models and mechanisms, and policy-composition concepts in Handbook of Database Security (2008), supplied in the collection. Scenarios are original synthesis. PostgreSQL-specific behaviour was checked against the linked documentation.*
