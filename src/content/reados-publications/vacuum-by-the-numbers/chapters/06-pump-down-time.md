---
book: vacuum-by-the-numbers
chapterSlug: pump-down-time
order: 6
title: "Pump-down time"
description: "The exponential pump-down, the chamber's time constant, VC-200's 280 to 290 seconds to 200 Pa, how gas loads set a floor and slow the end, staged pump-down, and a degassing timer started by the clock."
draft: false
---

The question an operator asks most often about a vacuum chamber is how long it takes to get down. The answer comes from one simple balance: the rate at which the gas in the chamber falls equals the rate at which the pump removes it, less the rate at which new gas appears. With no new gas, the pressure falls exponentially, and the time to any pressure follows from the chamber's volume and the effective pumping speed. With new gas from the work, the walls and leaks, the fall slows as it approaches a floor, and the last part of the pump-down can take longer than all the rest.

This chapter sets up the balance, finds VC-200's time constant and its time to 200 Pa, shows how the speed curve and the line change the answer, adds a gas load to show where the floor comes from, describes staged pump-down for foaming materials, and ends with a degassing timer that started by the clock instead of the gauge.

## The balance

The amount of gas in a chamber, measured as p × V, changes at the rate at which gas enters minus the rate at which it leaves. Gas leaves through the pump at a throughput S_eff × p; gas enters from the work, the walls and leaks at a total throughput Q. So:

V × dp/dt = −S_eff × p + Q

With no gas load, Q = 0, and a constant effective speed, the solution is an exponential decay:

p(t) = p₀ × e^(−t ÷ τ), with τ = V ÷ S_eff

The **time constant** τ is the chamber's volume divided by the effective speed. In each time constant, the pressure falls by a factor of e, about 2.72. The time to fall from p₀ to p is:

t = τ × ln(p₀ ÷ p)

## VC-200's pump-down

This is an illustration. VC-200 is 0.2 m³, and its pump's nominal speed is 4.44 L/s.

- Time constant with the pump's nominal speed: τ = 0.2 ÷ 0.00444 = **45 s**.
- Time to 200 Pa from 101,325 Pa: 45 × ln(101,325 ÷ 200) = 45 × 6.23 = **280 s**, about 4.7 minutes.

That figure assumes a constant speed. In fact the effective speed varies with pressure, because the hose's and valve's viscous conductances fall in proportion to pressure (Chapter 4) and the pump's speed falls near its ultimate (Chapter 5). Integrating the balance step by step with those variations included gives:

- with the hose alone: 200 Pa in about **283 s**;
- with the hose and the ball valve: 200 Pa in about **286 s**.

At VC-200's pressures the line costs only a few seconds, because its conductance stays well above the pump's speed until the very end. The simple formula, t = τ × ln(p₀ ÷ p), is good to about 2% here. It is a sound first estimate for any chamber in viscous flow whose line is generous.

```figure
type: formula
title: Pump-down time with no gas load
formula: t = (V ÷ S_eff) × ln(p₀ ÷ p)
caption: This is an illustration for VC-200 with its pump's nominal speed. Including the speed curve, hose and valve adds about 6 seconds.
- V | Chamber volume, 0.2 m³
- S_eff | Effective pumping speed, 4.44 L/s
- p₀, p | Starting and target pressures, 101,325 and 200 Pa
step: τ = 0.2 ÷ 0.00444 = 45 s
step: t = 45 × ln(101,325 ÷ 200) = 45 × 6.23 = 280 s
```

## Every decade takes the same time

The logarithm hides a useful rule. Each tenfold fall in pressure takes the same time, τ × ln 10 = 2.30 τ, about **104 s** for VC-200. From atmospheric pressure:

- to **10 kPa**: about 104 s;
- to **1 kPa**: about 208 s;
- to **200 Pa**: about 280 s;
- to **100 Pa**: about 311 s, if nothing else intervened.

In practice the early decades go as calculated and the later ones go more slowly, because the gas load, which hardly matters when the chamber holds tens of thousands of pascal cubic metres, becomes the dominant source of gas when it holds only tens. The step-by-step integration with no gas load reproduces the first figures to within a second or two; the next sections show what a gas load does to the last ones.

```figure
type: compare
title: VC-200's pump-down, time to each pressure
rowhead: Pressure
cols: Constant 4.44 L/s, s | With hose and valve, no gas load, s | With hose, valve and a 0.5 Pa·m³/s load, s
caption: This is an illustration from step-by-step integration of the balance. A gas load barely changes the early decades and dominates the end.
- 10 kPa | 104 | 104 | 104
- 1 kPa | 208 | 209 | 211
- * 200 Pa | 280 | 286 | 333
- 100 Pa | 311 | 324 | never; floor about 135 Pa
```

## Gas load and the floor

With a constant gas load Q and a constant effective speed, the balance has a steady state where the pump removes exactly what arrives: p_floor = Q ÷ S_eff. The pressure approaches that floor exponentially, with the same time constant:

p(t) = p_floor + (p₀ − p_floor) × e^(−t ÷ τ)

and the time to reach a pressure p above the floor is:

t = τ × ln((p₀ − p_floor) ÷ (p − p_floor))

When p is several times the floor, the gas load adds only a little time. When p approaches the floor, the time grows without limit: the chamber never quite gets there.

This is an illustration. Chapter 7 measures VC-200's gas load during a full batch of resin at about **0.5 Pa·m³/s** near 200 Pa, mostly air coming out of the resin and water vapour. With the hose and valve, the effective speed at 200 Pa is 3.91 L/s, so the floor at that moment is 0.5 ÷ 0.00391 = **128 Pa**, and integrating the balance with the varying speed gives 200 Pa at about **333 s**, 47 s later than with an empty chamber. With a light load of 0.12 Pa·m³/s, from the walls and a half batch, 200 Pa comes at about 294 s. The chamber's own volume sets the first four minutes; the work in it sets the rest.

## Reading a pump-down curve

Logging the chamber's pressure against time, and plotting the logarithm of pressure against time, turns the theory into a diagnostic. An exponential decay is a straight line on such a plot, with a slope of −1 ÷ τ.

- A **straight line** with the expected slope means the pump and line are delivering their speed.
- A **shallower slope** from the start means less effective speed: a restricted line, a worn pump, a closed ballast valve, a partly closed valve.
- A line that **bends to horizontal** at the end shows the gas load's floor. Its level, multiplied by the effective speed, gives the gas load.
- A floor that **falls slowly** over minutes is outgassing and vapour from the work, which decline as the surfaces dry and the resin degasses.
- A floor that **stays put** however long the pump runs suggests a leak, whose throughput is constant (Chapter 8).

The shop logs every VC-200 cycle from its capacitance diaphragm gauge, and compares each with a reference curve recorded when the system was new.

## Staged pump-down and foaming

Degassing resin is a special case, because the work itself responds violently to falling pressure. Bubbles of air entrained in the mixed resin expand as the pressure around them falls, in inverse proportion to the pressure: a bubble that is 1 mm³ at atmospheric pressure would be about 50 mm³ at 2 kPa and about 507 mm³ at 200 Pa, if it stayed in the resin. Long before 200 Pa, the bubbles rise, burst and froth, and the resin can foam to several times its volume.

The resin supplier's advice, and the shop's practice, is a **staged pump-down**: fill the container to no more than a third of its height, pump to an intermediate pressure, hold until the foam collapses, then continue. Some operators throttle the pump with the ball valve; others use a controlled bleed that stops the pressure falling until the foam subsides. Either way, the pump-down for a full batch takes longer than the empty-chamber calculation, by design, and the process sheet allows for it.

## Fog in the first minute

A fast pump-down from atmospheric pressure has a side effect that surprises people the first time they see it: a brief mist inside the chamber. The gas left in the chamber expands as its neighbours are pumped away, and an expanding gas cools if it has no time to take heat from the walls. Moist air that cools below its dew point condenses its water vapour into fine droplets, exactly as cloud forms in rising air.

The effect is short-lived, because the walls quickly warm the remaining gas, and in a small chamber like VC-200, pumped with a time constant of 45 seconds, it is slight. In large chambers pumped quickly, it can deposit water on the work and the walls, which then has to be pumped off again as vapour, slowing the end of the pump-down. Pumping the first decade more gently, or venting the chamber with dry gas between cycles, prevents it.

## Venting and the next cycle

At the end of each cycle, VC-200 is vented back to atmospheric pressure through a small valve before the door can be opened; with 16.2 kN on the door (Chapter 1), it will not open until the pressure is nearly equal on both sides. Venting is fast, because the flow into a vacuum through a small opening chokes at the speed of sound and stays at that rate until the chamber is about half full.

What the chamber is vented with matters for the next cycle. Vented with room air, its walls adsorb a fresh layer of water vapour from the humid air, which must be pumped away next time. Vented with dry nitrogen and kept closed between cycles, the walls stay drier, and the next pump-down reaches its working pressure sooner. For VC-200, where the resin, not the walls, dominates the gas load, the difference is small; for drying and leak-testing chambers, where the walls dominate, dry venting can cut minutes from every cycle. A chamber left open overnight in humid weather is the slowest to pump down the next morning, for the same reason.

## Bigger chambers, bigger pumps

The time constant scales with volume and inversely with speed. A chamber ten times VC-200's size with the same pump would take ten times as long to reach the same pressure: about 47 minutes instead of 4.7. A pump ten times as fast would bring it back to 4.7 minutes, if its line were ten times the conductance too. Doubling a line's bore in viscous flow multiplies its conductance by sixteen (Chapter 4), so the line is rarely the hard part. The pump's cost, power and footprint usually are, and the required pump-down time is worth questioning before a large pump is bought to meet it.

Volume can also be reduced. A chamber much larger than its work pumps a great deal of empty space every cycle. Fillers, or a chamber sized to the batch rather than to the largest part the shop might one day make, shorten every pump-down in proportion, and cost nothing to run. VC-200's 200 litres hold about 5 litres of resin in a batch; a chamber half the size, if the containers fitted, would reach 200 Pa in about half the time with the same pump.

## The error: a timer started by the clock

This is an illustration. When VC-200's process was automated, the controller was programmed to start the ten-minute degassing timer **280 seconds** after the pump valve opened, the empty-chamber pump-down time from the calculation above. The logic was that the chamber would be at 200 Pa by then.

The shop's data log, reviewed after an audit of void rates, showed otherwise. With a full batch, the chamber was typically at about **340 Pa** when the timer started, and reached 200 Pa only at about 330 seconds. On those batches, the first minute of the "ten-minute" degassing step was spent above the specified 200 ±50 Pa, and the resin received about nine minutes at the specified pressure. The calculation had been correct for an empty chamber; the chamber was never empty when it mattered.

The controller was changed to start the degassing timer when the gauge first reads 250 Pa or less, the top of the tolerance, and to raise an alarm if that has not happened within the six minutes the process sheet allows. The logged pump-down curves now carry the batch size, so that the effect of the load can be seen from one batch to the next.

```figure
type: checklist
title: Pump-down checks before relying on a time
caption: The calculation predicts the empty chamber; the gauge confirms the loaded one. The last line is this chapter's error.
- Time constant from volume and effective speed | 45 s nominal; 51 s with the valve at 200 Pa
- Time to the working pressure with no load | about 286 s with hose and valve
- Gas load and the floor it sets | 0.5 Pa·m³/s; floor about 128 Pa at 200 Pa
- Process steps started on the gauge, not the clock | timer at 250 Pa or less
- Pump-down logged and compared with a reference curve | every cycle, with the batch size
- x Timer started at a calculated time | about 340 Pa when degassing began
```

## Exercise: a larger chamber

The shop plans a second chamber of **500 L** for larger potting batches, with the same model of pump and an equally generous line. Estimate the time to 200 Pa with no gas load, using the pump's nominal speed. Then, if the full-batch gas load near 200 Pa is 1.0 Pa·m³/s and the effective speed there is 4.2 L/s, find the floor and say whether the chamber can reach 200 Pa at all.

**Worked answer.**

- Time constant: 0.5 ÷ 0.00444 = **113 s**; time to 200 Pa: 113 × 6.23 = **701 s**, nearly 12 minutes.
- Floor with the load: 1.0 ÷ 0.0042 = **238 Pa**.

The floor is above 200 Pa, so with that gas load the chamber cannot reach its working pressure at all, however long the pump runs, until the load falls as the resin degasses. The larger chamber needs a larger pump, roughly two and a half times the speed, to meet both the pump-down time and the gas load.
