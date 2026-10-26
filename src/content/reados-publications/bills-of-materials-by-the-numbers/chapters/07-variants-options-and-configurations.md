---
book: bills-of-materials-by-the-numbers
chapterSlug: variants-options-and-configurations
order: 7
title: "Variants, options and configurations"
description: "Structure a product with options without multiplying BOMs: separate BOMs, modular option groups, planning BOMs with option mixes, CAD configurations, and rules that stop an order taking two belts."
draft: false
---

Products come in variants. The PC-600 can have a guard or not, a standard or food-grade belt, two motor sizes and, as the PC-900, a longer frame. Four choices with two options each make sixteen possible modules. A business that writes a separate bill of materials for each will maintain sixteen BOMs that are nearly identical, and every change to a shared part becomes sixteen changes, one of which will be missed. A business that handles options well maintains one base and a few option groups, and every order is assembled from them.

This chapter sets out the main ways of structuring variants and what each costs. It covers separate BOMs, modular BOMs built from a base and option groups, planning BOMs that forecast option demand from mix percentages, configurations in CAD and how they map to the business system, and the rules that keep a configured order valid. The running case configures a PC-600 order and finds it with two belts.

## The PC-600's options

This is an illustration. The PC-600 is sold with four choices:

- **guard**: none, or a sheet metal guard GU-660 over the drive;
- **belt**: standard, or food-grade;
- **motor**: 0.55 kW or 0.75 kW, with matching gearbox and coupling;
- **length**: PC-600 with 12 rollers, or PC-900 with 18 rollers and a longer frame, guides and belt.

Two options for each of four choices give 2 × 2 × 2 × 2 = **16** distinct products.

## Separate BOMs

The simplest structure gives each variant its own part number and BOM. It is easy to understand and easy to build in any system, and it scales badly. Sixteen BOMs of about 30 lines each are about **480** lines to maintain, most of them identical copies. A change to the roller, the frame's fasteners or the drive shaft must be made in every BOM that contains it, and the chance of missing one grows with every variant.

Separate BOMs are reasonable for a handful of variants that differ substantially. For the PC-600's sixteen, they are a maintenance trap.

## Modular BOMs: a base and option groups

A modular structure separates what every variant shares from what differs:

- a **base** BOM with everything common to every module: the drive unit apart from its motor set, the drive shaft assembly, the tensioning screws, the fastener kit, and so on;
- an **option group** for each choice, holding the alternatives: the guard group holds GU-660 or nothing; the belt group holds one belt type or the other; the motor group holds one motor set or the other; the length group holds the 12-roller or 18-roller quantities, with the matching frame, guides and belt length.

An order is the base plus one option from each group. The PC-600's base and four option groups total about **38** lines, against 480 for separate BOMs, and a change to a shared part is made once, in the base.

```figure
type: tree
title: The configurable PC-600: a base and four option groups
caption: This is an illustration. An order takes the base and exactly one choice from each group; the guard group's choices include none.
- PC-600 configurable module | Base plus options
  - Base | Common to all sixteen variants
  - Guard group | None, or guard sized to the motor
  - Belt group | Standard or food-grade belt type
  - Motor group | 0.55 kW set or 0.75 kW set
  - * Length group | 12 rollers, frame and 4.2 m belt, or 18 rollers, frame and 6.2 m belt
```

## Options that interact

Some parts depend on two options at once. The belt's type comes from the belt group and its length from the length group, so there are four belts in principle: standard and food-grade, each 4.2 m or 6.2 m. A structure that held four belt items, each selected by a rule on two options, would work and would grow quickly as options were added.

The PC-600's business uses a simpler pattern, which the units of Chapter 4 make possible. The belt is bought by the metre and cut from a roll, so the belt group chooses the item, standard or food-grade belt, and the length group sets its quantity, 4.2 m or 6.2 m. Two items and one quantity rule replace four items and four selection rules. The same pattern applies wherever one option chooses what and another chooses how much: the frame's hollow section is the same item for both lengths, and only its quantity per frame changes.

Interactions that cannot be expressed this way, such as the guard that must be sized to the motor, need a rule that names both options, and those rules are where configurators most often go wrong. Keeping them few, and written down beside the option groups, is part of the structure's design.

```figure
type: bars
title: BOM lines to maintain for the PC-600's sixteen variants
unit: lines
max: 500
caption: This is an illustration. Separate BOMs repeat the common parts sixteen times; a modular structure holds them once.
- Sixteen separate BOMs of about 30 lines | 480
- *Base plus four option groups | 38
```

## Rules that keep an order valid

A modular structure needs rules: which options must be chosen, which exclude each other, which require each other. Without them, an order can be configured that cannot be built.

The PC-600's rules include:

- exactly one belt, one motor set and one length must be chosen;
- the guard is optional, and if chosen must match the motor set, because the 0.75 kW motor needs the larger guard;
- the food-grade belt requires rollers with stainless end caps, the roller variant IR-635, in place of the standard IR-630.

Rules are data, like the property schema of *CAD Automation That Pays*, and the business system or a configurator applies them when an order is entered.

```figure
type: checklist
title: Configuration rules for a PC-600 order
caption: This is an illustration. Each rule is checked when the order is configured, before any demand is created.
- Exactly one belt | Standard or food-grade, never both, never none
- Exactly one motor set | 0.55 kW or 0.75 kW, with its gearbox and coupling
- Exactly one length | PC-600 or PC-900 quantities
- Guard optional, sized to the motor | Larger guard with the 0.75 kW motor
- Food-grade belt brings stainless end caps | IR-635 rollers replace IR-630
- x Option chosen that another option excludes | Order refused until resolved
- ? Customer-specific special | Becomes its own engineered BOM, not an option
```

## The error: a module with two belts

This is an illustration. When the business first set up its option groups, the belt group was built with the standard belt marked as the default, so that an order with no belt choice would still get one. A salesperson configured an order for three PC-600 modules with the food-grade belt. The configurator added the food-grade belt, as chosen, and also the default standard belt, because the default was implemented as "add if nothing in the group is marked", and the food-grade belt had been added through a different screen that did not mark it.

The order's BOM showed two belts per module, 8.4 m of belt per module, 25.2 m for the three, and the planning system ordered both. The fault was caught by the rule "exactly one belt", which the business had not yet implemented in the configurator but which a planner checked by hand on the first configured orders: two belt lines on one module is easy to see. The configurator was corrected so that a default applies only when no option in the group has been chosen by any route, and the "exactly one" rules were built into it.

## Planning BOMs and option mix

Customers order specific variants, but the business has to buy long-lead parts before the orders arrive. A **planning BOM** forecasts option demand from the expected mix of options, so that the planning system can order for a forecast of modules rather than for specific variants.

This is an illustration. The business forecasts 20 modules next quarter, and its sales history suggests that 60% have the guard, 25% the food-grade belt and 40% the larger motor. The planning BOM turns the forecast into option quantities: 20 × 0.60 = **12** guards, 20 × 0.25 = **5** food-grade belts and 15 standard belts, and 20 × 0.40 = **8** larger motor sets and 12 smaller. The base parts are planned for all 20.

```figure
type: stats
title: Option demand for a forecast of 20 modules
caption: This is an illustration. Mix percentages from sales history turn a forecast of modules into a forecast of options.
- 20 | Base sets | Every module
- 12 | Guards | 60% mix
- * 5 | Food-grade belts | 25% mix; 15 standard
- 8 | Larger motor sets | 40% mix; 12 smaller
```

The percentages are forecasts and will be wrong in detail. For cheap, short-lead options the error matters little, because actual orders correct it quickly. For expensive, long-lead options, such as the motors, the business may hold a small buffer above the forecast mix, decided deliberately, rather than trusting the percentage.

## Reviewing the mix

The mix percentages should be reviewed against what was actually ordered, as the scrap rates of Chapter 5 are. This is an illustration. In the quarter that followed, 20 modules were ordered as forecast, but 15 had the guard, not 12: a mix of 75% against the 60% assumed. The three extra guards were cut and folded by the laser contractor in a week, so the miss cost a short wait on three orders and nothing more. Had the miss been on the motor sets, with their longer lead time, three modules would have waited for motors.

The business now updates each option's mix from the last four quarters' orders, and looks at the trend as well as the average: a guard mix that ran 50%, 55%, 68% and 75% over four quarters suggests that next quarter's will be nearer 75% than the four-quarter average of 62%. The planning BOM is a forecast, and like every forecast it is worth checking against what happened.

## Configurations in CAD

CAD programs handle variants with configurations: one model or assembly file with several configurations, each with its own suppressed components, dimensions and properties. A CAD BOM table can be set to show the quantities of a chosen configuration, which makes the CAD model a useful check on each option's contents.

Configurations map naturally onto option groups when the CAD assembly is built with them in mind: a configuration for each length, components suppressed or included for the guard, and properties that change with the belt. The mapping is not automatic. The business must decide whether each configuration becomes its own part number in the business system, or whether the CAD configurations simply supply the option groups' contents. The PC-600's business uses the second: the CAD assembly's configurations define what each option contains, and the business system holds the base, the option groups and the rules.

## Testing every combination

Sixteen combinations is few enough to test them all, and the business does so whenever an option group or rule changes. For each combination, a small script configures one module, explodes it to a parts-only list and checks the result against the rules: one belt, one motor set, one length, a guard that matches the motor if there is one, and rollers whose caps match the belt. It then compares the list with the matching CAD configuration's parts-only BOM, as Chapter 3 compared a roll-up with an independent count.

The first full run, after the two-belt fault, found one more problem: the PC-900 with the larger motor and no guard drew its drive unit's mounting bolts twice, because the length group and the motor group both added them. The combination had never been ordered, so nobody had seen it. Testing only the combinations that customers have bought tests the ones least likely to be wrong.

As options are added, the count grows quickly: a fifth choice of three options would make 16 × 3 = 48 combinations, and a sixth of two would make 96. Beyond a few hundred, testing every combination becomes slow, and a business tests every option at least once, every pair of interacting options together, and every combination actually sold.

## Specials

Some orders are for something no combination of options covers: a module 1,200 mm long, a different motor. Those should be engineered as their own products with their own BOMs, often built from the base and existing option groups with a few new parts, rather than forced into the option structure as new options that nobody else will ever choose. An option group that accumulates one-off specials becomes the same maintenance problem as separate BOMs, slowly.

## Exercise: configuring an order

A customer orders four modules: two PC-900s with the guard, food-grade belt and larger motor, and two PC-600s with no guard, standard belt and smaller motor. Using the PC-600's 12 rollers and the PC-900's 18, and the rule that the food-grade belt brings stainless end caps, how many guards, belts of each type, motor sets of each size, standard end caps and stainless end caps does the order need?

**Worked answer.**

- **Guards**: 2, both the larger guard, because the guarded modules have the larger motor.
- **Belts**: 2 food-grade, for the PC-900s, and 2 standard, for the PC-600s; one per module.
- **Motor sets**: 2 of 0.75 kW and 2 of 0.55 kW.
- **Rollers**: the PC-900s take 2 × 18 = **36** IR-635 rollers with stainless caps; the PC-600s take 2 × 12 = **24** standard IR-630 rollers.
- **End caps**: each roller has 2, so 36 × 2 = **72 stainless** caps and 24 × 2 = **48 standard** caps.
- **Belt length**: the food-grade belt at 2 × 6.2 = **12.4 m**, and the standard belt at 2 × 4.2 = **8.4 m**.

The rules check out: each module has exactly one belt and one motor set, the guards match the motors, and no module has both cap types. A configurator that applied the food-grade rule to the whole order, instead of per module, would have given all four modules stainless caps, 120 in all, which is a reason to apply option rules per configured unit, not per order.
