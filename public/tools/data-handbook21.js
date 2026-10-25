// KEVOS® MAKEOS: Machinery’s Handbook topic tools (batch handbook21) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "prismoidal-volume",
    "name": "Prismoidal Formula Volume",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the volume of this prism, pyramid, frustum or earthwork from its end and middle sections?",
    "description": "Volume of any prismoid — prism, pyramid, frustum of a pyramid or cone, and approximately other tapering bodies — from the areas of the two ends and the middle section by the prismoidal formula, with helpers for rectangular and circular ends.",
    "keywords": [
      "MAKEOS",
      "prismoidal formula",
      "frustum volume",
      "tapered volume",
      "earthwork volume",
      "hopper volume",
      "volume from sections"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Sections given as",
        "type": "select",
        "default": "rect",
        "options": [
          [
            "areas",
            "Areas of ends and middle"
          ],
          [
            "rect",
            "Rectangular ends (middle averaged)"
          ],
          [
            "circ",
            "Circular ends (middle diameter averaged)"
          ]
        ]
      },
      {
        "key": "h",
        "label": "Height (distance between ends)",
        "type": "number",
        "default": 500,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A1",
        "label": "Area of end 1",
        "type": "number",
        "default": 250000,
        "unit": "mm²",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Am",
        "label": "Area of the middle section",
        "type": "number",
        "default": 140000,
        "unit": "mm²",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A2",
        "label": "Area of end 2",
        "type": "number",
        "default": 60000,
        "unit": "mm²",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a1",
        "label": "End 1 length (rectangular)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b1",
        "label": "End 1 width (rectangular)",
        "type": "number",
        "default": 400,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a2",
        "label": "End 2 length (rectangular)",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b2",
        "label": "End 2 width (rectangular)",
        "type": "number",
        "default": 200,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D1",
        "label": "End 1 diameter (circular)",
        "type": "number",
        "default": 600,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "D2",
        "label": "End 2 diameter (circular)",
        "type": "number",
        "default": 300,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "pappus-revolution",
    "name": "Surface and Volume of Revolution (Pappus–Guldinus)",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What surface area and volume does a profile sweep out when it is revolved about an axis?",
    "description": "Area of a surface of revolution (profile length × path of its centroid) and volume of a solid of revolution (profile area × path of its centroid) by the Pappus or Guldinus rules, for a torus or any profile with known centroid, over a full or partial revolution.",
    "keywords": [
      "MAKEOS",
      "Pappus",
      "Guldinus",
      "solid of revolution",
      "surface of revolution",
      "torus",
      "O-ring volume",
      "groove volume"
    ],
    "fields": [
      {
        "key": "shape",
        "label": "Profile",
        "type": "select",
        "default": "torus",
        "options": [
          [
            "torus",
            "Circle (torus or O-ring)"
          ],
          [
            "custom",
            "Any profile with known centroid"
          ]
        ]
      },
      {
        "key": "d",
        "label": "Circle diameter (torus)",
        "type": "number",
        "default": 3,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Dp",
        "label": "Diameter of the centroid path (torus)",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "L",
        "label": "Profile line length (custom)",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Profile area (custom)",
        "type": "number",
        "default": 50,
        "unit": "mm²",
        "min": 0,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rL",
        "label": "Radius of the line’s centroid from the axis (custom)",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "rA",
        "label": "Radius of the area’s centroid from the axis (custom)",
        "type": "number",
        "default": 30,
        "unit": "mm",
        "min": 0,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ang",
        "label": "Angle of revolution",
        "type": "number",
        "default": 360,
        "unit": "°",
        "min": 0.000001,
        "max": 360,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "simpson-area",
    "name": "Area of an Irregular Outline by Simpson’s Rule",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What is the area of this irregular outline from measured heights at equal spacing?",
    "description": "Area of a plane figure of irregular outline by Simpson’s rule from up to eleven equally spaced ordinates (heights), with the trapezoidal-rule result for comparison; also gives the volume when the ordinates are cross-section areas.",
    "keywords": [
      "MAKEOS",
      "Simpson’s rule",
      "irregular area",
      "ordinates",
      "numerical integration",
      "cross-section volume",
      "trapezoidal rule"
    ],
    "fields": [
      {
        "key": "W",
        "label": "Strip width (spacing)",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "Ns",
        "label": "Number of strips (even)",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 2,
        "max": 10,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "h_heights_v_v_only_v_to_v_n_are_used_",
        "label": "Heights V₀ … V₁₀ (only V₀ to V_N are used)",
        "type": "heading"
      },
      {
        "key": "V0",
        "label": "V0",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V1",
        "label": "V1",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V2",
        "label": "V2",
        "type": "number",
        "default": 18,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V3",
        "label": "V3",
        "type": "number",
        "default": 21,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V4",
        "label": "V4",
        "type": "number",
        "default": 22,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V5",
        "label": "V5",
        "type": "number",
        "default": 21,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V6",
        "label": "V6",
        "type": "number",
        "default": 18,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V7",
        "label": "V7",
        "type": "number",
        "default": 12,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V8",
        "label": "V8",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V9",
        "label": "V9",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "V10",
        "label": "V10",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "spherical-triangle",
    "name": "Spherical Triangle and Great-Circle Distance",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "What are the angles and area of this spherical triangle, or the great-circle distance between two points?",
    "description": "Oblique spherical triangle solved from its three sides (as arc angles): the three spherical angles by the law of cosines, spherical excess and surface area; or the great-circle distance and initial bearing between two latitude and longitude points on a sphere.",
    "keywords": [
      "MAKEOS",
      "spherical trigonometry",
      "spherical triangle",
      "great circle",
      "spherical excess",
      "navigation distance",
      "dome layout"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "type": "select",
        "default": "sss",
        "options": [
          [
            "sss",
            "Triangle from three sides"
          ],
          [
            "gc",
            "Great circle between two points"
          ]
        ]
      },
      {
        "key": "R",
        "label": "Sphere radius",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "a",
        "label": "Side a (arc angle)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b",
        "label": "Side b (arc angle)",
        "type": "number",
        "default": 90,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "c",
        "label": "Side c (arc angle)",
        "type": "number",
        "default": 120,
        "unit": "°",
        "min": 0.000001,
        "max": 179.999,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lat1",
        "label": "Latitude 1",
        "type": "number",
        "default": -33.87,
        "unit": "°",
        "min": -90,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lon1",
        "label": "Longitude 1",
        "type": "number",
        "default": 151.21,
        "unit": "°",
        "min": -180,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lat2",
        "label": "Latitude 2",
        "type": "number",
        "default": -37.81,
        "unit": "°",
        "min": -90,
        "max": 90,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "lon2",
        "label": "Longitude 2",
        "type": "number",
        "default": 144.96,
        "unit": "°",
        "min": -180,
        "max": 180,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "progression",
    "name": "Arithmetical and Geometrical Progressions",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "What is the last term and the sum of this arithmetical or geometrical progression?",
    "description": "Last term and sum of an arithmetical progression (constant difference) or a geometrical progression (constant ratio) from the first term, the difference or ratio and the number of terms, with the ratio or difference that fits a given first and last term.",
    "keywords": [
      "MAKEOS",
      "arithmetical progression",
      "geometric progression",
      "series sum",
      "step sizes",
      "common ratio",
      "common difference"
    ],
    "fields": [
      {
        "key": "type",
        "label": "Progression",
        "type": "select",
        "default": "geom",
        "options": [
          [
            "arith",
            "Arithmetical (constant difference)"
          ],
          [
            "geom",
            "Geometrical (constant ratio)"
          ]
        ]
      },
      {
        "key": "a",
        "label": "First term",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Common difference (arithmetical)",
        "type": "number",
        "default": 3,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Common ratio (geometrical)",
        "type": "number",
        "default": 1.5,
        "unit": "",
        "min": -1000000,
        "max": 1000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Number of terms",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": 1,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "l",
        "label": "Last term to fit (0 = not used)",
        "type": "number",
        "default": 0,
        "unit": "",
        "min": -1000000000000,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "preferred-numbers",
    "name": "Preferred Number (Renard) Series",
    "category": "Mathematics",
    "collection": "MAKEOS",
    "question": "Which preferred numbers fall between these limits in the chosen Renard series?",
    "description": "Theoretical values of the Renard preferred number series R5, R10, R20, R40 and R80 (the n-th roots of ten) lying between two limits, with the step ratio and the values rounded to three significant figures, for choosing standard sizes, capacities and speeds.",
    "keywords": [
      "MAKEOS",
      "preferred numbers",
      "Renard series",
      "R10 series",
      "standard sizes",
      "size range",
      "ISO 3"
    ],
    "fields": [
      {
        "key": "series",
        "label": "Series",
        "type": "select",
        "default": "10",
        "options": [
          [
            "5",
            "R5 (ratio 1.58)"
          ],
          [
            "10",
            "R10 (ratio 1.26)"
          ],
          [
            "20",
            "R20 (ratio 1.12)"
          ],
          [
            "40",
            "R40 (ratio 1.06)"
          ],
          [
            "80",
            "R80 (ratio 1.03)"
          ]
        ]
      },
      {
        "key": "min",
        "label": "Lowest value",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "max",
        "label": "Highest value",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "line-intersection",
    "name": "Straight Lines: Intersection, Angle and Distance",
    "category": "Geometry",
    "collection": "MAKEOS",
    "question": "Where do these two lines cross, at what angle, and how far is a point from the first line?",
    "description": "Analytical geometry of straight lines each defined by two points: slopes and intercepts, the intersection point, the angle between the lines, and the perpendicular distance and foot of the perpendicular from a point to the first line.",
    "keywords": [
      "MAKEOS",
      "line intersection",
      "slope",
      "analytical geometry",
      "point to line distance",
      "angle between lines",
      "coordinate geometry"
    ],
    "fields": [
      {
        "key": "h_line_1",
        "label": "Line 1",
        "type": "heading"
      },
      {
        "key": "x1",
        "label": "x₁",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y1",
        "label": "y₁",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x2",
        "label": "x₂",
        "type": "number",
        "default": 100,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "y₂",
        "type": "number",
        "default": 50,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_line_2",
        "label": "Line 2",
        "type": "heading"
      },
      {
        "key": "x3",
        "label": "x₃",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "y₃",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "x4",
        "label": "x₄",
        "type": "number",
        "default": 80,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "y₄",
        "type": "number",
        "default": 0,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_point",
        "label": "Point",
        "type": "heading"
      },
      {
        "key": "px",
        "label": "Point x",
        "type": "number",
        "default": 20,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "py",
        "label": "Point y",
        "type": "number",
        "default": 40,
        "unit": "mm",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "drop-hammer-blow",
    "name": "Average Force of a Blow (Drop Hammer or Pile Driver)",
    "category": "Mechanics",
    "collection": "MAKEOS",
    "question": "What average force does this falling weight deliver when it drives the work a given distance?",
    "description": "Average force of a blow from a falling weight — a drop hammer, pile driver or drop-test mass — by equating the work of the fall (including the penetration) with force × penetration, with impact speed, energy and an efficiency for losses.",
    "keywords": [
      "MAKEOS",
      "force of a blow",
      "drop hammer",
      "pile driver",
      "impact force",
      "drop test",
      "forging blow"
    ],
    "fields": [
      {
        "key": "m",
        "label": "Falling mass",
        "type": "number",
        "default": 500,
        "unit": "kg",
        "min": 0.000001,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h",
        "label": "Drop height before contact",
        "type": "number",
        "default": 1.5,
        "unit": "m",
        "min": 0.000001,
        "max": 1000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "d",
        "label": "Penetration or set per blow",
        "type": "number",
        "default": 10,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "eff",
        "label": "Efficiency (share of energy into the work)",
        "type": "number",
        "default": 100,
        "unit": "%",
        "min": 1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "mixture-cost",
    "name": "Mixture Cost and Blending (Alligation)",
    "category": "Materials",
    "collection": "MAKEOS",
    "question": "What does this mixture cost per kilogram, or in what proportions do two ingredients blend to a target value?",
    "description": "Rule of mixtures (alligation): cost or any additive property per unit of a mixture of up to four ingredients by weighted average, and the proportions of two ingredients that blend to a target value (alligation alternate), with the quantities for a batch.",
    "keywords": [
      "MAKEOS",
      "alligation",
      "rule of mixtures",
      "alloy cost",
      "blend ratio",
      "mixture cost",
      "weighted average"
    ],
    "fields": [
      {
        "key": "mode",
        "label": "Calculation",
        "type": "select",
        "default": "cost",
        "options": [
          [
            "cost",
            "Value of a mixture"
          ],
          [
            "blend",
            "Blend two ingredients to a target"
          ]
        ]
      },
      {
        "key": "h_mixture_quantity_0_unused_",
        "label": "Mixture (quantity 0 = unused)",
        "type": "heading"
      },
      {
        "key": "q1",
        "label": "Quantity 1",
        "type": "number",
        "default": 50,
        "unit": "kg",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p1",
        "label": "Value 1 (price per kg or property)",
        "type": "number",
        "default": 1.7,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "q2",
        "label": "Quantity 2",
        "type": "number",
        "default": 10,
        "unit": "kg",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p2",
        "label": "Value 2",
        "type": "number",
        "default": 4.05,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "q3",
        "label": "Quantity 3",
        "type": "number",
        "default": 20,
        "unit": "kg",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p3",
        "label": "Value 3",
        "type": "number",
        "default": 0.99,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "q4",
        "label": "Quantity 4",
        "type": "number",
        "default": 5,
        "unit": "kg",
        "min": 0,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "p4",
        "label": "Value 4",
        "type": "number",
        "default": 1.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_blend",
        "label": "Blend",
        "type": "heading"
      },
      {
        "key": "vA",
        "label": "Value of ingredient A",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vB",
        "label": "Value of ingredient B",
        "type": "number",
        "default": 10,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "vT",
        "label": "Target value",
        "type": "number",
        "default": 5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "batch",
        "label": "Batch size",
        "type": "number",
        "default": 100,
        "unit": "kg",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "column-safe-stress-classic",
    "name": "Steel Column Safe Stress (Classic AISC Formulas)",
    "category": "Strength",
    "collection": "MAKEOS",
    "question": "What safe unit stress and load do the classic AISC column formulas give for this slenderness?",
    "description": "Safe unit stress for steel compression members by the classic AISC working-stress formulas quoted in the handbook — parabolic up to l/r 120, and the secant-type formula above 120 for bracing and secondary members, reduced for main members — with the safe concentric load for a given section area.",
    "keywords": [
      "MAKEOS",
      "column formula",
      "AISC",
      "slenderness ratio",
      "safe stress",
      "steel column",
      "compression member"
    ],
    "fields": [
      {
        "key": "L",
        "label": "Effective length",
        "type": "number",
        "default": 2500,
        "unit": "mm",
        "min": 0.000001,
        "max": 100000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Least radius of gyration",
        "type": "number",
        "default": 25,
        "unit": "mm",
        "min": 0.000001,
        "max": 10000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "A",
        "label": "Cross-section area",
        "type": "number",
        "default": 1500,
        "unit": "mm²",
        "min": 0.000001,
        "max": 100000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "member",
        "label": "Member type",
        "type": "select",
        "default": "main",
        "options": [
          [
            "main",
            "Main member"
          ],
          [
            "secondary",
            "Bracing or secondary member"
          ]
        ]
      },
      {
        "key": "P",
        "label": "Applied concentric load",
        "type": "number",
        "default": 100,
        "unit": "kN",
        "min": 0,
        "max": 10000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
