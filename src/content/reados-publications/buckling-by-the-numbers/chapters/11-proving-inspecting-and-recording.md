---
book: buckling-by-the-numbers
chapterSlug: proving-inspecting-and-recording
order: 11
title: "Proving, inspecting and recording"
description: "How to show that compression members were built and stay as calculated: straightness and plumb checks, a staged first fill, a Southwell plot from a test, inspections and a member register."
draft: false
---

Every buckling calculation in this book rested on assumptions about the real member: that it is the section on the drawing, as straight as assumed, held at its ends as assumed, braced where the drawing says, and loaded where the calculation says. Buckling is unforgiving of those assumptions being wrong, because the effective length is squared and imperfections are amplified. A stand that is calculated correctly but built with a missing strut, a leg bowed by 10 mm or slack bracing is not the stand that was calculated.

This chapter covers how the shop proves HT-8 was built as designed, how it watched the first fill, how a simple test can estimate a member's buckling load without breaking it, how the stand is inspected in service, and how the whole is recorded. Its error is one that only inspection finds: a strut removed during maintenance and never replaced.

## Checking what was built

This is an illustration. Before HT-8 left the shop and again after erection, the shop measured the quantities its calculations depended on.

```figure
type: compare
title: HT-8 erection checks against the design assumptions
cols: Design assumption | Measured | Result
rowhead: Quantity
- Leg section | CHS 76.1 × 3.6, C350 | 76.1 mm by tape, wall 3.5 to 3.7 mm by ultrasonic gauge; mill certificate C350L0 | accepted
- Leg bow on each 2,000 mm segment | not more than 2 mm | 0.9, 1.2, 1.8 and 2.6 mm on the worst segments of the four legs | one leg over; assessed below
- Top frame centred over base | lean not more than 1 in 500, 8 mm | 6 mm towards the north-east corner | accepted
- Leg centreline under frame centreline | within 5 mm | 2 to 4 mm | accepted
- Mid-height struts | all four, welded all round | all four present; welds inspected visually | accepted
- Diagonals | taut and locked | taut and locked after tensioning (Chapter 6) | accepted
caption: This is an illustration. Bows measured with a taut string line and a steel rule at mid-segment; lean measured with a plumb bob from the top frame. The tolerances are the shop's design assumptions for HT-8, not quotations from a fabrication standard.
```

### The bowed leg

One leg segment was bowed by 2.6 mm against the 2 mm assumed. Rather than straighten it, the shop's engineer re-ran the Chapter 5 check with the larger bow added to the 15 mm offset, an equivalent eccentricity of 17.6 mm, on the 2,000 mm segment under the gravity and wind load of 25.4 kN. The eccentric column tool gave a load factor to first yield of 4.02, against 4.30 for the design case and a requirement of 2. The bow was recorded and accepted. The calculation took ten minutes; straightening a leg in a finished frame would have taken a day and risked introducing a worse bow.

That is the purpose of stating the assumptions as numbers. A measured departure can be assessed against them quickly, instead of being argued about.

### The lean

The top frame stood 6 mm off centre over 4,000 mm, a lean of 1 in 667. A leaning frame is a sway imperfection: the full gravity load of 78.7 kN, acting through a frame that leans by 6 mm in 4,000 mm, has a horizontal component of 78.7 × 6 ÷ 4,000 = 0.12 kN, which the bracing must resist. That is small beside the wind force of 3.52 kN the bracing was designed for, and the lean was accepted.

## Watching the first fill

A staged first fill is a load test that costs nothing but time. The shop filled HT-8 in quarters, stopping at each stage to take readings.

```figure
type: timeline
title: HT-8's staged first fill
caption: This is an illustration. At each hold point, readings were compared with the expected values before filling continued. The expected bow growth is tiny, so any readable growth would have meant something was wrong.
- Before filling | Baseline readings | plumb of top frame, string-line bow of each leg segment, diagonals checked by hand
- 25% full, 1,900 L | First hold | no change in plumb or bow; base plates and grout checked
- 50% full, 3,800 L | Second hold | no change; diagonals still taut
- 75% full, 5,700 L | Third hold | no change; tank shell and nozzles inspected for leaks
- * 100% full, 7,603 L | Final hold, 24 hours | lean 6 mm, unchanged; bows unchanged within 0.2 mm reading accuracy
```

The expected changes were small. On a 2,000 mm braced segment, the full-tank leg load of 19.7 kN is 7.4% of the segment's Euler load of 266.5 kN, so the amplification factor is 1 ÷ (1 − 0.074) = 1.08 and a 2 mm bow should grow by only 0.16 mm, below what a string line can show. If any bow had grown by several millimetres, it would have meant that the leg was behaving as a much longer member than designed, for instance because a strut connection had failed or the bracing was slack, and the fill would have been stopped and the tank drained.

## Estimating a buckling load without reaching it

Sometimes it is worth testing a member to see how close to its predicted buckling load it really is, without loading it to failure. The classic method is the Southwell plot, published by R. V. Southwell in 1932. It uses the fact from Chapter 5 that an imperfect member's extra deflection grows as the load approaches its critical load. Rearranged, that relationship gives a straight line:

```figure
type: formula
title: The Southwell plot
formula: δ ÷ P = δ ÷ P_cr + δ₀ ÷ P_cr
formula: Plot δ ÷ P (vertical) against δ (horizontal): the slope is 1 ÷ P_cr
caption: δ is the extra deflection measured from the start of loading, and δ₀ is the member's initial imperfection. The test can stop well below the critical load: the straight line, once established, points to it.
- δ | extra lateral deflection at mid-length, measured, mm
- P | applied axial load, kN
- P_cr | critical load of the member as built and as held, kN
- δ₀ | initial imperfection, found from the intercept, mm
```

This is an illustration. When the shop considered a lighter option for HT-8's mid-height struts, CHS 33.7 × 2.6, it tested one 2,200 mm length in its press, pinned at both ends through clevises, with a dial gauge at mid-length. The tube's predicted Euler load was 12.61 kN, with a slenderness of 199. The press was stopped at 7 kN, a little over half the prediction.

```figure
type: compare
title: Southwell test of a CHS 33.7 × 2.6 strut, 2,200 mm, pinned
cols: Extra deflection at mid-length, mm | δ ÷ P, mm/kN
rowhead: Load
- 2 kN | 0.67 | 0.335
- 3 kN | 1.12 | 0.373
- 4 kN | 1.71 | 0.428
- 5 kN | 2.50 | 0.500
- 6 kN | 3.60 | 0.600
- 7 kN | 5.25 | 0.750
caption: This is an illustration. A straight line fitted through the six points has a slope of 0.0909 per kN, so P_cr = 1 ÷ 0.0909 = 11.0 kN, and an intercept of 0.273 mm/kN, which gives an initial imperfection of 0.273 × 11.0 = 3.0 mm.
```

The test gave a critical load of 11.0 kN, 13% below the 12.61 kN prediction, and showed the strut had an initial bow of about 3 mm, more than the 2.2 mm (1 in 1,000) the shop assumes. Measuring the tube afterwards found its wall averaged 2.4 mm instead of 2.6 mm, within the product tolerance, which alone lowers the Euler load to about 11.9 kN; the rest was put down to the clevises not being perfectly free to rotate and to the test rig's own flexibility. The shop decided to keep the 48.3 × 3.2 struts, and kept the test result as a reminder that predicted buckling loads are upper bounds until proven.

A Southwell test has to be done carefully. The load must be applied slowly and held while readings are taken, the gauge must measure deflection in the plane the member will buckle in, the test must stop well short of the predicted load, and the test rig must be guarded so that a member that buckles unexpectedly cannot hurt anyone.

## Inspection in service

The buckling capacity of HT-8 can be lost after commissioning without anything being overloaded. The shop recommended, and the plant adopted, an annual inspection of the stand with these items:

```figure
type: checklist
title: Annual inspection of HT-8's stand
caption: Each item protects one assumption of the design calculations. The open item is the one added after the error below.
- Legs sighted for bends and dents | Chapters 3 and 5
- Base plates, bolts and grout checked; corrosion at the leg bases | water pooling at bases thins the wall where it cannot be seen
- Diagonals taut, turnbuckles locked | Chapter 6
- ? Every member on the drawing present, counted against the drawing | struts, diagonals and portal members
- Nothing new attached to the legs or frame | added loads and offset brackets need a design check
- Vent clear and mesh clean | Chapter 9
- Service temperature unchanged since the last design review | Chapter 8
```

### Corrosion at the leg bases

The base of a tank stand leg is where its capacity is most quietly lost. Water runs down the legs, pools on the base plate around the tube and wets the bottom of the wall for days after every rain or washdown. A tube sealed at its base with no drain hole can also fill with condensation and rust from the inside, where nobody can see it.

This is an illustration. Suppose an inspection found HT-8's leg wall reduced from 3.6 mm to 2.4 mm over the bottom 150 mm. The overall buckling of the leg would hardly change, because a short, thin band at the very end of a 2,000 mm segment has little effect on the segment's bending stiffness. But the local section would be weaker. Its area would fall from 820 mm² to 556 mm², so the stress under the gravity and wind load would rise from 31.0 to 45.8 MPa, and the wall's diameter-to-thickness ratio would rise from 21 to 32. Neither figure is alarming yet, but corrosion rarely stops at a uniform 1.2 mm: it pits, and a pit through the wall at the base is a crack starter and a weak point in exactly the place where the leg's load, offset and any base fixity moments are concentrated.

For that reason the shop specifies HT-8's legs with sealed tops and small drain holes at the base, the base plates with a slight fall away from the tube, and the inspection measures the wall at the base with an ultrasonic gauge every year. A reading below 3.0 mm triggers a design check; a reading below 2.4 mm, or any through-pitting, triggers repair before the tank is refilled.

## The error: a strut that never came back

This is an illustration. Two years after commissioning, a contractor replacing the transfer pump found one of HT-8's mid-height struts in the way of the new pump's discharge pipe. The contractor cut the strut out at both ends with a grinder, installed the pump and left, intending to have the strut refitted with a new bracket. The tank was full at the time, and stayed full.

The strut was not refitted. Its absence was not noticed by operators, because the stand looked no different and nothing moved. It was found at the next annual inspection, eleven months later, when the inspector counted the members against the drawing.

With the strut gone, two legs were unbraced at mid-height in one direction. Chapter 5's exercise had already worked out what that meant: on 4,000 mm instead of 2,000 mm, each of those legs had a buckling factor of 3.39 under the full tank, falling to a load factor to first yield of about 2 with the wind and the 15 mm offset. The stand had been running for eleven months with half of its designed margin gone on two legs, and with the diagonals of that face, which relied on the strut, not acting as designed.

```figure
type: bars
title: One HT-8 leg with and without its mid-height strut
unit: ×
caption: This is an illustration. Gravity-only buckling factor on 19.7 kN from Chapters 2 and 4; with the strut the leg buckles on 2,000 mm, without it on 4,000 mm.
- * Strut in place, 2,000 mm braced segment | 10.66
- Strut removed, 4,000 mm | 3.39
- Shop's required factor | 2.5
```

The strut was refitted the following week with a new connection that cleared the discharge pipe, designed and checked by the shop. The plant made two changes to its permit-to-work system: removing or modifying any structural member now requires a permit signed off by the site's engineering lead, and the permit cannot be closed until the member is reinstated or a design change approved. The inspector's member count was added to the checklist above as a permanent item.

## The member register

The shop now keeps a short register for every structure it designs with members in compression. It is one page for HT-8.

```figure
type: compare
title: Extract from HT-8's compression member register
cols: Section | Effective length, mm and K | Slenderness | Design load, kN | Factor | Key assumptions
rowhead: Member
- Legs, each segment | CHS 76.1 × 3.6, C350 | 2,000, K = 1.0 | 77.9 | 25.4 with wind | 8.24 buckling; 4.30 first yield | struts and diagonals present; offset ≤ 15 mm; bow ≤ 2 mm
- Mid-height struts | CHS 48.3 × 3.2, C350 | 2,200, K = 1.0 | 137.6 | 2.0 | 23.6 | welded all round both ends
- Diagonals | 16 mm round bar | tension only | n/a | 2.4 | tension check in design note | taut and locked; both of each pair present
- Outlet pipe | 60.3 × 2.77, 316 | 2,660, K = 0.7 | 130.6 | thermal | see Chapter 8 | flexible connector and anchor fitted
- Tank shell | 3 mm 316 on 2,206 mm | short shell | D ÷ t = 735 | vacuum | not designed for vacuum | vent must be open; no vacuum service
caption: This is an illustration. The register states each member's assumptions in a form an inspector can check.
```

The last column is the important one. Each assumption is something that can be seen, measured or counted on site, so that anyone inspecting the stand can tell whether the calculation still describes it.

## What the design note must contain

A buckling check that nobody else can follow cannot be checked, and an unchecked buckling check is a guess. The shop's design note for HT-8 runs to a few pages, and every compression member's check in it states:

- the load and where it comes from, including every load case combined, with the reference used for wind;
- the section and its properties, with their source (a calculation, a WORKOS tool's output with its inputs, or a maker's table);
- the effective length in each direction and the reason for each K;
- the method (Euler, Johnson, Rankine–Gordon, secant or a code curve) and why it applies at that slenderness;
- the imperfection and offset assumed, and the fabrication tolerance that will make them true;
- the factor obtained and the factor required;
- what the check does not cover, such as connections, local effects or loads not yet known.

The note is checked by a second person, who repeats the key numbers independently. For a structure that must comply with the Building Code or a standard, such as AS 4100 for its design or AS/NZS 5131 for the fabrication and erection of structural steelwork, the note is the place to show how each requirement is met, and the design must be done or checked by someone competent to sign it.

## Bringing it together

The eleven chapters of this book follow one stand and the equipment around it from the first sketch to the annual inspection. The story they tell is consistent. Buckling is decided by stiffness and length, not strength. The effective length, set by how a member is held and braced, matters more than anything else, because it is squared. Real members are crooked and loaded off-centre, and those imperfections grow as the load approaches the critical load. Bracing must be stiff, strong and taut. Machines can push their own members harder than the job needs. Heat can load a member that carries nothing else. Thin shells buckle at pressures far below what their thickness suggests, unless their ends hold them round. Temporary frames are often mechanisms in one direction. And every calculation is only as good as the member that was built and the member that is still there years later.

## Exercise: a new pump bracket

This is an illustration. The plant asks to bolt a bracket to one of HT-8's legs, 1,000 mm above the base plate, to support a 60 kg valve on a 300 mm arm.

1. What vertical load and what moment does the bracket put on the leg?
2. Why does this need a design check even though 0.6 kN is small beside the leg's 19.7 kN?
3. Which register assumption does it affect?
4. What would you ask the plant to do?

**Worked answer.**

1. Load 60 × 9.81 = **0.59 kN**; moment 0.59 × 0.3 = **0.18 kN·m**, applied part-way up the lower 2,000 mm segment.
2. Because the load is offset by 300 mm, twenty times the 15 mm offset the leg was designed for. The moment is amplified like any other bending in a compression member (Chapter 5), it adds to the bending from the existing offset, and the bracket's bolts or welds may damage the leg's wall. A small load with a large offset can matter more than a large load on the centreline.
3. **Offset ≤ 15 mm** and "nothing new attached to the legs".
4. Support the valve from its own stand or from the pipework, not from the leg. If that is impossible, ask the shop to check the leg with the bracket's moment added, and to design a clamp that does not need welding or drilling the leg. Either way, record the change in the register.
