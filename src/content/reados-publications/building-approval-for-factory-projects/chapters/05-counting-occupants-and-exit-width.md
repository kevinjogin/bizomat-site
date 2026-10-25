---
book: building-approval-for-factory-projects
chapterSlug: counting-occupants-and-exit-width
order: 5
title: "Counting occupants and sizing exit widths"
description: "Use Table D2D18 to count the people the NCC assumes, see why a machine shop counts ten times denser than fabrication, and size exits and doorways from the result."
draft: false
---

The NCC does not ask how many people you employ. For the Deemed-to-Satisfy Provisions, it tells you how many people to assume, based on the floor area and what the space is used for. Those assumed numbers then drive exit widths, the number of exits in some buildings and, unless a better figure is available, sanitary facilities.

Owners are often surprised by the result. A workshop that will never hold more than 30 people can be counted as holding several times that number. This chapter shows how the count is done, why it can be so high for some industrial uses, and what the result means for exits and doors.

## How Table D2D18 works

Under D2D18 of NCC 2022 Volume One, the number of persons accommodated in a storey, room or mezzanine is found by dividing the floor area of each part by the area per person in Table D2D18 for that use. The floor area used excludes lifts, stairs, ramps and escalators, corridors, hallways and lobbies, service ducts, sanitary compartments and other ancillary uses. D2D18 also allows the number to be found from seating capacity or by another suitable means.

The values relevant to industrial buildings are:

```figure
type: compare
title: Area per person for industrial uses, NCC 2022 Table D2D18
cols: Area per person | Notes
caption: Base values from Table D2D18 of NCC 2022 Volume One. State variations may add or change entries; NSW's variations add entertainment uses and leave these values unchanged.
- *Factory: machine shop, fitting shop or the like | 5 m² | metal or glass working, such as cutting, finishing or fitting
- Factory: fabrication and processing | 50 m² | other than a machine or fitting shop
- Factory: where fixed plant sets the occupancy | as set by the plant | the use of the plant or equipment governs
- Workshop for maintenance staff | 30 m² |
- Office | 10 m² | including document copying
- Storage space | 30 m² |
- Plant room for ventilation, electrical or other services | 30 m² |
- Plant room for boilers or power plant | 50 m² |
- Kitchen, laboratory or laundry | 10 m² |
```

Notice the factor of ten between a machine or fitting shop at 5 m² per person and fabrication and processing at 50 m². The code treats a machine shop as a densely occupied space, with operators at each machine and fitters at benches. A fabrication bay with large workpieces and few people is treated as sparse. Which row you choose changes the answer by an order of magnitude, so the choice must follow how the space will actually be used.

The NCC's guidance also warns that D2D18 is for the Deemed-to-Satisfy calculations and is not intended for other purposes. It is not a staffing standard or a work health and safety limit.

## The running case: counting by area

This is an illustration. With the fire wall from Chapter 4, the office and the workshop are separate compartments, each with its own exits. Each is counted separately.

**Workshop compartment.** The 1,500 m² workshop is laid out as a 600 m² machine shop with CNC lathes and mills, an 840 m² fabrication and assembly area and 60 m² of amenities and circulation. The amenities and circulation are excluded under D2D18. The 190 m² mezzanine is storage.

- Machine shop: **600 ÷ 5 = 120 persons**
- Fabrication and assembly: **840 ÷ 50 = 16.8, rounded up to 17 persons**
- Mezzanine storage: **190 ÷ 30 = 6.3, rounded up to 7 persons**
- Workshop total: **120 + 17 + 7 = 144 persons**

**Office compartment.** The 300 m² office has 220 m² of offices and meeting rooms, a 30 m² kitchen and staff room, and 50 m² of toilets, corridor and lobby, which are excluded.

- Offices: **220 ÷ 10 = 22 persons**
- Kitchen and staff room, at the kitchen rate: **30 ÷ 10 = 3 persons**
- Office total: **25 persons**

The NCC does not state a rounding rule for part persons. Rounding up is the conservative choice and is what the running case does. Record your rounding so that the certifier can see it.

```figure
type: bars
title: Persons assumed in the workshop compartment by use
unit: persons
max: 150
caption: This is an illustration. The machine shop dominates the count because Table D2D18 assumes 5 m² per person there, against 50 m² per person for fabrication and processing.
- *Machine shop, 600 m² at 5 m² per person | 120
- Fabrication and assembly, 840 m² at 50 m² per person | 17
- Mezzanine storage, 190 m² at 30 m² per person | 7
- Owner's expected maximum on a shift | 30
```

## An error that halves the exit width

The estimator's first count used the 50 m² rate for the whole workshop, on the reasoning that "we are a fabrication business". With 1,440 m² of workshop floor after deductions:

**1,440 ÷ 50 = 28.8, rounded up to 29 persons, plus 7 on the mezzanine = 36 persons.**

That count produces a minimum exit width of 1 m in total, as the next section shows, and it would have survived into the drawings if the reviewer had not compared the count with the floor plan. The plan labelled 600 m² of the floor "machine shop" and showed eleven machine tools. The Table D2D18 row for a machine shop is not optional when the plan says machine shop.

The general lesson is that occupant counts should be done on the same marked-up plan as the classification. A count done from a list of areas, without the plan, invites the wrong row.

## Why the code counts by area

It can feel arbitrary for a code to assume 120 people in a machine shop that will hold eleven operators. The logic is that a building outlives its first tenant. The NCC cannot rely on an owner's staffing plan, which changes with every shift pattern, contract and sale of the business, so it ties egress to the floor area and the kind of use. A building approved for a sparse use with narrow exits can become dangerous when a denser use moves in without anyone checking.

Area-based counting also keeps comparisons fair between buildings and between certifiers. Two owners with identical floor plans get the same answer, whatever they say about their workforce. That consistency is part of what makes the Deemed-to-Satisfy Provisions deemed to satisfy: they work for the range of occupants a class of building could reasonably hold.

The price of that simplicity is that some buildings are over-provided for their actual use. In most small industrial buildings, the over-provision is cheap, because the minimum widths are small and doors are already needed for operational reasons. It becomes expensive mainly in large or multi-storey buildings, where wider stairs and more exits take real floor area.

## Counting the mezzanine and other levels

People on a mezzanine leave by a stair and then join the people on the floor below on their way to the exits. Their number is therefore counted on the mezzanine, to size the mezzanine's own stair and path, and again in the total that the ground floor exits must carry. The running case's 144 includes the 7 assumed on the mezzanine for that reason.

The office is different. Because the fire wall makes it a separate compartment with its own exits to open space, office occupants do not pass through the workshop to get out, and the workshop's exits do not need to carry them. If the office's only exit were through the workshop, the workshop exits would have to be sized for 144 + 25 = 169 persons, which raises the aggregate to **1 + 3 × 0.25 = 1.75 m** under D2D8(2), because 69 persons over 100 is three parts of 25. The width would still be easy to provide, but the travel distance and fire separation questions would become more complicated. Designing each compartment to empty directly to open space keeps both the counting and the egress simple.

## Designing for the use you might have next

The owner's growth plan, not the current staffing, is the right basis for a count that will last. Ask what the densest plausible use of each area is over the life of the lease or ownership, and test the exits against it. In the running case, the obvious future change is more machining, which the exercise at the end of this chapter tests. Other plausible changes include converting the mezzanine to an office or training room, which would move it from 30 m² per person to 10 m² per person and triple its count, and putting a lunch room on the mezzanine, which is not a listed use in Table D2D18 and would need agreement on the rate. A few minutes testing these cases now can save a building approval later. Write the tested cases into the compliance file with their results, so that whoever proposes the change in three years can see that it was considered and what it would require.

## Using a lower number

D2D18 allows the number of persons to be determined by another suitable means. Owners naturally ask whether they can use their staff numbers instead of 144. Sometimes a certifier will accept a documented lower number where the space genuinely cannot hold the table's density, for example a machine shop whose layout is fixed by heavy machines with set operator positions. When that happens, the lower number usually becomes a condition of approval or part of a Performance Solution, and it binds the business.

For the running case, the owner chose not to ask. The table's 144 gives a modest exit width that the existing building already provides, so a lower number would have saved nothing and constrained future growth. That reasoning is worth copying: only argue for a lower occupant number when the table's number costs real money, and then only with a clear view of what the lower number will stop you doing.

## From people to exit width

D2D8 sets the minimum width of exits and paths of travel. Each exit and path of travel must be at least 1 m wide, with larger minimums for some health and aged care uses. Above 100 persons, the aggregate width of the exits from a storey must grow with the number of people:

```figure
type: formula
title: Aggregate exit width, NCC 2022 D2D8
formula: 101 to 200 persons: W = 1 m + 0.25 m for each 25 persons, or part, over 100
caption: From D2D8(2) and D2D8(3) of NCC 2022 Volume One. Above 200 persons, W = 2 m plus 0.5 m for each 75 persons or part over 200, or for each 60 persons or part where egress involves a stair or ramp steeper than 1 in 12. Doorways are covered separately by D2D9.
- W | minimum aggregate width of exits, m
- persons | number of persons accommodated, from D2D18
step: Workshop, 144 persons: 144 − 100 = 44, which is 2 parts of 25
step: W = 1 + 2 × 0.25 = 1.5 m in aggregate
step: Office, 25 persons: not more than 100, so each exit at least 1 m
step: Estimator's 36 persons would have given 1 m only
```

The running case workshop has three personnel exits, each with a path at least 1 m wide, so the aggregate is 3 m against a requirement of 1.5 m. The width requirement is met with a large margin, which is useful because Chapter 6 shows that the number and position of the exits are driven by travel distance rather than width.

## Doors, heights and narrowing

Three related clauses complete the picture:

- **Doorways (D2D9).** A doorway in an exit may be up to 250 mm narrower than the required width of the exit, to allow for a standard door frame, and doorways generally need at least 750 mm clear. For a 1 m exit, that means a clear doorway of at least 750 mm. The running case uses personnel doors with about 850 mm clear opening. Handles, door stops and the door leaf itself count as obstructions to clear width.
- **Height (D2D7).** Exits and paths of travel need an unobstructed height of at least 2 m, reducible to 1,980 mm in a doorway. Overhead conveyors, ducting and the underside of the mezzanine are the usual industrial problems.
- **No narrowing (D2D10).** The unobstructed width of a required exit must not decrease in the direction of travel to a road or open space.

## Keeping paths of travel clear after handover

A path of travel is not a line on a drawing. It is a strip of floor that must stay clear while the building is occupied. In a factory, the threats are pallets, bins, hoses, trolleys and work in progress. The common pattern is that the drawing shows a 1 m path between machines, the floor markings follow it for a month, and then a parts trolley lives in it.

Machine layouts create a subtler version of the same problem. A new machine tool arrives, the layout is shuffled to fit it, and the path between two machines shrinks from 1.2 m to 0.8 m. Nobody intended to narrow an exit path, and no single move looked significant. The defence is to treat the required paths as a fixed layer of the factory layout drawing, so that every proposed move is checked against it before the riggers arrive.

The running case marks the required paths of travel on the floor with yellow lines and includes them in the weekly housekeeping check. That is a work health and safety practice rather than a code requirement, but it protects the code compliance the owner paid for.

```figure
type: checklist
title: Occupant and width record for the running case
caption: This is an illustration. Areas are measured on the classification plan; deductions follow D2D18.
- x Machine shop 600 m² at 5 m² per person | 120
- x Fabrication and assembly 840 m² at 50 m² per person | 17, rounded up
- x Mezzanine store 190 m² at 30 m² per person | 7, rounded up
- x Workshop 144 persons, aggregate exit width 1.5 m required | 3 m provided
- x Office 25 persons, each exit at least 1 m | provided
- ? Rounding of part persons agreed with the certifier | to confirm
```

## Exercise: convert the fabrication area to machining

The owner plans to buy more machine tools and convert the whole 840 m² fabrication and assembly area into a machine shop. What is the new occupant number and the minimum aggregate exit width for the workshop?

**Worked answer.** The machine shop becomes **600 + 840 = 1,440 m²**, at 5 m² per person: **1,440 ÷ 5 = 288 persons**. Add the 7 on the mezzanine: **295 persons**.

This is more than 200, so D2D8(3) applies. Egress from the workshop floor does not involve a stair, so the rule is 2 m plus 0.5 m for each 75 persons or part over 200. The excess is **295 − 200 = 95**, which is two parts of 75. The minimum aggregate width is **2 + 2 × 0.5 = 3.0 m**.

The three existing 1 m exits give exactly 3.0 m, so the width would still comply, but with no margin. A fourth exit, or wider doors, would be prudent. The change also alters sanitary calculations if the table numbers are used (Chapter 8), and it is a change in how the space is used that the owner should take to the certifier before the machines arrive.
