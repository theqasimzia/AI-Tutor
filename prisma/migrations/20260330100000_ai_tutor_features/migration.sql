-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "SessionPhase" AS ENUM ('GREETING', 'TOPIC_SELECTION', 'TEACHING', 'CHECK', 'PRACTICE', 'RETEACH', 'QUIZ', 'GAME', 'RESULTS', 'WRAP_UP');

-- AlterTable: Add interests to Student
ALTER TABLE "Student" ADD COLUMN "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable: TutorSession
CREATE TABLE "TutorSession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT,
    "phase" "SessionPhase" NOT NULL DEFAULT 'GREETING',
    "topic" TEXT,
    "bloomLevel" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    CONSTRAINT "TutorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TutorMessage
CREATE TABLE "TutorMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TutorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TopicMastery
CREATE TABLE "TopicMastery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bloomLevel" INTEGER NOT NULL DEFAULT 1,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TopicMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ContentEmbedding (RAG)
CREATE TABLE "ContentEmbedding" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536),
    "source" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "keyStage" TEXT NOT NULL,
    "bloomLevel" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopicMastery_studentId_topic_key" ON "TopicMastery"("studentId", "topic");
CREATE INDEX "ContentEmbedding_subject_keyStage_idx" ON "ContentEmbedding"("subject", "keyStage");

-- AddForeignKey
ALTER TABLE "TutorSession" ADD CONSTRAINT "TutorSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TutorSession" ADD CONSTRAINT "TutorSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TutorMessage" ADD CONSTRAINT "TutorMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TutorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
