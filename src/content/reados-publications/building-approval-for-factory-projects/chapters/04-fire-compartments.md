---
book: building-approval-for-factory-projects
chapterSlug: fire-compartments
order: 4
title: "Fire compartments: area, volume and the roof you forgot"
description: "Check a factory against the NCC's fire compartment limits, measure volume to the underside of the roof, and compare a fire wall, a large isolated building and other fixes."
draft: false
---

A fire compartment is the NCC's unit of fire containment. It is either the whole building or a part separated from the rest by fire-resisting walls and floors with protected openings. The Deemed-to-Satisfy Provisions limit how big a compartment can be, because a larger space allows a larger fire, more smoke and a harder job for occupants and fire fighters.

For industrial buildings, the compartment limits are often the first DTS numbers that bite. Workshops are large, open and high, and the limits are set by both floor area and volume. This chapter checks the running case, finds an error that is common in practice, and compares the ways out.

## The limits in Table C3D3

Table C3D3 of NCC 2022 Volume One gives the maximum floor area and volume of a fire compartment by class and type of construction. A compartment must satisfy both limits.

```figure
type: svg
title: Maximum size of a fire compartment, NCC 2022 Table C3D3
alt: Maximum size of a fire compartment, NCC 2022 Table C3D3. Type A construction: Class 5, 9b or 9c 8,000 m² and 48,000 m³; Class 6, 7, 8 or 9a (not patient care) 5,000 m² and 30,000 m³. Type B construction: Class 5, 9b or 9c 5,500 m² and 33,000 m³; Class 6, 7, 8 or 9a (not patient care) 3,500 m² and 21,000 m³. Type C construction: Class 5, 9b or 9c 3,000 m² and 18,000 m³; Class 6, 7, 8 or 9a (not patient care) 2,000 m² and 12,000 m³
caption: Values from Table C3D3 of NCC 2022 Volume One. Both the floor area and the volume limit apply. Patient care areas are covered elsewhere.
viewbox: 0 0 640 171
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="52" rx="4"/>
<text class="txb" x="207.9" y="31">Class 5, 9b or 9c</text>
<text class="txb" x="397.1" y="31">Class 6, 7, 8 or 9a (not</text>
<text class="txb" x="397.1" y="50">patient care)</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 95H620"/>
<text class="txb" x="28" y="83">Type A construction</text>
<text class="tx" x="207.9" y="83">8,000 m² and 48,000 m³</text>
<text class="tx" x="397.1" y="83">5,000 m² and 30,000 m³</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 128H620"/>
<text class="txb" x="28" y="116">Type B construction</text>
<text class="tx" x="207.9" y="116">5,500 m² and 33,000 m³</text>
<text class="tx" x="397.1" y="116">3,500 m² and 21,000 m³</text>
</g>
<g class="kf-a kd4">
<rect class="bxa" x="20" y="128" width="600" height="33" rx="4"/>
<path class="lf" d="M20 161H620"/>
<text class="txb" x="28" y="149">Type C construction</text>
<text class="tx" x="207.9" y="149">3,000 m² and 18,000 m³</text>
<text class="tx" x="397.1" y="149">2,000 m² and 12,000 m³</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="151" rx="4" fill="none"/>
<path class="lf" d="M199.9 10V161"/>
<path class="lf" d="M389.1 10V161"/>
```

The ratio of volume to area in every row is 6 m. A compartment whose average height is more than 6 m therefore reaches its volume limit before its area limit. Most modern factories are taller than 6 m, which means volume, not area, is usually the governing test for industrial buildings.

## Measuring volume the NCC's way

Volume has a defined meaning in the NCC. For a building, it is the total space measured above the lowest floor, over the enclosing walls and to the underside of the roof covering. For a fire compartment, it is the total space within the inner finished surfaces of the enclosing fire-resisting walls and floors, with rules for compartments that lack a fire-resisting floor or wall on some side.

In a single-storey portal-frame building with no fire-resisting ceiling, that means measuring to the underside of the roof sheeting, including the triangular space under a pitched roof. A ceiling in one part of the building does not reduce the compartment's volume unless that ceiling is part of the fire-resisting enclosure.

```figure
type: svg
title: Volume of the running case building
alt: Volume of the running case building. Formula: V = L × (W × h_eaves + ½ × W × (h_ridge − h_eaves)). V: volume to the underside of the roof covering, m³. L, W: length and width, m. h_eaves, h_ridge: eaves and ridge heights, m. Step: Cross-section = 30 × 6.0 + 0.5 × 30 × 1.5 = 202.5 m². Step: Whole building = 60 × 202.5 = 12,150 m³. Step: Workshop part, 50 m long = 50 × 202.5 = 10,125 m³. Step: Office part, 10 m long = 10 × 202.5 = 2,025 m³
caption: This is an illustration. The building is 60 m long and 30 m wide, with eaves at 6.0 m and the ridge at 7.5 m. The internal surfaces are taken as the external dimensions for simplicity.
viewbox: 0 0 640 300
- Formula | V = L × (W × h_eaves + ½ × W × (h_ridge − h_eaves))
- V | volume to the underside of the roof covering, m³
- L, W | length and width, m
- h_eaves, h_ridge | eaves and ridge heights, m
- Worked | Cross-section = 30 × 6.0 + 0.5 × 30 × 1.5 = 202.5 m²
- Worked | Whole building = 60 × 202.5 = 12,150 m³
- Worked | Workshop part, 50 m long = 50 × 202.5 = 10,125 m³
- Worked | Office part, 10 m long = 10 × 202.5 = 2,025 m³
body:
<g class="kf-a kd1">
<path class="ln" d="M40 250H600"/>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="95" y="160" width="450" height="90"/>
<text class="txb" x="320" y="208" text-anchor="middle">Rectangle: 30 × 6.0 = 180 m²</text>
</g>
<g class="kf-a kd3">
<path class="bx" d="M95 160L320 137.5L545 160Z"/>
<text class="txs" x="320" y="127.5" text-anchor="middle">Triangle: ½ × 30 × 1.5 = 22.5 m²</text>
</g>
<g class="kf-a kd4">
<path class="la draw" pathLength="1" d="M95 250V160L320 137.5L545 160V250"/>
<path class="lf dsh" d="M95 160H545"/>
</g>
<g class="kf-a kd5">
<path class="ln" d="M95 276H545"/>
<path class="ah" d="M95 276l8 -4v8z"/>
<path class="ah" d="M545 276l-8 -4v8z"/>
<text class="txs" x="320" y="270" text-anchor="middle">W = 30 m</text>
<path class="ln" d="M73 160V250"/>
<path class="ah" d="M73 160l-4 8h8z"/>
<path class="ah" d="M73 250l-4 -8h8z"/>
<text class="txs" x="65" y="209" text-anchor="end">eaves 6.0 m</text>
<path class="ln" d="M567 137.5V250"/>
<path class="ah" d="M567 137.5l-4 8h8z"/>
<path class="ah" d="M567 250l-4 -8h8z"/>
<text class="txs" x="575" y="197.8" text-anchor="start">ridge 7.5 m</text>
</g>
<g class="kf-a kd6">
<text class="txa" x="320" y="286" text-anchor="middle">Cross-section 202.5 m² × length = volume to the underside of the roof covering</text>
</g>
```

## Which limits apply to a mixed compartment

A compartment that contains two classes raises a question the table does not answer directly. The running case building, as one compartment, holds a Class 5 office and a Class 8 workshop. The Class 5 row allows 3,000 m² and 18,000 m³; the Class 8 row allows 2,000 m² and 12,000 m³.

The NCC's general rule for multiple classifications, in A6G12, is that each part must meet the requirements for its class, and where requirements conflict the more stringent one applies. For a single compartment, the practical reading is that the compartment must satisfy the limits for the most demanding class it contains. The running case checks against the Class 8 limits, because they are smaller. If you think a different reading applies to your building, put it to the certifier early and get the answer in writing; do not build an estimate on the generous reading.

## Why the code limits both area and volume

The two limits capture two different parts of the hazard. Floor area is a proxy for how much fuel a fire can reach and how far occupants may have to travel. Volume is a proxy for the space that smoke and hot gases can fill, and for the size of fire a space can sustain before fire fighters can intervene. A low, wide building is limited by area; a tall building with the same floor area holds more fuel on racking, more smoke and a larger fire, and is limited by volume.

That is also why the industrial rows of Table C3D3 are smaller than the office rows. Factories and warehouses typically hold more combustible material per square metre than offices, often stacked high. The code's limits are blunt, but their direction follows the fuel.

## A check sheet for fire compartments

The running case used a short procedure that suits most single-storey industrial buildings:

1. Mark every fire-resisting wall and floor that could bound a compartment. If there are none, the whole building is one compartment.
2. For each compartment, draw a section and measure the volume to the inner surfaces of its fire-resisting enclosure, or to the underside of the roof covering where there is no fire-resisting ceiling.
3. Measure the floor area of each storey in the compartment, including mezzanines, and record how the certifier will treat them.
4. Find the classes in the compartment and the type of construction, and read the Table C3D3 limits for the most demanding class.
5. Compare area and volume with the limits and record the margin for each, not just pass or fail.
6. If the margin is small, list what could erode it: construction tolerances, future mezzanines, extensions, a change of use.

The margin column is the part most estimates leave out. It is what tells you whether the compliance will survive the building's next change.

## The running case: an error found in review

This is an illustration. The owner's estimator checked the building as one fire compartment, using the Class 8 Type C limits because the workshop is Class 8 and the construction type had been settled at Type C (Chapter 3). The estimator's working was:

- **Floor area:** 1,800 m², under the 2,000 m² limit.
- **Volume:** 1,800 m² × 6.0 m = 10,800 m³, under the 12,000 m³ limit.

Both checks passed, and the estimate assumed no fire separation inside the building.

The design review found two problems. First, the 6.0 m height was the eaves height. The NCC measures volume to the underside of the roof covering, so the correct volume is **12,150 m³**, which exceeds the 12,000 m³ limit by 150 m³. Second, the floor area check ignored the mezzanine. A storey's floor area includes mezzanines in the NCC's definition, and the certifier indicated that the mezzanine would be included in the compartment's floor area. With the 190 m² mezzanine the area is **1,990 m²**, inside the limit with only 10 m² to spare. With the original 240 m² mezzanine it would have been 2,040 m², over the limit.

```figure
type: svg
title: The running case as one fire compartment
alt: The running case as one fire compartment. Estimator's volume, to the eaves: 10800 m³. Correct volume, to the underside of the roof: 12150 m³. Class 8 Type C limit, Table C3D3: 12000 m³
caption: This is an illustration. Measured to the eaves, the building appears to pass; measured to the underside of the roof covering, as the NCC defines volume, it exceeds the Class 8 Type C limit.
viewbox: 0 0 640 163
body:
<g class="kf-a kd1">
<text class="txb" x="20" y="26">Estimator's volume, to the eaves</text>
<rect class="fp" x="20" y="33" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="33" width="406.1" height="18" rx="3"/>
<text class="txb" x="500" y="47">10800 m³</text>
</g>
<g class="kf-a kd2">
<text class="txb" x="20" y="75">Correct volume, to the underside of the roof</text>
<rect class="fp" x="20" y="82" width="470" height="18" rx="3"/>
<rect class="fa kf-growx" x="20" y="82" width="456.8" height="18" rx="3"/>
<text class="txa" x="500" y="96">12150 m³</text>
</g>
<g class="kf-a kd3">
<text class="txb" x="20" y="124">Class 8 Type C limit, Table C3D3</text>
<rect class="fp" x="20" y="131" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="131" width="451.2" height="18" rx="3"/>
<text class="txb" x="500" y="145">12000 m³</text>
</g>
```

How was it detected? The reviewer asked a standard question: "Show me the section you measured the volume from." The estimator's section had no roof triangle. Asking for the measurement basis of every limit-sensitive number is a cheap habit that finds this class of error.

## Four ways to make the building comply

Once a compartment exceeds Table C3D3, the DTS Provisions offer some routes, and a Performance Solution offers another. The designer compared four.

**Option 1: a fire wall between the office and the workshop.** A fire wall along the 30 m line between the office and the workshop splits the building into two compartments:

- **Workshop:** 1,500 m² plus the 190 m² mezzanine, 1,690 m², and 10,125 m³, inside the Class 8 Type C limits of 2,000 m² and 12,000 m³.
- **Office:** 300 m² and 2,025 m³, well inside the Class 5 Type C limits of 3,000 m² and 18,000 m³.

The wall must be built as a fire wall for the building's type of construction, with its FRL and its junctions with the roof and external walls detailed under the DTS Provisions. Doors through it must be fire doors to Specification 12, and services passing through it must be protected to Specification 13.

**Option 2: a large isolated building.** C3D4 allows a building to exceed Table C3D3 in some circumstances. For a Class 7 or 8 building up to 18,000 m² and 108,000 m³, one route requires the building to be not more than two storeys and surrounded by open space at least 18 m wide that complies with C3D5(1). Other routes require sprinklers to Specification 17 and vehicular access around the building complying with C3D5(2): a continuous path for emergency vehicles at least 6 m wide, with no part of its far edge more than 18 m from the building. The running case building sits 8 m from its western boundary, so an 18 m open space all round is impossible on this site. The building also contains a Class 5 part, which brings in the sprinklered route for Class 5 to 9 buildings. Sprinkling a 1,800 m² building to avoid one wall did not look economic.

**Option 3: lower the roof.** Lowering the ridge from 7.5 m to 7.3 m gives a cross-section of 30 × 6.0 + 0.5 × 30 × 1.3 = 199.5 m², and a volume of 60 × 199.5 = **11,970 m³**. That is under 12,000 m³ by just 30 m³. Every 10 mm of extra height across the 1,800 m² floor adds 18 m³, so the margin is equivalent to about 17 mm of height. A slab poured a little low or an eaves purlin set a little high would remove it. The building also already exists, so changing the roof was not practical.

**Option 4: a Performance Solution.** A fire engineer could try to show that a single 12,150 m³ compartment meets the relevant Performance Requirements, or is at least equivalent to a DTS-compliant building, perhaps with detection added. For an overshoot of 150 m³, about 1.25%, that might be feasible, but it would add fees, time and ongoing conditions on the building's use.

```figure
type: svg
title: Comparing the four options
alt: Comparing the four options. Horizontal axis: Cost and disruption: low → high. Vertical axis: Robustness of compliance: low → high. Top left: Fire wall between office and workshop, complies with margin; costs a wall and fire doors. Top right: Large isolated building, would need sprinklers and vehicular access on this site. Bottom left: Lower the roof, 30 m³ margin; not practical on an existing building. Bottom right: Performance Solution, possible, but adds fees, time and conditions
caption: This is an illustration of the designer's judgement, not a priced comparison. The fire wall was chosen because it complies under the DTS Provisions with a clear margin.
viewbox: 0 0 640 270
body:
<path class="li draw" pathLength="1" d="M56 240H630"/>
<path class="ah" d="M630 234l10 6-10 6z"/>
<path class="li draw" pathLength="1" d="M56 240V12"/>
<path class="ah" d="M50 12l6 -10 6 10z"/>
<text class="txs" x="346" y="260" text-anchor="middle">Cost and disruption: low → high</text>
<text class="txs" x="0" y="0" text-anchor="middle" transform="translate(44 124) rotate(-90)">Robustness of compliance: low → high</text>
<g class="kf-a kd1">
<rect class="bxa" x="70" y="14" width="270" height="104" rx="8"/>
<circle class="fa pulse" cx="326" cy="28" r="5"/>
<text class="txb" x="82" y="38">Fire wall between office and</text>
<text class="txb" x="82" y="57">workshop</text>
<text class="tx" x="82" y="80">complies with margin; costs a wall</text>
<text class="tx" x="82" y="98">and fire doors</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="352" y="14" width="270" height="104" rx="8"/>
<text class="txb" x="364" y="38">Large isolated building</text>
<text class="tx" x="364" y="61">would need sprinklers and vehicular</text>
<text class="tx" x="364" y="79">access on this site</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="70" y="130" width="270" height="104" rx="8"/>
<text class="txb" x="82" y="154">Lower the roof</text>
<text class="tx" x="82" y="177">30 m³ margin; not practical on an</text>
<text class="tx" x="82" y="195">existing building</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="352" y="130" width="270" height="104" rx="8"/>
<text class="txb" x="364" y="154">Performance Solution</text>
<text class="tx" x="364" y="177">possible, but adds fees, time and</text>
<text class="tx" x="364" y="195">conditions</text>
</g>
```

The owner chose the fire wall. It gives a clear DTS margin in both compartments, its cost is predictable, and it produces two compartments that simplify later chapters: the office and workshop each have their own exits, fire equipment and amenities.

## What the fire wall commits the owner to

A fire wall is not just a construction item. It is a fire safety measure that has to keep working for the life of the building, and owners routinely defeat them without noticing.

- **Fire doors must close.** A fire door wedged open for forklift traffic or ventilation turns two compartments back into one. If a door through the fire wall needs to stay open in normal use, it needs an approved hold-open device that releases on alarm, which is a design decision, not a wedge.
- **Penetrations must be sealed.** Every new cable, pipe or duct through the wall needs a tested penetration system. Electricians and plumbers working after handover are the usual cause of unsealed holes.
- **Nothing should be fixed to the wall that would pull it down or carry fire around it.** Racking, mezzanine beams and cladding details near the wall need the designer's attention.
- **The wall appears in the building's records.** In NSW, the fire safety schedule for the building lists the measures that must be maintained, and Chapter 10 returns to how they are checked each year.

## When other triggers apply

The compartment limits interact with the fire equipment rules in Chapter 7. Two connections are worth knowing now:

- **Excessive hazards.** Under E1D13, sprinklers are required in fire compartments with a floor area over 2,000 m² or a volume over 12,000 m³ that contain hazardous processes or bulk storage of combustible goods above set heights and volumes. A larger compartment with high racking of combustible stock can trigger sprinklers.
- **Large Class 6, 7 or 8 buildings.** Under E1D15, a Class 6, 7, 8 or 9 building with a total floor area over 18,000 m² needs a fire control centre.

Neither applies to the running case after the fire wall, but they explain why owners planning high racking or future expansion should look at compartment size early.

```figure
type: svg
title: Fire compartment record for the running case
alt: Fire compartment record for the running case. Done: Volume measured to the underside of the roof covering, NCC definition of volume. Done: Workshop compartment 1,690 m² including mezzanine, 10,125 m³, under 2,000 m² and 12,000 m³, Class 8 Type C. Done: Office compartment 300 m², 2,025 m³, under 3,000 m² and 18,000 m³, Class 5 Type C. Done: Fire wall between office and workshop, fire doors to Specification 12, penetrations to Specification 13. Open: Fire wall junction with roof and external walls, designer to detail under the DTS Provisions. Open: Hold-open devices on any fire door kept open in use, to decide with the certifier
caption: This is an illustration. Each line records the measurement basis as well as the result.
viewbox: 0 0 640 418
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Volume measured to the underside of the roof covering</text>
<text class="tx" x="64" y="53">NCC definition of volume</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="79" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="96" r="11"/>
<path class="la draw" pathLength="1" d="M34 96l4 4 8-8"/>
<text class="txb" x="64" y="99">Workshop compartment 1,690 m² including mezzanine, 10,125 m³</text>
<text class="tx" x="64" y="120">under 2,000 m² and 12,000 m³, Class 8 Type C</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="146" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="163" r="11"/>
<path class="la draw" pathLength="1" d="M34 163l4 4 8-8"/>
<text class="txb" x="64" y="166">Office compartment 300 m², 2,025 m³</text>
<text class="tx" x="64" y="187">under 3,000 m² and 18,000 m³, Class 5 Type C</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="213" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="230" r="11"/>
<path class="la draw" pathLength="1" d="M34 230l4 4 8-8"/>
<text class="txb" x="64" y="233">Fire wall between office and workshop</text>
<text class="tx" x="64" y="254">fire doors to Specification 12, penetrations to Specification 13</text>
</g>
<g class="kf-a kd5">
<rect class="bxi" x="20" y="280" width="600" height="59" rx="6"/>
<circle class="bxi" cx="40" cy="297" r="11"/>
<text class="txa" x="40" y="302" text-anchor="middle">?</text>
<text class="txb" x="64" y="300">Fire wall junction with roof and external walls</text>
<text class="tx" x="64" y="321">designer to detail under the DTS Provisions</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="347" width="600" height="59" rx="6"/>
<circle class="bxi" cx="40" cy="364" r="11"/>
<text class="txa" x="40" y="369" text-anchor="middle">?</text>
<text class="txb" x="64" y="367">Hold-open devices on any fire door kept open in use</text>
<text class="tx" x="64" y="388">to decide with the certifier</text>
</g>
```

## Exercise: extend the workshop

Two years later the owner wants to extend the building by 10 m at the west end with the same cross-section, adding 300 m² to the workshop. What happens to the workshop compartment, and what are the choices?

**Worked answer.** The workshop becomes 60 m long. Its volume is **60 × 202.5 = 12,150 m³**, over the 12,000 m³ Class 8 Type C limit. Its floor area is **1,800 m² plus the 190 m² mezzanine = 1,990 m²**, just under the 2,000 m² limit. The extension therefore breaks the volume limit and nearly breaks the area limit.

The choices mirror this chapter: a second fire wall dividing the workshop, which would also divide the production floor; meeting C3D4 for a large isolated building, which on this site means sprinklers and vehicular access; or a Performance Solution. A fire wall across a production floor usually conflicts with material flow, so the extension decision should be made with the compartment limits on the table, before the floor layout is fixed.

A cheaper variation is to extend with a lower roof. A 10 m extension whose underside of roof averages 4.5 m adds only about **300 × 4.5 = 1,350 m³**, so the workshop's volume would be about 11,475 m³ if the extension is open to the existing workshop. That passes, but only if the area limit also holds and nothing else is added later. Record the margin either way.
