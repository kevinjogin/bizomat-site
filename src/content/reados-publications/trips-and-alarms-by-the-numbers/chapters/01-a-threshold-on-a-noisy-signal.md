---
book: trips-and-alarms-by-the-numbers
chapterSlug: a-threshold-on-a-noisy-signal
order: 1
title: "A threshold on a noisy signal"
description: "What a trip or alarm threshold decides, the four outcomes of that decision, the response-time budget a trip must meet, how to log a signal properly, and what nuisance trips cost."
draft: false
---

A trip or an alarm is the simplest decision a control system makes. It compares one signal with one number and acts when the signal passes it. The comparison takes a single line of PLC code, and for that reason it is often set once, at commissioning, and never examined again. Yet the number in that line decides two things that matter a great deal: how often the plant stops for nothing, and how quickly it stops when something has really gone wrong. Both depend less on the threshold itself than on its distance from the signal's normal behaviour, and the normal behaviour of every plant signal includes noise.

This chapter introduces the running case, sets out what a threshold has to achieve, and shows how to log a signal so that its noise can be measured. Its error is a quick fix that would have stopped the nuisance trips by quietly removing protection the trip was there to provide.

## What a threshold decides

A threshold divides the range of a signal into two regions, normal and abnormal, and acts when the signal enters the abnormal one. At any moment the plant is in one of two states, healthy or faulty, and the threshold gives one of two answers, quiet or trip. That gives four outcomes, and only two of them are correct.

```figure
type: matrix
title: The four outcomes of a trip decision
y: The trip's answer
x: The plant's true state
hot: 2
caption: A threshold is judged on both kinds of error. Moving it further from the normal band reduces false trips and increases late or missed trips; noise is what makes the two pull against each other.
- Trip, plant faulty | Correct trip: the protection works as intended.
- Trip, plant healthy | False or nuisance trip: lost production, and operators learn to distrust the trip.
- Quiet, plant faulty | Missed or late trip: the fault does its damage before the plant stops.
- Quiet, plant healthy | Correct quiet: the normal state, nearly all of the time.
```

The two errors have different costs and arrive at very different rates. A false trip costs production, usually a predictable amount each time, and it can happen many times a week. A missed trip can cost equipment, product or an injury, and it may happen once in years. Because the costs are so unequal, protection is rightly set to be sensitive. The skill lies in making it sensitive to faults without making it sensitive to noise, and that requires knowing how large the noise is and how it behaves in time.

### Trips and alarms

The same arithmetic applies to trips and to alarms, but their purposes differ. A trip acts automatically: it stops a machine, closes a valve or cuts power. An alarm asks a person to act, and a person can only respond to a limited number of alarms before they stop reading them. The alarm management standards named in the references treat an alarm that sounds when no action is needed as a defect in its own right. A nuisance alarm is not harmless. It trains people to acknowledge without looking, which is exactly how a real alarm gets missed.

## The running case

Plant C's die-casting cell DC-2 is cooled by water from pump P-3. The pump draws from a tank through a strainer and delivers through a header to the die's cooling circuits, where solenoid valves open and close in time with the casting cycle to keep each part of the die at its working temperature. Transmitter PT-3, ranged 0 to 10 bar, measures the discharge pressure. The PLC reads it every 10 ms. Two thresholds act on it:

- **PAL-3, low-pressure alarm, 3.6 bar.** Tells the operator that cooling pressure is falling.
- **PSLL-3, low-low trip, 3.2 bar.** Holds the cell before the next shot, so that metal is not injected into a die that is not being cooled.

With a clean strainer the pressure averages 4.20 bar. Some weeks ago the strainer was changed to a finer mesh to keep debris out of the die's narrow cooling channels. Since then, the pressure has been falling slowly between strainer cleans, and the cell has started to trip with no fault anyone can find. In the last three days of production, six shifts, during which the mean pressure averaged about 3.90 bar, the trip log shows 17 trips. Each time, the operator checked the pump, found it running, reset the trip and restarted the cell.

```figure
type: stats
title: Plant C's nuisance trips over six shifts
caption: This is an illustration. From the cell's trip log and the plant's own costing. Costs exclude GST; the contribution rate is the margin the cell earns per hour of running.
- 17 | nuisance trips on PSLL-3 in six shifts
- 12 min | production lost per trip, including re-warming the die
- 3.4 h | production lost in total
- A$2,227 | lost contribution at A$480 per hour plus 17 scrapped castings at A$35 each
```

That is about A$371 a shift, and it was rising as the week went on. The cost is not only financial. Operators who reset the same trip three times a shift soon start to reset it without checking the pump, and then the trip has lost its value even before anyone changes a setting.

## What the trip must achieve

Before changing anything, the engineer wrote down what PSLL-3 is for. The plant's trip register, which lists every trip with its cause, its action and its rationale, gives the answer: PSLL-3 protects the die against **loss of cooling flow from any cause**. The die engineer's minimum flow for the die corresponds to a pump discharge pressure of about 3.2 bar, and the die can tolerate a complete loss of flow for about 3 s before the next shot would be at risk. The trip therefore has two duties.

1. **A fast fault.** If the pump stops, the pressure falls from its normal value to about 0.6 bar within a second or two. The cell must be held within 3 s of the pump stopping.
2. **A slow fault.** If the strainer blocks or a valve partly closes, the pressure falls gradually. The cell must be held when the pressure reaches 3.2 bar, whenever that happens.

The 3 s allowance is a budget, and it is shared by every stage between the pump stopping and the cell stopping. The engineer measured or estimated each stage.

```figure
type: bars
title: Response-time budget for a pump stop, without filtering or delay
unit: s
max: 3
caption: This is an illustration. The pressure takes 0.13 s to fall from 4.20 to 3.2 bar after the pump stops; the other stages are fixed by the hardware. About 2.55 s of the 3 s allowance is unused, and that spare time is what any filter or delay can spend.
- Pressure falls from 4.20 to 3.2 bar | 0.13 | from a recorded pump stop
- Transmitter response | 0.05 | manufacturer's damping setting
- PLC scan and logic | 0.02 | two 10 ms scans in the worst case
- Output card and cell hold circuit | 0.25 | measured at commissioning
- * Spare | 2.55 | available for filtering and on-delays
```

The spare 2.55 s is important. It means the trip does not need to respond to every 10 ms sample. It can afford to look at the signal over a short time before deciding, which is the basis of every remedy in Chapters 4 to 6. Had the budget been tight, say a fast-acting overpressure trip with only 0.2 s to spare, the remedies would have been far more limited.

### Why the pressure falls as the strainer loads

The strainer sits on the pump's suction side, between the tank and the pump. As debris collects on its mesh, the pressure drop across it rises, so the pressure at the pump's inlet falls. A centrifugal pump adds roughly the same head at a given flow whatever its inlet pressure, so the discharge pressure falls by about the same amount as the inlet pressure. The lower discharge pressure then drives less water through the die's cooling circuits, and the pump settles at a slightly lower flow. Discharge pressure is therefore a fair indicator of cooling flow, which is why the die engineer could express the minimum flow as a pressure.

It also explains the pattern in the trip log. Just after a strainer clean, the mean pressure is 4.20 bar and the cell does not trip. As the days pass, the mean falls by a few hundredths of a bar a day, and the trips begin, then become more frequent. The noise has not grown; the mean has moved towards the threshold, and the same noise now reaches it more often. Chapter 7 puts numbers on this, and shows how much warning the falling mean gives. One further point matters for later chapters: the strainer cannot be left to load indefinitely, because suction pressure that falls too far will also lead the pump towards cavitation, a separate problem the pump's supplier would need to assess.

## Logging the signal properly

The first instinct is to open the plant historian and look at PT-3's trend. That is a mistake for this purpose. Like most historians, Plant C's stores one value per second, the average of the PLC's readings over that second. A one-second average removes most of the fast variation, so the historian's trend looks smooth and shows a pressure that never comes near 3.2 bar. The trip, however, acts on every 10 ms sample, and it sees variation the historian hides.

The engineer therefore logged PT-3 at the PLC's full rate, 100 samples a second, for ten minutes during normal production, writing the raw values to a file on the PLC's data logger. The log contains 60,000 samples. The strainer had been cleaned at the start of the investigation, and the log was taken on the fourth production day after the clean. Over those ten minutes the mean was 4.10 bar, because the strainer had already started to load again, and the standard deviation was **0.150 bar**. The values swung between about 3.6 and 4.6 bar, so the noise was far larger than the transmitter's stated accuracy of ±0.05 bar. Most of the variation was real pressure variation in the water, not error in the transmitter.

A closer look at the log showed two kinds of variation. There was a fast, jagged component that changed from one sample to the next, caused by turbulence and pump pulsation, and a slow swell lasting a second or two, caused by the die's cooling valves opening and closing in the casting cycle. Chapter 2 separates the two; they behave differently under every remedy, and that difference turns out to decide the final settings.

```figure
type: checklist
title: Logging a signal to set a threshold
caption: The log is the evidence on which every later calculation rests, so it is worth taking care over.
- Log at the rate the threshold acts | The PLC scan rate, not the historian's averaging interval.
- Log in normal production | With the plant doing what it normally does, including the cyclic loads.
- Log for long enough | At least several hundred times the slowest variation; ten minutes covers a 2 s swell 300 times.
- Note the conditions | Strainer state, product, valves, ambient: anything that moves the mean.
- x Use historian averages | They hide exactly the fast variation that causes nuisance trips.
- x Judge the noise by eye from a trend | Plotted trends compress thousands of samples into a line and hide the extremes.
```

## The error: lowering the trip setpoint

On the first morning of the investigation, a shift supervisor proposed a simple fix: lower PSLL-3 from 3.2 bar to 2.8 bar. The pressure would still fall well below 2.8 bar within a fraction of a second if the pump stopped, so the protection against a pump stop would barely change, and the extra 0.4 bar of margin would surely stop the nuisance trips. The supervisor was right on both counts. At a mean of 3.9 bar, a trip at 2.8 bar would almost never be reached by noise, and a pump stop would still be caught in about 0.2 s.

The engineer did not make the change, for a reason found in the trip register rather than in any calculation. PSLL-3 protects against loss of cooling flow from **any** cause, and the 3.2 bar setting corresponds to the die's minimum flow. A slowly blocking strainer is precisely one of those causes. With the trip at 2.8 bar, the strainer could load until the pressure, and therefore the flow, fell well below the die's minimum, and the cell would keep casting into a die that was being cooled too little. The nuisance trips were not just noise: they were also early evidence that the strainer was loading towards the point where the trip was meant to act.

The lesson is general. Before changing any threshold, find out what it protects against, including the slow faults, and what the setting is based on. A setting is not an arbitrary number that can be moved for convenience. On a real safety function, the change would also need to go through the plant's management of change, with the people responsible for the protection agreeing to it. The nuisance trips had to be cured in a way that kept the trip at 3.2 bar.

## The two levers: the margin and the decision rule

Once the setpoint is fixed, only two things can be changed. One is the **margin**, the distance between the signal's mean and the threshold. At Plant C, the margin falls as the strainer loads, and keeping it large means cleaning the strainer before it becomes small. The other is the **decision rule**: what the PLC does with the signal before comparing it with the threshold. It can filter the signal, require it to stay beyond the threshold for a minimum time, or compare several sensors. Each rule reduces false trips and adds some delay, and the budget above says how much delay can be afforded.

The chapters that follow quantify both. Chapter 2 expresses the margin in standard deviations and shows why that, not the margin in bar, decides how often the noise reaches the threshold. Chapter 3 turns it into a rate of false trips per shift. Chapters 4 to 6 change the decision rule, and Chapter 7 keeps the margin from shrinking.

```figure
type: steps
title: The approach used in this book
caption: Each step uses the results of the one before; the calculation only needs a log of the signal and the response-time budget.
- Measure the noise | Mean, standard deviation and how fast it varies, from a full-rate log.
- Express the margin in standard deviations | The distance from the mean to the threshold, divided by the noise.
- Predict the false-trip rate | From the margin and the signal's rate of mean crossings.
- Choose a decision rule | Filter, deadband, on-delay or voting, within the response budget.
- Keep the margin | Detect drift towards the threshold before trips begin.
- Prove the settings | Test the response, count trips, and record the result.
```

## How this applies to a small Australian business

Most small plants have a handful of trips and alarms that were set by an equipment supplier or an installer and never reviewed. Start with the ones that annoy people: the alarms everyone acknowledges without reading and the trips that are reset without looking. For each one, write down what it protects against and why it is set where it is; if nobody knows, that is the first finding. Log the signal at the rate the PLC scans it, not from a one-second historian, and work out how much of the response time the trip really needs. Under Australian work health and safety law, the person conducting the business must manage the risks of plant, and a trip that protects people is part of that; changes to it need the same care as changes to a guard.

## Exercise: the budget for a heater trip

A plastics dryer has a high-temperature trip that must cut the heater within 10 s of the air temperature reaching 140 °C. The thermocouple and its transmitter respond with a lag of about 4 s to a change in air temperature; the PLC scans every 100 ms and needs two scans in the worst case; and the heater contactor drops out in 0.1 s. (a) How much of the 10 s is available for filtering and on-delays? (b) The dryer trips falsely about twice a week, and each false trip costs 25 minutes of lost drying at a contribution of A$90 per hour. What does this cost a year, over 50 working weeks?

**Worked answer.** (a) The fixed stages take 4 + 0.2 + 0.1 = 4.3 s, so **5.7 s** of the 10 s remains for any filter or delay. (b) Two trips a week for 50 weeks is 100 trips; 100 × 25 min = 2,500 min, or 41.7 h, and 41.7 × A$90 = **A$3,750 a year** in lost contribution, before counting any spoiled material or the cost of operators learning to ignore the trip.
