---
book: laser-processing-by-the-numbers
chapterSlug: heat-flow-and-hardened-cut-edges
order: 5
title: "Heat flow, interaction time and hardened cut edges"
description: "How interaction time and heat conduction set the power density a cut needs and the width of the heated zone, and how to find and avoid hardened laser-cut edges in steel."
draft: false
---

A laser is a surface heat source, and everything below the surface is heated by conduction. The time the beam spends over any point, the interaction time, decides how far that heat travels before the beam moves on. A short interaction time keeps the heat close to the cut and makes a narrow heated zone; it also means the metal beside the kerf cools almost as fast as it was heated. In steel, heating above the transformation temperature followed by very fast cooling is a recipe for hardening, and a hardened cut edge can break taps, crack in a bend or chip under a punch.

This chapter shows how interaction time and conduction set the power density a cut needs and the width of the zone it affects, then follows a tapping problem on the cell's 6 mm steel brackets from broken taps to a hardness traverse and a change to the drawing.

## Interaction time and diffusion length

The interaction time of a moving beam is the spot diameter divided by the speed. In that time, heat conducted from the surface spreads a distance of the order of the diffusion length, the square root of the thermal diffusivity times the time.

```figure
type: formula
title: Interaction time, diffusion length and the flux needed to reach melting
formula: tᵢ = d ÷ v
formula: Diffusion length ≈ √(α tᵢ),   α = k ÷ (ρ c)
formula: Surface rise under a uniform absorbed flux q switched on at time zero: ΔT = 2q √(α t ÷ π) ÷ k
formula: Flux to reach the melting rise in tᵢ: q = ΔT k √π ÷ (2 √(α tᵢ))
caption: d is the spot diameter and v the speed. The surface-rise relation is for a thick body heated uniformly over its surface with no losses; it is used here as an order-of-magnitude guide for the time the beam dwells over a point.
- tᵢ | interaction time, s
- α | thermal diffusivity, m²/s
- k, ρ, c | thermal conductivity, density and specific heat
- q | absorbed power per unit area, W/m²
```

For the cell's two main steel cuts, the numbers are as follows.

```figure
type: compare
title: Interaction time, diffusion length and the absorbed flux needed to start melting
cols: Speed | Interaction time | Diffusion length | Absorbed flux to melt the surface | Incident at A = 0.35
rowhead: Cut
- 1.5 mm stainless door, N₂, 0.2 mm spot | 24 m/min | 0.50 ms | 0.045 mm | 45,100 W/cm² | 129,000 W/cm²
- 6 mm grade 350 bracket, O₂, 0.3 mm effective spot | 2.6 m/min | 6.9 ms | 0.31 mm | 21,400 W/cm² | 61,200 W/cm²
caption: This is an illustration. Stainless steel: k 16 W/(m·K), ρ 7,900 kg/m³, c 500 J/(kg·K), melting rise 1,430 K. Mild steel: k 50, ρ 7,850, c 470, melting rise 1,480 K. Room-temperature properties.
```

Two conclusions follow. First, the power density needed merely to start melting the surface within the interaction time is of the order of 10⁵ W/cm², about a hundredth of the 1.27 × 10⁷ W/cm² the LC-4 delivers. Surface heating is not the limit. The rest of the power density goes into melting through the whole thickness quickly and keeping up with the speed, and the cut is limited by how fast the melt can be produced through the thickness and blown out, which Chapter 6 treats as an energy balance. Second, the diffusion length shows how wide the heated zone beside the kerf will be: about 0.05 mm for the fast stainless cut and about 0.3 mm for the slow oxygen cut in thick steel. The slower the cut, the wider the band of metal that gets hot.

## What happens to the metal beside the kerf

The metal beside a laser cut goes through a rapid thermal cycle: it is heated in a few milliseconds to temperatures that fall from the melting point at the kerf wall to near room temperature a fraction of a millimetre away, and then cooled almost as quickly, because the cold sheet around it draws the heat away. This self-quenching needs no quench tank; the sheet itself is the quench.

What the cycle does depends on the metal.

```figure
type: compare
title: Effect of the laser cut's thermal cycle on the cell's materials
cols: What happens at the edge | Practical effect
rowhead: Material
- Carbon and low-alloy steel | Heated above the transformation range, then self-quenched; can form hard martensite | Hard edge: taps break, bends crack at the edge, punched features chip
- Austenitic stainless steel 304 | No hardening transformation; with nitrogen assist, a bright edge with a very thin altered layer | Edge usually fit for welding and forming; with oxygen or air, an oxide film
- Aluminium 5052 | Not heat-treatable; thin recast layer at the edge | Little change in strength; dross on the bottom edge if gas is wrong
- Heat-treated aluminium alloys | A narrow band may be softened by overageing | Rarely significant for sheet; check for highly stressed edges
caption: General behaviour, not a substitute for testing a particular alloy and process.
```

How hard a steel edge becomes depends mainly on its carbon content and its hardenability: the readiness of the steel to form martensite rather than softer structures as it cools. Hardenability rises with carbon and with alloying elements such as manganese, chromium, molybdenum and nickel. The carbon equivalent combines the effect of all of them into one number. It was devised for welding, whose heat-affected zone goes through a similar heating and fast cooling, and it serves equally well as a warning for laser-cut edges.

### How fast the edge cools

The same diffusion relation, turned round, estimates how quickly the heated band cools. A band about L = 0.3 mm wide gives up its heat to the cold plate in a time of the order of L² ÷ α = (0.3 × 10⁻³)² ÷ 1.36 × 10⁻⁵ = 6.6 ms. If the band falls from about 800 °C to 500 °C in a few milliseconds, say 5 ms, its average cooling rate over that range is about 300 ÷ 0.005 = 60,000 K/s. For comparison, the arc weld on 3 mm steel in Chapter 8 takes about 16 s to cool over the same range, an average of under 20 K/s. Welding procedures for this steel are designed around cooling times of several seconds precisely to avoid hard heat-affected zones; a laser-cut edge cools thousands of times faster. These are order-of-magnitude estimates, but the conclusion is robust: on any steel hardenable enough to need care in welding, a laser-cut edge should be assumed hard until a traverse shows otherwise.

## The mistake: broken taps in the brackets

The cell's 6 mm mounting brackets are cut from grade 350 structural steel plate with oxygen assist. Each bracket has four M8 tapped holes, which the original program cut directly at the 6.8 mm tap drill size so that the fitters could tap them straight off the machine. In the first production batch, the fitters broke three taps in forty brackets and reported that the holes "felt like they were case hardened".

The quality engineer first checked the steel. The mill certificate gave carbon 0.20%, manganese 1.40%, silicon 0.40%, chromium 0.10%, molybdenum 0.02%, vanadium 0.01%, nickel 0.10% and copper 0.15%. The BIZOMAT [carbon equivalent tool](/tools/carbon-equivalent/) gave CE (IIW) = 0.476 and Pcm = 0.300, in the band of about 0.40 to 0.60 where the tool's guidance is that preheat and low-hydrogen practice are usually needed for welding. The tool also notes that Pcm is intended for steels with no more than 0.18% carbon, so the CE is the more appropriate figure here. A steel with that carbon equivalent can form hard martensite when it is cooled quickly from above its transformation range, which is exactly what the edge of a laser-cut hole experiences.

Small holes make it worse. On a 6.8 mm hole the machine slows sharply to follow the tight contour, the interaction time rises, and the heat from the start and the whole circumference accumulates in a small volume of metal, which is then quenched by the plate around it.

### The hardness traverse

The engineer sectioned a hole through its centre, polished the section and made a Vickers microhardness traverse at 0.5 kgf (HV0.5) from the cut edge into the plate. Indentations close to an edge must be far enough from it, and from each other, for the surrounding metal to support them. The cell's rules are at least 2.5 indentation diagonals from the edge and 3 diagonals between indentation centres, so to get readings every 0.1 mm the traverse was staggered in a zig-zag, with neighbouring indentations offset sideways so that their centres were more than three diagonals apart.

The first indentation was placed 0.08 mm from the edge. Its diagonals were 0.0490 and 0.0497 mm. The [Vickers test check tool](/tools/vickers-test-check/) gave a mean diagonal of 0.0494 mm and 381 HV0.5, but reported TEST NOT VALID: the edge distance needed for that diagonal is 2.5 × 0.0494 = 0.12 mm, and 0.08 mm is too close. The edge would have let the indentation spread, so the reading could not be trusted. The engineer repeated it at 0.15 mm from the edge, with the same diagonals, and this time all the validity checks passed: edge distance 0.15 mm against 0.12 mm, spacing 0.20 mm against 0.15 mm, diagonals differing by 1.42% against 5%. The result, 381 HV0.5, failed the cell's limit of 250 HV for edges that are to be tapped.

```figure
type: line
title: Hardness traverse from the edge of a laser-cut 6.8 mm hole in 6 mm grade 350 plate, HV0.5
x: Distance from the cut edge, mm
y: Hardness, HV0.5
caption: This is an illustration. Staggered traverse; the first valid reading at 0.15 mm. Hardness falls to the base metal's 160 HV by about 0.6 mm. The cell's limit for edges to be tapped is 250 HV.
series: Hardness | Limit for tapped edges
- 0.15 | 381 | 250
- 0.25 | 335 | 250
- 0.35 | 262 | 250
- 0.45 | 198 | 250
- 0.60 | 165 | 250
- 1.00 | 160 | 250
```

The traverse shows a hardened band about 0.4 mm deep, of the order of the 0.31 mm diffusion length estimated above for the oxygen cut. Its hardness at the edge, 381 HV, is more than twice the base metal's 160 HV. A tap cutting its thread into that band, with the thread's minor diameter at the hole wall, works in the hardest metal of all.

### The fix

The cell considered three changes.

```figure
type: decision
title: Choosing how to make the tapped holes
caption: This is an illustration. The cell adopted the first; the others remain options for other parts.
- Cut the hole undersize at 6.0 mm with the laser, then drill to 6.8 mm | Removes 0.4 mm of metal radially, taking the edge past the 262 HV point; costs one drilling operation | Adopted for all tapped holes in hardenable steel
- Cut the hole at size with nitrogen at reduced power | No oxidation heat, but slower in 6 mm plate and still a quenched edge; hardness would need re-testing | Not adopted
- Mark the hole centre only, drill and tap later | No hardened edge at all; adds a full drilling operation and loses the laser's positional accuracy | Used for holes with tight positional tolerances on thick plate
```

Cutting undersize and drilling removes 0.4 mm of metal radially, taking the hole wall beyond the 0.35 mm point where the traverse read 262 HV, into metal of roughly 230 HV, inside the 250 HV limit. A retest on a sectioned hole read 172 HV0.5 at 0.15 mm from the drilled wall, which is 0.55 mm from where the original cut edge had been, matching the traverse; the hardness at the drilled wall itself, interpolated from the traverse, is about 230 HV. The drawings for all steel parts with tapped holes now carry a note that laser-cut holes for tapping in carbon steels are to be cut undersize and drilled, and the cell's planning rules flag any steel whose carbon equivalent exceeds 0.40.

## The same effect elsewhere

Tapping is not the only process a hard edge affects.

**Bending.** A bend line that crosses a laser-cut edge puts the hardened band into tension on the outside of the bend. A brittle edge can crack and the crack can run into the bend. Flanges with relief cuts and bends close to cut edges in higher-carbon or high-strength steels are where this shows up first. Removing the band, increasing the bend radius, or turning the part so the bend does not cross the edge are the usual remedies.

**Punching and nibbling after cutting.** A punched feature that breaks into a laser-cut edge works against the hard band and can chip the punch.

**Fatigue.** A hard, brittle edge with a recast layer and small notches from the cutting striations can start fatigue cracks sooner than a machined edge. Parts that carry cyclic loads at their cut edges, such as hanger plates and vibrating screen components, may need their edges ground or machined.

**Welding.** A hardened cut edge is usually melted and replaced by the weld, so it matters less, but edges that will be welded with low heat input may keep some of the hard band in the heat-affected zone.

In each case the measurement is the same Vickers traverse, and the planning tool is the same carbon equivalent check. Stainless steel 304 and the aluminium alloys the cell cuts do not harden in this way, which is one reason the problem surprised a cell whose most frequent work is stainless doors.

## Putting the edge on the drawing and the inspection plan

A problem found once should not need finding again. The cell made three permanent changes alongside the drilling rule.

The drawing standard now has a note for laser-cut edges on carbon and low-alloy steels: holes to be tapped are cut undersize and drilled, and edges that are bent across, punched into or highly stressed in fatigue are either removed by a stated amount or qualified by a hardness traverse. The note gives the designer the choice and the planner the instruction.

The inspection plan requires a first-article hardness traverse whenever a new steel grade, a new supplier or a new thickness is cut with oxygen for parts with tapped holes or edge bends, and a repeat whenever the cutting parameters for that job change. A traverse takes about an hour of a technician's time including sectioning and polishing, which is cheap compared with a batch of broken taps and the rework of seized threads.

The planning rules flag every steel whose mill certificate gives a carbon equivalent above 0.40. The flag does not stop the job; it prompts the planner to check whether any edge will be tapped, bent across or fatigue-loaded, and to apply the drawing note if so.

## Exercise: a check on the drilled hole

After the change, the quality engineer makes one more Vickers HV0.5 indentation, 0.20 mm from a drilled hole wall in a production bracket that had been cut at 6.0 mm and drilled to 6.8 mm. The diagonals measure 0.0550 and 0.0560 mm, and the nearest other indentation is 0.25 mm away. What is the hardness, is the test valid under the cell's rules, and does the edge meet the 250 HV limit? What should the engineer do next?

### Answer

The mean diagonal is (0.0550 + 0.0560) ÷ 2 = 0.0555 mm, and the hardness is HV = 1.8544 F ÷ d² = 1.8544 × 0.5 ÷ 0.0555² = 301 HV0.5.

The validity checks pass. The edge distance needed is 2.5 × 0.0555 = 0.139 mm, and 0.20 mm exceeds it. The spacing needed is 3 × 0.0555 = 0.167 mm, and 0.25 mm exceeds it. The diagonals differ by 0.0010 ÷ 0.0555 = 1.8%, inside 5%. The Vickers test check tool reports the same values and fails the result only on the specification: 301 HV against 0 to 250 HV.

The edge does not meet the limit. If the hole had been cut at 6.0 mm, this indentation would sit 0.4 + 0.20 = 0.60 mm from the original cut edge, where the traverse read 165 HV. A reading of 301 HV lies between the traverse's 335 HV at 0.25 mm and 262 HV at 0.35 mm, so the indentation is roughly 0.3 mm from the original edge, and only about 0.1 mm was removed radially. That points to a hole cut at about 6.6 mm instead of 6.0 mm. The engineer should check the program, the cut hole size recorded on the traveller, and an undrilled hole on a part from the same sheet, then quarantine the batch until the holes are confirmed.
