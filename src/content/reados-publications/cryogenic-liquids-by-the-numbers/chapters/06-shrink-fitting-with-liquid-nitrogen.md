---
book: cryogenic-liquids-by-the-numbers
chapterSlug: shrink-fitting-with-liquid-nitrogen
order: 6
title: "Shrink fitting with liquid nitrogen"
description: "Check a fit against its torque, find a shaft’s real contraction from NIST’s integrated data, the temperature it needs and the time to assemble, and a constant-coefficient mistake."
draft: false
---

Shrink fitting is the reason SF-180 exists. An interference fit holds a shaft in a carrier by the pressure between them, and assembling it means making the shaft smaller than the bore, or the bore bigger than the shaft, for long enough to slide one into the other. Heating the carrier is the usual way, but SF-180's carriers are heavy steel castings of about 280 kg that already carry their bearings, and they cannot be heated evenly in the workshop. So the shafts are cooled instead.

This chapter checks that the fit's interference holds the torque, using the BIZOMAT shrink fit design tool, then finds how much the shaft really contracts in liquid nitrogen from NIST's measured contraction data. It finds the temperature the shaft must reach and the time the fitters have to get it home, and ends with a calculation that used a room-temperature expansion coefficient and predicted contraction the shaft never had.

## The fit and its duty

This is an illustration. The shaft is 80 mm in diameter where it enters the carrier, with 70 mm of engagement. The carrier's hub around the bore acts like a thick ring of 140 mm outside diameter. The fit must carry 1,800 N·m of torque with a safety factor of 2 against slip. The drawing specifies a diametral interference of 0.060 to 0.095 mm, from the tolerances on the bore and the shaft, and the fitters want 0.03 mm of clearance on assembly so that the shaft slides home without force.

The [shrink or press fit design tool](/tools/shrink-fit-design/) works backwards from such a duty. From the torque, any axial load, the safety factor, the friction coefficient and the dimensions, it finds the interface pressure needed and, by Lamé's thick-cylinder theory, the diametral interference that produces it; it checks the hub's hoop and von Mises stresses at the bore against its yield strength, gives the press-in force, and gives the hub temperature needed to shrink it on with the stated clearance.

```figure
type: stats
title: SF-180's fit from the shrink fit design tool
caption: This is an illustration. Inputs: 1,800 N·m, no axial load, safety factor 2, 80 mm solid shaft, 140 mm hub, 70 mm length, friction 0.15, both parts 206 GPa and Poisson's ratio 0.3, hub yield 350 MPa, hub expansion 11.7 µm/(m·K), clearance 0.03 mm.
- 34.1 MPa | Interface pressure needed | for 1,800 N·m with a factor of 2
- * 39.3 µm | Diametral interference needed | the drawing's least, 60 µm, exceeds it
- 89.3 MPa | Hub von Mises stress at the bore | well below 350 MPa at this interference
- 90.0 kN | Press-in force at that interference | the force a press would need
```

The drawing's least interference, 0.060 mm, is half as much again as the 0.039 mm the duty needs, so the fit will hold the torque even at the loose end of its tolerances. At the tight end, 0.095 mm, the pressure and stresses are 0.095 ÷ 0.0393 = 2.4 times those in the table, about 216 MPa of von Mises stress at the bore, still below the hub's yield.

If the carrier could be heated, the same tool's relation gives the temperature: the bore must grow by 0.095 + 0.03 = 0.125 mm, which at 11.7 µm/(m·K) is a rise of 0.125 ÷ (11.7 × 10⁻⁶ × 80) = 134 K, to about **154 °C**. Heating 280 kg of carrier evenly to that temperature with bearings already fitted is exactly what the workshop cannot do, which is why the shaft is cooled instead. The tool's heating result answers a question SF-180 does not ask; its interference and stress results are the ones the station uses.

## How much does steel really shrink?

The everyday expansion coefficient of carbon and low-alloy steels, about 11 to 12.5 µm/(m·K), is a room-temperature value. Like the specific heat in Chapter 4, it falls as the steel cools, because thermal expansion comes from the same lattice vibrations that store heat. NIST publishes measured contraction, the change in length from 293 K, as a fit over the whole range down to 4 K, and that is the number to use.

```figure
type: compare
title: Contraction of an 80 mm low-alloy steel diameter cooled from 20 °C
cols: NIST measured contraction | Constant 11.5 µm/(m·K) | Difference
caption: NIST's linear expansion fit for nickel steels, used as a proxy for the shaft's low-alloy steel. The constant coefficient overstates the contraction more and more as the temperature falls.
- −50 °C | 0.062 mm | 0.064 mm | 4%
- −78.5 °C (dry ice) | 0.083 mm | 0.091 mm | 9%
- −120 °C | 0.112 mm | 0.129 mm | 16%
- −150 °C | 0.130 mm | 0.156 mm | 21%
- *−195.8 °C (liquid nitrogen) | 0.152 mm | 0.199 mm | 31%
```

At the bath's temperature, NIST's data give a contraction of 0.190% of length, which on 80 mm is **0.152 mm**. The constant coefficient predicts 0.199 mm, 31% more. The fall in the coefficient itself is the reason: the slope of NIST's curve is 12.6 µm/(m·K) at 292 K, 9.2 at 200 K, 7.9 at 150 K, 6.2 at 100 K and only 5.3 at 80 K.

```figure
type: line
title: Instantaneous expansion coefficient of low-alloy steel against temperature
x: Temperature, K
y: Expansion coefficient, µm/(m·K)
ymin: 4
ymax: 14
caption: Slope of NIST's linear expansion fit for nickel steels. The coefficient at room temperature is more than twice its value near the liquid nitrogen bath.
- 80 | 5.3
- 100 | 6.2
- 150 | 7.9
- 200 | 9.2
- 292 | 12.6
```

A constant-coefficient calculation can still be used correctly, by giving it the mean coefficient over the actual range: the total contraction divided by the temperature change. For the bath, that is 0.19017% ÷ 215.8 K = **8.81 µm/(m·K)**.

The [linear thermal growth tool](/tools/thermal-growth/) calculates the signed change in length from a constant coefficient and two temperatures, and tells the user to verify the coefficient over the range. With a length of 80 mm, a coefficient of 8.81 µm/(m·K), an initial temperature of 20 °C and a final temperature of −195.8 °C, it gives a change of **−0.1521 mm**, matching NIST's integrated value. With 11.5 µm/(m·K), it would give −0.199 mm, the error in the last row of the table.

## The clearance budget

With the shaft at the bath temperature, the clearance on assembly is the contraction less the interference:

```figure
type: range
title: Assembly clearance with the shaft at −195.8 °C
unit: mm
min: 0
max: 0.1
caption: This is an illustration. Contraction 0.152 mm from NIST data. The wanted clearance is 0.03 mm; both ends of the interference tolerance meet it.
- Wanted clearance | 0.03 | 0.03 | the fitters' minimum
- * Tightest fit, 0.095 mm interference | 0.057 | 0.057 | 0.152 − 0.095
- Loosest fit, 0.060 mm interference | 0.092 | 0.092 | 0.152 − 0.060
```

The tightest fit still has 0.057 mm, nearly twice the wanted clearance. That margin is what allows for the shaft warming during the move from bath to carrier, for frost on its surface, and for a carrier bore measured a few micrometres small.

The temperature the shaft must reach is the one at which NIST's contraction equals the interference plus the clearance, 0.125 mm on 80 mm, or 0.156%. Searching the fit gives **131 K (−142 °C)**. A shaft at the tight end of the tolerance must be colder than −142 °C when it starts into the bore. Chapter 5 showed that SF-180's shaft reaches about 150 K after 16 minutes in film boiling, which is not cold enough, and 131 K only after about 20 minutes.

## How long the fitters have

Once out of the bath, the shaft starts to warm. It gains heat from the room by convection and radiation, and the frost that forms on it at once adds the heat released as moisture freezes. Taking a convection coefficient of 10 W/(m²·K) and a surface emissivity of 0.8, the shaft gains about 2,490 W/m², or about 244 W over its 0.098 m², at first, which warms it at 6.9 K a minute.

```figure
type: compare
title: SF-180's shaft warming in air after leaving the bath
cols: Shaft temperature | Contraction left | Clearance at the tight end
caption: This is an illustration. Lumped model with NIST specific heat and contraction for nickel steels, convection 10 W/(m²·K), emissivity 0.8, room at 20 °C. Frost would add to the warming and is not included.
- *Leaving the bath | 77.4 K | 0.152 mm | 0.057 mm
- After 1 minute | 83.7 K | 0.149 mm | 0.054 mm
- After 2 minutes | 89.2 K | 0.147 mm | 0.052 mm
- After 3 minutes | 94.2 K | 0.145 mm | 0.050 mm
```

Three minutes in the air cost only 7 µm of clearance. The reason is the low expansion coefficient near the bath temperature: the first few kelvins of warming barely change the shaft's size. This is one of the practical advantages of liquid nitrogen over a milder coolant. A shaft cooled only to −80 °C would be at a temperature where the coefficient is about 9 µm/(m·K), and would lose clearance faster for each kelvin it warmed.

The danger comes later, once the shaft is in the bore. The carrier is warm, massive and in metal-to-metal contact with the shaft where they touch, and it heats the shaft far faster than air does. A shaft that stops partway into the bore can grip within seconds. The assembly must be one continuous movement: the carrier fixed and the bore checked, the shaft guided by a fixture that holds it square, pushed home to a stop without a pause, and left to warm in place.

## The error: a constant coefficient

This is an illustration. Before SF-180 was built, the workshop trialled a cheaper method: a chest freezer able to reach −120 °C, with no liquid nitrogen. The engineer's note calculated the shaft's contraction with the room-temperature coefficient: the shaft needed 0.125 mm, which at 11.5 µm/(m·K) needs a fall of 136 K, to −116 °C. The freezer could reach −120 °C, so the note concluded it would do.

The first shaft from the freezer stuck in a carrier at the tight end of the tolerance. NIST's data give a contraction at −116 °C of only **0.109 mm**, 0.016 mm short of the 0.125 mm needed, and even at the freezer's −120 °C limit only 0.112 mm. The shaft had entered the bore with no clearance at all on the tight carriers, and with too little on the others.

The supervisor found the error by checking the coefficient against measured contraction data, as the thermal growth tool's own advice says. The fix was the liquid nitrogen station and a rule written into its procedure: contraction for any temperature below about −50 °C is taken from integrated data, or from a mean coefficient calculated from it, never from a room-temperature coefficient. Thermal Expansion by the Numbers covers the heating and cooling of fits near room temperature in [Shrink and expansion fits](/reados/publications/thermal-expansion-by-the-numbers/shrink-and-expansion-fits/); this chapter is the cryogenic extension of that one.

## Frost, lubricant and the interface

A shaft lifted out of liquid nitrogen frosts over within seconds, as moisture in the air freezes onto it. The frost is thin, a few micrometres in the first minute in a dry workshop and more in humid air, but it lands exactly where the clearance is, and it melts into water in the interface once the shaft warms. Three habits keep it under control. Keep the carrier's bore clean and dry, and the shaft's own surface free of oil before it goes into the bath, since oil freezes into a skin. Move the shaft from bath to bore in one short, rehearsed movement, so the frost has little time to build. And where the drawing allows, specify an assembly compound or anti-fretting paste that the designer has approved for the fit, applied to the bore rather than the cold shaft.

Some fitters lubricate the bore with oil to ease a cold shaft in. That is a decision for the designer, not the fitter: oil in an interference fit lowers the friction coefficient on which the torque capacity depends, and the shrink fit tool's 0.15 assumes a dry, clean joint.

## Handling cold parts safely

A shaft at −196 °C causes a cold burn as quickly as a hot one causes a burn, and it can freeze to bare skin. Fitters handle cold parts with long-cuffed insulated cryogenic gloves that can be shaken off, a face shield, long sleeves and trousers worn outside boots, and tongs, slings or lifting fixtures rather than hands. Gloves are for protection against splashes and brief contact, not for holding cold metal; a glove pressed against a cold part conducts heat out of the hand through the compressed lining. Lifting gear used in the bath must be suitable for the temperature, which rules out most synthetic slings and plain carbon steel shackles, as Chapter 10 explains.

## Measuring before and after

Two measurements matter. The bore and the shaft must be measured at the same known temperature before the job, ideally 20 °C, so that the interference is known; a carrier that has stood in a cold workshop overnight has a smaller bore than its drawing says. And after assembly, once both parts are back at room temperature, the axial position of the shaft should be checked against the stop, because a shaft that gripped before it reached the stop is in the wrong place and is very hard to move. Removing it means pressing it out against the full interference, often damaging both surfaces, or cutting it out. A record for each fit, with the measured bore and shaft diameters, the bath time, the time from bath to stop and the final position, takes a minute to write and makes any later problem traceable to its cause rather than to a guess.

## Exercise: a stainless steel sleeve

A pump rebuild fits a 304 stainless steel wear sleeve, 60 mm in bore diameter, onto a shaft. Here the sleeve is the hub, so cooling it would make the fit tighter; the job instead cools a stainless steel liner, 60 mm in outside diameter, for fitting into a housing with 0.10 mm of maximum diametral interference and the same 0.03 mm clearance. NIST's fit for 304 stainless steel gives 0.2796% contraction from 293.15 K to 77.35 K. Find the contraction, the clearance, and the mean coefficient to enter in the thermal growth tool. Compare with a room-temperature coefficient of 17.3 µm/(m·K).

**Worked answer.** This is an illustration. The liner contracts 60 × 0.002796 = **0.168 mm** at the bath temperature. Against 0.10 mm of interference that leaves **0.068 mm** of clearance, more than twice the 0.03 mm wanted. The mean coefficient is 0.2796% ÷ 215.8 K = **12.96 µm/(m·K)**; entered in the thermal growth tool with 60 mm, 20 °C and −195.8 °C, it gives −0.168 mm. A room-temperature coefficient of 17.3 µm/(m·K) would predict 0.224 mm, 34% too much. Austenitic stainless steel contracts nearly half as much again as low-alloy steel, which is why stainless liners and sleeves are particularly easy to fit cold, and why a stainless part fitted into a steel housing gains interference when the assembly runs hot.
