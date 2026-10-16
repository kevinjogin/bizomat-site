---
title: "Belt or chain drive: selecting, installing and maintaining flexible power transmission"
description: "Belt and chain drives are simple until they slip, stretch or wreck bearings. How to choose between them, size a drive properly, set tension and alignment, and maintain it for long life."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Belt and chain drives connect motors to fans, pumps, conveyors, compressors, mixers, crushers and countless other machines. They are cheap, flexible in layout and easy to change when a different speed is needed. They are also among the most frequently replaced parts in a plant. Belts squeal, glaze and snap; chains stretch, run dry and wear out sprockets; over-tensioned drives destroy motor bearings; misaligned pulleys chew through belt sets in weeks.

These problems are rarely bad luck. They come from drives that were sized without allowing for how the machine really runs, from the wrong type of belt or chain for the conditions, and from installation and maintenance practices that do not follow the basics: correct tension, accurate alignment, matched belt sets, adequate lubrication for chains and timely replacement of worn pulleys and sprockets.

This article explains how belt and chain drives work, how to choose between them, how to size each type, how to install and tension them correctly, and how to maintain them. It is general information for designers, engineers and maintenance teams. Drive manufacturers publish detailed selection data and software, which should be used for specific designs.

## The main options

- **Vee and wedge belts**: trapezoidal belts that wedge into grooved pulleys. Wedge belts have a deeper profile and carry considerably more power per belt than classical vee belts on the same width of pulley. They are the usual choice for general industrial drives.
- **Banded belts**: several belts joined across the top, preventing belts from turning over or whipping on long or shock-loaded drives.
- **Cogged belts**: notched on the inside so they bend around smaller pulleys and run cooler.
- **Synchronous, or toothed, belts**: flat belts with teeth that mesh with toothed pulleys. No slip, precise timing, no lubrication.
- **Flat belts**: modern flat belts suit high-speed drives with low losses.
- **Roller chain**: a series of pins, bushes and rollers that mesh with sprockets. Strong, compact and positive, but needs lubrication and wears with use.

| Feature | Vee and wedge belts | Synchronous belts | Roller chain |
|---|---|---|---|
| Slip | Small, and can act as overload protection | None | None |
| Speed range | Medium to high | Low to high | Low to medium |
| Shock tolerance | Good, belts absorb shocks | Moderate | Good, but shocks accelerate wear |
| Lubrication | None | None | Essential |
| Noise | Quiet | Can be noisy at high speed | Noisier |
| Environment | Sensitive to oil, heat and some chemicals | Sensitive to debris in teeth | Tolerates heat and dirt better, but wears in abrasive dirt |
| Maintenance | Tension checks, belt replacement | Little | Lubrication, elongation checks |
| Typical uses | Fans, pumps, compressors, general drives | Timing, indexing, efficient drives | Conveyors, slow heavy drives, agricultural machinery |

Where precise speed and efficiency matter and the environment is clean, synchronous belts are often a good choice. Where shock loads and a little slip are acceptable, wedge belts are hard to beat. Where speeds are low, loads high and temperatures or space make belts unsuitable, chain is often the answer.

## How a belt grips

A belt transmits power through the difference in tension between its tight and slack sides, multiplied by its speed. The maximum ratio between the two tensions before the belt slips is set by friction and the angle of wrap around the pulley. The ratio rises exponentially with the coefficient of friction multiplied by the wrap angle in radians.

For a flat belt with a coefficient of friction of 0.3 wrapped 160 degrees around a pulley, the tight side can carry only about 2.3 times the tension of the slack side before slipping. A vee or wedge belt seated in a groove is squeezed by the groove's sides, multiplying the effective friction about threefold, so the same wrap supports a tension ratio of about 13. That is why vee and wedge belts can carry so much power with modest tension.

The same relationship explains two practical rules. First, wrap matters: small pulleys at large speed ratios and short centres have less wrap and slip sooner. Second, tension must be right: too little and the belt slips, glazes and overheats; too much and it loads the shafts and bearings without adding useful capacity.

## Sizing a wedge belt drive

Manufacturers' procedures follow a common pattern:

1. **Find the design power**: running power multiplied by a **service factor** that depends on how the motor starts, how rough the driven machine is and how many hours a day the drive runs. A crusher running around the clock needs a much larger factor than a fan running a day shift.
2. **Choose the belt section** from the design power and the speed of the faster shaft. Standard wedge sections include SPZ, SPA, SPB and SPC, in increasing size.
3. **Choose pulley diameters** that give the required speed ratio, no smaller than the minimum for the section. Larger pulleys reduce the number of belts and the shaft load. A ratio of about 6:1 is a practical limit for one pair of pulleys.
4. **Calculate belt length and centre distance**, choosing the nearest standard belt length.
5. **Find the power per belt** from the manufacturer's tables, corrected for arc of contact and belt length.
6. **Divide design power by power per belt** and round up to find the number of belts.
7. **Specify pulleys and bushes**, commonly taper-lock bushes, and the installed tension.

Belt length for two pulleys is approximately twice the centre distance, plus π times the sum of the diameters divided by two, plus the square of the difference in diameters divided by four times the centre distance. With pulleys of 200 and 400 mm on centres of 600 mm, that is about 1,200 + 942 + 17, or roughly 2,160 mm, before choosing the nearest standard length and adjusting the centres.

## Shaft and bearing loads

The tension in a belt or chain pulls the motor shaft and driven shaft towards each other. This **overhung load** acts on the shaft bearings and grows with distance from the bearing. Small pulleys need higher belt tension to carry the same power, so they increase the load; mounting pulleys close to the bearing housing reduces it. Motor and gearbox manufacturers publish permissible overhung loads, which should be checked against the drive design, particularly for small motor pulleys and heavily tensioned drives. Exceeding them is a common, avoidable cause of bearing and shaft failures.

## Selecting a roller chain drive

Precision roller chain is made to standards such as ISO 606 for European-pattern chain and the ANSI series. The two patterns are not interchangeable, so specify which is used. Chains are identified by **pitch**, the distance between pin centres, and are available as single (simplex), double (duplex) and triple (triplex) strands.

Practical rules for sprockets:

- **Use at least 19 teeth on the driving sprocket** where possible. Rating data is usually based on 19 teeth, and smaller sprockets increase chain tension, wear and the uneven, pulsing motion called chordal action.
- **Use at least 25 hardened teeth** on the small sprocket for high speeds or shock loads.
- **Combine an odd number of teeth with an even number of chain links** so wear spreads evenly.
- **Keep the wrap on the small sprocket** at 120 degrees or more.

The **selection power** is the transmitted power multiplied by an **application factor**, reflecting the shock from the driver and driven machine, and a **tooth factor**, 19 divided by the number of teeth on the driving sprocket. Select the smallest pitch that carries the selection power at the driving sprocket's speed; if a single strand is not enough, move to multiple strands of the same pitch before going to a larger pitch.

Rating charts reflect different failure mechanisms at different speeds: link plate fatigue at low speeds, roller and bush fatigue in the middle range and pin galling from lubrication breakdown at high speeds. In a correctly selected and lubricated drive, the long-term failure mode is wear, which lengthens the chain.

**Lubrication** is essential and depends on speed: manual or drip lubrication at low speeds, oil bath or disc lubrication at moderate speeds and pressurised oil stream lubrication at high speeds. A dry chain wears many times faster than a lubricated one.

## Installation: alignment, tension and guarding

**Alignment.** Pulleys and sprockets must be in the same plane with parallel shafts. Misalignment wears belt sides and chain plates, causes belts to turn over and loads bearings unevenly. Laser alignment tools make accurate alignment quick.

**Tension.** Set belt tension using the manufacturer's method, such as deflection force at mid-span or a frequency-based tension meter, rather than by feel. New belts stretch and bed in during their first hours, so recheck tension after a short running-in period. Chains need modest slack, typically measured as sag on the slack side, not tension.

**Belt sets.** Multi-belt drives need **matched sets** from one manufacturer and batch. Replace all belts together; mixing new and old belts overloads the new ones.

**Guarding.** Belt and chain drives are serious entanglement hazards. Guards must prevent access to nip points and moving parts while allowing inspection and maintenance safely. The AS/NZS 4024 series covers safeguarding of machinery, and work health and safety laws require risks from moving machinery to be controlled. Isolate and lock out drives before removing guards.

## Maintenance

- **Inspect belts** for cracks, glazing, fraying, swelling from oil and uneven wear, and recheck tension at set intervals.
- **Check pulley grooves** with groove gauges. Worn grooves let belts bottom out and slip; replace worn pulleys when replacing belts.
- **Lubricate chains** at the right interval with suitable lubricant, and keep them clean where abrasive dust is present.
- **Measure chain elongation** over a set number of pitches and replace chains before they reach the manufacturer's limit, usually a few per cent of their original length and less for large sprockets.
- **Replace sprockets** when teeth become hooked or sharpened; a new chain on worn sprockets wears out quickly.
- **Record failures and replacement intervals**, so recurring problems can be found and fixed.

Drive choice and condition also affect energy use. Slipping belts waste power, and synchronous belts can be a few per cent more efficient than vee belts on suitable drives. The [cutting energy use in business premises](/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/) article covers finding savings like these.

## A worked example

This is an illustrative example. A dust extraction fan is driven by a 30 kW motor at 1,475 rev/min through four classical vee belts to a fan running at about 1,100 rev/min. Belts are replaced roughly every three months, and the motor's drive-end bearing has failed twice in two years.

**Investigation.** Maintenance staff find that belts are tensioned by feel, sometimes very tight to stop squealing; that the pulley grooves are worn; that the fan pulley is visibly misaligned; and that belts are replaced one at a time as they fail. The drive was originally sized with a light-duty service factor, although the fan runs around the clock.

**Changes.**

- The drive is recalculated with a service factor for continuous operation, giving a design power of about 39 kW using the manufacturer's factor of 1.3.
- New pulleys for SPB wedge belts are fitted, with a set of three matched belts carrying the design power with margin.
- The pulleys are aligned with a laser tool.
- Tension is set with a frequency tension meter, rechecked after running in and then at each monthly inspection.
- Belts are replaced only as matched sets.

**Result.** Belt life extends from about three months to well over a year, and the motor bearing runs cooler because shaft load is now controlled. The business adds the procedure to its maintenance system. The [buying for the whole life of equipment](/reados/collections/investment-appraisal-and-business-cases/buying-for-the-whole-life-of-equipment/) article explains why the cheapest drive at purchase is rarely the cheapest over its life.

## Applying this in an Australian business

- **Choose the drive type** for speed, shock, environment and maintenance capacity.
- **Use realistic service factors** for start type, machine duty and running hours.
- **Prefer larger pulleys and sprockets** where space allows.
- **Align with tools** and set tension with the manufacturer's method.
- **Replace belts as matched sets**, and pulleys and sprockets when worn.
- **Lubricate chains** to suit speed and conditions, and measure elongation.
- **Guard drives** and isolate before maintenance.
- **Record failures** and look for patterns.

## Where belt and chain drives go wrong

- **Light-duty service factors** on heavy or continuous duties.
- **Tension set by feel**, either too loose or too tight.
- **Misaligned pulleys and sprockets.**
- **Mixed old and new belts** in a set.
- **Dry chains** and new chains on worn sprockets.
- **Small driving sprockets and pulleys** chosen to save space.
- **Guards removed** and not replaced.

## Questions to ask about a drive

- What service factor did we use, and does it reflect how the machine actually runs?
- Is a belt, a synchronous belt or a chain best for this speed, load and environment?
- How is tension set and checked, and how often?
- When were the pulleys or sprockets last checked for wear and alignment?
- How is the chain lubricated, and how is elongation measured?
- Is the drive fully guarded and safe to inspect?

## Bringing it together

Belt and chain drives last when they are chosen, sized and maintained properly. Choose the type for the duty and environment, size it with realistic service factors and generous pulley and sprocket sizes, and specify components fully. Install with accurate alignment and correct tension, replace belts as matched sets and worn pulleys and sprockets with them, lubricate chains and measure their wear, and keep drives guarded. The result is fewer breakdowns, longer bearing life, lower energy use and safer machines.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on belt drives and pulleys, vee and wedge belt drive design, flexible belts and sheaves, industrial chain drives and roller chain drive selection, together with established power transmission practice. The worked example is illustrative. This article is general information; use manufacturers' selection data for specific designs.*
