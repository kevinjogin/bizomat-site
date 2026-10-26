---
book: pipe-flow-by-the-numbers
chapterSlug: branches-and-balancing
order: 7
title: "Branches, parallel paths and balancing"
description: "How CW-2's flow divides between six machines in parallel, why the nearest gets most, balancing valve settings that give each 1.5 L/s, what a shut-down machine does, and valves all set alike."
draft: false
---

A loop that feeds several users in parallel is not one pipe but many, sharing their headers. The pump does not decide how much water each user gets; the pipework does. Water takes every path open to it, in proportion to how easily each path passes it, and the paths nearest the pump, with the least header to cross, pass it most easily. Left alone, a parallel loop always favours its nearest users. Balancing is the work of evening that out.

This chapter works out how CW-2's 9 L/s divides between its six machines with every valve open, explains why it divides that way, finds the balancing valve settings that give each machine its 1.5 L/s, follows what happens when one machine is shut down, and ends with valves all set to the same position.

## Parallel paths share one pressure difference

Each of CW-2's machines is connected between the supply header and the return header by its own branch. At a machine's tees, the supply header has some head and the return header some lower head, and the difference between them is what drives water through that machine's branch, its coolers and its valves. Every branch sees the head difference at its own tees, and passes whatever flow that difference drives through its own resistance.

The head difference is not the same at every machine. Along the supply header, the head falls with friction, so the farther a machine is from the pump, the lower its supply head. Along the return header, the head rises towards the far end, because the water from the far machines has more return header to flow through before reaching the tank. With both headers running the same way, a layout called **direct return**, the nearest machine has the highest supply head and the lowest return head, and so the largest head difference. The farthest has the smallest.

## CW-2 unbalanced

This is an illustration. With every machine's balancing valve fully open, at K = 5.0, the CW-2 workbook solves the loop: it guesses each branch's flow, works out the header heads that those flows produce, finds the flow each branch would pass at its head difference, and repeats until the flows stop changing. The pump's curve, H = 16.5 − 0.070 × Q², sets the total.

```figure
type: compare
title: CW-2 with every balancing valve open
rowhead: Machine
cols: Head difference across its branch, m | Flow, L/s
caption: This is an illustration from the CW-2 workbook's network solution. Total flow 9.10 L/s at a pump head of 10.71 m.
- * 1, nearest | 6.36 | 1.601
- 2 | 5.94 | 1.546
- 3 | 5.66 | 1.510
- 4 | 5.50 | 1.488
- 5 | 5.43 | 1.478
- 6, farthest | 5.41 | 1.475
```

Machine 1 gets 1.601 L/s, 7% above its design flow; machine 6 gets 1.475 L/s, 2% below. The total is 9.10 L/s, slightly above design, because the near machines' easy paths lower the loop's overall resistance and the pump runs a little further out on its curve.

The spread, 1.475 to 1.601 L/s, is modest. That is because each machine's branch, with its coolers taking 3.58 m, is far more resistant than the headers between the machines. A loop whose branches dominate its resistance divides its flow fairly evenly on its own; a loop with resistant headers and easy branches does not. Chapter 1's commissioning readings, taken before balancing, showed the same pattern within the meters' accuracy.

## Why balance at all

If the spread is only 8%, is balancing worth the effort? For CW-2, the answer comes from the machines' needs. Machine 6, at 1.475 L/s, carries 2% less heat than designed; in summer, when the tank runs warm, its moulds are the first to run hot. Machine 1, at 1.601 L/s, takes more water than it needs, which does no harm to it but is water the far machines do not get. Balancing gives each machine its share and nothing more.

On a loop with a larger spread, balancing is not optional. A loop of the same layout with easy branches, say coolers taking 0.5 m instead of 3.6, could easily give its nearest user twice the flow of its farthest. The workbook's network solution shows which kind of loop it is before any valve is touched.

## Finding the balancing valve settings

The balanced state is easy to describe: every machine at 1.5 L/s, a total of 9.0 L/s. With those flows, the header heads are fixed, and so is the head difference at each machine. Each machine's balancing valve must then take whatever head its branch does not need at 1.5 L/s.

The farthest machine, 6, is the index: its head difference is the smallest, so its valve stays fully open, and the pump is chosen to give it 1.5 L/s that way. Every other machine's valve is closed until its branch passes 1.5 L/s at its larger head difference.

```figure
type: compare
title: CW-2's balancing valve settings
rowhead: Machine
cols: Head difference, m | Valve K needed | Extra loss over fully open, kPa | Valve Kv, m³/h
caption: This is an illustration from the CW-2 workbook, with every machine at 1.5 L/s and the pump at 9.0 L/s and 10.83 m. Machine 6's valve stays fully open.
- 1, nearest | 6.55 | 13.7 | 9.4 | 14.0
- 2 | 6.13 | 9.9 | 5.3 | 16.5
- 3 | 5.85 | 7.3 | 2.5 | 19.2
- 4 | 5.68 | 5.9 | 0.9 | 21.4
- 5 | 5.61 | 5.2 | 0.2 | 22.9
- * 6, farthest | 5.58 | 5.0, fully open | 0 | 23.2
```

The valve near the pump must take an extra 9.4 kPa; the valves near the far end barely move from fully open. Each valve's setting is given here as a K value and as a Kv; a balancing valve's maker publishes a table relating its handwheel position to its Kv, and the commissioning technician sets each valve to the position that gives the Kv in the table, then confirms the flow with a meter.

## The balancing procedure

On a real loop, the calculated settings are a starting point, not the answer, because the losses they rest on are uncertain. The plant's procedure, an illustration of common practice, works from the far end.

1. **Open every valve fully** and measure every machine's flow and the pump's total.
2. **Set the index machine**, the one with the lowest flow, as the reference; its valve stays fully open.
3. **Set each other valve** to its calculated Kv, starting from the machine nearest the index and working towards the pump.
4. **Measure every flow again.** Setting one valve changes the header heads slightly and so every other branch's flow; a second pass corrects that.
5. **Record the final positions and flows**, and lock or mark each handwheel so that it is not disturbed.

On CW-2, two passes brought every machine within 3% of 1.5 L/s, inside the meters' accuracy. The whole procedure took a technician about three hours, most of it spent waiting for flows to settle after each change and reading the meters twice. That time is recovered many times over in machines that run at their design temperatures, and in a record that lets anyone restore the settings after the loop is disturbed.

## Measuring each branch's flow

Balancing needs a flow reading on every branch, and there are two common ways to get one. A **clamp-on ultrasonic meter** measures the flow from outside the pipe, with no cutting or draining. It needs a straight length of pipe either side of the clamp point and a clean, known pipe wall, and on short machine branches crowded with fittings it can be hard to place well.

A **balancing valve with test points** measures its own flow. Its maker publishes its Kv at each handwheel position, and two tappings either side of the valve's seat give its pressure drop. With the valve set at a known position and its drop measured, the flow follows from the Kv: Q = Kv × √Δp, with Q in m³/h and Δp in bar. For machine 2, at a Kv of 16.5 and a measured drop of 0.107 bar, Q = 16.5 × √0.107 = 5.40 m³/h, 1.50 L/s.

The two methods check each other. CW-2's commissioning used the valves' test points for every branch and a clamp-on meter on two of them as a cross-check; where they disagreed by more than 5%, the cause was found before the setting was accepted. In one case, it was a valve fitted the wrong way round, whose published Kv did not apply.

## When a machine is shut down

When a machine is shut down for a mould change, its isolating valves are closed, and its 1.5 L/s has to go somewhere. It goes to the others. With machine 3 shut and the other balancing valves left at their settings, the workbook gives the five running machines between **1.64 and 1.67 L/s** each, a total of 8.32 L/s at a pump head of 11.66 m.

The loop's total flow falls, because closing a branch raises the loop's resistance and the pump runs back up its curve. But each running machine gets more than before, about 10% more, because the same pump now feeds five paths instead of six. For a cooling loop, that is harmless: the running machines simply run a little cooler. For a loop whose users must not get more than their share, a constant-flow or pressure-independent valve on each branch, or a pump that slows as the demand falls, is the answer, and Centrifugal Pumps by the Numbers deals with the second.

## Adding a machine later

Plants grow, and a seventh machine on CW-2 is a likely request. Its effect follows from everything above. A seventh branch at the far end of the headers, beyond machine 6, would become the new index: it has the smallest head difference of all, and with its valve fully open it would get less than the others. The pump would need to deliver 10.5 L/s. Chapter 6's curve for the six-machine loop gives about 14.2 m at that flow, and a seventh branch at the far end would add a little more; the existing pump offers only 16.5 − 0.070 × 10.5² = 8.8 m at 10.5 L/s. It cannot do the job without help.

The choices are the ones the system curve sets out: a larger pump, a lower-resistance cooler on the new machine, or a larger header on the near lengths where the full flow runs. In every case, every balancing valve must be reset afterwards, because the new branch changes the header heads at every tee. The workbook's network solution, rerun with seven branches, gives the new settings before the machine arrives, so that commissioning it is a matter of setting valves to numbers rather than trial and error.

## Reverse return

An alternative layout avoids most of the imbalance at the design stage. In **reverse return**, the return header starts at the nearest machine and runs the same way as the supply, so that the first machine on the supply is the last on the return. Every machine's path then has the same total length of header, and the head differences are nearly equal without any balancing.

Reverse return costs an extra length of return header, roughly the length of the row of machines, and it is common on new installations where the cost is small. CW-2 was built with direct return because the tank was at one end of the building and the cooler at the other, and the balancing valves were cheaper than the extra pipe.

## The error: valves all set alike

This is an illustration. After a maintenance shutdown, CW-2's balancing valves were found to have been opened fully for flushing. A fitter, without the commissioning record, set every valve to the same handwheel position, the one recorded for machine 1, reasoning that equal settings would give equal flows.

They do not. With every valve at machine 1's setting, K = 13.7, every branch was more resistant than the balanced design, the pump ran back up its curve to 11.06 m, and the total fell to 8.82 L/s. Worse, the imbalance remained: machine 1 got 1.540 L/s and machine 6 only **1.435 L/s**, less than it had received with every valve open. Equal valve settings do not give equal flows, because the machines do not have equal head differences to work with.

It was found the next week, when machine 6's moulds ran hot during a warm spell and a flow check showed it 4% short. The valves were reset from the commissioning record, which the plant now keeps on a laminated sheet in the pump room, beside a photograph of each valve's handwheel.

```figure
type: bars
title: Machine 6's flow under three valve arrangements
unit: L/s
max: 1.6
caption: This is an illustration from the CW-2 workbook. Equal settings on every valve make the farthest machine worse off, not better.
- All valves fully open | 1.475
- * Balanced from the commissioning record | 1.500
- All valves set like machine 1's | 1.435
```

## Exercise: a valve's pressure drop

Machine 2's balancing valve, at its balanced setting, has a Kv of 16.5 m³/h. Find its pressure drop at 1.5 L/s, and check it against the table: is it consistent with a K of 9.9 in the 36.0 mm branch?

**Worked answer.**

- 1.5 L/s is 5.4 m³/h, so Δp = (5.4 ÷ 16.5)² bar = 0.107 bar = **10.7 kPa**.
- As a head, 10.7 ÷ 9.778 = 1.095 m.
- With the branch's velocity head of 0.1107 m, K = 1.095 ÷ 0.1107 = **9.9**, matching the table.

Of that 10.7 kPa, the fully open valve would have taken 5.0 × 0.1107 × 9.778 = 5.4 kPa anyway; the balancing setting adds the other 5.3 kPa, which is the table's extra loss for machine 2.
