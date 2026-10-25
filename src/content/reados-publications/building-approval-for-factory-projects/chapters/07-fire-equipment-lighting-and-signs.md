---
book: building-approval-for-factory-projects
chapterSlug: fire-equipment-lighting-and-signs
order: 7
title: "Fire equipment, emergency lighting and exit signs"
description: "Work out which hydrants, hose reels, extinguishers, sprinklers, emergency lights and exit signs the NCC requires in each compartment, and why each trigger applies."
draft: false
---

Fire equipment is where the class, the compartments and the occupant numbers from earlier chapters come together. Most triggers in Part E1 of NCC 2022 Volume One depend on floor area, compartment size, class or effective height, so a project that has settled those answers can read off most of its equipment list. The rest depends on what the business actually does: what it stores, what it burns and where its switchboards are.

This chapter builds the running case's equipment list compartment by compartment, then adds the emergency lighting and exit signs from Part E4. It also covers the requirements during construction, which apply before anyone moves in.

## What the Performance Requirements ask for

Part E1 has Performance Requirements for each kind of equipment. In summary:

- **E1P1:** fire hose reels, to the degree necessary for occupants to attack a fire, appropriate to the compartment size, use, other fire safety systems and fire hazard.
- **E1P2:** fire extinguishers, to the degree necessary for occupants to attack a fire, appropriate to the use, other systems and hazard.
- **E1P3:** fire hydrants, to the degree necessary for fire brigade operations, appropriate to the floor area and hazard, where a brigade is available.
- **E1P4:** automatic fire suppression, to the degree necessary to control fire development and spread, appropriate to compartment size, use, hazard and height.

The Deemed-to-Satisfy Provisions in E1D2 to E1D16 turn those outcomes into triggers. Each trigger is a threshold, so the running case simply works down the list.

## Fire hydrants

Under E1D2, a fire hydrant system is required where a building has a total floor area greater than 500 m² and a fire brigade station equipped to use hydrants is not more than 50 km away by road. The system must comply with AS 2419.1, at the edition the NCC calls up.

This is an illustration. The running case building has a total floor area of 1,800 m², plus the mezzanine, and the regional fire station is 4 km away by road. Both conditions are met, so a hydrant system is required. Being split into two compartments by the fire wall does not change this, because the trigger is the building's total floor area.

The building already has a hydrant system from its warehouse approval. The certifier asked the hydraulic engineer to assess it against the standard called up by NCC 2022 for the new work, including coverage of the new layout and the condition of the water supply. A street hydrant outside the gate is part of the water supply picture, but whether it provides the required coverage is a design question under AS 2419.1, not something to assume. The owner's estimator had assumed "the street hydrant covers us", which is the error this paragraph exists to prevent.

## Fire hose reels

Under E1D3, hose reels are not required in some building types, including Class 2, 3 and 5 buildings. Where they are required, they must be provided throughout the building where internal hydrants are installed and, otherwise, in any fire compartment with a floor area greater than 500 m². They are installed to AS 2441. E1D3 also says where they go: next to internal hydrants (but not inside a fire-isolated exit), within 4 m of an exit, or, where needed for coverage, along paths of travel to an exit. A hose must not pass through fire doors or smoke doors, apart from the listed cases.

For the running case:

- **Office compartment.** Class 5, so hose reels are not required by E1D3.
- **Workshop compartment.** Class 8, 1,500 m² plus the mezzanine, well over 500 m², so hose reels are required.

The designer placed hose reels within 4 m of each of the three workshop exits, P1, P2 and P3, and checked coverage of the whole workshop floor and the mezzanine against AS 2441. An early layout had one hose reel inside the office near the fire wall door, intended to "cover both sides". That fails twice: the office does not need one, and the hose would have to pass through a fire door in the fire wall to reach the workshop.

## Portable fire extinguishers

E1D14 lists where portable extinguishers are needed, with the type of risk defined by AS 2444, and requires them to be selected, located and distributed under that standard. In a Class 2 to 9 building, extinguishers are required for:

- Class AE or E risks at emergency switchboards;
- Class F risks involving cooking oils and fats in kitchens;
- Class B risks where more than 50 L of flammable liquids is stored or used;
- Class A risks in normally occupied fire compartments of less than 500 m² that are not provided with hose reels;
- Class A risks in Class 2, 3 or 5 buildings and Class 4 parts, among other listed cases.

```figure
type: svg
title: Extinguisher triggers in the running case, NCC 2022 E1D14
alt: Extinguisher triggers in the running case, NCC 2022 E1D14. Class A risk: Office compartment, Class 5 required for a Class 5 building; Workshop compartment, Class 8 covered by hose reels; not triggered. Class B, over 50 L of flammable liquid: Office compartment, Class 5 none stored; Workshop compartment, Class 8 80 L of solvents and thinners: required. Class E or AE, emergency switchboard: Office compartment, Class 5 none in this compartment; Workshop compartment, Class 8 main switchboard: treated as one, to confirm. Class F, cooking oils in a kitchen: Office compartment, Class 5 kitchenette has no fryer: not triggered; Workshop compartment, Class 8 none
caption: This is an illustration. The risk classes and the selection and location of extinguishers follow AS 2444, which is not quoted here.
viewbox: 0 0 640 278
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="52" rx="4"/>
<text class="txb" x="223.6" y="31">Office compartment,</text>
<text class="txb" x="223.6" y="50">Class 5</text>
<text class="txb" x="421.2" y="31">Workshop compartment,</text>
<text class="txb" x="421.2" y="50">Class 8</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 112H620"/>
<text class="txb" x="28" y="83">Class A risk</text>
<text class="tx" x="223.6" y="83">required for a Class 5</text>
<text class="tx" x="223.6" y="101">building</text>
<text class="tx" x="421.2" y="83">covered by hose reels; not</text>
<text class="tx" x="421.2" y="101">triggered</text>
</g>
<g class="kf-a kd3">
<rect class="bxa" x="20" y="112" width="600" height="52" rx="4"/>
<path class="lf" d="M20 164H620"/>
<text class="txb" x="28" y="133">Class B, over 50 L of</text>
<text class="txb" x="28" y="152">flammable liquid</text>
<text class="tx" x="223.6" y="133">none stored</text>
<text class="tx" x="421.2" y="133">80 L of solvents and</text>
<text class="tx" x="421.2" y="151">thinners: required</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 216H620"/>
<text class="txb" x="28" y="185">Class E or AE,</text>
<text class="txb" x="28" y="204">emergency switchboard</text>
<text class="tx" x="223.6" y="185">none in this compartment</text>
<text class="tx" x="421.2" y="185">main switchboard: treated</text>
<text class="tx" x="421.2" y="203">as one, to confirm</text>
</g>
<g class="kf-a kd5">
<path class="lf" d="M20 268H620"/>
<text class="txb" x="28" y="237">Class F, cooking oils</text>
<text class="txb" x="28" y="256">in a kitchen</text>
<text class="tx" x="223.6" y="237">kitchenette has no fryer:</text>
<text class="tx" x="223.6" y="255">not triggered</text>
<text class="tx" x="421.2" y="237">none</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="258" rx="4" fill="none"/>
<path class="lf" d="M215.6 10V268"/>
<path class="lf" d="M413.2 10V268"/>
```

This is an illustration. The owner stores about 80 L of solvents and thinners in a flammable liquids cabinet for degreasing and touch-up painting. That is over the 50 L threshold, so a Class B extinguisher is required for that risk. The quantity also matters under hazardous chemicals rules, which are outside the NCC. Whether the main switchboard counts as an emergency switchboard for E1D14 depends on what it serves, and the certifier was asked to confirm. Either way, the owner's existing extinguisher beside it was a water type left by the previous tenant. Water is unsuitable for electrical risks, and the extinguisher was replaced with a type suited to the risk, as AS 2444 requires.

## Sprinklers: why they are not required here

Sprinklers are the most expensive item on the list, so it is worth showing why the running case does not need them rather than simply leaving them off.

```figure
type: svg
title: Sprinkler triggers checked for the running case
alt: Sprinkler triggers checked for the running case. Question: Does any NCC 2022 trigger apply to this Class 5 and Class 8 building?. Effective height over 25 m, E1D5: effective height is zero, no. Class 6 compartment over 3,500 m² or 21,000 m³, E1D8: no Class 6 part, no. Excessive hazard: compartment over 2,000 m² or 12,000 m³ with hazardous processes or high combustible storage, E1D13: 1,690 m² and 10,125 m³ after the fire wall, no. Large isolated building route, C3D4: not used; the fire wall was chosen instead, no
caption: This is an illustration of the check, not a complete list of every trigger in Part E1. Each trigger was read in the edition that applies.
viewbox: 0 0 640 474
body:
<path class="ln draw" pathLength="1" d="M320 72V88H36V132.5H40"/>
<path class="ln draw" pathLength="1" d="M320 72V163H36V207.5H40"/>
<path class="la draw" pathLength="1" d="M320 72V238H36V309.5H40"/>
<path class="ln draw" pathLength="1" d="M320 72V367H36V420.5H40"/>
<g class="kf-a kd1">
<rect class="bxa" x="40" y="10" width="560" height="62" rx="10"/>
<circle class="fa pulse" cx="62" cy="41" r="10"/>
<text class="txb" x="62" y="46" text-anchor="middle">?</text>
<text class="txb" x="330" y="37" text-anchor="middle">Does any NCC 2022 trigger apply to this Class 5 and Class 8</text>
<text class="txb" x="330" y="56" text-anchor="middle">building?</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="40" y="102" width="580" height="61" rx="8"/>
<text class="txb" x="56" y="126">Effective height over 25 m,</text>
<text class="txb" x="56" y="145">E1D5</text>
<text class="tx" x="316" y="126">effective height is zero</text>
<text class="txa" x="316" y="148">no</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="40" y="177" width="580" height="61" rx="8"/>
<text class="txb" x="56" y="201">Class 6 compartment over</text>
<text class="txb" x="56" y="220">3,500 m² or 21,000 m³, E1D8</text>
<text class="tx" x="316" y="201">no Class 6 part</text>
<text class="txa" x="316" y="223">no</text>
</g>
<g class="kf-a kd4">
<rect class="bxa" x="40" y="252" width="580" height="115" rx="8"/>
<text class="txb" x="56" y="276">Excessive hazard:</text>
<text class="txb" x="56" y="295">compartment over 2,000 m²</text>
<text class="txb" x="56" y="314">or 12,000 m³ with hazardous</text>
<text class="txb" x="56" y="333">processes or high</text>
<text class="txb" x="56" y="352">combustible storage, E1D13</text>
<text class="tx" x="316" y="276">1,690 m² and 10,125 m³ after the fire</text>
<text class="tx" x="316" y="294">wall</text>
<text class="txa" x="316" y="316">no</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="40" y="381" width="580" height="79" rx="8"/>
<text class="txb" x="56" y="405">Large isolated building</text>
<text class="txb" x="56" y="424">route, C3D4</text>
<text class="tx" x="316" y="405">not used; the fire wall was chosen</text>
<text class="tx" x="316" y="423">instead</text>
<text class="txa" x="316" y="445">no</text>
</g>
```

Two of those answers depend on earlier decisions. If the owner had not built the fire wall and had instead used the large isolated building route in C3D4, sprinklers would have been part of the solution. And if the workshop compartment had been larger, high racking of combustible goods could have brought in E1D13. The equipment list is downstream of the compartment decision.

## Emergency lighting

E4D2 sets where emergency lighting is required. For Class 5 to 9 buildings, in any storey with a floor area of more than 300 m², it is required in every passageway or corridor on the path of travel to an exit, in any room over 100 m² that does not open to a lit corridor or space or directly to a road or open space, and in any room over 300 m². It is also required in every required non-fire-isolated stairway. Emergency lighting must comply with AS/NZS 2293.1 under E4D4.

For the running case:

- The storey is 1,800 m², so the Class 5 to 9 rules apply on both sides of the fire wall.
- **Workshop:** the workshop is one room of 1,500 m², over 300 m², so emergency lighting is required throughout it, including under and on the mezzanine.
- **Mezzanine stair:** it is a required non-fire-isolated stairway, so it needs emergency lighting in its own right.
- **Office:** the corridor on the path to the exits needs emergency lighting. The individual offices are under 100 m² and open to the lit corridor, so the corridor lighting serves them.

The shelving on the mezzanine is a detail worth checking. Tall shelving can shadow aisles from emergency luminaires placed for an open floor. The lighting designer checked the mezzanine aisles with the shelving layout, not the empty deck.

## Exit signs and direction signs

Under E4D5, an exit sign is required on, above or next to each door that leads from a storey to a required exit, and on each required exit door in a storey that needs emergency lighting under E4D2, among other locations. Under E4D6, where an exit is not readily apparent to occupants, directional exit signs must be installed to show the way. E4D8 requires exit signs to comply with AS/NZS 2293.1, or Specification 25 for photoluminescent signs, and to be clearly visible to occupants whenever the building is occupied.

In the running case, every workshop and office exit door has an exit sign. Among the machines and on the mezzanine, the exits are not visible from everywhere, so direction signs are placed at aisle junctions. A practical check is to walk the building after the machines and shelving are installed, from each corner, and ask whether a stranger could find an exit sign or a direction sign without searching. The signs that look sufficient on a drawing of an empty building are often hidden behind a machining centre.

## Warning systems and fire control centres

E4D9 requires emergency warning and intercommunication systems in specific cases, including any building with an effective height over 25 m and some Class 3, 9a and 9b buildings. None of those apply to the running case. E1D15 requires a fire control centre in a building with an effective height over 25 m, or in a Class 6, 7, 8 or 9 building with a total floor area over 18,000 m². Neither applies. Recording these as "checked, not required" is still useful: it shows the certifier that the list was worked through.

## Equipment that works on the day it is needed

Every item in this chapter is useless if it does not work when a fire starts. A hose reel with a kinked hose, an extinguisher that has lost pressure, an emergency light whose battery has died or an exit sign hidden behind a new machine all look compliant on the approved drawings. The NCC sets what must be installed. State law and the referenced maintenance standards, such as AS 1851 for routine service of fire protection systems and equipment, set how it must be kept. Chapter 10 covers how NSW turns that into an annual statement by the owner.

Three habits help a small manufacturer keep the equipment honest between formal inspections:

1. **Keep access clear.** Hose reels, hydrants, extinguishers and switchboards need clear floor space in front of them. Paint a box on the floor and treat anything in it as a housekeeping failure.
2. **Re-check after every layout change.** Moving a machine or adding shelving can shadow an emergency light, hide an exit sign or put a hose reel out of reach of a corner. Make the fire equipment layer part of every layout review, alongside the paths of travel from Chapter 5.
3. **Record the reason for each item.** A list that says why each item is there, with its trigger clause, lets the next facilities manager judge what a change in use might add or remove. Without the reasons, people tend to remove equipment that looks redundant and was not.

The running case's compliance file includes a one-page equipment register: each item, its location, its trigger, its standard and its service interval as set by the maintenance contractor. It is the same information as the checklist below, kept in a form the maintenance contractor can use.

## During construction

E1D16 applies while the work is being done. At least one extinguisher suited to Class A, B and C fires and electrical fires must be provided at all times on each storey next to each required exit or temporary stairway. Further requirements for hydrants and hose reels apply once a building reaches an effective height of 12 m, which the running case never will.

Fit-outs in occupied buildings deserve particular care. The workshop's existing hose reels and extinguishers may be isolated or moved during works, and hot work for the mezzanine steel adds ignition sources. The builder's construction fire plan should say which equipment remains in service at each stage.

```figure
type: svg
title: Fire equipment and visibility record for the running case
alt: Fire equipment and visibility record for the running case. Done: Hydrant system to AS 2419.1, E1D2: over 500 m², brigade within 50 km; existing system to be assessed. Done: Hose reels within 4 m of P1, P2 and P3, E1D3: Class 8 compartment over 500 m². Done: Extinguishers: Class A in office; Class B for solvents; E-rated at the main switchboard, E1D14 and AS 2444. Done: Sprinklers not required, E1D5, E1D8, E1D13 checked. Done: Emergency lighting in workshop, mezzanine stair and office corridor, E4D2, AS/NZS 2293.1. Open: Direction signs after machines and shelving are installed, E4D6, to verify on site
caption: This is an illustration. Each item cites the trigger clause and the reason it applies or does not.
viewbox: 0 0 640 456
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Hydrant system to AS 2419.1</text>
<text class="tx" x="64" y="53">E1D2: over 500 m², brigade within 50 km; existing system to be assessed</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="79" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="96" r="11"/>
<path class="la draw" pathLength="1" d="M34 96l4 4 8-8"/>
<text class="txb" x="64" y="99">Hose reels within 4 m of P1, P2 and P3</text>
<text class="tx" x="64" y="120">E1D3: Class 8 compartment over 500 m²</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="146" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="163" r="11"/>
<path class="la draw" pathLength="1" d="M34 163l4 4 8-8"/>
<text class="txb" x="64" y="166">Extinguishers: Class A in office; Class B for solvents; E-rated at</text>
<text class="txb" x="64" y="185">the main switchboard</text>
<text class="tx" x="64" y="206">E1D14 and AS 2444</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="232" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="249" r="11"/>
<path class="la draw" pathLength="1" d="M34 249l4 4 8-8"/>
<text class="txb" x="64" y="252">Sprinklers not required</text>
<text class="tx" x="64" y="273">E1D5, E1D8, E1D13 checked</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="299" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="316" r="11"/>
<path class="la draw" pathLength="1" d="M34 316l4 4 8-8"/>
<text class="txb" x="64" y="319">Emergency lighting in workshop, mezzanine stair and office</text>
<text class="txb" x="64" y="338">corridor</text>
<text class="tx" x="64" y="359">E4D2, AS/NZS 2293.1</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="385" width="600" height="59" rx="6"/>
<circle class="bxi" cx="40" cy="402" r="11"/>
<text class="txa" x="40" y="407" text-anchor="middle">?</text>
<text class="txb" x="64" y="405">Direction signs after machines and shelving are installed</text>
<text class="tx" x="64" y="426">E4D6, to verify on site</text>
</g>
```

## Exercise: more flammable liquid and a smaller room

The owner wants to set up a 120 m² paint preparation room inside the workshop, separated by ordinary walls, and to store 150 L of paints and solvents there. What changes in the extinguisher and emergency lighting requirements?

**Worked answer.** For extinguishers, the room increases the flammable liquid stored above the 50 L threshold, so a Class B extinguisher is required for that risk under E1D14, selected and located under AS 2444 near the room. Hose reels in the workshop still cover Class A risks if their coverage reaches into the room; the AS 2441 coverage must be rechecked with the new walls.

For emergency lighting, the storey is still over 300 m². The room is 120 m², over 100 m², so it needs emergency lighting unless it opens to a corridor or space that has emergency lighting, or directly to a road or open space. If it opens into the lit workshop, the workshop's lighting may serve it, but that should be confirmed with the lighting designer.

The bigger questions lie outside this chapter. A paint preparation area may bring in hazardous chemicals and ventilation requirements, and the certifier may ask whether it changes the fire hazard of the compartment. Take it to the certifier and the owner's WHS adviser before buying the paint.
