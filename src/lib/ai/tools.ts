import { tool, zodSchema } from "ai"
import { z } from "zod"

export const tutorTools = {
  generate_quiz: tool({
    description:
      "Generate a quiz question for the student based on the current topic and difficulty. Use this after explaining a concept to check understanding.",
    inputSchema: zodSchema(
      z.object({
        question: z.string().describe("The quiz question text"),
        options: z
          .array(z.string())
          .length(4)
          .describe("Exactly 4 answer options"),
        correctIndex: z
          .number()
          .min(0)
          .max(3)
          .describe("Index of the correct answer (0-3)"),
        hint: z.string().describe("A helpful hint if the student is stuck"),
        bloomLevel: z
          .number()
          .min(1)
          .max(6)
          .describe("Bloom's Taxonomy level of this question"),
      })
    ),
  }),

  launch_game: tool({
    description:
      "Launch an interactive mini-game to make learning fun. Use after the student has shown basic understanding and needs practice.",
    inputSchema: zodSchema(
      z.object({
        gameType: z
          .enum([
            "number-blaster",
            "word-builder",
            "match-pairs",
            "fill-the-gap",
            "sort-it",
            "speed-quiz",
          ])
          .describe("Which game template to use"),
        title: z.string().describe("Display title for this game round"),
        items: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
              distractors: z.array(z.string()).optional(),
            })
          )
          .min(3)
          .max(8)
          .describe("Game content items"),
        difficulty: z
          .enum(["easy", "medium", "hard"])
          .describe("Difficulty level"),
      })
    ),
  }),

  update_mastery: tool({
    description:
      "Update the student's mastery level for the current topic. Call this after a quiz or game to record their progress.",
    inputSchema: zodSchema(
      z.object({
        topic: z.string().describe("The topic being assessed"),
        subject: z
          .string()
          .describe("The subject (Mathematics, English, Science)"),
        correct: z
          .boolean()
          .describe("Whether the student answered correctly"),
        newBloomLevel: z
          .number()
          .min(1)
          .max(6)
          .describe("Updated Bloom's level for this topic"),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe("Confidence score 0-1"),
      })
    ),
  }),

  end_session: tool({
    description:
      "End the tutoring session. Call this when the lesson is complete or time is up. Provide a summary for the parent.",
    inputSchema: zodSchema(
      z.object({
        summary: z
          .string()
          .describe(
            "Brief summary of what was covered and how the student did"
          ),
        topicsCovered: z
          .array(z.string())
          .describe("List of topics covered in this session"),
        score: z
          .number()
          .min(0)
          .max(100)
          .describe("Overall performance score 0-100"),
        recommendation: z
          .string()
          .describe("What the student should focus on next"),
      })
    ),
  }),
}
