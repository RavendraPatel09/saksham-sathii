# Saksham Sathi (Saksham AI) — Technical Architecture & Developer Guide

## 1. Project Overview
Saksham Sathi is an all-in-one assistive technology, vocational training, and employment platform designed for persons with disabilities (PwDs) in India.

### Core Tech Stack:
- **Frontend**: React 19, TypeScript 5.4, Vite 6, Tailwind CSS, shadcn/ui, Radix UI Primitives, Lucide Icons, Framer Motion.
- **State & Routing**: React Router v7, React Context API, Web Speech API.
- **Backend API**: Node.js, Express 4, Prisma ORM, Argon2, Helmet, Express Rate Limiter.
- **LLM Integration**: Anthropic Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`) with structured fallback templates.

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION LAYER                             │
│     [Voice / Microphone]     [Keyboard / Screen Reader]     [AAC Symbols]    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STATE & ACCESSIBILITY BUS                             │
│  AccessibilityProvider.tsx  <──>  AppContext.tsx  <──>  LanguageContext.tsx  │
│  • .dark / .high-contrast         • Workspace Mode      • Hindi / English    │
│  • .calm-mode / .mobility-mode    • Profile & Scores    • Translation Dict   │
│  • OpenDyslexic Typography        • Saved Items         • i18n Subscriptions │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN SERVICE LAYER                                │
│  VoiceAssistantService (FSM)   useVoiceNavigation     useCommunicationVoice │
│  • IDLE → GREETING → LISTENING  • Router actions       • AAC playback        │
│  • Echo cancellation           • Regex tokenization   • Spoken phrases      │
│  • Chromium deadlock recovery  • 42+ Voice commands   • Custom phrase store │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND & STORAGE LAYER                               │
│  Express API (Port 5000)      Anthropic Claude 3.5    FallbackStore         │
│  • /api/v1/accommodations     • Letter generation     • Zero-downtime mock  │
│  • /api/v1/assessments        • Doc simplification    • Local memory store  │
│  • /api/v1/jobs               • STAR coaching         • Offline sync queue  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory & Folder Structure

```
Saksham-Ai/
├── apps/
│   ├── api/                   # Express Backend Service
│   │   ├── src/
│   │   │   ├── controllers/   # Route handlers (accommodations, jobs, assessments)
│   │   │   ├── middleware/    # Auth, Validation (Zod), Rate Limiting
│   │   │   ├── routes/        # Versioned API routes (/api/v1)
│   │   │   ├── services/      # FallbackStore in-memory mock engine
│   │   │   └── validators/    # Zod payload validation schemas
│   │   └── package.json
│   └── web/                   # Vite + React Frontend Application
│       ├── public/            # Static assets (logo.png, favicon, icons)
│       ├── src/
│       │   ├── assets/        # Media assets
│       │   ├── components/    # Reusable UI components
│       │   │   ├── accessibility/ # AccessibilityWizard, ReadingGuide, FocusIndicator
│       │   │   ├── layout/    # Navbar, Footer
│       │   │   ├── speech/    # SpeechComposer AAC symbol board
│       │   │   ├── ui/        # Base Radix / shadcn primitives (button, card, dialog)
│       │   │   └── ui-custom/ # Logo, OnboardingModal, SakhiAI, PanicButton
│       │   ├── context/       # Global React Context providers
│       │   ├── data/          # Offline & demo fallback mock datasets
│       │   ├── hooks/         # Custom React hooks (useVoiceNavigation, useCommunicationVoice)
│       │   ├── lib/           # Storage keys, API client, Tailwind utilities
│       │   ├── pages/         # 30+ Application Route Views
│       │   ├── services/      # VoiceAssistantService Singleton State Machine
│       │   ├── types/         # Centralized TypeScript domain interfaces
│       │   ├── utils/         # Pure utility functions (voiceCommands.ts regex parser)
│       │   ├── App.tsx        # Root Route Provider & Navigation Shell
│       │   └── main.tsx       # Vite entry point
│       └── package.json
├── docs/                      # Technical documentation & architecture guides
└── vitest.config.ts           # Unit test configuration
```

---

## 4. Key Subsystems Explained

### A. Blind Mode Voice Engine (`VoiceAssistantService`)
- **Location**: `src/services/voiceAssistant.ts`
- **Pattern**: Finite State Machine Singleton.
- **States**: `IDLE` $\rightarrow$ `GREETING` $\rightarrow$ `LISTENING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SPEAKING` $\rightarrow$ `LISTENING` (loop) $\rightarrow$ `IDLE`.
- **Acoustic Feedback Shield**: Recognition is aborted before synthesis to prevent the microphone from recognizing its own speaker output.
- **Deadlock Recovery**: Dynamically calculates speech timeout (`wordCount * 350 + 1000` ms) to recover from Chromium `speechSynthesis.onend` dropped event bugs.

### B. Global Accessibility Token Injection (`AccessibilityProvider`)
- **Location**: `src/context/AccessibilityContext.tsx`
- **Mechanism**: Rather than recalculating style objects across thousands of DOM nodes, the provider toggles standard CSS classes on `document.documentElement`:
  - `.dark` $\rightarrow$ Activates deep navy `#070B14` and surface `#0F1726` palette.
  - `.high-contrast` $\rightarrow$ Boosts borders and text brightness.
  - `.calm-mode` $\rightarrow$ Softens saturation and disables Framer Motion transforms.
  - `.mobility-mode` $\rightarrow$ Expands click targets to minimum 48px.
  - `.font-dyslexic` $\rightarrow$ Applies OpenDyslexic typography.

### C. AAC Speech Composer
- **Location**: `src/components/speech/SpeechComposer.tsx`
- **Role**: Symbol-based visual communication board allowing non-verbal users to compose and speak phrases instantly.

---

## 5. Developer Guide: "Where Do I Put Code?"

| Task | Correct Location | Reference File |
| :--- | :--- | :--- |
| **Add a new page / route** | `src/pages/NewPage.tsx` | Register inside `src/App.tsx` |
| **Add a new voice command** | `src/utils/voiceCommands.ts` | Add regex rule to `COMMANDS` array |
| **Add a shared UI primitive** | `src/components/ui/` | Follow shadcn / Radix patterns |
| **Add a domain component** | `src/components/ui-custom/` | Keep UI separate from raw speech APIs |
| **Add a new domain type** | `src/types/index.ts` | Export TypeScript interface |
| **Add a new localStorage key** | `src/lib/storageKeys.ts` | Add key to `STORAGE_KEYS` object |
| **Add a backend API route** | `apps/api/src/controllers/` | Register in `apps/api/src/routes/` |

---

## 6. Testing & Quality Verification
Run the following test commands:
```bash
npm run lint    # Runs oxlint across the entire repository (0 errors)
npm run build   # Compiles Vite production bundle
npm test        # Runs Vitest unit test suite (51/51 passing)
```
