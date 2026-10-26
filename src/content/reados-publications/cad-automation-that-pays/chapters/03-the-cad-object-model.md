---
book: cad-automation-that-pays
chapterSlug: the-cad-object-model
order: 3
title: "The CAD object model: application, documents and what they contain"
description: "How a CAD API organises its objects, from the application to documents, features, configurations, properties and drawing views, how to navigate it safely, and why call counts matter."
draft: false
---

Everything a CAD program shows on screen exists, inside its programming interface, as an object: the program itself, each open document, each feature in a part's tree, each component in an assembly, each sheet and view in a drawing. A tool works by getting hold of the right objects in the right order and asking them for information or telling them to act. Get the wrong object, or assume an object exists when it does not, and the tool fails or does the right thing to the wrong document.

This chapter maps the object model that most parametric CAD programs share, using SOLIDWORKS's as the concrete example, and sets out how to navigate it safely: check every object before using it, confirm its type, and know which objects stay valid for how long. It also explains why the number of calls a tool makes matters as much as what they do. The running case finds the model behind a drawing, so that the release pack can export the right STEP file, and finds that "the first view's model" is not always the right one.

## The shape of the model

Most CAD programming interfaces are organised as a tree of objects, each giving access to the ones below it.

```figure
type: tree
title: The objects a release tool typically uses
caption: A simplified view common to most parametric CAD programs. Names differ between products; the structure is similar.
- Application | The running CAD program; the starting point for everything
  - Documents | Each open part, assembly or drawing
    - * Part or assembly document | Its feature tree, configurations, custom properties, mass properties
      - Configurations | Variants of the model, each with its own properties
      - Feature tree | Features, sketches and, in an assembly, components
        - Components | In an assembly: each instance, its file, its configuration and its children
    - Drawing document | Its sheets, its own properties and the models it shows
      - Sheets | Each sheet's size, scale and format
        - Views | Each view, its scale and the model and configuration it shows
  - Selection manager | What the user currently has selected, per document
```

A tool rarely needs more than three or four levels. The release pack, for example, needs the application, the active document, the document's type and custom properties, its sheets, and the models referenced by its views.

## Every object can be missing

At every step down the tree, the object asked for may not exist. There may be no active document; a drawing may have no views; a view may show a model that is no longer at the path the drawing remembers; an assembly component may be suppressed, so that its document is not loaded. In most APIs a missing object comes back as an empty reference, null or nothing, rather than as an error, and the error comes one line later when the tool tries to use it.

The habit that prevents this is simple and tedious: after every call that returns an object, check that the object is there before using it, and if it is not, report which object was missing and stop or skip. A tool written that way is a few lines longer and fails with a message such as "drawing has no views" instead of a cryptic error from deep inside the program.

## Check the type, not just the presence

A document object may be a part, an assembly or a drawing, and the methods that make sense differ. Asking a drawing for its mass properties, or a part for its sheets, returns nothing useful or fails. Most APIs let the tool ask a document for its type; the tool should ask, and branch, before doing anything type-specific.

This is an illustration. The release pack's first check, after confirming that a document is open, asks its type. For a drawing it runs the drawing steps; for a part or assembly it tells the user that the tool releases drawings and stops. A version run from a part could be useful, but it would need its own design: which drawing to find, and what to do if there are two.

## Objects have lifetimes

An object reference stays valid only as long as the thing it refers to. Close a document, and every object the tool got from it, its features, its views, its properties, becomes stale: using it may fail, or may silently refer to something else. Rebuilding a model can replace some of its objects too.

For a batch tool, the practical rule is to get objects fresh for each document, use them, and let them go before closing the document. A tool that collects feature objects from forty documents into a list and then processes the list after closing the documents will fail on the first item. It should collect the information it needs, such as names and values, not the objects themselves.

## Calls cost time

Each call a tool makes into the CAD program takes time, and how much depends on where the tool runs. A macro or add-in running inside the CAD program's own process makes calls quickly. A standalone program connecting from outside makes each call across a process boundary, which is much slower per call.

This is an illustration. Suppose a call made in-process takes about 20 microseconds and the same call from an external program about 500 microseconds. A tool that makes 50,000 calls, say reading ten properties from each of 5,000 components, takes about **1 second** in-process and about **25 seconds** from outside. Reduce the calls to 2,000, by reading each document's properties once rather than once per instance, and the external tool takes about 1 second too. Real timings vary widely by call and product; the tool's owner should measure them. The lesson does not vary: count the calls in the inner loop, and avoid asking the same question many times.

```figure
type: bars
title: Time for a property sweep, by where the tool runs and how many calls it makes
unit: s
max: 26
caption: This is an illustration with assumed call times of 20 µs in-process and 500 µs from an external program. Measure your own; the ratio matters more than the values.
- 50,000 calls, in-process | 1
- *50,000 calls, external program | 25
- 2,000 calls, external program | 1
```

## The running case: which model does this drawing show?

The release pack must save a STEP file of the model the drawing describes. The drawing object does not hold a "main model" property; it holds sheets, and each sheet holds views, and each view references a model and a configuration. The tool must work out which one is the drawing's subject.

This is an illustration. The administrator's first version took the model referenced by the first view on the first sheet, which on most of the office's drawings is the front view of the part. It worked on 46 of 50 test drawings.

## The error: a STEP file of a bolt

On the four failures, the first view on sheet 1 was not the part. On two assembly drawings, the first view created had been a detail of a purchased bolt, inserted early to show a thread; on one, it was a view of a mating part shown for reference; on one, the first view had been deleted and recreated, so another view now came first. The tool exported a STEP file of the bolt and named it after the drawing.

The test caught it because the test plan compared each exported STEP file's part number property with the drawing's number. The administrator changed the rule: the tool now reads the drawing's own number property, looks through all views on all sheets for a referenced model whose part number property matches, and exports that one. If none matches, or more than one does with different configurations, it skips the drawing and logs "cannot identify the drawing's model". On the 50 test drawings, the new rule found the right model on all 50.

```figure
type: compare
title: Two rules for finding the drawing's model
cols: Rule | Right on 50 test drawings | Failure mode
caption: This is an illustration. Matching by part number property is slower and depends on properties being filled in, which Chapter 7 checks.
- First view's model | Take the model in the first view on sheet 1 | 46 | Exports the wrong model silently
- *Match by part number | Find the view whose model's part number equals the drawing number | 50 | Skips and logs when no match is found
```

## A map for each tool

Before writing a tool, its owner can sketch the objects it will touch, in the shape of the tree above, with one line for each: where the object comes from, what the tool reads or changes on it, and what happens if it is missing. For the release pack, the map has nine lines, from the application down to each view's referenced model and its configuration's properties. The map takes twenty minutes and does two jobs: it shows where the checks of Chapter 2 must go, and it becomes the first page of the tool's documentation, so that the next owner can see at a glance what the tool depends on.

## Documents the tool did not open

A tool that opens documents should close them when done, and a tool that works on whatever the user has open should leave it open. Mixing the two is a common source of frustration: a release tool that closes the drawing the user was working on, or leaves forty models open in the background, using memory until the CAD program slows to a crawl.

The release pack keeps a list of the documents it opened itself, closes exactly those at the end of each drawing's release, and never closes a document the user had open before it started. It also opens referenced models in the lightest mode the API offers when it only needs their properties, which is faster and uses less memory.

## Reading the API help

The vendor's API help is the reference for every object and call, and it repays learning to read. Each object's page lists its methods and properties; each method's page gives its arguments, what it returns, which version introduced it, and often a short example. Three things on those pages matter most to a tool's owner.

**Return values.** Whether a call returns an object, a value, a success flag or an error code, and what it returns on failure. The tool's checks depend on knowing which.

**Units.** Whether lengths and angles are in the document's units or the API's internal ones. Chapter 4 shows why this matters.

**Status.** Many APIs keep old versions of a call for compatibility and mark them obsolete when a newer one replaces it, often with a number appended to the newer name. An obsolete call usually still works, but may lose features or disappear in a later release. A tool built on current calls is cheaper to keep through upgrades.

The vendor's own examples, such as SOLIDWORKS's recursive assembly traversal example cited in this book's references, are usually the best starting point for a task, because they use current calls in the intended way.

## Events

Besides calls the tool makes, most CAD APIs can tell a tool when something happens: a document opened, saved or closed, a selection changed, a rebuild finished. A tool that subscribes to these events can act without being started: check a drawing's properties every time it is saved, for example, and warn if the revision is blank.

Events are powerful and easy to overuse. A tool that does heavy work on every save slows every drafter's every save. A tool that changes the document during a save event can conflict with the save itself. The release pack does not use events; the office considered a save-time property check and decided that a warning, without any change to the file, would be acceptable, and that is what Chapter 7's checker does.

## Library versions

A compiled tool connects to the CAD program through type libraries or interop assemblies that describe the API, and those come with each CAD version. A tool built against the newest version's library may fail to start on a seat running an older version, and a tool built against an old library cannot use newer calls. In an office where every seat is upgraded together, this rarely bites. In one where seats are upgraded gradually, the tool must be built against the oldest version still in use, or deployed in two builds. The release pack is built against the office's current version, and the administrator rebuilds and retests it as part of every upgrade, which Chapter 10 costs.

## Configurations

A part or assembly can have several configurations: variants with different dimensions, suppressed features or properties. A drawing view shows one configuration, and properties can live on the document as a whole or on each configuration. A tool that reads "the part number" must know which.

The release pack reads properties from the configuration the drawing's view shows, falling back to the document-level property if the configuration has none, which matches how the office's templates are set up. Chapter 7 deals with properties in detail; here the point is that the configuration is part of the address of the data, and a tool that ignores it reads the wrong value on every multi-configuration part.

## Exercise: a drawing with two parts

An assembly drawing shows a welded frame on sheet 1 and, on sheet 2, a detail of one of its cut plates, which has its own part number. The drawing's number property is the frame's number. Which model should the release pack export, and what should it do about the plate?

**Worked answer.** The drawing describes the frame, and its number property is the frame's, so the matching rule finds the frame's model in a view on sheet 1 and exports a STEP of the frame. The plate's model, found on sheet 2, does not match the drawing's number and is ignored.

The plate has its own part number, so it should have its own drawing and its own release. If the office's practice is to detail a weldment's cut plates on the weldment's drawing rather than separately, the release pack would need a rule for that, such as exporting every model on the drawing whose part number appears on the drawing's parts list, and naming each file by its own part number. That is a change to the office's release procedure first and to the tool second, and the tool should not invent it.
