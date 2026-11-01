---
book: variable-speed-drives-by-the-numbers
chapterSlug: junction-temperature-and-cabinet-cooling
order: 4
title: "Junction temperature and cabinet cooling"
description: "How to estimate the junction temperature of a drive's switches through its thermal resistances, size the cabinet ventilation for a panel of drives, and keep dusty air from defeating it."
draft: false
---

Every watt of loss worked out in Chapter 3 ends up as heat that flows from the silicon chip through solder, copper, ceramic, a baseplate, a layer of thermal paste and a heatsink into air. Each layer resists the flow, and the chip ends up hotter than the air by the sum of the temperature drops across them. The chip's temperature decides how much current the drive may deliver, how fast its leakage grows and, as Chapter 5 shows, how long it lasts. And the air the heatsink sees is the air in the cabinet, which is only as cool as the cabinet's ventilation makes it.

This chapter sets out the thermal resistance chain from junction to air, works the junction temperature of DP-4's fan drive, sizes the cabinet ventilation for all three drives and looks at other ways of cooling a panel. It ends with the filters that turned a correctly sized fan into an undersized one.

## The thermal resistance chain

Heat flow through a series of layers behaves like current through resistors in series. Each layer has a thermal resistance R_th in kelvin per watt, and the temperature drop across it is the heat flowing through it times its resistance. A module datasheet gives the resistance from each chip's junction to the module's case, separately for each IGBT and each diode, and usually the resistance from the case to the heatsink with a specified thermal paste. The heatsink maker, or the drive maker for a drive's own heatsink, gives the heatsink's resistance to the air at a stated airflow.

```figure
type: formula
title: Steady junction temperature in a module on a heatsink
formula: T_heatsink = T_air + P_total × R_th(h−a)
formula: T_case = T_heatsink + P_total × R_th(c−h)
formula: T_j,IGBT = T_case + P_IGBT × R_th(j−c),IGBT
formula: T_j,diode = T_case + P_diode × R_th(j−c),diode
caption: P_total is the total loss of everything on the heatsink, here the inverter module and the rectifier; P_IGBT and P_diode are the losses of one chip. Each chip has its own path from junction to case, but all share the case-to-heatsink layer and the heatsink. Steady values only: within each output cycle the junction temperature also ripples, which matters at very low output frequency.
- R_th(j−c) | junction to case, per chip, K/W
- R_th(c−h) | case to heatsink, per module, K/W
- R_th(h−a) | heatsink to air, K/W
```

For the fan drive, the datasheet and the drive maker's figures give R_th(j−c) of 0.30 K/W for each IGBT and 0.50 K/W for each diode, R_th(c−h) of 0.02 K/W for the module with its paste, and a heatsink resistance of 0.08 K/W with the drive's own heatsink fan running. The rectifier sits on the same heatsink, so the heatsink carries the inverter's 312 W and the rectifier's 144 W at full load, 456 W in all.

```figure
type: steps
title: DP-4 fan drive at full load, 4 kHz, with 45 °C cabinet air
caption: This is an illustration. Losses from Chapter 3: IGBT 42.8 W (31.0 conduction + 11.8 switching), diode 9.2 W, 456 W on the heatsink.
- Cabinet air at the heatsink inlet | 45.0 °C
- Heatsink, + 456 × 0.08 = 36.5 K | 81.5 °C
- Module case, + 456 × 0.02 = 9.1 K | 90.6 °C
- Hottest diode junction, + 9.2 × 0.50 = 4.6 K | 95.2 °C
- * Hottest IGBT junction, + 42.8 × 0.30 = 12.8 K | 103.4 °C
```

At 103 °C the IGBTs are well inside their 150 °C limit for continuous operation. That margin is deliberate. It covers the losses rising with junction temperature, which the estimate has already partly allowed for by using 125 °C datasheet values, overloads during starting or jams, dust on the heatsink fins and, most importantly for life, the size of temperature swings the junction goes through (Chapter 5).

The heatsink is the largest single drop, 36.5 K of the 58 K from air to junction. That is typical: the chip-level resistances are small because the chips are thin and well bonded, but the heatsink must hand the whole drive's heat to air, a poor conductor. READOS's [Fins and Heat Sinks by the Numbers](/reados/publications/fins-and-heat-sinks-by-the-numbers/) explains how a heatsink's resistance follows from its fins and airflow.

```figure
type: compare
title: The fan drive's temperatures at four operating points
cols: Heat on the heatsink | Heatsink | IGBT junction | Margin to 150 °C
rowhead: Operating point
- 40 Hz duty, 45 °C air | 192 W | 60.4 °C | 69.6 °C | 80 K
- * Full load, 4 kHz, 45 °C air | 456 W | 81.5 °C | 103.4 °C | 47 K
- Full load, 4 kHz, 50 °C air | 456 W | 86.5 °C | 108.4 °C | 42 K
- Full load, 12 kHz, 45 °C air | 644 W | 96.5 °C | 129.3 °C | 21 K
caption: This is an illustration. Same thermal resistances; losses from Chapter 3. At 12 kHz the heatsink passes the drive's 90 °C heatsink trip setting, which is why the drive in Chapter 3 tripped on hot afternoons.
```

## Overloads and time

The steady figures hold only once every layer has reached its final temperature, and the layers take very different times to get there. A chip a fraction of a millimetre thick, bonded to copper, heats in milliseconds to a second. The module's baseplate takes seconds. A heatsink of several kilograms of aluminium takes minutes. Datasheets therefore give a transient thermal impedance curve, Z_th, which rises from near zero to the steady R_th over time.

That is what lets a drive carry a short overload. Drives are commonly rated for 150% of their rated current for 60 seconds in heavy duty, or about 110% in normal duty, with a cooling period between. At 150% of the fan motor's current, the IGBT's loss rises from 42.8 W to about 74.5 W, and its rise above the case from 12.8 K to 22.4 K, almost at once. The heatsink, in contrast, responds slowly, so over 60 seconds it warms only part of the way towards the higher steady temperature it would eventually reach. The drive's software models this with a thermal model of its own switches and limits the current when the model says the junction is near its limit.

## Low output frequency

The steady junction temperatures above are averages over the output cycle. At 50 Hz, each IGBT conducts for half of each 20 ms cycle, and the chip's temperature ripples only slightly around its average, because the cycle is short compared with the chip's thermal response. At very low output frequency the ripple becomes large: at 1 Hz each IGBT conducts for half a second at a time, long enough for its junction to heat nearly to the temperature it would reach carrying that current continuously.

The worst case is full current at standstill, as when a conveyor drive holds a jammed belt or starts a heavily loaded one. One IGBT may then carry the peak current, 76.1 A in the fan drive's case, for long periods. Taking it as conducting half the time and switching at the full rate, its loss would be about 64 W of conduction plus 37 W of switching, about 101 W, and its rise above the case about 30 K, compared with 12.8 K at 50 Hz. Drive makers derate the available current below a few hertz for this reason, and their manuals state the limits.

## Humidity and condensation

The wash hall's air is humid as well as warm. While the drives run, the cabinet is warmer than the hall and its air relatively dry. When they stop overnight in winter, the cabinet cools, and humid air drawn in through the filters can reach its dew point on the cold steel and on the drives' circuit boards. Condensation on a board at 540 V, with conductive plastic fines and detergent residue on it, is a recipe for tracking and flashover when the drive is next switched on. DP-4 therefore has a thermostatically controlled anti-condensation heater, which keeps the cabinet a few kelvin above the hall's air whenever the drives are idle. A sealed cabinet with through-panel heatsinks would reduce the problem further.

## The cabinet

DP-4's cabinet is a 2,000 × 1,200 × 600 mm painted steel enclosure standing against a wall of the wash hall. Inside are the three drives, their DC chokes, a programmable controller, power supplies and terminals. Air enters through two filter grilles low in the door and leaves through two filter fans high in the door, each rated 300 m³/h free-blowing and about 230 m³/h with clean filters fitted at both inlet and outlet.

At full load, the heat released in the cabinet is the three drives' losses plus the control equipment: about 556 W for the fan drive, 406 W for the pump drive, 178 W for the conveyor drive and 80 W for the controller and power supplies, 1,220 W in all. The wash hall's air reaches 38 °C on summer afternoons, and the drives are rated for full output with air up to 45 °C around them, so the cabinet may rise by 7 K at most.

The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) works out the heat lost through the cabinet's walls, the heat the fans must remove and the airflow needed. The cabinet's effective surface, the door, top and two sides, is about 5.5 m², and painted steel in still indoor air loses heat at about 5.5 W/(m²·K).

```figure
type: compare
title: DP-4 cabinet ventilation, 38 °C hall air, 45 °C inside limit, from the enclosure cooling airflow tool
cols: Wall loss | Heat for the fans | Airflow needed | Fans deliver | Result
rowhead: Case
- * As designed, clean filters | 212 W | 1,008 W | 456.6 m³/h | 460 m³/h | FAN ADEQUATE
- Filters loaded with plastic fines | 212 W | 1,008 W | 456.6 m³/h | 250 m³/h | FAN TOO SMALL
- Heatsinks mounted through the back panel | 212 W | 128 W | 58.1 m³/h | 100 m³/h | FAN ADEQUATE
caption: This is an illustration. P = 1,220 W, or 340 W with the heatsink losses outside the cabinet; A_s = 5.5 m², k = 5.5 W/(m²·K), air density 1.13 kg/m³, c_p = 1.005 kJ/(kg·K). The design had less than 1% margin on airflow with clean filters.
```

## Other ways to cool a panel

Filtered fans are cheap and work well in clean air, but they bring hall air into the cabinet, and in a wash hall that air is warm, humid and carries plastic fines and spray. The main alternatives are:

- **Through-panel mounting.** Many drives can be mounted with their heatsinks projecting through a cut-out in the cabinet's back panel, sealed with a gasket, so that the heatsink's fan blows hall air across the fins outside while the electronics stay inside a sealed cabinet. Most of each drive's loss, the inverter and rectifier, then leaves directly into the hall. For DP-4, that would take about 880 W out of the cabinet and leave 340 W inside, which the walls and a small fan could carry; the cabinet could be sealed to a high ingress protection rating. The heatsink fins outside still collect dust and need cleaning.
- **Air-to-air heat exchangers**, which pass cabinet air and hall air on opposite sides of a plate or heat pipe without mixing them. They keep the cabinet sealed, but can only cool it to above the hall's temperature.
- **Cabinet air conditioners**, which can cool below the hall's temperature and keep the cabinet sealed, at the cost of power, maintenance and condensate to be drained. A thermoelectric cooler, which has no moving refrigerant, suits only small loads of tens of watts, such as a sensor box; WORKOS's thermoelectric cooler check shows how quickly its efficiency falls as the load and temperature lift rise.
- **Locating the panel elsewhere**, in a clean, cool electrical room, with longer motor cables. Long cables bring their own issues (Chapter 9).

## Measuring rather than estimating

Every drive in DP-4 measures its own heatsink temperature with a sensor in the heatsink or in the module, and makes the reading available as a parameter. The plant's controller reads the three heatsink temperatures and the cabinet air temperature every minute and logs them with the output currents. That log is the best check on the estimates in this chapter: plotted against current and hall temperature over a summer, it shows the heatsink's actual rise per watt, and a drift upwards at the same load is the first sign of a clogged heatsink, a failing heatsink fan or dirty filters. A thermal imaging camera, used with the cabinet door briefly open, finds hot terminals and chokes that the drives' own sensors cannot see.

## The error: the filters that took the margin

In the second summer, the fan drive and then the pump drive began reporting heatsink temperature warnings on hot afternoons, and the fan drive tripped once, stopping the extraction and with it the granulators. Nothing about the drives or their settings had changed since the switching frequency was restored (Chapter 3).

The plant's engineer opened the cabinet on a warning and found the inside air at 49 °C with the hall at 38 °C. The filter mats in the door were grey with plastic fines and lint. With an anemometer held at the outlet grilles, the two fans together delivered about 250 m³/h. The enclosure cooling airflow tool showed why that mattered: 457 m³/h was needed to hold the cabinet at 45 °C, and the design had only 3 m³/h to spare with new filters. With 250 m³/h, the heat balance settles where the walls and the reduced airflow together carry 1,220 W, at about 11 K above the hall, 49 °C, which matched the measurement. At 49 °C, the fan drive's heatsink at full load would reach about 85.7 °C, close to its 90 °C trip, and any extra load took it over.

```figure
type: checklist
title: Cabinet cooling checks the plant adopted
caption: This is an illustration. The first three were done at once; the fourth at the drives' next replacement.
- x Filter fans replaced with a larger pair giving 2 × 400 m³/h with clean filters, a margin of about 75% over the 457 m³/h needed
- x Filter mats changed monthly in the wash hall, with the date marked on the door; airflow measured quarterly
- x Cabinet temperature monitored by the controller, with an alarm at 43 °C
- ? When the drives are replaced, mount them through the back panel and seal the cabinet
```

The general lesson is to design cabinet ventilation for the worst airflow the system will see between maintenance visits, not the best. A filter fan's free-blowing rating is irrelevant; its flow with the filters as dirty as they will get before the next change is what counts, as the tool's own check says.

## Exercise: a hotter hall

On a 42 °C day, the hall air reaches 41 °C. The new fans deliver 800 m³/h with clean filters.

1. With the cabinet allowed to reach 45 °C, how much airflow is needed?
2. If the drives were allowed only a 4 K rise, what does that say about the inside temperature on such a day?
3. At full load, what would the fan drive's IGBT junction temperature be if the cabinet air reached 48 °C?

### Worked answer

1. ΔT = 45 − 41 = 4 K. Wall loss = 5.5 × 5.5 × 4 = 121 W. The fans must remove 1,220 − 121 = 1,099 W. Air mass flow = 1,099 × 3.6 ÷ (1.005 × 4) = 984 kg/h; volume = 984 ÷ 1.13 = 871 m³/h. The 800 m³/h fans are just short.
2. On such a day the cabinet will settle a little above 45 °C, about 45.3 °C if the walls and 800 m³/h together must carry the heat. The drives' 45 °C limit is exceeded slightly, and their output current may be derated by their own protection. On the hottest days the plant runs F-1 under pressure control rather than at full speed, which keeps the actual losses well below the full-load figure.
3. Each step adds the same drops as before: heatsink 48 + 36.5 = 84.5 °C, case 93.6 °C, IGBT junction 93.6 + 12.8 = 106.4 °C, still well inside 150 °C, but with the heatsink within about 5 K of its trip.
