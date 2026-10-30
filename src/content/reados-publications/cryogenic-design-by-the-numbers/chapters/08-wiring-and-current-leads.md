---
book: cryogenic-design-by-the-numbers
chapterSlug: wiring-and-current-leads
order: 8
title: "Wiring and current leads"
description: "Why a current lead leaks about 45 W/kA whatever its metal, how to size one, what happens away from its design current, instrument wiring and anchoring, and leads run at 150 A."
draft: false
---

Every electrical conductor into a cryostat is a heat path. A thin instrument wire leaks very little and is easily managed; a current lead that must carry 100 A into a superconducting coil is a different matter. Make it thick, and it conducts heat in from the warm end like a copper bar. Make it thin, and the current heats it like a fuse wire. Somewhere between lies a best size, and at that size the lead still leaks a definite, irreducible amount of heat for every ampere it carries.

This chapter derives that minimum from the Wiedemann–Franz law of Chapter 6, sizes CT-40's copper leads for 100 A from NIST's copper data, shows what happens when such a lead carries less or more than its design current, counts the heat leak of CT-40's 32 instrument wires and explains how they are anchored, and ends with a test that ran the 100 A leads at 150 A.

## Two heats in one conductor

A current lead running from a warm end at T_h to a cold end at T_c carries heat by conduction, down its temperature gradient, and generates heat by its own resistance, I²R, all along its length. Both end up at the cold end, or at the warm end, depending on the lead's shape. A short, thick lead has little resistance but conducts strongly. A long, thin lead conducts little but generates a lot of heat, and if it is too thin for its current it overheats and burns out.

For a lead of length L and section A, the answer depends only on the ratio L ÷ A and on the current. Writing the heat balance along the lead, with the conductivity k(T) and the resistivity ρ(T) of its material, and choosing L ÷ A so that no heat flows at the warm end, gives the least possible heat at the cold end. McFee published this optimisation in 1959, and it is the basis of conventional lead design.

When the material obeys the Wiedemann–Franz law, k(T) × ρ(T) = L₀ × T, the optimum has a remarkably simple form:

```figure
type: formula
title: Minimum cold-end heat of an optimised, conduction-cooled current lead
formula: Q_min ÷ I = √[L₀ × (T_h² − T_c²)]
formula: L₀ = 2.443 × 10⁻⁸ W·Ω/K²
caption: Derived by combining the lead's heat balance with the Wiedemann–Franz law and requiring zero heat flow at the warm end. The result does not depend on the material, only on the two temperatures; the material sets the optimum L ÷ A.
- Q_min | heat reaching the cold end from one lead, W
- I | current, A
- T_h, T_c | warm and cold end temperatures, K
```

For CT-40, from 293.15 K to 40 K, the formula gives **0.0454 W/A, or 45.4 W per kiloampere**, for each lead. Ballarino's lecture on current leads for the CERN Accelerator School gives about 47 W/kA for a conduction-cooled lead from ambient to 4.2 K and notes the same independence of material; the formula gives 45.8 W/kA for 293 K to 4.2 K with the Sommerfeld Lorenz number, and 47.0 W/kA with the rounded value of 2.45 × 10⁻⁸ and a 300 K warm end. The cold end temperature hardly matters, because T_c² is small beside T_h².

The independence of material is the striking part. A brass lead, a copper lead and an aluminium lead, each optimised, leak the same heat. A poor conductor needs a shorter, fatter shape, a good conductor a longer, thinner one, but the minimum is the same. Real metals depart a little from the Wiedemann–Franz law, as Chapter 6 showed for copper near 30 K, and Ballarino notes that the minimum then changes by only a few per cent.

## CT-40's leads

This is an illustration. CT-40 has two leads, out and back, each carrying up to 100 A. At their optimum each leaks 0.0454 × 100 = **4.54 W**, so the pair leaks **9.08 W**, by far the largest item in CT-40's heat budget and almost a third of the cooler's 30 W.

The optimum shape follows from integrating the heat balance with NIST's conductivity for copper of RRR 50, using the Wiedemann–Franz law for its resistivity. Under the optimum condition the heat flow at each temperature is I × √[L₀ × (T_h² − T²)], so L ÷ A is the integral of k(T) divided by that heat flow, from T_c to T_h:

```figure
type: steps
title: Optimum shape of CT-40's copper leads for 100 A
caption: This is an illustration. NIST conductivity for OFHC copper of RRR 50; resistivity from the Wiedemann–Franz law; integral evaluated numerically between 40 K and 293.15 K.
- Heat flow at temperature T under the optimum | Q(T) = I × √[L₀ × (T_h² − T²)]
- Shape factor | L ÷ A = ∫ k(T) ÷ Q(T) dT = 40,330 m⁻¹ at 100 A
- Chosen length | 0.50 m, set by the cryostat's layout
- * Section | 0.50 ÷ 40,330 = 1.24 × 10⁻⁵ m², 12.4 mm²
- Heat at the cold end | 4.54 W per lead, with no heat flowing at the warm end
```

The optimum L ÷ A is inversely proportional to the current: a lead for 200 A of the same length needs twice the section. The lead is therefore optimised for one current, and that is its weakness.

## Above and below the design current

An optimised lead is a compromise struck for one current. Below it, the lead is fatter than it needs to be, so its conduction dominates and some of its heat leak is wasted. Above it, the lead is too thin, and its resistance heating grows with the square of the current. Solving the lead's heat balance numerically for CT-40's 12.4 mm² × 0.5 m copper lead at other currents gives:

```figure
type: compare
title: Heat from one of CT-40's 100 A leads at other currents
cols: Heat at the cold end | Heat at the warm end | Hottest point along the lead
caption: This is an illustration. Numerical solution of the lead's heat balance with NIST's RRR 50 copper conductivity and Wiedemann–Franz resistivity; warm end held at 293.15 K, cold end at 40 K. A negative warm-end heat means heat flowing out of the lead at the warm end.
- 0 A | 2.89 W | 2.89 W in | 293 K
- 50 A | 3.20 W | 2.26 W in | 293 K
- * 100 A, design | 4.54 W | 0.07 W out | 293 K
- 120 A | 5.78 W | 1.95 W out | 311 K
- 150 A | 10.38 W | 7.84 W out | about 445 K
```

At zero current, the lead still conducts 2.89 W, 64% of its design load: the price of being thick enough for 100 A. Above the design current, the lead's own heating makes its middle hotter than its warm end, heat flows out of both ends, and the cold end load climbs quickly. At 150 A, the hottest point reaches about 445 K, hot enough to damage insulation, and a little more current would send the lead into thermal runaway. A lead too thin for its current, such as 1 mm² over the same length at 100 A, has no steady state at all: it burns out.

Two practical rules follow. A conduction-cooled lead is designed for the highest current it must carry continuously, and the cryostat's power supply is limited to that current. And leads that must carry a high current only occasionally can be designed for the time-averaged duty, provided their temperature is checked for the longest high-current run.

## Why the minimum does not depend on the metal

The reason the minimum is the same for every metal lies in the Wiedemann–Franz law. A lead's conduction is set by its conductivity times its section divided by its length; its resistance heating by its resistivity times its length divided by its section. The product of the two, conduction times heating, depends on k × ρ and not on the shape. In a metal obeying the law, k × ρ = L₀ × T is the same for copper, brass and aluminium at the same temperature. Choosing a better conductor lowers the conduction for a given heating, but the optimum shape then just becomes longer and thinner until the balance is struck again at the same total. The electrons that carry the current are the same electrons that carry the heat, and the law ties their two jobs together.

That also explains why the only ways to beat the conventional minimum change the physics rather than the metal. Cooling the lead along its length with the cold gas boiled off by a liquid cryogen, as liquid helium cryostats do, carries most of the heat away before it reaches the cold end; Ballarino gives about 1.1 W/kA for such self-cooled leads between ambient and 4.2 K, some forty times less. Replacing the cold part of the lead with a superconductor removes the resistance heating altogether, and since superconductors made of ceramic oxides conduct heat poorly, the cold part also conducts little. Neither is open to CT-40, which has no cryogen and a single cooling stage.

## The cold end of a lead

A lead's cold end has two jobs that pull against each other. It must be thermally anchored to the cold plate, so that its 4.5 W goes into the plate and the cooler rather than into the coil, and it must be electrically insulated from the plate, which is connected to the cryostat's earthed vessel through the strap and the cooler. CT-40's leads end in copper blocks clamped to the plate over a large area through thin polyimide film: the film insulates electrically, and its large area and small thickness keep the temperature difference across it small for the heat it carries.

The joint between each lead and the coil's own terminals adds a little heat, I²R in the joint's resistance. A good soldered or clamped joint of a few tens of nanohms at 100 A generates a fraction of a milliwatt, negligible in the budget, but a poor joint of a few microhms generates tens of milliwatts locally at the coil, where a superconductor may be sensitive to it. Joint resistances are measured at the operating temperature by the voltage across each joint at a known current.

## Instrument wiring

Instrument wires carry tiny currents, so their own heating is negligible and only conduction counts. They are made of alloys such as phosphor bronze or manganin, chosen for low thermal conductivity, and they are thin.

This is an illustration. CT-40 has 32 phosphor bronze wires 0.127 mm in diameter and 1 m long, whose reel label gives 8.7 Ω/m at room temperature, a resistivity of 8.7 × 1.267 × 10⁻⁸ = 1.10 × 10⁻⁷ Ω·m. In an alloy, impurity scattering dominates at all temperatures, so the resistivity changes little on cooling, and the Wiedemann–Franz law with a constant resistivity gives a conductivity integral of L₀ × (T_h² − T_c²) ÷ (2ρ) = 9,365 W/m. Each wire's shape factor is 1.267 × 10⁻⁸ ÷ 1 m, so it conducts 0.12 mW, and all 32 together **3.8 mW**. Copper wires of the same size would conduct about 47 mW in all, still small, but twelve times more.

Wires matter less for their heat than for where it goes. A wire that reaches a thermometer still warm will heat the thermometer and give a reading above the plate's temperature. Every wire is therefore thermally anchored before its sensor: wound several times around a copper bobbin bolted to the plate and varnished to it, so that the wire reaches the plate's temperature over its anchored length. In cryostats with an intermediate stage, wires are anchored there too, which takes most of their heat at the cheaper temperature.

## The error: 100 A leads run at 150 A

This is an illustration. A customer asked for one coil to be tested at 150 A, and the test engineer, reasoning that the leads were copper and copper carries 150 A easily in a cable, raised the current in steps. At 150 A the cold plate climbed past 40 K and settled at about 44 K, the test was abandoned, and the leads' insulation near their warm end was later found discoloured.

The compare table above explains both observations. At 150 A, each lead put 10.38 W into the cold end instead of 4.54 W, raising the total load from 10.58 W to about 22.3 W. On the cooler's curve, the cold stage then settled at 25 + 22.26 ÷ 2 = 36.1 K, the strap added 6.2 K at the higher load and the joints 1.8 K, putting the plate at about **44.2 K**. And each lead's hottest point, near its warm end, reached about 445 K, which scorched the insulation.

The engineer found the cause by solving the lead's heat balance at 150 A, which takes a few lines of code once the lead's shape and NIST's copper data are in hand. The laboratory's power supply now has a current limit set at the leads' design current, and its test procedure states the maximum continuous current next to the cryostat's name. A coil that must be tested at 150 A needs leads designed for 150 A, with 1.5 times the section, and a budget that can afford 2 × 6.8 W at the cold end.

## Exercise: leads for 200 A

The laboratory plans a second insert for coils up to 200 A, with leads of the same 0.5 m length. Using the optimum relations, find each lead's section, the pair's heat at the cold end, the new total load if the leads replace CT-40's 100 A pair (whose 9.08 W is part of the 10.58 W total), and the plate temperature, given that the strap adds 5.26 K and the joints 1.57 K at the new load.

**Worked answer.** This is an illustration. The optimum shape factor at 200 A is 40,330 × 100 ÷ 200 = 20,165 m⁻¹, so each 0.5 m lead needs 0.5 ÷ 20,165 = **24.8 mm²**. Each leaks 0.0454 × 200 = 9.08 W, so the pair leaks **18.16 W**. The total load becomes 10.58 − 9.08 + 18.16 = **19.66 W**, the cold stage settles at 25 + 19.66 ÷ 2 = 34.8 K, and the plate at 34.8 + 5.26 + 1.57 = **41.7 K**, above the 40 K target. A single-stage cooler of CT-40's size cannot test 200 A coils at 40 K with conventional leads. The usual answers are a bigger cooler, or a two-stage cooler with an intermediate intercept and a high-temperature superconducting lead segment below it, which carries current with no resistive heat and conducts little, as Ballarino's lecture describes.
