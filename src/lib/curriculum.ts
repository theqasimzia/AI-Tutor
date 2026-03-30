/**
 * LEGACY: This static curriculum data is kept as a reference for the seed script (prisma/seed.ts).
 * The actual curriculum is now stored in the database (Subject > Module > Lesson models).
 * All pages now fetch curriculum data from the database via src/lib/queries/curriculum.ts.
 */
export const curriculum = {
    maths: {
        ks2: [
            {
                id: "m-ks2-1",
                title: "Number & Place Value",
                description: "Understanding numbers up to 10,000,000.",
                lessons: [
                    { id: "l-1", title: "Place Value to 1,000,000" },
                    { id: "l-2", title: "Rounding Numbers" },
                    { id: "l-3", title: "Negative Numbers" }
                ]
            },
            {
                id: "m-ks2-2",
                title: "Calculations",
                description: "Addition, subtraction, multiplication and division.",
                lessons: [
                    { id: "l-4", title: "Long Multiplication" },
                    { id: "l-5", title: "Long Division" },
                    { id: "l-6", title: "Order of Operations (BODMAS)" }
                ]
            },
            {
                id: "m-ks2-3",
                title: "Fractions, Decimals & Percentages",
                description: "Comparing and ordering fractions.",
                lessons: [
                    { id: "l-7", title: "Simplifying Fractions" },
                    { id: "l-8", title: "Adding & Subtracting Fractions" },
                    { id: "l-9", title: "Multiplying Fractions" }
                ]
            }
        ]
    },
    english: {
        ks2: [
            {
                id: "e-ks2-1",
                title: "Grammar & Punctuation",
                description: "Using modal verbs, relative clauses, and parentheses.",
                lessons: [
                    { id: "l-10", title: "Relative Clauses" },
                    { id: "l-11", title: "Modal Verbs" },
                    { id: "l-12", title: "Active vs Passive Voice" }
                ]
            }
        ]
    }
}
