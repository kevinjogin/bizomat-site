---
book: scale-models-by-the-numbers
chapterSlug: surface-tension-vortices-and-the-smallest-model
order: 6
title: "Surface tension, vortices and the smallest useful model"
description: "Understand how surface tension and viscosity weaken vortices in small models, grade and record vortex observations, test for size effects and decide how small a model can be and still be trusted."
draft: false
---

The vortices that trouble pump intakes form at the free surface. A slow rotation in the approach flow is stretched and concentrated as it is drawn towards a bellmouth, and the surface above it dips into a funnel. If the funnel deepens far enough, air is pulled down its core into the pump, which loses performance, vibrates and wears. Whether that happens depends on gravity, which a Froude model reproduces, and on viscosity and surface tension, which it does not. Surface tension resists the bending of the water surface into a funnel and the pinching off of bubbles, and in a small model it resists relatively more.

This chapter explains how the Weber number enters vortex formation, how model studies grade and record vortices, and how to test whether a model is big enough by asking whether its results change with its size. It ends with a cheap screening model that found nothing to worry about, and a larger one that did.

## Surface tension in a Froude model

Chapter 2 built the Weber number as the ratio of inertia to surface tension forces, We = ρ V² D ÷ σ. In a Froude model with the same water, velocity scales as L_r^½ and length as L_r, so the Weber number falls as L_r². At 1:6 the PS-3 model's bellmouth Weber number is 579 against the prototype's 20,860, a ratio of 36. Surface tension is therefore relatively 36 times stronger in the model than in the station.

Surface tension acts only where the surface is sharply curved: at the tip of a vortex funnel, around a bubble, at the edge of a floating particle. Over the broad, gently sloping water surface of the wet well it has no effect, and the Froude scaling of levels and drawdown is unaffected. But at the narrow tip of a funnel, where the surface curves tightly, surface tension resists the funnel's descent, and in a small model it can stop a funnel from reaching the bellmouth that would have reached it at full size. The effect adds to the viscous damping of vortex cores described in Chapter 5. Both push the model the same way: towards weaker vortices than the prototype would have.

The two effects respond differently to the laboratory's controls. Warming the water from 20 °C to 25 °C raises the model's Reynolds number by 12% but its Weber number by only 1%, because surface tension changes much more slowly with temperature than viscosity does. Raising the flow raises both, the Reynolds number in proportion to velocity and the Weber number with its square. Only a larger model raises both without changing the Froude number.

## Where vortices come from

A vortex needs a source of rotation, and in a wet well there are several. An approach flow that arrives off-centre, because the inflow pipe enters from one side or the channel bends, carries rotation with it. Flow separating from a sharp corner or a pier sheds rotation into the water behind it. A running pump beside an idle one draws water around the idle intake. Even a symmetrical layout can develop rotation if the flow is slightly unsteady, and once a slow rotation exists, the intake can amplify it.

The amplification comes from the conservation of circulation. Circulation, written Γ, measures the strength of a rotation: for a ring of water turning at speed v at radius r, Γ = 2π r v. As water is drawn inwards towards a bellmouth, its radius shrinks and, without friction, its circulation stays the same, so its rotational speed rises in proportion. This is the same effect that makes a spinning skater speed up when they pull their arms in. A gentle rotation of 0.125 m/s at a radius of 1 m in the PS-3 approach has a circulation of 2π × 1 × 0.125 = 0.785 m²/s. Drawn in to a radius of 100 mm it would spin at 1.25 m/s, and the water surface above it would dip by roughly the corresponding velocity head, 1.25² ÷ (2 × 9.80665) = 80 mm. That is the beginning of a funnel.

Circulation has the dimensions L² T⁻¹, the same as kinematic viscosity, so the ratio Γ ÷ ν is a dimensionless group, a kind of vortex Reynolds number. It measures how strong a vortex is compared with the viscous damping that opposes it. In a Froude model circulation scales as velocity times length, L_r^1.5, so this ratio falls by the same factor as every other Reynolds number: from about 783,000 for the illustrative prototype rotation to about 53,300 in the 1:6 model. That is why vortex cores are relatively fatter and weaker in models. Without friction, the model's version of the same rotation would dip its surface by 80 ÷ 6 = 13.3 mm at a radius of 16.7 mm, exactly as Froude scaling requires. In practice its fatter, more viscous core cannot concentrate the rotation as tightly as the prototype's, and surface tension resists the sharp curvature at the funnel tip, so the real model dip is smaller than 13.3 mm and the model understates the vortex.

## Grading vortices

Because vortices are intermittent, model studies describe them by type and by how often each type appears, not by a single measurement. Most grading schemes, including those in intake standards, run from weak to strong along the same lines, though their numbering and exact definitions differ. The scheme below is the one used for the PS-3 study in this book; it is illustrative and should not be mistaken for any standard's.

```figure
type: layers
title: An illustrative vortex grading scale for model observations
caption: Graded by eye with dye injected near the surface and small floating markers. Grades 1 and 2 are common and usually harmless; grades 5 and 6 show air entering the pump. A standard or specification defines the grades and the limits for a real study.
- Grade 1: surface swirl | the surface rotates slowly with no depression
- Grade 2: surface dimple | a shallow depression forms over the rotation
- Grade 3: dye core | dye injected at the surface is drawn down in a coherent thread
- Grade 4: debris drawn down | small floating markers are pulled below the surface
- Grade 5: air bubbles | bubbles detach from the funnel tip and enter the bellmouth
- * Grade 6: air core | a continuous air core reaches the bellmouth
```

Each observation period is long enough to see the intermittent behaviour, typically many minutes of model time, and the observer records the strongest grade seen and the share of time each grade is present. Observations are repeated by a second observer or from video, because grading by eye is subjective. Dye and markers are introduced the same way in every run.

## Testing for size effects

A model can test whether its results depend on its size, even with only one model, by changing the conditions that scale effects depend on while holding the Froude-scaled geometry. The standard approach is the one used in Chapter 5: run at the Froude-scaled flow and at 1.5 times it, and compare the vortex grades. If the grades are the same, the model is probably large enough. If they strengthen markedly at the higher flow, the model is in the range where viscosity and surface tension still suppress vortices, and the prototype is likely to be worse than the Froude-scaled run suggests.

The more searching test is to build the same geometry at two scales. Physicists studying critical phenomena use the same idea, called finite-size scaling: a quantity measured in systems of several sizes is plotted against the inverse of the size and extrapolated to infinite size. Engineers rarely have the budget for three models, but two sizes, or one model at several Reynolds and Weber numbers, give much of the same information. The question in each case is whether the result has stopped changing as the model gets bigger.

## The PS-3 observations

This is an illustration. Before the 1:6 model was built, the laboratory ran a quick screening model at 1:12 to compare two layouts of the approach channel. At 1:12 the bellmouths are 50 mm across, each duty pump draws 0.90 L/s, and the model's Reynolds and Weber numbers at the bellmouth are 22,890 and 145. The 1:6 model followed with the chosen layout.

```figure
type: compare
title: Vortex observations at the downstream bellmouth, lowest level, two duty pumps
rowhead: Model and flow
cols: Re | We | Strongest grade | Share of time at grade 3 or above
caption: Invented observations for the illustration. The grades strengthen as the model's Reynolds and Weber numbers rise, with no change in Froude number between the first and third rows; the screening model's calm result was a size effect, not a property of the design.
- 1:12, Froude-scaled | 22,890 | 145 | 1 | 0%
- 1:12, 1.5 × Froude-scaled | 34,340 | 326 | 2 | 0%
- * 1:6, Froude-scaled | 64,750 | 579 | 4 | 12%
- 1:6, 1.5 × Froude-scaled | 97,130 | 1,304 | 5 | 21%
```

The table is the clearest possible demonstration of a size effect. The 1:12 and 1:6 Froude-scaled runs represent exactly the same prototype condition, with the same Froude number and the same geometry, and yet the larger model shows dye cores and debris being drawn down 12% of the time while the smaller one shows only surface swirl. Nothing changed between them except the Reynolds and Weber numbers. The 1:6 model's high-flow run, at grade 5, shows that even the larger model is probably understating the prototype's vortices.

## The error: a screening model taken as a clearance

This is an illustration. The screening model's purpose was to choose between two approach layouts, a task for which it was well suited, because both layouts suffered the same size effects and the comparison between them was fair. But its report included a sentence noting that "no significant vortex activity was observed at the design condition", and a project manager, reading the report under schedule pressure, proposed to cancel the 1:6 model on the strength of it.

The station designer queried the proposal and asked the laboratory for the screening model's Reynolds and Weber numbers. At 22,890 and 145 they were well below the illustrative minimums of 50,000 and 400 that the specification set for a model used to judge vortices, and below the values at which the laboratory's own experience suggested vortex grades become stable. The laboratory confirmed that the screening model could rank layouts but could not clear one. The 1:6 model went ahead, and its grade 4 and grade 5 observations led to a floor splitter and a back-wall fillet being added to the design, after which the 1:6 model showed grade 2 at the design flow and grade 3 at 1.5 times.

```figure
type: checklist
title: Before accepting a vortex observation from a model
caption: The size and conditions of a model decide what its vortex observations can be used for. A small model can rank options; only a model meeting the specified minimums can clear a design.
- Model Reynolds and Weber numbers stated | both at or above the specified minimums at the Froude-scaled flow
- Water temperature logged | Reynolds number recalculated for the actual water
- Observation period long enough | strongest grade and share of time at each grade recorded
- 1.5 × flow check run | grades compared with the Froude-scaled run to judge scale effects
- Second observer or video | grading by eye checked for consistency
- x Small screening model used to clear a design | it can rank layouts, but its size effects hide vortices
- ? Do the grades still strengthen at the higher flow | if so, add margin or improve the geometry
```

The report's wording was changed too. Screening model reports at the laboratory now state, in their first paragraph, what the model can and cannot be used for, and give its Reynolds and Weber numbers beside the specified minimums.

## Designing vortices out

The purpose of finding vortices in a model is to remove them from the design, and the model is the cheapest place to try the fixes. Most remedies either remove the source of rotation or stop it concentrating over the bellmouth. A floor splitter, a vertical plate on the floor under the bellmouth in line with the flow, stops a floor-attached vortex from forming and breaks up rotation beneath the intake. A back-wall splitter or a fillet in the corner between the back wall and the floor removes the dead zone where separated flow can circulate. A curtain wall, a horizontal plate a little below the lowest water level, stops surface vortices from reaching the bellmouth. Turning vanes, baffles or a better inflow arrangement can remove a skewed approach at its source.

Each remedy changes the geometry, so each must be tested at the same conditions as the original: the Froude-scaled flow, the high-flow check and the full range of levels and pump combinations. A remedy that cures the vortex at one condition can create a new one at another, for example by blocking the approach to an adjacent pump. And because the remedies work by changing the large-scale flow pattern, which a Froude model reproduces well, their effect in the model is usually a reliable guide to their effect at full size even where the model's absolute vortex grades are not. For PS-3 the floor splitter and back-wall fillet were chosen after three alternatives had been tried, and the chosen arrangement was retested at every operating case before it went into the drawings.

## How small is too small

There is no single answer, which is why specifications set minimums and why models test themselves at higher flows. Three practical guides help.

1. **Meet the specified minimum Reynolds and Weber numbers** at the Froude-scaled flow, with water at the temperature it will actually be.
2. **Check that results stabilise** between the Froude-scaled flow and a higher one, or between two sizes. If they do not, the model is too small to give a number, though it may still rank options.
3. **Keep the instruments in proportion.** Swirl meters need enough flow to turn freely, probes must be small compared with the flow they measure, and levels must be resolvable to a small fraction of the submergence.

A model that meets all three is not perfect, but its remaining scale effects are small and their direction is known. That is enough to make design decisions, provided the report says which way the remaining bias runs.

## How this applies to a small Australian business

Small-scale tests of anything with a free surface, from a sump or a tank to a spray, a drip or a wetting process, are affected by surface tension more than their makers expect, because surface tension is a small-scale force. A quick bench test that shows no splashing, no air entrainment or no dripping may be showing only that the bench is small. The safe use of such a test is to compare options under the same conditions, and to confirm the chosen option at a size closer to the real one before relying on it.

## Exercise: the effect of warm water on vortex similarity

The laboratory considers warming the PS-3 model's water to 25 °C to improve similarity. With the NIST values at 25 °C (density 997.05 kg/m³, kinematic viscosity 0.8927 mm²/s and surface tension 71.97 mN/m), find the model's bellmouth Reynolds and Weber numbers at the Froude-scaled velocity of 0.650 m/s, and compare them with the 20 °C values of 64,750 and 579. Which scale effect does warming help most?

**Worked answer.** Re = 0.6497 × 0.1 ÷ 0.8927 × 10⁻⁶ = **72,790**, 12.4% higher than at 20 °C. We = 997.05 × 0.6497² × 0.1 ÷ 0.07197 = **585**, only 1.0% higher. Warming the water reduces the viscous scale effect noticeably and the surface tension effect hardly at all, because viscosity falls about 11% between 20 °C and 25 °C while surface tension falls about 1%. To reduce the surface tension effect, the model must be larger or run at a higher flow.
