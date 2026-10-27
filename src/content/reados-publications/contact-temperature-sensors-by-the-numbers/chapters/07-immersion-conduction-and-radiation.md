---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: immersion-conduction-and-radiation
order: 7
title: "Immersion, conduction, radiation and contact"
description: "Stem conduction and the immersion a probe needs, radiation from heaters and cold doors, attaching sensors to surfaces, and a controller sensor moved into a dead pocket."
draft: false
---

Chapter 1 showed that a sensor settles at a weighted average of everything it exchanges heat with. This chapter puts numbers on the three couplings that most often pull a sensor away from the temperature it is meant to read: conduction along its own stem to a cooler mounting, radiation to and from surfaces hotter or colder than the air, and imperfect contact with a surface. In CV-180, as in most installations, each of these can be larger than every error from the sensor and its instrument put together.

The chapter works out how deep CV-180's control probe must be immersed, how much a heater element in view can push an air reading up, and how the way a thermocouple is attached to a part changes what it reads. It ends with a duct modification that moved the control sensor into a pocket of still air and made the oven run 10 K hot.

## Conduction along the stem

A probe that passes through the wall of a duct or an oven has one end in the hot air and the other in a cooler fitting, so heat flows along its sheath from the tip towards the wall. The tip has to receive that heat from the air, and it can only do so if it is slightly cooler than the air. The deeper the probe is immersed, the more surface the air has to warm it and the further the tip is from the cool end, so the smaller the error.

A probe stem in moving air behaves exactly like a fin, the same physics that governs a heat-sink fin, and the fin equation gives the error directly. [The fin equation](/reados/publications/fins-and-heat-sinks-by-the-numbers/the-fin-equation/) in *Fins and Heat Sinks by the Numbers* derives it; here it is applied with the tip at the far end of the fin.

```figure
type: formula
title: Stem conduction error of an immersed probe
formula: Tair − Ttip = (Tair − Twall) ÷ cosh(m·L),   m = √(4h ÷ (k·d))
caption: This is an illustration, treating CV-180's 6 mm stainless sheath as a solid rod with a negligible heat loss from its tip. The error falls exponentially with immersion once m·L exceeds about 2.
- L | immersed length, m
- d | sheath diameter, m
- h | surface coefficient of the air on the sheath, W/m²·K
- k | effective conductivity of the sheath, W/m·K: 16 for stainless steel
- Twall | temperature of the stem where it enters the duct, °C
step: d = 6 mm, h = 40 W/m²·K: m = √(4 × 40 ÷ (16 × 0.006)) = 40.8 per metre
step: L = 150 mm, air 200 °C, wall fitting 80 °C: cosh(6.12) = 228, so the error is 120 ÷ 228 = 0.53 K
step: L = 50 mm, same conditions: cosh(2.04) = 3.9, so the error is 30.7 K
```

The error depends on three things the installer can control. Immersion length matters most, because it sits inside an exponential: going from 50 mm to 150 mm cuts the error from about 31 K to about half a kelvin. The surface coefficient matters next: in slow air, the tip receives less heat and the error grows. The sheath diameter matters because a thinner stem conducts less heat for the same surface area: at 100 mm immersion in the same air, a 3 mm sheath's error is 0.75 K where a 6 mm sheath's is 4.05 K. Insulating the mounting fitting, so that the stem enters the duct at a temperature closer to the air's, also helps, because the whole error scales with Tair − Twall.

```figure
type: line
title: Stem conduction error of CV-180's 6 mm Pt100 by immersion
x: Immersed length, mm
y: Reading below air temperature, K
ymin: 0
ymax: 100
legend: Duct air, h = 40 W/m²·K | Still pocket, h = 15 W/m²·K
mark: 150 | Design immersion
caption: This is an illustration: air 200 °C, stem entering at 80 °C, 6 mm stainless sheath. In good airflow 150 mm gives about 0.5 K; in a still pocket the same probe needs about 250 mm.
- 25 | 76.55 | 99.85
- 50 | 30.65 | 63.55
- 75 | 11.21 | 35.96
- 100 | 4.05 | 19.57
- 125 | 1.46 | 10.52
- 150 | 0.53 | 5.64
- 175 | 0.19 | 3.02
- 200 | 0.07 | 1.62
```

The calculation treats the sensing element as a point at the tip. A real Pt100 element is several millimetres to a few tens of millimetres long, and it reads an average over that length, so the immersion needed is the fin calculation's length plus the element's length. A common rule of thumb asks for an immersion of at least ten to twenty sheath diameters plus the element length in liquids, where h is large, and more in gases. The fin equation is better than the rule because it shows how the answer depends on the airflow: in CV-180's duct air, the 6 mm probe needs about 150 mm for a 0.5 K error, 25 diameters; in a still pocket it would need about 250 mm.

### Checking immersion in place

Immersion error can be detected without any calculation. Withdraw the probe by 20 or 30 mm while the process is steady and watch the reading. If it does not change by more than the instrument's resolution, the probe is immersed deeply enough. If it falls, the probe was not fully immersed at its original depth either, and the true error was larger than the change seen. The test takes a few minutes and is the most direct check of an installation there is. Where a probe cannot be withdrawn, because it is fixed in a compression fitting or a thermowell, the same information comes from comparing it with a second, deeper probe or a thin reference thermocouple pushed past it into the airstream; a difference that changes with the fan speed points to conduction, and a difference that changes with the heater duty points to radiation.

## Radiation

A sensor in a gas exchanges heat with the gas by convection and with every surface it can see by radiation. In a recirculating oven, most of the walls are close to the air temperature and radiation makes little difference. Near a heater element, an open door or a cold product, it can make a great deal.

The sensor settles where the convection from the air balances the net radiation from the surfaces: h(Ts − Tair) = εσF(Tsurface⁴ − Ts⁴), where ε is the sensor's emissivity, σ the Stefan–Boltzmann constant and F the fraction of the sensor's view taken by the surface. Because radiation goes as the fourth power of absolute temperature, a surface a few hundred kelvin hotter than the air has a large effect even when it fills a small part of the view.

This is an illustration. Suppose an exposed thermocouple bead with an oxidised surface, ε = 0.8, sits in 200 °C air with h = 50 W/m²·K, and a heater element at 450 °C fills a tenth of its view, the rest being walls at about air temperature. Solving the balance gives a bead temperature about **14.5 K above the air**. With the element filling a twentieth of the view, the error is about 7.3 K; with a fifth, about 28.5 K. In slower air, h = 25 W/m²·K, the error at a tenth of the view rises to about 22 K, because the convection that holds the bead to the air is weaker.

```figure
type: bars
title: Radiation error of an air sensor near a 450 °C element, 200 °C air
unit: K
max: 30
caption: This is an illustration, solved from the convection–radiation balance. Reducing the sensor's emissivity with a shield, or keeping it out of sight of the element, cuts the error more than any other change.
- Element fills 1/5 of view, ε 0.8 | 28.53
- Element fills 1/10 of view, slow air h 25 | 22.21
- * Element fills 1/10 of view, ε 0.8 | 14.45
- Element fills 1/20 of view, ε 0.8 | 7.27
- Element fills 1/10, shielded, effective ε 0.2 | 4.62
- Near a 120 °C door, fills 3/10 of view | -6.41
```

The defences are straightforward. Put air sensors where they cannot see the elements, which in CV-180 means in the supply duct downstream of the heater bank and its baffles. Where that is not possible, fit a **radiation shield**: a thin, open tube of polished metal around the sensor that lets the air through but blocks the view of the hot surface, reducing the effective emissivity of the exchange. Keep the air velocity past the sensor high, because the error falls as h rises. And remember that radiation works both ways: a sensor near a door that cools when opened, or near a cold load, reads low, about 6 K low in the last bar of the figure.

When the air temperature itself must be known well, for example in a survey to prove an oven's uniformity, the best practice is to combine all three defences: a small sensor with a low-emissivity shield, placed where the air moves briskly, or even an aspirated probe, in which a small fan draws air past the shielded sensor at a known speed. An exposed thermocouple hung in the middle of an oven is quick and convenient, and in a well-stirred convection oven with no hot surfaces in view it can be good to a kelvin or so, but near elements, burners or open doors its reading is a mixture of air and surfaces whose proportions nobody knows. A survey should record, for each air sensor, what it could see.

CV-180's over-temperature limit thermocouple is a case where a small radiation error is acceptable in one direction. If it sees the elements, it reads slightly high and trips slightly early, which errs on the safe side. If it sees a cold door, it reads low and trips late. Its position was chosen to see neither.

## Attaching sensors to surfaces

Profiling a part means measuring the temperature of its surface, and a surface is the hardest place to measure with a contact sensor. The sensor has to be in good thermal contact with the metal while also being exposed to the air, which is at a different temperature; its own mass has to heat up; and its leads conduct heat to or from the junction. Every method of attachment strikes a different balance.

```figure
type: compare
title: Ways to attach a trailing thermocouple to a steel part in CV-180
cols: How it couples | Typical behaviour during heating | Suits
caption: This is an illustration; the behaviours were measured for CV-180 against a junction peened into a drilled hole in the same plate. Every method should be checked this way on a representative part before its readings are relied on.
- *Junction peened into a shallow drilled hole | metal on all sides of the junction | the reference; follows the metal closely | proving runs and checking other methods
- Bare junction under a spring clip | point contact; junction partly exposed to air | reads up to about 1 K high while air is hotter | thin panels and quick checks
- Magnetic surface probe | junction in a small pad held by a magnet | reads up to about 2 K low at 180 °C; the magnet's mass lags | routine profiles on steel, with a stated correction
- High-temperature tape over the junction | contact under tape; tape insulates from air | good if the tape survives; adhesive may fail near 200 °C | short runs below the tape's rating
- Bolted lug or welded stud | metal contact through a fastening | good if tight and small | permanent test parts
```

Two physical points explain the behaviours. First, any part of the junction exposed to the air is coupled to the air, which is hotter than the metal during heating, so a loosely attached junction reads high. Second, any mass attached to the junction, such as a magnet or a heavy clip, must itself be heated by the metal, and while it lags it draws heat from the junction, so a heavy attachment reads low during heating. On a part that has reached a steady temperature, both effects shrink to whatever conduction and radiation remain, which is why the method matters most when it matters most: during the approach to 180 °C, when the cure clock starts.

CV-180 uses magnetic probes for routine profiles because they are quick to place and move on steel parts, and peened junctions in a dedicated test plate for checking them. The difference measured between them, about 2 K low for the magnetic probe at the 180 °C crossing, is recorded and either corrected or carried in the uncertainty budget of Chapter 9.

## How this applies to a small Australian business

Installation errors are the ones that survive calibration, because a calibration laboratory tests the sensor in a well-stirred bath or dry block, never in the duct or oven where it lives. A small business can catch most of them with three habits that cost almost nothing. Do the withdrawal test whenever a probe is fitted or moved, and record the result. Keep air sensors out of sight of heaters, burners and doors, and in fast-moving air. And check every method of attaching a sensor to a part against a peened or embedded junction on one representative part before using it for routine profiles. Equipment makers and fitters know where a sensor is convenient to reach; the business knows what the sensor is for, and should say so before the boss is welded on.

## The error: a sensor in a dead pocket

This is an illustration. CV-180's supply duct was modified to fit a larger fan, and the controller's Pt100 had to move. The fitter mounted it through a new boss at the inside of a duct elbow, where it was easy to reach, with the same 125 mm of immersion it had always had. At the inside of an elbow the flow separates, and the probe now sat in a pocket of slow, recirculating air, where the surface coefficient on its sheath was about **15 W/m²·K** instead of about 40.

With 125 mm immersion, the fin equation gives an error of about **10.5 K** at h = 15 W/m²·K, against about 1.5 K in the old position. The controller, reading about 10 K low, held its display at 200 °C while the supply air ran at about **210 °C**. Panels came out slightly glossier and some white powders yellowed at the edges. Energy use rose. The limit, set at 230 °C, did not trip.

The next profile survey found it: the logger's air channel near the supply read about 210 °C against the controller's 200 °C. The withdrawal test confirmed it at once, because pulling the probe back by 25 mm dropped the controller's reading by several kelvin, where in a good installation it would hardly have moved. The probe was moved to a straight length of duct downstream of the elbow, where the air was fast and well mixed, and immersed by 150 mm. The withdrawal test then changed the reading by less than 0.2 K, and the survey agreed with the controller.

```figure
type: checklist
title: Installation checks for CV-180's sensors
caption: The open item is this chapter's error. Airflow at the sensor matters as much as the immersion depth.
- x Probe immersed to the fin-equation length plus the element | about 150 mm for 6 mm in duct air
- x Probe in fast, mixed air, not in a pocket or behind a baffle | straight duct, downstream of heaters and fan
- x No view of heater elements or doors | or a radiation shield fitted
- x Mounting fitting insulated from the oven skin | raises Twall, shrinks the error
- x Surface attachment checked against a peened junction | magnetic probe about 2 K low at 180 °C
- ? Withdrawal test after any change to the duct | elbow pocket: 10.5 K low
```

## Exercise: a thinner probe

Instead of moving the controller's probe, the fitter suggests keeping the elbow position but changing to a **3 mm** sheath of the same material, also at 125 mm immersion. With h = 15 W/m²·K in the pocket, air at 200 °C and the stem entering at 80 °C, what would the error be, and is the suggestion sound?

**Worked answer.** For d = 3 mm, m = √(4 × 15 ÷ (16 × 0.003)) = √1,250 = **35.4 per metre**. At L = 0.125 m, m·L = 4.42 and cosh(4.42) is about 41.5, so the error is 120 ÷ 41.6 = about **2.9 K**. The thinner probe cuts the error from about 10.5 K to about 2.9 K, but it does not remove it, and the pocket's surface coefficient would still change with fan speed and filter condition, so the error would vary. A 3 mm probe is also slower to bend and more easily damaged. The sound fix is the one adopted: move the probe into fast, mixed air, where the 6 mm probe's error is about half a kelvin and stays there.
