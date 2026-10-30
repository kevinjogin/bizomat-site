---
book: plain-bearings-by-the-numbers
chapterSlug: sommerfeld-number-and-film-thickness
order: 4
title: "The Sommerfeld number and film thickness"
description: "Combine a journal bearing's variables into the Sommerfeld number, then find its eccentricity, thinnest film, attitude angle and peak pressure with the short-bearing solution and the WORKOS tool."
draft: false
---

Chapter 1 explained that a loaded journal moves off centre until its wedge generates enough pressure to carry the load. Where exactly it settles decides almost everything about the bearing: the thinnest film, on which its safety depends; the friction, through the correction Chapter 3 introduced; the oil that leaks from its ends; and the peak pressure its lining must bear. Finding that position is the central calculation of hydrodynamic bearing design.

This chapter combines the bearing's variables into a single dimensionless group, the Sommerfeld number, uses the short-bearing solution published by DuBois and Ocvirk in NACA Report 1157 to turn it into the eccentricity ratio, and from that finds FB-75's minimum film thickness, attitude angle and peak film pressure. It applies the WORKOS journal bearing design tool, looks at how the film responds to load, and ends with a dial indicator reading that was taken as a sign of a worn bearing when it showed the film doing its job.

## One number for the whole bearing

Viscosity and speed raise the film's pressure; load and clearance work against it. Sommerfeld showed in 1904 that, for a bearing of given proportions, they enter only in one combination. The Sommerfeld number is the clearance ratio squared times viscosity times speed over unit load. Two bearings with the same Sommerfeld number and the same length-to-diameter ratio run at the same eccentricity ratio, whatever their size.

```figure
type: formula
title: The Sommerfeld number and the short-bearing capacity number
formula: S = (r ÷ c)² × μN ÷ P
formula: Cₙ = S × (L ÷ D)²
caption: All quantities in consistent units: N in rev/s, μ in Pa·s and P in Pa. A large S means a lightly loaded or fast bearing running near centre; a small S a heavily loaded or slow one running close to the bore.
- r ÷ c | radius over radial clearance; FB-75: 40 ÷ 0.06 = 667
- μN ÷ P | viscosity times speed over unit load
- L ÷ D | length over diameter; FB-75: 0.75
- Cₙ | capacity number of the short-bearing solution
```

This is an illustration. For FB-75 at 66 °C, with μ = 0.0191 Pa·s, N = 24.67 rev/s and P = 1.25 MPa, S = 667² × 0.0191 × 24.67 ÷ 1.25 × 10⁶ = 0.1675. Its capacity number is 0.1675 × 0.75² = 0.0942.

## The short-bearing solution

Reynolds' equation has no general closed-form solution for a bearing of finite length. The classic way round it, developed by Michell and Cardullo and extended and tested by DuBois and Ocvirk at Cornell for the NACA, is to assume that the bearing is short enough that oil escapes mainly from its ends, and to neglect the effect of pressure on the flow around the circumference. The result is a set of formulas in the eccentricity ratio alone, and the NACA's tests found them useful for bearings with length-to-diameter ratios up to about one. FB-75's 0.75 is within that range.

```figure
type: formula
title: The short-bearing relations of NACA Report 1157
formula: Cₙ = (1 − ε²)² ÷ (π ε) × 1 ÷ √(π²(1 − ε²) + 16ε²)
formula: h_min = c × (1 − ε)
formula: tan φ = π √(1 − ε²) ÷ (4ε)
caption: Solve the first for ε given Cₙ, by trial or with the table below; the minimum film thickness and the attitude angle φ, the angle between the load line and the line through the two centres, then follow.
- ε | eccentricity ratio
- h_min | minimum film thickness
- φ | attitude angle
```

The first relation cannot be inverted algebraically, but it is smooth and easy to solve by trial, and a short table makes hand interpolation quick.

```figure
type: compare
title: Short-bearing capacity number and attitude angle by eccentricity ratio
cols: Capacity number Cₙ | Attitude angle φ | Film thickness ÷ clearance
rowhead: Eccentricity ratio ε
- 0.1 | 0.990 | 82.7° | 0.9
- 0.2 | 0.461 | 75.4° | 0.8
- 0.3 | 0.272 | 68.2° | 0.7
- 0.4 | 0.171 | 60.9° | 0.6
- * 0.5 | 0.106 | 53.7° | 0.5
- 0.6 | 0.0625 | 46.3° | 0.4
- 0.7 | 0.0330 | 38.7° | 0.3
- 0.8 | 0.0139 | 30.5° | 0.2
- 0.9 | 0.0033 | 20.8° | 0.1
caption: Calculated by KEVOS® from the NACA Report 1157 relations. FB-75's capacity number of 0.0942 lies between ε = 0.5 and 0.6.
```

This is an illustration. Solving for FB-75's capacity number of 0.0942 gives ε = 0.524. The minimum film thickness is 0.06 × (1 − 0.524) = 0.0286 mm, or 28.6 µm, and the attitude angle is arctan(π × √(1 − 0.524²) ÷ (4 × 0.524)) = 52.0°.

```figure
type: svg
title: FB-75's journal in its bearing at 66 °C, clearance greatly exaggerated
alt: A square housing contains a circular bore filled with oil. A smaller circle, the journal, sits inside it displaced down and to the right. A downward arrow on the journal marks the load. A dashed line from the bore centre through the journal centre points to the thinnest part of the film at lower right, and the angle between it and the vertical load line is labelled as the attitude angle of about 52 degrees. The thickest film is at upper left. A curved arrow shows the journal turning anticlockwise.
caption: This is an illustration. The journal turning anticlockwise drags oil to the right along the bottom of the bore into the narrowing gap, so it settles down and to the right of centre, 52° round from the load line. Clearance is drawn many hundreds of times too large.
viewbox: 0 0 640 320
body:
<rect class="bx" x="180" y="20" width="280" height="280" rx="6"/>
<circle class="fs" cx="320" cy="160" r="110"/>
<circle class="bxi" cx="328.3" cy="166.5" r="90"/>
<path class="cl" d="M320 30V296"/>
<path class="li dsh" d="M320 160L406.7 227.8"/>
<circle class="fi" cx="320" cy="160" r="3"/>
<circle class="fi" cx="328.3" cy="166.5" r="3"/>
<path class="la" d="M328.3 96V138"/>
<path class="ah" d="M328.3 150l-6-12h12z"/>
<text class="txa" x="338" y="112">load W</text>
<path class="la" d="M276.3 136.5A60 60 0 0 0 276.3 196.5"/>
<path class="ah" d="M281 205l-11-4 7-9z"/>
<text class="tx txs" x="190" y="290">attitude angle φ ≈ 52° from the load line</text>
<path class="ln" d="M402 224L470 268"/>
<text class="txb" x="476" y="272">thinnest film</text>
<text class="tx txs" x="476" y="290">h_min = c(1 − ε) = 28.6 µm</text>
<path class="ln" d="M236 94L150 60"/>
<text class="txb" x="20" y="54">thickest film</text>
<text class="tx txs" x="20" y="72">c(1 + ε) = 91.4 µm</text>
<text class="tx txs" x="20" y="300">journal turns anticlockwise</text>
```

## The journal bearing design tool

The [journal bearing design tool](/tools/journal-bearing-design/) brings the first design checks together. From the radial load, journal diameter, bearing length, radial clearance, speed, oil viscosity at the film temperature, the allowed oil temperature rise with the oil's specific heat and density, and the designer's limits on unit load, length-to-diameter ratio and Sommerfeld number, it calculates the unit load, L/D, surface speed, Sommerfeld number, Petroff friction torque, friction coefficient and power loss, and the oil flow needed to carry that heat at the allowed rise, and it checks each against the limits.

This is an illustration. For FB-75 at 66 °C the inputs are 6,000 N, 80 mm, 60 mm, 0.06 mm, 1,480 rpm, 19.1 mPa·s, an allowed oil temperature rise of 10 K, 1.9 kJ/(kg·K) and 870 kg/m³, with limits of 3 MPa, 0.5 to 1.5 and a smallest Sommerfeld number of 0.05.

```figure
type: steps
title: FB-75's drive-end bearing in the journal bearing design tool
caption: This is an illustration. The limits are the plant's design choices, not values from a standard. The tool uses Petroff's centred-journal friction; the short-bearing correction of Chapter 3 raises the loss to about 217 W.
- Unit load and L/D | 1.25 MPa against 3 MPa; 0.75 within 0.5 to 1.5
- Surface speed | 6.20 m/s
- * Sommerfeld number | 0.1675, against the smallest accepted, 0.05
- Friction | 1.190 N·m; coefficient 0.00496; loss 184.5 W
- Oil flow to carry the heat at a 10 K rise | 0.67 L/min
- Verdict | BEARING ADEQUATE; the starting check reminds the user that plain bearings run in mixed friction at start-up
```

The tool does not calculate eccentricity or film thickness. Its smallest-Sommerfeld-number check stands in for them: the designer chooses a limit that, for the bearing's proportions, corresponds to an acceptable film. The table above shows what a given limit means. For FB-75's L/D of 0.75, a Sommerfeld number of 0.05 is a capacity number of 0.028, which the short-bearing solution places at ε = 0.72, a film of 28% of the clearance, or 16.7 µm with FB-75's clearance. Using the tool and the table together gives both the quick checks and the film.

## How the film responds to load

Load enters the Sommerfeld number inversely, so doubling the load halves S. Because the capacity number falls steeply with eccentricity, the film thins much less than in proportion.

```figure
type: compare
title: FB-75's drive-end bearing under different loads at 66 °C
cols: Sommerfeld number | Eccentricity ratio | Thinnest film | Peak film pressure
rowhead: Load
- 3 kN | 0.335 | 0.378 | 37.3 µm | 1.51 MPa
- * 6 kN, design | 0.168 | 0.524 | 28.6 µm | 3.59 MPa
- 9 kN | 0.112 | 0.599 | 24.0 µm | 5.98 MPa
- 12 kN | 0.084 | 0.647 | 21.2 µm | 8.60 MPa
- 24 kN | 0.042 | 0.743 | 15.4 µm | 20.6 MPa
caption: This is an illustration. Short-bearing solution, viscosity held at 19.1 mPa·s; peak pressure from the NACA relation for the pressure peak. In reality more load also means more heat and a hotter film.
```

Quadrupling the load to 24 kN thins the film by less than half, from 28.6 to 15.4 µm. That is the hydrodynamic film's great virtue: it stiffens as it thins. But the peak film pressure rises much faster than the load, from 3.59 MPa at the design load to 20.6 MPa at four times it, because the pressure concentrates into a smaller region near the thinnest film. The lining must carry that peak, and white metal's fatigue strength, which falls as it gets hotter, is often what limits a heavily loaded bearing before its film does. Chapter 9 returns to it.

## Peak pressure and where it acts

The short-bearing solution also locates the pressure peak. For FB-75 at its design load, the peak of 3.59 MPa, almost three times the unit load of 1.25 MPa, lies 146.8° round from the thickest film in the direction of rotation, about 33° before the thinnest film. The whole positive pressure region lies in the converging half of the clearance, between the thickest and thinnest points. That region is where oil must never be fed or let out, as Tower discovered with his oil hole and Chapter 7 explains.

## How thin is too thin?

A calculated minimum film thickness is useful only against a standard of what is enough, and there is no single figure. The film must clear everything the calculation leaves out: the combined roughness of journal and bore, which Chapter 1 put at about 1.1 µm for FB-75; any misalignment across the bearing's length, which pinches the film at one end; out-of-roundness and taper in journal and bore; the shaft's bending under load; thermal distortion of the housing; and the largest particles the oil carries. Each of these is of the order of a few micrometres in a well-built machine of FB-75's size, and together they can consume much of a thin film.

Designers therefore set a minimum film thickness for each class of machine, larger for large, flexible or dirty machines and smaller for small, stiff, precise ones. ISO 7902 discusses the matter for full journal bearings, and bearing makers publish their own guidance. The plant's reliability engineer chose a minimum of 10 µm for FB-75's bearings in running, about nine times the composite roughness, leaving room for misalignment and particles. This is an illustration of the reasoning, not a recommendation for any other machine. At 28.6 µm, FB-75's drive-end film is nearly three times that minimum, and Chapter 5 shows that the margin survives the full range of manufacturing tolerance on the clearance.

## Scaling with the Sommerfeld number

Because two bearings with the same Sommerfeld number and the same length-to-diameter ratio run at the same eccentricity ratio, a bearing that is known to work can be used to judge a new one without solving any equations. Their film thicknesses then stand in the ratio of their clearances, and their attitude angles are the same.

This is an illustration. Suppose the plant considers a larger fan whose journals are 100 mm in diameter in bearings 75 mm long, the same L/D of 0.75, with a radial clearance of 0.075 mm, the same clearance ratio of 0.0015. If it runs at 1,480 rpm on the same oil and temperature and carries 9,375 N, its unit load is 9,375 ÷ (100 × 75) = 1.25 MPa, the same as FB-75's. Its Sommerfeld number is then identical, 0.1675, and so is its eccentricity ratio, 0.524. Its minimum film is 0.075 × 0.476 = 35.7 µm, scaled up with its clearance. Its friction, by Chapter 3's cubic dependence on diameter, is about twice FB-75's. Scaling of this kind is how experienced designers check new bearings against old ones, and it is a useful check on any calculation, by hand or by software.

## Limits of the short-bearing estimate

The short-bearing relations are an approximation, and three conditions push them outside the range in which the NACA's tests supported them. The first is length: as L/D rises above about one, circumferential pressure flow, which the approximation neglects, becomes important, and the estimates become less reliable. The second is very high eccentricity, above about 0.8 or 0.9, where the film is so thin that small departures from ideal geometry and the effects of heat dominate. The third is bearing geometry that departs from a plain full circle: partial-arc bearings, large grooves, lobed and tilting-pad bearings each need their own solutions. For FB-75, with L/D = 0.75 and ε = 0.52 in a plain bore with small axial grooves, the approximation is well within its range. For final design of any bearing, ISO 7902 or a bearing maker's software gives the full solution.

## The error: a journal that rises when it runs

This is an illustration. After a rebuild of FB-75's drive-end bearing, a fitter set up a dial indicator on top of the shaft next to the bearing to check that nothing moved when the fan started. As the fan came up to speed, the indicator showed the shaft rising 0.04 mm, and a second indicator on the side showed it moving about 0.025 mm sideways. Worried that the bearing had been reassembled loose, the fitter asked for the fan to be stopped.

The reliability engineer worked out what the film should do. At rest the journal sits on the bottom of the bore: its centre is a full radial clearance, 0.06 mm, below the bore's centre. Running at 66 °C it settles at an eccentricity of 0.524 × 0.06 = 0.0314 mm from the bore's centre, at 52° round from the load line. Its centre is then 0.0314 × cos 52° = 0.019 mm below the bore's centre and 0.0314 × sin 52° = 0.025 mm to the side. The journal should therefore rise by 0.06 − 0.019 = 0.041 mm and move sideways by 0.025 mm, in the direction its surface moves at the bottom of the bore.

```figure
type: compare
title: The shaft's movement at start-up: indicators against the short-bearing solution
cols: Measured | Calculated at 66 °C
rowhead: Movement
- Rise | about 0.04 mm | 0.041 mm
- Sideways, towards the rotating side | about 0.025 mm | 0.025 mm
caption: This is an illustration. Calculated from ε = 0.524 and φ = 52° with a radial clearance of 0.06 mm, measured from the journal resting on the bottom of the bore.
```

The indicators were showing the film forming, almost exactly as the theory predicts. The fan was restarted, and the measurement became part of the plant's commissioning record for the bearing: a journal that does not lift, or lifts much less than calculated, has too little clearance, too little oil or too much load; one that lifts much more than calculated has too much clearance. A shaft position measurement is one of the few direct ways to see a film's thickness in a running machine, and large machines carry proximity probes for exactly that purpose.

## Bringing it together

The Sommerfeld number combines a journal bearing's clearance ratio, viscosity, speed and unit load into one number that, with the length-to-diameter ratio, fixes how far the journal runs off centre. The short-bearing solution of NACA Report 1157 turns it into the eccentricity ratio, minimum film thickness, attitude angle and peak pressure. FB-75's drive-end bearing at 66 °C has S = 0.168, ε = 0.524, a thinnest film of 28.6 µm, an attitude angle of 52° and a peak pressure of 3.59 MPa. For final design, the full solutions of ISO 7902 or a maker's software replace the short-bearing estimates. The next chapter asks what clearance gives the best film.

## Exercise: the non-drive-end bearing

FB-75's non-drive-end bearing is identical but carries 4.5 kN. Taking its film viscosity as 19.1 mPa·s, find its Sommerfeld number, capacity number, eccentricity ratio from the table or by trial, minimum film thickness and attitude angle.

**Worked answer.** This is an illustration. The unit load is 4,500 ÷ (80 × 60) = 0.9375 MPa, so S = 667² × 0.0191 × 24.67 ÷ 937,500 = **0.223**, and Cₙ = 0.223 × 0.5625 = **0.126**. From the table, Cₙ = 0.126 lies between ε = 0.4 (0.171) and 0.5 (0.106); solving by trial gives **ε = 0.465**. The minimum film is 0.06 × (1 − 0.465) = **32.1 µm**, and the attitude angle is arctan(π × √(1 − 0.465²) ÷ (4 × 0.465)) = **56.2°**. In practice this bearing's housing also holds the fan's thrust face, whose heat Chapter 8 calculates, so its running temperature, and therefore its film viscosity, must come from a heat balance that includes both.
