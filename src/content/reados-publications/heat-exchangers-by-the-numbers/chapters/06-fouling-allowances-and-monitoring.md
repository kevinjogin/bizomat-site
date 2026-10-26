---
book: heat-exchangers-by-the-numbers
chapterSlug: fouling-allowances-and-monitoring
order: 6
title: "Fouling: allowances, monitoring and cleaning"
description: "Treat fouling as a growing resistance: its causes, the allowance to design for, measuring it in service from U × A, when to clean, and catch an allowance that made fouling worse."
draft: false
---

Every heat exchanger gets dirty. Scale crystallises from hard water onto warm surfaces, silt and debris settle where flow is slow, biological slimes grow in warm, aerated water, corrosion products build up on metal, and oils leave varnish and sludge. Each layer, however thin, adds a thermal resistance in series with the films and the wall, and because the deposits are usually poor conductors, a layer a fraction of a millimetre thick can take a large bite out of the overall coefficient. Designers allow for it with a **fouling resistance** in the design calculation; operators manage it by monitoring and cleaning. Both are easy to get wrong in ways that make it worse.

This chapter describes the main fouling mechanisms, explains what a fouling allowance does and does not buy, shows how to measure the fouling resistance an exchanger has actually built up from routine temperature and flow readings, and sets out how to decide when to clean. The running case finds that OC-35's first specification carried a water-side fouling allowance five times this book's, intended to make the cooler robust, which would have made it larger, slowed its water and helped it foul faster.

## Where fouling comes from

Fouling is usually classified by mechanism.

- **Scaling** or precipitation: dissolved salts, mainly calcium carbonate in hard or concentrated water, come out of solution on warm surfaces, because their solubility falls as temperature rises. Cooling-tower water, concentrated by evaporation, is prone to it.
- **Particulate** fouling: suspended silt, dust and debris settle in slow-moving regions. Open cooling towers scrub dust from the air and pass it to the water.
- **Biological** fouling: bacteria form slimes, or biofilms, on surfaces in warm water; larger organisms grow in untreated raw water.
- **Corrosion** fouling: corrosion products form on the surface and stay there.
- **Chemical reaction** fouling: hot oils and process fluids form varnish, gums and coke on hot surfaces.

Velocity matters to almost all of them. Higher velocities sweep particles away, limit biofilm thickness and raise shear on deposits; low velocities let deposits build. Surface temperature matters to scaling and chemical fouling, because both accelerate on hotter surfaces. Fluid treatment, filtering and chemical conditioning matter most of all, and for a cooling-tower circuit like OC-35's, the tower's water treatment programme, which *Cooling Towers by the Numbers* covers for the same plant, decides most of the water side's fouling.

## The fouling resistance

A fouling deposit's effect is expressed as a resistance, R_f, in m²·K/W, added to the sum of resistances in Chapter 4. A thin layer of a poor conductor gives a large resistance: a calcium carbonate scale with a conductivity of the order of 1 W/(m·K), 0.2 mm thick, adds about 0.0002 m²·K/W, comparable to OC-35's whole water-side film. Fouling resistances for design are taken from experience with similar fluids and services, from the exchanger standards' guidance tables, or from the operator's own records.

## What an allowance buys

A fouling allowance in the design adds resistance, lowers the design U and so adds area. When the exchanger is new and clean, that extra area is a margin: the exchanger outperforms its duty. As it fouls, the margin is used up, until, when the fouling has reached the allowance, the exchanger just meets its duty. The allowance is therefore not a property of the fluid; it is a decision about how long the exchanger should run between cleanings, made with an expected fouling rate.

## The running case: choosing OC-35's allowance

This is an illustration. OC-35's design in this book uses 0.00018 m²·K/W on each side, giving a service U of about 349 W/(m²·K) against a clean U of about 404, a clean margin of about 1.16, and an area of about 5.6 m² with 15 tubes per pass at about 1.2 m/s.

## The error: an allowance that made fouling worse

The first specification for OC-35, written to make the cooler "robust", carried a water-side fouling allowance of **0.0009 m²·K/W**, a value the writer had seen for a dirty river-water service. Sized with it, keeping the tube length, the cooler needed about 7.3 m² of area, which the supplier achieved by adding tubes: about 20 per pass instead of 15. With more tubes sharing the same water flow, the water velocity fell from about 1.2 to about **0.92 m/s**.

```figure
type: compare
title: OC-35 sized for three water-side fouling allowances, same tube length
cols: Tubes per pass | Water velocity | Service U | Area | Clean margin
caption: This is an illustration. The heavy allowance adds area by adding tubes, which slows the water; when the cooler is new, it is about 1.5 times larger than it needs to be.
- *0.00018 m²·K/W | 15 | 1.20 m/s | 349 W/(m²·K) | 5.6 m² | 1.16
- 0.00035 m²·K/W | 16 | 1.12 m/s | 325 W/(m²·K) | 6.0 m² | 1.24
- 0.0009 m²·K/W, as first specified | 20 | 0.92 m/s | 267 W/(m²·K) | 7.3 m² | 1.49
```

The heavy allowance had three effects, all bad. The cooler cost more, because it was larger. When clean, it was about 1.5 times larger than its duty needed, so it overcooled the oil, unless a temperature control valve throttled the water, which slowed the water further. And slower water is exactly the condition that lets silt settle and biofilm thicken in cooling-tower water. An allowance meant to give margin against fouling created the conditions for faster fouling. The check that caught it was asking where the 0.0009 had come from and what water velocity the resulting design would have; the plant's tower water, treated and filtered, was nothing like river water. The fix was a modest allowance, a design velocity that keeps the tubes scoured, and a monitoring and cleaning plan to manage the fouling that does occur, with the tower's water treatment named as part of the cooler's design basis. The general lesson is that a fouling allowance is a design choice with side effects, and that keeping velocity up is usually a better defence against fouling than adding area.

## Measuring fouling in service

Fouling is measured, not guessed, by tracking the exchanger's conductance, U × A, from routine readings: the four terminal temperatures and one flow, which give the duty and the corrected mean temperature difference, and their ratio. Because the area does not change, any fall in U × A is a fall in U, and the fouling resistance follows:

```figure
type: formula
title: Fouling resistance from two measured overall coefficients
formula: R_f ≈ 1 ÷ U_now − 1 ÷ U_clean, with U = (Q ÷ ΔT_m) ÷ A
caption: This is an illustration for OC-35, with an area of about 5.59 m². The clean value is measured at commissioning; flows should be close to the same at both readings, because a change in velocity also changes the film coefficients.
- U_clean | Overall coefficient measured when the exchanger was clean, W/(m²·K)
- U_now | Overall coefficient measured now, W/(m²·K)
step: Commissioning: U × A ≈ 2.20 kW/K, so U_clean ≈ 394 W/(m²·K)
step: After a year: U × A ≈ 1.43 kW/K, so U_now ≈ 256 W/(m²·K)
step: R_f ≈ 1 ÷ 256 − 1 ÷ 394 ≈ 0.00137 m²·K/W, about 3.5 times the design allowance
```

This is an illustration. Plotting OC-35's U × A month by month shows the fouling's progress against the line where it reaches the design allowance, about 1.91 kW/K.

```figure
type: line
title: OC-35's measured conductance over its first year
x: Months since commissioning
y: U × A, kW/K
legend: Measured U × A | At the design fouling allowance
ymin: 1.3
ymax: 2.3
caption: This is an illustration with fouling growing steadily. The conductance crosses the design-allowance line at about 3.4 months; after that, the oil runs above its target on the hottest days.
- 0 | 2.20 | 1.91
- 2 | 2.02 | 1.91
- 4 | 1.87 | 1.91
- 6 | 1.73 | 1.91
- 8 | 1.62 | 1.91
- 10 | 1.52 | 1.91
- 12 | 1.43 | 1.91
```

The trend gives two pieces of information. Its slope is the fouling rate, which says whether the water treatment is working. Its crossing of the allowance line says when the exchanger will start failing its duty, which sets the cleaning interval: here about every three to four months, unless the fouling rate is reduced.

## Making the readings count

A monitoring trend is only as good as its readings. Temperatures should be read at the same points each time, with sensors checked against each other occasionally, because OC-35's water-side temperature rise is only 5 K and a 0.25 K error in one sensor moves the calculated duty by 5%. Readings should be taken at a steady operating condition, the press in full production and the oil temperature settled, not during a warm-up. And the duty should be calculated from the side with the better flow measurement, with the other side's balance used as a check, as Chapter 1 recommended. A monthly reading under those rules, logged in the maintenance system beside the cleaning records, turns fouling from a surprise into a scheduled task.

## When to clean

Cleaning costs money and downtime; fouling costs performance and, often, energy. The cleaning interval is chosen to balance them, and the trend makes it possible. For OC-35, whose tubes carry tower water, mechanical cleaning by brushing or water-jetting the tubes restores the clean coefficient in a few hours of downtime. If the fouling rate seen above continued, cleaning every three months would keep the cooler meeting its duty. The better question is why the rate is so high: in this illustration, the tower water's treatment had lapsed, and once it was restored, the conductance fell much more slowly, stretching the interval to many months. Fouling monitoring is as much a check on the water treatment as on the exchanger, and the two trends, conductance and water chemistry, are best reviewed together at the same monthly meeting.

## What fouling costs

Fouling's cost shows up in the process the exchanger serves. This is an illustration. With the press still rejecting 35 kW and the tower water still arriving at 29 °C, OC-35's oil settles at whatever temperature lets the fouled cooler pass the full duty. Clean, at a conductance of about 2.20 kW/K, the oil would run at about 53 °C into the cooler and 43 °C out. At the design allowance, about 1.91 kW/K, it runs at about 55 °C in and 45 °C out, as designed. After a year at the untreated fouling rate, at about 1.43 kW/K, it settles at about **61 °C in and 51 °C out**, about 6 K hotter than design. Hotter hydraulic oil is thinner, so pumps and valves leak more internally and the system loses efficiency, and it ages faster, shortening the life of the oil and the seals. The cost of fouling is therefore not only the cleaning bill but the press's efficiency and its oil and seal replacements, which is why the monitoring trend deserves a regular place on the plant's maintenance schedule.

## Cleaning methods

Exchangers are cleaned mechanically, chemically or both, and the choice depends on the deposit and the construction.

- **Mechanical cleaning** of straight tubes, by brushes, scrapers or high-pressure water jets pushed through each tube, removes silt, biofilm and soft scale. It needs access to the tube ends, which OC-35's removable channel covers provide.
- **Chemical cleaning** dissolves deposits: inhibited acids for carbonate scale, alkaline or solvent cleaners for oily and organic deposits. It reaches places brushes cannot, such as the shell side or the channels of a plate exchanger, but the chemicals must suit the exchanger's materials, the spent solution must be disposed of properly, and the work carries chemical hazards that the safety data sheets and the site's procedures address.
- **Online cleaning**, such as systems that circulate sponge balls through the tubes, keeps tubes clean during operation and suits large condensers and coolers on dirty water.
- **Plate exchangers** are opened and their plates cleaned individually, or cleaned chemically in place.

Whatever the method, the conductance should be measured before and after: a cleaning that does not restore the commissioning U × A has missed something.

## Designing for cleanability

An exchanger that will foul should be designed to be cleaned. For shell-and-tube units, that means straight tubes with removable channel covers for the dirty fluid, a removable bundle where the shell side may foul, isolating valves and drains so the exchanger can be taken out of service without draining the whole system, and, where downtime matters, a bypass or a standby unit. Upstream strainers catch debris before it reaches the tubes. Test points for temperatures and a flow measurement, fitted from the start, make the monitoring trend possible. OC-35 was given all of these: valves and a strainer on the water side, thermowells at all four connections, and a clamp-on flowmeter position on the water line.

## Fouling on the oil side

Clean, filtered hydraulic oil fouls little, which is why OC-35's oil-side allowance is small. But oils degrade with heat and age, forming varnish, and contaminated oil carries particles. A rising oil-side resistance is a warning about the oil's condition and the hydraulic system's filtration, not only about the cooler. Because the oil side controls OC-35, even a modest oil-side deposit has a large effect on U, so the oil's condition is worth watching through the cooler's conductance as well as through oil analysis.

## Exercise: a slower fouling rate

After the water treatment was restored, OC-35's measured U × A fell from about 2.20 kW/K when freshly cleaned to about 2.08 kW/K after three months. What fouling resistance does that represent, and at that rate, after about how many months will the cooler reach its design allowance of about 0.00039 m²·K/W in total?

**Worked answer.** U_now ≈ 2,080 ÷ 5.59 ≈ 372 W/(m²·K) and U_clean ≈ 394, so R_f ≈ 1 ÷ 372 − 1 ÷ 394 ≈ **0.00015 m²·K/W** after three months, about 0.00005 per month. At that rate, the design allowance of about 0.00039 m²·K/W is reached after about 0.00039 ÷ 0.00005 ≈ **8 months**.

The cleaning interval stretches from about three to about eight months, with the same exchanger and allowance, because the fouling rate fell. The calculation shows where the real gains lie: in the water treatment and the velocity that keep fouling slow, rather than in the size of the allowance that tolerates it.
