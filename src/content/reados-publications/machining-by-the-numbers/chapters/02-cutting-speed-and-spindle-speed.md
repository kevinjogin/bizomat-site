---
book: machining-by-the-numbers
chapterSlug: cutting-speed-and-spindle-speed
order: 2
title: "Cutting speed and spindle speed"
description: "Convert cutting speed into spindle speed for turning, milling and drilling, handle constant surface speed and spindle limits, and calculate facing time and effective diameter."
draft: false
---

Cutting speed is the single most important variable for tool life. It is the speed at which the cutting edge travels relative to the surface of the work, usually given in metres per minute. Tool suppliers specify it because it governs the temperature at the cutting edge, and temperature governs how quickly most tools wear.

Machines, however, do not run at a cutting speed. They run at a spindle speed in revolutions per minute. Converting between the two is the first calculation in almost every machining job. It is simple, but the details, such as which diameter to use and what happens near the centre of a face, matter more than they first appear.

## The basic relationship

In one revolution, a point on the circumference of a diameter D travels πD millimetres. At n revolutions per minute it travels πDn millimetres per minute. Dividing by 1,000 converts to metres per minute:

**vc = π × D × n ÷ 1000**

Rearranged for spindle speed:

**n = 1000 × vc ÷ (π × D)**

with vc in m/min, D in mm and n in rev/min. In turning, D is the diameter of the work being cut. In milling and drilling, D is the diameter of the tool.

This is an illustration from the Harbourline flange. The estimator plans a cutting speed of 220 m/min for roughing the medium-carbon steel with a coated carbide insert.

| Feature | Diameter | Spindle speed at 220 m/min |
|---|---|---|
| Outside diameter, bar | Ø110 | 637 rev/min |
| Outside diameter, finished | Ø100 | 700 rev/min |
| Bore | Ø40 | 1,751 rev/min |

For Ø100: n = 1000 × 220 ÷ (π × 100) = 700.3 rev/min.

The bore needs more than two and a half times the spindle speed of the outside diameter for the same cutting speed. If a program ran the bore at the outside diameter's spindle speed, the cutting speed in the bore would be only about 88 m/min, well below the intended value. That can cause built-up edge, a poor finish and, ironically, shorter tool life.

```figure
type: formula
title: Spindle speed for the flange's outside diameter
formula: n = 1000 × vc ÷ (π × D)
caption: The same 220 m/min needs 637 rev/min on the Ø110 bar but 1,751 rev/min in the Ø40 bore.
- vc | cutting speed, m/min
- D | diameter being cut, mm
- n | spindle speed, rev/min
step: n = 1000 × 220 ÷ (π × 100)
step: n = 220,000 ÷ 314.16
step: n = 700 rev/min
```

## Converting older data

Much published data still uses surface feet per minute. The conversion is a single multiplication: 1 foot is 0.3048 m, so a recommendation of 700 surface feet per minute is about **700 × 0.3048 ≈ 213 m/min**. For the Ø40 bore, that corresponds to about 1,698 rev/min.

Convert the cutting speed first and then calculate the spindle speed in metric units, rather than converting a spindle speed calculated with inch diameters. Keeping one unit system through the calculation removes a common source of error, and recording the original figure and its units alongside the converted one lets anyone check the step.

## Speed follows the material

Recommended cutting speeds vary enormously between materials. Aluminium alloys are usually cut much faster than steels; stainless steels and heat-resistant alloys much slower; titanium and nickel alloys slower still, because they conduct heat poorly and concentrate it at the edge. Within steels, harder grades call for lower speeds. Cast irons have their own ranges, and their abrasive structure affects the choice of tool grade as much as speed.

These relationships are why cutting data is always given for a material group and condition, and why a spindle speed copied from one material to another is so often wrong. The tool supplier's data for the actual grade and material is the right starting point, with the calculation in this chapter turning it into a spindle speed for each diameter.

## Which diameter?

In a roughing pass the diameter changes as the tool cuts. Turning the outside diameter from 110 mm down to about 105 mm in one pass changes the cutting speed by a few per cent if the spindle speed is fixed. That is rarely important, and estimators often use the diameter at the middle of the cut. For finishing, use the finished diameter, because that is where surface quality is decided.

The difference becomes important when diameters vary widely in one operation, such as a face, a taper, or a part with steps. Then the machine's constant surface speed mode does the work.

## Constant surface speed and the spindle limit

CNC lathes can hold cutting speed constant automatically. In constant surface speed mode, programmed on many controls with G96, the machine continuously adjusts spindle speed as the tool's X position changes. Every point on a face or taper is cut at the same speed.

As the tool approaches the centre, the required spindle speed rises without limit. At the centre itself, D is zero and the formula would demand infinite speed. Every program using constant surface speed must therefore set a **maximum spindle speed**, often with G50 or G92 depending on the control. That limit is set by whichever is lowest: the machine's maximum speed, the chuck manufacturer's rated speed for the jaws and gripping force in use, or a safe speed for the part's balance and overhang.

With a 3,500 rev/min limit and a cutting speed of 220 m/min, the limit is reached at:

D = 1000 × 220 ÷ (π × 3500) = **20.0 mm**

Inside that diameter, the spindle stays at 3,500 rev/min and cutting speed falls in proportion to diameter. At Ø2 it is only π × 2 × 3500 ÷ 1000 = 22 m/min. Right at the centre it is zero, and the edge scrapes rather than cuts. That is why faces often show a small pip or a different finish at the centre, and why inserts can chip there. Where it matters, programs reduce feed near the centre or stop just short of it.

```figure
type: line
title: Cutting speed while facing to the centre with a 3,500 rev/min limit
x: Diameter being cut (mm)
y: Actual cutting speed (m/min)
ymin: 0
ymax: 240
mark: 20 | spindle limit reached at Ø20
caption: Constant surface speed holds 220 m/min down to Ø20; inside that, speed falls to zero at the centre, where the edge scrapes.
- 0 | 0
- 2 | 22
- 10 | 110
- 20 | 220
- 40 | 220
- 70 | 220
- 110 | 220
```

## Low spindle speed means high torque

Large diameters need low spindle speeds, and low spindle speeds bring a different limit into play. A spindle motor delivers its full power only above a certain speed; below it, the available torque is limited, so the power falls with speed. Many lathes list a torque or power curve in their manual for this reason.

The torque needed at the spindle follows from power and speed:

**T = 9,550 × P ÷ n**

with T in N·m, P in kW and n in rev/min. This is an illustration. If roughing the flange's outside diameter at 637 rev/min needs 5 kW at the cutting edge, the spindle must deliver about **9,550 × 5 ÷ 637 ≈ 75 N·m**. The same 5 kW in the Ø40 bore at 1,751 rev/min needs only about 27 N·m.

So a machine with ample power at high speed may still stall or slow on a heavy cut at a large diameter. Chapter 6 calculates the cutting power properly; the point here is that the spindle speed chosen for the right cutting speed also decides whether the machine can deliver the torque. Check both against the machine's curve, especially for large bar, big faces and heavy roughing.

## Time to face with constant surface speed

Facing time illustrates why constant surface speed is used. With constant cutting speed vc and feed f per revolution, the time to face from an outer radius R₁ inward to the radius Rc where the spindle limit is reached is:

**t₁ = π × (R₁² − Rc²) ÷ (1000 × vc × f)**

and the time from Rc to the centre at the limit speed is:

**t₂ = Rc ÷ (f × n_max)**

with radii in millimetres and the result in minutes. The first term comes from adding up, over each small step inwards, the time taken at the spindle speed needed for that radius.

For the Harbourline first-side face, from Ø110 to the centre at vc = 220 m/min, f = 0.20 mm/rev and a 3,500 rev/min limit:

- R₁ = 55 mm and Rc = 10.0 mm
- t₁ = π × (55² − 10²) ÷ (1000 × 220 × 0.20) = 0.209 min
- t₂ = 10 ÷ (0.20 × 3500) = 0.014 min
- Total: **0.223 min**, about 13 seconds

If the same face were cut at a fixed 637 rev/min, the speed suited to the outside diameter, the time would be 55 ÷ (0.20 × 637) = 0.432 min. Constant surface speed nearly halves the facing time and keeps the cutting speed correct over most of the face.

```figure
type: bars
title: Time to face Ø110 to the centre at 0.20 mm/rev
unit: min
caption: Constant surface speed nearly halves the facing time and keeps the cutting speed correct over most of the face.
- *Constant surface speed, 220 m/min | 0.223 | 0.209 to Ø20, then 0.014 at the limit
- Fixed 637 rev/min | 0.432 | correct speed only at the outside
```

## Milling and drilling: tool diameter and effective diameter

For milling cutters and drills, the spindle drives the tool, so D is the tool diameter. A Ø16 end mill at 180 m/min runs at 1000 × 180 ÷ (π × 16) = 3,581 rev/min. A Ø11 drill at 90 m/min runs at 2,604 rev/min.

Tools that do not cut at their full diameter need an **effective diameter**. A ball-nose cutter taking a shallow axial depth ap cuts on a circle smaller than its nominal diameter:

```figure
type: svg
title: Effective diameter of a ball-nose cutter at shallow depth
alt: A ball-nose cutter of 10 millimetre diameter touching a surface at 0.5 millimetre depth. The contact circle where it cuts has a diameter of only 4.36 millimetres.
caption: At ap = 0.5 mm a Ø10 ball nose cuts on Ø4.36, so spindle speed set for Ø10 gives only about 87 m/min instead of 200.
viewbox: 0 0 640 300
body:
<rect class="bx" x="270" y="20" width="100" height="140"/>
<path class="bx" d="M220 160H420A100 100 0 0 1 220 160Z"/>
<path class="fp" d="M60 238H580V280H60Z"/>
<path class="ln" d="M60 238H580"/>
<path class="lf dsh" d="M60 250H580"/>
<path class="la draw" pathLength="1" d="M276 250H364"/>
<path class="ln" d="M276 244V256M364 244V256"/>
<text class="txa" x="320" y="276" text-anchor="middle">D_eff = 2√(ap(D − ap)) = 4.36 mm</text>
<path class="li" d="M220 120H420M220 114V126M420 114V126"/>
<text class="txb" x="320" y="110" text-anchor="middle">D = 10 mm</text>
<path class="ln" d="M470 238V250M462 238H478M462 250H478"/>
<text class="tx" x="486" y="248">ap = 0.5 mm</text>
<path class="la spin" d="M300 60a20 8 0 1 0 40 0"/>
```

**D_eff = 2 × √(ap × (D − ap))**

This is an illustration. A Ø10 ball-nose cutter finishing with ap = 0.5 mm has D_eff = 2 × √(0.5 × 9.5) = 4.36 mm. If the spindle speed were set for 200 m/min at the full 10 mm diameter, 6,366 rev/min, the actual cutting speed at the contact point would be only about 87 m/min. To reach 200 m/min at the effective diameter would need 14,605 rev/min. On a machine limited to 12,000 rev/min, the best available is about 164 m/min. Knowing this explains finishes and tool wear that otherwise look mysterious, and it is one reason high-speed spindles suit fine finishing with small tools.

Chamfer mills, tapered tools and inserts with large nose radii taking light cuts have the same issue.

## Slow down for long overhangs

The cutting speed recommendation assumes a rigid set-up. A boring bar extended four or five times its diameter, a long drill or a slender end mill can vibrate at speeds that a short tool handles easily. Suppliers often recommend reducing cutting speed, and sometimes feed, as the overhang grows, and Chapter 7 explains the stiffness behind this.

For the Harbourline bore, a short, stiff boring bar can run at the full planned speed. If a longer bar were needed to reach a deeper bore, starting at a reduced speed and increasing it while listening for chatter and checking the finish is a safer path than starting at the catalogue value and backing off after a damaged insert.

## How precise does cutting speed need to be?

Cutting speed recommendations come with a range, and tool life is not very sensitive to small changes in either direction at the low end. At the high end, it can be very sensitive, as Chapter 8 shows: a 10% increase in speed can reduce tool life by a third or more. There is no point calculating spindle speeds to the last revolution, but systematic errors of 20% or more, such as using the wrong diameter or forgetting the spindle limit, change results noticeably.

## Check a program's speeds in two minutes

Before running a new or edited program, a quick table catches most speed errors. List each tool and pass, the diameter it cuts, the programmed spindle speed or constant surface speed, and the maximum spindle speed set. Calculate the cutting speed for each fixed-speed pass and compare it with the planned value. Confirm that every constant surface speed block has a maximum speed that respects the machine, chuck and part limits.

Any line where the calculated speed differs from the plan by more than about a fifth deserves a second look. The check takes minutes, and it finds the errors that otherwise show up as worn tools, poor finishes or, worse, a chuck run above its rated speed.

## Common mistakes

- **Fixed spindle speed on varying diameters.** Use constant surface speed for faces, tapers and stepped profiles, with a correct maximum speed.
- **Exceeding chuck or part limits.** The maximum speed must respect the chuck's rating and the part's balance, not only the machine.
- **Ignoring effective diameter** for ball-nose and tapered tools.
- **Assuming the centre of a face is cut properly.** Speed there approaches zero.
- **Using bore speed for outside diameters, or the reverse,** when copying cycles between features.

## Questions to ask

- What diameter is actually in contact with the tool for this pass?
- What maximum spindle speed applies, and what sets it?
- Does any tool cut at less than its nominal diameter?
- At what diameter does constant surface speed reach the spindle limit, and does that affect the finish at the centre?

## Exercise: calculate a speed table

For one part you make regularly, list every turned diameter and every milling or drilling tool. Calculate the spindle speed for your normal cutting speed on each, and the diameter at which constant surface speed reaches your machine's spindle limit. Check the speeds in the current program against your table.

The next chapter adds feed and depth of cut to cutting speed and calculates metal removal rate, machining time and surface finish in turning.
