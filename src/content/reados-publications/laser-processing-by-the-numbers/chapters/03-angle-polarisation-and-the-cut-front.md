---
book: laser-processing-by-the-numbers
chapterSlug: angle-polarisation-and-the-cut-front
order: 3
title: "Angle, polarisation and the cut front"
description: "How absorptivity changes with the angle of incidence and polarisation, why the steep cut front matters, and why a CO₂ laser with a failed polariser cuts better in one direction."
draft: false
---

A laser cut is not made by a beam hitting a flat surface square on. Once the cut is moving, the beam strikes a steep front of molten metal that slopes away ahead of it, at an angle of incidence close to grazing. At those angles a metal's absorptivity depends strongly on the direction in which the light's electric field oscillates, its polarisation. That one fact explains why CO₂ cutting machines carry a special mirror to make their beam circularly polarised, why fibre lasers do not need one, and why the fabricator's old CO₂ machine suddenly began to cut better in one direction than the other.

This chapter sets out how absorptivity changes with angle and polarisation, calculates it for the cell's two wavelengths, works out the angle at which the beam meets the cut front, and uses the result to diagnose the LC-2.

## Two polarisations

Light is a wave whose electric field oscillates at right angles to its direction of travel. When light meets a surface at an angle, the plane containing the incoming ray and the normal to the surface is called the plane of incidence. Any polarisation can be split into two parts. In p-polarisation, the electric field oscillates in the plane of incidence; in s-polarisation, from the German senkrecht, it oscillates perpendicular to it, parallel to the surface.

At normal incidence the two are indistinguishable. As the angle grows they part company. The s-polarised field lies along the surface, where the metal's electrons can cancel it efficiently, so its reflectivity rises towards one. The p-polarised field has a component pointing into the surface; for a transparent material, there is an angle, Brewster's angle, at which it is not reflected at all, and for a metal there is an angle near grazing at which its reflectivity is lowest and its absorptivity highest.

```figure
type: formula
title: Fresnel reflection coefficients at a metal surface, from air
formula: N = n + ik;  cos θₜ = √(1 − sin²θ ÷ N²)
formula: rₛ = (cos θ − N cos θₜ) ÷ (cos θ + N cos θₜ)
formula: rₚ = (N cos θ − cos θₜ) ÷ (N cos θ + cos θₜ)
formula: Aₛ = 1 − |rₛ|²,  Aₚ = 1 − |rₚ|²,  unpolarised or circular: A = (Aₛ + Aₚ) ÷ 2
caption: θ is the angle of incidence from the surface normal. N is the metal's complex refractive index at the laser wavelength, and θₜ a complex angle inside the metal. The coefficients are complex numbers; the reflected share of power is the square of their magnitude.
- n, k | refractive index and extinction coefficient of the metal
- θ | angle of incidence, degrees from the normal
- Aₛ, Aₚ | absorptivity for s- and p-polarised light
```

The calculation needs complex arithmetic but nothing more, and a few lines of code or a spreadsheet with complex functions will do it. The inputs are the two optical constants n and k of the metal at the laser wavelength.

## Absorptivity against angle for the cell's two lasers

The cell's planning uses assumed optical constants for steel: N = 3.0 + 4.0i at 1.07 µm, which gives a normal-incidence absorptivity of 0.375, and N = 10 + 30i at 10.6 µm, which gives 0.039, close to the Hagen–Rubens estimate in Chapter 2. They are representative of steel, not measured values for a particular alloy, but the shapes of the curves they produce are general.

```figure
type: line
title: Absorptivity of steel against angle of incidence at 1.07 µm, assumed N = 3.0 + 4.0i
x: Angle of incidence, degrees from the normal
y: Absorptivity
caption: This is an illustration. p-polarised absorptivity peaks at 0.761 near 78.4° and then falls steeply towards grazing incidence; s-polarised absorptivity falls steadily from 0.375. The average applies to unpolarised or circularly polarised light.
series: s-polarised | p-polarised | Average
- 0 | 0.375 | 0.375 | 0.375
- 30 | 0.334 | 0.419 | 0.376
- 45 | 0.281 | 0.484 | 0.383
- 60 | 0.208 | 0.594 | 0.401
- 70 | 0.147 | 0.698 | 0.423
- 75 | 0.113 | 0.746 | 0.430
- 80 | 0.078 | 0.756 | 0.417
- 84 | 0.047 | 0.669 | 0.358
- 86 | 0.032 | 0.551 | 0.292
- 88 | 0.016 | 0.343 | 0.180
```

At the CO₂ wavelength the same shapes appear, but stretched towards grazing incidence, because a better reflector needs a steeper angle before its p-polarised reflectivity falls.

```figure
type: line
title: Absorptivity of steel against angle of incidence at 10.6 µm, assumed N = 10 + 30i
x: Angle of incidence, degrees from the normal
y: Absorptivity
caption: This is an illustration. p-polarised absorptivity rises from 0.039 at normal incidence to a peak of 0.481 near 88.2°, more than twelve times the normal value; s-polarised absorptivity becomes very small.
series: s-polarised | p-polarised | Average
- 0 | 0.039 | 0.039 | 0.039
- 45 | 0.028 | 0.055 | 0.041
- 60 | 0.020 | 0.077 | 0.048
- 70 | 0.014 | 0.110 | 0.062
- 80 | 0.007 | 0.201 | 0.104
- 84 | 0.004 | 0.299 | 0.151
- 86 | 0.003 | 0.385 | 0.194
- 88 | 0.001 | 0.479 | 0.240
```

Three points stand out. The angle of greatest p-absorption for a metal is near grazing, 78° at 1.07 µm and 88° at 10.6 µm with these constants. At those angles, the difference between the two polarisations is enormous: at 86° at 10.6 µm, p-polarised light is absorbed more than a hundred times as strongly as s-polarised. And the average of the two, which is what unpolarised or circularly polarised light sees, changes much less with angle than either alone.

### Why the peak sits near grazing

The p-polarised curve has a peak because two effects pull in opposite directions. As the angle grows, the p-polarised field turns from lying along the surface towards pointing into it, and the reflected wave from the electrons becomes less able to cancel it, so absorption rises. But as the angle approaches 90°, the beam's footprint on the surface stretches out and the light skims along the surface; the reflected and incident waves become almost the same wave, and reflection wins again. The angle of the peak, sometimes called the principal angle, moves closer to grazing the larger the extinction coefficient. A metal that is a better reflector at normal incidence needs a steeper angle before its p-absorption peaks, which is why the CO₂ curve's peak lies at 88° and the fibre curve's at 78°.

The practical meaning shows up when the cutting speed changes. As speed rises, the front leans further back, so the angle of incidence falls away from grazing. At 1.07 µm the front sits beyond the peak of the p curve, on its falling side, so a front that leans further back absorbs more, which helps a fibre cut keep pace as speed rises. At 10.6 µm the front sits below the peak at 88°, on its rising side, so a front that leans further back absorbs less. Melt flow and the beam's shape also change with speed, so this is one effect among several, but it is one reason the two lasers respond differently when an operator pushes the speed.

## The angle at the cut front

In a steady cut, the beam does not drill straight down. The metal at the top of the kerf is reached first and the metal at the bottom last, so the melt front slopes backwards from top to bottom. The horizontal distance by which the bottom of the front trails the top, the drag or lag, can be read from the drag lines on a cut edge. If the lag is l over a thickness t, the front leans at γ = arctan(l ÷ t) from the vertical, and a vertical beam meets it at an angle of incidence θ = 90° − γ.

```figure
type: svg
title: The beam meets a steep cut front
alt: A side section through a sheet being cut from left to right. A vertical laser beam comes down from the top. The cut front is a line sloping down and to the left, from the top surface ahead of the beam to the bottom surface behind it. The trailing distance at the bottom is labelled lag l, and the thickness t. The angle between the beam and the normal to the front is labelled theta, near 85 degrees, and the angle of the front from the vertical is labelled gamma, about 5 degrees. An arrow at the right shows the cutting direction.
caption: This is an illustration. On the 6 mm bracket cut with a lag of 0.5 mm, the front leans γ = arctan(0.5 ÷ 6) = 4.76° from the vertical, so the beam strikes it at θ = 85.24° from the front's normal.
viewbox: 0 0 560 300
body:
<rect class="bx" x="40" y="120" width="480" height="120"/>
<rect class="bxi" x="190" y="110" width="40" height="140"/>
<path class="la" d="M260 20V120"/>
<text class="tx txs" x="270" y="40">Laser beam, vertical</text>
<path class="ln" d="M265 120L235 240"/>
<text class="txb" x="282" y="190">Cut front</text>
<path class="dsh" d="M235 240H265"/>
<text class="tx txs" x="226" y="262">lag l</text>
<path class="dsh" d="M520 120V240"/>
<text class="tx txs" x="528" y="185">t</text>
<path class="dsh" d="M265 120V240"/>
<text class="tx txs" x="160" y="150">γ ≈ 4.8°</text>
<text class="tx txs" x="300" y="140">θ ≈ 85.2° from the front's normal</text>
<path class="la" d="M420 90H500"/>
<text class="tx txs" x="410" y="80">Cutting direction</text>
<text class="tx txs" x="60" y="230">Kerf, already cut</text>
```

Typical leans are a few degrees, so typical angles of incidence on the front lie between about 84° and 88°. Those are exactly the angles at which the polarisation makes the biggest difference.

```figure
type: compare
title: Absorptivity on the cut front for two cuts, steel, assumed optical constants
cols: Angle of incidence | 1.07 µm s / p / average | 10.6 µm s / p / average
rowhead: Cut
- 6 mm bracket, lag 0.5 mm | 85.24° | 0.038 / 0.605 / 0.321 | 0.003 / 0.348 / 0.176
- 3 mm sheet, lag 0.2 mm | 86.19° | 0.030 / 0.536 / 0.283 | 0.003 / 0.395 / 0.199
- For comparison, flat surface | 0° | 0.375 / 0.375 / 0.375 | 0.039 / 0.039 / 0.039
caption: This is an illustration. At 10.6 µm the front absorbs four and a half to five times more than a flat surface for circularly polarised light. At 1.07 µm it absorbs slightly less than a flat surface, so the fibre laser's advantage over CO₂ is greatest on flat surfaces and thin sheet and narrows on thick, steep fronts.
```

The comparison clarifies a long-running argument in the industry. On thin sheet, where the beam meets a front that is less steep and much of the energy goes into the first strike, the fibre laser's much higher normal-incidence absorptivity makes it far faster than a CO₂ laser of the same power. On thick plate, the steep front lets the CO₂ laser's p-polarised light absorb strongly, so its disadvantage shrinks. Wavelength also affects how the beam focuses and how the melt flows, so edge quality on thick plate depends on more than absorption, but the angle effect is a large part of why the two technologies compare differently on thin and thick material.

## Direction-dependent cutting

If the beam is linearly polarised, the share that is p-polarised at the front depends on the direction of the cut. Cutting in the direction in which the electric field oscillates, the front sees mainly p-polarised light and absorbs strongly. Cutting at right angles to it, the front sees mainly s-polarised light and absorbs weakly. At 10.6 µm the difference is between about 0.35 and 0.003 at the front of a 6 mm cut, so the kerf width, dross and maximum speed change with direction, and contours come out with one good side and one bad side.

CO₂ lasers usually produce linearly polarised light, so CO₂ cutting machines include a phase-retarding mirror, a quarter-wave retarder, that turns linear polarisation into circular. Circularly polarised light presents equal s and p shares in every direction, so every direction of cut sees the average absorptivity. Fibre lasers deliver light through a long multimode fibre, which scrambles the polarisation; the output is effectively unpolarised, which also gives the average in every direction, without a retarder.

### The kerf walls

The front is not the only surface the beam meets. Light reflected from the front, and the outer edge of a beam that is slightly wider than the kerf, strike the two side walls. The walls run parallel to the direction of cut, so for a linearly polarised beam their geometry is the reverse of the front's: the polarisation that is p-polarised at the front is s-polarised at the walls, and the other way round. With the field along the cut, the front absorbs well and the walls absorb poorly, which gives a narrow, parallel kerf. With the field across the cut, the front absorbs poorly and the walls absorb more, which widens the kerf and roughens its sides. Circular or unpolarised light treats front and walls alike in every direction. This is why direction effects show up in kerf width and edge roughness as well as in dross.

### What a star test costs and when to run it

A star test on the LC-2 uses a 150 × 150 mm offcut and eight cuts of 60 mm, 480 mm of cutting in all, which at 2 m/min takes about 15 seconds of beam time plus a few minutes to load, cut and inspect. The cell runs it after any work on the beam path, after a crash, whenever edge quality changes for no obvious reason, and every three months on the CO₂ machine as a check on the retarder. On the fibre laser, the same test is a quick check of nozzle centring after a nozzle change. The offcuts are labelled and kept for a year, so that a slow change can be seen by laying old and new tests side by side.

### The mistake: the LC-2's good side

The LC-2 cuts 3 mm mild steel for brackets that go to a powder-coating line. Over a few months the operators noticed that brackets came off with clean edges on two sides and heavy dross on the other two. They first blamed the gas and the nozzle, which they changed twice. Then the maintenance fitter ran a star test: eight straight cuts radiating from a point at 45° intervals, at the same settings.

```figure
type: compare
title: Star test on 3 mm mild steel, LC-2 at 2 kW
cols: Kerf width at bottom, mm | Bottom dross | Drag lines
rowhead: Cut direction
- Along X, 0° and 180° | 0.18 | None | Fine, regular
- 45° diagonals | 0.20 | Light | Slightly coarse
- Along Y, 90° and 270° | 0.24 | Heavy | Coarse, irregular
caption: This is an illustration. A direction-dependent result with the same nozzle, gas and focus points to polarisation. After the retarder was replaced, all eight cuts measured 0.19 to 0.20 mm with light or no dross.
```

A direction-dependent result points straight at polarisation, because nothing else on a cutting head knows which way the machine is moving. The retarder mirror's coating had degraded with age and contamination, so the beam leaving it was elliptically rather than circularly polarised, with more of its field along the machine's X axis. Cuts along X saw more p-polarised light and cut cleanly; cuts along Y saw more s-polarised light and left dross. The mirror was replaced, the star test repeated, and all eight directions matched.

```figure
type: checklist
title: When a cut changes with direction
caption: The cell's diagnostic order. This is an illustration.
- x Run a star test at fixed settings on a known sheet
- x If quality depends on direction, check the beam's polarisation (retarder on a CO₂ machine) and the nozzle's centring on the beam
- x A nozzle off centre gives one direction worse and the opposite direction better; polarisation gives opposite directions the same
- x Record the star test with the machine's service history
- ? On fibre machines, direction effects point to nozzle centring, gas flow or motion, not polarisation
```

The last line of the checklist matters for the LC-4. A fibre laser's unpolarised beam cannot produce a direction effect through absorption. If the LC-4 ever cuts better one way than another, the cause lies elsewhere: a nozzle that is not centred on the beam, a damaged nozzle bore that throws the gas jet to one side, or a motion problem. The distinction between opposite directions helps: a nozzle off centre makes one direction worse and the opposite one better, whereas polarisation makes opposite directions behave alike.

## Angle in welding and marking

Angle matters in the cell's other processes too. In keyhole welding, treated in Chapter 8, the beam drills a narrow vapour-filled cavity and is absorbed on its steep walls by many grazing strikes, so the keyhole is an even better light trap than a cutting kerf and absorbs most of the beam whatever the metal's flat-surface absorptivity. Before the keyhole forms, however, the beam meets a flat surface. When welding reflective metals the cell tilts the head a few degrees from the normal, so that light reflected from the flat surface at the start of the weld does not return straight up the beam path into the optics.

In marking, the M-20 steers its beam with galvanometer mirrors across a flat field about 110 mm square. At the edge of the field the beam arrives several degrees off the normal, and on a curved part, such as a nameplate pressed into a radius, the angle can be much larger. On the flat field the change in absorptivity is small, but on a curved or bevelled surface the spot also stretches into an ellipse, lowering the energy per unit area. Marks that fade towards the edges of a curved part are usually the stretched spot rather than a change in absorption, and Chapter 9 shows how the cell corrects for it.

## Non-metals: Brewster's angle

For a transparent material with a real refractive index n, the p-polarised reflectivity falls to exactly zero at Brewster's angle, arctan n. For clear acrylic, with n about 1.49 in visible light, that is 56.1°. At normal incidence the same surface reflects only ((1.49 − 1) ÷ (1.49 + 1))² = 3.9% of the light, so reflection is a small effect for non-metals at any angle. The large effects in this chapter belong to metals, whose high extinction coefficient makes reflection the main event.

## Exercise: the 3 mm aluminium panels

The LC-4 cuts the 3 mm aluminium panels with a measured drag of 0.25 mm at the bottom of the cut. At what angle of incidence does the beam meet the cut front? If, at that angle, a planner's data gave aluminium an s-polarised absorptivity of 0.012 and a p-polarised absorptivity of 0.21 at 1.07 µm, what absorptivity would the LC-4's unpolarised beam see on the front, and would the LC-4 cut these panels better in one direction than another?

### Answer

The front leans γ = arctan(0.25 ÷ 3) = 4.76° from the vertical, so the beam meets it at θ = 90° − 4.76° = 85.24° from the front's normal.

An unpolarised beam carries equal s and p shares, so the absorptivity on the front is the average: (0.012 + 0.21) ÷ 2 = 0.111.

The LC-4 would not cut better in one direction than another because of absorption. Its multimode fibre delivers effectively unpolarised light, so every direction of cut sees the same average absorptivity. If the panels did show a direction effect, the cell's checklist sends the fitter to the nozzle's centring and the gas jet, not to the beam.
