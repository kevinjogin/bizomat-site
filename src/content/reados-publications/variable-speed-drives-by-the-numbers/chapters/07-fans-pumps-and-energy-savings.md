---
book: variable-speed-drives-by-the-numbers
chapterSlug: fans-pumps-and-energy-savings
order: 7
title: "Fans, pumps and energy savings"
description: "How the fan and affinity laws predict the power saved by slowing a fan or pump, why static head cuts the saving, how to measure the before and after, and how to appraise a drive as an investment."
draft: false
---

The biggest single reason factories fit drives is energy. A centrifugal fan or pump throttled by a damper or valve runs at full speed and burns off the pressure it does not need; the same machine slowed to deliver just the flow required draws a fraction of the power. Because the power of a fan or pump falls roughly with the cube of its speed, modest speed reductions save a lot. But "roughly" is doing work in that sentence, and the size of the saving depends on the system the machine serves.

This chapter works the fan laws for DP-4's extraction fan with the WORKOS fan drive tool, measures the pump's load before its drive with the motor load assessment tool, shows why the pump's cooling tower lift cuts its saving below the cube law, and appraises both drives as investments. It ends with a pump saving estimated by the cube law alone.

## The fan and affinity laws

For a centrifugal fan or pump on a system whose resistance is all friction, with no static lift or fixed pressure, the operating point moves along a line where:

- flow is proportional to speed;
- pressure or head is proportional to speed squared;
- power is proportional to speed cubed.

So at 80% speed a fan delivers 80% of the flow at 64% of the pressure for 51.2% of the power. The same laws describe trimming a pump's impeller, with diameter in place of speed, within limits.

```figure
type: formula
title: Fan and affinity laws on a system without static head
formula: Q₂ ÷ Q₁ = n₂ ÷ n₁;   p₂ ÷ p₁ = (n₂ ÷ n₁)²;   P₂ ÷ P₁ = (n₂ ÷ n₁)³
formula: Fan air power = Q × p_t;   shaft power = air power ÷ η_fan
formula: With static head H_s: system head H = H_s + k Q², and the speed for a flow Q_t is set by where the slowed pump curve meets it
caption: Q is the flow, p the fan pressure or pump head, P the shaft power and n the speed. The laws hold for the same machine at similar efficiency. Where part of the head is static, such as a lift to a tower or a fixed pressure, the operating point does not move along the cube law, and the speed and power at a reduced flow are both higher than the laws predict.
- Q | flow, m³/s or L/min
- p_t | fan total pressure, Pa
- η_fan | fan efficiency
- H_s | static head, m
```

## The extraction fan

Before its drive, F-1 ran at full speed with its outlet damper partly closed, delivering the 4.2 m³/s the hoods needed. With the damper wide open at full speed, the system would pass about 5.25 m³/s against a fan total pressure of about 2,800 Pa, with the fan running at 1,800 rpm on its belt drive and 72% efficient. The extraction system is all ducts, hoods and a filter: friction, with no static pressure to overcome, so the fan laws apply.

The [fan drive sizing tool](/tools/fan-drive-sizing/) works out the air and shaft power from flow, pressure and efficiency, then the speed, pressure and power for a new flow by the fan laws, the motor power with belt losses and a margin, and the pulley size for the new speed.

```figure
type: compare
title: F-1 slowed to 4.2 m³/s with the damper open, from the fan drive sizing tool
cols: Value
rowhead: Result
- Present air and shaft power, 5.25 m³/s at 2,800 Pa | 14.7 kW and 20.42 kW
- New fan speed | 1,440 rpm, 80% of 1,800 rpm
- New fan pressure | 1,792 Pa
- * New fan shaft power | 10.45 kW, 51.2% of full-speed power
- Motor power with 95% belt efficiency and 15% margin | 12.65 kW
caption: This is an illustration. The tool also suggests a pulley size for a fixed new speed, which does not apply here: the drive varies the speed, and the pulleys stay as they are. The tool's motor rating suggestion of 15 kW is for a new fixed-speed fan; F-1 keeps its 30 kW motor for hot days at full speed.
```

The motor now delivers about 10.45 ÷ 0.95 = 11.0 kW to the belt at the usual duty, at about 40 Hz, the figure Chapter 1 found on the drive's display. Before, it delivered 21.6 kW, measured by the slip method. The fan's power did not fall to nothing when the damper closed, because a centrifugal fan with a closed damper still churns air; the damper turned about half the fan's work into pressure lost across the damper blades.

In electrical terms, with the motor about 93.5% efficient at 72% load and about 92% at 37% load, and the drive losing 0.29 kW at that duty (Chapter 3):

- before: 21.6 ÷ 0.935 = 23.10 kW from the supply;
- after: 11.0 ÷ 0.92 + 0.29 = 12.25 kW;
- saving: 10.86 kW, or 65,130 kWh over the plant's 6,000 running hours a year, worth about A$13,680 a year at A$0.21 per kWh excluding GST.

## The cooling-water pump

P-3 lifts water from the cooling tower's basin and pushes it through the extruder's and granulator's heat exchangers and back up to the tower's spray header, 8 m above the basin. Before its drive, it ran at full speed with a manual valve partly closed. The [motor load assessment tool](/tools/motor-load-assessment/) estimated its load from its measured speed and nameplate.

```figure
type: compare
title: P-3's motor before its drive, from the motor load assessment tool
cols: Value
rowhead: Result
- Nameplate | 22 kW, 400 V, 2 poles, 2,950 rpm, power factor 0.88, efficiency 93%
- Measured speed | 2,962 rpm
- Slip measured and rated | 1.27% and 1.67%
- * Estimated load | 76%, MOTOR LOAD NORMAL
- Estimated output and input | 16.72 kW and 17.98 kW
- Energy and cost a year | 107,871 kWh, A$22,653 at A$0.21 per kWh over 6,000 hours
caption: This is an illustration. The slip method is approximate, about ±20% by the tool's guide; the plant confirmed it with a clamp-on power meter, which read 17.6 kW.
```

The pump's curve and the system's are known well enough to model with the [pump operating point tool](/tools/pump-operating-point/), which fits a quadratic pump curve through the shut-off head and best-efficiency point, and a system curve through the static head and one known duty point. With the valve open, P-3 runs at 1,922 L/min and 40.7 m, 78% efficient, absorbing 16.38 kW, close to the slip estimate. The process needs on average about 1,440 L/min, 75% of that flow.

## Static head and the real saving

The [pump and fan affinity laws tool](/tools/pump-affinity/) applies the cube law: at 75% of the flow, it predicts 75% speed, 56% of the head and 42% of the power, 6.89 kW. Its guide warns that the laws assume no static head. P-3 has 8 m of it, a fifth of its total head.

The pump operating point tool gives the speed actually needed for 1,440 L/min on P-3's system: 2,339 rpm, 79.3% of rated, not 75%. At that flow the system head is 8 + 8.864 × 10⁻⁶ × 1,440² = 26.4 m, not 22.9 m, and the hydraulic power is 998 × 9.81 × 0.024 × 26.4 = 6.20 kW. Taking the pump's efficiency at the slowed operating point as about 76%, the absorbed power is about 8.15 kW, 18% more than the cube law's 6.89 kW.

```figure
type: bars
title: P-3's shaft power at 1,440 L/min, by method
x: Method
y: Shaft power, kW
caption: This is an illustration. Full speed with the valve open 16.38 kW; cube law at 75% speed 6.89 kW; with the 8 m static head, 79.3% speed and 26.4 m, 8.15 kW at an assumed 76% efficiency. Throttling to the same flow at full speed would absorb more than either.
- Full speed, valve open | 16.38
- Cube law, no static head | 6.89
- * With the 8 m lift | 8.15
```

In electrical terms the real saving is about 17.61 − 9.06 = 8.55 kW, worth about A$10,780 a year. READOS's [Centrifugal Pumps by the Numbers](/reados/publications/centrifugal-pumps-by-the-numbers/) works through speed control on a system dominated by lift, where the effect is far larger: with a high static head, slowing the pump can save almost nothing per cubic metre pumped, or stop the flow altogether.

## Control decides the saving

A drive saves energy only if something tells it to slow down. The saving depends as much on the control strategy as on the hardware.

F-1 is controlled on the static pressure in the main extraction duct, measured by a transmitter a little upstream of the fan. As granulators start and stop and their hood dampers open and close, the pressure controller adjusts the fan's speed to hold the duct pressure at its setpoint. The setpoint matters. Set high, it keeps the fan near full speed whatever the hoods need; set low, it risks starving the farthest hood, where the capture velocity must be maintained for the workers' exposure to dust and vapour to stay controlled. The plant set it from measurements of capture velocity at each hood with all hoods open, then trimmed it down until the farthest hood was just inside its requirement, with a margin. Lowering the setpoint by 10% lowers the fan's power by roughly 15%, because power at a given flow follows pressure and flow together.

P-3 is controlled on the temperature of the water returning from the extruder. When the extruder runs slowly or the weather is cool, less flow is needed to hold the return temperature, and the pump slows. Here the static head sets a floor. The pump's shut-off head at reduced speed falls with the square of speed: 52 × s² metres. It can deliver any flow at all only while that exceeds the 8 m lift, so below s = √(8 ÷ 52) = 0.392, about 1,157 rpm or 19.6 Hz, P-3 would spin without moving water. Long before that, its efficiency falls away. The drive is therefore set with a minimum speed of 30 Hz, and the controller holds the return temperature with the tower fan when less flow would do.

## Where else drives save energy

Fans and pumps give the largest savings because of the cube law. Other loads save less, or in other ways:

- **Air compressors.** A screw compressor with a drive can follow the plant's air demand instead of cycling between loaded and unloaded running, when an unloaded compressor still draws a quarter or more of its full power doing nothing. READOS's [Compressed Air Plant by the Numbers](/reados/publications/compressed-air-plant-by-the-numbers/) covers the plant side.
- **Conveyors and other constant-torque loads.** Power is proportional to speed, so running slower saves only in proportion, and the energy per tonne moved barely changes. The saving comes from not running empty: stopping or slowing the belt when nothing is on it.
- **Cooling-tower fans.** Like extraction fans, they follow the fan laws, and slowing them on cool days saves a lot.
- **Oversized motors on the mains.** A motor running at light load wastes little energy by running too fast, because an induction motor's speed hardly changes with load; fitting a drive to it saves nothing unless the machine's output can be reduced.

The plant's energy review ranked its other motors by running hours and by how much their output was throttled, and found two more fans worth fitting with drives and no pumps.

## The business case

Both drives were bought in the same project. The [equipment investment appraisal tool](/tools/investment-appraisal/) gives the net present value and payback with uniform yearly savings, a 12-year life and a 7% real discount rate.

```figure
type: compare
title: The fan and pump drives as investments, from the equipment investment appraisal tool
cols: Installed cost | Yearly saving | Net present value at 7% | Simple payback | Result
rowhead: Drive
- * F-1 extraction fan | A$9,500 | A$13,680 less A$150 upkeep | A$97,965 | 0.70 years | INVESTMENT JUSTIFIED
- P-3 cooling-water pump | A$8,000 | A$10,780 less A$150 upkeep | A$76,431 | 0.75 years | INVESTMENT JUSTIFIED
caption: This is an illustration. Prices excluding GST; installed cost includes the drive, screened motor cable, installation and commissioning; 12-year life; no salvage. The capacitor and fan maintenance of Chapter 5 is in the upkeep.
```

Paybacks of under a year are typical for drives replacing dampers or throttling valves on fans and pumps that run long hours, and they leave plenty of room for error in the estimate. That is precisely why the estimate deserves care: a business that approves projects on such figures will soon find out if they are inflated.

## Measuring before and after

A saving claimed should be a saving measured. The plant logged each motor's power with a clamp-on power meter for two weeks before the drives were fitted and read the drives' own power readings, checked against the same meter, for two weeks after, at similar production. Because the fan's duty depends on the weather and the pump's on the extruder's output, the comparison was made on matched days, and the energy was normalised by the tonnes of flake produced. The verified fan saving was within 5% of the estimate; the pump saving within 3% of the static-head estimate.

Measured savings have a second use. In New South Wales, where the plant is, the state's Energy Savings Scheme can allow energy savings certificates to be created for verified energy savings from projects such as these, through an accredited certificate provider using one of the scheme's measurement or calculation methods. The value of the certificates, the methods that apply and the paperwork required change over time and must be checked with the scheme's administrator and a provider before the project starts, because some methods need a baseline measured before any work is done. The plant's before-and-after logging was planned with that in mind, so that the baseline existed whether or not certificates were later claimed.

## The error: the cube law on a pump with lift

The energy auditor's first report, written before the drives were fitted, estimated P-3's saving with the affinity laws alone: from 16.38 kW to 6.89 kW of shaft power at 75% flow, about 9.92 kW of electrical power and A$12,500 a year. The report listed the pump as "closed loop", which was true of the water circuit but missed the open cooling tower: the water falls through the tower at atmospheric pressure and must be lifted 8 m back to its header on every pass.

The plant's engineer noticed the static head in the pipework drawings and reran the estimate with the operating point tool, as above. The cube law overstated the pump's saving by 16%, about A$1,730 a year. The drive was still well worth fitting; the error would not have changed the decision. But the measured saving afterwards matched the corrected estimate, not the report's, and a report that had overstated one saving by 16% would have been doubted on the others.

```figure
type: checklist
title: Before applying the fan or affinity laws
caption: This is an illustration. The plant's checks for any speed-control saving.
- x Is any part of the head or pressure static: a lift, an open tank, a fixed back-pressure, a pressure-controlled header?
- x If so, model the operating point at reduced speed with the pump curve and the system curve
- x Is the flow really reduced on average, and for how many hours a year?
- x Is the before power measured, not taken from the nameplate?
- x Are the drive's own losses and the motor's part-load efficiency included?
- ? Will the saving be verified by measurement after installation?
```

## Exercise: a smaller fan saving

A similar extraction fan at another plant already has its damper fully open and runs at full speed delivering 5.25 m³/s, more than its hoods need. Its owners propose a drive to cut the flow to 4.6 m³/s.

1. What speed ratio and shaft power would the fan laws give, starting from 20.42 kW?
2. What would the saving be, in kilowatts of shaft power and as a share?
3. Why might a drive still be worth less here than at F-1?

### Worked answer

1. Speed ratio = 4.6 ÷ 5.25 = 0.876. Shaft power = 20.42 × 0.876³ = 20.42 × 0.6727 = 13.74 kW.
2. A saving of 20.42 − 13.74 = 6.68 kW of shaft power, 32.7%.
3. At F-1 the drive replaced a damper that was already wasting power while delivering only 4.2 m³/s; here the flow reduction is smaller, so the saving is about two-thirds of F-1's. A cheaper alternative for a permanent reduction to one fixed flow is to change the fan's pulleys to slow it, which gives the same fan-law saving without a drive's cost and losses. A drive pays best where the required flow varies, as F-1's does with the weather and the number of granulators running.
