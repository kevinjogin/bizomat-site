---
book: machining-by-the-numbers
chapterSlug: estimating-cycle-time
order: 10
title: "Estimating cycle time"
description: "Build a cycle-time estimate operation by operation, add non-cutting time and handling, check it against simulation and actual results, and find where the time really goes."
draft: false
---

A quote, a schedule and a capacity plan all depend on one number: how long the part takes. Getting it wrong in either direction is expensive. Too high, and the quote loses the work. Too low, and the job runs at a loss while the schedule slips.

The previous chapters calculated cutting times feature by feature. This chapter assembles them into a full estimate for the Harbourline flange, adds the time when the machine is running but not cutting and the time spent loading and unloading, and shows how to check and improve the estimate.

## The parts of a cycle

The time a part spends on a machine has several components:

- **Cutting time:** the tool is engaged and removing material, calculated from length and feed rate as in Chapters 3 to 5.
- **Non-cutting machine time:** the machine is running the program but not cutting. Rapid moves between features, approach and retract moves, tool changes or turret indexing, spindle acceleration and deceleration, dwell, coolant start and in-process probing all belong here.
- **Load and unload:** the operator or a loading device removes the finished part, cleans the fixture or chuck, loads the next blank and starts the cycle. If loading is done while the machine runs, for example with a pallet changer, it may not add to the cycle at all.
- **Per-part allowances:** periodic tasks spread over the batch, such as in-process inspection, chip clearing and tool changes at the end of tool life.

Set-up, programming and first-article inspection happen once per batch or once per job. They are not part of the cycle time, but they are part of the cost, and Chapter 11 treats them separately.

## Cutting time for the flange

Using the cutting data from earlier chapters, Harbourline's estimator lists every cut on each operation. The values come from the formulas already shown: turning time from length, feed and spindle speed; facing time with constant surface speed; and drilling, tapping and milling times from feed length and feed rate.

| Operation | Cut | Cutting time (min) |
|---|---|---|
| 10, lathe | Face Ø110 to centre | 0.223 |
| 10 | Indexable drill Ø38 through | 0.265 |
| 10 | Rough turn Ø110 to Ø100.5, two passes | 0.289 |
| 10 | Finish turn Ø100 | 0.201 |
| 10 | Finish bore Ø40 | 0.188 |
| 20, lathe | Face to length, Ø110 to Ø38 | 0.190 |
| 20 | Rough spigot Ø110 to Ø60.5, ten passes | 0.584 |
| 20 | Finish spigot Ø60 and flange back face | 0.194 |
| 30, machining centre | Drill 6 × Ø11 | 0.324 |
| 30 | Drill 2 × Ø6.8 | 0.078 |
| 30 | Tap 2 × M8 | 0.129 |
| 30 | Face mill flat | 0.128 |
| **Total** | | **2.79** |

Operation 10 accounts for 1.17 minutes of cutting, operation 20 for 0.97 and operation 30 for 0.66.

```figure
type: bars
title: Cutting time by operation
unit: min
caption: Total cutting time 2.79 min. The ten spigot roughing passes make operation 20's largest single cut.
- Operation 10, lathe first side | 1.17 | face, drill, rough, finish, bore
- Operation 20, lathe second side | 0.97 | face, spigot roughing and finishing
- Operation 30, machining centre | 0.66 | drill, tap, face mill
```

The spigot roughing time of 0.584 minutes is consistent with the removal-rate check in Chapter 3: about 66.8 cm³ removed at around 136 cm³/min is roughly half a minute of pure cutting, plus the approach length on each of the ten passes.

## Non-cutting machine time

Non-cutting time is harder to calculate by hand and is best taken from a CAM simulation or from similar programs that have already run. Harbourline estimates:

| Operation | Main non-cutting items | Estimate (min) |
|---|---|---|
| 10 | Five tool indexes, approach and retract for each cut, spindle speed changes, rapid moves | 1.6 |
| 20 | Four tool indexes, approach and retract including ten roughing passes, rapid moves | 1.2 |
| 30 | Four tool changes, probing the part datum, rapid moves between ten holes, spindle reversal for tapping | 1.4 |

Adding these to the cutting times gives the **machine cycle time** for each operation: 2.77 minutes for operation 10, 2.17 for operation 20 and 2.06 for operation 30, a total of 6.99 minutes.

## Load, unload and handling

The operator must remove each finished part, blow chips from the chuck or fixture, load the next blank and press cycle start. For this part, Harbourline estimates 0.6 minutes per part on each lathe operation and 0.8 minutes on the machining centre, where the part must be located on a fixture with the bore and a datum face. That adds 2.0 minutes.

The estimated machine time per part, including handling, is therefore **8.99 minutes**, or about 9 minutes.

## Where the time goes

| Component | Time per part (min) | Share |
|---|---|---|
| Cutting | 2.79 | 31% |
| Non-cutting machine time | 4.20 | 47% |
| Load and unload | 2.00 | 22% |
| **Total** | **8.99** | **100%** |

Less than a third of the time is spent cutting. That is typical of small parts with many features and several set-ups, and it changes where improvement effort should go. Raising every cutting speed by 10% would save only about 0.25 minutes per part and shorten tool life considerably. Halving the non-cutting time through better programming, fewer tools and shorter approach distances would save about two minutes.

```figure
type: stack
title: Where the flange's 8.99 minutes go
unit: min
caption: Halving non-cutting time would save about two minutes; a 10% faster cutting speed would save about 0.25.
- Cutting | 2.79
- Non-cutting machine time | 4.20
- Load and unload | 2.00
```

Practical ways to reduce non-cutting and handling time include:

- **Fewer tools.** Combination tools, such as a drill that also chamfers, remove tool changes.
- **Optimised rapids and approach distances.** CAM defaults are often generous.
- **Multiple parts per fixture.** On operation 30, a fixture holding four flanges would share each tool change and probing cycle across four parts.
- **Fewer operations.** A lathe with live tooling could drill, tap and mill the flange in operation 20, eliminating operation 30's set-up and handling entirely, though at a higher machine rate and with more complex programming.
- **Faster loading.** Quick-change jaws, pneumatic fixtures and blanks ready at the machine.
- **Overlapped loading.** Pallet changers or a second station let the operator load while the machine cuts.

```figure
type: checklist
title: Shortening the cycle without cutting faster
caption: For small, many-featured parts these usually beat any change to cutting data.
- Fewer tools | combination tools remove tool changes
- Tighter rapids and approaches | CAM defaults are often generous
- Several parts per fixture | share tool changes and probing on operation 30
- Fewer operations | live tooling could absorb operation 30
- Faster and overlapped loading | quick-change jaws, pallets, blanks ready
- x Raising every cutting speed | small saving, much shorter tool life
```

## Checking the estimate

Estimates should be checked against reality as soon as possible:

- **CAM simulation** gives good cutting and rapid times but often underestimates real cycle time because it ignores acceleration, tool change mechanics and control processing.
- **Prove-out** of the first part gives an actual cycle time, but the first part often runs more slowly than production, with feed overrides turned down and extra stops for checking.
- **Production records** from the control's cycle timer, over a full batch, give the most reliable figure.

Harbourline records the estimated and actual cycle times for every new job and reviews the difference. Over time, that record provides correction factors for its own machines, operators and programming style, and makes the next estimate better.

## From cycle time to capacity

For scheduling, cycle time is not the same as the hours a batch occupies a machine. Machines stop for breaks, minor problems, waiting for material and shift changes. Overall equipment effectiveness, which combines availability, performance and quality, describes the gap between ideal and actual output. A machine with 75% effectiveness running a 2.77-minute cycle produces fewer than the theoretical 21.7 parts per hour.

There are two common approaches to that gap. One is to build the losses into the hourly rate, so the rate covers an hour of paid time that includes some unproductive minutes, and estimate at ideal cycle time. The other is to use a rate per productive hour and add an allowance to the cycle time. Either works if it is applied consistently. Harbourline uses the first approach, so its quotes use the cycle estimate directly.

## Balancing the operations

The three operations run on different machines. If the same operator tends both lathes and the machining centre, the longest operation sets the pace of the batch and the operator's time is shared among them. Including handling, operation 10 takes about 3.37 minutes, operation 20 about 2.77 and operation 30 about 2.86. If the operations run at the same time, the batch moves at the pace of operation 10. Moving the face-to-length cut or some roughing from operation 10 to operation 20 would balance the line. That affects lead time and capacity, even though the total machine time and cost per part stay the same.

## Common mistakes

- **Estimating cutting time only.** For small parts it can be under a third of the total.
- **Trusting CAM times uncritically.**
- **Forgetting handling and per-part allowances.**
- **Mixing productive-hour and paid-hour approaches** between estimate and rate.
- **Never comparing estimate with actual.**

## Questions to ask

- What share of the cycle is cutting time, and where is the rest going?
- Which non-cutting items could be removed or shortened?
- Is the hourly rate built on paid hours or productive hours, and is the estimate consistent with it?
- How did the last similar job's actual cycle time compare with its estimate?

## Exercise: break down a real cycle

Take a part currently in production. Using the program and the control's cycle timer, split the cycle into cutting, non-cutting and handling time. Identify the three largest non-cutting items and estimate the saving from reducing each.

The final chapter turns the cycle time into a quotation, adding material, set-up, programming, tooling and the effect of batch size.
