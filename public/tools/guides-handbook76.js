// MAKEOS methods, input sources and limits for the quality, reliability, maintenance, operations and fabrication tools (batch handbook76).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bearing-defect-frequency-check": {
    "purpose": "Characteristic defect frequencies of a rolling element bearing from its geometry and shaft speed: ball pass frequency of the outer race (BPFO) and inner race (BPFI), ball spin frequency (BSF) and fundamental train (cage) frequency (FTF), each in hertz, cycles per minute and orders of shaft speed, with their first three harmonics, compared with a measured spectrum peak within your tolerance to name the likely defect.",
    "uses": [
      "Identify which part of a bearing a vibration peak points to",
      "Set alarm bands for a bearing in a monitoring system",
      "Check whether a peak is a bearing frequency or something else"
    ],
    "users": [
      "Vibration analysts",
      "Reliability and maintenance engineers",
      "Condition monitoring technicians"
    ],
    "inputs": {
      "rpm": "Speed of the shaft carrying the rotating race, from a tachometer or the speed line in the spectrum.",
      "nb": "Number of balls or rollers in one row, from the bearing maker’s data.",
      "d": "Diameter of one ball or roller, from the bearing maker’s data.",
      "D": "Diameter of the circle through the ball centres (about the average of bore and outside diameter).",
      "phi": "Contact angle of the bearing (0° for a deep groove ball bearing under radial load).",
      "fm": "Frequency of the peak you want to identify, from the spectrum or envelope spectrum.",
      "tol": "How close (as a share of the defect frequency) a peak must be to count as a match; allows for slip and speed error."
    },
    "outputs": [
      "BPFO, BPFI, BSF and FTF in Hz, cpm and orders",
      "First three harmonics",
      "Which defect frequency, if any, the measured peak matches"
    ],
    "method": [
      "Shaft frequency f_r = rpm ÷ 60; ratio r = (d ÷ D) cos φ.",
      "BPFO = (n f_r ÷ 2)(1 − r); BPFI = (n f_r ÷ 2)(1 + r); FTF = (f_r ÷ 2)(1 − r); BSF = (D f_r ÷ 2d)(1 − r²) (rolling element bearing kinematics, as given by MathWorks and Randall and Antoni).",
      "The measured peak matches a defect if it lies within the tolerance of any of the first three harmonics of that defect frequency.",
      "Example: BPFO 88.425 Hz, BPFI 133.58 Hz; the 88.3 Hz peak matches a defect frequency."
    ],
    "limitations": [
      "Kinematic frequencies assume no slip; real bearings slip by 1 to 2 %, so measured peaks sit slightly off the calculated values.",
      "A matching frequency suggests, but does not prove, a defect: confirm with the envelope spectrum, sidebands, trend and inspection.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inner race defects usually show sidebands at shaft speed because the defect rotates in and out of the load zone; outer race defects on a stationary race usually do not."
    ],
    "refs": [
      "MathWorks, Rolling Element Bearing Fault Diagnosis (Predictive Maintenance Toolbox documentation) — https://www.mathworks.com/help/predmaint/ug/Rolling-Element-Bearing-Fault-Diagnosis.html",
      "Randall R. B. and Antoni J., Rolling element bearing diagnostics — A tutorial, Mechanical Systems and Signal Processing 25 (2), 485–520 (2011)."
    ]
  },
  "individuals-chart-check": {
    "purpose": "Individuals (X) control chart from up to twelve readings in time order: the mean, the moving ranges between consecutive readings and their average, the process standard deviation estimated from the average moving range, the upper and lower control limits, and which readings fall outside them, so you can see whether the process is in statistical control.",
    "uses": [
      "Chart a characteristic measured once per batch or per shift",
      "Check a run of readings for a special cause",
      "Set control limits for a new process"
    ],
    "users": [
      "Quality engineers and technicians",
      "Process engineers",
      "Production supervisors"
    ],
    "inputs": {
      "k": "How many of the readings below to use, in time order (at least 3).",
      "x1": "Measurement number 1 in the order it was taken.",
      "x2": "Measurement number 2 in the order it was taken.",
      "x3": "Measurement number 3 in the order it was taken.",
      "x4": "Measurement number 4 in the order it was taken.",
      "x5": "Measurement number 5 in the order it was taken.",
      "x6": "Measurement number 6 in the order it was taken.",
      "x7": "Measurement number 7 in the order it was taken.",
      "x8": "Measurement number 8 in the order it was taken.",
      "x9": "Measurement number 9 in the order it was taken.",
      "x10": "Measurement number 10 in the order it was taken.",
      "x11": "Measurement number 11 in the order it was taken.",
      "x12": "Measurement number 12 in the order it was taken."
    },
    "outputs": [
      "Mean and average moving range",
      "Estimated standard deviation",
      "Upper and lower control limits",
      "Readings outside the limits"
    ],
    "method": [
      "Moving range MRᵢ = |xᵢ − xᵢ₋₁| for consecutive readings; MR̄ = average of the moving ranges.",
      "Control limits = x̄ ± 3 MR̄ ÷ 1.128, where 1.128 is d₂ for ranges of two (NIST e-Handbook 6.3.2.2); estimated σ = MR̄ ÷ 1.128.",
      "Any reading above the upper or below the lower limit signals a special cause.",
      "Example: mean 10.015 with limits 9.8965 to 10.133; 0 reading(s) outside."
    ],
    "limitations": [
      "Twelve readings give only rough limits: recalculate them once 20 to 25 readings are available.",
      "Only the beyond-the-limits rule is applied; runs and trends (other detection rules) need the full chart.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Limits describe what the process does, not what the drawing allows: a process can be in control and still make parts out of tolerance."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.3.2.2 Individuals Control Charts — https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc322.htm"
    ]
  },
  "p-chart-check": {
    "purpose": "Proportions (p) control chart from up to ten samples of equal size: the fraction defective in each sample, the average fraction defective, the upper and lower control limits from the binomial standard deviation (lower limit not below zero), which samples fall outside them, and the defectives per sample that would trigger a signal.",
    "uses": [
      "Chart the reject rate of an inspection station",
      "Check whether a bad batch is a special cause or normal variation",
      "Set alarm levels for daily defect counts"
    ],
    "users": [
      "Quality engineers and technicians",
      "Production supervisors",
      "Continuous improvement staff"
    ],
    "inputs": {
      "n": "Number of items inspected in every sample (equal sample sizes).",
      "k": "How many of the samples below to use, in time order.",
      "d1": "Number of defective (nonconforming) items found in sample 1.",
      "d2": "Number of defective (nonconforming) items found in sample 2.",
      "d3": "Number of defective (nonconforming) items found in sample 3.",
      "d4": "Number of defective (nonconforming) items found in sample 4.",
      "d5": "Number of defective (nonconforming) items found in sample 5.",
      "d6": "Number of defective (nonconforming) items found in sample 6.",
      "d7": "Number of defective (nonconforming) items found in sample 7.",
      "d8": "Number of defective (nonconforming) items found in sample 8.",
      "d9": "Number of defective (nonconforming) items found in sample 9.",
      "d10": "Number of defective (nonconforming) items found in sample 10."
    },
    "outputs": [
      "Fraction defective of each sample",
      "Average fraction defective",
      "Upper and lower control limits",
      "Samples outside the limits and the signal threshold"
    ],
    "method": [
      "Fraction defective pᵢ = dᵢ ÷ n; average p̄ = Σ dᵢ ÷ (k n).",
      "Control limits = p̄ ± 3 √(p̄ (1 − p̄) ÷ n) (NIST e-Handbook 6.3.3.2); a negative lower limit is set to zero.",
      "A sample above the upper or below a positive lower limit signals a special cause; signal threshold = the defectives count just above n × UCL.",
      "Example: average 2.5 % defective with an upper limit of 5.8119 %; 0 sample(s) outside."
    ],
    "limitations": [
      "Assumes equal sample sizes and independent items; varying sample sizes need limits for each sample.",
      "Limits from ten samples are rough: recalculate when 20 to 25 samples are available.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With a small average fraction defective, the lower limit is zero, so the chart cannot show an improvement until the sample size is increased."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.3.3.2 Proportions Control Charts — https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc332.htm",
      "NIST Dataplot Reference Manual, P CONTROL CHART (lower limit bounded at zero) — https://www.itl.nist.gov/div898/software/dataplot/refman1/ch2/pcontrol.pdf"
    ]
  },
  "reliability-demonstration-test": {
    "purpose": "Test length to demonstrate a mean time between failures for equipment with a constant failure rate (exponential or HPP model): the chi-square test-length factor for the confidence and the number of failures allowed, the total unit-hours needed, the hours each unit must run and the calendar days at your running hours, against the days available, with the factor for allowing one more and one fewer failure.",
    "uses": [
      "Plan an acceptance run for a new machine or supplier part",
      "Decide how many units to put on test to finish in time",
      "Show a customer what an MTBF claim would take to prove"
    ],
    "users": [
      "Reliability engineers",
      "Quality and test engineers",
      "Engineering managers"
    ],
    "inputs": {
      "M": "MTBF the equipment must be shown to meet, from the specification or contract.",
      "conf": "Confidence required that the true MTBF is at least the objective if the test is passed.",
      "r": "Number of failures the test may have and still pass; more allowed failures need a longer test.",
      "units": "Identical units tested together (their running hours add up).",
      "hpd": "Hours each unit runs per day on test.",
      "days": "Calendar days available for the test."
    },
    "outputs": [
      "Test-length factor",
      "Total unit-hours needed and hours per unit",
      "Calendar days needed",
      "Factor if one more or one fewer failure is allowed"
    ],
    "method": [
      "Test-length factor = ½ χ²(confidence; 2(r + 1)), the chi-square quantile with 2(r + 1) degrees of freedom (NIST e-Handbook 8.3.1.1).",
      "Total unit-hours = MTBF objective × factor; hours per unit = total ÷ units; calendar days = hours per unit ÷ running hours per day.",
      "Pass the test if no more than r failures occur in the total unit-hours.",
      "Example: factor 7.9936; 1,598.7 unit-hours, or 49.96 days with 2 units."
    ],
    "limitations": [
      "Constant failure rate only: early-life failures and wear-out make the exponential model optimistic or pessimistic; burn in first and do not test past wear-out.",
      "Allowing few failures shortens the test but raises the chance that a good design fails it by bad luck.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allowing zero failures gives the shortest test, but a single random failure then fails a good design; one or two allowed failures is often a better balance."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 8.3.1.1 Exponential life distribution (or HPP model) tests — https://www.itl.nist.gov/div898/handbook/apr/section3/apr311.htm"
    ]
  },
  "queue-wait-check": {
    "purpose": "Multi-server queue with random arrivals and service times (M/M/c): utilisation, the probability that an arriving job must wait (Erlang C), the average wait in the queue, the average time in the system and the average queue length (by Little’s law), and the fewest servers that keep the average wait within your target, against that target.",
    "uses": [
      "Decide whether a second inspector or test bench is needed",
      "Show why a resource at 90 % utilisation causes long waits",
      "Size a tool crib, crane or maintenance crew"
    ],
    "users": [
      "Operations and production managers",
      "Industrial engineers",
      "Maintenance planners"
    ],
    "inputs": {
      "lam": "Average number of jobs arriving per hour (count over a representative period).",
      "ts": "Average time one server spends on one job.",
      "c": "Number of people or machines serving the queue in parallel.",
      "target": "Longest average wait in the queue you accept."
    },
    "outputs": [
      "Utilisation",
      "Chance an arriving job waits",
      "Average wait, time in system and queue length",
      "Fewest servers for the target wait"
    ],
    "method": [
      "Service rate μ = 60 ÷ service time per hour; offered load a = λ ÷ μ; utilisation ρ = a ÷ c (must be below 1).",
      "Erlang C probability of waiting P_w = [aᶜ ÷ c! × 1 ÷ (1 − ρ)] ÷ [Σ_{k=0}^{c−1} aᵏ ÷ k! + aᶜ ÷ c! × 1 ÷ (1 − ρ)] (M/M/c queue, Kleinrock).",
      "Average wait W_q = P_w ÷ (c μ − λ); time in system W = W_q + 1 ÷ μ; queue length L_q = λ W_q (Little’s law).",
      "Example: 55.556 % busy; jobs wait 4.4964 min on average; 3 server(s) meet the target."
    ],
    "limitations": [
      "Random (Poisson) arrivals and exponential service times; very regular arrivals or service give shorter waits, and bunched arrivals longer ones.",
      "Steady state only: a queue that builds up during a shift peak behaves worse than the daily average suggests.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Waits grow sharply as utilisation approaches 100 %: going from 80 % to 95 % busy can multiply the wait several times."
    ],
    "refs": [
      "Kleinrock L., Queueing Systems, Volume 1: Theory (Wiley, 1975): the M/M/c queue and the Erlang C formula.",
      "Little J. D. C., A Proof for the Queuing Formula: L = λW, Operations Research 9 (3), 383–387 (1961)."
    ]
  },
  "sheet-nesting-yield": {
    "purpose": "Rectangular nesting of identical blanks on a sheet for laser, plasma, punch or guillotine cutting: usable sheet after the edge margin, blanks per sheet in a straight grid both ways round and in a two-block layout that fills the leftover strip with blanks turned through 90°, the best layout, material utilisation, sheets needed for the order and material cost per part, against the utilisation you require.",
    "uses": [
      "Quote the material for a batch of rectangular blanks",
      "Choose a sheet size that wastes less",
      "Check the yield before ordering sheet"
    ],
    "users": [
      "Fabrication estimators",
      "CNC programmers",
      "Purchasing staff"
    ],
    "inputs": {
      "SL": "Length of the stock sheet.",
      "SW": "Width of the stock sheet.",
      "pl": "Length of one rectangular blank (use the bounding rectangle for other shapes).",
      "pw": "Width of one blank.",
      "gap": "Space between neighbouring blanks: the cutting kerf plus any web the process needs.",
      "edge": "Margin left along every sheet edge (clamping, skeleton or edge quality).",
      "qty": "Number of blanks the order needs.",
      "price": "Price of one sheet, ex GST.",
      "umin": "Lowest share of the sheet area the blanks must use for the layout to be acceptable."
    },
    "outputs": [
      "Blanks per sheet for each layout and the best of them",
      "Material utilisation",
      "Sheets needed and leftover blanks",
      "Material cost per blank"
    ],
    "method": [
      "Usable area = (L − 2e) × (W − 2e); blanks along a side = ⌊(usable + gap) ÷ (blank + gap)⌋.",
      "Layouts: straight grid with the blank lengthways, straight grid turned 90°, and two-block layouts that fill whole rows one way and the leftover strip the other way (best taken over every split), in both directions.",
      "Utilisation = blanks × blank area ÷ sheet area; sheets = ⌈quantity ÷ blanks per sheet⌉; cost per blank = sheets × price ÷ quantity.",
      "Example: 45 blanks per sheet (87.188 % used); 12 sheets at A$4.32 per blank."
    ],
    "limitations": [
      "Rectangular blanks; straight grids and two-block layouts are quick rules, and a full guillotine or true-shape nesting search can sometimes fit a few more blanks (one more in the example).",
      "Ignores grain direction, lead-ins, common-line cutting and remnant reuse, which can change the best layout.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A blank that only just fails to fit one more row or column wastes a whole strip: a small change to the blank or sheet size can raise the yield sharply."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1338–1339. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
