---
book: divide-the-work
chapterSlug: time-lost-switching
order: 3
title: "Time lost switching: the second gain, and when it is real"
description: "Smith's second gain from dividing work is the time saved moving between tasks. How to measure switching, value it with a set-up calculation, and avoid counting hours nobody uses."
draft: false
---

Smith's second reason for the productivity of divided work is the one most often overlooked, because switching time hides inside other work. A person who moves from one kind of task to another loses time setting down one set of tools, picking up another, adjusting the workplace and getting back into the rhythm of a different job. Smith thought the loss was greater than it looked. He noted that a worker who changes task several times a day tends to drift and saunter between jobs, and seldom applies themselves fully for the first few minutes of each new one.

For the bench maker, switching time turns out to be the largest single source of gain from dividing the work. This chapter measures it, values it with a set-up reduction calculation, compares division with an alternative that captures some of the same gain, and shows the trap of counting released hours that never become output.

## What switching looks like in the workshop

This is an illustration. Under the generalist arrangement, each fabricator builds a whole bench, so each bench involves three changes of task: from cutting and folding to welding, from welding to polishing, and from polishing to assembly and inspection. The owner asks each fabricator to log, for one week, the time spent between finishing one kind of task and starting the next: not the work itself, but everything in between.

The logs, averaged per bench, show about **45 minutes**:

```figure
type: compare
title: Where the 45 minutes of switching go, per bench
cols: Minutes per bench | What it is
caption: This is an illustration. Averages from one week of logs by three generalists. Most of the time is preparing and putting away equipment that a dedicated station would leave set up.
- Welding set-up and pack-away | 12 | Return lead, gas, torch, screens, settings checked each time
- Fume extraction arm and screens | 5 | Moved into position and back
- Polishing set-up | 10 | Abrasives changed, polisher and dust extraction set up
- Press brake tooling and program | 8 | Tooling swapped back after another job, program found and checked
- *Walking and finding tools | 10 | Between benches, the tool board and the store
```

Each item is reasonable on its own. Nobody would call twelve minutes to set up and pack away welding equipment wasteful. But together they add up to nearly an hour per bench, which across 750 benches a year is a substantial part of the workload. And because switching is spread across the day in small pieces, nobody had added it up before.

Smith's description of drift also shows in the logs. The first few minutes after each change are slower than the same work later in a session, as the fabricator re-reads the drawing, finds the settings and gets back into the task. The logs cannot separate that from the work itself, so the 45 minutes probably understates the true switching cost.

### Measuring switching honestly

Self-recorded logs are a reasonable start, but they have known weaknesses. People forget to log short gaps, round to convenient numbers, and record what they think should happen rather than what does. The owner uses two simple cross-checks.

- **Observation in short bursts.** On three days, he notes at twenty random moments what each fabricator is doing: working on a bench, setting up, moving, looking for something, or something else. Eighty observations across the week give a rough share of time in each state, which can be compared with the logs. This is a simple form of work sampling, and it avoids the awkwardness of standing over someone with a stopwatch.
- **Before-and-after timing of the same bench.** Timing one whole bench from first cut to wrapping, and subtracting the logged task times, gives the switching and waiting time directly for that bench.

Both checks agree with the logs to within about ten minutes a bench, which is close enough for a decision. The point is not precision but avoiding a number that is badly wrong in either direction. A switching estimate that is too high overstates the case for dividing the work; one that is too low hides the largest gain.

## What dividing the work removes

At a dedicated station, most of this time disappears. The welding bay keeps its equipment set up all day. The polishing station keeps its abrasives and extraction in place. The press brake keeps the bench tooling installed for the shift. The fabricators stay at their stations and the bench moves between them on a trolley.

What remains is moving the bench from one station to the next, checking the job card and placing the bench at the next station: the owner estimates about **10 minutes** per bench in total, which the station times in Chapter 6 include. The reduction is therefore about 35 minutes per bench.

## Valuing the released time

The [set-up reduction value tool](/tools/setup-worth/) in BIZOMAT Tools converts saved set-up minutes into an annual value. From the current and target set-up times per changeover, the number of changeovers a year, a combined hourly cost and the cost of the improvement, it calculates the minutes saved, the hours released a year, their annual value and the payback period. Its output carries an important qualification: released time is valuable only if it becomes useful production, smaller batches or avoided overtime.

The owner treats each bench as one changeover, with 750 benches a year, a current time of 45 minutes, a target of 10 minutes, a loaded labour rate of A$62 an hour, and an investment of **A$9,500** excluding GST: relocating the fume extraction arm and screens to a fixed welding bay, a second set of hand tools so each station has its own, and shadow boards at each station.

The tool gives:

- **35 minutes** saved per bench;
- **438 hours** released a year;
- an annual value of **A$27,125**;
- a payback of **0.35 years**, about four months.

```figure
type: stats
title: Switching time released by dividing the work
caption: This is an illustration. Results from the set-up reduction value tool at A$62 an hour, excluding GST. The value is real only if the released hours become benches the business can sell.
- 35 min | saved per bench | 45 minutes of switching replaced by about 10 of handover
- 438 h | released a year | at 750 benches a year
- *A$27,125 | annual value | if the hours become output or avoided overtime
- 4 months | payback | on A$9,500 of station equipment
```

## The failure case: hours that never become output

The tool's warning is worth taking literally, because the most common error with switching time is counting released hours as savings when they do not change anything the business pays for.

Suppose demand had stayed at six benches a week and the owner had reorganised into stations anyway. The switching time would still fall by 35 minutes a bench, but at 300 benches a year the tool would show 175 hours released and a value of A$10,850, but with no extra benches to make, those hours would turn into idle time at the stations. The wages would still be paid. Nothing would be saved unless someone's hours were reduced or the time was used for something else of value.

The same trap appears in a subtler form even at fifteen benches a week. If the released time falls at a station that is not limiting output, it raises that station's idle time rather than the business's output. Chapter 6 shows that after dividing the work, the polishing and assembly station sets the pace. Hours released at the cutting station do not, by themselves, produce one more bench.

### How it is detected

Ask the tool's question of every claimed saving: **where do the released hours go?** The answer must be one of three things:

- more benches sold, because the time falls at the station that limits output and there is demand for the extra benches;
- less overtime or less contract labour, at a cost that can be shown on the payroll;
- other valuable work, such as building the fixture in Chapter 4 or cross-training in Chapter 9, named in advance.

If the answer is "it will free people up", the saving is not yet real.

### How it is corrected

In the case, the owner records the switching saving as part of the capacity needed to move from six to fifteen benches a week without hiring two more generalists. That is a real use: the released hours become part of the extra output. He does not count it a second time as a cost saving, and he names the welding station's released time as the time in which the welder will design and build the leg-frame fixture.

## An alternative: batching without dividing

Dividing the work is not the only way to reduce switching time. The generalists could keep building whole benches but work in **batches**: cut and fold five tops and shelves, then weld five frames, then polish and assemble five. Each set-up would then serve five benches instead of one.

```figure
type: compare
title: Three ways to handle switching, per bench
cols: Switching minutes per bench | Benches waiting between steps | Main drawback
caption: This is an illustration. Batching captures much of the switching gain without creating specialist roles, at the cost of more benches in progress and longer lead times, examined in Chapter 7.
- Generalists, one bench at a time | 45 | 0 | Most switching time
- Generalists, batches of five | about 9 | up to 4 per step | More work in progress; later feedback on defects
- *Stations, one bench at a time | about 10 of handover | depends on balance | Needs a steady flow and balanced stations
```

Batching in fives cuts switching to about 9 minutes per bench, slightly better than the stations' 10 minutes of handover. It needs no reorganisation and no specialists, and every fabricator keeps the whole-bench skills. Its costs appear elsewhere. Benches sit partly built while the rest of the batch catches up, so work in progress and lead time rise. A fault in the first top folded is not found until that top reaches welding, by which time four more have been folded the same way. And batching captures only Smith's second gain. It does little for dexterity on the new frame, because each fabricator still does only a third of the welds, and nothing for the fixture.

The owner chooses stations for the B-series, because the dexterity and fixture gains on the new frame matter, and keeps batching as the method for the low-volume custom work, where volumes are too small and too varied for stations.

## Switching in the office

Switching costs are not confined to the workshop. The owner's own day is a constant series of switches: a quote, a phone call from the distributor, a drawing, a supplier query, a delivery booking, back to the drawing. Each switch carries the same kind of loss as in the workshop: finding where he was, reopening the file, picking up the thread of a calculation. The contract will roughly double the office work, and the owner's day will fragment further.

The office is harder to divide than the workshop, because its tasks are more varied and less predictable. But the same two remedies apply. Grouping similar work, for example all supplier orders on one morning and all drawings on the next, cuts the number of switches. And separating interruptible work from work that needs concentration, such as quoting in a protected block of time, reduces the drift Smith described. Chapter 8 looks at the office more closely, because dividing it between two people raises a different problem: queues.

## Where some switching is worth keeping

Not every change of task is waste. Varied work reduces the time spent in the same posture and the same repetitive movements, which matters for tasks such as polishing and grinding with hand tools. Safe Work Australia's model code of practice on hazardous manual tasks treats repetitive and sustained work as a risk factor to be managed, and job rotation is one of the administrative controls commonly used alongside better tools and workstation design.

The owner therefore plans a deliberate, scheduled rotation between the polishing and cutting stations at midday, rather than leaving each person on one repetitive task all day. It costs one planned changeover a day per person, a few minutes, in exchange for less sustained exposure and a second competent person at each of those stations. This is switching chosen for a reason and placed at a predictable time, which is very different from the unplanned switching of the generalist arrangement.

## Reducing switching that remains

Even at stations, some switching remains. The press brake still changes tooling when a custom job interrupts the bench run, and the welder still sets up differently for the occasional repair. The usual set-up reduction methods apply:

- **Separate internal from external set-up.** Do everything that can be done while the machine is still running the previous job, such as fetching the next tooling and checking the next program, before stopping it.
- **Standardise heights and locations.** Tooling that always mounts at the same height and position needs no adjustment.
- **Keep tools where they are used.** Shadow boards at each station removed most of the walking in the logs.
- **Schedule similar work together.** Running all custom jobs needing the same press brake tooling on one afternoon reduces changes.

These methods matter more as the business grows, because each additional product or customer adds changeovers. They are also a good way to capture some of the switching gain at stations that cannot be made fully dedicated.

## Exercise: the press brake interruptions

The cutting and folding station is interrupted about **six times a week** by custom jobs that need different press brake tooling. Each interruption costs about **25 minutes** of tooling change, out and back. By preparing the custom tooling while the bench run continues and changing it on a standard mounting, the owner estimates the time could fall to **8 minutes**, for an outlay of **A$2,200** excluding GST. The workshop works about 50 weeks a year. Using the set-up reduction value tool's method at A$62 an hour, find the hours released, their value and the payback, and say what has to be true for the value to be real.

**Worked answer.** The changeovers a year are 6 × 50 = **300**. The saving per changeover is 25 − 8 = **17 minutes**. Hours released are 17 × 300 ÷ 60 = **85 hours** a year, worth 85 × A$62 = **A$5,270**. The payback is A$2,200 ÷ A$5,270 = **0.42 years**, about five months.

The value is real only if the 85 hours become something the business pays for or sells. The cutting and folding station is not the station that limits output, so the hours do not directly add benches. They become real if they let the station absorb more custom work without overtime, or if they release time for the folder to cover part of the assembly work, which is exactly the rebalancing Chapter 6 proposes. Without one of those uses, the improvement is still good practice, but its A$5,270 is not a saving.
