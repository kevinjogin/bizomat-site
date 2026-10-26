---
book: heat-exchangers-by-the-numbers
chapterSlug: plate-or-shell-and-tube
order: 8
title: "Plate or shell-and-tube"
description: "Choose between gasketed plate, brazed plate and shell-and-tube exchangers on coefficient, approach, size, pressure, fouling and cleaning, and catch a brazed plate unit fed unstrained tower water."
draft: false
---

Two families of exchanger cover most industrial liquid duties. The **shell-and-tube** exchanger, a bundle of tubes inside a cylindrical shell, is robust, tolerant of pressure, temperature and dirt, easy to clean on its tube side and made in almost any material. The **plate** exchanger, a stack of thin corrugated metal plates with the two fluids flowing in alternate channels between them, is compact, achieves high coefficients and close approaches, and in its gasketed form can be opened, cleaned and extended with more plates. Each family has a natural territory, and the overlap between them is where a careful choice pays off.

This chapter compares the two families on coefficient, approach, size, pressure and temperature limits, fouling and cleaning, then applies the comparison to the plant's two duties: OC-35's oil cooler and the heat-recovery exchanger of Chapters 2 and 3. The running case finds that a brazed plate exchanger, proposed to replace OC-35 because it was smaller and cheaper, was first fitted to the open tower water without a strainer, and that its narrow channels began to plug within weeks.

## How plate exchangers work

A plate exchanger's plates are pressed with chevron or herringbone corrugations. Stacked together, alternate plates are turned so that their corrugations cross, forming narrow channels, typically a few millimetres deep, in which the fluid is forced to change direction continuously. The flow becomes turbulent at low Reynolds numbers, and the coefficients on both sides are high, often several times those of a shell-and-tube unit for the same fluids. The two fluids usually flow in counterflow, so F is close to one and close approaches are practical.

**Gasketed** plate exchangers have elastomer gaskets around each plate, clamped between a fixed and a movable frame plate by tie bolts. They can be opened, their plates cleaned or replaced, and plates added to raise the capacity. The gaskets limit their temperature and pressure, and the gasket material must suit both fluids. **Brazed** plate exchangers have their plates brazed together, usually with copper or nickel, into a sealed block. They are compact, cheap and tolerate higher pressures and temperatures than gaskets allow, but they cannot be opened: they can only be cleaned chemically, by circulating a cleaning solution, or replaced. **Welded** plate designs extend the range further for demanding fluids.

## The comparison

```figure
type: compare
title: Plate and shell-and-tube exchangers in general terms
cols: Gasketed plate | Brazed plate | Shell-and-tube
caption: General characteristics only. Makers' data and the duty decide; the rows show where each family is usually strongest.
- Coefficients | High, from corrugation | High, from corrugation | Moderate; low on a viscous shell side
- Approach and flow arrangement | Close, near counterflow | Close, near counterflow | Wider; F limits multi-pass units
- Size for a given duty | Compact | Very compact | Larger
- Pressure and temperature | Limited by the gaskets | Higher, limited by the brazing | High, set by the shell and tube design
- Dirty fluids and particles | Narrow channels can plug | Narrow channels can plug, cannot be opened | Tube side tolerant and cleanable
- Cleaning | Open and clean plates | Chemical cleaning in place only | Brush or jet the tubes; pull the bundle
- Changing capacity | Add or remove plates | Replace the unit | Replace the bundle or the unit
```

The pattern is clear. Plate exchangers win on performance per unit of size and cost for clean fluids at moderate pressures and temperatures, and wherever a close approach matters. Shell-and-tube exchangers win where fluids are dirty, pressures or temperatures are high, or the duty must tolerate abuse.

## The heat-recovery duty

This is an illustration. Chapter 3 found that the heat-recovery duty, oil cooling from 55 °C to 45 °C while parts-washer water heats from 20 °C to 48 °C, was a poor fit for a single shell-and-tube shell, with an F of about 0.64, and needed two shells in series. A gasketed plate exchanger, close to counterflow, uses the full log mean of about 14.14 K. With an illustrative plate-exchanger U of about 700 W/(m²·K) for filtered oil and clean washer water, the area needed is about 35,000 ÷ (700 × 14.14) ≈ **3.5 m²**, about thirty plates of 0.12 m² each. Two shell-and-tube shells in series, with a U of about 330 and F of about 0.94, would need about **8 m²** for the same duty. Both fluids are clean, the pressures and temperatures are modest, and the exchanger can be opened if the washer water scales. The plate exchanger is the natural choice, and the plant chose it.

```figure
type: formula
title: Plate-exchanger area for the heat-recovery duty
formula: A = Q ÷ (U × F × ΔT_lm), with F ≈ 1 for a counterflow plate exchanger
caption: This is an illustration with an illustrative plate-exchanger U of 700 W/(m²·K). Real plate coefficients come from the maker's rating for the chosen plate and chevron angle.
- Q | 35 kW
- ΔT_lm | About 14.14 K, from end differences of 25 K and 7 K
- U | About 700 W/(m²·K), illustrative
step: A ≈ 35,000 ÷ (700 × 1.0 × 14.14) ≈ 3.54 m²
step: With 0.12 m² plates: about 30 plates
step: Two shell-and-tube shells in series at U ≈ 330 and F ≈ 0.94: about 7.98 m²
```

## The running case: a plate cooler for OC-35

Later, when OC-35's bundle was due for replacement, a supplier proposed a **brazed plate** exchanger instead: smaller, cheaper and, with its higher oil-side coefficient, able to do OC-35's duty with about 2.9 m² of plate area at an illustrative U of 650 W/(m²·K) and the full counterflow log mean of 18.39 K. On paper, the case was strong.

## The error: open tower water through narrow channels

This is an illustration. The brazed unit was installed with the tower water connected directly, through the same pipework that had served OC-35's tubes, with no strainer. OC-35's tubes, 10.9 mm across, had tolerated the leaves, scale flakes and silt that an open cooling tower inevitably collects. The brazed unit's channels, a couple of millimetres deep, did not. Within weeks, the oil was running hot; the conductance had fallen by about a third, and the water-side pressure drop had risen as debris lodged at the channel entries. Because the unit could not be opened, it was back-flushed and chemically cleaned, which recovered most of its performance, and then plugged again.

The check that would have caught it was the comparison above: a plate exchanger on open cooling-tower water needs fine filtration upstream, sized to the plate's channel gap, and a brazed unit, which cannot be opened, needs it even more. The fix was a self-cleaning strainer on the tower water, with a mesh fine enough for the channels, and a backflush connection on the exchanger. In a later review, the plant noted that a gasketed plate unit, openable for cleaning, or keeping a shell-and-tube with tower water in the tubes, would both have been more forgiving choices for open tower water. The general lesson is that a plate exchanger's narrow channels are what give it its high coefficients, and the same narrow channels make it intolerant of dirty fluids; the choice of exchanger includes the filtration that the choice demands.

## Plate selection and chevron angle

Plate exchangers are tuned by their plate pattern as much as by their area. Plates with a steep chevron angle create more turbulence, higher coefficients and higher pressure drop: a "thermally long" plate, suited to close-approach duties. Plates with a shallow angle give lower coefficients and lower pressure drop: a "thermally short" plate, suited to duties with wide temperature differences or tight pressure-drop limits. Many makers offer both and can mix them in one pack to hit a duty's pressure drop and heat transfer together. Plate size matters too: longer plates give more thermal length per pass. A maker's rating program chooses the combination, and a buyer comparing quotations should compare the number of plates, the plate type and the pressure drops, not only the price.

## Leaks and which way they go

Every exchanger can leak, and it matters which way. If OC-35's water leaks into the oil, water in hydraulic oil damages pumps and valves; if oil leaks into the water, it contaminates the tower circuit and may reach drains. The usual precaution is to keep the more valuable or more sensitive fluid at the higher pressure, so that any internal leak flows away from it: for an oil cooler, the oil side is often kept at a higher pressure than the water side, so that a leak sends oil into the water, where it shows as a sheen in the tower basin, rather than water into the oil. Gasketed plate exchangers have a further safeguard: their gaskets are designed so that a failed gasket leaks to the outside, through vented spaces, rather than between the fluids. Brazed and shell-and-tube units leak internally when they leak at all, so the pressure arrangement is their main protection, backed by monitoring of the oil's water content.

## OC-35's replacement decision

This is an illustration. Gathering the comparison, the plant's exchanger areas for its two duties look like this.

```figure
type: bars
title: Area needed by exchanger type, m²
unit: m²
max: 9
caption: This is an illustration with the coefficients used in this book. Plate exchangers need much less area; the question is whether their channels suit the water they will see.
- Heat recovery, two shells in series | 7.98
- *Heat recovery, gasketed plate | 3.54
- OC-35, shell-and-tube on tower water | 5.59
- OC-35, brazed plate on tower water | 2.93
- OC-35, gasketed plate on a closed loop | 3.29
```

For the heat-recovery duty, both fluids clean, the gasketed plate exchanger was clearly right. For OC-35, the plant weighed the brazed unit with a fine strainer on tower water against a gasketed unit on a closed loop and against keeping a shell-and-tube with tower water in its cleanable tubes. With only one cooler on the tower circuit at the time, it kept the shell-and-tube with the improved oil-side baffling of Chapter 4, and it planned the closed loop for the day when more plate coolers would join the circuit. The areas alone favoured the plates; the water quality and maintenance favoured the tubes, and the decision was recorded with both so that it can be revisited when the circuit changes.

## Closed loops and intermediate exchangers

A common way to use plate exchangers with dirty water is to keep the dirty water out of the process altogether. An **intermediate** plate exchanger separates an open tower circuit from a closed, clean water loop, and the closed loop then serves the plant's coolers. The process coolers see only clean, treated water; only one exchanger, chosen and filtered for it, sees the tower water. The cost is a second temperature difference: the closed loop runs a few kelvin warmer than the tower water, which the process coolers must accept. *Cooling Towers by the Numbers* weighs open and closed circuits for the same plant.

## Gaskets, pressures and temperatures

A gasketed plate exchanger's gaskets set its limits. Each elastomer has a maximum temperature and a list of fluids it resists, and a gasket that suits water may swell in some oils or harden in hot water over time. The gasket material is therefore specified for both fluids at their maximum temperatures, and the maker's pressure and temperature rating for the plate pack is checked against the design conditions. Gaskets are also a maintenance item: they age, and an exchanger that is opened often may need regasketing. The tie-bolt dimension, the plate pack's compressed length, must be set to the maker's figure when the unit is closed, because over-tightening crushes the gaskets and under-tightening lets them leak.

## Other exchanger types

The two families are not the only choices. **Air-cooled** exchangers, finned tubes with fans blowing air across them, reject heat directly to the atmosphere without any cooling water; they suit sites short of water and duties whose fluid can run well above the air temperature, and an air-blast oil cooler is a common alternative to OC-35 on smaller power units. **Double-pipe** exchangers, one pipe inside another, suit small duties and high pressures. **Spiral** exchangers, two long channels wound into a spiral, tolerate sludges and fibrous fluids that would plug plates. Each is rated with the same methods, energy balances, a mean temperature difference or effectiveness, and an overall coefficient, and each has its own territory of fluids, pressures and maintenance.

## Pressure equipment

Both families, when they contain fluids under pressure above the thresholds set in the regulations, are pressure equipment. In Australia, the work health and safety regulations and the standards they call up, including AS 1210 for pressure vessels, govern their design, manufacture, registration where required, and inspection. A plate exchanger's frame and plates, or a shell-and-tube's shell and channels, are designed and documented by the maker to those requirements, and changes such as adding plates to a gasketed unit should stay within the maker's rated pack length and pressure.

## Exercise: OC-35 as a plate exchanger with an intermediate loop

Suppose OC-35 became a gasketed plate exchanger served by a closed clean water loop, which itself is cooled by the tower water through an intermediate exchanger, so that the loop water reaches OC-35 at about 31 °C instead of 29 °C. With the oil still 55 °C to 45 °C and the loop water rising 5 K, what is the log mean, and how does the plate area at a U of 650 W/(m²·K) compare with the 2.9 m² of the brazed unit on tower water?

**Worked answer.** The loop water enters at 31 °C and leaves at 36 °C. The end differences are 55 − 36 = **19 K** and 45 − 31 = **14 K**, a log mean of (19 − 14) ÷ ln(19 ÷ 14) ≈ **16.37 K**. The area is about 35,000 ÷ (650 × 16.37) ≈ **3.29 m²**, about 12% more than the 2.9 m² of the direct unit.

The intermediate loop costs about 12% more plate area at OC-35 and a second exchanger at the tower. In return, the plate cooler sees only clean water, its channels stay open and it can be opened for cleaning if needed. For a plant with several coolers, the closed loop's cost is shared and its reliability benefit multiplied, which is why many plants with plate coolers adopt it.
