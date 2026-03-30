type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

type LessonContent = {
  introduction: string
  keyPoints: string[]
  examples: { title: string; content: string }[]
  quiz: QuizQuestion[]
}

const contentByTitle: Record<string, LessonContent> = {
  "Place Value to 1,000,000": {
    introduction:
      "Place value tells us the value of each digit in a number depending on its position. In this lesson, we'll explore numbers up to 1,000,000 and understand what each digit represents.",
    keyPoints: [
      "Each place is 10 times bigger than the one to its right.",
      "Millions, Hundred Thousands, Ten Thousands, Thousands, Hundreds, Tens, Ones.",
      "The digit 0 is a placeholder — it means there is nothing in that position.",
      "We can partition (break down) numbers to understand them better. For example: 345,678 = 300,000 + 40,000 + 5,000 + 600 + 70 + 8",
    ],
    examples: [
      { title: "Reading large numbers", content: "The number 572,049 is read as 'five hundred and seventy-two thousand and forty-nine'. The 5 is worth 500,000 and the 7 is worth 70,000." },
      { title: "Comparing numbers", content: "To compare 456,789 and 465,789, look at each digit from the left. The hundred-thousands are the same (4). The ten-thousands differ: 5 < 6, so 456,789 < 465,789." },
    ],
    quiz: [
      { question: "What is the value of the digit 7 in 375,000?", options: ["7,000", "70,000", "700", "700,000"], correctIndex: 1, explanation: "The 7 is in the ten-thousands place, so it represents 70,000." },
      { question: "How do you write 'six hundred and twenty-three thousand, four hundred and fifty-one' in digits?", options: ["623,451", "632,451", "623,541", "62,3451"], correctIndex: 0, explanation: "Six hundred and twenty-three thousand = 623,000 plus four hundred and fifty-one = 451." },
      { question: "Which number is greater: 489,999 or 490,001?", options: ["489,999", "490,001", "They are equal", "Cannot compare"], correctIndex: 1, explanation: "490,001 > 489,999 because the hundred-thousands digit 4 is the same, but ten-thousands: 9 > 8." },
    ],
  },
  "Rounding Numbers": {
    introduction:
      "Rounding helps us simplify numbers to make them easier to work with. We round to the nearest 10, 100, 1,000, or more depending on how precise we need to be.",
    keyPoints: [
      "Look at the digit to the right of the rounding position.",
      "If that digit is 5 or more, round up. If it's 4 or less, round down.",
      "Rounding to the nearest 10: look at the ones digit.",
      "Rounding to the nearest 100: look at the tens digit.",
    ],
    examples: [
      { title: "Rounding to nearest 10", content: "Round 67 to the nearest 10. The ones digit is 7 (≥ 5), so we round up to 70." },
      { title: "Rounding to nearest 1,000", content: "Round 4,562 to the nearest 1,000. The hundreds digit is 5 (≥ 5), so we round up to 5,000." },
    ],
    quiz: [
      { question: "What is 345 rounded to the nearest 10?", options: ["340", "350", "300", "400"], correctIndex: 1, explanation: "The ones digit is 5, so we round up to 350." },
      { question: "What is 7,849 rounded to the nearest 1,000?", options: ["7,000", "8,000", "7,900", "7,800"], correctIndex: 1, explanation: "The hundreds digit is 8 (≥ 5), so we round up to 8,000." },
      { question: "What is 2,341 rounded to the nearest 100?", options: ["2,300", "2,400", "2,340", "2,000"], correctIndex: 0, explanation: "The tens digit is 4 (< 5), so we round down to 2,300." },
    ],
  },
  "Negative Numbers": {
    introduction:
      "Negative numbers are numbers less than zero. We use them in real life for temperatures below freezing, debts, and heights below sea level.",
    keyPoints: [
      "Negative numbers are written with a minus sign: −1, −2, −3, …",
      "On a number line, negative numbers are to the left of zero.",
      "−3 is less than −1 because it's further from zero.",
      "The temperature −5°C is colder than −2°C.",
    ],
    examples: [
      { title: "Number line", content: "On a number line: … −3, −2, −1, 0, 1, 2, 3 … Numbers get smaller as you move left." },
      { title: "Real-life context", content: "If the temperature is 3°C and drops by 5 degrees, the new temperature is 3 − 5 = −2°C." },
    ],
    quiz: [
      { question: "Which number is smaller: −7 or −3?", options: ["−3", "−7", "They are equal", "Cannot compare"], correctIndex: 1, explanation: "−7 is further from zero so it is smaller than −3." },
      { question: "What is 4 − 9?", options: ["5", "−5", "−4", "13"], correctIndex: 1, explanation: "4 − 9 = −5. When we subtract a bigger number, the result is negative." },
      { question: "The temperature is −3°C. It rises by 7 degrees. What is the new temperature?", options: ["4°C", "−10°C", "10°C", "−4°C"], correctIndex: 0, explanation: "−3 + 7 = 4°C." },
    ],
  },
  "Long Multiplication": {
    introduction:
      "Long multiplication is a method for multiplying large numbers step by step. It breaks the problem into smaller, easier multiplications.",
    keyPoints: [
      "Multiply by each digit of the bottom number separately.",
      "Remember to add a zero placeholder for the tens digit, two zeros for the hundreds, etc.",
      "Add all the partial products together for the final answer.",
    ],
    examples: [
      { title: "Example: 234 × 56", content: "Step 1: 234 × 6 = 1,404. Step 2: 234 × 50 = 11,700. Step 3: 1,404 + 11,700 = 13,104." },
    ],
    quiz: [
      { question: "What is 45 × 12?", options: ["540", "450", "510", "560"], correctIndex: 0, explanation: "45 × 12 = 45 × 10 + 45 × 2 = 450 + 90 = 540." },
      { question: "When multiplying 123 × 40, what is the first step?", options: ["123 × 4 then add a zero", "123 + 40", "123 ÷ 40", "40 − 123"], correctIndex: 0, explanation: "Multiply 123 × 4 = 492, then add a zero to get 4,920." },
      { question: "What is 15 × 15?", options: ["225", "215", "200", "250"], correctIndex: 0, explanation: "15 × 15 = 15 × 10 + 15 × 5 = 150 + 75 = 225." },
    ],
  },
  "Long Division": {
    introduction:
      "Long division helps us divide large numbers step by step using the bus stop method. We divide, multiply, subtract, and bring down.",
    keyPoints: [
      "Divide the first digit (or group of digits) by the divisor.",
      "Multiply, write the result, subtract, and bring down the next digit.",
      "Repeat until all digits are used.",
      "Check your answer: quotient × divisor should equal the dividend.",
    ],
    examples: [
      { title: "Example: 756 ÷ 6", content: "7 ÷ 6 = 1 remainder 1. Bring down 5 → 15. 15 ÷ 6 = 2 remainder 3. Bring down 6 → 36. 36 ÷ 6 = 6. Answer: 126." },
    ],
    quiz: [
      { question: "What is 144 ÷ 12?", options: ["11", "12", "13", "14"], correctIndex: 1, explanation: "12 × 12 = 144, so 144 ÷ 12 = 12." },
      { question: "What is 258 ÷ 6?", options: ["42", "43", "44", "41"], correctIndex: 1, explanation: "6 × 43 = 258, so 258 ÷ 6 = 43." },
      { question: "What is the remainder when 100 is divided by 7?", options: ["1", "2", "3", "4"], correctIndex: 1, explanation: "7 × 14 = 98, so 100 − 98 = 2 remainder." },
    ],
  },
  "Order of Operations (BODMAS)": {
    introduction:
      "BODMAS tells us the correct order to solve a calculation: Brackets, Orders (powers), Division & Multiplication, Addition & Subtraction.",
    keyPoints: [
      "B = Brackets first",
      "O = Orders (squares, cubes, roots)",
      "DM = Division and Multiplication (left to right)",
      "AS = Addition and Subtraction (left to right)",
    ],
    examples: [
      { title: "Example: 3 + 4 × 2", content: "Multiply first: 4 × 2 = 8. Then add: 3 + 8 = 11. (Not 14!)" },
      { title: "Example with brackets: (3 + 4) × 2", content: "Brackets first: 3 + 4 = 7. Then multiply: 7 × 2 = 14." },
    ],
    quiz: [
      { question: "What is 2 + 3 × 4?", options: ["20", "14", "24", "12"], correctIndex: 1, explanation: "Multiply first: 3 × 4 = 12. Then add: 2 + 12 = 14." },
      { question: "What is (5 + 3) × 2?", options: ["11", "13", "16", "10"], correctIndex: 2, explanation: "Brackets first: 5 + 3 = 8. Then 8 × 2 = 16." },
      { question: "What is 20 − 4 × 3 + 1?", options: ["9", "49", "6", "53"], correctIndex: 0, explanation: "Multiply first: 4 × 3 = 12. Then 20 − 12 + 1 = 9." },
    ],
  },
  "Simplifying Fractions": {
    introduction:
      "Simplifying fractions means making them as simple as possible by dividing the numerator and denominator by their highest common factor (HCF).",
    keyPoints: [
      "Find the HCF of the numerator and denominator.",
      "Divide both by the HCF.",
      "A fraction is fully simplified when the HCF is 1.",
      "Example: 12/18 → HCF is 6 → 12÷6 / 18÷6 = 2/3",
    ],
    examples: [
      { title: "Simplify 8/12", content: "Factors of 8: 1,2,4,8. Factors of 12: 1,2,3,4,6,12. HCF = 4. So 8÷4 / 12÷4 = 2/3." },
    ],
    quiz: [
      { question: "What is 6/9 simplified?", options: ["2/3", "3/4", "1/3", "6/9"], correctIndex: 0, explanation: "HCF of 6 and 9 is 3. 6÷3 / 9÷3 = 2/3." },
      { question: "What is 15/25 simplified?", options: ["3/5", "1/5", "5/3", "5/25"], correctIndex: 0, explanation: "HCF of 15 and 25 is 5. 15÷5 / 25÷5 = 3/5." },
      { question: "Is 7/13 already in simplest form?", options: ["Yes", "No, it simplifies to 1/2", "No, it simplifies to 7/12", "Cannot simplify fractions"], correctIndex: 0, explanation: "7 and 13 share no common factors other than 1, so it's already simplified." },
    ],
  },
  "Adding & Subtracting Fractions": {
    introduction:
      "To add or subtract fractions, they must have the same denominator (bottom number). If they don't, find a common denominator first.",
    keyPoints: [
      "Same denominator: just add/subtract the numerators.",
      "Different denominators: find the lowest common denominator (LCD).",
      "Convert both fractions to equivalent fractions with the LCD.",
      "Remember to simplify the answer.",
    ],
    examples: [
      { title: "Same denominator: 3/8 + 2/8", content: "= (3+2)/8 = 5/8" },
      { title: "Different denominator: 1/3 + 1/4", content: "LCD of 3 and 4 = 12. 1/3 = 4/12, 1/4 = 3/12. 4/12 + 3/12 = 7/12." },
    ],
    quiz: [
      { question: "What is 2/5 + 1/5?", options: ["3/5", "3/10", "2/10", "1/5"], correctIndex: 0, explanation: "Same denominator: (2+1)/5 = 3/5." },
      { question: "What is 1/2 + 1/3?", options: ["2/5", "5/6", "1/6", "3/6"], correctIndex: 1, explanation: "LCD = 6. 1/2 = 3/6, 1/3 = 2/6. 3/6 + 2/6 = 5/6." },
      { question: "What is 3/4 − 1/2?", options: ["2/2", "1/4", "1/2", "3/2"], correctIndex: 1, explanation: "LCD = 4. 1/2 = 2/4. 3/4 − 2/4 = 1/4." },
    ],
  },
  "Multiplying Fractions": {
    introduction:
      "Multiplying fractions is simpler than adding them — just multiply the numerators together and the denominators together.",
    keyPoints: [
      "Multiply numerator × numerator.",
      "Multiply denominator × denominator.",
      "Simplify the result if possible.",
      "With mixed numbers, convert to improper fractions first.",
    ],
    examples: [
      { title: "Example: 2/3 × 4/5", content: "Numerators: 2 × 4 = 8. Denominators: 3 × 5 = 15. Answer: 8/15." },
    ],
    quiz: [
      { question: "What is 1/2 × 1/3?", options: ["1/6", "2/3", "1/5", "2/6"], correctIndex: 0, explanation: "1×1 / 2×3 = 1/6." },
      { question: "What is 3/4 × 2/5?", options: ["6/20", "5/9", "6/9", "3/10"], correctIndex: 0, explanation: "3×2 / 4×5 = 6/20 = 3/10 simplified." },
      { question: "What is 5 × 1/3?", options: ["5/3", "1/15", "3/5", "15"], correctIndex: 0, explanation: "5/1 × 1/3 = 5/3 (or 1 and 2/3)." },
    ],
  },
  "Relative Clauses": {
    introduction:
      "A relative clause gives extra information about a noun. It usually starts with who, which, where, when, or whose. Relative clauses help make our writing more detailed and interesting.",
    keyPoints: [
      "'who' refers to people: The girl who wore red won the race.",
      "'which' refers to things/animals: The book, which was old, fell apart.",
      "'where' refers to places: The park where we play is nearby.",
      "'whose' shows possession: The boy whose bag is blue is my friend.",
    ],
    examples: [
      { title: "Defining clause", content: "The man who lives next door is a teacher. (This tells us WHICH man — essential information.)" },
      { title: "Non-defining clause", content: "My dog, which is a spaniel, loves swimming. (This adds extra info — the sentence works without it.)" },
    ],
    quiz: [
      { question: "Which relative pronoun fits? 'The woman ___ called was my aunt.'", options: ["which", "where", "who", "whose"], correctIndex: 2, explanation: "'Who' is used for people." },
      { question: "Which relative pronoun fits? 'The castle ___ we visited was 500 years old.'", options: ["who", "which", "whose", "whom"], correctIndex: 1, explanation: "'Which' is used for things and places when it's the object." },
      { question: "What is a non-defining relative clause?", options: ["A clause that defines the noun", "A clause that adds extra (non-essential) information", "A clause without a verb", "A clause at the start of a sentence"], correctIndex: 1, explanation: "Non-defining clauses add extra info and are usually separated by commas." },
    ],
  },
  "Modal Verbs": {
    introduction:
      "Modal verbs express possibility, ability, permission, or obligation. Common modal verbs are: can, could, may, might, shall, should, will, would, must.",
    keyPoints: [
      "'Can' expresses ability: I can swim.",
      "'Could' expresses past ability or polite requests: Could you help me?",
      "'Must' expresses strong obligation: You must wear a seatbelt.",
      "'Should' expresses advice: You should eat more vegetables.",
      "'May/Might' express possibility: It might rain later.",
    ],
    examples: [
      { title: "Ability", content: "'She can speak three languages.' — shows what she is able to do." },
      { title: "Permission", content: "'May I go to the toilet?' — polite way to ask permission." },
    ],
    quiz: [
      { question: "Which modal verb shows obligation?", options: ["can", "might", "must", "could"], correctIndex: 2, explanation: "'Must' shows a strong obligation or duty." },
      { question: "Fill in the blank: 'You ___ try harder next time.' (advice)", options: ["must", "should", "can", "will"], correctIndex: 1, explanation: "'Should' is used to give advice." },
      { question: "'It ___ rain tomorrow.' Which modal expresses possibility?", options: ["must", "can", "shall", "might"], correctIndex: 3, explanation: "'Might' expresses something that is possible but not certain." },
    ],
  },
  "Active vs Passive Voice": {
    introduction:
      "In active voice, the subject performs the action. In passive voice, the subject receives the action. Both are useful, but knowing when to use each improves writing.",
    keyPoints: [
      "Active: The cat (subject) chased (verb) the mouse (object).",
      "Passive: The mouse (subject) was chased (verb) by the cat (agent).",
      "Passive voice uses a form of 'to be' + past participle.",
      "Use passive when the action is more important than who did it.",
    ],
    examples: [
      { title: "Active to Passive", content: "Active: 'The chef cooked the meal.' → Passive: 'The meal was cooked by the chef.'" },
      { title: "When passive is useful", content: "'The Mona Lisa was painted in the 16th century.' (Who painted it is less important here.)" },
    ],
    quiz: [
      { question: "Which sentence is in passive voice?", options: ["The dog bit the postman.", "The postman was bitten by the dog.", "The dog is very fierce.", "The postman ran away."], correctIndex: 1, explanation: "The subject (postman) receives the action, making it passive." },
      { question: "Convert to passive: 'Tom wrote the letter.'", options: ["The letter was written by Tom.", "Tom was written by the letter.", "The letter wrote Tom.", "Tom is writing a letter."], correctIndex: 0, explanation: "The object becomes the subject: 'The letter was written by Tom.'" },
      { question: "Passive voice always uses which two things?", options: ["A noun and an adjective", "A form of 'to be' + past participle", "Two verbs in a row", "A conjunction and a pronoun"], correctIndex: 1, explanation: "Passive = form of 'to be' (was, is, were) + past participle (written, eaten, built)." },
    ],
  },
  "The Solar System": {
    introduction:
      "Our solar system is made up of the Sun and everything that orbits it — 8 planets, moons, asteroids, and comets. The Sun is at the centre, and everything else is held by gravity.",
    keyPoints: [
      "The 8 planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
      "The inner planets (Mercury, Venus, Earth, Mars) are rocky.",
      "The outer planets (Jupiter, Saturn, Uranus, Neptune) are gas/ice giants.",
      "Earth is the only known planet with liquid water and life.",
    ],
    examples: [
      { title: "Planet sizes", content: "Jupiter is the largest planet — about 1,300 Earths could fit inside it! Mercury is the smallest, only slightly larger than our Moon." },
    ],
    quiz: [
      { question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], correctIndex: 1, explanation: "Mercury is the first planet from the Sun." },
      { question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correctIndex: 1, explanation: "There are 8 planets (Pluto is now classified as a dwarf planet)." },
      { question: "Which planet is known as the 'Red Planet'?", options: ["Jupiter", "Saturn", "Mars", "Venus"], correctIndex: 2, explanation: "Mars appears red due to iron oxide (rust) on its surface." },
    ],
  },
  "Day and Night": {
    introduction:
      "Day and night happen because the Earth rotates (spins) on its axis. One full rotation takes about 24 hours. The side facing the Sun has daytime, and the opposite side has night-time.",
    keyPoints: [
      "The Earth rotates from west to east.",
      "One rotation = approximately 24 hours = 1 day.",
      "The Sun doesn't move around the Earth — the Earth spins!",
      "Different parts of the world experience day and night at different times.",
    ],
    examples: [
      { title: "Time zones", content: "When it's midday in London, it's night in New Zealand. This is because they're on opposite sides of the Earth." },
    ],
    quiz: [
      { question: "What causes day and night?", options: ["The Sun moving around Earth", "The Earth rotating on its axis", "The Moon blocking the Sun", "Clouds covering the sky"], correctIndex: 1, explanation: "The Earth's rotation on its axis causes day and night." },
      { question: "How long does one rotation of the Earth take?", options: ["12 hours", "24 hours", "365 days", "7 days"], correctIndex: 1, explanation: "One full rotation takes approximately 24 hours." },
      { question: "Which direction does the Earth rotate?", options: ["East to west", "West to east", "North to south", "It doesn't rotate"], correctIndex: 1, explanation: "The Earth rotates from west to east, which is why the Sun rises in the east." },
    ],
  },
  "The Moon & Tides": {
    introduction:
      "The Moon is Earth's natural satellite. It orbits Earth roughly every 27.3 days and affects our tides through its gravitational pull.",
    keyPoints: [
      "The Moon has phases: new moon, crescent, quarter, gibbous, and full moon.",
      "The Moon doesn't produce its own light — it reflects sunlight.",
      "The Moon's gravity causes tides on Earth.",
      "High tide occurs on the side of Earth closest to (and furthest from) the Moon.",
    ],
    examples: [
      { title: "Moon phases", content: "The Moon appears to change shape over about 29.5 days. From new moon (invisible) to full moon (fully lit) and back again." },
    ],
    quiz: [
      { question: "What causes the tides?", options: ["Wind", "The Sun's heat", "The Moon's gravitational pull", "Underwater volcanoes"], correctIndex: 2, explanation: "The Moon's gravity pulls on Earth's water, creating tides." },
      { question: "Does the Moon produce its own light?", options: ["Yes", "No, it reflects sunlight", "Only during a full moon", "It produces heat, not light"], correctIndex: 1, explanation: "The Moon reflects light from the Sun — it has no light of its own." },
      { question: "How long does it take the Moon to orbit Earth?", options: ["24 hours", "7 days", "About 27 days", "365 days"], correctIndex: 2, explanation: "The Moon takes approximately 27.3 days to complete one orbit around Earth." },
    ],
  },
}

const fallbackContent: LessonContent = {
  introduction:
    "Welcome to this lesson! Today we'll explore an exciting topic that will help you build your knowledge and confidence.",
  keyPoints: [
    "Pay attention to the key concepts explained in this lesson.",
    "Try to connect what you learn here to things you already know.",
    "Don't worry about getting everything right first time — learning is about practice!",
    "Ask your AI tutor if you need extra help understanding something.",
  ],
  examples: [
    { title: "Practice makes perfect", content: "The best way to learn is by doing. Complete the quiz at the end to test your understanding!" },
  ],
  quiz: [
    { question: "What is the best approach to learning something new?", options: ["Rush through it quickly", "Practice regularly and ask questions", "Only memorise facts", "Skip difficult parts"], correctIndex: 1, explanation: "Regular practice and asking questions helps you build deep understanding." },
    { question: "If you don't understand something, what should you do?", options: ["Give up", "Ask for help or try a different approach", "Ignore it", "Guess randomly"], correctIndex: 1, explanation: "Good learners ask for help and try different approaches until they understand." },
    { question: "Why is it important to check your answers?", options: ["It wastes time", "It helps you spot and learn from mistakes", "Teachers require it", "It doesn't matter"], correctIndex: 1, explanation: "Checking your work helps you catch mistakes and learn from them." },
  ],
}

export function getLessonContent(title: string): LessonContent {
  return contentByTitle[title] ?? fallbackContent
}
