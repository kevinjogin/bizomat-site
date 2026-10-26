---
book: ductwork-by-the-numbers
chapterSlug: measuring-flow-and-balancing
order: 10
title: "Measuring flow and balancing"
description: "Measure duct flow with a pitot traverse, place the points, average velocities not pressures, check hood static pressure, balance in order, and catch a misleading centreline reading."
draft: false
---

Every number in this book so far has been a prediction. Commissioning turns predictions into measurements: the flow at every hood, the pressure at the fan, the speed of the drive, the setting of every balancing device. A system is not finished when the last duct is hung; it is finished when its measured flows match its design flows, within a stated tolerance, and the measurements are written down where the next person to touch the system can find them.

This chapter covers measuring velocity with a pitot tube, the traverse that turns point velocities into a flow, the hood static pressure as a quicker check, and the order in which a system is balanced. The running case commissions EX-1 and finds that B1, the index hood, was first reported as correct from a single centreline reading, when a full traverse showed it 5% short.

## The pitot tube

A pitot-static tube, pointed into the flow, measures the difference between the total pressure at its tip and the static pressure at side holes: the **velocity pressure**. From the velocity pressure, the velocity follows:

```figure
type: formula
title: Velocity from a pitot reading
formula: v = √(2 × velocity pressure ÷ ρ)
caption: This is an illustration at an air density of 1.2 kg/m³. Correct the density for the air's actual temperature and pressure; a reading in hot exhaust gives a higher velocity for the same velocity pressure.
- velocity pressure | Pitot reading, Pa
- ρ | Air density at the measuring point, kg/m³
step: A reading of 228 Pa: v = √(2 × 228 ÷ 1.2) = 19.49 m/s, the design velocity in a 140 mm branch
step: A reading of 150 Pa: v = √(250) = 15.81 m/s
```

The relationship is a square root, so velocity pressure falls quickly with velocity: a duct at half its design velocity shows a quarter of its design velocity pressure. Low readings need a sensitive manometer, and readings in slow ducts carry more relative error.

## The traverse

A single reading measures the velocity at one point, and the velocity is not the same across a duct. It is highest near the centre and lowest at the walls. To find the average, the pitot is moved across the duct along one or more diameters and read at a set of points chosen so that each represents an equal share of the area.

One way to place them in a round duct is to divide the section into rings of equal area and read at the radius that splits each ring's area in half. For n rings in a duct of radius R, the i-th reading lies at a radius of **R × √((2i − 1) ÷ (2n))** from the centre. Standards for flow measurement specify their own point layouts and numbers of points, and a commissioning engineer should use the method the project's specification calls for; the equal-area layout here illustrates the principle.

```figure
type: compare
title: Equal-area traverse points for three rings, distance from the near wall
cols: Ring 1, centre | Ring 2 | Ring 3, near wall
caption: This is an illustration. Each diameter has six points, three each side of the centre; two diameters at right angles give twelve. Distances are from the wall on the side where the pitot enters.
- 140 mm duct, near side | 41.4 mm | 20.5 mm | 6.1 mm
- 140 mm duct, far side | 98.6 mm | 119.5 mm | 133.9 mm
- *250 mm duct, near side | 74.0 mm | 36.6 mm | 10.9 mm
- 250 mm duct, far side | 176.0 mm | 213.4 mm | 239.1 mm
```

## Where to traverse

The equal-area points assume a reasonably regular velocity profile, which needs a length of straight duct before and after the measuring plane. Immediately downstream of an elbow, the velocity piles up against the outer wall; downstream of a junction, the branch's stream has not yet mixed with the main's; downstream of a damper, the flow is skewed towards one side. Readings taken there can be far from the true average even with many points. Flow measurement standards specify the straight lengths they need, usually several duct diameters upstream and fewer downstream. In EX-1, the traverse points were placed in straight runs at the design stage, with sealable test holes, because finding a suitable straight length on a finished system is often harder than providing one on the drawing.

## Density and the reading

The pitot formula needs the density of the air at the measuring point. EX-1's workshop air is close to 1.2 kg/m³, but a hot exhaust is not. This is an illustration. The same velocity pressure of 228 Pa in air at 80 °C, about 0.996 kg/m³, means a velocity of √(2 × 228 ÷ 0.996) = **21.4 m/s**, nearly 10% higher than in cool air. A commissioning engineer who uses the standard density for a hot duct under-reports its velocity and flow by that amount, so the air's temperature is measured and recorded with every traverse.

## Average the velocities, not the pressures

Each traverse reading is a velocity pressure. The average velocity is found by converting **each** reading to a velocity and averaging the velocities. Averaging the velocity pressures first and converting the average gives a slightly higher figure, because the square root of an average is larger than the average of the square roots whenever the readings differ. The difference is usually small, but it is always in the same direction, and it is avoidable.

## The running case: B1's traverse

This is an illustration. B1's 140 mm duct was traversed along one diameter, at a straight section well away from its elbows, with these velocity pressures from wall to wall: 150, 215, 245, 250, 232 and 160 Pa.

- Converted one by one, they give velocities of 15.81, 18.93, 20.21, 20.41, 19.66 and 16.33 m/s, an average of **18.56 m/s**.
- The flow is 18.56 × 0.01539 = **0.286 m³/s**, about 5% below B1's design of 0.30 m³/s.
- Averaging the pressures first, 208.7 Pa, would give 18.65 m/s and 0.287 m³/s: a little high, as expected.

```figure
type: bars
title: Velocities across B1's 140 mm duct, one diameter
unit: m/s
max: 22
caption: This is an illustration. The profile is fullest near the centre and falls towards both walls; its average, 18.56 m/s, is below the centre reading of 20.41 m/s.
- 6.1 mm from wall | 15.81
- 20.5 mm | 18.93
- 41.4 mm | 20.21
- *98.6 mm | 20.41
- 119.5 mm | 19.66
- 133.9 mm | 16.33
```

## The error: a centreline reading

This is an illustration. At the first commissioning visit, the technician measured each branch with a single pitot reading at the duct's centre, to save time. B1's centre reading was 250 Pa, a velocity of 20.41 m/s, which, multiplied by the duct's area, suggested **0.314 m³/s**, comfortably above design. B1 was recorded as correct.

Within weeks the B1 booth's operators reported fume escaping at the face. A full traverse found the true average of 18.56 m/s and 0.286 m³/s. The centreline reading had overstated the flow by about 10%, because the velocity at the centre of a duct is always higher than its average: a centre reading turned a hood 5% short into one apparently 5% over.

The cause of the shortfall was in the balancing. B2's and B3's orifice plates, made undersize in their bores and opened out on site as Chapter 3 described, had been opened a little too far, so B2 and B3 took slightly more than their design flows and left B1 short. Fitting plates with the correct bores brought B1 to 0.30 m³/s, measured by full traverse, without touching the fan's speed. The commissioning procedure was changed to require a full traverse at every branch, with the readings recorded.

## Hood static pressure

A full traverse takes time, and once a system has been commissioned there is a quicker check. The **hood static pressure**, the suction measured at a tapping just downstream of a hood, is related to the hood's flow by the hood's own loss coefficient, which does not change. If the hood static pressure at design flow is known from commissioning, a later reading gives the flow by the square-root rule:

- **Q = Q_design × √(hood static pressure now ÷ hood static pressure at design)**.

This is an illustration. B1's hood static pressure at its design flow is about 342 Pa, as Chapter 5 calculated and commissioning confirmed. A later reading of 300 Pa means B1 is drawing about 0.30 × √(300 ÷ 342) = **0.281 m³/s**, some 6% low, which is worth investigating. A small gauge permanently fitted at each hood, marked with its design reading, lets operators see at a glance whether their booth is working. The gauge does not replace a traverse, because it cannot tell a partly blocked hood from a weak fan, but it tells the operator when a traverse is needed, which is most of its value, and it costs very little to fit while the ducts are being installed.

## The order of balancing

Balancing a branched system means adjusting each branch's resistance until every hood draws its design flow. Because every adjustment changes the flows in every other branch a little, the order matters.

```figure
type: steps
title: Balancing EX-1
caption: This is an illustration of one common sequence. The project's specification and commissioning standard govern the method used on a real system.
- Check the system is complete | Every duct, door, plate and gate fitted as designed; filters at a known condition
- Set the fan | Drive at its design setting; record speed, current and the pressure rise across the fan
- Traverse every branch | Full traverses; compare each flow with design
- Adjust the branches nearest the fan first | Their plates or gates set to bring them to design, shifting flow towards the far branches
- *Re-traverse every branch | Adjustments interact; repeat until all are within tolerance
- Adjust the fan last, if at all | Only if every branch is in proportion but all are high or low together
- Record and lock | Readings, plate bores, gate positions, hood static pressures; lock adjustable devices
```

The key idea is proportion. If every branch is low by the same percentage, the fan is short, and a small increase in its speed, checked against the motor's rating as Chapter 8 required, brings them all up together. If some are high and some low, the branches are out of balance, and changing the fan will not fix it; only the branches' resistances will.

## Measuring at the fan

The fan's performance is checked by measuring its flow, by traverse in its inlet or outlet duct, and its pressure rise, from static pressure tappings on each side plus the velocity pressures there. The measured point is compared with the fan's curve at its measured speed. A fan whose measured point lies on its curve is installed well; one whose point lies below its curve is losing performance to its installation, which in EX-1's case Chapter 7 traced to the abrupt step and the elbow at its inlet. The motor's current, compared with its rating, confirms how close the fan is to the limit Chapter 8 set.

## Tolerances and instruments

No measurement is exact, and a commissioning specification sets a tolerance within which a measured flow counts as meeting design, often a band of a few per cent to ten per cent either side, depending on the system and the contract. EX-1's specification, in this illustration, accepted each hood within ±5% of 0.30 m³/s, which is why B1's 0.286 m³/s, at −4.7%, was only just inside and still worth correcting, given the complaints.

The instruments must be good enough for the tolerance. A manometer reading 150 Pa to ±2 Pa contributes well under 1% to the velocity, but one reading 20 Pa to the same ±2 Pa, in a slow duct, contributes about 5%. Pitot tubes must be straight, with clear holes, and aligned with the flow; a tube yawed 10° or 15° off the axis reads low. Instruments should carry current calibration, and the record should say which were used.

## Recording the results

The commissioning record is the system's baseline. For EX-1 it lists each hood's measured flow and hood static pressure, each orifice plate's bore, the fan's speed, current and pressure rise, the filters' condition at the time, and the date. Every later check, every complaint about a weak hood and every proposed change is compared against it. A system without a commissioning record can still be measured, but nobody can say whether what they find is a change or how it was always.

## Keeping it right

A system that measured correctly at commissioning drifts. Filters load and are cleaned, dust settles in quiet corners, an access door is left loose, a blast gate is moved, a booth is added or removed. Each changes the flows, usually slowly enough that nobody notices until a booth stops working. The defences are cheap: hood static pressure gauges read at each shift or each week, a routine full traverse once or twice a year, the collector's pressure loss logged so that cleaning happens at the right point, and a rule that any change to the system, however small, is followed by a check of every hood.

The book's chapters each found a way the system could go wrong: a branch upsized below its transport velocity, a comfort-duct conversion, diameters added instead of areas, a length of rough hose, sharp elbows, a clean-filter fan selection, an abrupt step at the fan, a speed increase, hangers for clean duct and a centreline reading. Every one of them was caught by comparing a number with another number that should have agreed. Measuring and recording are how that comparison continues for the life of the system, after the designer and the commissioning engineer have gone.

## Exercise: a proportional shortfall

At a routine check a year after commissioning, with the filters at their cleaning point, all three hoods' static pressures read about 10% below their commissioned values. What does that suggest, roughly what are the flows, and what should be checked before anything is adjusted?

**Worked answer.** A drop of 10% in hood static pressure means each hood's flow has fallen by about √0.90 = 0.949, roughly **5%**, to about 0.285 m³/s each. Because all three have fallen in proportion, the branches are still balanced with each other, and the cause is something common to them all: the fan, the drive, the collector or the shared main.

Before anything is adjusted, check that the filters' loss is no higher than the 1,500 Pa cleaning point the fan was selected for; that the drive is reaching its design speed at that loss; that the fan's belts, if it has them, are not slipping; and that the shared main from N3 to the collector is not partly blocked, as Chapter 4's exercise showed dust can do. Only if all of those are in order, and the motor's current shows room within its rating, is a small increase in fan speed the right response.
