// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook88) within the Tools directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "bolt-grip-thread-length",
    "name": "Bolt and Screw Grip Length Check (Grip Gauging Length, Body Length, Full Thread in the Joint)",
    "category": "Fasteners",
    "collection": "MAKEOS",
    "question": "For a bolt or socket head cap screw of a given nominal length, what is its grip gauging length and body (shank) length by the standard rules, will the full thread start inside the parts it clamps so the nut or tapped hole can pull it tight, and does enough thread stand beyond the joint for the nut or the thread engagement I need?",
    "description": "Thread length rules for bolts and screws from the handbook: for metric bolts and screws the maximum grip gauging length Lg = L − B (basic thread length); for socket head cap screws the grip length LG = L − LT, the total thread length LTT = LT + 5P and the body length LB = L − LTT (the same form as Lg max = L − b, Ls min = Lg max − 5P for BS 4168 screws); for heavy hex structural bolts LG max = L − LT and LB min = LG max − Y max, with the bolt threaded full length when LB min is no more than 2.5 thread pitches (sizes to 1 in) or 3.5 pitches (larger). The grip gauging length is the minimum design grip: the clamped thickness should be at least this long so the nut or the tapped hole works on full thread, and the length beyond the joint is checked against the nut height or the engagement you need.",
    "keywords": [
      "MAKEOS",
      "bolt grip length",
      "grip gauging length",
      "body length",
      "thread length",
      "socket head cap screw length",
      "structural bolt length",
      "bolt length selection",
      "thread runout"
    ],
    "fields": [
      {
        "key": "std",
        "label": "Fastener",
        "type": "select",
        "default": "socket",
        "options": [
          [
            "socket",
            "Socket head cap screw (LT, or b for BS 4168 / ISO 4762)"
          ],
          [
            "metric",
            "Metric bolt or screw (basic thread length B)"
          ],
          [
            "structural",
            "Heavy hex structural bolt (LT and Y max)"
          ]
        ]
      },
      {
        "key": "L",
        "label": "Nominal length L",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Lt",
        "label": "Thread length from the standard table (LT, b or B)",
        "type": "number",
        "default": 28,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "P",
        "label": "Thread pitch",
        "type": "number",
        "default": 1.5,
        "unit": "mm",
        "min": 0.000001,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Nominal diameter",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 500,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Y",
        "label": "Maximum transition thread length Y (structural bolts)",
        "type": "number",
        "default": 8.6,
        "unit": "mm",
        "min": 0,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_joint",
        "label": "Joint",
        "type": "heading"
      },
      {
        "key": "fit",
        "label": "Joint type",
        "type": "select",
        "default": "tapped",
        "options": [
          [
            "tapped",
            "Screwed into a tapped hole"
          ],
          [
            "nut",
            "Through bolt with a nut"
          ]
        ]
      },
      {
        "key": "grip",
        "label": "Clamped thickness (grip, including washers)",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "need",
        "label": "Length needed beyond the joint (thread engagement, or nut height plus projection)",
        "type": "number",
        "default": 15,
        "unit": "mm",
        "min": 0.000001,
        "max": 5000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
