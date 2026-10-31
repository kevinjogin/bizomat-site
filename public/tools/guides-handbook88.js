// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook88).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "bolt-grip-thread-length": {
    "purpose": "Thread length rules for bolts and screws from the handbook: for metric bolts and screws the maximum grip gauging length Lg = L − B (basic thread length); for socket head cap screws the grip length LG = L − LT, the total thread length LTT = LT + 5P and the body length LB = L − LTT (the same form as Lg max = L − b, Ls min = Lg max − 5P for BS 4168 screws); for heavy hex structural bolts LG max = L − LT and LB min = LG max − Y max, with the bolt threaded full length when LB min is no more than 2.5 thread pitches (sizes to 1 in) or 3.5 pitches (larger). The grip gauging length is the minimum design grip: the clamped thickness should be at least this long so the nut or the tapped hole works on full thread, and the length beyond the joint is checked against the nut height or the engagement you need.",
    "uses": [
      "Choose a bolt or screw length for a joint",
      "Check that a screw will not bottom on its thread runout before it clamps",
      "Inspect grip and body lengths of delivered bolts"
    ],
    "users": [
      "Design engineers",
      "Fitters and assemblers",
      "Quality inspectors"
    ],
    "inputs": {
      "std": "The kind of fastener, which sets the thread length rule and the table the thread length comes from.",
      "L": "Nominal length of the bolt or screw: under the head to the end (for countersunk heads, overall).",
      "Lt": "Thread length for the size and length from the standard’s table: LT for socket head cap screws (b in BS 4168 and ISO 4762), B for metric bolts and screws, LT for structural bolts.",
      "P": "Pitch of the thread (coarse series unless the fastener is fine pitch).",
      "d": "Nominal diameter of the fastener; for structural bolts it decides the full-thread rule at 1 in (25.4 mm).",
      "Y": "Maximum transition thread length Y for structural bolts from the standard’s table; not used for the other kinds.",
      "fit": "Whether the fastener screws into a tapped hole or passes through and takes a nut.",
      "grip": "Total thickness of the parts and washers clamped under the head, up to the start of the tapped hole or the nut face.",
      "need": "For a tapped hole, the thread engagement the joint needs; for a nut, the nut height plus the projection you want beyond it."
    },
    "outputs": [
      "Grip gauging length (end of full thread from under the head)",
      "Body or shank length",
      "Total thread length (socket screws)",
      "Full-thread status (structural bolts)",
      "Length beyond the joint against the length needed",
      "Whether full thread starts within the clamped parts"
    ],
    "method": [
      "Metric bolts and screws: Lg max = L − B.",
      "Socket head cap screws: LG = L − LT; LTT = LT + 5P; LB = L − LTT (BS 4168: Lg max = L − b, Ls min = Lg max − 5P).",
      "Structural bolts: LG max = L − LT; LB min = LG max − Y max; threaded full length when LB min ≤ 2.5P (d ≤ 1 in) or 3.5P (d > 1 in).",
      "Joint: the grip gauging length is the minimum design grip, so the clamped thickness should be at least LG for the nut or tapped hole to work on full thread; length beyond the joint L − grip against the length needed.",
      "Example: a 40 mm screw with 28 mm of thread has a grip length of 12 mm and leaves 25 mm beyond a 15 mm joint."
    ],
    "limitations": [
      "Thread lengths LT, b, B and Y are reference dimensions from the fastener standards’ tables; enter them for the size and length.",
      "Screws too short for the tabulated thread length are threaded close to the head; check the standard for the full-thread lengths of short screws.",
      "The check does not cover thread strength or engagement length for the materials (use the thread engagement tools).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the clamped thickness is less than the grip length, the nut or hole meets incomplete thread before the joint is tight: choose a shorter screw or add a washer.",
      "Shear joints that need the plain shank in the shear plane use the body length, not the grip length."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1572–1573, 1593–1594, 1682, 1696. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
