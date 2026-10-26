---
book: cad-automation-that-pays
chapterSlug: working-with-what-the-user-selected
order: 5
title: "Working with what the user selected"
description: "Read a selection completely before acting, check each item's type, resolve faces and edges to the objects that own them, remove duplicates, use selection filters, and report what was ignored."
draft: false
---

Many useful tools act on what the user has selected: release the drawings of these components, set the material of these parts, change these dimensions, mate these faces. Selection makes a tool flexible, because the user decides its scope, and fragile, because the user can select anything. A drafter who means "these three parts" may have selected two components, a face of the third and, by accident, a sketch line. A tool that assumes every selected item is a component will fail on the face and do something strange with the line.

This chapter sets out how to work with selections safely. It covers reading the whole selection before acting, checking each item's type, resolving faces and edges to the component or part that owns them, removing duplicates, using selection filters to guide the user, and reporting what was ignored and why. The running case adds a "release selected" mode to the release pack and finds that opening the first drawing cleared the selection for the rest.

## What a selection contains

A CAD program's selection is a list of items, each with a type: a face, an edge, a vertex, a sketch entity, a feature, a dimension, a component, a drawing view, and so on. Most APIs expose it through a selection manager on each document, which reports how many items are selected and, for each by its position in the list, what type it is and the object itself.

Two features of selections catch tools out. The same underlying thing can appear more than once in different forms: a component selected directly, and one of its faces selected as well. And the selection is live: it changes whenever the user or the tool selects or clears something, including when the tool opens another document or rebuilds.

## Read everything first, then act

The first rule is to read the entire selection into the tool's own list before doing anything that could change it. Opening a document, activating another window, rebuilding, even some queries can clear or alter the current selection. A tool that reads item 1, acts on it, then asks for item 2 may find the selection empty.

```
start
  count = number of selected items
  if count is 0, report "select at least one component" and stop
  items = empty list
  for each position from 1 to count
    record the item's type and the object it refers to
  now work only from items, never from the live selection again
end
```

## The error: ten components, one drawing

This is an illustration. The release pack's first "release selected" mode worked in an assembly. The user selected the components whose drawings were to be released, and the tool, for each selected item in turn, found the component's drawing, opened it, released it and closed it.

A drafter selected ten components and ran it. The log showed one drawing released and nine items "not found". Opening the first drawing had made it the active document; when the tool came back to the assembly to read the second selected item, the assembly's selection had been cleared by the switch of documents, and the selection manager reported nothing at positions 2 to 10.

The log's count made the fault obvious: ten selected, one processed. The fix was the rule above: read all ten items into a list, resolve each to its component's file path, and only then start opening drawings. The tool has not lost a selection since.

## Check each item's type

Once the selection is in a list, check each item's type against what the tool can use, and decide what to do with the rest. For a tool that acts on components, the useful types are components themselves, and faces, edges or vertices of components, which can be resolved to their owner. Sketch entities, reference planes, annotations and dimensions are not components and cannot be resolved to one in a meaningful way.

```figure
type: compare
title: What the release pack does with each selected type
cols: Release pack's action | Reason
caption: This is an illustration for the "release selected" mode in an assembly. The rule for each type is decided in advance, not discovered at run time.
- Component | Use it | It is what the tool acts on
- *Face, edge or vertex of a component | Resolve to its component | Users often click a face to select a part
- Sub-assembly component | Use it, and ask whether to include its children | The user may mean the sub-assembly's drawing, or all of them
- Sketch entity, plane, axis | Ignore and report | No component to resolve to
- Annotation or dimension | Ignore and report | Not a component
```

## Resolve, then remove duplicates

A face belongs to a body, which belongs to a component. Most APIs let the tool ask a selected face which component owns it. After resolving every face, edge and vertex to its component, the list may hold the same component several times: once because the user selected it, again because they selected two of its faces. The tool should reduce the list to unique components, comparing them by a stable identity such as the component's file path and configuration, not by the object references, which may differ for the same component.

This is an illustration. A drafter selects 14 items in the conveyor drive assembly: 9 components, 3 faces and 2 sketch lines. The 3 faces belong to 2 components, one of which is already among the 9. After resolving and removing duplicates, the tool has **10 unique components**, and it reports the 2 sketch lines as ignored.

```figure
type: funnel
title: From 14 selected items to 10 components to release
caption: This is an illustration. The tool reports each step's count, so the user sees what was used and what was ignored.
- Items selected | 14
- Items of a usable type | 12 | 2 sketch lines ignored
- After resolving faces to components | 12 | 9 components plus 3 resolved faces
- *Unique components | 10 | 2 duplicates removed
```

## Instances and files

In an assembly, a component is an instance: a particular occurrence of a part or sub-assembly file in a particular position and configuration. Selecting four bolts selects four instances of one file. For a tool that releases drawings, the four instances have one drawing, and the tool should release it once. For a tool that counts hardware, the four instances are four bolts. The tool must know which it needs and reduce the list accordingly: to unique files and configurations for release, to instances for counting. Chapter 6 develops this for whole assemblies.

## Selection filters

Many CAD programs let a tool or a user restrict what can be selected, to faces only, components only, edges only, and so on. Setting a filter before asking the user to select is friendlier than accepting anything and reporting what was ignored, because the user simply cannot select the wrong type.

The release pack's "release selected" mode turns on a component filter when it starts in interactive mode and asks the user to select components, then restores the user's previous filter when it finishes. Restoring the filter matters: a tool that leaves the user stuck with a component-only filter has changed their CAD session in a way they will notice and resent.

## Select first, or ask during the tool?

A tool can work on what the user selected before starting it, or start first and ask the user to select. Each suits different jobs.

```figure
type: decision
title: When should the user make the selection?
question: The tool needs the user to choose some objects. Before it starts, or during?
- Simple scope, one kind of object | Preselect, then run | Fast for experienced users; the tool validates what it finds
- *Several inputs with different roles | Prompt during the tool, one input at a time | Each prompt can filter for its own type and explain its role
- Large or repeated scope | Preselect with a saved selection or a rule | Avoids re-selecting the same set every time
- Unclear scope | Prompt, and show the user what will be affected before acting | The confirmation step catches misunderstandings
```

The release pack accepts both. Run with components already selected, it uses them; run with nothing selected, it turns on the component filter, asks the user to select, and offers a Done button. The second route is slower for experts and safer for occasional users, who see a prompt explaining what to select rather than an error saying they selected the wrong thing.

## Order and roles

Some tasks need selected items in particular roles: the first face and the second face of a mate, the edge to dimension from and the edge to dimension to, the model and the drawing template. The order in which the user clicks rarely matches the role the API expects without help. A tool that assumes "first selected is the fixed part" will be wrong whenever the user clicks the other way round.

Two approaches work. Prompt for each role in turn, filtering for the right type each time: "Select a face on the fixed part", then "Select a face on the moving part". Or accept a preselection and work out the roles from the items themselves, for example the face on the component that is fixed in the assembly is the fixed face. The first is clearer; the second is quicker when the rule is reliable. Either way, the tool should check that each role's item has the type and geometry the operation needs: a concentric mate needs two cylindrical faces, and a planar face selected by mistake should be reported before the call fails with an unhelpful error.

## Selections in drawings

In a drawing, users select views, annotations and the edges of the geometry shown in views. A tool that acts on models from a drawing, such as releasing the model shown in a selected view, must resolve the selected view to its referenced model and configuration, in the same way that Chapter 3 resolved the drawing's subject. A selected edge in a view resolves first to its view, then to the model. The same duplicate removal applies: three edges selected in one view are one model, not three.

## Selections made by the tool

Some API calls act on whatever is selected, rather than on objects passed to them: creating a mate between two selected faces, for example, or applying a feature to selected edges. A tool using such calls must make the selection itself, often with marks that tell the call which selected item plays which role, then call the function, then clear its selection. The user's own selection, if the tool needs to preserve it, must be saved before and restored after.

The rule is the same as for filters: leave the session as you found it. A tool that clears the user's careful selection of twenty faces in order to make one mate, and does not restore it, will be used once.

## Reporting what was ignored

A selection tool's report should say what was selected, what was used and what was ignored, with reasons. For the drive assembly example:

```
14 items selected
 2 ignored: sketch lines are not components
 3 faces resolved to 2 components
 2 duplicates removed
10 components to release:
   BR-310, TA-201, TA-202, ...
```

The user can see at a glance whether the tool understood what they meant. If the count of components is not what they expected, they know before anything has been released.

The same report is written to the log, with the user's name and the time, so that if a question arises later about why a drawing was or was not released in a particular batch, the answer is on record: it was selected, or it was not, or it was selected only as a sketch line on its face that the tool ignored. That last case happened once in the office's first month and took two minutes to explain from the log.

## Suppressed, hidden and lightweight components

Users can select components that the tool cannot fully use. A component that is suppressed is not loaded at all; one that is lightweight is loaded with only part of its data; one that is hidden is loaded but not shown. Depending on the API, a selected lightweight component may need to be resolved, fully loaded, before the tool can read its properties or find its file's drawing, and a suppressed one cannot be selected in the graphics area but can be selected in the feature tree.

The release pack treats each case explicitly. Lightweight components are resolved, which takes a moment per component and is shown in the progress indication. Suppressed components selected in the tree are reported and skipped, because a suppressed component is, by the assembly's own definition, not part of the configuration being released. Hidden components are released normally, since hiding is a display choice, not a design one. Writing those three rules down took ten minutes and prevented three different classes of puzzling result.

## Large selections

Selections can be large: a user can select a whole assembly's worth of components with a box. A tool should handle a selection of 500 items as gracefully as one of 5, which means no per-item dialog boxes, a progress indication, and a confirmation step before acting on more than a set number, say 50, so that an accidental box selection does not release 500 drawings. The release pack asks "Release 214 drawings? Yes / No" for anything over 50, with the count of unique drawings rather than the count of selected items.

## Exercise: setting material from a selection

A tool sets the material of selected parts. In a part document, a user selects three edges and one face, all on the same body, and runs it. In an assembly, another user selects six faces on four components, two of which are the same part file used twice. What should the tool do in each case?

**Worked answer.**

**In the part document.** Edges and faces belong to the part's body, and material is set on the part, or on the body in programs that allow per-body materials. All four items resolve to the same part, so after removing duplicates there is **one** part. The tool should set its material once and report "4 items selected, resolved to 1 part".

**In the assembly.** The six faces resolve to four component instances. Material belongs to the part file, not the instance, so instances of the same file should be reduced to one: the two instances of the shared part become one file, and the tool acts on **three** part files. It should report the instance count and the file count, because setting the material of a shared part changes it in every assembly that uses it, which is a change the user should confirm: "6 faces on 4 components, 3 part files. Setting material on 3 files, one of which is used in other assemblies. Continue?"
