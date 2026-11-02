---
book: ultrasonic-testing-by-the-numbers
chapterSlug: remaining-life-and-inspection-intervals
order: 6
title: "Remaining life and inspection intervals"
description: "From survey readings to a decision: minimum required thickness for pipe and vessel shells, corrosion rate, remaining life, its uncertainty, the next inspection date and when to repair or replace."
draft: false
---

The point of a thickness survey is a decision: leave the item alone until the next survey, inspect it sooner, repair it or replace it. The decision rests on three numbers. The minimum thickness the item needs to hold its pressure and loads, the rate at which it is losing metal, and the thickness it has now. From them follow the remaining life and the date by which the next inspection must happen.

This chapter calculates the minimum required thickness for the juice line and the flash vessel, turns Chapter 5's survey into remaining lives and inspection dates, puts an uncertainty on them, and finishes with a remaining life that was doubled by using the wrong minimum thickness.

## The minimum required thickness

A pipe or vessel wall must be thick enough for two separate reasons. It must resist the hoop stress from internal pressure, and it must be stiff and strong enough for everything else: its own weight and contents between supports, wind, the reactions at supports and nozzles, knocks during maintenance, and the forces of a pressure surge. For a large, high-pressure vessel the first usually governs. For a small, low-pressure pipe the second usually does, and the pressure thickness is a small fraction of the real minimum.

### Pressure thickness

For a thin cylinder, the hoop stress is the pressure multiplied by the radius divided by the wall thickness. Setting it equal to an allowable stress, reduced by a joint efficiency where the wall contains a longitudinal weld, gives the pressure thickness. Barlow's formula uses the outside diameter; pressure vessel codes use the inside radius with a small correction.

```figure
type: formula
title: Pressure thickness of a cylinder under internal pressure
formula: Barlow, on the outside diameter: t_p = p D_o ÷ (2 S E)
formula: Vessel code form, on the inside radius: t_p = p R_i ÷ (S E − 0.6 p)
formula: Minimum required thickness: t_min = larger of t_p and the structural minimum
caption: p is the design pressure, S the allowable stress at design temperature and E the joint efficiency. Corrosion allowance is not part of t_min: it is the metal above t_min that corrosion is allowed to consume.
- t_p | pressure thickness, mm
- D_o | outside diameter; R_i inside radius, mm
- S | allowable stress, MPa; E joint efficiency
```

### The structural minimum

The structural minimum is the thinnest wall the owner will accept for reasons other than pressure. It is set by the piping code or the owner's engineering standard, by a stress analysis of the line, or by experience with similar lines. For the juice line, the mill's engineering standard sets 3.0 mm for DN150 carbon steel process pipe, based on the spans between supports, the weight of the full line and the mill's experience of pipe that has buckled or been holed by maintenance work when thinner. It is the mill's figure, used here as an illustration; a real structural minimum must come from the applicable code or an engineering assessment.

## The juice line

The [corrosion remaining life tool](/tools/corrosion-remaining-life/) works the whole calculation from two thickness readings. For CML 7, elbow 2, the worst location: earlier thickness 6.20 mm, five years between readings, present thickness 5.45 mm, outside diameter 168.3 mm, design pressure 10 bar, allowable stress 138 MPa, joint efficiency 1.0 for seamless pipe, structural minimum 3.0 mm, 20 years required, inspection at 50% of the remaining life and a longest interval of 5 years.

```figure
type: stats
title: Remaining life of juice line JL-4 at elbow 2, from the corrosion remaining life tool
caption: This is an illustration. The pressure thickness by Barlow's formula is 0.61 mm; the 3.0 mm structural minimum governs, as it usually does for low-pressure small-bore pipe.
- 0.150 mm/y | corrosion rate from the two readings
- 0.61 mm | pressure thickness, Barlow's formula
- 3.0 mm | minimum required thickness: the structural minimum governs
- 2.45 mm | wall above the minimum
- 16.3 years | remaining life, to about 2042
- 5 years | next inspection: half the life is 8.2 years, capped at 5
```

The tool reports that the line's life at elbow 2, 16.3 years, is shorter than the 20 years the mill wants from it. The rest of the line is in much better condition. With elbow 2 excluded, the next worst location is elbow 3, CML 11, at 6.21 mm and 0.082 mm a year, whose remaining life is (6.21 − 3.0) ÷ 0.082 = 39 years. The decision is therefore not about the line but about one fitting: replace elbow 2, a few hours' work in the slack season, and the line's life is set by elbow 3 at about 39 years. The mill schedules the elbow's replacement for next season and, in the meantime, keeps it at the five-year interval with a scan at every slack season, which costs five minutes.

### The uncertainty in the life

Chapter 5 estimated the uncertainty of a five-year rate from two readings, each uncertain by about ±0.04 mm, as ±0.011 mm a year. At elbow 2, that puts the rate between 0.139 and 0.161 mm a year and the remaining life between 15.2 and 17.6 years. The conclusion, that elbow 2 will not last 20 years, holds across the range.

A bigger source of uncertainty than the readings is the assumption that the rate stays constant. Erosion–corrosion depends on the flow rate and the sand load, which vary from season to season, and Chapter 5 found that elbow 2's short-term rate is already well above its long-term rate. That is what the inspection interval is for: it limits how far the actual wall can fall below the prediction before someone looks again.

## The flash vessel

V-12's shell is 10 mm plate rolled to 1,200 mm inside diameter, designed for 0.70 MPa with a joint efficiency of 0.85 and a corrosion allowance of 1.5 mm. The [pressure vessel shell plan tool](/tools/vessel-shell-plan/) gives the required thickness of the shell and of its 2:1 ellipsoidal heads by the vessel code formulas.

```figure
type: compare
title: Flash vessel V-12: required and measured thickness
cols: Shell | 2:1 ellipsoidal heads
rowhead: Quantity
- Pressure thickness, no corrosion allowance | 3.59 mm | 3.58 mm
- Required with 1.5 mm corrosion allowance, as designed | 5.09 mm | 5.08 mm
- Plate supplied | 10 mm | 10 mm
- MAWP of the full 10 mm plate, less allowance | 1.648 MPa | 1.659 MPa
- Lowest reading, 2026 survey | 9.86 mm | 9.71 mm
- Lowest reading, 2021 survey | 10.02 mm | 9.86 mm
caption: This is an illustration. Required thicknesses and MAWP from the pressure vessel shell plan tool with p = 0.70 MPa, D = 1,200 mm, S = 138 MPa and E = 0.85. Readings from the shell grid and head scans.
```

The vessel's shell lost 0.16 mm in five years, 0.032 mm a year, and the heads 0.15 mm, 0.030 mm a year. Taking the shell's pressure thickness of 3.59 mm as its minimum, its remaining life is (9.86 − 3.59) ÷ 0.032 = 196 years. The remaining life tool, using Barlow's formula on the 1,220 mm outside diameter with the same stress and joint efficiency, gives a pressure thickness of 3.64 mm and a remaining life of 194 years; the two methods agree to within 2%. Corrosion of the shell is not a concern.

That does not mean the vessel can be left alone for 97 years, half its remaining life. Vessels fail in ways that a thickness grid does not see: cracking at nozzle welds, corrosion under insulation, damage to supports, and, in a flash vessel, erosion where the incoming condensate flashes and impinges on the shell opposite the inlet. AS/NZS 3788 sets the framework for the inspection of pressure vessels in service, and the competent inspection body sets V-12's interval, scope and methods. The survey's job is to feed that body accurate thickness data, including a scan of the impingement area opposite the inlet nozzle at every inspection, where the lowest shell readings have always been found.

### Comparing head types

The [pressure vessel thickness tool](/tools/pressure-vessel-thickness/) compares the required thickness of a cylindrical shell with hemispherical, 2:1 ellipsoidal and torispherical heads for the same conditions. For V-12 it gives 5.09 mm for the shell, 3.29 mm for a hemispherical head, 5.08 mm for a 2:1 ellipsoidal head and 7.84 mm for a torispherical head, all including the 1.5 mm allowance. The comparison matters when a replacement head is being considered: a torispherical head of the same 10 mm plate would have much less margin than V-12's ellipsoidal heads, and the head's knuckle, where its stress is highest, would then become the place to survey most closely.

### What the inspection body receives

The mill does not send the inspection body a remaining life; it sends the evidence for one. For V-12 that means the grid drawing with every reading, the head and impingement-area scans with the positions of their minima, the gauge, probe and calibration record, the surface temperature and the mode used through the paint, and the previous survey's readings at the same points. The body then decides the vessel's next inspection, which may include methods the thickness survey cannot provide, such as an internal visual inspection or a check of the nozzle welds for cracking. A survey report that gives only a minimum reading and a calculated life forces the body either to trust a calculation it cannot check or to ask for the survey to be repeated, and the second is the usual result.

## When to inspect next

The rule the mill uses, inspecting again at no more than half the remaining life and never more than five years apart, is a common approach in in-service inspection practice. Its logic is simple. If the rate doubled immediately after the survey, the wall would reach its minimum at half the predicted remaining life, so an inspection at half the remaining life would catch it in time. A cap on the interval protects against changes that no rate predicts.

```figure
type: line
title: Elbow 2's predicted wall, with the next two inspections
x: Year
y: Wall thickness at elbow 2, mm
ymin: 2.5
ymax: 6.5
caption: This is an illustration. Linear wear at 0.150 mm/y from 5.45 mm in 2026 reaches the 3.0 mm structural minimum in about 2042. Inspections at five-year intervals fall in 2031 and 2036, each well before the minimum is reached; the elbow's replacement next season ends the projection.
- 2021 | 6.20
- 2026 | 5.45
- 2031 | 4.70
- 2036 | 3.95
- 2042 | 3.05
```

The interval also depends on how much is known. A new item with no history has no rate, so its first inspection comes early, and the mill's procedure inspects new fittings like the reducer after one crushing season to establish a rate before setting a longer interval.

## Options when the life is too short

A remaining life shorter than required is the start of a decision, not the decision itself. The mill considered five options for elbow 2.

```figure
type: compare
title: Options for elbow 2, whose life of 16.3 years is short of 20
cols: Effect on life | Cost and effort | Verdict
rowhead: Option
- Do nothing, inspect every slack season | none; wear continues at 0.150 mm/y | five minutes a year | acceptable for now, not for 20 years
- Replace with a like-for-like Schedule 40 elbow | about 27 years from new: (7.11 − 3.0) ÷ 0.150 | a few hours in the slack season | adequate if the rate does not rise
- * Replace with a Schedule 80 elbow, 10.97 mm wall | about 53 years: (10.97 − 3.0) ÷ 0.150 | slightly dearer fitting; bore matched at the welds | chosen: margin against a rising rate
- Reduce flow velocity or sand load | slows wear at every fitting | process change, not a maintenance job | referred to the factory's process engineers
- Fitness-for-service assessment of the thin area | may justify a lower local minimum | engineering effort; needs good data | not needed while replacement is cheap
caption: This is an illustration. Lives are from new at the elbow's present rate; a Schedule 80 elbow welded to Schedule 40 pipe needs its bore matched at the weld so that the step does not itself disturb the flow.
```

The heavier elbow costs little more than a standard one and gives nearly twice the life at the present rate, which matters because elbow 2's rate is rising. Changing the process to bring less sand into the juice would help every fitting on the line, but it is a factory decision with costs and benefits well beyond the juice line, and the reliability engineer passed the survey data to the process team rather than waiting for it.

A fitness-for-service assessment, by methods such as those in API 579-1/ASME FFS-1, can show that a locally thinned area is acceptable below the general minimum, because the surrounding full-thickness metal carries much of its load. It is the right tool when replacement is difficult or expensive, such as on a large vessel or a buried line. For a DN150 elbow that can be replaced in a morning, the assessment would cost more than the fitting. Whatever the option, the next survey must measure the result: the new elbow gets a baseline reading before the crushing season and a scan after it.

## The mistake: a remaining life doubled by the wrong minimum

When the reliability engineer's graduate first worked the juice line's remaining life by hand, the answer came out at 32 years, comfortably more than the 20 the mill wanted. The graduate had used Barlow's formula for the minimum thickness, 0.61 mm, and calculated (5.45 − 0.61) ÷ 0.150 = 32.3 years.

```figure
type: steps
title: Finding the wrong minimum thickness
caption: This is an illustration. The pressure thickness alone would let the wall corrode to less than a tenth of its original thickness, which no structural assessment of a 168 mm line on supports would accept.
- Graduate's calculation | (5.45 − 0.61) ÷ 0.150 = 32.3 years: life adequate
- Review question | what wall would be left at the end of that life? 0.61 mm on a 168.3 mm pipe
- Engineering standard checked | structural minimum for DN150 process pipe is 3.0 mm
- * Corrected calculation | (5.45 − 3.0) ÷ 0.150 = 16.3 years: life shorter than required
- Decision | replace elbow 2 next slack season; line life then set by elbow 3 at about 39 years
```

The review question that caught it was not about the formula but about the result: what would be left at the end of the predicted life? A DN150 pipe with 0.61 mm walls could hold 10 bar in a perfectly uniform, unloaded state, but it would be crushed by a ladder, holed by a dropped spanner and unable to carry its own weight between supports. The structural minimum, 3.0 mm, governs, and with it the life is 16.3 years, half the graduate's figure. The remaining life tool reports both thicknesses and takes the larger as the minimum, which is the protection against this error.

## Exercise: elbow 3 after elbow 2 is replaced

After elbow 2 is replaced, elbow 3 (CML 11) sets the line's life. Its scanned minimum was 6.62 mm in 2021 and 6.21 mm in 2026. Using the corrosion remaining life tool's method, with the same pipe, pressure, stress, structural minimum and interval rule as elbow 2, calculate the rate, the remaining life, whether it meets 20 years, and the next inspection date. Then say what the mill should watch for, given that elbow 2's replacement changes the flow upstream of elbow 3.

### Answer

**Given:** 6.62 mm (2021), 6.21 mm (2026); D = 168.3 mm; p = 10 bar = 1.0 MPa; S = 138 MPa; E = 1.0; structural minimum 3.0 mm; life required 20 years; inspect at 50% of remaining life, capped at 5 years.

**Assumptions:** constant rate; the scanned minimum is the true minimum; the replacement of elbow 2 does not change elbow 3's wear.

**Method:** rate from two readings; pressure thickness by Barlow; minimum = larger of pressure and structural; life = wall above minimum ÷ rate; interval = smaller of half the life and 5 years.

**Rate:** (6.62 − 6.21) ÷ 5 = 0.082 mm a year.

**Pressure thickness:** 1.0 × 168.3 ÷ (2 × 138 × 1.0) = 0.61 mm; the minimum is 3.0 mm, the structural minimum.

**Remaining life:** (6.21 − 3.0) ÷ 0.082 = 3.21 ÷ 0.082 = 39.1 years, more than the 20 years required.

**Next inspection:** half the life is 19.6 years; the cap of 5 years governs, so by the 2031 slack season.

**What to watch:** elbow 2's replacement removes the most worn surface upstream of elbow 3 but does not change the sand load or the flow rate. If anything, the new elbow's smooth bore may alter the flow pattern reaching elbow 3. The mill should scan elbow 3's band at every slack season for the next two seasons, recording the position of the minimum, to confirm the rate before relying on a five-year interval.

**Verification:** entering the same figures in the corrosion remaining life tool gives a rate of 0.082 mm a year, a minimum of 3.0 mm, 3.21 mm above it, a remaining life of 39.1 years and a next inspection within 5 years. The rate's uncertainty of ±0.011 mm a year from Chapter 5 puts the life between 34 and 45 years, comfortably above 20 in every case.
