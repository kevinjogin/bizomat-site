---
book: brazing-and-soldering-by-the-numbers
chapterSlug: wetting-and-capillary-flow
order: 2
title: "Wetting and capillary flow"
description: "See what wetting and the contact angle mean for a molten filler, calculate the capillary pressure and rise in a joint gap, and find why too wide a gap fails as surely as too narrow a one."
draft: false
---

Every brazed or soldered joint is filled by the same force that draws water up a narrow glass tube or into a paper towel: capillary action. It is a surface effect, arising from the balance between the attraction of the liquid's molecules for each other and their attraction for the solid. When the solid wins, the liquid spreads and is drawn into narrow spaces; when the liquid wins, it beads up and stays out. Understanding the force, and how it depends on the gap, explains most of the rules of joint design and many of the failures.

This chapter explains wetting and the contact angle, calculates the capillary pressure and rise in a joint gap with illustrative values, and shows why there is a best range of gaps, neither too narrow nor too wide.

## Surface tension

The molecules at the surface of a liquid are pulled inwards by their neighbours, because they have neighbours on only one side. The surface therefore behaves like a stretched skin, with a tension per unit length called the surface tension, measured in newtons per metre. Molten metals have much higher surface tensions than water, because the bonds between metal atoms are strong; water's surface tension at room temperature is about 0.072 N/m, while molten metals are typically of the order of 0.5 to 1.5 N/m. That high surface tension is what gives molten fillers such strong capillary pull, and also what makes them bead up into balls on a dirty or oxidised surface.

## Wetting and the contact angle

Where a liquid meets a solid surface, the edge of the liquid makes an angle with the surface, called the contact angle. If the liquid spreads, the angle is small; if it beads, the angle is large. By convention, a contact angle below 90° means the liquid wets the surface, and a contact angle near zero means it spreads freely. Above 90°, the liquid does not wet, and in a narrow gap it is pushed out rather than drawn in.

```figure
type: compare
title: What the contact angle tells you
cols: What the filler does | In a joint
caption: General behaviour. A clean, fluxed or protected metal surface at brazing temperature lets a suitable filler wet it with a small contact angle; an oxidised or contaminated surface does not.
- *Near 0° | spreads freely over the surface | drawn right through the gap
- Below 90° | wets and spreads | drawn into the gap
- About 90° | neither spreads nor beads | no capillary pull
- Above 90° | beads up, rolls off | pushed out of the gap; joint stays empty
```

Wetting depends far more on the surface than on the filler. A filler that spreads like water on clean copper at brazing temperature will ball up on the same copper covered with a film of oxide, grease or old flux residue, because the oxide, not the copper, is what the filler meets. That is why every brazing and soldering procedure begins with cleaning and why the flux, described in Chapter 5, exists: its job is to remove the oxide and keep the surface clean until the filler arrives.

## Clean at the moment of contact

Wetting is decided at the instant the filler touches the surface, and what matters is the state of the surface at that instant, not at the start of the job. A part cleaned in the morning and brazed in the afternoon may have collected fingerprints and a fresh film of oxide in between. A part cleaned and fluxed but heated slowly in air may oxidise under the flux faster than the flux can clean it. And a part heated in a furnace with a protective atmosphere stays clean only as long as the atmosphere does. The practical rules follow: clean the parts immediately before assembly, handle them with clean gloves, flux them straight away, heat them quickly to temperature, and feed the filler as soon as the joint is ready. Each rule protects the surface for the moment the filler arrives.

## Capillary pressure in a gap

In a narrow gap between two parallel surfaces, a wetting liquid forms a curved surface, a meniscus, across the gap, and the surface tension pulls the liquid along the gap with a pressure that depends on the gap width.

```figure
type: formula
title: Capillary pressure drawing filler into a parallel-sided gap
formula: Δp = 2 × γ × cos θ ÷ w
caption: This is an illustration with a surface tension of 1.0 N/m and a contact angle of 20°, typical in magnitude for a molten filler on a clean metal surface but not data for any particular filler.
- γ, surface tension | 1.0 N/m
- θ, contact angle | 20°, so cos θ ≈ 0.94
- w, gap | 0.05 mm
step: Δp = 2 × 1.0 × 0.94 ÷ 0.000 05
step: Δp ≈ 37,600 Pa, about 38 kPa
```

The pressure is inversely proportional to the gap. Halving the gap doubles the capillary pressure; a tenfold wider gap gives a tenth of the pull. At 0.05 mm, the illustrative filler is pulled in with about 38 kPa, enough to lift a column of liquid metal with a density of 9,000 kg/m³ about 0.43 m vertically. At 0.5 mm, it would lift only about 43 mm.

## How high the filler can climb

Setting the capillary pressure equal to the weight of a column of filler, Δp = ρ g h, gives the height a filler can rise in a vertical gap. This is the form in which the capillary effect matters most to a brazer, because joints are often filled from below or along a vertical socket.

```figure
type: bars
title: Capillary rise in a vertical gap for an illustrative molten filler
unit: millimetres of rise
max: 2200
caption: This is an illustration with γ = 1.0 N/m, θ = 20° and a filler density of 9,000 kg/m³, from h = 2γ cos θ ÷ (ρ g w). Real joints stop well short of these heights, because of heat, flux and surface conditions, but the trend with gap holds.
- 0.01 mm gap | 2130
- *0.05 mm gap | 426
- 0.1 mm gap | 213
- 0.2 mm gap | 106
- 0.5 mm gap | 43
```

The heights look large because the calculation assumes a perfectly clean, uniformly hot gap. In practice, the filler stops where the joint is too cold, where flux or gas is trapped, or where the surface is not clean, which is exactly the leaking manifold of Chapter 1. But the trend is real: at wide gaps, capillary force becomes too weak to hold the filler in the joint against gravity, to fill it from one side, or to push trapped flux and gas ahead of it.

## Why narrower is not always better

If capillary pressure rises as the gap narrows, why not make the gap as small as possible? Three effects work the other way.

First, the filler has to flow through the gap, and the resistance to flow in a narrow channel rises steeply as the channel narrows. For flow between parallel plates, the flow rate for a given pressure is proportional to the cube of the gap, so halving the gap cuts the flow eight-fold. The capillary pressure doubles, but the flow still slows.

Second, flux has to get in and out. In flux brazing, the molten flux enters the gap first, cleaning the surfaces, and is then displaced by the filler. In a very narrow gap, the flux cannot get in to clean the surfaces properly, or cannot be pushed out, and it stays trapped in the joint as voids and inclusions.

Third, real surfaces are not flat. A gap of a few thousandths of a millimetre is comparable to the roughness of a machined surface, so some areas touch and some are open, and the flow is uneven.

## The best range in practice

The filler makers' guidance reflects those effects. Lucas-Milhaupt, a brazing filler maker, reports a test series on stainless steel butt joints brazed with a silver filler and mineral paste flux in which the strongest joint formed at a clearance of about 0.038 mm, with strength falling at narrower clearances as the flux could not flow, and at wider ones as the joint's strength approached that of the filler itself. Its general recommendation for most materials brazed with paste or powder flux is a clearance of about 0.05 to 0.13 mm. In furnace brazing under a protective atmosphere or vacuum, with no flux to displace, the same maker recommends much smaller clearances, close to zero, for some fillers.

```figure
type: range
title: Joint clearance for flux brazing with a silver filler
unit: mm, at brazing temperature
min: 0
max: 0.3
caption: The 0.05 to 0.13 mm range is Lucas-Milhaupt's general recommendation for flux brazing; the 0.038 mm point was the strongest clearance in its stainless steel test. Other filler families, processes and the filler maker's data sheet govern each joint.
- Too tight for flux to flow | 0 | 0.05
- *Recommended for flux brazing | 0.05 | 0.13
- Wide: weaker, harder to fill | 0.13 | 0.3
```

The clearance that matters is the one at brazing temperature, not at room temperature, because the parts expand as they heat. Chapter 3 calculates how much the clearance changes for common pairs of metals.

## Flow follows heat

Capillary flow has one more property that every brazer learns by experience: the filler flows towards the hottest part of the joint. Surface tension falls and wetting improves as temperature rises, and a filler that reaches a cooler region partly solidifies and stops. A joint heated evenly fills evenly; a joint heated on one side fills on that side. The brazer uses this deliberately, heating the far side of a joint so that filler fed at the near side is drawn through, and heating heavy parts before light ones so that the whole joint reaches temperature together.

## Gravity and joint orientation

Gravity matters less than intuition suggests at small gaps, because the capillary pressure in a well-made joint far exceeds the weight of filler in it. At 0.05 mm, the illustrative filler can climb about 0.43 m, so a socket joint 20 mm deep fills just as well upwards, downwards or sideways. At wider gaps, gravity starts to win: filler sags out of the bottom of horizontal joints and runs out of the bottom of vertical ones. The workshop rule that a socket joint brazed upwards needs a closer fit than one brazed downwards follows directly from the arithmetic.

## Filling time

Capillary filling is fast when conditions are right. A simple model for a liquid drawn into a parallel gap, ignoring heat and flux, gives a filling time proportional to the viscosity and to the square of the distance, and inversely proportional to the gap and the surface tension. This is an illustration. With a viscosity of about 0.003 Pa·s, typical in order of magnitude for molten metals, a filler would run 25 mm into a 0.05 mm gap in about 0.1 s, and into a 0.01 mm gap in about 0.6 s.

Real joints take longer, because the time is set mainly by how quickly the joint reaches temperature and the flux does its work, not by the flow. But the calculation explains a familiar sight: once a joint is at temperature, the filler disappears into it almost instantly, and if it does not, the problem is heat or cleanliness, not time.

## What the fillet says

The small fillet of filler at the edge of a joint is a useful sign, read correctly. A smooth, concave fillet that blends into both parts at a small angle shows that the filler wetted both surfaces at the edge. A fillet that stands proud, with a sharp line where it meets the part, or that has pulled back from one surface, shows poor wetting there. But the fillet says nothing certain about the inside of the joint, as the leaking manifold of Chapter 1 showed, and a large fillet is not a strong joint: it is excess filler, which adds cost and weight and can hide a joint that is empty inside. Filler makers' guidance generally favours a small, even fillet and enough filler to fill the gap, calculated from the joint's volume, rather than as much filler as the joint will take.

## Wetting in soldering

The same physics governs soldering, at lower temperatures. A solder wets clean, fluxed copper readily and is drawn into the hole of a plated circuit board or the socket of a copper plumbing fitting by capillary action. A solder joint that balls up and stays on the surface, rather than spreading, is a wetting failure: the surface was oxidised or contaminated, the flux was exhausted, or the joint was too cold. Hart's 1910 instruction to tin a soldering bit, coating its point with solder so that it would draw the solder with it, was a way of making sure the tool itself was wetted.

## A failure: the bead that would not run

This is an illustration. A brazer re-tipping a carbide tool found that the silver filler balled up on the steel shank and would not run under the carbide insert, however long the joint was heated. The flux had turned dark and glassy, and the shank around the joint was heavily discoloured.

The joint had been heated too long and too hot before the filler was applied, and the flux had been exhausted: it had dissolved all the oxide it could and then stopped protecting the surface, which oxidised again. On an oxidised surface the contact angle was large and the filler beaded. The brazer cleaned the parts, applied fresh flux, heated the joint quickly to temperature and fed the filler as soon as the flux turned clear and fluid, and the filler ran under the insert at once. Chapter 5 explains the flux's working range and why overheating exhausts it.

## Exercise: how much capillary pull?

Using the illustrative values in this chapter (γ = 1.0 N/m, θ = 20°, ρ = 9,000 kg/m³), calculate the capillary pressure and the rise in a vertical gap of 0.1 mm and of 0.3 mm. Then say which gap would better fill a vertical socket joint 25 mm deep from the bottom.

At 0.1 mm, Δp = 2 × 1.0 × 0.94 ÷ 0.0001 ≈ **18.8 kPa**, and the rise h = Δp ÷ (ρ g) ≈ 18,800 ÷ (9,000 × 9.81) ≈ **0.21 m**. At 0.3 mm, Δp ≈ **6.3 kPa** and h ≈ **0.071 m**, about 71 mm.

Both gaps could in principle lift the filler more than 25 mm, but the 0.1 mm gap has three times the margin, which is what fills the joint when the real conditions, a slightly cooler region, a little trapped flux, an imperfect surface, take away much of the theoretical pull. The 0.1 mm gap is also within the filler maker's recommended range for flux brazing, while 0.3 mm is outside it. The narrower gap is the better choice.
