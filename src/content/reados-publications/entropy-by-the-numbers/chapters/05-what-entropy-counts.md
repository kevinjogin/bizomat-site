---
book: entropy-by-the-numbers
chapterSlug: what-entropy-counts
order: 5
title: "What entropy counts"
description: "Entropy at the molecular scale: counting arrangements, S = k ln W, why spontaneous change is near certain, what mixing does, and why a cool room lowers entropy without breaking the second law."
draft: false
---

The first four chapters treated entropy as an engineering quantity: heat divided by temperature, calculated along a reversible path and checked against a table. That is all an audit needs. But it leaves an obvious question unanswered. What is the thing that rises when heat flows from hot to cold, when a gas leaks through a valve or when hot and cold water mix? Why should it never fall in total?

The answer, found by Ludwig Boltzmann in the 1870s, is that entropy counts the number of ways a system's molecules can be arranged while it looks, from outside, exactly the same. This chapter builds that idea from a simple count, connects it to the formulas already used, and shows why the second law, which looks like an absolute rule, is in fact a statement of overwhelming probability. It ends with a report that said the plant's cool room broke the second law.

## Macrostates and microstates

A plant engineer describes the compressed air in a receiver by a few numbers: pressure, temperature, volume, composition. That description is the **macrostate**. At the molecular scale, the same air is a vast number of molecules, each with a position and a velocity, and a complete list of them is a **microstate**. An enormous number of different microstates all look like the same macrostate, because a pressure gauge and a thermometer cannot tell which molecule is where.

The central idea is that, left alone, a system wanders among all the microstates available to it, and spends time in each macrostate in proportion to how many microstates it contains. Macrostates with more microstates are more probable. Equilibrium is simply the macrostate with by far the most.

## A count you can do by hand

Take a box divided into two equal halves, with N gas molecules free to move between them. Ignore everything about each molecule except which half it is in. Each molecule has two choices, so there are 2^N arrangements in all, each equally likely.

The number of arrangements with n molecules on the left is the number of ways of choosing which n, the binomial coefficient. For ten molecules there are 1,024 arrangements, and they divide as shown below.

```figure
type: bars
title: Arrangements of ten molecules between two halves of a box
caption: Total 1,024 arrangements. The even split, 5 and 5, has 252 of them; all ten on one side has just 1. With more molecules the peak becomes so sharp that nothing else is ever seen.
max: 260
- 0 on the left | 1
- 1 on the left | 10
- 2 on the left | 45
- 3 on the left | 120
- 4 on the left | 210
- * 5 on the left | 252
- 6 on the left | 210
- 7 on the left | 120
- 8 on the left | 45
- 9 on the left | 10
- 10 on the left | 1
```

With ten molecules, an even split occurs 24.6% of the time and a split of 4 to 6 or closer 65.6% of the time, but all ten crowd into one half about once in a thousand looks. With more molecules the distribution narrows rapidly. For 100 molecules, a split within 45 to 55 occurs 72.9% of the time; for 1,000, a split within 450 to 550 occurs 99.86% of the time.

```figure
type: compare
title: Chance of finding every molecule in one half of the box
rowhead: Number of molecules
cols: Chance, all in the left half | In words
caption: The chance is 2⁻ᴺ. A litre of air holds about 2.5 × 10²² molecules, so the chance for real gases is so small that it is never observed.
- 4 | 6.25 × 10⁻² | one look in sixteen
- 10 | 9.77 × 10⁻⁴ | about one in a thousand
- 20 | 9.54 × 10⁻⁷ | about one in a million
- 100 | 7.89 × 10⁻³¹ | never, in the age of the universe
- * A litre of air, about 2.5 × 10²² | 2 to the power −2.5 × 10²² | not a meaningful number
```

This is the whole of the second law, in miniature. Nothing forbids the molecules of a gas from gathering in one corner of a room. It is just that the arrangements in which they do so are a vanishingly small fraction of all arrangements, so a system that starts in such a state moves towards the even spread and, for all practical purposes, never comes back. An irreversible process is a move from a macrostate with few microstates to one with many.

## Boltzmann's formula

Boltzmann connected the count to thermodynamic entropy. If W is the number of microstates belonging to a macrostate, its entropy is

S = k ln W

where k is the Boltzmann constant, exactly 1.380 649 × 10⁻²³ J/K by the SI definition discussed in Chapter 2. The logarithm makes entropy add when systems are combined: two independent systems have W₁ × W₂ arrangements together, and ln(W₁W₂) = ln W₁ + ln W₂.

The formula can be checked against Chapter 4. When a gas doubles its volume, each molecule gains twice as many places to be, so W is multiplied by 2^N and the entropy rises by k ln 2^N = N k ln 2. For one mole, N is the Avogadro constant, 6.022 140 76 × 10²³, and N k equals the gas constant R, 8.314 J/mol·K. So the entropy rises by R ln 2 = 5.763 J/mol·K, exactly what the ideal-gas formula of Chapter 4 gives for an isothermal doubling of volume, R ln(V₂ ÷ V₁). The two definitions of entropy, one from heat and temperature, the other from counting, agree.

```figure
type: formula
title: Entropy from counting, and the same result from heat
formula: S = k × ln W
formula: Gas doubling its volume: ΔS = N × k × ln 2 = n × R × ln 2
caption: k = 1.380 649 × 10⁻²³ J/K exactly; R = N_A × k = 8.314 J/mol·K. The counting result matches Chapter 4's thermodynamic formula ΔS = nR ln(V₂ ÷ V₁).
- W | number of microstates of the macrostate
- N | number of molecules
- n | amount of gas, mol
step: One mole doubling its volume: 8.314 × 0.6931 = 5.763 J/K
```

## What the count explains in the plant

The counting picture gives a physical reading of every source of entropy in the running case.

- **Heat flowing from hot to cold.** Energy shared among more molecules, or more evenly among the same ones, has more arrangements. When heat flows from the kettle steam at 102.5 °C into cooler food, the energy spreads into a body where each joule adds more arrangements, because entropy gained per joule is 1 ÷ T and T is lower. The total count rises.
- **Compressed air expanding.** Air at 8 bar that expands to atmospheric pressure at the same temperature gives each molecule about 7.9 times the volume to move in. The entropy rises by R ln 7.9 per unit of gas constant, 0.593 kJ/kg·K, as Chapter 4 calculated from heat. A leak or a regulator lets the expansion happen without doing any work, and Chapter 8 counts the cost.
- **Two different gases mixing.** One mole each of two different ideal gases, side by side at the same pressure and temperature, each doubles its volume when the partition is removed, so the entropy rises by 2R ln 2 = 11.53 J/K. That is the entropy of mixing, and it is why separating gases, such as making nitrogen from air, always takes work.
- **Friction and electrical resistance.** A turning shaft or a current in a wire is energy in an organised form: every part of the shaft, or every conduction electron, moving together. Friction in a bearing and resistance in a heating element turn that organised motion into the random jiggling of molecules, which has vastly more arrangements. That is why work can always be turned wholly into heat, as in the plant's resistance heater of Chapter 1, while heat can never be turned wholly into work. The reverse would need random motion to organise itself, which the count forbids.
- **Hot and cold water mixing.** At the tempering valve, hot and cold water of the same substance mix. There is no entropy of mixing in the sense above, because swapping identical molecules does not create a new arrangement. The entropy generated comes entirely from the temperature equalising, and Chapter 8 calculates it.

## The size of the numbers

The counts behind everyday entropy changes are beyond imagination, and it helps to see how far. When the plant heats 1 kg of wash water from 20 °C to 60 °C, its entropy rises by 0.53472 kJ/kg·K, from Chapter 4. By Boltzmann's formula, ln W rises by 534.72 ÷ (1.380 649 × 10⁻²³) = 3.87 × 10²⁵. The number of arrangements is multiplied not by 3.87 × 10²⁵ but by e raised to that power, a number with more than 10²⁵ digits.

That is why the second law behaves like an absolute rule in a plant even though it is, underneath, a statement about probability. A process that would reduce the total entropy by even a microjoule per kelvin would need the system to find its way into a fraction of its arrangements so small that it would not happen once in any number of lifetimes of the universe. Engineers can treat "never" as never.

### Where the statistics show

At very small scales the statistics become visible. A particle of dust in water jiggles because the molecules striking it do not balance exactly at every instant, the motion observed by Robert Brown and explained by Einstein in 1905. Electrical resistors produce a faint random voltage, thermal noise, for the same reason, and sensitive instruments must be designed around it. These fluctuations are tiny departures from the most probable state, and they are the second law's statistical nature showing through. In a plant they set the floor on how quietly a sensor can measure, not on how efficiently a machine can run.

### Information has a price

The counting picture also explains a puzzle first posed by James Clerk Maxwell: a tiny, intelligent "demon" that opened a door between two compartments only for fast molecules could make one side hot and the other cold with no work, apparently breaking the second law. The resolution, developed over the following century, is that the demon must record which molecules it has seen and eventually erase that record, and erasing one bit of information at temperature T generates at least k T ln 2 of heat. At 20 °C that is 2.8 × 10⁻²¹ J per bit, a limit identified by Rolf Landauer in 1961. Measurement and control are physical processes, and they pay the second law's price like any other.

## Entropy and "disorder"

Entropy is often described as disorder, and the word is a useful first picture: a tidy arrangement is usually one of few, and a messy one is one of many. But it misleads when it is taken literally. Water freezing into ordered ice loses entropy, yet water freezes spontaneously below 0 °C, because the latent heat it releases raises the surroundings' entropy by more. Oil and water separate into tidy layers because the separated state has more arrangements once the molecules' interactions are counted. The reliable statement is the counting one: entropy measures the number of molecular arrangements compatible with what is observed, and the total of system plus surroundings rises.

## The error: a cool room that "broke the second law"

This is an illustration. A student on placement at the plant wrote a short report on the cool room. It calculated that cooling a delivery of 500 kg of product, with a specific heat of 3.6 kJ/kg·K, from 20 °C to 4 °C lowered its entropy by 500 × 3.6 × ln(277.15 ÷ 293.15) = 101.0 kJ/K, and concluded that the cool room "reverses the second law", a claim that made its way into a presentation to the plant's management.

The engineer's review added the half that was missing. The refrigeration system removed 500 × 3.6 × 16 = 28,800 kJ of heat from the product. At a COP of 2.5 it took 11,520 kJ of electrical work to do so, and rejected 28,800 + 11,520 = 40,320 kJ to the surroundings at 20 °C. The surroundings' entropy rose by 40,320 ÷ 293.15 = 137.5 kJ/K. The total change was −101.0 + 137.5 = **+36.5 kJ/K**: an increase, as the second law requires.

```figure
type: balance
title: Entropy changes in cooling 500 kg of product
left: Entropy lost by the product
right: Entropy gained by the surroundings
tilt: right
caption: This is an illustration. The product loses 101.0 kJ/K; the surroundings gain 137.5 kJ/K from the 40,320 kJ rejected at 20 °C. The net change is +36.5 kJ/K, generated by the refrigeration system's irreversibilities.
- Product cooled 20 °C to 4 °C, −101.0 kJ/K | Heat rejected at 293.15 K, +137.5 kJ/K
```

The corrected report went further, and that was its real value. A reversible machine would have needed only the work that makes the total change zero: 293.15 × 101.03 − 28,800 = 816 kJ. The real system used 11,520 kJ, about 14 times the minimum. The second law was not reversed; it was setting a target the plant was nowhere near.

## How this applies to a small Australian business

The counting picture is not needed for calculations, but it makes the second law intuitive, and that helps in conversations that are not about thermodynamics at all. Leaks, open blow-offs, mixing valves and heat drifting from hot to cold all have the same signature: something spreading out, unforced, into more arrangements, which is why it never reverses on its own and why reversing it always costs work. Explaining compressed air leaks or heat recovery to a manager in those terms is often more persuasive than an exergy table. The same picture explains why reversing any of these losses afterwards, gathering leaked air or re-separating mixed water, is never cheaper than not causing them in the first place.

## Exercise: forty molecules

A box holds 40 molecules, free to move between two equal halves. How many arrangements are there in all, how many have exactly 20 on each side, and what is the chance of finding all 40 in the left half? What is the entropy difference, in units of k, between the even split and the state with all 40 on the left?

**Worked answer.** There are 2⁴⁰ = **1.10 × 10¹²** arrangements. The number with 20 on each side is the binomial coefficient C(40, 20) = **1.38 × 10¹¹**, about 12.5% of the total. All 40 on the left is a single arrangement, so its chance is 1 ÷ 2⁴⁰ = **9.1 × 10⁻¹³**.

The entropy difference is k ln W_even − k ln W_left = k ln(1.38 × 10¹¹) − k ln 1 = **25.6 k**. Even for forty molecules, the even split is a hundred billion times more likely than complete separation; for the 10²² or so molecules in a litre of air, the difference is beyond any meaningful number.
