---
title: "Sampling and quantisation before data reaches a database"
description: "Understand how sampling, aliasing, converter resolution and signal conditioning affect measurement records before storage, reporting or analysis begins."
publishDate: 2026-10-10
category: "Engineering"
tags:
  - manufacturing
  - systems
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

A database can preserve every measurement it receives and still hold a misleading picture of the physical process. Information may already have been lost through slow sampling, limited resolution, clipping or unsuitable filtering. Better storage cannot recover distinctions that the acquisition system never captured.

**Sampling** observes a signal at selected times. **Quantisation** represents its amplitude using a finite set of numerical levels. An analogue-to-digital converter, or ADC, participates in turning a physical signal into digital values, usually as part of a larger chain that includes sensors, conditioning circuits and timing.

Understanding that chain helps engineers specify useful records and helps analysts interpret their limits. The practical question is whether the stored samples preserve the features needed for the intended decision, with sufficient context to explain how those samples were obtained.

## Begin with the physical question

Specify what the measurement must reveal. Tracking a slowly changing tank level, detecting a brief pressure excursion and analysing machine vibration place different demands on acquisition.

A reporting interval is not automatically a suitable sampling interval. A dashboard updated once per minute may still depend on faster acquisition to detect peaks or calculate an appropriate summary.

This is an illustrative example. A process produces a short pressure pulse every few seconds. Recording one instantaneous reading per minute can repeatedly miss the pulse, while recording the maximum over each minute can retain evidence of its magnitude if the underlying acquisition is fast enough.

Define the required amplitude range, relevant frequency content, shortest event of interest and acceptable timing uncertainty. Also identify whether the decision concerns average behaviour, extremes, duration or detailed waveform shape.

Those requirements should drive sensor and acquisition choices. Starting with an available database storage rate and working backwards can produce a convenient dataset that cannot answer the original engineering question.

## Distinguish sampling rate from signal bandwidth

The **sampling rate** is the number of observations taken per second. **Bandwidth** describes the range of signal frequencies being considered. They are related, but they are not the same property.

For ideal reconstruction of a baseband signal with bounded frequency content, the sampling rate must exceed twice the highest retained frequency. Real systems also need practical margin and filtering; choosing a rate exactly at the theoretical boundary is not a complete acquisition design.

A slowly changing quantity can still be accompanied by high-frequency interference. Those unwanted components matter because the sampler observes the combined input, not just the part an analyst intended to study.

Sensor bandwidth, conditioning bandwidth and converter behaviour all influence the signal arriving at the sampling stage. A sensor unable to respond to a brief event cannot be made faster simply by reading its output more frequently.

Use the complete signal path when specifying bandwidth. Record which components limit the response and what their effect means for the intended observation, including delay or attenuation of features near the useful boundary.

## Understand aliasing as a loss of distinction

**Aliasing** occurs when different continuous signals produce indistinguishable sampled sequences under the acquisition conditions. A high-frequency component can appear in sampled data as a lower-frequency component.

This is an illustrative example. A sinusoidal component at 70 Hz sampled at 100 samples per second can appear as a 30 Hz component, with the corresponding phase relationship. Looking only at the samples cannot reliably establish which original component produced them.

```figure
type: svg
title: Aliasing: 70 Hz sampled at 100 per second
alt: A fast 70 hertz wave sampled at 100 samples per second over a tenth of a second. The eleven sample points also fit a slower 30 hertz wave with inverted phase, so after sampling the two cannot be told apart.
caption: The samples alone cannot distinguish 70 Hz from 30 Hz; filter before sampling.
viewbox: 0 0 600 200
body:
<path class="lf" d="M20 100H580"/>
<path class="ln dsh" d="M20.0 100.0L21.4 93.4L22.7 86.9L24.1 80.6L25.4 74.5L26.8 68.7L28.1 63.2L29.5 58.2L30.8 53.8L32.1 49.9L33.5 46.5L34.9 43.9L36.2 41.9L37.5 40.6L38.9 40.0L40.3 40.2L41.6 41.1L43.0 42.7L44.3 44.9L45.6 47.9L47.0 51.5L48.4 55.6L49.7 60.3L51.0 65.5L52.4 71.1L53.8 77.0L55.1 83.3L56.5 89.7L57.8 96.2L59.1 102.8L60.5 109.4L61.9 115.8L63.2 122.1L64.6 128.1L65.9 133.7L67.3 139.0L68.6 143.7L69.9 148.0L71.3 151.6L72.7 154.7L74.0 157.1L75.3 158.8L76.7 159.7L78.0 160.0L79.4 159.5L80.8 158.3L82.1 156.5L83.5 153.9L84.8 150.7L86.2 146.8L87.5 142.4L88.8 137.5L90.2 132.1L91.5 126.4L92.9 120.3L94.3 114.0L95.6 107.5L97.0 100.9L98.3 94.4L99.6 87.8L101.0 81.5L102.3 75.3L103.7 69.5L105.0 64.0L106.4 58.9L107.8 54.4L109.1 50.4L110.5 47.0L111.8 44.2L113.2 42.1L114.5 40.7L115.8 40.1L117.2 40.1L118.5 40.9L119.9 42.4L121.3 44.6L122.6 47.4L124.0 50.9L125.3 55.0L126.7 59.6L128.0 64.7L129.4 70.3L130.7 76.2L132.1 82.4L133.4 88.8L134.8 95.3L136.1 101.9L137.4 108.5L138.8 114.9L140.1 121.2L141.5 127.2L142.8 132.9L144.2 138.2L145.6 143.1L146.9 147.4L148.3 151.2L149.6 154.3L151.0 156.8L152.3 158.6L153.7 159.6L155.0 160.0L156.4 159.6L157.7 158.6L159.0 156.8L160.4 154.3L161.8 151.2L163.1 147.4L164.4 143.1L165.8 138.2L167.2 132.9L168.5 127.2L169.8 121.2L171.2 114.9L172.6 108.5L173.9 101.9L175.3 95.3L176.6 88.8L178.0 82.4L179.3 76.2L180.7 70.3L182.0 64.7L183.3 59.6L184.7 55.0L186.1 50.9L187.4 47.4L188.8 44.6L190.1 42.4L191.4 40.9L192.8 40.1L194.2 40.1L195.5 40.7L196.8 42.1L198.2 44.2L199.6 47.0L200.9 50.4L202.3 54.4L203.6 58.9L205.0 64.0L206.3 69.5L207.7 75.3L209.0 81.5L210.3 87.8L211.7 94.4L213.0 100.9L214.4 107.5L215.8 114.0L217.1 120.3L218.4 126.4L219.8 132.1L221.1 137.5L222.5 142.4L223.8 146.8L225.2 150.7L226.5 153.9L227.9 156.5L229.3 158.3L230.6 159.5L231.9 160.0L233.3 159.7L234.7 158.8L236.0 157.1L237.3 154.7L238.7 151.6L240.1 148.0L241.4 143.7L242.8 139.0L244.1 133.7L245.5 128.1L246.8 122.1L248.2 115.8L249.5 109.4L250.9 102.8L252.2 96.2L253.5 89.7L254.9 83.3L256.3 77.0L257.6 71.1L258.9 65.5L260.3 60.3L261.6 55.6L263.0 51.5L264.4 47.9L265.7 44.9L267.0 42.7L268.4 41.1L269.8 40.2L271.1 40.0L272.4 40.6L273.8 41.9L275.1 43.9L276.5 46.5L277.9 49.9L279.2 53.8L280.6 58.2L281.9 63.2L283.3 68.7L284.6 74.5L285.9 80.6L287.3 86.9L288.7 93.4L290.0 100.0L291.4 106.6L292.7 113.1L294.1 119.4L295.4 125.5L296.8 131.3L298.1 136.8L299.4 141.8L300.8 146.2L302.1 150.1L303.5 153.5L304.8 156.1L306.2 158.1L307.6 159.4L308.9 160.0L310.3 159.8L311.6 158.9L312.9 157.3L314.3 155.1L315.6 152.1L317.0 148.5L318.4 144.4L319.7 139.7L321.1 134.5L322.4 128.9L323.8 123.0L325.1 116.7L326.4 110.3L327.8 103.8L329.2 97.2L330.5 90.6L331.9 84.2L333.2 77.9L334.6 71.9L335.9 66.3L337.3 61.0L338.6 56.3L339.9 52.0L341.3 48.4L342.6 45.3L344.0 42.9L345.3 41.2L346.7 40.3L348.1 40.0L349.4 40.5L350.8 41.7L352.1 43.5L353.4 46.1L354.8 49.3L356.1 53.2L357.5 57.6L358.9 62.5L360.2 67.9L361.6 73.6L362.9 79.7L364.3 86.0L365.6 92.5L366.9 99.1L368.3 105.6L369.7 112.2L371.0 118.5L372.4 124.7L373.7 130.5L375.1 136.0L376.4 141.1L377.8 145.6L379.1 149.6L380.5 153.0L381.8 155.8L383.2 157.9L384.5 159.3L385.9 159.9L387.2 159.9L388.6 159.1L389.9 157.6L391.3 155.4L392.6 152.6L394.0 149.1L395.3 145.0L396.7 140.4L398.0 135.3L399.4 129.7L400.7 123.8L402.0 117.6L403.4 111.2L404.7 104.7L406.1 98.1L407.4 91.5L408.8 85.1L410.1 78.8L411.5 72.8L412.8 67.1L414.2 61.8L415.5 56.9L416.9 52.6L418.3 48.8L419.6 45.7L420.9 43.2L422.3 41.4L423.6 40.4L425.0 40.0L426.3 40.4L427.7 41.4L429.1 43.2L430.4 45.7L431.8 48.8L433.1 52.6L434.4 56.9L435.8 61.8L437.1 67.1L438.5 72.8L439.9 78.8L441.2 85.1L442.6 91.5L443.9 98.1L445.3 104.7L446.6 111.2L447.9 117.6L449.3 123.8L450.7 129.7L452.0 135.3L453.4 140.4L454.7 145.0L456.1 149.1L457.4 152.6L458.8 155.4L460.1 157.6L461.5 159.1L462.8 159.9L464.2 159.9L465.5 159.3L466.9 157.9L468.2 155.8L469.6 153.0L470.9 149.6L472.3 145.6L473.6 141.1L475.0 136.0L476.3 130.5L477.7 124.7L479.0 118.5L480.4 112.2L481.7 105.6L483.1 99.1L484.4 92.5L485.7 86.0L487.1 79.7L488.4 73.6L489.8 67.9L491.1 62.5L492.5 57.6L493.8 53.2L495.2 49.3L496.5 46.1L497.9 43.5L499.3 41.7L500.6 40.5L501.9 40.0L503.3 40.3L504.6 41.2L506.0 42.9L507.3 45.3L508.7 48.4L510.1 52.0L511.4 56.3L512.8 61.0L514.1 66.3L515.5 71.9L516.8 77.9L518.1 84.2L519.5 90.6L520.9 97.2L522.2 103.8L523.5 110.3L524.9 116.7L526.3 123.0L527.6 128.9L529.0 134.5L530.3 139.7L531.6 144.4L533.0 148.5L534.4 152.1L535.7 155.1L537.0 157.3L538.4 158.9L539.8 159.8L541.1 160.0L542.5 159.4L543.8 158.1L545.1 156.1L546.5 153.5L547.9 150.1L549.2 146.2L550.6 141.8L551.9 136.8L553.3 131.3L554.6 125.5L556.0 119.4L557.3 113.1L558.6 106.6L560.0 100.0"/>
<path class="la draw" d="M20.0 100.0L21.4 102.8L22.7 105.6L24.1 108.5L25.4 111.2L26.8 114.0L28.1 116.7L29.5 119.4L30.8 122.1L32.1 124.7L33.5 127.2L34.9 129.7L36.2 132.1L37.5 134.5L38.9 136.8L40.3 139.0L41.6 141.1L43.0 143.1L44.3 145.0L45.6 146.8L47.0 148.5L48.4 150.1L49.7 151.6L51.0 153.0L52.4 154.3L53.8 155.4L55.1 156.5L56.5 157.3L57.8 158.1L59.1 158.8L60.5 159.3L61.9 159.6L63.2 159.9L64.6 160.0L65.9 160.0L67.3 159.8L68.6 159.5L69.9 159.1L71.3 158.6L72.7 157.9L74.0 157.1L75.3 156.1L76.7 155.1L78.0 153.9L79.4 152.6L80.8 151.2L82.1 149.6L83.5 148.0L84.8 146.2L86.2 144.4L87.5 142.4L88.8 140.4L90.2 138.2L91.5 136.0L92.9 133.7L94.3 131.3L95.6 128.9L97.0 126.4L98.3 123.8L99.6 121.2L101.0 118.5L102.3 115.8L103.7 113.1L105.0 110.3L106.4 107.5L107.8 104.7L109.1 101.9L110.5 99.1L111.8 96.2L113.2 93.4L114.5 90.6L115.8 87.8L117.2 85.1L118.5 82.4L119.9 79.7L121.3 77.0L122.6 74.5L124.0 71.9L125.3 69.5L126.7 67.1L128.0 64.7L129.4 62.5L130.7 60.3L132.1 58.2L133.4 56.3L134.8 54.4L136.1 52.6L137.4 50.9L138.8 49.3L140.1 47.9L141.5 46.5L142.8 45.3L144.2 44.2L145.6 43.2L146.9 42.4L148.3 41.7L149.6 41.1L151.0 40.6L152.3 40.3L153.7 40.1L155.0 40.0L156.4 40.1L157.7 40.3L159.0 40.6L160.4 41.1L161.8 41.7L163.1 42.4L164.4 43.2L165.8 44.2L167.2 45.3L168.5 46.5L169.8 47.9L171.2 49.3L172.6 50.9L173.9 52.6L175.3 54.4L176.6 56.3L178.0 58.2L179.3 60.3L180.7 62.5L182.0 64.7L183.3 67.1L184.7 69.5L186.1 71.9L187.4 74.5L188.8 77.0L190.1 79.7L191.4 82.4L192.8 85.1L194.2 87.8L195.5 90.6L196.8 93.4L198.2 96.2L199.6 99.1L200.9 101.9L202.3 104.7L203.6 107.5L205.0 110.3L206.3 113.1L207.7 115.8L209.0 118.5L210.3 121.2L211.7 123.8L213.0 126.4L214.4 128.9L215.8 131.3L217.1 133.7L218.4 136.0L219.8 138.2L221.1 140.4L222.5 142.4L223.8 144.4L225.2 146.2L226.5 148.0L227.9 149.6L229.3 151.2L230.6 152.6L231.9 153.9L233.3 155.1L234.7 156.1L236.0 157.1L237.3 157.9L238.7 158.6L240.1 159.1L241.4 159.5L242.8 159.8L244.1 160.0L245.5 160.0L246.8 159.9L248.2 159.6L249.5 159.3L250.9 158.8L252.2 158.1L253.5 157.3L254.9 156.5L256.3 155.4L257.6 154.3L258.9 153.0L260.3 151.6L261.6 150.1L263.0 148.5L264.4 146.8L265.7 145.0L267.0 143.1L268.4 141.1L269.8 139.0L271.1 136.8L272.4 134.5L273.8 132.1L275.1 129.7L276.5 127.2L277.9 124.7L279.2 122.1L280.6 119.4L281.9 116.7L283.3 114.0L284.6 111.2L285.9 108.5L287.3 105.6L288.7 102.8L290.0 100.0L291.4 97.2L292.7 94.4L294.1 91.5L295.4 88.8L296.8 86.0L298.1 83.3L299.4 80.6L300.8 77.9L302.1 75.3L303.5 72.8L304.8 70.3L306.2 67.9L307.6 65.5L308.9 63.2L310.3 61.0L311.6 58.9L312.9 56.9L314.3 55.0L315.6 53.2L317.0 51.5L318.4 49.9L319.7 48.4L321.1 47.0L322.4 45.7L323.8 44.6L325.1 43.5L326.4 42.7L327.8 41.9L329.2 41.2L330.5 40.7L331.9 40.4L333.2 40.1L334.6 40.0L335.9 40.0L337.3 40.2L338.6 40.5L339.9 40.9L341.3 41.4L342.6 42.1L344.0 42.9L345.3 43.9L346.7 44.9L348.1 46.1L349.4 47.4L350.8 48.8L352.1 50.4L353.4 52.0L354.8 53.8L356.1 55.6L357.5 57.6L358.9 59.6L360.2 61.8L361.6 64.0L362.9 66.3L364.3 68.7L365.6 71.1L366.9 73.6L368.3 76.2L369.7 78.8L371.0 81.5L372.4 84.2L373.7 86.9L375.1 89.7L376.4 92.5L377.8 95.3L379.1 98.1L380.5 100.9L381.8 103.8L383.2 106.6L384.5 109.4L385.9 112.2L387.2 114.9L388.6 117.6L389.9 120.3L391.3 123.0L392.6 125.5L394.0 128.1L395.3 130.5L396.7 132.9L398.0 135.3L399.4 137.5L400.7 139.7L402.0 141.8L403.4 143.7L404.7 145.6L406.1 147.4L407.4 149.1L408.8 150.7L410.1 152.1L411.5 153.5L412.8 154.7L414.2 155.8L415.5 156.8L416.9 157.6L418.3 158.3L419.6 158.9L420.9 159.4L422.3 159.7L423.6 159.9L425.0 160.0L426.3 159.9L427.7 159.7L429.1 159.4L430.4 158.9L431.8 158.3L433.1 157.6L434.4 156.8L435.8 155.8L437.1 154.7L438.5 153.5L439.9 152.1L441.2 150.7L442.6 149.1L443.9 147.4L445.3 145.6L446.6 143.7L447.9 141.8L449.3 139.7L450.7 137.5L452.0 135.3L453.4 132.9L454.7 130.5L456.1 128.1L457.4 125.5L458.8 123.0L460.1 120.3L461.5 117.6L462.8 114.9L464.2 112.2L465.5 109.4L466.9 106.6L468.2 103.8L469.6 100.9L470.9 98.1L472.3 95.3L473.6 92.5L475.0 89.7L476.3 86.9L477.7 84.2L479.0 81.5L480.4 78.8L481.7 76.2L483.1 73.6L484.4 71.1L485.7 68.7L487.1 66.3L488.4 64.0L489.8 61.8L491.1 59.6L492.5 57.6L493.8 55.6L495.2 53.8L496.5 52.0L497.9 50.4L499.3 48.8L500.6 47.4L501.9 46.1L503.3 44.9L504.6 43.9L506.0 42.9L507.3 42.1L508.7 41.4L510.1 40.9L511.4 40.5L512.8 40.2L514.1 40.0L515.5 40.0L516.8 40.1L518.1 40.4L519.5 40.7L520.9 41.2L522.2 41.9L523.5 42.7L524.9 43.5L526.3 44.6L527.6 45.7L529.0 47.0L530.3 48.4L531.6 49.9L533.0 51.5L534.4 53.2L535.7 55.0L537.0 56.9L538.4 58.9L539.8 61.0L541.1 63.2L542.5 65.5L543.8 67.9L545.1 70.3L546.5 72.8L547.9 75.3L549.2 77.9L550.6 80.6L551.9 83.3L553.3 86.0L554.6 88.8L556.0 91.5L557.3 94.4L558.6 97.2L560.0 100.0"/>
<circle class="fa" cx="20.0" cy="100.0" r="5"/>
<circle class="fa" cx="74.0" cy="157.1" r="5"/>
<circle class="fa" cx="128.0" cy="64.7" r="5"/>
<circle class="fa" cx="182.0" cy="64.7" r="5"/>
<circle class="fa" cx="236.0" cy="157.1" r="5"/>
<circle class="fa" cx="290.0" cy="100.0" r="5"/>
<circle class="fa" cx="344.0" cy="42.9" r="5"/>
<circle class="fa" cx="398.0" cy="135.3" r="5"/>
<circle class="fa" cx="452.0" cy="135.3" r="5"/>
<circle class="fa" cx="506.0" cy="42.9" r="5"/>
<circle class="fa" cx="560.0" cy="100.0" r="5"/>
<text class="tx txs" x="580" y="192" text-anchor="end">dashed: 70 Hz · solid: the 30 Hz it appears to be</text>
```

The issue is not merely that a plotted line looks rough. Aliasing can introduce a plausible but false feature into analysis. A low-frequency oscillation in a stored dataset may therefore originate from higher-frequency interference at acquisition.

Increasing the number of points drawn between existing samples does not recover the lost distinction. Interpolation can provide a useful representation under assumptions, but it does not create new physical observations.

When unexpected frequency content appears, investigate acquisition settings and filtering before attributing it to the machine or process. The database may be faithfully preserving an artefact introduced upstream.

## Filter before the sampling ambiguity occurs

An **anti-aliasing filter** reduces unwanted frequency content before it can fold into the retained band. Its requirements depend on the useful signal, unwanted input components and chosen sampling rate.

Real filters have a transition region rather than an infinitely sharp cutoff. The design needs room to pass useful content while sufficiently attenuating components that could alias into it. Oversampling can provide additional separation, but does not eliminate every filtering requirement.

Digital filtering after an initial sampling stage cannot distinguish already aliased interference from a genuine component at the same apparent frequency. Acquisition must address that ambiguity before it is created. Analog Devices provides a practical explanation of the relationship between sampling and anti-alias filtering. [Anti-aliasing filter basics](https://www.analog.com/en/resources/technical-articles/guide-to-antialiasing-filter-basics.html).

Filters also affect time-domain behaviour. A filter suitable for a frequency measurement may alter a short transient's amplitude or shape. Specify acceptable effects using the features the application needs to retain.

Check the actual acquisition device's architecture and documentation. Some devices include filtering and oversampling stages; others require external conditioning. The recorded output rate alone does not reveal the full internal signal-processing path.

## Separate nominal resolution from measurement accuracy

An N-bit converter provides a finite set of output codes. For a simple ideal uniform model, the input span divided by two raised to N gives the nominal code step. That step describes resolution, not the total uncertainty of the measurement.

This is an illustrative example. An ideal twelve-bit converter covering a 0–10 V span has 4,096 codes and a nominal step of approximately 2.44 mV. A small change below that scale may not produce a code change under the simplified model.

```figure
type: stats
title: Resolution of an ideal 12-bit converter
caption: Nominal resolution is not measurement accuracy; noise, offset and calibration also count.
- 0–10 V | Input span
- 4,096 | Codes | 2¹²
- *About 2.44 mV | Nominal step
```

Real measurements also depend on sensor error, reference stability, offset, gain error, noise and nonlinearity. A sixteen-bit data field does not prove sixteen bits of useful accuracy in the measured physical quantity.

The selected input range matters. Using a wide converter range for a small signal wastes available code levels unless suitable conditioning brings the signal into a useful portion of the span.

Avoid claiming precision from the number of decimal places stored. A database column can retain many digits that merely result from a conversion formula. Displayed precision should reflect the measurement's supported information, not the software's formatting capacity.

## Recognise clipping and lost amplitude information

**Clipping** occurs when the signal exceeds the usable input range and the recorded output reaches a limiting value. Once the top of a waveform has been clipped, its true peak cannot be recovered from that record alone.

This is an illustrative example. A sensor-conditioning chain is configured for an expected range, but a transient exceeds it. The database records several identical maximum codes. Treating those codes as the true measured peak understates the unknown excursion.

Preserve overrange or quality flags where the equipment provides them. If the system detects saturation through other means, record the detection rule and its limitations rather than silently replacing clipped values with plausible estimates.

Range selection balances headroom against resolution. More headroom can accommodate unexpected peaks while making each code step larger for a fixed converter resolution. The useful compromise depends on the process and the consequences of missing an excursion.

Test expected extremes and credible abnormal conditions within an appropriate controlled setup. A system calibrated around its usual midpoint may behave differently near its limits or after a large step.

## Treat noise and averaging according to their character

Noise can obscure small changes even when nominal resolution is fine enough to represent them. Averaging can reduce some uncorrelated random variation, but it does not remove every error source.

A stable offset remains after averaging. Periodic interference can interact with sampling in structured ways. Drift over the observation period can make an average less representative of any particular moment.

This is an illustrative example. Repeated readings fluctuate randomly around a value that is itself shifted by a calibration error. Averaging may make the displayed result steadier while leaving the calibration error unchanged.

Choose the averaging window according to the decision. A long window can improve the stability of a slow trend while concealing a short event. Record whether a stored value is an instantaneous sample, a moving average, a block average or another statistic.

Do not describe all quantisation effects as independent white noise without checking the assumptions. With particular signals and timing relationships, quantisation error can be correlated with the input. The useful noise model depends on the acquisition conditions.

## Preserve timing information through the pipeline

The time attached to a record may represent physical acquisition, device transmission, gateway receipt or database insertion. These can differ substantially during buffering or network interruption.

This is an illustrative example. A device samples regularly while disconnected, then uploads a batch later. If every row receives only its insertion timestamp, the dataset appears to contain a burst of simultaneous measurements instead of the original sequence.

Preserve acquisition timestamps or a start time and reliable sample sequence where appropriate. Also retain the time basis, clock synchronisation information and quality indicators needed to interpret timing accuracy.

Clock drift and sampling jitter are different concerns. Drift changes the relationship between clocks over time; jitter varies sample timing around its intended position. Their effects depend on the signal and analysis being performed.

When comparing channels, establish whether samples are simultaneous or sequentially multiplexed. A small inter-channel delay may be irrelevant for a slow temperature trend but important when calculating relationships between rapidly changing signals.

## Reduce stored data without changing the question silently

High-rate acquisition can generate more data than routine reporting needs. Reduction can be sensible, provided the retained representation preserves the features required by the intended use.

**Decimation** reduces sample rate. A suitable low-pass filtering step is generally needed before rate reduction to prevent higher-frequency content from aliasing into the lower-rate representation.

Selecting every hundredth sample without considering frequency content is different from calculating a filtered lower-rate sequence. Likewise, storing an average is different from storing minimum, maximum or duration-above-threshold information.

This is an illustrative example. A one-minute summary retains average pressure, minimum, maximum, sample count and a quality flag. It supports broader interpretation than an average alone, but it still cannot reconstruct the detailed waveform or establish exactly when a short peak occurred.

Document the limits of each retained level. Keep raw or higher-resolution records where the use requires them, under an appropriate storage and lifecycle policy. Do not imply that a summary is equivalent to its discarded observations.

## Store acquisition metadata as part of the measurement

Event-driven recording needs its own interpretation rules. A device may report only when a value changes beyond a threshold, rather than at a fixed interval. That can be efficient for a stable process, but the absence of a new record then means something different from a missing sample in a regularly sampled series.

This is an illustrative example. A level transmitter sends an update only after a meaningful change. Ten minutes without an update might indicate stability, a communication failure or a device fault. A separate heartbeat or quality signal can help distinguish these conditions. Treating all three as a continuous measured constant would overstate what the stored records establish.

Document the trigger threshold, any maximum reporting interval and the treatment of small cumulative changes. Analysis that assumes evenly spaced samples needs to account for irregular event timing. The acquisition method determines which interpolation or duration calculation is defensible, so preserve that method alongside the values rather than expecting an analyst to infer it from timestamp gaps.

A useful measurement record includes more than a value and timestamp. Relevant context can include sensor identity, unit, range, calibration version, sample rate, filter configuration and processing method.

Not every field needs to be repeated on every row. A configuration record with an effective period or version can describe many samples, provided the relationship is preserved and changes are recorded reliably.

This is an illustrative example. A channel's scaling changes after a sensor replacement. Historical raw codes must remain associated with the old scaling, while later codes use the new one. Applying only the current conversion formula to all history changes the meaning of old measurements.

Preserve quality states explicitly: missing sample, communication failure, overrange, maintenance mode or substituted value. A zero should remain a genuine measured zero where that is what the source recorded.

Make transformations traceable. Analysts should be able to determine whether a stored engineering value came directly from a calibrated device, from a gateway conversion or from a later database calculation.

## Validate acquisition and storage together

Use known inputs and controlled changes to verify the complete path from physical or electrical stimulus to stored record. Check amplitude, timing, units, quality flags and the handling of configuration changes.

Test missing and delayed data. Confirm that a sequence gap remains distinguishable from a stable process and that buffered samples retain their intended timing when they arrive late.

Include a signal near the useful bandwidth boundary and a relevant out-of-band disturbance when the test setup and engineering requirements call for them. These tests assess whether the acquisition chain preserves the intended features, rather than merely whether the database accepts rows.

Reconcile sample counts and time coverage between device output and stored data. A database that loses every tenth record can create a misleading acquisition pattern even if the converter itself is operating correctly.

Record the tested settings and limitations with the dataset. Reliable analysis begins with knowing what the acquisition system could observe, what it transformed and what it could not preserve. Database design then maintains that meaning through storage and use.

*Source basis: coding, quantisation, sampling theory and converter-error discussions in Data Conversion Handbook (2005), supplied in the collection. This is an electronics book despite its location in the database folder. The article is general measurement-system education, not a component specification or engineering compliance approval.*
