---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: roof-loads-fixings-and-wind
order: 7
title: "Roof loads, fixings and wind"
description: "How to estimate the dead load of an array, the wind pressure and uplift on flush-mounted and ballasted modules, the loads on clamps and brackets, and the wind risk to modules during installation."
draft: false
---

A solar array is a large set of flat plates fixed to a roof that was designed before anyone thought of them. The modules add weight, but the bigger structural question is wind. Wind passing over a roof creates suction that tries to peel the modules off, strongest at the edges and corners, and a module that leaves a roof in a storm is dangerous to people and property far beyond the factory. Every fixing between the module and the roof structure must carry that suction with a margin, and so must the roof structure itself.

This chapter estimates the dead load of SF-90 on the workshop roof, the wind pressure and the forces on clamps and brackets for the flush modules, and the ballast needed to hold the annex frames down. It checks a pallet of modules on the roof during installation, and ends with a ballast schedule that treated every frame as if it were in the middle of the array.

## The design must come from the standard and an engineer

Wind actions on Australian structures are set by AS/NZS 1170.2, which gives regional design wind speeds, multipliers for terrain, shielding, topography and height, and pressure coefficients for roofs and roof-mounted equipment. The array and its fixings must be designed to it, and the roof structure checked, by a qualified structural engineer. The numbers in this chapter use an assumed design wind speed and assumed pressure coefficients to show how the calculations go together. They are not design values for any site.

## Dead load

Each SF-90 module has a mass of 21.0 kg over 1.953 m², 10.75 kg/m². The rails, clamps and brackets add about 1.5 kg/m² over the module area, so the array adds about 12.3 kg/m² where it sits, 0.12 kPa. The 180 workshop modules and their mounting weigh about 180 × 1.953 × 12.25 = 4.3 tonnes in total, spread over about 350 m² of the north roof.

That is light compared with many roof loads, but portal-frame roofs are often designed with little spare capacity: the purlins are sized for the roof sheeting, a nominal allowance for services and the wind. A structural engineer checked the workshop's purlins and rafters for the added dead load and for the changed wind loads from the array before the installation was approved. Older roofs may need purlin upgrades; roofs with corroded purlins or fixings need repair first.

## Wind on a flush module

Wind pressure starts with the dynamic pressure of the air, q = ½ ρ V². The pressure on a surface is q times a pressure coefficient that depends on the shape of the surface and where it sits; for roof-mounted modules the relevant coefficient is a net one, the difference between the pressures on the module's top face and in the gap beneath it. Suction on the roof near its edges and corners is much stronger than in the middle, so the standard divides a roof into zones.

```figure
type: formula
title: Wind pressure and force on a module
formula: q = ½ ρ V²
formula: p = C × q
formula: F = p × A
formula: Load per fixing = F ÷ number of fixings sharing it, or p × tributary area
caption: ρ is the air density, about 1.2 kg/m³; V the design wind speed at the roof; C the net pressure coefficient for the module's zone; A the module area. The standard's coefficients and multipliers decide V and C for a real design.
- q | dynamic pressure, Pa
- p | net pressure on the module, Pa
- F | force normal to the module, N
- A | area, m²
```

SF-90's structural engineer used an assumed ultimate design wind speed of 39 m/s at the roof for this illustration, with assumed net coefficients of 1.0 for modules in the general area of the roof and 2.0 for modules in the edge and corner zones. The [wind pressure tool](/tools/wind-pressure/) gives the dynamic pressure, the pressure on the surface and the force:

```figure
type: compare
title: Wind uplift on one flush-mounted SF-90 module, from the wind pressure tool
cols: Dynamic pressure | Net pressure | Force on the module | Per clamp, 4 clamps
rowhead: Zone
- General area, C = 1.0 | 912.6 Pa | 912.6 Pa | 1,782.3 N | 445.6 N
- * Edge and corner zones, C = 2.0 | 912.6 Pa | 1,825.2 Pa | 3,564.6 N | 891.1 N
caption: This is an illustration. V = 39 m/s, ρ = 1.2 kg/m³, A = 1.953 m². The tool also reports an overturning moment about a base, which does not apply to a module clamped flat to rails.
```

A force of 3.6 kN on a module of 21 kg is a load about 17 times the module's weight, pulling it away from the roof. The load path runs from the glass to the frame, through the clamps to the rails, through the brackets to the purlins, and through the purlins to the rafters. Each link needs a rated capacity, from its maker's test data, greater than the design load with the required factor.

## Clamps, rails and brackets

Each module is held by four clamps on two rails running up the slope. In the general area each clamp carries about 446 N of design uplift; in the edge zones about 891 N. The clamp maker's data gave a rated capacity well above both, but the module maker's installation manual adds a condition that is easy to miss: the clamps must grip the frame within specified zones along its long sides, because a module clamped too near its corners bends more under suction and can crack or release its glass. The installer marked the clamp zones on the rails.

The rails sit on brackets screwed through the sheeting into the purlins below, one bracket at each purlin, 1.2 m apart. Each bracket carries the uplift on a tributary area of 1.2 m along the rail by half the module width across it, 1.2 × 0.567 = 0.68 m². In the general area that is 912.6 × 0.68 = 621 N per bracket; in the edge zones, 1,242 N. The screws into the purlins must carry that in withdrawal, with the purlin's own thickness setting the capacity; brackets fixed only into the roof sheeting, without reaching a purlin, cannot.

```figure
type: steps
title: The load path for wind uplift on a flush-mounted module
caption: This is an illustration with the case's edge-zone figures. Each link's rated capacity, with the required factor, must exceed the load at that link.
- Glass and frame | 1,825 Pa over 1.953 m², 3,565 N
- Four clamps, in the module maker's clamp zones | 891 N each
- Two rails | spanning 1.2 m between brackets
- Brackets at each purlin | 1,242 N each on 0.68 m²
- Screws into the purlin | withdrawal capacity from the purlin thickness and screw data
- * Purlins, rafters and the frame's connections | checked by the structural engineer for the new loads
```

Every bracket is also a penetration through the roof sheeting, and every penetration is a potential leak. The brackets on the workshop were installed with flashing pieces that seal against the profile, and the rule was no fixings through the pans of the sheeting, only through the crests.

## Thermal movement and corrosion

Rails move with temperature. Aluminium expands by about 23.1 × 10⁻⁶ per kelvin, roughly twice as much as the steel deck and purlins below. Between a cold winter night and a hot summer afternoon, a rail on a dark roof can change temperature by about 70 K. A continuous 12 m rail then changes length by 23.1 × 10⁻⁶ × 70 × 12,000 = 19.4 mm, and a 36 m rail by 58 mm. If the rail is clamped rigidly at every bracket, that movement turns into force on the brackets and screws, which loosen and leak over the years. The rail maker's instructions limit the length of a continuous rail and require expansion gaps at splices; on the workshop, the rails were broken into lengths of no more than about 12 m, with a gap at each splice and no module clamped across a gap.

Corrosion is the other slow enemy. Aluminium rails sit on coated steel sheeting and are fixed with stainless steel screws and clamps. Dissimilar metals in contact with moisture form a galvanic cell, and the less noble metal, here the aluminium or the zinc-aluminium coating of the sheeting, corrodes faster. The brackets carry isolating pads where they meet the sheeting, and the fixings were chosen from the combinations the rail and roofing makers approve for the site's exposure. The workshop's own process adds one local hazard: the extraction from its polishing and grinding carries fine steel and stainless particles, and where they settle on a coated roof they can rust and stain. That is one reason the business keeps the extraction discharges away from the array and checks the roof near them at each cleaning visit (Chapter 9).

## Ballast on the annex

On the annex's concrete roof the frames are not fixed through the membrane but held down by concrete blocks. Ballast must resist three things: uplift, sliding and overturning. Each frame carries two modules in portrait, 3.906 m², at 10°. Wind on a tilted plate produces a force normal to the plate; at 10° almost all of it is vertical uplift, with a small horizontal part.

Low-tilt ballasted systems are shaped to keep the net force coefficients small, and their makers give zone-by-zone coefficients and ballast tables from wind-tunnel tests. For this illustration, the coefficients were assumed at 0.4 for interior frames and 0.8 for frames in the edge zones, with the required factor of 1.5 against uplift. With q = 912.6 Pa:

- Interior frame: normal force 0.4 × 912.6 × 3.906 = 1,425.8 N; uplift 1,425.8 × cos 10° = 1,404.2 N; horizontal 247.6 N. Weight needed 1.5 × 1,404.2 = 2,106 N, a total mass of 214.8 kg. The frame and modules weigh about 72 kg, so the ballast is 142.8 kg.
- Edge frame: twice the force, uplift 2,808.4 N, total mass 429.6 kg, ballast 357.6 kg.

Sliding resistance comes from friction under the ballast trays, acting on the weight less the uplift. With a friction coefficient of 0.5 between the tray pads and the membrane, an interior frame at the design wind has a net downward force of 2,106 − 1,404 = 702 N and friction of 351 N against a horizontal force of 248 N, a factor of 1.42. Frames are also tied together in rows, so a gust on one frame is shared with its neighbours.

The ballast is a large load on the annex roof. With 14 edge frames and 4 interior frames, the blocks total about 4 × 142.8 + 14 × 357.6 = 5,578 kg, and an edge frame with its modules weighs about 430 kg over the 2.268 × 2.433 m it occupies, about 78 kg/m². The annex's concrete roof slab was checked for it.

## Modules on the roof during installation

The most dangerous wind on an array often comes before it is finished. Modules are lifted to the roof on pallets and laid out for fixing; a loose module behaves like a sail. The installer's method statement included a check of a full pallet of 31 modules, stacked flat on the annex roof, with the [outdoor cabinet wind tipping tool](/tools/outdoor-cabinet-wind-tipping/), treating the pallet as a free-standing item on a level base.

```figure
type: compare
title: A pallet of 31 modules on the annex roof, from the outdoor cabinet wind tipping tool
cols: Wind force | Safety factor against tipping | Friction against sliding | Result
rowhead: Wind speed
- 25 m/s, a strong gust | 907 N | 7.68 | 1,989 N | STABLE IN WIND
- * 39 m/s, design storm | 2,207 N | 3.15 | 1,989 N | WILL SLIDE
caption: This is an illustration. Stack 1,722 × 1,134 mm in plan and 1.08 m high including the pallet, mass 676 kg; long face to the wind, area 1.86 m², force coefficient 1.3; centre of pressure and of gravity 540 mm up; tipping edge 567 mm from the centre of gravity; friction coefficient 0.3. The tool assumes a rigid, level base; on the workshop's 5° deck, gravity would also pull the pallet downslope with about 578 N.
```

The pallet will not tip, but in a storm it would slide, and it would never get that far, because the top module would leave first. At 25 m/s the dynamic pressure is 375 Pa; if wind gets under the top module and the pressure difference approaches q, the lift is about 375 × 1.953 = 732 N, more than three times the module's weight of 206 N. The method statement therefore required pallets on the roof to be strapped through the stack, landed only on the annex, never on the sloping deck, and no more than one pallet's worth of unfixed modules laid out at a time. Module handling on the roof stopped when the site anemometer showed gusts above a set limit.

## The error: one ballast for every frame

The ballast schedule in the installer's first submission showed the same 143 kg of blocks on all 18 annex frames. The structural engineer's review caught it: the frame maker's own ballast table, which the schedule was meant to follow, gave separate figures for corner, edge and interior zones, and the installer had copied only the interior line.

With interior ballast on an edge frame, the total mass would be 214.8 kg against an uplift of 2,808 N: a factor of 214.8 × 9.81 ÷ 2,808 = 0.75. Below 1, the frame would lift at the design wind, take its neighbours with it, and the modules on it could leave the roof. The edge frames were not marginal; they were inadequate by a factor of two.

```figure
type: checklist
title: Review checks for a ballast schedule
caption: This is an illustration. Applied to every ballasted array since.
- x The ballast follows the maker's zone table for this roof's size, height and parapet, not a single line of it
- x The design wind speed and the factor against uplift come from the structural engineer, to AS/NZS 1170.2
- x The ballast per frame is marked on the layout drawing, frame by frame
- x The roof slab or structure is checked for the total ballast and the concentrated loads under trays
- x Friction values match the tray pads and the roof membrane, which may be wet
- ? An inspection after the first severe wind confirms no frame has moved
```

The corrected schedule put 357.6 kg on each of the 14 edge frames and 142.8 kg on the 4 interior ones. On a small array like this, most frames are edge frames, so ballast is heavy; on a large flat roof, interior frames dominate and the average falls.

## Exercise: a heavier wind zone

A sister factory near the coast has a design wind speed, for the same illustration, of 45 m/s, with the same coefficients.

1. What are the dynamic pressure and the force on a flush module in the edge zone?
2. What load does each of four clamps carry?
3. What ballast would an interior annex-type frame need at a factor of 1.5 against uplift?

### Worked answer

1. q = ½ × 1.2 × 45² = 1,215 Pa. In the edge zone p = 2.0 × 1,215 = 2,430 Pa, and F = 2,430 × 1.953 = 4,746 N, 33% more than at 39 m/s, because pressure goes with the square of speed: (45 ÷ 39)² = 1.331.
2. 4,746 ÷ 4 = 1,186 N per clamp, which must be checked against the clamp's rated capacity and the module maker's clamping conditions.
3. Normal force 0.4 × 1,215 × 3.906 = 1,898 N; uplift 1,898 × cos 10° = 1,870 N; weight needed 1.5 × 1,870 = 2,804 N, a total mass of 286 kg; less the 72 kg of frame and modules, about 214 kg of ballast, 50% more than at 39 m/s. At some point mechanical anchoring through the membrane, properly flashed, becomes lighter and cheaper than ballast.
