---
book: plain-bearings-by-the-numbers
chapterSlug: supplying-the-oil
order: 7
title: "Supplying the oil"
description: "Calculate the side flow a journal bearing's film loses, compare it with an oil ring's or pump's supply, place grooves where film pressure is low, and keep the oil level and condition right."
draft: false
---

A hydrodynamic film is not a fixed quantity of oil. It is a stream: oil is dragged into the wedge, squeezed out of the ends of the loaded zone and carried round into the unloaded side, and the oil that leaves must be replaced continuously or the film starves from its inlet. Every journal bearing therefore needs a supply of oil at least as large as its film loses, delivered to the right place, which is where the film pressure is low and the oil can be drawn into the wedge.

This chapter calculates the side flow that FB-75's film needs with the short-bearing solution, compares it with what an oil ring can lift and with the flow a pumped supply would need to carry the bearing's heat, explains where grooves and feed holes belong and where they must never go, and covers oil level, sealing and oil condition. It ends with a replacement shell that arrived with an oil groove machined into its loaded zone.

## The flow the film needs

In the short-bearing solution of NACA Report 1157, oil escapes from the two ends of the bearing wherever the film pressure is positive, which is the converging half of the clearance. DuBois and Ocvirk found that this side flow takes a strikingly simple form: the journal's surface speed times the radial clearance times the bearing length times the eccentricity ratio. They called the flow needed to replace it the required flow.

```figure
type: formula
title: Side flow from the loaded film of a short journal bearing
formula: Q_r = U × c × L × ε
caption: From NACA Report 1157. The total supply must exceed Q_r, because oil also leaves from the unloaded part of the clearance. Units: m/s, m and m give m³/s; multiply by 60,000 for L/min.
- Q_r | flow leaving the ends of the loaded film
- U | journal surface speed, m/s
- c | radial clearance, m
- L | bearing length, m
- ε | eccentricity ratio
```

This is an illustration. For FB-75's drive-end bearing at 66 °C, U = 6.20 m/s, c = 0.00006 m, L = 0.060 m and ε = 0.524, so Q_r = 6.20 × 0.00006 × 0.060 × 0.524 × 60,000 = 0.70 L/min. That is the oil the film loses from its ends and must be given back.

The formula shows what drives the need. Side flow rises in proportion to speed, clearance, length and eccentricity. A worn bearing, with more clearance and more eccentricity, needs more oil on both counts, which is why Chapter 5's undersize journal would have needed 2.22 L/min. A cold bearing, with thicker oil and a journal running nearer centre, needs less.

## What an oil ring supplies

An oil ring is a loose steel or brass ring, much larger in diameter than the journal, that hangs over the journal through a slot in the top of the bearing shell and dips into the oil sump below. The turning journal drives the ring round by friction, and the ring carries oil up from the sump on its surface and deposits it on the journal, from where it flows along the top of the journal into the bearing's grooves. It needs no pump, no power and no controls, which is why oil-ring bearings are standard on fans, pumps and motors of FB-75's size.

Its delivery is limited and variable. It depends on the ring's size and section, its immersion depth, the journal's speed and the oil's viscosity, and above a certain speed the ring slips on the journal and its delivery stops rising. Bearing makers publish ring delivery curves for their own designs. FB-75's maker's curve gives about 1.2 L/min at 1,480 rpm with the oil at running temperature and the level at the middle of the sight glass. This is an illustration, but the order of magnitude is typical: oil rings deliver around a litre a minute on bearings of this size.

```figure
type: compare
title: Oil the film needs against oil the ring supplies, FB-75 drive end
cols: Side flow needed | Ring supply | Supply ÷ need
rowhead: Condition
- * Design clearance, 66 °C | 0.70 L/min | about 1.2 L/min | 1.7
- Loose end of tolerance, running 0.073 mm | 0.95 L/min | about 1.2 L/min | 1.3
- Rebuild limit, running 0.093 mm | 1.34 L/min | about 1.2 L/min | 0.9
- Undersize journal, running 0.136 mm | 2.22 L/min | about 1.2 L/min | 0.5
caption: This is an illustration. Side flow from the short-bearing solution with the heat balance of Chapter 6; ring supply from the bearing maker's fictional curve at the normal oil level.
```

A supply-to-need ratio well above one, like the design's 1.7, keeps the wedge flooded with margin for a low oil level or a sluggish ring. Below one, the film starves: the converging zone is not full of oil, the pressure builds over a shorter arc, and the journal runs closer to the bore and hotter than any flooded calculation predicts. That is the reason Chapter 5's rebuild limit was set where the ratio approaches one.

## Oil to carry the heat

In an oil-ring bearing the circulating oil carries the film's heat to the housing, and the housing sheds it to the air, as Chapter 6 calculated. In a pressure-fed bearing, the oil flowing through carries most of the heat away to an external cooler, and the flow is often set by heat rather than by the film's side flow.

The [journal bearing design tool](/tools/journal-bearing-design/), introduced in Chapter 4, gives the oil flow needed to carry the bearing's friction heat at an allowed oil temperature rise. This is an illustration. For FB-75 with a 10 K rise, oil of 870 kg/m³ and 1.9 kJ/(kg·K), and the tool's Petroff loss of 184.5 W, it gives 0.67 L/min. With the short-bearing loss of 217 W the flow would be 0.79 L/min. If FB-75's bearings were converted to pressure feed, the supply would need to cover the larger of the heat flow and the side flow, with a margin, and the pump, filter and cooler would have to be reliable enough that their failure never starved a bearing; a pressure-fed machine therefore also needs a low-pressure trip.

## Where oil goes in, and where it must not

Chapter 4 placed FB-75's film pressure. With the journal turning anticlockwise and its load vertical, the thinnest film lies 52° round from the bottom of the bore in the direction the journal surface moves there, and the positive pressure fills the converging arc from the thickest film, high on the opposite side, round through the bottom to the thinnest film. Its peak of 3.59 MPa sits about 19° from the bottom.

```figure
type: compare
title: FB-75's film pressure at points round the bore, running at 66 °C
cols: Angle from the thickest film, in the direction of rotation | Film pressure | Suitable for an oil feed?
rowhead: Place
- Just past the thickest film | 38° | about 0.25 MPa | Yes: low pressure, oil drawn into the wedge
- Middle of the converging arc | 90° | about 1.16 MPa | No
- Bottom of the bore, on the load line | 128° | about 2.94 MPa | Never
- Pressure peak | 147° | 3.59 MPa | Never
- Diverging side, past the thinnest film | beyond 180° | about atmospheric | Acceptable, but oil is not drawn in there
caption: This is an illustration. Pressure along the bearing's centre line from the NACA Report 1157 short-bearing pressure distribution, scaled to the peak of 3.59 MPa.
```

Oil should enter where the film pressure is low and where the journal's motion will carry it into the wedge: near the thickest film, on the side where the journal surface moves towards the loaded zone. In a bearing with a fixed load direction, that is usually at or just ahead of the horizontal split, which is where FB-75's shells have their two axial grooves. The grooves stop short of the shell's ends, so that the oil they hold is not simply lost from the ends without passing through the film.

An oil hole or groove in the loaded zone does the opposite. It connects the high-pressure film to the low-pressure supply, so the pressure collapses over the area of the groove and some distance round it, the film loses capacity exactly where it needs it most, and oil is pumped out of the hole rather than into it. That is what Beauchamp Tower saw when he drilled his oil hole in 1883. In bearings whose load direction rotates with the shaft or varies, as in engine connecting rods, designers use circumferential grooves, which split the bearing into two shorter ones and cost capacity, or feed through the shaft, and they calculate the consequence.

## Oil level, seals and condition

An oil-ring bearing depends on its sump. Too little oil and the ring dips too shallowly, delivering less; too much and the ring churns, heating the oil and pushing it past the seals. The sight glass's marks define the range, and the plant checks levels weekly with the fan running, since the level reads differently when the ring is carrying oil.

The housing's shaft seals must keep the oil in and the dust out. On a dust extraction fan the second matters as much as the first: fine wood dust drawn into the housing by the fan's own pressure, or by the breathing of the housing as it warms and cools, contaminates the oil and its particles pass through the film. Labyrinth or lip seals, a breather with a fine filter and a housing kept slightly above the surrounding pressure are the usual defences, and the oil's condition is checked by the sampling and viscosity methods of the companion book, Viscosity by the Numbers. FB-75's oil is changed annually, or sooner if a sample shows water, dust or a change in viscosity.

```figure
type: checklist
title: Keeping an oil-ring bearing supplied
caption: Most oil-ring bearing failures start with the supply, not the film.
- Oil level in the marked band, checked running | Low level starves the ring; high level churns and leaks
- Ring turning freely and steadily | Watch through the inspection port; a stalled or wobbling ring delivers little
- Grooves where the pressure is low | Never in the loaded zone
- Side flow within the ring's supply | Check after any clearance change or rebuild
- Seals and breather sound | Especially on dusty or wet duties
- x Fill with a heavier oil to "help the ring" | Cold, thick oil slows the ring and starves the bearing at start-up
- ? Ask the bearing maker for the ring delivery curve | And the speed range in which the ring works reliably
```

## Starting with a cold sump

The ring's delivery at running temperature is not its delivery at a cold start. When the oil is cold and viscous, the ring is dragged more strongly by the oil it dips into and can turn more slowly than the journal drives it, and the thick oil drains off it more slowly. Delivery in the first minutes can be well below the running figure. At the same time, the cold film needs less side flow, because the journal runs nearer centre in thick oil, so the balance usually holds. It can fail when the oil is far too heavy for the conditions, such as a heavy grade in an unheated housing on a frosty morning, or when the ring has been bent or its slot fouled in a rebuild. A ring that is seen turning steadily through the inspection port within a minute or so of start-up is the simplest commissioning check there is, and the plant makes it after every rebuild and every oil change.

## The error: a groove in the loaded zone

This is an illustration. A replacement lower shell for FB-75's non-drive-end bearing came from a different supplier, who had copied it from a pump bearing in its catalogue. The new shell had an axial oil groove, about 8 mm wide and running most of its length, machined in the bottom of the bore, directly under the journal. The fitter, who had not seen such a groove in a fan bearing before, assumed it was an improvement that "put oil where the load is" and installed it.

Within an hour of restarting, the bearing's temperature was 12 K above its usual running temperature and still rising. An operator noticed oil seeping from the housing's seal faster than usual. The reliability engineer, comparing the shell with the drawing, recognised the groove's position. At the bottom of the bore, FB-75's film runs at about 2.9 MPa, more than 80% of its peak. The groove vented that pressure to the low-pressure oil around it, destroying the film's capacity over its width and pumping oil out through it, towards the ends and the seal. The journal had moved closer to the bore to make up the lost capacity, generating more heat in a thinner film.

The fan was stopped before the lining was damaged, and the shell was replaced with one made to the drawing, with its grooves at the split. The pump bearing the supplier had copied was loaded upwards through its cap, so its groove at the bottom of the bore had been in the unloaded zone, exactly where it belonged in that machine. The plant added a check to its rebuild procedure: before any shell is installed, its grooves and holes are compared with the drawing and with the load direction, and any feature in the loaded arc is a reason to stop.

## Bringing it together

A journal bearing's film loses oil from its ends at a rate the short-bearing solution gives as U × c × L × ε, 0.70 L/min for FB-75's drive end. The oil ring must supply more than that, about 1.2 L/min here, and worn or loose bearings need more than a ring can give. A pressure-fed bearing's flow must also carry its heat. Oil enters through grooves where the film pressure is low, near the thickest film, and never in the loaded arc, where it would vent the film. The sump level, ring, seals and oil condition keep the supply sound. The next chapter turns from the journal bearings to the thrust face that carries the impeller's axial load.

## Exercise: a longer bearing

FB-75's maker offers a longer drive-end bearing, 80 mm long instead of 60 mm, for the 9 kN impeller considered in Chapter 6. With the same clearance and speed and the same housing, the short-bearing solution with Chapter 6's heat balance puts it at about 70 °C with an eccentricity ratio of 0.459. Find its side flow and the ratio of ring supply to need, taking the same ring delivery of 1.2 L/min, and compare with the 60 mm bearing at 9 kN, which Chapter 6 put at ε = 0.606.

**Worked answer.** This is an illustration. Q_r = 6.20 × 0.00006 × 0.080 × 0.459 × 60,000 = **0.82 L/min**, and the supply-to-need ratio is 1.2 ÷ 0.82 = **1.46**. The 60 mm bearing at 9 kN would need 6.20 × 0.00006 × 0.060 × 0.606 × 60,000 = 0.81 L/min, almost the same: the longer bearing loses oil along more length but runs nearer centre, and the two effects nearly cancel. Either way the margin is smaller than the design's 1.7 at 6 kN, so the plant would want the maker's ring delivery for the chosen housing before accepting the heavier impeller.
