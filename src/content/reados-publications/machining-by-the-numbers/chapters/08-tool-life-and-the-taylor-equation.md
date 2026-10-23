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

## Read the wear before changing the data

The shape of the wear on a used edge tells you what limited its life, and therefore which change will help. Looking at worn edges under a magnifier before changing the cutting data saves a great deal of trial and error:

```figure
type: decision
title: What the worn edge is telling you
question: What does the wear look like?
caption: Each wear pattern points to a different cause. Changing speed fixes some and makes others worse.
- Even flank wear land | Normal, gradual wear | adjust speed to set the life you want
- Crater on the rake face | Heat and diffusion | lower speed, or a more heat-resistant grade
- Notch at the depth-of-cut line | Hard skin or work hardening | vary the depth, change the entering angle
- Material welded to the edge | Built-up edge | raise speed, sharper edge, better coolant
- Chipped or broken edge | Impact or vibration | tougher grade, stronger edge, check rigidity
- *Edge pushed down or bulged | Plastic deformation from heat | lower speed or feed, harder grade
```

Taylor's equation describes the first pattern, steady flank wear, well. The others need different responses. Built-up edge, for example, is cured by raising the speed, which Taylor's equation alone would suggest shortens life. Chipping is not speed-driven at all; slowing down rarely helps, and a tougher grade, a stronger edge preparation or a more rigid set-up usually does. Recording the wear pattern alongside the tool life on the data sheet makes later decisions much easier.

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

## Plan tool changes around the scatter

Tool life varies from edge to edge even under identical conditions. Small differences in the insert, the material and the set-up mean that two edges run at the same speed may last noticeably different times. A predicted life of 25.8 minutes at 220 m/min is an average, not a guarantee for every edge.

In unattended or lightly attended machining, edges are often changed on a schedule rather than when they fail. Changing at the average life means about half of the edges fail before their change is due, which risks scrap and broken tools. Changing at a fraction of the average, such as 80%, or about 20 minutes here, reduces that risk at the cost of discarding some useful life. Where the scatter has been measured, from repeated tests or from production records, the change point can be set from the data rather than a rule of thumb. Tool life monitoring, by counting parts or measuring spindle load, lets the control prompt a change at the planned count and flag an edge that is wearing faster than usual.

For the flange's roughing insert, with a planned life of about 15 minutes and 1.29 minutes of cutting per part, changing at 80% of life would mean indexing after about 9 parts rather than 11 or 12. Over a 120-part batch, that is two or three extra edges, a few dollars of inserts, in exchange for much less risk of an edge failing in the middle of a heavy spigot cut. For a long unattended run, the trade is usually worth it; for an attended batch where the operator can hear and see the edge, running closer to the full life may be reasonable.

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

## Tool life in milling

In milling, each tooth cuts for only part of each revolution and cools for the rest. The resulting thermal cycling can crack carbide edges, especially with coolant applied intermittently, which is one reason many carbide milling operations run dry or with steady air or minimum-quantity lubrication. The cutting time per tooth is also only a fraction of the time the tool is in the cut, so tool life in milling is often expressed in minutes of tool engagement, metres of cut or parts per edge rather than minutes of chip formation.

Taylor's relationship can still describe the effect of speed on milling tool life, provided the tests keep feed per tooth, engagement and the other conditions constant. The chip-thinning correction of Chapter 4 matters here: comparing tool life at two speeds is meaningful only if the actual chip thickness was the same in both tests.

## Running tool-life tests

Tool-life testing is worth doing for long-running parts or expensive tools. ISO 3685 describes a rigorous method for turning. A simpler workshop approach is:

1. Choose a stable job with consistent material and set-up.
2. Fix feed, depth of cut and coolant, and change only cutting speed.
3. Test at least two, preferably three, speeds spanning the likely operating range.
4. Measure wear at regular intervals with a consistent method, such as a toolmaker's microscope, and stop at the same wear criterion each time.
5. Record cutting time accurately, not elapsed time. Machine controls can often report spindle-in-cut time.
6. Repeat tests where possible; tool life scatters, and a single result can mislead.

Plotting speed against tool life on logarithmic axes shows whether the points lie close to a straight line. If they do, Taylor's equation describes the process well in that range.

## Keep records as a Taylor line

A shop does not need formal tests to benefit from Taylor's equation. Every time a job runs, the cutting speed and the number of parts per edge give one point on a line. Converting parts per edge into cutting minutes per edge, using the cutting time per part, and recording it with the speed, the material and the tool, builds the dataset gradually.

After a few jobs with the same tool and material at different speeds, the points can be plotted on logarithmic axes and a line fitted through them. The result may be less precise than a controlled test, but it reflects the shop's real machines, materials and practices, which is what matters for planning. Points that sit well off the line are worth examining: they often reveal a set-up problem, a material change or a different wear mechanism, each of which is useful to know.

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

## Sensitivity, not precision, is the lesson

The exact values of n and C matter less than the shape of the relationship. Because tool life falls steeply as speed rises, small increases in speed can be expensive in tools, and small reductions can be cheap ways to extend life when edges are failing too often. Because tool life is less sensitive to feed and depth, those are better levers for productivity. And because the relationship holds only for steady wear in a limited range, it should guide decisions, not replace observation of the worn edges themselves.

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
