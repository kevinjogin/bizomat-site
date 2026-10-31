---
book: solvent-vapours-by-the-numbers
chapterSlug: ovens-and-dryers-below-the-lel
order: 9
title: "Ovens and dryers below the LEL"
description: "The solvent load an oven receives, sizing its exhaust from the peak release to stay below a fraction of the lower explosive limit, the effect of oven volume, and why not to throttle it."
draft: false
---

An oven that cures coated parts or dries cleaned ones receives solvent with every load, and heats it. The solvent evaporates inside a closed, hot box that also contains burners, heating elements or both. If the oven's exhaust does not remove the vapour fast enough, the concentration can climb into the flammable range, and an oven explosion is one of the most violent accidents a small factory can have. Ovens that handle flammable solvents are therefore designed to keep the vapour well below the lower explosive limit, with ventilation that is proven to be running before the heat comes on.

This chapter estimates the solvent load of Plant S's paint-curing oven, sizes its exhaust from the peak rate of release, shows how the oven's volume smooths the peak, and explains why throttling the exhaust to save heat was the error the fire-service inspector's question uncovered. Ovens are designed and certified by specialists to the applicable standards; this chapter is about understanding the numbers they work with.

## The oven's solvent load

The solvent an oven receives is whatever remains in the parts when they enter it. For a coating, that is the solvent not lost during spraying and flash-off; for washed or wiped parts, it is the liquid still on and in them.

Plant S's oven cures batches of painted guards and frames, about 40 m² of painted area a batch. The wet film is about 80 µm thick and about half solvent, so a batch carries about 40 × 10⁻⁶ m × 40 m² = 1.6 L of solvent when sprayed, about 1.38 kg at the thinner's density. Chapter 5 found that about two-thirds of it leaves during spraying and flash-off, so about 0.46 kg enters the oven with each batch.

```figure
type: stats
title: Solvent entering Plant S's oven with each batch
caption: This is an illustration. Painted area, film thickness and solvent fraction from the plant's paint records; the split between booth and oven from Chapter 5's weighed panels. The real figure changes with the thinning ratio, film thickness and flash-off time.
- 40 m² | painted area per batch
- 1.38 kg | solvent in the wet film as sprayed
- about two-thirds | lost in the booth and during flash-off
- 0.46 kg | solvent entering the oven per batch
```

The solvent that reaches the oven is the slow end of the blend. Chapter 3 showed that as the thinner evaporates, the remainder becomes mostly toluene, whose lower explosive limit, 1.1%, is the lowest of the components. The engineer therefore used 1.2% for the oven's vapour, between toluene's limit and the fresh blend's 1.475%, as a cautious figure.

## Peak, not average

Solvent does not leave the film at a steady rate. As the batch heats up, evaporation accelerates; most of the remaining solvent leaves in the first few minutes at temperature, and the last of it trickles out over the rest of the cure. The exhaust must cope with the peak.

From weighing painted test panels at intervals in the oven, the engineer estimated that about half of the solvent entering the oven left in its first 5 minutes at temperature and the rest over the following 25 minutes.

```figure
type: formula
title: Exhaust airflow to keep an oven's vapour below a fraction of the LEL
caption: A steady-state estimate at the peak release rate, with all volumes at a common reference of 25 °C and 101.325 kPa, so that the volume fractions are consistent. The fraction f is set by the applicable oven standard and the oven maker; a quarter of the LEL is a widely used figure.
- peak rate = 0.46 kg × 50% ÷ (5 ÷ 60 h) = 2.76 kg/h | half the solvent in the first 5 minutes
- step: G = 2.76 ÷ 0.0817 × 0.02445 = 0.825 m³/h | vapour volume at the reference conditions, average vapour molar mass about 82 g/mol
- step: Q = G ÷ (f × LEL) = 0.825 ÷ (0.25 × 0.012) | f = 0.25, LEL = 1.2%
- step: Q = 275 m³/h | exhaust at the reference conditions
```

Averaged over the 30-minute cure, the same 0.46 kg would be 0.92 kg/h and call for only 92 m³/h. Sizing on the average would underestimate the exhaust needed threefold.

### Temperature and the limit

Flammable limits widen as temperature rises, so the lower limit at oven temperature is somewhat below its value at room temperature. Oven standards deal with this, either by a correction to the limit or by the fraction of the limit allowed. NFPA 86, a standard for ovens and furnaces widely referred to for ovens that release flammable vapours, is named here for scope only; the oven maker and a competent person apply whichever requirements govern the oven. The point for this chapter is direction: any temperature correction makes the exhaust needed larger, not smaller. If the limit at 80 °C were 20% lower than at room temperature, the exhaust needed would be 25% larger.

## The oven's volume smooths the peak

The steady-state estimate assumes the oven's air responds instantly to the release. In fact the oven is a 15 m³ box, and its concentration builds up over a time set by its volume and its exhaust, V ÷ Q. A short peak is partly absorbed by the oven's volume before the concentration catches up with it.

The engineer simulated the oven as a well-mixed volume with the measured release profile, half in 5 minutes and half over the next 25, at three exhaust rates.

```figure
type: compare
title: Peak vapour concentration in the 15 m³ oven, by exhaust airflow
rowhead: Exhaust airflow
cols: Steady-state estimate at the peak rate | Well-mixed simulation with the oven volume | Share of a 1.2% LEL, simulated
caption: This is an illustration. 0.46 kg of solvent per batch, released half in the first 5 minutes and half over the next 25; vapour molar mass 82 g/mol; volumes at 25 °C reference. The oven's volume lowers the peak, but less so as the exhaust falls, because the time constant V ÷ Q grows.
- 150 m³/h, damper nearly closed | 46% of LEL | 0.311% vapour | 26%
- 275 m³/h, design value | 25% of LEL | 0.235% vapour | 20%
- * 600 m³/h, fan fully open | 11% of LEL | 0.133% vapour | 11%
```

The simulation shows a real effect: at the design exhaust of 275 m³/h, the oven's volume holds the peak to about 20% of the limit rather than 25%. But it is not a margin to rely on. It depends on the release profile, on how well the oven's air is mixed, and on the size of the batch, none of which is fixed. Oven designers generally size on the steady peak and treat the volume's smoothing as part of the safety margin.

## The error: closing the damper to save heat

The fire-service inspector's question was simple: how did the plant know its oven could not reach a flammable concentration? The answer turned out to depend on a damper.

Plant S's oven had been installed with an exhaust fan rated at 600 m³/h and a manual damper in its stack. Two winters earlier, a maintenance contractor looking for energy savings had noticed that the oven took a long time to reach temperature and that a great deal of heat went up its stack. Heating 600 m³/h of air by 60 K takes about 12 kW; at 150 m³/h, about 3 kW. The contractor closed the damper to about a quarter of its flow, and the oven heated noticeably faster. The setting was marked on the damper with paint and never questioned.

The contractor's reasoning used the average solvent release, 0.92 kg/h over a batch, which at 150 m³/h gives about 15% of the limit. At the peak, 150 m³/h gives 46% of the limit on a steady-state basis, and about 26% even allowing for the oven's volume, above the quarter of the limit used for design, with no allowance for a larger batch, a heavier film, extra thinner on a hot day or the temperature correction. A batch of heavily thinned paint on a humid day, exactly the conditions of Chapter 6, could have pushed the peak well beyond that.

```figure
type: compare
title: The damper setting, judged two ways
rowhead: Basis
cols: At 150 m³/h | At 600 m³/h
caption: This is an illustration. The energy saving was real; so was the loss of margin. Vapour shares are of a 1.2% LEL.
- Heat to warm the exhaust air by 60 K | about 3 kW | about 12 kW
- Average release over the batch | 15% of LEL | 4% of LEL
- * Peak release, steady-state | 46% of LEL | 11% of LEL
- Peak release, with the oven's volume | 26% of LEL | 11% of LEL
```

The plant reopened the damper fully and had the oven's ventilation reassessed by the oven maker, who fitted a mechanical stop so the damper could not be closed below the design flow, and an airflow switch that prevents the burner from lighting, and shuts it down, unless the exhaust is proven to be running. The maker also confirmed the purge the oven runs before ignition, several volume changes of fresh air to clear any vapour left from the previous batch.

The energy concern was legitimate, and it had a better answer: insulating the oven's door seals, which leaked more heat than the stack, and loading batches promptly so the oven did not idle at temperature.

## Checking the exhaust that is really flowing

The exhaust calculations use volumes at a reference temperature of 25 °C, so that vapour and air are measured on the same basis. The air in an oven's stack is hot, and hot air occupies more volume. At 80 °C, a flow of 275 m³/h at 25 °C occupies 275 × 353.15 ÷ 298.15, about 326 m³/h. A fan rated at 600 m³/h of hot air at 80 °C moves only about 507 m³/h measured at 25 °C. When a stack velocity is measured with an anemometer or a pitot tube and multiplied by the stack's area, the result is the hot volume flow, and it has to be converted before it is compared with a requirement worked out at the reference temperature.

Plant S's engineer measured the stack's velocity across its diameter at the start and end of a batch, converted the flow to 25 °C, and recorded it with the damper position. With the damper fully open, the measured flow at reference conditions was about 500 m³/h, below the fan's nameplate but well above the 275 m³/h requirement. At 500 m³/h, the steady-state peak for a normal batch is about 14% of the 1.2% limit, a little above the 11% the nameplate flow would suggest, and still a comfortable margin. The measurement became an annual check, and the figure used in every later calculation was the measured flow, not the nameplate one.

## Where the oven's vapour goes

The oven's exhaust carries everything the oven removes, about one-third of the paint's and thinning solvent, roughly 85 kg a month at Plant S. It leaves through a stack above the roof, hot and diluted, and in most weather disperses well before it reaches the ground. It is also the most concentrated single vapour stream in the plant, which makes it the natural candidate if the plant ever recovers or destroys solvent vapour rather than releasing it. Chapter 10 looks at how much of it a condenser could recover, and why the answer is disappointing at these concentrations.

### Start-up and shutdown

Two moments in an oven's day deserve special care. At start-up, any vapour left in the oven from the previous day, or leaked into it from outside, must be purged before a burner lights; that is the purpose of the pre-ignition purge. At shutdown, a load left in a cooling oven with the exhaust off continues to release solvent into a closed box. Plant S's procedure keeps the exhaust running until the last batch is out and the oven has cooled, and never leaves a freshly painted batch in a switched-off oven overnight.

## Other ways to keep the margin

Three further practices keep an oven's vapour well below its limit.

1. **Control the load.** Fix the maximum painted area and film thickness per batch, and the minimum flash-off time before the batch enters the oven. More flash-off moves solvent from the oven to the booth, where the airflow is far larger.
2. **Ramp the heat.** A gradual rise to curing temperature spreads the release over a longer time and lowers the peak. It also reduces solvent popping in the film.
3. **Monitor.** Some ovens use a continuous LEL analyser in the exhaust, interlocked with the burner and the conveyor, and the applicable standard may then allow a higher fraction of the limit. An analyser is a specialist installation, calibrated for the vapours concerned and maintained to a schedule.

### Dryers for cleaned parts

The same reasoning applies to dryers for parts cleaned in solvent. Here the load is the liquid left on the parts after draining, which can be much larger than a coating's residual solvent, especially for parts with pockets or blind holes. Draining time, blowing off with air in a ventilated area before the dryer, and rotating parts to empty pockets all reduce the load that reaches the heat.

## How this applies to a small Australian business

Know how much solvent enters your oven or dryer with each load and how fast it leaves. Size or check the exhaust against the peak release, not the average, with the limit for the vapour that actually reaches the oven and a cautious fraction of it. Never throttle an oven's exhaust to save energy without the oven maker's approval; save heat at the door seals and with prompt loading instead. Make sure the burner cannot run without proven exhaust, and have the oven's ventilation assessed by its maker or a competent person against the applicable standard. Measure the exhaust you really have, converted to a common reference temperature, at least once a year.

## Exercise: a bigger batch

The plant wants to cure batches of 60 m² with the same film and flash-off. (a) How much solvent enters the oven per batch? (b) What is the peak release rate, and the exhaust needed for a quarter of a 1.2% LEL on a steady-state basis? (c) Is the oven's measured exhaust of 500 m³/h, at reference conditions, enough?

**Worked answer.** (a) The load scales with area: 0.459 × 60 ÷ 40 = **0.69 kg** per batch. (b) Half in 5 minutes gives 0.69 × 0.5 ÷ (5 ÷ 60) = **4.13 kg/h**, a vapour flow of 4.13 ÷ 0.0817 × 0.02445 = 1.24 m³/h, and an exhaust of 1.24 ÷ (0.25 × 0.012) = **413 m³/h**. (c) **Yes, just**: 500 m³/h keeps the steady-state peak at 1.24 ÷ 500 ÷ 0.012, about 21% of the limit, under a quarter but with far less margin than the normal batch's 14%. The margin has shrunk enough that any heavier film or extra thinner could take it over 25%, so the larger batch should go to the oven maker for confirmation, especially if any temperature correction to the limit applies.
