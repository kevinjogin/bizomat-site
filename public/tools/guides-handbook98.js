// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook98).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "general-purpose-acme-limits": {
    "purpose": "Limiting diameters of general purpose Acme screw threads by the ASME/ANSI B1.5 formulas the handbook gives: pitch diameter allowances 0.008 √D (2G), 0.006 √D (3G) and 0.004 √D (4G) at the mean of the nominal size range, pitch diameter tolerances 0.006 √D + 0.030 √P (2G), 0.0028 √D + 0.014 √P (3G) and 0.002 √D + 0.010 √P (4G), the major and minor diameter allowances and tolerances, a 10 % allowance increase for each inch of engagement beyond two diameters, the internal allowance for multi-start threads, the crest and root flats, and the stress and shear areas.",
    "uses": [
      "Set the turning and inspection sizes of an Acme lead screw",
      "Find the limits of a non-standard Acme diameter and pitch",
      "Check the clearances of a multi-start Acme nut"
    ],
    "users": [
      "Machinists",
      "Quality inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Nominal (basic major) diameter of the Acme thread in inches.",
      "n": "Threads per inch; the pitch is 1 ÷ n.",
      "cls": "General purpose class; 2G is preferred, 3G and 4G give less backlash.",
      "starts": "Number of thread starts; the lead is starts × pitch.",
      "LE": "Length of engagement of the screw in the nut."
    },
    "outputs": [
      "Basic pitch and minor diameters, lead and lead angle",
      "Pitch diameter allowance and tolerance",
      "External and internal major, pitch and minor diameter limits",
      "Crest and root flats for the threading tool",
      "Stress area and shear area per inch of engagement"
    ],
    "method": [
      "P = 1 ÷ n; E = D − 0.5P; K = D − P.",
      "Allowance on the external pitch diameter = 0.008, 0.006 or 0.004 × √(mean of the nominal size range) for 2G, 3G or 4G, raised 10 % for each inch or part beyond an engagement of 2D.",
      "Pitch diameter tolerance = (0.006, 0.0028 or 0.002) √D + (0.030, 0.014 or 0.010) √P, with D the next tabulated nominal size at or above the diameter.",
      "External: major max D, min D − 0.05P (at least 0.005); pitch max E − allowance, min max − tolerance; minor max K − 0.020 (10 TPI and coarser) or 0.010, min max − 1.5 × tolerance.",
      "Internal: major min D + 0.020 or 0.010, max min + 0.020 or 0.010; pitch min E (plus 50, 75 or 100 % of the allowance for 2, 3 or 4+ starts), max min + tolerance; minor min K, max K + 0.05P (at least 0.005), using the coarser recommended pitch when P falls between two.",
      "Stress area = π ((d2 min + d1 min) ÷ 4)²; shear area per inch = π D1 max [0.5 + n tan 14.5° (d2 min − D1 max)].",
      "Example: a 1-5 ACME-2G screw has a pitch diameter of 0.892 to 0.87258 in."
    ],
    "limitations": [
      "The tolerances apply to single-start threads; multi-start internal threads take the extra allowance shown, and threads with more than four starts take 100 %.",
      "The pitch diameter allowance uses the mean of the nominal size range as the tables do, so it can differ slightly from 0.008 √D at the actual diameter.",
      "Gauges and inspection of Acme threads follow ASME/ANSI B1.5.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Tolerances on the screw are minus from the maximum sizes; on the nut they are plus from the minimum sizes.",
      "The thread thickness tolerance is 0.259 times the pitch diameter tolerance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1929. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centralizing-acme-limits": {
    "purpose": "Limiting diameters of centralizing Acme screw threads by the ASME/ANSI B1.5 formulas the handbook gives: the pitch diameter allowances and tolerances of the general purpose classes, major diameter tolerances 0.0035 √D, 0.0015 √D or 0.0010 √D on the screw and 0.0035 √D or 0.0020 √D on the nut, the nut major allowance 0.001 √D, the nut minor diameter D − 0.9P, and the check that the nut major tolerance plus allowance plus the screw major tolerance does not exceed the screw pitch diameter allowance, with the minimum clearances and flats.",
    "uses": [
      "Set the sizes of a centralizing Acme screw and nut",
      "Check that a mixed-class screw and nut still centralize",
      "Find limits for a non-standard centralizing Acme size"
    ],
    "users": [
      "Machinists",
      "Quality inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Nominal (basic major) diameter of the Acme thread in inches.",
      "n": "Threads per inch; the pitch is 1 ÷ n.",
      "ce": "Centralizing class of the external thread (screw).",
      "ci": "Centralizing class of the internal thread (nut).",
      "LE": "Length of engagement of the screw in the nut."
    },
    "outputs": [
      "Pitch diameter allowance and the tolerances of the screw and nut",
      "Screw and nut major, pitch and minor diameter limits",
      "Centralizing requirement at the major diameter",
      "Minimum clearances at the major and minor diameters and the flats"
    ],
    "method": [
      "P = 1 ÷ n; allowance on the screw pitch diameter = 0.008, 0.006 or 0.004 × √(range mean) for 2C, 3C or 4C (+10 % per inch of engagement beyond 2D); pitch diameter tolerances as general purpose 2G, 3G, 4G.",
      "Screw: major max D, min D − (0.0035, 0.0015 or 0.0010) √D; pitch max D − P/2 − allowance, min max − tolerance; minor max D − P − 0.020 (10 TPI and coarser) or 0.010, min max − 1.5 × tolerance.",
      "Nut: major min D + 0.001 √D, max min + (0.0035, 0.0035 or 0.0020) √D; pitch min D − P/2, max min + tolerance; minor min D − 0.9P, max min + 0.05P (at least 0.005).",
      "Centralizing: nut major tolerance + nut major allowance + screw major tolerance ≤ screw pitch diameter allowance (all in proportion to √D); the nut class must be the same as or closer than the screw class.",
      "Example: a 1-5 ACME-2C screw has a major diameter of 1 to 0.9965 in."
    ],
    "limitations": [
      "The tolerances are for single-start threads and engagements up to twice the nominal diameter.",
      "Classes 5C and 6C are not recommended for new designs and are not included.",
      "For centralizing at the minor diameter the standard reverses the major and minor diameter allowances and tolerances; this tool gives the major diameter series.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A 2C screw can be used with a 2C, 3C or 4C nut; a 3C screw with a 3C or 4C nut; a 4C screw only with a 4C nut.",
      "The minimum clearance at the major diameter is the nut major allowance; at the minor diameter it is the screw minor allowance plus 0.1P."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1928–1938. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "stub-acme-limits": {
    "purpose": "Limiting diameters of Stub Acme screw threads by the ASME/ANSI B1.8 formulas the handbook gives: basic height 0.3P (standard), 0.375P (Modified Form 1) or 0.25P (Modified Form 2), the pitch diameter allowance and tolerance of the general purpose Class 2G (or 3G or 4G for less backlash), the major and minor diameter allowances of 0.020 or 0.010 in, the screw major tolerance 0.05P and nut minor tolerance 0.05P, and the crest and root flats of the form.",
    "uses": [
      "Set the sizes of a shallow coarse-pitch Stub Acme thread",
      "Compare the standard and modified Stub Acme forms",
      "Grind a threading tool to the Stub Acme flats"
    ],
    "users": [
      "Machinists",
      "Quality inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "D": "Nominal (basic major) diameter of the thread in inches.",
      "n": "Threads per inch; the pitch is 1 ÷ n.",
      "form": "Standard Stub Acme or one of the two modified forms in the standard’s appendix.",
      "cls": "Class whose pitch diameter allowance and tolerance are used; the standard fit is 2G.",
      "LE": "Length of engagement of the screw in the nut."
    },
    "outputs": [
      "Basic height, pitch and minor diameters",
      "Screw and nut major, pitch and minor diameter limits",
      "Crest and root flats of the threading tool",
      "Lead angle at the basic pitch diameter"
    ],
    "method": [
      "h = 0.3P, 0.375P or 0.25P; D2 = D − h; D1 = D − 2h; crest flat of the nut 0.4224P, 0.4030P or 0.4353P.",
      "Allowance and tolerance as general purpose Acme: allowance = (0.008, 0.006, 0.004) √(range mean) (+10 % per inch of engagement beyond 2D), tolerance = (0.006, 0.0028, 0.002) √D + (0.030, 0.014, 0.010) √P.",
      "Screw: major max D, min D − 0.05P; pitch max D2 − allowance, min max − tolerance; minor max D1 − 0.020 (10 TPI and coarser) or 0.010, min max − tolerance.",
      "Nut: major min D + 0.020 or 0.010, max min + tolerance; pitch min D2, max D2 + tolerance; minor min D1, max D1 + 0.05P.",
      "Flats: Fcs = F − 0.259 × allowance; Frn = F − 0.259 × major allowance; Frs = F − 0.259 × (minor allowance − allowance).",
      "Example: the 0.5-10 Stub Acme screw has a pitch diameter of 0.46378 to 0.45005 in."
    ],
    "limitations": [
      "Stub Acme threads use the 2G fit unless less backlash is wanted; the modified forms use the same allowances and tolerances as the standard form.",
      "The tolerances are for single-start threads.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The shallow thread suits coarse pitches on thin walls or where a full Acme depth is not possible.",
      "Form 1 is deeper and Form 2 shallower than the standard Stub Acme."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1921–1929, 1939–1943. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "whitworth-thread-limits": {
    "purpose": "Limits of size of parallel screw threads of Whitworth form by the BS 84 tolerance formulas the handbook gives: T = 0.002 ∛D + 0.003 √L + 0.005 √p; bolt effective diameter tolerances 2/3 T, T and 3/2 T for close, medium and free classes, bolt major tolerances of the same plus 0.01 √p, bolt minor tolerances 2/3 T + 0.013 √p, T + 0.02 √p and 3/2 T + 0.02 √p; nut effective tolerances 2/3 T, T and 3/2 T for close, medium and normal classes and nut minor tolerance 0.2p plus 0.004, 0.005 or 0.007 in, with the basic Whitworth dimensions and the stainless steel adjustment.",
    "uses": [
      "Make replacement bolts and nuts for older British machinery",
      "Inspect Whitworth threads to BS 84 limits",
      "Choose a bolt class for a Whitworth thread"
    ],
    "users": [
      "Maintenance fitters",
      "Machinists",
      "Quality inspectors"
    ],
    "inputs": {
      "D": "Major diameter of the Whitworth thread in inches.",
      "n": "Threads per inch of the thread.",
      "L": "Length of engagement of the bolt in the nut, in inches.",
      "bc": "BS 84 bolt class.",
      "nc": "BS 84 nut class; normal nuts suit medium and free bolts.",
      "ss": "Stainless steel bolts have the BS 84 adjustment applied."
    },
    "outputs": [
      "Basic depth, effective and minor diameters",
      "Tolerance unit T",
      "Bolt major, effective and minor diameter limits",
      "Nut effective and minor diameter limits and the minimum major diameter"
    ],
    "method": [
      "p = 1 ÷ n; h = 0.640327p; effective = D − h; minor = D − 2h; r = 0.137329p.",
      "T = 0.002 ∛D + 0.003 √L + 0.005 √p (inches).",
      "Bolts (minus from basic): effective 2/3 T, T, 3/2 T; major 2/3 T, T, 3/2 T + 0.01 √p; minor 2/3 T + 0.013 √p, T + 0.02 √p, 3/2 T + 0.02 √p for close, medium, free.",
      "Nuts (plus from basic): effective 2/3 T, T, 3/2 T for close, medium, normal; minor 0.2p + 0.004 (26 TPI and finer), + 0.005 (22 and 24 TPI) or + 0.007 (20 TPI and coarser).",
      "Stainless steel bolts above 3/4 in: both limits 0.001 in smaller; at 3/4 in and below, medium or free class rather than close.",
      "Example: the medium class bolt has an effective diameter of 0.44664 to 0.44149 in."
    ],
    "limitations": [
      "The formulas are for parallel threads of Whitworth form (BSW and BSF); pipe threads and BSPT are not covered.",
      "Use the length of engagement of the actual joint; the tolerance grows with it.",
      "The handbook gives the formulas only; check limits for acceptance against BS 84.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Bolt limits are the basic sizes minus the tolerances; nut limits are the basic sizes plus the tolerances.",
      "Close class bolts are for special work where refined accuracy of pitch and form is needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1953–1954. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "unified-miniature-thread-limits": {
    "purpose": "Limits of size of unified miniature screw threads (UNM) by the ANSI B1.10 formulas the handbook gives, in millimetres: basic pitch diameter E = D − 0.64952p and minor diameter K = D − 1.04p, external design minor diameter D − 1.20p and internal design major diameter D + 0.072p, with tolerances 0.12p + 0.006 (external major), 0.08p + 0.008 (pitch, both), 0.16p + 0.008 (external minor), 0.32p + 0.012 (internal minor) and 0.168p + 0.008 (internal major), the lead angle at the basic pitch diameter and the sectional area at D − 1.28p.",
    "uses": [
      "Set the sizes of miniature screws for instruments and watches",
      "Check a miniature tap or die against the design limits",
      "Find the stress area of a miniature screw"
    ],
    "users": [
      "Instrument makers",
      "Precision machinists",
      "Design engineers"
    ],
    "inputs": {
      "D": "Nominal size of the miniature thread, e.g. 1.00 for 1.00 UNM.",
      "p": "Pitch of the thread in millimetres."
    },
    "outputs": [
      "Basic pitch and minor diameters and threads per inch",
      "External major, pitch and minor diameter limits",
      "Internal minor, pitch and major diameter limits",
      "Lead angle and the sectional area at D − 1.28p"
    ],
    "method": [
      "E = D − 0.64952p; K = D − 1.04p; threads per inch = 25.4 ÷ p.",
      "External: major max D, min D − (0.12p + 0.006); pitch max E, min E − (0.08p + 0.008); minor max D − 1.20p, min max − (0.16p + 0.008).",
      "Internal: minor min K, max K + 0.32p + 0.012; pitch min E, max E + 0.08p + 0.008; major min D + 0.072p, max min + 0.168p + 0.008.",
      "Lead angle = tan⁻¹ (p ÷ π E); sectional area = π ÷ 4 × (D − 1.28p)².",
      "Example: the 1 UNM screw has a pitch diameter of 0.83762 to 0.80962 mm."
    ],
    "limitations": [
      "The tolerances are based on lengths of engagement of 2/3 D to 1.5 D.",
      "The internal major maximum and external minor minimum are applied to the threading tools and are not normally gauged on the product.",
      "The standard series runs from 0.30 to 1.40 mm; other sizes use the same formulas at your own risk.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Inch limits in the standard are rounded from the millimetre limits, not converted directly.",
      "The minor diameter of the screw is held 0.16p below the basic minor diameter for root clearance."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1858–1861. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "bearing-static-equivalent-load": {
    "purpose": "Static equivalent loads of ball and roller bearings by the AFBMA formulas the handbook gives: radial bearings Po = Xo Fr + Yo Fa but not less than Fr, with Xo and Yo for radial contact, angular contact (15° to 40°, interpolated), self-aligning ball and self-aligning or tapered roller bearings in single or double row (and duplex pairs); thrust bearings Poa = Fa + 2.3 Fr tan α, with the range of Fr ÷ Fa for which it holds; and the static safety factor Co ÷ Po against the value you require.",
    "uses": [
      "Check a bearing under a heavy load while stationary or turning slowly",
      "Compare single and paired angular contact bearings",
      "Find the static load on a thrust bearing with some radial load"
    ],
    "users": [
      "Machine designers",
      "Maintenance engineers",
      "Reliability engineers"
    ],
    "inputs": {
      "type": "Kind of bearing, which sets the static load factors.",
      "rows": "Single row or a tandem pair (single row factors), or double row or a back-to-back or face-to-face pair (double row factors); give the total loads on a pair.",
      "dir": "Single or double direction thrust bearing; used for thrust bearings only.",
      "alpha": "Nominal contact angle of the bearing.",
      "Fr": "Radial load on the bearing (total for a pair).",
      "Fa": "Axial load on the bearing (total for a pair).",
      "Co": "Basic static load rating of the bearing, from the maker’s catalogue or the static rating formulas.",
      "s0": "Smallest static safety factor Co ÷ Po you accept for the duty."
    },
    "outputs": [
      "Static load factors Xo and Yo",
      "Static equivalent radial or axial load",
      "Static safety factor Co ÷ Po",
      "Validity of the thrust bearing formula"
    ],
    "method": [
      "Radial bearings: Po = Xo Fr + Yo Fa, but not less than Fr.",
      "Radial contact ball: Xo 0.6, Yo 0.5. Angular contact ball, single row: Xo 0.5, Yo 0.47, 0.42, 0.38, 0.33, 0.29, 0.26 at 15°, 20°, 25°, 30°, 35°, 40° (linear between); double row Xo 1 and twice these Yo.",
      "Self-aligning ball and self-aligning or tapered roller: single row Xo 0.5, Yo 0.22 cot α; double row Xo 1, Yo 0.44 cot α. Radial roller with α = 0° under radial load: Po = Fr.",
      "Thrust bearings (α < 90°): Poa = Fa + 2.3 Fr tan α; α = 90°: Poa = Fa. Single direction thrust ball valid for Fr ÷ Fa ≤ 0.44 cot α (satisfactory up to 0.67 cot α); thrust roller less accurate when Fr > 0.44 Fa cot α.",
      "Static safety factor = Co ÷ Po.",
      "Example: the static equivalent load is 2,520 N, giving a static safety factor of 11.905."
    ],
    "limitations": [
      "The permissible Fa ÷ Co of radial ball bearings depends on the groove depth and internal clearance; consult the maker.",
      "Radial roller bearings with α = 0° vary widely in axial capacity; the maker must advise on equivalent load when they carry axial load.",
      "The static load rating is entered by you; the safety factor you need depends on the duty, quietness and shock.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A tandem pair uses single row factors with the total loads; back-to-back and face-to-face pairs use double row factors.",
      "A static safety factor below the required value means permanent deformation of the raceways is likely."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2417–2419. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rail-and-track-wheel-size": {
    "purpose": "Rail and track wheel sizing by the formulas the handbook gives: tread width B = C ÷ (1250 D) and head width A = B + 5/8 in for a wheel load C and wheel diameter D (inches and pounds), the smallest safe wheel diameter D = C ÷ (A K) with the material factor K you enter, and the American Railway Engineering Association allowable load per inch of contact length p = (y.s. − 13,000) ÷ 20,000 × 600 d for steel cylinders up to 25 in diameter rolling on steel plates, worked in SI units with the head width you will use.",
    "uses": [
      "Size the rail head for a trolley or crane wheel",
      "Check that a track wheel is large enough for its load",
      "Find the contact length a steel roller needs on a plate"
    ],
    "users": [
      "Machine designers",
      "Materials handling engineers",
      "Structural designers"
    ],
    "inputs": {
      "C": "Load carried by one wheel.",
      "D": "Diameter of the track wheel.",
      "A": "Width of the head of the rail you intend to use.",
      "K": "Factor for the wheel material from the handbook (given there in lb/in²; 1 lb/in² = 0.006895 N/mm²).",
      "ys": "Yield strength of the steel of the wheel or roller and plate, for the AREA formula."
    },
    "outputs": [
      "Required tread and head widths of the rail",
      "Smallest wheel diameter for the head width used",
      "AREA allowable load per unit length and the contact length needed",
      "Whether the rail and wheel carry the load"
    ],
    "method": [
      "Worked in inches and pounds: B = C ÷ (1250 D); A required = B + 5/8 in.",
      "Smallest safe wheel diameter D = C ÷ (A K), with A the head width you will use.",
      "AREA: p = (y.s. − 13,000) ÷ 20,000 × 600 d lb per inch of length, for d < 25 in and y.s. in lb/in²; contact length needed = C ÷ p.",
      "Results converted to SI (1 lb = 4.44822 N, 1 in = 25.4 mm).",
      "Example: the rail head must be at least 26.034 mm wide and the wheel at least 412.89 mm in diameter."
    ],
    "limitations": [
      "The tread and wheel formulas are empirical rules for cast wheels on rails; K depends on the wheel material and is entered by you.",
      "The AREA formula applies to steel cylinders rolling on steel plates with diameters below 25 in (635 mm).",
      "Check crane wheels and rails to the crane standard you design to as well.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The AREA load corresponds to a contact (Hertz) stress of about 76,000 lb/in² for steel of 32,000 lb/in² yield strength, as the handbook notes.",
      "A wider head lowers the smallest safe wheel diameter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 277–278. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
