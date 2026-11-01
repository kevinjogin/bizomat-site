// KEVOS® WORKOS input guides: handbook76. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook76.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "bearing-defect-frequency-check": {
    rpm: {
      what: "The rotational speed of the shaft carrying the rotating race, which every defect frequency is proportional to.",
      tip: "Measure it at the time of the vibration reading; speeds on variable-speed drives change with load.",
      effect: "All four defect frequencies rise in proportion to the shaft speed.",
      fig: "rotation",
      sym: "N"
    },
    nb: {
      what: "The number of balls or rollers in one row of the bearing, which sets how many times per revolution a race defect is struck.",
      tip: "Take it from the bearing maker’s data for the exact designation; it is not stamped on the bearing.",
      effect: "The ball pass frequencies rise in proportion; the cage and ball spin frequencies do not change.",
      fig: "count",
      sym: "n"
    },
    d: {
      what: "The diameter of one ball or roller in the bearing, which with the pitch diameter sets the geometry ratio in every formula.",
      tip: "Use the maker’s value; measuring a ball from a used bearing is only an approximation.",
      effect: "A larger element lowers the outer race and cage frequencies and raises the inner race frequency.",
      fig: "diameter",
      sym: "d"
    },
    D: {
      what: "The diameter of the circle through the centres of the balls or rollers, roughly midway between the bore and the outside diameter.",
      tip: "If the maker does not give it, the average of bore and outside diameter is a reasonable estimate.",
      effect: "Changes the ratio d ÷ D that shifts every defect frequency.",
      fig: "diameter",
      sym: "D"
    },
    phi: {
      what: "The angle between the line of contact through a ball and the plane at right angles to the shaft, which reduces the effective geometry ratio.",
      tip: "Deep groove ball bearings under radial load run close to zero; angular contact bearings are typically 15 to 40 degrees, from the maker’s data.",
      effect: "A larger angle reduces the cosine term, moving the outer and inner race frequencies closer together.",
      fig: "angle",
      sym: "φ"
    },
    fm: {
      what: "The frequency of the spectrum peak you want to identify, read from the vibration spectrum or the envelope spectrum.",
      tip: "Read the peak from the envelope (demodulated) spectrum for early bearing faults; the raw spectrum often hides them.",
      effect: "Only changes which defect, if any, is matched; the defect frequencies do not change.",
      fig: "frequency",
      sym: "f"
    },
    tol: {
      what: "How close the measured peak must be to a defect frequency or its harmonic, as a share of that frequency, to count as a match.",
      tip: "Allow a little for slip and speed error; too wide a band matches peaks that are not bearing faults.",
      effect: "A wider tolerance matches more peaks; the defect frequencies do not change.",
      fig: "percent"
    }
  },
  "individuals-chart-check": {
    k: {
      what: "How many of the readings listed below are used for the chart, taken from the first reading in time order.",
      tip: "Use at least 12 for rough limits; recalculate with 20 to 25 readings when you have them.",
      effect: "Readings beyond this count are ignored.",
      fig: "count",
      sym: "n"
    },
    x1: {
      what: "Measurement number 1 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 1 must come first in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x1"
    },
    x2: {
      what: "Measurement number 2 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 2 must come after reading 1 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x2"
    },
    x3: {
      what: "Measurement number 3 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 3 must come after reading 2 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x3"
    },
    x4: {
      what: "Measurement number 4 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 4 must come after reading 3 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x4"
    },
    x5: {
      what: "Measurement number 5 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 5 must come after reading 4 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x5"
    },
    x6: {
      what: "Measurement number 6 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 6 must come after reading 5 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x6"
    },
    x7: {
      what: "Measurement number 7 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 7 must come after reading 6 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x7"
    },
    x8: {
      what: "Measurement number 8 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 8 must come after reading 7 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x8"
    },
    x9: {
      what: "Measurement number 9 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 9 must come after reading 8 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x9"
    },
    x10: {
      what: "Measurement number 10 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 10 must come after reading 9 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x10"
    },
    x11: {
      what: "Measurement number 11 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 11 must come after reading 10 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x11"
    },
    x12: {
      what: "Measurement number 12 in the order the readings were taken, one value of the characteristic per sample, part or batch.",
      tip: "Keep the time order: reading 12 must come after reading 11 in time, or the moving ranges mean nothing.",
      effect: "Changes the mean, its moving ranges and so the control limits; a value far from the rest may fall outside them.",
      fig: "number",
      sym: "x12"
    }
  },
  "p-chart-check": {
    n: {
      what: "The number of items inspected in every sample, the same for each sample on this chart.",
      tip: "Samples of different sizes need limits worked out for each sample; this tool assumes they are all the same.",
      effect: "Larger samples narrow the control limits, so smaller shifts show.",
      fig: "count",
      sym: "n"
    },
    k: {
      what: "How many of the samples listed below are used for the chart, taken from the first sample in time order.",
      tip: "Use 20 to 25 samples for settled limits; ten gives a first look.",
      effect: "Samples beyond this count are ignored.",
      fig: "count",
      sym: "k"
    },
    d1: {
      what: "The number of defective (nonconforming) items found in sample 1, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 1.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d1"
    },
    d2: {
      what: "The number of defective (nonconforming) items found in sample 2, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 2.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d2"
    },
    d3: {
      what: "The number of defective (nonconforming) items found in sample 3, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 3.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d3"
    },
    d4: {
      what: "The number of defective (nonconforming) items found in sample 4, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 4.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d4"
    },
    d5: {
      what: "The number of defective (nonconforming) items found in sample 5, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 5.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d5"
    },
    d6: {
      what: "The number of defective (nonconforming) items found in sample 6, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 6.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d6"
    },
    d7: {
      what: "The number of defective (nonconforming) items found in sample 7, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 7.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d7"
    },
    d8: {
      what: "The number of defective (nonconforming) items found in sample 8, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 8.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d8"
    },
    d9: {
      what: "The number of defective (nonconforming) items found in sample 9, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 9.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d9"
    },
    d10: {
      what: "The number of defective (nonconforming) items found in sample 10, out of the items inspected in each sample.",
      tip: "Count defective items, not defects: an item with three faults counts once in sample 10.",
      effect: "Raises that sample’s fraction defective and, slightly, the average and the limits.",
      fig: "count",
      sym: "d10"
    }
  },
  "reliability-demonstration-test": {
    M: {
      what: "The mean time between failures the equipment must be shown to achieve, the figure the test is designed to prove.",
      tip: "Use the MTBF in the specification or contract, in running hours, not calendar hours.",
      effect: "The test length rises in proportion to the objective.",
      fig: "time",
      sym: "M"
    },
    conf: {
      what: "The confidence you need that the true MTBF is at least the objective if the test is passed.",
      tip: "Higher confidence needs a longer test; 80 or 90 % is common for acceptance tests.",
      effect: "Raises the test-length factor and so the hours needed.",
      fig: "percent"
    },
    r: {
      what: "The number of failures the test may have and still pass, agreed before the test starts.",
      tip: "Allowing zero gives the shortest test but fails a good design on one random failure.",
      effect: "Each extra failure allowed lengthens the test, by about one more MTBF or more.",
      fig: "count",
      sym: "r"
    },
    units: {
      what: "The number of identical units running on test at the same time, whose running hours add up towards the total.",
      tip: "Units must be the same design and build standard; mixing versions invalidates the result.",
      effect: "More units shorten the calendar time in proportion; the total unit-hours do not change.",
      fig: "count"
    },
    hpd: {
      what: "The hours each unit runs on test per day, which turns unit-hours into calendar days.",
      tip: "Count only the hours the units actually run under test conditions.",
      effect: "More hours per day shorten the calendar time in proportion.",
      fig: "time"
    },
    days: {
      what: "The calendar days available to finish the test, compared with the days the plan needs.",
      tip: "Allow for set-up, interruptions and analysis time outside the running days.",
      effect: "Only moves the pass or fail line; the hours needed do not change.",
      fig: "time"
    }
  },
  "queue-wait-check": {
    lam: {
      what: "The average number of jobs arriving at the shared resource per hour, such as parts for inspection or crane lifts requested.",
      tip: "Count arrivals over a representative period, including busy and quiet hours.",
      effect: "More arrivals raise utilisation, and the wait rises steeply as it nears 100 %.",
      fig: "rate",
      sym: "λ"
    },
    ts: {
      what: "The average time one server spends serving one job, from the start of service to its end.",
      tip: "Measure actual service times, not the planned or standard time.",
      effect: "Longer service raises utilisation and the wait.",
      fig: "time",
      sym: "1/μ"
    },
    c: {
      what: "The number of people, machines or stations serving the queue in parallel, each able to take any job.",
      tip: "Count only servers available at the same time on the shift being studied.",
      effect: "Adding a server cuts the wait sharply when utilisation is high.",
      fig: "count",
      sym: "c"
    },
    target: {
      what: "The longest average wait in the queue you accept before service starts, compared with the calculated wait.",
      tip: "Set it from what the wait costs: idle operators, held-up machines or late orders.",
      effect: "Only moves the pass or fail line and the servers needed.",
      fig: "time"
    }
  },
  "sheet-nesting-yield": {
    SL: {
      what: "The length of the stock sheet the blanks are cut from.",
      tip: "Use the sheet size you can actually buy, such as 2400 × 1200 or 3000 × 1500 mm.",
      effect: "A longer sheet holds more blanks; utilisation changes in steps as whole rows fit.",
      fig: "length",
      sym: "L"
    },
    SW: {
      what: "The width of the stock sheet the blanks are cut from.",
      tip: "Check the width your machine can load; some lasers take only one width.",
      effect: "A wider sheet holds more rows; utilisation changes in steps.",
      fig: "length",
      sym: "W"
    },
    pl: {
      what: "The length of one rectangular blank, or the bounding rectangle of a shaped part.",
      tip: "Use the cut size, not the finished size after bending, and include any trim allowance.",
      effect: "A small change can add or lose a whole row or column of blanks.",
      fig: "length",
      sym: "a"
    },
    pw: {
      what: "The width of one rectangular blank, or the bounding rectangle of a shaped part.",
      tip: "Use the flat blank width before forming.",
      effect: "A small change can add or lose a whole row or column of blanks.",
      fig: "length",
      sym: "b"
    },
    gap: {
      what: "The space left between neighbouring blanks: the cutting kerf plus any web the process or part needs.",
      tip: "Laser kerf is small, but punching and plasma need wider webs; use your process’s minimum.",
      effect: "A larger gap lowers the blanks per sheet.",
      fig: "gap",
      sym: "g"
    },
    edge: {
      what: "The margin left unused along every edge of the sheet for clamping, skeleton strength or poor edge quality.",
      tip: "Include the clamp or pallet zone your machine cannot cut.",
      effect: "A larger margin shrinks the usable sheet and can lose a row of blanks.",
      fig: "length",
      sym: "e"
    },
    qty: {
      what: "The number of blanks the order needs, used to find the sheets to buy and the material cost per blank.",
      tip: "Add an allowance for set-up scrap if the first parts are often rejected.",
      effect: "Sheets needed rise in steps; the cost per blank changes with the spare blanks on the last sheet.",
      fig: "count"
    },
    price: {
      what: "The price of one stock sheet, used for the material cost per blank.",
      tip: "Use the delivered price ex GST for the grade and thickness ordered.",
      effect: "The material cost per blank rises in proportion.",
      fig: "money"
    },
    umin: {
      what: "The lowest share of the sheet area the blanks must cover for the layout to be acceptable.",
      tip: "Set it from your quoting rules; remnants you can reuse may justify a lower figure.",
      effect: "Only moves the pass or fail line.",
      fig: "percent"
    }
  }
});
