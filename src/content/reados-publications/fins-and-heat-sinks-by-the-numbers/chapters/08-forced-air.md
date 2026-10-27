---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: forced-air
order: 8
title: "Forced air: fans, channels and pressure drop"
description: "A fan raises the coefficient threefold, but only as far as its curve meets the sink's resistance to flow. The 250 W version is sized, with a dust filter nobody counted that pushed it over its limit."
draft: false
---

When natural convection cannot do the job, a fan can. Pushing air through the fins at a few metres per second raises the coefficient by a factor of three or more, and the same extrusion that managed 150 W in still air can manage 250 W with a fan. But a fan does not deliver a fixed flow. It delivers whatever flow its pressure can push through everything in the air's path: the fins, the shroud, the guards, the filter and the inlet and outlet. The flow, and therefore the cooling, is set where the fan's curve meets the system's curve, and anything that adds resistance to the path moves that point.

This chapter estimates the coefficient in HS-150's shrouded channels with a published composite model, finds the pressure drop through them, matches a fan to the system, and checks the 250 W version against its budget. Its failure case is a dust filter added at installation, never counted in the design, which halved the flow as it loaded with dust and pushed the junction past its limit.

## The shrouded channel

For forced air, the fins are covered with a shroud across their tips, so that each gap becomes a closed channel and the fan's air cannot escape over the fins. For the 250 W version, a fan blows up through HS-150's 17 channels, each about 9.12 mm wide and 45 mm deep, along their 250 mm length. The total open area is about 17 × 9.12 × 45 ≈ 6,980 mm², so a flow of 0.02 m³/s moves through the channels at about 2.9 m/s.

The flow in such short, narrow channels is laminar and still developing over much of its length. Teertstra, Yovanovich and Culham developed a composite model for plate-fin channels that covers the range from developing to fully developed laminar flow, and Simons later summarised it for designers. It uses a modified channel Reynolds number based on the gap width b and the channel length L:

Re* = (V × b ÷ ν) × (b ÷ L)

and gives the Nusselt number on the gap width as:

Nu_b = [ (Re* Pr ÷ 2)⁻³ + (0.664 √Re* Pr^0.33 √(1 + 3.65 ÷ √Re*))⁻³ ]^(−1/3)

with h = Nu_b × k ÷ b. The resistance from the fins' base to the inlet air is then 1 ÷ (h × (A_base + N η_f A_fin)), and the model already allows for the air warming as it passes along the channels.

```figure
type: formula
title: The channel coefficient for HS-150 at 0.0223 m³/s
formula: Re* = (V b ÷ ν)(b ÷ L),   Nu_b = [(Re* Pr ÷ 2)⁻³ + (0.664 √Re* Pr^0.33 √(1 + 3.65 ÷ √Re*))⁻³]^(−1/3)
caption: This is an illustration with air properties at an assumed 65 °C mean film temperature (k ≈ 0.0292 W/m·K, ν ≈ 19.4 × 10⁻⁶ m²/s, Pr ≈ 0.704). The flow of 0.0223 m³/s is the design operating point found below.
- V | 0.0223 ÷ 0.006 98 ≈ 3.20 m/s in the channels
- Re* | (3.20 × 0.009 12 ÷ 19.4 × 10⁻⁶) × (0.009 12 ÷ 0.25) ≈ 54.9
- Nu_b | ≈ 5.23
- h | 5.23 × 0.0292 ÷ 0.009 12 ≈ 16.7 W/m²·K
step: η_f ≈ 0.959; effective area ≈ 0.427 m²
step: R, fin base to inlet air ≈ 1 ÷ (16.7 × 0.427) ≈ 0.140 K/W
```

A coefficient of about 16.7 W/m²·K is roughly three times the 5.0 W/m²·K of natural convection, and the resistance falls from 0.363 to about 0.140 K/W, even though radiation, which helped in still air, is now mostly blocked by the shroud.

## The pressure the fan must supply

Air flowing through the channels loses pressure to friction on the walls and to the contraction and expansion at the channels' ends. For laminar flow between parallel plates, the friction factor, on a hydraulic diameter of twice the gap, is 96 ÷ Re, so the friction loss is (96 ÷ Re) × (L ÷ 2b) × ρV² ÷ 2. The end losses are written as a loss coefficient K times the dynamic pressure ρV² ÷ 2; this illustration assumes K ≈ 1.5 for entry and exit together. At 0.02 m³/s the channels lose about 8.5 Pa; at 0.03 m³/s, about 17.6 Pa. The loss rises a little faster than in proportion to the flow, because the end losses go with V² while the laminar friction goes with V.

## The fan's curve and the operating point

A fan's performance is a curve of pressure against flow: the most pressure at zero flow, falling to zero at its free-air flow. This illustration uses a simplified straight-line curve for a 120 mm axial fan, 60 Pa at zero flow and 0.040 m³/s at zero pressure; a real fan's curve, from its maker, is curved and often has a dip at low flow that should be avoided. The system's curve is the pressure the air path needs at each flow. The fan settles where the two cross.

The air path for the 250 W version includes the channels, an inlet finger guard and a clean filter mat, together assumed to add a loss coefficient of about 3 on the channel velocity.

```figure
type: line
title: The fan's curve against the system's curves
x: Air flow, m³/s
y: Pressure, Pa
legend: Fan | Sink alone | Sink, guard and clean filter
ymin: 0
ymax: 90
caption: This is an illustration with a simplified straight-line fan curve. The operating point is where a system curve crosses the fan's: about 0.029 m³/s for the sink alone and 0.0223 m³/s with the guard and a clean filter. A heavily loaded filter's curve, far steeper, crosses at about 0.011 m³/s.
- 0 | 60.0 | 0 | 0
- 0.005 | 52.5 | 0.9 | 1.7
- 0.01 | 45.0 | 2.7 | 5.9
- 0.015 | 37.5 | 5.2 | 12.4
- 0.02 | 30.0 | 8.5 | 21.4
- 0.025 | 22.5 | 12.7 | 32.8
- 0.03 | 15.0 | 17.6 | 46.6
- 0.035 | 7.5 | 23.4 | 62.9
```

With the guard and the clean filter, the fan delivers about **0.0223 m³/s** at about 26.5 Pa. The air's useful power is only Q × Δp ≈ 0.59 W; the fan's electrical power is several times that, because small fans are inefficient. At that flow, the air warms by about 250 ÷ (1.045 × 0.0223 × 1,007) ≈ 10.6 K as it passes through the sink.

## The 250 W budget

Chapter 1 gave the 250 W version a budget of 0.20 K/W for everything from the sink's base to the air. Chapter 9's spreading model gives the base about 0.043 K/W under the fan-cooled sink. At the design operating point, the junction is about 40 + 250 × (0.14 + 0.043 + 0.140) ≈ **120.7 °C**, about 4 K inside the 125 °C limit.

## The failure case: the filter nobody counted

This is an illustration. The fan-cooled design was first sized with the sink alone in the air path, giving an operating point of about 0.029 m³/s, a sink resistance of about 0.126 K/W and a junction of about 117 °C. The guard and filter were added later, by the cabinet builder, because the drive was to be installed in a dusty workshop. Nobody recalculated. On a clean filter, the junction rose to about 121 °C, still inside the limit, and the change went unnoticed. As the filter loaded with dust over the following months, its resistance climbed. With the extra loss coefficient at about 10, the flow fell to about 0.0165 m³/s and the junction reached the 125 °C limit; at about 30, a heavily loaded filter, the flow fell to about 0.011 m³/s, half the design figure, and the junction reached about **132 °C**.

```figure
type: compare
title: The 250 W version's operating point as the air path's resistance grows
cols: Flow | Fan pressure | Sink resistance | Junction
caption: This is an illustration with the simplified fan curve, the channel model above and the spreading allowance of Chapter 9. K is the guard's and filter's added loss coefficient on the channel velocity.
- Sink alone, K = 0 | 0.029 m³/s | 16.5 Pa | 0.126 K/W | 117 °C
- *Guard and clean filter, K ≈ 3 | 0.0223 m³/s | 26.5 Pa | 0.140 K/W | 121 °C
- Filter part-loaded, K ≈ 10 | 0.0165 m³/s | 35.3 Pa | 0.159 K/W | 125 °C
- Filter heavily loaded, K ≈ 30 | 0.011 m³/s | 43.3 Pa | 0.187 K/W | 132 °C
```

The failures appeared as over-temperature trips on drives that had run without trouble when new, which pointed to something that changes in service. A pressure gauge across the filter, read during a site visit, showed the loss far above the clean figure. The correction had four parts: the filter was put into the design calculation at its loaded, not clean, resistance; a larger fan with more pressure was chosen so that the dirty-filter operating point still met the budget; a differential-pressure switch across the filter was added to warn when it needed changing; and the filter's change interval was written into the maintenance schedule. The general lesson is that a fan-cooled design is a system, and every element in the air path, guards, filters, grilles, cable bundles, belongs in the system curve at the worst condition it will reach in service.

## Air that misses the fins

The channel model assumes that all of the fan's air passes through the channels. In practice some bypasses them: through gaps between the shroud and the fin tips, around the sides of the sink, or past the fins' ends if the fan is larger than the fin field. Air takes the easiest path, and the channels, with their friction, are not the easiest. This is an illustration. If a fifth of the 0.0223 m³/s were to bypass HS-150's channels, the channel flow would fall to about 0.0178 m³/s, the sink resistance would rise to about 0.153 K/W and the junction to about 124 °C, using up most of the 4 K margin without any change to the fan or the filter.

The defences are mechanical and cheap. The shroud should sit on the fin tips with no gap, or with a gap closed by a strip of foam; the fan's outlet should be ducted to the fin field so that its air cannot spill round the sink's sides; and the fin field should be at least as wide as the fan's swept annulus. Where a sink must be cooled by a fan that also serves other parts, a baffle that divides the flow deliberately is better than hoping it divides itself well. Testing on a prototype with the real shroud and duct, Chapter 10's subject, is the only way to know how much air actually passes through the channels; a hot-wire anemometer at the channels' outlets, or the measured air temperature rise compared with the expected 10.6 K, shows it.

The fan's position also matters. A fan that blows into the channels, pushing, delivers its air in a swirling jet that can raise the coefficient near the inlet but leaves a dead zone behind its hub. A fan that draws air out of the channels, pulling, gives a more even flow through the fins but breathes air that the sink has already heated, which shortens its life. Pushing with a short plenum between fan and fins, so that the jet spreads before it enters the channels, is a common compromise.

## Fan laws and choices

The fan laws describe how a fan's curve moves with speed: flow is proportional to speed, pressure to speed squared and power to speed cubed. Running a fan 20 % slower cuts its flow by 20 %, its pressure by 36 % and its power by about half, and makes it noticeably quieter. They also explain why two fans in series roughly double the pressure available at a given flow, suiting high-resistance systems such as filtered cabinets, while two in parallel roughly double the flow at a given pressure, suiting low-resistance systems such as open heat sinks. Choosing a fan is choosing a curve that crosses the system's curve, in its worst condition, at a flow that meets the budget, on the steady part of the curve, at an acceptable noise and life. Fan life is usually the life-limiting part of a forced-air design, and it shortens with temperature; a fan placed to blow cool air into the sink, rather than draw hot air out of it, runs cooler and lasts longer.

## When the fan stops

A fan-cooled design must decide what happens when the fan fails. With the shroud on and the fan stopped, HS-150's channels still pass some natural-convection flow, but the shroud blocks the inflow through the channels' open fronts and most of the radiation, so the sink is worse than the open natural-convection design of Chapter 6, which already could not carry 250 W. The drive must therefore detect a stopped or slow fan, with a tachometer signal or a temperature sensor on the sink, and reduce its output or stop before the junction overheats. That protection is part of the thermal design, not an electrical afterthought.

## How this applies to a small Australian business

Fan-cooled heat sinks are compact and powerful, and their performance depends on the whole air path. The steps are: estimate the coefficient and resistance from the channel geometry and flow, using a published model such as Teertstra's; calculate the pressure drop through the sink and every other element in the path, including filters at their loaded resistance; plot the fan's curve from the maker's data against the system's curve; read the operating point; and check the budget at that point. Australian workshops and plant rooms are often dusty, so filtered designs need a maintenance plan and preferably a filter-condition alarm.

## Exercise: a faster fan

To restore margin with a loaded filter, a fan of the same size with twice the pressure at zero flow, 120 Pa, and the same 0.040 m³/s free-air flow is considered. With the heavily loaded filter, K ≈ 30, the system needs about 77.7 Pa at 0.015 m³/s and about 34.9 Pa at 0.010 m³/s. Estimate the new operating point by straight-line interpolation, and use the channel model's resistance of about 0.165 K/W at that flow, with the 0.043 K/W spreading allowance, to find the junction at 250 W.

**Worked answer.** The new fan's pressure is 120 × (1 − Q ÷ 0.040), which is 90 Pa at 0.010 m³/s and 75 Pa at 0.015 m³/s. The fan's surplus over the system is 90 − 34.9 = 55.1 Pa at 0.010 m³/s and 75 − 77.7 = −2.7 Pa at 0.015 m³/s. The surplus reaches zero at about 0.010 + 0.005 × 55.1 ÷ 57.8 ≈ **0.0148 m³/s**, at about 75 Pa.

At that flow the junction is about 40 + 250 × (0.14 + 0.043 + 0.165) ≈ **127 °C**, still about 2 K over the limit. Doubling the fan's pressure lifts the dirty-filter flow from about 0.011 to about 0.015 m³/s but does not restore the budget on its own. The sensible design pairs a stronger fan with a filter-condition alarm and a change interval that keeps the filter from reaching its heavily loaded state.
