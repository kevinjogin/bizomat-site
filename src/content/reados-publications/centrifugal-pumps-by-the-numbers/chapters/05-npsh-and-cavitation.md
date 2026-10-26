---
book: centrifugal-pumps-by-the-numbers
chapterSlug: npsh-and-cavitation
order: 5
title: "NPSH and cavitation"
description: "Cavitation, NPSH available and required, TP-3's 4.0 m margin and what altitude, hot water and a clogged foot valve take from it, and a pump moved up a plinth that began to cavitate."
draft: false
---

At the eye of an impeller, where the liquid first meets the vanes, the pressure is lower than anywhere else in a pump. If it falls to the liquid's vapour pressure, the liquid boils there, in small bubbles of vapour, even though the liquid is cold. The bubbles are swept into the impeller, where the pressure rises, and they collapse, violently, as tiny implosions that hammer the vane surfaces. That is **cavitation**. It sounds like gravel in the pump, it destroys the pump's head and efficiency, and over months it eats holes in the impeller.

This chapter sets out cavitation and the two quantities that decide whether it happens: the net positive suction head the system makes available, and the net positive suction head the pump requires. It works out TP-3's margin, shows what altitude, hot water, a clogged foot valve and a higher mounting do to it, and ends with a pump moved up a plinth.

## Net positive suction head available

The system's side of the question is the **net positive suction head available**, NPSHa: how far the total head at the pump's suction is above the liquid's vapour pressure, expressed in metres of the liquid. For a pump drawing from an open sump below it,

NPSHa = (p_atm − p_v) ÷ ρg − z_lift − h_suction,

where p_atm is the atmospheric pressure on the sump's surface, p_v the liquid's vapour pressure at its temperature, z_lift the height of the pump's centreline above the sump's surface, and h_suction the losses in the suction pipe, foot valve and strainer.

```figure
type: formula
title: TP-3's NPSH available with the sump low
formula: NPSHa = (p_atm − p_v) ÷ ρg − z_lift − h_suction
caption: This is an illustration at 13.17 L/s, sea level and water at 20 °C. Vapour pressure from public property data.
- p_atm | Atmospheric pressure, 101.3 kPa: 10.35 m of water at 20 °C
- p_v | Vapour pressure of water at 20 °C, 2.34 kPa: 0.24 m
- z_lift | Pump centreline above the sump's low level, 2.0 m
- h_suction | Suction pipe, elbow, foot valve and strainer at 13.17 L/s, 0.51 m
step: NPSHa = 10.35 − 0.24 − 2.0 − 0.51 = 7.60 m
```

Every term is something the system's designer or operator controls. The atmosphere sets the starting point, about 10.35 m of cold water at sea level. The liquid's temperature sets the vapour pressure, which rises steeply as the liquid warms. The pump's height above the liquid and the suction pipe's losses take the rest.

## Net positive suction head required

The pump's side is the **net positive suction head required**, NPSHr, sometimes written NPSH3. It is found by test: the pump is run at a fixed flow while the suction pressure is lowered step by step, and NPSHr is the value at which the pump's head has fallen by 3%, a sign that cavitation is well established. It rises with flow, because the faster the liquid enters the impeller's eye, the lower the pressure there.

TP-3's illustrative data sheet gives NPSHr = 1.5 + 0.012 × Q², with Q in L/s: 3.23 m at 12 L/s and **3.58 m** at its operating point of 13.17 L/s.

Because NPSHr is defined at a 3% head drop, a pump running exactly at NPSHa = NPSHr is already cavitating, enough to cost it head and to damage it over time. NPSHa must exceed NPSHr by a margin, and the pump's maker or a recognised guideline sets that margin for the pump's type and service. This is an illustration: the plant's own rule is that NPSHa must be at least 1.5 times NPSHr and at least 1.0 m above it, whichever is larger.

## TP-3's margin

With the sump low, TP-3 has 7.60 m available against 3.58 m required, a margin of **4.02 m** and a ratio of 2.12. With the sump high, it has 9.05 m against 3.81 m at its higher flow. Either way, it is comfortably inside the plant's rule, with room to spare.

The margin's size is the point of the rest of this chapter: it is spent, quickly, by things that seem unrelated to the pump.

## What spends the margin

```figure
type: compare
title: TP-3's NPSH margin under changed conditions
rowhead: Condition
cols: NPSH available, m | NPSH required, m | Margin, m | Ratio
caption: This is an illustration at the operating point's flow unless stated. Each line changes one thing from the base case; the last combines two.
- * Base: sea level, 20 °C, sump low | 7.60 | 3.58 | 4.02 | 2.12
- Washwater at 60 °C | 5.94 | 3.58 | 2.36 | 1.66
- Plant at 600 m altitude | 6.89 | 3.58 | 3.30 | 1.92
- Foot valve clogged, K = 30, at 11.89 L/s | 5.13 | 3.20 | 1.93 | 1.60
- Pump 3 m higher, lift 5.0 m | 4.60 | 3.58 | 1.02 | 1.28
- Pump 4 m higher and water at 60 °C | 1.94 | 3.58 | −1.64 | 0.54
```

- **Hot water.** At 60 °C, water's vapour pressure is 19.9 kPa, 2.07 m of head, instead of 0.24 m. That alone costs 1.66 m of margin, and it is the commonest cause of cavitation in plants that sometimes pump warm liquid.
- **Altitude.** At 600 m above sea level, the atmosphere's pressure is about 94.3 kPa, 0.71 m less head than at sea level. A pump selected for a coastal site loses that much margin inland.
- **A clogged foot valve.** Its extra loss comes straight off NPSHa; the flow it reduces lowers NPSHr a little, but not enough to compensate.
- **Height.** Every metre the pump stands above the sump's surface takes a metre of margin.

## Measuring NPSH available on site

NPSHa can be measured as well as calculated, from the suction gauge. Converted to absolute pressure and to head, and with the velocity head at the gauge's tapping added, the suction gauge gives the total head at the pump's inlet; subtracting the vapour pressure's head gives NPSHa directly:

NPSHa = (p_suction,abs ÷ ρg) + v_s² ÷ 2g − p_v ÷ ρg.

For TP-3 at 13.17 L/s with the sump low, Chapter 1's suction gauge read −28.0 kPa, which is 101.3 − 28.0 = 73.3 kPa absolute, a head of 7.49 m. Adding the inlet's velocity head of 0.35 m and subtracting the vapour pressure's 0.24 m gives **7.60 m**, the same as the calculation. A measured NPSHa that falls over time, at the same sump level and flow, means a strainer or foot valve is clogging, and it is a better warning than waiting for the noise.

The measurement needs an accurate gauge that reads below zero, a compound gauge, or an absolute-pressure transducer, and the barometric pressure on the day if the gauge reads gauge pressure.

## Air or cavitation?

Air drawn into the suction and cavitation sound and behave similarly: both make noise, both reduce flow, both make the pump's readings unsteady. They are told apart by their causes and a simple test. Cavitation depends on NPSHa: it worsens as the sump falls, the water warms or the flow rises, and it is cured by raising the suction pressure. Air depends on leaks and vortices: it worsens as the sump falls too, because the suction pipe's entrance is less submerged, but it also appears with a full sump if a joint on the suction leaks, and it shows as bubbles at the discharge or a gauge that flickers.

A drop of thick grease or shaving foam brushed over each suction joint while the pump runs is an old and effective leak test: the foam is sucked in at a leak. And a calculation of NPSHa that shows a generous margin points away from cavitation and towards air.

## Cavitation at low flow

NPSHr curves are measured near and beyond the best efficiency point. Well to the left of it, at low flows, many pumps suffer a different kind of trouble. The liquid entering the impeller's eye no longer meets the vanes at the right angle, and some of it swirls back out of the eye into the suction pipe, a **recirculation**. The swirling creates low-pressure cores where cavitation can occur even with plenty of NPSHa, with damage on the vanes' pressure sides rather than their undersides. It is one of the reasons Chapter 3 kept TP-3's operation inside its preferred range, and one of the reasons Chapter 9 sets a minimum flow.

## What cavitation does

Cavitation's effects grow in stages. At first, small bubbles form and collapse near the vanes' leading edges with no measurable loss of head, but they erode the metal there, and the damage builds up over months. As NPSHa falls further, the bubbles grow and begin to block the impeller's passages: the head and flow fall, the pump gets noisy, with a crackle or gravel sound, and vibration rises. At the extreme, the vapour fills the eye, the pump loses its prime, and it delivers almost nothing.

The damage appears as pitting on the vanes' undersides, near their inlet edges, often like a coarse sponge. An impeller with that pattern has been cavitating, and replacing it without fixing the suction will produce another like it.

## Flooded suctions and closed vessels

A pump below its source tank has a **flooded suction**: the liquid's level above the pump adds to NPSHa instead of subtracting from it, and the same formula applies with the height entered as a positive head. Pumps on flooded suctions rarely cavitate on cold water.

The exception is a pump drawing from a closed vessel in which the liquid is at its boiling point: a condensate receiver, a deaerator, a vessel of liquefied gas. There, the pressure on the liquid's surface is its vapour pressure, so the first term of the formula, (p_surface − p_v) ÷ ρg, is zero. All of the NPSHa must come from the height of the liquid above the pump, less the suction's losses. That is why boiler feed pumps sit at the bottom of the plant, several metres below their deaerators, and why their suction pipes are short, large and simple. A few centimetres of extra suction loss, unnoticed on a cold-water pump, can make such a pump cavitate.

## Raising NPSH available

When the margin is too small, the remedies are on the system's side, in order of how much they usually achieve:

1. **Lower the pump** relative to the liquid, or raise the liquid. A submersible pump or a flooded suction removes the lift entirely.
2. **Cool the liquid**, or pump it from a point before it is heated.
3. **Reduce suction losses**: a larger suction pipe, fewer fittings, a clean strainer with a large screen area, and no throttling valve on the suction.
4. **Pressurise the source**, where the liquid is in a closed vessel.

And on the pump's side, a pump with a lower NPSHr at the duty, which often means a larger, slower pump or one with a special inlet. Reducing the flow lowers NPSHr too, which is one reason a pump that cavitates at run-out may be quiet at its design point.

## The error: a pump moved up a plinth

This is an illustration. During a floor upgrade around the sump, TP-3's pump and motor were remounted on a new plinth 4 m higher, to keep them clear of wash-down water, with its suction pipe lengthened to suit. The discharge pipe was shortened by the same height, so the system's static head and the operating point did not change. The same year, the plant began a hot wash cycle that sent washwater at about 60 °C to the sump for part of each day.

With the pump 6.0 m above the sump's low level and the water at 60 °C, NPSHa fell to about **1.94 m**, against an NPSHr of 3.58 m. The pump cavitated heavily whenever hot water reached the sump. Operators reported a noise like gravel and the header tank filling slowly in the afternoons, and within four months the impeller's vanes were pitted.

It was found when the impeller was replaced and the old one showed the classic cavitation pattern. The fix was to move the pump back down on a raised, drained plinth only 0.5 m above its original position, and to add a cooling step so that the hot wash cycle's water reached the sump below 40 °C. The plant's change procedure now includes an NPSH check for any change to a pump's height, a liquid's temperature or a suction pipe. The check takes a few minutes with the formula above, and two of the people involved in the floor upgrade said afterwards that they had not known a pump's height could matter so much. The impeller, the downtime and the hot wash cycle's redesign cost far more than the check would have.

```figure
type: bars
title: TP-3's NPSH available against required
unit: m
max: 8
caption: This is an illustration at 13.17 L/s. Raising the pump by 4 m and heating the water to 60 °C took NPSH available below NPSH required.
- * Base, available | 7.60
- Required | 3.58
- Raised 4 m with 60 °C water, available | 1.94
```

## Exercise: how high can TP-3 be mounted?

With water at 20 °C, at sea level and with a clean foot valve, the suction losses at 13.17 L/s are 0.51 m. Using the plant's rule that NPSHa must be at least 1.5 times NPSHr, what is the greatest height of the pump's centreline above the sump's low level?

**Worked answer.**

- NPSHr at 13.17 L/s is 3.58 m, so NPSHa must be at least 1.5 × 3.58 = 5.37 m; the rule's other limit, 3.58 + 1.0 = 4.58 m, is smaller, so 5.37 m governs.
- NPSHa = 10.35 − 0.24 − z_lift − 0.51 = 9.60 − z_lift.
- Setting 9.60 − z_lift = 5.37 gives z_lift = **4.23 m**.

TP-3's actual lift of 2.0 m leaves about 2.2 m of height in reserve on cold water. With water at 60 °C, the reserve shrinks to about 0.6 m, which is why the hot wash cycle and the higher plinth together were too much.
