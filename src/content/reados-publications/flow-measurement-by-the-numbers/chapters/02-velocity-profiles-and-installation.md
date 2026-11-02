---
book: flow-measurement-by-the-numbers
chapterSlug: velocity-profiles-and-installation
order: 2
title: "Velocity profiles and installation"
description: "How speed varies across a pipe, laminar and turbulent profiles and the profile factor, what fittings do to the flow, straight runs and conditioners, and a meter after a throttling valve."
draft: false
---

A flowmeter is calibrated in a laboratory, in a long straight pipe, with a smooth, symmetrical, fully developed flow. It is installed in a plant, where the pipe bends, branches, passes through valves and pumps, and seldom runs straight for long. Most of the gap between a meter's stated accuracy and its accuracy in service comes from that difference. Understanding how fluid moves across a pipe, and what fittings do to it, is therefore the first step in installing any meter, and for some meter types it is the main one.

This chapter describes the velocity profile in laminar and turbulent flow, the profile factor that links what a meter senses to the mean velocity it reports, the disturbances that fittings create and how far they travel, straight runs and flow conditioners, and finishes with the brewery's water meter, installed just downstream of a throttling valve, disagreeing with the water authority's meter by 2.4%.

## How speed varies across a pipe

At the pipe wall the fluid does not move; friction holds a thin layer to the wall. Moving inwards, each layer slides over the next, and the speed rises towards the centre. How it rises depends on whether the flow is laminar or turbulent.

**Laminar flow**, at Reynolds numbers below about 2,000, is orderly. Layers slide smoothly over each other, and the profile is a parabola: the centreline speed is exactly twice the mean, and the speed falls steadily to zero at the wall.

**Turbulent flow**, at Reynolds numbers above about 4,000, is full of eddies that mix fast fluid from the centre with slow fluid near the wall. The mixing flattens the profile: most of the cross-section moves at nearly the same speed, and the speed falls steeply only in a thin layer near the wall. A convenient description is the power law, in which the speed at a distance y from the wall, as a fraction of the centreline speed, is (y ÷ R) raised to the power 1 ÷ n, where R is the pipe's radius and n rises slowly with the Reynolds number, from about 6 at 4,000 to about 7 at 100,000 and about 9 or 10 at a million or more.

```figure
type: formula
title: Velocity profiles in a straight pipe
formula: Laminar: u(r) = 2 v̄ (1 − r² ÷ R²)
formula: Turbulent, power law: u(y) = u_max (y ÷ R)^(1/n)        v̄ ÷ u_max = 2n² ÷ [(n + 1)(2n + 1)]
caption: r is the distance from the centreline and y = R − r the distance from the wall. For n = 7, the mean velocity is 0.817 of the centreline velocity; for laminar flow, 0.5.
- u | local velocity
- u_max | centreline velocity
- n | power-law exponent, rising slowly with Reynolds number
```

## The profile factor

Many meters do not sense the mean velocity directly. An insertion probe senses the speed at one point; a single-path ultrasonic meter senses the average along one line across the pipe; a magnetic meter senses a weighted average over the whole cross-section. Each needs a factor to convert what it senses into the mean velocity, and the factor depends on the shape of the profile.

For a single path along the diameter, the line-average of a power-law profile is n ÷ (n + 1) of the centreline speed, while the true mean is 2n² ÷ [(n + 1)(2n + 1)] of it. The ratio of the two is the profile factor the meter must apply.

```figure
type: compare
title: Profile factor for a single diametral path, by power-law exponent
cols: Mean ÷ centreline | Diameter line-average ÷ centreline | Profile factor, mean ÷ line-average
rowhead: Profile
- Laminar | 0.500 | 0.667 | 0.750
- n = 6, Re about 4,000 | 0.791 | 0.857 | 0.923
- * n = 7, Re about 100,000 | 0.817 | 0.875 | 0.933
- n = 8 | 0.837 | 0.889 | 0.941
- n = 9, Re about 1,000,000 | 0.853 | 0.900 | 0.947
caption: For a fully developed, symmetrical profile. Between n = 7 and n = 9 the factor changes by 1.5%, which is why single-path meters correct their factor with the Reynolds number, and why multi-path meters sample several lines to reduce the dependence.
```

Between n = 7 and n = 9 the factor changes by 1.5%, and between turbulent and laminar flow by about 20%. A meter that assumes the wrong profile is wrong by that much, and no calibration in the laboratory can fix an error that arises because the profile in the plant is not the profile in the laboratory. Chapter 6 uses these factors for the brewery's clamp-on meter.

## What fittings do to the flow

A fully developed profile forms only after the fluid has travelled a long way down a straight pipe. Every fitting disturbs it, and the disturbance decays only gradually downstream.

```figure
type: compare
title: Disturbances from common fittings
cols: What it does to the profile | How far it persists, roughly
rowhead: Fitting
- Single 90° elbow | pushes the fast core towards the outside of the bend; a pair of counter-rotating secondary vortices | tens of diameters before fully developed again
- Two elbows in different planes | adds swirl, the whole flow rotating about the axis | swirl can persist for 50 diameters or more
- Partly closed valve, especially butterfly | a jet on one side, a wake on the other, strong asymmetry | tens of diameters
- Pump discharge | swirl and pulsation from the impeller | tens of diameters; pulsation can travel further
- Reducer or expander | a reducer flattens and helps the profile; an expander creates a jet | an expander's effect lasts longer than a reducer's
caption: Typical behaviour; the meter maker's installation requirements, and for differential pressure meters the ISO 5167 tables, set the distances that apply to a particular meter.
```

Each meter type responds differently. Coriolis meters measure mass directly and are almost insensitive to the profile. Magnetic meters average over the whole cross-section and are moderately sensitive to asymmetry. Orifice plates, single-path ultrasonic meters and insertion meters are the most sensitive. A meter's installation requirements are therefore stated by its maker as minimum straight lengths upstream and downstream, usually in pipe diameters, for each kind of upstream fitting.

### Flow conditioners

Where straight pipe is short, a flow conditioner, a plate with a pattern of holes or a bundle of tubes, can be fitted upstream of the meter. It breaks up swirl and redistributes the flow towards a developed profile over a much shorter length. Conditioners cost pressure, typically one to two velocity heads, and must be installed exactly as their design requires, at the stated distance from the meter. Tube bundles remove swirl but do little for asymmetry; perforated plates do both. The cost is easy to work out. A loss of about two velocity heads at FT-301's 1.349 m/s in water at 80 °C, density 971.8 kg/m³, is 2 × 971.8 × 1.349² ÷ 2 = 1,770 Pa, about 18 mbar. That is small beside the orifice plate's own permanent loss, which Chapter 3 calculates, and the brewery accepted it in return for a measurement it could trust after two out-of-plane elbows.

## The brewery's installations

```figure
type: compare
title: Upstream conditions at the brewery's meters
cols: Upstream fitting | Straight run before the meter | Sensitivity of the meter type
rowhead: Meter
- FT-101 magnetic, DN80 | isolating valve and backflow preventer | originally 1.5 D after a throttling butterfly valve; now 10 D | moderate
- FT-201 Coriolis, DN50 | plate heat exchanger outlet and a bend | 3 D | very low
- FT-301 orifice plate, DN65 | two elbows in different planes | 22 D, with a perforated plate conditioner | high
- FT-401 vortex, DN50 | dryer outlet and a reducer | 15 D | moderate to high
- FT-501 clamp-on ultrasonic, DN100 | pump discharge and an elbow | chosen at 20 D on each audit | high
caption: This is an illustration. D is the internal bore. Required lengths are each maker's or ISO 5167's, not reproduced here.
```

## The mistake: a water meter after a throttling valve

When the brewery installed FT-101, the only straight length on the incoming main was immediately downstream of a butterfly valve that the plumber had partly closed to limit the pressure at the brewhouse. The meter went in 1.5 diameters after the valve. For the first billing quarter, FT-101 read 2.4% more water than the water authority's boundary meter.

```figure
type: steps
title: Tracing a 2.4% disagreement to the installation
caption: This is an illustration. The boundary meter was tested by the authority and found within its tolerance; FT-101's installation was the cause.
- Symptom | FT-101 2.4% above the authority's boundary meter over a quarter
- Authority's meter tested | within its verification tolerance
- FT-101 checked on its own | zero and verification within the maker's specification
- * Installation | 1.5 D after a partly closed butterfly valve; strong jet on one side of the bore
- Fix | pressure-reducing valve fitted upstream in place of the throttled butterfly; FT-101 moved to 10 D of straight pipe
- Result | agreement within 1% over the following quarters
```

The authority tested its meter at the brewery's request and found it within tolerance. FT-101's own diagnostics and a zero check were also in order. The cause was the installation. A partly closed butterfly valve sends the flow through two crescent-shaped openings on either side of its disc, producing jets and a strong asymmetry that persists for many diameters. The magnetic meter, whose signal weights different parts of the cross-section slightly differently, read the distorted profile 2.4% high. The plumber replaced the throttled butterfly with a pressure-reducing valve further upstream, the meter was moved to a position with 10 diameters of straight pipe before it, and the two meters have since agreed within 1%. The lesson the brewery took was to plan meter positions when the pipework is designed, not to fit meters into whatever straight length is left afterwards: a few metres of straight pipe cost little on a drawing and a great deal once the plant is built.

## Bubbles, solids and full pipes

The installation must also keep the meter full of a single phase.

**Air.** In liquid lines, air collects at high points. A meter at a high point can run partly full when the flow is low, or see air pockets that sweep through it. Meters are placed in low points or in vertical pipes with upward flow, which stay full and carry bubbles through.

**Solids.** Sediment settles in horizontal pipes and can coat electrodes or the bottom of an orifice plate. Vertical upward flow keeps solids moving.

**Gases in liquids.** Dissolved gases come out of solution where pressure falls, after a valve or in the low-pressure zone of an orifice. Keeping enough back-pressure on the meter, by placing control valves downstream of it rather than upstream, keeps gases in solution.

**Liquids in gases.** In compressed air, condensate collects at low points and can be carried as slugs into a meter. The air meter FT-401 sits downstream of the dryer and in a horizontal run fed from the top of the main.

## Viscous liquids and laminar flow

Not every flow is comfortably turbulent. The brewery's glycol loop runs a 30% propylene glycol solution at about −2 °C, whose viscosity is several times water's, and at low pump speeds its Reynolds number falls towards the transition region. As it does, the profile sharpens towards the laminar parabola, and Chapter 6 shows how far that moves a clamp-on meter's profile factor. Viscous products such as syrups, oils and concentrated wort can run laminar in normal operation. Meters whose factor depends on the profile must either be corrected for Reynolds number, which needs the viscosity, or be of a type that does not depend on it, which is one of the Coriolis meter's advantages.

## Pulsating flow

A reciprocating pump, a compressor without enough receiver volume, or a control valve hunting around its set point makes the flow pulsate. Most meters are calibrated in steady flow, and many respond to pulsation with an error rather than an average. A differential pressure meter is the worst affected, because flow goes as the square root of the pressure difference, and the square root of an average pressure difference is not the average of the square roots: a meter averaging a strongly pulsating pressure difference reads high. Vortex meters can lock on to a pulsation frequency near their own shedding frequency. The cure is to damp the pulsation at its source, with a receiver or pulsation damper, or to choose a meter type that averages correctly, such as a magnetic or Coriolis meter with a fast response.

## Installing for maintenance and checking

Installation also decides whether a meter can be checked and maintained. A pair of isolating valves and a bypass let an in-line meter be removed for calibration without stopping the process, as FT-101's now does. Magnetic meters are mounted with their electrode axis horizontal, so that neither electrode sits in the air at the top of the pipe or in sediment at the bottom. Coriolis meters are supported on the pipe either side, not by the meter, and clear of vibrating machinery. Every meter needs a position where its display can be read and its diagnostics reached without a ladder or a confined-space entry, because a meter that is hard to check is a meter that is not checked.

## Measuring the bore

Every velocity-based meter relates velocity to flow through the internal area, so the bore matters as much as the profile. A clamp-on ultrasonic meter, which is configured on site, needs the bore entered by hand, and Chapter 6 shows the consequences of entering the nominal size of a pipe whose wall is thicker than assumed. In-line meters carry their own measured bore and avoid that error, but a gasket that protrudes into the bore upstream of an in-line meter, or a weld bead at a spool joint, disturbs the profile just as a fitting does. Gaskets must be cut to the bore and centred, and spool welds near meters ground flush.

## Exercise: an insertion probe in the hot liquor line

The brewery considers adding a cheap insertion meter, which measures the local velocity at the centreline, to the DN65 hot liquor line to cross-check FT-301. At 15 m³/h of water at 80 °C in a 62.7 mm bore, calculate the mean velocity, the Reynolds number and, taking the power-law exponent as 8 for that Reynolds number, the centreline velocity the probe would sense. Then say how much the reading would change if the exponent were actually 7, and what that means for the probe's usefulness.

### Answer

**Given:** Q = 15 m³/h; D = 0.0627 m; ν = 0.365 × 10⁻⁶ m²/s at 80 °C; n = 8, then 7.

**Assumptions:** fully developed turbulent flow; the probe exactly at the centreline.

**Method:** v̄ = Q ÷ A; Re = v̄D ÷ ν; u_max = v̄ ÷ [2n² ÷ ((n + 1)(2n + 1))].

**Mean velocity:** A = π × 0.0627² ÷ 4 = 3.088 × 10⁻³ m²; v̄ = (15 ÷ 3,600) ÷ 3.088 × 10⁻³ = 1.349 m/s.

**Reynolds number:** 1.349 × 0.0627 ÷ 0.365 × 10⁻⁶ = 232,000.

**Centreline velocity, n = 8:** ratio 2 × 64 ÷ (9 × 17) = 0.837; u_max = 1.349 ÷ 0.837 = 1.613 m/s.

**If n = 7:** ratio 0.817; u_max = 1.349 ÷ 0.817 = 1.652 m/s. A probe programmed with the n = 8 ratio and seeing 1.652 m/s would report a mean of 1.652 × 0.837 = 1.382 m/s, 2.4% high.

**Usefulness:** a single-point probe's reading depends directly on the assumed profile, and the profile's exponent is uncertain by about one at any given Reynolds number, before any installation effect. The probe can show trends and gross faults in FT-301's readings, but it cannot check FT-301 to better than a few per cent, which is the size of the disagreement it would be asked to resolve.

**Verification:** the centreline velocities differ in the ratio 0.837 ÷ 0.817 = 1.025, matching the 2.4% error, and the Reynolds number, 232,000, matches the brewery's table in Chapter 1.
