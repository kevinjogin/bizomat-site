---
book: requirements-that-cannot-all-be-true
chapterSlug: accuracy-against-the-error-budget
order: 5
title: "Accuracy against temperature: the error budget for a long axis in a warm workshop"
description: "How an accuracy requirement and an unconditioned workshop conflict through thermal growth, how to build an axis error budget that proves it, and how to restate accuracy at a reference temperature."
draft: false
---

The request asks for positioning accuracy of ±0.010 mm over 1,500 mm of travel, and it asks for that accuracy in a workshop that runs from 15 to 35 °C with no air conditioning. Quality wrote the first requirement; facilities wrote the second as a statement of fact. Neither looks like a conflict. Steel grows by about 11.5 micrometres per metre for every kelvin it warms, and that single property connects them.

This chapter does two things. It shows that the accuracy requirement, as written, has no definite meaning until it names a temperature, which is a contradiction to be settled by definition. Then it builds an error budget for the axis and shows that, once the meaning is settled, an open-loop screw axis cannot meet it, while a different design can.

## What accuracy means in a warm workshop

This is an illustration. The station measures hole positions on welded steel frames. The frames' drawings give hole positions to ±0.10 mm, a tolerance band of 0.20 mm. The customer's quality rule is that a measuring system may use no more than 10% of the tolerance it checks, which gives 0.020 mm, the same as ±0.010 mm. R3 came from that rule.

Now warm the frame. At 35 °C, a 1.5 m steel frame is about 0.26 mm longer than at 20 °C, since 1.5 m × 11.5 µm/(m·K) × 15 K ≈ 259 µm. That growth is larger than the frame's whole tolerance band. A hole that is exactly on position at 20 °C is 0.26 mm off position at 35 °C, measured from the far end.

So which dimension does the drawing mean? Engineering drawings conventionally refer dimensions to a standard reference temperature; ISO 1 sets it for geometrical product specification, at 20 °C. A frame is conforming if its dimensions are within tolerance at 20 °C, whatever temperature it happens to be when measured. The [Thermal Expansion chapter on measuring at the right temperature](/reados/publications/thermal-expansion-by-the-numbers/measuring-at-the-right-temperature/) covers the method.

That settles the contradiction. "Accuracy of ±0.010 mm at any temperature from 15 to 35 °C" cannot mean that the station must report the frame's size at the shop's temperature, because the drawing does not specify that size. It must mean that the station reports the size the frame would have at 20 °C, to within ±0.010 mm, whatever the shop temperature. That is a harder requirement than it sounds, because it makes the station responsible for two thermal effects: its own growth, and the frame's.

## Two thermal problems, not one

The station's own axis grows too. If the screw were exactly at the frame's temperature, and both were steel, their growth would largely cancel: a warm screw measures a warm frame with a warm ruler. The trouble is that they are rarely at the same temperature.

- **The screw warms itself.** Preload and friction in the nut and bearings put heat into the screw while the axis works. Chapter 4's preload is a heat source as well as a load.
- **The workshop changes faster than the frame.** A frame of 200 kg lags the air temperature by hours; a slender screw follows it in minutes. On a summer afternoon, the screw may be several kelvin warmer than the frame it measures.
- **The frame must be referred to 20 °C.** Even a perfect axis needs the frame's temperature, measured, to correct its reading to the reference temperature. Any error in that temperature becomes an error in the reported position.

The first two are errors of the machine. The third is an error of the measurement method. The error budget below deals with the machine's errors, and the third is added separately.

## The error budget

The [machine axis error budget tool](/tools/machine-axis-error-budget/) in BIZOMAT Tools combines the main errors along one machine axis: positioning accuracy and repeatability from an axis test, the Abbe error from the offset between the work and the axis's measuring line multiplied by the axis's angular error, the uncompensated part of the screw or scale's thermal growth, and the fixture or set-up error. It adds them two ways, as a worst-case sum and as a root-sum-square, and compares the totals with the share of the tolerance you allow the machine. Its limitations are stated: the root-sum-square treats errors as independent, which correlated thermal errors are not; and it handles one axis only.

This is an illustration. The engineer enters the frame tolerance band of 0.2 mm with a 10% share, giving 20 µm allowed. The probe tip sits 150 mm from the screw's line, and the carriage's pitch error over the travel is 5 arcseconds, giving an Abbe error of 3.64 µm. The fixture locates the frame to within 4 µm in this direction. The thermal term uses the 1,500 mm of screw in use, steel at 11.5 µm/(m·K), and a screw running 8 K warmer than the frame on a hot afternoon.

She budgets three designs.

- **A: rolled screw, no feedback.** Positioning accuracy 60 µm and repeatability 8 µm from the builder's last axis test on a rolled screw of this length. No thermal compensation.
- **B: ground screw, no feedback.** Positioning accuracy 12 µm and repeatability 3 µm. First with no compensation, then with a screw temperature sensor that lets the control remove 80% of the growth.
- **C: linear scale on the beam.** The carriage position is read directly from a scale clamped to the steel beam, so the screw's growth drops out. Positioning accuracy 6 µm and repeatability 2 µm. What remains thermally is the difference between the beam and the frame, taken as 1.5 K, with 60% removed by a beam temperature sensor.

```figure
type: bars
title: Root-sum-square error for each design against 20 µm allowed
unit: µm
caption: This is an illustration. Results from the machine axis error budget tool. Thermal growth is the largest source in every design. Only the linear scale with compensation fits inside 20 µm, and only statistically: its worst-case sum is 26.0 µm.
- A: rolled screw, no feedback | 150.8
- B: ground screw, no compensation | 138.7
- B: ground screw, 80% compensated | 30.7
- * C: linear scale, 60% compensated | 13.3
- Allowed for the machine | 20.0
```

### Reading the budget

In design A, thermal growth contributes 138 µm, 83.8% of the root-sum-square total. A better screw, design B, removes most of the positioning error but leaves the thermal error untouched, so its total barely changes: 138.7 µm, with thermal growth now 99.1% of the total. This is the most useful single number in the budget. It says that money spent on a better screw, without dealing with heat, buys almost nothing.

Compensating 80% of the screw's growth brings design B down to 30.7 µm, still half again too much. Compensation is limited by how well a sensor on the screw's surface represents the temperature along the whole screw while it is working.

Design C changes what is being measured. With a scale on the beam, the screw is only a motor; its growth no longer moves the reported position. The remaining thermal term, 10.35 µm, comes from the difference between the beam and the frame. The root-sum-square total is 13.28 µm, inside the 20 µm allowed. The worst-case sum, 25.99 µm, is not, which the tool reports as capable statistically rather than capable in the worst case.

```figure
type: compare
title: The error budget for design C
cols: Error | Share of RSS²
caption: This is an illustration. From the machine axis error budget tool. Thermal growth is still the largest term even with a scale; the fixture and the Abbe offset are the next places to look for margin.
- Positioning accuracy | 6 µm | 20.4%
- Repeatability | 2 µm | 2.3%
- Abbe error, 150 mm offset at 5 arcseconds | 3.64 µm | 7.5%
- * Thermal growth, beam to frame, after 60% compensation | 10.35 µm | 60.7%
- Fixture and set-up | 4 µm | 9.1%
```

### Adding the frame's own temperature

The budget so far covers the machine. The method adds one more error: the uncertainty in the frame's measured temperature, used to correct its reading to 20 °C. If the frame's temperature is known to within 0.3 K, the corresponding error at 1.5 m is 1.5 × 11.5 × 0.3 ≈ 5.2 µm. Combined by root-sum-square with the machine's 13.28 µm, the total is about 14.3 µm, still inside 20 µm. That is why the rewritten requirement must name the frame-temperature measurement as part of the station, not as something the operator does with a hand thermometer.

### Worst case or root-sum-square?

Design C passes by root-sum-square and fails by worst case. Which should decide? The root-sum-square is justified when the errors are independent and unlikely to reach their extremes together. Positioning error, repeatability and fixture error largely are. Thermal error is the exception the tool's limitations warn about: on a hot afternoon, the beam-to-frame difference, the scale's own condition and the frame's temperature error can all move in the same direction at once, because they share a cause.

The engineer therefore does not rely on the root-sum-square alone. She checks the hot-afternoon case as a correlated one: thermal growth at its full 10.35 µm, the frame-temperature error at its 5.2 µm, and the independent errors combined by root-sum-square, √(6² + 2² + 3.64² + 4²) ≈ 8.3 µm. Adding the correlated terms directly gives about 23.8 µm, just over the 20 µm allowed. The design is adequate on most days and marginal on the worst afternoon.

That result points to where the margin can come from. Two options are cheap. The probe can be mounted closer to the scale, which shrinks the Abbe error in proportion to the offset; at 75 mm instead of 150 mm it halves to 1.8 µm. And the beam sensor can be supplemented by a second sensor at its far end, which improves the compensation from 60% to a higher share, since the larger part of the thermal term comes from not knowing the beam's temperature along its length. The engineer budgets both as options and leaves the choice to Chapter 8.

## Is the conflict physical or definitional?

Both, and in sequence. As written, R3 and R4 together were contradictory, because "accuracy at any temperature" had no definite meaning. Settled by reference to 20 °C, the requirement became definite, and the error budget then showed a physical conflict: no open-loop screw axis, rolled or ground, can meet it in that workshop. The conflict is removed by a design that measures position directly and compensates temperature, which costs more. Chapter 8 adds that cost to the comparison of options.

This sequence is common. A requirement that seems impossible often turns out first to be ambiguous. Settling the ambiguity does not make it easy. It makes it calculable, which is what an engineer needs before a price can be honest.

## The failure case: an acceptance test in winter

This is an illustration. Some years ago the builder supplied a measuring axis that passed its acceptance test in July, in a workshop at 17 °C, with positioning errors under 8 µm. In February, the customer reported that measurements drifted through the afternoon by up to 0.07 mm, and that frames measured after lunch failed more often. The axis was found to meet its specification at the temperature of the test. It did not meet it at the temperatures it worked in, and the specification had not said which.

### How it is detected and corrected

The failure is detected before delivery by budgeting at the hottest and coldest conditions the requirements name, not at the conditions of the test, and by recording temperature with every acceptance run. The correction on that job was a scale and a part-temperature probe, fitted at the builder's cost, and a rewritten acceptance procedure that repeated the test at both ends of the workshop's range. The lesson the builder took was simple: an accuracy requirement without a temperature is not a requirement, and an acceptance test at one temperature proves accuracy at that temperature only.

## The rewritten accuracy requirement

```figure
type: checklist
title: What the accuracy requirement now states
caption: Each line was in the request only by implication, or not at all.
- The quantity | hole positions reported to within ±0.010 mm of their value at 20 °C
- The range of conditions | workshop air from 15 to 35 °C, frames up to 200 kg
- The reference | ISO 1 reference temperature, with frame temperature measured by the station
- The method | carriage position from a linear scale; beam and frame temperature compensation
- The acceptance | positioning tests at the cool and warm ends of the range, temperatures recorded
- ? The budget owner | who may change the share of tolerance given to the station
```

The rewrite also changes who carries which risk. Under the original wording, a dispute about a drifting reading on a hot afternoon would have turned on what "accuracy at any temperature" meant, and nobody could have said. Under the rewrite, the station either reports positions referred to 20 °C within ±0.010 mm across the stated range, or it does not, and the acceptance tests at both ends of the range show which. The frame-temperature probe, the scale and the compensation are now part of what the builder supplies and warrants, priced in the quote rather than argued about after delivery.

## Exercise: an aluminium frame

A different customer wants to measure aluminium frames 1.2 m long on a station with a steel screw and no feedback or compensation. The shop runs up to 30 °C. Take aluminium as 23 µm/(m·K) and steel as 11.5 µm/(m·K).

1. How much longer is the frame at 30 °C than at 20 °C?
2. If the screw and frame are both at 30 °C, what error does the station make in the frame's length at 20 °C, and in which direction?

**Worked answer.**

1. 1.2 m × 23 µm/(m·K) × 10 K = 276 µm, about 0.28 mm.
2. The steel screw has grown by 1.2 × 11.5 × 10 = 138 µm, so it reads the warm frame as 276 − 138 = 138 µm longer than its own warmed scale of length. The station reports the frame about 0.14 mm longer than it would be at 20 °C, because the screw's growth cancels only half of the aluminium's. Equal temperatures cancel thermal error only when the machine and the part grow at the same rate. For mixed materials, the station must measure the part's temperature and correct for its expansion coefficient, or the requirement must say that parts are measured at 20 °C.
