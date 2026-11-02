---
book: pneumatics-by-the-numbers
chapterSlug: supply-clean-dry-air-at-the-right-pressure
order: 6
title: "Supply clean, dry air at the right pressure"
description: "Trace pressure drop from compressor to machine, fix the restrictions before raising pressure, size a receiver for peak demand, and dry, filter and drain the air so valves and cylinders keep working."
draft: false
---

Every pneumatic machine depends on a system it does not control: the compressor, the dryer, the filters, the receiver and the pipes that bring the air to it. When that system falls short, the symptoms appear at the machines. Cylinders slow down at busy times, valves stick on cold mornings, and the usual response is to turn the compressor's pressure up. That treats the symptom and costs money every hour the compressor runs. The causes are usually restrictions between the compressor and the machine, too little storage for short peaks, and water or dirt in the air.

This chapter follows the air from the compressor to line 2. It finds where the pressure is lost, fixes the restrictions instead of raising the pressure, checks the receiver against the factory's peak demand, sets out how the air is dried, filtered and drained, and lowers the compressor's pressure once the restrictions are gone. The failure case is a dryer left in bypass after a service, which sent water down the lines on the first cold morning.

## The factory's air system

The packing factory has one rotary screw compressor with a capacity of about **1.2 m³/min** of free air, controlled by load and unload: it loads when the pressure falls to **7.0 bar** and unloads at **7.5 bar**. Its air passes through an aftercooler built into the compressor, a refrigerated dryer, a main filter and a **500-litre** receiver, then into a steel main running round the factory, with branches to line 1, line 2 and the workshop. Each machine connects to its branch through a drop with a hose, a quick coupling and a filter-regulator.

Chapter 1 measured the pressure at line 2's drop: usually about 6.4 bar, and just above **5 bar** for a few minutes at a time at the factory's busiest. The compressor never let its own pressure fall below 7.0 bar. So at the worst moments, about **2 bar** was being lost between the compressor and the machine.

## Find where the pressure goes

The U.S. Department of Energy's compressed air sourcebook advises that a properly designed system should lose much less than 10 percent of the compressor's discharge pressure between the compressor and the point of use. Two bar from seven is nearly **30%**.

To find where it went, the maintenance lead fitted test gauges at five points along the path: after the compressor, after the dryer, after the main filter, at the start of line 2's branch and at the inlet to line 2's filter-regulator. Readings were taken together, at the busiest time of day, using a phone video of each gauge to capture the same moment.

```figure
type: stack
title: Pressure lost between the compressor and line 2 at peak demand
unit: bar
caption: This is an illustration of the readings at the busiest time, before any work. The total, about 2.0 bar, is nearly 30% of the compressor's 7.0 bar loading pressure.
- Refrigerated dryer | 0.15
- *Main filter, element well overdue for change | 0.55
- Branch to line 2, 20 mm pipe, long run | 0.8
- Drop hose and quick coupling | 0.5
```

Three of the four losses were fixable at modest cost. The main filter's element had not been changed for over two years, and its differential pressure gauge, which would have shown the problem, was mounted behind the receiver where nobody looked. Line 2's branch had been run in 20 mm pipe when line 2 was a small manual packing bench, and now carried the whole line's air over a long run. And the drop's hose and quick coupling had a smaller bore than the pipe feeding them, so they choked the flow at its last step.

## Fix restrictions before raising pressure

Raising the compressor's pressure would have pushed more air through the same restrictions, and line 2 would have seen more pressure at peak times. It would also have raised the pressure, and so the energy use and the leak flow, across the whole factory, every hour of every day, to cure a few minutes' shortfall at one machine.

Instead, the maintenance lead fixed the restrictions. The main filter element was replaced and its gauge moved to where it could be seen, with a replacement point marked on the dial. The branch to line 2 was replaced with a larger pipe, sized using the KEVOS® [air pipe pressure drop](/tools/air-pipe-drop/) calculator for the line's measured peak flow with a margin for growth. The drop's hose and coupling were replaced with a larger-bore hose and a high-flow coupling.

```figure
type: compare
title: Line 2's supply before and after the restrictions were fixed
cols: Before | After
caption: This is an illustration. Pressures were measured at the inlet to line 2's filter-regulator at the busiest time of day, with the compressor at its 7.0 bar loading pressure.
- Main filter loss | 0.55 bar | about 0.1 bar with a new element
- Branch pipe loss | 0.8 bar | about 0.1 bar in larger pipe
- Drop hose and coupling loss | 0.5 bar | about 0.05 bar
- *Total loss from compressor to machine | about 2.0 bar, nearly 30% | about 0.4 bar, under 6%
- Lowest pressure at line 2 | about 5.0 bar | about 6.6 bar
```

After the work, the lowest pressure at line 2 was about **6.6 bar**, comfortably above the 6 bar the pusher's regulator was set to. The total loss, about 0.4 bar, was under 6% of the compressor's pressure, much closer to the sourcebook's guidance.

## Lower the compressor's pressure

With the restrictions fixed, the factory had more pressure than it needed. The machine with the highest requirement, line 1's sealer, needed **6 bar** at its regulator. With a loss of about 0.4 bar at peak, the compressor could load at 6.5 bar instead of 7.0 and still deliver about 6.1 bar to the worst-placed machine. After a fortnight's trial with logging at both lines, the compressor's band was lowered by **0.5 bar**, to load at 6.5 and unload at 7.0 bar.

The sourcebook's rule of thumb is that, for systems around 100 psi, each 2 psi reduction in discharge pressure reduces energy use by about 1 percent at full output. Half a bar is about **7.25 psi**, so the reduction is worth roughly **3.6%** of the compressor's energy when loaded. With the compressor loaded about 60% of the factory's 4,000 hours, at 7 kW per m³/min, its loaded energy is about **20,160 kWh** a year, about **A$6,050**. A 3.6% reduction saves about **A$220** a year, with a further small saving because every leak in the factory now leaks at a lower pressure. These are modest sums, but they cost nothing once the restrictions were fixed, and they recur every year.

## Size the receiver for the peaks

The receiver stores compressed air so that short peaks in demand can be met without the pressure collapsing. Its usefulness depends on its volume and on how far its pressure can be allowed to fall.

```figure
type: formula
title: How long the receiver can cover a shortfall
formula: time = receiver volume × allowed pressure fall ÷ (atmospheric pressure × shortfall in flow)
caption: This is an illustration for the factory's 500-litre receiver. The shortfall is how much the demand exceeds what the compressor delivers, in free air. Pressures in bar, volume in cubic metres, flow in cubic metres a minute.
- Receiver volume | 0.5 m³
- Allowed pressure fall | 1.0 bar
- Shortfall at peak | 0.5 m³/min, when the workshop's blow guns and line 1's sealer peak together
step: time = 0.5 × 1.0 ÷ (1.013 × 0.5)
step: time ≈ 0.99 minutes, about 59 seconds
```

The factory's worst peaks lasted about 20 to 30 seconds, well within what the receiver could cover. Before the restrictions were fixed, the receiver had been irrelevant to line 2's problem: the air was in the receiver, but could not get to the line fast enough. The KEVOS® [air receiver](/tools/air-receiver/) calculator does this calculation in reverse, giving the volume needed for a stated shortfall and time.

A receiver is pressure equipment and stores a large amount of energy. Its design, registration where required, safety valve and periodic inspection are covered by work health and safety law and the relevant standards, and are outside this book's scope. The [Pressure vessels and thin-walled cylinders](/reados/collections/machine-elements-and-mechanical-design/pressure-vessels-and-thin-walled-cylinders/) chapter explains why stored gas is so much more hazardous than stored liquid.

## Dry the air

Atmospheric air contains water vapour. When a compressor squeezes several cubic metres of air into one, the water vapour is squeezed with it, and when the compressed air cools, much of it condenses into liquid. Left in the pipes, that water washes lubricant from valves and cylinders, corrodes steel pipes and valve spools, and can freeze in exhausts on cold mornings.

The factory's compressor has an aftercooler that removes much of the water as liquid, and a refrigerated dryer that cools the air further so more condenses and is drained away, before the air warms up again on its way into the main. The result is air whose **pressure dew point**, the temperature at which water would begin to condense at line pressure, is below the temperature of any pipe in the factory. Air that does not cool below its dew point in the pipes stays dry.

Air quality is specified using the purity classes of **ISO 8573-1**, which set separate classes for particles, water and oil. A designer states the class needed for each use, and the treatment is chosen to deliver it. Air that touches food or the inside of food packaging needs more treatment and more attention than air that only drives cylinders; the packing factory's air drives cylinders and does not touch product, but the business's food safety plan records that decision and its reasons.

## Filter, drain and do not lubricate

Liquid water that does form must be drained from the system. Drains are fitted at the compressor, the dryer, the receiver and every low point in the main. **Timed drains** open at intervals whether or not there is water to remove, wasting compressed air each time. **Zero-loss drains** open only when a float or sensor detects liquid. The factory replaced its two timed drains with zero-loss drains when they were next due for service.

Branch take-offs are made from the **top** of the main, so that any water running along the bottom of the pipe does not fall into the drop. The main slopes slightly toward its drains. Each machine's filter-regulator has a bowl that catches any remaining water and dirt, with a drain the operators check at each shift start.

The factory runs its cylinders and valves **without added lubrication**. Modern components are greased at assembly and designed to run on dry, unlubricated air. Once a lubricator is added, though, the factory grease is washed out and the component depends on lubricated air for the rest of its life. The business standardised on unlubricated air, which also keeps oil mist out of the exhaust near the food lines.

## Dispose of condensate properly

The water drained from a lubricated screw compressor contains oil. It must not go into stormwater drains. The factory passes all its condensate through an oil-water separator before discharging the water to sewer, under its trade waste agreement with the local water authority, and the collected oil is removed by a licensed waste contractor. Requirements differ between states and water authorities, so the business checked its own before installing the separator.

## A failure case: the dryer left in bypass

This is an illustration. The refrigerated dryer was serviced on a Friday in early winter. To keep the factory running during the service, the technician opened the dryer's bypass valve, sending the air round the dryer. After the service, the dryer was restarted, but the bypass valve was left open, so most of the air continued to flow round it, undried.

Over the weekend the factory was cold. On Monday, water condensed in the main, the branch and the drops. The receiver's timed drain, then still in service, could not keep up, and line 2's filter-regulator bowl filled. By mid-morning, the controller's stroke-time log from Chapter 3 showed the pusher's extend time creeping from about 0.43 s to over 0.6 s, as water reached the valve and its spool began to stick. The stroke-time alarm stopped the line before any reject was missed. The maintenance lead found water in the bowl and traced it back to the open bypass.

The detection came from the stroke-time logging, which turned a slow, invisible problem into an alarm before it became a quality failure. The correction was to close the bypass, drain the whole system, and replace the reject valve, whose spool had begun to corrode. The dryer's bypass valve now has a tag that must be signed off when it is closed after any service, and the dryer has an indicator visible from the compressor room door showing whether it is in bypass.

## How this applies to a small Australian business

Small factories often run their compressors at higher pressure than any machine needs, to overcome restrictions nobody has found. Measure the pressure along the path at the busiest time, find the restrictions, and fix them before raising the pressure. Keep filter gauges where people see them. Check that the receiver can cover your real peaks. Dry the air enough that it cannot condense in your coldest pipe, drain it with zero-loss drains, and take branches from the top of the main. Decide once whether to lubricate, and stay with the decision. Dispose of condensate as your water authority requires. Then lower the compressor's pressure to what the machines actually need, and enjoy a small saving every year for no further cost.

## Exercise: a bigger reduction

The production manager, pleased with the first saving, proposes lowering the compressor's band by another **0.5 bar**, a full **1 bar** below the original. Using the sourcebook's rule of thumb and the loaded energy cost of about A$6,050 a year, what would the total reduction be worth? What would the lowest pressure be at line 1's sealer, which needs 6 bar at its regulator, with a loss of about 0.4 bar at peak? Should the factory do it?

**Worked answer.** One bar is about **14.5 psi**, worth roughly **14.5 ÷ 2 × 1% ≈ 7.3%** of the loaded energy, about **A$440** a year, or about A$220 more than the first step. But the compressor would then load at 6.0 bar, and with a 0.4 bar loss at peak the sealer would receive about **5.6 bar**, below the 6 bar it needs. The factory should not do it unless the sealer's requirement can be reduced, for instance by checking whether it truly needs 6 bar or by fitting a small local booster for that one machine. Lowering pressure is worthwhile only down to what the most demanding machine needs.
