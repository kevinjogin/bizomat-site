// KEVOS® Tools input guides: handbook88. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook88.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "bolt-grip-thread-length": {
    std: {
      what: "Kind of fastener, which sets the thread length rule and the table the thread length comes from.",
      tip: "Socket head cap screws use LT (b in BS 4168 and ISO 4762); other metric bolts use B; structural bolts use LT and Y.",
      effect: "Changes the body length rule and the full-thread check.",
      fig: "choice",
      sym: "std"
    },
    L: {
      what: "Nominal length of the bolt or screw, from under the head to the end of the shank.",
      tip: "Countersunk screws are measured overall, including the head.",
      effect: "A longer fastener moves the grip length and the end further out.",
      fig: "length",
      sym: "L"
    },
    Lt: {
      what: "Thread length for this size and length from the fastener standard’s table.",
      tip: "It often steps up for lengths over 125 mm and 200 mm; read the right column.",
      effect: "More thread shortens the grip length and the body.",
      fig: "length",
      sym: "L_T"
    },
    P: {
      what: "Pitch of the thread, the distance from one thread crest to the next.",
      tip: "Coarse pitch unless the fastener is ordered fine pitch; M10 coarse is 1.5 mm.",
      effect: "Sets the thread runout of 5P on socket screws and the full-thread limit.",
      fig: "pitch",
      sym: "P"
    },
    d: {
      what: "Nominal diameter of the bolt or screw thread.",
      tip: "For structural bolts it decides whether the full-thread limit is 2.5 or 3.5 pitches.",
      effect: "Only changes the structural bolt full-thread limit.",
      fig: "diameter",
      sym: "d"
    },
    Y: {
      what: "Maximum transition thread length for structural bolts, from the standard’s table.",
      tip: "Not used for socket screws or other metric bolts.",
      effect: "A longer transition shortens the minimum body length.",
      fig: "length",
      sym: "Y"
    },
    fit: {
      what: "Whether the fastener screws into a tapped hole or passes through and takes a nut.",
      tip: "Choose a nut for through bolts even when a lock nut is used.",
      effect: "Changes the wording of the length check beyond the joint.",
      fig: "choice",
      sym: "fit"
    },
    grip: {
      what: "Total thickness of the parts and washers clamped under the head.",
      tip: "Measure to the start of the tapped thread, or to the nut face for a through bolt.",
      effect: "Must be at least the grip length for the full thread to start within the joint.",
      fig: "thickness",
      sym: "g"
    },
    need: {
      what: "Length needed beyond the clamped parts: thread engagement for a tapped hole, or nut height plus projection.",
      tip: "About 1 to 1.5 diameters of engagement in steel and more in aluminium; a nut needs its height plus two threads.",
      effect: "Fails the length when less is left beyond the joint.",
      fig: "length",
      sym: "L_e"
    }
  }
});
