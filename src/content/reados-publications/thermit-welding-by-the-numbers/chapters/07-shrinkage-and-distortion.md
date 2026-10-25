---
book: thermit-welding-by-the-numbers
chapterSlug: shrinkage-and-distortion
order: 7
title: "Shrinkage, gap and distortion"
description: "Estimate how much a thermit weld and its heated parts shorten as they cool, why that matters in a closed frame, and how the parts are spread or the opposite member heated to compensate."
draft: false
---

Steel shrinks as it cools, and a thermit weld cools a long way. The poured iron contracts as it freezes and again as the solid weld cools to room temperature, and the parts on either side, preheated to red heat, contract as well. If the parts are free to move, the joint simply ends up a few millimetres shorter than it started. If they are not, because the member is part of a closed frame or a continuous rail, that shortening becomes stress, and the stress can crack the weld, the parts or something else in the structure.

Viall described in 1921 how welders allowed for this: by setting the parts apart beforehand, by forcing them apart with a jack, or by heating an opposite member so that everything contracted together. This chapter puts numbers on the shrinkage of the crusher-frame weld and on each of those remedies.

## Three kinds of shrinkage

A casting shrinks in three stages, and a thermit weld is a casting:

1. **Liquid shrinkage**: the liquid iron contracts as it cools from its pouring temperature to its freezing point.
2. **Solidification shrinkage**: the iron contracts as it changes from liquid to solid.
3. **Solid contraction**: the solid weld contracts as it cools from its freezing point to room temperature.

The first two are volume changes while the metal is still partly liquid, and they are fed by the riser (Chapter 5): liquid metal from the riser flows down into the weld as it shrinks, so any cavity forms in the riser, which is cut off. The third happens after the weld is solid and cannot be fed. It changes the dimensions of the weld and, with the contraction of the heated parts, the length of the joint.

## How much the crusher-frame joint shortens

This is an illustration. Two sources of shortening add up along the crusher-frame member.

**The weld metal.** Pattern-makers commonly allow about 2% linear contraction for steel castings cooling from solidification to room temperature. Applied to the 25 mm of weld metal in the gap, that is about 25 × 0.02 = **0.5 mm**.

**The heated parts.** The member was preheated to about 900 °C for 150 mm on each side of the gap (Chapter 6), and the pour adds more heat near the joint. When the weld has frozen, the heated length is hot, with a temperature falling away from the joint. Taking a heated length of 300 mm at an average of about 600 °C above room temperature when the weld becomes solid enough to transmit load, and a coefficient of expansion of about 12 × 10⁻⁶ per °C, the parts contract by about 300 × 12 × 10⁻⁶ × 600 ≈ **2.2 mm** as they cool.

Together, the joint shortens by about **2.7 mm** if it is free to do so.

```figure
type: formula
title: Free shortening of the crusher-frame joint as it cools
formula: ΔL = L_weld × s + L_heated × α × ΔT_average
caption: This is an illustration. The 2% solid contraction is a common pattern-maker's allowance for steel castings; the average temperature of the heated length when the weld becomes load-bearing is an assumption.
- L_weld, s | weld metal in the gap, 25 mm; solid contraction about 2%
- L_heated | heated length of member, 300 mm
- α | coefficient of expansion, about 12 × 10⁻⁶ per °C
- ΔT_average | average temperature above ambient, about 600 °C
step: weld metal: 25 × 0.02 = 0.5 mm
step: heated parts: 300 × 12 × 10⁻⁶ × 600 ≈ 2.2 mm
step: total free shortening ≈ 2.7 mm
```

The weld metal's own contraction is the smaller part. Most of the shortening comes from the heated parts cooling, which is why the preheat length and temperature matter to distortion as well as to fusion.

## Why a closed frame cannot simply shorten

The crusher's side frame is a closed shape: the cracked tension member is one side of a frame whose other members do not shorten, because they were not heated. When the repaired member tries to shorten by 2.7 mm, the rest of the frame holds it at its original length. The member is then stretched by the amount it wants to shorten, and the stretch produces stress.

[Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/expansion-restraint-and-cracking/) calculates restrained thermal stress as E × α × ΔT. A strain of 2.7 mm over the 300 mm heated length is about 0.009, which, multiplied by a modulus of about 200 GPa, would correspond to some 1,800 MPa if the steel stayed elastic. No steel can carry that: the weld and the heated zone yield instead, and are left with a residual tensile stress around the yield strength once they cool. In a sound, ductile weld that may be tolerable; in a weld with any defect, or in a cast steel with limited ductility, it is the recipe for a crack. The stress also loads the rest of the frame, and a crack can appear somewhere else entirely, at the weakest corner or section.

## Viall's three remedies

Viall's instructions for heavy thermit welds, written mainly for locomotive frames, gave three ways of allowing for contraction.

**Set the parts apart.** Before the weld, the parts are set away from each other by a little more than the final gap, by an amount that makes up for the contraction of the thermit steel and the adjacent parts. Viall said the amount should vary with the size of the weld, and the estimate above is the modern way of choosing it: a bigger weld, a longer heated length or a hotter preheat all mean more shortening to allow for.

**Force them apart.** Where the parts cannot simply be set apart, because they are part of a frame, they are pushed apart with a jack or a similar device, so that the member is held stretched while the weld is made. As the weld cools and shortens, the jack is released and the member returns towards its original length instead of being pulled short.

**Heat the opposite member.** In a frame where jacking is not practical, such as a double-barred locomotive frame, an opposite, unbroken member is heated at the same time, with a second burner, so that it expands and opens the gap. As the weld cools, the opposite member cools too, and the two contract together, with far less stress than if only the repaired member shrank.

```figure
type: compare
title: Allowing for 2.7 mm of shortening in the crusher frame
cols: How it works | What it needs
caption: This is an illustration of the three approaches Viall described, applied to the crusher frame. The contractor and the engineer choose between them for the actual frame.
- Set apart | gap opened by the expected shortening before welding | parts free to move; not possible in a closed frame
- *Jack apart | member held stretched about 2.7 mm during welding and cooling | a safe jacking point and a known jack force
- Heat opposite member | opposite member expanded by heating, contracts with the weld | an accessible opposite member and controlled heating
```

## Heating the opposite member: how hot?

This is an illustration. Suppose the crusher frame's opposite member, parallel to the cracked one, is 1,200 mm long between its connections. To open the frame by the 2.7 mm the weld will shorten, the opposite member must expand by about that much. At 12 × 10⁻⁶ per °C, the temperature rise needed along its whole length is about 2.7 ÷ (1,200 × 12 × 10⁻⁶) ≈ **190 °C**.

That is a moderate temperature, easily reached with burners, and it would be held during the weld and allowed to fall as the weld cools. It also has to be applied evenly: an opposite member heated hotter on one face would bow. The engineer noted that the opposite member on the crusher frame carries bearings for the swing jaw's pitman, which must be protected from the heat, so jacking was the more likely choice for this frame.

## Jacking the crusher frame

For jacking, the contractor would place a hydraulic jack across the frame, bearing on sound, stiff sections near the cracked member, and open the gap by about 2.7 mm more than the design gap before building the mould, with the opening measured by a gauge across the gap. The jack must be protected from the heat of the pour and the preheat, and its pressure monitored. After the weld has cooled to the temperature the procedure sets, the jack is released gradually, and the frame's dimensions are measured and compared with readings taken before the crack was cut out.

The engineer added two items to the plan: reference marks on the frame, measured before any cutting, so that the frame could be checked afterwards; and an inspection of the other frame members' corners for cracks after the repair, because any residual stress in a closed frame finds its weakest point.

## One contraction or many

Viall saw thermit's single, bulk pour as an advantage on heavy work: the steel was produced and introduced into the weld quickly and in bulk, resulting in one contraction throughout the whole mass, for which provision could always be made. The contrast is with a heavy repair built up by arc or gas welding in many runs. Each run heats, expands, cools and shrinks a little, locking in a little more stress and distortion before the next run starts, and the pattern of stress after dozens of runs is hard to predict. A thermit weld shrinks once, as a whole, so its shrinkage can be estimated, as above, and compensated in one step.

That advantage depends on the weld cooling evenly. A collar that is much thicker on one side than the other, or a joint preheated unevenly, cools unevenly, and the side that cools last pulls the joint towards it, bending the member. A shaft repaired with a lopsided collar can end up bent; a rail welded with one side of the head hotter than the other can be left with a kink that must be ground or straightened. Even collars and even preheat are therefore distortion controls as well as fusion controls.

## Where the shrinkage cavity goes

The liquid and solidification shrinkage, fed from the riser, must end up somewhere. If the riser does its job, the last metal to freeze is in the riser, and the shrinkage shows as a funnel-shaped cavity, called a pipe, in the top of the riser, which is cut off and discarded. If the riser freezes too early, or the path from the riser to the weld freezes first, the last metal to freeze is inside the weld, often along its centre, and the shrinkage appears there as a cavity or as scattered porosity. That is invisible from outside and is one of the defects ultrasonic testing is used to find (Chapter 10). The riser sizing in Chapter 5 and the rule that the riser be generous are the defences against it.

## Rails: a continuous structure

A continuous welded rail is an extreme case of restraint: a long rail fastened to sleepers cannot shorten freely at a weld. Rail welding therefore deals with shrinkage and with the much larger thermal stresses that come from daily and seasonal temperature changes. A rail fully restrained against a temperature change ΔT carries a stress of about E × α × ΔT; with E about 200 GPa and α about 11.5 × 10⁻⁶ per °C, a 40 °C change corresponds to about 92 MPa. Rail infrastructure managers set rules for the rail temperature at which rails are welded and fastened, and for the use of tensioning equipment to set the stress-free length when rails are joined. Those rules belong to the rail safety framework, not to the weld alone, and Chapter 9 returns to them.

## A failure: the crack at the other corner

This is an illustration. Among the contractor's records was the repair of a cast steel frame member on a large press. The weld itself was sound by ultrasonic testing, but a few weeks after the press returned to service, a crack appeared at an inside corner of the frame on the opposite side of the window from the repair.

The investigation concluded that the repaired member had been welded in the frame without jacking or heating the opposite side. The weld and its heated zone had shortened as they cooled, the closed frame had resisted, and the residual stress, added to the press's working loads, had concentrated at the sharpest inside corner, where the casting had a small pre-existing flaw. The corner crack was repaired by an approved procedure, and the contractor's procedure for welds in closed frames was changed to require a shrinkage estimate like the one in this chapter, a compensation method, frame reference measurements before and after, and crack inspection of the frame's corners after the repair.

## Exercise: a longer opposite member

On a larger crusher, the opposite member is 1,800 mm long and the estimated shortening of the weld is 3.0 mm. Calculate the uniform temperature rise of the opposite member needed to open the frame by that amount. Then calculate the free shortening if the repaired member's heated length is 400 mm at an average of 600 °C above ambient, with a 30 mm gap and 2% weld contraction.

For the opposite member, ΔT = 3.0 ÷ (1,800 × 12 × 10⁻⁶) ≈ **139 °C**. A longer opposite member needs less temperature rise for the same opening.

For the repaired member, the weld metal contributes 30 × 0.02 = 0.6 mm and the heated parts 400 × 12 × 10⁻⁶ × 600 ≈ 2.9 mm, a total of about **3.5 mm**, more than the 3.0 mm estimate the exercise started with. The difference shows how sensitive the estimate is to the heated length and temperature, and why the contractor's estimate, the jack opening and the before-and-after measurements should all be recorded and compared.
