---
book: railway-clearances-by-the-numbers
chapterSlug: the-space-a-train-needs
order: 1
title: "The space a train needs"
description: "Learn the outlines that make up a railway clearance, from the vehicle's static outline through the kinematic envelope and safety margin to the structure gauge, and who is responsible for each."
draft: false
---

A train does not run in a slot cut exactly to its shape. It runs through a larger, invisible space that allows for everything that makes a moving vehicle occupy more room than a stationary one, and for everything that makes real track differ from its design. Railway engineers call that space transit space, and the rules that define it are clearances. Before any calculation, it pays to be clear about the outlines involved, because most clearance mistakes start with confusing one outline for another: treating a vehicle's drawing as if it were the space it needs, or treating a structure gauge as if it were the train.

This chapter sets out the outlines, from the vehicle outward, the vocabulary used for them, why each layer exists, and who is responsible for which. It introduces the running case, a new road overbridge over a curved main line, which the rest of the book works through.

## Outlines from the vehicle outward

A railway clearance is built up as a series of nested outlines, each drawn on a cross-section of the track and each larger than the one inside it.

```figure
type: layers
title: The nested outlines of a railway clearance, from the vehicle outward
caption: General description for teaching. Names vary between railways and documents; the governing standard for the line defines the terms and the values.
- Static rolling stock outline | the largest cross-section a vehicle or load may have, standing on level, straight track
- Kinematic envelope | the space the vehicle can occupy while moving, allowing for curve throw, cant, sway, bounce, wear and track errors
- *Safety clearance margin | a further gap so that small unforeseen errors do not cause contact
- Service space | room beyond the margin for maintenance, access, drainage, electrification and future needs
- Structure gauge | the outline that structures must stay outside, combining all of the above for the line
```

The static rolling stock outline is the vehicle as drawn: the largest width and height any part of a vehicle or its load may have, measured on level, straight track with the vehicle standing still. Rail infrastructure managers publish a set of approved outlines, and rolling stock must be built within one of them. ARTC's Transit Space Standards, BDS 11, list the outlines approved for the NSW network at the time of its 2005 issue, from non-electric and narrow electric vehicles to wide electric vehicles and an ANZR ultimate vehicle.

The kinematic envelope is the space that vehicle sweeps when it moves over real track. On a curve, its middle swings inside the curve and its ends swing outside. On canted track, it leans. It sways on its springs, bounces, and moves sideways within the play between wheels and rails, and its wheels and the rails wear. The track itself is never exactly where the design put it. The kinematic envelope adds all of these to the static outline. In BDS 13's terms, it is the furthest the moving vehicle's outline can be displaced, measured from the track centreline and from rail level.

Beyond the kinematic envelope lies a safety clearance margin, a gap that no part of a structure or another train should enter, so that an unforeseen combination of errors does not lead to contact. Beyond the margin, the infrastructure manager may require service space: room for overhead wiring masts, for track machines, for drainage, for people to walk, and for track to be lifted in future maintenance. The structure gauge, finally, is the outline that combines all of these into the space a structure must not enter for that line.

## Why each layer exists

Each layer answers a different question, and confusing them leads to errors in both directions.

```figure
type: compare
title: What each outline answers, and the error of confusing it
cols: Question it answers | Error if confused
caption: General summary for teaching.
- Static outline | how big may the vehicle be? | using it as a clearance leaves no room for movement or track error
- Kinematic envelope | how much room does the moving vehicle need? | using it as the structure line leaves no margin
- Safety margin | how much protection against the unforeseen? | spending it on service needs leaves none for safety
- Service space | what room does the railway need to operate and maintain itself? | omitting it blocks access, electrification or track lifting
- *Structure gauge | where may a structure stand? | treating it as a fixed width ignores curve and cant effects
```

The most common error in design work outside the rail industry is to place a structure just outside the vehicle's drawing, forgetting that the moving vehicle needs much more room, especially on curves and canted track. The opposite error, more common inside the industry, is to treat a structure gauge dimension measured on straight track as if it applied everywhere, forgetting that it must be increased on curves, as Chapters 3 and 4 explain.

## Rail level and the future track

Clearances are measured from the track: laterally from the track centreline, and vertically from the top of the rail. But the rail does not stay at one level. Track is lifted during resurfacing, when new ballast is placed under it, and over its life it may be raised several times. A structure designed to clear today's rail level may not clear tomorrow's.

ARTC's Transit Space Policy, BDS 09, sets a maximum rail level, the top of the range the rails are ever allowed to reach, 150 mm above the graded rail level, which is the approved design level. Vertical clearances in that system therefore include an allowance for future track lift. A bridge designer who measures height from the existing rail head and forgets the allowance designs a bridge that will be too low the first time the track is resurfaced.

## Who is responsible

Clearance is a shared responsibility, and the documents divide it clearly. The infrastructure manager sets the transit space for each corridor, decides which rolling stock outlines and loads may run on it, and approves any structure or track change that affects it. Operators must keep their vehicles and loads within the approved outlines and seek approval for anything larger. Designers of structures near the track must keep them outside the structure gauge, or seek a formal approval of any infringement. Maintainers must keep the track within the tolerances the kinematic envelope assumes, and record changes. ARTC's Transit Space Policy assigned these roles to corridor managers, operators and its standards engineers for infrastructure and rolling stock.

## Corridor by corridor

Not every line needs the same space. A line used only by narrow freight wagons needs less than one carrying wide electric passenger trains; a line that will be electrified needs vertical space for overhead wiring that a non-electrified line does not. The NSW Transit Space Handbook required a corridor strategy for each line: a statement of which rolling stock and loading outlines, which service clearances and which track centres applied, driven by the business needs of the line's users. A designer working on a particular structure must therefore start by finding out which strategy, or which equivalent requirement, applies to that corridor, rather than taking a value from a general table.

## Static, dynamic and the speed of the train

The kinematic envelope depends partly on speed. A vehicle running fast sways and bounces more than one running slowly, and on canted track a fast vehicle leans out against the cant while a slow one leans in. BDS 13 noted that its calculated envelope assumed maximum vehicle speed on typical track condition, and that roll and bounce may be reduced by limiting speed. That is why speed restrictions are a common condition when a structure or load comes close to the limit: they reduce the dynamic movements and buy back some of the margin.

## Clearance in other codes

The same ideas appear in every railway's clearance rules, though the names and values differ. ARTC's Track and Civil Code of Practice for SA, WA and Vic describes clearance outlines as a static rolling stock outline, a maximum kinematic rolling stock outline and route-specific structure outlines, with a contingency gap between the kinematic outline and the structure. It states a principle worth remembering: no minimum clearance should be used in a particular situation if more clearance can be provided. Minimum values are floors, not targets.

## How a clearance is measured

A clearance is a distance on a cross-section of the track, and it only means something if everyone measures it the same way. Lateral clearances are measured horizontally from the track centreline, the line midway between the two rails, to the nearest point of the structure at a stated height. Vertical clearances are measured from a stated rail level, usually the top of the higher rail on canted track or the design rail level, upward to the underside of the structure. On curves and canted track, the reference matters: a structure on the inside of a curve is measured from the centreline but approached by a vehicle leaning towards it, and the vertical clearance under a bridge on canted track depends on which rail it is measured from.

```figure
type: steps
title: Recording a clearance measurement at a structure
caption: General practice for teaching. The infrastructure manager's survey procedures set the exact method and datum.
- Locate | kilometrage, track name and which side of the track the structure is on
- Reference | track centreline for lateral offsets; stated rail and rail level for heights
- *Measure | offset at several heights, and height at several offsets, across the structure's face
- Record the track | curve radius, cant and any track position marker at the structure
- Compare | measured points against the structure gauge for that location, increased for curve and cant
```

A single offset at one height rarely describes a structure. A bridge pier's face may lean, a tunnel wall curves, a signal head projects at one height only. The measurements are taken at enough heights and offsets to show where the structure comes closest to the transit space, which on a curve may not be where it looks closest.

## Clearance is used up from both sides

The space between a structure and the kinematic envelope is reduced by anything that moves either one: the track shifting towards the structure, cant being increased during resurfacing, a vehicle with worn suspension rolling further than assumed, a structure leaning or being extended. Each of these is small, but together they can consume the margin. The outlines in this chapter are only as good as the maintenance that keeps the track and vehicles within the tolerances assumed, and the records that show when something has changed.

## Transit space as a corridor asset

It helps to think of transit space as an asset the railway owns, like its rails and bridges. Every structure built close to the track, every increase in cant, every taller or wider vehicle uses some of it, and once used, it is very expensive to win back: lowering track under a bridge, rebuilding a tunnel or moving a platform costs far more than building them with room to spare in the first place. That is why infrastructure managers guard it carefully and why the approval of anything that reduces it is held at a senior level.

## The running case: the overbridge

This is an illustration. A regional council is replacing an old timber road bridge over a single standard gauge main line with a new concrete overbridge. At the bridge, the line is on a 400 m radius curve with 60 mm of cant, and a passing loop begins about 150 m away, with a short industrial siding beyond it. The council's consultancy must decide how far apart the bridge's piers must be and how high its deck must be, provide for a long retaining wall on one approach, and later check a transformer move under the new bridge.

The consultancy's first step is not a calculation but a request to the rail infrastructure manager for the corridor's clearance requirements: the rolling stock outlines that apply, the service dimensions required, whether electrification must be allowed for, the design rail level and any future track lift, and the approval process for the bridge. Chapter 6 shows how those requirements turn into the bridge's dimensions.

## Checking the vehicle, not just the bridge

A clearance check has two sides. The structure must clear the transit space, and the vehicles must stay within their outlines. A clearance problem may be caused by either: a structure built too close, or a vehicle or load that is larger than its approved outline. Rolling stock is checked when it is designed and registered for a network; unusual loads are checked before each move, as Chapter 9 explains. The consultancy's bridge design assumes that only approved rolling stock and loads will pass under it, which the operators and the infrastructure manager must ensure.

## A failure: the drawing as the clearance

This is an illustration. A designer at another firm, new to rail work, placed a footbridge stair support 1.65 m from the centre of a curved track, just outside the half-width of the widest vehicle on the line as drawn on its outline diagram. The design review caught it: the moving vehicle, on that curve and with its sway and the track's tolerances, needed far more room, and the support would have been inside the kinematic envelope.

The designer had used the static outline as if it were a clearance. The support was moved well clear, to the structure gauge the infrastructure manager required for the corridor, increased for the curve. The firm now gives every new designer a one-page summary of the nested outlines before they work near track.

## Exercise: naming the layers

This is an illustration. A designer is told that, at a particular location, the vehicle's static half-width is 1,600 mm, the kinematic envelope extends to 1,860 mm from the track centreline, the required safety margin is 200 mm, and the corridor requires a further 2,240 mm of service space for road access beside the track. What is the minimum distance from track centreline at which a structure may stand? Which part of the distance protects safety, and which serves operations?

The kinematic envelope reaches 1,860 mm. Adding the 200 mm safety margin gives **2,060 mm**, the minimum for safe passage. Adding the 2,240 mm of service space gives **4,300 mm** from the track centreline, the minimum for this corridor's requirements.

The distance from 1,600 to 1,860 mm allows for the vehicle's movements and the track's errors; from 1,860 to 2,060 mm is the safety margin; and from 2,060 to 4,300 mm is service space for access. Only the first 2,060 mm protects the safe passage of the train; the rest serves the railway's operation and maintenance, and may be reduced only with the infrastructure manager's approval, never at the expense of the safety margin. This is an illustration: the governing standard sets the real values for each line.
