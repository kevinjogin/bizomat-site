---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: natural-frequencies-and-drumming
order: 8
title: "Natural frequencies and drumming"
description: "Calculate a panel's natural frequencies, compare them with the fan and motor that excite it, see why stiffer is not always quieter, and catch a beaded panel tuned exactly to the fan."
draft: false
---

A panel drums when something shakes it at one of its natural frequencies. The fan and motor in SP-90's enclosure shake the frame at their running speeds whatever the panel is made of, and the frame passes that shaking to every panel screwed to it. A panel whose natural frequency is far from the shaking barely responds. A panel tuned to it responds many times more strongly than the shaking that drives it, and radiates the motion as sound.

This is the failure that static checks do not see. A panel can be stiff enough, flat enough and stable enough and still hum, because its stiffness and mass happen to put a natural frequency in the wrong place. This chapter calculates SP-90's natural frequencies for every option considered so far, compares them with the builder's frequency bands, and shows that one option which passed every static check was tuned almost exactly to the fan.

## A panel's natural frequencies

A flat rectangular panel with simply supported edges vibrates in a family of mode shapes, each a pattern of half-sine waves: m half-waves across the short side a and n along the long side b. Each mode has its own natural frequency.

```figure
type: formula
title: Natural frequencies of a simply supported rectangular plate
formula: f(m,n) = (π / 2) (m² / a² + n² / b²) √(D / (ρ t))
caption: Classical result for small vibrations (Blevins). Work in N, mm, s and tonnes, so that ρ is in t/mm³ and f comes out in hertz. Clamped edges raise the frequencies, by a factor of about 1.8 for the first mode of a square plate.
- f(m,n) | Natural frequency of mode m, n, Hz
- m, n | Half-waves across a and along b
- D | Flexural rigidity, 31,648 N·mm for 1.2 mm steel
- ρ | Density, 7.85 × 10⁻⁹ t/mm³ for steel
- t | Thickness, 1.2 mm
step: √(D / (ρ t)) = √(31,648 / (7.85 × 10⁻⁹ × 1.2)) = 1.833 × 10⁶ mm²/s
step: f(1,1) = 1.571 × (1/600² + 1/900²) × 1.833 × 10⁶ = 11.6 Hz
```

Two features of the formula drive the rest of the chapter. Frequency rises with the square root of stiffness over mass, so adding stiffness without mass raises it and adding mass without stiffness lowers it. And frequency rises with the inverse square of the panel's dimensions, so halving a bay's size raises its frequencies about four times. Thickness enters twice: D rises with t³ and the mass per unit area with t, so frequency rises in proportion to t.

### SP-90 as built

This is an illustration. For the original flat 1.2 mm SP-90, the first five modes are:

```figure
type: compare
title: Natural frequencies of flat SP-90 panels, simply supported
cols: 1.2 mm | 1.6 mm | 2.0 mm
caption: This is an illustration. Modes are labelled m, n: m half-waves across the 600 mm width, n along the 900 mm height. Highlighted values fall inside the builder's bands of 18.1–30.2 Hz around the fan and 36.0–60.0 Hz around the motor.
- Mode 1,1 | 11.6 Hz | 15.4 Hz | 19.3 Hz, in fan band
- Mode 1,2 | 22.2 Hz, in fan band | 29.6 Hz, in fan band | 37.0 Hz, in motor band
- Mode 2,1 | 35.5 Hz | 47.4 Hz, in motor band | 59.2 Hz, in motor band
- Mode 1,3 | 40.0 Hz, in motor band | 53.3 Hz, in motor band | 66.7 Hz
- Mode 2,2 | 46.2 Hz, in motor band | 61.6 Hz | 77.0 Hz
```

The fan runs at 24.2 Hz. The 1.2 mm panel's second mode, with one half-wave across and two up the panel, sits at 22.2 Hz, 8% below it. That is the hum the customers complained of. Several modes of every flat thickness fall inside one band or the other, because a large flat panel has many modes packed closely together in the range where machinery runs. Making it thicker slides the whole family upwards, and a different member of the family lands on the fan or the motor. That is why Chapter 1 said a thicker flat panel would bow less and still hum.

### What the edges do to the frequencies

The table assumes simply supported edges. Clamped edges raise every frequency, the first mode of a square plate by a factor of about 1.8, and a screwed panel lies somewhere between. For the original SP-90, the first mode could therefore be anywhere from the calculated 11.6 Hz to about 21 Hz, and the second from 22.2 Hz upwards. That uncertainty is one reason the builder's bands are wide, and the reason the real panel's frequencies must be measured: a calculation that says a mode is 8% below the fan cannot say whether the real panel is 8% below, exactly on it, or a little above.

It is also why the number and pitch of fasteners matter for vibration as well as for stiffness. A panel screwed every 150 mm is closer to clamped than one screwed every 300 mm, and a panel whose screws have loosened drops towards simply supported and below, because a loose screw lets the edge lift as well as rotate. A panel that hums only after a few months in service has often lost screw preload rather than changed in any other way, and the first check is a screwdriver.

### Scaling a known result

The formula's structure gives quick estimates without recalculating from scratch. For panels of the same material and edge conditions, frequency scales in proportion to thickness and inversely to the square of size. A panel known to have a first mode of 11.6 Hz at 600 × 900 × 1.2 mm will have one of 11.6 × 2.0 / 1.2 = 19.3 Hz in 2.0 mm sheet, and one of 11.6 × 4 = 46.4 Hz if it is halved in both dimensions to 300 × 450 mm. Such scaling is a good check on any frequency calculation, and a fast way to see how much a proposed change can move a mode before working it through.

Mass added without stiffness lowers frequency with the square root of the mass ratio. A damping pad that adds 20% to a bay's mass per unit area lowers its frequencies by about 9%, since 1 / √1.2 = 0.91. Labels, cable clips and brackets fixed to a panel have the same effect locally, which is why a panel that was tuned clear of the bands should be rechecked if heavy items are later mounted on it.

## The bands and why they are wide

A panel driven at a frequency f, with natural frequency fₙ, responds more strongly as f approaches fₙ, and at fₙ its response is limited only by damping. Thin steel panels screwed to a frame have little damping, so their response at resonance can be tens of times the response well away from it. Away from resonance, the response falls quickly.

The builder's rule, no panel mode within 25% of a running speed, reflects two uncertainties. The panel's real edge conditions sit between supported and clamped, so its real frequencies are higher than calculated by an unknown amount; and motor and fan speeds vary with load and supply. A narrower band would need better knowledge of both. This is an illustration of one builder's rule, not a standard: some products justify tighter margins with testing, and others, near large machines, need wider ones.

The rule covers only running speeds. Machines also shake at multiples of their running speed, at the fan's blade-passing frequency, the running speed times the number of blades, and at twice the mains frequency in electric motors. This is an illustration. SP-90's fan has nine blades, giving a blade-passing frequency of 217.5 Hz. The builder's targets do not cover these, and the test in Chapter 9 checks for them instead.

## Every option, checked

This is an illustration. The designer calculated the lowest relevant frequencies of each option in the earlier chapters:

- **Beads** (Chapter 6): each 150 mm beaded strip is a beam spanning 600 mm, with I = 217 mm⁴ and the mass of 150 mm of sheet plus the bead's extra 2 mm of arc. Its first frequency, from f = (π/2) √(E I / (m L⁴)) for a simply supported beam, is **24.0 Hz**.
- **Two horizontal hats** (Chapter 7): each bay is 600 × 300 mm, and its first mode is at **40.0 Hz**. The hats' own first mode, as beams carrying their share of the panel, is about 138 Hz.
- **Three horizontal hats**: each bay is 600 × 225 mm, with its first mode at **64.9 Hz** and its next at 88.9 Hz. The hats' own first mode is about 153 Hz.

```figure
type: bars
title: Lowest panel or bay frequency of each SP-90 option, against the bands
unit: Hz
max: 70
caption: This is an illustration. Fan band 18.1–30.2 Hz, motor band 36.0–60.0 Hz. Flat panels show their lowest mode inside a band; every flat thickness has others inside a band too. Only three hats clear both bands.
- Flat 1.2 mm, mode 1,2 | 22.2
- Flat 1.6 mm, mode 1,2 | 29.6
- Flat 2.0 mm, mode 1,2 | 37.0
- Five beads across | 24.0
- Two horizontal hats, bay | 40.0
- *Three horizontal hats, bay | 64.9
```

The beaded strip's figure is worth working through, because it is the one that caught the builder out. The strip's mass per millimetre of span is its girth, 150 mm plus the bead's extra 2.07 mm, times the thickness and density: 152.07 × 1.2 × 7.85 × 10⁻⁹ = 1.43 × 10⁻⁶ t/mm. Its bending stiffness is E I = 200,000 × 217 = 4.34 × 10⁷ N·mm². Then E I / (m L⁴) = 4.34 × 10⁷ / (1.43 × 10⁻⁶ × 600⁴) = 234 s⁻², whose square root is 15.3, and multiplying by π / 2 gives 24.0 Hz. The model ignores the small help the flat sheet gives across the beads, which would raise the frequency slightly; it does not change the conclusion that the strip sits on top of the fan.

Only the three-hat layout clears both bands. Its lowest bay mode, 64.9 Hz, is 35% above the motor, and the hats' own mode is far above everything except the blade-passing frequency, which it clears by 30%. The designer's provisional choice in Chapter 7, made for stability, is confirmed on vibration.

## The error: a beaded panel tuned to the fan

This is an illustration. The beaded SP-90 of Chapter 6 passed every static check. It deflected about 1.5 mm under 250 Pa, half the target. Its 150 mm flats would buckle only about 1 mm with a 10 °C difference. It added no mass. The workshop built six for a customer before the vibration check in this chapter had been done, on the reasoning that a panel five times stiffer than the original must surely be quieter.

The six beaded panels hummed louder than the flat ones. The calculation shows why: the beaded strip's first frequency is 24.0 Hz, and the fan runs at 24.2 Hz, a difference of less than 1%. Beads had made the panel much stiffer across its width, and in doing so they had moved one of its modes almost exactly onto the fan. A phone vibration app held against one panel showed a strong, steady peak at 24 Hz with the fan running and almost nothing with it off.

The root cause was a process gap, not an engineering one: the builder had a static check and no dynamic check in its design review. The six panels were refitted with the three hat stiffeners of Chapter 7 behind the beads, which raised their lowest frequencies well clear of both bands and stopped the hum. The builder's checklist now includes, for any panel near rotating machinery, the first few natural frequencies against the running speeds, calculated before the first panel is built and measured on it afterwards.

The deeper lesson is that stiffness is not a direction on a dial marked "quieter". Every change to stiffness or mass moves a panel's frequencies, and whether that helps depends on where they land. A stiffer panel tuned to a running speed is worse than a softer one that is not.

## Damping

When frequencies cannot be moved far enough, the alternative is damping, which limits the response at resonance. Steel sheet has very little internal damping, and a screwed panel gets most of its damping from friction at its fasteners. Ways to add more include:

- **Bonded stiffeners.** The adhesive layer between hat and panel shears as the panel vibrates and dissipates a little energy. SP-90's bonded hats help a little in this way.
- **Damping sheets.** Bitumen-based or polymer pads bonded to the panel add mass and damping. They lower frequencies slightly because of their mass.
- **Constrained-layer damping.** A thin viscoelastic layer between the panel and a thin metal cover sheet. Bending shears the viscoelastic layer, which dissipates far more energy than a free pad of the same mass.
- **Laminated sheet.** Steel sheet supplied as two skins with a viscoelastic core, used where quietness matters in appliances and vehicles.

Damping is the right tool when a panel must pass through resonance during start-up or run-down, or when a machine runs at variable speed and no frequency is safe. It is a supplement to good tuning, not a substitute, and its benefit should be measured, because its effect depends strongly on temperature and on the materials' data.

## Drumming and noise exposure

A drumming panel is a loudspeaker. In a workshop, the noise it radiates adds to the machine's own noise and to the noise every worker near it receives. Safe Work Australia's material on noise, listed in the references, describes the duty to manage noise exposure, with engineering controls such as quieter machines and enclosures ranked above hearing protection. An enclosure built to contain a machine's noise defeats itself if its own panels drum. For SP-90 the builder's targets are about product quality and customer comfort; for an enclosure whose purpose is noise control, the design and its acceptance testing are a matter for an acoustics specialist and the applicable requirements.

## Exercise: a variable-speed fan

The builder's next model will drive the fan from a variable speed drive, running anywhere between 900 and 1,800 rpm.

1. What range of fan frequencies does that produce, and what band does the builder's 25% rule then exclude?
2. Does the three-hat SP-90 clear it?

**Worked answer.**

1. 900 / 60 = 15.0 Hz and 1,800 / 60 = 30.0 Hz. Applying the 25% margin to each end gives an excluded band from 15.0 × 0.75 = **11.3 Hz** to 30.0 × 1.25 = **37.5 Hz**.
2. The three-hat panel's lowest bay mode is 64.9 Hz, well above 37.5 Hz, and the hats' own mode is higher still. It clears the fan band comfortably. The motor band, 36.0 to 60.0 Hz, is unchanged, and the panel clears that too. A variable-speed fan makes flat panels much harder to tune, because the band is wide enough to catch several of a flat panel's modes; small, stiff bays with high first frequencies are the robust answer, and damping is a sensible addition if any mode remains within reach of the speed range.
