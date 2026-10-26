---
book: water-hammer-by-the-numbers
chapterSlug: what-a-pressure-surge-is
order: 1
title: "What a pressure surge is and why it travels"
description: "See why stopping a water column is a wave problem rather than a force problem, meet the 900 m rising main used throughout, and list the events that start a surge."
draft: false
---

A pipeline full of moving water carries a great deal of momentum. When something changes the flow quickly, such as a valve closing, a pump stopping or a check valve slamming, that momentum has to go somewhere. It goes into pressure. Because water is slightly compressible and steel pipe slightly elastic, the pressure change does not appear everywhere at once. It starts at the point of disturbance and travels along the pipe as a wave.

This chapter introduces the running case, a 900 m rising main from a pump station to a hill tank, and uses it to show why a surge must be treated as a wave. A simple force calculation that treats the water as a rigid column gives sensible answers for slow changes and absurd ones for fast changes. The wave picture fixes that, and it introduces the two numbers that organise the rest of the book: the wave speed and the time a wave takes to cross the pipe and return.

## The running case

This is an illustration. A pump station at a dam lifts process water to a header tank on a hill. The essentials are:

- **Pipe:** steel, 168.3 mm outside diameter, 7.1 mm wall, 154.1 mm bore, 900 m long. Its bore area is π × 0.1541² ÷ 4, about **0.01865 m²**.
- **Flow:** 30 L/s, so the mean velocity is 0.030 ÷ 0.01865, about **1.61 m/s**.
- **Levels:** pump at RL 100 m; the line rises to RL 118 m at chainage 300 m and RL 138 m at a high point near chainage 600 m, then flattens to a motorised inlet valve at RL 141 m beside the tank, whose water level is RL 142 m.
- **Losses:** pipe friction of about 13.9 m at full flow, using a Darcy friction factor of 0.018 as a teaching value, and about 2.1 m across the fully open inlet valve.
- **Pump:** delivers 58 m of head at 30 L/s, putting the hydraulic grade line (HGL) at RL 158 m at the pump.
- **Rating:** valves and flanged fittings are PN16, a nominal 1.6 MPa, or about 163 m of water head.

```figure
type: svg
title: The rising main from pump to hill tank
alt: A profile drawing. The pipe rises from a pump at RL 100 m on the left, steeply to RL 118 m at 300 m chainage and RL 138 m at a high point near 600 m, then gently to an inlet valve at RL 141 m beside a tank at 900 m whose water level is RL 142 m. A straight sloping line above the pipe shows the steady hydraulic grade line falling from RL 158 m at the pump to about RL 144 m at the valve.
caption: This is an illustration, vertical scale exaggerated. The steady hydraulic grade line sits above the pipe everywhere, so pressure is positive along the whole line when the water is flowing steadily.
viewbox: 0 0 640 320
body:
<path class="lf" d="M60 280H600"/>
<path class="li" d="M60 280L233.3 208L406.7 128L493.3 122L580 116"/>
<path class="la dsh" d="M60 48L580 103.6"/>
<circle class="bxa" cx="60" cy="280" r="10"/>
<rect class="bx" x="580" y="84" width="50" height="46"/>
<path class="lf" d="M580 112H630"/>
<rect class="fa" x="574" y="110" width="10" height="12"/>
<circle class="fa" cx="406.7" cy="128" r="4"/>
<text class="txb" x="20" y="306">pump, RL 100</text>
<text class="tx txs" x="70" y="40">HGL RL 158</text>
<text class="tx txs" x="470" y="80">HGL RL 144</text>
<text class="tx txs" x="370" y="150">high point, RL 138</text>
<text class="tx txs" x="200" y="230">RL 118</text>
<text class="txb" x="470" y="160">valve and tank</text>
<text class="tx txs" x="250" y="306">900 m of 154.1 mm bore steel</text>
```

Keep that drawing in mind. The steady grade line sits well above the pipe everywhere, so the pipe is under positive pressure along its whole length in normal running. Chapter 7 shows how a pump trip can drag the grade line down below the high point.

## Head, pressure and the grade line

This book works mostly in metres of head, because head adds and subtracts cleanly with elevations and friction losses. The hydraulic grade line is the level water would rise to in a standpipe tapped into the main at any point. The pressure head at a point is the grade line's level minus the pipe's level there, and the pressure is that head times ρg, about 9.79 kPa per metre for water at the temperatures used here.

In steady running, the case's grade line falls in a straight line from RL 158 m at the pump to about RL 144.1 m just upstream of the inlet valve, losing the 13.9 m of friction along the way. So:

- **at the pump,** the pressure head is 158 − 100 = 58 m, about 0.57 MPa;
- **at the high point,** chainage 600 m, the grade line is at about RL 148.8 m, so the pressure head is about 10.8 m, or roughly 105 kPa;
- **at the inlet valve,** the pressure head is about 144.1 − 141 = 3.1 m.

A surge moves the grade line up and down, quickly and by large amounts, while the pipe stays where it is. Wherever the grade line rises far above the pipe, pressure exceeds ratings. Wherever it falls below the pipe, pressure is below atmospheric. Wherever it falls about 10 m below the pipe, the water reaches its vapour pressure and boils at ambient temperature. Every later chapter is a way of finding how far the grade line moves.

## A rigid column: the force picture

Treat the water as a solid plug first. The pipe holds ρAL = 998 × 0.01865 × 900, about **16.8 tonnes** of water, moving at 1.61 m/s. Its momentum is about 27,000 kg·m/s.

To stop that plug in a time t needs an average force of momentum ÷ t. Spread over the bore area, that force is a pressure, and expressed as head it gives the **rigid-column** estimate:

**ΔH = L V ÷ (g t)**

For a 10 s stop: 900 × 1.61 ÷ (9.81 × 10), about **15 m**. For 1 s: about **148 m**. For 0.1 s: about **1,480 m**, or about 14.5 MPa.

The first answer is reasonable. The second is large but plausible. The third is wrong. A real steel main closed in a tenth of a second does not see 1,480 m. The rigid-column picture has broken down, because it assumes the whole column stops at once. It cannot: the far end of the column does not yet know the valve has shut.

## The wave picture

Water is compressible. Its bulk modulus, the pressure needed to squeeze a volume by a given fraction, is about 2.19 GPa at ordinary temperatures, which is stiff but not infinitely stiff. When a valve closes suddenly, the layer of water against it stops and is compressed. That layer then stops the layer behind it, and so on. A front of stopped, compressed water moves back up the pipe.

In water alone, the front would travel at the speed of sound in water, √(K ÷ ρ) = √(2.19 × 10⁹ ÷ 998), about **1,481 m/s**. Steel pipe stretches a little as the pressure rises, which lowers the speed. Chapter 2 calculates it for this pipe as about **1,343 m/s**.

Behind the front, the water is stopped and its pressure is raised by a fixed amount. Ahead of it, the water is still flowing as if nothing had happened. The pressure rise does not depend on how long the pipe is, only on how much the velocity changed and how fast the wave travels. Chapter 3 gives the relation and its result for this case: about 220 m of head, or 2.16 MPa, for an instant stop from 1.61 m/s.

### Where the energy goes

The moving column's kinetic energy is ½ m V² = 0.5 × 16,752 × 1.61², about **21.7 kJ**. That is roughly the energy of a small car rolling at walking pace, not a large amount. When the column stops, the energy does not vanish. It is stored, briefly, as compression of the water and stretch of the pipe wall, and then released as the wave reflects and the water starts moving the other way.

The pressures are high because the storage is stiff. A small amount of energy pushed into a very stiff spring produces a large force. Anything that makes the system softer, such as a pocket of gas in a surge vessel or a more flexible pipe wall, stores the same energy at lower pressure. That idea underlies most surge protection, and Chapter 8 returns to it.

That is why the 0.1 s rigid-column answer was absurd. No closure, however fast, can produce more than the wave value, because no closure can stop more water than the wave front has reached.

## Two times that organise the problem

The wave crosses the pipe in L ÷ a = 900 ÷ 1,343, about **0.67 s**. It reaches the pump end, reflects and returns to the valve after **2L ÷ a, about 1.34 s**. This round-trip time is called the **pipe period**, and it divides closures into two kinds:

```figure
type: compare
title: Fast and slow changes in the 900 m main
rowhead: Change completed in
cols: How to think of it | Size of surge
caption: This is an illustration. The pipe period 2L ÷ a is about 1.34 s. Chapter 5 shows that a valve's stroke time and its effective closure time are not the same thing.
- * Less than 1.34 s | a wave: the reflection has not returned before the change is complete | full wave surge, about 220 m
- A few pipe periods | wave reflections partly relieve the surge as it builds | less than full, more than rigid-column
- Many pipe periods, slowly and evenly | close to the rigid-column picture | modest, roughly L V ÷ (g t)
```

A change completed within one pipe period gives the full surge. A change spread over many periods lets returning reflections relieve the pressure as it builds, and the rigid-column estimate becomes a fair guide. The two pictures meet in between. Chapters 4 and 5 follow that transition with the case's numbers.

## How fast is fast

The pipe period makes "fast" a property of the pipeline, not of the valve. A closure that takes 1 s is fast on the 900 m main, whose period is 1.34 s, and slow on a 50 m plant line, whose period, at the same wave speed, is about 0.07 s. The same valve can be safe on one line and dangerous on another.

Many everyday devices act within a pipe period of a long main. A quarter-turn ball or butterfly valve swung by hand can close in about a second. Solenoid valves act in fractions of a second. A small pump with little rotating inertia, tripped by a power failure, loses most of its flow in a second or two. A swing check valve can slam shut in a fraction of a second once reverse flow begins. On a short line inside a plant, the same devices may be slow compared with the pipe period, which is why water hammer is mostly a problem of long lines, high velocities and stiff pipes.

It follows that a pipeline's transient behaviour should be reviewed whenever its length, its velocity or any fast-acting device on it changes. Extending a main, increasing flow, replacing a geared valve actuator with a faster one, or fitting a different check valve all change the comparison between action time and pipe period.

## What starts a surge

Any rapid change of flow anywhere in the system starts a wave. The common sources on a pumped main:

```figure
type: steps
title: Events that start a pressure surge in a pumped main
caption: Each event changes the velocity somewhere in the line, and every velocity change launches a pressure wave. Chapters 5 to 7 work through the most important ones for the case.
- Valve closure or opening | inlet, isolation, control or float valves; the faster the effective closure, the larger the surge
- * Pump trip | a power failure stops the pump; the flow falls, and a low-pressure wave runs down the line
- Pump start | flow accelerates; a surge if the discharge valve opens fast or the line is partly empty
- Check valve slam | reverse flow develops before the valve shuts, then stops suddenly
- Column separation | pressure falls to vapour pressure; a cavity forms and later collapses
- Trapped air | an air pocket compresses and expands, or is expelled through a valve that then slams
```

## What a surge does

The damage from water hammer is mechanical and often delayed. Pressures above the rating of the weakest component split valve bodies, blow gaskets and crack fittings. Unbalanced forces at bends and dead ends, which normally carry only the steady pressure, can jump by a factor of several and move pipes on their supports or shear anchor bolts. Repeated surges, even those within the static rating, fatigue joints and plastic pipe. Low pressures can pull in groundwater or air through joints, collapse thin-walled or plastic pipe, and form vapour pockets whose collapse produces some of the highest pressures of all.

Often the only visible sign is a bang in the pipework when a pump stops, which people learn to ignore. It is a pressure wave doing work on the system.

## A failure case: designing to the steady pressure

This is an illustration. An early design note for the case's main reads: "Maximum pressure at pump 58 m, 0.57 MPa. PN16 fittings give a factor of almost three. Acceptable." The note does not mention transients.

The steady pressure is correct, and PN16 is ample for it. But the instant-closure surge from Chapter 3 adds about 220 m to the steady head. At the pump end that would be 58 + 220 = 278 m, about 2.7 MPa, nearly 1.7 times the PN16 rating. Even the slower events in later chapters add more than 100 m in plausible cases.

The error was detected at design review by asking one question: "What happens when the pump stops or the valve shuts?" The correction was to add a transient check to the design basis: list the events that change flow, estimate each surge by the methods in this book, compare the envelopes with the ratings and with vapour pressure, and commission a surge study if the screening shows any concern. The [water hammer pressure surge tool](/tools/water-hammer/) gives the first screening number.

The same review added a second line to the design basis: the minimum pressure. A design note that checks only the maximum misses half the problem. On this main, as Chapter 7 shows, the more likely damage comes from the grade line falling below the high point after a pump trip, not from it rising above the PN16 rating.

## Exercise: a shorter, slower pipe

A 200 m PVC line carries water at 1.2 m/s. Its wave speed, from Chapter 2's method, is about 360 m/s. Find the pipe period. Using the rigid-column formula, estimate the surge for a valve closed in 5 s and in 0.5 s. Which estimate can you trust?

**Answer.** The pipe period is 2 × 200 ÷ 360, about **1.11 s**.

Rigid-column for 5 s: 200 × 1.2 ÷ (9.81 × 5), about **4.9 m**. For 0.5 s: about **49 m**.

The 5 s closure spans about four and a half pipe periods, so the rigid-column estimate is a reasonable first guide, subject to the valve-characteristic warning in Chapter 5. The 0.5 s closure is shorter than the pipe period, so the wave relation applies instead: 360 × 1.2 ÷ 9.81, about **44 m**. The rigid-column figure of 49 m overstates it, and in a stiffer pipe with a higher wave speed the error would run the other way. Below one pipe period, use the wave relation.
