export const AI_CONFIG = {
  models: {
    primary: process.env.AI_MODEL_PRIMARY || "gpt-4o",
    fast: process.env.AI_MODEL_FAST || "gpt-4o-mini",
    embedding: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
  },
  maxSessionMinutes: 30,
  maxMessagesPerSession: 100,
  embeddingDimensions: 1536,
  ragTopK: 5,
} as const
