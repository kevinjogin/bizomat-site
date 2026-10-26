---
book: quoting-sheet-metal-work-by-the-numbers
chapterSlug: cutting-time
order: 3
title: "Cutting time"
description: "Estimate laser time from cut length, speed and pierces, add sheet handling, price it at the machine rate, check it against the nesting software, and catch a door grille's 60 pierces left out."
draft: false
---

A laser or punch is usually the most expensive machine in a sheet metal shop, priced by the hour, and its time on a job is one of the quote's largest lines. That time is not a mystery. A laser spends most of its cutting time moving its head along the parts' outlines at a speed set by the material and thickness, and the rest piercing the sheet to start each cut and moving between cuts. Loading and unloading sheets adds handling time. All of these can be counted from the drawing and the nest before a single program is written.

This chapter estimates EN-700's laser time from its cut lengths, speeds and pierces, adds sheet handling, prices the result and compares it with the nesting software's own estimate. The running case finds that a first estimate left out the door's ventilation grille, sixty small slots that took more laser time than the rest of the door together.

## What the laser's time is made of

For each part, the laser's time is roughly:

- **cutting**: the total length of every contour, outer edge and internal holes, divided by the cutting speed;
- **piercing**: one pierce to start each separate contour, each taking a fraction of a second to a few seconds depending on the material and thickness;
- **moving**: the rapid moves between contours, short for a well-ordered program;
- **handling**: loading each sheet and unloading its parts and skeleton, per sheet rather than per part.

```figure
type: formula
title: Laser time for a part
formula: time ≈ cut length ÷ cutting speed + number of contours × (pierce time + move time)
caption: This is an illustration with EN-700's illustrative speeds: 10 m/min for 1.2 mm galvanised steel, 6 m/min for 2.0 mm steel, 7 m/min for 2.0 mm aluminium, and 0.5 s per pierce plus 0.3 s of moving per contour.
- cut length | Every outline and hole in the part, m
- cutting speed | For the material, thickness and machine, m/min
- contours | One for the outer edge and one for each hole or cut-out
step: Galvanised parts per enclosure: 12.39 m at 10 m/min = 74.3 s; 13 contours × 0.8 s = 10.4 s; about 84.7 s
step: Steel parts: 3.14 m at 6 m/min = 31.4 s; 15 contours × 0.8 s = 12.0 s; about 43.4 s
step: Aluminium parts, without the grille: 3.67 m at 7 m/min = 31.4 s; 25 contours × 0.8 s = 20.0 s; about 51.4 s
```

Cutting speeds and pierce times depend on the machine, its power, the assist gas and the material's condition. The figures here are **illustrations**; a shop's own machine data, or timed test cuts, give its real speeds. Recording the actual cut time of each nest from the machine's own log, and comparing it with the estimate, keeps the shop's speeds honest over time, as Chapter 10 describes. Machines slow down as their optics age and their gas supply changes, and a speed table set up when the laser was new may be optimistic a few years later.

## The running case: EN-700's cut

This is an illustration. Measured from the flat patterns, EN-700's parts have about 12.39 m of contour in 1.2 mm galvanised steel, 3.14 m in 2.0 mm steel and 3.67 m in 2.0 mm aluminium, counting outer edges, the base's cable cut-out and nut holes, the brackets' and plate's holes, and the door's rivet and stud holes. The back panel's bracket rivet holes are not cut by the laser, because *Sheet Metal Joints by the Numbers* drills them through the bracket at assembly.

Adding the three materials gives about **179.5 seconds** of laser time per enclosure, three minutes, before the door's grille.

## The error: sixty slots left out

This is an illustration. EN-700's door has a ventilation grille in its lower part: sixty slots, each 30 × 3 mm. The estimator, working from the door's outline dimensions, had not counted them. Each slot has a perimeter of 2 × (30 + 3) = 66 mm, so the grille has 60 × 66 = **3.96 m** of cut, more than the rest of the door and cable plate together, and **60** pierces.

At 7 m/min and 0.8 s per contour, the grille takes 3.96 ÷ 7 × 60 + 60 × 0.8 = about **81.9 seconds**, almost as long as all the galvanised parts. Leaving it out understated the laser time per enclosure by about 31%, and the door's own laser time by about 61%. At an illustrative laser rate of A$180 an hour, the grille costs about **A$4.10** per enclosure, about **A$205** across 50.

```figure
type: bars
title: Laser time per EN-700 enclosure, by group of parts
unit: s
max: 100
caption: This is an illustration. The door's 60 small slots take nearly as long as all the galvanised panels, because small features are dominated by pierces and short cuts.
- Galvanised panels | 84.7
- Steel plate and brackets | 43.4
- Door and cable plate, outline and holes | 51.4
- *Door grille, 60 slots | 81.9
```

The review caught it by comparing the estimate's laser time with the nesting software's own time for the trial nest, which included the grille because the software worked from the flat pattern's geometry. The fix was to take every part's cut length and contour count from its flat pattern file, not from its outline dimensions, and to treat any difference between the estimator's figure and the software's as something to explain before the quote goes out.

## Small features cost more than their size

The grille shows a general rule: many small holes and slots cost far more laser time than their area suggests, because each one needs a pierce and a short cut at less than full speed. A part with a few long, straight edges cuts quickly; a part covered in perforations cuts slowly. Drawings with patterns of small holes, louvres, slots and engraving deserve particular attention in a quote, and a designer who can replace sixty slots with a smaller number of larger ones, or with a separate bought-in grille, may save the customer money. That suggestion is worth offering with the quote. A customer who learns, from the quote, that its grille costs four dollars an enclosure to cut may well change it, and will remember which supplier pointed it out.

## Sheet handling

Each sheet must be loaded onto the laser and its parts and skeleton removed. On a manual machine this takes minutes per sheet; on an automated loading system, less. This is an illustration. At about 2 minutes of handling per sheet, EN-700's 46 sheets at 50 off take about 92 minutes, about **1.84 minutes** per enclosure. Handling is charged at the laser's rate, because the laser cannot cut while a sheet is being changed.

```figure
type: stats
title: EN-700 laser time and cost per enclosure at 50 off, ex GST
caption: This is an illustration at A$180 an hour for the laser, including the grille and sheet handling.
- 261.5 s | Cutting and piercing | All parts, including the grille
- 110.4 s | Sheet handling | 46 sheets at 2 minutes, spread over 50
- 6.2 min | Laser time | Per enclosure
- * A$18.60 | Laser cost | Per enclosure at A$180 per hour
```

## Laser time at each quantity

The laser's cutting time per enclosure is the same at every quantity; only the sheet handling changes, because the part-used last sheets are spread differently. This is an illustration. At 20 off, EN-700's 19 sheets give about 6.26 minutes of laser time per enclosure, about **A$18.78**; at 50 off, 46 sheets give about 6.20 minutes, **A$18.59**; at 200 off, 179 sheets give about 6.15 minutes, **A$18.45**. The laser line barely changes with quantity. What does change, and changes a great deal, is the programming and setting up for each batch, which Chapter 7 spreads over the batch.

## Programming

Before anything is cut, each part must be programmed: its geometry imported, its lead-ins and cut order set, and its nest built. For a new job, this is a real cost. This is an illustration. EN-700's nine part types take about 10 minutes each to program and check, and the nests about half an hour more, about **2 hours** in all, a one-off cost for the job at its current revision. A repeat order at the same revision reuses the programs and needs only new nests. A revision that changes a part needs that part reprogrammed. The quote should show programming as a one-off cost, separately from the per-enclosure cutting time, so that a repeat order can be priced without it.

## Speeds, thickness and material

Cutting speed falls steeply as thickness rises, so a part in 3 mm sheet can take several times as long per metre as the same part in 1.2 mm, and the change is not linear. Material matters too: aluminium and copper reflect the laser's light and conduct heat away, and cut differently from steel; galvanised steel's zinc vaporises at the cut edge. Assist gas, oxygen for a fast cut on mild steel, nitrogen for a clean, oxide-free edge on stainless and aluminium, compressed air as a cheaper compromise, changes both the speed and the running cost. A shop's machine rate should include its typical gas consumption, and a job that needs an unusual gas or a slow, high-quality cut should be priced at its actual settings.

## Checking against the software

Nesting and cutting software estimates the cut time for a nest directly, from the actual programmed paths, and it is usually close to the real time. The estimator's own calculation from cut lengths and contours is still worth doing, because it is independent: it can catch a part missing from the nest, a wrong thickness or speed setting, or a feature omitted from a part's file. When the two agree within a few per cent, the figure can be trusted; when they differ, one of them is wrong, and finding out which is part of the quote's review.

## Shortcuts and when they fail

Estimators under time pressure often price cutting from a shortcut: the blank's outline perimeter, or a rate per square metre of sheet, or a time per part based on similar jobs. For plain rectangular panels, these shortcuts are close. They fail exactly where the grille error failed, on parts whose cost is in their internal features. A useful test is to look at each part's flat pattern and ask whether its internal contours, holes, slots, cut-outs and engraving, are a significant share of its total cut length or its number of pierces. If they are, the part needs a proper count. On EN-700, the door is such a part and the back panel is not, and a quick look at the flat patterns says so before any arithmetic is done.

## Subcontracted cutting

A shop without a laser, or with one fully booked, may buy cut blanks from a profile-cutting service. The subcontractor then prices the cutting, usually per sheet or per part, often including material. The estimator's job becomes getting a firm quote from the subcontractor for exactly the parts, quantities and revision being quoted, adding the shop's handling and freight, and deciding what markup, if any, to apply to bought-in work. The counting of cut length and pierces is still worth doing, as a check on whether the subcontractor's price is reasonable and on whether every part has been included in the request. A subcontract quote that comes back noticeably cheap often has a part or a feature missing.

## Punching

A turret punch press cuts differently: it punches holes and shapes with tools, one hit at a time, and nibbles longer outlines with overlapping hits. Its time is roughly the number of hits times the time per hit, plus tool changes and sheet handling. A part with many identical holes punches fast, one hit each; a part with long curved outlines nibbles slowly. A shop with both a laser and a punch chooses between them part by part, and an estimator should price each part on the machine it will actually run on. EN-700's grille slots, all identical, would punch quickly with a single slot tool, about sixty hits, a fraction of the laser's time, which is another option worth considering for repeat orders.

## Edge quality and secondary operations

Cutting is rarely the last operation on an edge. Laser-cut edges may need deburring; laser-cut galvanised steel loses its zinc at the cut edge; aluminium may need its edges dressed where they will be handled. Each of these is a time per metre of edge or per part, and belongs in the quote's cutting line or in a separate finishing line. EN-700's aluminium door is lightly deburred along its edges and grille, about two minutes per door in this illustration, a small time easily forgotten. At the A$95 labour rate of Chapter 8, that is about A$3.17 per door, nearly as much as the grille's laser time itself, and a line of its own in the estimate.

## Exercise: punching the grille

Suppose the fabricator punches the door's sixty slots on its turret press with a single 30 × 3 mm slot tool instead of lasering them, at an illustrative 0.6 seconds per hit, with a 2-minute tool set-up per batch, at a punch rate of A$120 an hour. What does the grille cost per enclosure at 50 off, and how does that compare with the laser's A$4.10?

**Worked answer.** Sixty hits at 0.6 s take **36 seconds** per door, costing 36 × A$120 ÷ 3,600 = **A$1.20**. The 2-minute set-up spread over 50 doors adds 2.4 s per door, about A$0.08. The punched grille costs about **A$1.28** per enclosure, against the laser's A$4.10, a saving of about A$2.82 per enclosure, about A$141 across 50.

The saving is real only if the door can move between machines without much extra handling, and if the punch is free when the job runs. A door lasered for its outline and then moved to the punch for its grille adds a second sheet handling, which can eat much of the saving at small quantities. The estimator should price the route that the job will actually take, and the routing is decided with the production planner, not assumed.
