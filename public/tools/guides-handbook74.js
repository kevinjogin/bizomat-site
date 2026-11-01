// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook74).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "boring-bar-overhang-check": {
    "purpose": "Check of a solid round boring bar: the cutting force from the specific cutting force, depth of cut and feed, the radial share of it, the tip deflection of the bar as a cantilever (as the boring bar deflection tool) and the diameter error it causes, the overhang ratio against your limit, the first natural frequency of the bar, the longest overhang and the largest feed that keep the diameter error within your allowance, and the same figures for a bar of a stiffer material such as carbide.",
    "uses": [
      "Check whether a boring bar will hold a bore tolerance at a given overhang",
      "Find the longest overhang or the largest feed for a tolerance",
      "Compare a steel bar with a carbide bar of the same size"
    ],
    "users": [
      "Machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the bar shank (a solid round bar; bars with coolant holes are slightly less stiff).",
      "L": "Distance from the face of the clamp or holder to the cutting edge.",
      "E": "Elastic modulus of the bar material (steel about 210 GPa; cemented carbide several times higher, from the bar maker).",
      "rho": "Density of the bar material (steel about 7,850 kg/m³).",
      "kc": "Specific cutting force for the work material at this chip thickness, from the tool maker or a cutting data handbook.",
      "ap": "Radial depth of cut (half the change in diameter).",
      "f": "Feed per revolution.",
      "rr": "Ratio of the radial (passive) force to the main cutting force; it depends on the lead angle and nose radius, often between about 0.2 and 0.6.",
      "allow": "Part of the diameter tolerance you can give to bar deflection.",
      "LDmax": "Largest overhang-to-diameter ratio your practice accepts for this bar material (often about 4 for steel bars; higher for carbide or damped bars).",
      "Ealt": "Elastic modulus of the stiffer alternative bar (cemented carbide is several hundred GPa).",
      "rhoAlt": "Density of the alternative bar material."
    },
    "outputs": [
      "Cutting and radial forces",
      "Bar deflection, diameter error and overhang ratio",
      "First natural frequency",
      "Longest overhang and largest feed for the allowance",
      "The same for the alternative bar material"
    ],
    "method": [
      "Cutting force F_c = k_c × a_p × f; radial force F_r = share × F_c.",
      "Bar stiffness k = 3 E I ÷ L³ with I = π D⁴ ÷ 64; tip deflections F ÷ k (as the boring bar deflection tool); diameter error = 2 × radial deflection.",
      "First natural frequency of a clamped cantilever f₁ = (1.8751² ÷ 2π) √(E I ÷ (ρ A L⁴)).",
      "Longest overhang L_max = (3 E I δ_allow ÷ F_r)^(1/3) with δ_allow = half the diameter allowance; largest feed scales the feed by allowance ÷ error, since the force is proportional to feed.",
      "Alternative material: deflection × E ÷ E_alt; frequency × √((E_alt ÷ ρ_alt) ÷ (E ÷ ρ)); L_max × (E_alt ÷ E)^(1/3).",
      "Example: a 25 mm bar at 100 mm overhang deflects 9.9337 µm radially, a diameter error of 19.867 µm; it could reach 100.22 mm for 20 µm, and 142.21 mm in the alternative material."
    ],
    "limitations": [
      "Static deflection of a solid round bar rigidly clamped; real clamps are less than rigid, so the bar behaves as if somewhat longer.",
      "The natural frequency is for the bar alone; chatter depends on the whole system, the cut and the lead angle, and is not predicted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Deflection rises with the cube of the overhang and falls with the fourth power of the diameter: the largest bar that fits the bore and the shortest overhang that reaches the depth matter more than anything else.",
      "A stiffer bar material reduces deflection in proportion to its modulus but extends the overhang only by the cube root of the ratio."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 197, 302, 762–790. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "slender-work-turning-check": {
    "purpose": "Check of a slender round part turned between centres or held in a chuck only: the cutting and radial forces from the specific cutting force, depth of cut and feed, the deflection of the work at the worst tool position (mid-span between centres, or the free end in a chuck, as the beam deflection tool), the diameter error and the length-to-diameter ratio, the longest unsupported length that holds your allowance, the number of steady rests needed between centres, and the largest feed for the full length.",
    "uses": [
      "Check whether a long shaft can be turned to tolerance without support",
      "Find how many steady rests a shaft needs",
      "Find the feed that keeps the error within the tolerance"
    ],
    "users": [
      "Machinists",
      "Process planners",
      "Manufacturing engineers"
    ],
    "inputs": {
      "hold": "Between centres the worst deflection is at mid-span; in a chuck without tailstock support the worst is at the free end.",
      "d": "Diameter of the work where the tool is cutting (use the smallest diameter along a stepped part for a cautious answer).",
      "L": "Distance between the centres, or from the chuck jaws to the free end.",
      "E": "Elastic modulus of the work material (steel about 210 GPa, aluminium about 70 GPa).",
      "kc": "Specific cutting force for the work material at this chip thickness, from the tool maker or a cutting data handbook.",
      "ap": "Depth of cut (radial).",
      "f": "Feed per revolution.",
      "rr": "Ratio of the radial (passive) force to the main cutting force; it depends on the lead angle and nose radius, often between about 0.2 and 0.6.",
      "allow": "Part of the diameter tolerance you can give to work deflection."
    },
    "outputs": [
      "Cutting and radial forces",
      "Work deflection at the worst position and diameter error",
      "Length-to-diameter ratio",
      "Longest unsupported length, steady rests needed and largest feed"
    ],
    "method": [
      "Cutting force F_c = k_c × a_p × f; radial force F_r = share × F_c.",
      "Deflection at the worst tool position (as the beam deflection tool): between centres δ = F_r L³ ÷ (48 E I) at mid-span; in a chuck δ = F_r L³ ÷ (3 E I) at the free end; I = π d⁴ ÷ 64. Diameter error = 2δ.",
      "Longest unsupported length L_max = (C E I δ_allow ÷ F_r)^(1/3), C = 48 or 3; steady rests between centres = the number that divides the length into spans no longer than L_max.",
      "Largest feed for the full length = feed × allowance ÷ error, since the force is proportional to feed.",
      "Example: a 30 mm part over 400 mm deflects 38.324 µm, a diameter error of 76.649 µm; spans of up to 292.59 mm hold 30 µm, so 1 steady rest(s) are needed."
    ],
    "limitations": [
      "Treats the work as a uniform round beam on rigid supports; centres and chucks are less than rigid, and a hollow or stepped part needs its own section.",
      "Static deflection only: chatter, the part's own weight and heat from cutting are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Between centres the error is largest at mid-length, so the part comes out barrel-shaped; in a chuck the error grows towards the free end, so the part comes out tapered.",
      "Halving the span cuts the deflection to an eighth, which is why one steady rest often solves the problem."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 232–244, 762, 1093–1094. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "reaming-plan": {
    "purpose": "Plan for drilling and reaming holes: the pilot drill size from the finished size and your reaming allowance, the radial stock per side against your range, the drilling and reaming spindle speeds and feed rates (drilling as the drilling cycle planner tool), the feed per reamer tooth, the time per hole including the reamer's retract, the total time for the batch, and the holes per reamer and reamers needed from the reamer's life in metres of hole.",
    "uses": [
      "Plan a drill-and-ream operation for a batch of holes",
      "Check the stock left for the reamer",
      "Estimate cycle time and reamer use"
    ],
    "users": [
      "Machinists",
      "Process planners",
      "CNC programmers"
    ],
    "inputs": {
      "Df": "Finished diameter of the reamed hole.",
      "allow": "Material left on the diameter for the reamer, from the reamer maker or a cutting data handbook for this size and material.",
      "depth": "Depth of the hole.",
      "holes": "Number of holes in the batch.",
      "vcD": "Cutting speed for the pilot drill in this material, from the tool maker or cutting data.",
      "fD": "Feed per revolution for the pilot drill.",
      "point": "Point angle of the drill (118° is common for general-purpose drills).",
      "vcR": "Cutting speed for the reamer, usually well below the drilling speed; from the reamer maker or cutting data.",
      "fR": "Feed per revolution for the reamer, usually higher than the drilling feed.",
      "z": "Number of teeth on the reamer.",
      "retract": "Reamers are often withdrawn at feed to avoid marking the hole; choose rapid if your process allows.",
      "clear": "Extra travel before and after the cut.",
      "pos": "Time to move between holes or change tools, per hole.",
      "lifeM": "Reamed length one reamer gives before regrinding or replacement, from your records or the maker.",
      "sMin": "Least stock per side you allow (too little and the reamer rubs).",
      "sMax": "Most stock per side you allow (too much and the reamer is overloaded).",
      "nMax": "Highest spindle speed of the machine."
    },
    "outputs": [
      "Pilot drill size and radial stock",
      "Drilling and reaming spindle speeds and feed rates",
      "Feed per reamer tooth",
      "Time per hole and for the batch",
      "Holes per reamer and reamers needed"
    ],
    "method": [
      "Pilot drill = finished diameter − allowance; radial stock = allowance ÷ 2.",
      "Spindle speed n = 1000 v_c ÷ (π D); feed rate = n f; feed per tooth = f ÷ z.",
      "Drilling travel = depth + point length D ÷ (2 tan(point ÷ 2)) + clearance (as the drilling cycle planner tool); reaming travel = depth + clearance, doubled if the reamer retracts at feed.",
      "Time per hole = drilling time + reaming time + two positioning moves; holes per reamer = life ÷ depth.",
      "Example: drill 9.75 mm, leaving 0.125 mm a side; 38.952 s a hole, 32.46 min for 50 holes, 1,500 holes per reamer."
    ],
    "limitations": [
      "Speeds, feeds, allowance and reamer life are your inputs; the plan does not choose them.",
      "Hole size, straightness and finish depend on the drill, the reamer, the machine and the alignment; the plan only checks the stock and the times.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Too little stock makes a reamer rub and glaze the hole; too much overloads it and spoils size and finish: the stock window matters as much as the speed.",
      "Retracting the reamer at feed doubles its time in the hole, which often makes reaming the longer of the two operations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 853, 1059, 1084–1092. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dowel-pin-joint-check": {
    "purpose": "Check of dowel pins locating two parts under a lateral load: the shear stress in the pins (as the bolt and pin shear and bearing tool, with equal sharing), the bearing stress on the shorter engagement in the softer part, both against your allowables, the largest and smallest interference from the pin and hole limits you enter, the type of fit that results, and the engagement in each part as a multiple of the pin diameter against your requirement.",
    "uses": [
      "Check dowels that locate a fixture plate or a machine part under side load",
      "Confirm the fit given by a pin and hole tolerance pair",
      "Check that each dowel is engaged deeply enough"
    ],
    "users": [
      "Machine designers",
      "Tool and fixture designers",
      "Mechanical engineers"
    ],
    "inputs": {
      "d": "Nominal diameter of the dowel pins.",
      "n": "Number of pins that share the lateral load (equal sharing assumed).",
      "planes": "Single shear where the pin joins two parts; double shear where it passes through a middle part into parts on both sides.",
      "F": "Sideways load the joint must resist, including any shock allowance.",
      "t1": "Length of pin in the first part.",
      "t2": "Length of pin in the second part.",
      "tauA": "Allowable shear stress for the pin material and duty, from your design standard (hardened dowels are much stronger than mild steel pins).",
      "bA": "Allowable bearing stress for the softer of the two parts, from your design standard.",
      "engReq": "Least engagement in each part that your practice requires, as a multiple of the diameter.",
      "pinUp": "Upper deviation of the pin diameter from nominal, from the pin standard or drawing.",
      "pinLo": "Lower deviation of the pin diameter.",
      "holeUp": "Upper deviation of the hole from nominal, from the fit you specify.",
      "holeLo": "Lower deviation of the hole."
    },
    "outputs": [
      "Shear stress and utilisation",
      "Bearing stress on the shorter engagement",
      "Largest and smallest interference and the fit type",
      "Engagement ratio in each part"
    ],
    "method": [
      "Shear stress τ = F ÷ (n × planes × π d² ÷ 4) (as the bolt and pin shear and bearing tool).",
      "Bearing stress σ = F ÷ (n × d × the shorter engagement).",
      "Largest interference = pin upper − hole lower; smallest = pin lower − hole upper; both positive is an interference fit, both negative a clearance fit, otherwise a transition fit.",
      "Engagement ratio = engagement ÷ d in each part, against the requirement.",
      "Example: 2 pins of 8 mm carry 6000 N at 59.683 MPa shear and 31.25 MPa bearing; the fit runs from -9 to 15 µm interference."
    ],
    "limitations": [
      "Equal load sharing between the pins; in practice hole position errors make one pin take more until the others bear.",
      "No moment on the pin pattern; a load offset from the pattern centre needs the eccentric bolt group tool. Edge distance and the strength of the parts around the holes are not checked.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Dowels locate; bolts clamp. If the joint relies on dowel shear for its main load, check the bolts can keep the faces together as well.",
      "A transition fit can assemble either way, so specify the pin and hole limits that give the fit the assembly needs."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 631–668, 1720–1735, 1747–1748. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "taper-shank-holding-check": {
    "purpose": "Check of a taper-shank tool in its socket while drilling: the spindle speed, cutting power, torque and approximate thrust of the drill (as the drilling cycle planner tool), the normal force the thrust develops on a taper of the given rate, the friction torque the taper can carry from it at the mean engaged diameter, the ratio of that capacity to the drilling torque against your safety factor, and whether the taper angle is small enough to be self-holding for the friction coefficient you enter.",
    "uses": [
      "Check whether a taper-shank drill will slip in its socket",
      "Decide whether a tang or drawbar is needed",
      "Compare a self-holding taper with a steep self-releasing one"
    ],
    "users": [
      "Machinists",
      "Tooling engineers",
      "Manufacturing engineers"
    ],
    "inputs": {
      "D": "Diameter of the drill.",
      "vc": "Cutting speed for this drill and material, from the tool maker or cutting data.",
      "f": "Feed per revolution.",
      "kc": "Specific cutting force for the work material, from the tool maker or a cutting data handbook.",
      "point": "Point angle of the drill.",
      "Dl": "Diameter of the taper at its large end where it engages the socket, from the taper standard or the tool drawing.",
      "c": "Taper rate: change in diameter per unit length (Morse tapers are close to 1 in 20, about 0.05; steep spindle tapers are much larger).",
      "Le": "Length of taper actually in contact with the socket.",
      "mu": "Coefficient of friction between clean, dry steel taper surfaces; oil or dirt lowers it sharply. Use a cautious value.",
      "SF": "Margin you require between the taper's friction torque and the drilling torque."
    },
    "outputs": [
      "Spindle speed, cutting power, drilling torque and thrust",
      "Taper half-angle and mean engaged diameter",
      "Normal force and friction torque capacity of the taper",
      "Capacity ratio and whether the taper is self-holding"
    ],
    "method": [
      "Drilling (as the drilling cycle planner tool): n = 1000 v_c ÷ (π D); P_c = f v_c D k_c ÷ 240,000 kW; torque = P_c × 30,000 ÷ (π n) N·m; thrust ≈ 0.5 k_c (D ÷ 2) f sin(point ÷ 2).",
      "Taper half-angle α = atan(c ÷ 2); mean engaged diameter D_m = D_l − c L_e ÷ 2.",
      "Normal force from the thrust while seating: N = F_a ÷ (sin α + μ cos α); friction torque capacity T = μ N D_m ÷ 2.",
      "Self-holding when tan α < μ: the taper then stays seated without thrust; otherwise it is self-releasing and needs a drawbar.",
      "Example: the drill needs 25 N·m; 2,142.9 N of thrust lets the taper carry 18.971 N·m, a ratio of 0.75883."
    ],
    "limitations": [
      "Friction depends heavily on cleanliness and lubrication; the result is an estimate of the order of the holding torque, not a rating.",
      "Uses the cutting thrust as the only seating force and treats the taper as fully in contact; a worn or damaged socket contacts only in places.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A self-holding taper grips because its angle is small, but the torque it carries still depends on the thrust pushing it in; a large drill at a light feed can spin in its socket, which is what the tang is there to prevent.",
      "Never rely on a tang to drive in normal cutting: a tang that is doing the work shows the taper is dirty, damaged or too lightly seated."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 948–959, 1084–1092. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
