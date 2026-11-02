---
book: cad-automation-that-pays
chapterSlug: walking-an-assembly
order: 6
title: "Walking an assembly"
description: "Traverse an assembly recursively, tell instances from unique files, handle suppressed, lightweight and excluded components, cache per file, and check counts against the drawing's BOM."
draft: false
---

Many of the most useful CAD tools need to visit every component of an assembly: to list its parts, count its fasteners, check every component's properties, find every drawing that should be released with it, or sum its mass. That means walking the assembly's tree, from the top assembly through each sub-assembly down to each part. The walk is simple in principle and full of small decisions in practice: whether a suppressed component counts, whether two instances of a bolt are one line or two, whether a sub-assembly used twice is visited twice.

This chapter sets out how to walk an assembly, using recursion as the vendor's API help recommends, and how to make those decisions deliberately. It covers instances and unique files, quantities that multiply down the tree, suppressed, lightweight and excluded components, caching to keep the walk fast, and checking the result against an independent count. The running case adds an assembly mode to the release pack and finds sixteen bolts the drawing's parts list did not have.

## Why recursion

An assembly is a tree. Its top level holds components, some of which are parts and some sub-assemblies, and each sub-assembly holds components of its own, to any depth. In SOLIDWORKS's API, the call that returns a component's children returns only one level, and the vendor's help says so explicitly: to reach every component, the tool must call it again on each child that is itself an assembly. That is recursion: a routine that, for each child, calls itself.

```
visit(component, depth, quantity_above)
  record component, its file, configuration, depth and quantity_above
  children = the component's immediate children
  if there are no children, return
  for each child in children
    visit(child, depth + 1, quantity_above)

start
  root = the assembly's root component
  for each child of root
    visit(child, 1, 1)
end
```

Every instance of every component is visited once, in tree order, and the depth tells the tool how far down it is. For the office's assemblies, never more than six levels deep, recursion has no practical limit.

## The running case: the conveyor drive assembly

This is an illustration. The drive assembly that the release pack's assembly mode was first tested on has a top assembly, four sub-assemblies and parts at up to three levels. The walk recorded:

```figure
type: stats
title: What the walk found in the conveyor drive assembly
caption: This is an illustration. Instances are occurrences in the tree; unique files count each file and configuration pair once.
- 412 | Component instances visited | Every occurrence at every level
- 138 | Unique file and configuration pairs | What a release or property check acts on
- * 168 | Fastener instances | Of 12 unique fastener files
- 26 | Suppressed instances | In the configuration being released
- 54 | Lightweight instances | Resolved before reading their properties
- 3 | Levels below the top assembly | The deepest branch
```

The two counts that matter most are the 412 instances and the 138 unique files. A tool that releases drawings needs the 138; one that counts hardware for purchasing needs instances, grouped by file.

## What to record at each visit

Each visit should record enough to answer the tool's questions without visiting again: the component's name in the tree, its file path, the configuration it uses, its depth, the quantity multiplier above it, and its states: suppressed, lightweight, hidden, excluded from the parts list, virtual. Recording the file path and configuration as plain text, rather than holding on to the component object, also follows Chapter 3's rule about object lifetimes, so that the list remains usable after documents have been closed.

For the drive assembly, each record is one line of about a dozen fields, and the 412 records take a few tens of kilobytes. Everything else the tool does, deduplication, counting, sorting by depth, works from that list.

## Instances and quantities

Each visit is one instance. If a sub-assembly appears twice in the top assembly, its children are visited twice, once under each instance, and a bolt that appears four times in the sub-assembly is visited eight times. That is usually what a quantity count wants: eight bolts are needed. The recursion handles it naturally, because each instance of the sub-assembly is walked separately.

Some tools prefer to walk each unique sub-assembly once and multiply. That is faster for very large assemblies and gives the same totals, provided every multiplication is done correctly: the quantity of a part is the product of the quantities of every assembly above it on its path. Bills of materials work this way, and the Library’s *Bills of Materials by the Numbers* develops the arithmetic.

```figure
type: formula
title: Quantity of a part in the top assembly
formula: total quantity = sum over every path of the product of quantities along that path
caption: This is an illustration. Walking every instance gives the same total as multiplying down the tree, because each instance is one term of the product.
- Path | Top assembly to sub-assembly to part
- Quantity along the path | How many of each item at each level
step: Tensioner sub-assembly used 2 times; 4 M12 bolts in each tensioner
step: Bolts from the tensioners: 2 × 4 = 8
step: Plus 6 M12 bolts directly in the top assembly: total 14
```

## Suppressed, lightweight, excluded and virtual

The vendor's help notes that the children returned include suppressed, hidden and lightweight components, and that the tool must check their states. Each state needs a rule, and the right rule depends on the tool.

- **Suppressed** components are not part of the active configuration. A release tool should skip them, and a quantity count must exclude them; otherwise it orders parts the configuration does not use.
- **Lightweight** components are loaded with only part of their data. A tool that reads their properties may need to resolve them first, which takes time.
- **Excluded from the BOM** is a flag many CAD programs offer for components that are in the model but not purchased or made separately, such as a reference copy of a mating machine. A quantity count should honour it.
- **Virtual** components, saved inside the assembly rather than as separate files, have no file path of their own. A release tool must decide whether they need a drawing.

## The error: sixteen extra bolts

This is an illustration. The release pack's assembly mode also produced a hardware list for purchasing: each fastener file and its count. For the drive assembly it listed 168 M12 and M8 fasteners of various kinds. The drawing's parts list, generated by the CAD program from the same assembly, listed 152.

The difference, 16, matched a count in the walk's own record: 16 fastener instances in a guard sub-assembly that was suppressed in the configuration being released, because the customer had ordered the drive without its guard. The first version of the walk counted every instance it visited, suppressed or not.

The fix was to check each instance's suppression state in the configuration being walked and skip suppressed instances and their children, which is what the parts list does. After the fix, the walk's count matched the parts list's 152 exactly. The test that caught it, comparing the walk's quantities with the drawing's parts list, became a standing test: any quantity the tool produces must match the CAD program's own parts list for the same configuration, or the tool reports the difference.

## Cache per file

Walking 412 instances and reading each one's properties means 412 sets of reads, but there are only 138 unique files. Reading each file's properties once and remembering them, keyed by file path and configuration, cuts the work by two-thirds.

This is an illustration. With reads taking about 0.05 seconds per component in this tool, reading per instance takes 412 × 0.05 = **20.6 seconds**; reading per unique file and reusing the result takes 138 × 0.05 = **6.9 seconds**. For an assembly of 5,000 instances and 900 unique files, the difference is several minutes. The cache must be keyed by configuration as well as file, since two configurations of one part can have different properties.

```figure
type: bars
title: Time to read properties for the drive assembly
unit: s
max: 22
caption: This is an illustration at about 0.05 seconds of reads per component. Caching by file and configuration cuts the reads to the unique count.
- Read every instance | 20.6
- *Read each unique file and configuration once | 6.9
```

## Order and depth

The walk visits components in tree order, which is the order in the feature tree. For a report a person will read, that order is useful: it shows the assembly's structure, and indenting each line by its depth makes the hierarchy visible. For a release tool, order matters for a different reason: sub-assemblies often need their children's drawings released first, so that the sub-assembly drawing's parts list refers to released revisions. The release pack sorts its list of unique files by greatest depth first, so that parts are released before the sub-assemblies that contain them and those before the top assembly.

## Reading from the right configuration

Each component instance points to a file and a configuration of that file. Two instances of the same part can use different configurations, such as two lengths of one shaft. A tool reading properties must read them from the instance's configuration, not the file's default or whatever configuration was last active. The walk records each instance's referenced configuration, and every property read uses it. That is also why the cache's key includes the configuration.

## Walking features as well as components

Some checks need to go below components, into each part's feature tree: finding parts with suppressed features that should not be, counting hole features of a given size, or listing every sheet metal part's thickness. The same recursive pattern applies, one level further: for each unique part file, walk its features, and for features that contain others, such as folders or patterns, walk their children too.

Feature walks multiply the work. A part may have fifty features, so 138 unique files can mean 7,000 features. The cache matters even more here: walk each unique part's features once, never once per instance, and collect only the information the check needs. The release pack's assembly mode does one feature check, that every sheet metal part has a flat pattern, and it walks only parts whose properties say they are sheet metal, which is 21 of the 138.

## A walk that writes

A walk that only reads is safe. A walk that writes, filling a property on every component or changing a material, needs more care, because it changes files the user may not have opened and may not realise are affected.

Four rules keep it safe:

1. **Change each unique file once.** Writing the same property to a bolt file once per instance, 24 times, is slow and can leave the file in an odd state if a save fails partway through.
2. **Save only what changed.** A tool that saves every file it visited updates their dates and, in a vault, may create new versions of hundreds of files that did not change.
3. **Respect read-only and checked-in files.** A file the user cannot write to should be reported, not forced.
4. **Offer a dry run.** Walk, decide what would change, report it and change nothing. The user approves, then the tool repeats the walk and writes.

The release pack's assembly mode writes one property, the release date, to each released drawing, not to the models, and only after the drawing's export succeeds. It does not write to models during a walk at all; Chapter 7's property tool does, with a dry run.

## Missing and broken references

Sometimes a component's file cannot be found: it was moved, renamed or deleted outside the CAD program, or it lives on a drive the current seat cannot reach. The assembly still knows the component, and the walk still visits it, but cannot read its properties or open its drawing. A walk should detect these and report them clearly, with the path the assembly expected, rather than skip them silently or stop.

This is an illustration. On its first run against the office's oldest assembly, the walk found three components whose files were missing, all purchased parts whose library folder had been reorganised the year before. The release pack listed them at the top of its report, with their expected paths, and released the other drawings. The library's owner fixed the references before the next release.

## Recording the walk

A walk's raw record, one line per instance with its depth, file, configuration, quantity, state and any message, is worth keeping as a simple table alongside the tool's report. It answers questions nobody thought to ask in advance: how many instances of this bracket are there, which sub-assembly contains that suppressed motor, when did this component's file go missing. The release pack writes the table to the release folder with the drawings, so that each release carries a snapshot of the assembly as it was released.

## Walks on big assemblies

Large assemblies are slow to walk mainly because loading components is slow. Three habits help: open the assembly in the lightest mode that still lets the tool read what it needs; resolve lightweight components only when the tool needs data they do not have loaded; and report progress, by instance count, so that the user knows the tool has not hung. For an assembly that takes minutes to walk, a dry-run option that walks and reports without changing anything lets the user check the counts before committing to a long release.

## Exercise: counting for a variant

A customer orders two drives, one with the guard and one without. The drive's top assembly has a configuration for each. In the configuration with the guard, the walk finds 168 fastener instances; without, 152. The purchasing list should cover both drives. How many fasteners should it list, and how should the tool get there?

**Worked answer.** One drive with the guard needs **168** fasteners and one without needs **152**, so the order needs 168 + 152 = **320**, grouped by fastener file.

The tool should walk the assembly twice, once in each configuration, skipping suppressed instances each time, and add the two counts file by file. It should not walk once in the guard configuration and double it, which would give 336, sixteen too many, nor walk the file regardless of configuration, which would count the guard's fasteners twice as well. Each total should be checked against the parts list for its configuration before the two are added.
