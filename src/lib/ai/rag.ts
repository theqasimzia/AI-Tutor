"use server"

import prisma from "@/lib/prisma"
import { openai } from "@ai-sdk/openai"
import { embedMany, embed } from "ai"
import { AI_CONFIG } from "./config"

export async function embedAndStore(
  chunks: {
    content: string
    source: string
    topic: string
    subject: string
    keyStage: string
    bloomLevel?: number
  }[]
) {
  if (chunks.length === 0) return

  const { embeddings } = await embedMany({
    model: openai.embedding(AI_CONFIG.models.embedding),
    values: chunks.map((c) => c.content),
  })

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const vector = `[${embeddings[i].join(",")}]`

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ContentEmbedding" (id, content, embedding, source, topic, subject, "keyStage", "bloomLevel", "createdAt")
       VALUES (gen_random_uuid(), $1, $2::vector, $3, $4, $5, $6, $7, NOW())`,
      chunk.content,
      vector,
      chunk.source,
      chunk.topic,
      chunk.subject,
      chunk.keyStage,
      chunk.bloomLevel ?? 1
    )
  }
}

export async function retrieveContent(
  query: string,
  filters?: { subject?: string; keyStage?: string; topic?: string }
): Promise<{ content: string; topic: string; source: string }[]> {
  const { embedding } = await embed({
    model: openai.embedding(AI_CONFIG.models.embedding),
    value: query,
  })

  const vector = `[${embedding.join(",")}]`

  let whereClause = "WHERE 1=1"
  const params: unknown[] = [vector, AI_CONFIG.ragTopK]

  if (filters?.subject) {
    params.push(filters.subject)
    whereClause += ` AND subject = $${params.length}`
  }
  if (filters?.keyStage) {
    params.push(filters.keyStage)
    whereClause += ` AND "keyStage" = $${params.length}`
  }
  if (filters?.topic) {
    params.push(filters.topic)
    whereClause += ` AND topic = $${params.length}`
  }

  const results = await prisma.$queryRawUnsafe<
    { content: string; topic: string; source: string }[]
  >(
    `SELECT content, topic, source
     FROM "ContentEmbedding"
     ${whereClause}
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    ...params
  )

  return results
}

export async function getEmbeddingCount() {
  return prisma.$queryRaw<[{ count: bigint }]>`
    SELECT count(*) FROM "ContentEmbedding"
  `.then((r) => Number(r[0].count))
}
