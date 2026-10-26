---
book: product-acoustics-by-the-numbers
chapterSlug: air-paths-and-lined-passages
order: 6
title: "Air paths, grilles and lined passages"
description: "Follow a product's noise out through its air inlet and outlet, see what linings, plenums, grilles and ports do, weigh the fan's extra work, and catch a lining that made the product louder."
draft: false
---

A product that moves air, a purifier, a heater, a computer, a vacuum cleaner, has holes in it, and its noise leaves through them. The fan's sound travels with the air, out of the outlet and, just as strongly, back out of the inlet against the flow. Grilles, filters, ducts and plenums all sit on those paths, and each can absorb some of the sound, pass it, or add noise of its own. They also resist the air flow, and every bit of resistance makes the fan work harder, which makes it louder. Treating a product's air path for noise is therefore a balance between acoustic absorption and aerodynamic cost, and getting the balance wrong can make a product noisier.

This chapter follows AP-40's noise along its air path, from the inlet grille through the filter and fan to the duct and outlet grille, shows what linings and plenums can do, and works through the aerodynamic penalty. The running case finds that AP-40's outlet duct was lined to absorb noise in a way that cut its open area to a third, the fan had to run about 15% faster to hold its air flow, and the product's total sound power rose by about a decibel.

## The two paths

A fan radiates sound in both directions along its duct: downstream with the flow, out of the outlet, and upstream against it, out of the inlet. For a fan in the middle of a product, the two are often of similar strength. This is an illustration. Of AP-40's 55.0 dB(A) of sound power at 1,200 rpm, roughly half leaves through each path: about **52.0 dB(A)** from the inlet and 52.0 dB(A) from the outlet. Treating one path alone can therefore never lower the product's sound power by more than 3 dB, because the other path's half remains. Any air-path treatment plan starts by finding how the sound power divides between the paths, by measurement or estimate.

The casing adds a third path: the fan's vibration and the air pressure inside the cabinet set its panels vibrating, and they radiate. Chapter 9 covers it; here, the casing's contribution is assumed small.

## Elements on the path

AP-40's air path has five elements, each with an acoustic and an aerodynamic role.

```figure
type: steps
title: AP-40's air path, inlet to outlet
caption: This is an illustration. Each element passes, absorbs or adds sound, and each adds resistance the fan must overcome.
- Inlet grille | Side and base perforations; little attenuation, little resistance if open enough
- Filter | Pleated fibrous media; a large share of the resistance, some absorption at high frequencies
- *Fan | The source; sound power rises steeply with speed
- Outlet duct | About 250 mm long, 60 × 40 mm; standing-wave resonances near 690 and 1,370 Hz unless damped
- Outlet grille | Top perforations; the last chance to absorb, and a source of whistle if the air jets through sharp holes fast
```

The filter is the largest aerodynamic load in an air purifier, and it changes over its life: as it loads with dust, its resistance rises, the air flow falls, and a product that holds a constant air flow does so by speeding up its fan. A purifier is therefore noisier with an old filter than with a new one, and its noise should be specified with a filter in a stated condition.

## Linings and plenums

A **lined duct** absorbs sound along its length, as dissipative silencers do in buildings and in Machine Noise Control by the Numbers. Its attenuation rises with the lining's absorption, its length and the ratio of lined perimeter to open area, so a narrow lined passage attenuates strongly per metre. A **plenum**, a chamber that the air enters through one opening and leaves through another, lined with absorbent material, works differently: the sound entering it spreads into a reverberant field inside, much of it is absorbed by the lining, and only part leaves through the exit. A lined plenum before an outlet grille can give a useful reduction at mid and high frequencies in a small space, provided its entry and exit are not in line, so that the sound cannot beam straight through.

Linings also damp a duct's standing waves, the half-wave resonances of Chapter 2, which removes the whistle at those frequencies even where the overall attenuation is modest.

## The fan's extra work

Every lining, plenum and grille adds resistance, and the fan must overcome it. For a given fan, air flow rises in proportion to speed, the pressure it develops with the square of speed, and its sound power, as an empirical rule widely used for fans, by about 50 × log₁₀ of the speed ratio.

```figure
type: formula
title: Fan laws and the sound power penalty of speed
formula: Q ∝ N;   Δp ∝ N²;   ΔL_W ≈ 50 × log₁₀(N₂ ÷ N₁) dB
caption: This is an illustration. The 50 log rule is an empirical approximation for a given fan near a given operating point; real fans vary from it and makers' data replace it.
- Q | Air flow
- Δp | Pressure developed by the fan
- N | Fan speed
- ΔL_W | Change in sound power level
step: 15% faster: ΔL_W ≈ 50 × log₁₀(1.15) ≈ 3.0 dB
step: At night, 500 rpm against 1,200 rpm: ΔL_W ≈ 50 × log₁₀(0.417) ≈ −19.0 dB
step: The same rule gave AP-40's three settings of 55.0, 46.2 and 36.0 dB(A)
```

The rule shows why aerodynamic efficiency is noise control. A product whose air path has 30% more resistance than it needs must run its fan faster to deliver its rated air flow, and pays for it in decibels at every setting.

## The error: a lining that made it louder

This is an illustration. To deal with the outlet duct's whistle and cut the outlet path's noise, AP-40's duct was lined on all four walls with 10 mm of acoustic foam. Inside a 60 × 40 mm duct, the lining left an open passage of about 40 × 20 mm, a third of the original area. In tests, the lined duct reduced the outlet path's A-weighted sound by about **6 dB** at constant fan speed, and the whistle disappeared.

But the product does not run at constant fan speed. Its controller holds the rated air flow, and with the air now passing three times faster through a passage of a third the area, the duct's resistance had risen sharply. To deliver its rated flow, the fan ran about **15%** faster, which by the 50 log rule raised its sound power by about **3.0 dB** on both paths.

```figure
type: compare
title: AP-40 at its rated air flow: sound power by air-path treatment
cols: Inlet path | Outlet path | Total sound power
caption: This is an illustration. Lining the duct to a third of its open area cut the outlet path by 6 dB at constant speed, but the 15% faster fan added 3 dB to both paths, and the total rose by about 1 dB.
- As first built | 52.0 dB(A) | 52.0 dB(A) | 55.0 dB(A)
- Duct lined, open area cut to a third, fan 15% faster | 55.0 dB(A) | 49.0 dB(A) | 56.0 dB(A)
- *Duct enlarged and lined, same open area | 52.0 dB(A) | 46.0 dB(A) | 53.0 dB(A)
- Enlarged lined duct and lined inlet plenum | 48.0 dB(A) | 46.0 dB(A) | 50.1 dB(A)
```

The product's sound power at its rated air flow rose from about 55.0 to about **56.0 dB(A)**. The outlet path was quieter; the inlet path, untreated and now driven by a faster fan, was louder by 3 dB and dominated the total. The check that caught it was measuring the product as it actually runs, at rated air flow under its own control, rather than at a fixed fan speed. The fix enlarged the duct's outer section so that the lining left the original open area, about 2,400 mm², which kept the fan at its original speed and gave the outlet path its 6 dB without the penalty, a total of about **53.0 dB(A)**. A lined plenum at the inlet, behind the filter, then took about 4 dB off the inlet path, for a total of about **50.1 dB(A)**. The general lesson is that an acoustic treatment in an air path must be judged at the product's operating point, with the fan's speed allowed to respond, because a treatment that adds resistance can cost more decibels at the fan than it saves in the duct.

## Grilles and air noise

Grilles add their own noise when air passes through them fast. Air jetting through small, sharp-edged holes produces broadband turbulence noise, and through regular slots or perforations it can produce a tone, a whistle, at a frequency that rises with the air speed. The cures are more open area, so the air passes more slowly, rounded or chamfered hole edges, and avoiding regular arrays of identical slots in line with the flow. The outlet grille of AP-40 is perforated over a larger area than its duct, so the air slows as it leaves, which both reduces the grille's own noise and the resistance.

## Line of sight

Sound at mid and high frequencies travels in nearly straight lines in a product's air path, so an outlet grille that looks straight down a duct to the fan's blades radiates the fan's noise almost directly. A bend, a baffle or an offset plenum that removes the line of sight from outside to the fan, lined where the sound strikes, gives a useful reduction at little aerodynamic cost if the bend is generous. The rule is simple to check in CAD: from any point outside the grille, the fan's blades should not be visible. The same check, made with a torch and a mirror on a prototype, often finds a gap in a baffle that the CAD model did not show, such as a moulding that shrank away from its neighbour or a foam pad that was left out at assembly.

## Filters as absorbers

A pleated fibrous filter is a porous material, and at high frequencies it absorbs some of the sound passing through it, which helps the inlet path. Its effect is modest and changes as it loads with dust, and it should not be counted on in design. Its far larger acoustic effect is indirect: its resistance sets the fan's speed, and a filter with lower resistance for the same filtration, larger in area or with more pleats, is one of the most effective ways to make a purifier quieter, through the 50 log rule.

## Vented enclosures and passive radiators

The speaker chamber of Chapter 4 was sealed. A **vented** enclosure adds a port, a short tube from the chamber to the outside, whose air mass resonates with the chamber's air spring as a Helmholtz resonator. Tuned near the bottom of the driver's range, the port radiates in step with the front of the cone and extends the low-frequency response, and near the tuning frequency it carries most of the output while the cone's excursion falls. Thiele's 1961 paper set out how to choose the box volume and tuning for a given driver as a filter design, and vented boxes are standard in speakers larger than AP-40's.

This is an illustration. A larger sibling product with a 65 mm driver in a 0.4 L chamber, tuned to 150 Hz with a port 15 mm across, needs an effective port length of about 58.5 mm by the Helmholtz formula, and, with end corrections of about 0.85a at the flanged outer end and 0.61a at the inner one, a physical length of about 47.6 mm. If the driver's cone, about 20 cm² in area, moved 1 mm peak at 150 Hz, and the port carried that volume velocity, the peak air speed in a 15 mm port would be about 10.7 m/s. Designers keep peak port speeds modest, often below a few per cent of the speed of sound, here about 17 m/s for 5%, because faster air in a small port produces turbulence noise, **chuffing**, and compression that limits the output. A 20 mm port would carry the same flow at about 6 m/s but would need to be about 89 mm long, which may not fit, the usual dilemma of small vented boxes.

A **passive radiator** solves it in many small products: a second diaphragm, with no motor, mounted in the enclosure wall and weighted so that its mass resonates with the box's air spring at the tuning frequency. It does a port's job without a long tube or port noise, at the cost of a second diaphragm and its suspension, and it is common in portable speakers and smart speakers. For AP-40's 30 cm³ chamber and short prompts, neither is needed; the sealed chamber's simplicity, robustness to dust and immunity to port noise suit the job.

## Ports as air paths

A loudspeaker's port and a purifier's air outlet are acoustically the same kind of thing: an opening through which sound leaves the product, with an air mass that resonates with the space behind it. A product that has both, a vented speaker and a fan, must keep them apart. If the speaker's chamber shares air with the fan's path, the fan's pressure pushes air through the speaker's port, its noise reaches the port's resonance, and the speaker's cone sees a pressure that can move it. AP-40 keeps its speaker chamber sealed and separate from its air path, which is another reason the chamber's volume and seals are controlled dimensions.

## Exercise: a larger filter

A filter supplier offers a deeper filter with the same filtration performance but about 25% less resistance at AP-40's rated air flow. If the reduced system resistance lets the fan deliver the rated flow at about 7% lower speed, what change in sound power would the 50 log rule predict? What else should be checked?

**Worked answer.** The change is 50 × log₁₀(0.93) ≈ **−1.6 dB** on both paths, so the product's total sound power at rated flow would fall by about 1.6 dB at every setting where the fan's speed is set by the air flow, before any acoustic treatment.

The deeper filter needs space, which may compete with the inlet plenum, and its absorption and resonances in the cabinet may differ. Its resistance as it loads with dust should also be compared with the original's, because the speed the fan needs late in the filter's life, when the product is noisiest, matters as much as the speed with a new filter. The measurement at rated flow, with new and with loaded filters, settles both.
