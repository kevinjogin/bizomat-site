---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: rain-and-water-penetration
order: 4
title: "Rain: water penetration ratings and the drained sill"
description: "Read AMCA 500-L and EN 13030 rain ratings correctly, compare them with PR-30's free-area velocity, estimate the water that still gets through in a storm, and drain it with a sill and tray."
draft: false
---

An intake louvre pulls air in, and rain comes with it. No practical louvre is perfectly watertight while air is flowing; the question is how much water gets through, at what airflow and in what weather, and where that water goes once it is inside. A louvre that lets a few litres through in a severe storm is acceptable if the water lands in a drained tray; the same few litres dripping onto a switchboard or into a compressor's cooling intake are not.

This chapter explains how rain gets through a louvre, reads the two common test ratings, AMCA 500-L's beginning point of water penetration and EN 13030's rain defence classes, compares them with PR-30's free-area velocity, estimates the water that a rated louvre may still admit in a storm, and drains it with a sloped sill and a tray. The failure case is a louvre with no drained sill, whose water found the dryer.

## How rain gets through

Water passes a louvre in four ways:

- **Carried by the air.** Drops falling in front of the louvre are drawn in by the inflowing air. The faster the air, the larger the drops it can carry round the blades. This depends mainly on free-area velocity.
- **Driven by wind.** Wind blowing onto the wall throws drops at the louvre, sometimes nearly horizontally and sometimes upwards in gusts and eddies. This depends on exposure and wind speed, and can happen with no airflow at all.
- **Running along the blades.** Water striking a blade runs down its face. With strong airflow, a film of water can be pushed back up the blade and off its inner edge. The drainable hook in Chapter 2 exists to catch it.
- **Splashing.** Heavy drops striking a sill or a blade burst and spray, and some of the spray is carried in.

Good louvre design attacks each: modest free-area velocities, overlapping and drained blades, drip lips, a sill that throws water out, and a place inside where whatever still gets through can drain away.

## The two common ratings

Makers rate their louvres' rain performance in tests, and two families of test are common in Australian catalogues.

```figure
type: compare
title: Two rain tests for louvres
cols: What is tested | What is reported | How to use it
caption: Summaries from manufacturers' published catalogues and descriptions of the tests; AMCA 500-L and EN 13030 themselves are named by number only. Always read the conditions behind a rating, and the velocity and area on which it is stated.
- AMCA 500-L water penetration | rain falling on a test louvre while air is drawn through it, 15 minutes per point | the beginning point of water penetration: the free-area velocity at which 0.01 oz of water per ft² of free area, about 3 g/m², passes | keep the design free-area velocity well below it
- EN 13030 rain defence | a 1 m × 1 m louvre in 13 m/s wind and simulated rain of 75 L/h per m², with airflow varied up to 3.5 m/s | effectiveness at each airflow, graded Class A to D | choose a class at the louvre's actual design velocity
```

### AMCA's beginning point

The AMCA water penetration test draws air through a louvre with rain falling on its face, and finds the velocity at which a small, defined amount of water first passes through. Catalogues tested to it define that **beginning point** as the free-area velocity at which 0.01 oz of water per square foot of free area, about **3 g/m²**, penetrates during a 15-minute test. The test has little or no wind, so it measures water carried in by the airflow rather than water driven by wind.

Catalogue beginning points for drainable louvres are often in the range of roughly 900 to 1,200 ft/min, about **4.7 to 5.9 m/s**; some louvres rate lower. Makers' own notes commonly warn that the test is a benchmark for comparing louvres, not a prediction of performance on a building in a wind-driven storm, and advise designing below the beginning point.

```figure
type: bars
title: PR-30's free-area velocity beside some published AMCA beginning points
unit: m/s
max: 6.5
caption: Catalogue values converted from ft/min (1 ft/min ≈ 0.00508 m/s), from several manufacturers' published AMCA test results for different louvre models. They are examples, not a recommendation of any product. PR-30's design velocity is about half the typical beginning point.
- *PR-30 design, 2.37 m/s | 2.37
- A low published rating, 727.5 ft/min | 3.70
- Typical drainable louvre, 930 ft/min | 4.72
- Typical drainable louvre, 1,002 ft/min | 5.09
- A high published rating, 1,170 ft/min | 5.94
```

### EN 13030's classes

The EN 13030 test is harsher. It blows a **13 m/s** wind with simulated rain at **75 L/h per m²** onto a 1 m × 1 m louvre, while drawing air through it at rates up to 3.5 m/s, and measures how much of the water is kept out. The **effectiveness** at each airflow is graded:

- **Class A**: 99% or better, an ingress of up to about 0.75 L/h per m²;
- **Class B**: 95% to 98.9%, about 0.75 to 3.75 L/h per m²;
- **Class C**: 80% to 94.9%, about 3.75 to 15 L/h per m²;
- **Class D**: below 80%, more than 15 L/h per m².

Effectiveness falls as airflow rises. A louvre may be Class A with no air flowing and Class C at its full rated airflow, so a class quoted without a velocity means little. The designer asks the maker for the class at the louvre's actual design velocity, and confirms on which area that velocity is calculated, because test reports differ.

## What still gets through

For PR-30, the designer selected a drainable louvre whose maker rates it Class B at PR-30's design airflow. In a storm as severe as the test, wind at 13 m/s and heavy rain on the wall, the worst Class B ingress is about **3.75 L/h per m²**. Over the louvre's 3.6 m² face, that is about **13.5 L/h**, and over a three-hour storm about **40.5 L**.

```figure
type: stats
title: Water that PR-30's intake might admit in a three-hour test-level storm
caption: This is an illustration using the upper limit of each class's ingress over the louvre's 3.6 m² face. Real storms vary, and the test is a severe benchmark; the point is the order of magnitude, which sets the drained tray's duty.
- 8.1 L | Class A at its limit | 0.75 L/h per m² × 3.6 m² × 3 h
- *40.5 L | Class B at its limit, PR-30's louvre | 3.75 × 3.6 × 3
- 162 L | Class C at its limit | 15 × 3.6 × 3
```

Forty litres is a few buckets, which is not a flood, but it is far too much to leave to evaporate on a plant room floor, and far too much to let reach electrical equipment. The louvre's rating, in other words, does not remove the need to drain the inside; it sizes it.

## The drained sill and the tray

PR-30's intake louvre sits on a folded aluminium **sill flashing** that falls outwards, so that water running down the jamb channels and off the bottom blade is thrown clear of the wall. The sill has a **50 mm** upstand at its back edge, inside the louvre frame, so that water collecting on the sill cannot run inwards, and its stop-ends close it at each jamb.

Behind the louvre, on the plant room floor, a shallow stainless **drained tray** catches whatever passes the blades and the sill. It is **2.4 m** wide, **0.6 m** deep from the wall and has a 50 mm lip, so it holds about **2.4 × 0.6 × 0.05 = 0.072 m³, or 72 L**, before it overflows, more than the 40.5 L estimate. It does not rely on that capacity: a 40 mm outlet at its low corner drains it through the wall to the outside, below the sill. The tray also catches condensation from the louvre and dust washed off the blades, and it keeps the first 600 mm in front of the louvre clear of equipment, which also helps the air spread out before it reaches the compressors.

### Where the machines are

The compressors draw their cooling air from the room, and the dryer and the control panels sit low on the floor. PR-30's layout keeps the dryer and all electrical panels out of the zone directly in front of the intake, so that any water that does pass the louvre and the tray's lip in an extreme event falls on the floor, not into equipment. The compressor maker's installation instructions also ask for the machines' own intakes to draw dry, clean air, which is easier to achieve with the intake louvre a few metres away than with the compressor pushed up against it.

## Exposure and design velocity

The right design velocity depends on exposure. A louvre on a sheltered wall, under a deep eave or facing away from the prevailing wet weather, sees little wind-driven rain and can run at a higher free-area velocity. One on an exposed wall facing the storms, high on a building or in a cyclonic region, needs a better class, a lower velocity, or both. PR-30's south wall faces winter storms, which is why the designer chose a drainable Class B louvre at a modest velocity. An east-wall intake, sheltered by the neighbouring building, might have used a plain louvre at a higher velocity. Where the choice is between a larger louvre and a better-rated one, the cost comparison should include the drainage inside: a cheaper louvre on an exposed wall may need a deeper tray, a larger outlet and more floor kept clear, and a plant room's floor space is rarely spare.

## Rain at the exhaust

The exhaust louvre has an easier life while its fans run, because air is blowing outwards through it and carries most drops back out. Its difficult times are when the fans stop. PR-30's motorised exhaust louvre opens for natural ventilation when the compressors are off (Chapter 6), and an open louvre with its blades near horizontal and no air blowing outwards is a poor rain barrier on a wall that faces the weather. The east wall is sheltered by the neighbouring building, which is one reason the exhaust is there; even so, the louvre's control closes it when a rain sensor on the roof detects rain and the room is cool enough not to need the air. The exhaust louvre has its own sill flashing, falling outwards, and the floor below it is kept clear.

## Keeping the drains working

A drained sill and a drained tray only work while their drains are clear. Jamb channels collect leaves, dust, insects and the occasional wasp nest; the tray's outlet collects dust washed off the blades. PR-30's maintenance schedule includes a quarterly check: look along each jamb channel with a torch, flush it with a hose from the top and watch it discharge at the sill, pour a bucket of water into the tray and time how long it takes to empty, and look at the floor beyond the tray for any sign of water. The check takes ten minutes and is recorded on the plant room's log sheet beside the compressors' own service entries.

### A hose test at handover

At handover, the installer runs a simple hose test of the louvre and sill with the fans running: water sprayed onto the louvre face from outside for a few minutes, working from the sill upwards, while someone inside watches the tray and the floor beyond it. It is not the laboratory test, and it does not prove the louvre's rating; it proves that the sill, the stop-ends, the jamb drains and the tray outlet are all doing their jobs as installed, which is where field failures usually occur.

## A failure case: no drained sill

This is an illustration. On an earlier compressor room, a louvre with a good rain rating was installed on a flat timber packer in a block wall, with no sill flashing and nothing inside but bare floor. The louvre's own frame had drain slots at the foot of its jambs, but they discharged onto the packer, inside the wall line.

Over the first winter, staff noticed a damp patch under the louvre after storms and assumed it was harmless. In spring, a service technician found rust on the dryer's base frame and water marks inside its electrical enclosure, which stood 1.2 m in front of the louvre. The detection came from that service; the cause was traced by watching the louvre during a storm, when water could be seen running from the jamb drains across the packer and onto the floor, and spray being carried a metre into the room.

The correction was a folded sill flashing with an outward fall and back upstand, a drained tray behind the louvre, and moving the dryer two metres along the wall. The shop now treats a sill flashing and an internal drainage plan as part of every intake louvre, not as an option.

## How this applies to a small Australian business

Know how rain gets through a louvre and design against each path. Read rain ratings with their conditions: keep the free-area velocity well below an AMCA beginning point, and ask for an EN 13030 class at the actual design velocity, stating which area the velocity is based on. Estimate the water a rated louvre may still admit in a severe storm and drain it: sill flashing with an outward fall and a back upstand, a drained tray, and nothing electrical directly in front of the louvre. Choose louvre type and velocity to suit the wall's exposure.

## Exercise: an exposed wall

A second plant room has an intake on an exposed coastal wall, with a design airflow of 2.0 m³/s. The designer wants to stay below 40% of a typical AMCA beginning point of 5.0 m/s, and is choosing between louvres with free-area ratios of 45% and 35%. What free area is needed, and what gross face area does each louvre need? If the selected louvre is Class A at the design velocity, what is the most water it might admit over a four-hour test-level storm on the smaller of the two faces?

**Worked answer.** The target velocity is **0.40 × 5.0 = 2.0 m/s**, so the free area needed is **2.0 ÷ 2.0 = 1.0 m²**. At a 45% free-area ratio the gross face is **1.0 ÷ 0.45 ≈ 2.22 m²**; at 35% it is **1.0 ÷ 0.35 ≈ 2.86 m²**. The smaller face is 2.22 m², and at the Class A limit of 0.75 L/h per m², the most it might admit over four hours is **0.75 × 2.22 × 4 ≈ 6.7 L**, which a drained sill and a small tray handle easily.
