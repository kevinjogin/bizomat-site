---
title: "Designing forms around database relationships"
description: "How to make parent records, repeated details and shared relationships clear in business forms, so users understand what they are viewing, changing and saving."
publishDate: 2026-10-11
category: "Technology"
tags:
  - design
  - systems
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A form can show valid information and still lead someone to update the wrong record. A phone number appears beside a contact name, but actually belongs to the company. A quantity looks like a product property, but belongs to one order line. A delete button removes a shared record when the user only intended to remove an association.

These errors often begin with a mismatch between the database's relationships and the way the screen presents them. The data model distinguishes entities, occurrences and associations. The interface must make the relevant distinctions understandable without asking users to read a database diagram.

A useful form therefore needs more than well-aligned fields. It needs clear ownership, selection context, relationship meaning and save boundaries. Those choices determine whether the user can predict what a change will affect before accepting it.

## Design around the task and the record in focus

Begin with a concrete operation: add lines to an order, assign workers to a job, record observations against an inspection or choose approved suppliers for a component. These operations have different centres of attention even when they use some of the same tables.

Identify the record currently in focus and make its identity visible. An order-entry screen should keep the order reference and relevant customer context available while lines are edited. A supplier-assignment screen should make clear whether the user is editing the supplier itself or its relationship to a selected component.

The database's physical layout does not dictate one screen per table. A task may need several related records together. Conversely, a large table can contain fields used by different roles and workflows. The aim is to expose the relationships needed for the decision, not reproduce the storage layout mechanically.

Write a sentence describing each editable area: “These quantities belong to the selected order's lines” or “This phone number belongs to the company.” If the sentence is difficult to write, the screen probably needs a clearer scope before visual styling can solve the problem.

## Make one-to-many relationships visible

In a **one-to-many relationship**, one parent record can have several related child records. An inspection can have many observations; each observation in the example belongs to one inspection. The interface must communicate both which parent is selected and which child records are being shown.

A list of children can work well when users need to compare a few fields across several records. A detail panel can work better when each child has extensive information. Combining a summary list with a clearly identified detail panel often supports both scanning and focused editing.

When only one child is visible, make the existence of other children apparent. A heading such as “Observation 2 of 5” and a list of observation identifiers can prevent the user from assuming the form describes the whole inspection. Generic next and previous arrows are ambiguous when both parent and child records can change.

Parent changes also need a deliberate policy for unsaved child edits. Silently changing the selected order while a line is being edited can make the same fields appear to belong to another order. Save, discard or hold the draft explicitly, and ensure the final write identifies the original intended parent.

## Keep unrelated child collections distinct

A company might have contacts, delivery sites and credit notes. All three collections relate to the company, but that does not mean each contact belongs to each delivery site or that a credit note belongs to the contact displayed beside it.

Placing these collections in adjacent unlabelled panels can imply relationships the database does not contain. Users naturally read proximity as meaningful. If a selected contact causes the delivery-site list to change, they will reasonably infer a contact-to-site relationship even if the software is merely reusing a selection control.

Use headings and grouping to show the actual ownership. Separate tabs or sections can help when users do not need all collections simultaneously. However, tabs should not hide a dependency essential to the task, such as the site to which a new delivery instruction will apply.

Where there really is a relationship between two child collections, make it explicit. “Contacts authorised for this delivery site” expresses a different population from “All company contacts.” The screen should not rely on colour or position alone to convey that distinction.

## Show the association in a many-to-many relationship

A **many-to-many relationship** allows each record on either side to relate to several records on the other. A worker can be assigned to several jobs, and a job can have several workers. A linking record represents each assignment.

The assignment can have its own attributes: role, planned hours, start date or approval status. Those attributes do not belong globally to the worker or job. They describe the particular association. The same worker may be a supervisor on one job and an inspector on another.

A simple checkbox list can be sufficient when the relationship means only selected or not selected. It becomes inadequate when each selection needs a quantity, date or role. An editable assignment list usually communicates the richer relationship more clearly because each row represents an association with its own details.

The interface should also distinguish removing an assignment from deleting the worker. A button labelled “Remove from job” describes the scope. A generic “Delete” beside a worker's name leaves an avoidable question about whether the shared worker record will disappear from other jobs.

## Work through a supplier-allocation form

This is an illustrative example. A workshop buys component P20 from suppliers S4 and S9. Supplier S4 has a minimum order quantity of 10 for this component; S9 has a minimum of 25. The workshop also buys another component, P21, from S4 under a minimum quantity of 5.

| Component | Supplier | Minimum order quantity for this pairing |
|---|---|---|
| P20 | S4 | 10 |
| P20 | S9 | 25 |
| P21 | S4 | 5 |

There are two components, two suppliers and three supplier-component associations. A form showing supplier S4's general details should not present one unexplained “minimum order quantity” field, because the correct value depends on the component selected.

A component-focused form could show P20 in the header and two association rows beneath it. Each row would identify the supplier and the minimum quantity for that pairing. A separate link could open the supplier's shared contact information, clearly signalling that changes there affect other component relationships too.

Removing S4 from P20 should leave the P21–S4 association intact under the assumed rule. The test is not simply that one row disappeared from the visible screen. It must also show that the supplier still exists and that the unrelated association remains unchanged.

## Distinguish repeated entities from repeated occurrences

The same product can appear more than once on an order for legitimate reasons, such as different delivery dates or different accepted specifications. Two rows displaying the same product name are not necessarily duplicate order lines.

Decide whether the screen shows distinct entities or individual occurrences. A list of products purchased by a customer might show each product once with a total quantity. An order-history view might show every purchase occurrence with its order reference and date. Both are useful, but their editing behaviour should differ.

Do not allow a user to edit a summary row as though it were one underlying record unless the intended distribution rule is explicit. Changing a total quantity of 12 across three orders is not a simple field edit. The application needs to know which orders should change and whether that change is permitted.

Labels and additional context can make repetition meaningful. Displaying “Bracket” three times without an order reference leaves users guessing. Displaying the same name with three different order-line references explains why the rows exist and which business occurrence each action targets.

## Align save boundaries with user expectations

A screen containing several related records needs a clear acceptance boundary. Does Save accept all edited lines, only the selected line or the parent record without its children? The visible controls and feedback should answer that question consistently.

Autosave introduces the same obligation. If one field saves immediately while another waits for approval, users need to understand the distinction. An autosaved draft is not necessarily an accepted business transaction. Showing one undifferentiated “Saved” indicator can imply more than the system has actually completed.

Validation should report the affected record as well as the field. “Quantity must be positive” is insufficient when ten lines contain a quantity field. “Order 410, line 2: enter a positive quantity” gives the user a location and a corrective action.

The server must enforce the selected relationships and permissions independently of the form. A clear interface improves understanding but does not establish that a submitted child identifier belongs to the selected parent. Validate that association at the point where the change is accepted, especially when requests can be delayed or replayed.

## Keep context stable during loading and search

Search results, filtered lists and delayed requests create opportunities for the screen's visible selection to diverge from its data. If a user selects order A and quickly selects order B, a slower response for A must not fill B's detail panel with A's lines.

Tie the response to the selection that requested it, and handle stale responses deliberately. While the new data loads, show which record is being loaded. Leaving the old lines editable beneath the new order heading creates a particularly dangerous combination of individually plausible information.

Filtering also needs visible scope. “Search this order's lines” differs from “Search all products.” A product selected from a global search may still need a new order-line occurrence; it is not an existing line merely because its description matches.

When a list is paged or partially loaded, avoid presenting a visible row count as the complete relationship count. “Showing 20 of 83 assignments” conveys a different state from “20 assignments.” Actions such as select all should explain whether they affect the visible page, the filtered set or every related record.

## Make relationship meaning accessible

Visual grouping should have a corresponding semantic structure. A heading that identifies the selected order, a clear label for each input and an appropriate grouping of related controls help users understand the form without depending on visual layout alone.

The [W3C guidance on grouping controls](https://www.w3.org/WAI/tutorials/forms/grouping/) explains mechanisms such as fieldsets and legends for related inputs. The relevant design lesson is to communicate the group in the interface's structure as well as through spacing or borders. A border around several unnamed fields does not explain their shared meaning.

Errors need an equally clear path. The [W3C guidance on user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) describes identifying errors and helping users locate and correct them. In a repeated-record form, that means distinguishing one quantity field from another and preserving enough context to return to the affected row.

Avoid making meaning depend exclusively on a red row, a tiny icon or hovering over a control. A user working with a keyboard, magnification or assistive technology still needs to know which association will change. These considerations also improve usability for anyone working quickly through a long operational form.

## Review destructive and shared-record actions separately

Actions that affect a shared entity deserve especially precise language. Updating a supplier's address may affect several purchasing relationships. Retiring a component might prevent future selection across many orders. Removing one association should not be presented as though it has the same reach.

Show the relevant scope at the moment of action. This need not mean adding a confirmation dialog to every click. A clearly labelled command, an explanatory preview and a reversible draft operation may communicate the scope better than repeated generic warnings that users learn to ignore.

Where the operation is irreversible or has wider consequences, the workflow should explain those consequences using business references. “Remove this allocation from job J18” is more useful than exposing an internal table name. Users need to understand the work affected, not the persistence mechanism.

Record enough context to investigate an accepted action later. Which parent was selected, which association changed and what was the previous accepted value? This is particularly valuable when the same shared record appears in several forms and users disagree about which screen caused the change.

## Test forms with relationship-focused scenarios

A useful review goes beyond checking that every field can be entered. Begin with two parents that have similarly named children, then switch between them while editing. Add the same shared entity to two different parents with different association attributes.

Test empty collections, one child, many children and partially loaded collections. Confirm that empty means no related records, rather than a failed request or insufficient permission. Those states may require different messages and should not be collapsed into the same blank panel.

Include scenarios where a user removes an association, opens the shared record, cancels an edit and receives a validation error on a child that is not currently visible. Check the resulting database relationships as well as the screen feedback. A successful-looking message cannot prove the intended record changed.

The broader [data-modelling workshop method](/reados/collections/project-planning-and-control/running-a-data-modelling-workshop/) can help establish the relationships. For a form review, use those agreed facts as acceptance criteria: the user can identify the parent, distinguish an occurrence from a shared entity and predict the scope of each action.

## Improve one operational form at a time

For a small Australian business, start with a form associated with recurring corrections: job allocations, order lines or inspection observations. Ask users to describe what they believe each section belongs to and what they expect Save and Remove to do.

Compare those explanations with the actual relationships and transaction behaviour. A mismatch may be resolved through clearer headings and labels; another may reveal that the workflow combines decisions that should be separated. Treat the review as a test of meaning before spending effort on cosmetic redesign.

Good database forms make the structure of the work understandable. They show which record is in focus, how repeated details relate to it and when a shared record is being changed. When users can predict those consequences, the interface becomes a useful partner in maintaining data quality.

---

*Source basis: original KEVOS® analysis of Representing Entities in Form Design in the supplied Designing Effective Database Systems. The linked W3C guidance supports the accessibility discussion. The supplier-allocation scenario is illustrative and is not a KEVOS® client case study.*
