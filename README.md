# Interaction Layer Studio

**Prototype the architecture between LLMs and products**

A tool for conversation designers to document, test, and share interaction layer designs for agentic AI systems.

---

## What It Does

1. **Upload Design Artifacts** - Agent prompts, behavioral contracts, state machines, error taxonomies
2. **Configure LLM** - Connect to Claude, GPT, or Gemini with your API key
3. **Prototype** - Interact with your designed system and test if the LLM follows your specifications

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

### Step 1: Upload Your Design Documents

Drag and drop your design artifacts:
- **Agent Prompts** (.md, .txt, .docx, .pdf) - Define agent personality, capabilities, decision rules
- **Behavioral Contracts** (.md, .txt, .docx, .pdf) - Specify how agents make decisions
- **State Machines** (.json, .md) - Define workflow states and transitions
- **Error Taxonomies** (.md, .txt, .docx, .pdf) - List errors and recovery protocols

**Working with Google Docs:**
1. Open your Google Doc
2. File → Download → Microsoft Word (.docx) OR PDF
3. Upload the downloaded file to Studio

The tool auto-categorizes files based on naming patterns and supports:
- Markdown (.md)
- Text files (.txt)
- JSON (.json)
- PDFs (.pdf)
- Word documents (.doc, .docx)

### Step 2: Configure LLM

Choose your provider:
- **Claude** (Anthropic) - Recommended for complex reasoning
- **GPT** (OpenAI) - Fast and reliable
- **Gemini** (Google) - Multimodal capabilities
- **Llama** (Meta via Together AI) - Open source, cost-effective

Enter your API key (stored locally, never sent to our servers).

### Step 3: Prototype

Chat with your designed agent system. The LLM reads all your documents and behaves according to your specifications.

**Test scenarios:**
- Does the agent follow state machine transitions?
- Does it respect behavioral contract boundaries?
- Does it handle errors as specified?
- Does it maintain the defined personality?

---

## Example Use Cases

### Use Case 1: Testing Agent Behavioral Contracts

Upload:
- `agent_prompt.md` - Defines agent role and capabilities
- `behavioral_assumptions.md` - Specifies decision boundaries
- `error_taxonomy.md` - Lists possible errors and recovery

Test:
- Send edge case inputs
- Verify agent abstains when confidence is low
- Check error handling follows specifications

### Use Case 2: Multi-Agent Coordination

Upload:
- `orchestrator_prompt.md`
- `retrieval_agent_prompt.md`
- `reasoning_agent_prompt.md`
- `state_machine.json`

Test:
- Agent handoffs
- State transitions
- Verification checkpoints

### Use Case 3: Stakeholder Demos

Upload complete interaction layer design, generate shareable prototype link, send to PM/engineering team for feedback.

---

## Architecture

```
interaction-layer-studio/
├── app/
│   ├── components/
│   │   ├── DocumentUploader.tsx    # Upload interface
│   │   ├── LLMConfiguration.tsx     # API key & model selection
│   │   └── ChatInterface.tsx        # Prototype chat
│   ├── api/
│   │   └── chat/route.ts            # LLM router (Claude/GPT/Gemini)
│   ├── page.tsx                     # Main app
│   └── layout.tsx
├── package.json
└── README.md
```

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **APIs:** Anthropic, OpenAI, Google AI, Together AI (for Llama)
- **Deployment:** Vercel

---

## Getting API Keys

- **Claude:** https://console.anthropic.com
- **GPT:** https://platform.openai.com
- **Gemini:** https://ai.google.dev
- **Llama:** https://api.together.xyz (Together AI) or https://groq.com (Groq)

---

## Roadmap

### Phase 1 (Current)
- ✅ Document upload
- ✅ LLM configuration
- ✅ Basic chat prototype
- ✅ Support Claude, GPT, Gemini

### Phase 2
- [ ] State machine visualization (integrate React Flow)
- [ ] Real-time state tracking during conversations
- [ ] Behavioral contract validation (flag when LLM violates specs)
- [ ] Export conversation logs

### Phase 3
- [ ] Voice integration (ElevenLabs)
- [ ] Multi-agent simulation
- [ ] Save/share projects
- [ ] Collaboration features

---

## Design Philosophy

This tool embodies the principle that **interaction layer design is architecture**, not prompt engineering.

The interaction layer is the behavioral ecosystem between LLM capability and product constraints. It includes:
- State machines that govern workflows
- Behavioral contracts that define boundaries
- Verification checkpoints that create reliability
- Error taxonomies that enable recovery

Designing this layer requires prototyping and testing—not just documentation.

---

**Designed by Alana Cortes**

---

## License

MIT
