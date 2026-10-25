---
book: railway-clearances-by-the-numbers
chapterSlug: surveys-and-the-clearance-record
order: 10
title: "Surveys and the clearance record"
description: "Survey structures and track for clearance, check an as-built structure against its envelope, fix the track with datum markers, keep the register that catches change, and bring the book together."
draft: false
---

A clearance calculation is a statement about a particular structure, a particular piece of track and particular vehicles at a particular moment. All three of them change over time. Track is tamped, lined and renewed; structures are extended, repaired and added to; new vehicles are registered and old ones modified; cant is adjusted for new speeds. A clearance that was ample when the structure was built can be quietly eroded by a dozen small changes, none of which seemed to matter on its own. The only reliable defence against that slow erosion is a record: surveys that show where things really are, markers that fix the track's position, and a register that every change is checked against.

This chapter covers how structures and track are surveyed for clearance, how an as-built structure is checked against the envelope, how datum markers hold the track in place, what a clearance register records, and how change is managed. It closes by bringing the book together.

## Surveying for clearance

Clearance surveys measure the position of structures relative to the track: lateral offsets from the track centreline at a series of heights, and heights above rail at a series of offsets, at enough points to describe the structure's face where it comes closest to the transit space. They also record the track at the structure: its curve radius, cant, gauge and position relative to fixed marks.

```figure
type: compare
title: Methods of surveying clearances
cols: How it works | Suits
caption: General description for teaching. The infrastructure manager specifies the methods, accuracy and frequency of clearance surveys.
- Manual offsets | tapes, gauges and levels from the rails to the structure | single structures; checks; small sites
- Total station or survey | instrument survey of rails and structure to common coordinates | new structures; as-built surveys; complex sites
- *Laser profile scanning | a scanner on a trolley or vehicle measures the cross-section continuously | long lengths; tunnels; corridor-wide surveys
- Clearance vehicle | a rail vehicle with gauging arms or scanners runs the route | network surveys; out-of-gauge route checks
```

Modern scanning systems capture the whole cross-section of the corridor along long lengths and compare it automatically with a chosen envelope, showing every point where the margin falls below a threshold. They are fast and thorough, but their results depend on knowing where the track was when they were measured, which is why the track's position and cant are recorded with every survey.

## Checking the as-built structure

The infrastructure manager approved the running case's overbridge on condition that the as-built positions be surveyed. A survey after construction checks the structure against the envelope at its real position, not its design position, because concrete is rarely placed exactly where drawn.

```figure
type: formula
title: As-built check of the running case's inside pier
formula: remaining margin = measured offset − envelope reach at that height − required margin
caption: This is an illustration. The pier face was surveyed 4,312 mm from the track centreline at 4,000 mm height, against a design of 4,300 mm; the envelope reach is from Chapter 5. The service dimension the corridor specified is checked separately.
- Measured offset at 4,000 mm height | 4,312 mm
- Envelope reach at that height | about 1,957 mm
- Safety margin | 200 mm
step: safety check: 4,312 − 1,957 − 200 ≈ 2,155 mm to spare
step: service check: 4,312 mm against the 4,300 mm specified, 12 mm to spare
step: both satisfied; the survey, with the track's position and cant, is lodged with the infrastructure manager
```

The safety margin was never in question at this pier, but the service dimension was close: a pier 20 mm closer than designed would have been a service corridor infringement, needing approval. That is why as-built surveys are required, and why the construction tolerances for structures near track are set tighter than for structures elsewhere.

## Construction tolerances near the track

The as-built check showed why structures near track need tight construction tolerances. A tolerance of ±25 mm on a pier's position, ordinary for many civil works, would have let the running case's pier finish 13 mm inside the service dimension. Designers of structures near the track either specify a construction tolerance small enough that the worst position still clears, or design with enough extra offset that the ordinary tolerance is absorbed. The consultancy chose the first: it specified a tolerance on the pier's formwork of zero towards the track and +25 mm away from it, so that any error in placing the concrete would fall on the safe side. The as-built pier finished 12 mm away from the track, within that tolerance, and the contractor's set-out was checked by an independent survey before each pour so that the result was known before the concrete was placed rather than after.

## Datum markers

The kinematic envelope assumes the track is within its tolerance of its design position. At clearance-critical places, the infrastructure manager may fix the track's position with datum markers: plates or pins set in structures or posts beside the track, with the design offset and level of the track from each marker recorded on it. After any maintenance that could move the track, the track's position is measured from the markers and corrected if it has moved. ARTC's code for SA, WA and Vic called for datum markers at some locations of permanent infringement.

```figure
type: checklist
title: What the running case's clearance register records for the overbridge
caption: This is an illustration of the register entry, modelled on the information an approval and register under ARTC BDS 14 recorded, with the additions this book recommends.
- x Location | line, kilometrage, structure name and number, side of track
- x Track at the structure | curve radius, design cant, measured cant, design and measured track position
- x Structure | surveyed offsets and heights at the critical points, survey date and method
- x Envelope used | critical vehicles and the allowances, with the calculated minimum margin each side and vertically
- x Approvals | any infringement approval, its conditions and register number
- *? Change triggers | what must be rechecked if the track, cant, structure or traffic changes
```

## The register

A clearance register lists, for a corridor, every structure whose clearance is close to the limit, every approved infringement and its conditions, and the surveys behind them. BDS 14 required a register of infringement approvals for each corridor, issued to corridor managers and relevant maintenance staff. The register is useful only if the people who could change a clearance consult it: track maintainers before tamping or realigning, structures engineers before modifying a structure, rolling stock engineers before registering a new vehicle, and planners before approving an out-of-gauge move.

## Managing change

Most clearance losses come from changes that were not checked. A change register, or a rule in each discipline's procedures, triggers a clearance check whenever something that affects the transit space changes.

Track changes include relaying, realignment, changes of cant, ballast lifts and slab track construction. Structure changes include extensions, new attachments such as signs and cables, repairs that add thickness, and new structures nearby. Rolling stock changes include new vehicle types, modifications, and loads larger than before. Operational changes include higher speeds, which may need more cant, and new routes for existing vehicles. For each, the question is the same: does the envelope or the structure move, and if so, what is the margin now?

## Recording the track as well as the structure

A clearance record that shows where a structure is but not where the track was is half a record. If the track later moves, nobody can tell whether the structure has moved or the track has. That is why every clearance survey records the track's position relative to fixed marks, its cant, and the date. Railway Track Geometry by the Numbers covers how track geometry is measured and recorded.

## Corridor upgrades

When a corridor is upgraded, for example to carry double-stacked containers or wider stock, the clearance record shows which structures will infringe the new envelope and by how much, which is the core of the upgrade's cost estimate. NSW's corridor strategy approach asked exactly these questions: what gauge the structures give today, how the rolling stock outlines would change, what is the business advantage, what does altering the infrastructure cost, and can it be done at all. A good record turns an upgrade study from a survey campaign into a query.

## How accurate a survey must be

A clearance survey is a measurement, and every measurement has an uncertainty. A manual offset taken with a tape from a rail head may be good to within 10 mm or so; an instrument survey or a calibrated scanner can be better. Where the margin is large, a 10 mm uncertainty does not matter; where it is close to a limit, it matters a great deal, because a margin measured as 105 mm might really be 95 mm. The infrastructure manager specifies the accuracy needed for clearance surveys, and where a result is close to a threshold, the survey is repeated with a more accurate method before decisions are made. Testing Welded Joints by the Numbers discusses measurement uncertainty in another setting, and the reasoning is the same.

## How often to survey

Not every structure needs surveying every year. The frequency depends on how close the structure is to the limit, how often the track beside it is maintained, and how much the structure might change. A bridge with metres of spare clearance may need checking only when something changes; a tunnel with an approved infringement and track held by datum markers may need its track position checked after every maintenance job and a full survey every few years. Corridor-wide scans by clearance vehicles at intervals catch changes nobody reported. The register sets the frequency for each location, and the survey results update it.

## Digital models of the corridor

Many infrastructure managers now hold three-dimensional models of their corridors, built from scanning, with the track, structures and equipment in common coordinates. A model lets an engineer test a new vehicle's envelope, an out-of-gauge load or a proposed structure against the whole corridor in an afternoon. Its value depends entirely on its currency: a model scanned five years ago does not show the cable bracket installed last month. The model is therefore a tool for the register, not a replacement for it, and it is updated whenever surveys or approved changes add information.

## Handing over the record

A new structure's clearance record belongs to the infrastructure manager, not to the designer who prepared it. At the end of the running case's project, the consultancy handed over the clearance drawings, the envelope calculations for each critical vehicle with the allowances used, the as-built survey with the track's position and cant at the time, and the handrail device positions at the retaining wall, all referenced to the line's kilometrage. The infrastructure manager entered the bridge in its structures register with its minimum margins and change triggers, so that a future track renewal under the bridge, or a proposal to carry taller containers, would be checked against it.

## Who owns each part

Clearance records sit across disciplines. Structures engineers own the structure surveys; track engineers own the track's position, cant and datum markers; rolling stock engineers own the vehicle outlines and registrations; operations owns the out-of-gauge approvals and the conditions issued to trains. The register works only if each discipline updates its part and consults the others' parts before changing anything. Many clearance failures turn out to be failures of that coordination rather than of calculation.

## Bringing it together

This book began with the nested outlines of a clearance: the static outline, the kinematic envelope, the safety margin, the service space and the structure gauge. It worked outwards from the vehicle: the outlines and the vehicle's length and bogie centres, the centre and end throw that curves produce, the lean that cant gives, and the full kinematic envelope with its stack of allowances applied in order. It added the margin and service space to set the running case's piers and deck, worked out track centres and the effect of differences in cant, provided places of safety for people beside a long wall, classified infringements and planned an out-of-gauge move, and finished with the surveys and records that keep the whole system honest.

The numbers throughout point to a few principles. The moving vehicle needs far more room than its outline. Curves and cant add most where structures are high and on the inside. The safety margin is for safety and never for convenience. Every accepted shortfall is approved by someone independent and written down. And every change to track, structure or vehicle is checked against the record, because clearance is lost in small steps that nobody notices until a train touches something.

## A failure: the cable bracket

This is an illustration. A communications contractor fixed a cable bracket to the face of a tunnel wall, 120 mm proud of the wall, to carry a new fibre cable. The tunnel's clearance had an approved infringement with a margin of about 140 mm at that height. Nobody checked the bracket against the register, because the contractor did not know it existed. The next clearance scan of the corridor found the margin at the bracket reduced to about 20 mm, far below the base operating standard.

The bracket was removed that night and the cable rerouted. The infrastructure manager added clearance checks to its process for approving any attachment to structures beside the track, and gave contractors access to the register for the locations they worked in.

## Exercise: track movement at a datum marker

At a clearance-critical structure, the register records a minimum margin of 165 mm to the structure, calculated with the track at its design position. After tamping, the track's offset from the datum marker shows it has moved 18 mm towards the structure. What is the margin now, and what does the register entry suggest should happen? What if it had moved 70 mm?

The margin is reduced by the movement, to about 165 − 18 = **147 mm**, still above 100 mm but further below the 200 mm margin. The track should be lined back to its design position at the marker, as the entry's conditions require, and the movement recorded.

Had the track moved **70 mm**, the margin would be about 95 mm, below the 100 mm base operating standard quoted in Chapter 9, and immediate action would be needed, such as a restriction on wide vehicles or speed until the track is corrected. This is an illustration: datum markers make such movements measurable, which is the whole point of having them.
