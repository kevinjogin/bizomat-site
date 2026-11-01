---
book: reverse-osmosis-by-the-numbers
chapterSlug: concentration-polarisation-and-the-array
order: 5
title: "Concentration polarisation and the array"
description: "The salty layer at the membrane surface, the film model from Fick's law, the maker's polarisation factor, element recovery and crossflow, and why BW-12 is staged two vessels to one."
draft: false
---

The membrane never sees the water in the middle of the feed channel. Water flows towards the membrane and passes through it; the salt it carries cannot, so it piles up against the surface in a thin layer that is saltier than the bulk. That layer is concentration polarisation, and it quietly worsens almost everything: it raises the osmotic pressure the membrane must beat, it lets more salt through, and it is where scale and fouling begin, because the surface is the saltiest and slowest-moving water in the plant.

This chapter explains the layer with Fick's law of diffusion, puts numbers on it for BW-12, shows how membrane makers allow for it through element recovery and crossflow, and uses it to explain why BW-12's eighteen elements are arranged in two stages rather than one. It ends with an early layout that would have run the tail elements at a fifth of a vessel's design flow and a polarisation factor half as high again.

## A layer made by flux and undone by diffusion

Picture the few hundredths of a millimetre of water next to the membrane surface. Water arrives at the flux rate and passes through, bringing salt with it at the bulk concentration. The membrane passes only a little of that salt, so the rest accumulates, and the concentration at the surface rises until salt diffuses back towards the bulk as fast as the flux brings it in. Diffusion is the random walk of the ions down a concentration gradient, the subject of the chapter on [diffusion as a random walk](/reados/publications/diffusion-by-the-numbers/diffusion-is-a-random-walk/) in Diffusion by the Numbers. In steady state the two flows balance, and the balance fixes the surface concentration.

The film model treats the turbulence and the feed spacer as giving a well-mixed bulk and a thin stagnant film of thickness δ next to the membrane, across which salt must diffuse. Solving Fick's law across the film gives an exponential.

```figure
type: formula
title: The film model of concentration polarisation
formula: (c_m − c_p) ÷ (c_b − c_p) = exp(J_w ÷ k), with k = D ÷ δ
formula: Polarisation factor β ≈ c_m ÷ c_b = exp(J_w ÷ k) when c_p is small
caption: c_m is the concentration at the membrane surface, c_b in the bulk and c_p in the permeate; J_w is water flux in m/s; k is the mass transfer coefficient; D is the salt's diffusion coefficient. This is an illustration: BW-12's average flux.
- Flux | 18.02 L/(m²·h) = 5.006 × 10⁻⁶ m/s
- Mass transfer coefficient | 3 × 10⁻⁵ m/s, an illustrative value for a spacer-filled channel at moderate crossflow
step: β = exp(5.006 × 10⁻⁶ ÷ 3 × 10⁻⁵) = exp(0.167) = 1.18
step: With D ≈ 1.5 × 10⁻⁹ m²/s for sodium chloride, the film is δ = D ÷ k ≈ 50 µm thick
```

Two things raise the factor. A higher flux brings salt in faster; a lower mass transfer coefficient carries it away more slowly. The coefficient rises with crossflow velocity, because faster flow along the channel thins the film, and it depends on the spacer's geometry and on the salt's diffusion coefficient. Real channels are not simple films, and makers' design programs use correlations fitted to their own elements. But the exponential shape is the lesson: polarisation grows faster than flux.

```figure
type: compare
title: Polarisation factor from the film model
cols: k = 2 × 10⁻⁵ m/s | k = 3 × 10⁻⁵ m/s | k = 5 × 10⁻⁵ m/s
rowhead: Flux
caption: This is an illustration. Mass transfer coefficients chosen to span low to high crossflow. At the lead element's flux and low crossflow the surface water is over 40% saltier than the bulk.
- * 18 L/(m²·h), BW-12 average | 1.28 | 1.18 | 1.11
- 26 L/(m²·h), BW-12 lead element at 25 °C | 1.43 | 1.27 | 1.16
```

## What the salty layer does

Each effect of polarisation follows from the surface concentration being β times the bulk.

**Pressure.** The osmotic pressure that opposes flow is that of the water at the surface, so it is β times the bulk value. With an average factor of 1.079, BW-12's mean osmotic pressure is effectively 2.970 × 1.079 = 3.205 bar rather than 2.970, and the plant needs about 0.24 bar more feed pressure than Chapter 3's calculation, which ignored it. The tools in this book state that they leave polarisation out, so this addition is made by hand or left to the maker's projection.

**Salt passage.** Salt diffuses through the membrane from the surface concentration, so the salt flux, and with it the permeate strength, is multiplied by β. Chapter 3 used the factor 1.079 for that reason.

**Scaling and fouling.** The surface layer is where a sparingly soluble salt first exceeds its solubility, and where colloids and organic matter carried by the flux are pressed against the membrane. At BW-12's concentrate end the bulk is four times the feed, and the surface about 4.3 times. Chapter 6 uses that wall concentration, not the bulk, to test for scale.

## The maker's polarisation factor

Membrane makers fold all of this into their design programs. For hand checks, the FilmTec system design equations give a simple factor for their 8-inch elements: the polarisation factor is exp(0.7 × Yᵢ), where Yᵢ is the recovery of the individual element. It captures the same physics in a different variable. An element that recovers a large share of its feed has a high flux relative to its crossflow, and its downstream end has little crossflow left.

For a train of n identical elements in series, the average element recovery that gives a system recovery Y is 1 − (1 − Y) raised to the power 1 ÷ n. That converts BW-12's layout into a polarisation factor.

```figure
type: compare
title: Element recovery and polarisation factor for 75% system recovery
cols: Elements in series | Average element recovery | Polarisation factor exp(0.7 Yᵢ) | Concentrate per vessel, m³/h
rowhead: Layout of 18 elements
caption: This is an illustration. Average element recovery from 1 − 0.25^(1/n); the polarisation factor is the FilmTec hand-calculation form. The two-to-one array halves the element recovery and triples the crossflow at the tail.
- Single stage, three vessels of six in parallel | 6 | 20.6% | 1.155 | 1.33
- * Two-to-one array, as built | 12 | 10.9% | 1.079 | 4.00
```

The two-to-one array places twelve elements in series in each flow path: six in a first-stage vessel and six in the second-stage vessel. Each element then recovers about 10.9% of the water reaching it, and the average polarisation factor is 1.079. The same eighteen elements arranged as one stage of three parallel vessels would have only six elements in series, each recovering 20.6%, and a factor of 1.155.

## Crossflow and the shape of the array

The other reason for staging is crossflow. As water leaves through the membranes, the flow along the feed channel falls; by the last element of a vessel it can be a small fraction of what entered. The makers' design guidelines set a minimum concentrate flow per vessel, to keep the channel swept and the film thin, and a maximum feed flow per vessel, to limit pressure drop and mechanical loads on the elements. A single-stage layout at 75% recovery struggles to meet both at once: enough feed for the first element is too much for the vessel, or the concentrate leaving each vessel is too little.

Staging solves it by tapering the array as the flow falls. In BW-12, the 16.0 m³/h of feed divides between two first-stage vessels at 8.0 m³/h each. If each stage recovers half its feed, each first-stage vessel makes 4.0 m³/h of permeate and passes 4.0 m³/h on. The two concentrates join, 8.0 m³/h, and enter the single second-stage vessel, which makes another 4.0 m³/h and rejects 4.0 m³/h as the plant's concentrate. Every vessel sees 8.0 m³/h entering and 4.0 m³/h leaving: the same crossflow conditions in both stages, which is the purpose of the taper.

```figure
type: svg
title: BW-12's two-to-one array
alt: A flow diagram. Feed of 16.0 cubic metres per hour enters from the left and divides into two first-stage pressure vessels, each receiving 8.0 and producing 4.0 of permeate. Their concentrates, 4.0 each, join into 8.0 and feed a single second-stage vessel, which produces 4.0 of permeate and 4.0 of concentrate. A note at the bottom totals the permeate from the three vessels, 12.0.
caption: This is an illustration. Flows in m³/h, with an even split of recovery between the stages. Each vessel holds six elements, so each flow path passes through twelve.
viewbox: 0 0 660 260
body:
<path class="la flow" d="M20 100H80"/>
<text class="tx txs" x="16" y="88">feed 16.0</text>
<path class="li" d="M80 60V140M80 60H110M80 140H110"/>
<rect class="bx" x="110" y="44" width="200" height="32" rx="14"/>
<rect class="bx" x="110" y="124" width="200" height="32" rx="14"/>
<text class="txb" x="150" y="65">stage 1, vessel A</text>
<text class="txb" x="150" y="145">stage 1, vessel B</text>
<text class="tx txs" x="120" y="36">8.0 in, permeate 4.0 out</text>
<text class="tx txs" x="120" y="176">8.0 in, permeate 4.0 out</text>
<path class="li" d="M310 60H350V140M310 140H350"/>
<path class="la flow" d="M350 100H400"/>
<text class="tx txs" x="352" y="90">8.0</text>
<rect class="bxa" x="400" y="84" width="200" height="32" rx="14"/>
<text class="txb" x="450" y="105">stage 2</text>
<path class="la flow" d="M600 100H650"/>
<text class="txa" x="560" y="80">concentrate 4.0</text>
<text class="tx txs" x="410" y="136">permeate 4.0 out</text>
<path class="ln dsh" d="M20 220H640"/>
<text class="txa" x="20" y="246">permeate from all three vessels: 4.0 + 4.0 + 4.0 = 12.0</text>
```

That even split is a simplification. In reality the second stage works against water twice as strong, and its driving pressure is lower. This is an illustration. With 11.5 bar at the first-stage inlet and 1.5 bar of pressure drop in each stage, the first stage averages about 11.5 − 0.75 − 0.5 − 2.23 = 8.0 bar of net driving pressure, while the second, starting at 10.0 bar with a mean osmotic pressure of 4.42 bar, averages about 4.3 bar. At the same permeability the first stage would make nearly twice the flux of the second, so in practice it recovers more than half of its feed, the second stage receives less and saltier water, and the imbalance grows.

```figure
type: compare
title: Driving pressure in BW-12's two stages with an even recovery split
cols: Inlet pressure, bar g | Feed strength, g/L | Mean osmotic pressure, bar | Average NDP, bar
rowhead: Stage
caption: This is an illustration. Each stage at 50% recovery with 1.5% salt passage, 1.5 bar pressure drop and 0.5 bar gauge permeate, at 25 °C and without polarisation. The second stage has about half the driving pressure of the first.
- * Stage 1 | 11.5 | 2.40 | 2.23 | 8.0
- Stage 2 | 10.0 | 4.76 | 4.42 | 4.3
```

Designers balance the stages in one of three ways. An interstage booster pump raises the second stage's inlet pressure. A valve on the first stage's permeate line holds back pressure on it and reduces its driving pressure. Or different element types are used, with lower-permeability elements at the front. BW-12's designer projected the plant with the maker's software, which showed the stage fluxes within the maker's limits without a booster, and fitted a first-stage permeate valve so the balance could be adjusted if the second stage's flux fell as the membranes aged. The hand calculation was what told the designer to look.

## Temperature and the film

Warm water changes both sides of the film model. The flux at the lead elements rises, as Chapter 4 showed, which thickens the polarisation. But salt also diffuses faster in warm water, which thins it. The Stokes–Einstein relation makes a diffusion coefficient proportional to absolute temperature divided by viscosity; from 25 to 30 °C water's viscosity falls from 0.890 to 0.797 mPa·s, so the diffusion coefficient of sodium chloride rises by a factor of (303.15 ÷ 298.15) × (0.890 ÷ 0.797) = 1.135. In the usual mass transfer correlations for channel flow, the coefficient k rises roughly as the two-thirds power of the diffusion coefficient, here by about 9%.

This is an illustration. At 25 °C, with k = 3.0 × 10⁻⁵ m/s, BW-12's lead element at 26.1 L/(m²·h) has a factor of 1.27. At 30 °C, k rises to about 3.27 × 10⁻⁵ m/s and the lead flux to 27.5 L/(m²·h), and the factor is 1.26. The two effects nearly cancel. The summer problem at the lead elements is the extra water they push through, and with it the extra foulant they collect, more than the polarisation factor itself.

## What an operator can see

Polarisation cannot be measured directly on a working plant: no instrument reaches into a 50 µm layer inside a spiral-wound element. Its effects show up in readings that are available, if the plant has the instruments to separate them.

- **Salt passage that varies with crossflow.** If the permeate flow is held constant while the concentrate flow is raised, the crossflow increases, polarisation falls and salt passage drops. A short test at two concentrate flows shows how sensitive the plant is.
- **Permeate conductivity by stage.** The second stage works at lower crossflow relative to its flux and with stronger water, and its permeate is always saltier. A widening gap between stages, with the feed unchanged, suggests growing polarisation or scaling in the second stage.
- **Pressure drop by stage.** Deposits in the feed channel raise the pressure drop and lower the local crossflow, which raises polarisation and accelerates the deposit. A first-stage pressure drop rising faster than the second's points to particulate or biological fouling at the front; the reverse points to scale at the tail.

Those readings are the reason BW-12 has pressure transmitters at the interstage header and sample points on each vessel's permeate outlet. Chapter 9 uses them.

## The error: one stage, three vessels

This is an illustration. The first layout sketched for BW-12 put all eighteen elements in one stage of three parallel vessels, which uses one fewer header and is simpler to pipe. The design reviewer calculated two numbers before reading further. The average element recovery would be 1 − 0.25^(1/6) = 20.6%, giving a polarisation factor of 1.155 against 1.079 for a two-stage layout. And each vessel would receive 16.0 ÷ 3 = 5.33 m³/h and reject only 1.33 m³/h, a third of what the same vessel passes in the two-to-one array.

The low tail flow mattered more than the higher factor. The last element in each vessel would see the strongest water in the plant at the slowest crossflow, with the thickest boundary layer, which is the recipe for scale and fouling at the concentrate end. The wall concentration factor at the tail would be about 4 × 1.155 = 4.6, against 4.3 in the two-stage array, and Chapter 6 shows that BW-12's silica is close to its limit even at 4.3. The single-stage layout was rejected, and the two-to-one array adopted. Small plants that cannot be staged often use a concentrate recirculation loop instead, returning part of the concentrate to the pump suction to raise crossflow; that works, but it also raises the concentration the membranes see, and it must be included in the projection.

## Exercise: polarisation at the lead element

In winter, BW-12's lead elements run at about 24 L/(m²·h) and in summer at about 27 L/(m²·h), as Chapter 4 found. Taking a mass transfer coefficient of 2.5 × 10⁻⁵ m/s, calculate the film-model polarisation factor at the average flux of 18.02 L/(m²·h) and at a lead flux of 26 L/(m²·h). By how much does the surface concentration at the lead element exceed the feed?

**Worked answer.** This is an illustration. Convert the fluxes to m/s by dividing by 3,600,000: 18.02 L/(m²·h) is 5.006 × 10⁻⁶ m/s and 26 L/(m²·h) is 7.222 × 10⁻⁶ m/s. The factors are exp(5.006 × 10⁻⁶ ÷ 2.5 × 10⁻⁵) = exp(0.200) = **1.22** and exp(7.222 × 10⁻⁶ ÷ 2.5 × 10⁻⁵) = exp(0.289) = **1.33**. At the lead element the bulk is close to the feed strength, so the water at the membrane surface is about **33% saltier than the feed**: roughly 3,200 mg/L against 2,400 mg/L. The lead element is not a scaling risk, because the bulk there is weak, but its high flux and high polarisation make it the place where colloids and organic matter in the feed collect first, which is why a fouled plant's lead elements are usually the heaviest when they are weighed.
