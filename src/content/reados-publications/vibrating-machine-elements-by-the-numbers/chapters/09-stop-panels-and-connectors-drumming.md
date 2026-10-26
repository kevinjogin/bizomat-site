---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: stop-panels-and-connectors-drumming
order: 9
title: "Stop panels and connectors drumming"
description: "Estimate the modes of a flat sheet metal panel and a fabric duct connector, see why added mass makes drumming worse, and stiffen RF-3's housing clear of the 1× bands."
draft: false
---

A flat sheet metal panel is a two-dimensional version of a string or a bar. Waves run across it in both directions, reflect from its edges and form standing patterns: one hump, two humps side by side, two humps one above the other, and so on. Each pattern has its own frequency. When a fan's frequency lands on one of them, the panel drums, radiating noise and shaking whatever is fixed to it.

This chapter estimates the modes of RF-3's housing side panel and its fabric inlet connector. The panel is governed by bending stiffness, the connector by tension, and the difference changes what can be done about them. It compares the usual field fixes, including one that makes the problem worse, and ends with a rule for variable-speed plant that the resonance register in Chapter 10 adopts.

## Modes of a flat panel

For a thin, flat rectangular plate of sides a and b, thickness h, with all four edges simply supported, meaning held in position but free to rotate, the natural frequencies are:

**f = (π ÷ 2) × [(m ÷ a)² + (n ÷ b)²] × √(D ÷ (ρ h))**

where m and n count the half-waves across each side, ρ is the density, and D is the plate's bending stiffness:

**D = E h³ ÷ (12 (1 − ν²))**

with ν, Poisson's ratio, about 0.3 for steel. The thickness appears cubed in D and once in ρh, so the frequencies rise in direct proportion to thickness. The side lengths appear squared, so halving a panel's span roughly quadruples its frequency in that direction.

Unlike a string, the higher modes of a plate are not whole multiples of the first. They crowd closer together as frequency rises, which matters when the excitations are high.

## RF-3's side panel

This is an illustration. RF-3's housing side panel is a flat 1.6 mm steel sheet, 900 mm by 600 mm between its folded flanges. Taking E = 200 GPa, ν = 0.3 and ρ = 7,850 kg/m³:

- D = 200 × 10⁹ × 0.0016³ ÷ (12 × 0.91), about **75.0 N·m**;
- ρh = 7,850 × 0.0016, about **12.56 kg/m²**;
- √(D ÷ ρh) is about 2.444 m²/s.

The first mode, one half-wave each way, is:

**f₁₁ = 1.5708 × (1 ÷ 0.81 + 1 ÷ 0.36) × 2.444 ≈ 15.40 Hz**

```figure
type: compare
title: First modes of RF-3's 900 × 600 × 1.6 mm side panel
rowhead: Mode, half-waves along 900 and 600
cols: Frequency | Nearest RF-3 excitation at full speed
caption: This is an illustration with simply supported edges. The first mode sits within half a per cent of the fan speed at full speed, and the higher modes crowd into the blade-pass band.
- * 1, 1 | 15.4 Hz | fan 1×, 15.47 Hz
- 2, 1 | 29.6 Hz | fan 2×, 30.9 Hz
- 1, 2 | 47.4 Hz | fan 3×, 46.4 Hz; motor 2×, 48.3 Hz
- 3, 1 | 53.3 Hz | between harmonics
- 2, 2 | 61.6 Hz | fan 4×, 61.9 Hz
- 3, 2 and 4, 1 | 85.3 and 86.5 Hz | inside blade-pass band
- 1, 3 and 2, 3 | 100.7 and 114.9 Hz | inside blade-pass band
```

The first mode at 15.40 Hz is within 0.5 per cent of the fan's full-speed frequency of 15.47 Hz. The fan meets it at about 49.8 Hz supply, which is where it spends its working day. RF-3's side panel should drum, and in this case it does.

Drumming matters for more than noise. A panel vibrating in its first mode bends hardest at its centre and rotates most at its edges, so the fixings along the flanges work back and forth with every cycle. At 15 Hz that is over 50,000 cycles an hour. Screws loosen, sealant cracks and lets weather in, and in welded housings fatigue cracks can start at the corners of the panel or at the ends of stitch welds. Anything fixed to the panel, such as a pressure switch, a cable tray bracket or an access door latch, is shaken at the panel's amplitude, not the frame's. A panel that drums is worth fixing even where nobody can hear it.

## Real edges

Simply supported edges are an idealisation. A panel welded or folded into a stiff frame behaves closer to a clamped edge, which raises its frequencies substantially. A panel held by widely spaced screws into a light frame can be softer than simply supported, because the frame itself moves. RF-3's panel is bolted at its folded flanges into the housing frame, which places it somewhere between the two.

That uncertainty is why panel frequencies are confirmed by measurement. A tap test is quick: with the fan stopped, tap the panel's centre with a soft mallet and record the ringing with a vibration analyser or a phone spectrum app held against the panel. The lowest strong peak is the first mode. For the case, suppose the tap test reads 15.8 Hz, close enough to the calculation to confirm the problem and to show that the flanges hold the edges a little more firmly than simple supports.

## A failure case: weighing it down

This is an illustration. A maintenance crew, told that the panel "vibrates", bolts a 6 mm steel plate to its centre to "calm it down". The added plate roughly doubles the panel's effective mass without adding much stiffness across the full span.

Doubling the mass at the same stiffness divides the frequency by √2: 15.40 ÷ 1.414, about **10.9 Hz**. At full speed the panel is now well below the fan speed and quieter. But 10.9 Hz is inside the fan's 1× band, and the fan meets it at about 35.2 Hz supply, which is the evening operating speed found in Chapter 8. The drumming has not gone. It has moved to the evenings, when the office below is quiet and the hum is more noticeable.

The error was detected when the evening complaints began and a run-up test, slowly sweeping the drive from 30 Hz to 50 Hz while watching the panel, showed the drumming at about 35 Hz supply. The correction was to remove the plate and stiffen the panel instead. The general rule: adding mass lowers natural frequencies, and on a variable-speed machine lowering a frequency usually moves it into, not out of, the excitation bands.

## Stiffening options

Stiffness, not mass, is the lever. A folded-channel stiffener across the short span, fixed at both ends into the housing frame, divides the panel into two smaller panels. Thicker sheet raises the frequency in proportion.

```figure
type: bars
title: First mode of RF-3's side panel for each option
unit: Hz
max: 60
caption: This is an illustration with simply supported edges. The fan 1× band, widened by the 15 per cent margin, runs to about 17.8 Hz; the motor 1× band to about 27.8 Hz.
- Added steel plate | 10.9
- * As built, 1.6 mm, 900 × 600 | 15.4
- 2.0 mm sheet, no stiffener | 19.25
- One stiffener, 1.6 mm, two 450 × 600 panels | 29.62
- One stiffener, 2.0 mm, two 450 × 600 panels | 37.03
- Two stiffeners, 1.6 mm, three 300 × 600 panels | 53.32
```

Each option needs checking against all the bands, not just the one that caused the complaint.

- **2.0 mm sheet alone,** 19.25 Hz, clears the fan 1× band but sits inside the motor 1× band of 14.5 Hz to 24.2 Hz. The motor shares the base frame, so its unbalance reaches the housing.
- **One stiffener in 1.6 mm,** 29.6 Hz, lands within about 4 per cent of the fan 2× harmonic at full speed. Not acceptable as a fix for a fan that runs at full speed all day.
- **One stiffener in 2.0 mm,** 37.0 Hz, clears both 1× bands by a wide margin. It crosses the motor 2× harmonic near 38.3 Hz supply and the fan 3× harmonic near 39.9 Hz supply.
- **Two stiffeners in 1.6 mm,** 53.3 Hz, also clears both 1× bands. It sits about 10 per cent above the motor 2× harmonic at full speed and crosses the fan 4× harmonic near 43.1 Hz supply.

Both of the last two options leave harmonic crossings within the drive range, as the belt spans did in Chapter 3. Between about 14.5 Hz and 62 Hz the shaft harmonics of a fan on a 30 Hz to 50 Hz drive cover almost every frequency. A sheet metal panel cannot be placed clear of all of them.

## A rule for variable-speed plant

The belts, the ropes and the panel all lead to the same practical rule, which the case adopts:

```figure
type: steps
title: Placing natural frequencies on variable-speed plant
caption: The 1× bands carry the largest forces from unbalance; the harmonics come mainly from alignment and looseness, which maintenance can control.
- Clear the 1× bands with margin | fan and motor running speed across the whole drive range
- * Accept harmonic crossings with a record | note the crossing speed for each one
- Reduce harmonic forcing | balance, alignment, tight fixings, true pulleys
- Add damping where crossings remain | damping treatments or joints that rub
- Watch the recorded speeds | a run-up test after any change
```

For RF-3's side panel, the field fix is two folded stiffeners in the existing 1.6 mm sheet, placing the first mode near 53 Hz, plus a damping treatment described below. The specification for future housings calls for 2.0 mm sheet with one stiffener, which reaches 37 Hz with less fabrication. Both clear the 1× bands. Both crossings with harmonics are recorded in the register.

## Prove the fix with a run-up test

A tap test finds a panel's frequencies with the fan stopped. A run-up test shows which of them the running fan actually excites, and at what speed. It is the most useful single test on variable-speed plant, and it takes about twenty minutes.

With the guards in place and the building system's control temporarily overridden, the drive is stepped from its minimum to its maximum in small increments, for RF-3 perhaps 1 Hz of supply frequency at a time, pausing at each step long enough for the vibration to settle. At each step, record the vibration at a few chosen points, here the panel centre, a fan bearing and the roof beside an isolator, as overall level and, if the instrument allows, as a spectrum. A plot of level against supply frequency shows a peak wherever a natural frequency meets an excitation.

For the stiffened RF-3 panel, the run-up would be expected to show small peaks near 43 Hz supply, where fan 4× crosses the 53 Hz first mode, and nothing large near full speed. A large peak at 49 Hz to 50 Hz would mean the stiffeners are not doing what the calculation assumed, for instance because their ends are not fixed into the frame and the panel and stiffener move together.

Keep the record. A run-up repeated after any later change, a new motor, new belts, a rebalanced impeller or a modified housing, compared with the first one, shows whether anything has moved. That comparison is the evidence the resonance register in Chapter 10 relies on.

## Damping a panel

Steel sheet has very little internal damping, which is why a struck panel rings. Damping treatments add energy loss. The two common types are a free layer, a viscoelastic material sprayed or bonded to one face, and a constrained layer, a thin viscoelastic layer sandwiched between the panel and a thin metal skin. The constrained layer works by shearing the viscoelastic material as the panel bends and is more effective for its weight.

Damping does not move frequencies much. It lowers the peaks. On a panel with modes crowded into the blade-pass band, such as RF-3's at 85 Hz to 115 Hz, damping is the only practical tool: no amount of stiffening clears a band that is 50 Hz wide and full of modes. Damping material ratings and temperature ranges come from the supplier and must suit a rooftop's temperature swings.

## The fabric connector, a true membrane

RF-3's inlet connects to its duct through a flexible connector: a band of coated fabric about 150 mm wide around a 900 mm by 600 mm opening. The connector lets the fan move on its isolators without loading the duct. Fabric has no useful bending stiffness, so the connector behaves as a membrane, a two-dimensional string whose wave speed depends on its tension per unit length S and mass per unit area σ:

**c = √(S ÷ σ)**

For a rectangular membrane panel of sides a and b fixed at its edges, the modes are:

**f = (c ÷ 2) × √((m ÷ a)² + (n ÷ b)²)**

This is an illustration. Suppose the fabric weighs 0.6 kg/m² and is installed with a tension of about 500 N per metre. Then c = √(500 ÷ 0.6), about 28.9 m/s. Treating the 150 mm by 900 mm long side as a membrane panel:

**f₁₁ = (28.9 ÷ 2) × √((1 ÷ 0.15)² + (1 ÷ 0.9)²) ≈ 97.6 Hz**

with the next mode close above at about 101.4 Hz. The narrow width controls the frequency; the length hardly matters. Both modes sit in the blade-pass band, where the pressure pulses inside the duct push directly on the fabric.

The membrane's frequency depends on a tension nobody measures. If the fabric is installed slacker, at 250 N per metre, the first mode falls to about 69 Hz. A connector fitted taut enough to have well-defined, high frequencies is also taut enough to carry vibration between fan and duct, defeating its purpose. A connector fitted with generous slack has low, poorly defined frequencies and flaps.

The practical answer is to accept that the connector will move, fit it with the modest slack its maker specifies, keep it clear of sharp edges it could rub against, and inspect it for wear at the folds. A connector that drums loudly at blade pass is usually too taut or too narrow; a wider band with slight slack has lower stiffness and a less defined response.

## Exercise: a smaller access panel

RF-3 has a 1.6 mm steel access panel 400 mm by 300 mm, simply supported. Find its first mode and say whether it needs action under the variable-speed rule.

**Answer.** f₁₁ = 1.5708 × (1 ÷ 0.16 + 1 ÷ 0.09) × 2.444 = 1.5708 × (6.25 + 11.11) × 2.444, about **66.6 Hz**.

That is well clear of both 1× bands, which end at about 17.8 Hz and 27.8 Hz once widened by the margin. It lies just above the fan 4× band, which reaches 61.9 Hz, by about 8 per cent at full speed, and below the blade-pass band, which starts at 74.2 Hz. Under the rule, no stiffening is needed. Record its frequency and the close approach to fan 4× at full speed, and check that the panel's fasteners are tight, since a loose access panel rattles at almost any frequency.
