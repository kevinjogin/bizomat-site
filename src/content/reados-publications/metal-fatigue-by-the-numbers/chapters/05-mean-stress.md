---
book: metal-fatigue-by-the-numbers
chapterSlug: mean-stress
order: 5
title: "Mean stress: Goodman, Soderberg and Gerber"
description: "Why a tensile mean stress lowers the alternating stress a part can take, how the Goodman, Soderberg and Gerber lines and the yield line work, and how to choose between them."
draft: false
---

The endurance limit of Chapter 3 is for a fully reversed cycle, with no mean stress. Most parts do not see that. The PK-20's rocker lever cycles between two tensile stresses, its spring between two shear stresses in the same direction, and its housing bolts between two values close to their preload. Each carries a mean stress as well as an alternating one, and a tensile mean makes a given alternating stress more damaging.

This chapter explains why, sets out the three classic lines that allow for it and the yield check that goes with them, and applies them to the rocker lever. It then shows what happens when the mean stress is simply left out.

## Why the mean matters

A fatigue crack grows on the tensile part of each cycle, when the crack faces are pulled apart. A tensile mean stress holds the crack open for more of the cycle and raises the stress at its tip; it also helps the slip bands that start cracks to open into surface intrusions. A compressive mean does the opposite: it holds cracks shut and, within limits, does little harm to fatigue strength. That asymmetry is why springs and shafts are shot peened, and why a preloaded bolt that is properly tight survives loads that would break a loose one.

So a part with a tensile mean stress can carry a smaller alternating stress than its endurance limit. How much smaller is a question of test data, and the data are usually plotted on a Haigh diagram: mean stress along the horizontal axis, alternating stress up the vertical axis, with each test result marked as survived or failed. The combinations that just survive form a curve that starts at the endurance limit on the vertical axis, where the mean is zero, and falls to the tensile strength on the horizontal axis, where there is no cycling at all.

### What test data look like

Tests at a non-zero mean are made by holding a constant mean load and cycling about it, at several means, until the endurance limit at each mean is found. For ductile steels, the results scatter in a band that starts at the endurance limit and curves down to the tensile strength, bowing outwards rather than running straight. Most points lie above a straight line drawn between the two ends, and close to a parabola. That is why the straight Goodman line is safe for most steels and the parabolic Gerber curve is closer to the average.

The lines are old. Gerber fitted his parabola to Wöhler's data in the 1870s; Goodman's straight line was published in an engineering textbook around 1900; Soderberg proposed his line in 1930. They have lasted because they are simple and because the scatter in real endurance limits is larger than the differences between them. For brittle materials such as grey cast iron the data fall below even the Goodman line, and a criterion fitted to the material's own data is needed.

The lines are also only as good as their end points. The Goodman line hangs between the corrected endurance limit and the tensile strength; an error of 20% in the endurance limit moves the whole left end of the line by 20%, which matters far more than the choice between Goodman and Gerber.

## Three lines and a yield check

Three simple lines are drawn through that region and used as design criteria.

```figure
type: formula
title: Mean stress criteria for infinite life, with safety factor n
formula: Goodman:  σa ÷ Se + σm ÷ Su = 1 ÷ n
formula: Soderberg:  σa ÷ Se + σm ÷ Sy = 1 ÷ n
formula: Gerber:  n σa ÷ Se + (n σm ÷ Su)² = 1
formula: First-cycle yield:  n = Sy ÷ (σa + σm)
caption: σa and σm are the local alternating and mean stresses, after the fatigue notch factor. Se is the corrected endurance limit, Su the tensile strength and Sy the yield strength. For a compressive mean stress, the KEVOS® tools use n = Se ÷ σa, ignoring the mean.
- Goodman | a straight line from Se to Su; the usual design choice
- Soderberg | a straight line from Se to Sy; more conservative
- Gerber | a parabola from Se to Su; closer to the average of test data for ductile steels
- First-cycle yield | the peak stress must stay below yield on the first cycle
```

The Goodman line passes below most test data for ductile steels, which makes it a sensible design line: conservative but not wasteful. The Gerber parabola runs through the middle of the data, so it predicts the average part; used for design it needs a larger safety factor. The Soderberg line is very conservative because it ends at yield instead of the tensile strength, and it keeps the part elastic everywhere along the line; it is used where any yielding is unacceptable, though the separate yield check usually does that job better.

The fourth line, first-cycle yield, is often forgotten. A part with a small alternating stress and a large mean may pass Goodman comfortably and still yield on its first load, which changes its shape and its residual stresses. The peak stress, σa + σm, must stay below the yield strength.

```figure
type: line
title: Haigh diagram for the PK-20 rocker lever steel
x: Mean stress, MPa
y: Alternating stress, MPa
ymin: 0
ymax: 420
legend: Goodman | Soderberg | Gerber | First-cycle yield
caption: This is an illustration. Se = 198.4 MPa, Su = 620 MPa, Sy = 410 MPa. Combinations below every line are safe for infinite life without yielding. At high mean stress the yield line, not Goodman, sets the limit.
- 0 | 198.4 | 198.4 | 198.4 | 410
- 100 | 166.4 | 150.0 | 193.2 | 310
- 200 | 134.4 | 101.6 | 177.8 | 210
- 300 | 102.4 | 53.2 | 151.9 | 110
- 400 | 70.4 | 4.8 | 115.8 | 10
- 500 | 38.4 | 0 | 69.4 | 0
- 620 | 0 | 0 | 0 | 0
```

### The safety factor along a load line

The safety factor from the Goodman equation has a geometrical meaning. If the loads on the part all rise together, its alternating and mean stresses rise in proportion, along a straight line from the origin through the working point. The safety factor is how far along that load line the working point could move before reaching the Goodman line.

That assumption, proportional loading, is the usual one but not the only one. A spring with a fixed preload and a rising stroke, or a bolt with a fixed preload and a rising external load, moves differently: the mean stays nearly fixed while the alternating stress grows. For those parts, a safety factor measured along a different path, with the mean held constant, is more honest. Chapters 8 and 9 use tools built for those cases.

## The rocker lever

From Chapter 2, the lever's nominal stresses at the hub fillet are 36.9 MPa alternating and 47.5 MPa mean. From Chapter 4, the fillet's fatigue notch factor is 1.758. Applied to both components, the local stresses are 1.758 × 36.9 = 64.9 MPa alternating and 1.758 × 47.5 = 83.4 MPa mean. From Chapter 3, the lever's corrected endurance limit is 198.4 MPa.

### The Goodman fatigue tool

The [Goodman fatigue safety factor](/tools/goodman-fatigue/) tool takes the alternating and mean stresses, the corrected endurance limit, the tensile and yield strengths and a required factor, and returns the safety factors by Goodman, Soderberg and Gerber, the first-cycle yield factor and the governing factor, which is the smaller of Goodman and yield. For a compressive mean it uses the alternating stress alone. The endurance limit is entered, not estimated, so the tool's check reminds the user to confirm that it already includes the surface, size, load, temperature and reliability factors.

```figure
type: compare
title: The PK-20 rocker lever in the Goodman fatigue tool
cols: Safety factor | Meaning
rowhead: Criterion
- * Goodman | 2.17 | the design criterion: ADEQUATE against 1.5
- Soderberg | 1.89 | the conservative line, still above 1.5
- Gerber | 2.66 | the average-part estimate
- First-cycle yield | 2.77 | the peak stress, 148.3 MPa, is far below the 410 MPa yield
- Governing | 2.17 | the smaller of Goodman and yield
caption: This is an illustration. σa = 64.9 MPa, σm = 83.4 MPa, Se = 198.4 MPa, Su = 620 MPa, Sy = 410 MPa, required factor 1.5. The three fatigue lines span 1.89 to 2.66: the choice of line matters, but less than the endurance limit and notch factor do.
```

On the load line through the lever's working point, the Goodman line is reached at a mean stress of 180.7 MPa and an alternating stress of 140.6 MPa. Dividing 140.6 by 64.9 gives the same 2.17: the lever could carry 2.17 times its present loads, in the same proportion, before reaching the Goodman line.

## The error: leaving the mean out

When the builder's design engineer first checked the lever, the calculation used the fully reversed method that had just been used for the camshaft: the alternating stress against the endurance limit. With σa = 64.9 MPa and Se = 198.4 MPa, that gave a safety factor of 3.06, and the engineer proposed thinning the lever from 16 mm to 12 mm to cut its inertia.

The check was not wrong for the camshaft, whose bending stress has no mean. It was wrong for the lever, which never reverses. Ignoring a mean stress of 83.4 MPa overstated the safety factor by 41%: 3.06 against the Goodman 2.17.

The design review caught it by comparing the lever's cycle with the camshaft's. The lever's stress never goes below 10.5 MPa nominal; it is a fluctuating tensile cycle, R = 0.125, and it needs a mean stress criterion. With the mean included, a 12 mm lever would raise both stresses by 16 ÷ 12 = 1.33 times, to 86.5 MPa alternating and 111.2 MPa mean, and the Goodman factor would fall to 1.62. That still passes the builder's 1.5, but with far less margin than the engineer believed, and the inertia saving was small. The lever stayed at 16 mm.

```figure
type: bars
title: Safety factors for the PK-20 lever by method and thickness
unit: safety factor
caption: This is an illustration. The fully reversed check ignores the 83.4 MPa mean stress and overstates the margin. The builder requires 1.5 on Goodman.
- 16 mm, fully reversed only (wrong) | 3.06
- * 16 mm, Goodman | 2.17
- 12 mm, fully reversed only (wrong) | 2.29
- 12 mm, Goodman | 1.62
```

### The lever check step by step

The builder's design file shows the lever check as a short procedure, and each step can be checked by someone who did not do it.

1. Nominal stresses from the loads and section: 10.5 to 84.4 MPa, so 36.9 MPa alternating and 47.5 MPa mean (Chapter 2).
2. Corrected endurance limit, with each factor written down: 310 × 0.821 × 0.898 × 1 × 1 × 0.868 = 198.4 MPa (Chapter 3).
3. Fatigue notch factor at the hub fillet: Kt = 1.8 from the chart, a = 0.223 mm, q = 0.947, Kf = 1.758 (Chapter 4).
4. Local stresses: 64.9 MPa alternating, 83.4 MPa mean.
5. Safety factors: Goodman 2.17, yield 2.77; governing 2.17 against 1.5 required.
6. Record what the check does not cover: a corrosive atmosphere, a change to the cam profile, and any jam load above the 2,400 N peak.

The last step matters as much as the others. The check is valid only for the loads, material and finish it assumed; the record of what it left out is what tells a future engineer when to redo it.

## The equivalent fully reversed stress

For infinite life, the Goodman line answers the whole question. For finite life, the S-N line of Chapter 6 needs a single stress amplitude, and S-N data are usually for fully reversed loading. The Goodman relation converts a cycle with a mean into the fully reversed alternating stress that would do the same damage.

```figure
type: formula
title: Equivalent fully reversed stress by Goodman
formula: σar = σa ÷ (1 − σm ÷ Su)
formula: lever: σar = 64.9 ÷ (1 − 83.4 ÷ 620) = 75.0 MPa
caption: This is an illustration. The lever's cycle, 64.9 MPa about a mean of 83.4 MPa, is treated as equivalent to 75.0 MPa fully reversed. Because 75.0 MPa is well below the 198.4 MPa endurance limit, the lever has infinite life on this estimate. The fatigue design check tool uses the same conversion for its life estimate.
- σar | equivalent fully reversed alternating stress
- σa, σm | local alternating and mean stresses
- Su | tensile strength
```

The safety factor and the equivalent stress tell the same story in two ways: Se ÷ σar = 198.4 ÷ 75.0 = 2.65 is not the Goodman safety factor, because it scales only the alternating stress while holding the mean fixed. Neither number is wrong; they answer different questions, and a report should say which one it gives.

## Shear mean stress

The PK-20 camshaft carries a steady torque, which gives a mean shear stress at the fillet with no alternating part. Tests on steels in torsion show that a mean shear stress has much less effect on fatigue strength than a tensile mean normal stress of the same size, as long as the peak stays below the shear yield strength. A crack running under shear is not held open by the mean the way a crack under tension is.

The common design approach, used in Chapter 7, nevertheless combines the shear mean with the normal mean by von Mises and treats the result like a tensile mean. That is conservative. For the camshaft it adds a mean of 45.0 MPa to a bending cycle that otherwise has none, and lowers the turned shaft's Goodman factor by about 7%, from 1.54 to 1.43; it costs a little margin and saves an argument about how much credit the shear mean deserves.

## Compressive means and residual stress

A compressive mean stress, in the tools' convention, is simply ignored: the safety factor is Se ÷ σa. Test data for steels show that a modest compressive mean actually raises the alternating stress a part can take, so ignoring it is conservative. A large compressive mean can cause yielding in compression, and the yield check still applies.

This is the basis of the most effective fatigue improvements. Shot peening, cold rolling of fillets and thread roots, and surface hardening all leave a compressive residual stress in the surface layer, where cracks start. That residual stress adds to the mean stress at the surface. A residual stress of −300 MPa at the surface of a spring wire can turn a tensile mean of 300 MPa into roughly zero at the critical point. Its benefit depends on the residual stress surviving in service: a high temperature, or an overload that yields the surface, can relax it.

## Which criterion to use

```figure
type: decision
title: Choosing the mean stress criterion
question: What kind of part and evidence is this?
- Ductile steel, design check | Goodman, with the first-cycle yield check; the builder's default
- Any yielding unacceptable, or yield strength close to tensile | Soderberg, or Goodman with a strict yield check
- Estimating the average life of existing parts, or comparing with tests | Gerber
- Brittle material, cast iron | a criterion from the material's own data; these lines do not apply
- Spring wire or bolts | the tools for springs and bolts, which use the right load path (Chapters 8 and 9)
caption: Many design codes for specific products, such as cranes, pressure vessels and welded structures, prescribe their own method. Where a code applies, it governs.
```

## Exercise: the lever with a cross-hole

Chapter 4's exercise put a 10 mm cross-hole in the lever, with local stresses of 60.2 MPa alternating and 77.4 MPa mean at the hole's edge. Using the lever's Se = 198.4 MPa, Su = 620 MPa and Sy = 410 MPa, find the Goodman, Soderberg and first-cycle yield safety factors. Does the hole meet the builder's 1.5?

**Worked answer.** Goodman: 1 ÷ n = 60.2 ÷ 198.4 + 77.4 ÷ 620 = 0.3034 + 0.1248 = 0.4283, so n = 2.33. Soderberg: 1 ÷ n = 0.3034 + 77.4 ÷ 410 = 0.3034 + 0.1888 = 0.4922, so n = 2.03. First-cycle yield: n = 410 ÷ (60.2 + 77.4) = 2.98.

The governing factor is the smaller of Goodman and yield, 2.33. The hole meets the builder's 1.5 with a good margin, and it is slightly less critical than the hub fillet (2.17), because the nominal stress at the hole's section is lower. Both points should still be checked on every revision: changing the load or the arm's shape could move the critical point from one to the other.
