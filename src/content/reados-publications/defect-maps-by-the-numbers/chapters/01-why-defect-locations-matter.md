---
book: defect-maps-by-the-numbers
chapterSlug: why-defect-locations-matter
order: 1
title: "Why defect locations matter"
description: "Why a tally of defect types hides causes that a map of defect positions reveals, how to record positions on parts, the kinds of defect map, and what rework is costing."
draft: false
---

A defect tally sheet records what went wrong and how often: so many dust inclusions, so many craters, so many thin patches. It is the standard first step in quality improvement and it is useful, but it throws away the one piece of information that most often points straight at a cause, which is where on the part each defect was. A dust speck on the top edge of a panel and one in the middle of it are the same entry on a tally sheet. On a map, a hundred of them gathered under the hanging hooks tell their own story.

This chapter explains why defect positions carry information, how to record them without slowing production, the main kinds of defect map and how to put a cost on the problem. Its error is a purchase made on the strength of a tally that a map would have redirected.

## Defects as points

For most surface and coating defects, the defect is small compared with the part: a speck of dirt a fraction of a millimetre across on a door 800 mm wide. For analysis it can be treated as a **point**, with a position and perhaps a few attributes such as type and size. A set of such points on a part, or on many parts laid over each other, is what statisticians call a **spatial point pattern**, and there is a well-developed body of methods for asking whether such a pattern is random, clustered or regular, and at what scale.

The same methods apply far beyond coatings. Porosity on the machined faces of castings, spatter on welded assemblies, voids in printed circuit board solder joints, inclusions on rolled sheet, faults on a semiconductor wafer, and scratches on polished panels have all been mapped and analysed as point patterns. Wherever a defect has a position, the position can be studied.

### Why position points to cause

Most physical causes of defects act locally. Contamination falls from something above the part, so it lands below that thing. A worn nozzle, a blocked filter or a dirty electrode affects the region it serves. Heat flows from somewhere and leaves its mark in a pattern. A part's own geometry, its edges, holes and corners, shapes how coating, metal or fluid reaches it. Because causes have places, defects caused by them have places, and a pattern that lines up with a feature of the process is very strong evidence. A tally can say that dust is the biggest problem; a map can say which dust.

## The case: doors that need rework

Plant E's powder-coating line ran with about one door in ten needing rework for years. After the line was moved into a new building, the rework rate rose to about one in four, and with 1,500 doors a week passing through the line, that is a costly change. Rework means sanding the defect, re-hanging the door and passing it through the booth and oven again, and the plant's costing puts that at A$38 per door in labour, powder, energy and lost line capacity.

The [scrap cost impact tool](/tools/scrap-impact/) estimates the units and direct cost lost to scrap from the number of units produced, the cost per unit and the scrap rate. For a rework problem the same arithmetic applies if the cost per unit is the cost of reworking a door rather than of scrapping it. The tool rightly asks for the cost accumulated at the point where the loss occurs and for a scrap rate measured over a representative period. Its "good output" line counts doors that pass first time; reworked doors are recovered rather than lost, so for this purpose only the cost line matters.

```figure
type: stats
title: What rework is costing Plant E
caption: This is an illustration. From the scrap cost impact tool, with the rework cost of A$38 per door entered as the cost per unit. The difference between the old and new rework rates is the prize for finding the cause.
- 1,500 | doors a week through the line
- 26% | share needing rework after the move
- A$14,820 | weekly cost of rework at 26%
- A$5,700 | weekly cost at the old rate of 10%
```

The difference, over A$9,000 a week or close to half a million dollars a year, justified a proper study. The quality engineer, who had a tally sheet but no map, began by asking the inspectors what they were finding.

## What the tally said

The inspectors' tally over the previous month classified the defects that sent doors to rework by type.

```figure
type: bars
title: Rework defects by type, the month before the study
unit: % of defects
caption: This is an illustration. The tally from the inspection station. Dust and dirt inclusions dominate, which is common in powder coating and says little about where the dust came from.
- * Dust and dirt inclusions | 61
- Craters | 15
- Thin film or poor coverage | 9
- Orange peel or texture | 7
- Damage in handling | 5
- Other | 3
```

Dust and dirt inclusions, specks embedded in the cured film, made up 61% of the defects. In a new building, with new air handling, dust from the building seemed the obvious source.

## The error: buying filters for the wrong dust

Before any mapping was done, the maintenance team replaced the booth's supply air filters with a finer grade and added filter mats at the building's roller doors, at a cost of A$4,200. Over the next two weeks the rework rate fell from 26% to 25%, which was within the normal week-to-week variation. The dust had not been coming through the filters.

The engineer then asked the inspectors to record the position of every defect on every door for two weeks. The resulting map, described below, put almost two fifths of the defects in the top 200 mm of the door, most of them under the two hanging hooks. The specks there were not building dust: under a magnifier they were small flakes of cured powder, the same colour as the coating. Cured powder builds up on the hooks with every pass through the oven, and as the doors swing and bump on the conveyor, flakes break off and fall onto the face of the door below, into the wet powder, where they are cured in.

The filters were not wasted, since cleaner air does no harm, but they were bought to cure a cause that a map would have ruled out in two weeks. A tally can rank defect types; it cannot say which of several possible sources is responsible. Position can.

## Recording positions

Recording positions sounds slow. With a little preparation it adds only a few seconds to each inspection.

```figure
type: steps
title: Plant E's procedure for mapping defects on doors
caption: This is an illustration. A transparent template laid on each door at the inspection station gives a position to the nearest 50 mm cell without measuring. Recording takes about 20 seconds a door.
- Fix the coordinate system | origin at the top left corner of the outer face, x across and y down, in millimetres
- Make a template | clear acrylic sheet the size of the door, printed with 50 mm grid lines and 200 mm heavy lines
- Record each defect | door number, cell (column letter and row number), type, size class
- Record the context | date, shift, hook pair and conveyor position, booth gun settings
- * Keep every door | including doors with no defects, which are the denominator for every density and yield
```

Three details matter more than they seem.

- **The coordinate system must be fixed to the part, not the inspector.** Doors are inspected at different orientations; recording relative to the top left corner of the outer face, as the door hangs on the line, makes every map comparable.
- **Doors with no defects must be recorded.** A map of defects alone shows where defects are, but the rate per door, the yield and every statistical test need the total number of doors inspected. Plant E's sheet has one line per door, with a "nil" entry when the door is clean.
- **Defect type and size should be recorded with position.** Different types often have different causes and different patterns, and mixing them can hide both.

The 50 mm cell resolution is a compromise. It is quick, and for causes acting on the scale of hooks and gun paths it is ample. For finer questions, such as whether craters cluster within a few millimetres of each other, positions can be measured to the millimetre on the few doors that need it, as Chapter 5 does.

### Defects that are not points

Some defects are lines or areas rather than points: a scratch, a run or sag, a patch of thin film or orange peel. They can still be mapped, but a decision is needed about how. A common choice is to record a line defect by its two ends and an area defect by its centre and approximate size, then to analyse their centres as points while keeping the size for later. For questions about where the defects start, such as which way scratches run from an edge or whether sags begin below a particular hole, the starting point is more informative than the centre. The choice should be fixed before mapping starts and noted on the sheet.

### What to map first

Mapping every defect type on every part is rarely necessary. Start with the defect type that costs the most, which the tally sheet already shows, and with enough parts to give a few hundred defects of that type, since patterns in a few dozen points are hard to distinguish from chance. Plant E mapped all types at once because the inspectors found it no harder than mapping one, and because the engineer did not yet know whether the dust, the craters and the thin film had one cause or several. On a line where one defect type dominates and recording is slower, mapping that type alone for two weeks is a sensible first step.

## Kinds of defect map

The same data can be drawn in three ways, each answering a different question.

- A **dot map of one part** shows every defect on that part. It is the raw evidence and the right view for a single bad part, but most parts have only a few defects, so single dot maps are sparse.
- A **composite map** overlays the defects of many parts in the same coordinates, assuming the parts are nominally identical and inspected in the same orientation. It shows where defects tend to occur. It cannot show whether defects on one part cluster together, because points from different parts are mixed.
- A **grid count map**, sometimes drawn as a heat map, divides the part into cells and counts the defects in each cell across all parts. It is the composite map summarised, and it is the starting point for the tests in Chapter 4.

A fourth summary, the **count of defects per part**, ignores position entirely but keeps the parts separate. It answers questions about yield, which depend on how defects are shared out between parts, and Chapters 2 and 7 rely on it.

## The first composite map

Over two weeks, the inspectors mapped 400 consecutive doors. Of these, 296 had no defects on the outer face; the other 104 carried 220 defects between them. Divided into 200 mm cells, four across and six down, the composite map showed the pattern clearly.

```figure
type: bars
title: Defects in each 200 mm row of the door, 400 doors
unit: defects
caption: This is an illustration. The top row, the 200 mm band nearest the hanging hooks, holds 82 of the 220 defects, more than three times the number in any other row. The two top corner cells, directly under the hooks, hold 26 and 27.
- * Row 1, 0 to 200 mm from the top | 82
- Row 2, 200 to 400 mm | 24
- Row 3, 400 to 600 mm | 31
- Row 4, 600 to 800 mm | 29
- Row 5, 800 to 1,000 mm | 25
- Row 6, 1,000 to 1,200 mm | 29
```

The top row covers one sixth of the door but holds 37% of its defects. The remaining five rows look roughly even, with counts between 24 and 31. That first impression, a hot band at the top and roughly random scatter elsewhere, is exactly what the later chapters test: whether the lower rows are consistent with random scatter, how strong the concentration at the top is, and what it means for the yield.

### What the map does not yet say

A composite map of 400 doors is strong evidence of where defects tend to fall, but it leaves three questions open. It does not say whether the defects on any single door are clustered together, because the composite mixes doors. It does not say whether the apparent evenness of the lower rows is real or would be expected by chance. And it does not separate defect types, which may have different patterns hidden under the total. The following chapters take these questions in turn, starting in Chapter 2 with the counts on individual doors.

## How this applies to a small Australian business

If you count defects, start recording where they are. A printed outline of the part on the inspection sheet, or a transparent template, costs almost nothing, and two weeks of mapped defects will often point to a cause that months of tallies have not. Record clean parts as well as defective ones, fix the coordinate system to the part, and keep defect types separate. Then cost the problem, so that the effort of mapping and fixing is weighed against something real.

## Exercise: paying for clean hooks

Plant E can have its hooks stripped of cured powder by a contractor every week for A$1,600 a week, or buy a second set of hooks and strip them in-house, at a cost the plant estimates at A$900 a week including the hooks' depreciation. The engineer expects clean hooks to remove most of the defects in the top row. (a) Using the scrap cost impact arithmetic, what weekly cost does a fall in the rework rate from 26% to 16% save, on 1,500 doors at A$38? (b) Which hook option pays, and by how much each week?

**Worked answer.** (a) At 26%, rework costs 1,500 × 0.26 × 38 = A$14,820 a week; at 16% it costs 1,500 × 0.16 × 38 = A$9,120. The saving is **A$5,700 a week**. (b) **Both** pay: the contractor nets A$5,700 − 1,600 = **A$4,100 a week**, and the in-house option nets A$5,700 − 900 = **A$4,800 a week**. The in-house option is better by A$700 a week if the plant has the labour and space; either is far better than the filters, which saved almost nothing. The expected fall to 16% is itself an estimate, which Chapter 8 makes properly from the map.
