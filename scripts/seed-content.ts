/**
 * Seeds the ContentEmbedding table with UK National Curriculum content.
 * This content is used by the AI tutor via RAG for accurate, curriculum-aligned teaching.
 *
 * Usage: npx tsx scripts/seed-content.ts
 * Requires: OPENAI_API_KEY in .env
 */

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import OpenAI from "openai"

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
})
const openai = new OpenAI()

type ContentChunk = {
  content: string
  source: string
  topic: string
  subject: string
  keyStage: string
  bloomLevel?: number
}

const CURRICULUM_CONTENT: ContentChunk[] = [
  // ── Mathematics: Number & Place Value ──
  {
    content: `Place value tells us the value of each digit depending on its position. In the number 375,000: the 3 is worth 300,000 (hundred thousands), the 7 is worth 70,000 (ten thousands), the 5 is worth 5,000 (thousands). Each place is 10 times bigger than the one to its right. The digit 0 is a placeholder meaning there is nothing in that position. To read 572,049: "five hundred and seventy-two thousand and forty-nine". To compare numbers, look at each digit from the left: compare 456,789 and 465,789 — the hundred-thousands are the same (4), but ten-thousands differ: 5 < 6, so 456,789 < 465,789.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Place Value to 1,000,000",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `Common misconceptions about place value: Children sometimes think that a digit always has the same value regardless of position (e.g., the 3 in 300 and 30 both mean 3). They may struggle with 0 as a placeholder — writing 5,049 as 549. When partitioning, some children forget that 345,678 = 300,000 + 40,000 + 5,000 + 600 + 70 + 8. Teaching tip: use place value charts and arrow cards. Concrete approach: use Dienes blocks to physically build numbers.`,
    source: "UK National Curriculum KS2 Mathematics - Teaching Guidance",
    topic: "Place Value to 1,000,000",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },
  {
    content: `Rounding helps simplify numbers. Rules: look at the digit to the RIGHT of the rounding position. If it is 5 or more, round up. If it is 4 or less, round down. Examples: Round 67 to nearest 10 — ones digit is 7 (>=5), round up to 70. Round 4,562 to nearest 1,000 — hundreds digit is 5 (>=5), round up to 5,000. Round 2,341 to nearest 100 — tens digit is 4 (<5), round down to 2,300. Misconception: children sometimes look at the wrong digit or round to the wrong place. Use number lines to visualise which multiple is closest.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Rounding Numbers",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `Negative numbers are numbers less than zero, written with a minus sign: -1, -2, -3. On a number line, they appear to the left of zero. -3 is less than -1 because it is further from zero. Real-life contexts: temperatures below freezing (-5 degrees C is colder than -2 degrees C), debts (owing money), heights below sea level. Calculations: if the temperature is 3 degrees C and drops by 5 degrees, the new temperature is 3 - 5 = -2 degrees C. Common misconception: children think -7 > -3 because 7 > 3. Use a vertical thermometer to show that lower numbers are colder/smaller.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Negative Numbers",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 1,
  },

  // ── Mathematics: Calculations ──
  {
    content: `Long multiplication is a method for multiplying large numbers. Steps: (1) Multiply by each digit of the bottom number separately. (2) Add a zero placeholder for the tens digit, two zeros for hundreds, etc. (3) Add all partial products together. Example: 234 x 56. Step 1: 234 x 6 = 1,404. Step 2: 234 x 50 = 11,700 (234 x 5 = 1,170, then add a zero). Step 3: 1,404 + 11,700 = 13,104. Quick check: 45 x 12 = 45 x 10 + 45 x 2 = 450 + 90 = 540. Common error: forgetting the zero placeholder when multiplying by the tens digit.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Long Multiplication",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },
  {
    content: `Long division (bus stop method): Divide, multiply, subtract, bring down. Example: 756 / 6. Step 1: 7 / 6 = 1 remainder 1. Step 2: Bring down 5, giving 15. 15 / 6 = 2 remainder 3. Step 3: Bring down 6, giving 36. 36 / 6 = 6 exactly. Answer: 126. Check: 126 x 6 = 756. Remainders: 100 / 7 = 14 remainder 2, because 7 x 14 = 98, and 100 - 98 = 2. Children should check by multiplying quotient x divisor + remainder = dividend.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Long Division",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },
  {
    content: `BODMAS (Order of Operations): Brackets, Orders (powers), Division & Multiplication (left to right), Addition & Subtraction (left to right). Example: 3 + 4 x 2 = 3 + 8 = 11 (NOT 14). With brackets: (3 + 4) x 2 = 7 x 2 = 14. Complex: 20 - 4 x 3 + 1 = 20 - 12 + 1 = 9. Misconception: children often just calculate left to right ignoring order. Teaching tip: make a BODMAS poster, use the mnemonic "Big Old Dogs Make Awful Smells".`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Order of Operations (BODMAS)",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },

  // ── Mathematics: Fractions ──
  {
    content: `Simplifying fractions: Find the highest common factor (HCF) of the numerator and denominator, then divide both by it. Example: 12/18 — HCF of 12 and 18 is 6, so 12/6 = 2, 18/6 = 3, simplified = 2/3. To check if fully simplified, the HCF should be 1. Example: 7/13 — 7 and 13 share no common factors other than 1, so it is already simplified. Misconception: children sometimes divide numerator and denominator by different numbers, or think all fractions can simplify to have numerator 1.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Simplifying Fractions",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },
  {
    content: `Adding and subtracting fractions: Same denominator — just add/subtract numerators: 3/8 + 2/8 = 5/8. Different denominators — find the lowest common denominator (LCD), convert both fractions, then add. Example: 1/3 + 1/4. LCD of 3 and 4 = 12. 1/3 = 4/12, 1/4 = 3/12. 4/12 + 3/12 = 7/12. Subtraction: 3/4 - 1/2. LCD = 4. 1/2 = 2/4. 3/4 - 2/4 = 1/4. Always simplify the answer. Misconception: children add both numerators AND denominators (e.g., 1/3 + 1/4 = 2/7 — WRONG).`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Adding & Subtracting Fractions",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },
  {
    content: `Multiplying fractions: Multiply numerator x numerator, denominator x denominator. Example: 2/3 x 4/5 = 8/15. Simplify if possible: 6/20 = 3/10. With whole numbers: 5 x 1/3 = 5/1 x 1/3 = 5/3 = 1 and 2/3. With mixed numbers: convert to improper fractions first. 1 and 1/2 x 2/3 = 3/2 x 2/3 = 6/6 = 1. Misconception: children sometimes add instead of multiply, or forget to convert mixed numbers.`,
    source: "UK National Curriculum KS2 Mathematics",
    topic: "Multiplying Fractions",
    subject: "Mathematics",
    keyStage: "KS2",
    bloomLevel: 2,
  },

  // ── English: Grammar ──
  {
    content: `Relative clauses give extra information about a noun. They begin with relative pronouns: who (people), which (things/animals), where (places), when (time), whose (possession). Defining relative clause: essential info — "The girl who won the race is my sister." Removing it changes the meaning. Non-defining relative clause: extra info in commas — "My dog, which is a spaniel, loves swimming." The sentence works without it. Misconception: children confuse "which" and "who", or forget commas around non-defining clauses.`,
    source: "UK National Curriculum KS2 English",
    topic: "Relative Clauses",
    subject: "English",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `Modal verbs express possibility, ability, permission, or obligation. They don't change form (no -s, -ed, -ing). Main modal verbs: can (ability: "I can swim"), could (past ability/polite request: "Could you help?"), may/might (possibility: "It might rain"), shall/will (future/offers), should (advice: "You should eat vegetables"), must (strong obligation: "You must wear a seatbelt"), would (hypothetical/polite). Misconception: children use "can" for permission in formal writing instead of "may". "Can I go?" = are you able? "May I go?" = do you have permission?`,
    source: "UK National Curriculum KS2 English",
    topic: "Modal Verbs",
    subject: "English",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `Active voice: the subject performs the action — "The cat chased the mouse." Passive voice: the subject receives the action — "The mouse was chased by the cat." Formation: form of 'to be' + past participle. Examples: "The chef cooked the meal" (active) becomes "The meal was cooked by the chef" (passive). Use passive when the action matters more than who did it: "The Mona Lisa was painted in the 16th century." Children should identify and write in both voices. Misconception: children think passive = past tense. Passive can be any tense: "The cake is being eaten" (present), "The letter was written" (past).`,
    source: "UK National Curriculum KS2 English",
    topic: "Active vs Passive Voice",
    subject: "English",
    keyStage: "KS2",
    bloomLevel: 2,
  },

  // ── Science: Earth & Space ──
  {
    content: `The solar system has 8 planets orbiting the Sun, held by gravity. Order from Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Mnemonic: "My Very Enthusiastic Mother Just Served Us Nachos." Inner planets (Mercury-Mars) are rocky/terrestrial. Outer planets (Jupiter-Neptune) are gas/ice giants. Jupiter is the largest — about 1,300 Earths could fit inside. Mercury is smallest, slightly larger than our Moon. Earth is the only planet with liquid water and known life. Pluto was reclassified as a dwarf planet in 2006.`,
    source: "UK National Curriculum KS2 Science",
    topic: "The Solar System",
    subject: "Science",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `Day and night are caused by Earth's rotation on its axis, not the Sun moving around Earth. One full rotation = approximately 24 hours. Earth rotates from west to east, which is why the Sun appears to rise in the east and set in the west. Different parts of the world have day and night at different times — when it's midday in London, it's night in New Zealand. This leads to time zones. Common misconception: children think the Sun moves around the Earth, or that day/night are caused by the Moon blocking the Sun.`,
    source: "UK National Curriculum KS2 Science",
    topic: "Day and Night",
    subject: "Science",
    keyStage: "KS2",
    bloomLevel: 1,
  },
  {
    content: `The Moon is Earth's natural satellite, orbiting roughly every 27.3 days. It doesn't produce its own light — it reflects sunlight. Moon phases occur over ~29.5 days: new moon (invisible), waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, last quarter, waning crescent, then back to new. The Moon's gravity causes tides on Earth. High tides occur on the side closest to and furthest from the Moon. Spring tides (highest) happen during full and new moons. Neap tides (lowest) happen during quarter moons. Misconception: children think the Moon only appears at night (it's often visible during the day too).`,
    source: "UK National Curriculum KS2 Science",
    topic: "The Moon & Tides",
    subject: "Science",
    keyStage: "KS2",
    bloomLevel: 1,
  },
]

async function embedChunks(chunks: ContentChunk[]) {
  const BATCH_SIZE = 20
  let total = 0

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const texts = batch.map((c) => c.content)

    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`)

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    })

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j]
      const vector = `[${response.data[j].embedding.join(",")}]`

      await prisma.$executeRawUnsafe(
        `INSERT INTO "ContentEmbedding" (id, content, embedding, source, topic, subject, "keyStage", "bloomLevel", "createdAt")
         VALUES (gen_random_uuid(), $1, $2::vector, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT DO NOTHING`,
        chunk.content,
        vector,
        chunk.source,
        chunk.topic,
        chunk.subject,
        chunk.keyStage,
        chunk.bloomLevel ?? 1
      )
      total++
    }
  }

  return total
}

async function main() {
  console.log("=== RAG Content Seeder ===\n")

  const existing = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT count(*) FROM "ContentEmbedding"
  `
  const existingCount = Number(existing[0].count)

  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing embeddings.`)
    console.log("Clearing and re-seeding...\n")
    await prisma.$executeRaw`DELETE FROM "ContentEmbedding"`
  }

  const count = await embedChunks(CURRICULUM_CONTENT)
  console.log(`\nSeeded ${count} content chunks into ContentEmbedding.`)
  console.log("RAG pipeline is now ready for the AI tutor.")
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
