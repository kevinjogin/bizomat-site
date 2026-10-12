/** Original KEVOS Books guide metadata. Published chapters are static Astro Markdown pages. */
export const LIBRARY_GUIDES = [
  {
    slug: 'read-the-numbers-understand-the-business',
    title: 'Read the Numbers, Understand the Business',
    subtitle: 'A Practical Introduction to Company Financial Statements',
    description: 'An approachable, practical guide to reading financial statements, interpreting cash flow, assessing business quality, and asking better valuation questions.',
    category: 'Finance & Business',
    minutes: 16,
    publisher: 'KEVOS Books',
    cover: '/library/read-the-numbers-understand-the-business/cover.svg',
    chapters: [
    {
        "number": 1,
        "title": "Begin with the business, not the share price",
        "slug": "begin-with-the-business-not-the-share-price"
    },
    {
        "number": 2,
        "title": "The three statements tell one story",
        "slug": "the-three-statements-tell-one-story"
    },
    {
        "number": 3,
        "title": "Read profitability without being misled",
        "slug": "read-profitability-without-being-misled"
    },
    {
        "number": 4,
        "title": "Follow the cash and the cost of staying competitive",
        "slug": "follow-the-cash-and-the-cost-of-staying-competitive"
    },
    {
        "number": 5,
        "title": "Check the balance sheet for hidden pressure",
        "slug": "check-the-balance-sheet-for-hidden-pressure"
    },
    {
        "number": 6,
        "title": "Measure returns, not just growth",
        "slug": "measure-returns-not-just-growth"
    },
    {
        "number": 7,
        "title": "Connect business quality with the price paid",
        "slug": "connect-business-quality-with-the-price-paid"
    },
    {
        "number": 8,
        "title": "A practical 30-minute company review",
        "slug": "a-practical-30-minute-company-review"
    }
]
  }
] as const;
export const primaryGuide = LIBRARY_GUIDES[0];
export const chapterHref = (slug: string) => `/library/read-the-numbers-understand-the-business/${slug}/`;
