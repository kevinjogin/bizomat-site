---
book: electroplating-by-the-numbers
chapterSlug: current-density-and-the-rectifier
order: 4
title: "Current density, burning and the rectifier"
description: "Keep every part of a load inside the bath's current density window, size the rectifier and bus, and see how a bad contact or a part-full tank pushes racks out of range."
draft: false
---

A plater can choose many things, but the 1917 treatise singled out one: the current density, it said, was the factor the plater had chiefly under control. Every plater wants to deposit as fast as possible, so that each tank turns out as much work as it can. The limit, the treatise explained, is set by what current density does to the quality of the deposit. Push past it and the coating comes out dark, rough and powdery, a condition platers still call a **burned** deposit, a name chosen, the treatise noted, because it looks like the effect of overheating.

This chapter explains why the limit exists, converts the 1917 figures to modern units, and shows how the bracket line keeps every part of every rack inside the bath's working window: by setting current from area, by keeping contacts sound and by never running a part-full tank at full current.

## Why there is a limit

Metal can deposit only as fast as metal ions arrive at the cathode surface. Next to the surface, the solution is depleted of metal, because the ions there are being deposited, and fresh ions must move in through that thin depleted layer by diffusion and by the flow of the solution. As the current density rises, the layer is stripped of metal faster than it can be replenished. Near the limiting rate, deposition becomes unstable: high points, which reach further into the solution, grow fastest, producing nodules, powdery deposits and the tree-like and fern-like growths the treatise illustrated. At the same time a larger share of the current goes to hydrogen, as Chapter 3 described.

Anything that thins the depleted layer or speeds the supply of ions raises the limit. The treatise noted that an acid copper bath kept still could be run at about 10 to 20 amperes per square foot, but with rapid circulation of the solution, at 100 amperes per square foot or more. Modern lines use air agitation, moving cathode rods, pumped solution flow and heating to the same end.

There is also a lower limit in many baths. Below a certain current density, deposits may be dull, poorly covering or of the wrong structure. Every bath therefore has a **working window** of current density within which the deposit is acceptable, and the chemical supplier's data states it.

## The 1917 figures in modern units

Current densities in the treatise are in amperes per square foot. One square foot is about 9.29 square decimetres, so dividing by 9.29 gives amperes per square decimetre.

```figure
type: range
title: Current density ranges given in the 1917 treatise, converted
unit: A/dm²
min: 0
max: 11
caption: The treatise's figures for its own baths, converted at 1 ft² = 9.29 dm². Circulation raised the acid copper limit roughly five-fold. These are historical values, not settings for any modern bath.
- Nickel, double-salt bath | 0.54 | 1.08
- Acid copper, still solution | 1.08 | 2.15
- Cyanide copper | 2.15 | 3.23
- *Acid copper, rapid circulation | 2.15 | 10.76 | upper figure "100 A/ft² and over"
```

The treatise also gave a general rule that most plating was done below about 10 amperes per square foot, about 1.08 A/dm², and that its nickel bath could be run economically only below that figure. Modern baths with brighteners, agitation and better chemistry run much higher, but the principle is unchanged: the window belongs to the bath, and it has to be learned from the bath's data and from testing.

## Every point on the part must be in the window

The current density that matters is not the average set on the rectifier but the local current density at every point on every part. Chapter 5 shows that on the bracket, the edges receive about 160% of the average and the recess in the channel about 50%. The bath's window must contain both.

This is an illustration. Suppose the supplier gives the bracket bath a working window of about 0.5 to 4.0 A/dm². At the planned average of 2.0 A/dm², the edges run at about 3.2 A/dm² and the recess at about 1.0 A/dm². Both are inside the window, with margin at each end.

```figure
type: gauge
title: Local current density at the bracket edges, planned average 2.0 A/dm²
min: 0
max: 5
value: 3.2
unit: A/dm²
label: = 1.6 × 2.0
caption: This is an illustration, for a bath window of about 0.5 to 4.0 A/dm². Raising the average to speed the line would push the edges towards burning while the recess stays far below the average.
- 0 | 0.5 | Too low
- 0.5 | 4.0 | Working window
- 4.0 | 5 | Burning
```

That gives a simple test for any proposal to run faster. Raising the average to 2.5 A/dm² would put the edges at about 4.0 A/dm², at the top of the window, with no margin for a rack positioned slightly closer to an anode. Raising it further would burn the edges before the recess gained enough to matter. The current density window, the part's geometry and the plating time are linked, and Chapter 5 shows how changing the geometry is often the better way to save time.

## Sizing the current and the rectifier

The current for a rack is its plated area multiplied by the chosen average current density. This is an illustration. Each bracket rack carries 80 dm², so at 2.0 A/dm² it needs **160 A**. The plater's zinc tank holds three racks at a time, so a full tank needs **480 A**, supplied by a rectifier rated at 600 A to leave headroom for heavier loads and for the higher current used at the start of some cycles.

The voltage must also be available. At about 4.5 V for this tank, a full load draws about 4.5 × 480 ≈ 2.2 kW. A rectifier that can reach its rated current only at a voltage the tank does not need is wasting nothing; one that cannot reach the current because it runs out of voltage, as anodes deplete or the solution cools, will deliver less charge than the work sheet assumes.

Between rectifier and work, current flows through bus bars, flexible leads, the tank's cathode rods, rack hooks and the rack's own contacts. Copper bus is sized generously because the currents are large and the voltages small. A 2 m run of 50 × 6 mm copper bar, with a resistance of about 115 microhms, drops only about 55 millivolts at 480 A. The danger lies in the joints.

## A bad contact steals current

The 1917 treatise warned that any undue heating where there is a joint in the circuit should be investigated for dirt and grease, and that loose bolts let oil carry dirt under their heads. In a plating tank the same problem shows up as uneven plating between racks.

When several racks hang from one cathode rod on one rectifier, the rectifier controls the total current and the racks share it according to the resistance of their paths. This is an illustration, using a simplified linear model in which each rack's path behaves like a resistance of about 28.1 milliohms at its working point. If one rack's hook has a dirty contact adding 5 milliohms, the 480 A no longer divides equally. The two good racks draw about 168.5 A each, an average of about 2.11 A/dm², and the poor rack about 143 A, about 1.79 A/dm².

```figure
type: bars
title: How 480 A divides between three racks when one contact is poor
unit: A
max: 180
caption: This is an illustration, using a simplified linear model. The poor rack's recess falls about 11% short of plan; the good racks' edges move closer to the burning limit.
- Rack 1, good contact | 168.5
- Rack 2, good contact | 168.5
- *Rack 3, extra 5 mΩ at the hook | 143.0
- Planned, each rack | 160.0
```

At the planned time, the poor rack's recess would receive about 1.79 ÷ 2.0 × 8 ≈ 7.2 µm, below the minimum, while the good racks' edges run at about 3.4 A/dm², closer to burning. Five milliohms is the resistance of a contact that looks perfectly sound; at 143 A it dissipates about 100 W, enough to warm the hook noticeably. The checks are the ones the treatise recommended: clean contacts, tight connections, and a hand or thermometer on any joint that runs warm. A clamp-on ammeter on each rack lead, as Chapter 3 suggested, shows the imbalance directly.

## The anodes have a window too

Current density applies at the anodes as well as at the work. The 1917 treatise explained that plating anodes are usually made of the coating metal so that they dissolve and replace the metal plated out, and that insoluble anodes, used only in special cases, make the composition of the bath change progressively. A soluble anode dissolves properly only within its own current density range. Pushed too hard, its surface can become coated with films that resist dissolution, the voltage rises, and the bath starts to lose metal because the anodes are no longer keeping up.

This is an illustration. If the bracket tank's zinc anodes present about 120 dm² of working surface and a full load draws 480 A, the average anode current density is 480 ÷ 120 = 4.0 A/dm². Whether that is acceptable depends on the bath and anode type, and the supplier's data says. As anodes dissolve their area shrinks and their current density rises, which is one reason anode baskets are kept topped up rather than run down. The failure described in Chapter 3, where efficiency fell after anodes were neglected, began here.

## Temperature moves the window

The working window is quoted at a stated temperature, and it moves when the temperature does. Warmer solutions conduct better and supply ions to the surface faster, which generally raises the upper limit; cooler solutions lower it and also raise the voltage needed for the same current. A tank that runs within its window on a summer afternoon may burn edges at the same setting on a cold morning before its heaters have caught up. Large currents also heat the solution, so a busy tank can drift warmer through a shift. Recording the solution temperature with each load, and holding it within the supplier's range with heating and, where needed, cooling, keeps the window where the work sheet assumes it is.

## Racks are part of the circuit

Plating racks are tools, and they wear. Their contact tips plate up with zinc on every cycle, unless they are insulated or stripped, and the build-up changes both their contact and their current share. Their insulating coatings crack and let current reach the frame, which then steals current from the parts. Racks are therefore stripped and inspected at intervals, and a rack that consistently plates thin is withdrawn rather than tolerated. The rack design itself, with the number and position of contacts and the orientation in which it holds each part towards the anodes, also shapes the thickness distribution, a subject Chapter 5 takes up.

## A failure: the half-empty tank

This is an illustration. Late on a Friday, the bracket line had only two racks ready for the last load. The operator hung them in the tank and started the cycle without changing the rectifier, which was still set to 480 A for three racks. The two racks shared 480 A, 240 A each, an average of 3.0 A/dm². At the edges the local current density was about 4.8 A/dm², above the window, and the edges came out dark and rough. In the recess it was about 1.5 A/dm², so the recess actually gained thickness; the failure was entirely at the edges.

The burned edges were found at unloading by their appearance, and adhesion checks showed the burned zinc was powdery and poorly bonded. The racks were stripped and replated. The cause was the rectifier being set in amperes, a number that is right only for a particular load, rather than from the area actually in the tank. The 1917 treatise had made the point a century earlier: a rheostat in each tank allows the current to be adjusted to the amount of cathode surface.

The correction was procedural and simple. The work sheet now gives the current per rack, 160 A, rather than per tank, and the operator multiplies by the number of racks loaded. The line's newer rectifier can also be set in current density with the area entered for each load, which removes the arithmetic altogether. A blank or dummy rack is used where a tank must be run part-full and the geometry would otherwise change too much.

Two further checks were added at the same time. The first rack of any part-full load is inspected at the edges before unloading the rest, since burning is visible at once. And the work sheet records the number of racks and the current actually set for every load, so that a thickness or appearance problem found later can be traced to the load that caused it. Neither check costs more than a minute, and both would have caught the Friday load before it reached the passivate tank.

## Exercise: a different part

The plater is asked to quote a steel housing with 3.5 dm² of surface, hung 24 to a rack, in the same zinc tank. The housing has no deep recesses; the plater estimates that its edges will see about 140% of the average current density and its least favourable significant surface about 75%. For a bath window of 0.5 to 4.0 A/dm², choose an average current density, then calculate the current per rack and for a full tank of three racks.

An average of 1.8 A/dm² puts the edges at about 1.4 × 1.8 ≈ **2.5 A/dm²** and the least favourable surface at about 0.75 × 1.8 ≈ **1.35 A/dm²**, both comfortably inside the window. Each rack carries 3.5 × 24 = 84 dm², so it needs 84 × 1.8 ≈ **151 A**, and a full tank about **454 A**, within the 600 A rectifier. If only one rack were loaded, the rectifier must be set to about 151 A, not 454 A; at 454 A the single rack would run at about 5.4 A/dm², with its edges near 7.6 A/dm², far beyond the window.
