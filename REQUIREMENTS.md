# AI Tutor Academy — Requirements Checklist

## API Keys & Services (Environment Variables)

### Must Have Before Phase 1
- [ ] **OpenAI API Key** — Sign up at https://platform.openai.com → API Keys → Create new key
  - Models used: `gpt-4o` (teaching), `gpt-4o-mini` (quizzes/routing), `text-embedding-3-small` (RAG)
  - Estimated cost: ~$5-10 for initial development/testing
  - Add to `.env` as `OPENAI_API_KEY`

### Must Have Before Phase 2 (Avatar & Voice)
- [ ] **Azure Speech Services Key** — https://portal.azure.com → Create "Speech" resource
  - Used for: Text-to-Speech with viseme data (lip sync)
  - British English neural voices: `en-GB-SoniaNeural`, `en-GB-RyanNeural`
  - Cost: ~$0.016 per 1K characters (~£12/mo for 500 students)
  - Add to `.env` as `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`
- [ ] **Avatar 3D Models** — 5-6 GLTF/GLB files with blend shapes
  - Options: Ready Player Me (free), Mixamo (free), custom artist
  - Requirements: morph targets for visemes (lip sync), idle/talk/celebrate animations
  - Styles: cartoon animals (owl, fox, bear, cat, robot, astronaut)

### Already Configured
- [x] Supabase PostgreSQL (DATABASE_URL, DIRECT_URL)
- [x] NextAuth (NEXTAUTH_SECRET, NEXTAUTH_URL)

---

## Curriculum Content for RAG (What You Need to Gather)

The AI tutor teaches FROM this content. Quality of content = quality of tutoring.

### Tier 1 — Curriculum Framework (REQUIRED)
Source: https://www.gov.uk/government/collections/national-curriculum

- [ ] **Mathematics Programme of Study** — KS2 (Years 3-6) and KS3 (Years 7-9)
  - PDF from gov.uk: "Mathematics programmes of study: key stages 1 and 2"
  - PDF from gov.uk: "Mathematics programmes of study: key stage 3"
- [ ] **English Programme of Study** — KS2 and KS3
  - PDF from gov.uk: "English programmes of study: key stages 1 and 2"
  - PDF from gov.uk: "English programmes of study: key stage 3"
- [ ] **Science Programme of Study** — KS2 and KS3
  - PDF from gov.uk: "Science programmes of study: key stages 1 and 2"
  - PDF from gov.uk: "Science programmes of study: key stage 3"

### Tier 2 — Teaching Content (HIGHLY RECOMMENDED)
These provide the detailed explanations the AI uses to teach.

- [ ] **BBC Bitesize content** (scrape or manually copy key topics)
  - Maths: https://www.bbc.co.uk/bitesize/subjects/z826n39
  - English: https://www.bbc.co.uk/bitesize/subjects/zv48q6f
  - Science: https://www.bbc.co.uk/bitesize/subjects/z2pfb9q
- [ ] **Oak National Academy lessons** (free, openly licensed)
  - https://www.thenational.academy/
  - Lesson plans with explanations, worked examples, key vocabulary
- [ ] **Common misconceptions per topic**
  - E.g., "Students think 1/3 > 1/2 because 3 > 2"
  - Source: "Children's Mathematics 4-15" by Julie Ryan & Julian Williams
  - Or compile from teaching forums / your own experience

### Tier 3 — Assessment Content (RECOMMENDED)
- [ ] **Past SATs papers** (freely available)
  - https://www.gov.uk/government/collections/national-curriculum-assessments-practice-materials
  - Maths KS2 SATs papers (2016-2024)
  - English KS2 SATs papers (2016-2024)
- [ ] **Question banks at different difficulty levels**
  - Tagged by topic, year group, and Bloom's Taxonomy level
  - Source: Corbett Maths, White Rose Maths, or your own

### Tier 4 — Pedagogical Framework (I CAN HELP WRITE THIS)
- [ ] **Bloom's Taxonomy mapping** — which cognitive level per topic per year
- [ ] **Teaching strategies per topic** — how to explain fractions vs grammar
- [ ] **Scaffolding approaches** — what to do when a child is stuck
- [ ] **Interest integration guide** — how to weave interests into explanations

### Content Format
Place content files in: `content/` directory at project root
- PDFs → will be parsed and chunked automatically
- Markdown (.md) → preferred format for structured content
- Text (.txt) → acceptable
- JSON (.json) → for structured question banks

---

## Infrastructure Decisions (Confirmed)

| Decision | Choice | Reason |
|----------|--------|--------|
| LLM Provider | OpenAI (GPT-4o + 4o-mini) | Best structured output, streaming, cost balance |
| TTS Provider | Azure Neural TTS (Phase 2) | Cheap, viseme data, British voices |
| Vector DB | pgvector in Supabase | Already have Postgres, no extra service |
| Avatar Tech | React Three Fiber (Phase 2) | Fits Next.js/React stack |
| Hosting | Vercel (current) | Works for Phase 1-2, evaluate at scale |
| AI SDK | Vercel AI SDK (`ai`) | Best Next.js integration, streaming built-in |
| State Management | Database-backed sessions | Resumable, trackable |

---

## Environment Variables (Full List)

```env
# Existing
DATABASE_URL="..."
DIRECT_URL="..."
NEXTAUTH_URL="..."
NEXTAUTH_SECRET="..."

# Phase 1 (AI Engine)
OPENAI_API_KEY="sk-..."

# Phase 2 (Voice + Avatar)
AZURE_SPEECH_KEY="..."
AZURE_SPEECH_REGION="uksouth"

# Optional
LOG_LEVEL="info"
AI_MODEL_PRIMARY="gpt-4o"
AI_MODEL_FAST="gpt-4o-mini"
AI_EMBEDDING_MODEL="text-embedding-3-small"
```
