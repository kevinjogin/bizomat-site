---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: tune-guy-ropes-and-cables
order: 4
title: "Tune guy ropes and cables away from the machine"
description: "Find a guy rope's modes from its tension, see why a rope tuned to the fan speed matches every harmonic, screen wind-driven vibration and retension to a target."
draft: false
---

A guy rope is a string with steel anchors at both ends. Like a belt span, it has a ladder of natural frequencies set by its tension, mass and length. Unlike a belt span, nobody chose its tension with vibration in mind. It was tightened until it looked straight, and its frequency is whatever that produced.

This chapter checks the four guy ropes that brace RF-3's discharge stack. It shows how a rope can end up tuned exactly to the fan, why that puts every one of its modes on a fan harmonic at once, and how the wind adds a second, quite different source of vibration. It finishes with a retensioning method based on frequency, so all four ropes end up at the same, deliberately chosen tension.

## The stack and its ropes

This is an illustration. RF-3 discharges through a short steel stack. Its top is 2.4 m above the roof anchor plates and is braced by four guy ropes at 90 degrees to each other. Each rope runs from a lug near the stack top to an anchor 1.8 m out from the stack centre line, so each rope is 3.0 m long and rises at about 53 degrees from horizontal.

The ropes are 6 mm galvanised wire rope, taken as 0.14 kg/m including lubricant. This is a teaching value; real ropes have masses published by their makers for each construction. Each rope was tensioned with a turnbuckle during installation to an estimated 1,200 N.

```figure
type: svg
title: RF-3 discharge stack and two of its four guy ropes
alt: Side view of a vertical stack 2.4 m tall on a roof. Two guy ropes run from a lug near the stack top down to anchors 1.8 m either side of the stack, each 3.0 m long. A dashed curve on one rope shows its first mode, a single loop between lug and anchor.
caption: This is an illustration. Each rope is a 3.0 m string fixed at the lug and the anchor. Its first mode is a single loop between them.
viewbox: 0 0 640 320
body:
<path class="ln" d="M60 280H580"/>
<rect class="bx" x="304" y="40" width="32" height="240"/>
<path class="li" d="M320 40L140 280M320 40L500 280"/>
<path class="la dsh" d="M320 40Q218 148 140 280"/>
<rect class="bxa" x="128" y="276" width="24" height="8"/>
<rect class="bxa" x="488" y="276" width="24" height="8"/>
<circle class="fa" cx="320" cy="40" r="5"/>
<text class="txb" x="345" y="30">lug, 2.4 m above anchors</text>
<text class="tx txs" x="90" y="305">anchor</text>
<text class="tx txs" x="470" y="305">anchor</text>
<text class="tx txs" x="410" y="150">rope 3.0 m</text>
<text class="tx txs" x="150" y="130">first mode</text>
<text class="tx txs" x="250" y="300">1.8 m</text>
<text class="tx txs" x="372" y="300">1.8 m</text>
```

## The rope as a string

The rope's sag under its own weight is tiny at this tension. For a rope inclined at angle θ, the mid-span sag is roughly w cos θ L² ÷ (8T), where w is weight per metre. For RF-3's ropes that is 0.14 × 9.81 × 0.6 × 3.0² ÷ (8 × 1,200), about 0.8 mm on a 3 m rope. A rope that taut behaves as a straight string, and the formulas of Chapter 1 apply directly. Where sag is larger, the [catenary cable tool](/tools/catenary-cable/) gives the sag and end tensions.

For the string, the wave speed is √(T ÷ m) = √(1,200 ÷ 0.14) = **92.6 m/s**. With the rope fixed at both ends, the natural frequencies are f = n c ÷ (2L):

- **first mode, n = 1:** 92.6 ÷ 6.0 = 15.43 Hz;
- **second mode:** 30.9 Hz;
- **third mode:** 46.3 Hz.

## Tuned to the fan

Set those beside the fan's own frequencies at full speed.

```figure
type: compare
title: Rope modes against fan harmonics at full speed
rowhead: Mode
cols: Rope at 1,200 N | Fan harmonic at 50 Hz supply | Difference
caption: This is an illustration. A string's modes are whole multiples of the first, and so are a shaft's harmonics. When the first pair matches, they all match.
- * First | 15.43 Hz | 1×: 15.47 Hz | 0.3 per cent
- Second | 30.9 Hz | 2×: 30.9 Hz | under 1 per cent
- Third | 46.3 Hz | 3×: 46.4 Hz | under 1 per cent
```

The match is not a coincidence of three separate numbers. A string's modes form a harmonic series, each a whole multiple of the first. A rotating shaft's excitations form the same kind of series. If the rope's first mode matches the shaft speed, every rope mode matches a shaft harmonic at the same time. That is quite different from a plate or a beam, whose higher modes are not whole multiples of the first.

The path from the fan to the rope runs through the stack. Residual unbalance in the impeller shakes the fan housing and the stack at the shaft speed. The lug at the top of the stack moves, and that motion drives the rope from one end. A rope tuned to the shaft speed responds strongly. The symptom is a visible whipping of the ropes when the fan is at or near full speed, and sometimes an audible note.

### How a moving anchor drives a rope

A rope driven from one end responds very differently away from and at resonance. Away from resonance, the rope simply follows the lug, and its middle moves roughly as much as its end. At resonance, each cycle of lug motion adds a little energy to the standing wave, and the motion builds until the energy lost to damping each cycle matches what goes in. Wire rope has little internal damping when it is taut, so the build-up can be large. A lug moving a fraction of a millimetre can produce rope motion measured in millimetres or more at mid-span.

That is why a rope can whip on a fan that passes its own vibration acceptance checks. The fan housing and stack may be vibrating at an acceptable level, but the rope magnifies that level many times because it is tuned to it. Looking only at the fan's bearing readings would miss the problem.

Across the drive range, the fan's 1× band runs from 9.28 Hz to 15.47 Hz, so the rope's 15.43 Hz first mode is met only near the top of the range. The building system, however, runs RF-3 at full speed during the working day.

## A failure case: tightening one rope until it stopped

This is an illustration. Soon after commissioning, the site reports that one guy rope "whips" at full speed. A fitter tightens that rope's turnbuckle several turns until the whipping stops. The job is closed.

A month later a roof inspection notices that the stack leans slightly away from the tightened rope. Frequency readings on the four ropes, taken with the fan stopped, give 15.4 Hz, 15.5 Hz, 15.3 Hz and 27 Hz. The tightened rope's tension is now about m (2Lf)² = 0.14 × (6.0 × 27)², about **3,670 N**, against about 1,200 N in the others.

The horizontal pull of each rope is its tension times the cosine of its angle, 0.6 for these ropes. The tightened rope now pulls the stack top sideways with about 2,200 N, while the rope opposite pulls back with about 720 N. The net unbalanced pull of nearly 1,500 N bends the stack and loads its base flange bolts, which were never designed for it.

The error was detected by the inspection and confirmed by the frequency readings. The correction was to slacken the tightened rope, set all four ropes to a single chosen frequency, and recheck the stack for plumb. The procedure was changed so that guy ropes are always adjusted as a set, to a recorded frequency target, and never one at a time to stop a symptom.

## Choosing a better target

Three things can change: the forcing, the rope's frequencies, and the damping. Reducing the forcing comes first. A fan impeller balanced to the grade its specification calls up, for example through ISO 14694 for industrial fans, puts less 1× force into the stack at every speed. Balancing does not move any frequency, but it reduces how hard every resonance is driven.

Moving the rope's frequencies is the second step. The aim is to place the first mode clear of the fan's 1× band with margin, and to accept that the higher modes will cross some harmonics within the drive range.

```figure
type: compare
title: Options for RF-3's guy ropes
rowhead: Option
cols: First mode | Tension per rope | Assessment
caption: This is an illustration. The margin is measured against the fan 1× band, 9.28 to 15.47 Hz, widened by 15 per cent to about 17.8 Hz.
- As installed | 15.43 Hz | 1,200 N | inside the fan 1× band
- * Retension to 20 Hz | 20.0 Hz | about 2,016 N | 29 per cent above full fan speed; inside the motor 1× band
- Shorten ropes to 2.2 m | 21.0 Hz | 1,200 N | new anchors and lugs needed
- Clear all 1× bands, 27.8 Hz | 27.8 Hz | about 3,895 N | high loads on stack, lugs and anchors
```

The 20 Hz option sits inside the motor's 1× band, 14.5 Hz to 24.2 Hz, and meets the motor speed at about 41.4 Hz supply. The motor is mounted on the fan's base frame, not on the stack, so its unbalance reaches the ropes only weakly. That crossing is recorded rather than designed out. The second rope mode at 40 Hz meets the fan 3× harmonic at about 43.1 Hz supply; that is a smaller force and is also recorded.

The 27.8 Hz option clears every 1× band but more than triples the rope tension. Before choosing it, the stack, its lugs, the anchors and their fixings into the roof structure would all need checking for the higher loads, and the rope itself checked against its maker's minimum breaking force with the design factor the application requires. The case chooses 20 Hz, after a check by the responsible engineer that the stack and anchors take the higher tension.

## Wind on thin ropes

The fan is not the only thing that shakes a rope. Wind blowing across any cylinder sheds vortices alternately from each side, producing a sideways force that alternates at the shedding frequency:

**f_s = St × V ÷ D**

where V is the wind speed across the rope, D its diameter and St the Strouhal number. For a circular cylinder, St is about 0.2 over a wide range of flow conditions; Blevins's Flow-Induced Vibration, in the references, covers the background and the exceptions.

This is an illustration. For a 6 mm rope in a 5 m/s breeze, f_s = 0.2 × 5 ÷ 0.006, about **167 Hz**. That is close to the eleventh mode of the rope at 1,200 N. At 10 m/s it is about 333 Hz. Wind on thin ropes excites high modes at high frequencies, with small amplitudes but many cycles.

The first mode is reached only at very low wind speeds. For the retensioned rope at 20 Hz, the wind speed that sheds vortices at 20 Hz is 20 × 0.006 ÷ 0.2, about 0.6 m/s, where the force is tiny because vortex forces grow with the square of wind speed.

The consequence is fatigue rather than visible motion. Many small, fast bending cycles concentrate where the rope enters its end fittings. Inspection of terminations for broken outer wires is the practical check, and rope dampers are used where the problem persists on exposed sites. Large structures with long cables need specialist wind assessment; this screening is for short ropes on rooftop plant.

## Retension by frequency

Use the same string formula as for belts, with the free rope length between the end of the lug fitting and the end of the anchor fitting. The procedure for a set of guy ropes:

```figure
type: steps
title: Retensioning a set of guy ropes to a frequency target
caption: Work at height on a roof follows the site's fall-prevention procedures. The fan is stopped and isolated so the stack is still.
- Stop and isolate the fan | the stack must be still and nobody near moving parts
- Measure all four ropes first | record each frequency before touching any turnbuckle
- Calculate the target | T = 4 m L² f²; for RF-3 at 20 Hz, about 2,016 N
- * Adjust opposite pairs together | a quarter-turn at a time, alternating, so the stack stays plumb
- Re-measure all four | aim for all within about 0.5 Hz of the target
- Check the stack for plumb | and lock the turnbuckles
- Record frequency, tension and date | on the stack's maintenance record
```

Equal frequencies in ropes of equal length and construction mean equal tensions, which keeps the stack plumb. A difference of 0.5 Hz at 20 Hz is about a 5 per cent difference in tension, since tension goes as frequency squared.

### Reading the right mode

A plucked rope rings in several modes at once. A frequency meter or a phone vibration app usually reports the strongest peak, which is normally the first mode but not always. Plucking near the middle favours the first mode, which has its largest motion there. Plucking near one end excites the higher modes more. If two readings disagree by a factor of about two or three, the meter has probably locked onto the second or third mode.

A quick check is to compare the peaks the meter shows. For a taut rope, the second peak should sit at twice the first and the third at three times. If the reported frequency has a peak at half its value, the lower one is the first mode.

## Rods and wires that are not quite strings

The same method applies to other tensioned members in plant: bracing rods in frames, tensioned wire guards, and the pull-wire lines of conveyor emergency-stop switches. Their tension is set by the designer or the switch maker, and their frequencies follow from it. Two corrections are worth knowing.

The first is bending stiffness. A wire rope is flexible enough to ignore it. A solid rod is not. For a rod pinned at both ends and carrying tension T, the first natural frequency is the string value multiplied by √(1 + π² E I ÷ (T L²)), where E I is the rod's bending stiffness.

This is an illustration. A 12 mm steel bracing rod, 2.0 m long between pins, carries 5,000 N. Its mass is about 0.888 kg/m, so as a string its first frequency would be √(5,000 ÷ 0.888) ÷ (2 × 2.0), about 18.8 Hz. Its second moment of area is π × 12⁴ ÷ 64, about 1,018 mm⁴, and π² E I ÷ (T L²) works out to about 0.10. The first frequency rises by √1.10 to about **19.7 Hz**. The correction grows with mode number, because the term inside the root multiplies by n²: the second mode rises by about 18 per cent, to about 44.4 Hz instead of 37.5 Hz. Measuring a rod's frequency and using the plain string formula would therefore overstate its tension, by about 10 per cent on the first mode.

The second is the end condition. Clevis pins and turnbuckle eyes are close to pinned. Welded or clamped ends are closer to fixed and raise the frequencies further. Where tension in a rod must be known accurately, calibrate the frequency method against a known load or use a direct method such as a load cell or strain gauge.

## Exercise: one rope replaced with a heavier rope

One of RF-3's four ropes is damaged and replaced with an 8 mm rope, assumed to weigh 0.25 kg/m. The other three remain 6 mm ropes at the new 20 Hz target, about 2,016 N each. To keep the stack plumb, the new rope must carry the same tension, about 2,016 N. At what frequency should it be set? Would setting it to 20 Hz like the others be correct?

**Answer.** f = (1 ÷ (2 × 3.0)) × √(2,016 ÷ 0.25) = 0.1667 × 89.8 ≈ **15.0 Hz**.

Setting the heavier rope to 20 Hz would give a tension of 0.25 × (6.0 × 20)² = 3,600 N, nearly 80 per cent more than the others, and would pull the stack over just as in the failure case. Equal tension in ropes of different mass means different frequencies.

There is a second problem. At 15.0 Hz the heavier rope's first mode is back inside the fan's 1× band, 3 per cent below full fan speed. The better answer is to replace the damaged rope with one matching the other three, so that one frequency target serves the whole set.
