---
book: rubber-parts-by-the-numbers
chapterSlug: relaxation-set-ageing-and-ozone
order: 8
title: "Relaxation, set, ageing and ozone"
description: "Estimate how rubber's force fades with time, how compression set loosens a clamped seal, how heat and ozone age a part, and catch plugs stored inflated that cracked on the shelf."
draft: false
---

A rubber part is not the same part a year after it is made, or even a day after it is loaded. Held stretched, its stress slowly falls. Held compressed, it slowly takes a permanent set and pushes back less. Kept warm, it ages, getting harder or softer as its network changes. Left stretched in ordinary air, it can crack, attacked by the small amount of ozone the air always contains. None of these shows up in a calculation made on the day the part is designed, and all of them decide how long it will do its job.

This chapter puts rough numbers on relaxation and set for TP-100, explains why relaxation is harmless for the plug's sleeve but not for its clamped ends, describes heat ageing and ozone cracking, and records a batch of plugs ruined in storage by a well-meant habit.

## Stress relaxation

Stretch rubber to a fixed length and hold it there, and the force it exerts falls with time, quickly at first and then more slowly. For many compounds at room temperature, the fall is roughly proportional to the logarithm of time: the stress drops by about the same percentage in each decade of time, from one minute to ten, ten to a hundred, and so on. Physically, chains and filler structures rearrange to relieve the stress, and at higher temperatures chemical changes add a slower, continuing loss.

The rate varies widely between compounds. Natural rubber compounds designed for low relaxation lose a few per cent per decade; some filled or poorly cured compounds lose much more. This is an illustration. The manufacturer measured TP-100's compound in a fixed-stretch test and found a loss of about **3% per decade of time** at 20 °C.

```figure
type: bars
title: Pressure taken by TP-100's sleeve while held in the pipe, with relaxation
unit: kPa
max: 40
caption: This is an illustration. 3% stress loss per decade of time from one minute, applied to the sleeve's 33.2 kPa share of the inflation pressure. As the sleeve relaxes, more of the 150 kPa becomes contact pressure.
- 1 minute | 33.2
- 10 minutes | 32.2
- 1 hour | 31.4
- *24 hours | 30.1
- 7 days | 29.2
```

For the inflated sleeve, relaxation is harmless and even slightly helpful. The air pressure is what pushes the sleeve against the pipe, and the sleeve's own tension subtracts from it. As the sleeve relaxes, it takes less of the pressure, so the contact pressure rises: from 116.8 kPa after a minute to about 119.9 kPa after a day. Relaxation would matter if the rubber itself supplied the contact force, as it does in a solid seal; here, the air does.

## Compression set

Squeeze rubber, hold it, and release it, and it does not quite recover its original thickness. The unrecovered part, expressed as a percentage of the squeeze, is the **compression set**. It is measured by standard tests, such as ISO 815-1, which squeeze a button by a set amount at a set temperature for a set time and measure its recovery. Data sheets quote it as, for example, a percentage after 22 hours at 70 °C. A low compression set means a seal that keeps pushing back.

TP-100's sleeve is clamped at each end into a groove in its end plate. This is an illustration. The 4 mm wall is squeezed by 1.0 mm, 25% of its thickness, and the clamp's grip and seal depend on the rubber pushing back against that squeeze. As the rubber takes a set, its effective squeeze, and roughly in proportion its clamping force, falls.

```figure
type: compare
title: Clamped end of TP-100's sleeve after compression set
cols: Effective squeeze remaining | Clamping force, fraction of new
caption: This is an illustration. 4 mm wall squeezed 1.0 mm; force taken as roughly proportional to the remaining squeeze, which is a simplification. Real set depends on time, temperature and compound.
- New | 1.00 mm | 1.00
- 15% set | 0.85 mm | 0.85
- *25% set | 0.75 mm | 0.75
- 35% set | 0.65 mm | 0.65
```

The axial pull of 210 N on each end clamp, from Chapter 4, and the seal against inflation air both rely on that squeeze. The manufacturer's clamp design keeps enough margin to tolerate 35% set and still hold, and its specification for the compound limits compression set to 25% in the standard test at the supplier's chosen conditions. It also tells users to check each clamp's tightness at every inspection, because a loosening clamp is the first sign of set.

## Creep

Relaxation is the fall in stress at a fixed stretch. Its twin is **creep**, the slow growth in stretch under a fixed load. The same molecular rearrangements cause both, and a compound that relaxes 3% per decade also creeps by a similar proportion per decade under a constant load.

Creep is what turned a marginal friction grip into a sliding plug in Chapter 6's café incident. Under the steady end thrust of the test water, the sleeve's contact patch sheared very slightly, and over twenty minutes the accumulated shear, together with a film of fat, let the plug move. A part that holds a steady load through rubber, whether a plug, a rubber bush or a clamped seal, should be checked for creep over the full time it will be loaded, not just for its first response. The slip test's thirty-minute hold in Chapter 6 is a creep test in all but name.

## Fatigue and cut growth

TP-100 is inflated and deflated hundreds of times over its life, and each cycle stretches the sleeve from rest to a hoop stretch of about 1.15. Uncut rubber survives very many cycles at that modest stretch. Its fatigue life is governed instead by the growth of small cuts and flaws: each cycle opens a cut a little, and the cut grows by a small amount that depends on the tearing energy at its tip, which rises with the stretch and with the cut's length. Natural rubber resists cut growth unusually well because it crystallises at the tip of a cut when stretched, which is one reason it is chosen for TP-100.

The practical consequence is that a sleeve's life depends far more on how it is handled than on how many times it is inflated. A sleeve dragged over a burred pipe end may start a cut on its first use that grows over the next fifty; a sleeve handled carefully may reach its 500-inflation retirement with no visible damage. That is why the inspection criteria below put cuts first.

## Heat ageing

Rubber compounds change chemically over time, faster when warm. Natural rubber's network tends to break down and soften with heat and oxygen; some synthetic rubbers tend to cross-link further and harden. Either way, tensile strength and elongation at break fall, and the compound's stiffness drifts. Ageing tests hold specimens in an oven for days or weeks at an elevated temperature and measure the change in hardness, strength and elongation; the supplier's data sheet reports them.

As a rough guide, reaction rates in rubber ageing often roughly double for each 10 °C rise in temperature, which is why a part stored in a hot vehicle ages much faster than one in a cool store. The rule is approximate and compound-dependent, and accelerated tests at high temperature can mislead if the chemistry changes with temperature. For TP-100, the practical consequences are a storage instruction, kept cool and out of the sun, and a retirement age. Ageing also changes the numbers earlier chapters relied on. A sleeve that has hardened by five points is stiffer, so it takes more of the inflation pressure and leaves less for contact, and its elongation at break has fallen, so it tears at a smaller stretch. A sleeve that has softened has a lower free-inflation limit. Either way, an aged sleeve is a different part from the one the calculations described, which is why the inspection below includes a hardness check against the new value.

## Ozone

Ozone is present in outdoor air at low concentrations, and more near electric motors, welding and photocopiers. It attacks the double bonds in natural rubber and several other polymers. In unstretched rubber the attack is superficial, but in stretched rubber it opens fine cracks at right angles to the stretch, which grow over time and can eventually cut through the part. The cracks appear only above a small threshold strain, and they are worst in rubber held at a modest, constant stretch for a long time.

Compounds resist ozone in two ways: by their polymer, since EPDM, silicone and some others have few or no vulnerable bonds, and by protective additives, waxes that bloom to the surface and chemical antiozonants. Natural rubber compounds for outdoor use are protected this way, but protection is finite and is weakened by cleaning off the surface wax. Ozone resistance is tested by exposing stretched specimens to a controlled ozone concentration, as in ISO 1431-1, and inspecting them for cracks.

## The error: plugs stored inflated

This is an illustration. A drainage contractor bought six TP-100 plugs and, to make sure none leaked, adopted the habit of storing them on a workshop shelf inflated to about 50 kPa, so that a flat plug would be noticed. The shelf was beside the workshop's welding bay. After about two months, a plumber inflating one in a pipe noticed a hiss and found a fine crack across the sleeve. Inspection of all six showed networks of small cracks running along the length of each sleeve, perpendicular to its hoop stretch.

The cracks were ozone cracks. Inflated to 50 kPa in free air, each sleeve was held at a hoop stretch of about 1.3 for weeks, well above the threshold for ozone attack, in air enriched with ozone from the welding arcs nearby. Natural rubber's protective wax had been partly wiped off by handling. The plugs had no fault when new; the storage habit had created the conditions for exactly the failure the compound is most vulnerable to.

All six sleeves were scrapped; the plugs were re-sleeved at the contractor's cost. The manufacturer added a storage instruction in bold to the plug's label and manual: store deflated, in the bag supplied, away from sunlight, electric motors and welding. It also added a pre-use check that would have caught the cracks: stretch the sleeve gently by hand, or inflate it slightly inside a test pipe, and look for cracks, which are easier to see when the rubber is stretched.

The lesson is general: a rubber part's storage is part of its design. Rubber stored stretched, warm or near ozone sources ages faster than rubber in use, and a well-meant habit, such as keeping a part inflated to check it, can destroy it.

## Life and retirement

Pulling these effects together, a rubber part's life is usually set by one of four limits, and the inspection and retirement criteria should address each:

```figure
type: checklist
title: TP-100 inspection before each use and retirement criteria
caption: This is an illustration of the manufacturer's criteria for its fictional plug. Real products carry their makers' own criteria, and any plug with doubt about its condition should be withdrawn.
- ? Cuts, nicks or abrasion on the sleeve | retire if any cut is visible, however small
- ? Cracks when gently stretched | retire if any crack is seen
- ? Clamps tight, no movement of sleeve in groove | re-tighten once; retire if loose again
- ? Hardness change | retire if more than 5 points above or below the new value
- ? Inflation test in test pipe | retire if the gauge falls more than the cooling allowance in 20 minutes
- ? Age and uses | retire after 3 years from manufacture or 500 inflations, whichever first
```

Each criterion is tied to a mechanism: cuts to tearing, cracks to ozone, clamps to compression set, hardness to ageing, the inflation test to leaks and set together, and age to everything the others might miss. A retirement age set from tests and field experience is more reliable than waiting for a visible defect, because some ageing changes, such as loss of elongation at break, are invisible until the part fails.

### Specifying for life

Life starts with the compound specification. For TP-100, the manufacturer's specification adds to the hardness and tensile requirements of Chapter 2: a maximum compression set in a stated standard test; a maximum change in hardness, strength and elongation after a stated oven-ageing test; a pass in a stated ozone-resistance test at a stated stretch; and a stress-relaxation figure from the supplier's own test. Each batch arrives with a certificate for the tests that can be run quickly and with the supplier's statement that the compound has not changed for the others. Each sleeve is moulded with its cure date, so that the three-year retirement can be applied from the date on the part rather than from a purchase record that may be lost.

## Exercise: a solid seal instead of an inflated one

A competitor's plug seals with a solid rubber ring compressed axially by a wing nut, with no air. Its ring is squeezed to give a contact pressure of 120 kPa when new. Assuming the same 3% per decade stress relaxation:

1. What contact pressure would remain after 24 hours under load, and after 7 days?
2. Why does the inflated plug not suffer the same loss?

**Worked answer.**

1. One minute to 24 hours is 3.16 decades, so the stress falls by about 9.5%, to about **109 kPa**. To 7 days, 4.0 decades and 12%, about **106 kPa**. The real loss also depends on temperature and the compound, and a solid seal that is re-tightened after settling recovers some of it.
2. In the inflated plug, the contact pressure comes from the air, and the rubber's own stress subtracts from it. When the rubber relaxes, the subtraction gets smaller and the contact pressure rises slightly. In the solid seal, the contact pressure is the rubber's own stress, so relaxation reduces it directly. Inflated seals have their own risk, the trapped air cooling, which Chapter 7 covered; each design trades one time-dependent effect for another.
