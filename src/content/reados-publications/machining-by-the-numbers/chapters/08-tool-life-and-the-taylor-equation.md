---
book: machining-by-the-numbers
chapterSlug: tool-life-and-the-taylor-equation
order: 8
title: "Tool life and the Taylor equation"
description: "Define tool life, fit Taylor's speed and tool-life relationship to two or more tests, predict life at other speeds and understand why feed is usually a cheaper lever than speed."
draft: false
---

Every cutting edge wears out. How quickly it wears depends mostly on cutting speed, then on feed and depth of cut, and on the tool material, the workpiece and the coolant. Knowing that relationship turns tool life from an unpredictable cost into a number that can be planned, scheduled and optimised.

In the early twentieth century, Frederick W. Taylor published the results of many years of cutting experiments, including a simple relationship between cutting speed and tool life. More than a century later, it remains the standard starting point for planning tool changes and for the cost calculations in the next chapter.

## What tool life means

Tool life is the cutting time an edge can deliver before it reaches a defined end-of-life criterion. The criterion must be stated, because "worn out" means different things in different jobs:

- **Flank wear width.** The worn land on the clearance face below the cutting edge, measured with a microscope. ISO 3685, the standard for tool-life testing with single-point turning tools, uses flank wear limits for this purpose.
- **Surface finish or size.** In finishing, an edge is worn out when the surface or size drifts out of tolerance, often well before flank wear is large.
- **Chipping, cracking or notch wear,** which may end a tool's life suddenly rather than gradually.
- **Power or force rise.** A worn edge pulls more power, which can be monitored.

For estimating and planning, tool life is usually expressed in minutes of cutting time, then converted into parts per edge by dividing by the cutting time per part.

## Taylor's equation

Taylor found that, for a given tool, workpiece, feed and depth of cut, tool life T and cutting speed V are related by:

**V × Tⁿ = C**

where n and C are constants for that combination. Plotted on logarithmic scales, speed against tool life gives a straight line with slope related to n. A small n means tool life is very sensitive to speed.

Textbooks commonly quote typical values of n of roughly 0.1 to 0.15 for high-speed steel tools, around 0.2 to 0.3 for cemented carbide and higher values for ceramics. Those are only indications; real values must be measured or obtained from supplier data for the specific conditions.

## Fitting the equation to two tests

Two tool-life tests at different speeds, with everything else unchanged, are enough to find n and C. Taking logarithms of V₁T₁ⁿ = V₂T₂ⁿ gives:

**n = ln(V₂ ÷ V₁) ÷ ln(T₁ ÷ T₂)**

and then **C = V₁ × T₁ⁿ**.

This is an illustration. Harbourline runs a long-running family of turned steel shafts with the same insert grade it uses for the flange. To plan tool changes, it records tool life at two speeds, using a flank wear limit as the end-of-life criterion, with feed and depth of cut unchanged:

- At 200 m/min, an edge lasts 40 minutes of cutting.
- At 260 m/min, an edge lasts 12 minutes.

Then:

- n = ln(260 ÷ 200) ÷ ln(40 ÷ 12) = 0.2624 ÷ 1.2040 = **0.218**
- C = 200 × 40^0.2179 = **446.8**

C is the cutting speed, in m/min, that would give a tool life of one minute. It is an extrapolation, not a speed anyone would use.

```figure
type: formula
title: Fitting Taylor's equation to two tests
formula: V × Tⁿ = C
formula: n = ln(V₂ ÷ V₁) ÷ ln(T₁ ÷ T₂)
caption: Two speeds, everything else unchanged, are enough to fix n and C for that tool and material.
- Test 1 | 200 m/min lasted 40 min
- Test 2 | 260 m/min lasted 12 min
step: n = ln(260 ÷ 200) ÷ ln(40 ÷ 12) = 0.2624 ÷ 1.2040
step: n = 0.218
step: C = 200 × 40^0.218 = 446.8
```

## Predicting tool life at other speeds

Rearranging the equation gives tool life for any speed within the tested range:

**T = (C ÷ V)^(1 ÷ n)**

| Cutting speed | Predicted tool life |
|---|---|
| 180 m/min | 64.9 min |
| 200 m/min | 40.0 min (tested) |
| 220 m/min | 25.8 min |
| 230 m/min | 21.1 min |
| 250 m/min | 14.4 min |
| 260 m/min | 12.0 min (tested) |
| 300 m/min | 6.2 min |

The sensitivity is striking. Raising cutting speed by 10%, from 200 to 220 m/min, reduces tool life by about 35%, from 40 to 25.8 minutes. Lowering speed by 10%, to 180 m/min, increases life by more than 60%. Predictions far outside the tested range, such as 300 m/min here, should be treated with caution: other wear mechanisms may take over.

```figure
type: line
title: Predicted tool life against cutting speed
x: Cutting speed (m/min)
y: Tool life (cutting minutes)
ymin: 0
ymax: 70
mark: 200 | tested
mark: 260 | tested
caption: T = (C ÷ V)^(1 ÷ n). Beyond the tested range, other wear mechanisms may take over, so treat 300 m/min with caution.
- 180 | 64.9
- 200 | 40.0
- 220 | 25.8
- 230 | 21.1
- 250 | 14.4
- 260 | 12.0
- 300 | 6.2
```

## Feed and depth of cut

Taylor's work and later research extended the equation to include feed and depth of cut. The general finding is that tool life is much less sensitive to feed than to speed, and least sensitive to depth of cut, within the tool's working range. This has a practical consequence for productivity: removal rate is proportional to speed, feed and depth equally, but increasing feed or depth costs much less tool life than increasing speed by the same proportion.

That is why experienced programmers generally increase depth of cut first, then feed, and use speed as the last lever when trying to raise output. The limits on feed and depth are the insert's working range, the surface finish requirement, the machine's power and torque, and deflection, all covered in earlier chapters.

```figure
type: layers
title: Levers for more output, in order of tool-life cost
caption: Removal rate rises equally with each lever, but tool life is least sensitive to depth and most sensitive to speed.
- *Depth of cut | cheapest in tool life; limited by power and the insert's range
- Feed | moderate effect on tool life; limited by finish, force and deflection
- Cutting speed | strongest effect: +10% speed cost about 35% of tool life here
```

## Running tool-life tests

Tool-life testing is worth doing for long-running parts or expensive tools. ISO 3685 describes a rigorous method for turning. A simpler workshop approach is:

1. Choose a stable job with consistent material and set-up.
2. Fix feed, depth of cut and coolant, and change only cutting speed.
3. Test at least two, preferably three, speeds spanning the likely operating range.
4. Measure wear at regular intervals with a consistent method, such as a toolmaker's microscope, and stop at the same wear criterion each time.
5. Record cutting time accurately, not elapsed time. Machine controls can often report spindle-in-cut time.
6. Repeat tests where possible; tool life scatters, and a single result can mislead.

Plotting speed against tool life on logarithmic axes shows whether the points lie close to a straight line. If they do, Taylor's equation describes the process well in that range.

## When Taylor's equation does not fit

The relationship describes gradual wear at speeds where temperature drives wear. It describes some situations badly:

- **Low speeds**, where built-up edge forms and tool life may actually fall as speed falls.
- **Chipping and breakage**, which depend on impact, vibration and edge strength rather than speed.
- **Interrupted cuts**, where thermal cycling can crack the edge.
- **Very hard or abrasive materials**, where other mechanisms dominate.

In those cases, tool life should be recorded directly in parts per edge for each job and condition, without forcing it into a formula.

## Parts per edge

For planning, tool life in minutes is converted into parts per edge:

**Parts per edge = T ÷ tc**

where tc is the cutting time per part for that tool. On the Harbourline flange, the roughing insert cuts for about 1.29 minutes per part across the facing and roughing passes of both lathe operations. If its life at the planned speed is about 15 minutes, it will rough about 11 to 12 flanges per edge. Chapter 11 uses figures like this to estimate tooling cost per part.

## Common mistakes

- **Undefined tool-life criterion.** Without a stated criterion, tool-life numbers cannot be compared.
- **Elapsed time instead of cutting time.**
- **Single tests.** Tool life scatters; repeat where possible.
- **Extrapolating far beyond tested speeds.**
- **Raising speed first** when trying to increase output, instead of depth and feed.

## Questions to ask

- What end-of-life criterion is used for this tool, and is it applied consistently?
- Over what range of speeds has tool life actually been measured?
- How sensitive is tool life to speed in this application?
- Could output be raised more cheaply with depth of cut or feed?

## Exercise: fit your own Taylor line

For one tool on a repeat job, record tool life at your normal speed and at a speed about 20% higher, keeping everything else the same. Calculate n and C, predict tool life at a speed 10% below normal and check the prediction on the next batch.

Tool life now has a formula. The next chapter puts a price on both machine time and tool changes, and finds the cutting speed that minimises cost per part.
