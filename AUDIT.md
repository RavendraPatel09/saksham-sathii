# Saksham AI Codebase Audit

This document inventories the frontend state, mock data shapes, local storage bindings, and reusable system infrastructure of Saksham AI.

---

## 1. Mock Data Usage Inventory (`src/data/mockData.ts`)

| Frontend File / Component | Imported Entity | Purpose / Context |
|---|---|---|
| [`src/components/ui-custom/DeadlineBanner.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/components/ui-custom/DeadlineBanner.tsx) | `SAVED_DATA` | Renders upcoming job/course application deadlines. |
| [`src/pages/ApplicationTracker.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/ApplicationTracker.tsx) | `SAVED_DATA`, `ApplicationStatus`, `SavedItem` | Lists job application stages (Applied, Interview, Offer, Rejected) for the user. |
| [`src/pages/Assessment.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Assessment.tsx) | `assessmentQuestions` | Renders a multi-step career assessment. |
| [`src/pages/Dashboard.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Dashboard.tsx) | `SAVED_DATA` | Displays current courses, jobs, saved items, and stats. |
| [`src/pages/Employer.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Employer.tsx) | `candidates` | Lists matching candidates for employer role review. |
| [`src/pages/EmployersDirectory.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/EmployersDirectory.tsx) | `employers` | Displays the list of verified inclusive partner employers. |
| [`src/pages/Jobs.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Jobs.tsx) | `jobs` | Renders recommended job listings. |
| [`src/pages/Learning.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Learning.tsx) | `courses` | Renders learning catalog and user progress. |
| [`src/pages/Mentors.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/Mentors.tsx) | `MENTORS` | Renders list of mentors for disability-inclusive mentorship. |
| [`src/pages/ReservedJobs.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/ReservedJobs.tsx) | `RESERVED_JOBS` | Displays government/PSU jobs reserved under quotas. |
| [`src/pages/SavedItems.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/SavedItems.tsx) | `SAVED_DATA` | Displays all saved jobs, courses, and mentors. |
| [`src/pages/ShareProgress.tsx`](file:///c:/Users/naray/OneDrive/Desktop/Saksham-Ai-main/src/pages/ShareProgress.tsx) | `SAVED_DATA` | Generates tokens to share progress widgets. |

---

## 2. Expected Data Shapes (Interfaces)

These match the structures in `src/data/mockData.ts`. Our backend models and API payloads will preserve these contracts.

### Employer
```typescript
interface Employer {
  id: string;
  name: string;
  diversityScore: number;
  accessibilityScore: number;
  hiringStatus: 'Active' | 'Hiring Paused';
  remoteSupport: boolean;
  logo: string;
}
```

### Job
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  workMode: string;
  requiredSkills: string[];
  accessibility: string[];
  demand: string;
  description: string;
}
```

### Course / CourseProgress
```typescript
interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  progress: number;
  thumbnail: string;
}
```

### AssessmentQuestion
```typescript
interface AssessmentQuestion {
  id: string;
  section: string;
  question: string;
  options: string[];
  answer: string;
}
```

### Candidate
```typescript
interface Candidate {
  id: string;
  name: string;
  disability: string;
  severity: string;
  skills: string[];
  matchScore: number;
}
```

### SavedItem & ApplicationStatus
```typescript
type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

interface SavedItem {
  id: number;
  type: 'job' | 'course' | 'mentor' | 'employer';
  title: string;
  entity: string;
  location: string;
  savedAt: string;
  status?: ApplicationStatus;
  deadline?: string;
}
```

### ReservedJob
```typescript
interface ReservedJob {
  id: number;
  title: string;
  department: string;
  category: string;
  state: string;
  salary: string;
  deadline: string;
  docs: string[];
}
```

### Mentor
```typescript
interface Mentor {
  id: number;
  name: string;
  title: string;
  disability: string;
  careerPath: string;
  experience: string;
  company: string;
  bio: string;
  available: boolean;
  rating: number;
  sessions: number;
  emoji: string;
}
```

---

## 3. LocalStorage Usage Inventory

The frontend reads and writes persistent states across the following keys:

- **Accessibility Configs:**
  - `saksham-accessibility-settings`: Serialized accessibility preference object.
  - `saksham-blind-mode` / `saksham-voice-guidance` / `saksham-voice-enabled`: Voice triggers.
  - `saksham-wizard-completed`: Prevents wizard modal from re-triggering.
- **Search & UI states:**
  - `recentSearches`: Prior search queries list.
  - `saksham-deadline-dismissed`: Toggles whether user dismissed the urgency banners.
- **Workflow State & Credentials:**
  - `workspaceMode`: Stores current user workspace role context (`candidate` \| `employer` \| `accessibility` \| `null`).
  - `candidateProfile`: Profile inputs submitted at registration.
  - `assessmentScores`: Completed career skills profile scores (Strength, Weakness, Confidence, LearningStyle, CareerReadiness).
  - `saksham-offline-mode` / `saksham-last-sync`: Synchronizes browser cache.
  - `saksham-communication-history`: Phrase/speech records.
  - `saksham-feedback-history`: Saved mentor session/interview reviews.
  - `saksham-sos-logs`: Appended emergency trigger time stamps.
  - `saksham-language`: Persistent language locale setting (defaulting to `en`).
  - `saksham-share-token` / `saksham-share-data`: Shareable career progress state.

---

## 4. Architecture: Reusable Elements vs. Placeholders

### Solid & Reusable:
- **Accessibility Layer (`src/accessibility/*`)**: Text-to-speech engine, cognitive adaptation systems, focus controllers, voice recognition handlers, and visual mode overrides (high contrast, text resizing).
- **Internationalization (`src/i18n/*`)**: Multi-lingual translations (English, Hindi, etc.) loaded through a global LanguageContext.
- **UI Components (`src/components/ui/*`)**: Robust standard shadcn/ui controls based on Radix primitives.
- **Client Side Offline Fallback Context (`src/context/OfflineContext.tsx`)**: Decoupled sync tracker.

### Placeholders / Needing Backend and API Wiring:
- **Data persistence**: Directly mutates local state or mock structures on file level.
- **Mock delay blocks (`setTimeout`)**: Simulated AI latency in user profiling, skills scoring, audit review pipelines, interview transcription analysis, document simplifiers, and letter generators.
- **RAG & Vector Lookup**: Hardcoded outputs for job explainer and compliance suggestions.
