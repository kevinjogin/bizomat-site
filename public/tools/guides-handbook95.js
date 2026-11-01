// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook95).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "ball-bearing-load-ratings": {
    "purpose": "Basic load ratings of radial, angular contact and thrust ball bearings by the AFBMA formulas the handbook gives: C = fc (i cos α)^0.7 Z^(2/3) D^1.8 for balls up to 25.4 mm, or 3.647 fc (i cos α)^0.7 Z^(2/3) D^1.4 for larger balls; thrust bearings Ca = fc Z^(2/3) D^1.8 at 90° or fc (cos α)^0.7 Z^(2/3) D^1.8 tan α otherwise; rows or bearings in tandem by the 0.7 power; the static ratings Co = fo i Z D² cos α and Coa = fo Z D² sin α; then the rating life L10 = (C ÷ P)³ in millions of revolutions and hours, and the static safety Co ÷ Po. The factors fc and fo are read from the handbook tables for D cos α ÷ dm, which the tool shows.",
    "uses": [
      "Estimate the load rating of a special or non-catalogue ball bearing from its geometry",
      "Check how ball size, number and contact angle change the rating",
      "Find the L10 life and static safety of a bearing at the design loads"
    ],
    "users": [
      "Machine designers",
      "Maintenance and reliability engineers",
      "Bearing application engineers"
    ],
    "inputs": {
      "type": "Radial and angular contact bearings, or thrust bearings.",
      "i": "Number of rows of balls (for a thrust bearing, rows carrying load in the same direction).",
      "alpha": "Nominal contact angle: 0° for a deep groove bearing, 90° for a pure thrust bearing.",
      "Z": "Number of balls in each row.",
      "D": "Diameter of the balls.",
      "dm": "Pitch diameter of the ball set, used only to read fc and fo from the tables.",
      "fc": "Dynamic rating factor read from the handbook table for the bearing type and D cos α ÷ dm (metric column).",
      "fo": "Static rating factor read from the handbook table for the bearing type and D cos α ÷ dm (metric column).",
      "nb": "Number of similar single-row radial or angular contact bearings mounted in tandem and sharing the load.",
      "P": "Equivalent dynamic load, X Fr + Y Fa, from the bearing life tools.",
      "n": "Rotational speed of the bearing.",
      "Lreq": "Rating life the application needs.",
      "Po": "Static equivalent load, the greater of Xo Fr + Yo Fa and Fr.",
      "s0Min": "Least static safety factor you accept."
    },
    "outputs": [
      "D cos α ÷ dm for reading fc and fo",
      "Basic dynamic load rating C or Ca",
      "Basic static load rating Co or Coa",
      "Rating life L10 in millions of revolutions and hours",
      "Static safety Co ÷ Po"
    ],
    "method": [
      "Radial and angular contact, D ≤ 25.4 mm: C = fc (i cos α)^0.7 Z^(2/3) D^1.8; D > 25.4 mm: C = 3.647 fc (i cos α)^0.7 Z^(2/3) D^1.4; tandem bearings × n^0.7.",
      "Thrust, D ≤ 25.4 mm: Ca = fc Z^(2/3) D^1.8 (α = 90°) or fc (cos α)^0.7 Z^(2/3) D^1.8 tan α; D^1.4 with 3.647 for larger balls; i similar rows × i^0.7 (formula 10 with equal rows).",
      "Static: Co = fo i Z D² cos α (× number in tandem); thrust Coa = fo i Z D² sin α.",
      "L10 = (C ÷ P)³ million revolutions; hours = L10 × 10⁶ ÷ (60 n); static safety = Co ÷ Po.",
      "Example: the bearing’s dynamic rating is 25,144 N, giving 22,079 h at 2000 N and 1500 rpm."
    ],
    "limitations": [
      "The formulas apply to bearings of good quality, hardened steel and the groove radii the standard assumes; fc and fo come from the handbook tables.",
      "The rating life is for 90 % reliability; adjust it for reliability, material and lubrication with the bearing life tools.",
      "Catalogue ratings from the bearing maker take precedence over these estimates.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Ball size has the strongest effect: the rating rises with D^1.8 and the static rating with D².",
      "A long life at the equivalent load does not prove a bearing is suitable; check speed, lubrication and fits as well."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2405–2409, 2415–2418. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "roller-bearing-load-ratings": {
    "purpose": "Basic load ratings of radial and thrust roller bearings (cylindrical, tapered, spherical and needle) by the AFBMA formulas the handbook gives: radial C = fc (i leff cos α)^(7/9) Z^(3/4) D^(29/27), with bearings in tandem by the 7/9 power; thrust Ca = fc leff^(7/9) Z^(3/4) D^(29/27) at 90° or fc (leff cos α)^(7/9) Z^(3/4) D^(29/27) tan α otherwise, with equal rows by formula (18); static ratings Co = 44 (1 − D cos α ÷ dm) i Z leff D cos α and Coa = 220 (1 − D cos α ÷ dm) Z leff D sin α; then L10 = (C ÷ P)^(10/3) in millions of revolutions and hours, the static safety and the handbook’s warnings for long rollers and heavy loads. The factor fc is read from the handbook table for D cos α ÷ dm, which the tool shows.",
    "uses": [
      "Estimate the load rating of a special roller bearing or roller path from its geometry",
      "Compare roller lengths, numbers and diameters for a rating",
      "Find the L10 life and static safety at the design loads"
    ],
    "users": [
      "Machine designers",
      "Maintenance and reliability engineers",
      "Bearing application engineers"
    ],
    "inputs": {
      "type": "Radial roller bearings, or thrust roller bearings.",
      "i": "Number of rows of rollers (for a thrust bearing, rows carrying load in the same direction).",
      "alpha": "Nominal contact angle: 0° for a cylindrical roller bearing, 90° for a pure thrust bearing.",
      "Z": "Number of rollers in each row.",
      "D": "Roller diameter: the mean diameter of a tapered roller, the major diameter of a spherical roller.",
      "leff": "Effective length of contact: roller length less chamfers or grinding undercuts where contact is shortest.",
      "dm": "Pitch diameter of the roller set, used for the static rating and for reading fc.",
      "fc": "Dynamic rating factor read from the handbook table for the bearing type and D cos α ÷ dm (metric column).",
      "nb": "Number of similar single-row bearings mounted in tandem and sharing the load.",
      "P": "Equivalent dynamic load, X Fr + Y Fa, from the bearing life tools.",
      "n": "Rotational speed of the bearing.",
      "Lreq": "Rating life the application needs.",
      "Po": "Static equivalent load on the bearing.",
      "s0Min": "Least static safety factor you accept."
    },
    "outputs": [
      "D cos α ÷ dm for reading fc",
      "Basic dynamic load rating C or Ca",
      "Basic static load rating Co or Coa",
      "Rating life L10 in millions of revolutions and hours",
      "Static safety Co ÷ Po",
      "Checks for long rollers and heavy loads"
    ],
    "method": [
      "Radial: C = fc (i leff cos α)^(7/9) Z^(3/4) D^(29/27); tandem bearings × n^(7/9).",
      "Thrust: Ca = fc leff^(7/9) Z^(3/4) D^(29/27) (α = 90°) or fc (leff cos α)^(7/9) Z^(3/4) D^(29/27) tan α; i equal rows or bearings in tandem × (i n)^(7/9) by formula (18).",
      "Static: Co = 44 (1 − D cos α ÷ dm) i Z leff D cos α; Coa = 220 (1 − D cos α ÷ dm) Z leff D sin α; × number of rows or bearings in tandem.",
      "L10 = (C ÷ P)^(10/3) million revolutions; hours = L10 × 10⁶ ÷ (60 n); static safety = Co ÷ Po.",
      "Example: the bearing’s dynamic rating is 45,128 N, giving 9,262.9 h at 6000 N and 1500 rpm."
    ],
    "limitations": [
      "Rollers longer than 2.5 D need a lower fc, which the bearing maker sets.",
      "Above a load of C/4 to C/2 the 10/3 exponent may not hold; consult the bearing maker.",
      "The rating life is for 90 % reliability; adjust it with the bearing life tools. Catalogue ratings take precedence over these estimates.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Roller length and number raise the rating less than in proportion (powers 7/9 and 3/4).",
      "Rollers running directly on a shaft or housing need a surface equal to a raceway to reach the rating."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2409–2413, 2416–2417. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "disc-spring-fatigue-life": {
    "purpose": "Disc springs without contact surfaces (Groups 1 and 2, thickness up to 6 mm) by the handbook method: the cone angle tan θ = 2h ÷ (D − d), the corrected outside diameter Da = D − 2t (sin θ + cos θ ÷ 6) for the contact circle, the constants K1, K2 and K3 from δ = D ÷ d, the force F = 4 E s [(h − s ÷ 2)(h − s) t + t³] ÷ [(1 − μ²) K1 Da²] at the minimum and maximum deflection, the compressive stresses at points 0 and 1 and the tensile stresses at points 2 and 3, the critical point by the larger of σmax − 0.5 σmin, the fatigue life N = 10^(a − b (σmax − 0.5 σmin)) for the group, the stress range allowed for the life you need, and the recommended ratios D ÷ d = 1.7 to 2.5, h ÷ t = 0.4 to 1.3 and D ÷ t = 18 to 40.",
    "uses": [
      "Check a dynamically loaded disc spring stack for fatigue life",
      "Find the forces at the preload and working deflections",
      "Choose a disc spring whose stress range gives the life you need"
    ],
    "users": [
      "Machine designers",
      "Toolmakers",
      "Spring and fixture designers"
    ],
    "inputs": {
      "D": "Nominal outside diameter of the disc spring.",
      "d": "Inside diameter of the disc spring.",
      "t": "Thickness of the disc; this tool covers springs without contact surfaces up to 6 mm thick.",
      "h": "Cone (dish) height of the unloaded spring, the free height less the thickness.",
      "E": "Modulus of elasticity of the spring steel.",
      "nu": "Poisson’s ratio of the spring steel.",
      "smin": "Deflection of one disc at the minimum load, including the preload.",
      "smax": "Deflection of one disc at the maximum load.",
      "ns": "Number of discs stacked in series (alternate directions).",
      "Nreq": "Number of load cycles the stack must survive.",
      "s0Max": "Largest compressive stress at point 0 you accept; the handbook gives 1600 N/mm² for most spring steels.",
      "sTMax": "Largest tensile stress at points 2 and 3 you accept; the handbook gives 1300, 1250 and 1200 N/mm² for Groups 1, 2 and 3."
    },
    "outputs": [
      "Corrected outside diameter Da and constants K1, K2, K3",
      "Forces at the minimum and maximum deflection",
      "Stresses at points 0, 1, 2 and 3",
      "Critical point and fatigue life",
      "Stress range allowed for the life you need",
      "Dimension ratio checks and stack lengths"
    ],
    "method": [
      "θ = atan (2h ÷ (D − d)); Da = D − 2t (sin θ + cos θ ÷ 6).",
      "δ = D ÷ d; K1 = (1 ÷ π)((δ − 1) ÷ δ)² ÷ ((δ + 1) ÷ (δ − 1) − 2 ÷ ln δ); K2 = (6 ÷ π)((δ − 1) ÷ ln δ − 1) ÷ ln δ; K3 = (3 ÷ π)(δ − 1) ÷ ln δ.",
      "k = 4E ÷ ((1 − μ²) K1 Da²); F = k s [(h − s ÷ 2)(h − s) t + t³].",
      "σ0 = −(3 ÷ π) k t s; σ1 = −k s [K2 (h − s ÷ 2) + K3 t]; σ2 = k s [K3 t − K2 (h − s ÷ 2)]; σ3 = k s [(2K3 − K2)(h − s ÷ 2) + K3 t] ÷ δ.",
      "Critical point: the larger of σ2max − 0.5 σ2min and σ3max − 0.5 σ3min.",
      "Group 1 (t < 1.25 mm): N = 10^(10.29085532 − 0.00542096 r); Group 2: N = 10^(10.10734911 − 0.00537616 r); r allowed = (a − log N) ÷ b.",
      "Example: the critical stress range of 741.07 MPa gives a fatigue life of 1,328,100 cycles."
    ],
    "limitations": [
      "Disc springs with contact surfaces (all of Group 3 and some of Group 2) need the reduced-thickness method and are not covered.",
      "The fatigue equations cover limited lives from 10⁴ to 2 × 10⁶ cycles; at 2 × 10⁶ cycles or more the life is taken as unlimited.",
      "Friction between discs and on the guide is ignored; guide the stack on a hardened rod or in a sleeve.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The critical point for fatigue is on the bottom surface, at the inside (point 2) or outside (point 3) edge.",
      "With h ÷ t above 1.3 the discs in a series stack may deflect unequally; use a single disc where possible."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 354–364. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thread-wire-involute-helicoid": {
    "purpose": "Measurement over wires by the Buckingham exact involute helicoid formula the handbook gives for threads and worms where the lead angle matters: lead L = P S, tan B = L ÷ π E, the normal or axial half-angle (tan An = tan A cos B), tan F = tan An ÷ sin B, Rb = (E ÷ 2) cos F, Ta = T ÷ tan B, tan Hb = cos F tan H, inv G = Ta ÷ E + inv F + W ÷ (2 Rb cos Hb) − π ÷ S and M = 2 Rb ÷ cos G + W for any wire that touches the flanks; compared with the simplified formula M = E + W (1 + sin An) with its own wire W = T cos B ÷ cos An, and the pitch diameter worked back from a measured reading.",
    "uses": [
      "Find the reading over wires for a worm or multi-start thread with a large lead angle",
      "Decide whether the simplified Buckingham formula is accurate enough",
      "Work out the pitch diameter from a reading over wires"
    ],
    "users": [
      "Inspectors and metrologists",
      "Machinists",
      "Gauge makers"
    ],
    "inputs": {
      "E": "Pitch diameter (basic, maximum or minimum) for which the reading is wanted.",
      "P": "Axial pitch of the thread, from one thread to the next.",
      "S": "Number of starts (threads) on the screw or worm; the lead is the pitch times the starts.",
      "plane": "Whether the half-angle you enter is in the normal plane (the half-angle of a milling cutter) or in the axial plane.",
      "ang": "Half the included thread angle: 14.5° for Acme, 30° for 60° threads, 20° for a 40° worm.",
      "wire": "Use the wire diameter you enter, or the wire the simplified formula requires.",
      "W": "Diameter of the wires or pins, measured precisely.",
      "Mmeas": "Your measured reading over the wires, to work back to the pitch diameter; 0 to skip.",
      "tol": "How close the reading must be; decides whether the simplified formula is good enough."
    },
    "outputs": [
      "Lead angle and normal and axial half-angles",
      "Wire size of the simplified formula",
      "Measurement M by the exact involute helicoid formula",
      "Measurement by the simplified formula and the difference",
      "Pitch diameter from your reading"
    ],
    "method": [
      "L = P S; tan B = L ÷ π E; T = P ÷ 2; tan An = tan A cos B (or tan A = tan An ÷ cos B).",
      "Simplified (3): W = T cos B ÷ cos An; M = E + W (1 + sin An).",
      "Exact (4): tan F = tan An ÷ sin B; Rb = (E ÷ 2) cos F; Ta = T ÷ tan B; H = 90° − B; tan Hb = cos F tan H.",
      "inv G = Ta ÷ E + inv F + W ÷ (2 Rb cos Hb) − π ÷ S; M = 2 Rb ÷ cos G + W.",
      "From a reading: the pitch diameter E for which formula (4) gives the measured M, found by successive trial.",
      "Example: the exact reading over 1.7813 mm wires is 18.252 mm; the simplified formula gives 18.266 mm."
    ],
    "limitations": [
      "The formula is exact for involute helicoid threads and a very close approximation for milled threads of intermediate profile.",
      "The wire must touch both flanks; very small or large wires may touch the crest or root instead.",
      "Contact pressure, wire accuracy and wire wear all affect the reading; measure the wires precisely.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For single-start threads with small lead angles the simplified formula is close; for worms and multi-start threads the difference grows with the lead angle.",
      "Under some conditions a wire may touch one flank at two points; balls of the same diameter can be used instead."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1997–2001. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
