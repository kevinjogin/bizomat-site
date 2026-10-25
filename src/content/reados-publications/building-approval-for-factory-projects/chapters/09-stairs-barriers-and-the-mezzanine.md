---
book: building-approval-for-factory-projects
chapterSlug: stairs-barriers-and-the-mezzanine
order: 9
title: "Stairs, barriers and handrails for the mezzanine"
description: "Design the mezzanine stair, barriers and handrails to the NCC's Deemed-to-Satisfy Provisions, check riser geometry by calculation, and catch the site error that fails it."
draft: false
---

A mezzanine stair is a small piece of the project with a large share of the defects. It is often bought as a kit, installed late, fitted to a floor that is not quite level, and judged by eye. The NCC's requirements for it are precise: riser and going limits, the relationship between them, the number of risers in a flight, how much adjacent steps may differ, and the height and openings of barriers and handrails.

This chapter designs the running case mezzanine stair and its barriers to Part D3 of NCC 2022 Volume One, checks the geometry by calculation, and follows the stair to site, where a 20 mm error in the floor causes a failure that only a tape measure will find.

## What the stair has to achieve

The Performance Requirement D1P2 asks for safe movement to and within a building, including stairs with suitable handrails, slip-resistant surfaces, landings to avoid undue fatigue and stair passage appropriate to the expected use. D1P3 asks for barriers where people could fall 1 m or more from a floor, opening or sudden change of level, with continuity, adequate height, protection against falling through and enough strength for foreseeable loads. Barriers in Class 7 (other than carparks) and Class 8 buildings have some relaxations, which the DTS Provisions reflect.

The mezzanine stair is a required stair: it is the exit from the mezzanine. That makes it subject to the full DTS Provisions for stairs, not to the industrial alternative described later in this chapter.

## Risers, goings and flights

D3D14 and Table D3D14 set the geometry. For a public stairway, which includes stairs in workplaces:

- each riser between **115 mm and 190 mm**;
- each going between **250 mm and 355 mm**;
- the quantity **2R + G** between **550 mm and 700 mm**, where R is the riser and G the going;
- between **2 and 18 risers** in each flight;
- risers and goings constant throughout a flight, with adjacent risers or goings differing by no more than **5 mm**, and the largest and smallest in a flight differing by no more than **10 mm**;
- open risers allowed only if a **125 mm** sphere cannot pass between treads;
- no winders in a required stairway.

Table D3D15 sets slip resistance for treads: P3 or R10 when dry and P4 or R11 when wet, depending on the classification method, with nosing strips also rated. D3D15 requires landings to have a gradient no steeper than 1 in 50 and a length of at least 750 mm.

## Designing the running case stair

This is an illustration. The mezzanine deck is 3.0 m above the workshop floor, measured from the finished floor to the finished deck surface. The designer needs a whole number of equal risers that falls within 115 mm to 190 mm.

```figure
type: svg
title: Choosing the number of risers for a 3,000 mm rise
alt: Choosing the number of risers for a 3,000 mm rise. Formula: R = H ÷ n, then check 115 ≤ R ≤ 190 mm and 550 ≤ 2R + G ≤ 700 mm. H: total rise, finished floor to finished deck, mm. n: number of risers in the flight, 2 to 18. R, G: riser and going, mm. Step: 15 risers: R = 3,000 ÷ 15 = 200 mm, over 190 mm, so fails. Step: 16 risers: R = 187.5 mm; with G = 250 mm, 2R + G = 625 mm, so passes. Step: 17 risers: R = 176.5 mm; with G = 260 mm, 2R + G = 613 mm, so passes. Step: 18 risers: R = 166.7 mm, passes but uses the most floor space
caption: This is an illustration. H is the finished floor to finished deck height. Limits are from Table D3D14 of NCC 2022 Volume One for public stairways.
viewbox: 0 0 640 320
- Formula | R = H ÷ n, then check 115 ≤ R ≤ 190 mm and 550 ≤ 2R + G ≤ 700 mm
- H | total rise, finished floor to finished deck, mm
- n | number of risers in the flight, 2 to 18
- R, G | riser and going, mm
- Worked | 15 risers: R = 3,000 ÷ 15 = 200 mm, over 190 mm, so fails
- Worked | 16 risers: R = 187.5 mm; with G = 250 mm, 2R + G = 625 mm, so passes
- Worked | 17 risers: R = 176.5 mm; with G = 260 mm, 2R + G = 613 mm, so passes
- Worked | 18 risers: R = 166.7 mm, passes but uses the most floor space
body:
<g class="kf-a kd1">
<path class="ln" d="M30 270H408.8"/>
<text class="txs" x="34" y="286" text-anchor="start">finished floor</text>
<rect class="bxi" x="338.8" y="105" width="70" height="10"/>
<text class="txs" x="373.8" y="99" text-anchor="middle">deck</text>
</g>
<g class="kf-a kd2">
<path class="la draw" pathLength="1" d="M110 270V260.3H124.3V250.6H138.6V240.9H152.9V231.2H167.2V221.5H181.5V211.8H195.8V202.1H210.1V192.4H224.4V182.6H238.7V172.9H253V163.2H267.3V153.5H281.6V143.8H295.9V134.1H310.2V124.4H324.5V114.7H338.8V105H398.8"/>
</g>
<g class="kf-a kd3">
<path class="cl" d="M110 260.29411764705884L338.8 105"/>
<text class="txs" x="260" y="246" text-anchor="start">line of nosings about 5.03 m</text>
</g>
<g class="kf-a kd4">
<path class="ln" d="M84 105V270"/>
<path class="ah" d="M84 105l-4 8h8z"/>
<path class="ah" d="M84 270l-4 -8h8z"/>
<text class="txs" x="76" y="191.5" text-anchor="end">H = 3,000 mm</text>
<path class="ln" d="M110 300H338.8"/>
<path class="ah" d="M110 300l8 -4v8z"/>
<path class="ah" d="M338.8 300l-8 -4v8z"/>
<text class="txs" x="224.4" y="294" text-anchor="middle">16 goings × 260 = 4,160 mm</text>
</g>
<g class="kf-a kd5">
<text class="txb" x="420" y="70" text-anchor="start">17 risers chosen</text>
<text class="tx" x="420" y="92" text-anchor="start">R = 176.5 mm (115 to 190)</text>
<text class="tx" x="420" y="112" text-anchor="start">G = 260 mm (250 to 355)</text>
<text class="tx" x="420" y="134" text-anchor="start">2R + G = 613 mm</text>
<text class="tx" x="420" y="152" text-anchor="start">(limits 550 to 700)</text>
<text class="tx" x="420" y="174" text-anchor="start">at most 18 risers per flight</text>
</g>
```

The designer chose **17 risers of 176.5 mm** with a **260 mm going**, giving 2R + G of **613 mm**, near the middle of the 550 to 700 mm band. That leaves margin for small site variations, which matters later. Seventeen risers is within the 18-riser limit, so no intermediate landing is needed. The stair has 16 treads, so its horizontal run is **16 × 260 = 4,160 mm**, and its line of nosings is about **5.03 m** long, the length Chapter 6 used in the travel distance.

Choosing 16 risers would have shortened the stair by one going, but a riser of 187.5 mm sits only 2.5 mm under the limit. A site error of a few millimetres would fail it.

## Barriers on the mezzanine and the stair

D3D17 requires a continuous barrier along the side of any floor, mezzanine, stairway or similar trafficable surface that is 1 m or more above the surface beneath. The mezzanine deck is 3.0 m up, so its open edges need barriers, and so do the open sides of the stair once they are 1 m or more above the floor.

D3D18 sets the heights, and D3D19 the openings. The Class 8 relaxations in D3D19 and D3D20 matter here.

```figure
type: svg
title: Barrier requirements for the running case, NCC 2022 Volume One
alt: Barrier requirements for the running case, NCC 2022 Volume One. Barrier height, D3D18: Mezzanine edge at least 1 m; Stair flight at least 865 mm, measured above the nosing line. Openings, D3D19, Class 8: Mezzanine edge a 300 mm sphere must not pass; with rails, no more than 460 mm between rails; Stair flight the same, and a 150 mm sphere must not pass between the nosing line and the bottom rail. Gap between barrier and the edge it protects: Mezzanine edge not more than 40 mm; Stair flight not more than 40 mm. Climbable elements, D3D20: Mezzanine edge Class 8 buildings exempt; Stair flight Class 8 buildings exempt. Handrail, D3D22: Mezzanine edge not applicable; Stair flight at least one side, at least 865 mm above the nosings, continuous
caption: Values from D3D18, D3D19, D3D20 and D3D22. The Class 8 relaxations in D3D19 and D3D20 apply because the mezzanine is in a Class 8 building.
viewbox: 0 0 640 382
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="196.8" y="31">Mezzanine edge</text>
<text class="txb" x="406.5" y="31">Stair flight</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 95H620"/>
<text class="txb" x="28" y="64">Barrier height,</text>
<text class="txb" x="28" y="83">D3D18</text>
<text class="tx" x="196.8" y="64">at least 1 m</text>
<text class="tx" x="406.5" y="64">at least 865 mm, measured</text>
<text class="tx" x="406.5" y="82">above the nosing line</text>
</g>
<g class="kf-a kd3">
<rect class="bxa" x="20" y="95" width="600" height="86" rx="4"/>
<path class="lf" d="M20 181H620"/>
<text class="txb" x="28" y="116">Openings, D3D19,</text>
<text class="txb" x="28" y="135">Class 8</text>
<text class="tx" x="196.8" y="116">a 300 mm sphere must not</text>
<text class="tx" x="196.8" y="134">pass; with rails, no more</text>
<text class="tx" x="196.8" y="152">than 460 mm between rails</text>
<text class="tx" x="406.5" y="116">the same, and a 150 mm sphere</text>
<text class="tx" x="406.5" y="134">must not pass between the</text>
<text class="tx" x="406.5" y="152">nosing line and the bottom</text>
<text class="tx" x="406.5" y="170">rail</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 252H620"/>
<text class="txb" x="28" y="202">Gap between</text>
<text class="txb" x="28" y="221">barrier and the</text>
<text class="txb" x="28" y="240">edge it protects</text>
<text class="tx" x="196.8" y="202">not more than 40 mm</text>
<text class="tx" x="406.5" y="202">not more than 40 mm</text>
</g>
<g class="kf-a kd5">
<path class="lf" d="M20 304H620"/>
<text class="txb" x="28" y="273">Climbable</text>
<text class="txb" x="28" y="292">elements, D3D20</text>
<text class="tx" x="196.8" y="273">Class 8 buildings exempt</text>
<text class="tx" x="406.5" y="273">Class 8 buildings exempt</text>
</g>
<g class="kf-a kd6">
<path class="lf" d="M20 372H620"/>
<text class="txb" x="28" y="325">Handrail, D3D22</text>
<text class="tx" x="196.8" y="325">not applicable</text>
<text class="tx" x="406.5" y="325">at least one side, at least</text>
<text class="tx" x="406.5" y="343">865 mm above the nosings,</text>
<text class="tx" x="406.5" y="361">continuous</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="362" rx="4" fill="none"/>
<path class="lf" d="M188.8 10V372"/>
<path class="lf" d="M398.5 10V372"/>
```

For a general building, barriers must stop a 125 mm sphere and, on floors more than 4 m above the surface below, avoid climbable horizontal elements between 150 mm and 760 mm. In a Class 8 building, a rail-type barrier is acceptable within the limits above. The designer used a top rail at 1,000 mm on the mezzanine edge, with a mid-rail and a toe-board set so that no gap between rails exceeds 460 mm. On the stair, the handrail at 865 mm above the nosings is fixed to the barrier posts, the rails follow the stair's pitch within the 460 mm limit, and the bottom rail is close enough to the nosing line that a 150 mm sphere cannot pass.

## Handrails and treads in a working building

Handrails and treads are where a compliant stair becomes a safe one, or not. D3D22 requires a handrail on at least one side of a stair, on both sides where the stair is 2 m or more wide, at least 865 mm above the nosings and continuous between landings, with nothing that breaks a person's grip along it. A handrail interrupted by a barrier post bracket, or that stops two treads short of the bottom, fails the continuity requirement and fails the person who reaches for it in the dark.

The running case stair is 1 m wide, so one handrail is required. The designer provided two, one on each side, because stores staff often carry boxes and will hold whichever rail is on their free side. That is a cheap improvement over the minimum.

Treads in a workshop face a hazard that office stairs do not: oil and coolant carried on boots. Table D3D15 sets slip resistance for treads and nosings in dry and wet conditions, and the designer specified the wet rating for all treads, on the reasoning that a workshop floor is never reliably dry. Contrasting nosings help people see each step edge, particularly under emergency lighting. Both points are cheap at the design stage and expensive to retrofit once a stair is installed and painted.

## What the code does not cover on a storage mezzanine

The NCC's barrier rules are about people falling. A storage mezzanine also creates a risk of objects falling onto people below: a drill chuck kicked off the edge, a box slid off a shelf. That is a work health and safety question. The running case added toe-boards along all open edges and mesh infill on the barrier opposite the shelving, which the NCC did not require.

The loading gate is the second WHS question. Pallets of tooling are placed on the mezzanine by forklift through an opening in the barrier. An ordinary hinged gate leaves the edge open whenever it is open. The owner chose a pallet gate that keeps a barrier across the opening at all times: the pallet bay is open to the forklift side while closed to the mezzanine, and the reverse when stores staff are working. The certifier checked the gate's barrier height and openings in both positions.

## The industrial stair alternative and why it does not apply

D3D23 allows AS 1657 (fixed platforms, walkways, stairways and ladders) to be used instead of the usual stair and barrier provisions in limited places: stairs and platforms serving only machinery rooms, boiler houses, lift-machine rooms, plant rooms and the like, some non-habitable rooms used infrequently in Class 2 and Class 4 parts, and areas within farm buildings.

The mezzanine supplier initially offered a steeper "industrial" stair to AS 1657, which would have saved floor space. It does not apply here. A storage mezzanine visited every day by stores staff is not a plant room or machinery room, and the stair is the required exit for the mezzanine. The designer rejected the offer and specified the stair to Table D3D14. On the same project, the AS 1657 route was correctly used for a short access ladder to a roof-mounted extraction fan, which serves only plant.

## Structure, headroom and evidence

The mezzanine floor, stair and barriers need structural design. Imposed floor actions come from AS/NZS 1170.1 as called up by the NCC, and barrier loads must suit the foreseeable impact and pressing loads in D1P3. The structural engineer designs for the intended storage load and certifies the design. Under A5G3, a certificate from a professional engineer that sets out the basis for compliance is one form of evidence of suitability that the certifier can rely on.

Two practical points follow. First, a load rating sign at the top of the stair tells stores staff what the floor is designed to carry; overloading a mezzanine with heavier tooling than it was designed for is a common long-term failure. Second, the space under the mezzanine is part of the workshop's paths of travel. D2D7 requires at least 2 m of unobstructed height. The deck is 3.0 m up and its beams are 400 mm deep, so about 2.6 m remains, but cable trays and light fittings hung later can eat into it.

## Buying a mezzanine as a kit

Many mezzanines are bought from specialist suppliers as engineered kits, which is often sensible. The kit supplier's standard design, though, was made for someone else's building. Before ordering, the running case's owner sent the supplier a short specification rather than a floor area:

1. The deck area and shape, with a note that the total must stay at or below 190 m² (Chapter 3).
2. The finished floor to finished deck height, and a request that the supplier survey the actual slab levels at the column and stair positions.
3. The stair position and direction, fixed by the travel distance check in Chapter 6.
4. Stair geometry to Table D3D14 for a public stairway, not AS 1657, with the riser and going stated.
5. Barrier heights, opening limits and handrails to D3D18 to D3D22, plus toe-boards and mesh infill as WHS additions.
6. The design floor load for the intended storage, and a structural engineer's certificate as evidence of suitability.
7. A pallet gate that keeps the edge protected in both positions.

A specification written this way puts the code's requirements into the purchase order. The supplier can price them, the certifier can check them against one document, and any departures show up as variations rather than surprises on site.

## The site error a tape measure finds

The stair arrived as a fabricated kit, designed for exactly 3,000 mm between finished floor and finished deck. At the final inspection, the certifier measured each riser. Sixteen were 176 mm to 177 mm. The bottom riser was 197 mm.

The cause was the floor. The slab at the stair foot was 20 mm lower than the datum the mezzanine had been set from, so the stair landed 20 mm low and the whole of the error appeared in the first step. A 197 mm riser fails twice: it is over the 190 mm maximum, and it differs from the adjacent riser by about 20 mm, against a 5 mm limit for adjacent risers.

```figure
type: svg
title: Finding and fixing the bottom riser error
alt: Finding and fixing the bottom riser error. 1. Measure: every riser and going, top to bottom, with the stair loaded on its fixings. 2. Compare: bottom riser 197 mm against 190 mm maximum and 5 mm adjacent tolerance; fails both. 3. Diagnose: slab at the stair foot 20 mm below the datum used for the mezzanine. 4. Fix: a 20 mm structural pad under the stair foot, finished to the slip-resistance rating. 5. Re-measure: all risers 176 mm to 177 mm; record the measurements in the compliance file
caption: This is an illustration. The fix restores equal risers; the check that found it is cheap enough to do on every stair before handover.
viewbox: 0 0 640 409
body:
<path class="la draw" pathLength="1" d="M34 58.5V110.5"/>
<path class="la draw" pathLength="1" d="M34 138.5V190.5"/>
<path class="la draw" pathLength="1" d="M34 218.5V270.5"/>
<path class="la draw" pathLength="1" d="M34 298.5V350.5"/>
<g class="kf-a kd1">
<rect class="bx" x="58" y="14" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="44.5" r="14"/>
<text class="txb" x="34" y="49.5" text-anchor="middle">1</text>
<text class="txb" x="74" y="36">Measure</text>
<text class="tx" x="74" y="57">every riser and going, top to bottom, with the stair loaded on its fixings</text>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="58" y="85" width="562" height="79" rx="6"/>
<circle class="fa" cx="34" cy="124.5" r="14"/>
<text class="txb" x="34" y="129.5" text-anchor="middle">2</text>
<text class="txb" x="74" y="107">Compare</text>
<text class="tx" x="74" y="128">bottom riser 197 mm against 190 mm maximum and 5 mm adjacent tolerance; fails</text>
<text class="tx" x="74" y="146">both</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="58" y="174" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="204.5" r="14"/>
<text class="txb" x="34" y="209.5" text-anchor="middle">3</text>
<text class="txb" x="74" y="196">Diagnose</text>
<text class="tx" x="74" y="217">slab at the stair foot 20 mm below the datum used for the mezzanine</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="58" y="245" width="562" height="79" rx="6"/>
<circle class="bxi" cx="34" cy="284.5" r="14"/>
<text class="txb" x="34" y="289.5" text-anchor="middle">4</text>
<text class="txb" x="74" y="267">Fix</text>
<text class="tx" x="74" y="288">a 20 mm structural pad under the stair foot, finished to the slip-resistance</text>
<text class="tx" x="74" y="306">rating</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="58" y="334" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="364.5" r="14"/>
<text class="txb" x="34" y="369.5" text-anchor="middle">5</text>
<text class="txb" x="74" y="356">Re-measure</text>
<text class="tx" x="74" y="377">all risers 176 mm to 177 mm; record the measurements in the compliance file</text>
</g>
```

A falling stair is one of the most predictable ways to injure someone. Uneven risers are a known cause, because people set their stride on the first few steps and then miss the odd one. Measuring every riser is a few minutes' work and should be on every handover checklist.

## Exercise: a deeper mezzanine deck

The owner asks for the mezzanine deck to be raised to 3.4 m to give more headroom underneath. Design the stair and state any new requirements.

**Worked answer.** With H = 3,400 mm, try numbers of risers:

- 17 risers: **3,400 ÷ 17 = 200 mm**, over 190 mm, so fails.
- 18 risers: **3,400 ÷ 18 = 188.9 mm**, within the limit but only about 1.1 mm under it. With a 250 mm going, 2R + G is **627.8 mm**, which passes, but the riser has almost no margin.
- 19 or more risers in one flight are not permitted, because a flight may have no more than 18.

A sensible design uses two flights with a landing: for example, 20 risers of **170 mm** in two flights of 10, with a 270 mm going, giving **2R + G = 610 mm**. The landing must be at least 750 mm long and no steeper than 1 in 50. The stair takes more floor space, and the travel distance along it increases, so Chapter 6's checks must be repeated. Barrier and handrail heights stay the same, but the longer stair needs its own barrier and handrail along both flights and the landing where the drop is 1 m or more.
