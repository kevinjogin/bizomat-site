---
title: "Design intent in parametric 3D CAD and managing large assemblies"
description: "Parametric models that break when changed, and assemblies that take minutes to open, cost design teams heavily. How to capture design intent, structure assemblies and control CAD data."
publishDate: 2026-10-09
category: "Technology"
tags:
  - design
  - systems
  - product-development
author: "KEVOS"
featured: false
draft: false
---

Parametric 3D CAD promises that a design can be changed by editing a dimension and letting the model update. When models are built well, that promise holds: a frame gets longer, and the brackets, holes and covers follow; a new size variant takes an afternoon rather than a week. When models are built carelessly, the opposite happens. Changing one dimension produces a cascade of errors, features flip or fail, parts no longer fit, and the designer rebuilds the model from scratch. In large assemblies, broken references, duplicated parts, slow performance and wrong bills of materials can consume more engineering time than the design itself.

The difference lies in **design intent**: deliberately building the model so that it changes the way the designer intends, and in planning assemblies and data before the first part is made. These are habits and conventions, not features of any particular software. They apply across the parametric CAD systems commonly used in Australian design offices.

This article explains how parametric models capture design intent, practical modelling habits that make models robust, how to structure assemblies using bottom-up, top-down, skeleton and master model approaches, how to manage large assembly performance, and how to control file naming, numbering, revisions and data exchange. It is general information for designers, engineers and engineering managers. Software documentation and training cover the specific commands in each system.

## How parametric models work

A parametric model is built as a sequence of **features**, such as extrusions, cuts, revolves, holes, fillets and patterns, usually starting from **sketches**. Each feature is controlled by **parameters**: dimensions, relationships and references to earlier geometry. The software records this sequence in a **feature tree** or history. Changing a parameter regenerates the features in order.

**Design intent** is the set of decisions about how the model should behave when it changes. Should a hole stay centred on a face, or stay a fixed distance from an edge? Should a wall stay a fixed thickness when the overall size changes? Should a pattern add more holes as a plate gets longer, or keep the same number with wider spacing? The same final shape can be built many ways, but each way responds to change differently.

Design intent is captured through:

- **Sketch relations**: horizontal, vertical, parallel, tangent, equal, symmetric, coincident and similar constraints.
- **Dimensions**: which values are driving and what they are measured from.
- **Feature choices**: for example, a hole feature that knows it is a tapped hole, rather than a plain cut.
- **References**: which planes, faces or axes each feature depends on.
- **Equations and global variables**: relationships such as wall thickness equal to a fraction of height, or hole spacing derived from length.
- **Configurations or design tables**: controlled sets of values for size variants.

## Modelling habits that make models robust

- **Fully define sketches.** An under-defined sketch can change shape unexpectedly when something else changes.
- **Dimension from stable references**: the origin, default planes and principal faces, rather than edges created by fillets or chamfers that may later disappear.
- **Build in a logical order**: main shape first, then major features, then holes, then cosmetic details such as fillets and chamfers last.
- **Keep sketches simple**: several simple features are easier to understand and change than one complex sketch.
- **Use symmetry** about the origin for symmetric parts, so changes stay balanced.
- **Name important features and dimensions**, so others can find and understand them.
- **Avoid unnecessary dependencies**: each feature should reference only what it needs.
- **Test the model**: change key dimensions over their expected range and check that the model behaves as intended before releasing it.

Most CAD systems identify faces and edges internally, and when an earlier change alters the geometry, later features can lose their references. This is why references to stable datums are more robust than references to generated edges. The [editing CAD geometry without losing design intent](/insights/editing-cad-geometry-without-losing-design-intent/) article covers the same principle for 2D work.

## Multibody parts and product families

A **multibody part** contains several separate solid bodies in one part file. It is useful for designing related shapes together, such as a weldment, or for building complex shapes from intermediate bodies. Multibody techniques can be powerful but should not replace proper assemblies for parts that will be made, bought and listed separately.

Product families with many sizes benefit from **configurations** or **design tables**, where one model holds a controlled set of sizes driven by a table of values. This keeps variants consistent and makes adding a size quick. Keep the table as the single source of each variant's key values, give each variant its own part number and properties, and test that every variant regenerates without errors whenever the base model changes.

## Assembly modelling approaches

### Bottom-up design

Parts are modelled independently and then placed into the assembly using **mates** or **constraints** that define how they fit together. Bottom-up suits standard parts, purchased components and designs where parts are already defined. It is simple and keeps parts independent and reusable.

### Top-down design

Parts are created or edited within the assembly, referencing other parts' geometry. A hole in a cover can follow a pin on the frame; a bracket can be sized to the space between two members. This guarantees fit and propagates changes automatically, but it creates **external references** between files. Too many in-context references, especially chains from one minor part to another, make assemblies slow, fragile and prone to circular references. Parts with external references are also hard to reuse in other assemblies.

Most CAD systems let designers list, lock or break external references. Lock references when a part should stop updating, for example after release, and break them deliberately when a part becomes independent.

### Skeleton models

A **skeleton model** is a single part containing only key layout geometry: interfaces, mounting points, envelopes, centre lines and critical dimensions. All components and sub-assemblies reference the skeleton, not each other. This creates a hub-and-spoke reference structure, which is predictable, keeps the circular reference risk low and lets different designers work on sub-assemblies independently. Skeleton models suit industrial machinery, plant layouts and equipment with many mechanical interfaces.

### Master models

A **master model** contains complex shapes, often surfaces, from which several components are derived. It suits consumer products, enclosures, ducts and other designs where multiple parts share a styled shape. Changes to the master flow to all derived parts.

| Approach | Best suited to | Main risks |
|---|---|---|
| Bottom-up | Standard parts, stable designs, purchased items | Parts may not fit after changes unless mates and interfaces are maintained |
| Top-down with in-context references | Parts that must fit precisely around others | Fragile reference chains, poor reusability, slow assemblies |
| Skeleton model | Machinery and layouts with many interfaces | Needs discipline to reference only the skeleton |
| Master model | Products with shared styled surfaces | Changes can cascade widely |

## Structuring large assemblies

Assemblies with thousands of parts, worked on by several people, need structure:

- **Mirror the product structure**: organise sub-assemblies to match how the product is built and listed in the bill of materials, not how it was convenient to model.
- **Keep sub-assemblies to manageable sizes**, so each can be opened and worked on independently.
- **Use simplified representations** of purchased items such as motors, gearboxes and valves, keeping their interfaces and envelopes but removing internal detail.
- **Use lightweight and large-assembly modes** offered by the software for viewing and reviewing.
- **Control configurations** carefully, so variants do not multiply uncontrollably.
- **Use patterns and standard part libraries** rather than copying files.

Performance problems often come from a small number of causes: overly detailed purchased models, unnecessary in-context references, excessive mates, imported geometry with errors and very large patterns. Finding and fixing them restores performance far more than faster hardware.

## Managing CAD data

Planning data management before a project starts costs far less than recovering from chaos later. Common failure modes in unplanned projects include broken references after files are moved, lost work from overwritten files, duplicate parts with conflicting dimensions and inaccurate bills of materials.

### Naming and numbering

- **Intelligent part numbers** encode information such as project, area and part type. They are readable but need a well-designed scheme and can become awkward when parts are reused.
- **Non-intelligent, sequential numbers** carry no meaning; descriptions and attributes live in file properties or a database. They are simple and never need renumbering but depend on good metadata.

Whichever approach is chosen, apply it consistently and record descriptions, materials, finishes and part types as file properties, so bills of materials can be generated accurately.

### Revisions

Track revisions in file properties or a product data management system, not in file names. Putting revisions in file names creates new files and breaks every assembly that referenced the old one. Define in advance what triggers a new revision and who approves it.

### Product data management

A **product data management** system controls file versions, check-in and check-out, approvals and references, preventing overwrites and keeping models, drawings and bills of materials linked. Smaller teams without one need strict folder structures, file naming rules and backups. The [preparing CAD files for a reliable handover](/insights/preparing-cad-files-for-a-reliable-handover/) article covers getting files ready when they pass to other people or businesses.

### Data exchange

Customers, suppliers and analysts often use different software. Neutral formats such as **STEP** transfer solid geometry reliably between systems; newer versions of STEP can also carry product and manufacturing information. Imported geometry loses its feature history, so plan which party owns and edits each model. Check imported models for errors before building on them.

## Analysis and simulation

Most CAD systems include tools for **mass properties**, **interference checking**, **motion studies**, **finite element analysis** and **flow simulation**. These are valuable for checking clearances, weights, mechanisms and early design options. Simulation results depend on assumptions about loads, restraints, materials and mesh, so they need to be set up and interpreted by people competent in the method and checked against hand calculations or tests for important designs. The [choosing a 3D model that suits the design question](/insights/choosing-a-3d-model-that-suits-the-design-question/) article explains matching model detail to the question being asked.

## A worked example

This is an illustrative example. A machine builder designs a family of processing machines, each with about 1,800 parts. Models break regularly when frame sizes change, the main assembly takes several minutes to open, the same bracket exists under three different file names, and bills of materials need manual correction before release.

**Review.** The engineering manager and two senior designers review the CAD practices. Brackets reference each other's edges in long chains; purchased motors and gearboxes are fully detailed models with thousands of faces; revisions are added to file names; and there is no consistent numbering.

**Changes.**

- Each machine gets a skeleton model with the frame layout, interface points and envelopes. Sub-assemblies reference only the skeleton.
- Purchased components are replaced with simplified models keeping their interfaces.
- Duplicate parts are merged, and a standard parts library is created.
- Sequential part numbers are adopted, with descriptions, materials and finishes recorded as file properties.
- Revisions move into file properties, managed through a product data management system with check-in and check-out.
- Key models are tested by changing frame lengths over the product range before release.

**Result.** A frame length change that previously took several days of repair now propagates in a few hours. The main assembly opens in a fraction of the previous time, and bills of materials are generated directly from the models without manual correction. New designers find their way around the models more quickly because the structure is consistent.

## Applying this in an Australian business

- **Decide design intent** before modelling, and test models by changing them.
- **Use stable references** and fully defined sketches.
- **Choose an assembly approach** for each product: bottom-up, skeleton or master model.
- **Limit in-context references**, and lock or break them deliberately.
- **Structure assemblies** to match the product and bill of materials.
- **Simplify purchased models.**
- **Plan numbering, properties and revisions** before projects start.
- **Use data management** appropriate to the team's size.

## Where parametric CAD goes wrong

- **Under-defined sketches** that change unexpectedly.
- **References to fillet edges** and other unstable geometry.
- **Chains of in-context references** between minor parts.
- **Revisions in file names.**
- **Fully detailed purchased models** in large assemblies.
- **Duplicate parts** with no numbering scheme.
- **Simulation results** accepted without checking assumptions.

## Questions to ask about your CAD models

- What should happen to this model when key dimensions change, and have we tested it?
- What does each feature reference, and is it stable?
- Which assembly approach suits this product, and are we following it?
- How long do our main assemblies take to open, and why?
- How are parts numbered, described and revised?
- Can we generate an accurate bill of materials directly from the models?

## Bringing it together

Parametric CAD saves time only when models are built to change the way the designer intends. Capture design intent through relations, dimensions, references and equations, build in a logical order from stable references, and test models by changing them. Choose assembly approaches deliberately: bottom-up for independent parts, skeleton models for machinery and layouts, master models for shared styled shapes, with in-context references kept few and controlled. Structure assemblies to match the product, simplify purchased models, and plan numbering, properties, revisions and data management before projects start. The result is models that update reliably, assemblies that perform, and design data the whole business can trust.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS engineering handbooks on parametric 3D CAD design intent, sketching and part modelling, assembly fundamentals, top-down assembly design, large CAD assemblies, multibody parts, data exchange and CAD analysis tools, together with established CAD practice. The worked example is illustrative. This article is general information; refer to software documentation for specific commands.*
