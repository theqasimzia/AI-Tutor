# AI Tutor Academy — Architecture & Implementation Plan

## Vision
An LLM-powered AI tutoring platform where a 3D avatar delivers personalised
lessons to children, generating all content (explanations, quizzes, games)
in real-time using RAG from UK National Curriculum content. The system tracks
interests, adapts difficulty using Bloom's Taxonomy and cognitive theories,
and provides detailed reports to parents.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ Browser (Next.js Client)                            │
│                                                     │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │ 3D Avatar│  │ Chat / Voice│  │ Quiz/Game       │ │
│  │ (R3F)    │  │ Interface   │  │ Renderer        │ │
│  └──────────┘  └────────────┘  └─────────────────┘ │
│         │              │                │           │
│         └──────────────┼────────────────┘           │
│                        │ useChat() / streaming      │
└────────────────────────┼────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────┐
│ Server (Next.js API Routes)                         │
│                        │                            │
│  ┌─────────────────────▼──────────────────────┐     │
│  │ /api/tutor/chat (streaming)                │     │
│  │   ├─ Session Orchestrator (state machine)  │     │
│  │   ├─ Model Router (4o vs 4o-mini)          │     │
│  │   ├─ RAG Pipeline (retrieve curriculum)    │     │
│  │   └─ Tool Calls (quiz, game, progress)     │     │
│  └────────────────────────────────────────────┘     │
│                                                     │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ OpenAI API   │  │ Azure TTS  │  │ Prisma ORM  │ │
│  │ (GPT-4o/mini)│  │ (Phase 2)  │  │ (Postgres)  │ │
│  └──────────────┘  └────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────┼─────────┐
│ Supabase PostgreSQL                       │         │
│                                           │         │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ User/Student  │  │ Sessions &  │  │ pgvector    ││
│  │ Curriculum    │  │ Mastery     │  │ Embeddings  ││
│  └──────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## Cost Optimization Strategy

### Model Routing
- **GPT-4o**: Complex teaching, misconception analysis, lesson planning
- **GPT-4o-mini**: Quiz generation, answer evaluation, simple Q&A, routing
- **Result**: ~75% of calls use mini, cutting LLM cost by ~10x

### Caching Layers
1. **Explanation cache**: Common explanations generated once per topic/year
2. **Quiz pool**: Batch-generate 50 questions per topic weekly
3. **Response cache**: Identical questions return cached answers
4. **Embedding cache**: Curriculum embeddings computed once, stored in pgvector

### Session Limits (Business + Cost Control)
- Free: 3 sessions/week, 10 min, text-only
- Premium: Unlimited, 30 min, avatar + voice

### Projected Cost Per Student
- ~$3-4.50/month at premium usage (20 sessions, 20 min each)
- Price at £9.99/month = ~60% gross margin

---

## Session Flow (State Machine)

```
GREETING          → Collect/confirm interests, set mood
    ↓
TOPIC_SELECTION   → AI picks topic based on curriculum + mastery + interests
    ↓
TEACHING          → AI explains concept using RAG content, adapted to level
    ↓
CHECK             → Quick question to gauge understanding
    ↓
  ┌── Correct ──────────── Incorrect ──┐
  ↓                                    ↓
PRACTICE                          RETEACH (simpler, different approach)
  ↓                                    ↓
QUIZ / GAME                       SCAFFOLD (break into smaller steps)
  ↓                                    ↓
RESULTS                           → back to CHECK
  ↓
NEXT_TOPIC or WRAP_UP (with parent report)
```

---

## Bloom's Taxonomy Integration

Per topic, per student, track cognitive level:

| Level | Name | AI Tests With |
|-------|------|--------------|
| 1 | Remember | Recall facts: "What is 7 × 8?" |
| 2 | Understand | Explain: "Why do we find common denominators?" |
| 3 | Apply | New context: word problems |
| 4 | Analyze | Debug: "What's wrong with this working?" |
| 5 | Evaluate | Judge: "Which method is better and why?" |
| 6 | Create | Generate: "Make up your own word problem" |

Progress up levels only when mastery demonstrated at current level.

---

## Cognitive Theories Embedded in System Prompt

- **Zone of Proximal Development (Vygotsky)**: Scaffold just above current ability
- **Concrete → Representational → Abstract (CRA)**: Real examples → visuals → symbols
- **Dual Coding (Paivio)**: Speech + visuals simultaneously
- **Spaced Repetition**: Review old topics at increasing intervals
- **Growth Mindset (Dweck)**: Praise effort, not just correctness

---

## AI Tool Calls (Function Calling)

The LLM can call these tools during a session:

| Tool | Purpose | Model |
|------|---------|-------|
| `get_curriculum_content` | RAG retrieval for current topic | — (DB query) |
| `get_student_profile` | Fetch interests, mastery, history | — (DB query) |
| `generate_quiz` | Create quiz with structured JSON output | 4o-mini |
| `launch_game` | Start a game template with AI-generated params | 4o-mini |
| `update_mastery` | Record topic mastery level change | — (DB write) |
| `generate_hint` | Produce a scaffolded hint | 4o-mini |
| `end_session` | Wrap up, generate summary + parent notification | 4o-mini |

---

## Game Template Plugin System

Admins add game templates via the portal. Each template has:
- React component (the visual/interactive shell)
- Parameter schema (what the AI can configure)
- AI description (so the LLM knows when to use it)

The AI auto-discovers and uses games. Adding games requires zero AI code changes.

---

## Implementation Phases

### Phase 1: AI Engine + Text Chat ← CURRENT
- OpenAI API + Vercel AI SDK integration
- Prisma schema: TutorSession, TopicMastery, ContentEmbedding
- pgvector RAG pipeline (embed curriculum, semantic search)
- Session orchestrator (state machine)
- System prompt (Bloom's + cognitive theories + UK curriculum)
- /api/tutor/chat streaming endpoint with tool calls
- Lesson page → AI chat interface (text-based)
- Interest collection in student onboarding

### Phase 2: Voice + Avatar
- Azure Neural TTS integration (streaming + visemes)
- Web Speech API for child's voice input
- React Three Fiber setup in lesson page
- 5-6 avatar GLTF models with blend shapes
- Lip sync engine (viseme → morph target)
- Avatar selection during onboarding

### Phase 3: Games + Adaptive Learning
- 6 game template components (Number Blaster, Word Builder, etc.)
- AI generates game content via structured output
- Difficulty auto-adjustment based on accuracy
- Spaced repetition scheduler
- Real-time engagement scoring

### Phase 4: Analytics + Parent Reports
- AI-generated weekly progress reports
- Bloom's Taxonomy progress visualisation per topic
- Interest evolution timeline
- Strength/weakness heatmaps
- Parent notification system
